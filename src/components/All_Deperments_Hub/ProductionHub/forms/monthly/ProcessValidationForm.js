import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ProcessValidationForm = () => {
    const navigate = useNavigate();
    
    const initialState = {
        validationDate: '',
        revalidationDate: '',
        processName: '',
        materialDetails: '',
        machineNo: '',
        processOwner: '',
        partName: '',
        fixtureNo: '',
        operators: ['', '', '', ''],
        // Added defensive empty arrays to prevent .map() errors
        parameters: Array(8).fill({ spec: '', unit: '', remark: '' }),
        trials: Array(8).fill({ p1:'', p2:'', p3:'', p4:'', p5:'', p6:'', p7:'', p8:'', specified:'', observed:'', decision:'' }),
        finalParams: Array(7).fill({ spec: '', min: '', max: '', remark: '' }),
        conclusion: 'Based on above trials, existing process parameter on control plan are ok, following process parameters are finalised & accordingly control plan is changed.',
        preparedBy: '',
        approvedBy: ''
    };

    const [formData, setFormData] = useState(initialState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            alert("Success! Complete Process Validation Report Saved.");
            setIsSubmitting(false);
            setFormData(initialState); 
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 pb-20 flex flex-col items-center">
            
            <div className="w-full max-w-4xl px-4 mt-10">
                
                {/* Back Button */}
                <div className="flex justify-start mb-4">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg font-bold text-xs shadow-sm active:scale-95">
                        <i className="bi bi-chevron-left text-[#13ba82]"></i> Back
                    </button>
                </div>

                {/* Header Section (Emerald Gradient) */}
                <div className="w-full bg-gradient-to-r from-[#13ba82] via-[#10a371] to-[#0d8a5f] rounded-t-[2rem] p-8 md:p-10 text-center shadow-lg">
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase italic">
                        Manufacturing Process Validation <span className="text-emerald-200">Report</span>
                    </h1>
                    <p className="text-emerald-100 text-[10px] font-bold mt-2 tracking-[0.3em] uppercase opacity-90">
                        AtomOne Quality Systems | Doc No: AOT-F-PROD-05
                    </p>
                </div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-b-[2rem] shadow-2xl border-x border-b border-slate-100 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-12">
                        
                        {/* 1. Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Validation Date" type="date" />
                            <InputField label="Next Re-validation Due" type="date" />
                            <InputField label="Process" placeholder="e.g. Arc Welding" />
                            <InputField label="Material Details" placeholder="Material Specs..." />
                            <InputField label="M/C No." />
                            <InputField label="Process Owner" />
                            <InputField label="Part Name" />
                            <InputField label="Tooling / Fixture No." />
                        </div>

                        {/* 2. Operators */}
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-4 block">M/C Operators</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {formData.operators?.map((op, i) => (
                                    <input key={i} placeholder={`Operator ${i+1}`} className="p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-[#13ba82] shadow-sm" />
                                ))}
                            </div>
                        </div>

                        {/* 3. Parameters (P1-P8) */}
                        <div>
                            <SectionHeading title="Manufacturing Process Parameters" />
                            <div className="overflow-x-auto border border-slate-100 rounded-2xl shadow-inner">
                                <table className="w-full text-xs">
                                    <thead className="bg-slate-50 font-black uppercase text-slate-500">
                                        <tr>
                                            <th className="p-4 border-b w-16 text-center">No.</th>
                                            <th className="p-4 border-b text-left">Parameter Specification</th>
                                            <th className="p-4 border-b text-left w-32">Unit</th>
                                            <th className="p-4 border-b text-left">Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {formData.parameters?.map((_, i) => (
                                            <tr key={i} className="hover:bg-emerald-50/30">
                                                <td className="p-3 text-center font-bold text-[#13ba82]">P{i+1}</td>
                                                <td className="p-2"><input className="w-full p-2 bg-slate-50/50 rounded-lg outline-none focus:bg-white border border-transparent focus:border-emerald-100" /></td>
                                                <td className="p-2"><input className="w-full p-2 bg-slate-50/50 rounded-lg outline-none focus:bg-white border border-transparent focus:border-emerald-100" /></td>
                                                <td className="p-2"><input className="w-full p-2 bg-slate-50/50 rounded-lg outline-none focus:bg-white border border-transparent focus:border-emerald-100" /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 4. Trials Grid (The complex part from Excel) */}
                        <div>
                            <SectionHeading title="Trials / Experiments Log" />
                            <div className="overflow-x-auto border border-slate-100 rounded-2xl shadow-inner">
                                <table className="w-full text-[10px] text-center border-collapse">
                                    <thead className="bg-slate-800 text-white font-bold uppercase">
                                        <tr>
                                            <th rowSpan="2" className="p-2 border border-slate-700 w-10 text-[8px]">Trial</th>
                                            <th colSpan="8" className="p-2 border border-slate-700 italic tracking-widest text-[8px]">Process Parameters Number</th>
                                            <th colSpan="2" className="p-2 border border-slate-700 text-[8px]">Characteristics</th>
                                            <th rowSpan="2" className="p-2 border border-slate-700 text-[8px]">Decision</th>
                                        </tr>
                                        <tr className="bg-slate-700">
                                            {[1,2,3,4,5,6,7,8].map(n => <th key={n} className="p-1 border border-slate-600">P{n}</th>)}
                                            <th className="p-1 border border-slate-600">Spec</th>
                                            <th className="p-1 border border-slate-600">Obs</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {formData.trials?.map((_, i) => (
                                            <tr key={i} className="hover:bg-emerald-50/50">
                                                <td className="p-2 border-r border-slate-100 font-bold bg-slate-50/50">{i+1}</td>
                                                {[...Array(11)].map((_, n) => (
                                                    <td key={n} className="p-1 border-r border-slate-100">
                                                        <input className="w-full text-center bg-transparent outline-none focus:bg-white rounded" />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 5. Conclusion */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Final Conclusion</label>
                            <textarea 
                                rows="3" 
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold outline-none focus:border-[#13ba82] focus:bg-white shadow-inner"
                                defaultValue={formData.conclusion}
                            />
                        </div>

                        {/* 6. Selection Table (P1-P7) */}
                        <div>
                            <SectionHeading title="Final Process Parameters Selection" />
                            <div className="overflow-x-auto border border-slate-100 rounded-2xl shadow-inner">
                                <table className="w-full text-xs">
                                    <thead className="bg-emerald-50 font-black uppercase text-emerald-700">
                                        <tr>
                                            <th className="p-4 border-b w-16">No.</th>
                                            <th className="p-4 border-b text-left">Parameter Specification</th>
                                            <th className="p-4 border-b">Min Limit</th>
                                            <th className="p-4 border-b">Max Limit</th>
                                            <th className="p-4 border-b">Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {formData.finalParams?.map((_, i) => (
                                            <tr key={i}>
                                                <td className="p-3 text-center font-bold text-emerald-600">P{i+1}</td>
                                                <td className="p-2"><input className="w-full p-2 bg-slate-50/50 rounded-lg outline-none focus:bg-white border border-transparent focus:border-emerald-100" /></td>
                                                <td className="p-2 w-24"><input className="w-full p-2 bg-white border border-slate-100 rounded-lg outline-none text-center font-bold text-emerald-600" /></td>
                                                <td className="p-2 w-24"><input className="w-full p-2 bg-white border border-slate-100 rounded-lg outline-none text-center font-bold text-emerald-600" /></td>
                                                <td className="p-2"><input className="w-full p-2 bg-slate-50/50 rounded-lg outline-none focus:bg-white border border-transparent focus:border-emerald-100" /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 7. Footer Signatures */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-10">
                            <InputField label="Prepared By (Name & Sign)" />
                            <InputField label="Approved By (Name & Sign)" />
                        </div>

                        <div className="flex justify-end pt-4 pb-4">
                            <button type="submit" disabled={isSubmitting} className={`w-full sm:w-auto px-16 py-4 rounded-2xl font-black text-white text-xs tracking-widest shadow-xl transition-all ${isSubmitting ? 'bg-slate-400' : 'bg-[#13ba82] hover:bg-emerald-600 active:scale-95 shadow-emerald-100'}`}>
                                {isSubmitting ? 'SAVING...' : 'SAVE COMPLETE REPORT'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

// Sub-components to keep code clean
const SectionHeading = ({ title }) => (
    <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-[0.15em] mb-5 flex items-center gap-3">
        <span className="w-3 h-3 bg-[#13ba82] rounded-full shadow-lg shadow-emerald-200"></span> {title}
    </h3>
);

const InputField = ({ label, type = "text", placeholder }) => (
    <div className="flex flex-col gap-2">
        <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest ml-1">{label}</label>
        <input type={type} placeholder={placeholder} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#13ba82] focus:bg-white rounded-2xl outline-none text-sm font-bold shadow-inner transition-all" />
    </div>
);

export default ProcessValidationForm;