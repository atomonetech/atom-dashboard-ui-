// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

// // 🔥 Dual Data Imports
// import { 
//     frequencyCards, 
//     machineDailyReports, 
//     weeklyMachineSubReports,
//     machineMonthlyReports,
//     machineYearlyReports
// } from './data/machineData';

// import { 
//     toolFrequencyCards, 
//     toolReports, 
//     weeklyToolSubReports,
//     toolMonthlyReports,
//     toolYearlyReports
// } from './data/ToolMachineData';

// const MaintenanceHub = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
    
//     // States
//     const [activeTab, setActiveTab] = useState('MACHINE');
//     const [selectedFrequency, setSelectedFrequency] = useState(null); 
//     const [showOptionsModal, setShowOptionsModal] = useState(false);
//     const [selectedCard, setSelectedCard] = useState(null);

//     // 🔥 SYNC LOGIC: URL se Tab aur Frequency detect karna
//     useEffect(() => {
//         const path = location.pathname.toLowerCase();
//         const pathParts = path.split('/');
        
//         // 1. Detect Active Tab
//         if (path.includes('/tool')) {
//             setActiveTab('TOOL');
//         } else {
//             setActiveTab('MACHINE');
//         }

//         // 2. Detect Selected Frequency (daily/weekly/etc)
//         const lastPart = pathParts[pathParts.length - 1];
//         const frequencies = ['daily', 'weekly', 'monthly', 'yearly'];
        
//         if (frequencies.includes(lastPart)) {
//             setSelectedFrequency(lastPart);
//         } else {
//             setSelectedFrequency(null);
//         }
//     }, [location.pathname]);

//     // 🔥 Tab Switching Logic
//     const handleTabChange = (tab) => {
//         const basePath = tab === 'TOOL' ? '/Maintenance/Tool' : '/Maintenance/Machine';
//         navigate(basePath);
//     };

//     // 🔥 Filter Reports based on logic
//     let currentReports = [];
//     if (activeTab === 'MACHINE') {
//         if (!selectedFrequency) currentReports = frequencyCards;
//         else if (selectedFrequency === 'daily') currentReports = machineDailyReports;
//         else if (selectedFrequency === 'weekly') currentReports = weeklyMachineSubReports;
//         else if (selectedFrequency === 'monthly') currentReports = machineMonthlyReports;
//         else if (selectedFrequency === 'yearly') currentReports = machineYearlyReports;
//     } else {
//         if (!selectedFrequency) currentReports = toolFrequencyCards;
//         else if (selectedFrequency === 'daily') currentReports = toolReports;
//         else if (selectedFrequency === 'weekly') currentReports = weeklyToolSubReports;
//         else if (selectedFrequency === 'monthly') currentReports = toolMonthlyReports;
//         else if (selectedFrequency === 'yearly') currentReports = toolYearlyReports;
//     }

//     // 🔥 CARD CLICK LOGIC (Direct Linking Integrated)
//     const handleCardClick = (report) => {
//         const frequencies = ['daily', 'weekly', 'monthly', 'yearly'];
        
//         // Specifc Check: Tool Weekly bypass intermediate cards
//         if (report.id === 'weekly' && activeTab === 'TOOL') {
//             navigate("/Maintenance/Tool/weekly");
//             return;
//         }

//         if (report.id === 'monthly' && activeTab === 'MACHINE') {
//             navigate("/Maintenance/Machine/monthly");
//             return;
//         }
//          if (report.id === 'yearly' && activeTab === 'MACHINE') {
//             navigate("/Maintenance/Machine/yearly");
//             return;
//         }

//         if (report.id === 'monthly' && activeTab === 'TOOL') {
//             navigate("/Maintenance/Tool/Monthly")
//         }
        
//         if (report.id === 'yearly' && activeTab === 'TOOL') {
//             navigate("/Maintenance/Tool/yearly")
//         }

//         if (frequencies.includes(report.id)) {
//             const basePath = activeTab === 'TOOL' ? '/Maintenance/Tool' : '/Maintenance/Machine';
//             navigate(`${basePath}/${report.id}`);
//         } else {
//             setSelectedCard(report);
//             setShowOptionsModal(true);
//         }
//     };

//     const handleBackClick = () => {
//         const basePath = activeTab === 'TOOL' ? '/Maintenance/Tool' : '/Maintenance/Machine';
//         navigate(basePath);
//     };

