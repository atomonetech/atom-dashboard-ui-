import React from 'react';
import { useNavigate } from 'react-router-dom';

const atomone = '/logo1.jpg';

const DEFAULT_ITEMS = [
  {
    sr_no: 1,
    check_point: 'Auto Drain Filter',
    checking_parameter: 'Check the element for clogging or damage',
    checking_method: 'Clean or replace',
    rowSpan: 2,
  },
  {
    isSubRow: true,
    checking_parameter: 'Check for cracks or damage',
  },

  {
    sr_no: 2,
    check_point: 'Pushbuttons and Switches',
    checking_parameter: 'Check for oil and dust accumulation',
    checking_method: 'Clean or replace',
    rowSpan: 4,
  },
  {
    isSubRow: true,
    checking_parameter: 'Confirm proper operation and smooth movement of the selector switches and pushbuttons',
  },
  {
    isSubRow: true,
    checking_parameter: 'Check for damage and crack',
  },
  {
    isSubRow: true,
    checking_parameter: 'Check for wire cover damage',
  },

  {
    sr_no: 3,
    check_point:
      'Electrical Wires in Moving Areas, And Enter nal Wires for the Operation Button Box',
    checking_parameter: 'Check wires for damage',
    checking_method: 'Replace',
    rowSpan: 2,
  },
  {
    isSubRow: true,
    checking_parameter: 'Check wires for damage',
  },

  {
    sr_no: 4,
    check_point: 'Covers',
    checking_parameter: 'Check for loose bolts',
    checking_method: 'Tighten',
    rowSpan: 1,
  },

  {
    sr_no: 5,
    check_point: 'Oil Filter',
    checking_parameter: 'Check the oil filter for clogging or damage',
    checking_method: 'Clean or replace',
    rowSpan: 1,
  },

  {
    sr_no: 6,
    check_point: 'Control Panel air fan filter',
    checking_parameter: 'Check the control panel air fan filter for clogging or damage',
    checking_method: 'Clean or replace',
    rowSpan: 1,
  },

  {
    sr_no: 7,
    check_point: 'Check the preventive maintenance date',
    checking_parameter: 'Updated in history card',
    checking_method: 'Visually',
    rowSpan: 1,
  },
];

const MIN_BODY_ROWS = 17;

const formatDisplay = (dateStr) => {
  if (!dateStr) return '';

  const parts = String(dateStr).split('-');

  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;

  return dateStr;
};

const ServoPressPMCheckSheetPrint = ({
  items = DEFAULT_ITEMS,
  currentReport,
  onEditForm,
  onBack,
}) => {
  const navigate = useNavigate();

  const checklistItems = items.length > 0 ? items : DEFAULT_ITEMS;
  const totalRows = Math.max(MIN_BODY_ROWS, checklistItems.length);

  const TH =
    'border border-black font-bold text-center align-middle bg-white text-black px-1 py-1 text-[10px] whitespace-normal break-words leading-tight';

  const TD =
    'border border-black text-center align-middle bg-white text-black px-1 py-1 text-[10px] whitespace-normal break-words leading-tight overflow-hidden';

  const MetaLabel =
    'meta-label border border-black font-bold bg-white text-black text-[8px] px-1 py-0.5 text-left whitespace-nowrap';

  const MetaValue =
    'meta-value border border-black font-normal bg-white text-black text-[8px] px-1 py-0.5 text-center whitespace-nowrap';

  const InfoLabel =
    'info-label border border-black bg-white text-black text-[10px] px-1 py-1 text-left font-normal uppercase whitespace-nowrap';

  const InfoValue =
    'info-value border border-black bg-white text-black text-[10px] px-1 py-1 text-left font-normal whitespace-normal break-words';

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    navigate('/Maintenance/Machine/weekly');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="print-page min-h-screen bg-[#f5f5f5] p-4 text-black flex justify-center print:p-0 print:bg-white overflow-auto print:overflow-visible">
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

        .col-sr {
          width: 6%;
        }

        .col-check {
          width: 26%;
        }

        .col-param {
          width: 22%;
        }

        .col-method {
          width: 12%;
        }

        .col-before {
          width: 11%;
        }

        .col-after {
          width: 11%;
        }

        .col-remarks {
          width: 12%;
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

          * {
            box-sizing: border-box !important;
          }

          .print-page {
            width: 100% !important;
            height: 100vh !important;
            min-height: 100vh !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            overflow: hidden !important;
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
            table-layout: fixed !important;
            border-collapse: collapse !important;
          }

          .print-table tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          .print-table th,
          .print-table td {
            vertical-align: middle !important;
            overflow: hidden !important;
          }

          .text-cell {
            white-space: normal !important;
            word-break: normal !important;
            overflow-wrap: anywhere !important;
          }
        }

        @media print and (orientation: portrait) {
          .print-container {
            width: 198mm !important;
            height: 285mm !important;
            min-height: 285mm !important;
            max-height: 285mm !important;
          }

          .print-table th,
          .print-table td {
            padding: 0.32mm 0.38mm !important;
            line-height: 1.03 !important;
            font-size: 6.8px !important;
          }

          .doc-row {
            height: 4mm !important;
          }

          .info-row {
            height: 6mm !important;
          }

          .spec-row {
            height: 8mm !important;
          }

          .column-header-row {
            height: 8mm !important;
          }

          .body-row {
            height: 7.4mm !important;
          }

          .revision-row {
            height: 3.8mm !important;
          }

          .legend-row {
            height: 3.2mm !important;
          }

          .sign-row {
            height: 4.5mm !important;
          }

          .print-logo {
            max-height: 6.3mm !important;
          }

          .print-title {
            font-size: 10.5px !important;
            line-height: 1.05 !important;
            white-space: normal !important;
          }

          .meta-label,
          .meta-value {
            font-size: 5.6px !important;
          }

          .info-label,
          .info-value {
            font-size: 6.2px !important;
          }

          .footer-text {
            font-size: 6px !important;
          }
        }

        @media print and (orientation: landscape) {
          .print-container {
            width: 285mm !important;
            height: 198mm !important;
            min-height: 198mm !important;
            max-height: 198mm !important;
          }

          .print-table th,
          .print-table td {
            padding: 0.25mm 0.35mm !important;
            line-height: 1.02 !important;
            font-size: 7.2px !important;
          }

          .doc-row {
            height: 3.6mm !important;
          }

          .info-row {
            height: 4.8mm !important;
          }

          .spec-row {
            height: 6.3mm !important;
          }

          .column-header-row {
            height: 6.8mm !important;
          }

          .body-row {
            height: 5mm !important;
          }

          .revision-row {
            height: 3mm !important;
          }

          .legend-row {
            height: 2.7mm !important;
          }

          .sign-row {
            height: 3.8mm !important;
          }

          .print-logo {
            max-height: 5.8mm !important;
          }

          .print-title {
            font-size: 12px !important;
            line-height: 1.05 !important;
            white-space: nowrap !important;
          }

          .meta-label,
          .meta-value {
            font-size: 5.8px !important;
          }

          .info-label,
          .info-value {
            font-size: 6.5px !important;
          }

          .footer-text {
            font-size: 6px !important;
          }
        }
      `}</style>

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
            <col className="col-sr" />
            <col className="col-check" />
            <col className="col-param" />
            <col className="col-method" />
            <col className="col-before" />
            <col className="col-after" />
            <col className="col-remarks" />
          </colgroup>

          <thead className="table-header-group">
            <tr className="doc-row h-[18px]">
              <th
                rowSpan={3}
                className="border border-black p-1 align-middle text-center bg-white"
              >
                <img
                  src={atomone}
                  alt="ATOM ONE"
                  className="print-logo max-h-[30px] max-w-full block mx-auto object-contain"
                />
              </th>

              <th
                colSpan={4}
                rowSpan={3}
                className="border border-black text-center align-middle bg-white"
              >
                <h1 className="print-title text-[16px] font-bold uppercase m-0 text-black">
                  MACHINE PREVENTIVE MAINTENANCE CHECK SHEET
                </h1>
              </th>

              <th className={MetaLabel}>DOC NO.</th>
              <th className={MetaValue}>
                {currentReport?.doc_no || 'AOT-F-MM-03'}
              </th>
            </tr>

            <tr className="doc-row h-[18px]">
              <th className={MetaLabel}>REVISION NO.</th>
              <th className={MetaValue}>
                {currentReport?.rev_no || '00'}
              </th>
            </tr>

            <tr className="doc-row h-[18px]">
              <th className={MetaLabel}>ISSUE DATE</th>
              <th className={MetaValue}>
                {formatDisplay(currentReport?.issue_date || currentReport?.doc_date) || '14.10.2024'}
              </th>
            </tr>

            <tr className="info-row h-[30px]">
              <th colSpan={2} className={InfoLabel}>
                MACHINE NAME:
              </th>

              <th className={InfoValue}>
                {currentReport?.machine_name || 'Servo Press'}
              </th>

              <th colSpan={2} className={InfoLabel}>
                DATE
              </th>

              <th colSpan={2} className={InfoValue}>
                {formatDisplay(currentReport?.date) || ''}
              </th>
            </tr>

            <tr className="info-row h-[30px]">
              <th colSpan={2} className={InfoLabel}>
                MACHINE NO.:
              </th>

              <th className={InfoValue}>
                {currentReport?.machine_no || 'SP 01'}
              </th>

              <th colSpan={2} className={InfoLabel}>
                LOCATION
              </th>

              <th colSpan={2} className={InfoValue}>
                {currentReport?.location || ''}
              </th>
            </tr>

            <tr className="spec-row h-[40px]">
              <th colSpan={2} className={InfoLabel}>
                SPECIFICATION
              </th>

              <th className={`${InfoValue} text-cell`}>
                {currentReport?.specification || ''}
              </th>

              <th colSpan={2} className={InfoLabel}>
                MAINTENANCE PERSONNEL
              </th>

              <th colSpan={2} className={`${InfoValue} text-cell`}>
                {currentReport?.maintenance_personnel || currentReport?.maintenance_person || ''}
              </th>
            </tr>

            <tr className="column-header-row h-[40px]">
              <th className={TH}>Sr. No.</th>
              <th className={TH}>Check Points</th>
              <th className={TH}>Checking Parameter</th>
              <th className={TH}>Checking Method</th>
              <th className={TH}>Before Maint.</th>
              <th className={TH}>After Maint.</th>
              <th className={TH}>Remarks</th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: totalRows }, (_, index) => {
              const row = checklistItems[index] || null;

              if (!row) {
                return (
                  <tr key={index} className="body-row h-[30px] break-inside-avoid">
                    <td className={TD}></td>
                    <td className={TD}></td>
                    <td className={TD}></td>
                    <td className={TD}></td>
                    <td className={TD}></td>
                    <td className={TD}></td>
                    <td className={TD}></td>
                  </tr>
                );
              }

              if (row.isSubRow) {
                return (
                  <tr key={index} className="body-row h-[30px] break-inside-avoid">
                    <td className={`${TD} text-cell`}>
                      {row.checking_parameter || ''}
                    </td>

                    <td className={`${TD} text-cell`}>
                      {row.before_maintenance || row.before_maint || ''}
                    </td>

                    <td className={`${TD} text-cell`}>
                      {row.after_maintenance || row.after_maint || ''}
                    </td>

                    <td className={`${TD} text-cell`}>
                      {row.remarks || row.spare_used_remarks || ''}
                    </td>
                  </tr>
                );
              }

              return (
                <tr key={index} className="body-row h-[30px] break-inside-avoid">
                  <td className={TD} rowSpan={row.rowSpan || 1}>
                    {row.sr_no || ''}
                  </td>

                  <td className={`${TD} text-cell`} rowSpan={row.rowSpan || 1}>
                    {row.check_point || ''}
                  </td>

                  <td className={`${TD} text-cell`}>
                    {row.checking_parameter || ''}
                  </td>

                  <td className={`${TD} text-cell`} rowSpan={row.rowSpan || 1}>
                    {row.checking_method || ''}
                  </td>

                  <td className={`${TD} text-cell`}>
                    {row.before_maintenance || row.before_maint || ''}
                  </td>

                  <td className={`${TD} text-cell`}>
                    {row.after_maintenance || row.after_maint || ''}
                  </td>

                  <td className={`${TD} text-cell`}>
                    {row.remarks || row.spare_used_remarks || ''}
                  </td>
                </tr>
              );
            })}
          </tbody>

          <tfoot className="table-footer-group">
            <tr className="revision-row h-[16px]">
              <td className="border border-black bg-white text-center footer-text">
                △
              </td>

              <td colSpan={6} className="border border-black bg-white"></td>
            </tr>

            <tr className="revision-row h-[16px]">
              <td className="border border-black bg-white text-center footer-text">
                REV.
                <br />
                NO
              </td>

              <td colSpan={2} className="border border-black bg-white text-center footer-text">
                REV DATE
              </td>

              <td colSpan={4} className="border border-black bg-white text-center footer-text">
                REVISION DETAIL
              </td>
            </tr>

            <tr className="legend-row h-[16px]">
              <td colSpan={2} rowSpan={4} className="border border-black bg-white"></td>

              <td colSpan={2} className="border border-black bg-white text-center font-bold footer-text">
                Legends
              </td>

              <td colSpan={3} rowSpan={4} className="border border-black bg-white"></td>
            </tr>

            <tr className="legend-row h-[16px]">
              <td className="border border-black bg-white text-center font-bold footer-text">
                ✓
              </td>

              <td className="border border-black bg-white text-center footer-text">
                Ok
              </td>
            </tr>

            <tr className="legend-row h-[16px]">
              <td className="border border-black bg-white text-center font-bold footer-text">
                ✖
              </td>

              <td className="border border-black bg-white text-center footer-text">
                Not Ok
              </td>
            </tr>

            <tr className="legend-row h-[16px]">
              <td className="border border-black bg-white text-center font-bold footer-text">
                N/A
              </td>

              <td className="border border-black bg-white text-center footer-text">
                Not Applicable
              </td>
            </tr>

            <tr className="sign-row h-[24px]">
              <td colSpan={3} className="border border-black bg-white text-center align-bottom font-bold footer-text">
                Prepared by
              </td>

              <td className="border border-black bg-white"></td>

              <td colSpan={3} className="border border-black bg-white text-center align-bottom font-bold footer-text">
                Checked by
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ServoPressPMCheckSheetPrint;