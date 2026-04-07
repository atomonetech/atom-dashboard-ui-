import React from 'react';
import { useNavigate } from 'react-router-dom';

const BushPinChart = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white min-h-screen py-10 px-5">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
            
            <div className="container mx-auto bg-white shadow-xl rounded-3xl overflow-hidden" style={{ maxWidth: '1200px' }}>
                {/* Header with Back Button */}
                <div className="p-5 bg-white border-b flex justify-between items-center">
                    <button 
                        className="group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300"
                        onClick={() => navigate(-1)}
                        style={{ 
                            color: '#1e3c72',
                            backgroundColor: 'transparent',
                            border: '1px solid #e2e8f0'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#1e3c72';
                            e.target.style.color = 'white';
                            e.target.style.borderColor = '#1e3c72';
                            e.target.style.transform = 'translateX(-4px)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#1e3c72';
                            e.target.style.borderColor = '#e2e8f0';
                            e.target.style.transform = 'translateX(0)';
                        }}
                    >
                        <i className="bi bi-arrow-left-short fs-3 group-hover:translate-x-[-2px] transition-transform"></i>
                        <span className="font-semibold">Back to Checklist</span>
                    </button>
                    <h4 className="font-bold mb-0 text-xl" style={{ color: '#1e3c72' }}>Bush / Locating Pin / Pad Chart</h4>
                    <div className="text-end text-gray-400 text-sm font-bold">AOT-F-TM-10</div>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* LEFT: PIN TABLE */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <i className="bi bi-pin-angle-fill text-2xl" style={{ color: '#1e3c72' }}></i>
                                <h5 className="font-bold mb-0" style={{ color: '#1e3c72' }}>Locating Pins</h5>
                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs ms-2">12 Positions</span>
                            </div>
                            <div className="table-responsive border rounded-xl overflow-hidden shadow-sm">
                                <table className="table table-hover mb-0 align-middle">
                                    <thead style={{ backgroundColor: '#f8fafc' }}>
                                        <tr className="text-sm font-bold border-b" style={{ color: '#1e3c72' }}>
                                            <th className="p-3 text-center">Pin No.</th>
                                            <th className="p-3">Dia Req.</th>
                                            <th className="p-3">Dia Actual</th>
                                            <th className="p-3 text-center">Remark</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[...Array(12)].map((_, i) => (
                                            <tr key={i}>
                                                <td className="p-3 fw-bold text-center bg-gray-50" style={{ color: '#64748b' }}>{i + 1}</td>
                                                <td className="p-2">
                                                    <input type="text" className="w-full px-2 py-2 text-center border rounded-lg border-gray-200" placeholder="0.00" />
                                                </td>
                                                <td className="p-2">
                                                    <input type="text" className="w-full px-2 py-2 text-center border rounded-lg border-gray-200" placeholder="0.00" />
                                                </td>
                                                <td className="p-2">
                                                    <select className="w-full px-2 py-2 text-sm font-semibold border rounded-lg border-gray-200" style={{ color: '#10b981' }}>
                                                        <option>OK</option>
                                                        <option className="text-danger">NOT OK</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* RIGHT: BUSH/PAD TABLE */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <i className="bi bi-grid-3x3-gap-fill text-2xl" style={{ color: '#1e3c72' }}></i>
                                <h5 className="font-bold mb-0" style={{ color: '#1e3c72' }}>Bush & Resting Pad</h5>
                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs ms-2">12 Entries</span>
                            </div>
                            <div className="table-responsive border rounded-xl overflow-hidden shadow-sm">
                                <table className="table table-hover mb-0 align-middle">
                                    <thead style={{ backgroundColor: '#f8fafc' }}>
                                        <tr className="text-sm font-bold border-b" style={{ color: '#1e3c72' }}>
                                            <th className="p-3 text-center">Bush No.</th>
                                            <th className="p-3">Dimn. Req.</th>
                                            <th className="p-3">Dimn. Actual</th>
                                            <th className="p-3 text-center">Remark</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[...Array(12)].map((_, i) => (
                                            <tr key={i}>
                                                <td className="p-3 fw-bold text-center bg-gray-50" style={{ color: '#64748b' }}>{i + 1}</td>
                                                <td className="p-2">
                                                    <input type="text" className="w-full px-2 py-2 text-center border rounded-lg border-gray-200" placeholder="0.00" />
                                                </td>
                                                <td className="p-2">
                                                    <input type="text" className="w-full px-2 py-2 text-center border rounded-lg border-gray-200" placeholder="0.00" />
                                                </td>
                                                <td className="p-2">
                                                    <input type="text" className="w-full px-2 py-2 text-center border rounded-lg border-gray-200" placeholder="OK/Not OK" />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Submit */}
                    <div className="mt-8 p-5 rounded-xl bg-gray-50 flex justify-between items-center border flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                            <button 
                                className="group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300"
                                onClick={() => navigate(-1)}
                                style={{ 
                                    borderColor: '#1e3c72', 
                                    color: '#1e3c72',
                                    backgroundColor: 'transparent',
                                    border: '1px solid #1e3c72'
                                }}
                                onMouseEnter={(e) => { 
                                    e.target.style.backgroundColor = '#1e3c72'; 
                                    e.target.style.color = 'white';
                                    e.target.style.transform = 'translateX(-4px)';
                                }}
                                onMouseLeave={(e) => { 
                                    e.target.style.backgroundColor = 'transparent'; 
                                    e.target.style.color = '#1e3c72';
                                    e.target.style.transform = 'translateX(0)';
                                }}
                            >
                                <i className="bi bi-arrow-left me-2 group-hover:translate-x-[-2px] transition-transform"></i> 
                                Back to Form
                            </button>
                            <div className="font-bold" style={{ color: '#1e3c72' }}>
                                INSPECTED BY: <input type="text" className="border-0 bg-transparent border-b-2 ms-2 font-normal outline-none" style={{ borderBottomColor: '#1e3c72', minWidth: '180px' }} placeholder="Engineer Sign" />
                            </div>
                        </div>
                        <button 
                            className="px-6 py-3 font-bold rounded-xl shadow text-white transition-all hover:opacity-90 hover:scale-105"
                            style={{ backgroundColor: '#1e3c72', border: 'none' }}
                            onClick={() => {
                                alert('Final Audit Submitted Successfully!');
                                navigate('/');
                            }}
                        >
                            <i className="bi bi-check2-circle me-2"></i>
                            Final Audit Submission
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BushPinChart;