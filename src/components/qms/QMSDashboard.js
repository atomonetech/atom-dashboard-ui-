import React, { useState } from 'react';
import './QMSDashboard.css';
import { useNavigate } from 'react-router-dom';

const QMSDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [selectedPlant, setSelectedPlant] = useState('Plant-1');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Plant-1 Reports (15)
  const plant1Reports = [
    { id: 1, name: 'Management Review Report', code: 'AO/MR/PR/03', status: 'updated', lastUpdate: '25-Dec-2025', nextDue: '25-Mar-2026', frequency: 'Quarterly', department: 'Quality' },
    { id: 2, name: 'Control of Monitoring & Measuring Devices', code: 'AO-CAL-PR-01-00', status: 'updated', lastUpdate: '28-Dec-2025', nextDue: '28-Jan-2026', frequency: 'Monthly', department: 'Quality' },
    { id: 3, name: 'Storage and Preservation Report', code: 'AO-ST-PR-01', status: 'pending', lastUpdate: '15-Dec-2025', nextDue: '15-Jan-2026', frequency: 'Monthly', department: 'Store' },
    { id: 4, name: 'Machine Maintenance Report', code: 'AO/MM/PR/01', status: 'updated', lastUpdate: '22-Dec-2025', nextDue: '22-Jan-2026', frequency: 'Monthly', department: 'Maintenance' },
    { id: 5, name: 'Internal Audit Programme Report', code: 'A0-MR-PR-02', status: 'updated', lastUpdate: '20-Dec-2025', nextDue: '20-Mar-2026', frequency: 'Quarterly', department: 'Quality' },
    { id: 6, name: 'Improvement & Corrective Action Report', code: 'A0-MR-PR-04', status: 'updated', lastUpdate: '27-Dec-2025', nextDue: '27-Jan-2026', frequency: 'Monthly', department: 'Quality' },
    { id: 7, name: 'Advanced Product Quality Planning', code: 'AO-APQP-PR-01', status: 'overdue', lastUpdate: '01-Dec-2025', nextDue: '01-Jan-2026', frequency: 'Monthly', department: 'Production' },
    { id: 8, name: 'Safety Compliance Report', code: 'AO-HR-PR-01', status: 'updated', lastUpdate: '29-Dec-2025', nextDue: '29-Jan-2026', frequency: 'Monthly', department: 'HR' },
    { id: 9, name: 'Control of Documents and Records', code: 'AO/MR/PR/01', status: 'updated', lastUpdate: '26-Dec-2025', nextDue: '26-Jan-2026', frequency: 'Monthly', department: 'Quality' },
    { id: 10, name: 'Release of Products - Inspection & Testing', code: 'AO-QC-PR-01', status: 'updated', lastUpdate: '30-Dec-2025', nextDue: '30-Jan-2026', frequency: 'Monthly', department: 'Quality' },
    { id: 11, name: 'Control of Non-conforming Product', code: 'AO-QC-PR-02', status: 'updated', lastUpdate: '24-Dec-2025', nextDue: '24-Jan-2026', frequency: 'Monthly', department: 'Quality' },
    { id: 12, name: 'Purchasing & Supplier Quality Report', code: 'AO/SUP/PR/01', status: 'updated', lastUpdate: '23-Dec-2025', nextDue: '23-Jan-2026', frequency: 'Monthly', department: 'Purchase' },
    { id: 13, name: 'Competence, Training and Motivation', code: 'AO-TR-PR-01', status: 'updated', lastUpdate: '18-Dec-2025', nextDue: '18-Mar-2026', frequency: 'Quarterly', department: 'HR' },
    { id: 14, name: 'Tool Maintenance Report', code: 'AO-TM-PR-01', status: 'pending', lastUpdate: '12-Dec-2025', nextDue: '12-Jan-2026', frequency: 'Monthly', department: 'Maintenance' },
    { id: 15, name: 'Quality Objectives & KPI Report', code: 'AOT-F-KPI-03', status: 'updated', lastUpdate: '21-Dec-2025', nextDue: '21-Mar-2026', frequency: 'Quarterly', department: 'Quality' }
  ];

  // Plant-2 Reports (15)
  const plant2Reports = [
    { id: 16, name: 'Management Review Report', code: 'AO/MR/PR/03', status: 'updated', lastUpdate: '26-Dec-2025', nextDue: '26-Mar-2026', frequency: 'Quarterly', department: 'Quality' },
    { id: 17, name: 'Control of Monitoring & Measuring Devices', code: 'AO-CAL-PR-01-00', status: 'updated', lastUpdate: '20-Dec-2025', nextDue: '20-Jan-2026', frequency: 'Monthly', department: 'Quality' },
    { id: 18, name: 'Storage and Preservation Report', code: 'AO-ST-PR-01', status: 'updated', lastUpdate: '28-Dec-2025', nextDue: '28-Jan-2026', frequency: 'Monthly', department: 'Store' },
    { id: 19, name: 'Machine Maintenance Report', code: 'AO/MM/PR/01', status: 'updated', lastUpdate: '22-Dec-2025', nextDue: '22-Jan-2026', frequency: 'Monthly', department: 'Maintenance' },
    { id: 20, name: 'Internal Audit Programme Report', code: 'A0-MR-PR-02', status: 'updated', lastUpdate: '19-Dec-2025', nextDue: '19-Mar-2026', frequency: 'Quarterly', department: 'Quality' },
    { id: 21, name: 'Improvement & Corrective Action Report', code: 'A0-MR-PR-04', status: 'pending', lastUpdate: '10-Dec-2025', nextDue: '10-Jan-2026', frequency: 'Monthly', department: 'Quality' },
    { id: 22, name: 'Advanced Product Quality Planning', code: 'AO-APQP-PR-01', status: 'updated', lastUpdate: '24-Dec-2025', nextDue: '24-Jan-2026', frequency: 'Monthly', department: 'Production' },
    { id: 23, name: 'Safety Compliance Report', code: 'AO-HR-PR-01', status: 'updated', lastUpdate: '30-Dec-2025', nextDue: '30-Jan-2026', frequency: 'Monthly', department: 'HR' },
    { id: 24, name: 'Control of Documents and Records', code: 'AO/MR/PR/01', status: 'updated', lastUpdate: '27-Dec-2025', nextDue: '27-Jan-2026', frequency: 'Monthly', department: 'Quality' },
    { id: 25, name: 'Release of Products - Inspection & Testing', code: 'AO-QC-PR-01', status: 'pending', lastUpdate: '14-Dec-2025', nextDue: '14-Jan-2026', frequency: 'Monthly', department: 'Quality' },
    { id: 26, name: 'Control of Non-conforming Product', code: 'AO-QC-PR-02', status: 'updated', lastUpdate: '25-Dec-2025', nextDue: '25-Jan-2026', frequency: 'Monthly', department: 'Quality' },
    { id: 27, name: 'Purchasing & Supplier Quality Report', code: 'AO/SUP/PR/01', status: 'updated', lastUpdate: '21-Dec-2025', nextDue: '21-Jan-2026', frequency: 'Monthly', department: 'Purchase' },
    { id: 28, name: 'Competence, Training and Motivation', code: 'AO-TR-PR-01', status: 'updated', lastUpdate: '17-Dec-2025', nextDue: '17-Mar-2026', frequency: 'Quarterly', department: 'HR' },
    { id: 29, name: 'Tool Maintenance Report', code: 'AO-TM-PR-01', status: 'pending', lastUpdate: '08-Dec-2025', nextDue: '08-Jan-2026', frequency: 'Monthly', department: 'Maintenance' },
    { id: 30, name: 'Quality Objectives & KPI Report', code: 'AOT-F-KPI-03', status: 'updated', lastUpdate: '23-Dec-2025', nextDue: '23-Mar-2026', frequency: 'Quarterly', department: 'Quality' }
  ];

  const currentReports = selectedPlant === 'Plant-1' ? plant1Reports : plant2Reports;
  
  const getStatusInfo = (status) => {
    switch(status) {
      case 'updated':
        return { color: '#10b981', bg: '#d1fae5', label: 'Updated', icon: '✓' };
      case 'pending':
        return { color: '#f59e0b', bg: '#fef3c7', label: 'Pending', icon: '⏳' };
      case 'overdue':
        return { color: '#ef4444', bg: '#fee2e2', label: 'Overdue', icon: '⚠' };
      default:
        return { color: '#6b7280', bg: '#f3f4f6', label: 'Unknown', icon: '?' };
    }
  };

  const filteredReports = currentReports.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: currentReports.length,
    updated: currentReports.filter(r => r.status === 'updated').length,
    pending: currentReports.filter(r => r.status === 'pending').length,
    overdue: currentReports.filter(r => r.status === 'overdue').length
  };

  // Navigation handler
  const handleViewReport = (reportId) => {
    navigate(`/qms/report/${reportId}`);
  };

  return (
    <div className="qms-system-dashboard">
      {/* Professional Header with Logo */}
      <header className="qms-system-header">
        <div className="qms-system-container">
          <div className="header-content-wrapper">
            <div className="brand-section">
              <div className="logo-container">
                <img 
                  src="/images/atomone-logo.jpg" 
                  alt="ATOM ONE Logo" 
                  className="company-logo-img"
                />
              </div>
              <div className="brand-info">
                <h1 className="brand-title">Quality Management System</h1>
                <p className="brand-subtitle">ISO 9001:2015 & IATF 16949 CERTIFIED</p>
              </div>
            </div>
            <div className="compliance-badge">
              <div className="badge-label">COMPLIANCE STANDARD</div>
              <div className="badge-value">IATF 16949 & ISO 9001:2015</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="qms-system-main">
        <div className="qms-system-container">
          
          {/* Stats Cards */}
          <section className="qms-stats-enhanced">
            <div className="stat-card-enhanced stat-total">
              <div className="stat-icon-wrapper">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="stat-info-wrapper">
                <div className="stat-number">{stats.total}</div>
                <div className="stat-label">Total Reports</div>
              </div>
            </div>

            <div className="stat-card-enhanced stat-updated">
              <div className="stat-icon-wrapper">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-info-wrapper">
                <div className="stat-number">{stats.updated}</div>
                <div className="stat-label">Updated</div>
              </div>
            </div>

            <div className="stat-card-enhanced stat-pending">
              <div className="stat-icon-wrapper">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="stat-info-wrapper">
                <div className="stat-number">{stats.pending}</div>
                <div className="stat-label">Pending</div>
              </div>
            </div>

            <div className="stat-card-enhanced stat-overdue">
              <div className="stat-icon-wrapper">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="stat-info-wrapper">
                <div className="stat-number">{stats.overdue}</div>
                <div className="stat-label">Overdue</div>
              </div>
            </div>
          </section>

          {/* Plant Controls */}
          <section className="plant-controls-enhanced">
            <div className="plant-tabs-wrapper">
              <button
                className={`plant-tab-enhanced ${selectedPlant === 'Plant-1' ? 'active' : ''}`}
                onClick={() => setSelectedPlant('Plant-1')}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Plant 1</span>
              </button>
              <button
                className={`plant-tab-enhanced ${selectedPlant === 'Plant-2' ? 'active' : ''}`}
                onClick={() => setSelectedPlant('Plant-2')}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Plant 2</span>
              </button>
            </div>

            <div className="search-view-controls">
              <div className="search-wrapper-enhanced">
                <svg className="search-icon-enhanced" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by report name, code, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input-enhanced"
                />
              </div>

              <div className="view-mode-toggle">
                <button 
                  className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
                  </svg>
                </button>
                <button 
                  className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                  </svg>
                </button>
              </div>
            </div>
          </section>

          {/* Reports Section */}
          <section className="reports-content-enhanced">
            <div className="section-title-wrapper">
              <h2>{selectedPlant} Quality Reports</h2>
              <span className="report-count-badge">{filteredReports.length} Reports</span>
            </div>

            <div className={`reports-${viewMode}-enhanced`}>
              {filteredReports.map(report => {
                const statusInfo = getStatusInfo(report.status);
                return (
                  <div key={report.id} className="report-card-qms">
                    <div className="card-header-qms">
                      <div className="report-icon-qms">
                        <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="status-badge-qms" style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}>
                        <span className="status-icon-qms">{statusInfo.icon}</span>
                        <span>{statusInfo.label}</span>
                      </div>
                    </div>

                    <div className="card-body-qms">
                      <h3 className="report-name-qms">{report.name}</h3>
                      <div className="report-code-qms">{report.code}</div>
                      
                      <div className="report-tags-qms">
                        <span className="tag-qms tag-department">
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {report.department}
                        </span>
                        <span className="tag-qms tag-frequency">
                          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {report.frequency}
                        </span>
                      </div>

                      <div className="report-timeline-qms">
                        <div className="timeline-item-qms">
                          <span className="timeline-label-qms">LAST UPDATED</span>
                          <span className="timeline-value-qms">{report.lastUpdate}</span>
                        </div>
                        <div className="timeline-divider-qms"></div>
                        <div className="timeline-item-qms">
                          <span className="timeline-label-qms">NEXT DUE</span>
                          <span className="timeline-value-qms">{report.nextDue}</span>
                        </div>
                      </div>
                    </div>

                    {/* Updated Button with onClick */}
                    <button 
                      className="view-report-btn-qms"
                      onClick={() => handleViewReport(report.id)}
                    >
                      <span>View Report</span>
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>

            {filteredReports.length === 0 && (
              <div className="no-results-qms">
                <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3>No Reports Found</h3>
                <p>Try adjusting your search criteria or select a different plant</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default QMSDashboard;
