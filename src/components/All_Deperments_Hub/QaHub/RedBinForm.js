import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RedBinForm = () => {
  const navigate = useNavigate();

  // Initialize with today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    date: today,
    partNameModel: "",
    defectDetail: "",
    operation: "",
    totalRejQty: "",
    reason: "",
    actionTaken: "",
    responsiblePerson: "",
    targetDate: "",
    completionDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting to AOT-F-QC-02:", formData);
    alert("Red Bin Analysis Report Saved Successfully!");
  };

  const handleReset = () => {
    setFormData({
      date: today,
      partNameModel: "",
      defectDetail: "",
      operation: "",
      totalRejQty: "",
      reason: "",
      actionTaken: "",
      responsiblePerson: "",
      targetDate: "",
      completionDate: "",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      {/* Navigation Header */}
      <div className="max-w-5xl mx-auto mb-6">
        <button
          onClick={() => navigate("/qa-hub")}
          className="flex items-center text-sm font-bold text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg shadow-md transition-all active:scale-95 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to QA Hub
        </button>
      </div>

      {/* Main Form Card */}
      <div
        className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border-t-4"
        style={{ borderColor: "#f04343" }}
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-white to-red-50 p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-lg text-white shadow-lg shrink-0"
              style={{ backgroundColor: "#f04343" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-slate-800 m-0 uppercase tracking-tight">
                Red Bin Analysis Report
              </h2>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                DOC NO: AOT-F-QC-02
              </p>
            </div>
          </div>

          {/* Reverted Date Column - Exactly as requested */}
          <div className="bg-white border-2 border-red-100 rounded-lg p-3 flex flex-col items-center min-w-[140px] shadow-sm">
            <span className="text-[10px] font-black text-red-600 uppercase mb-1">
              Entry Date
            </span>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="text-sm font-bold text-slate-700 outline-none cursor-pointer bg-transparent"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 md:p-8">
          {/* Operation & Part Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase mb-2">Operation</label>
              <input
                name="operation"
                value={formData.operation}
                onChange={handleChange}
                type="text"
                placeholder="e.g. Pressing"
                className="w-full border-2 border-slate-100 bg-slate-50 rounded-lg p-2.5 focus:bg-white focus:border-slate-500 outline-none text-slate-700 transition-all font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase mb-2">Part Name / Model</label>
              <input
                name="partNameModel"
                value={formData.partNameModel}
                onChange={handleChange}
                type="text"
                className="w-full border-2 border-slate-100 bg-slate-50 rounded-lg p-2.5 focus:bg-white focus:border-slate-500 outline-none text-slate-700 transition-all font-semibold"
                placeholder="Enter Model"
                required
              />
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <label className="block text-xs font-black text-slate-500 uppercase mb-2">Total Rejection Qty</label>
              <div className="flex items-center">
                <input
                  name="totalRejQty"
                  value={formData.totalRejQty}
                  onChange={handleChange}
                  type="number"
                  className="w-full border-2 border-slate-100 bg-slate-50 rounded-l-lg p-2.5 focus:bg-white focus:border-slate-500 outline-none text-slate-700 transition-all font-semibold"
                  placeholder="0"
                  required
                />
                <span className="bg-slate-100 px-4 py-2.5 border-2 border-l-0 border-slate-100 rounded-r-lg text-slate-500 font-bold text-sm">
                  NOS
                </span>
              </div>
            </div>
          </div>

          {/* Analysis Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase mb-2">Defect Detail</label>
              <textarea
                name="defectDetail"
                value={formData.defectDetail}
                onChange={handleChange}
                rows="3"
                className="w-full border-2 border-slate-100 bg-slate-50 rounded-lg p-3 focus:bg-white focus:border-slate-500 outline-none text-slate-700 font-medium"
                placeholder="Describe what went wrong..."
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase mb-2">Root Cause / Reason</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="3"
                className="w-full border-2 border-slate-100 bg-slate-50 rounded-lg p-3 focus:bg-white focus:border-slate-500 outline-none text-slate-700 font-medium"
                placeholder="Why did this happen?"
                required
              ></textarea>
            </div>
          </div>

          {/* Action Taken */}
          <div className="border-2 border-red-50 p-5 rounded-xl mb-8 bg-red-50/10">
            <label className="block text-xs font-black text-red-600 uppercase mb-2">Corrective Action Taken</label>
            <textarea
              name="actionTaken"
              value={formData.actionTaken}
              onChange={handleChange}
              rows="2"
              className="w-full border-2 border-slate-200 rounded-lg p-3 focus:border-slate-500 outline-none text-slate-700"
              placeholder="Fixing steps..."
              required
            ></textarea>
          </div>

          {/* Responsibility Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase mb-2 italic">Responsible Person</label>
              <input
                name="responsiblePerson"
                value={formData.responsiblePerson}
                onChange={handleChange}
                type="text"
                placeholder="Name of In-charge"
                className="w-full border border-slate-300 rounded-lg p-2 focus:border-slate-500 outline-none text-slate-700"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase mb-2 italic">Target Date</label>
              <input
                name="targetDate"
                value={formData.targetDate}
                onChange={handleChange}
                type="date"
                className="w-full border border-slate-300 rounded-lg p-2 focus:border-slate-500 outline-none text-slate-700"
                required
              />
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <label className="block text-xs font-black text-slate-500 uppercase mb-2 italic">Completion Date</label>
              <input
                name="completionDate"
                value={formData.completionDate}
                onChange={handleChange}
                type="date"
                className="w-full border border-slate-300 rounded-lg p-2 focus:border-slate-500 outline-none text-slate-700"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center border-t border-slate-100 pt-6">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              AOT-F-QC-02 | Quality Analysis Standard
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2 rounded-lg font-bold text-slate-400 hover:text-red-500 transition-all text-sm uppercase"
              >
                Clear Form
              </button>
              <button
                type="submit"
                className="px-10 py-3 rounded-lg text-white shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-3 uppercase font-black tracking-widest text-[11px]"
                style={{ backgroundColor: "#f04343" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
                Submit Report
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RedBinForm;