var mysql      = require('mysql');
var restify = require('restify');
var sanitizer = require('sanitizer');

function test1(req, res, next) {
  console.log(req.params.amount);
    //write to parking table time of park
  res.send("Hello 1");
  next();
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

server.use(restify.jsonp());
server.use(restify.bodyParser());
server.get('/test1', test1);
server.get('/test2', test2);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
