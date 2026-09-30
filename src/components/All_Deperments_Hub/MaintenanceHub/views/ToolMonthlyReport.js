import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toolMonthlyReports } from '../data/ToolMachineData';

const ToolMonthlyReport = () => {
    const navigate = useNavigate();
    const [selectedCard, setSelectedCard] = useState(null);

    const fillRoutes = {
        tool_breakdown_summary: 'breakdown-summary',
        why_tool_analysis: 'why-analysis',
        tool_critical_spares: 'critical-spares'
    };

    const closeModal = () => setSelectedCard(null);

    const handleAction = (type) => {
        if (!selectedCard) return;

        const basePath = '/Maintenance/Tool';
        const { id } = selectedCard;

        if (type === 'fill') {
            const route = fillRoutes[id];
            route ? navigate(`${basePath}/${route}`) : alert('🚧 Tool Form coming soon!');
        } else if (type === 'view') {
            navigate(`/maintenance-view/${id}`);
        } else if (type === 'print') {
            navigate(`${basePath}/${id}-print`);
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
                    font-family: 'Inter', sans-serif;
                    overflow-x: hidden;
                    color: #f8fafc;
                }

                .maintenance-page-wrapper .text-muted {
                    color: #94a3b8 !important;
                }

                .hub-main-navbar {
                    position: fixed;
                    top: 0;
                    width: 100%;
                    height: 75px;
                    background: #0f172a;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 20px;
                    border-bottom: 1px solid #263750;
                    z-index: 10000;
                    box-shadow: 0 2px 10px rgba(0,0,0,.18);
                }

                .nav-brand-section {
                    font-weight: 800;
                    color: #22d3ee;
                    font-size: 1.2rem;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    z-index: 2;
                }

                .nav-brand-section:hover {
                    color: #67e8f9;
                }

                .main-content-area {
                    padding: 100px 15px 80px;
                    max-width: 1536px;
                    margin: 0 auto;
                }

                .report-card-ui {
                    background: #182338;
                    border-radius: 24px;
                    padding: 30px 25px;
                    border: 1px solid #263750;
                    transition: .3s;
                    cursor: pointer;
                    height: 100%;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 4px 10px rgba(0,0,0,.18);
                }

                .report-card-ui:hover {
                    transform: translateY(-8px);
                    border-color: #22d3ee;
                    box-shadow: 0 20px 40px rgba(34,211,238,.10);
                }

                .card-header-line {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 6px;
                    border-radius: 24px 24px 0 0;
                }

                .icon-box-wrapper {
                    width: 55px;
                    height: 55px;
                    border-radius: 15px;
                    background: #10293a !important;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.6rem;
                    margin-bottom: 25px;
                }

                .card-main-title {
                    font-weight: 800;
                    color: #f8fafc !important;
                    font-size: 1.4rem;
                    margin-bottom: 25px;
                    min-height: 70px;
                    padding-right: 120px;
                }

                .meta-pill-ui {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: #202d43;
                    padding: 10px 16px;
                    border-radius: 12px;
                    border: 1px solid #263750;
                    font-size: .85rem;
                    color: #94a3b8;
                    font-weight: 600;
                    margin-bottom: 10px;
                }

                .meta-pill-ui b {
                    color: #f8fafc;
                    font-weight: 800;
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
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 14px 16px;
                    margin-bottom: 10px;
                    background: #111c2f;
                    color: #f8fafc;
                    border: 1px solid #263750;
                    border-radius: 8px;
                    cursor: pointer;
                    text-align: left;
                    transition: .2s;
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

                @media (max-width: 600px) {
                    .hub-main-navbar { padding: 0 16px; }
                    .main-content-area { padding: 100px 8px 60px; }
                    .card-main-title { padding-right: 90px; }
                }
            `}</style>

            <nav className="hub-main-navbar">
                <div className="nav-brand-section" onClick={() => navigate('/Maintenance/Tool')}>
                    <i className="bi bi-arrow-left-circle"></i>
                    <span>Back To Tool</span>
                </div>

                <header
                    className="text-center"
                    style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 'max-content',
                        pointerEvents: 'none'
                    }}
                >
                    <h1 style={{
                        fontWeight: 900,
                        color: '#22d3ee',
                        fontSize: 'clamp(1.2rem,3vw,1.8rem)',
                        margin: '0 0 4px'
                    }}>
                        Tooling Analysis Hub
                    </h1>

                    <p className="text-muted" style={{ margin: 0, fontSize: '.85rem' }}>
                        Monthly tool breakdown and critical spares
                    </p>
                </header>
            </nav>

            <div className="main-content-area">
                <div className="row g-4 px-2">
                    {toolMonthlyReports.map((report) => (
                        <div key={report.id} className="col-12 col-md-6 col-lg-4">
                            <div
                                className="report-card-ui"
                                onClick={() => setSelectedCard(report)}
                            >
                                <div
                                    className="card-header-line"
                                    style={{ backgroundColor: report.color }}
                                />

                                <div className={`status-badge ${report.isLive ? 'status-live' : 'status-dev'}`}>
                                    {report.isLive
                                        ? <><i className="bi bi-broadcast pulse-icon"></i> Live</>
                                        : <><i className="bi bi-gear-wide-connected spin-icon"></i> Under Development</>
                                    }
                                </div>

                                <div className="icon-box-wrapper" style={{ color: report.color }}>
                                    <i className={`bi ${report.icon}`}></i>
                                </div>

                                <div className="card-main-title">{report.title}</div>

                                <div className="mt-auto">
                                    <div className="meta-pill-ui">
                                        <span>Form:</span>
                                        <b>{report.formNo}</b>
                                    </div>

                                    <div className="meta-pill-ui">
                                        <span>Freq:</span>
                                        <b>Monthly</b>
                                    </div>

                                    <div className="mt-4 text-end">
                                        <i
                                            className="bi bi-arrow-right-circle-fill"
                                            style={{ fontSize: '1.8rem', color: report.color }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedCard && (
                <div className="modal-overlay-ui" onClick={closeModal}>
                    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={closeModal}>
                            <i className="bi bi-x-lg"></i>
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                            <div style={{
                                width: 46,
                                height: 46,
                                borderRadius: 8,
                                background: '#10293a',
                                color: selectedCard.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.4rem'
                            }}>
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

                        {actions.map(([type, icon, title, desc]) => (
                            <button
                                key={type}
                                className="modal-action-btn"
                                onClick={() => handleAction(type)}
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

export default ToolMonthlyReport;