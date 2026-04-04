import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { machineDailyReports } from '../data/machineData';

const DailyReports = () => {
    const navigate = useNavigate();
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    // 🔥 DAILY ROUTING LOGIC 🔥
    const navigateToForm = (reportId, title) => {
        if (reportId === "mc_history") {
            navigate("/Machine-Card-Form");
            return;
        }
        if (reportId === "power_press_check") {
            navigate("/Daily-PowerPress-Checksheet"); 
            return;
        }
        if (reportId === "mc_breakdown") {
            navigate("/Tool-Breakdown-Form"); 
            return;
        }
        
        alert(`🚧 The form for "${title}" is coming soon!`);
    };

    const handleCardClick = (report) => {
        setSelectedCard(report);
        setShowOptionsModal(true);
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

            <style>{`
                /* TOP NAVBAR */
                .dashboard-navbar { position: fixed; top: 0; left: 0; width: 100vw; height: 70px; background-color: #ffffff; border-bottom: 1px solid #e2e8f0; z-index: 1000; display: flex; align-items: center; padding: 0 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
                
                /* 🔥 IMPROVED HUB CARD DESIGN 🔥 */
                .hub-card {
                    background: #ffffff;
                    border-radius: 16px;
                    padding: 1.8rem 1.5rem;
                    position: relative;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
                    border: 1px solid #f1f5f9;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    text-align: left;
                    height: 100%;
                }
                .hub-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 25px -5px rgba(0, 0, 0, 0.08);
                    border-color: #e2e8f0;
                }

                .hub-card-top-line {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 5px;
                    border-top-left-radius: 16px;
                    border-top-right-radius: 16px;
                }

                .hub-icon-box {
                    width: 54px;
                    height: 54px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.6rem;
                    margin-bottom: 1.2rem;
                }

                .hub-title {
                    font-weight: 800;
                    color: #0f172a;
                    font-size: 1.15rem;
                    margin-bottom: 1.2rem;
                    line-height: 1.3;
                }

                /* 🔥 IMPROVED TAGS TO FIX OVERFLOW ISSUE 🔥 */
                .hub-tag {
                    display: flex;
                    align-items: flex-start; 
                    background-color: #f8fafc;
                    border: 1px solid #f1f5f9;
                    padding: 8px 12px;
                    border-radius: 8px;
                    margin-bottom: 8px;
                    font-size: 0.8rem;
                    color: #475569;
                    font-weight: 500;
                    width: 100%; 
                    box-sizing: border-box;
                }
                .hub-tag i {
                    color: #94a3b8;
                    font-size: 0.9rem;
                    margin-right: 8px;
                    margin-top: 2px; 
                }
                .hub-tag span {
                    color: #0f172a;
                    font-weight: 700;
                    flex: 1; 
                    word-wrap: break-word; /* Prevents text from going outside the box */
                }

                /* 🔥 NEW: BOTTOM RIGHT ARROW 🔥 */
                .go-arrow {
                    position: absolute;
                    bottom: 1.5rem;
                    right: 1.5rem;
                    font-size: 1.5rem;
                    transition: all 0.3s ease;
                    opacity: 0;
                    transform: translateX(-10px);
                }
                .hub-card:hover .go-arrow {
                    opacity: 1;
                    transform: translateX(0);
                }

                /* MODAL CSS */
                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.5); display: flex; justify-content: center; align-items: center; z-index: 100000; padding: 16px; backdrop-filter: blur(2px); }
                .modal-content-custom { background: white; border-radius: 20px; padding: 24px; max-width: 380px; width: 100%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); border: none; text-align: left; }
                .option-btn { width: 100%; padding: 12px 16px; margin: 6px 0; border: none; border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 10px; }
                .option-btn:hover { transform: translateY(-2px); }
                .fill-btn { color: white; }
                .print-btn { background: #f1f5f9; color: #334155; }
                .print-btn:hover { background: #e2e8f0; }
                .close-btn { background: white; color: #ef4444; margin-top: 10px; }
                .close-btn:hover { background: #fef2f2; }
            `}</style>

            {/* Simple Text Navbar */}
            <nav className="dashboard-navbar">
                <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => navigate('/Maintenance-Hub')}>
                    <i className="bi bi-arrow-left text-muted me-3 fs-5"></i> 
                    <span className="fw-bold fs-5" style={{color: '#0f172a'}}>Daily Maintenance</span>
                </div>
            </nav>

            <div className="container" style={{ maxWidth: '1200px' }}>
                
                {/* Heading */}
                <div className="mb-5 pb-3" style={{ borderBottom: '1px dashed #cbd5e1' }}>
                    <h2 style={{ fontWeight: 800, color: '#0f172a' }}>Daily Reports</h2>
                    <p className="text-muted m-0">Choose a daily report below to fill or print.</p>
                </div>

                {/* 🔥 GRID OF DAILY CARDS 🔥 */}
                <div className="row g-4">
                    {machineDailyReports.map((report) => (
                        <div key={report.id} className="col-12 col-md-6 col-lg-4 col-xl-4">
                            <div className="hub-card" onClick={() => handleCardClick(report)}>
                                
                                {/* Top Color Line */}
                                <div className="hub-card-top-line" style={{ backgroundColor: report.color }}></div>

                                {/* Soft Square Icon */}
                                <div className="hub-icon-box" style={{ backgroundColor: report.bgColor, color: report.color }}>
                                    <i className={`bi ${report.icon}`}></i>
                                </div>

                                {/* Title */}
                                <h4 className="hub-title">
                                    {report.title}
                                </h4>
                                
                                {/* Improved Grey Tags (No Overflow) */}
                                <div className="d-flex flex-column w-100 mt-auto">
                                    <div className="hub-tag">
                                        <i className="bi bi-file-earmark-text"></i> Form: <span>{report.formNo}</span>
                                    </div>
                                    <div className="hub-tag">
                                        <i className="bi bi-arrow-repeat"></i> Freq: <span>{report.frequency}</span>
                                    </div>
                                    <div className="hub-tag">
                                        <i className="bi bi-person-badge"></i> Resp: <span>{report.responsibility}</span>
                                    </div>
                                </div>

                                {/* 🔥 The Arrow Button 🔥 */}
                                <i className="bi bi-arrow-right go-arrow" style={{ color: report.color }}></i>

                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 🔥 MODAL FOR FILL/PRINT SELECTION 🔥 */}
            {showOptionsModal && selectedCard && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
                        
                        <div className="d-flex align-items-center mb-4">
                            <div className="hub-icon-box mb-0 me-3" style={{ backgroundColor: selectedCard.bgColor, color: selectedCard.color, minWidth: '54px' }}>
                                <i className={`bi ${selectedCard.icon}`}></i>
                            </div>
                            <div>
                                <h4 style={{ fontWeight: 800, color: '#0f172a', margin: 0, fontSize: '1.1rem', lineHeight: '1.3' }}>
                                    {selectedCard.title}
                                </h4>
                                <small className="text-muted fw-semibold">Form No: {selectedCard.formNo}</small>
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
                            className="option-btn print-btn" 
                            onClick={() => alert(`Print route coming soon!`)}
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

export default DailyReports;