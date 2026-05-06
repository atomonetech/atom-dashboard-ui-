// ============================================================
//  DailyProdprint.js
//  Daily Production Plan / Report Sheet — Multi-Page Ready (A3 Landscape)
//  Fully Tailwind CSS Version | Single Wide Table Structure
// ============================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';

const atomone = '/logo1.jpg'; // Ensure this path is correct for your project

// Generate 27 empty rows (22 top rows, 1 tool change row, 4 bottom rows)
const TOTAL_ROWS = 27;
const defaultRows = Array.from({ length: TOTAL_ROWS }).map((_, i) => ({
  id: i,
  mc: '',
  opName: '',
  part: '',
  op: '',
  start: '',
  end: '',
  totalTime: '',
  planned: '',
  achieved: '',
  toolSetup: '',
  mcBd: '',
  toolBd: '',
  coil: '',
  remark: ''
}));

const DailyProdprint = ({ items = defaultRows, onEditForm }) => {
  const navigate = useNavigate();
  // Ensure we have enough rows to map over
  const rowData = items.length >= TOTAL_ROWS ? items : [...items, ...defaultRows.slice(items.length)];

  // ── Common Tailwind Classes for Cells ──
  const TH = 'border border-black font-bold text-center align-middle bg-white text-black px-1 py-1.5 text-[10px] sm:text-[11px] leading-tight';
  const TD = 'border border-black text-center align-middle bg-white px-1 py-1 text-black text-[11px]';
  const InfoLabel = 'border border-black font-semibold bg-white text-black text-[11px] px-2 py-1 text-left whitespace-nowrap';
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
            <col className="w-[4%]" />  {/* M/C */}
            <col className="w-[8%]" />  {/* Operator Name */}
            <col className="w-[10%]" /> {/* Part */}
            <col className="w-[10%]" /> {/* Op */}
            <col className="w-[6%]" />  {/* Start Time */}
            <col className="w-[6%]" />  {/* End Time */}
            <col className="w-[6%]" />  {/* Total Working */}
            <col className="w-[5%]" />  {/* Planned */}
            <col className="w-[5%]" />  {/* Achieved */}
            <col className="w-[6%]" />  {/* Tool Set-up */}
            <col className="w-[6%]" />  {/* Machine B/D */}
            <col className="w-[6%]" />  {/* Tool B/D */}
            <col className="w-[12%]" /> {/* RM Coil */}
            <col className="w-[10%]" /> {/* Remark */}
          </colgroup>

          {/* ════════════ THEAD ════════════ */}
          <thead className="table-header-group">
            {/* ── HEADER ROW 1 ── */}
            <tr className="h-[30px]">
              <th colSpan={2} rowSpan={3} className="border border-black p-2 align-middle text-center bg-white">
                <img src={atomone} alt="ATOM ONE" className="max-h-[50px] max-w-full block mx-auto object-contain" />
              </th>
              
              <th colSpan={10} rowSpan={3} className="border border-black text-center align-middle bg-white">
                <h1 className="text-[28px] sm:text-[32px] font-bold tracking-[1px] m-0 text-black">
                  DAILY PRODUCTION PLAN/ REPORT
                </h1>
              </th>
              
              <th colSpan={1} className={InfoLabel}>DOC NO.</th>
              <th colSpan={1} className={InfoValue}>AOT/F/PROD/02</th>
            </tr>

            {/* ── HEADER ROW 2 ── */}
            <tr className="h-[25px]">
              <th colSpan={1} className={InfoLabel}>REV. NO.</th>
              <th colSpan={1} className={InfoValue}>00</th>
            </tr>

            {/* ── HEADER ROW 3 ── */}
            <tr className="h-[25px]">
              <th colSpan={1} className={InfoLabel}>DATE</th>
              <th colSpan={1} className={InfoValue}>14.10.2024</th>
            </tr>

            {/* ── COLUMN HEADERS ROW ── */}
            <tr className="h-[40px]">
              <th className={TH}>M/C. or Line<br/>No.</th>
              <th className={TH}>Operator Name</th>
              <th className={TH}>Part Name / Number</th>
              <th className={TH}>Operation Name / Number</th>
              <th className={TH}>Production<br/>Start Time</th>
              <th className={TH}>Production<br/>End Time</th>
              <th className={TH}>Total Working<br/>Time</th>
              <th className={TH}>Planned<br/>Quantity</th>
              <th className={TH}>Achieved<br/>Qty.</th>
              <th className={TH}>Tool Set-up<br/>Time</th>
              <th className={TH}>Machine<br/>B/D Time</th>
              <th className={TH}>Tool B/D<br/>Time</th>
              <th className={TH}>RM Coil No / Lot No.</th>
              <th className={TH}>Remark</th>
            </tr>
          </thead>

          {/* ════════════ TBODY ════════════ */}
          <tbody>
            {/* Top 22 Rows */}
            {rowData.slice(0, 22).map((row, i) => (
              <tr key={`top-${i}`} className="break-inside-avoid h-[28px] print:h-[8mm]">
                <td className={TD}>{row.mc}</td>
                <td className={TD}>{row.opName}</td>
                <td className={TD}>{row.part}</td>
                <td className={TD}>{row.op}</td>
                <td className={TD}>{row.start}</td>
                <td className={TD}>{row.end}</td>
                <td className={TD}>{row.totalTime}</td>
                <td className={TD}>{row.planned}</td>
                <td className={TD}>{row.achieved}</td>
                <td className={TD}>{row.toolSetup}</td>
                <td className={TD}>{row.mcBd}</td>
                <td className={TD}>{row.toolBd}</td>
                <td className={TD}>{row.coil}</td>
                <td className={TD}>{row.remark}</td>
              </tr>
            ))}

            {/* ── Special Row: Tool Change Details ── */}
            <tr className="break-inside-avoid h-[28px] print:h-[8mm]">
              <td colSpan={3} className={`${TD} text-left px-2 font-normal`}>Tool Change Details</td>
              <td colSpan={11} className={`${TD} text-left px-2 font-normal text-blue-800`}>No. of Tool Changed Qty.</td>
            </tr>

            {/* Bottom 4 Rows */}
            {rowData.slice(22, 26).map((row, i) => (
              <tr key={`bottom-${i}`} className="break-inside-avoid h-[28px] print:h-[8mm]">
                <td className={TD}>{row.mc}</td>
                <td className={TD}>{row.opName}</td>
                <td className={TD}>{row.part}</td>
                <td className={TD}>{row.op}</td>
                <td className={TD}>{row.start}</td>
                <td className={TD}>{row.end}</td>
                <td className={TD}>{row.totalTime}</td>
                <td className={TD}>{row.planned}</td>
                <td className={TD}>{row.achieved}</td>
                <td className={TD}>{row.toolSetup}</td>
                <td className={TD}>{row.mcBd}</td>
                <td className={TD}>{row.toolBd}</td>
                <td className={TD}>{row.coil}</td>
                <td className={TD}>{row.remark}</td>
              </tr>
            ))}
          </tbody>

          {/* ════════════ TFOOT ════════════ */}
          <tfoot className="table-footer-group">
            <tr className="h-[45px] print:h-[12mm]">
              <td colSpan={7} className="border border-black bg-white px-3 py-2 text-[12px] text-left align-top font-normal text-black">
                PREPARED BY:
              </td>
              <td colSpan={7} className="border border-black bg-white px-3 py-2 text-[12px] text-left align-top font-normal text-black">
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