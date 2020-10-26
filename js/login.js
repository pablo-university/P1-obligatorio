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

	// Si localizacion NO es /index.html ni /
	if (window.location.pathname != '/index.html' && window.location.pathname != '/') {
		// si esta logueado
		if (sessionStorage.getItem('logueado') === 'si') {
			$('.section1 h1').html(`Hola ${sessionStorage.getItem('nombre')}, bienvenido`);
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

	sessionStorage.setItem('logueado', 'no');
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
		sessionStorage.setItem('logueado', 'si');
		sessionStorage.setItem('nombre', u);
		// en vez de enviar form modifica location
		window.location = 'interna.html';
	// si contraseña incorrecta
	} else $('.index .msg').text('Contraseña incorrecta');
}//fin corrobarUserPass