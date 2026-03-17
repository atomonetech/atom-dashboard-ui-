import { useState, useEffect } from "react";
import { GoPackageDependencies } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";

let _id = 0;
const nextId = () => ++_id;

const today = new Date();
const formattedDate = `${String(today.getDate()).padStart(2,'0')}-${String(today.getMonth()+1).padStart(2,'0')}-${today.getFullYear()}`;

const SUPPLIERS        = ["ATOMONE TECHNOLOGIES PVT.LTD","JINDAL STAINLESS LTD","TATA MOTORS LTD","MAHINDRA & MAHINDRA LTD","BOSCH INDIA LTD","BHARAT FORGE LTD"];
const CUSTOMERS        = ["ATOMONE TECHNOLOGIES PVT.LTD","TATA MOTORS LTD","MAHINDRA & MAHINDRA LTD","MARUTI SUZUKI INDIA LTD","HONDA CARS INDIA LTD"];
const PARTS_DATA       = [
  { desc:"INLET PIPE / OUTLET PIPE YTAMC", partNos:["PT-YTAMC-01","PT-YTAMC-02"] },
  { desc:"Steel Bracket Assembly",         partNos:["PT-001-A","PT-001-B","PT-001-C"] },
  { desc:"Aluminium Sheet 2MM",            partNos:["PT-002-A","PT-002-B"] },
  { desc:"Rubber Seal Ring",               partNos:["PT-003-A","PT-003-B","PT-003-C"] },
  { desc:"Plastic Cover Panel",            partNos:["PT-004-A","PT-004-B"] },
  { desc:"Copper Rod 12MM",                partNos:["PT-005-A","PT-005-B","PT-005-C"] },
  { desc:"Bolt M10 x 50",                  partNos:["PT-006-A","PT-006-B"] },
  { desc:"Bearing 6205 ZZ",                partNos:["PT-007-A","PT-007-B","PT-007-C"] },
];
const GRADES           = ["SUH409L","SS304","SS316","SS202","MS","EN8","EN24","HCHCr","SAILMA350","IS2062"];
const MTC_OPTIONS      = ["YES","NO","N/A"];
const GA_NGA_OPTIONS   = ["GA","NGA","N/A"];
const INSPECTION_METHODS = ["Micrometer","VC","MEASURING TAPE","VISUAL","Vernier Caliper","Height Gauge","CMM","Weighing Scale","Hardness Tester","Thread Gauge","Go / No-Go Gauge","Surface Roughness Tester","Magnetic Particle Test","Ultrasonic Test"];
const DEFAULT_PARAMS   = [
  { parameter:"SHEET THICKNESS", specification:"1 ± 0.08 mm",                            inspMethod:"Micrometer" },
  { parameter:"SHEET WIDTH",     specification:"80 ± 1 mm",                              inspMethod:"VC" },
  { parameter:"SHEET LENGTH",    specification:"1250 ± 10 mm",                           inspMethod:"MEASURING TAPE" },
  { parameter:"APPEARANCE",      specification:"FREE FROM DENT, BURR, SCRATCHES & RUST", inspMethod:"VISUAL" },
];
const PARAMETERS = ["APPEARANCE","SHEET THICKNESS","SHEET WIDTH","SHEET LENGTH","WIDTH","LENGTH","THICKNESS","DIAMETER","HEIGHT","WEIGHT","FLATNESS","STRAIGHTNESS","SURFACE FINISH","HARDNESS","THREAD","OUTER DIAMETER","INNER DIAMETER"];
const SPECS      = ["As per drawing","FREE FROM DENT, BURR, SCRATCHES & RUST","1 ± 0.08 mm","80 ± 1 mm","1250 ± 10 mm","±0.1 MM","±0.2 MM","±0.5 MM","±1.0 MM","Min 50 HRC","Max 60 HRC","Ra 1.6","Ra 3.2"];

const emptyRow = () => ({ id:nextId(), parameter:"", specification:"", inspMethod:"", observations:Array(5).fill(""), remark:"" });

const LBL = { fontSize:11, fontWeight:700, letterSpacing:"0.06em", color:"#0f172a", textTransform:"uppercase", marginBottom:5, display:"block", fontFamily:"'DM Sans',sans-serif" };

const SelectWrapper = ({ children, color="#64748b" }) => (
  <div style={{ position:"relative", width:"100%" }}>
    {children}
    <IoIosArrowDown style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", color:color, fontSize:14, pointerEvents:"none" }} />
  </div>
);

function fldStyle(v, disabled=false) {
  return {
    width:"100%",
    padding:"10px 32px 10px 12px",
    border:`1.5px solid ${v ? "#6182f7" : "#bfdbfe"}`,
    borderRadius:10,
    fontSize:13,
    fontWeight: v ? 600 : 400,
    background: disabled ? "#f1f5f9" : "#f8fafc",
    color: v ? "#1e293b" : "#64748b",
    outline:"none",
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily:"'DM Sans',sans-serif",
    boxSizing:"border-box",
    opacity: disabled ? 0.6 : 1,
    WebkitAppearance:"none",
    appearance:"none"
  };
}

function selStyle(v) {
  return {
    width:"100%",
    padding:"9px 28px 9px 8px",
    border:`1.5px solid ${v ? "#6182f7" : "#bfdbfe"}`,
    borderRadius:8,
    fontSize:13,
    background:"#f8fafc",
    color: v ? "#1e293b" : "#64748b",
    outline:"none",
    cursor:"pointer",
    fontFamily:"'DM Sans',sans-serif",
    fontWeight: v ? 600 : 400,
    WebkitAppearance:"none",
    appearance:"none"
  };
}

function methodStyle(v) {
  return {
    width:"100%",
    padding:"9px 28px 9px 8px",
    border:`1.5px solid ${v ? "#6182f7" : "#c7d2fe"}`,
    borderRadius:8,
    fontSize:13,
    background:"#f8fafc",
    color: v ? "#1e293b" : "#64748b",
    outline:"none",
    cursor:"pointer",
    fontFamily:"'DM Sans',sans-serif",
    fontWeight: v ? 600 : 400,
    WebkitAppearance:"none",
    appearance:"none"
  };
}

function rkStyle(v) {
  return {
    width:"100%",
    padding:"9px 28px 9px 8px",
    border:"1.5px solid #bfdbfe",
    borderRadius:8,
    fontSize:13,
    background: v==="OK" ? "#d1fae5" : v==="NOT OK" ? "#fee2e2" : "#f8fafc",
    color: v==="OK" ? "#065f46" : v==="NOT OK" ? "#991b1b" : "#64748b",
    fontWeight: v ? 700 : 400,
    outline:"none",
    cursor:"pointer",
    fontFamily:"'DM Sans',sans-serif",
    WebkitAppearance:"none",
    appearance:"none"
  };
}

function obsStyle(v) {
  return {
    width:"100%",
    padding:"9px 4px",
    border:`1px solid ${v ? "#3b82f6" : "#bfdbfe"}`,
    borderRadius:7,
    fontSize:13,
    textAlign:"center",
    background: v ? "#dbeafe" : "#f8fafc",
    outline:"none",
    fontFamily:"'DM Sans',sans-serif",
    boxSizing:"border-box"
  };
}

const TH = ({ children, w, bg, colSpan, rowSpan }) => (
  <th colSpan={colSpan} rowSpan={rowSpan} style={{ padding:"9px 6px", fontWeight:700, fontSize:10, color:"#fff", textTransform:"uppercase", letterSpacing:"0.5px", textAlign:"center", background:bg||"#1e3a8a", border:"1px solid rgba(255,255,255,0.2)", whiteSpace:"nowrap", width:w, lineHeight:1.3 }}>{children}</th>
);
const TD = ({ children, style={} }) => (
  <td style={{ padding:"5px 4px", fontSize:11, textAlign:"center", color:"#1e293b", border:"1px solid #dbeafe", ...style }}>{children}</td>
);

const DEFAULT_STATE = () => ({
  supplier:"", customer:"", partDesc:"", partNo:"",
  date:formattedDate, grade:"", mtc:"", gaNga:"",
  coilNo:"", invoiceNo:"", qty:"",
  rows: DEFAULT_PARAMS.map(p => ({...emptyRow(), parameter:p.parameter, specification:p.specification, inspMethod:p.inspMethod}))
});

export default function IncomingMaterialInsp() {
  const [supplier,  setSupplier]  = useState("");
  const [customer,  setCustomer]  = useState("");
  const [partDesc,  setPartDesc]  = useState("");
  const [partNo,    setPartNo]    = useState("");
  const [date,      setDate]      = useState(formattedDate);
  const [grade,     setGrade]     = useState("");
  const [mtc,       setMtc]       = useState("");
  const [gaNga,     setGaNga]     = useState("");
  const [coilNo,    setCoilNo]    = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [qty,       setQty]       = useState("");
  const [rows,      setRows]      = useState(DEFAULT_PARAMS.map(p => ({...emptyRow(), parameter:p.parameter, specification:p.specification, inspMethod:p.inspMethod})));
  const [isMobile,  setIsMobile]  = useState(false);
  const [saveMsg,   setSaveMsg]   = useState("");

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const partNos        = partDesc ? (PARTS_DATA.find(p=>p.desc===partDesc)?.partNos||[]) : [];
  const handlePartDesc = v => { setPartDesc(v); setPartNo(""); };
  const updateRow      = (i,field,val) => setRows(prev => prev.map((r,idx) => idx===i ? {...r,[field]:val} : r));
  const updateObs      = (i,j,val)     => setRows(prev => prev.map((r,idx) => { if(idx!==i) return r; const o=[...r.observations]; o[j]=val; return {...r,observations:o}; }));
  const addRow         = () => setRows(prev => [...prev, emptyRow()]);
  const removeRow      = i  => setRows(prev => prev.filter((_,idx)=>idx!==i));

  const handleSave = () => {
    const savedAt = new Date().toLocaleString();

    console.group("╔══════════════════════════════════════════════════");
    console.log("║  📦 INCOMING MATERIAL INSPECTION REPORT — SAVED");
    console.log("║  Form No: AOT/F/QA/01  |  Saved At:", savedAt);
    console.groupEnd();

    console.group("📋 HEADER INFO");
    console.table([{
      "Supplier Name"     : supplier    || "—",
      "Customer Name"     : customer    || "—",
      "Part Name"         : partDesc    || "—",
      "Part No."          : partNo      || "—",
      "Date"              : date        || "—",
      "Grade"             : grade       || "—",
      "MTC"               : mtc         || "—",
      "GA / NGA"          : gaNga       || "—",
      "Coil No."          : coilNo      || "—",
      "Invoice/Challan No": invoiceNo   || "—",
      "QTY"               : qty         || "—",
    }]);
    console.groupEnd();

    console.group("🔬 INSPECTION PARAMETERS (" + rows.length + " rows)");
    const tableData = rows.map((r, i) => ({
      "SR."          : i + 1,
      "Parameter"    : r.parameter    || "—",
      "Specification": r.specification|| "—",
      "Insp. Method" : r.inspMethod   || "—",
      "Obs 1"        : r.observations[0] || "—",
      "Obs 2"        : r.observations[1] || "—",
      "Obs 3"        : r.observations[2] || "—",
      "Obs 4"        : r.observations[3] || "—",
      "Obs 5"        : r.observations[4] || "—",
      "Remark"       : r.remark       || "—",
    }));
    console.table(tableData);
    console.groupEnd();

    const okCount    = rows.filter(r => r.remark === "OK").length;
    const notOkCount = rows.filter(r => r.remark === "NOT OK").length;
    console.group("📊 SUMMARY");
    console.log("  ✅ OK      :", okCount);
    console.log("  ❌ NOT OK  :", notOkCount);
    console.log("  ⬜ Pending :", rows.length - okCount - notOkCount);
    console.groupEnd();

    // Reset all fields after save
    setSupplier(""); setCustomer(""); setPartDesc(""); setPartNo("");
    setDate(formattedDate); setGrade(""); setMtc(""); setGaNga("");
    setCoilNo(""); setInvoiceNo(""); setQty("");
    setRows(DEFAULT_PARAMS.map(p => ({...emptyRow(), parameter:p.parameter, specification:p.specification, inspMethod:p.inspMethod})));
    setSaveMsg("✓ Saved & Reset!");
    setTimeout(() => setSaveMsg(""), 2500);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all data?")) {
      setSupplier(""); setCustomer(""); setPartDesc(""); setPartNo("");
      setDate(formattedDate); setGrade(""); setMtc(""); setGaNga("");
      setCoilNo(""); setInvoiceNo(""); setQty("");
      setRows(DEFAULT_PARAMS.map(p => ({...emptyRow(), parameter:p.parameter, specification:p.specification, inspMethod:p.inspMethod})));
      setSaveMsg("");
    }
  };

  const headerFilled = !!(supplier && partDesc && partNo && qty);
  const okCount      = rows.filter(r=>r.remark==="OK").length;
  const notOkCount   = rows.filter(r=>r.remark==="NOT OK").length;

  const grid4 = { display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap:14 };
  const grid6 = { display:"grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(6,1fr)", gap:14 };

  return (
    <div style={{ minHeight:"100vh", background:"#f8fafc", fontFamily:"'DM Sans',sans-serif", padding: isMobile?"12px 8px":"24px 12px", display:"flex", flexDirection:"column", alignItems:"center" }}>
      <style>{`
        * { box-sizing: border-box; }
        select, input { -webkit-tap-highlight-color: transparent; }
        select:focus, input:focus { outline: none !important; border-color: #6182f7 !important; box-shadow: 0 0 0 3px rgba(97,130,247,0.18) !important; }
        select option { background: #ffffff !important; color: #1e293b !important; font-weight: 400; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
        .save-toast { animation: fadeIn 0.25s ease; }

        .imi-save-btn {
          height: 38px; padding: 0 20px; border-radius: 9px;
          background: #1d4ed8; color: #fff; border: none;
          font-weight: 700; font-size: 13px; cursor: pointer;
          font-family: 'DM Sans',sans-serif;
          display: flex; align-items: center; gap: 6px;
          transition: background 0.15s, transform 0.12s, box-shadow 0.15s;
          box-shadow: 0 2px 8px rgba(29,78,216,0.22);
          white-space: nowrap;
        }
        .imi-save-btn:hover { background: #1e40af; box-shadow: 0 4px 14px rgba(29,78,216,0.30); transform: translateY(-1px); }
        .imi-save-btn:active { background: #1e3a8a; transform: scale(0.97); box-shadow: none; }

        .imi-reset-btn {
          height: 38px; padding: 0 16px; border-radius: 9px;
          background: #eff6ff; color: #1e3a8a;
          border: 1.5px solid #bfdbfe;
          font-weight: 700; font-size: 13px; cursor: pointer;
          font-family: 'DM Sans',sans-serif;
          display: flex; align-items: center; gap: 6px;
          transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.12s;
          white-space: nowrap;
        }
        .imi-reset-btn:hover { background: #fee2e2; border-color: #fca5a5; color: #dc2626; transform: translateY(-1px); }
        .imi-reset-btn:active { transform: scale(0.97); }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>

      {/* HEADER CARD */}
      <div style={{ width:"100%", maxWidth:1100, background:"#fff", borderRadius:16, boxShadow:"0 4px 24px rgba(59,130,246,0.12)", border:"1.5px solid #bfdbfe", overflow:"hidden", marginBottom:16 }}>

        {/* Top Bar */}
        <div style={{ display:"flex", alignItems: isMobile?"flex-start":"center", flexDirection: isMobile?"column":"row", justifyContent:"space-between", gap:10, padding: isMobile?"14px 14px":"14px 24px", borderBottom:"1px solid #dbeafe", background:"linear-gradient(90deg,#eff6ff,#f0f7ff)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <button onClick={()=>window.history.back()} style={{ width:36, height:36, borderRadius:9, background:"#dbeafe", border:"none", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, cursor:"pointer" }}>
              <span style={{ fontSize:18, color:"#1d4ed8", fontWeight:700, lineHeight:1 }}>←</span>
            </button>
            <div style={{ width:36, height:36, borderRadius:9, background:"#dbeafe", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <GoPackageDependencies color="#0f172a" />
            </div>
            <div>
              <span style={{ fontWeight:800, fontSize: isMobile?13:15, color:"#0f172a", display:"block", lineHeight:1.3 }}>Incoming Material Inspection Report</span>
              <span style={{ fontSize:10, color:"#0f172a", fontWeight:600 }}>Form No: AOT/F/QA/01 · Rev: 00 · Resp: Quality Engineer</span>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, alignSelf: isMobile?"flex-end":"center" }}>
            <label style={{ ...LBL, marginBottom:0, fontSize:10 }}>Date:</label>
            <input value={date} onChange={e=>setDate(e.target.value)}
              style={{ padding:"7px 11px", border:"1.5px solid #3b82f6", borderRadius:8, fontSize:13, fontWeight:700, color:"#0f172a", background:"#f8fafc", outline:"none", fontFamily:"'DM Sans',sans-serif", width:120 }}/>
          </div>
        </div>

        {/* Row 1 */}
        <div style={{ padding: isMobile?"14px":"18px 24px 0" }}>
          <div style={grid4}>
            <div>
              <label style={LBL}>Supplier Name :-</label>
              <SelectWrapper color={supplier ? "#1e293b" : "#64748b"}>
                <select value={supplier} onChange={e=>setSupplier(e.target.value)} style={fldStyle(supplier)}>
                  <option value="">Select...</option>
                  {SUPPLIERS.map(s=><option key={s}>{s}</option>)}
                </select>
              </SelectWrapper>
            </div>
            <div>
              <label style={LBL}>Customer Name :-</label>
              <SelectWrapper color={customer ? "#1e293b" : "#64748b"}>
                <select value={customer} onChange={e=>setCustomer(e.target.value)} style={fldStyle(customer)}>
                  <option value="">Select...</option>
                  {CUSTOMERS.map(c=><option key={c}>{c}</option>)}
                </select>
              </SelectWrapper>
            </div>
            <div>
              <label style={LBL}>Part Name :-</label>
              <SelectWrapper color={partDesc ? "#1e293b" : "#64748b"}>
                <select value={partDesc} onChange={e=>handlePartDesc(e.target.value)} style={fldStyle(partDesc)}>
                  <option value="">Select...</option>
                  {PARTS_DATA.map(p=><option key={p.desc}>{p.desc}</option>)}
                </select>
              </SelectWrapper>
            </div>
            <div>
              <label style={LBL}>Part No. :-</label>
              <SelectWrapper color={!partDesc ? "#bfdbfe" : partNo ? "#1e293b" : "#64748b"}>
                <select value={partNo} onChange={e=>setPartNo(e.target.value)} disabled={!partDesc} style={fldStyle(partNo,!partDesc)}>
                  <option value="">{partDesc?"Select Part No...":"Select Part first..."}</option>
                  {partNos.map(p=><option key={p}>{p}</option>)}
                </select>
              </SelectWrapper>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div style={{ padding: isMobile?"10px 14px 16px":"12px 24px 20px" }}>
          <div style={grid6}>
            <div>
              <label style={LBL}>Grade :-</label>
              <SelectWrapper color={grade ? "#1e293b" : "#64748b"}>
                <select value={grade} onChange={e=>setGrade(e.target.value)} style={fldStyle(grade)}>
                  <option value="">Select...</option>
                  {GRADES.map(g=><option key={g}>{g}</option>)}
                </select>
              </SelectWrapper>
            </div>
            <div>
              <label style={LBL}>MTC :-</label>
              <SelectWrapper color={mtc ? "#1e293b" : "#64748b"}>
                <select value={mtc} onChange={e=>setMtc(e.target.value)} style={fldStyle(mtc)}>
                  <option value="">Select...</option>
                  {MTC_OPTIONS.map(m=><option key={m}>{m}</option>)}
                </select>
              </SelectWrapper>
            </div>
            <div>
              <label style={LBL}>GA / NGA :-</label>
              <SelectWrapper color={gaNga ? "#1e293b" : "#64748b"}>
                <select value={gaNga} onChange={e=>setGaNga(e.target.value)} style={fldStyle(gaNga)}>
                  <option value="">Select...</option>
                  {GA_NGA_OPTIONS.map(g=><option key={g}>{g}</option>)}
                </select>
              </SelectWrapper>
            </div>
            <div>
              <label style={LBL}>Coil No. :-</label>
              <input value={coilNo} onChange={e=>setCoilNo(e.target.value)} placeholder="Enter coil no..." style={fldStyle(coilNo)}/>
            </div>
            <div>
              <label style={LBL}>Invoice / Challan No. :-</label>
              <input value={invoiceNo} onChange={e=>setInvoiceNo(e.target.value)} placeholder="Enter inv/challan..." style={fldStyle(invoiceNo)}/>
            </div>
            <div>
              <label style={LBL}>QTY. :-</label>
              <input type="number" min="1" value={qty} onChange={e=>setQty(e.target.value)} placeholder="Enter qty..." style={fldStyle(qty)}/>
            </div>
          </div>
        </div>

        {!headerFilled && (
          <div style={{ padding:"0 14px 14px" }}>
            <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:10, padding:"10px 14px", fontSize:12, color:"#0f172a", fontWeight:600 }}>
              ⚠️ Please fill Supplier, Part Name, Part No & QTY to generate the inspection table
            </div>
          </div>
        )}
      </div>

      {/* INSPECTION SECTION */}
      {headerFilled && (
        <div style={{ width:"100%", maxWidth:1100, background:"#fff", borderRadius:16, boxShadow:"0 6px 32px rgba(59,130,246,0.13)", border:"1.5px solid #93c5fd", overflow:"hidden" }}>
          <div style={{ padding: isMobile?"14px":"20px 24px" }}>

            <div style={{ marginBottom:14, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
              <span style={{ fontWeight:800, fontSize: isMobile?12:13, color:"#0f172a" }}>🔬 Inspection Parameters</span>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                <span style={{ fontSize:11, fontWeight:700, background:"#dbeafe", color:"#1d4ed8", padding:"3px 10px", borderRadius:20 }}>{rows.length} Rows</span>
                <span style={{ fontSize:11, fontWeight:700, background:"#d1fae5", color:"#065f46", padding:"3px 10px", borderRadius:20 }}>✓ OK: {okCount}</span>
                <span style={{ fontSize:11, fontWeight:700, background:"#fee2e2", color:"#991b1b", padding:"3px 10px", borderRadius:20 }}>✗ NOT OK: {notOkCount}</span>
              </div>
            </div>

            {/* DESKTOP */}
            {!isMobile && (
              <div style={{ overflowX:"auto", borderRadius:10, border:"2px solid #1e3a8a", marginBottom:14 }}>
                <table style={{ width:"100%", borderCollapse:"collapse", minWidth:1000, fontSize:11 }}>
                  <thead>
                    <tr>
                      <TH w={36}  rowSpan={2}>SR.<br/>NO.</TH>
                      <TH w={150} rowSpan={2}>PARAMETER</TH>
                      <TH w={160} rowSpan={2}>SPECIFICATION</TH>
                      <TH w={140} rowSpan={2} bg="#2563eb">INSPECTION<br/>METHOD</TH>
                      <th colSpan={5} style={{ padding:"9px 6px", fontWeight:700, fontSize:10, color:"#fff", textTransform:"uppercase", letterSpacing:"0.5px", textAlign:"center", background:"#1d4ed8", border:"1px solid rgba(255,255,255,0.2)" }}>OBSERVATION</th>
                      <TH w={80}  rowSpan={2}>REMARK</TH>
                      <TH w={32}  rowSpan={2} bg="#dc2626">–</TH>
                    </tr>
                    <tr>
                      {[1,2,3,4,5].map(n=>(
                        <th key={n} style={{ padding:"6px 4px", fontWeight:700, fontSize:11, color:"rgba(255,255,255,0.9)", textAlign:"center", background:"#2563eb", border:"1px solid rgba(255,255,255,0.15)", width:56 }}>{n}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row,i)=>(
                      <tr key={row.id} style={{ background:i%2===0?"#fff":"#f8fafc" }}>
                        <TD><span style={{ fontWeight:800, color:"#1e3a8a" }}>{i+1}</span></TD>
                        <TD>
                          <SelectWrapper color={row.parameter ? "#1e293b" : "#64748b"}>
                            <select value={row.parameter} onChange={e=>updateRow(i,"parameter",e.target.value)} style={selStyle(row.parameter)}>
                              <option value="">Select...</option>{PARAMETERS.map(p=><option key={p}>{p}</option>)}
                            </select>
                          </SelectWrapper>
                        </TD>
                        <TD>
                          <SelectWrapper color={row.specification ? "#1e293b" : "#64748b"}>
                            <select value={row.specification} onChange={e=>updateRow(i,"specification",e.target.value)} style={selStyle(row.specification)}>
                              <option value="">Select...</option>{SPECS.map(s=><option key={s}>{s}</option>)}
                            </select>
                          </SelectWrapper>
                        </TD>
                        <TD>
                          <SelectWrapper color={row.inspMethod ? "#1e293b" : "#64748b"}>
                            <select value={row.inspMethod} onChange={e=>updateRow(i,"inspMethod",e.target.value)} style={methodStyle(row.inspMethod)}>
                              <option value="">Select...</option>{INSPECTION_METHODS.map(m=><option key={m}>{m}</option>)}
                            </select>
                          </SelectWrapper>
                        </TD>
                        {row.observations.map((v,j)=>(
                          <TD key={j}><input value={v} onChange={e=>updateObs(i,j,e.target.value)} style={obsStyle(v)}/></TD>
                        ))}
                        <TD>
                          <SelectWrapper color={row.remark==="OK"?"#065f46":row.remark==="NOT OK"?"#991b1b":"#64748b"}>
                            <select value={row.remark} onChange={e=>updateRow(i,"remark",e.target.value)} style={rkStyle(row.remark)}>
                              <option value="">—</option><option value="OK">OK</option><option value="NOT OK">NOT OK</option>
                            </select>
                          </SelectWrapper>
                        </TD>
                        <TD>{rows.length>1&&<button onClick={()=>removeRow(i)} style={{ width:24,height:24,borderRadius:6,border:"1px solid #fecaca",background:"#fff5f5",color:"#dc2626",cursor:"pointer",fontWeight:700,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto" }}>✕</button>}</TD>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* MOBILE */}
            {isMobile && (
              <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:14 }}>
                {rows.map((row,i)=>(
                  <div key={row.id} style={{ border:`1.5px solid ${i%2===0?"#bfdbfe":"#c7d2fe"}`, borderRadius:12, background:i%2===0?"#f8fafc":"#f5f3ff", overflow:"hidden" }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 12px", background: i%2===0?"#dbeafe":"#e0e7ff", borderBottom:`1px solid ${i%2===0?"#bfdbfe":"#c7d2fe"}` }}>
                      <span style={{ fontWeight:800, fontSize:13, color:"#1e3a8a" }}>#{i+1}</span>
                      <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                        {row.remark && <span style={{ fontSize:11, fontWeight:700, padding:"2px 10px", borderRadius:20, background:row.remark==="OK"?"#d1fae5":"#fee2e2", color:row.remark==="OK"?"#065f46":"#991b1b" }}>{row.remark}</span>}
                        {rows.length>1 && <button onClick={()=>removeRow(i)} style={{ width:28,height:28,borderRadius:8,border:"1px solid #fecaca",background:"#fff5f5",color:"#dc2626",cursor:"pointer",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>}
                      </div>
                    </div>
                    <div style={{ padding:"12px" }}>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                        <div>
                          <label style={{ ...LBL, fontSize:10 }}>Parameter</label>
                          <SelectWrapper color={row.parameter ? "#1e293b" : "#64748b"}>
                            <select value={row.parameter} onChange={e=>updateRow(i,"parameter",e.target.value)} style={selStyle(row.parameter)}>
                              <option value="">Select...</option>{PARAMETERS.map(p=><option key={p}>{p}</option>)}
                            </select>
                          </SelectWrapper>
                        </div>
                        <div>
                          <label style={{ ...LBL, fontSize:10 }}>Specification</label>
                          <SelectWrapper color={row.specification ? "#1e293b" : "#64748b"}>
                            <select value={row.specification} onChange={e=>updateRow(i,"specification",e.target.value)} style={selStyle(row.specification)}>
                              <option value="">Select...</option>{SPECS.map(s=><option key={s}>{s}</option>)}
                            </select>
                          </SelectWrapper>
                        </div>
                      </div>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                        <div>
                          <label style={{ ...LBL, fontSize:10 }}>Insp. Method</label>
                          <SelectWrapper color={row.inspMethod ? "#1e293b" : "#64748b"}>
                            <select value={row.inspMethod} onChange={e=>updateRow(i,"inspMethod",e.target.value)} style={methodStyle(row.inspMethod)}>
                              <option value="">Select...</option>{INSPECTION_METHODS.map(m=><option key={m}>{m}</option>)}
                            </select>
                          </SelectWrapper>
                        </div>
                        <div>
                          <label style={{ ...LBL, fontSize:10 }}>Remark</label>
                          <SelectWrapper color={row.remark==="OK"?"#065f46":row.remark==="NOT OK"?"#991b1b":"#64748b"}>
                            <select value={row.remark} onChange={e=>updateRow(i,"remark",e.target.value)} style={rkStyle(row.remark)}>
                              <option value="">—</option><option value="OK">OK</option><option value="NOT OK">NOT OK</option>
                            </select>
                          </SelectWrapper>
                        </div>
                      </div>
                      <div>
                        <label style={{ ...LBL, fontSize:10, marginBottom:6 }}>Observations</label>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr", gap:6 }}>
                          {row.observations.map((v,j)=>(
                            <div key={j}>
                              <div style={{ fontSize:10, fontWeight:700, color:"#2563eb", textAlign:"center", marginBottom:3 }}>{j+1}</div>
                              <input value={v} onChange={e=>updateObs(i,j,e.target.value)} style={obsStyle(v)} placeholder="-"/>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button onClick={addRow} style={{ width:"100%", padding: isMobile?"12px":"9px", borderRadius:10, border:"2px dashed #93c5fd", background:"#f8fafc", color:"#2563eb", fontWeight:700, fontSize: isMobile?14:12, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", marginBottom:16 }}>
              ＋ Add Parameter Row
            </button>

            {/* Bottom Save & Reset */}
            <div style={{ display:"flex", justifyContent:"flex-end", gap:10, flexWrap:"wrap", alignItems:"center" }}>
              {saveMsg && <span className="save-toast" style={{ fontSize:12, fontWeight:700, color:"#065f46", background:"#d1fae5", border:"1px solid #6ee7b7", borderRadius:8, padding:"5px 12px", whiteSpace:"nowrap" }}>{saveMsg}</span>}
              <button className="imi-reset-btn" onClick={handleReset}>
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5.635 15A8 8 0 1118.364 9"/></svg>
                Reset
              </button>
              <button className="imi-save-btn" onClick={handleSave}>
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 3H7a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2z"/></svg>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}