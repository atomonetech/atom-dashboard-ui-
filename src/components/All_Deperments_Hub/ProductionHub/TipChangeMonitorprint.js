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

// Based on the image, we have about 16 rows on the left and 16 on the right
const ROWS_PER_SIDE = 21;

const TipChangeMonitorprint = ({ items = [], currentReport, onEditForm, onBack }) => {
  const navigate = useNavigate();



  // Common Tailwind Classes
  const TH = 'border border-black font-bold text-center align-middle bg-[#f2f2f2] text-black px-0.5 py-1 text-[9px] uppercase leading-tight';
  const TD = 'border border-black text-center align-middle px-1 py-1 text-black text-[10px] h-[28px]';
  const InfoLabel = 'border border-black font-bold bg-[#f2f2f2] text-black text-[10px] px-2 py-1 text-left';
  const InfoValue = 'border border-black font-medium bg-white text-black text-[10px] px-2 py-1 text-center';

  return (
    <div className="min-h-screen bg-gray-200 p-4 text-black flex justify-center">
      
      <div className="w-full max-w-[287mm]">
        {/* ── Action Buttons (Hidden on Print) ── */}
        <div className="flex justify-end gap-3 mb-4 print:hidden">
          <button onClick={() => navigate("/production-hub")} className="bg-gray-600 text-white px-4 py-2 rounded font-bold text-sm">Back</button>
          {onEditForm && <button onClick={() => onEditForm(currentReport)} className="bg-orange-500 text-white px-4 py-2 rounded font-bold text-sm">Edit</button>}
          <button onClick={() => window.print()} className="bg-green-600 text-white px-4 py-2 rounded font-bold text-sm">Print</button>
        </div>

        <style>{`
          @media print {
            @page { size: A4 landscape; margin: 5mm; }
            body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          }
        `}</style>

        {/* ── A4 Landscape Container ── */}
        {/* YAHAN SE min-h-[200mm] HATA DIYA GAYA HAI */}
        <div className="bg-white shadow-xl w-full p-[5mm] print:p-0 print:shadow-none">
          
          <table className="w-full border-collapse border border-black table-fixed">
            {/* Column definitions for the double-sided table (Total 100%) */}
            <colgroup>
              <col className="w-[3%]" /> <col className="w-[7%]" /> <col className="w-[12%]" /> <col className="w-[4%]" /> 
              <col className="w-[5%]" /> <col className="w-[5%]" /> <col className="w-[6%]" /> <col className="w-[8%]" />
              <col className="w-[3%]" /> <col className="w-[7%]" /> <col className="w-[12%]" /> <col className="w-[4%]" /> 
              <col className="w-[5%]" /> <col className="w-[5%]" /> <col className="w-[6%]" /> <col className="w-[8%]" />
            </colgroup>

            <thead>
              {/* Main Header */}
              <tr>
                <th colSpan={3} rowSpan={3} className="border border-black p-2">
                  <img src={atomone} alt="Logo" className="max-h-12 mx-auto" />
                </th>
                <th colSpan={8} rowSpan={3} className="border border-black text-center px-2">
                  <h1 className="text-lg font-bold">TIP CHANGE & DRESSING MONITORING SHEET</h1>
                  <p className="text-[10px] font-bold mt-1">(DRESSING FREQ: AFTER 900 NOS)</p>
                </th>
                <th colSpan={2} rowSpan={3} className={InfoLabel}>M/C NO: <span className="font-normal underline ml-2">{currentReport?.mc_no}</span></th>
                <th colSpan={2} className={InfoLabel}>DOC. NO.</th>
                <th colSpan={1} className={InfoValue}>{currentReport?.doc_no || 'AOT-F-QA-58'}</th>
              </tr>
              <tr>
                <th colSpan={2} className={InfoLabel}>REVISION NO.</th>
                <th colSpan={1} className={InfoValue}>{currentReport?.rev_no || '00'}</th>
              </tr>
              <tr>
                <th colSpan={2} className={InfoLabel}>DATE</th>
                <th colSpan={1} className={InfoValue}>{formatDisplay(currentReport?.doc_date) || '01.09.2025'}</th>
              </tr>

              {/* Sub-Headers */}
              <tr>
                {/* Left Side */}
                <th className={TH}>S.NO</th>
                <th className={TH}>DATE</th>
                <th className={TH}>PART NAME</th>
                <th className={TH}>PRD QTY</th>
                <th className={TH}>TIP CHANGE</th>
                <th className={TH}>TIP DRESSING</th>
                <th className={TH}>DRESSING STATUS</th>
                <th className={TH}>SIGN (QA)</th>
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
                  <tr key={i} className="h-[28px]">
                    {/* Left Side Content */}
                    <td className={TD}>{i + 1}</td>
                    <td className={TD}>{left.date ? formatDisplay(left.date) : ''}</td>
                    <td className={`${TD} text-left text-[9px] leading-tight`}>{left.part_name}</td>
                    <td className={TD}>{left.prd_qty}</td>
                    <td className={TD}>{left.tip_change}</td>
                    <td className={TD}>{left.tip_dressing}</td>
                    <td className={TD}>{left.dressing_status}</td>
                    <td className={TD}>{left.sign}</td>

                    {/* Right Side Content */}
                    <td className={TD}>{i + 1 + ROWS_PER_SIDE}</td>
                    <td className={TD}>{right.date ? formatDisplay(right.date) : ''}</td>
                    <td className={`${TD} text-left text-[9px] leading-tight`}>{right.part_name}</td>
                    <td className={TD}>{right.prd_qty}</td>
                    <td className={TD}>{right.tip_change}</td>
                    <td className={TD}>{right.tip_dressing}</td>
                    <td className={TD}>{right.dressing_status}</td>
                    <td className={TD}>{right.sign}</td>
                  </tr>
                );
              })}
            </tbody>

            <tfoot>
              <tr>
                <td colSpan={16} className="border border-black p-0">
                  <div className="flex w-full min-h-[50px] font-bold text-[11px]">
                    <div className="w-1/2 border-r border-black p-3 flex items-end">
                      <span>PREPARED BY:</span>
                      <span className="ml-2 flex-grow border-b border-black text-center">{currentReport?.prepared_by}</span>
                    </div>
                    <div className="w-1/2 p-3 flex items-end">
                      <span>APPROVED BY:</span>
                      <span className="ml-2 flex-grow border-b border-black text-center">{currentReport?.approved_by}</span>
                    </div>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TipChangeMonitorprint;