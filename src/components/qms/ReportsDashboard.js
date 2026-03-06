// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const ReportsDashboard = () => {
//     const navigate = useNavigate();

//     const reportModules = [
//         {
//             id: 'raw_material',
//             title: 'Raw Material Report',
//             description: 'Log inspection data for incoming raw materials and components.',
//             icon: 'bi-box-seam',
//             color: '#f59e0b', 
//             bgColor: '#fef3c7',
//             delay: '0.1s'
//         },
//         {
//             id: 'patrolling',
//             title: 'Patrolling Inspection',
//             description: 'Record in-process quality checks and 4-hourly floor monitoring.',
//             icon: 'bi-clipboard-check',
//             color: '#4f46e5', 
//             bgColor: '#e0e7ff',
//             delay: '0.2s'
//         },
//         {
//             id: 'layout',
//             title: 'Layout Report',
//             description: 'Detailed dimensional layout and first-piece approval records.',
//             icon: 'bi-bounding-box-circles',
//             color: '#06b6d4', 
//             bgColor: '#cffafe',
//             delay: '0.3s'
//         },
//         {
//             id: 'pdi',
//             title: 'PDI Report',
//             description: 'Pre-Dispatch Inspection to ensure quality before final shipping.',
//             icon: 'bi-truck',
//             color: '#10b981', 
//             bgColor: '#d1fae5',
//             delay: '0.4s'
//         },
//         {
//             id: 'dispatch',
//             title: 'Dispatch Report',
//             description: 'Log and verify final outgoing shipments and logistics tracking.',
//             icon: 'bi-send-check',
//             color: '#8b5cf6', 
//             bgColor: '#ede9fe',
//             delay: '0.5s'
//         },
//         {
//             id: 'procedure',
//             title: 'SOP & Procedures',
//             description: 'View standard operating procedures, manuals, and guidelines.',
//             icon: 'bi-journal-text',
//             color: '#ec4899', 
//             bgColor: '#fce7f3',
//             delay: '0.6s'
//         }
//     ];

 
//     const handleCardClick = (reportId, reportTitle) => {
//         if (reportId === 'patrolling') {
//             navigate('/qms/inspection-form'); 
//         } 
//         else if (reportId === 'raw_material') {
//             navigate('/qms/raw-material-form');
//         }
//         else if (reportId === 'procedure') {
//             navigate('/qms'); 
//         } 
//         else {
//             alert(`Construction in Progress 🚧\nThe [${reportTitle}] module is coming soon!`);
//         }
//     };

//     return (
//         <div className="reports-page-wrapper">
//             <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
//             <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            
//             <style>{`
//                 .reports-page-wrapper {
//                     position: fixed !important;
//                     top: 0 !important;
//                     left: 0 !important;
//                     width: 100vw !important;
//                     height: 100vh !important;
//                     background-color: #f8fafc !important; 
//                     z-index: 9999 !important;
//                     overflow-y: auto !important;
//                     overflow-x: hidden !important;
//                     margin: 0 !important;
//                     padding: 0 !important;
//                     font-family: 'Inter', 'Segoe UI', sans-serif !important;
//                 }
                
//                 .dashboard-navbar { 
//                     position: sticky !important; 
//                     top: 0 !important; 
//                     left: 0 !important;
//                     width: 100% !important; 
//                     height: 70px !important; 
//                     background-color: #ffffff !important; 
//                     border-bottom: 1px solid #e2e8f0 !important; 
//                     z-index: 10000 !important; 
//                     display: flex !important;
//                     align-items: center !important;
//                     justify-content: space-between !important; 
//                     padding: 0 2rem !important;
//                     box-sizing: border-box !important;
//                     box-shadow: 0 2px 10px rgba(0,0,0,0.05) !important;
//                     margin: 0 !important;
//                 }
                
//                 @keyframes scaleUpFade { 
//                     0% { opacity: 0; transform: translateY(30px) scale(0.95); } 
//                     100% { opacity: 1; transform: translateY(0) scale(1); } 
//                 }
//                 .animate-card { opacity: 0; animation: scaleUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                
//                 .main-container { 
//                     padding: 60px 24px 80px 24px !important; 
//                     max-width: 1200px !important; 
//                     margin: 0 auto !important; 
//                     box-sizing: border-box !important;
//                 }
                
