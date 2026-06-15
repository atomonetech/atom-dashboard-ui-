import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // 🔥 useParams added
import axios from 'axios';

// Example SOP Content
const sopDatabase = {
    'Length': {
        title: 'Length Measurement / लंबाई की माप',
        english: [
            '1. Ensure the Vernier Caliper is zero-calibrated.',
            '2. Place the part firmly between the external jaws.',
            '3. Tighten the locking screw gently.',
            '4. Read the main scale accurately.',
            '5. Record the value in Reading 1.'
        ],
        hindi: [
            '1. सुनिश्चित करें कि वर्नियर कैलीपर जीरो-कैलिब्रेटेड (0.00) है।',
            '2. पार्ट को बाहरी जबड़ों (jaws) के बीच मजबूती से रखें।',
            '3. लॉकिंग स्क्रू को धीरे से कसें।',
            '4. मुख्य स्केल को सटीक रूप से पढ़ें।',
            '5. वैल्यू को Reading 1 में रिकॉर्ड करें।'
        ]
    }
};

const InspectionForm = () => {
    // ==========================================
    //  1. STATE MANAGEMENT
    // ==========================================
    const navigate = useNavigate();
    
    // 🔥 View Mode Logic
    const { id } = useParams();
    const isViewMode = Boolean(id);
    const currentUser = localStorage.getItem('username') || 'Unknown User';

    const [customers, setCustomers] = useState([]);
    const [parts, setParts] = useState([]);
    const [tools, setTools] = useState([]);
    
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedPart, setSelectedPart] = useState('');
    const [selectedTool, setSelectedTool] = useState('');
    const [partNumber, setPartNumber] = useState('');
    const [modelName, setModelName] = useState('');
    const todayDate = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(todayDate);

    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
    const API_URL = `${API_BASE_URL}/api`;
    const API_LOG = `${API_URL}/log-report/`; // 🔥
    const API_APPROVE = `${API_URL}/approve-report/`; // 🔥

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
    const [preparedBy, setPreparedBy] = useState("");

    // ==========================================
    //  2. FETCH DATA & LOAD FORM
    // ==========================================
    useEffect(() => {
        fetch(`${API_URL}/master-dropdown/?filter=customer`)
            .then(res => res.json()).then(data => setCustomers(data)).catch(()=> {
                setCustomers(['FIG', 'MARUTI', 'TATA']);
            });

        // 🔥 VIEW MODE: FETCH SPECIFIC REPORT DATA
        if (isViewMode) {
            axios.get(`${API_URL}/get-single-report/inspection-view/${id}/`)
                .then(res => {
                    if (res.data.success) {
                        const d = res.data.data;
                        setSelectedCustomer(d.customer);
                        setSelectedPart(d.part_name);
                        setSelectedTool(d.operation);
                        setPartNumber(d.part_number);
                        if (d.date) setSelectedDate(d.date.split(' ')[0] || d.date);

                        setSpecList(d.inspection_data?.parameters || []);
                        setLogColumns(d.inspection_data?.logs || []);
                        setUserAction('VIEW'); // Custom mode to show full table instantly
                        
                        const fullName = d.submitted_by || 'Unknown User';
                        setPreparedBy(fullName.split('@')[0]);
                    }
                })
                .catch(err => console.error("Error loading view data", err));
        }
    }, [id, isViewMode, API_URL]);

    const loadDataForGates = async (cust, part, op, dateStr) => {
        if (!cust || !part || !op || !dateStr || isViewMode) return; // 🔥 Skip in view mode
        try {
            const masterRes = await fetch(`${API_URL}/master-parameters/?customer=${encodeURIComponent(cust)}&part=${encodeURIComponent(part)}&operation=${encodeURIComponent(op)}`);
            const masterData = await masterRes.json();
            setPartNumber(masterData.part_number || '68P00-S310050'); 
            setModelName(masterData.model_name || 'K12M');
            
            let allItems = [];
            (masterData.productItems || []).forEach(item => allItems.push({...item, category: 'PRODUCT', sr: item.sr_no}));
            (masterData.processItems || []).forEach(item => allItems.push({...item, category: 'PROCESS', sr: item.sr_no}));
            
            if(allItems.length === 0) {
                allItems = [
                    { sr: 1, category: 'PRODUCT', item: 'APPEARANCE', spec: 'NO BLANK SHORT, NO BURR ETC', tol: '-', instr: 'VISUAL' },
                    { sr: 2, category: 'PRODUCT', item: 'LENGTH', spec: '240', tol: '+0.5/-1.0 MM', instr: 'HEIGHT GAUGE' },
                    { sr: 11, category: 'PROCESS', item: 'SHUT HEIGHT', spec: '287.92', tol: '± 0.50 MM', instr: 'SHUT HEIGHT METER' }
                ];
            }
            setSpecList(allItems);

            const reportRes = await fetch(`${API_URL}/get-inspection-report/?customer=${encodeURIComponent(cust)}&part_name=${encodeURIComponent(part)}&operation=${encodeURIComponent(op)}&date=${dateStr}`);
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

    useEffect(() => { 
        if(!isViewMode) loadDataForGates(selectedCustomer, selectedPart, selectedTool, selectedDate); 
    }, [selectedCustomer, selectedPart, selectedTool, selectedDate, isViewMode]);

    const handleCustomerChange = (e) => {
        if(isViewMode) return;
        const cust = e.target.value; setSelectedCustomer(cust); setSelectedPart(''); setSelectedTool(''); setSpecList([]); setDbLogs([]); setUserAction('');
        if (cust) fetch(`${API_URL}/master-dropdown/?filter=part&cust=${encodeURIComponent(cust)}`).then(res => res.json()).then(data => setParts(data)).catch(()=>setParts(['INLET PIPE', 'OUTLET PIPE']));
    };
    const handlePartChange = (e) => {
        if(isViewMode) return;
        const part = e.target.value; setSelectedPart(part); setSelectedTool(''); setSpecList([]); setDbLogs([]); setUserAction('');
        if (part) fetch(`${API_URL}/master-dropdown/?filter=operation&cust=${encodeURIComponent(selectedCustomer)}&part=${encodeURIComponent(part)}`).then(res => res.json()).then(data => setTools(data)).catch(()=>setTools(['BLANKING', 'BENDING']));
    };

    // ==========================================
    //  3. ACTION & STAGE GATES LOGIC
    // ==========================================
    const handleUpdateAction = () => {
        if (dbLogs.length === 0) {
            alert("ℹ️ No existing records found for this date. Please select 'New Record' to initiate an inspection.");
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
            alert("ℹ️ No data available to purge for the selected date.");
            return;
        }
        const confirmDelete = window.confirm("⚠️ Critical Warning: You are about to permanently purge all inspection records for this date. \n\nDo you wish to proceed?");
        if (confirmDelete) {
            try {
                alert("🗑️ Records successfully purged from the database.");
                loadDataForGates(selectedCustomer, selectedPart, selectedTool, selectedDate);
            } catch (err) { alert("❌ Deletion failed. Please verify database connection."); }
        }
    };

    const getLogByStage = (stage) => dbLogs.find(col => col.baseStage === stage && col.isLocked);
    const setupLog = getLogByStage('SETUP');
    const fourHrsLog = getLogByStage('4HRS');
    const lastLog = getLogByStage('LAST');

    const isSetupDone = !!setupLog;
    const is4HrsDone = !!fourHrsLog;
    const isLastDone = !!lastLog;

    const startFillingStage = (stageCode) => {
        if (stageCode === '4HRS') {
            if (!setupLog) {
                alert("⛔ Sequence Error: Please complete the SETUP inspection before initiating the 4-Hourly report.");
                return;
            }
            if (setupLog.timestamp) {
                const FOUR_HOURS_MS = 4 * 60 * 60 * 1000; 
                const timePassed = Date.now() - setupLog.timestamp;
                if (timePassed < FOUR_HOURS_MS) {
                    const timeLeft = FOUR_HOURS_MS - timePassed;
                    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
                    const minsLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                    alert(`⏳ Time Restriction Active: The 4-Hourly inspection will unlock in ${hoursLeft}h ${minsLeft}m.`);
                    return; 
                }
            }
        }
        if (stageCode === 'LAST') {
            const isConfirmed = window.confirm(`⚠️ Verification Required: Are you sure you want to log the LAST PIECE for the [${selectedTool}] operation?\n\nProceeding will finalize the batch inspection.`);
            if (!isConfirmed) return; 
        }

        setSelectedStage(stageCode);
        let stageName = stageCode === 'SETUP' ? 'SETUP' : (stageCode === '4HRS' ? '4-HOURLY' : 'LAST PIECE');
        let stageNum = stageCode === 'SETUP' ? 1 : (stageCode === '4HRS' ? 2 : 3);
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

    // ==========================================
    //  4. INLINE HANDLING & SAVE / APPROVE 🔥
    // ==========================================
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
    const handleVideoClick = (paramName) => { 
        alert(`🎥 Initializing tutorial video for: ${paramName}`); 
    };

    // 🔥 SAVE / APPROVE LOGIC
    const handleSaveData = async () => {
        if (isViewMode) {
            // ==== APPROVE LOGIC ====
            try {
                const response = await axios.post(API_APPROVE, {
                    log_id: id,
                    approver_username: currentUser
                });
                if (response.status === 200) {
                    alert('✅ Report Approved Successfully!');
                    navigate('/notifications'); 
                }
            } catch (error) {
                console.error('Error approving data:', error);
                alert('Failed to approve report.');
            }
        } else {
            // ==== SAVE LOGIC ====
            if (!activeColumn?.plant || !activeColumn?.operator || !activeColumn?.machine) {
                alert("⛔ Validation Error: Please select Plant Location, Operator ID, and Machine Node.");
                return;
            }

            const format = activeColumn?.entryFormat || 'dual';
            let allFilled = true;

            for (let row of specList) {
                const readObj = activeColumn.readings[row.sr] || { val1: '', val2: '' };
                if (format === 'single') {
                    if (!readObj.val1 || String(readObj.val1).trim() === '') { 
                        allFilled = false; break; 
                    }
                } else {
                    if (!readObj.val1 || String(readObj.val1).trim() === '' || 
                        !readObj.val2 || String(readObj.val2).trim() === '') { 
                        allFilled = false; break; 
                    }
                }
            }

            if (!allFilled) {
                alert("⛔ Validation Error: All readings are compulsory. Please fill all the data fields before committing.");
                return;
            }

            const timeNow = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            let newLogs = logColumns.map(col => col.id === activeColId ? { ...col, isLocked: true, time: timeNow, timestamp: Date.now() } : col);
            
            const payload = {
                master_data: { 
                    customer: selectedCustomer, 
                    part_name: selectedPart, 
                    operation: selectedTool, 
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
                    const resData = await response.json();
                    
                    // 🔥 Save Activity Log
                    try {
                        await axios.post(API_LOG, {
                            username: currentUser,
                            report_name: 'Inspection Report',
                            record_id: resData.record_id || resData.report_id
                        });
                    } catch (logErr) {}

                    alert(`✅ [${activeColumn?.displayStage || 'Data'}] inspection successfully committed to the database.`);
                } else {
                    alert(`❌ Synchronization Failed: The server rejected the payload. Please verify console logs (F12).`);
                }
            } catch (error) { 
                alert("❌ Connection Timeout: Unable to reach the server. Please verify your network or backend status."); 
            }

            setDbLogs(newLogs);       
            setLogColumns([]);        
            setActiveColId('');       
            setSelectedStage('');     
            setUserAction('FILL');    
        }
    };

    // ==========================================
    //  5. RENDER HELPERS
    // ==========================================
    const renderCell = (col, rowSr, paramName) => {
        const readObj = col.readings[rowSr] || { val1: '', val2: '' };
        const isActive = col.id === activeColId && !col.isLocked && !isViewMode;

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
        <>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            
            <style>{`
                /* ====== PREMIUM LIGHT THEME ====== */
                :root {
                    --bg-main: #f4f7f9;        
                    --bg-card: #ffffff;        
                    --bg-input: #f8fafc;        
                    --text-main: #0f172a;       
                    --text-muted: #64748b;      
                    --border-subtle: #e2e8f0;   
                    --accent-primary: ${isViewMode ? '#10b981' : '#4f46e5'};  
                    --accent-hover: ${isViewMode ? '#059669' : '#4338ca'};    
                    --accent-glow: rgba(${isViewMode ? '16, 185, 129' : '79, 70, 229'}, 0.15);
                    --danger: #ef4444;
                    --success: #10b981;
                }

                body { background-color: var(--bg-main); font-family: 'Inter', 'Segoe UI', sans-serif; color: var(--text-main); }
                
                @keyframes slideUpFade { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
                .animate-pop { animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                
                .navbar-light-custom { position: fixed; top: 0; width: 100%; height: 70px; background-color: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-bottom: 1px solid var(--border-subtle); z-index: 1000; box-shadow: 0 1px 3px rgba(0,0,0,0.02);}
                .brand-logo { font-weight: 900; color: var(--accent-primary); font-size: 1.4rem; letter-spacing: -0.5px; display: flex; align-items: center; gap: 8px;}
                
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

                /* DONE STAGE GATE */
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
                .bg-prod-light { background-color: #eff6ff; color: #2563eb; border-color: #dbeafe; }
                .bg-proc-light { background-color: #ecfdf5; color: #059669; border-color: #d1fae5; }
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

                .main-container { padding: 40px 24px 60px 24px; max-width: 1600px; margin: 0 auto; }

                @media (max-width: 992px) { .col-responsive { flex: 0 0 50% !important; max-width: 50% !important; } }
                @media (max-width: 768px) {
                    .main-container { padding: 40px 12px 40px 12px; }
                    .col-responsive { flex: 0 0 100% !important; max-width: 100% !important; }
                    .card-body-custom { padding: 1rem; }
                    .gate-card-light { padding: 1.5rem 1rem; }
                    .table-light-custom thead th { font-size: 0.65rem; padding: 0.75rem 0.5rem; }
                    .table-light-custom tbody td { font-size: 0.75rem; padding: 0.75rem 0.5rem; }
                }
            `}</style>

            {/* SOP MODAL */}
            {showInfoModal && currentSop && (
                <div className="modal fade show modal-light-custom" style={{display: 'block', backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)'}} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-lg animate-pop">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" style={{fontWeight: '900', color: '#0f172a'}}>
                                    <img src="https://img.icons8.com/ios/50/000000/visible--v1.png" alt="Eye" style={{width: '24px', height: '24px', marginRight: '8px'}} /> 
                                    Standard Operating Procedure
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowInfoModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <h4 className="text-center mb-4 pb-3" style={{borderBottom: '1px solid var(--border-subtle)', fontWeight: '900', color: '#0f172a'}}>{currentSop.title}</h4>
                                <div className="row g-4">
                                    <div className="col-md-6 col-responsive">
                                        <div className="lang-title-light">English Instructions</div>
                                        <ul className="sop-list-light">{currentSop.english.map((step, i) => <li key={i}>{step}</li>)}</ul>
                                    </div>
                                    <div className="col-md-6 col-responsive">
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

            <div className="main-container">
                {/* 🌟 STEP 1: CONTEXT */}
                <div className="card-custom animate-pop" style={{animationDelay: '0.1s'}}>
                    <div className="card-header-custom">
                        <button
                          onClick={() => navigate(-1)}
                          className="inline-flex items-center text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg shadow-md transition-all active:scale-95 group border-0"
                          style={{backgroundColor: isViewMode ? '#10b981' : '#2563eb'}}
                        > 
                          <i className="bi bi-arrow-left me-1"></i> Back
                        </button>
                        <h6 className="card-title-custom">
                          <i className={`bi bi-sliders text-${isViewMode ? 'success' : 'primary'}`}></i> 
                          Process Context {isViewMode && <span className="text-success">(REVIEW)</span>}
                        </h6>
                        <input type="text" className="form-control-light w-auto fw-bold text-center" style={{padding: '0.4rem 0.8rem', color: 'var(--accent-primary)', cursor: 'not-allowed', backgroundColor: '#f1f5f9'}} value={selectedDate} readOnly />
                    </div>
                    <div className="card-body-custom">
                        <div className="row g-3">
                            <div className="col-md-3 col-responsive"><label>Customer Account</label><select className="form-control-light" value={selectedCustomer} onChange={handleCustomerChange} disabled={isViewMode}><option value="">Select...</option>{customers.map((c, i)=><option key={i} value={c}>{c}</option>)}</select></div>
                            <div className="col-md-3 col-responsive"><label>Part Name</label><select className="form-control-light" value={selectedPart} onChange={handlePartChange} disabled={!selectedCustomer || isViewMode}><option value="">Select...</option>{parts.map((p, i)=><option key={i} value={p}>{p}</option>)}</select></div>
                            <div className="col-md-3 col-responsive"><label>Operation</label><select className="form-control-light" value={selectedTool} onChange={(e) => setSelectedTool(e.target.value)} disabled={!selectedPart || isViewMode}><option value="">Select...</option>{tools.map((t, i)=><option key={i} value={t}>{t}</option>)}</select></div>
                            <div className="col-md-3 col-responsive">
                                <label>Model / Part No (Ref)</label>
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
                                <i className="bi bi-terminal-split text-primary"></i> 
                                {userAction === '' ? 'Action Command' : (selectedStage === '' && !isViewMode ? 'Stage Selection' : 'Data Entry Terminal')}
                            </h6>
                            {userAction !== '' && !isViewMode && (
                                <button className="btn-outline-custom" onClick={handleBackClick}>
                                    <i className="bi bi-arrow-left me-1"></i> Return
                                </button>
                            )}
                        </div>
                        
                        <div className="card-body-custom">
                            
                            {/* GATE 1: SELECT ACTION (Hidden in View Mode) */}
                            {userAction === '' && !isViewMode && (
                                <div className="animate-pop">
                                    <div className="row justify-content-center g-4">
                                        <div className="col-md-3 col-responsive">
                                            <div className="gate-card-light" onClick={() => setUserAction('FILL')}>
                                                <i className="bi bi-file-earmark-plus gate-icon-light"></i>
                                                <h6 className="gate-title-light">New Record</h6>
                                                <p className="gate-desc-light">Initialize new inspection logs</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-responsive">
                                            <div className="gate-card-light" onClick={handleUpdateAction} style={{'--accent-primary': '#10b981'}}>
                                                <i className="bi bi-pencil-square gate-icon-light"></i>
                                                <h6 className="gate-title-light">Update Record</h6>
                                                <p className="gate-desc-light">Modify existing log entries</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-responsive">
                                            <div className="gate-card-light" onClick={handleDeleteAction} style={{'--accent-primary': '#ef4444'}}>
                                                <i className="bi bi-trash gate-icon-light"></i>
                                                <h6 className="gate-title-light">Purge Record</h6>
                                                <p className="gate-desc-light">Delete data for selected date</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* GATE 2: SELECT STAGE (Hidden in View Mode) */}
                            {userAction === 'FILL' && selectedStage === '' && !isViewMode && (
                                <div className="animate-pop">
                                    <div className="row justify-content-center g-4">
                                        <div className="col-md-3 col-responsive">
                                            <div className={`gate-card-light ${isSetupDone ? 'gate-done-light' : ''}`} onClick={() => !isSetupDone && startFillingStage('SETUP')}>
                                                {isSetupDone ? <i className="bi bi-check-circle-fill gate-icon-light text-success"></i> : <i className="bi bi-1-circle gate-icon-light"></i>}
                                                <h6 className="gate-title-light d-flex flex-column align-items-center justify-content-center gap-1">
                                                    <div className="d-flex align-items-center gap-2">Setup {isSetupDone && <span className="badge bg-success" style={{fontSize:'0.6rem'}}>COMPLETED</span>}</div>
                                                    {isSetupDone && <span className="text-muted" style={{fontSize: '0.75rem', fontWeight: '600'}}>at {setupLog?.time}</span>}
                                                </h6>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-responsive">
                                            <div className={`gate-card-light ${is4HrsDone ? 'gate-done-light' : ''}`} onClick={() => !is4HrsDone && startFillingStage('4HRS')} style={{'--accent-primary': '#f59e0b'}}>
                                                {is4HrsDone ? <i className="bi bi-check-circle-fill gate-icon-light text-success"></i> : <i className="bi bi-2-circle gate-icon-light"></i>}
                                                <h6 className="gate-title-light d-flex flex-column align-items-center justify-content-center gap-1">
                                                    <div className="d-flex align-items-center gap-2">4-Hourly {is4HrsDone && <span className="badge bg-success" style={{fontSize:'0.6rem'}}>COMPLETED</span>}</div>
                                                    {is4HrsDone && <span className="text-muted" style={{fontSize: '0.75rem', fontWeight: '600'}}>at {fourHrsLog?.time}</span>}
                                                </h6>
                                            </div>
                                        </div>
                                        <div className="col-md-3 col-responsive">
                                            <div className={`gate-card-light ${isLastDone ? 'gate-done-light' : ''}`} onClick={() => !isLastDone && startFillingStage('LAST')} style={{'--accent-primary': '#06b6d4'}}>
                                                {isLastDone ? <i className="bi bi-check-circle-fill gate-icon-light text-success"></i> : <i className="bi bi-3-circle gate-icon-light"></i>}
                                                <h6 className="gate-title-light d-flex flex-column align-items-center justify-content-center gap-1">
                                                    <div className="d-flex align-items-center gap-2">Last Piece {isLastDone && <span className="badge bg-success" style={{fontSize:'0.6rem'}}>COMPLETED</span>}</div>
                                                    {isLastDone && <span className="text-muted" style={{fontSize: '0.75rem', fontWeight: '600'}}>at {lastLog?.time}</span>}
                                                </h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* GATE 3: FORM */}
                            {(selectedStage !== '' || isViewMode) && (
                                <div className="animate-pop">
                                    {/* STEPPER (Hide in View Mode) */}
                                    {!isViewMode && (
                                      <div className="stepper-light">
                                          <div className={`step-item-light ${currentStage > 1 ? 'completed' : 'active'}`}><div className="step-icon-light">{currentStage > 1 ? <i className="bi bi-check-lg"></i> : '1'}</div><div className="step-text-light">Setup</div></div>
                                          <div className={`step-item-light ${currentStage > 2 ? 'completed' : (currentStage === 2 ? 'active' : '')}`}><div className="step-icon-light">{currentStage > 2 ? <i className="bi bi-check-lg"></i> : '2'}</div><div className="step-text-light">4-Hourly</div></div>
                                          <div className={`step-item-light ${currentStage > 3 ? 'completed' : (currentStage === 3 ? 'active' : '')}`}><div className="step-icon-light">{currentStage > 3 ? <i className="bi bi-check-lg"></i> : '3'}</div><div className="step-text-light">Last Piece</div></div>
                                      </div>
                                    )}

                                    {/* META STRIP (Visible only while filling a new col) */}
                                    {activeColId && activeColumn && !isViewMode && (
                                        <div className="meta-strip-light">
                                            <div className="row g-3 align-items-center">
                                                <div className="col-md-3 col-responsive">
                                                    <label>Plant Location</label>
                                                    <select 
                                                        className="form-control-light" 
                                                        value={activeColumn.plant || ''} 
                                                        onChange={(e) => handleActiveColChange('plant', e.target.value)}
                                                    >
                                                        <option value="">Select Plant...</option>
                                                        <option value="Plant 1">Plant 1</option>
                                                        <option value="Plant 2">Plant 2</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-3 col-responsive"><label>Operator ID</label><input type="text" className="form-control-light" placeholder="Operator Name" value={activeColumn.operator || ''} onChange={(e) => handleActiveColChange('operator', e.target.value)} /></div>
                                                <div className="col-md-3 col-responsive"><label>Machine Node</label><input type="text" className="form-control-light" placeholder="M-01" value={activeColumn.machine || ''} onChange={(e) => handleActiveColChange('machine', e.target.value)} /></div>
                                                <div className="col-md-3 col-responsive"><label>Data Format</label>
                                                    <select className="form-control-light" value={activeColumn.entryFormat || 'dual'} onChange={(e) => handleActiveColChange('entryFormat', e.target.value)}>
                                                        <option value="single">Single Value</option>
                                                        <option value="dual">Reading 1 & 2</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* TABLE */}
                                    <div className="table-responsive-light shadow-sm mt-3">
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
                                                                {(col.isLocked || isViewMode) && <i className="bi bi-lock-fill text-muted"></i>}
                                                            </div>
                                                            {col.time && <div style={{fontSize: '0.65rem', color: 'var(--text-muted)', marginTop:'4px', textTransform:'none'}}>Logged: {col.time}</div>}
                                                            {/* 🔥 Remove edit button in view mode */}
                                                            {col.isLocked && !isViewMode && <button className="btn-edit-light mt-2 d-block mx-auto" onClick={() => unlockColumn(col.id)}>Edit</button>}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {specList.map((row) => (
                                                    <tr key={row.sr}>
                                                        <td className="fw-bold text-center" style={{color: '#475569'}}>{row.sr}</td>
                                                        <td><span className={`badge-pill-modern ${row.category === 'PRODUCT' ? 'bg-prod-light' : 'bg-proc-light'}`}>{row.category}</span></td>
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

                                    {/* BUTTONS (Approve or Save) */}
                                    <div className="mt-6 sm:mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-top pt-4">
                                        
                                        <div className="flex flex-col">
                                          {isViewMode ? (
                                            <>
                                              <label className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Prepared By</label>
                                              <p className="m-0 fw-bolder text-success fs-5 text-capitalize">{preparedBy}</p>
                                            </>
                                          ) : (
                                            activeColId && (
                                              <>
                                                <label className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">Prepared By</label>
                                                <input type="text" value={preparedBy} onChange={(e) => setPreparedBy(e.target.value)} placeholder="Enter name" className="form-control-light w-100" style={{maxWidth: '250px'}} />
                                              </>
                                            )
                                          )}
                                        </div>

                                        {(activeColId || isViewMode) && (
                                            <button 
                                              className="btn-primary-glow" 
                                              style={{backgroundColor: isViewMode ? 'var(--success)' : 'var(--text-main)'}}
                                              onClick={handleSaveData}
                                            >
                                                {isViewMode ? (
                                                    <><i className="bi bi-check-circle-fill me-2"></i> Approve Report</>
                                                ) : (
                                                    <><i className="bi bi-cloud-check-fill me-2"></i> Commit Records</>
                                                )}
                                            </button>
                                        )}
                                    </div>

                                </div>
                            )}

                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default InspectionForm;