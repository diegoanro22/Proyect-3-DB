// Reporte de estado y uso de equipos

function loadReporte1() {
    // Para evitar conflictos con otras variables globales
    try {
        console.log("Cargando Reporte 1...");
        configureFiltersForReporte1();
        loadTableDataReporte1();
    } catch (error) {
        console.error("Error al cargar Reporte 1", error);
    }
}

function configureFiltersForReporte1() {
    const filterForm = document.getElementById('filterForm');
    
    // Verificar si filterForm existe antes de continuar
    if (!filterForm) {
        console.error("Elemento 'filterForm' no encontrado");
        return;
    }
    
    filterForm.innerHTML = `
        <div class="filter-group">
            <label for="estadoEquipo">Estado:</label>
            <select id="estadoEquipo" name="estadoEquipo">
                <option value="">Todos</option>
                <option value="Bueno">Bueno</option>
                <option value="Regular">Regular</option>
                <option value="Malo">Malo</option>
                <option value="Fuera de servicio">Fuera de servicio</option>
            </select>
        </div>
        <div class="filter-group">
            <label for="sala">Sala:</label>
            <select id="sala" name="sala">
                <option value="">Todas</option>
                ${salasData.map(sala => `<option value="${sala.id}">${sala.nombre}</option>`).join('')}
            </select>
        </div>
        <div class="filter-group">
            <label for="tipoEjercicio">Tipo Ejercicio:</label>
            <select id="tipoEjercicio" name="tipoEjercicio">
                <option value="">Todos</option>
                <option value="Fuerza">Fuerza</option>
                <option value="Cardio">Cardio</option>
                <option value="Flexibilidad">Flexibilidad</option>
                <option value="Equilibrio">Equilibrio</option>
            </select>
        </div>
        <div class="filter-group">
            <label for="fechaAdquisicionDesde">Adquirido desde:</label>
            <input type="date" id="fechaAdquisicionDesde" name="fechaAdquisicionDesde">
        </div>
        <div class="filter-group">
            <label for="fechaAdquisicionHasta">Adquirido hasta:</label>
            <input type="date" id="fechaAdquisicionHasta" name="fechaAdquisicionHasta">
        </div>
        <div class="filter-group">
            <label for="tipoVisualizacion">Gráfica:</label>
            <select id="tipoVisualizacion" name="tipoVisualizacion">
                <option value="pastel">Porcentaje de equipos por estado</option>
                <option value="barras">Número de equipos activos por sala</option>
            </select>
        </div>
        <div class="filter-group">
            <button type="button" id="btnFiltrar">Aplicar Filtros</button>
            <button type="button" id="btnLimpiar">Limpiar Filtros</button>
        </div>
    `;

    // Re-attach event listeners con verificación
    const btnFiltrar = document.getElementById('btnFiltrar');
    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', function() {
            loadTableDataReporte1();
        });
    }

    const btnLimpiar = document.getElementById('btnLimpiar');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', function() {
            const filterForm = document.getElementById('filterForm');
            if (filterForm) filterForm.reset();
            loadTableDataReporte1();
        });
    }
}

// Datos específicos para el reporte 4
const salassData = [
    { id: 1, nombre: "Sala Principal", capacidad: 50 },
    { id: 2, nombre: "Sala de Cardio", capacidad: 30 },
    { id: 3, nombre: "Sala de Pesas", capacidad: 25 },
    { id: 4, nombre: "Sala Funcional", capacidad: 20 },
    { id: 5, nombre: "Sala de Spinning", capacidad: 15 }
];

const equipossData = [
    { id: 1, nombre: "Cinta de Correr Pro 3000", id_sala: 2, estado: "Bueno", tipo_ejercicio: "Cardio", fecha_adquisicion: "2024-01-10", ultimo_mantenimiento: "2025-01-05" },
    { id: 2, nombre: "Bicicleta Estática Elite 500", id_sala: 2, estado: "Bueno", tipo_ejercicio: "Cardio", fecha_adquisicion: "2024-02-15", ultimo_mantenimiento: "2025-01-10" },
    { id: 3, nombre: "Elíptica CrossTrainer", id_sala: 2, estado: "Regular", tipo_ejercicio: "Cardio", fecha_adquisicion: "2023-08-20", ultimo_mantenimiento: "2024-12-15" },
    { id: 4, nombre: "Máquina Smith", id_sala: 3, estado: "Bueno", tipo_ejercicio: "Fuerza", fecha_adquisicion: "2024-03-05", ultimo_mantenimiento: "2025-01-15" },
    { id: 5, nombre: "Prensa de Piernas", id_sala: 3, estado: "Malo", tipo_ejercicio: "Fuerza", fecha_adquisicion: "2022-11-12", ultimo_mantenimiento: "2024-11-20" },
    { id: 6, nombre: "Banco Ajustable", id_sala: 3, estado: "Bueno", tipo_ejercicio: "Fuerza", fecha_adquisicion: "2024-04-22", ultimo_mantenimiento: "2025-01-20" },
    { id: 7, nombre: "TRX Suspension", id_sala: 4, estado: "Bueno", tipo_ejercicio: "Equilibrio", fecha_adquisicion: "2024-05-18", ultimo_mantenimiento: "2025-02-01" },
    { id: 8, nombre: "Barra Olímpica", id_sala: 3, estado: "Regular", tipo_ejercicio: "Fuerza", fecha_adquisicion: "2023-09-30", ultimo_mantenimiento: "2024-12-10" },
    { id: 9, nombre: "Kettlebell Set", id_sala: 4, estado: "Bueno", tipo_ejercicio: "Fuerza", fecha_adquisicion: "2024-06-15", ultimo_mantenimiento: "2025-02-05" },
    { id: 10, nombre: "Rowing Machine", id_sala: 2, estado: "Fuera de servicio", tipo_ejercicio: "Cardio", fecha_adquisicion: "2022-05-20", ultimo_mantenimiento: "2024-10-30" },
    { id: 11, nombre: "Multiestación", id_sala: 1, estado: "Bueno", tipo_ejercicio: "Fuerza", fecha_adquisicion: "2024-07-08", ultimo_mantenimiento: "2025-02-10" },
    { id: 12, nombre: "Escalador Vertical", id_sala: 2, estado: "Regular", tipo_ejercicio: "Cardio", fecha_adquisicion: "2023-10-25", ultimo_mantenimiento: "2024-12-20" },
    { id: 13, nombre: "Banco Abdominal", id_sala: 1, estado: "Malo", tipo_ejercicio: "Fuerza", fecha_adquisicion: "2022-08-15", ultimo_mantenimiento: "2024-11-15" },
    { id: 14, nombre: "Bicicleta de Spinning", id_sala: 5, estado: "Bueno", tipo_ejercicio: "Cardio", fecha_adquisicion: "2024-08-30", ultimo_mantenimiento: "2025-02-15" },
    { id: 15, nombre: "Step Platforms", id_sala: 4, estado: "Regular", tipo_ejercicio: "Cardio", fecha_adquisicion: "2023-11-05", ultimo_mantenimiento: "2024-12-25" },
    { id: 16, nombre: "Mancuernas Set", id_sala: 1, estado: "Bueno", tipo_ejercicio: "Fuerza", fecha_adquisicion: "2024-09-12", ultimo_mantenimiento: "2025-02-20" },
    { id: 17, nombre: "Barras Paralelas", id_sala: 3, estado: "Bueno", tipo_ejercicio: "Fuerza", fecha_adquisicion: "2024-01-28", ultimo_mantenimiento: "2025-01-08" },
    { id: 18, nombre: "Colchonetas", id_sala: 4, estado: "Regular", tipo_ejercicio: "Flexibilidad", fecha_adquisicion: "2023-12-10", ultimo_mantenimiento: "2025-01-02" },
    { id: 19, nombre: "Máquina de Aductores", id_sala: 1, estado: "Fuera de servicio", tipo_ejercicio: "Fuerza", fecha_adquisicion: "2022-03-15", ultimo_mantenimiento: "2024-10-15" },
    { id: 20, nombre: "Cuerdas de Saltar", id_sala: 4, estado: "Bueno", tipo_ejercicio: "Cardio", fecha_adquisicion: "2024-10-05", ultimo_mantenimiento: "2025-02-25" }
];

