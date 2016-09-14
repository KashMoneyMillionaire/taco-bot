// var express = require('express');
// var mongoose = require('mongoose');

// var PORT = process.env.PORT || 9000;
// var app = express();

// mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGO_URL);

// app.use('', require('./api'));

// app.listen(PORT);

var restify = require('restify');
var builder = require('botbuilder');
var config = require('./config');

// Setup Restify Server
var server = restify.createServer();
server.listen(config.port, function () {});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: config.microsoft.appId,
    appPassword: config.microsoft.appPassword
});

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

bot.dialog('/', function (session) {
    session.send("Hello World");
});
