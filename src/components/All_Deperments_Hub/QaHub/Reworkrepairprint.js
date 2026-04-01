
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
const DEFAULT_OBS_COUNT = 5;

const Reworkrepairprint = ({ items = [], currentReport, onEditForm, onBack }) => {
  const navigate = useNavigate();
  const reportDate = getTodayDisplay();

  const TOTAL_ROWS = Math.max(MIN_ROWS, items.length);

  // ─────────────────────────────────────────────────────────────
  // DYNAMIC OBS COLUMNS LOGIC (Handles Backend Form Fills)
  // ─────────────────────────────────────────────────────────────
  const obsCount = (() => {
    // 1. Try to get explicit count from backend
    const fromReport = parseInt(currentReport?.obs_count, 10);
    if (!isNaN(fromReport) && fromReport > 0) return fromReport;

    // 2. Fallback: Auto-detect from item keys (e.g., obs_1, obs_8)
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

    // 3. Default if nothing is found
    return DEFAULT_OBS_COUNT;
  })();

  const OBS_COLS = Array.from({ length: obsCount }, (_, i) => i + 1);

  // We assign 30% of total width to Observation columns. Math handles the rest.
  const obsColWidth = (30 / obsCount).toFixed(2);

  // ── Common Tailwind Classes for Cells ──
  const TH = 'border border-black font-bold text-center align-middle bg-[#f5f5f5] text-black px-1 py-1 text-[10px] break-words leading-tight';
  const TD = 'border border-black text-center align-middle px-1 py-1 text-black text-[10px] overflow-hidden';
  const InfoLabel = 'border border-black font-bold bg-[#c0c0c0] text-black text-[10px] px-2 py-1 text-left whitespace-nowrap';
  const InfoValue = 'border border-black font-semibold bg-white text-black text-[10px] px-2 py-1 text-left whitespace-nowrap';

  const titleColSpan = obsCount + 3;

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-4 text-black">

      {/* ── Top Bar (Buttons) ── */}
      <div className="flex justify-end items-center gap-3 mb-3 print:hidden">
        <button 
          onClick={() => navigate("/qa-hub")}
          className="bg-[#607d8b] hover:bg-[#4d646f] text-white border-none px-5 py-2 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5 transition-colors"
        >
          <i className="bi bi-arrow-left-circle-fill"></i> Back
        </button>

        {onEditForm && (
          <button 
            onClick={() => onEditForm(currentReport)} 
            className="bg-[#ff9800] hover:bg-[#e68a00] text-white border-none px-5 py-2 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5 transition-colors"
          >
            <i className="bi bi-pencil-square"></i> Edit
          </button>
        )}

        <button 
          onClick={() => window.print()} 
          className="bg-[#4CAF50] hover:bg-[#43a047] text-white border-none px-5 py-2 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5 transition-colors"
        >
          <i className="bi bi-printer-fill"></i> Print
        </button>
      </div>

      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 6mm; }
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            background-color: white; 
          }
        }
      `}</style>

      {/* ── Main A4 Print Container (Fix: h-auto instead of min-h-[210mm]) ── */}
      <div className="bg-white mx-auto shadow-lg font-sans w-[297mm] h-auto box-border p-[10mm] print:w-full print:p-0 print:m-0 print:shadow-none print:block">
        
        <table className="w-full border-collapse table-fixed border border-black">
          <colgroup>
            <col className="w-[4%]" />  
            <col className="w-[15%]" /> 
            <col className="w-[8%]" />  
            <col className="w-[20%]" /> 
            <col className="w-[6%]" />  
            <col className="w-[4%]" />  
            <col className="w-[4%]" />  
            
            {/* Dynamic OBSERVATIONS Columns */}
            {OBS_COLS.map(c => (
              <col key={c} style={{ width: `${obsColWidth}%` }} />
            ))}
            
            <col className="w-[9%]" />  
          </colgroup>

          {/* ════════════ THEAD ════════════ */}
          <thead className="table-header-group">
            <tr className="h-[26px]">
              <th colSpan={2} rowSpan={3} className="border border-black p-1 align-middle text-center bg-white">
                <img src={atomone} alt="ATOM ONE" className="max-h-[50px] max-w-full block mx-auto object-contain" />
              </th>
              
              <th colSpan={titleColSpan} rowSpan={3} className="border border-black text-center align-middle bg-white">
                <h1 className="text-[20px] font-bold uppercase tracking-[1.5px] m-0 text-black">
                  REWORK INSPECTION REPORT
                </h1>
              </th>
              
              <th className={InfoLabel}>DOC.NO.</th>
              <th colSpan={2} className={InfoValue}>{currentReport?.doc_no || 'AOT-F/QA/20'}</th>
            </tr>

            <tr className="h-[26px]">
              <th className={InfoLabel}>REV.NO.</th>
              <th colSpan={2} className={InfoValue}>{currentReport?.rev_no || '00'}</th>
            </tr>

            <tr className="h-[26px]">
              <th className={InfoLabel}>DATE</th>
              <th colSpan={2} className={InfoValue}>{formatDisplay(currentReport?.doc_date) || reportDate}</th>
            </tr>

            <tr className="h-[36px]">
              <th className={TH} rowSpan={2}>SR.<br />NO.</th>
              <th className={TH} rowSpan={2}>PART NAME /<br />PART NO.</th>
              <th className={TH} rowSpan={2}>SPEC.</th>
              <th className={TH} rowSpan={2}>DETAILS OF NON<br />CONFORMANCE</th>
              <th className={TH} rowSpan={2}>REWORK<br />QTY.</th>
              <th className={TH} rowSpan={2}>OK</th>
              <th className={TH} rowSpan={2}>NOT<br />OK</th>
              <th className={`${TH} bg-[#eeeeee]`} colSpan={obsCount}>
                OBSERVATIONS AFTER REWORK
              </th>
              <th className={TH} rowSpan={2}>INSPECTED<br />BY</th>
            </tr>
            <tr>
              {OBS_COLS.map(c => (
                <th key={c} className={`${TH} h-[20px] text-[9px] p-1`}>{c}</th>
              ))}
            </tr>
          </thead>

          {/* ════════════ TBODY ════════════ */}
          <tbody>
            {Array.from({ length: TOTAL_ROWS }, (_, i) => {
              const row = items[i] || null;
              const isEven = (i + 1) % 2 === 0;
              const bgClass = isEven ? 'bg-[#fafafa]' : 'bg-white';
              
              
              return (
                <tr key={i} className="h-[30px] break-inside-avoid">
                  <td className={`${TD} ${bgClass} font-semibold text-[10px]`}>{i + 1}</td>
                  <td className={`${TD} ${bgClass} text-left pl-[4px] text-[9px]`}>{row?.part_name || ''}</td>
                  <td className={`${TD} ${bgClass} text-[9px]`}>{row?.spec || ''}</td>
                  <td className={`${TD} ${bgClass} text-left pl-[4px] text-[9px]`}>{row?.non_conformance || ''}</td>
                  <td className={`${TD} ${bgClass} text-[9px]`}>{row?.rework_qty || ''}</td>
                  <td className={`${TD} ${bgClass} text-[9px]`}>{row?.ok || ''}</td>
                  <td className={`${TD} ${bgClass} text-[9px]`}>{row?.not_ok || ''}</td>
                  
                  {OBS_COLS.map(c => (
                    <td key={c} className={`${TD} ${bgClass} text-[9px]`}>
                      {row?.[`obs_${c}`] || ''}
                    </td>
                  ))}
                  
                  <td className={`${TD} ${bgClass} text-[9px]`}>{row?.inspected_by || ''}</td>
                </tr>
              );
            })}
          </tbody>

          {/* ════════════ TFOOT ════════════ */}
          <tfoot className="table-footer-group">
            <tr>
              <td colSpan={8 + obsCount} className="border border-black p-0 h-[40px] bg-white">
                <div className="flex w-full h-full items-stretch text-left">
                  <div className="font-bold text-[10px] px-3 py-2 border-r border-black flex items-center shrink-0 bg-[#fff]">
                    REMARK :
                  </div>
                  <div className="flex-grow px-3 py-2 flex items-center text-[10px] bg-[#fff]">
                    {currentReport?.remark || ''}
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>

        </table>
      </div>
    </div>
  );
};

export default Reworkrepairprint;