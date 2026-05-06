// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const QaHub = () => {
//     const navigate = useNavigate();

//     const [modalOpen, setModalOpen] = useState(false);
//     const [selectedCard, setSelectedCard] = useState(null);

//     const qaReports = [
//         { id: 1,  title: 'Incoming Material Insp.',    formNo: 'AOT/F/QA/01',   resp: 'Quality Engineer',  icon: 'bi-box-seam',           color: '#3b82f6', bg: '#eff6ff', fillRoute: '/Incoming-Material',       printKey: 'incomingmaterial-report', viewKey: 'incoming-material-view', isLive: false },
//         { id: 2,  title: 'Red Bin Analysis - NC Reg.', formNo: 'AOT/F/QC/02',   resp: 'CFT',               icon: 'bi-trash3',             color: '#ef4444', bg: '#fef2f2', fillRoute: '/RedBin-Form',             printKey: 'redbin-analysis-report',  viewKey: 'redbin-view', isLive: true },
//         { id: 3,  title: 'Scrap Note',                 formNo: 'AOT/F/QC/04',   resp: 'Quality Engineer',  icon: 'bi-file-earmark-x',     color: '#ef4444', bg: '#fef2f2', fillRoute: '/Scrap-Note',              printKey: 'scrap-note-report',       viewKey: 'scrap-note-view', isLive: true },
//         { id: 4,  title: 'Red Bin Attendance Sheet',   formNo: 'AOT/F/QC/05',   resp: 'Quality Engineer',  icon: 'bi-person-x',           color: '#f59e0b', bg: '#fef3c7', fillRoute: '/Redbin-Attendance',       printKey: 'redbin-attendance-report',viewKey: 'redbin-attendance-view', isLive: true },
//         
//         { id: 7,  title: 'Set up & Patrol Insp. (FPIR)',formNo: 'AOT/F/QA/15',  resp: 'Quality Engineer',  icon: 'bi-clipboard-check',    color: '#06b6d4', bg: '#cffafe', fillRoute: '/inspection-form',         printKey: 'inspection-report',       viewKey: 'inspection-view', isLive: true },
//         { id: 8,  title: 'Rework / Repair Report',     formNo: 'AOT/F/QA/20',   resp: 'Rework Operator',   icon: 'bi-tools',              color: '#f59e0b', bg: '#fef3c7', fillRoute: '/Rework',                  printKey: 'rework-report',           viewKey: 'rework-view', isLive: true },
//         { id: 9,  title: 'Sample Inspection Report',   formNo: 'AOT/F/QA/21',   resp: 'Quality Engineer',  icon: 'bi-search',             color: '#3b82f6', bg: '#eff6ff', fillRoute: '/sample-inspection',       printKey: 'sample-inspection-report',viewKey: 'sample-inspection-view', isLive: false},
//         { id: 10, title: 'Deviation Approval Form',    formNo: 'AOT/F/PROD/04', resp: 'Production Engineer', icon: 'bi-file-earmark-check', color: '#8b5cf6', bg: '#ede9fe', fillRoute: '/Deviation-Approval-Form', printKey: 'Deviation-report',        viewKey: 'deviation-view', isLive: true },
//         { id: 11, title: 'RM Quality Plan',            formNo: 'AOT/F/QA/25',   resp: 'Quality Engineer',  icon: 'bi-diagram-3',          color: '#10b981', bg: '#d1fae5', fillRoute: null,                       printKey: null,                      viewKey: null, isLive: false },
//         { id: 12, title: 'Goods Receipt Note (GRN)',   formNo: 'Not Reqd.',     resp: 'Store Incharge',    icon: 'bi-receipt',            color: '#06b6d4', bg: '#cffafe', fillRoute: '/Good-Receipt',            printKey: null,                      viewKey: 'good-receipt', isLive: true },
//         { id: 13, title: 'Pre Dispatch Insp. (PDIR)',  formNo: 'AOT/F/QA/40',   resp: 'Quality Engineer',  icon: 'bi-truck',              color: '#10b981', bg: '#d1fae5', fillRoute: '/pdi-report-form',         printKey: 'pdiprint-report',         viewKey: 'pdi-view', isLive: false},
//     ];

//     const handleCardClick = (report) => {
//         setSelectedCard(report);
//         setModalOpen(true);
//     };

//     const handleFillData = () => {
//         if (selectedCard?.fillRoute) {
//             navigate(selectedCard.fillRoute);
//         } else {
//             alert(`"${selectedCard?.title}" form abhi under development hai.`);
//         }
//         setModalOpen(false);
//     };

//     const handlePrintData = () => {
//         if (selectedCard?.printKey) {
//             navigate(`/${selectedCard.printKey}`);
//         } else {
//             alert(`"${selectedCard?.title}" ka print page abhi under development hai.`);
//         }
//         setModalOpen(false);
//     };

//     const handleViewData = () => {
//         if (selectedCard?.viewKey) {
//             navigate(`/qa-view/${selectedCard.viewKey}`);
//         } else {
//             alert(`"${selectedCard?.title}" ka view page abhi under development hai.`);
//         }
//         setModalOpen(false);
//     };

//     return (
//         <div className="hub-wrapper">
//             <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
//             <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
//             <style>{`
//                 .hub-wrapper { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: #f8fafc !important; z-index: 9999 !important; overflow-y: auto !important; font-family: 'Inter', sans-serif; }
//                 .nav-bar { position: sticky; top: 0; background: #fff; height: 70px; display: flex; justify-content: space-between; align-items: center; padding: 0 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05); z-index: 10000; }
//                 .main-container { padding: 40px 24px; max-width: 1200px; margin: 0 auto; }
                
//                 .card-custom { position: relative; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; cursor: pointer; transition: 0.3s; height: 100%; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
//                 .card-custom:hover { transform: translateY(-3px); border-color:#3b82f6; box-shadow: 0 10px 20px rgba(0,0,0,0.08); }
//                 .meta-tag { background: #f1f5f9; padding: 6px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; color: #475569; display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
                
//                 /* Professional Badges CSS */
//                 .status-badge { 
//                     position: absolute; top: 16px; right: 16px; 
//                     padding: 5px 10px; 
//                     border-radius: 4px; /* Square minimalist look */
//                     font-size: 0.65rem; 
//                     font-weight: 700; 
//                     text-transform: uppercase; 
//                     letter-spacing: 0.05em; 
//                     display: flex; align-items: center; gap: 6px; 
//                 }
//                 .status-live { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
//                 .status-dev { background: #f8fafc; color: #475569; border: 1px solid #cbd5e1; }
                
//                 /* Icon Animations */
//                 .pulse-icon { animation: pulseAnim 2s infinite; font-size: 0.8rem; }
//                 @keyframes pulseAnim { 
//                     0% { opacity: 1; transform: scale(1); } 
//                     50% { opacity: 0.5; transform: scale(0.8); } 
//                     100% { opacity: 1; transform: scale(1); } 
//                 }
                
//                 .spin-icon { animation: spinAnim 4s linear infinite; font-size: 0.8rem; }
//                 @keyframes spinAnim { 100% { transform: rotate(360deg); } }

//                 .modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.5); backdrop-filter: blur(3px); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 16px; animation: fadeIn 0.15s ease; }
//                 @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
//                 .modal-box { background: #fff; border-radius: 12px; padding: 2rem; width: 100%; max-width: 400px; box-shadow: 0 24px 60px rgba(0,0,0,0.2); animation: slideUp 0.2s ease; position: relative; }
//                 @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
//                 .modal-close-btn { position: absolute; top: 14px; right: 16px; background: #f1f5f9; border: none; border-radius: 4px; width: 32px; height: 32px; font-size: 16px; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
//                 .modal-close-btn:hover { background: #e2e8f0; }
//                 .modal-action-btn { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; cursor: pointer; text-align: left; width: 100%; transition: all 0.2s; margin-bottom: 10px; font-family: 'Inter', sans-serif; }
//                 .modal-action-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.09); border-color: #cbd5e1; }
//                 .modal-action-btn:last-child { margin-bottom: 0; }
//                 .modal-btn-icon { width: 42px; height: 42px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
//             `}</style>

//             {/* Navbar */}
//             <nav className="nav-bar">
//                 <h4 style={{fontWeight:900, color:'#3b82f6', margin:0, cursor:'pointer'}} onClick={() => navigate('/dashboard')}>
//                     <i className="bi bi-arrow-left-circle text-muted me-2"></i>QA Hub (Quality Assurance)
//                 </h4>
//             </nav>

//             {/* Cards Grid */}
//             <div className="main-container">
//                 <div className="row g-4">
//                     {qaReports.map((r) => (
//                         <div className="col-md-6 col-lg-4" key={r.id}>
//                             <div className="card-custom" onClick={() => handleCardClick(r)}>
                                
//                                 {/* Updated Status Badge */}
//                                 <div className={`status-badge ${r.isLive ? 'status-live' : 'status-dev'}`}>
//                                     {r.isLive ? (
//                                         <><i className="bi bi-broadcast pulse-icon"></i> Live</>
//                                     ) : (
//                                         <><i className="bi bi-gear-wide-connected spin-icon"></i> Under Development</>
//                                     )}
//                                 </div>

