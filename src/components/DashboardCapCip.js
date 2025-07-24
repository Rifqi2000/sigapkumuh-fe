import React, { useRef } from 'react';
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
  const filters = {
    tahun: '2024',
    wilayah: 'Semua',
    kecamatan: 'Semua',
    kelurahan: 'Semua',
    rw: 'Semua',
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
        {['Tahun Data', 'Wilayah', 'Kecamatan', 'Kelurahan', 'RW'].map((label) => (
          <div key={label} className="col">
            <label className="fw-bold">{label}</label>
            <select className="form-select">
              <option>Semua</option>
            </select>
          </div>
        ))}
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
