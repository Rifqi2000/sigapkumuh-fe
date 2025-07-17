import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ChartPanel = ({ data, filters }) => {
  // Tentukan level grup sumbu X berdasarkan filter
  let xField = 'wilayah';
  if (filters.wilayah && !filters.kecamatan) xField = 'kecamatan';
  else if (filters.kecamatan && !filters.kelurahan) xField = 'kelurahan';
  else if (filters.kelurahan) xField = 'lokasi_rw';

  // Ambil semua label unik untuk sumbu X
  let labels = [...new Set(data.map((d) => d[xField]))];

  // Deteksi apakah wilayah termasuk DKI Jakarta (bisa diganti sesuai kebutuhan)
  const isDKI = (wilayah) => {
    const wilayahJakarta = [
      'Kota Adm. Jakarta Pusat',
      'Kota Adm. Jakarta Barat',
      'Kota Adm. Jakarta Selatan',
      'Kota Adm. Jakarta Timur',
      'Kota Adm. Jakarta Utara',
      'Kabupaten Adm. Kepulauan Seribu',
    ];
    return wilayahJakarta.includes(wilayah);
  };

  // Urutkan RW jika field RW dan wilayah termasuk Jakarta
  if (xField === 'lokasi_rw' && filters.wilayah && isDKI(filters.wilayah)) {
    labels.sort((a, b) => {
      const numA = parseInt(String(a).match(/\d+/)?.[0] || 0, 10);
      const numB = parseInt(String(b).match(/\d+/)?.[0] || 0, 10);
      return numA - numB;
    });
  } else if (xField === 'lokasi_kabkota') {
    const wilayahOrder = [
      'Kota Adm. Jakarta Pusat',
      'Kota Adm. Jakarta Barat',
      'Kota Adm. Jakarta Selatan',
      'Kota Adm. Jakarta Timur',
      'Kota Adm. Jakarta Utara',
      'Kabupaten Adm. Kepulauan Seribu',
    ];
    labels.sort((a, b) => wilayahOrder.indexOf(a) - wilayahOrder.indexOf(b));
  } else {
    labels.sort(); // Default sort
  }

  // Ambil tahun unik (pastikan dalam bentuk string)
  const tahunList = [...new Set(data.map((d) => String(d.periode_data)))].sort();

  // Bangun datasets per tahun dengan warna sesuai
  const datasets = tahunList.map((tahun) => {
    let color = 'rgba(255, 99, 132, 0.6)'; // Default: Merah
    if (tahun === '2023') color = 'rgba(255, 206, 86, 0.6)'; // Kuning
    else if (tahun === '2024') color = 'rgba(75, 192, 192, 0.6)'; // Hijau

    return {
      label: `Tahun ${tahun}`,
      data: labels.map((label) =>
        data
          .filter(
            (d) =>
              String(d.periode_data) === tahun &&
              d[xField] === label &&
              typeof d.jumlah_peningkatan_psu_dilaksanakan === 'number'
          )
          .reduce((sum, d) => sum + d.jumlah_peningkatan_psu_dilaksanakan, 0)
      ),
      backgroundColor: color,
    };
  });

  const chartData = {
    labels,
    datasets,
  };

  const options = {
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
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 20,
          minRotation: 20,
          font: {
            size: 11,
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Jumlah PSU',
        },
        ticks: {
          stepSize: 1,
        },
        grid: {
          display: true,
          color: '#ccc',
          borderDash: [2, 2],
        },
      },
    },
  };

  return (
    <div className="mb-4" style={{ height: '500px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ChartPanel;
