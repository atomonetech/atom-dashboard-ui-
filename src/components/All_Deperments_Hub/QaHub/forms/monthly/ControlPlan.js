import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ControlPlan = () => {
    const navigate = useNavigate();

    const initialFormState = {
        partName: '', partNo: '', model: '', supplierName: '',
        customer: '', supplierCode: '', cpNo: '', issueDate: '',
        processDescription: '', machineJig: '',
        charNo: '', charProcess: '', charProduct: '',
        evaluationTech: '', sampleSize: '', sampleFreq: '', 
        controlMethod: '', reactionPlan: '', spec: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    // Auto-fill Current Date
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setFormData(prev => ({ ...prev, issueDate: today }));
    }, []);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        const today = new Date().toISOString().split('T')[0];
        setFormData({ ...initialFormState, issueDate: today });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Control Plan Data Submitted:", formData);
        alert('Control Plan Saved Successfully!');
        resetForm();
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-700 font-sans pb-32 md:pb-12">
            {/* Header Area */}
            <div className="bg-gradient-to-r from-[#4f46e5] to-[#6366f1] pt-10 pb-32 px-6 shadow-lg">
                <div className="max-w-[1400px] mx-auto flex items-center gap-4 md:gap-6 text-white">
                    <button onClick={() => navigate('/qa-hub/monthly')} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-2xl transition-all border border-white/10 backdrop-blur-md shadow-xl">
                        <i className="bi bi-chevron-left text-xl"></i>
                    </button>
                    <div>
                        <h1 className="text-xl md:text-3xl font-black uppercase tracking-tight leading-none">Control Plan</h1>
                        <p className="text-indigo-100 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mt-2 opacity-80">AOT-F-NPD-14 | Quality Standard</p>
                    </div>
                </div>
            </div>

            {/* Main Container */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 -mt-20">
                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                    
                    {/* 1. General Information Section */}
                    <div className="bg-white rounded-3xl md:rounded-[2rem] shadow-xl p-6 md:p-8 border border-slate-100">
                        <div className="flex items-center gap-3 mb-8 ml-1 md:ml-2">
                            <span className="w-2 md:w-2.5 h-6 bg-[#6366f1] rounded-full"></span>
                            <h3 className="text-slate-800 font-black text-xs md:text-sm uppercase tracking-widest">General Information</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 md:gap-x-8 gap-y-5 md:gap-y-6">
                            {[
                                { label: 'Part Name', key: 'partName', placeholder: 'Enter Part Name' },
                                { label: 'Part Number', key: 'partNo', placeholder: 'e.g. 8201-X01' },
                                { label: 'Model', key: 'model', placeholder: 'Model Name' },
                                { label: 'Customer', key: 'customer', placeholder: 'Client Name' },
                                { label: 'Supplier Name', key: 'supplierName', placeholder: 'Enter Supplier' },
                                { label: 'Supplier Code', key: 'supplierCode', placeholder: 'Enter Code' },
                                { label: 'CP Number', key: 'cpNo', placeholder: 'e.g. CP-001' },
                                { label: 'Issue Date', key: 'issueDate', type: 'date' },
                            ].map((f) => (
                                <div key={f.key} className="space-y-1.5">
                                    <label className="text-[10px] md:text-[11px] font-bold text-slate-700 uppercase tracking-wide ml-1">{f.label}</label>
                                    <input required type={f.type || 'text'} className="w-full px-4 md:px-5 py-3 md:py-3.5 bg-slate-50/50 border-2 border-slate-200 rounded-xl md:rounded-2xl focus:border-[#6366f1] focus:bg-white outline-none transition-all font-semibold text-sm text-slate-800 placeholder:text-slate-400" value={formData[f.key]} onChange={(e) => handleChange(f.key, e.target.value)} placeholder={f.placeholder} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. Middle Grid (Process + Methods) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                        <div className="lg:col-span-2 bg-white rounded-3xl md:rounded-[2rem] shadow-xl p-6 md:p-8 border border-slate-100">
                             <div className="flex items-center gap-3 mb-8 ml-1">
                                <span className="w-2.5 h-6 bg-[#6366f1] rounded-full"></span>
                                <h3 className="text-slate-800 font-black text-xs md:text-sm uppercase tracking-widest">Process & Characteristics</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-8">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-700 uppercase ml-1">Operation Description</label>
                                    <textarea rows="3" className="w-full px-4 md:px-5 py-4 bg-slate-50/50 border-2 border-slate-200 rounded-2xl focus:border-[#6366f1] focus:bg-white outline-none text-sm font-medium resize-none shadow-inner transition-all text-slate-800" value={formData.processDescription} onChange={(e) => handleChange('processDescription', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-700 uppercase ml-1">Machine / Jig / Fixture</label>
                                    <textarea rows="3" className="w-full px-4 md:px-5 py-4 bg-slate-50/50 border-2 border-slate-200 rounded-2xl focus:border-[#6366f1] focus:bg-white outline-none text-sm font-medium resize-none shadow-inner transition-all text-slate-800" value={formData.machineJig} onChange={(e) => handleChange('machineJig', e.target.value)} />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 md:gap-6">
                                {[{l:'Char No.', k:'charNo'}, {l:'Process', k:'charProcess'}, {l:'Product', k:'charProduct'}].map(item=>(
                                    <div key={item.k} className="space-y-1.5 text-center md:text-left">
                                        <label className="text-[9px] md:text-[11px] font-bold text-slate-700 uppercase">{item.l}</label>
                                        <input className="w-full px-2 md:px-5 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg md:rounded-xl focus:border-[#6366f1] outline-none text-xs md:text-sm font-bold text-slate-800 text-center md:text-left" value={formData[item.k]} onChange={(e) => handleChange(item.k, e.target.value)} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl md:rounded-[2rem] shadow-xl p-6 md:p-8 border border-slate-100">
                            <div className="flex items-center gap-3 mb-8 ml-1">
                                <span className="w-2.5 h-6 bg-[#6366f1] rounded-full"></span>
                                <h3 className="text-slate-800 font-black text-xs md:text-sm uppercase tracking-widest">Inspection Method</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-700 uppercase ml-1">Evaluation Tech</label>
                                    <input className="w-full px-5 py-3 bg-slate-50/50 border-2 border-slate-200 rounded-2xl focus:border-[#6366f1] outline-none font-semibold text-sm text-slate-800" value={formData.evaluationTech} onChange={(e) => handleChange('evaluationTech', e.target.value)} placeholder="CMM / Vernier" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-700 uppercase">Size</label>
                                        <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-[#6366f1] outline-none text-sm text-slate-800" value={formData.sampleSize} onChange={(e) => handleChange('sampleSize', e.target.value)} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-700 uppercase">Freq</label>
                                        <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-[#6366f1] outline-none text-sm text-slate-800" value={formData.sampleFreq} onChange={(e) => handleChange('sampleFreq', e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-700 uppercase ml-1">Control Method</label>
                                    <input className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-[#6366f1] outline-none text-sm text-slate-800" value={formData.controlMethod} onChange={(e) => handleChange('controlMethod', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Reaction Plan Footer */}
                    <div className="bg-white rounded-3xl md:rounded-[2rem] shadow-xl p-6 md:p-8 border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-700 uppercase ml-1">Product / Process Spec</label>
                            <textarea rows="3" className="w-full px-5 py-4 bg-slate-50/50 border-2 border-slate-200 rounded-2xl focus:border-[#6366f1] outline-none text-sm font-semibold text-slate-800" value={formData.spec} onChange={(e) => handleChange('spec', e.target.value)} placeholder="Specifications..." />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-700 uppercase ml-1">Reaction Plan</label>
                            <textarea rows="3" className="w-full px-5 py-4 bg-slate-50/50 border-2 border-slate-200 rounded-2xl focus:border-[#6366f1] outline-none text-sm font-semibold text-slate-800" value={formData.reactionPlan} onChange={(e) => handleChange('reactionPlan', e.target.value)} placeholder="Action Plan..." />
                        </div>
                    </div>

                    {/* 🔥 FIXED RESPONSIVE BOTTOM BAR 🔥 */}
                    <div className="bg-white/90 backdrop-blur-xl fixed md:sticky bottom-0 md:bottom-6 left-0 right-0 md:rounded-3xl border-t md:border border-slate-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] md:shadow-2xl p-3 md:p-4 z-50">
                        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 md:gap-4">
                            
                            {/* Cancel - Compact Icon on Mobile */}
                            <button 
                                type="button" 
                                onClick={() => navigate('/qa-hub/monthly')} 
                                className="flex items-center gap-2 px-3 md:px-6 py-2.5 text-slate-400 font-bold hover:text-red-500 transition-all text-[10px] md:text-xs uppercase tracking-widest"
                            >
                                <i className="bi bi-x-circle text-xl md:text-lg"></i> 
                                <span className="hidden sm:inline">Cancel</span>
                            </button>
                            
                            {/* Action Buttons Group */}
                            <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
                                <button 
                                    type="button" 
                                    onClick={resetForm} 
                                    className="px-4 md:px-8 md:py-3 py-2.5 bg-slate-100 text-slate-600 rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[10px] tracking-widest hover:bg-slate-200 border border-slate-200 transition-all shadow-sm"
                                >
                                    Reset
                                </button>
                                
                                <button 
                                    type="submit" 
                                    className="flex-1 md:flex-none px-4 md:px-12 md:py-4 py-3 bg-[#6366f1] text-white rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[11px] tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-[#4f46e5] active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <i className="bi bi-check-circle-fill text-sm md:text-base"></i> 
                                    <span>Save <span className="hidden sm:inline">Control Plan</span></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="h-10"></div>
        </div>
    );
};

export default ControlPlan;