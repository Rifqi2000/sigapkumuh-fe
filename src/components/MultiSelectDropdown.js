import React, { useEffect, useMemo, useRef, useState } from "react";

const MultiSelectDropdown = ({
  label = "Pilih",
  options = [],                 // fallback jika tidak pakai sections
  sections,                     // [{ title: string, options: string[] }]
  selected = [],
  onChange,
  allowMultiple = true,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const normSections = useMemo(() => {
    if (!sections || !Array.isArray(sections)) return null;
    const sort = (arr) =>
      [...new Set((arr || []).filter(Boolean))].sort((a, b) =>
        a.localeCompare(b, "id", { numeric: true })
      );
    const s = sections
      .map((s) => ({ title: s.title, options: sort(s.options) }))
      .filter((s) => s.options.length);
    return s.length ? s : null;
  }, [sections]);

  const flatAll = useMemo(() => {
    if (normSections) return normSections.flatMap((s) => s.options);
    return [...new Set((options || []).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b, "id", { numeric: true })
    );
  }, [normSections, options]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!normSections) {
      const flat = !q ? flatAll : flatAll.filter((o) => (o || "").toLowerCase().includes(q));
      return { sections: null, flat };
    }
    const secs = normSections
      .map((s) => ({
        title: s.title,
        options: !q ? s.options : s.options.filter((o) => (o || "").toLowerCase().includes(q)),
      }))
      .filter((s) => s.options.length);
    return { sections: secs, flat: secs.flatMap((s) => s.options) };
  }, [normSections, flatAll, query]);

  const selSet = useMemo(() => new Set(selected || []), [selected]);

  const allChecked = visible.flat.length > 0 && visible.flat.every((v) => selSet.has(v));
  const someChecked = visible.flat.some((v) => selSet.has(v)) && !allChecked;

  const toggleAll = () => {
    if (!allowMultiple) return;
    if (allChecked) onChange((selected || []).filter((v) => !visible.flat.includes(v)));
    else {
      const u = new Set(selected || []);
      visible.flat.forEach((v) => u.add(v));
      onChange(Array.from(u));
    }
  };

  const toggleValue = (val) => {
    if (!allowMultiple) {
      onChange([val]);
      setOpen(false);
      return;
    }
    if (selSet.has(val)) onChange((selected || []).filter((v) => v !== val));
    else onChange([...(selected || []), val]);
  };

  const displayText = useMemo(() => {
    const eff = (selected || []).filter((v) => flatAll.includes(v));
    if (!eff.length) return label;
    if (eff.length === 1) return eff[0];
    if (eff.length === flatAll.length) return "Semua";
    return `${eff.length} dipilih`;
  }, [selected, flatAll, label]);

  // ==== STYLE helper agar text wrap rapi ====
  const itemRowStyle = {
    gap: 8,
    display: "flex",
    alignItems: "flex-start",
  };
  const textWrapStyle = {
    flex: 1,
    whiteSpace: "normal",
    wordBreak: "break-word",
    overflowWrap: "anywhere",
    lineHeight: 1.2,
  };

  return (
    <div className="dropdown" ref={ref} style={{ position: "relative", width: "100%" }}>
      <button
        className="form-select text-start"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        title={displayText}
      >
        {displayText}
      </button>

      {open && (
        <div
          className="dropdown-menu show p-2"
          style={{
            width: "100%",
            maxHeight: 320,
            overflowY: "auto",
            overflowX: "hidden",   // ⬅️ hilangkan horizontal scroll
            border: "1px solid #dee2e6",
          }}
        >
          <input
            className="form-control mb-2"
            placeholder="Cari"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {allowMultiple && (
            <label className="dropdown-item" style={itemRowStyle}>
              <input
                type="checkbox"
                checked={allChecked}
                ref={(el) => el && (el.indeterminate = someChecked)}
                onChange={toggleAll}
                style={{ marginTop: 3 }}
              />
              <span style={textWrapStyle}>Pilih semua{query ? " (hasil pencarian)" : ""}</span>
            </label>
          )}

          <div className="border-top my-2" />

          {visible.sections ? (
            visible.sections.map((sec, i) => (
              <div key={sec.title}>
                <div className="px-2 py-1 small text-muted fw-semibold" style={{ ...textWrapStyle }}>
                  {sec.title}
                </div>
                {sec.options.map((opt) => {
                  const checked = selSet.has(opt);
                  return (
                    <label key={sec.title + "::" + opt} className="dropdown-item" style={itemRowStyle} title={opt}>
                      <input
                        type={allowMultiple ? "checkbox" : "radio"}
                        name={`ms_${label}`}
                        checked={checked}
                        onChange={() => toggleValue(opt)}
                        style={{ marginTop: 3 }}
                      />
                      <span style={textWrapStyle}>{opt}</span>
                    </label>
                  );
                })}
                {i !== visible.sections.length - 1 && <div className="border-top my-2" />}
              </div>
            ))
          ) : visible.flat.length ? (
            visible.flat.map((opt) => {
              const checked = selSet.has(opt);
              return (
                <label key={opt} className="dropdown-item" style={itemRowStyle} title={opt}>
                  <input
                    type={allowMultiple ? "checkbox" : "radio"}
                    name={`ms_${label}`}
                    checked={checked}
                    onChange={() => toggleValue(opt)}
                    style={{ marginTop: 3 }}
                  />
                  <span style={textWrapStyle}>{opt}</span>
                </label>
              );
            })
          ) : (
            <div className="px-2 py-1 text-muted">Tidak ada hasil</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
