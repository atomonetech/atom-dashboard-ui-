import React, { useState } from 'react';
import { ArrowLeft, Save, FileText, AlertCircle, CheckCircle } from 'lucide-react';

const WhyWhyAnalysisForm = () => {
  // Get current date and month
  const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const getCurrentMonth = () => {
    const date = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[date.getMonth()];
  };

  const [formData, setFormData] = useState({
    problem: '',
    operationName: '',
    month: getCurrentMonth(),
    problemLocation: '',
    attendedBy: '',
    dateOfOccurrence: getCurrentDate(),
    machineNo: '',
    toolName: '',
    why1: '',
    why2: '',
    why3: '',
    why4: '',
    why5: '',
    correctiveAction: '',
    preventiveAction: '',
    horizontalDeployment: '',
    verification: 'OK'
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.problem || !formData.operationName || !formData.problemLocation || 
        !formData.attendedBy || !formData.machineNo) {
      alert('Please fill in all required fields');
      return;
    }

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // Reset all form fields
    setFormData({
      problem: '',
      operationName: '',
      month: getCurrentMonth(),
      problemLocation: '',
      attendedBy: '',
      dateOfOccurrence: getCurrentDate(),
      machineNo: '',
      toolName: '',
      why1: '',
      why2: '',
      why3: '',
      why4: '',
      why5: '',
      correctiveAction: '',
      preventiveAction: '',
      horizontalDeployment: '',
      verification: 'OK'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <div className="mb-3 sm:mb-4">
          <button 
            onClick={() => window.history.back()} 
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200 text-slate-700 font-medium text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> 
            <span>Back</span>
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Header Section with Red Color #f5405e and White Gradient */}
          <div className="bg-gradient-to-r from-[#f5405e] via-[#f5405e] to-white p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-tight text-white">
                  Why Why Analysis Report
                </h1>
                <p className="text-xs sm:text-sm text-white/90 mt-1">
                  Root Cause Investigation Tool
                </p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mx-4 sm:mx-6 mt-4 sm:mt-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-3 sm:p-4 rounded-lg shadow-md flex items-center gap-2 sm:gap-3">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">Analysis submitted successfully! Form has been reset.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8">
            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5 mb-6 sm:mb-8">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">PROBLEM <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="problem"
                  value={formData.problem}
                  onChange={handleChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f5405e] focus:border-[#f5405e] transition-all outline-none text-slate-700" 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">OPERATION NAME <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="operationName"
                  value={formData.operationName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f5405e] focus:border-[#f5405e] transition-all outline-none text-slate-700" 
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">MONTH</label>
                <input 
                  type="text" 
                  name="month"
                  value={formData.month}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-slate-700 cursor-default"
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">PROBLEM LOCATION <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="problemLocation"
                  value={formData.problemLocation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f5405e] focus:border-[#f5405e] transition-all outline-none text-slate-700" 
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">PROBLEM ATTENDED BY <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="attendedBy"
                  value={formData.attendedBy}
                  onChange={handleChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f5405e] focus:border-[#f5405e] transition-all outline-none text-slate-700" 
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">DATE OF OCCURRENCE</label>
                <input 
                  type="text" 
                  name="dateOfOccurrence"
                  value={formData.dateOfOccurrence}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-slate-700 cursor-default"
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">MACHINE NO. <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="machineNo"
                  value={formData.machineNo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f5405e] focus:border-[#f5405e] transition-all outline-none text-slate-700" 
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">TOOL NAME</label>
                <input 
                  type="text" 
                  name="toolName"
                  value={formData.toolName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f5405e] focus:border-[#f5405e] transition-all outline-none text-slate-700" 
                />
              </div>
            </div>

            {/* Cause and Effect Analysis Section */}
            <div className="mb-6 sm:mb-8">
              <div className="bg-gradient-to-r from-[#f5405e]/10 to-white px-4 py-3 rounded-lg mb-4 border-l-4 border-[#f5405e]">
                <h3 className="text-sm sm:text-base font-bold text-slate-700 uppercase tracking-wide">Cause and Effect Analysis</h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {['Machine', 'Method', 'Man', 'Material'].map((item) => (
                  <div key={item} className="space-y-2">
                    <label className="block text-xs font-bold text-slate-600 uppercase">{item}</label>
                    <textarea 
                      rows="3"
                      placeholder={`Enter ${item.toLowerCase()} related causes...`}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f5405e] focus:border-[#f5405e] transition-all outline-none text-slate-700 resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Why-Why Analysis Section */}
            <div className="mb-6 sm:mb-8">
              <div className="bg-gradient-to-r from-[#f5405e]/10 to-white px-4 py-3 rounded-lg mb-4 border-l-4 border-[#f5405e]">
                <h3 className="text-sm sm:text-base font-bold text-slate-700 uppercase tracking-wide">Why - Why Analysis for Occurrence of Problem</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {[1, 2, 3, 4, 5].map(n => (
                  <div key={n} className="flex flex-col space-y-2">
                    <span className="text-xs font-bold text-[#f5405e] bg-[#f5405e]/10 px-2 py-1 rounded inline-block w-fit">WHY-{n}</span>
                    <textarea 
                      name={`why${n}`}
                      value={formData[`why${n}`]}
                      onChange={handleChange}
                      className="w-full p-2 sm:p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f5405e] focus:border-[#f5405e] transition-all outline-none text-slate-700 h-24 resize-none" 
                      placeholder={`Analysis...`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions Section */}
            <div className="mb-6 sm:mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-600 uppercase">Corrective Action</label>
                    <textarea 
                      name="correctiveAction"
                      value={formData.correctiveAction}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f5405e] focus:border-[#f5405e] transition-all outline-none text-slate-700 resize-none"
                      placeholder="Describe corrective actions taken..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-600 uppercase">Preventive Action</label>
                    <textarea 
                      name="preventiveAction"
                      value={formData.preventiveAction}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f5405e] focus:border-[#f5405e] transition-all outline-none text-slate-700 resize-none"
                      placeholder="Describe preventive actions taken..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-600 uppercase">Horizontal Deployment (If any)</label>
                    <textarea 
                      name="horizontalDeployment"
                      value={formData.horizontalDeployment}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f5405e] focus:border-[#f5405e] transition-all outline-none text-slate-700 resize-none"
                      placeholder="Any horizontal deployment..."
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-600 uppercase">Verification of Corrective Action</label>
                    <div className="flex gap-4 sm:gap-6 bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                      <label className="flex items-center gap-2 text-sm font-medium text-green-700">
                        <input 
                          type="radio" 
                          name="verification" 
                          value="OK"
                          checked={formData.verification === 'OK'}
                          onChange={handleChange}
                          className="w-4 h-4 text-green-600 focus:ring-green-500"
                        /> 
                        OK
                      </label>
                      <label className="flex items-center gap-2 text-sm font-medium text-red-700">
                        <input 
                          type="radio" 
                          name="verification" 
                          value="NG"
                          checked={formData.verification === 'NG'}
                          onChange={handleChange}
                          className="w-4 h-4 text-red-600 focus:ring-red-500"
                        /> 
                        NG
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-600 uppercase">Checked By</label>
                    <input 
                      type="text"
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f5405e] focus:border-[#f5405e] transition-all outline-none text-slate-700"
                      placeholder="Name / Signature"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-600 uppercase">Verified By</label>
                    <input 
                      type="text"
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f5405e] focus:border-[#f5405e] transition-all outline-none text-slate-700"
                      placeholder="Name / Signature"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6 sm:mt-8">
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-[#f5405e] to-[#f5405e]/70 hover:from-[#f5405e] hover:to-[#f5405e]/80 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-base sm:text-lg"
              >
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                Submit Analysis
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WhyWhyAnalysisForm;