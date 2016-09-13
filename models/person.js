'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PersonSchema = new Schema({
    active: {
        type: Boolean,
        default: true
    },
    name: String,
    phoneNumber: String,
    mostRecentTacoDate: {
        type: Date, index: true
    },
    deferedTacoDate: {
        type: Date
    }
});

module.exports = mongoose.model('Person', PersonSchema);
