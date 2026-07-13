import React, { useState,useEffect } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getApiUrl } from '../../../../config/api';
import {
  successAlert,
  errorAlert,
  warningAlert,
  infoAlert,
  confirmAlert,
} from "../../../../utils/alertUtils";
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const SurfaceGrinderMaintenanceForm = () => {
  const navigate = useNavigate();
   const { id } = useParams();
    const isViewMode=Boolean(id);
  const [isChecklistOpen, setIsChecklistOpen] = useState(true);
  const statusOptions = ["", "Ok", "Not Ok", "N/A"];

  // --- SURFACE GRINDER CHECKLIST DATA ---
  const initialChecklist = [
    {
      id: 1,
      point: "Main Motor",
      parameter: "Main motor is working ok ?",
      method: "Visual",
      before: "",
      after: "",
      remarks: "",
    },
    {
      id: 2,
      point: "Starter & Wiring",
      parameter: "Starter is ok?",
      method: "Visual",
      before: "",
      after: "",
      remarks: "",
    },
    {
      id: 3,
      point: "Slide Oil",
      parameter: "Slide oil level is ok ?",
      method: "Visual",
      before: "",
      after: "",
      remarks: "",
    },
    {
      id: 4,
      point: "Oil Pipes",
      parameter: "Oil pipes are ok ?",
      method: "Visual",
      before: "",
      after: "",
      remarks: "",
    },
    {
      id: 5,
      point: "Lead Screws",
      parameter: "Damages/Loose/Wornout ?",
      method: "Visual/Allen Key",
      before: "",
      after: "",
      remarks: "",
    },
    {
      id: 6,
      point: "Motor & Spindle Coupling",
      parameter: "Damages/Loose/Wornout ?",
      method: "Visual",
      before: "",
      after: "",
      remarks: "",
    },
    {
      id: 7,
      point: "Magnetic Base Block",
      parameter: "Block is magnetised and clean",
      method: "Visual",
      before: "",
      after: "",
      remarks: "",
    },
    {
      id: 8,
      point: "Wheel Alignment",
      parameter: "Alignment ok ?",
      method: "Visual",
      before: "",
      after: "",
      remarks: "",
    },
    {
      id: 9,
      point: "Check the preventive maintenance date",
      parameter: "Updated",
      method: "Visual",
      before: "",
      after: "",
      remarks: "",
    },
  ];

  const initialMetaData = {
    machineName: "", // Editable
    date: new Date().toISOString().split("T")[0],
    machineNo: "",
    location: "",
    specification: "",
    maintenancePersonnel: "",
    preparedBy: "",
    checkedBy: "",
    docNo: "AOT-F-MM-03",
    revisionNo: "00",
  };

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
                `${API_BASE_URL}/api/get-single-maintenance-report/surface-grinder/${id}/`
              );
              
              if (res.data.success) {
                const data = res.data.data || {};
                const meta = data.metaData || {};
      
                setMetaData({
                  machineName: meta.machineName || 'Surface Grinder Machine', // Default value if not provided
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
                        parameter: row.checking_parameter || '',
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
                errorAlert(res.data.error || "Failed to load Surface Grinder Check Sheet.");
              }
            } catch (err) {
              console.error("Error loading Check Sheet:", err);
              errorAlert(err.response?.data?.error || "Failed to load Surface Grinder Check Sheet.");
            }
          };
      
          fetchReport();
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [id]);

  const handleMetaChange = (e) => setMetaData({ ...metaData, [e.target.name]: e.target.value });
  const handleTableChange = (id, field, value) => {
    setTableData(
      tableData.map((row) =>
        row.id === id ? { ...row, [field]: value } : row,
      ),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!metaData.machineNo || !metaData.location || !metaData.preparedBy) {
      warningAlert("Please fill required fields.");
      return;
    }

    setIsSubmitting(true);
    const currentUser = localStorage.getItem("username") || "Unknown User";
    const preparedByValue = (metaData.preparedBy || currentUser).trim();
    const payload = {
      machine_name: metaData.machineName,
      date: metaData.date,
      machine_no: metaData.machineNo,
      location: metaData.location,
      specification: metaData.specification,
      maintenance_personnel: metaData.maintenancePersonnel,
      prepared_by: preparedByValue,
      checked_by: metaData.checkedBy,
      username: currentUser,
      department_name: `${metaData.location} (Maintenance)`,
      checkpoints: tableData.map((row, index) => ({
        sr_no: index + 1,
        check_point: row.point,
        checking_parameter: row.parameter,
        checking_method: row.method,
        before_maintenance: row.before,
        after_maintenance: row.after,
        remarks: row.remarks || "",
        spare_used_remarks: row.remarks || "",
      })),
    };

    try {
      const response = await fetch(
        getApiUrl("/api/surface-grinder-maintenance/save/"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        successAlert("✨ Grinder record saved successfully!");
        setMetaData(initialMetaData);
        setTableData(initialChecklist);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const errorData = await response.json();
        alert(
          "Failed to save data. Error: " +
            (errorData.error
              ? JSON.stringify(errorData.error)
              : "Unknown Error"),
        );
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while saving the data.");
    } finally {
      setIsSubmitting(false);
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
      className="container-fluid py-4"
      style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        * { font-family: 'Inter', sans-serif; }
        .white-card { background: white; border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04); }
        
        /* Surface Grinder Theme Color: Magenta/Pink */
        .header-accent { background: #d946ef; color: white; padding: 20px; border-radius: 20px 20px 0 0; }
        .btn-save { background: #d946ef; border: none; padding: 12px 40px; border-radius: 50px; font-weight: 600; transition: 0.3s; }
        .btn-save:hover:not(:disabled) { background: #c026d3; box-shadow: 0 5px 15px rgba(217, 70, 239, 0.4); }
        .btn-save:disabled { background: #9ca3af; cursor: not-allowed; }
        .method-badge { background: #fdf4ff; color: #d946ef; padding: 4px 12px; border-radius: 6px; font-weight: 600; font-size: 0.8rem; }
        
        /* --- STYLED BACK BUTTON --- */
        .btn-outline-custom { 
          background: white;
          color: #d946ef; 
          border: 2px solid #d946ef;
          transition: all 0.2s ease;
          font-weight: 600;
          padding: 8px 20px;
        }
        
        .btn-outline-custom:hover { 
          background: #d946ef;
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(217, 70, 239, 0.2);
        }

        .animate-fade-in { animation: fadeInUp 0.4s ease-out; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .form-label { font-weight: 700; font-size: 0.75rem; color: #64748b; text-transform: uppercase; }
        .ss-table thead th { background-color: #f1f5f9; color: #1e293b; font-weight: 700; text-transform: uppercase; font-size: 0.75rem; border: 1px solid #e2e8f0; padding: 12px; }
        .ss-table td { border: 1px solid #e2e8f0; padding: 10px; font-size: 0.9rem; }
      `}</style>

      {/* --- TOP BACK BUTTON --- */}
      <div
        className="mx-auto mb-3 no-print animate-fade-in px-2"
        style={{ maxWidth: "1100px" }}
      >
        <button
          className="btn btn-outline-custom rounded-pill"
          onClick={() => navigate(-1)}
          style={{ fontSize: "0.85rem" }}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="white-card mx-auto" style={{ maxWidth: "1100px" }}>
        <div className="header-accent d-flex justify-content-between align-items-center">
          <div>
            <h4 className="fw-bold mb-0">
              MACHINE PREVENTIVE MAINTENANCE CHECK SHEET
            </h4>
            <small className="opacity-75">
              SURFACE GRINDER | {metaData.docNo}
            </small>
          </div>
          <div className="text-end d-none d-md-block">
            <div className="badge bg-white text-dark">
              Rev: {metaData.revisionNo}
            </div>
          </div>
        </div>

         {isViewMode && (
          <div className="px-3 mx-auto px-md-4 pt-3"  style={{ maxWidth: '1200px',  }} >
            <span className="badge px-3 py-2 d-inline-block text-primary" style={{ backgroundColor: '#eff6ff', border: '1px solid #93c5fd', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Review Mode
            </span>
          </div>
        )}

        {isViewMode && approvalStatus && (
          <div className="px-3 mx-auto  px-md-4 pt-3"  style={{ maxWidth: '1200px',  }} >
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

        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="form-label">Machine Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="machineName"
                  value={metaData.machineName}
                  onChange={handleMetaChange}
                  placeholder="Enter Machine Name"
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={metaData.date}
                  onChange={handleMetaChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Machine No.</label>
                <input
                  type="text"
                  className="form-control"
                  name="machineNo"
                  value={metaData.machineNo}
                  onChange={handleMetaChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  value={metaData.location}
                  onChange={handleMetaChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Maintenance Personnel</label>
                <input
                  type="text"
                  className="form-control"
                  name="maintenancePersonnel"
                  value={metaData.maintenancePersonnel}
                  onChange={handleMetaChange}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Specification</label>
                <input
                  type="text"
                  className="form-control"
                  name="specification"
                  value={metaData.specification}
                  onChange={handleMetaChange}
                />
              </div>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <h6 className="fw-bold text-uppercase text-muted">
                Maintenance Checkpoints
              </h6>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary"
                onClick={() => setIsChecklistOpen(!isChecklistOpen)}
              >
                {isChecklistOpen ? "Collapse" : "Expand"}
              </button>
            </div>

            {isChecklistOpen && (
              <div className="table-responsive">
                <table className="ss-table w-100">
                  <thead>
                    <tr>
                      <th style={{ width: "50px" }}>Sr.</th>
                      <th>Check Points</th>
                      <th>Checking Parameter</th>
                      <th>Method</th>
                      <th style={{ width: "130px" }}>Before</th>
                      <th style={{ width: "130px" }}>After</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row) => (
                      <tr key={row.id}>
                        <td className="text-center fw-bold text-dark">
                          {row.id}
                        </td>
                        <td className="fw-medium text-dark">{row.point}</td>
                        <td className="text-muted">{row.parameter}</td>
                        <td className="text-center">
                          <span className="method-badge">{row.method}</span>
                        </td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={row.before}
                            onChange={(e) =>
                              handleTableChange(
                                row.id,
                                "before",
                                e.target.value,
                              )
                            }
                            required
                          >
                            {statusOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt || "Select"}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={row.after}
                            onChange={(e) =>
                              handleTableChange(row.id, "after", e.target.value)
                            }
                            required
                          >
                            {statusOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt || "Select"}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            value={row.remarks}
                            onChange={(e) =>
                              handleTableChange(
                                row.id,
                                "remarks",
                                e.target.value,
                              )
                            }
                            placeholder="..."
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="row mt-4 pt-3 border-top g-3">
              <div className="col-md-6">
                <label className="form-label">Prepared By</label>
                <input
                  type="text"
                  className="form-control"
                  name="preparedBy"
                  value={metaData.preparedBy}
                  onChange={handleMetaChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Checked By</label>
                <input
                  type="text"
                  className="form-control"
                  name="checkedBy"
                  value={metaData.checkedBy}
                  onChange={handleMetaChange}
                />
              </div>
            </div>
          {!isViewMode &&(
            <div className="text-end mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-save text-white shadow-sm"
              >
                {isSubmitting ? "Submitting..." : "Save Grinder Record"}
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

export default SurfaceGrinderMaintenanceForm;
