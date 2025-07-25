// src/App.js
import React, { useState, useRef } from 'react';
import HeroSection from './components/HeroSection';
import BarChartCard from './components/BarChartCard';
import DonutChartCard from './components/DonutChartCard';
import TableDetailCard from './components/TableDetailCard';
import AllDataTable from './components/AllDataTable';
import './App.css';
import 'animate.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  const [selectedTahun, setSelectedTahun] = useState('');
  const [selectedWilayah, setSelectedWilayah] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState('');
  const [selectedKelurahan, setSelectedKelurahan] = useState('');
  const [selectedRW, setSelectedRW] = useState('');

  const contentRef = useRef(null);

  const scrollToContent = () => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filters = {
    tahun: selectedTahun === '' ? 'Semua' : selectedTahun,
    wilayah: selectedWilayah === '' ? 'Semua' : selectedWilayah,
    kecamatan: selectedKecamatan === '' ? 'Semua' : selectedKecamatan,
    kelurahan: selectedKelurahan === '' ? 'Semua' : selectedKelurahan,
    rw: selectedRW === '' ? 'Semua' : selectedRW,
  };

  const summaryData = {
    jumlah_rw_kumuh: 445,
    jumlah_rw_implementasi: 104,
    jumlah_cip: 3674,
    total_anggaran: 14673664072956,
  };

  const data = [
    {
      tahun: '2024',
      wilayah: 'Pusat',
      kecamatan: 'Gambir',
      kelurahan: 'Kelurahan A',
      rw: '01',
      nama_kegiatan: 'APAR',
      volume: '1',
      satuan: 'unit',
      jumlah_rw_kumuh: 3,
      jumlah_cap: 1,
      jumlah_cip: 1,
      anggaran_cap: 1200000,
      anggaran_cip: 1175000,
    },
    {
      tahun: '2024',
      wilayah: 'Barat',
      kecamatan: 'Cempaka Putih',
      kelurahan: 'Kelurahan D',
      rw: '05',
      nama_kegiatan: 'Pekerjaan Utilitas',
      volume: '1',
      satuan: 'buah',
      jumlah_rw_kumuh: 4,
      jumlah_cap: 2,
      jumlah_cip: 1,
      anggaran_cap: 3000000,
      anggaran_cip: 1485000,
    },
    {
      tahun: '2024',
      wilayah: 'Selatan',
      kecamatan: 'Tebet',
      kelurahan: 'Kelurahan F',
      rw: '07',
      nama_kegiatan: 'Pekerjaan Papan Nama Jalan',
      volume: '3',
      satuan: 'unit',
      jumlah_rw_kumuh: 6,
      jumlah_cap: 3,
      jumlah_cip: 1,
      anggaran_cap: 4500000,
      anggaran_cip: 1125000,
    },
    {
      tahun: '2024',
      wilayah: 'Utara',
      kecamatan: 'Kelapa Gading',
      kelurahan: 'Kelurahan H',
      rw: '09',
      nama_kegiatan: 'Cermin Cembung',
      volume: '1',
      satuan: 'buah',
      jumlah_rw_kumuh: 5,
      jumlah_cap: 1,
      jumlah_cip: 1,
      anggaran_cap: 5000000,
      anggaran_cip: 4500000,
    },
  ];

  const getDependentOptions = (level) => {
    const filtered = data.filter((d) =>
      (filters.tahun === 'Semua' || d.tahun === filters.tahun) &&
      (filters.wilayah === 'Semua' || d.wilayah === filters.wilayah) &&
      (filters.kecamatan === 'Semua' || d.kecamatan === filters.kecamatan) &&
      (filters.kelurahan === 'Semua' || d.kelurahan === filters.kelurahan) &&
      (filters.rw === 'Semua' || d.rw === filters.rw)
    );

    switch (level) {
      case 'tahun':
        return [...new Set(data.map(d => d.tahun))];
      case 'wilayah':
        return [...new Set(filtered.map(d => d.wilayah))];
      case 'kecamatan':
        return [...new Set(filtered.map(d => d.kecamatan))];
      case 'kelurahan':
        return [...new Set(filtered.map(d => d.kelurahan))];
      case 'rw':
        return [...new Set(filtered.map(d => d.rw))];
      default:
        return [];
    }
  };

  return (
    <div className="App" style={{ backgroundColor: '#83DBF6', minHeight: '100vh', color: '#fff' }}>
      <HeroSection summary={summaryData} onScrollClick={scrollToContent} />

      <div ref={contentRef} className="container py-4">
        {/* Filter Section */}
        <div className="row g-2">
          <div className="col">
            <select className="form-select" value={selectedTahun} onChange={(e) => setSelectedTahun(e.target.value)}>
              <option value="">Pilih Tahun</option>
              {getDependentOptions('tahun').map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
          <div className="col">
            <select className="form-select" value={selectedWilayah} onChange={(e) => setSelectedWilayah(e.target.value)}>
              <option value="">Pilih Wilayah</option>
              {getDependentOptions('wilayah').map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
          <div className="col">
            <select className="form-select" value={selectedKecamatan} onChange={(e) => setSelectedKecamatan(e.target.value)}>
              <option value="">Pilih Kecamatan</option>
              {getDependentOptions('kecamatan').map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
          <div className="col">
            <select className="form-select" value={selectedKelurahan} onChange={(e) => setSelectedKelurahan(e.target.value)}>
              <option value="">Pilih Kelurahan</option>
              {getDependentOptions('kelurahan').map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
          <div className="col">
            <select className="form-select" value={selectedRW} onChange={(e) => setSelectedRW(e.target.value)}>
              <option value="">Pilih RW</option>
              {getDependentOptions('rw').map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
          <div className="col-auto">
            <button
              className="btn-reset-filter"
              onClick={() => {
                setSelectedTahun('');
                setSelectedWilayah('');
                setSelectedKecamatan('');
                setSelectedKelurahan('');
                setSelectedRW('');
              }}
            >
              <img
                src="/img/filter.png"
                alt="Reset Filter"
                className="filter-icon"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Kartu dan Tabel */}
      <div className="container py-4">
        <div className="row g-4">
          <div className="col-md-6">
            <BarChartCard title="CAP dan CIP berdasarkan RW Kumuh" filters={filters} data={data} />
          </div>
          <div className="col-md-6">
            <DonutChartCard title="Persentase Anggaran CAP" filters={filters} data={data} />
          </div>
          <div className="col-md-6">
            <TableDetailCard title="Detail CIP" filters={filters} data={data} />
          </div>
          <div className="col-md-6">
            <DonutChartCard title="Persentase Anggaran CIP" filters={filters} data={data} />
          </div>
          <div className="col-md-12">
            <AllDataTable filters={filters} data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
