// Reporte 2: Progreso Físico (Mediciones Corporales)

function loadReporte2() {
    try {
        console.log("Cargando Reporte 2...");
        configureFiltersForReporte2();
        loadTableDataReporte2();
    } catch (error) {
        console.error("Error al cargar Reporte 2", error);
    }
}

async function configureFiltersForReporte2() {
    const filterForm = document.getElementById('filterForm');



    filterForm.innerHTML = `
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
            <label for="plan">Plan:</label>
            <select id="plan" name="plan">
                <option value="">Todos</option>
                <option value="M">Básico</option>
                <option value="F">Estándar</option>
                <option value="M">Premium</option>
                <option value="F">Nocturno</option>
                <option value="M">Fines de Semana</option>
            </select>
        </div>
        <div class="filter-group">
            <label for="rangoEdad">Rango de edad:</label>
            <select id="rangoEdad" name="rangoEdad">
                <option value="">Todos</option>
                <option value="18-25">18-25 años</option>
                <option value="26-35">26-35 años</option>
                <option value="36-45">36-45 años</option>
                <option value="46+">46+ años</option>
            </select>
        </div>
        <div class="filter-group">
            <label for="tipoMedicion">Mostrar:</label>
            <select id="tipoMedicion" name="tipoMedicion">
                <option value="peso">Peso (kg)</option>
                <option value="grasa">% Grasa</option>
                <option value="musculo">% Músculo</option>
                <option value="cintura">Cintura (cm)</option>
            </select>
        </div>
        <div class="filter-group">
            <button type="button" id="btnFiltrar">Aplicar Filtros</button>
            <button type="button" id="btnLimpiar">Limpiar Filtros</button>
        </div>
    `;

    // Re-attach event listeners
    const btnFiltrar = document.getElementById('btnFiltrar');
    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', function () {
            loadTableDataReporte2();
        });
    }

    const btnLimpiar = document.getElementById('btnLimpiar');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', function () {
            const filterForm = document.getElementById('filterForm');
            if (filterForm) filterForm.reset();
            loadTableDataReporte2();
        });
    }
}


async function loadTableDataReporte2() {
    try {
        // Obtener valores de los filtros
        const nombreSocioEl = document.getElementById('nombreSocio');
        const fechaInicioEl = document.getElementById('fechaInicio');
        const fechaFinEl = document.getElementById('fechaFin');
        const planEl = document.getElementById('plan');
        const rangoEdadEl = document.getElementById('rangoEdad');
        const tipoMedicionEl = document.getElementById('tipoMedicion');

        const nombreSocio = nombreSocioEl ? nombreSocioEl.value : '';
        const fechaInicio = fechaInicioEl ? fechaInicioEl.value : '';
        const fechaFin = fechaFinEl ? fechaFinEl.value : '';
        const plan = planEl ? planEl.value : '';
        const rangoEdad = rangoEdadEl ? rangoEdadEl.value : '';
        const tipoMedicion = tipoMedicionEl ? tipoMedicionEl.value : 'peso';

        let url = new URL('/api/mediciones-corporales/', window.location.origin);
        if (nombreSocio) url.searchParams.append('socio', nombreSocio);
        if (fechaInicio) url.searchParams.append('fecha_inicio', fechaInicio);
        if (fechaFin) url.searchParams.append('fecha_fin', fechaFin);
        if (plan) url.searchParams.append('plan', plan);
        if (rangoEdad) url.searchParams.append('rango_edad', rangoEdad);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Error en la petición a la API de mediciones');
        }

        const medidasData = await response.json();


        // Actualizar tabla
        updateTableWithDataReporte2(medidasData, tipoMedicion);

        // Actualizar gráfico si está activo
        const chartView = document.getElementById('chartView');
        if (chartView && chartView.classList.contains('active')) {
            // Obtener datos para gráfico
            let urlGrafico = new URL('/api/progreso-mediciones/', window.location.origin);
            if (nombreSocio) urlGrafico.searchParams.append('socio', nombreSocio);
            if (fechaInicio) urlGrafico.searchParams.append('fecha_inicio', fechaInicio);
            if (fechaFin) urlGrafico.searchParams.append('fecha_fin', fechaFin);
            if (plan) urlGrafico.searchParams.append('plan', plan);
            if (rangoEdad) urlGrafico.searchParams.append('rango_edad', rangoEdad);
            urlGrafico.searchParams.append('tipo_medicion', tipoMedicion);

            const respuestaGrafico = await fetch(urlGrafico);
            if (!respuestaGrafico.ok) {
                throw new Error('Error en la petición a la API de progreso');
            }

            const datosGrafico = await respuestaGrafico.json();
            renderChartReporte2(datosGrafico, tipoMedicion);
        }
    } catch (error) {
        console.error('Error en loadTableDataReporte2:', error);

        // En caso de error, mostrar mensaje en la tabla
        const tableBody = document.getElementById('tableBody');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="6" class="no-data">Error al cargar datos. Por favor, intente de nuevo.</td></tr>';
        }

        // Y limpiar el gráfico si existe
        const chartView = document.getElementById('chartView');
        if (chartView && chartView.classList.contains('active')) {
            if (window.reportChart && typeof window.reportChart.destroy === 'function') {
                window.reportChart.destroy();
                window.reportChart = null;
            }
        }
    }
}

