// ============================================================
//  RedBin_Attendance.js
//  Red Bin Attendance Sheet — Landscape A4
//  DOC.NO. AOT-F-QC-05
//  Logic: Days change automatically based on selected month/year
//  CSS: Fully inlined — no external CSS file needed
//  FIX: color: '#000' added to all styles to prevent dark mode override
// ============================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const atomone = '/logo1.jpg';

const formatDisplay = (dateStr) => {
  if (!dateStr) return '';
  const parts = String(dateStr).split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dateStr;
};

const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const MIN_ROWS = 12;

const S = {
  container: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    color: '#000',
  },
  report: {
    background: 'white',
    color: '#000',
    maxWidth: '1500px',
    margin: '0 auto',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '10px',
  },
  selectorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#fff',
    padding: '6px 14px',
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
  },
  calIcon: { color: '#1976d2', fontSize: '16px' },
  select: {
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '4px 8px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#1976d2',
    cursor: 'pointer',
  },
  daysLabel: { fontSize: '12px', color: '#666', fontWeight: '600' },
  btnBack: {
    background: '#607d8b', color: '#fff', border: 'none',
    padding: '8px 20px', borderRadius: '6px', fontWeight: 'bold',
    cursor: 'pointer', fontSize: '14px', display: 'flex',
    alignItems: 'center', gap: '6px',
  },
  btnEdit: {
    background: '#ff9800', color: '#fff', border: 'none',
    padding: '8px 20px', borderRadius: '6px', fontWeight: 'bold',
    cursor: 'pointer', fontSize: '14px', display: 'flex',
    alignItems: 'center', gap: '6px',
  },
  btnPrint: {
    background: '#4CAF50', color: '#fff', border: 'none',
    padding: '8px 20px', borderRadius: '6px', fontWeight: 'bold',
    cursor: 'pointer', fontSize: '14px', display: 'flex',
    alignItems: 'center', gap: '6px',
  },
  headerTable: {
    width: '100%',
    borderCollapse: 'collapse',
    border: '1px solid #000',
  },
  logoCell: {
    width: '120px',
    padding: '6px',
    textAlign: 'center',
    border: '0.1px solid #000',
    borderRight: '1px solid black',
    verticalAlign: 'middle',
    backgroundColor: '#fff',
  },
  logoImage: {
    maxWidth: '100%',
    maxHeight: '50px',
    objectFit: 'contain',
  },
  titleCell: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: '20px',
    padding: '0 12px',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    textAlign: 'center',
    border: '0.1px solid #000',
    verticalAlign: 'middle',
    backgroundColor: '#fff',
  },
  docInfoCell: {
    width: '200px',
    padding: '0',
    border: '0.1px solid #000',
    borderLeft: '1px solid black',
    verticalAlign: 'middle',
    backgroundColor: '#fff',
  },
  docInfoInnerTable: {
    width: '100%',
    borderCollapse: 'collapse',
    border: 'none',
  },
  docInfoTd: {
    color: '#000',
    border: 'none',
    borderBottom: '1px solid black',
    padding: '4px 8px',
    fontSize: '10px',
    height: '22px',
    textAlign: 'left',
    verticalAlign: 'middle',
    backgroundColor: '#fff',
  },
  docInfoTdLast: {
    color: '#000',
    border: 'none',
    padding: '4px 8px',
    fontSize: '10px',
    height: '22px',
    textAlign: 'left',
    verticalAlign: 'middle',
    backgroundColor: '#fff',
  },
  docLabel: {
    color: '#000',
    fontWeight: 'bold',
    width: '65px',
    borderRight: '1px solid black',
    backgroundColor: '#c0c0c0',
    fontSize: '10px',
  },
  docValue: {
    color: '#000',
    fontSize: '11px',
    fontWeight: '600',
    backgroundColor: '#fff',
  },
  attTable: {
    width: '100%',
    borderCollapse: 'collapse',
    border: '1px solid black',
    tableLayout: 'fixed',
  },
  attTh: {
    color: '#000',
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
    fontSize: '11px',
    padding: '4px 2px',
    height: '32px',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    lineHeight: '1.2',
    border: '0.1px solid #000',
    textAlign: 'center',
    verticalAlign: 'middle',
  },
  attTd: {
    color: '#000',
    fontSize: '10px',
    padding: '2px',
    height: '30px',
    border: '0.1px solid #000',
    textAlign: 'center',
    verticalAlign: 'middle',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  attTdEven: {
    color: '#000',
    fontSize: '10px',
    padding: '2px',
    height: '30px',
    border: '0.1px solid #000',
    textAlign: 'center',
    verticalAlign: 'middle',
    overflow: 'hidden',
    backgroundColor: '#fafafa',
  },
  legend: {
    color: '#000',
    backgroundColor: '#fff',
    border: '1px solid black',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 30px',
    fontSize: '12px',
    fontWeight: 'bold',
    minHeight: '34px',
  },
  footer: {
    border: '1px solid black',
    display: 'flex',
    alignItems: 'stretch',
    minHeight: '50px',
    backgroundColor: '#fff',
  },
  remarksLabel: {
    color: '#000',
    backgroundColor: '#fff',
    width: '140px',
    borderRight: '1px solid black',
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
  },
  remarksValue: {
    color: '#000',
    backgroundColor: '#fff',
    flex: '1',
    padding: '8px 12px',
    fontSize: '11px',
  },
};

const PRINT_CSS = `
  @page { size: A4 landscape; margin: 6mm; }
  * { margin:0; padding:0; box-sizing:border-box; -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }
  html, body { width:297mm; height:210mm; overflow:hidden; background:white; color:#000; }
  table { width:100%; border-collapse:collapse; border-spacing:0; }
  td, th { border:1px solid black; text-align:center; vertical-align:middle; overflow:hidden; color:#000; }
  .rb-container { padding:0 !important; background:white !important; color:#000 !important; }
  .rb-report {
    display:flex !important; flex-direction:column !important;
    width:285mm !important; height:198mm !important;
    padding:0 !important; margin:0 auto !important;
    gap:2px !important; box-shadow:none !important;
    overflow:hidden !important; background:white !important;
    color:#000 !important;
  }
  .rb-header-table { border:2px solid black; flex:0 0 auto; }
  .rb-logo-cell { width:110px; padding:4px 6px; border-right:2px solid black; text-align:center; background:white; }
  .rb-logo-image { max-width:100%; max-height:40px; object-fit:contain; }
  .rb-title-cell { font-weight:bold; font-size:15px; letter-spacing:1.5px; text-transform:uppercase; color:#000 !important; background:white; }
  .rb-doc-info-cell { width:200px; padding:0; border-left:2px solid black; background:white; }
  .rb-doc-info-cell table { border:none; }
  .rb-doc-info-cell table td { border:none; border-bottom:1px solid black; padding:0 6px; font-size:8px; height:20px; text-align:left; color:#000 !important; background:white; }
  .rb-doc-info-cell table tr:last-child td { border-bottom:none; }
  .rb-doc-label { font-weight:bold; width:60px; border-right:1px solid black !important; background:#c0c0c0 !important; font-size:8px; color:#000 !important; }
  .rb-doc-value { font-size:9px; font-weight:600; color:#000 !important; background:white; }
  .rb-att-table { border:2px solid black; table-layout:fixed; flex:1 1 auto; }
  .rb-att-table th { background:#f5f5f5 !important; font-weight:bold; font-size:7.5px; padding:1px 1px; height:26px; white-space:normal; word-break:break-word; line-height:1.1; color:#000 !important; }
  .rb-att-table td { font-size:8px; padding:0 1px; overflow:hidden; height:26px; color:#000 !important; background:white; }
  .rb-att-table tbody tr:nth-child(even) td { background:#fafafa !important; color:#000 !important; }
  .rb-legend { border:2px solid black; flex:0 0 auto; display:flex; align-items:center; justify-content:space-between; padding:4px 20px; font-size:9px; font-weight:bold; color:#000 !important; background:white; }
  .rb-footer { flex:0 0 auto; border:2px solid black; display:flex; align-items:stretch; background:white; }
  .rb-remarks-label { width:130px; border-right:1px solid black; padding:6px 10px; font-size:10px; font-weight:bold; display:flex; align-items:center; color:#000 !important; background:white; }
  .rb-remarks-value { flex:1; padding:6px 10px; font-size:10px; color:#000 !important; background:white; }
`;

// ══════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════
const RedBinAttendanceprint = ({ items = [], currentReport, onFilter, onEditForm, onBack }) => {
  const navigate = useNavigate();

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear,  setSelectedYear]  = useState(today.getFullYear());
  const [remarks,       setRemarks]       = useState(currentReport?.remarks || '');

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const dayColumns  = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const empItems = items
    .filter(x => x.sr_no >= 1)
    .sort((a, b) => a.sr_no - b.sr_no);
  const TOTAL_ROWS = Math.max(MIN_ROWS, empItems.length);

  const HEADER_H  = 64;
  const THEAD_H   = 32;
  const LEGEND_H  = 32;
  const FOOTER_H  = 52;
  const GAPS      = 10;
  const PAGE_H_PX = 762;
  const rowH = Math.max(28, Math.floor((PAGE_H_PX - HEADER_H - THEAD_H - LEGEND_H - FOOTER_H - GAPS) / TOTAL_ROWS));

  const yearOptions = Array.from({ length: 11 }, (_, i) => today.getFullYear() - 5 + i);

  const handlePrint = () => {
    const reportEl = document.getElementById('redbin-print-area');
    if (!reportEl) return;
    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    printWindow.document.write(`
      <!DOCTYPE html><html>
      <head>
        <meta charset="utf-8"/>
        <title>Red Bin Attendance Sheet</title>
        <style>${PRINT_CSS}</style>
      </head>
      <body>
        ${reportEl.outerHTML}
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); setTimeout(function() { window.close(); }, 500); }, 300);
          };
        <\/script>
      </body></html>
    `);
    printWindow.document.close();
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div style={S.container}>

      {/* ── Top Bar ── */}
      <div style={S.topBar} className="no-print">

        <div style={S.selectorBox}>
          <i className="bi bi-calendar3" style={S.calIcon}></i>
          <select value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} style={S.select}>
            {MONTH_NAMES.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
          </select>
          <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} style={S.select}>
            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <span style={S.daysLabel}>({daysInMonth} days)</span>
        </div>

        <button onClick={handleBack} style={S.btnBack}>
          <i className="bi bi-arrow-left-circle-fill"></i> Back
        </button>

        <button onClick={() => { if (onEditForm) onEditForm(currentReport); }} style={S.btnEdit}>
          <i className="bi bi-pencil-square"></i> Edit
        </button>

        <button onClick={handlePrint} style={S.btnPrint}>
          <i className="bi bi-printer-fill"></i> Print
        </button>
      </div>

      {/* ── Report Area ── */}
      <div className="rb-report" id="redbin-print-area" style={S.report}>

        {/* HEADER */}
        <table style={S.headerTable} className="rb-header-table">
          <tbody>
            <tr>
              <td style={S.logoCell} className="rb-logo-cell">
                <img src={atomone} alt="ATOM ONE" style={S.logoImage} className="rb-logo-image" />
              </td>
              <td style={S.titleCell} className="rb-title-cell">
                RED BIN ATTENDANCE SHEET
              </td>
              <td style={S.docInfoCell} className="rb-doc-info-cell">
                <table style={S.docInfoInnerTable}>
                  <tbody>
                    <tr>
                      <td style={{ ...S.docInfoTd, ...S.docLabel }} className="rb-doc-label">Doc.no.</td>
                      <td style={{ ...S.docInfoTd, ...S.docValue }} className="rb-doc-value">
                        {currentReport?.doc_no || 'AOT-F-QC-05'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ ...S.docInfoTd, ...S.docLabel }} className="rb-doc-label">Rev.no.</td>
                      <td style={{ ...S.docInfoTd, ...S.docValue }} className="rb-doc-value">
                        {currentReport?.rev_no || '00'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ ...S.docInfoTdLast, ...S.docLabel }} className="rb-doc-label">Date</td>
                      <td style={{ ...S.docInfoTdLast, ...S.docValue }} className="rb-doc-value">
                        {formatDisplay(currentReport?.doc_date) || '14.10.2024'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        {/* ATTENDANCE TABLE */}
        <table style={S.attTable} className="rb-att-table">
          <colgroup>
            <col style={{ width: '3%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '7%' }} />
            {dayColumns.map(d => (
              <col key={d} style={{ width: `${(82 / daysInMonth).toFixed(2)}%` }} />
            ))}
          </colgroup>
          <thead>
            <tr style={{ height: `${THEAD_H}px` }}>
              <th style={S.attTh}>Sr.No.</th>
              <th style={S.attTh}>Name</th>
              <th style={S.attTh}>DESIGNATION</th>
              {dayColumns.map(d => (
                <th key={d} style={S.attTh}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: TOTAL_ROWS }, (_, i) => {
              const row    = empItems[i] || null;
              const isEven = (i + 1) % 2 === 0;
              const tdStyle = isEven ? S.attTdEven : S.attTd;
              return (
                <tr key={i} style={{ height: `${rowH}px` }}>
                  <td style={{ ...tdStyle, fontWeight: '600', fontSize: '10px', color: '#000' }}>{i + 1}</td>
                  <td style={{ ...tdStyle, textAlign: 'left', paddingLeft: '6px', fontWeight: row?.name ? '600' : '400', fontSize: '10px', color: '#000' }}>
                    {row?.name || ''}
                  </td>
                  <td style={{ ...tdStyle, fontSize: '9px', color: '#000' }}>{row?.designation || ''}</td>
                  {dayColumns.map(d => (
                    <td key={d} style={{ ...tdStyle, fontSize: '9px', color: '#000' }}>
                      {row?.[`day_${d}`] || ''}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* LEGEND */}
        <div style={S.legend} className="rb-legend">
          <span>P &nbsp;: &nbsp;Present</span>
          <span>A &nbsp;: &nbsp;Absent</span>
          <span>Month &nbsp;: &nbsp;<strong>{MONTH_NAMES[selectedMonth - 1]} {selectedYear}</strong></span>
        </div>

        {/* FOOTER */}
        <div style={S.footer} className="rb-footer">
          <div style={S.remarksLabel} className="rb-remarks-label">Remarks</div>
          <div style={S.remarksValue} className="rb-remarks-value">
            {currentReport?.remarks || remarks}
          </div>
        </div>

      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          ${PRINT_CSS}
        }
      `}</style>
    </div>
  );
};

export default RedBinAttendanceprint;