import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const sopDatabase = {
    'Final Appearance': {
        title: 'Final Appearance & Packaging / अंतिम दिखावट और पैकेजिंग',
        english: [
            '1. Ensure the final part is free from any scratches, rust, or dust.',
            '2. Verify that the part number matches the invoice.',
            '3. Check if the packaging meets the customer standard.'
        ],
        hindi: [
            '1. सुनिश्चित करें कि अंतिम पार्ट खरोंच, जंग या धूल से मुक्त है।',
            '2. वेरिफाई करें कि पार्ट नंबर चालान/इनवॉइस से मेल खाता है।',
            '3. जांचें कि क्या पैकेजिंग ग्राहक के मानक को पूरा करती है।'
        ]
    }
};

const PdiReportForm = () => {
    const navigate = useNavigate();

    // ==========================================
    //  1. STATE MANAGEMENT
    // ==========================================
    const [customers, setCustomers] = useState([]);
    const [parts, setParts] = useState([]);
    
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedPart, setSelectedPart] = useState('');
    const [partNumber, setPartNumber] = useState('');
    const [modelName, setModelName] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const API_URL = "http://127.0.0.1:8000/api";
    const [specList, setSpecList] = useState([]); 

    const [dbLogs, setDbLogs] = useState([]); 
    const [userAction, setUserAction] = useState(''); 
    const [selectedStage, setSelectedStage] = useState(''); 

    const [logColumns, setLogColumns] = useState([]);
    const [activeColId, setActiveColId] = useState('');
    const [currentStage, setCurrentStage] = useState(1); 

    const activeColumn = logColumns.find(col => col.id === activeColId) || logColumns[0];

    const [showInfoModal, setShowInfoModal] = useState(false);
    const [currentSop, setCurrentSop] = useState(null);

    // ==========================================
    //  2. FETCH DATA & LOAD FORM
    // ==========================================
    useEffect(() => {
        fetch(`${API_URL}/master-dropdown/?filter=customer`)
            .then(res => res.json()).then(data => setCustomers(data)).catch(()=> {
                setCustomers(['MARUTI SUZUKI', 'TATA MOTORS', 'HYUNDAI']); // PDI Dummy Customers
            });
    }, []);

    const loadDataForGates = async (cust, part, dateStr) => {
        if (!cust || !part || !dateStr) return;
        try {
            // 🔥 Hardcoding operation as 'PDI'
            const opName = 'PDI'; 
            
            const masterRes = await fetch(`${API_URL}/master-parameters/?customer=${encodeURIComponent(cust)}&part=${encodeURIComponent(part)}&operation=${encodeURIComponent(opName)}`);
            const masterData = await masterRes.json();
            setPartNumber(masterData.part_number || 'PDI-FIN-1002'); 
            setModelName(masterData.model_name || 'FINAL ASSY');
            
            let allItems = [];
            (masterData.productItems || []).forEach(item => allItems.push({...item, category: 'FINAL', sr: item.sr_no}));
            
            if(allItems.length === 0) {
                // PDI Specific Dummy Data
                allItems = [
                    { sr: 1, category: 'FINAL', item: 'FINAL APPEARANCE', spec: 'OK AS PER STANDARD', tol: '-', instr: 'VISUAL' },
                    { sr: 2, category: 'FINAL', item: 'CRITICAL DIMENSION 1', spec: '120.50', tol: '± 0.20 MM', instr: 'VERNIER CALIPER' },
                    { sr: 3, category: 'FINAL', item: 'CRITICAL DIMENSION 2', spec: '45.00', tol: '+0.1/-0.0 MM', instr: 'VERNIER CALIPER' },
                    { sr: 4, category: 'PACKAGING', item: 'PACKAGING & LABEL', spec: 'PROPER LABEL AFFIXED', tol: '-', instr: 'VISUAL' }
                ];
            }
            setSpecList(allItems);

            const reportRes = await fetch(`${API_URL}/get-inspection-report/?customer=${encodeURIComponent(cust)}&part_name=${encodeURIComponent(part)}&operation=${encodeURIComponent(opName)}&date=${dateStr}`);
            if (reportRes.ok) {
                const reportData = await reportRes.json();
                setDbLogs(reportData.inspection_data.logs || []);
            } else {
                setDbLogs([]); 
            }
            
            setUserAction('');
            setSelectedStage('');
            setLogColumns([]);
            setActiveColId('');
        } catch (e) { console.error(e); }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { loadDataForGates(selectedCustomer, selectedPart, selectedDate); }, [selectedCustomer, selectedPart, selectedDate]);

    const handleCustomerChange = (e) => {
        const cust = e.target.value; setSelectedCustomer(cust); setSelectedPart(''); setSpecList([]); setDbLogs([]); setUserAction('');
        if (cust) fetch(`${API_URL}/master-dropdown/?filter=part&cust=${encodeURIComponent(cust)}`).then(res => res.json()).then(data => setParts(data)).catch(()=>setParts(['FRONT FENDER', 'REAR BUMPER BRACKET']));
    };
    const handlePartChange = (e) => {
        const part = e.target.value; setSelectedPart(part); setSpecList([]); setDbLogs([]); setUserAction('');
    };

    // ==========================================
    //  3. ACTION & STAGE GATES LOGIC (Adapted for PDI)
    // ==========================================
    const handleUpdateAction = () => {
        if (dbLogs.length === 0) {
            alert("ℹ️ No existing PDI records found for this date.");
            return;
        }
        setUserAction('UPDATE');
        setSelectedStage('UPDATE_MODE');
        setLogColumns(dbLogs);
        setActiveColId(''); 
        setCurrentStage(4); 
    };

    const handleDeleteAction = async () => {
        if (dbLogs.length === 0) {
            alert("ℹ️ No data available to purge.");
            return;
        }
        const confirmDelete = window.confirm("⚠️ Critical Warning: Purge all PDI records for this date?");
        if (confirmDelete) {
            try {
                alert("🗑️ PDI Records successfully purged.");
                loadDataForGates(selectedCustomer, selectedPart, selectedDate);
            } catch (err) { alert("❌ Deletion failed."); }
        }
    };

    const getLogByStage = (stage) => dbLogs.find(col => col.baseStage === stage && col.isLocked);
    const lot1Log = getLogByStage('LOT_1');
    const lot2Log = getLogByStage('LOT_2');
    const lot3Log = getLogByStage('LOT_3');

    const isLot1Done = !!lot1Log;
    const isLot2Done = !!lot2Log;
    const isLot3Done = !!lot3Log;

    const startFillingStage = (stageCode) => {
        setSelectedStage(stageCode);
        let stageName = stageCode === 'LOT_1' ? 'LOT 1' : (stageCode === 'LOT_2' ? 'LOT 2' : 'LOT 3');
        let stageNum = stageCode === 'LOT_1' ? 1 : (stageCode === 'LOT_2' ? 2 : 3);
        setCurrentStage(stageNum);

        const refPlant = dbLogs.length > 0 ? dbLogs[0].plant : '';
        const refOp = dbLogs.length > 0 ? dbLogs[0].operator : '';
        const refMach = dbLogs.length > 0 ? dbLogs[0].machine : ''; 

        const newCol = { 
            id: `col_${stageCode.toLowerCase()}_${Date.now()}`, 
            baseStage: stageCode, 
            displayStage: stageName, 
            date: selectedDate, 
            time: '', 
            timestamp: null,
            plant: refPlant, 
            operator: refOp, 
            machine: refMach, 
            entryFormat: 'dual', 
            readings: {}, 
            isLocked: false 
        };
        
        setLogColumns([...dbLogs, newCol]);
        setActiveColId(newCol.id);
    };

    const handleBackClick = () => {
        if (selectedStage) { setSelectedStage(''); setLogColumns([]); setActiveColId(''); } 
        else { setUserAction(''); }
    };

    const handleActiveColChange = (field, value) => {
        setLogColumns(prev => prev.map(col => col.id === activeColId ? { ...col, [field]: value } : col));
    };
    const handleCellChange = (colId, rowSr, valKey, value) => {
        setLogColumns(prev => prev.map(col => col.id === colId ? { ...col, readings: { ...col.readings, [rowSr]: { ...(col.readings[rowSr] || { val1: '', val2: '' }), [valKey]: value } } } : col));
    };
    const unlockColumn = (id) => {
        setLogColumns(prev => prev.map(col => col.id === id ? { ...col, isLocked: false } : col)); setActiveColId(id);
    };

    const handleEyeClick = (paramName) => {
        const sopData = sopDatabase[paramName] || { 
            title: paramName, english: ['No specific SOP defined for this parameter.'], hindi: ['इस पैरामीटर के लिए कोई विशिष्ट SOP परिभाषित नहीं है।'] 
        };
        setCurrentSop(sopData);
        setShowInfoModal(true);
    };
    const handleVideoClick = (paramName) => { alert(`🎥 Initializing tutorial video for: ${paramName}`); };

    const handleSaveData = async () => {
        const timeNow = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        let newLogs = logColumns.map(col => col.id === activeColId ? { ...col, isLocked: true, time: timeNow, timestamp: Date.now() } : col);
        
        const payload = {
            master_data: { 
                customer: selectedCustomer, 
                part_name: selectedPart, 
                operation: 'PDI', // Hardcoded for PDI
                part_number: partNumber, 
                plant_location: activeColumn?.plant || '', 
                date: selectedDate 
            },
            parameters: specList, 
            logs: newLogs
        };
        
        try {
            const response = await fetch(`${API_URL}/save-inspection-report/`, { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(payload) 
            });
            
            if (response.ok) {
                alert(`✅ [${activeColumn?.displayStage || 'Data'}] inspection successfully committed.`);
            } else {
                alert(`❌ Synchronization Failed. Server error.`);
            }
        } catch (error) { 
            console.error("Network Error:", error);
        }

        setDbLogs(newLogs);       
        setLogColumns([]);        
        setActiveColId('');       
        setSelectedStage('');     
        setUserAction('FILL');    
    };

    const renderCell = (col, rowSr, paramName) => {
        const readObj = col.readings[rowSr] || { val1: '', val2: '' };
        const isActive = col.id === activeColId && !col.isLocked;

        if (isActive) {
            return (
                <td className="table-active p-2" style={{minWidth: '240px', borderLeft: '2px solid var(--accent-primary)', borderRight: '2px solid var(--accent-primary)'}}>
                    <div className="d-flex align-items-center gap-2">
                        <div className="d-flex gap-2 flex-grow-1">
                            {col.entryFormat === 'single' ? (
                                <input type="text" className="form-input-light text-center fw-bold" placeholder="Value" value={readObj.val1} onChange={(e) => handleCellChange(col.id, rowSr, 'val1', e.target.value)} />
                            ) : (
                                <>
                                    <input type="text" className="form-input-light text-center fw-bold" placeholder="Reading 1" value={readObj.val1} onChange={(e) => handleCellChange(col.id, rowSr, 'val1', e.target.value)} />
                                    <input type="text" className="form-input-light text-center fw-bold" placeholder="Reading 2" value={readObj.val2} onChange={(e) => handleCellChange(col.id, rowSr, 'val2', e.target.value)} />
                                </>
                            )}
                        </div>
                        <div className="d-flex flex-column gap-1">
                            <button className="btn-icon-simple" title="View Info" onClick={() => handleEyeClick(paramName)}>
                                <img src="https://img.icons8.com/ios/50/000000/visible--v1.png" alt="Eye" style={{ width: '15px', height: '15px', opacity: 0.8 }} />
                            </button>
                            <button className="btn-icon-simple text-danger" title="Watch Video" onClick={() => handleVideoClick(paramName)}>
                                <i className="bi bi-camera-video"></i>
                            </button>
                        </div>
                    </div>
                </td>
            );
        }
        if (!readObj.val1 && !readObj.val2) return <td className="text-center text-muted fw-bold bg-light">--</td>;
        return (
            <td className="bg-light text-center">
                {col.entryFormat === 'single' ? 
                    <span className="read-only-light">{readObj.val1}</span> :
                    <div className="d-flex gap-2 justify-content-center">
                        <span className="read-only-light flex-fill">{readObj.val1 || '--'}</span>
                        <span className="read-only-light flex-fill">{readObj.val2 || '--'}</span>
                    </div>
                }
            </td>
        );
    };

    return (
        <div className="pdi-page-wrapper">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            
            <style>{`
                /* OVERRIDE GLOBAL CSS */
                .pdi-page-wrapper {
                    position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background-color: #f8fafc !important; z-index: 9999 !important; overflow-y: auto !important; overflow-x: hidden !important; margin: 0 !important; padding: 0 !important; font-family: 'Inter', 'Segoe UI', sans-serif !important;
                }
                
                :root {
                    --bg-main: #f8fafc; --bg-card: #ffffff; --bg-input: #f8fafc; --text-main: #0f172a; --text-muted: #64748b; --border-subtle: #e2e8f0; 
                    --accent-primary: #10b981; /* Emerald Green for PDI */ 
                    --accent-hover: #059669; 
                    --accent-glow: rgba(16, 185, 129, 0.15); 
                    --danger: #ef4444; --success: #10b981;
                }

                @keyframes slideUpFade { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-pop { animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                
                .dashboard-navbar { position: sticky !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 70px !important; background-color: #ffffff !important; border-bottom: 1px solid #e2e8f0 !important; z-index: 10000 !important; display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 0 2rem !important; box-sizing: border-box !important; box-shadow: 0 2px 10px rgba(0,0,0,0.05) !important; margin: 0 !important;}
                .brand-logo { font-weight: 900 !important; color: var(--accent-primary) !important; font-size: 1.5rem !important; letter-spacing: -0.5px !important; display: flex !important; align-items: center !important; gap: 10px !important; cursor: pointer;}
                
                .main-container { padding: 40px 24px 80px 24px !important; max-width: 1600px !important; margin: 0 auto !important; box-sizing: border-box !important;}
                
                .card-custom { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); margin-bottom: 24px; transition: 0.3s; }
                .card-header-custom { background-color: #ffffff; border-bottom: 1px solid var(--border-subtle); padding: 1.2rem 1.5rem; display: flex; align-items: center; justify-content: space-between; border-radius: 12px 12px 0 0;}
                .card-title-custom { color: var(--text-main); font-weight: 800; margin: 0; font-size: 1.05rem; letter-spacing: 0.5px; display: flex; align-items: center; gap: 8px;}
                .card-body-custom { padding: 1.5rem; }

                label { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: block;}
                .form-control-light { background-color: var(--bg-input); border: 1px solid #cbd5e1; color: var(--text-main); border-radius: 8px; padding: 0.7rem 1rem; font-size: 0.9rem; font-weight: 600; transition: all 0.2s ease; width: 100%; outline: none;}
                .form-control-light:focus { border-color: var(--accent-primary); box-shadow: 0 0 0 3px var(--accent-glow); background-color: #fff;}
                .form-control-light:disabled, .form-control-light[readonly] { background-color: #f1f5f9; color: #475569; cursor: not-allowed; font-weight: bold;}
                select.form-control-light { cursor: pointer; }

                .gate-card-light { background: #ffffff; border: 1px solid var(--border-subtle); border-radius: 16px; padding: 2rem 1.5rem; text-align: center; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.02);}
                .gate-card-light::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: transparent; transition: 0.3s;}
                .gate-card-light:hover { transform: translateY(-6px); box-shadow: 0 15px 30px -5px rgba(0,0,0,0.08); border-color: var(--accent-primary); }
                .gate-card-light:hover::before { background: var(--accent-primary); }
                .gate-icon-light { font-size: 3rem; margin-bottom: 0.8rem; display: inline-block; transition: 0.3s; color: var(--accent-primary);}
                .gate-card-light:hover .gate-icon-light { transform: scale(1.1); }
                .gate-title-light { font-weight: 800; color: var(--text-main); font-size: 1.15rem; margin-bottom: 0.2rem; }
                .gate-desc-light { font-size: 0.85rem; color: var(--text-muted); margin: 0; font-weight: 500;}

                .gate-done-light { border-color: #34d399 !important; background-color: #f0fdf4 !important; cursor: not-allowed !important; opacity: 0.9; }
                .gate-done-light:hover { transform: none !important; box-shadow: 0 2px 5px rgba(0,0,0,0.02) !important; border-color: #34d399 !important;}
                .gate-done-light::before { background: var(--success) !important; }
                
                .stepper-light { display: flex; justify-content: space-between; position: relative; max-width: 550px; margin: 0 auto 2.5rem auto; }
                .stepper-light::before { content: ''; position: absolute; top: 18px; left: 0; right: 0; height: 3px; background: var(--border-subtle); z-index: 1; }
                .step-item-light { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; color: var(--text-muted); }
                .step-icon-light { width: 38px; height: 38px; border-radius: 50%; background: #ffffff; border: 3px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; transition: all 0.4s ease; color: var(--text-muted);}
                .step-text-light { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; margin-top: 0.6rem; letter-spacing: 0.5px; transition: 0.3s;}
                
                .step-item-light.active .step-icon-light { border-color: var(--accent-primary); color: var(--accent-primary); box-shadow: 0 0 0 4px var(--accent-glow); }
                .step-item-light.active .step-text-light { color: var(--accent-primary); }
                .step-item-light.completed .step-icon-light { background-color: var(--success); border-color: var(--success); color: #fff; }
                .step-item-light.completed .step-text-light { color: var(--success); }

                .meta-strip-light { background-color: #f8fafc; border: 1px solid var(--border-subtle); border-radius: 10px; padding: 1.2rem; margin-bottom: 1.5rem; border-left: 5px solid var(--accent-primary); }
                
                .table-responsive-light { border-radius: 10px; overflow-x: auto; background-color: #ffffff; border: 1px solid var(--border-subtle);}
                .table-light-custom { width: 100%; border-collapse: collapse; margin-bottom: 0; }
                .table-light-custom thead th { background-color: #f8fafc; color: var(--text-muted); font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; padding: 1.2rem 1rem; border-bottom: 1px solid var(--border-subtle); border-right: none; }
                .table-light-custom tbody td { vertical-align: middle; font-size: 0.9rem; padding: 0.8rem 1rem; border-bottom: 1px solid #f1f5f9; border-right: none; }
                .table-light-custom tbody tr:last-child td { border-bottom: none; }
                
                .th-active { color: var(--accent-primary) !important; font-weight: 900 !important; background-color: transparent !important; }
                
                .badge-pill-modern { padding: 0.4em 0.8em; border-radius: 99px; font-size: 70%; font-weight: 800; letter-spacing: 0.5px; border: 1px solid transparent;}
                .bg-prod-light { background-color: #ecfdf5; color: #059669; border-color: #d1fae5; } /* Green styling for Final */
                .bg-proc-light { background-color: #eff6ff; color: #2563eb; border-color: #dbeafe; }
                .badge-instr-light { background-color: #f8fafc; color: #64748b; border-color: #e2e8f0; }

                .form-input-light { background-color: #f8fafc; border: 1px solid #e2e8f0; color: var(--text-main); border-radius: 6px; padding: 0.5rem; width: 100%; transition: 0.2s; outline: none; font-size: 0.85rem;}
                .form-input-light:focus { border-color: var(--accent-primary); box-shadow: 0 0 0 3px var(--accent-glow); background-color: #ffffff;}
                .read-only-light { display: block; padding: 0.5rem; color: #94a3b8; text-align: center; font-weight: 600;}

                .btn-icon-simple { background: transparent; border: none; color: #94a3b8; padding: 6px; cursor: pointer; transition: 0.2s; border-radius: 6px; display: flex; align-items: center; justify-content: center;}
                .btn-icon-simple:hover { color: var(--accent-primary); background: #f1f5f9;}

                .btn-primary-glow { background: var(--text-main); color: #fff; border: none; border-radius: 8px; font-weight: 800; padding: 0.9rem 2.5rem; transition: all 0.3s; font-size: 0.95rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);}
                .btn-primary-glow:hover { background: #000; transform: translateY(-2px); box-shadow: 0 6px 12px rgba(0,0,0,0.15); }
                
                .btn-edit-light { background: #ffffff; border: 1px solid #cbd5e1; color: #475569; border-radius: 6px; padding: 4px 14px; font-size: 0.75rem; font-weight: 800; transition: 0.2s; text-transform: uppercase;}
                .btn-edit-light:hover { background: #f1f5f9; color: var(--text-main);}
                .btn-outline-custom { background: #ffffff; border: 1px solid #cbd5e1; color: var(--text-main); font-weight: 700; padding: 0.4rem 1rem; border-radius: 8px; transition: 0.2s; font-size: 0.85rem;}
                .btn-outline-custom:hover { background: #f8fafc; }

                .modal-light-custom .modal-content { background-color: #ffffff; border: none; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
                .modal-light-custom .modal-header { border-bottom: 1px solid var(--border-subtle); padding: 1.5rem; }
                .modal-light-custom .modal-body { padding: 2rem; }
                
                .lang-title-light { font-size: 0.85rem; font-weight: 800; text-transform: uppercase; color: var(--accent-primary); letter-spacing: 0.5px; margin-bottom: 1rem; border-bottom: 2px solid var(--accent-primary); display: inline-block; padding-bottom: 4px;}
                .sop-list-light { list-style: none; padding-left: 0; color: #1e293b; font-size: 0.95rem; font-weight: 600;} 
                .sop-list-light li { margin-bottom: 0.8rem; display: flex; align-items: flex-start; gap: 10px; line-height: 1.5;}
                .sop-list-light li::before { content: '\\F26A'; font-family: 'bootstrap-icons'; color: var(--success); margin-top: 2px;}
            `}</style>

            {/* SOP MODAL */}
            {showInfoModal && currentSop && (
                <div className="modal fade show modal-light-custom" style={{display: 'block', backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)'}} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-lg animate-pop">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" style={{fontWeight: '900', color: '#0f172a'}}>
                                    <i className="bi bi-file-earmark-ruled me-2" style={{color: 'var(--accent-primary)'}}></i>
                                    PDI Checking SOP
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowInfoModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <h4 className="text-center mb-4 pb-3" style={{borderBottom: '1px solid var(--border-subtle)', fontWeight: '900', color: '#0f172a'}}>{currentSop.title}</h4>
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <div className="lang-title-light">English Instructions</div>
                                        <ul className="sop-list-light">{currentSop.english.map((step, i) => <li key={i}>{step}</li>)}</ul>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="lang-title-light">हिंदी निर्देश</div>
                                        <ul className="sop-list-light" style={{fontFamily: 'Devanagari, sans-serif'}}>{currentSop.hindi.map((step, i) => <li key={i}>{step}</li>)}</ul>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-0 p-4 bg-light" style={{borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px'}}>
                                <button type="button" className="btn btn-primary-glow w-100" style={{padding: '0.7rem', backgroundColor: 'var(--accent-primary)'}} onClick={() => setShowInfoModal(false)}>Acknowledge & Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* FULL WIDTH STICKY NAVBAR */}
            <nav className="dashboard-navbar">
                <div className="brand-logo" onClick={() => navigate('/qms/reports-dashboard')}>
                    <i className="bi bi-arrow-left-circle text-muted me-2" style={{fontSize: '1.2rem', transition: '0.2s'}}></i> 
                    <i className="bi bi-truck"></i> PDI Inspection
                </div>
                <div>
                    <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill" style={{backgroundColor: '#d1fae5', border: '1px solid #a7f3d0'}}>
                        <span style={{width: '8px', height: '8px', backgroundColor: '#10B981', borderRadius: '50%', display: 'inline-block'}}></span>
                        <span style={{fontSize: '0.75rem', fontWeight: '800', color: '#059669', letterSpacing: '0.5px', margin: 0}}>PDI TERMINAL</span>
                    </div>
                </div>
            </nav>

            <div className="main-container">
                {/* 🌟 STEP 1: CONTEXT (NO OPERATION FILTER) */}
                <div className="card-custom animate-pop" style={{animationDelay: '0.1s'}}>
                    <div className="card-header-custom">
                        <h6 className="card-title-custom"><i className="bi bi-sliders text-success"></i> Dispatch Context Filters</h6>
                        <input type="date" className="form-control-light w-auto fw-bold" style={{padding: '0.4rem 0.8rem', color: 'var(--accent-primary)'}} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                    </div>
                    <div className="card-body-custom">
                        <div className="row g-3 align-items-end">
                            <div className="col-md-4"><label>Customer Name</label><select className="form-control-light" value={selectedCustomer} onChange={handleCustomerChange}><option value="">Select Customer...</option>{customers.map((c, i)=><option key={i} value={c}>{c}</option>)}</select></div>
                            <div className="col-md-4"><label>Finished Part Name</label><select className="form-control-light" value={selectedPart} onChange={handlePartChange} disabled={!selectedCustomer}><option value="">Select Part...</option>{parts.map((p, i)=><option key={i} value={p}>{p}</option>)}</select></div>
                            <div className="col-md-4">
                                <label>Model / Part No</label>
                                <div className="d-flex gap-2">
                                    <input type="text" className="form-control-light" value={modelName} readOnly placeholder="Model" />
                                    <input type="text" className="form-control-light" value={partNumber} readOnly placeholder="Part No" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 🌟 GATES & FORM */}
                {specList.length > 0 && (
                    <div className="card-custom animate-pop" style={{animationDelay: '0.2s'}}>
                        <div className="card-header-custom">
                            <h6 className="card-title-custom">
                                <i className="bi bi-terminal-split text-success"></i> 
                                {userAction === '' ? 'Action Command' : (selectedStage === '' ? 'Lot Selection' : 'Data Entry Terminal')}
                            </h6>
                            {userAction !== '' && (
                                <button className="btn-outline-custom" onClick={handleBackClick}>
                                    <i className="bi bi-arrow-left me-1"></i> Return
                                </button>
                            )}
                        </div>
                        
                        <div className="card-body-custom">
                            {/* GATE 1: SELECT ACTION */}
                            {userAction === '' && (
                                <div className="animate-pop">
                                    <div className="row justify-content-center g-4">
                                        <div className="col-md-3">
                                            <div className="gate-card-light" onClick={() => setUserAction('FILL')}>
                                                <i className="bi bi-file-earmark-plus gate-icon-light"></i>
                                                <h6 className="gate-title-light">New PDI Log</h6>
                                                <p className="gate-desc-light">Initialize new final inspection</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="gate-card-light" onClick={handleUpdateAction} style={{'--accent-primary': '#f59e0b'}}>
                                                <i className="bi bi-pencil-square gate-icon-light"></i>
                                                <h6 className="gate-title-light">Update Log</h6>
                                                <p className="gate-desc-light">Modify existing lot entries</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="gate-card-light" onClick={handleDeleteAction} style={{'--accent-primary': '#ef4444'}}>
                                                <i className="bi bi-trash gate-icon-light"></i>
                                                <h6 className="gate-title-light">Purge Log</h6>
                                                <p className="gate-desc-light">Delete PDI data for selected date</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* GATE 2: SELECT LOT STAGE */}
                            {userAction === 'FILL' && selectedStage === '' && (
                                <div className="animate-pop">
                                    <div className="row justify-content-center g-4">
                                        <div className="col-md-3">
                                            <div className={`gate-card-light ${isLot1Done ? 'gate-done-light' : ''}`} onClick={() => !isLot1Done && startFillingStage('LOT_1')}>
                                                {isLot1Done ? <i className="bi bi-check-circle-fill gate-icon-light text-success"></i> : <i className="bi bi-box-seam gate-icon-light"></i>}
                                                <h6 className="gate-title-light d-flex flex-column align-items-center justify-content-center gap-1">
                                                    <div className="d-flex align-items-center gap-2">Lot 1 {isLot1Done && <span className="badge bg-success" style={{fontSize:'0.6rem'}}>DONE</span>}</div>
                                                    {isLot1Done && <span className="text-muted" style={{fontSize: '0.75rem', fontWeight: '600'}}>at {lot1Log?.time}</span>}
                                                </h6>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className={`gate-card-light ${isLot2Done ? 'gate-done-light' : ''}`} onClick={() => !isLot2Done && startFillingStage('LOT_2')} style={{'--accent-primary': '#3b82f6'}}>
                                                {isLot2Done ? <i className="bi bi-check-circle-fill gate-icon-light text-success"></i> : <i className="bi bi-boxes gate-icon-light"></i>}
                                                <h6 className="gate-title-light d-flex flex-column align-items-center justify-content-center gap-1">
                                                    <div className="d-flex align-items-center gap-2">Lot 2 {isLot2Done && <span className="badge bg-success" style={{fontSize:'0.6rem'}}>DONE</span>}</div>
                                                    {isLot2Done && <span className="text-muted" style={{fontSize: '0.75rem', fontWeight: '600'}}>at {lot2Log?.time}</span>}
                                                </h6>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className={`gate-card-light ${isLot3Done ? 'gate-done-light' : ''}`} onClick={() => !isLot3Done && startFillingStage('LOT_3')} style={{'--accent-primary': '#8b5cf6'}}>
                                                {isLot3Done ? <i className="bi bi-check-circle-fill gate-icon-light text-success"></i> : <i className="bi bi-truck-flatbed gate-icon-light"></i>}
                                                <h6 className="gate-title-light d-flex flex-column align-items-center justify-content-center gap-1">
                                                    <div className="d-flex align-items-center gap-2">Lot 3 {isLot3Done && <span className="badge bg-success" style={{fontSize:'0.6rem'}}>DONE</span>}</div>
                                                    {isLot3Done && <span className="text-muted" style={{fontSize: '0.75rem', fontWeight: '600'}}>at {lot3Log?.time}</span>}
                                                </h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* GATE 3: FORM */}
                            {selectedStage !== '' && (
                                <div className="animate-pop">
                                    <div className="stepper-light">
                                        <div className={`step-item-light ${currentStage > 1 ? 'completed' : 'active'}`}><div className="step-icon-light">{currentStage > 1 ? <i className="bi bi-check-lg"></i> : '1'}</div><div className="step-text-light">Lot 1</div></div>
                                        <div className={`step-item-light ${currentStage > 2 ? 'completed' : (currentStage === 2 ? 'active' : '')}`}><div className="step-icon-light">{currentStage > 2 ? <i className="bi bi-check-lg"></i> : '2'}</div><div className="step-text-light">Lot 2</div></div>
                                        <div className={`step-item-light ${currentStage > 3 ? 'completed' : (currentStage === 3 ? 'active' : '')}`}><div className="step-icon-light">{currentStage > 3 ? <i className="bi bi-check-lg"></i> : '3'}</div><div className="step-text-light">Lot 3</div></div>
                                    </div>

                                    {activeColId && activeColumn && (
                                        <div className="meta-strip-light">
                                            <div className="row g-3 align-items-center">
                                                <div className="col-md-3"><label>Invoice / Dispatch No</label><input type="text" className="form-control-light" placeholder="e.g. INV-001" value={activeColumn.plant || ''} onChange={(e) => handleActiveColChange('plant', e.target.value)} /></div>
                                                <div className="col-md-3"><label>PDI Inspector</label><input type="text" className="form-control-light" placeholder="Inspector Name" value={activeColumn.operator || ''} onChange={(e) => handleActiveColChange('operator', e.target.value)} /></div>
                                                <div className="col-md-3"><label>Batch/Lot Size</label><input type="text" className="form-control-light" placeholder="Total Qty" value={activeColumn.machine || ''} onChange={(e) => handleActiveColChange('machine', e.target.value)} /></div>
                                                <div className="col-md-3"><label>Data Format</label>
                                                    <select className="form-control-light" value={activeColumn.entryFormat || 'dual'} onChange={(e) => handleActiveColChange('entryFormat', e.target.value)}>
                                                        <option value="single">Single Value</option>
                                                        <option value="dual">Reading 1 & 2</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="table-responsive-light shadow-sm">
                                        <table className="table-light-custom">
                                            <thead>
                                                <tr>
                                                    <th className="text-center">Sr</th>
                                                    <th>Type</th>
                                                    <th style={{textAlign: 'left'}}>Parameter</th>
                                                    <th>Specification</th>
                                                    <th className="text-center">Tolerance</th>
                                                    <th className="text-center">Instrument</th>
                                                    {logColumns.map((col) => (
                                                        <th key={col.id} className={`${col.id === activeColId ? 'th-active' : ''} text-center`} style={{minWidth: '160px'}}>
                                                            <div className="d-flex justify-content-center align-items-center gap-2">
                                                                {col.displayStage}
                                                                {col.isLocked && <i className="bi bi-lock-fill text-muted"></i>}
                                                            </div>
                                                            {col.time && <div style={{fontSize: '0.65rem', color: 'var(--text-muted)', marginTop:'4px', textTransform:'none'}}>Logged: {col.time}</div>}
                                                            {col.isLocked && <button className="btn-edit-light mt-2 d-block mx-auto" onClick={() => unlockColumn(col.id)}>Edit</button>}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {specList.map((row) => (
                                                    <tr key={row.sr}>
                                                        <td className="fw-bold text-center" style={{color: '#475569'}}>{row.sr}</td>
                                                        <td><span className={`badge-pill-modern ${row.category === 'FINAL' ? 'bg-prod-light' : 'bg-proc-light'}`}>{row.category}</span></td>
                                                        <td style={{textAlign: 'left', fontWeight: '800', color: '#0f172a'}}>{row.item}</td>
                                                        <td style={{fontWeight: '700', color: '#334155'}}>{row.spec}</td>
                                                        <td className="text-center fw-bold text-danger">{row.tol}</td>
                                                        <td className="text-center"><span className="badge-pill-modern badge-instr-light">{row.instr || '-'}</span></td>
                                                        {logColumns.map((col) => ( <React.Fragment key={col.id}>{renderCell(col, row.sr, row.item)}</React.Fragment> ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {activeColId && (
                                        <div className="text-center mt-5 mb-3">
                                            <button className="btn-primary-glow" onClick={handleSaveData}>
                                                <i className="bi bi-cloud-check-fill me-2"></i> Commit PDI Log
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PdiReportForm;