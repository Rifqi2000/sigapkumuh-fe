import React, { useEffect, useState } from 'react';
import { fetchFilteredData } from './utils/api';
import FilterPanel from './components/FilterPanel';
import ChartPanel from './components/ChartPanel';
import TablePanel from './components/TablePanel';
import HeroSection from './components/HeroSection';
import './App.css';
import 'animate.css';


function App() {
  const [filters, setFilters] = useState({});
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    fetchFilteredData({}).then(setAllData);
  }, []);

  useEffect(() => {
    fetchFilteredData(filters).then(setData);
  }, [filters]);

  const summaryData = {
    wilayah: new Set(allData.map(d => d.wilayah)).size,
    kecamatan: new Set(allData.map(d => `${d.wilayah}|${d.kecamatan}`)).size,
    kelurahan: new Set(allData.map(d => `${d.wilayah}|${d.kecamatan}|${d.kelurahan}`)).size,
    rw: new Set(allData.map(d => `${d.wilayah}|${d.kecamatan}|${d.kelurahan}|${d.lokasi_rw}`)).size
  };

  return (
    <div className="App">
      {/* Hero Section */}
      <HeroSection summary={summaryData} />

      {/* Content Section */}
      <div id="main-content" className="content-container">
        <FilterPanel filters={filters} setFilters={setFilters} allData={allData} />
        <ChartPanel data={data} filters={filters} />
        <TablePanel data={data} />
      </div>
    </div>
  );
}

export default App;
