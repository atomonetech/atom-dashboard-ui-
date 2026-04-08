import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 🔥 Import mapping matched with ToolMachineData.js
import { toolReports as toolDailyReports } from '../data/ToolMachineData'; 

const ToolDailyReports = () => {
    const navigate = useNavigate();
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const navigateToForm = (reportId) => {
        switch (reportId) {
            case "tool_history": navigate("/Maintenance/Tool/history-form"); break;
            case "tool_pm_check": navigate("/Maintenance/Tool/pm-checklist"); break;
            case "tool_breakdown": navigate("/Maintenance/Tool/breakdown-form"); break;
            case "tool_stroke": navigate("/Maintenance/Tool/stroke-record"); break;
            default: alert(`🚧 Form coming soon!`);
        }
    };

    const handleCardClick = (report) => {
        setSelectedCard(report);
        setShowOptionsModal(true);
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
                .maintenance-page-wrapper { position: relative; min-height: 100vh; background-color: #f1f4f9; overflow-y: auto; font-family: 'Inter', sans-serif; }
                
                /* Navbar Style */
                .hub-main-navbar { position: fixed; top: 0; width: 100%; height: 75px; background: white; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; border-bottom: 1px solid #eef2f6; z-index: 10000; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
                .nav-brand-section { font-weight: 800; color: #4f46e5; font-size: 1.25rem; display: flex; align-items: center; gap: 12px; cursor: pointer; text-decoration: none; }
                
                .main-content-area { padding: 110px 20px 80px; max-width: 1300px; margin: 0 auto; }
                .back-link { cursor: pointer; color: #64748b; font-weight: 600; margin-bottom: 1.5rem; display: inline-flex; align-items: center; gap: 8px; transition: 0.2s; }
                .back-link:hover { color: #4f46e5; }

                .module-card { background: #ffffff; border: 1px solid #eef2f6; border-radius: 20px; padding: 2.5rem 2rem; cursor: pointer; transition: 0.3s; position: relative; overflow: hidden; height: 100%; }
                .module-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
                .card-accent-line { position: absolute; top: 0; left: 0; right: 0; height: 5px; }
                
                .icon-wrapper { width: 55px; height: 55px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; margin-bottom: 1.5rem; }
                .card-title-custom { font-weight: 800; font-size: 1.25rem; color: #0f172a; margin-bottom: 1.2rem; }
                .meta-tag { display: flex; align-items: center; gap: 10px; font-size: 0.8rem; color: #64748b; background: #f8fafc; padding: 6px 12px; border-radius: 8px; margin-bottom: 8px; font-weight: 600; border: 1px solid #f1f5f9; width: fit-content; }
                
                .modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 100000; }
                .modal-content-custom { background: white; border-radius: 24px; padding: 35px; max-width: 400px; width: 90%; text-align: center; }
                .opt-btn { width: 100%; padding: 14px; margin: 8px 0; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: 0.2s; }
                .fill-btn { background: #4f46e5; color: white; }
                .fill-btn:hover { background: #4338ca; }
                .print-btn { background: #f8fafc; color: #64748b; border: 1px solid #eef2f6; }
                .print-btn:hover { background: #f1f5f9; }
            `}</style>

            {/* Navbar Implementation */}
            <nav className="hub-main-navbar">
                <div className="nav-brand-section" onClick={() => navigate('/Maintenance/Tool')}>
                    <i className="bi bi-gear-fill"></i> Tool Daily Reports
                </div>
                <div className="d-flex align-items-center gap-3">
                    <span className="badge bg-light text-primary border px-3 py-2 rounded-pill">Status: Live</span>
                </div>
            </nav>

            <div className="main-content-area">
                <div className="container">
                    <div className="back-link" onClick={() => navigate('/Maintenance/Tool')}>
                        <i className="bi bi-arrow-left"></i> Back to Hub
                    </div>

                    <div className="text-center mb-5">
                        <h1 style={{ fontWeight: 900, color: '#0f172a', fontSize: '2.5rem' }}>Tool Daily Reports</h1>
                        <p className="text-muted">Select a checklist to record today's maintenance activities</p>
                    </div>

                    <div className="row g-4 justify-content-center">
                        {toolDailyReports.map((report) => (
                            <div key={report.id} className="col-md-6 col-lg-4">
                                <div className="module-card" onClick={() => handleCardClick(report)}>
                                    <div className="card-accent-line" style={{ backgroundColor: report.color }}></div>
                                    <div className="icon-wrapper" style={{ backgroundColor: `${report.color}15`, color: report.color }}>
                                        <i className={`bi ${report.icon}`}></i>
                                    </div>
                                    <h3 className="card-title-custom">{report.title}</h3>
                                    <div className="meta-tag">Form: <b>{report.formNo}</b></div>
                                    <div className="meta-tag">Resp: <b>{report.responsibility}</b></div>
                                    <div className="mt-4 text-end">
                                        <i className="bi bi-arrow-right-circle-fill" style={{ fontSize: '1.5rem', color: report.color }}></i>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showOptionsModal && selectedCard && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
                        <div style={{width:'50px', height:'50px', borderRadius:'12px', background:`${selectedCard.color}15`, color:selectedCard.color, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:'1.5rem'}}>
                            <i className={`bi ${selectedCard.icon}`}></i>
                        </div>
                        <h4 className="mb-2" style={{ fontWeight: 800, color: '#0f172a' }}>{selectedCard.title}</h4>
                        <p className="text-muted small mb-4">Please select an action for this report</p>
                        
                        <button className="opt-btn fill-btn shadow-sm" onClick={() => navigateToForm(selectedCard.id)}>
                            <i className="bi bi-pencil-square"></i> Fill Entry
                        </button>
                        <button className="opt-btn print-btn" onClick={() => alert("Printing system initializing...")}>
                            <i className="bi bi-printer"></i> Print Summary
                        </button>
                        <button className="btn btn-link text-muted fw-bold mt-2 text-decoration-none" onClick={closeModal}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ToolDailyReports;