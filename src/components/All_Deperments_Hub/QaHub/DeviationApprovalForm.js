import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, FileText, UserCheck, Eye, RotateCcw, AlertTriangle } from 'lucide-react';

const DeviationApprovalForm = () => {
  const gradientColors = {
    start: '#4158D0',
    middle: '#C850C0',
    end: '#FFCC70'
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    // Reset form after submission
    resetForm();
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-4 md:p-6">
      {/* Back button above the form */}
      <div className="max-w-5xl mx-auto mb-2">
        <a
          href="/qa-hub"
          className="inline-flex items-center gap-1 text-gray-600 hover:text-[#4158D0] transition-colors rounded-lg hover:bg-purple-50 px-3 py-2"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back to QAHub</span>
        </a>
      </div>

      {/* Header with Gradient Background - Increased height */}
      <div className="max-w-5xl mx-auto">
        <div 
          className="rounded-t-xl shadow-lg"
          style={{ 
            background: `linear-gradient(135deg, ${gradientColors.start}, ${gradientColors.middle}, ${gradientColors.end})`
          }}
        >
          <div className="px-6 py-6 md:py-8">
            {/* Desktop view: heading and date in same line */}
            <div className="hidden sm:flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle size={32} className="text-white" />
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  DEVIATION APPROVAL FORM
                </h1>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Calendar size={20} className="text-white" />
                <span className="text-lg font-semibold text-white">{currentDate}</span>
              </div>
            </div>

            {/* Mobile view: heading and date stacked */}
            <div className="sm:hidden space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={28} className="text-white" />
                <h1 className="text-xl font-bold text-white">
                  DEVIATION APPROVAL FORM
                </h1>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg w-fit">
                <Calendar size={16} className="text-white" />
                <span className="text-sm font-semibold text-white">{currentDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form - Attached directly to header */}
      <div className="max-w-5xl mx-auto bg-white rounded-b-xl shadow-lg overflow-hidden border-x border-b border-gray-200">
        <form onSubmit={handleSubmit}>
          {/* Deviation Details Section */}
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200">
              <FileText size={20} className="text-[#4158D0]" />
              <h2 className="text-lg font-semibold text-gray-800">
                Deviation Details
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* TOOL NAME/NO. */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  TOOL NAME/NO. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="toolNameNo"
                  value={formData.toolNameNo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4158D0] focus:border-transparent outline-none transition-all text-sm text-slate-700"
                  placeholder="Enter tool name/number"
                  required
                />
              </div>

              {/* LOCATION */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  LOCATION <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4158D0] focus:border-transparent outline-none transition-all text-sm text-slate-700"
                  placeholder="Enter location"
                  required
                />
              </div>

              {/* PROBLEM */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  PROBLEM <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="problem"
                  value={formData.problem}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4158D0] focus:border-transparent outline-none transition-all text-sm text-slate-700"
                  placeholder="Describe the problem"
                  required
                />
              </div>

              {/* REASON FOR DEVIATION */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  REASON FOR DEVIATION <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="reasonForDeviation"
                  value={formData.reasonForDeviation}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4158D0] focus:border-transparent outline-none transition-all text-sm text-slate-700"
                  placeholder="Enter detailed reason for deviation"
                  required
                />
              </div>
            </div>
          </div>

          {/* Time & Signatures Section */}
          <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200">
              <Clock size={20} className="text-[#4158D0]" />
              <h2 className="text-lg font-semibold text-gray-800">
                Time & Signatures
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* DURATION */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  DURATION <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Clock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4158D0] focus:border-transparent outline-none transition-all text-sm text-slate-700"
                    placeholder="e.g., 2 hours, 1 day"
                    required
                  />
                </div>
              </div>

              {/* PROD. INCHARGE */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  PROD. INCHARGE
                </label>
                <div className="relative">
                  <UserCheck size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="prodIncharge"
                    value={formData.prodIncharge}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4158D0] focus:border-transparent outline-none transition-all text-sm text-slate-700"
                    placeholder="Enter name"
                  />
                </div>
              </div>

              {/* QA INCHARGE */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  QA INCHARGE
                </label>
                <div className="relative">
                  <UserCheck size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="qaIncharge"
                    value={formData.qaIncharge}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4158D0] focus:border-transparent outline-none transition-all text-sm text-slate-700"
                    placeholder="Enter name"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* REMARKS Section */}
          <div className="p-6 md:p-8 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-gray-200">
              <FileText size={20} className="text-[#4158D0]" />
              <h2 className="text-lg font-semibold text-gray-800">
                REMARKS
              </h2>
            </div>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4158D0] focus:border-transparent outline-none transition-all text-sm text-slate-700"
              placeholder="Under deviation produced parts will be checked 100% visually as well as dimensionally"
            />
          </div>

          {/* Form Actions */}
          <div className="px-6 md:px-8 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium"
            >
              <RotateCcw size={18} />
              Reset
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-2 text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-md hover:shadow-lg"
              style={{ 
                background: `linear-gradient(135deg, ${gradientColors.start}, ${gradientColors.middle}, ${gradientColors.end})`
              }}
            >
              <Eye size={18} />
              Submit for Approval
            </button>
          </div>
        </form>
      </div>

      {/* Add keyframe animation to document */}
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