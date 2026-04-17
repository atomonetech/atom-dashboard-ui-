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
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      requestedBy: "",
      itemName: "",
      specification: "",
      department: "",
      qty: "",
      remark: "",
      receivedBy: "",
      receivedDate: today,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-3 px-3 sm:py-4 sm:px-4 md:py-6 lg:py-8 font-sans">
      <div className="w-full max-w-6xl mx-auto">
        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
          {/* Cyan Top Border Bar */}
          <div className="h-1.5 bg-cyan-500 w-full"></div>

          {/* Header Section */}
          <div className="px-4 sm:px-5 md:px-6 py-4 sm:py-5 md:py-6 bg-white border-b border-slate-100">
            {/* Back Button */}
            <div className="mb-4 sm:mb-5">
              <button
                onClick={() => navigate("/qa-hub")}
                className="inline-flex items-center gap-1.5 text-white bg-cyan-500 hover:bg-cyan-600 transition-all rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 group shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                <span className="text-xs sm:text-sm font-bold">Back to QA Hub</span>
              </button>
            </div>

            {/* Heading and Date Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="w-full sm:w-auto">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-cyan-700 uppercase tracking-tight">
                  Material Requisition Slip
                </h1>
                <p className="text-cyan-500 text-[9px] sm:text-[10px] md:text-xs font-extrabold mt-1 uppercase tracking-wider">
                  Good Receipt Entry
                </p>
              </div>

              {/* Date Box - Full width on mobile */}
              <div className="w-full sm:w-auto bg-slate-50 border-2 border-cyan-100 rounded-lg px-4 py-2 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center justify-between sm:justify-center gap-1 sm:gap-2">
                  <label className="text-[9px] sm:text-[10px] font-black text-cyan-600 uppercase tracking-wider whitespace-nowrap">
                    Receipt Date
                  </label>
                  <input
                    type="date"
                    name="receivedDate"
                    value={formData.receivedDate}
                    onChange={handleChange}
                    className="text-xs sm:text-sm font-bold text-slate-700 outline-none cursor-pointer bg-transparent w-full sm:w-auto text-center"
                  />
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-5 md:p-6 lg:p-8">
            {/* Requested Person Section - Full width */}
            <div className="mb-6 sm:mb-7 md:mb-8">
              <label className="block text-xs sm:text-sm font-black text-cyan-600 uppercase mb-2 tracking-wider">
                Requested Person Name <span className="text-red-500">*</span>
              </label>
              <input
                name="requestedBy"
                value={formData.requestedBy}
                onChange={handleChange}
                type="text"
                placeholder="Enter full name of the requester"
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-3 sm:p-3.5 outline-none focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100 transition-all font-medium text-sm sm:text-base text-slate-700"
                required
              />
            </div>

            {/* Three Column Grid - Full width inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-6 sm:mb-7 md:mb-8">
              <div>
                <label className="block text-[10px] sm:text-xs font-black text-slate-600 uppercase mb-1.5 tracking-wider">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  placeholder="e.g. A4 Paper, Screw, etc."
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 sm:p-3 focus:bg-white focus:border-cyan-500 outline-none font-medium transition-all text-sm text-slate-700"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-black text-slate-600 uppercase mb-1.5 tracking-wider">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 sm:p-3 focus:bg-white focus:border-cyan-500 outline-none font-medium transition-all text-sm text-slate-700 cursor-pointer"
                  required
                >
                  <option value="" disabled>Select Department</option>
                  <option value="QA">QA</option>
                  <option value="IT">IT</option>
                  <option value="PRODUCTION">PRODUCTION</option>
                  <option value="HR">HR</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                  <option value="PURCHASE">PURCHASE</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-black text-slate-600 uppercase mb-1.5 tracking-wider">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <div className="flex items-stretch">
                  <input
                    name="qty"
                    value={formData.qty}
                    onChange={handleChange}
                    type="text"
                    placeholder="e.g. 100, 2 Boxes"
                    className="flex-1 bg-slate-50 border-2 border-r-0 border-slate-200 rounded-l-lg p-2.5 sm:p-3 focus:bg-white focus:border-cyan-500 outline-none font-medium transition-all text-sm text-slate-700"
                    required
                  />
                  <span className="bg-slate-100 px-3 sm:px-4 flex items-center border-2 border-l-0 border-slate-200 rounded-r-lg text-slate-600 font-bold text-xs sm:text-sm whitespace-nowrap">
                    NOS
                  </span>
                </div>
              </div>
            </div>

            {/* Two Column Grid for Specification and Remark */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-6 sm:mb-7 md:mb-8">
              <div>
                <label className="block text-[10px] sm:text-xs font-black text-slate-600 uppercase mb-1.5 tracking-wider">
                  Specification
                </label>
                <input
                  name="specification"
                  value={formData.specification}
                  onChange={handleChange}
                  placeholder="Size, Color, Grade, Model"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 sm:p-3 focus:bg-white focus:border-cyan-500 outline-none font-medium transition-all text-sm text-slate-700"
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-black text-slate-600 uppercase mb-1.5 tracking-wider">
                  Remark
                </label>
                <input
                  name="remark"
                  value={formData.remark}
                  onChange={handleChange}
                  placeholder="Additional notes or instructions"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 sm:p-3 focus:bg-white focus:border-cyan-500 outline-none font-medium transition-all text-sm text-slate-700"
                />
              </div>
            </div>

            {/* Receiver Section */}
            <div className="mb-6 sm:mb-7 md:mb-8">
              <label className="block text-[10px] sm:text-xs font-black text-slate-600 uppercase mb-1.5 tracking-wider">
                Receiver Name <span className="text-red-500">*</span>
              </label>
              <input
                name="receivedBy"
                value={formData.receivedBy}
                onChange={handleChange}
                placeholder="Enter receiver name"
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 sm:p-3 focus:bg-white focus:border-cyan-500 outline-none font-medium transition-all text-sm text-slate-700"
                required
              />
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end items-stretch sm:items-center border-t border-slate-200 pt-6 mt-2">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 transition-all text-xs sm:text-sm uppercase tracking-wide border-2 border-slate-200 hover:border-cyan-200"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 uppercase font-black tracking-wider text-xs sm:text-sm bg-cyan-500 hover:bg-cyan-600"
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                  Submit Requisition
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GoodReceiptForm;