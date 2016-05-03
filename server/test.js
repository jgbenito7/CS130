var mysql      = require('mysql');
var restify = require('restify');
var sanitizer = require('sanitizer');

var connection  = mysql.createPool({
  connectionLimit : 10,
  host  : 'localhost',
  user  : 'root',
  password  : 'root',
  database  : 'cs130',
  port  : 3306
});


function test1(req, res, next) {
  console.log(req.params.amount);
  res.send("Hello 1");
  next();
}

// Insert animal into Reports table
function createReport (req, res, next) {
  console.log(req);
  connection.query("INSERT INTO Reports (type, notes, long, lat) VALUES("+
    mysql.escape(req.body.animal_type)+
    "," + mysql.escape(req.body.animal_notes) + 
    "," + mysql.escape(double(req.body.long)) +
    ","+mysql.escape(double(req.body.lat)) + ");", function(err, results) {
      if(err) 
        throw err;
      res.send(200);
      next();
  });

}

function createUser (req, res, next) {
  console.log(req.params.password);

  var query = "SELECT id from Orgs WHERE password = SHA2(" + mysql.escape(req.body.orgPassword)+ ", 256);";
  connection.query(query, function(err,results) {
    if(results.length == 0) {
      res.send(402); //402 is invalid org password
      next();
      return;
    }
      var org_id = results[0].id;


      var query = "SELECT * FROM Users WHERE email = " + mysql.escape(req.body.email) + ";"
      connection.query(query, function(err, results){
          if(results.length > 0) {
            res.send(401); //401 is user already exists
            next();
            return;
          }
          connection.query("INSERT INTO Users (email, password, org_id) VALUES(" + mysql.escape(req.body.email)+ ", SHA2(" + mysql.escape(req.body.password) + ",256), " + mysql.escape(org_id) + ");", function(err, results){
          if(err)
          throw err;
          res.send(200);
          next();
          return;
      });
      });
    });


}



function getReports (req, res, next){
  var query = "SELECT * FROM Reports";
  connection.query(query, function(err,rows) {
    if (err) throw err;
    res.send(rows);
    next();
    }
  );
}

function authorizeUser (req, res, next) {
  var query = "SELECT * FROM Users WHERE password = " + mysql.escape(req.body.password) + " AND email = " + mysql.escape(req.body.email) + ";";
  connection.query(query,  function(err, results){
    console.log(query);
    if (err)
      throw err;
    else if (results.length < 1)
      res.send({loggedIn:false});
    else 
      res.send({loggedIn:true});
    next();
});

}


var server = restify.createServer();
server.use(function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
  });

server.use(restify.bodyParser ({mapParams: false}));

//server.get('/reports/create/:animal_type/:animal_notes', createReport);
//server.get('/users/create/:email/:org_id/:password', createUser);
server.post('/reports', createReport);
server.post('/users', createUser);
server.get('/reports', getReports);
server.post('/users/authorize', authorizeUser)

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
