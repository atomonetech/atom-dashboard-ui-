import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BASE_URL = 'http://192.168.0.34:8000';

const BushPinChart = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const page1Data = location.state; 

    // SOLUTION: Ek function banaya jo har baar naya independent array banayega
    const generateInitialRows = () => Array.from({ length: 12 }, () => ({ req: '', actual: '', remark: 'OK' }));
    
    // Ab dono ko alag-alag naya array mil raha hai
    const [pinData, setPinData] = useState(generateInitialRows());
    const [bushData, setBushData] = useState(generateInitialRows());
    
    const [inspectedBy, setInspectedBy] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // State Update Handlers (React standard immutable approach)
    const handlePinChange = (index, field, value) => {
        setPinData(prev => prev.map((row, i) => i === index ? { ...row, [field]: value } : row));
    };

    const handleBushChange = (index, field, value) => {
        setBushData(prev => prev.map((row, i) => i === index ? { ...row, [field]: value } : row));
    };

    const handleFinalSubmit = async () => {
        if (!page1Data) {
            alert("No data found from previous page! Please start from Checklist.");
            navigate('/Maintenance/Tool/welding-fixture'); 
            return;
        }

        if (!inspectedBy.trim()) {
            alert("Please provide the Engineer's Sign (Inspected By).");
            return;
        }

        setIsSaving(true);

        const finalPayload = {
            part_name: page1Data.page1FormData.partName,
            part_no: page1Data.page1FormData.partNo,
            done_on_date: page1Data.page1FormData.doneOnDate,
            fixture_no: page1Data.page1FormData.fixtureNo,
            operation_name: page1Data.page1FormData.operationName,
            checklist_data: page1Data.page1Checklist,
            pin_chart_data: pinData,
            bush_chart_data: bushData,
            inspected_by: inspectedBy
        };

        try {
            const response = await fetch(`${BASE_URL}/api/fixture-maintenance/save/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalPayload)
            });

            const result = await response.json();

            if (response.ok) {
                alert("Final Audit Saved Successfully! All data has been submitted.");
                navigate('/production-hub'); 
            } else {
                alert('Error saving data: ' + (result.error || JSON.stringify(result)));
            }
        } catch (error) {
            console.error('Network Error:', error);
            alert('Failed to connect to the server. Make sure Django is running.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            
            <div className="container bg-white shadow-lg rounded-4 p-0 border-0 overflow-hidden" style={{ maxWidth: '1100px' }}>
                <div className="p-4 bg-white border-bottom d-flex justify-content-between align-items-center">
                    <button className="btn btn-outline-secondary border-0 fw-bold px-0 text-slate-700" onClick={() => navigate(-1)}>
                        <i className="bi bi-arrow-left me-2"></i> Back to Checklist
                    </button>
                    <h4 className="fw-bold text-slate-700 mb-0" style={{ color: '#1e293b' }}>Bush / Locating Pin / Pad Chart</h4>
                    <div className="text-end text-muted small fw-bold">AOT-F-TM-10</div>
                </div>

                <div className="p-4">
                    {!page1Data && (
                        <div className="alert alert-warning mb-4 fw-bold">
                            Warning: Data from the Checklist page is missing. Submission might fail.
                        </div>
                    )}

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
                                        {pinData.map((row, i) => (
                                            <tr key={`pin-${i}`}>
                                                <td className="p-3 fw-bold text-center border-end bg-light text-secondary">{i + 1}</td>
                                                <td className="p-1"><input type="text" value={row.req} onChange={(e) => handlePinChange(i, 'req', e.target.value)} className="form-control border-0 py-2 text-center" placeholder="0.00" /></td>
                                                <td className="p-1"><input type="text" value={row.actual} onChange={(e) => handlePinChange(i, 'actual', e.target.value)} className="form-control border-0 py-2 text-center" placeholder="0.00" /></td>
                                                <td className="p-1">
                                                    <select value={row.remark} onChange={(e) => handlePinChange(i, 'remark', e.target.value)} className={`form-select border-0 shadow-none small fw-bold ${row.remark === 'OK' ? 'text-success' : 'text-danger'}`}>
                                                        <option value="OK">OK</option>
                                                        <option value="NOT OK">NOT OK</option>
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
                                        {bushData.map((row, i) => (
                                            <tr key={`bush-${i}`}>
                                                <td className="p-3 fw-bold text-center border-end bg-light text-secondary">{i + 1}</td>
                                                <td className="p-1"><input type="text" value={row.req} onChange={(e) => handleBushChange(i, 'req', e.target.value)} className="form-control border-0 py-2 text-center" placeholder="0.00" /></td>
                                                <td className="p-1"><input type="text" value={row.actual} onChange={(e) => handleBushChange(i, 'actual', e.target.value)} className="form-control border-0 py-2 text-center" placeholder="0.00" /></td>
                                                <td className="p-1">
                                                    <select value={row.remark} onChange={(e) => handleBushChange(i, 'remark', e.target.value)} className={`form-select border-0 shadow-none small fw-bold ${row.remark === 'OK' ? 'text-success' : 'text-danger'}`}>
                                                        <option value="OK">OK</option>
                                                        <option value="NOT OK">NOT OK</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 p-4 rounded-4 bg-light d-flex flex-column flex-md-row justify-content-between align-items-center border gap-3">
                        <div className="fw-bold text-slate-700 w-100">
                            INSPECTED BY: 
                            <input 
                                type="text" 
                                value={inspectedBy}
                                onChange={(e) => setInspectedBy(e.target.value)}
                                className="border-0 bg-transparent border-bottom border-dark ms-2 fw-normal w-50" 
                                placeholder="Engineer Sign / Name" 
                            />
                        </div>
                        <button 
                            onClick={handleFinalSubmit} 
                            disabled={isSaving}
                            className="btn btn-dark px-5 py-3 fw-bold rounded-3 shadow w-100 w-md-auto d-flex align-items-center justify-content-center"
                        >
                            {isSaving ? (
                                <><span className="spinner-border spinner-border-sm me-2"></span> Submitting...</>
                            ) : "Final Audit Submission"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BushPinChart;