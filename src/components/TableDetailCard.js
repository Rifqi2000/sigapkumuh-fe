import React, { useState, useEffect } from 'react';

const TableDetailCard = ({ title = "Detail CIP", filters, data = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [authStatus, setAuthStatus] = useState(null);
  const itemsPerPage = 10;

  // === Urutan prioritas kegiatan ===
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

  useEffect(() => {
    const cookies = document.cookie;
    const hasAccessToken = cookies.includes('accessToken');
    const hasRefreshToken = cookies.includes('refreshToken');
    const userData = localStorage.getItem('userData');

    if (hasAccessToken && hasRefreshToken) {
      setAuthStatus('admin');
    } else if (userData) {
      setAuthStatus('external');
    } else {
      setAuthStatus('public');
    }
  }, []);

  // Reset ke halaman 1 jika filter atau data berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, data]);

  const shouldHideAnggaran = authStatus === 'external' || authStatus === 'public';

  // 1) Filter data (termasuk kegiatan)
  const filtered = data.filter((item) => {
    const tahunMatch =
      filters.tahun_cip === 'Semua' || String(item.tahun) === String(filters.tahun_cip);

    const wilayahMatch =
      (filters.wilayah || '') === '' || item.nama_kabkota === filters.wilayah;

    const kecamatanMatch =
      (filters.kecamatan || '') === '' || item.nama_kec === filters.kecamatan;

    const kelurahanMatch =
      (filters.kelurahan || '') === '' || item.nama_kel === filters.kelurahan;

    const rwMatch =
      (filters.rw || '') === '' || item.nama_rw === filters.rw;

    const selectedKegiatan = (filters.kegiatan || '').trim();
    const rowKegiatan = (item.nama_kegiatan || '').trim();

    const kegiatanMatch =
      selectedKegiatan === '' || selectedKegiatan === 'Semua' || rowKegiatan === selectedKegiatan;

    return tahunMatch && wilayahMatch && kecamatanMatch && kelurahanMatch && rwMatch && kegiatanMatch;
  });

  // 2) Grouping per (kegiatan, tipe_bahan, wilayah)
  const groupedMap = new Map();
  filtered.forEach((item) => {
    const wilayah = item.nama_kabkota || '-';
    const key = `${item.nama_kegiatan}||${item.tipe_bahan}||${wilayah}`;
    if (!groupedMap.has(key)) {
      groupedMap.set(key, {
        nama_kegiatan: item.nama_kegiatan,
        tipe_bahan: item.tipe_bahan,
        wilayah,
        volume: Number(item.volume) || 0,
        satuan: item.satuan || '-',
        anggaran: Number(item.anggaran) || 0,
      });
    } else {
      const g = groupedMap.get(key);
      g.volume += Number(item.volume) || 0;
      g.anggaran += Number(item.anggaran) || 0;
      groupedMap.set(key, g);
    }
  });

  // Array grouped (tanpa placeholder), untuk hitung total anggaran
  const grouped = Array.from(groupedMap.values());

  // 2b) Susun menurut ORDERED_KEGIATAN + placeholder jika kosong
  // buat index: kegiatan -> array item
  const byKegiatan = grouped.reduce((acc, it) => {
    const k = it.nama_kegiatan || '-';
    if (!acc[k]) acc[k] = [];
    acc[k].push(it);
    return acc;
  }, {});

  // sort helper di dalam satu kegiatan
  const sortInside = (arr) =>
    arr.sort((a, b) => {
      const t = (a.tipe_bahan || '').localeCompare(b.tipe_bahan || '', 'id');
      if (t !== 0) return t;
      return (a.wilayah || '').localeCompare(b.wilayah || '', 'id');
    });

  const orderedRows = [];

  // Tambahkan sesuai urutan prioritas (pakai placeholder bila kosong)
  ORDERED_KEGIATAN.forEach((nama) => {
    const items = byKegiatan[nama];
    if (items && items.length) {
      orderedRows.push(...sortInside(items));
    } else {
      orderedRows.push({
        nama_kegiatan: nama,
        tipe_bahan: '-',
        wilayah: '-',
        volume: 0,
        satuan: '-',
        anggaran: 0,
        __placeholder: true, // flag internal (tidak dipakai di UI)
      });
    }
  });

  // Tambahkan sisa kegiatan yang tidak ada di daftar (urut alfabetis)
  const remainingNames = Object.keys(byKegiatan)
    .filter((k) => !ORDERED_KEGIATAN.includes(k))
    .sort((a, b) => a.localeCompare(b, 'id'));

  remainingNames.forEach((nama) => {
    orderedRows.push(...sortInside(byKegiatan[nama]));
  });

  // 3) Total anggaran (hanya admin) – dari data nyata saja
  const totalAnggaran = shouldHideAnggaran
    ? null
    : grouped.reduce((sum, item) => sum + (Number(item.anggaran) || 0), 0);

  // 4) Pagination (berdasarkan orderedRows yang sudah ada placeholder)
  const totalPages = Math.ceil(orderedRows.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = orderedRows.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));

  const getSKPD = (wilayah) => (wilayah && wilayah !== '-' ? `Sudin ${wilayah}` : '-');

  return (
    <div className="card">
      <div className="card-header text-center fw-bold">
        {title}
      </div>
      <div className="card-body p-3">
        <div className="table-responsive">
          <table className="table table-sm table-hover text-nowrap">
            <thead>
              <tr>
                <th className="text-uppercase text-secondary small">Nama Kegiatan</th>
                <th className="text-uppercase text-secondary small">Jenis Bahan</th>
                <th className="text-uppercase text-secondary small">Volume</th>
                <th className="text-uppercase text-secondary small">Satuan</th>
                {!shouldHideAnggaran && (
                  <th className="text-uppercase text-secondary small">Anggaran (Rp)</th>
                )}
                <th className="text-uppercase text-secondary small">SKPD</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.nama_kegiatan || '-'}</td>
                    <td>{item.tipe_bahan || '-'}</td>
                    <td>{Number(item.volume || 0).toFixed(2)}</td>
                    <td>{item.satuan || '-'}</td>
                    {!shouldHideAnggaran && (
                      <td>
                        {(Number(item.anggaran) || 0).toLocaleString('id-ID', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    )}
                    <td>{getSKPD(item.wilayah)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={shouldHideAnggaran ? 5 : 6} className="text-center">
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>

            {!shouldHideAnggaran && grouped.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan="4" className="text-end fw-bold">Total</td>
                  <td className="fw-bold">
                    {totalAnggaran.toLocaleString('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-2">
            <button
              className="btn btn-sm custom-btn"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              &laquo; Sebelumnya
            </button>
            <span className="small text-muted">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              className="btn btn-sm custom-btn"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Berikutnya &raquo;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableDetailCard;
