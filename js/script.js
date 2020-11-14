/* MIS NOTAS JS!!
- COMPONENTES: los .msg LOCALES serán llamados desde .seccion .msg
               y los GLOBALES por #msg, los sliders globales con #slider,
               botones como .seccion .boton etc
- DESESTRUCTURACION: es lo moderno de let a = arr[1] y... let b = arr[2]... etc
                     const [a,b,c] = [1,2,3]; || [a,b,c] = [1,2,3]; sin declarar
                     const {apellido, nombre} = objeto;
- recorrerPersonas(personas, callback)?...

--- MI ESTRUCTURA GENERAL ---
  @Cuando la estructura es grande:
  - Variables
  - Funciones
    -mini intro
  - Ejecuciones
  @Cuando estructura es chica:
  - Similar a como haciamos en clase
 */

// --- VARIABLES GLOBALES ---

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
        feed: 10,
        media: 30000,
        orientacion: 'web'
    },
    {
        nombre: 'b',
        genero: 'm',
        feed: 90,
        media: 50000,
        orientacion: 'diseño'
    },
    {
        nombre: 'c',
        genero: 'f',
        feed: 80,
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

// #slider
function slider() {
    /*  - oculta todos los DIVS a interactuar
        - mostrar n
        - btn avanza if (n+1 < largoSeleccionado) else reset count  */
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
    // Esto es 'Async'
    setInterval(cambiaSlider, 10000);
}

// .section1 footer lista
function lista(chart1) {
    // - variables -

    // - funciones -
    // manageLista
    function manageList() {

        // modal(titulo,contenido);
        modal('Selecciona alguien para la lista', `
            <input list="list-personas" placeholder="selecciona persona">
            <datalist id="list-personas">
                <!-- agrego dinamicamente nombres de mi array -->
            </datalist>
            <input type="button" value="Agregar" class="boton">
            <p class='msg'></p>`);

        // oculta y vacia msg
        $('#modal .msg').html('').hide();

        // imprime lista de personas
        personas.forEach(recorrePersonas);
        function recorrePersonas(elem) {
            $('#modal #list-personas').append(`<option value="${elem.nombre}">`);
        };

        // escucha en agregar addToList
        $('#modal .boton').click(addToList);
    }//fin maneja lista

    // addToList
    function addToList() {

        // nombre del input Datalist
        let nombre = $('#modal input*[list="list-personas"]').val();
        // pregunta si ya está agregado
        let personaRepetida = $(`.list [data-nombre*="${nombre}"]`).length > 0;
        // cubre campo vacío y agregar mal el nombre
        let personaNoExiste = $(`#modal option[value*="${nombre}"]`).length == 0;

        // oculta y vacia msg
        $('#modal .msg').html('').hide();

        // personaRepetida o personaNoExiste?
        if (personaRepetida || personaNoExiste) {
            let mensaje = personaRepetida ?
                'El nombre <mark>ya está asignado</mark>' :
                'Campo está <mark>vacío o incorrecto</mark>';
            $('#modal .msg').show().html(mensaje);
            $('#modal input*[list="list-personas"]').val('');
        } else {
            // agregar a lista persona
            $('.section1 .list').append(`
                <div data-nombre='${nombre}'>
                    <h2>${nombre}</h2>
                    <p>Perfil profesional</p>
                </div>`);
            $('#modal input*[list="list-personas"]').val('');

            // resetear y agregar evento a las card's
            $('.section1 .list > *').off();
            $('.section1 .list > *').dblclick(removeItemList);//borrar
            $('.section1 .list > *').click(selectItemList);//select
        }


    }// fin addToList

    // removeItemList
    function removeItemList(e) {
        this.remove();
    }// fin removeItemList

    // selectItemList
    function selectItemList() {
        // console.log(this);
        let cantActive = $('.section1 .list .active').length;
        let miBoolean = cantActive < 2;//primera vez cant = 0 => true
        if (miBoolean) {
            this.classList.toggle('active');
        } else {
            this.classList.toggle('active', miBoolean);
        }

        // ---
        // nombre de personas que haya seleccionado
        const personasSeleccionadas = [];

        // obtener nombres seleccionados, 0, 1, o 2
        $('.section1 .list .active').each(function (i) {
            let nombre = $(this).attr('data-nombre');
            // asumo que llegado aca no hay gente SIN data-nombre
            personasSeleccionadas.push(nombre);
        });

        // si hay 1, 2... personas
        if (personasSeleccionadas.length > 0) {

            // arr con personasAInsertar
            const personasAInsertar = [];

            // controla color
            let colorAnterior = 0;

            // recorro personas & si hay personasSeleccionadas las agrega a personasAInsertar
            personas.forEach(recorroPersonas);
            function recorroPersonas(persona, i) {
                // personasSeleccionadas incluye persona.nombre?
                if (personasSeleccionadas.includes(persona.nombre)) {
                    // arr con datos de la persona a insertar
                    const data = [];
                    // según mis super cuentas si ganas poco & poco feed tas in the horno
                    data.push(persona.media / 1000, persona.feed, persona.media / 1000 + persona.feed, (persona.media / 100000 + persona.feed) / 2);

                    colorAnterior = colorAnterior == 0 ? 1 : 0;
                    // si es par azul, sino amarella, dandole colorcito a la vidax
                    personasAInsertar.push({
                        label: persona.nombre,
                        data: data,
                        background: colorAnterior == 0 ? 'rgba(20, 184, 220, .1)' : 'rgba(248, 207, 62, .1)',
                        border: colorAnterior == 0 ? 'rgba(20, 184, 220, 1)' : 'rgba(248, 207, 62, 1)'
                    });
                    // 'rgba(248, 207, 62, 1)' amarillo
                    // 'rgba(20, 184, 220, 1)' azul
                }
            }
            /* NOTAS
            - alternar colores
             */
            /* - Estructura de datos en este scope -
                personasSeleccionadas []

                personasAInsertar[
                    personaAInsertar[]
                    personaAInsertar[]
                    .
                    .
                ]
            ] */

            // vacío chart1 -> datasets
            chart1.data.datasets = [];

            // recorro personasAInsertar
            personasAInsertar.forEach(recorroPersonasAInsertar);
            function recorroPersonasAInsertar(persona, i, arr) {
                chart1.data.datasets.push({
                    // Persona x
                    label: persona.label,
                    data: persona.data,
                    pointRadius: 5,
                    backgroundColor: persona.background,
                    borderColor: persona.border,
                    pointBackgroundColor: persona.border,
                    pointBorderColor: 'rgba(255, 255, 255, 1)'
                });// fin pusheo persona
            }
        }// fin if


        chart1.update();
    }// fin selectItemList

    // - ejecución -
    // manageList
    $('.section1 footer .boton').click(manageList);



}// fin lista

// #table
function table(chart2) {
    /*  @Variables:
        - propAnterior
        @Funciones:
        - drawTable
        - orderTable
        - addToTable
        - edit
        - remove
        - checkForm
        - search
        @Ejecuciones */
    let propAnterior = 'vacio';

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

        // limpio escuchas en las row's & re-agrego remove & edit
        $('#table tbody tr').off();
        $('#table tbody tr').dblclick(removePerson);// removePerson
        $('#table tbody tr').click(editPerson);// editPerson

    };// drawTable se auta ejecuta (al menos una vez)

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
        /*  @Funciones
            - obtieneNewPerson
            - checkForm
            - add
            @escuchas */
        // obtieneNewPerson
        function obtenerNewPersona() {
            const newPersona = {
                nombre: $('.section2 #nombre').val(),
                genero: $('.section2 input[type="radio"]:checked').val(),
                feed: parseInt($('.section2 #feed').val()),
                media: parseInt($('.section2 #media').val()),
                orientacion: $('.section2 #orientacion').val()
            };
            return newPersona;
        }
        // checkForm
        function checkForm() {
            const {nombre, orientacion} = obtenerNewPersona();

            // controla que nombre&orientación NO sean vacíos
            if (nombre == '' || orientacion == '') {
                $('.section2 .msg').html(`El campo <mark>${nombre == orientacion ? 'nombre y orientación están vacíos': nombre == '' ? 'nombre es vacío' : 'orientación es vacío'}</mark>`);
                return false;
            } else return true;
            // ---
        }
        // add
        function add() {
            let ok = checkForm();
            if (ok) {
                let newPersona = obtenerNewPersona();

                // push al arreglo newPersona & draw
                personas.push(newPersona);
                drawTable();

                // limpio algunos campos, y aviso que todo ok
                $('.section2 #nombre,.section2 #orientacion').val('');
                $('.section2 .msg').html('Los datos fueron gregados <mark>correctamente</mark>')

                // planDeCarrera actualiza chart2 del aside
                planDeCarrera(chart2)
            }
        }
        // añade escucha focusout a nombre
        $('.section2 #orientacion, .section2 #nombre').focusout(checkForm);

        // añade escucha change(cambio) a range
        $('.section2 [type="range"]').change(function () {
            $(this).prev().text($(this).val());});

        // añade escucha click add...
        $('.section2 .boton').click(add);

    }// fin addToTable

    // editPerson
    function editPerson() {
        /* 
        - seleccionar row OK
        - captar quién es esa persona
        - insertar datos de person[x] in formulario
        - cuando click en add, borro de la tabla, del array
            y personas.push(newPerson), drawTable */

        let buscado = this.children[0].innerText;

        // find retorna primer valor que retornemos verdadero
        pepe = personas.find(persona => persona.nombre == buscado);
        console.log(pepe);
    }

    // removePerson
    function removePerson() {
        /*  - remover item con dbl click
            - 2da opcion seria lo del arrastre */
        let buscado = this.children[0].innerText;

        personas.forEach(buscoQuienEliminar);
        function buscoQuienEliminar(elem, i) {
            if (elem.nombre == buscado) {
                // splice(indice, elemsARemover)
                personas.splice(i, 1);
            }
        }
        // remuevo nodo del DOM
        this.remove();

        // planDeCarrera actualiza chart2 del aside
        planDeCarrera(chart2)
    }

    // search
    function searchInTable() {

        $('.section2 #search').keyup(buscar);
        function buscar() {
            let search = $('.section2 #search').val().toLocaleLowerCase();
            let target = $('.section2 #search-target').val();
            let rows = $('#table tbody tr');

            // si es null dale nombre, sino target, esto x el disabled del select
            target = target == null ? 'nombre' : target;

            // buscando en personas
            $(personas).each(buscando);
            function buscando(i, persona) {

                // pasa a string la clave de persona, y pregunta si coincide con search
                let match = String(persona[target]).toLocaleLowerCase().indexOf(search) != -1;

                // si encuentra muestra
                if (match) { $(rows[i]).slideDown(); }
                // sino oculta
                else $(rows[i]).slideUp();
            }
        }
    }

    // draw #table primera vez
    drawTable();

    // - Eventos Table -
    // orderTable
    $('#table thead th').click(orderTable);

    // - Eventos Form -
    addToTable();

    // - Eventos search -
    searchInTable();

}// fin #table

// .aside planDeCarrera
function planDeCarrera(chart2) {
    /* acorde a orientación de personas:
     - recorro personas[i].orientacion
     - 'Web','Diseño','Tecnología','Apps'
     - asigno resultados a pasarle a chart2*/
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
    // CHART-1
    var ct1 = document.getElementById('chart-1').getContext('2d');
    var chart1 = new Chart(ct1, {
        type: 'radar',
        data: {
            labels: ['Media de sueldo ($)', 'Feed con empresa (%)', 'Prov. de capacitación (%)', 'Posible aumento (%)'],
            datasets: [{
                // Persona 1
                label: 'Selecciona personas...',
                data: [100, 100, 100, 100],
                pointRadius: 5,
                backgroundColor: 'rgba(20, 184, 220, .1)',
                borderColor: 'rgba(20, 184, 220, 1)',
                pointBackgroundColor: 'rgba(20, 184, 220, 1)',
                pointBorderColor: 'rgba(255, 255, 255, 1)'
            }]//fin datasets

        },
        options: {
            scale: {
                angleLines: {
                    display: true
                },
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            },
            legend: {
                display: true,
                position: 'bottom'
            },
            title: {
                display: true,
                text: 'Análisis de perfiles',
                padding: -50
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
            labels: ['Web', 'Diseño', 'Tecnología', 'Apps', 'Otro'],
            datasets: [{
                data: chart2Data,//data: [5, 19, 3, 1, otro],
                backgroundColor: [
                    'rgba(20, 184, 220, 1)',
                    'rgba(255, 67, 101, .5)',
                    'rgba(20, 184, 220, .5)',
                    'rgba(248, 207, 62, .5)',
                    'rgba(100, 100, 100, .5)'
                ],
                borderColor: 'rgba(255, 255, 255, 1)',
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
    slider();

    // .section1 main

    // .seccion1 footer add
    lista(chart1);

    // .seccion2 main (tabla)
    table(chart2);

    // --- aside ---
    // .pendientes, maneja pendientes
    pendientes();

    // joyita
    // ---------
    $('main').append(`
    <audio id="audio" controls style="display: none;">
        <source type="audio/wav" src="sound/go.mp3">
    </audio>`);
    var audio = document.getElementById("audio");
    //audio.play();
    // -----------

}// fin ini

