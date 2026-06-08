import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const CncPreventiveMaintenanceForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- COLLAPSIBLE STATE FOR CHECKLIST ---
  const [isChecklistOpen, setIsChecklistOpen] = useState(true);

  // --- DROPDOWN OPTIONS FOR STATUS ---
  const statusOptions = ['', 'Ok', 'Not Ok', 'Ng', 'N/A'];

  // --- FIXED CNC CHECKLIST DATA WITH PRE-DEFINED CHECKING METHODS ---
  const initialChecklist = [
    { id: 1, point: "Lub oil pressure (12 to 15 bar)", method: 'Visual', before: '', after: '', remarks: '' },
    { id: 2, point: "Lub oil level", method: 'Visual', before: '', after: '', remarks: '' },
    { id: 3, point: "Hydraulic oil level and condition", method: 'Visual', before: '', after: '', remarks: '' },
    { id: 4, point: "Hydraulic system pressure", method: 'Visual', before: '', after: '', remarks: '' },
    { id: 5, point: "Chuck clamping Pressure", method: 'Visual', before: '', after: '', remarks: '' },
    { id: 6, point: "Coolant level in coolant tank", method: 'Visual', before: '', after: '', remarks: '' },
    { id: 7, point: "Work holding greasing", method: 'Visual', before: '', after: '', remarks: '' },
    { id: 8, point: "Oil level in chip conveyor gear", method: 'Visual', before: '', after: '', remarks: '' },
    { id: 9, point: "Oil/ coolant leakage in fitting", method: 'Visual', before: '', after: '', remarks: '' },
    { id: 10, point: "Lubricator hose condition", method: 'Visual', before: '', after: '', remarks: '' },
    { id: 11, point: "Spindle belt condition, belt tension", method: 'Feel by Hand', before: '', after: '', remarks: '' },
    { id: 12, point: "Spindle motor blower fan", method: 'Visual', before: '', after: '', remarks: '' },
    { id: 13, point: "Drive cooling fan", method: 'Visual', before: '', after: '', remarks: '' },
    { id: 14, point: "Overall cleaning", method: 'By clothes/ brushes', before: '', after: '', remarks: '' }
  ];

  // --- INITIAL STATES (For Resetting) ---
  const initialMetaData = {
    machineName: location.state?.machineName || 'CNC', 
    date: new Date().toISOString().split('T')[0],
    machineNo: '',
    location: '',
    specification: '',
    maintenancePersonnel: ''
  };

  // --- COMPONENT STATE ---
  const [metaData, setMetaData] = useState(initialMetaData);
  const [tableData, setTableData] = useState(initialChecklist); 
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preparedBy, setPreparedBy] = useState("");

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
    if (result.detail) return result.detail;
    if (result.error) return typeof result.error === 'string' ? result.error : JSON.stringify(result.error);
    if (result.errors) {
      if (typeof result.errors === 'string') return result.errors;
      return Object.entries(result.errors)
        .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : JSON.stringify(messages)}`)
        .join('\n');
    }
    return JSON.stringify(result);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!metaData.machineName || !metaData.machineNo || !metaData.location || !metaData.maintenancePersonnel) {
      alert("Please fill all required fields in General Information.");
      return;
    }

    for (let i = 0; i < tableData.length; i++) {
      if (!tableData[i].before || !tableData[i].after) {
        alert(`Please complete Before/After status for row ${i + 1}`);
        return;
      }
    }
    
    setIsSubmitting(true);

    const checklistPayload = tableData.map((row, index) => ({
      sr_no: index + 1,
      check_point: row.point,
      checking_method: row.method,
      before_maintenance: row.before,
      after_maintenance: row.after,
      remarks: row.remarks || ''
    }));

    const payload = {
      machine_name: metaData.machineName,
      machine_no: metaData.machineNo,
      date: metaData.date,
      location: metaData.location,
      specification: metaData.specification,
      maintenance_personnel: metaData.maintenancePersonnel,
      checklist: checklistPayload
    };
    
    try {
      const response = await fetch('http://192.168.0.34:8000/api/cnc-maintenance/save/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || result.success === false) {
        console.error("CNC maintenance save failed:", result);
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
      console.error("Failed to save CNC maintenance record:", error);
      alert(`Failed to save CNC maintenance record: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all fields?')) {
      setMetaData(initialMetaData);
      setTableData(initialChecklist);
    }
  };

  return (
    <div className="container-fluid py-3 py-md-4" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
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
        
        .btn-primary-custom:hover { 
          background: #059669;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
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
      <div className="mx-auto mb-3 no-print animate-fade-in px-2" style={{ maxWidth: '1200px' }}>
        <button 
          className="btn btn-outline-custom rounded-pill"
          onClick={() => navigate('/Maintenance/Machine/weekly')}
          style={{ fontSize: '0.85rem' }}
        >
          ← Back to Weekly Reports
        </button>
      </div>

      <div className="white-card mx-auto animate-fade-in" style={{ maxWidth: '1200px' }}>
        
        {/* HEADER */}
        <div className="p-3 p-md-4" style={{ borderBottom: '1px solid #e9ecef', background: 'white', borderRadius: '20px 20px 0 0' }}>
          <h3 className="fw-bold mb-1 fs-5 fs-md-3" style={{ color: '#10b981' }}>
            CNC Preventive Maintenance
          </h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
            Complete maintenance checklist and tracking system
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
                <label className="form-label required-field">Machine Name</label>
                <input type="text" className="form-control" name="machineName" value={metaData.machineName} onChange={handleMetaChange} required placeholder="e.g., CNC Milling Machine" />
              </div>
              <div className="col-12 col-md-2">
                <label className="form-label required-field">Machine No.</label>
                <input type="text" className="form-control" name="machineNo" value={metaData.machineNo} onChange={handleMetaChange} required placeholder="Number" />
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label required-field">Date</label>
                <input type="date" className="form-control" name="date" value={metaData.date} onChange={handleMetaChange} required />
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label required-field">Location</label>
                <input type="text" className="form-control" name="location" value={metaData.location} onChange={handleMetaChange} required placeholder="Facility location" />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Specification</label>
                <input type="text" className="form-control" name="specification" value={metaData.specification} onChange={handleMetaChange} placeholder="Machine specs (optional)" />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label required-field">Maintenance Personnel</label>
                <input type="text" className="form-control" name="maintenancePersonnel" value={metaData.maintenancePersonnel} onChange={handleMetaChange} required placeholder="Technician name" />
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
                  {isChecklistOpen ? '▼ Click to collapse' : '▶ Click to expand'}
                </small>
              </div>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>{isChecklistOpen ? '−' : '+'}</span>
            </div>

            {isChecklistOpen && (
              <div className="mb-4">
                <div className="table-responsive">
                  <table className="table clean-table align-middle mb-0">
                    <thead>
                      <tr>
                        <th style={{ width: '4%' }} className="text-center">#</th>
                        <th style={{ width: '35%' }}>Check Point</th>
                        <th style={{ width: '15%' }}>Checking Method</th>
                        <th style={{ width: '12%' }}>Before Maint.*</th>
                        <th style={{ width: '12%' }}>After Maint.*</th>
                        <th style={{ width: '22%' }}>Remarks / Spares</th>
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
                                <option key={i} value={opt}>{opt || 'Select...'}</option>
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
                                <option key={i} value={opt}>{opt || 'Select...'}</option>
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

            {/* Legend Section */}
            <div className="d-flex flex-wrap align-items-center gap-3 gap-md-4 p-3 rounded-3 mb-4" style={{ backgroundColor: '#f8f9fa', border: '1px dashed #dee2e6' }}>
              <span className="text-sm fw-bold w-100 w-md-auto" style={{ color: '#495057' }}>Legends:</span>
              <div className="d-flex align-items-center gap-2">
                <span className="w-4 h-4 rounded-circle" style={{ width: '14px', height: '14px', backgroundColor: '#10b981', borderRadius: '50%' }}></span>
                <span className="text-sm fw-medium" style={{ color: '#495057' }}>Ok</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="w-4 h-4 rounded-circle" style={{ width: '14px', height: '14px', backgroundColor: '#ef4444', borderRadius: '50%' }}></span>
                <span className="text-sm fw-medium" style={{ color: '#495057' }}>Not Ok</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="w-4 h-4 rounded-circle" style={{ width: '14px', height: '14px', backgroundColor: '#f59e0b', borderRadius: '50%' }}></span>
                <span className="text-sm fw-medium" style={{ color: '#495057' }}>Ng (No Good)</span>
              </div>
            </div>

            {/* --- ACTION BUTTONS --- */}
            <div className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-4 pt-3 no-print border-top">
              
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
                style={{ fontWeight: '600', border: '1px solid #dee2e6' }}
              >
                Reset Data
              </button>
              <button type="submit" className="btn btn-primary-custom rounded-pill px-5 shadow-sm w-100 w-sm-auto" disabled={isSubmitting}>
                <i className="bi bi-floppy me-2"></i> {isSubmitting ? 'Saving...' : 'Save Record'}
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="position-fixed bottom-0 end-0 m-3 m-md-4 bg-success text-white px-4 py-3 rounded-3 shadow-lg z-3" style={{ minWidth: '250px' }}>
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-check-circle-fill fs-5"></i>
            <span className="fw-medium">Maintenance record saved!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CncPreventiveMaintenanceForm;
