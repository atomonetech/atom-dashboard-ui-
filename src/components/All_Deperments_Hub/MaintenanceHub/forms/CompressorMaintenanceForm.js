import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const CompressorMaintenanceForm = () => {
  const navigate = useNavigate();
  const [isChecklistOpen, setIsChecklistOpen] = useState(true);
  const statusOptions = ['', 'Ok', 'Not Ok', 'N/A'];

  // --- FULL CHECKLIST DATA ---
  const initialChecklist = [
    { id: 1, point: "Clean the machine by cloth", parameter: "Dust free", method: "Visual", before: '', after: '', remarks: '' },
    { id: 2, point: "Check the oil level", parameter: "Should be proper", method: "By spanner", before: '', after: '', remarks: '' },
    { id: 3, point: "Check the air filter", parameter: "Should be proper condition", method: "By spanner", before: '', after: '', remarks: '' },
    { id: 4, point: "Check the air receiver", parameter: "Should be cleaned", method: "Visual", before: '', after: '', remarks: '' },
    { id: 5, point: "Check any abnormal sound", parameter: "No abnormal sound", method: "Visual", before: '', after: '', remarks: '' },
    { id: 6, point: "Check nut & bolt", parameter: "Should be tight", method: "By Spanner/ allen key", before: '', after: '', remarks: '' },
    { id: 7, point: "Check loose wiring", parameter: "Should be tight", method: "By plier/ spanner", before: '', after: '', remarks: '' }
  ];

  const initialMetaData = {
    machineName: 'COMPRESSOR',
    date: new Date().toISOString().split('T')[0],
    machineNo: '',
    location: '',
    specification: '',
    maintenancePersonnel: '',
    preparedBy: '',
    checkedBy: ''
  };

  const [metaData, setMetaData] = useState(initialMetaData);
  const [tableData, setTableData] = useState(initialChecklist);
  const [showSuccess, setShowSuccess] = useState(false);

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
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => { 
      setShowSuccess(false); 
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    }, 2000);
  };

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f0fdfa', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .teal-card { 
          background: white; 
          border-radius: 20px; 
          box-shadow: 0 4px 20px rgba(20, 184, 166, 0.08); 
        }
        
        .btn-teal { 
          background: #0d9488; 
          color: white; 
          border: none; 
          font-weight: 600; 
          padding: 12px 30px; 
          transition: all 0.3s ease; 
        }
        
        .btn-teal:hover { 
          background: #0f766e; 
          transform: translateY(-2px); 
          box-shadow: 0 8px 15px rgba(13, 148, 136, 0.3); 
        }

        /* --- STYLED BACK BUTTON --- */
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
        
        .method-badge { 
          background-color: #ccfbf1; 
          color: #0f766e; 
          padding: 4px 10px; 
          border-radius: 6px; 
          font-size: 0.75rem; 
          font-weight: 700; 
        }
        
        select option[value="Ok"] { color: #10b981; font-weight: bold; }
        select option[value="Not Ok"] { color: #ef4444; font-weight: bold; }

        /* Desktop Table CSS */
        .ss-table-container { border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
        .ss-table { width: 100%; border-collapse: collapse; margin-bottom: 0; }
        .ss-table thead th { 
          background-color: #0d9488; 
          color: white; 
          padding: 15px; 
          font-size: 0.85rem; 
          text-transform: uppercase; 
        }
        .ss-table tbody td { padding: 10px; vertical-align: middle; }

        /* Magic Mobile View CSS */
        .mobile-label { display: none; }
        @media (max-width: 767px) {
          .ss-table-container { border: none; background: transparent; }
          .ss-table thead { display: none; }
          .ss-table, .ss-table tbody, .ss-table tr, .ss-table td { 
            display: block; 
            width: 100%; 
          }
          .ss-table tr { 
            margin-bottom: 15px; 
            border: 1px solid #cbd5e1; 
            border-radius: 12px; 
            padding: 15px; 
            background: white; 
            box-shadow: 0 4px 10px rgba(0,0,0,0.05); 
          }
          .ss-table td { 
            border: none; 
            border-bottom: 1px dashed #e2e8f0; 
            padding: 10px 0; 
            text-align: left !important; 
          }
          .ss-table td:last-child { border-bottom: none; }
          .mobile-label { 
            display: block; 
            font-size: 0.75rem; 
            font-weight: 700; 
            color: #64748b; 
            text-transform: uppercase; 
            margin-bottom: 5px; 
          }
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
      <div className="teal-card mx-auto mb-4 p-3 p-md-4 d-flex justify-content-between align-items-center" style={{ maxWidth: '1200px', borderTop: '6px solid #14b8a6' }}>
        <div>
          <h3 className="fw-bold mb-1 fs-5 fs-md-3" style={{ color: '#115e59' }}>COMPRESSOR MAINTENANCE</h3>
          <span className="badge rounded-pill" style={{ backgroundColor: '#ccfbf1', color: '#0f766e', padding: '8px 15px' }}>Form: AOT-F-PM-01 | Weekly</span>
        </div>
      </div>

      <div className="teal-card mx-auto p-3 p-md-4" style={{ maxWidth: '1200px' }}>
        <form onSubmit={handleSubmit}>
          {/* General Information */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-4">
              <label className="form-label">Machine Name</label>
              <input type="text" className="form-control bg-light" value={metaData.machineName} readOnly />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Date</label>
              <input type="date" className="form-control" name="date" value={metaData.date} onChange={handleMetaChange} required />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Machine No.</label>
              <input type="text" className="form-control" name="machineNo" value={metaData.machineNo} onChange={handleMetaChange} required />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Location</label>
              <input type="text" className="form-control" name="location" value={metaData.location} onChange={handleMetaChange} required />
            </div>
            <div className="col-12 col-md-8">
              <label className="form-label">Maintenance Personnel</label>
              <input type="text" className="form-control" name="maintenancePersonnel" value={metaData.maintenancePersonnel} onChange={handleMetaChange} required />
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0" style={{ color: '#115e59' }}>Check Points</h5>
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setIsChecklistOpen(!isChecklistOpen)}>
              {isChecklistOpen ? 'Hide' : 'Show'}
            </button>
          </div>

          {isChecklistOpen && (
            <div className="ss-table-container mb-4">
              <table className="table mb-0 ss-table">
                <thead>
                  <tr className="text-center">
                    <th style={{ width: '5%' }}>Sr.</th>
                    <th className="text-start" style={{ width: '25%' }}>Check Points</th>
                    <th className="text-start" style={{ width: '25%' }}>Parameter</th>
                    <th style={{ width: '10%' }}>Method</th>
                    <th style={{ width: '10%' }}>Before</th>
                    <th style={{ width: '10%' }}>After</th>
                    <th style={{ width: '15%' }}>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={row.id} className="align-middle">
                      <td className="text-center fw-bold">
                        <span className="mobile-label">Sr. No.</span>
                        {index + 1}
                      </td>
                      <td className="small fw-medium">
                        <span className="mobile-label">Check Point</span>
                        {row.point}
                      </td>
                      <td className="small text-muted">
                        <span className="mobile-label">Parameter</span>
                        {row.parameter}
                      </td>
                      <td className="text-md-center">
                        <span className="mobile-label">Method</span>
                        <span className="method-badge">{row.method}</span>
                      </td>
                      <td>
                        <span className="mobile-label">Before Maint.</span>
                        <select className="form-select form-select-sm w-100" value={row.before} onChange={(e) => handleBeforeChange(row.id, e.target.value)} required>
                          {statusOptions.map(opt => <option key={opt} value={opt}>{opt || 'Select'}</option>)}
                        </select>
                      </td>
                      <td>
                        <span className="mobile-label">After Maint.</span>
                        <select className="form-select form-select-sm w-100" value={row.after} onChange={(e) => handleAfterChange(row.id, e.target.value)} required>
                          {statusOptions.map(opt => <option key={opt} value={opt}>{opt || 'Select'}</option>)}
                        </select>
                      </td>
                      <td>
                        <span className="mobile-label">Remarks</span>
                        <input type="text" className="form-control form-control-sm w-100" placeholder="Remarks..." value={row.remarks} onChange={(e) => handleRemarksChange(row.id, e.target.value)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Signatures */}
          <div className="row g-4 mt-2">
            <div className="col-12 col-md-6">
              <div className="p-3 rounded-3 border">
                <label className="form-label">Prepared By</label>
                <input type="text" className="form-control border-0" name="preparedBy" value={metaData.preparedBy} onChange={handleMetaChange} required />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="p-3 rounded-3 border">
                <label className="form-label">Checked By</label>
                <input type="text" className="form-control border-0" name="checkedBy" value={metaData.checkedBy} onChange={handleMetaChange} />
              </div>
            </div>
          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-end mt-4">
            <button type="submit" className="btn btn-teal rounded-pill px-5 w-100 w-sm-auto">
              Save Record
            </button>
          </div>
        </form>
      </div>

      {showSuccess && (
        <div className="position-fixed bottom-0 end-0 m-4 p-3 bg-success text-white rounded-3 shadow-lg">
          ✔ Record saved successfully!
        </div>
      )}
    </div>
  );
};

export default CompressorMaintenanceForm;