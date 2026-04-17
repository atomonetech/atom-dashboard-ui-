import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProcessAuditChecksheet = () => {
    const navigate = useNavigate();

    const initialFormState = {
        partNameNo: '',
        model: '',
        date: '', 
        auditor: '',
        auditee: '',
        observations: Array(19).fill(''),
        remarks: Array(19).fill('')
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setFormData(prev => ({ ...prev, date: today }));
    }, []);

    const auditPoints = [
        { sNo: 1, param: "Verify last audit observation", spec: "Last audit NC closer must be available" },
        { sNo: 2, param: "Verify Process Flow Chart / Sequence", spec: "Process sequence must be as per PFD." },
        { sNo: 3, param: "Verify actual working as per WI/PCS", spec: "Operator should be working as per standard" },
        { sNo: 4, param: "Process Control Standards (WI/PCS)", spec: "Must be displayed/available on line" },
        { sNo: 5, param: "Verify Process Parameters", spec: "Must be within specification limit" },
        { sNo: 6, param: "Check records in Control Plan", spec: "Recording must be as per frequency" },
        { sNo: 7, param: "Instrument/Gauge Calibration", spec: "Check validity and expiry date" },
        { sNo: 8, param: "Machine check sheet status", spec: "Check sheets must be upto date" },
        { sNo: 9, param: "Legibility of Documents", spec: "All displays must be visible & legible" },
        { sNo: 10, param: "Master/Limit/FOP Samples", spec: "Samples must exist and be identified" },
        { sNo: 11, param: "Non-Conforming Products Disposition", spec: "Rework/Scrap notes must be produced" },
        { sNo: 12, param: "Operator/Inspector Skill Matrix", spec: "Verify Skill Matrix status" },
        { sNo: 13, param: "Countermeasures Implementation", spec: "Verify awareness among concerned people" },
        { sNo: 14, param: "Machine/Tool/Fixture Condition", spec: "Maintained as per maintenance plan" },
        { sNo: 15, param: "Poka-Yoke Functioning", spec: "Mechanism must be functioning well" },
        { sNo: 16, param: "Identification & Traceability", spec: "Identification tags must be present" },
        { sNo: 17, param: "Change Management Verification", spec: "Quality record for abnormal change/ECN" },
        { sNo: 18, param: "Safety Measures (PPEs)", spec: "Goggles/Gloves/Shoes must be used" },
        { sNo: 19, param: "Red/Yellow/Ok Bins Availability", spec: "Bins at proper place & identified" }
    ];

    const handleInputChange = (field, value, index = null) => {
        if (index !== null) {
            const updatedArray = [...formData[field]];
            updatedArray[index] = value;
            setFormData({ ...formData, [field]: updatedArray });
        } else {
            setFormData({ ...formData, [field]: value });
        }
    };

    const resetForm = () => {
        if(window.confirm("Clear all audit data?")) {
            const today = new Date().toISOString().split('T')[0];
            setFormData({ ...initialFormState, date: today });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Process Audit Saved Successfully!');
        const today = new Date().toISOString().split('T')[0];
        setFormData({ ...initialFormState, date: today });
    };

    return (
        <div className="min-h-screen bg-[#f0f4f9] text-slate-700 font-sans pb-24 md:pb-20">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#1e40af] to-[#3b82f5] pt-8 md:pt-12 pb-20 md:pb-24 px-4 md:px-6">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-3 md:gap-4">
                        <button 
                            onClick={() => navigate('/qa-hub/monthly')}
                            className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white transition backdrop-blur-md"
                        >
                            <i className="bi bi-arrow-left text-lg"></i>
                        </button>
                        <div>
                            <h1 className="text-xl md:text-3xl font-black text-white tracking-tight uppercase leading-tight">Process Audit</h1>
                            <p className="text-blue-100 text-[10px] md:text-xs font-bold tracking-widest uppercase opacity-80">QMS Control Form</p>
                        </div>
                    </div>
                    <div className="flex justify-start md:justify-end">
                        <span className="bg-white/10 text-white px-3 md:px-4 py-1.5 rounded-md text-[9px] md:text-[10px] font-bold border border-white/20 backdrop-blur-sm">
                            DOC: AOT-F-QA-02 | REV: 00
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Form Container */}
            <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-12 md:-mt-16">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Top Info Card - Responsive Grid */}
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-5 md:p-8 border border-white">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
                            <div className="space-y-1.5">
                                <label className="text-[10px] md:text-[11px] font-black text-blue-600 uppercase tracking-wider">Part Name / Number</label>
                                <input 
                                    required
                                    className="w-full px-4 py-2.5 md:py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#3b82f5] focus:bg-white outline-none transition-all font-medium text-sm" 
                                    placeholder="Enter details..."
                                    value={formData.partNameNo} 
                                    onChange={(e) => handleInputChange('partNameNo', e.target.value)} 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] md:text-[11px] font-black text-blue-600 uppercase tracking-wider">Machine Model</label>
                                <input 
                                    required
                                    className="w-full px-4 py-2.5 md:py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#3b82f5] focus:bg-white outline-none transition-all font-medium text-sm" 
                                    placeholder="e.g. CNC-01"
                                    value={formData.model} 
                                    onChange={(e) => handleInputChange('model', e.target.value)} 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] md:text-[11px] font-black text-blue-600 uppercase tracking-wider">Audit Date</label>
                                <input 
                                    required
                                    type="date" 
                                    className="w-full px-4 py-2.5 md:py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#3b82f5] focus:bg-white outline-none transition-all font-medium text-sm" 
                                    value={formData.date} 
                                    onChange={(e) => handleInputChange('date', e.target.value)} 
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] md:text-[11px] font-black text-blue-600 uppercase tracking-wider">Auditor Name</label>
                                <input 
                                    required
                                    className="w-full px-4 py-2.5 md:py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#3b82f5] focus:bg-white outline-none transition-all font-medium text-sm" 
                                    placeholder="Enter name"
                                    value={formData.auditor} 
                                    onChange={(e) => handleInputChange('auditor', e.target.value)} 
                                />
                            </div>
                            <div className="sm:col-span-2 space-y-1.5">
                                <label className="text-[10px] md:text-[11px] font-black text-blue-600 uppercase tracking-wider">Auditee (Operator/In-charge)</label>
                                <input 
                                    required
                                    className="w-full px-4 py-2.5 md:py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-[#3b82f5] focus:bg-white outline-none transition-all font-medium text-sm" 
                                    placeholder="Enter auditee name"
                                    value={formData.auditee} 
                                    onChange={(e) => handleInputChange('auditee', e.target.value)} 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Checklist Items Card */}
                    <div className="bg-white rounded-xl md:rounded-2xl shadow-xl overflow-hidden border border-white">
                        <div className="bg-slate-50 px-5 md:px-8 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-black text-slate-800 uppercase text-[12px] md:text-sm tracking-widest">Inspection Points</h3>
                            <span className="text-[9px] md:text-[10px] bg-blue-100 text-blue-700 px-2 md:px-3 py-1 rounded-full font-bold uppercase">19 Points</span>
                        </div>
                        
                        <div className="p-4 md:p-8 space-y-10 md:space-y-12">
                            {auditPoints.map((point, idx) => (
                                <div key={point.sNo} className="relative pl-6 md:pl-10 border-l-2 border-slate-100 hover:border-blue-400 transition-colors">
                                    {/* Responsive Pulse Dot */}
                                    <div className="absolute -left-[7px] md:-left-[9px] top-0 w-3 h-3 md:w-4 md:h-4 rounded-full bg-white border-[3px] md:border-4 border-blue-500 shadow-sm"></div>
                                    
                                    <div className="mb-4">
                                        <h4 className="font-bold text-slate-800 text-sm md:text-base flex items-start gap-2">
                                            <span className="text-blue-500 font-black">#{point.sNo}</span>
                                            <span className="flex-1 leading-tight">{point.param}</span>
                                        </h4>
                                        <div className="inline-block mt-2 px-2.5 py-1 bg-amber-50 rounded-md">
                                            <p className="text-[9px] md:text-[10px] text-amber-700 font-bold uppercase tracking-wider leading-none">SPEC: {point.spec}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Observations</label>
                                            <textarea 
                                                rows="2"
                                                className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-slate-50 border-2 border-slate-50 rounded-xl focus:border-blue-400 focus:bg-white outline-none transition-all text-sm font-medium resize-none"
                                                placeholder="Type observation..."
                                                value={formData.observations[idx]}
                                                onChange={(e) => handleInputChange('observations', e.target.value, idx)}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status / Remarks</label>
                                            <input 
                                                className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-slate-50 border-2 border-slate-50 rounded-xl focus:border-blue-400 focus:bg-white outline-none transition-all text-sm font-medium"
                                                placeholder="Ok / Not Ok / NA"
                                                value={formData.remarks[idx]}
                                                onChange={(e) => handleInputChange('remarks', e.target.value, idx)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Floating Bar - Responsive Layout */}
                    <div className="bg-white/80 backdrop-blur-md fixed md:sticky bottom-0 md:bottom-6 left-0 right-0 md:rounded-2xl border-t md:border border-white shadow-2xl p-4 flex flex-col md:flex-row gap-3 md:justify-between md:items-center z-20">
                        <button 
                            type="button"
                            onClick={() => navigate('/qa-hub/monthly')}
                            className="hidden md:flex px-6 py-3 text-slate-500 font-bold hover:text-slate-800 transition items-center gap-2"
                        >
                            <i className="bi bi-arrow-left"></i> Exit
                        </button>
                        
                        <div className="flex gap-2 w-full md:w-auto">
                            <button 
                                type="button"
                                onClick={resetForm}
                                className="flex-1 md:flex-none px-4 md:px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition"
                            >
                                Reset
                            </button>
                            <button 
                                type="submit"
                                className="flex-[2] md:flex-none px-8 md:px-12 py-3 bg-[#3b82f5] text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition flex items-center justify-center gap-2"
                            >
                                <i className="bi bi-cloud-arrow-up-fill text-sm"></i> Save Report
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProcessAuditChecksheet;