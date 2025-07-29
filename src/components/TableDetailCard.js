import React, { useState } from 'react';

const TableDetailCard = ({ title = "Detail CIP", filters, data = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter data sesuai filter aktif
  const filtered = data.filter((item) => {
    return (
      (filters.tahun_cip === 'Semua' || String(item.tahun) === String(filters.tahun_cip)) &&
      (filters.wilayah === '' || item.nama_kabkota === filters.wilayah) &&
      (filters.kecamatan === '' || item.nama_kec === filters.kecamatan) &&
      (filters.kelurahan === '' || item.nama_kel === filters.kelurahan) &&
      (filters.rw === '' || item.nama_rw === filters.rw)
    );
  });

  // Hitung total anggaran
  const totalAnggaran = filtered.reduce((sum, item) => sum + (Number(item.anggaran) || 0), 0);

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

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
                <th className="text-uppercase text-secondary small">Volume</th>
                <th className="text-uppercase text-secondary small">Satuan</th>
                <th className="text-uppercase text-secondary small">Anggaran (Rp)</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.nama_kegiatan || '-'}</td>
                    <td>{item.volume || '-'}</td>
                    <td>{item.satuan || '-'}</td>
                    <td>{(Number(item.anggaran) || 0).toLocaleString('id-ID')}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">Tidak ada data</td>
                </tr>
              )}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-end fw-bold">Total</td>
                  <td className="fw-bold">
                    {totalAnggaran.toLocaleString('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                    })}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-2">
            <button
              className="btn btn-sm custom-btn"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              &laquo; Sebelumnya
            </button>

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
