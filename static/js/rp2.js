// Reporte 2: Progreso Físico (Mediciones Corporales)

function loadReporte2() {
    configureFiltersForReporte2();
    loadTableDataReporte2();
}

function configureFiltersForReporte2() {
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
            <label for="genero">Género:</label>
            <select id="genero" name="genero">
                <option value="">Todos</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
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
    document.getElementById('btnFiltrar').addEventListener('click', function() {
        loadTableDataReporte2();
    });

    document.getElementById('btnLimpiar').addEventListener('click', function() {
        document.getElementById('filterForm').reset();
        loadTableDataReporte2();
    });
}

// Datos de prueba basados en el DDL
const sociosData = [
    { id: 1, nombre: "Juan", apellido: "García", genero: "M", fecha_nacimiento: "1990-05-15" },
    { id: 2, nombre: "María", apellido: "López", genero: "F", fecha_nacimiento: "1985-08-22" },
    { id: 3, nombre: "Carlos", apellido: "Martínez", genero: "M", fecha_nacimiento: "1995-03-10" },
    { id: 4, nombre: "Ana", apellido: "Rodríguez", genero: "F", fecha_nacimiento: "1982-11-30" },
    { id: 5, nombre: "Pedro", apellido: "Sánchez", genero: "M", fecha_nacimiento: "1998-07-18" },
    { id: 6, nombre: "Laura", apellido: "Fernández", genero: "F", fecha_nacimiento: "1992-01-25" },
    { id: 7, nombre: "Javier", apellido: "González", genero: "M", fecha_nacimiento: "1988-09-05" },
    { id: 8, nombre: "Sofía", apellido: "Torres", genero: "F", fecha_nacimiento: "1993-12-12" },
    { id: 9, nombre: "Miguel", apellido: "Díaz", genero: "M", fecha_nacimiento: "1980-04-20" },
    { id: 10, nombre: "Lucía", apellido: "Pérez", genero: "F", fecha_nacimiento: "1997-06-08" }
];

const medicionesData = [
    { id_medicion: 1, id_socio: 1, fecha_medicion: "2025-01-05", peso_kg: 78.5, altura_cm: 175, porcentaje_grasa: 22.3, porcentaje_musculo: 38.1, circunferencia_cintura_cm: 85 },
    { id_medicion: 2, id_socio: 1, fecha_medicion: "2025-02-10", peso_kg: 76.2, altura_cm: 175, porcentaje_grasa: 21.0, porcentaje_musculo: 39.0, circunferencia_cintura_cm: 83 },
    { id_medicion: 3, id_socio: 1, fecha_medicion: "2025-03-15", peso_kg: 74.8, altura_cm: 175, porcentaje_grasa: 19.8, porcentaje_musculo: 40.2, circunferencia_cintura_cm: 81 },
    { id_medicion: 4, id_socio: 2, fecha_medicion: "2025-01-10", peso_kg: 65.2, altura_cm: 165, porcentaje_grasa: 28.5, porcentaje_musculo: 32.0, circunferencia_cintura_cm: 72 },
    { id_medicion: 5, id_socio: 2, fecha_medicion: "2025-03-20", peso_kg: 63.0, altura_cm: 165, porcentaje_grasa: 26.8, porcentaje_musculo: 33.5, circunferencia_cintura_cm: 70 },
    { id_medicion: 6, id_socio: 3, fecha_medicion: "2025-02-15", peso_kg: 82.0, altura_cm: 180, porcentaje_grasa: 18.5, porcentaje_musculo: 42.0, circunferencia_cintura_cm: 88 },
    { id_medicion: 7, id_socio: 4, fecha_medicion: "2025-01-20", peso_kg: 70.5, altura_cm: 170, porcentaje_grasa: 25.0, porcentaje_musculo: 35.0, circunferencia_cintura_cm: 76 },
    { id_medicion: 8, id_socio: 4, fecha_medicion: "2025-03-25", peso_kg: 68.3, altura_cm: 170, porcentaje_grasa: 23.5, porcentaje_musculo: 36.5, circunferencia_cintura_cm: 74 },
    { id_medicion: 9, id_socio: 5, fecha_medicion: "2025-02-05", peso_kg: 90.0, altura_cm: 185, porcentaje_grasa: 20.0, porcentaje_musculo: 40.0, circunferencia_cintura_cm: 92 },
    { id_medicion: 10, id_socio: 6, fecha_medicion: "2025-01-15", peso_kg: 60.0, altura_cm: 160, porcentaje_grasa: 30.0, porcentaje_musculo: 30.0, circunferencia_cintura_cm: 68 },
    { id_medicion: 11, id_socio: 6, fecha_medicion: "2025-03-30", peso_kg: 58.5, altura_cm: 160, porcentaje_grasa: 28.0, porcentaje_musculo: 32.0, circunferencia_cintura_cm: 66 },
    { id_medicion: 12, id_socio: 7, fecha_medicion: "2025-02-20", peso_kg: 75.0, altura_cm: 172, porcentaje_grasa: 19.0, porcentaje_musculo: 41.0, circunferencia_cintura_cm: 80 },
    { id_medicion: 13, id_socio: 8, fecha_medicion: "2025-01-25", peso_kg: 62.0, altura_cm: 168, porcentaje_grasa: 27.0, porcentaje_musculo: 33.0, circunferencia_cintura_cm: 70 },
    { id_medicion: 14, id_socio: 9, fecha_medicion: "2025-03-10", peso_kg: 85.0, altura_cm: 178, porcentaje_grasa: 17.0, porcentaje_musculo: 43.0, circunferencia_cintura_cm: 90 },
    { id_medicion: 15, id_socio: 10, fecha_medicion: "2025-02-25", peso_kg: 58.0, altura_cm: 162, porcentaje_grasa: 29.0, porcentaje_musculo: 31.0, circunferencia_cintura_cm: 67 }
];

