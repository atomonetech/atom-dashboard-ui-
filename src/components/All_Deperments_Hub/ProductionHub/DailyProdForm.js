import React, { useState } from 'react'
import { 
  ArrowLeft, Save, RotateCcw, Calendar, User, Package, 
  Hash, Settings, Clock, Target, AlertCircle, RefreshCw,
  XCircle, CheckCircle, Wrench, Cpu, FileText, Activity
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

  // Form state - Now with 19 fields
  const [formData, setFormData] = useState({
    operatorName: '',
    partName: '',
    partNo: '',
    operationName: '',
    productionStartTime: '',
    productionEndTime: '',
    totalWorkingTime: '',
    totalProduction: '',
    totalProductionTarget: '',
    totalRejectionQty: '',
    totalReworkQty: '',
    notConfirmQty: '',
    okQuantity: '',
    toolSetupTime: '',
    machineBD: '',
    toolBDTime: '',
    coilNo: '',
    machineNo: '', // New field added
    remarks: ''
  })

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const updatedData = {
        ...prev,
        [name]: value
      }

      // Auto-calculate total working time when start or end time changes
      if (name === 'productionStartTime' || name === 'productionEndTime') {
        const start = name === 'productionStartTime' ? value : prev.productionStartTime
        const end = name === 'productionEndTime' ? value : prev.productionEndTime
        
        if (start && end) {
          const startTime = new Date(`2000-01-01T${start}`)
          const endTime = new Date(`2000-01-01T${end}`)
          const diffMinutes = Math.round((endTime - startTime) / 60000)
          
          if (diffMinutes > 0) {
            updatedData.totalWorkingTime = diffMinutes.toString()
          } else {
            updatedData.totalWorkingTime = ''
          }
        } else {
          updatedData.totalWorkingTime = ''
        }
      }

      return updatedData
    })
  }

  const handleReset = () => {
    setFormData({
      operatorName: '',
      partName: '',
      partNo: '',
      operationName: '',
      productionStartTime: '',
      productionEndTime: '',
      totalWorkingTime: '',
      totalProduction: '',
      totalProductionTarget: '',
      totalRejectionQty: '',
      totalReworkQty: '',
      notConfirmQty: '',
      okQuantity: '',
      toolSetupTime: '',
      machineBD: '',
      toolBDTime: '',
      coilNo: '',
      machineNo: '', // New field added
      remarks: ''
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
      totalProduction: formData.totalProduction ? parseInt(formData.totalProduction) : 0,
      totalProductionTarget: formData.totalProductionTarget ? parseInt(formData.totalProductionTarget) : 0,
      totalRejectionQty: formData.totalRejectionQty ? parseInt(formData.totalRejectionQty) : 0,
      totalReworkQty: formData.totalReworkQty ? parseInt(formData.totalReworkQty) : 0,
      notConfirmQty: formData.notConfirmQty ? parseInt(formData.notConfirmQty) : 0,
      okQuantity: formData.okQuantity ? parseInt(formData.okQuantity) : 0,
      toolSetupTime: formData.toolSetupTime ? parseInt(formData.toolSetupTime) : 0,
      machineBD: formData.machineBD ? parseInt(formData.machineBD) : 0,
      toolBDTime: formData.toolBDTime ? parseInt(formData.toolBDTime) : 0,
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
      <div className="w-full max-w-5xl">
        {/* Back Button */}
        <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-4 text-sm font-medium"  onClick={handleBack}>
          <ArrowLeft size={16} />
          Back to Production Page
        </button>

        {/* Main Form Container */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="border-b border-slate-200 px-6 py-4 bg-slate-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#3b82f5]/10 rounded-lg">
                  <Activity size={30} className="text-[#3b82f5]" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-blue-500">Daily Production Plan</h1>
                  <p className="text-xs text-slate-600">Manufacturing Execution System</p>
                </div>
              </div>
              
              {/* Date Display */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border border-blue-500 rounded-lg">
                  <Calendar size={14} className="text-blue-700" />
                  <span className="text-sm font-medium text-slate-600">
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
          <form onSubmit={handleSubmit} className="p-6">
            {/* Main Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Operator Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <User size={15} className="inline mr-1 text-blue-500" />
                  Operator Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="operatorName"
                  value={formData.operatorName}
                  onChange={handleChange}
                  placeholder="Enter operator name"
                  className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400"
                />
              </div>

              {/* Part Name - Darker Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Package size={15} className="inline mr-1 text-blue-500" />
                  Part Name <span className="text-red-500">*</span>
                </label>
                <select
                  name="partName"
                  value={formData.partName}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm bg-white border border-slate-400 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 font-medium"
                >
                  <option value="" className="text-slate-500">Select Part</option>
                  {partNames.map((part, index) => (
                    <option key={index} value={part} className="text-slate-700 font-medium py-2">{part}</option>
                  ))}
                </select>
              </div>

              {/* Part No */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Hash size={15} className="inline mr-1 text-blue-500" />
                  Part No <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="partNo"
                  value={formData.partNo}
                  onChange={handleChange}
                  placeholder="Enter part number"
                  className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400"
                />
              </div>

              {/* Operation Name - Darker Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Settings size={15} className="inline mr-1 text-blue-500" />
                  Operation Name <span className="text-red-500">*</span>
                </label>
                <select
                  name="operationName"
                  value={formData.operationName}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm bg-white border border-slate-400 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 font-medium"
                >
                  <option value="" className="text-slate-500">Select Operation</option>
                  {operationNames.map((op, index) => (
                    <option key={index} value={op} className="text-slate-700 font-medium py-2">{op}</option>
                  ))}
                </select>
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Clock size={15} className="inline mr-1 text-blue-500" />
                  Start Time
                </label>
                <input
                  type="time"
                  name="productionStartTime"
                  value={formData.productionStartTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700"
                />
              </div>

              {/* End Time */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Clock size={15} className="inline mr-1 text-blue-500" />
                  End Time
                </label>
                <input
                  type="time"
                  name="productionEndTime"
                  value={formData.productionEndTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700"
                />
              </div>

              {/* Working Time */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Clock size={15} className="inline mr-1 text-blue-500" />
                  Working Time (Min)
                </label>
                <input
                  type="text"
                  name="totalWorkingTime"
                  value={formData.totalWorkingTime}
                  readOnly
                  placeholder="Auto-calculated"
                  className="w-full px-3 py-2.5 text-sm bg-slate-100 border border-slate-300 rounded-lg text-slate-600 cursor-not-allowed placeholder-slate-400"
                />
              </div>

              {/* Total Production */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Target size={15} className="inline mr-1 text-blue-500" />
                  Total Production
                </label>
                <input
                  type="number"
                  name="totalProduction"
                  value={formData.totalProduction}
                  onChange={handleChange}
                  placeholder="Enter quantity"
                  className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400"
                />
              </div>

              {/* Total Production Target */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Target size={15} className="inline mr-1 text-blue-600" />
                  Total Production Target
                </label>
                <input
                  type="number"
                  name="totalProductionTarget"
                  value={formData.totalProductionTarget}
                  onChange={handleChange}
                  placeholder="Enter target"
                  className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400"
                />
              </div>

              {/* Machine No - New Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Cpu size={15} className="inline mr-1 text-blue-500" />
                  Machine No
                </label>
                <input
                  type="text"
                  name="machineNo"
                  value={formData.machineNo}
                  onChange={handleChange}
                  placeholder="Enter machine number"
                  className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Quality Control Section */}
            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={16} className="text-blue-500" />
                <h3 className="text-sm font-semibold text-blue-500">Quality Control Metrics</h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* OK Quantity */}
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                    <CheckCircle size={12} className="text-green-600" />
                    OK Quantity
                  </label>
                  <input
                    type="number"
                    name="okQuantity"
                    value={formData.okQuantity}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full text-sm bg-transparent border-0 border-b border-slate-200 focus:border-[#3b82f5] focus:ring-0 px-0 py-1 text-slate-700 placeholder-slate-300 font-medium"
                  />
                </div>

                {/* Rejection */}
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                    <XCircle size={12} className="text-red-500" />
                    Rejection
                  </label>
                  <input
                    type="number"
                    name="totalRejectionQty"
                    value={formData.totalRejectionQty}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full text-sm bg-transparent border-0 border-b border-slate-200 focus:border-[#3b82f5] focus:ring-0 px-0 py-1 text-slate-700 placeholder-slate-300 font-medium"
                  />
                </div>

                {/* Rework */}
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                    <RefreshCw size={12} className="text-yellow-600" />
                    Rework
                  </label>
                  <input
                    type="number"
                    name="totalReworkQty"
                    value={formData.totalReworkQty}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full text-sm bg-transparent border-0 border-b border-slate-200 focus:border-[#3b82f5] focus:ring-0 px-0 py-1 text-slate-700 placeholder-slate-300 font-medium"
                  />
                </div>

                {/* Not Confirm */}
                <div className="bg-white p-3 rounded-lg border border-slate-200">
                  <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center gap-1">
                    <AlertCircle size={12} className="text-orange-500" />
                    Not Confirm
                  </label>
                  <input
                    type="number"
                    name="notConfirmQty"
                    value={formData.notConfirmQty}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full text-sm bg-transparent border-0 border-b border-slate-200 focus:border-[#3b82f5] focus:ring-0 px-0 py-1 text-slate-700 placeholder-slate-300 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Additional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Tool Setup Time */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Wrench size={15} className="inline mr-1 text-blue-500" />
                  Tool Setup (Min)
                </label>
                <input
                  type="number"
                  name="toolSetupTime"
                  value={formData.toolSetupTime}
                  onChange={handleChange}
                  placeholder="Enter minutes"
                  className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400"
                />
              </div>

              {/* Machine B/D */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Cpu size={15} className="inline mr-1 text-blue-500" />
                  Machine B/D (Min)
                </label>
                <input
                  type="number"
                  name="machineBD"
                  value={formData.machineBD}
                  onChange={handleChange}
                  placeholder="Enter minutes"
                  className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400"
                />
              </div>

              {/* Tool B/D Time */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Wrench size={15} className="inline mr-1 text-blue-500" />
                  Tool B/D (Min)
                </label>
                <input
                  type="number"
                  name="toolBDTime"
                  value={formData.toolBDTime}
                  onChange={handleChange}
                  placeholder="Enter minutes"
                  className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Coil No and Remarks */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              {/* Coil No */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Hash size={15} className="inline mr-1 text-blue-500" />
                  Coil No
                </label>
                <input
                  type="text"
                  name="coilNo"
                  value={formData.coilNo}
                  onChange={handleChange}
                  placeholder="Enter coil number"
                  className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400"
                />
              </div>

              {/* Remarks */}
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <FileText size={15} className="inline mr-1 text-blue-500" />
                  Remarks
                </label>
                <input
                  type="text"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Enter any additional remarks..."
                  className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-sm border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 font-medium"
              >
                <RotateCcw size={14} />
                Reset
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-[#3b82f5] text-white rounded-lg hover:bg-[#2563eb] transition-colors flex items-center gap-2 font-medium shadow-sm"
              >
                <Save size={14} />
                Save Production Plan
              </button>
            </div>

            {/* Required Fields Note */}
            <p className="text-xs text-slate-400 mt-3">
              <span className="text-red-500">*</span> Required fields
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default DailyProdForm