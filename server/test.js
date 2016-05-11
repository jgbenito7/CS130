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

var ssl = {
    key: fs.readFileSync('./certs/rescuehero.key', 'utf8'),
    cert: fs.readFileSync('./certs/ssl.crt', 'utf8'),
};

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
  var query = "SELECT *, UNIX_TIMESTAMP(time) AS etime FROM Reports";
  connection.query(query, function(err,rows) {
    if (err) throw err;
    var results = rows;
    for(var i = 0; i < results.length; i++) {
      results[i].files = [];
    }
    var filesystem = "SELECT * FROM filename";
    connection.query(filesystem, function(err, filerows) {
      for(var i = 0; i < filerows.length; i++) {
        for(var j = 0; j < results.length; j++) {
          if(filerows[i].report_id == results[j].id) {
            results[j].files.push(filerows[i].filename);
          }
        }
      }
      res.send(results);
    });

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

function createReport(req, res, next) {
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
      var insertId = results.insertId; 
      if(filenames.length > 0) {
        var queryString = "INSERT INTO filename (report_id, filename) VALUES ";
        for(var i = 0; i < filenames.length; i++) {
          queryString += " ("+insertId + ", '" + filenames[i] + "')";
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
    } else {
      res.send(200);
      next();
    }
  });
  
}
function rebootServer(req, res, next) {
  const exec = require('child_process').exec;
  const child = exec('git pull origin master; forever restartall;',
    function(error, stdout, stderr) {
      console.log('stdout: ${stdout}');
      }
  );
}

var server = restify.createServer(ssl);
server.use(function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
  });

server.use(restify.bodyParser ({mapParams: false,
    multiples: true}));

//server.get('/reports/create/:animal_type/:animal_notes', createReport);
//server.get('/users/create/:email/:org_id/:password', createUser);
server.post('/users', createUser);
server.get('/reboot/rescuehero', rebootServer);
server.get('/reports', getReports);
server.post('/users/authorize', authorizeUser);
server.post('/reports', createReport);
server.get(/\/images\/?.*/, restify.serveStatic({
    directory: __dirname
}));
server.get(/\/?.*/, restify.serveStatic({
  directory: '../website',
  default: 'index.html'
}));

server.listen(8001, function() {
  console.log('%s listening at %s', server.name, server.url);
});

// Redirect from http port 80 to https
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(8080);