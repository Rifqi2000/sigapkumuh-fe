// components/FilterPanel.js
import React from 'react';

const FilterPanel = ({
  selectedTahunCAP,
  selectedTahunCIP,
  selectedWilayah,
  selectedKecamatan,
  selectedKelurahan,
  selectedRW,
  selectedKegiatan,          // ⬅️ NEW
  onChangeTahunCAP,
  onChangeTahunCIP,
  onChangeWilayah,
  onChangeKecamatan,
  onChangeKelurahan,
  onChangeRW,
  onChangeKegiatan,          // ⬅️ NEW
  onReset,
  filterOptions,
  filteredOptions,
}) => {
  return (
    <div className="row g-2">
      <div className="col-12 col-md">
        <select className="form-select" value={selectedTahunCAP} onChange={onChangeTahunCAP}>
          <option value="">Tahun CAP</option>
          {filterOptions.tahun_cap?.map((val) => (
            <option key={val} value={val}>{val}</option>
          ))}
        </select>
      </div>

      <div className="col-12 col-md">
        <select className="form-select" value={selectedTahunCIP} onChange={onChangeTahunCIP}>
          <option value="">Tahun CIP</option>
          {filterOptions.tahun_cip?.map((val) => (
            <option key={val} value={val}>{val}</option>
          ))}
        </select>
      </div>

      <div className="col-12 col-md">
        <select className="form-select" value={selectedWilayah} onChange={onChangeWilayah}>
          <option value="">Wilayah</option>
          {filterOptions.wilayah?.map((val) => (
            <option key={val} value={val}>{val}</option>
          ))}
        </select>
      </div>

      <div className="col-12 col-md">
        <select className="form-select" value={selectedKecamatan} onChange={onChangeKecamatan}>
          <option value="">Kecamatan</option>
          {filteredOptions.kecamatanOptions?.map((val) => (
            <option key={val} value={val}>{val}</option>
          ))}
        </select>
      </div>

      <div className="col-12 col-md">
        <select className="form-select" value={selectedKelurahan} onChange={onChangeKelurahan}>
          <option value="">Kelurahan</option>
          {filteredOptions.kelurahanOptions?.map((val) => (
            <option key={val} value={val}>{val}</option>
          ))}
        </select>
      </div>

      <div className="col-12 col-md">
        <select className="form-select" value={selectedRW} onChange={onChangeRW}>
          <option value="">RW</option>
          {filteredOptions.rwOptions?.map((val) => (
            <option key={val} value={val}>{val}</option>
          ))}
        </select>
      </div>

      {/* === Dropdown Kegiatan (baru) === */}
      <div className="col-12 col-md">
        <select className="form-select" value={selectedKegiatan} onChange={onChangeKegiatan}>
          <option value="">Kegiatan</option>
          {(filterOptions.kegiatan || []).map((val) => (
            <option key={val} value={val}>{val}</option>
          ))}
          {/* Jika nanti ingin dependensi, ganti ke:
              {(filteredOptions.kegiatanOptions || []).map(...)} */}
        </select>
      </div>

      <div className="col-12 col-md-auto d-flex align-items-center justify-content-center">
        <button className="btn-reset-filter" onClick={onReset}>
          <img src="/portal/img/filter.png" alt="Reset Filter" className="filter-icon" />
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
