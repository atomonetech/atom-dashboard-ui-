import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

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

    const [partsData, setPartsData] = useState([]);
    const [operationNames, setOperationNames] = useState([]);

    const [formData, setFormData] = useState({
        partName: '',
        partNo: '',
        doneOnDate: new Date().toISOString().split('T')[0],
        fixtureNo: '',
        operationName: ''
    });

    const [checklistValues, setChecklistValues] = useState(
        checklistPoints.map(point => ({
            parameter: point,
            status: '',
            remarks: '',
            correctiveAction: ''
        }))
    );

    useEffect(() => {
        fetch(`${BASE_URL}/api/master-dropdown/?filter=all_parts`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPartsData(data.map(item => ({ part_name: item[0], part_no: item[1] })));
                }
            })
            .catch(err => console.error('Error fetching parts:', err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'partName') {
            const selectedPart = partsData.find(p => p.part_name === value);
            setFormData(prev => ({
                ...prev,
                partName: value,
                partNo: selectedPart ? selectedPart.part_no : '',
                operationName: '' 
            }));
            if (value) {
                fetch(`${BASE_URL}/api/master-dropdown/?filter=operations_by_part&part=${encodeURIComponent(value)}`)
                    .then(res => res.json())
                    .then(data => setOperationNames(data))
                    .catch(err => console.error('Error fetching operations:', err));
            } else {
                setOperationNames([]);
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleChecklistChange = (index, field, value) => {
        const updatedChecklist = [...checklistValues];
        updatedChecklist[index][field] = value;
        setChecklistValues(updatedChecklist);
    };

    // YEH FUNCTION DATA KO NEXT PAGE PAR BHEJEGA (SAVE NAHI KAREGA)
    const handleProceedToChart = () => {
        if (!formData.partName || !formData.fixtureNo || !formData.operationName) {
            alert("Please fill Assembly Name, Fixture No, and Operation before proceeding.");
            return;
        }

        // navigate ke sath state bhej rahe hain
        navigate('/Maintenance/Tool/bush-check-point', { 
            state: { 
                page1FormData: formData, 
                page1Checklist: checklistValues 
            } 
        });
    };

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '40px 20px' }}>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            
            <div className="container shadow-lg bg-white rounded-4 border-0 p-0 overflow-hidden" style={{ maxWidth: '1100px' }}>
                <header className="p-4 border-bottom bg-white d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
                    <div className="d-flex align-items-center gap-3">
                        <div onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} className="d-flex align-items-center">
                            <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3"><i className="bi bi-arrow-left fs-5 text-primary"></i></div>
                            <h2 className="fw-bolder mb-0 text-dark" style={{ letterSpacing: '-1px' }}>AtomOne</h2>
                        </div>
                        <div className="border-start border-2" style={{ height: '35px' }}></div>
                        <span className="text-secondary small fw-bold text-uppercase">Welding Fixture Maintenance</span>
                    </div>
                    <div className="text-end bg-light p-3 rounded-3">
                        <h4 className="fw-bold mb-2 text-dark">Preventive Maintenance Checklist</h4>
                        <span className="badge bg-white text-secondary border px-3 py-2 shadow-sm rounded-pill">Form: AOT-F-TM-10</span>
                    </div>
                </header>

                <div className="p-4 p-md-5">
                    <div className="row g-4 mb-5 p-4 rounded-4" style={{ backgroundColor: '#f1f5f9' }}>
                        <div className="col-12 col-md-6">
                            <label className="small fw-bold text-secondary text-uppercase mb-2">Assembly / Part Name & No. <span className="text-danger">*</span></label>
                            <select name="partName" value={formData.partName} onChange={handleChange} className="form-select border-0 shadow-sm py-2">
                                <option value="">Select Part Name & No.</option>
                                {partsData.map((part, index) => (
                                    <option key={index} value={part.part_name}>{part.part_name} {part.part_no ? ` | (${part.part_no})` : ''}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="small fw-bold text-secondary text-uppercase mb-2">Done on Date <span className="text-danger">*</span></label>
                            <input type="date" name="doneOnDate" value={formData.doneOnDate} onChange={handleChange} className="form-control border-0 shadow-sm py-2" />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="small fw-bold text-secondary text-uppercase mb-2">Fixture No. <span className="text-danger">*</span></label>
                            <input type="text" name="fixtureNo" value={formData.fixtureNo} onChange={handleChange} className="form-control border-0 shadow-sm py-2" placeholder="e.g. FX-001" />
                        </div>
                        <div className="col-12 col-md-6">
                            <label className="small fw-bold text-secondary text-uppercase mb-2">Operation <span className="text-danger">*</span></label>
                            <select name="operationName" value={formData.operationName} onChange={handleChange} disabled={!formData.partName} className="form-select border-0 shadow-sm py-2">
                                <option value="">Select Operation</option>
                                {operationNames.map((op, index) => <option key={index} value={op}>{op}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="mb-5">
                        <div className="row px-3 pb-2 border-bottom d-none d-md-flex text-secondary small fw-bold text-uppercase">
                            <div className="col-md-4">Checklist Parameter</div>
                            <div className="col-md-3 text-center">Status</div>
                            <div className="col-md-2">Remarks</div>
                            <div className="col-md-3">Corrective Action</div>
                        </div>

                        {checklistValues.map((item, index) => (
                            <div key={index} className="row align-items-center py-3 border-bottom g-3 mx-0">
                                <div className="col-12 col-md-4"><h6 className="mb-0 fw-semibold text-dark"><span className="text-primary me-2">{index + 1}.</span>{item.parameter}</h6></div>
                                <div className="col-12 col-md-3 text-center">
                                    <div className="btn-group btn-group-sm w-100 shadow-sm">
                                        <input type="radio" className="btn-check" name={`st-${index}`} id={`ok-${index}`} value="OK" checked={item.status === 'OK'} onChange={(e) => handleChecklistChange(index, 'status', e.target.value)} />
                                        <label className="btn btn-outline-success fw-bold" htmlFor={`ok-${index}`}>OK</label>
                                        <input type="radio" className="btn-check" name={`st-${index}`} id={`notok-${index}`} value="NOT OK" checked={item.status === 'NOT OK'} onChange={(e) => handleChecklistChange(index, 'status', e.target.value)} />
                                        <label className="btn btn-outline-danger fw-bold" htmlFor={`notok-${index}`}>NOT OK</label>
                                        <input type="radio" className="btn-check" name={`st-${index}`} id={`na-${index}`} value="N/A" checked={item.status === 'N/A'} onChange={(e) => handleChecklistChange(index, 'status', e.target.value)} />
                                        <label className="btn btn-outline-secondary fw-bold" htmlFor={`na-${index}`}>N/A</label>
                                    </div>
                                </div>
                                <div className="col-12 col-md-2"><input type="text" value={item.remarks} onChange={(e) => handleChecklistChange(index, 'remarks', e.target.value)} className="form-control form-control-sm bg-light" placeholder="Remarks..." /></div>
                                <div className="col-12 col-md-3"><input type="text" value={item.correctiveAction} onChange={(e) => handleChecklistChange(index, 'correctiveAction', e.target.value)} className="form-control form-control-sm" placeholder="Corrective Action" /></div>
                            </div>
                        ))}
                    </div>

                    {/* ACTION BUTTON (Sirf next page pe jayega) */}
                    <div className="p-4 rounded-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between shadow-sm gap-3" style={{ border: '2px dashed #4f46e5', backgroundColor: '#f5f3ff' }}>
                        <div>
                            <h5 className="fw-bold mb-1" style={{ color: '#4338ca' }}><span className="me-2">9.</span>Dimensions & Dia Data</h5>
                            <p className="text-secondary mb-0 small">Proceed to fill the detailed Bush and Pin diameter technical chart.</p>
                        </div>
                        <button className="btn shadow px-4 py-2 fw-bold text-white w-100 w-md-auto" style={{ backgroundColor: '#4f46e5', borderRadius: '8px' }} onClick={handleProceedToChart}>
                            Open Technical Chart & Proceed <i className="bi bi-arrow-right ms-2"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeldingFixtureForm;