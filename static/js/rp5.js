// rp5.js - Reporte 5: Frecuencia de Visitas de Socios

function loadReporte5() {
    configureFiltersForReporte5();
    loadTableDataReporte5();
}

function configureFiltersForReporte5() {
    const filterForm = document.getElementById('filterForm');
    filterForm.innerHTML = `
        <div class="filter-group">
            <label for="nombreSocio">Socio:</label>
            <input type="text" id="nombreSocio" name="nombreSocio" placeholder="Nombre, apellido o email...">
        </div>
        <div class="filter-group">
            <label for="fechaInicio">Desde:</label>
            <input type="date" id="fechaInicio" name="fechaInicio">
        </div>
        <div class="filter-group">
            <label for="fechaFin">Hasta:</label>
            <input type="date" id="fechaFin" name="fechaFin">
        </div>
        <div class="filter-group">
            <label for="tipoActividad">Tipo de actividad:</label>
            <select id="tipoActividad" name="tipoActividad">
                <option value="">Todas</option>
                <option value="rutina">Rutina</option>
                <option value="clase">Clase grupal</option>
            </select>
        </div>
        <div class="filter-group">
            <label for="planMembresia">Plan de membresía:</label>
            <select id="planMembresia" name="planMembresia">
                <option value="">Todos los planes</option>
                <option value="1">Básico</option>
                <option value="2">Estándar</option>
                <option value="3">Premium</option>
                <option value="4">VIP</option>
            </select>
        </div>
        <div class="filter-group">
            <button type="button" id="btnFiltrar">Aplicar Filtros</button>
            <button type="button" id="btnLimpiar">Limpiar Filtros</button>
        </div>
    `;

    // Re-attach event listeners after modifying the form
    document.getElementById('btnFiltrar').addEventListener('click', function() {
        loadTableDataReporte5();
    });

    document.getElementById('btnLimpiar').addEventListener('click', function() {
        document.getElementById('filterForm').reset();
        loadTableDataReporte5();
    });
}

// Datos de prueba basados en las tablas del DDL
const sociosData = [
    { id: 1, nombre: "Juan", apellido: "García", email: "juan.garcia@mail.com", id_plan: 1, fecha_inscripcion: "2024-12-15", activo: true },
    { id: 2, nombre: "María", apellido: "López", email: "maria.lopez@mail.com", id_plan: 2, fecha_inscripcion: "2025-01-10", activo: true },
    { id: 3, nombre: "Carlos", apellido: "Martínez", email: "carlos.martinez@mail.com", id_plan: 3, fecha_inscripcion: "2025-01-15", activo: true },
    { id: 4, nombre: "Ana", apellido: "Rodríguez", email: "ana.rodriguez@mail.com", id_plan: 4, fecha_inscripcion: "2025-01-20", activo: true },
    { id: 5, nombre: "Pedro", apellido: "Sánchez", email: "pedro.sanchez@mail.com", id_plan: 1, fecha_inscripcion: "2025-01-25", activo: false },
    { id: 6, nombre: "Laura", apellido: "Fernández", email: "laura.fernandez@mail.com", id_plan: 2, fecha_inscripcion: "2025-02-01", activo: true },
    { id: 7, nombre: "Javier", apellido: "González", email: "javier.gonzalez@mail.com", id_plan: 3, fecha_inscripcion: "2025-02-05", activo: true },
    { id: 8, nombre: "Sofía", apellido: "Torres", email: "sofia.torres@mail.com", id_plan: 4, fecha_inscripcion: "2025-02-10", activo: true },
    { id: 9, nombre: "Miguel", apellido: "Díaz", email: "miguel.diaz@mail.com", id_plan: 1, fecha_inscripcion: "2025-02-15", activo: true },
    { id: 10, nombre: "Lucía", apellido: "Pérez", email: "lucia.perez@mail.com", id_plan: 2, fecha_inscripcion: "2025-02-20", activo: true }
];

const planesData = [
    { id: 1, nombre: "Básico", precio_mensual: 35.00, acceso_24h: false, incluye_clases_grupales: false },
    { id: 2, nombre: "Estándar", precio_mensual: 55.00, acceso_24h: true, incluye_clases_grupales: false },
    { id: 3, nombre: "Premium", precio_mensual: 75.00, acceso_24h: true, incluye_clases_grupales: true },
    { id: 4, nombre: "VIP", precio_mensual: 120.00, acceso_24h: true, incluye_clases_grupales: true }
];

const registrosEntrenamientoData = [
    { id: 1, id_socio: 1, id_rutina: 1, fecha_hora_inicio: "2025-04-01T10:30:00", fecha_hora_fin: "2025-04-01T11:30:00", calorias_quemadas: 350 },
    { id: 2, id_socio: 1, id_rutina: 1, fecha_hora_inicio: "2025-04-03T15:00:00", fecha_hora_fin: "2025-04-03T16:00:00", calorias_quemadas: 400 },
    { id: 3, id_socio: 1, id_rutina: 2, fecha_hora_inicio: "2025-04-05T09:30:00", fecha_hora_fin: "2025-04-05T10:45:00", calorias_quemadas: 450 },
    { id: 4, id_socio: 2, id_rutina: 3, fecha_hora_inicio: "2025-04-02T14:00:00", fecha_hora_fin: "2025-04-02T14:30:00", calorias_quemadas: 280 },
    { id: 5, id_socio: 2, id_rutina: 3, fecha_hora_inicio: "2025-04-04T17:30:00", fecha_hora_fin: "2025-04-04T18:15:00", calorias_quemadas: 320 },
    { id: 6, id_socio: 3, id_rutina: 2, fecha_hora_inicio: "2025-04-01T11:00:00", fecha_hora_fin: "2025-04-01T12:15:00", calorias_quemadas: 420 },
    { id: 7, id_socio: 3, id_rutina: 4, fecha_hora_inicio: "2025-04-03T12:30:00", fecha_hora_fin: "2025-04-03T13:30:00", calorias_quemadas: 380 },
    { id: 8, id_socio: 3, id_rutina: 4, fecha_hora_inicio: "2025-04-05T16:00:00", fecha_hora_fin: "2025-04-05T17:15:00", calorias_quemadas: 410 },
    { id: 9, id_socio: 4, id_rutina: 5, fecha_hora_inicio: "2025-04-02T08:00:00", fecha_hora_fin: "2025-04-02T09:00:00", calorias_quemadas: 330 },
    { id: 10, id_socio: 4, id_rutina: 5, fecha_hora_inicio: "2025-04-04T10:30:00", fecha_hora_fin: "2025-04-04T11:30:00", calorias_quemadas: 360 },
    { id: 11, id_socio: 4, id_rutina: 1, fecha_hora_inicio: "2025-04-06T15:00:00", fecha_hora_fin: "2025-04-06T16:00:00", calorias_quemadas: 390 },
    { id: 12, id_socio: 4, id_rutina: 1, fecha_hora_inicio: "2025-04-08T14:00:00", fecha_hora_fin: "2025-04-08T15:00:00", calorias_quemadas: 380 },
    { id: 13, id_socio: 5, id_rutina: 2, fecha_hora_inicio: "2025-04-01T18:00:00", fecha_hora_fin: "2025-04-01T19:00:00", calorias_quemadas: 370 },
    { id: 14, id_socio: 6, id_rutina: 3, fecha_hora_inicio: "2025-04-03T09:00:00", fecha_hora_fin: "2025-04-03T10:00:00", calorias_quemadas: 310 },
    { id: 15, id_socio: 6, id_rutina: 3, fecha_hora_inicio: "2025-04-05T12:00:00", fecha_hora_fin: "2025-04-05T13:00:00", calorias_quemadas: 340 },
    { id: 16, id_socio: 7, id_rutina: 4, fecha_hora_inicio: "2025-04-02T19:00:00", fecha_hora_fin: "2025-04-02T20:00:00", calorias_quemadas: 400 },
    { id: 17, id_socio: 8, id_rutina: 5, fecha_hora_inicio: "2025-04-04T07:30:00", fecha_hora_fin: "2025-04-04T08:30:00", calorias_quemadas: 320 },
    { id: 18, id_socio: 8, id_rutina: 5, fecha_hora_inicio: "2025-04-06T08:00:00", fecha_hora_fin: "2025-04-06T09:00:00", calorias_quemadas: 330 },
    { id: 19, id_socio: 9, id_rutina: 1, fecha_hora_inicio: "2025-04-01T13:30:00", fecha_hora_fin: "2025-04-01T14:30:00", calorias_quemadas: 290 },
    { id: 20, id_socio: 10, id_rutina: 2, fecha_hora_inicio: "2025-04-03T17:00:00", fecha_hora_fin: "2025-04-03T18:00:00", calorias_quemadas: 380 }
];

const clasesGrupalesData = [
    { id: 1, nombre_clase: "Spinning Matutino", id_entrenador: 1, id_sala: 2, fecha_hora_inicio: "2025-04-01T08:00:00", duracion_min: 45, capacidad_max: 20, tipo_clase: "Spinning" },
    { id: 2, nombre_clase: "Yoga Suave", id_entrenador: 2, id_sala: 4, fecha_hora_inicio: "2025-04-01T10:00:00", duracion_min: 60, capacidad_max: 15, tipo_clase: "Yoga" },
    { id: 3, nombre_clase: "HIIT Extremo", id_entrenador: 3, id_sala: 3, fecha_hora_inicio: "2025-04-01T18:00:00", duracion_min: 30, capacidad_max: 25, tipo_clase: "HIIT" },
    { id: 4, nombre_clase: "Pilates Básico", id_entrenador: 4, id_sala: 4, fecha_hora_inicio: "2025-04-02T09:00:00", duracion_min: 60, capacidad_max: 15, tipo_clase: "Pilates" },
    { id: 5, nombre_clase: "Zumba Fitness", id_entrenador: 5, id_sala: 3, fecha_hora_inicio: "2025-04-02T17:00:00", duracion_min: 45, capacidad_max: 30, tipo_clase: "Zumba" },
    { id: 6, nombre_clase: "Crossfit Challenge", id_entrenador: 6, id_sala: 3, fecha_hora_inicio: "2025-04-03T07:00:00", duracion_min: 50, capacidad_max: 20, tipo_clase: "Crossfit" },
    { id: 7, nombre_clase: "Spinning Intenso", id_entrenador: 1, id_sala: 2, fecha_hora_inicio: "2025-04-03T19:00:00", duracion_min: 45, capacidad_max: 20, tipo_clase: "Spinning" },
    { id: 8, nombre_clase: "Yoga Avanzado", id_entrenador: 2, id_sala: 4, fecha_hora_inicio: "2025-04-04T16:00:00", duracion_min: 75, capacidad_max: 10, tipo_clase: "Yoga" },
    { id: 9, nombre_clase: "HIIT Principiantes", id_entrenador: 3, id_sala: 3, fecha_hora_inicio: "2025-04-05T10:00:00", duracion_min: 30, capacidad_max: 20, tipo_clase: "HIIT" },
    { id: 10, nombre_clase: "Pilates Avanzado", id_entrenador: 4, id_sala: 4, fecha_hora_inicio: "2025-04-05T12:00:00", duracion_min: 60, capacidad_max: 12, tipo_clase: "Pilates" }
];

const sociosClasesData = [
    { id: 1, id_socio: 1, id_clase: 1, fecha_inscripcion: "2025-03-30T12:00:00", asistio: true },
    { id: 2, id_socio: 1, id_clase: 3, fecha_inscripcion: "2025-03-30T14:30:00", asistio: true },
    { id: 3, id_socio: 2, id_clase: 2, fecha_inscripcion: "2025-03-31T09:00:00", asistio: true },
    { id: 4, id_socio: 2, id_clase: 5, fecha_inscripcion: "2025-04-01T10:00:00", asistio: true },
    { id: 5, id_socio: 3, id_clase: 6, fecha_inscripcion: "2025-04-02T16:00:00", asistio: true },
    { id: 6, id_socio: 3, id_clase: 7, fecha_inscripcion: "2025-04-02T17:30:00", asistio: true },
    { id: 7, id_socio: 3, id_clase: 8, fecha_inscripcion: "2025-04-03T11:00:00", asistio: true },
    { id: 8, id_socio: 4, id_clase: 9, fecha_inscripcion: "2025-04-04T15:00:00", asistio: true },
    { id: 9, id_socio: 4, id_clase: 10, fecha_inscripcion: "2025-04-04T16:30:00", asistio: true },
    { id: 10, id_socio: 6, id_clase: 1, fecha_inscripcion: "2025-03-30T13:00:00", asistio: true },
    { id: 11, id_socio: 6, id_clase: 5, fecha_inscripcion: "2025-04-01T10:30:00", asistio: true },
    { id: 12, id_socio: 7, id_clase: 3, fecha_inscripcion: "2025-03-30T15:00:00", asistio: true },
    { id: 13, id_socio: 7, id_clase: 6, fecha_inscripcion: "2025-04-02T16:30:00", asistio: true },
    { id: 14, id_socio: 7, id_clase: 9, fecha_inscripcion: "2025-04-04T15:30:00", asistio: true },
    { id: 15, id_socio: 8, id_clase: 2, fecha_inscripcion: "2025-03-31T09:30:00", asistio: true },
    { id: 16, id_socio: 8, id_clase: 8, fecha_inscripcion: "2025-04-03T11:30:00", asistio: true },
    { id: 17, id_socio: 9, id_clase: 4, fecha_inscripcion: "2025-04-01T18:00:00", asistio: true },
    { id: 18, id_socio: 10, id_clase: 7, fecha_inscripcion: "2025-04-02T18:00:00", asistio: true },
    { id: 19, id_socio: 10, id_clase: 10, fecha_inscripcion: "2025-04-04T17:00:00", asistio: true },
    { id: 20, id_socio: 10, id_clase: 1, fecha_inscripcion: "2025-03-30T13:30:00", asistio: false }
];

function loadTableDataReporte5() {
    // Obtener valores de los filtros
    const nombreSocio = document.getElementById('nombreSocio').value.toLowerCase();
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;
    const tipoActividad = document.getElementById('tipoActividad').value;
    const planMembresia = document.getElementById('planMembresia').value;

    // Calcular frecuencia de visitas por socio
    const visitasPorSocio = sociosData.map(socio => {
        // Filtrar por nombre, apellido o email del socio
        if (nombreSocio && 
            !socio.nombre.toLowerCase().includes(nombreSocio) && 
            !socio.apellido.toLowerCase().includes(nombreSocio) && 
            !socio.email.toLowerCase().includes(nombreSocio)) {
            return null;
        }

        // Filtrar por plan de membresía
        if (planMembresia && socio.id_plan.toString() !== planMembresia) {
            return null;
        }

        // Contar registros de entrenamiento (rutinas)
        const entrenamientos = tipoActividad === 'clase' ? [] : 
            registrosEntrenamientoData.filter(registro => {
                const esDelSocio = registro.id_socio === socio.id;
                const fechaRegStr = registro.fecha_hora_inicio.split('T')[0];
                const cumpleFechaInicio = !fechaInicio || fechaRegStr >= fechaInicio;
                const cumpleFechaFin = !fechaFin || fechaRegStr <= fechaFin;
                return esDelSocio && cumpleFechaInicio && cumpleFechaFin;
            });

        // Contar clases asistidas
        const clases = tipoActividad === 'rutina' ? [] : 
            sociosClasesData.filter(sc => {
                if (sc.id_socio !== socio.id || !sc.asistio) return false;
                
                const fechaRegistroStr = sc.fecha_inscripcion.split('T')[0];
                const cumpleFechaInicio = !fechaInicio || fechaRegistroStr >= fechaInicio;
                const cumpleFechaFin = !fechaFin || fechaRegistroStr <= fechaFin;
                
                return cumpleFechaInicio && cumpleFechaFin;
            });

        // Si no hay visitas según los filtros, excluir este socio
        if (entrenamientos.length === 0 && clases.length === 0) {
            return null;
        }

        // Obtener el nombre del plan
        const plan = planesData.find(p => p.id === socio.id_plan);

        return {
            id: socio.id,
            nombre: socio.nombre,
            apellido: socio.apellido,
            email: socio.email,
            plan: plan ? plan.nombre : 'N/A',
            entrenamientosCount: entrenamientos.length,
            clasesCount: clases.length,
            totalVisitas: entrenamientos.length + clases.length,
            fechaUltimaVisita: getUltimaFechaVisita(entrenamientos, clases)
        };
    }).filter(item => item !== null);

    // Ordenar por número total de visitas (descendente)
    visitasPorSocio.sort((a, b) => b.totalVisitas - a.totalVisitas);

    // Actualizar tabla
    updateTableWithData5(visitasPorSocio);
    
    // Actualizar gráfico si está activo
    if (document.getElementById('chartView').classList.contains('active')) {
        renderChartReporte5(visitasPorSocio);
    }
}

function getUltimaFechaVisita(entrenamientos, clases) {
    let ultimaFecha = null;
    
    // Revisar fechas de entrenamientos
    entrenamientos.forEach(entrenamiento => {
        const fechaEntrenamiento = new Date(entrenamiento.fecha_hora_inicio);
        if (!ultimaFecha || fechaEntrenamiento > ultimaFecha) {
            ultimaFecha = fechaEntrenamiento;
        }
    });
    
    // Revisar fechas de clases
    clases.forEach(clase => {
        const claseData = clasesGrupalesData.find(c => c.id === clase.id_clase);
        if (claseData) {
            const fechaClase = new Date(claseData.fecha_hora_inicio);
            if (!ultimaFecha || fechaClase > ultimaFecha) {
                ultimaFecha = fechaClase;
            }
        }
    });
    
    // Formatear fecha para visualización
    if (ultimaFecha) {
        return ultimaFecha.toISOString().split('T')[0];
    }
    
    return 'N/A';
}

function updateTableWithData5(data) {
    const tableHead = document.querySelector('#resultsTable thead');
    const tableBody = document.getElementById('tableBody');
    
    // Actualizar encabezados
    tableHead.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Plan</th>
            <th>Rutinas</th>
            <th>Clases</th>
            <th>Total Visitas</th>
            <th>Última Visita</th>
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
            <td>${item.id}</td>
            <td>${item.nombre} ${item.apellido}</td>
            <td>${item.email}</td>
            <td>${item.plan}</td>
            <td>${item.entrenamientosCount}</td>
            <td>${item.clasesCount}</td>
            <td>${item.totalVisitas}</td>
            <td>${item.fechaUltimaVisita}</td>
        `;
        tableBody.appendChild(tr);
    });
    
    document.getElementById('pageInfo').textContent = `Página ${currentPage} de ${totalPages}`;
    
    // Actualizar botones de paginación
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

function renderChartReporte5(data) {
    const ctx = document.getElementById('reportChart').getContext('2d');
    
    // Destruir gráfico existente si hay uno
    if (window.reportChart && typeof window.reportChart.destroy === 'function') {
        window.reportChart.destroy();
    }
    
    // Preparar datos para histograma
    const frecuencias = {};
    data.forEach(socio => {
        const visitas = socio.totalVisitas;
        frecuencias[visitas] = (frecuencias[visitas] || 0) + 1;
    });
    
    // Obtener rangos ordenados de visitas (eje X)
    const visitasRangos = Object.keys(frecuencias).sort((a, b) => a - b);
    
    // Obtener cantidad de socios en cada rango (eje Y)
    const cantidadSocios = visitasRangos.map(visitas => frecuencias[visitas]);
    
    // Crear etiquetas más descriptivas
    const labels = visitasRangos.map(visitas => `${visitas} visita${visitas > 1 ? 's' : ''}`);
    
    // Crear histograma
    window.reportChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Cantidad de socios',
                    data: cantidadSocios,
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Cantidad de socios'
                    },
                    ticks: {
                        precision: 0 // Asegurar que solo se muestren enteros
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Número de visitas'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Distribución de visitas por socios',
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            const item = tooltipItems[0];
                            return `${item.label}`;
                        },
                        label: function(context) {
                            const sociosCount = context.raw;
                            return `${sociosCount} socio${sociosCount > 1 ? 's' : ''}`;
                        }
                    }
                }
            }
        }
    });
}

// Expose function for script.js to call
window.loadReporte5 = loadReporte5;