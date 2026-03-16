import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RedBinAttendanceprint from './RedBinAttendanceprint';
import Scrapnoteprint from './Scrapnoteprint';
import Reworkrepairprint from './Reworkrepairprint';

const QaHub = () => {
    const navigate = useNavigate();

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    // Print view state — konsa print component dikhana hai
    const [printView, setPrintView] = useState(null); // null = cards dikhao

    const qaReports = [
        { id: 1,  title: 'Incoming Material Insp.',      formNo: 'AOT/F/QA/01',   resp: 'Quality Engineer',    icon: 'bi-box-seam',           color: '#3b82f6', bg: '#eff6ff', fillRoute: '/Incoming-Material',       printKey: null },
        { id: 2,  title: 'Red Bin Analysis - NC Reg.',   formNo: 'AOT/F/QC/02',   resp: 'CFT',                 icon: 'bi-trash3',             color: '#ef4444', bg: '#fef2f2', fillRoute: '/RedBin-Form',             printKey: null },
        { id: 3,  title: 'Scrap Note',                   formNo: 'AOT/F/QC/04',   resp: 'Quality Engineer',    icon: 'bi-file-earmark-x',     color: '#ef4444', bg: '#fef2f2', fillRoute: '/Scrap-Note',              printKey: 'scrap-note' },
        { id: 4,  title: 'Red Bin Attendance Sheet',     formNo: 'AOT/F/QC/05',   resp: 'Quality Engineer',    icon: 'bi-person-x',           color: '#f59e0b', bg: '#fef3c7', fillRoute: '/Redbin-Attendance',       printKey: 'redbin-attendance' },
        { id: 5,  title: 'Daily Poka Yokes Check',       formNo: 'AOT/F/QC/07A',  resp: 'Operator',            icon: 'bi-shield-check',       color: '#10b981', bg: '#d1fae5', fillRoute: '/Poka-Yoke',               printKey: null },
        { id: 7,  title: 'Set up & Patrol Insp. (FPIR)', formNo: 'AOT/F/QA/15',   resp: 'Quality Engineer',    icon: 'bi-clipboard-check',    color: '#06b6d4', bg: '#cffafe', fillRoute: '/inspection-form',         printKey: null },
        { id: 8,  title: 'Rework / Repair Report',       formNo: 'AOT/F/QA/20',   resp: 'Rework Operator',     icon: 'bi-tools',              color: '#f59e0b', bg: '#fef3c7', fillRoute: '/Rework',                  printKey: 'rework-report' },
        { id: 9,  title: 'Sample Inspection Report',     formNo: 'AOT/F/QA/21',   resp: 'Quality Engineer',    icon: 'bi-search',             color: '#3b82f6', bg: '#eff6ff', fillRoute: '/PdiReportForm',           printKey: null },
        { id: 10, title: 'Deviation Approval Form',      formNo: 'AOT/F/PROD/04', resp: 'Production Engineer', icon: 'bi-file-earmark-check', color: '#8b5cf6', bg: '#ede9fe', fillRoute: '/Deviation-Approval-Form', printKey: null },
        { id: 11, title: 'RM Quality Plan',              formNo: 'AOT/F/QA/25',   resp: 'Quality Engineer',    icon: 'bi-diagram-3',          color: '#10b981', bg: '#d1fae5', fillRoute: null,                       printKey: null },
        { id: 12, title: 'Goods Receipt Note (GRN)',     formNo: 'Not Reqd.',      resp: 'Store Incharge',      icon: 'bi-receipt',            color: '#06b6d4', bg: '#cffafe', fillRoute: '/Good-Receipt',            printKey: null },
        { id: 13, title: 'Pre Dispatch Insp. (PDIR)',    formNo: 'AOT/F/QA/40',   resp: 'Quality Engineer',    icon: 'bi-truck',              color: '#10b981', bg: '#d1fae5', fillRoute: null,                       printKey: null },
    ];

    const handleCardClick = (report) => {
        setSelectedCard(report);
        setModalOpen(true);
    };

    const handleFillData = () => {
        if (selectedCard?.fillRoute) {
            navigate(selectedCard.fillRoute);
        } else {
            alert(`"${selectedCard?.title}" form abhi under development hai.`);
        }
        setModalOpen(false);
    };

    const handlePrintData = () => {
        if (selectedCard?.printKey) {
            setPrintView(selectedCard.printKey);
        } else {
            alert(`"${selectedCard?.title}" ka print page abhi under development hai.`);
        }
        setModalOpen(false);
    };

    // ── Red Bin Attendance Print View ──
    if (printView === 'redbin-attendance') {
        return (
            <RedBinAttendanceprint
                items={[]}
                currentReport={null}
                onBack={() => setPrintView(null)}
                onEditForm={() => {
                    setPrintView(null);
                    navigate('/Redbin-Attendance');
                }}
            />
        );
    }

    // ── Scrap Note Print View ──
    if (printView === 'scrap-note') {
        return (
            <Scrapnoteprint
                items={[]}
                currentReport={null}
                onBack={() => setPrintView(null)}
                onEditForm={() => {
                    setPrintView(null);
                    navigate('/Scrap-Note');
                }}
            />
        );
    }

    // ── Rework Inspection Report Print View ──
    if (printView === 'rework-report') {
        return (
            <Reworkrepairprint
                items={[]}
                currentReport={null}
                onBack={() => setPrintView(null)}
                onEditForm={() => {
                    setPrintView(null);
                    navigate('/Rework');
                }}
            />
        );
    }

    // ── Default: Cards view ──
    return (
        <div className="hub-wrapper">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            <style>{`
                .hub-wrapper { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: #f8fafc !important; z-index: 9999 !important; overflow-y: auto !important; font-family: 'Inter', sans-serif; }
                .nav-bar { position: sticky; top: 0; background: #fff; height: 70px; display: flex; justify-content: space-between; align-items: center; padding: 0 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05); z-index: 10000; }
                .main-container { padding: 40px 24px; max-width: 1200px; margin: 0 auto; }
                .card-custom { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.5rem; cursor: pointer; transition: 0.3s; height: 100%; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
                .card-custom:hover { transform: translateY(-5px); border-color:#3b82f6; box-shadow: 0 15px 25px rgba(0,0,0,0.1); }
                .meta-tag { background: #f1f5f9; padding: 6px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; color: #475569; display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
                .modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.5); backdrop-filter: blur(3px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 16px; animation: fadeIn 0.15s ease; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .modal-box { background: #fff; border-radius: 20px; padding: 2rem; width: 100%; max-width: 400px; box-shadow: 0 24px 60px rgba(0,0,0,0.2); animation: slideUp 0.2s ease; position: relative; }
                @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .modal-close-btn { position: absolute; top: 14px; right: 16px; background: #f1f5f9; border: none; border-radius: 8px; width: 32px; height: 32px; font-size: 16px; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
                .modal-close-btn:hover { background: #e2e8f0; }
                .modal-action-btn { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 12px; border: 1.5px solid #e2e8f0; background: #fff; cursor: pointer; text-align: left; width: 100%; transition: all 0.2s; margin-bottom: 10px; font-family: 'Inter', sans-serif; }
                .modal-action-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.09); border-color: #cbd5e1; }
                .modal-action-btn:last-child { margin-bottom: 0; }
                .modal-btn-icon { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
            `}</style>

            {/* Navbar */}
            <nav className="nav-bar">
                <h4 style={{fontWeight:900, color:'#3b82f6', margin:0, cursor:'pointer'}} onClick={() => navigate('/dashboard')}>
                    <i className="bi bi-arrow-left-circle text-muted me-2"></i>QA Hub (Quality Assurance)
                </h4>
            </nav>

            {/* Cards Grid */}
            <div className="main-container">
                <div className="row g-4">
                    {qaReports.map((r) => (
                        <div className="col-md-6 col-lg-4" key={r.id}>
                            <div className="card-custom" onClick={() => handleCardClick(r)}>
                                <div style={{width:'50px',height:'50px',borderRadius:'12px',background:r.bg,color:r.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',marginBottom:'1rem'}}>
                                    <i className={r.icon}></i>
                                </div>
                                <h5 style={{fontWeight:800,fontSize:'1rem',color:'#0f172a',marginBottom:'1rem'}}>{r.title}</h5>
                                <div className="meta-tag"><i className="bi bi-file-earmark-text text-muted"></i>Form: <span style={{color:'#0f172a'}}>{r.formNo}</span></div>
                                <div className="meta-tag"><i className="bi bi-person-badge text-muted"></i>Resp: <span style={{color:'#0f172a'}}>{r.resp}</span></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {modalOpen && selectedCard && (
                <div className="modal-overlay" onClick={() => setModalOpen(false)}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
                            <i className="bi bi-x-lg"></i>
                        </button>

                        {/* Card Info */}
                        <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:8}}>
                            <div style={{width:46,height:46,borderRadius:12,background:selectedCard.bg,color:selectedCard.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem',flexShrink:0}}>
                                <i className={selectedCard.icon}></i>
                            </div>
                            <div>
                                <p style={{fontWeight:800,fontSize:'0.95rem',margin:0,color:'#0f172a'}}>{selectedCard.title}</p>
                                <p style={{fontSize:'0.75rem',color:'#64748b',margin:0}}>Form: {selectedCard.formNo} &nbsp;·&nbsp; Resp: {selectedCard.resp}</p>
                            </div>
                        </div>

                        <div style={{borderTop:'1px solid #f1f5f9',margin:'16px 0'}}></div>
                        <p style={{fontSize:'0.78rem',color:'#94a3b8',fontWeight:600,marginBottom:14,textTransform:'uppercase',letterSpacing:'0.06em'}}>What would you like to do?</p>

                        {/* Fill Data */}
                        <button className="modal-action-btn" onClick={handleFillData}>
                            <div className="modal-btn-icon" style={{background:'#eff6ff',color:'#3b82f6'}}>
                                <i className="bi bi-pencil-square"></i>
                            </div>
                            <div>
                                <p style={{fontWeight:700,fontSize:'0.9rem',margin:0,color:'#0f172a'}}>Fill Data</p>
                                <p style={{fontSize:'0.75rem',color:'#64748b',margin:0}}>Form mein naya data bharein</p>
                            </div>
                            <i className="bi bi-chevron-right ms-auto text-muted" style={{fontSize:'0.85rem'}}></i>
                        </button>

                        {/* Print Data */}
                        <button className="modal-action-btn" onClick={handlePrintData}>
                            <div className="modal-btn-icon" style={{background:'#f0fdf4',color:'#10b981'}}>
                                <i className="bi bi-printer"></i>
                            </div>
                            <div>
                                <p style={{fontWeight:700,fontSize:'0.9rem',margin:0,color:'#0f172a'}}>Print Data</p>
                                <p style={{fontSize:'0.75rem',color:'#64748b',margin:0}}>Saved records print karein</p>
                            </div>
                            <i className="bi bi-chevron-right ms-auto text-muted" style={{fontSize:'0.85rem'}}></i>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QaHub;