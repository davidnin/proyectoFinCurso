'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var md_auth = require('../middlewares/autenticated');
var api = express.Router();

var multipart= require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});


api.get('/probando-controlador',md_auth.ensureAuth,UserController.pruebas);
api.get('/user/:id', UserController.getUser);
api.get('/users', UserController.getUsers);
api.post('/register',UserController.saveUser);
api.post('/login',UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.delete('/delete/:id',UserController.deleteUser);


module.exports = api;
