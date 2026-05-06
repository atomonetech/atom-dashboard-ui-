

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

// Minimum rows to display even if data is less
const MIN_ROWS = 18;

const RedBinprint = ({ items = [], currentReport, onEditForm, onBack }) => {
  const navigate = useNavigate();

  // Sort and filter items
  const reportItems = items
    .filter(x => x.sr_no >= 1)
    .sort((a, b) => a.sr_no - b.sr_no);

  const TOTAL_ROWS = Math.max(MIN_ROWS, reportItems.length);

 
  // ── Common Tailwind Classes for Cells ──
  const TH = 'border border-black font-bold text-center align-middle bg-[#f5f5f5] text-black px-1 py-1 text-[12px] break-words leading-tight';
  const TD = 'border border-black text-center align-middle px-1 py-1 text-black text-[11px] overflow-hidden';
  const InfoLabel = 'border border-black font-bold bg-[#c0c0c0] text-black text-[11px] px-2 py-1 text-left whitespace-nowrap';
  const InfoValue = 'border border-black font-semibold bg-white text-black text-[11px] px-2 py-1 text-left whitespace-nowrap';

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

      {/* ── Main A4 Print Container (Fixed: h-auto instead of min-h-[210mm]) ── */}
      <div className="bg-white mx-auto shadow-lg font-sans w-[297mm] h-auto box-border p-[10mm] print:w-full print:p-0 print:m-0 print:shadow-none print:block">
        
        <table className="w-full border-collapse table-fixed border border-black">
          <colgroup>
            {/* Total 9 Columns exactly matching 100% width */}
            <col className="w-[5%]" />  
            <col className="w-[8%]" />  
            <col className="w-[18%]" /> 
            <col className="w-[24%]" /> 
            <col className="w-[12%]" /> 
            <col className="w-[8%]" />  
            <col className="w-[10%]" /> 
            <col className="w-[10%]" /> 
            <col className="w-[5%]" />  
          </colgroup>

          {/* ════════════ THEAD ════════════ */}
          <thead className="table-header-group">
            <tr className="h-[26px]">
              <th colSpan={2} rowSpan={3} className="border border-black p-1 align-middle text-center bg-white">
                <img src={atomone} alt="ATOM ONE" className="max-h-[55px] max-w-full block mx-auto object-contain" />
              </th>
              
              <th colSpan={4} rowSpan={3} className="border border-black text-center align-middle bg-white">
                <h1 className="text-[22px] font-bold uppercase tracking-[2px] m-0 text-black">
                  RED BIN ANALYSIS REPORT
                </h1>
              </th>
              
              <th className={InfoLabel}>DOC.NO.</th>
              <th colSpan={2} className={InfoValue}>{currentReport?.doc_no || 'AOT-F-QC-02'}</th>
            </tr>

            <tr className="h-[26px]">
              <th className={InfoLabel}>REV.NO.</th>
              <th colSpan={2} className={InfoValue}>{currentReport?.rev_no || '00'}</th>
            </tr>

            <tr className="h-[26px]">
              <th className={InfoLabel}>DATE</th>
              <th colSpan={2} className={InfoValue}>{formatDisplay(currentReport?.doc_date) || '01.01.2019'}</th>
            </tr>

            <tr className="h-[35px]">
              <th className={TH}>S.No.</th>
              <th className={TH}>DATE</th>
              <th className={TH}>PART NAME / MODEL</th>
              <th className={TH}>DEFECT DETAIL</th>
              <th className={TH}>OPERATION</th>
              <th className={TH}>TOTAL REJ. QTY</th>
              <th className={TH}>REASON</th>
              <th className={TH}>ACTION TAKEN</th>
              <th className={TH}>SIGN.</th>
            </tr>
          </thead>

          {/* ════════════ TBODY ════════════ */}
          <tbody>
            {Array.from({ length: TOTAL_ROWS }, (_, i) => {
              const row = reportItems[i] || null;
              const isEven = (i + 1) % 2 === 0;
              const bgClass = isEven ? 'bg-[#fafafa]' : 'bg-white';
              
              // break-inside-avoid ensures rows don't split across pages
              return (
                <tr key={i} className="h-[30px] break-inside-avoid">
                  <td className={`${TD} ${bgClass}`}>{row?.sr_no || ''}</td>
                  <td className={`${TD} ${bgClass}`}>{row?.date ? formatDisplay(row.date) : ''}</td>
                  <td className={`${TD} ${bgClass} text-left pl-[6px] ${row?.part_name ? 'font-semibold' : 'font-normal'}`}>
                    {row?.part_name || ''}
                  </td>
                  <td className={`${TD} ${bgClass} text-left pl-[6px]`}>{row?.defect_detail || ''}</td>
                  <td className={`${TD} ${bgClass}`}>{row?.operation || ''}</td>
                  <td className={`${TD} ${bgClass}`}>{row?.total_rej_qty || ''}</td>
                  <td className={`${TD} ${bgClass} text-left pl-[4px]`}>{row?.reason || ''}</td>
                  <td className={`${TD} ${bgClass} text-left pl-[4px]`}>{row?.action_taken || ''}</td>
                  <td className={`${TD} ${bgClass}`}>{row?.sign || ''}</td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default RedBinprint;