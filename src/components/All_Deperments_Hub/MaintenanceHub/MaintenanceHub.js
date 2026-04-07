import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// Data imports
import { frequencyCards } from './data/machineData'; 
import { toolFrequencyCards } from './data/ToolMachineData'; 

const MaintenanceHub = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // 🔥 Exact Logic: Detect tab from URL
    const isToolTab = location.pathname.includes('/Tool-Hub');
    const [activeTab, setActiveTab] = useState(isToolTab ? 'TOOL' : 'MACHINE');
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    // Sync active tab state with URL changes
    useEffect(() => {
        setActiveTab(isToolTab ? 'TOOL' : 'MACHINE');
    }, [location.pathname, isToolTab]);

    const currentReports = activeTab === 'MACHINE' ? frequencyCards : toolFrequencyCards;

    // 🔥 Exact Logic: Change Route + State
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'TOOL') {
            navigate('/Maintenance/Tool-Hub');
        } else {
            navigate('/Maintenance/Machine-Hub');
        }
    };

   const handleCardClick = (report) => {
        if (activeTab === 'MACHINE') {
            // ✅ Machine Modular Routes (src/routes/MachineRoutes.js)
            if (report.id === 'daily') navigate('/Maintenance/Machine/Daily-Reports');
            else if (report.id === 'weekly') navigate('/Maintenance/Machine/Weekly-Reports');
            else if (report.id === 'monthly') navigate('/Maintenance/Machine/Monthly-Reports');
            else if (report.id === 'yearly') navigate('/Maintenance/Machine/Yearly-Reports');
        } else {
            // ✅ Tool Modular Routes (src/routes/ToolRoutes.js)
            if (report.id === 'tool_daily') {
                navigate('/Maintenance/Tool/Daily-Reports');
            } else if (report.id === 'tool_weekly') {
                navigate('/Maintenance/Tool/Weekly-Checklist'); 
            } else {
                // For other Tool cards like Stroke/PM, open the Selection Modal
                setSelectedCard(report);
                setShowOptionsModal(true);
            }
        }
    };

    const closeModal = (e) => {
        if (e) e.stopPropagation();
        setShowOptionsModal(false);
        setSelectedCard(null);
    };

    return (
        <div className="maintenance-page-wrapper">
            {/* Bootstrap & Icons */}
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            
            <style>{`
                .maintenance-page-wrapper { background-color: #f8fafc; min-height: 100vh; font-family: 'Inter', sans-serif; position: relative; }
                .dashboard-navbar { position: fixed; top: 0; width: 100%; height: 70px; background: white; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; padding: 0 2rem; z-index: 1000; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
                .main-container { padding-top: 110px; padding-bottom: 80px; max-width: 1200px; margin: 0 auto; }
                
                .dashboard-header { text-align: center; margin-bottom: 3rem; }
                .dashboard-title { font-weight: 900; color: #0f172a; font-size: 2.8rem; letter-spacing: -1.5px; margin-bottom: 0.5rem; }
                
                .tab-container { display: flex; justify-content: center; margin-bottom: 3.5rem; }
                .custom-tabs { background-color: #e2e8f0; padding: 6px; border-radius: 50px; display: inline-flex; gap: 8px; }
                .tab-btn { padding: 10px 25px; border-radius: 50px; border: none; font-weight: 800; color: #64748b; background: transparent; transition: 0.3s; cursor: pointer; }
                .tab-btn.active { background-color: #ffffff; color: #4f46e5; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }

                /* Card Design from your Screenshots */
                .hub-card { background: white; border-radius: 20px; padding: 30px; border: 1px solid #f1f5f9; box-shadow: 0 10px 30px rgba(0,0,0,0.02); cursor: pointer; transition: 0.3s; position: relative; height: 100%; overflow: hidden; display: flex; flex-direction: column; }
                .hub-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.06); }
                
                /* Top Accent Color Line */
                .card-accent { position: absolute; top: 0; left: 0; right: 0; height: 6px; }
                
                .icon-box { width: 60px; height: 60px; border-radius: 15px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 25px; }
                .report-title { font-weight: 800; color: #1e293b; margin-bottom: 20px; font-size: 1.25rem; }
                
                /* Meta Tags (Form, Freq, Resp) */
                .info-tag { display: flex; align-items: center; gap: 10px; background: #f1f5f9; padding: 6px 12px; border-radius: 8px; margin-bottom: 8px; width: fit-content; font-size: 0.85rem; font-weight: 600; color: #475569; }
                .info-tag i { color: #94a3b8; }
                .info-tag span { color: #0f172a; font-weight: 800; }

                /* Modal styling */
                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.5); display: flex; justify-content: center; align-items: center; z-index: 10000; backdrop-filter: blur(4px); }
                .modal-content-custom { background: white; border-radius: 20px; padding: 30px; width: 400px; box-shadow: 0 25px 50px rgba(0,0,0,0.2); border: none; }
            `}</style>

            <nav className="dashboard-navbar text-slate-700">
                <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => navigate('/dashboard')}>
                    <i className="bi bi-arrow-left me-2"></i> <strong>Maintenance Hub</strong>
                </div>
            </nav>

            <div className="container main-container">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">
                        {activeTab === 'MACHINE' ? 'Machine Maintenance Hub' : 'Tool Maintenance Hub'}
                    </h1>
                    <p className="text-muted fs-5">Manage and track high-performance maintenance records.</p>
                </div>

                <div className="tab-container">
                    <div className="custom-tabs">
                        <button className={`tab-btn ${activeTab === 'MACHINE' ? 'active' : ''}`} onClick={() => handleTabChange('MACHINE')}>
                            <i className="bi bi-gear-wide-connected me-2"></i> Machine Maint.
                        </button>
                        <button className={`tab-btn ${activeTab === 'TOOL' ? 'active' : ''}`} onClick={() => handleTabChange('TOOL')}>
                            <i className="bi bi-tools me-2"></i> Tool Maint.
                        </button>
                    </div>
                </div>

                <div className="row g-4 justify-content-center">
                    {currentReports.map((report) => (
                        <div key={report.id} className="col-12 col-md-6 col-lg-4">
                            <div className="hub-card" onClick={() => handleCardClick(report)}>
                                <div className="card-accent" style={{ background: report.color }}></div>
                                <div className="icon-box" style={{ background: report.bgColor, color: report.color }}>
                                    <i className={`bi ${report.icon}`}></i>
                                </div>
                                <h3 className="report-title">{report.title}</h3>
                                <div className="info-tag"><i className="bi bi-file-earmark-text"></i> Form: <span>{report.formNo}</span></div>
                                <div className="info-tag"><i className="bi bi-arrow-repeat"></i> Freq: <span>{report.frequency}</span></div>
                                <div className="info-tag"><i className="bi bi-person-badge"></i> Resp: <span>{report.responsibility}</span></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for Tool Cards that are not Direct Forms */}
            {showOptionsModal && selectedCard && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
                        <h3 className="fw-bold mb-4" style={{ color: '#0f172a' }}>{selectedCard.title}</h3>
                        <button className="btn w-100 py-3 mb-2 text-white fw-bold" style={{ backgroundColor: selectedCard.color, borderRadius: '12px' }} onClick={() => navigate("/Tool-History-Form")}>
                            <i className="bi bi-pencil-square me-2"></i> Fill Maintenance Data
                        </button>
                        <button className="btn btn-light border w-100 py-3 mb-3 fw-bold" style={{ borderRadius: '12px' }}>
                            <i className="bi bi-printer me-2"></i> Print Empty Form
                        </button>
                        <button className="btn btn-danger w-100 py-3 fw-bold" style={{ borderRadius: '12px' }} onClick={closeModal}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaintenanceHub;