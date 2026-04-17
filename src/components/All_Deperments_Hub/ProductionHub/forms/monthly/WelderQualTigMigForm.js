import React, { useState, useRef } from 'react'; // Added useRef
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const WelderQualificationForm = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null); // Ref for photo upload
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Photo preview state
    const [welderPhoto, setWelderPhoto] = useState(null);

    // Initial state with all fields from your Excel image
    const [trials, setTrials] = useState([
        { id: Date.now(), currRange: '', currActual: '', voltRange: '', voltActual: '', gasRange: '', gasActual: '', depositThickness: '', defect: '' }
    ]);

    // Handle Photo Upload & Preview
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setWelderPhoto(reader.result); // Set preview URL
            };
            reader.readAsDataURL(file);
        }
    };

    const addRow = () => {
        setTrials([...trials, { id: Date.now(), currRange: '', currActual: '', voltRange: '', voltActual: '', gasRange: '', gasActual: '', depositThickness: '', defect: '' }]);
    };

    const removeRow = (id) => {
        if (trials.length > 1) setTrials(trials.filter(t => t.id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            alert("Welder Qualification Test Saved Successfully!");
            setIsSubmitting(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#fffcf9] font-sans text-slate-900 pb-24 flex flex-col items-center">
            <div className="w-full max-w-6xl px-4 mt-8">
                
                {/* --- 1. Action Bar (Back Button) --- */}
                <div className="flex justify-start mb-6">
                    <button 
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-orange-200 text-slate-800 rounded-xl hover:bg-orange-50 transition-all shadow-sm font-bold text-xs active:scale-95"
                    >
                        <i className="bi bi-arrow-left text-orange-500 transition-transform group-hover:-translate-x-1"></i> 
                        Back to Hub
                    </button>
                </div>

                {/* --- 2. Header Section (Orange Gradient) --- */}
                <div className="w-full bg-gradient-to-r from-[#fff7ed] via-[#ffedd5] to-[#fed7aa] rounded-t-[2.5rem] p-10 text-center border-b border-orange-100 shadow-sm">
                    <h1 className="text-3xl md:text-5xl font-black text-orange-900 tracking-tighter uppercase italic">
                        Welder Qualification <span className="text-orange-600 block md:inline text-2xl md:text-5xl">Test</span>
                    </h1>
                    <p className="text-orange-800/60 text-[10px] font-bold mt-2 tracking-[0.3em] uppercase underline decoration-orange-300 decoration-2 underline-offset-4">
                        Manufacturing & Process Compliance
                    </p>
                </div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-b-[2.5rem] shadow-2xl border-x border-b border-orange-50 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8 md:p-14 space-y-12">
                        
                        {/* 3. Reference & Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <InputField label="REF. WPS NO." placeholder="e.g. WPS-09" />
                            <InputField label="Testing Date" type="date" />
                            <InputField label="Welding Process" placeholder="MIG / TIG" />
                            <InputField label="Machine No." placeholder="M/C-01" />
                        </div>

                        {/* 4. Welding Details & Variables (Mixed Grid) */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4 bg-orange-50/30 p-8 rounded-[2rem] border border-orange-100">
                                <h3 className="text-xs font-black text-orange-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <div className="w-1.5 h-4 bg-orange-400"></div> Welding Details
                                </h3>
                                <InputField label="Base Metal (to be weld)" />
                                <InputField label="Base Metal Thickness" />
                                <InputField label="Base Metal Size" />
                                <InputField label="Welding position" />
                            </div>

                            <div className="space-y-4 bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                                <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <div className="w-1.5 h-4 bg-slate-400"></div> Variables
                                </h3>
                                <InputField label="Filler Material" />
                                <InputField label="Filler Material Size" />
                                <InputField label="Shielding Gas" />
                                <InputField label="Wire Feed speed" />
                            </div>
                        </div>

                        {/* 5. Trial Table (Dynamic Rows) */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-end px-2">
                                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Process Parameters Trial</h3>
                                <button type="button" onClick={addRow} className="px-4 py-2 bg-orange-100 text-orange-700 rounded-xl font-bold text-[10px] uppercase hover:bg-orange-200 transition-all">+ Add Trial</button>
                            </div>

                            <div className="overflow-x-auto rounded-3xl border border-slate-200">
                                <table className="w-full text-center border-collapse">
                                    <thead className="bg-slate-800 text-white text-[9px] uppercase tracking-tighter">
                                        <tr>
                                            <th rowSpan="2" className="p-3 border-r border-slate-700 w-12">Trial</th>
                                            <th colSpan="2" className="p-2 border-r border-slate-700">Current (Amp)</th>
                                            <th colSpan="2" className="p-2 border-r border-slate-700">Voltage (Volt)</th>
                                            <th colSpan="2" className="p-2 border-r border-slate-700">Gas Flow (L/m)</th>
                                            <th rowSpan="2" className="p-2 border-r border-slate-700">Weld Deposit<br/>Thickness</th>
                                            <th rowSpan="2" className="p-2 border-r border-slate-700">Defect</th>
                                            <th rowSpan="2" className="p-2">Action</th>
                                        </tr>
                                        <tr className="bg-slate-700">
                                            <th className="p-1 border-r border-slate-600">Range</th><th className="p-1 border-r border-slate-600">Actual</th>
                                            <th className="p-1 border-r border-slate-600">Range</th><th className="p-1 border-r border-slate-600">Actual</th>
                                            <th className="p-1 border-r border-slate-600">Range</th><th className="p-1 border-r border-slate-600">Actual</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 italic">
                                        {trials.map((trial, index) => (
                                            <tr key={trial.id} className="text-xs hover:bg-orange-50/30 transition-all">
                                                <td className="p-2 font-black text-slate-400 border-r">{index + 1}</td>
                                                <td className="p-1 border-r"><input className="w-full text-center p-2 bg-transparent outline-none focus:bg-white rounded" placeholder="-" /></td>
                                                <td className="p-1 border-r"><input className="w-full text-center p-2 bg-transparent outline-none focus:bg-white rounded" placeholder="-" /></td>
                                                <td className="p-1 border-r"><input className="w-full text-center p-2 bg-transparent outline-none focus:bg-white rounded" placeholder="-" /></td>
                                                <td className="p-1 border-r"><input className="w-full text-center p-2 bg-transparent outline-none focus:bg-white rounded" placeholder="-" /></td>
                                                <td className="p-1 border-r"><input className="w-full text-center p-2 bg-transparent outline-none focus:bg-white rounded" placeholder="-" /></td>
                                                <td className="p-1 border-r"><input className="w-full text-center p-2 bg-transparent outline-none focus:bg-white rounded" placeholder="-" /></td>
                                                <td className="p-1 border-r"><input className="w-full text-center p-2 bg-transparent outline-none focus:bg-white rounded" placeholder="-" /></td>
                                                <td className="p-1 border-r"><input className="w-full text-center p-2 bg-transparent outline-none focus:bg-white rounded" placeholder="-" /></td>
                                                <td className="p-1"><button type="button" onClick={() => removeRow(trial.id)} className="text-red-300 hover:text-red-500"><i className="bi bi-trash"></i></button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 6. Result Results Checklist & DARKER PHOTO UPLOAD */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            <div className="lg:col-span-8 space-y-5 bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-inner">
                                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Test Result on Sample</h3>
                                {['1) Visual Test', '2) Defect', '3) Strength Test', '4) Root Bend Test', '5) Face Bend Test'].map(test => (
                                    <div key={test} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-100">
                                        <span className="text-[11px] font-bold text-slate-600 uppercase">{test}</span>
                                        <select className="bg-slate-50 border-none rounded-lg text-[10px] font-black uppercase px-4 py-2 focus:ring-1 focus:ring-orange-400">
                                            <option>Ok / Not ok</option>
                                            <option>Acceptable (Ok)</option>
                                            <option>Rejected (Not ok)</option>
                                        </select>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Photo Upload with Fix & Darker Text */}
                            <div className="lg:col-span-4 flex flex-col items-center justify-center p-8 border-2 border-dashed border-orange-200 rounded-[2rem] bg-orange-50/20 group hover:bg-orange-50 transition-all cursor-pointer overflow-hidden"
                                onClick={() => fileInputRef.current.click()} // Trigger input click
                            >
                                {welderPhoto ? (
                                    <img src={welderPhoto} alt="Welder" className="w-full h-32 object-cover rounded-xl shadow-md" />
                                ) : (
                                    <>
                                        <i className="bi bi-camera text-4xl text-orange-300 group-hover:scale-110 transition-transform"></i>
                                        {/* Darker and Bolder text for visibility */}
                                        <p className="mt-2 text-[11px] font-black text-slate-800 uppercase">Upload Welder Photo</p>
                                        <p className="text-[9px] text-orange-700 font-bold mt-1">(Click to select)</p>
                                    </>
                                )}
                                <input 
                                    type="file" 
                                    ref={fileInputRef} // Ref attached
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={handlePhotoChange} 
                                />
                            </div>
                        </div>

                        {/* 7. Certification & Signatures with DARKER DECLARATION */}
                        <div className="p-8 md:p-12 bg-[#fffaf5] rounded-[2.5rem] border border-orange-100 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <InputField label="Name of Welder" placeholder="Full name..." />
                                <InputField label="Welding test conducted by" />
                                <InputField label="Welding test verified by" />
                            </div>

                            <div className="pt-10 border-t border-orange-100 flex flex-col md:flex-row justify-between items-end gap-10">
                                <div className="max-w-lg">
                                    {/* Made Darker and More Bold */}
                                    <p className="text-[12px] font-black text-slate-800 italic leading-relaxed">
                                        "Herewith, we certify that based on above observation, welder is Qualified / Not Qualified to carry out _____ welding process."
                                    </p>
                                </div>
                                {/* Authorised Signatory Block */}
                                <div className="text-center">
                                    <div className="w-48 h-20 border-b border-orange-300 mb-2"></div>
                                    <p className="text-[11px] font-black text-orange-800 uppercase tracking-widest">Authorised Signatory</p>
                                </div>
                            </div>
                        </div>

                        {/* 8. Final Action Button (Small Professional) */}
                        <div className="flex justify-center md:justify-end pt-4">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={`px-12 py-4 rounded-xl font-black text-white text-[11px] tracking-[0.2em] transition-all shadow-xl active:scale-[0.98] ${
                                    isSubmitting ? 'bg-slate-300' : 'bg-[#ea580c] hover:bg-orange-600 hover:shadow-orange-200 shadow-orange-100'
                                }`}
                            >
                                {isSubmitting ? 'SAVING...' : 'SAVE QUALIFICATION TEST'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

// Reusable Components
const InputField = ({ label, type = "text", placeholder }) => (
    <div className="flex flex-col gap-2">
        <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest ml-1">{label}</label>
        <input 
            type={type} 
            placeholder={placeholder}
            className="w-full p-4 bg-white border border-slate-200 focus:border-orange-400 rounded-2xl outline-none transition-all font-bold text-sm text-slate-700 shadow-sm"
        />
    </div>
);

export default WelderQualificationForm;