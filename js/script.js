/* NOTAS!!
- msg: los .msg LOCALES serán llamados desde .seccion .msg
        y los GLOBALES por #msg
- si tgo tiempo crear un constructor para crear instancias y add personas
 */


// --- VARIABLES GLOBALES ---
// arr personas con objetos en sus indices
personas = [
    {
        nombre: 'pablo',
        genero: 'm',
        feed: '10',
        media: '30000',
        orientacion: 'web'
    },
    {
        nombre: 'paola',
        genero: 'f',
        feed: '90',
        media: '40000',
        orientacion: 'app'
    }
];


// --- FUNCIONES GLOBALES ---

// navClick menú & secciones
function navClick(e) {

    // si salir != this, muestro seccion
    if ($('.nav li:last-child')[0] != $(this)[0]) {

        // borra active y agrega active this
        $('.nav li').removeClass('active');
        $(this).addClass('active');
        // pos del elemento clickeado
        let pos = $(this).index();

        // muestro section acorde a pos
        $('.main >*').hide();//fadeOut()
        $('.main >*').eq(pos).show();//fadeIn()

    } else {
        // sino llamar a una funcion msg
        if (confirm("Seguro salir")) { window.location = 'index.html'; }
    }
}// fin navClick

// .section1 footerClick
function footerClick(){

}

// .pendientes, maneja pendientes
function pendientes() {

    // pendientesClick, tacha/destacha
    $('.pendientes li').click(pendientesClick);
    function pendientesClick(e) {
        $(this).toggleClass('active');
    }

    //pendientesAdd, agrega elementos
    $('.pendientes #add').click(pendientesAdd);
    function pendientesAdd(e) {
        let valor = $('.pendientes #add').prev().val();
        $('.pendientes ul').append(`<li>${valor}</li>`);
        // reparo temita de eventos
        $('.pendientes li').off('click');
        $('.pendientes li').click(pendientesClick);
    }

    //pendientesRemove, borra los tachados
    $('.pendientes #remove').click(pendientesRemove);
    function pendientesRemove(e) {

        $('.pendientes li').each(pendienteRemove);
        function pendienteRemove(i, elem) {
            if (elem.className == 'active') {
                elem.remove();
            }
        }
    }
}// fin pendientes

// fin funciones


// --- DOCUMENT READY ---
$(ini);
// cuidado dos ini?
// FUNCIÓN INI
function ini() {
    // --- Probando table sorter ---
    $("#myTable").tablesorter();

    // --- navClick menú & secciones ---
    // oculto todo menos section1
    $('.main >*:not(.section1)').hide();
    $('.nav li').click(navClick);

    // --- main secciones... ---

    // .section1 slider
    // .seccion1 footer add
    $('.section1 .boton').click(footerClick);

    // --- aside ---

    // .pendientes, maneja pendientes
    pendientes();

    // CHART-2
    var ctx = document.getElementById('chart-2').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'doughnut',

        // The data for our dataset
        data: {
            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: [
                'Red',
                'Yellow',
                'Blue'
            ],
            datasets: [{
                data: [12, 19, 3],
                backgroundColor: [
                    'rgba(255, 99, 132)',
                    'rgba(54, 162, 235)',
                    'rgba(255, 206, 86)'
                ],
                borderColor: [
                    'rgba(255, 99, 132)',
                    'rgba(54, 162, 235)',
                    'rgba(255, 206, 86)'
                ],
                borderWidth: 2
            }]

        },

        // Configuration options go here
        options: {
            legend: {
                display: true,
                position: 'bottom'
            },
            title: {
                display: true,
                text: 'Plan de carrera'
            }
        }
    });// fin chart-2
    // -------------------

}// fin ini

