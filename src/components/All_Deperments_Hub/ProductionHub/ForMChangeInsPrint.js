import React from 'react';

const ForMChangeInsPrint = () => {
  // Create 20 empty rows to match the physical form layout
  const tableData = Array(20).fill({
    srNo: '', date: '', partName: '', operation: '', lotQty: '',
    okQty: '', rejQty: '', parameter: '', inspector: '', remarks: ''
  });

  return (
    <div className="min-h-screen bg-gray-100 p-0 sm:p-4 print:p-0 print:bg-white">
      {/* Container optimized for Landscape Print */}
      <div className="max-w-[100%] mx-auto bg-white shadow-none border-[1.5px] border-black">
        
        {/* Top Header Section */}
        <div className="grid grid-cols-12 border-b-[1.5px] border-black">
          {/* Logo Box */}
          <div className="col-span-3 border-r-[1.5px] border-black p-2 flex items-center justify-center">
            <img 
              src="/logo1.jpg" 
              alt="Company Logo"
              className="h-16 w-auto object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/150x60?text=LOGO';
              }}
            />
          </div>

          {/* Title Box */}
          <div className="col-span-6 border-r-[1.5px] border-black flex items-center justify-center p-2">
            <h1 className="text-xl md:text-2xl font-black text-center uppercase tracking-tight">
              4M Change Inspection Report
            </h1>
          </div>

          {/* Doc Info Box */}
          <div className="col-span-3 text-[10px] font-bold">
            <div className="grid grid-cols-2 border-b border-black">
              <div className="p-1 border-r border-black uppercase">Doc No.</div>
              <div className="p-1">AOT-F-4M-06</div>
            </div>
            <div className="grid grid-cols-2 border-b border-black">
              <div className="p-1 border-r border-black uppercase">Rev No.</div>
              <div className="p-1">00</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="p-1 border-r border-black uppercase">Date</div>
              <div className="p-1">01.01.2019</div>
            </div>
          </div>
        </div>

        {/* Responsive/Scrollable Table Wrapper */}
        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full border-collapse table-fixed" style={{ minWidth: '1600px' }}>
            <thead>
              {/* Primary Header */}
              <tr className="bg-gray-50 text-[11px] font-bold uppercase">
                <th rowSpan={2} className="border-b-[1.5px] border-r-[1.5px] border-black w-10">Sr No.</th>
                <th rowSpan={2} className="border-b-[1.5px] border-r-[1.5px] border-black w-24">Date</th>
                <th rowSpan={2} className="border-b-[1.5px] border-r-[1.5px] border-black w-40">Part Name/No.</th>
                <th rowSpan={2} className="border-b-[1.5px] border-r-[1.5px] border-black w-24">Operation</th>
                <th rowSpan={2} className="border-b-[1.5px] border-r-[1.5px] border-black w-16">Lot Qty</th>
                <th rowSpan={2} className="border-b-[1.5px] border-r-[1.5px] border-black w-20">Ok Qty</th>
                <th rowSpan={2} className="border-b-[1.5px] border-r-[1.5px] border-black w-16">Rej. Qty</th>
                <th rowSpan={2} className="border-b-[1.5px] border-r-[1.5px] border-black w-32">Parameter/Specs</th>
                
                {/* Spanned Sub-headers */}
                <th colSpan={5} className="border-b-[1.5px] border-r-[1.5px] border-black text-center">Before (Retroactive)</th>
                <th colSpan={21} className="border-b-[1.5px] border-r-[1.5px] border-black text-center">After / Setup Approval</th>
                
                <th rowSpan={2} className="border-b-[1.5px] border-r-[1.5px] border-black w-20">Insp. By</th>
                <th rowSpan={2} className="border-b-[1.5px] border-black w-32">Remarks</th>
              </tr>
              
              {/* Secondary Header (Numbers) */}
              <tr className="bg-white text-[9px] font-bold">
                {/* 1 to 5 */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <th key={`b-${i}`} className="border-b-[1.5px] border-r-[1.5px] border-black w-8 py-1">{i + 1}</th>
                ))}
                {/* 1 to 21 */}
                {Array.from({ length: 21 }).map((_, i) => (
                  <th key={`a-${i}`} className="border-b-[1.5px] border-r-[1.5px] border-black w-8 py-1">{i + 1}</th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index} className="h-8 border-b border-black text-[11px]">
                  <td className="border-r-[1.5px] border-black text-center">{index + 1}</td>
                  <td className="border-r-[1.5px] border-black px-1"></td>
                  <td className="border-r-[1.5px] border-black px-1"></td>
                  <td className="border-r-[1.5px] border-black px-1 text-center"></td>
                  <td className="border-r-[1.5px] border-black px-1 text-center"></td>
                  <td className="border-r-[1.5px] border-black px-1 text-center"></td>
                  <td className="border-r-[1.5px] border-black px-1 text-center"></td>
                  <td className="border-r-[1.5px] border-black px-1"></td>
                  {/* Empty data cells */}
                  {Array.from({ length: 26 }).map((_, i) => (
                    <td key={`cell-${i}`} className="border-r-[1.5px] border-black"></td>
                  ))}
                  <td className="border-r-[1.5px] border-black"></td>
                  <td className=""></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Footer Section */}
        <div className="grid grid-cols-2 border-t-[1.5px] border-black p-4">
          <div className="flex flex-col gap-2">
            <span className="font-bold text-sm">Notes / Remarks:</span>
            <div className="h-12 border-b border-dotted border-gray-400"></div>
          </div>
          <div className="flex items-end justify-end gap-12 text-sm font-bold">
            <div className="text-center">
              <div className="w-32 border-b border-black mb-1"></div>
              <span>Prepared By</span>
            </div>
            <div className="text-center">
              <div className="w-32 border-b border-black mb-1"></div>
              <span>Approved By</span>
            </div>
          </div>
        </div>
      </div>

      {/* Print Instructions */}
      <div className="mt-4 text-center text-xs text-gray-500 print:hidden">
        Best printed in <strong>Landscape</strong> orientation.
      </div>
    </div>
  );
};

export default ForMChangeInsPrint;