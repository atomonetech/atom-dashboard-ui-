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

const MIN_ROWS = 29;

const ToolHistoryReport = ({ items = [], currentReport, onEditForm, onBack }) => {
  const navigate = useNavigate();

  const historyItems = items
    .filter((x) => Number(x?.sr_no) >= 1)
    .sort((a, b) => Number(a.sr_no) - Number(b.sr_no));

  const TOTAL_ROWS = Math.max(MIN_ROWS, historyItems.length);

  const portraitRowHeight = Math.max(5.4, Math.min(6.7, 196 / TOTAL_ROWS));
  const landscapeRowHeight = Math.max(4.0, Math.min(4.6, 120 / TOTAL_ROWS));

  const TH =
    'border border-black font-bold text-center align-middle bg-white text-black px-1 py-1 text-[10px] whitespace-normal break-words leading-tight uppercase';

  const TD =
    'border border-black text-center align-middle px-1 py-1 text-black text-[11px] whitespace-normal break-words overflow-hidden bg-white';

  const MetaLabel =
    'meta-label border border-black font-semibold bg-white text-black text-[10px] px-1 py-1 text-center whitespace-normal break-words leading-tight';

  const MetaValue =
    'meta-value border border-black font-bold bg-white text-black text-[10px] px-1 py-1 text-center whitespace-normal break-words';

  const InfoLabel =
    'info-label border border-black text-left align-middle bg-white px-2 py-1 text-[10px] uppercase font-bold text-black whitespace-normal break-words leading-tight';

  const InfoValue =
    'info-value border border-black text-left align-middle bg-white px-2 py-1 text-[11px] font-normal text-black whitespace-normal break-words';

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    navigate('/Maintenance/Tool/daily');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="print-page min-h-screen bg-[#f5f5f5] p-4 text-black flex justify-center print:p-0 print:bg-white overflow-auto print:overflow-visible">
      {/* ── Top Bar Buttons - Hidden in Print ── */}
      <div className="flex justify-end items-center gap-3 mb-3 absolute top-4 right-4 print:hidden z-10">
        <button
          onClick={handleBack}
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
          onClick={handlePrint}
          className="bg-[#4CAF50] hover:bg-[#43a047] text-white border-none px-5 py-2 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5 transition-colors shadow-md"
        >
          <i className="bi bi-printer-fill"></i> Print
        </button>
      </div>

      <style>{`
        .print-container {
          width: 794px;
          min-height: 1123px;
          padding: 6mm;
        }

        .print-table {
          width: 100%;
          height: 100%;
          table-layout: fixed;
          border-collapse: collapse;
        }

        .col-date {
          width: 14%;
        }

        .col-prod {
          width: 7%;
        }

        .col-resharpening {
          width: 12%;
        }

        .col-cumulative {
          width: 15%;
        }

        .col-problem {
          width: 20%;
        }

        .col-action {
          width: 14%;
        }

        .col-update {
          width: 8%;
        }

        .col-remarks {
          width: 10%;
        }

        .text-cell {
          white-space: normal !important;
          word-break: normal !important;
          overflow-wrap: anywhere !important;
        }

        @media print {
          @page {
            size: auto;
            margin: 6mm;
          }

          html,
          body,
          #root {
            width: 100%;
            height: 100%;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            overflow: hidden !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body {
            display: block !important;
          }
          
          .print-page {
             width: 100% !important;
             min-height: 100vh !important;
             height: 100vh !important;
             display: flex !important;
             justify-content: center !important;
             align-items: center !important;
             margin: 0 !important;
             padding: 0 !important;
             background: white !important;
             overflow: hidden !important;
          }

          * {
            box-sizing: border-box !important;
          }

          thead {
            display: table-header-group !important;
          }

          tbody {
            display: table-row-group !important;
          }

          tfoot {
            display: table-footer-group !important;
          }

          .print-container {
            margin: 0 auto !important;
            padding: 0 !important;
            box-shadow: none !important;
            overflow: hidden !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }

          .print-table {
            width: 100% !important;
            height: 100% !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
          }

          .print-table tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .print-table td,
          .print-table th {
            vertical-align: middle !important;
            overflow: hidden !important;
          }

          .text-cell {
            white-space: normal !important;
            word-break: normal !important;
            overflow-wrap: anywhere !important;
          }
        }

        /* Browser print dialog me Portrait select hoga to ye layout lagega */
        @media print and (orientation: portrait) {
          .print-container {
            width: 198mm !important;
            height: 285mm !important;
            min-height: 285mm !important;
            max-height: 285mm !important;
          }

          .col-date {
            width: 14%;
          }

          .col-prod {
            width: 7%;
          }

          .col-resharpening {
            width: 12%;
          }

          .col-cumulative {
            width: 15%;
          }

          .col-problem {
            width: 20%;
          }

          .col-action {
            width: 14%;
          }

          .col-update {
            width: 8%;
          }

          .col-remarks {
            width: 10%;
          }

          .print-table th,
          .print-table td {
            padding: 0.4mm 0.35mm !important;
            line-height: 1.05 !important;
            font-size: 6.7px !important;
          }

          .doc-row {
            height: 5.2mm !important;
          }

          .info-row {
            height: 5.7mm !important;
          }

          .column-header-row {
            height: 7.5mm !important;
          }

          .body-row {
            height: ${portraitRowHeight.toFixed(2)}mm !important;
            max-height: ${portraitRowHeight.toFixed(2)}mm !important;
          }

          .footer-row {
            height: 8mm !important;
          }

          .print-logo {
            max-height: 10mm !important;
          }

          .print-title {
            font-size: 14px !important;
            line-height: 1.05 !important;
            letter-spacing: 0.4px !important;
            white-space: normal !important;
          }

          .meta-label,
          .meta-value {
            font-size: 6.5px !important;
            padding: 0.25mm !important;
          }

          .info-label {
            font-size: 6.6px !important;
            padding: 0.3mm !important;
          }

          .info-value {
            font-size: 6.8px !important;
            padding: 0.3mm !important;
          }

          .footer-text {
            font-size: 7px !important;
          }
        }

        /* Browser print dialog me Landscape select hoga to ye layout lagega */
        @media print and (orientation: landscape) {
          .print-container {
            width: 285mm !important;
            height: 198mm !important;
            min-height: 198mm !important;
            max-height: 198mm !important;
          }

          .col-date {
            width: 10%;
          }

          .col-prod {
            width: 7%;
          }

          .col-resharpening {
            width: 11%;
          }

          .col-cumulative {
            width: 13%;
          }

          .col-problem {
            width: 22%;
          }

          .col-action {
            width: 17%;
          }

          .col-update {
            width: 9%;
          }

          .col-remarks {
            width: 11%;
          }

          .print-table th,
          .print-table td {
            padding: 0.35mm 0.4mm !important;
            line-height: 1.04 !important;
            font-size: 7.4px !important;
          }

          .doc-row {
            height: 4.6mm !important;
          }

          .info-row {
            height: 4.8mm !important;
          }

          .column-header-row {
            height: 6.5mm !important;
          }

          .body-row {
            height: ${landscapeRowHeight.toFixed(2)}mm !important;
            max-height: ${landscapeRowHeight.toFixed(2)}mm !important;
          }

          .footer-row {
            height: 7mm !important;
          }

          .print-logo {
            max-height: 9mm !important;
          }

          .print-title {
            font-size: 16px !important;
            line-height: 1.05 !important;
            letter-spacing: 0.6px !important;
            white-space: nowrap !important;
          }

          .meta-label,
          .meta-value {
            font-size: 7px !important;
            padding: 0.3mm !important;
          }

          .info-label {
            font-size: 7px !important;
            padding: 0.3mm !important;
          }

          .info-value {
            font-size: 7.2px !important;
            padding: 0.3mm !important;
          }

          .footer-text {
            font-size: 7.4px !important;
          }
        }
      `}</style>

      {/* ── Main A4 Print Container ── */}
      <div
        className="
          print-container
          bg-white
          shadow-2xl
          font-sans
          box-border
          mx-auto
          relative
          mt-12
          print:mt-0
          print:shadow-none
        "
      >
        <table className="print-table border border-black">
          <colgroup>
            <col className="col-date" />
            <col className="col-prod" />
            <col className="col-resharpening" />
            <col className="col-cumulative" />
            <col className="col-problem" />
            <col className="col-action" />
            <col className="col-update" />
            <col className="col-remarks" />
          </colgroup>

          {/* ════════════ THEAD ════════════ */}
          <thead className="table-header-group">
            <tr className="doc-row h-[22px]">
              <th
                colSpan={2}
                rowSpan={3}
                className="border border-black p-1 align-middle text-center bg-white overflow-hidden"
              >
                <img
                  src={atomone}
                  alt="ATOM ONE"
                  className="print-logo max-h-[45px] max-w-full block mx-auto object-contain"
                />
              </th>

              <th
                colSpan={4}
                rowSpan={3}
                className="border border-black text-center align-middle bg-white"
              >
                <h1 className="print-title text-[20px] font-bold uppercase tracking-[1px] m-0 text-black whitespace-normal break-words">
                  TOOL HISTORY CARD
                </h1>
              </th>

              <th className={MetaLabel}>Doc.No.</th>
              <th className={MetaValue}>
                {currentReport?.doc_no || 'AOT-F-TM-01'}
              </th>
            </tr>

            <tr className="doc-row h-[22px]">
              <th className={MetaLabel}>Rev.No.</th>
              <th className={MetaValue}>
                {currentReport?.rev_no || '00'}
              </th>
            </tr>

            <tr className="doc-row h-[22px]">
              <th className={MetaLabel}>DATE</th>
              <th className={MetaValue}>
                {formatDisplay(currentReport?.doc_date) || '14.10.2024'}
              </th>
            </tr>

            <tr className="info-row h-[26px]">
              <th className={InfoLabel}>PART NAME</th>
              <th colSpan={3} className={`${InfoValue} text-cell`}>
                {currentReport?.part_name || ''}
              </th>

              <th className={InfoLabel}>CUSTOMER NAME</th>
              <th colSpan={3} className={`${InfoValue} text-cell`}>
                {currentReport?.customer_name || ''}
              </th>
            </tr>

            <tr className="info-row h-[26px]">
              <th className={InfoLabel}>PART NO.</th>
              <th colSpan={3} className={`${InfoValue} text-cell`}>
                {currentReport?.part_no || ''}
              </th>

              <th className={InfoLabel}>ESTIMATED TOOL LIFE</th>
              <th colSpan={3} className={`${InfoValue} text-cell`}>
                {currentReport?.estimated_tool_life || ''}
              </th>
            </tr>

            <tr className="info-row h-[26px]">
              <th className={InfoLabel}>TOOL NAME</th>
              <th colSpan={3} className={`${InfoValue} text-cell`}>
                {currentReport?.tool_name || ''}
              </th>

              <th className={InfoLabel}>ESTIMATED MAINTENANCE FREQUENCY</th>
              <th colSpan={3} className={`${InfoValue} text-cell`}>
                {currentReport?.estimated_maintenance_frequency || ''}
              </th>
            </tr>

            <tr className="info-row h-[26px]">
              <th className={InfoLabel}>MODEL</th>
              <th colSpan={3} className={`${InfoValue} text-cell`}>
                {currentReport?.model || ''}
              </th>

              <th colSpan={4} className={InfoValue}></th>
            </tr>

            <tr className="column-header-row h-[35px]">
              <th className={TH}>DATE</th>
              <th className={TH}>PROD.</th>
              <th className={TH}>
                RESHARPENING
                <br />
                STROKE
              </th>
              <th className={TH}>
                CUMULATIVE
                <br />
                PROD. TILL DATE
              </th>
              <th className={TH}>PROBLEM REPORTED IF ANY</th>
              <th className={TH}>ACTION TAKEN</th>
              <th className={TH}>UPDATED IN 4M RECORD(Y/N)</th>
              <th className={TH}>REMARKS</th>
            </tr>
          </thead>

          {/* ════════════ TBODY ════════════ */}
          <tbody>
            {Array.from({ length: TOTAL_ROWS }, (_, i) => {
              const row = historyItems[i] || null;

              return (
                <tr key={i} className="body-row h-[26px] break-inside-avoid">
                  <td className={TD}>
                    {row?.date ? formatDisplay(row.date) : ''}
                  </td>

                  <td className={TD}>
                    {row?.prod || ''}
                  </td>

                  <td className={TD}>
                    {row?.resharpening_stroke || ''}
                  </td>

                  <td className={TD}>
                    {row?.cumulative_prod || ''}
                  </td>

                  <td className={`${TD} text-cell text-left pl-[6px]`}>
                    {row?.problem || ''}
                  </td>

                  <td className={`${TD} text-cell text-center`}>
                    {row?.action_taken || ''}
                  </td>

                  <td className={TD}>
                    {row?.update_4m || ''}
                  </td>

                  <td className={`${TD} text-cell text-left pl-[4px]`}>
                    {row?.remarks || ''}
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* ════════════ TFOOT ─ Fixed Using colSpan ════════════ */}
          <tfoot className="table-footer-group">
            <tr className="footer-row">
              <td
                colSpan={3}
                className="border border-black px-2 py-3 bg-white text-left align-top h-[40px]"
              >
                <span className="footer-text font-bold text-[11px] mr-2 text-black uppercase">
                  PREPARED BY :
                </span>

                <span className="footer-text text-[11px] text-black break-words whitespace-normal">
                  {currentReport?.prepared_by || ''}
                </span>
              </td>

              <td
                colSpan={2}
                className="border border-black px-2 py-3 bg-white text-left align-top h-[40px]"
              >
                <span className="footer-text font-bold text-[11px] mr-2 text-black uppercase">
                  CHECKED BY :
                </span>

                <span className="footer-text text-[11px] text-black break-words whitespace-normal">
                  {currentReport?.checked_by || ''}
                </span>
              </td>

              <td
                colSpan={3}
                className="border border-black px-2 py-3 bg-white text-left align-top h-[40px]"
              >
                <span className="footer-text font-bold text-[11px] mr-2 text-black uppercase">
                  APPROVED BY :
                </span>

                <span className="footer-text text-[11px] text-black break-words whitespace-normal">
                  {currentReport?.approved_by || ''}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ToolHistoryReport;