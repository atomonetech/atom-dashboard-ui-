import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ProductAuditPlan = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form Initial State
    const initialFormHeader = {
        docNo: 'AOT-F-QA-08',
        revNo: '00',
        date: '',
        planYear: '2025-2026'
    };

    const initialRow = { id: Date.now(), partName: '', partNumber: '', model: '', monthStatus: '' };

    const [headerData, setHeaderData] = useState(initialFormHeader);
    const [auditRows, setAuditRows] = useState([initialRow]);

    // Handle Month Selection logic (Dropdown for simplicity & responsiveness)
    const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

    const addRow = () => {
        setAuditRows([...auditRows, { ...initialRow, id: Date.now() }]);
    };

    const removeRow = (id) => {
        if (auditRows.length > 1) setAuditRows(auditRows.filter(row => row.id !== id));
    };

    const handleInputChange = (id, field, value) => {
        setAuditRows(auditRows.map(row => row.id === id ? { ...row, [field]: value } : row));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate Submission
        setTimeout(() => {
            alert("Success! Product Audit Plan Submitted and Form Reset.");
            
            // RESET FORM AFTER SUBMISSION
            setHeaderData(initialFormHeader);
            setAuditRows([{ ...initialRow, id: Date.now() }]);
            setIsSubmitting(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#fff1f2] font-sans text-slate-900 pb-12 flex flex-col items-center">
            
            <div className="w-full max-w-6xl px-4 mt-6">
                
                {/* --- Action Bar --- */}
                <div className="flex justify-start mb-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 px-4 py-2 bg-white border border-pink-100 text-slate-800 rounded-lg hover:bg-pink-50 transition-all shadow-sm font-bold text-xs active:scale-95"
                    >
                        <i className="bi bi-arrow-left text-[#ec4899]"></i> 
                        Back to Hub
                    </button>
                </div>

                {/* --- NYC Professional Header --- */}
                <div className="w-full bg-gradient-to-r from-[#ec4899] to-[#be185d] rounded-t-[2rem] p-8 md:p-10 text-center shadow-lg border-b border-white/10">
                    <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight uppercase italic drop-shadow-md">
                        Product Audit <span className="text-pink-200">Plan</span>
                    </h1>
                    <p className="text-pink-100 text-[10px] md:text-xs font-bold mt-2 tracking-[0.3em] uppercase opacity-90">
                        AtomOne Quality Standards | {headerData.planYear}
                    </p>
                </div>

                {/* --- Main Form Card --- */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-b-[2rem] shadow-2xl border-x border-b border-pink-50 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-4 md:p-10 space-y-10">
                        
                        {/* 1. Header Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-pink-50/50 rounded-3xl border border-pink-100 shadow-inner">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Plan Year</label>
                                <input type="text" value={headerData.planYear} readOnly className="p-3 bg-white border border-pink-100 rounded-xl font-bold text-xs text-pink-600 outline-none" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Audit Date</label>
                                <input 
                                    type="date" 
                                    value={headerData.date} 
                                    onChange={(e) => setHeaderData({...headerData, date: e.target.value})} 
                                    className="p-3 bg-white border border-pink-100 rounded-xl font-bold text-xs outline-none focus:border-[#ec4899]" 
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Doc Reference</label>
                                <div className="p-3 bg-white border border-pink-100 rounded-xl font-bold text-[10px] text-slate-400">
                                    {headerData.docNo} | Rev: {headerData.revNo}
                                </div>
                            </div>
                        </div>

                        {/* 2. Audit Table (Responsive) */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1.5 h-4 bg-[#ec4899]"></div> Audit Schedule Grid
                                </h3>
                                <button 
                                    type="button" 
                                    onClick={addRow}
                                    className="px-4 py-2 bg-pink-100 text-[#ec4899] rounded-xl font-bold text-[10px] uppercase hover:bg-pink-200 transition-all shadow-sm"
                                >
                                    + Add New Part
                                </button>
                            </div>

                            <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-sm">
                                <table className="w-full text-left border-collapse min-w-[900px]">
                                    <thead className="bg-[#1e293b] text-white text-[10px] uppercase tracking-wider">
                                        <tr>
                                            <th className="p-4 w-16 text-center">S.No</th>
                                            <th className="p-4">Part Name</th>
                                            <th className="p-4">Part Number</th>
                                            <th className="p-4 w-24">Model</th>
                                            <th className="p-4 text-center w-64">Schedule Month & Status</th>
                                            <th className="p-4 w-12"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <AnimatePresence initial={false}>
                                            {auditRows.map((row, idx) => (
                                                <motion.tr 
                                                    key={row.id} 
                                                    initial={{ opacity: 0, x: -10 }} 
                                                    animate={{ opacity: 1, x: 0 }} 
                                                    className="hover:bg-pink-50/50 transition-colors"
                                                >
                                                    <td className="p-4 text-center font-black text-slate-900 text-xs">#{idx + 1}</td>
                                                    <td className="p-2">
                                                        <input 
                                                            type="text" 
                                                            placeholder="e.g. Brake Lever"
                                                            value={row.partName}
                                                            onChange={(e) => handleInputChange(row.id, 'partName', e.target.value)}
                                                            className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-lg outline-none font-bold text-xs text-slate-700 focus:bg-white focus:border-[#ec4899] transition-all" 
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        <input 
                                                            type="text" 
                                                            placeholder="Part No."
                                                            value={row.partNumber}
                                                            onChange={(e) => handleInputChange(row.id, 'partNumber', e.target.value)}
                                                            className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-lg outline-none font-bold text-xs text-slate-700 focus:bg-white focus:border-[#ec4899] transition-all" 
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        <input 
                                                            type="text" 
                                                            placeholder="Model"
                                                            value={row.model}
                                                            onChange={(e) => handleInputChange(row.id, 'model', e.target.value)}
                                                            className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-lg outline-none text-center font-black text-xs text-pink-600" 
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        <div className="flex gap-2">
                                                            <select 
                                                                className="w-1/2 p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase outline-none focus:border-[#ec4899]"
                                                            >
                                                                <option value="">Month</option>
                                                                {months.map(m => <option key={m}>{m}</option>)}
                                                            </select>
                                                            <select 
                                                                className="w-1/2 p-2 bg-pink-50 border border-pink-100 rounded-lg text-[10px] font-black uppercase outline-none focus:border-[#ec4899]"
                                                            >
                                                                <option value="plan">Plan (○)</option>
                                                                <option value="done">Done (●)</option>
                                                                <option value="postponed">Postponed (⊘)</option>
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td className="p-2 text-center">
                                                        <button 
                                                            type="button" 
                                                            onClick={() => removeRow(row.id)}
                                                            disabled={auditRows.length === 1}
                                                            className="text-slate-300 hover:text-red-500 transition-colors disabled:opacity-20"
                                                        >
                                                            <i className="bi bi-trash-fill text-lg"></i>
                                                        </button>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 3. Legends Section */}
                        <div className="flex flex-wrap justify-center gap-8 py-4 border-y border-slate-100 bg-slate-50/50 rounded-2xl">
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <div className="w-3 h-3 rounded-full border-2 border-slate-400"></div> Plan
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <div className="w-3 h-3 rounded-full bg-slate-800"></div> Done
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <div className="w-3 h-3 rounded-full border-2 border-slate-800 flex items-center justify-center text-[8px]">/</div> Postponed
                            </div>
                        </div>

                        {/* 4. Footer Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Prepared By</label>
                                <input type="text" placeholder="Inspector Name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1 md:text-right block">Approved By</label>
                                <input type="text" placeholder="Manager Name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs font-bold md:text-right" />
                            </div>
                        </div>

                        {/* 5. Submit Button */}
                        <div className="flex justify-center md:justify-end pt-4">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={`px-12 py-4 bg-gradient-to-r from-[#ec4899] to-[#be185d] text-white rounded-xl font-black text-[11px] tracking-[0.2em] shadow-xl hover:scale-105 active:scale-[0.95] transition-all ${isSubmitting ? 'opacity-50' : ''}`}
                            >
                                {isSubmitting ? 'SAVING DATA...' : 'FINALIZE AUDIT PLAN'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductAuditPlan;