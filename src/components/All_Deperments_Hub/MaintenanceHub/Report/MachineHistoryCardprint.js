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

const MIN_ROWS = 30;

const MachineHistoryCardprint = ({ items = [], currentReport, onEditForm, onBack }) => {
  const navigate = useNavigate();

  // Sort and filter items
  const historyItems = items
    .filter((x) => Number(x?.sr_no) >= 1)
    .sort((a, b) => Number(a.sr_no) - Number(b.sr_no));

  const TOTAL_ROWS = Math.max(MIN_ROWS, historyItems.length);

  const portraitRowHeight = Math.max(4.5, Math.min(6.5, 195 / TOTAL_ROWS));
  const landscapeRowHeight = Math.max(3.2, Math.min(4.2, 126 / TOTAL_ROWS));

  // ── Common Tailwind Classes for Cells ──
  const TH =
    'border border-black font-bold text-center align-middle bg-white text-black px-1 py-1 text-[11px] break-words leading-tight';

  const TD =
    'border border-black text-center align-middle px-1 py-1 text-black text-[11px] overflow-hidden break-words leading-tight';

  const MetaLabel =
    'border border-black font-semibold bg-white text-black text-[10px] px-1 py-1 text-center';

  const MetaValue =
    'border border-black font-normal bg-white text-black text-[10px] px-1 py-1 text-center';

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
    <div className="min-h-screen bg-[#f5f5f5] p-4 text-black flex justify-center overflow-auto print:p-0 print:bg-white print:overflow-visible">
      {/* ── Top Bar Buttons - Print में यह hidden रहेगा ── */}
      <div className="flex justify-end items-center gap-3 mb-3 absolute top-4 right-4 print:hidden">
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

      {/* ── Print Specific CSS ── */}
      <style>{`
        .print-container {
          width: 794px;
          min-height: 1123px;
        }

        .print-table {
          table-layout: fixed;
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
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body {
            display: block !important;
          }

          * {
            box-sizing: border-box !important;
          }

          .print-container {
            margin: 6mm auto !important;
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

          .print-table thead {
            display: table-header-group !important;
          }

          .print-table tfoot {
            display: table-footer-group !important;
          }

          .print-table tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }

        /* Browser print dialog में Portrait select होगा तो यह layout लगेगा */
        @media print and (orientation: portrait) {
          .print-container {
            width: 198mm !important;
            height: 285mm !important;
            min-height: 285mm !important;
          }

          .print-table th,
          .print-table td {
            padding: 0.8mm 1mm !important;
            line-height: 1.15 !important;
            vertical-align: middle !important;
          }

          .col-sr {
            width: 6% !important;
          }

          .col-date {
            width: 10% !important;
          }

          .col-problem {
            width: 24% !important;
          }

          .col-action {
            width: 24% !important;
          }

          .col-update {
            width: 10% !important;
          }

          .col-sign {
            width: 10% !important;
          }

          .col-remarks {
            width: 16% !important;
          }

          .doc-row {
            height: 5.8mm !important;
          }

          .info-row {
            height: 6.8mm !important;
          }

          .column-header-row {
            height: 9mm !important;
          }

          .history-row {
            height: ${portraitRowHeight.toFixed(2)}mm !important;
            max-height: ${portraitRowHeight.toFixed(2)}mm !important;
          }

          .revision-title-row {
            height: 5.5mm !important;
          }

          .revision-header-row {
            height: 5.5mm !important;
          }

          .revision-data-row {
            height: 6.5mm !important;
          }

          .prepared-row {
            height: 11mm !important;
          }

          .print-logo {
            max-height: 13mm !important;
          }

          .print-title {
            font-size: 18px !important;
            line-height: 1.1 !important;
          }

          .print-main-text {
            font-size: 11px !important;
          }

          .print-small-text {
            font-size: 10px !important;
          }
        }

        /* Browser print dialog में Landscape select होगा तो यह layout लगेगा */
        @media print and (orientation: landscape) {
          .print-container {
            width: 285mm !important;
            height: 198mm !important;
            min-height: 198mm !important;
          }

          .print-table th,
          .print-table td {
            padding: 0.6mm 0.8mm !important;
            line-height: 1.05 !important;
            vertical-align: middle !important;
          }

          .col-sr {
            width: 5% !important;
          }

          .col-date {
            width: 8% !important;
          }

          .col-problem {
            width: 27% !important;
          }

          .col-action {
            width: 28% !important;
          }

          .col-update {
            width: 10% !important;
          }

          .col-sign {
            width: 8% !important;
          }

          .col-remarks {
            width: 14% !important;
          }

          .doc-row {
            height: 4.8mm !important;
          }

          .info-row {
            height: 5.5mm !important;
          }

          .column-header-row {
            height: 7.5mm !important;
          }

          .history-row {
            height: ${landscapeRowHeight.toFixed(2)}mm !important;
            max-height: ${landscapeRowHeight.toFixed(2)}mm !important;
          }

          .revision-title-row {
            height: 4.5mm !important;
          }

          .revision-header-row {
            height: 4.8mm !important;
          }

          .revision-data-row {
            height: 5.5mm !important;
          }

          .prepared-row {
            height: 8mm !important;
          }

          .print-logo {
            max-height: 11mm !important;
          }

          .print-title {
            font-size: 15px !important;
            line-height: 1.1 !important;
          }

          .print-main-text {
            font-size: 9px !important;
          }

          .print-small-text {
            font-size: 8px !important;
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
        "
      >
        <table
          className="print-table w-full border-collapse border border-black"
          style={{
            width: '100%',
            height: '100%',
            tableLayout: 'fixed',
          }}
        >
          <colgroup>
            <col className="col-sr" />
            <col className="col-date" />
            <col className="col-problem" />
            <col className="col-action" />
            <col className="col-update" />
            <col className="col-sign" />
            <col className="col-remarks" />
          </colgroup>

          {/* ════════════ THEAD ════════════ */}
          <thead className="table-header-group">
            <tr className="doc-row h-[22px]">
              <th
                colSpan={2}
                rowSpan={3}
                className="border border-black p-1 align-middle text-center bg-white"
              >
                <img
                  src={atomone}
                  alt="ATOM ONE"
                  className="print-logo max-h-[45px] max-w-full block mx-auto object-contain"
                />
              </th>

              <th
                colSpan={3}
                rowSpan={3}
                className="border border-black text-center align-middle bg-white"
              >
                <h1 className="print-title text-[18px] font-bold uppercase tracking-[1px] m-0 text-black">
                  MACHINE HISTORY CARD
                </h1>
              </th>

              <th className={MetaLabel}>Doc.no.</th>
              <th className={MetaValue}>{currentReport?.doc_no || 'AOT-F-MM-02'}</th>
            </tr>

            <tr className="doc-row h-[22px]">
              <th className={MetaLabel}>Rev.no.</th>
              <th className={MetaValue}>{currentReport?.rev_no || '00'}</th>
            </tr>

            <tr className="doc-row h-[22px]">
              <th className={MetaLabel}>Date</th>
              <th className={MetaValue}>
                {formatDisplay(currentReport?.doc_date) || '14.10.2024'}
              </th>
            </tr>

            <tr className="info-row h-[26px]">
              <th
                colSpan={3}
                className="print-main-text border border-black text-left align-middle bg-white px-2 py-1 text-[11px] font-bold"
              >
                Machine Name &nbsp;&nbsp;:{' '}
                <span className="font-normal">{currentReport?.machine_name || ''}</span>
              </th>

              <th
                colSpan={4}
                className="print-main-text border border-black text-left align-middle bg-white px-2 py-1 text-[11px] font-bold"
              >
                Machine No. &nbsp;&nbsp;&nbsp;&nbsp;:{' '}
                <span className="font-normal">{currentReport?.machine_no || ''}</span>
              </th>
            </tr>

            <tr className="info-row h-[26px]">
              <th
                colSpan={3}
                className="print-main-text border border-black text-left align-middle bg-white px-2 py-1 text-[11px] font-bold"
              >
                Machine Specs &nbsp;:{' '}
                <span className="font-normal">{currentReport?.machine_specs || ''}</span>
              </th>

              <th
                colSpan={4}
                className="print-main-text border border-black text-left align-middle bg-white px-2 py-1 text-[11px] font-bold"
              >
                Location &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{' '}
                <span className="font-normal">{currentReport?.location || ''}</span>
              </th>
            </tr>

            <tr className="column-header-row h-[35px]">
              <th className={TH}>Sr. No.</th>
              <th className={TH}>Date</th>
              <th className={TH}>Problem</th>
              <th className={TH}>Action Taken</th>
              <th className={TH}>
                Update in 4M
                <br />
                record(Y/N)
              </th>
              <th className={TH}>Signature</th>
              <th className={TH}>Remarks</th>
            </tr>
          </thead>

          {/* ════════════ TBODY ════════════ */}
          <tbody>
            {Array.from({ length: TOTAL_ROWS }, (_, i) => {
              const row = historyItems[i] || null;

              return (
                <tr key={i} className="history-row h-[26px] break-inside-avoid">
                  <td className={`${TD} bg-white font-medium`}>
                    {row?.sr_no || (row ? i + 1 : '')}
                  </td>

                  <td className={`${TD} bg-white`}>
                    {row?.date ? formatDisplay(row.date) : ''}
                  </td>

                  <td className={`${TD} bg-white text-left pl-[6px]`}>
                    {row?.problem || ''}
                  </td>

                  <td className={`${TD} bg-white text-left pl-[6px]`}>
                    {row?.action_taken || ''}
                  </td>

                  <td className={`${TD} bg-white`}>{row?.update_4m || ''}</td>

                  <td className={`${TD} bg-white`}>{row?.signature || ''}</td>

                  <td className={`${TD} bg-white text-left pl-[4px]`}>
                    {row?.remarks || ''}
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* ════════════ TFOOT ════════════ */}
          <tfoot className="table-footer-group">
            <tr className="revision-title-row h-[20px]">
              <td
                colSpan={7}
                className="border border-black text-center text-[10px] font-bold bg-[#f9f9f9]"
              >
                REVISION DETAIL:
              </td>
            </tr>

            <tr className="revision-header-row h-[20px]">
              <th className="print-small-text border border-black text-center text-[10px] font-bold bg-white">
                REV NO.
              </th>

              <th
                colSpan={2}
                className="print-small-text border border-black text-center text-[10px] font-bold bg-white"
              >
                DESCRIPTION
              </th>

              <th className="print-small-text border border-black text-center text-[10px] font-bold bg-white">
                DATE
              </th>

              <th className="print-small-text border border-black text-center text-[10px] font-bold bg-white">
                SIGN
              </th>

              <th
                colSpan={2}
                className="print-small-text border border-black text-center text-[10px] font-bold bg-white"
              ></th>
            </tr>

            <tr className="revision-data-row h-[24px]">
              <td className="print-small-text border border-black text-center text-[10px] bg-white">
                {currentReport?.rev_no_hist || '1'}
              </td>

              <td
                colSpan={2}
                className="print-small-text border border-black text-center text-[10px] bg-white"
              >
                {currentReport?.rev_desc || '4M CHECKPOINT ADDED'}
              </td>

              <td className="print-small-text border border-black text-center text-[10px] bg-white">
                {currentReport?.rev_date || ''}
              </td>

              <td className="print-small-text border border-black text-center text-[10px] bg-white">
                {currentReport?.rev_sign || ''}
              </td>

              <td
                colSpan={2}
                className="print-small-text border border-black text-center text-[10px] bg-white"
              ></td>
            </tr>

            <tr className="prepared-row">
              <td colSpan={7} className="border border-black p-0 h-[40px] bg-white">
                <div className="flex w-full h-full">
                  <div className="w-1/2 border-r border-black px-3 py-3 flex items-start">
                    <span className="print-main-text font-bold text-[11px] whitespace-nowrap mr-2 text-black">
                      PREPARED BY :
                    </span>

                    <span className="print-main-text flex-grow text-[11px] text-black">
                      {currentReport?.prepared_by || ''}
                    </span>
                  </div>

                  <div className="w-1/2 px-3 py-3 flex items-start">
                    <span className="print-main-text font-bold text-[11px] whitespace-nowrap mr-2 text-black">
                      APPROVED BY :
                    </span>

                    <span className="print-main-text flex-grow text-[11px] text-black">
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

export default MachineHistoryCardprint;