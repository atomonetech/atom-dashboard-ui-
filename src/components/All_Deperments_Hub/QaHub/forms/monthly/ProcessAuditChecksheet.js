import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../../../../../config/api'; 

const ProcessAuditChecksheet = () => {
    const navigate = useNavigate();

    const initialFormState = {
        partName: '',
        partNo: '',
        model: '',
        date: '', 
        auditor: '',
        auditee: '',
        observations: Array(19).fill(''),
        remarks: Array(19).fill('')
    };

    const [formData, setFormData] = useState(initialFormState);
    const [partList, setPartList] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setFormData(prev => ({ ...prev, date: today }));

        const fetchParts = async () => {
            try {
                const res = await fetch(getApiUrl('/api/master-dropdown/?filter=all_parts'));
                if (!res.ok) throw new Error("Network response was not ok");
                
                const data = await res.json();
                const uniqueParts = [...new Set(data.map(item => Array.isArray(item) ? item[0] : item))].filter(Boolean);
                setPartList(uniqueParts);
            } catch (error) {
                console.error("Failed to fetch parts:", error);
            }
        };
        fetchParts();
    }, []);

    const handleInputChange = (field, value, index = null) => {
        if (index !== null) {
            const updatedArray = [...formData[field]];
            updatedArray[index] = value;
            setFormData({ ...formData, [field]: updatedArray });
        } else {
            setFormData({ ...formData, [field]: value });
        }
    };

    const handlePartNameChange = async (value) => {
        handleInputChange('partName', value);
        
        if (!value) {
            setFormData(prev => ({ ...prev, partNo: '', model: '' }));
            return;
        }

        try {
            const [noRes, modRes] = await Promise.all([
                fetch(getApiUrl(`/api/master-dropdown/?filter=part_no&part=${encodeURIComponent(value)}`)),
                fetch(getApiUrl(`/api/master-dropdown/?filter=model_by_part&part=${encodeURIComponent(value)}`))
            ]);
            
            const noData = await noRes.json();
            const modData = await modRes.json();

            setFormData(prev => ({
                ...prev,
                partNo: noData[0] || '',
                model: modData[0] || ''
            }));
        } catch (error) {
            console.error("Failed to auto-fill:", error);
            setFormData(prev => ({ ...prev, partNo: 'Error', model: 'Error' }));
        }
    };

    const resetForm = () => {
        if(window.confirm("Clear all audit data?")) {
            const today = new Date().toISOString().split('T')[0];
            setFormData({ ...initialFormState, date: today });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // YAHAN PAR DATA KO MAP KIYA GAYA HAI TAQKI PARAMETERS BHI BACKEND JAYE
        const detailedAuditData = auditPoints.map((point, index) => ({
            s_no: point.sNo,
            parameter: point.param,
            specification: point.spec,
            observation: formData.observations[index],
            status_remark: formData.remarks[index]
        }));

        const payload = {
            part_name: formData.partName,
            part_no: formData.partNo,
            model_name: formData.model,
            audit_date: formData.date,
            auditor_name: formData.auditor,
            auditee_name: formData.auditee,
            audit_details: detailedAuditData // Yeh pura array bhej rahe hain
        };

        try {
            const response = await fetch(getApiUrl('/api/save-process-audit/'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('Process Audit Saved Successfully!');
                const today = new Date().toISOString().split('T')[0];
                setFormData({ ...initialFormState, date: today });
            } else {
                const errorData = await response.json();
                alert(`Failed to submit: ${JSON.stringify(errorData)}`);
            }
        } catch (error) {
            console.error('Submission Error:', error);
            alert('An error occurred while sending data.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f0f4f9] text-slate-700 font-sans pb-24 md:pb-20">
            <div className="bg-gradient-to-r from-[#1e40af] to-[#3b82f5] pt-8 md:pt-12 pb-20 md:pb-24 px-4 md:px-6">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-3 md:gap-4">
                        <button onClick={() => navigate('/qa-hub/monthly')} className="w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded text-white transition backdrop-blur-md">
                            <i className="bi bi-arrow-left text-xl"></i>
                        </button>
                        <div>
                            <h1 className="text-xl md:text-3xl font-black text-white tracking-tight uppercase leading-tight">Process Audit</h1>
                            <p className="text-blue-100 text-[10px] md:text-xs font-bold tracking-widest uppercase opacity-80">QMS Control Form</p>
                        </div>
                    </div>
                    <div className="flex justify-start md:justify-end">
                        <span className="bg-white/10 text-white px-4 py-2 rounded text-[10px] font-bold border border-white/20 backdrop-blur-sm">
                            DOC: AOT-F-QA-02 | REV: 00
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-12 md:-mt-16">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded shadow-xl p-6 md:p-8 border border-white">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                            
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-blue-600 uppercase tracking-wider">Part Name</label>
                                <select 
                                    required 
                                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded focus:border-[#3b82f5] focus:bg-white outline-none transition-all font-medium text-sm appearance-none" 
                                    value={formData.partName} 
                                    onChange={(e) => handlePartNameChange(e.target.value)}
                                >
                                    <option value="" disabled>Select Part</option>
                                    {partList.map((part, idx) => <option key={idx} value={part}>{part}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Part Number</label>
                                <input 
                                    readOnly 
                                    className="w-full px-4 py-4 bg-slate-100 border border-slate-200 rounded text-slate-500 font-bold text-sm cursor-not-allowed outline-none" 
                                    placeholder="Auto-filled" 
                                    value={formData.partNo} 
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Machine Model</label>
                                <input 
                                    readOnly 
                                    className="w-full px-4 py-4 bg-slate-100 border border-slate-200 rounded text-slate-500 font-bold text-sm cursor-not-allowed outline-none" 
                                    placeholder="Auto-filled" 
                                    value={formData.model} 
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-blue-600 uppercase tracking-wider">Audit Date</label>
                                <input required type="date" className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded focus:border-[#3b82f5] focus:bg-white outline-none transition-all font-medium text-sm" 
                                value={formData.date} onChange={(e) => handleInputChange('date', e.target.value)} />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <label className="text-[11px] font-black text-blue-600 uppercase tracking-wider">Auditor Name</label>
                                <input required className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded focus:border-[#3b82f5] focus:bg-white outline-none transition-all font-medium text-sm" 
                                value={formData.auditor} onChange={(e) => handleInputChange('auditor', e.target.value)} />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <label className="text-[11px] font-black text-blue-600 uppercase tracking-wider">Auditee (Operator/In-charge)</label>
                                <input required className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded focus:border-[#3b82f5] focus:bg-white outline-none transition-all font-medium text-sm" 
                                value={formData.auditee} onChange={(e) => handleInputChange('auditee', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded shadow-xl overflow-hidden border border-white">
                        <div className="bg-slate-50 px-6 md:px-8 py-5 border-b border-slate-200 flex justify-between items-center">
                            <h3 className="font-black text-slate-800 uppercase text-sm tracking-widest">Inspection Points</h3>
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-3 py-1.5 rounded font-bold uppercase">19 Points</span>
                        </div>
                        
                        <div className="p-6 md:p-8 space-y-12">
                            {auditPoints.map((point, idx) => (
                                <div key={point.sNo} className="relative pl-8 md:pl-10 border-l-2 border-slate-200 hover:border-blue-400 transition-colors">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 bg-white border-[4px] border-blue-500 shadow-sm"></div>
                                    <div className="mb-4">
                                        <h4 className="font-bold text-slate-800 text-base flex items-start gap-3">
                                            <span className="text-blue-500 font-black">#{point.sNo}</span>
                                            <span className="flex-1 leading-tight">{point.param}</span>
                                        </h4>
                                        <div className="inline-block mt-2 px-3 py-1.5 bg-amber-50 rounded">
                                            <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider leading-none">SPEC: {point.spec}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Observations</label>
                                            <textarea rows="2" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded focus:border-blue-400 focus:bg-white outline-none transition-all text-sm font-medium resize-none" value={formData.observations[idx]} onChange={(e) => handleInputChange('observations', e.target.value, idx)} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status / Remarks</label>
                                            <input className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded focus:border-blue-400 focus:bg-white outline-none transition-all text-sm font-medium" value={formData.remarks[idx]} onChange={(e) => handleInputChange('remarks', e.target.value, idx)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-md fixed md:sticky bottom-0 md:bottom-6 left-0 right-0 md:rounded border-t md:border border-slate-200 shadow-2xl p-5 flex flex-col md:flex-row gap-4 md:justify-between md:items-center z-20">
                        <button type="button" onClick={() => navigate('/qa-hub/monthly')} className="hidden md:flex px-8 py-4 text-slate-500 font-bold hover:text-slate-800 transition items-center gap-2 uppercase text-xs tracking-wider">
                            Exit
                        </button>
                        
                        <div className="flex gap-4 w-full md:w-auto">
                            <button type="button" onClick={resetForm} className="flex-1 md:flex-none px-8 py-4 bg-slate-100 text-slate-600 rounded font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition">
                                Reset
                            </button>
                            <button type="submit" disabled={isSubmitting} className="flex-[2] md:flex-none px-12 py-4 bg-[#3b82f5] text-white rounded font-black uppercase text-xs tracking-widest shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition flex items-center justify-center gap-3 disabled:opacity-50">
                                {isSubmitting ? 'Saving...' : 'Save Report'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProcessAuditChecksheet;