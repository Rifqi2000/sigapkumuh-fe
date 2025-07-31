import React, { useEffect, useRef, useState } from 'react';
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
import FilterPanel from '../components/FilterPanel';
import BarChartCard from '../components/BarChartCard';
import DonutChartCard from '../components/DonutChartCard';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

const baseUrl = process.env.REACT_APP_API_URL;

const DashboardCAPCIP = () => {
  const [selectedTahunCAP, setSelectedTahunCAP] = useState('Semua');
  const [selectedTahunCIP, setSelectedTahunCIP] = useState('Semua');
  const [selectedWilayah, setSelectedWilayah] = useState('Semua');
  const [selectedKecamatan, setSelectedKecamatan] = useState('Semua');
  const [selectedKelurahan, setSelectedKelurahan] = useState('Semua');
  const [selectedRW, setSelectedRW] = useState('Semua');

  const [filterOptions, setFilterOptions] = useState({
    tahun_cap: [],
    tahun_cip: [],
    wilayah: [],
    kecamatan: [],
    kelurahan: [],
    rw: [],
    data: [],
  });

  const [chartData, setChartData] = useState([]);
  const [donutCipData, setDonutCipData] = useState([]);
  const [tableCipData, setTableCipData] = useState([]);
  const [loadingChart, setLoadingChart] = useState(true);

  const detailCIPRef = useRef(null);

  const scrollToDetail = () => {
    detailCIPRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filters = {
    tahun_cap: selectedTahunCAP,
    tahun_cip: selectedTahunCIP,
    wilayah: selectedWilayah,
    kecamatan: selectedKecamatan,
    kelurahan: selectedKelurahan,
    rw: selectedRW,
  };

  const getLevelXAxis = () => {
    if (selectedWilayah !== 'Semua' && selectedKecamatan === 'Semua') return 'kecamatan';
    if (selectedKecamatan !== 'Semua' && selectedKelurahan === 'Semua') return 'kelurahan';
    if (selectedKelurahan !== 'Semua') return 'rw';
    return 'wilayah';
  };

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch(`${baseUrl}/filter-options`);
        const result = await response.json();

        const sortAsc = (arr) => [...arr].sort((a, b) => a.localeCompare(b, 'id', { numeric: true }));

        result.tahun_cap = sortAsc(result.tahun_cap.map(String));
        result.tahun_cip = sortAsc(result.tahun_cip.map(String));
        result.wilayah = sortAsc(result.wilayah);

        setFilterOptions(result);
      } catch (error) {
        console.error('Gagal mengambil filter:', error);
      }
    };

    fetchFilterOptions();
  }, []);

  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        setLoadingChart(true);

        const level_x_axis = getLevelXAxis();

        const query = new URLSearchParams({
          tahun_cap: selectedTahunCAP,
          tahun_cip: selectedTahunCIP,
          wilayah: selectedWilayah,
          kecamatan: selectedKecamatan,
          kelurahan: selectedKelurahan,
          rw: selectedRW,
          level_x_axis,
        }).toString();

        const res = await fetch(`${baseUrl}/chart-bar?${query}`);
        const data = await res.json();
        setChartData(data);
      } catch (err) {
        console.error('Gagal mengambil data chart bar:', err);
      } finally {
        setLoadingChart(false);
      }
    };

    fetchBarChartData();
  }, [
    selectedTahunCAP,
    selectedTahunCIP,
    selectedWilayah,
    selectedKecamatan,
    selectedKelurahan,
    selectedRW,
  ]);

  useEffect(() => {
    const fetchDonutCIP = async () => {
      try {
        const params = new URLSearchParams({
          tahun: selectedTahunCIP,
          wilayah: selectedWilayah,
          kecamatan: selectedKecamatan,
          kelurahan: selectedKelurahan,
          rw: selectedRW,
        });
        const res = await fetch(`${baseUrl}/donut-cip-chart?${params}`);
        const data = await res.json();
        setDonutCipData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Gagal mengambil data donut CIP:', err);
      }
    };

    fetchDonutCIP();
  }, [selectedTahunCIP, selectedWilayah, selectedKecamatan, selectedKelurahan, selectedRW]);

  useEffect(() => {
    const fetchTableCIP = async () => {
      try {
        const res = await fetch(`${baseUrl}/table-cip`);
        const data = await res.json();
        setTableCipData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Gagal mengambil data Table CIP:', err);
      }
    };

    fetchTableCIP();
  }, []);

  const getFilteredOptions = () => {
    const { data } = filterOptions;
    const filterData = data || [];

    const kecamatanOptions = filterData
      .filter((d) => !selectedWilayah || d.wilayah === selectedWilayah)
      .map((d) => d.kecamatan)
      .filter((val, i, arr) => arr.indexOf(val) === i)
      .sort();

    const kelurahanOptions = filterData
      .filter(
        (d) =>
          (!selectedWilayah || d.wilayah === selectedWilayah) &&
          (!selectedKecamatan || d.kecamatan === selectedKecamatan)
      )
      .map((d) => d.kelurahan)
      .filter((val, i, arr) => arr.indexOf(val) === i)
      .sort();

    const rwOptions = filterData
      .filter(
        (d) =>
          (!selectedWilayah || d.wilayah === selectedWilayah) &&
          (!selectedKecamatan || d.kecamatan === selectedKecamatan) &&
          (!selectedKelurahan || d.kelurahan === selectedKelurahan)
      )
      .map((d) => d.rw)
      .filter((val, i, arr) => arr.indexOf(val) === i)
      .sort();

    return { kecamatanOptions, kelurahanOptions, rwOptions };
  };

  const { kecamatanOptions, kelurahanOptions, rwOptions } = getFilteredOptions();

  return (
    <div id="main-content" className="container py-3">
      <FilterPanel
        selectedTahunCAP={selectedTahunCAP}
        selectedTahunCIP={selectedTahunCIP}
        selectedWilayah={selectedWilayah}
        selectedKecamatan={selectedKecamatan}
        selectedKelurahan={selectedKelurahan}
        selectedRW={selectedRW}
        onChangeTahunCAP={(e) => setSelectedTahunCAP(e.target.value)}
        onChangeTahunCIP={(e) => setSelectedTahunCIP(e.target.value)}
        onChangeWilayah={(e) => {
          setSelectedWilayah(e.target.value);
          setSelectedKecamatan('Semua');
          setSelectedKelurahan('Semua');
          setSelectedRW('Semua');
        }}
        onChangeKecamatan={(e) => {
          setSelectedKecamatan(e.target.value);
          setSelectedKelurahan('Semua');
          setSelectedRW('Semua');
        }}
        onChangeKelurahan={(e) => {
          setSelectedKelurahan(e.target.value);
          setSelectedRW('Semua');
        }}
        onChangeRW={(e) => setSelectedRW(e.target.value)}
        onReset={() => {
          setSelectedTahunCAP('Semua');
          setSelectedTahunCIP('Semua');
          setSelectedWilayah('Semua');
          setSelectedKecamatan('Semua');
          setSelectedKelurahan('Semua');
          setSelectedRW('Semua');
        }}
        filterOptions={filterOptions}
        filteredOptions={{ kecamatanOptions, kelurahanOptions, rwOptions }}
      />

      <div className="row g-3 my-4">
        <div className="col-md-6">
          <BarChartCard
            title="CAP dan CIP berdasarkan RW Kumuh"
            filters={filters}
            data={chartData}
            loading={loadingChart}
          />
        </div>
        <div className="col-md-6">
          <DonutChartCard title="Persentase Anggaran CAP" filters={filters} />
        </div>
      </div>

      <div className="row g-3" ref={detailCIPRef}>
        <div className="col-md-6">
          <div className="card card-detail-cip w-100 h-100">
            <div className="card-header text-center fw-bold">Detail CIP</div>
            <TableDetailCard filters={filters} data={tableCipData} />
          </div>
        </div>

        <div className="col-md-6">
          <DonutChartCard
            title="Persentase Anggaran CIP"
            filters={filters}
            data={donutCipData}
          />
        </div>

        <div className="col-12 mt-4">
          <AllDataTable data={tableCipData} filters={filters} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCAPCIP;
