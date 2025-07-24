import React from 'react';
import './css/HeroSection.css';
import 'animate.css';

const HeroSection = ({ summary = {}, onScrollClick }) => {
  const {
    jumlah_rw_kumuh = 0,
    jumlah_rw_implementasi = 0,
    jumlah_cip = 0,
    total_anggaran = 0,
  } = summary;


  return (
    <div className="hero-wrapper">
      <div className="hero-section">
        <div className="hero-content">
          <div className="text-area text-start">
            {/* Logo Bar dengan animasi ZoomIn */}
            <div className="logo-row animate__animated animate__zoomInLeft animate__delay-0s">
              <img src="/img/LANRI.png" alt="LAN RI" />
              <img src="/img/JAYARAYA.png" alt="Jaya Raya" />
              <img src="/img/BPSDM.png" alt="BPSDM" />
              <img src="/img/DPRKP.png" alt="DPRKP" />
            </div>

            {/* Judul dan deskripsi */}
            <h1 className="hero-title animate__animated animate__fadeInUp animate__delay-1s">
              DASHBOARD DATA SIGAP-KUMUH
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
                  <i class="bi bi-tools"></i>
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
                  <div className="hero-label">Anggaran (Rp)</div>
                </div>
              </div>
            </div>
          </div>

          {/* GIF Illustration */}
          <div className="illustration-wrapper">
            <img
              src="/img/sigap.jpeg"
              alt="Illustration"
              className="hero-illustration animate__animated animate__zoomInRight animate__delay-3s"
            />
          </div>
        </div>
      </div>

      {/* Scroll down arrow */}
      <div className="scroll-icon-wrapper">
        <div className="scroll-icon" onClick={onScrollClick}>
          <img src="/img/arrow.png" alt="Scroll Down" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
