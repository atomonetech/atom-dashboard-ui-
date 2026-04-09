import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// 🔥 Dual Data Imports
import { 
    frequencyCards, 
    machineDailyReports, 
    weeklyMachineSubReports 
} from './data/machineData';

import { 
    toolFrequencyCards, 
    toolReports, 
    weeklyToolSubReports 
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
    } else {
        if (!selectedFrequency) currentReports = toolFrequencyCards;
        else if (selectedFrequency === 'daily') currentReports = toolReports;
        else if (selectedFrequency === 'weekly') currentReports = weeklyToolSubReports;
    }

    // 🔥 CARD CLICK LOGIC (Direct Linking Integrated)
    const handleCardClick = (report) => {
        const frequencies = ['daily', 'weekly', 'monthly', 'yearly'];
        
        // Specifc Check: Tool Weekly bypass intermediate cards
        if (report.id === 'weekly' && activeTab === 'TOOL') {
            navigate("/Maintenance/Tool/welding-fixture-checklist");
            return;
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
        const basePath = activeTab === 'TOOL' ? '/Maintenance/Tool' : '/Maintenance/Machine';
        
        switch (reportId) {
            case "mc_history": navigate(`${basePath}/history-card`); break;
            case "power_press_check": navigate(`${basePath}/power-press-checksheet`); break;
            case "mc_breakdown": navigate(`${basePath}/breakdown-form`); break;
            case "tool_history": navigate(`${basePath}/history-form`); break;
            case "tool_pm_check": navigate(`${basePath}/pm-checklist`); break;
            case "tool_breakdown": navigate(`${basePath}/breakdown-form`); break;
            case "weekly_pm_welding_fixture": navigate(`${basePath}/welding-fixture-checklist`); break;
            default:
                if (reportId.startsWith('weekly_pm_')) {
                    const slug = reportId.split('_').pop();
                    navigate(`${basePath}/preventive-${slug}`);
                }
        }
        closeModal();
    };

    const closeModal = () => { setShowOptionsModal(false); setSelectedCard(null); };

    return (
        <div className="maintenance-hub-root">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            
            <style>{`
                .maintenance-hub-root { position: fixed; inset: 0; background-color: #f1f4f9; z-index: 9999; overflow-y: auto; font-family: 'Inter', sans-serif; }
                .hub-main-navbar { position: fixed; top: 0; width: 100%; height: 75px; background: white; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; border-bottom: 1px solid #eef2f6; z-index: 10000; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
                .nav-brand-section { font-weight: 800; color: #4f46e5; font-size: 1.25rem; display: flex; align-items: center; gap: 12px; cursor: pointer; text-decoration: none; }
                .main-content { padding: 115px 20px 80px; max-width: 1300px; margin: 0 auto; text-align: center; }
                .hub-title { font-weight: 900; color: #0f172a; font-size: 3rem; margin-bottom: 5px; }
                .hub-subtitle { color: #64748b; font-size: 1.1rem; margin-bottom: 40px; }
                .tab-center-wrapper { display: flex; justify-content: center; margin-bottom: 60px; }
                .tab-pill-box { background: #e2e8f0; padding: 6px; border-radius: 50px; display: flex; gap: 5px; border: 1px solid #cbd5e1; }
                .tab-item-btn { padding: 10px 25px; border-radius: 50px; border: none; font-weight: 700; font-size: 0.9rem; transition: 0.3s; color: #64748b; background: transparent; display: flex; align-items: center; gap: 8px; cursor: pointer; }
                .tab-item-btn.active { background: white; color: #4f46e5; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
                .report-card-ui { background: white; border-radius: 20px; padding: 35px 25px; text-align: left; border: 1px solid #eef2f6; transition: 0.3s; cursor: pointer; height: 100%; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.02); }
                .report-card-ui:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
                .card-header-line { position: absolute; top: 0; left: 0; right: 0; height: 5px; border-radius: 20px 20px 0 0; }
                .icon-box-wrapper { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 25px; }
                .card-main-title { font-weight: 800; color: #0f172a; font-size: 1.3rem; margin-bottom: 25px; }
                .meta-pill-ui { display: flex; align-items: center; gap: 12px; background: #f8fafc; padding: 8px 14px; border-radius: 10px; border: 1px solid #f1f5f9; font-size: 0.8rem; color: #64748b; font-weight: 600; width: fit-content; margin-bottom: 8px; }
                .back-navigation-ui { cursor: pointer; color: #4f46e5; font-weight: 700; margin-bottom: 25px; display: inline-flex; align-items: center; gap: 8px; font-size: 0.95rem; }
            `}</style>

            <nav className="hub-main-navbar">
                <div className="nav-brand-section" onClick={() => navigate('/dashboard')}>
                    <i className="bi bi-arrow-left text-muted"></i>
                    <i className="bi bi-gear-fill"></i> Maintenance Hub
                </div>
            </nav>

            <div className="main-content">
                <header className="text-center mb-5">
                    <h1 className="hub-title">Maintenance Hub</h1>
                    <p className="hub-subtitle">Manage Machine and Tool maintenance records seamlessly.</p>
                </header>

                <div className="tab-center-wrapper">
                    <div className="tab-pill-box">
                        <button className={`tab-item-btn ${activeTab === 'MACHINE' ? 'active' : ''}`} onClick={() => handleTabChange('MACHINE')}>
                            <i className="bi bi-gear-fill"></i> Machine Maint.
                        </button>
                        <button className={`tab-item-btn ${activeTab === 'TOOL' ? 'active' : ''}`} onClick={() => handleTabChange('TOOL')}>
                            <i className="bi bi-wrench-adjustable"></i> Tool Maint.
                        </button>
                    </div>
                </div>

                <div className="container" style={{maxWidth: '1200px'}}>
                    {selectedFrequency && (
                        <div className="text-start">
                            <div className="back-navigation-ui" onClick={handleBackClick}>
                                <i className="bi bi-chevron-left"></i> Back to Categories
                            </div>
                        </div>
                    )}

                    <div className="row g-4 justify-content-center">
                        {currentReports.map((report) => (
                            <div key={report.id} className="col-md-6 col-lg-4">
                                <div className="report-card-ui" onClick={() => handleCardClick(report)}>
                                    <div className="card-header-line" style={{backgroundColor: report.color}}></div>
                                    <div className="icon-box-wrapper" style={{backgroundColor: `${report.color}15`, color: report.color}}>
                                        <i className={`bi ${report.icon}`}></i>
                                    </div>
                                    <div className="card-main-title">{report.title}</div>
                                    <div className="meta-pill-ui">Form: <b>{report.formNo || "AOT-F-PM-01"}</b></div>
                                    <div className="meta-pill-ui">Freq: <b>{report.frequency || "Scheduled"}</b></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showOptionsModal && selectedCard && (
                <div className="modal-overlay-ui" onClick={closeModal} style={{position:'fixed', inset:0, background:'rgba(15,23,42,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:20000, backdropFilter:'blur(4px)'}}>
                    <div style={{background:'white', padding:'35px', borderRadius:'24px', textAlign:'center', width:'90%', maxWidth:'400px'}}>
                        <h4 className="fw-bolder mb-4">{selectedCard.title}</h4>
                        <button className="btn btn-primary w-100 py-3 rounded-4 fw-bold mb-3 shadow-sm" style={{background: '#4f46e5', border: 'none'}} onClick={() => navigateToForm(selectedCard.id)}>Fill Entry</button>
                        <button className="btn btn-light w-100 py-3 rounded-4 fw-bold text-muted" onClick={closeModal}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaintenanceHub;