import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Package,
  Wrench,
  Layers,
  CheckCircle,
  XCircle,
  Gauge,
  ClipboardList,
  User,
  MessageSquare,
  RotateCcw,
  Send,
  Hash,
  Loader2,
} from "lucide-react";

// Backend URL
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

/* ─── tokens ─────────────────────────────────────────────────── */
const C = {
  pageBg:     "#f5f5f0",
  white:      "#ffffff",
  red:        "#b91c1c",
  redHdr:     "#b91c1c",
  redLight:   "#fef2f2",
  redBorder:  "#fca5a5",
  border:     "#e2e2de",
  borderFoc:  "#b91c1c",
  text:       "#1a1a1a",
  textMid:    "#6b7280",
  textLight:  "#9ca3af",
  inputBg:    "#ffffff",
  inputHov:   "#fafaf8",
  greenLight: "#f0fdf4",
  greenBorder:"#86efac",
  green:      "#16a34a",
};

/* ─── shared input style ─────────────────────────────────────── */
const inputBase = {
  width: "100%",
  padding: "11px 14px",
  fontSize: 14,
  fontWeight: 400,
  background: C.inputBg,
  color: C.text,
  border: `1.5px solid ${C.border}`,
  borderRadius: 6,
  outline: "none",
  fontFamily: "inherit",
  appearance: "none",
  transition: "border-color .15s, box-shadow .15s",
};

const StyledInput = ({ style = {}, readOnly, ...props }) => (
  <input
    readOnly={readOnly}
    style={{
      ...inputBase,
      ...(readOnly ? { background: "#f9f9f7", color: C.textMid, cursor: "not-allowed" } : {}),
      ...style,
    }}
    onFocus={e => {
      if (!readOnly) {
        e.target.style.borderColor = C.borderFoc;
        e.target.style.boxShadow = "0 0 0 3px rgba(185,28,28,.1)";
      }
    }}
    onBlur={e => {
      e.target.style.borderColor = style.borderColor || C.border;
      e.target.style.boxShadow = "none";
    }}
    {...props}
  />
);

const StyledSelect = ({ disabled, style = {}, children, ...props }) => (
  <select
    disabled={disabled}
    style={{
      ...inputBase,
      background: disabled ? "#f9f9f7" : C.inputBg,
      color: disabled ? C.textLight : C.text,
      cursor: disabled ? "not-allowed" : "pointer",
      borderColor: disabled ? C.border : C.border,
      ...style,
    }}
    onFocus={e => {
      if (!disabled) {
        e.target.style.borderColor = C.borderFoc;
        e.target.style.boxShadow = "0 0 0 3px rgba(185,28,28,.1)";
      }
    }}
    onBlur={e => {
      e.target.style.borderColor = C.border;
      e.target.style.boxShadow = "none";
    }}
    {...props}
  >
    {children}
  </select>
);

/* ─── label ──────────────────────────────────────────────────── */
const FieldLabel = ({ icon: Icon, children, iconColor = C.red }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
    {Icon && <Icon size={12} color={iconColor} strokeWidth={2.5} />}
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: ".12em",
      textTransform: "uppercase", color: C.textMid,
    }}>
      {children}
    </span>
  </div>
);

/* ─── section heading ────────────────────────────────────────── */
const SectionHead = ({ icon: Icon, label, color = C.red, borderColor = "#fca5a5" }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 8,
    borderBottom: `2px solid ${borderColor}`,
    paddingBottom: 8, marginBottom: 16,
  }}>
    {Icon && <Icon size={15} color={color} strokeWidth={2.5} />}
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: ".14em",
      textTransform: "uppercase", color: C.text,
    }}>
      {label}
    </span>
  </div>
);

