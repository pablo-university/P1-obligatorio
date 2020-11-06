/* MIS NOTAS JS!!
- COMPONENTES: los .msg LOCALES serán llamados desde .seccion .msg
               y los GLOBALES por #msg, los sliders globales con #slider,
               botones como .seccion .boton etc
 */

// --- VARIABLES GLOBALES ---
// arr personas con objetos en sus indices

/*  Me tiro un error como que no captaba
    el responseJSON
    personasData = obtenerPersonas();
    personas = personasData.responseJSON; */
/* var personas;
function obtenerPersonas(){
    $.ajax({
        type:"GET",
        url:"js/personas.json",
        dataType: "json",
        async:false,
        success: function (dato){
            personas = dato;
        } 
    })
} */
/* Oculte esto porque lo de CORs me bloqueaba
 cuando abría el index */

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
const chart2Data = [0, 0, 0, 0, 0]

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

// #slider (no he probado para mas de 3 diapo)
function slider() {
    let count = 0;
    let sliders = $('#slider > div');

    function cambiaSlider() {
        // oculto todo
        $(sliders).animate({ opacity: '0' });
        // si no me pasé muestro slider de count
        if (count < $(sliders).length) {
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
    // Esto es 'Async', explicar con enevent loop etc
    setInterval(cambiaSlider, 10000);
}

// .section1 footerClick
function footerClick() {
    // modal(titulo,contenido);
    modal('hola modal', '<p>hola contenido</p>');

}

// #table
function table(chart2) {
    /* CONTENIDO:
        - drawTable
        - orderTable
        - addToTable
        - checkForm
        - search
        - */
    let propAnterior = 'vacio';
    /* con DESESTURACION seria -> const {nombre,genero,feed,media,orientacion} = personas[i] */

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
        // prop es tomada del data-head
        let prop = $(this).attr('data-head');

        if (prop != propAnterior) {
            // ordena acorode typeof
            if (typeof personas[0][prop] == 'string') {
                personas.sort((a, b) => a[prop].localeCompare(b[prop]));
            } else personas.sort((a, b) => a[prop] - b[prop]);

            // oculta los demas & muestra icono, selecciona fondo etc
            $('#table thead i').css({ 'opacity': '0', 'transform': 'rotate(0deg)' });
            $(this).children('i').css('opacity', 1);

            drawTable();// dibuja tabla
            propAnterior = prop;
        } else {
            personas.reverse();

            // invierte icono
            $(this).children('i').css('transform', 'rotate(180deg)');
            drawTable();// dibuja tabla
            propAnterior = 'vacio';
        }

    }// fin orderTable

    // addToTable
    function addToTable() {
        // obtengo newPersona
        const newPersona = {
            nombre: $('.section2 #nombre').val(),
            genero: $('.section2 input[type="radio"]:checked').val(),
            feed: parseInt($('.section2 #feed').val()),
            media: parseInt($('.section2 #media').val()),
            orientacion: $('.section2 #orientacion').val()
        };
        // desestructuro newPersona
        const { nombre = 'err', genero = 'err', feed = 0, media = 0, orientacion = 'err' } = newPersona;

        // controla que nombre&orientación NO sean vacíos
        if (nombre == orientacion) {
            $('.section2 .msg').html('El campo <mark>nombre y orientación</mark> están vacíos')
        } else if (nombre == '') {
            $('.section2 .msg').html('El campo <mark>ingresa nombre</mark> está vacío')
        } else if (orientacion == '') {
            $('.section2 .msg').html('El campo <mark>orientación</mark> está vacío')
        } else {
            // push al arreglo newPersona & draw
            personas.push(newPersona);
            drawTable();
            // limpio algunos campos, y aviso que todo ok
            $('.section2 #nombre,.section2 #orientacion').val('');
            $('.section2 .msg').html('Los datos fueron gregados <mark>correctamente</mark>')
        }
        // resolver updatear la grafica RESUELTO
        planDeCarrera(chart2)
        //$('.section2 .msg').text(`${nombre}|${genero}|${feed}|${media}|${orientacion}`);
    }

    // checkForm
    function checkForm() {
        // añade escucha click addtoTable...
        $('.section2 .boton').click(addToTable);

        // añade escucha focusout a nombre
        $('.section2 #orientacion, .section2 #nombre').focusout(function () {
            console.log(this.value == '')
            if (this.value == '') {
                $('.section2 .msg').html(`El campo <mark>${$(this).attr('placeholder')}</mark> se encuentra vacío`);
            } else $('.section2 .msg').text('...')
        });

        // añade escucha change(cambio) a range
        $('.section2 [type="range"]').change(function () {
            $(this).prev().text($(this).val());
        });
    }

    // search
    function searchInTable(){

        $('.section2 #search').keyup(buscar);
        function buscar(){
            let search = $('.section2 #search').val().toLocaleLowerCase();
            let target = $('.section2 #search-target').val();
            let rows = $('#table tbody tr');

            // si es null dale nombre, sino target, esto x el disabled del select
            target = target == null ? 'nombre' : target;

            // buscando en personas
            $(personas).each(buscando);
            function buscando(i,persona){
                
                // pasa a string la clave de persona, y pregunta si coincide con search
                let match = String(persona[target]).toLocaleLowerCase().indexOf(search) != -1;

                // si encuentra muestra
                if (match){$(rows[i]).slideDown();}
                // sino oculta
                else $(rows[i]).slideUp();
            }

        }
        
    }

    // - Eventos Form -
    checkForm();

    // - Eventos search -
    searchInTable();

    // - Eventos Table -
    // añade escucha click en head
    $('#table thead th').click(orderTable);
    // draw #table primera vez
    drawTable();

}// fin #table

// .aside planDeCarrera
function planDeCarrera(chart2) {
    /* acorde a orientación de personas:
       - recorro personas[i].orientacion
       - data : [mi resultado] 
       'Web','Diseño','Tecnología','Apps'
       - LISTO funciona*/
    chart2Data.fill(0);// reseteo char2Data

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
            case 'app':
                chart2Data[3]++;
                break;
            default:// 'otra' orientacion
                chart2Data[4]++;
        }
    });
    chart2.update();// updateo grafica
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
        let valor = $('.pendientes #pendiente').val();
        let elem = `<li><i class="far fa-sticky-note"></i>${valor}<i class="fas fa-check"></i></li>`;
        $('.pendientes ul').append(elem);
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
        // console.log(e.target.localName);
        if (esModal || e.target.localName == 'i') {
            $('#modal').slideUp()
        }
    }
}// fin modal


