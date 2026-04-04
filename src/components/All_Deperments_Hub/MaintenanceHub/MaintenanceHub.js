// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { frequencyCards, toolReports } from './data/machineData';

// const MaintenanceHub = () => {
//     const navigate = useNavigate();
    
//     const [activeTab, setActiveTab] = useState('MACHINE');
//     const [showOptionsModal, setShowOptionsModal] = useState(false);
//     const [selectedCard, setSelectedCard] = useState(null);

//     // Jab Machine tab select hoga, toh sirf 4 frequency cards dikhenge
//     const currentReports = activeTab === 'MACHINE' ? frequencyCards : toolReports;

//     const navigateToForm = (reportId, title) => {
//         switch (reportId) {
//             case "tool_history": navigate("/Tool-History-Form"); break;
//             case "tool_stroke": navigate("/Tool-Stroke-PM"); break;
//             case "tool_pm_check": navigate("/Tool-PM-Checklist-Form"); break;
//             case "tool_breakdown": navigate("/Tool-Breakdown-Form"); break;
//             default: alert(`🚧 The form for "${title}" is coming soon!`);
//         }
//     };

//     // 🔥 EXACT ROUTING LOGIC (NO DESIGN CHANGES) 🔥
//     const handleCardClick = (report) => {
//         if (report.id === 'daily') {
//             navigate('/Maintenance/Daily-Reports');
//         } else if (report.id === 'weekly') {
//             navigate('/Maintenance/Weekly-Reports');
//         } else if (report.id === 'monthly' || report.id === 'yearly') {
//             navigate('/Maintenance/Yearly-Reports');
//         } else if (report.id === 'quarterly') {
//             navigate('/Maintenance/Quarterly-Reports');
//         } else {
//             // Tool cards ke liye modal open hoga
//             setSelectedCard(report);
//             setShowOptionsModal(true);
//         }
//     };

//     const handleOptionSelect = (option) => {
//         if (option === 'fill' && selectedCard) navigateToForm(selectedCard.id, selectedCard.title);
//         closeModal();
//     };

//     const closeModal = (e) => {
//         if (e) e.stopPropagation();
//         setShowOptionsModal(false);
//         setSelectedCard(null);
//     };

//     const handleTabChange = (tab) => {
//         setActiveTab(tab);
//     };

//     return (
//         <div className="maintenance-page-wrapper">
//             <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
//             <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            
//             {/* EXACT SAME CSS YOU PROVIDED */}
//             <style>{`
//                 .maintenance-page-wrapper { position: absolute !important; top: 0 !important; left: 0 !important; width: 100vw !important; min-height: 100vh !important; background-color: #f8fafc !important; z-index: 9999 !important; overflow-y: auto !important; overflow-x: hidden !important; margin: 0 !important; padding: 0 !important; font-family: 'Inter', 'Segoe UI', sans-serif !important; }
//                 .dashboard-navbar { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 70px !important; background-color: #ffffff !important; border-bottom: 1px solid #e2e8f0 !important; z-index: 10000 !important; display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 0 2rem !important; box-sizing: border-box !important; box-shadow: 0 2px 10px rgba(0,0,0,0.05) !important; margin: 0 !important; }
//                 .brand-logo { font-weight: 900 !important; color: #4f46e5 !important; font-size: 1.4rem !important; letter-spacing: -0.5px !important; display: flex !important; align-items: center !important; gap: 8px !important; cursor: pointer; }
//                 @keyframes scaleUpFade { 0% { opacity: 0; transform: translateY(30px) scale(0.95); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
//                 .animate-card { opacity: 0; animation: scaleUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
//                 .main-container { padding-top: 120px !important; padding-bottom: 80px !important; padding-left: 24px !important; padding-right: 24px !important; max-width: 1200px !important; margin: 0 auto !important; box-sizing: border-box !important; }
//                 .dashboard-header { text-align: center; margin-bottom: 2rem; }
//                 .dashboard-title { font-weight: 900 !important; color: #0f172a !important; font-size: 2.8rem !important; letter-spacing: -1px !important; margin-bottom: 0.5rem !important;}
//                 .dashboard-subtitle { color: #64748b !important; font-size: 1.1rem !important; font-weight: 500 !important;}
//                 .tab-container { display: flex; justify-content: center; margin-bottom: 3.5rem; }
//                 .custom-tabs { background-color: #e2e8f0; padding: 0.4rem; border-radius: 99px; display: inline-flex; gap: 0.5rem; }
//                 .tab-btn { padding: 0.8rem 2rem; border-radius: 99px; border: none; font-weight: 800; font-size: 0.95rem; transition: all 0.3s ease; cursor: pointer; color: #64748b; background: transparent; }
//                 .tab-btn.active { background-color: #ffffff; color: #4f46e5; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
//                 .module-card { background: #ffffff !important; border: 1px solid #e2e8f0 !important; border-radius: 16px !important; padding: 2rem !important; cursor: pointer !important; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; height: 100% !important; position: relative !important; overflow: hidden !important; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important; }
//                 .module-card:hover { transform: translateY(-8px) !important; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important; border-color: transparent !important; }
//                 .module-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 5px; background: var(--card-color); opacity: 0.8; transition: 0.3s; }
//                 .module-card:hover::before { opacity: 1; height: 6px; }
//                 .icon-wrapper { width: 60px; height: 60px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 1.5rem; transition: 0.3s; }
//                 .module-card:hover .icon-wrapper { transform: scale(1.1) rotate(5deg); }
//                 .card-title-custom { font-weight: 800 !important; font-size: 1.15rem !important; color: #0f172a !important; margin-bottom: 1rem !important; }
//                 .meta-tag { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: #475569; background: #f1f5f9; padding: 4px 10px; border-radius: 6px; margin-bottom: 8px; font-weight: 600; }
//                 .go-arrow { position: absolute; bottom: 2rem; right: 2rem; font-size: 1.5rem; color: #e2e8f0; transition: 0.3s; opacity: 0; transform: translateX(-10px); }
//                 .module-card:hover .go-arrow { color: var(--card-color); opacity: 1; transform: translateX(0); }
//                 .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 100000; padding: 16px; }
//                 .modal-content { background: white; border-radius: 16px; padding: 24px; max-width: 420px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); border: none; }
//                 .modal-header-custom { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9; gap: 15px;}
//                 .modal-title-custom { font-weight: 800; color: #0f172a; margin: 0; font-size: 1.25rem; line-height: 1.3; }
//                 .modal-form-info { text-align: right; min-width: 120px;}
//                 .option-btn { width: 100%; padding: 14px 16px; margin: 6px 0; border: none; border-radius: 10px; font-size: 0.95rem; font-weight: 700; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 10px; }
//                 .option-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
//                 .fill-btn { background: #5a75f9; color: white; }
//                 .fill-btn:hover { background: #4762e6; }
//                 .print-btn { background: #00c48c; color: white; }
//                 .print-btn:hover { background: #00a877; }
//                 .close-btn { background: #f43f5e; color: white; margin-top: 10px; }
//                 .close-btn:hover { background: #e11d48; }
//                 @media (max-width: 768px) {
//                     .dashboard-navbar { padding: 0 1rem !important; }
//                     .main-container { padding: 100px 16px 60px 16px !important; }
//                     .dashboard-title { font-size: 2rem !important; }
//                     .module-card { padding: 1.5rem !important; }
//                     .tab-btn { padding: 0.6rem 1.2rem; font-size: 0.85rem; }
//                 }
//             `}</style>

//             <nav className="dashboard-navbar">
//                 <div className="brand-logo" onClick={() => navigate('/dashboard')}>
//                     <i className="bi bi-arrow-left-circle text-muted me-2" style={{fontSize: '1.2rem', transition: '0.2s'}}></i> 
//                     <i className="bi bi-wrench-adjustable"></i> Maintenance Hub
//                 </div>
//             </nav>

//             <div className="main-container">
//                 <div className="dashboard-header animate-card" style={{animationDelay: '0s'}}>
//                     <h1 className="dashboard-title">Maintenance Hub</h1>
//                     <p className="dashboard-subtitle">Manage Machine and Tool maintenance records seamlessly.</p>
//                 </div>

//                 <div className="tab-container animate-card" style={{animationDelay: '0.1s'}}>
//                     <div className="custom-tabs">
//                         <button className={`tab-btn ${activeTab === 'MACHINE' ? 'active' : ''}`} onClick={() => handleTabChange('MACHINE')}>
//                             <i className="bi bi-gear-wide-connected me-2"></i> Machine Maint.
//                         </button>
//                         <button className={`tab-btn ${activeTab === 'TOOL' ? 'active' : ''}`} onClick={() => handleTabChange('TOOL')}>
//                             <i className="bi bi-tools me-2"></i> Tool Maint.
//                         </button>
//                     </div>
//                 </div>

//                 <div className="row justify-content-center g-4">
//                     {currentReports.length > 0 ? currentReports.map((report, index) => (
//                         <div key={report.id} className="col-md-6 col-lg-4 animate-card" style={{animationDelay: `${0.2 + (Math.min(index, 10) * 0.05)}s`}}>
//                             <div className="module-card" style={{'--card-color': report.color}} onClick={() => handleCardClick(report)}>
//                                 <div className="icon-wrapper" style={{backgroundColor: report.bgColor, color: report.color}}>
//                                     <i className={`bi ${report.icon}`}></i>
//                                 </div>
//                                 <h3 className="card-title-custom">{report.title}</h3>
                                
//                                 <div className="d-flex flex-column align-items-start mt-3">
//                                     <div className="meta-tag"><i className="bi bi-file-earmark-text text-muted"></i> Form: <span style={{color: '#0f172a'}}>{report.formNo}</span></div>
//                                     <div className="meta-tag"><i className="bi bi-arrow-repeat text-muted"></i> Freq: <span style={{color: '#0f172a'}}>{report.frequency}</span></div>
//                                     <div className="meta-tag"><i className="bi bi-person-badge text-muted"></i> Resp: <span style={{color: '#0f172a'}}>{report.responsibility}</span></div>
//                                 </div>
                                
//                                 <i className="bi bi-arrow-right go-arrow"></i>
//                             </div>
//                         </div>
//                     )) : (
//                         <div className="text-center text-muted mt-5 animate-card">
//                             <i className="bi bi-clock-history fs-1"></i>
//                             <p className="mt-2 fw-semibold">Reports coming soon for this category.</p>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* MODAL COMPONENT (Only for Tools now) */}
//             {showOptionsModal && selectedCard && (
//                 <div className="modal-overlay" onClick={closeModal}>
//                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                         <div className="modal-header-custom">
//                             <h3 className="modal-title-custom">{selectedCard.title}</h3>
//                             <div className="modal-form-info text-muted">
//                                 <span style={{ fontSize: '0.8rem', display: 'block' }}>Form No:</span>
//                                 <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{selectedCard.formNo}</span>
//                             </div>
//                         </div>
//                         <button className="option-btn fill-btn" onClick={() => handleOptionSelect('fill')}><i className="bi bi-pencil-square"></i> Fill Data</button>
//                         <button className="option-btn print-btn" onClick={() => handleOptionSelect('print')}><i className="bi bi-printer"></i> Print Data</button>
//                         <button className="option-btn close-btn" onClick={(e) => { e.stopPropagation(); closeModal(); }}><i className="bi bi-x-circle"></i> Cancel</button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default MaintenanceHub;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { frequencyCards, toolReports } from './data/machineData';

