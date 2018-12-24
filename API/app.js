'use strict'

var express = require('express'); //cargar aplicacion express
var bodyParser = require('body-parser'); //cargar aplicacion bodyparser

var app = express();

//cargaremos rutas
var user_routes = require('./routes/user');
var reserved_routes = require('./routes/reserved');
var table_routes = require('./routes/table');


app.use(bodyParser.urlencoded({extended:false})); //necesario para que el bodyparser funcione
app.use(bodyParser.json());

app.use('/api/',user_routes);
app.use('/api/reserved',reserved_routes);
app.use('/api/table',table_routes);

module.exports = app; //Para utilizar express en otros ficheros app.
