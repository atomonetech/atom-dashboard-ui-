import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductionHub = () => {
    const navigate = useNavigate();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    // ✅ QA Hub ki tarah sabhi routes aur isLive status ko directly object me add kar diya gaya hai
    const productionReports = [
        { id: 1, title: 'Daily Production Plan / Report', formNo: 'AOT-F-PROD-03',  resp: 'Production Engineer', icon: 'bi-graph-up-arrow',    color: '#3b82f6', bg: '#eff6ff', fillRoute: '/Daily-Prod-Plan-Form',     printRoute: '/Daily-Prod-Plan-Report',      viewKey: 'daily-production',      isLive: true },
        { id: 3, title: 'Operator 5S Checklist',          formNo: 'AOT-F-PROD-13A', resp: 'Operator',            icon: 'bi-stars',             color: '#f59e0b', bg: '#fef3c7', fillRoute: '/Operator5S',               printRoute: '/Operator5S-Report',           viewKey: 'five-s-view',          isLive: true },
        { id: 4, title: 'Bins Trolley Cleaning',          formNo: 'AOT-F-PROD-02A', resp: 'Helper',              icon: 'bi-cart-check',        color: '#06b6d4', bg: '#cffafe', fillRoute: '/Bin-Trolly-Cleaning-Form', printRoute: '/Bin-Trolly-Cleaning-Report',  viewKey: 'bin-trolley', isLive: true },
        { id: 5, title: 'Tip Change monitoring sheet',    formNo: 'AOT-F-QA-05B',   resp: 'Die Setting Supv.',   icon: 'bi-sliders',           color: '#8b5cf6', bg: '#ede9fe', fillRoute: '/Tip-Change-Monitor-Form',  printRoute: '/Tip-Change-Monitor-Report',   viewKey: 'tip-change',   isLive: true },
        { id: 6, title: '4M Change inspection report',    formNo: 'AOT-F-4M-06',    resp: 'Quality Engineer',    icon: 'bi-file-earmark-diff', color: '#ef4444', bg: '#fef2f2', fillRoute: '/4-M-Ins-Form',             printRoute: '/4M-Change-Inspection-Report', viewKey: 'four-m-inspection', isLive: true },
        { id: 7, title: '4M Change summery sheet',        formNo: 'AOT-F-4M-05A',   resp: 'Production Engineer', icon: 'bi-table',             color: '#ef4444', bg: '#fef2f2', fillRoute: '/4M-Change-Summary-Form',   printRoute: '/4M-Change-Summary-Report',    viewKey: '4m-change-summary',    isLive: false },
        { id: 8, title: '4M Change tracking sheet',       formNo: 'AOT-F-4M-05',    resp: 'Production Engineer', icon: 'bi-signpost-split',    color: '#ef4444', bg: '#fef2f2', fillRoute: '/4M-Change-Tracking-Form',  printRoute: '/4M-Change-Tracking-Report',   viewKey: 'four-m-record',   isLive: true },
        { id: 9, title: '4M Change display board',        formNo: 'ATO-F-4M-08',    resp: 'Production Engineer', icon: 'bi-easel2',            color: '#ef4444', bg: '#fef2f2', fillRoute: '/4M-Change-Display-Form',   printRoute: '/4M-Change-Display-Report',    viewKey: '4m-change-display',    isLive: false } // Example: Setting one to false
    ];

    const handleCardClick = (report) => {
        setSelectedCard(report);
        setModalOpen(true);
    };

    const handleFillData = () => {
        if (selectedCard?.fillRoute && selectedCard?.isLive) {
            navigate(selectedCard.fillRoute);
        } else {
            alert(`"${selectedCard?.title}" form abhi under development hai.`);
        }
        setModalOpen(false);
    };

    const handlePrintData = () => {
        if (selectedCard?.printRoute && selectedCard?.isLive) {
            navigate(selectedCard.printRoute);
        } else {
            alert(`"${selectedCard?.title}" ka print page abhi under development hai.`);
        }
        setModalOpen(false);
    };

    const handleViewData = () => {
        if (selectedCard?.viewKey && selectedCard?.isLive) {
            navigate(`/Production/View/${selectedCard.viewKey}`);
        } else {
            alert(`"${selectedCard?.title}" ka view page abhi under development hai.`);
        }
        setModalOpen(false);
    };

    return (
        <div className="hub-wrapper">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            
            <style>{`
                .hub-wrapper { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: #f8fafc !important; z-index: 9999 !important; overflow-y: auto !important; font-family: 'Inter', sans-serif; }
                .nav-bar { position: sticky; top: 0; background: #fff; height: 70px; display: flex; justify-content: space-between; align-items: center; padding: 0 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05); z-index: 10000; }
                .main-container { padding: 40px 24px; max-width: 1200px; margin: 0 auto; }
                
                .card-custom { position: relative; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; cursor: pointer; transition: 0.3s; height: 100%; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
                .card-custom:hover { transform: translateY(-3px); border-color:#8b5cf6; box-shadow: 0 10px 20px rgba(0,0,0,0.08); }
                .meta-tag { background: #f1f5f9; padding: 6px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; color: #475569; display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
                
                /* QA Hub jaisa Professional Badges CSS */
                .status-badge { 
                    position: absolute; top: 16px; right: 16px; 
                    padding: 5px 10px; 
                    border-radius: 4px; 
                    font-size: 0.65rem; 
                    font-weight: 700; 
                    text-transform: uppercase; 
                    letter-spacing: 0.05em; 
                    display: flex; align-items: center; gap: 6px; 
                }
                .status-live { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
                .status-dev { background: #f8fafc; color: #475569; border: 1px solid #cbd5e1; }
                
                /* Icon Animations */
                .pulse-icon { animation: pulseAnim 2s infinite; font-size: 0.8rem; }
                @keyframes pulseAnim { 
                    0% { opacity: 1; transform: scale(1); } 
                    50% { opacity: 0.5; transform: scale(0.8); } 
                    100% { opacity: 1; transform: scale(1); } 
                }
                
                .spin-icon { animation: spinAnim 4s linear infinite; font-size: 0.8rem; }
                @keyframes spinAnim { 100% { transform: rotate(360deg); } }

                /* QA Hub Modal CSS */
                .modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.5); backdrop-filter: blur(3px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 16px; animation: fadeIn 0.15s ease; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .modal-box { background: #fff; border-radius: 12px; padding: 2rem; width: 100%; max-width: 400px; box-shadow: 0 24px 60px rgba(0,0,0,0.2); animation: slideUp 0.2s ease; position: relative; }
                @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .modal-close-btn { position: absolute; top: 14px; right: 16px; background: #f1f5f9; border: none; border-radius: 4px; width: 32px; height: 32px; font-size: 16px; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
                .modal-close-btn:hover { background: #e2e8f0; }
                
                .modal-action-btn { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; cursor: pointer; text-align: left; width: 100%; transition: all 0.2s; margin-bottom: 10px; font-family: 'Inter', sans-serif; }
                .modal-action-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.09); border-color: #cbd5e1; }
                .modal-action-btn:last-child { margin-bottom: 0; }
                .modal-btn-icon { width: 42px; height: 42px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
            `}</style>

            {/* Navbar */}
            <nav className="nav-bar">
                <h4 style={{ fontWeight: 900, color: '#8b5cf6', margin: 0, cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>
                    <i className="bi bi-arrow-left-circle text-muted me-2"></i>Production Hub
                </h4>
            </nav>

            {/* Cards Grid */}
            <div className="main-container">
                <div className="row g-4">
                    {productionReports.map((r) => (
                        <div className="col-md-6 col-lg-4" key={r.id}>
                            <div className="card-custom" onClick={() => handleCardClick(r)}>
                                
                                {/* Status Badge (Live / Under Dev) */}
                                <div className={`status-badge ${r.isLive ? 'status-live' : 'status-dev'}`}>
                                    {r.isLive ? (
                                        <><i className="bi bi-broadcast pulse-icon"></i> Live</>
                                    ) : (
                                        <><i className="bi bi-gear-wide-connected spin-icon"></i> Under Development</>
                                    )}
                                </div>

                                <div style={{ width: '50px', height: '50px', borderRadius: '8px', background: r.bg, color: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1rem' }}>
                                    <i className={r.icon}></i>
                                </div>
                                
                                <h5 style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: '1rem', paddingRight: '140px' }}>{r.title}</h5>
                                <div className="meta-tag"><i className="bi bi-file-earmark-text text-muted"></i>Form: <span style={{ color: '#0f172a' }}>{r.formNo}</span></div>
                                <div className="meta-tag"><i className="bi bi-person-badge text-muted"></i>Resp: <span style={{ color: '#0f172a' }}>{r.resp}</span></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal (QA Hub Style) */}
            {modalOpen && selectedCard && (
                <div className="modal-overlay" onClick={() => setModalOpen(false)}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
                            <i className="bi bi-x-lg"></i>
                        </button>

                        {/* Card Info in Modal */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
                            <div style={{ width: 46, height: 46, borderRadius: 8, background: selectedCard.bg, color: selectedCard.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                                <i className={selectedCard.icon}></i>
                            </div>
                            <div>
                                <p style={{ fontWeight: 800, fontSize: '0.95rem', margin: 0, color: '#0f172a' }}>{selectedCard.title}</p>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Form: {selectedCard.formNo}</p>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #f1f5f9', margin: '16px 0' }}></div>
                        <p style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>What would you like to do?</p>

                        {/* Fill Data */}
                        <button className="modal-action-btn" onClick={handleFillData}>
                            <div className="modal-btn-icon" style={{ background: '#f1f5f9', color: '#0f172a' }}>
                                <i className="bi bi-pencil-square"></i>
                            </div>
                            <div>
                                <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0, color: '#0f172a' }}>Fill Data</p>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Naya production data bharein</p>
                            </div>
                            <i className="bi bi-chevron-right ms-auto text-muted" style={{ fontSize: '0.85rem' }}></i>
                        </button>

                        {/* View Data */}
                        <button className="modal-action-btn" onClick={handleViewData}>
                            <div className="modal-btn-icon" style={{ background: '#f1f5f9', color: '#0f172a' }}>
                                <i className="bi bi-eye"></i>
                            </div>
                            <div>
                                <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0, color: '#0f172a' }}>View Data</p>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Database ke saved records dekhen</p>
                            </div>
                            <i className="bi bi-chevron-right ms-auto text-muted" style={{ fontSize: '0.85rem' }}></i>
                        </button>

                        {/* Print Data */}
                        <button className="modal-action-btn" onClick={handlePrintData}>
                            <div className="modal-btn-icon" style={{ background: '#f1f5f9', color: '#0f172a' }}>
                                <i className="bi bi-printer"></i>
                            </div>
                            <div>
                                <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0, color: '#0f172a' }}>Print Data</p>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Saved records ka print nikalein</p>
                            </div>
                            <i className="bi bi-chevron-right ms-auto text-muted" style={{ fontSize: '0.85rem' }}></i>
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductionHub;