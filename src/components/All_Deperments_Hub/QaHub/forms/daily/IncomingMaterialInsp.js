import { useState, useEffect } from "react";
import { GoPackageDependencies } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import { useParams, useNavigate } from "react-router-dom"; // 🔥 NAYA IMPORT
import axios from "axios"; // 🔥 NAYA IMPORT

let _id = 0;
const nextId = () => ++_id;

const today = new Date();
const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

const GRADES = ["SUH409L", "SS304", "SS316", "SS202", "MS", "EN8", "EN24", "HCHCr", "SAILMA350", "IS2062"];

const emptyRow = () => ({ id: nextId(), parameter: "", specification: "", inspMethod: "", observations: Array(5).fill(""), remark: "", isReadOnly: false });

const LBL = { fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", color: "#334155", textTransform: "uppercase", marginBottom: 6, display: "block", fontFamily: "'DM Sans',sans-serif" };

const SelectWrapper = ({ children, color = "#64748b", disabled = false }) => (
  <div style={{ position: "relative", width: "100%" }}>
    {children}
    {!disabled && <IoIosArrowDown style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: color, fontSize: 14, pointerEvents: "none" }} />}
  </div>
);

function fldStyle(v, disabled = false) {
  return {
    width: "100%", padding: "10px 12px", border: `1.5px solid ${v && !disabled ? "#3b82f6" : "#cbd5e1"}`,
    borderRadius: 8, fontSize: 13, fontWeight: v ? 600 : 400, background: disabled ? "#f1f5f9" : "#ffffff",
    color: disabled ? "#64748b" : (v ? "#0f172a" : "#64748b"), outline: "none", cursor: disabled ? "not-allowed" : "text",
    fontFamily: "'DM Sans',sans-serif", boxSizing: "border-box", transition: "all 0.2s ease"
  };
}

function selStyle(v, disabled = false) {
  return {
    width: "100%", padding: disabled ? "9px 12px" : "9px 28px 9px 12px", border: `1.5px solid ${v && !disabled ? "#3b82f6" : "#cbd5e1"}`,
    borderRadius: 6, fontSize: 12, background: disabled ? "#f8fafc" : "#ffffff", color: disabled ? "#334155" : (v ? "#0f172a" : "#64748b"),
    outline: "none", cursor: disabled ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: v ? 600 : 400,
    WebkitAppearance: "none", appearance: "none", transition: "all 0.2s ease"
  };
}

function rkStyle(v, disabled = false) { // 🔥 Added disabled support
  return {
    width: "100%", padding: disabled ? "9px 12px" : "9px 28px 9px 12px", border: "1.5px solid #cbd5e1", borderRadius: 6,
    fontSize: 12, background: disabled ? "#f8fafc" : v === "OK" ? "#ecfdf5" : v === "NOT OK" ? "#fef2f2" : "#ffffff",
    color: disabled ? "#64748b" : v === "OK" ? "#059669" : v === "NOT OK" ? "#dc2626" : "#64748b", fontWeight: v ? 700 : 400,
    outline: "none", cursor: disabled ? "not-allowed" : "pointer", fontFamily: "'DM Sans',sans-serif", WebkitAppearance: "none", appearance: "none"
  };
}

function obsStyle(v, disabled = false) { // 🔥 Added disabled support
  return {
    width: "100%", padding: "9px 4px", border: `1px solid ${v && !disabled ? "#3b82f6" : "#cbd5e1"}`,
    borderRadius: 6, fontSize: 12, textAlign: "center", background: disabled ? "#f1f5f9" : v ? "#eff6ff" : "#ffffff", color: disabled ? "#64748b" : "#0f172a", fontWeight: v ? 600 : 400,
    outline: "none", cursor: disabled ? "not-allowed" : "text", fontFamily: "'DM Sans',sans-serif", boxSizing: "border-box", transition: "all 0.2s ease"
  };
}

