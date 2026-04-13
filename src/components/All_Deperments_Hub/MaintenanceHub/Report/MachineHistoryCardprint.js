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


const MIN_ROWS = 30;

const MachineHistoryCardprint = ({ items = [], currentReport, onEditForm, onBack }) => {
  const navigate = useNavigate();

  // Sort and filter items
  const historyItems = items
    .filter(x => x.sr_no >= 1)
    .sort((a, b) => a.sr_no - b.sr_no);

  const TOTAL_ROWS = Math.max(MIN_ROWS, historyItems.length);

  // ── Common Tailwind Classes for Cells ──
  const TH = 'border border-black font-bold text-center align-middle bg-white text-black px-1 py-1 text-[11px] break-words leading-tight';
  const TD = 'border border-black text-center align-middle px-1 py-1 text-black text-[11px] overflow-hidden';

  const MetaLabel = 'border border-black font-semibold bg-white text-black text-[10px] px-1 py-1 text-center';
  const MetaValue = 'border border-black font-normal bg-white text-black text-[10px] px-1 py-1 text-center';

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-4 text-black flex justify-center print:p-0 print:bg-white">
      
      {/* ── Top Bar (Buttons) - Print में यह छिप जाएगा ── */}
      <div className="flex justify-end items-center gap-3 mb-3 absolute top-4 right-4 print:hidden">
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

      {/* ── Print Specific CSS ── */}
      <style>{`
        @media print {
          @page { 
            size: A4 portrait; 
            margin: 6mm !important; 
          }
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            background-color: white !important; 
            margin: 0 !important;
          }
        
          table {
            border-bottom: 1px solid black !important;
          }
          tfoot tr:last-child td {
            border-bottom: 1px solid black !important;
          }
        }
      `}</style>

      {/* ── Main A4 Print Container ── */}
      {/*  FIX 3: print:min-h-0 और print:h-auto जोड़ा गया है ताकि दूसरा ब्लैंक पेज न आए */}
      <div className="bg-white shadow-2xl font-sans w-[210mm] min-h-[297mm] box-border mx-auto p-[6mm] print:w-full print:min-h-0 print:h-auto print:p-0 print:shadow-none print:m-0 relative mt-12 print:mt-0">
        
        <table className="w-full border-collapse table-fixed border border-black">
          <colgroup>
            <col className="w-[6%]" />  {/* Sr. No. */}
            <col className="w-[10%]" /> {/* Date */}
            <col className="w-[24%]" /> {/* Problem */}
            <col className="w-[24%]" /> {/* Action Taken */}
            <col className="w-[10%]" /> {/* Update in 4M */}
            <col className="w-[10%]" /> {/* Signature */}
            <col className="w-[16%]" /> {/* Remarks */}
          </colgroup>

          {/* ════════════ THEAD ════════════ */}
          <thead className="table-header-group">
            <tr className="h-[22px]">
              <th colSpan={2} rowSpan={3} className="border border-black p-1 align-middle text-center bg-white">
                <img src={atomone} alt="ATOM ONE" className="max-h-[45px] max-w-full block mx-auto object-contain" />
              </th>
              
              <th colSpan={3} rowSpan={3} className="border border-black text-center align-middle bg-white">
                <h1 className="text-[18px] font-bold uppercase tracking-[1px] m-0 text-black">
                  MACHINE HISTORY CARD
                </h1>
              </th>
              
              <th className={MetaLabel}>Doc.no.</th>
              <th className={MetaValue}>{currentReport?.doc_no || 'AOT-F-MM-02'}</th>
            </tr>

            <tr className="h-[22px]">
              <th className={MetaLabel}>Rev.no.</th>
              <th className={MetaValue}>{currentReport?.rev_no || '00'}</th>
            </tr>

            <tr className="h-[22px]">
              <th className={MetaLabel}>Date</th>
              <th className={MetaValue}>{formatDisplay(currentReport?.doc_date) || '14.10.2024'}</th>
            </tr>

            <tr className="h-[26px]">
              <th colSpan={3} className="border border-black text-left align-middle bg-white px-2 py-1 text-[11px] font-bold">
                Machine Name &nbsp;&nbsp;: <span className="font-normal">{currentReport?.machine_name || ''}</span>
              </th>
              <th colSpan={4} className="border border-black text-left align-middle bg-white px-2 py-1 text-[11px] font-bold">
                Machine No. &nbsp;&nbsp;&nbsp;&nbsp;: <span className="font-normal">{currentReport?.machine_no || ''}</span>
              </th>
            </tr>

            <tr className="h-[26px]">
              <th colSpan={3} className="border border-black text-left align-middle bg-white px-2 py-1 text-[11px] font-bold">
                Machine Specs &nbsp;: <span className="font-normal">{currentReport?.machine_specs || ''}</span>
              </th>
              <th colSpan={4} className="border border-black text-left align-middle bg-white px-2 py-1 text-[11px] font-bold">
                Location &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <span className="font-normal">{currentReport?.location || ''}</span>
              </th>
            </tr>

            <tr className="h-[35px]">
              <th className={TH}>Sr. No.</th>
              <th className={TH}>Date</th>
              <th className={TH}>Problem</th>
              <th className={TH}>Action Taken</th>
              <th className={TH}>Update in 4M<br />record(Y/N)</th>
              <th className={TH}>Signature</th>
              <th className={TH}>Remarks</th>
            </tr>
          </thead>

          {/* ════════════ TBODY ════════════ */}
          <tbody>
            {Array.from({ length: TOTAL_ROWS }, (_, i) => {
              const row = historyItems[i] || null;
              
              return (
                <tr key={i} className="h-[26px] break-inside-avoid">
                  <td className={`${TD} bg-white font-medium`}>{row?.sr_no || (row ? i + 1 : '')}</td>
                  <td className={`${TD} bg-white`}>{row?.date ? formatDisplay(row.date) : ''}</td>
                  <td className={`${TD} bg-white text-left pl-[6px]`}>{row?.problem || ''}</td>
                  <td className={`${TD} bg-white text-left pl-[6px]`}>{row?.action_taken || ''}</td>
                  <td className={`${TD} bg-white`}>{row?.update_4m || ''}</td>
                  <td className={`${TD} bg-white`}>{row?.signature || ''}</td>
                  <td className={`${TD} bg-white text-left pl-[4px]`}>{row?.remarks || ''}</td>
                </tr>
              );
            })}
          </tbody>

          {/* ════════════ TFOOT ════════════ */}
          <tfoot className="table-footer-group">
            <tr className="h-[20px]">
              <td colSpan={7} className="border border-black text-center text-[10px] font-bold bg-[#f9f9f9]">
                REVISION DETAIL:
              </td>
            </tr>
            <tr className="h-[20px]">
              <th className="border border-black text-center text-[10px] font-bold bg-white">REV NO.</th>
              <th colSpan={2} className="border border-black text-center text-[10px] font-bold bg-white">DESCRIPTION</th>
              <th className="border border-black text-center text-[10px] font-bold bg-white">DATE</th>
              <th className="border border-black text-center text-[10px] font-bold bg-white">SIGN</th>
              <th colSpan={2} className="border border-black text-center text-[10px] font-bold bg-white"></th>
            </tr>
            <tr className="h-[24px]">
              <td className="border border-black text-center text-[10px] bg-white">{currentReport?.rev_no_hist || '1'}</td>
              <td colSpan={2} className="border border-black text-center text-[10px] bg-white">{currentReport?.rev_desc || '4M CHECKPOINT ADDED'}</td>
              <td className="border border-black text-center text-[10px] bg-white">{currentReport?.rev_date || ''}</td>
              <td className="border border-black text-center text-[10px] bg-white">{currentReport?.rev_sign || ''}</td>
              <td colSpan={2} className="border border-black text-center text-[10px] bg-white"></td>
            </tr>

            <tr>
              <td colSpan={7} className="border border-black p-0 h-[40px] bg-white">
                <div className="flex w-full h-full">
                  <div className="w-1/2 border-r border-black px-3 py-3 flex items-start">
                    <span className="font-bold text-[11px] whitespace-nowrap mr-2 text-black">PREPARED BY :</span>
                    <span className="flex-grow text-[11px] text-black">
                      {currentReport?.prepared_by || ''}
                    </span>
                  </div>
                  <div className="w-1/2 px-3 py-3 flex items-start">
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

export default MachineHistoryCardprint;