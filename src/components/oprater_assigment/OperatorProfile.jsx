import React from 'react';
import './RemainingScreens.css';

export default function OperatorProfile() {
  return (
    <div className="modern-container">
      {/* Header Section */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' }}>
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="page-badge"></span>
          <h1 className="page-title">Operator Profile / History</h1>
        </div>
        
        {/* New Filters Section for the plant choose option*/}
        <div className="header-filters" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--tab-bg)', color: 'var(--text-dark)', border: '1px solid var(--border-color)', outline: 'none' }}>
            <option value="plant1">Plant 1</option>
            <option value="plant2">Plant 2</option>
          </select>

          <input type="date" style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--tab-bg)', color: 'var(--text-dark)', border: '1px solid var(--border-color)', outline: 'none' }} />

          <select style={{ padding: '8px 12px', borderRadius: '6px', background: 'var(--tab-bg)', color: 'var(--text-dark)', border: '1px solid var(--border-color)', outline: 'none' }}>
            <option value="abhishek">Abhishek (OPR-1007)</option>
            <option value="rahul">Rahul (OPR-1008)</option>
            <option value="vikas">Vikas (OPR-1009)</option>
          </select>

      
        </div>
      </div>

      {/* Top Row: 3 Cards Structure */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
        
        {/* CARD 1: Operator Details */}
        <div className="card" style={{ flex: '1 1 250px' }}>
          <div className="flex-center gap-4 mb-4">
            <div className="avatar large purple" style={{ width: '64px', height: '64px', fontSize: '28px' }}>A</div>
            <div>
              <h2 style={{ margin: 0, fontSize: '20px' }}>Abhishek</h2>
              <div className="mt-2">
                <span className="status-badge free" style={{ background: 'green', border: '1px solid var(--border-color)', color: 'var(--text-dark)' }}>● Free</span>
              </div>
            </div>
          </div>
          
          <div className="detail-row"><span className="label">Operator ID</span> <span className="val">OPR-1007</span></div>
          <div className="detail-row"><span className="label">Department</span> <span className="val">Production</span></div>
          <div className="detail-row"><span className="label">Phone</span> <span className="val">+91 98765 43210</span></div>
          <div className="detail-row"><span className="label">Email</span> <span className="val" style={{fontSize: '13px'}}>abhishek@company.com</span></div>
          <div className="detail-row"><span className="label">Joined On</span> <span className="val">12 Jan 2023</span></div>
        </div>

        {/* CARD 2: Key Insights */} 
        <div className="card" style={{ flex: '2 1 400px' }}>
          <div className="flex-center gap-2 mb-4">
            <div style={{ color: '#fbbf24', display: 'flex' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5"/>
                <path d="M9 18h6"/>
                <path d="M10 22h4"/>
              </svg>
            </div>
            <h3 className="section-title" style={{ margin: 0 }}>Key Insights</h3>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginTop: '20px' }}>
            
            {/* Insight 1: Efficiency */}
            <div className="flex-center gap-3">
              <div style={{ width: '45px', height: '45px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--text-dark)' }}>Avg. Efficiency</h4>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>85% Today</p>
              </div>
            </div>
            
            {/* Insight 2: Total Production */}
            <div className="flex-center gap-3">
              <div style={{ width: '45px', height: '45px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                  <path d="m3.3 7 8.7 5 8.7-5"/>
                  <path d="M12 22V12"/>
                </svg>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--text-dark)' }}>Total Production</h4>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>1250 Pcs across machines</p>
              </div>
            </div>
          
            {/* Insight 3: Working Time */}
            <div className="flex-center gap-3">
              <div style={{ width: '45px', height: '45px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--text-dark)' }}>Working Time</h4>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>2h 15m active today</p>
              </div>
            </div>
            
            {/* Insight 4: Previous Machine */}
            <div className="flex-center gap-3">
              <div style={{ width: '45px', height: '45px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--text-dark)' }}>Previous Machine</h4>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Press Machine 2 (Till 10:30)</p>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: Current Status Summary */}
        <div className="card" style={{ flex: '1 1 250px' }}>
          <div className="flex-between mb-2">
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Current Status</span>
            <span className="status-badge free" style={{ background: 'green', border: '1px solid var(--border-color)', color: 'var(--text-dark)' }}>Free</span>
          </div>
          <h2 style={{ fontSize: '32px', margin: '8px 0', color: 'var(--text-dark)' }}>Available</h2>

          <div style={{ marginTop: '28px' }}>
            <div className="flex-between" style={{ padding: '8px 0', borderBottom: '1px dashed var(--border-color)', fontSize: '13px' }}>
              <span className="text-muted">Free Since</span>
              <span style={{ color: 'var(--text-dark)', fontWeight: 'bold' }}>10:30 AM</span>
            </div>
            <div className="flex-between" style={{ padding: '8px 0', borderBottom: '1px dashed var(--border-color)', fontSize: '13px' }}>
              <span className="text-muted">Shift</span>
              <span style={{ color: 'var(--text-dark)', fontWeight: 'bold' }}>Day Shift</span>
            </div>
            <div className="flex-between" style={{ padding: '8px 0', fontSize: '13px' }}>
              <span className="text-muted">Date</span>
              <span style={{ color: 'var(--text-dark)', fontWeight: 'bold' }}>2026-09-17</span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Row: 2 Cards Structure */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        
        {/* Main History Table */}
        <div className="card" style={{ flex: '2 1 600px' }}>
          <h3 className="section-title mb-4">Assignment History & Trend</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="theme-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Date</th>
                  <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Machine</th>
                  <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Shift</th>
                  <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Time</th>
                  <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Total working time</th>
                  <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Production</th>
                  <th style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>Efficiency</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px dashed var(--border-color)' }}>
                  <td style={{ padding: '12px 8px' }}>Today</td>
                  <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>Press Machine 2</td>
                  <td style={{ padding: '12px 8px' }}>Day Shift</td>
                  <td style={{ padding: '12px 8px' }}>08:15 AM - 10:30 AM</td>
                  <td style={{ padding: '12px 8px' }}>2:15 hrs</td>
                  <td style={{ padding: '12px 8px' }}>1250 Pcs</td>
                  <td style={{ padding: '12px 8px', color: 'var(--green)' }}>85%</td>
                </tr>
                <tr style={{ borderBottom: '1px dashed var(--border-color)' }}>
                  <td style={{ padding: '12px 8px' }}>Today</td>
                  <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>CNC Machine 22</td>
                  <td style={{ padding: '12px 8px' }}>Day Shift</td>
                  <td style={{ padding: '12px 8px' }}>06:00 AM - 08:15 AM</td>
                  <td style={{ padding: '12px 8px' }}>2:15 hrs</td>
                  <td style={{ padding: '12px 8px' }}>1180 Pcs</td>
                  <td style={{ padding: '12px 8px', color: 'var(--green)' }}>82%</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px 8px' }}>Yesterday</td>
                  <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>VMC Machine 5</td>
                  <td style={{ padding: '12px 8px' }}>Day Shift</td>
                  <td style={{ padding: '12px 8px' }}>06:00 AM - 02:00 PM</td>
                  <td style={{ padding: '12px 8px' }}>8:00 hrs</td>
                  <td style={{ padding: '12px 8px' }}>2450 Pcs</td>
                  <td style={{ padding: '12px 8px', color: 'var(--green)' }}>88%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel: Completed Work Summary */}
        <div className="card" style={{ flex: '1 1 300px' }}>
          
          {/* Modified Work Breakdown Header with Total */}
          <div className="flex-between mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="section-title" style={{ margin: 0 }}>Work Breakdown (Today)</h3>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--green)' }}>Total: 4:30 hrs</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Breakdown Item 1 */}
            <div style={{ background: 'var(--tab-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
              <div className="flex-between mb-2">
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-dark)' }}>Press Machine 2</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>08:15 - 10:30 AM</span>
              </div>
              <div className="flex-between mt-3">
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Production Target Met</span>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-dark)' }}>1250 Pcs</span>
              </div>
              <div className="flex-between mt-1">
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Overall working time </span>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--green)' }}>2:15 hrs</span>
              </div>
            </div>

            {/* Breakdown Item 2 */}
            <div style={{ background: 'var(--tab-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
              <div className="flex-between mb-2">
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-dark)' }}>CNC Machine 22</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>06:00 - 08:15 AM</span>
              </div>
              <div className="flex-between mt-3">
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Production Target Met</span>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-dark)' }}>1180 Pcs</span>
              </div>
              <div className="flex-between mt-1">
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Overall working time </span>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--green)' }}>2:15 hrs</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}