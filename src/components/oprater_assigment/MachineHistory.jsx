import React from 'react';
import './RemainingScreens.css';

export default function MachineHistory() {
  return (
    <div className="modern-container">
      <div className="page-header">
        <div className="header-left">
          <span className="page-badge">3</span>
          <h1 className="page-title">Machine History - Press Machine 2</h1>
        </div>
        <button className="btn-outline">⋮</button>
      </div>

      <div className="history-grid">
        {/* Top Left: Machine Info */}
        <div className="card">
          <div className="machine-info-flex">
            <div className="machine-img-box">🤖</div>
            <div className="machine-details">
              <div className="flex-between">
                <h2>Press Machine 2</h2>
                <span className="status-badge running">● Running</span>
              </div>
              <div className="detail-row"><span className="label">Machine Type</span> <span className="val">Press Machine</span></div>
              <div className="detail-row"><span className="label">Location</span> <span className="val">Shop Floor - A</span></div>
              <div className="detail-row"><span className="label">Plant</span> <span className="val">Plant 1</span></div>
              <div className="detail-row">
                <span className="label">Current Operator</span> 
                <span className="val flex-center gap-2"><span className="avatar purple small">M</span> Mohit</span>
              </div>
              <div className="detail-row"><span className="label">Shift</span> <span className="val">Day Shift</span></div>
            </div>
          </div>
        </div>

        {/* Top Right: Production Stats */}
        <div className="card">
          <div className="flex-between mb-4">
            <div>
              <p className="label">Total Production Today</p>
              <h2 className="text-2xl mt-2">2230 Pcs</h2>
            </div>
            <div className="text-right">
              <p className="label">Efficiency</p>
              <div className="eff-circle mt-2">82%</div>
            </div>
          </div>
          <div className="detail-row"><span className="label">Target</span> <span className="val">2800 Pcs</span></div>
          <div className="detail-row"><span className="label">Achievement</span> <span className="val text-green">79.6% of Target</span></div>
          <div className="detail-row"><span className="label">Status</span> <span className="val text-green">Running</span></div>
        </div>

        {/* Bottom Left: Trend Chart (Placeholder) */}
        <div className="card">
          <h3 className="section-title">Production Trend (Today)</h3>
          <div className="chart-placeholder">
            <p className="text-muted text-center mt-10">📈 Line Chart Render Area</p>
          </div>
        </div>

        {/* Bottom Right: Operator Timeline */}
        <div className="card">
          <h3 className="section-title">Operator Timeline (Today)</h3>
          <div className="timeline">
            <div className="timeline-item">
              <div className="tl-dot gray"></div>
              <div className="tl-content">
                <p className="tl-time">06:00 AM - 08:15 AM</p>
                <p className="tl-title text-muted">No Operator</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="tl-dot purple">A</div>
              <div className="tl-content">
                <p className="tl-time">08:15 AM - 10:30 AM</p>
                <p className="tl-title">Abhishek <span className="text-muted font-normal">- 1250 Pcs</span></p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="tl-dot blue">M</div>
              <div className="tl-content">
                <p className="tl-time">10:30 AM - Current</p>
                <p className="tl-title">Mohit <span className="text-muted font-normal">- 980 Pcs</span></p>
              </div>
            </div>
          </div>
          <div className="tl-footer mt-4">
            📊 Total Production Today: 2230 Pcs
          </div>
        </div>
      </div>
    </div>
  );
}