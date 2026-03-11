import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InductionTrainingForm = () => {
    const navigate = useNavigate();

    // --- EMPLOYEE DETAILS STATE ---
    const [empDetails, setEmpDetails] = useState({
        name: '',
        department: '',
        designation: '',
        dateOfJoining: '',
        deptIncharge: ''
    });

    // --- TRAINING TOPICS (From PDF) ---
    const initialTopics = [
        { id: 1, topic: 'Introduction to Company Profile', resp: 'HR', date: '', time: '', sign: '' },
        { id: 2, topic: 'Organisation Structure', resp: 'HR', date: '', time: '', sign: '' },
        { id: 3, topic: 'Policies - Quality, Safety, Leave, Travel, In-out, Mediclaim etc.', resp: 'HR', date: '', time: '', sign: '' },
        { id: 4, topic: 'Human Resource (Training Procedure)', resp: 'HR', date: '', time: '', sign: '' },
        { id: 5, topic: 'Advance Product Quality Planning Process and Marketing', resp: 'New Product Development', date: '', time: '', sign: '' },
        { id: 6, topic: 'Production Process', resp: 'Production', date: '', time: '', sign: '' },
        { id: 7, topic: 'QA & MR Processes', resp: 'QA & MR', date: '', time: '', sign: '' },
        { id: 8, topic: 'Purchasing Process', resp: 'Purchase', date: '', time: '', sign: '' },
        { id: 9, topic: 'Store & Dispatch', resp: 'Store & Dispatch', date: '', time: '', sign: '' },
        { id: 10, topic: 'Machine Maintenance', resp: 'Machine Maintenance', date: '', time: '', sign: '' },
        { id: 11, topic: 'Tool Maintenance', resp: 'Tool Room (Die Maintenance)', date: '', time: '', sign: '' },
    ];

    const [trainingData, setTrainingData] = useState(initialTopics);
    const [signatures, setSignatures] = useState({ employee: '', hrIncharge: '' });

    // --- HANDLERS ---
    const handleEmpDetailChange = (e) => {
        setEmpDetails({ ...empDetails, [e.target.name]: e.target.value });
    };

    const handleRowChange = (id, field, value) => {
        setTrainingData(prev => 
            prev.map(row => row.id === id ? { ...row, [field]: value } : row)
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validation check (Basic)
        if (!empDetails.name || !empDetails.dateOfJoining) {
            alert("⚠️ Please fill in at least the Employee Name and Date of Joining.");
            return;
        }
        
        console.log("Submitting Induction Data:", { empDetails, trainingData, signatures });
        alert("✅ Induction Training Form successfully saved!");
        navigate('/hiring-departments'); // Go back to HR Hub
    };

    return (
        <div className="induction-page-wrapper">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            
            <style>{`
                .induction-page-wrapper {
                    position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; min-height: 100vh !important;
                    background-color: #f8fafc !important; z-index: 9999 !important; overflow-x: hidden !important; font-family: 'Inter', sans-serif !important;
                }
                
                .dashboard-navbar { 
                    position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 70px !important; 
                    background-color: #ffffff !important; border-bottom: 1px solid #e2e8f0 !important; z-index: 10000 !important; 
                    display: flex !important; align-items: center !important; justify-content: space-between !important; 
                    padding: 0 2rem !important; box-shadow: 0 2px 10px rgba(0,0,0,0.05) !important;
                }
                
                .brand-logo { font-weight: 900 !important; color: #10b981 !important; font-size: 1.4rem !important; display: flex !important; align-items: center !important; gap: 8px !important; cursor: pointer; }
                
                .main-container { padding: 100px 24px 60px 24px !important; max-width: 1200px !important; margin: 0 auto !important; }
                
                .card-custom { background: #ffffff !important; border: 1px solid #e2e8f0 !important; border-radius: 16px !important; padding: 2rem !important; margin-bottom: 2rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important; }
                .card-header-custom { font-weight: 800; color: #0f172a; font-size: 1.25rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 10px; border-bottom: 2px solid #f1f5f9; padding-bottom: 1rem; }
                
                .form-label-custom { font-size: 0.8rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: block; }
                .form-control-light { background-color: #f8fafc; border: 1px solid #cbd5e1; color: #0f172a; border-radius: 8px; padding: 0.7rem 1rem; font-size: 0.9rem; font-weight: 600; width: 100%; transition: 0.2s; outline: none; }
                .form-control-light:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15); background-color: #ffffff; }
                
                .table-custom { width: 100%; border-collapse: separate; border-spacing: 0; }
                .table-custom th { background-color: #f1f5f9; color: #475569; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; padding: 1rem; border-bottom: 2px solid #e2e8f0; white-space: nowrap; }
                .table-custom td { padding: 0.8rem 1rem; vertical-align: middle; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; color: #0f172a; font-weight: 500; }
                .table-custom tr:hover td { background-color: #f8fafc; }
                
                .input-sm { padding: 0.4rem 0.6rem; font-size: 0.85rem; border-radius: 6px; }
                
                .btn-submit { background: #10b981; color: #fff; border: none; border-radius: 8px; font-weight: 800; padding: 0.8rem 2.5rem; transition: 0.3s; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2); width: 100%; font-size: 1.1rem; }
                .btn-submit:hover { background: #059669; transform: translateY(-2px); box-shadow: 0 6px 12px rgba(16, 185, 129, 0.3); }

                @media (max-width: 768px) {
                    .table-responsive { overflow-x: auto; }
                    .main-container { padding: 90px 16px 40px 16px !important; }
                    .card-custom { padding: 1.2rem !important; }
                }
            `}</style>

            {/* NAVBAR */}
            <nav className="dashboard-navbar">
                <div className="brand-logo" onClick={() => navigate('/hiring-departments')}>
                    <i className="bi bi-arrow-left-circle text-muted me-2" style={{fontSize: '1.2rem', transition: '0.2s', color: '#64748b'}}></i> 
                    <i className="bi bi-person-bounding-box"></i> HR & Training Form
                </div>
                <div>
                    <span style={{fontWeight: 800, color: '#64748b', fontSize: '0.9rem'}}>Doc No: AOT-F-HR-13</span>
                </div>
            </nav>

            <div className="main-container">
                
                {/* 🌟 STEP 1: EMPLOYEE DETAILS CARD 🌟 */}
                <div className="card-custom">
                    <div className="card-header-custom">
                        <i className="bi bi-person-vcard text-success"></i> Employee Information
                    </div>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <label className="form-label-custom">Name of Employee</label>
                            <input type="text" className="form-control-light" name="name" value={empDetails.name} onChange={handleEmpDetailChange} placeholder="Enter full name" />
                        </div>
                        <div className="col-md-4">
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
                        <div className="col-md-4">
                            <label className="form-label-custom">Designation</label>
                            <input type="text" className="form-control-light" name="designation" value={empDetails.designation} onChange={handleEmpDetailChange} placeholder="e.g. Quality Engineer" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label-custom">Date of Joining</label>
                            <input type="date" className="form-control-light text-success" name="dateOfJoining" value={empDetails.dateOfJoining} onChange={handleEmpDetailChange} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label-custom">Name of Department Incharge</label>
                            <input type="text" className="form-control-light" name="deptIncharge" value={empDetails.deptIncharge} onChange={handleEmpDetailChange} placeholder="Incharge Name" />
                        </div>
                    </div>
                </div>

                {/* 🌟 STEP 2: INDUCTION TOPICS TABLE 🌟 */}
                <div className="card-custom p-0 overflow-hidden">
                    <div className="card-header-custom mx-4 mt-4">
                        <i className="bi bi-ui-checks text-success"></i> Induction Training Checklist
                    </div>
                    <div className="table-responsive px-4 pb-4">
                        <table className="table-custom">
                            <thead>
                                <tr>
                                    <th width="5%">Sr.</th>
                                    <th width="40%">Topic</th>
                                    <th width="20%">Responsibility</th>
                                    <th width="15%">Date</th>
                                    <th width="10%">Time</th>
                                    <th width="10%">Sign (Dept. I/C)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trainingData.map((row) => (
                                    <tr key={row.id}>
                                        <td className="text-center text-muted fw-bold">{row.id}</td>
                                        <td>{row.topic}</td>
                                        <td><span className="badge bg-light text-dark border p-2">{row.resp}</span></td>
                                        <td>
                                            <input type="date" className="form-control-light input-sm" 
                                                value={row.date} onChange={(e) => handleRowChange(row.id, 'date', e.target.value)} 
                                            />
                                        </td>
                                        <td>
                                            <input type="time" className="form-control-light input-sm" 
                                                value={row.time} onChange={(e) => handleRowChange(row.id, 'time', e.target.value)} 
                                            />
                                        </td>
                                        <td>
                                            <input type="text" className="form-control-light input-sm text-center font-monospace" 
                                                placeholder="Initials" 
                                                value={row.sign} onChange={(e) => handleRowChange(row.id, 'sign', e.target.value)} 
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 🌟 STEP 3: SIGNATURES & SUBMIT 🌟 */}
                <div className="card-custom">
                    <div className="row g-4 align-items-end">
                        <div className="col-md-4">
                            <label className="form-label-custom">Signature of Employee</label>
                            <input type="text" className="form-control-light font-monospace text-primary" 
                                placeholder="E-Sign / Initials" 
                                value={signatures.employee} onChange={(e) => setSignatures({...signatures, employee: e.target.value})} 
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label-custom">Approved By (HR Incharge)</label>
                            <input type="text" className="form-control-light font-monospace text-success" 
                                placeholder="E-Sign / Initials" 
                                value={signatures.hrIncharge} onChange={(e) => setSignatures({...signatures, hrIncharge: e.target.value})} 
                            />
                        </div>
                        <div className="col-md-4 text-end">
                            <button className="btn-submit" onClick={handleSubmit}>
                                <i className="bi bi-cloud-arrow-up-fill me-2"></i> Save Record
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default InductionTrainingForm;