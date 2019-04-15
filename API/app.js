'use strict'

var express = require('express'); //cargar aplicacion express
var bodyParser = require('body-parser'); //cargar aplicacion bodyparser

var app = express();

//cargaremos rutas
var user_routes = require('./routes/user');
var reserved_routes = require('./routes/reserved');
var table_routes = require('./routes/table');
var comment_routes = require('./routes/comment');


app.use(bodyParser.urlencoded({extended:false})); //necesario para que el bodyparser funcione
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use('/api/',user_routes);
app.use('/api/reserved',reserved_routes);
app.use('/api/table',table_routes);
app.use('/api/comment',comment_routes);

module.exports = app; //Para utilizar express en otros ficheros app.
