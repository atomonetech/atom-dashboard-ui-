import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// Comprehensive Data extracted from the provided PDF 
const PART_DATABASE = [
  { name: "Flange NO. 2", number: "71T00-FLP02S", defects: ["Heavy Dent", "Drop Area", "BlankShort", "Groove NG", "Thread Damage", "Dimple shift", "Dimple Height NG", "Thickness NG", "Damage", "Centre Punch Out"] },
  { name: "Flange Outlet", number: "75T00-FLP11S", defects: ["Heavy Dent", "Drop Area", "BlankShort", "Groove NG", "Thread Damage", "Thickness NG", "Damage", "Centre Punch Out"] },
  { name: "Boss Sensor", number: "71T00-BS710S", defects: ["Crack", "Radius NG", "Double Thread", "NoGo", "OP-Miss", "Thread NG", "Heavy dent", "Profile NG"] },
  { name: "Flange -1", number: "71T00-FL000S", defects: ["Blankshort", "Heavy Dent", "Damage"] },
  { name: "BRACKET FRONT BUMPER UPPER -R", number: "58242-74T00", defects: ["Damage", "Dent"] },
  { name: "BRACKET FRONT BUMPER UPPER -L", number: "58252-74TOO", defects: ["Damage", "Dent"] },
  { name: "BRACKET HOOD LOCK MBR SIDE - R", number: "58234-55T00", defects: ["Damage", "Dent"] },
  { name: "BRACKET HOOD LOCK MBR SIDE - L", number: "58235-55T00", defects: ["Damage", "Dent"] },
  { name: "BRACKET FRONT BUMPER CTR", number: "58273-55T00", defects: ["Damage", "Dent"] },
  { name: "Rod Muffler", number: "65542-68P00", defects: ["Crack", "Heavy Dent", "Head Damage", "Length NG"] },
  { name: "Negative Busbar 1.1", number: "7142-7598-02", defects: ["Damage", "Blankshort"] },
  { name: "Negative Busbar 1.2", number: "7142-7599-02", defects: ["Damage", "Blankshort"] },
  { name: "Negative Busbar 2.1", number: "7142-7600-02", defects: ["Damage", "Bending Height NG", "Dent", "Blankshort"] },
  { name: "Negative Busbar 2.2", number: "7142-7601-02", defects: ["Damage", "Bending Height NG", "Dent", "Blankshort"] },
  { name: "Negative Busbar 2.3", number: "7142-7602-02", defects: ["Damage", "Bending Height NG", "Dent", "Thread NG"] },
  { name: "Negative Busbar 3.1", number: "7142-7603-02", defects: ["Damage", "Bending Height NG", "Blankshort", "Dent"] },
  { name: "Negative Busbar 3.2", number: "7142-7604-02", defects: ["Damage", "Bending Height NG", "Blankshort", "Dent"] },
  { name: "Negative Busbar 3.3", number: "7142-7605-02", defects: ["Damage", "Bending Height NG", "Blankshort", "Dent"] },
  { name: "Negative Busbar 4.1", number: "7142-7606-02", defects: ["Damage", "Bending Height NG", "Blankshort", "Dent"] },
  { name: "Negative Busbar 4.2", number: "7142-7607-02", defects: ["Damage", "Bending Height NG", "Blankshort", "Dent"] },
  { name: "Negative Busbar 4.3", number: "7142-7608-02", defects: ["Damage", "Bending Height NG", "Blankshort", "Dent"] },
  { name: "Negative Busbar 5.1", number: "7142-7609-02", defects: ["Damage", "Bending Height NG", "Blankshort", "Dent"] },
  { name: "Negative Busbar 5.2", number: "7142-7610-02", defects: ["Damage", "Bending Height NG", "Blankshort", "Dent", "Thread NG"] },
  { name: "Concept-S combo 2 Inlet", number: "7117-6003-02", defects: ["Damage", "Bending Height NG", "Blankshort", "Dent"] },
  { name: "CRASH REINFORCEMENT A-PILLAR TOP-LH", number: "547663208277", defects: ["BlankShort", "Heavy Dent", "Damage"] },
  { name: "CRASH REINFORCEMENT A-PILLAR TOP-RH", number: "547663208278", defects: ["BlankShort", "Heavy Dent", "Damage"] },
  { name: "REINFORCEMENT A-PILLAR MIDDLE-LH", number: "547663208281", defects: ["Blankshort", "Heavy Dent", "Damage"] },
  { name: "REINFORCEMENT A-PILLAR MIDDLE-RH", number: "547663208282", defects: ["Blankshort", "Heavy Dent", "Damage"] },
  { name: "REINFORCEMENT A-PILLAR BOTTOM HINGELH-", number: "547663208253", defects: ["Blankshort", "Damage", "Double Nut Plate Shift", "Spot inside thread", "Heavy Dent", "Operation Miss"] },
  { name: "REINFORCEMENT A-PILLAR BOTTOM HINGE-RH", number: "547663208254", defects: ["Blankshort", "Damage", "Double Nut Plate Shift", "Spot inside thread", "Heavy Dent", "Operation Miss"] },
  { name: "REINFORCEMENT A-PILLAR TOP HINGE-LH", number: "547663208257", defects: ["BlankShort", "Double Nut Plate Shift", "Spot inside thread", "Damage", "Gap NG in Fixture", "Heavy Dent", "Spot NG"] },
  { name: "REINFORCEMENT A-PILLAR TOP HINGE-RH", number: "547663208258", defects: ["BlankShort", "Double Nut Plate Shift", "Spot inside thread", "Damage", "Gap NG in Fixture", "Heavy Dent", "Spot NG"] },
  { name: "BRACKET LOWER -LH", number: "547663208261", defects: ["Operation Miss", "Reinforcement on wrong place", "Heavy dent", "Damage", "Blankshort", "Spot NG"] },
  { name: "BRACKET LOWER -RH", number: "547663208262", defects: ["Operation Miss", "Reinforcement on wrong place", "Heavy dent", "Damage", "Blankshort", "Spot NG"] },
  { name: "Stopper, Power Back Door (10030-B)", number: "427221-10030-B", defects: ["Blankshort", "Dent", "Gauge NG"] },
  { name: "Spacer, Power Back Door", number: "427228-10110-A", defects: ["Blankshort", "Dent", "Gauge NG"] },
  { name: "Stopper, Power Back Door (10090-D)", number: "427228-10090-D", defects: ["Blankshort", "Dent", "Gauge NG"] },
];

const ScrapNoteForm = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const initialState = {
    date: today,
    partName: "",
    partNo: "",
    defect: "",
    qty: "",
    remark: "",
  };

  const [formData, setFormData] = useState(initialState);

  const handlePartChange = (e) => {
    const selectedPartName = e.target.value;
    const partEntry = PART_DATABASE.find((p) => p.name === selectedPartName);
    setFormData((prev) => ({
      ...prev,
      partName: selectedPartName,
      partNo: partEntry ? partEntry.number : "",
      defect: "", 
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const availableDefects = useMemo(() => {
    const part = PART_DATABASE.find((p) => p.name === formData.partName);
    return part ? part.defects : [];
  }, [formData.partName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saving Scrap Entry:", formData);
    alert("Scrap Entry Saved Successfully!");
    setFormData(initialState);
  };

  const handleClear = () => setFormData(initialState);

  return (
    <div className="min-h-screen bg-slate-50 py-2 px-3 sm:py-3 sm:px-4 md:py-4 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border-t-4" style={{ borderColor: "#f04343" }}>
          {/* Header Section */}
          <div className="bg-gradient-to-r from-white to-red-50 px-4 py-3 sm:px-5 sm:py-4 border-b border-slate-100">
            {/* Back Button - First */}
            <div className="mb-2 sm:mb-3">
              <button
                onClick={() => navigate("/qa-hub")}
                className="inline-flex items-center text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg shadow-md transition-all active:scale-95 group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-3.5 h-3.5 mr-1.5 transition-transform group-hover:-translate-x-1"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Back to QA Hub
              </button>
            </div>
            
            {/* Main Heading and Entry Date */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className="p-1.5 sm:p-2 rounded-lg text-white shadow-lg shrink-0"
                  style={{ backgroundColor: "#f04343" }}
                >
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

              {/* Entry Date */}
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
            {/* Part Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
              <div>
                <label className="block text-[9px] sm:text-[10px] font-black text-slate-500 mb-1 uppercase">Part Name</label>
                <select
                  name="partName"
                  value={formData.partName}
                  onChange={handlePartChange}
                  className="w-full bg-white border-2 border-slate-100 rounded-lg p-2 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 font-bold"
                  required
                >
                  <option value="">-- Select Part --</option>
                  {PART_DATABASE.map((part, idx) => (
                    <option key={idx} value={part.name}>{part.name}</option>
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

            {/* Defect and Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
              <div>
                <label className="block text-[9px] sm:text-[10px] font-black text-slate-500 mb-1 uppercase">Defect Detail</label>
                <select
                  name="defect"
                  value={formData.defect}
                  onChange={handleChange}
                  className="w-full border-2 border-slate-100 bg-white rounded-lg p-2 text-sm focus:border-red-400 focus:ring-2 focus:ring-red-100 font-semibold outline-none"
                  required
                  disabled={!formData.partName}
                >
                  <option value="">{formData.partName ? "Select Defect" : "Choose Part First"}</option>
                  {availableDefects.map((d, index) => (
                    <option key={index} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[9px] sm:text-[10px] font-black text-slate-500 mb-1 uppercase">Quantity (NOS)</label>
                <div className="flex">
                  <input 
                    name="qty" 
                    value={formData.qty} 
                    onChange={handleChange} 
                    type="number" 
                    className="w-full border-2 border-slate-100 rounded-l-lg p-2 text-sm font-bold text-center outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100" 
                    placeholder="0" 
                    required 
                  />
                  <span className="bg-slate-100 px-3 py-2 border-2 border-l-0 border-slate-100 rounded-r-lg text-slate-600 font-black text-[10px] flex items-center">NOS</span>
                </div>
              </div>
            </div>

            {/* Remarks */}
            <div className="mb-4">
              <label className="block text-[9px] sm:text-[10px] font-black text-slate-500 mb-1 uppercase">Remarks</label>
              <textarea 
                name="remark" 
                value={formData.remark} 
                onChange={handleChange} 
                rows="2" 
                className="w-full border-2 border-slate-100 bg-white rounded-lg p-2 text-sm font-medium outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 resize-y" 
                placeholder="Additional notes..."
              />
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end items-stretch sm:items-center border-t border-slate-100 pt-3">
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-2 rounded-lg font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all text-xs uppercase tracking-wide border border-slate-200 hover:border-red-200"
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