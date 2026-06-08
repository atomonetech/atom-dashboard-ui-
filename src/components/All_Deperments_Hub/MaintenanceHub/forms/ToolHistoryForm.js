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
  const gradientColors = {
    start: '#4158D0',
    middle: '#C850C0',
    end: '#FFCC70'
  };

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '.');

  const getCurrentDateForInput = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const initialToolInfo = {
    customerName: '',
    partName: '',
    partNo: '',
    toolName: '',
    model: '',
    estimatedToolLife: '',
    estimatedMaintenanceFrequency: ''
  };

  const [toolInfo, setToolInfo] = useState(initialToolInfo);
  const [historyRecord, setHistoryRecord] = useState({
    date: getCurrentDateForInput(),
    prod: '',
    resharpeningStroke: '',
    cumulativeProd: '',
    problemReported: '',
    actionTaken: '',
    updatedIn4M: '',
    remarks: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [partNames, setPartNames] = useState([]);
  const [preparedBy, setPreparedBy] = useState("");

  // 1. Fetch Customers on Component Load
  useEffect(() => {
    fetch('http://192.168.0.34:8000/api/master-dropdown/?filter=customer')
      .then(res => res.json())
      .then(data => setCustomers(data))
      .catch(err => console.error("Error fetching customers:", err));
  }, []);

  // 2. Handle Customer Change -> Fetch Part Names
  const handleCustomerChange = async (e) => {
    const cust = e.target.value;
    setToolInfo(prev => ({ ...prev, customerName: cust, partName: '', partNo: '', model: '' }));
    
    if (cust) {
      try {
        const res = await fetch(`http://192.168.0.34:8000/api/master-dropdown/?filter=part&cust=${encodeURIComponent(cust)}`);
        const data = await res.json();
        setPartNames(data);
      } catch (err) {
        console.error("Error fetching parts:", err);
      }
    } else {
      setPartNames([]);
    }
  };

  // 3. Handle Part Name Change -> Fetch Part No AND Model Auto-fill
  const handlePartNameChange = async (e) => {
    const part = e.target.value;
    setToolInfo(prev => ({ ...prev, partName: part, partNo: '', model: '' }));

    if (part) {
      try {
        const resNo = await fetch(`http://192.168.0.34:8000/api/master-dropdown/?filter=part_no&part=${encodeURIComponent(part)}`);
        const dataNo = await resNo.json();
        
        const resModel = await fetch(`http://192.168.0.34:8000/api/master-dropdown/?filter=model_by_part&part=${encodeURIComponent(part)}`);
        const dataModel = await resModel.json();
        
        setToolInfo(prev => ({ 
          ...prev, 
          partNo: (dataNo && dataNo.length > 0) ? dataNo[0] : '',
          model: (dataModel && dataModel.length > 0) ? dataModel[0] : ''
        }));
      } catch (err) {
        console.error("Error fetching part details:", err);
      }
    }
  };

  const handleToolInfoChange = (e) => {
    const { name, value } = e.target;
    setToolInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleHistoryRecordChange = (field, value) => {
    setHistoryRecord(prev => ({ ...prev, [field]: value }));
  };

  // Validation function with Native Alert
  const validateForm = () => {
    const requiredToolFields = ['customerName', 'partName', 'partNo', 'toolName'];
    for (const field of requiredToolFields) {
      if (!toolInfo[field]?.trim()) {
        window.alert(`⚠️ Attention! Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    return true;
  };

  const saveData = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);

    const formData = {
      toolInformation: toolInfo,
      historyRecord: historyRecord,
      filledDate: getCurrentDateForInput(),
    };

    try {
      const response = await fetch('http://192.168.0.34:8000/api/tool-history/save/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // 🔥 NATIVE SUCCESS POPUP 🔥
        window.alert('✅ Success! Tool History Record saved successfully in the database.');
        setToolInfo(initialToolInfo);
        setHistoryRecord({
          date: getCurrentDateForInput(),
          prod: '', resharpeningStroke: '', cumulativeProd: '', 
          problemReported: '', actionTaken: '', updatedIn4M: '', remarks: ''
        });
        setPartNames([]); 
      } else {
        // 🔥 NATIVE ERROR POPUP 🔥
        window.alert('❌ Error! Failed to save data: ' + (result.error || 'Please try again.'));
      }
    } catch (error) {
      // 🔥 NATIVE NETWORK ERROR POPUP 🔥
      window.alert('❌ Network Error! Could not connect to the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    // 🔥 NATIVE CONFIRM POPUP 🔥
    if (window.confirm('Are you sure you want to reset all form data?')) {
      setToolInfo(initialToolInfo);
      setHistoryRecord({
        date: getCurrentDateForInput(),
        prod: '', resharpeningStroke: '', cumulativeProd: '', 
        problemReported: '', actionTaken: '', updatedIn4M: '', remarks: ''
      });
      setPartNames([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-3 px-3 sm:py-4 sm:px-4 md:py-6 font-sans relative">
      <div className="w-full max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div 
            className="px-4 py-3 sm:px-5 sm:py-4"
            style={{ background: `linear-gradient(135deg, ${gradientColors.start}, ${gradientColors.middle}, ${gradientColors.end})` }}
          >
            <div className="mb-3 sm:mb-4">
              <button 
                className="inline-flex items-center gap-1.5 text-white hover:text-white/90 transition-all rounded-lg bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 group"
                onClick={() => window.location.href = '/Maintenance/Tool/daily'}
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:-translate-x-1" />
                <span className="text-xs sm:text-sm font-medium">Back to Maintenance Hub</span>
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <History className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white drop-shadow-lg" />
                <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white drop-shadow-lg">
                  TOOL HISTORY CARD
                </h1>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                <span className="text-xs sm:text-sm md:text-base text-white font-semibold">
                  {currentDate}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 md:p-6 lg:p-8">
            <div className="mb-6 sm:mb-7 md:mb-8">
              <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-3 pb-2 border-b-2" style={{ borderBottomColor: gradientColors.middle }}>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4158D0] to-[#C850C0]">
                  Tool Information
                </span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-600 uppercase mb-1.5">
                      <Users className="w-3.5 h-3.5" style={{ color: gradientColors.middle }} />
                      CUSTOMER NAME <span className="text-red-500">*</span>
                    </label>
                    <select 
                      name="customerName"
                      value={toolInfo.customerName}
                      onChange={handleCustomerChange}
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 text-sm focus:bg-white focus:border-[#4158D0] outline-none transition-all text-slate-700 cursor-pointer"
                    >
                      <option value="">-- Select Customer --</option>
                      {customers.map((c, i) => <option key={i} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-600 uppercase mb-1.5">
                      <Link className="w-3.5 h-3.5" style={{ color: gradientColors.middle }} />
                      PART NAME <span className="text-red-500">*</span>
                    </label>
                    <select 
                      name="partName"
                      value={toolInfo.partName}
                      onChange={handlePartNameChange}
                      disabled={!toolInfo.customerName}
                      className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 text-sm focus:bg-white focus:border-[#4158D0] outline-none transition-all text-slate-700 cursor-pointer disabled:opacity-60"
                    >
                      <option value="">-- Select Part Name --</option>
                      {partNames.map((p, i) => <option key={i} value={p}>{p}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-600 uppercase mb-1.5">
                      <Hash className="w-3.5 h-3.5" style={{ color: gradientColors.middle }} />
                      PART NO. <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="partNo"
                      value={toolInfo.partNo}
                      readOnly
                      className="w-full bg-slate-100 border-2 border-slate-200 rounded-lg p-2.5 text-sm outline-none text-slate-500 cursor-not-allowed"
                      placeholder="Auto-filled part number"
                    />
                  </div>

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
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-slate-600 uppercase mb-1.5">
                      <Package className="w-3.5 h-3.5" style={{ color: gradientColors.middle }} />
                      MODEL
                    </label>
                    <input 
                      type="text" 
                      name="model"
                      value={toolInfo.model}
                      readOnly
                      className="w-full bg-slate-100 border-2 border-slate-200 rounded-lg p-2.5 text-sm outline-none text-slate-500 cursor-not-allowed"
                      placeholder="Auto-filled model"
                    />
                  </div>

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

            <div className="mb-6 sm:mb-7 md:mb-8">
              <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-3 pb-2 border-b-2" style={{ borderBottomColor: gradientColors.middle }}>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#4158D0] to-[#C850C0]">
                  Tool History Record
                </span>
              </h2>

              <div 
                className="border-2 border-slate-200 rounded-lg p-4 sm:p-5 shadow-sm"
                style={{ borderLeftColor: gradientColors.middle, borderLeftWidth: '4px' }}
              >
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-700 text-xs sm:text-sm uppercase tracking-wide">Current History Record</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
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
                          className="w-full bg-slate-50 border-2 border-slate-200 rounded-lg p-2.5 text-sm focus:bg-white focus:border-[#4158D0] outline-none transition-all text-slate-700 cursor-pointer"
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

           <div className="mt-6 sm:mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
  
  {/* Prepared By */}
  <div className="flex flex-col">
    <label className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
      Prepared By
    </label>
    <input
      type="text"
      value={preparedBy}
      onChange={(e) => setPreparedBy(e.target.value)}
      placeholder="Enter name"
      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full sm:w-64"
    />
  </div>

  {/* Buttons */}
  <div className="flex flex-col-reverse sm:flex-row gap-3">
    <button
      onClick={resetForm}
      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm hover:shadow text-xs sm:text-sm font-bold uppercase tracking-wide"
    >
      <RotateCcw className="w-3.5 h-3.5" />
      Clear Form
    </button>

    <button
      onClick={saveData}
      disabled={isSubmitting}
      className="flex items-center justify-center gap-2 px-5 py-2.5 text-white rounded-lg transition-all hover:opacity-90 hover:shadow-md text-xs sm:text-sm font-bold uppercase tracking-wide disabled:opacity-50"
      style={{
        background: `linear-gradient(135deg, ${gradientColors.middle}, ${gradientColors.end})`,
      }}
    >
      {isSubmitting ? (
        "Saving..."
      ) : (
        <>
          <Save className="w-3.5 h-3.5" />
          Save Data
        </>
      )}
    </button>
  </div>
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolHistoryForm;