/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, tell Greeter to say hello"
 *  Alexa: "Hello World!"
 */

/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');
var request = require('request');
var search = require('./search');

var BASE_URL = 'RANDOM LOCAL SERVER URL';
var okayMessages = [
  "I will do my best",
  "I may try it",
  "Hey, you ask to much!",
  "I may show you something",
  "Okay Mr Policeman",
  "Leave me alone",
  "Whatever",
  "I am not your slave",
  "Okay",
  "Done anything else?"
];

/**
 * HelloWorld is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var HelloWorld = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
HelloWorld.prototype = Object.create(AlexaSkill.prototype);
HelloWorld.prototype.constructor = HelloWorld;

HelloWorld.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("HelloWorld onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

HelloWorld.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("HelloWorld onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to the Alexa Skills Kit, you can say hello";
    var repromptText = "You can say hello";
    response.ask(speechOutput, repromptText);
};

HelloWorld.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("HelloWorld onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

HelloWorld.prototype.intentHandlers = {
    // register custom intent handlers
    "screenIntent": function (intent, session, response) {
        console.log(intent)
        request.get(BASE_URL + '/screens', function(error, resp, body) {
            var screens = JSON.parse(body);
            if(screens.length < 1) response.tell("you don't tvs, you poor motherfucker");
            screens = screens.map(function(item){ return item.name });
            var message = 'You have ' + screens.length + ' tvs.' + screens.join(',');
            response.tell(message);
      })
    },
    "sendContentIntent": function (intent, session, response) {
        if(intent.slots.Search) var query = intent.slots.Search.value;
        if(intent.slots.Source) var querySource = intent.slots.Source.value;
        console.log(query, querySource);
        search.search(query, querySource, function(err, content){
            console.log('search', err, content);
            if(err) content = {'type': 'image', 'content': 'http://i.imgur.com/Ql6Dvqa.jpg' };
            request.post({
                url: BASE_URL + '/content',
                json: content
            },
            function(error, resp, body){
              response.tell(choose(okayMessages));
            });
        });
    },
    "playIntent": function (intent, session, response) {
      if(intent.slots.Search) var query = intent.slots.Search.value;
      search.youtube(query, function(err, content){
          console.log('search', err, content);
          if(err) content = {'type': 'image', 'content': 'http://i.imgur.com/Ql6Dvqa.jpg' };
          request.post({
              url: BASE_URL + '/content',
              json: content
          },
          function(error, resp, body){
            var messages = [];
              response.tell(choose(okayMessages));
          });
      });
    },
    "webIntent": function (intent, session, response) {
      if(intent.slots.Search) var query = intent.slots.Search.value;
      search.web(query, function(err, content){
          console.log('search', err, content);
          if(err) content = {'type': 'image', 'content': 'http://i.imgur.com/Ql6Dvqa.jpg' };
          request.post({
              url: BASE_URL + '/content',
              json: content
          },
          function(error, resp, body){
            var messages = [];
              response.tell(choose(okayMessages));
          });
      });
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can say hello to me!", "You can say hello to me!");
    }
};

function choose(choices) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the HelloWorld skill.
    var helloWorld = new HelloWorld();
    helloWorld.execute(event, context);
};
