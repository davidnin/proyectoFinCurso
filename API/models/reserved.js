'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReservedSchema = Schema({
      id_user: { type: Schema.ObjectId, ref: 'User'},
      id_table: { type: Schema.ObjectId, ref: 'Table'},
      date: String,
      people: Number
});

module.exports = mongoose.model('Reserved',ReservedSchema);
