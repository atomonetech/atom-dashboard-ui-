

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const atomone = '/logo1.jpg';

const formatDisplay = (dateStr) => {
  if (!dateStr) return '';
  const parts = String(dateStr).split('-');
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dateStr;
};

const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const MIN_ROWS = 12;

const RedBinAttendanceprint = ({ items = [], currentReport, onFilter, onEditForm, onBack }) => {
  const navigate = useNavigate();

  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear,  setSelectedYear]  = useState(today.getFullYear());
  
  const remarks = currentReport?.remarks || '';

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const dayColumns  = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const empItems = items
    .filter(x => x.sr_no >= 1)
    .sort((a, b) => a.sr_no - b.sr_no);
    
  const TOTAL_ROWS = Math.max(MIN_ROWS, empItems.length);
  const yearOptions = Array.from({ length: 11 }, (_, i) => today.getFullYear() - 5 + i);

  const totalCols = 3 + daysInMonth;
  const titleColSpan = totalCols - 9; 

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  const TH = 'border border-black font-bold text-center align-middle bg-[#f5f5f5] text-black px-[1px] py-[2px] text-[9px] break-words leading-tight';
  const TD = 'border border-black text-center align-middle px-[2px] py-[2px] text-black text-[9px] overflow-hidden';
  const InfoLabel = 'border border-black font-bold bg-[#c0c0c0] text-black text-[10px] px-2 py-1 text-left whitespace-nowrap';
  const InfoValue = 'border border-black font-semibold bg-white text-black text-[10px] px-2 py-1 text-left whitespace-nowrap';

  return (
    <div className="min-h-screen bg-[#f5f5f5] p-4 text-black">

      {/* ── Top Bar (Buttons & Selectors) ── */}
      <div className="flex justify-between items-center mb-3 print:hidden">
        
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-200">
          <i className="bi bi-calendar3 text-[#1976d2] text-base"></i>
          <select 
            value={selectedMonth} 
            onChange={e => setSelectedMonth(Number(e.target.value))} 
            className="border border-gray-300 rounded px-2 py-1 text-xs font-semibold text-[#1976d2] cursor-pointer outline-none"
          >
            {MONTH_NAMES.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
          </select>
          <select 
            value={selectedYear} 
            onChange={e => setSelectedYear(Number(e.target.value))} 
            className="border border-gray-300 rounded px-2 py-1 text-xs font-semibold text-[#1976d2] cursor-pointer outline-none"
          >
            {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <span className="text-xs text-gray-500 font-semibold ml-1">({daysInMonth} days)</span>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="bg-[#607d8b] hover:bg-[#4d646f] text-white border-none px-5 py-2 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5 transition-colors">
            <i className="bi bi-arrow-left-circle-fill"></i> Back
          </button>
          {onEditForm && (
            <button onClick={() => onEditForm(currentReport)} className="bg-[#ff9800] hover:bg-[#e68a00] text-white border-none px-5 py-2 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5 transition-colors">
              <i className="bi bi-pencil-square"></i> Edit
            </button>
          )}
          <button onClick={() => window.print()} className="bg-[#4CAF50] hover:bg-[#43a047] text-white border-none px-5 py-2 rounded-md font-bold cursor-pointer text-sm flex items-center gap-1.5 transition-colors">
            <i className="bi bi-printer-fill"></i> Print
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 6mm; }
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; background-color: white; }
        }
      `}</style>

      {/* ── Main A4 Print Container (Fix: h-auto instead of min-h-[210mm]) ── */}
      <div className="bg-white mx-auto shadow-lg font-sans w-[297mm] h-auto box-border p-[8mm] print:w-full print:p-0 print:m-0 print:shadow-none print:block">
        
        <table className="w-full border-collapse table-fixed border border-black bg-white">
          <colgroup>
            <col className="w-[3%]" /> 
            <col className="w-[10%]" /> 
            <col className="w-[7%]" /> 
            {dayColumns.map(d => (
              <col key={d} style={{ width: `${(80 / daysInMonth).toFixed(2)}%` }} />
            ))}
          </colgroup>

          <thead className="table-header-group">
            <tr className="h-[26px]">
              <th colSpan={3} rowSpan={3} className="border border-black p-1 align-middle text-center bg-white">
                <img src={atomone} alt="ATOM ONE" className="max-h-[50px] max-w-full block mx-auto object-contain" />
              </th>
              <th colSpan={titleColSpan} rowSpan={3} className="border border-black text-center align-middle bg-white">
                <h1 className="text-[20px] font-bold uppercase tracking-[1.5px] m-0 text-black">
                  RED BIN ATTENDANCE SHEET
                </h1>
              </th>
              <th colSpan={3} className={InfoLabel}>DOC.NO.</th>
              <th colSpan={3} className={InfoValue}>{currentReport?.doc_no || 'AOT-F-QC-05'}</th>
            </tr>
            <tr className="h-[26px]">
              <th colSpan={3} className={InfoLabel}>REV.NO.</th>
              <th colSpan={3} className={InfoValue}>{currentReport?.rev_no || '00'}</th>
            </tr>
            <tr className="h-[26px]">
              <th colSpan={3} className={InfoLabel}>DATE</th>
              <th colSpan={3} className={InfoValue}>{formatDisplay(currentReport?.doc_date) || '14.10.2024'}</th>
            </tr>
            <tr className="h-[32px]">
              <th className={TH}>Sr.<br/>No.</th>
              <th className={TH}>Name</th>
              <th className={TH}>DESIGNATION</th>
              {dayColumns.map(d => (
                <th key={d} className={`${TH} text-[8.5px] p-0`}>{d}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: TOTAL_ROWS }, (_, i) => {
              const row = empItems[i] || null;
              const isEven = (i + 1) % 2 === 0;
              const bgClass = isEven ? 'bg-[#fafafa]' : 'bg-white';
              
              
              return (
                <tr key={i} className="h-[36px] break-inside-avoid">
                  <td className={`${TD} ${bgClass} font-semibold`}>{i + 1}</td>
                  <td className={`${TD} ${bgClass} text-left pl-1.5 ${row?.name ? 'font-semibold' : 'font-normal'}`}>
                    {row?.name || ''}
                  </td>
                  <td className={`${TD} ${bgClass}`}>{row?.designation || ''}</td>
                  {dayColumns.map(d => (
                    <td key={d} className={`${TD} ${bgClass}`}>
                      {row?.[`day_${d}`] || ''}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>

          <tfoot className="table-footer-group">
            <tr>
              <td colSpan={totalCols} className="border border-black bg-white">
                <div className="flex items-center justify-between px-6 py-1.5 text-[11px] font-bold text-black min-h-[30px]">
                  <span>P &nbsp;: &nbsp;Present</span>
                  <span>A &nbsp;: &nbsp;Absent</span>
                  <span>Month &nbsp;: &nbsp;<strong className="text-black uppercase">{MONTH_NAMES[selectedMonth - 1]} {selectedYear}</strong></span>
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan={totalCols} className="border border-black bg-white p-0">
                <div className="flex w-full items-stretch min-h-[40px]">
                  <div className="font-bold text-[11px] px-4 py-2 border-r border-black flex items-center w-[120px] shrink-0 bg-[#fff] text-black">
                    REMARKS
                  </div>
                  <div className="flex-grow px-3 py-2 flex items-center text-[11px] bg-[#fff] text-black">
                    {remarks}
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

export default RedBinAttendanceprint;