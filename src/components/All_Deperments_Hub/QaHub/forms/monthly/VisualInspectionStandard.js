import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getMonthsFromNow() {
  const now = new Date();
  const months = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    months.push({
      label: `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`,
      value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
    });
  }
  return months;
}

const MONTHS = getMonthsFromNow();

const emptyRow = () => ({
  id: crypto.randomUUID(),
  partName: "",
  partNo: "",
  month: MONTHS[0].value,
  inspect: true,
});

export default function VisualInspectionStandard() {
  const [date, setDate] = useState("");
   const navigate = useNavigate();
  const [rows, setRows] = useState([emptyRow(), emptyRow(), emptyRow()]);

  useEffect(() => {
    setDate(new Date().toISOString().split("T")[0]);
  }, []);

  const updateRow = (id, field, value) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);

  const deleteRow = (id) => {
    if (rows.length === 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleReset = () => {
    if (window.confirm("Clear all entries?")) {
      setRows([emptyRow(), emptyRow(), emptyRow()]);
      setDate(new Date().toISOString().split("T")[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Visual Inspection Standard saved!");
  };

  const inspectCount = rows.filter((r) => r.inspect).length;
  const skipCount = rows.length - inspectCount;

  return (
    <div className="min-h-screen bg-[#f0f4f9] text-slate-700 font-sans pb-28">
       {/* Header Section */}
<div className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] px-4 md:px-8 py-6">
  <div className="max-w-7xl mx-auto flex items-center justify-between">

    {/* Left - Back Button */}
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-100 rounded-xl font-bold text-xs shadow-sm hover:bg-blue-50 transition-all"
    >
      <i className="bi bi-arrow-left text-[#3b82f6]"></i>
      Back to monthly hub
    </button>

    {/* Center - Logo + Title */}
    <div className="flex items-center gap-4">
      <img
        src="/logo1.jpg"
        alt="Company Logo"
        className="h-14 w-auto object-contain"
      />

      <h1 className="text-xl md:text-3xl font-black text-white tracking-tight uppercase text-center">
        Visual Inspection Standard
      </h1>
    </div>

    {/* Right - Date Picker */}
    <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded px-3 py-2 backdrop-blur-sm">
      <svg
        className="w-4 h-4 text-blue-200"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer"
        style={{ colorScheme: "dark" }}
      />
    </div>

  </div>
</div>

      {/* Summary Badges */}
      <div className="max-w-4xl mx-auto px-4 py-6 md:px-8 -mt-6 mb-6 flex gap-3 flex-wrap">
        <div className="bg-white rounded shadow-md px-5 py-3 flex items-center gap-3 border border-white">
          <span className="text-2xl font-black text-slate-800">{rows.length}</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Total<br/>Parts</span>
        </div>
        <div className="bg-white rounded shadow-md px-5 py-3 flex items-center gap-3 border border-emerald-100">
          <span className="text-2xl font-black text-emerald-600">{inspectCount}</span>
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-tight">To<br/>Inspect</span>
        </div>
        <div className="bg-white rounded shadow-md px-5 py-3 flex items-center gap-3 border border-slate-100">
          <span className="text-2xl font-black text-slate-400">{skipCount}</span>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-tight">Skip /<br/>Hold</span>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <form onSubmit={handleSubmit} className="space-y-4">

          {rows.map((row, idx) => (
            <div
              key={row.id}
              className={`bg-white rounded shadow-lg border-l-4 transition-all ${
                row.inspect ? "border-l-blue-500" : "border-l-slate-200 opacity-60"
              }`}
            >
              {/* Row Header */}
              <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded flex items-center justify-center font-black text-sm ${
                    row.inspect ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
                  }`}>
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Part Entry</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Inspect Toggle */}
                  <button
                    type="button"
                    onClick={() => updateRow(row.id, "inspect", !row.inspect)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-wider transition-all ${
                      row.inspect
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-400 border border-slate-200"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${row.inspect ? "bg-emerald-500" : "bg-slate-300"}`}/>
                    {row.inspect ? "Inspect" : "Skip"}
                  </button>

                  {/* Delete */}
                  {rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteRow(row.id)}
                      className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-red-50 rounded transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">

                {/* Part Name */}
                <div className="px-5 py-4 space-y-1.5">
                  <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                    Part Name
                  </label>
                  <input
                    required={row.inspect}
                    value={row.partName}
                    onChange={(e) => updateRow(row.id, "partName", e.target.value)}
                    placeholder="e.g. Inlet Pipe"
                    className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded focus:border-blue-400 focus:bg-white outline-none transition-all text-sm font-medium text-slate-800 placeholder-slate-300"
                  />
                </div>

                {/* Part Number */}
                <div className="px-5 py-4 space-y-1.5">
                  <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                    Part Number
                  </label>
                  <input
                    value={row.partNo}
                    onChange={(e) => updateRow(row.id, "partNo", e.target.value)}
                    placeholder="e.g. 68P00-S310050"
                    className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded focus:border-blue-400 focus:bg-white outline-none transition-all text-sm font-mono font-medium text-slate-600 placeholder-slate-300 tracking-wide"
                  />
                </div>

                {/* Planned Month */}
                <div className="px-5 py-4 space-y-1.5">
                  <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                    Planned Month
                  </label>
                  <select
                    value={row.month}
                    onChange={(e) => updateRow(row.id, "month", e.target.value)}
                    className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded focus:border-blue-400 focus:bg-white outline-none transition-all text-sm font-medium text-slate-700 appearance-none cursor-pointer"
                  >
                    {MONTHS.map((m) => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </div>

              </div>
            </div>
          ))}

          {/* Add Part Button */}
          <button
            type="button"
            onClick={addRow}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded text-slate-400 text-sm font-bold uppercase tracking-widest hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add Part
          </button>
        </form>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 shadow-2xl px-4 md:px-8 py-4 z-20">
        <div className="max-w-4xl mx-auto flex gap-3 justify-between items-center">
          <span className="hidden sm:block text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            {inspectCount} of {rows.length} parts marked for inspection
          </span>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 sm:flex-none px-6 py-3.5 bg-slate-100 text-slate-600 rounded font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition"
            >
              Reset
            </button>
            <button
              type="submit"
              form="lip-form"
              onClick={handleSubmit}
              className="flex-[2] sm:flex-none px-10 py-3.5 bg-blue-600 text-white rounded font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition"
            >
              Save Plan
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}