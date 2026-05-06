import React, { useState } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  Send, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  FileText, 
  User, 
  Wrench, 
  Cpu, 
  MapPin, 
  Clock 
} from 'lucide-react';

const WhyToolAnalysisForm = () => {
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

  const initialFormState = {
    problem: '', 
    operationName: '', 
    month: getCurrentMonth(),
    problemLocation: '', 
    problemAttendedBy: '', 
    dateOfOccurrence: getCurrentDate(),
    toolName: '', 
    machineNo: '',
    causeMachine: '', 
    causeMan: '', 
    causeMethod: '', 
    causeMaterial: '',
    simulation: ['', '', '', ''],
    why1: '', why2: '', why3: '', why4: '', why5: '',
    correctiveAction: '',
    preventiveAction: '',
    targetDate: '',
    actualDate: '',
    horizontalDeployment: '',
    documentNumberRevised: '',
    verificationCorrectiveAction: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSimulationChange = (index, value) => {
    const newSimulation = [...formData.simulation];
    newSimulation[index] = value;
    setFormData((prev) => ({ ...prev, simulation: newSimulation }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.problem || !formData.operationName || !formData.problemLocation || !formData.toolName) {
      alert("Please fill all required fields");
      return;
    }
    
    console.log("Form Submitted Data:", formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setFormData(initialFormState);
  };

  const handleReset = () => {
    if (window.confirm("Clear all fields?")) {
      setFormData(initialFormState);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 font-sans">
      
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        
        {/* Back Button */}
        <div className="mb-4">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200 text-gray-700 font-medium text-sm"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
        </div>

        {/* Header Gradient Card */}
        <div className="mb-6 bg-gradient-to-r from-red-600 via-red-500 to-pink-500 rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-6 md:px-8 md:py-7">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Why-Why Analysis Report
            </h1>
            <p className="text-sm text-red-100 mt-2">Root Cause Analysis Tool</p>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-sm flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="font-medium">Analysis report submitted successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          
          {/* Header Information Grid */}
          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text text-transparent mb-5 flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-500" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase mb-2">
                  <AlertCircle className="w-3.5 h-3.5" />
                  PROBLEM <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="problem"
                  value={formData.problem}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none text-gray-700 text-sm transition-all placeholder:text-gray-400"
                  placeholder="Enter problem description"
                  required
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase mb-2">
                  <FileText className="w-3.5 h-3.5" />
                  OPERATION NAME <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="operationName"
                  value={formData.operationName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none text-gray-700 text-sm transition-all placeholder:text-gray-400"
                  placeholder="Enter operation name"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  MONTH
                </label>
                <input
                  type="text"
                  name="month"
                  value={formData.month}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 text-sm cursor-default"
                  readOnly
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  PROBLEM LOCATION <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="problemLocation"
                  value={formData.problemLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none text-gray-700 text-sm transition-all placeholder:text-gray-400"
                  placeholder="Enter problem location"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase mb-2">
                  <User className="w-3.5 h-3.5" />
                  PROBLEM ATTENDED BY
                </label>
                <input
                  type="text"
                  name="problemAttendedBy"
                  value={formData.problemAttendedBy}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none text-gray-700 text-sm transition-all placeholder:text-gray-400"
                  placeholder="Name of person"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  DATE OF OCCURRENCE
                </label>
                <input
                  type="text"
                  name="dateOfOccurrence"
                  value={formData.dateOfOccurrence}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 text-sm cursor-default"
                  readOnly
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase mb-2">
                  <Wrench className="w-3.5 h-3.5" />
                  TOOL NAME <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="toolName"
                  value={formData.toolName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none text-gray-700 text-sm transition-all placeholder:text-gray-400"
                  placeholder="Enter tool name"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase mb-2">
                  <Cpu className="w-3.5 h-3.5" />
                  MACHINE NO.
                </label>
                <input
                  type="text"
                  name="machineNo"
                  value={formData.machineNo}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none text-gray-700 text-sm transition-all placeholder:text-gray-400"
                  placeholder="Enter machine number"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase mb-2">
                  <FileText className="w-3.5 h-3.5" />
                  DOCUMENT NUMBER
                </label>
                <input
                  type="text"
                  value="AOTPL-F-TM-08"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 text-sm cursor-default"
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            
            {/* Cause and Effect Analysis */}
            <div>
              <h2 className="text-base font-bold bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text text-transparent mb-4 flex items-center gap-2 border-l-4 border-red-400 pl-3">
                Cause and Effect Analysis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {['Machine', 'Man', 'Method', 'Material'].map((cat) => (
                  <div key={cat} className="bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-sm transition-all">
                    <label className="text-xs font-bold text-red-600 uppercase block mb-3">{cat}</label>
                    <textarea 
                      name={`cause${cat}`}
                      value={formData[`cause${cat}`]}
                      onChange={handleChange}
                      className="w-full bg-white text-gray-700 text-sm focus:outline-none resize-none placeholder:text-gray-400 rounded-lg"
                      rows="3"
                      placeholder={`Enter ${cat.toLowerCase()} related causes...`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Simulation Study */}
            <div>
              <h2 className="text-base font-bold bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text text-transparent mb-4 flex items-center gap-2 border-l-4 border-red-400 pl-3">
                Simulation Study
              </h2>
              <div className="space-y-3">
                {formData.simulation.map((val, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="flex-none w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white flex items-center justify-center font-bold text-sm shadow-md">{i + 1}</span>
                    <input 
                      className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 text-sm focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition placeholder:text-gray-400" 
                      value={val} 
                      onChange={(e) => handleSimulationChange(i, e.target.value)}
                      placeholder={`Simulation step ${i + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Why-Why Analysis */}
            <div>
              <h2 className="text-base font-bold bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text text-transparent mb-4 flex items-center gap-2 border-l-4 border-red-400 pl-3">
                Why-Why Analysis for Occurrence of Problem
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="bg-gray-50 p-3 rounded-xl border border-gray-200 hover:border-red-300 hover:shadow-sm transition-all">
                    <div className="text-xs font-bold text-red-600 mb-3 bg-gradient-to-r from-red-100 to-pink-100 px-3 py-1.5 rounded-lg inline-block">WHY-{i}</div>
                    <textarea 
                      className="w-full bg-white text-gray-700 text-sm focus:outline-none min-h-[100px] resize-none placeholder:text-gray-400 rounded-lg"
                      value={formData[`why${i}`]}
                      onChange={(e) => handleChange({ target: { name: `why${i}`, value: e.target.value } })}
                      placeholder={`Analysis...`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Corrective & Preventive Actions with Dates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-red-600 uppercase mb-2">Corrective Action</label>
                  <textarea 
                    name="correctiveAction" 
                    value={formData.correctiveAction} 
                    onChange={handleChange} 
                    className="w-full p-3 bg-white text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none placeholder:text-gray-400" 
                    rows="3"
                    placeholder="Describe corrective actions taken..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-red-600 uppercase mb-2">Target Date</label>
                  <input
                    type="date"
                    name="targetDate"
                    value={formData.targetDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none text-gray-700 text-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-red-600 uppercase mb-2">Preventive Action</label>
                  <textarea 
                    name="preventiveAction" 
                    value={formData.preventiveAction} 
                    onChange={handleChange} 
                    className="w-full p-3 bg-white text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none placeholder:text-gray-400" 
                    rows="3"
                    placeholder="Describe preventive actions taken..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-red-600 uppercase mb-2">Actual Date</label>
                  <input
                    type="date"
                    name="actualDate"
                    value={formData.actualDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none text-gray-700 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Horizontal Deployment & Document Revision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-red-600 uppercase mb-2">Horizontal Deployment (If any)</label>
                <textarea 
                  name="horizontalDeployment" 
                  value={formData.horizontalDeployment} 
                  onChange={handleChange} 
                  className="w-full p-3 bg-white text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none placeholder:text-gray-400" 
                  rows="2"
                  placeholder="Any horizontal deployment..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-red-600 uppercase mb-2">Document Number Revised for Identification</label>
                <input
                  type="text"
                  name="documentNumberRevised"
                  value={formData.documentNumberRevised}
                  onChange={handleChange}
                  placeholder="e.g., AOTPL-F-TM-09"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none text-gray-700 text-sm placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Verification of Corrective Action */}
            <div>
              <label className="block text-xs font-bold text-red-600 uppercase mb-2">Verification of Corrective Action</label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="verificationCorrectiveAction" 
                    value="OK"
                    checked={formData.verificationCorrectiveAction === 'OK'}
                    onChange={handleChange}
                    className="w-4 h-4 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-gray-700 text-sm font-medium">OK</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="verificationCorrectiveAction" 
                    value="NG"
                    checked={formData.verificationCorrectiveAction === 'NG'}
                    onChange={handleChange}
                    className="w-4 h-4 text-red-500 focus:ring-red-500"
                  />
                  <span className="text-gray-700 text-sm font-medium">NG</span>
                </label>
              </div>
            </div>

            {/* Checked By & Verified By */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-xs font-bold text-red-600 uppercase mb-2">Checked By</label>
                <input
                  type="text"
                  placeholder="Name / Signature"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none text-gray-700 text-sm placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-red-600 uppercase mb-2">Verified By</label>
                <input
                  type="text"
                  placeholder="Name / Signature"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none text-gray-700 text-sm placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
              >
                <RotateCcw size={18} /> Reset Data
              </button>
              
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition transform active:scale-95"
              >
                <Send size={18} /> Submit Report
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WhyToolAnalysisForm;