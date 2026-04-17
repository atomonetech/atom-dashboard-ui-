import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const OperatorObservanceCheckSheet = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Default checklist from Excel scan
    const initialPoints = [
        "Is Operator doing 1'S and 2'S",
        "Is Operator using Safety PPE's (safety shoes, gloves, mask, goggle, ear plug etc.)",
        "Is Operator aware about operation",
        "Visual defects checked by operator during process",
        "Is Operator aware about abnormal situation",
        "Is Operator aware about Operation Standard & WI",
        "Is Operator filling daily maintenance checksheet",
        "Control of Ok, Rework, Reject Parts storage",
        "Knowledge of loading/unloading of tool",
        "Last part in trolley before lunch/leaving",
        "Proper disposal of waste (gloves, mask, etc.)",
        "Organisational behaviour of operator",
        "Use of poka yoke in operation",
        "Part identification & traceability awareness",
        "Utilising proper time for operation",
        "Awareness of Single part flow system"
    ];

    const [formData, setFormData] = useState(
        initialPoints.map((text, i) => ({ id: i + 1, task: text, response: '', training: false, effect: '', remarks: '' }))
    );

    // Function to add a new custom row
    const addRow = () => {
        const newRow = {
            id: formData.length + 1,
            task: '',
            response: '',
            training: false,
            effect: '',
            remarks: '',
            isCustom: true // Track if it's user-added
        };
        setFormData([...formData, newRow]);
    };

    // Function to remove user-added row
    const removeRow = (id) => {
        if (formData.length > 1) {
            setFormData(formData.filter(row => row.id !== id));
        }
    };

    const handleTaskChange = (id, value) => {
        setFormData(formData.map(row => row.id === id ? { ...row, task: value } : row));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            alert("Observance Data Saved Successfully!");
            setIsSubmitting(false);
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-[#fff8f5] font-sans text-slate-900 pb-12 flex flex-col items-center">
            
            <div className="w-full max-w-7xl px-3 md:px-6 mt-6 md:mt-8">
                
                {/* --- Back Button --- */}
                <div className="flex justify-start mb-4">
                    <button onClick={() => navigate(-1)} className="group flex items-center gap-2 px-4 py-2 bg-white border border-orange-100 text-slate-800 rounded-lg hover:bg-orange-50 transition-all shadow-sm font-bold text-xs active:scale-95">
                        <i className="bi bi-arrow-left text-[#ff6924]"></i> Back
                    </button>
                </div>

                {/* --- NYC Professional Header --- */}
                <div className="w-full bg-gradient-to-r from-[#ff6924] to-[#e65100] rounded-t-[2rem] p-8 md:p-10 text-center shadow-lg border-b border-white/10">
                    <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight uppercase italic">
                        Operator Observance <span className="text-orange-200">Check Sheet</span>
                    </h1>
                    <p className="text-orange-100 text-[10px] md:text-xs font-bold mt-2 tracking-[0.3em] uppercase opacity-90">
                        AtomOne Quality Systems | Doc No: AOT-F-TR-07
                    </p>
                </div>

                {/* --- Main Form Card --- */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-b-[2rem] shadow-2xl border-x border-b border-orange-50 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-4 md:p-10 space-y-10">
                        
                        {/* 1. Header Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-orange-50/50 rounded-3xl border border-orange-100 shadow-inner">
                            <InputField label="Operator Name" placeholder="Full name..." />
                            <InputField label="Model" placeholder="M/C Model" />
                            <InputField label="Part / Operation" placeholder="Details..." />
                            <InputField label="Date" type="date" />
                        </div>

                        {/* 2. Responsive Table with Add Row */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1.5 h-4 bg-[#ff6924]"></div> Check Points Evaluation
                                </h3>
                                <button type="button" onClick={addRow} className="px-4 py-2 bg-orange-100 text-[#ff6924] rounded-xl font-bold text-[10px] uppercase hover:bg-orange-200 transition-all shadow-sm">
                                    <i className="bi bi-plus-circle-fill mr-1"></i> Add Custom Point
                                </button>
                            </div>

                            <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-sm">
                                <table className="w-full text-left border-collapse min-w-[1000px]">
                                    <thead className="bg-[#1e293b] text-white text-[10px] uppercase tracking-wider">
                                        <tr>
                                            <th className="p-4 w-16 text-center">S.No</th>
                                            <th className="p-4 w-[400px]">Evaluation Criteria</th>
                                            <th className="p-4 text-center w-32">Yes / No</th>
                                            <th className="p-4 text-center w-32">Training</th>
                                            <th className="p-4 text-center w-40">Effectiveness</th>
                                            <th className="p-4">Remarks</th>
                                            <th className="p-4 w-12"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <AnimatePresence initial={false}>
                                            {formData.map((row, idx) => (
                                                <motion.tr key={row.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-orange-50/40 transition-colors">
                                                    <td className="p-4 text-center font-black text-slate-900 text-xs">#{idx + 1}</td>
                                                    <td className="p-2">
                                                        {row.isCustom ? (
                                                            <input 
                                                                type="text" 
                                                                placeholder="Enter custom check point..." 
                                                                className="w-full p-2 bg-white border border-orange-200 rounded-lg text-xs font-bold text-[#ff6924] outline-none"
                                                                onChange={(e) => handleTaskChange(row.id, e.target.value)}
                                                            />
                                                        ) : (
                                                            <span className="text-xs font-bold text-slate-700 block p-2">{row.task}</span>
                                                        )}
                                                    </td>
                                                    <td className="p-2 text-center">
                                                        <select className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] font-black uppercase outline-none focus:border-[#ff6924] cursor-pointer">
                                                            <option value="">-</option>
                                                            <option value="yes">Yes</option>
                                                            <option value="no">No</option>
                                                        </select>
                                                    </td>
                                                    <td className="p-2 text-center">
                                                        <input type="checkbox" className="w-4 h-4 accent-[#ff6924] cursor-pointer" />
                                                    </td>
                                                    <td className="p-2 text-center">
                                                        <select className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[10px] font-black uppercase outline-none focus:border-[#ff6924] cursor-pointer">
                                                            <option value="">-</option>
                                                            <option value="100">High (100%)</option>
                                                            <option value="50">Medium (50%)</option>
                                                            <option value="low">Low</option>
                                                        </select>
                                                    </td>
                                                    <td className="p-2">
                                                        <input type="text" placeholder="Notes..." className="w-full bg-transparent border-b border-slate-100 focus:border-[#ff6924] outline-none text-xs p-1 italic" />
                                                    </td>
                                                    <td className="p-2 text-center">
                                                        {row.isCustom && (
                                                            <button type="button" onClick={() => removeRow(row.id)} className="text-red-300 hover:text-red-500 transition-colors">
                                                                <i className="bi bi-trash-fill"></i>
                                                            </button>
                                                        )}
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                       

                        {/* 4. Small Professional Button */}
                        <div className="flex justify-center md:justify-end pt-2 pb-2">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={`px-12 py-3.5 bg-gradient-to-r from-[#ff6924] to-[#e65100] text-white rounded-xl font-black text-[11px] tracking-[0.2em] shadow-xl hover:scale-105 active:scale-[0.95] transition-all ${isSubmitting ? 'opacity-50' : ''}`}
                            >
                                {isSubmitting ? 'SAVING...' : 'FINALIZE CHECK SHEET'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

const InputField = ({ label, type = "text", placeholder, defaultValue }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">{label}</label>
        <input type={type} placeholder={placeholder} defaultValue={defaultValue} className="w-full p-3 bg-white border border-slate-200 focus:border-[#ff6924] rounded-xl outline-none transition-all font-bold text-xs text-slate-700 shadow-sm" />
    </div>
);

export default OperatorObservanceCheckSheet;