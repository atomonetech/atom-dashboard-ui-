import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toolDailyReports } from '../data/ToolMachineData';

const ToolDailyReports = () => {
    const navigate = useNavigate();
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const navigateToForm = (reportId) => {
        if (reportId === "tool_history") navigate("/Tool-History-Form");
        else if (reportId === "tool_stroke") navigate("/Tool-Stroke-PM");
        else if (reportId === "tool_pm_check") navigate("/Tool-PM-Checklist-Form");
        else if (reportId === "tool_breakdown") navigate("/Tool-Breakdown-Form");
        closeModal();
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
        <div className="tool-reports-wrapper">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />

            <style>{`
                .tool-reports-wrapper { background-color: #f8fafc; min-height: 100vh; font-family: 'Inter', sans-serif; }
                .dashboard-navbar { position: fixed; top: 0; width: 100%; height: 70px; background: white; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; padding: 0 2rem; z-index: 1000; }
                .main-container { padding-top: 100px; padding-bottom: 50px; }
                
                /* HUB STYLE CARD (EXACT MATCH) */
                .hub-style-card {
                    background: white;
                    border-radius: 20px;
                    padding: 30px;
                    border: 1px solid #f1f5f9;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    height: 100%;
                }
                .hub-style-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06); }
                .card-accent { position: absolute; top: 0; left: 0; right: 0; height: 6px; border-top-left-radius: 20px; border-top-right-radius: 20px; }
                
                .icon-container {
                    width: 60px; height: 60px; border-radius: 15px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.8rem; margin-bottom: 25px;
                }
                .report-title { font-weight: 800; color: #1e293b; margin-bottom: 20px; font-size: 1.2rem; }
                
                .info-row {
                    display: flex; align-items: center; gap: 10px;
                    background: #f1f5f9; padding: 6px 12px; border-radius: 8px;
                    margin-bottom: 8px; width: fit-content; font-size: 0.85rem; color: #475569;
                }
                .info-row i { font-size: 0.9rem; color: #94a3b8; }
                .info-row span { font-weight: 700; color: #0f172a; }

                /* MODAL BUTTONS WITH VISIBLE TEXT */
                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.5); display: flex; justify-content: center; align-items: center; z-index: 10000; backdrop-filter: blur(4px); }
                .modal-content-custom { background: white; border-radius: 24px; padding: 30px; max-width: 400px; width: 100%; text-align: center; }
                .option-btn { width: 100%; padding: 14px; margin: 8px 0; border: none; border-radius: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 10px; }
                .fill-btn { color: #ffffff !important; text-shadow: 0 1px 2px rgba(0,0,0,0.1); }
                .print-btn { background: #f1f5f9 !important; color: #1e293b !important; border: 1px solid #e2e8f0 !important; }
            `}</style>

            <nav className="dashboard-navbar text-slate-700 text-bold">
                <div style={{ cursor: 'pointer' }} onClick={() => navigate('/Maintenance/Tool-Hub')}>
                    <i className="bi bi-arrow-left me-2 "></i> <strong>Daily Tool Maintenance</strong>
                </div>
            </nav>

            <div className="container main-container">
                <div className="mb-5">
                    <h2 style={{ fontWeight: 900, color: '#0f172a' }}>Daily Tool Reports</h2>
                    <p className="text-muted">Manage your daily tool room records with precision.</p>
                </div>

                <div className="row g-4 justify-content-center">
                    {toolDailyReports.map((report) => (
                        <div key={report.id} className="col-12 col-md-6 col-lg-4">
                            <div className="hub-style-card" onClick={() => handleCardClick(report)}>
                                <div className="card-accent" style={{ background: report.color }}></div>
                                
                                <div className="icon-container" style={{ background: report.bgColor, color: report.color }}>
                                    <i className={`bi ${report.icon}`}></i>
                                </div>

                                <h3 className="report-title">{report.title}</h3>

                                <div className="info-row">
                                    <i className="bi bi-file-earmark-text"></i> Form: <span>{report.formNo}</span>
                                </div>
                                <div className="info-row">
                                    <i className="bi bi-arrow-repeat"></i> Freq: <span>{report.frequency}</span>
                                </div>
                                <div className="info-row">
                                    <i className="bi bi-person-badge"></i> Resp: <span>{report.responsibility}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ACTION MODAL */}
            {showOptionsModal && selectedCard && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
                        <h4 className="fw-bold mb-4 text-slate-700">{selectedCard.title}</h4>
                        
                        <button className="option-btn fill-btn shadow-sm text-slate-700" 
                                style={{ backgroundColor: selectedCard.color }}
                                onClick={() => navigateToForm(selectedCard.id)}>
                            <i className="bi bi-pencil-square"></i> Fill Data
                        </button>
                        
                        <button className="option-btn print-btn" onClick={() => alert('Print Coming Soon')}>
                            <i className="bi bi-printer"></i> Print Data
                        </button>
                        
                        <button className="btn btn-link text-danger fw-bold mt-2" onClick={closeModal}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ToolDailyReports;