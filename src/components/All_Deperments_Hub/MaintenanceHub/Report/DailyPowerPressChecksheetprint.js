// ============================================================
//  DailyPowerPressChecksheetprint.js
//  Daily Power Press Check Sheet — A4 Print Ready
//  Browser Print Dialog Portrait/Landscape Auto Layout
// ============================================================

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const atomone = '/logo1.jpg';

const MONTH_NAMES = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

const DEFAULT_ITEMS = [
  { sr_no: 1, check_point: 'PRESS CLEAN', specification: 'NO OIL, NO STAIN ETC.', method: 'VISUAL CHECK', rowSpan: 1 },
  { sr_no: 2, check_point: 'AIR PRESSURE', specification: 'BALANCE PRESSURE', method: 'PRESSURE GAUGE', rowSpan: 5 },
  { isSubRow: true, specification: 'HYD. OVERLOAD PRESSURE', method: 'PRESSURE GAUGE' },
  { isSubRow: true, specification: 'CLUTCH PRESSURE', method: 'PRESSURE GAUGE' },
  { isSubRow: true, specification: 'CUSHION PRESSURE', method: 'PRESSURE GAUGE' },
  { isSubRow: true, specification: 'FRL UNIT PRESSURE', method: 'PRESSURE GAUGE' },
  { sr_no: 3, check_point: 'CHECK GREASE LEVEL', specification: 'AS PER GREASE PUMP', method: 'VISUAL CHECK', rowSpan: 1 },
  { sr_no: 4, check_point: 'NUT BOLT CHECK', specification: 'ALL NUT BOLT SHOULD BE TIGHT', method: 'WRENCH/SPANNER', rowSpan: 1 },
  { sr_no: 5, check_point: 'ELECTRIC WIRING CHECK', specification: 'NO DAMAGE/BROKEN WIRE IN MACHINE', method: 'VISUAL CHECK', rowSpan: 1 },
  { sr_no: 6, check_point: 'STROKE BUTTON CHECK DOUBLE HANDED', specification: 'DOUBLE HANDED BUTTON SHOULD BE WORK PROPERLY', method: 'DOUBLE HAND CHECK', rowSpan: 1 },
  { sr_no: 7, check_point: 'PHOTO ELECTRIC GUARD CHECK', specification: 'PHOTO SENSOR GUARD SHOULD BE WORK PROPERLY', method: 'PLC DISPLAY', rowSpan: 1 },
  { sr_no: 8, check_point: 'STOPPING OF SLIDE AT TDC', specification: 'STROKE ALWAYS STOP AT TDC IN SINGLE MODE', method: 'VISUAL CHECK', rowSpan: 1 },
  { sr_no: 9, check_point: 'V-BELT CHECK', specification: 'BELT SHOULD NOT BE DAMAGED/WEAR OUT CONDITION', method: 'VISUAL CHECK', rowSpan: 1 },
  { sr_no: 10, check_point: 'PRESSURE GAUGE', specification: 'WORKING CONDITION/CALIBRATION DUE.', method: 'VISUAL CHECK/CALIB. STICKER', rowSpan: 1 },
];

const getDaysInMonth = (monthName, year) => {
  if (!monthName || !year) return 31;
  const mIndex = MONTH_NAMES.indexOf((monthName || "").toUpperCase());
  if (mIndex === -1) return 31;
  return new Date(year, mIndex + 1, 0).getDate();
};

const getFilledDaysCount = (items) => {
  let maxDataDay = 0;

  items.forEach((item) => {
    if (item.days) {
      if (Array.isArray(item.days)) {
        for (let i = item.days.length - 1; i >= 0; i--) {
          const val = item.days[i];

          if (
            val !== null &&
            val !== undefined &&
            String(val).trim() !== '' &&
            String(val).toLowerCase() !== 'null'
          ) {
            maxDataDay = Math.max(maxDataDay, i + 1);
            break;
          }
        }
      } else {
        Object.keys(item.days).forEach((key) => {
          const val = item.days[key];

          if (
            val !== null &&
            val !== undefined &&
            String(val).trim() !== '' &&
            String(val).toLowerCase() !== 'null'
          ) {
            maxDataDay = Math.max(maxDataDay, parseInt(key, 10) + 1);
          }
        });
      }
    }
  });

  return maxDataDay;
};

const DailyPowerPressChecksheetprint = ({ items = DEFAULT_ITEMS, onEditForm }) => {
  const navigate = useNavigate();
  const filterRef = useRef(null);

  const rowData = items.length > 0 ? items : DEFAULT_ITEMS;

  const currentDate = new Date();
  const currentMonthName = MONTH_NAMES[currentDate.getMonth()];
  const currentYearStr = currentDate.getFullYear().toString();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterMonth, setFilterMonth] = useState(currentMonthName);
  const [filterMachine, setFilterMachine] = useState("PP-01");

  const [appliedMonth, setAppliedMonth] = useState("");
  const [appliedMachine, setAppliedMachine] = useState("");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApplyFilter = () => {
    setAppliedMonth(filterMonth);
    setAppliedMachine(filterMachine);
    setIsFilterOpen(false);
  };

  const handleResetFilter = () => {
    setFilterMonth(currentMonthName);
    setFilterMachine("PP-01");
    setAppliedMonth("");
    setAppliedMachine("");
    setIsFilterOpen(false);
  };

  const monthMaxDays = getDaysInMonth(appliedMonth, currentYearStr);
  const dataDays = appliedMonth ? getFilledDaysCount(rowData) : 0;

  const displayedDays = dataDays > 0 ? Math.min(dataDays, monthMaxDays) : monthMaxDays;
  const safeDisplayedDays = Math.max(5, displayedDays);

  const maxInfoColsAllowed = safeDisplayedDays + 1;
  const infoCols = Math.min(maxInfoColsAllowed, Math.max(6, Math.floor(safeDisplayedDays * 0.3)));
  const topLabelSpan = Math.floor(infoCols / 2);
  const topValueSpan = infoCols - topLabelSpan;
  const titleColSpan = safeDisplayedDays + 4 - 2 - topLabelSpan - topValueSpan;

  const span1 = Math.floor(safeDisplayedDays / 4);
  const span2 = Math.floor(safeDisplayedDays / 4);
  const span3 = Math.floor(safeDisplayedDays / 4);
  const span4 = safeDisplayedDays - (span1 + span2 + span3);

  const TH =
    'border border-black font-bold text-center align-middle leading-none bg-[#f5f5f5] text-black px-[2px] py-[4px] text-[9px] whitespace-nowrap uppercase';

  const TD =
    'border border-black text-center align-middle bg-white px-[2px] py-[4px] text-black text-[9px] uppercase';

  const InfoLabel =
    'info-label border border-black font-bold bg-[#f5f5f5] text-black text-[10px] px-2 py-1 text-left uppercase whitespace-nowrap overflow-visible text-ellipsis';

  const InfoValue =
    'info-value border border-black font-semibold bg-white text-black text-[10px] px-2 py-1 text-center whitespace-nowrap overflow-visible text-ellipsis';

  const totalRows = Math.max(rowData.length, 1);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen print:min-h-0 bg-white p-0 m-0 text-black overflow-visible print:p-0 print:m-0">
      <div className="flex justify-end items-center gap-3 mb-4 print:hidden">
        <button
          onClick={() => navigate("/Maintenance/Machine/daily")}
          className="bg-[#607d8b] hover:bg-[#4d646f] text-white border-none px-4 py-2 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5 shadow-sm"
        >
          <i className="bi bi-arrow-left-circle-fill"></i> Back
        </button>

        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="bg-[#3b5998] hover:bg-[#2d4373] text-white border-none px-4 py-2 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5 shadow-sm"
          >
            <i className="bi bi-funnel-fill"></i> Filter
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              <div className="flex justify-between items-center border-b p-3">
                <h3 className="text-[#3b5998] font-bold text-sm flex items-center gap-2 m-0">
                  <i className="bi bi-funnel-fill"></i> Filter Reports
                </h3>

                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <div className="p-4 flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 flex items-center gap-2 mb-1 uppercase tracking-wide">
                    <i className="bi bi-calendar3"></i> Month
                  </label>

                  <select
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[#3b5998]"
                  >
                    {MONTH_NAMES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 flex items-center gap-2 mb-1 uppercase tracking-wide">
                    <i className="bi bi-gear-fill"></i> Machine
                  </label>

                  <select
                    value={filterMachine}
                    onChange={(e) => setFilterMachine(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[#3b5998]"
                  >
                    {["PP-01", "PP-02", "PP-03", "PP-04", "PP-05", "PP-06"].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 p-3 border-t bg-gray-50 rounded-b-lg">
                <button
                  onClick={handleApplyFilter}
                  className="flex-1 bg-[#4285F4] hover:bg-[#3367D6] text-white py-2 rounded text-sm font-bold flex justify-center items-center gap-2 border-none cursor-pointer"
                >
                  <i className="bi bi-check-circle-fill"></i> Apply
                </button>

                <button
                  onClick={handleResetFilter}
                  className="flex-1 bg-white border border-[#ff4d4f] text-[#ff4d4f] hover:bg-red-50 py-2 rounded text-sm font-bold flex justify-center items-center gap-2 cursor-pointer"
                >
                  <i className="bi bi-arrow-counterclockwise"></i> Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {onEditForm && (
          <button
            onClick={() => onEditForm()}
            className="bg-[#ff9800] hover:bg-[#e68a00] text-white border-none px-4 py-2 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5 shadow-sm"
          >
            <i className="bi bi-pencil-square"></i> Edit
          </button>
        )}

        <button
          onClick={handlePrint}
          className="bg-[#4CAF50] hover:bg-[#43a047] text-white border-none px-4 py-2 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5 shadow-sm"
        >
          <i className="bi bi-printer-fill"></i> Print
        </button>
      </div>

      <style>{`
  .print-container {
    width: 1123px;
    min-height: 794px;
  }

  .print-table {
    width: 100%;
    height: 100%;
    table-layout: fixed;
    border-collapse: collapse;
  }

  /* ✅ Screen preview column widths */
  .col-sr {
    width: 3%;
  }

  .col-check {
    width: 11%;
  }

  .col-spec {
    width: 16%;
  }

  .col-method {
    width: 11%;
  }

  .col-day {
    width: calc(59% / var(--day-count));
  }

  .fixed-text-cell,
  .method-cell {
    white-space: normal !important;
    word-break: normal !important;
    overflow-wrap: anywhere !important;
    line-height: 1.1 !important;
  }

  .day-cell,
  .day-header {
    white-space: nowrap !important;
    text-align: center !important;
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
      overflow: hidden !important;
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

    .fixed-text-cell,
    .method-cell {
      white-space: normal !important;
      word-break: normal !important;
      overflow-wrap: anywhere !important;
    }

    .day-cell,
    .day-header {
      white-space: nowrap !important;
      text-align: center !important;
    }
  }

  /* Browser print dialog me Portrait select hoga to ye layout lagega */
  @media print and (orientation: portrait) {
    .print-container {
      width: 198mm !important;
      height: 287mm !important;
      min-height: 287mm !important;
    }

    .col-sr {
      width: 3.5% !important;
    }

    .col-check {
      width: 10.5% !important;
    }

    .col-spec {
      width: 15% !important;
    }

    .col-method {
      width: 10% !important;
    }

    .col-day {
      width: calc(61% / var(--day-count)) !important;
    }

    .print-table th,
    .print-table td {
      padding: 0.45mm 0.35mm !important;
      line-height: 1.05 !important;
      font-size: 6.8px !important;
    }

    .header-row-main {
      height: 9mm !important;
    }

    .header-row-small {
      height: 6mm !important;
    }

    .date-info-row {
      height: 6mm !important;
    }

    .date-number-row {
      height: 5.5mm !important;
    }

    .check-row {
      height: calc(198mm / var(--body-row-count)) !important;
    }

    .footer-sign-row {
      height: 9mm !important;
    }

    .footer-legend-row {
      height: 8mm !important;
    }

    .print-logo {
      height: 10mm !important;
      max-height: 10mm !important;
    }

    .print-title {
      font-size: 12px !important;
      line-height: 1.05 !important;
      letter-spacing: 0.4px !important;
      white-space: normal !important;
    }

    .info-label,
    .info-value {
      font-size: 6.8px !important;
      padding: 0.4mm !important;
    }

    .fixed-text-cell {
      font-size: 6.8px !important;
    }

    .method-cell {
      font-size: 6.5px !important;
      line-height: 1.05 !important;
    }

    .day-header,
    .day-cell {
      font-size: 5.8px !important;
      padding: 0.25mm !important;
    }

    .footer-text {
      font-size: 7px !important;
    }

    .legend-symbol {
      font-size: 11px !important;
    }
  }

  /* Browser print dialog me Landscape select hoga to ye layout lagega */
  @media print and (orientation: landscape) {
    .print-container {
      width: 287mm !important;
      height: 200mm !important;
      min-height: 200mm !important;
    }

    .col-sr {
      width: 3% !important;
    }

    .col-check {
      width: 11% !important;
    }

    .col-spec {
      width: 16% !important;
    }

    .col-method {
      width: 11% !important;
    }

    .col-day {
      width: calc(59% / var(--day-count)) !important;
    }

    .print-table th,
    .print-table td {
      padding: 0.55mm 0.45mm !important;
      line-height: 1.08 !important;
      font-size: 8px !important;
    }

    .header-row-main {
      height: 8mm !important;
    }

    .header-row-small {
      height: 6mm !important;
    }

    .date-info-row {
      height: 6mm !important;
    }

    .date-number-row {
      height: 5mm !important;
    }

    .check-row {
      height: calc(125mm / var(--body-row-count)) !important;
    }

    .footer-sign-row {
      height: 10mm !important;
    }

    .footer-legend-row {
      height: 8mm !important;
    }

    .print-logo {
      height: 10mm !important;
      max-height: 10mm !important;
    }

    .print-title {
      font-size: 18px !important;
      line-height: 1.05 !important;
      letter-spacing: 0.8px !important;
      white-space: nowrap !important;
    }

    .info-label,
    .info-value {
      font-size: 8px !important;
      padding: 0.5mm !important;
    }

    .fixed-text-cell {
      font-size: 8px !important;
    }

    .method-cell {
      font-size: 7.5px !important;
      line-height: 1.08 !important;
    }

    .day-header,
    .day-cell {
      font-size: 6.8px !important;
      padding: 0.3mm !important;
    }

    .footer-text {
      font-size: 8px !important;
    }

    .legend-symbol {
      font-size: 13px !important;
    }
  }
`}</style>

      <div
        className="
          print-container
          bg-white
          mx-auto
          font-sans
          box-border
          flex
          flex-col
          overflow-visible
        "
      >
        <table
          className="print-table w-full border-collapse border border-black"
          style={{
            height: "100%",
            tableLayout: "fixed",
            "--day-count": safeDisplayedDays,
            "--body-row-count": totalRows,
          }}
        >
          <colgroup>
            <col className="col-sr" />
            <col className="col-check" />
            <col className="col-spec" />
            <col className="col-method" />

            {Array.from({ length: safeDisplayedDays }).map((_, i) => (
              <col key={i} className="col-day" />
            ))}
          </colgroup>

          <thead className="table-header-group">
            <tr className="header-row-main" style={{ height: "34px" }}>
              <th
                colSpan={2}
                rowSpan={3}
                className="border border-black p-1 align-middle text-center bg-white"
              >
                <img
                  src={atomone}
                  alt="ATOM ONE"
                  className="print-logo h-[40px] w-auto object-contain max-w-full block mx-auto"
                />
              </th>

              <th
                colSpan={titleColSpan}
                rowSpan={3}
                className="border border-black text-center align-middle bg-white"
              >
                <h1 className="print-title text-[24px] font-bold uppercase tracking-[1.5px] m-0 text-black whitespace-nowrap overflow-visible text-ellipsis px-2">
                  DAILY POWER PRESS CHECK SHEET
                </h1>
              </th>

              <th colSpan={topLabelSpan} className={InfoLabel}>
                DOC NO.
              </th>

              <th colSpan={topValueSpan} className={InfoValue}>
                AOT-F-MM-02
              </th>
            </tr>

            <tr className="header-row-small" style={{ height: "24px" }}>
              <th colSpan={topLabelSpan} className={InfoLabel}>
                REVISION
              </th>

              <th colSpan={topValueSpan} className={InfoValue}>
                03
              </th>
            </tr>

            <tr className="header-row-small" style={{ height: "24px" }}>
              <th colSpan={topLabelSpan} className={InfoLabel}>
                DATE
              </th>

              <th colSpan={topValueSpan} className={InfoValue}>
                31.05.2024
              </th>
            </tr>

            <tr className="date-info-row" style={{ height: "24px" }}>
              <th rowSpan={2} className={`${TH} fixed-text-cell`}>
                S. NO.
              </th>

              <th rowSpan={2} className={`${TH} fixed-text-cell`}>
                CHECK POINT
              </th>

              <th rowSpan={2} className={`${TH} fixed-text-cell`}>
                SPECIFICATION
              </th>

              <th rowSpan={2} className={`${TH} fixed-text-cell`}>
                <div>
                  CHECKING
                  <br />
                  METHOD
                </div>
              </th>

              <th colSpan={span1} className={`${TH} fixed-text-cell text-left pl-2 bg-white`}>
                DATE
              </th>

              <th colSpan={span2} className={`${TH} fixed-text-cell text-left pl-2 bg-white`}>
                MONTH: {appliedMonth}
              </th>

              <th colSpan={span3} className={`${TH} fixed-text-cell text-left pl-2 bg-white`}>
                TON:
              </th>

              <th colSpan={span4} className={`${TH} fixed-text-cell text-left pl-2 bg-white`}>
                PP: {appliedMachine}
              </th>
            </tr>

            <tr className="date-number-row" style={{ height: "22px" }}>
              {Array.from({ length: safeDisplayedDays }).map((_, i) => (
                <th
                  key={i}
                  className={`${TH} day-header`}
                  style={{
                    fontSize: "8px",
                    padding: "2px",
                    backgroundColor: "white",
                    whiteSpace: "nowrap",
                  }}
                >
                  {i + 1}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rowData.map((row, i) => (
              <tr key={i} className="check-row break-inside-avoid">
                {!row.isSubRow && (
                  <>
                    <td className={`${TD} fixed-text-cell font-bold`} rowSpan={row.rowSpan || 1}>
                      {row.sr_no}
                    </td>

                    <td className={`${TD} fixed-text-cell font-bold`} rowSpan={row.rowSpan || 1}>
                      {row.check_point}
                    </td>
                  </>
                )}

                <td className={`${TD} fixed-text-cell font-semibold`}>
                  {row.specification || ''}
                </td>

                <td
                  className={`${TD} method-cell leading-4`}
                  style={{
                    fontSize: "9px",
                  }}
                >
                  {row.method || ''}
                </td>

                {Array.from({ length: safeDisplayedDays }).map((_, d) => (
                  <td key={d} className={`${TD} day-cell`}>
                    {appliedMonth ? row.days?.[d] || '' : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

          <tfoot className="table-footer-group">
            <tr className="footer-sign-row" style={{ height: "38px" }}>
              <td
                colSpan={4}
                className="footer-text border border-black bg-white px-3 py-1 text-[11px] text-center font-bold"
              >
                MAINTENANCE INCHARGE SIGN.
              </td>

              {Array.from({ length: safeDisplayedDays }).map((_, d) => (
                <td key={`maint-${d}`} className={`${TD} day-cell`}></td>
              ))}
            </tr>

            <tr className="footer-sign-row" style={{ height: "38px" }}>
              <td
                colSpan={4}
                className="footer-text border border-black bg-white px-3 py-1 text-[11px] text-center font-bold"
              >
                MANAGER SIGN.
              </td>

              <td colSpan={Math.floor(safeDisplayedDays / 3)} className={TD}></td>
              <td colSpan={Math.floor(safeDisplayedDays / 3)} className={TD}></td>
              <td
                colSpan={safeDisplayedDays - 2 * Math.floor(safeDisplayedDays / 3)}
                className={TD}
              ></td>
            </tr>

            <tr className="footer-legend-row">
              <td
                colSpan={4}
                rowSpan={2}
                className="footer-text border border-black p-2 text-[12px] font-bold text-center bg-white align-middle"
              >
                LEGENDS
              </td>

              <td
                colSpan={safeDisplayedDays - 4}
                rowSpan={2}
                className="footer-text border border-black p-1 text-[12px] font-bold text-center bg-white align-middle"
              >
                CHECK POINT
              </td>

              <td
                colSpan={2}
                className="legend-symbol border border-black p-1 text-center font-bold text-[16px] bg-white align-middle"
              >
                ✓
              </td>

              <td
                colSpan={2}
                className="footer-text border border-black p-1 text-center text-[12px] bg-white font-bold align-middle"
              >
                OK
              </td>
            </tr>

            <tr className="footer-legend-row h-[25px]">
              <td
                colSpan={2}
                className="legend-symbol border border-black p-1 text-center font-bold text-[16px] bg-white align-middle"
              >
                X
              </td>

              <td
                colSpan={2}
                className="footer-text border border-black p-1 text-center text-[12px] bg-white font-bold align-middle"
              >
                NOT OK
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default DailyPowerPressChecksheetprint;