import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getApiUrl } from '../../../../config/api';

const LatheMaintenanceForm = () => {
  const navigate = useNavigate();

  // --- COLLAPSIBLE STATE ---
  const [isChecklistOpen, setIsChecklistOpen] = useState(true);

  // --- DROPDOWN OPTIONS 
  const statusOptions = ['', 'Ok', 'Not Ok', 'N/A'];

  // --- LATHE MACHINE CHECKLIST DATA 
  const initialChecklist = [
    { id: 1, point: "Main Motor", parameter: "Main motor is working ok?", method: "Visual", before: '', after: '', remarks: '' },
    { id: 2, point: "Feed Gear & Feed Screw", parameter: "Feed gear & Feed screw are in good condition ?", method: "Visual", before: '', after: '', remarks: '' },
    { id: 3, point: "V-belt", parameter: "V-belt is in good working condition ?", method: "Visual", before: '', after: '', remarks: '' },
    { id: 4, point: "Cross Slide", parameter: "Cross slide condition good ?", method: "Visual", before: '', after: '', remarks: '' },
    { id: 5, point: "Tool Post & Position of Thread", parameter: "Tool Post & Position of thread ok ?", method: "Visual", before: '', after: '', remarks: '' },
    { id: 6, point: "Chuck Jaws", parameter: "Chuck jaws is in good working condition ?", method: "Visual", before: '', after: '', remarks: '' },
    { id: 7, point: "Oil Level & Oil Seals", parameter: "Oil level & Oil seals are ok ?", method: "Visual", before: '', after: '', remarks: '' },
    { id: 8, point: "Starter & Wiring", parameter: "Starter & Wiring is in good working condition ?", method: "Visual", before: '', after: '', remarks: '' },
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
    revisionNo: '01'
  };

  const [metaData, setMetaData] = useState(initialMetaData);
  const [tableData, setTableData] = useState(initialChecklist); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- HANDLERS ---
  const handleMetaChange = (e) => setMetaData({ ...metaData, [e.target.name]: e.target.value });
  
  const handleTableChange = (id, field, value) => {
    setTableData(tableData.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
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
      const response = await fetch(getApiUrl('/api/lathe-machine-maintenance/save/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("✨ Lathe record saved successfully!");
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
        
        .white-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
        }

        .header-accent {
          background: #8b5cf6; /* Purple */
          color: white;
          padding: 20px;
          border-radius: 20px 20px 0 0;
        }

        .form-label {
          font-weight: 700;
          font-size: 0.75rem;
          color: #64748b;
          text-transform: uppercase;
        }

        .ss-table thead th {
          background-color: #f1f5f9;
          color: #1e293b;
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.75rem;
          border: 1px solid #e2e8f0;
          padding: 12px;
        }

        .ss-table td {
          border: 1px solid #e2e8f0;
          padding: 10px;
          font-size: 0.9rem;
        }

        .btn-save {
          background: #8b5cf6;
          border: none;
          padding: 12px 40px;
          border-radius: 50px;
          font-weight: 600;
          transition: 0.3s;
        }

        .btn-save:hover:not(:disabled) {
          background: #7c3aed;
          box-shadow: 0 5px 15px rgba(139, 92, 246, 0.4);
        }

        .btn-save:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .method-badge {
          background: #f5f3ff;
          color: #7c3aed;
          padding: 4px 12px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.8rem;
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
      `}</style>

      <div className="mx-auto mb-3 no-print" style={{ maxWidth: '1100px' }}>
        <button 
          className="btn btn-outline-custom rounded-pill"
          onClick={() => navigate(-1)}
          style={{ fontSize: '0.85rem' }}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="white-card mx-auto" style={{ maxWidth: '1100px' }}>
        {/* Header Section */}
        <div className="header-accent d-flex justify-content-between align-items-center">
          <div>
            <h4 className="fw-bold mb-0">MACHINE PREVENTIVE MAINTENANCE CHECK SHEET</h4>
            <small className="opacity-75">LATHE MACHINE | {metaData.docNo}</small>
          </div>
          <div className="text-end d-none d-md-block">
            <div className="badge bg-white text-dark">Rev: {metaData.revisionNo}</div>
          </div>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            
            {/* Meta Data Grid */}
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="form-label">Machine Name</label>
                <input type="text" className="form-control" name="machineName" value={metaData.machineName} onChange={handleMetaChange} placeholder="Enter Machine Name" required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Date</label>
                <input type="date" className="form-control" name="date" value={metaData.date} onChange={handleMetaChange} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Machine No.</label>
                <input type="text" className="form-control" name="machineNo" value={metaData.machineNo} onChange={handleMetaChange} placeholder="Ex: L-01" required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Location</label>
                <input type="text" className="form-control" name="location" value={metaData.location} onChange={handleMetaChange} placeholder="Shop Floor A" required />
              </div>
              <div className="col-md-4">
                <label className="form-label">Maintenance Personnel</label>
                <input type="text" className="form-control" name="maintenancePersonnel" value={metaData.maintenancePersonnel} onChange={handleMetaChange} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Specification</label>
                <input type="text" className="form-control" name="specification" value={metaData.specification} onChange={handleMetaChange} placeholder="Manual/CNC" />
              </div>
            </div>

            {/* Checklist Table */}
            <div className="d-flex justify-content-between mb-2">
              <h6 className="fw-bold text-uppercase text-muted">Maintenance Checkpoints</h6>
              <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setIsChecklistOpen(!isChecklistOpen)}>
                {isChecklistOpen ? 'Collapse' : 'Expand'}
              </button>
            </div>

            {isChecklistOpen && (
              <div className="table-responsive">
                <table className="ss-table w-100">
                  <thead>
                    <tr>
                      <th style={{ width: '50px' }}>Sr.</th>
                      <th>Check Points</th>
                      <th>Checking Parameter</th>
                      <th>Method</th>
                      <th style={{ width: '130px' }}>Before</th>
                      <th style={{ width: '130px' }}>After</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row) => (
                      <tr key={row.id}>
                        <td className="text-center fw-bold text-dark">{row.id}</td>
                        <td className="fw-medium text-dark">{row.point}</td>
                        <td className="text-muted ">{row.parameter}</td>
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
                        <td>
                          <input type="text" className="form-control form-control-sm" value={row.remarks} onChange={(e) => handleTableChange(row.id, 'remarks', e.target.value)} placeholder="..." />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer / Signatures */}
            <div className="row mt-4 pt-3 border-top g-3">
              <div className="col-md-6">
                <label className="form-label">Prepared By</label>
                <input type="text" className="form-control" name="preparedBy" value={metaData.preparedBy} onChange={handleMetaChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Checked By</label>
                <input type="text" className="form-control" name="checkedBy" value={metaData.checkedBy} onChange={handleMetaChange} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="text-end mt-4">
              <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-save text-white shadow-sm">
                {isSubmitting ? 'Submitting...' : 'Save Lathe Record'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LatheMaintenanceForm;