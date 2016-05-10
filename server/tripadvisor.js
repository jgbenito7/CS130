var mysql      = require('mysql');
var restify = require('restify');
var sanitizer = require('sanitizer');
var connection = mysql.createConnection({
  host  : 'localhost',
  user  : 'root',
  password  : 'root',
  database  : 'LAHacks2016',
  port  : 3306
});

function test1(req, res, next) {
  console.log(req.params.amount);
  res.send("Hello 1");
  next();
}


function createUser (req, res, next) {
  console.log(req.params.password);



      var query = "SELECT * FROM Users WHERE email = " + mysql.escape(req.body.email) + ";"
      connection.query(query, function(err, results){
          if(results.length > 0) {
            res.send(401); //401 is user already exists
            next();
            return;
          }
          connection.query("INSERT INTO Users (name, email, password));", function(err, results){
          if(err)
          throw err;
          res.send(200);
          next();
          return;
      });
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

server.post('/users', createUser);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
