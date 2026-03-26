// ============================================================
//  DeviationApprovalprint.js
//  Production Deviation Slip — Print Component
//  Reference: AOT-F-PROD-04 | Rev 00 | 01.12.2021
// ============================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';

const atomone = '/logo1.jpg';

// Shared Tailwind classes for table cells
const TH =
  'border border-black font-bold text-center align-middle leading-tight bg-white text-black px-0.5 py-0.5 text-[9px] break-words';
const TD =
  'border border-black text-center align-middle bg-white px-0.5 py-0 text-black text-[11px]';

const DEFAULT_ROWS = Array.from({ length: 8 }, (_, i) => ({
  tool_name: '',
  location: '',
  problem: '',
  reason: '',
  date: '',
  duration: '',
  sig_prod: '',
  sig_qa: '',
  remarks: '',
}));

const DeviationApprovalprint = ({
  rows = DEFAULT_ROWS,
  onEditForm,
  onBack, // Added onBack prop
}) => {
  const navigate = useNavigate();
  const rowData = rows.length > 0 ? rows : DEFAULT_ROWS;

  // ── Back Navigation Logic ──
  // const handleBack = () => {
  //   if (onBack) {
  //     onBack();
  //   } else {
  //     navigate(-1); // Fallback routing if onBack is not passed
  //   }
  // };

  return (
    <div className="min-h-screen bg-gray-100 p-4">

      {/* ── Buttons (Hidden on Print) ── */}
      <div className="print:hidden flex justify-end items-center gap-3 mb-2.5">
        <button
          onClick={()=>navigate('/qa-hub')}
          className="bg-[#607d8b] text-white border-none py-2 px-5 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5"
        >
          <i className="bi bi-arrow-left-circle-fill"></i> Back
        </button>

        {onEditForm && (
          <button
            onClick={() => onEditForm()}
            className="bg-[#ff9800] text-white border-none py-2 px-5 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5"
          >
            <i className="bi bi-pencil-square"></i> Edit
          </button>
        )}

        <button
          onClick={() => window.print()}
          className="bg-[#4CAF50] text-white border-none py-2 px-5 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5"
        >
          <i className="bi bi-printer-fill"></i> Print
        </button>
      </div>

      {/* Required for setting actual printer page size to Landscape A4 */}
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 5mm; }
        }
      `}</style>

      {/* ── Main A4 Landscape White Box Container ── */}
      <div
        className="bg-white mx-auto shadow-lg border border-gray-300 font-sans w-[277mm] box-border p-[4mm] text-black overflow-hidden print:shadow-none print:border-none print:p-[5mm] print:h-auto print:bg-white exact-print"
      >
        <table className="w-full border-collapse table-fixed border border-black">
          {/* ── Column widths ── */}
          <colgroup>
            <col className="w-[4%]" />   {/* S.NO. */}
            <col className="w-[12%]" />  {/* TOOL NAME/NO. */}
            <col className="w-[10%]" />  {/* LOCATION */}
            <col className="w-[13%]" />  {/* PROBLEM */}
            <col className="w-[18%]" />  {/* REASON FOR DEVIATION */}
            <col className="w-[9%]" />   {/* DATE */}
            <col className="w-[9%]" />   {/* DURATION */}
            <col className="w-[9%]" />   {/* SIG OF PROD.INCHARGE */}
            <col className="w-[9%]" />   {/* SIG OF QA INCHARGE */}
            <col className="w-[7%]" />   {/* REMARKS */}
          </colgroup>

          <tbody>
            {/* ── HEADER ROW 1 ── */}
            <tr className="h-[28px]">
              {/* Logo */}
              <td
                colSpan={2}
                rowSpan={3}
                className="border border-black p-1 align-middle text-center"
              >
                <img
                  src={atomone}
                  alt="ATOM ONE"
                  className="max-h-[60px] max-w-full block mx-auto object-contain"
                />
              </td>

              {/* Title */}
              <td
                colSpan={5}
                rowSpan={3}
                className="border border-black text-center align-middle"
              >
                <h1 className="text-[22px] font-bold uppercase tracking-[1px] m-0 text-black">
                  PRODUCTION DEVIATION SLIP
                </h1>
              </td>

              {/* Doc No label */}
              <td className="border border-black align-middle text-[11px] font-bold pl-1.5 whitespace-nowrap w-[12%] text-black">
                DOC. NO.
              </td>
              <td
                colSpan={2}
                className="border border-black text-center align-middle text-[11px] whitespace-nowrap text-black"
              >
                AOT-F-PROD-04
              </td>
            </tr>

            {/* ── HEADER ROW 2 ── */}
            <tr className="h-[28px]">
              <td className="border border-black align-middle text-[11px] font-bold pl-1.5 whitespace-nowrap text-black">
                REV.NO.
              </td>
              <td
                colSpan={2}
                className="border border-black text-center align-middle text-[11px] whitespace-nowrap text-black"
              >
                00
              </td>
            </tr>

            {/* ── HEADER ROW 3 ── */}
            <tr className="h-[28px]">
              <td className="border border-black align-middle text-[11px] font-bold pl-1.5 whitespace-nowrap text-black">
                DATE
              </td>
              <td
                colSpan={2}
                className="border border-black text-center align-middle text-[11px] whitespace-nowrap text-black"
              >
                01.12.2021
              </td>
            </tr>

            {/* ── COLUMN HEADER ROW 1 ── */}
            <tr className="h-[18px]">
              <td rowSpan={2} className={TH}>S.<br />NO.</td>
              <td rowSpan={2} className={TH}>TOOL NAME/NO.</td>
              <td rowSpan={2} className={TH}>LOCATION</td>
              <td rowSpan={2} className={TH}>PROBLEM</td>
              <td colSpan={3} className={TH}>DEVIATION DETAILS</td>
              <td rowSpan={2} className={TH}>SIG OF<br />PROD.INCHARGE</td>
              <td rowSpan={2} className={TH}>SIG OF QA<br />INCHARGE</td>
              <td rowSpan={2} className={TH}>REMARKS</td>
            </tr>

            {/* ── COLUMN HEADER ROW 2 ── */}
            <tr className="h-[18px]">
              <td className={TH}>REASON FOR DEVIATION</td>
              <td className={TH}>DATE</td>
              <td className={TH}>DURATION</td>
            </tr>

            {/* ── DATA ROWS ── */}
            {rowData.map((row, i) => (
              <tr key={i} className="h-[52px]">
                <td className={`${TD} font-bold align-middle`}>
                  {i + 1}
                </td>
                <td className={`${TD} text-left px-2 align-middle`}>
                  {row.tool_name || ''}
                </td>
                <td className={`${TD} align-middle`}>
                  {row.location || ''}
                </td>
                <td className={`${TD} text-left px-1 align-middle text-[10px]`}>
                  {row.problem || ''}
                </td>
                <td className={`${TD} text-left px-1 align-middle text-[10px]`}>
                  {row.reason || ''}
                </td>
                <td className={`${TD} align-middle`}>
                  {row.date || ''}
                </td>
                <td className={`${TD} align-middle`}>
                  {row.duration || ''}
                </td>
                <td className={`${TD} align-middle`}>
                  {row.sig_prod || ''}
                </td>
                <td className={`${TD} align-middle`}>
                  {row.sig_qa || ''}
                </td>
                <td className={`${TD} text-left px-1 align-middle text-[10px]`}>
                  {row.remarks || ''}
                </td>
              </tr>
            ))}

            {/* ── FOOTER: REMARKS note ── */}
            <tr className="h-[32px]">
              <td
                colSpan={10}
                className="border border-black bg-white px-2 py-1 text-left text-[11px] text-black"
              >
                <span className="font-bold">REMARKS : </span>
                <span></span>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeviationApprovalprint;