import React, { useState } from 'react'
import { 
  ArrowLeft, Save, RotateCcw, Calendar, User, Package, 
  Hash, Settings, Cpu
} from 'lucide-react'

const DailyProdForm = () => {
  // Mock data for dropdowns
  const partNames = [
    'Engine Piston A123 (Premium)',
    'Crankshaft B456 (Forged)',
    'Connecting Rod C789 (H-Beam)',
    'Cylinder Head D012 (Aluminum)',
    'Oil Pump E345 (High-Flow)',
    'Water Pump F678 (Electric)',
    'Timing Belt G901 (Racing)',
    'Alternator H234 (High-Output)',
    'Starter Motor I567 (Heavy-Duty)',
    'Fuel Injector J890 (Performance)'
  ]

  const operationNames = [
    'CNC Precision Turning',
    '5-Axis Milling Operation',
    'Micro Drilling & Tapping',
    'Surface Grinding - Finish',
    'Heat Treatment - Annealing',
    'Assembly Line 1 - Main',
    'Quality Control - Final',
    'Laser Welding Process',
    'Polishing - Mirror Finish',
    'Packaging - Export Grade'
  ]

  // Form state - Only 5 fields
  const [formData, setFormData] = useState({
    operatorName: '',
    partName: '',
    partNo: '',
    operationName: '',
    machineNo: ''
  })

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleReset = () => {
    setFormData({
      operatorName: '',
      partName: '',
      partNo: '',
      operationName: '',
      machineNo: ''
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const requiredFields = ['operatorName', 'partName', 'partNo', 'operationName']
    const missingFields = requiredFields.filter(field => !formData[field])
    
    if (missingFields.length > 0) {
      alert('Please fill all required fields')
      return
    }

    const submissionData = {
      ...formData,
      submissionId: `PROD-${Date.now()}`,
      submittedAt: new Date().toLocaleString(),
      shift: new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Night'
    }

    console.log('Production Data:', submissionData)
    alert('Production plan saved successfully!')
    handleReset()
  }

  const handleBack = () => {
    window.location.href = '/production-hub';
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 flex justify-center">
      <div className="w-full max-w-7xl">
        {/* Main Form Container */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Back Icon Button - Above Main Heading */}
          <div className="px-4 sm:px-6 pt-4 sm:pt-6">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors font-medium"
            >
              <ArrowLeft size={18} />
              Back to Production Page
            </button>
          </div>

          {/* Header - Responsive with date next to heading */}
          <div className="border-b border-slate-200 px-4 sm:px-6 pb-4 bg-slate-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#3b82f5]/10 rounded-lg flex-shrink-0">
                  <Package size={24} className="text-[#3b82f5]" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold text-blue-500">Daily Production Plan</h1>
                  <p className="text-xs text-slate-600">Manufacturing Execution System</p>
                </div>
              </div>
              
              {/* Date Display - Now next to heading on desktop */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-500 rounded-lg shadow-sm">
                  <Calendar size={14} className="text-blue-700" />
                  <span className="text-sm font-medium text-slate-600 whitespace-nowrap">
                    {new Date().toLocaleDateString('en-GB', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            {/* All 5 fields in a single row - Responsive */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Operator Name */}
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <User size={14} className="inline mr-1 text-blue-500" />
                  Operator Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="operatorName"
                  value={formData.operatorName}
                  onChange={handleChange}
                  placeholder="Enter operator name"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400"
                />
              </div>

              {/* Part Name */}
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Package size={14} className="inline mr-1 text-blue-500" />
                  Part Name <span className="text-red-500">*</span>
                </label>
                <select
                  name="partName"
                  value={formData.partName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700"
                >
                  <option value="" className="text-slate-500">Select Part</option>
                  {partNames.map((part, index) => (
                    <option key={index} value={part} className="text-slate-700">{part}</option>
                  ))}
                </select>
              </div>

              {/* Part No */}
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Hash size={14} className="inline mr-1 text-blue-500" />
                  Part No <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="partNo"
                  value={formData.partNo}
                  onChange={handleChange}
                  placeholder="Enter part number"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400"
                />
              </div>

              {/* Operation Name */}
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Settings size={14} className="inline mr-1 text-blue-500" />
                  Operation Name <span className="text-red-500">*</span>
                </label>
                <select
                  name="operationName"
                  value={formData.operationName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700"
                >
                  <option value="" className="text-slate-500">Select Operation</option>
                  {operationNames.map((op, index) => (
                    <option key={index} value={op} className="text-slate-700">{op}</option>
                  ))}
                </select>
              </div>

              {/* Machine No */}
              <div className="flex-1 min-w-0">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Cpu size={14} className="inline mr-1 text-blue-500" />
                  Machine No
                </label>
                <input
                  type="text"
                  name="machineNo"
                  value={formData.machineNo}
                  onChange={handleChange}
                  placeholder="Enter machine number"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-4 py-2 text-sm border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <RotateCcw size={14} />
                Reset
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 text-sm bg-[#3b82f5] text-white rounded-lg hover:bg-[#2563eb] transition-colors flex items-center justify-center gap-2 font-medium shadow-sm"
              >
                <Save size={14} />
                Save Production Plan
              </button>
            </div>

            {/* Required Fields Note */}
            <p className="text-xs text-slate-400 mt-3 text-center sm:text-left">
              <span className="text-red-500">*</span> Required fields
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default DailyProdForm