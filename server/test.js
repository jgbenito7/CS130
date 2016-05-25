var mysql      = require('mysql');
var restify = require('restify');
var sanitizer = require('sanitizer');
var fs = require('fs');
var gm = require('gm').subClass({imageMagick: true});
var randomstring = require("randomstring");
var apns = require('apns'), apn_options, apn_connection, apn_notification;


var geocoderProvider = 'google';
var httpAdapter = 'http';
var extra = {};
var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra );

var apn_options = {
     "cert": "./certs/RescueHero_Cert.pem",
     "key":  "./certs/RescueHero_PK.pem",
     "debug": true,
     "errorCallback": function(err){console.log(err);}
 };

 apn_connection = new apns.Connection(apn_options);


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

  var token = randomstring.generate(255);
  var query = "SELECT id from Orgs WHERE password = SHA2(" + mysql.escape(req.body.orgPassword)+ ", 256);";
  //var query = "SELECT id from Orgs WHERE password = " + mysql.escape(req.body.orgPassword)+ ";";


  connection.query(query, function(err,results) {
    if(results.length == 0) {
      res.send(402); //402 is invalid org password
      next();
      return;
    }
      var org_id = results[0].id;


      var query = "SELECT * FROM Users WHERE email = "
          + mysql.escape(req.body.email) + ";";
      connection.query(query, function(err, results){
          if(results.length > 0) {
            res.send(401); //401 is user already exists
            next();
            return;
          }
          var query2 = "INSERT INTO Users (email, password, org_id, token) VALUES("
            + mysql.escape(req.body.email)+ ", SHA2("
            + mysql.escape(req.body.password) + ",256), "
            + mysql.escape(org_id) +", \"" + token + "\");";
          connection.query(query2, function(err, results){
          if(err)
          throw err;
          res.send({"token":token});
          next();
          return;
      });
      });

    });


}



function getReports (req, res, next){
    var query = "SELECT *, Reports.id as rid, UNIX_TIMESTAMP(time) AS rtime, UNIX_TIMESTAMP(updateTime) AS utime FROM Reports Left JOIN Status ON Reports.id = Status.reportId WHERE Status.mostRecent = 1";
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
		    if(filerows[i].report_id == results[j].rid) {
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



function getStatus(req,res,next)
{
    var query = "SELECT *, UNIX_TIMESTAMP(updateTime) AS etime FROM Status WHERE reportId = " + mysql.escape(req.params.reportId) +" ;";
    connection.query(query, function(err, results){
	if(err)
	    throw err;
	else if(results.length < 1)
	    res.send(408); //no such report exists

	res.send(results);
	next();
    })
}

function updateStatus(req,res,next)
{
  console.log("in update status!");
  var tokenCheckQuery = "SELECT * FROM Users WHERE token = " + mysql.escape(req.params.token) + ";";
  connection.query(tokenCheckQuery, function(err1,results1){
    if(err1)
      throw err1;
    if(results1.length >= 1){
      //Change all current reports to be NOT the most recent
      var query = "UPDATE Status SET mostRecent = 0 WHERE reportId = " + mysql.escape(req.params.reportId) + ";";
      connection.query(query, function(err, results){
      if(err)
        throw err;
      })

      var updateQuery = "INSERT INTO Status (reportId, status, mostRecent) VALUES (" + mysql.escape(req.params.reportId) + ", " +  mysql.escape(req.params.status) + ", 1);";
      connection.query(updateQuery, function(err, results){
        if(err)
          throw err;
        res.send(200);
      })

    } //end valid token
    else {

      console.log("not a valid token");
      res.send(413); //Invalid token
    }

    }) //end tokenCheckQuery
  next();
}


function authorizeUser (req, res, next) {

    var query = "SELECT * FROM Users WHERE password = SHA2(" + mysql.escape(req.body.password) + ", 256) AND email = " + mysql.escape(req.body.email) + ";";
    console.log(query);
    connection.query(query,  function(err, results){
	if (err)
	    throw err;
	else if (results.length < 1)
	    res.send({"loggedIn":false});
	else {
    var newtoken = randomstring.generate(255);
    var updateTokenQuery = "UPDATE Users SET token = \"" + newtoken + "\" WHERE email = " + mysql.escape(req.body.email) + ";";
    connection.query(updateTokenQuery, function(err,reults){
      if(err)
        throw err;
    })
	  res.send({"loggedIn":true, "token":newtoken});
  }
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

	var middle = gm(req.files[i].path).thumb(200, 200, "images/thumb/"+filename, 75, function(err){if(err) console.log(err)});
    }

    //get city
    geocoder.reverse({lat: req.body.latitude, lon:req.body.longitude})
	.then(function(res_city) {

            var city = res_city[0].city;

			var query = "INSERT INTO Reports (type, notes, longitude, latitude, city) VALUES("+
			       mysql.escape(req.body.animal_type)+
			       "," + mysql.escape(req.body.animal_notes) +
			       "," + mysql.escape(parseFloat(req.body.longitude)) +
			       "," + mysql.escape(parseFloat(req.body.latitude)) +
			       "," + mysql.escape(city) + ");"


	      connection.query(query, function(err, results) {
				   if(err){
				   		console.log("error");
				       throw err;
				    }
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

				       connection.query(queryString, function(err, results3) {
					   if(err){
					       throw err;
					   }
					   res.send(200);
					   next();
				       });
				   } else {
				       res.send(200);
				       next();
				   }

				   var reportQuery = "INSERT INTO Status (reportId, status, mostRecent) VALUES (" + insertId + ", \'Reported\', 1);";
				   connection.query(reportQuery, function(err, results) {
				       if(err)
					   throw err;
				   })
			       })
	     })
    .catch(function(err) {
        res.send(415); //Not a valid longitude and latitude
    });

}

function getCorrectOrg(req,res,next) {
    var city = mysql.escape(req.params.city);

    var query = "SELECT * FROM Orgs WHERE city = " + city + ";";

    connection.query(query, function(err,results){
	if(err)
	    throw err;
	else if(results.length < 1)
	    res.send(411); //No registered organizations in that city

	res.send(results);
	next();
    })

}

function getRescuers(req,res,next) {
    var city = mysql.escape(req.params.city);
    var query = "SELECT * FROM Users WHERE org_id = (SELECT id FROM Orgs WHERE city = " + city + ");";
    connection.query(query, function(err,results){
	if(err)
	    throw err;
	else if(results.length < 1)
	    res.send(411); //No registered organizations in that city

	res.send(results);
	next();
    })

}


function rebootServer(req, res, next) {
    const exec = require('child_process').exec;
    const child = exec('git pull origin master; forever restartall;',
		       function(error, stdout, stderr) {
			   console.log('stdout: ${stdout}');
		       }
		      );
}

function testApn(req,res,next){
  apn_notification = new apns.Notification();
  apn_notification.device = new apns.Device("3a9fb42ed9edd7aa2e573a30e843bb18760d326fb53d7e82dd5755dcc82e68b9");
  apn_notification.alert = "Hello World !";

  apn_connection.sendNotification(apn_notification);
  res.send(200);
  return next();

}


var server = restify.createServer(ssl);
//var server = restify.createServer();
server.use(function crossOrigin(req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
});

server.use(restify.bodyParser ({mapParams: false,
				multiples: true}));

server.get('/getCorrectOrg/:city', getCorrectOrg);
server.get('/getRescuers/:city', getRescuers);
server.get('/getStatus/:reportId', getStatus);
server.put('/updateStatus/:reportId/:status/:token', updateStatus);
server.post('/users', createUser);
server.get('/reboot/rescuehero', rebootServer);
server.get('/reports', getReports);
server.post('/users/authorize', authorizeUser);
server.post('/reports', createReport);
server.get('/testapn', testApn);
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
