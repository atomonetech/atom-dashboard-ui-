import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toolYearlyReports } from '../data/ToolMachineData';

const ToolYearlyReport = () => {
    const navigate = useNavigate();
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const handleCardClick = (report) => {
        setSelectedCard(report);
        setShowOptionsModal(true);
    };

    const handleAction = (actionType) => {
        const basePath = "/Maintenance/Tool";
        const reportId = selectedCard.id;

        if (actionType === 'FILL') {
            switch (reportId) {
                case "master_list_tool": navigate(`${basePath}/master-tool-list`); break;
                case "master_list_gauges": navigate(`${basePath}/master-gauge-list`); break;
                case "list_welding_fixture": navigate(`${basePath}/welding-fixture-list`); break;
                default: alert("🚧 Yearly Tool Form coming soon!");
            }
        } else {
            // Print Logic
            navigate(`${basePath}/${reportId}-print`);
        }
        closeModal();
    };

    const closeModal = () => {
        setShowOptionsModal(false);
        setSelectedCard(null);
    };

    return (
        <div className="maintenance-page-wrapper">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            
            <style>{`
                .maintenance-page-wrapper { position: relative; min-height: 100vh; background-color: #f8fafc; font-family: 'Inter', sans-serif; overflow-x: hidden; }
                
                /* Navbar */
                .hub-main-navbar { position: fixed; top: 0; width: 100%; height: 75px; background: white; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; border-bottom: 1px solid #eef2f6; z-index: 10000; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
                @media (min-width: 768px) { .hub-main-navbar { padding: 0 40px; } }
                .nav-brand-section { font-weight: 800; color: #06b6d4; font-size: 1.25rem; display: flex; align-items: center; gap: 12px; cursor: pointer; }

                /* Layout */
                .main-content-area { padding: 110px 15px 80px; max-width: 1200px; margin: 0 auto; }
                .back-link { cursor: pointer; color: #64748b; font-weight: 700; margin-bottom: 2rem; display: inline-flex; align-items: center; gap: 8px; transition: 0.2s; font-size: 0.9rem; }
                .back-link:hover { color: #06b6d4; }

                /* Card Design (Original Image Look) */
                .report-card-ui { background: white; border-radius: 24px; padding: 35px 25px; border: 1px solid #eef2f6; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; height: 100%; position: relative; display: flex; flex-direction: column; }
                .report-card-ui:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.06); border-color: #cbd5e1; }
                .card-header-line { position: absolute; top: 0; left: 0; right: 0; height: 6px; border-radius: 24px 24px 0 0; }
                
                .icon-box-wrapper { width: 55px; height: 55px; border-radius: 15px; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; margin-bottom: 25px; }
                
                /* Requested Typography */
                .card-main-title { font-weight: 800; color: #334155 !important; font-size: 1.4rem; margin-bottom: 25px; min-height: 70px; line-height: 1.3; }
                .meta-pill-ui { display: flex; align-items: center; justify-content: space-between; background: #f8fafc; padding: 10px 16px; border-radius: 12px; border: 1px solid #f1f5f9; font-size: 0.85rem; color: #64748b; font-weight: 600; margin-bottom: 10px; }
                .meta-pill-ui b { color: #334155; font-weight: 800; }

                /* Modal */
                .modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(8px); display: flex; justify-content: center; align-items: center; z-index: 100000; padding: 20px; }
                .modal-content-custom { background: white; border-radius: 30px; padding: 40px 30px; max-width: 420px; width: 100%; text-align: center; border: 1px solid #e2e8f0; }
                
                .action-btn { width: 100%; padding: 15px; border-radius: 16px; font-weight: 700; margin-bottom: 12px; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px; border: none; }
                .fill-btn { background: #0f172a; color: white; }
                .print-btn { background: #f1f5f9; color: #334155; border: 1px solid #e2e8f0; }
            `}</style>

            <nav className="hub-main-navbar">
                <div className="nav-brand-section" onClick={() => navigate('/Maintenance/Tool')}>
                    <i className="bi bi-calendar-event-fill"></i> <span>Tool Yearly Reports</span>
                </div>
            </nav>

            <div className="main-content-area">
                <div className="back-link" onClick={() => navigate('/Maintenance/Tool')}>
                    <i className="bi bi-arrow-left"></i> Back to Hub
                </div>

                <header className="text-center mb-5 px-3">
                    <h1 style={{ fontWeight: 900, color: '#0f172a', fontSize: 'clamp(2rem, 5vw, 3rem)' }}>Tooling Asset Management</h1>
                    <p className="text-muted">Yearly master lists and annual fixture audits</p>
                </header>

                <div className="row g-4 px-2">
                    {toolYearlyReports.map((report) => (
                        <div key={report.id} className="col-12 col-md-6 col-lg-4">
                            <div className="report-card-ui" onClick={() => handleCardClick(report)}>
                                <div className="card-header-line" style={{backgroundColor: report.color}}></div>
                                <div className="icon-box-wrapper" style={{backgroundColor: `${report.color}15`, color: report.color}}>
                                    <i className={`bi ${report.icon}`}></i>
                                </div>
                                <div className="card-main-title">{report.title}</div>
                                <div className="mt-auto">
                                    <div className="meta-pill-ui">
                                        <span>Form No:</span> <b>{report.formNo}</b>
                                    </div>
                                    <div className="meta-pill-ui">
                                        <span>Freq:</span> <b>Yearly</b>
                                    </div>
                                    <div className="mt-4 text-end">
                                        <i className="bi bi-arrow-right-circle-fill" style={{fontSize: '1.8rem', color: report.color}}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showOptionsModal && selectedCard && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
                        <div style={{width:'65px', height:'65px', borderRadius:'20px', background:`${selectedCard.color}15`, color:selectedCard.color, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:'2rem'}}>
                            <i className={`bi ${selectedCard.icon}`}></i>
                        </div>
                        <h3 className="fw-bold mb-2 text-slate-800">{selectedCard.title}</h3>
                        <p className="text-muted small mb-4">Select an action for this yearly audit</p>
                        
                        <button className="action-btn fill-btn" onClick={() => handleAction('FILL')}>
                            <i className="bi bi-pencil-square"></i> Fill New Entry 
                        </button>
                        
                        <button className="action-btn print-btn" onClick={() => handleAction('PRINT')}>
                            <i className="bi bi-printer"></i> View & Print
                        </button>
                        
                        <button className="btn btn-link w-100 mt-2 text-decoration-none text-muted fw-bold" onClick={closeModal}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ToolYearlyReport;