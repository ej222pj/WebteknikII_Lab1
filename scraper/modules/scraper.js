var promise = require('promise');
var request = require("request");
var cheerio = require("cheerio");

var url = "http://localhost:3000/";
var firstLinks = [];
var secondLinks = [];

promiseFunc(url).then(function(html){
	//Remove Last / sign
	url = url.substring(0, url.length - 1);
	getUrl(url);
});

function getUrl(url){
	promiseFunc(url).then(function(html){
		var $ = cheerio.load(html);

		$('a').each(function(i, link){
      		console.log($(link).attr('href'));

      		firstLinks.push($(link).attr('href'));
    	});

		openFirstLinks(firstLinks[0])
	});
}

function openFirstLinks(partialHref){
	var fullHref = url + partialHref;

	promiseFunc(fullHref).then(function(html){
		var $ = cheerio.load(html);

		$('a').each(function(i, link){
			console.log($(link).attr('href'));
			secondLinks.push($(link).attr('href'));
		});

		switch(partialHref){
			case firstLinks[0]:
				console.log("Cal");			
				openPersonLinks(fullHref, secondLinks, html);
				console.log(paulOkDays);
				exports.scrape = secondLinks[0];
				break;
			case firstLinks[1]:
				console.log("Cin");
				exports.scrape = secondLinks[1];
				break;
			case firstLinks[2]:
				console.log("Din");
				exports.scrape = secondLinks[2];
				break;
		}
	});
}

function openPersonLinks(currentUrl, partialHref, html){
	//var fullHref = currentUrl + "/" + partialHref;
	var persons = [];
	
	var pr = new promise(function (resolve, reject){
		for (var i = 0; i < partialHref.length; i++) {
			promiseFunc(currentUrl + "/" + partialHref[i])

				persons.push(scrapePerson(html));
				//console.log(personLinks[i]);
				resolve(scrapePerson(html));
		}
	});

	pr.then(function(){
		//console.log(persons);
	})

	/*promiseFunc(fullHref).then(function(html){
		var $ = cheerio.load(html);

				$('td').each(function(i, link) {
					okeyDays.push($(link).text());
				});		
				console.log(okeyDays);	
	});

	return okeyDays;
*/
}

function scrapePerson(html) {
	var days = [];
	var ok = [];
	var name;
	console.log(html);

		$('h2').each(function(i, link) {
			console.log($(link).text());	
    		//name = $(link).text();
		});
			//name = $(link).text();
			//console.log(name);	

	 //= getHtml.getElementsText(getHtml.getElements(html, "h2", false));
	//days = getHtml.getElementsText(getHtml.getElements(html, "thead tr th", false));
	//ok = getHtml.getElementsText(getHtml.getElements(html, "tbody tr td", false));

	//var person = {name: name, days: days, ok: ok};

	//return person;
}

function getOkDays(days, ok) {

	var okDays = [];
	for (var i = 0; i < days.length; i++) {
		if(ok[i].toLowerCase().trim() === "ok"){
			okDays[i] = true;
		} else {
			okDays[i] = false;
		}
	}
}

function promiseFunc(url) {
    return new promise(function (resolve, reject) {
        request(url, function (err, res, html) {
            resolve(html);
        });
    });
}