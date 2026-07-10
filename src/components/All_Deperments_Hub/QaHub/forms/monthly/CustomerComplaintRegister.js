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
const CustomerComplaintRegister = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the ID from the URL if present
  const isViewMode = Boolean(id); // If ID is present, we are in view mode

  const getInitialState = () => ({
    date: "",
    partName: "",
    partNo: "",
    model: "",
    customer: "",
    problemDescription: "",
    counterMeasure: "",
    targetDate: "",
    horizontalAction: "",
    status: "OPEN",
  });

  const [complaints, setComplaints] = useState([getInitialState()]);
  const [partList, setPartList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

   // --- APPROVAL / VIEW MODE STATE ---
     const [error, setError] = useState(null);
          const [isLoading, setIsLoading] = useState(false);
      const [approvalRemark, setApprovalRemark] = useState("");
      const [approvalLoading, setApprovalLoading] = useState(false);
      const [approvalStatus, setApprovalStatus] = useState("");
      const [reviewedAt, setReviewedAt] = useState("");

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const res = await fetch(
          getApiUrl(`/api/master-dropdown/?filter=all_parts`),
        );
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
    const fetchWarrantyClaimReport = async () => {
      if (!id) return; // Skip if creating a new record

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/get-single-report/customer-complaint-view/${id}/`, {
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
        
        // 2. Extract the inner data object safely
        const data = result.data || {};

        // 3. Split the part_details string into Name and Number
        let extractedPartName = "";
        let extractedPartNo = "";
        
        if (data.part_details) {
            // This splits "CUSHION PAN - E4TS5EV-11203" into an array
            const parts = data.part_details.split(" - "); 
            extractedPartName = parts[0] ? parts[0].trim() : "";
            extractedPartNo = parts[1] ? parts[1].trim() : "";
        }

       // 4. Map API response to the initialFormState keys
       // 4. Update the complaints state directly (wrapped in an array)
        setComplaints([{
          date: data.date || '',
          partName: extractedPartName,
          partNo: extractedPartNo,
          model: data.model_name || '',
          customer: data.customer_name || '',
          problemDescription: data.problem_description || '',
          counterMeasure: data.counter_measure || '',
          targetDate: data.target_date || '',
          horizontalAction: data.horizontal_action || '',
          status: data.status || 'OPEN',
        }]);

      } catch (err) {
        console.error("Error fetching Warranty Claim Register data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWarrantyClaimReport();
  }, [id]);


  const handleChange = (index, field, value) => {
    const updatedComplaints = [...complaints];
    updatedComplaints[index][field] = value;
    setComplaints(updatedComplaints);
  };

  const handlePartNameChange = async (index, value) => {
    handleChange(index, "partName", value);
    if (!value) return;

    try {
      const [noRes, modRes] = await Promise.all([
        fetch(
          getApiUrl(
            `/api/master-dropdown/?filter=part_no&part=${encodeURIComponent(
              value,
            )}`,
          ),
        ),
        fetch(
          getApiUrl(
            `/api/master-dropdown/?filter=model_by_part&part=${encodeURIComponent(
              value,
            )}`,
          ),
        ),
      ]);
      const noData = await noRes.json();
      const modData = await modRes.json();

      const updatedComplaints = [...complaints];
      updatedComplaints[index].partNo = noData[0] || "";
      updatedComplaints[index].model = modData[0] || "";
      setComplaints(updatedComplaints);
    } catch (error) {
      console.error("Failed to auto-fill:", error);
    }
  };

  const handleAddComplaint = () =>
    setComplaints([...complaints, getInitialState()]);
  const handleRemoveComplaint = (index) =>
    setComplaints(complaints.filter((_, i) => i !== index));

  const resetForm = () => {
    if (window.confirm("Are you sure you want to clear the entire form?")) {
      setComplaints([getInitialState()]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedComplaints = complaints.map((complaint) => ({
      // Fix: Empty string ko null me convert kiya taaki Django DateField error na de
      date: complaint.date ? complaint.date : null,
      part_details: `${complaint.partName} - ${complaint.partNo}`,
      model_name: complaint.model,
      customer_name: complaint.customer,
      problem_description: complaint.problemDescription,
      counter_measure: complaint.counterMeasure,
      target_date: complaint.targetDate ? complaint.targetDate : null,
      horizontal_action: complaint.horizontalAction,
      status: complaint.status,
    }));

    try {
      for (let i = 0; i < formattedComplaints.length; i++) {
        const payload = formattedComplaints[i];

        const response = await fetch(getApiUrl(`/api/customer-complaint/`), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Agar token authorization chahiye to is line ko uncomment karein:
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {

         
        }
      }

      successAlert(`${complaints.length} Complaint(s) Recorded Successfully!`);
      setComplaints([getInitialState()]);
    } catch (error) {
      console.error("Submission Error:", error);
      // Backend validation error alert already dikha diya hai upar
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
    <div className="min-h-screen bg-[#fffafa] text-slate-700 font-sans pb-32 md:pb-24">
      <div className="bg-gradient-to-br from-[#991b1b] via-[#ef4444] to-[#f87171] pt-12 pb-28 px-4 md:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/qa-hub/monthly")}
              className="w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded text-white transition-all backdrop-blur-md border border-white/20 shadow-lg"
            >
              <i className="bi bi-chevron-left text-xl"></i>
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase leading-tight">
                Customer Complaint Register
              </h1>
              <p className="text-red-100 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase opacity-90">
                Defect Tracking & Counter Measures
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddComplaint}
            className="hidden md:flex items-center gap-2 px-6 py-3 bg-white text-[#ef4444] rounded font-black uppercase text-[11px] tracking-widest shadow-lg hover:bg-red-50 transition-all"
          >
            <i className="bi bi-plus-circle-fill text-sm"></i> Add New Part
          </button>
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

      <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-16 md:-mt-20">
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          {complaints.map((complaint, index) => (
            <div
              key={index}
              className="bg-white rounded shadow-2xl shadow-red-900/5 p-6 md:p-10 border border-slate-100 relative"
            >
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">
                  <span className="text-[#ef4444]">Part / Issue</span> #
                  {index + 1}
                </h3>
                {complaints.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveComplaint(index)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded transition-all"
                    title="Remove this part"
                  >
                    <i className="bi bi-trash3-fill text-lg"></i>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#ef4444] uppercase tracking-widest ml-1">
                    Complaint Date
                  </label>
                  <input
                    required
                    type="date"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded focus:border-[#ef4444] focus:bg-white outline-none transition-all font-semibold text-sm shadow-sm"
                    value={complaint.date}
                    onChange={(e) =>
                      handleChange(index, "date", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#ef4444] uppercase tracking-widest ml-1">
                    Part Name
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded focus:border-[#ef4444] focus:bg-white outline-none transition-all font-semibold text-sm shadow-sm appearance-none"
                    value={complaint.partName}
                    onChange={(e) =>
                      handlePartNameChange(index, e.target.value)
                    }
                  >
                    <option value="" disabled>
                      Select Part Name
                    </option>
                    {partList.map((part, idx) => (
                      <option key={idx} value={part}>
                        {part}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#ef4444] uppercase tracking-widest ml-1">
                    Part No.
                  </label>
                  <input
                    readOnly
                    className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-50 rounded focus:border-[#ef4444] focus:bg-white outline-none transition-all font-semibold text-sm shadow-sm cursor-not-allowed"
                    value={complaint.partNo}
                    placeholder="Auto Part No"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#ef4444] uppercase tracking-widest ml-1">
                    Model
                  </label>
                  <input
                    readOnly
                    className="w-full px-4 py-3 bg-slate-100 border-2 border-slate-50 rounded focus:border-[#ef4444] focus:bg-white outline-none transition-all font-semibold text-sm shadow-sm cursor-not-allowed"
                    value={complaint.model}
                    placeholder="Auto Model"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-[#ef4444] uppercase tracking-widest ml-1">
                    Customer Name
                  </label>
                  <input
                    required
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded focus:border-[#ef4444] focus:bg-white outline-none transition-all font-semibold text-sm shadow-sm"
                    value={complaint.customer}
                    onChange={(e) =>
                      handleChange(index, "customer", e.target.value)
                    }
                    placeholder="e.g. TOPRE"
                  />
                </div>
              </div>

              <div className="space-y-6 border-t border-slate-100 pt-8">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Problem Description
                  </label>
                  <textarea
                    rows="3"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded focus:border-[#ef4444] focus:bg-white outline-none transition-all font-medium text-sm resize-none shadow-sm"
                    value={complaint.problemDescription}
                    onChange={(e) =>
                      handleChange(index, "problemDescription", e.target.value)
                    }
                    placeholder="Describe the quality issue..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Counter Measure
                  </label>
                  <textarea
                    rows="3"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded focus:border-[#ef4444] focus:bg-white outline-none transition-all font-medium text-sm resize-none shadow-sm"
                    value={complaint.counterMeasure}
                    onChange={(e) =>
                      handleChange(index, "counterMeasure", e.target.value)
                    }
                    placeholder="Corrective actions taken..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Target Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded focus:border-[#ef4444] focus:bg-white outline-none transition-all font-semibold text-sm"
                    value={complaint.targetDate}
                    onChange={(e) =>
                      handleChange(index, "targetDate", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Horizontal Action
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded focus:border-[#ef4444] focus:bg-white outline-none transition-all text-sm font-semibold"
                    value={complaint.horizontalAction}
                    onChange={(e) =>
                      handleChange(index, "horizontalAction", e.target.value)
                    }
                    placeholder="Implementation elsewhere..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Complaint Status
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded focus:border-[#ef4444] focus:bg-white outline-none transition-all font-bold text-sm text-[#ef4444] appearance-none"
                    value={complaint.status}
                    onChange={(e) =>
                      handleChange(index, "status", e.target.value)
                    }
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="PENDING">PENDING</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={handleAddComplaint}
              className="flex items-center gap-2 px-8 py-4 bg-red-50 text-[#ef4444] border border-red-200 hover:bg-red-100 hover:border-red-300 rounded font-black uppercase text-[11px] tracking-widest transition-all shadow-sm"
            >
              <i className="bi bi-plus-circle text-base"></i> Add Another Part
            </button>
          </div>
         {!isViewMode && (
          <div className="bg-white/90 backdrop-blur-md fixed md:sticky bottom-0 md:bottom-6 left-0 right-0 md:rounded border-t md:border border-white shadow-2xl p-4 flex flex-row gap-3 justify-between items-center z-30">
            <button
              type="button"
              onClick={() => navigate("/qa-hub/monthly")}
              className="flex items-center gap-2 px-8 py-4 text-slate-400 font-bold hover:text-red-500 transition-all text-sm uppercase tracking-widest rounded"
            >
              <i className="bi bi-x-circle text-lg"></i>{" "}
              <span className="hidden sm:inline">Cancel</span>
            </button>

            <div className="flex gap-2 md:gap-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-8 md:px-10 py-4 bg-slate-100 text-slate-600 rounded font-black uppercase text-[11px] tracking-widest hover:bg-slate-200 transition-all"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-10 md:px-14 py-4 bg-[#ef4444] text-white rounded font-black uppercase text-[11px] tracking-widest shadow-xl shadow-red-500/30 hover:bg-[#dc2626] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <i className="bi bi-file-earmark-check text-base"></i>{" "}
                {isSubmitting
                  ? "Saving..."
                  : `Save ${complaints.length > 1 ? "All" : ""} Complaints`}
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
      <div className="h-10"></div>
    </div>
  );
};

export default CustomerComplaintRegister;
