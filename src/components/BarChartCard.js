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

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement, LineElement);

const BarChartCard = ({ title, filters, data }) => {
  const getFilteredData = () => {
    const rwKumuh = [], cap = [], cip = [], anggaran = [], labels = [];

    const filtered = data.filter((item) => {
      return (
        (filters.tahun === 'Semua' || item.tahun === filters.tahun) &&
        (filters.wilayah === 'Semua' || item.wilayah === filters.wilayah) &&
        (filters.kecamatan === 'Semua' || item.kecamatan === filters.kecamatan) &&
        (filters.kelurahan === 'Semua' || item.kelurahan === filters.kelurahan) &&
        (filters.rw === 'Semua' || item.rw === filters.rw)
      );
    });

    filtered.forEach((item) => {
      let label = '';
      if (filters.rw) {
        label = [`${item.rw}`];
      } else if (filters.kelurahan) {
        label = [item.kelurahan];
      } else if (filters.kecamatan) {
        label = [item.kecamatan];
      } else if (filters.wilayah) {
        if (item.wilayah.includes('Kota Adm. Jakarta')) {
          const wilayah = item.wilayah.replace('', '');
          label = ['Kota Adm. Jakarta', wilayah];
        } else {
          label = [item.wilayah];
        }
      } else {
        label = [item.wilayah];
      }

      if (!labels.find(l => JSON.stringify(l) === JSON.stringify(label))) {
        labels.push(label);
        rwKumuh.push(item.jumlah_rw_kumuh);
        cap.push(item.jumlah_cap);
        cip.push(item.jumlah_cip);
        anggaran.push(item.anggaran_cip);
      }
    });

    return { labels, rwKumuh, cap, cip, anggaran };
  };

  const { labels, rwKumuh, cap, cip, anggaran } = getFilteredData();

  const dataChart = {
    labels,
    datasets: [
      {
        type: 'bar',
        label: 'Jumlah RW Kumuh',
        data: rwKumuh,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        maxBarThickness: 60,
        categoryPercentage: 0.9,
        barPercentage: 1.0,
      },
      {
        type: 'bar',
        label: 'Jumlah CAP',
        data: cap,
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        maxBarThickness: 60,
        categoryPercentage: 0.9,
        barPercentage: 1.0,
      },
      {
        type: 'bar',
        label: 'Jumlah CIP',
        data: cip,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        maxBarThickness: 60,
        categoryPercentage: 0.9,
        barPercentage: 1.0,
      },
      {
        type: 'line',
        label: 'Jumlah Anggaran CIP',
        data: anggaran,
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
      padding: {
        top: 10,
        right: 10,
        bottom: 20,
        left: 10,
      },
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
        title: {
          display: true,
          text: 'Jumlah',
        },
        ticks: {
          padding: 10,
        },
        grid: {
          drawTicks: true,
        },
      },
      y1: {
        beginAtZero: true,
        position: 'right',
        title: {
          display: true,
          text: 'Anggaran (Rp)',
        },
        ticks: {
          callback: function (value) {
            return 'Rp ' + (value / 1_000_000_000).toFixed(0) + 'M';
          },
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      x: {
        type: 'category',
        offset: true,
        ticks: {
          autoSkip: false,
          padding: 10,
          callback: function (val) {
            const label = this.getLabelForValue(val);
            return Array.isArray(label) ? label : [label];
          },
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
          <Chart type="bar" data={dataChart} options={options} />
        </div>
      </div>
    </div>
  );
};

export default BarChartCard;
