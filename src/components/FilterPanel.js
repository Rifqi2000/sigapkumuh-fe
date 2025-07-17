import React from 'react';

const FilterPanel = ({ filters, setFilters, allData }) => {
  const fields = ['tahun', 'nama_kabkota', 'nama_kec', 'nama_kel'];

  const dependencies = {
    periode_data: [],
    wilayah: ['tahun'],
    kecamatan: ['tahun', 'nama_kabkota'],
    kelurahan: ['tahun', 'nama_kabkota', 'nama_kec'],
  };

  // Format ke Title Case (Awal Huruf Kapital)
  const toTitleCase = (str) =>
    str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  // Ambil opsi unik sesuai filter yang aktif
  const getOptions = (field, baseFilters) => {
    const dependsOn = dependencies[field];
    const uniqueMap = new Map();

    allData
      .filter((d) =>
        dependsOn.every((dep) => !baseFilters[dep] || String(d[dep]) === String(baseFilters[dep]))
      )
      .forEach((d) => {
        const rawValue = String(d[field] || '');
        const normalized = toTitleCase(rawValue.trim());
        if (!uniqueMap.has(normalized.toLowerCase())) {
          uniqueMap.set(normalized.toLowerCase(), normalized);
        }
      });

    return [...uniqueMap.values()];
  };

  // Ketika filter berubah
  const handleChange = (field, value) => {
    const newFilters = { ...filters, [field]: value || undefined };
    const index = fields.indexOf(field);

    // Bersihkan filter anak jika nilainya tidak valid
    for (let i = index + 1; i < fields.length; i++) {
      const childField = fields[i];
      const options = getOptions(childField, newFilters);
      if (!options.includes(newFilters[childField])) {
        delete newFilters[childField];
      }
    }

    setFilters(newFilters);
  };

  const handleReset = () => {
    setFilters({});
  };

  return (
    <div className="mb-4">
      <div className="row align-items-end">
        {fields.map((field) => {
          const options = getOptions(field, filters);

          return (
            <div className="col-md-3 mb-2" key={field}>
              <label className="form-label text-uppercase fw-bold">
                {field.replace('_', ' ')}
              </label>
              <select
                className="form-select"
                value={filters[field] || ''}
                onChange={(e) => handleChange(field, e.target.value)}
              >
                <option value="">Semua</option>
                {options.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          );
        })}

        <div className="col-md-12 text-end mt-2">
          <button className="btn btn-secondary" onClick={handleReset}>
            🔄 Reset Semua Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