// // ... inside MaintenanceHub component

//     const navigateToForm = (reportId) => {
//         // 🔥 FIX: Check specifically if it's a Tool or Machine path
//         const isTool = activeTab === 'TOOL';
//         const basePath = isTool ? '/Maintenance/Tool' : '/Maintenance/Machine';
        
//         switch (reportId) {
//             // Machine specific
//             case "mc_history": navigate(`${basePath}/history-card`); break;
//             case "power_press_check": navigate(`${basePath}/power-press-checksheet`); break;
//             case "mc_breakdown": navigate(`${basePath}/breakdown-form`); break;
            
//             // Tool specific 
//             case "tool_history": navigate(`${basePath}/history-form`); break;
//             case "tool_pm_check": navigate(`${basePath}/pm-checklist`); break;
//             case "tool_breakdown": navigate(`${basePath}/breakdown-form`); break;
//             case "weekly_pm_welding_fixture": navigate(`${basePath}/welding-fixture-checklist`); break;

          
//             case "tool_breakdown_summary": 
//                 navigate(`${basePath}/breakdown-summary`); break;
            
//             case "why_why_analysis": 
//             case "why_tool_analysis": 
//                 navigate(`${basePath}/why-analysis`); break; // routes mein path 'why-analysis' rakha hai humne
            
//             case "critical_spares": 
//             case "tool_critical_spares": 
//                 navigate(`${basePath}/critical-spares`); break;

//             default:
//                 if (reportId.startsWith('weekly_pm_')) {
//                     const slug = reportId.split('_').pop();
//                     navigate(`${basePath}/preventive-${slug}`);
//                 } else {
//                     alert("🚧 Route not found for: " + reportId);
//                 }
//         }
//         closeModal();
//     };

//     const closeModal = () => { setShowOptionsModal(false); setSelectedCard(null); };

//     return (
//         <div className="maintenance-hub-root">
//             <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
//             <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            
//             <style>{`
//                 .maintenance-hub-root { position: fixed; inset: 0; background-color: #f1f4f9; z-index: 9999; overflow-y: auto; font-family: 'Inter', sans-serif; }
//                 .nav-bar { 
//                     position: sticky; 
//                     top: 0; 
//                     background: #fff; 
//                     min-height: 70px; 
//                     display: flex; 
//                     justify-content: space-between; 
//                     align-items: center; 
//                     padding: 0 2rem; 
//                     box-shadow: 0 2px 10px rgba(0,0,0,0.05); 
//                     z-index: 1000; 
//                     gap: 15px; 
//                 }
//                 .nav-brand-section { font-weight: 800; color: #4f46e5; font-size: 1.25rem; display: flex; align-items: center; gap: 12px; cursor: pointer; text-decoration: none; }
//                 .main-content { padding: 32px 24px;  width: 100%; 
//                     margin: 0 auto;  text-align: center; }
//                 .hub-title { font-weight: 900; color: #0f172a; font-size: 3rem; margin-bottom: 5px; }
//                 .hub-subtitle { color: #64748b; font-size: 1.1rem; margin-bottom: 40px; }
                
//                 /* Tab center wrapper and pills */
//                 .tab-center-wrapper { display: flex; justify-content: center; margin-bottom: 60px; }
//                 .tab-pill-box { background: #e2e8f0; padding: 6px; border-radius: 50px; display: flex; gap: 5px; border: 1px solid #cbd5e1; }
//                 .tab-item-btn { padding: 10px 25px; border-radius: 50px; border: none; font-weight: 700; font-size: 0.9rem; transition: 0.3s; color: #64748b; background: transparent; display: flex; align-items: center; gap: 8px; cursor: pointer; }
//                 .tab-item-btn.active { background: white; color: #4f46e5; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
                
//                 .report-card-ui { background: white; border-radius: 20px; padding: 35px 25px; text-align: left; border: 1px solid #eef2f6; transition: 0.3s; cursor: pointer; height: 100%; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.02); }
//                 .report-card-ui:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
//                 .card-header-line { position: absolute; top: 0; left: 0; right: 0; height: 5px; border-radius: 20px 20px 0 0; }
//                 .icon-box-wrapper { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 25px; }
//                 .card-main-title { font-weight: 800; color: #0f172a; font-size: 1.3rem; margin-bottom: 25px; }
//                 .meta-pill-ui { display: flex; align-items: center; gap: 12px; background: #f8fafc; padding: 8px 14px; border-radius: 10px; border: 1px solid #f1f5f9; font-size: 0.8rem; color: #64748b; font-weight: 600; width: fit-content; margin-bottom: 8px; }
//                 .back-navigation-ui { cursor: pointer; color: #4f46e5; font-weight: 700; margin-bottom: 25px; display: inline-flex; align-items: center; gap: 8px; font-size: 0.95rem; }
//                  .hub-header { 
//                     text-align: center; 
//                     padding: 40px 20px 24px; 
//                 }
//                 .hub-header h1 { 
//                     font-size: 2.4rem; 
//                     font-weight: 900; 
//                     color: #0f172a; 
//                     margin-bottom: 8px; 
//                 }
//                 .hub-header p { 
//                     color: #64748b; 
//                     font-size: 1rem; 
//                     max-width: 600px; 
//                     margin: 0 auto; 
//                 }

//                 /* MOBILE RESPONSIVE MEDIA QUERIES FOR MAINTENANCE HUB */
//                 @media (max-width: 768px) {
//                     .hub-main-navbar { padding: 0 20px; }
//                     .main-content { padding-top: 100px; padding-left: 16px; padding-right: 16px; }
                    
//                     .hub-title { font-size: 2rem; }
//                     .hub-subtitle { font-size: 0.95rem; margin-bottom: 25px; }
                    
//                     .tab-center-wrapper { margin-bottom: 40px; }
//                     .tab-pill-box { width: 100%; display: flex; gap: 5px; border-radius: 12px; padding: 5px; }
//                     .tab-item-btn { flex: 1; justify-content: center; padding: 10px 5px; font-size: 0.85rem; border-radius: 8px; white-space: nowrap; }
//                 }
//             `}</style>

//             <nav className="navbar">
//                 <div className="nav-brand-section" onClick={() => navigate('/dashboard')}>
//                     <i className="bi bi-arrow-left text-muted"></i>
//                     <i className="bi bi-gear-fill"></i> Back To Dashboard
//                 </div>
//                 <header className="hub-header">
//                     <h1>Maintenance Hub</h1>
//                     <p>Manage Machine and Tool maintenance records seamlessly.</p>
//                 </header>
//                  <div className="tab-pill-box">
//                         <button className={`tab-item-btn ${activeTab === 'MACHINE' ? 'active' : ''}`} onClick={() => handleTabChange('MACHINE')}>
//                             <i className="bi bi-gear-fill"></i> Machine Maint.
//                         </button>
//                         <button className={`tab-item-btn ${activeTab === 'TOOL' ? 'active' : ''}`} onClick={() => handleTabChange('TOOL')}>
//                             <i className="bi bi-wrench-adjustable"></i> Tool Maint.
//                         </button>
//                     </div>


//             </nav>

//             <div className="main-content">
//                 {/* <header className="text-center mb-5">
//                     <h1 className="hub-title">Maintenance Hub</h1>
//                     <p className="hub-subtitle">Manage Machine and Tool maintenance records seamlessly.</p>
//                 </header>

//                 <div className="tab-center-wrapper">
//                     <div className="tab-pill-box">
//                         <button className={`tab-item-btn ${activeTab === 'MACHINE' ? 'active' : ''}`} onClick={() => handleTabChange('MACHINE')}>
//                             <i className="bi bi-gear-fill"></i> Machine Maint.
//                         </button>
//                         <button className={`tab-item-btn ${activeTab === 'TOOL' ? 'active' : ''}`} onClick={() => handleTabChange('TOOL')}>
//                             <i className="bi bi-wrench-adjustable"></i> Tool Maint.
//                         </button>
//                     </div>
//                 </div> */}

//                 <div className="container" style={{maxWidth: '1200px'}}>
//                     {selectedFrequency && (
//                         <div className="text-start">
//                             <div className="back-navigation-ui" onClick={handleBackClick}>
//                                 <i className="bi bi-chevron-left"></i> Back to Categories
//                             </div>
//                         </div>
//                     )}

//                     <div className="row g-4 justify-content-center">
//                         {currentReports.map((report) => (
//                             <div key={report.id} className="col-md-6 col-lg-4">
//                                 <div className="report-card-ui" onClick={() => handleCardClick(report)}>
//                                     <div className="card-header-line" style={{backgroundColor: report.color}}></div>
//                                     <div className="icon-box-wrapper" style={{backgroundColor: `${report.color}15`, color: report.color}}>
//                                         <i className={`bi ${report.icon}`}></i>
//                                     </div>
//                                     <div className="card-main-title">{report.title}</div>
//                                     <div className="meta-pill-ui">Form: <b>{report.formNo || "AOT-F-PM-01"}</b></div>
//                                     <div className="meta-pill-ui">Freq: <b>{report.frequency || "Scheduled"}</b></div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {showOptionsModal && selectedCard && (
//                 <div className="modal-overlay-ui" onClick={closeModal} style={{position:'fixed', inset:0, background:'rgba(15,23,42,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:20000, backdropFilter:'blur(4px)'}}>
//                     <div style={{background:'white', padding:'35px', borderRadius:'24px', textAlign:'center', width:'90%', maxWidth:'400px'}}>
//                         <h4 className="fw-bolder mb-4">{selectedCard.title}</h4>
//                         <button className="btn btn-primary w-100 py-3 rounded-4 fw-bold mb-3 shadow-sm" style={{ background: '#4f46e5', border: 'none' }} onClick={() => navigateToForm(selectedCard.id)}>Fill Entry</button>
                      
