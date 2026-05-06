import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckingFixtureList = () => {
    const navigate = useNavigate();
    
    // 🔥 Force Reset Key - To completely refresh the UI on submit
    const [formKey, setFormKey] = useState(Date.now());

    const initialFormState = {
        partName: '',
        fixtureNo: '',
        fixtureType: '', // Inspection Fixture / Pannel Checker
        remarks: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleForceReset = () => {
        setFormKey(Date.now());
        setFormData(initialFormState);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Fixture Data Submitted:", formData);
        alert(`✅ Fixture ${formData.fixtureNo} added to the list successfully!`);
        
        // 🔥 Resets all fields after submission
        handleForceReset();
    };

    return (
        <div className="min-h-screen bg-[#fffbeb] text-slate-700 font-sans pb-32">
            
            {/* 🔥 Industrial Amber Gradient Header */}
            <div className="bg-gradient-to-br from-[#d97706] via-[#f59e0b] to-[#fbbf24] pt-12 pb-32 px-6 shadow-2xl">
                <div className="max-w-4xl mx-auto flex items-center gap-6">
                    <button 
                        type="button"
                        onClick={() => navigate('/qa-hub/yearly')} 
                        className="w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-2xl transition-all border border-white/10 backdrop-blur-md shadow-lg"
                    >
                        <i className="bi bi-chevron-left text-xl text-white"></i>
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight leading-none">
                            List of Checking Fixtures
                        </h1>
                        <p className="text-amber-50 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mt-2 opacity-80">
                            AOT/F/QA/28 | Inspection & Panel Checkers
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Body Container */}
            <div key={formKey} className="max-w-4xl mx-auto px-4 -mt-20">
                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* Main Entry Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-amber-50">
                        <div className="flex items-center gap-3 mb-10">
                            <span className="w-2.5 h-8 bg-[#f59e0b] rounded-full"></span>
                            <h3 className="text-slate-800 font-black text-sm uppercase tracking-widest">Fixture Entry Form</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                            
                            {/* Part Name Input */}
                            <div className="space-y-2 group">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1">Part Name</label>
                                <input 
                                    required 
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#f59e0b] focus:bg-white outline-none transition-all font-semibold text-slate-800 shadow-sm" 
                                    value={formData.partName} 
                                    onChange={(e) => handleChange('partName', e.target.value)} 
                                    placeholder="e.g. Bumper Bracket" 
                                />
                            </div>

                            {/* Fixture Number */}
                            <div className="space-y-2 group">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1">Fixture / Panel Checker No.</label>
                                <input 
                                    required 
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#f59e0b] focus:bg-white outline-none transition-all font-semibold text-slate-800 shadow-sm" 
                                    value={formData.fixtureNo} 
                                    onChange={(e) => handleChange('fixtureNo', e.target.value)} 
                                    placeholder="e.g. FIX-QA-2026-01" 
                                />
                            </div>

                            {/* Fixture Type Dropdown */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1">Type of Fixture</label>
                                <select 
                                    required
                                    className="w-full px-5 py-4 bg-amber-50 border-2 border-amber-100 rounded-2xl focus:border-[#f59e0b] outline-none font-bold text-[#b45309] cursor-pointer shadow-sm appearance-none"
                                    value={formData.fixtureType}
                                    onChange={(e) => handleChange('fixtureType', e.target.value)}
                                >
                                    <option value="">-- Select Type --</option>
                                    <option value="Inspection Fixture">Inspection Fixture</option>
                                    <option value="Pannel Checker">Pannel Checker</option>
                                    <option value="Gauge Checker">Gauge Checker</option>
                                </select>
                            </div>

                            {/* Remarks Column */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1">Remarks</label>
                                <textarea 
                                    rows="2" 
                                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#f59e0b] focus:bg-white outline-none text-sm font-medium resize-none shadow-inner" 
                                    value={formData.remarks} 
                                    onChange={(e) => handleChange('remarks', e.target.value)} 
                                    placeholder="Calibration status or location..." 
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
                                className="px-12 py-4 bg-[#f59e0b] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-amber-200 hover:bg-[#d97706] active:scale-95 transition-all flex items-center gap-2"
                            >
                                <i className="bi bi-plus-circle-fill text-base"></i> Add to List
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            {/* Simple Legend for Table Feel */}
            <div className="max-w-4xl mx-auto px-6 mt-6">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
                    Note: Maintain regular calibration records for all checking fixtures listed above.
                </p>
            </div>
        </div>
    );
};

export default CheckingFixtureList;