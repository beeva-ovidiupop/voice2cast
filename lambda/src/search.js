'use strict';

var google = require('google');
var search = require('youtube-search');
var Scraper = require ('images-scraper')
 , bing = new Scraper.Bing();
google.resultsPerPage = 1;

exports.search = function(query, querySource, callback){
	if(querySource === 'web' || querySource == 'google')
		searchWeb(query, callback);
	else if(_.indexOf(['image', 'images', 'picture', 'pictures', 'flickr'], querySource) >= 0){
		searchImage(query, callback);
	}
	else if( querySource == 'youtube' ) searchVideo(query, callback)
	else callback(undefined, {'type': 'image', 'content': 'http://i.imgur.com/Ql6Dvqa.jpg' })
};

function searchWeb(query, callback){
	google(query, function (err, res){
	  if (err || res.links.length < 1) {
	  	console.error(err);
	  	callback(err)
	  }
	  var returnData = {'type': 'web', 'content': res.links[0].href}
	  callback(undefined, returnData);
	})
}
function searchImage(name,callback){
	bing.list({
	    keyword: 'name',
	    num: 3
	}).then(function (res) {
		var returnData = {'type': 'image', 'content': res[0].url}
	    callback(undefined, res)
	}).catch(function(err) {
	    console.error(err)
	    callback(err)
	})
}

function searchVideo(term, callback){
	var opts = {
	  maxResults: 10,
	  key: 'AIzaSyBsp2PzLbU-3tJTUxGHfna9f8Xu608gGt0'
	};
	search(term, opts, function(err, results) {
	  if( err || results < 1 ) {
	  	console.error(err)
	  	callback(err)
	  }
	  var returnData = {'type': 'youtube', 'content': results[0].link}
	  callback(undefined, returnData)
	});
}
