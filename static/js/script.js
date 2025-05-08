document.addEventListener("DOMContentLoaded", function() {
    initApp();
});

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
                    <li><a href="#" data-report="reporte4">Reporte 4</a></li>
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
                                        <th>Rosales</th>
                                        <th>Come</th>
                                        <th>Mucho</th>
                                        <th>Pene</th>
                                        <th>aaa</th>
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
    ["pene", "2025-05-03", "Categoría E", "Descripción 5", "$500.00"],
    ["006", "2025-05-02", "Categoría F", "Descripción 6", "$600.00"],
    ["007", "2025-05-01", "Categoría G", "Descripción 7", "$700.00"],
    ["008", "2025-04-30", "Categoría H", "Descripción 8", "$800.00"],
    ["009", "2025-04-29", "Categoría I", "Descripción 9", "$900.00"],
    ["010", "2025-04-28", "Categoría J", "Descripción 10", "$1000.00"],
    ["011", "2025-04-27", "Categoría K", "Descripción 11", "$1100.00"],
    ["012", "2025-04-26", "Categoría L", "Descripción 12", "$1200.00"],
    ["001", "2025-05-07", "Categoría A", "Descripción 1", "$100.00"],
    ["002", "2025-05-06", "Categoría B", "Descripción 2", "$200.00"],
    ["003", "2025-05-05", "Categoría C", "Descripción 3", "$300.00"],
    ["004", "2025-05-04", "Categoría D", "Descripción 4", "$400.00"],
    ["pene", "2025-05-03", "Categoría E", "Descripción 5", "$500.00"],
    ["006", "2025-05-02", "Categoría F", "Descripción 6", "$600.00"],
    ["007", "2025-05-01", "Categoría G", "Descripción 7", "$700.00"],
    ["008", "2025-04-30", "Categoría H", "Descripción 8", "$800.00"],
    ["009", "2025-04-29", "Categoría I", "Descripción 9", "$900.00"],
    ["010", "2025-04-28", "Categoría J", "Descripción 10", "$1000.00"],
    ["011", "2025-04-27", "Categoría K", "Descripción 11", "$1100.00"],
    ["012", "2025-04-26", "Categoría L", "Descripción 12", "$1200.00"]
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

function renderPagination() {
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = '';

    totalPages = Math.ceil(allData.length / rowsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            loadTableData();
        });
        paginationContainer.appendChild(pageButton);
    }
}

function setupEventListeners() {
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('nav a').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            document.getElementById('reportTitle').textContent = this.textContent;
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
                renderChart();
            }
        });
    });

    document.getElementById('btnFiltrar').addEventListener('click', function() {
        alert('Filtrar aplicado (simulado)');
    });

    document.getElementById('btnLimpiar').addEventListener('click', function() {
        document.getElementById('filterForm').reset();
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
            loadTableData();
        }
    });

    document.getElementById('nextPage').addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            loadTableData();
        }
    });
}

function renderChart() {
    const ctx = document.getElementById('reportChart').getContext('2d');

    if (window.reportChart && typeof window.reportChart.destroy === 'function') {
        window.reportChart.destroy();
    }

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = allData.slice(start, end);

    const categoryTotals = {};
    pageData.forEach(row => {
        const category = row[2];
        const amount = parseFloat(row[4].replace('$', ''));
        if (categoryTotals[category]) {
            categoryTotals[category] += amount;
        } else {
            categoryTotals[category] = amount;
        }
    });

    const labels = Object.keys(categoryTotals);
    const values = Object.values(categoryTotals);

    window.reportChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Monto total por categoría (página actual)',
                data: values,
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
                    beginAtZero: true
                }
            }
        }
    });
}
