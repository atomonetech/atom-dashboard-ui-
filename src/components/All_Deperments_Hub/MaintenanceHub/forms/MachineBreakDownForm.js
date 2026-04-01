import React, { useState } from 'react';
import { ArrowLeft, Wrench, Clock, Calendar, User, CheckCircle, XCircle, Save, RotateCcw } from 'lucide-react';

const MachineBreakDownForm = () => {
  const [language, setLanguage] = useState('english');
  const [formData, setFormData] = useState({
    givenDate: '',
    givenTime: '',
    machineNameNo: '',
    breakdownName: '',
    partMadeAfterInspection: '',
    breakdownDesc: '',
    repairDate: '',
    repairTime: '',
    repairHours: '',
    mechanicsCount: '',
    repairDesc: '',
    status: 'OK',
    verificationDate: '',
    verificationTime: ''
  });

  const content = {
    english: {
      title: 'TOOL / MACHINE BREAKDOWN INTIMATION FORM',
      givenOn: 'Given on Date',
      givenAt: 'Given at Time',
      machineName: 'Machine / Engine Name & No.',
      breakdownName: 'Name of the Breakdown',
      partMadeAfterInspection: 'Part made after last inspection',
      breakdownDetails: 'Breakdown Details',
      maintenanceOnly: '(FOR MAINTENANCE DEPTT. USE ONLY)',
      repairDate: 'Repair Date',
      repairTime: 'Repair Time',
      hoursTaken: 'Hours taken for repair',
      mechanicsInvolved: 'No. of mechanics involved',
      repairDescription: 'Repair Description',
      verification: 'VERIFICATION BY QUALITY',
      statusOfProblem: 'STATUS OF PROBLEM',
      ok: 'OK',
      ng: 'NG',
      date: 'Date',
      time: 'Time',
      restButton: 'Reset Form',
      back: 'Back to Maintenance Hub',
      submit: 'Submit Form',
      submitting: 'Submitting...',
      success: 'Form submitted successfully!',
      resetConfirm: 'Are you sure you want to reset all fields?'
    },
    hindi: {
      title: 'टूल / मशीन ब्रेकडाउन सूचना पर्ची',
      givenOn: 'किस तारीख को दिया',
      givenAt: 'किस समय दिया',
      machineName: 'मशीन / इंजन का नाम व नंबर',
      breakdownName: 'ब्रेकडाउन का नाम',
      partMadeAfterInspection: 'अंतिम निरीक्षण के बाद बना भाग',
      breakdownDetails: 'ब्रेकडाउन के बारे में विस्तार से लिखें',
      maintenanceOnly: '(केवल रखरखाव विभाग के लिए)',
      repairDate: 'मरम्मत तिथि',
      repairTime: 'मरम्मत समय',
      hoursTaken: 'मरम्मत में लगा समय (घंटे)',
      mechanicsInvolved: 'कितने मैकेनिक लगे',
      repairDescription: 'मरम्मत का विवरण',
      verification: 'गुणवत्ता विभाग द्वारा जांच',
      statusOfProblem: 'समस्या की स्थिति',
      ok: 'सही',
      ng: 'गलत',
      date: 'तिथि',
      time: 'समय',
      restButton: 'फॉर्म रीसेट करें',
      back: 'मेंटेनेंस हब पर वापस',
      submit: 'फॉर्म जमा करें',
      submitting: 'जमा हो रहा है...',
      success: 'फॉर्म सफलतापूर्वक जमा हो गया!',
      resetConfirm: 'क्या आप सभी फ़ील्ड रीसेट करना चाहते हैं?'
    }
  };

  const initialFormState = {
    givenDate: '',
    givenTime: '',
    machineNameNo: '',
    breakdownName: '',
    partMadeAfterInspection: '',
    breakdownDesc: '',
    repairDate: '',
    repairTime: '',
    repairHours: '',
    mechanicsCount: '',
    repairDesc: '',
    status: 'OK',
    verificationDate: '',
    verificationTime: ''
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  const currentLang = language === 'english' ? content.english : content.hindi;
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setShowResetConfirm(false);
  };

  const handleResetClick = () => {
    setShowResetConfirm(true);
  };

  const handleCancelReset = () => {
    setShowResetConfirm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create submission data with timestamp
    const submissionData = {
      ...formData,
      submissionDate: new Date().toISOString(),
      submissionDateTime: new Date().toLocaleString(),
      language: language,
      formType: 'Machine Breakdown Intimation',
      status: formData.status
    };
    
    // Log to console
    console.log('========== FORM SUBMISSION ==========');
    console.log('Submission Time:', new Date().toLocaleString());
    console.log('Language:', language);
    console.log('Form Data:', submissionData);
    console.log('=====================================');
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset form after successful submission
      resetForm();
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 1000);
  };

  const handleBack = () => {
    console.log('Navigating back to Maintenance Hub');
    // Navigate to maintenance hub - using window.location.href for direct navigation
    // You can replace this with your routing logic (React Router, Next.js, etc.)
    window.location.href = '/maintenance-hub';
    // If using React Router, you would use: navigate('/maintenance-hub');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'english' ? 'hindi' : 'english');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button and Header */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <button 
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-[#ef4444] transition-colors bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md cursor-pointer"
            type="button"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="text-sm sm:text-base font-medium">{currentLang.back}</span>
          </button>
          
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-sm text-gray-600 font-medium">
                {currentDate}
              </span>
            </div>
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white rounded-lg hover:from-[#dc2626] hover:to-[#b91c1c] transition-all shadow-sm hover:shadow-md text-sm font-medium min-w-[80px] cursor-pointer"
              type="button"
            >
              {language === 'english' ? 'हिंदी' : 'English'}
            </button>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-sm animate-fade-in">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              <span className="font-medium">{currentLang.success}</span>
            </div>
          </div>
        )}

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {currentLang.resetConfirm}
              </h3>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancelReset}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white rounded-lg hover:from-[#dc2626] hover:to-[#b91c1c] transition-all cursor-pointer"
                  type="button"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white shadow-xl rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-[#ef4444] via-[#dc2626] to-[#b91c1c] px-4 sm:px-6 py-4 sm:py-5">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white text-center tracking-tight">
              {currentLang.title}
            </h1>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
            
            {/* First Section - Production fields (no heading) */}
            <div className="space-y-4 sm:space-y-5">
              {/* Row 1: Breakdown Name and Part made after inspection - Side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    {currentLang.breakdownName} <span className="text-[#ef4444]">*</span>
                  </label>
                  <input
                    type="text"
                    name="breakdownName"
                    value={formData.breakdownName}
                    onChange={handleInputChange}
                    placeholder={language === 'english' ? "Enter breakdown name" : "ब्रेकडाउन का नाम दर्ज करें"}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:border-transparent text-sm text-slate-700"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    {currentLang.partMadeAfterInspection} <span className="text-[#ef4444]">*</span>
                  </label>
                  <input
                    type="text"
                    name="partMadeAfterInspection"
                    value={formData.partMadeAfterInspection}
                    onChange={handleInputChange}
                    placeholder={language === 'english' ? "Enter part details" : "भाग का विवरण दर्ज करें"}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:border-transparent text-sm text-slate-700"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Machine Name - Full width */}
              <div className="space-y-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  {currentLang.machineName} <span className="text-[#ef4444]">*</span>
                </label>
                <input
                  type="text"
                  name="machineNameNo"
                  value={formData.machineNameNo}
                  onChange={handleInputChange}
                  placeholder={language === 'english' ? "e.g., 3.00 No.S" : "उदा., 3.00 नं.एस"}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:border-transparent text-sm text-slate-700"
                  required
                />
              </div>

              {/* Row 3: Given Date and Given Time - Side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    {currentLang.givenOn} <span className="text-[#ef4444]">*</span>
                  </label>
                  <input
                    type="date"
                    name="givenDate"
                    value={formData.givenDate}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:border-transparent text-sm text-slate-700"
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    {currentLang.givenAt} <span className="text-[#ef4444]">*</span>
                  </label>
                  <input
                    type="time"
                    name="givenTime"
                    value={formData.givenTime}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:border-transparent text-sm text-slate-700"
                    required
                  />
                </div>
              </div>

              {/* Row 4: Breakdown Details - Full width */}
              <div className="space-y-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  {currentLang.breakdownDetails} <span className="text-[#ef4444]">*</span>
                </label>
                <textarea
                  name="breakdownDesc"
                  value={formData.breakdownDesc}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder={language === 'english' ? "Describe the breakdown in detail" : "ब्रेकडाउन के बारे में विस्तार से लिखें"}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:border-transparent text-sm text-slate-700"
                  required
                />
              </div>
            </div>

            {/* Separator line */}
            <div className="border-t-2 border-gray-200"></div>

            {/* Second Section - Maintenance fields with heading */}
            <div className="space-y-4 sm:space-y-5">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 border-b-2 border-[#ef4444] pb-2">
                {currentLang.maintenanceOnly}
              </h2>
              
              {/* Row 1: Repair Date and Repair Time - Side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    {currentLang.repairDate}
                  </label>
                  <input
                    type="date"
                    name="repairDate"
                    value={formData.repairDate}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:border-transparent text-sm text-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    {currentLang.repairTime}
                  </label>
                  <input
                    type="time"
                    name="repairTime"
                    value={formData.repairTime}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:border-transparent text-sm text-slate-700"
                  />
                </div>
              </div>

              {/* Row 2: Hours Taken and Mechanics Involved - Side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    {currentLang.hoursTaken}
                  </label>
                  <input
                    type="number"
                    name="repairHours"
                    value={formData.repairHours}
                    onChange={handleInputChange}
                    step="0.5"
                    min="0"
                    placeholder="0.0"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:border-transparent text-sm text-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    {currentLang.mechanicsInvolved}
                  </label>
                  <input
                    type="number"
                    name="mechanicsCount"
                    value={formData.mechanicsCount}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="0"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:border-transparent text-sm text-slate-700"
                  />
                </div>
              </div>

              {/* Row 3: Repair Description - Full width */}
              <div className="space-y-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  {currentLang.repairDescription}
                </label>
                <textarea
                  name="repairDesc"
                  value={formData.repairDesc}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder={language === 'english' ? "Describe the repair work done" : "मरम्मत कार्य का विवरण लिखें"}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:border-transparent text-sm text-slate-700"
                />
              </div>
            </div>

            {/* Separator line */}
            <div className="border-t-2 border-gray-200"></div>

            {/* Third Section - Quality fields with heading */}
            <div className="space-y-4 sm:space-y-5">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 border-b-2 border-[#ef4444] pb-2">
                {currentLang.verification}
              </h2>
              
              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  {currentLang.statusOfProblem}
                </label>
                <div className="flex flex-col sm:flex-row gap-3 sm:space-x-6">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="status"
                      value="OK"
                      checked={formData.status === 'OK'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[#ef4444]"
                    />
                    <span className="ml-2 flex items-center text-green-600 font-medium">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" />
                      {currentLang.ok}
                    </span>
                  </label>
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="status"
                      value="NG"
                      checked={formData.status === 'NG'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[#ef4444]"
                    />
                    <span className="ml-2 flex items-center text-red-600 font-medium">
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" />
                      {currentLang.ng}
                    </span>
                  </label>
                </div>
              </div>

              {/* Row: Date and Time - Side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    {currentLang.date}
                  </label>
                  <input
                    type="date"
                    name="verificationDate"
                    value={formData.verificationDate}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:border-transparent text-sm  text-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    {currentLang.time}
                  </label>
                  <input
                    type="time"
                    name="verificationTime"
                    value={formData.verificationTime}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:border-transparent text-sm text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions - Submit and Reset Buttons */}
            <div className="pt-4 sm:pt-6 flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={handleResetClick}
                className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all font-medium text-base sm:text-lg shadow-lg hover:shadow-xl flex items-center justify-center order-2 sm:order-1 cursor-pointer"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                {currentLang.restButton}
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:from-[#dc2626] hover:to-[#b91c1c] transition-all font-medium text-base sm:text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center order-1 sm:order-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {currentLang.submitting}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    {currentLang.submit}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Add custom animation styles */}
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
      `}</style>
    </div>
  );
};

export default MachineBreakDownForm;