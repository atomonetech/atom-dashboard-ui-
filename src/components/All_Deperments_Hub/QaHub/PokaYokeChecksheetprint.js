// ============================================================
//  PokaYoke_Monitoring_Fixed.js
//  Poka Yoke Monitoring Sheet — Multi-Page Ready (A3 Landscape)
//  Fully Tailwind CSS Version | Single Table Structure
// ============================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';

const atomone = '/logo1.jpg';

const DEFAULT_ITEMS = [
  { sr_no: 1, mc_no: '',    detail: 'Air Pressure switch',   method: 'BY HAND OPERATED', days: {}, remarks: '' },
  { sr_no: 2, mc_no: '',    detail: 'Photo Guard sensor',    method: 'CHECKED BY HAND',  days: {}, remarks: '' },
  { sr_no: 3, mc_no: 'PP-', detail: 'Grease sensor',         method: 'VISUAL CHECK',     days: {}, remarks: '' },
  { sr_no: 4, mc_no: '',    detail: 'Emergency Push Button', method: 'BY HAND OPERATED', days: {}, remarks: '' },
  { sr_no: 5, mc_no: '',    detail: 'TDC limit switch',      method: 'VISUAL CHECK',     days: {}, remarks: '' },
];

const DATA_ROW_HEIGHT = '95px';

// ── Month ke hisab se exact days nikalne ka function ──
const getDaysInMonth = (monthName, year) => {
  const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
  const mIndex = monthNames.indexOf((monthName || "").toUpperCase());
  if (mIndex === -1) return 31; // Default fallback
  return new Date(year, mIndex + 1, 0).getDate(); // Returns 28, 29, 30, or 31
};

const PokaYokeChecksheetprint = ({ items = DEFAULT_ITEMS, currentMonth = "OCTOBER", currentYear = "2024", onEditForm }) => {
  const navigate = useNavigate();
  const rowData = items.length > 0 ? items : DEFAULT_ITEMS;
  const totalRows = rowData.length;

  // Dynamically count days based on Props
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  // ── DYNAMIC COLSPAN CALCULATIONS ──
  // Calculate spans dynamically so the table layout NEVER breaks
  const totalCols = daysInMonth + 5; 
  const titleColSpan = daysInMonth - 5; 
  const dateHeaderSpan1 = 8;
  const dateHeaderSpan2 = Math.floor((daysInMonth - 15) / 2) + 1;
  const dateHeaderSpan3 = 8;
  const dateHeaderSpan4 = Math.ceil((daysInMonth - 15) / 2);
  const verifiedSpan = daysInMonth - 7;
  const legendsSpan = Math.floor(daysInMonth / 2) + 4;
  const approvedSpan = totalCols - 4 - legendsSpan;
  const iconSpan = Math.floor(legendsSpan / 2);
  const textSpan = legendsSpan - iconSpan;

  // ── Common Tailwind Classes for Cells ──
  const TH = 'border border-black font-bold text-center align-middle leading-tight bg-[#f5f5f5] text-black px-0.5 py-0.5 text-[9px] break-words';
  const TD = 'border border-black text-center align-middle bg-white px-1 py-0.5 text-black text-[11px]';
  const InfoLabel = 'border border-black font-bold bg-[#c0c0c0] text-black text-[11px] px-2 py-1 text-left whitespace-nowrap';
  const InfoValue = 'border border-black font-semibold bg-white text-black text-[11px] px-2 py-1 text-center whitespace-nowrap';

  // Specific style to keep M/C NO merged visually
  const mcCellStyle = (i) => ({
    borderLeft: '1px solid black',
    borderRight: '1px solid black',
    borderTop: i === 0 ? '1px solid black' : 'none',
    borderBottom: i === totalRows - 1 ? '1px solid black' : 'none',
  });

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-4 text-black">

      {/* ── Top Bar (Buttons) ── */}
      <div className="flex justify-end items-center gap-3 mb-3 print:hidden">
        <button 
          onClick={() => navigate('/pdi-report')} 
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
      <div className="bg-white mx-auto shadow-lg font-sans w-[420mm] min-h-[297mm] box-border p-[4mm] print:w-full print:p-0 print:m-0 print:shadow-none print:block">
        
        <table className="w-full border-collapse table-fixed border border-black h-full">
          <colgroup>
            <col className="w-[2.2%]" />
            <col className="w-[4.0%]" />
            <col className="w-[14.0%]" />
            <col className="w-[11.0%]" />
            {/* Dynamically assign width per date cell so it spans remaining space automatically */}
            {Array.from({ length: daysInMonth }).map((_, i) => (
              <col key={i} style={{ width: `${61.8 / daysInMonth}%` }} />
            ))}
            <col className="w-[7.0%]" />
          </colgroup>

          {/* ════════════ THEAD: Repeats on every printed page ════════════ */}
          <thead className="table-header-group">
            {/* ── HEADER ROW 1 ── */}
            <tr className="h-[28px]">
              <th colSpan={3} rowSpan={3} className="border border-black p-1 align-middle text-center bg-white">
                <img src={atomone} alt="ATOM ONE" className="max-h-[70px] max-w-full block mx-auto object-contain" />
              </th>
              <th colSpan={titleColSpan} rowSpan={3} className="border border-black text-center align-middle bg-white">
                <h1 className="text-[26px] font-bold uppercase tracking-[1px] m-0 text-black">
                  POKA YOKE MONITORING SHEET
                </h1>
              </th>
              <th colSpan={4} className={InfoLabel}>DOC NO.</th>
              <th colSpan={3} className={InfoValue}>AOT-F-QC-07A</th>
            </tr>

            {/* ── HEADER ROW 2 ── */}
            <tr className="h-[28px]">
              <th colSpan={4} className={InfoLabel}>REVISION NO.</th>
              <th colSpan={3} className={InfoValue}>00</th>
            </tr>

            {/* ── HEADER ROW 3 ── */}
            <tr className="h-[28px]">
              <th colSpan={4} className={InfoLabel}>DATE</th>
              <th colSpan={3} className={InfoValue}>14.10.2024</th>
            </tr>

            {/* ── COLUMN HEADERS ROW 1 ── */}
            <tr className="h-[24px]">
              <th rowSpan={2} className={TH}>S.<br />NO.</th>
              <th rowSpan={2} className={TH}>M/C<br />NO.</th>
              <th rowSpan={2} className={TH}>POKA YOKE DETAIL</th>
              <th rowSpan={2} className={TH}>CHECKING METHOD</th>
              <th colSpan={dateHeaderSpan1} className={TH}>DATE</th>
              <th colSpan={dateHeaderSpan2} className={TH}></th>
              <th colSpan={dateHeaderSpan3} className={TH}>MONTH</th>
              <th colSpan={dateHeaderSpan4} className={TH}></th>
            </tr>

            {/* ── COLUMN HEADERS ROW 2 (Dates) ── */}
            <tr className="h-[20px]">
              {Array.from({ length: daysInMonth }).map((_, i) => (
                <th key={i} className={TH} style={{ fontSize: '8px', padding: '1px 0' }}>{i + 1}</th>
              ))}
              <th className={TH} style={{ fontSize: '8px' }}>Remarks</th>
            </tr>
          </thead>

          {/* ════════════ TBODY: Contains all dynamic rows ════════════ */}
          <tbody>
            {rowData.map((row, i) => (
              <tr key={i} style={{ height: DATA_ROW_HEIGHT }} className="break-inside-avoid">
                <td className={`${TD} font-bold`}>{row.sr_no || i + 1}</td>
                <td className="bg-white text-center align-middle text-[11px] text-black" style={mcCellStyle(i)}>
                  {row.mc_no || ''}
                </td>
                <td className={`${TD} text-left pl-2`}>{row.detail || ''}</td>
                <td className={TD}>{row.method || ''}</td>

                {/* Day cells 1–(28/30/31) */}
                {Array.from({ length: daysInMonth }).map((_, d) => (
                  <td key={d} className={TD}>
                    {row.days?.[d] || ''}
                  </td>
                ))}

                <td className={`${TD} text-left pl-1`}>{row.remarks || ''}</td>
              </tr>
            ))}
          </tbody>

          {/* ════════════ TFOOT: Prints at the very end ════════════ */}
          <tfoot className="table-footer-group">
            {/* ── CHECKED / VERIFIED ── */}
            <tr className="h-[26px]">
              <td colSpan={12} className="border border-black bg-white px-3 py-1 text-[11px] text-left">
                <span className="font-bold text-black">CHECKED BY : </span>
                <span className="uppercase ml-2 text-black">MAINTENANCE PERSON</span>
              </td>
              <td colSpan={verifiedSpan} className="border border-black bg-white px-3 py-1 text-[11px] text-left">
                <span className="font-bold text-black">VERIFIED BY : </span>
                <span className="uppercase ml-2 text-black">HOD</span>
              </td>
            </tr>

            {/* ── LEGENDS ── */}
            <tr className="h-[22px]">
              <td colSpan={4} rowSpan={4} className="border border-black p-2 text-[10px] font-bold align-bottom text-center bg-white">
                PREPARED BY
              </td>
              <td colSpan={legendsSpan} className="border border-black p-1 text-[11px] font-bold text-center bg-[#f0f0f0]">
                LEGENDS
              </td>
              <td colSpan={approvedSpan} rowSpan={4} className="border border-black p-2 text-[10px] font-bold align-bottom text-center bg-white">
                APPROVED BY
              </td>
            </tr>
            <tr className="h-[20px]">
              <td colSpan={iconSpan} className="border border-black p-0.5 text-center font-bold text-[14px] bg-white">ü</td>
              <td colSpan={textSpan} className="border border-black p-0.5 text-center text-[10px] bg-white">OK</td>
            </tr>
            <tr className="h-[20px]">
              <td colSpan={iconSpan} className="border border-black p-0.5 text-center font-bold text-[14px] bg-white">X</td>
              <td colSpan={textSpan} className="border border-black p-0.5 text-center text-[10px] bg-white">NOT OK</td>
            </tr>
            <tr className="h-[20px]">
              <td colSpan={iconSpan} className="border border-black p-0.5 text-center font-bold text-[10px] bg-white">N/A</td>
              <td colSpan={textSpan} className="border border-black p-0.5 text-center text-[10px] bg-white">Not Applicable</td>
            </tr>
          </tfoot>

        </table>
      </div>
    </div>
  );
};

export default PokaYokeChecksheetprint;