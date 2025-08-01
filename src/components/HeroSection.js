import React, { useEffect, useState } from 'react';
import './css/HeroSection.css';
import 'animate.css';

const HeroSection = ({ onScrollClick }) => {
  const [summary, setSummary] = useState({
    jumlah_rw_kumuh: 0,
    jumlah_rw_implementasi: 0,
    jumlah_cip: 0,
    total_anggaran: 0,
  });

  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rwKumuh, rwImpl, cip, anggaran] = await Promise.all([
          fetch(`${baseUrl}/jumlahrwkumuh`).then((res) => res.json()),
          fetch(`${baseUrl}/rwimplementasi`).then((res) => res.json()),
          fetch(`${baseUrl}/jumlahkegiatancip`).then((res) => res.json()),
          fetch(`${baseUrl}/jumlahanggaran`).then((res) => res.json()),
        ]);

        setSummary({
          jumlah_rw_kumuh: rwKumuh.jumlah_rw_kumuh,
          jumlah_rw_implementasi: rwImpl.jumlah_rw_implementasi,
          jumlah_cip: cip.jumlah_cip,
          total_anggaran: anggaran.total_anggaran,
        });
      } catch (error) {
        console.error('❌ Gagal memuat data Hero Section:', error);
      }
    };

    fetchData();
  }, [baseUrl]);

  const {
    jumlah_rw_kumuh,
    jumlah_rw_implementasi,
    jumlah_cip,
    total_anggaran,
  } = summary;

  return (
    <div className="hero-wrapper">
      <div className="hero-section">
        <div className="hero-content">
          <div className="text-area text-start">
            {/* Logo Bar */}
            <div className="logo-row animate__animated animate__zoomInLeft animate__delay-0s">
              <img src="/img/LANRI.png" alt="LAN RI" />
              <img src="/img/JAYARAYA.png" alt="Jaya Raya" />
              <img src="/img/BPSDM.png" alt="BPSDM" />
              <img src="/img/DPRKP.png" alt="DPRKP" />
            </div>

            <h1 className="hero-title animate__animated animate__fadeInUp animate__delay-1s">
              DASHBOARD DATA SIGAP KUMUH
            </h1>
            <p className="hero-desc animate__animated animate__fadeInUp animate__delay-2s">
              Platform strategis yang menghubungkan seluruh pemangku kepentingan dalam satu sistem yang transparan, kolaboratif, dan responsif.
            </p>

            {/* Card Summary */}
            <div className="card-summary">
              <div className="hero-card purple animate__animated animate__bounceIn animate__delay-1s">
                <div className="icon-area">
                  <i className="bi-house-dash"></i>
                </div>
                <div className="text-end">
                  <div className="hero-value">{jumlah_rw_kumuh}</div>
                  <div className="hero-label">RW Kumuh</div>
                </div>
              </div>

              <div className="hero-card blue animate__animated animate__bounceIn animate__delay-1-5s">
                <div className="icon-area">
                  <i className="bi-building-check"></i>
                </div>
                <div className="text-end">
                  <div className="hero-value">{jumlah_rw_implementasi}</div>
                  <div className="hero-label">RW Sudah Implementasi</div>
                </div>
              </div>

              <div className="hero-card red animate__animated animate__bounceIn animate__delay-2s">
                <div className="icon-area">
                  <i className="bi bi-tools"></i>
                </div>
                <div className="text-end">
                  <div className="hero-value">{jumlah_cip}</div>
                  <div className="hero-label">Kegiatan CIP</div>
                </div>
              </div>

              <div className="hero-card green animate__animated animate__bounceIn animate__delay-2-5s">
                <div className="icon-area">
                  <i className="bi-cash-coin"></i>
                </div>
                <div className="text-end">
                  <div className="hero-value">
                    {total_anggaran.toLocaleString('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                    })}
                  </div>
                  <div className="hero-label">Anggaran</div>
                </div>
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="illustration-wrapper">
            <img
              src="/img/sigap.jpeg"
              alt="Illustration"
              className="hero-illustration animate__animated animate__zoomInRight animate__delay-3s"
            />
          </div>
        </div>
      </div>

      {/* Scroll Down Arrow */}
      <div className="scroll-icon-wrapper">
        <div className="scroll-icon" onClick={onScrollClick}>
          <img src="/img/arrow.png" alt="Scroll Down" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
