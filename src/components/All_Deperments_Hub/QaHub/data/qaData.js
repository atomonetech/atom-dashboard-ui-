// export const dailyReports = [
//     { id: 1, title: 'Incoming Material Insp.', formNo: 'AOT/F/QA/01', resp: 'Quality Engineer', icon: 'bi-box-seam', color: '#3b82f6', bg: '#eff6ff', fillRoute: 'Incoming-Material', printKey: 'incomingmaterial-report' },
//     { id: 2, title: 'Red Bin Analysis - NC Reg.', formNo: 'AOT/F/QC/02', resp: 'CFT', icon: 'bi-trash3', color: '#ef4444', bg: '#fef2f2', fillRoute: 'RedBin-Form', printKey: 'redbin-analysis-report' },
//     { id: 3, title: 'Scrap Note', formNo: 'AOT/F/QC/04', resp: 'Quality Engineer', icon: 'bi-file-earmark-x', color: '#ef4444', bg: '#fef2f2', fillRoute: 'Scrap-Note', printKey: 'scrap-note-report' },
//     { id: 4, title: 'Red Bin Attendance Sheet', formNo: 'AOT/F/QC/05', resp: 'Quality Engineer', icon: 'bi-person-x', color: '#f59e0b', bg: '#fef3c7', fillRoute: 'Redbin-Attendance', printKey: 'redbin-attendance-report' },
//     { id: 5, title: 'Daily Poka Yokes Check', formNo: 'AOT/F/QC/07A', resp: 'Operator', icon: 'bi-shield-check', color: '#10b981', bg: '#d1fae5', fillRoute: 'Poka-Yoke', printKey: 'PokaYoke-report' },
//     { id: 7, title: 'Set up & Patrol Insp. (FPIR)', formNo: 'AOT/F/QA/15', resp: 'Quality Engineer', icon: 'bi-clipboard-check', color: '#06b6d4', bg: '#cffafe', fillRoute: 'inspection-form', printKey: 'inspection-report' },
//     { id: 8, title: 'Rework / Repair Report', formNo: 'AOT/F/QA/20', resp: 'Rework Operator', icon: 'bi-tools', color: '#f59e0b', bg: '#fef3c7', fillRoute: 'Rework', printKey: 'rework-report' },
//     { id: 9, title: 'Sample Inspection Report', formNo: 'AOT/F/QA/21', resp: 'Quality Engineer', icon: 'bi-search', color: '#3b82f6', bg: '#eff6ff', fillRoute: 'sample-inspection', printKey: 'sample-inspection-report' },
//     { id: 10, title: 'Deviation Approval Form', formNo: 'AOT/F/PROD/04', resp: 'Production Engineer', icon: 'bi-file-earmark-check', color: '#8b5cf6', bg: '#ede9fe', fillRoute: 'Deviation-Approval-Form', printKey: 'Deviation-report' },
//     { id: 12, title: 'Goods Receipt Note (GRN)', formNo: 'Not Reqd.', resp: 'Store Incharge', icon: 'bi-receipt', color: '#06b6d4', bg: '#cffafe', fillRoute: 'Good-Receipt', printKey: null },
//     { id: 13, title: 'Pre Dispatch Insp. (PDIR)', formNo: 'AOT/F/QA/40', resp: 'Quality Engineer', icon: 'bi-truck', color: '#10b981', bg: '#d1fae5', fillRoute: 'pdi-report-form', printKey: 'pdiprint-report' },
// ];

// export const monthlyReports = [
//     { id: 101, title: 'CA / PA - 8D Report', formNo: 'AOT/F/QC/01', icon: 'bi-patch-check', color: '#ef4444', bg: '#fef2f2', fillRoute: '8d-report' },
//     { id: 102, title: 'Process Audit Checksheet', formNo: 'AOT/F/QA/02', icon: 'bi-gear-wide-connected', color: '#3b82f6', bg: '#eff6ff', fillRoute: 'process-audit' },
//     { id: 103, title: 'Coherence Checklist', formNo: 'AOT/F/QA/03', icon: 'bi-list-check', color: '#10b981', bg: '#d1fae5', fillRoute: 'coherence-checklist' },
//     { id: 104, title: 'Layout Inspection Report', formNo: 'AOT/F/QA/06A', icon: 'bi-rulers', color: '#f59e0b', bg: '#fef3c7', fillRoute: 'layout-report' },
//     { id: 105, title: 'Product Audit Checksheet', formNo: 'AOT/F/QA/07A', icon: 'bi-box-seam', color: '#ec4899', bg: '#fce7f3', fillRoute: 'product-audit' },
//     { id: 106, title: 'Pareto Analysis', formNo: 'AOT/F/QC/07', icon: 'bi-bar-chart-line', color: '#6366f1', bg: '#e0e7ff', fillRoute: 'pareto-analysis' },
//     { id: 107, title: 'Customer Specific Req.', formNo: 'AOT/F/QA/16', icon: 'bi-person-badge', color: '#06b6d4', bg: '#cffafe', fillRoute: 'customer-req' },
//     { id: 108, title: 'Improvement / Suggestion', formNo: 'AOT/F/QA/17', icon: 'bi-lightbulb', color: '#f59e0b', bg: '#fef3c7', fillRoute: 'suggestions' },
//     { id: 109, title: 'Customer Complaint Reg.', formNo: 'AOT-F-CC-02', icon: 'bi-exclamation-octagon', color: '#ef4444', bg: '#fef2f2', fillRoute: 'complaint-reg' },
//     { id: 110, title: 'Minutes of Meetings', formNo: 'AOT/F/QA/19', icon: 'bi-people', color: '#8b5cf6', bg: '#ede9fe', fillRoute: 'mom' },
//     { id: 111, title: 'Warranty Claim Register', formNo: 'AOT/F/QA/22', icon: 'bi-shield-check', color: '#10b981', bg: '#d1fae5', fillRoute: 'warranty-reg' },
//     { id: 112, title: 'B O Quality Plan', formNo: 'AOT/F/QA/23', icon: 'bi-clipboard-data', color: '#3b82f6', bg: '#eff6ff', fillRoute: 'bo-quality-plan' },
//     { id: 113, title: 'COPQ Guideline', formNo: 'AOT/F/QA/24', icon: 'bi-currency-dollar', color: '#ef4444', bg: '#fef2f2', fillRoute: 'copq' },
//     { id: 114, title: 'Control Plan', formNo: 'AOT-F-NPD-14', icon: 'bi-layers', color: '#6366f1', bg: '#e0e7ff', fillRoute: 'control-plan' },
//     { id: 115, title: 'Process Capability Study', formNo: 'AOT-F-NPD-22', icon: 'bi-graph-up-arrow', color: '#10b981', bg: '#d1fae5', fillRoute: 'cp-cpk' },
//     { id: 116, title: 'Supplier Part List', formNo: 'NOT REQD', icon: 'bi-truck', color: '#06b6d4', bg: '#cffafe', fillRoute: 'supplier-list' },
//     { id: 117, title: 'Gauge Validation Report', formNo: 'AOT/F/QA/10', icon: 'bi-check2-all', color: '#3b82f6', bg: '#eff6ff', fillRoute: 'gauge-validation' },
//     { id: 118, title: 'Customer Satisfaction Card', formNo: 'AOT/F/QA/29', icon: 'bi-emoji-smile', color: '#ec4899', bg: '#fce7f3', fillRoute: 'customer-satisfaction' },
//     { id: 119, title: 'Visual Inspection Std.', formNo: 'AOT-WI-QA', icon: 'bi-eye', color: '#8b5cf6', bg: '#ede9fe', fillRoute: 'visual-std' },
//     { id: 120, title: 'Work Instruction', formNo: 'AOT-F-WI-06', icon: 'bi-file-earmark-text', color: '#f59e0b', bg: '#fef3c7', fillRoute: 'work-instruction' },
//     { id: 121, title: 'MSA Report', formNo: 'AOT-F-NPD-21', icon: 'bi-microscope', color: '#6366f1', bg: '#e0e7ff', fillRoute: 'msa-report' }
// ];

// export const yearlyReports = [
//     { id: 201, title: "Annual Layout Inspection Plan", formNo: "AOT/F/QA/D/02A", icon: "bi-calendar-check", color: '#64748b', bg: '#f1f5f9', fillRoute: 'layout-plan' },
//     { id: 202, title: "Sampling Plan", formNo: "AOT/F/QA/04", icon: "bi-clipboard-data", color: '#3b82f6', bg: '#eff6ff', fillRoute: 'sampling-plan' },
//     { id: 203, title: "List of Poka yoke", formNo: "AOT/F/QC/06", icon: "bi-shield-shaded", color: '#10b981', bg: '#d1fae5', fillRoute: 'poka-yoke-list' },
//     { id: 204, title: "Customer Satisfaction Survey", formNo: "AOT/F/QA/18", icon: "bi-emoji-smile", color: '#ec4899', bg: '#fce7f3', fillRoute: 'customer-survey' },
//     { id: 205, title: "Cp / Cpk Plan", formNo: "AOT/F/SPC/01", icon: "bi-graph-up-arrow", color: '#6366f1', bg: '#e0e7ff', fillRoute: 'cp-cpk-plan' },
//     { id: 206, title: "Product Audit Plan", formNo: "AOT/F/QA/26", icon: "bi-box-seam", color: '#06b6d4', bg: '#cffafe', fillRoute: 'product-audit-plan' },
//     { id: 207, title: "Process Audit Plan", formNo: "AOT/F/QA/27", icon: "bi-gear-wide-connected", color: '#8b5cf6', bg: '#ede9fe', fillRoute: 'process-audit-plan' },
//     { id: 208, title: "List of checking Fixture", formNo: "AOT/F/QA/28", icon: "bi-tools", color: '#f59e0b', bg: '#fef3c7', fillRoute: 'fixture-list' },
   
// ];




export const dailyReports = [
    { id: 1, title: 'Incoming Material Insp.', formNo: 'AOT/F/QA/01', resp: 'Quality Engineer', icon: 'bi-box-seam', color: '#3b82f6', bg: '#eff6ff', fillRoute: 'Incoming-Material', printKey: 'incomingmaterial-report', viewKey: 'incoming-material-view', isLive: false },
    { id: 2, title: 'Red Bin Analysis - NC Reg.', formNo: 'AOT/F/QC/02', resp: 'CFT', icon: 'bi-trash3', color: '#ef4444', bg: '#fef2f2', fillRoute: 'RedBin-Form', printKey: 'redbin-analysis-report', viewKey: 'redbin-view', isLive: true },
    { id: 3, title: 'Scrap Note', formNo: 'AOT/F/QC/04', resp: 'Quality Engineer', icon: 'bi-file-earmark-x', color: '#ef4444', bg: '#fef2f2', fillRoute: 'Scrap-Note', printKey: 'scrap-note-report', viewKey: 'scrap-note-view', isLive: true },
    { id: 4, title: 'Red Bin Attendance Sheet', formNo: 'AOT/F/QC/05', resp: 'Quality Engineer', icon: 'bi-person-x', color: '#f59e0b', bg: '#fef3c7', fillRoute: 'Redbin-Attendance', printKey: 'redbin-attendance-report', viewKey: 'redbin-attendance-view', isLive: true },
    
    { id: 7, title: 'Set up & Patrol Insp. (FPIR)', formNo: 'AOT/F/QA/15', resp: 'Quality Engineer', icon: 'bi-clipboard-check', color: '#06b6d4', bg: '#cffafe', fillRoute: 'inspection-form', printKey: 'inspection-report', viewKey: 'inspection-view', isLive: true },
    { id: 8, title: 'Rework / Repair Report', formNo: 'AOT/F/QA/20', resp: 'Rework Operator', icon: 'bi-tools', color: '#f59e0b', bg: '#fef3c7', fillRoute: 'Rework', printKey: 'rework-report', viewKey: 'rework-view', isLive: true },
    { id: 9, title: 'Sample Inspection Report', formNo: 'AOT/F/QA/21', resp: 'Quality Engineer', icon: 'bi-search', color: '#3b82f6', bg: '#eff6ff', fillRoute: 'sample-inspection', printKey: 'sample-inspection-report', viewKey: 'sample-inspection-view', isLive: false },
    { id: 10, title: 'Deviation Approval Form', formNo: 'AOT/F/PROD/04', resp: 'Production Engineer', icon: 'bi-file-earmark-check', color: '#8b5cf6', bg: '#ede9fe', fillRoute: 'Deviation-Approval-Form', printKey: 'Deviation-report', viewKey: 'deviation-view', isLive: true },
     { id: 11, title: 'RM Quality Plan',            formNo: 'AOT/F/QA/25',   resp: 'Quality Engineer',  icon: 'bi-diagram-3',          color: '#10b981', bg: '#d1fae5', fillRoute: null,  printKey: null, viewKey: null, isLive: false },
    { id: 12, title: 'Goods Receipt Note (GRN)', formNo: 'Not Reqd.', resp: 'Store Incharge', icon: 'bi-receipt', color: '#06b6d4', bg: '#cffafe', fillRoute: 'Good-Receipt', printKey: null, viewKey: 'good-receipt', isLive: true },
    { id: 13, title: 'Pre Dispatch Insp. (PDIR)', formNo: 'AOT/F/QA/40', resp: 'Quality Engineer', icon: 'bi-truck', color: '#10b981', bg: '#d1fae5', fillRoute: 'pdi-report-form', printKey: 'pdiprint-report', viewKey: 'pdi-view', isLive: false },
];

