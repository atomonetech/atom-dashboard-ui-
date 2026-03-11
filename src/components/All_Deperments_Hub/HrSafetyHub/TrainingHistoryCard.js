import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TrainingHistoryCard = () => {
    const navigate = useNavigate();

    // --- EMPLOYEE DETAILS STATE ---
    const [empDetails, setEmpDetails] = useState({
        name: '',
        empId: '',
        department: '',
        dateOfJoining: ''
    });

    // --- TRAINING HISTORY TABLE STATE ---
    const [trainingData, setTrainingData] = useState([
        { id: 1, date: '', description: '', duration: '', hours: '', sign: '' },
        { id: 2, date: '', description: '', duration: '', hours: '', sign: '' },
        { id: 3, date: '', description: '', duration: '', hours: '', sign: '' },
        { id: 4, date: '', description: '', duration: '', hours: '', sign: '' },
        { id: 5, date: '', description: '', duration: '', hours: '', sign: '' }
    ]);

    // --- HANDLERS ---
    const handleEmpDetailChange = (e) => {
        setEmpDetails({ ...empDetails, [e.target.name]: e.target.value });
    };

    const handleRowChange = (id, field, value) => {
        setTrainingData(prev => 
            prev.map(row => row.id === id ? { ...row, [field]: value } : row)
        );
    };

    const addRow = () => {
        setTrainingData([...trainingData, { 
            id: trainingData.length + 1, date: '', description: '', duration: '', hours: '', sign: '' 
        }]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!empDetails.name || !empDetails.empId) {
            alert("⚠️ Please fill in Employee Name and ID.");
            return;
        }
        console.log("Saving Training History:", { empDetails, trainingData });
        alert("✅ Training History Card successfully updated!");
        navigate('/hiring-departments'); 
    };

    return (
        <div className="history-page-wrapper">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            
            <style>{`
                .history-page-wrapper {
                    position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; min-height: 100vh !important;
                    background-color: #f8fafc !important; z-index: 9999 !important; overflow-x: hidden !important; font-family: 'Inter', sans-serif !important;
                }
                
                .dashboard-navbar { 
                    position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 70px !important; 
                    background-color: #ffffff !important; border-bottom: 1px solid #e2e8f0 !important; z-index: 10000 !important; 
                    display: flex !important; align-items: center !important; justify-content: space-between !important; 
                    padding: 0 2rem !important; box-shadow: 0 2px 10px rgba(0,0,0,0.05) !important;
                }
                
                .brand-logo { font-weight: 900 !important; color: #8b5cf6 !important; font-size: 1.4rem !important; display: flex !important; align-items: center !important; gap: 8px !important; cursor: pointer; }
                
                .main-container { padding: 100px 24px 60px 24px !important; max-width: 1200px !important; margin: 0 auto !important; }
                
                .card-custom { background: #ffffff !important; border: 1px solid #e2e8f0 !important; border-radius: 16px !important; padding: 2rem !important; margin-bottom: 2rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important; }
                .card-header-custom { font-weight: 800; color: #0f172a; font-size: 1.25rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 10px; border-bottom: 2px solid #f1f5f9; padding-bottom: 1rem; }
                
                .form-label-custom { font-size: 0.8rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: block; }
                .form-control-light { background-color: #f8fafc; border: 1px solid #cbd5e1; color: #0f172a; border-radius: 8px; padding: 0.7rem 1rem; font-size: 0.9rem; font-weight: 600; width: 100%; transition: 0.2s; outline: none; }
                .form-control-light:focus { border-color: #8b5cf6; box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15); background-color: #ffffff; }
                
                .table-custom { width: 100%; border-collapse: separate; border-spacing: 0; }
                .table-custom th { background-color: #f1f5f9; color: #475569; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; padding: 1rem; border-bottom: 2px solid #e2e8f0; white-space: nowrap; }
                .table-custom td { padding: 0.8rem 1rem; vertical-align: middle; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; color: #0f172a; font-weight: 500; }
                .table-custom tr:hover td { background-color: #f8fafc; }
                
                .input-sm { padding: 0.4rem 0.6rem; font-size: 0.85rem; border-radius: 6px; }
                
                .btn-submit { background: #8b5cf6; color: #fff; border: none; border-radius: 8px; font-weight: 800; padding: 0.8rem 2.5rem; transition: 0.3s; box-shadow: 0 4px 6px rgba(139, 92, 246, 0.2); width: 100%; font-size: 1.1rem; }
                .btn-submit:hover { background: #7c3aed; transform: translateY(-2px); box-shadow: 0 6px 12px rgba(139, 92, 246, 0.3); }
                
                .btn-add-row { background: #f1f5f9; color: #4f46e5; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 0.5rem 1rem; font-weight: 700; transition: 0.2s; width: 100%; margin-top: 1rem;}
                .btn-add-row:hover { background: #e2e8f0; border-color: #4f46e5; }
            `}</style>

            {/* NAVBAR */}
            <nav className="dashboard-navbar">
                <div className="brand-logo" onClick={() => navigate('/hiring-departments')}>
                    <i className="bi bi-arrow-left-circle text-muted me-2" style={{fontSize: '1.2rem', transition: '0.2s', color: '#64748b'}}></i> 
                    <i className="bi bi-person-vcard"></i> Training History Card
                </div>
                <div>
                    <span style={{fontWeight: 800, color: '#64748b', fontSize: '0.9rem'}}>Doc No: AOT-F-HR-12</span>
                </div>
            </nav>

            <div className="main-container">
                
                {/* 🌟 STEP 1: EMPLOYEE DETAILS 🌟 */}
                <div className="card-custom">
                    <div className="card-header-custom">
                        <i className="bi bi-person-badge text-primary"></i> Employee Information
                    </div>
                    <div className="row g-4">
                        <div className="col-md-6">
                            <label className="form-label-custom">Name of Employee</label>
                            <input type="text" className="form-control-light" name="name" value={empDetails.name} onChange={handleEmpDetailChange} placeholder="Enter full name" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label-custom">Employee Identification No.</label>
                            <input type="text" className="form-control-light text-primary font-monospace" name="empId" value={empDetails.empId} onChange={handleEmpDetailChange} placeholder="e.g. EMP-1002" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label-custom">Department</label>
                            <select className="form-control-light" name="department" value={empDetails.department} onChange={handleEmpDetailChange}>
                                <option value="">Select Dept...</option>
                                <option value="Production">Production</option>
                                <option value="Quality">Quality (QA/QC)</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Stores">Stores & Dispatch</option>
                                <option value="HR">HR & Admin</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label-custom">Date of Joining</label>
                            <input type="date" className="form-control-light text-success" name="dateOfJoining" value={empDetails.dateOfJoining} onChange={handleEmpDetailChange} />
                        </div>
                    </div>
                </div>

                {/* 🌟 STEP 2: TRAINING HISTORY TABLE 🌟 */}
                <div className="card-custom p-0 overflow-hidden">
                    <div className="card-header-custom mx-4 mt-4 border-0 mb-0">
                        <i className="bi bi-journal-check text-primary"></i> Training Records
                    </div>
                    <div className="table-responsive px-4 pb-4">
                        <table className="table-custom">
                            <thead>
                                <tr>
                                    <th width="15%">Date</th>
                                    <th width="40%">Training Description</th>
                                    <th width="15%">Duration</th>
                                    <th width="10%">No. of Hrs</th>
                                    <th width="20%">Signature (HR)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trainingData.map((row) => (
                                    <tr key={row.id}>
                                        <td>
                                            <input type="date" className="form-control-light input-sm" 
                                                value={row.date} onChange={(e) => handleRowChange(row.id, 'date', e.target.value)} 
                                            />
                                        </td>
                                        <td>
                                            <input type="text" className="form-control-light input-sm" 
                                                placeholder="Enter topic / description" 
                                                value={row.description} onChange={(e) => handleRowChange(row.id, 'description', e.target.value)} 
                                            />
                                        </td>
                                        <td>
                                            <input type="text" className="form-control-light input-sm" 
                                                placeholder="e.g. 2 Days / 1 Week" 
                                                value={row.duration} onChange={(e) => handleRowChange(row.id, 'duration', e.target.value)} 
                                            />
                                        </td>
                                        <td>
                                            <input type="number" className="form-control-light input-sm text-center" 
                                                placeholder="Hrs" 
                                                value={row.hours} onChange={(e) => handleRowChange(row.id, 'hours', e.target.value)} 
                                            />
                                        </td>
                                        <td>
                                            <input type="text" className="form-control-light input-sm font-monospace text-primary" 
                                                placeholder="HR Initials" 
                                                value={row.sign} onChange={(e) => handleRowChange(row.id, 'sign', e.target.value)} 
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className="btn-add-row" onClick={addRow}>
                            <i className="bi bi-plus-circle-dotted me-2"></i> Add New Training Entry
                        </button>
                    </div>
                </div>

                {/* 🌟 STEP 3: SUBMIT 🌟 */}
                <div className="row justify-content-end mb-5">
                    <div className="col-md-4">
                        <button className="btn-submit" onClick={handleSubmit}>
                            <i className="bi bi-floppy-fill me-2"></i> Update History Card
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TrainingHistoryCard;