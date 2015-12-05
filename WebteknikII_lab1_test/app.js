"use strict";

var server;

var express = require('express');

process.env.NODE_ENV = process.env.NODE_ENV || "production";

// read configuration and routes
var config = require("./config/config.js");
var app = express();
require("./config/express")(app);
require('./routes')(app);


var port = app.get('port');

// the http server starts
server = app.listen(config.port, function() {
    console.log("Started on localhost:", server.address().port);
});
