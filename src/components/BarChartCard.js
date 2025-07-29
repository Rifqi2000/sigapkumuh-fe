import React from 'react';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const BarChartCard = ({ title, filters, data, loading }) => {
  const getProcessedData = () => {
    if (!Array.isArray(data)) return {
      labels: [],
      jumlahRwKumuh: [],
      jumlahCAP: [],
      jumlahCIP: [],
      anggaranCIP: [],
    };

    const labels = [];
    const jumlahRwKumuh = [];
    const jumlahCAP = [];
    const jumlahCIP = [];
    const anggaranCIP = [];

    data.forEach((item) => {
      labels.push(item.label);
      jumlahRwKumuh.push(item.jumlah_rw_kumuh);
      jumlahCAP.push(item.jumlah_rw_cap);
      jumlahCIP.push(item.jumlah_rw_cip);
      anggaranCIP.push(item.total_anggaran_cip);
    });

    return {
      labels,
      jumlahRwKumuh,
      jumlahCAP,
      jumlahCIP,
      anggaranCIP,
    };
  };

  const { labels, jumlahRwKumuh, jumlahCAP, jumlahCIP, anggaranCIP } = getProcessedData();

  const dataChart = {
    labels,
    datasets: [
      {
        type: 'bar',
        label: 'Jumlah RW Kumuh',
        data: jumlahRwKumuh,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        maxBarThickness: 60,
      },
      {
        type: 'bar',
        label: 'Jumlah CAP',
        data: jumlahCAP,
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        maxBarThickness: 60,
      },
      {
        type: 'bar',
        label: 'Jumlah CIP',
        data: jumlahCIP,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        maxBarThickness: 60,
      },
      {
        type: 'line',
        label: 'Jumlah Anggaran CIP',
        data: anggaranCIP,
        yAxisID: 'y1',
        xAxisID: 'x1',
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: 'rgba(153, 102, 255, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: { top: 10, right: 10, bottom: 20, left: 10 },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 20,
          padding: 20,
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Jumlah' },
        ticks: { padding: 10 },
        grid: { drawTicks: true },
      },
      y1: {
        beginAtZero: true,
        position: 'right',
        title: { display: true, text: 'Anggaran (Rp)' },
        ticks: {
          callback: function (value) {
            return 'Rp ' + (value / 1_000_000_000).toFixed(0) + 'M';
          },
        },
        grid: { drawOnChartArea: false },
      },
      x: {
        type: 'category',
        offset: true,
        ticks: {
          autoSkip: false,
          padding: 10,
        },
      },
      x1: {
        type: 'category',
        offset: true,
        display: false,
        labels: labels.map((_, i) => i),
      },
    },
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-light text-center fw-bold">{title}</div>
      <div className="card-body">
        <div className="chart-container" style={{ height: '430px', width: '100%' }}>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center h-100">Loading...</div>
          ) : (
            <Chart type="bar" data={dataChart} options={options} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BarChartCard;