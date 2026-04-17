import { useState, useEffect } from "react";
import { FiScissors } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";

let _id = 0;
const nextId = () => ++_id;

const today = new Date();
const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

const PARTS_DATA = [
  { desc: "INLET PIPE / OUTLET PIPE YTAMC", partNos: ["PT-YTAMC-01", "PT-YTAMC-02"] },
  { desc: "Steel Bracket Assembly", partNos: ["PT-001-A", "PT-001-B", "PT-001-C"] },
  { desc: "Aluminium Sheet 2MM", partNos: ["PT-002-A", "PT-002-B"] },
  { desc: "Rubber Seal Ring", partNos: ["PT-003-A", "PT-003-B", "PT-003-C"] },
  { desc: "Plastic Cover Panel", partNos: ["PT-004-A", "PT-004-B"] },
  { desc: "Copper Rod 12MM", partNos: ["PT-005-A", "PT-005-B", "PT-005-C"] },
  { desc: "Bolt M10 x 50", partNos: ["PT-006-A", "PT-006-B"] },
  { desc: "Bearing 6205 ZZ", partNos: ["PT-007-A", "PT-007-B", "PT-007-C"] },
];

const SPECS = [
  "NO BURR, NO PUNCHING MISS", "24 NOS",
  "60", "120", "180", "24.3", "61.6", "28.7", "8.8", "266.8",
  "3.5-5KG/CM2", "3.5-4.5 KG/CM2", "5-6.5 KG/CM2", "6-7 KG/CM2",
  "240", "OILING TO BE DONE ON PART BEFORE PUNCHING", "NO BLANK SHORT, NO BURR ETC",
];

const NON_CONFORMANCE_OPTIONS = ["Dent", "Burr", "Scratch", "Rust", "Dimensional Deviation", "Surface Defect", "Wrong Grade", "Visual Defect", "Thread Damage", "Porosity", "Crack", "Bend/Deformation"];

const getPartNos = (desc) => desc ? (PARTS_DATA.find(p => p.desc === desc)?.partNos || []) : [];
const emptyCard = () => ({ partDesc: "", partNo: "", spec: "", nonConformance: "", reworkQty: "" });
const makeRow = (card) => ({
  id: nextId(),
  partDesc: card.partDesc,
  partNo: card.partNo,
  spec: card.spec,
  nonConformance: card.nonConformance,
  reworkQty: card.reworkQty,
  okStatus: null,
  observations: Array(5).fill(""),
  inspectedBy: "",
});

const fieldBase = {
  width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: 6,
  fontSize: 13, color: "#111827", background: "#ffffff", fontFamily: "'Inter',sans-serif",
  boxSizing: "border-box", outline: "none",
};
const selectBase = { ...fieldBase, paddingRight: 26, WebkitAppearance: "none", appearance: "none", cursor: "pointer" };

const TH = ({ children, colSpan, rowSpan, w, bg = "#f1f5f9" }) => (
  <th colSpan={colSpan} rowSpan={rowSpan} style={{
    padding: "9px 8px", fontWeight: 700, fontSize: 10, color: "#374151",
    textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center",
    background: bg, border: "1px solid #d1d5db", whiteSpace: "nowrap", width: w, lineHeight: 1.4,
  }}>{children}</th>
);
const TD = ({ children, style = {} }) => (
  <td style={{ padding: "6px 5px", border: "1px solid #e5e7eb", verticalAlign: "middle", ...style }}>{children}</td>
);
const SelectField = ({ value, onChange, options, placeholder, disabled }) => (
  <div style={{ position: "relative", width: "100%" }}>
    <select value={value} onChange={onChange} disabled={disabled}
      style={{ ...selectBase, color: value ? "#111827" : "#9ca3af", opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "pointer" }}>
      <option value="">{placeholder || "Select..."}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
    <IoIosArrowDown style={{ position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)", color: "#6b7280", fontSize: 12, pointerEvents: "none" }} />
  </div>
);

const LBL = { fontSize: 11, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5, display: "block" };

const initialState = () => ({
  date: formattedDate,
  rows: [],
  card: emptyCard(),
  remark: "",
});

export default function ReworkRepair() {
  const [date, setDate] = useState(formattedDate);
  const [rows, setRows] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [card, setCard] = useState(emptyCard());
  const [remark, setRemark] = useState("");
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check(); window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleAddRow = () => {
    const { partDesc, partNo, spec, nonConformance, reworkQty } = card;
    if (partDesc && partNo && spec && nonConformance && reworkQty !== "") {
      setRows(prev => [...prev, makeRow(card)]);
      setCard(emptyCard());
    }
  };

  const handleQtyKeyDown = (e) => { if (e.key === "Enter") handleAddRow(); };

  const updateCard = (field, val) => {
    setCard(prev => {
      const next = { ...prev, [field]: val };
      if (field === "partDesc") next.partNo = "";
      return next;
    });
  };

  const updateRow = (i, field, val) => setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));

  const updateObs = (i, j, val) => setRows(prev => prev.map((r, idx) => {
    if (idx !== i) return r;
    const o = [...r.observations]; o[j] = val; return { ...r, observations: o };
  }));

  const addObservation = (i) => setRows(prev => prev.map((r, idx) =>
    idx === i ? { ...r, observations: [...r.observations, ""] } : r
  ));

  const toggleStatus = (i, type) => setRows(prev => prev.map((r, idx) => idx === i ? { ...r, okStatus: r.okStatus === type ? null : type } : r));
  const removeRow = i => setRows(prev => prev.filter((_, idx) => idx !== i));

  // ── SAVE handler
  const handleSave = () => {
    const savedAt = new Date().toLocaleString();

    console.group("╔══════════════════════════════════════════════════");
    console.log("║  ✂️  REWORK / REPAIR REPORT — SAVED");
    console.log("║  Form No: AOT/F/QA/20  |  Saved At:", savedAt);
    console.log("║  Date:", date);
    console.groupEnd();

    console.group("🔧 REWORK ROWS (" + rows.length + " rows)");
    const tableData = rows.map((r, i) => ({
      "SR."             : i + 1,
      "Part Name"       : r.partDesc       || "—",
      "Part No."        : r.partNo         || "—",
      "Spec."           : r.spec           || "—",
      "Non Conformance" : r.nonConformance || "—",
      "Rework Qty"      : r.reworkQty      !== "" ? r.reworkQty : "—",
      "Result"          : r.okStatus === "ok" ? "✅ OK" : r.okStatus === "notok" ? "❌ NOT OK" : "⬜ Pending",
      "Inspected By"    : r.inspectedBy    || "—",
      ...r.observations.reduce((acc, v, j) => ({ ...acc, [`Obs ${j+1}`]: v || "—" }), {}),
    }));
    console.table(tableData);
    console.groupEnd();

    const okCount     = rows.filter(r => r.okStatus === "ok").length;
    const notOkCount  = rows.filter(r => r.okStatus === "notok").length;
    const totalQty    = rows.reduce((sum, r) => sum + (parseFloat(r.reworkQty) || 0), 0);
    console.group("📊 SUMMARY");
    console.log("  ✅ OK         :", okCount);
    console.log("  ❌ NOT OK     :", notOkCount);
    console.log("  ⬜ Pending    :", rows.length - okCount - notOkCount);
    console.log("  📦 Total Qty  :", totalQty);
    if (remark) console.log("  📝 Remark     :", remark);
    console.groupEnd();

    setSaveMsg("✓ Saved & Reset!");
    setRows([]);
    setCard(emptyCard());
    setRemark("");
    setDate(formattedDate);
    setTimeout(() => setSaveMsg(""), 2500);
  };

  // ── RESET handler
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all data?")) {
      setDate(formattedDate);
      setRows([]);
      setCard(emptyCard());
      setRemark("");
      setSaveMsg("");
    }
  };

  const cardPartNos = getPartNos(card.partDesc);
  const maxObs = rows.length > 0 ? Math.max(...rows.map(r => r.observations.length)) : 5;

  const obsCellStyle = {
    padding: "4px 2px",
    border: "1px solid #e5e7eb",
    verticalAlign: "middle",
  };

  const obsInputStyle = {
    width: "100%",
    minWidth: 32,
    padding: "6px 2px",
    border: "1px solid #d1d5db",
    borderRadius: 5,
    textAlign: "center",
    fontSize: 12,
    color: "#111827",
    background: "#fff",
    fontFamily: "'Inter',sans-serif",
    outline: "none",
    boxSizing: "border-box",
    display: "block",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", fontFamily: "'Inter',sans-serif", padding: isMobile ? "10px 6px" : "20px 16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <style>{`
        * { box-sizing: border-box; }
        select option { background: #fff !important; color: #111827 !important; }
        select:focus, input:focus { outline: none !important; border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.15) !important; }
        .sbtn { transition: all 0.14s ease; }
        .sbtn:hover { opacity: 0.82; transform: scale(1.06); }
        .sbtn:active { transform: scale(0.96); }
        .del-btn:hover { background: #fef2f2 !important; border-color: #fca5a5 !important; color: #dc2626 !important; }
        .add-obs-btn { transition: all 0.15s ease; }
        .add-obs-btn:hover { background: #dbeafe !important; border-color: #3b82f6 !important; transform: scale(1.12); }
        .add-obs-btn:active { transform: scale(0.93); }
        @keyframes slideIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes popIn { from { opacity:0; transform:scale(0.6); } to { opacity:1; transform:scale(1); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
        .new-row { animation: slideIn 0.25s ease; }
        .obs-pop { animation: popIn 0.18s ease; }
        .save-toast { animation: fadeIn 0.25s ease; }
        
        .rework-table { border-collapse: collapse; width: 100%; table-layout: fixed; }
        .rework-table .col-sr    { width: 38px; }
        .rework-table .col-part  { width: 190px; }
        .rework-table .col-spec  { width: 130px; }
        .rework-table .col-nc    { width: 148px; }
        .rework-table .col-ok    { width: 58px; }
        .rework-table .col-notok { width: 58px; }
        .rework-table .col-plus  { width: 38px; }
        .rework-table .col-insp  { width: 104px; }
        .rework-table .col-del   { width: 32px; }

        .save-btn {
          height: 38px;
          padding: 0 22px;
          border-radius: 8px;
          background: #2563eb;
          color: #fff;
          border: none;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.15s, transform 0.12s, box-shadow 0.15s;
          box-shadow: 0 2px 8px rgba(37,99,235,0.18);
          white-space: nowrap;
        }
        .save-btn:hover { background: #1d4ed8; box-shadow: 0 4px 14px rgba(37,99,235,0.28); transform: translateY(-1px); }
        .save-btn:active { background: #1e40af; transform: scale(0.97); box-shadow: none; }

        .reset-btn {
          height: 38px;
          padding: 0 18px;
          border-radius: 8px;
          background: #f1f5f9;
          color: #374151;
          border: 1.5px solid #d1d5db;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.12s;
          white-space: nowrap;
        }
        .reset-btn:hover { background: #fee2e2; border-color: #fca5a5; color: #dc2626; transform: translateY(-1px); }
        .reset-btn:active { transform: scale(0.97); }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* HEADER CARD */}
      <div style={{ width: "100%", maxWidth: 1400, background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #e2e8f0", marginBottom: 14, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, padding: isMobile ? "12px" : "12px 22px", borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => window.history.back()} style={{ width: 34, height: 34, borderRadius: 8, background: "#f1f5f9", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <span style={{ fontSize: 16, color: "#374151", fontWeight: 700 }}>←</span>
            </button>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FiScissors color="#2563eb" size={16} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: isMobile ? 14 : 16, color: "#111827" }}>Rework / Repair Report</div>
              <div style={{ fontSize: 10, color: "#6b7280" }}>Form No: AOT/F/QA/20 · Rev: 00 · Resp: Rework Operator</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#374151", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.04em" }}>DATE :-</span>
            <input value={date} onChange={e => setDate(e.target.value)} style={{ ...fieldBase, width: 118, fontWeight: 600 }} />
          </div>
        </div>

        {/* Quick-add form */}
        <div style={{ padding: isMobile ? "14px" : "18px 22px" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1.3fr 1.6fr 1.6fr 0.75fr auto", gap: 14, alignItems: "end" }}>
            <div>
              <label style={LBL}>Part Name :-</label>
              <SelectField value={card.partDesc} onChange={e => updateCard("partDesc", e.target.value)} options={PARTS_DATA.map(p => p.desc)} placeholder="Select Part Name..." />
            </div>
            <div>
              <label style={LBL}>Part No. :-</label>
              <SelectField value={card.partNo} onChange={e => updateCard("partNo", e.target.value)} options={cardPartNos} placeholder={card.partDesc ? "Select Part No..." : "Select Part first..."} disabled={!card.partDesc} />
            </div>
            <div>
              <label style={LBL}>Spec. :-</label>
              <SelectField value={card.spec} onChange={e => updateCard("spec", e.target.value)} options={SPECS} placeholder="Select Spec..." />
            </div>
            <div>
              <label style={LBL}>Details of Non Conformance :-</label>
              <SelectField value={card.nonConformance} onChange={e => updateCard("nonConformance", e.target.value)} options={NON_CONFORMANCE_OPTIONS} placeholder="Select..." />
            </div>
            <div>
              <label style={LBL}>Rework Qty. :-</label>
              <input value={card.reworkQty} onChange={e => updateCard("reworkQty", e.target.value)} onKeyDown={handleQtyKeyDown} type="number" min="0" placeholder="0"
                style={{ ...fieldBase, textAlign: "center", fontWeight: card.reworkQty !== "" ? 600 : 400 }} />
            </div>
            <div>
              <label style={{ ...LBL, opacity: 0 }}>Add</label>
              <button
                onClick={handleAddRow}
                disabled={!(card.partDesc && card.partNo && card.spec && card.nonConformance && card.reworkQty !== "")}
                style={{
                  height: 38, paddingLeft: 18, paddingRight: 18, borderRadius: 8,
                  background: (card.partDesc && card.partNo && card.spec && card.nonConformance && card.reworkQty !== "") ? "#2563eb" : "#e5e7eb",
                  color: (card.partDesc && card.partNo && card.spec && card.nonConformance && card.reworkQty !== "") ? "#fff" : "#9ca3af",
                  border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer",
                  fontFamily: "'Inter',sans-serif", whiteSpace: "nowrap", transition: "all 0.15s",
                }}
              >+ Add Row</button>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      {rows.length > 0 && (
        <div style={{ width: "100%", maxWidth: 1400, background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <div style={{ padding: isMobile ? "12px" : "16px 20px" }}>
            <div style={{ marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>📋 Rework Inspection Parameters</span>
              <span style={{ fontSize: 11, fontWeight: 600, background: "#f1f5f9", color: "#374151", padding: "3px 10px", borderRadius: 20, border: "1px solid #e2e8f0" }}>{rows.length} Rows</span>
            </div>

            {/* DESKTOP TABLE */}
            {!isMobile && (
              <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid #d1d5db" }}>
                <table className="rework-table">
                  <colgroup>
                    <col className="col-sr" />
                    <col className="col-part" />
                    <col className="col-spec" />
                    <col className="col-nc" />
                    <col className="col-ok" />
                    <col className="col-notok" />
                    {Array(maxObs).fill(null).map((_, n) => <col key={n} />)}
                    <col className="col-plus" />
                    <col className="col-insp" />
                    <col className="col-del" />
                  </colgroup>
                  <thead>
                    <tr>
                      <TH rowSpan={2}>SR.<br />NO.</TH>
                      <TH rowSpan={2}>PART NAME /<br />PART NO.</TH>
                      <TH rowSpan={2}>SPEC.</TH>
                      <TH rowSpan={2}>DETAILS OF NON<br />CONFORMANCE</TH>
                      <th colSpan={2} style={{ padding: "9px 8px", fontWeight: 700, fontSize: 10, color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center", background: "#f1f5f9", border: "1px solid #d1d5db" }}>RESULT</th>
                      <th
                        colSpan={maxObs + 1}
                        style={{ padding: "9px 12px", fontWeight: 700, fontSize: 10, color: "#374151", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center", background: "#f1f5f9", border: "1px solid #d1d5db" }}
                      >
                        OBSERVATIONS AFTER REWORK
                      </th>
                      <TH rowSpan={2}>INSPECTED<br />BY</TH>
                      <TH rowSpan={2}></TH>
                    </tr>
                    <tr>
                      <th style={{ padding: "7px 4px", fontWeight: 700, fontSize: 10, color: "#166534", textAlign: "center", background: "#f0fdf4", border: "1px solid #d1d5db" }}>✓ OK</th>
                      <th style={{ padding: "7px 4px", fontWeight: 700, fontSize: 10, color: "#991b1b", textAlign: "center", background: "#fff5f5", border: "1px solid #d1d5db" }}>✕ NOT OK</th>
                      {Array(maxObs).fill(null).map((_, n) => (
                        <th key={n} style={{ padding: "7px 2px", fontWeight: 600, fontSize: 11, color: "#374151", textAlign: "center", background: "#f8fafc", border: "1px solid #d1d5db" }}>{n + 1}</th>
                      ))}
                      <th style={{ padding: "7px 2px", background: "#f0f7ff", border: "1px solid #d1d5db" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => {
                      const isOk = row.okStatus === "ok";
                      const isNotOk = row.okStatus === "notok";
                      return (
                        <tr key={row.id} className="new-row" style={{ background: i % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                          <TD style={{ textAlign: "center" }}><span style={{ fontWeight: 700, fontSize: 12, color: "#374151" }}>{i + 1}</span></TD>
                          <TD>
                            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", padding: "4px 6px", background: "#f1f5f9", borderRadius: 5, border: "1px solid #e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.partDesc}</div>
                              <div style={{ fontSize: 11, color: "#4b5563", padding: "3px 6px", background: "#f9fafb", borderRadius: 5, border: "1px solid #e2e8f0" }}>{row.partNo}</div>
                            </div>
                          </TD>
                          <TD><div style={{ fontSize: 12, fontWeight: 500, color: "#111827", padding: "5px 6px", background: "#f1f5f9", borderRadius: 5, border: "1px solid #e2e8f0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.spec}</div></TD>
                          <TD><div style={{ fontSize: 12, fontWeight: 500, color: "#92400e", padding: "5px 6px", background: "#fef9f0", borderRadius: 5, border: "1px solid #fde68a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.nonConformance}</div></TD>
                          <TD style={{ background: isOk ? "#f0fdf4" : "inherit", textAlign: "center" }}>
                            <button className="sbtn" onClick={() => toggleStatus(i, "ok")} style={{ width: 36, height: 36, borderRadius: 8, border: isOk ? "2px solid #16a34a" : "1.5px solid #d1fae5", background: isOk ? "#dcfce7" : "#fff", color: isOk ? "#16a34a" : "#bbf7d0", fontSize: 18, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", boxShadow: isOk ? "0 2px 8px rgba(22,163,74,0.18)" : "none" }}>✓</button>
                          </TD>
                          <TD style={{ background: isNotOk ? "#fff5f5" : "inherit", textAlign: "center" }}>
                            <button className="sbtn" onClick={() => toggleStatus(i, "notok")} style={{ width: 36, height: 36, borderRadius: 8, border: isNotOk ? "2px solid #dc2626" : "1.5px solid #fecaca", background: isNotOk ? "#fee2e2" : "#fff", color: isNotOk ? "#dc2626" : "#fecaca", fontSize: 14, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", boxShadow: isNotOk ? "0 2px 8px rgba(220,38,38,0.18)" : "none" }}>✕</button>
                          </TD>
                          {row.observations.map((v, j) => (
                            <td key={j} style={obsCellStyle}>
                              <input
                                className={j === row.observations.length - 1 && j >= 5 ? "obs-pop" : ""}
                                value={v}
                                onChange={e => updateObs(i, j, e.target.value)}
                                style={{ ...obsInputStyle, fontWeight: v ? 600 : 400 }}
                              />
                            </td>
                          ))}
                          {Array(maxObs - row.observations.length).fill(null).map((_, k) => (
                            <td key={`empty-${k}`} style={{ ...obsCellStyle, background: i % 2 === 0 ? "#f9fafb" : "#f1f5f9" }} />
                          ))}
                          <td style={{ padding: "4px 4px", border: "1px solid #e5e7eb", background: "#f0f7ff", textAlign: "center", verticalAlign: "middle" }}>
                            <button
                              className="add-obs-btn"
                              onClick={() => addObservation(i)}
                              title="Add observation"
                              style={{ width: 24, height: 24, borderRadius: 6, border: "1.5px dashed #93c5fd", background: "#eff6ff", color: "#2563eb", cursor: "pointer", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}
                            >+</button>
                          </td>
                          <TD>
                            <input value={row.inspectedBy || ""} onChange={e => updateRow(i, "inspectedBy", e.target.value)} placeholder="Name..." style={{ ...fieldBase, fontSize: 11, padding: "5px 6px" }} />
                          </TD>
                          <TD style={{ textAlign: "center" }}>
                            <button className="del-btn" onClick={() => removeRow(i)} style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid #e5e7eb", background: "#f9fafb", color: "#9ca3af", cursor: "pointer", fontWeight: 700, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>✕</button>
                          </TD>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* MOBILE CARDS */}
            {isMobile && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {rows.map((row, i) => {
                  const isOk = row.okStatus === "ok";
                  const isNotOk = row.okStatus === "notok";
                  return (
                    <div key={row.id} className="new-row" style={{ border: "1px solid #e5e7eb", borderRadius: 10, background: "#fff", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", background: "#f8fafc", borderBottom: "1px solid #e5e7eb" }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: "#374151" }}>#{i + 1}</span>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          {isOk && <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20, background: "#16a34a", color: "#fff" }}>✓ OK</span>}
                          {isNotOk && <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20, background: "#dc2626", color: "#fff" }}>✕ NOT OK</span>}
                          <button className="del-btn" onClick={() => removeRow(i)} style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid #e5e7eb", background: "#f9fafb", color: "#9ca3af", cursor: "pointer", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                        </div>
                      </div>
                      <div style={{ padding: "12px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                          <div><label style={LBL}>Part Name</label><div style={{ fontSize: 12, fontWeight: 600, padding: "4px 7px", background: "#f1f5f9", borderRadius: 5, border: "1px solid #e2e8f0" }}>{row.partDesc}</div></div>
                          <div><label style={LBL}>Part No.</label><div style={{ fontSize: 12, padding: "4px 7px", background: "#f9fafb", borderRadius: 5, border: "1px solid #e2e8f0" }}>{row.partNo}</div></div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                          <div><label style={LBL}>Spec.</label><div style={{ fontSize: 12, padding: "4px 7px", background: "#f1f5f9", borderRadius: 5, border: "1px solid #e2e8f0" }}>{row.spec}</div></div>
                          <div><label style={LBL}>Non Conformance</label><div style={{ fontSize: 12, color: "#92400e", padding: "4px 7px", background: "#fef9f0", borderRadius: 5, border: "1px solid #fde68a" }}>{row.nonConformance}</div></div>
                        </div>
                        <div style={{ marginBottom: 10 }}><label style={LBL}>Rework Qty.</label><span style={{ fontWeight: 700, fontSize: 15, color: "#1d4ed8" }}>{row.reworkQty}</span></div>
                        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <label style={{ ...LBL, textAlign: "center" }}>OK</label>
                            <button className="sbtn" onClick={() => toggleStatus(i, "ok")} style={{ width: 46, height: 40, borderRadius: 8, border: isOk ? "2px solid #16a34a" : "1.5px solid #bbf7d0", background: isOk ? "#16a34a" : "#fff", color: isOk ? "#fff" : "#16a34a", fontSize: 22, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✓</button>
                          </div>
                          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <label style={{ ...LBL, textAlign: "center" }}>NOT OK</label>
                            <button className="sbtn" onClick={() => toggleStatus(i, "notok")} style={{ width: 46, height: 40, borderRadius: 8, border: isNotOk ? "2px solid #dc2626" : "1.5px solid #fecaca", background: isNotOk ? "#dc2626" : "#fff", color: isNotOk ? "#fff" : "#dc2626", fontSize: 20, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                          </div>
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                            <label style={{ ...LBL, marginBottom: 0 }}>Observations After Rework</label>
                            <button
                              className="add-obs-btn"
                              onClick={() => addObservation(i)}
                              style={{ width: 28, height: 28, borderRadius: 6, border: "1.5px dashed #93c5fd", background: "#eff6ff", color: "#2563eb", cursor: "pointer", fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}
                            >+</button>
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {row.observations.map((v, j) => (
                              <div key={j} className={j === row.observations.length - 1 && j >= 5 ? "obs-pop" : ""} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                                <span style={{ fontSize: 9, fontWeight: 700, color: "#9ca3af" }}>{j + 1}</span>
                                <input value={v} onChange={e => updateObs(i, j, e.target.value)}
                                  style={{ width: 44, padding: "6px 2px", border: "1px solid #d1d5db", borderRadius: 5, textAlign: "center", fontSize: 12, fontWeight: v ? 600 : 400, color: "#111827", background: "#fff", fontFamily: "'Inter',sans-serif", outline: "none", boxSizing: "border-box" }}
                                  placeholder="-" />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div style={{ marginTop: 10 }}>
                          <label style={LBL}>Inspected By</label>
                          <input value={row.inspectedBy || ""} onChange={e => updateRow(i, "inspectedBy", e.target.value)} placeholder="Name..." style={{ ...fieldBase, fontSize: 12 }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* REMARK BOX */}
            <div style={{ marginTop: 16, padding: "14px 16px", background: "#f8faff", borderRadius: 8, border: "1px solid #e2e8f0" }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#111827", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6, display: "block" }}>Remark :-</label>
              <textarea value={remark} onChange={e => setRemark(e.target.value)} placeholder="Write remark here..." rows={3}
                style={{ width: "100%", padding: "9px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, color: "#111827", background: "#fff", fontFamily: "'Inter',sans-serif", boxSizing: "border-box", outline: "none", resize: "vertical", lineHeight: 1.6 }} />
            </div>

            {/* ── Bottom Save & Reset (inside table section) ── */}
            <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              {saveMsg && (
                <span className="save-toast" style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "5px 12px" }}>
                  {saveMsg}
                </span>
              )}
              <button className="reset-btn" onClick={handleReset}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5.635 15A8 8 0 1118.364 9" /></svg>
                Reset
              </button>
              <button className="save-btn" onClick={handleSave}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 3H7a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2z" /></svg>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}