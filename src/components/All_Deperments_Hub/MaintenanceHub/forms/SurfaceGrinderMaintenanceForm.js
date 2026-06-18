import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getApiUrl } from '../../../../config/api';
import axios from "axios";
const API_LOG = `${
  process.env.REACT_APP_API_URL || "http://localhost:8000"
}/api/log-report/`;


const SurfaceGrinderMaintenanceForm = () => {
  const navigate = useNavigate();
  const [isChecklistOpen, setIsChecklistOpen] = useState(true);
  const statusOptions = ['', 'Ok', 'Not Ok', 'N/A'];

  // --- SURFACE GRINDER CHECKLIST DATA ---
  const initialChecklist = [
    { id: 1, point: "Main Motor", parameter: "Main motor is working ok ?", method: "Visual", before: '', after: '', remarks: '' },
    { id: 2, point: "Starter & Wiring", parameter: "Starter is ok?", method: "Visual", before: '', after: '', remarks: '' },
    { id: 3, point: "Slide Oil", parameter: "Slide oil level is ok ?", method: "Visual", before: '', after: '', remarks: '' },
    { id: 4, point: "Oil Pipes", parameter: "Oil pipes are ok ?", method: "Visual", before: '', after: '', remarks: '' },
    { id: 5, point: "Lead Screws", parameter: "Damages/Loose/Wornout ?", method: "Visual/Allen Key", before: '', after: '', remarks: '' },
    { id: 6, point: "Motor & Spindle Coupling", parameter: "Damages/Loose/Wornout ?", method: "Visual", before: '', after: '', remarks: '' },
    { id: 7, point: "Magnetic Base Block", parameter: "Block is magnetised and clean", method: "Visual", before: '', after: '', remarks: '' },
    { id: 8, point: "Wheel Alignment", parameter: "Alignment ok ?", method: "Visual", before: '', after: '', remarks: '' },
    { id: 9, point: "Check the preventive maintenance date", parameter: "Updated", method: "Visual", before: '', after: '', remarks: '' }
  ];

  const initialMetaData = {
    machineName: '', // Editable
    date: new Date().toISOString().split('T')[0],
    machineNo: '',
    location: '',
    specification: '',
    maintenancePersonnel: '',
    preparedBy: '',
    checkedBy: '',
    docNo: 'AOT-F-MM-03',
    revisionNo: '00'
  };

  const [metaData, setMetaData] = useState(initialMetaData);
  const [tableData, setTableData] = useState(initialChecklist); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMetaChange = (e) => setMetaData({ ...metaData, [e.target.name]: e.target.value });
  const handleTableChange = (id, field, value) => {
    setTableData(tableData.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!metaData.machineNo || !metaData.location || !metaData.preparedBy) {
      alert("Please fill required fields.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      machineName: metaData.machineName,
      date: metaData.date,
      machineNo: metaData.machineNo,
      location: metaData.location,
      specification: metaData.specification,
      maintenancePersonnel: metaData.maintenancePersonnel,
      preparedBy: metaData.preparedBy,
      checkedBy: metaData.checkedBy,
      tableData: tableData
    };

    try {
      const response = await fetch(getApiUrl('/api/surface-grinder-maintenance/save/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
          const currentUser = localStorage.getItem("username") || "Unknown User";

        try {
          await axios.post(API_LOG, {
            username: currentUser,
            report_name: "Surface Grinder Mentinance Form", // Yahan hardcode kar diya form ka naam
          });
          console.log("Activity log successfully saved!");
        } catch (logError) {
          console.error("Activity log save karne mein error aayi:", logError);
        }
        alert("✨ Grinder record saved successfully!");
        setMetaData(initialMetaData);
        setTableData(initialChecklist); 
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const errorData = await response.json();
        alert("Failed to save data. Error: " + (errorData.error ? JSON.stringify(errorData.error) : 'Unknown Error'));
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while saving the data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
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
            <small className="opacity-75">SURFACE GRINDER | {metaData.docNo}</small>
          </div>
          <div className="text-end d-none d-md-block">
            <div className="badge bg-white text-dark">Rev: {metaData.revisionNo}</div>
          </div>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="form-label">Machine Name</label>
                <input type="text" className="form-control" name="machineName" value={metaData.machineName} onChange={handleMetaChange} placeholder="Enter Machine Name" required />
              </div>
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
              <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-save text-white shadow-sm">
                {isSubmitting ? 'Submitting...' : 'Save Grinder Record'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SurfaceGrinderMaintenanceForm;