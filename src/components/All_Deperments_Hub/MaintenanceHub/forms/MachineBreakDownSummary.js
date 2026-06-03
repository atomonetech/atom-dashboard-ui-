import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Cpu, 
  Calendar, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Repeat, 
  Pen, 
  MessageSquare, 
  Save, 
  Archive, 
  Trash2,
  Info,
  Pencil,
  CheckCircle as CheckCircleFill,
  HardDrive
} from 'lucide-react';

const MachineBreakdownSummary = () => {
  // Get current date in DD.MM.YYYY format
  const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Load saved data from localStorage on component mount
  const [breakdowns, setBreakdowns] = useState(() => {
    const saved = localStorage.getItem('machineBreakdowns');
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({
    date: getCurrentDate(),
    machineTypeNo: '',
    problemDescription: '',
    timePeriodMaintenance: '',
    statusAfterPeriod: '',
    updatedIn4m: '',
    sign: '',
    remarks: ''
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.machineTypeNo || !formData.problemDescription || 
        !formData.timePeriodMaintenance || !formData.statusAfterPeriod) {
      alert('Please fill in all required fields (*)');
      return;
    }

    // Create new breakdown record
    const newBreakdown = {
      id: Date.now(),
      ...formData,
      date: getCurrentDate(),
      submittedAt: new Date().toISOString()
    };

    // Save to state and localStorage
    const updatedBreakdowns = [newBreakdown, ...breakdowns];
    setBreakdowns(updatedBreakdowns);
    localStorage.setItem('machineBreakdowns', JSON.stringify(updatedBreakdowns));

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // Reset form
    setFormData({
      date: getCurrentDate(),
      machineTypeNo: '',
      problemDescription: '',
      timePeriodMaintenance: '',
      statusAfterPeriod: '',
      updatedIn4m: '',
      sign: '',
      remarks: ''
    });
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this breakdown record?')) {
      const filteredBreakdowns = breakdowns.filter(b => b.id !== id);
      setBreakdowns(filteredBreakdowns);
      localStorage.setItem('machineBreakdowns', JSON.stringify(filteredBreakdowns));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Back Button - Above Main Heading */}
        <div className="mb-3 sm:mb-4">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200 text-slate-700 font-medium text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Back</span>
          </button>
        </div>

        {/* Merged Main Header and Form Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header Section - Merged */}
          <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-orange-500 px-4 py-4 sm:px-6 sm:py-5 md:px-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <HardDrive className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
                Machine Breakdown Summary
              </h1>
            </div>
            <p className="text-purple-100 text-xs sm:text-sm md:text-base ml-1">
              Record and track machine maintenance issues
            </p>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mx-4 sm:mx-6 mt-4 sm:mt-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-3 sm:p-4 rounded-lg shadow-md flex items-center gap-2 sm:gap-3">
              <CheckCircleFill className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">Breakdown summary saved successfully!</span>
            </div>
          )}
          
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8">
            <div className="space-y-4 sm:space-y-5">
              
              {/* Row 1: DATE */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
                  DATE
                </label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-xl bg-gray-50 text-slate-700 outline-none cursor-default text-sm sm:text-base"
                  readOnly
                />
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Auto-filled with current date
                </p>
              </div>

              {/* Row 2: Machine Type & No */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                  <Cpu className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
                  MACHINE TYPE & MACHINE NO. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="machineTypeNo"
                  value={formData.machineTypeNo}
                  onChange={handleChange}
                  placeholder="e.g., CNC Lathe - MCH-001, Press Machine - PR-023"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none text-slate-700 text-sm sm:text-base"
                  required
                />
              </div>

              {/* Row 3: Problem Description */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                  <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
                  PROBLEM DESCRIPTION <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="problemDescription"
                  value={formData.problemDescription}
                  onChange={handleChange}
                  placeholder="Describe the breakdown issue in detail..."
                  rows="3"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none resize-none text-slate-700 text-sm sm:text-base"
                  required
                />
              </div>

              {/* Row 4: Time Period and Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
                    TIME PERIOD FOR MAINTENANCE <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="timePeriodMaintenance"
                    value={formData.timePeriodMaintenance}
                    onChange={handleChange}
                    placeholder="e.g., 2 hours, 3 days, 1 week"
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none text-slate-700 text-sm sm:text-base"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
                    STATUS AFTER TIME PERIOD <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="statusAfterPeriod"
                    value={formData.statusAfterPeriod}
                    onChange={handleChange}
                    placeholder="e.g., Operational, Pending, Under Repair"
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none text-slate-700 text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              {/* Row 5: Updated In 4M and Sign */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                    <Repeat className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
                    UPDATED IN 4M(1/N)
                  </label>
                  <input
                    type="text"
                    name="updatedIn4m"
                    value={formData.updatedIn4m}
                    onChange={handleChange}
                    placeholder="Yes/No or details"
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none text-slate-700 text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                    <Pen className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
                    SIGNATURE
                  </label>
                  <input
                    type="text"
                    name="sign"
                    value={formData.sign}
                    onChange={handleChange}
                    placeholder="Authorized signature / name"
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none text-slate-700 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Row 6: Remarks */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700">
                  <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500" />
                  REMARKS
                </label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Additional notes or comments..."
                  rows="2"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none resize-none text-slate-700 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6 sm:mt-8">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-base sm:text-lg"
              >
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                Save Breakdown Summary
              </button>
            </div>
          </form>
        </div>

        {/* Saved Records Section */}
        {breakdowns.length > 0 && (
          <div className="mt-8 sm:mt-10 bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-700 to-orange-600 px-4 sm:px-6 py-3 sm:py-4">
              <h2 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                <Archive className="w-4 h-4 sm:w-5 sm:h-5" />
                Saved Breakdown Records ({breakdowns.length})
              </h2>
            </div>
            <div className="overflow-x-auto p-3 sm:p-4">
              <table className="w-full text-xs sm:text-sm">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="text-left p-2 sm:p-3 font-semibold text-slate-600">Date</th>
                    <th className="text-left p-2 sm:p-3 font-semibold text-slate-600">Machine</th>
                    <th className="text-left p-2 sm:p-3 font-semibold text-slate-600">Problem</th>
                    <th className="text-left p-2 sm:p-3 font-semibold text-slate-600">Status</th>
                    <th className="text-left p-2 sm:p-3 font-semibold text-slate-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {breakdowns.map((breakdown) => (
                    <tr key={breakdown.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-2 sm:p-3 text-slate-700 whitespace-nowrap">{breakdown.date}</td>
                      <td className="p-2 sm:p-3 text-slate-700 max-w-[150px] sm:max-w-[200px] truncate">{breakdown.machineTypeNo}</td>
                      <td className="p-2 sm:p-3 text-slate-700 max-w-[180px] sm:max-w-[250px] truncate">{breakdown.problemDescription}</td>
                      <td className="p-2 sm:p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          breakdown.statusAfterPeriod?.toLowerCase().includes('operational') 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {breakdown.statusAfterPeriod}
                        </span>
                      </td>
                      <td className="p-2 sm:p-3">
                        <button
                          onClick={() => handleDelete(breakdown.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MachineBreakdownSummary;