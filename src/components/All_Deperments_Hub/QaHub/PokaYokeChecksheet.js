import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 🔥 IMAGE & DETAILED HINDI SOP DATABASE 🔥
const sopDatabase = {
    1: { 
        titleEng: 'Air Pressure Switch', 
        titleHin: 'एयर प्रेशर स्विच की जांच', 
        methodHin: '१. मशीन वायु दाब स्विच चैक करें!\n२. हैंड वाल्व बंद करें! मशीन चला कर देखें! मशीन चल जाती है?\n३. यदि हाँ, मेंटेनेंस को सूचित करें! सही कराये।\n४. अगर मशीन ना चले तो Poka Yoke सत्यापन पूर्ण हो चूका है।', 
        imgOk: '/image/presseure.jpeg', 
        imgNg: '/image/perrsure 1.jpeg' 
    },
    2: { 
        titleEng: 'Photo Guard Sensor', 
        titleHin: 'फोटो गार्ड सेंसर की जांच', 
        methodHin: '१. फोटो गार्ड सेंसर वेरिफ़ाई करें।\n२. फोटो गार्ड सेंसर के बीच हाथ रखें। मशीन चलाएं, मशीन चलती है?\n३. यदि हाँ, मेंटेनेंस को सूचित करें! सही कराये।\n४. अगर मशीन ना चले तो Poka Yoke सत्यापन पूर्ण हो चूका है।', 
        imgOk: '/image/senser 2.jpeg', 
        imgNg: '/image/senser.1.jpeg' 
    },
    3: { 
        titleEng: 'Grease Sensor', 
        titleHin: 'ग्रीस सेंसर लेवल', 
        methodHin: '१. मशीन ग्रीस सेंसर चेक करें।\n२. नियंत्रक द्वारा tempreture low सेट करें। फिर cycle चलाएं, मशीन चलती है?\n३. यदि हाँ, मेंटेनेंस को सूचित करें! सही कराये।\n४. अगर मशीन ना चले तो Poka Yoke सत्यापन पूर्ण हो चूका है।', 
        imgOk: '/image/grece2.jpeg', 
        imgNg: '/image/grece.jpeg' 
    },
    4: { 
        titleEng: 'Emergency Push Button', 
        titleHin: 'इमरजेंसी पुश बटन', 
        methodHin: '१. आपातकालीन पुश बटन सत्यापित करें।\n२. आपातकालीन पुश बटन दबाएँ। मशीन चला कर देखें! मशीन चल जाती है?\n३. यदि हाँ, मेंटेनेंस को सूचित करें! सही कराये।\n४. अगर मशीन ना चले तो Poka Yoke सत्यापन पूर्ण हो चूका है।', 
        imgOk: '/image/button emg 1.jpeg', 
        imgNg: '/image/button emg.jpeg' 
    },
    5: { 
        titleEng: 'TDC Limit Switch', 
        titleHin: 'TDC लिमिट स्विच', 
        methodHin: '१. TDC लिमिट स्विच ऑफसेट करें, साइकिल चलाएं। क्या मशीन चली?\n२. यदि हाँ, तो मशीन रोकें और Poka Yoke को सही करने के लिए मेंटेनेंस को सूचित करें।\n३. अगर मशीन ना चले तो Poka Yoke सत्यापन पूर्ण हो चूका है।', 
        imgOk: '/image/Tid.jpeg', 
        imgNg: '/image/worng tid.jpeg' 
    }
};

