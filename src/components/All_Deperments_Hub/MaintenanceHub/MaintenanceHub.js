import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// 🔥 Dual Data Imports
import { 
    frequencyCards, 
    machineDailyReports, 
    weeklyMachineSubReports,
    machineMonthlyReports,
    machineYearlyReports
} from './data/machineData';

import { 
    toolFrequencyCards, 
    toolReports, 
    weeklyToolSubReports,
    toolMonthlyReports,
    toolYearlyReports
} from './data/ToolMachineData';

const MaintenanceHub = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // States
    const [activeTab, setActiveTab] = useState('MACHINE');
    const [selectedFrequency, setSelectedFrequency] = useState(null); 
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    // 🔥 SYNC LOGIC: URL se Tab aur Frequency detect karna
    useEffect(() => {
        const path = location.pathname.toLowerCase();
        const pathParts = path.split('/');
        
        // 1. Detect Active Tab
        if (path.includes('/tool')) {
            setActiveTab('TOOL');
        } else {
            setActiveTab('MACHINE');
        }

        // 2. Detect Selected Frequency (daily/weekly/etc)
        const lastPart = pathParts[pathParts.length - 1];
        const frequencies = ['daily', 'weekly', 'monthly', 'yearly'];
        
        if (frequencies.includes(lastPart)) {
            setSelectedFrequency(lastPart);
        } else {
            setSelectedFrequency(null);
        }
    }, [location.pathname]);

    // 🔥 Tab Switching Logic
    const handleTabChange = (tab) => {
        const basePath = tab === 'TOOL' ? '/Maintenance/Tool' : '/Maintenance/Machine';
        navigate(basePath);
    };

    // 🔥 Filter Reports based on logic
    let currentReports = [];
    if (activeTab === 'MACHINE') {
        if (!selectedFrequency) currentReports = frequencyCards;
        else if (selectedFrequency === 'daily') currentReports = machineDailyReports;
        else if (selectedFrequency === 'weekly') currentReports = weeklyMachineSubReports;
        else if (selectedFrequency === 'monthly') currentReports = machineMonthlyReports;
        else if (selectedFrequency === 'yearly') currentReports = machineYearlyReports;
    } else {
        if (!selectedFrequency) currentReports = toolFrequencyCards;
        else if (selectedFrequency === 'daily') currentReports = toolReports;
        else if (selectedFrequency === 'weekly') currentReports = weeklyToolSubReports;
        else if (selectedFrequency === 'monthly') currentReports = toolMonthlyReports;
        else if (selectedFrequency === 'yearly') currentReports = toolYearlyReports;
    }

    // 🔥 CARD CLICK LOGIC (Direct Linking Integrated)
    const handleCardClick = (report) => {
        const frequencies = ['daily', 'weekly', 'monthly', 'yearly'];
        
        // Specific Check: Tool Weekly bypass intermediate cards
        if (report.id === 'weekly' && activeTab === 'TOOL') {
            navigate("/Maintenance/Tool/weekly");
            return;
        }

        if (report.id === 'monthly' && activeTab === 'MACHINE') {
            navigate("/Maintenance/Machine/monthly");
            return;
        }
         if (report.id === 'yearly' && activeTab === 'MACHINE') {
            navigate("/Maintenance/Machine/yearly");
            return;
        }

        if (report.id === 'monthly' && activeTab === 'TOOL') {
            navigate("/Maintenance/Tool/Monthly")
        }
        
        if (report.id === 'yearly' && activeTab === 'TOOL') {
            navigate("/Maintenance/Tool/yearly")
        }

        if (frequencies.includes(report.id)) {
            const basePath = activeTab === 'TOOL' ? '/Maintenance/Tool' : '/Maintenance/Machine';
            navigate(`${basePath}/${report.id}`);
        } else {
            setSelectedCard(report);
            setShowOptionsModal(true);
        }
    };

    const handleBackClick = () => {
        const basePath = activeTab === 'TOOL' ? '/Maintenance/Tool' : '/Maintenance/Machine';
        navigate(basePath);
    };

    const navigateToForm = (reportId) => {
        const isTool = activeTab === 'TOOL';
        const basePath = isTool ? '/Maintenance/Tool' : '/Maintenance/Machine';
        
        switch (reportId) {
            // Machine specific
            case "mc_history": navigate(`${basePath}/history-card`); break;
            case "power_press_check": navigate(`${basePath}/power-press-checksheet`); break;
            case "mc_breakdown": navigate(`${basePath}/breakdown-form`); break;
            
            // Tool specific 
            case "tool_history": navigate(`${basePath}/history-form`); break;
            case "tool_pm_check": navigate(`${basePath}/pm-checklist`); break;
            case "tool_breakdown": navigate(`${basePath}/breakdown-form`); break;
            case "weekly_pm_welding_fixture": navigate(`${basePath}/welding-fixture-checklist`); break;
          
            case "tool_breakdown_summary": 
                navigate(`${basePath}/breakdown-summary`); break;
            
            case "why_why_analysis": 
            case "why_tool_analysis": 
                navigate(`${basePath}/why-analysis`); break;
            
            case "critical_spares": 
            case "tool_critical_spares": 
                navigate(`${basePath}/critical-spares`); break;

            default:
                if (reportId.startsWith('weekly_pm_')) {
                    const slug = reportId.split('_').pop();
                    navigate(`${basePath}/preventive-${slug}`);
                } else {
                    alert("🚧 Route not found for: " + reportId);
                }
        }
        closeModal();
    };

    const closeModal = (e) => { 
        if (e) e.stopPropagation();
        setShowOptionsModal(false); 
        setSelectedCard(null); 
    };

    // --- Animation Variants ---
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.1 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { type: "spring", stiffness: 100, damping: 15 } 
        }
    };

    return (
        <div className="hub-viewport">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

                .hub-viewport { 
                    min-height: 100vh; 
                    background-color: #0f172a; 
                    font-family: 'Inter', sans-serif; color: #f8fafc; 
                    padding-bottom: 80px;
                }

                /* --- Exact QA Hub Sticky Navbar --- */
                .nav-bar { 
                    position: sticky; 
                    top: 0; 
                    background: #0f172a; 
                    min-height: 70px; 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    padding: 0 2rem; 
                    box-shadow: 0 1px 0 #263750; 
                    z-index: 1000; 
                    gap: 15px; 
                }
                .qa-title { 
                    font-weight: 900; 
                    color: #22d3ee; 
                    margin: 0; 
                    cursor: pointer; 
                    font-size: 1.4rem; 
                    display: flex; 
                    align-items: center; 
                }

                /* --- Main Container Fluid Setup --- */
                .main-container { 
                    padding: 32px 24px; 
                    width: 100%; 
                    margin: 0 auto; 
                }

                /* --- Header Section (Clean Style) --- */
                .hub-header { 
                    text-align: center; 
                    padding: 40px 20px 24px; 
                }
                .hub-header h1 { 
                    font-size: 2.4rem; 
                    font-weight: 900; 
                    color: #22d3ee; 
                    margin-bottom: 8px; 
                }
                .hub-header p { 
                    color: #94a3b8; 
                    font-size: 1rem; 
                    max-width: 600px; 
                    margin: 0 auto; 
                }

                /* --- Exact QA Hub Tabs CSS --- */
                .tabs-container { 
                    display: flex; 
                    gap: 10px; 
                    background: #182338; 
                    padding: 6px; 
                    border-radius: 8px; 
                    overflow-x: auto; 
                    white-space: nowrap; 
                    -ms-overflow-style: none; 
                    scrollbar-width: none; 
                }
                .tabs-container::-webkit-scrollbar { display: none; }
                .tab-btn { 
                    padding: 8px 20px; 
                    border: none; 
                    background: transparent; 
                    color: #94a3b8; 
                    font-weight: 700; 
                    font-size: 0.9rem; 
                    border-radius: 6px; 
                    cursor: pointer; 
                    transition: 0.2s; 
                    white-space: nowrap; 
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .tab-btn.active { 
                    background: #22314a; 
                    color: #22d3ee; 
                    box-shadow: 0 2px 4px rgba(0,0,0,0.18); 
                }

                /* --- Grid matching structure exactly (No auto-stretching) --- */
                .reports-grid { 
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 24px;
                    width: 100%;
                    height:auto;
                }

                /* --- Exact QaHub Card Style --- */
                .card-custom { 
                    position: relative; 
                    background: #182338; 
                    border: 1px solid #263750; 
                    border-radius: 10px; 
                    padding: 1.5rem; 
                    cursor: pointer; 
                    transition: all 0.25s ease-in-out; 
                    height: 400px; 
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.18); 
                }
                .card-custom:hover { 
                    transform: translateY(-4px); 
                    border-color: #22d3ee; 
                    box-shadow: 0 12px 24px rgba(34, 211, 238, 0.10); 
                }
                
                .card-body-content {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                }

                .meta-tag { 
                    background: #202d43; 
                    padding: 6px 10px; 
                    border-radius: 6px; 
                    font-size: 0.75rem; 
                    font-weight: 600; 
                    color: #94a3b8; 
                    display: flex; 
                    align-items: center; 
                    gap: 8px; 
                    margin-bottom: 6px; 
                }
                
                /* Professional Badges CSS */
                .status-badge { 
                    position: absolute; 
                    top: 16px; 
                    right: 16px; 
                    padding: 5px 10px; 
                    border-radius: 4px; 
                    font-size: 0.65rem; 
                    font-weight: 700; 
                    text-transform: uppercase; 
                    letter-spacing: 0.05em; 
                    display: flex; 
                    align-items: center; 
                    gap: 6px; 
                }
                .status-live { background: #0f2f25; color: #4ade80; border: 1px solid #166534; }
                .status-dev { background: #202d43; color: #94a3b8; border: 1px solid #3b4b63; }
                
                /* Icon Animations */
                .pulse-icon { animation: pulseAnim 2s infinite; font-size: 0.8rem; }
                @keyframes pulseAnim { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
                .spin-icon { animation: spinAnim 4s linear infinite; font-size: 0.8rem; }
                @keyframes spinAnim { 100% { transform: rotate(360deg); } }

                /* MODAL CSS (Exact matching QaHub modal structure) */
                .modal-overlay { 
                    position: fixed; 
                    inset: 0; 
                    background: rgba(2,6,23,0.78); 
                    backdrop-filter: blur(3px); 
                    z-index: 99999; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    padding: 16px; 
                    animation: fadeIn 0.15s ease; 
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .modal-box { 
                    background: #182338; border: 1px solid #263750; 
                    border-radius: 12px; 
                    padding: 2rem; 
                    width: 100%; 
                    max-width: 400px; 
                    box-shadow: 0 24px 60px rgba(0,0,0,0.2); 
                    animation: slideUp 0.2s ease; 
                    position: relative; 
                }
                @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .modal-close-btn { 
                    position: absolute; 
                    top: 14px; 
                    right: 16px; 
                    background: #202d43; 
                    border: none; 
                    border-radius: 4px; 
                    width: 32px; 
                    height: 32px; 
                    font-size: 16px; 
                    color: #94a3b8; 
                    cursor: pointer; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    transition: background 0.2s; 
                }
                .modal-close-btn:hover { background: #2a3952; }
                .modal-action-btn { 
                    display: flex; 
                    align-items: center; 
                    gap: 14px; 
                    padding: 14px 16px; 
                    border-radius: 8px; 
                    border: 1.5px solid #263750; 
                    background: #111c2f; 
                    cursor: pointer; 
                    text-align: left; 
                    width: 100%; 
                    transition: all 0.2s; 
                    margin-bottom: 10px; 
                    font-family: 'Inter', sans-serif; 
                }
                .modal-action-btn:hover { 
                    transform: translateY(-2px); 
                    box-shadow: 0 6px 18px rgba(0,0,0,0.22); 
                    border-color: #22d3ee; 
                }
                .modal-action-btn:last-child { margin-bottom: 0; }
                .modal-btn-icon { 
                    width: 42px; 
                    height: 42px; 
                    border-radius: 6px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-size: 1.2rem; 
                    flex-shrink: 0; 
                }

                @media (max-width: 768px) {
                    .nav-bar { flex-direction: column; align-items: flex-start; padding: 1rem; gap: 12px; }
                    .qa-title { font-size: 1.25rem; }
                    .tabs-container { width: 100%; display: flex; gap: 5px; }
                    .tab-btn { flex: 1; text-align: center; padding: 8px 5px; font-size: 0.85rem; justify-content: center; } 
                    .main-container { padding: 20px 16px; }
                    .card-custom h5 { padding-right: 90px !important; }
                }
            `}</style>

            <nav className="nav-bar">
                <h4 className="qa-title" onClick={() => navigate('/dashboard')}>
                    <i className="bi bi-arrow-left-circle  m-2" style={{color: '#22d3ee'}}></i> Back To Dashboard
                </h4>
                  <header className="hub-header">
                <h1>Maintenance Hub</h1>
                <p>Manage Machine and Tool maintenance records seamlessly.</p>
            </header>
                <div className="tabs-container">
                    <button className={`tab-btn ${activeTab === 'MACHINE' ? 'active' : ''}`} onClick={() => handleTabChange('MACHINE')}>
                        <i className="bi bi-gear-fill"></i> Machine Maint.
                    </button>
                    <button className={`tab-btn ${activeTab === 'TOOL' ? 'active' : ''}`} onClick={() => handleTabChange('TOOL')}>
                        <i className="bi bi-wrench-adjustable"></i> Tool Maint.
                    </button>
                </div>
            </nav>

          

            <div className="main-container">
                {selectedFrequency && (
                    <div className="mb-4 text-start">
                        <div 
                            onClick={handleBackClick} 
                            style={{ cursor: 'pointer', color: '#22d3ee', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', transition: '0.2s' }}
                        >
                            <i className="bi bi-chevron-left"></i> Back to Categories
                        </div>
                    </div>
                )}

                {currentReports.length > 0 ? (
                    <motion.div 
                        className="reports-grid"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        key={`${activeTab}-${selectedFrequency || 'root'}`}
                    >
                        {currentReports.map((report) => (
                            <motion.div 
                                key={report.id}
                                className="card-custom"
                                variants={cardVariants}
                                onClick={() => handleCardClick(report)}
                            >
                                <div className={`status-badge ${report.isLive !== false ? 'status-live' : 'status-dev'}`}>
                                    {report.isLive !== false ? (
                                        <><i className="bi bi-broadcast pulse-icon"></i> Live</>
                                    ) : (
                                        <><i className="bi bi-gear-wide-connected spin-icon"></i> Under Dev</>
                                    )}
                                </div>

                                <div style={{width:'46px', height:'46px', borderRadius:'8px', background: '#10293a', color: report.color || '#22d3ee', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', marginBottom:'1rem'}}>
                                    <i className={`bi ${report.icon}`}></i>
                                </div>

                                <h5 style={{fontWeight:800, fontSize:'0.95rem', color:'#f8fafc', marginBottom:'1rem', paddingRight: '110px', lineHeight: '1.4'}}>{report.title}</h5>

                                <div className="card-body-content">
                                    <div className="meta-tag"><i className="bi bi-file-earmark-text text-muted"></i>Form: <span style={{color:'#f8fafc'}}>{report.formNo || "AOT-F-PM-01"}</span></div>
                                    <div className="meta-tag mb-0"><i className="bi bi-calendar-event text-muted"></i>Freq: <span style={{color:'#f8fafc'}}>{report.frequency || "Scheduled"}</span></div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="col-12 text-center py-5 text-muted" style={{ width: '100%', marginTop: '40px' }}>
                        <i className="bi bi-inbox fs-1"></i>
                        <h5 className="mt-3">No maintenance reports found.</h5>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showOptionsModal && selectedCard && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                            <button className="modal-close-btn" onClick={closeModal}>
                                <i className="bi bi-x-lg"></i>
                            </button>

                            {/* Card Info */}
                            <div style={{display:'flex', alignItems:'center', gap:14, marginBottom:8}}>
                                <div style={{width:46, height:46, borderRadius:8, background:'#10293a', color:selectedCard.color || '#22d3ee', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', flexShrink:0}}>
                                    <i className={`bi ${selectedCard.icon}`}></i>
                                </div>
                                <div>
                                    <p style={{fontWeight:800, fontSize:'0.95rem', margin:0, color:'#f8fafc'}}>{selectedCard.title}</p>
                                    <p style={{fontSize:'0.75rem', color:'#94a3b8', margin:0}}>Form: {selectedCard.formNo || "AOT-F-PM-01"}</p>
                                </div>
                            </div>

                            <div style={{borderTop:'1px solid #263750', margin:'16px 0'}}></div>
                            <p style={{fontSize:'0.78rem', color:'#94a3b8', fontWeight:600, marginBottom:14, textTransform:'uppercase', letterSpacing:'0.06em'}}>What would you like to do?</p>

                            <button className="modal-action-btn" onClick={() => navigateToForm(selectedCard.id)}>
                                <div className="modal-btn-icon" style={{background:'#202d43', color:'#22d3ee'}}>
                                    <i className="bi bi-pencil-square"></i>
                                </div>
                                <div>
                                    <p style={{fontWeight:700, fontSize:'0.9rem', margin:0, color:'#f8fafc'}}>Fill Entry</p>
                                    <p style={{fontSize:'0.75rem', color:'#94a3b8', margin:0}}>Open this form to submit new data</p>
                                </div>
                                <i className="bi bi-chevron-right ms-auto text-muted" style={{fontSize:'0.85rem'}}></i>
                            </button>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MaintenanceHub;