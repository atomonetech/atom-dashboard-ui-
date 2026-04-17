import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SamplingPlan = () => {
    const navigate = useNavigate();

    const initialFormState = {
        partName: '',
        lotSize: '',
        inspectionLevel: 'A2', // A1: Tightened, A2: Normal
        samplingQty: '-',
        acceptanceNo: '0',
        rejectionNo: '1',
        remarks: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    // 🔥 Auto-calculate Sample Size based on the Image Table
    useEffect(() => {
        const lot = parseInt(formData.lotSize);
        const level = formData.inspectionLevel;

        if (!lot || lot <= 0) {
            setFormData(prev => ({ ...prev, samplingQty: '-' }));
            return;
        }

        let qty = '';

        if (lot >= 2 && lot <= 25) {
            qty = level === 'A1' ? '100% INSP' : '2 PCS';
        } else if (lot >= 26 && lot <= 150) {
            qty = level === 'A1' ? '5 PCS' : '3 PCS';
        } else if (lot >= 151 && lot <= 1200) {
            qty = level === 'A1' ? '8 PCS' : '5 PCS';
        } else if (lot >= 1201) {
            qty = level === 'A1' ? '10 PCS' : '8 PCS';
        } else {
            qty = 'All Parts'; // For lot < 2
        }

        setFormData(prev => ({ ...prev, samplingQty: qty }));
    }, [formData.lotSize, formData.inspectionLevel]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setFormData(initialFormState);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Plan Saved! Sample Size for Lot ${formData.lotSize} is ${formData.samplingQty}`);
        resetForm();
    };

    return (
        <div className="min-h-screen bg-[#f0f7ff] text-slate-700 font-sans pb-32 md:pb-12">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#1d4ed8] via-[#3b82f6] to-[#60a5fa] pt-10 pb-32 px-4 md:px-6 shadow-lg">
                <div className="max-w-6xl mx-auto flex items-center gap-4 text-white">
                    <button onClick={() => navigate('/qa-hub/yearly')} className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-2xl border border-white/20 backdrop-blur-md">
                        <i className="bi bi-chevron-left text-xl"></i>
                    </button>
                    <div>
                        <h1 className="text-xl md:text-3xl font-black uppercase tracking-tight">Sampling Plan (Parts)</h1>
                        <p className="text-blue-100 text-[10px] md:text-xs font-bold tracking-widest uppercase opacity-80">AOT-F-SQ-04 | Logic Integrated</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-20">
                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    <div className="bg-white rounded-[2rem] shadow-2xl p-6 md:p-10 border border-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            
                            {/* Part Name */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-700 uppercase ml-1">Part Name / No.</label>
                                <input required className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#3b82f6] outline-none text-sm font-semibold" 
                                value={formData.partName} onChange={(e) => handleChange('partName', e.target.value)} placeholder="e.g. Outlet Pipe" />
                            </div>

                            {/* Lot Size Input */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-700 uppercase ml-1">Current Lot Size</label>
                                <input required type="number" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#3b82f6] outline-none text-sm font-bold" 
                                value={formData.lotSize} onChange={(e) => handleChange('lotSize', e.target.value)} placeholder="Enter Lot Qty" />
                            </div>

                            {/* Inspection Level Dropdown */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-700 uppercase ml-1">Inspection Plan</label>
                                <select className="w-full px-5 py-3.5 bg-blue-50 border-2 border-blue-100 rounded-2xl focus:border-[#3b82f6] outline-none font-black text-sm text-[#3b82f6]" 
                                value={formData.inspectionLevel} onChange={(e) => handleChange('inspectionLevel', e.target.value)}>
                                    <option value="A2">A2: Normal Inspection</option>
                                    <option value="A1">A1: Tightened Inspection</option>
                                </select>
                            </div>

                            {/* 🔥 Calculated Sample Qty (Read Only) */}
                            <div className="space-y-1.5 bg-blue-600 p-6 rounded-[1.5rem] shadow-lg shadow-blue-200 lg:col-span-1">
                                <label className="text-[10px] font-black text-blue-100 uppercase tracking-widest text-center block mb-2">Required Sample Size</label>
                                <div className="text-white text-2xl font-black text-center uppercase tracking-tighter">
                                    {formData.samplingQty}
                                </div>
                            </div>

                            {/* Ae / Re Display */}
                            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 lg:col-span-2">
                                <div className="text-center border-r border-slate-200">
                                    <label className="text-[10px] font-black text-emerald-600 uppercase">Accept (Ae)</label>
                                    <div className="text-3xl font-black text-emerald-500 mt-1">{formData.acceptanceNo}</div>
                                </div>
                                <div className="text-center">
                                    <label className="text-[10px] font-black text-rose-600 uppercase">Reject (Re)</label>
                                    <div className="text-3xl font-black text-rose-500 mt-1">{formData.rejectionNo}</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="text-[11px] text-slate-500 font-medium space-y-1">
                                <p className="font-bold text-slate-700 mb-2 underline">SYSTEM NOTES:</p>
                                <p>• If Qty &lt; 5 pcs, all parts must be checked.</p>
                                <p>• Charts based on IS 2500 (Part I) : 1992.</p>
                            </div>
                            <textarea rows="2" className="w-full px-5 py-3 bg-white border-2 border-slate-100 rounded-2xl focus:border-[#3b82f6] outline-none text-sm resize-none" 
                            value={formData.remarks} onChange={(e) => handleChange('remarks', e.target.value)} placeholder="Specific remarks..." />
                        </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="bg-white/90 backdrop-blur-xl fixed md:sticky bottom-0 md:bottom-6 left-0 right-0 md:rounded-3xl border-t md:border border-slate-200 shadow-2xl p-4 z-50 flex items-center justify-between px-6">
                        <button type="button" onClick={() => navigate('/qa-hub/yearly')} className="text-slate-400 font-bold hover:text-red-500 transition-all text-xs uppercase tracking-widest">
                            <i className="bi bi-x-circle text-lg mr-2"></i>Exit
                        </button>
                        <div className="flex gap-4">
                            <button type="button" onClick={resetForm} className="px-8 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all border border-slate-200">
                                Reset
                            </button>
                            <button type="submit" className="px-12 py-4 bg-[#3b82f6] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-500/20 hover:bg-[#2563eb] active:scale-95 transition-all">
                                Save Plan
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SamplingPlan;