module.exports = function(app) {
	var handlebars = require('express-handlebars')
			.create({deafultLayour: 'main'});
	app.engine('handlebars', handlebars.engine);
	app.set('view engine', 'handlebars');

	app.set('port', process.env.PORT || 3030);
}