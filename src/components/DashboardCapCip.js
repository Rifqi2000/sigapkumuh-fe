import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement } from 'chart.js';

import './css/DashboardCapCip.css';
import TableDetailCard from '../components/TableDetailCard';
import AllDataTable from '../components/AllDataTable';
import FilterPanel from '../components/FilterPanel';
import BarChartCard from '../components/BarChartCard';
import DonutChartCard from '../components/DonutChartCard';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

const baseUrl = process.env.REACT_APP_API_URL;

const DashboardCAPCIP = () => {
  // === Semua filter pakai array ===
  const [selectedTahunCAP, setSelectedTahunCAP] = useState([]);
  const [selectedTahunCIP, setSelectedTahunCIP] = useState([]);
  const [selectedWilayah, setSelectedWilayah] = useState([]);
  const [selectedKecamatan, setSelectedKecamatan] = useState([]);
  const [selectedKelurahan, setSelectedKelurahan] = useState([]);
  const [selectedRW, setSelectedRW] = useState([]);
  const [selectedKegiatan, setSelectedKegiatan] = useState([]);

  const [filterOptions, setFilterOptions] = useState({
    tahun_cap: [],
    tahun_cip: [],
    wilayah: [],
    kecamatan: [],
    kelurahan: [],
    rw: [],
    kegiatan: [],
    data: [],
  });

  const [chartData, setChartData] = useState([]);
  const [loadingChart, setLoadingChart] = useState(true);

  const detailCIPRef = useRef(null);
  const scrollToDetail = () => detailCIPRef.current?.scrollIntoView({ behavior: 'smooth' });

  // ===== Helpers =====
  const buildSearchParams = (obj) => {
    const sp = new URLSearchParams();
    Object.entries(obj).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.forEach((item) => {
          if (item !== undefined && item !== null && `${item}`.trim() !== '') sp.append(k, item);
        });
      } else if (v !== undefined && v !== null && `${v}`.trim() !== '') {
        sp.append(k, v);
      }
    });
    return sp;
  };

  // ✅ Perbaikan: jika hanya wilayah yang dipilih, group by "wilayah"
  const getLevelXAxis = useMemo(() => {
    if (selectedRW.length) return 'rw';
    if (selectedKelurahan.length) return 'rw';
    if (selectedKecamatan.length) return 'kelurahan';
    if (selectedWilayah.length) return 'wilayah'; // <-- FIX di sini
    return 'wilayah';
  }, [selectedWilayah, selectedKecamatan, selectedKelurahan, selectedRW]);

  const filters = useMemo(
    () => ({
      tahun_cap: selectedTahunCAP,   // array
      tahun_cip: selectedTahunCIP,   // array
      wilayah: selectedWilayah,
      kecamatan: selectedKecamatan,
      kelurahan: selectedKelurahan,
      rw: selectedRW,
      kegiatan: selectedKegiatan,
    }),
    [
      selectedTahunCAP,
      selectedTahunCIP,
      selectedWilayah,
      selectedKecamatan,
      selectedKelurahan,
      selectedRW,
      selectedKegiatan,
    ]
  );

  // ===== Fetch filter options =====
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch(`${baseUrl}/filter-options`);
        const result = await response.json();
        const sortAsc = (arr) =>
          [...arr].sort((a, b) => a.localeCompare(b, 'id', { numeric: true }));

        result.tahun_cap = sortAsc((result.tahun_cap || []).map(String));
        result.tahun_cip = sortAsc((result.tahun_cip || []).map(String));
        result.wilayah = sortAsc(result.wilayah || []);
        result.kegiatan = sortAsc((result.kegiatan || []).filter(Boolean));

        setFilterOptions(result);
      } catch (error) {
        console.error('Gagal mengambil filter:', error);
      }
    };
    fetchFilterOptions();
  }, []);

  // ===== Fetch bar chart (array-aware) =====
  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        setLoadingChart(true);

        const params = buildSearchParams({
          tahun_cap: filters.tahun_cap,
          tahun_cip: filters.tahun_cip,
          wilayah: filters.wilayah,
          kecamatan: filters.kecamatan,
          kelurahan: filters.kelurahan,
          rw: filters.rw,
          kegiatan: filters.kegiatan,
          level_x_axis: getLevelXAxis,
        });

        const res = await fetch(`${baseUrl}/chart-bar?${params.toString()}`);
        const data = await res.json();
        setChartData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Gagal mengambil data chart bar:', err);
      } finally {
        setLoadingChart(false);
      }
    };

    fetchBarChartData();
  }, [filters, getLevelXAxis]);

  // ===== Dependent options (union) dari filterOptions.data =====
  const getFilteredOptions = () => {
    const all = filterOptions.data || [];
    const uniqSort = (arr) =>
      [...new Set(arr.filter(Boolean))].sort((a, b) =>
        a.localeCompare(b, 'id', { numeric: true })
      );

    const byWil = selectedWilayah.length
      ? all.filter((d) => selectedWilayah.includes(d.wilayah))
      : all;
    const kecamatanOptions = uniqSort(byWil.map((d) => d.kecamatan));

    const byKec = selectedKecamatan.length
      ? byWil.filter((d) => selectedKecamatan.includes(d.kecamatan))
      : byWil;
    const kelurahanOptions = uniqSort(byKec.map((d) => d.kelurahan));

    const byKel = selectedKelurahan.length
      ? byKec.filter((d) => selectedKelurahan.includes(d.kelurahan))
      : byKec;
    const rwOptions = uniqSort(byKel.map((d) => d.rw));

    return { kecamatanOptions, kelurahanOptions, rwOptions };
  };

  const { kecamatanOptions, kelurahanOptions, rwOptions } = getFilteredOptions();

  return (
    <div id="main-content" className="container py-3">
      <FilterPanel
        // Tahun (multi-select)
        selectedTahunCAP={selectedTahunCAP}
        selectedTahunCIP={selectedTahunCIP}
        onChangeTahunCAP={(arr) => setSelectedTahunCAP(Array.isArray(arr) ? arr : [])}
        onChangeTahunCIP={(arr) => setSelectedTahunCIP(Array.isArray(arr) ? arr : [])}

        // MultiSelect (array)
        selectedWilayah={selectedWilayah}
        selectedKecamatan={selectedKecamatan}
        selectedKelurahan={selectedKelurahan}
        selectedRW={selectedRW}
        selectedKegiatan={selectedKegiatan}

        // Handler menerima array dari MultiSelectDropdown
        onChangeWilayah={(arr) => {
          setSelectedWilayah(arr || []);
          setSelectedKecamatan([]);
          setSelectedKelurahan([]);
          setSelectedRW([]);
        }}
        onChangeKecamatan={(arr) => {
          setSelectedKecamatan(arr || []);
          setSelectedKelurahan([]);
          setSelectedRW([]);
        }}
        onChangeKelurahan={(arr) => {
          setSelectedKelurahan(arr || []);
          setSelectedRW([]);
        }}
        onChangeRW={(arr) => setSelectedRW(arr || [])}
        onChangeKegiatan={(arr) => setSelectedKegiatan(arr || [])}

        onReset={() => {
          setSelectedTahunCAP([]);
          setSelectedTahunCIP([]);
          setSelectedWilayah([]);
          setSelectedKecamatan([]);
          setSelectedKelurahan([]);
          setSelectedRW([]);
          setSelectedKegiatan([]);
        }}

        filterOptions={filterOptions}
        filteredOptions={{ kecamatanOptions, kelurahanOptions, rwOptions }}
      />

      <div className="row g-3 my-4">
        <div className="col-md-6">
          <BarChartCard
            title="CAP dan CIP berdasarkan RW Kumuh"
            filters={{ ...filters, level_x_axis: getLevelXAxis }}
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
            <TableDetailCard filters={filters} data={[]} />
          </div>
        </div>

        <div className="col-md-6">
          <DonutChartCard title="Persentase Anggaran CIP" filters={filters} />
        </div>

        <div className="col-12 mt-4">
          <AllDataTable data={[]} filters={filters} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCAPCIP;
