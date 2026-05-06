import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productionReports } from './data/productionData'; 

const ProductionHub = () => {
    const navigate = useNavigate();
    const { category } = useParams();
    const currentCategory = category || 'daily';

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    // Category ke basis par reports filter karna
    const currentReports = productionReports.filter(r => r.category === currentCategory);

    const handleCardClick = (report) => {
        setSelectedCard(report);
        setModalOpen(true);
    };

    const handleFillData = () => {
        if (selectedCard?.formRoute && selectedCard?.isLive) {
            navigate(`/production-hub/${currentCategory}/${selectedCard.formRoute}`, {
                state: { fromCategory: currentCategory }
            });
        } else {
            alert(`The "${selectedCard?.title}" form is currently under development.`);
        }
        setModalOpen(false);
    };

    const handlePrintData = () => {
        if (selectedCard?.printRoute && selectedCard?.isLive) {
            navigate(`/production-hub/${currentCategory}/${selectedCard.printRoute}`, {
                state: { fromCategory: currentCategory }
            });
        } else {
            alert(`The print page for "${selectedCard?.title}" is currently under development.`);
        }
        setModalOpen(false);
    };

    const handleViewData = () => {
        if (selectedCard?.viewKey && selectedCard?.isLive) {
            // Yahan state pass ho rahi hai back button logic ke liye
            navigate(`/production-hub/view/${selectedCard.viewKey}`, {
                state: { fromCategory: currentCategory }
            });
        } else {
            alert(`The view page for "${selectedCard?.title}" is currently under development.`);
        }
        setModalOpen(false);
    };

    return (
        <div className="hub-wrapper">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            
            <style>{`
                .hub-wrapper { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: #f8fafc !important; z-index: 9999 !important; overflow-y: auto !important; font-family: 'Inter', sans-serif; }
                
                /* NAVBAR CSS (Updated for Mobile) */
                .nav-bar { position: sticky; top: 0; background: #fff; min-height: 70px; display: flex; justify-content: space-between; align-items: center; padding: 0 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05); z-index: 10000; gap: 15px; }
                .production-title { font-weight: 900; color: #8b5cf6; margin: 0; cursor: pointer; font-size: 1.4rem; display: flex; align-items: center; }

                .main-container { padding: 40px 24px; max-width: 1200px; margin: 0 auto; }
                
                /* TABS CSS */
                .tabs-container { display: flex; gap: 10px; background: #f1f5f9; padding: 6px; border-radius: 8px; overflow-x: auto; white-space: nowrap; -ms-overflow-style: none; scrollbar-width: none; }
                .tabs-container::-webkit-scrollbar { display: none; }
                .tab-btn { padding: 8px 20px; border: none; background: transparent; color: #64748b; font-weight: 700; font-size: 0.9rem; border-radius: 6px; cursor: pointer; transition: 0.2s; white-space: nowrap; }
                .tab-btn.active { background: #fff; color: #0f172a; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }

                .card-custom { position: relative; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; cursor: pointer; transition: 0.3s; height: 100%; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
                .card-custom:hover { transform: translateY(-3px); border-color:#8b5cf6; box-shadow: 0 10px 20px rgba(0,0,0,0.08); }
                .meta-tag { background: #f1f5f9; padding: 6px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; color: #475569; display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
                
                .status-badge { position: absolute; top: 16px; right: 16px; padding: 5px 10px; border-radius: 4px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 6px; }
                .status-live { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
                .status-dev { background: #f8fafc; color: #475569; border: 1px solid #cbd5e1; }
                
                .pulse-icon { animation: pulseAnim 2s infinite; font-size: 0.8rem; }
                @keyframes pulseAnim { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
                .spin-icon { animation: spinAnim 4s linear infinite; font-size: 0.8rem; }
                @keyframes spinAnim { 100% { transform: rotate(360deg); } }

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

                /* MOBILE RESPONSIVE MEDIA QUERIES */
                @media (max-width: 768px) {
                    .nav-bar { flex-direction: column; align-items: flex-start; padding: 1rem; gap: 12px; }
                    .production-title { font-size: 1.25rem; }
                    
                    /* Tabs poori width lenge aur buttons barabar stretch honge */
                    .tabs-container { width: 100%; display: flex; gap: 5px; }
                    .tab-btn { flex: 1; text-align: center; padding: 8px 5px; font-size: 0.85rem; } 
                    
                    .main-container { padding: 20px 16px; }
                    .card-custom h5 { padding-right: 100px !important; }
                }
            `}</style>

            <nav className="nav-bar">
                <h4 className="production-title" onClick={() => navigate('/dashboard')}>
                    <i className="bi bi-arrow-left-circle text-muted me-2"></i>Production Hub
                </h4>
                
                {/* Tabs */}
                <div className="tabs-container">
                    <button className={`tab-btn ${currentCategory === 'daily' ? 'active' : ''}`} onClick={() => navigate('/production-hub/daily')}>Daily</button>
                    <button className={`tab-btn ${currentCategory === 'monthly' ? 'active' : ''}`} onClick={() => navigate('/production-hub/monthly')}>Monthly</button>
                    <button className={`tab-btn ${currentCategory === 'yearly' ? 'active' : ''}`} onClick={() => navigate('/production-hub/yearly')}>Yearly</button>
                </div>
            </nav>

            <div className="main-container">
                <div className="row g-4">
                    {currentReports.length > 0 ? currentReports.map((r) => (
                        <div className="col-md-6 col-lg-4" key={r.id}>
                            <div className="card-custom" onClick={() => handleCardClick(r)}>
                                <div className={`status-badge ${r.isLive ? 'status-live' : 'status-dev'}`}>
                                    {r.isLive ? <><i className="bi bi-broadcast pulse-icon"></i> Live</> : <><i className="bi bi-gear-wide-connected spin-icon"></i> Under Development</>}
                                </div>

                                <div style={{ width: '50px', height: '50px', borderRadius: '8px', background: r.bg, color: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1rem' }}>
                                    <i className={r.icon}></i>
                                </div>
                                
                                <h5 style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: '1rem', paddingRight: '140px' }}>{r.title}</h5>
                                <div className="meta-tag"><i className="bi bi-file-earmark-text text-muted"></i>Form: <span style={{ color: '#0f172a' }}>{r.formNo}</span></div>
                                <div className="meta-tag"><i className="bi bi-person-badge text-muted"></i>Resp: <span style={{ color: '#0f172a' }}>{r.resp}</span></div>
                            </div>
                        </div>
                    )) : (
                        <div className="col-12 text-center py-5 text-muted">
                            <i className="bi bi-inbox fs-1"></i>
                            <h5 className="mt-3">No reports available in {currentCategory} yet.</h5>
                        </div>
                    )}
                </div>
            </div>

            {modalOpen && selectedCard && (
                <div className="modal-overlay" onClick={() => setModalOpen(false)}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setModalOpen(false)}><i className="bi bi-x-lg"></i></button>

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
                        
                        <button className="modal-action-btn" onClick={handleFillData}>
                            <div className="modal-btn-icon" style={{ background: '#f1f5f9', color: '#0f172a' }}><i className="bi bi-pencil-square"></i></div>
                            <div>
                                <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0, color: '#0f172a' }}>Fill Data</p>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Enter new data into the form</p>
                            </div>
                            <i className="bi bi-chevron-right ms-auto text-muted" style={{ fontSize: '0.85rem' }}></i>
                        </button>

                        <button className="modal-action-btn" onClick={handleViewData}>
                            <div className="modal-btn-icon" style={{ background: '#f1f5f9', color: '#0f172a' }}><i className="bi bi-eye"></i></div>
                            <div>
                                <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0, color: '#0f172a' }}>View Data</p>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}> View saved records from the database</p>
                            </div>
                            <i className="bi bi-chevron-right ms-auto text-muted" style={{ fontSize: '0.85rem' }}></i>
                        </button>

                        <button className="modal-action-btn" onClick={handlePrintData}>
                            <div className="modal-btn-icon" style={{ background: '#f1f5f9', color: '#0f172a' }}><i className="bi bi-printer"></i></div>
                            <div>
                                <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0, color: '#0f172a' }}>Print Data</p>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}> Print saved records</p>
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