// components/FilterPanel.js
import React from 'react';

const FilterPanel = ({
  selectedTahunCAP,
  selectedTahunCIP,
  selectedWilayah,
  selectedKecamatan,
  selectedKelurahan,
  selectedRW,
  onChangeTahunCAP,
  onChangeTahunCIP,
  onChangeWilayah,
  onChangeKecamatan,
  onChangeKelurahan,
  onChangeRW,
  onReset,
  filterOptions,
  filteredOptions,
}) => {
  return (
    <div className="row g-2">
      <div className="col-12 col-md">
        <select className="form-select" value={selectedTahunCAP} onChange={onChangeTahunCAP}>
          <option value="">Pilih Tahun CAP</option>
          {filterOptions.tahun_cap?.map((val) => (
            <option key={val} value={val}>{val}</option>
          ))}
        </select>
      </div>
      <div className="col-12 col-md">
        <select className="form-select" value={selectedTahunCIP} onChange={onChangeTahunCIP}>
          <option value="">Pilih Tahun CIP</option>
          {filterOptions.tahun_cip?.map((val) => (
            <option key={val} value={val}>{val}</option>
          ))}
        </select>
      </div>
      <div className="col-12 col-md">
        <select className="form-select" value={selectedWilayah} onChange={onChangeWilayah}>
          <option value="">Pilih Wilayah</option>
          {filterOptions.wilayah?.map((val) => (
            <option key={val} value={val}>{val}</option>
          ))}
        </select>
      </div>
      <div className="col-12 col-md">
        <select className="form-select" value={selectedKecamatan} onChange={onChangeKecamatan}>
          <option value="">Pilih Kecamatan</option>
          {filteredOptions.kecamatanOptions?.map((val) => (
            <option key={val} value={val}>{val}</option>
          ))}
        </select>
      </div>
      <div className="col-12 col-md">
        <select className="form-select" value={selectedKelurahan} onChange={onChangeKelurahan}>
          <option value="">Pilih Kelurahan</option>
          {filteredOptions.kelurahanOptions?.map((val) => (
            <option key={val} value={val}>{val}</option>
          ))}
        </select>
      </div>
      <div className="col-12 col-md">
        <select className="form-select" value={selectedRW} onChange={onChangeRW}>
          <option value="">Pilih RW</option>
          {filteredOptions.rwOptions?.map((val) => (
            <option key={val} value={val}>{val}</option>
          ))}
        </select>
      </div>
      <div className="col-12 col-md-auto d-flex align-items-center justify-content-center">
        <button className="btn-reset-filter" onClick={onReset}>
          <img src="/img/filter.png" alt="Reset Filter" className="filter-icon" />
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
