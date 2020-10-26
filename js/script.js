// --- VARIABLES GLOBALES ---



// --- FUNCIONES GLOBALES ---

// navClick menú & secciones
function navClick(e){

    // borra active y agrega active this
    $('.nav li').removeClass('active');
    $(this).addClass('active');
    // pos del elemento clickeado
    let pos = $(this).index();

    // muestro section acorde a pos
    $('.main >*').hide();
    $('.main >*').eq(pos).show();

    // si es this == salir, salgo
    if ($('.nav li:last-child')[0] == $(this)[0]){
        // llamar a una funcion msg
        if (confirm("Seguro salir")){
           window.location = 'index.html'; 
        }
    }
}// fin navClick

// fin funciones


// --- DOCUMENT READY ---
$(ini);
// cuidado dos ini? en diferente js?!!!
// FUNCIÓN INI
function ini(){
    // Probando table sorter
    $("#myTable").tablesorter();

    // navClick menú & secciones
    $('.nav li').click(navClick);
    
    
}// fin ini
