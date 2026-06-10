// src/components/Plant1LiveModal.js - COMPLETE PLANT 2 STYLE MODAL
import React, { useState, useEffect } from 'react';
import './Plant1LiveModal.css';

function Plant1LiveModal({ machine, onClose }) {
    const [changes, setChanges] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

    useEffect(() => {
        if (machine) {
            fetchMachineChanges();
        }
    }, [machine]);

    const fetchMachineChanges = async () => {
        try {
            const response = await fetch(
                `${API_BASE}/api/machine-changes/?machine_no=${machine.machine_no}&plant=1`
            );
            const data = await response.json();
            
            if (data.success) {
                setChanges(data.changes);
            }
        } catch (error) {
            console.error('Error fetching changes:', error);
        } finally {
            setLoading(false);
        }
    };

    const getMachineColor = (machine) => {
        if (!machine || !machine.machine_on) return '#374151';
        if (machine.is_producing) return '#10b981';
        return '#f59e0b';
    };

    const getMachineStatus = (machine) => {
        if (!machine || !machine.machine_on) return 'OFFLINE';
        if (machine.is_producing) return 'RUNNING';
        return 'IDLE';
    };

    if (!machine) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div 
                    className="modal-header" 
                    style={{
                        background: `linear-gradient(135deg, ${getMachineColor(machine)} 0%, ${getMachineColor(machine)}dd 100%)`
                    }}
                >
                    <div className="header-left">
                        <h2>Machine {machine.machine_no}</h2>
                        {changes.length > 0 && (
                            <div className="notification-badge">
                                🔔 {changes.length}
                            </div>
                        )}
                    </div>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                {/* MACHINE TIMELINE Section */}
                <div className="timeline-section">
                    <h3>⏱️ MACHINE TIMELINE</h3>
                    <div className="timeline-items">
                        {machine.on_since && machine.on_since !== 'Never' && (
                            <div className="timeline-item" style={{ background: '#d1fae5', borderLeft: '4px solid #10b981' }}>
                                <div className="timeline-label">Machine Turned ON</div>
                                <div className="timeline-value">{machine.on_since}</div>
                                {machine.on_duration_minutes && (
                                    <div className="timeline-duration">{machine.on_duration_minutes} minutes ago</div>
                                )}
                            </div>
                        )}
                        
                        {machine.first_count_at && machine.first_count_at !== 'Never' && (
                            <div className="timeline-item" style={{ background: '#dbeafe', borderLeft: '4px solid #3b82f6' }}>
                                <div className="timeline-label">Start Production (First Count)</div>
                                <div className="timeline-value">{machine.first_count_at}</div>
                                {machine.time_to_first_count && (
                                    <div className="timeline-duration">{machine.time_to_first_count} minutes delay</div>
                                )}
                            </div>
                        )}

                        {machine.last_activity && machine.last_activity !== 'Never' && (
                            <div className="timeline-item" style={{ background: '#fef3c7', borderLeft: '4px solid #f59e0b' }}>
                                <div className="timeline-label">Last Count Received</div>
                                <div className="timeline-value">{machine.last_activity}</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* CURRENT HOUR PRODUCTION - BIG NUMBER */}
                <div className="production-section">
                    <div className="production-label">CURRENT HOUR PRODUCTION</div>
                    <div className="production-value" style={{ color: getMachineColor(machine) }}>
                        {machine.current_hour_count || 0}
                    </div>
                    <div className="production-status" style={{ color: getMachineColor(machine) }}>
                        {getMachineStatus(machine) === 'RUNNING' && '🟢 Currently Producing'}
                        {getMachineStatus(machine) === 'IDLE' && '🟡 Machine Idle'}
                        {getMachineStatus(machine) === 'OFFLINE' && '⚫ Machine Offline'}
                    </div>
                </div>

                {/* CUSTOMER INFORMATION Section */}
                <div className="info-section">
                    <h3>👤 CUSTOMER INFORMATION</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="label">Customer:</span>
                            <span className="value">{machine.tool_customer || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Model:</span>
                            <span className="value">{machine.tool_model || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Part Name:</span>
                            <span className="value">{machine.tool_part_name || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Part Number:</span>
                            <span className="value">{machine.tool_part_number || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                {/* TOOL INFORMATION Section */}
                <div className="info-section">
                    <h3>🔧 TOOL INFORMATION</h3>
                    <div className="info-grid">
                        <div className="info-item full-width">
                            <span className="label">Tool Name:</span>
                            <span className="value">{machine.tool_name || 'N/A'}</span>
                        </div>
                        <div className="info-item full-width">
                            <span className="label">Tool ID:</span>
                            <span className="value" style={{ fontSize: '11px', wordBreak: 'break-all' }}>
                                {machine.tool_id?.substring(0, 24) || 'N/A'}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="label">Shut Height:</span>
                            <span className="value">
                                {machine.shut_height && typeof machine.shut_height === 'number' 
                                    ? machine.shut_height.toFixed(2)
                                    : machine.shut_height || 'N/A'}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="label">TPM:</span>
                            <span className="value">{machine.tool_tpm || 0}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">EPC:</span>
                            <span className="value">{machine.tool_epc || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Shift:</span>
                            <span className="value">Shift {machine.shift}</span>
                        </div>
                    </div>
                </div>

                {/* PRODUCTION STATS */}
                <div className="stats-section">
                    <div className="stat-box">
                        <div className="stat-label">Last Hour production</div>
                        <div className="stat-value">{machine.last_hour_count || 0}</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-label">Cumulative</div>
                        <div className="stat-value" style={{ color: '#10b981' }}>
                            {machine.cumulative_count || 0}
                        </div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-label">Idle Time In This Shift</div>
                        <div className="stat-value" style={{ color: '#f59e0b' }}>
                            {machine.total_shift_idle_time || 0} min
                        </div>
                    </div>
                </div>

                {/* CHANGES Section */}
                <div className="changes-section">
                    <h3>📋 Today's Changes (Shift {machine.shift})</h3>
                    
                    {loading ? (
                        <div className="loading">Loading changes...</div>
                    ) : changes.length === 0 ? (
                        <div className="no-changes">
                            <p>✅ No changes detected today</p>
                        </div>
                    ) : (
                        <div className="changes-list">
                            {changes.map((change, idx) => (
                                <div key={idx} className="change-item">
                                    <div className="change-header">
                                        <span className="time-badge">⏰ {change.time}</span>
                                        <span className="change-number">#{changes.length - idx}</span>
                                    </div>
                                    <div className="change-details">
                                        {change.height_changed && (
                                            <div className="change-row height-change">
                                                <div>
                                                    <strong>🔧 Shut Height Changed:</strong>
                                                </div>
                                                <div className="change-values">
                                                    <span className="old-value">{change.old_height?.toFixed(2) || 'N/A'}</span>
                                                    {' → '}
                                                    <span className="new-value">{change.new_height?.toFixed(2) || 'N/A'}</span>
                                                </div>
                                            </div>
                                        )}
                                        {change.tool_changed && (
                                            <div className="change-row tool-change">
                                                <div>
                                                    <strong>🔩 Tool ID Changed:</strong>
                                                </div>
                                                <div className="change-values" style={{ fontSize: '11px', wordBreak: 'break-all' }}>
                                                    <div>Old: {change.old_tool}</div>
                                                    <div>New: {change.new_tool}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Plant1LiveModal;
