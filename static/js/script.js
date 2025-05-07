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
                                <option value="">Seleccionar...</option>
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
                                <tbody>
                                    <tr>
                                        <td colspan="5" class="no-data">Aplique filtros para generar el reporte</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="pagination">
                                <button id="prevPage" disabled><i class="fas fa-chevron-left"></i></button>
                                <span id="pageInfo">Página 1 de 1</span>
                                <button id="nextPage" disabled><i class="fas fa-chevron-right"></i></button>
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
}

function setupEventListeners() {
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('nav a').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const reportType = this.getAttribute('data-report');
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
        });
    });

    document.getElementById('btnFiltrar').addEventListener('click', function() {
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
}
