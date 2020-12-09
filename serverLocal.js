// --- REQUERIMIENTOS ---
// fs
var fs = require('fs');
// express
var express = require('express');
// cors
var cors = require('cors');
// path
const path = require('path');// sin usar


// @crea app expres o server
var app = express();

/* 
--- MIDDELWARES ---
(son como pre procesadores del request response y tienen next()(xra el siguiente middleware),
ejemplo el json() convierte
la petición en json para ser manejada, está morgan (paquete) xra saber donde paso/intento ingresar el usuario,
algunos de ellos vienen con expres, otros deben ser instalados, podríamos hasta
crearlos nosotros mismos ya que son funciones!) */
// usa midelware cors
app.use(cors())
// MIDDELWARE: para tener archivos estaticos en el fronted (imagenes css js etc)
app.use(express.static('public'))

// - ejemplo de middleware -
var nombreMiddleware = function (req, res, next) {
  // codigo de lo que vaya a hacer
  next();// da paso al siguiente middleware del codigo
};
app.use(nombreMiddleware); // asi ejecuto los middlewares!
// ----------------


// declaro personas
var personas;
// --- GUARDADO ---
app.get('/guardar', function (req, res, next) {
  // @trabajando aqui
  // https://www.npmjs.com/package/body-parser
  // npmjs.com/package/query-string
  personas = JSON.stringify(req.query);
  console.log(req.query);
  console.log('mostre archivo');
  // -------- MANEJO DE ARCHIVO ---------
  fs.writeFile('./public/js/personas.json', `${personas}`, function (err) {
  if (err) throw err;
    console.log('Guardado!');
    
  });
  // --------
  // aqui respondo segun me pidas
  res.send('Mi Server => archivo guardado en local');
  res.end();
})// fin de /guardar

// --- ESCUCHANDO PUERTO ---
app.listen(8080, function () {
  // este console es solo en la consola node digamos
  console.log('CORS-enabled escuchando puerto 8080')
})

