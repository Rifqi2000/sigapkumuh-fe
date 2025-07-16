import React, { useEffect, useState } from 'react';
import { fetchFilteredData } from './utils/api';
import FilterPanel from './components/FilterPanel';
import ChartPanel from './components/ChartPanel';
import TablePanel from './components/TablePanel';
import './App.css';
import InfoCards from './components/InfoCards';



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

  return (
    <div className="App">
      {/* Info Cards Section */}
      <div className="mt-5 mb-3">
        <InfoCards data={allData} />
      </div>

      {/* Main Header Section */}
      <header className="App-header d-flex flex-column justify-content-center align-items-center">
        <div style={{ paddingTop: '180px', paddingBottom: '80px' }}>
          <h1 className="mb-3">SIGAP KUMUH - Dashboard Data</h1>

          <button
            className="scroll-down-btn"
            onClick={() => {
              document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            ⬇
          </button>
        </div>
      </header>


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
