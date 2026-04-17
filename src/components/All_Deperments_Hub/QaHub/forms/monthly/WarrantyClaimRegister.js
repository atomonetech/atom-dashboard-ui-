import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WarrantyClaimRegister = () => {
    const navigate = useNavigate();

    const initialFormState = {
        date: '',
        customerName: '',
        partDetails: '',
        claimQty: '',
        warrantyDefect: '',
        decision: 'PENDING',
        rejectionRootCause: '',
        capaAnalysis: '',
        disposalAction: '',
        verifiedBy: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    // Auto-fill Current Date
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setFormData(prev => ({ ...prev, date: today }));
    }, []);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        if (window.confirm("Are you sure you want to clear the register form?")) {
            const today = new Date().toISOString().split('T')[0];
            setFormData({ ...initialFormState, date: today });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Warranty Claim Recorded Successfully!');
        const today = new Date().toISOString().split('T')[0];
        setFormData({ ...initialFormState, date: today });
    };

    return (
        <div className="min-h-screen bg-[#f0fdf4] text-slate-700 font-sans pb-32 md:pb-12">
            {/* Professional Emerald Header */}
            <div className="bg-gradient-to-br from-[#065f46] via-[#10b981] to-[#34d399] pt-10 md:pt-12 pb-24 md:pb-32 px-4 md:px-6">
                <div className="max-w-6xl mx-auto flex items-center gap-4 text-white">
                    <button 
                        onClick={() => navigate('/qa-hub/monthly')}
                        className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-xl transition-all backdrop-blur-md border border-white/20 shadow-lg"
                    >
                        <i className="bi bi-chevron-left text-xl"></i>
                    </button>
                    <div>
                        <h1 className="text-xl md:text-3xl font-black uppercase tracking-tight leading-tight">Warranty Register</h1>
                        <p className="text-emerald-100 text-[10px] md:text-xs font-bold tracking-widest uppercase opacity-90">AOT/F/QA/22 | Quality Assurance</p>
                    </div>
                </div>
            </div>

            {/* Main Form Body */}
            <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-16 md:-mt-24">
                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                    
                    {/* Basic Info Card */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 p-6 md:p-10 border border-white">
                        <h3 className="text-[#10b981] font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-[#10b981] rounded-full"></span> Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400">Claim Date</label>
                                <input required type="date" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#10b981] focus:bg-white outline-none transition-all font-semibold text-sm" 
                                value={formData.date} onChange={(e) => handleChange('date', e.target.value)} />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-[10px] font-bold uppercase text-slate-400">Customer Name</label>
                                <input required className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#10b981] focus:bg-white outline-none transition-all font-semibold text-sm" 
                                value={formData.customerName} onChange={(e) => handleChange('customerName', e.target.value)} placeholder="Customer Details" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400">Claim Qty</label>
                                <input required type="number" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#10b981] focus:bg-white outline-none transition-all font-semibold text-sm" 
                                value={formData.claimQty} onChange={(e) => handleChange('claimQty', e.target.value)} placeholder="0" />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-[10px] font-bold uppercase text-slate-400">Part Details</label>
                                <input required className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#10b981] focus:bg-white outline-none transition-all font-semibold text-sm" 
                                value={formData.partDetails} onChange={(e) => handleChange('partDetails', e.target.value)} placeholder="Part Name / Number" />
                            </div>
                        </div>
                    </div>

                    {/* Analysis Section */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 p-6 md:p-10 border border-white">
                        <h3 className="text-[#10b981] font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-[#10b981] rounded-full"></span> Analysis & Decision
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Warranty Status</label>
                                    <select className="w-full px-4 py-3 bg-emerald-50 border-2 border-emerald-100 rounded-2xl focus:border-[#10b981] outline-none transition-all font-bold text-sm text-emerald-600" 
                                    value={formData.decision} onChange={(e) => handleChange('decision', e.target.value)}>
                                        <option value="PENDING">PENDING</option>
                                        <option value="ACCEPTED">ACCEPTED</option>
                                        <option value="REJECTED">REJECTED</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Root Cause</label>
                                    <textarea rows="3" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#10b981] focus:bg-white outline-none transition-all text-sm resize-none shadow-sm" 
                                    value={formData.rejectionRootCause} onChange={(e) => handleChange('rejectionRootCause', e.target.value)} placeholder="Explain cause..." />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">Disposal Action</label>
                                    <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#10b981] outline-none transition-all text-sm font-semibold" 
                                    value={formData.disposalAction} onChange={(e) => handleChange('disposalAction', e.target.value)} placeholder="Replacement / Scrap" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400">CA / PA Analysis</label>
                                    <textarea rows="3" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#10b981] focus:bg-white outline-none transition-all text-sm resize-none shadow-sm" 
                                    value={formData.capaAnalysis} onChange={(e) => handleChange('capaAnalysis', e.target.value)} placeholder="Action details..." />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 🔥 IMPROVED RESPONSIVE BOTTOM BAR 🔥 */}
                    <div className="bg-white/90 backdrop-blur-md fixed md:sticky bottom-0 md:bottom-6 left-0 right-0 md:rounded-3xl border-t md:border border-slate-200 shadow-2xl p-3 md:p-4 z-40">
                        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
                            
                            {/* Exit Icon Button */}
                            <button 
                                type="button" 
                                onClick={() => navigate('/qa-hub/monthly')} 
                                className="flex items-center justify-center p-2.5 text-slate-400 hover:text-red-500 transition-all rounded-xl hover:bg-red-50"
                                title="Exit"
                            >
                                <i className="bi bi-x-circle text-2xl md:text-xl"></i>
                                <span className="hidden sm:inline ml-2 font-bold text-xs uppercase tracking-widest">Exit</span>
                            </button>
                            
                            <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
                                {/* Reset Button - Compact on Mobile */}
                                <button 
                                    type="button" 
                                    onClick={resetForm} 
                                    className="px-4 py-2.5 md:px-10 md:py-3 bg-slate-100 text-slate-600 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-slate-200 transition-all border border-slate-200"
                                >
                                    Reset
                                </button>

                                {/* Submit Button - High Priority */}
                                <button 
                                    type="submit" 
                                    className="flex-1 md:flex-none px-6 py-2.5 md:px-14 md:py-3 bg-[#10b981] text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-xs tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-[#059669] active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <i className="bi bi-shield-check text-base"></i>
                                    <span>Submit <span className="hidden sm:inline">Claim</span></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WarrantyClaimRegister;