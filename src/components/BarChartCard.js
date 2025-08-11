import React, { useEffect, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BarChartCard = ({ title, filters, data, loading }) => {
  const [authStatus, setAuthStatus] = useState(null);

  useEffect(() => {
    const cookies = document.cookie;
    const hasAccessToken = cookies.includes('accessToken');
    const hasRefreshToken = cookies.includes('refreshToken');
    const userData = localStorage.getItem('userData');

    if (hasAccessToken && hasRefreshToken) {
      setAuthStatus('admin');
    } else if (userData) {
      setAuthStatus('external');
    } else {
      setAuthStatus('public');
    }
  }, []);

  // Ambil semua label dan data langsung
  const labels = data.map((item) => item.label || 'Tidak Diketahui');
  const jumlahCAP = data.map((item) => item.jumlah_cap ?? 0);
  const jumlahCIP = data.map((item) => item.jumlah_cip ?? 0);

  const dataChart = {
    labels,
    datasets: [
      {
        label: 'CIP',
        data: jumlahCIP,
        backgroundColor: 'rgba(54, 235, 235, 0.6)',
        stack: 'stack1',
        barThickness: 24,
      },
      {
        label: 'CAP',
        data: jumlahCAP,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        stack: 'stack1',
        barThickness: 24,
      },
    ],
  };

  const MAX_LABEL_CHARS = 15; // jumlah karakter per baris sebelum wrap

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 10,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        callbacks: {
          title: (tooltipItems) => {
            // Tooltip menampilkan label asli lengkap
            const index = tooltipItems[0].dataIndex;
            return labels[index];
          },
        },
      },
      datalabels: {
        display: false,
      },
    },
    scales: {
      x: {
        stacked: true,
        beginAtZero: true,
        grid: { display: false },
        title: {
          display: true,
          text: 'Jumlah Kegiatan',
        },
        ticks: {
          precision: 0,
        },
      },
      y: {
        stacked: true,
        grid: { display: false },
        ticks: {
          autoSkip: false,
          font: {
            size: 12,
          },
          callback: function (value, index, ticks) {
            const fullLabel = this.getLabelForValue(value);
            const words = fullLabel.split(' ');
            let lines = [];
            let currentLine = words[0];

            for (let i = 1; i < words.length; i++) {
              if ((currentLine + ' ' + words[i]).length <= MAX_LABEL_CHARS) {
                currentLine += ' ' + words[i];
              } else {
                lines.push(currentLine);
                currentLine = words[i];
              }
            }
            lines.push(currentLine);

            // Tambahkan ellipsis jika terlalu panjang
            const totalLength = lines.join(' ').length;
            if (totalLength > MAX_LABEL_CHARS * 2) {
              lines = lines.slice(0, 2); // maksimal 2 baris
              lines[1] = lines[1].slice(0, MAX_LABEL_CHARS - 3) + '...';
            }

            return lines;
          },
        },
      },
    },
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-light text-center fw-bold">{title}</div>
      <div className="card-body">
        <div
          className="chart-container"
          style={{
            height: `${Math.max(labels.length * 60, 150)}px`, // ruang vertikal per bar
            width: '100%',
          }}
        >
          {loading ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              Loading...
            </div>
          ) : (
            <Chart type="bar" data={dataChart} options={options} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BarChartCard;
