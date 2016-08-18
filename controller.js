'use strict';

var cast = require('./cast');

exports.screens = function(req, res) {
  cast.findDevices(function(devices){
    res.send(devices);
  })
}

exports.content = function(req, res) {
    var content = req.body;
    cast.setContent(content);
    res.send({'message': 'Will try our best...'});
}
