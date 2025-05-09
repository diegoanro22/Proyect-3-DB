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

function configureFiltersForReporte3() {
    const filterForm = document.getElementById('filterForm');
    
    // Verificar si filterForm existe antes de continuar
    if (!filterForm) {
        console.error("Elemento 'filterForm' no encontrado");
        return;
    }
    
    filterForm.innerHTML = `
        <div class="filter-group">
            <label for="nombreRutina">Rutina:</label>
            <select id="nombreRutina" name="nombreRutina">
                <option value="">Todas</option>
                ${rutinasData.map(rutina => `<option value="${rutina.id}">${rutina.nombre}</option>`).join('')}
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

// Usar los datos de sociosData que ya existen en el ámbito global
// Datos específicos para el reporte 3
const rutinassData = [
    { id: 1, nombre: "Full Body", nivel_dificultad: "Principiante", duracion_minutos: 45, calorias_estimadas: 350 },
    { id: 2, nombre: "Upper Body", nivel_dificultad: "Intermedio", duracion_minutos: 50, calorias_estimadas: 400 },
    { id: 3, nombre: "Lower Body", nivel_dificultad: "Intermedio", duracion_minutos: 55, calorias_estimadas: 450 },
    { id: 4, nombre: "HIIT", nivel_dificultad: "Avanzado", duracion_minutos: 30, calorias_estimadas: 500 },
    { id: 5, nombre: "Cardio", nivel_dificultad: "Principiante", duracion_minutos: 40, calorias_estimadas: 380 },
    { id: 6, nombre: "Crossfit", nivel_dificultad: "Avanzado", duracion_minutos: 60, calorias_estimadas: 550 }
];

const registroRutinasData = [
    { id: 1, id_socio: 1, id_rutina: 1, fecha: "2025-01-05", duracion_real_minutos: 48, calorias_quemadas: 370 },
    { id: 2, id_socio: 1, id_rutina: 2, fecha: "2025-01-10", duracion_real_minutos: 52, calorias_quemadas: 420 },
    { id: 3, id_socio: 1, id_rutina: 1, fecha: "2025-01-15", duracion_real_minutos: 47, calorias_quemadas: 365 },
    { id: 4, id_socio: 1, id_rutina: 3, fecha: "2025-01-22", duracion_real_minutos: 56, calorias_quemadas: 460 },
    { id: 5, id_socio: 1, id_rutina: 4, fecha: "2025-01-29", duracion_real_minutos: 32, calorias_quemadas: 520 },
    { id: 6, id_socio: 2, id_rutina: 5, fecha: "2025-01-08", duracion_real_minutos: 38, calorias_quemadas: 350 },
    { id: 7, id_socio: 2, id_rutina: 1, fecha: "2025-01-16", duracion_real_minutos: 42, calorias_quemadas: 330 },
    { id: 8, id_socio: 2, id_rutina: 5, fecha: "2025-01-24", duracion_real_minutos: 41, calorias_quemadas: 370 },
    { id: 9, id_socio: 3, id_rutina: 2, fecha: "2025-01-05", duracion_real_minutos: 55, calorias_quemadas: 430 },
    { id: 10, id_socio: 3, id_rutina: 3, fecha: "2025-01-12", duracion_real_minutos: 58, calorias_quemadas: 470 },
    { id: 11, id_socio: 3, id_rutina: 6, fecha: "2025-01-19", duracion_real_minutos: 62, calorias_quemadas: 580 },
    { id: 12, id_socio: 3, id_rutina: 4, fecha: "2025-01-26", duracion_real_minutos: 35, calorias_quemadas: 540 },
    { id: 13, id_socio: 4, id_rutina: 5, fecha: "2025-01-07", duracion_real_minutos: 42, calorias_quemadas: 390 },
    { id: 14, id_socio: 4, id_rutina: 1, fecha: "2025-01-14", duracion_real_minutos: 45, calorias_quemadas: 355 },
    { id: 15, id_socio: 4, id_rutina: 5, fecha: "2025-01-21", duracion_real_minutos: 43, calorias_quemadas: 395 },
    { id: 16, id_socio: 4, id_rutina: 2, fecha: "2025-01-28", duracion_real_minutos: 53, calorias_quemadas: 425 },
    { id: 17, id_socio: 6, id_rutina: 3, fecha: "2025-01-06", duracion_real_minutos: 54, calorias_quemadas: 440 },
    { id: 18, id_socio: 6, id_rutina: 6, fecha: "2025-01-13", duracion_real_minutos: 59, calorias_quemadas: 530 },
    { id: 19, id_socio: 6, id_rutina: 3, fecha: "2025-01-20", duracion_real_minutos: 57, calorias_quemadas: 465 },
    { id: 20, id_socio: 6, id_rutina: 6, fecha: "2025-01-27", duracion_real_minutos: 61, calorias_quemadas: 560 },
    { id: 21, id_socio: 7, id_rutina: 4, fecha: "2025-01-04", duracion_real_minutos: 31, calorias_quemadas: 510 },
    { id: 22, id_socio: 7, id_rutina: 2, fecha: "2025-01-11", duracion_real_minutos: 51, calorias_quemadas: 415 },
    { id: 23, id_socio: 7, id_rutina: 4, fecha: "2025-01-18", duracion_real_minutos: 33, calorias_quemadas: 530 },
    { id: 24, id_socio: 7, id_rutina: 6, fecha: "2025-01-25", duracion_real_minutos: 58, calorias_quemadas: 520 },
    { id: 25, id_socio: 9, id_rutina: 1, fecha: "2025-01-05", duracion_real_minutos: 46, calorias_quemadas: 360 },
    { id: 26, id_socio: 9, id_rutina: 3, fecha: "2025-01-12", duracion_real_minutos: 57, calorias_quemadas: 465 },
    { id: 27, id_socio: 9, id_rutina: 2, fecha: "2025-01-19", duracion_real_minutos: 52, calorias_quemadas: 425 },
    { id: 28, id_socio: 9, id_rutina: 5, fecha: "2025-01-26", duracion_real_minutos: 41, calorias_quemadas: 385 },
    { id: 29, id_socio: 10, id_rutina: 5, fecha: "2025-01-08", duracion_real_minutos: 39, calorias_quemadas: 360 },
    { id: 30, id_socio: 10, id_rutina: 1, fecha: "2025-01-15", duracion_real_minutos: 44, calorias_quemadas: 345 },
    { id: 31, id_socio: 10, id_rutina: 5, fecha: "2025-01-22", duracion_real_minutos: 40, calorias_quemadas: 370 },
    { id: 32, id_socio: 10, id_rutina: 1, fecha: "2025-01-29", duracion_real_minutos: 45, calorias_quemadas: 355 },
    // Agregar registro para febrero para ver la tendencia semanal
    { id: 33, id_socio: 1, id_rutina: 1, fecha: "2025-02-05", duracion_real_minutos: 49, calorias_quemadas: 375 },
    { id: 34, id_socio: 1, id_rutina: 2, fecha: "2025-02-12", duracion_real_minutos: 53, calorias_quemadas: 430 },
    { id: 35, id_socio: 2, id_rutina: 5, fecha: "2025-02-03", duracion_real_minutos: 40, calorias_quemadas: 365 },
    { id: 36, id_socio: 2, id_rutina: 1, fecha: "2025-02-10", duracion_real_minutos: 43, calorias_quemadas: 340 },
    { id: 37, id_socio: 3, id_rutina: 6, fecha: "2025-02-02", duracion_real_minutos: 63, calorias_quemadas: 590 },
    { id: 38, id_socio: 3, id_rutina: 4, fecha: "2025-02-09", duracion_real_minutos: 34, calorias_quemadas: 530 },
    { id: 39, id_socio: 4, id_rutina: 5, fecha: "2025-02-04", duracion_real_minutos: 44, calorias_quemadas: 400 },
    { id: 40, id_socio: 4, id_rutina: 2, fecha: "2025-02-11", duracion_real_minutos: 54, calorias_quemadas: 435 }
];

function getWeekNumber(d) {
    // Copia la fecha para no modificar la original
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    
    // Establece el día a jueves de la semana actual
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    
    // Toma el primer día del año
    const week1 = new Date(date.getFullYear(), 0, 4);
    
    // Retorna el número de semana
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

function loadTableDataReporte3() {
    try {
        // Obtener valores de los filtros con verificación
        const nombreRutinaEl = document.getElementById('nombreRutina');
        const nivelDificultadEl = document.getElementById('nivelDificultad');
        const nombreSocioEl = document.getElementById('nombreSocio');
        const fechaInicioEl = document.getElementById('fechaInicio');
        const fechaFinEl = document.getElementById('fechaFin');
        const tipoVisualizacionEl = document.getElementById('tipoVisualizacion');
        
        const nombreRutina = nombreRutinaEl ? nombreRutinaEl.value : '';
        const nivelDificultad = nivelDificultadEl ? nivelDificultadEl.value : '';
        const nombreSocio = nombreSocioEl ? nombreSocioEl.value.toLowerCase() : '';
        const fechaInicio = fechaInicioEl ? fechaInicioEl.value : '';
        const fechaFin = fechaFinEl ? fechaFinEl.value : '';
        const tipoVisualizacion = tipoVisualizacionEl ? tipoVisualizacionEl.value : 'barras';

    // Filtrar socios activos
    const sociosActivos = sociosData.filter(socio => socio.activo);

    // Filtrar por nombre de socio
    const sociosFiltrados = sociosActivos.filter(socio => {
        if (nombreSocio) {
            return socio.nombre.toLowerCase().includes(nombreSocio) || 
                   socio.apellido.toLowerCase().includes(nombreSocio);
        }
        return true;
    });

    // Obtener IDs de socios filtrados
    const idsSocios = sociosFiltrados.map(socio => socio.id);

    // Filtrar registros de rutinas
    const registrosFiltrados = registroRutinasData.filter(registro => {
        // Filtrar por socio
        if (idsSocios.length > 0 && !idsSocios.includes(registro.id_socio)) {
            return false;
        }
        
        // Filtrar por rutina
        if (nombreRutina && registro.id_rutina !== parseInt(nombreRutina)) {
            return false;
        }
        
        // Filtrar por nivel de dificultad
        if (nivelDificultad) {
            const rutina = rutinasData.find(r => r.id === registro.id_rutina);
            if (rutina && rutina.nivel_dificultad !== nivelDificultad) {
                return false;
            }
        }
        
        // Filtrar por fecha
        if (fechaInicio && registro.fecha < fechaInicio) return false;
        if (fechaFin && registro.fecha > fechaFin) return false;
        
        return true;
    });

    // Preparar datos para la tabla y gráficos
    const datosCompletos = registrosFiltrados.map(registro => {
        const socio = sociosData.find(s => s.id === registro.id_socio);
        const rutina = rutinasData.find(r => r.id === registro.id_rutina);
        
        return {
            id_registro: registro.id,
            socio: socio ? `${socio.nombre} ${socio.apellido}` : 'Desconocido',
            rutina: rutina ? rutina.nombre : 'Desconocida',
            nivel: rutina ? rutina.nivel_dificultad : 'Desconocido',
            fecha: registro.fecha,
            duracion: registro.duracion_real_minutos,
            calorias: registro.calorias_quemadas,
            semana: getWeekNumber(new Date(registro.fecha)),
            mes: new Date(registro.fecha).getMonth() + 1,
            año: new Date(registro.fecha).getFullYear()
        };
    });

    // Actualizar tabla
    updateTableWithDataReporte3(datosCompletos);

        const chartView = document.getElementById('chartView');
        if (chartView && chartView.classList.contains('active')) {
            if (tipoVisualizacion === 'barras') {
                renderBarChartReporte3(datosCompletos);
            } else {
                renderLineChartReporte3(datosCompletos);
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
    
    // Ordenar por fecha descendente
    data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
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
            <td>${item.duracion}</td>
            <td>${item.calorias}</td>
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

function renderBarChartReporte3(data) {
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
    
    // Agrupar datos por rutina y calcular calorías promedio
    const rutinasAgrupadas = {};
    
    data.forEach(item => {
        if (!rutinasAgrupadas[item.rutina]) {
            rutinasAgrupadas[item.rutina] = {
                total: 0,
                count: 0
            };
        }
        rutinasAgrupadas[item.rutina].total += item.calorias;
        rutinasAgrupadas[item.rutina].count += 1;
    });
    
    // Calcular promedios
    const rutinas = Object.keys(rutinasAgrupadas);
    const promedios = rutinas.map(rutina => {
        return {
            rutina: rutina,
            promedio: Math.round(rutinasAgrupadas[rutina].total / rutinasAgrupadas[rutina].count)
        };
    });
    
    // Ordenar por promedio descendente
    promedios.sort((a, b) => b.promedio - a.promedio);
    
    // Preparar datos para el gráfico
    const labels = promedios.map(item => item.rutina);
    const valores = promedios.map(item => item.promedio);
    
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
}

function renderLineChartReporte3(data) {
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
    
    // Agrupar datos por semana y calcular calorías totales
    const semanas = {};
    
    data.forEach(item => {
        const semanaKey = `${item.año}-W${item.semana.toString().padStart(2, '0')}`;
        if (!semanas[semanaKey]) {
            semanas[semanaKey] = {
                total: 0,
                count: 0,
                fecha: item.fecha // Para ordenar cronológicamente
            };
        }
        semanas[semanaKey].total += item.calorias;
        semanas[semanaKey].count += 1;
    });
    
    // Convertir a array y ordenar cronológicamente
    const semanasArray = Object.keys(semanas).map(key => {
        return {
            semana: key,
            promedio: Math.round(semanas[key].total / semanas[key].count),
            fecha: semanas[key].fecha
        };
    });
    
    semanasArray.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    
    // Preparar datos para el gráfico
    const labels = semanasArray.map(item => item.semana);
    const valores = semanasArray.map(item => item.promedio);
    
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
}

// Exponer función para que script.js pueda llamarla
window.loadReporte3 = loadReporte3;
window.loadTableDataReporte3 = loadTableDataReporte3;