/* ─── main component ─────────────────────────────────────────── */
const For_M_Change_Ins_Form = () => {
  const navigate = useNavigate();

  const now = new Date();
  const formattedDate = `${String(now.getDate()).padStart(2,"0")}.${String(now.getMonth()+1).padStart(2,"0")}.${now.getFullYear()}`;

  const initialFormState = {
    partName: "", partNo: "", operation: "",
    lotQty: "", okQty: "", rejQty: "", paramSpec: "",
    before: ["","","","",""],
    after:  ["","","","",""],
    inspBy: "", remarks: "",
  };

  const [formData, setFormData]           = useState(initialFormState);
  const [isLoading, setIsLoading]         = useState(false);
  const [partsList, setPartsList]         = useState([]);
  const [operationList, setOperationList] = useState([]);
  const [preparedBy, setPreparedBy]       = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}/api/master-dropdown/?filter=all_parts`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data))
          setPartsList(data.map(i => ({ part_name: i[0], part_no: i[1] })));
      })
      .catch(err => console.error("Error fetching parts:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "partName") {
      const sel = partsList.find(p => p.part_name === value);
      setFormData(prev => ({ ...prev, partName: value, partNo: sel?.part_no || "", operation: "" }));
      if (value) {
        fetch(`${BASE_URL}/api/master-dropdown/?filter=operations_by_part&part=${encodeURIComponent(value)}`)
          .then(r => r.json()).then(setOperationList)
          .catch(err => console.error("Error fetching operations:", err));
      } else setOperationList([]);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (section, index, value) =>
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((it, i) => i === index ? value : it),
    }));

  const handleReset = () => { setFormData(initialFormState); setOperationList([]); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.partName || !formData.partNo || !formData.operation) {
      alert("Part Name, Part No, and Operation are required."); return;
    }
    const payload = {
      part_name: formData.partName, part_no: formData.partNo, operation: formData.operation,
      lot_qty:  formData.lotQty  ? parseInt(formData.lotQty)  : null,
      ok_qty:   formData.okQty   ? parseInt(formData.okQty)   : null,
      rej_qty:  formData.rejQty  ? parseInt(formData.rejQty)  : null,
      parameter_specs: formData.paramSpec,
      before_1: formData.before[0], before_2: formData.before[1], before_3: formData.before[2],
      before_4: formData.before[3], before_5: formData.before[4],
      after_1:  formData.after[0],  after_2:  formData.after[1],  after_3:  formData.after[2],
      after_4:  formData.after[3],  after_5:  formData.after[4],
      inspected_by: formData.inspBy, remarks: formData.remarks,
    };
    setIsLoading(true);
    try {
      const res    = await fetch(`${BASE_URL}/api/save-4m-change/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (res.ok && result.success) { alert(result.message || "Saved successfully!"); handleReset(); }
      else { console.error("Backend error:", result); alert("Error: " + (result.error || "Check console.")); }
    } catch (err) {
      console.error("Network error:", err);
      alert("Cannot reach server. Make sure Django is running.");
    } finally { setIsLoading(false); }
  };

  /* ── styles shared across numbered fields ── */
  const numBadgeBase = {
    position: "absolute", top: 0, left: 0, zIndex: 1,
    fontSize: 10, fontWeight: 700,
    padding: "1px 6px",
    borderRadius: "0 0 4px 0",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: C.pageBg,
      padding: "28px 16px",
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    }}>
      <div style={{ maxWidth: 880, margin: "0 auto" }}>

        {/* ── back button ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <button
            type="button"
            onClick={() => navigate("/production-hub")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: C.white,
              border: `1.5px solid ${C.redBorder}`,
              color: C.red,
              padding: "8px 16px",
              fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase",
              cursor: "pointer", borderRadius: 4, fontFamily: "inherit",
              transition: "background .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.redLight}
            onMouseLeave={e => e.currentTarget.style.background = C.white}
          >
            <ArrowLeft size={13} />
            Back to Production Hub
          </button>
        </div>

        {/* ── main card ── */}
        <div style={{
          background: C.white,
          borderRadius: 8,
          border: `1px solid ${C.border}`,
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.04)",
        }}>

          {/* ── header ── */}
          <div style={{
            background: C.redHdr,
            padding: "20px 28px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <ClipboardList size={22} color="rgba(255,255,255,.9)" strokeWidth={2} />
              <h1 style={{
                margin: 0, fontSize: 18, fontWeight: 700,
                color: "#fff", letterSpacing: ".18em", textTransform: "uppercase",
              }}>
                4M Change Inspection Report
              </h1>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "rgba(0,0,0,.2)",
              border: "1px solid rgba(255,255,255,.25)",
              padding: "7px 16px", borderRadius: 4,
            }}>
              <Calendar size={14} color="#fff" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: ".06em" }}>
                {formattedDate}
              </span>
            </div>
          </div>

          {/* ── form body ── */}
          <form onSubmit={handleSubmit}>
            <div style={{ padding: "28px 28px 24px" }}>

              {/* Row 1 — Part Name / Part No */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <div>
                  <FieldLabel icon={Package}>Part Name <span style={{ color: C.red }}>*</span></FieldLabel>
                  <StyledSelect name="partName" value={formData.partName} onChange={handleChange}>
                    <option value="">Select Part Name</option>
                    {partsList.map((p, i) => <option key={i} value={p.part_name}>{p.part_name}</option>)}
                  </StyledSelect>
                </div>
                <div>
                  <FieldLabel icon={Hash}>Part No. <span style={{ color: C.red }}>*</span></FieldLabel>
                  <StyledInput
                    type="text" name="partNo" value={formData.partNo}
                    readOnly placeholder="Auto-filled part number"
                  />
                </div>
              </div>

              {/* Row 2 — Operation */}
              <div style={{ marginBottom: 24 }}>
                <FieldLabel icon={Wrench}>Operation <span style={{ color: C.red }}>*</span></FieldLabel>
                <StyledSelect
                  name="operation" value={formData.operation}
                  onChange={handleChange} disabled={!formData.partName}
                >
                  <option value="">Select Operation</option>
                  {operationList.map((op, i) => <option key={i} value={op}>{op}</option>)}
                </StyledSelect>
              </div>

              {/* Row 3 — Quantities */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 16, marginBottom: 28 }}>
                <div>
                  <FieldLabel icon={Layers}>Lot Qty</FieldLabel>
                  <StyledInput type="number" name="lotQty" value={formData.lotQty} onChange={handleChange} placeholder="e.g. 100" />
                </div>
                <div>
                  <FieldLabel icon={CheckCircle} iconColor={C.green}>OK Qty</FieldLabel>
                  <StyledInput
                    type="number" name="okQty" value={formData.okQty} onChange={handleChange} placeholder="e.g. 95"
                    style={{ borderColor: C.greenBorder, background: C.greenLight }}
                    onFocus={e => { e.target.style.borderColor = C.green; e.target.style.boxShadow = "0 0 0 3px rgba(22,163,74,.1)"; }}
                    onBlur={e => { e.target.style.borderColor = C.greenBorder; e.target.style.boxShadow = "none"; }}
                  />
                </div>
                <div>
                  <FieldLabel icon={XCircle}>Rej. Qty</FieldLabel>
                  <StyledInput
                    type="number" name="rejQty" value={formData.rejQty} onChange={handleChange} placeholder="e.g. 5"
                    style={{ borderColor: C.redBorder, background: C.redLight }}
                    onFocus={e => { e.target.style.borderColor = C.red; e.target.style.boxShadow = "0 0 0 3px rgba(185,28,28,.1)"; }}
                    onBlur={e => { e.target.style.borderColor = C.redBorder; e.target.style.boxShadow = "none"; }}
                  />
                </div>
                <div>
                  <FieldLabel icon={Gauge}>Parameter / Specs</FieldLabel>
                  <StyledInput type="text" name="paramSpec" value={formData.paramSpec} onChange={handleChange} placeholder="Enter specs" />
                </div>
              </div>

              {/* Row 4 — Before */}
              <SectionHead icon={Layers} label="Before (Retroactive)" color={C.red} borderColor={C.redBorder} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0,1fr))", gap: 12, marginBottom: 28 }}>
                {[0,1,2,3,4].map(i => (
                  <div key={i} style={{ position: "relative", paddingTop: 10 }}>
                    <span style={{
                      ...numBadgeBase,
                      background: C.redLight, color: C.red,
                      border: `1px solid ${C.redBorder}`,
                    }}>
                      {i + 1}
                    </span>
                    <StyledInput
                      type="text"
                      value={formData.before[i]}
                      onChange={e => handleArrayChange("before", i, e.target.value)}
                      placeholder={`Value ${i + 1}`}
                    />
                  </div>
                ))}
              </div>

              {/* Row 5 — After */}
              <SectionHead icon={CheckCircle} label="After / Setup Approval" color={C.green} borderColor={C.greenBorder} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0,1fr))", gap: 12, marginBottom: 28 }}>
                {[0,1,2,3,4].map(i => (
                  <div key={i} style={{ position: "relative", paddingTop: 10 }}>
                    <span style={{
                      ...numBadgeBase,
                      background: C.greenLight, color: C.green,
                      border: `1px solid ${C.greenBorder}`,
                    }}>
                      {i + 1}
                    </span>
                    <StyledInput
                      type="text"
                      value={formData.after[i]}
                      onChange={e => handleArrayChange("after", i, e.target.value)}
                      placeholder={`Value ${i + 1}`}
                      style={{ borderColor: C.greenBorder }}
                      onFocus={e => { e.target.style.borderColor = C.green; e.target.style.boxShadow = "0 0 0 3px rgba(22,163,74,.1)"; }}
                      onBlur={e => { e.target.style.borderColor = C.greenBorder; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                ))}
              </div>

              {/* Row 6 — Inspector & Remarks */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                <div>
                  <FieldLabel icon={User}>Insp. By</FieldLabel>
                  <StyledInput type="text" name="inspBy" value={formData.inspBy} onChange={handleChange} placeholder="Inspector name" />
                </div>
                <div>
                  <FieldLabel icon={MessageSquare}>Remarks</FieldLabel>
                  <StyledInput type="text" name="remarks" value={formData.remarks} onChange={handleChange} placeholder="Any remarks" />
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: C.border, margin: "8px 0 22px" }} />

              {/* Footer */}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 14 }}>

                {/* Prepared by */}
                <div style={{ minWidth: 200 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: C.textMid, marginBottom: 6 }}>
                    Prepared By
                  </div>
                  <StyledInput
                    type="text"
                    value={preparedBy}
                    onChange={e => setPreparedBy(e.target.value)}
                    placeholder="Enter name"
                    style={{ width: 220 }}
                  />
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>

                  {/* Reset */}
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isLoading}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      background: C.white,
                      border: `2px solid #d1d5db`,
                      color: "#374151",
                      padding: "11px 24px",
                      fontSize: 12, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase",
                      borderRadius: 6, cursor: isLoading ? "not-allowed" : "pointer",
                      fontFamily: "inherit", opacity: isLoading ? .5 : 1,
                      transition: "all .15s",
                    }}
                    onMouseEnter={e => { if (!isLoading) { e.currentTarget.style.background = "#f9fafb"; e.currentTarget.style.borderColor = "#9ca3af"; } }}
                    onMouseLeave={e => { e.currentTarget.style.background = C.white; e.currentTarget.style.borderColor = "#d1d5db"; }}
                  >
                    <RotateCcw size={14} />
                    Reset Form
                  </button>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 8,
                      background: isLoading ? "#9b1c1c" : C.red,
                      border: "none",
                      color: "#fff",
                      padding: "11px 28px",
                      fontSize: 12, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase",
                      borderRadius: 6, cursor: isLoading ? "not-allowed" : "pointer",
                      fontFamily: "inherit",
                      transition: "background .15s",
                      boxShadow: "0 2px 8px rgba(185,28,28,.35)",
                    }}
                    onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = "#991b1b"; }}
                    onMouseLeave={e => { if (!isLoading) e.currentTarget.style.background = C.red; }}
                  >
                    {isLoading
                      ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Submitting…</>
                      : <><Send size={14} /> Submit Report</>
                    }
                  </button>

                </div>
              </div>

            </div>
          </form>
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
};

export default For_M_Change_Ins_Form;