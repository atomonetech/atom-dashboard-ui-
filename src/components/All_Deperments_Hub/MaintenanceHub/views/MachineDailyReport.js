import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 🔥 Machine Data se reports import ki
import { machineDailyReports } from '../data/machineData';

const MachineDailyReport = () => {
    const navigate = useNavigate();
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const handleCardClick = (report) => {
        setSelectedCard(report);
        setShowOptionsModal(true);
    };

    const navigateToForm = (reportId) => {
        const basePath = "/Maintenance/Machine";
        switch (reportId) {
            case "mc_history": navigate(`${basePath}/history-card`); break;
            case "power_press_check": navigate(`${basePath}/power-press-checksheet`); break;
            case "mc_breakdown": navigate(`${basePath}/breakdown-form`); break;
            default: alert("🚧 Form logic coming soon!");
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
                
                /* Fixed Navbar */
                .hub-main-navbar { position: fixed; top: 0; width: 100%; height: 75px; background: white; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; border-bottom: 1px solid #eef2f6; z-index: 10000; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }
                .nav-brand-section { font-weight: 800; color: #4f46e5; font-size: 1.25rem; display: flex; align-items: center; gap: 12px; cursor: pointer; }
                
                .main-content-area { padding: 110px 20px 80px; max-width: 1200px; margin: 0 auto; }
                .back-link { cursor: pointer; color: #64748b; font-weight: 700; margin-bottom: 1.5rem; display: inline-flex; align-items: center; gap: 8px; transition: 0.2s; }
                .back-link:hover { color: #4f46e5; }

                .report-card-ui { background: white; border-radius: 20px; padding: 30px 25px; text-align: left; border: 1px solid #eef2f6; transition: 0.3s; cursor: pointer; height: 100%; position: relative; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
                .report-card-ui:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
                .card-header-line { position: absolute; top: 0; left: 0; right: 0; height: 5px; border-radius: 20px 20px 0 0; }
                
                .icon-box-wrapper { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 25px; }
                .card-main-title { font-weight: 800; color: #0f172a; font-size: 1.25rem; margin-bottom: 20px; }
                .meta-pill-ui { display: flex; align-items: center; gap: 10px; background: #f8fafc; padding: 8px 14px; border-radius: 10px; border: 1px solid #f1f5f9; font-size: 0.8rem; color: #64748b; font-weight: 600; width: fit-content; margin-bottom: 8px; }
                .meta-pill-ui b { color: #0f172a; }
                
                .modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(4px); display: flex; justify-content: center; align-items: center; z-index: 100000; }
                .modal-content-custom { background: white; border-radius: 24px; padding: 35px; max-width: 400px; width: 90%; text-align: center; }
                .fill-btn { width: 100%; padding: 14px; background: #4f46e5; color: white; border: none; border-radius: 12px; font-weight: 700; margin-bottom: 10px; transition: 0.2s; }
                .fill-btn:hover { background: #4338ca; }
            `}</style>

            {/* Fixed Navbar */}
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

            {/* Options Modal */}
            {showOptionsModal && selectedCard && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
                        <div style={{width:'50px', height:'50px', borderRadius:'12px', background:`${selectedCard.color}15`, color:selectedCard.color, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:'1.5rem'}}>
                            <i className={`bi ${selectedCard.icon}`}></i>
                        </div>
                        <h4 className="fw-bold mb-4 text-slate-700">{selectedCard.title}</h4>
                        <button className="fill-btn shadow-sm" onClick={() => navigateToForm(selectedCard.id)}>
                            <i className="bi bi-pencil-square me-2"></i> Fill New Entry
                        </button>
                        <button className="btn btn-light w-100 py-3 rounded-3 text-muted fw-bold" onClick={closeModal}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MachineDailyReport;