function calcularEdad(fechaNacimiento) {
    const nacimiento = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad;
}

function enRangoEdad(edad, rango) {
    if (!rango) return true;
    if (rango === "46+") return edad >= 46;
    const [min, max] = rango.split('-').map(Number);
    return edad >= min && edad <= max;
}

function loadTableDataReporte2() {
    // Obtener valores de los filtros
    const nombreSocio = document.getElementById('nombreSocio').value.toLowerCase();
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;
    const genero = document.getElementById('genero').value;
    const rangoEdad = document.getElementById('rangoEdad').value;
    const tipoMedicion = document.getElementById('tipoMedicion').value;

    // Procesar datos
    const datosFiltrados = [];
    
    sociosData.forEach(socio => {
        // Filtrar por nombre/apellido
        if (nombreSocio && 
            !socio.nombre.toLowerCase().includes(nombreSocio) && 
            !socio.apellido.toLowerCase().includes(nombreSocio)) {
            return;
        }
        
        // Filtrar por género
        if (genero && socio.genero !== genero) {
            return;
        }
        
        // Calcular edad y filtrar por rango
        const edad = calcularEdad(socio.fecha_nacimiento);
        if (!enRangoEdad(edad, rangoEdad)) {
            return;
        }
        
        // Obtener mediciones del socio
        const medicionesSocio = medicionesData.filter(medicion => {
            if (medicion.id_socio !== socio.id) return false;
            
            // Filtrar por fecha
            if (fechaInicio && medicion.fecha_medicion < fechaInicio) return false;
            if (fechaFin && medicion.fecha_medicion > fechaFin) return false;
            
            return true;
        });
        
        if (medicionesSocio.length === 0) return;
        
        // Preparar datos para el socio
        const datosSocio = {
            id: socio.id,
            nombre: `${socio.nombre} ${socio.apellido}`,
            genero: socio.genero === 'M' ? 'Masculino' : 'Femenino',
            edad: edad,
            mediciones: medicionesSocio.sort((a, b) => new Date(a.fecha_medicion) - new Date(b.fecha_medicion))
        };
        
        datosFiltrados.push(datosSocio);
    });

    // Actualizar tabla
    updateTableWithDataReporte2(datosFiltrados, tipoMedicion);
    
    // Actualizar gráfico si está activo
    if (document.getElementById('chartView').classList.contains('active')) {
        renderChartReporte2(datosFiltrados, tipoMedicion);
    }
}

function updateTableWithDataReporte2(data, tipoMedicion) {
    const tableHead = document.querySelector('#resultsTable thead');
    const tableBody = document.getElementById('tableBody');
    
    // Actualizar encabezados según el tipo de medición
    let columnaMedicion;
    switch(tipoMedicion) {
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
            <th>Género</th>
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
    const tableData = [];
    data.forEach(socio => {
        socio.mediciones.forEach(medicion => {
            const imc = (medicion.peso_kg / ((medicion.altura_cm / 100) ** 2)).toFixed(1);
            let valorMedicion;
            
            switch(tipoMedicion) {
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
            
            tableData.push({
                socio: socio.nombre,
                genero: socio.genero,
                edad: socio.edad,
                fecha: medicion.fecha_medicion,
                medicion: valorMedicion,
                imc: imc
            });
        });
    });
    
    // Ordenar por fecha descendente
    tableData.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    // Calcular paginación
    currentPage = 1;
    totalPages = Math.ceil(tableData.length / rowsPerPage);
    
    // Mostrar solo los datos de la página actual
    const start = (currentPage - 1) * rowsPerPage;
    const end = Math.min(start + rowsPerPage, tableData.length);
    const pageData = tableData.slice(start, end);
    
    // Llenar tabla con datos
    pageData.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.socio}</td>
            <td>${item.genero}</td>
            <td>${item.edad}</td>
            <td>${item.fecha}</td>
            <td>${item.medicion}</td>
            <td>${item.imc}</td>
        `;
        tableBody.appendChild(tr);
    });
    
    document.getElementById('pageInfo').textContent = `Página ${currentPage} de ${totalPages}`;
    
    // Actualizar botones de paginación
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

function renderChartReporte2(data, tipoMedicion) {
    const ctx = document.getElementById('reportChart').getContext('2d');
    
    // Destruir gráfico existente si hay uno
    if (window.reportChart && typeof window.reportChart.destroy === 'function') {
        window.reportChart.destroy();
    }
    
    // Preparar datos para el gráfico
    const datasets = [];
    
    data.forEach(socio => {
        if (socio.mediciones.length < 2) return; // Necesitamos al menos 2 puntos para una línea
        
        const medicionesOrdenadas = socio.mediciones.sort((a, b) => new Date(a.fecha_medicion) - new Date(b.fecha_medicion));
        
        const datosSocio = {
            label: socio.nombre,
            data: medicionesOrdenadas.map(medicion => {
                switch(tipoMedicion) {
                    case 'peso':
                        return {x: medicion.fecha_medicion, y: medicion.peso_kg};
                    case 'grasa':
                        return {x: medicion.fecha_medicion, y: medicion.porcentaje_grasa};
                    case 'musculo':
                        return {x: medicion.fecha_medicion, y: medicion.porcentaje_musculo};
                    case 'cintura':
                        return {x: medicion.fecha_medicion, y: medicion.circunferencia_cintura_cm};
                }
            }),
            borderWidth: 2,
            fill: false
        };
        
        // Asignar color diferente a cada socio
        const color = getRandomColor();
        datosSocio.borderColor = color;
        datosSocio.backgroundColor = color;
        
        datasets.push(datosSocio);
    });
    
    // Configurar título según el tipo de medición
    let titulo;
    switch(tipoMedicion) {
        case 'peso':
            titulo = 'Evolución del Peso (kg)';
            break;
        case 'grasa':
            titulo = 'Evolución del % de Grasa Corporal';
            break;
        case 'musculo':
            titulo = 'Evolución del % de Músculo';
            break;
        case 'cintura':
            titulo = 'Evolución de la Circunferencia de Cintura (cm)';
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
                        unit: 'month',
                        tooltipFormat: 'YYYY-MM-DD'
                    },
                    title: {
                        display: true,
                        text: 'Fecha'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: titulo.split('(')[0].trim()
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

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Exponer función para que script.js pueda llamarla
window.loadReporte2 = loadReporte2;
window.loadTableDataReporte2 = loadTableDataReporte2;