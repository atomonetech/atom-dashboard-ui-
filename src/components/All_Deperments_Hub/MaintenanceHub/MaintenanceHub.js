import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MaintenanceHub = () => {
    const navigate = useNavigate();
    // Tab state: 'MACHINE' or 'TOOL'
    const [activeTab, setActiveTab] = useState('MACHINE');

    // 🔥 PDF DATA FOR MACHINE MAINTENANCE 🔥
    const machineReports = [
        {
            id: 'mc_history',
            title: 'Machine History Card',
            formNo: 'AOT-F-MM-02',
            frequency: 'Daily',
            responsibility: 'Maint engineer / Pro Engineer',
            icon: 'bi-clock-history',
            color: '#3b82f6', // Blue
            bgColor: '#eff6ff',
        },
        {
            id: 'mc_breakdown',
            title: 'Machine Breakdown Slip',
            formNo: 'AOT-F-BD-01',
            frequency: 'Daily',
            responsibility: 'Maint engineer / Pro Engineer',
            icon: 'bi-exclamation-triangle',
            color: '#ef4444', // Red
            bgColor: '#fef2f2',
        },
        {
            id: 'power_press_check',
            title: 'Daily Power Press Checklist',
            formNo: 'AOT-F-MM-02.',
            frequency: 'Daily',
            responsibility: 'Operator',
            icon: 'bi-speedometer2',
            color: '#f59e0b', // Amber
            bgColor: '#fef3c7',
        }
    ];

    // 🔥 PDF DATA FOR TOOL MAINTENANCE 🔥
    const toolReports = [
        {
            id: 'tool_history',
            title: 'Tool History Card',
            formNo: 'AOT-F-TM-01',
            frequency: 'Daily',
            responsibility: 'Tool Room Engineer',
            icon: 'bi-tools',
            color: '#8b5cf6', // Purple
            bgColor: '#ede9fe',
        },
        {
            id: 'tool_stroke',
            title: 'Tool Stroke for PM',
            formNo: 'AOT-F-TM-02',
            frequency: 'Daily',
            responsibility: 'Tool Room Engineer',
            icon: 'bi-activity',
            color: '#06b6d4', // Cyan
            bgColor: '#cffafe',
        },
        {
            id: 'tool_pm_check',
            title: 'Tool P.M. Checklist',
            formNo: 'AOT-F-TM-04',
            frequency: 'Daily',
            responsibility: 'Tool Room Engineer',
            icon: 'bi-card-checklist',
            color: '#10b981', // Green
            bgColor: '#d1fae5',
        },
        {
            id: 'tool_breakdown',
            title: 'Tool Break Down Slip',
            formNo: 'AOT-F-BD-02',
            frequency: 'Daily',
            responsibility: 'Prod. Engineer',
            icon: 'bi-hammer',
            color: '#ef4444', // Red
            bgColor: '#fef2f2',
        }
    ];

    const currentReports = activeTab === 'MACHINE' ? machineReports : toolReports;

    // const handleCardClick = (reportTitle) => {
    //     alert(`Construction in Progress 🚧\nThe [${reportTitle}] form is coming soon!`);
    // };

const handleCardClick = (reportId) => {

    switch (reportId) {

        case "mc_history":
            navigate("/Machine-Card-Form");
            break;

        case "mc_breakdown":
            navigate("/Machine-Breakdown-Slip");
            break;

        case "power_press_check":
            navigate("/Power-Press-Checklist");
            break;

        case "tool_history":
            navigate("/Tool-History-Form");
            break;

        case "tool_stroke":
            navigate("/Tool-Stroke-PM");
            break;

        case "tool_pm_check":
            navigate("/Tool-PM-Checklist-Form");
            break;

        case "tool_breakdown":
            navigate("/Tool-Breakdown-Form");
            break;

        default:
            alert("🚧 Form coming soon!");
    }

};

    return (
        <div className="maintenance-page-wrapper">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            
            <style>{`
                .maintenance-page-wrapper {
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100vw !important;
                    min-height: 100vh !important;
                    background-color: #f8fafc !important; 
                    z-index: 9999 !important;
                    overflow-y: auto !important;
                    overflow-x: hidden !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    font-family: 'Inter', 'Segoe UI', sans-serif !important;
                }
                
                .dashboard-navbar { 
                    position: fixed !important; 
                    top: 0 !important; 
                    left: 0 !important;
                    width: 100vw !important; 
                    height: 70px !important; 
                    background-color: #ffffff !important; 
                    border-bottom: 1px solid #e2e8f0 !important; 
                    z-index: 10000 !important; 
                    display: flex !important;
                    align-items: center !important;
                    justify-content: space-between !important; 
                    padding: 0 2rem !important;
                    box-sizing: border-box !important;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05) !important;
                    margin: 0 !important;
                }
                
                .brand-logo { font-weight: 900 !important; color: #4f46e5 !important; font-size: 1.4rem !important; letter-spacing: -0.5px !important; display: flex !important; align-items: center !important; gap: 8px !important; cursor: pointer; }
                
                @keyframes scaleUpFade { 
                    0% { opacity: 0; transform: translateY(30px) scale(0.95); } 
                    100% { opacity: 1; transform: translateY(0) scale(1); } 
                }
                .animate-card { opacity: 0; animation: scaleUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                
                .main-container { 
                    padding-top: 120px !important; 
                    padding-bottom: 80px !important;
                    padding-left: 24px !important;
                    padding-right: 24px !important;
                    max-width: 1200px !important; 
                    margin: 0 auto !important; 
                    box-sizing: border-box !important;
                }
                
                .dashboard-header { text-align: center; margin-bottom: 2rem; }
                .dashboard-title { font-weight: 900 !important; color: #0f172a !important; font-size: 2.8rem !important; letter-spacing: -1px !important; margin-bottom: 0.5rem !important;}
                .dashboard-subtitle { color: #64748b !important; font-size: 1.1rem !important; font-weight: 500 !important;}

                /* 🔥 CUSTOM TABS STYLING 🔥 */
                .tab-container {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 3.5rem;
                }
                .custom-tabs {
                    background-color: #e2e8f0;
                    padding: 0.4rem;
                    border-radius: 99px;
                    display: inline-flex;
                    gap: 0.5rem;
                }
                .tab-btn {
                    padding: 0.8rem 2rem;
                    border-radius: 99px;
                    border: none;
                    font-weight: 800;
                    font-size: 0.95rem;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    color: #64748b;
                    background: transparent;
                }
                .tab-btn.active {
                    background-color: #ffffff;
                    color: #4f46e5;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }

                .module-card { 
                    background: #ffffff !important; 
                    border: 1px solid #e2e8f0 !important; 
                    border-radius: 16px !important; 
                    padding: 2rem !important; 
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
                    border-color: transparent !important;
                }
                
                .module-card::before {
                    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 5px; 
                    background: var(--card-color); 
                    opacity: 0.8; transition: 0.3s;
                }
                .module-card:hover::before { opacity: 1; height: 6px; }

                .icon-wrapper {
                    width: 60px; height: 60px; 
                    border-radius: 14px; 
                    display: flex; align-items: center; justify-content: center; 
                    font-size: 1.8rem; margin-bottom: 1.5rem;
                    transition: 0.3s;
                }
                .module-card:hover .icon-wrapper { transform: scale(1.1) rotate(5deg); }

                .card-title-custom { font-weight: 800 !important; font-size: 1.15rem !important; color: #0f172a !important; margin-bottom: 1rem !important; }
                
                /* Metadata tags inside card */
                .meta-tag {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.8rem;
                    color: #475569;
                    background: #f1f5f9;
                    padding: 4px 10px;
                    border-radius: 6px;
                    margin-bottom: 8px;
                    font-weight: 600;
                }

                .go-arrow { 
                    position: absolute; bottom: 2rem; right: 2rem; 
                    font-size: 1.5rem; color: #e2e8f0; 
                    transition: 0.3s; opacity: 0; transform: translateX(-10px);
                }
                .module-card:hover .go-arrow { color: var(--card-color); opacity: 1; transform: translateX(0); }

                @media (max-width: 768px) {
                    .dashboard-navbar { padding: 0 1rem !important; }
                    .main-container { padding: 100px 16px 60px 16px !important; }
                    .dashboard-title { font-size: 2rem !important; }
                    .module-card { padding: 1.5rem !important; }
                    .tab-btn { padding: 0.6rem 1.2rem; font-size: 0.85rem; }
                }
            `}</style>

            {/* FULL WIDTH STICKY NAVBAR */}
            <nav className="dashboard-navbar">
                <div className="brand-logo" onClick={() => navigate('/dashboard')}>
                    <i className="bi bi-arrow-left-circle text-muted me-2" style={{fontSize: '1.2rem', transition: '0.2s'}}></i> 
                    <i className="bi bi-wrench-adjustable"></i> Maintenance Hub
                </div>
                <div>
                    <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill" style={{backgroundColor: '#e0e7ff', border: '1px solid #c7d2fe'}}>
                        <span style={{width: '8px', height: '8px', backgroundColor: '#4f46e5', borderRadius: '50%', display: 'inline-block'}}></span>
                        <span style={{fontSize: '0.75rem', fontWeight: '800', color: '#4338ca', letterSpacing: '0.5px', margin: 0}}>HUB ONLINE</span>
                    </div>
                </div>
            </nav>

            {/* MAIN CONTENT */}
            <div className="main-container">
                <div className="dashboard-header animate-card" style={{animationDelay: '0s'}}>
                    <h1 className="dashboard-title">Maintenance Hub</h1>
                    <p className="dashboard-subtitle">Manage Machine and Tool maintenance records seamlessly.</p>
                </div>

                {/* 🔥 PREMIUM TAB SWITCHER 🔥 */}
                <div className="tab-container animate-card" style={{animationDelay: '0.1s'}}>
                    <div className="custom-tabs">
                        <button 
                            className={`tab-btn ${activeTab === 'MACHINE' ? 'active' : ''}`}
                            onClick={() => setActiveTab('MACHINE')}
                        >
                            <i className="bi bi-gear-wide-connected me-2"></i> Machine Maint.
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'TOOL' ? 'active' : ''}`}
                            onClick={() => setActiveTab('TOOL')}
                        >
                            <i className="bi bi-tools me-2"></i> Tool Maint.
                        </button>
                    </div>
                </div>

                {/* GRID OF CARDS */}
                <div className="row justify-content-center g-4">
                    {currentReports.map((report, index) => (
                        <div key={report.id} className="col-md-6 col-lg-4 animate-card" style={{animationDelay: `${0.2 + (index * 0.1)}s`}}>
                            
                            <div 
                                className="module-card" 
                                style={{'--card-color': report.color}} 
                                onClick={() => handleCardClick(report.id)}
                            >
                                <div className="icon-wrapper" style={{backgroundColor: report.bgColor, color: report.color}}>
                                    <i className={`bi ${report.icon}`}></i>
                                </div>
                                <h3 className="card-title-custom">{report.title}</h3>
                                
                                {/* Info Tags from PDF Data */}
                                <div className="d-flex flex-column align-items-start mt-3">
                                    <div className="meta-tag">
                                        <i className="bi bi-file-earmark-text text-muted"></i> 
                                        Form: <span style={{color: '#0f172a'}}>{report.formNo}</span>
                                    </div>
                                    <div className="meta-tag">
                                        <i className="bi bi-arrow-repeat text-muted"></i> 
                                        Freq: <span style={{color: '#0f172a'}}>{report.frequency}</span>
                                    </div>
                                    <div className="meta-tag">
                                        <i className="bi bi-person-badge text-muted"></i> 
                                        Resp: <span style={{color: '#0f172a'}}>{report.responsibility}</span>
                                    </div>
                                </div>
                                
                                <i className="bi bi-arrow-right go-arrow"></i>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MaintenanceHub;