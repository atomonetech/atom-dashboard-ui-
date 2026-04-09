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
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            
            <div className="container shadow-lg bg-white rounded-4 border-0 p-0 overflow-hidden" style={{ maxWidth: '950px' }}>
                {/* Professional Header */}
                <div className="p-4 border-bottom bg-white d-flex justify-content-between align-items-center">
                    <div>
                        <h2 className="fw-bold mb-0" style={{ color: '#0f172a', letterSpacing: '-1px' }}>AtomOne</h2>
                        <p className="text-secondary small mb-0 fw-bold">WELDING FIXTURE MAINTENANCE</p>
                    </div>
                    <div className="text-end">
                        <h4 className="fw-bold mb-0 text-slate-700" style={{ color: '#334155' }}>Preventive Maintenance Checklist</h4>
                        <span className="badge bg-light text-slate-600 border">Form No: AOT-F-TM-10</span>
                    </div>
                </div>

                <div className="p-4">
                    {/* Header Inputs Grid */}
                    <div className="row g-3 mb-5 p-3 rounded-4" style={{ backgroundColor: '#f1f5f9' }}>
                        <div className="col-md-8">
                            <label className="small fw-bold text-slate-600 text-uppercase mb-1">Assembly / Part Name & Number</label>
                            <input type="text" className="form-control border-0 shadow-sm py-2" placeholder="Part details..." />
                        </div>
                        <div className="col-md-4">
                            <label className="small fw-bold text-slate-600 text-uppercase mb-1">Done on Date</label>
                            <input type="date" className="form-control border-0 shadow-sm py-2" />
                        </div>
                        <div className="col-md-4">
                            <label className="small fw-bold text-slate-600 text-uppercase mb-1">Fixture No.</label>
                            <input type="text" className="form-control border-0 shadow-sm py-2" placeholder="FX-00" />
                        </div>
                        <div className="col-md-8">
                            <label className="small fw-bold text-slate-600 text-uppercase mb-1">Operation</label>
                            <input type="text" className="form-control border-0 shadow-sm py-2" placeholder="Operation name..." />
                        </div>
                    </div>

                    {/* Point 1 to 8 Checklist */}
                    <div className="mb-4">
                        {checklistPoints.map((item, index) => (
                            <div key={index} className="row align-items-center py-3 border-bottom g-3 mx-0">
                                <div className="col-lg-6">
                                    <h6 className="mb-1 text-slate-700 fw-bold" style={{ color: '#334155' }}>{index + 1}) {item}</h6>
                                    <input type="text" className="form-control form-control-sm border-0 bg-light" placeholder="Remarks..." />
                                </div>
                                <div className="col-lg-3 text-center">
                                    <div className="btn-group btn-group-sm w-100 shadow-sm">
                                        <input type="radio" className="btn-check" name={`st-${index}`} id={`ok-${index}`} />
                                        <label className="btn btn-outline-success border-2 fw-bold" htmlFor={`ok-${index}`}>OK</label>
                                        <input type="radio" className="btn-check" name={`st-${index}`} id={`notok-${index}`} />
                                        <label className="btn btn-outline-danger border-2 fw-bold" htmlFor={`notok-${index}`}>NOT OK</label>
                                        <input type="radio" className="btn-check" name={`st-${index}`} id={`na-${index}`} />
                                        <label className="btn btn-outline-secondary border-2 fw-bold" htmlFor={`na-${index}`}>N/A</label>
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <input type="text" className="form-control form-control-sm border-slate-200" placeholder="Corrective Action" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 🔥 STEP 2 LINK (Point 9) */}
                    <div className="mt-5 p-4 rounded-4 border-2 d-flex align-items-center justify-content-between shadow-sm" 
                         style={{ borderStyle: 'dashed', borderColor: '#4f46e5', backgroundColor: '#f5f3ff' }}>
                        <div>
                            <h5 className="fw-bold mb-1" style={{ color: '#4338ca' }}>9) Dimensions & Dia Data</h5>
                            <p className="text-slate-600 mb-0 small">Proceed to fill the detailed Bush and Pin diameter technical chart.</p>
                        </div>
                        <button 
                            className="btn btn-indigo shadow px-4 py-2 fw-bold text-white" 
                            style={{ backgroundColor: '#4f46e5', borderRadius: '10px', border: 'none' }}
                            onClick={() => navigate('/Bush-Locating-Pin-Chart')}
                        >
                            Open Technical Chart <i className="bi bi-arrow-right ms-2"></i>
                        </button>
                    </div>

                    <div className="mt-5 pt-4 border-top text-end">
                        <p className="text-muted small">Please complete both sheets before final submission.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeldingFixtureForm;