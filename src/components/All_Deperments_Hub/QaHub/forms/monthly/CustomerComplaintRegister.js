import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerComplaintRegister = () => {
    const navigate = useNavigate();

    const initialFormState = {
        date: '',
        partDetails: '',
        model: '',
        customer: '',
        problemDescription: '',
        counterMeasure: '',
        targetDate: '',
        horizontalAction: '',
        status: 'OPEN' // Default status
    };

    const [formData, setFormData] = useState(initialFormState);

    // Auto-fill Current Date on load
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setFormData(prev => ({ ...prev, date: today }));
    }, []);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        if (window.confirm("Are you sure you want to clear the form?")) {
            const today = new Date().toISOString().split('T')[0];
            setFormData({ ...initialFormState, date: today });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Complaint Data Submitted:", formData);
        alert('Complaint Recorded Successfully!');
        const today = new Date().toISOString().split('T')[0];
        setFormData({ ...initialFormState, date: today });
    };

    return (
        <div className="min-h-screen bg-[#fffafa] text-slate-700 font-sans pb-24 md:pb-12">
            {/* Professional Red Header Section */}
            <div className="bg-gradient-to-br from-[#991b1b] via-[#ef4444] to-[#f87171] pt-12 pb-28 px-4 md:px-6">
                <div className="max-w-5xl mx-auto flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/qa-hub/monthly')}
                        className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-2xl text-white transition-all backdrop-blur-md border border-white/20 shadow-lg"
                    >
                        <i className="bi bi-chevron-left text-xl"></i>
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase leading-tight">Customer Complaint Register</h1>
                        <p className="text-red-100 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase opacity-90">Defect Tracking & Counter Measures</p>
                    </div>
                </div>
            </div>

            {/* Form Container */}
            <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-16 md:-mt-20">
                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                    
                    {/* Main Entry Card */}
                    <div className="bg-white rounded-3xl shadow-2xl shadow-red-900/5 p-6 md:p-10 border border-white">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#ef4444] uppercase tracking-widest ml-1">Complaint Date</label>
                                <input required type="date" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#ef4444] focus:bg-white outline-none transition-all font-semibold text-sm shadow-sm" 
                                value={formData.date} onChange={(e) => handleChange('date', e.target.value)} />
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-[10px] font-black text-[#ef4444] uppercase tracking-widest ml-1">Part Name / Part No.</label>
                                <input required className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#ef4444] focus:bg-white outline-none transition-all font-semibold text-sm shadow-sm" 
                                value={formData.partDetails} onChange={(e) => handleChange('partDetails', e.target.value)} placeholder="Enter part identification..." />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#ef4444] uppercase tracking-widest ml-1">Model</label>
                                <input required className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#ef4444] focus:bg-white outline-none transition-all font-semibold text-sm shadow-sm" 
                                value={formData.model} onChange={(e) => handleChange('model', e.target.value)} placeholder="e.g. Model X-200" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#ef4444] uppercase tracking-widest ml-1">Customer Name</label>
                                <input required className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#ef4444] focus:bg-white outline-none transition-all font-semibold text-sm shadow-sm" 
                                value={formData.customer} onChange={(e) => handleChange('customer', e.target.value)} placeholder="e.g. TOPRE" />
                            </div>
                        </div>

                        {/* Textareas for detailed info */}
                        <div className="space-y-6 border-t border-slate-100 pt-8">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Problem Description</label>
                                <textarea rows="3" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#ef4444] focus:bg-white outline-none transition-all font-medium text-sm resize-none shadow-sm" 
                                value={formData.problemDescription} onChange={(e) => handleChange('problemDescription', e.target.value)} placeholder="Describe the quality issue..." />
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Counter Measure</label>
                                <textarea rows="3" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#ef4444] focus:bg-white outline-none transition-all font-medium text-sm resize-none shadow-sm" 
                                value={formData.counterMeasure} onChange={(e) => handleChange('counterMeasure', e.target.value)} placeholder="Corrective actions taken..." />
                            </div>
                        </div>

                        {/* Lower section Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Date</label>
                                <input type="date" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#ef4444] focus:bg-white outline-none transition-all font-semibold text-sm" 
                                value={formData.targetDate} onChange={(e) => handleChange('targetDate', e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Horizontal Action</label>
                                <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#ef4444] focus:bg-white outline-none transition-all text-sm font-semibold" 
                                value={formData.horizontalAction} onChange={(e) => handleChange('horizontalAction', e.target.value)} placeholder="Implementation elsewhere..." />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Complaint Status</label>
                                <select className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#ef4444] focus:bg-white outline-none transition-all font-bold text-sm text-[#ef4444] appearance-none" 
                                value={formData.status} onChange={(e) => handleChange('status', e.target.value)}>
                                    <option value="OPEN">OPEN</option>
                                    <option value="CLOSED">CLOSED</option>
                                    <option value="PENDING">PENDING</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="bg-white/90 backdrop-blur-md fixed md:sticky bottom-0 md:bottom-6 left-0 right-0 md:rounded-3xl border-t md:border border-white shadow-2xl p-4 flex flex-row gap-3 justify-between items-center z-30">
                        <button type="button" onClick={() => navigate('/qa-hub/monthly')} className="flex items-center gap-2 px-6 py-2 text-slate-400 font-bold hover:text-red-500 transition-all text-sm uppercase tracking-widest">
                            <i className="bi bi-x-circle text-lg"></i> <span className="hidden sm:inline">Cancel</span>
                        </button>
                        
                        <div className="flex gap-2 md:gap-4">
                            <button type="button" onClick={resetForm} className="px-6 md:px-8 py-2.5 bg-slate-100 text-slate-600 rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">
                                Reset
                            </button>
                            <button type="submit" className="px-8 md:px-12 py-3 bg-[#ef4444] text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-red-500/30 hover:bg-[#dc2626] active:scale-95 transition-all flex items-center justify-center gap-3">
                                <i className="bi bi-file-earmark-check text-base"></i> Save Complaint
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="h-10"></div>
        </div>
    );
};

export default CustomerComplaintRegister;