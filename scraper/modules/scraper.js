var promise = require('promise');
var promise = require("promise");
var request = require("request");
var cheerio = require("cheerio");

var url = "http://localhost:8080";

requestp(url)
	.then(function(html){

		var $ = cheerio.load(html);
		var links = [];

		$('a').each(function(i, link){
      		var a = $(this).next();
      		console.log($(link).attr('href'));

      		links.push($(link).attr('href'));
    	});

		exports.scrape = links;
	});

function requestp(url) {
    return new promise(function (resolve, reject) {
        request(url, function (err, res, html) {
            resolve(html);
        });
    });
}