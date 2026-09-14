import React, { useState } from "react";
import "./OperatorDashboard.css"; // Dhyan rakhna iska naam change kiya hai

export default function OperatorDashboard() {
  const [activeTab, setActiveTab] = useState("All Machines");

  // Dummy Data
  const stats = { total: 24, running: 18, assigned: 12, free: 3 };
  const tabs = ["All Machines", "Press", "CNC", "VMC", "Bending", "Blending", "Others"];

  const machineData = [
    { id: 1, type: "Press Machine", no: "2", operator: "Mohit", shift: "Day Shift", start: "10:30 AM", prod: "980 Pcs", eff: "82%", status: "Running" },
    { id: 2, type: "CNC Machine", no: "23", operator: "Sahil", shift: "Day Shift", start: "08:05 AM", prod: "1350 Pcs", eff: "68%", status: "Running" },
    { id: 3, type: "VMC Machine", no: "5", operator: "Unassigned", shift: "Day Shift", start: "--", prod: "0 Pcs", eff: "0%", status: "Idle" },
    { id: 4, type: "Bending Machine", no: "1", operator: "Ramesh", shift: "Day Shift", start: "06:15 AM", prod: "1620 Pcs", eff: "85%", status: "Running" },
    { id: 5, type: "Blending Machine", no: "1", operator: "Vikram", shift: "Day Shift", start: "07:20 AM", prod: "1490 Pcs", eff: "78%", status: "Running" },
    { id: 6, type: "Press Machine", no: "4", operator: "Unassigned", shift: "Day Shift", start: "Last Active: 15 mins ago", prod: "450 Pcs", eff: "40%", status: "Offline" },
  ];

  return (
    <div className="main-dashboard">
      <div className="dash-header">
        <div className="dash-title">
          <span className="badge-circle">1</span>
          <h1>Operator - Machine Dashboard</h1>
        </div>
        <div className="dash-controls">
          <select className="dash-select"><option>Plant 1</option><option>Plant 2</option></select>
          <select className="dash-select"><option>Day Shift (06:00 AM - 02:00 PM)</option></select>
          <button className="icon-btn">↻</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue-bg">🎰</div>
          <div className="stat-info"><p>Total Machines</p><h3>{stats.total}</h3><span>All Machines</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green-bg">🔄</div>
          <div className="stat-info"><p>Running Machines</p><h3>{stats.running}</h3><span className="text-green">75% of Total</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange-bg">👷</div>
          <div className="stat-info"><p>Assigned Operators</p><h3>{stats.assigned}</h3><span className="text-orange">50% of Total</span></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple-bg">👥</div>
          <div className="stat-info"><p>Free Operators</p><h3>{stats.free}</h3><span>Available</span></div>
        </div>
      </div>

      <div className="dash-tabs">
        {tabs.map((tab) => (
          <button key={tab} className={`dash-tab-btn ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>

      <div className="machine-grid">
        {machineData.map((machine) => (
          <div key={machine.id} className={`machine-card ${machine.status === "Offline" ? "offline-border" : ""}`}>
            <div className="mc-header">
              <div className="mc-image-placeholder">🤖</div>
              <div className="mc-title-area">
                <h4>{machine.type} <span>{machine.no}</span></h4>
                <div className="mc-meta"><span className="meta-label">Machine No.</span><span className="meta-value">{machine.no}</span></div>
              </div>
              <div className={`status-pill ${machine.status.toLowerCase()}`}>● {machine.status}</div>
            </div>
            <div className="mc-body">
              <div className="mc-row"><span className="mc-label">Current Operator</span>
                {machine.operator === "Unassigned" ? (<span className="mc-value text-red">Unassigned</span>) : (
                  <div className="mc-operator"><span className="op-avatar">{(machine.operator).charAt(0)}</span>{machine.operator}</div>
                )}
              </div>
              <div className="mc-row"><span className="mc-label">Shift</span><span className="mc-value">{machine.shift}</span></div>
              <div className="mc-row"><span className="mc-label">Start Time / Last Active</span><span className="mc-value">{machine.start}</span></div>
            </div>
            <div className="mc-footer">
              <div className="mc-stat"><span className="mc-label">Production</span><strong>{machine.prod}</strong></div>
              <div className="mc-stat"><span className="mc-label">Efficiency</span><strong>{machine.eff}</strong></div>
            </div>
          </div>
        ))}
        
        <div className="machine-card operator-only-card">
          <div className="op-card-header">
            <div className="op-avatar large purple-bg">A</div>
            <div className="op-title"><h4>Abhishek</h4></div>
            <div className="status-pill free">● Free</div>
          </div>
          <div className="mc-body">
            <div className="mc-row"><span className="mc-label">Status</span><span className="mc-value">Free</span></div>
            <div className="mc-row"><span className="mc-label">Shift</span><span className="mc-value">Day Shift</span></div>
            <div className="mc-row"><span className="mc-label">Since</span><span className="mc-value">10:30 AM</span></div>
          </div>
          <div className="op-card-footer">Abhishek is now Free after reassignment.</div>
        </div>
      </div>
    </div>
  );
}