import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BOQualityPlan = () => {
    const navigate = useNavigate();
    
    // Force Reset Key
    const [formKey, setFormKey] = useState(Date.now());

    const initialFormState = {
        partName: '', drawingNo: '', partNo: '', modNo: '', boqpNo: '',
        chemical: { carbon: '', manganese: '', sulphur: '', phosphorus: '' },
        mechanical: { tensile: '', yield: '', elongation: '', hardness: '' },
        parameters: [{ parameter: '', spec: '', method: '', freq: '' }]
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleForceReset = () => {
        setFormKey(Date.now());
        setFormData(initialFormState);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("BOQP Data:", formData);
        alert('✅ Bought Out Quality Plan Saved Successfully!');
        handleForceReset();
    };

    return (
        <div className="min-h-screen bg-[#f0f7ff] text-slate-700 font-sans pb-32">
            
            {/* Blue Gradient Header */}
            <div className="bg-gradient-to-r from-[#1d4ed8] via-[#3b82f6] to-[#60a5fa] pt-12 pb-32 px-6 shadow-lg">
                <div className="max-w-6xl mx-auto flex items-center gap-6 text-white">
                    <button type="button" onClick={() => navigate('/qa-hub/monthly')} className="w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-2xl border border-white/10 backdrop-blur-md transition-all">
                        <i className="bi bi-chevron-left text-xl"></i>
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight">Bought Out Quality Plan</h1>
                        <p className="text-blue-100 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mt-1 opacity-80">AOT/F/QA/23 | Supplier Standard</p>
                    </div>
                </div>
            </div>

            <div key={formKey} className="max-w-6xl mx-auto px-4 md:px-6 -mt-20">
                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* 1. General Info Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-10 border border-blue-50">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="w-2.5 h-7 bg-[#3b82f6] rounded-full"></span>
                            <h3 className="text-slate-800 font-black text-sm uppercase tracking-widest">General Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: 'Part Name', key: 'partName' },
                                { label: 'Drawing No.', key: 'drawingNo' },
                                { label: 'Part No.', key: 'partNo' },
                                { label: 'Model No.', key: 'modNo' },
                                { label: 'BOQP No.', key: 'boqpNo' }
                            ].map((f) => (
                                <div key={f.key} className="space-y-1">
                                    <label className="text-[11px] font-bold text-slate-700 uppercase ml-1">{f.label}</label>
                                    <input required className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#3b82f6] outline-none font-semibold text-sm" 
                                    value={formData[f.key]} onChange={(e) => setFormData({...formData, [f.key]: e.target.value})} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. Technical Composition Card */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Chemical Composition */}
                        <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-blue-50">
                            <h4 className="text-[#3b82f6] font-black text-xs uppercase tracking-widest mb-6 border-b pb-2">Chemical Composition (%)</h4>
                            <div className="space-y-4">
                                {['Carbon', 'Manganese', 'Sulphur', 'Phosphorus'].map((item) => (
                                    <div key={item} className="flex items-center justify-between gap-4">
                                        <label className="text-xs font-bold text-slate-600 w-1/2">{item}</label>
                                        <input className="w-1/2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#3b82f6] outline-none text-center font-bold" 
                                        value={formData.chemical[item.toLowerCase()]} 
                                        onChange={(e) => setFormData({...formData, chemical: {...formData.chemical, [item.toLowerCase()]: e.target.value}})} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mechanical Properties */}
                        <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-blue-50">
                            <h4 className="text-[#3b82f6] font-black text-xs uppercase tracking-widest mb-6 border-b pb-2">Mechanical Properties</h4>
                            <div className="space-y-4">
                                {[
                                    {l: 'Tensile Strength (MPa)', k: 'tensile'},
                                    {l: 'Yield Stress (MPa)', k: 'yield'},
                                    {l: 'Elongation (%) Min.', k: 'elongation'},
                                    {l: 'Hardness (HRB)', k: 'hardness'}
                                ].map((item) => (
                                    <div key={item.k} className="flex items-center justify-between gap-4">
                                        <label className="text-xs font-bold text-slate-600 w-1/2">{item.l}</label>
                                        <input className="w-1/2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-[#3b82f6] outline-none text-center font-bold" 
                                        value={formData.mechanical[item.k]} 
                                        onChange={(e) => setFormData({...formData, mechanical: {...formData.mechanical, [item.k]: e.target.value}})} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 3. Parameter Table Section */}
                    <div className="bg-white rounded-[2.5rem] shadow-xl p-8 border border-blue-50 overflow-hidden">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="w-2.5 h-7 bg-[#3b82f6] rounded-full"></span>
                            <h3 className="text-slate-800 font-black text-sm uppercase tracking-widest">Inspection Parameters</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-separate border-spacing-y-3">
                                <thead>
                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <th className="px-4">Parameter</th>
                                        <th className="px-4">Specification</th>
                                        <th className="px-4">Method</th>
                                        <th className="px-4">Frequency</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="group">
                                        <td className="px-2"><input className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#3b82f6] outline-none text-sm font-semibold" placeholder="e.g. Visual" /></td>
                                        <td className="px-2"><input className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#3b82f6] outline-none text-sm font-semibold" placeholder="e.g. No Burrs" /></td>
                                        <td className="px-2"><input className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#3b82f6] outline-none text-sm font-semibold" placeholder="Visual" /></td>
                                        <td className="px-2"><input className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-[#3b82f6] outline-none text-sm font-semibold" placeholder="100%" /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="bg-white/90 backdrop-blur-xl fixed md:sticky bottom-0 md:bottom-6 left-0 right-0 md:rounded-3xl border-t md:border border-slate-200 shadow-2xl p-4 z-50 flex items-center justify-between px-6">
                        <button type="button" onClick={() => navigate('/qa-hub/monthly')} className="text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-red-500">
                             Cancel
                        </button>
                        <div className="flex gap-4">
                            <button type="button" onClick={handleForceReset} className="px-8 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200">
                                Reset
                            </button>
                            <button type="submit" className="px-12 py-4 bg-[#3b82f6] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-500/20 hover:bg-[#2563eb] active:scale-95 transition-all">
                                Save BO Quality Plan
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BOQualityPlan;