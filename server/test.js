var mysql      = require('mysql');
var restify = require('restify');
var sanitizer = require('sanitizer');
var connection = mysql.createConnection({
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
  connection.query("INSERT INTO Reports (type, notes) VALUES("+mysql.escape(req.body.animal_type)+"," + mysql.escape(req.body.animal_notes) + ");", function(err, results) {
      if(err) 
        res.send(400);
      res.send(200);
      next();
  });

}

function createUser (req, res, next) {
  console.log(req.params.password);
  connection.query("INSERT INTO Users (email, password, org_id) VALUES(" + mysql.escape(req.params.email)+ ", SHA2(" + mysql.escape(req.params.password) + ",256), " + mysql.escape(req.params.org_id) + ");", function(err, results){
    if(err)
      throw err;
    res.send(200);
    next();
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

function test2(req, res, next) {
  var obj = {};
  obj["test"] = 1;
  obj["test2"] = 2;
  res.send(obj);
  next();
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
server.put('/reports', createReport);
server.put('/users', createUser);
server.get('/reports', getReports);
server.get('/test2', test2);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
