import React, { useState } from "react";
import axios from "axios";

const RMQualityPlanForm = () => {
  const API_SAVE = "http://192.168.0.34:8000/api/rm-quality-plan/save/";

  const [formData, setFormData] = useState({
    preparedBy: "",
    approvedBy: "",
    note: "R M Cross Verification for Chemical and Mechanical properties once in a year.",
    chemicalProperties: [{ parameter: "", uom: "", testMethod: "" }],
    mechanicalProperties: [{ parameter: "", uom: "", testMethod: "" }],
    materials: [{ grade: "", chemValues: {}, mechValues: {} }],
  });

  // Handle Basic Inputs (Prepared By, Approved By, Note)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- PROPERTIES DYNAMIC ROWS HANDLE ---
  const handlePropertyChange = (type, index, field, value) => {
    setFormData((prev) => {
      const updatedProperties = [...prev[type]];
      updatedProperties[index][field] = value;
      return { ...prev, [type]: updatedProperties };
    });
  };

  const addRow = (type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], { parameter: "", uom: "", testMethod: "" }],
    }));
  };

  const removeRow = (type, index) => {
    setFormData((prev) => {
      const updatedProperties = prev[type].filter((_, i) => i !== index);
      return { ...prev, [type]: updatedProperties };
    });
  };

  // --- RAW MATERIAL & DATA ENTRY HANDLE ---
  const handleMaterialChange = (index, value) => {
    setFormData((prev) => {
      const updatedMaterials = [...prev.materials];
      updatedMaterials[index].grade = value;
      return { ...prev, materials: updatedMaterials };
    });
  };

  const handleValueChange = (matIndex, type, propIndex, value) => {
    setFormData((prev) => {
      const updatedMaterials = [...prev.materials];
      updatedMaterials[matIndex][type] = {
        ...updatedMaterials[matIndex][type],
        [propIndex]: value
      };
      return { ...prev, materials: updatedMaterials };
    });
  };

  const addMaterialRow = () => {
    setFormData((prev) => ({
      ...prev,
      materials: [...prev.materials, { grade: "", chemValues: {}, mechValues: {} }],
    }));
  };

  const removeMaterialRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index),
    }));
  };

  // Submit Data to Database
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_SAVE, formData);
      if (response.status === 201 || response.status === 200) {
        alert("RM Quality Plan Data Saved Successfully!");
        setFormData({
          preparedBy: "",
          approvedBy: "",
          note: "R M Cross Verification for Chemical and Mechanical properties once in a year.",
          chemicalProperties: [{ parameter: "", uom: "", testMethod: "" }],
          mechanicalProperties: [{ parameter: "", uom: "", testMethod: "" }],
          materials: [{ grade: "", chemValues: {}, mechValues: {} }],
        });
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data. Please check backend connection.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 font-sans">
      <div className="w-full max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-emerald-400">
          
          {/* Header Section (Under Development removed from here) */}
          <div className="bg-gradient-to-r from-white to-emerald-50 px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-600 shadow-sm shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-black text-slate-800 m-0 tracking-tight">
                  RM Quality Plan
                </h2>
                <div className="text-slate-500 text-[10px] md:text-xs font-semibold flex items-center gap-2 mt-1">
                  <span>Form: <span className="text-slate-700">AOT/F/QA/25</span></span>
                  <span className="text-slate-300">|</span>
                  <span>Resp: <span className="text-slate-700">Quality Engineer</span></span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-8">
            
            {/* STEP 1: DEFINE PROPERTIES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Chemical Properties */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-black text-slate-600 uppercase tracking-wide border-b-2 border-emerald-400 pb-1">
                    1. Define Chemical Properties
                  </h3>
                  <button type="button" onClick={() => addRow("chemicalProperties")} className="text-[10px] font-bold text-emerald-600 bg-white px-2 py-1 rounded border border-emerald-200 hover:bg-emerald-50 transition-all">
                    + Add Property
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.chemicalProperties.map((row, index) => (
                    <div key={`chem-${index}`} className="flex gap-2 items-center">
                      <input type="text" placeholder="Parameter" value={row.parameter} onChange={(e) => handlePropertyChange("chemicalProperties", index, "parameter", e.target.value)} className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs font-bold text-slate-800 outline-none focus:border-emerald-400" required />
                      <input type="text" placeholder="UOM" value={row.uom} onChange={(e) => handlePropertyChange("chemicalProperties", index, "uom", e.target.value)} className="w-16 shrink-0 bg-white border border-slate-200 rounded p-1.5 text-xs font-bold text-slate-800 outline-none focus:border-emerald-400" />
                      {formData.chemicalProperties.length > 1 && (
                        <button type="button" onClick={() => removeRow("chemicalProperties", index)} className="text-red-400 hover:text-red-600 shrink-0">
                          <i className="bi bi-x-circle-fill"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mechanical Properties */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-black text-slate-600 uppercase tracking-wide border-b-2 border-emerald-400 pb-1">
                    2. Define Mechanical Properties
                  </h3>
                  <button type="button" onClick={() => addRow("mechanicalProperties")} className="text-[10px] font-bold text-emerald-600 bg-white px-2 py-1 rounded border border-emerald-200 hover:bg-emerald-50 transition-all">
                    + Add Property
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.mechanicalProperties.map((row, index) => (
                    <div key={`mech-${index}`} className="flex gap-2 items-center">
                      <input type="text" placeholder="Parameter" value={row.parameter} onChange={(e) => handlePropertyChange("mechanicalProperties", index, "parameter", e.target.value)} className="w-full bg-white border border-slate-200 rounded p-1.5 text-xs font-bold text-slate-800 outline-none focus:border-emerald-400" required />
                      <input type="text" placeholder="UOM" value={row.uom} onChange={(e) => handlePropertyChange("mechanicalProperties", index, "uom", e.target.value)} className="w-16 shrink-0 bg-white border border-slate-200 rounded p-1.5 text-xs font-bold text-slate-800 outline-none focus:border-emerald-400" />
                      {formData.mechanicalProperties.length > 1 && (
                        <button type="button" onClick={() => removeRow("mechanicalProperties", index)} className="text-red-400 hover:text-red-600 shrink-0">
                          <i className="bi bi-x-circle-fill"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* STEP 2: ADD MATERIALS */}
            <div className="border-t border-slate-200 pt-6">
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-sm font-bold text-slate-700 uppercase">
                  3. Add Raw Material Grades
                </h3>
                <button type="button" onClick={addMaterialRow} className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200 hover:bg-emerald-100 transition-all">
                  + Add Material
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {formData.materials.map((mat, index) => (
                  <div key={`mat-${index}`} className="flex gap-2 items-center bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                    <span className="font-black text-slate-400 text-xs w-5 text-center">{index + 1}.</span>
                    <input type="text" value={mat.grade} onChange={(e) => handleMaterialChange(index, e.target.value)} placeholder="Enter Grade (e.g. Steel 1020)" className="w-full bg-transparent border-b border-slate-200 p-1 text-sm text-slate-900 outline-none focus:border-emerald-400 font-bold" required />
                    {formData.materials.length > 1 && (
                      <button type="button" onClick={() => removeMaterialRow(index)} className="text-red-400 hover:text-red-600 p-1">
                        <i className="bi bi-trash3-fill"></i>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 3: DATA ENTRY MATRIX */}
            <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-200 shadow-inner mt-8">
              <h3 className="text-sm font-black text-emerald-800 uppercase mb-4 text-center tracking-widest">
                4. Enter Properties Values (Data Entry)
              </h3>
              
              {formData.materials.map((mat, matIndex) => (
                <div key={`entry-${matIndex}`} className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-slate-200">
                  <h4 className="font-bold text-slate-700 mb-3 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs">#{matIndex + 1}</span> 
                    {mat.grade || "Unnamed Material"}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Chemical Entry */}
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 block">Chemical Values</span>
                      <div className="space-y-2">
                        {formData.chemicalProperties.map((prop, propIndex) => (
                          <div key={`val-chem-${propIndex}`} className="flex items-center gap-2">
                            <label className="text-xs font-semibold text-slate-600 w-1/3 truncate" title={prop.parameter}>
                              {prop.parameter || `Property ${propIndex + 1}`}
                            </label>
                            <input 
                              type="text" 
                              placeholder="Value" 
                              value={mat.chemValues[propIndex] || ""} 
                              onChange={(e) => handleValueChange(matIndex, 'chemValues', propIndex, e.target.value)}
                              className="w-2/3 bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-bold text-slate-800 outline-none focus:border-emerald-400 focus:bg-white" 
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mechanical Entry */}
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 block">Mechanical Values</span>
                      <div className="space-y-2">
                        {formData.mechanicalProperties.map((prop, propIndex) => (
                          <div key={`val-mech-${propIndex}`} className="flex items-center gap-2">
                            <label className="text-xs font-semibold text-slate-600 w-1/3 truncate" title={prop.parameter}>
                              {prop.parameter || `Property ${propIndex + 1}`}
                            </label>
                            <input 
                              type="text" 
                              placeholder="Value" 
                              value={mat.mechValues[propIndex] || ""} 
                              onChange={(e) => handleValueChange(matIndex, 'mechValues', propIndex, e.target.value)}
                              className="w-2/3 bg-slate-50 border border-slate-200 rounded p-1.5 text-xs font-bold text-slate-800 outline-none focus:border-emerald-400 focus:bg-white" 
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Approvals Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <div>
                <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-wider">Prepared By</label>
                <input type="text" name="preparedBy" value={formData.preparedBy} onChange={handleChange} className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-emerald-400 font-bold" placeholder="Enter Name" required />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-wider">Approved By</label>
                <input type="text" name="approvedBy" value={formData.approvedBy} onChange={handleChange} className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-emerald-400 font-bold" placeholder="Enter Name" required />
              </div>
            </div>

            {/* Note & Submit */}
            <div className="flex flex-col border-t border-slate-200 pt-5 mt-2 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-wider">Note</label>
                <input 
                  type="text" 
                  name="note" 
                  value={formData.note} 
                  onChange={handleChange} 
                  className="w-full border border-slate-200 bg-slate-50 rounded-lg p-2 text-xs text-slate-600 outline-none focus:bg-white focus:border-emerald-400 font-semibold" 
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="px-8 py-3 rounded-lg text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 uppercase font-black tracking-wide text-xs bg-emerald-500 hover:bg-emerald-600">
                  <i className="bi bi-save2"></i>
                  Save Quality Plan
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default RMQualityPlanForm;