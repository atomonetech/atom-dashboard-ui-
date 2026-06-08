import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { weeklyMachineSubReports } from '../data/machineData';

const MachineWeeklyReports = () => {
    const navigate = useNavigate();
    const machineList = weeklyMachineSubReports || [];
    
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const handleCardClick = (machine) => {
        setSelectedCard(machine);
        setShowOptionsModal(true);
    };

    const handleAction = (actionType) => {
        const basePath = "/Maintenance/Machine/weekly";
        const machineId = selectedCard.id.toLowerCase();

        if (actionType === 'fill') {
            if (machineId.includes('cnc')) navigate(`${basePath}/preventive-cnc`);
            else if (machineId.includes('vmc')) navigate(`${basePath}/preventive-vmc`);
            else if (machineId.includes('power_press') || machineId.includes('powerpress')) navigate(`${basePath}/preventive-powerpress`);
            else if (machineId.includes('vmm')) navigate(`${basePath}/vmm`);
            else if (machineId.includes('projection')) navigate(`${basePath}/projection-welding`);
            else if (machineId.includes('tig')) navigate(`${basePath}/tig`);
            else if (machineId.includes('spot')) navigate(`${basePath}/spot-welding`);
            else if (machineId.includes('compressor')) navigate(`${basePath}/compressor`);
            // ✅ New Machines Added Here:
            else if (machineId.includes('lathe')) navigate(`${basePath}/lathe`);
            else if (machineId.includes('drill')) navigate(`${basePath}/drill`);
            else if (machineId.includes('surface')) navigate(`${basePath}/surface-grinder`);
            else if (machineId.includes('belt')) navigate(`${basePath}/belt-grinder`);
            else if (machineId.includes('base')) navigate(`${basePath}/base-grinder`);
            else {
                const slug = selectedCard.id.split('_').pop();
                navigate(`${basePath}/preventive-${slug}`);
            }
        } else if (actionType === 'view') {
            navigate(`/maintenance-view/${selectedCard.id}`);
        } else if (actionType === 'print') {
            if (machineId.includes('cnc')) navigate(`${basePath}/preventive-cnc/print`);
            else if (machineId.includes('vmc')) navigate(`${basePath}/preventive-vmc/print`);
            else if (machineId.includes('power_press') || machineId.includes('powerpress')) navigate(`${basePath}/preventive-powerpress/print`);
            else if (machineId.includes('vmm')) navigate(`${basePath}/vmm/print`);
            else if (machineId.includes('projection')) navigate(`${basePath}/projection-welding/print`);
            else if (machineId.includes('tig')) navigate(`${basePath}/tig/print`);
            else if (machineId.includes('spot')) navigate(`${basePath}/spot-welding/print`);
            else if (machineId.includes('compressor')) navigate(`${basePath}/compressor/print`);
            // ✅ New Machines Print Routes Added Here:
            else if (machineId.includes('lathe')) navigate(`${basePath}/lathe/print`);
            else if (machineId.includes('drill')) navigate(`${basePath}/drill/print`);
            else if (machineId.includes('surface')) navigate(`${basePath}/surface-grinder/print`);
            else if (machineId.includes('belt')) navigate(`${basePath}/belt-grinder/print`);
            else if (machineId.includes('base')) navigate(`${basePath}/base-grinder/print`);
            else {
                const slug = selectedCard.id.split('_').pop();
                navigate(`${basePath}/preventive-${slug}/print`);
            }
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
                .maintenance-page-wrapper { min-height: 100vh; background-color: #f4f7fa; font-family: 'Plus Jakarta Sans', sans-serif; }
                
                .hub-simple-navbar { position: fixed; top: 0; width: 100%; height: 70px; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); display: flex; align-items: center; padding: 0 40px; border-bottom: 1px solid rgba(231, 234, 243, 0.7); z-index: 10000; }
                
                /* ✅ Nav and Back Button Styles */
                .nav-left-group { display: flex; align-items: center; gap: 15px; }
                .nav-back-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 50%; transition: all 0.2s ease; color: #64748b; font-size: 1.2rem; }
                .nav-back-btn:hover { background: #f1f5f9; color: #0f172a; transform: translateX(-2px); }
                .nav-text-brand { font-weight: 800; color: #1e293b; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: 0.3s; }
                .nav-text-brand:hover { color: #4f46e5; }
                
                .main-content-area { padding: 120px 20px 80px; max-width: 1200px; margin: 0 auto; }

                .page-header { margin-bottom: 60px; }
                .page-header h1 { font-weight: 900; color: #0f172a; font-size: 3rem; letter-spacing: -1.5px; margin-bottom: 10px; }
                .page-header p { color: #64748b; font-size: 1.1rem; font-weight: 500; }

                /* Premium Card Design */
                .premium-card { 
                    background: #ffffff; border-radius: 30px; padding: 40px 30px; border: 1px solid #ffffff; 
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer; height: 100%; 
                    position: relative; display: flex; flex-direction: column; box-shadow: 0 10px 30px -12px rgba(0,0,0,0.05);
                }
                .premium-card:hover { transform: translateY(-12px); box-shadow: 0 30px 60px -12px rgba(0,0,0,0.12); background: #ffffff; }
                
                .card-accent { position: absolute; top: 0; left: 30px; right: 30px; height: 6px; border-radius: 0 0 10px 10px; transition: 0.3s; }
                .premium-card:hover .card-accent { left: 0; right: 0; border-radius: 30px 30px 0 0; }
                
                .icon-circle { width: 65px; height: 65px; border-radius: 22px; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; margin-bottom: 30px; transition: 0.5s; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05); }
                .premium-card:hover .icon-circle { transform: rotateY(180deg); }

                .machine-title { font-weight: 850; color: #1e293b; font-size: 1.5rem; margin-bottom: 25px; letter-spacing: -0.5px; padding-right: 120px; }
                
                .status-pill { display: flex; align-items: center; gap: 10px; background: #f1f5f9; padding: 10px 18px; border-radius: 15px; font-size: 0.85rem; color: #475569; font-weight: 700; width: fit-content; margin-bottom: 12px; transition: 0.3s; }
                .premium-card:hover .status-pill { background: #f8fafc; transform: translateX(5px); }
                .status-pill b { color: #0f172a; }
                
                .arrow-circle { margin-top: auto; width: 45px; height: 45px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; align-self: flex-end; transition: 0.3s; color: #64748b; }
                .premium-card:hover .arrow-circle { background: #4f46e5; color: white; transform: scale(1.1); }

                /* ✅ Live / Under Development Badges */
                .status-badge {
                    position: absolute; top: 20px; right: 20px;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-size: 0.65rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    display: flex; align-items: center; gap: 6px;
                }
                .status-live { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
                .status-dev  { background: #f8fafc; color: #475569; border: 1px solid #cbd5e1; }

                /* Icon Animations */
                .pulse-icon { animation: pulseAnim 2s infinite; font-size: 0.8rem; }
                @keyframes pulseAnim { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
                .spin-icon { animation: spinAnim 4s linear infinite; font-size: 0.8rem; }
                @keyframes spinAnim { 100% { transform: rotate(360deg); } }

                /* Modal Unified Styles */
                .modal-overlay-ui { position: fixed; inset: 0; background: rgba(15,23,42,0.6); display: flex; align-items: center; justify-content: center; z-index: 100000; backdrop-filter: blur(4px); animation: fadeIn 0.15s ease; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .modal-action-btn { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 8px; border: 1.5px solid #e2e8f0; background: #fff; cursor: pointer; text-align: left; width: 100%; transition: all 0.2s; margin-bottom: 10px; font-family: 'Inter', sans-serif; }
                .modal-action-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.09); border-color: #cbd5e1; }
                .modal-action-btn:last-child { margin-bottom: 0; }
                .modal-btn-icon { width: 42px; height: 42px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
            `}</style>

            <nav className="hub-simple-navbar">
                <div className="nav-left-group">
                    {/* ✅ New Back Button Added Here */}
                    <button className="nav-back-btn" onClick={() => navigate('/Maintenance/Machine')} title="Go Back">
                        <i className="bi bi-arrow-left"></i>
                    </button>
                    
                    <div className="nav-text-brand" onClick={() => navigate('/Maintenance/Machine')}>
                        <i className="bi bi-shield-check-fill text-primary"></i> 
                        <span>Maintenance Master</span>
                    </div>
                </div>
            </nav>

            <div className="main-content-area">
                <header className="page-header text-center">
                    <h1>Select Machine</h1>
                    <p>High-precision weekly preventive maintenance logs.</p>
                </header>

                <div className="row g-4">
                    {machineList.map((machine) => (
                        <div key={machine.id} className="col-12 col-md-6 col-lg-4">
                            <div className="premium-card" onClick={() => handleCardClick(machine)}>
                                <div className="card-accent" style={{backgroundColor: machine.color}}></div>
                                
                                {/* ✅ Live / Dev Badge */}
                                <div className={`status-badge ${machine.isLive ? 'status-live' : 'status-dev'}`}>
                                    {machine.isLive ? (
                                        <><i className="bi bi-broadcast pulse-icon"></i> Live</>
                                    ) : (
                                        <><i className="bi bi-gear-wide-connected spin-icon"></i> Under Development</>
                                    )}
                                </div>

                                <div className="icon-circle" style={{backgroundColor: `${machine.color}15`, color: machine.color}}>
                                    <i className={`bi ${machine.icon}`}></i>
                                </div>
                                
                                <h4 className="machine-title">
                                    {machine.title.replace(' Weekly Maint.', '')}
                                </h4>

                                <div className="status-pill">
                                    <i className="bi bi-file-earmark-code"></i>
                                    <span>Form: <b>{machine.formNo}</b></span>
                                </div>
                                <div className="status-pill">
                                    <i className="bi bi-lightning-charge"></i>
                                    <span>Frequency: <b>Weekly</b></span>
                                </div>
                                
                                <div className="arrow-circle">
                                    <i className="bi bi-arrow-right-short fs-4"></i>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Unified Modal */}
            {showOptionsModal && selectedCard && (
                <div className="modal-overlay-ui" onClick={closeModal}>
                    <div style={{background:'#fff', borderRadius:'12px', padding:'2rem', width:'100%', maxWidth:'400px', position:'relative', animation: 'slideUp 0.2s ease'}} onClick={(e) => e.stopPropagation()}>
                        
                        <button style={{position:'absolute', top:'14px', right:'16px', background:'#f1f5f9', border:'none', borderRadius:'4px', width:'32px', height:'32px', cursor:'pointer'}} onClick={closeModal}>
                            <i className="bi bi-x-lg text-muted"></i>
                        </button>

                        <div style={{display:'flex', alignItems:'center', gap:14, marginBottom:16}}>
                            <div style={{width:46, height:46, borderRadius:8, background:`${selectedCard.color}15`, color:selectedCard.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem'}}>
                                <i className={`bi ${selectedCard.icon}`}></i>
                            </div>
                            <div style={{textAlign: 'left'}}>
                                <p style={{fontWeight:800, fontSize:'0.95rem', margin:0, color:'#0f172a'}}>{selectedCard.title}</p>
                                <p style={{fontSize:'0.75rem', color:'#64748b', margin:0}}>Form: {selectedCard.formNo || "N/A"}</p>
                            </div>
                        </div>

                        <div style={{borderTop:'1px solid #f1f5f9', margin:'16px 0'}}></div>
                        <p style={{fontSize:'0.78rem', color:'#94a3b8', fontWeight:600, marginBottom:14, textTransform:'uppercase', letterSpacing:'0.06em', textAlign: 'left'}}>What would you like to do?</p>

                        <button className="modal-action-btn" onClick={() => handleAction('fill')}>
                            <div className="modal-btn-icon" style={{background:'#f1f5f9', color:'#0f172a'}}>
                                <i className="bi bi-pencil-square"></i>
                            </div>
                            <div>
                                <p style={{fontWeight:700, fontSize:'0.9rem', margin:0, color:'#0f172a'}}>Fill Data</p>
                                <p style={{fontSize:'0.75rem', color:'#64748b', margin:0}}>Enter new data into the form</p>
                            </div>
                            <i className="bi bi-chevron-right ms-auto text-muted"></i>
                        </button>

                        <button className="modal-action-btn" onClick={() => handleAction('view')}>
                            <div className="modal-btn-icon" style={{background:'#f1f5f9', color:'#0f172a'}}>
                                <i className="bi bi-eye"></i>
                            </div>
                            <div>
                                <p style={{fontWeight:700, fontSize:'0.9rem', margin:0, color:'#0f172a'}}>View Data</p>
                                <p style={{fontSize:'0.75rem', color:'#64748b', margin:0}}>View saved records from the database</p>
                            </div>
                            <i className="bi bi-chevron-right ms-auto text-muted"></i>
                        </button>

                        <button className="modal-action-btn" onClick={() => handleAction('print')}>
                            <div className="modal-btn-icon" style={{background:'#f1f5f9', color:'#0f172a'}}>
                                <i className="bi bi-printer"></i>
                            </div>
                            <div>
                                <p style={{fontWeight:700, fontSize:'0.9rem', margin:0, color:'#0f172a'}}>Print Data</p>
                                <p style={{fontSize:'0.75rem', color:'#64748b', margin:0}}>Print saved records</p>
                            </div>
                            <i className="bi bi-chevron-right ms-auto text-muted"></i>
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
};

export default MachineWeeklyReports;