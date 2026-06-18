import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // 🔥 useParams added
import axios from "axios"; // 🔥 axios added

const GoodReceiptForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // 🔥 URL se ID nikalne ke liye
  const isViewMode = Boolean(id); // 🔥 Check if form is in View Mode
  const currentUser = localStorage.getItem('username') || 'Unknown User';

  const today = new Date().toISOString().split("T")[0];

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const API_SAVE = `${API_BASE}/api/good-receipt/create/`;
  const API_LOG = `${API_BASE}/api/log-report/`;
  const API_APPROVE = `${API_BASE}/api/approve-report/`;

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
  
  const [preparedBy, setPreparedBy] = useState("");

  // 🔥 FETCH DATA FOR VIEW MODE
  useEffect(() => {
    if (isViewMode) {
      const fetchReportData = async () => {
        try {
          const res = await axios.get(`${API_BASE}/api/get-single-report/good-receipt/${id}/`);
          if (res.data.success) {
            const data = res.data.data;
            setFormData({
              requestedBy: data.requestedBy || "",
              itemName: data.itemName || "",
              specification: data.specification || "",
              department: data.department || "",
              qty: data.qty || "",
              remark: data.remark || "",
              receivedBy: data.receivedBy || "",
              receivedDate: data.receivedDate || today,
            });
            
            // Format username for Prepared By field
            const fullName = data.submitted_by || 'Unknown User';
            setPreparedBy(fullName.split('@')[0]);
          }
        } catch (error) {
          console.error("Failed to load report data", error);
        }
      };
      fetchReportData();
    }
  }, [id, isViewMode, API_BASE, today]);

  const handleChange = (e) => {
    if (isViewMode) return; // Disable changes in view mode
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     const dataToSave = {
       requestedBy: formData.requestedBy,
    itemName: formData.itemName,
    specification: formData.specification,
    department: formData.department,
    qty: formData.qty,
    remark: formData.remark,
    receivedBy: formData.receivedBy,
    receivedDate: today,
    };
    
    if (isViewMode) {
      // 🔥 APPROVE REPORT LOGIC
      try {
        const response = await axios.post(API_APPROVE, {
          log_id: id,
          approver_username: currentUser
        });
        
        if (response.status === 200) {
          alert('✅ Report Approved Successfully!');
          navigate('/notifications'); 
        }
      } catch (error) {
        console.error('Error approving data:', error);
        alert('Failed to approve report.');
      }
    } else {
      // 🔥 SAVE NEW REPORT LOGIC
      try {
        const response = await axios.post(API_SAVE, formData);

        if (response.status === 200 || response.status === 201) {
          const savedRecordId = response.data.record_id; // Get the generated ID
          
          // Save Activity Log
          try {
            await axios.post(API_LOG, {
              username: currentUser,
              report_name: 'Material Requisition Slip', // Used in Notification
              record_id: savedRecordId
            });
          } catch (logError) {
            console.error('Activity log error:', logError);
          }
          
          alert("✅ " + (response.data.message || "Saved Successfully!"));
          navigate(-1); // Wapas bhejo save ke baad
        } else {
          alert("❌ Failed to save data. Please check inputs.");
        }
      } catch (error) {
        console.error("Network Error:", error);
        alert("❌ Server se connect nahi ho pa raha hai. Please check your network.");
      }
    }
  };

  const handleReset = () => {
    if (isViewMode) return;
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

  // Helper function for dynamic styling based on View Mode
  const getInputClass = (baseClasses) => {
    if (isViewMode) {
      return `${baseClasses} bg-slate-100 border-transparent cursor-not-allowed text-slate-500 pointer-events-none`;
    }
    return `${baseClasses} bg-slate-50 border-slate-200 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 text-slate-700`;
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
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-1.5 text-white bg-cyan-500 hover:bg-cyan-600 transition-all rounded-lg px-3 py-1.5 sm:px-4 sm:py-2 group shadow-md border-none cursor-pointer"
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
                <span className="text-xs sm:text-sm font-bold">Back</span>
              </button>
            </div>

            {/* Heading and Date Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="w-full sm:w-auto">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-cyan-700 uppercase tracking-tight">
                  Material Requisition Slip {isViewMode && <span className="text-cyan-500 text-lg">(REVIEW)</span>}
                </h1>
                <p className="text-cyan-500 text-[9px] sm:text-[10px] md:text-xs font-extrabold mt-1 uppercase tracking-wider">
                  Good Receipt Entry
                </p>
              </div>

              {/* Date Box */}
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
                    disabled={isViewMode}
                    className={`text-xs sm:text-sm font-bold outline-none bg-transparent w-full sm:w-auto text-center ${isViewMode ? 'text-slate-500 cursor-not-allowed' : 'text-slate-700 cursor-pointer'}`}
                  />
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-5 md:p-6 lg:p-8">
            {/* Requested Person Section */}
            <div className="mb-6 sm:mb-7 md:mb-8">
              <label className="block text-xs sm:text-sm font-black text-cyan-600 uppercase mb-2 tracking-wider">
                Requested Person Name {!isViewMode && <span className="text-red-500">*</span>}
              </label>
              <input
                name="requestedBy"
                value={formData.requestedBy}
                onChange={handleChange}
                readOnly={isViewMode}
                type="text"
                placeholder="Enter full name of the requester"
                className={getInputClass("w-full border-2 rounded-lg p-3 sm:p-3.5 outline-none transition-all font-medium text-sm sm:text-base")}
                required={!isViewMode}
              />
            </div>

            {/* Three Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-6 sm:mb-7 md:mb-8">
              <div>
                <label className="block text-[10px] sm:text-xs font-black text-slate-600 uppercase mb-1.5 tracking-wider">
                  Item Name {!isViewMode && <span className="text-red-500">*</span>}
                </label>
                <input
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleChange}
                  readOnly={isViewMode}
                  placeholder="e.g. A4 Paper, Screw, etc."
                  className={getInputClass("w-full border-2 rounded-lg p-2.5 sm:p-3 outline-none font-medium transition-all text-sm")}
                  required={!isViewMode}
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-black text-slate-600 uppercase mb-1.5 tracking-wider">
                  Department {!isViewMode && <span className="text-red-500">*</span>}
                </label>
                {isViewMode ? (
                  <input value={formData.department} readOnly className={getInputClass("w-full border-2 rounded-lg p-2.5 sm:p-3 outline-none font-medium transition-all text-sm")} />
                ) : (
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={getInputClass("w-full border-2 rounded-lg p-2.5 sm:p-3 outline-none font-medium transition-all text-sm cursor-pointer")}
                    required
                  >
                    <option value="" disabled>Select Department</option>
                    <option value="QA">QA</option>
                    <option value="IT">IT</option>
                    <option value="IOT">IOT</option>
                    <option value="PRODUCTION">PRODUCTION</option>
                    <option value="HR">HR</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="PURCHASE">PURCHASE</option>
                  </select>
                )}
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-black text-slate-600 uppercase mb-1.5 tracking-wider">
                  Quantity {!isViewMode && <span className="text-red-500">*</span>}
                </label>
                <div className="flex items-stretch">
                  <input
                    name="qty"
                    value={formData.qty}
                    onChange={handleChange}
                    readOnly={isViewMode}
                    type="text"
                    placeholder="e.g. 100, 2 Boxes"
                    className={getInputClass("flex-1 border-2 border-r-0 rounded-l-lg p-2.5 sm:p-3 outline-none font-medium transition-all text-sm")}
                    required={!isViewMode}
                  />
                  <span className={`px-3 sm:px-4 flex items-center border-2 border-l-0 rounded-r-lg font-bold text-xs sm:text-sm whitespace-nowrap ${isViewMode ? 'bg-slate-100 border-transparent text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
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
                  readOnly={isViewMode}
                  placeholder="Size, Color, Grade, Model"
                  className={getInputClass("w-full border-2 rounded-lg p-2.5 sm:p-3 outline-none font-medium transition-all text-sm")}
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
                  readOnly={isViewMode}
                  placeholder="Additional notes or instructions"
                  className={getInputClass("w-full border-2 rounded-lg p-2.5 sm:p-3 outline-none font-medium transition-all text-sm")}
                />
              </div>
            </div>

            {/* Receiver Section */}
            <div className="mb-6 sm:mb-7 md:mb-8">
              <label className="block text-[10px] sm:text-xs font-black text-slate-600 uppercase mb-1.5 tracking-wider">
                Receiver Name {!isViewMode && <span className="text-red-500">*</span>}
              </label>
              <input
                name="receivedBy"
                value={formData.receivedBy}
                onChange={handleChange}
                readOnly={isViewMode}
                placeholder="Enter receiver name"
                className={getInputClass("w-full border-2 rounded-lg p-2.5 sm:p-3 outline-none font-medium transition-all text-sm")}
                required={!isViewMode}
              />
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-between items-stretch sm:items-center border-t border-slate-200 pt-6 mt-2">
              
              {/* Prepared By - Sirf view mode mein */}
              <div className="w-full sm:w-auto">
                {isViewMode && (
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase mb-0.5">Prepared By</p>
                    <p className="text-lg font-black text-cyan-600 capitalize">{preparedBy}</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {!isViewMode && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 transition-all text-xs sm:text-sm uppercase tracking-wide border-2 border-slate-200 hover:border-cyan-200"
                  >
                    Clear Form
                  </button>
                )}
                
                <button
                  type="submit"
                  className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 uppercase font-black tracking-wider text-xs sm:text-sm border-none cursor-pointer"
                  style={{ backgroundColor: isViewMode ? "#10b981" : "#06b6d4" }}
                >
                  {isViewMode ? (
                     <>✓ Approve Report</>
                  ) : (
                     <>
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                        Submit Requisition
                     </>
                  )}
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