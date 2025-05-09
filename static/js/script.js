// Modificación del script.js para conectar correctamente los botones de exportación

document.addEventListener("DOMContentLoaded", function() {
    // Cargar el script de exportaciones primero
    const exportScript = document.createElement('script');
    exportScript.src = 'exportaciones.js'; // Asumiendo que está en la misma carpeta
    document.head.appendChild(exportScript);
    
    // Luego cargar el resto de scripts
    loadScripts().then(() => {
        initApp();
    });
});

function loadScripts() {
    return new Promise((resolve, reject) => {
        const script1 = document.createElement('script');
        script1.src = '/static/js/rp1.js';
        script1.onload = () => {
            const script2 = document.createElement('script');
            script2.src = '/static/js/rp2.js';
            script2.onload = () => {
                const script3 = document.createElement('script');
                script3.src = '/static/js/rp3.js';
                script3.onload = () => {
                    const script4 = document.createElement('script');
                    script4.src = '/static/js/rp4.js';
                    script4.onload = () => {
                        const script5 = document.createElement('script');
                        script5.src = '/static/js/rp5.js';
                        script5.onload = () => resolve();
                        script5.onerror = () => reject(new Error('Error al cargar rp5.js'));
                        document.head.appendChild(script5);
                    };
                    script4.onerror = () => reject(new Error('Error al cargar rp4.js'));
                    document.head.appendChild(script4);
                };
                script3.onerror = () => reject(new Error('Error al cargar rp3.js'));
                document.head.appendChild(script3);
            };
            script2.onerror = () => reject(new Error('Error al cargar rp2.js'));
            document.head.appendChild(script2);
        };
        script1.onerror = () => reject(new Error('Error al cargar rp1.js'));
        document.head.appendChild(script1);
    });
}


function initApp() {
    const root = document.getElementById("root");
    root.innerHTML = `
        <div class="container">
            <header>
                <h1><i class="fas fa-database"></i> Sistema de Reportes</h1>
                <p>Proyecto 3 - Bases de Datos</p>
            </header>

            <nav>
                <ul>
                    <li><a href="#" class="active" data-report="reporte1">Reporte de Estado y Uso de Equipo</a></li>
                    <li><a href="#" data-report="reporte2">Progreso Físico</a></li>
                    <li><a href="#" data-report="reporte3">Uso de Rutinas y Calorías Quemadas</a></li>
                    <li><a href="#" data-report="reporte4">Uso de Equipos</a></li>
                    <li><a href="#" data-report="reporte5">Frecuencia Visitas</a></li>
                </ul>
            </nav>

            <main>
                <section class="filters">
                    <h2>Filtros</h2>
                    <div id="filterForm">
                        <!-- Los filtros se cargarán dinámicamente según el reporte -->
                        <div class="form-group">
                            <label for="fechaInicio">Fecha Inicio:</label>
                            <input type="date" id="fechaInicio" name="fechaInicio">
                        </div>
                        <div class="form-group">
                            <label for="fechaFin">Fecha Fin:</label>
                            <input type="date" id="fechaFin" name="fechaFin">
                        </div>
                        <div class="form-buttons">
                            <button type="button" id="btnFiltrar">Filtrar</button>
                            <button type="button" id="btnLimpiar">Limpiar</button>
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
let totalPages = 1;

function loadTableData() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '<tr><td colspan="5">Seleccione un reporte</td></tr>';
    document.getElementById('pageInfo').textContent = 'Página 1 de 1';
}

function setupEventListeners() {
    // Navegación entre reportes
    document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('nav a').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        const reportType = this.getAttribute('data-report');
        document.getElementById('reportTitle').textContent = this.textContent;
        
        switch(reportType) {
            case 'reporte1':
                if (typeof window.loadReporte1 === 'function') {
                    window.loadReporte1();
                }
                break;
            case 'reporte2':
                if (typeof window.loadReporte2 === 'function') {
                    window.loadReporte2();
                }
                break;
            case 'reporte3':
                if (typeof window.loadReporte3 === 'function') {
                    window.loadReporte3();
                }
                break;
            case 'reporte4':
                if (typeof window.loadReporte4 === 'function') {
                    window.loadReporte4();
                }
                break;
            case 'reporte5':
                if (typeof window.loadReporte5 === 'function') {
                    window.loadReporte5();
                }
                break;
            default:
                loadTableData();
        }
    });
});

    // Alternar entre vista de tabla y gráfico
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
                    loadTableDataReporte4();
                } else if (activeReport === 'reporte5' && typeof window.renderChartReporte5 === 'function') {
                    loadTableDataReporte5();
                }
            }
        });
    });

    // Botón de filtrar
    document.getElementById('btnFiltrar').addEventListener('click', function() {
        const activeReport = document.querySelector('nav a.active').getAttribute('data-report');
        if (activeReport === 'reporte1') {
            loadTableDataReporte1();
        } else if (activeReport === 'reporte2') {
            loadTableDataReporte2();
        } else if (activeReport === 'reporte3') {
            loadTableDataReporte3();
        } else if (activeReport === 'reporte4') {
            loadTableDataReporte4();
        } else if (activeReport === 'reporte5') {
            loadTableDataReporte5();
        }
    });

    // Botón de limpiar filtros
    document.getElementById('btnLimpiar').addEventListener('click', function() {
        document.getElementById('filterForm').reset();
        const activeReport = document.querySelector('nav a.active').getAttribute('data-report');
        if (activeReport === 'reporte1') {
            loadTableDataReporte1();
        } else if (activeReport === 'reporte2') {
            loadTableDataReporte2();
        } else if (activeReport === 'reporte3') {
            loadTableDataReporte3();
        } else if (activeReport === 'reporte4') {
            loadTableDataReporte4();
        } else if (activeReport === 'reporte5') {
            loadTableDataReporte5();
        }
    });

    // Conectar los botones de exportación a las funciones en exportaciones.js
    // Ya no usamos alerts, sino las funciones reales de exportación
    document.getElementById('btnExportPDF').addEventListener('click', function() {
        // Llamar a la función exportarAPDF de exportaciones.js
        if (typeof window.exportarAPDF === 'function') {
            window.exportarAPDF();
        } else {
            console.error('La función exportarAPDF no está disponible');
        }
    });

    document.getElementById('btnExportExcel').addEventListener('click', function() {
        // Llamar a la función exportarAExcel de exportaciones.js
        if (typeof window.exportarAExcel === 'function') {
            window.exportarAExcel();
        } else {
            console.error('La función exportarAExcel no está disponible');
        }
    });

    // Paginación
    document.getElementById('prevPage').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            handlePagination();
        }
    });

    document.getElementById('nextPage').addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            handlePagination();
        }
    });
}

function handlePagination() {
    const activeReport = document.querySelector('nav a.active').getAttribute('data-report');
    if (activeReport === 'reporte1') {
        loadTableDataReporte1();
    } else if (activeReport === 'reporte2') {
        loadTableDataReporte2();
    } else if (activeReport === 'reporte3') {
        loadTableDataReporte3();
    } else if (activeReport === 'reporte4') {
        loadTableDataReporte4();
    } else if (activeReport === 'reporte5') {
        loadTableDataReporte5();
    }
}

// Funciones globales para llamadas desde los reportes
window.loadTableDataReporte1 = function() {
    if (typeof window.loadReporte1 === 'function') {
        window.loadReporte1();
    }
};

window.loadTableDataReporte2 = function() {
    if (typeof window.loadReporte2 === 'function') {
        window.loadReporte2();
    }
};

window.loadTableDataReporte3 = function() {
    if (typeof window.loadReporte3 === 'function') {
        window.loadReporte3();
    }
};

window.loadTableDataReporte4 = function() {
    if (typeof window.loadReporte4 === 'function') {
        window.loadReporte4();
    }
};

window.loadTableDataReporte5 = function() {
    if (typeof window.loadReporte5 === 'function') {
        window.loadReporte5();
    }
};