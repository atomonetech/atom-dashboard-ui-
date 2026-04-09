import React from 'react';
import { useNavigate } from 'react-router-dom';

const BushPinChart = () => {
    const navigate = useNavigate();

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            
            <div className="container bg-white shadow-lg rounded-4 p-0 border-0 overflow-hidden" style={{ maxWidth: '1100px' }}>
                {/* Header */}
                <div className="p-4 bg-white border-bottom d-flex justify-content-between align-items-center">
                    <button className="btn btn-outline-secondary border-0 fw-bold px-0 text-slate-700" onClick={() => navigate(-1)}>
                        <i className="bi bi-arrow-left me-2"></i> Back to Checklist
                    </button>
                    <h4 className="fw-bold text-slate-700 mb-0" style={{ color: '#1e293b' }}>Bush / Locating Pin / Pad Chart</h4>
                    <div className="text-end text-muted small fw-bold">AOT-F-TM-10</div>
                </div>

                <div className="p-4">
                    <div className="row g-4">
                        {/* LEFT: PIN TABLE */}
                        <div className="col-lg-6">
                            <div className="table-responsive border rounded-3 overflow-hidden shadow-sm">
                                <table className="table table-hover mb-0 align-middle">
                                    <thead style={{ backgroundColor: '#f1f5f9' }}>
                                        <tr className="small text-slate-600 fw-bold border-bottom">
                                            <th className="p-3 text-center">Pin No.</th>
                                            <th className="p-3">Dia Req.</th>
                                            <th className="p-3">Dia Actual</th>
                                            <th className="p-3 text-center">Remark</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[...Array(12)].map((_, i) => (
                                            <tr key={i}>
                                                <td className="p-3 fw-bold text-center border-end bg-light" style={{ color: '#64748b' }}>{i + 1}</td>
                                                <td className="p-1"><input type="text" className="form-control border-0 py-2 text-center" placeholder="0.00" /></td>
                                                <td className="p-1"><input type="text" className="form-control border-0 py-2 text-center" placeholder="0.00" /></td>
                                                <td className="p-1">
                                                    <select className="form-select border-0 shadow-none small fw-bold text-success">
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
                        <div className="col-lg-6">
                            <div className="table-responsive border rounded-3 overflow-hidden shadow-sm">
                                <table className="table table-hover mb-0 align-middle">
                                    <thead style={{ backgroundColor: '#f1f5f9' }}>
                                        <tr className="small text-slate-600 fw-bold border-bottom">
                                            <th className="p-3 text-center">Bush No.</th>
                                            <th className="p-3">Dimn. Req.</th>
                                            <th className="p-3">Dimn. Actual</th>
                                            <th className="p-3 text-center">Remark</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[...Array(12)].map((_, i) => (
                                            <tr key={i}>
                                                <td className="p-3 fw-bold text-center border-end bg-light" style={{ color: '#64748b' }}>{i + 1}</td>
                                                <td className="p-1"><input type="text" className="form-control border-0 py-2 text-center" placeholder="0.00" /></td>
                                                <td className="p-1"><input type="text" className="form-control border-0 py-2 text-center" placeholder="0.00" /></td>
                                                <td className="p-1"><input type="text" className="form-control border-0 py-2 text-center" placeholder="OK/Not OK" /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Submit */}
                    <div className="mt-5 p-4 rounded-4 bg-light d-flex justify-content-between align-items-center border">
                        <div className="fw-bold text-slate-700">
                            INSPECTED BY: <input type="text" className="border-0 bg-transparent border-bottom border-dark ms-2 fw-normal" placeholder="Engineer Sign" />
                        </div>
                        <button className="btn btn-dark px-5 py-3 fw-bold rounded-3 shadow">Final Audit Submission</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BushPinChart;