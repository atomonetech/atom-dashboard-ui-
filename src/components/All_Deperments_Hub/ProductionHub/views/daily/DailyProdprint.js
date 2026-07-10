// ============================================================
//  DailyProdprint.js
//  Daily Production Plan Sheet — A4 Landscape/Portrait Ready
//  Fully Tailwind CSS Version | Split Table Structure | Auto-Stretch
// ============================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';

const atomone = '/logo1.jpg'; // Ensure this path is correct for your project

// Generate 30 empty rows (5 blocks of 6 rows per block)
const TOTAL_ROWS = 30;
const defaultRows = Array.from({ length: TOTAL_ROWS }).map((_, i) => ({
  id: i,
  // Left Side
  mcLeft: '',
  partLeft: '',
  opLeft: '',
  planLeft: '',
  achLeft: '',
  remLeft: '',
  // Right Side
  mcRight: '',
  partRight: '',
  opRight: '',
  planRight: '',
  achRight: '',
  remRight: '',
}));

const DailyProdprint = ({ items = defaultRows, onEditForm }) => {
  const navigate = useNavigate();
  const rowData = items.length > 0 ? items : defaultRows;

  // ── Common Tailwind Classes for Cells ──
  // Added print:py-0 and print:text-[8px] to maximize squishability for 30 rows
  const TH = 'border border-black font-bold text-center align-middle bg-[#f5f5f5] text-black px-1 py-1 print:py-0 text-[10px] print:text-[8px] leading-tight break-words';
  const TD = 'border border-black text-center align-middle bg-white px-1 py-0.5 print:py-0 text-black text-[10px] print:text-[8px] leading-tight break-words';
  
  const InfoLabel = 'border border-black font-semibold bg-[#f5f5f5] text-black text-[10px] print:text-[8px] px-1 py-1 print:py-0.5 text-left break-words';
  const InfoValue = 'border border-black font-normal bg-white text-black text-[10px] print:text-[8px] px-1 py-1 print:py-0.5 text-left break-words';

  return (
    <div className="min-h-screen bg-[#e0e0e0] p-4 text-black flex flex-col items-center print:min-h-0 print:p-0 print:bg-white print:block">
      {/* ── Top Bar (Buttons) ── */}
      <div className="flex justify-end items-center gap-3 mb-3 print:hidden w-full max-w-[297mm]">
        <button
          onClick={() => navigate("/production-hub")}
          className="bg-[#607d8b] hover:bg-[#4d646f] text-white border-none px-5 py-2 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5 transition-colors"
        >
          <i className="bi bi-arrow-left-circle-fill"></i> Back
        </button>

        {onEditForm && (
          <button
            onClick={() => onEditForm()}
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
          @page { 
            size: auto; 
            margin: 5mm; 
          }
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            background-color: white; 
            margin: 0;
            padding: 0;
          }

          /* Safely shrinks the container and prevents ANY bottom bleeding */
          .print-a4-container {
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

          /* Allows the rows to dynamically stretch and squish based on the 95vh */
          table {
            height: 100% !important;
          }
        }
      `}</style>

      {/* ── Main Print Container ── */}
      <div className="print-a4-container bg-white shadow-lg font-sans mx-auto w-[297mm] h-[210mm] box-border p-[5mm] print:w-full print:max-w-full print:p-[2mm] print:m-0 print:shadow-none flex flex-col justify-between">
        <table className="w-full border-collapse table-fixed border-2 border-black h-full">
          <colgroup>
            {/* Left Half (50%) */}
            <col className="w-[8%]" />  {/* M/C */}
            <col className="w-[14%]" /> {/* Part */}
            <col className="w-[14%]" /> {/* Op */}
            <col className="w-[5%]" />  {/* Planned */}
            <col className="w-[5%]" />  {/* Achieved */}
            <col className="w-[4%]" />  {/* Remark */}
            
            {/* Right Half (50%) */}
            <col className="w-[8%]" />  {/* M/C */}
            <col className="w-[14%]" /> {/* Part */}
            <col className="w-[14%]" /> {/* Op */}
            <col className="w-[5%]" />  {/* Planned */}
            <col className="w-[5%]" />  {/* Achieved */}
            <col className="w-[4%]" />  {/* Remark */}
          </colgroup>

          {/* ════════════ THEAD ════════════ */}
          <thead className="table-header-group">
            <tr className="h-[25px] print:h-auto">
              <th colSpan={2} rowSpan={3} className="border border-black p-1 align-middle text-center bg-white">
                <img src={atomone} alt="ATOM ONE" className="max-h-[40px] print:max-h-[28px] max-w-full block mx-auto object-contain" />
              </th>
              
              <th colSpan={7} rowSpan={3} className="border border-black text-center align-middle bg-white">
                <h1 className="text-[22px] sm:text-[24px] print:text-[16px] font-bold tracking-[1px] m-0 text-black">
                  DAILY PRODUCTION PLAN
                </h1>
              </th>
              
              <th colSpan={1} className={InfoLabel}>DOC NO.</th>
              <th colSpan={2} className={InfoValue}>AOT/F/PROD/03</th>
            </tr>

            <tr className="h-[20px] print:h-auto">
              <th colSpan={1} className={InfoLabel}>REV. NO.</th>
              <th colSpan={2} className={InfoValue}>00</th>
            </tr>

            <tr className="h-[20px] print:h-auto">
              <th colSpan={1} className={InfoLabel}>DATE</th>
              <th colSpan={2} className={InfoValue}>14.10.2024</th>
            </tr>

            <tr className="h-[25px] print:h-auto">
              <th className={TH}>M/C. or Line /<br/>Name or Number</th>
              <th className={TH}>Part Name / Number</th>
              <th className={TH}>Operation Name / Number</th>
              <th className={TH}>Planned<br/>Qty</th>
              <th className={TH}>Achieved<br/>Qty</th>
              <th className={`border-r-[3px] border-r-black ${TH}`}>Remark</th>

              <th className={TH}>M/C. or Line /<br/>Name or Number</th>
              <th className={TH}>Part Name / Number</th>
              <th className={TH}>Operation Name / Number</th>
              <th className={TH}>Planned<br/>Qty</th>
              <th className={TH}>Achieved<br/>Qty</th>
              <th className={TH}>Remark</th>
            </tr>
          </thead>

          {/* ════════════ TBODY ════════════ */}
          <tbody>
            {rowData.map((row, i) => {
              const isFirstInBlock = i % 6 === 0;

              return (
                // Forced print:h-auto so 30 rows can safely compress
                <tr key={i} className="break-inside-avoid h-[22px] print:h-auto">
                  {/* ====== LEFT HALF ====== */}
                  {isFirstInBlock && (
                    <td rowSpan={6} className="border border-black bg-white text-center align-top p-1 text-[10px] print:text-[8px] font-bold text-black break-words">
                      {row.mcLeft}
                    </td>
                  )}
                  <td className={`${TD} text-left px-1 font-semibold`}>{row.partLeft}</td>
                  <td className={`${TD} text-left px-1 font-semibold`}>{row.opLeft}</td>
                  <td className={TD}>{row.planLeft}</td>
                  <td className={TD}>{row.achLeft}</td>
                  <td className={`border-r-[3px] border-r-black ${TD}`}>{row.remLeft}</td>

                  {/* ====== RIGHT HALF ====== */}
                  {isFirstInBlock && (
                    <td rowSpan={6} className="border border-black bg-white text-center align-top p-1 text-[10px] print:text-[8px] font-bold text-black break-words">
                      {row.mcRight}
                    </td>
                  )}
                  <td className={`${TD} text-left px-1 font-semibold`}>{row.partRight}</td>
                  <td className={`${TD} text-left px-1 font-semibold`}>{row.opRight}</td>
                  <td className={TD}>{row.planRight}</td>
                  <td className={TD}>{row.achRight}</td>
                  <td className={TD}>{row.remRight}</td>
                </tr>
              );
            })}
          </tbody>

          {/* ════════════ TFOOT ════════════ */}
          <tfoot className="table-footer-group">
            <tr className="h-[30px] print:h-auto">
              <td colSpan={6} className="border-t border-b border-black border-r-[3px] border-r-black bg-white px-2 py-1 print:py-0.5 text-[11px] print:text-[9px] text-left align-top font-bold text-black">
                PREPARED BY:
              </td>
              <td colSpan={6} className="border-t border-b border-black bg-white px-2 py-1 print:py-0.5 text-[11px] print:text-[9px] text-left align-top font-bold text-black">
                APPROVED BY:
              </td>
            </tr>
          </tfoot>

        </table>
      </div>
    </div>
  );
};

export default DailyProdprint;