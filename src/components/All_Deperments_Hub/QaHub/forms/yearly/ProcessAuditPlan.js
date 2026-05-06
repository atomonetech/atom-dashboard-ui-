import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProcessAuditPlan = () => {
    const navigate = useNavigate();
    
    // 🔥 Force Reset Key - Puray form ko reset karne ke liye
    const [formKey, setFormKey] = useState(Date.now());

    // Financial Year Options (Dropdown ke liye)
    const getFYOptions = () => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        let startYear = currentMonth >= 3 ? currentYear : currentYear - 1;
        const monthNames = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
        
        return monthNames.map((m, index) => {
            const year = index > 8 ? startYear + 1 : startYear;
            return `${m}-${year}`;
        });
    };

    const fyOptions = getFYOptions();

    const initialFormState = {
        processName: '',
        auditMonth: '', 
        auditStatus: 'PLAN', // PLAN, COMPLETED, POSTPONE
        remarks: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    // 🔥 Auto-select Current Month on load
    useEffect(() => {
        const now = new Date();
        const currentMonthShort = now.toLocaleString('default', { month: 'short' });
        const currentYear = now.getFullYear();
        setFormData(prev => ({ ...prev, auditMonth: `${currentMonthShort}-${currentYear}` }));
    }, [formKey]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleForceReset = () => {
        setFormKey(Date.now());
        setFormData(initialFormState);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Process Audit Data:", formData);
        alert(`✅ Process Audit Plan for ${formData.processName} saved successfully!`);
        handleForceReset();
    };

    return (
        <div className="min-h-screen bg-[#f5f3ff] text-slate-700 font-sans pb-32">
            
            {/* 🔥 Professional Violet Gradient Header */}
            <div className="bg-gradient-to-br from-[#7c3aed] via-[#8b5cf6] to-[#a78bfa] pt-12 pb-32 px-6 shadow-2xl">
                <div className="max-w-4xl mx-auto flex items-center gap-6">
                    <button 
                        onClick={() => navigate('/qa-hub/yearly')} 
                        className="w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-2xl transition-all border border-white/10 backdrop-blur-md shadow-lg"
                    >
                        <i className="bi bi-chevron-left text-xl text-white"></i>
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
                            Process Audit Plan
                        </h1>
                        <p className="text-violet-100 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mt-2 opacity-80">
                            AOT-F-QA-27 | Annual Process Schedule
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Body Container */}
            <div key={formKey} className="max-w-4xl mx-auto px-4 -mt-20">
                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* Main Entry Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-violet-50">
                        <div className="flex items-center gap-3 mb-10">
                            <span className="w-2.5 h-8 bg-[#8b5cf6] rounded-full"></span>
                            <h3 className="text-slate-800 font-black text-sm uppercase tracking-widest">Audit Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                            
                            {/* Process Name Input */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1">Process Name</label>
                                <input 
                                    required 
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all font-semibold text-slate-800 shadow-sm" 
                                    value={formData.processName} 
                                    onChange={(e) => handleChange('processName', e.target.value)} 
                                    placeholder="e.g. Stamping(AOT), Welding" 
                                />
                            </div>

                            {/* Month & Year Dropdown */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1">Audit Month & Year</label>
                                <select 
                                    className="w-full px-5 py-4 bg-violet-50 border-2 border-violet-100 rounded-2xl focus:border-[#8b5cf6] outline-none font-bold text-[#8b5cf6] cursor-pointer shadow-sm appearance-none"
                                    value={formData.auditMonth}
                                    onChange={(e) => handleChange('auditMonth', e.target.value)}
                                >
                                    {fyOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>

                            {/* Status Selector (Based on Image Legend) */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1">Current Status</label>
                                <div className="flex flex-wrap gap-3">
                                    {[
                                        { id: 'PLAN', icon: 'bi-arrow-right', label: 'Plan' },
                                        { id: 'COMPLETED', icon: 'bi-arrow-right-square-fill', label: 'Completed' },
                                        { id: 'POSTPONE', icon: 'bi-arrow-repeat', label: 'Postpone' }
                                    ].map(status => (
                                        <button 
                                            key={status.id}
                                            type="button"
                                            onClick={() => handleChange('auditStatus', status.id)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all font-bold text-[10px] ${
                                                formData.auditStatus === status.id 
                                                ? 'bg-[#8b5cf6] border-[#8b5cf6] text-white shadow-lg' 
                                                : 'bg-white border-slate-100 text-slate-400 hover:border-violet-200'
                                            }`}
                                        >
                                            <i className={status.icon}></i> {status.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Remarks Column */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1">Audit Remarks</label>
                                <textarea 
                                    rows="2" 
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none text-sm font-medium resize-none shadow-inner" 
                                    value={formData.remarks} 
                                    onChange={(e) => handleChange('remarks', e.target.value)} 
                                    placeholder="Add any audit notes here..." 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Attractive Sticky Action Bar */}
                    <div className="bg-white/90 backdrop-blur-xl sticky bottom-6 rounded-3xl border border-slate-200 shadow-2xl p-4 flex items-center justify-between mx-2">
                        <button 
                            type="button" 
                            onClick={() => navigate('/qa-hub/yearly')} 
                            className="px-6 py-2 text-slate-400 font-black text-xs uppercase hover:text-red-500 transition-all"
                        >
                             <i className="bi bi-x-circle mr-2"></i> Cancel
                        </button>
                        <div className="flex gap-4">
                            <button 
                                type="button" 
                                onClick={handleForceReset} 
                                className="px-8 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all"
                            >
                                Reset
                            </button>
                            <button 
                                type="submit" 
                                className="px-12 py-4 bg-[#8b5cf6] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-violet-200 hover:bg-[#7c3aed] active:scale-95 transition-all flex items-center gap-2"
                            >
                                <i className="bi bi-check-circle-fill"></i> Save Process Plan
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProcessAuditPlan;