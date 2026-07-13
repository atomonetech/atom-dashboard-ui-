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

const MIN_ROWS = 19;

const MachineBreakdownSummaryPrint = ({ items = [], currentReport, onEditForm, onBack }) => {
  const navigate = useNavigate();

  const historyItems = items
    .filter((x) => Number(x?.sr_no) >= 1)
    .sort((a, b) => Number(a.sr_no) - Number(b.sr_no));

  const TOTAL_ROWS = Math.max(MIN_ROWS, historyItems.length);

  const portraitRowHeight = Math.max(8, Math.min(11, 220 / TOTAL_ROWS));
  const landscapeRowHeight = Math.max(5.5, Math.min(7.8, 145 / TOTAL_ROWS));

  const TH =
    'border border-black font-bold text-center align-middle bg-white text-black px-1 py-2 text-[10px] break-words leading-tight';

  const TD =
    'border border-black text-center align-middle px-1 text-black text-[11px] overflow-hidden bg-white break-words leading-tight';

  const MetaLabel =
    'meta-label border border-black font-semibold bg-white text-black text-[9px] px-1 py-1 text-left whitespace-nowrap';

  const MetaValue =
    'meta-value border border-black font-normal bg-white text-black text-[10px] px-1 py-1 text-center whitespace-nowrap';

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    navigate('/Maintenance/Machine/daily');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-4 text-black flex justify-center print:p-0 print:bg-white overflow-auto print:overflow-visible">
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
          width: 1123px;
          height: 794px;
          padding: 5mm;
        }

        .print-table {
          width: 100%;
          height: 100%;
          table-layout: fixed;
          border-collapse: collapse;
        }

        /* Screen preview column widths */
        .col-sno {
          width: 4%;
        }

        .col-date {
          width: 7%;
        }

        .col-machine {
          width: 18%;
        }

        .col-problem {
          width: 20%;
        }

        .col-time {
          width: 14%;
        }

        .col-status {
          width: 12%;
        }

        .col-update {
          width: 9%;
        }

        .col-sign {
          width: 7%;
        }

        .col-remarks {
          width: 9%;
        }

        .text-cell {
          white-space: normal !important;
          word-break: normal !important;
          overflow-wrap: anywhere !important;
        }

        @media print {
          @page {
            size: auto;
            margin: 0;
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
            margin: 5mm auto !important;
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
            height: 287mm !important;
            min-height: 287mm !important;
          }

          .col-sno {
            width: 5%;
          }

          .col-date {
            width: 9%;
          }

          .col-machine {
            width: 17%;
          }

          .col-problem {
            width: 21%;
          }

          .col-time {
            width: 13%;
          }

          .col-status {
            width: 12%;
          }

          .col-update {
            width: 8%;
          }

          .col-sign {
            width: 6%;
          }

          .col-remarks {
            width: 9%;
          }

          .print-table th,
          .print-table td {
            padding: 0.55mm 0.45mm !important;
            line-height: 1.08 !important;
            font-size: 7.2px !important;
          }

          .doc-row {
            height: 6mm !important;
          }

          .header-row {
            height: 10mm !important;
          }

          .body-row {
            height: ${portraitRowHeight.toFixed(2)}mm !important;
            max-height: ${portraitRowHeight.toFixed(2)}mm !important;
          }

          .prepared-row {
            height: 12mm !important;
          }

          .print-logo {
            max-height: 12mm !important;
          }

          .print-title {
            font-size: 14px !important;
            line-height: 1.1 !important;
            letter-spacing: 0.4px !important;
            white-space: normal !important;
          }

          .meta-label {
            font-size: 6.8px !important;
            padding: 0.35mm !important;
          }

          .meta-value {
            font-size: 7px !important;
            padding: 0.35mm !important;
          }

          .prepared-text {
            font-size: 8px !important;
          }
        }

        /* Browser print dialog me Landscape select hoga to ye layout lagega */
        @media print and (orientation: landscape) {
          .print-container {
            width: 287mm !important;
            height: 200mm !important;
            min-height: 200mm !important;
          }

          .col-sno {
            width: 4%;
          }

          .col-date {
            width: 7%;
          }

          .col-machine {
            width: 18%;
          }

          .col-problem {
            width: 20%;
          }

          .col-time {
            width: 14%;
          }

          .col-status {
            width: 12%;
          }

          .col-update {
            width: 9%;
          }

          .col-sign {
            width: 7%;
          }

          .col-remarks {
            width: 9%;
          }

          .print-table th,
          .print-table td {
            padding: 0.6mm 0.45mm !important;
            line-height: 1.1 !important;
            font-size: 8.5px !important;
          }

          .doc-row {
            height: 5.5mm !important;
          }

          .header-row {
            height: 9mm !important;
          }

          .body-row {
            height: ${landscapeRowHeight.toFixed(2)}mm !important;
            max-height: ${landscapeRowHeight.toFixed(2)}mm !important;
          }

          .prepared-row {
            height: 10mm !important;
          }

          .print-logo {
            max-height: 11mm !important;
          }

          .print-title {
            font-size: 18px !important;
            line-height: 1.1 !important;
            letter-spacing: 0.7px !important;
            white-space: nowrap !important;
          }

          .meta-label {
            font-size: 8px !important;
            padding: 0.45mm !important;
          }

          .meta-value {
            font-size: 8px !important;
            padding: 0.45mm !important;
          }

          .prepared-text {
            font-size: 9px !important;
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
          flex
          flex-col
          print:shadow-none
        "
      >
        <table className="print-table border border-black">
          <colgroup>
            <col className="col-sno" />
            <col className="col-date" />
            <col className="col-machine" />
            <col className="col-problem" />
            <col className="col-time" />
            <col className="col-status" />
            <col className="col-update" />
            <col className="col-sign" />
            <col className="col-remarks" />
          </colgroup>

          {/* ════════════ THEAD ════════════ */}
          <thead className="table-header-group">
            <tr className="doc-row h-[20px]">
              <th
                colSpan={2}
                rowSpan={3}
                className="border border-black p-1 align-middle text-center bg-white"
              >
                <img
                  src={atomone}
                  alt="ATOM ONE"
                  className="print-logo max-h-[40px] max-w-full block mx-auto object-contain"
                />
              </th>

              <th
                colSpan={4}
                rowSpan={3}
                className="border border-black text-center align-middle bg-white"
              >
                <h1 className="print-title text-[20px] font-bold uppercase tracking-[1px] m-0 text-black">
                  MACHINE BREAK DOWN SUMMARY
                </h1>
              </th>

              <th className={MetaLabel}>DOC NO.</th>
              <th colSpan={2} className={MetaValue}>
                {currentReport?.doc_no || 'AOT-PROD-MM-01'}
              </th>
            </tr>

            <tr className="doc-row h-[20px]">
              <th className={MetaLabel}>REVISION NO.</th>
              <th colSpan={2} className={MetaValue}>
                {currentReport?.rev_no || '00'}
              </th>
            </tr>

            <tr className="doc-row h-[20px]">
              <th className={MetaLabel}>ISSUED DATE</th>
              <th colSpan={2} className={MetaValue}>
                {formatDisplay(currentReport?.doc_date) || '14.10.2024'}
              </th>
            </tr>

            <tr className="header-row h-[35px]">
              <th className={TH}>S.NO.</th>
              <th className={TH}>DATE</th>
              <th className={TH}>
                MACHINE TYPE &
                <br />
                MACHINE NO.
              </th>
              <th className={TH}>PROBLEM DESCRIPTION</th>
              <th className={TH}>
                TIME PERIOD FOR
                <br />
                MAINTENANCE
              </th>
              <th className={TH}>
                STATUS AFTER
                <br />
                TIME PERIOD
              </th>
              <th className={TH}>
                UPDATED IN
                <br />
                4M(Y/N)
              </th>
              <th className={TH}>SIGN.</th>
              <th className={TH}>REMARKS</th>
            </tr>
          </thead>

          {/* ════════════ TBODY ════════════ */}
          <tbody>
            {Array.from({ length: TOTAL_ROWS }, (_, i) => {
              const row = historyItems[i] || null;

              return (
                <tr key={i} className="body-row break-inside-avoid">
                  <td className={`${TD} font-medium`}>
                    {row?.sr_no || (row ? i + 1 : '')}
                  </td>

                  <td className={TD}>
                    {row?.date ? formatDisplay(row.date) : ''}
                  </td>

                  <td className={`${TD} text-cell text-left pl-[6px]`}>
                    {row?.machine_details || ''}
                  </td>

                  <td className={`${TD} text-cell text-left pl-[6px]`}>
                    {row?.problem_desc || ''}
                  </td>

                  <td className={`${TD} text-cell`}>
                    {row?.time_period || ''}
                  </td>

                  <td className={`${TD} text-cell`}>
                    {row?.status_after || ''}
                  </td>

                  <td className={TD}>
                    {row?.update_4m || ''}
                  </td>

                  <td className={TD}>
                    {row?.signature || ''}
                  </td>

                  <td className={`${TD} text-cell text-left pl-[4px]`}>
                    {row?.remarks || ''}
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* ════════════ TFOOT ════════════ */}
          <tfoot className="table-footer-group">
            <tr className="prepared-row">
              <td colSpan={9} className="border border-black p-0 h-[40px] bg-white">
                <div className="flex w-full h-full">
                  <div className="w-1/2 px-4 py-2 flex items-start">
                    <span className="prepared-text font-bold text-[11px] whitespace-nowrap mr-2 text-black">
                      PREPARED BY :
                    </span>

                    <span className="prepared-text flex-grow text-[11px] text-black">
                      {currentReport?.prepared_by || ''}
                    </span>
                  </div>

                  <div className="w-1/2 px-4 py-2 flex items-start">
                    <span className="prepared-text font-bold text-[11px] whitespace-nowrap mr-2 text-black">
                      APPROVED BY :
                    </span>

                    <span className="prepared-text flex-grow text-[11px] text-black">
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

export default MachineBreakdownSummaryPrint;