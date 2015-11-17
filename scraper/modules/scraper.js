var promise = require('bluebird');
var request = require("request");
var cheerio = require("cheerio");

var url = "http://localhost:3000";
var firstUrls = [];

var personArray = [];
var daysAllAreFree = [];

promiseFunc(url)
.then(setCheerio)
.then(getFirstUrls)
.then(setCheerio)
.then(getPersonLinks)
.then(scrapePersonOkdays)
.then(openCinema)
.then(setCheerio)
.then(nextStep)

//Person Functions!
function getFirstUrls($){

	$('a').each(function(i, link){
  		firstUrls.push($(link).attr('href'));
	});

	return promiseFunc(url + firstUrls[0]);
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
		promiseFunc(url + firstUrls[0] + "/" + secondLinks[i])
		.then(setCheerio)
		.then(scrapePerson)				
	}
}

function scrapePerson($) {
	var days = [];
	var okDays = [];
	var name;//Onödigt!

	$('h2').each(function(i, link) {	
		name = $(link).text();
	});
	$('th').each(function(i, link) {
		days.push($(link).text());
	});
	$('td').each(function(i, link) {
		okDays.push($(link).text().toLowerCase());
	});
	var person = {name: name, days: days, okDays: okDays};
	personArray.push(person);
}
//End Person Functions!
function findMatchingDays(){
	var ok = "ok";

	if(personArray[0].okDays[0] === ok 
		&& personArray[1].okDays[0] === ok 
		&& personArray[2].okDays[0] === ok){
		daysAllAreFree.push(personArray[0].days[0]);//Fredag
	}
	if(personArray[0].okDays[1] === ok 
		&& personArray[1].okDays[1] === ok 
		&& personArray[2].okDays[1] === ok){
			daysAllAreFree.push(personArray[0].days[1]);//Lördag
	}
	if(personArray[0].okDays[2] === ok 
		&& personArray[1].okDays[2] === ok 
		&& personArray[2].okDays[2] === ok){
		daysAllAreFree.push(personArray[0].days[2]);//Söndag
	}	
	console.log(personArray);
}
//Cinema Functions
function openCinema() {
	return promiseFunc(url + firstUrls[1]);
}

function nextStep($){
	findMatchingDays();
}
//End Cinema Functions
function setCheerio(html){
	$ = cheerio.load(html);
	return $;
}


function promiseFunc(url) {
    return new promise(function(resolve, reject){
    	request(url, function(err, res, html){
    		if(err) { reject(err); }
    		else { resolve(html) }
    	});
    });
};