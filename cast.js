'use strict';

var _ = require('lodash');
var mdns = require('mdns-js');
var Client                = require('castv2-client').Client;
var Youtube               = require('castv2-youtube').Youtube;
var Web                   = require('castv2-web').Web;
var DefaultMediaReceiver  = require('castv2-client').DefaultMediaReceiver;

var devices = {};
var curatedDevices = [];

var browser = mdns.createBrowser('_googlecast._tcp');

browser.once('ready', function () {
  console.log('ready');
    browser.discover();
});

browser.on('update', function (data) {
    if(!devices[data.addresses[0]] && data.type[0].name === 'googlecast'){
      devices[data.addresses[0]] = data;
      var newDevice = _.pick(data, ['host', 'port']);
      newDevice['address'] = data.addresses[0];
      if(data['host']){
        newDevice['name'] =  data['host'].replace('.local','');
        curatedDevices.push(newDevice);
      }
    }
});

exports.findDevices = function(callback){
  callback(curatedDevices);
}

exports.setContent = function setContent(content){
  var filteredDevices = [];
  if(content.screen){
    curatedDevices.forEach(function(item){
      if(item.name.toLowerCase().indexOf(content.screen.toLowerCase()) > -1){
        filteredDevices.push(item);
      }
    });
  }
  else filteredDevices = curatedDevices.slice(0);
  filteredDevices.forEach(function(item){
    var client = new Client();
    client.connect(item.address, function() {
      launchPlayer(client, content);
      client.on('error', function(err) {
        console.log('Error: %s', err.message);
        client.close();
      });
    });
  });
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
  content.content = 'https://www.youtube.com/embed/' + youtube_parser(content.content) + '?autoplay=1&controls=0&modestbranding=1&iv_load_policy=3&loop=1';
  client.launch(Web, function(err, manager) {
    manager.load(content.content);
  });
}

function youtube_parser(url){
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match&&match[7].length==11)? match[7] : false;
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
