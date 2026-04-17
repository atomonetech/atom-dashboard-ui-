import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MinutesOfMeetings = () => {
    const navigate = useNavigate();

    const initialFormState = {
        date: '',
        time: '',
        subject: '',
        aotMembers: '',
        supplierMembers: '',
        partDetails: '',
        problemDetails: '',
        actionPlan: '',
        responsibility: '',
        targetDate: '',
        statusRemark: ''
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
        if (window.confirm("Are you sure you want to reset the MOM form?")) {
            const today = new Date().toISOString().split('T')[0];
            setFormData({ ...initialFormState, date: today });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("MOM Data Submitted:", formData);
        alert('Minutes of Meeting Saved Successfully!');
        const today = new Date().toISOString().split('T')[0];
        setFormData({ ...initialFormState, date: today });
    };

    return (
        <div className="min-h-screen bg-[#fbfaff] text-slate-700 font-sans pb-24 md:pb-12">
            {/* Header Section with Purple Theme */}
            <div className="bg-gradient-to-br from-[#5b21b6] via-[#8b5cf6] to-[#a78bfa] pt-12 pb-28 px-4 md:px-6">
                <div className="max-w-5xl mx-auto flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/qa-hub/monthly')}
                        className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-2xl text-white transition-all backdrop-blur-md border border-white/20 shadow-lg"
                    >
                        <i className="bi bi-chevron-left text-xl"></i>
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase leading-tight">Minutes Of Meeting</h1>
                        <p className="text-purple-100 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase opacity-90">Official Discussion Record (AOT/F/QA/19)</p>
                    </div>
                </div>
            </div>

            {/* Form Container */}
            <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-16 md:-mt-20">
                <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                    
                    {/* Meeting Overview Card */}
                    <div className="bg-white rounded-3xl shadow-2xl shadow-purple-900/5 p-6 md:p-10 border border-white">
                        <h3 className="text-[#8b5cf6] font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-[#8b5cf6] rounded-full"></span> Meeting Overview
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-1.5 lg:col-span-2">
                                <label className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-widest ml-1">Subject / Agenda</label>
                                <input required className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all font-semibold text-sm shadow-sm" 
                                value={formData.subject} onChange={(e) => handleChange('subject', e.target.value)} placeholder="What was the meeting about?" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                                    <input required type="date" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all font-semibold text-xs" 
                                    value={formData.date} onChange={(e) => handleChange('date', e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Time</label>
                                    <input type="time" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all font-semibold text-xs" 
                                    value={formData.time} onChange={(e) => handleChange('time', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        {/* Attendance Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">AOT Present Members</label>
                                <textarea rows="2" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all text-sm font-medium resize-none shadow-sm" 
                                value={formData.aotMembers} onChange={(e) => handleChange('aotMembers', e.target.value)} placeholder="Names of internal members..." />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Supplier Present Members</label>
                                <textarea rows="2" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all text-sm font-medium resize-none shadow-sm" 
                                value={formData.supplierMembers} onChange={(e) => handleChange('supplierMembers', e.target.value)} placeholder="Names of external members..." />
                            </div>
                        </div>
                    </div>

                    {/* Discussion & Action Plan Card */}
                    <div className="bg-white rounded-3xl shadow-2xl shadow-purple-900/5 p-6 md:p-10 border border-white">
                        <h3 className="text-[#8b5cf6] font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-4 bg-[#8b5cf6] rounded-full"></span> Discussion Points
                        </h3>
                        
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Part Name / No.</label>
                                    <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all font-semibold text-sm" 
                                    value={formData.partDetails} onChange={(e) => handleChange('partDetails', e.target.value)} placeholder="Part details if applicable" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Responsibility</label>
                                    <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all font-semibold text-sm" 
                                    value={formData.responsibility} onChange={(e) => handleChange('responsibility', e.target.value)} placeholder="Assigned person..." />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Defects / Problem Details</label>
                                <textarea rows="3" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all text-sm font-medium resize-none shadow-sm" 
                                value={formData.problemDetails} onChange={(e) => handleChange('problemDetails', e.target.value)} placeholder="What was the core problem discussed?" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-widest ml-1 font-bold">Action Plan</label>
                                <textarea rows="3" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all text-sm font-medium resize-none shadow-sm" 
                                value={formData.actionPlan} onChange={(e) => handleChange('actionPlan', e.target.value)} placeholder="Steps decided to solve the issue..." />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Date</label>
                                    <input type="date" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all font-semibold text-sm" 
                                    value={formData.targetDate} onChange={(e) => handleChange('targetDate', e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status / Remarks</label>
                                    <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-[#8b5cf6] focus:bg-white outline-none transition-all font-bold text-sm text-[#8b5cf6]" 
                                    value={formData.statusRemark} onChange={(e) => handleChange('statusRemark', e.target.value)} placeholder="Pending / Closed / In-progress" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Sticky Action Bar */}
                    <div className="bg-white/90 backdrop-blur-md fixed md:sticky bottom-0 md:bottom-6 left-0 right-0 md:rounded-3xl border-t md:border border-white shadow-2xl p-4 flex flex-row gap-3 justify-between items-center z-30">
                        <button type="button" onClick={() => navigate('/qa-hub/monthly')} className="flex items-center gap-2 px-6 py-2 text-slate-400 font-bold hover:text-red-500 transition-all text-xs uppercase tracking-widest">
                            <i className="bi bi-x-circle text-lg"></i> <span className="hidden sm:inline">Discard</span>
                        </button>
                        
                        <div className="flex gap-2 md:gap-4">
                            <button type="button" onClick={resetForm} className="px-6 md:px-8 py-2.5 bg-slate-100 text-slate-600 rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">
                                Reset
                            </button>
                            <button type="submit" className="px-8 md:px-12 py-3 bg-[#8b5cf6] text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-purple-500/30 hover:bg-[#7c3aed] active:scale-95 transition-all flex items-center justify-center gap-3">
                                <i className="bi bi-journal-check text-base"></i> Save Minutes
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MinutesOfMeetings;