const registroUsoEquiposData = [
    { id: 1, id_equipo: 1, fecha: "2025-01-05", tiempo_uso_minutos: 120, id_socio: 1 },
    { id: 2, id_equipo: 2, fecha: "2025-01-05", tiempo_uso_minutos: 45, id_socio: 3 },
    { id: 3, id_equipo: 4, fecha: "2025-01-05", tiempo_uso_minutos: 60, id_socio: 2 },
    { id: 4, id_equipo: 1, fecha: "2025-01-06", tiempo_uso_minutos: 90, id_socio: 4 },
    { id: 5, id_equipo: 3, fecha: "2025-01-06", tiempo_uso_minutos: 45, id_socio: 1 },
    { id: 6, id_equipo: 7, fecha: "2025-01-06", tiempo_uso_minutos: 30, id_socio: 6 },
    { id: 7, id_equipo: 11, fecha: "2025-01-07", tiempo_uso_minutos: 75, id_socio: 7 },
    { id: 8, id_equipo: 9, fecha: "2025-01-07", tiempo_uso_minutos: 40, id_socio: 3 },
    { id: 9, id_equipo: 14, fecha: "2025-01-07", tiempo_uso_minutos: 50, id_socio: 9 },
    { id: 10, id_equipo: 2, fecha: "2025-01-08", tiempo_uso_minutos: 60, id_socio: 10 },
    { id: 11, id_equipo: 8, fecha: "2025-01-08", tiempo_uso_minutos: 45, id_socio: 2 },
    { id: 12, id_equipo: 16, fecha: "2025-01-08", tiempo_uso_minutos: 55, id_socio: 4 },
    { id: 13, id_equipo: 1, fecha: "2025-01-09", tiempo_uso_minutos: 100, id_socio: 6 },
    { id: 14, id_equipo: 4, fecha: "2025-01-09", tiempo_uso_minutos: 65, id_socio: 1 },
    { id: 15, id_equipo: 6, fecha: "2025-01-09", tiempo_uso_minutos: 50, id_socio: 7 },
    { id: 16, id_equipo: 14, fecha: "2025-01-10", tiempo_uso_minutos: 45, id_socio: 9 },
    { id: 17, id_equipo: 17, fecha: "2025-01-10", tiempo_uso_minutos: 60, id_socio: 3 },
    { id: 18, id_equipo: 20, fecha: "2025-01-10", tiempo_uso_minutos: 25, id_socio: 10 },
    { id: 19, id_equipo: 2, fecha: "2025-01-11", tiempo_uso_minutos: 70, id_socio: 2 },
    { id: 20, id_equipo: 7, fecha: "2025-01-11", tiempo_uso_minutos: 35, id_socio: 4 },
    { id: 21, id_equipo: 11, fecha: "2025-01-11", tiempo_uso_minutos: 60, id_socio: 6 },
    { id: 22, id_equipo: 1, fecha: "2025-01-12", tiempo_uso_minutos: 110, id_socio: 7 },
    { id: 23, id_equipo: 3, fecha: "2025-01-12", tiempo_uso_minutos: 50, id_socio: 9 },
    { id: 24, id_equipo: 9, fecha: "2025-01-12", tiempo_uso_minutos: 45, id_socio: 1 },
    { id: 25, id_equipo: 14, fecha: "2025-01-13", tiempo_uso_minutos: 55, id_socio: 3 },
    { id: 26, id_equipo: 6, fecha: "2025-01-13", tiempo_uso_minutos: 65, id_socio: 10 },
    { id: 27, id_equipo: 16, fecha: "2025-01-13", tiempo_uso_minutos: 50, id_socio: 2 },
    { id: 28, id_equipo: 1, fecha: "2025-01-14", tiempo_uso_minutos: 95, id_socio: 4 },
    { id: 29, id_equipo: 4, fecha: "2025-01-14", tiempo_uso_minutos: 70, id_socio: 6 },
    { id: 30, id_equipo: 8, fecha: "2025-01-14", tiempo_uso_minutos: 55, id_socio: 7 }
];

function loadTableDataReporte1() {
    try {
        // Obtener valores de los filtros
        const estadoEquipoEl = document.getElementById('estadoEquipo');
        const salaEl = document.getElementById('sala');
        const tipoEjercicioEl = document.getElementById('tipoEjercicio');
        const fechaAdquisicionDesdeEl = document.getElementById('fechaAdquisicionDesde');
        const fechaAdquisicionHastaEl = document.getElementById('fechaAdquisicionHasta');
        const tipoVisualizacionEl = document.getElementById('tipoVisualizacion');
        
        const estadoEquipo = estadoEquipoEl ? estadoEquipoEl.value : '';
        const sala = salaEl ? salaEl.value : '';
        const tipoEjercicio = tipoEjercicioEl ? tipoEjercicioEl.value : '';
        const fechaAdquisicionDesde = fechaAdquisicionDesdeEl ? fechaAdquisicionDesdeEl.value : '';
        const fechaAdquisicionHasta = fechaAdquisicionHastaEl ? fechaAdquisicionHastaEl.value : '';
        const tipoVisualizacion = tipoVisualizacionEl ? tipoVisualizacionEl.value : 'pastel';

        // Filtrar equipos
        const equiposFiltrados = equiposData.filter(equipo => {
            // Filtrar por estado
            if (estadoEquipo && equipo.estado !== estadoEquipo) {
                return false;
            }
            
            // Filtrar por sala
            if (sala && equipo.id_sala !== parseInt(sala)) {
                return false;
            }
            
            // Filtrar por tipo de ejercicio
            if (tipoEjercicio && equipo.tipo_ejercicio !== tipoEjercicio) {
                return false;
            }
            
            // Filtrar por fecha de adquisición
            if (fechaAdquisicionDesde && equipo.fecha_adquisicion < fechaAdquisicionDesde) {
                return false;
            }
            
            if (fechaAdquisicionHasta && equipo.fecha_adquisicion > fechaAdquisicionHasta) {
                return false;
            }
            
            return true;
        });

        // Preparar datos para la tabla y gráficos
        const datosCompletos = equiposFiltrados.map(equipo => {
            const sala = salasData.find(s => s.id === equipo.id_sala);
            
            // Calcular antigüedad en meses
            const fechaAdquisicion = new Date(equipo.fecha_adquisicion);
            const fechaActual = new Date();
            const antiguedadMeses = (fechaActual.getFullYear() - fechaAdquisicion.getFullYear()) * 12 + 
                                  (fechaActual.getMonth() - fechaAdquisicion.getMonth());
            
            // Calcular cuántas veces se ha utilizado (conteo de registros)
            const usoTotal = registroUsoEquiposData.filter(registro => registro.id_equipo === equipo.id).length;
            
            return {
                id_equipo: equipo.id,
                nombre: equipo.nombre,
                sala: sala ? sala.nombre : 'Desconocida',
                id_sala: equipo.id_sala,
                estado: equipo.estado,
                tipo_ejercicio: equipo.tipo_ejercicio,
                fecha_adquisicion: equipo.fecha_adquisicion,
                ultimo_mantenimiento: equipo.ultimo_mantenimiento,
                antiguedad_meses: antiguedadMeses,
                uso_total: usoTotal
            };
        });

        // Actualizar tabla
        updateTableWithDataReporte1(datosCompletos);
        
        // Mostrar gráfico según tipo seleccionado
        const chartView = document.getElementById('chartView');
        if (chartView && chartView.classList.contains('active')) {
            if (tipoVisualizacion === 'pastel') {
                renderPieChartReporte1(datosCompletos);
            } else {
                renderBarChartReporte1(datosCompletos);
            }
        }
    } catch (error) {
        console.error('Error en loadTableDataReporte4:', error);
    }
}

function updateTableWithDataReporte1(data) {
    const tableHead = document.querySelector('#resultsTable thead');
    const tableBody = document.getElementById('tableBody');
    
    // Verificar si los elementos existen
    if (!tableHead || !tableBody) {
        console.error('Elementos de tabla no encontrados');
        return;
    }
    
    // Actualizar encabezados
    tableHead.innerHTML = `
        <tr>
            <th>Equipo</th>
            <th>Sala</th>
            <th>Tipo Ejercicio</th>
            <th>Estado</th>
            <th>Fecha Adquisición</th>
            <th>Último Mantenimiento</th>
            <th>Antigüedad(meses)</th>
            <th>Uso Total</th>
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
    
    // Ordenar por fecha de adquisición (más reciente primero)
    data.sort((a, b) => new Date(b.fecha_adquisicion) - new Date(a.fecha_adquisicion));
    
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
            <td>${item.sala}</td>
            <td>${item.tipo_ejercicio}</td>
            <td>${item.estado}</td>
            <td>${item.fecha_adquisicion}</td>
            <td>${item.ultimo_mantenimiento}</td>
            <td>${item.antiguedad_meses}</td>
            <td>${item.uso_total}</td>
        `;
        tableBody.appendChild(tr);
    });
    
    const pageInfoEl = document.getElementById('pageInfo');
    if (pageInfoEl) {
        pageInfoEl.textContent = `Página ${currentPage} de ${totalPages}`;
    }
    
    // Actualizar botones de paginación
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    
    if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
    if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages;
}

function renderPieChartReporte1(data) {
    const reportChartEl = document.getElementById('reportChart');
    if (!reportChartEl) {
        console.error('Elemento reportChart no encontrado');
        return;
    }
    const ctx = reportChartEl.getContext('2d');
    
    // Destruir gráfico existente si hay uno
    if (window.reportChart && typeof window.reportChart.destroy === 'function') {
        window.reportChart.destroy();
    }
    
    // Agrupar por estado
    const conteoEstados = {};
    data.forEach(item => {
        if (!conteoEstados[item.estado]) {
            conteoEstados[item.estado] = 0;
        }
        conteoEstados[item.estado]++;
    });
    
    // Preparar datos para el gráfico
    const estados = Object.keys(conteoEstados);
    const cantidades = estados.map(estado => conteoEstados[estado]);
    const total = cantidades.reduce((sum, num) => sum + num, 0);
    const porcentajes = cantidades.map(cantidad => ((cantidad / total) * 100).toFixed(1));
    
    // Asignar colores según estado
    const colorMap = {
        'Bueno': 'rgba(75, 192, 75, 0.7)',
        'Regular': 'rgba(255, 206, 86, 0.7)',
        'Malo': 'rgba(255, 159, 64, 0.7)',
        'Fuera de servicio': 'rgba(255, 99, 132, 0.7)'
    };
    
    const backgroundColors = estados.map(estado => colorMap[estado] || 'rgba(54, 162, 235, 0.7)');
    
    // Crear gráfico de pastel
    window.reportChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: estados.map((estado, index) => `${estado} (${porcentajes[index]}%)`),
            datasets: [{
                label: 'Equipos por estado',
                data: cantidades,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Distribución de equipos por estado',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${context.dataset.label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function renderBarChartReporte1(data) {
    const reportChartEl = document.getElementById('reportChart');
    if (!reportChartEl) {
        console.error('Elemento reportChart no encontrado');
        return;
    }
    const ctx = reportChartEl.getContext('2d');
    
    // Destruir gráfico existente si hay uno
    if (window.reportChart && typeof window.reportChart.destroy === 'function') {
        window.reportChart.destroy();
    }
    
    // Solo contar equipos en estado "Bueno" o "Regular" como activos
    const equiposActivos = data.filter(equipo => equipo.estado === 'Bueno' || equipo.estado === 'Regular');
    
    // Agrupar por sala
    const equiposPorSala = {};
    
    equiposActivos.forEach(equipo => {
        if (!equiposPorSala[equipo.sala]) {
            equiposPorSala[equipo.sala] = 0;
        }
        equiposPorSala[equipo.sala]++;
    });
    
    // Preparar datos para el gráfico
    const salas = Object.keys(equiposPorSala);
    const cantidades = salas.map(sala => equiposPorSala[sala]);
    
    // Ordenar de mayor a menor cantidad
    const datosOrdenados = salas.map((sala, index) => ({
        sala: sala,
        cantidad: cantidades[index]
    })).sort((a, b) => b.cantidad - a.cantidad);
    
    const salasOrdenadas = datosOrdenados.map(item => item.sala);
    const cantidadesOrdenadas = datosOrdenados.map(item => item.cantidad);
    
    // Crear gráfico de barras
    window.reportChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: salasOrdenadas,
            datasets: [{
                label: 'Equipos activos',
                data: cantidadesOrdenadas,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Cantidad de equipos'
                    },
                    ticks: {
                        precision: 0
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Sala'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Número de equipos activos por sala',
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
}

// Exponer función para que script.js pueda llamarla
window.loadReporte1 = loadReporte1;
window.loadTableDataReporte1 = loadTableDataReporte1;