// ============================================================
//  MonthlyProdPlanPrint.js
//  Monthly Production Plan Sheet — Auto-Stretch Print Ready
//  Supports Dual Mode (Portrait / Landscape)
// ============================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const atomone = '/logo1.jpg'; // Adjust path if needed

// Default 22 rows to fill a standard A4 Portrait page beautifully
const TOTAL_ROWS = 22;

const generateEmptyRow = (id) => ({
  id,
  partNumberName: '',
  customer: '',
  openingStock: '',
  scheduleQty: '',
  plannedQty: '',
  remark: ''
});

const MonthlyProdPlanPrint = ({ items = [], currentReport, onEditForm, onBack }) => {
  const navigate = useNavigate();
  
  // ── State for orientation toggle (Defaults to portrait for this sheet) ──
  const [orientation, setOrientation] = useState('portrait'); 

  // Pad the array with empty rows to ensure the table structure fills the page
  const rowData = [...(Array.isArray(items) ? items : [])];
  while (rowData.length < TOTAL_ROWS) {
    rowData.push(generateEmptyRow(rowData.length + 1));
  }
  const displayRows = rowData.slice(0, TOTAL_ROWS);

  // ── Conditional Classes based on Orientation ──
  const isLandscape = orientation === 'landscape';
  const containerSize = isLandscape ? 'w-[297mm] h-[210mm]' : 'w-[210mm] h-[297mm]';

  // ── Common Tailwind Classes (Optimized for Auto-Squish) ──
  const TH = 'border border-black font-bold text-center align-middle bg-white text-black px-1 py-1 print:py-0.5 text-[12px] print:text-[10px] leading-tight break-words';
  const TD = 'border border-black text-center align-middle bg-white px-1 py-1 print:py-0 text-black text-[12px] print:text-[10px] break-words print:h-auto';
  
  const InfoLabel = 'border border-black font-semibold bg-white text-black text-[11px] print:text-[9.5px] px-2 py-0.5 text-left break-words';
  const InfoValue = 'border border-black font-bold bg-white text-black text-[11px] print:text-[9.5px] px-2 py-0.5 text-left break-words';

  return (
    <div className="min-h-screen bg-[#e0e0e0] p-4 text-black flex flex-col items-center print:min-h-0 print:p-0 print:bg-white print:block">
      
      {/* ── Top Bar (Hidden on Print) ── */}
      <div className={`flex justify-end items-center gap-3 mb-3 print:hidden w-full ${isLandscape ? 'max-w-[297mm]' : 'max-w-[210mm]'}`}>
        
        <button 
          onClick={() => setOrientation(isLandscape ? 'portrait' : 'landscape')} 
          className="bg-[#3b5998] hover:bg-[#2d4373] text-white px-4 py-2 rounded-md font-bold text-sm flex items-center gap-1.5 transition-colors mr-auto"
        >
          <i className={`bi ${isLandscape ? 'bi-phone' : 'bi-tablet-landscape'}`}></i> 
          Switch to {isLandscape ? 'Portrait' : 'Landscape'}
        </button>

        <button 
          onClick={() => { if(onBack) onBack(); else navigate(-1); }} 
          className="bg-[#607d8b] hover:bg-[#4d646f] text-white px-5 py-2 rounded-md font-bold text-sm flex items-center gap-1.5 transition-colors"
        >
          <i className="bi bi-arrow-left-circle-fill"></i> Back
        </button>
        
        {onEditForm && (
          <button 
            onClick={() => onEditForm(currentReport)} 
            className="bg-[#ff9800] hover:bg-[#e68a00] text-white px-5 py-2 rounded-md font-bold text-sm flex items-center gap-1.5 transition-colors"
          >
            <i className="bi bi-pencil-square"></i> Edit
          </button>
        )}
        
        <button 
          onClick={() => window.print()} 
          className="bg-[#4CAF50] hover:bg-[#43a047] text-white px-5 py-2 rounded-md font-bold text-sm flex items-center gap-1.5 transition-colors"
        >
          <i className="bi bi-printer-fill"></i> Print
        </button>
      </div>

      {/* ── Dynamic Print CSS Injection ── */}
      <style>{`
        @media print {
          @page { 
            size: auto ${orientation}; 
            margin: 5mm; 
          }
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            background-color: white; 
            margin: 0;
            padding: 0;
          }

          /* The universal 95vh auto-stretch container */
          .print-dynamic-container {
            height: 95vh !important; 
            max-height: 95vh !important;
            overflow: hidden !important; 
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin: 0 auto !important; 
            page-break-inside: avoid;
            page-break-after: avoid;
          }

          table {
            height: 100% !important;
          }
        }
      `}</style>

      {/* ── Main Print Container ── */}
      <div className={`print-dynamic-container bg-white shadow-lg font-sans box-border p-[5mm] print:w-full print:max-w-full print:p-[2mm] print:m-0 print:shadow-none flex flex-col justify-between ${containerSize} transition-all duration-300`}>
        <table className="w-full h-full border-collapse table-fixed border-2 border-black">
          
          {/* 7 Columns matching the reference image */}
          <colgroup>
            <col className="w-[6%]" />  {/* Sr. No. */}
            <col className="w-[26%]" /> {/* Part Number & Name */}
            <col className="w-[14%]" /> {/* Customer */}
            <col className="w-[12%]" /> {/* Opening stock */}
            <col className="w-[14%]" /> {/* Customer Schedule Quantity */}
            <col className="w-[13%]" /> {/* Planned Quantity */}
            <col className="w-[15%]" /> {/* Remark */}
          </colgroup>

          <thead className="table-header-group">
            {/* Header Rows */}
            <tr className="h-[25px] print:h-auto">
              <th colSpan={2} rowSpan={3} className="border border-black p-1 align-middle text-center bg-white">
                <img src={atomone} alt="ATOM ONE" className="max-h-[45px] print:max-h-[35px] max-w-full block mx-auto object-contain" />
              </th>
              <th colSpan={3} rowSpan={3} className="border border-black text-center align-middle bg-white px-2">
                <h1 className="text-[22px] print:text-[18px] font-bold tracking-[1px] m-0 text-black leading-snug">
                  MONTHLY PRODUCTION PLAN
                </h1>
              </th>
              <th colSpan={1} className={InfoLabel}>DOC. NO.</th>
              <th colSpan={1} className={InfoValue}>{currentReport?.doc_no || 'AOT/F/PROD/01'}</th>
            </tr>
            <tr className="h-[20px] print:h-auto">
              <th colSpan={1} className={InfoLabel}>REV. NO.</th>
              <th colSpan={1} className={InfoValue}>{currentReport?.rev_no || '00'}</th>
            </tr>
            <tr className="h-[20px] print:h-auto">
              <th colSpan={1} className={InfoLabel}>DATE</th>
              <th colSpan={1} className={InfoValue}>{currentReport?.doc_date || '14.10.2024'}</th>
            </tr>

            {/* Column Headers */}
            <tr className="h-[35px] print:h-auto bg-white">
              <th className={TH}>Sr.<br/>No.</th>
              <th className={TH}>Part Number & Name</th>
              <th className={TH}>Customer</th>
              <th className={TH}>Opening<br/>stock</th>
              <th className={TH}>Customer<br/>Schedule<br/>Quantity</th>
              <th className={TH}>Planned<br/>Quantity</th>
              <th className={TH}>Remark</th>
            </tr>
          </thead>

          {/* ════════════ TBODY (Auto-Stretching Rows) ════════════ */}
          <tbody>
            {displayRows.map((row, i) => (
              <tr key={i} className="break-inside-avoid print:h-auto h-[26px]">
                <td className={TD}>{i + 1}</td>
                <td className={`${TD} text-left px-1.5 font-medium`}>{row.partNumberName}</td>
                <td className={TD}>{row.customer}</td>
                <td className={TD}>{row.openingStock}</td>
                <td className={TD}>{row.scheduleQty}</td>
                <td className={TD}>{row.plannedQty}</td>
                <td className={TD}>{row.remark}</td>
              </tr>
            ))}
          </tbody>

          {/* ════════════ TFOOT (Totals & Notes) ════════════ */}
          <tfoot className="table-footer-group">
            {/* Total Row */}
            <tr className="h-[25px] print:h-auto">
              <td colSpan={4} className="border border-black font-bold text-center align-middle bg-white text-black px-2 py-1 print:py-0.5 text-[12px] print:text-[10px]">
                TOTAL
              </td>
              <td className={TD}>{currentReport?.totalScheduleQty || ''}</td>
              <td className={TD}>{currentReport?.totalPlannedQty || ''}</td>
              <td className={TD}></td>
            </tr>
            
            {/* Notes Row */}
            <tr className="h-[35px] print:h-auto">
              <td colSpan={2} className="border border-black font-bold text-center align-middle bg-white text-black px-2 py-1 print:py-0.5 text-[12px] print:text-[10px]">
                NOTE :
              </td>
              <td colSpan={5} className="border border-black text-left align-middle bg-white text-black px-2 py-1 print:py-0.5 text-[12px] print:text-[10px] font-bold">
                <div className="mb-0.5">1) WIP = Work In Process</div>
                <div>2) F.G. = Finished Goods</div>
              </td>
            </tr>

            {/* Signatures Row */}
            <tr className="h-[30px] print:h-[10mm]">
              <td colSpan={4} className="border border-black text-left align-top bg-white text-black px-2 py-1 print:py-0.5 text-[12px] print:text-[10px] uppercase">
                <span className="font-semibold">PREPARED BY:</span> 
                <span className="ml-2">{currentReport?.prepared_by || ''}</span>
              </td>
              <td colSpan={3} className="border border-black text-left align-top bg-white text-black px-2 py-1 print:py-0.5 text-[12px] print:text-[10px] uppercase">
                <span className="font-semibold">APPROVED BY:</span>
                <span className="ml-2">{currentReport?.approved_by || ''}</span>
              </td>
            </tr>
          </tfoot>
          
        </table>
      </div>
    </div>
  );
};

export default MonthlyProdPlanPrint;