import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './css/DonutChartCard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChartCard = ({ title, filters = {}, data = [] }) => {
  const [legendPosition, setLegendPosition] = useState(
    window.innerWidth < 576 ? 'bottom' : 'right'
  );

  useEffect(() => {
    const handleResize = () => {
      setLegendPosition(window.innerWidth < 576 ? 'bottom' : 'right');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter data berdasarkan wilayah yang dipilih
  const filteredData = data.filter((item) => {
    return (
      (!filters.wilayah || item.nama_kabkota === filters.wilayah) &&
      (!filters.kecamatan || item.nama_kec === filters.kecamatan) &&
      (!filters.kelurahan || item.nama_kel === filters.kelurahan) &&
      (!filters.rw || item.nama_rw === filters.rw)
    );
  });

  const aggregation = {};
  const MAX_ANGGARAN = 1_000_000_000_000_000; // Maksimal Rp 1.000 Triliun

  filteredData.forEach((item) => {
    const label = item.nama_kegiatan || 'Lainnya';
    const rawValue = item.anggaran || 0;
    const value = Math.min(rawValue, MAX_ANGGARAN); // batasi per item
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
            let value = context.parsed;
            const max = MAX_ANGGARAN;
            if (value > max) value = max;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${context.label}: Rp ${value.toLocaleString('id-ID')} (${percentage}%)`;
          },
        },
      },
      legend: {
        position: legendPosition,
        labels: {
          boxWidth: 12,
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="card">
      <div className="card-header text-center fw-bold">
        {title}
      </div>
      <div className="card-body donut-body">
        <div className="donut-wrapper">
          <Doughnut data={chartData} options={options} />
          <div className="donut-total">
            <h3>
              {total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
            </h3>
            <p>Total Anggaran</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonutChartCard;
