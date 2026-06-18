import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../../../../../config/api';
import axios from 'axios';
const API_LOG = `${
  process.env.REACT_APP_API_URL || "http://localhost:8000"
}/api/log-report/`;

const PreventiveMaintChecklist = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Date and Dropdown states
    const [currentDate, setCurrentDate] = useState('');
    const [partsList, setPartsList] = useState([]);

    useEffect(() => {
        // Format Date
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        setCurrentDate(formattedDate);

        // Fetching Parts from Backend API with Debugging
        const fetchParts = async () => {
            try {
                // API call kar rahe hain
                const url = getApiUrl('/api/master-dropdown/?filter=all_parts');
                console.log("Fetching from URL:", url); // Check karo ki URL sahi ban raha hai ya nahi

                const response = await fetch(url); 
                
                if (response.ok) {
                    const data = await response.json();
                    console.log("Backend Response Data:", data); // Check karo ki backend kya bhej raha hai
                    setPartsList(data);
                } else {
                    console.error("Backend Error Status:", response.status, response.statusText);
                }
            } catch (error) {
                console.error("Fetch Request Failed (CORS ya Server band ho sakta hai):", error);
            }
        };

        fetchParts();
    }, []);

    // Initial state matching Sr. No 1 to 11
    const [checkPoints, setCheckPoints] = useState([
        { id: 1, task: "Painting", doneOn: "", status: "Ok", remarks: "" },
        { id: 2, task: "Name Plate", doneOn: "", status: "Ok", remarks: "" },
        { id: 3, task: "Locking System", doneOn: "", status: "Ok", remarks: "" },
        { id: 4, task: "Castol wheel", doneOn: "", status: "Ok", remarks: "" },
        { id: 5, task: "Fork Guide", doneOn: "", status: "Ok", remarks: "" },
        { id: 6, task: "Plastic pipe (PP) Strip", doneOn: "", status: "Ok", remarks: "" },
        { id: 7, task: "Transparent Pipe", doneOn: "", status: "Ok", remarks: "" },
        { id: 8, task: "CUP", doneOn: "", status: "Ok", remarks: "" },
        { id: 9, task: "Lock Pin", doneOn: "", status: "Ok", remarks: "" },
        { id: 10, task: "Cushioning", doneOn: "", status: "Ok", remarks: "" },
        { id: 11, task: "Cantilevers", doneOn: "", status: "Ok", remarks: "" },
    ]);

    // Handle changes inside the checklist table
    const handleCheckPointChange = (id, field, value) => {
        setCheckPoints(prevCheckPoints => 
            prevCheckPoints.map(item => 
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const formObj = Object.fromEntries(new FormData(e.target).entries());
        const payload = {
            ...formObj,
            checkPoints: checkPoints // Sahi populated array backend ko bhejenge
        };

        try {
            const response = await fetch(getApiUrl('/api/pm-checklist-mhe/save/'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                  const currentUser = localStorage.getItem("username") || "Unknown User";

        try {
          await axios.post(API_LOG, {
            username: currentUser,
            report_name: "PM Checklist Report", // Yahan hardcode kar diya form ka naam
          });
          console.log("Activity log successfully saved!");
        } catch (logError) {
          console.error("Activity log save karne mein error aayi:", logError);
        }
                alert("Checklist Saved Successfully!");
                // Form reset karne ke sath state bhi wapas default pe laani hogi
                e.target.reset();
                setCheckPoints(checkPoints.map(cp => ({ ...cp, doneOn: "", status: "Ok", remarks: "" })));
            } else {
                alert("Failed to save checklist data.");
            }
        } catch (error) {
            console.error("Error saving data:", error);
            alert("An error occurred while saving the data.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f0f9ff] font-sans text-slate-900 pb-10 flex flex-col items-center">
            
            <div className="w-full max-w-6xl px-3 md:px-6 mt-6 md:mt-8">
                
                {/* --- Back Button --- */}
                <div className="flex justify-start mb-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 px-4 py-2 bg-white border border-cyan-100 text-slate-800 rounded-lg hover:bg-cyan-50 transition-all shadow-sm font-bold text-xs active:scale-95"
                    >
                        <i className="bi bi-arrow-left text-[#06b6d4]"></i> 
                        Back
                    </button>
                </div>

                {/* --- Header Section (Cyan Gradient) --- */}
                <div className="w-full bg-gradient-to-r from-[#06b6d4] to-[#0891b2] rounded-t-3xl p-6 md:p-10 text-center shadow-lg relative overflow-hidden">
                    <div className="absolute top-[-20%] left-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[10px] md:text-xs font-bold px-4 py-2 rounded-full z-20 shadow-lg flex items-center gap-2">
                        <i className="bi bi-calendar3"></i> {currentDate}
                    </div>
                    <h1 className="text-xl md:text-3xl font-black text-white tracking-tight uppercase italic relative z-10 mt-4 md:mt-0">
                        Preventive Maintenance <span className="text-cyan-100 text-lg md:text-3xl">Checklist</span>
                    </h1>
                    <p className="text-cyan-50 text-[9px] md:text-xs font-bold mt-1 tracking-[0.2em] uppercase opacity-90 relative z-10">
                        Material Handling Equipment | Doc No: AOT-F-PROD-09
                    </p>
                </div>

                {/* --- Main Form Card --- */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-b-3xl shadow-xl border-x border-b border-cyan-50 overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-4 md:p-10 space-y-8">
                        
                        {/* 1. Equipment Identification Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 border-b border-slate-50 pb-6">
                            
                            {/* DYNAMIC DROPDOWN FOR PART INFO (Name match with Django: partName) */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Part Name / No.</label>
                                <select 
                                    name="partName" 
                                    required
                                    defaultValue=""
                                    className="w-full p-3 bg-slate-50 border border-slate-200 focus:border-cyan-400 rounded-xl outline-none transition-all font-bold text-xs text-slate-700 shadow-sm focus:bg-white cursor-pointer appearance-none"
                                >
                                    <option value="" disabled>-- Select Part --</option>
                                    {partsList.map((part, index) => (
                                        <option key={index} value={`${part[1]} - ${part[0]}`}>
                                            {part[1]} - {part[0]}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Names updated to match Django view variables */}
                            <InputField label="Trolley / Pallet / Bin / Tray No." name="trolleyNo" placeholder="Enter No..." />
                            <InputField label="P.M. Frequency" name="pmFrequency" defaultValue="4 Months" />
                        </div>

                        {/* 2. Responsive Checklist Table */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <h3 className="text-[10px] md:text-xs font-black text-slate-800 uppercase tracking-widest">Maintenance Check Points</h3>
                                <div className="flex gap-4 text-[9px] font-bold text-slate-400">
                                    <span>OK: ✓</span>
                                    <span>X: Not OK</span>
                                    <span>NA: Not Required</span>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-inner">
                                <table className="w-full text-center border-collapse min-w-[700px]">
                                    <thead className="bg-slate-800 text-white text-[9px] uppercase tracking-wider">
                                        <tr>
                                            <th className="p-3 border-r border-slate-700 w-16">Sr. No</th>
                                            <th className="p-3 border-r border-slate-700 text-left">Check Points</th>
                                            <th className="p-3 border-r border-slate-700 w-40">Done On (Date)</th>
                                            <th className="p-3 border-r border-slate-700 w-32">Status</th>
                                            <th className="p-3">Remarks</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {checkPoints.map((item) => (
                                            <tr key={item.id} className="text-xs hover:bg-cyan-50/30 font-bold transition-colors">
                                                <td className="p-3 bg-slate-50/50 border-r text-slate-400">{item.id}</td>
                                                <td className="p-3 border-r text-left text-slate-700">{item.task}</td>
                                                <td className="p-2 border-r">
                                                    <input 
                                                        type="date" 
                                                        value={item.doneOn}
                                                        onChange={(e) => handleCheckPointChange(item.id, "doneOn", e.target.value)}
                                                        className="w-full bg-transparent border-none outline-none text-[10px] text-cyan-700" 
                                                    />
                                                </td>
                                                <td className="p-2 border-r">
                                                    <select 
                                                        value={item.status}
                                                        onChange={(e) => handleCheckPointChange(item.id, "status", e.target.value)}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded p-1 text-[10px] font-black uppercase outline-none focus:border-cyan-400"
                                                    >
                                                        <option value="Ok">Ok</option>
                                                        <option value="Not Ok">Not Ok (X)</option>
                                                        <option value="NA">NA</option>
                                                    </select>
                                                </td>
                                                <td className="p-2">
                                                    <input 
                                                        type="text" 
                                                        value={item.remarks}
                                                        onChange={(e) => handleCheckPointChange(item.id, "remarks", e.target.value)}
                                                        placeholder="Add notes..." 
                                                        className="w-full bg-transparent border-none outline-none px-2 text-[10px] italic font-medium" 
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 3. Footer Inputs: Checked By & Verified By */}
                        <div className="p-5 md:p-8 bg-cyan-50/30 rounded-2xl border border-cyan-100 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="Checked By" name="checkedBy" placeholder="Name of Inspector" />
                                <InputField label="Verified By" name="verifiedBy" placeholder="Name of Manager" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">General Remarks</label>
                                <textarea name="generalRemarks" rows="2" placeholder="Overall equipment condition..." className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none text-xs font-bold text-slate-700 focus:border-cyan-400" />
                            </div>
                        </div>

                        {/* 4. Professional Small Submit Button */}
                        <div className="flex justify-center md:justify-end pt-2 pb-2">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={`px-10 py-3 rounded-xl font-black text-white text-[10px] tracking-[0.2em] transition-all shadow-lg active:scale-[0.95] ${
                                    isSubmitting ? 'bg-slate-300' : 'bg-gradient-to-r from-[#06b6d4] to-[#0891b2] hover:shadow-cyan-200 shadow-cyan-100'
                                }`}
                            >
                                {isSubmitting ? 'SAVING...' : 'CONFIRM CHECKLIST'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

const InputField = ({ label, type = "text", name, placeholder, defaultValue }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">{label}</label>
        <input 
            type={type} 
            name={name}
            placeholder={placeholder}
            defaultValue={defaultValue}
            className="w-full p-3 bg-slate-50 border border-slate-200 focus:border-cyan-400 rounded-xl outline-none transition-all font-bold text-xs text-slate-700 shadow-sm focus:bg-white"
        />
    </div>
);

export default PreventiveMaintChecklist;