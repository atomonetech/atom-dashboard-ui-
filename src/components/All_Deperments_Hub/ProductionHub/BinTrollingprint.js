import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const atomone = '/logo1.jpg';

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const formatDisplay = (dateStr) => {
  if (!dateStr) return '';
  const parts = String(dateStr).split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dateStr;
};

const BinTrollingprint = ({ onEditForm, onBack }) => {
  const navigate = useNavigate();
  const filterRef = useRef(null);

  const currentDate = new Date();
  const currentMonthName = MONTH_NAMES[currentDate.getMonth()];

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterMonth, setFilterMonth] = useState(currentMonthName);
  const [appliedMonth, setAppliedMonth] = useState(currentMonthName);

  const [printData, setPrintData] = useState({
    month: '',
    w1: {}, w2: {}, w3: {}, w4: {},
    remarks: {},
    cleaning: { w1: {}, w2: {}, w3: {}, w4: {} },
    cleaningRemarks: {},
    maintenance: { w1: {}, w2: {}, w3: {}, w4: {} },
    maintenanceRemarks: {},
    filledWeeks: []
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchMonthlyData = async (month) => {
    setLoading(true);
    try {
      const response = await fetch(`http://192.168.0.34:8000/api/get-bin-trolley/?month=${month}`);
      const result = await response.json();

      if (result.success) {
        const structuredData = {
          month: month,
          w1: {}, w2: {}, w3: {}, w4: {},
          remarks: {},
          cleaning: { w1: {}, w2: {}, w3: {}, w4: {} },
          cleaningRemarks: {},
          maintenance: { w1: {}, w2: {}, w3: {}, w4: {} },
          maintenanceRemarks: {},
          filledWeeks: []
        };

        result.data.forEach(report => {
          const weekKey = report.week.toLowerCase();
          if (!structuredData.filledWeeks.includes(report.week)) {
            structuredData.filledWeeks.push(report.week);
          }

          // Checkpoints + remarks
          if (report.checkpoints) {
            Object.keys(report.checkpoints).forEach(id => {
              if (structuredData[weekKey]) {
                structuredData[weekKey][id] = report.checkpoints[id].status;
              }
              if (report.checkpoints[id].remarks) {
                structuredData.remarks[id] = report.checkpoints[id].remarks;
              }
            });
          }

          // Cleaning + remarks
          if (report.cleaning_details) {
            Object.keys(report.cleaning_details).forEach(id => {
              if (structuredData.cleaning[weekKey]) {
                structuredData.cleaning[weekKey][id] = report.cleaning_details[id].frequency;
              }
              if (report.cleaning_details[id].remarks) {
                structuredData.cleaningRemarks[id] = report.cleaning_details[id].remarks;
              }
            });
          }

          // Maintenance + remarks
          if (report.maintenance_details) {
            Object.keys(report.maintenance_details).forEach(id => {
              if (structuredData.maintenance[weekKey]) {
                structuredData.maintenance[weekKey][id] = report.maintenance_details[id].frequency;
              }
              if (report.maintenance_details[id].remarks) {
                structuredData.maintenanceRemarks[id] = report.maintenance_details[id].remarks;
              }
            });
          }
        });

        structuredData.filledWeeks.sort();
        setPrintData(structuredData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilter = () => {
    setAppliedMonth(filterMonth);
    setIsFilterOpen(false);
    fetchMonthlyData(filterMonth);
  };

  useEffect(() => {
    fetchMonthlyData(currentMonthName);
  }, []);

  const checkPoints = [
    { id: 'cp1', text: "Bin / Trolley Should Be Clean Properly", method: "VISUAL" },
    { id: 'cp2', text: "Bin / Trolley Should be Free From Dust", method: "VISUAL" },
    { id: 'cp3', text: "Bin / Trolley Should Not Be Damage And Broken", method: "INSPECTION" },
    { id: 'cp4', text: "Bin / Trolley Should be Free From Oil Surface", method: "VISUAL" },
    { id: 'cp5', text: "Bin / Trolley Should Be Clean In Bin Cleaning Area", method: "INSPECTION" },
    { id: 'cp6', text: "Others (Please Specify)", method: "MANUAL" }
  ];

  const cleaningDetails = [
    { id: 'cd1', label: 'Total Bin / Trolley Quantity' },
    { id: 'cd2', label: 'Bin / Trolley Clean Quantity' },
    { id: 'cd3', label: 'Bin / Trolley Unclean Quantity' }
  ];

  const maintenanceDetails = [
    { id: 'md1', label: 'Total Bin/Trolley Maintenance Quantity' },
    { id: 'md2', label: 'Bin/Trolley Ok Quantity' },
    { id: 'md3', label: 'Bin/Trolley Reject Quantity' }
  ];

  const TH = 'border border-black font-bold text-center align-middle bg-white text-black px-1 py-1 text-[13px] break-words leading-tight';
  const TD = 'border border-black text-center align-middle px-1 py-1 text-black text-[12px]';
  const InfoLabel = 'border border-black font-semibold bg-white text-black text-[12px] px-2 py-1 text-center whitespace-nowrap';
  const InfoValue = 'border border-black font-bold bg-white text-black text-[12px] px-2 py-1 text-center whitespace-nowrap';

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-4 text-black">

      {/* ── Top Bar ── */}
      <div className="flex justify-end gap-3 mb-4 print:hidden">

        <button
          onClick={() => navigate("/production-hub")}
          className="bg-[#607d8b] hover:bg-[#4d646f] text-white px-5 py-2 rounded-md font-bold text-sm flex items-center gap-1.5 transition-colors shadow-md"
        >
          <i className="bi bi-arrow-left-circle-fill"></i> Back
        </button>

        {/* Filter Button */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="bg-[#3b5998] hover:bg-[#2d4373] text-white px-5 py-2 rounded-md font-bold text-sm flex items-center gap-2 transition-colors shadow-md"
          >
            <i className="bi bi-funnel-fill"></i> Filter Month
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-4">
              <div className="mb-4">
                <label className="text-xs font-bold text-gray-500 block mb-1">SELECT MONTH</label>
                <select
                  value={filterMonth}
                  onChange={(e) => setFilterMonth(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none"
                >
                  {MONTH_NAMES.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleApplyFilter}
                className="w-full bg-[#4285F4] hover:bg-[#3367d6] text-white py-2 rounded text-sm font-bold transition-colors"
              >
                Apply Changes
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => window.print()}
          disabled={loading}
          className={`${loading ? 'bg-gray-400' : 'bg-[#4CAF50] hover:bg-[#43a047]'} text-white px-5 py-2 rounded-md font-bold text-sm flex items-center gap-1.5 transition-colors shadow-md`}
        >
          <i className="bi bi-printer-fill"></i> {loading ? 'Loading...' : 'Print Report'}
        </button>
      </div>

      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 8mm; }
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; background-color: white; }
          .print-hidden { display: none !important; }
        }
      `}</style>

      {loading && (
        <div className="fixed top-20 right-10 bg-white border border-blue-200 text-blue-700 px-4 py-2 rounded shadow-lg z-50 animate-pulse font-bold print:hidden">
          Fetching data from database...
        </div>
      )}

      {/* ── Main A4 Print Container ── */}
      <div className={`bg-white mx-auto shadow-lg font-sans w-[297mm] min-h-[210mm] box-border p-[5mm] print:w-full print:p-0 print:m-0 print:shadow-none print:block ${loading ? 'opacity-50' : ''}`}>

        <table className="w-full border-collapse table-fixed border-2 border-black">
          <colgroup>
            <col className="w-[6%]" />
            <col className="w-[34%]" />
            <col className="w-[14%]" />
            <col className="w-[8%]" />
            <col className="w-[8%]" />
            <col className="w-[8%]" />
            <col className="w-[8%]" />
            <col className="w-[14%]" />
          </colgroup>

          <thead className="table-header-group">
            <tr className="h-[30px]">
              <th colSpan={2} rowSpan={3} className="border border-black p-2 align-middle text-center bg-white">
                <img src={atomone} alt="ATOM ONE" className="max-h-[60px] max-w-full block mx-auto object-contain bg-white" />
              </th>
              <th colSpan={4} rowSpan={3} className="border border-black text-center align-middle bg-white px-2">
                <h1 className="text-[20px] font-bold tracking-wide m-0 text-black leading-snug">
                  Bin & Trolley Cleaning Check Sheet And<br />Maintenance Record Sheet
                </h1>
              </th>
              <th className={InfoLabel}>Doc</th>
              <th className={InfoValue}>ATO-F-PROD-02A</th>
            </tr>
            <tr className="h-[28px]">
              <th className={InfoLabel}>Rev.No.</th>
              <th className={InfoValue}>0</th>
            </tr>
            <tr className="h-[28px]">
              <th className={InfoLabel}>Date:-</th>
              <th className={InfoValue}>{formatDisplay(new Date().toISOString().split('T')[0])}</th>
            </tr>
          </thead>

          <tbody>
            <tr className="h-[35px]">
              <td rowSpan={2} className={TH}>SR.NO.</td>
              <td rowSpan={2} className={TH}>Check Point</td>
              <td rowSpan={2} className={TH}>Checking Method</td>
              <td colSpan={4} className={TH}>Status (Y/N)</td>
              <td rowSpan={2} className={TH}>Remarks</td>
            </tr>
            <tr className="h-[30px]">
              <td className={TH}>W1</td>
              <td className={TH}>W2</td>
              <td className={TH}>W3</td>
              <td className={TH}>W4</td>
            </tr>

            {checkPoints.map((item, index) => (
              <tr key={item.id} className="h-[32px]">
                <td className={TD}>{index + 1}</td>
                <td className={`${TD} text-left pl-2`}>{item.text}</td>
                <td className={TD}>{item.method}</td>
                <td className={TD}>{printData.w1?.[item.id] || ''}</td>
                <td className={TD}>{printData.w2?.[item.id] || ''}</td>
                <td className={TD}>{printData.w3?.[item.id] || ''}</td>
                <td className={TD}>{printData.w4?.[item.id] || ''}</td>
                <td className={`${TD} text-left pl-1 text-[11px]`}>
                  {printData.remarks?.[item.id] || ''}
                </td>
              </tr>
            ))}

            <tr className="h-[15px] border-y-[2px] border-black">
              <td colSpan={8} className="bg-white"></td>
            </tr>

            <tr className="h-[35px]">
              <td colSpan={3} className={`${TH} text-[14px]`}>Responsibility</td>
              <td className={TD}></td>
              <td className={TD}></td>
              <td className={`${TH} text-[12px]`}>Frequency</td>
              <td className={`${TH} text-[12px]`}>Weekly</td>
              <td className={`${TH} text-[13px] text-left pl-2`}>
                Month:- <span className="font-bold text-black">{appliedMonth}</span>
              </td>
            </tr>

            <tr className="h-[30px]">
              <td colSpan={3} className={`${TH} text-[14px]`}>Cleaning Detail</td>
              <td className={TH}>W1</td>
              <td className={TH}>W2</td>
              <td className={TH}>W3</td>
              <td className={TH}>W4</td>
              <td className={TH}>Remarks</td>
            </tr>

            {cleaningDetails.map(detail => (
              <tr key={detail.id} className="h-[32px]">
                <td colSpan={3} className={`${TD} text-left pl-2`}>{detail.label}</td>
                <td className={TD}>{printData.cleaning.w1?.[detail.id] || ''}</td>
                <td className={TD}>{printData.cleaning.w2?.[detail.id] || ''}</td>
                <td className={TD}>{printData.cleaning.w3?.[detail.id] || ''}</td>
                <td className={TD}>{printData.cleaning.w4?.[detail.id] || ''}</td>
                <td className={`${TD} text-left pl-1 text-[11px]`}>
                  {printData.cleaningRemarks?.[detail.id] || ''}
                </td>
              </tr>
            ))}

            <tr className="h-[32px]">
              <td colSpan={3} className={`${TH} text-[14px]`}>Signature</td>
              <td className={TD}></td>
              <td className={TD}></td>
              <td className={TD}></td>
              <td className={TD}></td>
              <td className={TD}></td>
            </tr>

            <tr className="h-[30px] border-t-[2px] border-black">
              <td colSpan={3} className={`${TH} text-[14px]`}>Maintenance Detail</td>
              <td className={TH}>W1</td>
              <td className={TH}>W2</td>
              <td className={TH}>W3</td>
              <td className={TH}>W4</td>
              <td className={TH}></td>
            </tr>

            {maintenanceDetails.map(detail => (
              <tr key={detail.id} className="h-[32px]">
                <td colSpan={3} className={`${TD} text-left pl-2`}>{detail.label}</td>
                <td className={TD}>{printData.maintenance.w1?.[detail.id] || ''}</td>
                <td className={TD}>{printData.maintenance.w2?.[detail.id] || ''}</td>
                <td className={TD}>{printData.maintenance.w3?.[detail.id] || ''}</td>
                <td className={TD}>{printData.maintenance.w4?.[detail.id] || ''}</td>
                <td className={`${TD} text-left pl-1 text-[11px]`}>
                  {printData.maintenanceRemarks?.[detail.id] || ''}
                </td>
              </tr>
            ))}

            <tr className="h-[32px]">
              <td colSpan={3} className={`${TD} font-semibold text-left pl-2`}>Signature</td>
              <td className={TD}></td>
              <td className={TD}></td>
              <td className={TD}></td>
              <td className={TD}></td>
              <td className={TD}></td>
            </tr>
          </tbody>

          <tfoot className="table-footer-group">
            <tr>
              <td colSpan={8} className="border border-black p-0 h-[45px] bg-white">
                <div className="flex w-full h-full">
                  <div className="w-[45%] border-r border-black px-3 py-2 flex items-center">
                    <span className="font-bold text-[14px] text-black">Prepared By :-</span>
                  </div>
                  <div className="w-[55%] px-3 py-2 flex items-center">
                    <span className="font-bold text-[14px] text-black">APPROVED BY :-</span>
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

export default BinTrollingprint;