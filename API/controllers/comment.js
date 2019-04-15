'use strict'
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var Comment = require('../models/comment');
var jwt = require('../service/jwt');

function pruebaComment(req, res) {
  res.status(200).send({
    message: 'Todo corecto en prueba de la Commentario'
  });
}

function createComment(req, res) {
  var comment = new Comment();
  var params = req.body;
  console.log(params);
  comment.id_user = params.id_user;
  comment.fecha = params.fecha;
  comment.texto = params.texto;
  comment.puntuacion = params.puntuacion;


  if (comment.fecha != null && comment.texto != null) {

    comment.save((err, commentStored) => {
      if (err) {
        res.status(500).send({
          message: 'Error al guardar la tabla'
        });
      } else {
        if (!commentStored) {
          res.status(404).send({
            message: 'No se ha registrado la tabla'
          });
        } else {
          res.status(200).send({
            comment: commentStored
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

function getComments(req, resp) {
  var comments = {};
  console.log(resp.status);
  Comment.find(function (err, comment) {
    comments[comment._id] = comment;

    if (err) {
      resp.status(500).send({ message: "Error en la peticion" });
    } else {
      if (!comments) {
        resp.status(404).send({ message: "No hay Mesas!!" });
      } else {
        resp.status(200).send({ comments });
      }
    }
  });
}

function getComment(req, res) {
  var commentId = req.params.id;

  Comment.findById(commentId, (err, comment) => {
    if (err) {
      res.status(500).send({ message: 'Error en la petición.' });
    } else {
      if (!comment) {
        res.status(404).send({ message: 'La tabla no existe' });
      } else {
        res.status(200).send({ comment });
      }
    }
  });

}

function updateComment(req, res) {
  var commentId = req.params.id;
  var update = req.body;

  Comment.findByIdAndUpdate(commentId, update, (err, commentUpdated) => {
    if (err) {
      res.status(500).send({ message: "Error en la peticion" });
    } else {
      if (!commentUpdated) {
        res.status(404).send({ message: "No se encuentra la tabla!" });
      } else {
        res.status(200).send({ comment: commentUpdated });
      }
    }
  })
}

function deleteComment(req, res) {
  var commentId = req.params.id;
  Comment.findByIdAndDelete(commentId, (err, commentDeleted) => {
    if (err) {
      res.status(500).send({ message: "Error en la peticion" });
    } else {
      if (!commentDeleted) {
        res.status(404).send({ message: "No se encuentra la tabla!" });
      } else {
        res.status(200).send({ comment: commentDeleted });
      }
    }
  })
}

module.exports = {
  pruebaComment,
  createComment,
  getComments,
  updateComment,
  deleteComment,
  getComment
};
