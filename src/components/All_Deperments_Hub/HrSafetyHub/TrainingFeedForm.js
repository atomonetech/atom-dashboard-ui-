import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TrainingFeedForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    trainingSubject: "",
    name: "",
    department: "",
    date: "",
    instructionCheck1: false,
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
    q6_topic1: "",
    q6_topic2: "",
    q7_comments: "",
    effectiveness_performance: "",
    effectiveness_retraining: "",
    traineeName: "",
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("--- Training Report Data Saved ---", formData);
    alert("Form submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 md:py-12 px-2 md:px-4 font-sans text-slate-800">
      
      {/* HEADER NAVIGATION BUTTON */}
      <div className="max-w-5xl mx-auto mb-6">
        <button
          onClick={() => navigate("/hiring-departments")}
          className="flex items-center text-xs md:text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 px-4 py-2 rounded-lg shadow-md transition-all active:scale-95 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-4 h-4 md:w-5 md:h-5 mr-2 transition-transform group-hover:-translate-x-1"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Hub
        </button>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border-t-4" 
           style={{ borderColor: "#0b1071" }}>
        
        <form onSubmit={handleSubmit} className="bg-white">
          
          {/* HEADER SECTION - Responsive Grid */}
          <div className="flex flex-col md:grid md:grid-cols-12 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white">
            {/* <div className="hidden md:flex col-span-1 items-center justify-center border-r border-slate-100 font-black text-blue-900 text-xl">
              AO
            </div> */}
            
            <div className="col-span-12 md:col-span-8 p-6 md:p-8 flex flex-col justify-center text-center md:text-left">
              <h1 className="text-xl md:text-2xl font-extrabold text-blue-900 tracking-tight leading-tight uppercase">
                Training Feedback Report
              </h1>
              <p className="text-blue-600/80 font-bold text-[10px] md:text-sm mt-1 uppercase tracking-widest italic">
                Feedback cum Effectiveness
              </p>
            </div>

            <div className="col-span-12 md:col-span-3 text-[10px] md:text-[11px] font-bold text-slate-500 border-t md:border-t-0 md:border-l border-slate-100 bg-white/50 flex flex-col justify-center p-4 space-y-1">
              <div className="flex justify-between"><span>DOC NO:</span> <span className="text-slate-900 font-mono">AOT-F-HR-11</span></div>
              <div className="flex justify-between"><span>REV NO:</span> <span className="text-slate-900">0</span></div>
              <div className="flex justify-between"><span>DATE:</span> <span className="text-slate-900">14.10.2024</span></div>
            </div>
          </div>

          {/* BASIC INFORMATION SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 border-b border-slate-200">
            {[
              { label: "Training Subject", name: "trainingSubject", type: "text" },
              { label: "Trainee Name", name: "name", type: "text" },
              { label: "Department", name: "department", type: "text" },
              { label: "Date", name: "date", type: "date" },
            ].map((field) => (
              <div key={field.name} className="bg-white p-4 md:p-6 flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="sm:w-1/3 text-[10px] font-black text-slate-500 uppercase tracking-wider">{field.label}</label>
                <input 
                  type={field.type}
                  name={field.name} 
                  value={formData[field.name]} 
                  onChange={handleInputChange} 
                  className="sm:w-2/3 outline-none text-slate-900 font-semibold text-sm px-2 py-1 border-b-2 border-slate-100 focus:border-blue-900 transition-all bg-transparent" 
                />
              </div>
            ))}
          </div>

          <div className="p-4 md:p-10">
            {/* INSTRUCTION BOX */}
            <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-600 rounded-r-xl flex items-start gap-3">
              <div className="shrink-0 text-blue-600 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-blue-900 tracking-widest block mb-1">Instructions</span>
                <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
                  Evaluate each item via dropdowns. Fields <span className="font-bold text-blue-700">highlight blue</span> once completed.
                </p>
              </div>
            </div>

            {/* QUESTIONS SECTION */}
            <div className="space-y-4 md:space-y-6 mb-12">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Evaluation Questions</h3>
              {[
                { id: "q1", label: "1. Was the training subject / topic relevant to your work area?", options: ["Relevant", "Partly Relevant", "Irrelevant"] },
                { id: "q2", label: "2. Faculty presentation and delivery effectiveness", options: ["Effective", "Satisfactory", "Not Effective"] },
                { id: "q3", label: "3. Sufficiency of program time duration", options: ["Adequate", "Less", "More"] },
                { id: "q4", label: "4. Quality and distribution of course material", options: ["Sufficient", "Partly Sufficient", "Not Sufficient"] },
                { id: "q5", label: "5. Practical implementability of the subject matter", options: ["Yes", "Partly", "No"] },
              ].map((q) => (
                <div key={q.id} className="pb-4 border-b border-slate-50 flex flex-col md:grid md:grid-cols-12 gap-3 md:items-center">
                  <p className="text-sm font-bold text-slate-700 md:col-span-8 leading-snug">{q.label}</p>
                  <div className="md:col-span-4">
                    <select
                      name={q.id}
                      value={formData[q.id]}
                      onChange={handleInputChange}
                      className={`w-full p-2.5 border rounded-lg text-xs font-bold transition-all outline-none cursor-pointer ${formData[q.id] ? "bg-blue-700 border-blue-700 text-white" : "bg-slate-50 border-slate-200 text-slate-500"}`}
                    >
                      <option value="">Select Response</option>
                      {q.options.map((opt) => (
                        <option key={opt} value={opt.toLowerCase()}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>

            {/* TOPICS & COMMENTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">6. Topics liked/understood:</label>
                <div className="space-y-4">
                  {[1, 2].map(num => (
                    <div key={num} className="flex items-end gap-2">
                      <span className="text-sm font-bold text-slate-400 mb-1">{num}.</span>
                      <input 
                        name={`q6_topic${num}`} 
                        value={formData[`q6_topic${num}`]} 
                        onChange={handleInputChange} 
                        className="w-full border-b border-slate-300 text-sm font-semibold outline-none focus:border-blue-900 bg-transparent py-1" 
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider">7. Comments / Suggestions:</label>
                <textarea 
                  name="q7_comments" 
                  value={formData.q7_comments} 
                  onChange={handleInputChange} 
                  rows="2" 
                  className="w-full p-2 border-b border-slate-300 text-sm font-semibold outline-none focus:border-blue-900 bg-transparent resize-none"
                ></textarea>
              </div>
            </div>

            {/* EFFECTIVENESS SECTION */}
            <div className="rounded-xl border border-slate-300 bg-slate-50/50 overflow-hidden">
              <div className="bg-slate-100 px-4 py-3 text-center border-b border-slate-300">
                <h2 className="text-slate-900 text-[10px] font-black uppercase tracking-widest">
                  Effectiveness (To be filled by Dept. Incharge)
                </h2>
              </div>
              <div className="p-4 md:p-8">
                <div className="mb-8 text-slate-800 text-sm text-center leading-relaxed">
                This is to certify that training for above said training imparted to Mr/Ms
                  <input 
                    name="traineeName" 
                    value={formData.traineeName} 
                    onChange={handleInputChange} 
                    className="mx-2 bg-transparent border-b border-blue-900 outline-none px-2 font-bold text-blue-800 w-full max-w-[200px] text-center" 
                    placeholder="Name" 
                  />
                  is verified & remarks as follows.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-600 uppercase block">A. Ability to perform on job?</label>
                    <select name="effectiveness_performance" value={formData.effectiveness_performance} onChange={handleInputChange} className="w-full p-2 border-b border-slate-400 bg-transparent font-bold text-xs outline-none">
                      <option value="">Select Assessment</option>
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="poor">Poor</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-600 uppercase block">B. Require retraining?</label>
                    <select name="effectiveness_retraining" value={formData.effectiveness_retraining} onChange={handleInputChange} className="w-full p-2 border-b border-slate-400 bg-transparent font-bold text-xs outline-none">
                      <option value="">Select Option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="mt-8 flex justify-center md:justify-end">
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-blue-900 text-white font-bold rounded-lg hover:bg-blue-800 shadow-lg transition-all active:scale-95 uppercase tracking-widest text-[10px]"
              >
                Submit Report
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainingFeedForm;