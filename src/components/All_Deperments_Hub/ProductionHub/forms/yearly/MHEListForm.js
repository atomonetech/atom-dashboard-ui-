import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MHEListForm = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // State
    const [updatedDate, setUpdatedDate] = useState(new Date().toLocaleDateString('en-GB'));
    const [equipmentList, setEquipmentList] = useState([
        { id: Date.now(), partDetail: '', containerDetail: '', handlingType: 'INHOUSE' }
    ]);

    const addRow = () => {
        setEquipmentList([...equipmentList, { id: Date.now(), partDetail: '', containerDetail: '', handlingType: 'INHOUSE' }]);
    };

    const removeRow = (id) => {
        if (equipmentList.length > 1) {
            setEquipmentList(equipmentList.filter(item => item.id !== id));
        }
    };

    const handleInputChange = (id, field, value) => {
        setEquipmentList(equipmentList.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            alert("List Saved!");
            setIsSubmitting(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#f0f4f9] font-['Inter',system-ui,sans-serif] pb-10">
            
            <div className="w-full max-w-5xl mx-auto px-4 mt-6">
                
                {/* Back Button */}
                <div className="flex justify-start mb-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to MHE Hub
                    </button>
                </div>

                {/* Header - Sky Blue, Title Left, Date Right */}
                <div className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-t-xl px-6 py-5 shadow-md">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        {/* Left Side - Title */}
                        <div className="flex-1 text-left">
                            <h1 className="text-2xl font-bold text-white tracking-tight">
                                Material Handling Equipment List
                            </h1>
                            <p className="text-sky-100 text-xs mt-1">MHE Inventory & Tracking</p>
                        </div>
                        
                        {/* Right Side - Date */}
                        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm text-white font-medium">{updatedDate}</span>
                        </div>
                    </div>
                </div>

                {/* Main Form Card */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }} 
                    className="bg-white rounded-b-xl shadow-md border border-t-0 border-gray-200 overflow-hidden"
                >
                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                        
                        {/* Control Section */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-4 bg-sky-400 rounded-full"></div>
                                <h3 className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Equipment Grid</h3>
                                <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{equipmentList.length} Items</span>
                            </div>
                            <button 
                                type="button" 
                                onClick={addRow}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-700 rounded-lg font-semibold text-[11px] hover:bg-sky-100 transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add Row
                            </button>
                        </div>

                        {/* Responsive Table */}
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="p-3 w-12 text-center text-xs font-semibold text-gray-500">#</th>
                                        <th className="p-3 text-xs font-semibold text-gray-500">Part Name / Number</th>
                                        <th className="p-3 text-xs font-semibold text-gray-500">Container / Tray Detail</th>
                                        <th className="p-3 w-32 text-center text-xs font-semibold text-gray-500">Type</th>
                                        <th className="p-3 w-10 text-center text-xs font-semibold text-gray-500"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <AnimatePresence initial={false}>
                                        {equipmentList.map((item, index) => (
                                            <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="p-3 text-center text-gray-400 text-xs font-mono">
                                                    {String(index + 1).padStart(2, '0')}
                                                </td>
                                                <td className="p-2">
                                                    <input 
                                                        type="text" 
                                                        placeholder="Enter part name / number..."
                                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm text-gray-700 focus:bg-white focus:border-sky-300 focus:ring-1 focus:ring-sky-200 transition-all" 
                                                        value={item.partDetail}
                                                        onChange={(e) => handleInputChange(item.id, 'partDetail', e.target.value)}
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <input 
                                                        type="text" 
                                                        placeholder="Enter container / tray details..."
                                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm text-gray-700 focus:bg-white focus:border-sky-300 focus:ring-1 focus:ring-sky-200 transition-all" 
                                                        value={item.containerDetail}
                                                        onChange={(e) => handleInputChange(item.id, 'containerDetail', e.target.value)}
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <select 
                                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium outline-none cursor-pointer focus:border-sky-300"
                                                        value={item.handlingType}
                                                        onChange={(e) => handleInputChange(item.id, 'handlingType', e.target.value)}
                                                    >
                                                        <option value="INHOUSE">Inhouse</option>
                                                        <option value="DISPATCH">Dispatch</option>
                                                    </select>
                                                </td>
                                                <td className="p-2 text-center">
                                                    <button 
                                                        type="button"
                                                        onClick={() => removeRow(item.id)}
                                                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                                                        disabled={equipmentList.length === 1}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>

                        {/* Footer Section */}
                        <div className="pt-4 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="w-full md:w-64">
                                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider ml-1">Prepared By</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter name"
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm font-medium focus:border-sky-300 transition-all" 
                                />
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={`px-8 py-2.5 bg-sky-600 text-white rounded-lg font-semibold text-sm shadow-sm hover:bg-sky-700 transition-all active:scale-[0.98] ${isSubmitting ? 'opacity-50' : ''}`}
                            >
                                {isSubmitting ? 'Saving...' : 'Save List'}
                            </button>
                        </div>
                    </form>
                </motion.div>

                {/* Footer Note */}
                <div className="text-center mt-4">
                    <p className="text-[10px] text-gray-400">
                        AtomOne Technologies | Format: AOT-F-MHE-01 | Rev: 00
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MHEListForm;