'use strict' //necesario para poder meter instrucciones nuevas de javascropt

var mongoose = require('mongoose'); //forma de cargar libreria o modulo

var app = require('./app');
var port = process.env.PORT || 4000;



mongoose.connect('mongodb://localhost:27017/curso', { useNewUrlParser: true } , (err,res)=>{
  if(err){
    throw err;
  }else{
      console.log("La base de datos esta bien connectada");

      app.listen(port,function(){
        console.log("Servidor del api rest funcioona correctamente en http://localhost:"+port);
      });
    }
  }) //para connectar-se a la base de datos
