import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { machineDailyReports } from '../data/machineData';

const MachineDailyReport = () => {
    const navigate = useNavigate();
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const handleCardClick = (report) => {
        setSelectedCard(report);
        setShowOptionsModal(true);
    };

    // 🔥 Unified Action Handler (Fill, View, Print)
    const handleAction = (actionType) => {
        const basePath = "/Maintenance/Machine";
        const reportId = selectedCard.id;

        if (actionType === 'fill') {
            switch (reportId) {
                case "mc_history": navigate(`${basePath}/history-card`); break;
                case "power_press_check": navigate(`${basePath}/power-press-checksheet`); break;
                case "mc_breakdown": navigate(`${basePath}/breakdown-form`); break;
                default: alert("🚧 Form logic coming soon!");
            }
        } else if (actionType === 'view') {
            navigate(`/maintenance-view/${reportId}`);
        } else if (actionType === 'print') {
            switch (reportId) {
                case "power_press_check": navigate(`${basePath}/power-press-checksheet/print`); break;
                case "mc_history": navigate(`${basePath}/history-card/print`); break;
                case "mc_breakdown": navigate(`${basePath}/breakdown-form/print`); break;
                default: alert("🚧 Print page coming soon!");
            }
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
                .maintenance-page-wrapper { position: relative; min-height: 100vh; background-color: #f1f4f9; font-family: 'Inter', sans-serif; }
                .hub-main-navbar { position: fixed; top: 0; width: 100%; height: 75px; background: white; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; border-bottom: 1px solid #eef2f6; z-index: 10000; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
                .nav-brand-section { font-weight: 800; color: #4f46e5; font-size: 1.25rem; display: flex; align-items: center; gap: 12px; cursor: pointer; }
                .main-content-area { padding: 110px 20px 80px; max-width: 1200px; margin: 0 auto; }
                .back-link { cursor: pointer; color: #64748b; font-weight: 700; margin-bottom: 1.5rem; display: inline-flex; align-items: center; gap: 8px; transition: 0.2s; }
                .back-link:hover { color: #4f46e5; }
                .report-card-ui { background: white; border-radius: 20px; padding: 30px 25px; text-align: left; border: 1px solid #eef2f6; transition: 0.3s; cursor: pointer; height: 100%; position: relative; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); overflow: hidden; }
                .report-card-ui:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
                .card-header-line { position: absolute; top: 0; left: 0; right: 0; height: 5px; border-radius: 20px 20px 0 0; }
                .icon-box-wrapper { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 25px; }
                .card-main-title { font-weight: 800; color: #0f172a; font-size: 1.25rem; margin-bottom: 20px; padding-right: 140px; }
                .meta-pill-ui { display: flex; align-items: center; gap: 10px; background: #f8fafc; padding: 8px 14px; border-radius: 10px; border: 1px solid #f1f5f9; font-size: 0.8rem; color: #64748b; font-weight: 600; width: fit-content; margin-bottom: 8px; }
                .meta-pill-ui b { color: #0f172a; }

                /* ✅ Live / Under Development Badges - matched with QaHub */
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
                .status-dev  { background: #f8fafc; color: #475569; border: 1px solid #cbd5e1; }

                /* Icon Animations */
                .pulse-icon { animation: pulseAnim 2s infinite; font-size: 0.8rem; }
                @keyframes pulseAnim {
                    0%   { opacity: 1; transform: scale(1); }
                    50%  { opacity: 0.5; transform: scale(0.8); }
                    100% { opacity: 1; transform: scale(1); }
                }
                .spin-icon { animation: spinAnim 4s linear infinite; font-size: 0.8rem; }
                @keyframes spinAnim { 100% { transform: rotate(360deg); } }

                /* Modal */
                .modal-overlay-ui { position: fixed; inset: 0; background: rgba(15,23,42,0.6); display: flex; align-items: center; justify-content: center; z-index: 20000; backdrop-filter: blur(4px); animation: fadeIn 0.15s ease; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .modal-action-btn { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; cursor: pointer; text-align: left; width: 100%; transition: all 0.2s; margin-bottom: 10px; font-family: 'Inter', sans-serif; }
                .modal-action-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.09); border-color: #cbd5e1; }
                .modal-action-btn:last-child { margin-bottom: 0; }
                .modal-btn-icon { width: 42px; height: 42px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
            `}</style>

            {/* Navbar */}
            <nav className="hub-main-navbar">
                <div className="nav-brand-section" onClick={() => navigate('/Maintenance/Machine')}>
                    <i className="bi bi-gear-fill"></i> Machine Daily Reports
                </div>
            </nav>

            <div className="main-content-area">
                <div className="back-link" onClick={() => navigate('/Maintenance/Machine')}>
                    <i className="bi bi-arrow-left"></i> Back to Hub
                </div>

                <header className="text-center mb-5">
                    <h1 style={{ fontWeight: 900, color: '#0f172a', fontSize: '2.5rem' }}>Daily Machine Logs</h1>
                    <p className="text-muted">Standard daily maintenance and breakdown checksheets</p>
                </header>

                <div className="row g-4 justify-content-center">
                    {machineDailyReports.map((report) => (
                        <div key={report.id} className="col-md-6 col-lg-4">
                            <div className="report-card-ui" onClick={() => handleCardClick(report)}>
                                <div className="card-header-line" style={{backgroundColor: report.color}}></div>

                                {/* ✅ Live / Dev Badge */}
                                <div className={`status-badge ${report.isLive ? 'status-live' : 'status-dev'}`}>
                                    {report.isLive ? (
                                        <><i className="bi bi-broadcast pulse-icon"></i> Live</>
                                    ) : (
                                        <><i className="bi bi-gear-wide-connected spin-icon"></i> Under Development</>
                                    )}
                                </div>

                                <div className="icon-box-wrapper" style={{backgroundColor: `${report.color}15`, color: report.color}}>
                                    <i className={`bi ${report.icon}`}></i>
                                </div>
                                <div className="card-main-title">{report.title}</div>
                                <div className="meta-pill-ui">Form: <b>{report.formNo}</b></div>
                                <div className="meta-pill-ui">Freq: <b>{report.frequency}</b></div>
                                <div className="mt-4 text-end">
                                    <i className="bi bi-arrow-right-circle" style={{fontSize: '1.4rem', color: report.color}}></i>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {showOptionsModal && selectedCard && (
                <div className="modal-overlay-ui" onClick={closeModal}>
                    <div style={{background:'#fff', borderRadius:'12px', padding:'2rem', width:'100%', maxWidth:'400px', position:'relative', animation: 'slideUp 0.2s ease'}} onClick={(e) => e.stopPropagation()}>
                        
                        <button style={{position:'absolute', top:'14px', right:'16px', background:'#f1f5f9', border:'none', borderRadius:'4px', width:'32px', height:'32px', cursor:'pointer'}} onClick={closeModal}>
                            <i className="bi bi-x-lg text-muted"></i>
                        </button>

                        <div style={{display:'flex', alignItems:'center', gap:14, marginBottom:16}}>
                            <div style={{width:46, height:46, borderRadius:8, background:`${selectedCard.color}15`, color:selectedCard.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem'}}>
                                <i className={`bi ${selectedCard.icon}`}></i>
                            </div>
                            <div style={{textAlign: 'left'}}>
                                <p style={{fontWeight:800, fontSize:'0.95rem', margin:0, color:'#0f172a'}}>{selectedCard.title}</p>
                                <p style={{fontSize:'0.75rem', color:'#64748b', margin:0}}>Form: {selectedCard.formNo || "N/A"}</p>
                            </div>
                        </div>

                        <div style={{borderTop:'1px solid #f1f5f9', margin:'16px 0'}}></div>
                        <p style={{fontSize:'0.78rem', color:'#94a3b8', fontWeight:600, marginBottom:14, textTransform:'uppercase', letterSpacing:'0.06em', textAlign: 'left'}}>What would you like to do?</p>

                        <button className="modal-action-btn" onClick={() => handleAction('fill')}>
                            <div className="modal-btn-icon" style={{background:'#f1f5f9', color:'#0f172a'}}>
                                <i className="bi bi-pencil-square"></i>
                            </div>
                            <div>
                                <p style={{fontWeight:700, fontSize:'0.9rem', margin:0, color:'#0f172a'}}>Fill Data</p>
                                <p style={{fontSize:'0.75rem', color:'#64748b', margin:0}}>Form mein naya data bharein</p>
                            </div>
                            <i className="bi bi-chevron-right ms-auto text-muted"></i>
                        </button>
<<<<<<< Updated upstream

                        <button className="modal-action-btn" onClick={() => handleAction('view')}>
                            <div className="modal-btn-icon" style={{background:'#f1f5f9', color:'#0f172a'}}>
                                <i className="bi bi-eye"></i>
                            </div>
                            <div>
                                <p style={{fontWeight:700, fontSize:'0.9rem', margin:0, color:'#0f172a'}}>View Data</p>
                                <p style={{fontSize:'0.75rem', color:'#64748b', margin:0}}>Database ke saved records dekhen</p>
                            </div>
                            <i className="bi bi-chevron-right ms-auto text-muted"></i>
=======
                         <button className="fill-btn shadow-sm" onClick={() => navigateToForm(selectedCard.id)}>
                            <i className="bi bi-pencil-square me-2"></i> View or Print
                        </button>
                        <button className="btn btn-light w-100 py-3 rounded-3 text-muted fw-bold" onClick={closeModal}>
                            Cancel
>>>>>>> Stashed changes
                        </button>

                        <button className="modal-action-btn" onClick={() => handleAction('print')}>
                            <div className="modal-btn-icon" style={{background:'#f1f5f9', color:'#0f172a'}}>
                                <i className="bi bi-printer"></i>
                            </div>
                            <div>
                                <p style={{fontWeight:700, fontSize:'0.9rem', margin:0, color:'#0f172a'}}>Print Data</p>
                                <p style={{fontSize:'0.75rem', color:'#64748b', margin:0}}>Saved records print karein</p>
                            </div>
                            <i className="bi bi-chevron-right ms-auto text-muted"></i>
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
};

export default MachineDailyReport;