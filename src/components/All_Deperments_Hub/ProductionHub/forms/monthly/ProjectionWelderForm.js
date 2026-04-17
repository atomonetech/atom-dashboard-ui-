import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ProjectionWelderForm = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [welderPhoto, setWelderPhoto] = useState(null);

    const [trials, setTrials] = useState([
        { id: Date.now(), squeeze: '', weld: '', hold: '', off: '', current: '', pressure: '', torque: '', visual: 'Ok' }
    ]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setWelderPhoto(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const addRow = () => {
        setTrials([...trials, { id: Date.now(), squeeze: '', weld: '', hold: '', off: '', current: '', pressure: '', torque: '', visual: 'Ok' }]);
    };

    const removeRow = (id) => {
        if (trials.length > 1) setTrials(trials.filter(t => t.id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            alert("Projection Welder Qualification Saved Successfully!");
            setIsSubmitting(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#fffafa] font-sans text-slate-900 pb-24 flex flex-col items-center">
            
            <div className="w-full max-w-6xl px-4 mt-8">
                
                {/* --- Back Button --- */}
                <div className="flex justify-start mb-6">
                    <button 
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-red-200 text-slate-800 rounded-xl hover:bg-red-50 transition-all shadow-sm font-bold text-xs active:scale-95"
                    >
                        <i className="bi bi-arrow-left text-[#fa3535]"></i> 
                        Back to Hub
                    </button>
                </div>

                {/* --- Header Section (Red Gradient) --- */}
                <div className="w-full bg-gradient-to-r from-[#fa3535] via-[#d92b2b] to-[#b31d1d] rounded-t-[2.5rem] p-8 md:p-12 text-center shadow-lg">
                    <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight uppercase italic">
                        Welder Qualification <span className="text-red-200">Test</span>
                    </h1>
                    <p className="text-red-100 text-[10px] md:text-xs font-bold mt-2 tracking-[0.3em] uppercase opacity-90">
                        ( PROJECTION WELDER ) | Doc No: AOT/F/PROD/07
                    </p>
                </div>

                {/* --- Main Form Card --- */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-b-[2.5rem] shadow-2xl border-x border-b border-red-50 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 md:p-12 space-y-10">
                        
                        {/* 1. Header Information Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-50 pb-8">
                            <InputField label="REF. WPS NO." placeholder="e.g. WPS-PRJ-09" />
                            <InputField label="DATE" type="date" />
                        </div>

                        {/* 2. Welding Process Input Field (ADDED HERE) */}
                        <div className="bg-white p-2">
                            <InputField 
                                label="Welding Process" 
                                placeholder="Enter Welding Process (e.g. PROJECTION WELDING)" 
                                defaultValue="PROJECTION WELDING"
                            />
                        </div>

                        {/* 3. Process Details (Sr. No 1 to 4) */}
                        <div className="space-y-4 bg-red-50/20 p-8 rounded-[2rem] border border-red-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <InputField label="1. Base Metal (to be weld)" placeholder="e.g. Mild Steel" />
                                <InputField label="2. Base Metal Thickness" placeholder="e.g. 2.0 mm" />
                                <InputField label="3. Machine No." placeholder="e.g. PRJ-MCH-01" />
                                <div className="flex flex-col gap-2 justify-end">
                                    <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest ml-1">4. Test Results</label>
                                    <div className="p-4 bg-white/60 border border-slate-200 rounded-2xl text-[10px] font-bold text-slate-400 italic">
                                        Trials & Parameters are recorded in the table below...
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. Trial Table (Process Parameter Specification) */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end px-2">
                                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1.5 h-4 bg-[#fa3535]"></div> Process Parameters Specification
                                </h3>
                                <button type="button" onClick={addRow} className="px-4 py-2 bg-red-100 text-[#fa3535] rounded-xl font-bold text-[10px] uppercase hover:bg-red-200 transition-all">+ Add Trial</button>
                            </div>

                            <div className="overflow-x-auto rounded-3xl border border-slate-200">
                                <table className="w-full text-center border-collapse">
                                    <thead className="bg-slate-800 text-white text-[9px] uppercase tracking-tighter">
                                        <tr className="border-b border-slate-700 font-black">
                                            <th rowSpan="2" className="p-3 border-r border-slate-700 w-12">Trial</th>
                                            <th className="p-2 border-r border-slate-700">Squeeze Time (Cycle)</th>
                                            <th className="p-2 border-r border-slate-700">Weld Time (Cycle)</th>
                                            <th className="p-2 border-r border-slate-700">Hold Time (Cycle)</th>
                                            <th className="p-2 border-r border-slate-700">Off Time (Cycle)</th>
                                            <th rowSpan="2" className="p-2 border-r border-slate-700 bg-slate-900">Current<br/>(Amp, KA)</th>
                                            <th rowSpan="2" className="p-2 border-r border-slate-700 bg-slate-900">Air Pressure<br/>(Bar)</th>
                                            <th rowSpan="2" className="p-2 border-r border-slate-700">Torque Test<br/>(Kgfm)</th>
                                            <th rowSpan="2" className="p-2 border-r border-slate-700">Visual Inspection<br/>(Ok/Not)</th>
                                            <th rowSpan="2" className="p-2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 italic">
                                        {trials.map((trial, index) => (
                                            <tr key={trial.id} className="text-xs hover:bg-red-50/30 transition-all font-bold">
                                                <td className="p-2 font-black text-slate-400 border-r bg-slate-50/50">{index + 1}</td>
                                                <td className="p-1 border-r"><input className="w-full text-center p-2 bg-transparent outline-none focus:bg-white rounded" /></td>
                                                <td className="p-1 border-r"><input className="w-full text-center p-2 bg-transparent outline-none focus:bg-white rounded" /></td>
                                                <td className="p-1 border-r"><input className="w-full text-center p-2 bg-transparent outline-none focus:bg-white rounded" /></td>
                                                <td className="p-1 border-r"><input className="w-full text-center p-2 bg-transparent outline-none focus:bg-white rounded" /></td>
                                                <td className="p-1 border-r"><input className="w-full text-center p-2 bg-transparent outline-none focus:bg-white rounded text-red-600 font-black" /></td>
                                                <td className="p-1 border-r"><input className="w-full text-center p-2 bg-transparent outline-none focus:bg-white rounded" /></td>
                                                <td className="p-1 border-r"><input className="w-full text-center p-2 bg-transparent outline-none focus:bg-white rounded font-black" /></td>
                                                <td className="p-1 border-r">
                                                    <select className="bg-transparent border-none text-[10px] font-black uppercase outline-none cursor-pointer">
                                                        <option>Ok</option>
                                                        <option>Not Ok</option>
                                                    </select>
                                                </td>
                                                <td className="p-1"><button type="button" onClick={() => removeRow(trial.id)} className="text-slate-300 hover:text-red-500"><i className="bi bi-trash"></i></button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 5. Signatures, Photo & Declaration */}
                        <div className="p-8 md:p-12 bg-[#fffaf5] rounded-[2.5rem] border border-red-100 space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                <InputField label="Name of Welder" placeholder="Full name..." />
                                <InputField label="Welding test conducted by" />
                                <InputField label="Welding test verified by" />
                            </div>

                            <div className="pt-10 border-t border-red-100 flex flex-col md:flex-row justify-between items-center gap-12">
                                <div className="max-w-xl text-center md:text-left">
                                    <p className="text-[13px] font-black text-slate-800 italic leading-relaxed">
                                        "Herewith, we certify that, based on above observation, welder is <span className="text-[#fa3535] underline decoration-2 underline-offset-4">Qualified / Not Qualified</span> to carry out Projection Welding Process."
                                    </p>
                                </div>
                                
                                {/* Photo Upload */}
                                <div 
                                    className="w-44 h-52 border-2 border-dashed border-red-200 rounded-3xl flex flex-col items-center justify-center bg-white hover:bg-red-50 transition-all cursor-pointer overflow-hidden group shadow-inner"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    {welderPhoto ? (
                                        <img src={welderPhoto} alt="Welder" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <i className="bi bi-person-badge text-5xl text-red-100 group-hover:scale-110 transition-transform"></i>
                                            <span className="text-[10px] font-black text-slate-400 uppercase mt-3">WELDER PHOTO</span>
                                        </>
                                    )}
                                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoChange} />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <div className="text-center w-64 border-t-2 border-slate-300 pt-3">
                                    <p className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em]">Authorised Signatory</p>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-4">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={`px-16 py-5 rounded-2xl font-black text-white text-[12px] tracking-[0.3em] transition-all shadow-xl active:scale-[0.98] ${
                                    isSubmitting ? 'bg-slate-300' : 'bg-gradient-to-r from-[#fa3535] to-[#b31d1d] hover:shadow-red-200'
                                }`}
                            >
                                {isSubmitting ? 'PROCESSING...' : 'SAVE QUALIFICATION REPORT'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

const InputField = ({ label, type = "text", placeholder, defaultValue }) => (
    <div className="flex flex-col gap-2.5">
        <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest ml-1">{label}</label>
        <input 
            type={type} 
            placeholder={placeholder}
            defaultValue={defaultValue}
            className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-[#fa3535] rounded-2xl outline-none transition-all font-bold text-sm text-slate-700 shadow-sm focus:bg-white"
        />
    </div>
);

export default ProjectionWelderForm;