import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const fiveSData = [
    {
        s: "1'S'",
        points: [
            { eng: "Identify all necessary and unnecessary items at your workplace.", hin: "अपने कार्य स्थल पर सभी आवश्यक व अनावश्यक वस्तुओं को चिन्हित करें।", guj: "તમારા કાર્યસ્થળ પર રહેલી જરૂરી અને બિનજરૂરી વસ્તુઓની ઓળખ કરો." },
            { eng: "Separate the necessary and unnecessary items kept at your workplace and place them in their designated locations.", hin: "अपने कार्य स्थल पर रखी हुई सभी आवश्यक व अनावश्यक वस्तुओं की छंट कर उन के निर्धारित स्थान पर रखें।", guj: "કાર્યસ્થળ પર રહેલી તમામ જરૂરી અને બિનજરૂરી વસ્તુઓને છાંટી અને નિર્ધારિત જગ્યાએ મૂકો." },
            { eng: "Dispose of used or damaged items such as gloves, clothes, tea cups, polythene, newspapers, etc. in the dustbin.", hin: "प्रयोग हुए या खराब वस्तुओं जैसे दस्ताने, कपड़ा, चाय का कप, पॉलिथीन, अखबार इत्यादि को डस्ट बिन में डालें।", guj: "ઉપયોગમાં લીધેલી અથવા ખરાબ થયેલી વસ્તુઓ જેમ કે દસ્તાના, કપડા, ચાના કપ, પોલીથિન, અખબાર વગેરેને ડસ્ટબિનમાં નાખો." },
            { eng: "If you face any kind of difficulty, contact your supervisor.", hin: "किसी भी प्रकार की अड़चन होने पर अपने सुपरवाइज़र से संपर्क करें।", guj: "કોઈપણ પ્રકારની મુશ્કેલી થાય તો તમારા સુપરવાઈઝર સાથે સંપર્ક કરો." }
        ]
    },
    {
        s: "2'S'",
        points: [
            { eng: "Arrange all items at your workplace systematically in their designated places so they can be easily found when needed.", hin: "अपने कार्य स्थल की सभी वस्तुओं को निर्धारित स्थान पर क्रम से लगा कर रखें ताकि आवश्यकता के समय आसानी से मिलजाएं।", guj: "તમારા કાર્યસ્થળની તમામ વસ્તુઓને નિર્ધારિત જગ્યાએ યોગ્ય ક્રમમાં ગોઠવો જેથી જરૂર પડે ત્યારે સરળતાથી મળી શકે." },
            { eng: "Clean all necessary items kept at your workplace.", hin: "अपने कार्य स्थल पर रखी हुई सभी आवश्यक वस्तुओं की सफाई करें।", guj: "કાર્યસ્થળ પર રહેલી તમામ જરૂરી વસ્તુઓની સફાઈ કરો." },
            { eng: "If you do not know the designated place of any item, contact your supervisor and keep it in the place suggested by them.", hin: "किसी वस्तु का निर्धारित स्थान पता न हो तो अपने सुपर वाइज़र से संपर्क करें और उसे बताये गये स्थान पर रखें।", guj: "જો કોઈ વસ્તુની નિર્ધારિત જગ્યા ખબર ન હોય તો તમારા સુપરવાઈઝર સાથે સંપર્ક કરો અને જણાવેલી જગ્યાએ મૂકો." }
        ]
    },
    {
        s: "3'S'",
        points: [
            { eng: "Clean all necessary items kept at your workplace.", hin: "अपने कार्य स्थल पर रखी सभी आवश्यक वस्तुओं की सफाई करें।", guj: "કાર્યસ્થળ પર રહેલી તમામ જરૂરી વસ્તુઓની સફાઈ કરો." },
            { eng: "Before starting work, clean the machine according to the checklist.", hin: "कार्य शुरू करने से पहले मशीन की सफाई चेक शीट के अनुसार करें।", guj: "કામ શરૂ કરતા પહેલા મશીનની સફાઈ ચેકલિસ્ટ મુજબ કરો." },
            { eng: "Keep the surrounding area clean; damaged gloves, clothes, defective parts, polythene, oil, etc. should not be scattered around.", hin: "अपने कार्य स्थल के आस पास सफाई रखें। खराब दस्ताने, कपड़े, खराब पार्ट, पॉलिथीन और तेल इत्यादि बिखरे न हों।", guj: "તમારા કાર્યસ્થળ આસપાસ સફાઈ રાખો; ખરાબ દસ્તાના, કપડા, ખરાબ પાર્ટ્સ, પોલીથિન, ઓઇલ વગેરે વિખરાયેલા ન રહે." }
        ]
    },
    {
        s: "4'S'",
        points: [
            { eng: "Create standard rules and procedures for performing all tasks.", hin: "सभी कार्यों को करने के लिए नियम निर्धारित नियम बनाएं।", guj: "તમામ કામ કરવા માટે નિયમો અને સ્ટાન્ડર્ડ પ્રોસેસ બનાવો." }
        ]
    },
    {
        s: "5'S'",
        points: [
            { eng: "Perform all tasks according to the established rules and follow them consistently.", hin: "सभी कार्यों को नियम के अनुसार निर्धारित रूप से करें और नियमों का पालन भी करें।", guj: "તમામ કામ બનાવેલા નિયમો મુજબ કરો અને નિયમોનું પાલન સતત કરો." }
        ]
    }
];

const sColors = [
    { bg: '#dcfce7', border: '#10b981', badge: '#10b981' },
    { bg: '#dbeafe', border: '#3b82f6', badge: '#3b82f6' },
    { bg: '#fef9c3', border: '#f59e0b', badge: '#f59e0b' },
    { bg: '#fce7f3', border: '#ec4899', badge: '#ec4899' },
    { bg: '#ede9fe', border: '#8b5cf6', badge: '#8b5cf6' },
];

const Operator5S = () => {
    const navigate = useNavigate();

    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const [lang, setLang] = useState('eng');
    const [area] = useState('P Shop Front Area');
    const [zoneLeader, setZoneLeader] = useState('');
    const [checks, setChecks] = useState(
        fiveSData.flatMap((s, si) =>
            s.points.map((_, pi) => ({ sIdx: si, pIdx: pi, status: '' }))
        )
    );

    const getCheck = (si, pi) => checks.find(c => c.sIdx === si && c.pIdx === pi);

    const setStatus = (si, pi, status) => {
        setChecks(prev => prev.map(c =>
            c.sIdx === si && c.pIdx === pi
                ? { ...c, status: c.status === status ? '' : status }
                : c
        ));
    };

    const allDone = checks.every(c => c.status !== '');

    const handleSubmit = () => {
        if (!area || !zoneLeader) {
            alert('⚠️ Please fill Area and Zone Leader.');
            return;
        }
        if (!allDone) {
            alert('⚠️ Please complete all checks before saving.');
            return;
        }
        alert('✅ 5S Checksheet saved successfully!');
    };

    return (
        <div className="s5-wrapper">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />

            <style>{`
                .s5-wrapper { position: absolute !important; top: 0; left: 0; width: 100%; min-height: 100vh; background: #f8fafc; z-index: 9999; font-family: 'Inter', sans-serif; overflow-x: hidden; }
                .s5-navbar { position: fixed !important; top: 0; left: 0; width: 100%; height: 70px; background: #fff; border-bottom: 1px solid #e2e8f0; z-index: 10000; display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
                .brand-logo { font-weight: 900; color: #f59e0c; font-size: 1.4rem; display: flex; align-items: center; gap: 8px; cursor: pointer; }
                .main-container { padding: 90px 24px 60px 24px; max-width: 1200px; margin: 0 auto; }
                .card-custom { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
                .card-header-custom { font-weight: 800; color: #0f172a; font-size: 1.15rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 10px; border-bottom: 2px solid #f1f5f9; padding-bottom: 1rem; }
                .form-label-custom { font-size: 0.8rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: block; }
                .form-control-light { background: #f8fafc; border: 1px solid #cbd5e1; color: #0f172a; border-radius: 8px; padding: 0.7rem 1rem; font-size: 0.9rem; font-weight: 600; width: 100%; transition: 0.2s; outline: none; }
                .form-control-light:focus { border-color: #f59e0c; box-shadow: 0 0 0 3px rgba(245,158,11,0.2); background: #fff; }
                .s-section { border-radius: 14px; margin-bottom: 1.5rem; overflow: hidden; border: 1.5px solid; }
                .s-header { display: flex; align-items: center; gap: 14px; padding: 0.85rem 1.5rem; }
                .s-badge { border-radius: 8px; padding: 5px 18px; font-size: 1rem; font-weight: 900; color: #fff; letter-spacing: 1px; }
                .s-table { width: 100%; border-collapse: collapse; }
                .s-table th { background: #f1f5f9; color: #475569; font-size: 0.78rem; font-weight: 800; text-transform: uppercase; padding: 0.75rem 1rem; border-bottom: 2px solid #e2e8f0; white-space: nowrap; }
                .s-table td { padding: 0.85rem 1rem; vertical-align: middle; border-bottom: 1px solid #f1f5f9; font-size: 0.93rem; color: #0f172a; font-weight: 600; }
                .check-btn { width: 44px; height: 44px; border-radius: 50%; font-size: 1.3rem; font-weight: 900; transition: all 0.2s; cursor: pointer; border: 2px solid; display: flex; align-items: center; justify-content: center; background: #fff; line-height: 1; }
                .check-btn.ok-idle { border-color: #cbd5e1; color: #cbd5e1; }
                .check-btn.ng-idle { border-color: #cbd5e1; color: #cbd5e1; }
                .check-btn.ok-active { border-color: #10b981; background: #d1fae5; color: #059669; transform: scale(1.12); box-shadow: 0 0 0 3px rgba(16,185,129,0.2); }
                .check-btn.ng-active { border-color: #ef4444; background: #fee2e2; color: #e11d48; transform: scale(1.12); box-shadow: 0 0 0 3px rgba(239,68,68,0.2); }
                .check-btn:hover { transform: scale(1.14); opacity: 0.9; }
                .btn-submit { background: #f5a21e; color: #fff; border: none; border-radius: 8px; font-weight: 800; padding: 0.8rem 2.5rem; transition: 0.3s; box-shadow: 0 4px 6px rgba(245,162,30,0.2); width: 100%; font-size: 1.1rem; cursor: pointer; }
                .btn-submit:hover { background: #d4880f; transform: translateY(-2px); }
                .lang-select { background: #fef3c7; border: 2px solid #f5a62c; color: #f59e0c; border-radius: 20px; padding: 7px 16px; font-size: 0.85rem; font-weight: 700; cursor: pointer; outline: none; appearance: auto; }
                .lang-select:focus { box-shadow: 0 0 0 3px rgba(16,185,129,0.2); }
            `}</style>

            {/* NAVBAR */}
            <nav className="s5-navbar">
                <div className="brand-logo" onClick={() => navigate('/production-hub')}>
                    <i className="bi bi-arrow-left-circle text-muted me-2" style={{ fontSize: '1.2rem', color: '#64748b' }}></i>
                    <i className="bi bi-stars" style={{ color: '#f5a21e' }}></i> 5S Check Point
                </div>
                <div className="d-flex align-items-center gap-3">
                    <select className="lang-select" value={lang} onChange={e => setLang(e.target.value)}>
                        <option value="eng">🌐 English</option>
                        <option value="hin">🇮🇳 हिंदी</option>
                        <option value="guj">🇮🇳 ગુજરાતી</option>
                    </select>
                    <span style={{ fontWeight: 800, color: '#64748b', fontSize: '0.9rem' }}>Doc No: AOT-F-PROD-13A</span>
                    <span className="badge bg-success bg-opacity-25 text-success border border-success rounded-pill px-3 py-2">Rev: 01</span>
                </div>
            </nav>

            <div className="main-container">

                {/* HEADER CARD */}
                <div className="card-custom">
                    <div className="card-header-custom">
                        <i className="bi bi-clipboard2-check" style={{ color: '#f5a21e' }}></i>
                        {lang === 'eng' ? '5S Check Point (Work Instruction)' : lang === 'hin' ? '5S Check Point (कार्य निर्देशन)' : '5S ચેક પ્વાઇન્ટ (કાર્ય નિર્દેશ)'}
                    </div>
                    <div className="row g-4 align-items-end">
                        <div className="col-md-4">
                            <label className="form-label-custom">{lang === 'eng' ? 'Area' : lang === 'hin' ? 'क्षेत्र' : 'વિસ્તાર'}</label>
                            <div className="form-control-light fw-bold" style={{ cursor: 'default' }}>P.Shop & Parking area</div>
                        </div>
                        <div className="col-md-4">
                            <label className="form-label-custom">{lang === 'eng' ? 'Zone Leader' : lang === 'hin' ? 'ज़ोन लीडर' : 'ઝોન લીડર'}</label>
                            <input
                                type="text"
                                className="form-control-light"
                                placeholder={lang === 'eng' ? 'e.g. Mr. Simran' : lang === 'hin' ? 'जैसे श्री सिमरन' : 'દા.ત. શ્રી સિમરન'}
                                value={zoneLeader}
                                onChange={e => setZoneLeader(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label-custom">{lang === 'eng' ? 'Date' : lang === 'hin' ? 'तारीख' : 'તારીખ'}</label>
                            <div className="form-control-light fw-bold" style={{ cursor: 'default', color: '#f5a21e' }}>
                                <i className="bi bi-calendar3 me-2"></i>{today}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5S SECTIONS */}
                {fiveSData.map((s, si) => {
                    const col = sColors[si];
                    let srNo = 0;
                    for (let i = 0; i < si; i++) srNo += fiveSData[i].points.length;

                    return (
                        <div className="s-section" key={si} style={{ borderColor: col.border, backgroundColor: col.bg + '55' }}>
                            <div className="s-header" style={{ backgroundColor: col.bg, borderBottom: `1.5px solid ${col.border}` }}>
                                <span className="s-badge" style={{ backgroundColor: col.badge }}>{s.s}</span>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table className="s-table">
                                    <thead>
                                        <tr>
                                            <th width="5%" className="text-center">S.No.</th>
                                            <th width="80%">{lang === 'eng' ? 'Check Point' : lang === 'hin' ? 'जांच बिंदु' : 'ચેક પ્વાઇન્ટ'}</th>
                                            <th width="15%" className="text-center">{lang === 'eng' ? 'Check (✓ / ✗)' : lang === 'hin' ? 'जांच (✓ / ✗)' : 'તપાસ (✓ / ✗)'}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {s.points.map((pt, pi) => {
                                            const chk = getCheck(si, pi);
                                            return (
                                                <tr key={pi}>
                                                    <td className="text-center text-muted fw-bold">{srNo + pi + 1}</td>
                                                    <td style={{ lineHeight: 1.7 }}>
                                                        {lang === 'eng' ? pt.eng : lang === 'hin' ? pt.hin : pt.guj}
                                                    </td>
                                                    <td>
                                                        <div className="d-flex justify-content-center gap-3">
                                                            <button
                                                                className={`check-btn ${chk?.status === 'OK' ? 'ok-active' : 'ok-idle'}`}
                                                                onClick={() => setStatus(si, pi, 'OK')}
                                                                title="OK"
                                                            >
                                                                ✓
                                                            </button>
                                                            <button
                                                                className={`check-btn ${chk?.status === 'NG' ? 'ng-active' : 'ng-idle'}`}
                                                                onClick={() => setStatus(si, pi, 'NG')}
                                                                title="NG"
                                                            >
                                                                ✗
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                })}

                {/* SUBMIT */}
                <div className="card-custom">
                    <div className="row g-4 align-items-center">
                        <div className="col-md-8">
                            <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
                                <i className="bi bi-info-circle me-2 text-success"></i>
                                {lang === 'eng'
                                    ? 'Ensure all check points are marked before saving.'
                                    : lang === 'hin'
                                    ? 'सहेजने से पहले सभी जांच बिंदुओं को चिह्नित करें।'
                                    : 'સહેજ કરતા પહેલા તમામ ચેક પ્વાઇન્ટ ચિહ્નિત કરો.'}
                            </div>
                        </div>
                        <div className="col-md-4">
                            <button className="btn-submit" onClick={handleSubmit}>
                                <i className="bi bi-cloud-arrow-up-fill me-2"></i>
                                {lang === 'eng' ? 'Save Checksheet' : lang === 'hin' ? 'चेकशीट सहेजें' : 'ચેકશીટ સહેજ કરો'}
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Operator5S;