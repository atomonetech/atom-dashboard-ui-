import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CapacityPlanningForm = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dynamic State for Rows
    const [rows, setRows] = useState([
        { id: Date.now(), type: '', noOfMC: '', spm: '', rate: '', cap540: '', eff: '', util: '', singleCap: '', totalCap: '', strokes: '', spare: '' }
    ]);

    const addRow = () => {
        setRows([...rows, { id: Date.now(), type: '', noOfMC: '', spm: '', rate: '', cap540: '', eff: '', util: '', singleCap: '', totalCap: '', strokes: '', spare: '' }]);
    };

    const removeRow = (id) => {
        if (rows.length > 1) setRows(rows.filter(row => row.id !== id));
    };

    const handleInputChange = (id, field, value) => {
        setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            alert("Capacity Report Saved!");
            setIsSubmitting(false);
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 pb-12 flex flex-col items-center">
            <div className="w-full max-w-7xl px-3 md:px-6 mt-6 md:mt-8">
                
                {/* Back Button */}
                <div className="flex justify-start mb-4">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-100 rounded-xl font-bold text-xs shadow-sm hover:bg-blue-50 transition-all">
                        <i className="bi bi-arrow-left text-[#3b82f6]"></i> Back
                    </button>
                </div>

                {/* Header Section */}
                <div className="w-full bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] rounded-t-[2rem] p-8 md:p-12 text-center shadow-lg border-b border-white/10">
                    <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight uppercase italic">
                        Capacity of <span className="text-blue-200">Line / Cell / Plant</span>
                    </h1>
                    <p className="text-blue-100 text-[10px] md:text-xs font-bold mt-2 tracking-[0.3em] uppercase opacity-90 italic">
                        AtomOne Technologies | Quality Assurance Grid
                    </p>
                </div>

                {/* Main Card */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-b-[2rem] shadow-2xl border-x border-b border-blue-50 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-4 md:p-10 space-y-10">
                        
                        {/* 1. Header Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-blue-50/30 rounded-3xl border border-blue-100 shadow-inner">
                            <InputField label="Month" placeholder="e.g. July 2025" />
                            <InputField label="Production Cell" placeholder="e.g. Press Shop" />
                            <InputField label="Unit" placeholder="e.g. I" />
                        </div>

                        {/* 2. Main Data Table */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1.5 h-4 bg-[#3b82f6]"></div> Capacity Matrix Entry
                                </h3>
                                <button type="button" onClick={addRow} className="px-4 py-2 bg-blue-100 text-[#3b82f6] rounded-xl font-bold text-[10px] uppercase hover:bg-blue-200 transition-all shadow-sm">
                                    + Add New Line
                                </button>
                            </div>

                            <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-sm">
                                <table className="w-full text-left border-collapse min-w-[1400px]">
                                    <thead className="bg-[#1e293b] text-white text-[9px] uppercase tracking-wider text-center">
                                        <tr>
                                            <th className="p-4 w-16">Sr.No</th>
                                            <th className="p-4 w-48 text-left">Type of Press/Line</th>
                                            <th className="p-4">No. of M/C</th>
                                            <th className="p-4">SPM / Cycle Time</th>
                                            <th className="p-4">Prod. Rate / Hr</th>
                                            <th className="p-4">Cap. @ 540 Min</th>
                                            <th className="p-4">Eff %</th>
                                            <th className="p-4">Util %</th>
                                            <th className="p-4">Single Cap.</th>
                                            <th className="p-4 bg-slate-700">Actual Total</th>
                                            <th className="p-4">Strokes Req.</th>
                                            <th className="p-4">Spare %</th>
                                            <th className="p-4 w-12"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <AnimatePresence>
                                            {rows.map((row, idx) => (
                                                <motion.tr key={row.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-blue-50/50 transition-colors">
                                                    <td className="p-4 text-center font-black text-slate-900 text-xs">#{idx + 1}</td>
                                                    <td className="p-2"><TableInput value={row.type} onChange={(e) => handleInputChange(row.id, 'type', e.target.value)} placeholder="Machine Name" isDark /></td>
                                                    <td className="p-2"><TableInput value={row.noOfMC} onChange={(e) => handleInputChange(row.id, 'noOfMC', e.target.value)} placeholder="0" /></td>
                                                    <td className="p-2"><TableInput value={row.spm} onChange={(e) => handleInputChange(row.id, 'spm', e.target.value)} placeholder="0" /></td>
                                                    <td className="p-2"><TableInput value={row.rate} onChange={(e) => handleInputChange(row.id, 'rate', e.target.value)} placeholder="0" /></td>
                                                    <td className="p-2"><TableInput value={row.cap540} onChange={(e) => handleInputChange(row.id, 'cap540', e.target.value)} placeholder="0" /></td>
                                                    <td className="p-2"><TableInput value={row.eff} onChange={(e) => handleInputChange(row.id, 'eff', e.target.value)} placeholder="85" /></td>
                                                    <td className="p-2"><TableInput value={row.util} onChange={(e) => handleInputChange(row.id, 'util', e.target.value)} placeholder="85" /></td>
                                                    <td className="p-2"><TableInput value={row.singleCap} onChange={(e) => handleInputChange(row.id, 'singleCap', e.target.value)} placeholder="0" /></td>
                                                    <td className="p-2 bg-blue-50/50"><TableInput value={row.totalCap} onChange={(e) => handleInputChange(row.id, 'totalCap', e.target.value)} placeholder="0" isBold /></td>
                                                    <td className="p-2"><TableInput value={row.strokes} onChange={(e) => handleInputChange(row.id, 'strokes', e.target.value)} placeholder="0" /></td>
                                                    <td className="p-2 font-black text-green-600"><TableInput value={row.spare} onChange={(e) => handleInputChange(row.id, 'spare', e.target.value)} placeholder="0.00" /></td>
                                                    <td className="p-2 text-center">
                                                        <button type="button" onClick={() => removeRow(row.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                                            <i className="bi bi-trash-fill"></i>
                                                        </button>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 3. Revision & Approval Aligned */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-10 border-t border-slate-100">
                            {/* Revision Box */}
                            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                                <InputField label="Rev .No" defaultValue="00" />
                                <InputField label="Rev. Date" type="date" />
                                <InputField label="Rev. Details" placeholder="Initial Release" />
                            </div>

                            {/* Signatures */}
                            <div className="lg:col-span-5 grid grid-cols-2 gap-8 self-end pb-1">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Prepared By</label>
                                    <div className="h-10 border-b-2 border-slate-200 flex items-end pb-1 text-xs font-bold text-slate-400">Sign / Name</div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1 text-right block">Approved By</label>
                                    <div className="h-10 border-b-2 border-slate-200 flex items-end pb-1 text-xs font-bold text-slate-400 text-right justify-end">Manager</div>
                                </div>
                            </div>
                        </div>

                        {/* 4. Sleek CTA Button */}
                        <div className="flex justify-center md:justify-end pt-2 pb-2">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={`px-10 py-3.5 bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] text-white rounded-xl font-black text-[11px] tracking-[0.2em] shadow-xl hover:scale-105 active:scale-[0.95] transition-all ${isSubmitting ? 'opacity-50' : ''}`}
                            >
                                {isSubmitting ? 'SAVING...' : 'FINALIZE CAPACITY PLAN'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

// Reusable Components
const InputField = ({ label, type = "text", placeholder, defaultValue }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">{label}</label>
        <input type={type} placeholder={placeholder} defaultValue={defaultValue} className="w-full p-3 bg-white border border-slate-200 focus:border-[#3b82f6] rounded-xl outline-none transition-all font-bold text-xs text-slate-900 shadow-sm focus:bg-white" />
    </div>
);

const TableInput = ({ value, onChange, placeholder, isDark, isBold }) => (
    <input 
        type="text" 
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-slate-100 p-2 rounded-lg border-none outline-none text-center text-[10px] transition-all focus:bg-white focus:ring-1 focus:ring-blue-400 ${isDark ? 'text-slate-900 font-black text-left' : 'text-slate-600 font-bold'} ${isBold ? 'text-blue-700' : ''}`} 
    />
);

export default CapacityPlanningForm;