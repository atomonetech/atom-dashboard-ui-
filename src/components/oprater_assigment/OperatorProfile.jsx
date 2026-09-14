import React from 'react';
import './RemainingScreens.css';

export default function OperatorProfile() {
  return (
    <div className="modern-container">
      <div className="page-header">
        <div className="header-left">
          <span className="page-badge">4</span>
          <h1 className="page-title">Operator Profile / History - Abhishek</h1>
        </div>
        <button className="btn-outline">📥 Export Profile</button>
      </div>

      <div className="profile-top-grid">
        {/* Profile Card */}
        <div className="card profile-card">
          <div className="flex-between mb-4">
            <div className="flex-center gap-4">
              <div className="avatar large purple">A</div>
              <div>
                <h2>Abhishek</h2>
                <p className="text-muted mt-1">Operator ID: OPR-1007</p>
              </div>
            </div>
            <span className="status-badge free">● Free</span>
          </div>
          <div className="detail-row"><span className="label">Department</span> <span className="val">Production</span></div>
          <div className="detail-row"><span className="label">Phone</span> <span className="val">+91 98765 43210</span></div>
          <div className="detail-row"><span className="label">Email</span> <span className="val">abhishek@company.com</span></div>
          <div className="detail-row"><span className="label">Joined On</span> <span className="val">12 Jan 2023</span></div>
        </div>

        {/* Stats & Current Status */}
        <div className="profile-stats-container">
          <div className="stats-row mb-4">
            <div className="card stat-box">
              <p className="label">Current Status</p>
              <h3>Free</h3>
              <p className="text-sm text-muted mt-1">Since 10:30 AM</p>
            </div>
            <div className="card stat-box">
              <p className="label">Previous Machine</p>
              <h3>Press Machine 2</h3>
              <p className="text-sm text-muted mt-1">Until 10:30 AM</p>
            </div>
            <div className="card stat-box">
              <p className="label">Total Working Time Today</p>
              <h3>2h 15m</h3>
              <p className="text-sm text-muted mt-1">Day Shift</p>
            </div>
            <div className="card stat-box">
              <p className="label">Total Production Today</p>
              <h3>1250 Pcs</h3>
              <p className="text-sm text-muted mt-1">Across All Machines</p>
            </div>
          </div>

          <div className="action-row grid-2 gap-4">
            <div className="card bg-gray-50 border-dashed">
              <h4 className="label mb-3">What he is doing / Current Status</h4>
              <div className="flex-center gap-3">
                <div className="avatar small green">A</div>
                <div>
                  <p className="font-bold">Abhishek is currently Free.</p>
                  <p className="text-sm text-muted">Available for new assignment.</p>
                </div>
              </div>
              <div className="mt-3 badge-light-green">Free Since 10:30 AM</div>
            </div>
            <div className="card border-dashed">
              <h4 className="label mb-3 text-blue">What he has done / Completed Work</h4>
              <div className="flex-between mb-2">
                <p className="font-bold text-sm">👤 Last Assignment</p>
                <p className="text-sm text-muted">🕒 08:15 AM - 10:30 AM</p>
              </div>
              <p className="text-sm mb-3">Press Machine 2</p>
              <div className="flex-between border-t pt-2 mt-2">
                <span className="text-sm">📄 Production: <strong>1250 Pcs</strong></span>
                <span className="text-sm">Efficiency: <strong className="text-green">85%</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment History Table */}
      <div className="card mt-6">
        <h3 className="section-title mb-4">Recent Assignment History</h3>
        <div className="table-responsive">
          <table className="theme-table">
            <thead>
              <tr>
                <th>Date</th><th>Machine</th><th>Shift</th><th>Start Time</th>
                <th>End Time</th><th>Duration</th><th>Production</th><th>Efficiency</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Today</td><td>Press Machine 2</td><td>Day Shift</td><td>08:15 AM</td>
                <td>10:30 AM</td><td>2h 15m</td><td>1250 Pcs</td><td>85%</td>
                <td><span className="badge badge-green">Completed</span></td>
              </tr>
              <tr>
                <td>Today</td><td>CNC Machine 22</td><td>Day Shift</td><td>06:00 AM</td>
                <td>08:15 AM</td><td>2h 15m</td><td>1180 Pcs</td><td>82%</td>
                <td><span className="badge badge-green">Completed</span></td>
              </tr>
              <tr>
                <td>Yesterday</td><td>VMC Machine 5</td><td>Day Shift</td><td>06:00 AM</td>
                <td>02:00 PM</td><td>8h 00m</td><td>2450 Pcs</td><td>88%</td>
                <td><span className="badge badge-green">Completed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}