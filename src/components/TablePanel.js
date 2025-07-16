import React, { useState } from 'react';
import DataTable from 'react-data-table-component';

const TablePanel = ({ data }) => {
  const [searchText, setSearchText] = useState('');

  const columns = [
    {
      name: 'Periode',
      selector: (row) => row.periode_data,
      sortable: true,
    },
    {
      name: 'Wilayah',
      selector: (row) => row.wilayah,
      sortable: true,
    },
    {
      name: 'Kecamatan',
      selector: (row) => row.kecamatan,
      sortable: true,
    },
    {
      name: 'Kelurahan',
      selector: (row) => row.kelurahan,
      sortable: true,
    },
    {
      name: 'Lokasi RW',
      selector: (row) => row.lokasi_rw,
      sortable: true,
    },
    {
      name: 'Jumlah CIP',
      selector: (row) => row.jumlah_peningkatan_psu_dilaksanakan,
      sortable: true,
      right: true,
    },
  ];

  // Filter data berdasarkan teks pencarian (pencocokan bebas)
  const filteredData = data.filter((item) =>
    Object.values(item)
      .join(' ')
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  return (
    <div className="mt-5 pt-4">
      <div className="mb-3 text-end">
        <input
          type="text"
          className="form-control w-25 d-inline"
          placeholder="🔍 Cari data..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <DataTable
        // title="Tabel Data"
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        striped
        responsive
        dense
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        fixedHeader
      />
    </div>
  );
};

export default TablePanel;