//                         <button className="btn btn-light w-100 py-3 rounded-4 fw-bold text-muted" onClick={closeModal}>Cancel</button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default MaintenanceHub;
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
                    background-color: #f8fafc; 
                    font-family: 'Inter', sans-serif; 
                    padding-bottom: 80px;
                }

                /* --- Exact QA Hub Sticky Navbar --- */
                .nav-bar { 
                    position: sticky; 
                    top: 0; 
                    background: #fff; 
                    min-height: 70px; 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    padding: 15px 2rem; 
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05); 
                    z-index: 1000; 
                    gap: 15px; 
                }
                .qa-title { 
                    font-weight: 900; 
                    color: #3b82f6; 
                    margin: 0; 
                    cursor: pointer; 
                    font-size: 1.3rem; 
                    display: flex; 
                    align-items: center; 
                }

                /* --- Main Container Fluid Setup --- */
                .main-container { 
                    padding: 32px 24px; 
                    width: 100%; 
                    margin-left: 30px; 
                }

                /* --- Header Section (Clean Style) --- */
                .hub-header { 
                    text-align: center; 
                    padding: 15px 20px 10px; 
                }
                .hub-header h1 { 
                    font-size: 2.1rem; 
                    font-weight: 900; 
                    color: #3b82f6; 
                    margin-bottom: 4px; 
                }
                .hub-header p { 
                    color: #64748b; 
                    font-size: 0.95rem; 
                    max-width: 600px; 
                    margin: 0 auto; 
                }

                /* --- Exact QA Hub Tabs CSS --- */
                .tabs-container { 
                    display: flex; 
                    gap: 10px; 
                    background: #f1f5f9; 
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
                    color: #3b82f6; 
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
                    background: #fff; 
                    color: #3b82f6; 
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05); 
                }

                /* --- Grid matching structure exactly (No auto-stretching) --- */
                .reports-grid { 
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 80px;
                    width: 100%;
                    height:auto;
                }

                /* --- Exact QaHub Card Style --- */
                .card-custom { 
                    position: relative; 
                    background: #fff; 
                    border: 1px solid #e2e8f0; 
                    border-radius: 10px; 
                    padding: 1.5rem; 
                    cursor: pointer; 
                    transition: all 0.25s ease-in-out; 
                    height: 400px; 
                    width:400px;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02); 
                }
                .card-custom:hover { 
                    transform: translateY(-4px); 
                    border-color: #3b82f6; 
                    box-shadow: 0 12px 24px rgba(59, 130, 246, 0.08); 
                }
                
                .card-body-content {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                }

                .meta-tag { 
                    background: #f1f5f9; 
                    padding: 6px 10px; 
                    border-radius: 6px; 
                    font-size: 0.75rem; 
                    font-weight: 600; 
                    color: #475569; 
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
                .status-live { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
                .status-dev { background: #f8fafc; color: #475569; border: 1px solid #cbd5e1; }
                
                /* Icon Animations */
                .pulse-icon { animation: pulseAnim 2s infinite; font-size: 0.8rem; }
                @keyframes pulseAnim { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
                .spin-icon { animation: spinAnim 4s linear infinite; font-size: 0.8rem; }
                @keyframes spinAnim { 100% { transform: rotate(360deg); } }

                /* MODAL CSS (Exact matching QaHub modal structure) */
                .modal-overlay { 
                    position: fixed; 
                    inset: 0; 
                    background: rgba(15,23,42,0.5); 
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
                    background: #fff; 
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
                    background: #f1f5f9; 
                    border: none; 
                    border-radius: 4px; 
                    width: 32px; 
                    height: 32px; 
                    font-size: 16px; 
                    color: #64748b; 
                    cursor: pointer; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    transition: background 0.2s; 
                }
                .modal-close-btn:hover { background: #e2e8f0; }
                .modal-action-btn { 
                    display: flex; 
                    align-items: center; 
                    gap: 14px; 
                    padding: 14px 16px; 
                    border-radius: 8px; 
                    border: 1.5px solid #e2e8f0; 
                    background: #fff; 
                    cursor: pointer; 
                    text-align: left; 
                    width: 100%; 
                    transition: all 0.2s; 
                    margin-bottom: 10px; 
                    font-family: 'Inter', sans-serif; 
                }
                .modal-action-btn:hover { 
                    transform: translateY(-2px); 
                    box-shadow: 0 6px 18px rgba(0,0,0,0.09); 
                    border-color: #cbd5e1; 
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
                    <i className="bi bi-arrow-left-circle  m-2" style={{color: '#3b82f6'}}></i> Back To Dashboard
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
                            style={{ cursor: 'pointer', color: '#3b82f6', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', transition: '0.2s' }}
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

                                <div style={{width:'46px', height:'46px', borderRadius:'8px', background: `${report.color || '#3b82f6'}15`, color: report.color || '#3b82f6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', marginBottom:'1rem'}}>
                                    <i className={`bi ${report.icon}`}></i>
                                </div>

                                <h5 style={{fontWeight:800, fontSize:'0.95rem', color:'#0f172a', marginBottom:'1rem', paddingRight: '110px', lineHeight: '1.4'}}>{report.title}</h5>

                                <div className="card-body-content">
                                    <div className="meta-tag"><i className="bi bi-file-earmark-text text-muted"></i>Form: <span style={{color:'#0f172a'}}>{report.formNo || "AOT-F-PM-01"}</span></div>
                                    <div className="meta-tag mb-0"><i className="bi bi-calendar-event text-muted"></i>Freq: <span style={{color:'#0f172a'}}>{report.frequency || "Scheduled"}</span></div>
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
                                <div style={{width:46, height:46, borderRadius:8, background:`${selectedCard.color || '#3b82f6'}15`, color:selectedCard.color || '#3b82f6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', flexShrink:0}}>
                                    <i className={`bi ${selectedCard.icon}`}></i>
                                </div>
                                <div>
                                    <p style={{fontWeight:800, fontSize:'0.95rem', margin:0, color:'#0f172a'}}>{selectedCard.title}</p>
                                    <p style={{fontSize:'0.75rem', color:'#64748b', margin:0}}>Form: {selectedCard.formNo || "AOT-F-PM-01"}</p>
                                </div>
                            </div>

                            <div style={{borderTop:'1px solid #f1f5f9', margin:'16px 0'}}></div>
                            <p style={{fontSize:'0.78rem', color:'#94a3b8', fontWeight:600, marginBottom:14, textTransform:'uppercase', letterSpacing:'0.06em'}}>What would you like to do?</p>

                            <button className="modal-action-btn" onClick={() => navigateToForm(selectedCard.id)}>
                                <div className="modal-btn-icon" style={{background:'#f1f5f9', color:'#0f172a'}}>
                                    <i className="bi bi-pencil-square"></i>
                                </div>
                                <div>
                                    <p style={{fontWeight:700, fontSize:'0.9rem', margin:0, color:'#0f172a'}}>Fill Entry</p>
                                    <p style={{fontSize:'0.75rem', color:'#64748b', margin:0}}>Open this form to submit new data</p>
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