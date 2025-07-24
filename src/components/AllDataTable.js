import React, { useEffect, useRef, useId } from 'react';
import $ from 'jquery';

import 'datatables.net-bs5';
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import 'datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import './css/AllDataTable.css'

import 'jszip';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.default?.pdfMake?.vfs || pdfFonts?.pdfMake?.vfs;

const AllDataTable = ({ data = [], filters = {} }) => {
  const tableRef = useRef(null);
  const tableId = useId();

  useEffect(() => {
    const tableEl = $(tableRef.current);

    // Destroy if already initialized
    if ($.fn.DataTable.isDataTable(tableEl)) {
      tableEl.DataTable().destroy();
      tableEl.empty(); // Clear thead/tbody to avoid duplicate rows
    }

    // Reset export buttons
    $('#customExportButtons').html('');

    // Wait for DOM update (avoid race)
    requestAnimationFrame(() => {
      const table = tableEl.DataTable({
        paging: true,
        pageLength: 10,
        searching: true,
        ordering: true,
        destroy: true,
        dom: 'Brtip',
        buttons: [
          {
            extend: 'excelHtml5',
            titleAttr: 'Export ke Excel',
            text: '<img src="/img/xlsx.png" alt="Excel" width="40" />',
          },
          {
            extend: 'csvHtml5',
            titleAttr: 'Export ke CSV',
            text: '<img src="/img/csv.png" alt="CSV" width="40" />',
          },
          {
            extend: 'pdfHtml5',
            titleAttr: 'Export ke PDF',
            text: '<img src="/img/pdf.png" alt="PDF" width="40" />',
            orientation: 'landscape',
            pageSize: 'A4',
            customize: function (doc) {
              try {
                if (doc?.content?.[1]?.table) {
                  const colCount = doc.content[1].table.body[0].length;
                  doc.content[1].table.widths = Array(colCount).fill('*');

                  doc.styles.tableHeader = { alignment: 'left', fontSize: 8 };
                  doc.styles.tableBodyEven = { alignment: 'left', fontSize: 8 };
                  doc.styles.tableBodyOdd = { alignment: 'left', fontSize: 8 };
                  doc.defaultStyle.fontSize = 8;

                  doc.pageMargins = [20, 30, 20, 30];
                  doc.content.splice(0, 0, {
                    text: 'Dashboard Data SIGAP KUMUH',
                    style: 'header',
                    alignment: 'center',
                    margin: [0, 0, 0, 10],
                  });
                }
              } catch (err) {
                console.error('PDF customization error:', err);
              }
            },
          },
        ],
        language: {
          emptyTable: 'Tidak ada data tersedia.',
          search: 'Cari:',
          paginate: {
            first: 'Pertama',
            last: 'Terakhir',
            next: '→',
            previous: '←',
          },
        },
      });

      table.buttons().container().appendTo('#customExportButtons');
    });

    return () => {
      if ($.fn.DataTable.isDataTable(tableEl)) {
        tableEl.DataTable().destroy();
        tableEl.empty();
      }
    };
  }, [data]);

  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  const filteredData = data.filter((row) => {
    return (
      (filters.tahun === 'Semua' || row.tahun === filters.tahun) &&
      (filters.wilayah === 'Semua' || row.wilayah === filters.wilayah) &&
      (filters.kecamatan === 'Semua' || row.kecamatan === filters.kecamatan) &&
      (filters.kelurahan === 'Semua' || row.kelurahan === filters.kelurahan) &&
      (filters.rw === 'Semua' || row.rw === filters.rw)
    );
  });

  if (filteredData.length === 0) {
    return <p className="text-center">Tidak ada data sesuai filter yang dipilih.</p>;
  }

  return (
    <div className="card mt-4 shadow-sm">
      <div className="card-header fw-bold text-center">Tabel CIP Point di DKI Jakarta</div>

      <div className="d-flex align-items-center justify-content-between flex-wrap px-3 py-2">
        <div className="d-flex align-items-center">
          <strong className="me-2">Export to :</strong>
          <div id="customExportButtons" className="d-flex gap-2"></div>
        </div>

        {/* Custom Search */}
        <div className="custom-search-box mt-2 mt-md-0">
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            onChange={(e) => {
              const value = e.target.value;
              if ($.fn.DataTable.isDataTable($(tableRef.current))) {
                $(tableRef.current).DataTable().search(value).draw();
              }
            }}
          />
        </div>
      </div>

      <div className="table-responsive p-3">
        <table ref={tableRef} id={tableId} className="table w-100">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx}>{col.replace(/_/g, ' ').toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col, cidx) => {
                  const value = row[col];
                  const formatted =
                    col.toLowerCase().includes('anggaran') && !isNaN(value)
                      ? `${parseInt(value).toLocaleString('id-ID')}`
                      : value;
                  return <td key={cidx}>{formatted}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllDataTable;
