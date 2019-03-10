'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReservedSchema = Schema({
      id_user: { type: Schema.ObjectId, ref: 'User'},
      id_table: { type: Schema.ObjectId, ref: 'Table'},
      date: String,
      turno1: Boolean,
      turno2: Boolean,
      turno3: Boolean,
      turno4: Boolean,
      people: Number
});

module.exports = mongoose.model('Reserved',ReservedSchema);
