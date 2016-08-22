var request = require('request');
var _ = require('underscore');

var google = require('google');

var search = require('youtube-search');
 
var opts = {
  maxResults: 10,
  key: 'AIzaSyBsp2PzLbU-3tJTUxGHfna9f8Xu608gGt0'
};
 
search('macarena', opts, function(err, results) {
  if(err) return console.log(err);
 
  console.dir(results);
});