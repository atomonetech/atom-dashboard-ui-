import React from 'react';
import { useNavigate } from 'react-router-dom';
import { machineWeeklyReports } from '../data/machineData';

const WeeklyMachineChecklist = () => {
    const navigate = useNavigate();
    
    // Extract the array of 19 machines we defined in the data file
    const weeklyData = machineWeeklyReports.find(report => report.id === 'weekly_pm_checklist');
    const machineList = weeklyData ? weeklyData.machines : [];

    // You can update this later to route to a specific form for the selected machine
    const handleMachineSelect = (machineName) => {
        alert(`🚧 You selected ${machineName}. Routing to the specific checklist form coming soon!`);
    };

    return (
        <div className="maintenance-page-wrapper" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            
            <style>{`
                .dashboard-navbar { position: fixed; top: 0; left: 0; width: 100vw; height: 70px; background-color: #ffffff; border-bottom: 1px solid #e2e8f0; z-index: 1000; display: flex; align-items: center; padding: 0 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
                .brand-logo { font-weight: 900; color: #4f46e5; font-size: 1.4rem; letter-spacing: -0.5px; display: flex; align-items: center; gap: 8px; cursor: pointer; }
                .main-container { padding-top: 100px; padding-bottom: 80px; max-width: 1200px; margin: 0 auto; padding-left: 24px; padding-right: 24px; }
                
                .machine-grid-card {
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 1.5rem;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                }
                .machine-grid-card:hover {
                    transform: translateY(-5px);
                    border-color: #10b981;
                    box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.15);
                }
                .machine-icon {
                    font-size: 2rem;
                    color: #10b981;
                    margin-bottom: 1rem;
                }
                .machine-title {
                    font-weight: 700;
                    color: #0f172a;
                    font-size: 1rem;
                    margin: 0;
                }
            `}</style>

            {/* Navbar */}
            <nav className="dashboard-navbar">
                <div className="brand-logo" onClick={() => navigate('/Maintenance-Hub')}>
                    <i className="bi bi-arrow-left-circle text-muted me-2" style={{fontSize: '1.2rem', transition: '0.2s'}}></i> 
                    <i className="bi bi-wrench-adjustable"></i> Maintenance Hub
                </div>
            </nav>

            {/* Main Content */}
            <div className="main-container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 style={{ fontWeight: 800, color: '#0f172a' }}>Select Machine</h2>
                        <p className="text-muted">Choose a machine to fill out its Weekly Preventive Maintenance Checklist.</p>
                    </div>
                </div>

                {/* Grid of 19 Machines */}
                <div className="row g-3">
                    {machineList.map((machine, index) => (
                        <div key={index} className="col-6 col-md-4 col-lg-3">
                            <div className="machine-grid-card" onClick={() => handleMachineSelect(machine)}>
                                <i className="bi bi-gear-fill machine-icon"></i>
                                <h4 className="machine-title">{machine}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WeeklyMachineChecklist;