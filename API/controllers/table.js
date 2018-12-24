'use strict'
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var Reserved = require('../models/reserved');
var jwt = require('../service/jwt');

function pruebaTable(req, res) {
  res.status(200).send({
    message: 'Todo corecto en prueba de la mesa'
  });
}

function createTable(req, res) {
  var table = new Table();
  var params = req.body;
  console.log(params);
  table.numberTable = params.numberTable;
  table.maxPersons = params.maxPersons;



  if (table.numberTable != null && reserved.maxPersons) {

    table.save((err, tableStored) => {
      if (err) {
        res.status(500).send({
          message: 'Error al guardar la tabla'
        });
      } else {
        if (!tableStored) {
          res.status(404).send({
            message: 'No se ha registrado la tabla'
          });
        } else {
          res.status(200).send({
            table: tableStored
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

function getTables(req, res){
  var albumId = req.params.album;

  if(!albumId){
    var find = Table.find({}).sort('number');
  }else{
    var find = Table.find({album: albumId}).sort('number');
  }
  find.populate({
    path: 'album',
    populate:{
      path: 'artist',
      model: 'Artist'
    }
  }).exec((err, tables)=>{
    if(err){
      res.status(500).send({message: "Error en la peticion"});
    }else{
      if(!tables){
        res.status(404).send({message: "No hay tablas!!"});
      }else{
        res.status(200).send({tables});
      }
    }
  });
}

function updateTable(req, res){
  var tableId = req.params.id;
  var update = req.body;

  Table.findByIdAndUpdate(tableId, update, (err, tableUpdated)=>{
    if(err){
      res.status(500).send({message: "Error en la peticion"});
    }else{
      if(!tableUpdated){
        res.status(404).send({message: "No se encuentra la tabla!"});
      }else{
        res.status(200).send({table: tableUpdated});
      }
    }
  })
}

function deleteTable(req, res){
  var tableId = req.params.id;
  Table.findByIdAndDelete(reservedId, (err, tableDeleted)=>{
    if(err){
      res.status(500).send({message: "Error en la peticion"});
    }else{
      if(!tableDeleted){
        res.status(404).send({message: "No se encuentra la tabla!"});
      }else{
        res.status(200).send({table: tableDeleted});
      }
    }
  })
}

module.exports = {
  pruebaTable,
  createTable,
  getTables,
  updateTable,
  deleteTable
};
