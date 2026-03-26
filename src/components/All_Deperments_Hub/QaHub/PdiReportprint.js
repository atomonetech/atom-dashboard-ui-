import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PDIReport.css';
const atomone = '/logo1.jpg';

// ── Date format helper: "2024-01-15" → "15/01/2024" ──
const formatDisplay = (dateStr) => {
  if (!dateStr) return '';
  const parts = String(dateStr).split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dateStr;
};

// ── Shared class strings ──
const TH = 'border border-black font-bold text-center align-middle leading-tight bg-[#c0c0c0] text-black';
const TD = 'border border-black text-center align-middle bg-white px-0.5 py-px text-black';

// ── Minimum rows to always show ──
const MIN_ROWS = 15;

const PdiReportprint = ({ items = [], currentReport, onEditForm, onBack }) => {
  const navigate = useNavigate();
  const displayDate = formatDisplay(currentReport?.inspection_date) || '';

  // Sort and get items
  const inspItems = items
    .filter(x => x.sr_no >= 1)
    .sort((a, b) => a.sr_no - b.sr_no);

  // Total rows = max of MIN_ROWS or actual data count
  const TOTAL_ROWS = Math.max(MIN_ROWS, inspItems.length);


  return (
    <div className="min-h-screen bg-gray-100 p-5">

      {/* ══════════════════════════════════════
            TOP BAR (no-print)
          ══════════════════════════════════════ */}
      <div className="print:hidden flex justify-end items-center gap-3 mb-2.5">
        {/* Back */}
        <button
          onClick={() => navigate("/qa-hub")}
          className="bg-[#607d8b] text-white border-none py-2 px-5 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5"
        >
          <i className="bi bi-arrow-left-circle-fill"></i> Back
        </button>

        {/* Edit */}
        {onEditForm && (
          <button
            onClick={() => onEditForm(currentReport)}
            className="bg-[#ff9800] text-white border-none py-2 px-5 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5"
          >
            <i className="bi bi-pencil-square"></i> Edit
          </button>
        )}

        {/* Print */}
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
      <div className="di-report bg-white mx-auto shadow-md font-sans w-[210mm] box-border text-black">
        <table className="w-full border border-black border-collapse table-fixed">

          {/* COMMON 12-COLUMN GROUP FOR PERFECT ALIGNMENT */}
          <colgroup>
            <col className="w-[4%]" />   {/* SR NO */}
            <col className="w-[18%]" />  {/* ITEMS */}
            <col className="w-[10%]" />  {/* DIM/SPEC */}
            <col className="w-[8%]" />   {/* TOLERANCE */}
            <col className="w-[9%]" />   {/* METHOD */}
            <col className="w-[6%]" />   {/* VEN 1 */}
            <col className="w-[6%]" />   {/* VEN 2 */}
            <col className="w-[9%]" />   {/* VEN JUDGE */}
            <col className="w-[6%]" />   {/* CUST 1 */}
            <col className="w-[6%]" />   {/* CUST 2 */}
            <col className="w-[9%]" />   {/* CUST JUDGE */}
            <col className="w-[9%]" />   {/* REMARKS */}
          </colgroup>

          <tbody>

            {/* ══════════════════════════════════════
                  SECTION 1: HEADER — 2nd Picture Style
                  (Single row, title on one line, PAGE NO stacked)
                ══════════════════════════════════════ */}
            <tr className="h-[70px]">

              {/* Logo */}
              <td colSpan={2} className="border border-black text-center align-middle p-1">
                <img
                  src={atomone}
                  alt="ATOM ONE"
                  className="block w-auto h-[45px] mx-auto"
                />
              </td>

              {/* Title — Single bold line */}
              <td colSpan={8} className="border border-black text-center align-middle p-1.5">
                <span className="text-[16px] font-black text-black whitespace-nowrap uppercase tracking-[0.5px]">
                  PRE DISPATCH INSPECTION REPORT
                </span>
              </td>

              {/* PAGE NO. — Label on top, value below (stacked in one cell) */}
              <td colSpan={3} className="border border-black text-center align-middle p-1 leading-[1.8]">
                <div className="text-[11px] font-bold text-black">PAGE NO.</div>
                <div className="text-[13px] font-bold text-black">
                  {currentReport?.page_no || '01 OF 01'}
                </div>
              </td>

            </tr>

            {/* ══════════════════════════════════════
                  SECTION 2: INFO ROW 1
                ══════════════════════════════════════ */}
            <tr className="h-[18px]">
              <td colSpan={3} className="border border-black bg-white px-1.5 py-[3px] text-left text-[9.5px] text-black">
                <span className="font-bold text-black">SUPPLIER NAME : </span>
                <span className="text-[11px] text-black pl-1">{currentReport?.supplier_name || ''}</span>
              </td>
              <td colSpan={3} className="border border-black bg-white px-1.5 py-[3px] text-left text-[9.5px] text-black">
                <span className="font-bold text-black">PART NO : </span>
                <span className="text-[11px] text-black pl-1">{currentReport?.part_no || ''}</span>
              </td>
              <td colSpan={3} className="border border-black bg-white px-1.5 py-[3px] text-left text-[9.5px] text-black">
                <span className="font-bold text-black">INSPECTION DATE : </span>
                <span className="text-[11px] text-black pl-1">{displayDate}</span>
              </td>
              <td colSpan={3} className="border border-black bg-white px-1.5 py-[3px] text-left text-[9.5px] text-black">
                <span className="font-bold text-black">CUSTOMER NAME : </span>
                <span className="text-[11px] text-black pl-1">{currentReport?.customer_name || ''}</span>
              </td>
            </tr>

            {/* ══════════════════════════════════════
                  SECTION 2: INFO ROW 2
                ══════════════════════════════════════ */}
            <tr className="h-[18px]">
              <td colSpan={5} className="border border-black bg-white px-1.5 py-[3px] text-left text-[9.5px] text-black">
                <span className="font-bold text-black">PART NAME : </span>
                <span className="text-[11px] text-black pl-1">{currentReport?.part_name || ''}</span>
              </td>
              <td colSpan={3} className="border border-black bg-white px-1.5 py-[3px] text-left text-[9.5px] text-black">
                <span className="font-bold text-black">INVOICE NO : </span>
                <span className="text-[11px] text-black pl-1">{currentReport?.invoice_no || ''}</span>
              </td>
              <td colSpan={4} className="border border-black bg-white px-1.5 py-[3px] text-left text-[9.5px] text-black">
                <span className="font-bold text-black">LOT QTY : </span>
                <span className="text-[11px] text-black pl-1">{currentReport?.lot_qty || ''}</span>
              </td>
            </tr>

            {/* ══════════════════════════════════════
                  SECTION 3: INSPECTION TABLE HEADERS
                ══════════════════════════════════════ */}
            <tr className="h-[18px]">
              <td rowSpan={2} className={`${TH} text-[9px] px-px py-0.5 break-words leading-[1.2]`}>SR.<br />No.</td>
              <td rowSpan={2} className={`${TH} text-[9px] px-px py-0.5 break-words leading-[1.2]`}>INSPECTION ITEMS</td>
              <td rowSpan={2} className={`${TH} text-[9px] px-px py-0.5 break-words leading-[1.2]`}>DIMENSIONS/<br />SPEC</td>
              <td rowSpan={2} className={`${TH} text-[9px] px-px py-0.5 break-words leading-[1.2]`}>TOLERANCE</td>
              <td rowSpan={2} className={`${TH} text-[9px] px-px py-0.5 break-words leading-[1.2]`}>INSPECTION<br />METHOD</td>
              <td colSpan={3} className={`${TH} text-[9px] px-px py-0.5 break-words leading-[1.2]`}>VENDOR OBSERVATIONS</td>
              <td colSpan={3} className={`${TH} text-[9px] px-px py-0.5 break-words leading-[1.2]`}>CUSTOMER OBSERVATION</td>
              <td rowSpan={2} className={`${TH} text-[9px] px-px py-0.5 break-words leading-[1.2]`}>REMARKS</td>
            </tr>
            <tr className="h-[18px]">
              <td className={`${TH} text-[9px] px-px py-0.5`}>1</td>
              <td className={`${TH} text-[9px] px-px py-0.5`}>2</td>
              <td className={`${TH} text-[9px] px-px py-0.5`}>Judgement</td>
              <td className={`${TH} text-[9px] px-px py-0.5`}>1</td>
              <td className={`${TH} text-[9px] px-px py-0.5`}>2</td>
              <td className={`${TH} text-[9px] px-px py-0.5`}>Judgement</td>
            </tr>

            {/* ══════════════════════════════════════
                  SECTION 4: DATA ROWS
                ══════════════════════════════════════ */}
            {Array.from({ length: TOTAL_ROWS }, (_, i) => {
              const row  = inspItems[i] || null;
              const srNo = row?.item?.trim() ? (i + 1) : '';

              // Dynamic color classes for Judgements
              const vendorJudgeColor = row?.vendor_judge === 'OK' ? 'text-[#1a7c1a]' : row?.vendor_judge === 'NG' ? 'text-[#c0392b]' : 'text-black';
              const custJudgeColor = row?.cust_judge === 'OK' ? 'text-[#1a7c1a]' : row?.cust_judge === 'NG' ? 'text-[#c0392b]' : 'text-black';

              return (
                <tr key={i} style={{ height: `${Math.max(20, Math.floor(754 / TOTAL_ROWS))}px` }}>
                  <td className={`${TD} text-[10px]`}>{srNo}</td>
                  <td className={`${TD} text-left pl-1.5 text-[10px] ${row?.item ? 'font-semibold' : 'font-normal'}`}>{row?.item || ''}</td>
                  <td className={`${TD} text-[10px]`}>{row?.spec || ''}</td>
                  <td className={`${TD} text-[10px]`}>{row?.tolerance || ''}</td>
                  <td className={`${TD} text-[10px]`}>{row?.method || ''}</td>
                  <td className={`${TD} text-[10px]`}>{row?.vendor_obs1 || ''}</td>
                  <td className={`${TD} text-[10px]`}>{row?.vendor_obs2 || ''}</td>
                  <td className={`${TD} font-bold text-[10px] ${vendorJudgeColor}`}>{row?.vendor_judge || ''}</td>
                  <td className={`${TD} text-[10px]`}>{row?.cust_obs1 || ''}</td>
                  <td className={`${TD} text-[10px]`}>{row?.cust_obs2 || ''}</td>
                  <td className={`${TD} font-bold text-[10px] ${custJudgeColor}`}>{row?.cust_judge || ''}</td>
                  <td className={`${TD} text-left pl-1 text-[10px]`}>{row?.remarks || ''}</td>
                </tr>
              );
            })}

            {/* ══════════════════════════════════════
                  SECTION 5: FOOTER
                ══════════════════════════════════════ */}
            <tr>
              <td colSpan={12} className="border border-black bg-white px-6 text-left align-middle text-black h-[36px]">
                <span className="font-bold text-[11px] text-black">Supplier Remarks:- </span>
                <span className="text-[11px] text-black pl-1">{currentReport?.supplier_remarks || ''}</span>
              </td>
            </tr>
            <tr>
              <td colSpan={6} className="border border-black bg-white px-4 text-left align-middle text-black h-[36px]">
                <span className="font-bold text-[11px] text-black">Inspected By:- </span>
                <span className="text-[11px] text-black pl-1">{currentReport?.inspected_by || ''}</span>
              </td>
              <td colSpan={6} className="border border-black bg-white px-4 text-left align-middle text-black h-[36px]">
                <span className="font-bold text-[11px] text-black">Verified By :- </span>
                <span className="text-[11px] text-black pl-1">{currentReport?.verified_by || ''}</span>
              </td>
            </tr>
            <tr>
              <td colSpan={12} className="border border-black bg-white px-4 text-left align-middle text-black h-[36px]">
                <span className="font-bold text-[11px] text-black">Approved By:- </span>
                <span className="text-[11px] text-black pl-1">{currentReport?.approved_by || ''}</span>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PdiReportprint;