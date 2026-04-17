import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LayoutInspectionReport = () => {
    const navigate = useNavigate();

    const initialFormState = {
        partName: '',
        partNo: '',
        model: '',
        customer: '',
        date: '',
        sampleSize: '',
        parameters: '',
        specNominal: '',
        tolerance: '',
        inspectionMethod: '',
        sample1: '',
        sample2: '',
        sample3: '',
        sample4: '',
        sample5: '',
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
        if (window.confirm("Are you sure you want to clear the form?")) {
            const today = new Date().toISOString().split('T')[0];
            setFormData({ ...initialFormState, date: today });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting Layout Data:", formData);
        alert('Layout Inspection Report Submitted Successfully!');
        const today = new Date().toISOString().split('T')[0];
        setFormData({ ...initialFormState, date: today });
    };

    return (
        <div className="min-h-screen bg-[#fcfcfc] text-slate-700 font-sans pb-24 md:pb-12">
            {/* Responsive Header Section */}
            <div className="bg-gradient-to-br from-[#b47804] to-[#f59f0a] pt-10 md:pt-12 pb-24 md:pb-32 px-4 md:px-6">
                <div className="max-w-6xl mx-auto flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/qa-hub/monthly')}
                        className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-xl text-white transition-all backdrop-blur-md border border-white/20 shadow-lg"
                    >
                        <i className="bi bi-arrow-left"></i>
                    </button>
                    <div>
                        <h1 className="text-xl md:text-3xl font-black text-white uppercase tracking-tight leading-tight">Layout Inspection</h1>
                        <p className="text-orange-100 text-[10px] md:text-xs font-bold tracking-widest uppercase opacity-90">AOT-F-QA-06A | Quality Control</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-16 md:-mt-20">
                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                    
                    {/* 1. Header Details Section - Responsive Grid */}
                    <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-orange-900/5 p-5 md:p-8 border border-white">
                        <h3 className="text-[#f59f0a] font-black text-[11px] md:text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-[#f59f0a] rounded-full"></span> General Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                            {[
                                { label: 'Part Name', key: 'partName', type: 'text', placeholder: 'Part Name' },
                                { label: 'Part Number', key: 'partNo', type: 'text', placeholder: 'Part No' },
                                { label: 'Date', key: 'date', type: 'date' },
                                { label: 'Model', key: 'model', type: 'text', placeholder: 'Model' },
                                { label: 'Customer', key: 'customer', type: 'text', placeholder: 'Customer Name' },
                                { label: 'Sample Size', key: 'sampleSize', type: 'text', placeholder: 'Qty' }
                            ].map((field) => (
                                <div key={field.key} className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">{field.label}</label>
                                    <input 
                                        required 
                                        type={field.type}
                                        className="w-full px-4 py-2.5 md:py-3 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-[#f59f0a] focus:bg-white outline-none transition-all font-semibold text-sm" 
                                        value={formData[field.key]} 
                                        onChange={(e) => handleChange(field.key, e.target.value)} 
                                        placeholder={field.placeholder} 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. Inspection Parameter Section */}
                    <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-orange-900/5 p-5 md:p-8 border border-white">
                        <h3 className="text-[#f59f0a] font-black text-[11px] md:text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-[#f59f0a] rounded-full"></span> Inspection Parameters
                        </h3>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Parameters</label>
                                <textarea rows="2" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-[#f59f0a] focus:bg-white outline-none transition-all font-medium resize-none text-sm" 
                                value={formData.parameters} onChange={(e) => handleChange('parameters', e.target.value)} placeholder="Dimension/Feature description..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Spec (Nominal)</label>
                                    <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-[#f59f0a] focus:bg-white outline-none transition-all text-sm font-semibold" 
                                    value={formData.specNominal} onChange={(e) => handleChange('specNominal', e.target.value)} placeholder="Value" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Tolerance</label>
                                    <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-[#f59f0a] focus:bg-white outline-none transition-all text-sm font-semibold" 
                                    value={formData.tolerance} onChange={(e) => handleChange('tolerance', e.target.value)} placeholder="± Value" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1 mb-8">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Inspection Method</label>
                            <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-[#f59f0a] focus:bg-white outline-none transition-all text-sm font-semibold" 
                            value={formData.inspectionMethod} onChange={(e) => handleChange('inspectionMethod', e.target.value)} placeholder="Vernier / Micrometer / CMM etc." />
                        </div>

                        {/* Observations Section - Grid based responsiveness */}
                        <div className="bg-slate-50/50 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Actual Observations (5 Samples)</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <div key={num} className="space-y-1">
                                        <label className="text-[9px] font-bold uppercase text-slate-400 text-center block">Sample {num}</label>
                                        <input className="w-full px-3 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-[#f59f0a] outline-none text-sm text-center font-bold shadow-sm" 
                                        value={formData[`sample${num}`]} onChange={(e) => handleChange(`sample${num}`, e.target.value)} placeholder="0.00" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 space-y-1">
                            <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest ml-1">Remarks</label>
                            <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl md:rounded-2xl focus:border-[#f59f0a] focus:bg-white outline-none transition-all text-sm font-black text-orange-600 shadow-sm" 
                            value={formData.remarks} onChange={(e) => handleChange('remarks', e.target.value)} placeholder="OK / NOT OK" />
                        </div>
                    </div>

                    {/* Fixed/Sticky Bottom Action Bar for all screens */}
                    <div className="bg-white/90 backdrop-blur-md fixed md:sticky bottom-0 md:bottom-6 left-0 right-0 md:rounded-3xl border-t md:border border-white shadow-2xl p-4 flex flex-row gap-3 justify-between items-center z-30">
                        <button 
                            type="button" 
                            onClick={() => navigate('/qa-hub/monthly')} 
                            className="flex items-center gap-2 px-4 md:px-6 py-2 text-slate-400 font-bold hover:text-red-500 transition-all text-sm"
                        >
                            <i className="bi bi-x-circle text-lg"></i> <span className="hidden sm:inline">Exit</span>
                        </button>
                        
                        <div className="flex gap-2 md:gap-4">
                            <button 
                                type="button" 
                                onClick={resetForm} 
                                className="px-4 md:px-8 py-2.5 bg-slate-100 text-slate-600 rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all"
                            >
                                Reset
                            </button>
                            <button 
                                type="submit" 
                                className="px-6 md:px-12 py-3 bg-[#f59f0a] text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-orange-500/30 hover:bg-[#d98b04] active:scale-95 transition-all flex items-center gap-2"
                            >
                                <i className="bi bi-cloud-check text-base"></i> Submit <span className="hidden sm:inline">Inspection</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LayoutInspectionReport;