const TH = ({ children, w, bg, colSpan, rowSpan }) => (
  <th colSpan={colSpan} rowSpan={rowSpan} style={{ padding: "12px 8px", fontWeight: 700, fontSize: 11, color: "#ffffff", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center", background: bg || "#1e3a8a", border: "1px solid rgba(255,255,255,0.1)", whiteSpace: "nowrap", width: w, lineHeight: 1.3 }}>{children}</th>
);
const TD = ({ children, style = {} }) => (
  <td style={{ padding: "8px 6px", fontSize: 12, textAlign: "center", color: "#1e293b", border: "1px solid #e2e8f0", ...style }}>{children}</td>
);

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";
const API_URL = `${API_BASE}/api`;
const API_LOG = `${API_URL}/log-report/`;
const API_APPROVE = `${API_URL}/approve-report/`;

export default function IncomingMaterialInsp() {
  // 🔥 ROUTING HOOKS
  const { id } = useParams();
  const navigate = useNavigate();
  const isViewMode = Boolean(id);
  const currentUser = localStorage.getItem('username') || 'Unknown User';

  const [supplier, setSupplier] = useState("");
  const [customer, setCustomer] = useState("");
  const [selectedPartId, setSelectedPartId] = useState(""); 
  const [partNo, setPartNo] = useState("");
  const [date, setDate] = useState(formattedDate);
  const [grade, setGrade] = useState("");
  const [mtc, setMtc] = useState("");
  const [gaNga, setGaNga] = useState("");
  const [coilNo, setCoilNo] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [qty, setQty] = useState("");

  const [preparedBy, setPreparedBy] = useState("");
  const [checkedBy, setCheckedBy] = useState("");
  const [approvedBy, setApprovedBy] = useState("");

  const [rows, setRows] = useState([emptyRow()]);
  const [isMobile, setIsMobile] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [customersList, setCustomersList] = useState([]);
  const [partsList, setPartsList] = useState([]); 

  const [methodsList, setMethodsList] = useState([]);
  const [paramsList, setParamsList] = useState([]);
  const [specsList, setSpecsList] = useState([]);

  const mtcList = ["YES", "NO", "N/A"];
  const gaNgaList = ["GA", "NGA", "N/A"];

  // 🔥 FETCH DATA EFFECT (View Mode OR Create Mode)
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const custRes = await fetch(`${API_URL}/customers/`);
        if (custRes.ok) {
          const data = await custRes.json();
          setCustomersList(data.customers);
        }

        const [specRes, methodRes, paramRes] = await Promise.all([
          fetch(`${API_URL}/master-dropdown/?filter=spec`),
          fetch(`${API_URL}/master-dropdown/?filter=method`),
          fetch(`${API_URL}/master-dropdown/?filter=parameter`)
        ]);
        if (specRes.ok) setSpecsList(await specRes.json());
        if (methodRes.ok) setMethodsList(await methodRes.json());
        if (paramRes.ok) setParamsList(await paramRes.json());

      } catch (error) {
        console.error("Error fetching master data:", error);
      }
    };
    fetchMasterData();

    // VIEW MODE DATA FETCHING
    if (isViewMode) {
      const fetchReport = async () => {
        try {
          const res = await axios.get(`${API_URL}/get-single-report/incoming-inspection-view/${id}/`);
          if (res.data.success) {
            const data = res.data.data;
            setSupplier(data.supplier || "");
            setCustomer(data.customer || "");
            // Note: Since we need part ID for dropdown, but backend might just return name, 
            // we're displaying partName in a text format or matching it.
            // For pure view mode, selectedPartId isn't crucial as fields are locked
            setPartNo(data.part_no || "");
            
            if (data.date) {
               const parts = data.date.split('-');
               if(parts.length === 3) setDate(`${parts[2]}-${parts[1]}-${parts[0]}`);
            }
            
            setGrade(data.grade || "");
            setMtc(data.mtc || "");
            setGaNga(data.ga_nga || "");
            setCoilNo(data.coil_no || "");
            setInvoiceNo(data.invoice_no || "");
            setQty(data.qty || "");
            setPreparedBy(data.prepared_by || data.submitted_by.split('@')[0] || "");
            setCheckedBy(data.checked_by || "");
            setApprovedBy(data.approved_by || "");

            if (data.inspection_data && data.inspection_data.length > 0) {
                // Map backend row structure to UI row structure
                const formattedRows = data.inspection_data.map((r, i) => {
                    const obs = Array(5).fill("");
                    // In backend, observations might be stored differently depending on your model.
                    // Assuming 'observations' array exists, otherwise we'll leave it empty.
                    if(r.observations && Array.isArray(r.observations)) {
                        for(let k=0; k<5; k++) obs[k] = r.observations[k] || "";
                    }
                    return {
                        id: nextId(),
                        parameter: r.parameter || r.parameter_name || "",
                        specification: r.specification || "",
                        inspMethod: r.inspMethod || r.inspection_method || "",
                        observations: obs,
                        remark: r.remark || "",
                        isReadOnly: true
                    }
                });
                setRows(formattedRows);
            }
          }
        } catch (error) {
          console.error("Failed to load report", error);
        }
      };
      fetchReport();
    }

    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [id, isViewMode]);

  useEffect(() => {
    if (customer && !isViewMode) { // Skip auto-fetch in view mode
      fetch(`${API_URL}/parts/${encodeURIComponent(customer)}/`)
        .then(r => r.json())
        .then(data => {
          setPartsList(data.parts || []);
        })
        .catch(err => console.error(err));
    } else if (!isViewMode) {
      setPartsList([]);
      setSelectedPartId("");
      setPartNo("");
      setGrade("");
      setRows([emptyRow()]);
    }
  }, [customer, isViewMode]);

  const handleCustomerChange = (v) => { 
    if(isViewMode) return;
    setCustomer(v); 
    setSelectedPartId(""); 
    setPartNo(""); 
    setGrade("");
    setRows([emptyRow()]);
  };

  const handlePartChange = (e) => {
    if(isViewMode) return;
    const partId = e.target.value;
    setSelectedPartId(partId);

    const partData = partsList.find(p => String(p.id) === String(partId));
    
    if (partData) {
      setPartNo(partData.part_no || ""); 
      
      let inspData = partData.inspection_data || [];
      
      if (typeof inspData === 'string') {
        try {
            inspData = JSON.parse(inspData);
        } catch(err) {
            console.error("Error parsing inspection data:", err);
            inspData = [];
        }
      }

      let foundGrade = "";
      const newRows = [];

      if (Array.isArray(inspData)) {
        inspData.forEach((item) => {
          if (item.parameter_name && item.parameter_name.toUpperCase() === "GRADE") {
            foundGrade = item.specification || ""; 
          } else {
            newRows.push({
              id: nextId(),
              parameter: item.parameter_name || "",
              specification: item.specification || "",
              inspMethod: item.inspection_method || "",
              observations: Array(5).fill(""),
              remark: "",
              isReadOnly: true 
            });
          }
        });
      }

      setGrade(foundGrade);
      setRows(newRows.length > 0 ? newRows : [emptyRow()]);
    } else {
      setPartNo("");
      setGrade("");
      setRows([emptyRow()]);
    }
  };

  const updateRow = (i, field, val) => {
      if(isViewMode) return;
      setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  }
  const updateObs = (i, j, val) => {
      if(isViewMode) return;
      setRows(prev => prev.map((r, idx) => { if (idx !== i) return r; const o = [...r.observations]; o[j] = val; return { ...r, observations: o }; }));
  }
  const addRow = () => !isViewMode && setRows(prev => [...prev, emptyRow()]);
  const removeRow = i => !isViewMode && setRows(prev => prev.filter((_, idx) => idx !== i));

  // 🔥 UPDATED SUBMIT HANDLER (SAVE OR APPROVE)
  const handleSave = async () => {
    if (isViewMode) {
      // ==== APPROVE LOGIC ====
      try {
        const res = await axios.post(API_APPROVE, { log_id: id, approver_username: currentUser });
        if (res.status === 200) {
          alert('✅ Report Approved Successfully!');
          navigate('/notifications'); 
        }
      } catch (err) {
        console.error(err);
        alert('Failed to approve report.');
      }
    } else {
        // ==== SAVE LOGIC ====
        const selectedPartName = partsList.find(p => String(p.id) === String(selectedPartId))?.part_name || "";
        
        const [d, m, y] = date.split('-');
        const backendFormattedDate = `${y}-${m}-${d}`;

        const finalData = { 
        supplier: supplier, 
        customer: customer, 
        part_name: selectedPartName, 
        part_no: partNo, 
        date: backendFormattedDate, 
        grade: grade, 
        mtc: mtc, 
        ga_nga: gaNga, 
        coil_no: coilNo, 
        invoice_no: invoiceNo, 
        qty: qty, 
        prepared_by: preparedBy, 
        checked_by: checkedBy, 
        approved_by: approvedBy, 
        inspection_data: rows 
        };
        
        try {
        const response = await fetch(`${API_URL}/incoming-material-inspection/save/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(finalData),
        });

        if (response.ok) {
            const resultData = await response.json();
            const savedRecordId = resultData.record_id;

            // Log Activity
            try {
                await axios.post(API_LOG, {
                    username: currentUser,
                    report_name: 'Incoming Material Inspection',
                    record_id: savedRecordId
                });
            } catch (logErr) { console.error('Activity log error:', logErr); }

            setSaveMsg("✓ Form Data Saved!");
            setTimeout(() => {
                setSaveMsg("");
                navigate(-1); 
            }, 1500);
        } else {
            const errorData = await response.json();
            console.error("Backend Validation Error:", errorData);
            alert(`Validation Failed: JSON Error`); 
        }
        } catch (error) {
        console.error("Network error:", error);
        alert("Network error occurred. Please check your connection.");
        }
    }
  };

  const handleReset = () => {
    if (isViewMode) return;
    if (window.confirm("Are you sure you want to clear the form?")) {
      setSupplier(""); setCustomer(""); setSelectedPartId(""); setPartNo("");
      setDate(formattedDate); setGrade(""); setMtc(""); setGaNga("");
      setCoilNo(""); setInvoiceNo(""); setQty("");
      setPreparedBy(""); setCheckedBy(""); setApprovedBy("");
      setRows([emptyRow()]);
      setSaveMsg("");
    }
  };

  // 🔥 BYPASS HEADER CHECK IN VIEW MODE SO TABLE ALWAYS SHOWS
  const headerFilled = isViewMode || !!(supplier && customer && selectedPartId && qty);
  const okCount = rows.filter(r => r.remark === "OK").length;
  const notOkCount = rows.filter(r => r.remark === "NOT OK").length;

  const grid4 = { display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 16 };
  const grid6 = { display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(6,1fr)", gap: 16 };
  const grid3 = { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 24 };

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "'DM Sans',sans-serif", padding: isMobile ? "12px 8px" : "32px 16px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <style>{`
        * { box-sizing: border-box; }
        input:focus, select:focus { outline: none !important; border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.15) !important; }
        select option { background: #ffffff !important; color: #1e293b !important; font-weight: 400; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
        .save-toast { animation: fadeIn 0.3s ease; }
        .imi-save-btn { height: 42px; padding: 0 24px; border-radius: 8px; background: ${isViewMode ? '#10b981' : '#2563eb'}; color: #fff; border: none; font-weight: 700; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(37,99,235,0.2); }
        .imi-save-btn:hover { filter: brightness(0.9); transform: translateY(-1px); }
        .imi-save-btn:active { transform: translateY(0); }
        .imi-reset-btn { height: 42px; padding: 0 20px; border-radius: 8px; background: #ffffff; color: #475569; border: 1.5px solid #cbd5e1; font-weight: 600; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s ease; }
        .imi-reset-btn:hover { background: #f8fafc; border-color: #94a3b8; color: #1e293b; }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* HEADER CARD */}
      <div style={{ width: "100%", maxWidth: 1140, background: "#ffffff", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.04)", border: "1px solid #e2e8f0", overflow: "hidden", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: isMobile ? "flex-start" : "center", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", gap: 12, padding: isMobile ? "16px" : "16px 24px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => navigate(-1)} style={{ width: 36, height: 36, borderRadius: 8, background: "#e2e8f0", border: "none", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", color: "#475569", transition: "all 0.2s" }} onMouseOver={e=>e.currentTarget.style.background="#cbd5e1"} onMouseOut={e=>e.currentTarget.style.background="#e2e8f0"}>
              <span style={{ fontSize: 18, fontWeight: 700 }}>←</span>
            </button>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <GoPackageDependencies color="#1d4ed8" size={20} />
            </div>
            <div>
              <span style={{ fontWeight: 800, fontSize: isMobile ? 14 : 16, color: "#0f172a", display: "block", lineHeight: 1.2 }}>Incoming Material Inspection Report {isViewMode && <span style={{color:'#10b981'}}>(REVIEW MODE)</span>}</span>
              <span style={{ fontSize: 11, color: "#64748b", fontWeight: 500 }}>Form No: AOT/F/QA/01 · Rev: 00 · Resp: Quality Engineer</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, alignSelf: isMobile ? "flex-end" : "center" }}>
            <label style={{ ...LBL, marginBottom: 0, fontSize: 11 }}>Date:</label>
            <input type="date" disabled={isViewMode} value={date.split('-').reverse().join('-')} onChange={e => {
                const [y,m,d] = e.target.value.split('-');
                setDate(`${d}-${m}-${y}`);
            }} style={{ padding: "8px 12px", border: "1.5px solid #cbd5e1", borderRadius: 6, fontSize: 13, fontWeight: 600, color: isViewMode?"#64748b":"#0f172a", background: isViewMode?"#f8fafc":"#fff", outline: "none", cursor: isViewMode?"not-allowed":"text", fontFamily: "'DM Sans',sans-serif", width: 135 }} />
          </div>
        </div>

        <div style={{ padding: isMobile ? "16px" : "24px 24px 8px" }}>
          <div style={grid4}>
            <div>
              <label style={LBL}>Supplier Name</label>
              <input value={supplier} onChange={e => setSupplier(e.target.value)} disabled={isViewMode} placeholder="Enter Supplier Name" style={fldStyle(supplier, isViewMode)} />
            </div>
            <div>
              <label style={LBL}>Customer Name</label>
              {isViewMode ? (
                 <input value={customer} disabled style={fldStyle(customer, true)} />
              ) : (
                <SelectWrapper color={customer ? "#1e293b" : "#94a3b8"}>
                  <select value={customer} onChange={e => handleCustomerChange(e.target.value)} style={{...fldStyle(customer), paddingRight: 32}}>
                    <option value="">Select Customer...</option>
                    {customersList.map((c, idx) => <option key={idx} value={c}>{c}</option>)}
                  </select>
                </SelectWrapper>
              )}
            </div>
            <div>
              <label style={LBL}>Part Name</label>
              {isViewMode ? (
                 <input value={selectedPartId || "Loaded from Database"} disabled style={fldStyle(true, true)} />
              ) : (
                <SelectWrapper color={!customer ? "#cbd5e1" : selectedPartId ? "#1e293b" : "#94a3b8"} disabled={!customer}>
                  <select value={selectedPartId} onChange={handlePartChange} disabled={!customer} style={{...fldStyle(selectedPartId, !customer), paddingRight: 32}}>
                    <option value="">{customer ? "Select Part..." : "Select Customer First"}</option>
                    {partsList.map((p) => (
                      <option key={p.id} value={p.id}>{p.part_name} {p.part_model ? `(${p.part_model})` : ''}</option>
                    ))}
                  </select>
                </SelectWrapper>
              )}
            </div>
            <div>
            <label style={LBL}>Part No.</label>
             <input 
               value={partNo} 
               onChange={e => setPartNo(e.target.value)} 
               disabled={isViewMode}
               placeholder="Enter or Auto-filled..." 
               style={fldStyle(partNo, isViewMode)} 
              />
            </div>
          </div>
        </div>

        <div style={{ padding: isMobile ? "8px 16px 20px" : "12px 24px 24px" }}>
          <div style={grid6}>
            <div>
              <label style={LBL}>Grade</label>
              {isViewMode ? <input value={grade} disabled style={fldStyle(grade, true)} /> :
                <SelectWrapper color={grade ? "#1e293b" : "#94a3b8"}>
                  <select value={grade} onChange={e => setGrade(e.target.value)} style={{...fldStyle(grade), paddingRight: 32}}>
                    <option value="">Select...</option>
                    {grade && !GRADES.includes(grade) && <option value={grade}>{grade}</option>}
                    {GRADES.map((g, idx) => <option key={idx} value={g}>{g}</option>)}
                  </select>
                </SelectWrapper>
              }
            </div>
            <div>
              <label style={LBL}>MTC</label>
              {isViewMode ? <input value={mtc} disabled style={fldStyle(mtc, true)} /> :
                <SelectWrapper color={mtc ? "#1e293b" : "#94a3b8"}>
                  <select value={mtc} onChange={e => setMtc(e.target.value)} style={{...fldStyle(mtc), paddingRight: 32}}>
                    <option value="">Select...</option>
                    {mtcList.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </SelectWrapper>
              }
            </div>
            <div>
              <label style={LBL}>GA / NGA</label>
              {isViewMode ? <input value={gaNga} disabled style={fldStyle(gaNga, true)} /> :
                <SelectWrapper color={gaNga ? "#1e293b" : "#94a3b8"}>
                  <select value={gaNga} onChange={e => setGaNga(e.target.value)} style={{...fldStyle(gaNga), paddingRight: 32}}>
                    <option value="">Select...</option>
                    {gaNgaList.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </SelectWrapper>
              }
            </div>
            <div>
              <label style={LBL}>Coil No.</label>
              <input value={coilNo} onChange={e => setCoilNo(e.target.value)} disabled={isViewMode} placeholder="Coil number" style={fldStyle(coilNo, isViewMode)} />
            </div>
            <div>
              <label style={LBL}>Invoice / Challan</label>
              <input value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} disabled={isViewMode} placeholder="Invoice number" style={fldStyle(invoiceNo, isViewMode)} />
            </div>
            <div>
              <label style={LBL}>QTY.</label>
              <input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} disabled={isViewMode} placeholder="Total Qty" style={fldStyle(qty, isViewMode)} />
            </div>
          </div>
        </div>

        {!headerFilled && (
          <div style={{ padding: "0 24px 24px" }}>
            <div style={{ background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: 8, padding: "16px", fontSize: 13, color: "#64748b", fontWeight: 500, textAlign: "center" }}>
              Please fill required fields (Supplier, Customer, Part Name & QTY) to activate the inspection table.
            </div>
          </div>
        )}
      </div>

      {/* TABLE SECTION */}
      {headerFilled && (
        <div style={{ width: "100%", maxWidth: 1140, background: "#ffffff", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.04)", border: "1px solid #e2e8f0", overflow: "hidden", marginBottom: 40 }}>
          <div style={{ padding: isMobile ? "16px" : "24px" }}>

            <div style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, borderBottom: "1px solid #f1f5f9", paddingBottom: 16 }}>
              <span style={{ fontWeight: 800, fontSize: isMobile ? 14 : 16, color: "#0f172a", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{fontSize: 20}}>🔬</span> Inspection Parameters
              </span>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, fontWeight: 700, background: "#f1f5f9", color: "#475569", padding: "4px 12px", borderRadius: 20 }}>{rows.length} Rows</span>
                <span style={{ fontSize: 12, fontWeight: 700, background: "#ecfdf5", color: "#059669", padding: "4px 12px", borderRadius: 20 }}>✓ OK: {okCount}</span>
                <span style={{ fontSize: 12, fontWeight: 700, background: "#fef2f2", color: "#dc2626", padding: "4px 12px", borderRadius: 20 }}>✗ NOT OK: {notOkCount}</span>
              </div>
            </div>

            <div style={{ display: "block", width: "100%", overflowX: "auto", WebkitOverflowScrolling: "touch", borderRadius: 8, border: "1px solid #cbd5e1", marginBottom: 20 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
                <thead>
                  <tr>
                    <TH w={40} rowSpan={2}>SR</TH>
                    <TH w={160} rowSpan={2}>PARAMETER</TH>
                    <TH w={180} rowSpan={2}>SPECIFICATION</TH>
                    <TH w={150} rowSpan={2} bg="#2563eb">INSPECTION<br />METHOD</TH>
                    <th colSpan={5} style={{ padding: "8px", fontWeight: 700, fontSize: 11, color: "#ffffff", textTransform: "uppercase", letterSpacing: "0.5px", textAlign: "center", background: "#1d4ed8", border: "1px solid rgba(255,255,255,0.1)" }}>OBSERVATION</th>
                    <TH w={100} rowSpan={2}>REMARK</TH>
                    {!isViewMode && <TH w={40} rowSpan={2} bg="#ef4444">DEL</TH>}
                  </tr>
                  <tr>
                    {[1, 2, 3, 4, 5].map(n => (
                      <th key={n} style={{ padding: "6px", fontWeight: 700, fontSize: 12, color: "#f8fafc", textAlign: "center", background: "#2563eb", border: "1px solid rgba(255,255,255,0.15)", width: 60 }}>{n}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={row.id} style={{ background: i % 2 === 0 ? "#ffffff" : "#f8fafc", transition: "background 0.2s" }} onMouseOver={e=>e.currentTarget.style.background="#f1f5f9"} onMouseOut={e=>e.currentTarget.style.background=i % 2 === 0 ? "#ffffff" : "#f8fafc"}>
                      <TD><span style={{ fontWeight: 700, color: "#475569" }}>{i + 1}</span></TD>
                      <TD>
                        {isViewMode ? <input value={row.parameter} disabled style={selStyle(true, true)} /> :
                          <SelectWrapper color={row.parameter ? "#1e293b" : "#94a3b8"} disabled={row.isReadOnly}>
                            <select value={row.parameter} onChange={e => updateRow(i, "parameter", e.target.value)} disabled={row.isReadOnly} style={selStyle(row.parameter, row.isReadOnly)}>
                              <option value="">Select...</option>
                              {row.parameter && !paramsList.includes(row.parameter) && <option value={row.parameter}>{row.parameter}</option>}
                              {paramsList.map((p, idx) => <option key={idx} value={p}>{p}</option>)}
                            </select>
                          </SelectWrapper>
                        }
                      </TD>
                      <TD>
                        {isViewMode ? <input value={row.specification} disabled style={selStyle(true, true)} /> :
                          <SelectWrapper color={row.specification ? "#1e293b" : "#94a3b8"} disabled={row.isReadOnly}>
                            <select value={row.specification} onChange={e => updateRow(i, "specification", e.target.value)} disabled={row.isReadOnly} style={selStyle(row.specification, row.isReadOnly)}>
                              <option value="">Select...</option>
                              {row.specification && !specsList.includes(row.specification) && <option value={row.specification}>{row.specification}</option>}
                              {specsList.map((s, idx) => <option key={idx} value={s}>{s}</option>)}
                            </select>
                          </SelectWrapper>
                        }
                      </TD>
                      <TD>
                        {isViewMode ? <input value={row.inspMethod} disabled style={selStyle(true, true)} /> :
                          <SelectWrapper color={row.inspMethod ? "#1e293b" : "#94a3b8"} disabled={row.isReadOnly}>
                            <select value={row.inspMethod} onChange={e => updateRow(i, "inspMethod", e.target.value)} disabled={row.isReadOnly} style={selStyle(row.inspMethod, row.isReadOnly)}>
                              <option value="">Select...</option>
                              {row.inspMethod && !methodsList.includes(row.inspMethod) && <option value={row.inspMethod}>{row.inspMethod}</option>}
                              {methodsList.map((m, idx) => <option key={idx} value={m}>{m}</option>)}
                            </select>
                          </SelectWrapper>
                        }
                      </TD>
                      {row.observations.map((v, j) => (
                        <TD key={j}><input value={v} disabled={isViewMode} onChange={e => updateObs(i, j, e.target.value)} style={obsStyle(v, isViewMode)} /></TD>
                      ))}
                      <TD>
                        {isViewMode ? <div style={rkStyle(row.remark, true)}>{row.remark || "—"}</div> :
                          <SelectWrapper color={row.remark === "OK" ? "#059669" : row.remark === "NOT OK" ? "#dc2626" : "#94a3b8"}>
                            <select value={row.remark} onChange={e => updateRow(i, "remark", e.target.value)} style={rkStyle(row.remark, false)}>
                              <option value="">—</option><option value="OK">OK</option><option value="NOT OK">NOT OK</option>
                            </select>
                          </SelectWrapper>
                        }
                      </TD>
                      {!isViewMode && <TD>{rows.length > 1 && !row.isReadOnly && <button onClick={() => removeRow(i)} style={{ width: 26, height: 26, borderRadius: 4, border: "1px solid #fecaca", background: "#fef2f2", color: "#ef4444", cursor: "pointer", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", transition: "all 0.2s" }} onMouseOver={e=>{e.currentTarget.style.background="#ef4444"; e.currentTarget.style.color="#fff"}} onMouseOut={e=>{e.currentTarget.style.background="#fef2f2"; e.currentTarget.style.color="#ef4444"}}>×</button>}</TD>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!isViewMode && (
               <button onClick={addRow} style={{ width: "100%", padding: "12px", borderRadius: 8, border: "1.5px dashed #94a3b8", background: "#f8fafc", color: "#2563eb", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginBottom: 24, transition: "all 0.2s" }} onMouseOver={e=>{e.currentTarget.style.background="#eff6ff"; e.currentTarget.style.borderColor="#60a5fa"}} onMouseOut={e=>{e.currentTarget.style.background="#f8fafc"; e.currentTarget.style.borderColor="#94a3b8"}}>
                 ＋ Add Manual Parameter Row
               </button>
            )}

            {/* AUTHORIZATION SECTION */}
            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 24, marginBottom: 32 }}>
              <div style={grid3}>
                <div>
                  <label style={LBL}>Prepared By</label>
                  <input value={preparedBy} onChange={e => setPreparedBy(e.target.value)} disabled={isViewMode} placeholder="Name / Sign" style={fldStyle(preparedBy, isViewMode)} />
                </div>
                <div>
                  <label style={LBL}>Checked By</label>
                  <input value={checkedBy} onChange={e => setCheckedBy(e.target.value)} disabled={isViewMode} placeholder="Name / Sign" style={fldStyle(checkedBy, isViewMode)} />
                </div>
                <div>
                  <label style={LBL}>Approved By</label>
                  <input value={approvedBy} onChange={e => setApprovedBy(e.target.value)} disabled={isViewMode} placeholder="Name / Sign" style={fldStyle(approvedBy, isViewMode)} />
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, flexWrap: "wrap", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: 20 }}>
              {saveMsg && <span className="save-toast" style={{ fontSize: 13, fontWeight: 600, color: "#059669", background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 6, padding: "8px 16px" }}>{saveMsg}</span>}
              {!isViewMode && (
                <button className="imi-reset-btn" onClick={handleReset}>
                  Reset Form
                </button>
              )}
              <button className="imi-save-btn" onClick={handleSave}>
                {isViewMode ? "✓ Approve Report" : "Save Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}