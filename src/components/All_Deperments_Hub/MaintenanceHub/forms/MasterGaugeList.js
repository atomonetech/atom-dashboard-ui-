import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MasterGaugeList = () => {
  const navigate = useNavigate();
  const themeColor = '#ed4a9b'; // Requested theme color

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const initialFormState = {
    customerName: '',
    partName: '',
    gaugeType: '',
    idNo: '',
    goSize: '',
    notGoSize: '',
    frequency: 'Yearly',
    calibrationDate: '',
    nextCalibrationDate: '',
    status: 'Valid',
    suppliedBy: 'In-House' // Option for 'Gauges Supplied by Customer' as per image
  };

  const [formData, setFormData] = useState(initialFormState);
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
    handleReset();
    alert("Gauge added to master list successfully!");
  };

  const handleReset = () => setFormData(initialFormState);

  return (
    <div className="min-h-screen bg-slate-50 font-sans overflow-x-hidden">
      {/* --- HEADER SECTION --- */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm shadow-slate-100/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-pink-50 hover:text-pink-600 transition-all"
            >
              <i className="bi bi-arrow-left text-lg"></i>
            </button>
            <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-pink-600 to-rose-400 bg-clip-text text-transparent uppercase tracking-tighter">
              Master List of Gauges
            </h1>
          </div>
          <div className="hidden sm:block text-sm font-semibold bg-pink-50 px-4 py-2 rounded-full text-pink-700 border border-pink-100">
            {currentDate}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* --- FORM CARD --- */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-slate-100 bg-pink-50/30 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Gauge Entry Form</h2>
              <p className="text-xs text-slate-500 font-medium">Form: AOT-F-TM-02 | Calibration Registry</p>
            </div>
            <div className="text-end text-xs text-slate-400">
               Doc No: <b className='text-pink-600'>AOT-F-TM-02</b>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div>
                <label className="block text-slate-600 font-bold mb-2 text-xs uppercase tracking-wider">Customer Name</label>
                <input type="text" name="customerName" value={formData.customerName} onChange={handleChange} placeholder="e.g. FIG / TENNECO" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-200 outline-none text-sm transition-all" />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-2 text-xs uppercase tracking-wider">Part Name *</label>
                <input type="text" name="partName" value={formData.partName} onChange={handleChange} required placeholder="Component Name" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-200 outline-none text-sm" />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-2 text-xs uppercase tracking-wider">Gauges Type *</label>
                <input type="text" name="gaugeType" value={formData.gaugeType} onChange={handleChange} required placeholder="Plug/Snap/Thread" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-200 outline-none text-sm" />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-2 text-xs uppercase tracking-wider">ID No. *</label>
                <input type="text" name="idNo" value={formData.idNo} onChange={handleChange} required placeholder="Unique Gauge ID" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-200 outline-none text-sm" />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-2 text-xs uppercase tracking-wider">GO Size (mm)</label>
                <input type="text" name="goSize" value={formData.goSize} onChange={handleChange} placeholder="0.00" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-200 outline-none text-sm" />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-2 text-xs uppercase tracking-wider">NOT GO Size (mm)</label>
                <input type="text" name="notGoSize" value={formData.notGoSize} onChange={handleChange} placeholder="0.00" className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-200 outline-none text-sm" />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-2 text-xs uppercase tracking-wider">Last Calibration</label>
                <input type="date" name="calibrationDate" value={formData.calibrationDate} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-200 outline-none text-sm bg-white" />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-2 text-xs uppercase tracking-wider">Next Calibration Date</label>
                <input type="date" name="nextCalibrationDate" value={formData.nextCalibrationDate} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-200 outline-none text-sm bg-white" />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-2 text-xs uppercase tracking-wider">Supply Source</label>
                <select name="suppliedBy" value={formData.suppliedBy} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-200 outline-none text-sm bg-white">
                  <option value="In-House">In-House</option>
                  <option value="Customer Supplied">Customer Supplied</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-2 text-xs uppercase tracking-wider">Current Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-200 outline-none text-sm bg-white font-bold text-pink-600">
                  <option value="Valid">Valid</option>
                  <option value="Expired">Expired</option>
                  <option value="Under Repair">Under Repair</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-10 pt-6 border-t border-slate-100">
              <button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-10 rounded-2xl transition-all shadow-lg text-sm uppercase tracking-widest flex items-center justify-center gap-2" style={{backgroundColor: themeColor}}>
                <i className="bi bi-plus-circle"></i> Add Gauge Entry
              </button>
              <button type="button" onClick={handleReset} className="bg-white hover:bg-slate-50 text-slate-600 font-bold py-3 px-10 rounded-2xl transition-all border border-slate-200 text-sm uppercase tracking-widest">
                Reset Form
              </button>
            </div>
          </form>
        </div>

        {/* --- LIST VIEW --- */}
        {submittedData.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2"><i className="bi bi-table"></i> Master Registry</h3>
              <span className="text-xs bg-pink-500 px-3 py-1 rounded-full uppercase tracking-widest">Total: {submittedData.length}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[1000px]">
                <thead className="bg-slate-50 border-b">
                  <tr className="text-slate-500 text-[10px] uppercase font-black">
                    <th className="px-6 py-4">S.No</th>
                    <th className="px-6 py-4">Part / Customer</th>
                    <th className="px-6 py-4">Gauge Type</th>
                    <th className="px-6 py-4">ID No.</th>
                    <th className="px-6 py-4">GO / NO GO</th>
                    <th className="px-6 py-4">Last Calib.</th>
                    <th className="px-6 py-4">Next Calib.</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submittedData.map((entry) => (
                    <tr key={entry.id} className="hover:bg-pink-50/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-slate-400">{entry.serialNo}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-slate-800">{entry.partName}</div>
                        <div className="text-[10px] text-pink-500 font-bold">{entry.customerName || 'In-House'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{entry.gaugeType}</td>
                      <td className="px-6 py-4 text-sm font-black text-slate-700">{entry.idNo}</td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-emerald-600 font-bold">G: {entry.goSize || '-'}</div>
                        <div className="text-xs text-rose-500 font-bold">N: {entry.notGoSize || '-'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{entry.calibrationDate || '-'}</td>
                      <td className="px-6 py-4 text-sm font-bold text-pink-600">{entry.nextCalibrationDate || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black px-2 py-1 rounded border uppercase ${
                          entry.status === 'Valid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                          {entry.status}
                        </span>
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

export default MasterGaugeList;