import React, { useEffect, useMemo, useState } from 'react';
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

const pickLabel = (row) =>
  String(
    row?.label ??
    row?.nama ??
    row?.wilayah ??
    row?.kecamatan ??
    row?.kelurahan ??
    row?.rw ??
    'Tidak Diketahui'
  );

const pickCAP = (row) =>
  Number(
    row?.jumlah_rw_cap ??
    row?.jumlah_cap ??
    row?.cap ??
    0
  );

const pickCIP = (row) =>
  Number(
    row?.jumlah_rw_cip ??
    row?.jumlah_cip ??
    row?.cip ??
    0
  );

const BarChartCard = ({ title, filters, data, loading }) => {
  const [authStatus, setAuthStatus] = useState(null);

  useEffect(() => {
    const cookies = document.cookie;
    const hasAccessToken = cookies.includes('accessToken');
    const hasRefreshToken = cookies.includes('refreshToken');
    const userData = localStorage.getItem('userData');
    if (hasAccessToken && hasRefreshToken) setAuthStatus('admin');
    else if (userData) setAuthStatus('external');
    else setAuthStatus('public');
  }, []);

  // Agregasi per label (jaga-jaga ada duplikat baris dari API)
  const { labels, capVals, cipVals } = useMemo(() => {
    const src = Array.isArray(data) ? data : [];
    const map = new Map();
    for (const row of src) {
      const key = pickLabel(row);
      const prev = map.get(key) || { cap: 0, cip: 0 };
      map.set(key, {
        cap: prev.cap + pickCAP(row),
        cip: prev.cip + pickCIP(row),
      });
    }
    const lbls = Array.from(map.keys());
    const caps = lbls.map((k) => map.get(k).cap);
    const cips = lbls.map((k) => map.get(k).cip);
    return { labels: lbls, capVals: caps, cipVals: cips };
  }, [data]);

  const dataChart = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: 'CIP',
          data: cipVals,
          backgroundColor: 'rgba(54, 235, 235, 0.6)',
          stack: 'stack1',
          barThickness: 24,
        },
        {
          label: 'CAP',
          data: capVals,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          stack: 'stack1',
          barThickness: 24,
        },
      ],
    }),
    [labels, capVals, cipVals]
  );

  const MAX_LABEL_CHARS = 15;

  const options = useMemo(
    () => ({
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: 10 },
      plugins: {
        legend: { position: 'top', labels: { font: { size: 12 } } },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          callbacks: {
            title: (items) => {
              const idx = items?.[0]?.dataIndex ?? 0;
              return labels[idx] ?? '';
            },
          },
        },
        datalabels: { display: false },
      },
      scales: {
        x: {
          stacked: true,
          beginAtZero: true,
          grid: { display: false },
          title: { display: true, text: 'Jumlah Kegiatan' },
          ticks: { precision: 0 },
        },
        y: {
          stacked: true,
          grid: { display: false },
          ticks: {
            autoSkip: false,
            font: { size: 12 },
            callback: function (value) {
              const fullLabel = this.getLabelForValue(value) || '';
              const words = String(fullLabel).split(' ');
              let lines = [];
              let current = words[0] || '';
              for (let i = 1; i < words.length; i++) {
                if ((current + ' ' + words[i]).length <= MAX_LABEL_CHARS) current += ' ' + words[i];
                else { lines.push(current); current = words[i]; }
              }
              lines.push(current);
              const totalLen = lines.join(' ').length;
              if (totalLen > MAX_LABEL_CHARS * 2) {
                lines = lines.slice(0, 2);
                lines[1] = lines[1].slice(0, MAX_LABEL_CHARS - 3) + '...';
              }
              return lines;
            },
          },
        },
      },
    }),
    [labels]
  );

  const chartHeight = Math.max((labels?.length || 0) * 60, 150);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-light text-center fw-bold">{title}</div>
      <div className="card-body">
        <div className="chart-container" style={{ height: `${chartHeight}px`, width: '100%' }}>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              Loading...
            </div>
          ) : labels.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center h-100 text-muted">
              Tidak ada data untuk filter ini
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
