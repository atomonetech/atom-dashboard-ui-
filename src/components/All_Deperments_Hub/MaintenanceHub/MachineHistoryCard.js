import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MachineHistoryCard = () => {
    const navigate = useNavigate();

    // --- MACHINE DETAILS STATE ---
    const [machineDetails, setMachineDetails] = useState({
        machineName: '',
        machineNo: '',
        machineSpecs: '',
        location: ''
    });

    // --- HISTORY TABLE STATE ---
    const [historyData, setHistoryData] = useState([
        { id: 1, date: '', problem: '', actionTaken: '', update4M: '', signature: '', remarks: '' },
        { id: 2, date: '', problem: '', actionTaken: '', update4M: '', signature: '', remarks: '' },
        { id: 3, date: '', problem: '', actionTaken: '', update4M: '', signature: '', remarks: '' },
        { id: 4, date: '', problem: '', actionTaken: '', update4M: '', signature: '', remarks: '' }
    ]);

    const [signatures, setSignatures] = useState({ preparedBy: '', approvedBy: '' });

    // --- HANDLERS ---
    const handleDetailChange = (e) => {
        setMachineDetails({ ...machineDetails, [e.target.name]: e.target.value });
    };

    const handleRowChange = (id, field, value) => {
        setHistoryData(prev => 
            prev.map(row => row.id === id ? { ...row, [field]: value } : row)
        );
    };

    const addRow = () => {
        setHistoryData([...historyData, { 
            id: historyData.length + 1, date: '', problem: '', actionTaken: '', update4M: '', signature: '', remarks: '' 
        }]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!machineDetails.machineName || !machineDetails.machineNo) {
            alert("⚠️ Please fill in the Machine Name and Machine No.");
            return;
        }
        console.log("Saving Machine History:", { machineDetails, historyData, signatures });
        alert("✅ Machine History Card successfully updated!");
        navigate('/maintenance-hub'); 
    };

    return (
        <div className="mc-history-page">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            
            <style>{`
                .mc-history-page {
                    position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; min-height: 100vh !important;
                    background-color: #f8fafc !important; z-index: 9999 !important; overflow-x: hidden !important; font-family: 'Inter', sans-serif !important;
                }
                
                .dashboard-navbar { 
                    position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 70px !important; 
                    background-color: #ffffff !important; border-bottom: 1px solid #e2e8f0 !important; z-index: 10000 !important; 
                    display: flex !important; align-items: center !important; justify-content: space-between !important; 
                    padding: 0 2rem !important; box-shadow: 0 2px 10px rgba(0,0,0,0.05) !important;
                }
                
                .brand-logo { font-weight: 900 !important; color: #3b82f6 !important; font-size: 1.4rem !important; display: flex !important; align-items: center !important; gap: 8px !important; cursor: pointer; }
                
                .main-container { padding: 100px 24px 60px 24px !important; max-width: 1300px !important; margin: 0 auto !important; }
                
                .card-custom { background: #ffffff !important; border: 1px solid #e2e8f0 !important; border-radius: 16px !important; padding: 2rem !important; margin-bottom: 2rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important; }
                .card-header-custom { font-weight: 800; color: #0f172a; font-size: 1.25rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 10px; border-bottom: 2px solid #f1f5f9; padding-bottom: 1rem; }
                
                .form-label-custom { font-size: 0.8rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: block; }
                .form-control-light { background-color: #f8fafc; border: 1px solid #cbd5e1; color: #0f172a; border-radius: 8px; padding: 0.7rem 1rem; font-size: 0.9rem; font-weight: 600; width: 100%; transition: 0.2s; outline: none; }
                .form-control-light:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15); background-color: #ffffff; }
                
                .table-custom { width: 100%; border-collapse: separate; border-spacing: 0; }
                .table-custom th { background-color: #f1f5f9; color: #475569; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; padding: 1rem; border-bottom: 2px solid #e2e8f0; white-space: nowrap; text-align: center; }
                .table-custom td { padding: 0.8rem 0.5rem; vertical-align: middle; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; color: #0f172a; font-weight: 500; }
                .table-custom tr:hover td { background-color: #f8fafc; }
                
                .input-sm { padding: 0.5rem; font-size: 0.85rem; border-radius: 6px; }
                
                .btn-submit { background: #3b82f6; color: #fff; border: none; border-radius: 8px; font-weight: 800; padding: 0.8rem 2.5rem; transition: 0.3s; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2); width: 100%; font-size: 1.1rem; }
                .btn-submit:hover { background: #2563eb; transform: translateY(-2px); box-shadow: 0 6px 12px rgba(59, 130, 246, 0.3); }
                
                .btn-add-row { background: #f1f5f9; color: #3b82f6; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 0.5rem 1rem; font-weight: 700; transition: 0.2s; width: 100%; margin-top: 1rem;}
                .btn-add-row:hover { background: #e2e8f0; border-color: #3b82f6; }
            `}</style>

            {/* NAVBAR */}
            <nav className="dashboard-navbar">
                <div className="brand-logo" onClick={() => navigate('/maintenance-hub')}>
                    <i className="bi bi-arrow-left-circle text-muted me-2" style={{fontSize: '1.2rem', transition: '0.2s', color: '#64748b'}}></i> 
                    <i className="bi bi-gear-wide-connected"></i> Machine History Card
                </div>
                <div>
                    <span style={{fontWeight: 800, color: '#64748b', fontSize: '0.9rem'}}>Doc No: AOT-F-MM-02</span>
                </div>
            </nav>

            <div className="main-container">
                
                {/* 🌟 STEP 1: MACHINE DETAILS 🌟 */}
                <div className="card-custom">
                    <div className="card-header-custom">
                        <i className="bi bi-info-square text-primary"></i> Machine Details
                    </div>
                    <div className="row g-4">
                        <div className="col-md-6">
                            <label className="form-label-custom">Machine Name</label>
                            <input type="text" className="form-control-light" name="machineName" value={machineDetails.machineName} onChange={handleDetailChange} placeholder="Enter machine name" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label-custom">Machine No.</label>
                            <input type="text" className="form-control-light text-primary font-monospace" name="machineNo" value={machineDetails.machineNo} onChange={handleDetailChange} placeholder="e.g. MC-001" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label-custom">Machine Specs</label>
                            <input type="text" className="form-control-light" name="machineSpecs" value={machineDetails.machineSpecs} onChange={handleDetailChange} placeholder="e.g. 250 Ton Capacity" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label-custom">Location</label>
                            <input type="text" className="form-control-light" name="location" value={machineDetails.location} onChange={handleDetailChange} placeholder="e.g. Press Shop Line 1" />
                        </div>
                    </div>
                </div>

                {/* 🌟 STEP 2: HISTORY TABLE 🌟 */}
                <div className="card-custom p-0 overflow-hidden">
                    <div className="card-header-custom mx-4 mt-4 border-0 mb-0">
                        <i className="bi bi-tools text-primary"></i> Maintenance History Log
                    </div>
                    <div className="table-responsive px-4 pb-4">
                        <table className="table-custom">
                            <thead>
                                <tr>
                                    <th width="5%">Sr.</th>
                                    <th width="12%">Date</th>
                                    <th width="25%">Problem</th>
                                    <th width="25%">Action Taken</th>
                                    <th width="10%">4M Update?</th>
                                    <th width="10%">Signature</th>
                                    <th width="13%">Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historyData.map((row, index) => (
                                    <tr key={row.id}>
                                        <td className="text-center text-muted fw-bold">{index + 1}</td>
                                        <td>
                                            <input type="date" className="form-control-light input-sm" 
                                                value={row.date} onChange={(e) => handleRowChange(row.id, 'date', e.target.value)} 
                                            />
                                        </td>
                                        <td>
                                            <textarea className="form-control-light input-sm" rows="1"
                                                placeholder="Describe issue..." 
                                                value={row.problem} onChange={(e) => handleRowChange(row.id, 'problem', e.target.value)} 
                                            />
                                        </td>
                                        <td>
                                            <textarea className="form-control-light input-sm" rows="1"
                                                placeholder="Actions performed..." 
                                                value={row.actionTaken} onChange={(e) => handleRowChange(row.id, 'actionTaken', e.target.value)} 
                                            />
                                        </td>
                                        <td>
                                            <select className="form-control-light input-sm" 
                                                value={row.update4M} onChange={(e) => handleRowChange(row.id, 'update4M', e.target.value)} >
                                                <option value="">--</option>
                                                <option value="Y">Y (Yes)</option>
                                                <option value="N">N (No)</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input type="text" className="form-control-light input-sm font-monospace text-center" 
                                                placeholder="Sign" 
                                                value={row.signature} onChange={(e) => handleRowChange(row.id, 'signature', e.target.value)} 
                                            />
                                        </td>
                                        <td>
                                            <input type="text" className="form-control-light input-sm" 
                                                placeholder="Any remarks" 
                                                value={row.remarks} onChange={(e) => handleRowChange(row.id, 'remarks', e.target.value)} 
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className="btn-add-row" onClick={addRow}>
                            <i className="bi bi-plus-circle-dotted me-2"></i> Add New Record
                        </button>
                    </div>
                </div>

                {/* 🌟 STEP 3: SIGNATURES & SUBMIT 🌟 */}
                <div className="card-custom">
                    <div className="row g-4 align-items-end">
                        <div className="col-md-4">
                            <label className="form-label-custom">Prepared By</label>
                            <input type="text" className="form-control-light font-monospace text-primary" 
                                placeholder="E-Sign / Name" 
                                value={signatures.preparedBy} onChange={(e) => setSignatures({...signatures, preparedBy: e.target.value})} 
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label-custom">Approved By</label>
                            <input type="text" className="form-control-light font-monospace text-success" 
                                placeholder="E-Sign / Name" 
                                value={signatures.approvedBy} onChange={(e) => setSignatures({...signatures, approvedBy: e.target.value})} 
                            />
                        </div>
                        <div className="col-md-4 text-end">
                            <button className="btn-submit" onClick={handleSubmit}>
                                <i className="bi bi-save2-fill me-2"></i> Save History Card
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MachineHistoryCard;