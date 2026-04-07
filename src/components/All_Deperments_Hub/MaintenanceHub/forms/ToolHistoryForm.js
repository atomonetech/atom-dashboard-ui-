import React, { useState, useEffect } from 'react';
import { 
  Hash, 
  Wrench, 
  Users, 
  Clock, 
  History,
  Package,
  ArrowLeft,
  Save,
  RotateCcw,
  Calendar,
  Link,
  FileText,
  CalendarDays,
  PenTool,
  AlertCircle,
  FileCheck
} from 'lucide-react';

const ToolHistoryForm = () => {
  // Three gradient colors for header
  const gradientColors = {
    start: '#4158D0',
    middle: '#C850C0',
    end: '#FFCC70'
  };

  // Get current date in DD.MM.YYYY format for display
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '.');

  // Get current date in YYYY-MM-DD format for input field
  const getCurrentDateForInput = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Initial state for tool information
  const initialToolInfo = {
    partName: '',
    partNo: '',
    toolName: '',
    model: '',
    customerName: '',
    estimatedToolLife: '',
    estimatedMaintenanceFrequency: ''
  };

  // Single history record state with auto-filled date
  const [toolInfo, setToolInfo] = useState(initialToolInfo);
  const [historyRecord, setHistoryRecord] = useState({
    date: getCurrentDateForInput(), // Auto-filled with current date
    prod: '',
    resharpeningStroke: '',
    cumulativeProd: '',
    problemReported: '',
    actionTaken: '',
    updatedIn4M: '',
    remarks: ''
  });

  // State for notification
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Handle tool info changes
  const handleToolInfoChange = (e) => {
    const { name, value } = e.target;
    setToolInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle history record changes
  const handleHistoryRecordChange = (field, value) => {
    setHistoryRecord(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Validate form data
  const validateForm = () => {
    const requiredToolFields = ['partName', 'partNo', 'toolName'];
    for (const field of requiredToolFields) {
      if (!toolInfo[field]?.trim()) {
        showNotification(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`, 'warning');
        return false;
      }
    }
    return true;
  };

  // Save data to console
  const saveData = () => {
    if (!validateForm()) return;

    const formData = {
      toolInformation: toolInfo,
      historyRecord: historyRecord,
      timestamp: new Date().toISOString(),
      formId: `TOOL-${Date.now()}`
    };

    console.log('='.repeat(60));
    console.log('📋 TOOL HISTORY CARD DATA SAVED');
    console.log('='.repeat(60));
    console.log('🆔 Form ID:', formData.formId);
    console.log('⏰ Timestamp:', new Date().toLocaleString());
    console.log('\n🔧 TOOL INFORMATION:');
    console.table({
      'Part Name': formData.toolInformation.partName || '(empty)',
      'Part No.': formData.toolInformation.partNo || '(empty)',
      'Tool Name': formData.toolInformation.toolName || '(empty)',
      'Model': formData.toolInformation.model || '(empty)',
      'Customer': formData.toolInformation.customerName || '(empty)',
      'Tool Life': formData.toolInformation.estimatedToolLife || '(empty)',
      'Maintenance Freq.': formData.toolInformation.estimatedMaintenanceFrequency || '(empty)'
    });

    console.log('\n📊 HISTORY RECORD:');
    console.log('Date:', formData.historyRecord.date || '-');
    console.log('PROD:', formData.historyRecord.prod || '-');
    console.log('Resharpening Stroke:', formData.historyRecord.resharpeningStroke || '-');
    console.log('Cumulative PROD:', formData.historyRecord.cumulativeProd || '-');
    console.log('Problem Reported:', formData.historyRecord.problemReported || '-');
    console.log('Action Taken:', formData.historyRecord.actionTaken || '-');
    console.log('4M Update:', formData.historyRecord.updatedIn4M || '-');
    console.log('Remarks:', formData.historyRecord.remarks || '-');

    console.log('='.repeat(60));
    showNotification('Data saved successfully! Check console for details.', 'success');
  };

  // Reset form
  const resetForm = () => {
    if (window.confirm('Are you sure you want to reset all form data?')) {
      setToolInfo(initialToolInfo);
      setHistoryRecord({
        date: getCurrentDateForInput(), // Reset with current date
        prod: '',
        resharpeningStroke: '',
        cumulativeProd: '',
        problemReported: '',
        actionTaken: '',
        updatedIn4M: '',
        remarks: ''
      });
      showNotification('Form has been reset', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-3 px-3 sm:py-4 sm:px-4 md:py-6 font-sans">
      <div className="w-full max-w-5xl mx-auto">
        {/* Notification Toast */}
        {notification.show && (
          <div className={`fixed top-4 right-4 z-50 p-3 sm:p-4 rounded-lg shadow-lg animate-slideIn ${
            notification.type === 'success' ? 'bg-green-500' :
            notification.type === 'warning' ? 'bg-yellow-500' :
            'bg-blue-500'
          } text-white max-w-[90%] sm:max-w-md text-xs sm:text-sm`}>
            {notification.message}
          </div>
        )}

        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header Section with Back Button Inside */}
          <div 
            className="px-4 py-3 sm:px-5 sm:py-4"
            style={{ 
              background: `linear-gradient(135deg, ${gradientColors.start}, ${gradientColors.middle}, ${gradientColors.end})`,
            }}
          >
            {/* Back Button - First */}
            <div className="mb-3 sm:mb-4">
              <button 
                className="inline-flex items-center gap-1.5 text-white hover:text-white/90 transition-all rounded-lg bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 group"
                onClick={() => window.location.href = '/Maintenance/Tool/Daily-Reports'}
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1" />
                <span className="text-xs sm:text-sm font-medium">Back to Maintenance Hub</span>
              </button>
            </div>
            
            {/* Heading and Date */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <History className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white drop-shadow-lg" />
                <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white drop-shadow-lg">
                  TOOL HISTORY CARD
                </h1>
              </div>
              
              {/* Date Display */}
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                <span className="text-xs sm:text-sm md:text-base text-white font-semibold">
                  {currentDate}
                </span>
              </div>
            </div>
          </div>

          {/* Main Form Content */}
          <div className="p-4 sm:p-5 md:p-6 lg:p-8">
            
            {/* Tool Information Section */}
            <div className="mb-6 sm:mb-7 md:mb-8">
              <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-3 pb-2 border-b-2" style={{ borderBottomColor: gradientColors.middle }}>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4158D0] to-[#C850C0]">
                  Tool Information
                </span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                {/* Left Column */}
                <div className="space-y-3 sm:space-y-4">
                  {/* PART NAME */}
                  <div>
                    <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-600 uppercase mb-1.5">
                      <Link className="w-3.5 h-3.5" style={{ color: gradientColors.middle }} />
                      PART NAME <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="partName"
                      value={toolInfo.partName}
                      onChange={handleToolInfoChange}
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 text-sm focus:bg-white focus:border-[#4158D0] outline-none transition-all text-slate-700"
                      placeholder="Enter part name"
                    />
                  </div>

                  {/* PART NO. */}
                  <div>
                    <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-600 uppercase mb-1.5">
                      <Hash className="w-3.5 h-3.5" style={{ color: gradientColors.middle }} />
                      PART NO. <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="partNo"
                      value={toolInfo.partNo}
                      onChange={handleToolInfoChange}
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 text-sm focus:bg-white focus:border-[#4158D0] outline-none transition-all text-slate-700"
                      placeholder="Enter part number"
                    />
                  </div>

                  {/* TOOL NAME */}
                  <div>
                    <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-600 uppercase mb-1.5">
                      <Wrench className="w-3.5 h-3.5" style={{ color: gradientColors.middle }} />
                      TOOL NAME <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="toolName"
                      value={toolInfo.toolName}
                      onChange={handleToolInfoChange}
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 text-sm focus:bg-white focus:border-[#4158D0] outline-none transition-all text-slate-700"
                      placeholder="Enter tool name"
                    />
                  </div>

                  {/* MODEL */}
                  <div>
                    <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-600 uppercase mb-1.5">
                      <Package className="w-3.5 h-3.5" style={{ color: gradientColors.middle }} />
                      MODEL
                    </label>
                    <input 
                      type="text" 
                      name="model"
                      value={toolInfo.model}
                      onChange={handleToolInfoChange}
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 text-sm focus:bg-white focus:border-[#4158D0] outline-none transition-all text-slate-700"
                      placeholder="Enter model"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3 sm:space-y-4">
                  {/* CUSTOMER NAME */}
                  <div>
                    <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-600 uppercase mb-1.5">
                      <Users className="w-3.5 h-3.5" style={{ color: gradientColors.middle }} />
                      CUSTOMER NAME
                    </label>
                    <input 
                      type="text" 
                      name="customerName"
                      value={toolInfo.customerName}
                      onChange={handleToolInfoChange}
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 text-sm focus:bg-white focus:border-[#4158D0] outline-none transition-all text-slate-700"
                      placeholder="Enter customer name"
                    />
                  </div>

                  {/* ESTIMATED TOOL LIFE */}
                  <div>
                    <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-600 uppercase mb-1.5">
                      <Clock className="w-3.5 h-3.5" style={{ color: gradientColors.middle }} />
                      ESTIMATED TOOL LIFE
                    </label>
                    <input 
                      type="text" 
                      name="estimatedToolLife"
                      value={toolInfo.estimatedToolLife}
                      onChange={handleToolInfoChange}
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 text-sm focus:bg-white focus:border-[#4158D0] outline-none transition-all text-slate-700"
                      placeholder="e.g., 10000 cycles"
                    />
                  </div>

                  {/* ESTIMATED MAINTENANCE FREQUENCY */}
                  <div>
                    <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-600 uppercase mb-1.5">
                      <Clock className="w-3.5 h-3.5" style={{ color: gradientColors.middle }} />
                      ESTIMATED MAINTENANCE FREQUENCY
                    </label>
                    <input 
                      type="text" 
                      name="estimatedMaintenanceFrequency"
                      value={toolInfo.estimatedMaintenanceFrequency}
                      onChange={handleToolInfoChange}
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 text-sm focus:bg-white focus:border-[#4158D0] outline-none transition-all text-slate-700"
                      placeholder="e.g., Every 500 cycles"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Tool History Information */}
            <div className="mb-6 sm:mb-7 md:mb-8">
              <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-3 pb-2 border-b-2" style={{ borderBottomColor: gradientColors.middle }}>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4158D0] to-[#C850C0]">
                  Tool History Information
                </span>
              </h2>

              {/* Single Record Card */}
              <div 
                className="border-2 border-slate-200 rounded-lg p-4 sm:p-5 shadow-sm"
                style={{ borderLeftColor: gradientColors.middle, borderLeftWidth: '4px' }}
              >
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-700 text-xs sm:text-sm uppercase tracking-wide">Current History Record</span>
                </div>

                {/* Two-column layout for record fields */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {/* Left Column */}
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-600 uppercase mb-1.5">
                        <CalendarDays className="w-3.5 h-3.5" style={{ color: gradientColors.middle }} />
                        DATE
                      </label>
                      <input 
                        type="date" 
                        value={historyRecord.date}
                        onChange={(e) => handleHistoryRecordChange('date', e.target.value)}
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 text-sm focus:bg-white focus:border-[#4158D0] outline-none transition-all text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-600 uppercase mb-1.5">
                        <Hash className="w-3.5 h-3.5" style={{ color: gradientColors.middle }} />
                        PROD.
                      </label>
                      <input 
                        type="text" 
                        value={historyRecord.prod}
                        onChange={(e) => handleHistoryRecordChange('prod', e.target.value)}
                        placeholder="Production count"
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 text-sm focus:bg-white focus:border-[#4158D0] outline-none transition-all text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-600 uppercase mb-1.5">
                        <Wrench className="w-3.5 h-3.5" style={{ color: gradientColors.middle }} />
                        RESHARPENING STROKE
                      </label>
                      <input 
                        type="text" 
                        value={historyRecord.resharpeningStroke}
                        onChange={(e) => handleHistoryRecordChange('resharpeningStroke', e.target.value)}
                        placeholder="Stroke count"
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 text-sm focus:bg-white focus:border-[#4158D0] outline-none transition-all text-slate-700"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-600 uppercase mb-1.5">
                        <History className="w-3.5 h-3.5" style={{ color: gradientColors.middle }} />
                        CUMULATIVE PROD.
                      </label>
                      <input 
                        type="text" 
                        value={historyRecord.cumulativeProd}
                        onChange={(e) => handleHistoryRecordChange('cumulativeProd', e.target.value)}
                        placeholder="Cumulative production"
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 text-sm focus:bg-white focus:border-[#4158D0] outline-none transition-all text-slate-700"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-600 uppercase mb-1.5">
                        <AlertCircle className="w-3.5 h-3.5" style={{ color: gradientColors.middle }} />
                        PROBLEM REPORTED
                      </label>
                      <textarea 
                        value={historyRecord.problemReported}
                        onChange={(e) => handleHistoryRecordChange('problemReported', e.target.value)}
                        placeholder="Describe any problems"
                        rows="3"
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 text-sm focus:bg-white focus:border-[#4158D0] outline-none transition-all text-slate-700 resize-y"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-600 uppercase mb-1.5">
                        <PenTool className="w-3.5 h-3.5" style={{ color: gradientColors.middle }} />
                        ACTION TAKEN
                      </label>
                      <textarea 
                        value={historyRecord.actionTaken}
                        onChange={(e) => handleHistoryRecordChange('actionTaken', e.target.value)}
                        placeholder="Actions performed"
                        rows="3"
                        className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 text-sm focus:bg-white focus:border-[#4158D0] outline-none transition-all text-slate-700 resize-y"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-600 uppercase mb-1.5">
                          <FileCheck className="w-3.5 h-3.5" style={{ color: gradientColors.middle }} />
                          4M RECORD
                        </label>
                        <select 
                          value={historyRecord.updatedIn4M}
                          onChange={(e) => handleHistoryRecordChange('updatedIn4M', e.target.value)}
                          className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 text-sm focus:bg-white focus:border-[#4158D0] outline-none transition-all text-slate-700"
                        >
                          <option value="">Select</option>
                          <option value="Y">Yes (Y)</option>
                          <option value="N">No (N)</option>
                        </select>
                      </div>

                      <div>
                        <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-600 uppercase mb-1.5">
                          <FileText className="w-3.5 h-3.5" style={{ color: gradientColors.middle }} />
                          REMARKS
                        </label>
                        <input 
                          type="text" 
                          value={historyRecord.remarks}
                          onChange={(e) => handleHistoryRecordChange('remarks', e.target.value)}
                          placeholder="Additional remarks"
                          className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 text-sm focus:bg-white focus:border-[#4158D0] outline-none transition-all text-slate-700"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Save and Reset Buttons */}
            <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                onClick={resetForm}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm hover:shadow text-xs sm:text-sm font-bold uppercase tracking-wide"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear Form
              </button>
              <button
                onClick={saveData}
                className="flex items-center justify-center gap-2 px-5 py-2.5 text-white rounded-lg transition-all hover:opacity-90 hover:shadow-md text-xs sm:text-sm font-bold uppercase tracking-wide"
                style={{ 
                  background: `linear-gradient(135deg, ${gradientColors.middle}, ${gradientColors.end})`,
                }}
              >
                <Save className="w-3.5 h-3.5" />
                Save Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ToolHistoryForm;