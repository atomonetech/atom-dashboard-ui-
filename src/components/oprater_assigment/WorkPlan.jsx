import React from 'react';
import './RemainingScreens.css';

export default function WorkPlan() {
  const plans = [
    { op: "Mohit", id: "OPR-1012", mach: "Press Machine 2", task: "Pressing - Part A", start: "10:30 AM", end: "In Progress", dur: "3h 30m", tgt: 1500, act: 980, eff: "65.3%", shift: "Day Shift", status: "In Progress", isOffline: false },
    { op: "Abhishek", id: "OPR-1007", mach: "Press Machine 2", task: "Pressing - Part A", start: "08:15 AM", end: "10:30 AM", dur: "2h 15m", tgt: 1500, act: 1250, eff: "83.3%", shift: "Day Shift", status: "Completed", isOffline: false },
    { op: "Sahil", id: "OPR-1003", mach: "CNC Machine 23", task: "CNC Turning - Part B", start: "08:05 AM", end: "In Progress", dur: "5h 55m", tgt: 2000, act: 1350, eff: "67.5%", shift: "Day Shift", status: "In Progress", isOffline: false },
    { op: "Ramesh", id: "OPR-1001", mach: "Bending Machine 1", task: "Bending - Part C", start: "06:15 AM", end: "In Progress", dur: "7h 45m", tgt: 1800, act: 1620, eff: "90.0%", shift: "Day Shift", status: "In Progress", isOffline: false },
    { op: "Unassigned", id: "--", mach: "VMC Machine 5", task: "Milling - Part D", start: "--", end: "--", dur: "--", tgt: 2000, act: 0, eff: "0%", shift: "Day Shift", status: "Idle", isOffline: false },
    { op: "Unassigned", id: "--", mach: "Press Machine 4", task: "Maintenance", start: "09:00 AM", end: "In Progress", dur: "5h 00m", tgt: 0, act: 0, eff: "0%", shift: "Day Shift", status: "Offline", isOffline: true },
  ];

  return (
    <div className="modern-container">
      <div className="page-header flex-between">
        <div className="header-left">
          <span className="page-badge">5</span>
          <h1 className="page-title">Total Working Plan / Assignment History</h1>
        </div>
      </div>

      <div className="card">
        {/* Filters */}
        <div className="filters-row flex-between mb-4 pb-4 border-b">
          <div className="flex-center gap-4">
            <select className="input-field"><option>Plant 1</option></select>
            <select className="input-field"><option>Day Shift (06:00 AM - 02:00 PM)</option></select>
            <input type="date" className="input-field" defaultValue="2026-05-12" />
          </div>
          <div className="flex-center gap-4">
            <input type="text" className="input-field" placeholder="🔍 Search operator or machine..." />
            <button className="btn-outline">▽ Filters</button>
            <button className="btn-outline">📥 Export</button>
            <button className="btn-primary">Download</button>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="theme-table">
            <thead>
              <tr>
                <th>Operator</th><th>Operator ID</th><th>Machine</th><th>Task / Work Plan</th>
                <th>Assignment Start</th><th>End Time</th><th>Working Duration</th>
                <th>Target (Pcs)</th><th>Actual (Pcs)</th><th>Efficiency</th><th>Shift</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p, i) => (
                <tr key={i} className={p.isOffline ? "offline-row" : ""}>
                  <td>
                    <div className="flex-center gap-2 font-bold">
                      <span className={`avatar small ${p.op === 'Unassigned' ? (p.isOffline ? 'bg-gray-400' : 'bg-orange-400') : 'purple'}`}>
                        {p.op === 'Unassigned' ? '🛑' : p.op.charAt(0)}
                      </span>
                      <span className={p.isOffline ? "text-gray-500" : ""}>{p.op}</span>
                    </div>
                  </td>
                  <td className={p.isOffline ? "text-gray-500" : ""}>{p.id}</td>
                  <td className={p.isOffline ? "text-gray-500 font-bold" : ""}>{p.mach}</td>
                  <td className={p.isOffline ? "text-gray-500" : ""}>{p.task}</td>
                  <td className={p.isOffline ? "text-gray-500" : ""}>{p.start}</td>
                  <td className={p.isOffline ? "text-gray-500" : ""}>{p.end}</td>
                  <td className={p.isOffline ? "text-gray-500" : ""}>{p.dur}</td>
                  <td className={p.isOffline ? "text-gray-500" : ""}>{p.tgt}</td>
                  <td className={p.isOffline ? "text-gray-500" : ""}>{p.act}</td>
                  <td className={`font-bold ${p.eff !== '0%' && !p.isOffline ? 'text-green' : (p.isOffline ? 'text-gray-500' : '')}`}>{p.eff}</td>
                  <td className={p.isOffline ? "text-gray-500" : ""}>{p.shift}</td>
                  <td>
                    <span className={`badge ${p.status === 'Completed' ? 'badge-green' : p.status === 'In Progress' ? 'badge-blue' : p.status === 'Offline' ? 'badge-offline dim-red-blink' : 'badge-orange'}`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex-between mt-4 text-sm text-muted">
          <span>Showing 1 to 6 of 6 entries</span>
          <div className="flex-center gap-2">
            <button className="btn-outline px-2 py-1">&lt;</button>
            <button className="btn-primary px-3 py-1">1</button>
            <button className="btn-outline px-2 py-1">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}