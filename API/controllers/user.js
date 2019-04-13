'use strict'
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../service/jwt');


function pruebas(req,res){
  res.status(200).send({
    message: 'Probando uan accion de el controlador de esta bullshit de users'
  });
}

function saveUser(req,res){
  var user = new User();
  var params = req.body;
  console.log(params)
  user.name= params.name;
  user.lastname= params.lastname;
  user.email= params.email;
  user.role= 'ROLE-USER';
  user.table='null';

  if(params.password){
    bcrypt.hash(params.password,null,null,function(err,hash){
      user.password=hash;
      if(user.name != null && user.lastname != null && user.email != null){

        user.save((err,userStored) => {
          if(err){
            res.status(500).send({message: 'Error al guardar el usuario'});
          }else{
            if(!userStored){
              res.status(404).send({message: 'No se ha registrado el usuario'});
            }else{
              res.status(200).send({user: userStored});
            }
          }
        });
      }else{
        res.status(200).send({message: 'Introduce todos los campos'});
      }
    });
  }else{
    res.status(200).send({message: 'Introduce la contraseña'});
  }
}

function loginUser(req,res){
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()},(err,user)=>{
      if(err){
        res.status(500).send({message: 'Error en la peticion'});
      }else{
        if(!user){
          res.status(404).send({message: 'El usuario no existe'});
        }else{
          bcrypt.compare(password, user.password, function(err,check){
            if(check){
              if(params.getHash){
                res.status(200).send({
                  token: jwt.createToken(user),
                  user: user
                });
              }else{
                res.status(200).send({user});
              }
            }else{
              res.status(404).send({message: 'El usuario no ha podido loguearse'});

            }
          })
        }
      }
    })
}

function updateUser(req,res){
  var userId  = req.params.id;
  var update = req.body;

  User.findByIdAndUpdate(userId,update,(err,userUpdated)=>{
    if(err){
      res.status(500).send({message: 'Error al actualizar el usuario'});
    }else{
      if(!userUpdated){
        res.status(404).send({message: 'El usuario no ha podido actualizar-se'});
      }else {
        res.status(200).send({user: userUpdated});
      }
    }
  });
}

function getUsers(req,resp){
  var users = {};
  console.log(resp.status);
  User.find(function (err, user) {
    users[user._id] = user;

    if (err) {
      resp.status(500).send({ message: "Error en la peticion" });
    } else {
      if (!users) {
        resp.status(404).send({ message: "No hay Mesas!!" });
      } else {
        resp.status(200).send({ users });
      }
    }
  });
}

function getUser(req, res) {
  var userId = req.params.id;
  console.log(userId);
  User.findById(userId, (err, user) => {
    if (err) {
      res.status(500).send({ message: 'Error en la petición.' });
    } else {
      if (!user) {
        res.status(404).send({ message: 'El user no existe' });
      } else {
        res.status(200).send({user: user });
      }
    }
  });
}

function deleteUser(req, res) {
  var userId = req.params.id;
  User.findByIdAndDelete(userId, (err, userDeleted) => {
    if (err) {
      res.status(500).send({ message: "Error en la peticion" });
    } else {
      if (!userDeleted) {
        res.status(404).send({ message: "No se encuentra la tabla!" });
      } else {
        res.status(200).send({ user: userDeleted });
      }
    }
  })
}

module.exports={
  pruebas,
  saveUser,
  loginUser,
  updateUser,
  getUser,
  getUsers,
  deleteUser
};
