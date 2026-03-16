import React, { useState } from 'react';
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

  const lightPurple = '#f0eaff';

  // Get current date
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '.');

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

  // Single history record - no add/remove options
  const [toolInfo, setToolInfo] = useState(initialToolInfo);
  
  // Single history record state
  const [historyRecord, setHistoryRecord] = useState({
    date: '',
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
        date: '',
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
    <div className="min-h-screen p-3 sm:p-4 md:p-6 flex justify-center" style={{ backgroundColor: '#f8f4ff' }}>
      <div className="w-full max-w-4xl">
        {/* Notification Toast */}
        {notification.show && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg animate-slideIn ${
            notification.type === 'success' ? 'bg-green-500' :
            notification.type === 'warning' ? 'bg-yellow-500' :
            'bg-blue-500'
          } text-white max-w-[90%] sm:max-w-md`}>
            {notification.message}
          </div>
        )}

        {/* Back Button above form */}
        <div className="mb-3 sm:mb-4">
          <button 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
            onClick={() => window.location.href = '/maintenance-hub'}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs sm:text-sm font-medium">Back to Maintenance Hub</span>
          </button>
        </div>

        {/* Header with three-color gradient */}
        <div 
          className="rounded-t-lg p-4 sm:p-5 md:p-8 shadow-lg"
          style={{ 
            background: `linear-gradient(135deg, ${gradientColors.start}, ${gradientColors.middle}, ${gradientColors.end})`,
          }}
        >
          {/* Mobile view: Stacked layout */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <History className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white drop-shadow-lg" />
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg">
                TOOL HISTORY CARD
              </h1>
            </div>
            
            {/* Date */}
            <div className="flex items-center justify-start sm:justify-end gap-2 sm:gap-3">
              <div className="flex items-center gap-2 bg-white bg-opacity-25 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-inner w-full sm:w-auto">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <span className="text-sm sm:text-base md:text-lg text-white font-semibold">
                  {currentDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Container */}
        <div className="bg-white rounded-b-lg shadow-xl p-4 sm:p-5 md:p-6 lg:p-8">
          
          {/* Tool Information Section */}
          <div className="mb-8">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-4 pb-2 border-b-2" style={{ borderBottomColor: gradientColors.middle }}>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4158D0] to-[#C850C0]">
                Tool Information
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* PART NAME */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    <Link className="w-4 h-4" style={{ color: gradientColors.middle }} />
                    PART NAME <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="partName"
                    value={toolInfo.partName}
                    onChange={handleToolInfoChange}
                    className="w-full p-2.5 sm:p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:outline-none transition-all text-slate-700"
                    style={{ focusRingColor: gradientColors.middle }}
                    placeholder="Enter part name"
                  />
                </div>

                {/* PART NO. */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    <Hash className="w-4 h-4" style={{ color: gradientColors.middle }} />
                    PART NO. <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="partNo"
                    value={toolInfo.partNo}
                    onChange={handleToolInfoChange}
                    className="w-full p-2.5 sm:p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:outline-none text-slate-700"
                    style={{ focusRingColor: gradientColors.middle }}
                    placeholder="Enter part number"
                  />
                </div>

                {/* TOOL NAME */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    <Wrench className="w-4 h-4" style={{ color: gradientColors.middle }} />
                    TOOL NAME <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="toolName"
                    value={toolInfo.toolName}
                    onChange={handleToolInfoChange}
                    className="w-full p-2.5 sm:p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:outline-none text-slate-700"
                    style={{ focusRingColor: gradientColors.middle }}
                    placeholder="Enter tool name"
                  />
                </div>

                {/* MODEL */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    <Package className="w-4 h-4" style={{ color: gradientColors.middle }} />
                    MODEL
                  </label>
                  <input 
                    type="text" 
                    name="model"
                    value={toolInfo.model}
                    onChange={handleToolInfoChange}
                    className="w-full p-2.5 sm:p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:outline-none text-slate-700"
                    style={{ focusRingColor: gradientColors.middle }}
                    placeholder="Enter model"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* CUSTOMER NAME */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    <Users className="w-4 h-4" style={{ color: gradientColors.middle }} />
                    CUSTOMER NAME
                  </label>
                  <input 
                    type="text" 
                    name="customerName"
                    value={toolInfo.customerName}
                    onChange={handleToolInfoChange}
                    className="w-full p-2.5 sm:p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:outline-none text-slate-700"
                    style={{ focusRingColor: gradientColors.middle }}
                    placeholder="Enter customer name"
                  />
                </div>

                {/* ESTIMATED TOOL LIFE */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    <Clock className="w-4 h-4" style={{ color: gradientColors.middle }} />
                    ESTIMATED TOOL LIFE
                  </label>
                  <input 
                    type="text" 
                    name="estimatedToolLife"
                    value={toolInfo.estimatedToolLife}
                    onChange={handleToolInfoChange}
                    className="w-full p-2.5 sm:p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:outline-none text-slate-700"
                    style={{ focusRingColor: gradientColors.middle }}
                    placeholder="e.g., 10000 cycles"
                  />
                </div>

                {/* ESTIMATED MAINTENANCE FREQUENCY */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                    <Clock className="w-4 h-4" style={{ color: gradientColors.middle }} />
                    ESTIMATED MAINTENANCE FREQUENCY
                  </label>
                  <input 
                    type="text" 
                    name="estimatedMaintenanceFrequency"
                    value={toolInfo.estimatedMaintenanceFrequency}
                    onChange={handleToolInfoChange}
                    className="w-full p-2.5 sm:p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:outline-none text-slate-700"
                    style={{ focusRingColor: gradientColors.middle }}
                    placeholder="e.g., Every 500 cycles"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tool History Information - Single Record, No Add/Remove Options */}
          <div className="mb-8">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-4 pb-2 border-b-2" style={{ borderBottomColor: gradientColors.middle }}>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4158D0] to-[#C850C0]">
                Tool History Information
              </span>
            </h2>

            {/* Single Card Layout - No Add/Remove Buttons */}
            <div 
              className="border border-gray-200 rounded-lg p-4 sm:p-5 shadow-sm"
              style={{ borderLeftColor: gradientColors.middle, borderLeftWidth: '4px' }}
            >
              {/* Record Header - Just the number, no remove button */}
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
               
                <span className="font-medium text-gray-700 text-sm">Current History Record</span>
              </div>

              {/* Two-column layout for record fields */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Date */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
                      <CalendarDays className="w-4 h-4" style={{ color: gradientColors.middle }} />
                      DATE
                    </label>
                    <input 
                      type="text" 
                      value={historyRecord.date}
                      onChange={(e) => handleHistoryRecordChange('date', e.target.value)}
                      placeholder="dd-mm-yyyy"
                      className="w-full p-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:outline-none text-slate-700"
                      style={{ focusRingColor: gradientColors.middle }}
                    />
                  </div>

                  {/* PROD */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
                      <Hash className="w-4 h-4" style={{ color: gradientColors.middle }} />
                      PROD.
                    </label>
                    <input 
                      type="text" 
                      value={historyRecord.prod}
                      onChange={(e) => handleHistoryRecordChange('prod', e.target.value)}
                      placeholder="Production count"
                      className="w-full p-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:outline-none text-slate-700"
                      style={{ focusRingColor: gradientColors.middle }}
                    />
                  </div>

                  {/* Resharpening Stroke */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
                      <Wrench className="w-4 h-4" style={{ color: gradientColors.middle }} />
                      RESHARPENING STROKE
                    </label>
                    <input 
                      type="text" 
                      value={historyRecord.resharpeningStroke}
                      onChange={(e) => handleHistoryRecordChange('resharpeningStroke', e.target.value)}
                      placeholder="Stroke count"
                      className="w-full p-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:outline-none text-slate-700"
                      style={{ focusRingColor: gradientColors.middle }}
                    />
                  </div>

                  {/* Cumulative PROD */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
                      <History className="w-4 h-4" style={{ color: gradientColors.middle }} />
                      CUMULATIVE PROD.
                    </label>
                    <input 
                      type="text" 
                      value={historyRecord.cumulativeProd}
                      onChange={(e) => handleHistoryRecordChange('cumulativeProd', e.target.value)}
                      placeholder="Cumulative production"
                      className="w-full p-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:outline-none text-slate-700"
                      style={{ focusRingColor: gradientColors.middle }}
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Problem Reported - Textarea for longer text */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
                      <AlertCircle className="w-4 h-4" style={{ color: gradientColors.middle }} />
                      PROBLEM REPORTED
                    </label>
                    <textarea 
                      value={historyRecord.problemReported}
                      onChange={(e) => handleHistoryRecordChange('problemReported', e.target.value)}
                      placeholder="Describe any problems"
                      rows="3"
                      className="w-full p-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:outline-none resize-none text-slate-700"
                      style={{ focusRingColor: gradientColors.middle }}
                    />
                  </div>

                  {/* Action Taken - Textarea for longer text */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
                      <PenTool className="w-4 h-4" style={{ color: gradientColors.middle }} />
                      ACTION TAKEN
                    </label>
                    <textarea 
                      value={historyRecord.actionTaken}
                      onChange={(e) => handleHistoryRecordChange('actionTaken', e.target.value)}
                      placeholder="Actions performed"
                      rows="3"
                      className="w-full p-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:outline-none resize-none text-slate-700"
                      style={{ focusRingColor: gradientColors.middle }}
                    />
                  </div>

                  {/* 4M Record and Remarks in same row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
                        <FileCheck className="w-4 h-4" style={{ color: gradientColors.middle }} />
                        4M RECORD
                      </label>
                      <select 
                        value={historyRecord.updatedIn4M}
                        onChange={(e) => handleHistoryRecordChange('updatedIn4M', e.target.value)}
                        className="w-full p-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:outline-none text-slate-700"
                        style={{ focusRingColor: gradientColors.middle }}
                      >
                        <option value="">Select</option>
                        <option value="Y">Yes (Y)</option>
                        <option value="N">No (N)</option>
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5">
                        <FileText className="w-4 h-4" style={{ color: gradientColors.middle }} />
                        REMARKS
                      </label>
                      <input 
                        type="text" 
                        value={historyRecord.remarks}
                        onChange={(e) => handleHistoryRecordChange('remarks', e.target.value)}
                        placeholder="Additional remarks"
                        className="w-full p-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:outline-none text-slate-700"
                        style={{ focusRingColor: gradientColors.middle }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save and Reset Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={resetForm}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm hover:shadow text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Form
            </button>
            <button
              onClick={saveData}
              className="flex items-center justify-center gap-2 px-5 py-2.5 text-white rounded-lg transition-all hover:opacity-90 hover:shadow-md text-sm"
              style={{ 
                background: `linear-gradient(135deg, ${gradientColors.middle}, ${gradientColors.end})`,
              }}
            >
              <Save className="w-4 h-4" />
              Save Data
            </button>
          </div>

          {/* Status Bar */}
         
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