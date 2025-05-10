// rp4.js - Reporte 4: Uso y Tiempos de Equipos

function loadReporte4() {
    // Para evitar conflictos con otras variables globales
    try {
        console.log("Cargando Reporte 4...");
        configureFiltersForReporte4();
        loadTableDataReporte4();
    } catch (error) {
        console.error("Error al cargar Reporte 4:", error);
    }
}

async function configureFiltersForReporte4() {
    const filterForm = document.getElementById('filterForm');
    
    // Verificar si filterForm existe antes de continuar
    if (!filterForm) {
        console.error("Elemento 'filterForm' no encontrado");
        return;
    }
    
    // Cargar marcas de equipos desde la API
    let marcasOptions = '<option value="">Todas las marcas</option>';
    try {
        const response = await fetch('/api/marcas-equipos/');
        if (response.ok) {
            const marcas = await response.json();
            marcasOptions += marcas.map(marca =>
                `<option value="${marca}">${marca}</option>`
            ).join('');
        } else {
            console.error('Error al cargar marcas:', response.statusText);
        }
    } catch (error) {
        console.error('Error en la solicitud de marcas:', error);
    }
    
    filterForm.innerHTML = `
        <div class="filter-group">
            <label for="nombreEquipo">Equipo:</label>
            <input type="text" id="nombreEquipo" name="nombreEquipo" placeholder="Nombre del equipo...">
        </div>
        <div class="filter-group">
            <label for="marca">Marca:</label>
            <select id="marca" name="marca">
                ${marcasOptions}
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

    // Re-attach event listeners con verificación
    const btnFiltrar = document.getElementById('btnFiltrar');
    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', function() {
            loadTableDataReporte4();
        });
    }

    const btnLimpiar = document.getElementById('btnLimpiar');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', function() {
            const filterForm = document.getElementById('filterForm');
            if (filterForm) filterForm.reset();
            loadTableDataReporte4();
        });
    }
}

async function loadTableDataReporte4() {
    try {
        console.log("Cargando datos de uso de equipos...");
        // Obtener valores de los filtros con verificación
        const nombreEquipoEl = document.getElementById('nombreEquipo');
        const marcaEl = document.getElementById('marca');
        const modeloEl = document.getElementById('modelo');
        const salaEl = document.getElementById('sala');
        const fechaInicioEl = document.getElementById('fechaInicioRutina');
        const fechaFinEl = document.getElementById('fechaFinRutina');
        const tipoEjercicioEl = document.getElementById('tipoEjercicio');
        
        const nombreEquipo = nombreEquipoEl ? nombreEquipoEl.value : '';
        const marca = marcaEl ? marcaEl.value : '';
        const modelo = modeloEl ? modeloEl.value : '';
        const sala = salaEl ? salaEl.value : '';
        const fechaInicioRutina = fechaInicioEl ? fechaInicioEl.value : '';
        const fechaFinRutina = fechaFinEl ? fechaFinEl.value : '';
        const tipoEjercicio = tipoEjercicioEl ? tipoEjercicioEl.value : '';

        // Construir URL con parámetros para la API
        let url = new URL('/api/uso-equipos/', window.location.origin);
        if (nombreEquipo) url.searchParams.append('nombreEquipo', nombreEquipo);
        if (marca) url.searchParams.append('marca', marca);
        if (modelo) url.searchParams.append('modelo', modelo);
        if (sala) url.searchParams.append('sala', sala);
        if (fechaInicioRutina) url.searchParams.append('fechaInicioRutina', fechaInicioRutina);
        if (fechaFinRutina) url.searchParams.append('fechaFinRutina', fechaFinRutina);
        if (tipoEjercicio) url.searchParams.append('tipoEjercicio', tipoEjercicio);

        // Realizar petición a la API
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error en la petición a la API: ${response.statusText}`);
        }

        const equiposUso = await response.json();

        // Actualizar tabla
        updateTableWithDataReporte4(equiposUso);

        // Mostrar gráfico si está activo
        const chartView = document.getElementById('chartView');
        if (chartView && chartView.classList.contains('active')) {
            renderChartReporte4(equiposUso);
        }
    } catch (error) {
        console.error('Error en loadTableDataReporte4:', error);
    }
}

function updateTableWithDataReporte4(data) {
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
        const pageInfoEl = document.getElementById('pageInfo');
        if (pageInfoEl) {
            pageInfoEl.textContent = 'Página 0 de 0';
        }
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
            <td>${item.duracion_total}</td>
            <td>${item.duracion_media}</td>
            <td>${item.rutinas_unicas}</td>
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

async function renderChartReporte4(data) {
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
    
    // Verificar si no hay datos
    if (data.length === 0) {
        // Mostrar mensaje en el canvas
        ctx.clearRect(0, 0, reportChartEl.width, reportChartEl.height);
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No hay datos disponibles para el gráfico', reportChartEl.width / 2, reportChartEl.height / 2);
        return;
    }
    
    try {
        // Obtener los equipos más usados desde la API
        const response = await fetch('/api/top-equipos-usados/?limite=10');
        if (!response.ok) {
            throw new Error('Error al obtener los equipos más usados');
        }
        
        const topEquipos = await response.json();
        
        // Preparar datos para el gráfico
        const labels = topEquipos.map(item => `${item.nombre} (${item.marca})`);
        const usosData = topEquipos.map(item => item.usos_totales);
        
        // Crear gráfico
        window.reportChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Número de usos en rutinas',
                    data: usosData,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Número de usos'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Equipo'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Equipos más utilizados',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error al renderizar el gráfico:', error);
        ctx.clearRect(0, 0, reportChartEl.width, reportChartEl.height);
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Error al cargar el gráfico', reportChartEl.width / 2, reportChartEl.height / 2);
    }
}

// Añadir vista por sala
async function renderSalaChartReporte4() {
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
    
    try {
        // Obtener fechas seleccionadas para filtrar
        const fechaInicio = document.getElementById('fechaInicioRutina').value;
        const fechaFin = document.getElementById('fechaFinRutina').value;
        
        // Construir URL con parámetros
        let url = new URL('/api/uso-equipos-por-sala/', window.location.origin);
        if (fechaInicio) url.searchParams.append('fechaInicio', fechaInicio);
        if (fechaFin) url.searchParams.append('fechaFin', fechaFin);
        
        // Obtener datos de uso por sala
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al obtener el uso por sala');
        }
        
        const usoPorSala = await response.json();
        
        // Verificar si no hay datos
        if (usoPorSala.length === 0) {
            ctx.clearRect(0, 0, reportChartEl.width, reportChartEl.height);
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No hay datos disponibles para el gráfico', reportChartEl.width / 2, reportChartEl.height / 2);
            return;
        }
        
        // Preparar datos para el gráfico
        const labels = usoPorSala.map(item => item.sala);
        const usosData = usoPorSala.map(item => item.usos_totales);
        const duracionData = usoPorSala.map(item => item.duracion_media);
        
        // Crear gráfico
        window.reportChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Usos totales',
                        data: usosData,
                        backgroundColor: 'rgba(54, 162, 235, 0.7)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Duración media (min)',
                        data: duracionData,
                        backgroundColor: 'rgba(255, 99, 132, 0.7)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        type: 'line',
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Usos totales'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false
                        },
                        title: {
                            display: true,
                            text: 'Duración media (min)'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Uso de equipos por sala',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error al renderizar el gráfico de salas:', error);
        ctx.clearRect(0, 0, reportChartEl.width, reportChartEl.height);
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Error al cargar el gráfico', reportChartEl.width / 2, reportChartEl.height / 2);
    }
}

// Exponer función para que script.js pueda llamarla
window.loadReporte4 = loadReporte4;