// fin funciones


// --- DOCUMENT READY ---
$(ini);// cuidado dos ini?
// --- FUNCIÓN INI ---
function ini() {
    // traer personas
    // obtenerPersonas();
    // CHART-1
    var ct1 = document.getElementById('chart-1').getContext('2d');
    var char1 = new Chart(ct1, {
        type: 'radar',
        data: {
            labels: ['1Trabajo en equipo', '2Compañerismo', '3Otro', '4Perfil'],
            datasets: [{
                label: 'titulografica',
                data: [7,8,5,4],
                pointRadius: 5,
                backgroundColor:'rgba(200, 111, 111, 0.1)',
                borderColor:'rgba(200, 111, 111, 0.5)',
                // laburando aqui lo de la grafica radar
            }]
            
        },
        options : {
            scale: {
                angleLines: {
                    display: true
                },
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 10
                }
            }
        }
    });


    // CHART-2
    var ct2 = document.getElementById('chart-2').getContext('2d');
    var chart2 = new Chart(ct2, {
        // Tipo de grafica
        type: 'doughnut',

        // Conjunto de datos
        data: {
            // Etiquetas al hacer hover
            labels: [
                'Web',
                'Diseño',
                'Tecnología',
                'Apps',
                'Otro'
            ],
            datasets: [{
                data: chart2Data,//data: [5, 19, 3, 1, otro],
                backgroundColor: [
                    'rgba(235, 65, 65, 0.4)',
                    'rgba(20, 184, 220, 0.4)',
                    'rgba(20, 184, 220, 0.4)',
                    'rgba(239, 196, 42, 0.4)',
                    'rgba(20, 184, 220, 0.4)'
                ],
                borderColor: [
                    'rgba(40, 40, 40, .5)',
                    'rgba(40, 40, 40, .5)',
                    'rgba(40, 40, 40, .5)',
                    'rgba(40, 40, 40, .5)',
                    'rgba(40, 40, 40, .5)'
                ],
                borderWidth: 1
            }]

        },
        // Configuraciones
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
    planDeCarrera(chart2);//modifica const global chart2Data + chart.update();
    // -------------------

    // --- navClick menú & secciones ---
    // oculto todo menos section1
    // $('.main >*:not(.section1)').hide();
    $('.nav li').click(navClick);

    // --- main secciones... ---

    // .section1 #slider
    /* - seleccionar DIVS a interactuar
        - todos ocultos
        - mostrar n
        - btn avanza if (n+1 < largoSeleccionado) else reset count  */
    slider();

    // .section1 main

    // .seccion1 footer add
    $('.section1 footer .boton').click(footerClick);

    // .seccion2 main (tabla)
    table(chart2);

    // --- aside ---
    // .pendientes, maneja pendientes
    pendientes();

}// fin ini

