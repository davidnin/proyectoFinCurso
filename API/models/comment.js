'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = Schema({
      id_user: { type: Schema.ObjectId, ref: 'User'},
      fecha: String,
      titulo: String,
      descripcion: String,
      puntuacion: Number
});

module.exports = mongoose.model('Comment',CommentSchema);
