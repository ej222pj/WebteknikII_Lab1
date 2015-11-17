var promise = require('bluebird');
var request = require("request");
var cheerio = require("cheerio");

var url = "http://localhost:3000";
var firstUrls = [];

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
		//Behövs inte förens de är dags att kolla ? /Lättare att spara på detta sättet
		//if($(link).text().toLowerCase().trim() === "ok"){
		okDays.push($(link).text());
		//}
	});

	var person = {name: name, days: days, okDays: okDays};

	findMatchingDays(person);
}

function findMatchingDays(person){
	var ok = [];
	var okk = [];
	var okkk = [];
	var count = 0;
	for (var key in person) {
		//console.log(key + ' => ' + person[key]);
		if(key === "okDays" && count === 0){
			ok = person[key];
			console.log(ok);
		}
		if(key === "okDays" && count === 1){
			okk = person[key];
			console.log(okk);
		}
		if(key === "okDays" && count === 2){
			okkk = person[key];
			console.log(okkk);
		}
	count++;
	}

console.log(ok);

	/*if(ok[0].toLowerCase() === "ok" 
		&& okk[0].toLowerCase() === "ok" 
		&& okkk[0].toLowerCase() === "ok"){
		console.log("0");
	}
	if(ok[1].toLowerCase() === "ok" 
		&& okk[1].toLowerCase() === "ok" 
		&& okkk[1].toLowerCase() === "ok"){
		console.log("1");
	}
	if(ok[2].toLowerCase() === "ok" 
		&& okk[2].toLowerCase() === "ok" 
		&& okkk[2].toLowerCase() === "ok"){
		console.log("2");
	}
	*/
}
//End Person Functions!

function setCheerio(html){
	$ = cheerio.load(html);
	return $;
}


function openCinema() {
	return promiseFunc(url + firstUrls[1]);
}

function nextStep($){
	console.log("nextStep")
}

function promiseFunc(url) {
    return new promise(function(resolve, reject){
    	request(url, function(err, res, html){
    		if(err) { reject(err); }
    		else { resolve(html) }
    	});
    });
};