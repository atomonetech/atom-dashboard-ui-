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

        const getRoute = () => {
            if (machineId.includes('cnc')) return 'preventive-cnc';
            if (machineId.includes('vmc')) return 'preventive-vmc';
            if (machineId.includes('power_press') || machineId.includes('powerpress')) return 'preventive-powerpress';
            if (machineId.includes('vmm')) return 'vmm';
            if (machineId.includes('projection')) return 'projection-welding';
            if (machineId.includes('tig')) return 'tig';
            if (machineId.includes('spot')) return 'spot-welding';
            if (machineId.includes('compressor')) return 'compressor';
            if (machineId.includes('lathe')) return 'lathe';
            if (machineId.includes('drill')) return 'drill';
            if (machineId.includes('surface')) return 'surface-grinder';
            if (machineId.includes('belt')) return 'belt-grinder';
            if (machineId.includes('base')) return 'base-grinder';
            return `preventive-${selectedCard.id.split('_').pop()}`;
        };

        if (actionType === 'fill') navigate(`${basePath}/${getRoute()}`);
        else if (actionType === 'view') navigate(`/maintenance-view/${selectedCard.id}`);
        else if (actionType === 'print') navigate(`${basePath}/${getRoute()}/print`);

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
                .maintenance-page-wrapper {
                    min-height: 100vh;
                    background: #0f172a;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    color: #f8fafc;
                }

                .maintenance-page-wrapper .text-muted {
                    color: #94a3b8 !important;
                }

                .hub-simple-navbar {
                    position: sticky;
                    top: 0;
                    min-height: 100px;
                    background: #0f172a;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 2rem;
                    box-shadow: 0 1px 0 #263750;
                    z-index: 1000;
                }

                .nav-left-group {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    z-index: 2;
                }

                .nav-back-btn {
                    background: transparent;
                    border: none;
                    color: #22d3ee;
                    font-size: 1.4rem;
                    cursor: pointer;
                    padding: 0;
                }

                .nav-text-brand {
                    font-weight: 800;
                    color: #22d3ee;
                    font-size: 1.25rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                }

                .nav-text-brand:hover,
                .nav-back-btn:hover {
                    color: #67e8f9;
                }

                .main-content-area {
                    padding: 50px 24px 80px;
                    max-width: 1700px;
                    margin: 0 auto;
                }

                .page-header h1 {
                    color: #22d3ee;
                }

                .premium-card {
                    background: #182338;
                    border: 1px solid #263750;
                    border-radius: 24px;
                    padding: 32px 26px;
                    cursor: pointer;
                    height: 100%;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    transition: 0.3s;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.18);
                }

                .premium-card:hover {
                    transform: translateY(-8px);
                    border-color: #22d3ee;
                    box-shadow: 0 18px 36px rgba(34,211,238,0.10);
                }

                .card-accent {
                    position: absolute;
                    top: 0;
                    left: 26px;
                    right: 26px;
                    height: 5px;
                    border-radius: 0 0 10px 10px;
                    transition: 0.3s;
                }

                .premium-card:hover .card-accent {
                    left: 0;
                    right: 0;
                    border-radius: 24px 24px 0 0;
                }

                .icon-circle {
                    width: 60px;
                    height: 60px;
                    border-radius: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.7rem;
                    margin-bottom: 26px;
                    background: #10293a !important;
                }

                .machine-title {
                    font-weight: 800;
                    color: #f8fafc;
                    font-size: 1.35rem;
                    margin-bottom: 24px;
                    padding-right: 110px;
                }

                .status-pill {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: #202d43;
                    border: 1px solid #263750;
                    padding: 9px 14px;
                    border-radius: 10px;
                    font-size: 0.82rem;
                    color: #94a3b8;
                    font-weight: 700;
                    width: fit-content;
                    margin-bottom: 10px;
                }

                .status-pill b {
                    color: #f8fafc;
                }

                .arrow-circle {
                    margin-top: auto;
                    width: 42px;
                    height: 42px;
                    border-radius: 50%;
                    background: #202d43;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    align-self: flex-end;
                    color: #22d3ee;
                    transition: 0.3s;
                }

                .premium-card:hover .arrow-circle {
                    background: #0891b2;
                    color: #fff;
                    transform: scale(1.08);
                }

                .status-badge {
                    position: absolute;
                    top: 20px;
                    right: 20px;
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

                .status-live {
                    background: #0f2f25;
                    color: #4ade80;
                    border: 1px solid #166534;
                }

                .status-dev {
                    background: #202d43;
                    color: #94a3b8;
                    border: 1px solid #3b4b63;
                }

                .pulse-icon {
                    animation: pulseAnim 2s infinite;
                }

                @keyframes pulseAnim {
                    0%,100% { opacity: 1; transform: scale(1); }
                    50% { opacity: .5; transform: scale(.8); }
                }

                .spin-icon {
                    animation: spinAnim 4s linear infinite;
                }

                @keyframes spinAnim {
                    100% { transform: rotate(360deg); }
                }

                .modal-overlay-ui {
                    position: fixed;
                    inset: 0;
                    background: rgba(2,6,23,.78);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 100000;
                    backdrop-filter: blur(4px);
                }

                .modal-box {
                    background: #182338;
                    border: 1px solid #263750;
                    border-radius: 12px;
                    padding: 2rem;
                    width: 100%;
                    max-width: 400px;
                    position: relative;
                }

                .modal-close-btn {
                    position: absolute;
                    top: 14px;
                    right: 16px;
                    width: 32px;
                    height: 32px;
                    background: #202d43;
                    color: #94a3b8;
                    border: 1px solid #263750;
                    border-radius: 4px;
                    cursor: pointer;
                }

                .modal-action-btn {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 14px 16px;
                    border-radius: 8px;
                    border: 1px solid #263750;
                    background: #111c2f;
                    color: #f8fafc;
                    cursor: pointer;
                    text-align: left;
                    width: 100%;
                    transition: .2s;
                    margin-bottom: 10px;
                }

                .modal-action-btn:hover {
                    transform: translateY(-2px);
                    border-color: #22d3ee;
                    background: #16243a;
                }

                .modal-btn-icon {
                    width: 42px;
                    height: 42px;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    flex-shrink: 0;
                    background: #202d43;
                    color: #22d3ee;
                }

                @media (max-width: 768px) {
                    .main-content-area { padding: 30px 16px 60px; }
                    .machine-title { padding-right: 80px; }
                }
            `}</style>

            <nav className="hub-simple-navbar">
                <div className="nav-left-group">
                    <button className="nav-back-btn" onClick={() => navigate('/Maintenance/Machine')} title="Go Back">
                        <i className="bi bi-arrow-left-circle"></i>
                    </button>

                    <div className="nav-text-brand" onClick={() => navigate('/Maintenance/Machine')}>
                        <i className="bi bi-shield-check-fill"></i>
                        <span>Back To Maintenance</span>
                    </div>
                </div>

                <header className="page-header text-center" style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 'max-content',
                    pointerEvents: 'none',
                    margin: 10
                }}>
                    <h1 style={{ fontWeight: 900, fontSize: 'clamp(1.2rem,3vw,2rem)', margin: '0 0 2px' }}>
                        Select Machine
                    </h1>
                    <p className="text-muted" style={{ margin: 0, fontSize: '0.8rem' }}>
                        High-precision weekly preventive maintenance logs.
                    </p>
                </header>
            </nav>

            <div className="main-content-area">
                <div className="row g-4">
                    {machineList.map((machine) => (
                        <div key={machine.id} className="col-12 col-md-6 col-lg-3">
                            <div className="premium-card" onClick={() => handleCardClick(machine)}>
                                <div className="card-accent" style={{ backgroundColor: machine.color }} />

                                <div className={`status-badge ${machine.isLive ? 'status-live' : 'status-dev'}`}>
                                    {machine.isLive
                                        ? <><i className="bi bi-broadcast pulse-icon"></i> Live</>
                                        : <><i className="bi bi-gear-wide-connected spin-icon"></i> Under Development</>
                                    }
                                </div>

                                <div className="icon-circle" style={{ color: machine.color }}>
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

            {showOptionsModal && selectedCard && (
                <div className="modal-overlay-ui" onClick={closeModal}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={closeModal}>
                            <i className="bi bi-x-lg"></i>
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                            <div style={{
                                width: 46, height: 46, borderRadius: 8,
                                background: '#10293a', color: selectedCard.color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.4rem'
                            }}>
                                <i className={`bi ${selectedCard.icon}`}></i>
                            </div>

                            <div>
                                <p style={{ fontWeight: 800, fontSize: '0.95rem', margin: 0, color: '#f8fafc' }}>
                                    {selectedCard.title}
                                </p>
                                <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                                    Form: {selectedCard.formNo || "N/A"}
                                </p>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #263750', margin: '16px 0' }} />

                        <p style={{
                            fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600,
                            marginBottom: 14, textTransform: 'uppercase',
                            letterSpacing: '0.06em'
                        }}>
                            What would you like to do?
                        </p>

                        {[
                            ['fill', 'bi-pencil-square', 'Fill Data', 'Enter new data into the form'],
                            ['view', 'bi-eye', 'View Data', 'View saved records from the database'],
                            ['print', 'bi-printer', 'Print Data', 'Print saved records']
                        ].map(([action, icon, title, desc]) => (
                            <button key={action} className="modal-action-btn" onClick={() => handleAction(action)}>
                                <div className="modal-btn-icon">
                                    <i className={`bi ${icon}`}></i>
                                </div>

                                <div>
                                    <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: 0, color: '#f8fafc' }}>
                                        {title}
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                                        {desc}
                                    </p>
                                </div>

                                <i className="bi bi-chevron-right ms-auto text-muted"></i>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MachineWeeklyReports;