## Experiment to cast content on screens trough voice.

We have an Alexa Skill to order proyecting content on Chromecast. It can search videos on youtube, google for webs and image search. We implemented the logic in NodeJS and use AWS Lambda to deploy the code.
Locally we have a tiny server with wifi connectivity also in NodeJS that controls the communication with the Chromecasts. We used a RaspberryPi for that. Also used resin.io to develop and deploy to a container, that also gives us a public exposed url for the rest endpoints.


