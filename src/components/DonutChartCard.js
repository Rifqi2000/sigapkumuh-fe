import React, { useEffect, useMemo, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './css/DonutChartCard.css';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const baseUrl = process.env.REACT_APP_API_URL;

/**
 * Props:
 * - title: string
 * - filters: { tahun_cap, tahun_cip, wilayah, kecamatan, kelurahan, rw, kegiatan }
 * - data: optional array; bila ada & tidak kosong, dipakai langsung (tanpa fetch)
 * - variant: "cip" | "cap"  (default: "cip")
 */
const DonutChartCard = ({ title = 'Anggaran CIP', filters = {}, data = [], variant = 'cip' }) => {
  const [legendPosition, setLegendPosition] = useState(
    typeof window !== 'undefined' && window.innerWidth < 576 ? 'bottom' : 'right'
  );
  const [authStatus, setAuthStatus] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // responsive legend
  useEffect(() => {
    const handleResize = () => {
      setLegendPosition(window.innerWidth < 576 ? 'bottom' : 'right');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // auth
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

  const shouldHideAnggaran = authStatus === 'external' || authStatus === 'public';

  // --- fetch data bila prop data kosong ---
  useEffect(() => {
    // jika parent sudah mengirim data, gunakan itu
    if (Array.isArray(data) && data.length > 0) {
      setRows(data);
      return;
    }

    // susun endpoint + params
    const endpoint =
      variant === 'cap' ? 'donut-cap-chart' : 'donut-cip-chart';

    const tahun =
      variant === 'cap' ? (filters.tahun_cap || '') : (filters.tahun_cip || '');

    const params = new URLSearchParams({
      tahun: tahun || '',
      wilayah: filters.wilayah || '',
      kecamatan: filters.kecamatan || '',
      kelurahan: filters.kelurahan || '',
      rw: filters.rw || '',
      kegiatan: filters.kegiatan || '', // <-- penting
    });

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${baseUrl}/${endpoint}?${params.toString()}`);
        const json = await res.json();
        setRows(Array.isArray(json) ? json : []);
      } catch (err) {
        console.error(`${endpoint} error:`, err);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // dependency harus men-cover semua filter yang relevan
  }, [
    data,                                    // jika parent mengirim data baru
    variant,
    filters.tahun_cap,
    filters.tahun_cip,
    filters.wilayah,
    filters.kecamatan,
    filters.kelurahan,
    filters.rw,
    filters.kegiatan,                         // <-- ikutkan kegiatan
  ]);

  // --- normalisasi bentuk data untuk chart ---
  // Terima beberapa kemungkinan field dari backend:
  // - label / nama_kegiatan / wilayah
  // - total_anggaran / total_anggaran_cip / anggaran
  const MAX_ANGGARAN = 1_000_000_000_000_000;
  const { labels, values, total } = useMemo(() => {
    if (!Array.isArray(rows)) return { labels: [], values: [], total: 0 };

    const agg = {};
    for (const item of rows) {
      const label =
        item.label?.trim() ||
        item.nama_kegiatan?.trim() ||
        item.wilayah?.trim() ||
        '-';
      const raw =
        Number(item.total_anggaran) ||
        Number(item.total_anggaran_cip) ||
        Number(item.anggaran) ||
        0;
      const val = Math.min(Math.max(raw, 0), MAX_ANGGARAN);
      agg[label] = (agg[label] || 0) + val;
    }
    const _labels = Object.keys(agg);
    const _values = _labels.map((k) => agg[k]);
    const _total = _values.reduce((s, v) => s + v, 0);
    return { labels: _labels, values: _values, total: _total };
  }, [rows]);

  const chartData = useMemo(() => ({
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          '#F76060', '#F54A8A', '#C03E99', '#993399', '#6666CC',
          '#3399CC', '#66DDEE', '#4BC0C0', '#36A2EB', '#A9A9A9',
        ].slice(0, Math.max(values.length, 1)),
        borderWidth: 1,
      },
    ],
  }), [labels, values]);

  const options = useMemo(() => ({
    cutout: '65%',
    layout: { padding: 50 },
    plugins: {
      legend: { display: false, position: legendPosition },
      tooltip: {
        callbacks: {
          label: function (ctx) {
            const value = ctx.parsed;
            const label = ctx.label;
            const pct = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            if (shouldHideAnggaran) return `${label}: ${pct}%`;
            return `${label}: Rp ${Number(value).toLocaleString('id-ID')} (${pct}%)`;
          },
        },
      },
      datalabels: {
        color: '#000',
        anchor: 'end',
        align: 'end',
        offset: 10,
        clamp: true,
        clip: false,
        font: { size: 11 },
        formatter: function (value, context) {
          const label = context.chart.data.labels[context.dataIndex] || '';
          const pct = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
          if (pct <= 0 || value === 0) return null;

          // simple word-wrap
          const wrap = (txt, max = 10) => {
            const words = (txt || '').split(' ');
            let out = '', line = '';
            for (const w of words) {
              if ((line + w).length > max) {
                out += line + '\n';
                line = '';
              }
              line += w + ' ';
            }
            out += line.trim();
            return out;
          };
          return `${wrap(label)}\n${pct}%`;
        },
      },
    },
    maintainAspectRatio: false,
  }), [legendPosition, shouldHideAnggaran, total]);

  const isEmpty = !loading && (!values.length || total === 0);

  return (
    <div className="card">
      <div className="card-header text-center fw-bold">
        {title}
      </div>
      <div className="card-body donut-body">
        <div className="donut-wrapper">
          {loading ? (
            <div className="text-center text-muted small">Memuat...</div>
          ) : isEmpty ? (
            <div className="text-center text-muted small">Tidak ada data untuk filter ini</div>
          ) : (
            <Doughnut data={chartData} options={options} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DonutChartCard;
