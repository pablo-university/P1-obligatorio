/* RESPALDO MODAL V1.0.0 */

// Modal, sintaxis: modal(titulo,contenido);
function modal(titulo, contenido) {

    // abre modal cuando el padre es llamado
    $('#modal').slideDown();

    // vacio & inserto contenido
    $('#modal h2').html('').append(titulo);
    $('#modal main').html('').append(contenido);

    // cierra modal
    $('#modal, #modal [class*="far"]').click(cierraModal);

    function cierraModal(e) {
        let elem = $(e.target);
        let esModal = elem.attr('id') == 'modal';
        if (esModal || e.target.localName == 'i') {
            $('#modal').slideUp()
        }
    }
}// fin modal