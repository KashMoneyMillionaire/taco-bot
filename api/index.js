'use strict';

var express = require('express');
var router = express.Router();

var Person = require('../models/person');

router.get('/init', function (req, res, next) {
    var person = new Person({
        name: 'Kash',
        phoneNumber: '940-232-8177'
    });
    person.save()
        .then(function (person) {
            res.end(person.name);
        })
        .catch(function (err) {
            return next(err);
        });
});

router.post('/api/message', function (req, res, next) {
    var person = new Person({
        name: 'Bot',
        phoneNumber: '111-1111-1111'
    });
    person.save()
        .then(function (person) {
            res.end(person.name);
        })
        .catch(function (err) {
            return next(err);
        });
});

module.exports = router;
