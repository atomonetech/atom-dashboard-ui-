import React, { useState, useEffect } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { getApiUrl } from '../../../../../config/api'; 
import axios from "axios";
import {
  successAlert,
  errorAlert,
  warningAlert,
  infoAlert,
  confirmAlert,
} from "../../../../../utils/alertUtils";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';


const WarrantyClaimRegister = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isViewMode = Boolean(id); // Determine if it's view mode based on the presence of an ID
    const initialFormState = {
        date: '',
        customerName: '',
        partDetails: '', 
        claimQty: '',
        warrantyDefect: '',
        decision: 'PENDING',
        rejectionRootCause: '',
        capaAnalysis: '',
        disposalAction: '',
        verifiedBy: ''
    };

    const [formData, setFormData] = useState(initialFormState);
    const [partList, setPartList] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
     const [error, setError] = useState(null);
      const [isLoading, setIsLoading] = useState(false);
       const [approvalRemark, setApprovalRemark] = useState("");
              const [approvalLoading, setApprovalLoading] = useState(false);
              const [approvalStatus, setApprovalStatus] = useState("");
              const [reviewedAt, setReviewedAt] = useState("");
    

    // Auto-fill Current Date & Fetch Parts Dropdown
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setFormData(prev => ({ ...prev, date: today }));

        const fetchParts = async () => {
            try {
                const res = await fetch(getApiUrl('/api/master-dropdown/?filter=all_parts'));
                if (!res.ok) throw new Error("Network response was not ok");
                
                const data = await res.json();
                const uniqueParts = [...new Set(data.map(item => Array.isArray(item) ? item[0] : item))].filter(Boolean);
                setPartList(uniqueParts);
            } catch (error) {
                console.error("Failed to fetch parts:", error);
            }
        };
        fetchParts();
    }, []);

    useEffect(() => {
    const fetchWarrantyClaimReport = async () => {
      if (!id) return; // Skip if creating a new record

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/get-single-report/warranty-claim-view/${id}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Map API response to the initialFormState keys
        setFormData({
          date: data.data.date || '',
          customerName: data.data.customerName || '',
          partDetails: data.data.partDetails || '', 
          claimQty: data.data.claimQty || '',
          warrantyDefect: data.data.warrantyDefect || '',
          decision: data.data.decision || 'PENDING',
          rejectionRootCause: data.data.rejectionRootCause || '',
          capaAnalysis: data.data.capaAnalysis || '',
          disposalAction: data.data.disposalAction || '',
          verifiedBy: data.data.verifiedBy || ''
        });

      } catch (err) {
        console.error("Error fetching Warranty Claim Register data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWarrantyClaimReport();
  }, [id]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        if (window.confirm("Are you sure you want to clear the register form?")) {
            const today = new Date().toISOString().split('T')[0];
            setFormData({ ...initialFormState, date: today });
        }
    };

   const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  const currentUser = localStorage.getItem("username") || "Unknown User";

  const payload = {
    ...formData,
    username: currentUser,
    department_name: "QA",
  };

  try {
    const response = await fetch(getApiUrl("/api/warranty-claim/"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      successAlert("Warranty Claim Recorded Successfully!");
      const today = new Date().toISOString().split("T")[0];
      setFormData({ ...initialFormState, date: today });
    } else {
      const errorData = await response.json();
      errorAlert(`Failed to submit: ${JSON.stringify(errorData)}`);
    }
  } catch (error) {
    console.error("Submission Error:", error);
    errorAlert("An error occurred while sending data.");
  } finally {
    setIsSubmitting(false);
  }
};


        const handleApprove = async () => {
          try {
            setApprovalLoading(true);
            const currentUser = localStorage.getItem("username") || "Approver";
            const res = await axios.post(`${API_BASE_URL}/api/approve-report/`, {
              log_id: id,
              approver_username: currentUser,
              remarks: approvalRemark,
            });
      
            successAlert(res.data?.message || "Report approved successfully.");
            navigate("/notifications");
          } catch (err) {
            console.error("Approve error:", err);
            errorAlert(err.response?.data?.error || "Approval failed.");
          } finally {
            setApprovalLoading(false);
          }
        };
      
        const handleReject = async () => {
          if (!approvalRemark.trim()) {
            warningAlert("Please enter remark before rejecting.");
            return;
          }
      
          try {
            setApprovalLoading(true);
            const currentUser = localStorage.getItem("username") || "Approver";
            const res = await axios.post(`${API_BASE_URL}/api/reject-report/`, {
              log_id: id,
              approver_username: currentUser,
              remarks: approvalRemark,
            });
      
            successAlert(res.data?.message || "Report rejected successfully.");
            navigate("/notifications");
          } catch (err) {
            console.error("Reject error:", err);
            errorAlert(err.response?.data?.error || "Reject failed.");
          } finally {
            setApprovalLoading(false);
          }
        };
      
        const isAlreadyReviewed =
          approvalStatus &&
          (approvalStatus.toLowerCase().includes("approved") ||
            approvalStatus.toLowerCase().includes("rejected"));
      
        const goBack = () => {
          if (isViewMode) {
            navigate('/notifications');
            return;
          }
          navigate('/qa-hub/monthly');
        };


    return (
        <div className="min-h-screen bg-[#f0fdf4] text-slate-700 font-sans pb-32 md:pb-12">
            {/* Professional Emerald Header */}
            <div className="bg-gradient-to-br from-[#065f46] via-[#10b981] to-[#34d399] pt-10 md:pt-12 pb-24 md:pb-32 px-4 md:px-6">
                <div className="max-w-6xl mx-auto flex items-center gap-4 text-white">
                    <button 
                        type="button"
                        onClick={() => navigate('/qa-hub/monthly')}
                        className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-xl transition-all backdrop-blur-md border border-white/20 shadow-lg"
                    >
                        <i className="bi bi-chevron-left text-xl"></i>
                    </button>
                    <div>
                        <h1 className="text-xl md:text-3xl font-black uppercase tracking-tight leading-tight">Warranty Register</h1>
                        <p className="text-emerald-100 text-[10px] md:text-xs font-bold tracking-widest uppercase opacity-90">AOT/F/QA/22 | Quality Assurance</p>
                    </div>
                </div>
            </div>

             {isViewMode && approvalStatus && (
          <div className="px-3 px-md-4 pt-3">
            <div className="d-flex flex-column flex-sm-row justify-content-between gap-2 p-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <div>
                <div className="form-label mb-0">Current Status</div>
                <div className="fw-bold" style={{
                  color: approvalStatus.toLowerCase().includes('approved') ? '#16a34a'
                    : approvalStatus.toLowerCase().includes('rejected') ? '#dc2626'
                    : '#d97706'
                }}>
                  {approvalStatus}
                </div>
              </div>
              {reviewedAt && (
                <div>
                  <div className="form-label mb-0">Reviewed At</div>
                  <div className="fw-bold text-dark">{reviewedAt}</div>
                </div>
              )}
            </div>
          </div>
        )}

            {/* Main Form Body */}
            <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-16 md:-mt-24">
                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                    
                    {/* Basic Info Card */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 p-6 md:p-10 border border-white">
                        <h3 className="text-[#10b981] font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-[#10b981] rounded-full"></span> Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400">Claim Date</label>
                                <input required type="date" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#10b981] focus:bg-white outline-none transition-all font-semibold text-sm" 
                                value={formData.date} onChange={(e) => handleChange('date', e.target.value)} />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-[10px] font-bold uppercase text-slate-400">Customer Name</label>
                                <input required className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#10b981] focus:bg-white outline-none transition-all font-semibold text-sm" 
                                value={formData.customerName} onChange={(e) => handleChange('customerName', e.target.value)} placeholder="Customer Details" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400">Claim Qty</label>
                                <input required type="number" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#10b981] focus:bg-white outline-none transition-all font-semibold text-sm" 
                                value={formData.claimQty} onChange={(e) => handleChange('claimQty', e.target.value)} placeholder="0" />
                            </div>
                            
                            {/* Part Details Dropdown */}
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-[10px] font-bold uppercase text-slate-400">Part Details</label>
                                <select 
                                    required 
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#10b981] focus:bg-white outline-none transition-all font-semibold text-sm appearance-none" 
                                    value={formData.partDetails} 
                                    onChange={(e) => handleChange('partDetails', e.target.value)}
                                >
                                    <option value="" disabled>Select Part</option>
                                    {partList.map((part, idx) => <option key={idx} value={part}>{part}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Analysis Section */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 p-6 md:p-10 border border-white">
                        <h3 className="text-[#10b981] font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-[#10b981] rounded-full"></span> Analysis & Decision
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Warranty Defect</label>
                                    <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#10b981] focus:bg-white outline-none transition-all font-semibold text-sm" 
                                    value={formData.warrantyDefect} onChange={(e) => handleChange('warrantyDefect', e.target.value)} placeholder="Describe the defect..." />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Warranty Status</label>
                                    <select className="w-full px-4 py-3 bg-emerald-50 border-2 border-emerald-100 rounded-2xl focus:border-[#10b981] outline-none transition-all font-bold text-sm text-emerald-600 appearance-none" 
                                    value={formData.decision} onChange={(e) => handleChange('decision', e.target.value)}>
                                        <option value="PENDING">PENDING</option>
                                        <option value="ACCEPTED">ACCEPTED</option>
                                        <option value="REJECTED">REJECTED</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Root Cause</label>
                                    <textarea rows="3" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#10b981] focus:bg-white outline-none transition-all text-sm resize-none shadow-sm" 
                                    value={formData.rejectionRootCause} onChange={(e) => handleChange('rejectionRootCause', e.target.value)} placeholder="Explain cause..." />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Disposal Action</label>
                                    <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#10b981] outline-none transition-all text-sm font-semibold" 
                                    value={formData.disposalAction} onChange={(e) => handleChange('disposalAction', e.target.value)} placeholder="Replacement / Scrap" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">CA / PA Analysis</label>
                                    <textarea rows="3" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#10b981] focus:bg-white outline-none transition-all text-sm resize-none shadow-sm" 
                                    value={formData.capaAnalysis} onChange={(e) => handleChange('capaAnalysis', e.target.value)} placeholder="Action details..." />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action Bar */}
                    {!isViewMode && (
                    <div className="bg-white/90 backdrop-blur-md fixed md:sticky bottom-0 md:bottom-6 left-0 right-0 md:rounded-3xl border-t md:border border-slate-200 shadow-2xl p-3 md:p-4 z-40">
                        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
                            <button 
                                type="button" 
                                onClick={() => navigate('/qa-hub/monthly')} 
                                className="flex items-center justify-center p-2.5 text-slate-400 hover:text-red-500 transition-all rounded-xl hover:bg-red-50"
                                title="Exit"
                            >
                                <i className="bi bi-x-circle text-2xl md:text-xl"></i>
                                <span className="hidden sm:inline ml-2 font-bold text-xs uppercase tracking-widest">Exit</span>
                            </button>
                            
                            <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
                                <button 
                                    type="button" 
                                    onClick={resetForm} 
                                    className="px-4 py-2.5 md:px-10 md:py-3 bg-slate-100 text-slate-600 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-slate-200 transition-all border border-slate-200"
                                >
                                    Reset
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="flex-1 md:flex-none px-6 py-2.5 md:px-14 md:py-3 bg-[#10b981] text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-[#059669] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <i className="bi bi-shield-check text-base"></i>
                                    <span>{isSubmitting ? 'Saving...' : 'Submit Claim'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    )}
                </form>
                 {isViewMode && (
            <div className="mt-4 pt-4 no-print" style={{ borderTop: '2px solid #1e293b' }}>
              <label className="form-label">APPROVAL / REJECTION REMARK:</label>
              <textarea
                rows="3"
                className="form-control"
                value={approvalRemark}
                onChange={(e) => setApprovalRemark(e.target.value)}
                disabled={isAlreadyReviewed}
                placeholder="Enter approval or rejection remark..."
              />

              {isAlreadyReviewed ? (
                <div className="mt-3 p-3" style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: 600, color: '#334155', fontSize: '0.9rem' }}>
                  This report is already reviewed. No further action is required.
                </div>
              ) : (
                <div className="d-flex flex-column-reverse flex-sm-row gap-3 justify-content-end mt-3">
                  <button
                    type="button"
                    onClick={handleReject}
                    disabled={approvalLoading}
                    className="btn rounded-pill px-4 shadow-sm w-100 w-sm-auto text-white"
                    style={{ background: '#ef4444', fontWeight: 600 }}
                  >
                    {approvalLoading ? 'Please wait...' : 'Reject'}
                  </button>
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={approvalLoading}
                    className="btn rounded-pill px-4 shadow-sm w-100 w-sm-auto text-white"
                    style={{ background: '#10b981', fontWeight: 600 }}
                  >
                    {approvalLoading ? 'Please wait...' : 'Approve'}
                  </button>
                </div>
              )}
            </div>
          )}
            </div>
        </div>
    );
};

export default WarrantyClaimRegister;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const WarrantyClaimRegister = () => {
//     const navigate = useNavigate();

//     const initialFormState = {
//         date: '',
//         customerName: '',
//         partDetails: '',
//         claimQty: '',
//         warrantyDefect: '',
//         decision: 'PENDING',
//         rejectionRootCause: '',
//         capaAnalysis: '',
//         disposalAction: '',
//         verifiedBy: ''
//     };

//     const [formData, setFormData] = useState(initialFormState);

//     // Auto-fill Current Date
//     useEffect(() => {
//         const today = new Date().toISOString().split('T')[0];
//         setFormData(prev => ({ ...prev, date: today }));
//     }, []);

//     const handleChange = (field, value) => {
//         setFormData(prev => ({ ...prev, [field]: value }));
//     };

//     const resetForm = () => {
//         if (window.confirm("Are you sure you want to clear the register form?")) {
//             const today = new Date().toISOString().split('T')[0];
//             setFormData({ ...initialFormState, date: today });
//         }
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         alert('Warranty Claim Recorded Successfully!');
//         const today = new Date().toISOString().split('T')[0];
//         setFormData({ ...initialFormState, date: today });
//     };

//     return (
//         <div className="min-h-screen bg-[#f0fdf4] text-slate-700 font-sans pb-32 md:pb-12">
//             {/* Professional Emerald Header */}
//             <div className="bg-gradient-to-br from-[#065f46] via-[#10b981] to-[#34d399] pt-10 md:pt-12 pb-24 md:pb-32 px-4 md:px-6">
//                 <div className="max-w-6xl mx-auto flex items-center gap-4 text-white">
//                     <button 
//                         onClick={() => navigate('/qa-hub/monthly')}
//                         className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-xl transition-all backdrop-blur-md border border-white/20 shadow-lg"
//                     >
//                         <i className="bi bi-chevron-left text-xl"></i>
//                     </button>
//                     <div>
//                         <h1 className="text-xl md:text-3xl font-black uppercase tracking-tight leading-tight">Warranty Register</h1>
//                         <p className="text-emerald-100 text-[10px] md:text-xs font-bold tracking-widest uppercase opacity-90">AOT/F/QA/22 | Quality Assurance</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Main Form Body */}
//             <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-16 md:-mt-24">
//                 <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                    
//                     {/* Basic Info Card */}
//                     <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 p-6 md:p-10 border border-white">
//                         <h3 className="text-[#10b981] font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
//                             <span className="w-1.5 h-4 bg-[#10b981] rounded-full"></span> Basic Information
//                         </h3>
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                             <div className="space-y-1">
//                                 <label className="text-[10px] font-bold uppercase text-slate-400">Claim Date</label>
//                                 <input required type="date" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#10b981] focus:bg-white outline-none transition-all font-semibold text-sm" 
//                                 value={formData.date} onChange={(e) => handleChange('date', e.target.value)} />
//                             </div>
//                             <div className="space-y-1 md:col-span-2">
//                                 <label className="text-[10px] font-bold uppercase text-slate-400">Customer Name</label>
//                                 <input required className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#10b981] focus:bg-white outline-none transition-all font-semibold text-sm" 
//                                 value={formData.customerName} onChange={(e) => handleChange('customerName', e.target.value)} placeholder="Customer Details" />
//                             </div>
//                             <div className="space-y-1">
//                                 <label className="text-[10px] font-bold uppercase text-slate-400">Claim Qty</label>
//                                 <input required type="number" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#10b981] focus:bg-white outline-none transition-all font-semibold text-sm" 
//                                 value={formData.claimQty} onChange={(e) => handleChange('claimQty', e.target.value)} placeholder="0" />
//                             </div>
//                             <div className="space-y-1 md:col-span-2">
//                                 <label className="text-[10px] font-bold uppercase text-slate-400">Part Details</label>
//                                 <input required className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#10b981] focus:bg-white outline-none transition-all font-semibold text-sm" 
//                                 value={formData.partDetails} onChange={(e) => handleChange('partDetails', e.target.value)} placeholder="Part Name / Number" />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Analysis Section */}
//                     <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 p-6 md:p-10 border border-white">
//                         <h3 className="text-[#10b981] font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
//                             <span className="w-1.5 h-4 bg-[#10b981] rounded-full"></span> Analysis & Decision
//                         </h3>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div className="space-y-4">
//                                 {/* 🔥 NEW: Warranty Defect Field */}
//                                 <div className="space-y-1">
//                                     <label className="text-[10px] font-bold uppercase text-slate-400">Warranty Defect</label>
//                                     <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#10b981] focus:bg-white outline-none transition-all font-semibold text-sm" 
//                                     value={formData.warrantyDefect} onChange={(e) => handleChange('warrantyDefect', e.target.value)} placeholder="Describe the defect..." />
//                                 </div>

//                                 <div className="space-y-1">
//                                     <label className="text-[10px] font-bold uppercase text-slate-400">Warranty Status</label>
//                                     <select className="w-full px-4 py-3 bg-emerald-50 border-2 border-emerald-100 rounded-2xl focus:border-[#10b981] outline-none transition-all font-bold text-sm text-emerald-600" 
//                                     value={formData.decision} onChange={(e) => handleChange('decision', e.target.value)}>
//                                         <option value="PENDING">PENDING</option>
//                                         <option value="ACCEPTED">ACCEPTED</option>
//                                         <option value="REJECTED">REJECTED</option>
//                                     </select>
//                                 </div>
//                                 <div className="space-y-1">
//                                     <label className="text-[10px] font-bold uppercase text-slate-400">Root Cause</label>
//                                     <textarea rows="3" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#10b981] focus:bg-white outline-none transition-all text-sm resize-none shadow-sm" 
//                                     value={formData.rejectionRootCause} onChange={(e) => handleChange('rejectionRootCause', e.target.value)} placeholder="Explain cause..." />
//                                 </div>
//                             </div>
//                             <div className="space-y-4">
//                                 <div className="space-y-1">
//                                     <label className="text-[10px] font-bold uppercase text-slate-400">Disposal Action</label>
//                                     <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#10b981] outline-none transition-all text-sm font-semibold" 
//                                     value={formData.disposalAction} onChange={(e) => handleChange('disposalAction', e.target.value)} placeholder="Replacement / Scrap" />
//                                 </div>
//                                 <div className="space-y-1">
//                                     <label className="text-[10px] font-bold uppercase text-slate-400">CA / PA Analysis</label>
//                                     <textarea rows="3" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#10b981] focus:bg-white outline-none transition-all text-sm resize-none shadow-sm" 
//                                     value={formData.capaAnalysis} onChange={(e) => handleChange('capaAnalysis', e.target.value)} placeholder="Action details..." />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* 🔥 IMPROVED RESPONSIVE BOTTOM BAR 🔥 */}
//                     <div className="bg-white/90 backdrop-blur-md fixed md:sticky bottom-0 md:bottom-6 left-0 right-0 md:rounded-3xl border-t md:border border-slate-200 shadow-2xl p-3 md:p-4 z-40">
//                         <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
                            
//                             {/* Exit Icon Button */}
//                             <button 
//                                 type="button" 
//                                 onClick={() => navigate('/qa-hub/monthly')} 
//                                 className="flex items-center justify-center p-2.5 text-slate-400 hover:text-red-500 transition-all rounded-xl hover:bg-red-50"
//                                 title="Exit"
//                             >
//                                 <i className="bi bi-x-circle text-2xl md:text-xl"></i>
//                                 <span className="hidden sm:inline ml-2 font-bold text-xs uppercase tracking-widest">Exit</span>
//                             </button>
                            
//                             <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
//                                 {/* Reset Button - Compact on Mobile */}
//                                 <button 
//                                     type="button" 
//                                     onClick={resetForm} 
//                                     className="px-4 py-2.5 md:px-10 md:py-3 bg-slate-100 text-slate-600 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-slate-200 transition-all border border-slate-200"
//                                 >
//                                     Reset
//                                 </button>

//                                 {/* Submit Button - High Priority */}
//                                 <button 
//                                     type="submit" 
//                                     className="flex-1 md:flex-none px-6 py-2.5 md:px-14 md:py-3 bg-[#10b981] text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-[#059669] active:scale-95 transition-all flex items-center justify-center gap-2"
//                                 >
//                                     <i className="bi bi-shield-check text-base"></i>
//                                     <span>Submit <span className="hidden sm:inline">Claim</span></span>
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default WarrantyClaimRegister;
