import React from 'react';
import { useNavigate } from 'react-router-dom';
import { weeklyMachineSubReports } from '../data/machineData';

const MachineWeeklyReports = () => {
    const navigate = useNavigate();
    const machineList = weeklyMachineSubReports || [];

   const handleMachineSelect = (machine) => {
    const basePath = "/Maintenance/Machine";
    const machineId = machine.id.toLowerCase(); // Full ID check karenge

    // 1. CNC Check
    if (machineId.includes('cnc')) {
        navigate("/Weekly-CNC-Form");
    } 
    // 2. VMC Check
    else if (machineId.includes('vmc')) {
        navigate("/Weekly-VMC-Form");
    } 
    // 3. Power Press Check (Safe logic)
    else if (machineId.includes('power_press') || machineId.includes('powerpress') || machineId.includes('press')) {
        navigate("/Weekly-Power-Press-Form");
    } 
    // 4. Baki sab ke liye Dynamic Routing
    else {
        const slug = machine.id.split('_').pop();
        navigate(`${basePath}/preventive-${slug}`);
    }
};

    return (
        <div className="maintenance-page-wrapper">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            
            <style>{`
                .maintenance-page-wrapper { min-height: 100vh; background-color: #f4f7fa; font-family: 'Plus Jakarta Sans', sans-serif; }
                
                .hub-simple-navbar { position: fixed; top: 0; width: 100%; height: 70px; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); display: flex; align-items: center; padding: 0 40px; border-bottom: 1px solid rgba(231, 234, 243, 0.7); z-index: 10000; }
                .nav-text-brand { font-weight: 800; color: #1e293b; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: 0.3s; }
                .nav-text-brand:hover { color: #4f46e5; }
                
                .main-content-area { padding: 120px 20px 80px; max-width: 1200px; margin: 0 auto; }

                .page-header { margin-bottom: 60px; }
                .page-header h1 { font-weight: 900; color: #0f172a; font-size: 3rem; letter-spacing: -1.5px; margin-bottom: 10px; }
                .page-header p { color: #64748b; font-size: 1.1rem; font-weight: 500; }

                /* 🔥 Eyecatching Card Design */
                .premium-card { 
                    background: #ffffff; 
                    border-radius: 30px; 
                    padding: 40px 30px; 
                    border: 1px solid #ffffff; 
                    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); 
                    cursor: pointer; 
                    height: 100%; 
                    position: relative; 
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 10px 30px -12px rgba(0,0,0,0.05);
                }
                
                .premium-card:hover { 
                    transform: translateY(-12px); 
                    box-shadow: 0 30px 60px -12px rgba(0,0,0,0.12); 
                    background: #ffffff;
                }
                
                /* Animated Accent Line */
                .card-accent { 
                    position: absolute; top: 0; left: 30px; right: 30px; height: 6px; 
                    border-radius: 0 0 10px 10px; 
                    transition: 0.3s;
                }
                .premium-card:hover .card-accent { left: 0; right: 0; border-radius: 30px 30px 0 0; }
                
                .icon-circle { 
                    width: 65px; 
                    height: 65px; 
                    border-radius: 22px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-size: 1.8rem; 
                    margin-bottom: 30px; 
                    transition: 0.5s;
                    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);
                }
                
                .premium-card:hover .icon-circle { 
                    transform: rotateY(180deg); 
                }

                .machine-title { font-weight: 850; color: #1e293b; font-size: 1.5rem; margin-bottom: 25px; letter-spacing: -0.5px; }
                
                .status-pill { 
                    display: flex; 
                    align-items: center; 
                    gap: 10px; 
                    background: #f1f5f9; 
                    padding: 10px 18px; 
                    border-radius: 15px; 
                    font-size: 0.85rem; 
                    color: #475569; 
                    font-weight: 700; 
                    width: fit-content; 
                    margin-bottom: 12px;
                    transition: 0.3s;
                }

                .premium-card:hover .status-pill { background: #f8fafc; transform: translateX(5px); }
                .status-pill b { color: #0f172a; }
                
                .arrow-circle { 
                    margin-top: auto;
                    width: 45px;
                    height: 45px;
                    border-radius: 50%;
                    background: #f1f5f9;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    align-self: flex-end;
                    transition: 0.3s;
                    color: #64748b;
                }

                .premium-card:hover .arrow-circle { 
                    background: #4f46e5; 
                    color: white; 
                    transform: scale(1.1);
                }
            `}</style>

            <nav className="hub-simple-navbar">
                <div className="nav-text-brand" onClick={() => navigate('/Maintenance/Machine')}>
                    <i className="bi bi-shield-check-fill text-primary"></i> 
                    <span>Maintenance Master</span>
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
                            <div className="premium-card" onClick={() => handleMachineSelect(machine)}>
                                <div className="card-accent" style={{backgroundColor: machine.color}}></div>
                                
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
        </div>
    );
};

export default MachineWeeklyReports;