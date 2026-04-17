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
  Eye,
  EyeOff,
  Hash
} from "lucide-react";

const For_M_Change_Ins_Form = () => {
  const navigate = useNavigate();

  // Get current date in DD.MM.YYYY format for header display only
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();
  const formattedDate = `${day}.${month}.${year}`;

  // Initial empty form state with separate partName and partNo
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

  // Form state - all fields initialized to empty strings
  const [formData, setFormData] = useState(initialFormState);
  
  // State for password visibility toggle (example of eye icon usage)
  const [showPreview, setShowPreview] = useState(false);

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

  // Handle form reset - sets all fields to empty strings
  const handleReset = () => {
    setFormData(initialFormState);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add current date to submitted data for reference
    const submitData = {
      ...formData,
      submissionDate: formattedDate
    };
    console.log("Form Submitted:", submitData);
    alert("Form data saved to console (F12 to view)");
    
    // Automatically reset the form after submission
    handleReset();
  };

  // Toggle preview mode (eye icon functionality)
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 p-4 font-sans">
      {/* Main Form Card - smaller width */}
      <div className="max-w-4xl mx-auto">
        {/* Back Button with icon - just above the form */}
        <div className="mb-3 flex justify-between items-center">
          <button
            onClick={() => navigate("/production-hub")}
            className="inline-flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors text-sm font-medium bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-red-200 shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Production Hub
          </button>
          
          {/* Eye icon for preview toggle */}
          <button
            type="button"
            onClick={togglePreview}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors text-sm font-medium bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:shadow-md"
            title={showPreview ? "Hide preview" : "Show preview"}
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPreview ? "Hide Preview" : "Preview"}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-red-200 overflow-hidden transition-all duration-300 hover:shadow-2xl">
            {/* Header with darker red gradient - responsive date positioning */}
            <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-5 border-b border-red-300">
              {/* Desktop layout: title left, date right */}
              <div className="hidden sm:flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <ClipboardList className="h-6 w-6 text-white/90" />
                  <h1 className="text-xl md:text-2xl font-bold text-white">
                    4M CHANGE INSPECTION REPORT
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-white font-semibold text-base bg-red-700/40 px-4 py-1.5 rounded-full border border-white/30 shadow-sm">
                  <Calendar className="h-4 w-4" />
                  {formattedDate}
                </div>
              </div>
              
              {/* Mobile layout: title above, date below */}
              <div className="sm:hidden flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-white/90" />
                  <h1 className="text-xl font-bold text-white text-center">
                    4M CHANGE INSPECTION REPORT
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-white font-semibold text-base bg-red-700/40 px-4 py-1.5 rounded-full border border-white/30 shadow-sm">
                  <Calendar className="h-4 w-4" />
                  {formattedDate}
                </div>
              </div>
            </div>

            {/* Preview Panel - shown when eye icon is toggled */}
            {showPreview && (
              <div className="bg-red-50/80 backdrop-blur-sm px-6 py-4 border-b border-red-200 animate-pulse">
                <div className="flex items-center gap-2 text-red-600 mb-2">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm font-semibold">Live Preview Mode</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white/80 p-2 rounded border border-red-100">
                    <span className="text-gray-500">Part Name:</span>
                    <span className="ml-1 font-medium text-red-600">{formData.partName || "—"}</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded border border-red-100">
                    <span className="text-gray-500">Part No:</span>
                    <span className="ml-1 font-medium text-red-600">{formData.partNo || "—"}</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded border border-red-100">
                    <span className="text-gray-500">Operation:</span>
                    <span className="ml-1 font-medium text-red-600">{formData.operation || "—"}</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded border border-red-100">
                    <span className="text-gray-500">Lot/Ok/Rej:</span>
                    <span className="ml-1 font-medium text-red-600">{formData.lotQty || "0"}/{formData.okQty || "0"}/{formData.rejQty || "0"}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Form Body - compact input fields */}
            <div className="p-6 space-y-6">
              {/* Row 1: Part Name and Part No with icons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 group">
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                    <Package className="h-3 w-3 text-red-400" />
                    PART NAME
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="partName"
                      value={formData.partName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 pl-8 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-200 bg-white text-sm text-slate-700 transition-all group-hover:border-red-300"
                      placeholder="Enter part name"
                    />
                    <Package className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-1 group">
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                    <Hash className="h-3 w-3 text-red-400" />
                    PART NO.
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="partNo"
                      value={formData.partNo}
                      onChange={handleChange}
                      className="w-full px-3 py-2 pl-8 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-200 bg-white text-sm text-slate-700 transition-all group-hover:border-red-300"
                      placeholder="Enter part number"
                    />
                    <Hash className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Row 2: Operation */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="space-y-1 group">
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                    <Wrench className="h-3 w-3 text-red-400" />
                    OPERATION
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="operation"
                      value={formData.operation}
                      onChange={handleChange}
                      className="w-full px-3 py-2 pl-8 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-200 bg-white text-sm text-slate-700 transition-all group-hover:border-red-300"
                      placeholder="Enter operation"
                    />
                    <Wrench className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Row 3: Quantity & Specs with icons */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1 group">
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                    <Layers className="h-3 w-3 text-red-400" />
                    LOT QTY
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="lotQty"
                      value={formData.lotQty}
                      onChange={handleChange}
                      className="w-full px-3 py-2 pl-8 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-200 bg-white text-sm text-slate-700"
                      placeholder="e.g. 100"
                    />
                    <Layers className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-1 group">
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    OK QTY
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="okQty"
                      value={formData.okQty}
                      onChange={handleChange}
                      className="w-full px-3 py-2 pl-8 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-200 bg-white text-sm text-slate-700"
                      placeholder="e.g. 95"
                    />
                    <CheckCircle className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-1 group">
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                    <XCircle className="h-3 w-3 text-red-500" />
                    REJ.QTY
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="rejQty"
                      value={formData.rejQty}
                      onChange={handleChange}
                      className="w-full px-3 py-2 pl-8 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-200 bg-white text-sm text-slate-700"
                      placeholder="e.g. 5"
                    />
                    <XCircle className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-1 group">
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                    <Gauge className="h-3 w-3 text-red-400" />
                    PARAMETER/SPECS
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="paramSpec"
                      value={formData.paramSpec}
                      onChange={handleChange}
                      className="w-full px-3 py-2 pl-8 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-200 bg-white text-sm text-slate-700"
                      placeholder="Enter specs"
                    />
                    <Gauge className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Row 4: Before (Retroactive) - 5 fields with icons */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 border-b border-red-200 pb-1 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-red-500" />
                  BEFORE (RETROACTIVE)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <div key={`before-${index}`} className="space-y-1 group">
                      <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold">
                          {index + 1}
                        </span>
                      </label>
                      <input
                        type="text"
                        value={formData.before[index]}
                        onChange={(e) => handleArrayChange('before', index, e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-200 bg-white text-sm text-slate-700"
                        placeholder={`Value ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 5: After / Setup Approval - 5 fields with icons */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 border-b border-red-200 pb-1 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  AFTER / SETUP APPROVAL
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <div key={`after-${index}`} className="space-y-1 group">
                      <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[10px] font-bold">
                          {index + 1}
                        </span>
                      </label>
                      <input
                        type="text"
                        value={formData.after[index]}
                        onChange={(e) => handleArrayChange('after', index, e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-200 bg-white text-sm text-slate-700"
                        placeholder={`Value ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 6: Inspector and Remarks with icons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 group">
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                    <User className="h-3 w-3 text-red-400" />
                    INSP. BY
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="inspBy"
                      value={formData.inspBy}
                      onChange={handleChange}
                      className="w-full px-3 py-2 pl-8 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-200 bg-white text-sm text-slate-700"
                      placeholder="Inspector name"
                    />
                    <User className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-1 group">
                  <label className="text-xs font-semibold text-gray-600 flex items-center gap-1">
                    <MessageSquare className="h-3 w-3 text-red-400" />
                    REMARKS
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleChange}
                      className="w-full px-3 py-2 pl-8 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-200 bg-white text-sm text-slate-700"
                      placeholder="Any remarks"
                    />
                    <MessageSquare className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Form Actions with icons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 bg-gray-100 text-slate-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-all shadow-sm font-medium border border-gray-300"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Form
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md font-medium"
                >
                  <Send className="h-4 w-4" />
                  Submit Inspection Report
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