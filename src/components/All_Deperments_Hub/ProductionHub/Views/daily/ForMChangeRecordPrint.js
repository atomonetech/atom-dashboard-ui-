// ============================================================
//  ForMChangeRecordPrint.js
//  4M Change Record Sheet — Multi-Page Ready (A3/A4 Adaptive)
//  Expanded Upper Table | Empty Outline Circles | Compressed Lower Table
// ============================================================

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const atomone = '/logo1.jpg'; // Path to your logo

// ── Default Mock Data ──
const defaultMonth = 11; // November
const defaultYear = 2022;

// Map status values to CSS classes for the CIRCLES
const STATUS_COLORS = {
  'NO_CHANGE': 'bg-[#00b050] border-[#00b050]', // Green Circle
  'CHANGE': 'bg-[#ff3333] border-[#ff3333]',    // Red Circle
  'NO_PLAN': 'bg-transparent border-gray-300',  // Empty Outline Circle
};

// Example status data from Backend
const defaultStatusData = {
  MAN: { 1: 'NO_CHANGE', 2: 'NO_CHANGE', 15: 'CHANGE', 16: 'NO_CHANGE' },
  MACHINE: { 5: 'CHANGE', 6: 'NO_CHANGE' },
  MATERIAL: { 12: 'NO_CHANGE' },
  METHOD: { 20: 'CHANGE' },
};

// Default empty array for backend data
const defaultDetailRows = []; 

const ForMChangeRecordPrint = ({ 
  month = defaultMonth, 
  year = defaultYear, 
  statusData = defaultStatusData,
  detailData = defaultDetailRows, 
  onEditForm 
}) => {
  const navigate = useNavigate();

  // Calculate days in month
  const daysInMonth = useMemo(() => {
    return new Date(year, month, 0).getDate(); 
  }, [month, year]);

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const displayMonthYear = `${monthNames[month - 1]} ${year}`;

  // ── Common Tailwind Classes ──
  const TH = 'border border-black font-bold text-center align-middle bg-white text-black px-1 py-1 text-[10px] leading-tight break-words';
  // Removed print:h-[5.5mm] so the browser can stretch the rows dynamically
  const TDLOWER = 'border border-black text-center align-middle bg-white px-0 py-0 text-black text-[10px] h-[18px] break-words'; 
  const V_TEXT = '[writing-mode:vertical-rl] transform rotate-180 text-center mx-auto whitespace-nowrap py-0.5';

  // Helper to render the colored/empty circle inside a cell
  const renderCircleCell = (category, day) => {
    const status = statusData?.[category]?.[day] || 'NO_PLAN';
    const circleColorClass = STATUS_COLORS[status];
    
    return (
      <td key={`${category}-${day}`} className="border border-black text-center align-middle p-0">
        <div className="w-full h-full flex items-center justify-center">
          <div className={`w-[28px] h-[28px] print:w-[24px] print:h-[24px] rounded-full border-[2px] ${circleColorClass}`}></div>
        </div>
      </td>
    );
  };

  // Logic to ensure table structure remains by padding with empty rows
  const MIN_ROWS = 6; 
  const tableDataToRender = [...(detailData || [])];
  
  while (tableDataToRender.length < MIN_ROWS) {
    tableDataToRender.push({
      date: '', time: '', mcNo: '', changeDesc: '', nature: '', action: '',
      partName: '', opNo: '', retroQtyChk: '', retroQtyOk: '', retroRw: '',
      contQtyChk: '', contQtyOk: '', contRw: '', sigQa: '', sigProd: '', sigPlant: '', remarks: ''
    });
  }

  return (
    <div className="min-h-screen bg-[#e0e0e0] p-4 text-black flex flex-col items-center print:min-h-0 print:p-0 print:bg-white print:block">
      
      {/* ── Top Bar (Buttons) ── */}
      <div className="flex justify-end items-center gap-3 mb-3 print:hidden w-full max-w-[420mm]">
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

          /* Apply the full-page stretch */
          .print-a3-container {
            height: 97vh !important; 
            display: flex;
            flex-direction: column;
            margin: 0 auto !important; 
            page-break-inside: avoid;
          }

          /* Forces the lower table to stretch and fill all remaining vertical space */
          .stretch-table {
            height: 100% !important;
          }
        }
      `}</style>

      {/* ── Main Print Container ── */}
      {/* Replaced hardcoded print:h-[100vh] with the fluid print-a3-container */}
      <div className="print-a3-container bg-white font-sans w-[420mm] h-[297mm] box-border p-[4mm] print:w-full print:max-w-full print:p-[2mm] print:m-0 print:shadow-none flex flex-col">
        
        <div className="border-[2px] border-black flex flex-col h-full">
          
          {/* ================= HEADER SECTION ================= */}
          <table className="w-full border-collapse">
            <colgroup>
              <col className="w-[15%]" />
              <col className="w-[65%]" />
              <col className="w-[20%]" />
            </colgroup>
            <tbody>
              <tr>
                <td className="border-b border-r border-black p-2 align-middle text-center h-[50px] print:h-[12mm]">
                  <img src={atomone} alt="ATOM ONE" className="max-h-[40px] print:max-h-[30px] max-w-full block mx-auto object-contain" />
                </td>
                <td className="border-b border-r border-black text-center align-middle">
                  <h1 className="text-[30px] print:text-[22px] font-bold tracking-[1px] m-0 text-black">4M Change Record Sheet</h1>
                </td>
                <td className="border-b border-black text-left align-middle text-[12px] print:text-[10px] font-semibold">
                  <div className="border-b border-black p-1">Doc No: AOT-F-4M-05</div>
                  <div className="border-b border-black p-1">Rev. No.: 01</div>
                  <div className="p-1">Date: 01.11.22</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* ================= UPPER TABLE (BIGGER) ================= */}
          <table className="w-full border-collapse table-fixed border-b-[2px] border-b-black flex-shrink-0">
            <colgroup>
              <col className="w-[3%]" />
              <col className="w-[10%]" />
              {daysArray.map(d => (
                 <col key={`col-day-${d}`} style={{ width: `${72 / daysInMonth}%` }} />
              ))}
              <col className="w-[15%]" />
            </colgroup>
            <tbody>
              <tr className="h-[30px] print:h-[8mm]">
                <td rowSpan={2} className={`${TH} border-r text-[12px] print:text-[10px]`}>S.No</td>
                <td rowSpan={2} className={`${TH} border-r text-[12px] print:text-[10px]`}>Category of Change</td>
                <td colSpan={daysInMonth} className={`${TH} border-r text-[16px] print:text-[12px]`}>Month/Year:- <strong>{displayMonthYear}</strong></td>
                <td rowSpan={2} className={`${TH} text-[14px] print:text-[12px]`}>LEGEND</td>
              </tr>
              <tr className="h-[25px] print:h-[6mm]">
                {daysArray.map(day => (
                  <td key={`day-head-${day}`} className={`${TH} border-r border-t text-[12px] print:text-[9px] font-bold`}>{day}</td>
                ))}
              </tr>

              <tr className="h-[60px] print:h-[16mm]">
                <td className={`${TH} font-bold text-[14px] print:text-[11px]`}>1</td>
                <td className={`${TH} font-bold text-[14px] print:text-[11px]`}>MAN</td>
                {daysArray.map(day => renderCircleCell('MAN', day))}
                <td className={`${TH} text-left px-5 print:px-2`}>
                  <div className="flex items-center justify-between w-[80%] print:w-[90%] mx-auto">
                    <span className="font-bold text-[12px] print:text-[10px]">NO CHANGE</span>
                    <div className="w-[24px] h-[24px] rounded-full border-[2px] border-[#00b050] bg-[#00b050]"></div>
                  </div>
                </td>
              </tr>

              <tr className="h-[60px] print:h-[16mm]">
                <td className={`${TH} font-bold text-[14px] print:text-[11px]`}>2</td>
                <td className={`${TH} font-bold text-[14px] print:text-[11px]`}>MACHINE</td>
                {daysArray.map(day => renderCircleCell('MACHINE', day))}
                <td className={`${TH} text-left px-5 print:px-2`}>
                  <div className="flex items-center justify-between w-[80%] print:w-[90%] mx-auto">
                    <span className="font-bold text-[12px] print:text-[10px]">CHANGE</span>
                    <div className="w-[24px] h-[24px] rounded-full border-[2px] border-[#ff3333] bg-[#ff3333]"></div>
                  </div>
                </td>
              </tr>

              <tr className="h-[60px] print:h-[16mm]">
                <td className={`${TH} font-bold text-[14px] print:text-[11px]`}>3</td>
                <td className={`${TH} font-bold text-[14px] print:text-[11px]`}>MATERIAL</td>
                {daysArray.map(day => renderCircleCell('MATERIAL', day))}
                <td className={`${TH} text-left px-5 print:px-2`}>
                  <div className="flex items-center justify-between w-[80%] print:w-[90%] mx-auto">
                    <span className="font-bold text-[12px] print:text-[10px]">NO PLAN</span>
                    <div className="w-[24px] h-[24px] rounded-full border-[2px] border-black bg-white"></div>
                  </div>
                </td>
              </tr>

              <tr className="h-[60px] print:h-[16mm]">
                <td className={`${TH} font-bold text-[14px] print:text-[11px]`}>4</td>
                <td className={`${TH} font-bold text-[14px] print:text-[11px]`}>METHOD</td>
                {daysArray.map(day => renderCircleCell('METHOD', day))}
                <td className={`${TH}`}></td>
              </tr>
            </tbody>
          </table>

          {/* ================= LOWER TABLE (SMALLER / STRETCHES) ================= */}
          <div className="text-center font-bold text-[12px] print:text-[10px] py-0.5 border-b-[2px] border-black bg-[#f0f0f0]">
            4M Change Detail
          </div>

          {/* Added stretch-table class here */}
          <table className="w-full stretch-table border-collapse table-fixed flex-grow">
            <colgroup>
              <col className="w-[6%]" />
              <col className="w-[5%]" />
              <col className="w-[6%]" />
              <col className="w-[14%]" />
              <col className="w-[10%]" />
              <col className="w-[10%]" />
              <col className="w-[4%]" />
              <col className="w-[4%]" />
              <col className="w-[3%]" /><col className="w-[3%]" /><col className="w-[3%]" />
              <col className="w-[3%]" /><col className="w-[3%]" /><col className="w-[3%]" />
              <col className="w-[4%]" /><col className="w-[4%]" /><col className="w-[4%]" />
              <col className="w-[11%]" />
            </colgroup>
            
            <thead className="table-header-group">
              <tr className="h-[18px]">
                <th rowSpan={2} className={TH}>Date</th>
                <th rowSpan={2} className={TH}>Time</th>
                <th rowSpan={2} className={TH}>M/c No.</th>
                <th rowSpan={2} className={TH}>Change Description</th>
                <th rowSpan={2} className={TH}>Nature of Change</th>
                <th rowSpan={2} className={TH}>Action Taken</th>
                <th rowSpan={2} className={TH}><div className={V_TEXT}>Part Name</div></th>
                <th rowSpan={2} className={TH}><div className={V_TEXT}>Op. No.</div></th>
                <th colSpan={3} className={TH}>Retroactive</th>
                <th colSpan={3} className={TH}>Containment</th>
                <th rowSpan={2} className={TH}><div className={V_TEXT}>Sig QA</div></th>
                <th rowSpan={2} className={TH}><div className={V_TEXT}>Sig Prod</div></th>
                <th rowSpan={2} className={TH}><div className={V_TEXT}>Sig Plant</div></th>
                <th rowSpan={2} className={TH}>Remarks</th>
              </tr>
              <tr className="h-[18px]">
                <th className={TH}><div className={V_TEXT}>Qty Chk</div></th>
                <th className={TH}><div className={V_TEXT}>Qty Ok</div></th>
                <th className={TH}><div className={V_TEXT}>R/W</div></th>
                <th className={TH}><div className={V_TEXT}>Qty Chk</div></th>
                <th className={TH}><div className={V_TEXT}>Qty Ok</div></th>
                <th className={TH}><div className={V_TEXT}>R/W</div></th>
              </tr>
            </thead>
            
            <tbody>
              {tableDataToRender.map((row, i) => (
                <tr key={i}>
                  <td className={TDLOWER}>{row.date || '\u00A0'}</td>
                  <td className={TDLOWER}>{row.time || '\u00A0'}</td>
                  <td className={TDLOWER}>{row.mcNo || '\u00A0'}</td>
                  <td className={`${TDLOWER} text-left px-1`}>{row.changeDesc || '\u00A0'}</td>
                  <td className={`${TDLOWER} text-left px-1`}>{row.nature || '\u00A0'}</td>
                  <td className={`${TDLOWER} text-left px-1`}>{row.action || '\u00A0'}</td>
                  <td className={TDLOWER}>{row.partName || '\u00A0'}</td>
                  <td className={TDLOWER}>{row.opNo || '\u00A0'}</td>
                  <td className={TDLOWER}>{row.retroQtyChk || '\u00A0'}</td>
                  <td className={TDLOWER}>{row.retroQtyOk || '\u00A0'}</td>
                  <td className={TDLOWER}>{row.retroRw || '\u00A0'}</td>
                  <td className={TDLOWER}>{row.contQtyChk || '\u00A0'}</td>
                  <td className={TDLOWER}>{row.contQtyOk || '\u00A0'}</td>
                  <td className={TDLOWER}>{row.contRw || '\u00A0'}</td>
                  <td className={TDLOWER}>{row.sigQa || '\u00A0'}</td>
                  <td className={TDLOWER}>{row.sigProd || '\u00A0'}</td>
                  <td className={TDLOWER}>{row.sigPlant || '\u00A0'}</td>
                  <td className={TDLOWER}>{row.remarks || '\u00A0'}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
};

export default ForMChangeRecordPrint;