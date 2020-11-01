/* MIS NOTAS JS!!
- COMPONENTES: los .msg LOCALES serán llamados desde .seccion .msg
               y los GLOBALES por #msg, los sliders globales con #slider,
               botones como .seccion .boton etc
- SI E TIEMPO crear un constructor para crear instancias y add personas
- PUSH vs PULL, push sube, pull 'baja', no modificar el redname de git que desp me rompe las b que actualice local
- CODICIONAL ? (condificon) ? exp1 : exp2; como es una EXPRESION la resuelve y devuelve
 */

// --- VARIABLES GLOBALES ---
// arr personas con objetos en sus indices
personas = [
    {
        nombre: 'a',
        genero: 'm',
        feed: 1,
        media: 30000,
        orientacion: 'web'
    },
    {
        nombre: 'b',
        genero: 'm',
        feed: 9,
        media: 50000,
        orientacion: 'diseño'
    },
    {
        nombre: 'c',
        genero: 'f',
        feed: 8,
        media: 40000,
        orientacion: 'app'
    }
];
const chart2Data = [0, 0, 0, 0]

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

// #slider (no he probado para mas de 2 diapo)
function slider() {
    let count = 0;
    let sliders = $('#slider > div');

    function cambiaSlider() {
        //$(sliders).hide();
        $(sliders).animate({ opacity: '0' });
        if (count < $(sliders).length) {
            //$(sliders).eq(count).show();
            $(sliders).eq(count).animate({ opacity: '1' });
            count++;
        } else {
            count = 0;
            $(sliders).eq(count).animate({ opacity: '1' });
            count++;// QUEDO CARAJO!
        }
    }

    // boton avanzar (100% ecologico jajajajaj)
    $('#slider .boton').click(cambiaSlider);
    cambiaSlider(); // primera vez
    // Esto es Async, explicar con enevent loop etc
    setInterval(cambiaSlider, 10000);
}

// .section1 footerClick
function footerClick() {
    // por definir
}

// .section2 footer

// #table
function table() {
    // tood lo relacionado a tablas
    let propAnterior = 'vacio';
    /* con DESESTURACION seria -> const {nombre,genero,feed,media,orientacion} = elemento */

    // drawTable
    function drawTable() {
        // limpio innerHTML del tbody
        $('#table tbody').html('');
        personas.forEach(drawPersonas);

        function drawPersonas(elem, i, array) {
            $('#table tbody')
                .append(`<tr>
                            <td>${elem.nombre}</td>
                            <td>${elem.genero}</td>
                            <td>${elem.feed}</td>
                            <td>${elem.media}</td>
                            <td>${elem.orientacion}</td>
                        </tr>`);
        }
    };// drawTable se auta ejecuta (una vez)

    // orderTable
    function orderTable(e) {
        // !!! revisar esto y sintetizarlo
        let prop = $(this).attr('data-head');

        if (propAnterior != prop) {
            // ordena acorode typeof
            if (typeof personas[0][prop] == 'string') {
                personas.sort((a, b) => a[prop].localeCompare(b[prop]));
            } else personas.sort((a, b) => a[prop] - b[prop]);

            propAnterior = prop;
            drawTable();// dibuja tabla
        } else {
            personas.reverse();
            drawTable();
            propAnterior = 'vacio';
        }

    }
    // reverseTable

    // añade evento click en head
    $('#table thead th').click(orderTable);
    // draw #table
    drawTable();

}// fin #table

// .aside planDeCarrera
function planDeCarrera() {
    /* acorde a orientación de personas calcular plan de carrera
       - deberia recorrer personas[i].orientacion
       - data : [mi resultado] 
       'Web','Diseño','Tecnología','Apps'
       - LISTO funciona*/
    personas.forEach(function (persona, i, arr) {
        switch (persona.orientacion) {
            case 'web':
                chart2Data[0]++;
                break;
            case 'diseño':
                chart2Data[1]++;
                break;
            case 'tecnologia':
                chart2Data[2]++;
                break;
            default:
                chart2Data[3]++;
        }
    });
}

// .pendientes, maneja pendientes
function pendientes() {

    // pendientesClick, tacha/destacha
    $('.pendientes li').click(pendientesClick);
    function pendientesClick(e) {
        $(this).toggleClass('active');
    }

    //pendientesAdd, agrega elementos
    $('.pendientes .add').click(pendientesAdd);
    function pendientesAdd(e) {
        let valor = $('.pendientes .add').prev().val();
        $('.pendientes ul').append(`<li>${valor}</li>`);
        // reparo temita de eventos
        $('.pendientes li').off('click');
        $('.pendientes li').click(pendientesClick);
    }

    //pendientesRemove, borra los tachados
    $('.pendientes .remove').click(pendientesRemove);
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

    // --- navClick menú & secciones ---
    // oculto todo menos section1
    $('.main >*:not(.section1)').hide();
    $('.nav li').click(navClick);

    // --- main secciones... ---

    // .section1 #slider
    /* - seleccionar DIVS a interactuar
        - todos ocultos
        - mostrar n
        - btn avanza if (n+1 != largoSeleccionado) else reset count  */
    slider();

    // .section1 main

    // .seccion1 footer add
    $('.section1 footer .boton').click(footerClick);

    // .seccion2 main (tabla)
    table();

    // --- aside ---
    // .pendientes, maneja pendientes
    pendientes();

    // CHART-2
    planDeCarrera();//modifica const global chart2Data
    //chart.update(); xra actualizarla uso planDeCarrera y update()
    var ctx = document.getElementById('chart-2').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'doughnut',

        // The data for our dataset
        data: {
            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: [
                'Web',
                'Diseño',
                'Tecnología',
                'Apps'
            ],
            datasets: [{
                data: chart2Data,//data: [5, 19, 3, 1],
                backgroundColor: [
                    'rgba(255, 99, 132,.5)',
                    'rgba(54, 162, 235,.5)',
                    'rgba(54, 162, 100,.5)',
                    'rgba(255, 206, 86,.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132,1)',
                    'rgba(54, 162, 235,1)',
                    'rgba(54, 162, 100,1)',
                    'rgba(255, 206, 86,1)'
                ],
                borderWidth: .5
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

