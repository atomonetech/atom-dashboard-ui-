import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MachineHistoryCard = () => {
    const navigate = useNavigate();

    // --- MACHINE DETAILS STATE ---
    const [machineDetails, setMachineDetails] = useState({
        machineName: '',
        machineNo: '',
        machineSpecs: '',
        location: ''
    });

    // --- HISTORY TABLE STATE ---
    const [historyData, setHistoryData] = useState([
        { id: 1, date: '', problem: '', actionTaken: '', update4M: '', signature: '', remarks: '' },
        { id: 2, date: '', problem: '', actionTaken: '', update4M: '', signature: '', remarks: '' },
        { id: 3, date: '', problem: '', actionTaken: '', update4M: '', signature: '', remarks: '' },
        { id: 4, date: '', problem: '', actionTaken: '', update4M: '', signature: '', remarks: '' }
    ]);

    const [signatures, setSignatures] = useState({ preparedBy: '', approvedBy: '' });

    // --- HANDLERS ---
    const handleDetailChange = (e) => {
        setMachineDetails({ ...machineDetails, [e.target.name]: e.target.value });
    };

    const handleRowChange = (id, field, value) => {
        setHistoryData(prev => 
            prev.map(row => row.id === id ? { ...row, [field]: value } : row)
        );
    };

    const addRow = () => {
        setHistoryData([...historyData, { 
            id: historyData.length + 1, date: '', problem: '', actionTaken: '', update4M: '', signature: '', remarks: '' 
        }]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!machineDetails.machineName || !machineDetails.machineNo) {
            alert("⚠️ Please fill in the Machine Name and Machine No.");
            return;
        }
        
        const submissionData = {
            machineDetails,
            historyData,
            signatures,
            submittedAt: new Date().toISOString()
        };
        
        console.log("=== Machine History Card Submission ===");
        console.log("Machine Details:", machineDetails);
        console.log("History Records:", historyData);
        console.log("Signatures:", signatures);
        console.log("Submission Time:", new Date().toLocaleString());
        console.log("=== End of Submission ===");
        
        alert("✅ Machine History Card successfully updated!");
        // Reset form after submission
        setMachineDetails({
            machineName: '',
            machineNo: '',
            machineSpecs: '',
            location: ''
        });
        setHistoryData([
            { id: 1, date: '', problem: '', actionTaken: '', update4M: '', signature: '', remarks: '' },
            { id: 2, date: '', problem: '', actionTaken: '', update4M: '', signature: '', remarks: '' },
            { id: 3, date: '', problem: '', actionTaken: '', update4M: '', signature: '', remarks: '' },
            { id: 4, date: '', problem: '', actionTaken: '', update4M: '', signature: '', remarks: '' }
        ]);
        setSignatures({ preparedBy: '', approvedBy: '' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Simple Navbar */}
            <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <button
                                onClick={() => navigate('/Maintenance/Machine/Daily-Reports')}
                                className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                </svg>
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9h14M5 15h14M3 5h18a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2z" />
                                    </svg>
                                </div>
                                <span className="font-black text-slate-800 text-base sm:text-lg md:text-xl tracking-tight">
                                    Machine History Card
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-lg">
                                Doc No: AOT-F-MM-02
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
                
                {/* Machine Details Section with Gradient Header */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-4">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h2 className="text-white font-black text-base sm:text-lg uppercase tracking-wide">
                                Machine Details
                            </h2>
                        </div>
                    </div>
                    <div className="p-4 sm:p-5 md:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase mb-1.5">
                                    Machine Name <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all" 
                                    name="machineName" 
                                    value={machineDetails.machineName} 
                                    onChange={handleDetailChange} 
                                    placeholder="Enter machine name" 
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase mb-1.5">
                                    Machine No. <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 text-sm font-semibold text-blue-600 outline-none focus:border-blue-500 focus:bg-white transition-all" 
                                    name="machineNo" 
                                    value={machineDetails.machineNo} 
                                    onChange={handleDetailChange} 
                                    placeholder="e.g. MC-001" 
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase mb-1.5">
                                    Machine Specs
                                </label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all" 
                                    name="machineSpecs" 
                                    value={machineDetails.machineSpecs} 
                                    onChange={handleDetailChange} 
                                    placeholder="e.g. 250 Ton Capacity" 
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase mb-1.5">
                                    Location
                                </label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all" 
                                    name="location" 
                                    value={machineDetails.location} 
                                    onChange={handleDetailChange} 
                                    placeholder="e.g. Press Shop Line 1" 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* History Table Section with Gradient Header */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-4">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <h2 className="text-white font-black text-base sm:text-lg uppercase tracking-wide">
                                Maintenance History Log
                            </h2>
                        </div>
                    </div>
                    <div className="p-4 sm:p-5 md:p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="px-2 sm:px-3 py-2 text-center text-[10px] sm:text-xs font-black text-slate-600 uppercase w-12">Sr.</th>
                                        <th className="px-2 sm:px-3 py-2 text-center text-[10px] sm:text-xs font-black text-slate-600 uppercase w-28">Date</th>
                                        <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-black text-slate-600 uppercase">Problem</th>
                                        <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-black text-slate-600 uppercase">Action Taken</th>
                                        <th className="px-2 sm:px-3 py-2 text-center text-[10px] sm:text-xs font-black text-slate-600 uppercase w-24">4M Update?</th>
                                        <th className="px-2 sm:px-3 py-2 text-center text-[10px] sm:text-xs font-black text-slate-600 uppercase w-24">Signature</th>
                                        <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-black text-slate-600 uppercase">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historyData.map((row, index) => (
                                        <tr key={row.id} className="border-b border-slate-200 hover:bg-slate-50">
                                            <td className="px-2 sm:px-3 py-2 text-center text-xs sm:text-sm font-bold text-slate-500">{index + 1}</td>
                                            <td className="px-2 sm:px-3 py-2">
                                                <input 
                                                    type="date" 
                                                    className="w-full border-2 border-slate-200 rounded-lg p-1.5 text-xs focus:border-blue-500 outline-none text-slate-700" 
                                                    value={row.date} 
                                                    onChange={(e) => handleRowChange(row.id, 'date', e.target.value)} 
                                                />
                                            </td>
                                            <td className="px-2 sm:px-3 py-2">
                                                <textarea 
                                                    className="w-full border-2 border-slate-200 rounded-lg p-1.5 text-xs focus:border-blue-500 outline-none resize-y text-slate-700" 
                                                    rows="1"
                                                    placeholder="Describe issue..." 
                                                    value={row.problem} 
                                                    onChange={(e) => handleRowChange(row.id, 'problem', e.target.value)} 
                                                />
                                            </td>
                                            <td className="px-2 sm:px-3 py-2">
                                                <textarea 
                                                    className="w-full border-2 border-slate-200 rounded-lg p-1.5 text-xs focus:border-blue-500 outline-none resize-y text-slate-700" 
                                                    rows="1"
                                                    placeholder="Actions performed..." 
                                                    value={row.actionTaken} 
                                                    onChange={(e) => handleRowChange(row.id, 'actionTaken', e.target.value)} 
                                                />
                                            </td>
                                            <td className="px-2 sm:px-3 py-2 text-center">
                                                <select 
                                                    className="w-full border-2 border-slate-200 rounded-lg p-1.5 text-xs focus:border-blue-500 outline-none text-slate-700 " 
                                                    value={row.update4M} 
                                                    onChange={(e) => handleRowChange(row.id, 'update4M', e.target.value)} 
                                                >
                                                    <option value="">--</option>
                                                    <option value="Y">Y (Yes)</option>
                                                    <option value="N">N (No)</option>
                                                </select>
                                            </td>
                                            <td className="px-2 sm:px-3 py-2">
                                                <input 
                                                    type="text" 
                                                    className="w-full border-2 border-slate-200 rounded-lg p-1.5 text-xs text-center focus:border-blue-500 outline-none text-slate-700" 
                                                    placeholder="Sign" 
                                                    value={row.signature} 
                                                    onChange={(e) => handleRowChange(row.id, 'signature', e.target.value)} 
                                                />
                                            </td>
                                            <td className="px-2 sm:px-3 py-2">
                                                <input 
                                                    type="text" 
                                                    className="w-full border-2 border-slate-200 rounded-lg p-1.5 text-xs focus:border-blue-500 outline-none text-slate-700" 
                                                    placeholder="Any remarks" 
                                                    value={row.remarks} 
                                                    onChange={(e) => handleRowChange(row.id, 'remarks', e.target.value)} 
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button 
                            className="mt-4 w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-blue-600 font-bold text-xs uppercase tracking-wide hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                            onClick={addRow}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Add New Record
                        </button>
                    </div>
                </div>

                {/* Signatures & Submit Section with Gradient Header */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-4">
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                            </svg>
                            <h2 className="text-white font-black text-base sm:text-lg uppercase tracking-wide">
                                Authorization & Submission
                            </h2>
                        </div>
                    </div>
                    <div className="p-4 sm:p-5 md:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase mb-1.5">
                                    Prepared By
                                </label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 text-sm font-semibold text-slate-600 outline-none focus:border-blue-500 focus:bg-white transition-all" 
                                    placeholder="E-Sign / Name" 
                                    value={signatures.preparedBy} 
                                    onChange={(e) => setSignatures({...signatures, preparedBy: e.target.value})} 
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase mb-1.5">
                                    Approved By
                                </label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all" 
                                    placeholder="E-Sign / Name" 
                                    value={signatures.approvedBy} 
                                    onChange={(e) => setSignatures({...signatures, approvedBy: e.target.value})} 
                                />
                            </div>
                        </div>
                        <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
                            <button 
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                                onClick={handleSubmit}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                </svg>
                                Save History Card
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MachineHistoryCard;