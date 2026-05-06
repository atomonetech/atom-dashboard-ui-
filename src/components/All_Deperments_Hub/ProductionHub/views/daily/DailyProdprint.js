// ============================================================
//  DailyProdprint.js
//  Daily Production Plan Sheet — Multi-Page Ready (A3 Landscape)
//  Fully Tailwind CSS Version | Split Table Structure
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
  const TH = 'border border-black font-bold text-center align-middle bg-[#f5f5f5] text-black px-1 py-1.5 text-[11px]';
  const TD = 'border border-black text-center align-middle bg-white px-1 py-0.5 text-black text-[11px]';
  const InfoLabel = 'border border-black font-semibold bg-[#f5f5f5] text-black text-[11px] px-2 py-1 text-left whitespace-nowrap';
  const InfoValue = 'border border-black font-normal bg-white text-black text-[11px] px-2 py-1 text-left whitespace-nowrap';

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-4 text-black flex flex-col items-center">
      {/* ── Top Bar (Buttons) ── */}
      <div className="flex justify-end items-center gap-3 mb-3 print:hidden w-full max-w-[420mm]">
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
          @page { size: A3 landscape; margin: 5mm; }
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            background-color: white; 
          }
        }
      `}</style>

      {/* ── Main A3 Print Container ── */}
      <div className="bg-white shadow-lg font-sans w-[420mm] h-[297mm] box-border p-[4mm] print:w-full print:h-[100vh] print:p-0 print:m-0 print:shadow-none flex flex-col justify-between">
        
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
            {/* ── HEADER ROW 1 ── */}
            <tr className="h-[30px]">
              <th colSpan={2} rowSpan={3} className="border border-black p-2 align-middle text-center bg-white">
                <img src={atomone} alt="ATOM ONE" className="max-h-[60px] max-w-full block mx-auto object-contain" />
              </th>
              
              <th colSpan={7} rowSpan={3} className="border border-black text-center align-middle bg-white">
                <h1 className="text-[28px] sm:text-[32px] font-bold tracking-[1px] m-0 text-black">
                  DAILY PRODUCTION PLAN
                </h1>
              </th>
              
              <th colSpan={1} className={InfoLabel}>DOC NO.</th>
              <th colSpan={2} className={InfoValue}>AOT/F/PROD/03</th>
            </tr>

            {/* ── HEADER ROW 2 ── */}
            <tr className="h-[25px]">
              <th colSpan={1} className={InfoLabel}>REV. NO.</th>
              <th colSpan={2} className={InfoValue}>00</th>
            </tr>

            {/* ── HEADER ROW 3 ── */}
            <tr className="h-[25px]">
              <th colSpan={1} className={InfoLabel}>DATE</th>
              <th colSpan={2} className={InfoValue}>14.10.2024</th>
            </tr>

            {/* ── COLUMN HEADERS ROW ── */}
            <tr className="h-[35px]">
              <th className={TH}>M/C. or Line /<br/>Name or Number</th>
              <th className={TH}>Part Name / Number</th>
              <th className={TH}>Operation Name / Number</th>
              <th className={TH}>Planned<br/>Quantity</th>
              <th className={TH}>Achieved<br/>Qty.</th>
              <th className={`border-r-[3px] border-r-black ${TH}`}>Remark</th>

              <th className={TH}>M/C. or Line /<br/>Name or Number</th>
              <th className={TH}>Part Name / Number</th>
              <th className={TH}>Operation Name / Number</th>
              <th className={TH}>Planned<br/>Quantity</th>
              <th className={TH}>Achieved<br/>Qty.</th>
              <th className={TH}>Remark</th>
            </tr>
          </thead>

          {/* ════════════ TBODY ════════════ */}
          <tbody>
            {rowData.map((row, i) => {
              const isFirstInBlock = i % 6 === 0;

              // Dynamically calculated height per row to ensure A3 is filled fully
              return (
                <tr key={i} className="break-inside-avoid h-[30px] print:h-[7.8mm]">
                  {/* ====== LEFT HALF ====== */}
                  {isFirstInBlock && (
                    <td rowSpan={6} className="border border-black bg-white text-center align-top p-1 text-[11px] font-bold text-black">
                      {row.mcLeft}
                    </td>
                  )}
                  <td className={`${TD} text-left px-2 font-semibold`}>{row.partLeft}</td>
                  <td className={`${TD} text-left px-2 font-semibold`}>{row.opLeft}</td>
                  <td className={TD}>{row.planLeft}</td>
                  <td className={TD}>{row.achLeft}</td>
                  <td className={`border-r-[3px] border-r-black ${TD}`}>{row.remLeft}</td>

                  {/* ====== RIGHT HALF ====== */}
                  {isFirstInBlock && (
                    <td rowSpan={6} className="border border-black bg-white text-center align-top p-1 text-[11px] font-bold text-black">
                      {row.mcRight}
                    </td>
                  )}
                  <td className={`${TD} text-left px-2 font-semibold`}>{row.partRight}</td>
                  <td className={`${TD} text-left px-2 font-semibold`}>{row.opRight}</td>
                  <td className={TD}>{row.planRight}</td>
                  <td className={TD}>{row.achRight}</td>
                  <td className={TD}>{row.remRight}</td>
                </tr>
              );
            })}
          </tbody>

          {/* ════════════ TFOOT ════════════ */}
          <tfoot className="table-footer-group">
            <tr className="h-[45px] print:h-[12mm]">
              <td colSpan={6} className="border-t border-b border-black border-r-[3px] border-r-black bg-white px-3 py-2 text-[12px] text-left align-top font-bold text-black">
                PREPARED BY:
              </td>
              <td colSpan={6} className="border-t border-b border-black bg-white px-3 py-2 text-[12px] text-left align-top font-bold text-black">
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