// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';

// const OperatorObservancePlan = () => {
//     const navigate = useNavigate();
//     const [isSubmitting, setIsSubmitting] = useState(false);
    
//     // Date fetch karne ke liye state aur effect
//     const [currentDate, setCurrentDate] = useState('');

//     useEffect(() => {
//         const today = new Date();
//         const formattedDate = today.toLocaleDateString('en-IN', {
//             weekday: 'long',
//             day: 'numeric',
//             month: 'long',
//             year: 'numeric'
//         });
//         setCurrentDate(formattedDate);
//     }, []);
    
//     // Selection States
//     const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//     const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'short' }));

//     const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//     const years = [2024, 2025, 2026];

//     // Dynamic State: Starts with only 1 row
//     const [operators, setOperators] = useState([
//         { id: Date.now(), name: '', dept: '', status: '' }
//     ]);

//     // Add new row function
//     const addRow = () => {
//         setOperators([...operators, { id: Date.now(), name: '', dept: '', status: '' }]);
//     };

//     // Remove row function
//     const removeRow = (id) => {
//         if (operators.length > 1) {
//             setOperators(operators.filter(op => op.id !== id));
//         }
//     };

//     const handleInputChange = (id, field, value) => {
//         setOperators(operators.map(op => op.id === id ? { ...op, [field]: value } : op));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         setTimeout(() => {
//             alert(`Plan for ${selectedMonth} ${selectedYear} with ${operators.length} operators saved!`);
//             setIsSubmitting(false);
//         }, 1200);
//     };

//     return (
//         <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 pb-10 flex flex-col items-center">
            
//             <div className="w-full max-w-5xl px-4 mt-6">
                
//                 {/* --- Action Bar --- */}
//                 <div className="flex justify-start mb-4">
//                     <button 
//                         onClick={() => navigate(-1)}
//                         className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-800 rounded-xl hover:bg-slate-50 transition-all shadow-sm font-bold text-xs"
//                     >
//                         <i className="bi bi-chevron-left text-indigo-600"></i> Back
//                     </button>
//                 </div>

//                 {/* --- Premium Gradient Header --- */}
//                 <div className="w-full bg-gradient-to-br from-[#6366f1] via-[#4f46e5] to-[#3730a3] rounded-t-[2rem] p-8 md:p-12 text-center shadow-xl border-b border-white/10 relative overflow-hidden">
                    
//                     {/* Background effect */}
//                     <div className="absolute top-[-20%] left-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

//                     {/* --- Date Badge --- */}
//                     <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[10px] md:text-xs font-bold px-4 py-2 rounded-full z-20 shadow-lg flex items-center gap-2">
//                         <i className="bi bi-calendar3"></i> {currentDate}
//                     </div>

//                     <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight uppercase italic drop-shadow-md relative z-10 mt-4 md:mt-0">
//                         Operator Observance <span className="text-indigo-200">Plan</span>
//                     </h1>
//                     <p className="text-indigo-100 text-[10px] md:text-xs font-bold mt-2 tracking-[0.3em] uppercase opacity-80 relative z-10">
//                         Monthly Monitoring System | Doc: AOT-F-TR-03A
//                     </p>
//                 </div>

//                 {/* --- Main Card --- */}
//                 <motion.div 
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="bg-white rounded-b-[2rem] shadow-2xl border-x border-b border-slate-100 overflow-hidden"
//                 >
//                     <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
                        
//                         {/* 1. Selection Row */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
//                             <div className="flex flex-col gap-2">
//                                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Plan Year</label>
//                                 <select 
//                                     value={selectedYear}
//                                     onChange={(e) => setSelectedYear(e.target.value)}
//                                     className="p-3 bg-white border border-slate-200 rounded-xl outline-none font-bold text-xs text-indigo-700 focus:ring-2 focus:ring-indigo-100"
//                                 >
//                                     {years.map(y => <option key={y}>{y}</option>)}
//                                 </select>
//                             </div>

//                             <div className="flex flex-col gap-2">
//                                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Plan Month</label>
//                                 <select 
//                                     value={selectedMonth}
//                                     onChange={(e) => setSelectedMonth(e.target.value)}
//                                     className="p-3 bg-white border border-slate-200 rounded-xl outline-none font-bold text-xs text-indigo-700 focus:ring-2 focus:ring-indigo-100"
//                                 >
//                                     {months.map(m => <option key={m}>{m}</option>)}
//                                 </select>
//                             </div>

//                             <div className="flex flex-col gap-2">
//                                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Control</label>
//                                 <button 
//                                     type="button"
//                                     onClick={addRow}
//                                     className="flex items-center justify-center gap-2 p-3 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
//                                 >
//                                     <i className="bi bi-plus-lg text-sm"></i> Add Operator Row
//                                 </button>
//                             </div>
//                         </div>

//                         {/* 2. Simplified Monitoring Grid */}
//                         <div className="space-y-4">
//                             <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 px-1">
//                                 <div className="w-1.5 h-4 bg-indigo-500"></div> Observance Entry List
//                             </h3>

//                             <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
//                                 <table className="w-full text-left border-collapse">
//                                     <thead className="bg-slate-800 text-white text-[10px] uppercase tracking-wider">
//                                         <tr>
//                                             <th className="p-4">Operator Details</th>
//                                             <th className="p-4">Department</th>
//                                             <th className="p-4 text-center w-48">Status ({selectedMonth})</th>
//                                             <th className="p-4 w-16"></th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y divide-slate-50">
//                                         <AnimatePresence initial={false}>
//                                             {operators.map((op, index) => (
//                                                 <motion.tr 
//                                                     key={op.id}
//                                                     initial={{ opacity: 0, x: -10 }}
//                                                     animate={{ opacity: 1, x: 0 }}
//                                                     exit={{ opacity: 0, height: 0 }}
//                                                     className="hover:bg-indigo-50/30 transition-colors text-slate-700"
//                                                 >
//                                                     <td className="p-2">
//                                                         <div className="flex items-center gap-3">
//                                                             <span className="text-[10px] font-bold text-slate-300 ml-2">#{index + 1}</span>
//                                                             <input 
//                                                                 type="text" 
//                                                                 placeholder="Full Name"
//                                                                 value={op.name}
//                                                                 onChange={(e) => handleInputChange(op.id, 'name', e.target.value)}
//                                                                 className="w-full p-2.5 bg-transparent border-none outline-none font-bold text-xs text-slate-700" 
//                                                             />
//                                                         </div>
//                                                     </td>
//                                                     <td className="p-2">
//                                                         <input 
//                                                             type="text" 
//                                                             placeholder="e.g. Quality" 
//                                                             value={op.dept}
//                                                             onChange={(e) => handleInputChange(op.id, 'dept', e.target.value)}
//                                                             className="w-full p-2.5 bg-transparent border-none outline-none text-xs text-slate-500 font-semibold" 
//                                                         />
//                                                     </td>
//                                                     <td className="p-2">
//                                                         <div className="flex justify-center">
//                                                             <select 
//                                                                 value={op.status}
//                                                                 onChange={(e) => handleInputChange(op.id, 'status', e.target.value)}
//                                                                 className="bg-slate-100 border-none rounded-lg px-4 py-2 text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-indigo-200 cursor-pointer"
//                                                             >
//                                                                 <option value="">- Select -</option>
//                                                                 <option value="plan">Plan (○)</option>
//                                                                 <option value="actual">Actual (●)</option>
//                                                             </select>
//                                                         </div>
//                                                     </td>
//                                                     <td className="p-2 text-center">
//                                                         <button 
//                                                             type="button" 
//                                                             onClick={() => removeRow(op.id)}
//                                                             disabled={operators.length === 1}
//                                                             className="text-slate-300 hover:text-red-500 transition-colors disabled:opacity-20"
//                                                         >
//                                                             <i className="bi bi-trash text-sm"></i>
//                                                         </button>
//                                                     </td>
//                                                 </motion.tr>
//                                             ))}
//                                         </AnimatePresence>
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>

//                         {/* 3. Footer Approval Section */}
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
//                             <div className="flex flex-col gap-2">
//                                 <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Prepared By</label>
//                                 <input type="text" placeholder="Signer Name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs font-bold shadow-inner" />
//                             </div>
//                             <div className="flex flex-col gap-2 text-right">
//                                 <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest mr-1">Approved By</label>
//                                 <input type="text" placeholder="Authority Name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs font-bold text-right shadow-inner" />
//                             </div>
//                         </div>

//                         {/* 4. Small Professional Save Button */}
//                         <div className="flex justify-center md:justify-end pt-4">
//                             <button 
//                                 type="submit" 
//                                 disabled={isSubmitting}
//                                 className={`px-12 py-4 rounded-xl font-black text-white text-[11px] tracking-[0.2em] transition-all shadow-xl active:scale-[0.95] ${
//                                     isSubmitting 
//                                     ? 'bg-slate-300' 
//                                     : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:shadow-indigo-200'
//                                 }`}
//                             >
//                                 {isSubmitting ? 'SAVING...' : 'FINALIZE OBSERVANCE PLAN'}
//                             </button>
//                         </div>
//                     </form>
//                 </motion.div>
//             </div>
//         </div>
//     );
// };

// export default OperatorObservancePlan;


import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../../../../../config/api';
import axios from 'axios';
const API_LOG = `${
  process.env.REACT_APP_API_URL || "http://localhost:8000"
}/api/log-report/`;

const OperatorObservancePlan = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Date fetch karne ke liye state aur effect
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        setCurrentDate(formattedDate);
    }, []);
    
    // Selection States
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'short' }));

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const years = [2024, 2025, 2026];

    
    const [operators, setOperators] = useState([
        { name: '', dept: '', status: '' }
    ]);

   
    const addRow = () => {
        setOperators([...operators, { name: '', dept: '', status: '' }]);
    };

    // Remove row function (Ab index ke base par delete hoga)
    const removeRow = (indexToRemove) => {
        if (operators.length > 1) {
            setOperators(operators.filter((_, index) => index !== indexToRemove));
        }
    };

    
    const handleInputChange = (indexToUpdate, field, value) => {
        const updatedOperators = [...operators];
        updatedOperators[indexToUpdate][field] = value;
        setOperators(updatedOperators);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const formObj = Object.fromEntries(new FormData(e.target).entries());
        const payload = {
            selectedYear: selectedYear,
            selectedMonth: selectedMonth,
            operators: operators,
            ...formObj
        };

        try {
            const response = await fetch(getApiUrl('/api/operator-observance-plan/save/'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const currentUser = localStorage.getItem("username") || "Unknown User";

        try {
          await axios.post(API_LOG, {
            username: currentUser,
            report_name: "Operator Observance Report", // Yahan hardcode kar diya form ka naam
          });
          console.log("Activity log successfully saved!");
        } catch (logError) {
          console.error("Activity log save karne mein error aayi:", logError);
        }
                alert(`Plan for ${selectedMonth} ${selectedYear} with ${operators.length} operators saved!`);
            } else {
                alert("Failed to save plan data.");
            }
        } catch (error) {
            console.error("Error saving data:", error);
            alert("An error occurred while saving the data.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 pb-10 flex flex-col items-center">
            
            <div className="w-full max-w-5xl px-4 mt-6">
                
                {/* --- Action Bar --- */}
                <div className="flex justify-start mb-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-800 rounded-xl hover:bg-slate-50 transition-all shadow-sm font-bold text-xs"
                    >
                        <i className="bi bi-chevron-left text-indigo-600"></i> Back
                    </button>
                </div>

                {/* --- Premium Gradient Header --- */}
                <div className="w-full bg-gradient-to-br from-[#6366f1] via-[#4f46e5] to-[#3730a3] rounded-t-[2rem] p-8 md:p-12 text-center shadow-xl border-b border-white/10 relative overflow-hidden">
                    
                    {/* Background effect */}
                    <div className="absolute top-[-20%] left-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

                    {/* --- Date Badge --- */}
                    <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[10px] md:text-xs font-bold px-4 py-2 rounded-full z-20 shadow-lg flex items-center gap-2">
                        <i className="bi bi-calendar3"></i> {currentDate}
                    </div>

                    <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight uppercase italic drop-shadow-md relative z-10 mt-4 md:mt-0">
                        Operator Observance <span className="text-indigo-200">Plan</span>
                    </h1>
                    <p className="text-indigo-100 text-[10px] md:text-xs font-bold mt-2 tracking-[0.3em] uppercase opacity-80 relative z-10">
                        Monthly Monitoring System | Doc: AOT-F-TR-03A
                    </p>
                </div>

                {/* --- Main Card --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-b-[2rem] shadow-2xl border-x border-b border-slate-100 overflow-hidden"
                >
                    <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
                        
                        {/* 1. Selection Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Plan Year</label>
                                <select 
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="p-3 bg-white border border-slate-200 rounded-xl outline-none font-bold text-xs text-indigo-700 focus:ring-2 focus:ring-indigo-100"
                                >
                                    {years.map(y => <option key={y}>{y}</option>)}
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Plan Month</label>
                                <select 
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="p-3 bg-white border border-slate-200 rounded-xl outline-none font-bold text-xs text-indigo-700 focus:ring-2 focus:ring-indigo-100"
                                >
                                    {months.map(m => <option key={m}>{m}</option>)}
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Control</label>
                                <button 
                                    type="button"
                                    onClick={addRow}
                                    className="flex items-center justify-center gap-2 p-3 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                                >
                                    <i className="bi bi-plus-lg text-sm"></i> Add Operator Row
                                </button>
                            </div>
                        </div>

                        {/* 2. Simplified Monitoring Grid */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 px-1">
                                <div className="w-1.5 h-4 bg-indigo-500"></div> Observance Entry List
                            </h3>

                            <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-800 text-white text-[10px] uppercase tracking-wider">
                                        <tr>
                                            <th className="p-4">Operator Details</th>
                                            <th className="p-4">Department</th>
                                            <th className="p-4 text-center w-48">Status ({selectedMonth})</th>
                                            <th className="p-4 w-16"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        <AnimatePresence initial={false}>
                                            {operators.map((op, index) => (
                                                <motion.tr 
                                                    key={index} // Yahan key me index use kiya gaya hai
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="hover:bg-indigo-50/30 transition-colors text-slate-700"
                                                >
                                                    <td className="p-2">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] font-bold text-slate-300 ml-2">#{index + 1}</span>
                                                            <input 
                                                                type="text" 
                                                                placeholder="Full Name"
                                                                value={op.name}
                                                                onChange={(e) => handleInputChange(index, 'name', e.target.value)} // ID ki jagah index
                                                                className="w-full p-2.5 bg-transparent border-none outline-none font-bold text-xs text-slate-700" 
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="p-2">
                                                        <input 
                                                            type="text" 
                                                            placeholder="e.g. Quality" 
                                                            value={op.dept}
                                                            onChange={(e) => handleInputChange(index, 'dept', e.target.value)} // ID ki jagah index
                                                            className="w-full p-2.5 bg-transparent border-none outline-none text-xs text-slate-500 font-semibold" 
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        <div className="flex justify-center">
                                                            <select 
                                                                value={op.status}
                                                                onChange={(e) => handleInputChange(index, 'status', e.target.value)} // ID ki jagah index
                                                                className="bg-slate-100 border-none rounded-lg px-4 py-2 text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-indigo-200 cursor-pointer"
                                                            >
                                                                <option value="">- Select -</option>
                                                                <option value="plan">Plan (○)</option>
                                                                <option value="actual">Actual (●)</option>
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td className="p-2 text-center">
                                                        <button 
                                                            type="button" 
                                                            onClick={() => removeRow(index)} // Delete ke liye ID ki jagah index pass kiya
                                                            disabled={operators.length === 1}
                                                            className="text-slate-300 hover:text-red-500 transition-colors disabled:opacity-20"
                                                        >
                                                            <i className="bi bi-trash text-sm"></i>
                                                        </button>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 3. Footer Approval Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Prepared By</label>
                                <input name="preparedBy" type="text" placeholder="Signer Name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs font-bold shadow-inner" />
                            </div>
                            <div className="flex flex-col gap-2 text-right">
                                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest mr-1">Approved By</label>
                                <input name="approvedBy" type="text" placeholder="Authority Name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs font-bold text-right shadow-inner" />
                            </div>
                        </div>

                        {/* 4. Small Professional Save Button */}
                        <div className="flex justify-center md:justify-end pt-4">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={`px-12 py-4 rounded-xl font-black text-white text-[11px] tracking-[0.2em] transition-all shadow-xl active:scale-[0.95] ${
                                    isSubmitting 
                                    ? 'bg-slate-300' 
                                    : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:shadow-indigo-200'
                                }`}
                            >
                                {isSubmitting ? 'SAVING...' : 'FINALIZE OBSERVANCE PLAN'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default OperatorObservancePlan;