import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
// const API_LOG = `${
//   process.env.REACT_APP_API_URL || "http://localhost:8000"
// }/api/log-report/`;

const PLANT_MAP = {
    'Plant 1': 'plant_1',
    'Plant 2': 'plant_2',
};

const MachineHistoryCard = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isViewMode = Boolean(id);
    // --- MACHINE DETAILS STATE ---
    const [machineDetails, setMachineDetails] = useState({
        plant: '',
        machineName: '',
        machineNo: '',
        machineSpecs: '',
        location: ''
    });

    // --- DYNAMIC MACHINE DROPDOWN STATE ---
    const [machineList, setMachineList] = useState([]);
    const [machinesLoading, setMachinesLoading] = useState(false);

    // --- HISTORY TABLE STATE ---
    const [historyData, setHistoryData] = useState([
        { id: 1, date: '', problem: '', actionTaken: '', update4M: '', signature: '', remarks: '' },
        { id: 2, date: '', problem: '', actionTaken: '', update4M: '', signature: '', remarks: '' },
        { id: 3, date: '', problem: '', actionTaken: '', update4M: '', signature: '', remarks: '' },
        { id: 4, date: '', problem: '', actionTaken: '', update4M: '', signature: '', remarks: '' }
    ]);

    const [signatures, setSignatures] = useState({ preparedBy: '', approvedBy: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [approvalRemark, setApprovalRemark] = useState("");
    const [approvalLoading, setApprovalLoading] = useState(false);

    // --- EFFECTS ---
    // Fetch or generate machine list when Plant or Machine Name changes
    useEffect(() => {
        if (machineDetails.plant) {
            if (machineDetails.machineName === "Press") {
                // Backend API Call for Press
                setMachinesLoading(true);
                const plantKey = PLANT_MAP[machineDetails.plant];

                fetch(`${BASE_URL}/api/machines/list/?plant=${plantKey}&machine_name=Press`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.success && data.machines) {
                            setMachineList(data.machines);
                        } else if (Array.isArray(data)) {
                            setMachineList(data);
                        } else {
                            setMachineList([]);
                        }
                    })
                    .catch(err => console.error('Error fetching machines:', err))
                    .finally(() => setMachinesLoading(false));

            } else if (machineDetails.machineName === "CNC") {
                // Frontend Logic for CNC (12 Machines)
                const cncMachines = Array.from({ length: 12 }, (_, i) => `CNC-${String(i + 1).padStart(2, '0')}`);
                setMachineList(cncMachines);
                setMachinesLoading(false);

            } else if (machineDetails.machineName === "VMC") {
                // Frontend Logic for VMC (4 Machines)
                const vmcMachines = Array.from({ length: 4 }, (_, i) => `VMC-${String(i + 1).padStart(2, '0')}`);
                setMachineList(vmcMachines);
                setMachinesLoading(false);

            } else {
                setMachineList([]);
            }
        } else {
            setMachineList([]);
        }
    }, [machineDetails.plant, machineDetails.machineName]);

    useEffect(() => {
        if (!id) return;

        const normalizePlantForUI = (plantValue = "") => {
            if (plantValue === "plant_1") return "Plant 1";
            if (plantValue === "plant_2") return "Plant 2";
            return plantValue;
        };

        const fetchReport = async () => {
            try {
                const res = await axios.get(
                    `${BASE_URL}/api/get-single-maintenance-report/machine-history/${id}/`
                );

                if (res.data.success) {
                    const data = res.data.data || {};

                    setMachineDetails({
                        plant: normalizePlantForUI(data.machineDetails?.plant || ""),
                        machineName: data.machineDetails?.machineName || "",
                        machineNo: data.machineDetails?.machineNo || "",
                        machineSpecs: data.machineDetails?.machineSpecs || "",
                        location: data.machineDetails?.location || "",
                    });

                    setHistoryData(
                        Array.isArray(data.historyData) && data.historyData.length
                            ? data.historyData
                            : [
                                { id: 1, date: "", problem: "", actionTaken: "", update4M: "", signature: "", remarks: "" },
                            ]
                    );

                    setSignatures(data.signatures || { preparedBy: "", approvedBy: "" });
                    setApprovalRemark(data.approval_remarks || "");
                } else {
                    alert(res.data.error || "Failed to load Machine History Card.");
                }
            } catch (err) {
                console.error("Error loading Machine History Card:", err);
                alert("Failed to load Machine History Card.");
            }
        };

        fetchReport();
    }, [id]);

    // --- HANDLERS ---
    const handleDetailChange = (e) => {
        const { name, value } = e.target;
        setMachineDetails(prev => {
            const newData = { ...prev, [name]: value };

            // Clear Machine No. if Plant or Machine Name is changed
            if (name === "plant" || name === "machineName") {
                newData.machineNo = "";
            }

            return newData;
        });
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!machineDetails.plant || !machineDetails.machineName || !machineDetails.machineNo) {
            alert(" Please fill in the Plant, Machine Name, and Machine No.");
            return;
        }

        setIsSubmitting(true);

        // Add plant mapping to submission data if backend requires it formatted
        const currentUser = localStorage.getItem("username") || "Unknown User";

        const submissionData = {
            username: currentUser,
            machineDetails: {
                ...machineDetails,
                plant: PLANT_MAP[machineDetails.plant] || machineDetails.plant,
            },
            historyData,
            signatures,
        };

        try {
            // BACKEND API CALL
            const response = await fetch(`${BASE_URL}/api/machine-history/save/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            });

            const result = await response.json();

            if (result.success || response.ok) {
               
                alert(" Success: Machine History Card successfully updated in database!");

                // Reset form after successful submission
                setMachineDetails({
                    plant: '',
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
                setMachineList([]);
            } else {
                alert(" Error: " + (result.error || "Failed to save data"));
            }
        } catch (error) {
            console.error("Submission Error:", error);
            alert(" Network Error: Could not connect to the server.");
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleApprove = async () => {
        try {
            setApprovalLoading(true);

            const currentUser = localStorage.getItem("username") || "Approver";

            await axios.post(`${BASE_URL}/api/approve-report/`, {
                log_id: id,
                approver_username: currentUser,
                remarks: approvalRemark,
            });

            alert("Report approved successfully.");
            navigate("/notifications");
        } catch (err) {
            console.error("Approve error:", err);
            alert(err.response?.data?.error || "Approval failed.");
        } finally {
            setApprovalLoading(false);
        }
    };

    const handleReject = async () => {
        if (!approvalRemark.trim()) {
            alert("Please enter remark before rejecting.");
            return;
        }

        try {
            setApprovalLoading(true);

            const currentUser = localStorage.getItem("username") || "Approver";

            await axios.post(`${BASE_URL}/api/reject-report/`, {
                log_id: id,
                approver_username: currentUser,
                remarks: approvalRemark,
            });

            alert("Report rejected successfully.");
            navigate("/notifications");
        } catch (err) {
            console.error("Reject error:", err);
            alert(err.response?.data?.error || "Reject failed.");
        } finally {
            setApprovalLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Simple Navbar */}
            <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <button
                                onClick={() => navigate('/Maintenance/Machine/daily')}
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                            {/* 1. Plant Field */}
                            <div>
                                <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase mb-1.5">
                                    Plant <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="plant"
                                    value={machineDetails.plant}
                                    onChange={handleDetailChange}
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all"
                                >
                                    <option value="" className="text-slate-400">Select Plant</option>
                                    <option value="Plant 1">Plant 1</option>
                                    <option value="Plant 2">Plant 2</option>
                                </select>
                            </div>

                            {/* 2. Machine Name Field */}
                            <div>
                                <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase mb-1.5">
                                    Machine Name <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="machineName"
                                    value={machineDetails.machineName}
                                    onChange={handleDetailChange}
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all"
                                >
                                    <option value="" className="text-slate-400">Select Machine</option>
                                    <option value="Press">POWER PRESS</option>
                                    <option value="CNC">CNC</option>
                                    <option value="VMC">VMC</option>
                                </select>
                            </div>

                            {/* 3. Machine No Field */}
                            <div>
                                <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase mb-1.5">
                                    Machine No. <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="machineNo"
                                    value={machineDetails.machineNo}
                                    onChange={handleDetailChange}
                                    disabled={!machineDetails.plant || !machineDetails.machineName || machinesLoading}
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 text-sm font-semibold text-blue-600 outline-none focus:border-blue-500 focus:bg-white transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                                >
                                    <option value="">
                                        {machinesLoading
                                            ? "Loading..."
                                            : (!machineDetails.plant || !machineDetails.machineName)
                                                ? "Select Plant & Machine"
                                                : "Select Machine No"}
                                    </option>
                                    {machineList.map((mc, index) => (
                                        <option key={index} value={mc}>{mc}</option>
                                    ))}
                                </select>
                            </div>

                            {/* 4. Machine Specs */}
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
                                    disabled={isViewMode}
                                    placeholder="e.g. 250 Ton Capacity"
                                />
                            </div>

                            {/* 5. Location */}
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
                                    disabled={isViewMode}
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
                                                    disabled={isViewMode}
                                                    onChange={(e) => handleRowChange(row.id, 'date', e.target.value)}
                                                />
                                            </td>
                                            <td className="px-2 sm:px-3 py-2">
                                                <textarea
                                                    className="w-full border-2 border-slate-200 rounded-lg p-1.5 text-xs focus:border-blue-500 outline-none resize-y text-slate-700"
                                                    rows="1"
                                                    placeholder="Describe issue..."
                                                    value={row.problem}
                                                    disabled={isViewMode}
                                                    onChange={(e) => handleRowChange(row.id, 'problem', e.target.value)}
                                                />
                                            </td>
                                            <td className="px-2 sm:px-3 py-2">
                                                <textarea
                                                    className="w-full border-2 border-slate-200 rounded-lg p-1.5 text-xs focus:border-blue-500 outline-none resize-y text-slate-700"
                                                    rows="1"
                                                    placeholder="Actions performed..."
                                                    value={row.actionTaken}
                                                    disabled={isViewMode}
                                                    onChange={(e) => handleRowChange(row.id, 'actionTaken', e.target.value)}
                                                />
                                            </td>
                                            <td className="px-2 sm:px-3 py-2 text-center">
                                                <select
                                                    className="w-full border-2 border-slate-200 rounded-lg p-1.5 text-xs focus:border-blue-500 outline-none text-slate-700 "
                                                    value={row.update4M}
                                                    disabled={isViewMode}
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
                                                    disabled={isViewMode}
                                                    onChange={(e) => handleRowChange(row.id, 'signature', e.target.value)}
                                                />
                                            </td>
                                            <td className="px-2 sm:px-3 py-2">
                                                <input
                                                    type="text"
                                                    className="w-full border-2 border-slate-200 rounded-lg p-1.5 text-xs focus:border-blue-500 outline-none text-slate-700"
                                                    placeholder="Any remarks"
                                                    value={row.remarks}
                                                    disabled={isViewMode}
                                                    onChange={(e) => handleRowChange(row.id, 'remarks', e.target.value)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {!isViewMode && (
                            <button
                                className="mt-4 w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-blue-600 font-bold text-xs uppercase tracking-wide hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                                onClick={addRow}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                Add New Record
                            </button>
                        )}
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
                                    onChange={(e) => setSignatures({ ...signatures, preparedBy: e.target.value })}
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
                                    onChange={(e) => setSignatures({ ...signatures, approvedBy: e.target.value })}
                                />
                            </div>
                        </div>
                        {isViewMode ? (
                            <div className="mt-6 border-t border-slate-200 pt-5">
                                <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase mb-2">
                                    Approval / Rejection Remark
                                </label>

                                <textarea
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:bg-white transition-all"
                                    rows="3"
                                    value={approvalRemark}
                                    onChange={(e) => setApprovalRemark(e.target.value)}
                                    placeholder="Enter approval or rejection remark..."
                                />

                                <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end mt-4">
                                    <button
                                        type="button"
                                        onClick={handleReject}
                                        disabled={approvalLoading}
                                        className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wide shadow-md flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-70"
                                    >
                                        Reject
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleApprove}
                                        disabled={approvalLoading}
                                        className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wide shadow-md flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-70"
                                    >
                                        Approve
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
                                <button
                                    className={`px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wide shadow-md flex items-center justify-center gap-2 w-full sm:w-auto ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-600 hover:to-blue-700 hover:shadow-lg transition-all'}`}
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                            </svg>
                                            Save History Card
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MachineHistoryCard;