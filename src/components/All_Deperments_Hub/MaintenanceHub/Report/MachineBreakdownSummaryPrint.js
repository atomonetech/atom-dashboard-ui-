import React from 'react';
import { useNavigate } from 'react-router-dom';
const atomone = '/logo1.jpg';

// ── Date format helper: "2024-01-15" → "15/01/2024" ──
const formatDisplay = (dateStr) => {
  if (!dateStr) return '';
  const parts = String(dateStr).split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dateStr;
};


const MIN_ROWS = 19;

const MachineBreakdownSummaryPrint = ({ items = [], currentReport, onEditForm, onBack }) => {
  const navigate = useNavigate();

  // Sort and filter items
  const historyItems = items
    .filter(x => x.sr_no >= 1)
    .sort((a, b) => a.sr_no - b.sr_no);

  const TOTAL_ROWS = Math.max(MIN_ROWS, historyItems.length);

  // ── Common Tailwind Classes for Cells ──
  const TH = 'border border-black font-bold text-center align-middle bg-white text-black px-1 py-2 text-[10px] break-words leading-tight';
  const TD = 'border border-black text-center align-middle px-1 text-black text-[11px] overflow-hidden bg-white';

  const MetaLabel = 'border border-black font-semibold bg-white text-black text-[9px] px-1 py-1 text-left whitespace-nowrap';
  const MetaValue = 'border border-black font-normal bg-white text-black text-[10px] px-1 py-1 text-center whitespace-nowrap';

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-4 text-black flex justify-center print:p-0 print:bg-white overflow-hidden">
      
      
      <div className="flex justify-end items-center gap-3 mb-3 absolute top-4 right-4 print:hidden z-10">
        <button 
          onClick={() => navigate("/maintenance-hub")} 
          className="bg-[#607d8b] hover:bg-[#4d646f] text-white border-none px-5 py-2 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5 transition-colors shadow-md"
        >
          <i className="bi bi-arrow-left-circle-fill"></i> Back
        </button>

        {onEditForm && (
          <button 
            onClick={() => onEditForm(currentReport)} 
            className="bg-[#ff9800] hover:bg-[#e68a00] text-white border-none px-5 py-2 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5 transition-colors shadow-md"
          >
            <i className="bi bi-pencil-square"></i> Edit
          </button>
        )}

        <button 
          onClick={() => window.print()} 
          className="bg-[#4CAF50] hover:bg-[#43a047] text-white border-none px-5 py-2 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5 transition-colors shadow-md"
        >
          <i className="bi bi-printer-fill"></i> Print
        </button>
      </div>

      {/* ── Print Specific CSS (Landscape) ── */}
      <style>{`
        @media print {
          @page { 
            size: A4 landscape; 
            margin: 5mm !important; 
          }
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            background-color: white !important; 
            margin: 0 !important;
            padding: 0 !important;
          }
          html, body {
            height: 100%; 
            page-break-after: avoid;
            page-break-before: avoid;
          }
        }
      `}</style>

      {/* ── Main A4 Print Container ── */}
      
      <div className="bg-white shadow-2xl font-sans w-[297mm] h-[210mm] box-border mx-auto p-[5mm] print:w-full print:h-[100vh] print:p-0 print:shadow-none print:m-0 relative mt-12 print:mt-0 flex flex-col">
        
        
        <table className="w-full border-collapse table-fixed border border-black h-full flex-grow">
          
          <colgroup>
            <col className="w-[4%]" />  {/* S.NO. */}
            <col className="w-[7%]" />  {/* DATE */}
            <col className="w-[18%]" /> {/* MACHINE TYPE & MACHINE NO. */}
            <col className="w-[20%]" /> {/* PROBLEM DESCRIPTION */}
            <col className="w-[14%]" /> {/* TIME PERIOD FOR MAINTENANCE */}
            <col className="w-[12%]" /> {/* STATUS AFTER TIME PERIOD */}
            <col className="w-[9%]" />  {/* UPDATED IN 4M(Y/N) */}
            <col className="w-[7%]" />  {/* SIGN. */}
            <col className="w-[9%]" />  {/* REMARKS */}
          </colgroup>

          {/* ════════════ THEAD ════════════ */}
          <thead className="table-header-group h-fit">
            <tr className="h-[20px]">
              <th colSpan={2} rowSpan={3} className="border border-black p-1 align-middle text-center bg-white">
                <img src={atomone} alt="ATOM ONE" className="max-h-[40px] max-w-full block mx-auto object-contain" />
              </th>
              
              <th colSpan={4} rowSpan={3} className="border border-black text-center align-middle bg-white">
                <h1 className="text-[20px] font-bold uppercase tracking-[1px] m-0 text-black">
                  MACHINE BREAK DOWN SUMMARY
                </h1>
              </th>
              
              <th className={MetaLabel}>DOC NO.</th>
              <th colSpan={2} className={MetaValue}>{currentReport?.doc_no || 'AOT-PROD-MM-01'}</th>
            </tr>

            <tr className="h-[20px]">
              <th className={MetaLabel}>REVISION NO.</th>
              <th colSpan={2} className={MetaValue}>{currentReport?.rev_no || '00'}</th>
            </tr>

            <tr className="h-[20px]">
              <th className={MetaLabel}>ISSUED DATE</th>
              <th colSpan={2} className={MetaValue}>{formatDisplay(currentReport?.doc_date) || '14.10.2024'}</th>
            </tr>

            <tr className="h-[35px]">
              <th className={TH}>S.NO.</th>
              <th className={TH}>DATE</th>
              <th className={TH}>MACHINE TYPE &<br/>MACHINE NO.</th>
              <th className={TH}>PROBLEM DESCRIPTION</th>
              <th className={TH}>TIME PERIOD FOR<br/>MAINTENANCE</th>
              <th className={TH}>STATUS AFTER<br/>TIME PERIOD</th>
              <th className={TH}>UPDATED IN<br/>4M(Y/N)</th>
              <th className={TH}>SIGN.</th>
              <th className={TH}>REMARKS</th>
            </tr>
          </thead>

          {/* ════════════ TBODY ════════════ */}
          
          <tbody>
            {Array.from({ length: TOTAL_ROWS }, (_, i) => {
              const row = historyItems[i] || null;
              
              
              return (
                <tr key={i} className="break-inside-avoid">
                  <td className={`${TD} font-medium`}>{row?.sr_no || (row ? i + 1 : '')}</td>
                  <td className={TD}>{row?.date ? formatDisplay(row.date) : ''}</td>
                  <td className={`${TD} text-left pl-[6px]`}>{row?.machine_details || ''}</td>
                  <td className={`${TD} text-left pl-[6px]`}>{row?.problem_desc || ''}</td>
                  <td className={TD}>{row?.time_period || ''}</td>
                  <td className={TD}>{row?.status_after || ''}</td>
                  <td className={TD}>{row?.update_4m || ''}</td>
                  <td className={TD}>{row?.signature || ''}</td>
                  <td className={`${TD} text-left pl-[4px]`}>{row?.remarks || ''}</td>
                </tr>
              );
            })}
          </tbody>

          {/* ════════════ TFOOT ════════════ */}
          <tfoot className="table-footer-group h-fit">
            <tr>
              <td colSpan={9} className="border border-black p-0 h-[40px] bg-white">
                <div className="flex w-full h-full">
                  <div className="w-1/2 px-4 py-2 flex items-start">
                    <span className="font-bold text-[11px] whitespace-nowrap mr-2 text-black">PREPARED BY :</span>
                    <span className="flex-grow text-[11px] text-black">
                      {currentReport?.prepared_by || ''}
                    </span>
                  </div>
                  <div className="w-1/2 px-4 py-2 flex items-start">
                    <span className="font-bold text-[11px] whitespace-nowrap mr-2 text-black">APPROVED BY :</span>
                    <span className="flex-grow text-[11px] text-black">
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

export default MachineBreakdownSummaryPrint;