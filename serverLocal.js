// fs
var fs = require('fs');
// express
var express = require('express');
// cors
var cors = require('cors');
// path
const path = require('path');


// crea app expres o server
var app = express();

/* 
--- MIDELWARES ---
(son como pre procesadores del request, ej json() convierte
la petición en json para ser manejada, está morgan xra saber donde paso el usuario,
algunos de ellos vienen con expres, otros deben ser instalados, podríamos hasta
crearlos nosotros mismos) */
// usa midelware cors
app.use(cors())
// MIDELWARE: para tener archivos estaticos en el fronted (imagenes css js etc)
app.use(express.static('public'))


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
})

// --- ESCUCHANDO PUERTO ---
app.listen(8080, function () {
  // este console es solo en la consola node digamos
  console.log('CORS-enabled escuchando puerto 8080')
})

