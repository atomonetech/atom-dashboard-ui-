import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const sopDatabase = {
    1: { 
        titleEng: 'Air Pressure Switch', 
        titleHin: 'एयर प्रेशर स्विच की जांच', 
        methodHin: '१. मशीन वायु दाब स्विच चैक करें!\n२. हैंड वाल्व बंद करें! मशीन चला कर देखें! मशीन चल जाती है?\n३. यदि हाँ, मेंटेनेंस को सूचित करें! सही कराये।\n४. अगर मशीन ना चले तो Poka Yoke सत्यापन पूर्ण हो चूका है।', 
        imgOk: '/image/presseure.jpeg', 
        imgNg: '/image/perrsure 1.jpeg' 
    },
    2: { 
        titleEng: 'Photo Guard Sensor', 
        titleHin: 'फोटो गार्ड सेंसर की जांच', 
        methodHin: '१. फोटो गार्ड सेंसर वेरिफ़ाई करें।\n२. फोटो गार्ड सेंसर के बीच हाथ रखें। मशीन चलाएं, मशीन चलती है?\n३. यदि हाँ, मेंटेनेंस को सूचित करें! सही कराये।\n४. अगर मशीन ना चले तो Poka Yoke सत्यापन पूर्ण हो चूका है।', 
        imgOk: '/image/senser 2.jpeg', 
        imgNg: '/image/senser.1.jpeg' 
    },
    3: { 
        titleEng: 'Grease Sensor', 
        titleHin: 'ग्रीस सेंसर लेवल', 
        methodHin: '१. मशीन ग्रीस सेंसर चेक करें।\n२. नियंत्रक द्वारा tempreture low सेट करें। फिर cycle चलाएं, मशीन चलती है?\n३. यदि हाँ, मेंटेनेंस को सूचित करें! सही कराये।\n४. अगर मशीन ना चले तो Poka Yoke सत्यापन पूर्ण हो चूका है।', 
        imgOk: '/image/grece2.jpeg', 
        imgNg: '/image/grece.jpeg' 
    },
    4: { 
        titleEng: 'Emergency Push Button', 
        titleHin: 'इमरजेंसी पुश बटन', 
        methodHin: '१. आपातकालीन पुश बटन सत्यापित करें।\n२. आपातकालीन पुश बटन दबाएँ। मशीन चला कर देखें! मशीन चल जाती है?\n३. यदि हाँ, मेंटेनेंस को सूचित करें! सही कराये।\n४. अगर मशीन ना चले तो Poka Yoke सत्यापन पूर्ण हो चूका है।', 
        imgOk: '/image/button emg 1.jpeg', 
        imgNg: '/image/button emg.jpeg' 
    },
    5: { 
        titleEng: 'TDC Limit Switch', 
        titleHin: 'TDC लिमिट स्विच', 
        methodHin: '१. TDC लिमिट स्विच ऑफसेट करें, साइकिल चलाएं। क्या मशीन चली?\n२. यदि हाँ, तो मशीन रोकें और Poka Yoke को सही करने के लिए मेंटेनेंस को सूचित करें।\n३. अगर मशीन ना चले तो Poka Yoke सत्यापन पूर्ण हो चूका है।', 
        imgOk: '/image/Tid.jpeg', 
        imgNg: '/image/worng tid.jpeg' 
    }
};

const PokaYokeChecksheet = () => {
    const navigate = useNavigate();

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedPlant, setSelectedPlant] = useState('');
    const [selectedMachine, setSelectedMachine] = useState('');
    const [machineList, setMachineList] = useState([]);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [currentSop, setCurrentSop] = useState(null);

    useEffect(() => {
        if (selectedPlant === 'Plant 1') {
            const p1 = Array.from({ length: 57 }, (_, i) => `PP-${String(i + 1).padStart(2, '0')}`);
            setMachineList(p1);
            setSelectedMachine('');
        } else if (selectedPlant === 'Plant 2') {
            const p2 = Array.from({ length: 49 }, (_, i) => `PP-${String(i + 1).padStart(2, '0')}`);
            setMachineList(p2);
            setSelectedMachine('');
        } else {
            setMachineList([]);
        }
    }, [selectedPlant]);

    const initialChecks = [
        { id: 1, detailEng: 'Air Pressure switch', detailHin: 'एयर प्रेशर स्विच', method: 'BY HAND OPERATED', status: '', remarks: '' },
        { id: 2, detailEng: 'Photo Guard sensor', detailHin: 'फोटो गार्ड सेंसर', method: 'CHECKED BY HAND', status: '', remarks: '' },
        { id: 3, detailEng: 'Grease sensor', detailHin: 'ग्रीस सेंसर', method: 'VISUAL CHECK', status: '', remarks: '' },
        { id: 4, detailEng: 'Emergency Push Button', detailHin: 'इमरजेंसी पुश बटन', method: 'BY HAND OPERATED', status: '', remarks: '' },
        { id: 5, detailEng: 'TDC limit switch', detailHin: 'TDC लिमिट स्विच', method: 'VISUAL CHECK', status: '', remarks: '' },
    ];

    const [checklist, setChecklist] = useState(initialChecks);
    const [signatures, setSignatures] = useState({ checkedBy: '', verifiedBy: '' });

    const handleStatusChange = (id, newStatus) => {
        setChecklist(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    };

    const handleRemarkChange = (id, text) => {
        setChecklist(prev => prev.map(item => item.id === id ? { ...item, remarks: text } : item));
    };

    const openSopModal = (id) => {
        setCurrentSop(sopDatabase[id]);
        setShowInfoModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedPlant || !selectedMachine) {
            alert("⚠️ Please select both Plant and Machine No.");
            return;
        }
        
        const isAllChecked = checklist.every(item => item.status !== '');
        if (!isAllChecked) {
            alert("⚠️ Please complete all OK/NG checks before saving.");
            return;
        }

        console.log("Saving Poka Yoke Record:", { selectedDate, selectedPlant, selectedMachine, checklist, signatures });
        alert("✅ Daily Poka Yoke Checksheet successfully saved!");
        navigate('/qa-hub'); 
    };

    return (
        <div className="min-h-screen bg-slate-50 font-['Inter',system-ui]">
            {/* Bootstrap Icons CDN */}
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            
            {/* Modal */}
            {showInfoModal && currentSop && (
                <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[100050] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl">
                            <div className="flex justify-between items-center">
                                <h4 className="text-xl font-bold text-gray-900">
                                    {currentSop.titleEng} 
                                    <span className="text-emerald-600 text-base ml-2">({currentSop.titleHin})</span>
                                </h4>
                                <button onClick={() => setShowInfoModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                                    <i className="bi bi-x-lg text-xl"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            <div className="mb-6 p-4 bg-slate-50 rounded-xl border-l-4 border-emerald-500">
                                <div className="font-bold text-emerald-600 mb-2 text-sm">
                                    <i className="bi bi-info-circle-fill mr-2"></i>निर्देश (Instructions):
                                </div>
                                <div className="text-gray-800 whitespace-pre-line leading-relaxed">
                                    {currentSop.methodHin}
                                </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="border-2 border-emerald-500 rounded-xl p-4 bg-emerald-50">
                                    <h5 className="text-emerald-700 font-bold text-center mb-3">
                                        <i className="bi bi-check-circle-fill mr-2"></i> सही स्थिति (OK Condition)
                                    </h5>
                                    <div className="bg-white rounded-lg h-48 flex items-center justify-center overflow-hidden">
                                        <img 
                                            src={currentSop.imgOk} 
                                            alt="OK Condition" 
                                            className="max-w-full max-h-full object-contain"
                                            onError={(e) => e.target.src='https://placehold.co/400x250/d1fae5/059669?text=Image+Not+Found'}
                                        />
                                    </div>
                                </div>
                                <div className="border-2 border-red-500 rounded-xl p-4 bg-red-50">
                                    <h5 className="text-red-600 font-bold text-center mb-3">
                                        <i className="bi bi-x-circle-fill mr-2"></i> गलत स्थिति (NG Condition)
                                    </h5>
                                    <div className="bg-white rounded-lg h-48 flex items-center justify-center overflow-hidden">
                                        <img 
                                            src={currentSop.imgNg} 
                                            alt="NG Condition" 
                                            className="max-w-full max-h-full object-contain"
                                            onError={(e) => e.target.src='https://placehold.co/400x250/fee2e2/e11d48?text=Image+Not+Found'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-2xl">
                            <button onClick={() => setShowInfoModal(false)} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition">
                                Close (बंद करें)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Navbar - Optimized with no overflow */}
            <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-[10000] shadow-sm">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14 sm:h-16">
                        {/* Logo Section */}
                        <div 
                            onClick={() => navigate('/qa-hub')} 
                            className="flex items-center gap-2 cursor-pointer group min-w-0 flex-1"
                        >
                            <i className="bi bi-arrow-left-circle text-gray-500 group-hover:text-gray-700 transition text-lg sm:text-xl flex-shrink-0"></i>
                            <i className="bi bi-shield-check text-emerald-600 text-base sm:text-lg flex-shrink-0"></i>
                            <span className="font-extrabold text-emerald-600 text-sm sm:text-base truncate">
                                Poka Yoke Monitoring
                            </span>
                        </div>
                        
                        {/* Right Section */}
                        {/* <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 ml-2">
                            <span className="font-semibold text-gray-600 text-xs sm:text-sm hidden xs:inline">
                                Doc No: AOT-F-QC-07A
                            </span>
                           
                        </div> */}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-20 sm:pt-24 pb-8 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
                
                {/* Plant & Machine Selection */}
                <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-gray-100">
                        <i className="bi bi-sliders text-emerald-600 text-lg"></i>
                        <h2 className="font-bold text-gray-900 text-base sm:text-lg">Plant & Machine Selection</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Date (तारीख)</label>
                            <input 
                                type="date" 
                                className="w-full bg-slate-50 border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition text-slate-700"
                                value={selectedDate} 
                                onChange={(e) => setSelectedDate(e.target.value)} 
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Select Plant (प्लांट चुनें)</label>
                            <select 
                                className="w-full bg-slate-50 border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition text-slate-700"
                                value={selectedPlant} 
                                onChange={(e) => setSelectedPlant(e.target.value)}
                            >
                                <option value="">Choose Plant...</option>
                                <option value="Plant 1">Plant 1 (57 Machines)</option>
                                <option value="Plant 2">Plant 2 (49 Machines)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">M/C No. (मशीन नंबर)</label>
                            <select 
                                className="w-full bg-slate-50 border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition disabled:opacity-50 text-slate-700"
                                value={selectedMachine} 
                                onChange={(e) => setSelectedMachine(e.target.value)} 
                                disabled={!selectedPlant}
                            >
                                <option value="">Select Machine...</option>
                                {machineList.map((mc, i) => (
                                    <option key={i} value={mc}>{mc}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Checklist Table */}
                {selectedMachine && (
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm mb-6">
                        <div className="p-4 sm:p-6 pb-0">
                            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-gray-100">
                                <i className="bi bi-ui-checks-grid text-emerald-600 text-lg"></i>
                                <h2 className="font-bold text-gray-900 text-base sm:text-lg">Daily Check Parameters (पैरामीटर)</h2>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px]">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-3 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">S.No.</th>
                                        <th className="px-3 sm:px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Poka Yoke Detail</th>
                                        <th className="px-3 sm:px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Checking Method</th>
                                        <th className="px-3 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Reference / SOP</th>
                                        <th className="px-3 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">OK / NG</th>
                                        <th className="px-3 sm:px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {checklist.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition">
                                            <td className="px-3 sm:px-4 py-3 text-center text-sm font-semibold text-gray-500">{item.id}</td>
                                            <td className="px-3 sm:px-4 py-3">
                                                <div className="font-bold text-gray-900 text-sm">{item.detailEng}</div>
                                                <div className="text-xs text-gray-500 mt-0.5">{item.detailHin}</div>
                                            </td>
                                            <td className="px-3 sm:px-4 py-3">
                                                <span className="inline-block bg-gray-100 text-gray-700 border border-gray-200 rounded-lg px-2 py-1 text-xs font-medium">
                                                    {item.method}
                                                </span>
                                            </td>
                                            <td className="px-3 sm:px-4 py-3 text-center">
                                                <button 
                                                    className="bg-sky-100 text-sky-700 hover:bg-sky-200 rounded-lg px-3 py-1.5 text-xs font-bold transition"
                                                    onClick={() => openSopModal(item.id)}
                                                >
                                                    <i className="bi bi-journal-text mr-1"></i> SOP View
                                                </button>
                                            </td>
                                            <td className="px-3 sm:px-4 py-3">
                                                <div className="flex justify-center gap-2">
                                                    <button 
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                                                            item.status === 'OK' 
                                                                ? 'bg-emerald-100 text-emerald-700 border-emerald-300' 
                                                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                        onClick={() => handleStatusChange(item.id, 'OK')}
                                                    >
                                                        <i className="bi bi-check-circle-fill mr-1"></i> OK
                                                    </button>
                                                    <button 
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                                                            item.status === 'NG' 
                                                                ? 'bg-red-100 text-red-600 border-red-300' 
                                                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                        onClick={() => handleStatusChange(item.id, 'NG')}
                                                    >
                                                        <i className="bi bi-x-circle-fill mr-1"></i> NG
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-3 sm:px-4 py-3">
                                                <input 
                                                    type="text" 
                                                    className="w-full bg-slate-50 border border-gray-300 rounded-lg px-2 py-1.5 text-xs  text-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none transition"
                                                    placeholder="Add remark..." 
                                                    value={item.remarks} 
                                                    onChange={(e) => handleRemarkChange(item.id, e.target.value)} 
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Signatures & Submit */}
                {selectedMachine && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">Checked By (Maintenance Person)</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-50 border border-gray-300 rounded-lg px-3 py-2 text-sm   text-slate-700 font-medium focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                                    placeholder="Name / Sign" 
                                    value={signatures.checkedBy} 
                                    onChange={(e) => setSignatures({...signatures, checkedBy: e.target.value})} 
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block ">Verified By (Production Engineer)</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-slate-50 border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
                                    placeholder="Name / Sign" 
                                    value={signatures.verifiedBy} 
                                    onChange={(e) => setSignatures({...signatures, verifiedBy: e.target.value})} 
                                />
                            </div>
                            <div className="sm:text-right">
                                <button 
                                    className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl transition shadow-md hover:shadow-lg"
                                    onClick={handleSubmit}
                                >
                                    <i className="bi bi-cloud-arrow-up-fill mr-2"></i> Save Checksheet
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default PokaYokeChecksheet;