function updateTableWithDataReporte2(data, tipoMedicion) {
    const tableHead = document.querySelector('#resultsTable thead');
    const tableBody = document.getElementById('tableBody');

    // Actualizar encabezados según el tipo de medición
    let columnaMedicion;
    switch (tipoMedicion) {
        case 'peso':
            columnaMedicion = 'Peso (kg)';
            break;
        case 'grasa':
            columnaMedicion = '% Grasa';
            break;
        case 'musculo':
            columnaMedicion = '% Músculo';
            break;
        case 'cintura':
            columnaMedicion = 'Cintura (cm)';
            break;
        default:
            columnaMedicion = 'Medición';
    }

    tableHead.innerHTML = `
        <tr>
            <th>Socio</th>
            <th>Plan</th>
            <th>Edad</th>
            <th>Fecha</th>
            <th>${columnaMedicion}</th>
            <th>IMC</th>
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

    // Calcular IMC y preparar datos para la tabla
    const tableData = data.map(medicion => {
        let valorMedicion;
        switch (tipoMedicion) {
            case 'peso':
                valorMedicion = medicion.peso_kg;
                break;
            case 'grasa':
                valorMedicion = medicion.porcentaje_grasa;
                break;
            case 'musculo':
                valorMedicion = medicion.porcentaje_musculo;
                break;
            case 'cintura':
                valorMedicion = medicion.circunferencia_cintura_cm;
                break;
        }

        return {
            socio: `${medicion.nombre} ${medicion.apellido}`,
            plan: medicion.plan_membresia, 
            edad: medicion.edad,
            fecha: medicion.fecha_medicion,
            medicion: valorMedicion,
            imc: medicion.imc
        };
    });

    // Calcular paginación
    const rowsPerPage = window.rowsPerPage || 10; // Default a 10 si no está definida
    let currentPage = 1;
    const totalPages = Math.ceil(tableData.length / rowsPerPage);

    // Mostrar solo los datos de la página actual
    const start = (currentPage - 1) * rowsPerPage;
    const end = Math.min(start + rowsPerPage, tableData.length);
    const pageData = tableData.slice(start, end);

    // Llenar tabla con datos
    pageData.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.socio}</td>
            <td>${item.plan}</td>
            <td>${item.edad}</td>
            <td>${item.fecha}</td>
            <td>${item.medicion}</td>
            <td>${item.imc}</td>
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

function renderChartReporte2(data, tipoMedicion) {
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
    
    // Filtrar socios con suficientes datos para mostrar (al menos 2 mediciones)
    const sociosConDatos = data.filter(socio => socio.mediciones && socio.mediciones.length >= 2);
    
    // Si no hay suficientes datos para ningún socio
    if (sociosConDatos.length === 0) {
        const noDataMessage = document.createElement('div');
        noDataMessage.className = 'chart-no-data';
        noDataMessage.textContent = 'No hay suficientes datos para mostrar un gráfico de progreso';
        
        reportChartEl.parentNode.appendChild(noDataMessage);
        return;
    }
    
    // Preparar datasets para el gráfico
    const datasets = sociosConDatos.map((socio, index) => {
        // Generar un color único basado en el índice
        const hue = (index * 137) % 360; // Distribución de colores espaciada
        const color = `hsl(${hue}, 70%, 60%)`;
        
        return {
            label: socio.nombre,
            data: socio.mediciones.map(m => ({
                x: m.fecha,
                y: m.valor
            })),
            borderColor: color,
            backgroundColor: color,
            borderWidth: 2,
            fill: false
        };
    });
    
    // Configurar título según el tipo de medición
    let titulo;
    let etiquetaEjeY;
    switch(tipoMedicion) {
        case 'peso':
            titulo = 'Evolución del Peso';
            etiquetaEjeY = 'Peso (kg)';
            break;
        case 'grasa':
            titulo = 'Evolución del Porcentaje de Grasa Corporal';
            etiquetaEjeY = '% Grasa';
            break;
        case 'musculo':
            titulo = 'Evolución del Porcentaje de Músculo';
            etiquetaEjeY = '% Músculo';
            break;
        case 'cintura':
            titulo = 'Evolución de la Circunferencia de Cintura';
            etiquetaEjeY = 'Cintura (cm)';
            break;
    }
    
    // Crear gráfico de líneas
    window.reportChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        tooltipFormat: 'YYYY-MM-DD',
                        displayFormats: {
                            day: 'YYYY-MM-DD'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Fecha'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: etiquetaEjeY
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: titulo,
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y}`;
                        }
                    }
                }
            }
        }
    });
}


// Exponer función para que script.js pueda llamarla
window.loadReporte2 = loadReporte2;
window.loadTableDataReporte2 = loadTableDataReporte2;