import { getApiUrl } from '../../../../config/api';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';


const API_LOG = `${
  process.env.REACT_APP_API_URL || "http://localhost:8000"
}/api/log-report/`;

const VMMMaintenanceForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- COLLAPSIBLE STATE FOR CHECKLIST ---
  const [isChecklistOpen, setIsChecklistOpen] = useState(true);

  // --- DROPDOWN OPTIONS FOR STATUS ---
  const statusOptions = ['', 'Ok', 'Not Ok', 'N/A'];

  // --- FIXED VERTICAL MILLING MACHINE (VMM) CHECKLIST DATA ---
  const initialChecklist = [
    { id: 1, point: "Main Motor", parameter: "Main motor is working ?", method: "Visual", before: '', after: '', remarks: '' },
    { id: 2, point: "Head", parameter: "Should be working condition", method: "Visual", before: '', after: '', remarks: '' },
    { id: 3, point: "Check the Oiling & greasing of required moving parts", parameter: "Should be oil/ grease", method: "By oil cane/ grease gun", before: '', after: '', remarks: '' },
    { id: 4, point: "work table", parameter: "Should be working condition", method: "Visual", before: '', after: '', remarks: '' },
    { id: 5, point: "Check the electric loose wires & connections", parameter: "Sould not be loose and proper connected", method: "Visual", before: '', after: '', remarks: '' },
    { id: 6, point: "push button / emergency switch", parameter: "Should be proper working", method: "manual", before: '', after: '', remarks: '' },
    { id: 7, point: "Clean the machine by cloth", parameter: "Dust free", method: "Visual", before: '', after: '', remarks: '' },
    { id: 8, point: "Spindle", parameter: "Should be working condition", method: "Visual", before: '', after: '', remarks: '' },
    { id: 9, point: "Check the preventive maintenance data", parameter: "Updated in history card", method: "visual", before: '', after: '', remarks: '' }
  ];

  // --- INITIAL STATES ---
  const initialMetaData = {
    machineName: 'VERTICAL MILLING MACHINE', 
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
    alert("Please fill all required fields in General Information and Signatures.");
    return;
  }

  for (let i = 0; i < tableData.length; i++) {
    if (!tableData[i].before || !tableData[i].after) {
      alert(`Please complete Before/After status for row ${i + 1}`);
      return;
    }
  }

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
      method: row.method,
      before_maintenance: row.before,
      after_maintenance: row.after,
      remarks: row.remarks || "",
    })),
  };

  try {
  setIsSaving(true);

  const response = await fetch(getApiUrl('/api/vertical-milling-checksheet/save/'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
     const currentUser = localStorage.getItem("username") || "Unknown User";

        try {
          await axios.post(API_LOG, {
            username: currentUser,
            report_name: "VMM Mentinance Form", // Yahan hardcode kar diya form ka naam
          });
          console.log("Activity log successfully saved!");
        } catch (logError) {
          console.error("Activity log save karne mein error aayi:", logError);
        }
    console.error('Save failed:', data);
    alert(data.error || 'Failed to save record');
    return;
  }

  alert('Record saved successfully');
} catch (error) {
  console.error('API error:', error);
  alert('Server connection failed');
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
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }

        @media (min-width: 768px) {
           .white-card { border-radius: 16px; }
        }
        
        .btn-primary-custom { 
          background: #3b82f6;
          color: white; 
          border: none;
          transition: all 0.2s ease;
          font-weight: 600;
          padding: 10px 28px;
        }
        
        .btn-primary-custom:hover { 
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        /* --- STYLED BACK BUTTON --- */
        .btn-outline-custom { 
          background: white;
          color: #3b82f6; 
          border: 2px solid #3b82f6;
          transition: all 0.2s ease;
          font-weight: 600;
          padding: 8px 20px;
        }
        
        .btn-outline-custom:hover { 
          background: #3b82f6;
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }

        .animate-fade-in { animation: fadeInUp 0.4s ease-out; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        .form-control, .form-select {
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          padding: 8px 12px;
          transition: all 0.2s ease;
          font-size: 0.9rem;
          background-color: #f8fafc;
        }
        
        .form-control:focus, .form-select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
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
        
        /* DESKTOP TABLE STYLES */
        .ss-table-container {
          border: 2px solid #1e293b;
          border-radius: 6px;
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
        .ss-table thead th {
          background-color: #3b82f6;
          font-weight: 700;
          color: #ffffff !important;
          text-align: center;
          border-bottom: 2px solid #1e293b;
        }
        .method-badge {
          background-color: #eff6ff;
          color: #1d4ed8;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
          display: inline-block;
          text-align: center;
          min-width: 80px;
        }

        /* --- MAGIC LIES HERE: MOBILE CARD VIEW FOR TABLE --- */
        .mobile-label { display: none; }
        
        @media (max-width: 767px) {
          .ss-table-container {
            border: none;
            background: transparent;
          }
          .ss-table thead {
            display: none; /* Hide headers on mobile */
          }
          .ss-table, .ss-table tbody, .ss-table tr, .ss-table td {
            display: block;
            width: 100%;
          }
          .ss-table tr {
            margin-bottom: 1.25rem;
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            padding: 12px;
            background: #ffffff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          }
          .ss-table td {
            border: none;
            border-bottom: 1px solid #f1f5f9;
            padding: 8px 0;
            text-align: left !important;
          }
          .ss-table td:last-child {
            border-bottom: none;
          }
          /* Show mobile labels */
          .mobile-label {
            display: block;
            font-size: 0.7rem;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            margin-bottom: 4px;
            letter-spacing: 0.5px;
          }
          .method-badge { min-width: auto; }
        }

        select option[value="Ok"] { color: #10b981; font-weight: bold; }
        select option[value="Not Ok"] { color: #ef4444; font-weight: bold; }
        select option[value="N/A"] { color: #64748b; font-weight: bold; }

        .form-main-title { font-size: 1.25rem; line-height: 1.4; }
        @media (min-width: 768px) { .form-main-title { font-size: 1.75rem; } }
      `}</style>

      {/* --- TOP BACK BUTTON UPDATED --- */}
      <div className="mx-auto mb-3 no-print animate-fade-in px-2" style={{ maxWidth: '1200px' }}>
        <button 
          className="btn btn-outline-custom rounded-pill"
          onClick={() => navigate('/Maintenance/Machine/weekly')}
          style={{ fontSize: '0.85rem' }}
        >
          ← Back to Weekly Hub
        </button>
      </div>

      <div className="white-card mx-auto" style={{ maxWidth: '1200px' }}>
        <div className="p-3 p-md-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2" style={{ borderBottom: '2px solid #1e293b', background: '#ffffff', borderRadius: '12px 12px 0 0' }}>
          <div>
            <h2 className="fw-bold mb-1 form-main-title" style={{ color: '#0f172a', letterSpacing: '0.5px' }}>
              VERTICAL MILLING MACHINE CHECK SHEET
            </h2>
            <span className="badge px-3 py-2 mt-1 mt-md-2 d-inline-block text-white" style={{ backgroundColor: '#3b82f6' }}>Form: AOT-F-PM-01 | Weekly</span>
          </div>
        </div>

        <div className="card-body p-3 p-md-4">
          <form onSubmit={handleSubmit}>
            
            {/* GENERAL INFO (Already Mobile Friendly) */}
            <div className="row g-0 mb-4 border" style={{ borderColor: '#1e293b !important', borderRadius: '6px', overflow: 'hidden' }}>
              <div className="col-12 col-md-6 border-bottom p-2 p-md-3 border-md-end">
                <label className="form-label required-field">MACHINE NAME:</label>
                <input type="text" className="form-control fw-bold" name="machineName" value={metaData.machineName} readOnly />
              </div>
              <div className="col-12 col-md-6 border-bottom p-2 p-md-3">
                <label className="form-label required-field">DATE:</label>
                <input type="date" className="form-control" name="date" value={metaData.date} onChange={handleMetaChange} required />
              </div>
              <div className="col-12 col-md-6 border-bottom p-2 p-md-3 border-md-end">
                <label className="form-label required-field">MACHINE NO.:</label>
                <input type="text" className="form-control" name="machineNo" value={metaData.machineNo} onChange={handleMetaChange} required placeholder="Enter Machine No." />
              </div>
              <div className="col-12 col-md-6 border-bottom p-2 p-md-3">
                <label className="form-label required-field">LOCATION:</label>
                <input type="text" className="form-control" name="location" value={metaData.location} onChange={handleMetaChange} required placeholder="Enter Location" />
              </div>
              <div className="col-12 col-md-6 border-bottom border-md-bottom-0 p-2 p-md-3 border-md-end">
                <label className="form-label">SPECIFICATION:</label>
                <input type="text" className="form-control" name="specification" value={metaData.specification} onChange={handleMetaChange} placeholder="Enter Specifications (Optional)" />
              </div>
              <div className="col-12 col-md-6 p-2 p-md-3">
                <label className="form-label required-field">MAINTENANCE PERSONNEL:</label>
                <input type="text" className="form-control" name="maintenancePersonnel" value={metaData.maintenancePersonnel} onChange={handleMetaChange} required placeholder="Enter Technician Name" />
              </div>
            </div>

            {/* CHECKLIST TABLE -> CARDS ON MOBILE */}
            <div className="d-flex justify-content-between align-items-center mb-2 mt-4">
              <h5 className="fw-bold mb-0" style={{ color: '#1e293b', fontSize: '1.1rem' }}>Check Points</h5>
              <button 
                type="button" 
                className="btn btn-sm btn-outline-secondary" 
                onClick={() => setIsChecklistOpen(!isChecklistOpen)}
              >
                {isChecklistOpen ? 'Hide' : 'Show'}
              </button>
            </div>

            {isChecklistOpen && (
              <div className="ss-table-container mb-4">
                <table className="ss-table">
                  <thead>
                    <tr>
                      <th style={{ width: '5%' }}>Sr.</th>
                      <th style={{ width: '20%' }}>Check Points</th>
                      <th style={{ width: '25%' }}>Checking Parameter</th>
                      <th style={{ width: '10%' }}>Method</th>
                      <th style={{ width: '12%' }}>Before Maint.</th>
                      <th style={{ width: '12%' }}>After Maint.</th>
                      <th style={{ width: '16%' }}>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, index) => (
                      <tr key={row.id}>
                        <td>
                          <span className="mobile-label">Sr. No.</span>
                          <div className="fw-bold text-dark text-md-center">{index + 1}</div>
                        </td>
                        <td>
                          <span className="mobile-label">Check Point</span>
                          <div className="fw-medium text-dark">{row.point}</div>
                        </td>
                        <td>
                          <span className="mobile-label">Parameter</span>
                          <div className="text-dark small">{row.parameter}</div>
                        </td>
                        <td>
                          <span className="mobile-label">Checking Method</span>
                          <div className="text-md-center"><span className="method-badge">{row.method}</span></div>
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
                          <span className="mobile-label">Remarks / Spare Used</span>
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

            {/* FOOTER SIGNATURES */}
            <div className="row g-0 border" style={{ borderColor: '#1e293b !important', borderRadius: '6px', overflow: 'hidden' }}>
              <div className="col-12 col-md-6 border-bottom border-md-bottom-0 p-3 border-md-end">
                <label className="form-label required-field">PREPARED BY:</label>
                <input type="text" className="form-control" name="preparedBy" value={metaData.preparedBy} onChange={handleMetaChange} required placeholder="Signature / Name" />
              </div>
              <div className="col-12 col-md-6 p-3">
                <label className="form-label">CHECKED BY:</label>
                <input type="text" className="form-control" name="checkedBy" value={metaData.checkedBy} onChange={handleMetaChange} placeholder="Signature / Name" />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-4 pt-3 no-print">
              <button type="button" className="btn btn-light rounded-pill px-4 shadow-sm w-100 w-sm-auto" onClick={handleReset} style={{ fontWeight: '600', border: '1px solid #cbd5e1' }}>
                Reset Data
              </button>
              <button type="submit" className="btn btn-primary-custom rounded-pill px-5 shadow-sm w-100 w-sm-auto" disabled={isSaving}>
  {isSaving ? 'Saving...' : 'Save Record'}
</button>
            </div>

          </form>
        </div>
      </div>

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

export default VMMMaintenanceForm;