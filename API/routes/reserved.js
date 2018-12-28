'use strict'

var express = require('express');
var ReservedController = require('../controllers/reserved');

var md_auth = require('../middlewares/autenticated');
var api = express.Router();

var multipart= require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/reserved'});


api.get('/',ReservedController.getReserved);
api.post('/login',ReservedController.createReserved);
api.get('/reserveds/:album?', ReservedController.getReserveds);
api.put('/update/:id',ReservedController.updateReserved);
api.delete('/delete/:id',ReservedController.deleteReserved);


module.exports = api;
