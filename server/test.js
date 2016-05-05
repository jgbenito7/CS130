var mysql      = require('mysql');
var restify = require('restify');
var sanitizer = require('sanitizer');
var fs = require('fs');

var connection  = mysql.createPool({
  connectionLimit : 10,
  host  : 'localhost',
  user  : 'root',
  password  : 'root',
  database  : 'cs130',
  port  : 3306
});

// Insert animal into Reports table
function createReport (req, res, next) {
  connection.query("INSERT INTO Reports (type, notes, longitude, latitude) VALUES("+
    mysql.escape(req.body.animal_type)+
    "," + mysql.escape(req.body.animal_notes) + 
    "," + mysql.escape(parseFloat(req.body.longitude)) +
    ","+mysql.escape(parseFloat(req.body.latitude)) + ");", function(err, results) {
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

function testFileUpload(req, res, next) {
  var filenames = [];
  var counter = 0;
  for(i in req.files) {
    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(req.files[i].name);
    if(ext == undefined)
      continue; //no file extension should throw an alarm
    var filename = (new Date).getTime() + counter + "." + ext[1];
    counter++;
    filenames.push(filename);
    fs.createReadStream(req.files[i].path).pipe(fs.createWriteStream("images/" + filename));
  }
  console.log(filenames); //insert into 
  connection.query("INSERT INTO Reports (type, notes, longitude, latitude) VALUES("+
    mysql.escape(req.body.animal_type)+
    "," + mysql.escape(req.body.animal_notes) + 
    "," + mysql.escape(parseFloat(req.body.longitude)) +
    ","+mysql.escape(parseFloat(req.body.latitude)) + ");", function(err, results) {
      if(err) 
        throw err;
      if(filenames.length > 0) {
        connection.query("SET @lastid = LAST_INSERT_ID();", function(err, results) {
          if(err) {
            console.log(err);
            throw err;
          }
          var queryString = "INSERT INTO filename (report_id, filename) VALUES ";
          for(var i = 0; i < filenames.length; i++) {
            queryString += " (@lastid, " + filenames[i] + ")";
            if(i != filenames.length - 1) {
              queryString += ", ";
            } else {
              queryString += ";"
            }
          }

          console.log(queryString);

          connection.query(queryString, function(err, results) {
            if(err)
              throw err;
            res.send(200);
            next();
          });
        });
    } else {
      res.send(200);
      next();
    }
  });
  
}

var server = restify.createServer();
server.use(function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
  });

server.use(restify.bodyParser ({mapParams: false,
    multiples: true}));

//server.get('/reports/create/:animal_type/:animal_notes', createReport);
//server.get('/users/create/:email/:org_id/:password', createUser);
server.post('/reports', createReport);
server.post('/users', createUser);
server.get('/reports', getReports);
server.post('/users/authorize', authorizeUser);
server.post('/testfile', testFileUpload);
server.get(/\/images\/?.*/, restify.serveStatic({
    directory: __dirname
}));
server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});