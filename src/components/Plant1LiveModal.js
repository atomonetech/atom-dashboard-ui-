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
                <div className="modal-header">
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

                {/* Machine Info */}
                <div className="machine-info-grid">
                    <div className="info-item">
                        <span className="label">Current Hour Count:</span>
                        <span className="value">{machine.current_hour_count}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">Tool ID:</span>
                        <span className="value" style={{ fontSize: '12px' }}>
                            {machine.tool_id?.substring(0, 20)}...
                        </span>
                    </div>
                    <div className="info-item">
                        <span className="label">Shut Height:</span>
                        <span className="value">{machine.shut_height}</span>
                    </div>
                    <div className="info-item">
                        <span className="label">Ideal Time:</span>
                        <span className="value">{machine.total_shift_idle_time} min</span>
                    </div>
                    <div className="info-item">
                        <span className="label">Status:</span>
                        <span className={`value status-${machine.is_producing ? 'running' : 'idle'}`}>
                            {machine.is_producing ? '🟢 Running' : '🟡 Idle'}
                        </span>
                    </div>
                    <div className="info-item">
                        <span className="label">Shift:</span>
                        <span className="value">Shift {machine.shift}</span>
                    </div>
                </div>

                {/* Changes Section */}
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
                                                    <span className="old-value">{change.old_height.toFixed(2)}</span>
                                                    {' → '}
                                                    <span className="new-value">{change.new_height.toFixed(2)}</span>
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
