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

    const resetForm = () => {
        setZoneLeader('');
        setChecks(
            fiveSData.flatMap((s, si) =>
                s.points.map((_, pi) => ({ sIdx: si, pIdx: pi, status: '' }))
            )
        );
    };

    const handleSubmit = () => {
        if (!zoneLeader) {
            alert('⚠️ Please fill Zone Leader.');
            return;
        }
        if (!allDone) {
            alert('⚠️ Please complete all checks before saving.');
            return;
        }

        // Prepare submission data
        const submissionData = {
            area: "P.Shop & Parking area",
            zoneLeader: zoneLeader,
            date: today,
            language: lang,
            checks: fiveSData.map((s, si) => ({
                s: s.s,
                points: s.points.map((pt, pi) => {
                    const check = getCheck(si, pi);
                    return {
                        point: lang === 'eng' ? pt.eng : lang === 'hin' ? pt.hin : pt.guj,
                        status: check?.status || 'Not Checked'
                    };
                })
            })),
            summary: {
                totalChecks: checks.length,
                completedChecks: checks.filter(c => c.status !== '').length,
                okCount: checks.filter(c => c.status === 'OK').length,
                ngCount: checks.filter(c => c.status === 'NG').length
            },
            submittedAt: new Date().toISOString()
        };

        // Log to console
        console.log('=== 5S Check Sheet Submission ===');
        console.log('Submission Data:', submissionData);
        console.log('Zone Leader:', zoneLeader);
        console.log('Date:', today);
        console.log('Language:', lang);
        console.log('Check Results:', checks.map((c, idx) => ({
            index: idx + 1,
            s: fiveSData[c.sIdx].s,
            point: fiveSData[c.sIdx].points[c.pIdx][lang === 'eng' ? 'eng' : lang === 'hin' ? 'hin' : 'guj'],
            status: c.status || 'Not Checked'
        })));
        console.log('Summary:', submissionData.summary);
        console.log('=== End of Submission ===');

        alert('✅ 5S Checksheet saved successfully!');
        
        // Reset the form after submission
        resetForm();
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Clean Navbar - Original Style */}
            <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        {/* Left Side - Logo and Title */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <button
                                onClick={() => navigate('/production-hub')}
                                className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                </svg>
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 sm:p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </div>
                                <span className="font-black text-slate-800 text-base sm:text-lg md:text-xl tracking-tight">
                                    5S Check Point
                                </span>
                            </div>
                        </div>

                        {/* Right Side - Language and Document Info */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <select
                                value={lang}
                                onChange={e => setLang(e.target.value)}
                                className="bg-amber-50 border-2 border-amber-300 text-amber-700 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-bold outline-none focus:border-amber-500 cursor-pointer"
                            >
                                <option value="eng">🌐 English</option>
                                <option value="hin">🇮🇳 हिंदी</option>
                                <option value="guj">🇮🇳 ગુજરાતી</option>
                            </select>
                            
                            <div className="hidden sm:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg">
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">DOC: AOT-F-PROD-13A</span>
                                <span className="text-slate-400 font-bold text-xs">|</span>
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Rev: 01</span>
                            </div>
                            
                            {/* Mobile version - compact doc info */}
                            <div className="flex sm:hidden items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg">
                                <span className="text-[8px] font-bold text-slate-600 uppercase">AOT-F-PROD-13A</span>
                                <span className="text-slate-400 text-[8px]">|</span>
                                <span className="text-[8px] font-bold text-slate-600 uppercase">Rev 01</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
                {/* Header Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 md:p-6 mb-5 sm:mb-6">
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-sm sm:text-base md:text-lg font-black text-slate-800">
                            {lang === 'eng' ? '5S Check Point (Work Instruction)' : lang === 'hin' ? '5S Check Point (कार्य निर्देशन)' : '5S ચેક પ્વાઇન્ટ (કાર્ય નિર્દેશ)'}
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase mb-1">Area</label>
                            <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 sm:p-3 text-sm font-semibold text-slate-700">
                                P.Shop & Parking area
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase mb-1">Zone Leader</label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 sm:p-3 text-sm font-semibold text-slate-700 outline-none focus:border-amber-500 focus:bg-white transition-all"
                                placeholder={lang === 'eng' ? 'e.g. Mr. Simran' : lang === 'hin' ? 'जैसे श्री सिमरन' : 'દા.ત. શ્રી સિમરન'}
                                value={zoneLeader}
                                onChange={e => setZoneLeader(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase mb-1">Date</label>
                            <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-2.5 sm:p-3 text-sm font-bold text-amber-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {today}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5S Sections */}
                {fiveSData.map((s, si) => {
                    const col = sColors[si];
                    let srNo = 0;
                    for (let i = 0; i < si; i++) srNo += fiveSData[i].points.length;

                    return (
                        <div key={si} className="rounded-xl mb-5 sm:mb-6 overflow-hidden border-2" style={{ borderColor: col.border, backgroundColor: col.bg + '55' }}>
                            <div className="px-3 sm:px-4 py-2.5 sm:py-3" style={{ backgroundColor: col.bg, borderBottom: `2px solid ${col.border}` }}>
                                <span className="inline-block rounded-lg px-3 py-1 text-sm sm:text-base font-black text-white" style={{ backgroundColor: col.badge }}>{s.s}</span>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-100">
                                        <tr>
                                            <th className="px-2 sm:px-3 py-2 text-center text-[10px] sm:text-xs font-black text-slate-600 uppercase w-12">S.No</th>
                                            <th className="px-2 sm:px-3 py-2 text-left text-[10px] sm:text-xs font-black text-slate-600 uppercase">
                                                {lang === 'eng' ? 'Check Point' : lang === 'hin' ? 'जांच बिंदु' : 'ચેક પ્વાઇન્ટ'}
                                            </th>
                                            <th className="px-2 sm:px-3 py-2 text-center text-[10px] sm:text-xs font-black text-slate-600 uppercase w-24 sm:w-32">
                                                {lang === 'eng' ? 'Check' : lang === 'hin' ? 'जांच' : 'તપાસ'}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {s.points.map((pt, pi) => {
                                            const chk = getCheck(si, pi);
                                            return (
                                                <tr key={pi} className="border-b border-slate-200">
                                                    <td className="px-2 sm:px-3 py-2 text-center text-xs sm:text-sm font-bold text-slate-500">{srNo + pi + 1}</td>
                                                    <td className="px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                                                        {lang === 'eng' ? pt.eng : lang === 'hin' ? pt.hin : pt.guj}
                                                    </td>
                                                    <td className="px-2 sm:px-3 py-2">
                                                        <div className="flex items-center justify-center gap-2 sm:gap-3">
                                                            <button
                                                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full font-bold text-base sm:text-lg transition-all flex items-center justify-center border-2 ${chk?.status === 'OK' 
                                                                    ? 'border-green-500 bg-green-100 text-green-700 scale-110 shadow-md' 
                                                                    : 'border-slate-300 bg-white text-slate-400 hover:border-green-400'}`}
                                                                onClick={() => setStatus(si, pi, 'OK')}
                                                            >
                                                                ✓
                                                            </button>
                                                            <button
                                                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full font-bold text-base sm:text-lg transition-all flex items-center justify-center border-2 ${chk?.status === 'NG' 
                                                                    ? 'border-red-500 bg-red-100 text-red-700 scale-110 shadow-md' 
                                                                    : 'border-slate-300 bg-white text-slate-400 hover:border-red-400'}`}
                                                                onClick={() => setStatus(si, pi, 'NG')}
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

                {/* Submit Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 md:p-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">
                                {lang === 'eng'
                                    ? 'Ensure all check points are marked before saving.'
                                    : lang === 'hin'
                                    ? 'सहेजने से पहले सभी जांच बिंदुओं को चिह्नित करें।'
                                    : 'સહેજ કરતા પહેલા તમામ ચેક પ્વાઇન્ટ ચિહ્નિત કરો.'}
                            </span>
                        </div>
                        <button
                            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-xs sm:text-sm uppercase tracking-wide shadow-md hover:shadow-lg transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
                            onClick={handleSubmit}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                            {lang === 'eng' ? 'Save Checksheet' : lang === 'hin' ? 'चेकशीट सहेजें' : 'ચેકશીટ સહેજ કરો'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Operator5S;