var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var jwt    = require('jsonwebtoken');

var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var pipefile = require('./routes/pipefile');
var swagger = require("swagger-node-express");
var argv = require('minimist')(process.argv.slice(2));
var fs = require("fs");
var app = express();
var subpath = express();

app.set('port', process.env.PORT || 3000);
app.set('host', process.env.IP || 'localhost');

var app = express();
var fs = require("fs");

app.set('port', process.env.PORT || 3000);
app.set('host', process.env.IP || 'localhost');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('common', {
    stream: fs.createWriteStream('./access.log', {flags: 'a'})
}));
app.use(morgan("dev"));
app.use(require("./controller/index"));
app.use("/web", express.static("./frontEnd"));
app.use("/api", subpath);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('dist'));
swagger.setAppHandler(subpath);

swagger.setApiInfo({
    title: "Fundoo HR API",
    description: "",
    termsOfServiceUrl: "",
    contact: "admin@bridgelabz.com",
    license: "",
    licenseUrl: ""
});


subpath.get('/', function (req, res) {
    res.sendfile(__dirname + '/dist/index.html');
});

swagger.configureSwaggerPaths('', 'api-docs', '');

var domain = 'localhost';
if(argv.domain !== undefined)
    domain = argv.domain;
else
    console.log('No --domain=xxx specified, taking default hostname "localhost".');

// var applicationUrl = 'http://' + domain + ':' + app.get('port');
var applicationUrl = 'http://' + domain;
swagger.configure(applicationUrl, '1.0.0');

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
