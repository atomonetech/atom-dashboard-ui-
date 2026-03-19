import React, { useState } from 'react';

const ForMChangeInsPrint = () => {
  // Get current date in YYYY-MM-DD format for input default
  const today = new Date().toISOString().split('T')[0];
  
  // State for date filter
  const [selectedDate, setSelectedDate] = useState(today);
  
  // Create 20 empty rows to match the physical form layout
  const tableData = Array(20).fill({
    srNo: '', date: '', partName: '', operation: '', lotQty: '',
    okQty: '', rejQty: '', parameter: '', inspector: '', remarks: ''
  });

  // Handle print function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-3 print:p-0 print:bg-white">
      {/* Date Filter and Print Button Section - Hidden when printing */}
      <div className="mb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 print:hidden">
        <div className="flex items-center gap-2">
          <label htmlFor="dateFilter" className="text-xs font-semibold text-slate-700 whitespace-nowrap">
            Filter by Date:
          </label>
          <input
            type="date"
            id="dateFilter"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {selectedDate && (
            <span className="text-xs text-slate-600 ml-2">
              Showing records for: {new Date(selectedDate).toLocaleDateString()}
            </span>
          )}
        </div>
        
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-4 rounded shadow-sm flex items-center gap-1 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Report
        </button>
      </div>

      {/* Container optimized for Landscape Print */}
      <div className="max-w-[90%] mx-auto bg-white shadow-sm border border-black">
        
        {/* Top Header Section */}
        <div className="grid grid-cols-12 border-b border-black">
          {/* Logo Box */}
          <div className="col-span-3 border-r border-black p-1 flex items-center justify-center">
            <img 
              src="/logo1.jpg" 
              alt="Company Logo"
              className="h-12 w-auto object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/120x40?text=LOGO';
              }}
            />
          </div>

          {/* Title Box */}
          <div className="col-span-6 border-r border-black flex items-center justify-center p-1">
            <h1 className="text-base md:text-lg font-bold text-center uppercase tracking-normal text-slate-700">
              4M CHANGE INSPECTION REPORT
            </h1>
          </div>

          {/* Doc Info Box */}
          <div className="col-span-3 text-[10px]">
            <div className="grid grid-cols-2 border-b border-black">
              <div className="p-0.5 border-r border-black font-bold text-slate-700">DOC NO.</div>
              <div className="p-0.5 text-slate-700">AOT-F-4M-06</div>
            </div>
            <div className="grid grid-cols-2 border-b border-black">
              <div className="p-0.5 border-r border-black font-bold text-slate-700">REV NO.</div>
              <div className="p-0.5 text-slate-700">00</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="p-0.5 border-r border-black font-bold text-slate-700">DATE</div>
              <div className="p-0.5 text-slate-700">01.01.2019</div>
            </div>
          </div>
        </div>

        {/* Responsive/Scrollable Table Wrapper */}
        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full border-collapse" style={{ minWidth: '1200px' }}>
            <thead>
              {/* Primary Header */}
              <tr className="bg-gray-50 text-[10px]">
                <th rowSpan={2} className="border-b border-r border-black px-1 py-1 text-left font-bold text-slate-700 w-12">Sr No.</th>
                <th rowSpan={2} className="border-b border-r border-black px-1 py-1 text-left font-bold text-slate-700 w-16">Date</th>
                <th rowSpan={2} className="border-b border-r border-black px-1 py-1 text-left font-bold text-slate-700 w-32">Part Name/ Part No.</th>
                <th rowSpan={2} className="border-b border-r border-black px-1 py-1 text-left font-bold text-slate-700 w-24">Operation</th>
                <th rowSpan={2} className="border-b border-r border-black px-1 py-1 text-left font-bold text-slate-700 w-14">Lot Qty</th>
                <th rowSpan={2} className="border-b border-r border-black px-1 py-1 text-left font-bold text-slate-700 w-20">Ok Qty (after insp)</th>
                <th rowSpan={2} className="border-b border-r border-black px-1 py-1 text-left font-bold text-slate-700 w-14">Rej.Qty</th>
                <th rowSpan={2} className="border-b border-r border-black px-1 py-1 text-left font-bold text-slate-700 w-28">Parameter/Specs</th>
                
                {/* Spanned Sub-headers - 5 columns each */}
                <th colSpan={5} className="border-b border-r border-black px-1 py-1 text-center font-bold text-slate-700">Before (Retroactive)</th>
                <th colSpan={5} className="border-b border-r border-black px-1 py-1 text-center font-bold text-slate-700">After / Setup Approval</th>
                
                <th rowSpan={2} className="border-b border-r border-black px-1 py-1 text-left font-bold text-slate-700 w-16">Insp.<br/>by</th>
                <th rowSpan={2} className="border-b border-black px-1 py-1 text-left font-bold text-slate-700 w-28">Remarks</th>
              </tr>
              
              {/* Secondary Header (Numbers 1-5 for both sections) */}
              <tr className="bg-white text-[9px]">
                {/* Before numbers 1 to 5 */}
                {[1, 2, 3, 4, 5].map((num) => (
                  <th key={`b-${num}`} className="border-b border-r border-black px-1 py-0.5 text-center font-bold text-slate-700 w-10">{num}</th>
                ))}
                {/* After numbers 1 to 5 */}
                {[1, 2, 3, 4, 5].map((num) => (
                  <th key={`a-${num}`} className="border-b border-r border-black px-1 py-0.5 text-center font-bold text-slate-700 w-10">{num}</th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index} className="border-b border-black text-[10px] h-7">
                  <td className="border-r border-black px-1 py-0.5 text-center text-slate-700">{index + 1}</td>
                  <td className="border-r border-black px-1 py-0.5 text-slate-700"></td>
                  <td className="border-r border-black px-1 py-0.5 text-slate-700"></td>
                  <td className="border-r border-black px-1 py-0.5 text-slate-700"></td>
                  <td className="border-r border-black px-1 py-0.5 text-center text-slate-700"></td>
                  <td className="border-r border-black px-1 py-0.5 text-center text-slate-700"></td>
                  <td className="border-r border-black px-1 py-0.5 text-center text-slate-700"></td>
                  <td className="border-r border-black px-1 py-0.5 text-slate-700"></td>
                  
                  {/* Before columns 1-5 - empty cells */}
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <td key={`b-cell-${i}`} className="border-r border-black px-1 py-0.5 text-center text-slate-700"></td>
                  ))}
                  
                  {/* After columns 1-5 - empty cells */}
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <td key={`a-cell-${i}`} className="border-r border-black px-1 py-0.5 text-center text-slate-700"></td>
                  ))}
                  
                  <td className="border-r border-black px-1 py-0.5 text-slate-700"></td>
                  <td className="px-1 py-0.5 text-slate-700"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Footer Section */}
        <div className="grid grid-cols-2 border-t border-black p-2">
          <div className="flex flex-col">
            <span className="font-bold text-xs text-slate-700">Remarks:</span>
            <div className="h-12 border-b border-dotted border-gray-400 mt-1"></div>
          </div>
          <div className="flex items-end justify-end gap-8 text-xs">
            <div className="text-center">
              <div className="w-24 border-b border-black mb-0.5"></div>
              <span className="font-bold text-slate-700">Insp. by</span>
            </div>
            <div className="text-center">
              <div className="w-24 border-b border-black mb-0.5"></div>
              <span className="font-bold text-slate-700">Approved by</span>
            </div>
          </div>
        </div>
      </div>

      {/* Print Instructions - Hidden when printing */}
      <div className="mt-2 text-center text-xs text-gray-500 print:hidden">
        Best printed in <strong>Landscape</strong> orientation
      </div>
    </div>
  );
};

export default ForMChangeInsPrint;