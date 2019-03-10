'use strict'
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var Reserved = require('../models/reserved');
var Table = require('../models/table');
var User = require('../models/user');
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
  reserved.turno1 = params.turno1;
  reserved.turno2 = params.turno2;
  reserved.turno3 = params.turno3;
  reserved.turno4 = params.turno4;
  reserved.people = params.people;


  if (reserved.id_user != null && reserved.id_table != null && reserved.people != null && reserved.date != null && reserved.turno1 != null && reserved.turno2 != null && reserved.turno3 != null && reserved.turno4 != null) {

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
  var reservedId = req.params.album;
  // Aqui le passare el id de la persona logeada , por lo tanto tendre que obtener dicha id y compararla con la 
  // todas los userId de las reservas. Una vez obtenga aquellas que estan bien , guardar su id de reserva en un array
  // de id de reservas para luego ir buscandolas una por una hasta quetodas esten printadas. O se puede pedir un json
  // que saldra de aqui hecho ya en el cual obtenga todas las reservas.
  if(!reservedId){
    var find = Reserved.find({}).sort('number');
  }else{
    var find = Reserved.find({reserved: reservedId}).sort('number');
  }
  find.populate({path: 'user'}).exec((err, reserveds)=>{
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
  78
module.exports = {
  pruebaReserved,
  createReserved,
  getReserveds,
  updateReserved,
  deleteReserved
};
