import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, RotateCcw, FileText } from 'lucide-react';
import axios from 'axios';

const ToolBreakdownForm = () => {
  const [language, setLanguage] = useState('hindi');
  
  // State for all form fields
  const [formData, setFormData] = useState({
    reporterName: '',
    reportDate: '',
    machineNameNo: '',
    reportTime: '',
    breakdownDetails: '',
    maintTime: '',
    maintDate: '',
    repairTimeTaken: '',
    manpowerCount: '',
    actionTaken: '',
    status: 'OK',
    qualityTime: '',
    qualityDate: '',
    ncVerification: ''
  });

  const content = {
    english: {
      title: 'TOOL BREAK DOWN INTIMATION SLIP',
      reporterName: 'Name of person reporting',
      reportDate: 'Date Reported',
      machineName: 'Machine / Engine Name & No.',
      reportTime: 'Time Reported',
      breakdownDetails: 'Write about breakdown in detail',
      maintenanceOnly: '(FOR MAINTENANCE DEPTT. USE ONLY)',
      maintTime: 'Time',
      maintDate: 'Date',
      repairTimeTaken: 'Time taken to rectify breakdown',
      manpowerCount: 'No. of manpower involved',
      actionTaken: 'Write detail of action taken',
      verification: 'Verification of Quality',
      statusOfProblem: 'STATUS OF PROBLEM',
      ok: 'OK',
      ng: 'NG',
      time: 'Time',
      date: 'Date',
      ncVerification: 'NC Verification',
      restButton: 'Reset Form',
      back: 'Back to Maintenance Hub',
      submit: 'Submit Form',
      submitting: 'Submitting...',
      success: 'Form submitted successfully!',
      resetConfirm: 'Are you sure you want to reset all fields?'
    },
    hindi: {
      title: 'TOOL BREAK DOWN INTIMATION SLIP',
      reporterName: 'ब्रेकडाउन देने वाले का नाम',
      reportDate: 'किस तारीख को दिया',
      machineName: 'मशीन का नाम व नंबर',
      reportTime: 'किस समय दिया',
      breakdownDetails: 'ब्रेकडाउन के बारे में विस्तार से लिखें',
      maintenanceOnly: '(FOR MAINTENANCE DEPTT. USE ONLY)',
      maintTime: 'समय',
      maintDate: 'तिथि',
      repairTimeTaken: 'ब्रेकडाउन का सही करने में लगा समय',
      manpowerCount: 'ब्रेकडाउन को सही करने में कितने आदमी लगे',
      actionTaken: 'क्या एक्शन लिया विस्तार से लिखें',
      verification: 'क्वालिटी द्वारा जाँच (Verification of Quality)',
      statusOfProblem: 'STATUS OF PROBLEM',
      ok: 'OK',
      ng: 'NG',
      time: 'Time',
      date: 'Date',
      ncVerification: 'NC Verification',
      restButton: 'फॉर्म रीसेट करें',
      back: 'मेंटेनेंस हब पर वापस',
      submit: 'फॉर्म जमा करें',
      submitting: 'जमा हो रहा है...',
      success: 'फॉर्म सफलतापूर्वक जमा हो गया!',
      resetConfirm: 'क्या आप सभी फ़ील्ड रीसेट करना चाहते हैं?'
    }
  };

  const initialFormState = {
    reporterName: '', reportDate: '', machineNameNo: '', reportTime: '', breakdownDetails: '',
    maintTime: '', maintDate: '', repairTimeTaken: '', manpowerCount: '', actionTaken: '',
    status: 'OK', qualityTime: '', qualityDate: '', ncVerification: ''
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  const currentLang = language === 'english' ? content.english : content.hindi;
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: '2-digit', year: 'numeric'
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Helper function to send null instead of empty string for Django Date/Time fields
    const formatNull = (val) => (val && val.trim() !== '' ? val : null);

    // EXACT MAPPING ACCORDING TO YOUR DJANGO MODEL
    const submissionData = {
      date: formatNull(formData.reportDate),
      toolName: formData.machineNameNo,
      processName: formData.machineNameNo,
      problem: formData.breakdownDetails,
      actionTaken: formData.actionTaken,
      totalTimeTaken: formData.repairTimeTaken,
      checkedBy: formData.ncVerification,
      historyCardStatus: formData.status,
      updatedIn4M: '',
      sign: formData.reporterName,
      remarks: formData.breakdownDetails,
      doc_no: 'AOT-F-BD-01',
      reporter_name: formData.reporterName,
      report_date: formatNull(formData.reportDate),
      machine_name_no: formData.machineNameNo,
      report_time: formatNull(formData.reportTime),
      breakdown_details: formData.breakdownDetails,
      prod_supervisor_name: null, // Since we don't have it in UI currently
      maint_date: formatNull(formData.maintDate),
      maint_time: formatNull(formData.maintTime),
      time_taken_to_rectify: formatNull(formData.repairTimeTaken),
      men_engaged: formData.manpowerCount ? parseInt(formData.manpowerCount, 10) : null,
      action_taken_details: formatNull(formData.actionTaken),
      maint_incharge_name: null, // Since we don't have it in UI currently
      status: formData.status,
      qa_date: formatNull(formData.qualityDate),
      qa_time: formatNull(formData.qualityTime),
      nc_verification: formatNull(formData.ncVerification),
      qa_incharge_name: null, // Since we don't have it in UI currently
      language: language
    };
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const API_LOG = `${
        process.env.REACT_APP_API_URL || "http://localhost:8000"
      }/api/log-report/`;
      const response = await fetch(`${apiUrl}/api/tool-breakdown-slip/save/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (response.ok || result.success) {
         const currentUser = localStorage.getItem("username") || "Unknown User";

        try {
          await axios.post(API_LOG, {
            username: currentUser,
            report_name: "Tool BreakDown form Form", // Yahan hardcode kar diya form ka naam
          });
          console.log("Activity log successfully saved!");
        } catch (logError) {
          console.error("Activity log save karne mein error aayi:", logError);
        }
        setShowSuccess(true);
        alert("✅ Success: Tool breakdown slip has been submitted successfully!");
        resetForm();
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        console.error("Backend Error Response:", result);
        alert("❌ Error: " + JSON.stringify(result)); // This will help you see the exact error if it fails
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("❌ Network Error: Could not connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Controls */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <button 
            onClick={() => window.location.href = '/Maintenance/Machine/daily'}
            className="flex items-center text-gray-600 hover:text-red-500 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md cursor-pointer"
            type="button"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="text-sm sm:text-base font-medium">{currentLang.back}</span>
          </button>
          
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-sm text-gray-600 font-medium">{currentDate}</span>
            </div>
            <button
              onClick={() => setLanguage(prev => prev === 'english' ? 'hindi' : 'english')}
              className="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all shadow-sm text-sm font-medium min-w-[80px] cursor-pointer"
              type="button"
            >
              {language === 'english' ? 'हिंदी' : 'English'}
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {showSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-sm animate-fade-in">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              <span className="font-medium">{currentLang.success}</span>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
          
          {/* Form Header */}
          <div className="bg-white border-b-2 border-gray-800 px-4 py-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 tracking-tight text-center">
                {currentLang.title}
              </h1>
            </div>
            <div className="border border-gray-800 text-xs text-gray-800 font-semibold bg-gray-50">
              <div className="flex border-b border-gray-800"><span className="p-1 border-r border-gray-800 w-20">DOC.NO.</span><span className="p-1 w-24">AOT-F-BD-01</span></div>
              <div className="flex border-b border-gray-800"><span className="p-1 border-r border-gray-800 w-20">REV. NO.</span><span className="p-1 w-24">00</span></div>
              <div className="flex"><span className="p-1 border-r border-gray-800 w-20">DATE</span><span className="p-1 w-24">14.10.2024</span></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-8">
            
            {/* Section 1: Breakdown Intimation */}
            <div className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-800">{currentLang.reporterName} <span className="text-red-500">*</span></label>
                  <input
                    type="text" name="reporterName" value={formData.reporterName} onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm" required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-800">{currentLang.reportDate} <span className="text-red-500">*</span></label>
                  <input
                    type="date" name="reportDate" value={formData.reportDate} onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm" required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-800">{currentLang.machineName} <span className="text-red-500">*</span></label>
                  <input
                    type="text" name="machineNameNo" value={formData.machineNameNo} onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm" required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-800">{currentLang.reportTime} <span className="text-red-500">*</span></label>
                  <input
                    type="time" name="reportTime" value={formData.reportTime} onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm" required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-800">{currentLang.breakdownDetails} <span className="text-red-500">*</span></label>
                <textarea
                  name="breakdownDetails" value={formData.breakdownDetails} onChange={handleInputChange} rows="3"
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm" required
                />
              </div>
            </div>

            {/* Section 2: Maintenance Department */}
            <div className="space-y-4 sm:space-y-5 border-t-2 border-gray-300 pt-6">
              <h2 className="text-center font-bold text-gray-800 bg-gray-100 py-1 uppercase tracking-wider text-sm">
                {currentLang.maintenanceOnly}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-800">{currentLang.maintTime}</label>
                  <input
                    type="time" name="maintTime" value={formData.maintTime} onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-800">{currentLang.maintDate}</label>
                  <input
                    type="date" name="maintDate" value={formData.maintDate} onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-800">{currentLang.repairTimeTaken}</label>
                  <input
                    type="text" name="repairTimeTaken" value={formData.repairTimeTaken} onChange={handleInputChange} placeholder="e.g., 2 Hours"
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-800">{currentLang.manpowerCount}</label>
                  <input
                    type="number" name="manpowerCount" value={formData.manpowerCount} onChange={handleInputChange} min="0"
                    className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-800">{currentLang.actionTaken}</label>
                <textarea
                  name="actionTaken" value={formData.actionTaken} onChange={handleInputChange} rows="2"
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Section 3: Verification of Quality */}
            <div className="space-y-4 sm:space-y-5 border-t-2 border-gray-300 pt-6">
              <h2 className="text-center font-bold text-gray-800 py-1 text-base sm:text-lg">
                {currentLang.verification}
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-bold text-gray-800">{currentLang.statusOfProblem}:</span>
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="status" value="OK" checked={formData.status === 'OK'} onChange={handleInputChange} className="w-4 h-4 text-green-600 focus:ring-green-500" />
                    <span className="ml-2 font-semibold text-green-700">OK</span>
                  </label>
                  <span className="text-gray-400">/</span>
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" name="status" value="NG" checked={formData.status === 'NG'} onChange={handleInputChange} className="w-4 h-4 text-red-600 focus:ring-red-500" />
                    <span className="ml-2 font-semibold text-red-700">NG</span>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">{currentLang.time}</label>
                    <input type="time" name="qualityTime" value={formData.qualityTime} onChange={handleInputChange} className="px-2 py-1 bg-white text-gray-900 border border-gray-300 rounded text-sm focus:ring-red-500" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700">{currentLang.date}</label>
                    <input type="date" name="qualityDate" value={formData.qualityDate} onChange={handleInputChange} className="px-2 py-1 bg-white text-gray-900 border border-gray-300 rounded text-sm focus:ring-red-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-800">{currentLang.ncVerification}</label>
                <input
                  type="text" name="ncVerification" value={formData.ncVerification} onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Submit & Reset Actions */}
            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <button
                type="button" onClick={() => setShowResetConfirm(true)}
                className="flex-1 bg-white text-gray-700 border-2 border-gray-300 py-3 px-6 rounded-xl hover:bg-gray-50 transition-all font-medium text-base shadow-sm hover:shadow-md flex items-center justify-center order-2 sm:order-1"
              >
                <RotateCcw className="w-5 h-5 mr-2" /> {currentLang.restButton}
              </button>
              
              <button
                type="submit" disabled={isSubmitting}
                className={`flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-xl transition-all font-medium text-base shadow-lg flex items-center justify-center order-1 sm:order-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-red-600 hover:to-red-700 hover:shadow-xl'}`}
              >
                {isSubmitting ? '...' : <><FileText className="w-5 h-5 mr-2" /> {currentLang.submit}</>}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  ); 
};

export default ToolBreakdownForm;
