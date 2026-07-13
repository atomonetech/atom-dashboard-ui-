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

const OperatorObservanceCheckSheetPrint = ({ currentReport, onEditForm }) => {
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
                @page { size: A4 portrait; margin: 0 !important; }
                body { margin: 0 !important; padding: 0 !important; display: flex; justify-content: center; align-items: center; width: 100vw; height: 100vh; }
                img { width: 100%; height: 100%; object-fit: contain; display: block; }
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
    }
  };

  // Checkpoints data from screenshot
  const checkPoints = [
    { id: 1, text: "Is Operator doing 1'S and 2'S", highlight: false },
    { id: 2, text: "Is Operator using Safety PPE'S (safety shoes, gloves, mask, goggles, ear plug etc.)", highlight: false },
    { id: 3, text: "Is Operator aware about operation", highlight: false },
    { id: 4, text: "Visual defects before and after process are checked by operator during process.", highlight: false },
    { id: 5, text: "Is Operator aware about abnormal situation", highlight: false },
    { id: 6, text: "Is Operator aware about Operation Standard and Work Instruction", highlight: true },
    { id: 7, text: "Is Operator filling the daily maintenance machine check sheet", highlight: false },
    { id: 8, text: "Is operator aware how to control (Ok, Rework, Reject Parts Storage) during process", highlight: false },
    { id: 9, text: "Is Operator know the loading and unloading of tool", highlight: false },
    { id: 10, text: "Is Operator put the last part in the trolley/bin before lunch or leaving the machine", highlight: false },
    { id: 11, text: "Check operator for proper disposal of waste (Used hand gloves, face mask, dhotis etc.)", highlight: false },
    { id: 12, text: "Check organizational behaviour of operator", highlight: false },
    { id: 13, text: "Is operator using paka yoke in operation if having", highlight: false },
    { id: 14, text: "Is operator aware about part identification, Identification Tag and traceability", highlight: true },
    { id: 15, text: "Is operator utilizing the proper time for operation during production", highlight: false },
    { id: 16, text: "Is operator aware of Single part flow (where required) system.", highlight: true, icon: true },
  ];

  const BORDER = 'border border-black';
  const TD_CENTER = `${BORDER} text-center align-middle px-1 text-black text-[10px]`;
  const TD_LEFT = `${BORDER} text-left align-middle px-2 text-black text-[10px] leading-tight`;

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-4 text-black flex flex-col">
      <div className="flex justify-end items-center gap-3 mb-3 print:hidden">
        <button onClick={() => navigate("/qa-hub")} className="bg-[#607d8b] text-white px-5 py-2 rounded-md font-bold text-sm transition-colors">Back</button>
        <button onClick={handlePrint} className="bg-[#4CAF50] text-white px-5 py-2 rounded-md font-bold text-sm transition-colors">Print</button>
      </div>

      <style>{`
        .print-container-wrapper {
          width: 210mm;
          height: 297mm;
          padding: 8mm;
          box-sizing: border-box;
          margin: 0 auto;
          background: white;
        }
      `}</style>

      <div ref={printRef} className="font-sans box-border mx-auto print-container-wrapper">
        <table className="w-full h-full border-collapse table-fixed border border-black bg-white">
          <colgroup>
            <col className="w-[5%]" />  {/* S.No */}
            <col className="w-[35%]" /> {/* Check Points */}
            <col className="w-[6%]" />  {/* YES */}
            <col className="w-[6%]" />  {/* NO */}
            <col className="w-[10%]" /> {/* Training */}
            <col className="w-[12%]" /> {/* Sign */}
            <col className="w-[12%]" /> {/* Effectiveness */}
            <col className="w-[14%]" /> {/* Remarks */}
          </colgroup>

          <tbody>
            {/* Header */}
            <tr className="h-[35px]">
              <td colSpan={6} className={`${BORDER} text-center font-bold text-[16px] uppercase`}>OPERATOR OBSERVANCE CHECK SHEET</td>
              <td colSpan={2} className="p-0">
                <table className="w-full h-full border-collapse">
                  <tr className="h-[12px]"><td className={`${BORDER} text-[8px] px-1 font-bold`}>Doc.no.</td><td className={`${BORDER} text-[8px] px-1`}>{currentReport?.doc_no || 'AOT-F-TR-07'}</td></tr>
                  <tr className="h-[12px]"><td className={`${BORDER} text-[8px] px-1 font-bold`}>Rev.no.</td><td className={`${BORDER} text-[8px] px-1`}>{currentReport?.rev_no || '01'}</td></tr>
                  <tr className="h-[12px]"><td className={`${BORDER} text-[8px] px-1 font-bold`}>Date</td><td className={`${BORDER} text-[8px] px-1`}>{formatDisplay(currentReport?.doc_date) || '08.12.2023'}</td></tr>
                </table>
              </td>
            </tr>

            {/* Info Section */}
            <tr className="h-[25px]">
              <td colSpan={1} className={`${TD_CENTER} font-bold`}>OPERATOR NAME</td>
              <td colSpan={3} className={TD_LEFT}>{currentReport?.operator_name || ''}</td>
              <td colSpan={2} className={`${TD_CENTER} font-bold`}>MODEL</td>
              <td colSpan={2} className={TD_LEFT}>{currentReport?.model || ''}</td>
            </tr>
            <tr className="h-[25px]">
              <td colSpan={1} className={`${TD_CENTER} font-bold text-[8px]`}>PART NAME / OPERATION</td>
              <td colSpan={3} className={TD_LEFT}>{currentReport?.part_op || ''}</td>
              <td colSpan={2} className={`${TD_CENTER} font-bold`}>DATE</td>
              <td colSpan={2} className={TD_LEFT}>{formatDisplay(currentReport?.check_date) || ''}</td>
            </tr>

            {/* Table Headers */}
            <tr className="h-[30px] bg-[#f2f2f2]">
              <td className={`${TD_CENTER} font-bold`}>S.NO.</td>
              <td className={`${TD_CENTER} font-bold`}>CHECK POINTS</td>
              <td className={`${TD_CENTER} font-bold`}>YES</td>
              <td className={`${TD_CENTER} font-bold`}>NO</td>
              <td className={`${TD_CENTER} font-bold`}>TRAINING GIVEN FOR MC'S</td>
              <td className={`${TD_CENTER} font-bold`}>OPERATOR SIGN</td>
              <td className={`${TD_CENTER} font-bold`}>EFFECTIVENESS</td>
              <td className={`${TD_CENTER} font-bold`}>REMARKS</td>
            </tr>

            {/* Render 16 Checkpoints */}
            {checkPoints.map((cp) => (
              <tr key={cp.id} className="h-[36px]">
                <td className={`${TD_CENTER} font-bold`}>{cp.id}</td>
                <td className={`${TD_LEFT} ${cp.highlight ? 'bg-[#ffff00]' : ''}`}>
                  <div className="flex items-start gap-1">
                    {cp.icon && <span className="text-[12px] mt-[-2px]">⚠️</span>}
                    {cp.text}
                  </div>
                </td>
                <td className={TD_CENTER}>{currentReport?.checks?.[cp.id]?.yes ? '✔' : ''}</td>
                <td className={TD_CENTER}>{currentReport?.checks?.[cp.id]?.no ? '✔' : ''}</td>
                <td className={TD_CENTER}>{currentReport?.checks?.[cp.id]?.training || ''}</td>
                <td className={TD_CENTER}></td>
                <td className={TD_CENTER}>{currentReport?.checks?.[cp.id]?.effectiveness || ''}</td>
                <td className={TD_CENTER}>{currentReport?.checks?.[cp.id]?.remarks || ''}</td>
              </tr>
            ))}

            {/* Revision Section */}
            <tr className="h-[20px] bg-[#f2f2f2]">
              <td colSpan={1} className={`${TD_CENTER} font-bold`}>REV .N</td>
              <td colSpan={1} className={`${TD_CENTER} font-bold`}>REV. DATE</td>
              <td colSpan={6} className={`${TD_CENTER} font-bold`}>REVISION DETAILS</td>
            </tr>
            <tr className="h-[20px]">
              <td className={TD_CENTER}>{currentReport?.rev_n || ''}</td>
              <td className={TD_CENTER}>{formatDisplay(currentReport?.rev_date) || ''}</td>
              <td colSpan={6} className={TD_LEFT}>{currentReport?.rev_details || ''}</td>
            </tr>

            {/* Signatures */}
            <tr className="h-[35px] align-top">
              <td colSpan={4} className={TD_LEFT}>
                <div className="font-bold mb-1">PREPARED BY:</div>
                <div className="text-center">{currentReport?.prepared_by || ''}</div>
              </td>
              <td colSpan={4} className={TD_LEFT}>
                <div className="font-bold mb-1">APPROVED BY:</div>
                <div className="text-center">{currentReport?.approved_by || ''}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OperatorObservanceCheckSheetPrint;