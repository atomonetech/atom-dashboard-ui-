import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import { CiCalendarDate } from "react-icons/ci";
import { IoMdArrowBack, IoIosArrowDown } from "react-icons/io";

const today = new Date();
const formattedDate = `${String(today.getDate()).padStart(2,'0')}-${String(today.getMonth()+1).padStart(2,'0')}-${today.getFullYear()}`;
const currentMonth = today.toLocaleString('default', { month: 'long' });
const currentYear  = today.getFullYear();

const DESIGNATIONS = [
  "Quality Engineer","Production Engineer","Operator","Supervisor",
  "Store Incharge","CFT Member","Rework Operator","Quality Inspector",
];

const NAMES = [
  "Rahul Sharma","Priya Patel","Amit Verma","Sunita Yadav",
  "Rajesh Kumar","Neha Singh","Vikram Joshi","Pooja Desai",
  "Manoj Tiwari","Kavita Mehta",
];

/* ── SelectWrapper ── */
const SelectWrapper = ({ children, color = "#f59e0b" }) => (
  <div style={{ position: "relative", width: "100%" }}>
    {children}
    <IoIosArrowDown style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: color, fontSize: 16, pointerEvents: "none" }} />
  </div>
);

export default function RedbinAttendance() {
  const navigate = useNavigate();

  const [selectedName, setSelectedName] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [rows, setRows] = useState([]);

  const handleNameChange = (name) => {
    setSelectedName(name);
    if (name && selectedDesignation) {
      setRows(p => [...p, { name, designation: selectedDesignation, attendance: {} }]);
      setSelectedName("");
      setSelectedDesignation("");
    }
  };

  const handleDesignationChange = (designation) => {
    setSelectedDesignation(designation);
    if (selectedName && designation) {
      setRows(p => [...p, { name: selectedName, designation, attendance: {} }]);
      setSelectedName("");
      setSelectedDesignation("");
    }
  };

  const updateAttendance = (i, day, val) => {
    setRows(p => p.map((r, idx) => {
      if (idx !== i) return r;
      return { ...r, attendance: { ...r.attendance, [day]: val } };
    }));
  };

  const removeRow = (i) => setRows(p => p.filter((_, idx) => idx !== i));

  const lbl = { 
    fontSize: 11, fontWeight: 700, letterSpacing: "0.07em", 
    color: "#000000",  // ← BLACK
    textTransform: "uppercase", marginBottom: 6, display: "block", 
    fontFamily: "'DM Sans',sans-serif" 
  };
  
  const sel = (v) => ({ 
    width: "100%", 
    padding: "11px 32px 11px 14px", 
    border: `1.5px solid ${v ? "#f59e0b" : "#fde68a"}`, 
    borderRadius: 10, fontSize: 14, fontWeight: v ? 600 : 400, 
    background: v ? "#fffbeb" : "#f8fafc", 
    color: "#000000",  // ← BLACK always
    outline: "none", cursor: "pointer", 
    fontFamily: "'DM Sans',sans-serif", 
    boxSizing: "border-box", 
    transition: "border-color 0.2s",
    WebkitAppearance: "none",
    appearance: "none"
  });

  const attSel = (val) => ({
    width: 50, padding: "5px 4px",
    border: `1.5px solid ${val === "P" ? "#f59e0b" : val === "A" ? "#fca5a5" : "#fde68a"}`,
    borderRadius: 6, fontSize: 12, fontWeight: 700,
    background: val === "P" ? "#fffbeb" : val === "A" ? "#fee2e2" : "#fff",
    color: "#000000",  // ← BLACK always
    outline: "none", cursor: "pointer",
    fontFamily: "'DM Sans',sans-serif",
    WebkitAppearance: "none", appearance: "none"
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans',sans-serif", padding: "16px 10px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        /* ── Dropdown options: black text, white background ── */
        select option {
          color: #000000 !important;
          background: #ffffff !important;
          font-weight: 500;
        }

        .redbin-filter-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 22px; padding: 22px 28px; }
        .redbin-topbar { display: flex; align-items: center; justify-content: space-between; padding: 17px 28px; border-bottom: 1px solid #fef3c7; background: linear-gradient(90deg,#fffbeb,#fffdf5); flex-wrap: wrap; gap: 10px; }
        .redbin-topbar-left { display: flex; align-items: center; gap: 12px; }
        .redbin-title { font-weight: 800; font-size: 16px; color: #000000; display: block; }
        .redbin-subtitle { font-size: 11px; color: #000000; font-weight: 600; }
        .redbin-date-badge { display: flex; align-items: center; gap: 8px; border: 1.5px solid #f59e0b; border-radius: 10px; padding: 6px 14px; background: #f8fafc; flex-shrink: 0; }
        .redbin-table-wrap { overflow-x: auto; border-radius: 10px; border: 2px solid #92400e; box-shadow: 0 4px 16px rgba(146,64,14,0.08); margin-bottom: 14px; -webkit-overflow-scrolling: touch; }
        @media (max-width: 640px) {
          .redbin-filter-grid { grid-template-columns: 1fr; gap: 14px; padding: 16px 14px; }
          .redbin-topbar { padding: 13px 14px; }
          .redbin-title { font-size: 13px; }
          .redbin-subtitle { font-size: 10px; }
          .redbin-date-badge { padding: 5px 10px; }
          .redbin-date-badge span { font-size: 12px !important; }
          .redbin-card { border-radius: 14px !important; margin-bottom: 14px !important; }
          .redbin-table-section { padding: 14px 10px !important; }
          .redbin-sheet-title { font-size: 12px !important; }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          .redbin-filter-grid { grid-template-columns: 1fr 1fr; gap: 16px; padding: 18px 20px; }
          .redbin-topbar { padding: 14px 20px; }
        }
      `}</style>

      {/* ── FILTER CARD ── */}
      <div className="redbin-card" style={{ width: "100%", maxWidth: 1100, background: "#fff", borderRadius: 18, boxShadow: "0 4px 24px rgba(245,158,11,0.10)", border: "1.5px solid #fde68a", overflow: "hidden", marginBottom: 20 }}>

        {/* Topbar */}
        <div className="redbin-topbar">
          <div className="redbin-topbar-left">
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }} onClick={() => navigate(-1)}>
              <IoMdArrowBack size={22} color="#f59e0b" />
            </div>
            <div>
              <span className="redbin-title">Red Bin Attendance Sheet</span>
              <span className="redbin-subtitle">Form No: AOT/F/QC/05 &nbsp;·&nbsp; Resp: Quality Engineer</span>
            </div>
          </div>
          <div className="redbin-date-badge">
            <span style={{ fontWeight: 800, fontSize: 14, color: "#000000", letterSpacing: "0.5px" }}>{formattedDate}</span>
            <CiCalendarDate size={20} color="#92400e" />
          </div>
        </div>

        {/* 3 Fields */}
        <div className="redbin-filter-grid">
          <div>
            <label style={lbl}>Name :-</label>
            <SelectWrapper>
              <select value={selectedName} onChange={e => handleNameChange(e.target.value)} style={sel(selectedName)}>
                <option value="">Select Name...</option>
                {NAMES.map(n => <option key={n}>{n}</option>)}
              </select>
            </SelectWrapper>
          </div>
          <div>
            <label style={lbl}>Designation :-</label>
            <SelectWrapper>
              <select value={selectedDesignation} onChange={e => handleDesignationChange(e.target.value)} style={sel(selectedDesignation)}>
                <option value="">Select Designation...</option>
                {DESIGNATIONS.map(d => <option key={d}>{d}</option>)}
              </select>
            </SelectWrapper>
          </div>
          <div>
            <label style={lbl}>Month :-</label>
            <div style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #f59e0b", borderRadius: 10, fontSize: 14, fontWeight: 700, background: "#f8fafc", color: "#000000", fontFamily: "'DM Sans',sans-serif", boxSizing: "border-box" }}>
              {currentMonth} {currentYear}
            </div>
          </div>
        </div>

        {rows.length === 0 && (
          <div style={{ padding: "0 14px 14px" }}>
            <span style={{ fontSize: 12, color: "#000000", fontWeight: 600 }}>⚡ Select Name & Designation — row will be added automatically</span>
          </div>
        )}
      </div>
      

      {/* ── ATTENDANCE TABLE ── */}
      {rows.length > 0 && (
        <div style={{ width: "100%", maxWidth: 1100, background: "#fff", borderRadius: 18, boxShadow: "0 6px 32px rgba(245,158,11,0.12)", border: "1.5px solid #fcd34d", overflow: "hidden" }}>
          <div className="redbin-table-section" style={{ padding: "20px 24px" }}>
            <div style={{ marginBottom: 14 }}>
              <span className="redbin-sheet-title" style={{ fontWeight: 800, fontSize: 14, color: "#000000", display: "flex", alignItems: "center", gap: 6 }}>
                <ClipboardList size={16} color="#78350f" />
                Attendance Sheet — {currentMonth} {currentYear}
              </span>
            </div>
            <div className="redbin-table-wrap">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr style={{ background: "#92400e" }}>
                    <th style={{ padding: "10px 8px", color: "#fff", fontWeight: 700, fontSize: 11, textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.2)", minWidth: 36 }}>SR.</th>
                    <th style={{ padding: "10px 8px", color: "#fff", fontWeight: 700, fontSize: 11, textAlign: "left", borderRight: "1px solid rgba(255,255,255,0.2)", minWidth: 130 }}>NAME</th>
                    <th style={{ padding: "10px 8px", color: "#fff", fontWeight: 700, fontSize: 11, textAlign: "left", borderRight: "1px solid rgba(255,255,255,0.2)", minWidth: 120 }}>DESIGNATION</th>
                    <th style={{ padding: "8px 10px", color: "#fff", fontWeight: 700, fontSize: 11, textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.15)", minWidth: 50, background: "#b45309" }}>
                      {today.getDate()} {currentMonth.slice(0,3)}
                    </th>
                    <th style={{ padding: "10px 4px", color: "#fff", fontWeight: 700, fontSize: 10, textAlign: "center", background: "#7f1d1d", minWidth: 28 }}>–</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => {
                    const day = today.getDate();
                    const val = row.attendance[day] || "";
                    return (
                      <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fffbeb" }}>
                        <td style={{ padding: "8px 4px", borderBottom: "1px solid #fef3c7", borderRight: "1px solid #fef3c7", textAlign: "center", fontWeight: 800, color: "#000000", fontSize: 12 }}>{i+1}</td>
                        <td style={{ padding: "8px 10px", borderBottom: "1px solid #fef3c7", borderRight: "1px solid #fef3c7", fontWeight: 700, color: "#000000", fontSize: 12, whiteSpace: "nowrap" }}>{row.name}</td>
                        <td style={{ padding: "8px 10px", borderBottom: "1px solid #fef3c7", borderRight: "1px solid #fef3c7", fontWeight: 600, color: "#000000", fontSize: 11, whiteSpace: "nowrap" }}>{row.designation}</td>
                        <td style={{ padding: "4px 8px", borderBottom: "1px solid #fef3c7", borderRight: "1px solid #fef3c7", textAlign: "center" }}>
                          <SelectWrapper color={val === "P" ? "#92400e" : val === "A" ? "#991b1b" : "#9ca3af"}>
                            <select value={val} onChange={e => updateAttendance(i, day, e.target.value)} style={attSel(val)}>
                              <option value="">—</option>
                              <option value="P">P</option>
                              <option value="A">A</option>
                            </select>
                          </SelectWrapper>
                        </td>
                        <td style={{ padding: "4px", borderBottom: "1px solid #fef3c7", textAlign: "center" }}>
                          <button onClick={() => removeRow(i)} style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid #fecaca", background: "#fff", color: "#dc2626", cursor: "pointer", fontWeight: 700, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>✕</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}