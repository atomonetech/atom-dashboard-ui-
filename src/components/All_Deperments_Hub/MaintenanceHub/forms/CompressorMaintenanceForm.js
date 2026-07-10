import React, { useState,useEffect } from "react";
import { useNavigate, useLocation,useParams} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
// Dhyan dein: Apna API config path apne folder structure ke hisaab se adjust kar lena
import { getApiUrl } from "../../../../config/api";
import {
  successAlert,
  errorAlert,
  warningAlert,
  infoAlert,
  confirmAlert,
} from "../../../../utils/alertUtils";
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const CompressorMaintenanceForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // Get the ID from the URL if present
  const isViewMode=Boolean(id); // If ID is present, we are in view mode

  // --- COLLAPSIBLE STATE FOR CHECKLIST ---
  const [isChecklistOpen, setIsChecklistOpen] = useState(true);

  // --- DROPDOWN OPTIONS FOR STATUS ---
  const statusOptions = ["", "Ok", "Not Ok", "Ng", "N/A"];

  // --- FIXED HYDRAULIC CHECKLIST DATA WITH PRE-DEFINED CHECKING METHODS ---
  const initialChecklist = [
    { id: 1, point: "Clean the machine by cloth", parameter: "Dust free", method: "Visual", before: '', after: '', remarks: '' },
    { id: 2, point: "Check the oil level", parameter: "Should be proper", method: "By spanner", before: '', after: '', remarks: '' },
    { id: 3, point: "Check the air filter", parameter: "Should be proper condition", method: "By spanner", before: '', after: '', remarks: '' },
    { id: 4, point: "Check the air receiver", parameter: "Should be cleaned", method: "Visual", before: '', after: '', remarks: '' },
    { id: 5, point: "Check any abnormal sound", parameter: "No abnormal sound", method: "Visual", before: '', after: '', remarks: '' },
    { id: 6, point: "Check nut & bolt", parameter: "Should be tight", method: "By Spanner/ allen key", before: '', after: '', remarks: '' },
    { id: 7, point: "Check loose wiring", parameter: "Should be tight", method: "By plier/ spanner", before: '', after: '', remarks: '' }
  ];

  // --- INITIAL STATES (For Resetting) ---
  const initialMetaData = {
    machineName: location.state?.machineName || "", // Editable Machine Name
    date: new Date().toISOString().split("T")[0],
    machineNo: "",
    location: "",
    specification: "",
    maintenancePersonnel: "",
    preparedBy: "", // Added to save signatures
    checkedBy: ""   // Added to save signatures
  };

  // --- COMPONENT STATE ---
  const [metaData, setMetaData] = useState(initialMetaData);
  const [tableData, setTableData] = useState(initialChecklist);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
        // --- APPROVAL / VIEW MODE STATE ---
        const [approvalRemark, setApprovalRemark] = useState("");
        const [approvalLoading, setApprovalLoading] = useState(false);
        const [approvalStatus, setApprovalStatus] = useState("");
        const [reviewedAt, setReviewedAt] = useState("");
      
        // --- FETCH REPORT WHEN OPENED IN VIEW MODE (from notification) ---
        useEffect(() => {
          if (!id) return;
      
          const fetchReport = async () => {
            try {
              const res = await axios.get(
                `${API_BASE_URL}/api/get-single-maintenance-report/compressor/${id}/`
              );
              
              if (res.data.success) {
                const data = res.data.data || {};
                const meta = data.metaData || {};
      
                setMetaData({
                  machineName: meta.machineName || 'Compressor Machine', // Default value if not provided
                  date: meta.date || '',
                  machineNo: meta.machineNo || '',
                  location: meta.location || '',
                  specification: meta.specification || '',
                  maintenancePersonnel: meta.maintenancePersonnel || '',
                  preparedBy: meta.preparedBy || '',
                  checkedBy: meta.checkedBy || '',
                });
      
                const rows = Array.isArray(data.tableData) ? data.tableData : [];
                setTableData(
                  rows.length
                    ? rows.map((row, index) => ({
                        id: row.sr_no || index + 1,
                        point: row.point || '',
                        parameter: row.parameter || '',
                        method: row.method || '',
                        before: row.before || '',
                        after: row.after || '',
                        remarks: row.remarks || '',
                      }))
                    : initialChecklist
                );
      
                setApprovalRemark(data.approval_remarks || "");
                setApprovalStatus(data.approval_status || "");
                setReviewedAt(data.approved_or_rejected_at || "");
              } else {
                errorAlert(res.data.error || "Failed to load Compressor Check Sheet.");
              }
            } catch (err) {
              console.error("Error loading Check Sheet:", err);
              errorAlert(err.response?.data?.error || "Failed to load Compressor Check Sheet.");
            }
          };
      
          fetchReport();
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [id]);
  

  // --- HANDLERS ---
  const handleMetaChange = (e) =>
    setMetaData({ ...metaData, [e.target.name]: e.target.value });

  const handleBeforeChange = (id, value) => {
    setTableData(
      tableData.map((row) => (row.id === id ? { ...row, before: value } : row)),
    );
  };

  const handleAfterChange = (id, value) => {
    setTableData(
      tableData.map((row) => (row.id === id ? { ...row, after: value } : row)),
    );
  };

  const handleRemarksChange = (id, value) => {
    setTableData(
      tableData.map((row) =>
        row.id === id ? { ...row, remarks: value } : row,
      ),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !metaData.machineName ||
      !metaData.machineNo ||
      !metaData.location ||
      !metaData.maintenancePersonnel
    ) {
      warningAlert("Please fill all required fields in General Information.");
      return;
    }

    for (let i = 0; i < tableData.length; i++) {
      if (!tableData[i].before || !tableData[i].after) {
        warningAlert(`Please complete Before/After status for row ${i + 1}`);
        return;
      }
    }

    setIsSubmitting(true);
    const currentUser = localStorage.getItem("username") || "Unknown User";

    const payload = {
      machineName: metaData.machineName,
      date: metaData.date,
      machineNo: metaData.machineNo,
      location: metaData.location,
      specification: metaData.specification,
      maintenancePersonnel: metaData.maintenancePersonnel,
      preparedBy: metaData.preparedBy,
      checkedBy: metaData.checkedBy,
      tableData: tableData,
      username: currentUser
    };

    try {
      const response = await fetch(getApiUrl('/api/compressor-maintenance/save/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
         
        successAlert("Success! Compressor Maintenance record has been saved.");
        setMetaData(initialMetaData);
        setTableData(initialChecklist);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const errorData = await response.json();
        errorAlert("Failed to save data. Error: " + (errorData.error ? JSON.stringify(errorData.error) : 'Unknown Error'));
      }
    } catch (error) {
      console.error("Error saving data:", error);
      errorAlert("An error occurred while saving the data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all fields?")) {
      setMetaData(initialMetaData);
      setTableData(initialChecklist);
    }
  };

    // --- APPROVE / REJECT HANDLERS (VIEW MODE) ---
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
      navigate('/Maintenance/Machine/weekly');
    };

  return (
    <div
      className="container-fluid py-3 py-md-4"
      style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        
        @media print {
          .no-print { display: none !important; }
          body { background-color: #fff !important; }
        }
        
        .btn-primary-custom { 
          background: #0d9488; 
          color: white; 
          border: none;
          transition: all 0.2s ease;
          font-weight: 600;
          padding: 10px 28px;
        }
        
        .btn-primary-custom:hover:not(:disabled) { 
          background: #0f766e; 
          transform: translateY(-2px); 
          box-shadow: 0 8px 15px rgba(13, 148, 136, 0.3); 
        }

        .btn-primary-custom:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .btn-outline-custom { 
          background: white;
          color: #0d9488; 
          border: 2px solid #0d9488;
          transition: all 0.2s ease;
          font-weight: 600;
          padding: 8px 20px;
        }
        
        .btn-outline-custom:hover { 
          background: #0d9488;
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(13, 148, 136, 0.2);
        }

        .animate-fade-in { animation: fadeInUp 0.4s ease-out; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .form-label { 
          font-weight: 600; 
          color: #475569; 
          font-size: 0.8rem; 
          text-transform: uppercase; 
          letter-spacing: 0.5px; 
        }
        
        select option[value="Ok"] { color: #10b981; font-weight: bold; }
        select option[value="Not Ok"] { color: #ef4444; font-weight: bold; }
        select option[value="Ng"] { color: #f59e0b; font-weight: bold; }

        .method-badge {
          background-color: #eef2ff;
          color: #1e40af;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
          display: inline-block;
          text-align: center;
          width: 100%;
        }

        .mobile-label { display: none; }
        @media (max-width: 767px) {
          .table-responsive { border: none !important; background: transparent !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; }
          .clean-table thead { display: none; }
          .clean-table, .clean-table tbody, .clean-table tr, .clean-table td { display: block; width: 100%; }
          .clean-table tr { margin-bottom: 15px; border: 1px solid #cbd5e1; border-radius: 12px; padding: 15px; background: white; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
          .clean-table td { border: none !important; border-bottom: 1px dashed #e2e8f0 !important; padding: 10px 0 !important; text-align: left !important; }
          .clean-table td:last-child { border-bottom: none !important; }
          .mobile-label { display: block; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 5px; }
          .method-badge { width: auto; min-width: 100px; display: inline-block; }
        }
      `}</style>

      {/* --- TOP BACK BUTTON --- */}
      <div className="mx-auto mb-3 no-print animate-fade-in px-2" style={{ maxWidth: '1200px' }}>
        <button 
          className="btn btn-outline-custom rounded-pill"
          onClick={() => navigate('/Maintenance/Machine/weekly')}
          style={{ fontSize: '0.85rem' }}
        >
          ← Back to Weekly Hub
        </button>
      </div>

      {/* Header Panel */}
      <div className="teal-card mx-auto mb-4 p-3 p-md-4 d-flex justify-content-between align-items-center" style={{ maxWidth: '1200px', borderTop: '6px solid #14b8a6', background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(13, 148, 136, 0.08)' }}>
        <div>
          <h3 className="fw-bold mb-1 fs-5 fs-md-3" style={{ color: '#115e59' }}>COMPRESSOR MAINTENANCE</h3>
          <span className="badge rounded-pill" style={{ backgroundColor: '#ccfbf1', color: '#0f766e', padding: '8px 15px' }}>Form: AOT-F-PM-01 | Weekly</span>
        </div>
      </div>

      <div
        className="white-card mx-auto animate-fade-in"
        style={{ maxWidth: "1200px", background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(13, 148, 136, 0.08)' }}
      >
        <div
          className="p-3 p-md-4"
          style={{
            borderBottom: "1px solid #e9ecef",
            background: "white",
            borderRadius: "20px 20px 0 0",
          }}
        >
          <h3
            className="fw-bold mb-1 fs-5 fs-md-3"
            style={{ color: "#10b981" }}
          >
            Compressor Preventive Maintenance
          </h3>
          <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
            Complete maintenance checklist and tracking system
          </p>
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

        <div className="card-body p-3 p-md-4">
          <form onSubmit={handleSubmit}>
            <div className="section-header">
              <h5>General Information</h5>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-12 col-md-4">
                <label className="form-label required-field">
                  Machine Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="machineName"
                  value={metaData.machineName}
                  onChange={handleMetaChange}
                  required
                  placeholder="Enter Machine Name"
                />
              </div>
              <div className="col-12 col-md-2">
                <label className="form-label required-field">Machine No.</label>
                <input
                  type="text"
                  className="form-control"
                  name="machineNo"
                  value={metaData.machineNo}
                  onChange={handleMetaChange}
                  required
                  placeholder="Number"
                />
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label required-field">Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={metaData.date}
                  onChange={handleMetaChange}
                  required
                />
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label required-field">Location</label>
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  value={metaData.location}
                  onChange={handleMetaChange}
                  required
                  placeholder="Facility location"
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Specification</label>
                <input
                  type="text"
                  className="form-control"
                  name="specification"
                  value={metaData.specification}
                  onChange={handleMetaChange}
                  placeholder="Machine specs (optional)"
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label required-field">
                  Maintenance Personnel
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="maintenancePersonnel"
                  value={metaData.maintenancePersonnel}
                  onChange={handleMetaChange}
                  required
                  placeholder="Technician name"
                />
              </div>
            </div>

            <div className="section-header mt-4">
              <h5>Maintenance Checklist</h5>
            </div>

            <div
              className="collapse-header d-flex justify-content-between align-items-center mb-3 text-slate-700"
              onClick={() => setIsChecklistOpen(!isChecklistOpen)}
              style={{ cursor: 'pointer' }}
            >
              <div>
                <span className="fw-bold">Checklist Items </span>
                <span className="badge-count bg-secondary text-white px-2 py-1 rounded-circle">{tableData.length}</span>
                <small className="text-muted ms-2 d-none d-md-inline-block">
                  {isChecklistOpen ? "▼ Click to collapse" : "▶ Click to expand"}
                </small>
              </div>
              <span style={{ color: "#10b981", fontWeight: "bold" }}>
                {isChecklistOpen ? "−" : "+"}
              </span>
            </div>

            {isChecklistOpen && (
              <div className="mb-4">
                <div className="table-responsive">
                  <table className="table clean-table align-middle mb-0">
                    <thead>
                      <tr>
                        <th style={{ width: "4%" }} className="text-center">#</th>
                        <th style={{ width: "35%" }}>Check Point</th>
                        <th style={{ width: "20%" }}>Checking Parameter</th>
                        <th style={{ width: "15%" }}>Checking Method</th>
                        <th style={{ width: "12%" }}>Before Maint.*</th>
                        <th style={{ width: "12%" }}>After Maint.*</th>
                        <th style={{ width: "22%" }}>Remarks / Spares</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row, index) => (
                        <tr key={row.id}>
                          <td className="text-md-center fw-bold text-muted">
                            <span className="mobile-label">Sr. No.</span>
                            {index + 1}
                          </td>
                          <td className="fw-medium">
                            <span className="mobile-label">Check Point</span>
                            {row.point}
                          </td>
                          <td>
                            <span className="mobile-label">Checking Parameter</span>
                            {row.parameter}
                          </td>
                          <td>
                            <span className="mobile-label">Method</span>
                            <div className="method-badge">{row.method}</div>
                          </td>
                          <td>
                            <span className="mobile-label required-field">Before Maint.</span>
                            <select
                              className="form-select border-1 bg-light shadow-sm w-100"
                              value={row.before}
                              onChange={(e) => handleBeforeChange(row.id, e.target.value)}
                              required
                            >
                              {statusOptions.map((opt, i) => (
                                <option key={i} value={opt}>{opt || "Select..."}</option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <span className="mobile-label required-field">After Maint.</span>
                            <select
                              className="form-select border-1 bg-light shadow-sm w-100"
                              value={row.after}
                              onChange={(e) => handleAfterChange(row.id, e.target.value)}
                              required
                            >
                              {statusOptions.map((opt, i) => (
                                <option key={i} value={opt}>{opt || "Select..."}</option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <span className="mobile-label">Remarks / Spares</span>
                            <input
                              type="text"
                              className="form-control border-1 bg-light shadow-sm w-100"
                              placeholder="Add remarks..."
                              value={row.remarks}
                              onChange={(e) => handleRemarksChange(row.id, e.target.value)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div
              className="d-flex flex-wrap align-items-center justify-content-between p-3 rounded-3 mb-4"
              style={{ backgroundColor: "#f8f9fa", border: "1px dashed #dee2e6" }}
            >
              <div className="fw-bold" style={{ color: "#495057" }}>
                Prepared By
                <input 
                  type="text" 
                  className="form-control mt-1" 
                  name="preparedBy"
                  value={metaData.preparedBy}
                  onChange={handleMetaChange}
                  placeholder="Name" 
                  required
                />
              </div>

              <div className="d-flex align-items-center gap-4">
                <span className="fw-bold" style={{ color: "#495057" }}>Legends:</span>
                <div className="d-flex align-items-center gap-2">
                  <input type="checkbox" checked readOnly />
                  <span style={{ color: "#495057" }}>Good</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <input type="checkbox" checked readOnly />
                  <span style={{ color: "#495057" }}>Not Good</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <input type="checkbox" checked readOnly />
                  <span style={{ color: "#495057" }}>Not Applicable</span>
                </div>
              </div>

              <div className="fw-bold" style={{ color: "#495057" }}>
                Checked By
                 <input 
                  type="text" 
                  className="form-control mt-1" 
                  name="checkedBy"
                  value={metaData.checkedBy}
                  onChange={handleMetaChange}
                  placeholder="Name" 
                />
              </div>
            </div>

            {/* --- ACTION BUTTONS --- */}
            {!isViewMode && (
            <div className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-4 pt-3 no-print border-top">
              <button
                type="button"
                className="btn btn-light rounded-pill px-4 shadow-sm w-100 w-sm-auto"
                onClick={handleReset}
                style={{ fontWeight: "600", border: "1px solid #dee2e6" }}
              >
                Reset Data
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary-custom rounded-pill px-5 shadow-sm w-100 w-sm-auto"
              >
                <i className="bi bi-floppy me-2"></i> {isSubmitting ? 'Submitting...' : 'Save Record'}
              </button>
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
    </div>
  );
};

export default CompressorMaintenanceForm;
