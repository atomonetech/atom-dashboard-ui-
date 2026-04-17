import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MSAReport = () => {
    const navigate = useNavigate();
    
    // 🔥 Force Reset Key: Ensures fresh fields on every visit
    const [formKey, setFormKey] = useState(Date.now());

    const initialFormState = {
        gaugeName: 'MM01',
        gaugeRange: '0-25',
        gaugeLCount: '0.01',
        partInfo: '547663208281 E.5 REINFORCEMENT A-PILLAR MIDDLE-MSA',
        specification: '1.5MM',
        performedBy: 'NIKHIL',
        operator: 'LILA',
        trialData: {
            trial1: '', trial2: '', trial3: ''
        },
        remarks: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    // Reset fields on visit
    useEffect(() => {
        handleReset();
    }, []);

    const handleReset = () => {
        setFormData(initialFormState);
        setFormKey(Date.now());
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("MSA Data Submitted:", formData);
        alert('✅ MSA Report Submitted Successfully!');
        handleReset();
    };

    return (
        <div className="min-h-screen bg-[#f5f3ff] text-slate-700 font-sans pb-20">
            {/* Light Purple Gradient Header */}
            <div className="bg-gradient-to-r from-[#ddd6fe] to-[#ede9fe] pt-12 pb-24 px-6 border-b border-[#c4b5fd] shadow-sm">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-[#5b21b6] uppercase tracking-tight">
                            MSA Reporting System
                        </h1>
                        <p className="text-[#7c3aed] text-xs font-bold tracking-widest uppercase mt-1">
                            Gauge Repeatability & Reproducibility [F/QA/14/00]
                        </p>
                    </div>
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-fit px-6 py-2 bg-white border border-[#c4b5fd] rounded-xl text-[#7c3aed] font-bold text-xs hover:bg-[#f5f3ff] transition-all shadow-sm"
                    >
                        <i className="bi bi-arrow-left mr-2"></i> EXIT FORM
                    </button>
                </div>
            </div>

            <div key={formKey} className="max-w-5xl mx-auto px-4 -mt-12">
                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* Section 1: Gauge & Part Details */}
                    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-[#ddd6fe]">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="w-1.5 h-6 bg-[#a78bfa] rounded-full"></span>
                            <h3 className="text-slate-800 font-black text-sm uppercase tracking-widest">Equipment & Part Info</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Gauge Name</label>
                                <input className="w-full px-4 py-3 bg-[#f5f3ff] border border-[#ddd6fe] rounded-xl font-semibold text-[#5b21b6]" 
                                value={formData.gaugeName} readOnly />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Gauge Range</label>
                                <input className="w-full px-4 py-3 bg-[#f5f3ff] border border-[#ddd6fe] rounded-xl font-semibold text-[#5b21b6]" 
                                value={formData.gaugeRange} readOnly />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Least Count</label>
                                <input className="w-full px-4 py-3 bg-[#f5f3ff] border border-[#ddd6fe] rounded-xl font-semibold text-[#5b21b6]" 
                                value={formData.gaugeLCount} readOnly />
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Part No. & Name</label>
                                <input className="w-full px-4 py-3 bg-[#f5f3ff] border border-[#ddd6fe] rounded-xl font-semibold text-[#5b21b6]" 
                                value={formData.partInfo} readOnly />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Performed By</label>
                                <input required className="w-full px-4 py-3 bg-white border border-[#ddd6fe] rounded-xl focus:border-[#a78bfa] outline-none font-semibold text-slate-700 shadow-sm" 
                                value={formData.performedBy} onChange={(e) => handleChange('performedBy', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Measurement Analysis */}
                    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-[#ddd6fe]">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="w-1.5 h-6 bg-[#a78bfa] rounded-full"></span>
                            <h3 className="text-slate-800 font-black text-sm uppercase tracking-widest">Trial Data Entry</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[
                                { label: 'Trial 1 (KI)', key: 'trial1' },
                                { label: 'Trial 2 (K2)', key: 'trial2' },
                                { label: 'Trial 3 (K3)', key: 'trial3' },
                            ].map((field) => (
                                <div key={field.key} className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-[#7c3aed] uppercase tracking-tight ml-1">{field.label}</label>
                                    <input 
                                        type="number"
                                        step="0.001"
                                        required 
                                        className="w-full px-4 py-3 bg-[#faf5ff] border border-[#ddd6fe] rounded-xl focus:border-[#a78bfa] focus:bg-white outline-none font-black text-[#5b21b6] transition-all shadow-sm" 
                                        value={formData.trialData[field.key]} 
                                        onChange={(e) => handleChange('trialData', { ...formData.trialData, [field.key]: e.target.value })} 
                                        placeholder="0.000"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 space-y-2">
                            <label className="text-[11px] font-bold text-slate-700 uppercase ml-1">Technical Remarks</label>
                            <textarea rows="3" className="w-full px-5 py-4 bg-[#faf5ff] border border-[#ddd6fe] rounded-2xl focus:border-[#a78bfa] focus:bg-white outline-none text-sm font-medium resize-none shadow-inner" 
                            value={formData.remarks} onChange={(e) => handleChange('remarks', e.target.value)} placeholder="Enter variation observations..." />
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="bg-[#ede9fe]/90 backdrop-blur-md sticky bottom-6 rounded-2xl border border-[#c4b5fd] shadow-lg p-4 flex items-center justify-between">
                        <button 
                            type="button" 
                            onClick={handleReset} 
                            className="px-6 py-2 text-[#7c3aed] font-bold text-xs uppercase hover:text-[#5b21b6] transition-all"
                        >
                            Reset Fields
                        </button>
                        <button 
                            type="submit" 
                            className="px-10 py-3 bg-[#7c3aed] text-white rounded-xl font-black uppercase text-[11px] tracking-widest shadow-md hover:bg-[#6d28d9] active:scale-95 transition-all"
                        >
                            Submit MSA Data
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MSAReport;