import React, { useEffect, useState, useMemo } from 'react';
import './css/HeroSection.css';
import 'animate.css';

const HeroSection = ({ onScrollClick }) => {
  const [rwKumuhPerWilayah, setRwKumuhPerWilayah] = useState([]);
  const [selectedWilayah, setSelectedWilayah] = useState(null);
  const [rwDetailData, setRwDetailData] = useState([]);
  const [authStatus, setAuthStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 5;
  const baseUrl = process.env.REACT_APP_API_URL;

  const checkAuthStatus = () => {
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
  };

  useEffect(() => {
    checkAuthStatus();
    fetch(`${baseUrl}/rwkumuh-per-wilayah`)
      .then((res) => res.json())
      .then((data) => setRwKumuhPerWilayah(data))
      .catch((err) => console.error('❌ Gagal fetch data wilayah:', err));
  }, []);

  useEffect(() => {
    if (selectedWilayah) {
      fetch(`${baseUrl}/rwkumuh-detail?wilayah=${encodeURIComponent(selectedWilayah)}`)
        .then((res) => res.json())
        .then((data) => {
          setRwDetailData(data);
          setCurrentPage(1);
        })
        .catch((err) => console.error('❌ Gagal fetch detail RW:', err));
    } else {
      setRwDetailData([]);
    }
  }, [selectedWilayah]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return rwDetailData.slice(start, start + rowsPerPage);
  }, [rwDetailData, currentPage]);

  const totalPages = Math.ceil(rwDetailData.length / rowsPerPage);

  const handleWilayahClick = (wilayah) => {
    if (selectedWilayah === wilayah) {
      setSelectedWilayah(null);
      setRwDetailData([]);
    } else {
      setSelectedWilayah(wilayah);
    }
  };

  const getColorByWilayah = (wilayah) => {
    switch (wilayah) {
      case 'Jakarta Pusat': return 'purple-light';
      case 'Jakarta Barat': return 'blue-light';
      case 'Jakarta Selatan': return 'red-dark';
      case 'Jakarta Utara': return 'green-light';
      case 'Jakarta Timur': return 'teal-light';
      case 'Kep. Seribu': return 'teal-dark';
      default: return 'gray';
    }
  };

  const totalRW = rwKumuhPerWilayah.reduce((acc, item) => acc + parseInt(item.jumlah_rw || 0, 10), 0);

  return (
    <div className="hero-wrapper">
      <div className="hero-section">
        <div className="hero-content">
          {/* === KIRI === */}
          <div className="text-area text-start">
            <div className="logo-row animate__animated animate__zoomInLeft animate__delay-0s">
              <img src="/portal/img/LANRI.png" alt="LAN RI" />
              <img src="/portal/img/JAYARAYA.png" alt="Jaya Raya" />
              <img src="/portal/img/BPSDM.png" alt="BPSDM" />
              <img src="/portal/img/DPRKP.png" alt="DPRKP" />
            </div>

            <h1 className="hero-title animate__animated animate__fadeInUp animate__delay-1s">
              DASHBOARD DATA SIGAP KUMUH
            </h1>
            <p className="hero-desc animate__animated animate__fadeInUp animate__delay-2s">
              Platform strategis yang menghubungkan seluruh pemangku kepentingan dalam satu sistem yang transparan, kolaboratif, dan responsif.
            </p>

            <div className="card-summary">
              <div className="hero-card total-card animate__animated animate__bounceIn animate__delay-1s">
                <div className="icon-area">
                  <i className="bi-house-dash"></i>
                </div>
                <div className="text-end">
                  <div className="hero-value">{totalRW}</div>
                  <div className="hero-label">RW Kumuh</div>
                </div>
              </div>

              <div className="wilayah-grid">
                {rwKumuhPerWilayah.map((item) => (
                  <div
                    key={item.wilayah}
                    className={`wilayah-card ${getColorByWilayah(item.wilayah)} animate__animated animate__fadeInUp`}
                    onClick={() => handleWilayahClick(item.wilayah)}
                  >
                    <div className="wilayah-nama">{item.wilayah}</div>
                    <div className="wilayah-jumlah">
                      {item.jumlah_rw} <span>RW Kumuh</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* === KANAN === */}
          <div className="illustration-wrapper">
            {selectedWilayah ? (
              <div className="rw-detail-table animate__animated animate__fadeInRight">
                <h4 className="text-center mt-4 mb-2">RW Kumuh {selectedWilayah}</h4>
                <div className="table-responsive px-3">
                  <table className="table table-bordered table-sm w-100">
                    <thead className="table-light">
                      <tr>
                        <th>Kecamatan</th>
                        <th>Kelurahan</th>
                        <th>RW</th>
                        <th>Tingkat Kekumuhan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedData.map((row, i) => (
                        <tr key={i}>
                          <td>{row.wadmkc}</td>
                          <td>{row.wadmkd}</td>
                          <td>{row.wadmrw}</td>
                          <td>{row.keterangan}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination-wrapper d-flex justify-content-center mt-2">
                      <button
                        className="btn btn-sm btn-outline-primary mx-1"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      <span className="align-self-center mx-2">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        className="btn btn-sm btn-outline-primary mx-1"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <img
                src="/portal/img/sigap.jpeg"
                alt="Illustration"
                className="hero-illustration animate__animated animate__zoomInRight animate__delay-3s"
              />
            )}
          </div>
        </div>
      </div>

      <div className="scroll-icon-wrapper">
        <div className="scroll-icon" onClick={onScrollClick}>
          <img src="/portal/img/arrow.png" alt="Scroll Down" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
