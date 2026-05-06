import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../../../../../config/api';

const MonthlyProdPlanForm = () => {
    const navigate = useNavigate();
    
    // Date state
    const [currentDate, setCurrentDate] = useState('');
    
    // Dropdown options state
    const [partsList, setPartsList] = useState([]);
    const [customersList, setCustomersList] = useState([]); // Naya state Customers ke liye

    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        setCurrentDate(formattedDate);

        // Fetching Parts from Backend API
        const fetchParts = async () => {
            try {
                const response = await fetch(getApiUrl('/api/master-dropdown/?filter=all_parts')); 
                if (response.ok) {
                    const data = await response.json();
                    setPartsList(data);
                }
            } catch (error) {
                console.error("Error fetching parts list:", error);
            }
        };

        // Fetching Customers from Backend API
        const fetchCustomers = async () => {
            try {
                const response = await fetch(getApiUrl('/api/master-dropdown/?filter=customer')); 
                if (response.ok) {
                    const data = await response.json();
                    setCustomersList(data);
                }
            } catch (error) {
                console.error("Error fetching customers list:", error);
            }
        };

        fetchParts();
        fetchCustomers(); // Customer fetch call
    }, []);
    
    const initialState = {
        date: new Date().toISOString().split('T')[0],
        partName: '',
        customer: '',
        openingStock: '',
        scheduleQty: '',
        plannedQty: '',
        remark: '',
        preparedBy: '', 
        approvedBy: ''  
    };

    const [formData, setFormData] = useState(initialState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const response = await fetch(getApiUrl('/api/monthly-prod-plan/save/'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert("Success! Monthly Production Plan has been saved.");
                setFormData(initialState); 
            } else {
                alert("Failed to save production plan.");
            }
        } catch (error) {
            console.error("Error saving data:", error);
            alert("An error occurred while saving the data.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 flex flex-col items-center pb-20">
            
            <div className="w-full max-w-4xl px-4 mt-8">
                
                {/* --- Top Navigation --- */}
                <div className="flex items-center mb-6">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-5 py-2 bg-white border border-slate-200 text-slate-800 rounded-xl hover:bg-slate-50 transition-all shadow-sm font-bold active:scale-95 text-xs"
                    >
                        <i className="bi bi-chevron-left text-[#3b82f6]"></i> 
                        Back
                    </button>
                </div>

                {/* --- Main Card with Gradient Header --- */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden"
                >
                    <div className="w-full bg-gradient-to-br from-[#3b82f6] via-[#4f46e5] to-[#312e81] p-10 md:p-14 text-center border-b border-white/10 relative overflow-hidden">
                        
                        <div className="absolute top-[-20%] left-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-[-20%] right-[-10%] w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl"></div>

                        <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-[10px] md:text-xs font-bold px-4 py-2 rounded-full z-20 shadow-lg flex items-center gap-2">
                            <i className="bi bi-calendar3"></i> {currentDate}
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic relative z-10 leading-tight mt-4 md:mt-0">
                            Monthly Production <span className="text-blue-200 block md:inline not-italic">Plan</span>
                        </h1>
                        <p className="text-blue-100/70 text-[10px] md:text-xs font-black mt-4 tracking-[0.4em] uppercase underline decoration-blue-400 decoration-2 underline-offset-8 relative z-10">
                            AtomOne Manufacturing Intelligence
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-14 space-y-10">
                        
                        {/* Section 1: Identification */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            {/* DYNAMIC DROPDOWN FOR PART INFO */}
                            <div className="flex flex-col gap-2.5">
                                <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest ml-1">Part Number & Name</label>
                                <select 
                                    name="partName"
                                    required
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 focus:border-[#3b82f6] focus:bg-white rounded-2xl transition-all outline-none text-sm font-bold shadow-inner cursor-pointer appearance-none"
                                    value={formData.partName}
                                    onChange={handleInputChange}
                                >
                                    <option value="" disabled>-- Select Part --</option>
                                    {partsList.map((part, index) => (
                                        <option key={index} value={`${part[1]} - ${part[0]}`}>
                                            {part[1]} - {part[0]}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* DYNAMIC DROPDOWN FOR CUSTOMER NAME */}
                            <div className="flex flex-col gap-2.5">
                                <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest ml-1">Customer Name</label>
                                <select 
                                    name="customer"
                                    required
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 focus:border-[#3b82f6] focus:bg-white rounded-2xl transition-all outline-none text-sm font-bold shadow-inner cursor-pointer appearance-none"
                                    value={formData.customer}
                                    onChange={handleInputChange}
                                >
                                    <option value="" disabled>-- Select Customer --</option>
                                    {customersList.map((cust, index) => (
                                        <option key={index} value={cust}>
                                            {cust}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Section 2: Metrics Table View */}
                        <div className="bg-blue-50/40 p-8 rounded-[2.5rem] border border-blue-100/50 space-y-8">
                            <h3 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.25em] flex items-center gap-3">
                                <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div> Target Inventory Data
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-1">Opening Stock</label>
                                    <input 
                                        name="openingStock"
                                        type="number" 
                                        placeholder="0"
                                        className="w-full px-5 py-4 bg-white border border-slate-200 focus:border-[#3b82f6] rounded-2xl outline-none text-sm font-black shadow-sm"
                                        value={formData.openingStock}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-1">Schedule Qty</label>
                                    <input 
                                        name="scheduleQty"
                                        type="number" 
                                        placeholder="0"
                                        className="w-full px-5 py-4 bg-white border border-slate-200 focus:border-[#3b82f6] rounded-2xl outline-none text-sm font-black shadow-sm"
                                        value={formData.scheduleQty}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-blue-700 uppercase tracking-wider ml-1">Planned Qty</label>
                                    <input 
                                        name="plannedQty"
                                        type="number" 
                                        required
                                        placeholder="0"
                                        className="w-full px-5 py-4 bg-blue-100/50 border-2 border-blue-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 rounded-2xl outline-none text-sm font-black text-blue-800 shadow-sm"
                                        value={formData.plannedQty}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Remarks */}
                        <div className="flex flex-col gap-2.5">
                            <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest ml-1">Special Remarks / Operational Notes</label>
                            <textarea 
                                name="remark"
                                rows="3"
                                placeholder="Add specific machine or man-power notes..."
                                className="w-full px-6 py-5 bg-slate-50 border border-slate-200 focus:border-[#3b82f6] focus:bg-white rounded-3xl outline-none resize-none text-sm font-bold shadow-inner transition-all"
                                value={formData.remark}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>

                        {/* Section 4: Authorization (Prepared By / Approved By) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-100 pt-8 mt-4">
                            <div className="flex flex-col gap-2.5">
                                <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest ml-1">Prepared By</label>
                                <input 
                                    name="preparedBy"
                                    type="text" 
                                    required
                                    placeholder="Enter your name..."
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 focus:border-[#3b82f6] focus:bg-white rounded-2xl transition-all outline-none text-sm font-bold shadow-inner"
                                    value={formData.preparedBy}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex flex-col gap-2.5">
                                <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest ml-1">Approved By</label>
                                <input 
                                    name="approvedBy"
                                    type="text" 
                                    placeholder="Enter manager/supervisor name..."
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 focus:border-[#3b82f6] focus:bg-white rounded-2xl transition-all outline-none text-sm font-bold shadow-inner"
                                    value={formData.approvedBy}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 flex justify-center md:justify-end">
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={`w-full sm:w-auto px-13 p-3 py-4.5 rounded-2xl font-black text-white text-[11px] tracking-[0.25em] transition-all shadow-xl active:scale-[0.98] ${
                                    isSubmitting 
                                    ? 'bg-slate-300' 
                                    : 'bg-gradient-to-r from-[#3b82f6] to-[#1e40af] hover:shadow-blue-300 hover:-translate-y-0.5'
                                }`}
                            >
                                {isSubmitting ? 'SAVING DATA...' : 'SAVE PROD'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default MonthlyProdPlanForm;