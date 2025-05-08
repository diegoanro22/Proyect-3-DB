// exportaciones.js completo con encabezados dinámicos

function cargarBibliotecas() {
    return new Promise((resolve) => {
        if (!window.jspdf) {
            const jsPdfScript = document.createElement('script');
            jsPdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            jsPdfScript.onload = () => {
                const autoTableScript = document.createElement('script');
                autoTableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js';
                autoTableScript.onload = () => {
                    const sheetJsScript = document.createElement('script');
                    sheetJsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
                    sheetJsScript.onload = () => resolve();
                    document.head.appendChild(sheetJsScript);
                };
                document.head.appendChild(autoTableScript);
            };
            document.head.appendChild(jsPdfScript);
        } else {
            resolve();
        }
    });
}

function inicializarExportacion() {
    cargarBibliotecas().then(() => {
        const btnExportPDF = document.getElementById('btnExportPDF');
        const btnExportExcel = document.getElementById('btnExportExcel');

        if (btnExportPDF) {
            btnExportPDF.addEventListener('click', exportarAPDF);
        }

        if (btnExportExcel) {
            btnExportExcel.addEventListener('click', exportarAExcel);
        }
    });
}

function obtenerEncabezadosTabla() {
    const tabla = document.getElementById('resultsTable');
    if (!tabla) return [];
    const thElements = tabla.querySelectorAll('thead th');
    const encabezados = [];
    thElements.forEach(th => encabezados.push(th.textContent.trim()));
    return encabezados;
}

function obtenerDatosTabla() {
    const tabla = document.getElementById('resultsTable');
    if (!tabla) return [];
    const filas = tabla.querySelectorAll('tbody tr');
    const datos = [];
    filas.forEach(fila => {
        if (fila.querySelector('.no-data')) return;
        const celdas = fila.querySelectorAll('td');
        const filaData = [];
        celdas.forEach(celda => filaData.push(celda.textContent.trim()));
        datos.push(filaData);
    });
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
    return filtros;
}

function exportarAPDF() {
    cargarBibliotecas().then(() => {
        const datos = obtenerDatosTabla();
        if (datos.length === 0) {
            alert('No hay datos para exportar');
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

        doc.save(`${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    });
}

function exportarAExcel() {
    cargarBibliotecas().then(() => {
        const datos = obtenerDatosTabla();
        if (datos.length === 0) {
            alert('No hay datos para exportar');
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

        XLSX.utils.book_append_sheet(wb, ws, reportTitle);
        XLSX.writeFile(wb, `${reportTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
    });
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    inicializarExportacion();
} else {
    document.addEventListener('DOMContentLoaded', inicializarExportacion);
}
