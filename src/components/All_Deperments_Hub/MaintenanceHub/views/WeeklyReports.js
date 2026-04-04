import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { machineWeeklyReports } from '../data/machineData';

const WeeklyReports = () => {
    const navigate = useNavigate();
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    // 🔥 ROUTING LOGIC 🔥
    const navigateToForm = (reportId, title) => {
        if (reportId === "weekly_pm_cnc") {
            navigate("/Weekly-CNC-Form", { state: { machineName: "CNC" } });
            return;
        }
        if (reportId === 'weekly_pm_vmc') {
            navigate("/Weekly-VMC-Form", { state: { machineName: "VMC" } }); 
            return;
        }
        if (reportId === "weekly_pm_powerpress") {  
            navigate("/Weekly-Power-Press-Form", { state: { machineName: "PowerPress" } });
            return;
        }
        
        alert(`🚧 The form for "${title.replace(' Weekly Maint.', '')}" is coming soon!`);
    };

    const handleCardClick = (report) => {
        setSelectedCard(report);
        setShowOptionsModal(true); // Open the Fill/Print Modal
    };

    const closeModal = (e) => {
        if (e) e.stopPropagation();
        setShowOptionsModal(false);
        setSelectedCard(null);
    };

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '80px', paddingTop: '90px' }}>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />

            {/* 🔥 EXACT PARENT CARD CSS APPLIED TO ALL 19 CARDS 🔥 */}
            <style>{`
                /* TOP NAVBAR */
                .dashboard-navbar { position: fixed; top: 0; left: 0; width: 100vw; height: 70px; background-color: #ffffff; border-bottom: 1px solid #e2e8f0; z-index: 1000; display: flex; align-items: center; padding: 0 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
                
                /* PREMIUM MACHINE CARD */
                .premium-machine-card {
                    background: #ffffff;
                    border-radius: 16px;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
                    border: 1px solid #f8fafc;
                    overflow: hidden;
                    cursor: pointer;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    position: relative;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                .premium-machine-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                }
                
                /* TOP ACCENT BORDER */
                .card-top-accent {
                    height: 6px;
                    width: 100%;
                }

                /* SQUARE ICON BOX */
                .icon-box {
                    width: 50px;
                    height: 50px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    margin-bottom: 1.2rem;
                }

                /* GREY INFO TAGS */
                .info-tag {
                    display: inline-flex;
                    align-items: center;
                    background-color: #f8fafc;
                    border: 1px solid #f1f5f9;
                    padding: 5px 10px;
                    border-radius: 6px;
                    margin-bottom: 6px;
                    font-size: 0.8rem;
                    color: #475569;
                    font-weight: 500;
                    width: fit-content;
                }
                .info-tag span { color: #0f172a; font-weight: 700; margin-left: 4px; }
                .info-tag i { color: #94a3b8; font-size: 0.85rem; margin-right: 6px; }

                /* BOTTOM RIGHT ARROW */
                .go-arrow {
                    position: absolute;
                    bottom: 1.5rem;
                    right: 1.5rem;
                    font-size: 1.4rem;
                    transition: 0.3s;
                    transform: translateX(0);
                }
                .premium-machine-card:hover .go-arrow {
                    transform: translateX(4px);
                }

                /* MODAL CSS */
                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 100000; padding: 16px; }
                .modal-content-custom { background: white; border-radius: 16px; padding: 24px; max-width: 420px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); border: none; }
                .option-btn { width: 100%; padding: 12px 16px; margin: 6px 0; border: none; border-radius: 10px; font-size: 0.95rem; font-weight: 700; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 10px; }
                .option-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
                .fill-btn { color: white; }
                .print-btn { background: #334155; color: white; }
                .print-btn:hover { background: #1e293b; }
                .close-btn { background: white; color: #ef4444; border: 1px solid #ef4444; margin-top: 10px; }
                .close-btn:hover { background: #fef2f2; }
            `}</style>

            {/* 🔥 SIMPLE TEXT NAVBAR 🔥 */}
            <nav className="dashboard-navbar">
                <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => navigate('/Maintenance-Hub')}>
                    <i className="bi bi-arrow-left text-muted me-3 fs-5"></i> 
                    <span className="fw-bold fs-5" style={{color: '#0f172a'}}>Weekly Maintenance</span>
                </div>
            </nav>

            <div className="container" style={{ maxWidth: '1200px' }}>
                
                {/* Heading */}
                <div className="mb-5 pb-3" style={{ borderBottom: '1px dashed #cbd5e1' }}>
                    <h2 style={{ fontWeight: 800, color: '#0f172a' }}>
                        Preventive & Predictive Maint.
                    </h2>
                    <p className="text-muted m-0">Select a machine below to open its specific Weekly Maintenance form.</p>
                </div>

                {/* 🔥 GRID OF 19 PREMIUM CARDS 🔥 */}
                <div className="row g-4">
                    {machineWeeklyReports.map((report) => (
                        <div key={report.id} className="col-12 col-md-6 col-lg-4">
                            <div className="premium-machine-card" onClick={() => handleCardClick(report)}>
                                {/* 1. Colored Top Border */}
                                <div className="card-top-accent" style={{ backgroundColor: report.color }}></div>

                                <div className="p-4 position-relative flex-grow-1">
                                    {/* 2. Soft Colored Square Icon */}
                                    <div className="icon-box" style={{ backgroundColor: report.bgColor, color: report.color }}>
                                        <i className={`bi ${report.icon}`}></i>
                                    </div>

                                    {/* 3. Title */}
                                    <h4 className="fw-bold mb-3" style={{ color: '#0f172a', fontSize: '1.2rem', letterSpacing: '-0.3px' }}>
                                        {report.title.replace(' Weekly Maint.', '')}
                                    </h4>
                                    
                                    {/* 4. Grey Detail Tags */}
                                    <div className="d-flex flex-column gap-1">
                                        <div className="info-tag">
                                            <i className="bi bi-file-earmark-text"></i> Form: <span>{report.formNo}</span>
                                        </div>
                                        <div className="info-tag">
                                            <i className="bi bi-arrow-repeat"></i> Freq: <span>{report.frequency}</span>
                                        </div>
                                        <div className="info-tag">
                                            <i className="bi bi-person-badge"></i> Resp: <span>{report.responsibility}</span>
                                        </div>
                                    </div>

                                    {/* 5. Bottom Right Hover Arrow */}
                                    <i className="bi bi-arrow-right go-arrow" style={{ color: report.color }}></i>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 🔥 MODAL FOR FILL/PRINT SELECTION 🔥 */}
            {showOptionsModal && selectedCard && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
                        <div className="d-flex justify-content-between align-items-start mb-3 pb-3 border-bottom">
                            <div>
                                <h4 style={{ fontWeight: 800, color: '#0f172a', margin: 0 }}>
                                    {selectedCard.title.replace(' Weekly Maint.', '')}
                                </h4>
                                <small className="text-muted">Weekly Maintenance</small>
                            </div>
                            <div className="text-end text-muted">
                                <span style={{ fontSize: '0.8rem', display: 'block' }}>Form No:</span>
                                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: selectedCard.color }}>
                                    {selectedCard.formNo}
                                </span>
                            </div>
                        </div>

                        <button 
                            className="option-btn fill-btn shadow-sm" 
                            style={{ backgroundColor: selectedCard.color }}
                            onClick={() => navigateToForm(selectedCard.id, selectedCard.title)}
                        >
                            <i className="bi bi-pencil-square"></i> Fill Data
                        </button>

                        <button 
                            className="option-btn print-btn shadow-sm" 
                            onClick={() => alert(`Print route for ${selectedCard.title} coming soon!`)}
                        >
                            <i className="bi bi-printer"></i> Print Data
                        </button>

                        <button className="option-btn close-btn" onClick={closeModal}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeeklyReports;