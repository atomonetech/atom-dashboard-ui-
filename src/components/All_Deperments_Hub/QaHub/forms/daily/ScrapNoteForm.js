import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ScrapNoteForm = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  
  const API_BASE = "http://192.168.0.34:8000/api/master-dropdown";
  // 👇 New endpoint for saving data
  const API_SAVE = "http://192.168.0.34:8000/api/scrap-note/save/";

  const initialState = {
    date: today,
    partName: "",
    partNo: "N/A",
    defect: "",
    qty: "",
    remark: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [partDatabase, setPartDatabase] = useState([]);
  const [defectOptions, setDefectOptions] = useState([]);
  const [preparedBy, setPreparedBy] = useState("");

  // 1. Fetch parts on component load
  useEffect(() => {
    axios.get(`${API_BASE}?filter=all_parts`)
      .then(response => {
        setPartDatabase(response.data);
      })
      .catch(error => console.error("Error fetching parts:", error));
  }, []);

  const handlePartChange = (e) => {
    const selectedPartName = e.target.value;
    const matched = partDatabase.find(p => p[0] === selectedPartName);

    setFormData((prev) => ({
      ...prev,
      partName: selectedPartName,
      partNo: matched ? (matched[1] || "N/A") : "N/A",
      defect: "",
    }));
    setDefectOptions([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 👇 Modified Logic to save data to the backend database
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Map frontend state to backend model fields
    const dataToSave = {
      entry_date: formData.date,
      part_name: formData.partName,
      part_no: formData.partNo,
      defect_detail: formData.defect,
      quantity: formData.qty,
      remarks: formData.remark
    };

    try {
      const response = await axios.post(API_SAVE, dataToSave);
      if (response.status === 201 || response.status === 200) {
        alert("Scrap Entry Saved Successfully to Database!");
        setFormData(initialState);
        setDefectOptions([]);
      }
    } catch (error) {
      console.error("Error saving scrap entry:", error.response?.data);
      alert("Error saving data. Please check your backend connection.");
    }
  };

  const handleClear = () => {
    setFormData(initialState);
    setDefectOptions([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-2 px-3 sm:py-3 sm:px-4 md:py-4 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border-t-4" style={{ borderColor: "#f04343" }}>
          
          <div className="bg-gradient-to-r from-white to-red-50 px-4 py-3 sm:px-5 sm:py-4 border-b border-slate-100">
            <div className="mb-2 sm:mb-3">
              <button
                onClick={() => navigate("/qa-hub")}
                className="inline-flex items-center text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg shadow-md transition-all active:scale-95 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 mr-1.5 transition-transform group-hover:-translate-x-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back to QA Hub
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 sm:p-2 rounded-lg text-white shadow-lg shrink-0" style={{ backgroundColor: "#f04343" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm sm:text-base md:text-lg font-black text-slate-800 m-0 uppercase tracking-tight">
                    Scrap Entry Form
                  </h2>
                  <p className="text-slate-500 text-[8px] sm:text-[9px] font-medium">Quality Assurance & Production Control</p>
                </div>
              </div>

              <div className="w-full sm:w-auto bg-white border-2 border-red-100 rounded-lg px-2 py-1.5 flex items-center justify-between sm:justify-center gap-2 shadow-sm">
                <span className="text-[8px] sm:text-[9px] font-black text-red-600 uppercase whitespace-nowrap">Entry Date</span>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="text-xs font-bold text-slate-700 outline-none cursor-pointer bg-transparent"
                />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
              <div>
                <label className="block text-[9px] sm:text-[10px] font-black text-slate-500 mb-1 uppercase">Part Name</label>
                <select
                  name="partName"
                  value={formData.partName}
                  onChange={handlePartChange}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-lg p-2 text-sm outline-none focus:bg-white focus:border-slate-500 font-bold shadow-sm transition-all text-slate-700"
                  required
                >
                  <option value="" disabled>-- Select Part --</option>
                  {partDatabase.map((part, idx) => (
                    <option key={idx} value={part[0]}>{part[0]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[9px] sm:text-[10px] font-black text-slate-500 mb-1 uppercase">Part Number</label>
                <input
                  name="partNo"
                  value={formData.partNo}
                  readOnly
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-lg p-2 text-sm text-slate-500 font-black cursor-not-allowed"
                  placeholder="Auto-filled"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
              <div>
                <label className="block text-[9px] sm:text-[10px] font-black text-slate-500 mb-1 uppercase">Defect Detail</label>
                <input
                  name="defect"
                  value={formData.defect}
                  onChange={handleChange}
                  placeholder="Enter Defect Detail"
                  className="w-full border-2 border-slate-100 bg-slate-50 rounded-lg p-2 text-sm focus:bg-white focus:border-slate-500 font-semibold outline-none shadow-sm transition-all text-slate-700"
                  required
                  disabled={!formData.partName}
                />
              </div>
              <div>
                <label className="block text-[9px] sm:text-[10px] font-black text-slate-500 mb-1 uppercase">Quantity (NOS)</label>
                <div className="flex">
                  <input 
                    name="qty" 
                    value={formData.qty} 
                    onChange={handleChange} 
                    type="number" 
                    className="w-full border-2 border-slate-100 bg-slate-50 rounded-l-lg p-2 text-sm font-bold text-center outline-none focus:bg-white focus:border-slate-500 text-slate-700 transition-all" 
                    placeholder="0" 
                    required 
                  />
                  <span className="bg-slate-100 px-3 py-2 border-2 border-l-0 border-slate-100 rounded-r-lg text-slate-500 font-black text-[10px] flex items-center">NOS</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[9px] sm:text-[10px] font-black text-slate-500 mb-1 uppercase">Remarks</label>
              <textarea 
                name="remark" 
                value={formData.remark} 
                onChange={handleChange} 
                rows="2" 
                className="w-full border-2 border-slate-100 bg-slate-50 rounded-lg p-2 text-sm font-medium outline-none focus:bg-white focus:border-slate-500 resize-y text-slate-700 transition-all" 
                placeholder="Additional notes..."
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end justify-between items-stretch sm:items-center border-t border-slate-100 pt-3">
                {/* Prepared By */}
  <div className="flex flex-col">
    <label className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
      Prepared By
    </label>
    <input
      type="text"
      value={preparedBy}
      onChange={(e) => setPreparedBy(e.target.value)}
      placeholder="Enter name"
      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full sm:w-64"
    />
  </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 rounded-lg font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all text-xs uppercase tracking-wide border border-slate-200 hover:border-red-200 shadow-sm"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 uppercase font-black tracking-wider text-xs"
                  style={{ backgroundColor: "#f04343" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                  </svg>
                  Save Entry
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScrapNoteForm;