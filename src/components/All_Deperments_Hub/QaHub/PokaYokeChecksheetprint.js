// ============================================================
//  PokaYoke_Monitoring_Fixed.js
//  Poka Yoke Monitoring Sheet — Multi-Page Ready (A3 Landscape)
//  Feature: Initially Blank, Auto-reset filters on Print
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const atomone = '/logo1.jpg';

// Month names array global kar diya
const MONTH_NAMES = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

const DEFAULT_ITEMS = [
  { sr_no: 1, mc_no: '',    detail: 'Air Pressure switch',   method: 'BY HAND OPERATED', days: {}, remarks: '' },
  { sr_no: 2, mc_no: '',    detail: 'Photo Guard sensor',    method: 'CHECKED BY HAND',  days: {}, remarks: '' },
  { sr_no: 3, mc_no: '',    detail: 'Grease sensor',         method: 'VISUAL CHECK',     days: {}, remarks: '' },
  { sr_no: 4, mc_no: '',    detail: 'Emergency Push Button', method: 'BY HAND OPERATED', days: {}, remarks: '' },
  { sr_no: 5, mc_no: '',    detail: 'TDC limit switch',      method: 'VISUAL CHECK',     days: {}, remarks: '' },
];

const getDaysInMonth = (monthName, year) => {
  if (!monthName || !year) return 31; // Blank hone par default 31 days banenge
  const mIndex = MONTH_NAMES.indexOf((monthName || "").toUpperCase());
  if (mIndex === -1) return 31;
  return new Date(year, mIndex + 1, 0).getDate();
};

const PokaYokeChecksheetprint = ({ items = DEFAULT_ITEMS, onEditForm }) => {
  const navigate = useNavigate();
  const filterRef = useRef(null);
  const rowData = items.length > 0 ? items : DEFAULT_ITEMS;
  const totalRows = rowData.length;

  // ── CURRENT DATE SETUP ──
  const currentDate = new Date();
  const currentMonthName = MONTH_NAMES[currentDate.getMonth()];
  const currentYearStr = currentDate.getFullYear().toString();

  // ── FILTER STATES ──
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterMonth, setFilterMonth] = useState(currentMonthName);
  const [filterMachine, setFilterMachine] = useState("PP-01"); 
  
  // ── TABLE STATES (INITIALLY BLANK) ──
  const [appliedMonth, setAppliedMonth] = useState("");
  const [appliedMachine, setAppliedMachine] = useState("");

  // ── AUTO-RESET LOGIC ──
  const handleResetFilter = () => {
    setFilterMonth(currentMonthName);
    setFilterMachine("PP-01");
    setAppliedMonth(""); // Table wapas khali ho jayegi
    setAppliedMachine(""); // Table wapas khali ho jayegi
    setIsFilterOpen(false);
  };

  // Trigger reset automatically before printing (Print karte waqt khali format aayega)
  useEffect(() => {
    const handleBeforePrint = () => {
      handleResetFilter();
    };
    window.addEventListener("beforeprint", handleBeforePrint);
    return () => window.removeEventListener("beforeprint", handleBeforePrint);
  }, []);

  // Close filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApplyFilter = () => {
    setAppliedMonth(filterMonth);
    setAppliedMachine(filterMachine);
    setIsFilterOpen(false);
  };

  const daysInMonth = getDaysInMonth(appliedMonth, currentYearStr);

  // ── DYNAMIC COLSPAN CALCULATIONS ──
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

  // ── Common Tailwind Classes ──
  const TH = 'border border-black font-bold text-center align-middle leading-tight bg-[#f5f5f5] text-black px-0.5 py-0.5 text-[9px] break-words uppercase';
  const TD = 'border border-black text-center align-middle bg-white px-1 py-0.5 text-black text-[11px]';
  const InfoLabel = 'border border-black font-bold bg-[#c0c0c0] text-black text-[11px] px-2 py-1 text-left whitespace-nowrap uppercase';
  const InfoValue = 'border border-black font-semibold bg-white text-black text-[11px] px-2 py-1 text-center whitespace-nowrap uppercase';

  const mcCellStyle = (i) => ({
    borderLeft: '1px solid black',
    borderRight: '1px solid black',
    borderTop: i === 0 ? '1px solid black' : 'none',
    borderBottom: i === totalRows - 1 ? '1px solid black' : 'none',
  });

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-4 text-black">

      {/* ── Top Bar ── */}
      <div className="flex justify-end items-center gap-3 mb-4 print:hidden">
        
        <button 
          onClick={() => navigate('/qa-hub')} 
          className="bg-[#607d8b] hover:bg-[#4d646f] text-white border-none px-4 py-2 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <i className="bi bi-arrow-left-circle-fill"></i> Back
        </button>

        <div className="relative" ref={filterRef}>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)} 
            className="bg-[#3b5998] hover:bg-[#2d4373] text-white border-none px-4 py-2 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <i className="bi bi-funnel-fill"></i> Filter
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              <div className="flex justify-between items-center border-b p-3">
                <h3 className="text-[#3b5998] font-bold text-sm flex items-center gap-2 m-0">
                  <i className="bi bi-funnel-fill"></i> Filter Reports
                </h3>
                <button 
                  onClick={() => setIsFilterOpen(false)} 
                  className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <div className="p-4 flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 flex items-center gap-2 mb-1 uppercase tracking-wide">
                    <i className="bi bi-calendar3"></i> Month
                  </label>
                  <select 
                    value={filterMonth} 
                    onChange={(e) => setFilterMonth(e.target.value)} 
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[#3b5998]"
                  >
                    {MONTH_NAMES.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 flex items-center gap-2 mb-1 uppercase tracking-wide">
                    <i className="bi bi-gear-fill"></i> Machine
                  </label>
                  <select 
                    value={filterMachine} 
                    onChange={(e) => setFilterMachine(e.target.value)} 
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[#3b5998]"
                  >
                    {["PP-01", "PP-02", "PP-03", "PP-04", "PP-05", "PP-06"].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 p-3 border-t bg-gray-50 rounded-b-lg">
                <button 
                  onClick={handleApplyFilter} 
                  className="flex-1 bg-[#4285F4] hover:bg-[#3367D6] text-white py-2 rounded text-sm font-bold flex justify-center items-center gap-2 transition-colors border-none cursor-pointer"
                >
                  <i className="bi bi-check-circle-fill"></i> Apply
                </button>
                <button 
                  onClick={handleResetFilter} 
                  className="flex-1 bg-white border border-[#ff4d4f] text-[#ff4d4f] hover:bg-red-50 py-2 rounded text-sm font-bold flex justify-center items-center gap-2 transition-colors cursor-pointer"
                >
                  <i className="bi bi-arrow-counterclockwise"></i> Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {onEditForm && (
          <button 
            onClick={() => onEditForm()} 
            className="bg-[#ff9800] hover:bg-[#e68a00] text-white border-none px-4 py-2 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <i className="bi bi-pencil-square"></i> Edit
          </button>
        )}

        <button 
          onClick={() => window.print()} 
          className="bg-[#4CAF50] hover:bg-[#43a047] text-white border-none px-4 py-2 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5 transition-colors shadow-sm"
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

      {/* ── Main Sheet ── */}
      <div className="bg-white mx-auto shadow-lg font-sans w-[420mm] h-[297mm] box-border p-[4mm] print:w-full print:h-[100vh] print:p-0 print:m-0 print:shadow-none flex flex-col overflow-hidden">
        
        <table className="w-full h-full border-collapse table-fixed border border-black">
          <colgroup>
            <col className="w-[2.2%]" />
            <col className="w-[4.0%]" />
            <col className="w-[14.0%]" />
            <col className="w-[11.0%]" />
            {Array.from({ length: daysInMonth }).map((_, i) => (
              <col key={i} style={{ width: `${61.8 / daysInMonth}%` }} />
            ))}
            <col className="w-[7.0%]" />
          </colgroup>

          <thead className="table-header-group">
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

            <tr className="h-[28px]">
              <th colSpan={4} className={InfoLabel}>REVISION NO.</th>
              <th colSpan={3} className={InfoValue}>00</th>
            </tr>

            <tr className="h-[28px]">
              <th colSpan={4} className={InfoLabel}>DATE</th>
              <th colSpan={3} className={InfoValue}>14.10.2024</th>
            </tr>

            <tr className="h-[24px]">
              <th rowSpan={2} className={TH}>S.<br />NO.</th>
              <th rowSpan={2} className={TH}>M/C<br />NO.</th>
              <th rowSpan={2} className={TH}>POKA YOKE DETAIL</th>
              <th rowSpan={2} className={TH}>CHECKING METHOD</th>
              <th colSpan={dateHeaderSpan1} className={TH}>DATE</th>
              <th colSpan={dateHeaderSpan2} className={TH}></th>
              <th colSpan={dateHeaderSpan3} className={`${TH} text-[#3b5998]`}>MONTH: {appliedMonth}</th>
              <th colSpan={dateHeaderSpan4} className={TH}></th>
            </tr>

            <tr className="h-[20px]">
              {Array.from({ length: daysInMonth }).map((_, i) => (
                <th key={i} className={TH} style={{ fontSize: '8px', padding: '1px 0' }}>{i + 1}</th>
              ))}
              <th className={TH} style={{ fontSize: '8px' }}>Remarks</th>
            </tr>
          </thead>

          <tbody>
            {rowData.map((row, i) => (
              <tr key={i} className="break-inside-avoid">
                <td className={`${TD} font-bold`}>{row.sr_no || i + 1}</td>
                <td className="bg-white text-center align-middle text-[12px] font-bold text-black" style={mcCellStyle(i)}>
                  {i === 2 ? appliedMachine : ''}
                </td>
                <td className={`${TD} text-left pl-2 font-semibold`}>{row.detail || ''}</td>
                <td className={TD}>{row.method || ''}</td>
                {Array.from({ length: daysInMonth }).map((_, d) => (
                  <td key={d} className={TD}>
                    {/* ✅ Agar filter apply nahi hai toh purana data hide rahega */}
                    {appliedMonth ? (row.days?.[d] || '') : ''}
                  </td>
                ))}
                <td className={`${TD} text-left pl-1`}>{row.remarks || ''}</td>
              </tr>
            ))}
          </tbody>

          <tfoot className="table-footer-group">
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