import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const atomone = '/logo1.jpg';

// Mahino ka array bahar nikal liya hai taki dono jagah use ho sake
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
  if (!monthName || !year) return 31; // Agar blank hai toh default 31 days banenge
  const mIndex = MONTH_NAMES.indexOf(monthName.toUpperCase());
  if (mIndex === -1) return 31;
  return new Date(year, mIndex + 1, 0).getDate();
};

const Operator5sprint = ({ area = "P.Shop & Parking area" }) => {
  const navigate = useNavigate();
  const filterRef = useRef(null);

  // Current date setup taki filter menu mein aaj ka month/year default dikhe
  const currentDate = new Date();
  const currentMonthName = MONTH_NAMES[currentDate.getMonth()];
  const currentYearStr = currentDate.getFullYear().toString();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter Dropdown ki initial values
  const [filterMonth, setFilterMonth] = useState(currentMonthName);
  const [filterYear, setFilterYear] = useState(currentYearStr);
  
  // ✅ Table ki actual values (Initially Blank/Khali set ki gayi hain)
  const [appliedMonth, setAppliedMonth] = useState("");
  const [appliedYear, setAppliedYear] = useState("");

  // ✅ Agar applied values khali hain, toh table by default 31 days ki banegi
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

  const TH = 'border border-black font-bold text-center align-middle bg-[#f5f5f5] text-black px-1 py-1 text-[10px] uppercase';
  const TD = 'border border-black text-center align-middle bg-white px-1 py-1 text-black text-[10px] uppercase';
  const InfoLabel = 'border border-black font-bold bg-[#f5f5f5] text-[10px] px-2 py-1 text-left uppercase';
  const InfoValue = 'border border-black font-semibold bg-white text-[10px] px-2 py-1 text-center uppercase';

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-4 text-black overflow-auto">

      {/* Action Buttons & Filter UI */}
      <div className="flex justify-end gap-3 mb-4 print:hidden">
        <button onClick={() => navigate("/production-hub")} className="bg-[#607d8b] text-white px-4 py-2 rounded font-bold text-sm">Back</button>

        <div className="relative" ref={filterRef}>
          <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="bg-[#3b5998] text-white px-4 py-2 rounded font-bold text-sm">
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
              <button onClick={handleApplyFilter} className="w-full bg-[#4285F4] text-white py-2 rounded text-sm font-bold">Apply Changes</button>
            </div>
          )}
        </div>

        <button onClick={() => window.print()} className="bg-[#4CAF50] text-white px-4 py-2 rounded font-bold text-sm">Print</button>
      </div>

      <style>{`
        @media print {
          @page { size: A3 landscape; margin: 5mm; }
          body { -webkit-print-color-adjust: exact !important; }
        }
      `}</style>

      <div className="bg-white mx-auto shadow-lg w-[420mm] h-[297mm] box-border p-[4mm] print:w-full print:h-[100vh] flex flex-col">
        <table className="w-full h-full border-collapse table-fixed border border-black">
          <colgroup>
            <col className="w-[5%]" />
            <col className="w-[25%]" />
            {/* ✅ Only daysCount columns */}
            {daysArray.map((_, i) => (
              <col key={i} style={{ width: `${70.0 / daysCount}%` }} />
            ))}
          </colgroup>

          <thead>
            <tr>
              <th colSpan={2} rowSpan={3} className="border border-black p-2">
                <img src={atomone} alt="ATOM ONE" className="max-h-[50px] mx-auto" />
              </th>
              <th colSpan={daysCount - 8} rowSpan={3} className="border border-black text-center">
                <h1 className="text-2xl font-bold uppercase">Daily 5S Check Sheet</h1>
              </th>
              <th colSpan={4} className={InfoLabel}>Doc. No.</th>
              <th colSpan={4} className={InfoValue}>AOT-F-5S-01</th>
            </tr>
            <tr>
              <th colSpan={4} className={InfoLabel}>Rev. No.</th>
              <th colSpan={4} className={InfoValue}>1</th>
            </tr>
            <tr>
              <th colSpan={4} className={InfoLabel}>Date</th>
              <th colSpan={4} className={InfoValue}>01/04/2024</th>
            </tr>

            <tr>
              <th className={TH}>Area:</th>
              <th className="border border-black px-2 text-left text-[10px]">{area}</th>
              <th colSpan={7} className={TH}>Date ---&gt;</th>
              {/* ✅ Applied values khali honge toh yahan sirf "Year:" aur "Month:" dikhega */}
              <th colSpan={8} className={TH}>Year: {appliedYear}</th>
              <th colSpan={daysCount - 15} className={TH}>Month: {appliedMonth}</th>
            </tr>

            <tr>
              <th colSpan={2} className={TH}>Activity / Days</th>
              {daysArray.map((day) => (
                <th key={day} className={TH}>{day}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {S5_DATA.map((section) => (
              section.points.map((point, idx) => (
                <tr key={`${section.s}-${idx}`}>
                  {idx === 0 && (
                    <td rowSpan={section.points.length} className={`${TD} font-bold bg-gray-50 text-sm`}>
                      {section.s}
                    </td>
                  )}
                  <td className={`${TD} text-left px-2 font-medium`}>{point}</td>
                  {/* ✅ Only daysCount cells */}
                  {daysArray.map((day) => (
                    <td key={day} className={TD}></td>
                  ))}
                </tr>
              ))
            ))}

            <tr>
              <td colSpan={2} className={`${TH} text-left pl-2`}>Day Wise "5S" Maintain Responsibility</td>
              {daysArray.map((day) => (
                <td key={day} className={TD}></td>
              ))}
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <td className={TH}>Monday</td>
              <td className={TD}></td>
              {/* ✅ Remarks colspan = daysCount */}
              <td colSpan={daysCount} rowSpan={7} className="border border-black p-2 align-top text-left font-bold text-sm">
                REMARKS -
              </td>
            </tr>
            <tr><td className={TH}>Tuesday</td><td className={TD}></td></tr>
            <tr><td className={TH}>Wednesday</td><td className={TD}></td></tr>
            <tr><td className={TH}>Thursday</td><td className={TD}></td></tr>
            <tr><td className={TH}>Friday</td><td className={TD}></td></tr>
            <tr><td className={TH}>Saturday</td><td className={TD}></td></tr>
            <tr>
              <td className={TH}>5S Monitoring By:</td>
              <td className={TD}></td>
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
  );
};

export default Operator5sprint;