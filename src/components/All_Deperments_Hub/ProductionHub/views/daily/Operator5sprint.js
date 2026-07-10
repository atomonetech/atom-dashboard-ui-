import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const atomone = '/logo1.jpg';

const MONTH_NAMES = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

const S5_DATA = [
  { s: "1'S'", points: [
    "Identify all necessary and unnecessary items at your workplace.",
    "Separate the necessary and unnecessary items kept at your workplace and place them in their designated locations.",
    "Dispose of used or damaged items such as gloves, clothes, tea cups, polythene, newspapers, etc. in the dustbin.",
    "If you face any kind of difficulty, contact your supervisor."
  ]},
  { s: "2'S'", points: [
    "Arrange all items at your workplace systematically in their designated places so they can be easily found when needed.",
    "Clean all necessary items kept at your workplace.",
    "If you do not know the designated place of any item, contact your supervisor and keep it in the place suggested by them."
  ]},
  { s: "3'S'", points: [
    "Clean all necessary items kept at your workplace.",
    "Before starting work, clean the machine according to the checklist.",
    "Keep the surrounding area clean; damaged gloves, clothes, defective parts, polythene, oil, etc. should not be scattered around."
  ]},
  { s: "4'S'", points: [
    "Create standard rules and procedures for performing all tasks."
  ]},
  { s: "5'S'", points: [
    "Perform all tasks according to the established rules and follow them consistently."
  ]}
];

const getDaysInMonth = (monthName, year) => {
  if (!monthName || !year) return 31; 
  const mIndex = MONTH_NAMES.indexOf(monthName.toUpperCase());
  if (mIndex === -1) return 31;
  return new Date(year, mIndex + 1, 0).getDate();
};

const Operator5sprint = ({ area = "P.Shop & Parking area" }) => {
  const navigate = useNavigate();
  const filterRef = useRef(null);

  const currentDate = new Date();
  const currentMonthName = MONTH_NAMES[currentDate.getMonth()];
  const currentYearStr = currentDate.getFullYear().toString();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterMonth, setFilterMonth] = useState(currentMonthName);
  const [filterYear, setFilterYear] = useState(currentYearStr);
  
  const [appliedMonth, setAppliedMonth] = useState("");
  const [appliedYear, setAppliedYear] = useState("");

  const daysCount = (appliedMonth && appliedYear) ? getDaysInMonth(appliedMonth, parseInt(appliedYear)) : 31;
  const daysArray = Array.from({ length: daysCount }, (_, i) => i + 1);

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
    setAppliedYear(filterYear);
    setIsFilterOpen(false);
  };

  const TH = 'border border-black font-bold text-center align-middle bg-[#f5f5f5] text-black px-0.5 py-0.5 text-[9px] print:text-[7.5px] uppercase leading-tight break-words';
  const TD = 'border border-black text-center align-middle bg-white px-0.5 py-0.5 text-black text-[9px] print:text-[7.5px] uppercase leading-tight break-words';
  const InfoLabel = 'border border-black font-bold bg-[#f5f5f5] text-[9px] print:text-[7.5px] px-1 py-0.5 text-left uppercase break-words';
  const InfoValue = 'border border-black font-semibold bg-white text-[9px] print:text-[7.5px] px-1 py-0.5 text-center uppercase break-words';

  return (
    <div className="min-h-screen bg-[#e0e0e0] p-4 text-black flex flex-col items-center print:min-h-0 print:p-0 print:bg-white print:block">

      <div className="flex justify-end gap-3 mb-4 print:hidden w-full max-w-[297mm]">
        <button onClick={() => navigate("/production-hub")} className="bg-[#607d8b] hover:bg-[#4d646f] text-white px-4 py-2 rounded font-bold text-sm transition-colors">
          <i className="bi bi-arrow-left-circle-fill"></i> Back
        </button>

        <div className="relative" ref={filterRef}>
          <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="bg-[#3b5998] hover:bg-[#2d4373] text-white px-4 py-2 rounded font-bold text-sm transition-colors">
            <i className="bi bi-funnel-fill"></i> Filter Month/Year
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-4">
              <div className="mb-3">
                <label className="text-xs font-bold text-gray-500 block mb-1">SELECT MONTH</label>
                <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="w-full border border-gray-300 rounded p-2 text-sm">
                  {MONTH_NAMES.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="text-xs font-bold text-gray-500 block mb-1">SELECT YEAR</label>
                <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="w-full border border-gray-300 rounded p-2 text-sm">
                  {["2024", "2025", "2026", "2027", "2028"].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <button onClick={handleApplyFilter} className="w-full bg-[#4285F4] text-white py-2 rounded text-sm font-bold hover:bg-[#3367d6] transition-colors">
                Apply Changes
              </button>
            </div>
          )}
        </div>

        <button onClick={() => window.print()} className="bg-[#4CAF50] hover:bg-[#43a047] text-white px-4 py-2 rounded font-bold text-sm transition-colors">
          <i className="bi bi-printer-fill"></i> Print
        </button>
      </div>

      <style>{`
        @media print {
          @page { 
            size: auto; 
            margin: 5mm; 
          }
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important;
            background-color: white;
            margin: 0;
            padding: 0;
          }
          
          /* Apply the full-page stretch to BOTH Landscape and Portrait */
          .print-a4-container {
            height: 97vh !important; /* Stretches the table to fill 97% of the paper height */
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin: 0 auto !important; 
            page-break-inside: avoid;
          }

          /* Ensures the table itself forces its rows to distribute the extra height evenly */
          table {
            height: 100% !important;
          }
        }
      `}</style>

      {/* Added 'print-a4-container' class here, and removed conflicting Tailwind print height classes */}
      <div className="print-a4-container bg-white shadow-lg font-sans mx-auto w-[297mm] h-[210mm] box-border p-[5mm] print:w-full print:max-w-full print:p-[2mm] print:m-0 print:shadow-none flex flex-col justify-between">
        
        <table className="w-full h-full border-collapse table-fixed border-2 border-black">
          <colgroup>
            <col className="w-[5%]" />
            <col className="w-[25%]" />
            {daysArray.map((_, i) => (
              <col key={i} style={{ width: `${70.0 / daysCount}%` }} />
            ))}
          </colgroup>

          <thead className="table-header-group">
            <tr className="h-[25px] print:h-[20px]">
              <th colSpan={2} rowSpan={3} className="border border-black p-1 align-middle text-center bg-white">
                <img src={atomone} alt="ATOM ONE" className="max-h-[30px] print:max-h-[25px] max-w-full block mx-auto object-contain" />
              </th>
              <th colSpan={daysCount - 8} rowSpan={3} className="border border-black text-center align-middle bg-white">
                <h1 className="text-xl print:text-base font-bold uppercase tracking-wide m-0 text-black">Daily 5S Check Sheet</h1>
              </th>
              <th colSpan={4} className={InfoLabel}>Doc. No.</th>
              <th colSpan={4} className={InfoValue}>AOT-F-5S-01</th>
            </tr>
            <tr className="h-[20px] print:h-[16px]">
              <th colSpan={4} className={InfoLabel}>Rev. No.</th>
              <th colSpan={4} className={InfoValue}>1</th>
            </tr>
            <tr className="h-[20px] print:h-[16px]">
              <th colSpan={4} className={InfoLabel}>Date</th>
              <th colSpan={4} className={InfoValue}>01/04/2024</th>
            </tr>

            <tr className="h-[20px] print:h-[16px]">
              <th className={TH}>Area:</th>
              <th className="border border-black px-2 py-0.5 text-left text-[9px] print:text-[7.5px] font-bold uppercase">{area}</th>
              <th colSpan={7} className={TH}>Date ---&gt;</th>
              <th colSpan={8} className={TH}>Year: {appliedYear}</th>
              <th colSpan={daysCount - 15} className={TH}>Month: {appliedMonth}</th>
            </tr>

            <tr className="h-[22px] print:h-[16px]">
              <th colSpan={2} className={TH}>Activity / Days</th>
              {daysArray.map((day) => (
                <th key={day} className={TH}>{day}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {S5_DATA.map((section) => (
              section.points.map((point, idx) => (
                <tr key={`${section.s}-${idx}`} className="h-[20px] print:h-[5mm]">
                  {idx === 0 && (
                    <td rowSpan={section.points.length} className={`${TD} font-extrabold bg-[#f5f5f5] text-[10px] print:text-[8px]`}>
                      {section.s}
                    </td>
                  )}
                  <td className={`${TD} text-left px-1.5 font-medium leading-[1.2]`}>{point}</td>
                  {daysArray.map((day) => (
                    <td key={day} className={TD}></td>
                  ))}
                </tr>
              ))
            ))}

            <tr className="h-[20px] print:h-[5mm]">
              <td colSpan={2} className={`${TH} text-left pl-2 font-bold`}>Day Wise "5S" Maintain Responsibility</td>
              {daysArray.map((day) => (
                <td key={day} className={TD}></td>
              ))}
            </tr>
          </tbody>

          <tfoot className="table-footer-group">
            <tr className="h-[18px] print:h-[4.5mm]">
              <td className={TH}>Monday</td>
              <td className={TD}></td>
              <td colSpan={daysCount} rowSpan={7} className="border-t-[2px] border-black p-2 align-top text-left font-bold text-[10px] print:text-[8px] uppercase bg-white">
                REMARKS -
              </td>
            </tr>
            <tr className="h-[18px] print:h-[4.5mm]"><td className={TH}>Tuesday</td><td className={TD}></td></tr>
            <tr className="h-[18px] print:h-[4.5mm]"><td className={TH}>Wednesday</td><td className={TD}></td></tr>
            <tr className="h-[18px] print:h-[4.5mm]"><td className={TH}>Thursday</td><td className={TD}></td></tr>
            <tr className="h-[18px] print:h-[4.5mm]"><td className={TH}>Friday</td><td className={TD}></td></tr>
            <tr className="h-[18px] print:h-[4.5mm]"><td className={TH}>Saturday</td><td className={TD}></td></tr>
            <tr className="h-[22px] print:h-[5.5mm]">
              <td className={`${TH} bg-white border-b-2 border-l-2`}>5S Monitoring By:</td>
              <td className={`${TD} border-b-2`}></td>
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
  );
};

export default Operator5sprint;