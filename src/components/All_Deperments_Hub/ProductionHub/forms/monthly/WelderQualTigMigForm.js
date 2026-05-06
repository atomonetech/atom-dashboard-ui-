import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../../../../../config/api';

const WelderQualificationForm = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [welderPhoto, setWelderPhoto] = useState(null);

    // UPDATED: 'thickness' changed to 'baseMetalThickness'
    const [formData, setFormData] = useState({
        wpsNo: '', 
        testingDate: '', 
        weldingProcess: '', 
        machineNo: '', 
        baseMetal: '', 
        baseMetalThickness: '', 
        baseMetalSize: '', 
        weldingPosition: '', 
        fillerMaterial: '', 
        fillerMaterialSize: '', 
        shieldingGas: '', 
        wireFeedSpeed: '', 
        visualTest: '', 
        defectSelect: '', 
        strengthTest: '', 
        rootBend: '', 
        faceBend: '', 
        welderName: '', 
        conductedBy: '', 
        verifiedBy: ''
    });

    
    const [trials, setTrials] = useState([
        { currRange: '', currActual: '', voltRange: '', voltActual: '', gasRange: '', gasActual: '', depositThickness: '', defect: '' }
    ]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // UPDATED: Using array index instead of id
    const handleTrialChange = (index, field, value) => {
        const newTrials = [...trials];
        newTrials[index][field] = value;
        setTrials(newTrials);
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setWelderPhoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    
    const addRow = () => {
        setTrials([...trials, { currRange: '', currActual: '', voltRange: '', voltActual: '', gasRange: '', gasActual: '', depositThickness: '', defect: '' }]);
    };

    
    const removeRow = (index) => {
        if (trials.length > 1) {
            setTrials(trials.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const payload = { ...formData, trials, welderPhoto };
            const response = await fetch(getApiUrl('/api/save-tig-mig-welder/'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Welder Qualification Test Saved Successfully!");
            } else {
                alert("Failed to save data.");
            }
        } catch (error) {
            console.error("Error saving data:", error);
            alert("An error occurred while saving.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fffcf9] font-sans text-slate-900 pb-24 flex flex-col items-center">
            <div className="w-full max-w-6xl px-4 mt-8">
                
                <div className="flex justify-start mb-6">
                    <button 
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 px-8 py-4 bg-white border border-orange-200 text-slate-800 rounded-none hover:bg-orange-50 transition-all shadow-sm font-bold text-sm active:scale-95"
                    >
                        <i className="bi bi-arrow-left text-orange-500 transition-transform group-hover:-translate-x-1"></i> 
                        Back to Hub
                    </button>
                </div>

                <div className="w-full bg-gradient-to-r from-[#fff7ed] via-[#ffedd5] to-[#fed7aa] p-10 text-center border-b border-orange-100 shadow-sm">
                    <h1 className="text-3xl md:text-5xl font-black text-orange-900 tracking-tighter uppercase italic">
                        Welder Qualification <span className="text-orange-600 block md:inline text-2xl md:text-5xl">Test</span>
                    </h1>
                    <p className="text-orange-800/60 text-[10px] font-bold mt-2 tracking-[0.3em] uppercase underline decoration-orange-300 decoration-2 underline-offset-4">
                        Manufacturing & Process Compliance
                    </p>
                </div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white shadow-2xl border-x border-b border-orange-50 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-8 md:p-14 space-y-12">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <InputField label="REF. WPS NO." name="wpsNo" value={formData.wpsNo} onChange={handleInputChange} placeholder="e.g. WPS-09" />
                            <InputField label="Testing Date" name="testingDate" value={formData.testingDate} onChange={handleInputChange} type="date" />
                            <InputField label="Welding Process" name="weldingProcess" value={formData.weldingProcess} onChange={handleInputChange} placeholder="MIG / TIG" />
                            <InputField label="Machine No." name="machineNo" value={formData.machineNo} onChange={handleInputChange} placeholder="M/C-01" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4 bg-orange-50/30 p-8 border border-orange-100">
                                <h3 className="text-xs font-black text-orange-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <div className="w-1.5 h-4 bg-orange-400"></div> Welding Details
                                </h3>
                                <InputField label="Base Metal (to be weld)" name="baseMetal" value={formData.baseMetal} onChange={handleInputChange} />
                                
                                {/* Base Metal Thickness Field Updated */}
                                <InputField label="Base Metal Thickness" name="baseMetalThickness" value={formData.baseMetalThickness} onChange={handleInputChange} />
                                
                                <InputField label="Base Metal Size" name="baseMetalSize" value={formData.baseMetalSize} onChange={handleInputChange} />
                                <InputField label="Welding position" name="weldingPosition" value={formData.weldingPosition} onChange={handleInputChange} />
                            </div>

                            <div className="space-y-4 bg-slate-50 p-8 border border-slate-100">
                                <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <div className="w-1.5 h-4 bg-slate-400"></div> Variables
                                </h3>
                                <InputField label="Filler Material" name="fillerMaterial" value={formData.fillerMaterial} onChange={handleInputChange} />
                                <InputField label="Filler Material Size" name="fillerMaterialSize" value={formData.fillerMaterialSize} onChange={handleInputChange} />
                                <InputField label="Shielding Gas" name="shieldingGas" value={formData.shieldingGas} onChange={handleInputChange} />
                                <InputField label="Wire Feed speed" name="wireFeedSpeed" value={formData.wireFeedSpeed} onChange={handleInputChange} />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-end px-2">
                                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Process Parameters Trial</h3>
                                <button type="button" onClick={addRow} className="px-6 py-3 bg-orange-100 text-orange-700 rounded-none font-bold text-xs uppercase hover:bg-orange-200 transition-all">+ Add Trial</button>
                            </div>

                            <div className="overflow-x-auto border border-slate-200">
                                <table className="w-full text-center border-collapse table-fixed">
                                    <thead className="bg-slate-800 text-white text-[9px] uppercase tracking-tighter">
                                        <tr>
                                            <th rowSpan="2" className="p-3 border-r border-slate-700 w-12">Trial</th>
                                            <th colSpan="2" className="p-2 border-r border-slate-700">Current (Amp)</th>
                                            <th colSpan="2" className="p-2 border-r border-slate-700">Voltage (Volt)</th>
                                            <th colSpan="2" className="p-2 border-r border-slate-700">Gas Flow (L/m)</th>
                                            <th rowSpan="2" className="p-2 border-r border-slate-700">Weld Deposit<br/>Thickness</th>
                                            <th rowSpan="2" className="p-2 border-r border-slate-700">Defect</th>
                                            <th rowSpan="2" className="p-2 w-16">Action</th>
                                        </tr>
                                        <tr className="bg-slate-700">
                                            <th className="p-1 border-r border-slate-600 w-16">Range</th><th className="p-1 border-r border-slate-600 w-16">Actual</th>
                                            <th className="p-1 border-r border-slate-600 w-16">Range</th><th className="p-1 border-r border-slate-600 w-16">Actual</th>
                                            <th className="p-1 border-r border-slate-600 w-16">Range</th><th className="p-1 border-r border-slate-600 w-16">Actual</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 italic">
                                        {/* UPDATED: Mapping using index and passing index to handleTrialChange/removeRow */}
                                        {trials.map((trial, index) => (
                                            <tr key={index} className="text-xs hover:bg-orange-50/30 transition-all">
                                                <td className="p-2 font-black text-slate-400 border-r">{index + 1}</td>
                                                <td className="p-1 border-r"><input value={trial.currRange} onChange={(e) => handleTrialChange(index, 'currRange', e.target.value)} className="w-full text-center p-2 bg-transparent outline-none focus:bg-white rounded-sm" /></td>
                                                <td className="p-1 border-r"><input value={trial.currActual} onChange={(e) => handleTrialChange(index, 'currActual', e.target.value)} className="w-full text-center p-2 bg-transparent outline-none focus:bg-white rounded-sm" /></td>
                                                <td className="p-1 border-r"><input value={trial.voltRange} onChange={(e) => handleTrialChange(index, 'voltRange', e.target.value)} className="w-full text-center p-2 bg-transparent outline-none focus:bg-white rounded-sm" /></td>
                                                <td className="p-1 border-r"><input value={trial.voltActual} onChange={(e) => handleTrialChange(index, 'voltActual', e.target.value)} className="w-full text-center p-2 bg-transparent outline-none focus:bg-white rounded-sm" /></td>
                                                <td className="p-1 border-r"><input value={trial.gasRange} onChange={(e) => handleTrialChange(index, 'gasRange', e.target.value)} className="w-full text-center p-2 bg-transparent outline-none focus:bg-white rounded-sm" /></td>
                                                <td className="p-1 border-r"><input value={trial.gasActual} onChange={(e) => handleTrialChange(index, 'gasActual', e.target.value)} className="w-full text-center p-2 bg-transparent outline-none focus:bg-white rounded-sm" /></td>
                                                <td className="p-1 border-r"><input value={trial.depositThickness} onChange={(e) => handleTrialChange(index, 'depositThickness', e.target.value)} className="w-full text-center p-2 bg-transparent outline-none focus:bg-white rounded-sm" /></td>
                                                <td className="p-1 border-r"><input value={trial.defect} onChange={(e) => handleTrialChange(index, 'defect', e.target.value)} className="w-full text-center p-2 bg-transparent outline-none focus:bg-white rounded-sm" /></td>
                                                <td className="p-1"><button type="button" onClick={() => removeRow(index)} className="text-red-300 hover:text-red-500"><i className="bi bi-trash"></i></button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            <div className="lg:col-span-8 space-y-5 bg-slate-50 p-8 border border-slate-100 shadow-inner">
                                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Test Result on Sample</h3>
                                
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-white border border-slate-100">
                                    <span className="text-[11px] font-bold text-slate-600 uppercase">1) Visual Test</span>
                                    <select name="visualTest" value={formData.visualTest} onChange={handleInputChange} className="bg-slate-50 border-none text-[10px] font-black uppercase px-4 py-2 focus:ring-1 focus:ring-orange-400">
                                        <option value="">Select</option>
                                        <option>Acceptable (Ok)</option>
                                        <option>Rejected (Not ok)</option>
                                    </select>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-white border border-slate-100">
                                    <span className="text-[11px] font-bold text-slate-600 uppercase">2) Defect</span>
                                    <select name="defectSelect" value={formData.defectSelect} onChange={handleInputChange} className="bg-slate-50 border-none text-[10px] font-black uppercase px-4 py-2 focus:ring-1 focus:ring-orange-400">
                                        <option value="">Select</option>
                                        <option>Acceptable (Ok)</option>
                                        <option>Rejected (Not ok)</option>
                                    </select>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-white border border-slate-100">
                                    <span className="text-[11px] font-bold text-slate-600 uppercase">3) Strength Test</span>
                                    <select name="strengthTest" value={formData.strengthTest} onChange={handleInputChange} className="bg-slate-50 border-none text-[10px] font-black uppercase px-4 py-2 focus:ring-1 focus:ring-orange-400">
                                        <option value="">Select</option>
                                        <option>Acceptable (Ok)</option>
                                        <option>Rejected (Not ok)</option>
                                    </select>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-white border border-slate-100">
                                    <span className="text-[11px] font-bold text-slate-600 uppercase">4) Root Bend Test</span>
                                    <select name="rootBend" value={formData.rootBend} onChange={handleInputChange} className="bg-slate-50 border-none text-[10px] font-black uppercase px-4 py-2 focus:ring-1 focus:ring-orange-400">
                                        <option value="">Select</option>
                                        <option>Acceptable (Ok)</option>
                                        <option>Rejected (Not ok)</option>
                                    </select>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-white border border-slate-100">
                                    <span className="text-[11px] font-bold text-slate-600 uppercase">5) Face Bend Test</span>
                                    <select name="faceBend" value={formData.faceBend} onChange={handleInputChange} className="bg-slate-50 border-none text-[10px] font-black uppercase px-4 py-2 focus:ring-1 focus:ring-orange-400">
                                        <option value="">Select</option>
                                        <option>Acceptable (Ok)</option>
                                        <option>Rejected (Not ok)</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="lg:col-span-4 flex flex-col items-center justify-center p-8 border-2 border-dashed border-orange-200 bg-orange-50/20 group hover:bg-orange-50 transition-all cursor-pointer overflow-hidden"
                                onClick={() => fileInputRef.current.click()} 
                            >
                                {welderPhoto ? (
                                    <img src={welderPhoto} alt="Welder" className="w-full h-32 object-cover shadow-md" />
                                ) : (
                                    <>
                                        <i className="bi bi-camera text-4xl text-orange-300 group-hover:scale-110 transition-transform"></i>
                                        <p className="mt-2 text-[11px] font-black text-slate-800 uppercase">Upload Welder Photo</p>
                                        <p className="text-[9px] text-orange-700 font-bold mt-1">(Click to select)</p>
                                    </>
                                )}
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*" 
                                    onChange={handlePhotoChange} 
                                />
                            </div>
                        </div>

                        <div className="p-8 md:p-12 bg-[#fffaf5] border border-orange-100 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <InputField label="Name of Welder" name="welderName" value={formData.welderName} onChange={handleInputChange} placeholder="Full name..." />
                                <InputField label="Welding test conducted by" name="conductedBy" value={formData.conductedBy} onChange={handleInputChange} />
                                <InputField label="Welding test verified by" name="verifiedBy" value={formData.verifiedBy} onChange={handleInputChange} />
                            </div>
                        </div>

                        <div className="flex justify-center md:justify-end pt-4">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={`px-20 py-6 rounded-none font-black text-white text-sm uppercase tracking-[0.2em] transition-all shadow-xl active:scale-[0.98] ${
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

const InputField = ({ label, type = "text", placeholder, name, value, onChange }) => (
    <div className="flex flex-col gap-2">
        <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest ml-1">{label}</label>
        <input 
            type={type} 
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full p-4 bg-white border border-slate-200 focus:border-orange-400 rounded-none outline-none transition-all font-bold text-sm text-slate-700 shadow-sm"
        />
    </div>
);

export default WelderQualificationForm;