/* --- MIS NOTAS JS!! ---
- COMPONENTES: los .msg LOCALES serán llamados desde .seccion .msg,
                igual con .seccion .boton
- DESESTRUCTURACION: es lo moderno de let a = arr[1] y... let b = arr[2]... etc
                     const [a,b,c] = [1,2,3]; || [a,b,c] = [1,2,3]; sin declarar
                     const {apellido, nombre} = objeto;
- EXP.reg ej: /\w+{3}[cractresCoincdntes]/banderas |||| !ver referencias
- MODULOS .MJS: Resolver asincronía de modulos?
-------------------------------------------------------------------------------
--- Mapa para Migue ---
  @Funciones + Clases:
  - Importaciones
  - Variables
  - Clases
  - Funciones
    -variables
    -funciones
    -ejecuciones
  @ini
  - ejecuciones
 */
// --- IMPORTACIONES (pendiente) ---
import { chart0, chart1, chart2 } from './modules/charts.mjs';

// --- VARIABLES GLOBALES ---
const personas = [];

// Obtener personas según almacenamiento localStorage
if (localStorage.getItem('personas') == null) {
    $.ajax({
        type: "GET",
        url: "js/personas.json",
        dataType: "json",
        // caso reject
        error: function (xhr) {
            alert(`Error:${xhr.status}, seguramente un buen problema con CORS`);
        },
        // caso resolve
        success: function (dato) {
            // for of para objeto iterable
            for (let persona of dato) {
                personas.push(persona)
            }/*
            luego de obtener personas
            ejecuto ini cuando haya leido el DOM */
            $(ini);
        }
    })// fin ajax
} else {
    let dato = JSON.parse(localStorage.getItem('personas'));
    // for of para objeto iterable
    for (let persona of dato) {
        personas.push(persona)
    }
    $(ini)
}// fin else


// --- FUNCIONES Y CLASES GLOBALES ---

// Clase de guardado localStorage
class StoragePersonas {// new StoragePersonas(personas);
    constructor(personas) {
        this.personas = personas;
    }
    // El dia que sepa PHP supongo que podría cambiar este metodo y guardarlo en una tabla SQL
    guardar() {
        // convierto personas en string
        let dato = JSON.stringify(this.personas);
        // vacio
        localStorage.setItem('personas', '');
        // agrego
        localStorage.setItem('personas', dato);
    }
    // metodos para mi DEBUG
    borrar() {
        try {
            localStorage.removeItem("personas");
            console.log('personas borrado de localStorage');
        }
        catch (error) {
            console.log('algo se pudrio: ', error);
        }
    }
}

// Ya se conocen
class Modal {// new Modal('clase--modificador','titulo','contenido');
    constructor(clase, titulo, contenido) {
        // Modal.clase = clase
        this.clase = clase;
        this.titulo = titulo;
        this.contenido = contenido;
        // si no está, incrusto huesos del modal en dom
        if ($(`.${clase}`).length < 1) {
            $('body').append(`
            <!-- Modal, absoluto -->
            <div id="" class="card modal ${clase}">
                <section>
                    <head><h2>${titulo}</h2><i class="far fa-window-close fa-lg"></i></head>
                    <main>${contenido}</main>
                </section>
            </div>`);
        }
    }
    // #cierra modal (metodo #privado según mozilla, experimental)
    #cierra(e) {//NO ME BORRES!!!!!!!!!!
        let elem = $(e.target);
        // si e.target tiene clase modal O es un i(icono cerrar)
        let esModal = elem.hasClass('modal');
        if (esModal || e.target.localName == 'i') {
            $(`.modal`).slideUp()
        }
    }
    // abre modal
    abre() {
        // abre modal
        $(`.${this.clase}`).slideDown();

        // vacio & inserto contenido (7.12.20 lo inserto ya en el constructor)
        // $(`.${this.clase} h2`).html('').append(this.titulo);
        // $(`.${this.clase} main`).html('').append(this.contenido);

        // cierra modal (debo referirme al objeto primero(this))
        $(`.${this.clase}, .${this.clase} [class*="far"]`).click(this.#cierra);
    }
}// fin Class Modal

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
        let modalSalir = new Modal('modal--salir', 'Confirmación',
            `<p>Seguro que deseas salir?</p>
        <input type="button" value="Salir" class="boton boton--salir">`);
        modalSalir.abre();
        $('.boton--salir').click(function () { window.location = 'index.html' });
    }
}// fin navClick

// planDeCarrera$MediaDeSueldo
function planDeCarrera$MediaDeSueldo(chart0, chart2) {
    // - variables -
    const orientaciones = [], promedios = [], planDeCarrera = [];
    let femenino = 0, feed = 0;

    // Obtengo orientaciones & %femenino
    personas.forEach(persona => {
        if (!orientaciones.includes(persona.orientacion)) {
            orientaciones.push(persona.orientacion);
        }
        // si es femenino sumo...
        if (persona.genero == 'f') { femenino++ }
        feed += persona.feed;
    });
    //----------
    // slider update
    // vaciar slider y agregar slide
    $('#slider div').remove();
    $('#slider').prepend(`
        <div>
            <h2>Feed Promedio!</h2>
            <p>Porcentaje de feed promedio en base a las personas</p>
            <h1>${parseInt(feed / personas.length)}%</h1>
        </div>
        <div>
            <h2>Femenino!</h2>
            <p>Porcentaje de personal femenino en la empresa</p>
            <h1>${parseInt(femenino * 100 / personas.length)}%</h1>
        </div>
    `);
    // inicia slider, contadores y updatea su contenido (pasar a clase?)
    slider();
    //---------
    // recorro orientaciones para hacer promedios
    orientaciones.forEach(function (orientacion) {
        let total = 0, cont = 0;
        // por cada persona pregunto si es de la orientación y voy haciendo promedio
        personas.forEach(function (persona) {
            if (persona.orientacion == orientacion) {
                total += persona.media;
                cont++;
            }
        });//!en el orden que obtuve orientaciones debo obtener pormedios y planDeCarrera
        promedios.push(parseInt(total / cont));
        planDeCarrera.push(cont);
    });

    // inyecto en chart0 los datos
    chart0.data.labels = [...orientaciones];
    chart0.data.datasets[0].data = [...promedios];

    // inyecto en chart2 los datos
    chart2.data.labels = [...orientaciones];
    chart2.data.datasets[0].data = [...planDeCarrera];

    // updateo chart's
    chart0.update();
    chart2.update();

}

// #slider
function slider() {
    /*  - oculta todos los DIVS a interactuar
        - mostrar n
        - btn avanza if (n+1 < largoSeleccionado) else reset count  */
    let count = 0;
    let sliders = $('#slider > div');
    console.log(sliders);// 2

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
            count++;
        }
    }

    cambiaSlider(); // primera vez
    // boton avanzar (100% ecologico)
    $('#slider .boton').off();
    $('#slider .boton').click(cambiaSlider);
    // Esto es 'Async'
    setInterval(cambiaSlider, 10000);
}

// .section1 footer lista
function lista(chart1) {
    // - variables -

    // - funciones -
    // manageLista
    function manageList() {

        // new Modal(id, titulo,contenido); (inicia html en el constructor)
        const modal = new Modal('modal--list', 'Selecciona alguien para la lista', `
            <input list="list-personas" placeholder="selecciona persona">
            <datalist id="list-personas">
                <!-- agrego dinamicamente nombres de mi array -->
            </datalist>
            <input type="button" value="Agregar" class="boton">
            <p class='msg'></p>`);
        modal.abre();

        // oculta y vacia msg
        $('.modal--list .msg').html('').hide();

        // imprime lista de personas
        personas.forEach(recorrePersonas);
        function recorrePersonas(elem) {
            $('.modal--list #list-personas').append(`<option value="${elem.nombre}">`);
        };

        // escucha en agregar addToList
        $('.modal--list .boton').click(addToList);
    }//fin maneja lista

    // addToList
    function addToList() {
        // nombre del input Datalist
        let nombre = $('.modal--list input*[list="list-personas"]').val();

        // obtengo persona seleccionada (xra saber su orientación)
        const personaSeleccionada = personas.find((persona) => persona.nombre == nombre);

        // pregunta si ya está agregado
        let personaRepetida = $(`.list [data-nombre*="${nombre}"]`).length > 0;
        // cubre campo vacío y agregar mal el nombre
        let personaNoExiste = $(`.modal--list option[value*="${nombre}"]`).length == 0;

        // oculta y vacia msg
        $('.modal--list .msg').html('').hide();

        // personaRepetida o personaNoExiste?
        if (personaRepetida || personaNoExiste) {
            let mensaje = personaRepetida ?
                'El nombre <mark>ya está asignado</mark>' :
                'Campo está <mark>vacío o incorrecto</mark>';
            $('.modal--list .msg').show().html(mensaje);
            $('.modal--list input*[list="list-personas"]').val('');
        } else {
            // agregar a lista persona
            $('.section1 .list').append(`
                <div data-nombre='${nombre}'>
                    <h2>${nombre}</h2>
                    <p>Orientación del perfil: ${personaSeleccionada.orientacion}</p>
                </div>`);
            // limpia input datalist
            $('.modal--list input*[list="list-personas"]').val('');

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
                        background: colorAnterior == 0 ? 'rgba(20, 184, 220, .1)' : 'rgba(255, 67, 101, .1)',
                        border: colorAnterior == 0 ? 'rgba(20, 184, 220, 1)' : 'rgba(255, 67, 101, 1)'
                    });
                    // 'rgba(248, 207, 62, 1)' rojo
                    // 'rgba(20, 184, 220, 1)' azul
                }
            }

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
function table(chart0, chart2) {
    /*  @Variables:
        - propAnterior
        @Funciones:
        - drawTable
        - orderTable
        - addToTable
        - edit/remove
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
                            <td data-id="${elem.id}">${elem.nombre}</td>
                            <td>${elem.genero}</td>
                            <td>${elem.feed}</td>
                            <td>${elem.media}</td>
                            <td>${elem.orientacion}</td>
                        </tr>`);
        }

        // limpio escuchas en las row's & re-agrego remove & edit
        $('#table tbody tr').off();
        $('#table tbody tr').dblclick(editPerson);// editPerson

    };// drawTable se auta ejecuta (al menos una vez)

    // orderTable
    function orderTable(e) {
        // prop es tomada del data-head, (usada para ordenar personas)
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
            - randomId
            - obtieneNewPerson
            - checkForm
            - add
            @escuchas */

        // randomId
        function randomId() {
            // mapeo y obtengo todos los ids
            const ids = personas.map(persona => persona.id);
            let randomId = 0, idsIncluyeNewId = true;
            // @HACER {randomId, re-asignar idsIncluyeNewId?} @MIENTRAS...
            do {
                randomId = Math.random();
                idsIncluyeNewId = ids.includes(randomId);
            } while (idsIncluyeNewId)
            return randomId;
        }
        // obtieneNewPerson
        function obtenerNewPersona() {
            const newPersona = {
                id: randomId(),
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
            const { nombre, orientacion } = obtenerNewPersona();

            // PARCHE 3.12.20 (soluciona agregado de diferente nombre + comparar 2 con mismo nombre)
            let debug = persona => persona.nombre == nombre;
            if (personas.some(debug)){$('.section2 .msg').html(`El nombre <mark>ya encuentra ingresado</mark>, escoge otro`); return false}
            // parche end ---

            // controla que nombre&orientación NO sean vacíos
            if (nombre == '' || orientacion == '') {
                $('.section2 .msg').html(`El campo <mark>${nombre == orientacion ? 'nombre y orientación están vacíos' : nombre == '' ? 'nombre es vacío' : 'orientación es vacío'}</mark>`);
                return false;
            } else { $('.section2 .msg').html('Todo en orden queen'); return true }
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

                // planDeCarrera$MediaDeSueldo actualiza chart0
                planDeCarrera$MediaDeSueldo(chart0, chart2);

                // almacenaPersonas in localStorage
                const storage = new StoragePersonas(personas);
                storage.guardar();
            }
        }
        // añade escucha focusout a nombre
        $('.section2 #orientacion, .section2 #nombre').focusout(checkForm);

        // añade escucha change(cambio) a range
        $('.section2 [type="range"]').change(function () {
            $(this).prev().text($(this).val());
        });

        // añade escucha click add...
        $('.section2 .boton').click(add);

    }// fin addToTable

    // editPerson
    function editPerson() {
        /* !Cumple dos funcionalidades, borra y edita */
        // obtengo data-id del nombre en el dom
        const buscado = this.children[0].getAttribute('data-id');

        // findIndex retorna el índice del primer elemento que retornemos verdadero
        const i = personas.findIndex(elem => elem.id == buscado);
        const newPersona = personas[i];
        const { nombre, genero, feed, media, orientacion } = newPersona;
        $('.section2 #nombre').val(nombre);
        $('.section2 input[type="radio"]:checked').val(genero);
        $('.section2 #feed').val(feed);
        $('.section2 #media').val(media);
        $('.section2 #orientacion').val(orientacion);
        // remueve persona en personas & nodo DOM
        personas.splice(i, 1);
        this.remove();

        // planDeCarrera$MediaDeSueldo actualiza chart0
        planDeCarrera$MediaDeSueldo(chart0, chart2);

        // almacenaPersonas in localStorage
        const storage = new StoragePersonas(personas);
        storage.guardar();
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
                // pasa a string la clave de persona, y pregunta si coincide con search (boolean)
                let match = String(persona[target]).toLocaleLowerCase().indexOf(search) != -1;

                /* -si encuentra muestra-
                (esto funciona ya que coincide el orden de las row del DOM con el orden del arreglo)*/
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

// fin funciones

// --- DOCUMENT READY ---
//$(ini);// cuidado dos ini? !Ahora ini inicia si personas resolve(ok)
// --- FUNCIÓN INI ---
function ini() {

    // las graficas son importadas
    setTimeout(function () {
        planDeCarrera$MediaDeSueldo(chart0, chart2);
    }, 100);
    //(esto tmbn maneja slider)
    // setTime para mantener animacion en chart2, por mas que le agregue datos al instanciarla no se animaba...
    // -------------------

    // --- navClick menú & secciones ---
    // oculto todo menos section1
    $('.main >*:not(.section1)').hide();
    $('.nav li').click(navClick);

    // --- main secciones... ---

    // .section1 main

    // .seccion1 footer add
    lista(chart1);

    // .seccion2 main (tabla)
    table(chart0, chart2);

    // --- aside ---
    // .pendientes, maneja pendientes
    pendientes();

}// fin ini
