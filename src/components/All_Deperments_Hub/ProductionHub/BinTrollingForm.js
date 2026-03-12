import React, { useState, useEffect } from 'react';

const BinTrollingForm = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [currentWeek, setCurrentWeek] = useState('W1');
  const [currentMonth, setCurrentMonth] = useState('');

  // Predefined checkpoints
  const checkpoints = [
    { id: 'cp1', label: 'Bin/Trolley Should Be Clean Properly', defaultMethod: 'VISUAL' },
    { id: 'cp2', label: 'Bin/Trolley Should be Free From Dust', defaultMethod: 'VISUAL' },
    { id: 'cp3', label: 'Bin/Trolley Should Not Be Damage And Broken', defaultMethod: 'INSPECTION' },
    { id: 'cp4', label: 'Bin/Trolley Should be Free From Oil Surface', defaultMethod: 'VISUAL' },
    { id: 'cp5', label: 'Bin/Trolley Should Be Clean In Bin Cleaning Area', defaultMethod: 'INSPECTION' },
    { id: 'cp6', label: 'Others (Please Specify)', defaultMethod: 'MANUAL' }
  ];

  const cleaningDetails = [
    { id: 'cd1', label: 'Total Bin / Trolley Quantity' },
    { id: 'cd2', label: 'Bin / Trolley Clean Quantity' },
    { id: 'cd3', label: 'Bin / Trolley Unclean Quantity' }
  ];

  const maintenanceDetails = [
    { id: 'md1', label: 'Total Bin/Trolley Maintenance Quantity' },
    { id: 'md2', label: 'Bin/Trolley Ok Quantity' },
    { id: 'md3', label: 'Bin/Trolley Reject Quantity' }
  ];

  // State for checkpoints - only current week data
  const [checkpointData, setCheckpointData] = useState(
    checkpoints.reduce((acc, cp) => {
      acc[cp.id] = {
        checkingMethod: cp.defaultMethod,
        status: '',
        remarks: ''
      };
      return acc;
    }, {})
  );

  // State for cleaning details - only current week data
  const [cleaningData, setCleaningData] = useState(
    cleaningDetails.reduce((acc, cd) => {
      acc[cd.id] = {
        frequency: '',
        remarks: ''
      };
      return acc;
    }, {})
  );

  // State for maintenance details - only current week data
  const [maintenanceData, setMaintenanceData] = useState(
    maintenanceDetails.reduce((acc, md) => {
      acc[md.id] = {
        frequency: '',
        remarks: ''
      };
      return acc;
    }, {})
  );

  // Accurate function to calculate week of month for 2026
  const getWeekOfMonth = (date) => {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    
    // Get the first day of the month
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Adjust to make Monday the first day of week (1 = Monday, 7 = Sunday)
    const adjustedFirstDay = firstDay === 0 ? 7 : firstDay;
    
    // Calculate which week of the month
    // Week 1: Days 1-7, Week 2: Days 8-14, Week 3: Days 15-21, Week 4: Days 22-28, Week 5: Days 29+
    if (day <= 7) return 1;
    if (day <= 14) return 2;
    if (day <= 21) return 3;
    if (day <= 28) return 4;
    return 5;
  };

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '.');
    setCurrentDate(formattedDate);

    const monthName = today.toLocaleDateString('en-GB', { month: 'short' });
    setCurrentMonth(monthName);

    const weekNumber = getWeekOfMonth(today);
    setCurrentWeek(`W${weekNumber}`);

    // Log for debugging
    console.log(`Date: ${formattedDate}, Week: W${weekNumber}, Month: ${monthName}`);
  }, []);

  const handleCheckpointChange = (id, field, value) => {
    setCheckpointData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleCleaningChange = (id, field, value) => {
    setCleaningData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleMaintenanceChange = (id, field, value) => {
    setMaintenanceData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const resetForm = () => {
    setCheckpointData(
      checkpoints.reduce((acc, cp) => {
        acc[cp.id] = {
          checkingMethod: cp.defaultMethod,
          status: '',
          remarks: ''
        };
        return acc;
      }, {})
    );
    setCleaningData(
      cleaningDetails.reduce((acc, cd) => {
        acc[cd.id] = {
          frequency: '',
          remarks: ''
        };
        return acc;
      }, {})
    );
    setMaintenanceData(
      maintenanceDetails.reduce((acc, md) => {
        acc[md.id] = {
          frequency: '',
          remarks: ''
        };
        return acc;
      }, {})
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const completeData = {
      checkpoints: checkpointData,
      cleaningDetails: cleaningData,
      maintenanceDetails: maintenanceData,
      currentWeek,
      currentDate,
      month: currentMonth
    };
    console.log("Form Submitted:", completeData);
    alert(`Data saved for ${currentWeek} (${currentMonth} ${new Date().getFullYear()})`);
    resetForm();
  };

  const handleBack = () => {
    window.location.href = '/production-hub';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fdff] to-[#f0fbfe] p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={handleBack}
          className="mb-4 flex items-center text-white text-md font-bold bg-cyan-400 hover:bg-cyan-500 transition-colors group px-3 py-2 rounded-lg"
        >
          <svg className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Production Hub
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-0">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-white to-cyan-300 px-6 py-5">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-[#048595]">Bin & Trolley Cleaning Check Sheet And Maintenance Record Sheet</h1>
              <div className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/70">
                <span className="text-sm font-medium text-[#036a7a]">Date: {currentDate}</span>
              </div>
            </div>
          </div>

         

          {/* Current Week Indicator */}
          <div className="bg-white px-6 py-3 border-b border-[#e0f7fa]">
            <div className="flex items-center justify-end">
              <span className="bg-gradient-to-r from-[#b2ebf2] to-[#80deea] text-[#036a7a] px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm">
                Active Week: {currentWeek} ({currentMonth} {new Date().getFullYear()})
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            
            {/* Section 1: Check Points */}
            <div className="bg-gradient-to-br from-white to-[#f8fdff] rounded-xl p-5 border border-[#b2ebf2] shadow-sm">
              <div className="flex justify-between items-center pb-2 mb-4 border-b border-cyan-500">
                <h2 className="text-base font-semibold text-slate-700">Check Points</h2>
                <span className="bg-gradient-to-r from-[#b2ebf2] to-[#80deea] text-[#036a7a] px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                  {currentWeek}
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#e0f7fa]">
                      <th className="border border-[#b2ebf2] p-3 text-left text-slate-700 font-medium w-16">SR.NO.</th>
                      <th className="border border-[#b2ebf2] p-3 text-left text-slate-700 font-medium">Check Point</th>
                      <th className="border border-[#b2ebf2] p-3 text-left text-slate-700 font-medium w-40">Checking Method</th>
                      <th className="border border-[#b2ebf2] p-3 text-left text-slate-700 font-medium w-24">Status (Y/N)</th>
                      <th className="border border-[#b2ebf2] p-3 text-left text-slate-700 font-medium">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkpoints.map((cp, index) => (
                      <tr key={cp.id} className="hover:bg-[#f8fdff]">
                        <td className="border border-[#b2ebf2] p-3 text-center text-slate-700">{index + 1}</td>
                        <td className="border border-[#b2ebf2] p-3 text-slate-700">{cp.label}</td>
                        <td className="border border-[#b2ebf2] p-3">
                          <select 
                            value={checkpointData[cp.id]?.checkingMethod || cp.defaultMethod}
                            onChange={(e) => handleCheckpointChange(cp.id, 'checkingMethod', e.target.value)}
                            className="w-full border border-[#b2ebf2] rounded px-2 py-1.5 text-sm text-slate-700 bg-white focus:outline-none focus:border-[#4fc3dc]"
                          >
                            <option value="VISUAL">VISUAL</option>
                            <option value="MANUAL">MANUAL</option>
                            <option value="INSPECTION">INSPECTION</option>
                            <option value="TESTING">TESTING</option>
                          </select>
                        </td>
                        <td className="border border-[#b2ebf2] p-3">
                          <select 
                            value={checkpointData[cp.id]?.status || ''}
                            onChange={(e) => handleCheckpointChange(cp.id, 'status', e.target.value)}
                            className="w-full border border-[#b2ebf2] rounded px-2 py-1.5 text-sm text-slate-700 bg-white focus:outline-none focus:border-[#4fc3dc]"
                          >
                            <option value="">Select</option>
                            <option value="Y">Y</option>
                            <option value="N">N</option>
                          </select>
                        </td>
                        <td className="border border-[#b2ebf2] p-3">
                          <input 
                            type="text" 
                            placeholder="Enter remarks"
                            value={checkpointData[cp.id]?.remarks || ''}
                            onChange={(e) => handleCheckpointChange(cp.id, 'remarks', e.target.value)}
                            className="w-full border border-[#b2ebf2] rounded px-2 py-1.5 text-sm text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:border-[#4fc3dc]"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2: Cleaning Details */}
            <div className="bg-gradient-to-br from-white to-[#f8fdff] rounded-xl p-5 border border-[#b2ebf2] shadow-sm">
              <div className="flex justify-between items-center pb-2 mb-4 border-b border-cyan-500">
                <h2 className="text-base font-semibold text-slate-700">Cleaning Details</h2>
                <span className="bg-gradient-to-r from-[#b2ebf2] to-[#80deea] text-[#036a7a] px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                  {currentWeek}
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#e0f7fa]">
                      <th className="border border-[#b2ebf2] p-3 text-left text-slate-700 font-medium">Cleaning Detail</th>
                      <th className="border border-[#b2ebf2] p-3 text-left text-slate-700 font-medium w-32">Frequency</th>
                      <th className="border border-[#b2ebf2] p-3 text-left text-slate-700 font-medium">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cleaningDetails.map((detail) => (
                      <tr key={detail.id} className="hover:bg-[#f8fdff]">
                        <td className="border border-[#b2ebf2] p-3 text-slate-700">{detail.label}</td>
                        <td className="border border-[#b2ebf2] p-3">
                          <input 
                            type="number" 
                            placeholder="Enter quantity"
                            value={cleaningData[detail.id]?.frequency || ''}
                            onChange={(e) => handleCleaningChange(detail.id, 'frequency', e.target.value)}
                            className="w-full border border-[#b2ebf2] rounded px-2 py-1.5 text-sm text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:border-[#4fc3dc]"
                          />
                        </td>
                        <td className="border border-[#b2ebf2] p-3">
                          <input 
                            type="text" 
                            placeholder="Enter remarks"
                            value={cleaningData[detail.id]?.remarks || ''}
                            onChange={(e) => handleCleaningChange(detail.id, 'remarks', e.target.value)}
                            className="w-full border border-[#b2ebf2] rounded px-2 py-1.5 text-sm text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:border-[#4fc3dc]"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 3: Maintenance Details */}
            <div className="bg-gradient-to-br from-white to-[#f8fdff] rounded-xl p-5 border border-[#b2ebf2] shadow-sm">
              <div className="flex justify-between items-center pb-2 mb-4 border-b border-cyan-500">
                <h2 className="text-base font-semibold text-slate-700">Maintenance Details</h2>
                <span className="bg-gradient-to-r from-[#b2ebf2] to-[#80deea] text-[#036a7a] px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                  {currentWeek}
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#e0f7fa]">
                      <th className="border border-[#b2ebf2] p-3 text-left text-slate-700 font-medium">Maintenance Detail</th>
                      <th className="border border-[#b2ebf2] p-3 text-left text-slate-700 font-medium w-32">Frequency</th>
                      <th className="border border-[#b2ebf2] p-3 text-left text-slate-700 font-medium">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenanceDetails.map((detail) => (
                      <tr key={detail.id} className="hover:bg-[#f8fdff]">
                        <td className="border border-[#b2ebf2] p-3 text-slate-700">{detail.label}</td>
                        <td className="border border-[#b2ebf2] p-3">
                          <input 
                            type="number" 
                            placeholder="Enter quantity"
                            value={maintenanceData[detail.id]?.frequency || ''}
                            onChange={(e) => handleMaintenanceChange(detail.id, 'frequency', e.target.value)}
                            className="w-full border border-[#b2ebf2] rounded px-2 py-1.5 text-sm text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:border-[#4fc3dc]"
                          />
                        </td>
                        <td className="border border-[#b2ebf2] p-3">
                          <input 
                            type="text" 
                            placeholder="Enter remarks"
                            value={maintenanceData[detail.id]?.remarks || ''}
                            onChange={(e) => handleMaintenanceChange(detail.id, 'remarks', e.target.value)}
                            className="w-full border border-[#b2ebf2] rounded px-2 py-1.5 text-sm text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:border-[#4fc3dc]"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
              <button 
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#ffb2b2] to-[#ff8080] hover:from-[#ff8080] hover:to-[#ffb2b2] text-white font-medium rounded-lg transition-all text-sm shadow-sm hover:shadow-md transform hover:scale-[1.02]"
              >
                Reset Form
              </button>
              
              <button 
                type="submit" 
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#b2ebf2] to-[#80deea] hover:from-[#80deea] hover:to-[#b2ebf2] text-[#036a7a] font-medium rounded-lg transition-all text-sm shadow-sm hover:shadow-md transform hover:scale-[1.02]"
              >
                Save Record for {currentWeek}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default BinTrollingForm;