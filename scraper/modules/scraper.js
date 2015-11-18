var promise = require('bluebird');
var request = require("request");
var cheerio = require("cheerio");

var url = "http://localhost:3000";
var firstUrls = [];

var personArray = [];
var daysAllAreFree = [];
var whichMovie = [];	

promiseFunc(url)
.then(setCheerio)
.then(getFirstUrls)
.then(setCheerio)
.then(getPersonLinks)
.then(scrapePersonOkdays)
.then(openCinema)
.then(setCheerio)
.then(getDaysAndMovies)
.then(scrapeMovieJson)
.then(getMovieTimesAndPresentThem)

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
	var name;//Onödigt!
	var days = [];
	var okDays = [];

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
			//daysAllAreFree.push(personArray[0].days[0]);//Fredag
			daysAllAreFree.push(1);
	}
	if(personArray[0].okDays[1] === ok 
		&& personArray[1].okDays[1] === ok 
		&& personArray[2].okDays[1] === ok){
			//daysAllAreFree.push(personArray[0].days[1]);//Lördag
			daysAllAreFree.push(2);
	}
	if(personArray[0].okDays[2] === ok 
		&& personArray[1].okDays[2] === ok 
		&& personArray[2].okDays[2] === ok){
			//daysAllAreFree.push(personArray[0].days[2]);//Söndag
			daysAllAreFree.push(3);
	}	
}
//Cinema Functions!
function openCinema() {
	return promiseFunc(url + firstUrls[1]);
}

function getDaysAndMovies($){
	//Ta fram dagarna som matchar
	findMatchingDays();
	var whichDay = [];
	var whichMovieValue = [];

	$('#day').children().each(function(i, link){
   		whichDay.push($(link).attr("value"));
	});

	$('#movie').children().each(function(i, link){
   		whichMovie.push($(link).text());
   		whichMovieValue.push($(link).attr("value"));
	});

	//Ta bort först posten i arrayen
	whichMovie = whichMovie.splice(1, whichMovie.length - 1);
	return whichMovieValue = whichMovieValue.splice(1, whichMovieValue.length - 1);
}

function scrapeMovieJson(whichMovieValue){
	var promises = [];
	var movieStatus = [];

	for(var i = 0; i < daysAllAreFree.length; i++){
		for(var j = 0; j < whichMovieValue.length; j++){
			promises.push(promiseFunc(
				url + firstUrls[1] + "/check?day=0" + 
				daysAllAreFree[i] + "&movie=" + whichMovieValue[j]));
		}
	}
		return promise.map(promises, function (element) {
			movieStatus.push(element);
		})
		.then(function () {
			return movieStatus;
		})
}

function getMovieTimesAndPresentThem(statuses){
	var parsedJson = [];

	for (var i = 0; i < statuses.length; i++) {
		if (statuses[i] !== undefined) {
			parsedJson.push(JSON.parse(statuses[i]));
		}
	}

	var strVar = "";
	strVar += "<ul>";

	for (var i = 0; i < parsedJson.length; i++) {
		for (var j = 0; j < parsedJson[i].length; j++) {
			if (parsedJson[i][j].status === 1) {
				strVar += "<li>Filmen " + whichMovie[parsedJson[i][j].movie.substring(1) - 1] + 
				" går klockan " + parsedJson[i][j].time + "</li>";
			}
		}
	}

	strVar += "</ul>";

	exports.scrape = strVar;	
}

//End Cinema Functions!
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