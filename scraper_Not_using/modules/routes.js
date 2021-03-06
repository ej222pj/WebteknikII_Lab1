var scraper = require('./../modules/scraper.js');


// regex instead of repeating app.get for /, home and index
module.exports = function(app) {
	app.get('/:var(home|index)?', function(req, res) {
		res.render('home');
	});
	
	app.get('/scraper', function(req, res) {
		res.render('home', {
			scrape: scraper.scrape
		});
	});


	app.use(function(req, res) {
		res.type('text/plain');
		res.status(404);
		res.send('404 - not found');
	});
}