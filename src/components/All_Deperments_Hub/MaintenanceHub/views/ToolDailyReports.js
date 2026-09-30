import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toolReports as toolDailyReports } from '../data/ToolMachineData';

const ToolDailyReports = () => {
    const navigate = useNavigate();
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const routes = {
        tool_history: 'history-form',
        tool_pm_check: 'pm-checklist',
        tool_breakdown_slip: 'breakdown-form',
        tool_stroke: 'stroke-record'
    };

    const handleCardClick = (report) => {
        setSelectedCard(report);
        setShowOptionsModal(true);
    };

    const closeModal = () => {
        setShowOptionsModal(false);
        setSelectedCard(null);
    };

    const handleAction = (actionType) => {
        if (!selectedCard) return;

        const basePath = '/Maintenance/Tool';
        const route = routes[selectedCard.id];

        if (actionType === 'view') {
            navigate(`/maintenance-view/${selectedCard.id}`);
        } else if (route) {
            navigate(`${basePath}/${route}${actionType === 'print' ? '/print' : ''}`);
        } else {
            alert(actionType === 'print' ? '🚧 Print page coming soon!' : '🚧 Form logic coming soon!');
        }

        closeModal();
    };

    const actions = [
        ['fill', 'bi-pencil-square', 'Fill Data', 'Enter new data into the form'],
        ['view', 'bi-eye', 'View Data', 'View saved records from the database'],
        ['print', 'bi-printer', 'Print Data', 'Print saved records']
    ];

    return (
        <div className="maintenance-page-wrapper">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />

            <style>{`
                .maintenance-page-wrapper {
                    min-height: 100vh;
                    background: #0f172a;
                    overflow-y: auto;
                    font-family: 'Inter', sans-serif;
                    color: #f8fafc;
                }

                .maintenance-page-wrapper .text-muted {
                    color: #94a3b8 !important;
                }

                .hub-main-navbar {
                    position: sticky;
                    top: 0;
                    min-height: 90px;
                    background: #0f172a;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 2.5rem;
                    box-shadow: 0 1px 0 #263750;
                    z-index: 1000;
                    gap: 15px;
                }

                .nav-brand-section {
                    font-weight: 800;
                    color: #22d3ee;
                    font-size: 1.25rem;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                    z-index: 2;
                }

                .nav-brand-section:hover {
                    color: #67e8f9;
                }

                .status-top {
                    z-index: 2;
                    background: #0f2f25;
                    color: #4ade80;
                    border: 1px solid #166534;
                    padding: 7px 14px;
                    border-radius: 20px;
                    font-size: .75rem;
                    font-weight: 700;
                }

                .main-content-area {
                    padding: 40px 24px 80px;
                    max-width: 1536px;
                    margin: 0 auto;
                }

                .reports-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 24px;
                    width: 100%;
                }

                .module-card {
                    background: #182338;
                    border: 1px solid #263750;
                    border-radius: 20px;
                    padding: 2.5rem 2rem;
                    cursor: pointer;
                    transition: .3s;
                    position: relative;
                    overflow: hidden;
                    height: 100%;
                    text-align: left;
                    box-shadow: 0 4px 10px rgba(0,0,0,.18);
                }

                .module-card:hover {
                    transform: translateY(-8px);
                    border-color: #22d3ee;
                    box-shadow: 0 20px 40px rgba(34,211,238,.10);
                }

                .card-accent-line {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 5px;
                }

                .icon-wrapper {
                    width: 55px;
                    height: 55px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.6rem;
                    margin-bottom: 1.5rem;
                    background: #10293a !important;
                }

                .card-title-custom {
                    font-weight: 800;
                    font-size: 1.25rem;
                    color: #f8fafc;
                    margin-bottom: 1.2rem;
                    padding-right: 110px;
                }

                .meta-tag {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: .8rem;
                    color: #94a3b8;
                    background: #202d43;
                    padding: 7px 12px;
                    border-radius: 8px;
                    margin-bottom: 8px;
                    font-weight: 600;
                    border: 1px solid #263750;
                    width: fit-content;
                }

                .meta-tag b {
                    color: #f8fafc;
                }

                .status-badge {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-size: .65rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: .05em;
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

                .pulse-icon { animation: pulseAnim 2s infinite; }
                .spin-icon { animation: spinAnim 4s linear infinite; }

                @keyframes pulseAnim {
                    0%,100% { opacity: 1; transform: scale(1); }
                    50% { opacity: .5; transform: scale(.8); }
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
                    z-index: 20000;
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
                    background: #16243a;
                    border-color: #22d3ee;
                }

                .modal-action-btn:last-child {
                    margin-bottom: 0;
                }

                .modal-btn-icon {
                    width: 42px;
                    height: 42px;
                    border-radius: 6px;
                    background: #202d43;
                    color: #22d3ee;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    flex-shrink: 0;
                }

                @media (max-width: 1200px) {
                    .reports-grid { grid-template-columns: repeat(3, 1fr); }
                }

                @media (max-width: 900px) {
                    .reports-grid { grid-template-columns: repeat(2, 1fr); }
                }

                @media (max-width: 600px) {
                    .hub-main-navbar { padding: 0 16px; }
                    .main-content-area { padding: 30px 16px 60px; }
                    .reports-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            <nav className="hub-main-navbar" style={{ position: 'relative' }}>
                <div className="nav-brand-section" onClick={() => navigate('/Maintenance/Tool')}>
                    <i className="bi bi-arrow-left-circle"></i>
                    Back To Tool
                </div>

                <div
                    className="text-center"
                    style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 'max-content',
                        pointerEvents: 'none'
                    }}
                >
                    <h1 style={{ fontWeight: 900, color: '#22d3ee', fontSize: 'clamp(1.2rem,3vw,1.8rem)', margin: '0 0 4px' }}>
                        Tool Daily Reports
                    </h1>

                    <p className="text-muted" style={{ margin: 0, fontSize: '.85rem' }}>
                        Select a checklist to record today's maintenance activities
                    </p>
                </div>

                <div className="status-top">
                    Status: Live
                </div>
            </nav>

            <div className="main-content-area">
                <div className="reports-grid">
                    {toolDailyReports.map((report) => (
                        <div
                            key={report.id}
                            className="module-card"
                            onClick={() => handleCardClick(report)}
                        >
                            <div
                                className="card-accent-line"
                                style={{ backgroundColor: report.color }}
                            />

                            <div className={`status-badge ${report.isLive ? 'status-live' : 'status-dev'}`}>
                                {report.isLive
                                    ? <><i className="bi bi-broadcast pulse-icon"></i> Live</>
                                    : <><i className="bi bi-gear-wide-connected spin-icon"></i> Under Development</>
                                }
                            </div>

                            <div className="icon-wrapper" style={{ color: report.color }}>
                                <i className={`bi ${report.icon}`}></i>
                            </div>

                            <h3 className="card-title-custom">{report.title}</h3>

                            <div className="meta-tag">
                                Form: <b>{report.formNo}</b>
                            </div>

                            <div className="meta-tag">
                                Resp: <b>{report.responsibility}</b>
                            </div>

                            <div className="mt-4 text-end">
                                <i
                                    className="bi bi-arrow-right-circle-fill"
                                    style={{ fontSize: '1.5rem', color: report.color }}
                                />
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
                            <div
                                style={{
                                    width: 46,
                                    height: 46,
                                    borderRadius: 8,
                                    background: '#10293a',
                                    color: selectedCard.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.4rem'
                                }}
                            >
                                <i className={`bi ${selectedCard.icon}`}></i>
                            </div>

                            <div>
                                <p style={{ fontWeight: 800, fontSize: '.95rem', margin: 0, color: '#f8fafc' }}>
                                    {selectedCard.title}
                                </p>
                                <p style={{ fontSize: '.75rem', color: '#94a3b8', margin: 0 }}>
                                    Form: {selectedCard.formNo || 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div style={{ borderTop: '1px solid #263750', margin: '16px 0' }} />

                        <p style={{
                            fontSize: '.78rem',
                            color: '#94a3b8',
                            fontWeight: 600,
                            marginBottom: 14,
                            textTransform: 'uppercase',
                            letterSpacing: '.06em'
                        }}>
                            What would you like to do?
                        </p>

                        {actions.map(([action, icon, title, desc]) => (
                            <button
                                key={action}
                                className="modal-action-btn"
                                onClick={() => handleAction(action)}
                            >
                                <div className="modal-btn-icon">
                                    <i className={`bi ${icon}`}></i>
                                </div>

                                <div>
                                    <p style={{ fontWeight: 700, fontSize: '.9rem', margin: 0, color: '#f8fafc' }}>
                                        {title}
                                    </p>
                                    <p style={{ fontSize: '.75rem', color: '#94a3b8', margin: 0 }}>
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

export default ToolDailyReports;