import React from 'react';
import { useNavigate } from 'react-router-dom';

const ToolBreakdownReport = ({ currentReport, onEditForm }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-4 text-black flex justify-center print:p-0 print:bg-white overflow-auto">
      
      {/* ── Top Bar (Buttons) - Hidden in Print ── */}
      <div className="flex justify-end items-center gap-3 mb-3 absolute top-4 right-4 print:hidden z-10">
        <button 
          onClick={() => navigate("/maintenance-hub")} 
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
          onClick={() => window.print()} 
          className="bg-[#4CAF50] hover:bg-[#43a047] text-white border-none px-5 py-2 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5 transition-colors shadow-md"
        >
          <i className="bi bi-printer-fill"></i> Print
        </button>
      </div>

      {/* ── Print Specific CSS ── */}
      <style>{`
        @media print {
          @page { 
            size: A4 portrait; 
            margin: 5mm !important; /* मार्जिन कम किया ताकि पेज न कटे */
          }
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            background-color: white !important; 
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>

      {/* ── Main Form Container (The "A4 Paper") ── */}
      <div className="bg-white shadow-2xl font-sans w-[210mm] min-h-[297mm] print:min-h-0 p-8 box-border mx-auto print:w-full print:shadow-none print:m-0 print:p-0 relative mt-16 print:mt-0 flex flex-col text-black">
        
        {/* ── Inner Content Container (The Bordered Form) ── */}
        <div className="flex flex-col border-[2px] border-black flex-grow">
          
          {/* 1. Header Section */}
          <div className="flex border-b-[2px] border-black">
            {/* Logo Box */}
            <div className="w-[15%] border-r-[2px] border-black flex items-center justify-center p-2 bg-white">
              <span className="bg-[#00b0f0] text-white px-1 font-bold text-sm">ATOM</span>
              <span className="bg-[#ffc000] text-white px-1 font-bold text-sm">ONE</span>
            </div>
            
            {/* Title Box */}
            <div className="w-[60%] border-r-[2px] border-black flex items-center justify-center font-bold text-[18px] tracking-wide uppercase bg-white">
              TOOL BREAK DOWN INTIMATION SLIP
            </div>
            
            {/* Document Details Box */}
            <div className="w-[25%] flex flex-col text-[11px] font-semibold bg-white">
              <div className="flex border-b-[2px] border-black h-1/3">
                <div className="w-[45%] border-r-[2px] border-black px-1 flex items-center">DOC.NO.</div>
                <div className="w-[55%] px-1 flex items-center">{currentReport?.doc_no || 'AOT-F-BD-01'}</div>
              </div>
              <div className="flex border-b-[2px] border-black h-1/3">
                <div className="w-[45%] border-r-[2px] border-black px-1 flex items-center">REV. NO.</div>
                <div className="w-[55%] px-1 flex items-center">{currentReport?.rev_no || '00'}</div>
              </div>
              <div className="flex h-1/3">
                <div className="w-[45%] border-r-[2px] border-black px-1 flex items-center">DATE</div>
                <div className="w-[55%] px-1 flex items-center">{currentReport?.doc_date || '14.10.2024'}</div>
              </div>
            </div>
          </div>

          {/* 2. Production Details Section */}
          <div className="border-b-[2px] border-black flex flex-col bg-white">
            <div className="flex justify-between px-2 pt-2 pb-1 text-[14px]">
              <div className="w-3/5">ब्रेकडाऊन देने वाले का नाम...................................................................</div>
              <div className="w-2/5">किस तारीख को दिया.....................................</div>
            </div>
            <div className="flex justify-between px-2 pb-2 pt-1 border-b-[2px] border-black text-[14px]">
              <div className="w-3/5">मशीन का नाम व नंबर.........................................................................</div>
              <div className="w-2/5">किस समय दिया.............................................</div>
            </div>
            
            <div className="p-2 min-h-[140px] relative">
              <div className="font-bold underline mb-2 text-[14px]">ब्रेकडाऊन के बारे में विस्तार से लिखें</div>
              {/* User content would go here */}
              
              <div className="absolute bottom-2 right-4 text-[12px] font-bold uppercase">
                PROD SUPERVISOR SIGN:-
              </div>
            </div>
          </div>

          {/* 3. Maintenance Dept Header */}
          <div className="border-b-[2px] border-black text-center font-bold text-[14px] py-1 bg-white">
            (FOR MAINTENANCE DEPTT. USE ONLY)
          </div>

          {/* 4. Maintenance Details Section */}
          <div className="border-b-[2px] border-black flex flex-col bg-white">
            <div className="flex justify-between px-2 pt-2 pb-1 border-b-[2px] border-black text-[14px]">
              <div className="w-1/2">समय...................................................................</div>
              <div className="w-1/2">तिथि...................................................................</div>
            </div>
            
            <div className="px-2 py-3 text-[14px] leading-relaxed border-b-[2px] border-black">
              <div className="mb-2">ब्रेकडाऊन का सही करने में लगा समय....................................................................................................</div>
              <div>ब्रेकडाऊन को सही करने में कितने आदमी लगे...............................................................................</div>
            </div>

            <div className="p-2 min-h-[140px] relative">
              <div className="font-bold underline mb-2 text-[14px]">क्या एक्शन लिया विस्तार से लिखें</div>
              {/* User content would go here */}
              
              <div className="absolute bottom-2 right-4 text-[13px] font-bold">
                मैन्टेनैन्स / टूलरूम इन्चार्ज हस्ताक्षर.................................................
              </div>
            </div>
          </div>

          {/* 5. Quality Header */}
          <div className="text-center font-bold text-[16px] py-1 bg-white border-b-[2px] border-black">
            क्वालिटी द्वारा जाँच <span className="font-bold">(Verification of Quality)</span>
          </div>

          {/* 6. Quality Details Section */}
          <div className="flex flex-col pb-2 bg-white text-[14px] flex-grow">
            <div className="flex justify-between px-2 py-1">
              <div className="w-[35%] uppercase">STATUS OF PROBLEM : OK / NG</div>
              <div className="w-[30%]">Time ...........................................</div>
              <div className="w-[35%]">Date...........................................</div>
            </div>
            
            <div className="flex justify-between px-2 pt-4 pb-2 items-end mt-2">
              <div className="w-[60%]">
                NC Verification :...................................................................................
              </div>
              <div className="w-[40%] text-right pr-4">
                Signature of quality Incharge
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ToolBreakdownReport;