//                                 <div style={{width:'50px',height:'50px',borderRadius:'8px',background:r.bg,color:r.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',marginBottom:'1rem'}}>
//                                     <i className={r.icon}></i>
//                                 </div>
//                                 {/* Padding right increased to prevent text overlapping with the wider badge */}
//                                 <h5 style={{fontWeight:800,fontSize:'1rem',color:'#0f172a',marginBottom:'1rem', paddingRight: '140px'}}>{r.title}</h5>
//                                 <div className="meta-tag"><i className="bi bi-file-earmark-text text-muted"></i>Form: <span style={{color:'#0f172a'}}>{r.formNo}</span></div>
//                                 <div className="meta-tag"><i className="bi bi-person-badge text-muted"></i>Resp: <span style={{color:'#0f172a'}}>{r.resp}</span></div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Modal */}
//             {modalOpen && selectedCard && (
//                 <div className="modal-overlay" onClick={() => setModalOpen(false)}>
//                     <div className="modal-box" onClick={(e) => e.stopPropagation()}>
//                         <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
//                             <i className="bi bi-x-lg"></i>
//                         </button>

//                         {/* Card Info */}
//                         <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:8}}>
//                             <div style={{width:46,height:46,borderRadius:8,background:selectedCard.bg,color:selectedCard.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem',flexShrink:0}}>
//                                 <i className={selectedCard.icon}></i>
//                             </div>
//                             <div>
//                                 <p style={{fontWeight:800,fontSize:'0.95rem',margin:0,color:'#0f172a'}}>{selectedCard.title}</p>
//                                 <p style={{fontSize:'0.75rem',color:'#64748b',margin:0}}>Form: {selectedCard.formNo} &nbsp;·&nbsp; Resp: {selectedCard.resp}</p>
//                             </div>
//                         </div>

//                         <div style={{borderTop:'1px solid #f1f5f9',margin:'16px 0'}}></div>
//                         <p style={{fontSize:'0.78rem',color:'#94a3b8',fontWeight:600,marginBottom:14,textTransform:'uppercase',letterSpacing:'0.06em'}}>What would you like to do?</p>

//                         {/* Fill Data */}
//                         <button className="modal-action-btn" onClick={handleFillData}>
//                             <div className="modal-btn-icon" style={{background:'#f1f5f9', color:'#0f172a'}}>
//                                 <i className="bi bi-pencil-square"></i>
//                             </div>
//                             <div>
//                                 <p style={{fontWeight:700,fontSize:'0.9rem',margin:0,color:'#0f172a'}}>Fill Data</p>
//                                 <p style={{fontSize:'0.75rem',color:'#64748b',margin:0}}>Form mein naya data bharein</p>
//                             </div>
//                             <i className="bi bi-chevron-right ms-auto text-muted" style={{fontSize:'0.85rem'}}></i>
//                         </button>

//                         {/* View Data */}
//                         <button className="modal-action-btn" onClick={handleViewData}>
//                             <div className="modal-btn-icon" style={{background:'#f1f5f9', color:'#0f172a'}}>
//                                 <i className="bi bi-eye"></i>
//                             </div>
//                             <div>
//                                 <p style={{fontWeight:700,fontSize:'0.9rem',margin:0,color:'#0f172a'}}>View Data</p>
//                                 <p style={{fontSize:'0.75rem',color:'#64748b',margin:0}}>Database ke saved records dekhen</p>
//                             </div>
//                             <i className="bi bi-chevron-right ms-auto text-muted" style={{fontSize:'0.85rem'}}></i>
//                         </button>

//                         {/* Print Data */}
//                         <button className="modal-action-btn" onClick={handlePrintData}>
//                             <div className="modal-btn-icon" style={{background:'#f1f5f9', color:'#0f172a'}}>
//                                 <i className="bi bi-printer"></i>
//                             </div>
//                             <div>
//                                 <p style={{fontWeight:700,fontSize:'0.9rem',margin:0,color:'#0f172a'}}>Print Data</p>
//                                 <p style={{fontSize:'0.75rem',color:'#64748b',margin:0}}>Saved records print karein</p>
//                             </div>
//                             <i className="bi bi-chevron-right ms-auto text-muted" style={{fontSize:'0.85rem'}}></i>
//                         </button>

//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default QaHub;


import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { dailyReports, monthlyReports, yearlyReports } from './data/qaData';

const QaHub = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { category } = useParams(); 
    const currentCategory = category || 'daily'; 

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    // 1st Declaration (Corrected object mapping)
    const qaReports = {
        daily: dailyReports,
        monthly: monthlyReports,
        yearly: yearlyReports
    };

    const currentReports = qaReports[currentCategory] || [];

    // URL path auto-redirect handler
    useEffect(() => {
        if (location.pathname === '/qa-hub' || location.pathname === '/qa-hub/') {
            navigate('/qa-hub/daily', { replace: true });
        }
    }, [location, navigate]);

    const handleCardClick = (report) => {
        setSelectedCard(report);
        setModalOpen(true);
    };

    const handleFillData = () => {
        if (selectedCard?.fillRoute) {
            // 🔥 YAHAN FIX KIYA HAI: Ensure slash is always correct
            const routePath = selectedCard.fillRoute.startsWith('/') 
                ? selectedCard.fillRoute.substring(1) 
                : selectedCard.fillRoute;

            navigate(`/qa-hub/${currentCategory}/${routePath}`, {
                state: { fromCategory: currentCategory }
            });
        } else {
            alert(`The "${selectedCard?.title}" form is currently unavailable. Please check back later.`);
        }
        setModalOpen(false);
    };

    const handlePrintData = () => {
        if (selectedCard?.printKey) {
            // 🔥 YAHAN FIX KIYA HAI
            const routePath = selectedCard.printKey.startsWith('/') 
                ? selectedCard.printKey.substring(1) 
                : selectedCard.printKey;

            navigate(`/qa-hub/${currentCategory}/${routePath}`, {
                state: { fromCategory: currentCategory }
            });
        } else {
            alert(`Printing for "${selectedCard?.title}" is not available at the moment.`);
        }
        setModalOpen(false);
    };

    const handleViewData = () => {
        if (selectedCard?.viewKey) {
            // 🔥 YAHAN FIX KIYA HAI
            const routePath = selectedCard.viewKey.startsWith('/') 
                ? selectedCard.viewKey.substring(1) 
                : selectedCard.viewKey;

            navigate(`/qa-hub/view/${routePath}`, {
                state: { fromCategory: currentCategory }
            });
        } else {
            alert(`Viewing data for "${selectedCard?.title}" is currently disabled.`);
        }
        setModalOpen(false);
    };

    return (
        <div className="qa-hub-wrapper">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            
            <style>{`
                .qa-hub-wrapper { min-height: 100vh; background-color: #f8fafc; font-family: 'Inter', sans-serif; }
                
                /* NAVBAR CSS */
                .nav-bar { position: sticky; top: 0; background: #fff; min-height: 70px; display: flex; justify-content: space-between; align-items: center; padding: 0 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05); z-index: 10000; gap: 15px; }
                .qa-title { font-weight: 900; color: #3b82f6; margin: 0; cursor: pointer; font-size: 1.4rem; display: flex; align-items: center; }
                
                .main-container { padding: 40px 24px; max-width: 1200px; margin: 0 auto; }
                
                .card-custom { position: relative; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; cursor: pointer; transition: 0.3s; height: 100%; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
                .card-custom:hover { transform: translateY(-3px); border-color:#3b82f6; box-shadow: 0 10px 20px rgba(0,0,0,0.08); }
                .meta-tag { background: #f1f5f9; padding: 6px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; color: #475569; display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
                
                /* Professional Badges CSS */
                .status-badge { position: absolute; top: 16px; right: 16px; padding: 5px 10px; border-radius: 4px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 6px; }
                .status-live { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
                .status-dev { background: #f8fafc; color: #475569; border: 1px solid #cbd5e1; }
                
                /* Icon Animations */
                .pulse-icon { animation: pulseAnim 2s infinite; font-size: 0.8rem; }
                @keyframes pulseAnim { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
                .spin-icon { animation: spinAnim 4s linear infinite; font-size: 0.8rem; }
                @keyframes spinAnim { 100% { transform: rotate(360deg); } }

                /* MODAL CSS */
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

                /* TABS CSS */
                .tabs-container { display: flex; gap: 10px; background: #f1f5f9; padding: 6px; border-radius: 8px; overflow-x: auto; white-space: nowrap; -ms-overflow-style: none; scrollbar-width: none; }
                .tabs-container::-webkit-scrollbar { display: none; }
                .tab-btn { padding: 8px 20px; border: none; background: transparent; color: #64748b; font-weight: 700; font-size: 0.9rem; border-radius: 6px; cursor: pointer; transition: 0.2s; white-space: nowrap; }
                .tab-btn.active { background: #fff; color: #0f172a; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
                
                @media (max-width: 768px) {
                    .nav-bar { flex-direction: column; align-items: flex-start; padding: 1rem; gap: 12px; }
                    .qa-title { font-size: 1.25rem; }
                    .tabs-container { width: 100%; display: flex; gap: 5px; }
                    .tab-btn { flex: 1; text-align: center; padding: 8px 5px; font-size: 0.85rem; } 
                    .main-container { padding: 20px 16px; }
                    .card-custom h5 { padding-right: 100px !important; }
                }
            `}</style>

            {/* Navbar */}
            <nav className="nav-bar">
                <h4 className="qa-title" onClick={() => navigate('/dashboard')}>
                    <i className="bi bi-arrow-left-circle text-muted me-2"></i>QA Hub (Quality Assurance)
                </h4>
                
                {/* Tabs */}
                <div className="tabs-container">
                    <button className={`tab-btn ${currentCategory === 'daily' ? 'active' : ''}`} onClick={() => navigate('/qa-hub/daily')}>Daily</button>
                    <button className={`tab-btn ${currentCategory === 'monthly' ? 'active' : ''}`} onClick={() => navigate('/qa-hub/monthly')}>Monthly</button>
                    <button className={`tab-btn ${currentCategory === 'yearly' ? 'active' : ''}`} onClick={() => navigate('/qa-hub/yearly')}>Yearly</button>
                </div>
            </nav>

            {/* Cards Grid */}
            <div className="main-container">
                <div className="row g-4">
                    {currentReports && currentReports.length > 0 ? currentReports.map((r) => (
                        <div className="col-md-6 col-lg-4" key={r.id}>
                            <div className="card-custom" onClick={() => handleCardClick(r)}>
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
                                <h5 style={{fontWeight:800,fontSize:'1rem',color:'#0f172a',marginBottom:'1rem', paddingRight: '140px'}}>{r.title}</h5>
                                <div className="meta-tag"><i className="bi bi-file-earmark-text text-muted"></i>Form: <span style={{color:'#0f172a'}}>{r.formNo}</span></div>
                                {r.resp && <div className="meta-tag"><i className="bi bi-person-badge text-muted"></i>Resp: <span style={{color:'#0f172a'}}>{r.resp}</span></div>}
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
                            </div>
                            <div>
                                <p style={{fontWeight:800,fontSize:'0.95rem',margin:0,color:'#0f172a'}}>{selectedCard.title}</p>
                                <p style={{fontSize:'0.75rem',color:'#64748b',margin:0}}>Form: {selectedCard.formNo}</p>
                            </div>
                        </div>

                        <div style={{borderTop:'1px solid #f1f5f9',margin:'16px 0'}}></div>
                        <p style={{fontSize:'0.78rem',color:'#94a3b8',fontWeight:600,marginBottom:14,textTransform:'uppercase',letterSpacing:'0.06em'}}>What would you like to do?</p>

                        <button className="modal-action-btn" onClick={handleFillData}>
                            <div className="modal-btn-icon" style={{background:'#f1f5f9', color:'#0f172a'}}>
                                <i className="bi bi-pencil-square"></i>
                            </div>
                            <div>
                                <p style={{fontWeight:700,fontSize:'0.9rem',margin:0,color:'#0f172a'}}>Fill Data</p>
                                <p style={{fontSize:'0.75rem',color:'#64748b',margin:0}}>Enter new data into the form</p>
                            </div>
                            <i className="bi bi-chevron-right ms-auto text-muted" style={{fontSize:'0.85rem'}}></i>
                        </button>

                        <button className="modal-action-btn" onClick={handleViewData}>
                            <div className="modal-btn-icon" style={{background:'#f1f5f9', color:'#0f172a'}}>
                                <i className="bi bi-eye"></i>
                            </div>
                            <div>
                                <p style={{fontWeight:700,fontSize:'0.9rem',margin:0,color:'#0f172a'}}>View Data</p>
                                <p style={{fontSize:'0.75rem',color:'#64748b',margin:0}}>View saved records from the database</p>
                            </div>
                            <i className="bi bi-chevron-right ms-auto text-muted" style={{fontSize:'0.85rem'}}></i>
                        </button>

                        <button className="modal-action-btn" onClick={handlePrintData}>
                            <div className="modal-btn-icon" style={{background:'#f1f5f9', color:'#0f172a'}}>
                                <i className="bi bi-printer"></i>
                            </div>
                            <div>
                                <p style={{fontWeight:700,fontSize:'0.9rem',margin:0,color:'#0f172a'}}>Print Data</p>
                                <p style={{fontSize:'0.75rem',color:'#64748b',margin:0}}> Print saved records</p>
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