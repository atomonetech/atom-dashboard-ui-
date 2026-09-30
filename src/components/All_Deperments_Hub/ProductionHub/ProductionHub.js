import React, { useState } from 'react';
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
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { type: "spring", stiffness: 100, damping: 15 } 
        }
    };

    const handleAction = (action) => {
        if (!selectedCard) return;

        if (!selectedCard.isLive) {
            alert(`"${selectedCard.title}" is currently under development.`);
            setShowOptionsModal(false);
            return;
        }

        const formName = selectedCard.formRoute?.startsWith('/') 
            ? selectedCard.formRoute.substring(1) 
            : selectedCard.formRoute;

        const reportName = selectedCard.printRoute?.startsWith('/') 
            ? selectedCard.printRoute.substring(1) 
            : selectedCard.printRoute;

        let targetPath = '';

        if (action === 'fill') {
            targetPath = `/production-hub/${currentCategory}/${formName}`;
        } else if (action === 'print') {
            targetPath = `/production-hub/${currentCategory}/${reportName}`;
        } else if (action === 'view') {
            targetPath = `/production-hub/view/${selectedCard.viewKey}`;
        }

        if (targetPath) {
            navigate(targetPath, { state: { mode: action, fromCategory: currentCategory } });
        }
        
        setShowOptionsModal(false);
    };

    const closeModal = (e) => {
        if (e) e.stopPropagation();
        setShowOptionsModal(false);
        setSelectedCard(null);
    };

    return (
        <div className="hub-viewport">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

                .hub-viewport { 
                    min-height: 100vh; 
                    background-color: #0f172a; 
                    font-family: 'Inter', sans-serif; color: #f8fafc; 
                    padding-bottom: 80px;
                }

                /* --- Exact QA Hub Sticky Navbar --- */
                .nav-bar { 
                    position: sticky; 
                    top: 0; 
                    background: #0f172a; 
                    min-height: 70px; 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    padding: 0 2rem; 
                    box-shadow: 0 1px 0 #263750;
                    z-index: 1000; 
                    gap: 15px; 
                }
                .qa-title { 
                    font-weight: 900; 
                    color: #22d3ee; 
                    margin: 0; 
                    cursor: pointer; 
                    font-size: 1.4rem; 
                    display: flex; 
                    align-items: center; 
                }

                /* --- Main Container Fluid Setup --- */
                .main-container { 
                    padding: 32px 24px; 
                    width: 100%; 
                    margin: 0 auto; 
                }

                /* --- Header Section (Clean Style) --- */
                .hub-header { 
                    text-align: center; 
                    padding: 40px 20px 24px; 
                }
                .hub-header h1 { 
                    font-size: 2.4rem; 
                    font-weight: 900; 
                    color: #22d3ee; 
                    margin-bottom: 8px; 
                }
                .hub-header p { 
                    color: #94a3b8; 
                    font-size: 1rem; 
                    max-width: 600px; 
                    margin: 0 auto; 
                }

                /* --- Exact QA Hub Tabs CSS --- */
                .tabs-container { 
                    display: flex; 
                    gap: 10px; 
                    background: #182338; 
                    padding: 6px; 
                    border-radius: 8px; 
                    overflow-x: auto; 
                    white-space: nowrap; 
                    -ms-overflow-style: none; 
                    scrollbar-width: none; 
                }
                .tabs-container::-webkit-scrollbar { display: none; }
                .tab-btn { 
                    padding: 8px 20px; 
                    border: none; 
                    background: transparent; 
                    color: #94a3b8; 
                    font-weight: 700; 
                    font-size: 0.9rem; 
                    border-radius: 6px; 
                    cursor: pointer; 
                    transition: 0.2s; 
                    white-space: nowrap; 
                }
                .tab-btn.active { 
                    background: #22314a; 
                    color: #22d3ee; 
                    box-shadow: 0 2px 4px rgba(0,0,0,0.18); 
                }

                /* --- Grid matching QaHub layout exactly --- */
                .reports-grid { 
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 24px;
                    width: 100%;
                }

                /* --- Exact QaHub Card Style --- */
                .card-custom { 
                    position: relative; 
                    background: #182338; 
                    border: 1px solid #263750; 
                    border-radius: 10px; 
                    padding: 1.5rem; 
                    cursor: pointer; 
                    transition: all 0.25s ease-in-out; 
                    height: 100%; 
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.18); 
                }
                .card-custom:hover { 
                    transform: translateY(-4px); 
                    border-color: #22d3ee; 
                    box-shadow: 0 12px 24px rgba(34, 211, 238, 0.10); 
                }
                
                .card-body-content {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                }

                .meta-tag { 
                    background: #202d43; 
                    padding: 6px 10px; 
                    border-radius: 6px; 
                    font-size: 0.75rem; 
                    font-weight: 600; 
                    color: #94a3b8; 
                    display: flex; 
                    align-items: center; 
                    gap: 8px; 
                    margin-bottom: 6px; 
                }
                
                /* Professional Badges CSS */
                .status-badge { 
                    position: absolute; 
                    top: 16px; 
                    right: 16px; 
                    padding: 5px 10px; 
                    border-radius: 4px; 
                    font-size: 0.65rem; 
                    font-weight: 700; 
                    text-transform: uppercase; 
                    letter-spacing: 0.05em; 
                    display: flex; 
                    align-items: center; 
                    gap: 6px; 
                }
                .status-live { background: #0f2f25; color: #4ade80; border: 1px solid #166534; }
                .status-dev { background: #202d43; color: #94a3b8; border: 1px solid #3b4b63; }
                
                /* Icon Animations */
                .pulse-icon { animation: pulseAnim 2s infinite; font-size: 0.8rem; }
                @keyframes pulseAnim { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
                .spin-icon { animation: spinAnim 4s linear infinite; font-size: 0.8rem; }
                @keyframes spinAnim { 100% { transform: rotate(360deg); } }

                /* MODAL CSS (Exact matching QaHub modal structure) */
                .modal-overlay { 
                    position: fixed; 
                    inset: 0; 
                    background: rgba(2,6,23,0.78); 
                    backdrop-filter: blur(3px); 
                    z-index: 99999; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    padding: 16px; 
                    animation: fadeIn 0.15s ease; 
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .modal-box { 
                    background: #182338; border: 1px solid #263750; 
                    border-radius: 12px; 
                    padding: 2rem; 
                    width: 100%; 
                    max-width: 400px; 
                    box-shadow: 0 24px 60px rgba(0,0,0,0.2); 
                    animation: slideUp 0.2s ease; 
                    position: relative; 
                }
                @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .modal-close-btn { 
                    position: absolute; 
                    top: 14px; 
                    right: 16px; 
                    background: #202d43; 
                    border: none; 
                    border-radius: 4px; 
                    width: 32px; 
                    height: 32px; 
                    font-size: 16px; 
                    color: #94a3b8; 
                    cursor: pointer; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    transition: background 0.2s; 
                }
                .modal-close-btn:hover { background: #2a3952; }
                .modal-action-btn { 
                    display: flex; 
                    align-items: center; 
                    gap: 14px; 
                    padding: 14px 16px; 
                    border-radius: 8px; 
                    border: 1.5px solid #263750; 
                    background: #111c2f; 
                    cursor: pointer; 
                    text-align: left; 
                    width: 100%; 
                    transition: all 0.2s; 
                    margin-bottom: 10px; 
                    font-family: 'Inter', sans-serif; color: #f8fafc; 
                }
                .modal-action-btn:hover { 
                    transform: translateY(-2px); 
                    box-shadow: 0 6px 18px rgba(0,0,0,0.22); 
                    border-color: #22d3ee; 
                }
                .modal-action-btn:last-child { margin-bottom: 0; }
                .modal-btn-icon { 
                    width: 42px; 
                    height: 42px; 
                    border-radius: 6px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-size: 1.2rem; 
                    flex-shrink: 0; 
                }

                @media (max-width: 768px) {
                    .nav-bar { flex-direction: column; align-items: flex-start; padding: 1rem; gap: 12px; }
                    .qa-title { font-size: 1.25rem; }
                    .tabs-container { width: 100%; display: flex; gap: 5px; }
                    .tab-btn { flex: 1; text-align: center; padding: 8px 5px; font-size: 0.85rem; } 
                    .main-container { padding: 20px 16px; }
                    .card-custom h5 { padding-right: 90px !important; }
                }
            `}</style>

            {/* Navbar matching QaHub layout & blue styled back button */}
            <nav className="nav-bar">
                <h4 className="qa-title" onClick={() => navigate('/dashboard')}>
                    <i className="bi bi-arrow-left-circle m-2" style={{color: '#22d3ee'}}></i> Back To Dashboard
                </h4>
                 <header className="hub-header">
                <h1>Production Hub</h1>
                <p>Manage manufacturing plans, operational logs, and output reports efficiently.</p>
            </header>
                
                {/* Tabs matching QaHub */}
                <div className="tabs-container">
                    {['daily', 'monthly', 'yearly'].map((tab) => (
                        <button
                            key={tab}
                            className={`tab-btn ${currentCategory === tab ? 'active' : ''}`}
                            onClick={() => navigate(`/production-hub/${tab}`)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </nav>

            {/* <header className="hub-header">
                <h1>Production Hub</h1>
                <p>Manage manufacturing plans, operational logs, and output reports efficiently.</p>
            </header> */}

            <div className="main-container">
                {filteredReports.length > 0 ? (
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
                                className="card-custom"
                                variants={cardVariants}
                                onClick={() => { setSelectedCard(r); setShowOptionsModal(true); }}
                            >
                                <div className={`status-badge ${r.isLive ? 'status-live' : 'status-dev'}`}>
                                    {r.isLive ? (
                                        <><i className="bi bi-broadcast pulse-icon"></i> Live</>
                                    ) : (
                                        <><i className="bi bi-gear-wide-connected spin-icon"></i> Under Dev</>
                                    )}
                                </div>

                                <div style={{width:'46px', height:'46px', borderRadius:'8px', background:'#10293a', color:r.color || '#22d3ee', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', marginBottom:'1rem'}}>
                                    <i className={r.icon}></i>
                                </div>

                                <h5 style={{fontWeight:800, fontSize:'0.95rem', color:'#f8fafc', marginBottom:'1rem', paddingRight: '110px', lineHeight: '1.4'}}>{r.title}</h5>

                                <div className="card-body-content">
                                    <div className="meta-tag"><i className="bi bi-file-earmark-text text-muted"></i>Form: <span style={{color:'#f8fafc'}}>{r.formNo}</span></div>
                                    <div className="meta-tag mb-0"><i className="bi bi-calendar-event text-muted"></i>Freq: <span style={{color:'#f8fafc'}}>{r.category}</span></div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="col-12 text-center py-5 text-muted" style={{ width: '100%', marginTop: '40px' }}>
                        <i className="bi bi-inbox fs-1"></i>
                        <h5 className="mt-3">No reports available in {currentCategory} yet.</h5>
                    </div>
                )}
            </div>

            {/* Modal strictly structured identical to QaHub */}
            <AnimatePresence>
                {showOptionsModal && selectedCard && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                            <button className="modal-close-btn" onClick={closeModal}>
                                <i className="bi bi-x-lg"></i>
                            </button>

                            {/* Card Info */}
                            <div style={{display:'flex', alignItems:'center', gap:14, marginBottom:8}}>
                                <div style={{width:46, height:46, borderRadius:8, background:'#10293a', color:selectedCard.color || '#22d3ee', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', flexShrink:0}}>
                                    <i className={selectedCard.icon}></i>
                                </div>
                                <div>
                                    <p style={{fontWeight:800, fontSize:'0.95rem', margin:0, color:'#f8fafc'}}>{selectedCard.title}</p>
                                    <p style={{fontSize:'0.75rem', color:'#94a3b8', margin:0}}>Form: {selectedCard.formNo}</p>
                                </div>
                            </div>

                            <div style={{borderTop:'1px solid #263750', margin:'16px 0'}}></div>
                            <p style={{fontSize:'0.78rem', color:'#94a3b8', fontWeight:600, marginBottom:14, textTransform:'uppercase', letterSpacing:'0.06em'}}>What would you like to do?</p>

                            <button className="modal-action-btn" onClick={() => handleAction('fill')}>
                                <div className="modal-btn-icon" style={{background:'#202d43', color:'#22d3ee'}}>
                                    <i className="bi bi-pencil-square"></i>
                                </div>
                                <div>
                                    <p style={{fontWeight:700, fontSize:'0.9rem', margin:0, color:'#f8fafc'}}>Fill Data</p>
                                    <p style={{fontSize:'0.75rem', color:'#94a3b8', margin:0}}>Enter new data into the form</p>
                                </div>
                                <i className="bi bi-chevron-right ms-auto text-muted" style={{fontSize:'0.85rem'}}></i>
                            </button>

                            <button className="modal-action-btn" onClick={() => handleAction('view')}>
                                <div className="modal-btn-icon" style={{background:'#202d43', color:'#22d3ee'}}>
                                    <i className="bi bi-eye"></i>
                                </div>
                                <div>
                                    <p style={{fontWeight:700, fontSize:'0.9rem', margin:0, color:'#f8fafc'}}>View Data</p>
                                    <p style={{fontSize:'0.75rem', color:'#94a3b8', margin:0}}>View saved records from the database</p>
                                </div>
                                <i className="bi bi-chevron-right ms-auto text-muted" style={{fontSize:'0.85rem'}}></i>
                            </button>

                            <button className="modal-action-btn" onClick={() => handleAction('print')}>
                                <div className="modal-btn-icon" style={{background:'#202d43', color:'#22d3ee'}}>
                                    <i className="bi bi-printer"></i>
                                </div>
                                <div>
                                    <p style={{fontWeight:700, fontSize:'0.9rem', margin:0, color:'#f8fafc'}}>Print Data</p>
                                    <p style={{fontSize:'0.75rem', color:'#94a3b8', margin:0}}>Print saved records</p>
                                </div>
                                <i className="bi bi-chevron-right ms-auto text-muted" style={{fontSize:'0.85rem'}}></i>
                            </button>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductionHub;