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

const IncomingMaterialprint = ({ items = [], currentReport, onEditForm, onBack }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  // ── Khali Rows Ka Format (S.No. ke alawa sab blank) ──
  const emptyParams = [
    { s_no: 1, name: '', spec: '', method: '' },
    { s_no: 2, name: '', spec: '', method: '' },
    { s_no: 3, name: '', spec: '', method: '' },
    { s_no: 4, name: '', spec: '', method: '' },
  ];

  // ── Blocks Generator ──
  const generateBlocks = (dataItems) => {
    if (!dataItems || dataItems.length === 0) {
      return Array(3).fill({
        part_name: '', date: '', coil_no: '',
        supplier_name: '', grade: '', invoice_no: '',
        customer_name: '', mtc: '', qty: '',
        parameters: emptyParams, // Yahan khali rows set ki hain
        checked_by: ''
      });
    }
    
    return dataItems.map(item => ({
      part_name: item.part_name || '',
      date: item.date ? formatDisplay(item.date) : '',
      coil_no: item.coil_no || '',
      supplier_name: item.supplier_name || '',
      grade: item.grade || '',
      invoice_no: item.invoice_no || '',
      customer_name: item.customer_name || '',
      mtc: item.mtc || '',
      qty: item.qty || '',
      parameters: item.parameters && item.parameters.length > 0 ? item.parameters : emptyParams,
      checked_by: item.checked_by || ''
    }));
  };

  const blocks = generateBlocks(items);

  // ── Common Tailwind Classes for uniform 1px borders ──
  const TH = 'border border-black font-bold text-center align-middle bg-[#f5f5f5] text-black px-1 py-1.5 text-[10px] uppercase break-words';
  const TD = 'border border-black text-center align-middle px-1 py-1.5 text-black text-[10px] break-words';
  const LabelTD = 'border border-black font-bold bg-[#f5f5f5] text-black text-[10px] px-2 py-1.5 text-left uppercase whitespace-nowrap';
  const ValTD = 'border border-black text-black text-[10px] px-2 py-1.5 text-left font-semibold break-words bg-white';

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-5 text-black font-sans flex flex-col items-center">
      
      {/* ── Top Bar (Buttons) ── */}
      <div className="flex justify-end items-center gap-3 mb-3 w-full max-w-[1122px] print:hidden">
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
          @page { size: A4 landscape; margin: 6mm; }
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            background-color: white !important; 
          }
        }
      `}</style>

      {/* ── Main Print Container ── */}
      <div className="bg-white shadow-lg w-full max-w-[1122px] min-h-[210mm] box-border p-5 md:p-[10mm] print:max-w-none print:w-full print:p-0 print:m-0 print:shadow-none print:block overflow-x-auto">
        
        <table className="w-full border-collapse border border-black table-fixed bg-white min-w-[800px]">
          
          <colgroup>
            <col style={{ width: '5%' }} />
            <col style={{ width: '17%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '6%' }} />
            <col style={{ width: '6%' }} />
            <col style={{ width: '6%' }} />
            <col style={{ width: '6%' }} />
            <col style={{ width: '6%' }} />
            <col style={{ width: '15%' }} />
          </colgroup>

          {/* ════════════ THEAD ════════════ */}
          <thead className="table-header-group">
            <tr>
              <td colSpan={10} className="p-0 border border-black border-b-0">
                <table className="w-full border-collapse bg-white">
                  <tbody>
                    <tr>
                      <td className="w-[15%] border-r border-black p-2 text-center align-middle">
                        <img src={atomone} alt="ATOM ONE" className="max-h-[50px] max-w-full block mx-auto object-contain" />
                      </td>
                      <td className="w-[60%] border-r border-black text-center align-middle">
                        <h1 className="text-[18px] md:text-[20px] font-bold uppercase tracking-[1px] m-0 text-black">
                          INCOMING MATERIAL INSPECTION REPORT
                        </h1>
                      </td>
                      <td className="w-[25%] p-0 align-top">
                        <table className="w-full border-collapse h-full">
                          <tbody>
                            {/* YAHAN INBUILD DATA WAPAS LAGA DIYA HAI */}
                            <tr>
                              <td className="border-b border-r border-black font-bold text-[10px] px-2 py-1 w-[45%] uppercase">DOC. NO.</td>
                              <td className="border-b border-black text-[10px] px-2 py-1 font-semibold">{currentReport?.doc_no || 'AOT-F-QA-01'}</td>
                            </tr>
                            <tr>
                              <td className="border-b border-r border-black font-bold text-[10px] px-2 py-1 uppercase">REVISION NO.</td>
                              <td className="border-b border-black text-[10px] px-2 py-1 font-semibold">{currentReport?.rev_no || '01'}</td>
                            </tr>
                            <tr>
                              <td className="border-r border-black font-bold text-[10px] px-2 py-1 uppercase">DATE</td>
                              <td className="text-[10px] px-2 py-1 font-semibold">{currentReport?.doc_date ? formatDisplay(currentReport.doc_date) : '18.02.2025'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </thead>

          {/* ════════════ TBODY ════════════ */}
          <tbody>
            {blocks.map((block, bIdx) => (
              <React.Fragment key={bIdx}>
                
                <tr className="break-inside-avoid">
                  <td colSpan={2} className={LabelTD}>PART NAME</td>
                  <td colSpan={2} className={ValTD}>{block.part_name || '\u00A0'}</td>
                  <td colSpan={2} className={LabelTD}>DATE</td>
                  <td className={ValTD}>{block.date || '\u00A0'}</td>
                  <td colSpan={2} className={LabelTD}>COIL NO.</td>
                  <td className={ValTD}>{block.coil_no || '\u00A0'}</td>
                </tr>
                <tr className="break-inside-avoid">
                  <td colSpan={2} className={LabelTD}>SUPPLIER NAME</td>
                  <td colSpan={2} className={ValTD}>{block.supplier_name || '\u00A0'}</td>
                  <td colSpan={2} className={LabelTD}>GRADE</td>
                  <td className={ValTD}>{block.grade || '\u00A0'}</td>
                  <td colSpan={2} className={LabelTD}>INVOICE/CHALLAN NO.</td>
                  <td className={ValTD}>{block.invoice_no || '\u00A0'}</td>
                </tr>
                <tr className="break-inside-avoid">
                  <td colSpan={2} className={LabelTD}>CUSTOMER NAME</td>
                  <td colSpan={2} className={ValTD}>{block.customer_name || '\u00A0'}</td>
                  <td colSpan={2} className={LabelTD}>MTC</td>
                  <td className={ValTD}>{block.mtc || '\u00A0'}</td>
                  <td colSpan={2} className={LabelTD}>QTY.</td>
                  <td className={ValTD}>{block.qty || '\u00A0'}</td>
                </tr>

                <tr className="break-inside-avoid">
                  <td rowSpan={2} className={TH}>S.NO.</td>
                  <td rowSpan={2} className={TH}>PARAMETERS</td>
                  <td rowSpan={2} className={TH}>SPECIFICATIONS</td>
                  <td rowSpan={2} className={TH}>INSPECTION METHOD</td>
                  <td colSpan={5} className={TH}>OBSERVATION</td>
                  <td rowSpan={2} className={TH}>REMARK</td>
                </tr>
                <tr className="break-inside-avoid">
                  <td className={TH}>1</td>
                  <td className={TH}>2</td>
                  <td className={TH}>3</td>
                  <td className={TH}>4</td>
                  <td className={TH}>5</td>
                </tr>

                {block.parameters.map((param, pIdx) => (
                  <tr key={pIdx} className="break-inside-avoid bg-white">
                    <td className={TD}>{param.s_no || '\u00A0'}</td>
                    <td className={`${TD} text-left font-semibold`}>{param.name || '\u00A0'}</td>
                    <td className={`${TD} text-left`}>{param.spec || '\u00A0'}</td>
                    <td className={TD}>{param.method || '\u00A0'}</td>
                    <td className={TD}>{param.obs1 || '\u00A0'}</td>
                    <td className={TD}>{param.obs2 || '\u00A0'}</td>
                    <td className={TD}>{param.obs3 || '\u00A0'}</td>
                    <td className={TD}>{param.obs4 || '\u00A0'}</td>
                    <td className={TD}>{param.obs5 || '\u00A0'}</td>
                    <td className={TD}>{param.remark || '\u00A0'}</td>
                  </tr>
                ))}

                <tr className="break-inside-avoid bg-white">
                  <td colSpan={10} className="border border-black px-2 py-2 text-left text-[11px]">
                    <span className="font-bold text-black uppercase">Checked By:</span>
                    <span className="font-semibold ml-2 text-black">{block.checked_by || '\u00A0'}</span>
                  </td>
                </tr>

              </React.Fragment>
            ))}
          </tbody>

          {/* ════════════ TFOOT ════════════ */}
          <tfoot className="table-footer-group">
            <tr>
              <td colSpan={10} className="p-0 border border-black border-t-0 bg-white">
                <div className="flex w-full h-[40px]">
                  <div className="w-1/2 border-r border-black px-3 py-2 flex items-end">
                    <span className="font-bold text-[12px] whitespace-nowrap mr-2 text-black">Prepared By:</span>
                    <span className="flex-grow border-b-[1.5px] border-black text-[12px] pb-[2px] min-h-[18px] text-black">
                      {currentReport?.prepared_by || '\u00A0'}
                    </span>
                  </div>
                  <div className="w-1/2 px-3 py-2 flex items-end">
                    <span className="font-bold text-[12px] whitespace-nowrap mr-2 text-black">Approved By:</span>
                    <span className="flex-grow border-b-[1.5px] border-black text-[12px] pb-[2px] min-h-[18px] text-black">
                      {currentReport?.approved_by || '\u00A0'}
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

export default IncomingMaterialprint;