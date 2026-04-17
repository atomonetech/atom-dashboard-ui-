import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AnnualLayoutPlan = () => {
    const navigate = useNavigate();

    // Logic to calculate Current Financial Year
    const getCurrentFinancialYear = () => {
        const today = new Date();
        const currentMonth = today.getMonth() + 1; // Months are 0-indexed
        const currentYear = today.getFullYear();
        
        // If month is April (4) or later, FY is currentYear to currentYear + 1
        // Else FY is previousYear to currentYear
        if (currentMonth >= 4) {
            return `${currentYear}-${currentYear + 1}`;
        } else {
            return `${currentYear - 1}-${currentYear}`;
        }
    };

    const initialFormState = {
        partName: '',
        partNo: '',
        model: '',
        planYear: getCurrentFinancialYear(), // Auto-set
        selectedMonths: [],
        remarks: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    const months = [
        "Apr", "May", "Jun", "Jul", "Aug", "Sep", 
        "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"
    ];

    const toggleMonth = (month) => {
        setFormData(prev => {
            const isSelected = prev.selectedMonths.includes(month);
            return {
                ...prev,
                selectedMonths: isSelected 
                    ? prev.selectedMonths.filter(m => m !== month)
                    : [...prev.selectedMonths, month]
            };
        });
    };

    const resetForm = () => {
        if (window.confirm("Reset all entries?")) {
            setFormData({
                ...initialFormState,
                planYear: getCurrentFinancialYear()
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Annual Layout Plan Saved Successfully!');
        resetForm();
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-700 font-sans pb-32 md:pb-12">
            {/* Professional Steel Blue Header */}
            <div className="bg-gradient-to-br from-[#475569] via-[#65758c] to-[#94a3b8] pt-10 pb-32 px-4 md:px-6 shadow-lg">
                <div className="max-w-6xl mx-auto flex items-center gap-4 text-white">
                    <button 
                        onClick={() => navigate('/qa-hub/yearly')}
                        className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-2xl transition-all border border-white/10 backdrop-blur-md"
                    >
                        <i className="bi bi-chevron-left text-xl"></i>
                    </button>
                    <div>
                        <h1 className="text-xl md:text-3xl font-black uppercase tracking-tight">Annual Layout Plan</h1>
                        <p className="text-slate-100 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mt-2 opacity-80">AOT-F-QA-D-02A | FY {formData.planYear}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-20">
                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                    
                    {/* Part Info Card */}
                    <div className="bg-white rounded-3xl md:rounded-[2rem] shadow-xl p-6 md:p-10 border border-slate-100">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="w-2.5 h-6 bg-[#65758c] rounded-full"></span>
                            <h3 className="text-slate-800 font-black text-sm uppercase tracking-widest">Part Identification</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide ml-1">Part Name</label>
                                <input required className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-[#65758c] focus:bg-white outline-none transition-all font-semibold text-sm" 
                                value={formData.partName} onChange={(e) => setFormData({...formData, partName: e.target.value})} placeholder="Outlet Pipe" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide ml-1">Part Number</label>
                                <input required className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-[#65758c] focus:bg-white outline-none transition-all font-semibold text-sm" 
                                value={formData.partNo} onChange={(e) => setFormData({...formData, partNo: e.target.value})} placeholder="68P00-S3" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide ml-1">Model</label>
                                <input className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-[#65758c] focus:bg-white outline-none transition-all font-semibold text-sm" 
                                value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} placeholder="K12M" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide ml-1">Financial Year</label>
                                <input readOnly className="w-full px-5 py-3.5 bg-slate-100 border-2 border-slate-200 rounded-2xl outline-none font-black text-sm text-[#65758c] cursor-not-allowed" 
                                value={formData.planYear} />
                            </div>
                        </div>
                    </div>

                    {/* Interactive Planning Matrix */}
                    <div className="bg-white rounded-3xl md:rounded-[2rem] shadow-xl p-6 md:p-10 border border-slate-100">
                        <div className="flex items-center gap-3 mb-10">
                            <span className="w-2.5 h-6 bg-[#65758c] rounded-full"></span>
                            <h3 className="text-slate-800 font-black text-sm uppercase tracking-widest">Inspection Schedule (Plan)</h3>
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-10">
                            {months.map((month) => (
                                <div 
                                    key={month} 
                                    onClick={() => toggleMonth(month)}
                                    className="flex flex-col items-center gap-3 group cursor-pointer"
                                >
                                    <span className="text-[11px] font-black text-slate-400 group-hover:text-[#65758c] transition-colors">{month}</span>
                                    <div className={`w-14 h-14 md:w-20 md:h-20 rounded-full border-4 flex items-center justify-center transition-all duration-300 shadow-md ${
                                        formData.selectedMonths.includes(month) 
                                        ? 'bg-[#65758c] border-[#65758c] text-white rotate-[360deg] scale-110 shadow-slate-400/40' 
                                        : 'bg-white border-slate-100 text-transparent hover:border-[#65758c]/30'
                                    }`}>
                                        {formData.selectedMonths.includes(month) ? (
                                            <i className="bi bi-check2 text-3xl"></i>
                                        ) : (
                                            <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-[#65758c]/20 transition-colors"></div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-14 pt-8 border-t border-slate-100 space-y-2">
                            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-widest ml-1">Yearly Remarks</label>
                            <textarea rows="2" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-[#65758c] focus:bg-white outline-none transition-all text-sm font-medium resize-none shadow-inner" 
                            value={formData.remarks} onChange={(e) => setFormData({...formData, remarks: e.target.value})} placeholder="Add plan details..." />
                        </div>
                    </div>

                    {/* 🔥 RESPONSIVE BOTTOM BAR 🔥 */}
                    <div className="bg-white/90 backdrop-blur-xl fixed md:sticky bottom-0 md:bottom-6 left-0 right-0 md:rounded-3xl border-t md:border border-slate-200 shadow-2xl p-4 z-50">
                        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
                            <button 
                                type="button" 
                                onClick={() => navigate('/qa-hub/yearly')} 
                                className="flex items-center gap-2 px-4 py-2 text-slate-400 font-bold hover:text-red-500 transition-all text-[10px] md:text-xs uppercase tracking-widest"
                            >
                                <i className="bi bi-x-circle text-xl md:text-lg"></i> 
                                <span className="hidden sm:inline">Cancel</span>
                            </button>
                            
                            <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
                                <button 
                                    type="button" 
                                    onClick={resetForm} 
                                    className="px-4 md:px-10 py-2.5 md:py-3 bg-slate-100 text-slate-600 rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 border border-slate-200 transition-all"
                                >
                                    Reset
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 md:flex-none px-6 md:px-16 py-3 md:py-4 bg-[#65758c] text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-[11px] tracking-widest shadow-xl shadow-slate-400/30 hover:bg-[#4a5568] active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    <i className="bi bi-calendar-check-fill text-base"></i> 
                                    <span>Save <span className="hidden sm:inline">Annual Plan</span></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AnnualLayoutPlan;