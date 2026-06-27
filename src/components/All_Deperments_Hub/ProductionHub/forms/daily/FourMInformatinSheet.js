import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Calendar,
  ClipboardList,
  Plus,
  Trash2,
  RotateCcw,
  Send,
  Loader2,
  Monitor,
  User,
  Settings,
  Package,
  Layers,
  Hash,
  Check,
  Clock,
  FileText,
} from "lucide-react";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const C = {
  pageBg: "#f5f5f0",
  white: "#ffffff",
  red: "#b91c1c",
  redLight: "#fef2f2",
  redBorder: "#fca5a5",
  redDark: "#991b1b",
  border: "#e2e2de",
  borderFoc: "#b91c1c",
  text: "#1a1a1a",
  textMid: "#6b7280",
  textLight: "#9ca3af",
  inputBg: "#ffffff",
  inputHov: "#fafaf8",
  rowHead: "#fafaf8",
  rowBorder: "#e8e4de",
  shadow: "0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.04)",
  green: "#16a34a",
};

// 櫨 Andar ka default data nikal diya gaya hai
const EMPTY_ROW = {
  time: "",
  machineNo: "",
  operatorName: "",
  man: "",
  machine: "",
  material: "",
  method: "",
  changeDescription: "",
};

const FourMInformatinSheet = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formDate, setFormDate] = useState("");
  const [preparedBy, setPreparedBy] = useState("");

  useEffect(() => {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();
    setFormDate(`${day}.${month}.${year}`);
  }, []);

  // 櫨 By default 3 ki jagah ab sirf 1 hi entry aayegi
  const [rows, setRows] = useState([
    { id: 1, ...EMPTY_ROW }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchReportData = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(`${BASE_URL}/api/get-single-production-report/four-m-information/${id}/`);
          
          if (response.data.success) {
            const data = response.data.data;
            
            setRows([
              {
                id: 1,
                time: data.time || "",
                machineNo: data.machine_no || "",
                operatorName: data.operator_name || "",
                man: data.man || "",
                machine: data.machine || "",
                material: data.material || "",
                method: data.method || "",
                changeDescription: data.change_description || "",
              }
            ]);
            
            setPreparedBy(data.prepared_by || "");
          }
        } catch (error) {
          console.error("Error fetching report data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchReportData();
    }
  }, [id]);

  const handleAddRow = () => {
    if (id) return;
    const nextId = rows.length > 0 ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
    setRows((prev) => [...prev, { id: nextId, ...EMPTY_ROW }]);
  };

  const handleDeleteRow = (rowId) => {
    if (id) return;
    if (rows.length === 1) return;
    setRows((prev) => prev.filter((r) => r.id !== rowId));
  };

  const handleChange = (rowId, field, value) => {
    if (id) return;
    setRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, [field]: value } : row))
    );
  };

  // 櫨 Reset karne par bhi ab sirf 1 hi entry dikhegi
  const handleReset = () => {
    if (id) return;
    setRows([{ id: 1, ...EMPTY_ROW }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) return;

    // Validation update: checked with 'time' instead of 'date'
    const filledRows = rows.filter((r) => r.machineNo || r.operatorName || r.time);
    if (filledRows.length === 0) {
      alert("Please fill at least one entry before submitting.");
      return;
    }

    const payload = filledRows.map((row, idx) => ({
      s_no: idx + 1,
      time: row.time,
      machine_no: row.machineNo,
      operator_name: row.operatorName,
      man: row.man,
      machine: row.machine,
      material: row.material,
      method: row.method,
      change_description: row.changeDescription,
    }));

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/save-4m-information-sheet/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entries: payload,
          prepared_by: preparedBy,
          submitted_by: localStorage.getItem("username") || preparedBy || "Unknown User",
        }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        alert(result.message || "Information Sheet saved successfully!");
        handleReset();
      } else {
        alert("Error: " + (result.error || "Please check console."));
      }
    } catch (err) {
      alert("Failed to connect to the server. Make sure Django is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen p-4"
      style={{
        background: C.pageBg,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors text-sm font-bold bg-white px-4 py-2 border border-red-200 shadow-sm rounded-none tracking-wide uppercase"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              background: C.white,
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              overflow: "hidden",
              boxShadow: C.shadow,
            }}
          >
            {/* Header */}
            <div
              style={{
                background: C.red,
                padding: "20px 28px",
                borderBottom: `1px solid ${C.redDark}`,
              }}
            >
              <div className="hidden sm:flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <ClipboardList className="h-6 w-6 text-white/90" />
                  <h1 className="text-xl md:text-2xl font-bold text-white tracking-widest uppercase">
                    {id ? "Information Sheet (REVIEW)" : "Information Sheet"}
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-white font-bold text-sm bg-red-700/40 px-4 py-2 rounded-none border border-white/30 shadow-sm">
                  <Calendar className="h-4 w-4" />
                  {formDate}
                </div>
              </div>
              <div className="sm:hidden flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-white/90" />
                  <h1 className="text-lg font-bold text-white text-center tracking-widest uppercase">
                    {id ? "Information Sheet (REVIEW)" : "Information Sheet"}
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-white font-bold text-sm bg-red-700/40 px-4 py-2 border border-white/30 shadow-sm rounded-none">
                  <Calendar className="h-4 w-4" />
                  {formDate}
                </div>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6 space-y-6">
              {rows.map((row, idx) => (
                <div
                  key={row.id}
                  style={{
                    border: `1px solid ${C.rowBorder}`,
                    borderRadius: 8,
                    overflow: "hidden",
                    background: C.white,
                    boxShadow: "0 1px 4px rgba(0,0,0,.04)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: C.rowHead,
                      borderBottom: `1px solid ${C.rowBorder}`,
                      padding: "10px 16px",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="h-3.5 w-3.5 text-red-500" />
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                        Entry {idx + 1}
                      </span>
                    </div>
                    {!id && (
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(row.id)}
                        disabled={rows.length === 1}
                        className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 border border-red-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-none font-bold uppercase tracking-wide"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Fields inside card */}
                  <div className="p-4 space-y-4">
                    
                    {/* Row 1: Time Only */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                          <Clock className="inline h-3.5 w-3.5 mr-1 text-red-500" />
                          Time
                        </label>
                        <input
                          type="time"
                          value={row.time}
                          onChange={(e) => handleChange(row.id, "time", e.target.value)}
                          readOnly={!!id}
                          style={{
                            width: "100%", padding: "10px 13px", fontSize: 13,
                            background: id ? "#f9f9f7" : C.inputBg, color: id ? C.textMid : C.text,
                            cursor: id ? "not-allowed" : "text", border: `1.5px solid ${C.border}`,
                            borderRadius: 6, outline: "none", transition: "all .15s",
                          }}
                        />
                      </div>
                    </div>

                    {/* Row 2: Machine No. + Operator Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                          <Monitor className="inline h-3.5 w-3.5 mr-1 text-red-500" />
                          Machine No.
                        </label>
                        <input
                          type="text"
                          value={row.machineNo}
                          onChange={(e) => handleChange(row.id, "machineNo", e.target.value)}
                          placeholder="e.g. MC-101"
                          readOnly={!!id}
                          style={{
                            width: "100%", padding: "10px 13px", fontSize: 13,
                            background: id ? "#f9f9f7" : C.inputBg, color: id ? C.textMid : C.text,
                            cursor: id ? "not-allowed" : "text", border: `1.5px solid ${C.border}`,
                            borderRadius: 6, outline: "none", transition: "all .15s",
                          }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                          <User className="inline h-3.5 w-3.5 mr-1 text-red-500" />
                          Operator Name
                        </label>
                        <input
                          type="text"
                          value={row.operatorName}
                          onChange={(e) => handleChange(row.id, "operatorName", e.target.value)}
                          placeholder="Enter operator name"
                          readOnly={!!id}
                          style={{
                            width: "100%", padding: "10px 13px", fontSize: 13,
                            background: id ? "#f9f9f7" : C.inputBg, color: id ? C.textMid : C.text,
                            cursor: id ? "not-allowed" : "text", border: `1.5px solid ${C.border}`,
                            borderRadius: 6, outline: "none", transition: "all .15s",
                          }}
                        />
                      </div>
                    </div>

                    {/* Row 3: Man + Machine (RADIO BUTTONS) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                          <User className="inline h-3.5 w-3.5 mr-1 text-red-500" />
                          Man
                        </label>
                        <div 
                          className="flex items-center gap-6 px-4" 
                          style={{
                            height: "41px", background: id ? "#f9f9f7" : C.inputBg,
                            border: `1.5px solid ${C.border}`, borderRadius: 6
                          }}
                        >
                          <label className={`flex items-center gap-2 ${id ? 'opacity-70 pointer-events-none' : 'cursor-pointer'}`}>
                            <input 
                              type="radio" name={`man-${row.id}`} value="Change"
                              checked={row.man === "Change"} 
                              onChange={(e) => handleChange(row.id, "man", e.target.value)}
                              disabled={!!id} className="accent-red-600 w-4 h-4"
                            />
                            <span className="text-sm font-medium text-slate-700">Change</span>
                          </label>
                          <label className={`flex items-center gap-2 ${id ? 'opacity-70 pointer-events-none' : 'cursor-pointer'}`}>
                            <input 
                              type="radio" name={`man-${row.id}`} value="No Change"
                              checked={row.man === "No Change"} 
                              onChange={(e) => handleChange(row.id, "man", e.target.value)}
                              disabled={!!id} className="accent-red-600 w-4 h-4"
                            />
                            <span className="text-sm font-medium text-slate-700">No Change</span>
                          </label>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                          <Settings className="inline h-3.5 w-3.5 mr-1 text-red-500" />
                          Machine
                        </label>
                        <div 
                          className="flex items-center gap-6 px-4" 
                          style={{
                            height: "41px", background: id ? "#f9f9f7" : C.inputBg,
                            border: `1.5px solid ${C.border}`, borderRadius: 6
                          }}
                        >
                          <label className={`flex items-center gap-2 ${id ? 'opacity-70 pointer-events-none' : 'cursor-pointer'}`}>
                            <input 
                              type="radio" name={`machine-${row.id}`} value="Change"
                              checked={row.machine === "Change"} 
                              onChange={(e) => handleChange(row.id, "machine", e.target.value)}
                              disabled={!!id} className="accent-red-600 w-4 h-4"
                            />
                            <span className="text-sm font-medium text-slate-700">Change</span>
                          </label>
                          <label className={`flex items-center gap-2 ${id ? 'opacity-70 pointer-events-none' : 'cursor-pointer'}`}>
                            <input 
                              type="radio" name={`machine-${row.id}`} value="No Change"
                              checked={row.machine === "No Change"} 
                              onChange={(e) => handleChange(row.id, "machine", e.target.value)}
                              disabled={!!id} className="accent-red-600 w-4 h-4"
                            />
                            <span className="text-sm font-medium text-slate-700">No Change</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Row 4: Material + Method (RADIO BUTTONS) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                          <Package className="inline h-3.5 w-3.5 mr-1 text-red-500" />
                          Material
                        </label>
                        <div 
                          className="flex items-center gap-6 px-4" 
                          style={{
                            height: "41px", background: id ? "#f9f9f7" : C.inputBg,
                            border: `1.5px solid ${C.border}`, borderRadius: 6
                          }}
                        >
                          <label className={`flex items-center gap-2 ${id ? 'opacity-70 pointer-events-none' : 'cursor-pointer'}`}>
                            <input 
                              type="radio" name={`material-${row.id}`} value="Change"
                              checked={row.material === "Change"} 
                              onChange={(e) => handleChange(row.id, "material", e.target.value)}
                              disabled={!!id} className="accent-red-600 w-4 h-4"
                            />
                            <span className="text-sm font-medium text-slate-700">Change</span>
                          </label>
                          <label className={`flex items-center gap-2 ${id ? 'opacity-70 pointer-events-none' : 'cursor-pointer'}`}>
                            <input 
                              type="radio" name={`material-${row.id}`} value="No Change"
                              checked={row.material === "No Change"} 
                              onChange={(e) => handleChange(row.id, "material", e.target.value)}
                              disabled={!!id} className="accent-red-600 w-4 h-4"
                            />
                            <span className="text-sm font-medium text-slate-700">No Change</span>
                          </label>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                          <Layers className="inline h-3.5 w-3.5 mr-1 text-red-500" />
                          Method
                        </label>
                        <div 
                          className="flex items-center gap-6 px-4" 
                          style={{
                            height: "41px", background: id ? "#f9f9f7" : C.inputBg,
                            border: `1.5px solid ${C.border}`, borderRadius: 6
                          }}
                        >
                          <label className={`flex items-center gap-2 ${id ? 'opacity-70 pointer-events-none' : 'cursor-pointer'}`}>
                            <input 
                              type="radio" name={`method-${row.id}`} value="Change"
                              checked={row.method === "Change"} 
                              onChange={(e) => handleChange(row.id, "method", e.target.value)}
                              disabled={!!id} className="accent-red-600 w-4 h-4"
                            />
                            <span className="text-sm font-medium text-slate-700">Change</span>
                          </label>
                          <label className={`flex items-center gap-2 ${id ? 'opacity-70 pointer-events-none' : 'cursor-pointer'}`}>
                            <input 
                              type="radio" name={`method-${row.id}`} value="No Change"
                              checked={row.method === "No Change"} 
                              onChange={(e) => handleChange(row.id, "method", e.target.value)}
                              disabled={!!id} className="accent-red-600 w-4 h-4"
                            />
                            <span className="text-sm font-medium text-slate-700">No Change</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Row 5: Change Description */}
                    <div className="grid grid-cols-1 gap-5">
                      <div className="flex flex-col">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                          <FileText className="inline h-3.5 w-3.5 mr-1 text-red-500" />
                          Change Description
                        </label>
                        <input
                          type="text"
                          value={row.changeDescription}
                          onChange={(e) => handleChange(row.id, "changeDescription", e.target.value)}
                          placeholder="Enter change description"
                          readOnly={!!id}
                          style={{
                            width: "100%", padding: "10px 13px", fontSize: 13,
                            background: id ? "#f9f9f7" : C.inputBg, color: id ? C.textMid : C.text,
                            cursor: id ? "not-allowed" : "text", border: `1.5px solid ${C.border}`,
                            borderRadius: 6, outline: "none", transition: "all .15s",
                          }}
                        />
                      </div>
                    </div>

                  </div>
                </div>
              ))}

              {!id && (
                <div>
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors text-sm font-bold bg-white px-4 py-2 border border-red-200 shadow-sm rounded-none tracking-wide uppercase"
                  >
                    <Plus className="h-4 w-4" />
                    Add Entry
                  </button>
                  <span className="ml-3 text-xs text-slate-400">
                    {rows.length} entr{rows.length !== 1 ? "ies" : "y"} total
                  </span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-200">
                <div style={{ minWidth: 200, alignSelf: 'flex-start' }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: ".12em",
                      textTransform: "uppercase",
                      color: C.textMid,
                      marginBottom: 6,
                    }}
                  >
                    Prepared By
                  </div>
                  <input
                    type="text"
                    value={preparedBy}
                    onChange={(e) => setPreparedBy(e.target.value)}
                    readOnly={!!id}
                    placeholder="Enter name"
                    style={{
                      width: 220, padding: "8px 12px", fontSize: 13,
                      background: id ? "#f9f9f7" : C.inputBg, color: id ? C.textMid : C.text,
                      cursor: id ? "not-allowed" : "text", border: `1.5px solid ${C.border}`,
                      borderRadius: 6, outline: "none",
                    }}
                  />
                </div>

                <div className="flex gap-4">
                  {id ? (
                    <button
                      type="button"
                      onClick={() => alert("Report Approved Successfully!")}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        background: C.green, border: "none", color: "#fff",
                        padding: "11px 28px", fontSize: 12, fontWeight: 700,
                        letterSpacing: ".1em", textTransform: "uppercase",
                        borderRadius: 6, cursor: "pointer", fontFamily: "inherit",
                        transition: "background .15s", boxShadow: "0 2px 8px rgba(22,163,74,.35)",
                      }}
                    >
                      <Check size={14} strokeWidth={2.5} /> APPROVE REPORT
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={handleReset}
                        disabled={isLoading}
                        className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-white text-slate-700 px-6 py-3 hover:bg-slate-50 transition-all font-bold tracking-widest border-2 border-slate-300 text-sm disabled:opacity-50 rounded-none uppercase"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Reset Form
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-[#e03131] text-white px-8 py-3 hover:bg-[#c92a2a] transition-all shadow-sm font-bold tracking-widest text-sm disabled:opacity-70 disabled:cursor-not-allowed rounded-none uppercase"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                        {isLoading ? "Submitting..." : "Submit Board"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FourMInformatinSheet;