export const monthlyReports = [
    { id: 101, title: 'CA / PA - 8D Report', formNo: 'AOT/F/QC/01', icon: 'bi-patch-check', color: '#ef4444', bg: '#fef2f2', fillRoute: '8d-report', printKey: null, viewKey: null, isLive: false },
    { id: 102, title: 'Process Audit Checksheet', formNo: 'AOT/F/QA/02', icon: 'bi-gear-wide-connected', color: '#3b82f6', bg: '#eff6ff', fillRoute: 'process-audit', printKey: null, viewKey: 'process-audit-view', isLive: true },
    { id: 103, title: 'Coherence Checklist', formNo: 'AOT/F/QA/03', icon: 'bi-list-check', color: '#10b981', bg: '#d1fae5', fillRoute: 'coherence-checklist', printKey: null, viewKey: 'coherence-view', isLive: true },
    { id: 104, title: 'Layout Inspection Report', formNo: 'AOT/F/QA/06A', icon: 'bi-rulers', color: '#f59e0b', bg: '#fef3c7', fillRoute: 'layout-report', printKey: null, viewKey: 'layout-inspection-view', isLive: true },
    { id: 105, title: 'Product Audit Plan', formNo: 'AOT/F/QA/07A', icon: 'bi-box-seam', color: '#ec4899', bg: '#fce7f3', fillRoute: 'product-audit', printKey: null, viewKey: 'product-audit-plan-view', isLive: true },
    { id: 106, title: 'Pareto Analysis', formNo: 'AOT/F/QC/07', icon: 'bi-bar-chart-line', color: '#6366f1', bg: '#e0e7ff', fillRoute: 'pareto-analysis', printKey: null, viewKey: null, isLive: false },
    { id: 107, title: 'Customer Specific Req.', formNo: 'AOT/F/QA/16', icon: 'bi-person-badge', color: '#06b6d4', bg: '#cffafe', fillRoute: 'customer-req', printKey: null, viewKey: null, isLive: false },
    { id: 108, title: 'Improvement / Suggestion', formNo: 'AOT/F/QA/17', icon: 'bi-lightbulb', color: '#f59e0b', bg: '#fef3c7', fillRoute: 'suggestions', printKey: null, viewKey: null, isLive: false},
    { id: 109, title: 'Customer Complaint Reg.', formNo: 'AOT-F-CC-02', icon: 'bi-exclamation-octagon', color: '#ef4444', bg: '#fef2f2', fillRoute: 'complaint-reg', printKey: null, viewKey: 'customer-complaint-view', isLive: true },
    { id: 110, title: 'Minutes of Meetings', formNo: 'AOT/F/QA/19', icon: 'bi-people', color: '#8b5cf6', bg: '#ede9fe', fillRoute: 'mom', printKey: null, viewKey: 'mom-view', isLive: true },
    { id: 111, title: 'Warranty Claim Register', formNo: 'AOT/F/QA/22', icon: 'bi-shield-check', color: '#10b981', bg: '#d1fae5', fillRoute: 'warranty-reg', printKey: null, viewKey: 'warranty-claim-view', isLive: true },
    { id: 112, title: 'B O Quality Plan', formNo: 'AOT/F/QA/23', icon: 'bi-clipboard-data', color: '#3b82f6', bg: '#eff6ff', fillRoute: 'bo-quality-plan', printKey: null, viewKey: null, isLive: false },
    { id: 113, title: 'COPQ Guideline', formNo: 'AOT/F/QA/24', icon: 'bi-currency-dollar', color: '#ef4444', bg: '#fef2f2', fillRoute: 'copq', printKey: null, viewKey: null, isLive: false },
    { id: 114, title: 'Control Plan', formNo: 'AOT-F-NPD-14', icon: 'bi-layers', color: '#6366f1', bg: '#e0e7ff', fillRoute: 'control-plan', printKey: null, viewKey: null, isLive: false },
    { id: 115, title: 'Process Capability Study', formNo: 'AOT-F-NPD-22', icon: 'bi-graph-up-arrow', color: '#10b981', bg: '#d1fae5', fillRoute: 'cp-cpk', printKey: null, viewKey: null, isLive:false },
    { id: 116, title: 'Supplier Part List', formNo: 'NOT REQD', icon: 'bi-truck', color: '#06b6d4', bg: '#cffafe', fillRoute: 'supplier-list', printKey: null, viewKey: null, isLive: false },
    { id: 117, title: 'Gauge Validation Report', formNo: 'AOT/F/QA/10', icon: 'bi-check2-all', color: '#3b82f6', bg: '#eff6ff', fillRoute: 'gauge-validation', printKey: null, viewKey: null, isLive: false},
    { id: 118, title: 'Customer Satisfaction Card', formNo: 'AOT/F/QA/29', icon: 'bi-emoji-smile', color: '#ec4899', bg: '#fce7f3', fillRoute: 'customer-satisfaction', printKey: null, viewKey:'customer-satisfaction-view', isLive: true },
    { id: 119, title: 'Visual Inspection Std.', formNo: 'AOT-WI-QA', icon: 'bi-eye', color: '#8b5cf6', bg: '#ede9fe', fillRoute: 'visual-std', printKey: null, viewKey: null, isLive: false },
    { id: 120, title: 'Work Instruction', formNo: 'AOT-F-WI-06', icon: 'bi-file-earmark-text', color: '#f59e0b', bg: '#fef3c7', fillRoute: 'work-instruction', printKey: null, viewKey: null, isLive: false },
    { id: 121, title: 'MSA Report', formNo: 'AOT-F-NPD-21', icon: 'bi-microscope', color: '#6366f1', bg: '#e0e7ff', fillRoute: 'msa-report', printKey: null, viewKey: null, isLive: false }
];

export const yearlyReports = [
    { id: 201, title: "Annual Layout Inspection Plan", formNo: "AOT/F/QA/D/02A", icon: "bi-calendar-check", color: '#64748b', bg: '#f1f5f9', fillRoute: 'layout-plan', printKey: null, viewKey: null, isLive: false },
    { id: 202, title: "Sampling Plan", formNo: "AOT/F/QA/04", icon: "bi-clipboard-data", color: '#3b82f6', bg: '#eff6ff', fillRoute: 'sampling-plan', printKey: null, viewKey: null, isLive: false },
    { id: 203, title: "List of Poka yoke", formNo: "AOT/F/QC/06", icon: "bi-shield-shaded", color: '#10b981', bg: '#d1fae5', fillRoute: 'poka-yoke-list', printKey: null, viewKey: null, isLive:false},
    { id: 204, title: "Customer Satisfaction Survey", formNo: "AOT/F/QA/18", icon: "bi-emoji-smile", color: '#ec4899', bg: '#fce7f3', fillRoute: 'customer-survey', printKey: null, viewKey: null, isLive:false },
    { id: 205, title: "Cp / Cpk Plan", formNo: "AOT/F/SPC/01", icon: "bi-graph-up-arrow", color: '#6366f1', bg: '#e0e7ff', fillRoute: 'cp-cpk-plan', printKey: null, viewKey: null, isLive: false },
    { id: 206, title: "Product Audit Plan", formNo: "AOT/F/QA/26", icon: "bi-box-seam", color: '#06b6d4', bg: '#cffafe', fillRoute: 'product-audit-plan', printKey: null, viewKey: null, isLive: false },
    { id: 207, title: "Process Audit Plan", formNo: "AOT/F/QA/27", icon: "bi-gear-wide-connected", color: '#8b5cf6', bg: '#ede9fe', fillRoute: 'process-audit-plan', printKey: null, viewKey: null, isLive: false },
    { id: 208, title: "List of checking Fixture", formNo: "AOT/F/QA/28", icon: "bi-tools", color: '#f59e0b', bg: '#fef3c7', fillRoute: 'fixture-list', printKey: null, viewKey: null, isLive: false },
];