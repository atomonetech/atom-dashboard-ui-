import React, { useState, useEffect } from 'react';
import { useNavigate,useParams } from 'react-router-dom';

import { getApiUrl } from '../../../../../config/api'; 
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";



const LayoutInspectionReport = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isViewMode = Boolean(id); // Determine if we are in view mode based on the presence of an ID

    const emptyInspection = {
        parameters: '',
        specNominal: '',
        tolerance: '',
        inspectionMethod: '',
        sample1: '',
        sample2: '',
        sample3: '',
        sample4: '',
        sample5: '',
        remarks: ''
    };

    const initialFormState = {
        partName: '',
        partNo: '',
        model: '',
        customer: '',
        date: '',
        sampleSize: '',
        preparedBy: '',
        verifiedBy: '',
        inspections: [emptyInspection]
    };

    const [formData, setFormData] = useState(initialFormState);
    const [partList, setPartList] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
       // --- APPROVAL / VIEW MODE STATE ---
        const [approvalRemark, setApprovalRemark] = useState("");
        const [approvalLoading, setApprovalLoading] = useState(false);
        const [approvalStatus, setApprovalStatus] = useState("");
        const [reviewedAt, setReviewedAt] = useState("");
        const username = localStorage.getItem("username") || "Unknown User";

     useEffect(() => {
           if (!isViewMode) {
               const today = new Date().toISOString().split('T')[0];
               setFormData(prev => ({ ...prev, date: today }));
           }
   
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
       }, [isViewMode]);

useEffect(() => {
        if (!id) return;

        const fetchReport = async () => {
            try {
                // IMPORTANT: Change this URL to match your actual backend GET route
                const res = await axios.get(`${API_BASE_URL}/api/get-single-report/layout-inspection-view/${id}/`);
                
                if (res.data.success) {
                    const data = res.data.data || {};
                     const parts = data.part_name_no.split(" - ");
                       const extractedName = parts[0].trim();
                        const extractedNo = parts[1] ? parts[1].trim() : "";
                    // Map the snake_case backend response to your camelCase state
                    setFormData({
                        partName: extractedName,
                        partNo: extractedNo,
                        model: data.model_name || '',
                        customer: data.customer_name || '',
                        date: data.inspection_date || '',
                        sampleSize: data.sample_size || '',
                        preparedBy: data.prepared_by || '',
                        verifiedBy: data.verified_by || '',
                        username:username || '',
                        
                        // Map the inspections array safely
                        inspections: data.inspections && data.inspections.length > 0 
                            ? data.inspections.map(item => ({
                                parameters: item.parameters || '',
                                specNominal: item.spec_nominal || '',
                                tolerance: item.tolerance || '',
                                inspectionMethod: item.inspection_method || '',
                                sample1: item.sample_1 || '',
                                sample2: item.sample_2 || '',
                                sample3: item.sample_3 || '',
                                sample4: item.sample_4 || '',
                                sample5: item.sample_5 || '',
                                remarks: item.remarks || ''
                            }))
                            : [emptyInspection] // Fallback if array is missing
                    });

                    // (Optional) If you are using your standard approval states:
                    // setApprovalStatus(data.approval_status || "");
                    // setApprovalRemark(data.approval_remarks || "");
                    
                } else {
                    alert(res.data.error || "Failed to load the Inspection Report.");
                }
            } catch (err) {
                console.error("Error loading Report:", err);
                alert(err.response?.data?.error || "Failed to load the Inspection Report.");
            }
        };

        fetchReport();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const handlePartNameChange = async (value) => {
        handleChange('partName', value);
        if (!value) return;

        try {
            const [noRes, modRes] = await Promise.all([
                fetch(getApiUrl(`/api/master-dropdown/?filter=part_no&part=${encodeURIComponent(value)}`)),
                fetch(getApiUrl(`/api/master-dropdown/?filter=model_by_part&part=${encodeURIComponent(value)}`))
            ]);
            const noData = await noRes.json();
            const modData = await modRes.json();

            setFormData(prev => ({
                ...prev,
                partNo: noData[0] || '',
                model: modData[0] || ''
            }));
        } catch (error) {
            console.error("Failed to auto-fill:", error);
        }
    };

    const handleInspectionChange = (index, field, value) => {
        const updatedInspections = [...formData.inspections];
        updatedInspections[index][field] = value;
        setFormData(prev => ({ ...prev, inspections: updatedInspections }));
    };

    const addInspection = () => setFormData(prev => ({ ...prev, inspections: [...prev.inspections, emptyInspection] }));
    const removeInspection = (index) => {
        if (formData.inspections.length > 1) {
            setFormData(prev => ({ ...prev, inspections: prev.inspections.filter((_, i) => i !== index) }));
        }
    };

    const resetForm = () => {
        if (window.confirm("Are you sure you want to clear the form?")) {
            const today = new Date().toISOString().split('T')[0];
            setFormData({ ...initialFormState, date: today });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch(getApiUrl(`/api/layout-inspection/`), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                 
                alert('Layout Inspection Report Submitted Successfully!');
                const today = new Date().toISOString().split('T')[0];
                setFormData({ ...initialFormState, date: today });
            } else {
                alert('Failed to submit. Please check network or backend logs.');
            }
        } catch (error) {
            console.error('Submission Error:', error);
            alert('An error occurred while sending data to the server.');
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

            alert(res.data?.message || "Report approved successfully.");
            navigate("/qa-hub/monthly");
        } catch (err) {
            console.error("Approve error:", err);
            alert(err.response?.data?.error || "Approval failed.");
        } finally {
            setApprovalLoading(false);
        }
    };

    const handleReject = async () => {
        if (!approvalRemark.trim()) {
            alert("Please enter a remark before rejecting.");
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

            alert(res.data?.message || "Report rejected successfully.");
            navigate("/qa-hub/monthly");
        } catch (err) {
            console.error("Reject error:", err);
            alert(err.response?.data?.error || "Reject failed.");
        } finally {
            setApprovalLoading(false);
        }
    };

    const isAlreadyReviewed = approvalStatus && (approvalStatus.toLowerCase().includes("approved") || approvalStatus.toLowerCase().includes("rejected"));

    return (
        <div className="min-h-screen bg-[#fcfcfc] text-slate-700 font-sans pb-24 md:pb-12">
            <div className="bg-gradient-to-br from-[#b47804] to-[#f59f0a] pt-10 md:pt-12 pb-24 md:pb-32 px-4 md:px-6">
                <div className="max-w-6xl mx-auto flex items-center gap-4">
                    <button onClick={() => navigate('/qa-hub/monthly')} className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-xl text-white transition-all backdrop-blur-md border border-white/20 shadow-lg">
                        <i className="bi bi-arrow-left"></i>
                    </button>
                    <div>
                        <h1 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight leading-tight">Layout Inspection</h1>
                        <p className="text-orange-100 text-[10px] md:text-xs font-bold tracking-widest uppercase opacity-90">AOT-F-QA-06A | Quality Control</p>
                    </div>
                </div>
            </div>

                
          {isViewMode && (
          <div className="px-3 px-md-4 pt-3">
            <span className="badge px-3 py-2 d-inline-block text-primary" style={{ backgroundColor: '#eff6ff', border: '1px solid #93c5fd', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Review Mode
            </span>
          </div>
        )}

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


            <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-16 md:-mt-20">
                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                    <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-orange-900/5 p-5 md:p-8 border border-white">
                        <h3 className="text-[#f59f0a] font-black text-[11px] md:text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-[#f59f0a] rounded-full"></span> General Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Part Name</label>
                                <select required className="w-full px-4 py-2.5 md:py-3 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-[#f59f0a] outline-none font-semibold text-sm appearance-none" 
                                value={formData.partName} onChange={(e) => handlePartNameChange(e.target.value)}>
                                    <option value="" disabled>Select Part</option>
                                    {partList.map((part, idx) => <option key={idx} value={part}>{part}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Part Number</label>
                                <input required className="w-full px-4 py-2.5 md:py-3 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-[#f59f0a] outline-none font-semibold text-sm" 
                                value={formData.partNo} onChange={(e) => handleChange('partNo', e.target.value)} placeholder="Part No" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Date</label>
                                <input required type="date" className="w-full px-4 py-2.5 md:py-3 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-[#f59f0a] outline-none font-semibold text-sm" 
                                value={formData.date} onChange={(e) => handleChange('date', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Model</label>
                                <input required className="w-full px-4 py-2.5 md:py-3 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-[#f59f0a] outline-none font-semibold text-sm" 
                                value={formData.model} onChange={(e) => handleChange('model', e.target.value)} placeholder="Model" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Customer</label>
                                <input required className="w-full px-4 py-2.5 md:py-3 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-[#f59f0a] outline-none font-semibold text-sm" 
                                value={formData.customer} onChange={(e) => handleChange('customer', e.target.value)} placeholder="Customer Name" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Sample Size</label>
                                <input required className="w-full px-4 py-2.5 md:py-3 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-[#f59f0a] outline-none font-semibold text-sm" 
                                value={formData.sampleSize} onChange={(e) => handleChange('sampleSize', e.target.value)} placeholder="Qty" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-orange-900/5 p-5 md:p-8 border border-white">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-[#f59f0a] font-black text-[11px] md:text-xs uppercase tracking-widest flex items-center gap-2">
                                <span className="w-1.5 h-4 bg-[#f59f0a] rounded-full"></span> Inspection Parameters
                            </h3>
                            <button type="button" onClick={addInspection} className="px-4 py-2 bg-orange-100 text-[#f59f0a] rounded-xl text-xs font-bold hover:bg-orange-200">
                                + Add Parameter
                            </button>
                        </div>
                        
                        {formData.inspections.map((item, index) => (
                            <div key={index} className="mb-10 pb-10 border-b-2 border-slate-100 last:border-0 last:mb-0 last:pb-0 relative">
                                {formData.inspections.length > 1 && (
                                    <button type="button" onClick={() => removeInspection(index)} className="absolute top-0 right-0 text-red-400 hover:text-red-600 text-sm font-bold">
                                        <i className="bi bi-trash"></i> Remove
                                    </button>
                                )}
                                <h4 className="text-slate-400 text-[10px] font-bold uppercase mb-4">Parameter #{index + 1}</h4>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Parameters</label>
                                        <textarea rows="2" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-[#f59f0a] outline-none resize-none text-sm" 
                                        value={item.parameters} onChange={(e) => handleInspectionChange(index, 'parameters', e.target.value)} placeholder="Dimension/Feature description..." />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Spec (Nominal)</label>
                                            <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-[#f59f0a] outline-none text-sm font-semibold" 
                                            value={item.specNominal} onChange={(e) => handleInspectionChange(index, 'specNominal', e.target.value)} placeholder="Value" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Tolerance</label>
                                            <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-[#f59f0a] outline-none text-sm font-semibold" 
                                            value={item.tolerance} onChange={(e) => handleInspectionChange(index, 'tolerance', e.target.value)} placeholder="± Value" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1 mb-6">
                                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Inspection Method</label>
                                    <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-[#f59f0a] outline-none text-sm font-semibold" 
                                    value={item.inspectionMethod} onChange={(e) => handleInspectionChange(index, 'inspectionMethod', e.target.value)} placeholder="Vernier / Micrometer / CMM etc." />
                                </div>

                                <div className="bg-slate-50/50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Actual Observations</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <div key={num} className="space-y-1">
                                                <label className="text-[9px] font-bold uppercase text-slate-400 text-center block">Sample {num}</label>
                                                <input className="w-full px-3 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-[#f59f0a] outline-none text-sm text-center font-bold shadow-sm" 
                                                value={item[`sample${num}`]} onChange={(e) => handleInspectionChange(index, `sample${num}`, e.target.value)} placeholder="0.00" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Remarks</label>
                                    <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-[#f59f0a] outline-none text-sm font-black text-orange-600 shadow-sm" 
                                    value={item.remarks} onChange={(e) => handleInspectionChange(index, 'remarks', e.target.value)} placeholder="OK / NOT OK" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-orange-900/5 p-5 md:p-8 border border-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400">Prepared By</label>
                                <input required className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#f59f0a] outline-none font-semibold text-sm" 
                                value={formData.preparedBy} onChange={(e) => handleChange('preparedBy', e.target.value)} placeholder="Name / Sign" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400">Verified By</label>
                                <input required className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#f59f0a] outline-none font-semibold text-sm" 
                                value={formData.verifiedBy} onChange={(e) => handleChange('verifiedBy', e.target.value)} placeholder="Name / Sign" />
                            </div>
                        </div>
                    </div>
                    {!isViewMode && (
                    <div className="bg-white/90 backdrop-blur-md fixed md:sticky bottom-0 md:bottom-6 left-0 right-0 md:rounded-3xl border-t md:border border-white shadow-2xl p-4 flex flex-row gap-3 justify-between items-center z-30">
                        <button type="button" onClick={() => navigate('/qa-hub/monthly')} className="flex items-center gap-2 px-4 md:px-6 py-2 text-slate-400 font-bold hover:text-red-500 transition-all text-sm">
                            <i className="bi bi-x-circle text-lg"></i> <span className="hidden sm:inline">Exit</span>
                        </button>
                        
                        <div className="flex gap-2 md:gap-4">
                            <button type="button" onClick={resetForm} className="px-4 md:px-8 py-2.5 bg-slate-100 text-slate-600 rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">
                                Reset
                            </button>
                            <button type="submit" disabled={isSubmitting} className="px-6 md:px-12 py-3 bg-[#f59f0a] text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-orange-500/30 hover:bg-[#d98b04] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50">
                                <i className="bi bi-cloud-check text-base"></i> {isSubmitting ? 'Submitting...' : 'Submit Inspection'}
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

export default LayoutInspectionReport;
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const LayoutInspectionReport = () => {
//     const navigate = useNavigate();

//     const emptyInspection = {
//         parameters: '',
//         specNominal: '',
//         tolerance: '',
//         inspectionMethod: '',
//         sample1: '',
//         sample2: '',
//         sample3: '',
//         sample4: '',
//         sample5: '',
//         remarks: ''
//     };

//     const initialFormState = {
//         partName: '',
//         partNo: '',
//         model: '',
//         customer: '',
//         date: '',
//         sampleSize: '',
//         preparedBy: '',
//         verifiedBy: '',
//         inspections: [emptyInspection]
//     };

//     const [formData, setFormData] = useState(initialFormState);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     useEffect(() => {
//         const today = new Date().toISOString().split('T')[0];
//         setFormData(prev => ({ ...prev, date: today }));
//     }, []);

//     const handleChange = (field, value) => {
//         setFormData(prev => ({ ...prev, [field]: value }));
//     };

//     const handleInspectionChange = (index, field, value) => {
//         const updatedInspections = [...formData.inspections];
//         updatedInspections[index][field] = value;
//         setFormData(prev => ({ ...prev, inspections: updatedInspections }));
//     };

//     const addInspection = () => {
//         setFormData(prev => ({
//             ...prev,
//             inspections: [...prev.inspections, emptyInspection]
//         }));
//     };

//     const removeInspection = (index) => {
//         if (formData.inspections.length > 1) {
//             const updatedInspections = formData.inspections.filter((_, i) => i !== index);
//             setFormData(prev => ({ ...prev, inspections: updatedInspections }));
//         }
//     };

//     const resetForm = () => {
//         if (window.confirm("Are you sure you want to clear the form?")) {
//             const today = new Date().toISOString().split('T')[0];
//             setFormData({ ...initialFormState, date: today });
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);
        
//         // Replace with your actual backend URL
//         const BACKEND_API_URL = 'http://localhost:8000/api/layout-inspection/';

//         try {
//             const response = await fetch(BACKEND_API_URL, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(formData)
//             });

//             if (response.ok) {
//                 alert('Layout Inspection Report Submitted Successfully!');
//                 const today = new Date().toISOString().split('T')[0];
//                 setFormData({ ...initialFormState, date: today });
//             } else {
//                 alert('Failed to submit. Please check network or backend logs.');
//             }
//         } catch (error) {
//             console.error('Submission Error:', error);
//             alert('An error occurred while sending data to the server.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-[#fcfcfc] text-slate-700 font-sans pb-24 md:pb-12">
//             <div className="bg-gradient-to-br from-[#b47804] to-[#f59f0a] pt-10 md:pt-12 pb-24 md:pb-32 px-4 md:px-6">
//                 <div className="max-w-6xl mx-auto flex items-center gap-4">
//                     <button 
//                         onClick={() => navigate('/qa-hub/monthly')}
//                         className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-xl text-white transition-all backdrop-blur-md border border-white/20 shadow-lg"
//                     >
//                         <i className="bi bi-arrow-left"></i>
//                     </button>
//                     <div>
//                         <h1 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight leading-tight">Layout Inspection</h1>
//                         <p className="text-orange-100 text-[10px] md:text-xs font-bold tracking-widest uppercase opacity-90">AOT-F-QA-06A | Quality Control</p>
//                     </div>
//                 </div>
//             </div>

//             <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-16 md:-mt-20">
//                 <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                    
//                     {/* General Information Section */}
//                     <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-orange-900/5 p-5 md:p-8 border border-white">
//                         <h3 className="text-[#f59f0a] font-black text-[11px] md:text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
//                             <span className="w-1.5 h-4 bg-[#f59f0a] rounded-full"></span> General Information
//                         </h3>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
//                             {[
//                                 { label: 'Part Name', key: 'partName', type: 'text', placeholder: 'Part Name' },
//                                 { label: 'Part Number', key: 'partNo', type: 'text', placeholder: 'Part No' },
//                                 { label: 'Date', key: 'date', type: 'date' },
//                                 { label: 'Model', key: 'model', type: 'text', placeholder: 'Model' },
//                                 { label: 'Customer', key: 'customer', type: 'text', placeholder: 'Customer Name' },
//                                 { label: 'Sample Size', key: 'sampleSize', type: 'text', placeholder: 'Qty' }
//                             ].map((field) => (
//                                 <div key={field.key} className="space-y-1">
//                                     <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">{field.label}</label>
//                                     <input 
//                                         required 
//                                         type={field.type}
//                                         className="w-full px-4 py-2.5 md:py-3 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-[#f59f0a] outline-none font-semibold text-sm" 
//                                         value={formData[field.key]} 
//                                         onChange={(e) => handleChange(field.key, e.target.value)} 
//                                         placeholder={field.placeholder} 
//                                     />
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Dynamic Inspection Parameters Section */}
//                     <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-orange-900/5 p-5 md:p-8 border border-white">
//                         <div className="flex justify-between items-center mb-6">
//                             <h3 className="text-[#f59f0a] font-black text-[11px] md:text-xs uppercase tracking-widest flex items-center gap-2">
//                                 <span className="w-1.5 h-4 bg-[#f59f0a] rounded-full"></span> Inspection Parameters
//                             </h3>
//                             <button type="button" onClick={addInspection} className="px-4 py-2 bg-orange-100 text-[#f59f0a] rounded-xl text-xs font-bold hover:bg-orange-200">
//                                 + Add Parameter
//                             </button>
//                         </div>
                        
//                         {formData.inspections.map((item, index) => (
//                             <div key={index} className="mb-10 pb-10 border-b-2 border-slate-100 last:border-0 last:mb-0 last:pb-0 relative">
//                                 {formData.inspections.length > 1 && (
//                                     <button type="button" onClick={() => removeInspection(index)} className="absolute top-0 right-0 text-red-400 hover:text-red-600 text-sm font-bold">
//                                         <i className="bi bi-trash"></i> Remove
//                                     </button>
//                                 )}
//                                 <h4 className="text-slate-400 text-[10px] font-bold uppercase mb-4">Parameter #{index + 1}</h4>

//                                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//                                     <div className="space-y-1">
//                                         <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Parameters</label>
//                                         <textarea rows="2" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-[#f59f0a] outline-none resize-none text-sm" 
//                                         value={item.parameters} onChange={(e) => handleInspectionChange(index, 'parameters', e.target.value)} placeholder="Dimension/Feature description..." />
//                                     </div>
//                                     <div className="grid grid-cols-2 gap-4">
//                                         <div className="space-y-1">
//                                             <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Spec (Nominal)</label>
//                                             <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-[#f59f0a] outline-none text-sm font-semibold" 
//                                             value={item.specNominal} onChange={(e) => handleInspectionChange(index, 'specNominal', e.target.value)} placeholder="Value" />
//                                         </div>
//                                         <div className="space-y-1">
//                                             <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Tolerance</label>
//                                             <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-[#f59f0a] outline-none text-sm font-semibold" 
//                                             value={item.tolerance} onChange={(e) => handleInspectionChange(index, 'tolerance', e.target.value)} placeholder="± Value" />
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="space-y-1 mb-6">
//                                     <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Inspection Method</label>
//                                     <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-[#f59f0a] outline-none text-sm font-semibold" 
//                                     value={item.inspectionMethod} onChange={(e) => handleInspectionChange(index, 'inspectionMethod', e.target.value)} placeholder="Vernier / Micrometer / CMM etc." />
//                                 </div>

//                                 <div className="bg-slate-50/50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100">
//                                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Actual Observations</h4>
//                                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
//                                         {[1, 2, 3, 4, 5].map((num) => (
//                                             <div key={num} className="space-y-1">
//                                                 <label className="text-[9px] font-bold uppercase text-slate-400 text-center block">Sample {num}</label>
//                                                 <input className="w-full px-3 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-[#f59f0a] outline-none text-sm text-center font-bold shadow-sm" 
//                                                 value={item[`sample${num}`]} onChange={(e) => handleInspectionChange(index, `sample${num}`, e.target.value)} placeholder="0.00" />
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>

//                                 <div className="mt-6 space-y-1">
//                                     <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Remarks</label>
//                                     <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-[#f59f0a] outline-none text-sm font-black text-orange-600 shadow-sm" 
//                                     value={item.remarks} onChange={(e) => handleInspectionChange(index, 'remarks', e.target.value)} placeholder="OK / NOT OK" />
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     {/* Sign-off Section */}
//                     <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-orange-900/5 p-5 md:p-8 border border-white">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div className="space-y-1">
//                                 <label className="text-[10px] font-bold uppercase text-slate-400">Prepared By</label>
//                                 <input required className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#f59f0a] outline-none font-semibold text-sm" 
//                                 value={formData.preparedBy} onChange={(e) => handleChange('preparedBy', e.target.value)} placeholder="Name / Sign" />
//                             </div>
//                             <div className="space-y-1">
//                                 <label className="text-[10px] font-bold uppercase text-slate-400">Verified By</label>
//                                 <input required className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#f59f0a] outline-none font-semibold text-sm" 
//                                 value={formData.verifiedBy} onChange={(e) => handleChange('verifiedBy', e.target.value)} placeholder="Name / Sign" />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Fixed/Sticky Bottom Action Bar */}
//                     <div className="bg-white/90 backdrop-blur-md fixed md:sticky bottom-0 md:bottom-6 left-0 right-0 md:rounded-3xl border-t md:border border-white shadow-2xl p-4 flex flex-row gap-3 justify-between items-center z-30">
//                         <button 
//                             type="button" 
//                             onClick={() => navigate('/qa-hub/monthly')} 
//                             className="flex items-center gap-2 px-4 md:px-6 py-2 text-slate-400 font-bold hover:text-red-500 transition-all text-sm"
//                         >
//                             <i className="bi bi-x-circle text-lg"></i> <span className="hidden sm:inline">Exit</span>
//                         </button>
                        
//                         <div className="flex gap-2 md:gap-4">
//                             <button 
//                                 type="button" 
//                                 onClick={resetForm} 
//                                 className="px-4 md:px-8 py-2.5 bg-slate-100 text-slate-600 rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all"
//                             >
//                                 Reset
//                             </button>
//                             <button 
//                                 type="submit" 
//                                 disabled={isSubmitting}
//                                 className="px-6 md:px-12 py-3 bg-[#f59f0a] text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-orange-500/30 hover:bg-[#d98b04] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
//                             >
//                                 <i className="bi bi-cloud-check text-base"></i> {isSubmitting ? 'Submitting...' : 'Submit Inspection'}
//                             </button>
//                         </div>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default LayoutInspectionReport;
