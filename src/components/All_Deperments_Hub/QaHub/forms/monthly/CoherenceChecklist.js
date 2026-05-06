import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getApiUrl } from '../../../../../config/api'; 

const CoherenceChecklist = () => {
    const navigate = useNavigate();

    const emptyOperation = {
        processName: '',
        machineJig: '',
        pfd: '',
        pfmea: '',
        specOSWI: '',
        specStd: '',
        inspectionFIS: '',
        remarks: ''
    };

    const initialFormState = {
        partName: '',
        partNo: '',
        date: '',
        model: '',
        preparedBy: '',
        verifiedBy: '',
        operations: [emptyOperation]
    };

    const [formData, setFormData] = useState(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [partList, setPartList] = useState([]);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setFormData(prev => ({ ...prev, date: today }));

        // Fetch master part list on mount
        const fetchParts = async () => {
            try {
                const res = await fetch(getApiUrl(`/api/master-dropdown/?filter=all_parts`));
                const data = await res.json();
                const uniqueParts = [...new Set(data.map(item => Array.isArray(item) ? item[0] : item))].filter(Boolean);
                setPartList(uniqueParts);
            } catch (error) {
                console.error("Failed to fetch parts:", error);
            }
        };
        fetchParts();
    }, []);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePartNameChange = async (value) => {
        handleChange('partName', value);
        if (!value) return;

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
        }
    };

    const handleOperationChange = (index, field, value) => {
        const updatedOperations = [...formData.operations];
        updatedOperations[index][field] = value;
        setFormData(prev => ({ ...prev, operations: updatedOperations }));
    };

    const addOperation = () => {
        setFormData(prev => ({
            ...prev,
            operations: [...prev.operations, emptyOperation]
        }));
    };

    const removeOperation = (index) => {
        if (formData.operations.length > 1) {
            const updatedOperations = formData.operations.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, operations: updatedOperations }));
        }
    };

    const resetForm = () => {
        if (window.confirm("Clear all fields?")) {
            const today = new Date().toISOString().split('T')[0];
            setFormData({ ...initialFormState, date: today });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const response = await fetch(getApiUrl(`/api/coherence/`), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Coherence Check Sheet Submitted Successfully!');
                const today = new Date().toISOString().split('T')[0];
                setFormData({ ...initialFormState, date: today });
            } else {
                alert('Failed to submit. Please check network or backend logs.');
            }
        } catch (error) {
            console.error('Submission Error:', error);
            alert('An error occurred while sending data to the server.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-700 font-sans pb-12">
            <div className="bg-gradient-to-br from-[#065f46] to-[#11ba82] pt-12 pb-32 px-6">
                <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/qa-hub/monthly')}
                            className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-xl text-white transition-all backdrop-blur-md border border-white/20"
                        >
                            <i className="bi bi-arrow-left"></i>
                        </button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Coherence Entry</h1>
                            <p className="text-emerald-100 text-[10px] font-bold tracking-widest uppercase">AOT-F-QA-03 | Quality Form</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-20">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 p-8 border border-white">
                        <h3 className="text-[#11ba82] font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-2 h-4 bg-[#11ba82] rounded-full"></span> Header Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400">Part Name</label>
                                <select 
                                    required 
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] outline-none font-semibold appearance-none" 
                                    value={formData.partName} 
                                    onChange={(e) => handlePartNameChange(e.target.value)}
                                >
                                    <option value="" disabled>Select Part</option>
                                    {partList.map((part, idx) => (
                                        <option key={idx} value={part}>{part}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400">Part Number</label>
                                <input required className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] outline-none font-semibold" 
                                value={formData.partNo} onChange={(e) => handleChange('partNo', e.target.value)} placeholder="Part No" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400">Audit Date</label>
                                <input required type="date" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] outline-none font-semibold" 
                                value={formData.date} onChange={(e) => handleChange('date', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400">Model</label>
                                <input required className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] outline-none font-semibold" 
                                value={formData.model} onChange={(e) => handleChange('model', e.target.value)} placeholder="Model" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 p-8 border border-white">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-[#11ba82] font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-4 bg-[#11ba82] rounded-full"></span> Operation Details
                            </h3>
                            <button type="button" onClick={addOperation} className="px-4 py-2 bg-emerald-100 text-[#11ba82] rounded-xl text-xs font-bold hover:bg-emerald-200">
                                + Add Operation
                            </button>
                        </div>

                        {formData.operations.map((op, index) => (
                            <div key={index} className="mb-8 pb-8 border-b-2 border-slate-100 last:border-0 last:mb-0 last:pb-0 relative">
                                {formData.operations.length > 1 && (
                                    <button type="button" onClick={() => removeOperation(index)} className="absolute top-0 right-0 text-red-400 hover:text-red-600 text-sm font-bold">
                                        <i className="bi bi-trash"></i> Remove
                                    </button>
                                )}
                                <h4 className="text-slate-400 text-[10px] font-bold uppercase mb-4">Operation #{index + 1}</h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-400">Process Name</label>
                                        <textarea rows="2" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] outline-none resize-none" 
                                        value={op.processName} onChange={(e) => handleOperationChange(index, 'processName', e.target.value)} placeholder="Process description..." />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-400">Machine / Jig / Fixture</label>
                                        <textarea rows="2" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] outline-none resize-none" 
                                        value={op.machineJig} onChange={(e) => handleOperationChange(index, 'machineJig', e.target.value)} placeholder="Machine details..." />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-400">PFD (Coherence)</label>
                                        <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] outline-none text-sm" 
                                        value={op.pfd} onChange={(e) => handleOperationChange(index, 'pfd', e.target.value)} placeholder="..." />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-400">PFMEA (Coherence)</label>
                                        <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] outline-none text-sm" 
                                        value={op.pfmea} onChange={(e) => handleOperationChange(index, 'pfmea', e.target.value)} placeholder="..." />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-400">Spec OS / WI</label>
                                        <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] outline-none text-sm" 
                                        value={op.specOSWI} onChange={(e) => handleOperationChange(index, 'specOSWI', e.target.value)} placeholder="..." />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-400">Spec as per Standard</label>
                                        <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] outline-none text-sm" 
                                        value={op.specStd} onChange={(e) => handleOperationChange(index, 'specStd', e.target.value)} placeholder="..." />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-400">Inspection FIS</label>
                                        <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] outline-none text-sm" 
                                        value={op.inspectionFIS} onChange={(e) => handleOperationChange(index, 'inspectionFIS', e.target.value)} placeholder="..." />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-400">Remarks</label>
                                        <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] outline-none text-sm font-black text-emerald-600" 
                                        value={op.remarks} onChange={(e) => handleOperationChange(index, 'remarks', e.target.value)} placeholder="OK / NOT OK" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 p-8 border border-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400">Prepared By</label>
                                <input required className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] outline-none font-semibold" 
                                value={formData.preparedBy} onChange={(e) => handleChange('preparedBy', e.target.value)} placeholder="Name / Sign" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-400">Verified By</label>
                                <input required className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] outline-none font-semibold" 
                                value={formData.verifiedBy} onChange={(e) => handleChange('verifiedBy', e.target.value)} placeholder="Name / Sign" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-md sticky bottom-6 rounded-3xl border border-white shadow-2xl p-4 flex justify-between items-center z-30">
                        <button type="button" onClick={() => navigate('/qa-hub/monthly')} className="px-6 py-2 text-slate-400 font-bold hover:text-red-500 transition-all text-sm">
                            <i className="bi bi-x-circle me-2"></i> Exit
                        </button>
                        
                        <div className="flex gap-4">
                            <button type="button" onClick={resetForm} className="px-8 py-2.5 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200">
                                Reset
                            </button>
                            <button type="submit" disabled={isSubmitting} className="px-12 py-3 bg-[#11ba82] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-green-500/30 hover:bg-[#0e9a6c] transition-all disabled:opacity-50">
                                {isSubmitting ? 'Submitting...' : 'Submit Record'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CoherenceChecklist;
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const CoherenceChecklist = () => {
//     const navigate = useNavigate();

//     const emptyOperation = {
//         processName: '',
//         machineJig: '',
//         pfd: '',
//         pfmea: '',
//         specOSWI: '',
//         specStd: '',
//         inspectionFIS: '',
//         remarks: ''
//     };

//     const initialFormState = {
//         partName: '',
//         partNo: '',
//         date: '',
//         model: '',
//         preparedBy: '',
//         verifiedBy: '',
//         operations: [emptyOperation]
//     };

//     const [formData, setFormData] = useState(initialFormState);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     useEffect(() => {
//         const today = new Date().toISOString().split('T')[0];
//         setFormData(prev => ({ ...prev, date: today }));
//     }, []);

//     const handleChange = (field, value) => {
//         setFormData(prev => ({ ...prev, [field]: value }));
//     };

//     const handleOperationChange = (index, field, value) => {
//         const updatedOperations = [...formData.operations];
//         updatedOperations[index][field] = value;
//         setFormData(prev => ({ ...prev, operations: updatedOperations }));
//     };

//     const addOperation = () => {
//         setFormData(prev => ({
//             ...prev,
//             operations: [...prev.operations, emptyOperation]
//         }));
//     };

//     const removeOperation = (index) => {
//         if (formData.operations.length > 1) {
//             const updatedOperations = formData.operations.filter((_, i) => i !== index);
//             setFormData(prev => ({ ...prev, operations: updatedOperations }));
//         }
//     };

//     const resetForm = () => {
//         if (window.confirm("Clear all fields?")) {
//             const today = new Date().toISOString().split('T')[0];
//             setFormData({ ...initialFormState, date: today });
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);
        
//         // Replace with your actual backend URL
//         const BACKEND_API_URL = 'http://localhost:8000/api/coherence/'; 

//         try {
//             const response = await fetch(BACKEND_API_URL, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(formData)
//             });

//             if (response.ok) {
//                 alert('Coherence Check Sheet Submitted Successfully!');
//                 const today = new Date().toISOString().split('T')[0];
//                 setFormData({ ...initialFormState, date: today });
//             } else {
//                 alert('Failed to submit. Please check network or backend logs.');
//             }
//         } catch (error) {
//             console.error('Submission Error:', error);
//             alert('An error occurred while sending data to the server.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-[#f8fafc] text-slate-700 font-sans pb-12">
//             <div className="bg-gradient-to-br from-[#065f46] to-[#11ba82] pt-12 pb-32 px-6">
//                 <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
//                     <div className="flex items-center gap-4">
//                         <button 
//                             onClick={() => navigate('/qa-hub/monthly')}
//                             className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-xl text-white transition-all backdrop-blur-md border border-white/20"
//                         >
//                             <i className="bi bi-arrow-left"></i>
//                         </button>
//                         <div>
//                             <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Coherence Entry</h1>
//                             <p className="text-emerald-100 text-[10px] font-bold tracking-widest uppercase">AOT-F-QA-03 | Quality Form</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="max-w-5xl mx-auto px-6 -mt-20">
//                 <form onSubmit={handleSubmit} className="space-y-6">
                    
//                     {/* Header Information Section */}
//                     <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 p-8 border border-white">
//                         <h3 className="text-[#11ba82] font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
//                             <span className="w-2 h-4 bg-[#11ba82] rounded-full"></span> Header Details
//                         </h3>
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                             <div className="space-y-1">
//                                 <label className="text-[10px] font-bold uppercase text-slate-400">Part Name</label>
//                                 <input required className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] outline-none font-semibold" 
//                                 value={formData.partName} onChange={(e) => handleChange('partName', e.target.value)} placeholder="Part Name" />
//                             </div>
//                             <div className="space-y-1">
//                                 <label className="text-[10px] font-bold uppercase text-slate-400">Part Number</label>
//                                 <input required className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] outline-none font-semibold" 
//                                 value={formData.partNo} onChange={(e) => handleChange('partNo', e.target.value)} placeholder="Part No" />
//                             </div>
//                             <div className="space-y-1">
//                                 <label className="text-[10px] font-bold uppercase text-slate-400">Audit Date</label>
//                                 <input required type="date" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] outline-none font-semibold" 
//                                 value={formData.date} onChange={(e) => handleChange('date', e.target.value)} />
//                             </div>
//                             <div className="space-y-1">
//                                 <label className="text-[10px] font-bold uppercase text-slate-400">Model</label>
//                                 <input required className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] outline-none font-semibold" 
//                                 value={formData.model} onChange={(e) => handleChange('model', e.target.value)} placeholder="Model" />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Dynamic Operation Details Section */}
//                     <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 p-8 border border-white">
//                         <div className="flex justify-between items-center mb-6">
//                             <h3 className="text-[#11ba82] font-black text-xs uppercase tracking-widest flex items-center gap-2">
//                                 <span className="w-2 h-4 bg-[#11ba82] rounded-full"></span> Operation Details
//                             </h3>
//                             <button type="button" onClick={addOperation} className="px-4 py-2 bg-emerald-100 text-[#11ba82] rounded-xl text-xs font-bold hover:bg-emerald-200">
//                                 + Add Operation
//                             </button>
//                         </div>

//                         {formData.operations.map((op, index) => (
//                             <div key={index} className="mb-8 pb-8 border-b-2 border-slate-100 last:border-0 last:mb-0 last:pb-0 relative">
//                                 {formData.operations.length > 1 && (
//                                     <button type="button" onClick={() => removeOperation(index)} className="absolute top-0 right-0 text-red-400 hover:text-red-600 text-sm font-bold">
//                                         <i className="bi bi-trash"></i> Remove
//                                     </button>
//                                 )}
//                                 <h4 className="text-slate-400 text-[10px] font-bold uppercase mb-4">Operation #{index + 1}</h4>
                                
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
//                                     <div className="space-y-1">
//                                         <label className="text-[10px] font-bold uppercase text-slate-400">Process Name</label>
//                                         <textarea rows="2" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] outline-none resize-none" 
//                                         value={op.processName} onChange={(e) => handleOperationChange(index, 'processName', e.target.value)} placeholder="Process description..." />
//                                     </div>
//                                     <div className="space-y-1">
//                                         <label className="text-[10px] font-bold uppercase text-slate-400">Machine / Jig / Fixture</label>
//                                         <textarea rows="2" className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] outline-none resize-none" 
//                                         value={op.machineJig} onChange={(e) => handleOperationChange(index, 'machineJig', e.target.value)} placeholder="Machine details..." />
//                                     </div>
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                                     <div className="space-y-1">
//                                         <label className="text-[10px] font-bold uppercase text-slate-400">PFD (Coherence)</label>
//                                         <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] outline-none text-sm" 
//                                         value={op.pfd} onChange={(e) => handleOperationChange(index, 'pfd', e.target.value)} placeholder="..." />
//                                     </div>
//                                     <div className="space-y-1">
//                                         <label className="text-[10px] font-bold uppercase text-slate-400">PFMEA (Coherence)</label>
//                                         <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] outline-none text-sm" 
//                                         value={op.pfmea} onChange={(e) => handleOperationChange(index, 'pfmea', e.target.value)} placeholder="..." />
//                                     </div>
//                                     <div className="space-y-1">
//                                         <label className="text-[10px] font-bold uppercase text-slate-400">Spec OS / WI</label>
//                                         <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] outline-none text-sm" 
//                                         value={op.specOSWI} onChange={(e) => handleOperationChange(index, 'specOSWI', e.target.value)} placeholder="..." />
//                                     </div>
//                                     <div className="space-y-1">
//                                         <label className="text-[10px] font-bold uppercase text-slate-400">Spec as per Standard</label>
//                                         <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] outline-none text-sm" 
//                                         value={op.specStd} onChange={(e) => handleOperationChange(index, 'specStd', e.target.value)} placeholder="..." />
//                                     </div>
//                                     <div className="space-y-1">
//                                         <label className="text-[10px] font-bold uppercase text-slate-400">Inspection FIS</label>
//                                         <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] outline-none text-sm" 
//                                         value={op.inspectionFIS} onChange={(e) => handleOperationChange(index, 'inspectionFIS', e.target.value)} placeholder="..." />
//                                     </div>
//                                     <div className="space-y-1">
//                                         <label className="text-[10px] font-bold uppercase text-slate-400">Remarks</label>
//                                         <input className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] outline-none text-sm font-black text-emerald-600" 
//                                         value={op.remarks} onChange={(e) => handleOperationChange(index, 'remarks', e.target.value)} placeholder="OK / NOT OK" />
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     {/* Sign-off Section */}
//                     <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 p-8 border border-white">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                             <div className="space-y-1">
//                                 <label className="text-[10px] font-bold uppercase text-slate-400">Prepared By</label>
//                                 <input required className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] outline-none font-semibold" 
//                                 value={formData.preparedBy} onChange={(e) => handleChange('preparedBy', e.target.value)} placeholder="Name / Sign" />
//                             </div>
//                             <div className="space-y-1">
//                                 <label className="text-[10px] font-bold uppercase text-slate-400">Verified By</label>
//                                 <input required className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#11ba82] outline-none font-semibold" 
//                                 value={formData.verifiedBy} onChange={(e) => handleChange('verifiedBy', e.target.value)} placeholder="Name / Sign" />
//                             </div>
//                         </div>
//                     </div>

//                     {/* Action Bar */}
//                     <div className="bg-white/80 backdrop-blur-md sticky bottom-6 rounded-3xl border border-white shadow-2xl p-4 flex justify-between items-center z-30">
//                         <button type="button" onClick={() => navigate('/qa-hub/monthly')} className="px-6 py-2 text-slate-400 font-bold hover:text-red-500 transition-all text-sm">
//                             <i className="bi bi-x-circle me-2"></i> Exit
//                         </button>
                        
//                         <div className="flex gap-4">
//                             <button type="button" onClick={resetForm} className="px-8 py-2.5 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200">
//                                 Reset
//                             </button>
//                             <button type="submit" disabled={isSubmitting} className="px-12 py-3 bg-[#11ba82] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-green-500/30 hover:bg-[#0e9a6c] transition-all disabled:opacity-50">
//                                 {isSubmitting ? 'Submitting...' : 'Submit Record'}
//                             </button>
//                         </div>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default CoherenceChecklist;
