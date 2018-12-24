'use strict'

var express = require('express');
var TableController = require('../controllers/table');

var md_auth = require('../middlewares/autenticated');
var api = express.Router();

var multipart= require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/table'});


api.get('/',TableController.pruebaTable);
api.post('/login',TableController.createTable);
api.get('/tables/:album?', TableController.getTables);
api.put('/update/:id',TableController.updateTable);
api.delete('/delete/:id',TableController.deleteTable);


module.exports = api;
