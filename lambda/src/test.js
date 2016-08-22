var request = require('request');
var _ = require('underscore');

var google = require('google');

if(false)
	console.log('false');
else if(_.indexOf(['image', 'images', 'picture', 'pictures'], ['image']))
	console.log('Science bitch!');
else
	console.log('no Science no bitches');

console.log(_.find(['image', 'images', 'picture', 'pictures'], 'image'));