import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

const CheckBtns = ({ sNo, spi, btnClass = 'check-btn', checks, setStatus }) => {
    const chk = checks.find(c => c.sNo === sNo && c.spi === spi);
    return (
        <div className="d-flex justify-content-center gap-2">
            <button
                className={`${btnClass} ${chk?.status === 'OK' ? 'ok-active' : 'ok-idle'}`}
                onClick={() => setStatus(sNo, spi, 'OK')}
                title="OK"
            >✓</button>
            <button
                className={`${btnClass} ${chk?.status === 'NG' ? 'ng-active' : 'ng-idle'}`}
                onClick={() => setStatus(sNo, spi, 'NG')}
                title="NG"
            >✗</button>
        </div>
    );
};

const DailyPowerPressChecksheet = () => {
    const navigate = useNavigate();
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const [operatorName, setOperatorName] = useState('');
    const [machineNo, setMachineNo] = useState('');
    const [shift, setShift] = useState('');
    const [checks, setChecks] = useState(buildChecks());

    // ✅ Teeno fill hone par hi table dikhega
    const formReady = operatorName.trim() !== '' && machineNo.trim() !== '' && shift !== '';

    const getCheck = (sNo, spi) => checks.find(c => c.sNo === sNo && c.spi === spi);
    const updateCheck = (sNo, spi, patch) =>
        setChecks(prev => prev.map(c => c.sNo === sNo && c.spi === spi ? { ...c, ...patch } : c));
    const setStatus = (sNo, spi, status) =>
        updateCheck(sNo, spi, { status: getCheck(sNo, spi)?.status === status ? '' : status });

    const allDone = checks.every(c => c.status !== '');

    const handleSubmit = () => {
        if (!formReady) {
            alert('⚠️ Bhai, pehle Operator Name, Machine No. aur Shift toh fill kar de!');
            return;
        }
        if (!allDone) {
            alert('⚠️ Arey bhai, saare check points complete kar pehle save karne se pehle.');
            return;
        }
        const payload = {
            operatorName, machineNo, shift, date: today,
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
        console.log('Backend ko ye payload jayega bhai:', payload);
        setOperatorName('');
        setMachineNo('');
        setShift('');
        setChecks(buildChecks());
        alert('✅ Badhai ho! Daily Power Press Checksheet successfully save ho gayi!');
    };



    return (
        <div className="pp-wrapper">
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
                .header-meta { font-size: 0.8rem; color: #64748b; font-weight: 700; margin-left: auto; display: flex; gap: 15px; }
                .field-label {
                    font-size: 0.75rem; font-weight: 800; color: #64748b;
                    text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: block;
                }
                .field-label .required-star { color: #ef4444; margin-left: 2px; }
                .field-input, .field-value {
                    background: #f8fafc; border: 1px solid #cbd5e1; color: #0f172a;
                    border-radius: 10px; padding: 0.7rem 1rem; font-size: 0.95rem; font-weight: 700; width: 100%;
                    height: 46px; display: flex; align-items: center;
                    transition: 0.2s; outline: none; font-family: 'Inter', sans-serif;
                }

                .field-value { color: #0f172a; background: #f1f5f9; border-color: #cbd5e1; }
                .field-input:focus { border-color: #df8008; box-shadow: 0 0 0 3px rgba(223,128,8,0.15); background: #fff;}
                .field-input::placeholder { color: #94a3b8; font-weight: 500; }



                /* ✅ TABLE SLIDE-DOWN */
                .table-section { animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-18px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                .table-wrapper { border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
                .desktop-table { display: block; }
                .mobile-cards  { display: none; }
                .pp-table { width: 100%; border-collapse: collapse; margin-bottom: 0; }
                .pp-table thead tr { background: #f1f5f9; }
                .pp-table th {
                    color: #475569; font-size: 0.75rem; font-weight: 800;
                    text-transform: uppercase; letter-spacing: 0.5px;
                    padding: 1rem; border-bottom: 2px solid #e2e8f0; white-space: nowrap; vertical-align: middle;
                }
                .pp-table td {
                    padding: 0.85rem 1rem; vertical-align: middle;
                    border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; color: #081a43; font-weight: 600;
                }
                .pp-table tbody tr:hover { background: #f8fafc; }
                .pp-table tbody tr:last-child td { border-bottom: none; }
                .sno-cell { text-align: center; font-weight: 900; color: #0f172a; font-size: 1.1rem; }
                .cp-cell  { font-weight: 800; color: #1e293b; }
                .spec-cell { color: #475569; font-weight: 600; line-height: 1.4; }
                .method-badge {
                    display: inline-flex; align-items: center; justify-content: center;
                    background: #f1f5f9; border: 1px solid #e2e8f0; color: #475569;
                    border-radius: 6px; padding: 4px 10px; font-size: 0.75rem; font-weight: 700; white-space: nowrap;
                }
                .obs-input, .m-obs-input {
                    border: 1px solid #cbd5e1; background: #fff; border-radius: 8px;
                    font-weight: 700; color: #1e293b; outline: none;
                    font-family: 'Inter', sans-serif; text-align: center; height: 36px;
                }
                .obs-input { padding: 4px 8px; font-size: 0.85rem; width: 85px; }
                .unit-select, .m-unit-select {
                    border: 1px solid #cbd5e1; background: #f1f5f9; border-radius: 8px;
                    font-weight: 700; color: #475569; outline: none;
                    font-family: 'Inter', sans-serif; cursor: pointer; height: 36px;
                }
                .unit-select { padding: 4px 6px; font-size: 0.8rem; width: 80px; }
                .obs-input:focus, .unit-select:focus { border-color: #df8008; box-shadow: 0 0 0 2px rgba(223,128,8,0.15); }
                .check-btn, .m-check-btn {
                    border-radius: 50%; font-weight: 900; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer; border: 2px solid; display: flex;
                    align-items: center; justify-content: center; background: #fff; line-height: 1;
                }
                .check-btn { width: 38px; height: 38px; font-size: 1.1rem; }
                .ok-idle, .ng-idle { border-color: #e2e8f0; color: #cbd5e1; }
                .ok-active { border-color: #10b981; background: #10b981; color: #fff; transform: scale(1.1); box-shadow: 0 4px 10px rgba(16,185,129,0.3); }
                .ng-active { border-color: #ef4444; background: #ef4444; color: #fff; transform: scale(1.1); box-shadow: 0 4px 10px rgba(239,68,68,0.3); }
                .check-btn:hover { transform: scale(1.08); }
                .submit-info { color: #64748b; font-size: 0.9rem; font-weight: 600; display: flex; align-items: center; gap: 8px; }
              .btn-submit {
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    color: #fff; border: none; border-radius: 12px; font-weight: 800;
                    padding: 0.9rem 2rem; width: 100%; font-size: 1.05rem; cursor: pointer;
                    transition: 0.25s; box-shadow: 0 6px 16px rgba(217,119,6,0.25);
                    letter-spacing: 0.5px; display: flex; align-items: center; justify-content: center; gap: 8px;
                }
                .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(217,119,6,0.35); }

                @media (max-width: 992px) {
                    .desktop-table { display: none; }
                    .mobile-cards  { display: block; }
                    .m-check-card {
                        background: #fff; border: 1px solid #e2e8f0; border-radius: 14px;
                        padding: 1.25rem; margin-bottom: 1rem;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
                    }
                    .m-check-card-header { display: flex; gap: 12px; margin-bottom: 1rem; border-bottom: 1px dashed #e2e8f0; padding-bottom: 0.8rem; }
                    .m-sno {
                        width: 30px; height: 30px; background: #f1f5f9; border-radius: 50%;
                        display: flex; align-items: center; justify-content: center;
                        font-weight: 900; color: #64748b; font-size: 0.9rem; flex-shrink: 0;
                    }
                    .m-checkpoint { font-weight: 800; color: #1e293b; font-size: 1rem; margin-bottom: 4px; }
                    .m-spec  { color: #64748b; font-size: 0.85rem; font-weight: 500; }
                    .m-row   { display: flex; flex-direction: column; gap: 12px; }
                    .m-row-inner { display: flex; align-items: center; justify-content: space-between; width: 100%; }
                    .m-obs-wrap { display: flex; align-items: center; gap: 6px; }
                    .m-obs-input { width: 100px; padding: 6px 10px; font-size: 0.9rem; }
                    .m-unit-select { width: 85px; padding: 6px; font-size: 0.85rem; }
                    .m-check-btn { width: 44px; height: 44px; font-size: 1.25rem; }

                }
                @media (max-width: 768px) {
                    .pp-navbar { padding: 0 1rem; height: 60px; }
                    .pp-brand-text, .header-meta { display: none; }
                    .pp-main { padding: 76px 12px 60px; }
                    .pp-card { padding: 1.25rem; }
                    .submit-info { font-size: 0.8rem; margin-bottom: 10px; }
                }
            `}</style>

            <nav className="pp-navbar">
                <div className="pp-brand" onClick={() => navigate('/Maintenance/Machine/daily')}>
                    <i className="bi bi-arrow-left-circle back-arrow"></i>
                    <div className="pp-brand-icon">🖨️</div>
                    <span className="pp-brand-text" style={{ color: '#df8008' }}>Daily Power Press Checksheet</span>
                </div>
                <div className="nav-right">
                    <span className="doc-badge">AOT-F-MM-02</span>
                    <span className="rev-badge">Rev: 03</span>
                </div>
            </nav>

            <div className="pp-main">

                {/* ── HEADER FORM CARD ── */}
                <div className="pp-card">
                    <div className="pp-card-header">
                        <div className="icon-box"><i className="bi bi-clipboard2-pulse"></i></div>
                        Daily Power Press Checksheet
                        <span className="header-meta">
                            <span><i className="bi bi-repeat me-1"></i>Daily</span>
                            <span><i className="bi bi-person me-1"></i>Operator</span>
                        </span>
                    </div>

                    <div className="row g-4">
                        <div className="col-12 col-md-6 col-lg-3">
                            <label className="field-label">
                                Operator Name <span className="required-star">*</span>
                            </label>
                            <input
                                className="field-input"
                                placeholder="e.g. Ramesh Kumar"
                                value={operatorName}
                                onChange={e => setOperatorName(e.target.value)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <label className="field-label">
                                Machine No. <span className="required-star">*</span>
                            </label>
                            <input
                                className="field-input"
                                placeholder="e.g. PP-001"
                                value={machineNo}
                                onChange={e => setMachineNo(e.target.value)}
                            />
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <label className="field-label">
                                Shift <span className="required-star">*</span>
                            </label>
                            <select
                                className="field-input"
                                value={shift}
                                onChange={e => setShift(e.target.value)}
                                style={{ cursor: 'pointer' }}
                            >
                                <option value="">-- Select Shift --</option>
                                <option value="A">Morning (08:30AM – 08:00PM)</option>
                                <option value="B">Night  (08:30PM – 08:00AM)</option>
                            </select>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">
                            <label className="field-label">Date</label>
                            <div className="field-value">
                                <i className="bi bi-calendar3 me-2"></i>{today}
                            </div>
                        </div>
                    </div>
                </div>



                {/* ── CHECKSHEET: sirf formReady hone par dikhega ── */}
                {formReady && (
                    <div className="table-section">

                        {/* Desktop Table */}
                        <div className="pp-card desktop-table" style={{ padding: '0' }}>
                            <div className="table-wrapper">
                                <table className="pp-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '6%' }} className="text-center">S.No.</th>
                                            <th style={{ width: '16%' }}>Check Point</th>
                                            <th style={{ width: '28%' }}>Specification</th>
                                            <th style={{ width: '16%' }} className="text-center">Checking Method</th>
                                            <th style={{ width: '18%' }} className="text-center">Observed Value</th>
                                            <th style={{ width: '16%' }} className="text-center">Check (✓ / ✗)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {checkData.map(item =>
                                            item.subPoints.map((sp, spi) => (
                                                <tr key={`${item.sNo}-${spi}`}>
                                                    {spi === 0 && <td rowSpan={item.subPoints.length} className="sno-cell">{item.sNo}</td>}
                                                    {spi === 0 && <td rowSpan={item.subPoints.length} className="cp-cell">{item.checkPoint}</td>}
                                                    <td className="spec-cell">{sp.specification}</td>
                                                    <td className="text-center"><span className="method-badge">{sp.checkingMethod}</span></td>
                                                    <td className="text-center">
                                                        <ObsCell sNo={item.sNo} spi={spi} hasInput={sp.hasInput} checks={checks} updateCheck={updateCheck} />
                                                    </td>
                                                    <td>
                                                        <CheckBtns sNo={item.sNo} spi={spi} checks={checks} setStatus={setStatus} />
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Cards */}
                        <div className="mobile-cards">
                            {checkData.map(item =>
                                item.subPoints.map((sp, spi) => (
                                    <div className="m-check-card" key={`m-${item.sNo}-${spi}`}>
                                        <div className="m-check-card-header">
                                            {spi === 0 ? <div className="m-sno">{item.sNo}</div> : <div style={{ width: 30 }} />}
                                            <div>
                                                {spi === 0 && <div className="m-checkpoint">{item.checkPoint}</div>}
                                                <div className="m-spec">{sp.specification}</div>
                                            </div>
                                        </div>
                                        <div className="m-row">
                                            <div className="m-row-inner">
                                                <span className="method-badge">{sp.checkingMethod}</span>
                                                {sp.hasInput ? (
                                                    <div className="m-obs-wrap">
                                                        <input
                                                            className="m-obs-input"
                                                            type="number"
                                                            step="0.1"
                                                            placeholder="Value"
                                                            value={getCheck(item.sNo, spi)?.value || ''}
                                                            onChange={e => updateCheck(item.sNo, spi, { value: e.target.value })}
                                                        />
                                                        <select
                                                            className="m-unit-select"
                                                            value={getCheck(item.sNo, spi)?.unit || 'bar'}
                                                            onChange={e => updateCheck(item.sNo, spi, { unit: e.target.value })}
                                                        >
                                                            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                                        </select>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 700 }}>No value</span>
                                                )}
                                            </div>
                                            <div className="m-row-inner justify-content-end">
                                                <CheckBtns sNo={item.sNo} spi={spi} btnClass="m-check-btn" checks={checks} setStatus={setStatus} />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Submit */}
                        <div className="pp-card">
                            <div className="row g-3 align-items-center">
                                <div className="col-12 col-md-8">
                                    <div className="submit-info">
                                        <i className="bi bi-info-circle-fill" style={{ color: '#df8008', fontSize: '1.2rem' }}></i>
                                        Ensure all checkpoints are marked OK or Not OK before saving.
                                    </div>
                                </div>
                                <div className="col-12 col-md-4">
                                    <button className="btn-submit" onClick={handleSubmit}>
                                        <i className="bi bi-check2-all"></i> Save Checksheet
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