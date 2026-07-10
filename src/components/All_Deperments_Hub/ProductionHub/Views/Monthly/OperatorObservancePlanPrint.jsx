import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toSvg } from 'html-to-image';

const atomone = '/logo1.jpg';

const formatDisplay = (dateStr) => {
  if (!dateStr) return '';
  const parts = String(dateStr).split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dateStr;
};

const OperatorObservancePlanPrint = ({ currentReport, items = [], onEditForm }) => {
  const navigate = useNavigate();
  const printRef = useRef(null);

  // Default months representing the 2024-2025 plan (Fixes the ##### Excel error from screenshot)
  const MONTHS = [
    "Apr-24", "May-24", "Jun-24", "Jul-24", "Aug-24", "Sep-24",
    "Oct-24", "Nov-24", "Dec-24", "Jan-25", "Feb-25", "Mar-25"
  ];

  // Fill up to 18 rows to make the table look full on the A4 page
  const MIN_ROWS = 18;
  const tableRows = items.length > 0 ? items : Array.from({ length: MIN_ROWS });

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
      // Using A4 Landscape to fit the 12 months perfectly
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

  // ── Tailwind Class Helpers ──
  const BORDER = 'border border-black';
  const TH_CENTER = `${BORDER} font-bold text-center align-middle text-black px-1 py-1 text-[11px] leading-tight`;
  const TD_CENTER = `${BORDER} text-center align-middle px-1 py-1 text-black text-[11px]`;
  const TD_LEFT = `${BORDER} text-left align-middle px-2 py-1 text-black text-[11px]`;

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

      <style>{`
        .print-container-wrapper {
          width: 297mm;  /* A4 Landscape Width */
          height: 210mm; /* A4 Landscape Height */
          padding: 8mm;
          box-sizing: border-box;
          margin: 0 auto;
          overflow: hidden;
          background: white;
        }
      `}</style>

      {/* ── Main A4 Print Container ── */}
      <div ref={printRef} className="font-sans box-border mx-auto print-container-wrapper">
        <table className="w-full h-full border-collapse table-fixed border border-black bg-white">
          
          {/* 15-Column Grid */}
          <colgroup>
            <col className="w-[4%]" />  {/* 1: S.NO */}
            <col className="w-[16%]" /> {/* 2: OPERATOR NAME */}
            <col className="w-[14%]" /> {/* 3: DEPARTMENT */}
            {/* 12 Months Columns: Each ~5.5% */}
            {[...Array(12)].map((_, i) => (
              <col key={i} className="w-[5.5%]" />
            ))}
          </colgroup>

          <tbody>
            {/* ════════════ HEADER SECTION ════════════ */}
            <tr className="h-[25px]">
              <td colSpan={3} rowSpan={3} className={`${TD_CENTER} p-1 bg-white`}>
                <img src={atomone} alt="ATOM ONE" className="max-h-[40px] max-w-[120px] block mx-auto object-contain" />
              </td>
              <td colSpan={9} rowSpan={3} className={`${TD_CENTER}`}>
                <h1 className="text-[18px] font-bold uppercase m-0 leading-tight tracking-wide">
                  OPERATOR OBSERVANCE PLAN 2024-2025
                </h1>
              </td>
              <td colSpan={1} className={`${TD_CENTER} font-semibold text-[10px]`}>Doc.No</td>
              <td colSpan={2} className={`${TD_CENTER} font-semibold text-[10px]`}>{currentReport?.doc_no || 'AOT-F-TR-03A'}</td>
            </tr>
            <tr className="h-[25px]">
              <td colSpan={1} className={`${TD_CENTER} font-semibold text-[10px]`}>Rev.No.</td>
              <td colSpan={2} className={`${TD_CENTER} font-semibold text-[10px]`}>{currentReport?.rev_no || '00'}</td>
            </tr>
            <tr className="h-[25px]">
              <td colSpan={1} className={`${TD_CENTER} font-semibold text-[10px]`}>Date</td>
              <td colSpan={2} className={`${TD_CENTER} font-semibold text-[10px]`}>{formatDisplay(currentReport?.doc_date) || '14.10.2024'}</td>
            </tr>

            {/* ════════════ TABLE HEADERS ════════════ */}
            <tr className="h-[35px]">
              <td className={TH_CENTER}>S.NO.</td>
              <td className={TH_CENTER}>OPERATOR NAME</td>
              <td className={TH_CENTER}>DEPARTMENT</td>
              {MONTHS.map((month, idx) => (
                <td key={idx} className={TH_CENTER}>{month}</td>
              ))}
            </tr>

            {/* ════════════ DATA ROWS ════════════ */}
            {tableRows.map((row, i) => (
              <tr key={i} className="h-[30px]">
                <td className={`${TD_CENTER} font-bold`}>{row ? i + 1 : ''}</td>
                <td className={TD_LEFT}>{row?.operator_name || ''}</td>
                <td className={TD_LEFT}>{row?.department || ''}</td>
                {/* 12 Checkbox / Data cells */}
                {[...Array(12)].map((_, colIdx) => (
                  <td key={colIdx} className={TD_CENTER}>
                    {/* Render hollow circle for plan, solid circle for actual, or leave blank based on data */}
                    {row?.months?.[colIdx] === 'Plan' ? '○' : row?.months?.[colIdx] === 'Actual' ? '●' : ''}
                  </td>
                ))}
              </tr>
            ))}

            {/* ════════════ FOOTER: LEGENDS & SIGNATURES ════════════ */}
            <tr className="h-[30px] font-bold">
              <td colSpan={3} className={`${TD_CENTER} text-[13px] tracking-wider`}>LEGENDS</td>
              <td colSpan={2} className={`${TD_LEFT} border-r-0`}>Plan</td>
              <td colSpan={1} className={`${TD_CENTER} text-[14px] border-l-0`}>○</td>
              <td colSpan={3} className={TD_CENTER}></td>
              <td colSpan={2} className={`${TD_LEFT} border-r-0 text-[#0066cc]`}>Actual</td>
              <td colSpan={1} className={`${TD_CENTER} text-[14px] border-l-0`}>●</td>
              <td colSpan={3} className={TD_CENTER}></td>
            </tr>
            <tr className="h-[40px] align-top">
              <td colSpan={7} className={`${TD_LEFT} border-t-0 font-semibold text-[10px] pt-1`}>
                Prepared By: <span className="ml-2 font-normal">{currentReport?.prepared_by || ''}</span>
              </td>
              <td colSpan={8} className={`${TD_LEFT} border-t-0 font-semibold text-[10px] pt-1`}>
                Approved By: <span className="ml-2 font-normal">{currentReport?.approved_by || ''}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OperatorObservancePlanPrint;