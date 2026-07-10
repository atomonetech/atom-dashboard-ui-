import React, { useState,useEffect } from "react";
import { useNavigate, useLocation,useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { getApiUrl } from '../../../../config/api'; // <--- API Import added
import axios from "axios";
import {
  successAlert,
  errorAlert,
  warningAlert,
  infoAlert,
  confirmAlert,
} from "../../../../utils/alertUtils";
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const DipMoldingMaintenanceForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {id}=useParams(); // <--- Added to get the report ID from the URL
  const isViewMode=Boolean(id);

  // --- COLLAPSIBLE STATE FOR CHECKLIST ---
  const [isChecklistOpen, setIsChecklistOpen] = useState(true);

  // --- DROPDOWN OPTIONS FOR STATUS ---
  const statusOptions = ["", "Ok", "Not Ok", "Ng", "N/A"];

  // --- FIXED HYDRAULIC CHECKLIST DATA WITH PRE-DEFINED CHECKING METHODS ---
  const initialChecklist = [
  {
    id: 1,
    point: "Pushbutton",
    parameter: "Check all push buttons ",
    method: "Manually",
    before: "",
    after: "",
    remarks: ""
  },
  {
    id: 2,
    point: "Proximity Sensor",
    parameter: "Check Working condition",
    method: "Manually",
    before: "",
    after: "",
    remarks: ""
  },

  {
    id: 3,
    point: "Limit Switch",
    parameter: "Check all Limit Switchs for proper operation",
    method: "Manually",
    before: "",
    after: "",
    remarks: ""
  },
  {
    id: 4,
    point: "Servo Motor",
    parameter: "Check Working condition",
    method: "Visually",
    before: "",
    after: "",
    remarks: ""
  },
  {
    id: 5,
    point: "Counter Balance cylinder",
    parameter: "Air Leakages",
    method: "visually",
    before: "",
    after: "",
    remarks: ""
  },

  {
    id: 6,
    point: "Timer Display",
    parameter: "Timer Working Condition",
    method: "visually",
    before: "",
    after: "",
    remarks: ""
  },
  {
    id: 7,
    point: "Control Pannel Box",
    parameter: "Loose wiring",
    method: "visually",
    before: "",
    after: "",
    remarks: ""
  },

  {
    id: 8,
    point: "Roller Bearing",
    parameter: "Bearing Jamming condition",
    method: "Manually",
    before: "",
    after: "",
    remarks: ""
  },

  {
    id: 9,
    point: "Check the preventive maintenance date",
    parameter: "Updated in history card",
    method: "visually",
    before: "",
    after: "",
    remarks: ""
  },

  
];

  // --- INITIAL STATES (For Resetting) ---
  const initialMetaData = {
    machineName: location.state?.machineName || "Dip Molding Machine",
    date: new Date().toISOString().split("T")[0],
    machineNo: "SP-001",
    location: "",
    specification: "",
    maintenancePersonnel: "",
    preparedBy: "", // <--- Added for state binding
    checkedBy: "",  // <--- Added for state binding
  };

  // --- COMPONENT STATE ---
  const [metaData, setMetaData] = useState(initialMetaData);
  const [tableData, setTableData] = useState(initialChecklist);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // <--- Added for loading state

  
  
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
                  `${API_BASE_URL}/api/get-single-maintenance-report/dip-molding/${id}/`
                );
                
                if (res.data.success) {
                  const data = res.data.data || {};
                  const meta = data.metaData || {};
        
                  setMetaData({
                    machineName: meta.machineName || 'Dip Molding Machine', // Default value if not provided
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
                  errorAlert(res.data.error || "Failed to load Dip Molding Check Sheet.");
                }
              } catch (err) {
                console.error("Error loading Check Sheet:", err);
                errorAlert(err.response?.data?.error || "Failed to load Dip Molding Check Sheet.");
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

  // <--- UPDATED: API Integration & Payload Fix Added --->
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !metaData.machineName ||
      !metaData.machineNo ||
      !metaData.location ||
      !metaData.maintenancePersonnel ||
      !metaData.preparedBy
    ) {
      warningAlert("Please fill all required fields including Prepared By.");
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
       


    // FIXED PAYLOAD: Spread metaData to put date at the root level for backend
    const payload = {
      ...metaData,
      tableData: tableData,
      username: currentUser, // <--- Added username to payload
    };

    try {
      // Assuming your backend endpoint follows this pattern
      const response = await fetch(getApiUrl('/api/dip-molding-maintenance/save/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          setMetaData(initialMetaData);
          setTableData(initialChecklist);
          setShowSuccess(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 1500);
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
        
        .white-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #e9ecef;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }
        
        .btn-primary-custom { 
          background: #10b981;
          color: white; 
          border: none;
          transition: all 0.2s ease;
          font-weight: 600;
          padding: 10px 28px;
        }
        
        .btn-primary-custom:hover:not(:disabled) { 
          background: #059669;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
        }

        .btn-primary-custom:disabled {
          background: #94a3b8;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        .btn-outline-custom { 
          background: white;
          color: #10b981; 
          border: 2px solid #10b981;
          transition: all 0.2s ease;
          font-weight: 600;
          padding: 8px 20px;
        }
        
        .btn-outline-custom:hover { 
          background: #10b981;
          color: white;
          transform: translateY(-1px);
        }
        
        .form-control, .form-select {
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 8px 12px;
          transition: all 0.2s ease;
          font-size: 0.9rem;
          background-color: #ffffff;
        }
        
        .form-control:focus, .form-select:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
          outline: none;
        }
        
        .form-label {
          font-weight: 600;
          margin-bottom: 6px;
          color: #495057;
          font-size: 0.85rem;
        }

        .required-field::after { content: " *"; color: #10b981; }
        
        .collapse-header {
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid #dee2e6;
          border-radius: 12px;
          background: white;
          padding: 12px 20px !important;
        }
        
        .collapse-header:hover {
          border-color: #10b981;
          background: #ecfdf5;
        }
        
        .clean-table { border-radius: 12px; overflow: hidden; }
        
        .clean-table thead th {
          background: #f8f9fa;
          font-weight: 600;
          font-size: 0.85rem;
          color: #495057;
          border-bottom: 2px solid #10b981;
          padding: 12px;
        }
        
        .clean-table tbody td {
          padding: 12px;
          vertical-align: middle;
          border-bottom: 1px solid #f0f0f0;
          color: #1f2937;
          font-size: 0.85rem;
        }
        
        .clean-table tbody tr:hover { background: #ecfdf5; }
        
        .section-header {
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #f0f0f0;
        }
        
        .section-header h5 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #10b981;
          margin: 0;
        }
        
        .animate-fade-in { animation: fadeInUp 0.4s ease-out; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        .badge-count {
          background: #10b981;
          color: white;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.7rem;
          margin-left: 8px;
        }

        /* Status Colors */
        select option[value="Ok"] { color: #10b981; font-weight: bold; }
        select option[value="Not Ok"] { color: #ef4444; font-weight: bold; }
        select option[value="Ng"] { color: #f59e0b; font-weight: bold; }

        /* Method badge styling */
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

        /* MAGIC MOBILE VIEW CSS */
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
      <div
        className="mx-auto mb-3 no-print animate-fade-in px-2"
        style={{ maxWidth: "1200px" }}
      >
        <button
          className="btn btn-outline-custom rounded-pill"
          onClick={() => navigate("/Maintenance/Machine/weekly")}
          style={{ fontSize: "0.85rem" }}
        >
          ← Back to Weekly Reports
        </button>
      </div>

      <div
        className="white-card mx-auto animate-fade-in"
        style={{ maxWidth: "1200px" }}
      >
        {/* HEADER */}
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
            Dip Molding Preventive Maintenance
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
            {/* --- SECTION 1: META DATA INPUTS --- */}
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
                  placeholder="e.g., CNC Milling Machine"
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

            {/* --- SECTION 2: CHECKLIST TABLE --- */}
            <div className="section-header mt-4">
              <h5>Maintenance Checklist</h5>
            </div>

            <div
              className="collapse-header d-flex justify-content-between align-items-center mb-3 text-slate-700"
              onClick={() => setIsChecklistOpen(!isChecklistOpen)}
            >
              <div>
                <span className="fw-bold">Checklist Items</span>
                <span className="badge-count">{tableData.length}</span>
                <small className="text-muted ms-2 d-none d-md-inline-block">
                  {isChecklistOpen
                    ? "▼ Click to collapse"
                    : "▶ Click to expand"}
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
                        <th style={{ width: "4%" }} className="text-center">
                          #
                        </th>
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
                            <span className="mobile-label">
                              Checking Parameter
                            </span>
                            {row.parameter}
                          </td>
                          <td>
                            <span className="mobile-label">Method</span>
                            <div className="method-badge">{row.method}</div>
                          </td>

                          <td>
                            <span className="mobile-label required-field">
                              Before Maint.
                            </span>
                            <select
                              className="form-select border-1 bg-light shadow-sm w-100"
                              value={row.before}
                              onChange={(e) =>
                                handleBeforeChange(row.id, e.target.value)
                              }
                              required
                            >
                              {statusOptions.map((opt, i) => (
                                <option key={i} value={opt}>
                                  {opt || "Select..."}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td>
                            <span className="mobile-label required-field">
                              After Maint.
                            </span>
                            <select
                              className="form-select border-1 bg-light shadow-sm w-100"
                              value={row.after}
                              onChange={(e) =>
                                handleAfterChange(row.id, e.target.value)
                              }
                              required
                            >
                              {statusOptions.map((opt, i) => (
                                <option key={i} value={opt}>
                                  {opt || "Select..."}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td>
                            <span className="mobile-label">
                              Remarks / Spares
                            </span>
                            <input
                              type="text"
                              className="form-control border-1 bg-light shadow-sm w-100"
                              placeholder="Add remarks..."
                              value={row.remarks}
                              onChange={(e) =>
                                handleRemarksChange(row.id, e.target.value)
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Legend Section */}
            <div
              className="d-flex flex-wrap align-items-center justify-content-between p-3 rounded-3 mb-4"
              style={{
                backgroundColor: "#f8f9fa",
                border: "1px dashed #dee2e6",
              }}
            >
              {/* Prepared By - LINKED TO STATE */}
              <div className="fw-bold " style={{ color: "#495057" }}>
                Prepared By
                <input 
                  type="text" 
                  className="form-control mt-1" 
                  placeholder="Name" 
                  name="preparedBy"
                  value={metaData.preparedBy}
                  onChange={handleMetaChange}
                  required
                />
              </div>

              {/* Legends */}
              <div className="d-flex align-items-center gap-4">
                <span className="fw-bold" style={{ color: "#495057" }}>
                  Legends:
                </span>

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

              {/* Checked By - LINKED TO STATE */}
              <div className="fw-bold" style={{ color: "#495057" }}>
                Checked By
                 <input 
                   type="text" 
                   className="form-control mt-1" 
                   placeholder="Name" 
                   name="checkedBy"
                   value={metaData.checkedBy}
                   onChange={handleMetaChange}
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
                <i className="bi bi-floppy me-2"></i> {isSubmitting ? "Saving..." : "Save Record"}
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

      {/* Success Toast */}
      {showSuccess && (
        <div
          className="position-fixed bottom-0 end-0 m-3 m-md-4 bg-success text-white px-4 py-3 rounded-3 shadow-lg z-3"
          style={{ minWidth: "250px" }}
        >
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-check-circle-fill fs-5"></i>
            <span className="fw-medium">Maintenance record saved!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DipMoldingMaintenanceForm;
