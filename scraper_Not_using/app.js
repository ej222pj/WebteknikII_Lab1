var express = require('express');
var app = express();

// read configuration and routes
require('./modules/routes')(app);
require('./modules/config')(app);

var port = app.get('port');

app.listen(port, function() {
	console.log('Started on localhost: ' + port);
})