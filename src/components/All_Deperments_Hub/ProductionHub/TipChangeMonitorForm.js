import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

const TipChangeMonitorForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    partName: '',
    prdQty: '',
    tipChange: '',
    tipDressing: '',
    dressingStatus: ''
  })

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle form reset
  const handleReset = () => {
    setFormData({
      partName: '',
      prdQty: '',
      tipChange: '',
      tipDressing: '',
      dressingStatus: ''
    })
  }

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.partName || !formData.prdQty || !formData.tipChange || !formData.tipDressing || !formData.dressingStatus) {
      console.log('Please fill all fields')
      alert('Please fill all fields')
      return
    }

    // Prepare data with timestamp
    const submissionData = {
      ...formData,
      prdQty: parseInt(formData.prdQty),
      currentDate: new Date().toISOString(),
      dressingFrequency: 'AFTER 900 NOS'
    }

    // Log to console (will be replaced with database call)
    console.log('Data to be saved to database:', submissionData)
    
    // Show success message
    alert('Data saved successfully! (Check console for data)')
    
    // Reset form after successful submission
    handleReset()
  }
 const handleBack = () => {
    window.location.href = '/production-hub';
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Back Button */}
      <button className="flex items-center gap-2 bg-[#916cf6] hover:bg-[#7b55e0] px-2 py-3 rounded-lg  text-white transition-colors mb-6 font-medium" onClick={handleBack}>
        <ArrowLeft size={20} />
        Back to Productionhub
      </button>

      {/* Form Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Header with Date */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Tip Change & Dressing Monitoring</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Current Date:</span>
            <span className="text-sm font-semibold text-[#916cf6] bg-[#916cf6]/10 px-3 py-1 rounded-full">
              {new Date().toLocaleDateString('en-GB', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              }).replace(/\//g, '/')}
            </span>
          </div>
        </div>

        {/* Single Line Form */}
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-4 flex-wrap lg:flex-nowrap">
            {/* Part Name Dropdown */}
            <div className="flex-1 min-w-[180px]">
              <select
                name="partName"
                value={formData.partName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#916cf6]/20 focus:border-[#916cf6] text-gray-700"
              >
                <option value="">Select Part Name</option>
                <option value="innear pipe 따다가">Innear pipe</option>
                <option value="Annear pire kis m">Annear pire kis m</option>
                <option value="Anhear pire kpm">Anhear pire kpm</option>
                <option value="Annear pipe">Annear pipe</option>
                <option value="Innear pipe">Innear pipe</option>
                <option value="innear pipe kpm">innear pipe kpm</option>
                <option value="Annear pipe kpm">Annear pipe kpm</option>
                <option value="Annear pipe k12m">Annear pipe k12m</option>
              </select>
            </div>

            {/* PRD QTY Input */}
            <div className="flex-1 min-w-[120px]">
              <input
                type="number"
                name="prdQty"
                value={formData.prdQty}
                onChange={handleChange}
                placeholder="PRD QTY"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#916cf6]/20 focus:border-[#916cf6] text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Tip Change Dropdown */}
            <div className="flex-1 min-w-[140px]">
              <select
                name="tipChange"
                value={formData.tipChange}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#916cf6]/20 focus:border-[#916cf6] text-gray-700"
              >
                <option value="">Tip Change</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Tip Dressing Dropdown */}
            <div className="flex-1 min-w-[150px]">
              <select
                name="tipDressing"
                value={formData.tipDressing}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#916cf6]/20 focus:border-[#916cf6] text-gray-700"
              >
                <option value="">Tip Dressing</option>
                <option value="Done">Done</option>
                <option value="Not Done">Not Done</option>
              </select>
            </div>

            {/* Dressing Status Dropdown */}
            <div className="flex-1 min-w-[150px]">
              <select
                name="dressingStatus"
                value={formData.dressingStatus}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#916cf6]/20 focus:border-[#916cf6] text-gray-700"
              >
                <option value="">Dressing Status</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {/* Submit Button */}
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#916cf6] hover:bg-[#7b55e0] text-white font-medium rounded-lg transition-colors whitespace-nowrap"
              >
                Save Entry
              </button>
              
              {/* Reset Button */}
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors whitespace-nowrap"
              >
                Reset
              </button>
            </div>
          </div>
        </form>

        {/* Helper text for dressing frequency */}
        <div className="mt-3 text-xs text-gray-500">
          <span className="font-medium text-[#916cf6]">DRESSING FREQ:</span> AFTER 900 NOS
        </div>
      </div>
    </div>
  )
}

export default TipChangeMonitorForm