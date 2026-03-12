import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// Comprehensive Data extracted from the provided PDF [cite: 1, 2, 3, 4, 5, 6, 7]
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
    alert("Scrap Entry Saved Successfully!");
    setFormData(initialState);
  };

  const handleClear = () => setFormData(initialState);

  // Styling for the select box itself
  const getSelectClass = (value) => 
    `w-full bg-white border border-slate-200 rounded p-2 text-sm outline-none focus:border-red-500 font-bold transition-colors appearance-none ${
      value ? "text-red-600" : "text-slate-400"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 p-2 md:p-6 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto mb-4 flex items-center justify-between">
        <button
          onClick={() => navigate("/qa-hub")}
          className="flex items-center text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded shadow-md transition-all active:scale-95 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to QAHub
        </button>
        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Doc No: AOT-F-QC-04</span>
          <span className="text-xs font-black text-red-500 uppercase">Scrap Register</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden border-t-4" style={{ borderColor: "#f04343" }}>
        <div className="bg-gradient-to-r from-white to-red-50 p-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded text-white shadow" style={{ backgroundColor: "#f04343" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Scrap Entry Form</h2>
              <p className="text-slate-500 text-[10px] font-medium">Quality Assurance & Production Control</p>
            </div>
          </div>
          <div className="bg-white border border-red-100 rounded p-1.5 px-3 flex flex-col items-center shadow-sm">
            <span className="text-[9px] font-black text-red-600 uppercase">Entry Date</span>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="text-xs font-bold text-red-600 outline-none cursor-pointer bg-transparent accent-red-600" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          {/* Apply a global accent color to the form so dropdowns use red focus in supported browsers */}
          <div style={{ accentColor: '#f04343' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase">Part Name</label>
                <div className="relative">
                  <select
                    name="partName"
                    value={formData.partName}
                    onChange={handlePartChange}
                    className={getSelectClass(formData.partName)}
                    required
                  >
                    <option value="" className="text-slate-400 font-normal">-- Select Part --</option>
                    {PART_DATABASE.map((part, idx) => (
                      <option key={idx} value={part.name} className="text-slate-800">{part.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase">Part Number</label>
                <input
                  name="partNo"
                  value={formData.partNo}
                  readOnly
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm text-red-600 font-black cursor-not-allowed placeholder-slate-300"
                  placeholder="Auto-filled"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase">Defect Detail</label>
                <select
                  name="defect"
                  value={formData.defect}
                  onChange={handleChange}
                  className={getSelectClass(formData.defect)}
                  required
                  disabled={!formData.partName}
                >
                  <option value="" className="text-slate-400 font-normal">{formData.partName ? "Select Defect" : "Choose Part First"}</option>
                  {availableDefects.map((d, index) => (
                    <option key={index} value={d} className="text-slate-800">{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase">Quantity (NOS)</label>
                <div className="flex">
                  <input 
                    name="qty" 
                    value={formData.qty} 
                    onChange={handleChange} 
                    type="number" 
                    className={`w-full border border-slate-200 rounded-l p-2 text-sm font-bold text-center outline-none ${formData.qty ? 'text-red-600' : 'text-slate-400'}`}
                    placeholder="0" 
                    required 
                  />
                  <span className="bg-slate-100 px-3 py-2 border border-l-0 border-slate-200 rounded-r text-slate-600 font-black text-[10px] flex items-center">NOS</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase">Remarks</label>
            <textarea 
              name="remark" 
              value={formData.remark} 
              onChange={handleChange} 
              rows="1" 
              className={`w-full border border-slate-200 bg-white rounded p-2 text-sm font-medium outline-none focus:border-slate-400 ${formData.remark ? 'text-red-600' : 'text-slate-800'}`}
              placeholder="Additional notes..."
            ></textarea>
          </div>

          <div className="flex gap-3 justify-end border-t border-slate-100 pt-4">
            <button type="button" onClick={handleClear} className="text-xs font-bold text-slate-400 hover:text-red-500 uppercase px-2">Clear</button>
            <button type="submit" className="px-8 py-2.5 rounded text-white shadow hover:opacity-90 flex items-center gap-2 uppercase font-black text-[10px]" style={{ backgroundColor: "#f04343" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
              </svg>
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScrapNoteForm;