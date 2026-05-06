import React, { useState } from 'react';
import { ArrowLeft, Plus, RefreshCw, Calendar, CheckCircle } from 'lucide-react';

const MachineOverhaulingList = () => {
  const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const currentDate = getCurrentDate();

  const [machineName, setMachineName] = useState('');
  const [remarks, setRemarks] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!machineName.trim()) {
      alert('Please enter machine name');
      return;
    }
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    console.log('Machine:', machineName);
    console.log('Remarks:', remarks);
    setMachineName('');
    setRemarks('');
  };

  const handleReset = () => {
    setMachineName('');
    setRemarks('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
      
      {/* Header with Orange Gradient - Like Image */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-wide">
              Machine Overhauling List
            </h1>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
              <Calendar className="w-4 h-4 text-white" />
              <span className="text-sm sm:text-base font-medium text-white">
                {currentDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-slate-700 font-semibold py-2 px-4 sm:px-6 rounded-lg transition-all duration-200 shadow-md border border-gray-200 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-md flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium text-sm sm:text-base">Machine added successfully!</span>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
          
          {/* Add New Machine Section */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-5 sm:px-7 py-4 sm:py-5 border-b border-orange-200">
            <h2 className="text-lg sm:text-xl font-bold text-orange-800 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Machine for Overhauling
            </h2>
            <p className="text-xs sm:text-sm text-orange-600 mt-1 ml-7">
              Fill in the details below to add a machine to the overhauling list
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-7">
            <div className="grid grid-cols-1 gap-5 sm:gap-6">
              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-sm sm:text-base">
                  Machine Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={machineName}
                  onChange={(e) => setMachineName(e.target.value)}
                  required
                  placeholder="Enter machine name (e.g., Press 450 T, CNC Machine, VMC)"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-slate-700 bg-white text-sm sm:text-base transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-sm sm:text-base">
                  Remarks
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                  placeholder="Enter any remarks about the machine (e.g., production status, criticality, etc.)"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-slate-700 bg-white text-sm sm:text-base transition-all resize-none"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-7 pt-5 border-t border-gray-200">
              <button
                type="submit"
                className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Plus className="w-4 h-4" />
                Add Machine
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MachineOverhaulingList;