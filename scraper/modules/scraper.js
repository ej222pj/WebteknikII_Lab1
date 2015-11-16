var promise = require('bluebird');
var request = require("request");
var cheerio = require("cheerio");

var url = "http://localhost:3000";
var firstLinks = [];

var days = [];
var	ok = [];
var name;
var person = {name: name, days: days, ok: ok};

promiseFunc(url)
.then(setCheerio)
.then(getCalendarUrl)
.then(setCheerio)
.then(getPersonLinks)
.then(scrapePersonOkdays)

function setCheerio(html){
	$ = cheerio.load(html);
	return $;
}

function getCalendarUrl($){

	$('a').each(function(i, link){
  		firstLinks.push($(link).attr('href'));
	});

	return promiseFunc(url + firstLinks[0]);
}

function getPersonLinks($){
	var secondLinks = [];
	$('a').each(function(i, link){
		secondLinks.push($(link).attr('href'));
	});

	return secondLinks;
}

function scrapePersonOkdays(secondLinks){
	for(var i = 0; i < secondLinks.length; i++){
		promiseFunc(url + firstLinks[0] + "/" + secondLinks[i])
		.then(setCheerio)
		.then(scrapePerson)					
	}
}

function scrapePerson($) {
	days = [];
	ok = [];
	name;

	$('h2').each(function(i, link) {	
		name = $(link).text();
	});
	$('th').each(function(i, link) {
		days.push($(link).text());
	});
	$('td').each(function(i, link) {
		//Behövs inte förens de är dags att kolla ?
		//if($(link).text().toLowerCase().trim() === "ok"){
		ok.push($(link).text());
		//}
	});

	person = {name: name, days: days, ok: ok};
	console.log(person);
}

function promiseFunc(url) {
    return new promise(function(resolve, reject){
    	request(url, function(err, res, html){
    		if(err) { reject(err); }
    		else { resolve(html) }
    	});
    });
};