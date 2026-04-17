import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerSurvey = () => {
    const navigate = useNavigate();
    
    // 🔥 Magic Key: Jab ye change hogi, pura form reset ho jayega
    const [formKey, setFormKey] = useState(Date.now());

    const initialFormState = {
        customerName: '',
        representative: '',
        designation: '',
        ratings: {
            q1: '', q2: '', q3: '', q4: '', q5: '',
            q6: '', q7: '', q8: '', q9: '', q10: '',
            q11: '', q12: '', q13: '', q14: ''
        }
    };

    const [formData, setFormData] = useState(initialFormState);

    const questions = [
        { id: 'q1', text: '1. Are you satisfied with quality of our products?', options: ['Highly Satisfied', 'Satisfied', 'Partially Satisfied', 'Dissatisfied', 'Highly Dissatisfied'] },
        { id: 'q2', text: '2. Do you receive delivery on time (without premium freight & line stoppage)?', options: ['Every Time', 'Most Times', 'Some Times', 'Seldom', 'Never'] },
        { id: 'q3', text: '3. Are you satisfied with the packing of products?', options: ['Highly Satisfied', 'Satisfied', 'Partially Satisfied', 'Dissatisfied', 'Highly Dissatisfied'] },
        { id: 'q4', text: '4. How often do you find errors in the billing?', options: ['Never', 'Seldom', 'Some Times', 'Most Times', 'Every Times'] },
        { id: 'q5', text: '5. Are you satisfied with reply to your any enquiries?', options: ['Highly Satisfied', 'Satisfied', 'Partially Satisfied', 'Dissatisfied', 'Highly Dissatisfied'] },
        { id: 'q6', text: '6. Satisfaction with the number of representative visits?', options: ['Highly Satisfied', 'Satisfied', 'Partially Satisfied', 'Dissatisfied', 'Highly Dissatisfied'] },
        { id: 'q7', text: '7. Do you find right person at your work place?', options: ['Every Time', 'Most Times', 'Some Times', 'Seldom', 'Never'] },
        { id: 'q8', text: '8. Knowledge & attentiveness of our representative?', options: ['Highly Satisfied', 'Satisfied', 'Partially Satisfied', 'Dissatisfied', 'Highly Dissatisfied'] },
        { id: 'q9', text: '9. Are you satisfied with the post visit response from us?', options: ['Highly Satisfied', 'Satisfied', 'Partially Satisfied', 'Dissatisfied', 'Highly Dissatisfied'] },
        { id: 'q10', text: '10. Satisfaction with your complaints getting resolved?', options: ['Highly Satisfied', 'Satisfied', 'Partially Satisfied', 'Dissatisfied', 'Highly Dissatisfied'] },
        { id: 'q11', text: '11. Do you find our documentation work very cumbersome?', options: ['Never', 'Seldom', 'Some Times', 'Most Times', 'Every Times'] },
        { id: 'q12', text: '12. Response to your enquiry before contract?', options: ['Highly Satisfied', 'Satisfied', 'Partially Satisfied', 'Dissatisfied', 'Highly Dissatisfied'] },
        { id: 'q13', text: '13. Our effort of new product development for your company?', options: ['Highly Satisfied', 'Satisfied', 'Partially Satisfied', 'Dissatisfied', 'Highly Dissatisfied'] },
        { id: 'q14', text: '14. Do you find our reception treatment cordial?', options: ['Every Time', 'Most Times', 'Some Times', 'Seldom', 'Never'] }
    ];

    const handleRatingChange = (qId, value) => {
        setFormData(prev => ({
            ...prev,
            ratings: { ...prev.ratings, [qId]: value }
        }));
    };

    // 🔥 This function forces React to re-mount the component
    const handleForceReset = () => {
        setFormData(initialFormState);
        setFormKey(Date.now()); // Re-render triggers full UI cleanup
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted Data:", formData);
        
        // Pop-up Alert
        alert('✅ Form Submitted Successfully!');
        
        // Force reset everything
        handleForceReset();
    };

    return (
        <div className="min-h-screen bg-[#fdf2f8] text-slate-700 font-sans pb-32 md:pb-12">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#db2777] to-[#ec4899] pt-10 pb-32 px-6 shadow-lg">
                <div className="max-w-[1200px] mx-auto flex items-center gap-4 text-white">
                    <button type="button" onClick={() => navigate('/qa-hub/yearly')} className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-2xl transition-all border border-white/10 backdrop-blur-md">
                        <i className="bi bi-chevron-left text-xl"></i>
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Satisfaction Survey</h1>
                        <p className="text-pink-100 text-[10px] md:text-xs font-bold tracking-widest uppercase opacity-80">AOT-F-QA-18 | Reset Enabled</p>
                    </div>
                </div>
            </div>

            {/* Main Container - Key is applied here */}
            <div key={formKey} className="max-w-[1200px] mx-auto px-4 md:px-6 -mt-20">
                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* Customer Info Card */}
                    <div className="bg-white rounded-[2rem] shadow-xl p-6 md:p-8 border border-pink-50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: 'Customer Name', key: 'customerName', placeholder: 'Company' },
                                { label: 'Representative', key: 'representative', placeholder: 'Person Name' },
                                { label: 'Designation', key: 'designation', placeholder: 'Role' }
                            ].map((field) => (
                                <div key={field.key} className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-slate-700 uppercase ml-1">{field.label}</label>
                                    <input required className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-[#ec4899] focus:bg-white outline-none transition-all font-semibold text-slate-800" 
                                    defaultValue={formData[field.key]} 
                                    onChange={(e) => setFormData({...formData, [field.key]: e.target.value})} 
                                    placeholder={field.placeholder} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Questions */}
                    <div className="space-y-5">
                        {questions.map((q) => (
                            <div key={q.id} className="bg-white rounded-[1.8rem] shadow-lg p-6 md:p-8 border border-slate-100">
                                <p className="text-slate-800 font-black text-sm md:text-base mb-6 leading-tight">{q.text}</p>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                    {q.options.map((option) => (
                                        <label key={option} className={`cursor-pointer flex items-center justify-center p-4 rounded-2xl border-2 transition-all text-center text-[10px] font-black uppercase tracking-tight leading-none h-14 md:h-12 ${
                                            formData.ratings[q.id] === option 
                                            ? 'bg-[#ec4899] border-[#ec4899] text-white shadow-lg shadow-pink-200' 
                                            : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-pink-200 hover:text-pink-500'
                                        }`}>
                                            <input type="radio" className="hidden" name={q.id} value={option} 
                                            onChange={() => handleRatingChange(q.id, option)} required />
                                            {option}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sticky Action Bar */}
                    <div className="bg-white/90 backdrop-blur-xl fixed md:sticky bottom-0 md:bottom-6 left-0 right-0 md:rounded-3xl border-t md:border border-slate-200 shadow-2xl p-4 z-50">
                        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
                            <button type="button" onClick={() => navigate('/qa-hub/yearly')} className="flex items-center gap-2 px-4 py-2 text-slate-400 font-bold hover:text-red-500 transition-all text-xs uppercase tracking-widest">
                                <i className="bi bi-x-circle text-xl"></i> <span className="hidden sm:inline">Exit</span>
                            </button>
                            
                            <div className="flex items-center gap-3 flex-1 justify-end">
                                <button type="button" onClick={handleForceReset} className="px-6 md:px-10 py-3 bg-slate-100 text-slate-600 rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 border border-slate-200">
                                    Reset
                                </button>
                                <button type="submit" className="flex-1 md:flex-none px-6 md:px-16 py-4 bg-[#ec4899] text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-[11px] tracking-widest shadow-xl shadow-pink-500/30 hover:bg-[#be185d] active:scale-95 transition-all flex items-center justify-center gap-2">
                                    <i className="bi bi-check-circle-fill text-base"></i> <span>Submit feedback</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="h-20"></div>
        </div>
    );
};

export default CustomerSurvey;