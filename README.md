## Experiment to cast content on tv's trough voice.

This is an experiment running at OpenLabs. Uses the Amazon Echo to search content and display it to the screens that run a Chromecast. You can say:
* Alexa, ask master what screens are available
* Alexa, ask the master to google beeva
* Alexa, tell the master to play beeva tech interviews
* Alexa, ask master to search the simpsons on youtube
More example phrases at [SampleUtterances.txt](https://github.com/beeva-labs/voice2cast/blob/master/lambda/speechAssets/SampleUtterances.txt)


## Technology
There are 2 logic parts. First we have a local server that talks to chromecast and sends content, it has 2 REST endpoints, one will return local screens and the other one receives content and displays it to the desired tv (or all). Then we have a Alexa Skills that solves the speaking part for an Amazon Echo.

## Local Server
*The server must be in the local network of the chromecast trough wifi*. It is a NodeJS project running express.js. You can run it anywhere you have a node installed. We used a RaspberryPi. The code is in the root path of the repo.

### Install
`npm install`

### Test
* Start the server `node index.js`
* Test endpoint `curl localhost:3000/screens`

And if you have screens available it will say something like:
`[{"host":"darkcast.local","port":8009,"address":"192.168.2.4","name":"darkcast"}]`

### Raspberry Pi
As said, you can simply use a RaspberryPi 3 or an older one with a WiFi dongle as the server. We used the service resin.io to deploy the app to a container in the RPI. We have a Dockerfile prepared. So if you want to use it that way, you just have to `git push resin master`.

## Alexa Skill
We used an Alexa Skill processing the voice from an Amazon Echo. It's the code available in the lambda folder. Basically it handles user intent, seeks for content and sends it trough the REST API to the local server. You have the full interaction model in the [speechAssets](https://github.com/beeva-labs/voice2cast/tree/master/lambda/speechAssets) folder.

The callback of Alexa is a AWS Lambda function also written in NodeJS. We made a bash script to upload the function trough the aws cli, you may need to change the name of the function. Along with the url of your local server.

### Test
* `npm install`
* `npm install -g lambda-local`
* `lambda-local -l index.js -h handler -e test.json`

If you want to upload it to aws lambda, just `bash upload.sh`
