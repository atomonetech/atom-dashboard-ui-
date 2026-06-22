import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // 🔥 IMPORT useParams
import axios from "axios";
import {
  ArrowLeft,
  ClipboardList,
  Plus,
  Trash2,
  RotateCcw,
  Send,
  Loader2,
  FileText,
  UserCheck,
  PenTool,
  Hash,
  Check, 
} from "lucide-react";

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const API_LOG = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/log-report/`;

/* ─── design tokens (matches red-white theme) ────────────────── */
const C = {
  pageBg:      "#f5f5f0",
  white:       "#ffffff",
  red:         "#b91c1c",
  redLight:    "#fef2f2",
  redBorder:   "#fca5a5",
  redDark:     "#991b1b",
  border:      "#e2e2de",
  borderFoc:   "#b91c1c",
  text:        "#1a1a1a",
  textMid:     "#6b7280",
  textLight:   "#9ca3af",
  inputBg:     "#ffffff",
  inputHov:    "#fafaf8",
  rowHead:     "#fafaf8",
  rowBorder:   "#e8e4de",
  green:       "#16a34a",
  greenLight:  "#f0fdf4",
  greenBorder: "#86efac",
  shadow:      "0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.04)",
};

/* ─── shared input base ──────────────────────────────────────── */
const inputBase = {
  width: "100%",
  padding: "10px 13px",
  fontSize: 13,
  background: C.inputBg,
  color: C.text,
  border: `1.5px solid ${C.border}`,
  borderRadius: 6,
  outline: "none",
  fontFamily: "inherit",
  appearance: "none",
  transition: "border-color .15s, box-shadow .15s",
};

const focusHandlers = (overrideBorder, overrideBg) => ({
  onFocus: e => {
    e.target.style.borderColor = overrideBorder || C.borderFoc;
    e.target.style.boxShadow   = `0 0 0 3px ${overrideBorder === C.green ? "rgba(22,163,74,.1)" : "rgba(185,28,28,.1)"}`;
    if (overrideBg) e.target.style.background = overrideBg;
  },
  onBlur: e => {
    e.target.style.borderColor = overrideBorder || C.border;
    e.target.style.boxShadow   = "none";
    if (overrideBg) e.target.style.background = overrideBg;
  },
});

const SI = ({ style = {}, readOnly, focBorder, focBg, ...props }) => (
  <input
    readOnly={readOnly}
    style={{
      ...inputBase,
      ...(readOnly ? { background: "#f9f9f7", color: C.textMid, cursor: "not-allowed" } : {}),
      ...style,
    }}
    {...(readOnly ? {} : focusHandlers(focBorder, focBg))}
    {...props}
  />
);

const SS = ({ disabled, style = {}, focBorder, children, ...props }) => (
  <select
    disabled={disabled}
    style={{
      ...inputBase,
      background:    disabled ? "#f9f9f7" : C.inputBg,
      color:         disabled ? C.textLight : C.text,
      cursor:        disabled ? "not-allowed" : "pointer",
      borderColor:   disabled ? C.border : C.border,
      ...style,
    }}
    {...(disabled ? {} : focusHandlers(focBorder))}
    {...props}
  >
    {children}
  </select>
);

/* ─── small label ────────────────────────────────────────────── */
const FL = ({ icon: Icon, children, iconColor = C.red }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
    {Icon && <Icon size={11} color={iconColor} strokeWidth={2.5} />}
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".11em", textTransform: "uppercase", color: C.textMid }}>
      {children}
    </span>
  </div>
);

/* ─── section heading inside a row card ─────────────────────── */
const SecHead = ({ n, label }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 8,
    borderBottom: `1px solid ${C.border}`,
    paddingBottom: 8, marginBottom: 14,
  }}>
    <span style={{
      fontSize: 9, fontWeight: 700, letterSpacing: ".1em",
      background: C.redLight, color: C.red,
      border: `1px solid ${C.redBorder}`,
      padding: "2px 7px", borderRadius: 3,
    }}>{n}</span>
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: C.text }}>
      {label}
    </span>
  </div>
);

/* ─── empty row template ─────────────────────────────────────── */
const EMPTY_ROW = {
  date: "", customer: "", partNameNo: "", typeOfChange: "", changeDetail: "",
  retroTotalQty: "", retroOkQty: "", retroRejQty: "",
  statusAfterFinal: "", actionForNG: "",
  supSignature: "", signProdHead: "", signQAHead: "", remarks: "",
};

/* ─── main component ─────────────────────────────────────────── */
const FourMSummarySheet = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // 🔥 GET ID FROM URL

  const [rows, setRows]               = useState([{ id: 1, ...EMPTY_ROW }]);
  const [preparedBy, setPreparedBy]   = useState("");
  const [approvedBy, setApprovedBy]   = useState("");
  const [isLoading, setIsLoading]     = useState(false);
  const [customersData, setCustomersData] = useState([]);
  const [partsCache, setPartsCache]   = useState({});

  // 🔥 FETCH REPORT DATA IF ID EXISTS (VIEW/APPROVE MODE)
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      // 🔥 FIX: Correct API endpoint URL
      axios.get(`${BASE_URL}/api/get-single-report/four-m-summary/${id}/`)
        .then(res => {
          if (res.data.success) {
            const d = res.data.data;
            setRows([{
              id: 1,
              date: d.date || "",
              customer: d.customer || "",
              partNameNo: d.part_name_no || "",
              typeOfChange: d.type_of_change || "",
              changeDetail: d.change_detail || "",
              retroTotalQty: d.retro_total_qty ?? "",
              retroOkQty: d.retro_ok_qty ?? "",
              retroRejQty: d.retro_rej_qty ?? "",
              statusAfterFinal: d.status_after_final || "",
              actionForNG: d.action_for_ng || "",
              supSignature: d.sup_signature || "",
              signProdHead: d.sign_prod_head || "",
              signQAHead: d.sign_qa_head || "",
              remarks: d.remarks || ""
            }]);
            
            setPreparedBy(d.submitted_by || d.prepared_by || "");
            setApprovedBy(d.approved_by || "");
            
            // 🔥 Inject partNameNo into partsCache so dropdown shows it in view mode
            if (d.customer && d.part_name_no) {
              setPartsCache(prev => ({
                ...prev,
                [d.customer]: [{ part_name: d.part_name_no, part_no: "" }]
              }));
            }
          }
        })
        .catch(err => console.error("Error fetching single report:", err))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/master-dropdown/?filter=customer`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => {
        let list = [];
        if (Array.isArray(data)) {
          list = data.map(i =>
            typeof i === "string" ? i :
            i.customer_name ? i.customer_name :
            Array.isArray(i) ? i[0] :
            i.customer || String(i)
          );
        } else if (data && typeof data === "object") {
          const arr = data.data || data.customers || data.results || [];
          list = arr.map(i => typeof i === "object" ? (i.customer_name || i.customer || i[0]) : i);
        }
        setCustomersData([...new Set(list)].filter(Boolean));
      })
      .catch(() => setCustomersData(["MARUTI", "TATA", "FIG"]));
  }, []);

  const handleAddRow = () => {
    if (id) return; // Prevent in view mode
    const nextId = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;
    setRows(prev => [...prev, { id: nextId, ...EMPTY_ROW }]);
  };

  const handleDeleteRow = rowId => {
    if (id) return; // Prevent in view mode
    if (rows.length === 1) return;
    setRows(prev => prev.filter(r => r.id !== rowId));
  };

  const handleChange = (rowId, field, value) => {
    if (id) return; // Prevent in view mode
    setRows(prev => prev.map(r => r.id === rowId ? { ...r, [field]: value } : r));
  };

  const handleCustomerChange = async (rowId, customerName) => {
    if (id) return; // Prevent in view mode
    handleChange(rowId, "customer", customerName);
    handleChange(rowId, "partNameNo", "");
    if (!customerName) return;
    if (!partsCache[customerName]) {
      try {
        const res  = await fetch(`${BASE_URL}/api/master-dropdown/?filter=part&cust=${encodeURIComponent(customerName)}`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        const formatted = Array.isArray(data) ? data.map(item => {
          if (typeof item === "object" && item !== null) {
            const name = item.part_name || item.name || item.part || item[0] || "Unknown";
            const no   = item.part_number || item.part_no || item.number || item[1] || "";
            return { part_name: name, part_no: no };
          }
          return { part_name: item, part_no: "" };
        }) : [];
        setPartsCache(prev => ({ ...prev, [customerName]: formatted }));
      } catch (err) { console.error(`Error fetching parts for ${customerName}:`, err); }
    }
  };

  const handleReset = () => { 
    if (id) return;
    setRows([{ id: 1, ...EMPTY_ROW }]); 
    setPreparedBy(""); 
    setApprovedBy(""); 
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (id) return; // Disallow save if in view mode

    const filled = rows.filter(r => r.partNameNo || r.date || r.changeDetail);
    if (!filled.length) { alert("Please fill at least one entry before submitting."); return; }
    
    const payload = {
      prepared_by: preparedBy, approved_by: approvedBy,
      entries: filled.map((r, i) => ({
        s_no: i + 1, date: r.date, customer: r.customer,
        part_name_no: r.partNameNo, type_of_change: r.typeOfChange,
        change_detail: r.changeDetail,
        retro_total_qty: r.retroTotalQty ? parseInt(r.retroTotalQty) : null, 
        retro_ok_qty: r.retroOkQty ? parseInt(r.retroOkQty) : null, 
        retro_rej_qty: r.retroRejQty ? parseInt(r.retroRejQty) : null,
        status_after_final: r.statusAfterFinal, action_for_ng: r.actionForNG,
        sup_signature: r.supSignature, sign_prod_head: r.signProdHead,
        sign_qa_head: r.signQAHead, remarks: r.remarks,
      })),
    };

    setIsLoading(true);
    try {
      const response  = await fetch(`${BASE_URL}/api/save-4m-summary/`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.ok && result.success) { 
         const currentUser = localStorage.getItem('username') || 'Unknown User';
        
        try {
          await axios.post(API_LOG, {
            username: currentUser,
            report_name: '4M Summary sheet Form',
            record_id: result.record_id // 🔥 Activity log update
          });
        } catch (logError) {
          console.error('Activity log save karne mein error aayi:', logError);
        }
        alert(result.message || "Saved successfully!"); handleReset(); }
      else alert("Error: " + (result.error || "Check console."));
    } catch (err) { console.error("Network error:", err); alert("Cannot reach server."); }
    finally { setIsLoading(false); }
  };

  /* ── render ── */
  return (
    <div style={{
      minHeight: "100vh", background: C.pageBg,
      padding: "28px 16px", fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* ── back button ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <button
            type="button"
            onClick={() => navigate(-1)} // 🔥 Sends user back safely
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: C.white, border: `1.5px solid ${C.redBorder}`,
              color: C.red, padding: "8px 16px",
              fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase",
              cursor: "pointer", borderRadius: 4, fontFamily: "inherit", transition: "background .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.redLight}
            onMouseLeave={e => e.currentTarget.style.background = C.white}
          >
            <ArrowLeft size={13} /> Back
          </button>
        </div>

        {/* ── main card ── */}
        <form onSubmit={handleSubmit}>
          <div style={{
            background: C.white, borderRadius: 8,
            border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: C.shadow,
          }}>

            {/* ── header ── */}
            <div style={{
              background: C.red, padding: "20px 28px",
              display: "flex", justifyContent: "space-between",
              alignItems: "center", flexWrap: "wrap", gap: 16,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <ClipboardList size={22} color="rgba(255,255,255,.9)" strokeWidth={2} />
                <div>
                  <h1 style={{
                    margin: 0, fontSize: 18, fontWeight: 700,
                    color: "#fff", letterSpacing: ".18em", textTransform: "uppercase",
                  }}>{id ? "4M Summary Sheet (REVIEW)" : "4M Summary Sheet"}</h1>
                </div>
              </div>
            </div>

            {/* ── form body ── */}
            <div style={{ padding: "28px 28px 24px" }}>

              {/* ── row cards ── */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {rows.map((row, idx) => {
                  const rowParts = partsCache[row.customer] || [];
                  return (
                    <div key={row.id} style={{
                      border: `1px solid ${C.rowBorder}`, borderRadius: 8,
                      overflow: "hidden", background: C.white,
                      boxShadow: "0 1px 4px rgba(0,0,0,.04)",
                    }}>

                      {/* row card header */}
                      <div style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        background: C.rowHead, borderBottom: `1px solid ${C.rowBorder}`,
                        padding: "10px 16px",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{
                            width: 26, height: 26, background: C.redLight,
                            border: `1px solid ${C.redBorder}`, borderRadius: 4,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <Hash size={12} color={C.red} strokeWidth={2.5} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: C.text }}>
                            Entry {idx + 1}
                          </span>
                        </div>
                        {!id && (
                          <button
                            type="button"
                            onClick={() => handleDeleteRow(row.id)}
                            disabled={rows.length === 1}
                            style={{
                              display: "inline-flex", alignItems: "center", gap: 5,
                              background: C.white, border: `1.5px solid ${C.redBorder}`,
                              color: C.red, padding: "5px 12px", borderRadius: 4,
                              fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase",
                              cursor: rows.length === 1 ? "not-allowed" : "pointer",
                              opacity: rows.length === 1 ? .3 : 1,
                              fontFamily: "inherit", transition: "background .15s",
                            }}
                            onMouseEnter={e => { if (rows.length > 1) e.currentTarget.style.background = C.redLight; }}
                            onMouseLeave={e => e.currentTarget.style.background = C.white}
                          >
                            <Trash2 size={11} /> Remove
                          </button>
                        )}
                      </div>

                      {/* row card body */}
                      <div style={{ padding: "18px 16px", display: "flex", flexDirection: "column", gap: 22 }}>

                        {/* Section 1: Basic Details */}
                        <div>
                          <SecHead n="1" label="Basic Details" />
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0,1fr))", gap: 14 }}>

                            <div>
                              <FL>Date</FL>
                              <SI type="date" value={row.date} onChange={e => handleChange(row.id, "date", e.target.value)} readOnly={!!id} />
                            </div>

                            <div>
                              <FL>Customer</FL>
                              <SS
                                value={row.customer}
                                onChange={e => handleCustomerChange(row.id, e.target.value)}
                                disabled={!!id}
                              >
                                <option value="">Select Customer</option>
                                {customersData.map((c, i) => <option key={i} value={c}>{c}</option>)}
                                {id && row.customer && !customersData.includes(row.customer) && (
                                   <option value={row.customer}>{row.customer}</option>
                                )}
                              </SS>
                            </div>

                            <div>
                              <FL>Part Name & No.</FL>
                              <SS
                                value={row.partNameNo}
                                onChange={e => handleChange(row.id, "partNameNo", e.target.value)}
                                disabled={!!id || !row.customer}
                              >
                                <option value="">{row.customer ? "Select Part" : "Select Customer First"}</option>
                                {rowParts.map((p, i) => {
                                  const display = p.part_no ? `${p.part_name} (${p.part_no})` : p.part_name;
                                  return <option key={i} value={display}>{display}</option>;
                                })}
                              </SS>
                            </div>

                            <div>
                              <FL>Type of Change</FL>
                              <SI
                                type="text" value={row.typeOfChange}
                                onChange={e => handleChange(row.id, "typeOfChange", e.target.value)}
                                placeholder="Man / Machine / Material"
                                readOnly={!!id}
                              />
                            </div>

                            <div>
                              <FL>Change Detail</FL>
                              <SI
                                type="text" value={row.changeDetail}
                                onChange={e => handleChange(row.id, "changeDetail", e.target.value)}
                                placeholder="Describe change"
                                readOnly={!!id}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Section 2: Inspection & Action */}
                        <div>
                          <SecHead n="2" label="Inspection & Action Status" />
                          <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr 1fr", gap: 14 }}>

                            {/* retro group */}
                            <div style={{
                              border: `1.5px solid ${C.border}`, borderRadius: 6,
                              padding: "12px 14px", background: "#fafaf8",
                            }}>
                              <div style={{
                                fontSize: 9, fontWeight: 700, letterSpacing: ".12em",
                                textTransform: "uppercase", color: C.textMid,
                                borderBottom: `1px solid ${C.border}`,
                                paddingBottom: 6, marginBottom: 12, textAlign: "center",
                              }}>
                                Retroactive Inspection Status
                              </div>
                              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                                {[
                                  { field: "retroTotalQty", label: "Total Qty" },
                                  { field: "retroOkQty",    label: "OK Qty",   green: true },
                                  { field: "retroRejQty",   label: "Rej. Qty", red: true },
                                ].map(({ field, label, green, red }) => (
                                  <div key={field}>
                                    <FL iconColor={green ? C.green : red ? C.red : C.red}>{label}</FL>
                                    <SI
                                      type="number" value={row[field]}
                                      onChange={e => handleChange(row.id, field, e.target.value)}
                                      readOnly={!!id}
                                      focBorder={green ? C.green : undefined}
                                      focBg={green ? C.greenLight : red ? C.redLight : undefined}
                                      style={
                                        green ? { borderColor: C.greenBorder, background: id ? "#f9f9f7" : C.greenLight } :
                                        red   ? { borderColor: C.redBorder,   background: id ? "#f9f9f7" : C.redLight   } : {}
                                      }
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <FL>Status after Final Insp.</FL>
                              <SI
                                type="text" value={row.statusAfterFinal}
                                onChange={e => handleChange(row.id, "statusAfterFinal", e.target.value)}
                                style={{ height: "calc(100% - 22px)" }}
                                readOnly={!!id}
                              />
                            </div>

                            <div>
                              <FL>Action for NG Material</FL>
                              <SI
                                type="text" value={row.actionForNG}
                                onChange={e => handleChange(row.id, "actionForNG", e.target.value)}
                                style={{ height: "calc(100% - 22px)" }}
                                readOnly={!!id}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Section 3: Approvals */}
                        <div>
                          <SecHead n="3" label="Approvals & Remarks" />
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 14 }}>
                            {[
                              { field: "supSignature",  label: "Sup. Signature",     Icon: PenTool   },
                              { field: "signProdHead",  label: "Sign Production Head", Icon: UserCheck  },
                              { field: "signQAHead",    label: "Sign QA Head",         Icon: UserCheck  },
                              { field: "remarks",       label: "Remarks",              Icon: FileText   },
                            ].map(({ field, label, Icon }) => (
                              <div key={field}>
                                <FL icon={Icon}>{label}</FL>
                                <SI
                                  type="text" value={row[field]}
                                  onChange={e => handleChange(row.id, field, e.target.value)}
                                  readOnly={!!id}
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── add row button ── */}
              {!id && (
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
                  <button
                    type="button"
                    onClick={handleAddRow}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 7,
                      background: C.white, border: `1.5px solid ${C.redBorder}`,
                      color: C.red, padding: "9px 18px", borderRadius: 4,
                      fontSize: 12, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase",
                      cursor: "pointer", fontFamily: "inherit", transition: "background .15s",
                      boxShadow: "0 1px 3px rgba(0,0,0,.05)",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = C.redLight}
                    onMouseLeave={e => e.currentTarget.style.background = C.white}
                  >
                    <Plus size={14} /> Add Another Entry
                  </button>
                  <span style={{ fontSize: 12, color: C.textMid, fontWeight: 600 }}>
                    {rows.length} entr{rows.length !== 1 ? "ies" : "y"} added
                  </span>
                </div>
              )}

              {/* ── prepared / approved ── */}
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24,
                borderTop: `1px solid ${C.border}`, marginTop: 28, paddingTop: 24,
              }}>
                {[
                  { label: "Prepared By", value: preparedBy, set: setPreparedBy },
                  { label: "Approved By", value: approvedBy, set: setApprovedBy },
                ].map(({ label, value, set }) => (
                  <div key={label}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: C.textMid, marginBottom: 7 }}>
                      {label}
                    </div>
                    <SI
                      type="text" value={value}
                      onChange={e => set(e.target.value)}
                      placeholder="Name / Signature"
                      readOnly={!!id}
                      style={{ maxWidth: 320 }}
                    />
                  </div>
                ))}
              </div>

              {/* ── form actions ── */}
              <div style={{
                display: "flex", justifyContent: "flex-end", gap: 12, flexWrap: "wrap",
                borderTop: `1px solid ${C.border}`, marginTop: 24, paddingTop: 22,
              }}>
                {id ? (
                  <button
                    type="button"
                    onClick={() => alert("Report Approved Successfully!")}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      background: C.green, border: "none",
                      color: "#fff", padding: "11px 28px", borderRadius: 6,
                      fontSize: 12, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase",
                      cursor: "pointer", fontFamily: "inherit", transition: "background .15s",
                      boxShadow: "0 2px 8px rgba(22,163,74,.35)",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#15803d"}
                    onMouseLeave={e => e.currentTarget.style.background = C.green}
                  >
                    <Check size={14} strokeWidth={2.5} /> APPROVE REPORT
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={isLoading}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        background: C.white, border: `2px solid #d1d5db`,
                        color: "#374151", padding: "11px 24px", borderRadius: 6,
                        fontSize: 12, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        opacity: isLoading ? .5 : 1, fontFamily: "inherit", transition: "all .15s",
                      }}
                      onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.borderColor = "#9ca3af"; } }}
                      onMouseLeave={e => { e.currentTarget.style.background = C.white; e.currentTarget.style.borderColor = "#d1d5db"; }}
                    >
                      <RotateCcw size={14} /> Reset Form
                    </button>

                    <button
                      type="submit"
                      disabled={isLoading}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        background: isLoading ? C.redDark : C.red,
                        border: "none", color: "#fff", padding: "11px 28px", borderRadius: 6,
                        fontSize: 12, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        fontFamily: "inherit", transition: "background .15s",
                        boxShadow: "0 2px 8px rgba(185,28,28,.35)",
                      }}
                      onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = C.redDark; }}
                      onMouseLeave={e => { if (!isLoading) e.currentTarget.style.background = C.red; }}
                    >
                      {isLoading
                        ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Submitting…</>
                        : <><Send size={14} /> Submit Sheet</>
                      }
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default FourMSummarySheet;