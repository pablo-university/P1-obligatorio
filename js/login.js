/* NOTA: sesionStorage permite eliminar las claves una vez cerrado el navegador,
		 dan problemas en location.path ya que es para rutas RELATIVAS,
		 sino genera buclce en if cuando no se ha iniciado sesion
		 */
// Json usuario-pass
var usuarios = {
	'1': '1',
	'cacho': '123',
};

// CUANDO HAYA LEIDO EL HTML
$(document).ready(ini);

// ---Funcion ini---
function ini() {
	// Cuando hace click llama a corroborarUserPass
	$('.index [type="submit"]').on('click', corrobarUserPass);

	// Si localizacion NO es /index.html ni / (esto genera bucle con rutas absolutas)
	if (window.location.pathname != '/index.html' && window.location.pathname != '/') {
		// si esta logueado
		if (localStorage.getItem('logueado') === 'si') {
			$('.section1 h1').html(`Hola ${localStorage.getItem('nombre')}, bienvenido`);
		} else {
			window.location = 'index.html';
		}
	}
}//fin ini

// ---Funcion corrobarUserPass---
function corrobarUserPass(e) {
	const u = $('.index [type="text"]').val();
	const p = $('.index [type="password"]').val();
	e.preventDefault();

	localStorage.setItem('logueado', 'no');
	$('.index .msg').hide('fast');

	// si usuario incorrecto
	if (usuarios[u] === undefined) {
		//vacio campos y doy mensaje
		$('.index [type="text"]').val('');
		$('.index [type="password"]').val('');
		$('.index .msg').text('El usuario no existe, intente con otro.');
		$('.index .msg').show('fast');
	// si usuario correcto
	} else if (usuarios[u] === p) {
		$('.index .msg').text('Bienvenid@');
		//$(this).parent().trigger('submit');
		localStorage.setItem('logueado', 'si');
		localStorage.setItem('nombre', u);
		// en vez de enviar form modifica location
		window.location = 'interna.html';
	// si contraseña incorrecta
	} else $('.index .msg').text('Contraseña incorrecta');
}//fin corrobarUserPass