// Reporte 3: Uso de Rutinas y Calorías Quemadas

function loadReporte3() {
    // Para evitar conflictos con otras variables globales
    try {
        console.log("Cargando Reporte 3...");
        configureFiltersForReporte3();
        loadTableDataReporte3();
    } catch (error) {
        console.error("Error al cargar Reporte 3:", error);
    }
}

async function configureFiltersForReporte3() {
    const filterForm = document.getElementById('filterForm');
    
    // Verificar si filterForm existe antes de continuar
    if (!filterForm) {
        console.error("Elemento 'filterForm' no encontrado");
        return;
    }
    
    // Cargar rutinas desde la API
    let rutinasOptions = '<option value="">Todas</option>';
    try {
        const response = await fetch('/api/rutinas/');
        if (response.ok) {
            const rutinas = await response.json();
            rutinasOptions += rutinas.map(rutina =>
                `<option value="${rutina.id}">${rutina.nombre}</option>`
            ).join('');
        } else {
            console.error('Error al cargar rutinas:', response.statusText);
        }
    } catch (error) {
        console.error('Error en la solicitud de rutinas:', error);
    }
    
    filterForm.innerHTML = `
        <div class="filter-group">
            <label for="nombreRutina">Rutina:</label>
            <select id="nombreRutina" name="nombreRutina">
                ${rutinasOptions}
            </select>
        </div>
        <div class="filter-group">
            <label for="nivelDificultad">Nivel:</label>
            <select id="nivelDificultad" name="nivelDificultad">
                <option value="">Todos</option>
                <option value="Principiante">Principiante</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
            </select>
        </div>
        <div class="filter-group">
            <label for="nombreSocio">Socio:</label>
            <input type="text" id="nombreSocio" name="nombreSocio" placeholder="Nombre o apellido...">
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
            <label for="tipoVisualizacion">Gráfica:</label>
            <select id="tipoVisualizacion" name="tipoVisualizacion">
                <option value="barras">Calorías promedio por rutina</option>
                <option value="lineas">Tendencia semanal de calorías</option>
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
            loadTableDataReporte3();
        });
    }

    const btnLimpiar = document.getElementById('btnLimpiar');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', function() {
            const filterForm = document.getElementById('filterForm');
            if (filterForm) filterForm.reset();
            loadTableDataReporte3();
        });
    }
}

async function loadTableDataReporte3() {
    try {
        console.log("Cargando datos de la tabla...");
        // Obtener valores de los filtros con verificación
        const nombreRutinaEl = document.getElementById('nombreRutina');
        const nivelDificultadEl = document.getElementById('nivelDificultad');
        const nombreSocioEl = document.getElementById('nombreSocio');
        const fechaInicioEl = document.getElementById('fechaInicio');
        const fechaFinEl = document.getElementById('fechaFin');
        const tipoVisualizacionEl = document.getElementById('tipoVisualizacion');
        
        const nombreRutina = nombreRutinaEl ? nombreRutinaEl.value : '';
        const nivelDificultad = nivelDificultadEl ? nivelDificultadEl.value : '';
        const nombreSocio = nombreSocioEl ? nombreSocioEl.value : '';
        const fechaInicio = fechaInicioEl ? fechaInicioEl.value : '';
        const fechaFin = fechaFinEl ? fechaFinEl.value : '';
        const tipoVisualizacion = tipoVisualizacionEl ? tipoVisualizacionEl.value : 'barras';

        // Construir URL con parámetros para la API
        let url = new URL('/api/registros-rutinas/', window.location.origin);
        if (nombreRutina) url.searchParams.append('rutina', nombreRutina);
        if (nivelDificultad) url.searchParams.append('nivel', nivelDificultad);
        if (nombreSocio) url.searchParams.append('socio', nombreSocio);
        if (fechaInicio) url.searchParams.append('fecha_inicio', fechaInicio);
        if (fechaFin) url.searchParams.append('fecha_fin', fechaFin);

        // Realizar petición a la API
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error en la petición a la API: ${response.statusText}`);
        }

        const datosCompletos = await response.json();

        // Actualizar tabla
        updateTableWithDataReporte3(datosCompletos);

        // Mostrar gráfico según tipo seleccionado
        const chartView = document.getElementById('chartView');
        if (chartView && chartView.classList.contains('active')) {
            if (tipoVisualizacion === 'barras') {
                await renderBarChartReporte3(nombreRutina, nivelDificultad, nombreSocio, fechaInicio, fechaFin);
            } else {
                await renderLineChartReporte3(nombreRutina, nivelDificultad, nombreSocio, fechaInicio, fechaFin);
            }
        }
    } catch (error) {
        console.error('Error en loadTableDataReporte3:', error);
    }
}

function updateTableWithDataReporte3(data) {
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
            <th>Socio</th>
            <th>Rutina</th>
            <th>Nivel</th>
            <th>Fecha</th>
            <th>Duración (min)</th>
            <th>Calorías</th>
        </tr>
    `;
    
    // Limpiar tabla
    tableBody.innerHTML = '';
    
    // Si no hay datos
    if (data.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="6" class="no-data">No se encontraron datos con los filtros aplicados</td>';
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
            <td>${item.socio}</td>
            <td>${item.rutina}</td>
            <td>${item.nivel}</td>
            <td>${item.fecha}</td>
            <td>${Math.round(item.duracion_real_minutos)}</td>
            <td>${item.calorias_quemadas}</td>
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

async function renderBarChartReporte3(rutina, nivel, socio, fechaInicio, fechaFin) {
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
    
    // Construir URL con parámetros para la API
    let url = new URL('/api/calorias-por-rutina/', window.location.origin);
    if (rutina) url.searchParams.append('rutina', rutina);
    if (nivel) url.searchParams.append('nivel', nivel);
    if (socio) url.searchParams.append('socio', socio);
    if (fechaInicio) url.searchParams.append('fecha_inicio', fechaInicio);
    if (fechaFin) url.searchParams.append('fecha_fin', fechaFin);
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error en la petición a la API');
        }
        
        const promedios = await response.json();
        
        // Verificar si hay datos
        if (promedios.length === 0) {
            // Mostrar mensaje en el canvas
            ctx.clearRect(0, 0, reportChartEl.width, reportChartEl.height);
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No hay datos disponibles para el gráfico', reportChartEl.width / 2, reportChartEl.height / 2);
            return;
        }
        
        // Preparar datos para el gráfico
        const labels = promedios.map(item => item.rutina);
        const valores = promedios.map(item => item.promedio_calorias);
        
        // Crear gráfico de barras
        window.reportChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Calorías promedio quemadas',
                    data: valores,
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
                            text: 'Calorías'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Rutina'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Calorías promedio quemadas por rutina',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error al obtener datos para el gráfico:', error);
    }
}

async function renderLineChartReporte3(rutina, nivel, socio, fechaInicio, fechaFin) {
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
    
    // Construir URL con parámetros para la API
    let url = new URL('/api/tendencia-calorias-semanal/', window.location.origin);
    if (rutina) url.searchParams.append('rutina', rutina);
    if (nivel) url.searchParams.append('nivel', nivel);
    if (socio) url.searchParams.append('socio', socio);
    if (fechaInicio) url.searchParams.append('fecha_inicio', fechaInicio);
    if (fechaFin) url.searchParams.append('fecha_fin', fechaFin);
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error en la petición a la API');
        }
        
        const tendencia = await response.json();
        
        // Verificar si hay datos
        if (tendencia.length === 0) {
            // Mostrar mensaje en el canvas
            ctx.clearRect(0, 0, reportChartEl.width, reportChartEl.height);
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('No hay datos disponibles para el gráfico', reportChartEl.width / 2, reportChartEl.height / 2);
            return;
        }
        
        // Preparar datos para el gráfico
        const labels = tendencia.map(item => item.semana);
        const valores = tendencia.map(item => item.promedio_calorias);
        
        // Crear gráfico de líneas
        window.reportChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Calorías promedio por semana',
                    data: valores,
                    fill: false,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    tension: 0.1,
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Calorías'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Semana'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Tendencia de calorías quemadas semana a semana',
                        font: {
                            size: 16
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error al obtener datos para el gráfico:', error);
    }
}

// Exponer función para que script.js pueda llamarla
window.loadReporte3 = loadReporte3;
window.loadTableDataReporte3 = loadTableDataReporte3;