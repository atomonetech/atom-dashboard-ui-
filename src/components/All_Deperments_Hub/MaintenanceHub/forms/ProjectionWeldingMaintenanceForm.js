import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import {
  successAlert,
  errorAlert,
  warningAlert,
  infoAlert,
  confirmAlert,
} from "../../../../utils/alertUtils";
import { getApiUrl } from '../../../../config/api';

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";


const ProjectionWeldingMaintenanceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isViewMode = Boolean(id);

  // --- COLLAPSIBLE STATE FOR CHECKLIST ---
  const [isChecklistOpen, setIsChecklistOpen] = useState(true);

  // --- DROPDOWN OPTIONS FOR STATUS ---
  const statusOptions = ['', 'Ok', 'Not Ok', 'N/A'];

  // --- FIXED PROJECTION WELDING CHECKLIST DATA ---
  const initialChecklist = [
    { id: 1, point: "Air filter", parameter: "Clean air filter", method: "visual", before: '', after: '', remarks: '' },
    { id: 2, point: "Digital pannel", parameter: "Digital pannel is working", method: "visual", before: '', after: '', remarks: '' },
    { id: 3, point: "Air pressure", parameter: "Check air pressure", method: "visual", before: '', after: '', remarks: '' },
    { id: 4, point: "Electrode alignment", parameter: "Check alignment of electrode", method: "visual", before: '', after: '', remarks: '' },
    { id: 5, point: "Abnormal sound", parameter: "Any abnormal sound heard ?", method: "Hearing", before: '', after: '', remarks: '' },
    { id: 6, point: "Starter & wiring", parameter: "Starter & wiring is in good condition", method: "visual", before: '', after: '', remarks: '' },
    { id: 7, point: "Push button", parameter: "Should be proper working", method: "manual", before: '', after: '', remarks: '' },
    { id: 8, point: "Check the preventive maintenance data", parameter: "Updated in history card", method: "visual", before: '', after: '', remarks: '' }
  ];

  // --- INITIAL STATES ---
  const initialMetaData = {
    machineName: 'PROJECTION WELDING', 
    date: new Date().toISOString().split('T')[0],
    machineNo: '',
    location: '',
    specification: '',
    maintenancePersonnel: '',
    preparedBy: '',
    checkedBy: ''
  };

  // --- COMPONENT STATE ---
  const [metaData, setMetaData] = useState(initialMetaData);
  const [tableData, setTableData] = useState(initialChecklist); 
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
          `${BASE_URL}/api/get-single-maintenance-report/projection-welding/${id}/`
        );
        
        if (res.data.success) {
          const data = res.data.data || {};
          const meta = data.metaData || {};

          setMetaData({
            machineName: meta.machineName || 'PROJECTION WELDING',
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
          errorAlert(res.data.error || "Failed to load Projection weld Check Sheet.");
        }
      } catch (err) {
        console.error("Error loading Check Sheet:", err);
        errorAlert(err.response?.data?.error || "Failed to load Projection Check Sheet.");
      }
    };

    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // --- HANDLERS ---
  const handleMetaChange = (e) => setMetaData({ ...metaData, [e.target.name]: e.target.value });
  
  const handleBeforeChange = (id, value) => {
    setTableData(tableData.map(row => row.id === id ? { ...row, before: value } : row));
  };

  const handleAfterChange = (id, value) => {
    setTableData(tableData.map(row => row.id === id ? { ...row, after: value } : row));
  };

  const handleRemarksChange = (id, value) => {
    setTableData(tableData.map(row => row.id === id ? { ...row, remarks: value } : row));
  };
  
  const formatBackendError = (result) => {
    if (!result) return 'Unable to save record.';
    if (typeof result === 'string') return result;
    if (result.message) return result.message;
    if (result.error) return result.error;
    if (result.errors) {
      if (typeof result.errors === 'string') return result.errors;
      return Object.entries(result.errors)
        .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
        .join('\n');
    }
    return JSON.stringify(result);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!metaData.machineNo || !metaData.location || !metaData.maintenancePersonnel || !metaData.preparedBy) {
      infoAlert("Please fill all required fields in General Information and Signatures.");
      return;
    }

    const incompleteRow = tableData.findIndex(row => !row.before || !row.after);
    if (incompleteRow !== -1) {
      warningAlert(`Please complete Before/After status for row ${incompleteRow + 1}`);
      return;
    }
const currentUser = localStorage.getItem("username") || "Unknown User";
    const payload = {
      machine_name: metaData.machineName,
      machine_no: metaData.machineNo,
      date: metaData.date,
      location: metaData.location,
      specification: metaData.specification,
      maintenance_personnel: metaData.maintenancePersonnel,
      prepared_by: metaData.preparedBy,
      checked_by: metaData.checkedBy,
      checkpoints: tableData.map((row, index) => ({
        sr_no: index + 1,
        check_point: row.point,
        checking_parameter: row.parameter,
        checking_method: row.method,
        before_maintenance: row.before,
        after_maintenance: row.after,
        spare_used_remarks: row.remarks || "",
        username: currentUser,
      })),
    };

    try {
      setIsSaving(true);

      const response = await fetch(getApiUrl('/api/projection-welding-pm/save/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        console.error("Projection welding save failed:", result);
        throw new Error(formatBackendError(result) || `Request failed with status ${response.status}`);
      }

      setShowSuccess(true);

      setTimeout(() => {
        setMetaData(initialMetaData);
        setTableData(initialChecklist);
        setShowSuccess(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1500);
    } catch (error) {
      console.error("Failed to save projection welding maintenance record:", error);
      errorAlert(`Failed to save projection welding maintenance record: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all fields?')) {
      setMetaData(initialMetaData);
      setTableData(initialChecklist);
    }
  };

  // --- APPROVE / REJECT HANDLERS (VIEW MODE) ---
  const handleApprove = async () => {
    try {
      setApprovalLoading(true);
      const currentUser = localStorage.getItem("username") || "Approver";
      const res = await axios.post(`${BASE_URL}/api/approve-report/`, {
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
      const res = await axios.post(`${BASE_URL}/api/reject-report/`, {
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
    <div className="container-fluid py-3 py-md-4" style={{ backgroundColor: '#f4f5f7', minHeight: '100vh' }}>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        
        @media print {
          .no-print { display: none !important; }
          body { background-color: #fff !important; }
          .white-card { box-shadow: none !important; border: none !important; }
        }
        
        .white-card {
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }
        
        .btn-primary-custom { 
          background: #8b5cf6;
          color: white; 
          border: none;
          transition: all 0.2s ease;
          font-weight: 600;
          padding: 10px 28px;
        }
        
        .btn-primary-custom:hover { 
          background: #7c3aed;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        /* --- STYLED BACK BUTTON --- */
        .btn-outline-custom { 
          background: white;
          color: #8b5cf6; 
          border: 2px solid #8b5cf6;
          transition: all 0.2s ease;
          font-weight: 600;
          padding: 8px 20px;
        }
        
        .btn-outline-custom:hover { 
          background: #8b5cf6;
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
        }
        
        .form-control, .form-select {
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          padding: 8px 12px;
          transition: all 0.2s ease;
          font-size: 0.9rem;
          background-color: #f8fafc;
        }
        
        .form-control:focus, .form-select:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
          outline: none;
          background-color: #ffffff;
        }
        
        .form-label {
          font-weight: 600;
          margin-bottom: 6px;
          color: #334155;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .required-field::after { content: " *"; color: #ef4444; }
        
        /* Strict Bordered Table */
        .ss-table-container {
          border: 2px solid #1e293b;
          border-radius: 4px;
          overflow: hidden;
        }

        .ss-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 0;
        }
        
        .ss-table th, .ss-table td {
          border: 1px solid #cbd5e1;
          padding: 10px;
          vertical-align: middle;
          font-size: 0.85rem;
        }

        /* Enforce dark text color for all table body cells */
        .ss-table tbody td {
          color: #1e293b !important;
        }

        /* Fixed table header visibility */
        .ss-table thead th {
          background-color: #8b5cf6;
          font-weight: 700;
          color: #ffffff !important;
          text-align: center;
          border-bottom: 2px solid #1e293b;
        }
        
        .section-header {
          margin-bottom: 20px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .section-header h5 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .animate-fade-in { animation: fadeInUp 0.4s ease-out; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        /* Status Colors */
        select option[value="Ok"] { color: #10b981; font-weight: bold; }
        select option[value="Not Ok"] { color: #ef4444; font-weight: bold; }
        select option[value="N/A"] { color: #64748b; font-weight: bold; }

        .method-badge {
          background-color: #e0e7ff;
          color: #3730a3;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
          display: inline-block;
          text-align: center;
        }

        /* MAGIC MOBILE VIEW CSS */
        .mobile-label { display: none; }
        @media (max-width: 767px) {
          .ss-table-container { border: none !important; margin: 0 !important; padding: 0 !important; overflow: visible !important; }
          .ss-table thead { display: none; }
          .ss-table, .ss-table tbody, .ss-table tr, .ss-table td { display: block; width: 100%; }
          .ss-table tr { margin-bottom: 15px; border: 1px solid #cbd5e1; border-radius: 12px; padding: 15px; background: white; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
          .ss-table td { border: none !important; border-bottom: 1px dashed #e2e8f0 !important; padding: 10px 0 !important; text-align: left !important; }
          .ss-table td:last-child { border-bottom: none !important; }
          .mobile-label { display: block; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 5px; }
          .method-badge { width: auto; min-width: 100px; display: inline-block; }
        }
      `}</style>

      {/* --- TOP BACK BUTTON UPDATED --- */}
      <div className="mx-auto mb-3 no-print animate-fade-in px-2" style={{ maxWidth: '1200px' }}>
        <button 
          className="btn btn-outline-custom rounded-pill"
          onClick={goBack}
          style={{ fontSize: '0.85rem' }}
        >
          ← Back to Weekly Hub
        </button>
      </div>

      <div className="white-card mx-auto" style={{ maxWidth: '1200px' }}>
        
        {/* HEADER BLOCK */}
        <div className="p-3 p-md-4 d-flex flex-column flex-md-row justify-content-between" style={{ borderBottom: '2px solid #1e293b', background: '#ffffff', borderRadius: '16px 16px 0 0' }}>
          <div>
            <h2 className="fw-bold mb-1 fs-5 fs-md-3" style={{ color: '#0f172a', letterSpacing: '1px' }}>
              MACHINE PREVENTIVE MAINTENANCE CHECK SHEET
            </h2>
            <span className="badge bg-primary px-3 py-2 mt-2 d-inline-block" style={{ backgroundColor: '#8b5cf6 !important' }}>Form: AOT-F-PM-01 | Weekly</span>
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

        <div className="card-body p-3 p-md-4">
          <form onSubmit={handleSubmit}>
            
            {/* --- SECTION 1: META DATA INPUTS --- */}
            <div className="row g-0 mb-4 border" style={{ borderColor: '#1e293b !important', borderRadius: '6px', overflow: 'hidden' }}>
              <div className="col-12 col-md-6 border-bottom p-2 p-md-3 border-md-end">
                <label className="form-label required-field">MACHINE NAME:</label>
                <input type="text" className="form-control fw-bold border-1" name="machineName" value={metaData.machineName} readOnly />
              </div>
              <div className="col-12 col-md-6 border-bottom p-2 p-md-3">
                <label className="form-label required-field">DATE:</label>
                <input type="date" className="form-control border-1" name="date" value={metaData.date} onChange={handleMetaChange} required />
              </div>
              
              <div className="col-12 col-md-6 border-bottom p-2 p-md-3 border-md-end">
                <label className="form-label required-field">MACHINE NO.:</label>
                <input type="text" className="form-control border-1" name="machineNo" value={metaData.machineNo} onChange={handleMetaChange} required placeholder="Enter Machine No." />
              </div>
              <div className="col-12 col-md-6 border-bottom p-2 p-md-3">
                <label className="form-label required-field">LOCATION:</label>
                <input type="text" className="form-control border-1" name="location" value={metaData.location} onChange={handleMetaChange} required placeholder="Enter Location" />
              </div>
              
              <div className="col-12 col-md-6 border-bottom border-md-bottom-0 p-2 p-md-3 border-md-end">
                <label className="form-label">SPECIFICATION:</label>
                <input type="text" className="form-control border-1" name="specification" value={metaData.specification} onChange={handleMetaChange} placeholder="Enter Specifications (Optional)" />
              </div>
              <div className="col-12 col-md-6 p-2 p-md-3">
                <label className="form-label required-field">MAINTENANCE PERSONNEL:</label>
                <input type="text" className="form-control border-1" name="maintenancePersonnel" value={metaData.maintenancePersonnel} onChange={handleMetaChange} required placeholder="Enter Technician Name" />
              </div>
            </div>

            {/* --- SECTION 2: CHECKLIST TABLE --- */}
            <div className="d-flex justify-content-between align-items-center mb-2 mt-4">
              <h5 className="fw-bold mb-0" style={{ color: '#1e293b' }}>Check Points</h5>
              <button 
                type="button" 
                className="btn btn-sm btn-outline-secondary" 
                onClick={() => setIsChecklistOpen(!isChecklistOpen)}
              >
                {isChecklistOpen ? 'Hide Table' : 'Show Table'}
              </button>
            </div>

            {isChecklistOpen && (
              <div className="ss-table-container mb-4">
                <table className="ss-table w-100">
                  <thead>
                    <tr>
                      <th style={{ width: '5%' }}>Sr. No.</th>
                      <th style={{ width: '20%' }}>Check Points</th>
                      <th style={{ width: '25%' }}>Checking Parameter</th>
                      <th style={{ width: '10%' }}>Checking Method</th>
                      <th style={{ width: '12%' }}>Before Maint.</th>
                      <th style={{ width: '12%' }}>After Maint.</th>
                      <th style={{ width: '16%' }}>Spare Used / Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, index) => (
                      <tr key={row.id}>
                        <td className="text-md-center fw-bold text-dark">
                          <span className="mobile-label">Sr. No.</span>
                          {index + 1}
                        </td>
                        <td className="fw-medium text-dark">
                          <span className="mobile-label">Check Point</span>
                          {row.point}
                        </td>
                        <td className="text-dark">
                          <span className="mobile-label">Parameter</span>
                          {row.parameter}
                        </td>
                        
                        <td className="text-md-center">
                          <span className="mobile-label">Method</span>
                          <span className="method-badge">{row.method}</span>
                        </td>
                        
                        <td>
                          <span className="mobile-label required-field">Before Maint.</span>
                          <select 
                            className="form-select border-1 bg-transparent text-dark w-100" 
                            value={row.before} 
                            onChange={(e) => handleBeforeChange(row.id, e.target.value)} 
                            required
                          >
                            {statusOptions.map((opt, i) => (
                              <option key={i} value={opt}>{opt || 'Select...'}</option>
                            ))}
                          </select>
                        </td>

                        <td>
                          <span className="mobile-label required-field">After Maint.</span>
                          <select 
                            className="form-select border-1 bg-transparent text-dark w-100" 
                            value={row.after} 
                            onChange={(e) => handleAfterChange(row.id, e.target.value)} 
                            required
                          >
                            {statusOptions.map((opt, i) => (
                              <option key={i} value={opt}>{opt || 'Select...'}</option>
                            ))}
                          </select>
                        </td>

                        <td>
                          <span className="mobile-label">Remarks</span>
                          <input 
                            type="text" 
                            className="form-control border-1 bg-transparent text-dark w-100" 
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
            )}

            {/* --- SECTION 3: FOOTER (Signatures ONLY) --- */}
            <div className="row g-0 border" style={{ borderColor: '#1e293b !important', borderRadius: '6px', overflow: 'hidden' }}>
              
              <div className="col-12 col-md-6 border-bottom border-md-bottom-0 p-3 border-md-end">
                <label className="form-label required-field">PREPARED BY:</label>
                <input 
                  type="text" 
                  className="form-control border-1" 
                  name="preparedBy" 
                  value={metaData.preparedBy} 
                  onChange={handleMetaChange} 
                  required 
                  placeholder="Signature / Name" 
                />
              </div>
              
              <div className="col-12 col-md-6 p-3">
                <label className="form-label">CHECKED BY:</label>
                <input 
                  type="text" 
                  className="form-control border-1" 
                  name="checkedBy" 
                  value={metaData.checkedBy} 
                  onChange={handleMetaChange} 
                  placeholder="Signature / Name" 
                />
              </div>
              
            </div>

            {/* --- ACTION BUTTONS --- */}
                  {!isViewMode && (
            <div className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-4 pt-3 no-print">
              <button 
                type="button" 
                className="btn btn-light rounded-pill px-4 shadow-sm w-100 w-sm-auto" 
                onClick={handleReset}
                style={{ fontWeight: '600', border: '1px solid #cbd5e1' }}
              >
                Reset Data
              </button>
              <button type="submit" className="btn btn-primary-custom rounded-pill px-5 shadow-sm w-100 w-sm-auto" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Record'}
              </button>
            </div>
                  )}
          </form>

          {/* APPROVAL / REJECTION SECTION (VIEW MODE ONLY) */}
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
        <div className="position-fixed bottom-0 end-0 m-3 m-md-4 bg-success text-white px-4 py-3 rounded-3 shadow-lg z-3" style={{ minWidth: '250px' }}>
          <div className="d-flex align-items-center gap-2">
            <span className="fw-medium">✔ Maintenance record saved successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectionWeldingMaintenanceForm;
