// ============================================================
//  ForMChangeInfoPrint.js
//  4M Change Information Sheet — Landscape Ready
//  Fully Dynamic Auto-Stretch Container
// ============================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const atomone = '/logo1.jpg'; // Ensure this path is correct for your project

// Default to 20 rows to fill a standard A4 Landscape page beautifully
const TOTAL_ROWS = 20;

const generateEmptyRow = (id) => ({
  id,
  date: '',
  machineNo: '',
  operatorName: '',
  man: '',
  machine: '',
  material: '',
  method: '',
  changeDesc: '',
  sigProd: '',
  sigQual: '',
  sigMaint: ''
});

const ForMChangeInfoPrint = ({ items = [], currentReport, onEditForm, onBack }) => {
  const navigate = useNavigate();
  
  // ── State for orientation toggle (Defaults to landscape for this wide sheet) ──
  const [orientation, setOrientation] = useState('landscape'); 

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
  const TH = 'border border-black font-bold text-center align-middle bg-white text-black px-1 py-1 print:py-0.5 text-[11px] print:text-[9.5px] uppercase leading-tight break-words';
  const TD = 'border border-black text-center align-middle bg-white px-1 py-1 print:py-0 text-black text-[11px] print:text-[9px] break-words print:h-auto';
  
  const InfoLabel = 'border border-black font-semibold bg-[#f5f5f5] text-black text-[11px] print:text-[9.5px] px-2 py-1 print:py-0.5 text-center break-words';
  const InfoValue = 'border border-black font-bold bg-white text-black text-[11px] print:text-[9.5px] px-2 py-1 print:py-0.5 text-center break-words';

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
          
          {/* 12 Columns matching the reference image */}
          <colgroup>
            <col className="w-[4%]" />  {/* S.NO */}
            <col className="w-[6%]" />  {/* Date */}
            <col className="w-[9%]" />  {/* MACHINE NO. */}
            <col className="w-[12%]" /> {/* OPERATOR NAME */}
            <col className="w-[6%]" />  {/* MAN */}
            <col className="w-[8%]" />  {/* MACHINE */}
            <col className="w-[8%]" />  {/* MATERIAL */}
            <col className="w-[7%]" />  {/* METHOD */}
            <col className="w-[16%]" /> {/* CHANGE DESCRIPTION */}
            <col className="w-[8%]" />  {/* PRODUCTION */}
            <col className="w-[7%]" />  {/* QUALITY */}
            <col className="w-[9%]" />  {/* M/C/TOOL MAINTENAN */}
          </colgroup>

          <thead className="table-header-group">
            {/* Row 1, 2, 3: Main Header (Logo, Title, Doc Info) */}
            <tr className="h-[25px] print:h-auto">
              <th colSpan={3} rowSpan={3} className="border border-black p-1 align-middle text-center bg-white">
                <img src={atomone} alt="ATOM ONE" className="max-h-[40px] print:max-h-[30px] max-w-full block mx-auto object-contain" />
              </th>
              <th colSpan={6} rowSpan={3} className="border border-black text-center align-middle bg-white px-2">
                <h1 className="text-[24px] print:text-[18px] font-bold tracking-[1px] m-0 text-black leading-snug">
                  4M CHANGE INFORMATION SHEET
                </h1>
              </th>
              <th colSpan={1} className={InfoLabel}>DOC NO.</th>
              <th colSpan={2} className={InfoValue}>{currentReport?.doc_no || 'AOT-F-4M-03'}</th>
            </tr>
            <tr className="h-[20px] print:h-auto">
              <th colSpan={1} className={InfoLabel}>REVISION NO.</th>
              <th colSpan={2} className={InfoValue}>{currentReport?.rev_no || '0'}</th>
            </tr>
            <tr className="h-[20px] print:h-auto">
              <th colSpan={1} className={InfoLabel}>DATE</th>
              <th colSpan={2} className={InfoValue}>{currentReport?.doc_date || '01.05.2021'}</th>
            </tr>

            {/* Row 4: Sub-Header (Month & Signature Banner) */}
            <tr className="h-[22px] print:h-auto bg-[#f5f5f5]">
              <th colSpan={9} className="border border-black text-left align-middle px-2 py-0.5 text-[12px] print:text-[10px] font-bold uppercase text-black">
                MONTH- <span className="font-normal uppercase ml-2">{currentReport?.month || ''}</span>
              </th>
              <th colSpan={3} className="border border-black text-center align-middle px-2 py-0.5 text-[12px] print:text-[10px] font-bold uppercase text-black">
                SIGNATURE
              </th>
            </tr>

            {/* Row 5: Column Headers */}
            <tr className="h-[30px] print:h-auto bg-white">
              <th className={TH}>S.NO</th>
              <th className={TH}>Date</th>
              <th className={TH}>MACHINE NO.</th>
              <th className={TH}>OPERATOR NAME</th>
              <th className={TH}>MAN</th>
              <th className={TH}>MACHINE</th>
              <th className={TH}>MATERIAL</th>
              <th className={TH}>METHOD</th>
              <th className={TH}>CHANGE DESCRIPTION</th>
              <th className={TH}>PRODUCTION</th>
              <th className={TH}>QUALITY</th>
              <th className={TH}>M/C/TOOL MAINTENANCE</th>
            </tr>
          </thead>

          {/* ════════════ TBODY (Auto-Stretching Rows) ════════════ */}
          <tbody>
            {displayRows.map((row, i) => (
              <tr key={i} className="break-inside-avoid print:h-auto h-[25px]">
                <td className={TD}>{i + 1}</td>
                <td className={TD}>{row.date}</td>
                <td className={TD}>{row.machineNo}</td>
                <td className={`${TD} text-left px-1.5`}>{row.operatorName}</td>
                <td className={TD}>{row.man}</td>
                <td className={TD}>{row.machine}</td>
                <td className={TD}>{row.material}</td>
                <td className={TD}>{row.method}</td>
                <td className={`${TD} text-left px-1.5`}>{row.changeDesc}</td>
                <td className={TD}>{row.sigProd}</td>
                <td className={TD}>{row.sigQual}</td>
                <td className={TD}>{row.sigMaint}</td>
              </tr>
            ))}
          </tbody>
          
        </table>
      </div>
    </div>
  );
};

export default ForMChangeInfoPrint;