var promise = require('promise');
var request = require("request");
var cheerio = require("cheerio");

var url = "http://localhost:8080";
var links = [];

promiseFunc(url)
	.then(function(html){

		var $ = cheerio.load(html);
		//var links = [];

		$('a').each(function(i, link){
      		console.log($(link).attr('href'));

      		links.push($(link).attr('href'));
    	});

		openLinks(links[0])

		exports.scrape = links;
	});

function openLinks(partialHref){
	var fullHref = url + partialHref;

	promiseFunc(fullHref).then(function(html){
		var $ = cheerio.load(html);

		switch(partialHref){
			case links[0]:
				console.log("Cal");				

				$('ul').each(function(i, link){
					var data = $(this);
					console.log(data.first().text());	
					exports.scrape = data.first().text();
		    	});

//				exports.scrape = ;
				break;
			case links[1]:
				console.log("Cin");
				break;
			case links[2]:
				console.log("Din");
				break;
		}
	});
}

function promiseFunc(url) {
    return new promise(function (resolve, reject) {
        request(url, function (err, res, html) {
            resolve(html);
        });
    });
}