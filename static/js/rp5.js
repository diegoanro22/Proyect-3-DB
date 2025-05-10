// Reporte 5: Frecuencia de Visitas de Socios

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
            </select>
        </div>
        <div class="filter-group">
            <button type="button" id="btnFiltrar">Aplicar Filtros</button>
            <button type="button" id="btnLimpiar">Limpiar Filtros</button>
        </div>
    `;

    // Cargar planes de membresía desde el servidor
    fetch('/api/planes-membresia/')
        .then(response => response.json())
        .then(planes => {
            const planSelect = document.getElementById('planMembresia');
            planes.forEach(plan => {
                const option = document.createElement('option');
                option.value = plan.id;
                option.textContent = plan.nombre;
                planSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error al cargar planes de membresía:', error));

    // Re-attach event listeners after modifying the form
    document.getElementById('btnFiltrar').addEventListener('click', function() {
        loadTableDataReporte5();
    });

    document.getElementById('btnLimpiar').addEventListener('click', function() {
        document.getElementById('filterForm').reset();
        loadTableDataReporte5();
    });
}

function loadTableDataReporte5() {
    // Obtener valores de los filtros
    const nombreSocio = document.getElementById('nombreSocio').value;
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;
    const tipoActividad = document.getElementById('tipoActividad').value;
    const planMembresia = document.getElementById('planMembresia').value;
    
    // Construir URL con parámetros de consulta
    let url = '/api/frecuencia-visitas/?';
    if (nombreSocio) url += `nombreSocio=${encodeURIComponent(nombreSocio)}&`;
    if (fechaInicio) url += `fechaInicio=${encodeURIComponent(fechaInicio)}&`;
    if (fechaFin) url += `fechaFin=${encodeURIComponent(fechaFin)}&`;
    if (tipoActividad) url += `tipoActividad=${encodeURIComponent(tipoActividad)}&`;
    if (planMembresia) url += `planMembresia=${encodeURIComponent(planMembresia)}&`;
    
    // Obtener datos del servidor
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Procesar los datos antes de mostrarlos
            const processedData = data.map(item => ({
                id: item.id_socio || 'N/A',
                nombre: item.nombre || '',
                apellido: item.apellido || '',
                email: item.email || 'N/A',
                plan: item.plan || 'N/A',
                entrenamientosCount: item.entrenamientos_count || 0,
                clasesCount: item.clases_count || 0,
                totalVisitas: item.totalVisitas || (item.entrenamientos_count || 0) + (item.clases_count || 0),
                fechaUltimaVisita: item.fechaUltimaVisita || 'N/A'
            }));
            
            // Actualizar tabla con los datos procesados
            updateTableWithData5(processedData);
            
            // Actualizar gráfico si está activo
            if (document.getElementById('chartView').classList.contains('active')) {
                renderChartReporte5(processedData);
            }
        })
        .catch(error => {
            console.error('Error al cargar datos de frecuencia de visitas:', error);
            // Mostrar mensaje de error en la tabla
            const tableBody = document.getElementById('tableBody');
            tableBody.innerHTML = '<tr><td colspan="8" class="no-data">Error al cargar datos. Por favor, inténtelo de nuevo.</td></tr>';
        });
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