//                 .dashboard-header { text-align: center; margin-bottom: 3.5rem; }
//                 .dashboard-title { font-weight: 900 !important; color: #0f172a !important; font-size: 2.8rem !important; letter-spacing: -1px !important; margin-bottom: 0.5rem !important;}
//                 .dashboard-subtitle { color: #64748b !important; font-size: 1.1rem !important; font-weight: 500 !important;}

//                 .module-card { 
//                     background: #ffffff !important; 
//                     border: 1px solid #e2e8f0 !important; 
//                     border-radius: 16px !important; 
//                     padding: 2.5rem 2rem !important; 
//                     cursor: pointer !important; 
//                     transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; 
//                     height: 100% !important;
//                     position: relative !important;
//                     overflow: hidden !important;
//                     box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;
//                 }

//                 .module-card:hover { 
//                     transform: translateY(-8px) !important; 
//                     box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important; 
//                     border-color: transparent !important;
//                 }
                
//                 .module-card::before {
//                     content: ''; position: absolute; top: 0; left: 0; right: 0; height: 5px; 
//                     background: var(--card-color); 
//                     opacity: 0.8; transition: 0.3s;
//                 }
//                 .module-card:hover::before { opacity: 1; height: 6px; }

//                 .icon-wrapper {
//                     width: 70px; height: 70px; 
//                     border-radius: 16px; 
//                     display: flex; align-items: center; justify-content: center; 
//                     font-size: 2rem; margin-bottom: 1.5rem;
//                     transition: 0.3s;
//                 }
//                 .module-card:hover .icon-wrapper { transform: scale(1.1) rotate(5deg); }

//                 .card-title-custom { font-weight: 800 !important; font-size: 1.3rem !important; color: #0f172a !important; margin-bottom: 0.8rem !important; }
//                 .card-desc-custom { font-size: 0.95rem !important; color: #64748b !important; line-height: 1.5 !important; margin: 0 !important; font-weight: 500 !important;}

//                 .go-arrow { 
//                     position: absolute; bottom: 2rem; right: 2rem; 
//                     font-size: 1.5rem; color: #e2e8f0; 
//                     transition: 0.3s; opacity: 0; transform: translateX(-10px);
//                 }
//                 .module-card:hover .go-arrow { color: var(--card-color); opacity: 1; transform: translateX(0); }

//                 @media (max-width: 768px) {
//                     .dashboard-navbar { padding: 0 1rem !important; }
//                     .main-container { padding: 40px 16px 60px 16px !important; }
//                     .dashboard-title { font-size: 2rem !important; }
//                     .module-card { padding: 1.5rem !important; }
//                 }
//             `}</style>

//             <nav className="dashboard-navbar">
//                 <div></div>
                
//                 <div>
//                     <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill" style={{backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0'}}>
//                         <span style={{width: '8px', height: '8px', backgroundColor: '#10B981', borderRadius: '50%', display: 'inline-block'}}></span>
//                         <span style={{fontSize: '0.75rem', fontWeight: '800', color: '#059669', letterSpacing: '0.5px', margin: 0}}>SYSTEM ONLINE</span>
//                     </div>
//                 </div>
//             </nav>

//             <div className="main-container">
//                 <div className="dashboard-header animate-card" style={{animationDelay: '0s'}}>
//                     <h1 className="dashboard-title">Quality Assurance Hub</h1>
//                     <p className="dashboard-subtitle">Select a module to initiate or review inspection reports.</p>
//                 </div>

//                 <div className="row justify-content-center g-4">
//                     {reportModules.map((module) => (
//                         <div key={module.id} className="col-md-6 col-lg-4 animate-card" style={{animationDelay: module.delay}}>
                            
//                             <div 
//                                 className="module-card" 
//                                 style={{'--card-color': module.color}} 
//                                 onClick={() => handleCardClick(module.id, module.title)}
//                             >
//                                 <div className="icon-wrapper" style={{backgroundColor: module.bgColor, color: module.color}}>
//                                     <i className={`bi ${module.icon}`}></i>
//                                 </div>
//                                 <h3 className="card-title-custom">{module.title}</h3>
//                                 <p className="card-desc-custom">{module.description}</p>
                                
//                                 <i className="bi bi-arrow-right go-arrow"></i>
//                             </div>

//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ReportsDashboard;    



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
        if (reportId === 'patrolling') {
            navigate('/qms/inspection-form'); 
        } 
        else if (reportId === 'raw_material') {
            navigate('/qms/raw-material-form'); // Raw Material Link
        }
        else if (reportId === 'pdi') {
            navigate('/qms/pdi-report-form'); // PDI Link (Naya Add Kiya!)
        }
        else if (reportId === 'procedure') {
            navigate('/qms'); 
        } 
        else {
            alert(`Construction in Progress 🚧\nThe [${reportTitle}] module is coming soon!`);
        }
    };

    return (
        <div className="reports-page-wrapper">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            
            <style>{`
                /* 🔥 BULLETPROOF FULL-SCREEN WRAPPER 🔥 */
                .reports-page-wrapper {
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    min-height: 100vh !important;
                    background-color: #f8fafc !important; /* Forces Light Background */
                    z-index: 9999 !important;
                    overflow-x: hidden !important;
                    font-family: 'Inter', 'Segoe UI', sans-serif !important;
                }
                
                /* 🔥 PERFECTLY FIXED NAVBAR 🔥 */
                .dashboard-navbar { 
                    position: fixed !important; 
                    top: 0 !important; 
                    left: 0 !important;
                    width: 100% !important; 
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
                
                .brand-logo { font-weight: 900 !important; color: #4f46e5 !important; font-size: 1.4rem !important; letter-spacing: -0.5px !important; display: flex !important; align-items: center !important; gap: 8px !important; }
                
                @keyframes scaleUpFade { 
                    0% { opacity: 0; transform: translateY(30px) scale(0.95); } 
                    100% { opacity: 1; transform: translateY(0) scale(1); } 
                }
                .animate-card { opacity: 0; animation: scaleUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                
                /* Margin top fixed to push content below the navbar */
                .main-container { 
                    padding-top: 120px !important; 
                    padding-bottom: 80px !important;
                    padding-left: 24px !important;
                    padding-right: 24px !important;
                    max-width: 1200px !important; 
                    margin: 0 auto !important; 
                    box-sizing: border-box !important;
                }
                
                .dashboard-header { text-align: center; margin-bottom: 3.5rem; }
                .dashboard-title { font-weight: 900 !important; color: #0f172a !important; font-size: 2.8rem !important; letter-spacing: -1px !important; margin-bottom: 0.5rem !important;}
                .dashboard-subtitle { color: #64748b !important; font-size: 1.1rem !important; font-weight: 500 !important;}

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
                    border-color: transparent !important;
                }
                
                .module-card::before {
                    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 5px; 
                    background: var(--card-color); 
                    opacity: 0.8; transition: 0.3s;
                }
                .module-card:hover::before { opacity: 1; height: 6px; }

                .icon-wrapper {
                    width: 70px; height: 70px; 
                    border-radius: 16px; 
                    display: flex; align-items: center; justify-content: center; 
                    font-size: 2rem; margin-bottom: 1.5rem;
                    transition: 0.3s;
                }
                .module-card:hover .icon-wrapper { transform: scale(1.1) rotate(5deg); }

                .card-title-custom { font-weight: 800 !important; font-size: 1.3rem !important; color: #0f172a !important; margin-bottom: 0.8rem !important; }
                .card-desc-custom { font-size: 0.95rem !important; color: #64748b !important; line-height: 1.5 !important; margin: 0 !important; font-weight: 500 !important;}

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
                }
            `}</style>

            {/* FULL WIDTH STICKY NAVBAR */}
            <nav className="dashboard-navbar">
                <div className="brand-logo">
                    <i className="bi bi-box-seam-fill"></i> QMS Suite
                </div>
                
                <div>
                    <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill" style={{backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0'}}>
                        <span style={{width: '8px', height: '8px', backgroundColor: '#10B981', borderRadius: '50%', display: 'inline-block'}}></span>
                        <span style={{fontSize: '0.75rem', fontWeight: '800', color: '#059669', letterSpacing: '0.5px', margin: 0}}>SYSTEM ONLINE</span>
                    </div>
                </div>
            </nav>

            {/* MAIN CONTENT */}
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
                                
                                <i className="bi bi-arrow-right go-arrow"></i>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportsDashboard;