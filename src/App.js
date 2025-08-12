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

// Helper: pastikan input jadi array (menerima array / event-like / single value)
const ensureArray = (val) => {
  if (Array.isArray(val)) return val.filter((v) => v !== undefined && v !== null && v !== '');
  if (val && typeof val === 'object' && 'target' in val) {
    const tv = val.target?.value;
    if (Array.isArray(tv)) return tv.filter((v) => v !== undefined && v !== null && v !== '');
    if (tv === undefined || tv === null || tv === '') return [];
    return [tv];
  }
  if (val === undefined || val === null || val === '') return [];
  return [val];
};

// Helper: append array param ke URLSearchParams (tiap item jadi repetisi key)
const appendArray = (params, key, arr) => {
  ensureArray(arr).forEach((v) => params.append(key, String(v)));
};

// Helper: sort ASC (A-Z, numeric-aware)
const sortAsc = (arr) =>
  [...arr].sort((a, b) => String(a).localeCompare(String(b), 'id', { numeric: true }));

function App() {
  // === SEMUA FILTER JADI ARRAY ===
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
    kegiatan: [],
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
  const scrollToContent = () => contentRef.current?.scrollIntoView({ behavior: 'smooth' });

  // Tentukan level_x_axis berdasar kedalaman pilihan
  const levelXAxis = useMemo(() => {
    const has = (arr) => Array.isArray(arr) && arr.length > 0;
    if (has(selectedRW)) return 'rw';
    if (has(selectedKelurahan)) return 'rw';
    if (has(selectedKecamatan)) return 'kelurahan';
    if (has(selectedWilayah)) return 'kecamatan';
    return 'wilayah';
  }, [selectedWilayah, selectedKecamatan, selectedKelurahan, selectedRW]);

  // Objek filters (dipass ke child untuk UI lain bila perlu)
  const filters = useMemo(
    () => ({
      tahun_cap: selectedTahunCAP,
      tahun_cip: selectedTahunCIP,
      wilayah: selectedWilayah,
      kecamatan: selectedKecamatan,
      kelurahan: selectedKelurahan,
      rw: selectedRW,
      kegiatan: selectedKegiatan,
      level_x_axis: levelXAxis,
    }),
    [
      selectedTahunCAP,
      selectedTahunCIP,
      selectedWilayah,
      selectedKecamatan,
      selectedKelurahan,
      selectedRW,
      selectedKegiatan,
      levelXAxis,
    ]
  );

  // Ambil opsi filter
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch(`${baseUrl}/filter-options`);
        const result = await response.json();

        const tahun_cap = sortAsc((result.tahun_cap || []).map(String));
        const tahun_cip = sortAsc((result.tahun_cip || []).map(String));
        const wilayah = sortAsc(result.wilayah || []);
        const kegiatan = sortAsc((result.kegiatan || []).filter(Boolean));

        const kec_by_wil = {};
        const kel_by_kec = {};
        const rw_by_kel = {};

        (result.data || []).forEach(({ wilayah, kecamatan, kelurahan, rw }) => {
          if (wilayah) {
            if (!kec_by_wil[wilayah]) kec_by_wil[wilayah] = new Set();
            if (kecamatan) kec_by_wil[wilayah].add(kecamatan);
          }
          if (kecamatan) {
            if (!kel_by_kec[kecamatan]) kel_by_kec[kecamatan] = new Set();
            if (kelurahan) kel_by_kec[kecamatan].add(kelurahan);
          }
          if (kelurahan) {
            if (!rw_by_kel[kelurahan]) rw_by_kel[kelurahan] = new Set();
            if (rw) rw_by_kel[kelurahan].add(rw);
          }
        });

        const sortedMap = (objOfSets) =>
          Object.fromEntries(
            Object.entries(objOfSets).map(([k, set]) => [k, sortAsc([...set])])
          );

        setFilterOptions({
          tahun_cap,
          tahun_cip,
          wilayah,
          kegiatan,
          mapping: {
            kec_by_wil: sortedMap(kec_by_wil),
            kel_by_kec: sortedMap(kel_by_kec),
            rw_by_kel: sortedMap(rw_by_kel),
          },
        });
      } catch (error) {
        console.error('Gagal mengambil filter:', error);
      }
    };

    fetchFilterOptions();
  }, []);

  // Ambil Bar Chart (append array params)
  useEffect(() => {
    const fetchBarChartData = async () => {
      try {
        const params = new URLSearchParams();
        appendArray(params, 'tahun_cap', selectedTahunCAP);
        appendArray(params, 'tahun_cip', selectedTahunCIP);
        appendArray(params, 'wilayah', selectedWilayah);
        appendArray(params, 'kecamatan', selectedKecamatan);
        appendArray(params, 'kelurahan', selectedKelurahan);
        appendArray(params, 'rw', selectedRW);
        appendArray(params, 'kegiatan', selectedKegiatan);
        params.set('level_x_axis', levelXAxis);

        const response = await fetch(`${baseUrl}/chart-bar?${params.toString()}`);
        const result = await response.json();

        const arr = Array.isArray(result) ? result : [];
        setBarChartData(arr);

        const summary = {
          jumlah_rw_kumuh: arr.reduce((acc, item) => acc + (item.jumlah_rw_kumuh || 0), 0),
          jumlah_rw_implementasi: arr.reduce(
            (acc, item) => acc + (item.jumlah_rw_cap || 0) + (item.jumlah_rw_cip || 0),
            0
          ),
          jumlah_cip: arr.reduce((acc, item) => acc + (item.jumlah_kegiatan_cip || 0), 0),
          total_anggaran: arr.reduce((acc, item) => acc + (item.total_anggaran_cip || 0), 0),
        };
        setSummaryData(summary);
      } catch (error) {
        console.error('Gagal mengambil chart bar:', error);
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
    selectedKegiatan,
    levelXAxis,
  ]);

  // Donut CAP
  useEffect(() => {
    const fetchDonutCAP = async () => {
      try {
        const params = new URLSearchParams();
        appendArray(params, 'tahun', selectedTahunCAP);
        appendArray(params, 'wilayah', selectedWilayah);
        appendArray(params, 'kecamatan', selectedKecamatan);
        appendArray(params, 'kelurahan', selectedKelurahan);
        appendArray(params, 'rw', selectedRW);
        appendArray(params, 'kegiatan', selectedKegiatan);

        const res = await fetch(`${baseUrl}/donut-cap-chart?${params.toString()}`);
        const data = await res.json();
        setDonutCapData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Gagal mengambil data donut CAP:', err);
      }
    };
    fetchDonutCAP();
  }, [selectedTahunCAP, selectedWilayah, selectedKecamatan, selectedKelurahan, selectedRW, selectedKegiatan]);

  // Donut CIP
  useEffect(() => {
    const fetchDonutCIP = async () => {
      try {
        const params = new URLSearchParams();
        appendArray(params, 'tahun', selectedTahunCIP);
        appendArray(params, 'wilayah', selectedWilayah);
        appendArray(params, 'kecamatan', selectedKecamatan);
        appendArray(params, 'kelurahan', selectedKelurahan);
        appendArray(params, 'rw', selectedRW);
        appendArray(params, 'kegiatan', selectedKegiatan);

        const res = await fetch(`${baseUrl}/donut-cip-chart?${params.toString()}`);
        const data = await res.json();
        setDonutCipData(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Gagal mengambil data donut CIP:', err);
      }
    };
    fetchDonutCIP();
  }, [selectedTahunCIP, selectedWilayah, selectedKecamatan, selectedKelurahan, selectedRW, selectedKegiatan]);

  // Table CIP (ambil full; filter di frontend bila perlu)
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

  // Build filtered child options (union dari pilihan parent)
  const getFilteredOptions = () => {
    const { kec_by_wil, kel_by_kec, rw_by_kel } = filterOptions.mapping;
    const uniq = (arr) => Array.from(new Set(arr));
    const has = (arr) => Array.isArray(arr) && arr.length > 0;

    // Kecamatan: union semua kecamatan dari wilayah terpilih
    const kecamatanOptions = has(selectedWilayah)
      ? sortAsc(
          uniq(
            selectedWilayah.flatMap((wil) => (kec_by_wil[wil] ? kec_by_wil[wil] : []))
          )
        )
      : [];

    // Kelurahan: union semua kelurahan dari kecamatan terpilih
    const kelurahanOptions = has(selectedKecamatan)
      ? sortAsc(
          uniq(
            selectedKecamatan.flatMap((kec) => (kel_by_kec[kec] ? kel_by_kec[kec] : []))
          )
        )
      : [];

    // RW: union semua RW dari kelurahan terpilih
    const rwOptions = has(selectedKelurahan)
      ? sortAsc(
          uniq(
            selectedKelurahan.flatMap((kel) => (rw_by_kel[kel] ? rw_by_kel[kel] : []))
          )
        )
      : [];

    return { kecamatanOptions, kelurahanOptions, rwOptions };
  };

  const { kecamatanOptions, kelurahanOptions, rwOptions } = getFilteredOptions();

  return (
    <div className="App" style={{ backgroundColor: '#83DBF6', minHeight: '100vh', color: '#fff' }}>
      <HeroSection summary={summaryData} onScrollClick={scrollToContent} />

      <div ref={contentRef} className="container py-4">
        <FilterPanel
          // nilai terpilih (array)
          selectedTahunCAP={selectedTahunCAP}
          selectedTahunCIP={selectedTahunCIP}
          selectedWilayah={selectedWilayah}
          selectedKecamatan={selectedKecamatan}
          selectedKelurahan={selectedKelurahan}
          selectedRW={selectedRW}
          selectedKegiatan={selectedKegiatan}
          // handler: terima array atau event-like
          onChangeTahunCAP={(v) => setSelectedTahunCAP(ensureArray(v))}
          onChangeTahunCIP={(v) => setSelectedTahunCIP(ensureArray(v))}
          onChangeWilayah={(v) => {
            const arr = ensureArray(v);
            setSelectedWilayah(arr);
            // reset turunan saat parent berubah
            setSelectedKecamatan([]);
            setSelectedKelurahan([]);
            setSelectedRW([]);
          }}
          onChangeKecamatan={(v) => {
            const arr = ensureArray(v);
            setSelectedKecamatan(arr);
            setSelectedKelurahan([]);
            setSelectedRW([]);
          }}
          onChangeKelurahan={(v) => {
            const arr = ensureArray(v);
            setSelectedKelurahan(arr);
            setSelectedRW([]);
          }}
          onChangeRW={(v) => setSelectedRW(ensureArray(v))}
          onChangeKegiatan={(v) => setSelectedKegiatan(ensureArray(v))}
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
