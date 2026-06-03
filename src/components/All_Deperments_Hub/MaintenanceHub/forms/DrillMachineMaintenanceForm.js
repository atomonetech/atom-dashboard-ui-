import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const DrillMachineMaintenanceForm = () => {
  const navigate = useNavigate();
  const [isChecklistOpen, setIsChecklistOpen] = useState(true);
  const statusOptions = ['', 'Ok', 'Not Ok', 'N/A'];

  // --- DRILL MACHINE CHECKLIST DATA ---
  const initialChecklist = [
    { id: 1, point: "Main Motor", parameter: "Main motor is working ?", method: "Visual", before: '', after: '', remarks: '' },
    { id: 2, point: "Spindle Bearing", parameter: "Spindle bearing is in good condition ?", method: "Visual", before: '', after: '', remarks: '' },
    { id: 3, point: "Main Spindle", parameter: "Main spindle is in good condition ?", method: "Visual", before: '', after: '', remarks: '' },
    { id: 4, point: "V-belt", parameter: "V-belt is in good & working condition ?", method: "Visual", before: '', after: '', remarks: '' },
    { id: 5, point: "Drill Chuck", parameter: "Drill chuck is in good condition ?", method: "Visual", before: '', after: '', remarks: '' },
    { id: 6, point: "Shaft Alignment", parameter: "Shaft alignment is ok ?", method: "Visual", before: '', after: '', remarks: '' },
    { id: 7, point: "Check the preventive maintenance date", parameter: "Updated", method: "Visual", before: '', after: '', remarks: '' }
  ];

  const initialMetaData = {
    machineName: 'VERTICAL DRILL MACHINE', 
    date: new Date().toISOString().split('T')[0],
    machineNo: '',
    location: '',
    specification: '',
    maintenancePersonnel: '',
    preparedBy: '',
    checkedBy: '',
    docNo: 'AOT-F-MM-03',
    revisionNo: '01'
  };

  const [metaData, setMetaData] = useState(initialMetaData);
  const [tableData, setTableData] = useState(initialChecklist); 
  const [showSuccess, setShowSuccess] = useState(false);

  const handleMetaChange = (e) => setMetaData({ ...metaData, [e.target.name]: e.target.value });
  const handleTableChange = (id, field, value) => {
    setTableData(tableData.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!metaData.machineNo || !metaData.location || !metaData.preparedBy) {
      alert("Please fill required fields.");
      return;
    }
    console.log("Drill Machine Form Submitted:", { id: Date.now(), metaData, checklist: tableData });
    setShowSuccess(true);
    setTimeout(() => {
      setMetaData(initialMetaData);
      setTableData(initialChecklist); 
      setShowSuccess(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        * { font-family: 'Inter', sans-serif; }
        .white-card { background: white; border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04); }
        
        /* Drill Machine Theme Color: Indigo */
        .header-accent { background: #6d28d9; color: white; padding: 20px; border-radius: 20px 20px 0 0; }
        .btn-save { background: #6d28d9; border: none; padding: 12px 40px; border-radius: 50px; font-weight: 600; transition: 0.3s; }
        .btn-save:hover { background: #5b21b6; box-shadow: 0 5px 15px rgba(109, 40, 217, 0.4); }
        .method-badge { background: #f3e8ff; color: #6d28d9; padding: 4px 12px; border-radius: 6px; font-weight: 600; font-size: 0.8rem; }
        
        /* --- STYLED BACK BUTTON --- */
        .btn-outline-custom { 
          background: white;
          color: #6d28d9; 
          border: 2px solid #6d28d9;
          transition: all 0.2s ease;
          font-weight: 600;
          padding: 8px 20px;
        }
        
        .btn-outline-custom:hover { 
          background: #6d28d9;
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(109, 40, 217, 0.2);
        }

        .animate-fade-in { animation: fadeInUp 0.4s ease-out; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .form-label { font-weight: 700; font-size: 0.75rem; color: #64748b; text-transform: uppercase; }
        .ss-table thead th { background-color: #f1f5f9; color: #1e293b; font-weight: 700; text-transform: uppercase; font-size: 0.75rem; border: 1px solid #e2e8f0; padding: 12px; }
        .ss-table td { border: 1px solid #e2e8f0; padding: 10px; font-size: 0.9rem; }
      `}</style>

      {/* --- TOP BACK BUTTON --- */}
      <div className="mx-auto mb-3 no-print animate-fade-in px-2" style={{ maxWidth: '1100px' }}>
        <button 
          className="btn btn-outline-custom rounded-pill"
          onClick={() => navigate(-1)}
          style={{ fontSize: '0.85rem' }}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="white-card mx-auto" style={{ maxWidth: '1100px' }}>
        <div className="header-accent d-flex justify-content-between align-items-center">
          <div>
            <h4 className="fw-bold mb-0">MACHINE PREVENTIVE MAINTENANCE CHECK SHEET</h4>
            <small className="opacity-75">{metaData.machineName} | {metaData.docNo}</small>
          </div>
          <div className="text-end d-none d-md-block">
            <div className="badge bg-white text-dark">Rev: {metaData.revisionNo}</div>
          </div>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-4">
              <div className="col-md-4"><label className="form-label">Machine Name</label><input type="text" className="form-control bg-light fw-bold" value={metaData.machineName} readOnly /></div>
              <div className="col-md-4"><label className="form-label">Date</label><input type="date" className="form-control" name="date" value={metaData.date} onChange={handleMetaChange} /></div>
              <div className="col-md-4"><label className="form-label">Machine No.</label><input type="text" className="form-control" name="machineNo" value={metaData.machineNo} onChange={handleMetaChange} required /></div>
              <div className="col-md-4"><label className="form-label">Location</label><input type="text" className="form-control" name="location" value={metaData.location} onChange={handleMetaChange} required /></div>
              <div className="col-md-4"><label className="form-label">Maintenance Personnel</label><input type="text" className="form-control" name="maintenancePersonnel" value={metaData.maintenancePersonnel} onChange={handleMetaChange} /></div>
              <div className="col-md-4"><label className="form-label">Specification</label><input type="text" className="form-control" name="specification" value={metaData.specification} onChange={handleMetaChange} /></div>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <h6 className="fw-bold text-uppercase text-muted">Maintenance Checkpoints</h6>
              <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setIsChecklistOpen(!isChecklistOpen)}>{isChecklistOpen ? 'Collapse' : 'Expand'}</button>
            </div>

            {isChecklistOpen && (
              <div className="table-responsive">
                <table className="ss-table w-100">
                  <thead>
                    <tr>
                      <th style={{ width: '50px' }}>Sr.</th><th>Check Points</th><th>Checking Parameter</th><th>Method</th><th style={{ width: '130px' }}>Before</th><th style={{ width: '130px' }}>After</th><th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row) => (
                      <tr key={row.id}>
                        <td className="text-center fw-bold text-dark">{row.id}</td>
                        <td className="fw-medium text-dark">{row.point}</td>
                        <td className="text-muted">{row.parameter}</td>
                        <td className="text-center"><span className="method-badge">{row.method}</span></td>
                        <td>
                          <select className="form-select form-select-sm" value={row.before} onChange={(e) => handleTableChange(row.id, 'before', e.target.value)} required>
                            {statusOptions.map(opt => <option key={opt} value={opt}>{opt || 'Select'}</option>)}
                          </select>
                        </td>
                        <td>
                          <select className="form-select form-select-sm" value={row.after} onChange={(e) => handleTableChange(row.id, 'after', e.target.value)} required>
                            {statusOptions.map(opt => <option key={opt} value={opt}>{opt || 'Select'}</option>)}
                          </select>
                        </td>
                        <td><input type="text" className="form-control form-control-sm" value={row.remarks} onChange={(e) => handleTableChange(row.id, 'remarks', e.target.value)} placeholder="..." /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="row mt-4 pt-3 border-top g-3">
              <div className="col-md-6"><label className="form-label">Prepared By</label><input type="text" className="form-control" name="preparedBy" value={metaData.preparedBy} onChange={handleMetaChange} required /></div>
              <div className="col-md-6"><label className="form-label">Checked By</label><input type="text" className="form-control" name="checkedBy" value={metaData.checkedBy} onChange={handleMetaChange} /></div>
            </div>

            <div className="text-end mt-4">
              <button type="submit" className="btn btn-primary btn-save text-white shadow-sm">Save Drill Record</button>
            </div>
          </form>
        </div>
      </div>

      {showSuccess && <div className="position-fixed bottom-0 end-0 m-4 bg-dark text-white px-4 py-3 rounded-4 shadow-lg animate-fade-in">✨ Drill record saved successfully!</div>}
    </div>
  );
};

export default DrillMachineMaintenanceForm;