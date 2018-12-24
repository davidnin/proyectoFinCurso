'use strict'
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var Reserved = require('../models/reserved');
var jwt = require('../service/jwt');

function pruebaReserved(req, res) {
  res.status(200).send({
    message: 'Todo corecto en prueba del reserved'
  });
}

function createReserved(req, res) {
  var reserved = new Reserved();
  var params = req.body;
  console.log(params);
  reserved.id_user = params.id_user;
  reserved.id_table = params.id_table;
  reserved.date = params.date;
  reserved.people = params.people;


  if (reserved.id_user != null && reserved.id_table != null && reserved.people != null) {

    reserved.save((err, reservedStored) => {
      if (err) {
        res.status(500).send({
          message: 'Error al guardar la reserva'
        });
      } else {
        if (!reservedStored) {
          res.status(404).send({
            message: 'No se ha registrado la reserva'
          });
        } else {
          res.status(200).send({
            reserved: reservedStored
          });
        }
      }
    });
  } else {
    res.status(200).send({
      message: 'Introduce todos los campos'
    });
  };
}

function getReserveds(req, res){
  var albumId = req.params.album;

  if(!albumId){
    var find = Reserved.find({}).sort('number');
  }else{
    var find = Reserved.find({album: albumId}).sort('number');
  }
  find.populate({
    path: 'album',
    populate:{
      path: 'artist',
      model: 'Artist'
    }
  }).exec((err, reserveds)=>{
    if(err){
      res.status(500).send({message: "Error en la peticion"});
    }else{
      if(!reserveds){
        res.status(404).send({message: "No hay reservas!!"});
      }else{
        res.status(200).send({reserveds});
      }
    }
  });
}

function updateReserved(req, res){
  var reservedId = req.params.id;
  var update = req.body;

  Reserved.findByIdAndUpdate(reservedId, update, (err, reservedUpdated)=>{
    if(err){
      res.status(500).send({message: "Error en la peticion"});
    }else{
      if(!reservedUpdated){
        res.status(404).send({message: "No se encuentra la reserva!"});
      }else{
        res.status(200).send({reserved: reservedUpdated});
      }
    }
  })
}

function deleteReserved(req, res){
  var reservedId = req.params.id;
  Reserved.findByIdAndDelete(reservedId, (err, reservedDeleted)=>{
    if(err){
      res.status(500).send({message: "Error en la peticion"});
    }else{
      if(!reservedDeleted){
        res.status(404).send({message: "No se encuentra la cancion!"});
      }else{
        res.status(200).send({reserved: reservedDeleted});
      }
    }
  })
}

module.exports = {
  pruebaReserved,
  createReserved,
  getReserveds,
  updateReserved,
  deleteReserved
};
