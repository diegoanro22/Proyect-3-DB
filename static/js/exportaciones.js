// exportaciones.js mejorado para asegurar que funcionen PDF y Excel

// Exponer las funciones de exportación en el objeto window
window.exportarAPDF = exportarAPDF;
window.exportarAExcel = exportarAExcel;

function cargarBibliotecas() {
    return new Promise((resolve) => {
        // Verificar si ya están cargadas las bibliotecas
        if (window.jspdf && window.XLSX) {
            resolve();
            return;
        }

        // Cargar jsPDF si no está disponible
        if (!window.jspdf) {
            const jsPdfScript = document.createElement('script');
            jsPdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            jsPdfScript.onload = () => {
                console.log('jsPDF cargado correctamente');
                
                // Cargar autoTable
                const autoTableScript = document.createElement('script');
                autoTableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js';
                autoTableScript.onload = () => {
                    console.log('autoTable cargado correctamente');
                    
                    // Solo cargar SheetJS si aún no está disponible
                    if (!window.XLSX) {
                        const sheetJsScript = document.createElement('script');
                        sheetJsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
                        sheetJsScript.onload = () => {
                            console.log('SheetJS cargado correctamente');
                            resolve();
                        };
                        sheetJsScript.onerror = (e) => {
                            console.error('Error al cargar SheetJS', e);
                            resolve(); // Resolver de todos modos para intentar continuar
                        };
                        document.head.appendChild(sheetJsScript);
                    } else {
                        resolve();
                    }
                };
                autoTableScript.onerror = (e) => {
                    console.error('Error al cargar autoTable', e);
                    resolve(); // Resolver de todos modos
                };
                document.head.appendChild(autoTableScript);
            };
            jsPdfScript.onerror = (e) => {
                console.error('Error al cargar jsPDF', e);
                resolve(); // Resolver de todos modos
            };
            document.head.appendChild(jsPdfScript);
        } 
        // Si jsPDF ya está cargado pero SheetJS no
        else if (!window.XLSX) {
            const sheetJsScript = document.createElement('script');
            sheetJsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
            sheetJsScript.onload = () => {
                console.log('SheetJS cargado correctamente');
                resolve();
            };
            sheetJsScript.onerror = (e) => {
                console.error('Error al cargar SheetJS', e);
                resolve(); // Resolver de todos modos
            };
            document.head.appendChild(sheetJsScript);
        } else {
            resolve();
        }
    });
}

function inicializarExportacion() {
    console.log('Inicializando exportación...');
    cargarBibliotecas().then(() => {
        console.log('Bibliotecas cargadas, configurando botones...');
        const btnExportPDF = document.getElementById('btnExportPDF');
        const btnExportExcel = document.getElementById('btnExportExcel');

        if (btnExportPDF) {
            btnExportPDF.addEventListener('click', exportarAPDF);
            console.log('Botón PDF configurado');
        } else {
            console.warn('No se encontró el botón de exportar PDF');
        }

        if (btnExportExcel) {
            btnExportExcel.addEventListener('click', exportarAExcel);
            console.log('Botón Excel configurado');
        } else {
            console.warn('No se encontró el botón de exportar Excel');
        }
    }).catch(error => {
        console.error('Error al inicializar exportación:', error);
    });
}

function obtenerEncabezadosTabla() {
    const tabla = document.getElementById('resultsTable');
    if (!tabla) {
        console.warn('No se encontró la tabla de resultados');
        return [];
    }
    const thElements = tabla.querySelectorAll('thead th');
    const encabezados = [];
    thElements.forEach(th => encabezados.push(th.textContent.trim()));
    console.log('Encabezados obtenidos:', encabezados);
    return encabezados;
}

function obtenerDatosTabla() {
    const tabla = document.getElementById('resultsTable');
    if (!tabla) {
        console.warn('No se encontró la tabla de resultados');
        return [];
    }
    const filas = tabla.querySelectorAll('tbody tr');
    const datos = [];
    filas.forEach(fila => {
        if (fila.querySelector('.no-data')) return;
        const celdas = fila.querySelectorAll('td');
        const filaData = [];
        celdas.forEach(celda => filaData.push(celda.textContent.trim()));
        datos.push(filaData);
    });
    console.log(`Se obtuvieron ${datos.length} filas de datos`);
    return datos;
}

function obtenerFiltrosAplicados() {
    const filtros = {};
    const ids = ['fechaInicio', 'fechaFin', 'filtro3', 'filtro4', 'filtro5'];
    ids.forEach(id => {
        const elem = document.getElementById(id);
        if (elem && elem.value) {
            filtros[id] = elem.value;
        }
    });
    console.log('Filtros aplicados:', filtros);
    return filtros;
}

function exportarAPDF() {
    console.log('Iniciando exportación a PDF...');
    cargarBibliotecas().then(() => {
        try {
            const datos = obtenerDatosTabla();
            if (datos.length === 0) {
                alert('No hay datos para exportar');
                return;
            }

            if (!window.jspdf || !window.jspdf.jsPDF) {
                console.error('La biblioteca jsPDF no está disponible correctamente');
                alert('Error al cargar la biblioteca PDF. Por favor, intente de nuevo.');
                return;
            }

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            const reportTitle = document.getElementById('reportTitle')?.textContent || 'Reporte';
            doc.setFontSize(18);
            doc.text(`Sistema de Reportes - ${reportTitle}`, 14, 22);

            doc.setFontSize(11);
            doc.text(`Generado: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 30);

            let y = 38;
            doc.setFontSize(12);
            doc.text('Filtros aplicados:', 14, y);
            y += 8;

            doc.setFontSize(10);
            const filtros = obtenerFiltrosAplicados();
            Object.entries(filtros).forEach(([key, value]) => {
                doc.text(`${key}: ${value}`, 14, y);
                y += 6;
            });

            y += 10;

            const headers = [obtenerEncabezadosTabla()];
            const datosTabla = datos;

            doc.autoTable({
                startY: y,
                head: headers,
                body: datosTabla,
                theme: 'grid',
                headStyles: { fillColor: [41, 128, 185], textColor: 255 },
                alternateRowStyles: { fillColor: [240, 240, 240] },
                margin: { top: 60 }
            });

            const finalY = doc.lastAutoTable.finalY + 10;
            doc.setFontSize(11);
            doc.text(`Total de registros: ${datos.length}`, 14, finalY);

            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(9);
                doc.text('Universidad del Valle de Guatemala - Bases de Datos 1 - Ciclo 1, 2025', 14, doc.internal.pageSize.height - 10);
                doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
            }

            const fileName = `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
            console.log('Guardando PDF como:', fileName);
            doc.save(fileName);
            console.log('PDF exportado con éxito');
        } catch (error) {
            console.error('Error al exportar a PDF:', error);
            alert('Ocurrió un error al exportar a PDF: ' + error.message);
        }
    }).catch(error => {
        console.error('Error al cargar bibliotecas para PDF:', error);
        alert('Error al cargar bibliotecas necesarias');
    });
}

function exportarAExcel() {
    console.log('Iniciando exportación a Excel...');
    cargarBibliotecas().then(() => {
        try {
            const datos = obtenerDatosTabla();
            if (datos.length === 0) {
                alert('No hay datos para exportar');
                return;
            }

            if (!window.XLSX) {
                console.error('La biblioteca SheetJS (XLSX) no está disponible');
                alert('Error al cargar la biblioteca Excel. Por favor, intente de nuevo.');
                return;
            }

            const reportTitle = document.getElementById('reportTitle')?.textContent || 'Reporte';
            const wsData = [
                ['Sistema de Reportes - ' + reportTitle],
                ['Generado: ' + new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()],
                [],
                ['Filtros aplicados:']
            ];

            const filtros = obtenerFiltrosAplicados();
            Object.entries(filtros).forEach(([key, value]) => {
                wsData.push([`${key}:`, value]);
            });

            wsData.push([]);
            wsData.push(obtenerEncabezadosTabla());
            datos.forEach(row => wsData.push(row));

            wsData.push([]);
            wsData.push(['Total de registros:', datos.length]);

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(wsData);
            ws['!cols'] = obtenerEncabezadosTabla().map(() => ({ wch: 15 }));

            const safeTitle = reportTitle.replace(/[^a-z0-9]/gi, '_').substring(0, 30);
            XLSX.utils.book_append_sheet(wb, ws, safeTitle);
            
            const fileName = `${safeTitle}_${new Date().toISOString().split('T')[0]}.xlsx`;
            console.log('Guardando Excel como:', fileName);
            XLSX.writeFile(wb, fileName);
            console.log('Excel exportado con éxito');
        } catch (error) {
            console.error('Error al exportar a Excel:', error);
            alert('Ocurrió un error al exportar a Excel: ' + error.message);
        }
    }).catch(error => {
        console.error('Error al cargar bibliotecas para Excel:', error);
        alert('Error al cargar bibliotecas necesarias');
    });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    inicializarExportacion();
} else {
    document.addEventListener('DOMContentLoaded', inicializarExportacion);
}