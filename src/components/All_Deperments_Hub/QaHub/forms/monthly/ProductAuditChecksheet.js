import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { getApiUrl } from '../../../../../config/api';

const ProductAuditPlan = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [partList, setPartList] = useState([]);

    const initialFormHeader = {
        docNo: 'AOT-F-QA-08',
        revNo: '00',
        date: '',
        planYear: '2025-2026',
        preparedBy: '',
        approvedBy: ''
    };

    // Removed the 'id' field as requested
    const initialRow = { partName: '', partNumber: '', model: '', monthStatus: '', statusMark: '' };

    const [headerData, setHeaderData] = useState(initialFormHeader);
    const [auditRows, setAuditRows] = useState([initialRow]);

    const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

    useEffect(() => {
        const fetchParts = async () => {
            try {
                const res = await fetch(getApiUrl(`/api/master-dropdown/?filter=all_parts`));

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data = await res.json();
                const uniqueParts = [...new Set(data.map(item => Array.isArray(item) ? item[0] : item))].filter(Boolean);
                setPartList(uniqueParts);
            } catch (error) {
                console.error("Failed to fetch parts:", error);
            }
        };
        fetchParts();
    }, []);

    const addRow = () => setAuditRows([...auditRows, { ...initialRow }]);

    // Updated removeRow to use index
    const removeRow = (indexToRemove) => {
        if (auditRows.length > 1) {
            setAuditRows(auditRows.filter((_, index) => index !== indexToRemove));
        }
    };

    // Updated handleInputChange to use index
    const handleInputChange = (index, field, value) => {
        const updatedRows = [...auditRows];
        updatedRows[index][field] = value;
        setAuditRows(updatedRows);
    };

    // Updated handlePartNameChange to use index
    const handlePartNameChange = async (index, value) => {
        handleInputChange(index, 'partName', value);
        if (!value) return;

        try {
            const [noRes, modRes] = await Promise.all([
                fetch(getApiUrl(`/api/master-dropdown/?filter=part_no&part=${encodeURIComponent(value)}`)),
                fetch(getApiUrl(`/api/master-dropdown/?filter=model_by_part&part=${encodeURIComponent(value)}`))
            ]);

            if (!noRes.ok || !modRes.ok) {
                throw new Error("Failed to fetch auto-fill data");
            }

            const noData = await noRes.json();
            const modData = await modRes.json();

            const updatedRows = [...auditRows];
            updatedRows[index].partNumber = noData[0] || '';
            updatedRows[index].model = modData[0] || '';
            setAuditRows(updatedRows);

        } catch (error) {
            console.error("Failed to auto-fill:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Map frontend data to backend snake_case format
        const formattedRows = auditRows.map(row => ({
            part_name: row.partName,
            part_no: row.partNumber,
            model_name: row.model,
            month_status: row.monthStatus,
            status_mark: row.statusMark
        }));
        const currentUser = localStorage.getItem("username") || "Unknown User";
        const payload = {
            doc_no: headerData.docNo,
            rev_no: headerData.revNo,
            date: headerData.date,
            plan_year: headerData.planYear,
            prepared_by: headerData.preparedBy,
            approved_by: headerData.approvedBy,
            rows: formattedRows,

            username: currentUser,
            department_name: "QA",
        };

        try {
            const response = await fetch(getApiUrl(`/api/product-audit-plan/`), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Success! Product Audit Plan Submitted and Form Reset.");
                setHeaderData({ ...initialFormHeader, date: new Date().toISOString().split('T')[0] });
                setAuditRows([{ ...initialRow }]);
            } else {
                alert('Failed to submit plan.');
            }
        } catch (error) {
            console.error('Submission Error:', error);
            alert('An error occurred while saving data.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fff1f2] font-sans text-slate-900 pb-12 flex flex-col items-center">
            <div className="w-full max-w-6xl px-4 mt-6">
                <div className="flex justify-start mb-4">
                    <button onClick={() => navigate(-1)} className="group flex items-center gap-2 px-4 py-2 bg-white border border-pink-100 text-slate-800 rounded-lg hover:bg-pink-50 transition-all shadow-sm font-bold text-xs active:scale-95">
                        <i className="bi bi-arrow-left text-[#ec4899]"></i> Back to Hub
                    </button>
                </div>

                <div className="w-full bg-gradient-to-r from-[#ec4899] to-[#be185d] rounded-t-[2rem] p-8 md:p-10 text-center shadow-lg border-b border-white/10">
                    <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight uppercase italic drop-shadow-md">
                        Product Audit <span className="text-pink-200">Plan</span>
                    </h1>
                    <p className="text-pink-100 text-[10px] md:text-xs font-bold mt-2 tracking-[0.3em] uppercase opacity-90">
                        AtomOne Quality Standards | {headerData.planYear}
                    </p>
                </div>

                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-b-[2rem] shadow-2xl border-x border-b border-pink-50 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-4 md:p-10 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-pink-50/50 rounded-3xl border border-pink-100 shadow-inner">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Plan Year</label>
                                <input type="text" value={headerData.planYear} readOnly className="p-3 bg-white border border-pink-100 rounded-xl font-bold text-xs text-pink-600 outline-none" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Audit Date</label>
                                <input required type="date" value={headerData.date} onChange={(e) => setHeaderData({ ...headerData, date: e.target.value })} className="p-3 bg-white border border-pink-100 rounded-xl font-bold text-xs outline-none focus:border-[#ec4899]" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Doc Reference</label>
                                <div className="p-3 bg-white border border-pink-100 rounded-xl font-bold text-[10px] text-slate-400">
                                    {headerData.docNo} | Rev: {headerData.revNo}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1.5 h-4 bg-[#ec4899]"></div> Audit Schedule Grid
                                </h3>
                                <button type="button" onClick={addRow} className="px-4 py-2 bg-pink-100 text-[#ec4899] rounded-xl font-bold text-[10px] uppercase hover:bg-pink-200 transition-all shadow-sm">
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
                                                <motion.tr key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="hover:bg-pink-50/50 transition-colors">
                                                    <td className="p-4 text-center font-black text-slate-900 text-xs">#{idx + 1}</td>
                                                    <td className="p-2">
                                                        <select required value={row.partName} onChange={(e) => handlePartNameChange(idx, e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-lg outline-none font-bold text-xs text-slate-700 focus:bg-white focus:border-[#ec4899] transition-all appearance-none">
                                                            <option value="" disabled>Select Part</option>
                                                            {partList.map((part, i) => <option key={i} value={part}>{part}</option>)}
                                                        </select>
                                                    </td>
                                                    <td className="p-2">
                                                        <input required type="text" placeholder="Part No." value={row.partNumber} onChange={(e) => handleInputChange(idx, 'partNumber', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-lg outline-none font-bold text-xs text-slate-700 focus:bg-white focus:border-[#ec4899] transition-all" />
                                                    </td>
                                                    <td className="p-2">
                                                        <input required type="text" placeholder="Model" value={row.model} onChange={(e) => handleInputChange(idx, 'model', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-lg outline-none text-center font-black text-xs text-pink-600" />
                                                    </td>
                                                    <td className="p-2">
                                                        <div className="flex gap-2">
                                                            <select value={row.monthStatus} onChange={(e) => handleInputChange(idx, 'monthStatus', e.target.value)} className="w-1/2 p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase outline-none focus:border-[#ec4899]">
                                                                <option value="">Month</option>
                                                                {months.map(m => <option key={m} value={m}>{m}</option>)}
                                                            </select>
                                                            <select value={row.statusMark} onChange={(e) => handleInputChange(idx, 'statusMark', e.target.value)} className="w-1/2 p-2 bg-pink-50 border border-pink-100 rounded-lg text-[10px] font-black uppercase outline-none focus:border-[#ec4899]">
                                                                <option value="plan">Plan (○)</option>
                                                                <option value="done">Done (●)</option>
                                                                <option value="postponed">Postponed (⊘)</option>
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td className="p-2 text-center">
                                                        <button type="button" onClick={() => removeRow(idx)} disabled={auditRows.length === 1} className="text-slate-300 hover:text-red-500 transition-colors disabled:opacity-20">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Prepared By</label>
                                <input required type="text" value={headerData.preparedBy} onChange={(e) => setHeaderData({ ...headerData, preparedBy: e.target.value })} placeholder="Inspector Name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1 md:text-right block">Approved By</label>
                                <input required type="text" value={headerData.approvedBy} onChange={(e) => setHeaderData({ ...headerData, approvedBy: e.target.value })} placeholder="Manager Name" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs font-bold md:text-right" />
                            </div>
                        </div>

                        <div className="flex justify-center md:justify-end pt-4">
                            <button type="submit" disabled={isSubmitting} className={`px-12 py-4 bg-gradient-to-r from-[#ec4899] to-[#be185d] text-white rounded-xl font-black text-[11px] tracking-[0.2em] shadow-xl hover:scale-105 active:scale-[0.95] transition-all ${isSubmitting ? 'opacity-50' : ''}`}>
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