import React, { useMemo } from "react";
import MultiSelectDropdown from "./MultiSelectDropdown";

const uniqSort = (arr) =>
  [...new Set(arr.filter(Boolean))].sort((a, b) => a.localeCompare(b, "id", { numeric: true }));

const FilterPanel = ({
  // semua array
  selectedTahunCAP = [],
  selectedTahunCIP = [],
  selectedWilayah = [],
  selectedKecamatan = [],
  selectedKelurahan = [],
  selectedRW = [],
  selectedKegiatan = [],

  // handler terima array
  onChangeTahunCAP,
  onChangeTahunCIP,
  onChangeWilayah,
  onChangeKecamatan,
  onChangeKelurahan,
  onChangeRW,
  onChangeKegiatan,

  onReset,
  filterOptions = {},
  filteredOptions = {},
}) => {
  // helper agar kompatibel (kalau parent masih expect event-like, tinggal ganti jadi toEvent)
  const call = (fn) => (arr) => fn && fn(Array.isArray(arr) ? arr : []);

  const tahunCapOpts = filterOptions.tahun_cap || [];
  const tahunCipOpts = filterOptions.tahun_cip || [];
  const wilayahOpts = filterOptions.wilayah || [];
  const kecFlat = filteredOptions.kecamatanOptions || [];
  const kelFlat = filteredOptions.kelurahanOptions || [];
  const rwFlat = filteredOptions.rwOptions || [];
  const kegOpts = filterOptions.kegiatan || [];
  const mapping = filterOptions.mapping || {};
  const allRows = filterOptions.data || []; // fallback

  // ===== Sections: Kecamatan per Wilayah =====
  const kecSections = useMemo(() => {
    // pakai mapping jika ada
    if (mapping.kec_by_wil) {
      const listWil = selectedWilayah.length ? selectedWilayah : Object.keys(mapping.kec_by_wil || {}).sort();
      const secs = listWil
        .map((w) => ({
          title: w,
          options: uniqSort((mapping.kec_by_wil[w] || []).filter((k) => kecFlat.includes(k))),
        }))
        .filter((s) => s.options.length);
      return secs.length ? secs : null;
    }
    // fallback dari data mentah
    if (!allRows.length) return null;
    const listWil = selectedWilayah.length ? selectedWilayah : uniqSort(allRows.map((r) => r.wilayah));
    const secs = listWil
      .map((w) => ({
        title: w,
        options: uniqSort(allRows.filter((r) => r.wilayah === w).map((r) => r.kecamatan)).filter((k) =>
          kecFlat.includes(k)
        ),
      }))
      .filter((s) => s.options.length);
    return secs.length ? secs : null;
  }, [mapping, allRows, selectedWilayah, kecFlat]);

  // ===== Sections: Kelurahan per Kecamatan =====
  const kelSections = useMemo(() => {
    if (mapping.kel_by_kec) {
      const listKec = selectedKecamatan.length
        ? selectedKecamatan
        : Object.keys(mapping.kel_by_kec || {}).sort();
      const secs = listKec
        .map((k) => ({
          title: k,
          options: uniqSort((mapping.kel_by_kec[k] || []).filter((kel) => kelFlat.includes(kel))),
        }))
        .filter((s) => s.options.length);
      return secs.length ? secs : null;
    }
    if (!allRows.length) return null;
    const listKec = selectedKecamatan.length
      ? selectedKecamatan
      : uniqSort(
          allRows
            .filter((r) => !selectedWilayah.length || selectedWilayah.includes(r.wilayah))
            .map((r) => r.kecamatan)
        );
    const secs = listKec
      .map((k) => ({
        title: k,
        options: uniqSort(allRows.filter((r) => r.kecamatan === k).map((r) => r.kelurahan)).filter((kel) =>
          kelFlat.includes(kel)
        ),
      }))
      .filter((s) => s.options.length);
    return secs.length ? secs : null;
  }, [mapping, allRows, selectedWilayah, selectedKecamatan, kelFlat]);

  // ===== Sections: RW per Kelurahan =====
  const rwSections = useMemo(() => {
    if (mapping.rw_by_kel) {
      const listKel = selectedKelurahan.length
        ? selectedKelurahan
        : Object.keys(mapping.rw_by_kel || {}).sort();
      const secs = listKel
        .map((kel) => ({
          title: kel,
          options: uniqSort((mapping.rw_by_kel[kel] || []).filter((rv) => rwFlat.includes(rv))),
        }))
        .filter((s) => s.options.length);
      return secs.length ? secs : null;
    }
    if (!allRows.length) return null;
    const listKel = selectedKelurahan.length
      ? selectedKelurahan
      : uniqSort(
          allRows
            .filter(
              (r) =>
                (!selectedWilayah.length || selectedWilayah.includes(r.wilayah)) &&
                (!selectedKecamatan.length || selectedKecamatan.includes(r.kecamatan))
            )
            .map((r) => r.kelurahan)
        );
    const secs = listKel
      .map((kel) => ({
        title: kel,
        options: uniqSort(allRows.filter((r) => r.kelurahan === kel).map((r) => r.rw)).filter((rv) =>
          rwFlat.includes(rv)
        ),
      }))
      .filter((s) => s.options.length);
    return secs.length ? secs : null;
  }, [mapping, allRows, selectedWilayah, selectedKecamatan, selectedKelurahan, rwFlat]);

  return (
    <div className="row g-2">
      {/* Tahun CAP */}
      <div className="col-12 col-md">
        <MultiSelectDropdown
          label="Tahun CAP"
          options={tahunCapOpts}
          selected={selectedTahunCAP}
          onChange={call(onChangeTahunCAP)}
          allowMultiple
          disabled={!tahunCapOpts.length}
        />
      </div>

      {/* Tahun CIP */}
      <div className="col-12 col-md">
        <MultiSelectDropdown
          label="Tahun CIP"
          options={tahunCipOpts}
          selected={selectedTahunCIP}
          onChange={call(onChangeTahunCIP)}
          allowMultiple
          disabled={!tahunCipOpts.length}
        />
      </div>

      {/* Wilayah */}
      <div className="col-12 col-md">
        <MultiSelectDropdown
          label="Wilayah"
          options={wilayahOpts}
          selected={selectedWilayah}
          onChange={(arr) => {
            call(onChangeWilayah)(arr);
          }}
          allowMultiple
          disabled={!wilayahOpts.length}
        />
      </div>

      {/* Kecamatan (group per Wilayah) */}
      <div className="col-12 col-md">
        <MultiSelectDropdown
          label="Kecamatan"
          options={kecFlat}
          sections={kecSections}
          selected={selectedKecamatan}
          onChange={call(onChangeKecamatan)}
          allowMultiple
          disabled={!kecFlat.length}
        />
      </div>

      {/* Kelurahan (group per Kecamatan) */}
      <div className="col-12 col-md">
        <MultiSelectDropdown
          label="Kelurahan"
          options={kelFlat}
          sections={kelSections}
          selected={selectedKelurahan}
          onChange={call(onChangeKelurahan)}
          allowMultiple
          disabled={!kelFlat.length}
        />
      </div>

      {/* RW (group per Kelurahan) */}
      <div className="col-12 col-md">
        <MultiSelectDropdown
          label="RW"
          options={rwFlat}
          sections={rwSections}
          selected={selectedRW}
          onChange={call(onChangeRW)}
          allowMultiple
          disabled={!rwFlat.length}
        />
      </div>

      {/* Kegiatan */}
      <div className="col-12 col-md">
        <MultiSelectDropdown
          label="Kegiatan"
          options={kegOpts}
          selected={selectedKegiatan}
          onChange={call(onChangeKegiatan)}
          allowMultiple
          disabled={!kegOpts.length}
        />
      </div>

      <div className="col-12 col-md-auto d-flex align-items-center justify-content-center">
        <button type="button" className="btn-reset-filter" onClick={onReset} title="Reset filter">
          <img src="/portal/img/filter.png" alt="Reset Filter" className="filter-icon" />
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