const PokaYokeChecksheet = () => {
    const navigate = useNavigate();

    // --- STATE MANAGEMENT ---
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedPlant, setSelectedPlant] = useState('');
    const [selectedMachine, setSelectedMachine] = useState('');
    const [machineList, setMachineList] = useState([]);
    
    // MODAL STATE
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [currentSop, setCurrentSop] = useState(null);

    // 🔥 DYNAMIC MACHINE GENERATION BASED ON PLANT 🔥
    useEffect(() => {
        if (selectedPlant === 'Plant 1') {
            const p1 = Array.from({ length: 57 }, (_, i) => `PP-${String(i + 1).padStart(2, '0')}`);
            setMachineList(p1);
            setSelectedMachine('');
        } else if (selectedPlant === 'Plant 2') {
            const p2 = Array.from({ length: 49 }, (_, i) => `PP-${String(i + 1).padStart(2, '0')}`);
            setMachineList(p2);
            setSelectedMachine('');
        } else {
            setMachineList([]);
        }
    }, [selectedPlant]);

    // --- POKA YOKE CHECKLIST DATA ---
    const initialChecks = [
        { id: 1, detailEng: 'Air Pressure switch', detailHin: 'एयर प्रेशर स्विच', method: 'BY HAND OPERATED', status: '', remarks: '' },
        { id: 2, detailEng: 'Photo Guard sensor', detailHin: 'फोटो गार्ड सेंसर', method: 'CHECKED BY HAND', status: '', remarks: '' },
        { id: 3, detailEng: 'Grease sensor', detailHin: 'ग्रीस सेंसर', method: 'VISUAL CHECK', status: '', remarks: '' },
        { id: 4, detailEng: 'Emergency Push Button', detailHin: 'इमरजेंसी पुश बटन', method: 'BY HAND OPERATED', status: '', remarks: '' },
        { id: 5, detailEng: 'TDC limit switch', detailHin: 'TDC लिमिट स्विच', method: 'VISUAL CHECK', status: '', remarks: '' },
    ];

    const [checklist, setChecklist] = useState(initialChecks);
    const [signatures, setSignatures] = useState({ checkedBy: '', verifiedBy: '' });

    // --- HANDLERS ---
    const handleStatusChange = (id, newStatus) => {
        setChecklist(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    };

    const handleRemarkChange = (id, text) => {
        setChecklist(prev => prev.map(item => item.id === id ? { ...item, remarks: text } : item));
    };

    const openSopModal = (id) => {
        setCurrentSop(sopDatabase[id]);
        setShowInfoModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedPlant || !selectedMachine) {
            alert("⚠️ Please select both Plant and Machine No.");
            return;
        }
        
        const isAllChecked = checklist.every(item => item.status !== '');
        if (!isAllChecked) {
            alert("⚠️ Please complete all OK/NG checks before saving.");
            return;
        }

        console.log("Saving Poka Yoke Record:", { selectedDate, selectedPlant, selectedMachine, checklist, signatures });
        alert("✅ Daily Poka Yoke Checksheet successfully saved!");
        navigate('/qa-hub'); 
    };

    return (
        <div className="poka-yoke-wrapper">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            
            <style>{`
                .poka-yoke-wrapper { position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; min-height: 100vh !important; background-color: #f8fafc !important; z-index: 9999 !important; overflow-x: hidden !important; font-family: 'Inter', sans-serif !important; }
                .dashboard-navbar { position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 70px !important; background-color: #ffffff !important; border-bottom: 1px solid #e2e8f0 !important; z-index: 10000 !important; display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 0 2rem !important; box-shadow: 0 2px 10px rgba(0,0,0,0.05) !important; }
                .brand-logo { font-weight: 900 !important; color: #10b981 !important; font-size: 1.4rem !important; display: flex !important; align-items: center !important; gap: 8px !important; cursor: pointer; }
                .main-container { padding: 100px 24px 60px 24px !important; max-width: 1200px !important; margin: 0 auto !important; }
                .card-custom { background: #ffffff !important; border: 1px solid #e2e8f0 !important; border-radius: 16px !important; padding: 2rem !important; margin-bottom: 2rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important; }
                .card-header-custom { font-weight: 800; color: #0f172a; font-size: 1.25rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 10px; border-bottom: 2px solid #f1f5f9; padding-bottom: 1rem; }
                .form-label-custom { font-size: 0.8rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: block; }
                .form-control-light { background-color: #f8fafc; border: 1px solid #cbd5e1; color: #0f172a; border-radius: 8px; padding: 0.7rem 1rem; font-size: 0.9rem; font-weight: 600; width: 100%; transition: 0.2s; outline: none; }
                .form-control-light:focus { border-color: #10b981; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15); background-color: #ffffff; }
                .table-custom { width: 100%; border-collapse: separate; border-spacing: 0; }
                .table-custom th { background-color: #f1f5f9; color: #475569; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; padding: 1rem; border-bottom: 2px solid #e2e8f0; white-space: nowrap; }
                .table-custom td { padding: 0.8rem 1rem; vertical-align: middle; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #0f172a; font-weight: 600; }
                .btn-toggle { padding: 0.4rem 1rem; border-radius: 6px; font-weight: 800; font-size: 0.85rem; transition: 0.2s; cursor: pointer; border: 1px solid #cbd5e1; background: #fff; color: #64748b; }
                .btn-toggle.ok { background: #d1fae5; color: #059669; border-color: #10b981; }
                .btn-toggle.ng { background: #fee2e2; color: #e11d48; border-color: #ef4444; }
                .btn-info-icon { background: #e0f2fe; color: #0284c7; border: none; padding: 6px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: 0.2s; }
                .btn-info-icon:hover { background: #bae6fd; transform: scale(1.05); }
                .btn-submit { background: #10b981; color: #fff; border: none; border-radius: 8px; font-weight: 800; padding: 0.8rem 2.5rem; transition: 0.3s; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2); width: 100%; font-size: 1.1rem; }
                .btn-submit:hover { background: #059669; transform: translateY(-2px); box-shadow: 0 6px 12px rgba(16, 185, 129, 0.3); }
                
                /* Modal Styling */
                .modal-light-custom .modal-content { background-color: #ffffff; border: none; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
                .img-container { width: 100%; height: 250px; background: #f1f5f9; border-radius: 8px; overflow: hidden; display: flex; justify-content: center; align-items: center; margin-top: 10px; }
                .img-container img { max-width: 100%; max-height: 100%; object-fit: contain; }
                .ok-box { border: 2px solid #10b981; padding: 15px; border-radius: 12px; background: #f0fdf4; height: 100%;}
                .ng-box { border: 2px solid #ef4444; padding: 15px; border-radius: 12px; background: #fef2f2; height: 100%;}
            `}</style>

            {/* 🔥 IMAGE SOP MODAL 🔥 */}
            {showInfoModal && currentSop && (
                <div className="modal fade show d-block" style={{backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(5px)'}} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-xl">
                        <div className="modal-content modal-light-custom">
                            <div className="modal-header border-bottom-0 pb-0">
                                <h4 className="modal-title fw-bold text-dark">
                                    {currentSop.titleEng} <span className="text-primary">({currentSop.titleHin})</span>
                                </h4>
                                <button type="button" className="btn-close" onClick={() => setShowInfoModal(false)}></button>
                            </div>
                            <div className="modal-body pt-3">
                                {/* 🔥 HINDI INSTRUCTIONS RENDERED MULTI-LINE 🔥 */}
                                <div className="mb-4 p-3 bg-light rounded" style={{borderLeft: '4px solid #3b82f6'}}>
                                    <div className="fw-bold text-primary mb-2"><i className="bi bi-info-circle-fill me-2"></i>निर्देश (Instructions):</div>
                                    <div className="text-dark fw-bold" style={{whiteSpace: 'pre-line', lineHeight: '1.8', fontSize: '1rem'}}>
                                        {currentSop.methodHin}
                                    </div>
                                </div>
                                
                                <div className="row g-4">
                                    {/* OK CONDITION */}
                                    <div className="col-md-6">
                                        <div className="ok-box">
                                            <h5 className="text-success fw-bold text-center"><i className="bi bi-check-circle-fill me-2"></i> सही स्थिति (OK Condition)</h5>
                                            <div className="img-container">
                                                <img src={currentSop.imgOk} alt="OK Condition" onError={(e) => e.target.src='https://placehold.co/400x250/d1fae5/059669?text=Image+Not+Found'} />
                                            </div>
                                        </div>
                                    </div>
                                    {/* NG CONDITION */}
                                    <div className="col-md-6">
                                        <div className="ng-box">
                                            <h5 className="text-danger fw-bold text-center"><i className="bi bi-x-circle-fill me-2"></i> गलत स्थिति (NG Condition)</h5>
                                            <div className="img-container">
                                                <img src={currentSop.imgNg} alt="NG Condition" onError={(e) => e.target.src='https://placehold.co/400x250/fee2e2/e11d48?text=Image+Not+Found'} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-0 pt-0">
                                <button type="button" className="btn btn-secondary fw-bold px-4" onClick={() => setShowInfoModal(false)}>Close (बंद करें)</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* NAVBAR */}
            <nav className="dashboard-navbar">
                <div className="brand-logo" onClick={() => navigate('/qa-hub')}>
                    <i className="bi bi-arrow-left-circle text-muted me-2" style={{fontSize: '1.2rem', transition: '0.2s', color: '#64748b'}}></i> 
                    <i className="bi bi-shield-check"></i> Poka Yoke Monitoring
                </div>
                <div>
                    <span style={{fontWeight: 800, color: '#64748b', fontSize: '0.9rem', marginRight: '15px'}}>Doc No: AOT-F-QC-07A</span>
                    <span className="badge bg-success bg-opacity-25 text-success border border-success rounded-pill px-3 py-2">Rev: 01</span>
                </div>
            </nav>

            <div className="main-container">
                
                {/* 🌟 STEP 1: CONTEXT FILTERS 🌟 */}
                <div className="card-custom">
                    <div className="card-header-custom">
                        <i className="bi bi-sliders text-success"></i> Plant & Machine Selection
                    </div>
                    <div className="row g-4 align-items-end">
                        <div className="col-md-4">
                            <label className="form-label-custom">Date (तारीख)</label>
                            <input type="date" className="form-control-light text-success" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label-custom">Select Plant (प्लांट चुनें)</label>
                            <select className="form-control-light" value={selectedPlant} onChange={(e) => setSelectedPlant(e.target.value)}>
                                <option value="">Choose Plant...</option>
                                <option value="Plant 1">Plant 1 (57 Machines)</option>
                                <option value="Plant 2">Plant 2 (49 Machines)</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label-custom">M/C No. (मशीन नंबर)</label>
                            <select className="form-control-light font-monospace text-primary" value={selectedMachine} onChange={(e) => setSelectedMachine(e.target.value)} disabled={!selectedPlant}>
                                <option value="">Select Machine...</option>
                                {machineList.map((mc, i) => (
                                    <option key={i} value={mc}>{mc}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* 🌟 STEP 2: CHECKLIST TABLE 🌟 */}
                {selectedMachine && (
                    <div className="card-custom p-0 overflow-hidden">
                        <div className="card-header-custom mx-4 mt-4">
                            <i className="bi bi-ui-checks-grid text-success"></i> Daily Check Parameters (पैरामीटर)
                        </div>
                        <div className="table-responsive px-4 pb-4">
                            <table className="table-custom">
                                <thead>
                                    <tr>
                                        <th width="5%" className="text-center">S.No.</th>
                                        <th width="25%">Poka Yoke Detail</th>
                                        <th width="20%">Checking Method</th>
                                        <th width="15%" className="text-center">Reference / SOP</th>
                                        <th width="20%" className="text-center">OK / NG (ü ∕ x)</th>
                                        <th width="15%">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {checklist.map((item) => (
                                        <tr key={item.id}>
                                            <td className="text-center text-muted fw-bold">{item.id}</td>
                                            <td>
                                                <div style={{fontWeight: 800, color: '#0f172a'}}>{item.detailEng}</div>
                                                <div style={{fontSize: '0.8rem', color: '#64748b', marginTop: '2px'}}>{item.detailHin}</div>
                                            </td>
                                            <td><span className="badge bg-light text-dark border px-2 py-1">{item.method}</span></td>
                                            <td className="text-center">
                                                {/* 🔥 INFO BUTTON FOR IMAGES & HINDI TEXT 🔥 */}
                                                <button className="btn-info-icon" onClick={() => openSopModal(item.id)}>
                                                    <i className="bi bi-journal-text me-1"></i> SOP View
                                                </button>
                                            </td>
                                            <td className="text-center">
                                                <div className="d-flex justify-content-center gap-2">
                                                    <button 
                                                        className={`btn-toggle ${item.status === 'OK' ? 'ok' : ''}`}
                                                        onClick={() => handleStatusChange(item.id, 'OK')}
                                                    >
                                                        <i className="bi bi-check-circle-fill me-1"></i> OK
                                                    </button>
                                                    <button 
                                                        className={`btn-toggle ${item.status === 'NG' ? 'ng' : ''}`}
                                                        onClick={() => handleStatusChange(item.id, 'NG')}
                                                    >
                                                        <i className="bi bi-x-circle-fill me-1"></i> NG
                                                    </button>
                                                </div>
                                            </td>
                                            <td>
                                                <input type="text" className="form-control-light input-sm" 
                                                    placeholder="Add remark..." 
                                                    value={item.remarks} onChange={(e) => handleRemarkChange(item.id, e.target.value)} 
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 🌟 STEP 3: SIGNATURES & SUBMIT 🌟 */}
                {selectedMachine && (
                    <div className="card-custom">
                        <div className="row g-4 align-items-end">
                            <div className="col-md-4">
                                <label className="form-label-custom">Checked By (Maintenance Person)</label>
                                <input type="text" className="form-control-light font-monospace text-primary" 
                                    placeholder="Name / Sign" 
                                    value={signatures.checkedBy} onChange={(e) => setSignatures({...signatures, checkedBy: e.target.value})} 
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label-custom">Verified By (Production Engineer)</label>
                                <input type="text" className="form-control-light font-monospace text-success" 
                                    placeholder="Name / Sign" 
                                    value={signatures.verifiedBy} onChange={(e) => setSignatures({...signatures, verifiedBy: e.target.value})} 
                                />
                            </div>
                            <div className="col-md-4 text-end">
                                <button className="btn-submit" onClick={handleSubmit}>
                                    <i className="bi bi-cloud-arrow-up-fill me-2"></i> Save Checksheet
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default PokaYokeChecksheet;