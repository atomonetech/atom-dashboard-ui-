import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // 🔥 Added useParams
import axios from "axios";

const RedBinForm = () => {
  const navigate = useNavigate();
  // 🔥 View Mode Logic
  const { id } = useParams();
  const isViewMode = Boolean(id);

  const today = new Date().toISOString().split("T")[0];
  const currentUser = localStorage.getItem('username') || 'Unknown User';

  // Backend URLs
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const API_DROPDOWN = `${API_BASE_URL}/api/master-dropdown`;
  const API_SAVE = `${API_BASE_URL}/api/redbin-analysis/save/`;
  const API_LOG = `${API_BASE_URL}/api/log-report/`;
  const API_APPROVE = `${API_BASE_URL}/api/approve-report/`; // 🔥 Added Approve API

  const [formData, setFormData] = useState({
    entry_date: today,
    part_name_model: "",
    defect_detail: "",
    operation: "",
    total_rej_qty: "",
    root_cause_reason: "",
    action_taken: "",
    responsible_person: "",
    target_date: "",
    completion_date: "",
  });

  const [partOptions, setPartOptions] = useState([]);
  const [operationOptions, setOperationOptions] = useState([]);
  const [preparedBy, setPreparedBy] = useState("");

  // 👇 1. Component load hote hi saare Parts fetch karo & Handle View Mode
  useEffect(() => {
    // Fetch Parts Dropdown
    axios
      .get(`${API_DROPDOWN}?filter=all_parts`)
      .then((response) => {
        const namesOnly = response.data.map((item) => Array.isArray(item) ? item[0] : item);
        setPartOptions(namesOnly);
      })
      .catch((error) => console.error("Error fetching parts:", error));

    // 🔥 FETCH DATA IF IN VIEW MODE
    if (isViewMode) {
      axios.get(`${API_BASE_URL}/api/get-single-report/redbin-view/${id}/`)
        .then((res) => {
           if(res.data.success) {
              const d = res.data.data;
              setFormData({
                 entry_date: d.entry_date || today,
                 part_name_model: d.part_name_model || "",
                 defect_detail: d.defect_detail || "",
                 operation: d.operation || "",
                 total_rej_qty: d.total_rej_qty || "",
                 root_cause_reason: d.root_cause_reason || "",
                 action_taken: d.action_taken || "",
                 responsible_person: d.responsible_person || "",
                 target_date: d.target_date || "",
                 completion_date: d.completion_date || "",
              });
              const fullName = d.submitted_by || 'Unknown User';
              setPreparedBy(fullName.split('@')[0]);
           }
        })
        .catch(err => console.error("Error loading view data", err));
    }
  }, [id, isViewMode, today, API_BASE_URL]);

  const handleChange = (e) => {
    if (isViewMode) return; // 🔥 Locked in View Mode
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 👇 2. Agar Part Name change hua hai, toh uske related Operations fetch karo
    if (name === "part_name_model" && value !== "") {
      setFormData((prev) => ({ ...prev, operation: "" }));
      setOperationOptions([]);

      axios
        .get(`${API_DROPDOWN}?filter=operations_by_part&part=${encodeURIComponent(value)}`)
        .then((response) => {
          setOperationOptions(response.data);
        })
        .catch((error) => console.error("Error fetching operations:", error));
    }
  };

  // 👇 3. Backend mein data save/approve karne ka logic
  const handleSubmit = async (e) => {
     e.preventDefault();
     
     if (isViewMode) {
        // ==== APPROVE LOGIC ====
        try {
          const res = await axios.post(API_APPROVE, { log_id: id, approver_username: currentUser });
          if (res.status === 200) {
            alert('✅ Report Approved Successfully!');
            navigate('/notifications'); 
          }
        } catch (err) {
          console.error(err);
          alert('Failed to approve report.');
        }
     } else {
         // ==== SAVE NEW LOGIC ====
   const dataToSave = {
   entry_date: formData.entry_date,
   part_name_model: formData.part_name_model,
   defect_detail: formData.defect_detail,
   operation: formData.operation,
   total_rej_qty: formData.total_rej_qty,
   root_cause_reason: formData.root_cause_reason,
   action_taken: formData.action_taken,
   responsible_person: formData.responsible_person,
   target_date: formData.target_date,
   completion_date: formData.completion_date,
   submitted_by: currentUser,
};

try {
  const response = await axios.post(API_SAVE, dataToSave);

  if (response.status === 201 || response.status === 200) {
    const savedRecordId = response.data.record_id;

    try {
      await axios.post(API_LOG, {
        username: currentUser,
        report_name: "Red Bin Analysis",
        record_id: savedRecordId,
        form_key: "redbin",
        hub: "qa-hub",
        target_group: "Quality_Approvers",
      });
    } catch (logError) {
      console.error("Activity log save karne mein error aayi:", logError);
      alert("Form saved, but notification not created.");
    }

    alert("Red Bin Form Saved to Database Successfully!");
    navigate(-1);
  }
} catch (error) {
  console.error("Error saving data:", error);
  alert("Failed to save data. Please check backend connection.");
}
     }
  };

  const handleReset = () => {
    if (isViewMode) return;
    setFormData({
      entry_date: today,
      part_name_model: "",
      defect_detail: "",
      operation: "",
      total_rej_qty: "",
      root_cause_reason: "",
      action_taken: "",
      responsible_person: "",
      target_date: "",
      completion_date: "",
    });
    setOperationOptions([]);
  };

  // 🔥 Helper for Input Classes
  const getInputClass = () => {
    const base = "w-full border-2 rounded-lg p-2 text-sm outline-none transition-all font-semibold ";
    return isViewMode 
      ? base + "bg-slate-100 border-transparent cursor-not-allowed text-slate-600" 
      : base + "border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-500 text-slate-700";
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 py-2 px-3 sm:py-3 sm:px-4 md:py-4 font-sans ">
        <div className="w-full max-w-8xl mx-auto px-16 py-6">
          <div
            className="bg-white rounded-xl overflow-hidden"
            style={{ borderColor: "#f04343" }}
          >
            <div className="bg-gradient-to-r from-white to-red-50 px-4 py-3 sm:px-5 sm:py-4">
              <div className="flex justify-between items-center mb-3">
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg shadow-md transition-all active:scale-95 group border-none cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 mr-1.5 transition-transform group-hover:-translate-x-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                  Back
                </button>

                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg text-white shadow-lg shrink-0" style={{ backgroundColor: "#f04343" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1z" />
                    </svg>
                  </div>
                  <h2 className="text-base font-black text-slate-800 uppercase tracking-tight m-0">
                    Red Bin Analysis Report {isViewMode && <span style={{color: '#f04343'}}>(REVIEW)</span>}
                  </h2>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-2"></div>
                <div className="w-full sm:w-auto bg-white border-2 border-red-100 rounded-lg px-2 py-1.5 flex items-center justify-between sm:justify-center gap-2 shadow-sm">
                  <span className="text-[8px] sm:text-[9px] font-black text-red-600 uppercase whitespace-nowrap">
                    Entry Date
                  </span>
                  <input
                    type="date"
                    name="entry_date"
                    value={formData.entry_date}
                    onChange={handleChange}
                    disabled={isViewMode}
                    className={`text-xs font-bold outline-none ${isViewMode ? 'text-slate-500 cursor-not-allowed' : 'text-slate-700 cursor-pointer'} bg-transparent`}
                  />
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4">
                <div>
                  <label className="block text-[10px] sm:text-[10px] font-black text-slate-900 uppercase mb-1">
                    Part Name / Model {!isViewMode && <span className="text-red-500">*</span>}
                  </label>
                  {isViewMode ? (
                     <input value={formData.part_name_model} disabled className={getInputClass()} />
                  ) : (
                    <select
                      name="part_name_model"
                      value={formData.part_name_model}
                      onChange={handleChange}
                      className={getInputClass()}
                      required
                    >
                      <option value="">Select Part Name</option>
                      {partOptions.map((part, index) => (
                        <option key={index} value={part}>{part}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] sm:text-[10px] font-black text-slate-900 uppercase mb-1">
                    Operation {!isViewMode && <span className="text-red-500">*</span>}
                  </label>
                  {isViewMode ? (
                     <input value={formData.operation} disabled className={getInputClass()} />
                  ) : (
                    <select
                      name="operation"
                      value={formData.operation}
                      onChange={handleChange}
                      className={getInputClass()}
                      required
                      disabled={!formData.part_name_model}
                    >
                      <option value="">Select Operation</option>
                      {operationOptions.map((op, index) => (
                        <option key={index} value={op}>{op}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] sm:text-[10px] font-black text-slate-900 uppercase mb-1">
                    Total Rejection Qty {!isViewMode && <span className="text-red-500">*</span>}
                  </label>
                  <div className="flex items-center">
                    <input
                      name="total_rej_qty"
                      value={formData.total_rej_qty}
                      onChange={handleChange}
                      readOnly={isViewMode}
                      type="number"
                      className={`${getInputClass()} rounded-r-none border-r-0`}
                      placeholder="0"
                      required={!isViewMode}
                    />
                    <span className={`px-3 py-2 border-2 border-l-0 rounded-r-lg font-bold text-xs whitespace-nowrap ${isViewMode ? 'bg-slate-100 border-transparent text-slate-500' : 'bg-slate-100 border-slate-100 text-slate-500'}`}>
                      NOS
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div>
                  <label className="block text-[10px] sm:text-[10px] font-black text-slate-900 uppercase mb-1">
                    Defect Detail {!isViewMode && <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    name="defect_detail"
                    value={formData.defect_detail}
                    onChange={handleChange}
                    readOnly={isViewMode}
                    rows="2"
                    className={`${getInputClass()} resize-y`}
                    placeholder="Describe what went wrong..."
                    required={!isViewMode}
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-[10px] font-black text-slate-900 uppercase mb-1">
                    Root Cause / Reason {!isViewMode && <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    name="root_cause_reason"
                    value={formData.root_cause_reason}
                    onChange={handleChange}
                    readOnly={isViewMode}
                    rows="2"
                    className={`${getInputClass()} resize-y`}
                    placeholder="Why did this happen?"
                    required={!isViewMode}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[10px] sm:text-xs font-black text-red-600 uppercase mb-1.5 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Corrective Action Taken {!isViewMode && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  name="action_taken"
                  value={formData.action_taken}
                  onChange={handleChange}
                  readOnly={isViewMode}
                  rows="2"
                  className={isViewMode ? getInputClass() : "w-full border-2 border-slate-200 rounded-lg p-2 text-sm focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none text-slate-700 transition-all resize-y"}
                  placeholder="Describe the corrective actions taken to prevent recurrence..."
                  required={!isViewMode}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <label className="block text-[9px] sm:text-[10px] font-black text-slate-900 uppercase mb-1">
                    Responsible Person {!isViewMode && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    name="responsible_person"
                    value={formData.responsible_person}
                    onChange={handleChange}
                    readOnly={isViewMode}
                    type="text"
                    placeholder="Name of In-charge"
                    className={getInputClass()}
                    required={!isViewMode}
                  />
                </div>
                <div>
                  <label className="block text-[9px] sm:text-[10px] font-black text-slate-900 uppercase mb-1">
                    Target Date {!isViewMode && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    name="target_date"
                    value={formData.target_date}
                    onChange={handleChange}
                    disabled={isViewMode}
                    type="date"
                    className={getInputClass()}
                    required={!isViewMode}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[9px] sm:text-[10px] font-black text-slate-900 uppercase mb-1">
                    Completion Date
                  </label>
                  <input
                    name="completion_date"
                    value={formData.completion_date}
                    onChange={handleChange}
                    disabled={isViewMode}
                    type="date"
                    className={getInputClass()}
                  />
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col-reverse sm:flex-row gap-2 justify-between items-stretch sm:items-center border-t border-slate-100 pt-3">
                
                {/* 🔥 PREPARED BY - Sirf view mode mein dikhega */}
                <div className="w-full sm:w-auto">
                  {isViewMode && (
                     <div>
                       <p className="text-xs text-slate-500 font-bold uppercase mb-0.5">Prepared By</p>
                       <p className="text-lg font-black text-red-600 capitalize">{preparedBy}</p>
                     </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  {!isViewMode && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-4 py-2 rounded-lg font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all text-xs uppercase tracking-wide border border-slate-200 hover:border-red-200"
                    >
                      Clear Form
                    </button>
                  )}
                  
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 uppercase font-black tracking-wider text-xs border-none cursor-pointer"
                    style={{ backgroundColor: isViewMode ? "#10b981" : "#f04343" }}
                  >
                    {isViewMode ? (
                       <>✓ Approve Report</>
                    ) : (
                       <>
                         <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                           <line x1="22" y1="2" x2="11" y2="13"></line>
                           <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                         </svg>
                         Submit Report
                       </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RedBinForm;