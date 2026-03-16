// ============================================================
//  Scrap_Note.js
//  Scrap Note Report — Landscape A4
//  DOC.NO. AOT-F-QC-04
//  CSS: Fully inlined — no external CSS file needed
// ============================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
const atomone = '/logo1.jpg';

// ── Date format helper: "2024-01-15" → "15/01/2024" ──
const formatDisplay = (dateStr) => {
  if (!dateStr) return '';
  const parts = String(dateStr).split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dateStr;
};

const MIN_ROWS = 20;

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
    gap: '4px',
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
    border: '1px solid black',
  },
  logoCell: {
    width: '120px',
    padding: '6px',
    textAlign: 'center',
    border: '1px solid black',
    borderRight: '1px solid black',
    verticalAlign: 'middle',
    backgroundColor: '#fff',
  },
  logoImage: {
    maxWidth: '100%',
    maxHeight: '55px',
    objectFit: 'contain',
  },
  titleCell: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: '22px',
    padding: '0 12px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    textAlign: 'center',
    border: '1px solid black',
    verticalAlign: 'middle',
    backgroundColor: '#fff',
  },
  docInfoCell: {
    width: '220px',
    padding: '0',
    border: '1px solid black',
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
    fontSize: '11px',
    height: '24px',
    textAlign: 'left',
    verticalAlign: 'middle',
    backgroundColor: '#fff',
  },
  docInfoTdLast: {
    color: '#000',
    border: 'none',
    padding: '4px 8px',
    fontSize: '11px',
    height: '24px',
    textAlign: 'left',
    verticalAlign: 'middle',
    backgroundColor: '#fff',
  },
  docLabel: {
    color: '#000',
    fontWeight: 'bold',
    width: '80px',
    borderRight: '1px solid black',
    backgroundColor: '#c0c0c0',
    fontSize: '11px',
  },
  docValue: {
    color: '#000',
    fontSize: '13px',
    fontWeight: '600',
    backgroundColor: '#fff',
  },
  scrapTable: {
    width: '100%',
    borderCollapse: 'collapse',
    border: '1px solid black',
    tableLayout: 'fixed',
  },
  scrapTh: {
    color: '#000',
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
    fontSize: '12px',
    padding: '6px 4px',
    height: '30px',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    lineHeight: '1.2',
    border: '1px solid black',
    textAlign: 'center',
    verticalAlign: 'middle',
  },
  scrapTd: {
    color: '#000',
    fontSize: '11px',
    padding: '4px',
    height: '30px',
    border: '1px solid black',
    textAlign: 'center',
    verticalAlign: 'middle',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  scrapTdEven: {
    color: '#000',
    fontSize: '11px',
    padding: '4px',
    height: '30px',
    border: '1px solid black',
    textAlign: 'center',
    verticalAlign: 'middle',
    overflow: 'hidden',
    backgroundColor: '#fafafa',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 10px 4px',
    marginTop: '8px',
    backgroundColor: '#fff',
  },
  signatureField: {
    display: 'flex',
    alignItems: 'flex-end',
    minWidth: '300px',
    gap: '8px',
  },
  signatureLabel: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    paddingBottom: '2px',
  },
  signatureInput: {
    flex: 1,
    border: 'none',
    borderBottom: '1.5px solid black',
    outline: 'none',
    fontSize: '11px',
    background: 'transparent',
    minWidth: '200px',
    color: '#000',
  },
};

const PRINT_CSS = `
  @page { size: A4 landscape; margin: 6mm; }
  * { margin:0; padding:0; box-sizing:border-box; -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }
  html, body { width:297mm; height:210mm; overflow:hidden; background:white; color:#000; }
  table { width:100%; border-collapse:collapse; }
  td, th { border:1px solid black; text-align:center; vertical-align:middle; overflow:hidden; color:#000; }
  .sn-container { padding:0 !important; background:white !important; color:#000 !important; }
  .sn-report {
    display:flex !important; flex-direction:column !important;
    width:285mm !important; height:198mm !important;
    padding:0 !important; margin:0 auto !important;
    gap:2px !important; box-shadow:none !important;
    overflow:hidden !important; background:white !important;
    color:#000 !important;
  }
  .no-print { display:none !important; }
  .sn-header-table { border:2px solid black; flex:0 0 auto; }
  .sn-logo-cell { width:120px; padding:6px; text-align:center; border-right:2px solid black; background:white; }
  .sn-logo-image { max-width:100%; max-height:42px; object-fit:contain; }
  .sn-title-cell { font-weight:bold; font-size:16px; padding:0 12px; letter-spacing:2px; text-transform:uppercase; color:#000 !important; background:white; }
  .sn-doc-info-cell { width:220px; padding:0; border-left:2px solid black; background:white; }
  .sn-doc-info-cell table { border:none; }
  .sn-doc-info-cell table td { border:none; border-bottom:1px solid black; padding:0 6px; font-size:8.5px; height:21px; text-align:left; color:#000 !important; background:white; }
  .sn-doc-info-cell table tr:last-child td { border-bottom:none; }
  .sn-doc-label { font-weight:bold; width:80px; border-right:1px solid black !important; font-size:8.5px; background:#c0c0c0 !important; color:#000 !important; }
  .sn-doc-value { font-size:10px; font-weight:600; color:#000 !important; background:white; }
  .sn-scrap-table { border:2px solid black; table-layout:fixed; flex:1 1 auto; }
  .sn-scrap-table th { background:#f5f5f5 !important; font-weight:bold; font-size:9px; padding:2px 3px; height:26px; color:#000 !important; }
  .sn-scrap-table td { font-size:9px; padding:2px 3px; overflow:hidden; height:26px; color:#000 !important; background:white; }
  .sn-scrap-table tbody tr:nth-child(even) td { background:#fafafa !important; color:#000 !important; }
  .sn-footer { flex:0 0 auto; display:flex; justify-content:space-between; align-items:flex-end; padding:4px 10px 6px; margin-top:auto; background:white; }
  .sn-signature-field { display:flex; align-items:flex-end; gap:8px; min-width:280px; }
  .sn-signature-field label { font-size:10px; font-weight:bold; white-space:nowrap; padding-bottom:2px; color:#000 !important; }
  .sn-signature-field input { font-size:10px; border:none; border-bottom:1.5px solid black; min-width:200px; flex:1; background:transparent; outline:none; color:#000 !important; }
`;

// ══════════════════════════════════════
// COMPONENT
// ══════════════════════════════════════
const Scrapnoteprint = ({ items = [], currentReport, onEditForm, onBack }) => {
  const navigate = useNavigate();

  const scrapItems = items
    .filter(x => x.sr_no >= 1)
    .sort((a, b) => a.sr_no - b.sr_no);

  const TOTAL_ROWS = Math.max(MIN_ROWS, scrapItems.length);

  const HEADER_H  = 64;
  const THEAD_H   = 30;
  const FOOTER_H  = 46;
  const GAPS      = 12;
  const PAGE_H_PX = 762;
  const rowH = Math.max(26, Math.floor((PAGE_H_PX - HEADER_H - THEAD_H - FOOTER_H - GAPS) / TOTAL_ROWS));

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handlePrint = () => {
    const reportEl = document.getElementById('scrapnote-print-area');
    if (!reportEl) return;
    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    printWindow.document.write(`
      <!DOCTYPE html><html>
      <head>
        <meta charset="utf-8"/>
        <title>Scrap Note</title>
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

  return (
    <div style={S.container}>

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
      <div className="sn-report" id="scrapnote-print-area" style={S.report}>

        {/* HEADER */}
        <table style={S.headerTable} className="sn-header-table">
          <tbody>
            <tr>
              <td style={S.logoCell} className="sn-logo-cell">
                <img src={atomone} alt="ATOM ONE" style={S.logoImage} className="sn-logo-image" />
              </td>
              <td style={S.titleCell} className="sn-title-cell">SCRAP NOTE</td>
              <td style={S.docInfoCell} className="sn-doc-info-cell">
                <table style={S.docInfoInnerTable}>
                  <tbody>
                    <tr>
                      <td style={{ ...S.docInfoTd, ...S.docLabel }} className="sn-doc-label">DOC.NO.</td>
                      <td style={{ ...S.docInfoTd, ...S.docValue }} className="sn-doc-value">
                        {currentReport?.doc_no || 'AOT-F-QC-04'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ ...S.docInfoTd, ...S.docLabel }} className="sn-doc-label">REV.NO.</td>
                      <td style={{ ...S.docInfoTd, ...S.docValue }} className="sn-doc-value">
                        {currentReport?.rev_no || '00'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ ...S.docInfoTdLast, ...S.docLabel }} className="sn-doc-label">DATE</td>
                      <td style={{ ...S.docInfoTdLast, ...S.docValue }} className="sn-doc-value">
                        {formatDisplay(currentReport?.doc_date) || '01.01.2019'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        {/* SCRAP TABLE */}
        <table style={S.scrapTable} className="sn-scrap-table">
          <colgroup>
            <col style={{ width: '7%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '8%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '29%' }} />
            <col style={{ width: '6%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '9%' }} />
            <col style={{ width: '7%' }} />
          </colgroup>

          <thead>
            <tr>
              <th style={S.scrapTh}>DATE</th>
              <th style={S.scrapTh}>PART NAME</th>
              <th style={S.scrapTh}>MODEL</th>
              <th style={S.scrapTh}>DEFECT</th>
              <th style={S.scrapTh}>PROCESS</th>
              <th style={S.scrapTh}>QTY</th>
              <th style={{ ...S.scrapTh, whiteSpace: 'normal', lineHeight: '1.2' }}>QA HEAD<br />SIGN</th>
              <th style={{ ...S.scrapTh, whiteSpace: 'normal', lineHeight: '1.2' }}>PLANT HEAD<br />SIGN</th>
              <th style={{ ...S.scrapTh, whiteSpace: 'normal', lineHeight: '1.2', wordBreak: 'break-word' }}>REMARKS</th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: TOTAL_ROWS }, (_, i) => {
              const row     = scrapItems[i] || null;
              const isEven  = (i + 1) % 2 === 0;
              const tdStyle = isEven ? S.scrapTdEven : S.scrapTd;
              return (
                <tr key={i} style={{ height: `${rowH}px` }}>
                  <td style={tdStyle}>{row?.date ? formatDisplay(row.date) : ''}</td>
                  <td style={{ ...tdStyle, textAlign: 'left', paddingLeft: '6px', fontWeight: row?.part_name ? '600' : '400' }}>
                    {row?.part_name || ''}
                  </td>
                  <td style={tdStyle}>{row?.model || ''}</td>
                  <td style={{ ...tdStyle, textAlign: 'left', paddingLeft: '6px' }}>{row?.defect || ''}</td>
                  <td style={{ ...tdStyle, textAlign: 'left', paddingLeft: '6px' }}>{row?.process || ''}</td>
                  <td style={tdStyle}>{row?.qty || ''}</td>
                  <td style={tdStyle}>{row?.qa_head_sign || ''}</td>
                  <td style={tdStyle}>{row?.plant_head_sign || ''}</td>
                  <td style={{ ...tdStyle, textAlign: 'left', paddingLeft: '4px' }}>{row?.remarks || ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* FOOTER */}
        <div style={S.footer} className="sn-footer">
          <div style={S.signatureField} className="sn-signature-field">
            <label style={S.signatureLabel}>PREPARED BY:</label>
            <input type="text" readOnly value={currentReport?.prepared_by || ''} style={S.signatureInput} />
          </div>
          <div style={S.signatureField} className="sn-signature-field">
            <label style={S.signatureLabel}>APPROVED BY:</label>
            <input type="text" readOnly value={currentReport?.approved_by || ''} style={S.signatureInput} />
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

export default Scrapnoteprint;