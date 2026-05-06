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
        }
    };

    const handleAction = (action) => {
        if (!selectedCard) return;

        if (!selectedCard.isLive) {
            alert(`"${selectedCard.title}" is currently under development.`);
            setShowOptionsModal(false);
            return;
        }

        // 1. Get the base form name from the route
        const formName = selectedCard.formRoute?.startsWith('/') 
            ? selectedCard.formRoute.substring(1) 
            : selectedCard.formRoute;

        const reportName = selectedCard.printRoute?.startsWith('/') 
            ? selectedCard.printRoute.substring(1) 
            : selectedCard.printRoute;

        let targetPath = '';

        // 2. Build the dynamic nested path
        if (action === 'fill') {
            targetPath = `/production-hub/${currentCategory}/${formName}`;
        } else if (action === 'print') {
            targetPath = `/production-hub/${currentCategory}/${reportName}`;
        } else if (action === 'view') {
            targetPath = `/production-hub/view/${selectedCard.viewKey}`;
        }

        // 3. Navigate to the correct nested route
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

                .status-badge { position: absolute; top: 16px; right: 16px; padding: 5px 10px; border-radius: 4px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 6px; }
                .status-live { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
                .status-dev { background: #f8fafc; color: #475569; border: 1px solid #cbd5e1; }
                
                .pulse-icon { animation: pulseAnim 2s infinite; font-size: 0.8rem; }
                @keyframes pulseAnim { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
                .spin-icon { animation: spinAnim 4s linear infinite; font-size: 0.8rem; }
                @keyframes spinAnim { 100% { transform: rotate(360deg); } }

                /* Modal UI */
                .modal-overlay { 
                    position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); 
                    backdrop-filter: blur(8px); display: flex; align-items: center; 
                    justify-content: center; z-index: 2000; 
                }
                .modal-ui { background: white; width: 92%; max-width: 420px; border-radius: 28px; padding: 35px; text-align: center; border-top: 8px solid var(--accent-modal); }

                @media (max-width: 768px) {
                    .hero-section h1 { font-size: 2.5rem; }
                    .tab-container { width: 100%; display: flex; gap: 5px; }
                    .tab-link { flex: 1; text-align: center; padding: 8px 5px; font-size: 0.85rem; } 
                }
            `}</style>

            <nav className="navbar-simple">
                <div className="nav-brand-section">
                    <div className="nav-brand" onClick={() => navigate('/dashboard')}>
                        <i className="bi bi-chevron-left" style={{marginRight: '5px'}}></i>
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
                    ))}
                </div>
            </div>

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
                            className="card-premium"
                            style={{ '--accent': r.color }}
                            variants={cardVariants}
                            whileHover="hover"
                            onClick={() => { setSelectedCard(r); setShowOptionsModal(true); }}
                        >
                            <div className={`status-badge ${r.isLive ? 'status-live' : 'status-dev'}`}>
                                {r.isLive ? <><i className="bi bi-broadcast pulse-icon"></i> Live</> : <><i className="bi bi-gear-wide-connected spin-icon"></i> Under Development</>}
                            </div>

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
            ) : (
                <div className="text-center py-5 text-muted" style={{ width: '100%', marginTop: '40px' }}>
                    <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
                    <h5 className="mt-3">No reports available in {currentCategory} yet.</h5>
                </div>
            )}

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
                            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                <button style={{padding: '12px', borderRadius: '8px', fontWeight: 'bold', background: selectedCard.color, color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}} onClick={() => handleAction('fill')}>
                                    Fill New Entry Form
                                </button>
                                <button style={{padding: '12px', borderRadius: '8px', fontWeight: 'bold', background: '#f1f5f9', color: '#475569', border: 'none', cursor: 'pointer'}} onClick={() => handleAction('view')}>
                                    View Log Details
                                </button>
                                <button style={{padding: '12px', borderRadius: '8px', fontWeight: 'bold', background: '#f1f5f9', color: '#475569', border: 'none', cursor: 'pointer'}} onClick={() => handleAction('print')}>
                                    Export to PDF / Print
                                </button>
                                <button style={{padding: '10px', background: 'transparent', color: '#ef4444', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px'}} onClick={closeModal}>
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductionHub;