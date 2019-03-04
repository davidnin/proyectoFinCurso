'use strict'
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var Table = require('../models/table');
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
  table.numberTable= params.numberTable;
  table.maxPersons= params.maxPersons;
  table.ocupada= params.ocupada;



  if (table.numberTable != null && table.maxPersons != null && table.ocupada != null) {

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

function getTables(req, resp){ 
  var tables = {};
  console.log(resp.status);
  Table.find( function (err, table) {
        tables[table._id] = table;
    
    if(err){
      resp.status(500).send({message: "Error en la peticion"});
    }else{
      if(!tables){
        resp.status(404).send({message: "No hay Mesas!!"});
      }else{
        resp.status(200).send({tables});
      }
    }
  });
}

function getTable(req, res){
	var tableId = req.params.id;

	Table.findById(tableId, (err, table) => {
		if(err){
			res.status(500).send({message: 'Error en la petición.'});
		}else{
			if(!table){
				res.status(404).send({message: 'La tabla no existe'});
			}else{
				res.status(200).send({table});
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
  Table.findByIdAndDelete(tableId, (err, tableDeleted)=>{
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
  deleteTable,
  getTable
};
