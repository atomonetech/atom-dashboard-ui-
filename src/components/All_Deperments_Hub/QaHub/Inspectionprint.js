import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const atomone = '/logo1.jpg';

const formatDisplay = (dateStr) => {
  if (!dateStr) return '';
  const parts = String(dateStr).split('-');
  if (parts.length === 3) {
    if (parts[0].length === 4) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return `${parts[0]}/${parts[1]}/${parts[2]}`;
  }
  return dateStr;
};

const Inspectionprint = ({ items=[], currentReport, onEditForm, onBack }) => {
  const navigate = useNavigate();
  const filterRef = useRef(null);

  // ── FILTER STATES (For Dropdowns) ──
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [filterPartName, setFilterPartName] = useState("All Parts");
  const [filterOperation, setFilterOperation] = useState("All Operations");
  const [filterCustomer, setFilterCustomer] = useState("All Customers");

  // ── APPLIED FILTERS (To actually change UI) ──
  const [appliedDate, setAppliedDate] = useState("");
  const [appliedPartName, setAppliedPartName] = useState("All Parts");
  const [appliedOperation, setAppliedOperation] = useState("All Operations");
  const [appliedCustomer, setAppliedCustomer] = useState("All Customers");

  // Close filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── APPLY BUTTON LOGIC ──
  const handleApplyFilter = () => {
    setAppliedDate(filterDate);
    setAppliedPartName(filterPartName);
    setAppliedOperation(filterOperation);
    setAppliedCustomer(filterCustomer);
    setIsFilterOpen(false); 
  };

  // ── RESET BUTTON LOGIC ──
  const handleResetFilter = () => {
    setFilterDate("");
    setFilterPartName("All Parts");
    setFilterOperation("All Operations");
    setFilterCustomer("All Customers");

    setAppliedDate("");
    setAppliedPartName("All Parts");
    setAppliedOperation("All Operations");
    setAppliedCustomer("All Customers");
    setIsFilterOpen(false);
  };

  // ── DYNAMIC HEADER DATA BASED ON FILTER ──
  const displayDate = appliedDate ? formatDisplay(appliedDate) : formatDisplay(currentReport?.date) || 'DD/MM/YYYY';
  const displayCustomer = appliedCustomer !== "All Customers" ? appliedCustomer : (currentReport?.customer_name || '');
  const displayPart = appliedPartName !== "All Parts" ? appliedPartName : (currentReport?.part_name || '');
  const displayOp = appliedOperation !== "All Operations" ? appliedOperation : (currentReport?.operation_name || '');

  // ── FILTERING SCHEDULE ENTRIES BASED ON SELECTED DATE ──
  const rawScheduleEntries = currentReport?.schedule_entries || [];
  const scheduleEntries = rawScheduleEntries.filter(entry => {
    if (appliedDate) {
      return entry.date === appliedDate || formatDisplay(entry.date) === formatDisplay(appliedDate);
    }
    return true; 
  });

  // ── KEEPING YOUR EXACT SCHEDULE LOGIC ──
  const productItems    = items.filter(x=>x.sr_no>=1 &&x.sr_no<=10).sort((a,b)=>a.sr_no-b.sr_no);
  const processItems    = items.filter(x=>x.sr_no>=11&&x.sr_no<=20).sort((a,b)=>a.sr_no-b.sr_no);
  const productCount    = productItems.filter(x=>x.item&&x.item.trim()!=='').length;
  const totalRows       = 10;
  const totalFilledCols = Math.min(productCount + processItems.filter(x=>x.item&&x.item.trim()!=='').length, 20);

  const buildScheduleRows = () => {
    const empty20 = () => Array(20).fill('');
    const grouped = {};
    let srCounter = 1;
    scheduleEntries.forEach(entry => {
      const groupKey = `${entry.operator||''}__${entry.machine_no||''}__${entry.date||''}`;
      if (!grouped[groupKey]) {
        grouped[groupKey] = { sr: srCounter++, date: formatDisplay(entry.date)||'', operator: entry.operator||'', mcNo: entry.machine_no||'', rawEntries: [] };
      }
      grouped[groupKey].rawEntries.push(entry);
    });

    if (Object.keys(grouped).length === 0) {
      return [{ sr:1, date:'', operator:'', mcNo:'', slots:[
        {time:'SETUP', row_order:0, values:empty20()},
        {time:'4HRS',  row_order:0, values:empty20()},
        {time:'LAST',  row_order:0, values:empty20()},
      ]}];
    }

    return Object.values(grouped).map(grp => {
      const sorted = [...grp.rawEntries].sort((a,b) => {
        const si = (a.slot_index??0)-(b.slot_index??0);
        if (si!==0) return si;
        return (a.row_order??0)-(b.row_order??0);
      });
      const slotMap = {};
      sorted.forEach(e => {
        const si = e.slot_index??0;
        if (!slotMap[si]) slotMap[si] = { time_type: e.time_type||'SETUP', readings: [] };
        const vals = empty20();
        for(let i=0;i<20;i++) vals[i]=e[`value_${i+1}`]||'';
        slotMap[si].readings[e.row_order??0] = vals;
      });
      const timeOrder = { SETUP:0,'4HRS':1,'2HRS':1,LAST:2 };
      const slots = Object.entries(slotMap)
        .sort((a,b)=>{ const ta=timeOrder[a[1].time_type]??9,tb=timeOrder[b[1].time_type]??9; return ta!==tb?ta-tb:Number(a[0])-Number(b[0]); })
        .flatMap(([slotKey,s])=>{ if(!s.readings[0])s.readings[0]=empty20(); return s.readings.map((vals,ri)=>({time:s.time_type,slotKey,row_order:ri,values:vals||empty20()})).filter((row,ri)=>ri===0||row.values.some(v=>v!=='')); });
      return { sr:grp.sr, date:grp.date, operator:grp.operator, mcNo:grp.mcNo, slots };
    });
  };

  const scheduleRows       = buildScheduleRows();
  const totalSchedHtmlRows = scheduleRows.reduce((sum,s)=>sum+s.slots.length,0);

  // Dynamic Height Math
  const TOTAL_USABLE  = 572;
  const SCHED_THEAD   = 22;
  const SCHED_ROW_H   = 26;
  const SCHED_H       = SCHED_THEAD + totalSchedHtmlRows * SCHED_ROW_H;
  const INSP_THEAD    = 26;
  const inspAvailable = TOTAL_USABLE - SCHED_H - INSP_THEAD;
  const inspRowH      = Math.max(18, inspAvailable/10);
  const inspTotalH    = INSP_THEAD + 10*inspRowH;

  const colPct = `${(75/Math.max(totalFilledCols,1)).toFixed(2)}%`;

  const TD = "border border-black text-center align-middle overflow-hidden";
  const TH = "border border-black text-center align-middle font-bold bg-[#f5f5f5]";

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-5 font-sans text-black">
      
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 6mm; }
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            background-color: white !important; 
          }
          .print-text-sm { font-size: 8.5px !important; }
          .print-text-md { font-size: 9.5px !important; }
          .print-text-lg { font-size: 10px !important; }
        }
      `}</style>

      {/* ── Top Bar (Buttons & Filter) ── */}
      <div className="flex justify-end items-center gap-3 mb-3 print:hidden">
        <button onClick={() => navigate("/qa-hub")} className="bg-[#607d8b] hover:bg-[#4d646f] text-white border-none px-4 py-2 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5 transition-colors shadow-sm">
          <i className="bi bi-arrow-left-circle-fill"></i> Back
        </button>

        <div className="relative" ref={filterRef}>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)} 
            className="bg-[#3b5998] hover:bg-[#2d4373] text-white border-none px-4 py-2 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5 transition-colors shadow-sm"
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

              <div className="p-4 flex flex-col gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 flex items-center gap-2 mb-1 tracking-wide">
                    <i className="bi bi-calendar3"></i> DATE
                  </label>
                  <input 
                    type="date" 
                    value={filterDate} 
                    onChange={(e) => setFilterDate(e.target.value)} 
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[#3b5998] text-gray-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 flex items-center gap-2 mb-1 tracking-wide">
                    <i className="bi bi-gear-fill"></i> PART NAME
                  </label>
                  <select 
                    value={filterPartName} 
                    onChange={(e) => setFilterPartName(e.target.value)} 
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[#3b5998] text-gray-700"
                  >
                    <option value="All Parts">All Parts</option>
                    <option value="Part A">Part A</option>
                    <option value="Part B">Part B</option>
                    {currentReport?.part_name && <option value={currentReport.part_name}>{currentReport.part_name}</option>}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 flex items-center gap-2 mb-1 tracking-wide">
                    <i className="bi bi-scissors"></i> OPERATION
                  </label>
                  <select 
                    value={filterOperation} 
                    onChange={(e) => setFilterOperation(e.target.value)} 
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[#3b5998] text-gray-700"
                  >
                    <option value="All Operations">All Operations</option>
                    <option value="Cutting">Cutting</option>
                    <option value="Bending">Bending</option>
                    {currentReport?.operation_name && <option value={currentReport.operation_name}>{currentReport.operation_name}</option>}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 flex items-center gap-2 mb-1 tracking-wide">
                    <i className="bi bi-building"></i> CUSTOMER
                  </label>
                  <select 
                    value={filterCustomer} 
                    onChange={(e) => setFilterCustomer(e.target.value)} 
                    className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-[#3b5998] text-gray-700"
                  >
                    <option value="All Customers">All Customers</option>
                    <option value="Customer X">Customer X</option>
                    <option value="Customer Y">Customer Y</option>
                    {currentReport?.customer_name && <option value={currentReport.customer_name}>{currentReport.customer_name}</option>}
                  </select>
                </div>
              </div>

              <div className="flex gap-2 p-3 bg-white rounded-b-lg border-t border-gray-100">
                <button 
                  onClick={handleApplyFilter} 
                  className="flex-1 bg-[#4285F4] hover:bg-[#3367D6] text-white py-2 rounded text-sm font-bold flex justify-center items-center gap-2 transition-colors border-none cursor-pointer"
                >
                  <i className="bi bi-check-circle-fill"></i> Apply
                </button>
                <button 
                  onClick={handleResetFilter} 
                  className="flex-1 bg-white border border-[#ff4d4f] text-[#ff4d4f] hover:bg-red-50 py-2 rounded text-sm font-bold flex justify-center items-center gap-2 transition-colors cursor-pointer"
                >
                  <i className="bi bi-arrow-counterclockwise"></i> Reset
                </button>
              </div>

            </div>
          )}
        </div>

        {/* ── Edit Button (Visible if onEditForm prop is passed) ── */}
        {onEditForm && (
          <button onClick={()=>{ onEditForm(); navigate('/form?mode=edit'); }} className="bg-[#ff9800] hover:bg-[#e68a00] text-white border-none px-4 py-2 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5 transition-colors shadow-sm">
            <i className="bi bi-pencil-square"></i> Edit
          </button>
        )}

        {/* ── Print Button (Always Visible Now) ── */}
        <button onClick={() => window.print()} className="bg-[#4CAF50] hover:bg-[#43a047] text-white border-none px-4 py-2 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5 transition-colors shadow-sm">
          <i className="bi bi-printer-fill"></i> Print
        </button>
        
      </div>

      <div className="bg-white mx-auto w-full min-h-[210mm] box-border p-5 md:p-[10mm] shadow-lg print:w-full print:h-auto print:min-h-0 print:p-0 print:m-0 print:shadow-none print:block">
        
        <table className="w-full border-none border-collapse border border-black">
          
          <thead className="table-header-group">
            <tr>
              <td className="p-0">
                <table className="w-full border-collapse border border-b-0 border-black">
                  <tbody><tr>
                    <td className="w-[120px] p-1.5 text-center border-r border-black align-middle bg-white">
                      <img src={atomone} alt="ATOM ONE" className="max-w-full max-h-[55px] object-contain block mx-auto print:max-h-[42px]"/>
                    </td>
                    <td className="font-bold text-[18px] px-3 tracking-[0.5px] text-center align-middle bg-white print:text-[13px]">
                      SETUP &amp; PATROL INSPECTION REPORT
                    </td>
                    <td className="w-[220px] p-0 border-l border-black align-middle bg-white">
                      <table className="w-full border-none border-collapse"><tbody>
                        <tr>
                          <td className="border-b border-black font-bold w-[95px] border-r border-r-black px-2 py-1 text-[11px] h-[24px] text-left print-text-sm print:h-[21px]">DOC NO:</td>
                          <td className="border-b border-black font-semibold text-[13px] px-2 py-1 h-[24px] text-left print-text-lg print:h-[21px]">{currentReport?.doc_no||'KGTL-QCL-01'}</td>
                        </tr>
                        <tr>
                          <td className="border-b border-black font-bold w-[95px] border-r border-r-black px-2 py-1 text-[11px] h-[24px] text-left print-text-sm print:h-[21px]">REVISION NO:</td>
                          <td className="border-b border-black font-semibold text-[13px] px-2 py-1 h-[24px] text-left print-text-lg print:h-[21px]">{currentReport?.revision_no||'01'}</td>
                        </tr>
                        <tr>
                          <td className="font-bold w-[95px] border-r border-r-black px-2 py-1 text-[11px] h-[24px] text-left print-text-sm print:h-[21px]">DATE:</td>
                          <td className="font-semibold text-[13px] px-2 py-1 h-[24px] text-left print-text-lg print:h-[21px]">{displayDate}</td>
                        </tr>
                      </tbody></table>
                    </td>
                  </tr></tbody>
                </table>

                <table className="w-full border-collapse border border-black">
                  <tbody>
                    <tr>
                      <td className="bg-[#f5f5f5] text-[11px] font-bold uppercase w-[13%] px-2.5 h-[32px] border border-black text-center align-middle print-text-sm print:h-[26px]">CUSTOMER NAME</td>
                      <td className="w-[37%] text-[12px] font-semibold text-left pl-2.5 px-2.5 h-[32px] border border-black align-middle print-text-lg print:h-[26px] bg-white">{displayCustomer}</td>
                      <td className="bg-[#f5f5f5] text-[11px] font-bold uppercase w-[13%] px-2.5 h-[32px] border border-black text-center align-middle print-text-sm print:h-[26px]">PART NAME</td>
                      <td className="w-[37%] text-[12px] font-semibold text-left pl-2.5 px-2.5 h-[32px] border border-black align-middle print-text-lg print:h-[26px] bg-white">{displayPart}</td>
                    </tr>
                    <tr>
                      <td className="bg-[#f5f5f5] text-[11px] font-bold uppercase w-[13%] px-2.5 h-[32px] border border-black text-center align-middle print-text-sm print:h-[26px]">OPERATION NAME</td>
                      <td className="w-[37%] text-[12px] font-semibold text-left pl-2.5 px-2.5 h-[32px] border border-black align-middle print-text-lg print:h-[26px] bg-white">{displayOp}</td>
                      <td className="bg-[#f5f5f5] text-[11px] font-bold uppercase w-[13%] px-2.5 h-[32px] border border-black text-center align-middle print-text-sm print:h-[26px]">PART NUMBER</td>
                      <td className="w-[37%] text-[12px] font-semibold text-left pl-2.5 px-2.5 h-[32px] border border-black align-middle print-text-lg print:h-[26px] bg-white">{currentReport?.part_number||''}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="p-0 align-top">
                <table className="w-full border-collapse border border-t-0 border-b-0 border-black table-fixed" style={{height:`${inspTotalH}px`}}>
                  <thead>
                    <tr style={{height:`${INSP_THEAD}px`}}>
                      <th className={`${TH} text-[12px] px-1 py-1.5 print:text-[9px] print:py-[1px]`}>SR. NO.</th>
                      <th className={`${TH} text-[12px] px-1 py-1.5 print:text-[9px] print:py-[1px]`}>INSP. ITEM (PRODUCT)</th>
                      <th className={`${TH} text-[12px] px-1 py-1.5 print:text-[9px] print:py-[1px]`}>SPEC.</th>
                      <th className={`${TH} text-[12px] px-1 py-1.5 print:text-[9px] print:py-[1px]`}>TOLERANCE</th>
                      <th className={`${TH} text-[12px] px-1 py-1.5 print:text-[9px] print:py-[1px]`}>INST.</th>
                      <th className={`${TH} text-[12px] px-1 py-1.5 print:text-[9px] print:py-[1px]`}>SR. NO.</th>
                      <th className={`${TH} text-[12px] px-1 py-1.5 print:text-[9px] print:py-[1px]`}>INSP. ITEM (PROCESS)</th>
                      <th className={`${TH} text-[12px] px-1 py-1.5 print:text-[9px] print:py-[1px]`}>SPEC.</th>
                      <th className={`${TH} text-[12px] px-1 py-1.5 print:text-[9px] print:py-[1px]`}>TOLERANCE</th>
                      <th className={`${TH} text-[12px] px-1 py-1.5 print:text-[9px] print:py-[1px]`}>INST.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({length:totalRows},(_,i)=>{
                      const product = productItems[i]||null;
                      const process = processItems[i]||null;
                      const pSR = product?.item?.trim() ? (i+1) : '';
                      const rSR = process?.item?.trim()  ? (productCount+i+1) : '';
                      const bgClass = (i + 1) % 2 === 0 ? 'bg-[#fafafa]' : 'bg-white';

                      return (
                        <tr key={i} style={{height:`${inspRowH}px`}} className="print:h-auto">
                          <td className={`${TD} ${bgClass} text-[11px] p-1 print:text-[9px] print:p-0`}>{pSR}</td>
                          <td className={`${TD} ${bgClass} text-[11px] p-1 text-center font-semibold pl-[5px] print:text-[9px] print:p-0`}>{product?.item||''}</td>
                          <td className={`${TD} ${bgClass} text-[11px] p-1 print:text-[9px] print:p-0`}>{product?.spec||''}</td>
                          <td className={`${TD} ${bgClass} text-[11px] p-1 print:text-[9px] print:p-0`}>{product?.tolerance||''}</td>
                          <td className={`${TD} ${bgClass} text-[11px] p-1 print:text-[9px] print:p-0`}>{product?.inst||''}</td>
                          <td className={`${TD} ${bgClass} text-[11px] p-1 print:text-[9px] print:p-0`}>{rSR}</td>
                          <td className={`${TD} ${bgClass} text-[11px] p-1 text-center font-semibold pl-[5px] print:text-[9px] print:p-0`}>{process?.item||''}</td>
                          <td className={`${TD} ${bgClass} text-[11px] p-1 print:text-[9px] print:p-0`}>{process?.spec||''}</td>
                          <td className={`${TD} ${bgClass} text-[11px] p-1 print:text-[9px] print:p-0`}>{process?.tolerance||''}</td>
                          <td className={`${TD} ${bgClass} text-[11px] p-1 print:text-[9px] print:p-0`}>{process?.inst||''}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <table className="w-full border-collapse border border-black table-fixed">
                  <colgroup>
                    <col style={{width:'2%'}}/>
                    <col style={{width:'7%'}}/>
                    <col style={{width:'8%'}}/>
                    <col style={{width:'4%'}}/>
                    <col style={{width:'3.5%'}}/>
                    {Array.from({length:totalFilledCols},(_,i)=><col key={i} style={{width:colPct}}/>)}
                    <col style={{width:'2.5%'}}/>
                    <col style={{width:'7.5%'}}/>
                    <col style={{width:'7.5%'}}/>
                  </colgroup>
                  <thead>
                    <tr style={{height:`${SCHED_THEAD}px`}}>
                      <th className={`${TH} text-[11px] p-1 whitespace-normal break-words leading-[1.2] print:text-[8px] print:leading-[1.1] print:p-[1px]`}>SR</th>
                      <th className={`${TH} text-[11px] p-1 whitespace-normal break-words leading-[1.2] print:text-[8px] print:leading-[1.1] print:p-[1px]`}>DATE</th>
                      <th className={`${TH} text-[11px] p-1 whitespace-normal break-words leading-[1.2] print:text-[8px] print:leading-[1.1] print:p-[1px]`}>OPERATOR</th>
                      <th className={`${TH} text-[11px] p-1 whitespace-normal break-words leading-[1.2] print:text-[8px] print:leading-[1.1] print:p-[1px]`}>M/C NO</th>
                      <th className={`${TH} text-[11px] p-1 whitespace-normal break-words leading-[1.2] print:text-[8px] print:leading-[1.1] print:p-[1px]`}>TIME</th>
                      {Array.from({length:totalFilledCols},(_,i)=><th key={i} className={`${TH} text-[11px] p-1 print:text-[8px] print:p-[1px]`}>{i+1}</th>)}
                      <th className={`${TH} text-[11px] p-1 whitespace-normal break-words leading-[1.2] print:text-[8px] print:leading-[1.1] print:p-[1px]`}>JDG</th>
                      <th className={`${TH} text-[11px] p-1 whitespace-normal break-words leading-[1.2] print:text-[8px] print:leading-[1.1] print:p-[1px]`}>SIGN (INSPECTED BY)</th>
                      <th className={`${TH} text-[11px] p-1 whitespace-normal break-words leading-[1.2] print:text-[8px] print:leading-[1.1] print:p-[1px]`}>SIGN (VERIFIED BY)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleRows.map((si,rowIdx)=>{
                      const totalTimeRows = si.slots.length;
                      const timeSpans = si.slots.map((row,idx)=>{
                        const prev = si.slots[idx-1];
                        if (!prev||prev.slotKey!==row.slotKey){
                          let count=0;
                          for(let j=idx;j<si.slots.length&&si.slots[j].slotKey===row.slotKey;j++) count++;
                          return count;
                        }
                        return 0;
                      });
                      return (
                        <React.Fragment key={rowIdx}>
                          {si.slots.map((row,timeIdx)=>{
                            const span = timeSpans[timeIdx];
                            return (
                              <tr key={`${rowIdx}-${timeIdx}`} style={{height:`${SCHED_ROW_H}px`}} className="bg-white break-inside-avoid">
                                {timeIdx===0&&<td rowSpan={totalTimeRows} className={`${TD} font-bold text-[10px] print:text-[8.5px] p-0.5`}>{si.sr}</td>}
                                {timeIdx===0&&<td rowSpan={totalTimeRows} className={`${TD} text-[8px] whitespace-normal leading-[1.2] print:text-[8.5px] p-0.5`}>{si.date||''}</td>}
                                {timeIdx===0&&<td rowSpan={totalTimeRows} className={`${TD} text-[8px] whitespace-normal leading-[1.2] print:text-[8.5px] p-0.5`}>{si.operator||''}</td>}
                                {timeIdx===0&&<td rowSpan={totalTimeRows} className={`${TD} text-[9px] print:text-[8.5px] p-0.5`}>{si.mcNo||''}</td>}
                                {span>0&&<td rowSpan={span} className={`${TD} font-bold text-[8.5px] print:text-[8.5px] p-0.5`}>{row.time}</td>}
                                {Array.from({length:totalFilledCols},(_,ci)=>{
                                  const val=row.values[ci]||'';
                                  return <td key={ci} className={`${TD} text-[9px] print:text-[8.5px] p-0.5 ${val?'font-semibold':'font-normal'}`}>{val}</td>;
                                })}
                                {timeIdx===0&&<td rowSpan={totalTimeRows} className={TD}></td>}
                                {timeIdx===0&&<td rowSpan={totalTimeRows} className={TD}></td>}
                                {timeIdx===0&&<td rowSpan={totalTimeRows} className={TD}></td>}
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>

              </td>
            </tr>
          </tbody>

          <tfoot className="table-footer-group">
            <tr>
              <td className="p-0 h-[40px]">
                <table className="w-full border-collapse border border-t-0 border-black bg-white">
                  <tbody>
                    <tr>
                      <td className="w-1/2 border-r border-black px-3 py-3 align-bottom">
                        <div className="flex items-end">
                          <span className="font-bold text-[12px] whitespace-nowrap mr-2 text-black print:text-[10px]">PREPARED BY:</span>
                          <span className="flex-grow border-b-[1.5px] border-black text-[12px] pb-[2px] min-h-[18px] text-black print:text-[10px]">
                            {currentReport?.prepared_by || ''}
                          </span>
                        </div>
                      </td>
                      <td className="w-1/2 px-3 py-3 align-bottom">
                        <div className="flex items-end">
                          <span className="font-bold text-[12px] whitespace-nowrap mr-2 text-black print:text-[10px]">APPROVED BY:</span>
                          <span className="flex-grow border-b-[1.5px] border-black text-[12px] pb-[2px] min-h-[18px] text-black print:text-[10px]">
                            {currentReport?.approved_by || ''}
                          </span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tfoot>

        </table >
      </div>
    </div>
  );
};

export default Inspectionprint;