import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GoodReceiptForm = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    requestedBy: "",
    itemName: "",
    specification: "",
    department: "",
    qty: "",
    remark: "",
    receivedBy: "",
    receivedDate: today,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Material Requisition Submitted:", formData);
    alert("Material Requisition Slip Saved Successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans text-slate-600">
      
      {/* Top Nav */}
      <div className="max-w-5xl mx-auto mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-xs font-bold text-white px-4 py-3 rounded-lg shadow-md transition-all active:scale-95 hover:brightness-110"
          style={{ backgroundColor: "#06b5d4" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          BACK TO QAHub
        </button>
      </div>

      {/* Main Card */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">

        {/* Cyan Top Border Bar */}
        <div className="h-2 bg-cyan-500 w-full"></div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center p-8 bg-white border-b border-slate-100 gap-6">
          
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-black text-cyan-700 uppercase tracking-tight leading-none">
              Material Requisition Slip
            </h1>
            <p className="text-[#06b5d4] text-[10px] font-extrabold mt-2 uppercase tracking-[0.3em]">
              Good Receipt Entry
            </p>
          </div>

          {/* Date Box */}
          <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-xl px-6 py-3 min-w-[180px] shadow-inner">
            <label className="text-[9px] font-black text-[#06b5d4] uppercase tracking-widest mb-1">
              Receipt Date
            </label>
            <input
              type="date"
              name="receivedDate"
              value={formData.receivedDate}
              onChange={handleChange}
              className="text-sm font-bold text-slate-700 outline-none bg-transparent cursor-pointer text-center"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12">

          {/* Requested Person */}
          <div className="mb-12">
            <div className="bg-cyan-50/30 rounded-2xl p-6 border border-cyan-100/50 shadow-sm">
              <label className="block text-[15px] font-black text-[#06b5d4] uppercase mb-3 tracking-widest">
                Requested Person Name
              </label>
              <input
                name="requestedBy"
                value={formData.requestedBy}
                onChange={handleChange}
                type="text"
                placeholder="Enter full name of the requester"
                className="w-full bg-white border-2 border-slate-200 rounded-xl p-4 outline-none focus:border-[#06b5d4] transition-all font-bold text-slate-700 shadow-sm"
                required
              />
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-1">
              <label className="block text-[12px] font-black text-slate-600 uppercase mb-2 tracking-widest">
                Item Name
              </label>
              <input
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                placeholder="e.g. A4 Paper"
                className="w-full border-b-2 border-slate-200 bg-transparent p-2 focus:border-[#06b5d4] outline-none font-bold transition-all text-slate-700"
                required
              />
            </div>

            {/* Department Dropdown */}
            <div>
              <label className="block text-[12px] font-black text-slate-600 uppercase mb-2 tracking-widest">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full border-b-2 border-slate-200 bg-transparent p-2 focus:border-[#06b5d4] outline-none font-bold transition-all text-slate-700 cursor-pointer appearance-none"
                required
              >
                <option value="" disabled>Select Dept</option>
                <option value="QA">QA</option>
                <option value="IT">IT</option>
                <option value="PROD">PRODUCTION</option>
                <option value="HR">HR</option>
              </select>
            </div>

            <div>
              <label className="block text-[12px] font-black text-slate-600 uppercase mb-2 tracking-widest">
                Quantity
              </label>
              <input
                name="qty"
                value={formData.qty}
                onChange={handleChange}
                placeholder="e.g. 1 Pkt"
                className="w-full border-b-2 border-slate-200 bg-transparent p-2 focus:border-[#06b5d4] outline-none font-bold transition-all text-slate-700"
                required
              />
            </div>
          </div>

          {/* Specification + Remark */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <label className="block text-[12px] font-black text-slate-600 uppercase mb-2 tracking-widest">
                Specification
              </label>
              <input
                name="specification"
                value={formData.specification}
                onChange={handleChange}
                placeholder="Size, Color, or Grade"
                className="w-full border-b-2 border-slate-200 bg-transparent p-2 focus:border-[#06b5d4] outline-none font-bold transition-all text-slate-700"
              />
            </div>

            <div>
              <label className="block text-[12px] font-black text-slate-600 uppercase mb-2 tracking-widest">
                Remark
              </label>
              <input
                name="remark"
                value={formData.remark}
                onChange={handleChange}
                placeholder="Additional notes..."
                className="w-full border-b-2 border-slate-200 bg-transparent p-2 focus:border-[#06b5d4] outline-none font-bold transition-all text-slate-700"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-t border-slate-100 pt-10">
            
            <div className="w-full md:w-auto min-w-[200px]">
              <label className="text-[12px] font-black text-slate-600 uppercase tracking-widest mb-1 block">
                Receiver Name
              </label>
              <input
                name="receivedBy"
                value={formData.receivedBy}
                onChange={handleChange}
                className="w-full text-sm font-black text-slate-700 uppercase border-b-2 border-slate-200 focus:border-[#06b5d4] outline-none pb-1 transition-all bg-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-10 py-3 rounded-xl text-white shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-4 uppercase font-black tracking-widest text-[11px] active:scale-95 hover:brightness-110"
              style={{ backgroundColor: "#06b5d4" }}
            >
              Submit Requisition
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default GoodReceiptForm;