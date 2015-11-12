var promise = require('promise');
var promise = require("promise");
var request = require("request");
var cheerio = require("cheerio");

var url = "http://localhost:8080";

requestp(url)
	.then(function(html){

		var $ = cheerio.load(html);
		var links = "<li>";

		$('ol').children().each(function() {
			var data = $(this);
			console.log(data.children().first().text());	
		})

		exports.scrape = links;
	});

function requestp(url) {
    return new promise(function (resolve, reject) {
        request(url, function (err, res, html) {
            resolve(html);
        });
    });
}