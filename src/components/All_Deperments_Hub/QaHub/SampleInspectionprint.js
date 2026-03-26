import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PDIReport.css'; // Optional: keep for any global/body print resets
const atomone = '/logo1.jpg'; // Path to Atomone logo

// ── Date format helper: "2024-01-15" → "15/01/2024" ──
const formatDisplay = (dateStr) => {
  if (!dateStr) return '';
  const parts = String(dateStr).split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dateStr;
};

// ── Shared Tailwind/CSS class strings for table styling ──
const TH = 'border border-black font-bold text-center align-middle leading-tight bg-[#c0c0c0] text-black text-[9px]';
const TD = 'border border-black text-center align-middle bg-white px-0.5 py-px text-black text-[10px]';

// ── Minimum rows to always show on an A4 page ──
const MIN_ROWS = 20;

const SampleInspectionprint = ({ items = [], currentReport, onEditForm, onBack }) => {
  const navigate = useNavigate();
  const displayDate = formatDisplay(currentReport?.inspection_date) || '';

  // Sort and filter valid items (those with a serial number)
  const inspItems = items
    .filter(x => x.sr_no >= 1)
    .sort((a, b) => a.sr_no - b.sr_no);

  // Determine total rows to render (actual data or minimum padding rows)
  const TOTAL_ROWS = Math.max(MIN_ROWS, inspItems.length);


  return (
    <div className="min-h-screen bg-gray-100 p-5">

      {/* ══════════════════════════════════════
            TOP BAR (no-print)
          ══════════════════════════════════════ */}
      <div className="print:hidden flex justify-end items-center gap-3 mb-2.5">
        {/* Back Button */}
        <button
          onClick={() => navigate("/qa-hub")}
          className="bg-[#607d8b] text-white border-none py-2 px-5 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5"
        >
          <i className="bi bi-arrow-left-circle-fill"></i> Back
        </button>

        {/* Edit Button */}
        {onEditForm && (
          <button
            onClick={() => onEditForm(currentReport)}
            className="bg-[#ff9800] text-white border-none py-2 px-5 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5"
          >
            <i className="bi bi-pencil-square"></i> Edit
          </button>
        )}

        {/* Print Button */}
        <button
          onClick={() => window.print()}
          className="bg-[#4CAF50] text-white border-none py-2 px-5 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5"
        >
          <i className="bi bi-printer-fill"></i> Print
        </button>
      </div>

      {/* ══════════════════════════════════════
            REPORT — A4 Portrait (SINGLE TABLE STRUCTURE)
          ══════════════════════════════════════ */}
      <div className="di-report bg-white mx-auto shadow-md font-sans w-[210mm] h-[297mm] box-border text-black">
        <table className="w-full h-full border border-black border-collapse table-fixed">

          {/* COMMON 15-COLUMN GROUP FOR EXACT LAYOUT MATCHING REFERENCE */}
          <colgroup>
            <col className="w-[4%]" />   {/* SR NO */}
            <col className="w-[13%]" />  {/* Inspection Items */}
            <col className="w-[11%]" />  {/* Specifications */}
            <col className="w-[8%]" />   {/* Inspection Tool */}
            <col className="w-[5.5%]" /> {/* Supplier Obs 1 */}
            <col className="w-[5.5%]" /> {/* Supplier Obs 2 */}
            <col className="w-[5.5%]" /> {/* Supplier Obs 3 */}
            <col className="w-[5.5%]" /> {/* Supplier Obs 4 */}
            <col className="w-[5.5%]" /> {/* Supplier Obs 5 */}
            <col className="w-[9%]" />   {/* Judgement (Single column) */}
            <col className="w-[6.5%]" /> {/* Customer Obs 1 */}
            <col className="w-[6.5%]" /> {/* Customer Obs 2 */}
            <col className="w-[6.5%]" /> {/* Customer Obs 3 */}
            <col className="w-[11%]" />  {/* Remarks */}
          </colgroup>

          <tbody>

            {/* ══════════════════════════════════════
                  HEADER SECTION 1: LOGO & TITLE
                  (Creates vertical division after logo section)
                ══════════════════════════════════════ */}
            <tr className="h-[70px]">
              {/* Logo section — takes columns 1 & 2 */}
              <td colSpan={2} className="border border-black text-center align-middle p-1">
                <img
                  src={atomone}
                  alt="ATOM ONE"
                  className="block w-auto h-[45px] mx-auto"
                />
              </td>

              {/* Title Section — spans remaining 13 columns, creating a vertical line divison from logo */}
              <td colSpan={11} className="border border-black text-center align-middle p-1.5">
                <span className="text-[20px] font-black text-black whitespace-nowrap uppercase">
                  SAMPLE INSPECTION REPORT
                </span>
              </td>

              {/* PAGE NO Section — Stacked in one cell */}
              <td colSpan={2} className="border border-black text-center align-middle p-1 leading-[1.8]">
                <div className="text-[11px] font-bold text-black">PAGE NO.</div>
                <div className="text-[13px] font-bold text-black">
                  {currentReport?.page_no || '01 OF 01'}
                </div>
              </td>
            </tr>

            {/* ══════════════════════════════════════
                  HEADER SECTION 2: SUPPLIER/PART INFO
                  (Labels left-aligned for data space)
                ══════════════════════════════════════ */}
            {/* Info Row 1 */}
            <tr className="h-[20px]">
              {/* Supplier Name */}
              <td colSpan={4} className="border border-black bg-white px-2 text-left text-[9.5px] py-[3px] text-black">
                <span className="font-bold text-black">SUPPLIER NAME : </span>
                <span className="text-[11px] text-black font-bold pl-1.5">{currentReport?.supplier_name || 'ATOMONE TECHNOLOGIES'}</span>
              </td>
              {/* Part Name */}
              <td colSpan={4} className="border border-black bg-white px-2 text-left text-[9.5px] py-[3px] text-black">
                <span className="font-bold text-black">PART NAME : </span>
                <span className="text-[11px] text-black font-bold pl-1.5">{currentReport?.part_name || ''}</span>
              </td>
              {/* Lot Qty */}
              <td colSpan={3} className="border border-black bg-white px-2 text-left text-[9.5px] py-[3px] text-black">
                <span className="font-bold text-black">LOT QTY. : </span>
                <span className="text-[11px] text-black font-bold pl-1.5">{currentReport?.lot_qty || ''}</span>
              </td>
              {/* Model */}
              <td colSpan={4} className="border border-black bg-white px-2 text-left text-[9.5px] py-[3px] text-black">
                <span className="font-bold text-black">MODEL : </span>
                <span className="text-[11px] text-black font-bold pl-1.5">{currentReport?.model || ''}</span>
              </td>
            </tr>

            {/* Info Row 2 */}
            <tr className="h-[20px]">
              {/* Sample No */}
              <td colSpan={4} className="border border-black bg-white px-2 text-left text-[9.5px] py-[3px] text-black">
                <span className="font-bold text-black">SAMPLE NO : </span>
                <span className="text-[11px] text-black font-bold pl-1.5">{currentReport?.sample_no || ''}</span>
              </td>
              {/* Part No */}
              <td colSpan={4} className="border border-black bg-white px-2 text-left text-[9.5px] py-[3px] text-black">
                <span className="font-bold text-black">PART NO : </span>
                <span className="text-[11px] text-black font-bold pl-1.5">{currentReport?.part_no || ''}</span>
              </td>
              {/* Date of Inspection */}
              <td colSpan={7} className="border border-black bg-white px-2 text-left text-[9.5px] py-[3px] text-black">
                <span className="font-bold text-black">DATE OF INSPECTION: </span>
                <span className="text-[11px] text-black font-bold pl-1.5">{displayDate}</span>
              </td>
            </tr>

            {/* ══════════════════════════════════════
                  SECTION 3: INSPECTION TABLE HEADERS (2 rows)
                ══════════════════════════════════════ */}
            {/* Header Labels (Row 1) */}
            <tr className="h-[18px]">
              <td rowSpan={2} className={`${TH} leading-[1.2]`}>SR.<br />No.</td>
              <td rowSpan={2} className={`${TH} leading-[1.2]`}>Inspection Items</td>
              <td rowSpan={2} className={`${TH} leading-[1.2]`}>Specifications</td>
              <td rowSpan={2} className={`${TH} leading-[1.2]`}>Inspection Tool</td>
              {/* Supplier Observations x5 */}
              <td colSpan={5} className={`${TH} leading-[1.2]`}>Supplier observations</td>
              {/* Single Judgement Column */}
              <td rowSpan={2} className={`${TH} leading-[1.2]`}>Judgement</td>
              {/* Customer Observations x3 */}
              <td colSpan={3} className={`${TH} leading-[1.2]`}>Customer Observations</td>
              <td rowSpan={2} className={`${TH} leading-[1.2]`}>Remarks</td>
            </tr>
            {/* Sub-labels (Row 2) */}
            <tr className="h-[18px]">
              {/* Supplier Obs sub-labels */}
              <td className={TH}>1</td>
              <td className={TH}>2</td>
              <td className={TH}>3</td>
              <td className={TH}>4</td>
              <td className={TH}>5</td>
              {/* Customer Obs sub-labels */}
              <td className={TH}>1</td>
              <td className={TH}>2</td>
              <td className={TH}>3</td>
            </tr>

            {/* ══════════════════════════════════════
                  SECTION 4: DATA ROWS MAPPING
                ══════════════════════════════════════ */}
            {Array.from({ length: TOTAL_ROWS }, (_, i) => {
              const row  = inspItems[i] || null;
              const srNo = row?.item?.trim() ? (i + 1) : ''; // Auto-increment Serial Number
              
              // Dynamic color classes for Judgement
              const judgeColor = row?.judgement === 'OK' ? 'text-[#1a7c1a]' : row?.judgement === 'NG' ? 'text-[#c0392b]' : 'text-black';

              return (
                <tr key={i} className="h-[30px]">
                  <td className={TD}>{srNo}</td>
                  {/* Left-aligned items with bold text */}
                  <td className={`${TD} text-left pl-1.5 break-words ${row?.item ? 'font-semibold' : 'font-normal'}`}>{row?.item || ''}</td>
                  <td className={`${TD} break-words`}>{row?.spec || ''}</td>
                  <td className={TD}>{row?.tool || ''}</td>
                  {/* Supplier Observations (Mapped from sup_obs1-sup_obs5) */}
                  <td className={TD}>{row?.sup_obs1 || ''}</td>
                  <td className={TD}>{row?.sup_obs2 || ''}</td>
                  <td className={TD}>{row?.sup_obs3 || ''}</td>
                  <td className={TD}>{row?.sup_obs4 || ''}</td>
                  <td className={TD}>{row?.sup_obs5 || ''}</td>
                  {/* Single Judgement Column with Color Highlighting */}
                  <td className={`${TD} font-bold ${judgeColor}`}>{row?.judgement || ''}</td>
                  {/* Customer Observations (Mapped from cust_obs1-cust_obs3) */}
                  <td className={TD}>{row?.cust_obs1 || ''}</td>
                  <td className={TD}>{row?.cust_obs2 || ''}</td>
                  <td className={TD}>{row?.cust_obs3 || ''}</td>
                  {/* Remarks */}
                  <td className={`${TD} text-left pl-1 break-words`}>{row?.remarks || ''}</td>
                </tr>
              );
            })}

            {/* ══════════════════════════════════════
                  SECTION 5: FOOTER (Signature blocks)
                ══════════════════════════════════════ */}
            {/* Supplier Remarks */}
            <tr>
              <td colSpan={14} className="border border-black bg-white px-2 text-left align-middle text-black h-[36px]">
                <span className="font-bold text-[11px] text-black">Supplier Remarks:- </span>
                <span className="text-[11px] text-black pl-2.5">{currentReport?.supplier_remarks || ''}</span>
              </td>
            </tr>
            {/* Inspected and Verified blocks side-by-side */}
            <tr>
              <td colSpan={7} className="border border-black bg-white px-4 text-left align-middle text-black h-[36px]">
                <span className="font-bold text-[11px] text-black">Inspected By:- </span>
                <span className="text-[11px] text-black pl-2.5">{currentReport?.inspected_by || ''}</span>
              </td>
              <td colSpan={8} className="border border-black bg-white px-4 text-left align-middle text-black h-[36px]">
                <span className="font-bold text-[11px] text-black">Verified By :- </span>
                <span className="text-[11px] text-black pl-2.5">{currentReport?.verified_by || ''}</span>
              </td>
            </tr>
            {/* Approved block full width */}
            <tr>
              <td colSpan={14} className="border border-black bg-white px-4 text-left align-middle text-black h-[36px]">
                <span className="font-bold text-[11px] text-black">Approved By:- </span>
                <span className="text-[11px] text-black pl-2.5">{currentReport?.approved_by || ''}</span>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SampleInspectionprint;