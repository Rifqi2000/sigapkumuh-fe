import React, { useEffect, useRef, useId, useMemo } from 'react';
import $ from 'jquery';

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
        (filters.tahun_cip === 'Semua' || String(row.tahun) === String(filters.tahun_cip)) &&
        (filters.wilayah === '' || row.nama_kabkota === filters.wilayah) &&
        (filters.kecamatan === '' || row.nama_kec === filters.kecamatan) &&
        (filters.kelurahan === '' || row.nama_kel === filters.kelurahan) &&
        (filters.rw === '' || row.nama_rw === filters.rw)
      );
    });
  }, [data, filters]);

  const columns = useMemo(() => {
    return filteredData.length > 0 ? Object.keys(filteredData[0]) : [];
  }, [filteredData]);

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
          title: col.replace(/_/g, ' ').toUpperCase(),
          data: col,
          className: 'text-center',
          render: function (data) {
            if (col.toLowerCase().includes('anggaran') && !isNaN(data)) {
              return parseInt(data).toLocaleString('id-ID');
            }
            return data;
          },
        })),
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
      <div className="card-header fw-bold text-center">
        Tabel CIP di DKI Jakarta
      </div>

      <div className="card-body p-2 p-md-4">
        {/* === Export Button + Search Box === */}
        <div className="d-flex align-items-center justify-content-between flex-wrap px-2 px-md-3 mb-3">
          <div className="d-flex align-items-center flex-wrap">
            <strong className="me-2">Export to :</strong>
            <div id="customExportButtons" className="d-flex gap-2 flex-wrap"></div>
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

        {/* === Tabel === */}
        <div className="table-responsive">
          <table
            ref={tableRef}
            id={tableId}
            className="table table-hover w-100"
          />
        </div>
      </div>
    </div>
  );
};

export default AllDataTable;
