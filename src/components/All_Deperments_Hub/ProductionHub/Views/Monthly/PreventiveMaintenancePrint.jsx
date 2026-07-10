import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toSvg } from 'html-to-image';

const atomone = '/logo1.jpg'; // Path to your logo

const PreventiveMaintenancePrint = ({ currentReport, onEditForm }) => {
  const navigate = useNavigate();
  const printRef = useRef(null);

  // ── SVG Print Logic ──
  const handlePrint = async () => {
    const element = printRef.current;
    if (!element) return;

    try {
      const existingIframe = document.getElementById('atomone-print-iframe');
      if (existingIframe) document.body.removeChild(existingIframe);

      const svgDataUrl = await toSvg(element, {
        backgroundColor: '#ffffff',
        width: element.offsetWidth,
        height: element.offsetHeight,
        style: { margin: '0' },
        pixelRatio: 2 
      });

      const iframe = document.createElement('iframe');
      iframe.id = 'atomone-print-iframe';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0px';
      iframe.style.height = '0px';
      iframe.style.border = '0';
      
      document.body.appendChild(iframe);
      
      const iframeDoc = iframe.contentWindow.document;
      iframeDoc.open();
      // Changed to A4 Landscape to fit the wide columns beautifully
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              @media print {
                @page {
                  size: A4 landscape; 
                  margin: 0 !important;
                }
                body {
                  margin: 0 !important;
                  padding: 0 !important;
                  background-color: #ffffff;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: 100vw;
                  height: 100vh;
                }
                img {
                  width: 100%;
                  height: 100%;
                  object-fit: contain;
                  display: block;
                }
              }
            </style>
          </head>
          <body>
            <img src="${svgDataUrl}" onload="setTimeout(() => { window.focus(); window.print(); }, 300);" />
          </body>
        </html>
      `);
      iframeDoc.close();
      
    } catch (error) {
      console.error("Print error:", error);
      alert("Failed to generate print preview.");
    }
  };

  // ── Standardized Tailwind Classes ──
  const BORDER = 'border border-black';
  const TH_CENTER = `${BORDER} font-bold text-center align-middle bg-[#f5f5f5] text-black px-2 py-1 text-[13px] leading-tight`;
  const TD_CENTER = `${BORDER} text-center align-middle px-2 py-1 text-black text-[12px]`;
  const TD_LEFT = `${BORDER} text-left align-middle px-3 py-1 text-black text-[12px]`;
  const TD_RIGHT = `${BORDER} text-right align-middle px-3 py-1 text-black text-[12px] font-bold`;

  // Standard Checkpoints from the image
  const CHECKPOINTS = [
    "Painting",
    "Name Plate",
    "Locking System",
    "Castol wheel",
    "Fork Guide",
    "Plastic pipe (PP) Strip",
    "Transparent Pipe",
    "CUP",
    "Lock Pin"
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-4 text-black flex flex-col">
      
      {/* ── Top Bar (Buttons) ── */}
      <div className="flex justify-end items-center gap-3 mb-3 print:hidden">
        <button
          onClick={() => navigate("/production-hub/monthly")}
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
          onClick={handlePrint}
          className="bg-[#4CAF50] hover:bg-[#43a047] text-white border-none px-5 py-2 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5 transition-colors"
        >
          <i className="bi bi-printer-fill"></i> Print
        </button>
      </div>

      {/* ── Landscape A4 Setup ── */}
      <style>{`
        .print-container-wrapper {
          width: 297mm;  /* A4 Landscape Width */
          height: 210mm; /* A4 Landscape Height */
          padding: 8mm;
          box-sizing: border-box;
          margin: 0 auto;
          overflow: hidden;
          background: white;
          display: flex;
          flex-direction: column;
        }
      `}</style>

      {/* ── Main Print Container ── */}
      <div ref={printRef} className="font-sans box-border mx-auto print-container-wrapper relative">
        <table className="w-full h-full border-collapse table-fixed border-2 border-black bg-white">
          
          {/* 8-Column Grid layout based on the checklist proportions */}
          <colgroup>
            <col className="w-[6%]" />  {/* Sr No */}
            <col className="w-[22%]" /> {/* Check Points */}
            <col className="w-[12%]" /> {/* PM1: Done on */}
            <col className="w-[12%]" /> {/* PM1: Remarks */}
            <col className="w-[12%]" /> {/* PM2: Done on */}
            <col className="w-[12%]" /> {/* PM2: Remarks */}
            <col className="w-[12%]" /> {/* PM3: Done on */}
            <col className="w-[12%]" /> {/* PM3: Remarks */}
          </colgroup>

          <tbody>
            {/* ════════════ HEADER ROW ════════════ */}
            <tr className="h-[40px]">
              <td colSpan={2} className={`${TD_CENTER} p-1 font-bold text-[14px]`}>
                 Atom<br/>One
              </td>
              <td colSpan={6} className={`${TD_CENTER} font-bold text-[16px] uppercase tracking-wide`}>
                PREVENTIVE MAINTANANCE OF MATERIAL HANDLING EQUIPMENT CHECKLIST
              </td>
            </tr>

            {/* ════════════ SUB-HEADER ROW ════════════ */}
            <tr className="h-[30px]">
              <td colSpan={2} className={`${TD_LEFT} font-bold`}>
                Part Name / No. :- <span className="font-normal">{currentReport?.part_name || ''}</span>
              </td>
              <td colSpan={4} className={`${TD_CENTER} font-bold`}>
                Trollelly / Pallet/ Bin/ Tray
              </td>
              <td colSpan={2} className={`${TD_LEFT} font-bold`}>
                P.M. Frequency :- 4 Months
              </td>
            </tr>

            {/* ════════════ TABLE HEADERS ════════════ */}
            <tr className="h-[30px]">
              <td rowSpan={2} className={TH_CENTER}>Sr. No.</td>
              <td rowSpan={2} className={TH_CENTER}>Check Points</td>
              <td colSpan={2} className={TH_CENTER}>PM Status</td>
              <td colSpan={2} className={TH_CENTER}>PM Status</td>
              <td colSpan={2} className={TH_CENTER}>PM Status</td>
            </tr>
            <tr className="h-[30px]">
              <td className={TH_CENTER}>Done on</td>
              <td className={TH_CENTER}>Remarks</td>
              <td className={TH_CENTER}>---------</td>
              <td className={TH_CENTER}>Remarks</td>
              <td className={TH_CENTER}>---------</td>
              <td className={TH_CENTER}>Remarks</td>
            </tr>

            {/* ════════════ CHECKPOINTS (ROWS 1-9) ════════════ */}
            {CHECKPOINTS.map((point, index) => (
              <tr key={index} className="h-[36px]">
                <td className={`${TD_CENTER} font-bold`}>{index + 1}</td>
                <td className={`${TD_LEFT} font-semibold`}>{point}</td>
                
                {/* PM Status 1 */}
                <td className={TD_CENTER}>{currentReport?.pm1?.[index]?.done_on || ''}</td>
                <td className={TD_CENTER}>{currentReport?.pm1?.[index]?.remarks || ''}</td>
                
                {/* PM Status 2 */}
                <td className={TD_CENTER}>{currentReport?.pm2?.[index]?.done_on || ''}</td>
                <td className={TD_CENTER}>{currentReport?.pm2?.[index]?.remarks || ''}</td>
                
                {/* PM Status 3 */}
                <td className={TD_CENTER}>{currentReport?.pm3?.[index]?.done_on || ''}</td>
                <td className={TD_CENTER}>{currentReport?.pm3?.[index]?.remarks || ''}</td>
              </tr>
            ))}

            {/* ════════════ FOOTER: REMARKS & SIGNATURES ════════════ */}
            <tr className="h-[35px]">
              <td colSpan={2} className={TD_RIGHT}>Remarks :</td>
              <td colSpan={2} className={TD_LEFT}>{currentReport?.pm1_general_remarks || ''}</td>
              <td colSpan={2} className={TD_LEFT}>{currentReport?.pm2_general_remarks || ''}</td>
              <td colSpan={2} className={TD_LEFT}>{currentReport?.pm3_general_remarks || ''}</td>
            </tr>
            <tr className="h-[35px]">
              <td colSpan={2} className={TD_RIGHT}>Checked By :</td>
              <td colSpan={2} className={TD_LEFT}>{currentReport?.pm1_checked_by || ''}</td>
              <td colSpan={2} className={TD_LEFT}>{currentReport?.pm2_checked_by || ''}</td>
              <td colSpan={2} className={TD_LEFT}>{currentReport?.pm3_checked_by || ''}</td>
            </tr>
            <tr className="h-[35px]">
              <td colSpan={2} className={TD_RIGHT}>Verified By</td>
              <td colSpan={2} className={TD_LEFT}>{currentReport?.pm1_verified_by || ''}</td>
              <td colSpan={2} className={TD_LEFT}>{currentReport?.pm2_verified_by || ''}</td>
              <td colSpan={2} className={TD_LEFT}>{currentReport?.pm3_verified_by || ''}</td>
            </tr>

            {/* ════════════ LEGEND AREA ════════════ */}
            <tr className="h-[25px]">
              <td colSpan={1} className={TD_CENTER}></td>
              <td colSpan={1} className={TD_LEFT}>Ok</td>
              {/* This blank space fills the remaining grid on the right next to the legend */}
              <td colSpan={6} rowSpan={3} className={`${TD_CENTER} border-0 bg-[#fbfbfb]`}></td>
            </tr>
            <tr className="h-[25px]">
              <td colSpan={1} className={`${TD_CENTER} font-bold`}>X</td>
              <td colSpan={1} className={TD_LEFT}>Not Ok</td>
            </tr>
            <tr className="h-[25px]">
              <td colSpan={1} className={`${TD_CENTER} font-bold`}>NA</td>
              <td colSpan={1} className={TD_LEFT}>Not Required</td>
            </tr>
          </tbody>
        </table>

        {/* Floating Doc No. at the bottom right */}
        <div className="absolute bottom-[2mm] right-[8mm] text-[10px] font-bold">
          {currentReport?.doc_no || 'AOT.F.PROD.08'}
        </div>
      </div>
    </div>
  );
};

export default PreventiveMaintenancePrint;