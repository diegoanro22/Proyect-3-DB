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

async function configureFiltersForReporte1() {
    const filterForm = document.getElementById('filterForm');

    // Verificar si filterForm existe antes de continuar
    if (!filterForm) {
        console.error("Elemento 'filterForm' no encontrado");
        return;
    }

    //cargar los datos de las salas
    // Cargar salas desde la API
    let salasOptions = '<option value="">Todas</option>';
    try {
        const response = await fetch('/api/salas/');
        if (response.ok) {
            const salas = await response.json();
            salasOptions += salas.map(sala =>
                `<option value="${sala.id}">${sala.nombre}</option>`
            ).join('');
        } else {
            console.error('Error al cargar salas:', response.statusText);
        }
    } catch (error) {
        console.error('Error en la solicitud de salas:', error);
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
                ${salasOptions}
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
            <button type="button" id="btnFiltrar">Aplicar Filtros</button>
            <button type="button" id="btnLimpiar">Limpiar Filtros</button>
        </div>
    `;

    // Re-attach event listeners con verificación
    const btnFiltrar = document.getElementById('btnFiltrar');
    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', function () {
            loadTableDataReporte1();
        });
    }

    const btnLimpiar = document.getElementById('btnLimpiar');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', function () {
            const filterForm = document.getElementById('filterForm');
            if (filterForm) filterForm.reset();
            loadTableDataReporte1();
        });
    }
}


async function loadTableDataReporte1() {
    try {
        // Obtener valores de los filtros
        const estadoEquipoEl = document.getElementById('estadoEquipo');
        const salaEl = document.getElementById('sala');
        const tipoEjercicioEl = document.getElementById('tipoEjercicio');
        const fechaAdquisicionDesdeEl = document.getElementById('fechaAdquisicionDesde');
        const fechaAdquisicionHastaEl = document.getElementById('fechaAdquisicionHasta');

        const estadoEquipo = estadoEquipoEl ? estadoEquipoEl.value : '';
        const sala = salaEl ? salaEl.value : '';
        const tipoEjercicio = tipoEjercicioEl ? tipoEjercicioEl.value : '';
        const fechaAdquisicionDesde = fechaAdquisicionDesdeEl ? fechaAdquisicionDesdeEl.value : '';
        const fechaAdquisicionHasta = fechaAdquisicionHastaEl ? fechaAdquisicionHastaEl.value : '';

        

        // Construir URL con parametros para la API
        let url = new URL('/api/equipos/', window.location.origin);
        if (estadoEquipo) url.searchParams.append('estado', estadoEquipo);
        if (sala) url.searchParams.append('sala', sala);
        if (tipoEjercicio) url.searchParams.append('tipo_ejercicio', tipoEjercicio);
        if (fechaAdquisicionDesde) url.searchParams.append('fecha_adquisicion_desde', fechaAdquisicionDesde);
        if (fechaAdquisicionHasta) url.searchParams.append('fecha_adquisicion_hasta', fechaAdquisicionHasta);

        // Realizar petición a la API
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Error en la petición a la API');
        }

        const datosCompletos = await response.json();


        // Actualizar tabla
        updateTableWithDataReporte1(datosCompletos);

        // Mostrar gráfico según tipo seleccionado
        const chartView = document.getElementById('chartView');
        if (chartView && chartView.classList.contains('active')) {
            if (tipoVisualizacion === 'pastel') {
                await renderPieChartReporte1(datosCompletos);
            } else {
                await renderBarChartReporte1(datosCompletos);
            }
        }
    } catch (error) {
        console.error('Error en loadTableDataReporte1:', error);
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
            <th>Modelo</th>
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
            <td>${item.modelo}</td>
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

async function renderPieChartReporte1(data) {
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
    
    // Obtener datos del gráfico de la API
    let url = new URL('/api/estados-equipos/', window.location.origin);
    const salaEl = document.getElementById('sala');
    if (salaEl && salaEl.value) {
        url.searchParams.append('sala', salaEl.value);
    }
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error en la petición a la API de estados');
        }
        
        const estadosData = await response.json();
        
        // Preparar datos para el gráfico
        const estados = estadosData.map(item => item.estado);
        const cantidades = estadosData.map(item => item.cantidad);
        const total = cantidades.reduce((sum, num) => sum + num, 0);
        const porcentajes = cantidades.map(cantidad => ((cantidad / total) * 100).toFixed(1));
        
        // Asignar colores según estado
        const colorMap = {
            'Bueno': 'rgba(75, 192, 75, 0.7)',
            'Regular': 'rgba(255, 206, 86, 0.7)',
            'Malo': 'rgba(255, 159, 64, 0.7)',
            'Fuera de servicio': 'rgba(255, 99, 132, 0.7)',
            'Nuevo': 'rgba(54, 162, 235, 0.7)'
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
    } catch (error) {
        console.error('Error al obtener datos para el gráfico:', error);
    }
}

// Exponer función para que script.js pueda llamarla
window.loadReporte1 = loadReporte1;
window.loadTableDataReporte1 = loadTableDataReporte1;