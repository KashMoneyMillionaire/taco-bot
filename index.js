var express = require('express');
var mongoose = require('mongoose');

var PORT = process.env.PORT || 9000;
var app = express();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL);

app.use('/api', require('./api'));

app.listen(PORT);
