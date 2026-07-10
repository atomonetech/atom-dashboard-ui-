import React from 'react';
import { useNavigate } from 'react-router-dom';

// Logo path
const atomone = '/logo1.jpg';

// Helper to format date
const formatDisplay = (dateStr) => {
  if (!dateStr) return '';
  const parts = String(dateStr).split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dateStr;
};

// Based on the image, we have about 21 rows on the left and 21 on the right
const ROWS_PER_SIDE = 21;

const TipChangeMonitorprint = ({ items = [], currentReport, onEditForm, onBack }) => {
  const navigate = useNavigate();

  // ── Adjusted Tailwind Classes for Print Stretch ──
  // Removed strict hardcoded heights and 'whitespace-nowrap' so the columns can flex and squeeze if needed
  const TH = 'border border-black font-bold text-center align-middle bg-[#f2f2f2] text-black px-0.5 py-0.5 text-[9px] print:text-[8px] uppercase leading-tight break-words';
  const TD = 'border border-black text-center align-middle px-1 py-0.5 text-black text-[10px] print:text-[9px] break-words';
  const InfoLabel = 'border border-black font-bold bg-[#f2f2f2] text-black text-[10px] print:text-[9px] px-2 py-1 text-left uppercase break-words';
  const InfoValue = 'border border-black font-medium bg-white text-black text-[10px] print:text-[9px] px-2 py-1 text-center break-words';

  return (
    <div className="min-h-screen bg-[#e0e0e0] p-4 text-black flex flex-col items-center print:min-h-0 print:p-0 print:bg-white print:block">
      
      {/* ── Action Buttons (Hidden on Print) ── */}
      <div className="flex justify-end gap-3 mb-4 print:hidden w-full max-w-[297mm]">
        <button 
          onClick={() => { if(onBack) onBack(); else navigate("/production-hub"); }} 
          className="bg-[#607d8b] hover:bg-[#4d646f] text-white px-5 py-2 rounded-md font-bold text-sm transition-colors flex items-center gap-1.5"
        >
          <i className="bi bi-arrow-left-circle-fill"></i> Back
        </button>
        {onEditForm && (
          <button 
            onClick={() => onEditForm(currentReport)} 
            className="bg-[#ff9800] hover:bg-[#e68a00] text-white px-5 py-2 rounded-md font-bold text-sm transition-colors flex items-center gap-1.5"
          >
            <i className="bi bi-pencil-square"></i> Edit
          </button>
        )}
        <button 
          onClick={() => window.print()} 
          className="bg-[#4CAF50] hover:bg-[#43a047] text-white px-5 py-2 rounded-md font-bold text-sm transition-colors flex items-center gap-1.5"
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
          
          /* Apply the full-page stretch to BOTH Landscape and Portrait */
          .print-a4-container {
            height: 97vh !important; /* Stretches the table to fill 97% of the paper height */
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin: 0 auto !important; 
            page-break-inside: avoid;
          }

          /* Ensures the table itself forces its rows to distribute the extra height evenly */
          table {
            height: 100% !important;
          }
        }
      `}</style>

      {/* ── Main A4 Container ── */}
      {/* Changed hardcoded print dimensions to fluid w-full / h-auto */}
      <div className="print-a4-container bg-white shadow-lg font-sans mx-auto w-[297mm] h-[210mm] box-border p-[5mm] print:w-full print:max-w-full print:p-[2mm] print:m-0 print:shadow-none flex flex-col justify-between">
        
        <table className="w-full h-full border-collapse border-2 border-black table-fixed">
          {/* Column definitions for the double-sided table (Total 100%) */}
          <colgroup>
            {/* Left Side (50%) */}
            <col className="w-[3%]" /> <col className="w-[7%]" /> <col className="w-[13%]" /> <col className="w-[4%]" /> 
            <col className="w-[5%]" /> <col className="w-[5%]" /> <col className="w-[6%]" /> <col className="w-[7%]" />
            {/* Right Side (50%) */}
            <col className="w-[3%]" /> <col className="w-[7%]" /> <col className="w-[13%]" /> <col className="w-[4%]" /> 
            <col className="w-[5%]" /> <col className="w-[5%]" /> <col className="w-[6%]" /> <col className="w-[7%]" />
          </colgroup>

          <thead className="table-header-group">
            {/* Main Header */}
            <tr className="h-[25px] print:h-[8mm]">
              <th colSpan={3} rowSpan={3} className="border border-black p-1 align-middle text-center bg-white">
                <img src={atomone} alt="Logo" className="max-h-[40px] print:max-h-[30px] block mx-auto object-contain bg-white" />
              </th>
              <th colSpan={8} rowSpan={3} className="border border-black text-center px-2 align-middle bg-white">
                <h1 className="text-[18px] print:text-[16px] font-bold tracking-wide m-0 text-black leading-snug">
                  TIP CHANGE & DRESSING MONITORING SHEET
                </h1>
                <p className="text-[10px] print:text-[9px] font-bold m-0 mt-0.5 tracking-wider">
                  (DRESSING FREQ: AFTER 900 NOS)
                </p>
              </th>
              <th colSpan={2} rowSpan={3} className={InfoLabel}>
                M/C NO: <span className="font-bold underline ml-1">{currentReport?.mc_no}</span>
              </th>
              <th colSpan={2} className={InfoLabel}>DOC. NO.</th>
              <th colSpan={1} className={InfoValue}>{currentReport?.doc_no || 'AOT-F-QA-58'}</th>
            </tr>
            <tr className="h-[20px] print:h-[6mm]">
              <th colSpan={2} className={InfoLabel}>REVISION NO.</th>
              <th colSpan={1} className={InfoValue}>{currentReport?.rev_no || '00'}</th>
            </tr>
            <tr className="h-[20px] print:h-[6mm]">
              <th colSpan={2} className={InfoLabel}>DATE</th>
              <th colSpan={1} className={InfoValue}>{formatDisplay(currentReport?.doc_date) || '01.09.2025'}</th>
            </tr>

            {/* Sub-Headers */}
            <tr className="h-[24px] print:h-[7mm]">
              {/* Left Side */}
              <th className={TH}>S.NO</th>
              <th className={TH}>DATE</th>
              <th className={TH}>PART NAME</th>
              <th className={TH}>PRD QTY</th>
              <th className={TH}>TIP CHANGE</th>
              <th className={TH}>TIP DRESSING</th>
              <th className={TH}>DRESSING STATUS</th>
              <th className={`${TH} border-r-[3px] border-r-black`}>SIGN (QA)</th>
              {/* Right Side */}
              <th className={TH}>S.NO</th>
              <th className={TH}>DATE</th>
              <th className={TH}>PART NAME</th>
              <th className={TH}>PRD QTY</th>
              <th className={TH}>TIP CHANGE</th>
              <th className={TH}>TIP DRESSING</th>
              <th className={TH}>DRESSING STATUS</th>
              <th className={TH}>SIGN (QA)</th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: ROWS_PER_SIDE }, (_, i) => {
              const left = items[i] || {};
              const right = items[i + ROWS_PER_SIDE] || {};
              
              return (
                <tr key={i} className="break-inside-avoid">
                  {/* Left Side Content */}
                  <td className={TD}>{i + 1}</td>
                  <td className={TD}>{left.date ? formatDisplay(left.date) : ''}</td>
                  <td className={`${TD} text-left px-1.5 font-medium leading-[1.1]`}>{left.part_name}</td>
                  <td className={TD}>{left.prd_qty}</td>
                  <td className={TD}>{left.tip_change}</td>
                  <td className={TD}>{left.tip_dressing}</td>
                  <td className={TD}>{left.dressing_status}</td>
                  <td className={`${TD} border-r-[3px] border-r-black`}>{left.sign}</td>

                  {/* Right Side Content */}
                  <td className={TD}>{i + 1 + ROWS_PER_SIDE}</td>
                  <td className={TD}>{right.date ? formatDisplay(right.date) : ''}</td>
                  <td className={`${TD} text-left px-1.5 font-medium leading-[1.1]`}>{right.part_name}</td>
                  <td className={TD}>{right.prd_qty}</td>
                  <td className={TD}>{right.tip_change}</td>
                  <td className={TD}>{right.tip_dressing}</td>
                  <td className={TD}>{right.dressing_status}</td>
                  <td className={TD}>{right.sign}</td>
                </tr>
              );
            })}
          </tbody>

          <tfoot className="table-footer-group">
            <tr>
              <td colSpan={16} className="border-t-[2px] border-black p-0 h-[45px] print:h-[12mm] bg-white">
                <div className="flex w-full h-full font-bold text-[12px] print:text-[11px]">
                  
                  {/* Prepared By */}
                  <div className="w-[50%] border-r-[3px] border-black px-3 flex items-center justify-start">
                    <span className="mr-2 uppercase">PREPARED BY:</span>
                    <span className="flex-grow border-b border-black text-left px-2 font-medium">
                      {currentReport?.prepared_by || ''}
                    </span>
                  </div>
                  
                  {/* Approved By */}
                  <div className="w-[50%] px-3 flex items-center justify-start">
                    <span className="mr-2 uppercase">APPROVED BY:</span>
                    <span className="flex-grow border-b border-black text-left px-2 font-medium">
                      {currentReport?.approved_by || ''}
                    </span>
                  </div>

                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default TipChangeMonitorprint;