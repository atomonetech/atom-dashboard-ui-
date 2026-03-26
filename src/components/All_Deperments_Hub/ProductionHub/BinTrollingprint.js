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

  // ── Common Tailwind Classes for Cells ──
  const TH = 'border border-black font-bold text-center align-middle bg-white text-black px-1 py-1 text-[13px] break-words leading-tight';
  const TD = 'border border-black text-center align-middle px-1 py-1 text-black text-[12px]';
  const InfoLabel = 'border border-black font-semibold bg-white text-black text-[12px] px-2 py-1 text-center whitespace-nowrap';
  const InfoValue = 'border border-black font-bold bg-white text-black text-[12px] px-2 py-1 text-center whitespace-nowrap';

  // Static checkpoints based on the image
  const checkPoints = [
    { id: 1, text: "Bin / Trolley Should Be Clean Properly", method: "VISUAL" },
    { id: 2, text: "Bin / Trolley Should Be Free From Oil Surface", method: "VISUAL" },
    { id: 3, text: "Bin / Trolley Should Be Free From Dust", method: "VISUAL" },
    { id: 4, text: "Bin /Trolley Should Not Be Damage And Broken", method: "VISUAL" },
    { id: 5, text: "Bin / Trolley Should Be Clean In Bin Cleaning Area", method: "VISUAL" }
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-4 text-black">
      
      {/* ── Top Bar (Buttons) ── */}
      <div className="flex justify-end items-center gap-3 mb-3 print:hidden">
        <button 
          onClick={() => navigate("/production-hub")}
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
          @page { size: A4 landscape; margin: 8mm; }
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            background-color: white; 
          }
        }
      `}</style>

      {/* ── Main A4 Print Container ── */}
      <div className="bg-white mx-auto shadow-lg font-sans w-[297mm] min-h-[210mm] box-border p-[5mm] print:w-full print:p-0 print:m-0 print:shadow-none print:block">
        
        <table className="w-full border-collapse table-fixed border-2 border-black">
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
            <tr className="h-[30px]">
              <th colSpan={2} rowSpan={3} className="border border-black p-2 align-middle text-center bg-white">
                {/* Fallback styling just in case logo image doesn't load to match the Atom One blue/yellow block */}
                <img src={atomone} alt="ATOM ONE" className="max-h-[60px] max-w-full block mx-auto object-contain bg-white" />
              </th>
              
              <th colSpan={4} rowSpan={3} className="border border-black text-center align-middle bg-white px-2">
                <h1 className="text-[20px] font-bold tracking-wide m-0 text-black leading-snug">
                  Bin & Trolley Cleaning Check Sheet And<br/>Maintenance Record Sheet
                </h1>
              </th>
              
              <th className={InfoLabel}>Doc</th>
              <th className={InfoValue}>{currentReport?.doc_no || 'ATO-F-PROD-02A'}</th>
            </tr>

            <tr className="h-[28px]">
              <th className={InfoLabel}>Rev.No.</th>
              <th className={InfoValue}>{currentReport?.rev_no || '0'}</th>
            </tr>

            <tr className="h-[28px]">
              <th className={InfoLabel}>Date:-</th>
              <th className={InfoValue}>{formatDisplay(currentReport?.doc_date) || '01.01.2019'}</th>
            </tr>
          </thead>

          {/* ════════════ TBODY ════════════ */}
          <tbody>
            {/* --- Table Headers --- */}
            <tr className="h-[35px]">
              <td rowSpan={2} className={TH}>SR.NO.</td>
              <td rowSpan={2} className={TH}>Check Point</td>
              <td rowSpan={2} className={TH}>Checking Method</td>
              <td colSpan={4} className={TH}>Status (Y/N)</td>
              <td rowSpan={2} className={TH}>Remarks</td>
            </tr>
            <tr className="h-[30px]">
              <td className={TH}>W1</td>
              <td className={TH}>W2</td>
              <td className={TH}>W3</td>
              <td className={TH}>W4</td>
            </tr>

            {/* --- Check Points Loop --- */}
            {checkPoints.map((item) => (
              <tr key={item.id} className="h-[32px]">
                <td className={TD}>{item.id}</td>
                <td className={`${TD} text-center`}>{item.text}</td>
                <td className={TD}>{item.method}</td>
                {/* W1 to W4 & Remarks Checkboxes/Empty space */}
                <td className={TD}>{currentReport?.w1?.[item.id] || ''}</td>
                <td className={TD}>{currentReport?.w2?.[item.id] || ''}</td>
                <td className={TD}>{currentReport?.w3?.[item.id] || ''}</td>
                <td className={TD}>{currentReport?.w4?.[item.id] || ''}</td>
                <td className={TD}>{currentReport?.remarks?.[item.id] || ''}</td>
              </tr>
            ))}

            {/* Empty Divider Row */}
            <tr className="h-[15px] border-y-[2px] border-black">
              <td colSpan={8} className="bg-white"></td>
            </tr>

            {/* ════════════ CLEANING DETAILS SECTION ════════════ */}
            <tr className="h-[30px]">
              <td colSpan={3} className={`${TH} text-[14px]`}>Responsibility</td>
              <td className={`${TH} text-[11px]`}>Frequency</td>
              <td colSpan={2} className={`${TH} text-[11px]`}>Weekly</td>
              <td colSpan={2} className={`${TH} text-[14px] text-left pl-2`}>
                Month:- <span className="font-normal">{currentReport?.month || ''}</span>
              </td>
            </tr>

            <tr className="h-[30px]">
              <td colSpan={3} className={`${TH} text-[14px]`}>Cleaning Detail</td>
              <td className={TH}>W1</td>
              <td className={TH}>W2</td>
              <td className={TH}>W3</td>
              <td className={TH}>W4</td>
              <td className={TH}>Remarks</td>
            </tr>

            <tr className="h-[32px]">
              <td colSpan={3} className={TD}>Total Bin / Trolley Quantity</td>
              <td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td>
            </tr>
            <tr className="h-[32px]">
              <td colSpan={3} className={TD}>Bin /Trolley Clean Quantity</td>
              <td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td>
            </tr>
            <tr className="h-[32px]">
              <td colSpan={3} className={TD}>Bin/ Trolley Unclean Quantity</td>
              <td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td>
            </tr>
            <tr className="h-[32px]">
              <td colSpan={3} className={`${TH} text-[14px]`}>Signature</td>
              <td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td>
            </tr>

            {/* ════════════ MAINTENANCE DETAILS SECTION ════════════ */}
            <tr className="h-[30px] border-t-[2px] border-black">
              <td colSpan={3} className={`${TH} text-[14px]`}>Maintenance Detail</td>
              <td className={TH}>W1</td>
              <td className={TH}>W2</td>
              <td className={TH}>W3</td>
              <td className={TH}>W4</td>
              <td className={TH}></td>
            </tr>

            <tr className="h-[32px]">
              <td colSpan={3} className={TD}>Total Bin / Trolley Maintenance Quantity</td>
              <td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td>
            </tr>
            <tr className="h-[32px]">
              <td colSpan={3} className={TD}>Bin /Trolley Ok Quantity</td>
              <td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td>
            </tr>
            <tr className="h-[32px]">
              <td colSpan={3} className={TD}>Bin /Trolley Reject Quantity</td>
              <td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td>
            </tr>
            <tr className="h-[32px]">
              <td colSpan={3} className={`${TD} font-semibold`}>Signature</td>
              <td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td>
            </tr>
          </tbody>

          {/* ════════════ TFOOT (Signatures) ════════════ */}
          <tfoot className="table-footer-group">
            <tr>
              <td colSpan={8} className="border border-black p-0 h-[45px] bg-white">
                <div className="flex w-full h-full">
                  
                  {/* Left Half: Prepared By */}
                  <div className="w-[45%] border-r border-black px-3 py-2 flex items-center">
                    <span className="font-bold text-[14px] whitespace-nowrap mr-2 text-black">Prepared By :-</span>
                    <span className="flex-grow text-[14px] text-black">
                      {currentReport?.prepared_by || ''}
                    </span>
                  </div>

                  {/* Right Half: Approved By */}
                  <div className="w-[55%] px-3 py-2 flex items-center">
                    <span className="font-bold text-[14px] whitespace-nowrap mr-2 text-black">APPROVED BY :-</span>
                    <span className="flex-grow text-[14px] text-black">
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