import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductAuditPlan = () => {
    const navigate = useNavigate();
    const [formKey, setFormKey] = useState(Date.now());

    // 🔥 Generate 12 Months for Financial Year Dropdown
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
        partName: '', partNo: '', model: '',
        auditMonth: '', auditStatus: 'PLAN', remarks: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    // 🔥 Set Current Month as Default
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
        alert(`✅ Audit Plan Saved Successfully for ${formData.auditMonth}`);
        handleForceReset();
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-700 font-sans pb-32">
            
            {/* 🔥 Premium Gradient Header Area */}
            <div className="bg-gradient-to-br from-[#0891b2] via-[#06b6d4] to-[#22d3ee] pt-12 pb-32 px-6 shadow-xl">
                <div className="max-w-4xl mx-auto flex items-center gap-6">
                    <button 
                        onClick={() => navigate('/qa-hub/yearly')} 
                        className="w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-2xl transition-all border border-white/10 backdrop-blur-md shadow-lg"
                    >
                        <i className="bi bi-chevron-left text-xl text-white"></i>
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
                            Product Audit Plan
                        </h1>
                        <p className="text-cyan-50 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mt-2 opacity-80">
                            AOT-F-QA-26 | Annual Schedule
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Body Container */}
            <div key={formKey} className="max-w-4xl mx-auto px-4 -mt-20">
                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* Main Form Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-white/50 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-10">
                            <span className="w-2.5 h-8 bg-[#06b6d4] rounded-full"></span>
                            <h3 className="text-slate-800 font-black text-sm uppercase tracking-widest">Plan Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                            
                            {/* Inputs with Slate-700 Labels */}
                            {[
                                { label: 'Part Name', key: 'partName', placeholder: 'Enter Part Name' },
                                { label: 'Part Number', key: 'partNo', placeholder: 'e.g. 55542-X01' },
                                { label: 'Model', key: 'model', placeholder: 'TED / K12M' }
                            ].map((f) => (
                                <div key={f.key} className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1">{f.label}</label>
                                    <input required className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#06b6d4] focus:bg-white outline-none transition-all font-semibold text-slate-800 shadow-sm" 
                                    value={formData[f.key]} onChange={(e) => handleChange(f.key, e.target.value)} placeholder={f.placeholder} />
                                </div>
                            ))}

                            {/* Dropdowns */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1">Audit Month & Year</label>
                                <select 
                                    className="w-full px-5 py-4 bg-cyan-50 border-2 border-cyan-100 rounded-2xl focus:border-[#06b6d4] outline-none font-bold text-[#06b6d4] cursor-pointer shadow-sm appearance-none"
                                    value={formData.auditMonth}
                                    onChange={(e) => handleChange('auditMonth', e.target.value)}
                                >
                                    {fyOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1">Audit Status</label>
                                <select 
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#06b6d4] outline-none font-bold text-slate-700 shadow-sm"
                                    value={formData.auditStatus}
                                    onChange={(e) => handleChange('auditStatus', e.target.value)}
                                >
                                    <option value="PLAN">PLAN</option>
                                    <option value="DONE">DONE</option>
                                    <option value="POSTPONED">POSTPONED</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-10 space-y-2">
                            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1">Remarks</label>
                            <textarea rows="3" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] focus:border-[#06b6d4] focus:bg-white outline-none text-sm font-medium resize-none shadow-inner" 
                            value={formData.remarks} onChange={(e) => handleChange('remarks', e.target.value)} placeholder="Add audit notes..." />
                        </div>
                    </div>

                    {/* Attractive Sticky Bottom Bar */}
                    <div className="bg-white/90 backdrop-blur-xl sticky bottom-6 rounded-3xl border border-slate-200 shadow-2xl p-4 flex items-center justify-between mx-2">
                        <button type="button" onClick={() => navigate('/qa-hub/yearly')} className="px-6 py-2 text-slate-400 font-black text-xs uppercase hover:text-red-500 transition-all">
                             <i className="bi bi-x-circle mr-2"></i> Cancel
                        </button>
                        <div className="flex gap-4">
                            <button type="button" onClick={handleForceReset} className="px-8 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">
                                Reset
                            </button>
                            <button type="submit" className="px-12 py-4 bg-[#06b6d4] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-cyan-200 hover:bg-[#0891b2] active:scale-95 transition-all flex items-center gap-2">
                                <i className="bi bi-check-circle-fill"></i> Save Audit Plan
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductAuditPlan;