import React, { useState,useEffect } from 'react';
import { useNavigate, useLocation ,useParams} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getApiUrl } from '../../../../config/api'; // <--- API Import added
import {
  successAlert,
  errorAlert,
  warningAlert,
  infoAlert,
  confirmAlert,
} from "../../../../utils/alertUtils";
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const PowerPressPreventiveMaintenanceForm = () => {
  const navigate = useNavigate();
   const { id } = useParams();
    const isViewMode=Boolean(id);
  const location = useLocation();

  // --- COLLAPSIBLE STATE FOR CHECKLIST ---
  const [isChecklistOpen, setIsChecklistOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // Added submitting state

  // --- FIXED CHECKLIST DATA ---
  const initialChecklist = [
    {
      id: 1,
      point: "Clean the machine by cloth",
      method: "Visual",
      parameter: "Dust free",
      before: "",
      after: "",
      remarks: "",
    },
    {
      id: 2,
      point: "Check the v-belt condition/looseness",
      method: "By hand",
      parameter: "Should be correct or replace",
      before: "",
      after: "",
      remarks: "",
    },
    {
      id: 3,
      point: "Check the diecushion bolt & working function, if applicable",
      method: "By Spanner/allen key",
      parameter: "Should be tight & proper up down",
      before: "",
      after: "",
      remarks: "",
    },
    {
      id: 4,
      point: "Check the motor foundation bolt & terminals",
      method: "By Spanner/plier",
      parameter: "Should be tight",
      before: "",
      after: "",
      remarks: "",
    },
    {
      id: 5,
      point: "Check the slide guide plate bolt",
      method: "By hand/plier/screw driver",
      parameter: "Proper dressing",
      before: "",
      after: "",
      remarks: "",
    },
    {
      id: 6,
      point: "Check the loose wiring",
      method: "Visual",
      parameter: "Should be proper working",
      before: "",
      after: "",
      remarks: "",
    },
    {
      id: 7,
      point: "Checking of all push button, emergency switch",
      method: "By hand operation",
      parameter: "Should be proper working",
      before: "",
      after: "",
      remarks: "",
    },
    {
      id: 8,
      point: "Check the Oiling & greasing of required moving parts",
      method: "By oil cane/grease gun",
      parameter: "Should be oil/grease",
      before: "",
      after: "",
      remarks: "",
    },
    {
      id: 9,
      point: "Check the Parallelism between lower and upper bed every 6 months",
      method: "By dial gauge",
      parameter: "LxR=0.50(MAX), FxB=0.94(MAX)",
      before: "",
      after: "",
      remarks: "",
    },
    {
      id: 10,
      point: "Check the crank upper & bottom plate bolt",
      method: "By spanner",
      parameter: "Should be tight",
      before: "",
      after: "",
      remarks: "",
    },
    {
      id: 11,
      point: "Check the looseness any bolts",
      method: "By spanner",
      parameter: "Should be tight",
      before: "",
      after: "",
      remarks: "",
    },
    {
      id: 12,
      point: "Check the Brake Liner condition",
      method: "Visual",
      parameter: "Should be in Good Condition",
      before: "",
      after: "",
      remarks: "",
    },
    {
      id: 13,
      point: "Check the T-slot condition",
      method: "Visual",
      parameter: "Should be clean",
      before: "",
      after: "",
      remarks: "",
    },
    {
      id: 14,
      point: "Check the Rolling & L-Key,s",
      method: "Visual",
      parameter: "Should be in Good working Condition",
      before: "",
      after: "",
      remarks: "",
    },
    {
      id: 15,
      point: "Check the preventive maintenance date",
      method: "Visual",
      parameter: "Updated in History Card",
      before: "",
      after: "",
      remarks: "",
    },
  ];

  const statusOptions = ["", "Ok", "Not Ok", "Ng"];

  // --- INITIAL META STATE ---
  const initialMetaData = {
    machineName: location.state?.machineName || "POWER PRESS",
    date: new Date().toISOString().split("T")[0],
    machineNo: "",
    location: "",
    specification: "",
  };

  // --- COMPONENT STATE ---
  const [metaData, setMetaData] = useState(initialMetaData);
  const [tableData, setTableData] = useState(initialChecklist);
  const [showSuccess, setShowSuccess] = useState(false);
  const [preparedBy, setPreparedBy] = useState("");


  
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
            `${API_BASE_URL}/api/get-single-maintenance-report/power-press-pm/${id}/`
          );
          
          if (res.data.success) {
            const data = res.data.data || {};
            const meta = data.metaData || {};
  
            setMetaData({
              machineName: meta.machineName || 'POWER PRESS',
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
                    point: row.check_point || '',
                    parameter: row.checking_Method || '',
                    method: row.checking_method || '',
                    before: row.before_maintenance || '',
                    after: row.after_maintenance || '',
                    remarks: row.remarks || '',
                  }))
                : initialChecklist
            );
  
            setApprovalRemark(data.approval_remarks || "");
            setApprovalStatus(data.approval_status || "");
            setReviewedAt(data.approved_or_rejected_at || "");
          } else {
            errorAlert(res.data.error || "Failed to load Power Press Check Sheet.");
          }
        } catch (err) {
          console.error("Error loading Check Sheet:", err);
          errorAlert(err.response?.data?.error || "Failed to load Power Press Check Sheet.");
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

  const getErrorMessage = async (response) => {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const errorData = await response.json();
      return (
        errorData.error ||
        errorData.message ||
        errorData.detail ||
        JSON.stringify(errorData)
      );
    }

    const errorText = await response.text();
    return errorText || `Request failed with status ${response.status}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!metaData.machineName || !metaData.machineNo || !metaData.location) {
      warningAlert("Please fill all required fields in General Information.");
      return;
    }

    for (let i = 0; i < tableData.length; i++) {
      if (!tableData[i].before || !tableData[i].after) {
        infoAlert(`Please complete the Before/After status for row ${i + 1}`);
        return;
      }
    }

    setIsSubmitting(true);

    const checklistPayload = tableData.map((row, index) => ({
      sr_no: index + 1,
      check_point: row.point,
      checking_method: row.method,
      checking_parameter: row.parameter,
      before_maintenance: row.before,
      after_maintenance: row.after,
      remarks: row.remarks || "",
      spare_used_remarks: row.remarks || "",
    }));
    const currentUser = localStorage.getItem("username") || "Unknown User";
    const payload = {
      machine_name: metaData.machineName,
      date: metaData.date,
      machine_no: metaData.machineNo,
      location: metaData.location,
      specification: metaData.specification,
      prepared_by: preparedBy,
      username: currentUser,
      department_name: `${metaData.location} (Maintenance)`,
      checkpoints: checklistPayload,
    };

    try {
      const response = await fetch(getApiUrl("/api/power-press-pm/save/"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const currentUser = localStorage.getItem("username") || "Unknown User";

        setShowSuccess(true);

        setTimeout(() => {
          setMetaData(initialMetaData);
          setTableData(initialChecklist);
          setShowSuccess(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 1500);
      } else {
        const errorMessage = await getErrorMessage(response);
        errorAlert("Failed to save data. Error: " + errorMessage);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      errorAlert("An error occurred while saving the data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear all data?")) {
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
        infoAlert("Please enter remark before rejecting.");
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
      style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        
        @media print {
          .no-print { display: none !important; }
          body { background-color: #fff !important; }
        }
        
        .white-card {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .btn-primary-custom { 
          background: #d97706;
          color: white; 
          border: none;
          transition: all 0.2s ease;
          font-weight: 600;
          padding: 10px 28px;
        }
        
        .btn-primary-custom:hover:not(:disabled) { 
          background: #b45309;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(217, 119, 6, 0.2);
        }

        .btn-primary-custom:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }
        
        .btn-outline-custom { 
          background: white;
          color: #d97706; 
          border: 2px solid #d97706;
          transition: all 0.2s ease;
          font-weight: 600;
          padding: 8px 20px;
        }
        
        .btn-outline-custom:hover { 
          background: #d97706;
          color: white;
          transform: translateY(-1px);
        }
        
        .form-control, .form-select {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 8px 12px;
          transition: all 0.2s ease;
          font-size: 0.85rem;
          background-color: #ffffff;
        }
        
        .form-control:focus, .form-select:focus {
          border-color: #d97706;
          box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
          outline: none;
        }
        
        .form-label {
          font-weight: 600;
          margin-bottom: 6px;
          color: #374151;
          font-size: 0.8rem;
        }
        
        .required-field::after { content: " *"; color: #ef4444; }
        
        .collapse-header {
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: #ffffff;
          padding: 12px 20px !important;
        }
        
        .collapse-header:hover {
          border-color: #d97706;
          background: #fffbeb;
        }
        
        .clean-table { border-radius: 12px; overflow: hidden; }
        
        .clean-table thead th {
          background: #f9fafb;
          font-weight: 600;
          font-size: 0.8rem;
          color: #374151;
          border-bottom: 2px solid #d97706;
          padding: 12px;
        }
        
        .clean-table tbody td {
          padding: 12px;
          vertical-align: middle;
          border-bottom: 1px solid #f3f4f6;
          font-size: 0.85rem;
          color: #1f2937;
        }
        
        .clean-table tbody tr:hover { background: #fffbeb; }
        
        .section-header {
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 2px solid #f3f4f6;
        }
        
        .section-header h5 {
          font-size: 1rem;
          font-weight: 700;
          color: #d97706;
          margin: 0;
        }
        
        .animate-fade-in { animation: fadeInUp 0.4s ease-out; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        .badge-count {
          background: #d97706;
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

        /* MAGIC MOBILE VIEW CSS */
        .mobile-label { display: none; }
        @media (max-width: 767px) {
          .table-responsive { border: none !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; }
          .clean-table thead { display: none; }
          .clean-table, .clean-table tbody, .clean-table tr, .clean-table td { display: block; width: 100%; }
          .clean-table tr { margin-bottom: 15px; border: 1px solid #cbd5e1; border-radius: 12px; padding: 15px; background: white; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
          .clean-table td { border: none !important; border-bottom: 1px dashed #e2e8f0 !important; padding: 10px 0 !important; text-align: left !important; }
          .clean-table td:last-child { border-bottom: none !important; }
          .mobile-label { display: block; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 5px; }
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
          ← Back to Weekly Hub
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
            borderBottom: "1px solid #f3f4f6",
            background: "#ffffff",
            borderRadius: "20px 20px 0 0",
          }}
        >
          <h3
            className="fw-bold mb-1 fs-5 fs-md-3"
            style={{ color: "#d97706" }}
          >
            Power Press Preventive Maintenance
          </h3>
          <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
            AOT-F-MM-03 | Complete maintenance checklist and tracking system
          </p>
        </div>

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
                />
              </div>
              <div className="col-12 col-md-2">
                <label className="form-label required-field">Date</label>
                <input
                  type="date"
                  name="date"
                  className="form-control"
                  value={metaData.date}
                  onChange={handleMetaChange}
                  required
                />
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label required-field">Machine No.</label>
                <input
                  type="text"
                  name="machineNo"
                  className="form-control"
                  value={metaData.machineNo}
                  onChange={handleMetaChange}
                  placeholder="Enter No."
                  required
                />
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label required-field">Location</label>
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  value={metaData.location}
                  onChange={handleMetaChange}
                  placeholder="Enter Location"
                  required
                />
              </div>
              <div className="col-12 col-md-12">
                <label className="form-label">Specification</label>
                <input
                  type="text"
                  name="specification"
                  className="form-control"
                  value={metaData.specification}
                  onChange={handleMetaChange}
                  placeholder="Enter specs"
                />
              </div>
            </div>

            {/* --- SECTION 2: CHECKLIST TABLE --- */}
            <div className="section-header mt-4">
              <h5>Maintenance Checklist</h5>
            </div>

            <div
              className="collapse-header d-flex justify-content-between align-items-center mb-3"
              onClick={() => setIsChecklistOpen(!isChecklistOpen)}
            >
              <div>
                <span className="fw-bold" style={{ color: "#374151" }}>
                  Checklist Items
                </span>
                <span className="badge-count">{tableData.length}</span>
                <small
                  className="text-muted ms-2 d-none d-md-inline-block"
                  style={{ color: "#6b7280" }}
                >
                  {isChecklistOpen
                    ? "▼ Click to collapse"
                    : "▶ Click to expand"}
                </small>
              </div>
              <span style={{ color: "#d97706", fontWeight: "bold" }}>
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
                        <th style={{ width: "26%" }}>Check Point</th>
                        <th style={{ width: "15%" }}>Checking Method</th>
                        <th style={{ width: "20%" }}>Checking Parameter</th>
                        <th style={{ width: "10%" }}>Before Maint.*</th>
                        <th style={{ width: "10%" }}>After Maint.*</th>
                        <th style={{ width: "15%" }}>Remarks</th>
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
                          <td className="text-muted">
                            <span className="mobile-label">Method</span>
                            {row.method}
                          </td>
                          <td className="text-muted">
                            <span className="mobile-label">Parameter</span>
                            {row.parameter}
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
                            <span className="mobile-label">Remarks</span>
                            <input
                              type="text"
                              className="form-control border-1 bg-light shadow-sm w-100"
                              placeholder="Remarks..."
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
              className="d-flex flex-wrap align-items-center gap-3 gap-md-4 p-3 rounded-3 mb-4"
              style={{
                backgroundColor: "#f9fafb",
                border: "1px dashed #d1d5db",
              }}
            >
              <span
                className="text-sm fw-bold w-100 w-md-auto"
                style={{ color: "#374151" }}
              >
                Legends:
              </span>
              <div className="d-flex align-items-center gap-2">
                <span
                  className="w-4 h-4 rounded-circle"
                  style={{
                    width: "14px",
                    height: "14px",
                    backgroundColor: "#10b981",
                    borderRadius: "50%",
                  }}
                ></span>
                <span
                  className="text-sm fw-medium"
                  style={{ color: "#374151" }}
                >
                  Ok
                </span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span
                  className="w-4 h-4 rounded-circle"
                  style={{
                    width: "14px",
                    height: "14px",
                    backgroundColor: "#ef4444",
                    borderRadius: "50%",
                  }}
                ></span>
                <span
                  className="text-sm fw-medium"
                  style={{ color: "#374151" }}
                >
                  Not Ok
                </span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span
                  className="w-4 h-4 rounded-circle"
                  style={{
                    width: "14px",
                    height: "14px",
                    backgroundColor: "#f59e0b",
                    borderRadius: "50%",
                  }}
                ></span>
                <span
                  className="text-sm fw-medium"
                  style={{ color: "#374151" }}
                >
                  Ng (No Good)
                </span>
              </div>
            </div>

            {/* --- ACTION BUTTONS --- */}
            <div
              className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-4 pt-3 no-print border-top"
              style={{ borderTopColor: "#f3f4f6" }}
            >
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                  Prepared By
                </label>
                <input
                  type="text"
                  value={preparedBy}
                  onChange={(e) => setPreparedBy(e.target.value)}
                  placeholder="Enter name"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full sm:w-64"
                />
              </div>
              <button
                type="button"
                className="btn btn-light rounded-pill px-4 shadow-sm w-100 w-sm-auto"
                onClick={handleReset}
                disabled={isSubmitting}
                style={{
                  fontWeight: "600",
                  border: "1px solid #e5e7eb",
                  color: "#374151",
                }}
              >
                Reset Data
              </button>
              <button
                type="submit"
                className="btn btn-primary-custom rounded-pill px-5 shadow-sm w-100 w-sm-auto"
                disabled={isSubmitting}
              >
                <i className="bi bi-floppy me-2"></i>{" "}
                {isSubmitting ? "Saving..." : "Save Record"}
              </button>
            </div>
          </form>
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
            <span className="fw-medium">Record submitted successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PowerPressPreventiveMaintenanceForm;
