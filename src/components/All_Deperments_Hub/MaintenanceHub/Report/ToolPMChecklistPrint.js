import React from 'react';
import { useNavigate } from 'react-router-dom';

const atomone = '/logo1.jpg';

const formatDisplay = (dateStr) => {
  if (!dateStr) return '';

  const parts = String(dateStr).split('-');

  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;

  return dateStr;
};

const DEFAULT_ITEMS = [
  {
    sr_no: 1,
    item: 'Top and bottom face of die',
    check_point: 'Condition of top and bottom plate',
    specification: 'Should be free from heavy scratch, dent, crack and chip off',
    checking_method: 'Visual and tactile',
    rowSpan: 3,
  },
  {
    isSubRow: true,
    check_point: 'Plate bend check',
    specification: '1.0 mm max bend allowed',
    checking_method: 'Flat Scale',
  },
  {
    isSubRow: true,
    check_point: 'Cleaning of bolting surface',
    specification: 'Should be clean and free from oil and dust',
    checking_method: 'Clean cloth applied with diesel',
  },

  {
    sr_no: 2,
    item: 'Guide Pillers and bushes',
    check_point: 'Clearance between piller and bush',
    specification: 'For bending tool - 0.3 mm max\nFor cutting tool - 0.2 mm max',
    checking_method: 'Vernier Caliper\nMicrometer',
    rowSpan: 5,
  },
  {
    isSubRow: true,
    check_point: 'Cleaning of piller and bush',
    specification: 'Should be clean and free from dust and metal particles',
    checking_method: 'Clean cloth applied with diesel',
  },
  {
    isSubRow: true,
    check_point: 'Condition of pillar and bush',
    specification: 'Should be free from heavy scratch, dent, crack and chip off',
    checking_method: 'Visual and tactile',
  },
  {
    isSubRow: true,
    check_point: 'Lubrication',
    specification: 'Should be properly lubricated',
    checking_method: 'Use lubricant',
  },
  {
    isSubRow: true,
    check_point: 'Replacement',
    specification: 'If above check points are not met then replace pillar set',
    checking_method: 'Judgement',
  },

  {
    sr_no: 3,
    item: 'Dowels, Guiding pins, Ejector pins',
    check_point: 'Condition of Pins',
    specification: 'Should be free from heavy scratch, dent, crack and chip off',
    checking_method: 'Visual/Allen Key',
    rowSpan: 5,
  },
  {
    isSubRow: true,
    check_point: 'Bend check',
    specification: '0.5 mm max bend allowed',
    checking_method: 'Filler gauge',
  },
  {
    isSubRow: true,
    check_point: 'Pin height',
    specification: '± 0.5 mm max as per spec',
    checking_method: 'Height gauge',
  },
  {
    isSubRow: true,
    check_point: 'Clearance between pin and die',
    specification: '0.75 mm max',
    checking_method: 'Vernier Caliper\nMicrometer',
  },
  {
    isSubRow: true,
    check_point: 'Replacement',
    specification: 'If above check points are not met then replace pins',
    checking_method: 'Judgement',
  },

  {
    sr_no: 4,
    item: 'Bolts',
    check_point: 'Condition of bolts',
    specification: 'Should be free from thread slip, head damage, crack and chip off',
    checking_method: 'Visual/Allen Key',
    rowSpan: 3,
  },
  {
    isSubRow: true,
    check_point: 'Tightness of bolts',
    specification: 'Should be tight',
    checking_method: 'Allen key',
  },
  {
    isSubRow: true,
    check_point: 'Replacement',
    specification: 'If above check points are not met then replace bolts',
    checking_method: 'Judgement',
  },

  {
    sr_no: 5,
    item: 'Springs/Spring loaded pin /Pu Rods',
    check_point: 'Condition of Springs and PU rods',
    specification: 'Should be free from crack, chip off and breakage',
    checking_method: 'Visual',
    rowSpan: 3,
  },
  {
    isSubRow: true,
    check_point: 'condition Spring loaded pin',
    specification: 'Should be free from crack, chip off and breakage',
    checking_method: 'Visual',
  },
  {
    isSubRow: true,
    check_point: 'Replacement',
    specification: 'If above check points are not met then replace pu rod or spring',
    checking_method: 'Judgement',
  },

  {
    sr_no: 6,
    item: 'Cutting tool',
    check_point: 'Condition of Die, punch, punch plate, stripper plate, guide plate.',
    specification: 'Should be free from heavy scratch, dent, crack and chip off',
    checking_method: 'Visual and tactile',
    rowSpan: 9,
  },
  {
    isSubRow: true,
    check_point: 'Clearance between Die and Punch',
    specification: 'min - 7%\nmax - 14%\n(of sheet thickness)',
    checking_method: 'Vernier Caliper',
  },
  {
    isSubRow: true,
    check_point: 'Cutting land',
    specification: '3.5 mm min',
    checking_method: 'Vernier Caliper',
  },
  {
    isSubRow: true,
    check_point: 'Scrap falling',
    specification: 'Check counter bore for smooth scrap falling',
    checking_method: 'Vernier Caliper',
  },
  {
    isSubRow: true,
    check_point: 'Clearance between guide plate and punch',
    specification: 'Ø 0.2 mm max',
    checking_method: 'Vernier Caliper\nMicrometer',
  },
  {
    isSubRow: true,
    check_point: 'Distance between punch plate and stripper plate',
    specification: '30 mm min',
    checking_method: 'Vernier Caliper',
  },
  {
    isSubRow: true,
    check_point: 'Condition of punches',
    specification: 'Should be free from crack, chip off and breakage',
    checking_method: 'Visual and tactile',
  },
  {
    isSubRow: true,
    check_point: 'Clearance of Die and Punch (piercing punches)',
    specification: 'min - 7%\nmax - 14%\n(of sheet thickness)',
    checking_method: 'Vernier Caliper\nMicrometer',
  },
  {
    isSubRow: true,
    check_point: 'Re sharpening',
    specification: 'After 30,000 parts manufactured',
    checking_method: 'Judgement',
  },

  {
    sr_no: 7,
    item: 'Guiding pins/stopper plate',
    check_point: 'Condition of Pins/stopper plate',
    specification: 'Should be free from crack, chip off and breakage',
    checking_method: 'Visual',
    rowSpan: 5,
  },
  {
    isSubRow: true,
    check_point: 'Clearance of pins and plate',
    specification: '0.15 mm max',
    checking_method: 'Vernier Caliper\nMicrometer',
  },
  {
    isSubRow: true,
    check_point: 'Distance between two guiding pins/stopper plate against required width or length',
    specification: '0.5 mm max',
    checking_method: 'Vernier Caliper',
  },
  {
    isSubRow: true,
    check_point: 'Stopper pin/stopper plate wear tolerance',
    specification: '0.5 mm max',
    checking_method: 'Vernier Caliper',
  },
  {
    isSubRow: true,
    check_point: 'Replacement',
    specification: 'If above check points are not met then replace pins',
    checking_method: 'Judgement',
  },

  {
    sr_no: 8,
    item: 'Profile bending/ Draw tool/Identification mark',
    check_point: 'Condition of Die and Punch',
    specification: 'Should be free from heavy scratch, dent and crack',
    checking_method: 'Visual',
    rowSpan: 3,
  },
  {
    isSubRow: true,
    check_point: 'Tool Profile and marking',
    specification: 'Part layout report and marking check for profile dimensions',
    checking_method: 'Part layout inspection report',
  },
  {
    isSubRow: true,
    check_point: 'Tool radius',
    specification: 'Tool radius should be as per part radius',
    checking_method: 'Radius Gauge',
  },
];

const MIN_ROWS = DEFAULT_ITEMS.length;

const getValue = (row, keys) => {
  for (const key of keys) {
    if (row?.[key] !== undefined && row?.[key] !== null) return row[key];
  }

  return '';
};

const ToolPreventiveMaintenanceCheckSheetPrint = ({
  items = [],
  currentReport,
  onEditForm,
  onBack,
}) => {
  const navigate = useNavigate();

  const sourceRows = items.length > 0 ? items : DEFAULT_ITEMS;

  const checklistRows = sourceRows.filter((row) => {
    if (!row) return false;
    if (row.isSubRow) return true;
    if (Number(row?.sr_no) >= 1) return true;
    if (row.check_point || row.checking_method || row.specification) return true;
    return false;
  });

  const TOTAL_ROWS = Math.max(MIN_ROWS, checklistRows.length);

  const portraitRowHeight = Math.max(4.8, Math.min(5.6, 178 / TOTAL_ROWS));
  const landscapeRowHeight = Math.max(3.6, Math.min(4.1, 118 / TOTAL_ROWS));

  const TH =
    'border border-black font-bold text-center align-middle bg-white text-black px-1 py-1 text-[9px] whitespace-normal break-words leading-tight';

  const TD =
    'border border-black text-center align-middle px-1 py-1 text-black text-[9px] whitespace-pre-line break-words overflow-hidden bg-white leading-tight';

  const MetaLabel =
    'meta-label border border-black font-bold bg-white text-black text-[9px] px-1 py-1 text-left whitespace-nowrap';

  const MetaValue =
    'meta-value border border-black font-bold bg-white text-black text-[9px] px-1 py-1 text-center whitespace-nowrap';

  const InfoLabel =
    'info-label border border-black text-left align-middle bg-white px-2 py-1 text-[9px] uppercase font-bold text-black whitespace-nowrap';

  const InfoValue =
    'info-value border border-black text-left align-middle bg-white px-2 py-1 text-[10px] font-normal text-black whitespace-normal break-words';

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
          width: 1123px;
          min-height: 794px;
          padding: 6mm;
        }

        .print-table {
          width: 100%;
          height: 100%;
          table-layout: fixed;
          border-collapse: collapse;
        }

        .col-sr {
          width: 5%;
        }

        .col-item {
          width: 16%;
        }

        .col-check {
          width: 18%;
        }

        .col-spec {
          width: 22%;
        }

        .col-method {
          width: 14%;
        }

        .col-before {
          width: 9%;
        }

        .col-after {
          width: 9%;
        }

        .col-remarks {
          width: 7%;
        }

        .text-cell {
          white-space: pre-line !important;
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
            white-space: pre-line !important;
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

          .col-sr {
            width: 5%;
          }

          .col-item {
            width: 16%;
          }

          .col-check {
            width: 17%;
          }

          .col-spec {
            width: 22%;
          }

          .col-method {
            width: 14%;
          }

          .col-before {
            width: 9%;
          }

          .col-after {
            width: 9%;
          }

          .col-remarks {
            width: 8%;
          }

          .print-table th,
          .print-table td {
            padding: 0.25mm 0.25mm !important;
            line-height: 1.02 !important;
            font-size: 5.8px !important;
          }

          .doc-row {
            height: 4.5mm !important;
          }

          .info-row {
            height: 4.7mm !important;
          }

          .column-header-row {
            height: 6.2mm !important;
          }

          .body-row {
            height: ${portraitRowHeight.toFixed(2)}mm !important;
            max-height: ${portraitRowHeight.toFixed(2)}mm !important;
          }

          .revision-row {
            height: 5mm !important;
          }

          .sign-row {
            height: 6mm !important;
          }

          .print-logo {
            max-height: 9mm !important;
          }

          .print-title {
            font-size: 11px !important;
            line-height: 1.05 !important;
            letter-spacing: 0.4px !important;
            white-space: normal !important;
          }

          .meta-label,
          .meta-value {
            font-size: 5.8px !important;
            padding: 0.2mm !important;
          }

          .info-label {
            font-size: 5.8px !important;
            padding: 0.25mm !important;
          }

          .info-value {
            font-size: 6px !important;
            padding: 0.25mm !important;
          }

          .footer-text {
            font-size: 6px !important;
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

          .col-sr {
            width: 4%;
          }

          .col-item {
            width: 15%;
          }

          .col-check {
            width: 18%;
          }

          .col-spec {
            width: 22%;
          }

          .col-method {
            width: 14%;
          }

          .col-before {
            width: 9%;
          }

          .col-after {
            width: 9%;
          }

          .col-remarks {
            width: 9%;
          }

          .print-table th,
          .print-table td {
            padding: 0.28mm 0.35mm !important;
            line-height: 1.03 !important;
            font-size: 6.4px !important;
          }

          .doc-row {
            height: 4mm !important;
          }

          .info-row {
            height: 4.2mm !important;
          }

          .column-header-row {
            height: 5.6mm !important;
          }

          .body-row {
            height: ${landscapeRowHeight.toFixed(2)}mm !important;
            max-height: ${landscapeRowHeight.toFixed(2)}mm !important;
          }

          .revision-row {
            height: 4.5mm !important;
          }

          .sign-row {
            height: 5.5mm !important;
          }

          .print-logo {
            max-height: 8mm !important;
          }

          .print-title {
            font-size: 13px !important;
            line-height: 1.05 !important;
            letter-spacing: 0.6px !important;
            white-space: nowrap !important;
          }

          .meta-label,
          .meta-value {
            font-size: 6.2px !important;
            padding: 0.25mm !important;
          }

          .info-label {
            font-size: 6.2px !important;
            padding: 0.25mm !important;
          }

          .info-value {
            font-size: 6.4px !important;
            padding: 0.25mm !important;
          }

          .footer-text {
            font-size: 6.4px !important;
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
            <col className="col-sr" />
            <col className="col-item" />
            <col className="col-check" />
            <col className="col-spec" />
            <col className="col-method" />
            <col className="col-before" />
            <col className="col-after" />
            <col className="col-remarks" />
          </colgroup>

          {/* ════════════ THEAD ════════════ */}
          <thead className="table-header-group">
            <tr className="doc-row h-[20px]">
              <th
                colSpan={2}
                rowSpan={3}
                className="border border-black p-1 align-middle text-center bg-white overflow-hidden"
              >
                <img
                  src={atomone}
                  alt="ATOM ONE"
                  className="print-logo max-h-[42px] max-w-full block mx-auto object-contain"
                />
              </th>

              <th
                colSpan={4}
                rowSpan={3}
                className="border border-black text-center align-middle bg-white"
              >
                <h1 className="print-title text-[18px] font-bold uppercase tracking-[1px] m-0 text-black whitespace-normal break-words">
                  TOOL PREVENTIVE MAINTENANCE CHECK SHEET
                </h1>
              </th>

              <th className={MetaLabel}>DOC. NO.</th>
              <th className={MetaValue}>
                {currentReport?.doc_no || 'AOT-F-MAINT-06'}
              </th>
            </tr>

            <tr className="doc-row h-[20px]">
              <th className={MetaLabel}>REV. NO.</th>
              <th className={MetaValue}>
                {currentReport?.rev_no || '01'}
              </th>
            </tr>

            <tr className="doc-row h-[20px]">
              <th className={MetaLabel}>ISSUE DATE</th>
              <th className={MetaValue}>
                {formatDisplay(currentReport?.issue_date || currentReport?.doc_date) || '01.10.24'}
              </th>
            </tr>

            <tr className="info-row h-[22px]">
              <th className={InfoLabel}>PART NAME</th>
              <th colSpan={3} className={`${InfoValue} text-cell`}>
                {currentReport?.part_name || ''}
              </th>

              <th className={InfoLabel}>PART NO.</th>
              <th colSpan={3} className={`${InfoValue} text-cell`}>
                {currentReport?.part_no || ''}
              </th>
            </tr>

            <tr className="info-row h-[22px]">
              <th className={InfoLabel}>TOOL NAME</th>
              <th colSpan={3} className={`${InfoValue} text-cell`}>
                {currentReport?.tool_name || ''}
              </th>

              <th className={InfoLabel}>MAINT. DATE</th>
              <th colSpan={3} className={`${InfoValue} text-cell`}>
                {formatDisplay(currentReport?.maint_date || currentReport?.maintenance_date) || ''}
              </th>
            </tr>

            <tr className="info-row h-[22px]">
              <th className={InfoLabel}>PROCESS NAME</th>
              <th colSpan={3} className={`${InfoValue} text-cell`}>
                {currentReport?.process_name || ''}
              </th>

              <th className={InfoLabel}>MAINT. PERSON</th>
              <th colSpan={3} className={`${InfoValue} text-cell`}>
                {currentReport?.maint_person || currentReport?.maintenance_person || currentReport?.maintenance_personnel || ''}
              </th>
            </tr>

            <tr className="column-header-row h-[30px]">
              <th className={TH}>Sr.No.</th>
              <th className={TH}>Item</th>
              <th className={TH}>Check Point</th>
              <th className={TH}>Specification</th>
              <th className={TH}>Checking Method</th>
              <th className={TH}>Before Maint.</th>
              <th className={TH}>After Maint.</th>
              <th className={TH}>Remarks (If Any)</th>
            </tr>
          </thead>

          {/* ════════════ TBODY ════════════ */}
          <tbody>
            {Array.from({ length: TOTAL_ROWS }, (_, i) => {
              const row = checklistRows[i] || null;

              const beforeMaint = getValue(row, [
                'before_maintenance',
                'before_maint',
                'beforeMaint',
                'before',
              ]);

              const afterMaint = getValue(row, [
                'after_maintenance',
                'after_maint',
                'afterMaint',
                'after',
              ]);

              const remarks = getValue(row, [
                'remarks',
                'remark',
                'remarks_if_any',
                'spare_used_remarks',
              ]);

              return (
                <tr key={i} className="body-row break-inside-avoid">
                  {row?.isSubRow ? null : (
                    <>
                      <td
                        className={`${TD} font-bold`}
                        rowSpan={row?.rowSpan || 1}
                      >
                        {row?.sr_no || ''}
                      </td>

                      <td
                        className={`${TD} text-cell font-semibold`}
                        rowSpan={row?.rowSpan || 1}
                      >
                        {row?.item || row?.check_item || ''}
                      </td>
                    </>
                  )}

                  <td className={`${TD} text-cell`}>
                    {row?.check_point || row?.checkpoint || ''}
                  </td>

                  <td className={`${TD} text-cell`}>
                    {row?.specification || ''}
                  </td>

                  <td className={`${TD} text-cell`}>
                    {row?.checking_method || row?.method || ''}
                  </td>

                  <td className={`${TD} text-cell`}>
                    {beforeMaint}
                  </td>

                  <td className={`${TD} text-cell`}>
                    {afterMaint}
                  </td>

                  <td className={`${TD} text-cell`}>
                    {remarks}
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* ════════════ TFOOT ════════════ */}
          <tfoot className="table-footer-group">
            <tr className="revision-row h-[22px]">
              <td className="footer-text border border-black text-center font-bold bg-white">
                REV NO.
              </td>

              <td className="footer-text border border-black text-center font-bold bg-white">
                REVISION DATE
              </td>

              <td colSpan={2} className="footer-text border border-black text-center font-bold bg-white">
                REVISION DETAIL
              </td>

              <td colSpan={4} className="footer-text border border-black bg-white"></td>
            </tr>

            <tr className="revision-row h-[22px]">
              <td className="footer-text border border-black text-center bg-white">
                {currentReport?.rev_no_hist || ''}
              </td>

              <td className="footer-text border border-black text-center bg-white">
                {formatDisplay(currentReport?.revision_date || currentReport?.rev_date) || '01.10.2024'}
              </td>

              <td colSpan={2} className="footer-text border border-black text-center bg-white">
                {currentReport?.revision_detail || currentReport?.rev_desc || 'New Check point Springs/Pu Rods.'}
              </td>

              <td colSpan={4} className="footer-text border border-black bg-white"></td>
            </tr>

            <tr className="sign-row h-[28px]">
              <td colSpan={4} className="border border-black px-2 py-2 bg-white text-left align-top">
                <span className="footer-text font-bold text-[10px] mr-2 text-black uppercase">
                  Checked By :
                </span>

                <span className="footer-text text-[10px] text-black break-words whitespace-normal">
                  {currentReport?.checked_by || ''}
                </span>
              </td>

              <td colSpan={4} className="border border-black px-2 py-2 bg-white text-left align-top">
                <span className="footer-text font-bold text-[10px] mr-2 text-black uppercase">
                  Verified By :
                </span>

                <span className="footer-text text-[10px] text-black break-words whitespace-normal">
                  {currentReport?.verified_by || ''}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ToolPreventiveMaintenanceCheckSheetPrint;