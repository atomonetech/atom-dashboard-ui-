import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CoherenceChecklist = () => {
    const navigate = useNavigate();

    const initialFormState = {
        partName: '',
        partNo: '',
        date: '',
        model: '',
        processName: '',
        machineJig: '',
        pfd: '',
        pfmea: '',
        specOSWI: '',
        specStd: '',
        inspectionFIS: '',
        remarks: ''
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
        if (window.confirm("Clear all fields?")) {
            const today = new Date().toISOString().split('T')[0];
            setFormData({ ...initialFormState, date: today });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Coherence Check Sheet Submitted!');
        const today = new Date().toISOString().split('T')[0];
        setFormData({ ...initialFormState, date: today });
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-700 font-sans pb-12">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-[#065f46] to-[#11ba82] pt-12 pb-32 px-6">
                <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/qa-hub/monthly')}
                            className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-xl text-white transition-all backdrop-blur-md border border-white/20"
                        >
                            <i className="bi bi-arrow-left"></i>
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight text-slate-700">Coherence Entry</h1>
                            <p className="text-emerald-100 text-[10px] font-bold tracking-widest uppercase">AOT-F-QA-03 | Quality Form</p>
                        </div>
                    </div>
                    <div className="hidden md:block bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                         <p className="text-white text-[10px] font-bold uppercase">Rev: 00 | 14.10.2024</p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-20">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* 1. Header Information Section */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 p-8 border border-white">
                        <h3 className="text-[#11ba82] font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-2 h-4 bg-[#11ba82] rounded-full"></span> Header Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400">Part Name</label>
                                <input required className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] focus:bg-white outline-none transition-all font-semibold" 
                                value={formData.partName} onChange={(e) => handleChange('partName', e.target.value)} placeholder="Part Name" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400">Part Number</label>
                                <input required className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] focus:bg-white outline-none transition-all font-semibold" 
                                value={formData.partNo} onChange={(e) => handleChange('partNo', e.target.value)} placeholder="Part No" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400">Audit Date</label>
                                <input required type="date" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] focus:bg-white outline-none transition-all font-semibold" 
                                value={formData.date} onChange={(e) => handleChange('date', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400">Model</label>
                                <input required className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] focus:bg-white outline-none transition-all font-semibold" 
                                value={formData.model} onChange={(e) => handleChange('model', e.target.value)} placeholder="Model" />
                            </div>
                        </div>
                    </div>

                    {/* 2. Coherence Parameters Section (No Repetition) */}
                    <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 p-8 border border-white">
                        <h3 className="text-[#11ba82] font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-2 h-4 bg-[#11ba82] rounded-full"></span> Operation Details
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Process Name / Operation Description</label>
                                <textarea rows="2" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] focus:bg-white outline-none transition-all font-medium resize-none" 
                                value={formData.processName} onChange={(e) => handleChange('processName', e.target.value)} placeholder="Enter process description..." />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Machine / Jig / Fixture</label>
                                <textarea rows="2" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] focus:bg-white outline-none transition-all font-medium resize-none" 
                                value={formData.machineJig} onChange={(e) => handleChange('machineJig', e.target.value)} placeholder="Enter machine details..." />
                            </div>
                        </div>

                        {/* Coherence Points Grid */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">PFD (Coherence)</label>
                                <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] focus:bg-white outline-none transition-all text-sm" 
                                value={formData.pfd} onChange={(e) => handleChange('pfd', e.target.value)} placeholder="..." />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">PFMEA (Coherence)</label>
                                <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] focus:bg-white outline-none transition-all text-sm" 
                                value={formData.pfmea} onChange={(e) => handleChange('pfmea', e.target.value)} placeholder="..." />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Spec as per OS / WI</label>
                                <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] focus:bg-white outline-none transition-all text-sm" 
                                value={formData.specOSWI} onChange={(e) => handleChange('specOSWI', e.target.value)} placeholder="..." />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Spec as per Inspection Standard</label>
                                <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] focus:bg-white outline-none transition-all text-sm" 
                                value={formData.specStd} onChange={(e) => handleChange('specStd', e.target.value)} placeholder="..." />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Inspection as per FIS</label>
                                <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] focus:bg-white outline-none transition-all text-sm" 
                                value={formData.inspectionFIS} onChange={(e) => handleChange('inspectionFIS', e.target.value)} placeholder="..." />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Remarks</label>
                                <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] focus:bg-white outline-none transition-all text-sm font-black text-emerald-600" 
                                value={formData.remarks} onChange={(e) => handleChange('remarks', e.target.value)} placeholder="OK / NOT OK" />
                            </div>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="bg-white/80 backdrop-blur-md sticky bottom-6 rounded-3xl border border-white shadow-2xl p-4 flex justify-between items-center z-30">
                        <button type="button" onClick={() => navigate('/qa-hub/monthly')} className="px-6 py-2 text-slate-400 font-bold hover:text-red-500 transition-all text-sm">
                            <i className="bi bi-x-circle me-2"></i> Exit
                        </button>
                        
                        <div className="flex gap-4">
                            <button type="button" onClick={resetForm} className="px-8 py-2.5 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200">
                                Reset
                            </button>
                            <button type="submit" className="px-12 py-3 bg-[#11ba82] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-green-500/30 hover:bg-[#0e9a6c] transition-all">
                                Submit Record
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CoherenceChecklist;