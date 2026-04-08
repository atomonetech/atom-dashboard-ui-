import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const PowerPressPreventiveMaintenanceForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- COLLAPSIBLE STATE FOR CHECKLIST ---
  const [isChecklistOpen, setIsChecklistOpen] = useState(true);

  // --- FIXED CHECKLIST DATA ---
  // Mapping your provided arrays into a fixed 15-point checklist
  const initialChecklist = [
    { id: 1, point: "Clean the machine by cloth", method: "Visual", parameter: "Dust free", before: '', after: '', remarks: '' },
    { id: 2, point: "Check the v-belt condition/looseness", method: "By hand", parameter: "Should be correct or replace", before: '', after: '', remarks: '' },
    { id: 3, point: "Check the diecushion bolt & working function, if applicable", method: "By Spanner/allen key", parameter: "Should be tight & proper up down", before: '', after: '', remarks: '' },
    { id: 4, point: "Check the motor foundation bolt & terminals", method: "By Spanner/plier", parameter: "Should be tight", before: '', after: '', remarks: '' },
    { id: 5, point: "Check the slide guide plate bolt", method: "By hand/plier/screw driver", parameter: "Proper dressing", before: '', after: '', remarks: '' },
    { id: 6, point: "Check the loose wiring", method: "Visual", parameter: "Should be proper working", before: '', after: '', remarks: '' },
    { id: 7, point: "Checking of all push button, emergency switch", method: "By hand operation", parameter: "Should be proper working", before: '', after: '', remarks: '' },
    { id: 8, point: "Check the Oiling & greasing of required moving parts", method: "By oil cane/grease gun", parameter: "Should be oil/grease", before: '', after: '', remarks: '' },
    { id: 9, point: "Check the Parallelism between lower and upper bed every 6 months", method: "By dial gauge", parameter: "LxR=0.50(MAX), FxB=0.94(MAX)", before: '', after: '', remarks: '' },
    { id: 10, point: "Check the crank upper & bottom plate bolt", method: "By spanner", parameter: "Should be tight", before: '', after: '', remarks: '' },
    { id: 11, point: "Check the looseness any bolts", method: "By spanner", parameter: "Should be tight", before: '', after: '', remarks: '' },
    { id: 12, point: "Check the Brake Liner condition", method: "Visual", parameter: "Should be in Good Condition", before: '', after: '', remarks: '' },
    { id: 13, point: "Check the T-slot condition", method: "Visual", parameter: "Should be clean", before: '', after: '', remarks: '' },
    { id: 14, point: "Check the Rolling & L-Key,s", method: "Visual", parameter: "Should be in Good working Condition", before: '', after: '', remarks: '' },
    { id: 15, point: "Check the preventive maintenance date", method: "Visual", parameter: "Updated in History Card", before: '', after: '', remarks: '' }
  ];

  const statusOptions = ['', 'Ok', 'Not Ok', 'Ng'];

  // --- INITIAL META STATE ---
  const initialMetaData = {
    machineName: location.state?.machineName || 'POWER PRESS',
    date: new Date().toISOString().split('T')[0],
    machineNo: '',
    location: '',
    specification: ''
  };

  // --- COMPONENT STATE ---
  const [metaData, setMetaData] = useState(initialMetaData);
  const [tableData, setTableData] = useState(initialChecklist);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    
    // Validate required meta fields
    if (!metaData.machineName || !metaData.machineNo || !metaData.location) {
      alert("Please fill all required fields in General Information.");
      return;
    }
    
    // Validate that all rows have Before and After status filled
    for (let i = 0; i < tableData.length; i++) {
      if (!tableData[i].before || !tableData[i].after) {
        alert(`Please complete the Before/After status for row ${i + 1}`);
        return;
      }
    }
    
    const formData = {
      id: Date.now(),
      metaData: { ...metaData },
      checklist: tableData,
      submittedAt: new Date().toISOString()
    };
    
    console.log("Form Submitted:", formData);
    setShowSuccess(true);
    
    // Reset inputs after 1.5 seconds
    setTimeout(() => {
      setMetaData(initialMetaData);
      setTableData(initialChecklist);
      setShowSuccess(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear all data?')) {
      setMetaData(initialMetaData);
      setTableData(initialChecklist); // Resets to empty fields but keeps static points
    }
  };

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      
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
        
        .btn-primary-custom:hover { 
          background: #b45309;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(217, 119, 6, 0.2);
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
        
        .clean-table {
          border-radius: 12px;
          overflow: hidden;
        }
        
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
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-out {
          0% { opacity: 0; transform: translateY(20px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(20px); }
        }
        
        .animate-fade-in-out { animation: fade-in-out 3s ease forwards; }
        
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
      `}</style>

      {/* --- TOP BACK BUTTON --- */}
      <div className="mx-auto mb-3 no-print animate-fade-in" style={{ maxWidth: '1200px' }}>
        <button 
          className="btn btn-outline-custom rounded-pill"
          onClick={() => navigate('/Maintenance/Machine/Weekly-Reports')}
          style={{ fontSize: '0.85rem' }}
        >
          ← Back to Weekly Hub
        </button>
      </div>

      <div className="white-card mx-auto animate-fade-in" style={{ maxWidth: '1200px' }}>
        
        {/* HEADER */}
        <div className="p-4" style={{ borderBottom: '1px solid #f3f4f6', background: '#ffffff', borderRadius: '20px 20px 0 0' }}>
          <h3 className="fw-bold mb-1" style={{ color: '#d97706', fontSize: '1.5rem' }}>
            Power Press Preventive Maintenance
          </h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
            AOT-F-MM-03 | Complete maintenance checklist and tracking system
          </p>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            
            {/* --- SECTION 1: META DATA INPUTS --- */}
            <div className="section-header">
              <h5>General Information</h5>
            </div>
            
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="form-label required-field">Machine Name</label>
                <input type="text" className="form-control" name="machineName" value={metaData.machineName} onChange={handleMetaChange} required />
              </div>
              <div className="col-md-2">
                <label className="form-label">Date</label>
                <input type="date" name="date" className="form-control" value={metaData.date} onChange={handleMetaChange} required />
              </div>
              <div className="col-md-3">
                <label className="form-label required-field">Machine No.</label>
                <input type="text" name="machineNo" className="form-control" value={metaData.machineNo} onChange={handleMetaChange} placeholder="Enter No." required />
              </div>
              <div className="col-md-3">
                <label className="form-label required-field">Location</label>
                <input type="text" name="location" className="form-control" value={metaData.location} onChange={handleMetaChange} placeholder="Enter Location" required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Specification</label>
                <input type="text" name="specification" className="form-control" value={metaData.specification} onChange={handleMetaChange} placeholder="Enter specs" />
              </div>
            </div>

            {/* --- SECTION 2: STATIC CHECKLIST TABLE --- */}
            <div className="section-header mt-4">
              <h5>Maintenance Checklist</h5>
            </div>

            <div 
              className="collapse-header d-flex justify-content-between align-items-center mb-3"
              onClick={() => setIsChecklistOpen(!isChecklistOpen)}
            >
              <div>
                <span className="fw-bold" style={{ color: '#374151' }}>Checklist Items</span>
                <span className="badge-count">{tableData.length}</span>
                <small className="text-muted ms-2" style={{ color: '#6b7280' }}>
                  {isChecklistOpen ? '▼ Click to collapse' : '▶ Click to expand'}
                </small>
              </div>
              <span style={{ color: '#d97706', fontWeight: 'bold' }}>{isChecklistOpen ? '−' : '+'}</span>
            </div>

            {isChecklistOpen && (
              <div className="mb-4">
                <div className="table-responsive">
                  <table className="table clean-table align-middle mb-0">
                    <thead>
                      <tr>
                        <th style={{ width: '4%' }} className="text-center">#</th>
                        <th style={{ width: '26%' }}>Check Point</th>
                        <th style={{ width: '15%' }}>Checking Method</th>
                        <th style={{ width: '20%' }}>Checking Parameter</th>
                        <th style={{ width: '10%' }}>Before Maint.*</th>
                        <th style={{ width: '10%' }}>After Maint. *</th>
                        <th style={{ width: '15%' }}>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row, index) => (
                        <tr key={row.id}>
                          <td className="text-center fw-bold text-muted">{index + 1}</td>
                          <td className="fw-medium">{row.point}</td>
                          <td className="text-muted">{row.method}</td>
                          <td className="text-muted">{row.parameter}</td>
                          
                          <td>
                            <select 
                              className="form-select border-0 bg-light shadow-sm" 
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
                            <select 
                              className="form-select border-0 bg-light shadow-sm" 
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
                            <input 
                              type="text" 
                              className="form-control border-0 bg-light shadow-sm" 
                              placeholder="Remarks..." 
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
            <div className="d-flex flex-wrap align-items-center gap-4 p-3 rounded-3 mb-4" style={{ backgroundColor: '#f9fafb', border: '1px dashed #d1d5db' }}>
              <span className="text-sm fw-bold" style={{ color: '#374151' }}>Legends:</span>
              <div className="d-flex align-items-center gap-2">
                <span className="w-4 h-4 rounded-circle" style={{ width: '14px', height: '14px', backgroundColor: '#10b981', borderRadius: '50%' }}></span>
                <span className="text-sm fw-medium" style={{ color: '#374151' }}>Ok</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="w-4 h-4 rounded-circle" style={{ width: '14px', height: '14px', backgroundColor: '#ef4444', borderRadius: '50%' }}></span>
                <span className="text-sm fw-medium" style={{ color: '#374151' }}>Not Ok</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="w-4 h-4 rounded-circle" style={{ width: '14px', height: '14px', backgroundColor: '#f59e0b', borderRadius: '50%' }}></span>
                <span className="text-sm fw-medium" style={{ color: '#374151' }}>Ng (No Good)</span>
              </div>
            </div>

            {/* --- ACTION BUTTONS --- */}
            <div className="d-flex justify-content-end gap-3 mt-4 pt-3 no-print border-top" style={{ borderTopColor: '#f3f4f6' }}>
              <button 
                type="button" 
                className="btn btn-light rounded-pill px-4 shadow-sm" 
                onClick={handleReset}
                style={{ fontWeight: '600', border: '1px solid #e5e7eb', color: '#374151' }}
              >
                Reset Data
              </button>
              <button type="submit" className="btn btn-primary-custom rounded-pill px-5 shadow-sm">
                <i className="bi bi-floppy me-2"></i> Save Record
              </button>
            </div>
            
          </form>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="position-fixed bottom-0 end-0 m-4 bg-success text-white px-4 py-3 rounded-3 shadow-lg animate-fade-in-out z-3" style={{ minWidth: '250px' }}>
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