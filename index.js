'use strict'

var express = require('express');
var bodyParser = require('body-parser')

var app = express();
var controller = require('./controller');

app.use(bodyParser.json())
app.get('/screens', controller.screens);
app.post('/content', controller.content);

app.listen(3000);
