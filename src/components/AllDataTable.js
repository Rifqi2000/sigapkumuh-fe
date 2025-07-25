import React, { useEffect, useRef, useId, useMemo } from 'react';
import $ from 'jquery';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import 'datatables.net-bs5';
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import 'datatables.net-buttons-bs5/css/buttons.bootstrap5.min.css';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import './css/AllDataTable.css';

import 'jszip';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.default?.pdfMake?.vfs || pdfFonts?.pdfMake?.vfs;

const AllDataTable = ({ data = [], filters = {} }) => {
  const tableRef = useRef(null);
  const tableId = useId();

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      return (
        (filters.tahun === 'Semua' || row.tahun === filters.tahun) &&
        (filters.wilayah === 'Semua' || row.wilayah === filters.wilayah) &&
        (filters.kecamatan === 'Semua' || row.kecamatan === filters.kecamatan) &&
        (filters.kelurahan === 'Semua' || row.kelurahan === filters.kelurahan) &&
        (filters.rw === 'Semua' || row.rw === filters.rw)
      );
    });
  }, [data, filters]);

  const columns = useMemo(() => {
    return filteredData.length > 0 ? Object.keys(filteredData[0]) : [];
  }, [filteredData]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Tabel-CIP.xlsx');
  };

  useEffect(() => {
    const tableEl = $(tableRef.current);

    if ($.fn.DataTable.isDataTable(tableEl)) {
      tableEl.DataTable().destroy();
      tableEl.empty();
    }

    $('#customExportButtons').html('');

    requestAnimationFrame(() => {
      const table = tableEl.DataTable({
        paging: true,
        pageLength: 10,
        searching: true,
        ordering: true,
        destroy: true,
        dom: 'Brtip',
        data: filteredData,
        columns: columns.map((col) => ({
          title:
            col === 'anggaran_cap'
              ? 'ANGGARAN CAP (Rp)'
              : col === 'anggaran_cip'
              ? 'ANGGARAN CIP (Rp)'
              : col.replace(/_/g, ' ').toUpperCase(),
          data: col,
          className: 'text-center',
          render: function (data, type, row) {
            if (col.toLowerCase().includes('anggaran') && !isNaN(data)) {
              return parseInt(data).toLocaleString('id-ID');
            }
            return data;
          }
        })),
        buttons: [
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
                  doc.styles.tableHeader = { alignment: 'center', fontSize: 8 };
                  doc.styles.tableBodyEven = { alignment: 'center', fontSize: 8 };
                  doc.styles.tableBodyOdd = { alignment: 'center', fontSize: 8 };
                  doc.defaultStyle.fontSize = 8;
                  doc.pageMargins = [20, 30, 20, 30];
                  doc.content.splice(0, 0, {
                    text: '',
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
  }, [filteredData, columns]);

  return (
    <div className="card mt-4 shadow-sm">
      <div className="card-header fw-bold text-center">Tabel CIP Point di DKI Jakarta</div>

      <div className="d-flex align-items-center justify-content-between flex-wrap px-3 py-2">
        <div className="d-flex align-items-center">
          <strong className="me-2">Export to :</strong>
          <div className="d-flex gap-2" id="customExportButtons">
            <button className="btn btn-sm btn-outline-success" onClick={exportToExcel}>
              <i className="bi bi-file-earmark-excel-fill me-1"></i> Excel
            </button>
          </div>
        </div>

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
        <table ref={tableRef} id={tableId} className="table table-hover w-100" />
      </div>
    </div>
  );
};

export default AllDataTable;
