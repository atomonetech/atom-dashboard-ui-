import React from 'react';
import { useNavigate } from 'react-router-dom';
const atomone = '/logo1.jpg'; // Adjust your logo path if needed

// ── Date format helper: "2024-01-15" → "15/01/2024" ──
const formatDisplay = (dateStr) => {
  if (!dateStr) return '';
  const parts = String(dateStr).split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dateStr;
};

const MIN_ROWS = 30;

const ToolHistoryReport = ({ items = [], currentReport, onEditForm, onBack }) => {
  const navigate = useNavigate();

  // Sort and filter items based on your logic
  const historyItems = items
    .filter(x => x.sr_no >= 1)
    .sort((a, b) => a.sr_no - b.sr_no);

  const TOTAL_ROWS = Math.max(MIN_ROWS, historyItems.length);

  // ── Common Tailwind Classes for Cells ──
  const TH = 'border border-black font-bold text-center align-middle bg-white text-black px-1 py-1 text-[10px] break-words leading-tight uppercase';
  const TD = 'border border-black text-center align-middle px-1 py-1 text-black text-[11px] overflow-hidden';

  const MetaLabel = 'border border-black font-semibold bg-white text-black text-[10px] px-1 py-1 text-center whitespace-nowrap';
  const MetaValue = 'border border-black font-bold bg-white text-black text-[10px] px-1 py-1 text-center whitespace-nowrap';

  const InfoLabel = "border border-black text-left align-middle bg-white px-2 py-1 text-[10px] uppercase font-bold text-black whitespace-nowrap";
  const InfoValue = "border border-black text-left align-middle bg-white px-2 py-1 text-[11px] font-normal text-black";

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-4 text-black flex justify-center print:p-0 print:bg-white">
      
      {/* ── Top Bar (Buttons) - Hidden in Print ── */}
      <div className="flex justify-end items-center gap-3 mb-3 absolute top-4 right-4 print:hidden">
        <button 
          onClick={() => onBack ? onBack() : navigate(-1)} 
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
        }
      `}</style>

      {/* ── Main A4 Print Container ── */}
      <div className="bg-white shadow-2xl font-sans w-[210mm] min-h-[297mm] box-border mx-auto p-[6mm] print:w-full print:min-h-0 print:h-auto print:p-0 print:shadow-none print:m-0 relative mt-12 print:mt-0">
        
        <table className="w-full border-collapse table-fixed border border-black">
          {/* Defined Colgroup to perfectly align vertical lines as per the image */}
          <colgroup>
            <col className="w-[9%]" />  {/* 1. DATE / PART NAME Label */}
            <col className="w-[7%]" />  {/* 2. PROD. */}
            <col className="w-[15%]" /> {/* 3. RESHARPENING STROKE */}
            <col className="w-[19%]" /> {/* 4. CUMULATIVE PROD. */}
            <col className="w-[18%]" /> {/* 5. PROBLEM REPORTED / CUSTOMER NAME Label */}
            <col className="w-[16%]" /> {/* 6. ACTION TAKEN */}
            <col className="w-[8%]" />  {/* 7. UPDATED IN 4M */}
            <col className="w-[8%]" />  {/* 8. REMARKS */}
          </colgroup>

          {/* ════════════ THEAD ════════════ */}
          <thead className="table-header-group">
            {/* Top Header / Logo Area */}
            <tr className="h-[22px]">
              <th colSpan={2} rowSpan={3} className="border border-black p-1 align-middle text-center bg-white">
                <img src={atomone} alt="ATOM ONE" className="max-h-[45px] max-w-full block mx-auto object-contain" />
              </th>
              
              <th colSpan={4} rowSpan={3} className="border border-black text-center align-middle bg-white">
                <h1 className="text-[20px] font-bold uppercase tracking-[1px] m-0 text-black">
                  TOOL HISTORY CARD
                </h1>
              </th>
              
              <th className={MetaLabel}>Doc.No.</th>
              <th className={MetaValue}>{currentReport?.doc_no || 'AOT-F-TM-01'}</th>
            </tr>

            <tr className="h-[22px]">
              <th className={MetaLabel}>Rev.No.</th>
              <th className={MetaValue}>{currentReport?.rev_no || '00'}</th>
            </tr>

            <tr className="h-[22px]">
              <th className={MetaLabel}>DATE</th>
              <th className={MetaValue}>{formatDisplay(currentReport?.doc_date) || '14.10.2024'}</th>
            </tr>

            {/* Tool Information Fields mapped precisely to table columns */}
            <tr className="h-[26px]">
              <th className={InfoLabel}>PART NAME</th>
              <th colSpan={3} className={InfoValue}>{currentReport?.part_name || ''}</th>
              <th className={InfoLabel}>CUSTOMER NAME</th>
              <th colSpan={3} className={InfoValue}>{currentReport?.customer_name || ''}</th>
            </tr>

            <tr className="h-[26px]">
              <th className={InfoLabel}>PART NO.</th>
              <th colSpan={3} className={InfoValue}>{currentReport?.part_no || ''}</th>
              <th className={InfoLabel}>ESTIMATED TOOL LIFE</th>
              <th colSpan={3} className={InfoValue}>{currentReport?.estimated_tool_life || ''}</th>
            </tr>

            <tr className="h-[26px]">
              <th className={InfoLabel}>TOOL NAME</th>
              <th colSpan={3} className={InfoValue}>{currentReport?.tool_name || ''}</th>
              <th className={InfoLabel}>ESTIMATED MAINTENANCE FREQUENCY</th>
              <th colSpan={3} className={InfoValue}>{currentReport?.estimated_maintenance_frequency || ''}</th>
            </tr>

            <tr className="h-[26px]">
              <th className={InfoLabel}>MODEL</th>
              <th colSpan={3} className={InfoValue}>{currentReport?.model || ''}</th>
              <th colSpan={4} className={InfoValue}></th> {/* Empty right span to match image */}
            </tr>

            {/* Data Columns Header */}
            <tr className="h-[35px]">
              <th className={TH}>DATE</th>
              <th className={TH}>PROD.</th>
              <th className={TH}>RESHARPENING<br/>STROKE</th>
              <th className={TH}>CUMULATIVE<br/>PROD. TILL DATE</th>
              <th className={TH}>PROBLEM REPORTED IF<br/>ANY</th>
              <th className={TH}>ACTION TAKEN</th>
              <th className={TH}>UPDATED IN 4M<br/>RECORD(Y/N)</th>
              <th className={TH}>REMARKS</th>
            </tr>
          </thead>

          {/* ════════════ TBODY ════════════ */}
          <tbody>
            {Array.from({ length: TOTAL_ROWS }, (_, i) => {
              const row = historyItems[i] || null;
              
              return (
                <tr key={i} className="h-[26px] break-inside-avoid">
                  <td className={`${TD} bg-white`}>{row?.date ? formatDisplay(row.date) : ''}</td>
                  <td className={`${TD} bg-white`}>{row?.prod || ''}</td>
                  <td className={`${TD} bg-white`}>{row?.resharpening_stroke || ''}</td>
                  <td className={`${TD} bg-white`}>{row?.cumulative_prod || ''}</td>
                  <td className={`${TD} bg-white text-left pl-[6px]`}>{row?.problem || ''}</td>
                  <td className={`${TD} bg-white text-center`}>{row?.action_taken || (i === 0 && !row ? '----' : '')}</td>
                  <td className={`${TD} bg-white`}>{row?.update_4m || ''}</td>
                  <td className={`${TD} bg-white text-left pl-[4px]`}>{row?.remarks || ''}</td>
                </tr>
              );
            })}
          </tbody>

          {/* ════════════ TFOOT ════════════ */}
          <tfoot className="table-footer-group">
            <tr>
              <td colSpan={8} className="border border-black p-0 h-[40px] bg-white">
                <div className="flex w-full h-full">
                  <div className="w-1/2 border-r border-black px-3 py-3 flex items-start">
                    <span className="font-bold text-[11px] whitespace-nowrap mr-2 text-black uppercase">PREPARED BY :</span>
                    <span className="flex-grow text-[11px] text-black">
                      {currentReport?.prepared_by || ''}
                    </span>
                  </div>
                  <div className="w-1/2 px-3 py-3 flex items-start">
                    <span className="font-bold text-[11px] whitespace-nowrap mr-2 text-black uppercase">APPROVED BY :</span>
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

export default ToolHistoryReport;