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
    jumlah_rw_implementasi: 2519,
    jumlah_cip: 1129,
    total_anggaran: 11000000000,
  };

  const data = [
    {
      tahun: '2022',
      wilayah: 'Pusat',
      kecamatan: 'Gambir',
      kelurahan: 'Kelurahan A',
      rw: 'RW 01',
      nama_kegiatan: 'Speed Bump',
      volume: '5',
      satuan: 'unit',
      jumlah_rw_kumuh: 3,
      jumlah_cap: 1,
      jumlah_cip: 1,
      anggaran_cap: 4000000000,
      anggaran_cip: 2000000000,
    },
    {
      tahun: '2022',
      wilayah: 'Barat',
      kecamatan: 'Cempaka Putih',
      kelurahan: 'Kelurahan D',
      rw: 'RW 05',
      nama_kegiatan: 'Taman',
      volume: '2',
      satuan: 'paket',
      jumlah_rw_kumuh: 4,
      jumlah_cap: 2,
      jumlah_cip: 1,
      anggaran_cap: 6000000000,
      anggaran_cip: 3000000000,
    },
    {
      tahun: '2023',
      wilayah: 'Selatan',
      kecamatan: 'Tebet',
      kelurahan: 'Kelurahan F',
      rw: 'RW 07',
      nama_kegiatan: 'Vertical Garden',
      volume: '3',
      satuan: 'paket',
      jumlah_rw_kumuh: 6,
      jumlah_cap: 3,
      jumlah_cip: 1,
      anggaran_cap: 8000000000,
      anggaran_cip: 4500000000,
    },
    {
      tahun: '2024',
      wilayah: 'Utara',
      kecamatan: 'Kelapa Gading',
      kelurahan: 'Kelurahan H',
      rw: 'RW 09',
      nama_kegiatan: 'PJU',
      volume: '10',
      satuan: 'titik',
      jumlah_rw_kumuh: 5,
      jumlah_cap: 1,
      jumlah_cip: 1,
      anggaran_cap: 3000000000,
      anggaran_cip: 1500000000,
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
            <button className="btn btn-outline-light" onClick={() => {
              setSelectedTahun('');
              setSelectedWilayah('');
              setSelectedKecamatan('');
              setSelectedKelurahan('');
              setSelectedRW('');
            }}>
              Reset
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
