// fs
var fs = require('fs');
// express
var express = require('express');
// cors
var cors = require('cors');

// crea app expres o server
var app = express();
// usa modulo cors
app.use(cors())

// declaro personas
var personas;
app.get('/', function (req, res, next) {
  // @trabajando aqui
  // https://www.npmjs.com/package/body-parser
  // npmjs.com/package/query-string
  personas = JSON.stringify(req.query);
  console.log(req.query);
  console.log('mostre archivo');
  // -------- MANEJO DE ARCHIVO ---------
  fs.writeFile('./js/personas.json', `${personas}`, function (err) {
  if (err) throw err;
    console.log('Guardado!');
    
  });
  
  // --------

  // aqui respondo segun me pidas
  res.send('Mi Server => archivo guardado en local');
  res.end();
})

app.listen(8080, function () {
  // este console es solo en la consola node digamos
  console.log('CORS-enabled escuchando puerto 8080')
})

