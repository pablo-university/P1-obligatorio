    // CHART-0 ?probando
    var ct0 = document.getElementById('chart-0');
    var chart0 = new Chart(ct0, {
        type: 'line',
        data: {
            labels: ['a','a','a','a'],
            datasets: [{
                label: 'Media de sueldo',
                data: [0,0,0,0],
                backgroundColor: 'rgba(255, 67, 101, .2)',
                borderColor: 'rgba(255, 67, 101, 1)',
                pointBackgroundColor: 'rgba(255, 67, 101, 1)',
                pointBorderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            legend: {
                display: false
            }
        }
    });

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
            labels: [],//['Web', 'Diseño', 'Tecnología', 'Apps', 'Otro']
            datasets: [{
                data: [],//data: [5, 19, 3, 1, otro],//chart2Data
                backgroundColor: [
                    'rgba(20, 184, 220, .5)',//azul
                    'rgba(255, 67, 101, .5)',//rojo
                    'rgba(20, 184, 220, .2)',//azul
                    'rgba(255, 67, 101, .2)',//rojo
                    'rgba(100, 100, 100, .5)'//gris
                ],
                borderColor: 'rgba(255, 255, 255, 1)',
                borderWidth: 1
            }]

        },
        // Configuraciones
        options: {
            animation: {duration:1000},
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

export {chart0, chart1, chart2};
