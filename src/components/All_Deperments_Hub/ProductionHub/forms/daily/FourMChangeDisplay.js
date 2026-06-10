import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const EMPTY_ROW = {
  machineNo: "",
  operatorName: "",
  man: "",
  machine: "",
  material: "",
  method: "",
};

const FourMDisplayBoard = () => {
  const navigate = useNavigate();

  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();
  const formattedDate = `${day}.${month}.${year}`;

  const [rows, setRows] = useState(
    Array.from({ length: 3 }, (_, i) => ({ id: i + 1, ...EMPTY_ROW }))
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleAddRow = () => {
    const nextId = rows.length > 0 ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
    setRows((prev) => [...prev, { id: nextId, ...EMPTY_ROW }]);
  };

  const handleDeleteRow = (id) => {
    if (rows.length === 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleChange = (id, field, value) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleReset = () => {
    setRows(Array.from({ length: 3 }, (_, i) => ({ id: i + 1, ...EMPTY_ROW })));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filledRows = rows.filter((r) => r.machineNo || r.operatorName);
    if (filledRows.length === 0) {
      alert("Please fill at least one entry before submitting.");
      return;
    }

    const payload = filledRows.map((row, idx) => ({
      s_no: idx + 1,
      machine_no: row.machineNo,
      operator_name: row.operatorName,
      man: row.man,
      machine: row.machine,
      material: row.material,
      method: row.method,
    }));

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/save-4m-display/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: payload }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        alert(result.message || "4M Display Board saved successfully!");
        handleReset();
      } else {
        alert("Error: " + (result.error || "Please check console."));
      }
    } catch (err) {
      console.error("Network Error:", err);
      alert("Failed to connect to the server. Make sure Django is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans">
      <div className="max-w-4xl mx-auto">

        {/* Back Button */}
        <div className="mb-4 flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate("/production-hub")}
            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors text-sm font-bold bg-white px-4 py-2 border border-red-200 shadow-sm rounded-none tracking-wide"
          >
            <ArrowLeft className="h-4 w-4" />
            BACK TO PRODUCTION HUB
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-none shadow-md border border-gray-200 overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-5 border-b border-red-300">
              <div className="hidden sm:flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <ClipboardList className="h-6 w-6 text-white/90" />
                  <h1 className="text-xl md:text-2xl font-bold text-white tracking-widest uppercase">
                    4M Change Display Board
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-white font-bold text-sm bg-red-700/40 px-4 py-2 rounded-none border border-white/30 shadow-sm">
                  <Calendar className="h-4 w-4" />
                  {formattedDate}
                </div>
              </div>
              <div className="sm:hidden flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-white/90" />
                  <h1 className="text-lg font-bold text-white text-center tracking-widest uppercase">
                    4M Change Display Board
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-white font-bold text-sm bg-red-700/40 px-4 py-2 border border-white/30 shadow-sm rounded-none">
                  <Calendar className="h-4 w-4" />
                  {formattedDate}
                </div>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6 space-y-6">

              {rows.map((row, idx) => (
                <div
                  key={row.id}
                  className="border border-slate-200 rounded-none bg-white shadow-sm"
                >
                  {/* Entry Header — S.No + Delete */}
                  <div className="flex items-center justify-between bg-slate-100 border-b border-slate-200 px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Hash className="h-3.5 w-3.5 text-red-500" />
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                        Entry {idx + 1}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteRow(row.id)}
                      disabled={rows.length === 1}
                      className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 border border-red-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-none font-bold uppercase tracking-wide"
                    >
                      <Trash2 className="h-3 w-3" />
                      Remove
                    </button>
                  </div>

                  {/* Fields inside card */}
                  <div className="p-4 space-y-4">

                    {/* Row 1: Machine No. + Operator Name */}
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
                          className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-700 placeholder-slate-400 transition-colors"
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
                          className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-700 placeholder-slate-400 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Row 2: Man + Machine */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                          <User className="inline h-3.5 w-3.5 mr-1 text-red-500" />
                          Man
                        </label>
                        <input
                          type="text"
                          value={row.man}
                          onChange={(e) => handleChange(row.id, "man", e.target.value)}
                          placeholder="Enter man detail"
                          className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-700 placeholder-slate-400 transition-colors"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                          <Settings className="inline h-3.5 w-3.5 mr-1 text-red-500" />
                          Machine
                        </label>
                        <input
                          type="text"
                          value={row.machine}
                          onChange={(e) => handleChange(row.id, "machine", e.target.value)}
                          placeholder="Enter machine detail"
                          className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-700 placeholder-slate-400 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Row 3: Material + Method */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                          <Package className="inline h-3.5 w-3.5 mr-1 text-red-500" />
                          Material
                        </label>
                        <input
                          type="text"
                          value={row.material}
                          onChange={(e) => handleChange(row.id, "material", e.target.value)}
                          placeholder="Enter material detail"
                          className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-700 placeholder-slate-400 transition-colors"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                          <Layers className="inline h-3.5 w-3.5 mr-1 text-red-500" />
                          Method
                        </label>
                        <input
                          type="text"
                          value={row.method}
                          onChange={(e) => handleChange(row.id, "method", e.target.value)}
                          placeholder="Enter method detail"
                          className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-700 placeholder-slate-400 transition-colors"
                        />
                      </div>
                    </div>

                  </div>
                </div>
              ))}

              {/* Add Entry Button */}
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

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-slate-200">
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
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {isLoading ? "Submitting..." : "Submit Board"}
                </button>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FourMDisplayBoard;