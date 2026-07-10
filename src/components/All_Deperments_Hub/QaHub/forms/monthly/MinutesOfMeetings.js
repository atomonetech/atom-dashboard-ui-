import React, { useState, useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { getApiUrl } from "../../../../../config/api";
import {
  successAlert,
  errorAlert,
  warningAlert,
  infoAlert,
  confirmAlert,
} from "../../../../../utils/alertUtils";
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const MinutesOfMeetings = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isViewMode = Boolean(id);

  const initialFormState = {
    date: "",
    time: "",
    subject: "",
    aotMembers: "",
    supplierMembers: "",
    partDetails: "",
    problemDetails: "",
    actionPlan: "",
    followUpComment: "",
    responsibility: "",
    targetDate: "",
    statusRemark: "",
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

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, date: today }));

    const fetchParts = async () => {
      try {
        const res = await fetch(
          getApiUrl("/api/master-dropdown/?filter=all_parts"),
        );
        if (!res.ok) throw new Error("Network response was not ok");

        const data = await res.json();
        const uniqueParts = [
          ...new Set(
            data.map((item) => (Array.isArray(item) ? item[0] : item)),
          ),
        ].filter(Boolean);
        setPartList(uniqueParts);
      } catch (error) {
        console.error("Failed to fetch parts:", error);
      }
    };
    fetchParts();
  }, []);

useEffect(() => {
    const fetchMOMReport = async () => {
      if (!id) return; // Skip if creating a new record

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/get-single-report/mom-view/${id}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // 1. Parse the JSON
        const result = await response.json();
        
        // 2. Safely extract the inner "data" object!
        const data = result.data || {};

        // 3. Extract the first discussion item (if it exists) to map the lower fields
        const firstDiscussion = data.discussions && data.discussions.length > 0 
            ? data.discussions[0] 
            : {};

        // 4. Map API response to the initialFormState keys
        setFormData({
          date: data.date || "",
          time: data.time || "",
          subject: data.subject || "",
          aotMembers: data.aotMembers || "",
          supplierMembers: data.supplierMembers || "",
          
          // These fields map to the nested snake_case keys in the discussions array
          partDetails: firstDiscussion.part_name_no || "",
          problemDetails: firstDiscussion.defects_problem_details || "",
          actionPlan: firstDiscussion.action_plan || "",
          followUpComment: firstDiscussion.follow_up_comments || "",
          responsibility: firstDiscussion.responsibility || "",
          targetDate: firstDiscussion.target_date || "",
          statusRemark: firstDiscussion.status_remark || "",
        });

      } catch (err) {
        console.error("Error fetching Minutes of Meetings data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMOMReport();
  }, [id]);


  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    if (window.confirm("Are you sure you want to reset the MOM form?")) {
      const today = new Date().toISOString().split("T")[0];
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
      const response = await fetch(getApiUrl("/api/mom/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        successAlert("Minutes of Meeting Saved Successfully!");
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
    <div className="min-h-screen bg-[#fbfaff] text-slate-700 font-sans pb-24 md:pb-12">
      {/* Header Section with Purple Theme */}
      <div className="bg-gradient-to-br from-[#5b21b6] via-[#8b5cf6] to-[#a78bfa] pt-12 pb-28 px-4 md:px-6">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/qa-hub/monthly")}
            className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-2xl text-white transition-all backdrop-blur-md border border-white/20 shadow-lg"
          >
            <i className="bi bi-chevron-left text-xl"></i>
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase leading-tight">
              Minutes Of Meeting
            </h1>
            <p className="text-purple-100 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase opacity-90">
              Official Discussion Record (AOT/F/QA/19)
            </p>
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

      {/* Form Container */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-16 md:-mt-20">
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          {/* Meeting Overview Card */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-purple-900/5 p-6 md:p-10 border border-white">
            <h3 className="text-[#8b5cf6] font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#8b5cf6] rounded-full"></span>{" "}
              Meeting Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-1.5 lg:col-span-2">
                <label className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-widest ml-1">
                  Subject / Agenda
                </label>
                <input
                  required
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all font-semibold text-sm shadow-sm"
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  placeholder="What was the meeting about?"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Date
                  </label>
                  <input
                    required
                    type="date"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all font-semibold text-xs"
                    value={formData.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Time
                  </label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all font-semibold text-xs"
                    value={formData.time}
                    onChange={(e) => handleChange("time", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Attendance Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  AOT Present Members
                </label>
                <textarea
                  rows="2"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all text-sm font-medium resize-none shadow-sm"
                  value={formData.aotMembers}
                  onChange={(e) => handleChange("aotMembers", e.target.value)}
                  placeholder="Names of internal members..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Supplier Present Members
                </label>
                <textarea
                  rows="2"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all text-sm font-medium resize-none shadow-sm"
                  value={formData.supplierMembers}
                  onChange={(e) =>
                    handleChange("supplierMembers", e.target.value)
                  }
                  placeholder="Names of external members..."
                />
              </div>
            </div>
          </div>

          {/* Discussion & Action Plan Card */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-purple-900/5 p-6 md:p-10 border border-white">
            <h3 className="text-[#8b5cf6] font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#8b5cf6] rounded-full"></span>{" "}
              Discussion Points
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Part Details Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Part Name / No.
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all font-semibold text-sm appearance-none"
                    value={formData.partDetails}
                    onChange={(e) =>
                      handleChange("partDetails", e.target.value)
                    }
                  >
                    <option value="" disabled>
                      Select Part (if applicable)
                    </option>
                    {partList.map((part, idx) => (
                      <option key={idx} value={part}>
                        {part}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Responsibility
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all font-semibold text-sm"
                    value={formData.responsibility}
                    onChange={(e) =>
                      handleChange("responsibility", e.target.value)
                    }
                    placeholder="Assigned person..."
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Defects / Problem Details
                </label>
                <textarea
                  rows="3"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all text-sm font-medium resize-none shadow-sm"
                  value={formData.problemDetails}
                  onChange={(e) =>
                    handleChange("problemDetails", e.target.value)
                  }
                  placeholder="What was the core problem discussed?"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-widest ml-1 font-bold">
                  Action Plan
                </label>
                <textarea
                  rows="3"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all text-sm font-medium resize-none shadow-sm"
                  value={formData.actionPlan}
                  onChange={(e) => handleChange("actionPlan", e.target.value)}
                  placeholder="Steps decided to solve the issue..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Follow-up Comment
                </label>
                <textarea
                  rows="2"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all text-sm font-medium resize-none shadow-sm"
                  value={formData.followUpComment}
                  onChange={(e) =>
                    handleChange("followUpComment", e.target.value)
                  }
                  placeholder="Any follow-up remarks or future notes..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Target Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all font-semibold text-sm"
                    value={formData.targetDate}
                    onChange={(e) => handleChange("targetDate", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Status / Remarks
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all font-bold text-sm text-[#8b5cf6]"
                    value={formData.statusRemark}
                    onChange={(e) =>
                      handleChange("statusRemark", e.target.value)
                    }
                    placeholder="Pending / Closed / In-progress"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Sticky Action Bar */}
          {!isViewMode &&(
          <div className="bg-white/90 backdrop-blur-md fixed md:sticky bottom-0 md:bottom-6 left-0 right-0 md:rounded-3xl border-t md:border border-white shadow-2xl p-4 flex flex-row gap-3 justify-between items-center z-30">
            <button
              type="button"
              onClick={() => navigate("/qa-hub/monthly")}
              className="flex items-center gap-2 px-6 py-2 text-slate-400 font-bold hover:text-red-500 transition-all text-xs uppercase tracking-widest"
            >
              <i className="bi bi-x-circle text-lg"></i>{" "}
              <span className="hidden sm:inline">Discard</span>
            </button>

            <div className="flex gap-2 md:gap-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 md:px-8 py-2.5 bg-slate-100 text-slate-600 rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 md:px-12 py-3 bg-[#8b5cf6] text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-purple-500/30 hover:bg-[#7c3aed] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                <i className="bi bi-journal-check text-base"></i>
                {isSubmitting ? "Saving..." : "Save Minutes"}
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

export default MinutesOfMeetings;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const MinutesOfMeetings = () => {
//     const navigate = useNavigate();

//     const initialFormState = {
//         date: '',
//         time: '',
//         subject: '',
//         aotMembers: '',
//         supplierMembers: '',
//         partDetails: '',
//         problemDetails: '',
//         actionPlan: '',
//         followUpComment: '', // Added Follow-up Comment
//         responsibility: '',
//         targetDate: '',
//         statusRemark: ''
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
//         if (window.confirm("Are you sure you want to reset the MOM form?")) {
//             const today = new Date().toISOString().split('T')[0];
//             setFormData({ ...initialFormState, date: today });
//         }
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log("MOM Data Submitted:", formData);
//         alert('Minutes of Meeting Saved Successfully!');
//         const today = new Date().toISOString().split('T')[0];
//         setFormData({ ...initialFormState, date: today });
//     };

//     return (
//         <div className="min-h-screen bg-[#fbfaff] text-slate-700 font-sans pb-24 md:pb-12">
//             {/* Header Section with Purple Theme */}
//             <div className="bg-gradient-to-br from-[#5b21b6] via-[#8b5cf6] to-[#a78bfa] pt-12 pb-28 px-4 md:px-6">
//                 <div className="max-w-5xl mx-auto flex items-center gap-4">
//                     <button
//                         onClick={() => navigate('/qa-hub/monthly')}
//                         className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-2xl text-white transition-all backdrop-blur-md border border-white/20 shadow-lg"
//                     >
//                         <i className="bi bi-chevron-left text-xl"></i>
//                     </button>
//                     <div>
//                         <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase leading-tight">Minutes Of Meeting</h1>
//                         <p className="text-purple-100 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase opacity-90">Official Discussion Record (AOT/F/QA/19)</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Form Container */}
//             <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-16 md:-mt-20">
//                 <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">

//                     {/* Meeting Overview Card */}
//                     <div className="bg-white rounded-3xl shadow-2xl shadow-purple-900/5 p-6 md:p-10 border border-white">
//                         <h3 className="text-[#8b5cf6] font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
//                             <span className="w-1.5 h-4 bg-[#8b5cf6] rounded-full"></span> Meeting Overview
//                         </h3>
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                             <div className="space-y-1.5 lg:col-span-2">
//                                 <label className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-widest ml-1">Subject / Agenda</label>
//                                 <input required className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all font-semibold text-sm shadow-sm"
//                                 value={formData.subject} onChange={(e) => handleChange('subject', e.target.value)} placeholder="What was the meeting about?" />
//                             </div>
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div className="space-y-1.5">
//                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
//                                     <input required type="date" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all font-semibold text-xs"
//                                     value={formData.date} onChange={(e) => handleChange('date', e.target.value)} />
//                                 </div>
//                                 <div className="space-y-1.5">
//                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Time</label>
//                                     <input type="time" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all font-semibold text-xs"
//                                     value={formData.time} onChange={(e) => handleChange('time', e.target.value)} />
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Attendance Section */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
//                             <div className="space-y-1.5">
//                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">AOT Present Members</label>
//                                 <textarea rows="2" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all text-sm font-medium resize-none shadow-sm"
//                                 value={formData.aotMembers} onChange={(e) => handleChange('aotMembers', e.target.value)} placeholder="Names of internal members..." />
//                             </div>
//                             <div className="space-y-1.5">
//                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Supplier Present Members</label>
//                                 <textarea rows="2" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all text-sm font-medium resize-none shadow-sm"
//                                 value={formData.supplierMembers} onChange={(e) => handleChange('supplierMembers', e.target.value)} placeholder="Names of external members..." />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Discussion & Action Plan Card */}
//                     <div className="bg-white rounded-3xl shadow-2xl shadow-purple-900/5 p-6 md:p-10 border border-white">
//                         <h3 className="text-[#8b5cf6] font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
//                             <span className="w-1.5 h-4 bg-[#8b5cf6] rounded-full"></span> Discussion Points
//                         </h3>

//                         <div className="space-y-6">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 <div className="space-y-1.5">
//                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Part Name / No.</label>
//                                     <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all font-semibold text-sm"
//                                     value={formData.partDetails} onChange={(e) => handleChange('partDetails', e.target.value)} placeholder="Part details if applicable" />
//                                 </div>
//                                 <div className="space-y-1.5">
//                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Responsibility</label>
//                                     <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all font-semibold text-sm"
//                                     value={formData.responsibility} onChange={(e) => handleChange('responsibility', e.target.value)} placeholder="Assigned person..." />
//                                 </div>
//                             </div>

//                             <div className="space-y-1.5">
//                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Defects / Problem Details</label>
//                                 <textarea rows="3" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all text-sm font-medium resize-none shadow-sm"
//                                 value={formData.problemDetails} onChange={(e) => handleChange('problemDetails', e.target.value)} placeholder="What was the core problem discussed?" />
//                             </div>

//                             <div className="space-y-1.5">
//                                 <label className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-widest ml-1 font-bold">Action Plan</label>
//                                 <textarea rows="3" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all text-sm font-medium resize-none shadow-sm"
//                                 value={formData.actionPlan} onChange={(e) => handleChange('actionPlan', e.target.value)} placeholder="Steps decided to solve the issue..." />
//                             </div>

//                             {/* 🔥 NEW: Follow-up Comment Field 🔥 */}
//                             <div className="space-y-1.5">
//                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Follow-up Comment</label>
//                                 <textarea rows="2" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all text-sm font-medium resize-none shadow-sm"
//                                 value={formData.followUpComment} onChange={(e) => handleChange('followUpComment', e.target.value)} placeholder="Any follow-up remarks or future notes..." />
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
//                                 <div className="space-y-1.5">
//                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Date</label>
//                                     <input type="date" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all font-semibold text-sm"
//                                     value={formData.targetDate} onChange={(e) => handleChange('targetDate', e.target.value)} />
//                                 </div>
//                                 <div className="space-y-1.5">
//                                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status / Remarks</label>
//                                     <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all font-bold text-sm text-[#8b5cf6]"
//                                     value={formData.statusRemark} onChange={(e) => handleChange('statusRemark', e.target.value)} placeholder="Pending / Closed / In-progress" />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Bottom Sticky Action Bar */}
//                     <div className="bg-white/90 backdrop-blur-md fixed md:sticky bottom-0 md:bottom-6 left-0 right-0 md:rounded-3xl border-t md:border border-white shadow-2xl p-4 flex flex-row gap-3 justify-between items-center z-30">
//                         <button type="button" onClick={() => navigate('/qa-hub/monthly')} className="flex items-center gap-2 px-6 py-2 text-slate-400 font-bold hover:text-red-500 transition-all text-xs uppercase tracking-widest">
//                             <i className="bi bi-x-circle text-lg"></i> <span className="hidden sm:inline">Discard</span>
//                         </button>

//                         <div className="flex gap-2 md:gap-4">
//                             <button type="button" onClick={resetForm} className="px-6 md:px-8 py-2.5 bg-slate-100 text-slate-600 rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">
//                                 Reset
//                             </button>
//                             <button type="submit" className="px-8 md:px-12 py-3 bg-[#8b5cf6] text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-purple-500/30 hover:bg-[#7c3aed] active:scale-95 transition-all flex items-center justify-center gap-3">
//                                 <i className="bi bi-journal-check text-base"></i> Save Minutes
//                             </button>
//                         </div>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default MinutesOfMeetings;
