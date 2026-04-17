import { useState, useEffect } from "react";

let _id = 0;
const nextId = () => ++_id;

const today = new Date();
const formattedDate = `${String(today.getDate()).padStart(2,'0')}-${String(today.getMonth()+1).padStart(2,'0')}-${today.getFullYear()}`;

const SUPPLIER_NAME = "ATOMONE TECHNOLOGIES";

const PARTS_DATA = [
  { name:"BRACKET B PANEL NO LH",          partNos:["46553-58U00","46553-58U01","46553-58U02"] },
  { name:"BRACKET B PANEL NO RH",          partNos:["46554-58U00","46554-58U01"] },
  { name:"INLET PIPE / OUTLET PIPE YTAMC", partNos:["PT-YTAMC-01","PT-YTAMC-02"] },
  { name:"Steel Bracket Assembly",         partNos:["PT-001-A","PT-001-B","PT-001-C"] },
  { name:"Aluminium Sheet 2MM",            partNos:["PT-002-A","PT-002-B"] },
  { name:"Rubber Seal Ring",               partNos:["PT-003-A","PT-003-B","PT-003-C"] },
  { name:"Plastic Cover Panel",            partNos:["PT-004-A","PT-004-B"] },
  { name:"Copper Rod 12MM",               partNos:["PT-005-A","PT-005-B"] },
  { name:"Bolt M10 x 50",                 partNos:["PT-006-A","PT-006-B"] },
  { name:"Bearing 6205 ZZ",               partNos:["PT-007-A","PT-007-B","PT-007-C"] },
];

const MODELS = ["YY8","YY9","YY10","ZX5","ZX7","GT3","GT5","LX1","LX2","MX9"];

const INSPECTION_ITEMS = [
  "Appearance","DATUM 1 HOLE DIA","DATUM 2 HOLE DIA","HOLE 1 DIA","HOLE 2 DIA",
  "HOLE 3 DIA","THINNING","SURFACE POSITION (GAP)","TRIM LINE POSITION (FLUSH)",
  "WIDTH","LENGTH","THICKNESS","DIAMETER","HEIGHT","WEIGHT","FLATNESS",
  "HARDNESS","THREAD","OUTER DIAMETER","INNER DIAMETER","SURFACE FINISH",
];

const SPECIFICATIONS = [
  "Ø8+0.2","13.2X22.7 +0.5","12.2X22.7 +0.5","(19X35)+0.5",
  "SHOULD BE LESS THAN 20%","AS PER CHECKING FIXTURE",
  "FREE FROM DENT, BURR, SCRATCHES & RUST",
  "FREE FROM DENT,CRACK,WRINKLE,RUST,DUST,BLANK SHOT,DAMAGE,DEFORM,HOLE BURR,TRIM BURR,SCRAP MARK,TOOL MARK,HARD MARK",
  "1 ± 0.08 mm","80 ± 1 mm","1250 ± 10 mm","As per drawing",
  "±0.1 MM","±0.2 MM","±0.5 MM","Min 50 HRC","Ra 1.6","Ra 3.2",
];

const INSPECTION_TOOLS = [
  "Visual Check","DVC","MICROMETER","TAPERSCALE","FLAT SCALE",
  "Vernier Caliper","Height Gauge","CMM","Weighing Scale",
  "Hardness Tester","Thread Gauge","Go / No-Go Gauge",
  "Surface Roughness Tester","Magnetic Particle Test","Ultrasonic Test","MEASURING TAPE",
];

const REMARK_OPTS = ["","OK","NOT OK","N/A"];

const BLUE  = "#5082f6";
const BLUE2 = "#3a6ae0";
const BLUE3 = "#e8effe";
const BLUE4 = "#1d3fa8";
const WHITE = "#ffffff";

const parseSampleCount = (val) => {
  const t = (val || "").trim();
  if (!t) return 5;
  const tM = t.match(/^[Tt](\d+)$/);
  if (tM) return Math.min(Math.max(parseInt(tM[1],10)||1, 1), 20);
  const nM = t.match(/^(\d+)/);
  if (nM) return Math.min(Math.max(parseInt(nM[1],10)||1, 1), 20);
  return 5;
};

const DEFAULT_ROWS = (n) => [
  { id:nextId(), item:"Appearance",               spec:"FREE FROM DENT,CRACK,WRINKLE,RUST,DUST,BLANK SHOT,DAMAGE,DEFORM,HOLE BURR,TRIM BURR,SCRAP MARK,TOOL MARK,HARD MARK", tool:"Visual Check", supplierObs:Array(n).fill(""), judgement:"", custObs:["","",""], remark:"" },
  { id:nextId(), item:"DATUM 1 HOLE DIA",          spec:"Ø8+0.2",                   tool:"DVC",         supplierObs:Array(n).fill(""), judgement:"", custObs:["","",""], remark:"" },
  { id:nextId(), item:"DATUM 2 HOLE DIA",          spec:"Ø8+0.2",                   tool:"DVC",         supplierObs:Array(n).fill(""), judgement:"", custObs:["","",""], remark:"" },
  { id:nextId(), item:"HOLE 1 DIA",                spec:"13.2X22.7 +0.5",           tool:"DVC",         supplierObs:Array(n).fill(""), judgement:"", custObs:["","",""], remark:"" },
  { id:nextId(), item:"HOLE 2 DIA",                spec:"12.2X22.7 +0.5",           tool:"DVC",         supplierObs:Array(n).fill(""), judgement:"", custObs:["","",""], remark:"" },
  { id:nextId(), item:"HOLE 3 DIA",                spec:"(19X35)+0.5",              tool:"DVC",         supplierObs:Array(n).fill(""), judgement:"", custObs:["","",""], remark:"" },
  { id:nextId(), item:"THINNING",                  spec:"SHOULD BE LESS THAN 20%",  tool:"MICROMETER",  supplierObs:Array(n).fill(""), judgement:"", custObs:["","",""], remark:"" },
  { id:nextId(), item:"SURFACE POSITION (GAP)",    spec:"AS PER CHECKING FIXTURE",  tool:"TAPERSCALE",  supplierObs:Array(n).fill(""), judgement:"", custObs:["","",""], remark:"" },
  { id:nextId(), item:"TRIM LINE POSITION (FLUSH)",spec:"AS PER CHECKING FIXTURE",  tool:"FLAT SCALE",  supplierObs:Array(n).fill(""), judgement:"", custObs:["","",""], remark:"" },
];

const emptyRow = (n) => ({ id:nextId(), item:"", spec:"", tool:"", supplierObs:Array(n).fill(""), judgement:"", custObs:["","",""], remark:"" });

const WRAP = { position:"relative", width:"100%" };
const LBL  = { fontSize:10, fontWeight:700, color:"#0f172a", letterSpacing:"0.06em", textTransform:"uppercase", display:"block", marginBottom:4, fontFamily:"'DM Sans',sans-serif" };

const TH = ({ children, w, colSpan, rowSpan, bg }) => (
  <th colSpan={colSpan} rowSpan={rowSpan} style={{
    padding:"7px 5px", fontWeight:700, fontSize:9.5, color:WHITE,
    textTransform:"uppercase", letterSpacing:"0.4px", textAlign:"center",
    background:bg||BLUE, border:"1px solid rgba(255,255,255,0.25)",
    whiteSpace:"pre-wrap", width:w, lineHeight:1.3, verticalAlign:"middle",
  }}>{children}</th>
);

const TD = ({ children, style={} }) => (
  <td style={{ padding:"4px 3px", fontSize:10, textAlign:"center", color:"#1e293b", border:`1px solid ${BLUE3}`, verticalAlign:"middle", ...style }}>{children}</td>
);

const selSt = (v, colored=false) => ({
  width:"100%", padding:"5px 20px 5px 6px",
  border:`1px solid ${v ? BLUE : "#c7d9fd"}`,
  borderRadius:6, fontSize:10,
  background: colored && v==="OK" ? "#d1fae5" : colored && v==="NOT OK" ? "#fee2e2" : "#f8fafc",
  color: colored && v==="OK" ? "#065f46" : colored && v==="NOT OK" ? "#991b1b" : v ? "#0f172a" : "#94a3b8",
  outline:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif",
  fontWeight: v ? 700 : 400, WebkitAppearance:"none", appearance:"none", boxSizing:"border-box",
});

const inpSt = (v) => ({
  width:"100%", padding:"6px 4px",
  border:`1px solid ${v ? BLUE : "#c7d9fd"}`,
  borderRadius:6, fontSize:10, textAlign:"center",
  background:"#f8fafc", outline:"none",
  fontFamily:"'DM Sans',sans-serif", boxSizing:"border-box", color:"#0f172a",
});

const hdInpSt = (v) => ({
  padding:"9px 11px", border:`1.5px solid ${v ? BLUE : "#c7d9fd"}`,
  borderRadius:8, fontSize:12, fontWeight: v ? 700 : 400,
  background: v ? "#f0f5ff" : "#f8fafc", color: v ? "#0f172a" : "#94a3b8",
  outline:"none", fontFamily:"'DM Sans',sans-serif", boxSizing:"border-box", width:"100%",
});

const hdSelSt = (v) => ({ ...hdInpSt(v), cursor:"pointer", WebkitAppearance:"none", appearance:"none", paddingRight:28 });

const Arr = ({ color=BLUE }) => (
  <svg style={{ position:"absolute", right:7, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}
    width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

// ── ATOM ONE Logo — Dashboard style (cyan glow box + atom SVG) ──
const AtomOneLogo = ({ mobile }) => (
  <div style={{ display:"flex", alignItems:"center", gap:0 }}>
    <div style={{
      background:"#06b6d4",
      padding: mobile ? "4px 8px" : "6px 10px",
      borderRadius:"6px 0 0 6px",
    }}>
      <span style={{
        fontWeight:900, fontSize: mobile ? 12 : 15,
        color:"#ffffff", letterSpacing:2,
        fontFamily:"'DM Sans',sans-serif",
      }}>ATOM</span>
    </div>
    <div style={{
      background:"#f59e0b",
      padding: mobile ? "4px 8px" : "6px 10px",
      borderRadius:"0 6px 6px 0",
    }}>
      <span style={{
        fontWeight:900, fontSize: mobile ? 12 : 15,
        color:"#ffffff", letterSpacing:2,
        fontFamily:"'DM Sans',sans-serif",
      }}>ONE</span>
    </div>
  </div>
);
// ── Mobile row card ──────────────────────────────────────────────
const MobileRowCard = ({ row, i, obsCount, updateRow, updateSupObs, updateCustObs, removeRow, totalRows }) => (
  <div style={{ border:`1.5px solid ${i%2===0?"#bfdbfe":"#c7d2fe"}`, borderRadius:12, background:i%2===0?"#f8fafc":"#f5f3ff", overflow:"hidden", marginBottom:10 }}>
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 12px", background:i%2===0?BLUE3:"#e0e7ff", borderBottom:`1px solid ${i%2===0?"#bfdbfe":"#c7d2fe"}` }}>
      <span style={{ fontWeight:800, fontSize:13, color:BLUE4 }}>#{i+1}</span>
      <div style={{ display:"flex", gap:6, alignItems:"center" }}>
        {row.judgement && (
          <span style={{ fontSize:11, fontWeight:700, padding:"2px 10px", borderRadius:20, background:row.judgement==="OK"?"#d1fae5":"#fee2e2", color:row.judgement==="OK"?"#065f46":"#991b1b" }}>{row.judgement}</span>
        )}
        {totalRows > 1 && (
          <button onClick={()=>removeRow(i)} style={{ width:26,height:26,borderRadius:7,border:"1px solid #fecaca",background:"#fff5f5",color:"#dc2626",cursor:"pointer",fontWeight:700,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
        )}
      </div>
    </div>
    <div style={{ padding:12 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
        <div>
          <label style={{ ...LBL, fontSize:9 }}>Inspection Item</label>
          <div style={WRAP}>
            <select value={row.item} onChange={e=>updateRow(i,"item",e.target.value)} style={selSt(row.item)}>
              <option value="">Select...</option>
              {INSPECTION_ITEMS.map(it=><option key={it}>{it}</option>)}
            </select>
            <Arr color={row.item?BLUE4:"#94a3b8"} />
          </div>
        </div>
        <div>
          <label style={{ ...LBL, fontSize:9 }}>Specification</label>
          <div style={WRAP}>
            <select value={row.spec} onChange={e=>updateRow(i,"spec",e.target.value)} style={{...selSt(row.spec),fontSize:9,paddingRight:14}}>
              <option value="">Select...</option>
              {SPECIFICATIONS.map(s=><option key={s}>{s}</option>)}
            </select>
            <Arr color={row.spec?BLUE4:"#94a3b8"} />
          </div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
        <div>
          <label style={{ ...LBL, fontSize:9 }}>Inspection Tool</label>
          <div style={WRAP}>
            <select value={row.tool} onChange={e=>updateRow(i,"tool",e.target.value)} style={selSt(row.tool)}>
              <option value="">Select...</option>
              {INSPECTION_TOOLS.map(t=><option key={t}>{t}</option>)}
            </select>
            <Arr color={row.tool?BLUE4:"#94a3b8"} />
          </div>
        </div>
        <div>
          <label style={{ ...LBL, fontSize:9 }}>Judgement</label>
          <div style={WRAP}>
            <select value={row.judgement} onChange={e=>updateRow(i,"judgement",e.target.value)} style={selSt(row.judgement,true)}>
              {REMARK_OPTS.map(r=><option key={r} value={r}>{r||"—"}</option>)}
            </select>
            <Arr color={row.judgement==="OK"?"#065f46":row.judgement==="NOT OK"?"#991b1b":"#94a3b8"} />
          </div>
        </div>
      </div>
      <div style={{ marginBottom:8 }}>
        <label style={{ ...LBL, fontSize:9, marginBottom:6 }}>Supplier Observations</label>
        <div style={{ display:"grid", gridTemplateColumns:`repeat(${Math.min(obsCount,5)},1fr)`, gap:5 }}>
          {Array.from({length:obsCount},(_,j)=>(
            <div key={j}>
              <div style={{ fontSize:9, fontWeight:700, color:BLUE2, textAlign:"center", marginBottom:2 }}>{j+1}</div>
              <input value={row.supplierObs[j]??""} onChange={e=>updateSupObs(i,j,e.target.value)} style={inpSt(row.supplierObs[j])} placeholder="-"/>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        <div>
          <label style={{ ...LBL, fontSize:9, marginBottom:6 }}>Customer Obs (1·2·3)</label>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:4 }}>
            {row.custObs.map((v,j)=>(
              <input key={j} value={v} onChange={e=>updateCustObs(i,j,e.target.value)} style={inpSt(v)} placeholder="-"/>
            ))}
          </div>
        </div>
        <div>
          <label style={{ ...LBL, fontSize:9 }}>Remark</label>
          <div style={WRAP}>
            <select value={row.remark} onChange={e=>updateRow(i,"remark",e.target.value)} style={selSt(row.remark,true)}>
              {REMARK_OPTS.map(r=><option key={r} value={r}>{r||"—"}</option>)}
            </select>
            <Arr color={row.remark==="OK"?"#065f46":row.remark==="NOT OK"?"#991b1b":"#94a3b8"} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ── Main Component ───────────────────────────────────────────────
export default function SampleInspectionReport() {
  const [partName,    setPartName]    = useState("");
  const [partNo,      setPartNo]      = useState("");
  const [sampleNoRaw, setSampleNoRaw] = useState("");
  const [lotQty,      setLotQty]      = useState("");
  const [model,       setModel]       = useState("");
  const [date,        setDate]        = useState(formattedDate);
  const [suppRemark,  setSuppRemark]  = useState("");
  const [inspBy,      setInspBy]      = useState("");
  const [verBy,       setVerBy]       = useState("");
  const [apprBy,      setApprBy]      = useState("");
  const [saveMsg,     setSaveMsg]     = useState("");
  const [isMobile,    setIsMobile]    = useState(false);

  const obsCount = parseSampleCount(sampleNoRaw);
  const [rows, setRows] = useState(() => DEFAULT_ROWS(5));

  useEffect(() => {
    setRows(prev => prev.map(r => {
      if (r.supplierObs.length === obsCount) return r;
      const next = obsCount > r.supplierObs.length
        ? [...r.supplierObs, ...Array(obsCount - r.supplierObs.length).fill("")]
        : r.supplierObs.slice(0, obsCount);
      return { ...r, supplierObs: next };
    }));
  }, [obsCount]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 860);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const partNos = PARTS_DATA.find(p => p.name === partName)?.partNos || [];

  const updateRow     = (i, f, v) => setRows(p => p.map((r,idx) => idx===i ? {...r,[f]:v} : r));
  const updateSupObs  = (i, j, v) => setRows(p => p.map((r,idx) => { if(idx!==i) return r; const o=[...r.supplierObs]; o[j]=v; return {...r,supplierObs:o}; }));
  const updateCustObs = (i, j, v) => setRows(p => p.map((r,idx) => { if(idx!==i) return r; const o=[...r.custObs]; o[j]=v; return {...r,custObs:o}; }));
  const addRow        = () => setRows(p => [...p, emptyRow(obsCount)]);
  const removeRow     = i  => setRows(p => p.filter((_,idx) => idx!==i));

  const handleSave = () => {
    console.group("📦 SAMPLE INSPECTION REPORT SAVED");
    console.table([{ PartName:partName, PartNo:partNo, SampleNo:sampleNoRaw, ObsCols:obsCount, LotQty:lotQty, Model:model, Date:date }]);
    rows.forEach((r,i) => console.log(`Row ${i+1}: ${r.item} | Obs:[${r.supplierObs.join(",")}] | Judgement:${r.judgement}`));
    console.groupEnd();
    setPartName(""); setPartNo(""); setSampleNoRaw(""); setLotQty("");
    setModel(""); setDate(formattedDate);
    setSuppRemark(""); setInspBy(""); setVerBy(""); setApprBy("");
    setRows(DEFAULT_ROWS(5));
    setSaveMsg("✓ Saved & Reset!");
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const handleReset = () => {
    if (!window.confirm("Reset all data?")) return;
    setPartName(""); setPartNo(""); setSampleNoRaw(""); setLotQty("");
    setModel(""); setDate(formattedDate);
    setSuppRemark(""); setInspBy(""); setVerBy(""); setApprBy("");
    setRows(DEFAULT_ROWS(5)); setSaveMsg("");
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      alert("No previous page to go back to.");
    }
  };

  const okCount    = rows.filter(r => r.judgement === "OK").length;
  const notOkCount = rows.filter(r => r.judgement === "NOT OK").length;
  const headerFilled = !!(partName && partNo && sampleNoRaw.trim() && lotQty.trim() && model && date.trim());

  const row1Cols = isMobile ? "1fr 1fr" : "1fr 1.6fr 0.6fr 0.8fr";
  const row2Cols = isMobile ? "1fr 1fr" : "1.2fr 0.8fr 1fr";

  return (
    <div style={{ minHeight:"100vh", background:"#eef3ff", fontFamily:"'DM Sans',sans-serif", padding:isMobile?"8px 4px":"20px 12px", display:"flex", flexDirection:"column", alignItems:"center" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing:border-box; }
        select:focus,input:focus,textarea:focus { outline:none!important; border-color:${BLUE}!important; box-shadow:0 0 0 3px rgba(80,130,246,0.18)!important; }
        select option { background:#fff; color:#0f172a; }
        .sir-save {
          height:40px; padding:0 22px; border-radius:10px;
          background:${BLUE}; color:#fff; border:none; font-weight:700; font-size:13px;
          cursor:pointer; font-family:'DM Sans',sans-serif;
          display:flex; align-items:center; gap:7px;
          box-shadow:0 2px 12px rgba(80,130,246,0.38);
          transition:background .15s,transform .12s;
          white-space:nowrap;
        }
        .sir-save:hover  { background:${BLUE2}; transform:translateY(-1px); }
        .sir-save:active { transform:scale(0.97); }
        .sir-reset {
          height:40px; padding:0 18px; border-radius:10px;
          background:#fff; color:${BLUE}; border:1.5px solid ${BLUE};
          font-weight:700; font-size:13px; cursor:pointer;
          font-family:'DM Sans',sans-serif;
          display:flex; align-items:center; gap:7px;
          transition:background .15s,color .15s,transform .12s;
          white-space:nowrap;
        }
        .sir-reset:hover  { background:#fee2e2; border-color:#fca5a5; color:#dc2626; transform:translateY(-1px); }
        .sir-reset:active { transform:scale(0.97); }
        .sir-back {
          height:42px; padding:0 20px; border-radius:12px;
          background:#fff; color:${BLUE4}; border:2px solid ${BLUE};
          font-weight:700; font-size:13px; cursor:pointer;
          font-family:'DM Sans',sans-serif;
          display:flex; align-items:center; gap:8px;
          box-shadow:0 2px 10px rgba(80,130,246,0.15);
          transition:background .15s,color .15s,transform .12s,box-shadow .15s;
          white-space:nowrap; align-self:flex-start;
        }
        .sir-back:hover  { background:${BLUE3}; color:${BLUE4}; transform:translateY(-1px); box-shadow:0 4px 16px rgba(80,130,246,0.22); }
        .sir-back:active { transform:scale(0.97); }
        @keyframes fadeIn { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
        .toast { animation:fadeIn 0.25s ease; }
        @media (max-width:860px) {
          .sir-save, .sir-reset { height:38px; font-size:12px; padding:0 14px; }
          .sir-back { height:38px; font-size:12px; padding:0 14px; }
        }
      `}</style>

      {/* ── BACK BUTTON — outside the form card ── */}
      <div style={{ width:"100%", maxWidth:1260, marginBottom:10, paddingLeft:isMobile?4:0 }}>
        <button className="sir-back" onClick={handleBack}>
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
      </div>

      <div style={{ width:"100%", maxWidth:1260, background:WHITE, borderRadius:isMobile?14:18, boxShadow:"0 6px 40px rgba(80,130,246,0.18)", border:`2px solid ${BLUE}`, overflow:"hidden" }}>

        {/* ══ TOP BANNER ══ */}
        <div style={{ background:`linear-gradient(135deg,${BLUE4} 0%,${BLUE} 65%,#6fa0ff 100%)`, padding:isMobile?"10px 14px":"14px 28px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:isMobile?10:16 }}>

            {/* ✅ Dashboard-style ATOM ONE Logo */}
            <AtomOneLogo mobile={isMobile} />

            {/* Divider */}
            <div style={{ width:1, height:isMobile?38:52, background:"rgba(255,255,255,0.3)", flexShrink:0 }} />

            {/* Title */}
            <div style={{ minWidth:0 }}>
              <div style={{ fontWeight:900, fontSize:isMobile?13:21, color:WHITE, letterSpacing:1.5, textTransform:"uppercase", lineHeight:1.2 }}>
                {isMobile ? "Sample Insp. Report" : "Sample Inspection Report"}
              </div>
              <div style={{ fontSize:isMobile?9:10, color:"rgba(255,255,255,0.72)", fontWeight:600, marginTop:2 }}>
                Form No: AOT/F/QA/21 · Quality Assurance Dept.
              </div>
            </div>
          </div>
        </div>

        {/* ══ HEADER FIELDS ══ */}
        <div style={{ padding:isMobile?"12px":"16px 24px", borderBottom:`2px solid ${BLUE3}`, background:"#f8fafc" }}>
          <div style={{ display:"grid", gridTemplateColumns:row1Cols, gap:isMobile?10:12, marginBottom:isMobile?10:12 }}>
            <div>
              <label style={LBL}>Supplier Name :-</label>
              <div style={{ padding:"10px 12px", border:`1.5px solid ${BLUE}`, borderRadius:8, background:"#eef3ff" }}>
                <span style={{ fontSize:isMobile?11:12, fontWeight:800, color:BLUE4, fontFamily:"'DM Sans',sans-serif" }}>{SUPPLIER_NAME}</span>
              </div>
            </div>
            <div>
              <label style={LBL}>Part Name :-</label>
              <div style={WRAP}>
                <select value={partName} onChange={e=>{ setPartName(e.target.value); setPartNo(""); }} style={hdSelSt(partName)}>
                  <option value="">Select...</option>
                  {PARTS_DATA.map(p=><option key={p.name}>{p.name}</option>)}
                </select>
                <Arr />
              </div>
            </div>
            <div>
              <label style={LBL}>Sample No :-</label>
              <input value={sampleNoRaw} onChange={e => setSampleNoRaw(e.target.value)} placeholder="e.g. 05"
                style={{ ...hdInpSt(sampleNoRaw), border:`1.5px solid ${sampleNoRaw?BLUE:"#c7d9fd"}`, fontWeight:sampleNoRaw?700:400 }} />
            </div>
            <div>
              <label style={LBL}>Lot QTY. :-</label>
              <input value={lotQty} onChange={e=>setLotQty(e.target.value)} placeholder="e.g. 05 NOS" style={hdInpSt(lotQty)} />
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:row2Cols, gap:isMobile?10:12 }}>
            <div>
              <label style={LBL}>Part No. :-</label>
              <div style={WRAP}>
                <select value={partNo} onChange={e=>setPartNo(e.target.value)} style={hdSelSt(partNo)}>
                  <option value="">Select Part No...</option>
                  {partNos.map(p=><option key={p}>{p}</option>)}
                </select>
                <Arr />
              </div>
            </div>
            <div>
              <label style={LBL}>Model :-</label>
              <div style={WRAP}>
                <select value={model} onChange={e=>setModel(e.target.value)} style={hdSelSt(model)}>
                  <option value="">Select...</option>
                  {MODELS.map(m=><option key={m}>{m}</option>)}
                </select>
                <Arr />
              </div>
            </div>
            <div>
              <label style={LBL}>Date of Inspection :-</label>
              <input value={date} onChange={e=>setDate(e.target.value)} style={hdInpSt(date)} />
            </div>
          </div>
        </div>

        {!headerFilled && (
          <div style={{ padding:isMobile?"10px 12px 14px":"12px 24px 18px" }}>
            <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:10, padding:"11px 16px", fontSize:isMobile?11:12, color:BLUE4, fontWeight:600, display:"flex", alignItems:"center", gap:8 }}>
              <span>⚠️</span>
              Please fill Part Name, Part No, Sample No, Lot QTY, Model &amp; Date to generate the inspection table.
            </div>
          </div>
        )}

        {headerFilled && (
          <div style={{ padding:isMobile?"10px 8px":"16px 24px" }}>
            <div style={{ marginBottom:10, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
              <span style={{ fontWeight:800, fontSize:isMobile?12:13, color:BLUE4 }}>🔬 Inspection Parameters</span>
              <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                <span style={{ fontSize:10, fontWeight:700, background:BLUE3, color:BLUE4, padding:"3px 9px", borderRadius:20 }}>{rows.length} Rows</span>
                <span style={{ fontSize:10, fontWeight:700, background:`${BLUE}22`, color:BLUE4, padding:"3px 9px", borderRadius:20 }}>📊 {obsCount} Obs/Row</span>
                <span style={{ fontSize:10, fontWeight:700, background:"#d1fae5", color:"#065f46", padding:"3px 9px", borderRadius:20 }}>✓ OK: {okCount}</span>
                <span style={{ fontSize:10, fontWeight:700, background:"#fee2e2", color:"#991b1b", padding:"3px 9px", borderRadius:20 }}>✗ NOT OK: {notOkCount}</span>
              </div>
            </div>

            {!isMobile && (
              <div style={{ overflowX:"auto", borderRadius:10, border:`2px solid ${BLUE4}`, marginBottom:12 }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:10 }}>
                  <thead>
                    <tr>
                      <TH w={32}  rowSpan={2}>SR.{"\n"}NO.</TH>
                      <TH w={130} rowSpan={2}>Inspection{"\n"}Items</TH>
                      <TH w={148} rowSpan={2}>Specifications</TH>
                      <TH w={110} rowSpan={2} bg={BLUE2}>Inspection{"\n"}Tool</TH>
                      <th colSpan={obsCount} style={{ padding:"7px 5px", fontWeight:700, fontSize:9.5, color:WHITE, textTransform:"uppercase", textAlign:"center", background:BLUE2, border:"1px solid rgba(255,255,255,0.2)" }}>
                        Supplier Observations ({obsCount})
                      </th>
                      <TH w={60} rowSpan={2} bg={BLUE4}>Judge{"\n"}ment</TH>
                      <th colSpan={3} style={{ padding:"7px 5px", fontWeight:700, fontSize:9.5, color:WHITE, textTransform:"uppercase", textAlign:"center", background:BLUE4, border:"1px solid rgba(255,255,255,0.2)" }}>
                        Customer Observations
                      </th>
                      <TH w={65} rowSpan={2}>Remarks</TH>
                      <TH w={26} rowSpan={2} bg="#dc2626">–</TH>
                    </tr>
                    <tr>
                      {Array.from({length:obsCount},(_,n)=>(
                        <th key={n} style={{ padding:"5px 3px", fontWeight:700, fontSize:10, color:"rgba(255,255,255,0.9)", textAlign:"center", background:"#3a6ae0", border:"1px solid rgba(255,255,255,0.15)", width:Math.max(46,Math.floor(340/obsCount)) }}>{n+1}</th>
                      ))}
                      {[1,2,3].map(n=>(
                        <th key={n} style={{ padding:"5px 3px", fontWeight:700, fontSize:10, color:"rgba(255,255,255,0.9)", textAlign:"center", background:"#1e3a8a", border:"1px solid rgba(255,255,255,0.15)", width:56 }}>{n}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={row.id} style={{ background: i%2===0 ? WHITE : "#f8fafc" }}>
                        <TD><span style={{ fontWeight:800, color:BLUE4 }}>{i+1}</span></TD>
                        <TD>
                          <div style={WRAP}>
                            <select value={row.item} onChange={e=>updateRow(i,"item",e.target.value)} style={selSt(row.item)}>
                              <option value="">Select...</option>
                              {INSPECTION_ITEMS.map(it=><option key={it}>{it}</option>)}
                            </select>
                            <Arr color={row.item?BLUE4:"#94a3b8"} />
                          </div>
                        </TD>
                        <TD>
                          <div style={WRAP}>
                            <select value={row.spec} onChange={e=>updateRow(i,"spec",e.target.value)} style={{...selSt(row.spec),fontSize:9,paddingRight:14}}>
                              <option value="">Select...</option>
                              {SPECIFICATIONS.map(s=><option key={s}>{s}</option>)}
                            </select>
                            <Arr color={row.spec?BLUE4:"#94a3b8"} />
                          </div>
                        </TD>
                        <TD>
                          <div style={WRAP}>
                            <select value={row.tool} onChange={e=>updateRow(i,"tool",e.target.value)} style={selSt(row.tool)}>
                              <option value="">Select...</option>
                              {INSPECTION_TOOLS.map(t=><option key={t}>{t}</option>)}
                            </select>
                            <Arr color={row.tool?BLUE4:"#94a3b8"} />
                          </div>
                        </TD>
                        {Array.from({length:obsCount},(_,j)=>(
                          <TD key={j}>
                            <input value={row.supplierObs[j]??""} onChange={e=>updateSupObs(i,j,e.target.value)} style={inpSt(row.supplierObs[j])} />
                          </TD>
                        ))}
                        <TD>
                          <div style={WRAP}>
                            <select value={row.judgement} onChange={e=>updateRow(i,"judgement",e.target.value)} style={selSt(row.judgement,true)}>
                              {REMARK_OPTS.map(r=><option key={r} value={r}>{r||"—"}</option>)}
                            </select>
                            <Arr color={row.judgement==="OK"?"#065f46":row.judgement==="NOT OK"?"#991b1b":"#94a3b8"} />
                          </div>
                        </TD>
                        {row.custObs.map((v,j)=>(
                          <TD key={j}><input value={v} onChange={e=>updateCustObs(i,j,e.target.value)} style={inpSt(v)} /></TD>
                        ))}
                        <TD>
                          <div style={WRAP}>
                            <select value={row.remark} onChange={e=>updateRow(i,"remark",e.target.value)} style={selSt(row.remark,true)}>
                              {REMARK_OPTS.map(r=><option key={r} value={r}>{r||"—"}</option>)}
                            </select>
                            <Arr color={row.remark==="OK"?"#065f46":row.remark==="NOT OK"?"#991b1b":"#94a3b8"} />
                          </div>
                        </TD>
                        <TD>
                          {rows.length>1 && (
                            <button onClick={()=>removeRow(i)} style={{ width:22,height:22,borderRadius:5,border:"1px solid #fecaca",background:"#fff5f5",color:"#dc2626",cursor:"pointer",fontWeight:700,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto" }}>✕</button>
                          )}
                        </TD>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {isMobile && (
              <div style={{ marginBottom:12 }}>
                {rows.map((row, i) => (
                  <MobileRowCard key={row.id} row={row} i={i} obsCount={obsCount}
                    updateRow={updateRow} updateSupObs={updateSupObs} updateCustObs={updateCustObs}
                    removeRow={removeRow} totalRows={rows.length} />
                ))}
              </div>
            )}

            <button onClick={addRow} style={{ width:"100%", padding:isMobile?"12px":"10px", borderRadius:10, border:`2px dashed ${BLUE}`, background:BLUE3, color:BLUE4, fontWeight:700, fontSize:isMobile?13:12, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", marginBottom:16 }}>
              ＋ Add Inspection Row
            </button>

            <div style={{ marginBottom:16 }}>
              <label style={LBL}>Supplier Remarks :-</label>
              <textarea value={suppRemark} onChange={e=>setSuppRemark(e.target.value)} rows={isMobile?3:2} placeholder="Enter supplier remarks here..."
                style={{ width:"100%", padding:"9px 12px", border:`1.5px solid ${suppRemark?BLUE:"#c7d9fd"}`, borderRadius:8, fontSize:12, fontFamily:"'DM Sans',sans-serif", resize:"vertical", outline:"none", background:"#f8fafc", color:"#0f172a", boxSizing:"border-box" }}/>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr 1fr", gap:12, marginBottom:16, background:BLUE3, borderRadius:10, padding:isMobile?"12px":"14px 18px", border:`1px solid ${BLUE}` }}>
              {[["Inspected By :-", inspBy, setInspBy],["Verified By :-", verBy, setVerBy],["Approved By :-", apprBy, setApprBy]].map(([label,val,setter]) => (
                <div key={label}>
                  <label style={LBL}>{label}</label>
                  <input value={val} onChange={e=>setter(e.target.value)} placeholder="Name / Signature"
                    style={{ ...hdInpSt(val), borderStyle:"dashed", background:"rgba(255,255,255,0.85)" }} />
                </div>
              ))}
            </div>

            <div style={{ display:"flex", justifyContent:"flex-end", alignItems:"center", gap:10, flexWrap:"wrap" }}>
              {saveMsg && (
                <span className="toast" style={{ fontSize:12, fontWeight:700, color:"#065f46", background:"#d1fae5", border:"1px solid #6ee7b7", borderRadius:8, padding:"6px 14px" }}>{saveMsg}</span>
              )}
              <button className="sir-reset" onClick={handleReset}>
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5.635 15A8 8 0 1118.364 9"/></svg>
                Reset
              </button>
              <button className="sir-save" onClick={handleSave}>
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 3H7a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2z"/></svg>
                Save &amp; Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}