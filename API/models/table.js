'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TableSchema = Schema({
      numberTable: Number,
      maxPersons: Number
});

module.exports = mongoose.model('Table',TableSchema);
