
var restify = require('restify');
var builder = require('botbuilder');
var config = require('./config');

// Setup Restify Server
var server = restify.createServer();
server.listen(config.port, function () { });

// Create chat bot
var connector = new builder.ChatConnector({
    appId: config.microsoft.appId,
    appPassword: config.microsoft.appPassword
});

var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

bot.dialog('/', function (session) {
    console.log('received message: ' + session.message.source);
    console.log(session.message.address.channelId);
    console.log(session.message.address.serviceUrl);
    session.send("Hello World");
    console.log('response sent');
});
