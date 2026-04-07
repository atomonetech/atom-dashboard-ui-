import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReportsDashboard = () => {
    const navigate = useNavigate();

    const reportModules = [
        {
            id: 'raw_material',
            title: 'Raw Material Report',
            description: 'Log inspection data for incoming raw materials and components.',
            icon: 'bi-box-seam',
            color: '#f59e0b', 
            bgColor: '#fef3c7',
            delay: '0.1s'
        },
        {
            id: 'patrolling',
            title: 'Patrolling Inspection',
            description: 'Record in-process quality checks and 4-hourly floor monitoring.',
            icon: 'bi-clipboard-check',
            color: '#4f46e5', 
            bgColor: '#e0e7ff',
            delay: '0.2s'
        },
        {
            id: 'layout',
            title: 'Layout Report',
            description: 'Detailed dimensional layout and first-piece approval records.',
            icon: 'bi-bounding-box-circles',
            color: '#06b6d4', 
            bgColor: '#cffafe',
            delay: '0.3s'
        },
        {
            id: 'pdi',
            title: 'PDI Report',
            description: 'Pre-Dispatch Inspection to ensure quality before final shipping.',
            icon: 'bi-truck',
            color: '#10b981', 
            bgColor: '#d1fae5',
            delay: '0.4s'
        },
        {
            id: 'dispatch',
            title: 'Dispatch Report',
            description: 'Log and verify final outgoing shipments and logistics tracking.',
            icon: 'bi-send-check',
            color: '#8b5cf6', 
            bgColor: '#ede9fe',
            delay: '0.5s'
        },
        {
            id: 'procedure',
            title: 'SOP & Procedures',
            description: 'View standard operating procedures, manuals, and guidelines.',
            icon: 'bi-journal-text',
            color: '#ec4899', 
            bgColor: '#fce7f3',
            delay: '0.6s'
        }
    ];

    const handleCardClick = (reportId, reportTitle) => {
        const routes = {
            'patrolling': '/qms/inspection-form',
            'raw_material': '/qms/raw-material-form',
            'pdi': '/qms/pdi-report-form',
            'procedure': '/qms'
        };

        if (routes[reportId]) {
            navigate(routes[reportId]);
        } else {
            alert(`Construction in Progress 🚧\nThe [${reportTitle}] module is coming soon!`);
        }
    };

    return (
        <div className="reports-page-wrapper">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            
            <style>{`
                .reports-page-wrapper {
                    min-height: 100vh !important;
                    background-color: #f8fafc !important; 
                    padding-bottom: 80px !important;
                    font-family: 'Inter', 'Segoe UI', sans-serif !important;
                }

                /* NAVBAR STYLES */
                .nav-bar {
                    background-color: #ffffff !important;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06) !important;
                    padding: 0.7rem 1.5rem !important;
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                }

                .nav-content {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start; /* Shifts content to the left */
                    gap: 8px;
                }

                .back-icon-btn {
                    color: #64748b;
                    font-size: 1.8rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    transition: all 0.2s ease;
                    padding: 2px;
                }

                .back-icon-btn:hover {
                    color: #7c3aed; /* Purple hover */
                    transform: scale(1.1);
                }

                .brand-text {
                    font-weight: 800;
                    color: #7c3aed; /* Vibrant Purple */
                    margin: 0;
                    font-size: 1.35rem;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    letter-spacing: -0.5px;
                }
                
                .main-container { 
                    max-width: 1200px !important; 
                    margin: 0 auto !important; 
                    padding: 0 24px;
                }
                
                .dashboard-header { 
                    text-align: center; 
                    margin-bottom: 4rem; 
                    margin-top: 3.5rem; 
                }
                
                .dashboard-title { font-weight: 900 !important; color: #0f172a !important; font-size: 2.8rem !important; letter-spacing: -1px !important; margin-bottom: 0.5rem !important;}
                .dashboard-subtitle { color: #64748b !important; font-size: 1.1rem !important; font-weight: 500 !important;}

                /* MODULE CARDS */
                .module-card { 
                    background: #ffffff !important; 
                    border: 1px solid #e2e8f0 !important; 
                    border-radius: 16px !important; 
                    padding: 2.5rem 2rem !important; 
                    cursor: pointer !important; 
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; 
                    height: 100% !important;
                    position: relative !important;
                    overflow: hidden !important;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;
                }

                .module-card:hover { 
                    transform: translateY(-8px) !important; 
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important; 
                }
                
                .module-card::before {
                    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 5px; 
                    background: var(--card-color); 
                    opacity: 0.8;
                }

                .icon-wrapper {
                    width: 65px; height: 65px; 
                    border-radius: 14px; 
                    display: flex; align-items: center; justify-content: center; 
                    font-size: 1.8rem; margin-bottom: 1.5rem;
                }

                .card-title-custom { font-weight: 800 !important; font-size: 1.25rem !important; color: #0f172a !important; margin-bottom: 0.8rem !important; }
                .card-desc-custom { font-size: 0.95rem !important; color: #64748b !important; line-height: 1.5 !important; margin: 0 !important; }

                @keyframes scaleUpFade { 
                    0% { opacity: 0; transform: translateY(20px); } 
                    100% { opacity: 1; transform: translateY(0); } 
                }
                .animate-card { opacity: 0; animation: scaleUpFade 0.5s ease-out forwards; }

                @media (max-width: 768px) {
                    .dashboard-title { font-size: 2rem !important; }
                    .nav-bar { padding: 0.7rem 1rem !important; }
                }
            `}</style>

            {/* PURPLE LEFT-ALIGNED NAVBAR */}
            <nav className="nav-bar">
                <div className="nav-content">
                    <div className="back-icon-btn" onClick={() => navigate('/dashboard')}>
                        <i className="bi bi-arrow-left-short"></i>
                    </div>
                    <h1 className="brand-text">
                        <i className="bi bi-box-seam"></i> Qms Site
                    </h1>
                </div>
            </nav>

            <div className="main-container">
                <div className="dashboard-header animate-card" style={{animationDelay: '0s'}}>
                    <h1 className="dashboard-title">Quality Assurance Hub</h1>
                    <p className="dashboard-subtitle">Select a module to initiate or review inspection reports.</p>
                </div>

                <div className="row justify-content-center g-4">
                    {reportModules.map((module) => (
                        <div key={module.id} className="col-md-6 col-lg-4 animate-card" style={{animationDelay: module.delay}}>
                            <div 
                                className="module-card" 
                                style={{'--card-color': module.color}} 
                                onClick={() => handleCardClick(module.id, module.title)}
                            >
                                <div className="icon-wrapper" style={{backgroundColor: module.bgColor, color: module.color}}>
                                    <i className={`bi ${module.icon}`}></i>
                                </div>
                                <h3 className="card-title-custom">{module.title}</h3>
                                <p className="card-desc-custom">{module.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportsDashboard;