import React from 'react';
import { useNavigate } from 'react-router-dom';
const atomone = '/logo1.jpg'; // Adjust path if needed

// ── Date format helper ──
const formatDisplay = (dateStr) => {
  if (!dateStr) return '';
  const parts = String(dateStr).split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dateStr;
};

const BinTrollingprint = ({ currentReport, onEditForm, onBack }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  // ── Common Tailwind Classes for Cells (Adjusted for Stretch) ──
  // Removed whitespace-nowrap to prevent boundary bleed in portrait mode
  const TH = 'border border-black font-bold text-center align-middle bg-white text-black px-1 py-1 text-[13px] print:text-[12px] break-words leading-tight';
  const TD = 'border border-black text-center align-middle px-1 py-1 text-black text-[12px] print:text-[11px] break-words';
  const InfoLabel = 'border border-black font-semibold bg-[#f5f5f5] text-black text-[12px] print:text-[11px] px-2 py-1 text-center break-words';
  const InfoValue = 'border border-black font-bold bg-white text-black text-[12px] print:text-[11px] px-2 py-1 text-center break-words';

  // Static checkpoints based on the image
  const checkPoints = [
    { id: 1, text: "Bin / Trolley Should Be Clean Properly", method: "VISUAL" },
    { id: 2, text: "Bin / Trolley Should Be Free From Oil Surface", method: "VISUAL" },
    { id: 3, text: "Bin / Trolley Should Be Free From Dust", method: "VISUAL" },
    { id: 4, text: "Bin /Trolley Should Not Be Damage And Broken", method: "VISUAL" },
    { id: 5, text: "Bin / Trolley Should Be Clean In Bin Cleaning Area", method: "VISUAL" }
  ];

  return (
    <div className="min-h-screen bg-[#e0e0e0] p-4 text-black flex flex-col items-center print:min-h-0 print:p-0 print:bg-white print:block">
      
      {/* ── Top Bar (Buttons) ── */}
      <div className="flex justify-end items-center gap-3 mb-3 print:hidden w-full max-w-[297mm]">
        <button 
          onClick={handleBack}
          className="bg-[#607d8b] hover:bg-[#4d646f] text-white border-none px-5 py-2 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5 transition-colors"
        >
          <i className="bi bi-arrow-left-circle-fill"></i> Back
        </button>

        {onEditForm && (
          <button 
            onClick={() => onEditForm(currentReport)} 
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
          .print-a4-container {
            height: 97vh !important; /* Stretches the table to fill the paper */
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

      {/* ── Main Print Container ── */}
      {/* Added print-a4-container and removed hardcoded print dimensions */}
      <div className="print-a4-container bg-white shadow-lg font-sans mx-auto w-[297mm] h-[210mm] box-border p-[5mm] print:w-full print:max-w-full print:p-[2mm] print:m-0 print:shadow-none flex flex-col justify-between">
        
        <table className="w-full h-full border-collapse table-fixed border-2 border-black">
          <colgroup>
            <col className="w-[6%]" />  {/* SR.NO. */}
            <col className="w-[36%]" /> {/* Check Point */}
            <col className="w-[14%]" /> {/* Checking Method */}
            <col className="w-[7%]" />  {/* W1 */}
            <col className="w-[7%]" />  {/* W2 */}
            <col className="w-[7%]" />  {/* W3 */}
            <col className="w-[7%]" />  {/* W4 */}
            <col className="w-[16%]" /> {/* Remarks */}
          </colgroup>

          {/* ════════════ THEAD (Header Section) ════════════ */}
          <thead className="table-header-group">
            <tr className="h-[25px] print:h-[10mm]">
              <th colSpan={2} rowSpan={3} className="border border-black p-2 align-middle text-center bg-white">
                <img src={atomone} alt="ATOM ONE" className="max-h-[50px] print:max-h-[40px] max-w-full block mx-auto object-contain bg-white" />
              </th>
              
              <th colSpan={4} rowSpan={3} className="border border-black text-center align-middle bg-white px-2">
                <h1 className="text-[18px] print:text-[16px] font-bold tracking-wide m-0 text-black leading-snug">
                  Bin & Trolley Cleaning Check Sheet And<br/>Maintenance Record Sheet
                </h1>
              </th>
              
              <th className={InfoLabel}>Doc</th>
              <th className={InfoValue}>{currentReport?.doc_no || 'ATO-F-PROD-02A'}</th>
            </tr>

            <tr className="h-[20px] print:h-[6mm]">
              <th className={InfoLabel}>Rev.No.</th>
              <th className={InfoValue}>{currentReport?.rev_no || '0'}</th>
            </tr>

            <tr className="h-[20px] print:h-[6mm]">
              <th className={InfoLabel}>Date:-</th>
              <th className={InfoValue}>{formatDisplay(currentReport?.doc_date) || '01.01.2019'}</th>
            </tr>
          </thead>

          {/* ════════════ TBODY ════════════ */}
          <tbody>
            {/* --- Table Headers --- */}
            <tr className="h-[25px] print:h-[8mm]">
              <td rowSpan={2} className={TH}>SR.NO.</td>
              <td rowSpan={2} className={TH}>Check Point</td>
              <td rowSpan={2} className={TH}>Checking Method</td>
              <td colSpan={4} className={TH}>Status (Y/N)</td>
              <td rowSpan={2} className={TH}>Remarks</td>
            </tr>
            <tr className="h-[20px] print:h-[6mm]">
              <td className={TH}>W1</td>
              <td className={TH}>W2</td>
              <td className={TH}>W3</td>
              <td className={TH}>W4</td>
            </tr>

            {/* --- Check Points Loop --- */}
            {checkPoints.map((item) => (
              // Removed hardcoded print heights here so rows flex to fill the page 
              <tr key={item.id} className="h-[28px]">
                <td className={TD}>{item.id}</td>
                <td className={`${TD} text-left px-2 font-medium`}>{item.text}</td>
                <td className={TD}>{item.method}</td>
                <td className={TD}>{currentReport?.w1?.[item.id] || ''}</td>
                <td className={TD}>{currentReport?.w2?.[item.id] || ''}</td>
                <td className={TD}>{currentReport?.w3?.[item.id] || ''}</td>
                <td className={TD}>{currentReport?.w4?.[item.id] || ''}</td>
                <td className={TD}>{currentReport?.remarks?.[item.id] || ''}</td>
              </tr>
            ))}

            {/* Empty Divider Row */}
            <tr className="h-[10px] print:h-[4mm] border-y-[2px] border-black">
              <td colSpan={8} className="bg-[#f5f5f5]"></td>
            </tr>

            {/* ════════════ CLEANING DETAILS SECTION ════════════ */}
            <tr className="h-[25px] bg-[#f5f5f5]">
              <td colSpan={3} className={`${TH} text-[13px] print:text-[12px]`}>Responsibility</td>
              <td className={`${TH} text-[11px] print:text-[10px]`}>Frequency</td>
              <td colSpan={2} className={`${TH} text-[11px] print:text-[10px]`}>Weekly</td>
              <td colSpan={2} className={`${TH} text-[13px] print:text-[12px] text-left pl-2`}>
                Month:- <span className="font-normal">{currentReport?.month || ''}</span>
              </td>
            </tr>

            <tr className="h-[25px]">
              <td colSpan={3} className={`${TH} text-[13px] print:text-[12px]`}>Cleaning Detail</td>
              <td className={TH}>W1</td>
              <td className={TH}>W2</td>
              <td className={TH}>W3</td>
              <td className={TH}>W4</td>
              <td className={TH}>Remarks</td>
            </tr>

            <tr className="h-[25px]">
              <td colSpan={3} className={`${TD} text-left px-2 font-medium`}>Total Bin / Trolley Quantity</td>
              <td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td>
            </tr>
            <tr className="h-[25px]">
              <td colSpan={3} className={`${TD} text-left px-2 font-medium`}>Bin /Trolley Clean Quantity</td>
              <td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td>
            </tr>
            <tr className="h-[25px]">
              <td colSpan={3} className={`${TD} text-left px-2 font-medium`}>Bin/ Trolley Unclean Quantity</td>
              <td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td>
            </tr>
            <tr className="h-[25px]">
              <td colSpan={3} className={`${TH} text-[13px] print:text-[12px]`}>Signature</td>
              <td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td>
            </tr>

            {/* ════════════ MAINTENANCE DETAILS SECTION ════════════ */}
            <tr className="h-[25px] border-t-[2px] border-black bg-[#f5f5f5]">
              <td colSpan={3} className={`${TH} text-[13px] print:text-[12px]`}>Maintenance Detail</td>
              <td className={TH}>W1</td>
              <td className={TH}>W2</td>
              <td className={TH}>W3</td>
              <td className={TH}>W4</td>
              <td className={TH}></td>
            </tr>

            <tr className="h-[25px]">
              <td colSpan={3} className={`${TD} text-left px-2 font-medium`}>Total Bin / Trolley Maintenance Quantity</td>
              <td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td>
            </tr>
            <tr className="h-[25px]">
              <td colSpan={3} className={`${TD} text-left px-2 font-medium`}>Bin /Trolley Ok Quantity</td>
              <td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td>
            </tr>
            <tr className="h-[25px]">
              <td colSpan={3} className={`${TD} text-left px-2 font-medium`}>Bin /Trolley Reject Quantity</td>
              <td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td>
            </tr>
            <tr className="h-[25px]">
              <td colSpan={3} className={`${TH} text-[13px] print:text-[12px]`}>Signature</td>
              <td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td>
            </tr>
          </tbody>

          {/* ════════════ TFOOT (Signatures) ════════════ */}
          <tfoot className="table-footer-group">
            <tr>
              <td colSpan={8} className="border border-black p-0 h-[40px] print:h-[12mm] bg-white">
                <div className="flex w-full h-full">
                  
                  {/* Left Half: Prepared By */}
                  <div className="w-[50%] border-r-2 border-black px-3 py-2 flex items-start">
                    <span className="font-bold text-[13px] print:text-[12px] break-words mr-2 text-black uppercase">Prepared By :-</span>
                    <span className="flex-grow text-[13px] print:text-[12px] text-black">
                      {currentReport?.prepared_by || ''}
                    </span>
                  </div>

                  {/* Right Half: Approved By */}
                  <div className="w-[50%] px-3 py-2 flex items-start">
                    <span className="font-bold text-[13px] print:text-[12px] break-words mr-2 text-black uppercase">APPROVED BY :-</span>
                    <span className="flex-grow text-[13px] print:text-[12px] text-black">
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

export default BinTrollingprint;