import React, { useState, useEffect } from 'react';
import './css/ProyeksiCard.css';

const hargaSatuan = {
  "Jalan": 275654.97,
  "Saluran": 1105457.51,
  "Speedbump": 3635000.00,
  "Cermin Cembung": 4500000.00,
  "Vertikal Garden": 25238000.00,
  "PJU": 15216041.00,
  "Bollard": 2791125.00,
  "Bangku": 9900000.00,
  "Gapura": 30489491.00,
  "Wayfinding": 16380000.00
};

const inflasi = [
  0.0090, 0.0337, 0.0331, 0.0340, 0.0331, 0.0325, 0.0342, 0.0380,
  0.0358, 0.0298, 0.0313, 0.0336, 0.0335, 0.0336, 0.0336, 0.0336, 0.0337
];

const baseYear = 2023;

const ProyeksiCard = () => {
  const [authStatus, setAuthStatus] = useState(null);
  const [item, setItem] = useState("Jalan");
  const [volume, setVolume] = useState(1);
  const [tahun, setTahun] = useState(2024);
  const [hasil, setHasil] = useState("");

  // Cek status autentikasi saat komponen dimount
  useEffect(() => {
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
  }, []);

  // Jika bukan admin, tidak render komponen
  if (authStatus !== 'admin') return null;

  const hitungEstimasi = () => {
    if (!item || !volume || !tahun) {
      alert("Mohon lengkapi semua input.");
      return;
    }

    const hargaAwal = hargaSatuan[item];
    let multiplier = 1;

    for (let i = 0; i < (tahun - baseYear); i++) {
      multiplier *= (1 + inflasi[i]);
    }

    const totalHarga = hargaAwal * volume * multiplier;

    setHasil(
      `Estimasi Harga Tahun ${tahun} untuk ${volume} ${item === 'Jalan' || item === 'Saluran' ? 'meter' : 'unit'} "${item}" adalah: Rp ${totalHarga.toLocaleString('id-ID', { minimumFractionDigits: 2 })}`
    );
  };

  const resetForm = () => {
    setItem("Jalan");
    setVolume(1);
    setTahun(2024);
    setHasil("");
  };

  return (
    <div className="proyeksi-container mt-5">
      <h2>Estimasi Harga</h2>

      <div className="proyeksi-form-row">
        <div className="proyeksi-form-group">
          <label htmlFor="item">Pilih Item:</label>
          <select id="item" value={item} onChange={(e) => setItem(e.target.value)}>
            {Object.keys(hargaSatuan).map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>

        <div className="proyeksi-form-group">
          <label htmlFor="volume">Volume (meter/unit):</label>
          <input
            type="number"
            id="volume"
            value={volume}
            min="1"
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
        </div>

        <div className="proyeksi-form-group">
          <label htmlFor="tahun">Tahun Estimasi:</label>
          <select id="tahun" value={tahun} onChange={(e) => setTahun(parseInt(e.target.value))}>
            {Array.from({ length: 2040 - 2024 + 1 }, (_, i) => 2024 + i).map((yr) => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="button-group">
        <button onClick={hitungEstimasi}>Hitung Estimasi Harga</button>
        <button className="reset-button" onClick={resetForm}>Reset</button>
      </div>

      {hasil && <div id="hasil">{hasil}</div>}
    </div>
  );
};

export default ProyeksiCard;
