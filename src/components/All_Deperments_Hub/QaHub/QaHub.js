import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { dailyReports, monthlyReports, yearlyReports } from './data/qaData';

const QaHub = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // URL se current active tab detect karna
    const activeTab = location.pathname.split('/')[2] || 'daily';

<<<<<<< Updated upstream
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const qaReports = [
        { id: 1,  title: 'Incoming Material Insp.',    formNo: 'AOT/F/QA/01',   resp: 'Quality Engineer',  icon: 'bi-box-seam',           color: '#3b82f6', bg: '#eff6ff', fillRoute: '/Incoming-Material',       printKey: 'incomingmaterial-report', viewKey: 'incoming-material-view', isLive: false },
        { id: 2,  title: 'Red Bin Analysis - NC Reg.', formNo: 'AOT/F/QC/02',   resp: 'CFT',               icon: 'bi-trash3',             color: '#ef4444', bg: '#fef2f2', fillRoute: '/RedBin-Form',             printKey: 'redbin-analysis-report',  viewKey: 'redbin-view', isLive: true },
        { id: 3,  title: 'Scrap Note',                 formNo: 'AOT/F/QC/04',   resp: 'Quality Engineer',  icon: 'bi-file-earmark-x',     color: '#ef4444', bg: '#fef2f2', fillRoute: '/Scrap-Note',              printKey: 'scrap-note-report',       viewKey: 'scrap-note-view', isLive: true },
        { id: 4,  title: 'Red Bin Attendance Sheet',   formNo: 'AOT/F/QC/05',   resp: 'Quality Engineer',  icon: 'bi-person-x',           color: '#f59e0b', bg: '#fef3c7', fillRoute: '/Redbin-Attendance',       printKey: 'redbin-attendance-report',viewKey: 'redbin-attendance-view', isLive: true },
        { id: 5,  title: 'Daily Poka Yokes Check',     formNo: 'AOT/F/QC/07A',  resp: 'Operator',          icon: 'bi-shield-check',       color: '#10b981', bg: '#d1fae5', fillRoute: '/Poka-Yoke',               printKey: 'PokaYoke-report',         viewKey: 'pokayoke-view', isLive: true },
        { id: 7,  title: 'Set up & Patrol Insp. (FPIR)',formNo: 'AOT/F/QA/15',  resp: 'Quality Engineer',  icon: 'bi-clipboard-check',    color: '#06b6d4', bg: '#cffafe', fillRoute: '/inspection-form',         printKey: 'inspection-report',       viewKey: 'inspection-view', isLive: true },
        { id: 8,  title: 'Rework / Repair Report',     formNo: 'AOT/F/QA/20',   resp: 'Rework Operator',   icon: 'bi-tools',              color: '#f59e0b', bg: '#fef3c7', fillRoute: '/Rework',                  printKey: 'rework-report',           viewKey: 'rework-view', isLive: true },
        { id: 9,  title: 'Sample Inspection Report',   formNo: 'AOT/F/QA/21',   resp: 'Quality Engineer',  icon: 'bi-search',             color: '#3b82f6', bg: '#eff6ff', fillRoute: '/sample-inspection',       printKey: 'sample-inspection-report',viewKey: 'sample-inspection-view', isLive: false},
        { id: 10, title: 'Deviation Approval Form',    formNo: 'AOT/F/PROD/04', resp: 'Production Engineer', icon: 'bi-file-earmark-check', color: '#8b5cf6', bg: '#ede9fe', fillRoute: '/Deviation-Approval-Form', printKey: 'Deviation-report',        viewKey: 'deviation-view', isLive: true },
        { id: 11, title: 'RM Quality Plan',            formNo: 'AOT/F/QA/25',   resp: 'Quality Engineer',  icon: 'bi-diagram-3',          color: '#10b981', bg: '#d1fae5', fillRoute: null,                       printKey: null,                      viewKey: null, isLive: false },
        { id: 12, title: 'Goods Receipt Note (GRN)',   formNo: 'Not Reqd.',     resp: 'Store Incharge',    icon: 'bi-receipt',            color: '#06b6d4', bg: '#cffafe', fillRoute: '/Good-Receipt',            printKey: null,                      viewKey: 'good-receipt', isLive: true },
        { id: 13, title: 'Pre Dispatch Insp. (PDIR)',  formNo: 'AOT/F/QA/40',   resp: 'Quality Engineer',  icon: 'bi-truck',              color: '#10b981', bg: '#d1fae5', fillRoute: '/pdi-report-form',         printKey: 'pdiprint-report',         viewKey: 'pdi-view', isLive: false},
=======
    useEffect(() => {
        if (location.pathname === '/qa-hub' || location.pathname === '/qa-hub/') {
            navigate('/qa-hub/daily', { replace: true });
        }
    }, [location, navigate]);

    const [modalOpen, setModalOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState(null);

    const liveForms = [
        'AOT/F/QC/02',  
        'AOT/F/QC/04',  
        'AOT/F/QC/05',  
        'AOT/F/QC/07A', 
        'AOT/F/QA/15'   
>>>>>>> Stashed changes
    ];

    const handleReportClick = (report) => {
        setSelectedCard(report);
        setModalOpen(true);
    };

    // UI change kiye bina Routing logic update:
const handleAction = (type) => {
    if (!selectedCard) return;

<<<<<<< Updated upstream
    const handlePrintData = () => {
        if (selectedCard?.printKey) {
            navigate(`/${selectedCard.printKey}`);
        } else {
            alert(`"${selectedCard?.title}" ka print page abhi under development hai.`);
        }
        setModalOpen(false);
    };

    const handleViewData = () => {
        if (selectedCard?.viewKey) {
            navigate(`/qa-view/${selectedCard.viewKey}`);
        } else {
            alert(`"${selectedCard?.title}" ka view page abhi under development hai.`);
        }
        setModalOpen(false);
    };

=======
    // activeTab URL segment [2] se mil jayega (daily/monthly/yearly)
    const category = location.pathname.split('/')[2] || 'daily';

    if (type === 'fill' && selectedCard.fillRoute) {
        // Naya Rasta: /qa-hub-form/daily/Incoming-Material
        navigate(`/qa-hub-form/${category}/${selectedCard.fillRoute}`);
    } 
    else if (type === 'print' && selectedCard.printKey) {
        navigate(`/qa-hub-form/${category}/${selectedCard.printKey}`);
    }
    setModalOpen(false);
};

    const currentReports = activeTab === 'monthly' ? monthlyReports : activeTab === 'yearly' ? yearlyReports : dailyReports;

>>>>>>> Stashed changes
    return (
        <div className="qa-hub-wrapper">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            
            <style>{`
<<<<<<< Updated upstream
                .hub-wrapper { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: #f8fafc !important; z-index: 9999 !important; overflow-y: auto !important; font-family: 'Inter', sans-serif; }
                .nav-bar { position: sticky; top: 0; background: #fff; height: 70px; display: flex; justify-content: space-between; align-items: center; padding: 0 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05); z-index: 10000; }
                .main-container { padding: 40px 24px; max-width: 1200px; margin: 0 auto; }
                
                .card-custom { position: relative; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; cursor: pointer; transition: 0.3s; height: 100%; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
                .card-custom:hover { transform: translateY(-3px); border-color:#3b82f6; box-shadow: 0 10px 20px rgba(0,0,0,0.08); }
                .meta-tag { background: #f1f5f9; padding: 6px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; color: #475569; display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
                
                /* Professional Badges CSS */
                .status-badge { 
                    position: absolute; top: 16px; right: 16px; 
                    padding: 5px 10px; 
                    border-radius: 4px; /* Square minimalist look */
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
=======
                .qa-hub-wrapper {
                    min-height: 100vh;
                    background-color: #f4f7fa;
                    font-family: 'Inter', sans-serif;
                }
                .qa-navbar {
                    background: #ffffff; height: 65px; display: flex; align-items: center;
                    justify-content: space-between; padding: 0 1.5rem;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.04); position: sticky; top: 0; z-index: 1000;
                }
                .nav-logo { font-weight: 800; font-size: 1.25rem; color: #1e293b; display: flex; align-items: center; gap: 10px; }
                .qa-hero { text-align: center; padding: 60px 20px 40px; }
                .qa-hero h1 { font-weight: 900; color: #0f172a; font-size: 3.8rem; margin-bottom: 10px; letter-spacing: -1.5px; }
                .qa-hero p { color: #64748b; font-size: 1.1rem; }
                .qa-tab-pill { 
                    background: #e2e8f0; padding: 5px; border-radius: 12px; display: flex; 
                    gap: 5px; border: 1px solid #cbd5e1; width: fit-content; margin: 0 auto 40px;
                }
                .qa-tab-link {
                    padding: 8px 24px; border-radius: 8px; border: none; font-weight: 600;
                    cursor: pointer; background: transparent; color: #64748b; transition: 0.3s;
                    text-decoration: none;
                }
                .qa-tab-link.active { background: white; color: #3b82f6; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
                .qa-grid {
                    display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 24px; max-width: 1200px; margin: 0 auto; padding: 0 20px 50px;
                }
                .qa-card {
                    background: white; border-radius: 16px; padding: 25px;
                    position: relative; transition: 0.3s; border: 1px solid #e2e8f0;
                    cursor: pointer; overflow: hidden;
                }
                .qa-card:hover { transform: translateY(-5px); box-shadow: 0 12px 24px rgba(0,0,0,0.08); border-color: #3b82f6; }
                .qa-card-top-bar { position: absolute; top: 0; left: 0; right: 0; height: 5px; }
                .live-indicator {
                    position: absolute; top: 15px; right: 15px; display: flex; align-items: center; gap: 5px;
                    font-size: 0.65rem; font-weight: 800; color: #10b981; text-transform: uppercase;
                }
                .pulse-dot {
                    width: 6px; height: 6px; background: #10b981; border-radius: 50%;
                    animation: pulse 1.5s infinite;
                }
                @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
                .qa-icon-wrapper {
                    width: 48px; height: 48px; border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.4rem; margin-bottom: 20px;
                }
                .qa-card h3 { font-size: 1.25rem; font-weight: 700; color: #1e293b; margin-bottom: 15px; }
                .qa-tag-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
                .qa-tag-label { font-size: 0.7rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; width: 45px; }
                .qa-tag-value { background: #f8fafc; color: #475569; padding: 3px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; }
                .card-arrow { position: absolute; bottom: 25px; right: 25px; font-size: 1.2rem; color: #3b82f6; opacity: 0; transition: 0.3s; }
                .qa-card:hover .card-arrow { opacity: 1; }
                .qa-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.4); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 2000; }
                .qa-modal-content { background: white; border-radius: 20px; padding: 35px; width: 90%; max-width: 380px; text-align: center; }
                .btn-action-main { width: 100%; padding: 12px; border-radius: 10px; border: none; background: #3b82f6; color: white; font-weight: 700; margin-bottom: 10px; cursor: pointer;}
                .btn-action-sec { width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0; background: white; color: #1e293b; font-weight: 700; cursor: pointer;}
>>>>>>> Stashed changes
            `}</style>

            <nav className="qa-navbar">
                <div className="nav-logo">
                    <button className="btn p-0 border-0 me-2" onClick={() => navigate('/dashboard')}><i className="bi bi-chevron-left"></i></button>
                    <i className="bi bi-shield-check text-primary"></i>
                    AtomOne Quality
                </div>
            </nav>

<<<<<<< Updated upstream
            {/* Cards Grid */}
            <div className="main-container">
                <div className="row g-4">
                    {qaReports.map((r) => (
                        <div className="col-md-6 col-lg-4" key={r.id}>
                            <div className="card-custom" onClick={() => handleCardClick(r)}>
                                
                                {/* Updated Status Badge */}
                                <div className={`status-badge ${r.isLive ? 'status-live' : 'status-dev'}`}>
                                    {r.isLive ? (
                                        <><i className="bi bi-broadcast pulse-icon"></i> Live</>
                                    ) : (
                                        <><i className="bi bi-gear-wide-connected spin-icon"></i> Under Development</>
                                    )}
                                </div>

                                <div style={{width:'50px',height:'50px',borderRadius:'8px',background:r.bg,color:r.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',marginBottom:'1rem'}}>
                                    <i className={r.icon}></i>
                                </div>
                                {/* Padding right increased to prevent text overlapping with the wider badge */}
                                <h5 style={{fontWeight:800,fontSize:'1rem',color:'#0f172a',marginBottom:'1rem', paddingRight: '140px'}}>{r.title}</h5>
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
                            <div style={{width:46,height:46,borderRadius:8,background:selectedCard.bg,color:selectedCard.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem',flexShrink:0}}>
                                <i className={selectedCard.icon}></i>
=======
            <header className="qa-hero">
                <h1>Quality Assurance Hub</h1>
                <p>Manage Quality Management Systems and Inspection reports efficiently.</p>
            </header>

            <div className="qa-tab-pill">
                <Link to="/qa-hub/daily" className={`qa-tab-link ${activeTab === 'daily' ? 'active' : ''}`}>Daily</Link>
                <Link to="/qa-hub/monthly" className={`qa-tab-link ${activeTab === 'monthly' ? 'active' : ''}`}>Monthly</Link>
                <Link to="/qa-hub/yearly" className={`qa-tab-link ${activeTab === 'yearly' ? 'active' : ''}`}>Yearly</Link>
            </div>

            <div className="qa-grid">
                {currentReports.map((report) => {
                    const isLive = liveForms.includes(report.formNo);
                    return (
                        <div key={report.id} className="qa-card" onClick={() => handleReportClick(report)}>
                            {isLive && (
                                <div className="live-indicator">
                                    <div className="pulse-dot"></div> Live
                                </div>
                            )}
                            <div className="qa-card-top-bar" style={{ background: report.color }}></div>
                            <div className="qa-icon-wrapper" style={{ background: report.bg, color: report.color }}>
                                <i className={report.icon}></i>
>>>>>>> Stashed changes
                            </div>
                            <h3>{report.title}</h3>
                            <div className="qa-tag-row">
                                <span className="qa-tag-label">Form:</span>
                                <span className="qa-tag-value">{report.formNo}</span>
                            </div>
                            <div className="qa-tag-row">
                                <span className="qa-tag-label">Freq:</span>
                                <span className="qa-tag-value" style={{textTransform:'capitalize'}}>{activeTab}</span>
                            </div>
                            <div className="card-arrow"><i className="bi bi-arrow-right-short"></i></div>
                        </div>
                    );
                })}
            </div>

<<<<<<< Updated upstream
                        <div style={{borderTop:'1px solid #f1f5f9',margin:'16px 0'}}></div>
                        <p style={{fontSize:'0.78rem',color:'#94a3b8',fontWeight:600,marginBottom:14,textTransform:'uppercase',letterSpacing:'0.06em'}}>What would you like to do?</p>

                        {/* Fill Data */}
                        <button className="modal-action-btn" onClick={handleFillData}>
                            <div className="modal-btn-icon" style={{background:'#f1f5f9', color:'#0f172a'}}>
                                <i className="bi bi-pencil-square"></i>
                            </div>
                            <div>
                                <p style={{fontWeight:700,fontSize:'0.9rem',margin:0,color:'#0f172a'}}>Fill Data</p>
                                <p style={{fontSize:'0.75rem',color:'#64748b',margin:0}}>Form mein naya data bharein</p>
                            </div>
                            <i className="bi bi-chevron-right ms-auto text-muted" style={{fontSize:'0.85rem'}}></i>
                        </button>

                        {/* View Data */}
                        <button className="modal-action-btn" onClick={handleViewData}>
                            <div className="modal-btn-icon" style={{background:'#f1f5f9', color:'#0f172a'}}>
                                <i className="bi bi-eye"></i>
                            </div>
                            <div>
                                <p style={{fontWeight:700,fontSize:'0.9rem',margin:0,color:'#0f172a'}}>View Data</p>
                                <p style={{fontSize:'0.75rem',color:'#64748b',margin:0}}>Database ke saved records dekhen</p>
                            </div>
                            <i className="bi bi-chevron-right ms-auto text-muted" style={{fontSize:'0.85rem'}}></i>
                        </button>

                        {/* Print Data */}
                        <button className="modal-action-btn" onClick={handlePrintData}>
                            <div className="modal-btn-icon" style={{background:'#f1f5f9', color:'#0f172a'}}>
                                <i className="bi bi-printer"></i>
                            </div>
                            <div>
                                <p style={{fontWeight:700,fontSize:'0.9rem',margin:0,color:'#0f172a'}}>Print Data</p>
                                <p style={{fontSize:'0.75rem',color:'#64748b',margin:0}}>Saved records print karein</p>
                            </div>
                            <i className="bi bi-chevron-right ms-auto text-muted" style={{fontSize:'0.85rem'}}></i>
                        </button>

=======
            {modalOpen && selectedCard && (
                <div className="qa-modal-overlay" onClick={() => setModalOpen(false)}>
                    <div className="qa-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="qa-icon-wrapper mx-auto" style={{background: selectedCard.bg, color: selectedCard.color, width: 60, height: 60, fontSize: '1.8rem'}}>
                            <i className={selectedCard.icon}></i>
                        </div>
                        <h4 className='text-slate-700' style={{fontWeight: 800, margin: '15px 0'}}>{selectedCard.title}</h4>
                        <button className="btn-action-main" onClick={() => handleAction('fill')}><i className="bi bi-pencil-square me-2"></i> Fill New Data</button>
                        <button className="btn-action-sec" onClick={() => handleAction('print')}><i className="bi bi-printer me-2"></i> View Report</button>
>>>>>>> Stashed changes
                    </div>
                </div>
            )}
        </div>
    );
};

export default QaHub;