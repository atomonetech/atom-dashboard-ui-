import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://192.168.0.34:8000';

const checkData = [
    {
        sNo: 1,
        checkPoint: 'Press Clean',
        subPoints: [{ specification: 'No Oil, No Stain Etc.', checkingMethod: 'Visual Check' }]
    },
    {
        sNo: 2,
        checkPoint: 'Air Pressure',
        subPoints: [
            { specification: 'Balance Pressure', checkingMethod: 'Pressure Gauge', hasInput: true },
            { specification: 'Hyd. Overload Pressure', checkingMethod: 'Pressure Gauge', hasInput: true },
            { specification: 'Clutch Pressure', checkingMethod: 'Pressure Gauge', hasInput: true },
            { specification: 'Cushion Pressure', checkingMethod: 'Pressure Gauge', hasInput: true },
            { specification: 'FRL Unit Pressure', checkingMethod: 'Pressure Gauge', hasInput: true },
        ]
    },
    {
        sNo: 3,
        checkPoint: 'Check Grease Level',
        subPoints: [{ specification: 'As Per Grease Pump', checkingMethod: 'Visual Check' }]
    },
    {
        sNo: 4,
        checkPoint: 'Nut Bolt Check',
        subPoints: [{ specification: 'All Nut Bolt Should Be Tight', checkingMethod: 'Wrench / Spanner' }]
    },
    {
        sNo: 5,
        checkPoint: 'Electric Wiring Check',
        subPoints: [{ specification: 'No Damage / Broken Wire In Machine', checkingMethod: 'Visual Check' }]
    },
    {
        sNo: 6,
        checkPoint: 'Stroke Button Check Double Handed',
        subPoints: [{ specification: 'Double Handed Button Should Be Work Properly', checkingMethod: 'Double Hand Check' }]
    },
    {
        sNo: 7,
        checkPoint: 'Photo Electric Guard Check',
        subPoints: [{ specification: 'Photo Sensor Guard Should Be Work Properly', checkingMethod: 'PLC Display' }]
    },
    {
        sNo: 8,
        checkPoint: 'Stopping Of Slide At TDC',
        subPoints: [{ specification: 'Stroke Always Stop At TDC In Single Mode', checkingMethod: 'Visual Check' }]
    },
    {
        sNo: 9,
        checkPoint: 'V-Belt Check',
        subPoints: [{ specification: 'Belt Should Not Be Damaged / Wear Out Condition', checkingMethod: 'Visual Check' }]
    },
    {
        sNo: 10,
        checkPoint: 'Pressure Gauge',
        subPoints: [{ specification: 'Working Condition / Calibration Due.', checkingMethod: 'Visual Check / Calib. Sticker' }]
    },
];

const UNITS = ['bar', 'kg/cm²', 'PSI', 'MPa'];

// UPDATE: Ensure these values match the "plant" field in your Django Operator model
const PLANT_MAP = {
    'Plant 1': 'plant_1',
    'Plant 2': 'plant_2',
};

const buildChecks = () =>
    checkData.flatMap(item =>
        item.subPoints.map((_, spi) => ({ sNo: item.sNo, spi, status: '', value: '', unit: 'bar' }))
    );

const ObsCell = ({ sNo, spi, hasInput, checks, updateCheck }) => {
    const chk = checks.find(c => c.sNo === sNo && c.spi === spi);
    if (!hasInput) return <span style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 700 }}>—</span>;
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <input
                className="obs-input"
                type="number"
                step="0.1"
                placeholder="Value"
                value={chk?.value || ''}
                onChange={e => updateCheck(sNo, spi, { value: e.target.value })}
            />
            <select
                className="unit-select"
                value={chk?.unit || 'bar'}
                onChange={e => updateCheck(sNo, spi, { unit: e.target.value })}
            >
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
        </div>
    );
};

const CheckBtns = ({ sNo, spi, checks, setStatus }) => {
    const chk = checks.find(c => c.sNo === sNo && c.spi === spi);
    return (
        <div className="d-flex justify-content-center gap-2">
            <button
                className={`check-btn ${chk?.status === 'OK' ? 'ok-active' : 'ok-idle'}`}
                onClick={() => setStatus(sNo, spi, 'OK')}
                title="OK"
            >✓</button>
            <button
                className={`check-btn ${chk?.status === 'NG' ? 'ng-active' : 'ng-idle'}`}
                onClick={() => setStatus(sNo, spi, 'NG')}
                title="NG"
            >✗</button>
        </div>
    );
};

const DailyPowerPressChecksheet = () => {
    const navigate = useNavigate();
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const [plant, setPlant] = useState('');
    const [operatorName, setOperatorName] = useState('');
    const [operators, setOperators] = useState([]);
    const [operatorsLoading, setOperatorsLoading] = useState(false);

    const [machineNo, setMachineNo] = useState('');
    const [machineList, setMachineList] = useState([]);
    const [machinesLoading, setMachinesLoading] = useState(false);

    const [shift, setShift] = useState('');
    const [checks, setChecks] = useState(buildChecks());

    // UPDATED EFFECT: Handles dynamic fetching and resetting
    useEffect(() => {
        if (!plant) {
            setOperators([]);
            setMachineList([]);
            setOperatorName('');
            setMachineNo('');
            return;
        }

        const plantKey = PLANT_MAP[plant];

        // 1. Reset dependent selections immediately when plant changes
        setOperatorName('');
        setMachineNo('');

        // 2. Operators fetch filtered by plant
        setOperatorsLoading(true);
        fetch(`${BASE_URL}/api/operators/?plant=${plantKey}`)
            .then(r => r.json())
            .then(data => {
                // Assuming backend response: { success: true, operators: [{id: 1, name: 'Amit'}, ...] }
                if (data.success) {
                    setOperators(data.operators);
                } else {
                    setOperators([]);
                }
            })
            .catch((err) => {
                console.error("Fetch Error:", err);
                setOperators([]);
            })
            .finally(() => setOperatorsLoading(false));

        // 3. Machines fetch filtered by plant
        setMachinesLoading(true);
        fetch(`${BASE_URL}/api/machines/list/?plant=${plantKey}`)
            .then(r => r.json())
            .then(data => {
                if (data.success) setMachineList(data.machines);
                else setMachineList([]);
            })
            .catch(() => setMachineList([]))
            .finally(() => setMachinesLoading(false));

    }, [plant]);

    const formReady = operatorName.trim() !== '' && plant !== '' && machineNo.trim() !== '' && shift !== '';

    const getCheck = (sNo, spi) => checks.find(c => c.sNo === sNo && c.spi === spi);
    const updateCheck = (sNo, spi, patch) =>
        setChecks(prev => prev.map(c => c.sNo === sNo && c.spi === spi ? { ...c, ...patch } : c));
    const setStatus = (sNo, spi, status) =>
        updateCheck(sNo, spi, { status: getCheck(sNo, spi)?.status === status ? '' : status });

    const allDone = checks.every(c => c.status !== '');

    const handleSubmit = async () => {
        if (!formReady) {
             alert('⚠️ Please fill in all required details (Operator, Plant, Machine, Shift) before proceeding.');
            return;
        }
        if (!allDone) {
            alert('⚠️ Please complete all checkpoints before saving.');
            return;
        }

        // Convert DD/MM/YYYY to YYYY-MM-DD for Django
        const dateParts = today.split('/');
        const backendDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

        const payload = {
            plant: plant,
            operator_name: operatorName,
            machine_no: machineNo,
            shift: shift,
            date: backendDate,
            checkpoints: checkData.flatMap(item =>
                item.subPoints.map((sp, spi) => {
                    const chk = getCheck(item.sNo, spi);
                    return {
                        sNo: item.sNo,
                        checkPoint: item.checkPoint,
                        specification: sp.specification,
                        checkingMethod: sp.checkingMethod,
                        observedValue: chk?.value || null,
                        unit: chk?.unit || null,
                        status: chk?.status === 'OK' ? 'OK' : 'Not OK',
                    };
                })
            ),
        };
        
        console.log('Sending Payload to Database:', payload);

        try {
            const response = await fetch(`${BASE_URL}/api/checksheets/daily-power-press/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success || response.ok) {
                // Reset after success logic
                setPlant('');
                setOperatorName('');
                setMachineNo('');
                setShift('');
                setChecks(buildChecks());
                alert('✅ Badhai ho! Daily Power Press Checksheet database me successfully save ho gayi!');
            } else {
                console.error("Backend Error:", data);
                alert(`⚠️ Data save nahi ho paya! Error: ${data.error || 'Check console'}`);
            }
        } catch (error) {
            console.error('Network Error:', error);
            alert('⚠️ Server se connect nahi ho paya! Apni backend IP aur connection check karo.');
        }
    };

    return (
        <div className="pp-wrapper">
            {/* CSS & External Links remain same as your original */}
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

            <style>{`
                * { box-sizing: border-box; }
                .pp-wrapper {
                    position: absolute !important; top: 0; left: 0; width: 100%; min-height: 100vh;
                    background: #f8fafc; z-index: 9999;
                    font-family: 'Inter', sans-serif; overflow-x: hidden;
                }
                .pp-navbar {
                    position: fixed !important; top: 0; left: 0; width: 100%; height: 66px;
                    background: #fff; border-bottom: 1px solid #e2e8f0; z-index: 10000;
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 0 1.5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                }
                .pp-brand {
                    font-weight: 900; color: #0f172a; font-size: 1.1rem;
                    display: flex; align-items: center; gap: 8px; cursor: pointer; letter-spacing: 0.5px;
                }
                .pp-brand .back-arrow { color: #94a3b8; font-size: 1.1rem; }
                .pp-brand-icon {
                    width: 34px; height: 34px; background: #fff3e0; border-radius: 9px;
                    display: flex; align-items: center; justify-content: center; font-size: 1.1rem; flex-shrink: 0;
                }
                .nav-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
                .doc-badge {
                    background: #f1f5f9; border: 1px solid #cbd5e1; color: #475569;
                    border-radius: 20px; padding: 4px 10px; font-size: 0.72rem; font-weight: 800; white-space: nowrap;
                }
                .rev-badge {
                    background: #d1fae5; border: 1.5px solid #10b981; color: #065f46;
                    border-radius: 20px; padding: 4px 10px; font-size: 0.72rem; font-weight: 800; white-space: nowrap;
                }
                .pp-main { padding: 86px 16px 60px; max-width: 1280px; margin: 0 auto; }
                .pp-card {
                    background: #fff; border: 1px solid #e2e8f0; border-radius: 16px;
                    padding: 1.5rem; margin-bottom: 1.5rem;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                }
                .pp-card-header {
                    font-weight: 900; color: #1e293b; font-size: 1.05rem;
                    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
                    border-bottom: 2px solid #f1f5f9; padding-bottom: 1rem; margin-bottom: 1.25rem;
                }
                .pp-card-header .icon-box {
                    width: 36px; height: 36px; background: #f1f5f9; border-radius: 9px;
                    display: flex; align-items: center; justify-content: center; color: #0f172a; font-size: 1.1rem; flex-shrink: 0;
                }
                .header-meta { font-size: 0.8rem; color: #64748b; font-weight: 700; margin-left: auto; display: flex; gap: 15px; align-items: center; }
                .date-meta { background: #fff3e0; color: #df8008; padding: 4px 12px; border-radius: 8px; border: 1px solid #ffe8cc; }
                .field-label {
                    font-size: 0.75rem; font-weight: 800; color: #64748b;
                    text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: block;
                }
                .field-label .required-star { color: #ef4444; margin-left: 2px; }
                .field-input {
                    background: #f8fafc; border: 1px solid #cbd5e1; color: #0f172a;
                    border-radius: 10px; padding: 0.7rem 1rem; font-size: 0.95rem; font-weight: 700; width: 100%;
                    height: 46px; transition: 0.2s; outline: none; font-family: 'Inter', sans-serif;
                }
                .field-input:focus { border-color: #df8008; box-shadow: 0 0 0 3px rgba(223,128,8,0.15); background: #fff; }
                .field-input:disabled { opacity: 0.5; cursor: not-allowed; background: #f1f5f9; }
                .table-section { animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-18px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .table-wrapper { border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
                .pp-table { width: 100%; border-collapse: collapse; }
                .pp-table thead tr { background: #f1f5f9; }
                .pp-table th {
                    color: #475569; font-size: 0.75rem; font-weight: 800;
                    text-transform: uppercase; letter-spacing: 0.5px;
                    padding: 1rem; border-bottom: 2px solid #e2e8f0; text-align: center;
                }
                .pp-table td {
                    padding: 0.85rem 1rem; vertical-align: middle;
                    border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; color: #081a43; font-weight: 600;
                }
                .sno-cell { text-align: center; font-weight: 900; color: #0f172a; font-size: 1.1rem; }
                .method-badge {
                    display: inline-flex; align-items: center; justify-content: center;
                    background: #f1f5f9; border: 1px solid #e2e8f0; color: #475569;
                    border-radius: 6px; padding: 4px 10px; font-size: 0.75rem; font-weight: 700;
                }
                .obs-input { border: 1px solid #cbd5e1; border-radius: 8px; padding: 4px 8px; width: 85px; text-align: center; font-weight: 700; }
                .unit-select { border: 1px solid #cbd5e1; border-radius: 8px; padding: 4px; background: #f1f5f9; font-weight: 700; }
                .check-btn {
                    width: 38px; height: 38px; border-radius: 50%; border: 2px solid; background: #fff;
                    display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s;
                }
                .ok-idle, .ng-idle { border-color: #e2e8f0; color: #cbd5e1; }
                .ok-active { border-color: #10b981; background: #10b981; color: #fff; }
                .ng-active { border-color: #ef4444; background: #ef4444; color: #fff; }
                .btn-submit {
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    color: #fff; border: none; border-radius: 12px; font-weight: 800;
                    padding: 0.9rem 2rem; width: 100%; font-size: 1.05rem; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; gap: 8px;
                }
                @media (max-width: 992px) {
                    .desktop-table { display: none; }
                }
            `}</style>

            <nav className="pp-navbar">
                <div className="pp-brand" onClick={() => navigate('/Maintenance/Machine/daily')}>
                    <i className="bi bi-arrow-left-circle back-arrow"></i>
                    <div className="pp-brand-icon">🖨️</div>
                    <span style={{ color: '#df8008' }}>Daily Power Press Checksheet</span>
                </div>
                <div className="nav-right">
                    <span className="doc-badge">AOT-F-MM-02</span>
                    <span className="rev-badge">Rev: 03</span>
                </div>
            </nav>

            <div className="pp-main">
                <div className="pp-card">
                    <div className="pp-card-header">
                        <div className="icon-box"><i className="bi bi-clipboard2-pulse"></i></div>
                        Checksheet Information
                        <div className="header-meta">
                            <span className="date-meta"><i className="bi bi-calendar3 me-2"></i>{today}</span>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-12 col-md-6 col-lg-3">
                            <label className="field-label">Plant <span className="required-star">*</span></label>
                            <select
                                className="field-input"
                                value={plant}
                                onChange={e => setPlant(e.target.value)}
                            >
                                <option value="">-- Select Plant --</option>
                                {Object.keys(PLANT_MAP).map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12 col-md-6 col-lg-3">
                            <label className="field-label">Operator Name <span className="required-star">*</span></label>
                            <select
                                className="field-input"
                                value={operatorName}
                                onChange={e => setOperatorName(e.target.value)}
                                disabled={!plant || operatorsLoading}
                            >
                                <option value="">
                                    {operatorsLoading
                                        ? 'Loading Operators...'
                                        : !plant
                                            ? '-- Select Plant First --'
                                            : '-- Select Operator --'}
                                </option>
                                {operators.map(op => (
                                    // Use op.id as key and op.name as value (ensure backend returns these fields)
                                    <option key={op.id} value={op.name}>{op.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12 col-md-6 col-lg-3">
                            <label className="field-label">Machine No. <span className="required-star">*</span></label>
                            <select
                                className="field-input"
                                value={machineNo}
                                onChange={e => setMachineNo(e.target.value)}
                                disabled={!plant || machinesLoading}
                            >
                                <option value="">
                                    {machinesLoading
                                        ? 'Loading Machines...'
                                        : !plant
                                            ? '-- Select Plant First --'
                                            : '-- Select Machine --'}
                                </option>
                                {machineList.map(m => (
                                    <option key={m} value={m}>Machine {m}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12 col-md-6 col-lg-3">
                            <label className="field-label">Shift <span className="required-star">*</span></label>
                            <select
                                className="field-input"
                                value={shift}
                                onChange={e => setShift(e.target.value)}
                            >
                                <option value="">-- Select Shift --</option>
                                <option value="A">Morning (08:30AM – 08:00PM)</option>
                                <option value="B">Night (08:30PM – 08:00AM)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {formReady && (
                    <div className="table-section">
                        <div className="pp-card desktop-table" style={{ padding: '0' }}>
                            <div className="table-wrapper">
                                <table className="pp-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '6%' }}>S.No.</th>
                                            <th style={{ width: '16%' }}>Check Point</th>
                                            <th style={{ width: '28%' }}>Specification</th>
                                            <th style={{ width: '16%' }}>Method</th>
                                            <th style={{ width: '18%' }}>Observed Value</th>
                                            <th style={{ width: '16%' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {checkData.map(item =>
                                            item.subPoints.map((sp, spi) => (
                                                <tr key={`${item.sNo}-${spi}`}>
                                                    {spi === 0 && (
                                                        <td rowSpan={item.subPoints.length} className="sno-cell">
                                                            {item.sNo}
                                                        </td>
                                                    )}
                                                    {spi === 0 && (
                                                        <td rowSpan={item.subPoints.length}>
                                                            {item.checkPoint}
                                                        </td>
                                                    )}
                                                    <td>{sp.specification}</td>
                                                    <td className="text-center">
                                                        <span className="method-badge">{sp.checkingMethod}</span>
                                                    </td>
                                                    <td className="text-center">
                                                        <ObsCell
                                                            sNo={item.sNo}
                                                            spi={spi}
                                                            hasInput={sp.hasInput}
                                                            checks={checks}
                                                            updateCheck={updateCheck}
                                                        />
                                                    </td>
                                                    <td>
                                                        <CheckBtns
                                                            sNo={item.sNo}
                                                            spi={spi}
                                                            checks={checks}
                                                            setStatus={setStatus}
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="pp-card mt-4">
                            <div className="row g-3 align-items-center">
                                <div className="col-12 col-md-8">
                                    <span className="text-muted fw-bold">
                                        <i className="bi bi-info-circle me-2"></i>
                                        Double check all values before submitting.
                                    </span>
                                </div>
                                <div className="col-12 col-md-4">
                                    <button className="btn-submit" onClick={handleSubmit}>
                                        <i className="bi bi-cloud-arrow-up"></i> Save Checksheet
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyPowerPressChecksheet;