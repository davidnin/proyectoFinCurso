'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReservedSchema = Schema({
      id_user: Number, //{ type: Schema.ObjectId, ref: 'User'},
      id_table: Number, // { type: Schema.ObjectId, ref: 'Table'},
      date: String,
      people: Number
});

module.exports = mongoose.model('Reserved',ReservedSchema);
