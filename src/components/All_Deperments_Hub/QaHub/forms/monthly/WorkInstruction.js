import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WorkInstructionValidation = () => {
    const navigate = useNavigate();
    
    // 🔥 Force Reset Key - To clear UI after submission
    const [formKey, setFormKey] = useState(Date.now());

    const initialFormState = {
        gaugeName: '',
        gaugeNo: '',
        validationDate: new Date().toISOString().split('T')[0],
        status: '', // OK / REJECT
        remarks: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    const instructions = [
        "सर्वप्रथम गेज/ फिक्सचर को अच्छी तरह से साफ़ करे!",
        "उसके बाद गेज/ फिक्सचरको को प्लान के अनुसार चेक करे फिर उस पर मास्टर लिस्ट के अनुसार साईज और गेज नंबर मैच करे!",
        "यदि गेज/ फिक्सचर पर नंबर नही है तो मास्टर लिस्ट के अनुसार गेज /फिक्सचर पर नंबर डाले !",
        "फिर उस गेज/फिक्सचर पर पहले के वेलिडेशन का स्टिकर चेक करे",
        "रिकॉर्ड शीट के अनुसार डिफाइन इंस्ट्रूमेंट्स से चेक करे और ऑब्जरवेशन रिकॉर्ड शीट में डाले!",
        "यदि गेज/फिक्सचर स्पेसिफिकेशन के अनुसार ओके है तो उस पर न्यू वैलिडेशन स्टिकर लगाए",
        "यदि गेज/फिक्सचर रिजेक्ट है तो उस पर रेड मार्किंग करे और उसे रिजेक्ट गेज/फिक्सचर रखने के स्थान पर रखे!"
    ];

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleForceReset = () => {
        setFormKey(Date.now());
        setFormData(initialFormState);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Validation Data Submitted:", formData);
        alert('✅ Validation Entry Saved Successfully!');
        handleForceReset();
    };

    return (
        <div className="min-h-screen bg-[#fffbeb] text-slate-700 font-sans pb-32">
            
            {/* 🔥 Orange Gradient Header */}
            <div className="bg-gradient-to-r from-[#d97706] to-[#f59f0a] pt-12 pb-32 px-6 shadow-xl">
                <div className="max-w-4xl mx-auto flex items-center gap-6 text-white">
                    <button 
                        onClick={() => navigate('/qa-hub/monthly')} 
                        className="w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-2xl transition-all border border-white/10 backdrop-blur-md"
                    >
                        <i className="bi bi-chevron-left text-xl"></i>
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-none">
                            Work Instruction
                        </h1>
                        <p className="text-orange-100 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mt-2 opacity-80">
                            Internal Gauge/Fixture Validation
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Container */}
            <div key={formKey} className="max-w-4xl mx-auto px-4 -mt-20">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* 1. Validation Entry Fields */}
                    <div className="bg-white rounded-[2rem] shadow-2xl p-6 md:p-10 border border-orange-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1">Gauge / Fixture Name</label>
                                <input required className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#f59f0a] focus:bg-white outline-none transition-all font-semibold text-sm" 
                                value={formData.gaugeName} onChange={(e) => handleChange('gaugeName', e.target.value)} placeholder="e.g. Snap Gauge" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1">Gauge / Fixture No.</label>
                                <input required className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#f59f0a] focus:bg-white outline-none transition-all font-semibold text-sm" 
                                value={formData.gaugeNo} onChange={(e) => handleChange('gaugeNo', e.target.value)} placeholder="e.g. G-102" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1">Status</label>
                                <select className="w-full px-5 py-3.5 bg-orange-50 border-2 border-orange-100 rounded-2xl focus:border-[#f59f0a] outline-none font-bold text-orange-700" 
                                value={formData.status} onChange={(e) => handleChange('status', e.target.value)} required>
                                    <option value="">Select Result</option>
                                    <option value="OK">OK (New Sticker Applied)</option>
                                    <option value="REJECT">REJECT (Red Marked)</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider ml-1">Validation Date</label>
                                <input type="date" className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#f59f0a] outline-none font-semibold text-sm" 
                                value={formData.validationDate} onChange={(e) => handleChange('validationDate', e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* 2. Visual Work Instructions (Image Table Conversion) */}
                    <div className="bg-white rounded-[2rem] shadow-xl p-6 md:p-8 border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-2 h-6 bg-[#f59f0a] rounded-full"></span>
                            <h3 className="text-slate-800 font-black text-sm uppercase tracking-widest">Step-by-Step Instructions</h3>
                        </div>
                        <div className="space-y-3">
                            {instructions.map((text, index) => (
                                <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-orange-200 transition-all">
                                    <span className="bg-[#f59f0a] text-white w-8 h-8 rounded-lg flex items-center justify-center font-black shrink-0 shadow-md">
                                        {index + 1}
                                    </span>
                                    <p className="text-slate-700 font-bold text-sm md:text-base leading-relaxed">
                                        {text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="bg-white/90 backdrop-blur-xl sticky bottom-6 rounded-3xl border border-slate-200 shadow-2xl p-4 flex items-center justify-between mx-2">
                        <button type="button" onClick={() => navigate('/qa-hub/monthly')} className="px-6 py-2 text-slate-400 font-black text-xs uppercase hover:text-red-500 transition-all">
                             Cancel
                        </button>
                        <div className="flex gap-4">
                            <button type="button" onClick={handleForceReset} className="px-8 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95">
                                Reset
                            </button>
                            <button type="submit" className="px-12 py-4 bg-[#f59f0a] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-orange-200 hover:bg-[#d97706] active:scale-95 transition-all flex items-center gap-2">
                                <i className="bi bi-check-circle-fill"></i> Save Entry
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WorkInstructionValidation;