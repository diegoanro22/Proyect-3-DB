document.addEventListener("DOMContentLoaded", function() {
    loadScripts().then(() => {
        initApp();
    });
});

// Modificar la función loadScripts en script.js
function loadScripts() {
    return new Promise((resolve, reject) => {
        // Cargar rp4.js desde la carpeta static/js
        const script = document.createElement('script');
        script.src = '/static/js/rp4.js';  // Ruta actualizada
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Error al cargar rp4.js'));
        document.head.appendChild(script);
    });
}

function initApp() {
    const root = document.getElementById("root");
    root.innerHTML = `
        <div class="container">
            <header>
                <h1><i class="fas fa-database"></i> Sistema de Reportes</h1>
                <p>Proyecto 3 - Bases de Datos </p>
            </header>

            <nav>
                <ul>
                    <li><a href="#" class="active" data-report="reporte1">Reporte 1</a></li>
                    <li><a href="#" data-report="reporte2">Reporte 2</a></li>
                    <li><a href="#" data-report="reporte3">Reporte 3</a></li>
                    <li><a href="#" data-report="reporte4">Uso y Tiempos de Equipos</a></li>
                    <li><a href="#" data-report="reporte5">Reporte 5</a></li>
                </ul>
            </nav>

            <main>
                <section class="filters">
                    <h2>Filtros</h2>
                    <div id="filterForm">
                        <div class="filter-group">
                            <label for="fechaInicio">Fecha Inicio:</label>
                            <input type="date" id="fechaInicio" name="fechaInicio">
                        </div>
                        <div class="filter-group">
                            <label for="fechaFin">Fecha Fin:</label>
                            <input type="date" id="fechaFin" name="fechaFin">
                        </div>
                        <div class="filter-group">
                            <label for="filtro3">Categoría:</label>
                            <select id="filtro3" name="filtro3">
                                <option value="">Seleccionar</option>
                                <option value="opcion1">Opción 1</option>
                                <option value="opcion2">Opción 2</option>
                                <option value="opcion3">Opción 3</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label for="filtro4">Nombre/ID:</label>
                            <input type="text" id="filtro4" name="filtro4" placeholder="Ingrese valor...">
                        </div>
                        <div class="filter-group">
                            <label for="filtro5">Monto Máximo:</label>
                            <input type="number" id="filtro5" name="filtro5" placeholder="0">
                        </div>
                        <div class="filter-group">
                            <button type="button" id="btnFiltrar">Aplicar Filtros</button>
                            <button type="button" id="btnLimpiar">Limpiar Filtros</button>
                        </div>
                    </div>
                </section>

                <section class="results">
                    <div class="results-header">
                        <h2 id="reportTitle">Reporte 1</h2>
                        <div class="export-options">
                            <button id="btnExportPDF"><i class="fas fa-file-pdf"></i> Exportar PDF</button>
                            <button id="btnExportExcel"><i class="fas fa-file-excel"></i> Exportar Excel</button>
                        </div>
                    </div>

                    <div class="visualization-toggle">
                        <button class="toggle-btn active" data-view="table"><i class="fas fa-table"></i> Tabla</button>
                        <button class="toggle-btn" data-view="chart"><i class="fas fa-chart-bar"></i> Gráfica</button>
                    </div>

                    <div class="visualization">
                        <div id="tableView" class="view active">
                            <table id="resultsTable">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Fecha</th>
                                        <th>Categoría</th>
                                        <th>Descripción</th>
                                        <th>Monto</th>
                                    </tr>
                                </thead>
                                <tbody id="tableBody">
                                    <!-- Aquí insertaremos datos -->
                                </tbody>
                            </table>
                            <div class="pagination">
                                <button id="prevPage"><i class="fas fa-chevron-left"></i></button>
                                <span id="pageInfo">Página 1</span>
                                <button id="nextPage"><i class="fas fa-chevron-right"></i></button>
                            </div>
                        </div>
                        <div id="chartView" class="view">
                            <div class="chart-container">
                                <canvas id="reportChart"></canvas>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer>
                <p>Universidad del Valle de Guatemala - Bases de Datos 1 - Ciclo 1, 2025</p>
            </footer>
        </div>
    `;

    setupEventListeners();
    loadTableData();
}

let currentPage = 1;
const rowsPerPage = 10;
const allData = [
    ["001", "2025-05-07", "Categoría A", "Descripción 1", "$100.00"],
    ["002", "2025-05-06", "Categoría B", "Descripción 2", "$200.00"],
    ["003", "2025-05-05", "Categoría C", "Descripción 3", "$300.00"],
    ["004", "2025-05-04", "Categoría D", "Descripción 4", "$400.00"],
    ["005", "2025-05-03", "Categoría E", "Descripción 5", "$500.00"],
    ["006", "2025-05-02", "Categoría F", "Descripción 6", "$600.00"],
    ["007", "2025-05-01", "Categoría G", "Descripción 7", "$700.00"],
    ["008", "2025-04-30", "Categoría H", "Descripción 8", "$800.00"],
    ["009", "2025-04-29", "Categoría I", "Descripción 9", "$900.00"],
    ["010", "2025-04-28", "Categoría J", "Descripción 10", "$1000.00"],
    ["011", "2025-04-27", "Categoría K", "Descripción 11", "$1100.00"],
    ["012", "2025-04-26", "Categoría L", "Descripción 12", "$1200.00"],
    ["013", "2025-05-07", "Categoría A", "Descripción 1", "$100.00"],
    ["014", "2025-05-06", "Categoría B", "Descripción 2", "$200.00"],
    ["015", "2025-05-05", "Categoría C", "Descripción 3", "$300.00"],
    ["016", "2025-05-04", "Categoría D", "Descripción 4", "$400.00"],
    ["017", "2025-05-03", "Categoría E", "Descripción 5", "$500.00"],
    ["018", "2025-05-02", "Categoría F", "Descripción 6", "$600.00"],
    ["019", "2025-05-01", "Categoría G", "Descripción 7", "$700.00"],
    ["020", "2025-04-30", "Categoría H", "Descripción 8", "$800.00"],
    ["021", "2025-04-29", "Categoría I", "Descripción 9", "$900.00"],
    ["022", "2025-04-28", "Categoría J", "Descripción 10", "$1000.00"],
    ["023", "2025-04-27", "Categoría K", "Descripción 11", "$1100.00"],
    ["024", "2025-04-26", "Categoría L", "Descripción 12", "$1200.00"]
];
let totalPages = Math.ceil(allData.length / rowsPerPage);

function loadTableData() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = allData.slice(start, end);

    pageData.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });

    renderPagination();
}

function setupEventListeners() {
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('nav a').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const reportType = this.getAttribute('data-report');
            document.getElementById('reportTitle').textContent = this.textContent;
            
            // Cargar el reporte específico
            if (reportType === 'reporte4') {
                if (typeof window.loadReporte4 === 'function') {
                    window.loadReporte4();
                } else {
                    console.error('La función loadReporte4 no está disponible');
                }
            } else {
                // Cargar el reporte predeterminado para otros tipos
                loadTableData();
            }
        });
    });

    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const viewType = this.getAttribute('data-view');
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            document.getElementById(viewType + 'View').classList.add('active');

            if (viewType === 'chart') {
                const activeReport = document.querySelector('nav a.active').getAttribute('data-report');
                if (activeReport === 'reporte4' && typeof window.renderChartReporte4 === 'function') {
                    // Si estamos en el reporte 4, usamos su función específica de gráficos
                    loadTableDataReporte4();
                } else {
                    // Para otros reportes usamos la función genérica
                    renderChart();
                }
            }
        });
    });

    document.getElementById('btnFiltrar').addEventListener('click', function() {
        const activeReport = document.querySelector('nav a.active').getAttribute('data-report');
        if (activeReport === 'reporte4') {
            loadTableDataReporte4();
        } else {
            alert('Filtrar aplicado (simulado)');
        }
    });

    document.getElementById('btnLimpiar').addEventListener('click', function() {
        document.getElementById('filterForm').reset();
        const activeReport = document.querySelector('nav a.active').getAttribute('data-report');
        if (activeReport === 'reporte4') {
            loadTableDataReporte4();
        }
    });

    document.getElementById('btnExportPDF').addEventListener('click', function() {
        alert('Exportar a PDF conectado');
    });

    document.getElementById('btnExportExcel').addEventListener('click', function() {
        alert('Exportar a Excel conectado');
    });

    document.getElementById('prevPage').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            
            const activeReport = document.querySelector('nav a.active').getAttribute('data-report');
            if (activeReport === 'reporte4') {
                loadTableDataReporte4();
            } else {
                loadTableData();
            }
        }
    });

    document.getElementById('nextPage').addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            
            const activeReport = document.querySelector('nav a.active').getAttribute('data-report');
            if (activeReport === 'reporte4') {
                loadTableDataReporte4();
            } else {
                loadTableData();
            }
        }
    });
}