import React, { useEffect, useRef, useId, useMemo, useState } from 'react';
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

const ORDERED_KEGIATAN = [
  'Jalan Lingkungan',
  'Trotoar',
  'Drainase Lingkungan',
  'Penerangan Jalan Umum',
  'Septictank Komunal',
  'IPAL Komunal',
  'Pencegahan Kebakaran',
  'Penghijauan',
  'Persampahan',
  'Sarpras Lainnya',
  'Bangunan PSU',
  'Pendukung Dekorasi',
  'Pendukung Keamanan dan Keselamatan Kawasan',
  'Administrasi',
  'Fasilitas Ekonomi',
];

const AllDataTable = ({ data = [], filters = {} }) => {
  const tableRef = useRef(null);
  const tableId = useId();
  const [authStatus, setAuthStatus] = useState(null);

  // deteksi status pengguna
  useEffect(() => {
    const cookies = document.cookie;
    const hasAccessToken = cookies.includes('accessToken');
    const hasRefreshToken = cookies.includes('refreshToken');
    const userData = localStorage.getItem('userData');

    if (hasAccessToken && hasRefreshToken) setAuthStatus('admin');
    else if (userData) setAuthStatus('external');
    else setAuthStatus('public');
  }, []);

  // mapping urutan kegiatan
  const orderIndex = useMemo(() => {
    const m = new Map();
    ORDERED_KEGIATAN.forEach((name, i) => m.set(name.toLowerCase(), i));
    return m;
  }, []);

  const filteredAndSorted = useMemo(() => {
    const tahunCIP = String(filters.tahun_cip || '');
    const wilayah = filters.wilayah || '';
    const kecamatan = filters.kecamatan || '';
    const kelurahan = filters.kelurahan || '';
    const rw = filters.rw || '';
    const kegiatan = (filters.kegiatan || '').trim();

    const rows = (data || []).filter((row) => {
      const rowTahun = String(row.tahun || '');
      const rowWilayah = row.nama_kabkota || '';
      const rowKecamatan = row.nama_kec || '';
      const rowKelurahan = row.nama_kel || '';
      const rowRW = row.nama_rw || '';
      const rowKegiatan = (row.nama_kegiatan || '').trim();

      return (
        (filters.tahun_cip === 'Semua' || rowTahun === tahunCIP) &&
        (wilayah === '' || rowWilayah === wilayah) &&
        (kecamatan === '' || rowKecamatan === kecamatan) &&
        (kelurahan === '' || rowKelurahan === kelurahan) &&
        (rw === '' || rowRW === rw) &&
        (kegiatan === '' || kegiatan === 'Semua' || rowKegiatan === kegiatan)
      );
    });

    const sorted = [...rows].sort((a, b) => {
      const aName = (a.nama_kegiatan || '').toLowerCase();
      const bName = (b.nama_kegiatan || '').toLowerCase();

      const ai = orderIndex.has(aName) ? orderIndex.get(aName) : Infinity;
      const bi = orderIndex.has(bName) ? orderIndex.get(bName) : Infinity;

      if (ai !== bi) return ai - bi;
      return (a.nama_kegiatan || '').localeCompare(b.nama_kegiatan || '', 'id');
    });

    return sorted;
  }, [data, filters, orderIndex]);

  const getSKPD = (wilayah) => (wilayah ? `Sudin ${wilayah}` : '-');

  const columns = useMemo(() => {
    return [
      { title: 'TAHUN', data: 'tahun' },
      { title: 'NAMA KABUPATEN/KOTA', data: 'nama_kabkota' },
      { title: 'NAMA KECAMATAN', data: 'nama_kec' },
      { title: 'NAMA KELURAHAN', data: 'nama_kel' },
      { title: 'NAMA RW', data: 'nama_rw' },
      { title: 'NAMA KEGIATAN', data: 'nama_kegiatan' },
      { title: 'JENIS BAHAN', data: 'tipe_bahan' },
      { title: 'VOLUME', data: 'volume' },
      { title: 'SATUAN', data: 'satuan' },
      { title: 'ANGGARAN (Rp)', data: 'anggaran' },
      { title: 'SKPD', data: null, isSkpd: true }, // kolom terakhir
    ];
  }, []);

  // inisialisasi DataTable — hanya untuk admin
  useEffect(() => {
    if (authStatus !== 'admin') return;

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
        order: [], // gunakan urutan data hasil sort kustom
        destroy: true,
        dom: 'Brtip',
        data: filteredAndSorted,
        columns: columns.map((col) => ({
          title: col.title,
          data: col.data,
          className: 'text-center',
          render: function (data, type, row) {
            if (col.title.includes('ANGGARAN')) {
              const num = parseFloat(row?.anggaran ?? data ?? 0);
              if (isNaN(num)) return data ?? '-';
              return num.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
            }
            if (col.title === 'SKPD' || col.isSkpd) {
              return getSKPD(row?.nama_kabkota || '');
            }
            return (data ?? '-') === '' ? '-' : data ?? '-';
          },
        })),
        buttons: [
          {
            extend: 'excelHtml5',
            titleAttr: 'Export ke Excel',
            text: '<img src="/portal/img/xlsx.png" alt="Excel" width="40" />',
          },
          {
            extend: 'csvHtml5',
            titleAttr: 'Export ke CSV',
            text: '<img src="/portal/img/csv.png" alt="CSV" width="40" />',
          },
          {
            extend: 'pdfHtml5',
            titleAttr: 'Export ke PDF',
            text: '<img src="/portal/img/pdf.png" alt="PDF" width="40" />',
            orientation: 'landscape',
            pageSize: 'A4',
            customize: function (doc) {
              try {
                const colCount = doc.content[1].table.body[0].length;
                doc.content[1].table.widths = Array(colCount).fill('*');
                doc.styles.tableHeader = { alignment: 'center', fontSize: 8 };
                doc.styles.tableBodyEven = { alignment: 'center', fontSize: 8 };
                doc.styles.tableBodyOdd = { alignment: 'center', fontSize: 8 };
                doc.defaultStyle.fontSize = 8;
                doc.pageMargins = [20, 30, 20, 30];
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
      if ($.fn.DataTable.isDataTable($(tableRef.current))) {
        $(tableRef.current).DataTable().destroy();
        $(tableRef.current).empty();
      }
    };
  }, [filteredAndSorted, columns, authStatus]);

  // ⬇️ Hanya render untuk admin
  if (authStatus !== 'admin') return null;

  return (
    <div className="card mt-4 shadow-sm">
      <div className="card-header fw-bold text-center">
        Tabel CIP di DKI Jakarta
      </div>

      <div className="card-body p-2 p-md-4">
        {/* Export + Search */}
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

        {/* Tabel */}
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
