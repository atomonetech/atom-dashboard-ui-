import React from 'react';
import { useNavigate } from 'react-router-dom';

const WeldingFixtureForm = () => {
    const navigate = useNavigate();

    const checklistPoints = [
        "Visual Observation: Cleanliness, Painting, No damage, Identification",
        "Locating Pins / Resting Pad",
        "Locating Pins Numbering",
        "Locating Bush",
        "Clamps",
        "Pneumatic System",
        "Lubricating System",
        "Copper Plates"
    ];

    return (
        <div className="bg-white min-h-screen py-10 px-5">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
            
            <div className="container mx-auto shadow-xl bg-white rounded-3xl overflow-hidden" style={{ maxWidth: '1000px' }}>
                {/* Professional Header */}
                <div className="p-6 border-b bg-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => navigate('/Maintenance/Tool-Hub')}
                            className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center hover:bg-gray-100 transition-all"
                            style={{ width: '40px', height: '40px', borderColor: '#cbd5e1' }}
                        >
                            <i className="bi bi-arrow-left fs-5"></i>
                        </button>
                        <div>
                            <h2 className="font-bold mb-0 text-2xl" style={{ color: '#1e3c72', letterSpacing: '-0.5px' }}>WELDING FIXTURE MAINTENANCE</h2>
                            <p className="text-gray-500 text-sm mb-0 font-semibold">Preventive Maintenance Checklist</p>
                        </div>
                    </div>
                    <div className="text-end">
                        <span className="bg-blue-50 text-blue-700 px-3 py-2 rounded-full font-semibold text-sm">Form No: AOT-F-TM-10</span>
                    </div>
                </div>

                <div className="p-8">
                    {/* Header Inputs Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-4 rounded-xl bg-gray-50 border-l-4" style={{ borderLeftColor: '#1e3c72' }}>
                        <div className="md:col-span-2">
                            <label className="text-xs font-bold uppercase mb-2 block" style={{ letterSpacing: '0.5px', color: '#1e3c72' }}>Assembly / Part Name & Number</label>
                            <input type="text" className="w-full px-4 py-2 border-0 shadow-sm rounded-xl bg-white" placeholder="Part details..." />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase mb-2 block" style={{ letterSpacing: '0.5px', color: '#1e3c72' }}>Done on Date</label>
                            <input type="date" className="w-full px-4 py-2 border-0 shadow-sm rounded-xl bg-white" />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase mb-2 block" style={{ letterSpacing: '0.5px', color: '#1e3c72' }}>Fixture No.</label>
                            <input type="text" className="w-full px-4 py-2 border-0 shadow-sm rounded-xl bg-white" placeholder="FX-00" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs font-bold uppercase mb-2 block" style={{ letterSpacing: '0.5px', color: '#1e3c72' }}>Operation</label>
                            <input type="text" className="w-full px-4 py-2 border-0 shadow-sm rounded-xl bg-white" placeholder="Operation name..." />
                        </div>
                    </div>

                    {/* Point 1 to 8 Checklist */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="bg-blue-50 p-2 rounded-full">
                                <i className="bi bi-check2-square font-bold" style={{ color: '#1e3c72' }}></i>
                            </div>
                            <h5 className="font-bold mb-0 text-lg" style={{ color: '#1e3c72' }}>Inspection Checklist</h5>
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs ms-2">8 Points</span>
                        </div>
                        
                        {checklistPoints.map((item, index) => (
                            <div key={index} className="grid grid-cols-1 lg:grid-cols-12 gap-3 py-4 border-b items-center">
                                <div className="lg:col-span-6">
                                    <h6 className="mb-2 font-bold text-gray-700">{index + 1}) {item}</h6>
                                    <input type="text" className="w-full px-3 py-2 text-sm border-0 bg-gray-50 rounded-lg" placeholder="Remarks..." />
                                </div>
                                <div className="lg:col-span-3 text-center">
                                    <div className="btn-group btn-group-sm w-100 shadow-sm">
                                        <input type="radio" className="btn-check" name={`st-${index}`} id={`ok-${index}`} />
                                        <label className="btn btn-outline-success border-2 fw-bold" htmlFor={`ok-${index}`}>OK</label>
                                        <input type="radio" className="btn-check" name={`st-${index}`} id={`notok-${index}`} />
                                        <label className="btn btn-outline-danger border-2 fw-bold" htmlFor={`notok-${index}`}>NOT OK</label>
                                        <input type="radio" className="btn-check" name={`st-${index}`} id={`na-${index}`} />
                                        <label className="btn btn-outline-secondary border-2 fw-bold" htmlFor={`na-${index}`}>N/A</label>
                                    </div>
                                </div>
                                <div className="lg:col-span-3">
                                    <input type="text" className="w-full px-3 py-2 text-sm border rounded-lg border-gray-200" placeholder="Corrective Action" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* STEP 2 LINK (Point 9) - Opens BushPinChart */}
                    <div className="mt-6 p-4 rounded-xl border-2 border-dashed flex items-center justify-between shadow-sm" 
                         style={{ borderColor: '#1e3c72', backgroundColor: '#f0f9ff' }}>
                        <div>
                            <h5 className="font-bold mb-1" style={{ color: '#1e3c72' }}>9) Dimensions & Dia Data</h5>
                            <p className="text-gray-600 mb-0 text-sm">Proceed to fill the detailed Bush and Pin diameter technical chart.</p>
                        </div>
                        <button 
                            className="btn shadow px-4 py-2 fw-bold text-white rounded-xl" 
                            style={{ backgroundColor: '#1e3c72', border: 'none' }}
                            onClick={() => navigate('/Maintenance/Tool/Weekly-chart')}
                        >
                            Open Technical Chart <i className="bi bi-arrow-right ms-2"></i>
                        </button>
                    </div>

                    <div className="mt-6 pt-4 border-t text-center">
                        <p className="text-gray-400 text-sm mb-0">Please complete both sheets before final submission.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeldingFixtureForm;