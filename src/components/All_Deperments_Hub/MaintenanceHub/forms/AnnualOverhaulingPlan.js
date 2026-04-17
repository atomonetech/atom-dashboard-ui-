import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, CheckCircle, Trash2 } from 'lucide-react';

const AnnualOverhaulingPlan = () => {
    const navigate = useNavigate();
    const themeColor = '#ef4444'; // Red-500

    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const initialFormState = {
        machineName: '',
        machineNo: '',
        overhaulYear: '2025-2026',
        plannedMonth: '',
        planStatus: 'P', // P for Plan
        completeStatus: '', // C for Complete
        remarks: ''
    };

    const [formData, setFormData] = useState(initialFormState);
    const [submittedData, setSubmittedData] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);

    const months = [
        "April", "May", "June", "July", "August", "September", 
        "October", "November", "December", "January", "February", "March"
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.machineName || !formData.machineNo || !formData.plannedMonth) {
            alert("Please fill all required fields");
            return;
        }
        
        const newEntry = {
            id: Date.now(),
            ...formData,
            serialNo: submittedData.length + 1,
            status: formData.planStatus === 'P' ? 'PLANNED' : (formData.completeStatus === 'C' ? 'COMPLETED' : 'PLANNED')
        };
        setSubmittedData([...submittedData, newEntry]);
        setFormData(initialFormState);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const handleReset = () => {
        setFormData(initialFormState);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            const updatedData = submittedData.filter(item => item.id !== id);
            const reindexedData = updatedData.map((item, index) => ({
                ...item,
                serialNo: index + 1
            }));
            setSubmittedData(reindexedData);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden">
            {/* --- HEADER SECTION --- */}
            <div className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent uppercase tracking-tighter">
                            Annual Overhauling Plan
                        </h1>
                    </div>
                    <div className="text-sm font-semibold bg-red-50 px-4 py-2 rounded-full text-red-700 border border-red-100">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {currentDate}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                
                {/* Success Message */}
                {showSuccess && (
                    <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-md flex items-center gap-3">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium text-sm">Plan entry added successfully!</span>
                    </div>
                )}

                {/* --- FORM CARD --- */}
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b border-slate-100 bg-red-50/30 flex items-center justify-between flex-wrap gap-3">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">New Overhaul Entry</h2>
                            <p className="text-xs text-slate-500">Form: AOT-F-MM-11</p>
                        </div>
                        <div className="text-xs font-bold text-red-600 bg-white px-3 py-1 rounded-lg border border-red-100">
                            REV: 00
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 md:p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            
                            <div>
                                <label className="block text-slate-700 font-bold mb-2 text-xs uppercase">Machine Name *</label>
                                <input 
                                    type="text" 
                                    name="machineName" 
                                    value={formData.machineName} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="e.g. POWER PRESS" 
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-200 outline-none text-slate-700 text-sm transition-all" 
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-2 text-xs uppercase">Machine No / Specs *</label>
                                <input 
                                    type="text" 
                                    name="machineNo" 
                                    value={formData.machineNo} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="e.g. PP-03 / 450T" 
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-200 outline-none text-slate-700 text-sm" 
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-2 text-xs uppercase">Target Month *</label>
                                <select 
                                    name="plannedMonth" 
                                    value={formData.plannedMonth} 
                                    onChange={handleChange} 
                                    required
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-200 outline-none text-slate-700 text-sm bg-white"
                                >
                                    <option value="">Select Month</option>
                                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 font-bold mb-2 text-xs uppercase">Plan (P) / Complete (C)</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="planStatus" 
                                            value="P"
                                            checked={formData.planStatus === 'P'}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-red-600"
                                        />
                                        <span className="text-slate-700 text-sm font-medium">P (Plan)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="completeStatus" 
                                            value="C"
                                            checked={formData.completeStatus === 'C'}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-green-600"
                                        />
                                        <span className="text-slate-700 text-sm font-medium">C (Complete)</span>
                                    </label>
                                </div>
                            </div>

                            <div className="lg:col-span-3">
                                <label className="block text-slate-700 font-bold mb-2 text-xs uppercase">Special Remarks / Spare Parts Needed</label>
                                <textarea 
                                    name="remarks" 
                                    value={formData.remarks} 
                                    onChange={handleChange} 
                                    rows={2} 
                                    placeholder="Enter requirements for overhaul..." 
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-200 outline-none text-slate-700 text-sm" 
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-slate-100">
                            <button 
                                type="submit" 
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-10 rounded-2xl transition-all shadow-lg text-sm uppercase tracking-widest flex items-center justify-center gap-2"
                            >
                                <i className="bi bi-calendar-plus"></i> Add to Plan
                            </button>
                            <button 
                                type="button" 
                                onClick={handleReset} 
                                className="bg-white hover:bg-slate-50 text-slate-600 font-bold py-3 px-10 rounded-2xl transition-all border border-slate-200 text-sm uppercase tracking-widest"
                            >
                                Clear Form
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- PLAN PREVIEW TABLE --- */}
                {submittedData.length > 0 && (
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 overflow-hidden">
                        <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center flex-wrap gap-3">
                            <h3 className="font-bold">Summary of Planned Overhauling</h3>
                            <span className="text-xs bg-red-500 px-3 py-1 rounded-full uppercase tracking-widest">Year: 2025-2026</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">S.No</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Machine</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">ID / Specs</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Planned Month</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">P/C</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {submittedData.map((entry) => (
                                        <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-mono text-slate-500">{entry.serialNo}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-slate-700">{entry.machineName}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{entry.machineNo}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-red-600">{entry.plannedMonth}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                                    entry.completeStatus === 'C' 
                                                        ? 'bg-green-100 text-green-700 border-green-200' 
                                                        : 'bg-red-100 text-red-700 border-red-200'
                                                }`}>
                                                    {entry.completeStatus === 'C' ? 'C (Completed)' : 'P (Planned)'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => handleDelete(entry.id)}
                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnnualOverhaulingPlan;