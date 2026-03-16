// ============================================================
//  ReworkInspectionReport.jsx
//  Rework Inspection Report — Landscape A4
//  DOC.NO. AOT-F/QA/20
//  Style matches RedBin Attendance Sheet exactly
// ============================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
const atomone = '/logo1.jpg';

const formatDisplay = (dateStr) => {
  if (!dateStr) return '';
  const parts = String(dateStr).split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dateStr;
};

const getTodayDisplay = () => {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const MIN_ROWS = 15;
const DEFAULT_OBS_COUNT = 5; // ← default 5 columns

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
    width: '220px',
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
  mainTable: {
    width: '100%',
    borderCollapse: 'collapse',
    border: '1px solid black',
    tableLayout: 'fixed',
  },
  th: {
    color: '#000',
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
    fontSize: '10px',
    padding: '4px 2px',
    height: '36px',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    lineHeight: '1.2',
    border: '0.1px solid #000',
    textAlign: 'center',
    verticalAlign: 'middle',
  },
  td: {
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
  tdEven: {
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
  remarkRow: {
    border: '1px solid black',
    display: 'flex',
    alignItems: 'stretch',
    minHeight: '40px',
    backgroundColor: '#fff',
  },
  remarkLabel: {
    color: '#000',
    backgroundColor: '#fff',
    width: '60px',
    borderRight: '1px solid black',
    padding: '6px 8px',
    fontSize: '9px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  remarkValue: {
    color: '#000',
    backgroundColor: '#fff',
    flex: '1',
    padding: '6px 10px',
    fontSize: '10px',
    display: 'flex',
    alignItems: 'center',
  },
  docNoFooter: {
    color: '#000',
    backgroundColor: '#fff',
    width: '130px',
    borderLeft: '1px solid black',
    padding: '6px 10px',
    fontSize: '10px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexShrink: 0,
  },
};

const PRINT_CSS = `
  @page { size: A4 landscape; margin: 6mm; }
  * { margin:0; padding:0; box-sizing:border-box; -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }
  html, body { width:297mm; height:210mm; overflow:hidden; background:white; color:#000; }
  table { width:100%; border-collapse:collapse; border-spacing:0; }
  td, th { border:1px solid black; text-align:center; vertical-align:middle; overflow:hidden; color:#000; }
  .rw-container { padding:0 !important; background:white !important; color:#000 !important; }
  .rw-report {
    display:flex !important; flex-direction:column !important;
    width:285mm !important; height:198mm !important;
    padding:0 !important; margin:0 auto !important;
    gap:2px !important; box-shadow:none !important;
    overflow:hidden !important; background:white !important;
    color:#000 !important;
  }
  .rw-header-table { border:2px solid black; flex:0 0 auto; }
  .rw-logo-cell { width:110px; padding:4px 6px; border-right:2px solid black; text-align:center; background:white; }
  .rw-logo-image { max-width:100%; max-height:40px; object-fit:contain; }
  .rw-title-cell { font-weight:bold; font-size:15px; letter-spacing:1.5px; text-transform:uppercase; color:#000 !important; background:white; }
  .rw-doc-info-cell { width:220px; padding:0; border-left:2px solid black; background:white; }
  .rw-doc-info-cell table { border:none; }
  .rw-doc-info-cell table td { border:none; border-bottom:1px solid black; padding:0 6px; font-size:8px; height:20px; text-align:left; color:#000 !important; background:white; }
  .rw-doc-info-cell table tr:last-child td { border-bottom:none; }
  .rw-doc-label { font-weight:bold; width:60px; border-right:1px solid black !important; background:#c0c0c0 !important; font-size:8px; color:#000 !important; }
  .rw-doc-value { font-size:9px; font-weight:600; color:#000 !important; background:white; }
  .rw-main-table { border:2px solid black; table-layout:fixed; flex:1 1 auto; }
  .rw-main-table th { background:#f5f5f5 !important; font-weight:bold; font-size:7px; padding:1px 1px; height:28px; white-space:normal; word-break:break-word; line-height:1.1; color:#000 !important; }
  .rw-main-table td { font-size:7.5px; padding:0 1px; overflow:hidden; height:22px; color:#000 !important; background:white; }
  .rw-main-table tbody tr:nth-child(even) td { background:#fafafa !important; color:#000 !important; }
  .rw-remark-row { flex:0 0 auto; border:2px solid black; display:flex; align-items:stretch; background:white; }
  .rw-remark-label { width:55px; border-right:1px solid black; padding:4px 8px; font-size:8px; font-weight:bold; display:flex; align-items:center; color:#000 !important; background:white; flex-shrink:0; }
  .rw-remark-value { flex:1; padding:4px 8px; font-size:8px; color:#000 !important; background:white; display:flex; align-items:center; }
  .rw-doc-no-footer { width:120px; border-left:1px solid black; padding:4px 8px; font-size:8px; font-weight:bold; display:flex; align-items:center; justify-content:flex-end; color:#000 !important; background:white; flex-shrink:0; }
`;

// ══════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════
const Reworkrepairprint = ({ items = [], currentReport, onEditForm, onBack }) => {
  const navigate = useNavigate();
  const reportDate = getTodayDisplay();

  const TOTAL_ROWS = Math.max(MIN_ROWS, items.length);

  // ─────────────────────────────────────────────────────────────
  // DYNAMIC OBS COLUMNS
  // Priority 1: currentReport.obs_count  (set from backend form)
  // Priority 2: detect from items data   (max obs_N key found)
  // Priority 3: DEFAULT_OBS_COUNT = 5
  // ─────────────────────────────────────────────────────────────
  const obsCount = (() => {
    // Check if backend explicitly sent obs_count
    const fromReport = parseInt(currentReport?.obs_count, 10);
    if (!isNaN(fromReport) && fromReport > 0) return fromReport;

    // Auto-detect from items: find highest obs_N key that has data
    let maxObs = 0;
    items.forEach(row => {
      if (!row) return;
      Object.keys(row).forEach(key => {
        const match = key.match(/^obs_(\d+)$/);
        if (match) {
          const n = parseInt(match[1], 10);
          if (row[key] !== '' && row[key] != null && n > maxObs) maxObs = n;
        }
      });
    });
    if (maxObs > 0) return maxObs;

    return DEFAULT_OBS_COUNT;
  })();

  const OBS_COLS = Array.from({ length: obsCount }, (_, i) => i + 1);

  // obs columns take remaining width after fixed columns
  // Fixed cols total ~54%, obs gets 40%, inspected 6%
  const obsColWidth = (40 / obsCount).toFixed(2);

  const HEADER_H  = 64;
  const THEAD_H   = 40;
  const REMARK_H  = 50;
  const GAPS      = 10;
  const PAGE_H_PX = 762;
  const rowH = Math.max(24, Math.floor((PAGE_H_PX - HEADER_H - THEAD_H - REMARK_H - GAPS) / TOTAL_ROWS));

  const handlePrint = () => {
    const reportEl = document.getElementById('rework-print-area');
    if (!reportEl) return;
    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    printWindow.document.write(`
      <!DOCTYPE html><html>
      <head>
        <meta charset="utf-8"/>
        <title>Rework Inspection Report</title>
        <style>${PRINT_CSS}</style>
      </head>
      <body>
        ${reportEl.outerHTML}
        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); setTimeout(function() { window.close(); }, 500); }, 300);
          };
        </script>
      </body></html>
    `);
    printWindow.document.close();
  };

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <div style={S.container} className="rw-container">

      {/* ── Top Bar ── */}
      <div style={S.topBar} className="no-print">
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
      <div className="rw-report" id="rework-print-area" style={S.report}>

        {/* HEADER */}
        <table style={S.headerTable} className="rw-header-table">
          <tbody>
            <tr>
              {/* LOGO */}
              <td style={S.logoCell} className="rw-logo-cell">
                <img src={atomone} alt="ATOM ONE" style={S.logoImage} className="rw-logo-image" />
              </td>

              {/* TITLE */}
              <td style={S.titleCell} className="rw-title-cell">
                REWORK INSPECTION REPORT
              </td>

              {/* DOC INFO */}
              <td style={S.docInfoCell} className="rw-doc-info-cell">
                <table style={S.docInfoInnerTable}>
                  <tbody>
                    <tr>
                      <td style={{ ...S.docInfoTd, ...S.docLabel }} className="rw-doc-label">Doc.no.</td>
                      <td style={{ ...S.docInfoTd, ...S.docValue }} className="rw-doc-value">
                        {currentReport?.doc_no || 'AOT-F/QA/20'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ ...S.docInfoTd, ...S.docLabel }} className="rw-doc-label">Rev.no.</td>
                      <td style={{ ...S.docInfoTd, ...S.docValue }} className="rw-doc-value">
                        {currentReport?.rev_no || '00'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ ...S.docInfoTdLast, ...S.docLabel }} className="rw-doc-label">Date</td>
                      <td style={{ ...S.docInfoTdLast, ...S.docValue }} className="rw-doc-value">
                        {formatDisplay(currentReport?.doc_date) || reportDate}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        {/* MAIN TABLE */}
        <table style={S.mainTable} className="rw-main-table">
          <colgroup>
            <col style={{ width: '3%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '6%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '6%' }} />
            <col style={{ width: '4%' }} />
            <col style={{ width: '4%' }} />
            {OBS_COLS.map(c => (
              <col key={c} style={{ width: `${obsColWidth}%` }} />
            ))}
            <col style={{ width: '6%' }} />
          </colgroup>
          <thead>
            <tr>
              <th style={S.th} rowSpan={2}>SR.<br />NO.</th>
              <th style={S.th} rowSpan={2}>PART NAME /<br />PART NO.</th>
              <th style={S.th} rowSpan={2}>SPEC.</th>
              <th style={S.th} rowSpan={2}>DETAILS OF NON<br />CONFORMANCE</th>
              <th style={S.th} rowSpan={2}>REWORK<br />QTY.</th>
              <th style={S.th} rowSpan={2}>OK</th>
              <th style={S.th} rowSpan={2}>NOT<br />OK</th>
              <th style={{ ...S.th, backgroundColor: '#eeeeee' }} colSpan={obsCount}>
                OBSERVATIONS AFTER REWORK
              </th>
              <th style={S.th} rowSpan={2}>INSPECTED<br />BY</th>
            </tr>
            <tr>
              {OBS_COLS.map(c => (
                <th key={c} style={{ ...S.th, height: '20px', fontSize: '9px' }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: TOTAL_ROWS }, (_, i) => {
              const row    = items[i] || null;
              const isEven = (i + 1) % 2 === 0;
              const tdStyle = isEven ? S.tdEven : S.td;
              return (
                <tr key={i} style={{ height: `${rowH}px` }}>
                  <td style={{ ...tdStyle, fontWeight: '600', fontSize: '10px', color: '#000' }}>{i + 1}</td>
                  <td style={{ ...tdStyle, textAlign: 'left', paddingLeft: '4px', fontSize: '9px', color: '#000' }}>
                    {row?.part_name || ''}
                  </td>
                  <td style={{ ...tdStyle, fontSize: '9px', color: '#000' }}>{row?.spec || ''}</td>
                  <td style={{ ...tdStyle, textAlign: 'left', paddingLeft: '4px', fontSize: '9px', color: '#000' }}>
                    {row?.non_conformance || ''}
                  </td>
                  <td style={{ ...tdStyle, fontSize: '9px', color: '#000' }}>{row?.rework_qty || ''}</td>
                  <td style={{ ...tdStyle, fontSize: '9px', color: '#000' }}>{row?.ok || ''}</td>
                  <td style={{ ...tdStyle, fontSize: '9px', color: '#000' }}>{row?.not_ok || ''}</td>
                  {OBS_COLS.map(c => (
                    <td key={c} style={{ ...tdStyle, fontSize: '9px', color: '#000' }}>
                      {row?.[`obs_${c}`] || ''}
                    </td>
                  ))}
                  <td style={{ ...tdStyle, fontSize: '9px', color: '#000' }}>{row?.inspected_by || ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* REMARK ROW */}
        <div style={S.remarkRow} className="rw-remark-row">
          <div style={S.remarkLabel} className="rw-remark-label">REMARK :</div>
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

export default Reworkrepairprint;