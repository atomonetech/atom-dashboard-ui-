// ============================================================
//  ForMChangeInsPrint.js
//  4M Change Inspection Report — DUAL MODE (Portrait/Landscape)
//  Fully Dynamic "Before" and "After" Columns | Auto-Stretch
// ============================================================

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const atomone = '/logo1.jpg'; // Ensure this path is correct for your project

const TOTAL_ROWS = 25;

// Fallback empty rows in case API data is empty or too short
const generateEmptyRow = (id) => ({
  id, srNo: '', date: '', partName: '', operation: '', 
  lotQty: '', okQty: '', rejQty: '', parameter: '',
  before: [], after: [], 
  inspBy: '', remarks: '',
});

const ForMChangeInsPrint = ({ items = [], onEditForm }) => {
  const navigate = useNavigate();
  
  // ── State to track printing orientation ──
  const [orientation, setOrientation] = useState('landscape'); // 'landscape' | 'portrait'

  const rowData = useMemo(() => {
    const dataRows = Array.isArray(items) ? items : [];
    const filledRows = [...dataRows];
    while (filledRows.length < TOTAL_ROWS) {
      filledRows.push(generateEmptyRow(filledRows.length));
    }
    return filledRows.slice(0, TOTAL_ROWS);
  }, [items]);

  const beforeCount = useMemo(() => {
    const max = Math.max(...rowData.map(row => Array.isArray(row.before) ? row.before.length : 0));
    return max > 0 ? max : 5; 
  }, [rowData]);

  const afterCount = useMemo(() => {
    const max = Math.max(...rowData.map(row => Array.isArray(row.after) ? row.after.length : 0));
    return max > 0 ? max : 5; 
  }, [rowData]);

  const totalDynamicCols = beforeCount + afterCount;
  const dynamicColWidth = `${25 / totalDynamicCols}%`; 
  const titleColSpan = 5 + beforeCount + afterCount;

  // ── Conditional Classes based on Orientation ──
  const isLandscape = orientation === 'landscape';
  
  // Removed hardcoded print dimensions. Handled completely by .print-dynamic-container now!
  const containerSize = isLandscape 
    ? 'w-[297mm] h-[210mm]' 
    : 'w-[210mm] h-[297mm]';

  // Stripped rigid print heights so rows can naturally flex
  const rowHeight = isLandscape 
    ? 'h-[25px]' 
    : 'h-[32px]';

  // Common Tailwind Classes (Optimized for Squishability)
  const TH = 'border border-black font-bold text-center align-middle bg-[#f5f5f5] text-black px-0.5 py-0.5 print:py-0 text-[9px] print:text-[8px] leading-tight break-words';
  const TD = `border border-black text-center align-middle bg-white px-0.5 py-0.5 print:py-0 text-black text-[10px] print:text-[8px] ${rowHeight} break-words`;
  const InfoLabel = 'border border-black font-bold bg-[#f5f5f5] text-black text-[9px] print:text-[8px] px-1 py-0.5 print:py-0 text-left break-words';
  const InfoValue = 'border border-black font-semibold bg-white text-black text-[9px] print:text-[8px] px-1 py-0.5 print:py-0 text-left break-words';

  return (
    <div className="min-h-screen bg-[#e0e0e0] p-4 text-black flex flex-col items-center print:min-h-0 print:p-0 print:bg-white print:block">
      
      {/* ── Top Bar ── */}
      <div className={`flex justify-end items-center gap-3 mb-3 print:hidden w-full ${isLandscape ? 'max-w-[297mm]' : 'max-w-[210mm]'}`}>
        
        {/* Toggle Orientation Button */}
        <button 
          onClick={() => setOrientation(isLandscape ? 'portrait' : 'landscape')} 
          className="bg-[#3b5998] hover:bg-[#2d4373] text-white px-4 py-2 rounded-md font-bold text-sm flex items-center gap-1.5 transition-colors mr-auto"
        >
          <i className={`bi ${isLandscape ? 'bi-phone' : 'bi-tablet-landscape'}`}></i> 
          Switch to {isLandscape ? 'Portrait' : 'Landscape'}
        </button>

        <button onClick={() => navigate("/production-hub")} className="bg-[#607d8b] hover:bg-[#4d646f] text-white px-5 py-2 rounded-md font-bold text-sm flex items-center gap-1.5 transition-colors">
          <i className="bi bi-arrow-left-circle-fill"></i> Back
        </button>
        
        {onEditForm && (
          <button onClick={() => onEditForm()} className="bg-[#ff9800] hover:bg-[#e68a00] text-white px-5 py-2 rounded-md font-bold text-sm flex items-center gap-1.5 transition-colors">
            <i className="bi bi-pencil-square"></i> Edit
          </button>
        )}
        
        <button onClick={() => window.print()} className="bg-[#4CAF50] hover:bg-[#43a047] text-white px-5 py-2 rounded-md font-bold text-sm flex items-center gap-1.5 transition-colors">
          <i className="bi bi-printer-fill"></i> Print
        </button>
      </div>

      {/* ── Dynamic Print CSS Injection ── */}
      <style>{`
        @media print {
          /* Automatically injects 'landscape' or 'portrait' based on React state */
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

          /* The universal auto-stretch container */
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
        <table className="w-full border-collapse table-fixed border-2 border-black h-full">
          
          <colgroup>
            <col className="w-[3%]" />   {/* Sr No */}
            <col className="w-[5%]" />   {/* Date */}
            <col className="w-[12%]" />  {/* Part Name */}
            <col className="w-[10%]" />  {/* Operation */}
            <col className="w-[4.5%]" /> {/* Lot Qty */}
            <col className="w-[4.5%]" /> {/* Ok Qty */}
            <col className="w-[4.5%]" /> {/* Rej Qty */}
            <col className="w-[14.5%]"/> {/* Parameter */}
            {Array.from({ length: beforeCount }).map((_, i) => (
              <col key={`col-b-${i}`} style={{ width: dynamicColWidth }} />
            ))}
            {Array.from({ length: afterCount }).map((_, i) => (
              <col key={`col-a-${i}`} style={{ width: dynamicColWidth }} />
            ))}
            <col className="w-[6%]" />   {/* Insp By */}
            <col className="w-[11%]" />  {/* Remarks */}
          </colgroup>

          <thead className="table-header-group">
            <tr className="h-[20px] print:h-auto">
              <th colSpan={3} rowSpan={3} className="border border-black p-1 align-middle text-center bg-white">
                <img src={atomone} alt="ATOM ONE" className="max-h-[35px] print:max-h-[25px] max-w-full block mx-auto object-contain" />
              </th>
              <th colSpan={titleColSpan} rowSpan={3} className="border border-black text-center align-middle bg-white px-2">
                <h1 className="text-[20px] print:text-[16px] font-bold tracking-[1px] m-0 text-black leading-snug">
                  4M CHANGE INSPECTION REPORT
                </h1>
              </th>
              <th colSpan={1} className={InfoLabel}>DOC NO.</th>
              <th colSpan={1} className={InfoValue}>AOT-F-4M-08</th>
            </tr>
            <tr className="h-[18px] print:h-auto">
              <th colSpan={1} className={InfoLabel}>REV NO.</th>
              <th colSpan={1} className={InfoValue}>00</th>
            </tr>
            <tr className="h-[18px] print:h-auto">
              <th colSpan={1} className={InfoLabel}>DATE</th>
              <th colSpan={1} className={InfoValue}>01.01.2018</th>
            </tr>

            <tr className="h-[22px] print:h-auto">
              <th rowSpan={2} className={TH}>Sr No.</th>
              <th rowSpan={2} className={TH}>Date</th>
              <th rowSpan={2} className={TH}>Part Name/ Part No.</th>
              <th rowSpan={2} className={TH}>Operation</th>
              <th rowSpan={2} className={TH}>Lot<br/>Qty</th>
              <th rowSpan={2} className={TH}>Ok Qty<br/>(after)</th>
              <th rowSpan={2} className={TH}>Rej.<br/>Qty</th>
              <th rowSpan={2} className={TH}>Parameter/Specs</th>
              <th colSpan={beforeCount} className={TH}>Before</th>
              <th colSpan={afterCount} className={TH}>After</th>
              <th rowSpan={2} className={TH}>Insp<br/>by</th>
              <th rowSpan={2} className={TH}>Remarks</th>
            </tr>
            <tr className="h-[18px] print:h-auto">
              {Array.from({ length: beforeCount }).map((_, i) => <th key={`th-b-${i}`} className={TH}>{i + 1}</th>)}
              {Array.from({ length: afterCount }).map((_, i) => <th key={`th-a-${i}`} className={TH}>{i + 1}</th>)}
            </tr>
          </thead>

          <tbody>
            {rowData.map((row, i) => (
              <tr key={i} className="break-inside-avoid print:h-auto">
                <td className={TD}>{row.srNo}</td>
                <td className={TD}>{row.date}</td>
                <td className={`${TD} text-left px-1.5 leading-[1.1]`}>{row.partName}</td>
                <td className={`${TD} leading-[1.1]`}>{row.operation}</td>
                <td className={TD}>{row.lotQty}</td>
                <td className={TD}>{row.okQty}</td>
                <td className={TD}>{row.rejQty}</td>
                <td className={`${TD} text-left px-1.5 leading-[1.1]`}>{row.parameter}</td>
                {Array.from({ length: beforeCount }).map((_, colIndex) => <td key={`td-b-${colIndex}`} className={TD}>{row.before?.[colIndex] || ''}</td>)}
                {Array.from({ length: afterCount }).map((_, colIndex) => <td key={`td-a-${colIndex}`} className={TD}>{row.after?.[colIndex] || ''}</td>)}
                <td className={TD}>{row.inspBy}</td>
                <td className={`${TD} text-left px-1`}>{row.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ForMChangeInsPrint;