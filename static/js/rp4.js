// rp4.js - Reporte 4: Uso y Tiempos de Equipos

function loadReporte4() {
    configureFiltersForReporte4();
    loadTableDataReporte4();
}

function configureFiltersForReporte4() {
    const filterForm = document.getElementById('filterForm');
    filterForm.innerHTML = `
        <div class="filter-group">
            <label for="nombreEquipo">Equipo:</label>
            <input type="text" id="nombreEquipo" name="nombreEquipo" placeholder="Nombre del equipo...">
        </div>
        <div class="filter-group">
            <label for="marca">Marca:</label>
            <select id="marca" name="marca">
                <option value="">Todas las marcas</option>
                <option value="Life Fitness">Life Fitness</option>
                <option value="Technogym">Technogym</option>
                <option value="Precor">Precor</option>
                <option value="Hammer Strength">Hammer Strength</option>
                <option value="Reebok">Reebok</option>
            </select>
        </div>
        <div class="filter-group">
            <label for="modelo">Modelo:</label>
            <input type="text" id="modelo" name="modelo" placeholder="Modelo...">
        </div>
        <div class="filter-group">
            <label for="sala">Sala:</label>
            <select id="sala" name="sala">
                <option value="">Todas las salas</option>
                <option value="1">Sala de Pesas</option>
                <option value="2">Área Cardiovascular</option>
                <option value="3">Zona Funcional</option>
                <option value="4">Estudio de Yoga</option>
                <option value="5">Sala de Máquinas</option>
            </select>
        </div>
        <div class="filter-group">
            <label for="fechaInicioRutina">Fecha inicio rutina:</label>
            <input type="date" id="fechaInicioRutina" name="fechaInicioRutina">
        </div>
        <div class="filter-group">
            <label for="fechaFinRutina">Fecha fin rutina:</label>
            <input type="date" id="fechaFinRutina" name="fechaFinRutina">
        </div>
        <div class="filter-group">
            <label for="tipoEjercicio">Tipo de ejercicio:</label>
            <select id="tipoEjercicio" name="tipoEjercicio">
                <option value="">Todos los tipos</option>
                <option value="Fuerza">Fuerza</option>
                <option value="Resistencia">Resistencia</option>
                <option value="Potencia">Potencia</option>
                <option value="Movilidad">Movilidad</option>
            </select>
        </div>
        <div class="filter-group">
            <button type="button" id="btnFiltrar">Aplicar Filtros</button>
            <button type="button" id="btnLimpiar">Limpiar Filtros</button>
        </div>
    `;

    // Re-attach event listeners after modifying the form
    document.getElementById('btnFiltrar').addEventListener('click', function() {
        loadTableDataReporte4();
    });

    document.getElementById('btnLimpiar').addEventListener('click', function() {
        document.getElementById('filterForm').reset();
        loadTableDataReporte4();
    });
}

// Datos de prueba basados en las tablas del DDL
const equiposData = [
    { id: 1, nombre: "Prensa de piernas", marca: "Life Fitness", modelo: "LP500", id_sala: 1, estado: "Bueno" },
    { id: 2, nombre: "Cinta de correr", marca: "Technogym", modelo: "Run700", id_sala: 2, estado: "Nuevo" },
    { id: 3, nombre: "Banco plano", marca: "Hammer Strength", modelo: "BF-610", id_sala: 1, estado: "Bueno" },
    { id: 4, nombre: "Mancuernas", marca: "Reebok", modelo: "Hex 5-30kg", id_sala: 3, estado: "Regular" },
    { id: 5, nombre: "Bicicleta estática", marca: "Precor", modelo: "UBK 615", id_sala: 2, estado: "Bueno" },
    { id: 6, nombre: "Máquina de remo", marca: "Concept2", modelo: "Model D", id_sala: 2, estado: "Nuevo" },
    { id: 7, nombre: "Polea alta", marca: "Hammer Strength", modelo: "PL-255", id_sala: 1, estado: "Bueno" },
    { id: 8, nombre: "TRX", marca: "TRX", modelo: "Pro4", id_sala: 3, estado: "Bueno" },
    { id: 9, nombre: "Elíptica", marca: "Life Fitness", modelo: "E5", id_sala: 2, estado: "Regular" },
    { id: 10, nombre: "Pesa rusa", marca: "Reebok", modelo: "Pro 4-32kg", id_sala: 3, estado: "Bueno" }
];

const salasData = [
    { id: 1, nombre: "Sala de Pesas", capacidad: 40 },
    { id: 2, nombre: "Área Cardiovascular", capacidad: 30 },
    { id: 3, nombre: "Zona Funcional", capacidad: 25 },
    { id: 4, nombre: "Estudio de Yoga", capacidad: 20 },
    { id: 5, nombre: "Sala de Máquinas", capacidad: 35 }
];

const ejerciciosData = [
    { id: 1, nombre: "Press de piernas", grupo_muscular: "Piernas", tipo_ejercicio: "Fuerza", id_equipo: 1 },
    { id: 2, nombre: "Carrera 5k", grupo_muscular: "Cardio", tipo_ejercicio: "Resistencia", id_equipo: 2 },
    { id: 3, nombre: "Press de banca", grupo_muscular: "Pecho", tipo_ejercicio: "Fuerza", id_equipo: 3 },
    { id: 4, nombre: "Curl de bíceps", grupo_muscular: "Brazos", tipo_ejercicio: "Fuerza", id_equipo: 4 },
    { id: 5, nombre: "Ciclismo estático", grupo_muscular: "Piernas", tipo_ejercicio: "Resistencia", id_equipo: 5 },
    { id: 6, nombre: "Remo", grupo_muscular: "Espalda", tipo_ejercicio: "Potencia", id_equipo: 6 },
    { id: 7, nombre: "Jalón al pecho", grupo_muscular: "Espalda", tipo_ejercicio: "Fuerza", id_equipo: 7 },
    { id: 8, nombre: "TRX Rows", grupo_muscular: "Espalda", tipo_ejercicio: "Fuerza", id_equipo: 8 },
    { id: 9, nombre: "Elíptica HIIT", grupo_muscular: "Cardio", tipo_ejercicio: "Resistencia", id_equipo: 9 },
    { id: 10, nombre: "Swing", grupo_muscular: "Cuerpo completo", tipo_ejercicio: "Potencia", id_equipo: 10 },
    { id: 11, nombre: "Sentadilla con barra", grupo_muscular: "Piernas", tipo_ejercicio: "Fuerza", id_equipo: 4 },
    { id: 12, nombre: "Zancadas", grupo_muscular: "Piernas", tipo_ejercicio: "Fuerza", id_equipo: 4 }
];

const rutinasData = [
    { id: 1, nombre: "Full Body Principiante", nivel: "Principiante", duracion_estimada_min: 45, fecha_creacion: "2025-01-10" },
    { id: 2, nombre: "Definición Avanzada", nivel: "Avanzado", duracion_estimada_min: 60, fecha_creacion: "2025-02-15" },
    { id: 3, nombre: "Cardio HIIT", nivel: "Intermedio", duracion_estimada_min: 30, fecha_creacion: "2025-03-20" },
    { id: 4, nombre: "Upper Body", nivel: "Intermedio", duracion_estimada_min: 45, fecha_creacion: "2025-04-05" },
    { id: 5, nombre: "Lower Body", nivel: "Intermedio", duracion_estimada_min: 45, fecha_creacion: "2025-05-01" }
];

const rutinaEjerciciosData = [
    { id_rutina: 1, id_ejercicio: 3, series: 3, repeticiones: 12 },
    { id_rutina: 1, id_ejercicio: 4, series: 3, repeticiones: 15 },
    { id_rutina: 1, id_ejercicio: 7, series: 3, repeticiones: 10 },
    { id_rutina: 1, id_ejercicio: 11, series: 3, repeticiones: 12 },
    { id_rutina: 2, id_ejercicio: 1, series: 4, repeticiones: 10 },
    { id_rutina: 2, id_ejercicio: 3, series: 4, repeticiones: 8 },
    { id_rutina: 2, id_ejercicio: 7, series: 4, repeticiones: 10 },
    { id_rutina: 2, id_ejercicio: 4, series: 4, repeticiones: 12 },
    { id_rutina: 2, id_ejercicio: 10, series: 4, repeticiones: 15 },
    { id_rutina: 3, id_ejercicio: 2, series: 1, repeticiones: 1 },
    { id_rutina: 3, id_ejercicio: 5, series: 1, repeticiones: 1 },
    { id_rutina: 3, id_ejercicio: 9, series: 1, repeticiones: 1 },
    { id_rutina: 4, id_ejercicio: 3, series: 4, repeticiones: 10 },
    { id_rutina: 4, id_ejercicio: 4, series: 3, repeticiones: 12 },
    { id_rutina: 4, id_ejercicio: 7, series: 4, repeticiones: 10 },
    { id_rutina: 4, id_ejercicio: 8, series: 3, repeticiones: 15 },
    { id_rutina: 5, id_ejercicio: 1, series: 4, repeticiones: 12 },
    { id_rutina: 5, id_ejercicio: 11, series: 4, repeticiones: 10 },
    { id_rutina: 5, id_ejercicio: 12, series: 3, repeticiones: 12 }
];

// Función para generar el reporte
function loadTableDataReporte4() {
    // Obtener valores de los filtros
    const nombreEquipo = document.getElementById('nombreEquipo').value.toLowerCase();
    const marca = document.getElementById('marca').value;
    const modelo = document.getElementById('modelo').value.toLowerCase();
    const sala = document.getElementById('sala').value;
    const fechaInicio = document.getElementById('fechaInicioRutina').value;
    const fechaFin = document.getElementById('fechaFinRutina').value;
    const tipoEjercicio = document.getElementById('tipoEjercicio').value;

    // Calcular estadísticas de equipos basado en los datos de prueba
    const equiposUso = equiposData.map(equipo => {
        // Filtrar por nombre, marca, modelo y sala del equipo
        if ((nombreEquipo && !equipo.nombre.toLowerCase().includes(nombreEquipo)) ||
            (marca && equipo.marca !== marca) ||
            (modelo && !equipo.modelo.toLowerCase().includes(modelo)) ||
            (sala && equipo.id_sala.toString() !== sala)) {
            return null;
        }

        // Obtener ejercicios que usan este equipo
        const ejerciciosDelEquipo = ejerciciosData.filter(ejercicio => 
            ejercicio.id_equipo === equipo.id && 
            (!tipoEjercicio || ejercicio.tipo_ejercicio === tipoEjercicio)
        );

        if (ejerciciosDelEquipo.length === 0) {
            return null;
        }

        // Obtener rutinas que incluyen estos ejercicios
        let usosTotales = 0;
        let duracionTotal = 0;
        let rutinasQueUsan = new Set();

        ejerciciosDelEquipo.forEach(ejercicio => {
            rutinaEjerciciosData.forEach(rutinaEjercicio => {
                if (rutinaEjercicio.id_ejercicio === ejercicio.id) {
                    const rutina = rutinasData.find(r => r.id === rutinaEjercicio.id_rutina);
                    
                    // Filtrar por fecha de creación de rutina
                    if (fechaInicio && rutina.fecha_creacion < fechaInicio) return;
                    if (fechaFin && rutina.fecha_creacion > fechaFin) return;
                    
                    usosTotales++;
                    duracionTotal += rutina.duracion_estimada_min;
                    rutinasQueUsan.add(rutina.id);
                }
            });
        });

        if (usosTotales === 0) {
            return null;
        }

        // Obtener el nombre de la sala
        const nombreSala = salasData.find(s => s.id === equipo.id_sala).nombre;

        return {
            id: equipo.id,
            nombre: equipo.nombre,
            marca: equipo.marca,
            modelo: equipo.modelo,
            sala: nombreSala,
            usos: usosTotales,
            duracionTotal: duracionTotal,
            duracionMedia: Math.round(duracionTotal / usosTotales),
            rutinasUnicas: rutinasQueUsan.size
        };
    }).filter(item => item !== null);

    // Actualizar tabla
    updateTableWithData(equiposUso);
    
    // Actualizar gráfico si está activo
    if (document.getElementById('chartView').classList.contains('active')) {
        renderChartReporte4(equiposUso);
    }
}

function updateTableWithData(data) {
    const tableHead = document.querySelector('#resultsTable thead');
    const tableBody = document.getElementById('tableBody');
    
    // Actualizar encabezados
    tableHead.innerHTML = `
        <tr>
            <th>Equipo</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Sala</th>
            <th>Usos en Rutinas</th>
            <th>Duración Total (min)</th>
            <th>Duración Media (min)</th>
            <th>Rutinas Únicas</th>
        </tr>
    `;
    
    // Limpiar tabla
    tableBody.innerHTML = '';
    
    // Si no hay datos
    if (data.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="8" class="no-data">No se encontraron datos con los filtros aplicados</td>';
        tableBody.appendChild(tr);
        document.getElementById('pageInfo').textContent = 'Página 0 de 0';
        return;
    }
    
    // Calcular paginación
    currentPage = 1;
    totalPages = Math.ceil(data.length / rowsPerPage);
    
    // Mostrar solo los datos de la página actual
    const start = (currentPage - 1) * rowsPerPage;
    const end = Math.min(start + rowsPerPage, data.length);
    const pageData = data.slice(start, end);
    
    // Llenar tabla con datos
    pageData.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.nombre}</td>
            <td>${item.marca}</td>
            <td>${item.modelo}</td>
            <td>${item.sala}</td>
            <td>${item.usos}</td>
            <td>${item.duracionTotal}</td>
            <td>${item.duracionMedia}</td>
            <td>${item.rutinasUnicas}</td>
        `;
        tableBody.appendChild(tr);
    });
    
    document.getElementById('pageInfo').textContent = `Página ${currentPage} de ${totalPages}`;
    
    // Actualizar botones de paginación
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

function renderChartReporte4(data) {
    const ctx = document.getElementById('reportChart').getContext('2d');
    
    // Destruir gráfico existente si hay uno
    if (window.reportChart && typeof window.reportChart.destroy === 'function') {
        window.reportChart.destroy();
    }
    
    // Ordenar datos por número de usos descendente para mejor visualización
    const sortedData = [...data].sort((a, b) => b.usos - a.usos);
    
    // Limitar a los 10 más usados para no saturar el gráfico
    const chartData = sortedData.slice(0, 10);
    
    // Preparar datos para el gráfico
    const labels = chartData.map(item => `${item.nombre} (${item.marca})`);
    const usosData = chartData.map(item => item.usos);
    const duracionData = chartData.map(item => item.duracionMedia);
    
    // Crear gráfico
    window.reportChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Número de usos en rutinas',
                    data: usosData,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const index = context.dataIndex;
                            return `Duración media: ${duracionData[index]} min`;
                        }
                    }
                }
            }
        }
    });
}

// Expose function for script.js to call
window.loadReporte4 = loadReporte4;