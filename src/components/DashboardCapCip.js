import React, { useRef, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

import './css/DashboardCapCip.css';
import TableDetailCard from '../components/TableDetailCard';
import AllDataTable from '../components/AllDataTable';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardCAPCIP = ({ data }) => {
  // Gunakan useState untuk menyimpan filter aktif
  const [selectedTahun, setSelectedTahun] = useState('2024');
  const [selectedWilayah, setSelectedWilayah] = useState('Semua');
  const [selectedKecamatan, setSelectedKecamatan] = useState('Semua');
  const [selectedKelurahan, setSelectedKelurahan] = useState('Semua');
  const [selectedRW, setSelectedRW] = useState('Semua');

  // Buat object filters dinamis
  const filters = {
    tahun: selectedTahun,
    wilayah: selectedWilayah,
    kecamatan: selectedKecamatan,
    kelurahan: selectedKelurahan,
    rw: selectedRW,
  };

  const detailCIPRef = useRef(null);
  const onScrollClick = () => {
    detailCIPRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const {
    barChartData,
    barChartOptions,
    capDoughnutData,
    cipDoughnutData,
    totalAnggaranCIP,
    tableData,
  } = data;

  return (
    <div id="main-content" className="container py-3">
      {/* Filter */}
      <div className="row mb-3 text-center">
        <div className="col">
          <label className="fw-bold">Tahun Data</label>
          <select className="form-select" value={selectedTahun} onChange={(e) => setSelectedTahun(e.target.value)}>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="Semua">Semua</option>
          </select>
        </div>
        <div className="col">
          <label className="fw-bold">Wilayah</label>
          <select className="form-select" value={selectedWilayah} onChange={(e) => setSelectedWilayah(e.target.value)}>
            <option value="Semua">Semua</option>
            <option value="Pusat">Pusat</option>
            <option value="Barat">Barat</option>
            <option value="Selatan">Selatan</option>
            <option value="Utara">Utara</option>
            <option value="Timur">Timur</option>
          </select>
        </div>
        <div className="col">
          <label className="fw-bold">Kecamatan</label>
          <select className="form-select" value={selectedKecamatan} onChange={(e) => setSelectedKecamatan(e.target.value)}>
            <option value="Semua">Semua</option>
            {/* Tambahkan opsi kecamatan sesuai data */}
          </select>
        </div>
        <div className="col">
          <label className="fw-bold">Kelurahan</label>
          <select className="form-select" value={selectedKelurahan} onChange={(e) => setSelectedKelurahan(e.target.value)}>
            <option value="Semua">Semua</option>
            {/* Tambahkan opsi kelurahan */}
          </select>
        </div>
        <div className="col">
          <label className="fw-bold">RW</label>
          <select className="form-select" value={selectedRW} onChange={(e) => setSelectedRW(e.target.value)}>
            <option value="Semua">Semua</option>
            {/* Tambahkan opsi RW */}
          </select>
        </div>
      </div>

      {/* Grafik Bar dan Donat CAP */}
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5>CAP dan CIP berdasarkan RW Kumuh</h5>
            <div style={{ height: 300 }}>
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>
        </div>

        <div className="col-md-6 d-flex">
          <div className="card p-3 shadow-sm flex-fill d-flex flex-column">
            <div className="card-header text-center fw-bold">Persentase Anggaran CAP</div>
            <div className="flex-grow-1 d-flex justify-content-center align-items-center position-relative">
              <div style={{ width: '250px', height: '250px' }}>
                <Doughnut data={capDoughnutData} options={{ cutout: '70%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail dan Donat CIP */}
      <div className="row g-3" ref={detailCIPRef}>
        <div className="col-md-6">
          <div className="card card-detail-cip w-100">
            <div className="card-header text-center fw-bold">Detail CIP</div>
            <TableDetailCard filters={filters} data={tableData} />
          </div>
        </div>

        <div className="col-md-6">
          <div className="card w-100">
            <div className="card-header text-center fw-bold">Persentase Anggaran CIP</div>
            <div className="flex-grow-1 d-flex justify-content-center align-items-center position-relative p-3">
              <div style={{ width: '250px', height: '250px' }}>
                <Doughnut data={cipDoughnutData} options={{ cutout: '70%' }} />
                <div className="position-absolute top-50 start-50 translate-middle text-center fw-bold">
                  <h5 className="m-0">
                    {totalAnggaranCIP.toLocaleString('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                    })}
                  </h5>
                  <p className="m-0">Total Anggaran</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabel Besar Seluruh Data */}
        <div className="row mt-4">
          <div className="col-12">
            <AllDataTable data={tableData} filters={filters} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCAPCIP;
