import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ScrapNoteForm = () => {
  const navigate = useNavigate();

  // Initialize with today's date (YYYY-MM-DD)
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    date: today,
    partName: "",
    model: "",
    defect: "",
    process: "",
    qty: "",
    remark: "",
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
    console.log("Saving Scrap Entry:", formData);
    alert("Scrap Entry Saved Successfully!");
  };

  const handleClear = () => {
    setFormData({
      date: today,
      partName: "",
      model: "",
      defect: "",
      process: "",
      qty: "",
      remark: "",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      {/* Header / Navigation */}
      <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between">
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back to QA Hub
        </button>

        <div className="text-right">
          <span className="text-xs font-bold text-slate-400 block uppercase tracking-widest">
            Doc No: AOT-F-QC-04
          </span>
          <span className="text-xs font-black text-red-500 uppercase">
            Scrap Register
          </span>
        </div>
      </div>

      {/* Main Form Card */}
      <div
        className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border-t-4"
        style={{ borderColor: "#f04343" }}
      >
        {/* Title & Date Section (Main Heading) */}
        <div className="bg-gradient-to-r from-white to-red-50 p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            {/* Updated Icon: Cross instead of Delete */}
            <div
              className="p-3 rounded-lg text-white shadow-lg"
              style={{ backgroundColor: "#f04343" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 m-0 uppercase tracking-tight">
                Scrap Entry Form
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                Quality Assurance & Production Control
              </p>
            </div>
          </div>

          {/* Date Side Column in Header */}
          <div className="bg-white border-2 border-red-100 rounded-lg p-3 flex flex-col items-center min-w-[150px] shadow-sm">
            <span className="text-[10px] font-black text-red-600 uppercase mb-1 tracking-tighter">
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

        <form onSubmit={handleSubmit} className="p-8">
          {/* Row 1: Process and Part Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wider">
                Process
              </label>
              <input
                name="process"
                value={formData.process}
                onChange={handleChange}
                type="text"
                placeholder="e.g. Welding, Stamping"
                className="w-full border-2 border-slate-100 bg-slate-50 rounded-lg p-2.5 focus:bg-white focus:border-slate-500 outline-none text-slate-700 transition-all font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wider">
                Qty (Nos)
              </label>
              <div className="flex items-center">
                <input
                  name="qty"
                  value={formData.qty}
                  onChange={handleChange}
                  type="number"
                  className="w-full border-2 border-slate-100 bg-slate-50 rounded-l-lg p-2.5 focus:bg-white focus:border-slate-500 outline-none text-slate-700 transition-all font-semibold text-center"
                  placeholder="0"
                  required
                />
                <span className="bg-slate-100 px-4 py-2.5 border-2 border-l-0 border-slate-100 rounded-r-lg text-slate-500 font-bold text-sm">
                  NOS
                </span>
              </div>
            </div>
          </div>

          {/* Row 2: Part Info */}
          <div className="bg-slate-50 p-6 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 border border-slate-200">
            <div>
              <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wider">
                Part Name
              </label>
              <input
                name="partName"
                value={formData.partName}
                onChange={handleChange}
                type="text"
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 outline-none text-slate-700 focus:border-slate-500 transition-all font-semibold"
                placeholder="Enter Part Name"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wider">
                Model
              </label>
              <input
                name="model"
                value={formData.model}
                onChange={handleChange}
                type="text"
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 outline-none text-slate-700 focus:border-slate-500 transition-all font-semibold"
                placeholder="e.g. V-01"
                required
              />
            </div>
          </div>

          {/* Row 3: Defect and Remark */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wider">
                Defect Detail
              </label>
              <textarea
                name="defect"
                value={formData.defect}
                onChange={handleChange}
                rows="3"
                className="w-full border-2 border-slate-100 bg-slate-50 rounded-lg p-3 focus:bg-white focus:border-slate-500 outline-none text-slate-700 font-medium transition-all"
                placeholder="Describe the defect..."
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 mb-2 uppercase tracking-wider">
                Remark
              </label>
              <textarea
                name="remark"
                value={formData.remark}
                onChange={handleChange}
                rows="3"
                className="w-full border-2 border-slate-100 bg-slate-50 rounded-lg p-3 focus:bg-white focus:border-slate-500 outline-none text-slate-700 font-medium transition-all"
                placeholder="Additional notes..."
              ></textarea>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-end border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={handleClear}
              className="px-6 py-2 rounded-lg font-bold text-slate-400 hover:text-red-500 transition-all text-sm uppercase"
            >
              Clear Fields
            </button>
            <button
              type="submit"
              className="px-10 py-3 rounded-lg text-white shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 uppercase font-black tracking-widest text-[11px]"
              style={{ backgroundColor: "#f04343" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
              </svg>
              Save Scrap Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScrapNoteForm;
// changes detect 
