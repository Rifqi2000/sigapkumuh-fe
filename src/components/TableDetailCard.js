import React from 'react';

const TableDetailCard = ({ title = "Detail CIP", filters, data = [] }) => {
  const filtered = data.filter((item) => {
    return (
      (filters.tahun === 'Semua' || item.tahun === filters.tahun) &&
      (filters.wilayah === 'Semua' || item.wilayah === filters.wilayah) &&
      (filters.kecamatan === 'Semua' || item.kecamatan === filters.kecamatan) &&
      (filters.kelurahan === 'Semua' || item.kelurahan === filters.kelurahan) &&
      (filters.rw === 'Semua' || item.rw === filters.rw)
    );
  });

  const totalAnggaran = filtered.reduce((sum, item) => sum + (item.anggaran_cip || 0), 0);

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
                <th className="text-secondary small">
                  <span className="text-uppercase">Anggaran</span> (Rp)
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.length > 0 ? (
                filtered.map((item, index) => (
                  <tr key={index}>
                    <td>{item.nama_kegiatan || 'Pekerjaan Jalan Lingkungan (ASPAL)'}</td>
                    <td>{item.jumlah_cip || '-'}</td>
                    <td>{item.satuan || '-'}</td>
                    <td>{(item.anggaran_cip || 0).toLocaleString('id-ID')}</td>
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
                      
                    })}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableDetailCard;
