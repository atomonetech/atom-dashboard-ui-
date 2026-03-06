// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function IdleReportsList() {
//   const navigate = useNavigate();
//   const [idleReportData, setIdleReportData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchIdleReports = async () => {
//       try {
//         const response = await fetch('http://127.0.0.1:8000/api/dashboard-tables/');
//         const data = await response.json();
//         if (data.success) {
//           setIdleReportData(data.idle_reports);
//         }
//       } catch (error) {
//         console.error('Error fetching idle reports:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchIdleReports();
//   }, []);

//   return (
//     <div style={{backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', padding: '40px'}}>
//       <div style={{maxWidth: '1200px', margin: '0 auto'}}>
//         <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
//           <div>
//             <h1 style={{fontSize: '32px', fontWeight: 'bold', margin: '0', color: 'white'}}>
//               📝 Idle Reports List
//             </h1>
//             <p style={{color: '#94a3b8', margin: '5px 0 0 0'}}>
//               Complete list of all idle case reports
//             </p>
//           </div>
//           <button 
//             onClick={() => navigate('/dashboard')}
//             style={{
//               backgroundColor: '#374151', border: 'none', borderRadius: '8px', padding: '10px 20px',
//               color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
//             }}
//             onMouseOver={(e) => e.target.style.backgroundColor = '#4b5563'}
//             onMouseOut={(e) => e.target.style.backgroundColor = '#374151'}
//           >
//             ← Back to Dashboard
//           </button>
//         </div>

//         <div style={{backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '30px'}}>
//           {loading ? (
//             <div style={{textAlign: 'center', padding: '40px'}}>
//               <p style={{color: '#94a3b8'}}>Loading idle reports...</p>
//             </div>
//           ) : (
//             <div style={{overflowX: 'auto'}}>
//               {idleReportData.length > 0 ? (
//                 <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '14px'}}>
//                   <thead style={{backgroundColor: '#374151', color: '#cbd5e1'}}>
//                     <tr>
//                       <th style={{padding: '15px', textAlign: 'left', fontWeight: '600', borderBottom: '1px solid #4b5563'}}>ID</th>
//                       <th style={{padding: '15px', textAlign: 'left', fontWeight: '600', borderBottom: '1px solid #4b5563'}}>Machine No</th>
//                       <th style={{padding: '15px', textAlign: 'left', fontWeight: '600', borderBottom: '1px solid #4b5563'}}>Operator</th>
//                       <th style={{padding: '15px', textAlign: 'left', fontWeight: '600', borderBottom: '1px solid #4b5563'}}>Tool ID</th>
//                       <th style={{padding: '15px', textAlign: 'left', fontWeight: '600', borderBottom: '1px solid #4b5563'}}>Reason</th>
//                       <th style={{padding: '15px', textAlign: 'left', fontWeight: '600', borderBottom: '1px solid #4b5563'}}>Date</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {idleReportData.map((item) => (
//                       <tr 
//                         key={item.id}
//                         style={{transition: 'background-color 0.2s ease'}}
//                         onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#374151'}
//                         onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
//                       >
//                         <td style={{padding: '12px 15px', borderBottom: '1px solid #374151', color: '#e2e8f0'}}>#{item.id}</td>
//                         <td style={{padding: '12px 15px', borderBottom: '1px solid #374151', color: '#e2e8f0'}}>
//                           <strong style={{color: 'white'}}>Machine {item.machine_no}</strong>
//                         </td>
//                         <td style={{padding: '12px 15px', borderBottom: '1px solid #374151', color: '#e2e8f0'}}>{item.operator_name}</td>
//                         <td style={{padding: '12px 15px', borderBottom: '1px solid #374151', color: '#e2e8f0'}}>{item.tool_id}</td>
//                         <td style={{padding: '12px 15px', borderBottom: '1px solid #374151', color: '#e2e8f0'}}>
//                           <span style={{
//                             padding: '4px 8px', borderRadius: '4px', backgroundColor: '#dc2626',
//                             color: 'white', fontSize: '12px'
//                           }}>
//                             {item.reason}
//                           </span>
//                         </td>
//                         <td style={{padding: '12px 15px', borderBottom: '1px solid #374151', color: '#e2e8f0'}}>{item.created_at}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               ) : (
//                 <div style={{textAlign: 'center', color: '#94a3b8', padding: '40px 20px', fontStyle: 'italic'}}>
//                   No idle reports found
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }





// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { 
//   ArrowLeft, 
//   Download, 
//   FileText, 
//   Printer,
//   Search,
//   Calendar,
//   Building2
// } from 'lucide-react';
// import Sidebar from './Sidebar';

// export default function IdleReportsList() {
//   const navigate = useNavigate();
//   const [idleReportData, setIdleReportData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const fetchIdleReports = async () => {
//       try {
//         const response = await fetch('http://127.0.0.1:8000/api/dashboard-tables/');
//         const data = await response.json();
//         if (data.success) {
//           setIdleReportData(data.idle_reports || []);
//           setFilteredData(data.idle_reports || []);
//         }
//       } catch (error) {
//         console.error('Error fetching idle reports:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchIdleReports();
//   }, []);

//   useEffect(() => {
//     if (!searchTerm) {
//       setFilteredData(idleReportData);
//       return;
//     }
//     const q = searchTerm.toLowerCase();
//     const filtered = idleReportData.filter((item) =>
//       String(item.machine_no || '').toLowerCase().includes(q) ||
//       String(item.operator_name || '').toLowerCase().includes(q) ||
//       String(item.tool_id || '').toLowerCase().includes(q) ||
//       String(item.reason || '').toLowerCase().includes(q)
//     );
//     setFilteredData(filtered);
//   }, [searchTerm, idleReportData]);

//   const exportToCSV = () => {
//     const headers = ['ID', 'Machine No', 'Operator', 'Tool ID', 'Reason', 'Date'];
//     const rows = filteredData.map(item => [
//       item.id ?? '',
//       item.machine_no ?? '',
//       item.operator_name ?? '',
//       item.tool_id ?? '',
//       item.reason ?? '',
//       item.created_at ?? ''
//     ]);
//     const csv = [headers, ...rows]
//       .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
//       .join('\n');

//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     const a = document.createElement('a');
//     a.href = URL.createObjectURL(blob);
//     a.download = `idle_reports_${new Date().toISOString().slice(0,10)}.csv`;
//     a.click();
//     URL.revokeObjectURL(a.href);
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const getCurrentDate = () => {
//     return new Date().toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   return (
//     <div className="min-h-screen bg-[#0f172a] flex relative overflow-hidden">
//       {/* Background Effects - Screen only */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden no-print">
//         <motion.div
//           className="absolute inset-0"
//           animate={{
//             background: [
//               'radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)',
//               'radial-gradient(circle at 80% 70%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)',
//             ],
//           }}
//           transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
//         />

//         {[...Array(15)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute w-2 h-2 rounded-full"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               background: i % 2 === 0 ? '#6366f1' : '#fbbf24',
//             }}
//             animate={{
//               y: [0, -100, 0],
//               x: [0, Math.random() * 50 - 25, 0],
//               opacity: [0, 1, 0],
//               scale: [0, 1, 0],
//             }}
//             transition={{
//               duration: Math.random() * 5 + 3,
//               repeat: Infinity,
//               delay: Math.random() * 3,
//             }}
//           />
//         ))}
//       </div>

//       <div className="no-print">
//         <Sidebar />
//       </div>

//       <div className="flex-1 overflow-auto relative z-10">
//         {/* Top Controls - Hidden on Print */}
//         <div className="max-w-[1400px] mx-auto px-8 py-6 no-print">
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
//           >
//             <button
//               onClick={() => navigate('/dashboard')}
//               className="flex items-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl border border-indigo-500/30 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               Back to Dashboard
//             </button>

//             <div className="flex flex-wrap gap-3">
//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handlePrint}
//                 className="flex items-center gap-2 px-4 py-3 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-xl border border-indigo-500/30 transition-all"
//               >
//                 <Printer className="w-4 h-4" />
//                 Print
//               </motion.button>

//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handlePrint}
//                 className="flex items-center gap-2 px-4 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-xl border border-yellow-500/30 transition-all"
//               >
//                 <FileText className="w-4 h-4" />
//                 PDF
//               </motion.button>

//               <motion.button
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={exportToCSV}
//                 className="flex items-center gap-2 px-4 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl border border-green-500/30 transition-all"
//               >
//                 <Download className="w-4 h-4" />
//                 CSV
//               </motion.button>
//             </div>
//           </motion.div>

//           {/* Search Bar */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="bg-[#1e293b] rounded-2xl p-6 border border-indigo-500/20"
//           >
//             <div className="flex-1 max-w-md relative group">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
//               <input
//                 type="text"
//                 placeholder="Search by machine, operator, tool, or reason..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 bg-[#0f172a] border border-indigo-500/30 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
//               />
//             </div>
//             <div className="mt-4 text-sm text-slate-400">
//               Showing <span className="text-indigo-400 font-semibold">{filteredData.length}</span> of{' '}
//               <span className="text-indigo-400 font-semibold">{idleReportData.length}</span> reports
//             </div>
//           </motion.div>
//         </div>

//         {/* REPORT CONTENT - This will be printed */}
//         <div className="max-w-[1400px] mx-auto px-8 pb-10 print-container">
//           <div id="print-content" className="bg-white rounded-2xl shadow-2xl overflow-hidden">
//             {/* Report Header - Professional */}
//             <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-5 print-header">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg">
//                     <Building2 className="w-7 h-7 text-indigo-600" />
//                   </div>
//                   <div>
//                     <h1 className="text-xl font-bold text-white">Idle Reports List</h1>
//                     <p className="text-indigo-200 text-xs">Complete Idle Case Reports</p>
//                   </div>
//                 </div>
//                 <div className="text-right text-white">
//                   <p className="text-xs opacity-90">Report Date</p>
//                   <p className="text-base font-semibold">{getCurrentDate()}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Report Info Bar */}
//             <div className="bg-slate-50 px-6 py-3 border-b-2 border-indigo-100">
//               <div className="flex items-center justify-between text-xs">
//                 <div className="flex items-center gap-4">
//                   <div>
//                     <span className="text-slate-500">Total Reports:</span>
//                     <span className="ml-2 font-semibold text-slate-800">{filteredData.length}</span>
//                   </div>
//                   <div>
//                     <span className="text-slate-500">Generated By:</span>
//                     <span className="ml-2 font-semibold text-slate-800">AtomOne System</span>
//                   </div>
//                 </div>
//                 <div className="text-slate-500">Page 1 of 1</div>
//               </div>
//             </div>

//             {/* Table Content */}
//             {loading ? (
//               <div className="text-center py-20">
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                   className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"
//                 />
//                 <p className="text-slate-600">Loading idle reports...</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 {filteredData.length > 0 ? (
//                   <table className="w-full report-table">
//                     <thead>
//                       <tr className="bg-slate-100 border-b-2 border-slate-300">
//                         <th className="px-3 py-2.5 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider w-[8%]">
//                           ID
//                         </th>
//                         <th className="px-3 py-2.5 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider w-[15%]">
//                           Machine No
//                         </th>
//                         <th className="px-3 py-2.5 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider w-[15%]">
//                           Operator
//                         </th>
//                         <th className="px-3 py-2.5 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider w-[20%]">
//                           Tool ID
//                         </th>
//                         <th className="px-3 py-2.5 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider w-[22%]">
//                           Reason
//                         </th>
//                         <th className="px-3 py-2.5 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider w-[20%]">
//                           Date
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filteredData.map((item, index) => (
//                         <tr
//                           key={item.id}
//                           className={`border-b border-slate-200 ${
//                             index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
//                           } hover:bg-indigo-50 transition-colors`}
//                         >
//                           <td className="px-3 py-2 text-[11px]">
//                             <span className="text-indigo-600 font-mono font-semibold">#{item.id}</span>
//                           </td>
//                           <td className="px-3 py-2 text-[11px]">
//                             <span className="text-slate-800 font-semibold">Machine {item.machine_no}</span>
//                           </td>
//                           <td className="px-3 py-2 text-[11px] text-slate-700">
//                             {item.operator_name}
//                           </td>
//                           <td className="px-3 py-2 text-[11px]">
//                             <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[10px] font-medium border border-indigo-200 inline-block">
//                               {item.tool_id}
//                             </span>
//                           </td>
//                           <td className="px-3 py-2 text-[11px]">
//                             <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-medium border border-red-200 inline-block">
//                               {item.reason}
//                             </span>
//                           </td>
//                           <td className="px-3 py-2 text-[11px] text-slate-700">
//                             {item.created_at}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <div className="text-center py-20">
//                     <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
//                     <p className="text-slate-600 text-lg">No idle reports found</p>
//                     <p className="text-slate-500 text-sm mt-2">Try adjusting your search criteria</p>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Report Footer */}
//             <div className="bg-slate-50 px-6 py-3 border-t-2 border-slate-200">
//               <div className="flex items-center justify-between text-[10px] text-slate-500">
//                 <div>© {new Date().getFullYear()} AtomOne Technologies - All Rights Reserved</div>
//                 <div>Confidential Report</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Print Styles */}
//       <style jsx>{`
//         @page {
//           size: A4 portrait;
//           margin: 12mm 10mm;
//         }

//         @media print {
//           /* Hide everything except print content */
//           body {
//             margin: 0 !important;
//             padding: 0 !important;
//             background: white !important;
//             -webkit-print-color-adjust: exact;
//             print-color-adjust: exact;
//           }

//           /* Hide non-printable */
//           .no-print {
//             display: none !important;
//           }

//           /* Print container fills page */
//           .print-container {
//             position: fixed;
//             top: 0;
//             left: 0;
//             right: 0;
//             margin: 0 !important;
//             padding: 0 !important;
//             max-width: 100% !important;
//           }

//           #print-content {
//             box-shadow: none !important;
//             border-radius: 0 !important;
//             margin: 0 !important;
//             width: 100% !important;
//             max-width: 100% !important;
//           }

//           /* Header colors preserved */
//           .print-header {
//             background: linear-gradient(to right, #4f46e5, #4338ca) !important;
//             -webkit-print-color-adjust: exact;
//             print-color-adjust: exact;
//           }

//           /* Compact table for print */
//           .report-table {
//             border-collapse: collapse;
//             width: 100% !important;
//             font-size: 9px !important;
//           }

//           .report-table th {
//             background-color: #f1f5f9 !important;
//             padding: 4px 6px !important;
//             font-size: 8px !important;
//             -webkit-print-color-adjust: exact;
//             print-color-adjust: exact;
//           }

//           .report-table td {
//             padding: 4px 6px !important;
//             font-size: 9px !important;
//           }

//           .report-table tbody tr:nth-child(even) {
//             background-color: #f8fafc !important;
//             -webkit-print-color-adjust: exact;
//             print-color-adjust: exact;
//           }

//           /* Prevent page breaks */
//           tr {
//             page-break-inside: avoid;
//           }

//           /* Badge colors preserved */
//           .report-table td span {
//             -webkit-print-color-adjust: exact;
//             print-color-adjust: exact;
//             white-space: nowrap;
//           }

//           /* Ensure all columns visible */
//           .report-table th:nth-child(1),
//           .report-table td:nth-child(1) { width: 8% !important; }
          
//           .report-table th:nth-child(2),
//           .report-table td:nth-child(2) { width: 15% !important; }
          
//           .report-table th:nth-child(3),
//           .report-table td:nth-child(3) { width: 15% !important; }
          
//           .report-table th:nth-child(4),
//           .report-table td:nth-child(4) { width: 20% !important; }
          
//           .report-table th:nth-child(5),
//           .report-table td:nth-child(5) { width: 22% !important; }
          
//           .report-table th:nth-child(6),
//           .report-table td:nth-child(6) { width: 20% !important; }
//         }
//       `}</style>
//     </div>
//   );
// }
     





import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Printer,
  Search,
  Building2
} from 'lucide-react';
import Sidebar from './Sidebar';

export default function IdleReportsList() {
  const navigate = useNavigate();
  const [idleReportData, setIdleReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchIdleReports = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/dashboard-tables/');
        const data = await response.json();
        if (data.success) {
          setIdleReportData(data.idle_reports || []);
          setFilteredData(data.idle_reports || []);
        }
      } catch (error) {
        console.error('Error fetching idle reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIdleReports();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(idleReportData);
      return;
    }
    const q = searchTerm.toLowerCase();
    const filtered = idleReportData.filter((item) =>
      String(item.machine_no || '').toLowerCase().includes(q) ||
      String(item.operator_name || '').toLowerCase().includes(q) ||
      String(item.tool_id || '').toLowerCase().includes(q) ||
      String(item.reason || '').toLowerCase().includes(q)
    );
    setFilteredData(filtered);
  }, [searchTerm, idleReportData]);

  const exportToCSV = () => {
    const headers = ['ID', 'Machine No', 'Operator', 'Tool ID', 'Reason', 'Date'];
    const rows = filteredData.map(item => [
      item.id ?? '',
      item.machine_no ?? '',
      item.operator_name ?? '',
      item.tool_id ?? '',
      item.reason ?? '',
      item.created_at ?? ''
    ]);
    const csv = [headers, ...rows]
      .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `idle_reports_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handlePrint = () => {
    window.print();
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex relative overflow-hidden">
      {/* Background Effects - Screen only */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden no-print">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 70%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? '#6366f1' : '#fbbf24',
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="no-print">
        <Sidebar />
      </div>

      <div className="flex-1 overflow-auto relative z-10">
        {/* Top Controls - Hidden on Print */}
        <div className="max-w-[1400px] mx-auto px-8 py-6 no-print">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl border border-indigo-500/30 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>

            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-3 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 rounded-xl border border-indigo-500/30 transition-all"
              >
                <Printer className="w-4 h-4" />
                Print
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-xl border border-yellow-500/30 transition-all"
              >
                <FileText className="w-4 h-4" />
                PDF
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl border border-green-500/30 transition-all"
              >
                <Download className="w-4 h-4" />
                CSV
              </motion.button>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1e293b] rounded-2xl p-6 border border-indigo-500/20"
          >
            <div className="flex-1 max-w-md relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by machine, operator, tool, or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#0f172a] border border-indigo-500/30 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
            <div className="mt-4 text-sm text-slate-400">
              Showing <span className="text-indigo-400 font-semibold">{filteredData.length}</span> of{' '}
              <span className="text-indigo-400 font-semibold">{idleReportData.length}</span> reports
            </div>
          </motion.div>
        </div>

        {/* REPORT CONTENT - This will be printed */}
        <div className="max-w-[1400px] mx-auto px-8 pb-10 print-container">
          <div id="print-content" className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Report Header - Professional */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-5 print-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg">
                    <Building2 className="w-7 h-7 text-indigo-600" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">Idle Reports List</h1>
                    <p className="text-indigo-200 text-xs">Complete Idle Case Reports</p>
                  </div>
                </div>
                <div className="text-right text-white">
                  <p className="text-xs opacity-90">Report Date</p>
                  <p className="text-base font-semibold">{getCurrentDate()}</p>
                </div>
              </div>
            </div>

            {/* Report Info Bar */}
            <div className="bg-slate-50 px-6 py-3 border-b-2 border-indigo-100">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-slate-500">Total Reports:</span>
                    <span className="ml-2 font-semibold text-slate-800">{filteredData.length}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Generated By:</span>
                    <span className="ml-2 font-semibold text-slate-800">AtomOne-System</span>
                  </div>
                </div>
                <div className="text-slate-500">Page 1 of 1</div>
              </div>
            </div>

            {/* Table Content */}
            {loading ? (
              <div className="text-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-slate-600">Loading idle reports...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {filteredData.length > 0 ? (
                  <table className="w-full report-table">
                    <thead>
                      <tr className="bg-slate-100 border-b-2 border-slate-300">
                        <th className="px-3 py-2.5 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider w-[8%]">
                          ID
                        </th>
                        <th className="px-3 py-2.5 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider w-[15%]">
                          Machine No
                        </th>
                        <th className="px-3 py-2.5 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider w-[15%]">
                          Operator
                        </th>
                        <th className="px-3 py-2.5 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider w-[20%]">
                          Tool ID
                        </th>
                        <th className="px-3 py-2.5 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider w-[22%]">
                          Reason
                        </th>
                        <th className="px-3 py-2.5 text-left text-[10px] font-bold text-slate-700 uppercase tracking-wider w-[20%]">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item, index) => (
                        <tr
                          key={item.id}
                          className={`border-b border-slate-200 ${
                            index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                          } hover:bg-indigo-50 transition-colors`}
                        >
                          <td className="px-3 py-2 text-[11px]">
                            <span className="text-indigo-600 font-mono font-semibold">#{item.id}</span>
                          </td>
                          <td className="px-3 py-2 text-[11px]">
                            <span className="text-slate-800 font-semibold">Machine {item.machine_no}</span>
                          </td>
                          <td className="px-3 py-2 text-[11px] text-slate-700">
                            {item.operator_name}
                          </td>
                          <td className="px-3 py-2 text-[11px]">
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[10px] font-medium border border-indigo-200 inline-block">
                              {item.tool_id}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-[11px]">
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-medium border border-red-200 inline-block">
                              {item.reason}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-[11px] text-slate-700">
                            {item.created_at}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-20">
                    <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 text-lg">No idle reports found</p>
                    <p className="text-slate-500 text-sm mt-2">Try adjusting your search criteria</p>
                  </div>
                )}
              </div>
            )}

            {/* Report Footer */}
            <div className="bg-slate-50 px-6 py-3 border-t-2 border-slate-200">
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <div>© {new Date().getFullYear()} AtomOne Technologies - All Rights Reserved</div>
                <div>Confidential Report</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @page {
          size: A4 portrait;
          margin: 12mm 10mm;
        }

        @media print {
          /* ✅ HTML aur BODY dono ko WHITE */
          html {
            background: white !important;
            background-color: white !important;
          }

          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            background-color: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* ✅ Main dark container ko WHITE */
          .min-h-screen {
            background: white !important;
            background-color: white !important;
          }

          /* Hide non-printable */
          .no-print {
            display: none !important;
            visibility: hidden !important;
          }

          /* Print container fills page with WHITE background */
          .print-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            margin: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
            background: white !important;
            background-color: white !important;
          }

          #print-content {
            box-shadow: none !important;
            border-radius: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            background: white !important;
          }

          /* Header colors preserved */
          .print-header {
            background: linear-gradient(to right, #4f46e5, #4338ca) !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* Compact table for print */
          .report-table {
            border-collapse: collapse;
            width: 100% !important;
            font-size: 9px !important;
          }

          .report-table th {
            background-color: #f1f5f9 !important;
            padding: 4px 6px !important;
            font-size: 8px !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .report-table td {
            padding: 4px 6px !important;
            font-size: 9px !important;
          }

          .report-table tbody tr:nth-child(even) {
            background-color: #f8fafc !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* Prevent page breaks */
          tr {
            page-break-inside: avoid;
          }

          /* Badge colors preserved */
          .report-table td span {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            white-space: nowrap;
          }

          /* Info bar background */
          .bg-slate-50 {
            background-color: #f8fafc !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* Column widths */
          .report-table th:nth-child(1),
          .report-table td:nth-child(1) { width: 8% !important; }
          
          .report-table th:nth-child(2),
          .report-table td:nth-child(2) { width: 15% !important; }
          
          .report-table th:nth-child(3),
          .report-table td:nth-child(3) { width: 15% !important; }
          
          .report-table th:nth-child(4),
          .report-table td:nth-child(4) { width: 20% !important; }
          
          .report-table th:nth-child(5),
          .report-table td:nth-child(5) { width: 22% !important; }
          
          .report-table th:nth-child(6),
          .report-table td:nth-child(6) { width: 20% !important; }
        }
      `}</style>
    </div>
  );
}
