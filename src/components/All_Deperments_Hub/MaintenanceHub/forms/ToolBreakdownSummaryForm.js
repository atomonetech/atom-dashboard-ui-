import React, { useState } from 'react';

const ToolBreakdownSummaryForm = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const [formData, setFormData] = useState({
    serialNo: '',
    date: '',
    toolName: '',
    processName: '',
    problem: '',
    actionTaken: '',
    totalTimeTaken: '',
    checkedBy: '',
    historyCardStatus: '',
    updatedIn4M: 'N',
    sign: '',
    remarks: '',
  });

  const [submittedData, setSubmittedData] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now(),
      ...formData,
      serialNo: submittedData.length + 1,
    };
    setSubmittedData([...submittedData, newEntry]);
    console.log('Submitted Data:', newEntry);
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      serialNo: '',
      date: '',
      toolName: '',
      processName: '',
      problem: '',
      actionTaken: '',
      totalTimeTaken: '',
      checkedBy: '',
      historyCardStatus: '',
      updatedIn4M: 'N',
      sign: '',
      remarks: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Navbar with Gradient - Responsive */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-wide text-center sm:text-left">
              Tool/DIE Breakdown Summary
            </h1>
            <div className="text-xs sm:text-sm md:text-base bg-white/20 px-2 sm:px-3 py-1 rounded-lg">
              {currentDate}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Back Button - Responsive */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 sm:px-6 rounded-lg transition duration-200 flex items-center gap-2 shadow-md text-sm sm:text-base"
          >
            ← Back
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
              Breakdown Entry Form
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Fill in the details below to record a tool breakdown
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-slate-700 font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 bg-white text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
                  Tool Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="toolName"
                  value={formData.toolName}
                  onChange={handleChange}
                  required
                  placeholder="Enter tool name"
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 bg-white text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
                  Process Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="processName"
                  value={formData.processName}
                  onChange={handleChange}
                  required
                  placeholder="Enter process name"
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 bg-white text-sm sm:text-base"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
                  Problem <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="problem"
                  value={formData.problem}
                  onChange={handleChange}
                  required
                  rows={2}
                  placeholder="Describe the problem..."
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 bg-white text-sm sm:text-base"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
                  Action Taken <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="actionTaken"
                  value={formData.actionTaken}
                  onChange={handleChange}
                  required
                  rows={2}
                  placeholder="Describe action taken..."
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 bg-white text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
                  Total Time Taken <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="totalTimeTaken"
                  value={formData.totalTimeTaken}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 2hrs 30min"
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 bg-white text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
                  Checked By <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="checkedBy"
                  value={formData.checkedBy}
                  onChange={handleChange}
                  required
                  placeholder="Name of checker"
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 bg-white text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
                  History Card Status
                </label>
                <select
                  name="historyCardStatus"
                  value={formData.historyCardStatus}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 bg-white text-sm sm:text-base"
                >
                  <option value="">Select status</option>
                  <option value="Up-to-date">Up-to-date</option>
                  <option value="Pending">Pending</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
                  Updated in 4M
                </label>
                <div className="flex gap-3 sm:gap-4 mt-1.5 sm:mt-2">
                  <label className="flex items-center gap-1.5 sm:gap-2 text-slate-700 text-sm sm:text-base">
                    <input
                      type="radio"
                      name="updatedIn4M"
                      value="Y"
                      checked={formData.updatedIn4M === 'Y'}
                      onChange={handleChange}
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600"
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-1.5 sm:gap-2 text-slate-700 text-sm sm:text-base">
                    <input
                      type="radio"
                      name="updatedIn4M"
                      value="N"
                      checked={formData.updatedIn4M === 'N'}
                      onChange={handleChange}
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600"
                    />
                    No
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
                  Sign
                </label>
                <input
                  type="text"
                  name="sign"
                  value={formData.sign}
                  onChange={handleChange}
                  placeholder="Signature / Initials"
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 bg-white text-sm sm:text-base"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-slate-700 font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
                  Remarks
                </label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows={1}
                  placeholder="Any additional remarks..."
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700 bg-white text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Form Actions - Responsive */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2 px-4 sm:px-8 rounded-lg transition duration-200 shadow-md text-sm sm:text-base"
              >
                Submit Entry
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 sm:px-8 rounded-lg transition duration-200 shadow-md text-sm sm:text-base"
              >
                Reset Form
              </button>
            </div>
          </form>
        </div>

        {/* Submitted Data Table - Horizontal Scroll on Mobile */}
        {submittedData.length > 0 && (
          <div className="mt-6 sm:mt-8 md:mt-10 bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                Breakdown Summary Records
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Month/Year: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            
            {/* Mobile Card View for small screens */}
            <div className="block md:hidden divide-y divide-gray-200">
              {submittedData.map((entry) => (
                <div key={entry.id} className="p-4 hover:bg-gray-50">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-semibold text-gray-600">S.NO.:</div>
                    <div className="text-slate-700">{entry.serialNo}</div>
                    
                    <div className="font-semibold text-gray-600">Date:</div>
                    <div className="text-slate-700">{entry.date}</div>
                    
                    <div className="font-semibold text-gray-600">Tool Name:</div>
                    <div className="text-slate-700 break-words">{entry.toolName}</div>
                    
                    <div className="font-semibold text-gray-600">Process Name:</div>
                    <div className="text-slate-700 break-words">{entry.processName}</div>
                    
                    <div className="font-semibold text-gray-600">Problem:</div>
                    <div className="text-slate-700 break-words">{entry.problem}</div>
                    
                    <div className="font-semibold text-gray-600">Action Taken:</div>
                    <div className="text-slate-700 break-words">{entry.actionTaken}</div>
                    
                    <div className="font-semibold text-gray-600">Time Taken:</div>
                    <div className="text-slate-700">{entry.totalTimeTaken}</div>
                    
                    <div className="font-semibold text-gray-600">Checked By:</div>
                    <div className="text-slate-700">{entry.checkedBy}</div>
                    
                    <div className="font-semibold text-gray-600">History Card:</div>
                    <div className="text-slate-700">{entry.historyCardStatus || '-'}</div>
                    
                    <div className="font-semibold text-gray-600">4M:</div>
                    <div className="text-slate-700">{entry.updatedIn4M}</div>
                    
                    <div className="font-semibold text-gray-600">Sign:</div>
                    <div className="text-slate-700">{entry.sign || '-'}</div>
                    
                    <div className="font-semibold text-gray-600">Remarks:</div>
                    <div className="text-slate-700 break-words">{entry.remarks || '-'}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.NO.</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TOOL NAME</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PROCESS NAME</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PROBLEM</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTION TAKEN</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TIME TAKEN</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CHECKED BY</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HISTORY CARD</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">4M</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SIGN</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">REMARKS</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {submittedData.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-slate-700">{entry.serialNo}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{entry.date}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{entry.toolName}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{entry.processName}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 max-w-xs truncate">{entry.problem}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 max-w-xs truncate">{entry.actionTaken}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{entry.totalTimeTaken}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{entry.checkedBy}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{entry.historyCardStatus || '-'}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{entry.updatedIn4M}</td>
                      <td className="px-4 py-3 text-sm text-slate-700">{entry.sign || '-'}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 max-w-xs truncate">{entry.remarks || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between text-xs sm:text-sm text-gray-600 gap-2">
              <span>Prepared By: System User</span>
              <span>Approved By: Manager</span>
            </div>
          </div>
        )}

        {/* Empty State - Responsive */}
      
      </div>
    </div>
  );
};

export default ToolBreakdownSummaryForm;