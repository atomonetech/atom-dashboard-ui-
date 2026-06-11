import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, FileText, UserCheck, Eye, RotateCcw, AlertTriangle } from 'lucide-react';
import axios from 'axios'; // 👈 Axios import kiya API call ke liye

const DeviationApprovalForm = () => {
  const gradientColors = {
    start: '#4158D0',
    middle: '#C850C0',
    end: '#FFCC70'
  };

  const API_SAVE = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/save-deviation/`;
  // 🔥 NAYA CODE: Log API ka URL
  const API_LOG = `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/log-report/`;

  const [formData, setFormData] = useState({
    toolNameNo: '',
    location: '',
    problem: '',
    reasonForDeviation: '',
    date: '',
    duration: '',
    prodIncharge: '',
    qaIncharge: '',
    remarks: ''
  });

  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Set current date
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${dd}.${mm}.${yyyy}`;
    setCurrentDate(formattedDate);
    
    // Set default date in form (for input field)
    setFormData(prev => ({
      ...prev,
      date: `${yyyy}-${mm}-${dd}`
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 👇 Yahan database me save karne ka logic add kiya hai
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Frontend state variables ko Backend database columns se map kar rahe hain
    const dataToSave = {
      tool_name_no: formData.toolNameNo,
      location: formData.location,
      problem: formData.problem,
      reason_for_deviation: formData.reasonForDeviation,
      date: formData.date,
      duration: formData.duration,
      prod_incharge: formData.prodIncharge,
      qa_incharge: formData.qaIncharge,
      remarks: formData.remarks
    };

    try {
      // Backend ko data bhej rahe hain
      const response = await axios.post(API_SAVE, dataToSave);
      
      if (response.status === 201 || response.status === 200) {
        
        // 🔥 NAYA CODE: Report save hone ke baad Activity Log save karna
        const currentUser = localStorage.getItem('username') || 'Unknown User';
        
        try {
          await axios.post(API_LOG, {
            username: currentUser,
            report_name: 'Deviation Approval Form' // Yahan hardcode kar diya form ka naam
          });
          console.log("Activity log successfully saved!");
        } catch (logError) {
          console.error('Activity log save karne mein error aayi:', logError);
        }

        alert('Deviation Approval Form Saved to Database Successfully!');
        resetForm();
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data. Please check backend connection.');
    }
  };

  const resetForm = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    
    setFormData({
      toolNameNo: '',
      location: '',
      problem: '',
      reasonForDeviation: '',
      date: `${yyyy}-${mm}-${dd}`,
      duration: '',
      prodIncharge: '',
      qaIncharge: '',
      remarks: ''
    });
  };

  const handleReset = () => {
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-2 px-3 sm:py-3 sm:px-4 md:py-4 font-sans">
      <div className="w-full max-w-6xl mx-auto">
        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header Section with Back Button Inside */}
          <div 
            className="px-4 py-3 sm:px-5 sm:py-4"
            style={{ 
              background: `linear-gradient(135deg, ${gradientColors.start}, ${gradientColors.middle}, ${gradientColors.end})`
            }}
          >
            {/* Back Button - First */}
            <div className="mb-3 sm:mb-4">
              <a
                href="/qa-hub"
                className="inline-flex items-center gap-1.5 text-white hover:text-white/90 transition-all rounded-lg bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 group"
              >
                <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                <span className="text-xs sm:text-sm font-medium">Back to QA Hub</span>
              </a>
            </div>
            
            {/* Heading and Date */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <AlertTriangle size={24} className="text-white sm:w-6 sm:h-6 md:w-7 md:h-7" />
                <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white">
                  DEVIATION APPROVAL FORM
                </h1>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg">
                <Calendar size={14} className="text-white sm:w-4 sm:h-4 md:w-5 md:h-5" />
                <span className="text-xs sm:text-sm md:text-base font-semibold text-white">{currentDate}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Deviation Details Section */}
            <div className="p-4 sm:p-5 md:p-6">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                <FileText size={18} className="text-[#4158D0]" />
                <h2 className="text-sm sm:text-base font-semibold text-gray-800">
                  Deviation Details
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {/* TOOL NAME/NO. */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase">
                    TOOL NAME/NO. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="toolNameNo"
                    value={formData.toolNameNo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border-2 border-slate-100 bg-slate-50 rounded-lg focus:bg-white focus:border-[#4158D0] outline-none transition-all text-sm text-slate-700"
                    placeholder="Enter tool name/number"
                    required
                  />
                </div>

                {/* LOCATION */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase">
                    LOCATION <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border-2 border-slate-100 bg-slate-50 rounded-lg focus:bg-white focus:border-[#4158D0] outline-none transition-all text-sm text-slate-700"
                    placeholder="Enter location"
                    required
                  />
                </div>

                {/* PROBLEM */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase">
                    PROBLEM <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="problem"
                    value={formData.problem}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border-2 border-slate-100 bg-slate-50 rounded-lg focus:bg-white focus:border-[#4158D0] outline-none transition-all text-sm text-slate-700"
                    placeholder="Describe the problem"
                    required
                  />
                </div>

                {/* REASON FOR DEVIATION */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase">
                    REASON FOR DEVIATION <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="reasonForDeviation"
                    value={formData.reasonForDeviation}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border-2 border-slate-100 bg-slate-50 rounded-lg focus:bg-white focus:border-[#4158D0] outline-none transition-all text-sm text-slate-700 resize-y"
                    placeholder="Enter detailed reason for deviation"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Time & Signatures Section */}
            <div className="p-4 sm:p-5 md:p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                <Clock size={18} className="text-[#4158D0]" />
                <h2 className="text-sm sm:text-base font-semibold text-gray-800">
                  Time & Signatures
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {/* DURATION */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase">
                    DURATION <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-3 py-2 border-2 border-slate-100 bg-slate-50 rounded-lg focus:bg-white focus:border-[#4158D0] outline-none transition-all text-sm text-slate-700"
                      placeholder="e.g., 2 hours, 1 day"
                      required
                    />
                  </div>
                </div>

                {/* PROD. INCHARGE */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase">
                    PROD. INCHARGE
                  </label>
                  <div className="relative">
                    <UserCheck size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="prodIncharge"
                      value={formData.prodIncharge}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-3 py-2 border-2 border-slate-100 bg-slate-50 rounded-lg focus:bg-white focus:border-[#4158D0] outline-none transition-all text-sm text-slate-700"
                      placeholder="Enter name"
                    />
                  </div>
                </div>

                {/* QA INCHARGE */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase">
                    QA INCHARGE
                  </label>
                  <div className="relative">
                    <UserCheck size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="qaIncharge"
                      value={formData.qaIncharge}
                      onChange={handleInputChange}
                      className="w-full pl-9 pr-3 py-2 border-2 border-slate-100 bg-slate-50 rounded-lg focus:bg-white focus:border-[#4158D0] outline-none transition-all text-sm text-slate-700"
                      placeholder="Enter name"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* REMARKS Section */}
            <div className="p-4 sm:p-5 md:p-6 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                <FileText size={18} className="text-[#4158D0]" />
                <h2 className="text-sm sm:text-base font-semibold text-gray-800">
                  REMARKS
                </h2>
              </div>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                rows="2"
                className="w-full px-3 py-2 border-2 border-slate-100 bg-slate-50 rounded-lg focus:bg-white focus:border-[#4158D0] outline-none transition-all text-sm text-slate-700 resize-y"
                placeholder="Under deviation produced parts will be checked 100% visually as well as dimensionally"
              />
            </div>

            {/* Form Actions */}
            <div className="px-4 sm:px-5 md:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 flex flex-col-reverse sm:flex-row gap-3 justify-end items-stretch sm:items-center">
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-slate-200 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all text-xs uppercase font-bold"
                >
                  <RotateCcw size={14} />
                  Clear Form
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-5 py-2 text-white rounded-lg hover:opacity-90 transition-all font-bold uppercase tracking-wide text-xs shadow-md hover:shadow-lg"
                  style={{ 
                    background: `linear-gradient(135deg, ${gradientColors.start}, ${gradientColors.middle}, ${gradientColors.end})`
                  }}
                >
                  <Eye size={14} />
                  Submit for Approval
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        /* Custom scrollbar styles */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: #4158D0;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #C850C0;
        }

        /* Focus styles */
        input:focus, textarea:focus {
          box-shadow: 0 0 0 3px rgba(65, 88, 208, 0.1);
        }

        /* Hover effects */
        input:hover, textarea:hover {
          border-color: #4158D0;
        }
      `}</style>
    </div>
  );
};

export default DeviationApprovalForm;