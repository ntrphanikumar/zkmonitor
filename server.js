// Require Modules
var express = require('express');
var zk = require('./modules/watch');

var zkByEnv = {
    'stage': zk('zk-1.stage.quixey.com:2181'),
    'canary': zk('zookeeper.canary.quixey.com:2181'),
    'prod': zk('zookeeper.prod.quixey.com:2181')
};

var app = express();
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

app.get("/services", function(req, res) {
    zkByEnv[req.query.env].services("/services/"+req.query.env, jsonArrayResponse(res));
});

app.get("/instances", function(req, res) {
    zkByEnv[req.query.env].services("/services/"+req.query.env+"/"+req.query.service, jsonArrayResponse(res));
});

app.get("/instance", function(req, res) {
    zkByEnv[req.query.env].getData("/services/"+req.query.env+"/"+req.query.service+'/'+req.query.instance, jsonDataResponse(res));
});

var jsonDataResponse = function(res) {
    return function(jsonData) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(jsonData+"");
        res.end();
    }
};

var jsonArrayResponse = function(res) {
    return function(jsonData) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify((jsonData+"").split(',')));
        res.end();
    }
};

app.listen(8081);
console.log("Server listening on: http://localhost:%s", 8081);