import React, { useState } from 'react';
<<<<<<< Updated upstream
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
=======
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { productionReports } from './data/productionData';

const ProductionHub = () => {
    const navigate = useNavigate();
    const { category } = useParams();
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const currentCategory = category || 'daily';
    const filteredReports = productionReports.filter(r => r.category === currentCategory);

    // --- Animation Variants ---
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.1 }
>>>>>>> Stashed changes
        }
        setModalOpen(false);
    };

<<<<<<< Updated upstream
    const handlePrintData = () => {
        if (selectedCard?.printRoute && selectedCard?.isLive) {
            navigate(selectedCard.printRoute);
        } else {
            alert(`"${selectedCard?.title}" ka print page abhi under development hai.`);
=======
    const cardVariants = {
        hidden: { opacity: 0, y: -100 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { type: "spring", stiffness: 100, damping: 15 } 
        },
        hover: { 
            y: -8,
            boxShadow: "0 20px 30px -10px rgba(0,0,0,0.1)",
            transition: { duration: 0.3 }
>>>>>>> Stashed changes
        }
        setModalOpen(false);
    };

<<<<<<< Updated upstream
    const handleViewData = () => {
        if (selectedCard?.viewKey && selectedCard?.isLive) {
            navigate(`/Production/View/${selectedCard.viewKey}`);
        } else {
            alert(`"${selectedCard?.title}" ka view page abhi under development hai.`);
        }
        setModalOpen(false);
=======
const handleAction = (action) => {
    if (!selectedCard) return;

    // 1. Get the base form name from the route (e.g., "Operator-5S-Checklist")
    // We remove the leading slash if it exists in the data
    const formName = selectedCard.formRoute.startsWith('/') 
        ? selectedCard.formRoute.substring(1) 
        : selectedCard.formRoute;

    const reportName = selectedCard.printRoute.startsWith('/') 
        ? selectedCard.printRoute.substring(1) 
        : selectedCard.printRoute;

    // 2. Build the dynamic nested path: /production-hub/daily/Operator-5S-Checklist
    // This MUST match the path in your productionRoutes.js
    const targetPath = action === 'fill' 
        ? `/production-hub/${currentCategory}/${formName}` 
        : `/production-hub/${currentCategory}/${reportName}`;

    // 3. Navigate to the correct nested route
    navigate(targetPath, { state: { mode: action } });
    
    setShowOptionsModal(false);
};

    const closeModal = (e) => {
        if (e) e.stopPropagation();
        setShowOptionsModal(false);
        setSelectedCard(null);
>>>>>>> Stashed changes
    };

    return (
        <div className="hub-viewport">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            
            <style>{`
<<<<<<< Updated upstream
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
=======
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');

                .hub-viewport { 
                    min-height: 100vh; 
                    background: #f8fafc; 
                    font-family: 'Plus Jakarta Sans', sans-serif; 
                    padding-bottom: 80px;
                }

                /* --- Balanced Navbar --- */
                .navbar-simple {
                    background: white;
                    padding: 0 4%;
                    height: 65px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #edf2f7;
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                }

                .nav-brand-section { display: flex; align-items: center; gap: 12px; }
                
                .back-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    border: 1px solid #e2e8f0;
                    color: #64748b;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding-top:12px;
                }
                .back-btn:hover { background: #f8fafc; color: #3b82f6; border-color: #3b82f6; }

                .nav-brand { display: flex; align-items: center; gap: 8px; font-weight: 700; color: #1e293b; font-size: 0.95rem; cursor: pointer; }

                /* Hero Section */
                .hero-section { text-align: center; padding: 60px 20px 30px; }
                .hero-section h1 { font-size: 3.5rem; font-weight: 800; color: #0f172a; margin-bottom: 12px; }
                .hero-section p { color: #64748b; font-size: 1.1rem; max-width: 600px; margin: 0 auto; }

                /* Tab Switcher */
                .tab-nav { display: flex; justify-content: center; margin-bottom: 40px; }
                .tab-container { background: #e2e8f0; padding: 5px; border-radius: 12px; display: flex; gap: 5px; }
                .tab-link { 
                    padding: 10px 28px; border: none; border-radius: 10px; font-weight: 700; 
                    font-size: 0.85rem; color: #64748b; background: transparent; transition: 0.3s; cursor: pointer;
                }
                .tab-link.active { background: white; color: #3b82f6; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }

                /* Card Grid */
                .reports-grid { 
                    display: grid; 
                    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); 
                    gap: 25px; 
                    padding: 0 5%; 
                    max-width: 1440px; 
                    margin: 0 auto; 
                }

                /* Quality Hub Card Style */
                .card-premium {
                    background: white; 
                    border-radius: 16px; 
                    padding: 30px; 
                    cursor: pointer;
                    border: 1px solid #e2e8f0; 
                    border-top: 5px solid var(--accent);
                    position: relative; 
                    transition: transform 0.3s, box-shadow 0.3s;
                }
                
                .icon-circle { 
                    width: 48px; height: 48px; border-radius: 12px; 
                    background: #f8fafc; border: 1px solid #e2e8f0; 
                    display: flex; align-items: center; justify-content: center; 
                    font-size: 1.3rem; margin-bottom: 25px; color: var(--accent); 
                }
                
                .card-title { font-size: 1.25rem; font-weight: 700; color: #1e293b; margin-bottom: 20px; letter-spacing: -0.01em; }
                
                .data-row { display: flex; align-items: center; margin-bottom: 10px; }
                .data-label { font-size: 0.65rem; font-weight: 800; color: #94a3b8; width: 60px; text-transform: uppercase; }
                .data-value { 
                    font-size: 0.75rem; font-weight: 700; color: #475569; 
                    background: #f1f5f9; padding: 4px 12px; border-radius: 6px; 
                }

                /* Modal UI */
                .modal-overlay { 
                    position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); 
                    backdrop-filter: blur(8px); display: flex; align-items: center; 
                    justify-content: center; z-index: 2000; 
                }
                .modal-ui { background: white; width: 92%; max-width: 420px; border-radius: 28px; padding: 35px; text-align: center; border-top: 8px solid var(--accent-modal); }
            `}</style>

            <nav className="navbar-simple">
                <div className="nav-brand-section">
                   
                    <div className="nav-brand" onClick={() => navigate('/dashboard')}>
                        
                        <i className="bi bi-chevron-left"></i>
               
                        <span>AtomOne Production</span>
                    </div>
                </div>
                <div style={{fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.5px'}}>ATOMONE TECHNOLOGIES</div>
            </nav>

            <header className="hero-section">
                <h1>Production Hub</h1>
                <p>Manage manufacturing plans, operational logs, and output reports efficiently.</p>
            </header>

            <div className="tab-nav">
                <div className="tab-container">
                    {['daily', 'monthly', 'yearly'].map((tab) => (
                        <button
                            key={tab}
                            className={`tab-link ${currentCategory === tab ? 'active' : ''}`}
                            onClick={() => navigate(`/production-hub/${tab}`)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
>>>>>>> Stashed changes
                    ))}
                </div>
            </div>

<<<<<<< Updated upstream
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
=======
            <motion.div 
                className="reports-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key={currentCategory}
            >
                {filteredReports.map((r) => (
                    <motion.div 
                        key={r.id}
                        className="card-premium"
                        style={{ '--accent': r.color }}
                        variants={cardVariants}
                        whileHover="hover"
                        onClick={() => { setSelectedCard(r); setShowOptionsModal(true); }}
                    >
                        <div className="icon-circle">
                            <i className={r.icon}></i>
                        </div>

                        <h3 className="card-title">{r.title}</h3>

                        <div className="data-row">
                            <span className="data-label">Form:</span>
                            <span className="data-value">{r.formNo}</span>
                        </div>
                        <div className="data-row">
                            <span className="data-label">Freq:</span>
                            <span className="data-value">{r.category}</span>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <AnimatePresence>
                {showOptionsModal && selectedCard && (
                    <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal}>
                        <motion.div 
                            className="modal-ui" 
                            style={{ '--accent-modal': selectedCard.color }}
                            initial={{ scale: 0.9, y: 20 }} 
                            animate={{ scale: 1, y: 0 }} 
                            exit={{ scale: 0.9, y: 20 }} 
                            onClick={e => e.stopPropagation()}
                        >
                            <h4 style={{fontWeight: 800, marginBottom: '25px', color: '#0f172a'}}>{selectedCard.title}</h4>
                            <div className="d-grid gap-2">
                                <button className="btn btn-primary py-3 rounded-3 fw-bold shadow-sm" style={{background: selectedCard.color, border: 'none'}} onClick={() => handleAction('fill')}>
                                    Fill New Entry Form
                                </button>
                                <button className="btn btn-light py-3 rounded-3 fw-bold text-muted" onClick={() => handleAction('view')}>
                                    View Log Details
                                </button>
                                <button className="btn btn-light py-3 rounded-3 fw-bold text-muted" onClick={() => handleAction('print')}>
                                    Export to PDF / Print
                                </button>
                                <button className="btn btn-link text-danger mt-2 fw-bold text-decoration-none" onClick={closeModal}>
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
>>>>>>> Stashed changes
        </div>
    );
};

export default ProductionHub;