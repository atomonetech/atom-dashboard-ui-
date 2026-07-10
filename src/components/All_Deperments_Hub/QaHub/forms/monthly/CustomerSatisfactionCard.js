import React, { useState, useEffect } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { getApiUrl } from '../../../../../config/api'; // Adjust path if needed
import {
  successAlert,
  errorAlert,
  warningAlert,
  infoAlert,
  confirmAlert,
} from "../../../../../utils/alertUtils";
import axios from "axios";

const API_BASE_URL=`${process.env.REACT_APP_API_URL || "http://localhost:8000"}`;
const CustomerSatisfactionCard = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isViewMode = Boolean(id); // If id exists, we are in view mode
    const initialFormState = {
        customerName: '',
        monthYear: '',
        lineComplaints: '',
        warrantyComplaints: '',
        premiumFreightIncidents: '',
        lineStoppageQuality: '',
        lineStoppageSupply: '',
        premiumFightIncident: '',
        scheduleVsDispatch: '100',
        customerAuditScore: 'NA'
    };

    const [formData, setFormData] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
          const [isLoading, setIsLoading] = useState(false);
           const [approvalRemark, setApprovalRemark] = useState("");
                  const [approvalLoading, setApprovalLoading] = useState(false);
                  const [approvalStatus, setApprovalStatus] = useState("");
                  const [reviewedAt, setReviewedAt] = useState("");

    useEffect(() => {
       const fetchCustomerSatisfactionReport = async () => {
         if (!id) return; // Skip if creating a new record
   
         setIsLoading(true);
         setError(null);
   
         try {
           const response = await fetch(`${API_BASE_URL}/api/get-single-report/customer-satisfaction-view/${id}/`, {
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
             customerName:data.data.customerName || '',
           monthYear: data.data.monthYear || '',
        lineComplaints: data.data.line_complaints || '',
        warrantyComplaints: data.data.warranty_complaints || '',
        premiumFreightIncidents: data.data.premium_freight_incidents || '',
        lineStoppageQuality: data.data.line_stoppage_quality || '',
        lineStoppageSupply: data.data.line_stoppage_supply || '',
        premiumFightIncident: data.data.premium_fight_incident || '',
        scheduleVsDispatch: data.data.schedule_vs_dispatch || '100',
        customerAuditScore: data.data.customer_audit_score || 'NA'
           });
   
         } catch (err) {
           console.error("Error fetching Warranty Claim Register data:", err);
           setError(err.message);
         } finally {
           setIsLoading(false);
         }
       };
   
       fetchCustomerSatisfactionReport();
     }, [id]);
   

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        if (window.confirm("Clear all entry fields?")) {
            setFormData(initialFormState);
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
    const response = await fetch(getApiUrl("/api/customer-satisfaction/"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      successAlert("Customer Satisfaction Card Submitted Successfully!");
      setFormData(initialFormState);
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
      
            infoAlert(res.data?.message || "Report rejected successfully.");
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
        <div className="min-h-screen bg-[#fff7fb] text-slate-700 font-sans pb-32 md:pb-12">
            {/* Header Section with Pink Theme */}
            <div className="bg-gradient-to-br from-[#be185d] via-[#ec4899] to-[#f472b6] pt-10 md:pt-12 pb-24 md:pb-32 px-4 md:px-6 shadow-lg">
                <div className="max-w-6xl mx-auto flex items-center gap-4 text-white">
                    <button 
                        type="button"
                        onClick={() => navigate('/qa-hub/monthly')}
                        className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-2xl transition-all border border-white/20 backdrop-blur-md"
                    >
                        <i className="bi bi-chevron-left text-xl"></i>
                    </button>
                    <div>
                        <h1 className="text-xl md:text-3xl font-black uppercase tracking-tight leading-none">Customer Satisfaction</h1>
                        <p className="text-pink-100 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mt-2 opacity-80">AOT/F/QA/29 | Performance Metrics</p>
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
                    <div className="bg-white rounded-3xl md:rounded-[2rem] shadow-xl p-6 md:p-10 border border-slate-100">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="w-2.5 h-6 bg-[#ec4899] rounded-full"></span>
                            <h3 className="text-slate-800 font-black text-sm uppercase tracking-widest">Entry Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide ml-1">Customer Name</label>
                                <input required className="w-full px-5 py-3.5 bg-slate-50/50 border-2 border-slate-200 rounded-2xl focus:border-[#ec4899] focus:bg-white outline-none transition-all font-semibold text-sm text-slate-800" 
                                value={formData.customerName} onChange={(e) => handleChange('customerName', e.target.value)} placeholder="e.g. SKH Y Tec India" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide ml-1">Select Month / Year</label>
                                <input required type="month" className="w-full px-5 py-3.5 bg-slate-50/50 border-2 border-slate-200 rounded-2xl focus:border-[#ec4899] focus:bg-white outline-none transition-all font-semibold text-sm text-slate-800" 
                                value={formData.monthYear} onChange={(e) => handleChange('monthYear', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* 8-Point Performance Metrics Section */}
                    <div className="bg-white rounded-3xl md:rounded-[2rem] shadow-xl p-6 md:p-10 border border-slate-100">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="w-2.5 h-6 bg-[#ec4899] rounded-full"></span>
                            <h3 className="text-slate-800 font-black text-sm uppercase tracking-widest">Performance Indicators (8 Points)</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: '1. Line Complaints', key: 'lineComplaints', placeholder: '0' },
                                { label: '2. Warranty Complaints', key: 'warrantyComplaints', placeholder: '0' },
                                { label: '3. Premium Freight', key: 'premiumFreightIncidents', placeholder: '0' },
                                { label: '4. Quality Stoppage', key: 'lineStoppageQuality', placeholder: '0' },
                                { label: '5. Supply Stoppage', key: 'lineStoppageSupply', placeholder: '0' },
                                { label: '6. Premium Incident', key: 'premiumFightIncident', placeholder: '0' },
                                { label: '7. Schedule Dispatch %', key: 'scheduleVsDispatch', placeholder: '100%' },
                                { label: '8. Customer Audit Score', key: 'customerAuditScore', placeholder: 'NA' },
                            ].map((item) => (
                                <div key={item.key} className="space-y-2 group">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight group-focus-within:text-[#ec4899] transition-colors">{item.label}</label>
                                    <input 
                                        required 
                                        className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#ec4899] focus:bg-white outline-none text-center font-black text-slate-700 transition-all shadow-sm" 
                                        value={formData[item.key]} 
                                        onChange={(e) => handleChange(item.key, e.target.value)} 
                                        placeholder={item.placeholder} 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Bar */}
                    {!isViewMode &&(
                    <div className="bg-white/90 backdrop-blur-xl fixed md:sticky bottom-0 md:bottom-6 left-0 right-0 md:rounded-3xl border-t md:border border-slate-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] md:shadow-2xl p-4 flex flex-row items-center justify-between z-50">
                        <button 
                            type="button" 
                            onClick={() => navigate('/qa-hub/monthly')} 
                            className="flex items-center gap-2 px-4 md:px-6 py-3 text-slate-400 font-bold hover:text-red-500 transition-all text-xs uppercase tracking-widest"
                        >
                            <i className="bi bi-x-circle text-xl"></i>
                            <span className="hidden sm:inline">Cancel</span>
                        </button>
                        
                        <div className="flex items-center gap-3 md:gap-4 flex-1 justify-end">
                            <button 
                                type="button" 
                                onClick={resetForm} 
                                className="px-5 md:px-10 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 border border-slate-200 transition-all"
                            >
                                Reset
                            </button>
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="flex-1 md:flex-none px-6 md:px-16 py-4 bg-[#ec4899] text-white rounded-2xl font-black uppercase text-[10px] md:text-[11px] tracking-widest shadow-xl shadow-pink-500/30 hover:bg-[#db2777] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <i className="bi bi-check-circle-fill text-base"></i>
                                <span>{isSubmitting ? 'Saving...' : 'Save Metrics'}</span>
                            </button>
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

export default CustomerSatisfactionCard;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const CustomerSatisfactionCard = () => {
//     const navigate = useNavigate();

//     const initialFormState = {
//         customerName: '',
//         monthYear: '',
//         lineComplaints: '',
//         warrantyComplaints: '',
//         premiumFreightIncidents: '',
//         lineStoppageQuality: '',
//         lineStoppageSupply: '',
//         premiumFightIncident: '',
//         scheduleVsDispatch: '100',
//         customerAuditScore: 'NA'
//     };

//     const [formData, setFormData] = useState(initialFormState);

//     const handleChange = (field, value) => {
//         setFormData(prev => ({ ...prev, [field]: value }));
//     };

//     const resetForm = () => {
//         if (window.confirm("Clear all entry fields?")) {
//             setFormData(initialFormState);
//         }
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log("Customer Satisfaction Data:", formData);
//         alert('Customer Satisfaction Card Submitted!');
//         setFormData(initialFormState);
//     };

//     return (
//         <div className="min-h-screen bg-[#fff7fb] text-slate-700 font-sans pb-32 md:pb-12">
//             {/* Header Section with Pink Theme */}
//             <div className="bg-gradient-to-br from-[#be185d] via-[#ec4899] to-[#f472b6] pt-10 md:pt-12 pb-24 md:pb-32 px-4 md:px-6 shadow-lg">
//                 <div className="max-w-6xl mx-auto flex items-center gap-4 text-white">
//                     <button 
//                         onClick={() => navigate('/qa-hub/monthly')}
//                         className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-2xl transition-all border border-white/20 backdrop-blur-md"
//                     >
//                         <i className="bi bi-chevron-left text-xl"></i>
//                     </button>
//                     <div>
//                         <h1 className="text-xl md:text-3xl font-black uppercase tracking-tight leading-none">Customer Satisfaction</h1>
//                         <p className="text-pink-100 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mt-2 opacity-80">AOT/F/QA/29 | Performance Metrics</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Main Form Body */}
//             <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-16 md:-mt-24">
//                 <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                    
//                     {/* Basic Info Card */}
//                     <div className="bg-white rounded-3xl md:rounded-[2rem] shadow-xl p-6 md:p-10 border border-slate-100">
//                         <div className="flex items-center gap-3 mb-8">
//                             <span className="w-2.5 h-6 bg-[#ec4899] rounded-full"></span>
//                             <h3 className="text-slate-800 font-black text-sm uppercase tracking-widest">Entry Information</h3>
//                         </div>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div className="space-y-1.5">
//                                 <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide ml-1">Customer Name</label>
//                                 <input required className="w-full px-5 py-3.5 bg-slate-50/50 border-2 border-slate-200 rounded-2xl focus:border-[#ec4899] focus:bg-white outline-none transition-all font-semibold text-sm text-slate-800" 
//                                 value={formData.customerName} onChange={(e) => handleChange('customerName', e.target.value)} placeholder="e.g. SKH Y Tec India" />
//                             </div>
//                             <div className="space-y-1.5">
//                                 <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide ml-1">Select Month / Year</label>
//                                 <input required type="month" className="w-full px-5 py-3.5 bg-slate-50/50 border-2 border-slate-200 rounded-2xl focus:border-[#ec4899] focus:bg-white outline-none transition-all font-semibold text-sm text-slate-800" 
//                                 value={formData.monthYear} onChange={(e) => handleChange('monthYear', e.target.value)} />
//                             </div>
//                         </div>
//                     </div>

//                     {/* 8-Point Performance Metrics Section */}
//                     <div className="bg-white rounded-3xl md:rounded-[2rem] shadow-xl p-6 md:p-10 border border-slate-100">
//                         <div className="flex items-center gap-3 mb-8">
//                             <span className="w-2.5 h-6 bg-[#ec4899] rounded-full"></span>
//                             <h3 className="text-slate-800 font-black text-sm uppercase tracking-widest">Performance Indicators (8 Points)</h3>
//                         </div>
                        
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                             {[
//                                 { label: '1. Line Complaints', key: 'lineComplaints', placeholder: '0' },
//                                 { label: '2. Warranty Complaints', key: 'warrantyComplaints', placeholder: '0' },
//                                 { label: '3. Premium Freight', key: 'premiumFreightIncidents', placeholder: '0' },
//                                 { label: '4. Quality Stoppage', key: 'lineStoppageQuality', placeholder: '0' },
//                                 { label: '5. Supply Stoppage', key: 'lineStoppageSupply', placeholder: '0' },
//                                 { label: '6. Premium Incident', key: 'premiumFightIncident', placeholder: '0' },
//                                 { label: '7. Schedule Dispatch %', key: 'scheduleVsDispatch', placeholder: '100%' },
//                                 { label: '8. Customer Audit Score', key: 'customerAuditScore', placeholder: 'NA' },
//                             ].map((item) => (
//                                 <div key={item.key} className="space-y-2 group">
//                                     <label className="text-[10px] font-bold text-slate-500 uppercase tracking-tight group-focus-within:text-[#ec4899] transition-colors">{item.label}</label>
//                                     <input 
//                                         required 
//                                         className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#ec4899] focus:bg-white outline-none text-center font-black text-slate-700 transition-all shadow-sm" 
//                                         value={formData[item.key]} 
//                                         onChange={(e) => handleChange(item.key, e.target.value)} 
//                                         placeholder={item.placeholder} 
//                                     />
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Action Bar */}
//                     <div className="bg-white/90 backdrop-blur-xl fixed md:sticky bottom-0 md:bottom-6 left-0 right-0 md:rounded-3xl border-t md:border border-slate-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] md:shadow-2xl p-4 flex flex-row items-center justify-between z-50">
//                         <button 
//                             type="button" 
//                             onClick={() => navigate('/qa-hub/monthly')} 
//                             className="flex items-center gap-2 px-4 md:px-6 py-3 text-slate-400 font-bold hover:text-red-500 transition-all text-xs uppercase tracking-widest"
//                         >
//                             <i className="bi bi-x-circle text-xl"></i>
//                             <span className="hidden sm:inline">Cancel</span>
//                         </button>
                        
//                         <div className="flex items-center gap-3 md:gap-4 flex-1 justify-end">
//                             <button 
//                                 type="button" 
//                                 onClick={resetForm} 
//                                 className="px-5 md:px-10 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 border border-slate-200 transition-all"
//                             >
//                                 Reset
//                             </button>
//                             <button 
//                                 type="submit" 
//                                 className="flex-1 md:flex-none px-6 md:px-16 py-4 bg-[#ec4899] text-white rounded-2xl font-black uppercase text-[10px] md:text-[11px] tracking-widest shadow-xl shadow-pink-500/30 hover:bg-[#db2777] active:scale-95 transition-all flex items-center justify-center gap-2"
//                             >
//                                 <i className="bi bi-check-circle-fill text-base"></i>
//                                 <span>Save <span className="hidden sm:inline">Metrics</span></span>
//                             </button>
//                         </div>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default CustomerSatisfactionCard;