const MaintenanceHub = () => {
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState('MACHINE');
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    // Jab Machine tab select hoga, toh sirf 4 frequency cards dikhenge
    const currentReports = activeTab === 'MACHINE' ? frequencyCards : toolReports;

    const navigateToForm = (reportId, title) => {
        switch (reportId) {
            case "tool_history": navigate("/Tool-History-Form"); break;
            case "tool_stroke": navigate("/Tool-Stroke-PM"); break;
            case "tool_pm_check": navigate("/Tool-PM-Checklist-Form"); break;
            case "tool_breakdown": navigate("/Tool-Breakdown-Form"); break;
            default: alert(`🚧 The form for "${title}" is coming soon!`);
        }
    };

    // 🔥 EXACT ROUTING LOGIC (NO DESIGN CHANGES) 🔥
    const handleCardClick = (report) => {
        if (report.id === 'daily') {
            navigate('/Maintenance/Daily-Reports');
        } else if (report.id === 'weekly') {
            navigate('/Maintenance/Weekly-Reports');
        } else if (report.id === 'monthly' || report.id === 'yearly') {
            navigate('/Maintenance/Yearly-Reports');
        } else if (report.id === 'quarterly') {
            navigate('/Maintenance/Quarterly-Reports');
        } else {
            // Tool cards ke liye modal open hoga
            setSelectedCard(report);
            setShowOptionsModal(true);
        }
    };

    const handleOptionSelect = (option) => {
        if (option === 'fill' && selectedCard) navigateToForm(selectedCard.id, selectedCard.title);
        closeModal();
    };

    const closeModal = (e) => {
        if (e) e.stopPropagation();
        setShowOptionsModal(false);
        setSelectedCard(null);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="maintenance-page-wrapper">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            
            {/* EXACT SAME CSS YOU PROVIDED */}
            <style>{`
                .maintenance-page-wrapper { position: absolute !important; top: 0 !important; left: 0 !important; width: 100vw !important; min-height: 100vh !important; background-color: #f8fafc !important; z-index: 9999 !important; overflow-y: auto !important; overflow-x: hidden !important; margin: 0 !important; padding: 0 !important; font-family: 'Inter', 'Segoe UI', sans-serif !important; }
                .dashboard-navbar { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 70px !important; background-color: #ffffff !important; border-bottom: 1px solid #e2e8f0 !important; z-index: 10000 !important; display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 0 2rem !important; box-sizing: border-box !important; box-shadow: 0 2px 10px rgba(0,0,0,0.05) !important; margin: 0 !important; }
                
                @keyframes scaleUpFade { 0% { opacity: 0; transform: translateY(30px) scale(0.95); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
                .animate-card { opacity: 0; animation: scaleUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .main-container { padding-top: 120px !important; padding-bottom: 80px !important; padding-left: 24px !important; padding-right: 24px !important; max-width: 1200px !important; margin: 0 auto !important; box-sizing: border-box !important; }
                .dashboard-header { text-align: center; margin-bottom: 2rem; }
                .dashboard-title { font-weight: 900 !important; color: #0f172a !important; font-size: 2.8rem !important; letter-spacing: -1px !important; margin-bottom: 0.5rem !important;}
                .dashboard-subtitle { color: #64748b !important; font-size: 1.1rem !important; font-weight: 500 !important;}
                .tab-container { display: flex; justify-content: center; margin-bottom: 3.5rem; }
                .custom-tabs { background-color: #e2e8f0; padding: 0.4rem; border-radius: 99px; display: inline-flex; gap: 0.5rem; }
                .tab-btn { padding: 0.8rem 2rem; border-radius: 99px; border: none; font-weight: 800; font-size: 0.95rem; transition: all 0.3s ease; cursor: pointer; color: #64748b; background: transparent; }
                .tab-btn.active { background-color: #ffffff; color: #4f46e5; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
                .module-card { background: #ffffff !important; border: 1px solid #e2e8f0 !important; border-radius: 16px !important; padding: 2rem !important; cursor: pointer !important; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; height: 100% !important; position: relative !important; overflow: hidden !important; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important; }
                .module-card:hover { transform: translateY(-8px) !important; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important; border-color: transparent !important; }
                .module-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 5px; background: var(--card-color); opacity: 0.8; transition: 0.3s; }
                .module-card:hover::before { opacity: 1; height: 6px; }
                .icon-wrapper { width: 60px; height: 60px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 1.5rem; transition: 0.3s; }
                .module-card:hover .icon-wrapper { transform: scale(1.1) rotate(5deg); }
                .card-title-custom { font-weight: 800 !important; font-size: 1.15rem !important; color: #0f172a !important; margin-bottom: 1rem !important; }
                .meta-tag { display: flex; align-items: center; gap: 6px; font-size: 0.8rem; color: #475569; background: #f1f5f9; padding: 4px 10px; border-radius: 6px; margin-bottom: 8px; font-weight: 600; }
                .go-arrow { position: absolute; bottom: 2rem; right: 2rem; font-size: 1.5rem; color: #e2e8f0; transition: 0.3s; opacity: 0; transform: translateX(-10px); }
                .module-card:hover .go-arrow { color: var(--card-color); opacity: 1; transform: translateX(0); }
                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 100000; padding: 16px; }
                .modal-content { background: white; border-radius: 16px; padding: 24px; max-width: 420px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); border: none; }
                .modal-header-custom { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9; gap: 15px;}
                .modal-title-custom { font-weight: 800; color: #0f172a; margin: 0; font-size: 1.25rem; line-height: 1.3; }
                .modal-form-info { text-align: right; min-width: 120px;}
                .option-btn { width: 100%; padding: 14px 16px; margin: 6px 0; border: none; border-radius: 10px; font-size: 0.95rem; font-weight: 700; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 10px; }
                .option-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
                .fill-btn { background: #5a75f9; color: white; }
                .fill-btn:hover { background: #4762e6; }
                .print-btn { background: #00c48c; color: white; }
                .print-btn:hover { background: #00a877; }
                .close-btn { background: #f43f5e; color: white; margin-top: 10px; }
                .close-btn:hover { background: #e11d48; }
                @media (max-width: 768px) {
                    .dashboard-navbar { padding: 0 1rem !important; }
                    .main-container { padding: 100px 16px 60px 16px !important; }
                    .dashboard-title { font-size: 2rem !important; }
                    .module-card { padding: 1.5rem !important; }
                    .tab-btn { padding: 0.6rem 1.2rem; font-size: 0.85rem; }
                }
            `}</style>

            <nav className="dashboard-navbar">
                <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => navigate('/dashboard')}>
                    <i className="bi bi-arrow-left text-muted me-3 fs-5"></i> 
                    <span className="fw-bold fs-5" style={{color: '#0f172a'}}>Maintenance Hub</span>
                </div>
            </nav>

            <div className="main-container">
                <div className="dashboard-header animate-card" style={{animationDelay: '0s'}}>
                    <h1 className="dashboard-title">Maintenance Hub</h1>
                    <p className="dashboard-subtitle">Manage Machine and Tool maintenance records seamlessly.</p>
                </div>

                <div className="tab-container animate-card" style={{animationDelay: '0.1s'}}>
                    <div className="custom-tabs">
                        <button className={`tab-btn ${activeTab === 'MACHINE' ? 'active' : ''}`} onClick={() => handleTabChange('MACHINE')}>
                            <i className="bi bi-gear-wide-connected me-2"></i> Machine Maint.
                        </button>
                        <button className={`tab-btn ${activeTab === 'TOOL' ? 'active' : ''}`} onClick={() => handleTabChange('TOOL')}>
                            <i className="bi bi-tools me-2"></i> Tool Maint.
                        </button>
                    </div>
                </div>

                <div className="row justify-content-center g-4">
                    {currentReports.length > 0 ? currentReports.map((report, index) => (
                        <div key={report.id} className="col-md-6 col-lg-4 animate-card" style={{animationDelay: `${0.2 + (Math.min(index, 10) * 0.05)}s`}}>
                            <div className="module-card" style={{'--card-color': report.color}} onClick={() => handleCardClick(report)}>
                                <div className="icon-wrapper" style={{backgroundColor: report.bgColor, color: report.color}}>
                                    <i className={`bi ${report.icon}`}></i>
                                </div>
                                <h3 className="card-title-custom">{report.title}</h3>
                                
                                <div className="d-flex flex-column align-items-start mt-3">
                                    <div className="meta-tag"><i className="bi bi-file-earmark-text text-muted"></i> Form: <span style={{color: '#0f172a'}}>{report.formNo}</span></div>
                                    <div className="meta-tag"><i className="bi bi-arrow-repeat text-muted"></i> Freq: <span style={{color: '#0f172a'}}>{report.frequency}</span></div>
                                    <div className="meta-tag"><i className="bi bi-person-badge text-muted"></i> Resp: <span style={{color: '#0f172a'}}>{report.responsibility}</span></div>
                                </div>
                                
                                <i className="bi bi-arrow-right go-arrow"></i>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center text-muted mt-5 animate-card">
                            <i className="bi bi-clock-history fs-1"></i>
                            <p className="mt-2 fw-semibold">Reports coming soon for this category.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL COMPONENT (Only for Tools now) */}
            {showOptionsModal && selectedCard && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header-custom">
                            <h3 className="modal-title-custom">{selectedCard.title}</h3>
                            <div className="modal-form-info text-muted">
                                <span style={{ fontSize: '0.8rem', display: 'block' }}>Form No:</span>
                                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{selectedCard.formNo}</span>
                            </div>
                        </div>
                        <button className="option-btn fill-btn" onClick={() => handleOptionSelect('fill')}><i className="bi bi-pencil-square"></i> Fill Data</button>
                        <button className="option-btn print-btn" onClick={() => handleOptionSelect('print')}><i className="bi bi-printer"></i> Print Data</button>
                        <button className="option-btn close-btn" onClick={(e) => { e.stopPropagation(); closeModal(); }}><i className="bi bi-x-circle"></i> Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaintenanceHub;