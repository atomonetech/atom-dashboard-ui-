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

const MonthlyProcessValidationPrint = ({ currentReport, onEditForm }) => {
  const navigate = useNavigate();
  const printRef = useRef(null);

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
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              @media print {
                @page {
                  size: A4 portrait;
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

  // ── Condensed Tailwind Classes ──
  // Reduced padding (py-[2px]) and font sizes (text-[10px]) to save vertical space
  const BORDER = 'border border-black';
  const TH_CENTER = `${BORDER} font-bold text-center align-middle text-black px-1 py-[2px] text-[10px] leading-tight`;
  const TD_CENTER = `${BORDER} text-center align-middle px-1 py-[2px] text-black text-[10px]`;
  const TD_LEFT = `${BORDER} text-left align-middle px-1 py-[2px] text-black text-[10px]`;
  const SECTION_TITLE = `${BORDER} font-bold text-left align-middle bg-[#f0f0f0] text-black px-1 py-[2px] text-[11px] uppercase`;

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-4 text-black flex flex-col">
      
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
          width: 210mm;
          height: 297mm;
          padding: 5mm; /* Reduced outer padding slightly */
          box-sizing: border-box;
          margin: 0 auto;
          overflow: hidden;
          background: white;
        }
      `}</style>

      <div ref={printRef} className="font-sans box-border mx-auto print-container-wrapper">
        <table className="w-full h-full border-collapse table-fixed border border-black bg-white">
          <colgroup>
            <col className="w-[5%]" />  
            <col className="w-[6%]" />  
            <col className="w-[6%]" />  
            <col className="w-[6%]" />  
            <col className="w-[6%]" />  
            <col className="w-[6%]" />  
            <col className="w-[6%]" />  
            <col className="w-[6%]" />  
            <col className="w-[6%]" />  
            <col className="w-[12%]" /> 
            <col className="w-[12%]" /> 
            <col className="w-[23%]" /> 
          </colgroup>

          <tbody>
            {/* ════════════ HEADER SECTION ════════════ */}
            {/* Row heights reduced from 24px to 20px */}
            <tr className="h-[20px]">
              <td colSpan={3} rowSpan={3} className={`${TD_CENTER} p-0.5`}>
                <img src={atomone} alt="ATOM ONE" className="max-h-[35px] max-w-full block mx-auto object-contain" />
              </td>
              <td colSpan={6} rowSpan={3} className={`${TD_CENTER}`}>
                <h1 className="text-[14px] font-bold uppercase m-0 leading-tight tracking-wide">
                  MANUFACTURING PROCESS VALIDATION REPORT
                </h1>
              </td>
              <td colSpan={1} className={`${TD_LEFT} font-bold`}>DOC. NO.</td>
              <td colSpan={2} className={`${TD_LEFT}`}>{currentReport?.doc_no || 'AOT/F/PROD/05'}</td>
            </tr>
            <tr className="h-[20px]">
              <td colSpan={1} className={`${TD_LEFT} font-bold`}>REV. NO.</td>
              <td colSpan={2} className={`${TD_LEFT}`}>{currentReport?.rev_no || '00'}</td>
            </tr>
            <tr className="h-[20px]">
              <td colSpan={1} className={`${TD_LEFT} font-bold`}>DATE:</td>
              <td colSpan={2} className={`${TD_LEFT}`}>{formatDisplay(currentReport?.doc_date) || '14.10.2024'}</td>
            </tr>

            {/* ════════════ DOCUMENT METADATA ════════════ */}
            <tr className="h-[20px]">
              <td colSpan={3} className={`${TD_CENTER} font-bold`}>validation Date :-</td>
              <td colSpan={4} className={`${TD_LEFT} font-semibold`}>{formatDisplay(currentReport?.val_date) || ''}</td>
              <td colSpan={3} className={`${TD_CENTER} font-bold`}>Next Re-validation Due Date :-</td>
              <td colSpan={2} className={`${TD_LEFT} font-semibold`}>{formatDisplay(currentReport?.next_val_date) || ''}</td>
            </tr>
            
            <tr className="h-[20px]">
              <td colSpan={2} className={`${TD_LEFT} text-[9px] font-bold`}>Process :-</td>
              <td colSpan={5} className={`${TD_LEFT}`}>{currentReport?.process || ''}</td>
              <td colSpan={2} className={`${TD_LEFT} text-[9px] font-bold`}>Material Details :-</td>
              <td colSpan={3} className={`${TD_LEFT}`}>{currentReport?.material_details || ''}</td>
            </tr>
            <tr className="h-[20px]">
              <td colSpan={2} className={`${TD_LEFT} text-[9px] font-bold`}>M/C :-</td>
              <td colSpan={5} className={`${TD_LEFT}`}>{currentReport?.machine || ''}</td>
              <td colSpan={2} className={`${TD_LEFT} text-[9px] font-bold`}>Process Owner :-</td>
              <td colSpan={3} className={`${TD_LEFT}`}>{currentReport?.process_owner || ''}</td>
            </tr>
            <tr className="h-[20px]">
              <td colSpan={2} className={`${TD_LEFT} text-[9px] font-bold`}>Part Name :-</td>
              <td colSpan={5} className={`${TD_LEFT}`}>{currentReport?.part_name || ''}</td>
              <td colSpan={2} className={`${TD_LEFT} text-[9px] font-bold`}>Tooling / Fixture No. :-</td>
              <td colSpan={3} className={`${TD_LEFT}`}>{currentReport?.tooling_no || ''}</td>
            </tr>

            {/* ════════════ M/C OPERATORS ════════════ */}
            {/* Reduced heights to 18px */}
            <tr className="h-[18px]">
              <td colSpan={12} className={`${TH_CENTER} text-[11px] uppercase bg-[#f0f0f0]`}>M/C OPERATORS</td>
            </tr>
            <tr className="h-[18px]">
              <td colSpan={1} className={`${TD_CENTER} font-bold`}>1</td>
              <td colSpan={5} className={`${TD_LEFT}`}>{currentReport?.operator_1 || ''}</td>
              <td colSpan={1} className={`${TD_CENTER} font-bold`}>3</td>
              <td colSpan={5} className={`${TD_LEFT}`}>{currentReport?.operator_3 || ''}</td>
            </tr>
            <tr className="h-[18px]">
              <td colSpan={1} className={`${TD_CENTER} font-bold`}>2</td>
              <td colSpan={5} className={`${TD_LEFT}`}>{currentReport?.operator_2 || ''}</td>
              <td colSpan={1} className={`${TD_CENTER} font-bold`}>4</td>
              <td colSpan={5} className={`${TD_LEFT}`}>{currentReport?.operator_4 || ''}</td>
            </tr>

            {/* ════════════ MANUFACTURING PROCESS PARAMETERS (Table 1) ════════════ */}
            <tr className="h-[18px]">
              <td colSpan={12} className={SECTION_TITLE}>MANUFACTURING PROCESS PARAMETERS :</td>
            </tr>
            <tr className="h-[24px] bg-[#fafafa]">
              <td colSpan={1} className={TH_CENTER}>Process<br/>Parameter<br/>No.</td>
              <td colSpan={8} className={TH_CENTER}>Process Parameter Specification</td>
              <td colSpan={2} className={TH_CENTER}>Unit of Measurement</td>
              <td colSpan={1} className={TH_CENTER}>Remarks</td>
            </tr>
            {[...Array(8)].map((_, i) => (
              <tr key={`p1-${i}`} className="h-[18px]">
                <td colSpan={1} className={`${TD_CENTER} font-bold`}>P{i + 1}</td>
                <td colSpan={8} className={TD_LEFT}>{currentReport?.initial_params?.[i]?.spec || ''}</td>
                <td colSpan={2} className={TD_CENTER}>{currentReport?.initial_params?.[i]?.uom || ''}</td>
                <td colSpan={1} className={TD_LEFT}>{currentReport?.initial_params?.[i]?.remarks || ''}</td>
              </tr>
            ))}

            {/* ════════════ TRIALS / EXPERIMENTS ════════════ */}
            <tr className="h-[18px]">
              <td colSpan={12} className={SECTION_TITLE}>TRIALS / EXPERIMENTS :</td>
            </tr>
            <tr className="h-[20px] bg-[#fafafa]">
              <td colSpan={1} rowSpan={2} className={TH_CENTER}>Trial No</td>
              <td colSpan={8} className={TH_CENTER}>Process Parameters Number</td>
              <td colSpan={2} className={TH_CENTER}>Product Characteristics</td>
              <td colSpan={1} rowSpan={2} className={TH_CENTER}>Decision</td>
            </tr>
            <tr className="h-[18px] bg-[#fafafa]">
              {[...Array(8)].map((_, i) => (
                <td key={`th-p${i}`} colSpan={1} className={TH_CENTER}>P{i + 1}</td>
              ))}
              <td colSpan={1} className={TH_CENTER}>Specified</td>
              <td colSpan={1} className={TH_CENTER}>Observed</td>
            </tr>
            {[...Array(10)].map((_, i) => (
              <tr key={`trial-${i}`} className="h-[18px]">
                <td colSpan={1} className={`${TD_CENTER} font-bold`}>{i + 1}</td>
                {[...Array(8)].map((_, pIdx) => (
                  <td key={`t${i}-p${pIdx}`} colSpan={1} className={TD_CENTER}>
                    {currentReport?.trials?.[i]?.[`p${pIdx + 1}`] || ''}
                  </td>
                ))}
                <td colSpan={1} className={TD_CENTER}>{currentReport?.trials?.[i]?.specified || ''}</td>
                <td colSpan={1} className={TD_CENTER}>{currentReport?.trials?.[i]?.observed || ''}</td>
                <td colSpan={1} className={TD_CENTER}>{currentReport?.trials?.[i]?.decision || ''}</td>
              </tr>
            ))}

            {/* ════════════ CONCLUSION ════════════ */}
            <tr className="h-[18px]">
              <td colSpan={12} className={SECTION_TITLE}>CONCLUSION :</td>
            </tr>
            <tr className="h-[22px]">
              <td colSpan={12} className={`${TD_LEFT} text-[10px]`}>
                Based on above trials, existing process parameter on control plan are ok, following process parameters are finalised & accordingly control plan is changed.
              </td>
            </tr>

            {/* ════════════ FINAL MANUFACTURING PROCESS PARAMETERS (Table 2) ════════════ */}
            <tr className="h-[18px]">
              <td colSpan={12} className={SECTION_TITLE}>MANUFACTURING PROCESS PARAMETERS :</td>
            </tr>
            <tr className="h-[24px] bg-[#fafafa]">
              <td colSpan={1} className={TH_CENTER}>Process<br/>Parameter<br/>No.</td>
              <td colSpan={8} className={TH_CENTER}>Process Parameter Specification</td>
              <td colSpan={1} className={TH_CENTER}>Min.<br/>Limit</td>
              <td colSpan={1} className={TH_CENTER}>Max.<br/>Limit</td>
              <td colSpan={1} className={TH_CENTER}>Remarks</td>
            </tr>
            {[...Array(8)].map((_, i) => (
              <tr key={`p2-${i}`} className="h-[18px]">
                <td colSpan={1} className={`${TD_CENTER} font-bold`}>P{i + 1}</td>
                <td colSpan={8} className={TD_LEFT}>{currentReport?.final_params?.[i]?.spec || ''}</td>
                <td colSpan={1} className={TD_CENTER}>{currentReport?.final_params?.[i]?.min || ''}</td>
                <td colSpan={1} className={TD_CENTER}>{currentReport?.final_params?.[i]?.max || ''}</td>
                <td colSpan={1} className={TD_LEFT}>{currentReport?.final_params?.[i]?.remarks || ''}</td>
              </tr>
            ))}

            {/* ════════════ SIGNATURE SECTION ════════════ */}
            <tr className="h-[20px]">
              <td colSpan={2} className={`${TD_LEFT} font-bold text-[9px]`}>Name :-</td>
              <td colSpan={4} className={TD_LEFT}>{currentReport?.prepared_by_name || ''}</td>
              <td colSpan={2} className={`${TD_LEFT} font-bold text-[9px]`}>Name :-</td>
              <td colSpan={4} className={TD_LEFT}>{currentReport?.approved_by_name || ''}</td>
            </tr>
            <tr className="h-[28px]">
              <td colSpan={2} className={`${TD_LEFT} font-bold text-[9px] align-top`}>Signature :-</td>
              <td colSpan={4} className={TD_LEFT}></td>
              <td colSpan={2} className={`${TD_LEFT} font-bold text-[9px] align-top`}>Signature :-</td>
              <td colSpan={4} className={TD_LEFT}></td>
            </tr>
            <tr className="h-[20px]">
              <td colSpan={6} className={`${SECTION_TITLE} border-t-0 text-center`}>PREPARED BY</td>
              <td colSpan={6} className={`${SECTION_TITLE} border-t-0 text-center`}>APPROVED BY</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyProcessValidationPrint;