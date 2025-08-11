import React, { useState, useEffect, useRef, useMemo } from 'react';
import HeroSection from './components/HeroSection';
import BarChartCard from './components/BarChartCard';
import DonutChartCard from './components/DonutChartCard';
import TableDetailCard from './components/TableDetailCard';
import AllDataTable from './components/AllDataTable';
import FilterPanel from './components/FilterPanel';
import ProyeksiCard from './components/ProyeksiCard';
import './App.css';
import 'animate.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const baseUrl = process.env.REACT_APP_API_URL;

function App() {
  const [selectedTahunCAP, setSelectedTahunCAP] = useState('Semua');
  const [selectedTahunCIP, setSelectedTahunCIP] = useState('Semua');
  const [selectedWilayah, setSelectedWilayah] = useState('Semua');
  const [selectedKecamatan, setSelectedKecamatan] = useState('Semua');
  const [selectedKelurahan, setSelectedKelurahan] = useState('Semua');
  const [selectedRW, setSelectedRW] = useState('Semua');
  const [selectedKegiatan, setSelectedKegiatan] = useState('Semua'); // ⬅️ NEW

  const [filterOptions, setFilterOptions] = useState({
    tahun_cap: [],
    tahun_cip: [],
    wilayah: [],
    kegiatan: [], // ⬅️ NEW
    mapping: {
      kec_by_wil: {},
      kel_by_kec: {},
      rw_by_kel: {},
    },
  });

  const [barChartData, setBarChartData] = useState([]);
  const [donutCapData, setDonutCapData] = useState([]);
  const [donutCipData, setDonutCipData] = useState([]);
  const [tableCipData, setTableCipData] = useState([]);
  const [summaryData, setSummaryData] = useState({
    jumlah_rw_kumuh: 0,
    jumlah_rw_implementasi: 0,
    jumlah_cip: 0,
    total_anggaran: 0,
  });

  const contentRef = useRef(null);
  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filters = useMemo(() => {
    let level = 'wilayah';
    if (selectedRW && selectedRW !== 'Semua') {
      level = 'rw';
    } else if (selectedKelurahan && selectedKelurahan !== 'Semua') {
      level = 'rw';
    } else if (selectedKecamatan && selectedKecamatan !== 'Semua') {
      level = 'kelurahan';
    } else if (selectedWilayah && selectedWilayah !== 'Semua') {
      level = 'kecamatan';
    }

    return {
      tahun_cap: selectedTahunCAP,
      tahun_cip: selectedTahunCIP,
      wilayah: selectedWilayah !== 'Semua' ? selectedWilayah : '',
      kecamatan: selectedKecamatan !== 'Semua' ? selectedKecamatan : '',
      kelurahan: selectedKelurahan !== 'Semua' ? selectedKelurahan : '',
      rw: selectedRW !== 'Semua' ? selectedRW : '',
      kegiatan: selectedKegiatan !== 'Semua' ? selectedKegiatan : '', // ⬅️ NEW
      level_x_axis: level,
    };
  }, [selectedTahunCAP, selectedTahunCIP, selectedWilayah, selectedKecamatan, selectedKelurahan, selectedRW, selectedKegiatan]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch(`${baseUrl}/filter-options`);
        const result = await response.json();

        const sortAsc = (arr) => [...arr].sort((a, b) => a.localeCompare(b, 'id', { numeric: true }));
        result.tahun_cap = sortAsc(result.tahun_cap.map(String));
        result.tahun_cip = sortAsc(result.tahun_cip.map(String));
        result.wilayah = sortAsc(result.wilayah);
        // Urutkan kegiatan (kalau tidak ada di response, fallback ke [])
        result.kegiatan = sortAsc((result.kegiatan || []).filter(Boolean));

        const kec_by_wil = {};
        const kel_by_kec = {};
        const rw_by_kel = {};

        (result.data || []).forEach(({ wilayah, kecamatan, kelurahan, rw }) => {
          if (!kec_by_wil[wilayah]) kec_by_wil[wilayah] = new Set();
          kec_by_wil[wilayah].add(kecamatan);

          if (!kel_by_kec[kecamatan]) kel_by_kec[kecamatan] = new Set();
          kel_by_kec[kecamatan].add(kelurahan);

          if (!rw_by_kel[kelurahan]) rw_by_kel[kelurahan] = new Set();
          rw_by_kel[kelurahan].add(rw);
        });

        setFilterOptions({
          ...result,
          mapping: {
            kec_by_wil: Object.fromEntries(Object.entries(kec_by_wil).map(([k, v]) => [k, sortAsc([...v])])),
            kel_by_kec: Object.fromEntries(Object.entries(kel_by_kec).map(([k, v]) => [k, sortAsc([...v])])),
            rw_by_kel: Object.fromEntries(Object.entries(rw_by_kel).map(([k, v]) => [k, sortAsc([...v])])),
          },
        });
      } catch (error) {
        console.error('Gagal mengambil filter:', error);
      }
    };

    fetchFilterOptions();
  }, []);

  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        const params = new URLSearchParams(filters);
        const response = await fetch(`${baseUrl}/chart-bar?${params}`);
        const result = await response.json();

        setBarChartData(Array.isArray(result) ? result : []);

        const summary = {
          jumlah_rw_kumuh: result.reduce((acc, item) => acc + (item.jumlah_rw_kumuh || 0), 0),
          jumlah_rw_implementasi: result.reduce((acc, item) => acc + (item.jumlah_rw_cap || 0) + (item.jumlah_rw_cip || 0), 0),
          jumlah_cip: result.reduce((acc, item) => acc + (item.jumlah_kegiatan_cip || 0), 0),
          total_anggaran: result.reduce((acc, item) => acc + (item.total_anggaran_cip || 0), 0),
        };

        setSummaryData(summary);
      } catch (error) {
        console.error('Gagal mengambil chart bar:', error);
      }
    };

    fetchBarChartData();
  }, [filters]);

  useEffect(() => {
    const fetchDonutCAP = async () => {
      try {
        const params = new URLSearchParams({
          tahun: filters.tahun_cap,
          wilayah: filters.wilayah,
          kecamatan: filters.kecamatan,
          kelurahan: filters.kelurahan,
          rw: filters.rw,
          kegiatan: filters.kegiatan, // ⬅️ NEW
        });
        const res = await fetch(`${baseUrl}/donut-cap-chart?${params}`);
        const data = await res.json();
        setDonutCapData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Gagal mengambil data donut CAP:', err);
      }
    };
    fetchDonutCAP();
  }, [filters]);

  useEffect(() => {
    const fetchDonutCIP = async () => {
      try {
        const params = new URLSearchParams({
          tahun: filters.tahun_cip,
          wilayah: filters.wilayah,
          kecamatan: filters.kecamatan,
          kelurahan: filters.kelurahan,
          rw: filters.rw,
          kegiatan: filters.kegiatan, // ⬅️ NEW
        });
        const res = await fetch(`${baseUrl}/donut-cip-chart?${params}`);
        const data = await res.json();
        setDonutCipData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Gagal mengambil data donut CIP:', err);
      }
    };
    fetchDonutCIP();
  }, [filters]);

  useEffect(() => {
    const fetchTableCIP = async () => {
      try {
        // Jika nanti backend table-cip sudah mendukung filter (termasuk kegiatan),
        // kamu bisa kirim query string juga. Untuk saat ini tetap ambil full dan filter di frontend.
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
    const { kec_by_wil, kel_by_kec, rw_by_kel } = filterOptions.mapping;

    const kecamatanOptions = selectedWilayah !== 'Semua' ? (kec_by_wil[selectedWilayah] || []) : [];
    const kelurahanOptions = selectedKecamatan !== 'Semua' ? (kel_by_kec[selectedKecamatan] || []) : [];
    const rwOptions = selectedKelurahan !== 'Semua' ? (rw_by_kel[selectedKelurahan] || []) : [];

    return { kecamatanOptions, kelurahanOptions, rwOptions };
  };

  const { kecamatanOptions, kelurahanOptions, rwOptions } = getFilteredOptions();

  return (
    <div className="App" style={{ backgroundColor: '#83DBF6', minHeight: '100vh', color: '#fff' }}>
      <HeroSection summary={summaryData} onScrollClick={scrollToContent} />

      <div ref={contentRef} className="container py-4">
        <FilterPanel
          selectedTahunCAP={selectedTahunCAP}
          selectedTahunCIP={selectedTahunCIP}
          selectedWilayah={selectedWilayah}
          selectedKecamatan={selectedKecamatan}
          selectedKelurahan={selectedKelurahan}
          selectedRW={selectedRW}
          selectedKegiatan={selectedKegiatan}                           // ⬅️ NEW
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
          onChangeKegiatan={(e) => setSelectedKegiatan(e.target.value)}  // ⬅️ NEW
          onReset={() => {
            setSelectedTahunCAP('Semua');
            setSelectedTahunCIP('Semua');
            setSelectedWilayah('Semua');
            setSelectedKecamatan('Semua');
            setSelectedKelurahan('Semua');
            setSelectedRW('Semua');
            setSelectedKegiatan('Semua');                                // ⬅️ NEW
          }}
          filterOptions={filterOptions}
          filteredOptions={{ kecamatanOptions, kelurahanOptions, rwOptions }}
        />
      </div>

      <div className="container py-4">
        <div className="row g-4">
          <div className="col-md-6">
            <BarChartCard title="CAP dan CIP berdasarkan RW Kumuh" filters={filters} data={barChartData} />
          </div>
          <div className="col-md-6">
            <DonutChartCard title="Anggaran CIP" filters={filters} data={donutCipData} />
          </div>
          <div className="col-md-12">
            <TableDetailCard title="Detail CIP" filters={filters} data={tableCipData} />
          </div>
          <div className="col-md-12">
            <AllDataTable filters={filters} data={tableCipData} />
          </div>
          <div className="col-md-12">
            <ProyeksiCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
