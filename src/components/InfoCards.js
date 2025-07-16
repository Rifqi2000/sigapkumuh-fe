import React from 'react';
import { Container,Card, Row, Col } from 'react-bootstrap';

const InfoCards = ({ data }) => {
  const uniqueWilayah = new Set(data.map((d) => d.wilayah));
  const uniqueKecamatan = new Set(data.map((d) => `${d.wilayah}|${d.kecamatan}`));
  const uniqueKelurahan = new Set(data.map((d) => `${d.wilayah}|${d.kecamatan}|${d.kelurahan}`));
  const uniqueRW = new Set(data.map((d) => `${d.wilayah}|${d.kecamatan}|${d.kelurahan}|${d.lokasi_rw}`));
  const totalCIP = data.reduce((sum, d) => sum + (d.jumlah_peningkatan_psu_dilaksanakan || 0), 0);

  const info = [
    { title: 'Wilayah CIP', value: uniqueWilayah.size },
    { title: 'Kecamatan CIP', value: uniqueKecamatan.size },
    { title: 'Kelurahan CIP', value: uniqueKelurahan.size },
    { title: 'RW CIP', value: uniqueRW.size },
    { title: 'Total CIP', value: totalCIP },
  ];

  return (
    <Row className="g-4 justify-content-center px-4 py-3">
      {info.map((item, idx) => (
        <Col key={idx} xs={12} sm={6} md={4} lg={2} className="d-flex justify-content-center">
          <Card className="text-center shadow-sm w-100" style={{ minWidth: '150px', borderRadius: '12px' }}>
            <Card.Body>
              <Card.Title className="card-label">{item.title}</Card.Title>
              <Card.Text className="fw-bold fs-4">{item.value}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default InfoCards;
