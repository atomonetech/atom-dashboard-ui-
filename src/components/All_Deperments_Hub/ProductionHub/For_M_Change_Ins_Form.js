import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar,
  Package,
  Wrench,
  Layers,
  CheckCircle,
  XCircle,
  Gauge,
  ClipboardList,
  User,
  MessageSquare,
  RotateCcw,
  Send,
  Hash,
  Loader2
} from "lucide-react";

const For_M_Change_Ins_Form = () => {
  const navigate = useNavigate();

  // Get current date in DD.MM.YYYY format for header display only
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();
  const formattedDate = `${day}.${month}.${year}`;

  // Initial empty form state
  const initialFormState = {
    partName: "",
    partNo: "",
    operation: "",
    lotQty: "",
    okQty: "",
    rejQty: "",
    paramSpec: "",
    before: ["", "", "", "", ""],
    after: ["", "", "", "", ""],
    inspBy: "",
    remarks: ""
  };

  // Form states
  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle before/after array changes
  const handleArrayChange = (section, index, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => i === index ? value : item)
    }));
  };

  // Handle form reset
  const handleReset = () => {
    setFormData(initialFormState);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // React State ko Django Fields mein map karna
    const payload = {
      part_name: formData.partName,
      part_no: formData.partNo,
      operation: formData.operation,
      lot_qty: formData.lotQty ? parseInt(formData.lotQty) : null,
      ok_qty: formData.okQty ? parseInt(formData.okQty) : null,
      rej_qty: formData.rejQty ? parseInt(formData.rejQty) : null,
      parameter_specs: formData.paramSpec,
      
      // Before Array Mapping
      before_1: formData.before[0],
      before_2: formData.before[1],
      before_3: formData.before[2],
      before_4: formData.before[3],
      before_5: formData.before[4],
      
      // After Array Mapping
      after_1: formData.after[0],
      after_2: formData.after[1],
      after_3: formData.after[2],
      after_4: formData.after[3],
      after_5: formData.after[4],
      
      inspected_by: formData.inspBy,
      remarks: formData.remarks
    };

    setIsLoading(true);

    try {
      // Django API ko hit karna
      const response = await fetch('http://127.0.0.1:8000/api/save-4m-change/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Success
        alert(result.message);
        handleReset(); // Form clear karna
      } else {
        // Backend Validation Error
        console.error('Backend Error:', result);
        alert('Error saving data: ' + (result.error || 'Please check console.'));
      }
    } catch (error) {
      // Network Error
      console.error('Network Error:', error);
      alert('Failed to connect to the server. Make sure Django is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 p-4 font-sans">
      {/* Main Form Card */}
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <div className="mb-3 flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate("/production-hub")}
            className="inline-flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors text-sm font-medium bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-red-200 shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Production Hub
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-red-200 overflow-hidden transition-all duration-300 hover:shadow-2xl">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-5 border-b border-red-300">
              <div className="hidden sm:flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <ClipboardList className="h-6 w-6 text-white/90" />
                  <h1 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                    4M CHANGE INSPECTION REPORT
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-white font-semibold text-base bg-red-700/40 px-4 py-1.5 rounded-full border border-white/30 shadow-sm">
                  <Calendar className="h-4 w-4" />
                  {formattedDate}
                </div>
              </div>
              
              <div className="sm:hidden flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-white/90" />
                  <h1 className="text-xl font-bold text-white text-center tracking-wide">
                    4M CHANGE INSPECTION REPORT
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-white font-semibold text-base bg-red-700/40 px-4 py-1.5 rounded-full border border-white/30 shadow-sm">
                  <Calendar className="h-4 w-4" />
                  {formattedDate}
                </div>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6 space-y-6">
              
              {/* Row 1: Part Name and Part No */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">
                    <Package className="inline h-3 w-3 mr-1 text-red-500" />
                    Part Name
                  </label>
                  <input
                    type="text"
                    name="partName"
                    value={formData.partName}
                    onChange={handleChange}
                    placeholder="Enter part name"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-700 placeholder-slate-400"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">
                    <Hash className="inline h-3 w-3 mr-1 text-red-500" />
                    Part No.
                  </label>
                  <input
                    type="text"
                    name="partNo"
                    value={formData.partNo}
                    onChange={handleChange}
                    placeholder="Enter part number"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-700 placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Row 2: Operation */}
              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">
                  <Wrench className="inline h-3 w-3 mr-1 text-red-500" />
                  Operation
                </label>
                <input
                  type="text"
                  name="operation"
                  value={formData.operation}
                  onChange={handleChange}
                  placeholder="Enter operation"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-700 placeholder-slate-400"
                />
              </div>

              {/* Row 3: Quantities & Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="flex flex-col">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">
                    <Layers className="inline h-3 w-3 mr-1 text-red-500" />
                    Lot Qty
                  </label>
                  <input type="number" name="lotQty" value={formData.lotQty} onChange={handleChange} placeholder="e.g. 100" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder-slate-400" />
                </div>
                <div className="flex flex-col">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">
                    <CheckCircle className="inline h-3 w-3 mr-1 text-green-500" />
                    OK Qty
                  </label>
                  <input type="number" name="okQty" value={formData.okQty} onChange={handleChange} placeholder="e.g. 95" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder-slate-400" />
                </div>
                <div className="flex flex-col">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">
                    <XCircle className="inline h-3 w-3 mr-1 text-red-500" />
                    Rej. Qty
                  </label>
                  <input type="number" name="rejQty" value={formData.rejQty} onChange={handleChange} placeholder="e.g. 5" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder-slate-400" />
                </div>
                <div className="flex flex-col">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">
                    <Gauge className="inline h-3 w-3 mr-1 text-red-500" />
                    Parameter/Specs
                  </label>
                  <input type="text" name="paramSpec" value={formData.paramSpec} onChange={handleChange} placeholder="Enter specs" className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder-slate-400" />
                </div>
              </div>

              {/* Row 4: Before (Retroactive) */}
              <div>
                <div className="flex items-center gap-2 border-b border-red-200 pb-2 mb-4">
                  <Layers className="h-4 w-4 text-red-500" />
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">BEFORE (RETROACTIVE)</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <div key={`before-${index}`} className="flex flex-col relative">
                      <span className="absolute -top-2 left-2 bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={formData.before[index]}
                        onChange={(e) => handleArrayChange('before', index, e.target.value)}
                        placeholder={`Value ${index + 1}`}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-700 placeholder-slate-400 mt-1"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 5: After / Setup Approval */}
              <div>
                <div className="flex items-center gap-2 border-b border-green-200 pb-2 mb-4">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">AFTER / SETUP APPROVAL</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <div key={`after-${index}`} className="flex flex-col relative">
                      <span className="absolute -top-2 left-2 bg-green-100 text-green-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full z-10">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={formData.after[index]}
                        onChange={(e) => handleArrayChange('after', index, e.target.value)}
                        placeholder={`Value ${index + 1}`}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-slate-700 placeholder-slate-400 mt-1"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 6: Inspector and Remarks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">
                    <User className="inline h-3 w-3 mr-1 text-red-500" />
                    Insp. By
                  </label>
                  <input
                    type="text"
                    name="inspBy"
                    value={formData.inspBy}
                    onChange={handleChange}
                    placeholder="Inspector name"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-700 placeholder-slate-400"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase">
                    <MessageSquare className="inline h-3 w-3 mr-1 text-red-500" />
                    Remarks
                  </label>
                  <input
                    type="text"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder="Any remarks"
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-700 placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isLoading}
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-[#f8f9fa] text-slate-700 px-5 py-2.5 rounded-lg hover:bg-slate-100 transition-all font-medium border border-slate-300 text-sm disabled:opacity-50"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-[#e03131] text-white px-5 py-2.5 rounded-lg hover:bg-[#c92a2a] transition-all shadow-sm font-medium text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {isLoading ? 'Submitting...' : 'Submit Inspection Report'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default For_M_Change_Ins_Form;