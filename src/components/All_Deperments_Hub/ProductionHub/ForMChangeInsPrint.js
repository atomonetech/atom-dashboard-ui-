// ============================================================
//  ForMChangeInsPrint.js
//  4M Change Inspection Report — Multi-Page Ready (A3 Landscape)
//  Fully Dynamic "Before" and "After" Columns based on Backend Data
// ============================================================

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const atomone = '/logo1.jpg'; // Ensure this path is correct for your project

const TOTAL_ROWS = 25;

// Fallback empty rows in case API data is empty or too short
const generateEmptyRow = (id) => ({
  id, srNo: '', date: '', partName: '', operation: '', 
  lotQty: '', okQty: '', rejQty: '', parameter: '',
  before: [], after: [], // Ensure backend sends data in arrays
  inspBy: '', remarks: '',
});

const ForMChangeInsPrint = ({ 
  items = [], // This will be your data from the backend API
  onEditForm 
}) => {
  const navigate = useNavigate();

  // 1. Fill remaining rows to always show 25 rows on the A3 sheet
  const rowData = useMemo(() => {
    const dataRows = Array.isArray(items) ? items : [];
    const filledRows = [...dataRows];
    
    // Add empty rows if data from backend is less than TOTAL_ROWS
    while (filledRows.length < TOTAL_ROWS) {
      filledRows.push(generateEmptyRow(filledRows.length));
    }
    // Only take first TOTAL_ROWS if API sends more (for single page print limits)
    return filledRows.slice(0, TOTAL_ROWS);
  }, [items]);

  // 2. Calculate the MAXIMUM number of 'before' and 'after' items from the actual API data
  // Defaulting to 1 column minimum even if no data exists, just to keep the table structure intact
  const beforeCount = useMemo(() => {
    const max = Math.max(...rowData.map(row => Array.isArray(row.before) ? row.before.length : 0));
    return max > 0 ? max : 5; // Default to 5 if API sends empty arrays
  }, [rowData]);

  const afterCount = useMemo(() => {
    const max = Math.max(...rowData.map(row => Array.isArray(row.after) ? row.after.length : 0));
    return max > 0 ? max : 5; // Default to 5 if API sends empty arrays
  }, [rowData]);


  // ── Dynamic Width & ColSpan Calculations ──
  // Middle section gets 25% of the total table width. 
  // It automatically divides based on the number of dynamic columns from backend data.
  const totalDynamicCols = beforeCount + afterCount;
  const dynamicColWidth = `${25 / totalDynamicCols}%`; 
  const titleColSpan = 5 + beforeCount + afterCount;

  // ── Common Tailwind Classes ──
  const TH = 'border border-black font-bold text-center align-middle bg-[#f5f5f5] text-black px-1 py-1 text-[10px] leading-tight';
  const TD = 'border border-black text-center align-middle bg-white px-1 py-0.5 text-black text-[11px]';
  const InfoLabel = 'border border-black font-bold bg-[#f5f5f5] text-black text-[10px] px-2 py-1 text-left';
  const InfoValue = 'border border-black font-semibold bg-white text-black text-[10px] px-2 py-1 text-left';

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-4 text-black flex flex-col items-center">
      {/* ── Top Bar ── */}
      <div className="flex justify-end items-center gap-3 mb-3 print:hidden w-full max-w-[420mm]">
        <button onClick={() => navigate(-1)} className="bg-[#607d8b] hover:bg-[#4d646f] text-white px-5 py-2 rounded-md font-bold text-sm flex items-center gap-1.5 transition-colors">
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

      <style>{`
        @media print {
          @page { size: A3 landscape; margin: 5mm; }
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; background-color: white; }
        }
      `}</style>

      {/* ── Main A3 Print Container ── */}
      <div className="bg-white shadow-lg font-sans w-[420mm] h-[297mm] box-border p-[4mm] print:w-full print:h-[100vh] print:p-0 print:m-0 print:shadow-none flex flex-col justify-between">
        <table className="w-full border-collapse table-fixed border-2 border-black h-full">
          
          {/* ════════════ DYNAMIC COLUMN GROUP ════════════ */}
          <colgroup>
            <col className="w-[3%]" />   {/* 1: Sr No */}
            <col className="w-[5%]" />   {/* 2: Date */}
            <col className="w-[12%]" />  {/* 3: Part Name */}
            <col className="w-[6%]" />   {/* 4: Operation */}
            <col className="w-[4%]" />   {/* 5: Lot Qty */}
            <col className="w-[4%]" />   {/* 6: Ok Qty */}
            <col className="w-[4%]" />   {/* 7: Rej Qty */}
            <col className="w-[10%]" />  {/* 8: Parameter */}
            
            {/* Dynamic Before Cols */}
            {Array.from({ length: beforeCount }).map((_, i) => (
              <col key={`col-b-${i}`} style={{ width: dynamicColWidth }} />
            ))}
            
            {/* Dynamic After Cols */}
            {Array.from({ length: afterCount }).map((_, i) => (
              <col key={`col-a-${i}`} style={{ width: dynamicColWidth }} />
            ))}
            
            <col className="w-[7%]" />   {/* Insp By */}
            <col className="w-[20%]" />  {/* Remarks */}
          </colgroup>

          <thead className="table-header-group">
            {/* ── HEADER ROW 1 ── */}
            <tr className="h-[25px]">
              <th colSpan={3} rowSpan={3} className="border border-black p-2 align-middle text-center bg-white">
                <img src={atomone} alt="ATOM ONE" className="max-h-[50px] max-w-full block mx-auto object-contain" />
              </th>
              
              <th colSpan={titleColSpan} rowSpan={3} className="border border-black text-center align-middle bg-white">
                <h1 className="text-[26px] sm:text-[28px] font-bold tracking-[1px] m-0 text-black">
                  4M CHANGE INSPECTION REPORT
                </h1>
              </th>
              
              <th colSpan={1} className={InfoLabel}>DOC NO.</th>
              <th colSpan={1} className={InfoValue}>AOT-F-4M-08</th>
            </tr>
            <tr className="h-[20px]">
              <th colSpan={1} className={InfoLabel}>REVISION NO.</th>
              <th colSpan={1} className={InfoValue}>00</th>
            </tr>
            <tr className="h-[20px]">
              <th colSpan={1} className={InfoLabel}>DATE</th>
              <th colSpan={1} className={InfoValue}>01.01.2018</th>
            </tr>

            {/* ── COLUMN HEADERS ROW 1 ── */}
            <tr className="h-[25px]">
              <th rowSpan={2} className={TH}>Sr No.</th>
              <th rowSpan={2} className={TH}>Date</th>
              <th rowSpan={2} className={TH}>Part Name/ Part No.</th>
              <th rowSpan={2} className={TH}>Operation</th>
              <th rowSpan={2} className={TH}>Lot Qty</th>
              <th rowSpan={2} className={TH}>Ok Qty<br/>(after insp )</th>
              <th rowSpan={2} className={TH}>Rej.Qty</th>
              <th rowSpan={2} className={TH}>Parameter/Specs</th>
              
              <th colSpan={beforeCount} className={TH}>Before (Retroactive)</th>
              <th colSpan={afterCount} className={TH}>After / Setup Approval</th>
              
              <th rowSpan={2} className={TH}>Insp.<br/>by</th>
              <th rowSpan={2} className={TH}>Remarks</th>
            </tr>

            {/* ── COLUMN HEADERS ROW 2 (Dynamic Sub-columns 1, 2, 3...) ── */}
            <tr className="h-[22px]">
              {Array.from({ length: beforeCount }).map((_, i) => (
                <th key={`th-b-${i}`} className={TH}>{i + 1}</th>
              ))}
              {Array.from({ length: afterCount }).map((_, i) => (
                <th key={`th-a-${i}`} className={TH}>{i + 1}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rowData.map((row, i) => (
              <tr key={i} className="break-inside-avoid h-[32px] print:h-[9.8mm]">
                <td className={TD}>{row.srNo}</td>
                <td className={TD}>{row.date}</td>
                <td className={`${TD} text-left px-1.5`}>{row.partName}</td>
                <td className={TD}>{row.operation}</td>
                <td className={TD}>{row.lotQty}</td>
                <td className={TD}>{row.okQty}</td>
                <td className={TD}>{row.rejQty}</td>
                <td className={`${TD} text-left px-1.5`}>{row.parameter}</td>
                
                {/* Dynamic Before Data Cells */}
                {Array.from({ length: beforeCount }).map((_, colIndex) => (
                  <td key={`td-b-${colIndex}`} className={TD}>
                    {row.before?.[colIndex] || ''}
                  </td>
                ))}
                
                {/* Dynamic After Data Cells */}
                {Array.from({ length: afterCount }).map((_, colIndex) => (
                  <td key={`td-a-${colIndex}`} className={TD}>
                    {row.after?.[colIndex] || ''}
                  </td>
                ))}
                
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