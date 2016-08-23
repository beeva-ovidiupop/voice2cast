'use strict';

var _ = require('lodash');
var mdns = require('mdns');
var Client                = require('castv2-client').Client;
var Youtube               = require('castv2-youtube').Youtube;
var Web                   = require('castv2-web').Web;
var DefaultMediaReceiver  = require('castv2-client').DefaultMediaReceiver;

var browser = mdns.createBrowser(mdns.tcp('googlecast'));

exports.findDevices = function(callback){
  var devices = [];
  browser.on('serviceUp', function(service) {
    var newDevice = _.pick(service, ['name', 'host', 'port', 'addresses']);
    newDevice['addresses'] = newDevice['addresses'][0];
    devices.push(newDevice);
  });
  browser.start();

  // 100 milisegundos de búsqueda
  setTimeout(function() {
    browser.stop();
    // Hack?!
    browser = mdns.createBrowser(mdns.tcp('googlecast'));
    callback(_.uniq(devices));
  }, 150);
}

exports.setContent = function setContent(content){
  browser.on('serviceUp', function(host) {
    var client = new Client();
    client.connect(host, function() {
      launchPlayer(client, content);
      client.on('error', function(err) {
        console.log('Error: %s', err.message);
        client.close();
      });
    // ToDo esto no va aquí, mas abajo, al sur
    browser.stop();
    browser = mdns.createBrowser(mdns.tcp('googlecast'));
    });
  });
  browser.start();
}

function launchPlayer(client, content){
  console.log(content);
  if(content.type === 'image' || content.type === 'video')
    launchDefaultMediaPlayer(client, content);
  else if(content.type === 'youtube')
    launchYoutube(client, content);
  else if(content.type === 'web')
    launchWeb(client, content);
  else launchDefaultMediaPlayer(client, {'content': 'http://i.imgur.com/Ql6Dvqa.gif'});
}

function launchWeb(client, content){
  client.launch(Web, function(err, manager) {
    manager.load(content.content);
  });
}

function launchYoutube(client, content){
  client.launch(Youtube, function(err, player) {
    player.load(content.content);
    player.on('status', function(status) {
      console.log('status youtube', status);
    });
  });
}

function launchDefaultMediaPlayer(client, content){
  client.launch(DefaultMediaReceiver, function(err, player){
    var media = {
      // Here you can plug an URL to any mp4, webm, mp3 or jpg file with the proper contentType.
      contentId: content.content,
      // Title and cover displayed while buffering
      metadata: {
        type: 0,
        metadataType: 0,
        title: "OPENLABS",
        images: [
          { url: 'https://pbs.twimg.com/profile_images/452052193198104577/cARTCYW__400x400.png' }
        ]
      }
    };
    player.on('status', function(status) {
      console.log('status broadcast playerState=%s', status.playerState);
    });

    player.load(media, { autoplay: true, loop: 1  }, function(err, status) {
      console.log('media loaded playerState=%s', err, status);
    });
  });
}
