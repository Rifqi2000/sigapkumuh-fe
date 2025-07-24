import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './css/DonutChartCard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChartCard = ({ title, data = [], filters = {} }) => {
  // Filter data berdasarkan filters aktif
  const filteredData = data.filter((item) => {
    return (
      (filters.tahun === 'Semua' || item.tahun === filters.tahun) &&
      (filters.wilayah === 'Semua' || item.wilayah === filters.wilayah) &&
      (filters.kecamatan === 'Semua' || item.kecamatan === filters.kecamatan) &&
      (filters.kelurahan === 'Semua' || item.kelurahan === filters.kelurahan) &&
      (filters.rw === 'Semua' || item.rw === filters.rw)
    );
  });

  // Menentukan apakah kita pakai anggaran_cap atau anggaran_cip
  const isCAP = title === 'Persentase Anggaran CAP';
  const anggaranKey = isCAP ? 'anggaran_cap' : 'anggaran_cip';

  // Agregasi berdasarkan nama_kegiatan
  const aggregation = {};
  filteredData.forEach(item => {
    const label = item.nama_kegiatan || 'Lainnya';
    const value = item[anggaranKey] || 0;
    aggregation[label] = (aggregation[label] || 0) + value;
  });

  const labels = Object.keys(aggregation);
  const values = Object.values(aggregation);
  const total = values.reduce((sum, val) => sum + val, 0);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          '#4BC0C0',
          '#36A2EB',
          '#FFCE56',
          '#FF6384',
          '#9966FF',
          '#FF9F40',
          '#00C49F',
          '#C71585',
          '#8B0000',
          '#2E8B57',
        ].slice(0, values.length),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    cutout: '70%',
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.parsed;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: Rp ${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="card">
      <div className="card-header">
        <span className="tab-label fw-bold">{title}</span>
      </div>
      <div className="card-body donut-body">
        <div className="donut-wrapper">
          <Doughnut data={chartData} options={options} />
          <div className="donut-total">
            <h3>{total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</h3>
            <p>Total Anggaran</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonutChartCard;
