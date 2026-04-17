import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, RefreshCw, Package, Hash, MapPin, FileText, Calendar, User, CheckCircle, Trash2, Edit, Cpu, Factory } from 'lucide-react';

const MasterMachineList = () => {
  const navigate = useNavigate();
  const themeColor = '#6366f2'; // Indigo theme (original color)

  // Get current date
  const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const currentDate = getCurrentDate();

  // Form State with all missing fields (SR.NO removed)
  const [formData, setFormData] = useState({
    machine: '',
    machineNo: '',
    location: '',
    tonnageSpecs: '',
    made: '',
    quantity: '1',
    remarks: ''
  });

  // Submitted Data State
  const [submittedData, setSubmittedData] = useState(() => {
    const saved = localStorage.getItem('masterMachineList');
    return saved ? JSON.parse(saved) : [];
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.machine || !formData.machineNo || !formData.location) {
      alert("Please fill all required fields (*)");
      return;
    }

    if (editingId) {
      // Update existing record
      const updatedData = submittedData.map(item => 
        item.id === editingId ? { ...formData, id: editingId, date: currentDate, srNo: item.srNo } : item
      );
      setSubmittedData(updatedData);
      localStorage.setItem('masterMachineList', JSON.stringify(updatedData));
      setEditingId(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      // Add new record
      const newEntry = {
        id: Date.now(),
        ...formData,
        srNo: submittedData.length + 1,
        date: currentDate,
        submittedAt: new Date().toISOString()
      };
      const updatedData = [...submittedData, newEntry];
      setSubmittedData(updatedData);
      localStorage.setItem('masterMachineList', JSON.stringify(updatedData));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
    
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      machine: '',
      machineNo: '',
      location: '',
      tonnageSpecs: '',
      made: '',
      quantity: '1',
      remarks: ''
    });
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this machine record?')) {
      const filteredData = submittedData.filter(item => item.id !== id);
      // Update SR.NO for remaining items
      const renumberedData = filteredData.map((item, index) => ({
        ...item,
        srNo: index + 1
      }));
      setSubmittedData(renumberedData);
      localStorage.setItem('masterMachineList', JSON.stringify(renumberedData));
    }
  };

  const handleEdit = (entry) => {
    setFormData({
      machine: entry.machine,
      machineNo: entry.machineNo,
      location: entry.location,
      tonnageSpecs: entry.tonnageSpecs || '',
      made: entry.made || '',
      quantity: entry.quantity,
      remarks: entry.remarks || ''
    });
    setEditingId(entry.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50 font-sans overflow-x-hidden">
      {/* --- HEADER SECTION --- */}
      <div className="bg-white border-b border-indigo-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl border border-indigo-200 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent uppercase tracking-tighter">
                Master List of Machines
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Annual Machine Registry & Inventory</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm font-semibold bg-indigo-50 px-4 py-2 rounded-full text-indigo-700 border border-indigo-200">
              <Calendar className="w-3.5 h-3.5 inline mr-1" />
              {currentDate}
            </div>
            <div className="text-xs text-slate-400 bg-gray-50 px-3 py-1 rounded-full">
              Doc: AOT-PROD-MM-01A
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-md flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">
              {editingId ? 'Machine record updated successfully!' : 'Machine added successfully!'}
            </span>
          </div>
        )}

        {/* --- FORM CARD --- */}
        <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-500" />
                  {editingId ? 'Edit Machine Record' : 'Add New Machine'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Enter machine details from the annual master registry</p>
              </div>
              {editingId && (
                <button
                  onClick={handleReset}
                  className="text-sm text-slate-500 hover:text-indigo-600 flex items-center gap-1"
                >
                  <RefreshCw className="w-4 h-4" />
                  Cancel Edit
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* MACHINE - Required */}
              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <Factory className="w-3.5 h-3.5 text-indigo-500" />
                  MACHINE <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="machine" 
                  value={formData.machine} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g., POWER PRESS, CNC MACHINE, VMC MACHINE" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700 text-sm transition-all" 
                />
              </div>

              {/* MACHINE NO. - Required */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <Hash className="w-3.5 h-3.5 text-indigo-500" />
                  MACHINE NO. <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="machineNo" 
                  value={formData.machineNo} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g., PP-43, CNC-01" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700 text-sm transition-all" 
                />
              </div>

              {/* LOCATION - Required */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                  LOCATION <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g., PRESS SHOP, MACHINING SHOP" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700 text-sm transition-all" 
                />
              </div>

              {/* TONNAGE / SPECS */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <Package className="w-3.5 h-3.5 text-indigo-500" />
                  TONNAGE / SPECS
                </label>
                <input 
                  type="text" 
                  name="tonnageSpecs" 
                  value={formData.tonnageSpecs} 
                  onChange={handleChange} 
                  placeholder="e.g., 110 T, 8 INCH, 6-AXIS" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700 text-sm transition-all" 
                />
              </div>

              {/* MADE */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <FileText className="w-3.5 h-3.5 text-indigo-500" />
                  MADE
                </label>
                <input 
                  type="text" 
                  name="made" 
                  value={formData.made} 
                  onChange={handleChange} 
                  placeholder="e.g., TISGEC, ACE, COLT" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700 text-sm transition-all" 
                />
              </div>

              {/* QUANTITY */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <Package className="w-3.5 h-3.5 text-indigo-500" />
                  QUANTITY
                </label>
                <input 
                  type="number" 
                  name="quantity" 
                  value={formData.quantity} 
                  onChange={handleChange} 
                  placeholder="Total Count" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700 text-sm transition-all" 
                />
              </div>

              {/* REMARKS - Full width */}
              <div className="space-y-2 md:col-span-2 lg:col-span-3">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <FileText className="w-3.5 h-3.5 text-indigo-500" />
                  REMARKS
                </label>
                <textarea 
                  name="remarks" 
                  value={formData.remarks} 
                  onChange={handleChange} 
                  rows={2} 
                  placeholder="Additional notes or comments..." 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700 text-sm transition-all resize-none" 
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-100">
              <button 
                type="submit" 
                className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                style={{backgroundColor: themeColor}}
              >
                <Plus className="w-4 h-4" />
                {editingId ? 'Update Machine' : 'Add to List'}
              </button>
              <button 
                type="button" 
                onClick={handleReset} 
                className="bg-white hover:bg-gray-50 text-slate-600 font-bold py-3 px-8 rounded-xl transition-all border border-gray-200 text-sm uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Form
              </button>
            </div>
          </form>
        </div>

        {/* --- SUBMITTED DATA VISUALIZATION --- */}
        {submittedData.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Machine Registry</h2>
                <p className="text-xs text-slate-500">Complete list of all machines</p>
              </div>
              <div className="text-sm font-bold text-indigo-600 bg-indigo-100 px-4 py-1.5 rounded-full">
                Total Machines: {submittedData.reduce((sum, item) => sum + parseInt(item.quantity || 0), 0)}
              </div>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="block lg:hidden divide-y divide-gray-100">
              {submittedData.map((entry) => (
                <div key={entry.id} className="p-5 hover:bg-indigo-50/30 transition-colors">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-100 text-slate-500">#{entry.srNo}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(entry)}
                        className="text-indigo-500 hover:text-indigo-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-base mb-1 uppercase">{entry.machine}</h4>
                  <p className="text-sm text-slate-600 mb-2">Machine No: {entry.machineNo}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-slate-600">{entry.location}</span>
                    {entry.tonnageSpecs && (
                      <span className="text-xs bg-indigo-100 px-2 py-1 rounded text-indigo-700">{entry.tonnageSpecs}</span>
                    )}
                    {entry.made && (
                      <span className="text-xs bg-purple-100 px-2 py-1 rounded text-purple-700">{entry.made}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-black text-indigo-600">{entry.quantity} <span className='text-xs font-normal text-slate-400'>Nos.</span></span>
                    {entry.remarks && (
                      <p className="text-xs text-slate-500 italic">{entry.remarks}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">S.No.</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Machine</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Machine No.</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tonnage/Specs</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Made</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Qty</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Remarks</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {submittedData.map((entry) => (
                    <tr key={entry.id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-500 font-mono">{entry.srNo}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-800 uppercase">{entry.machine}</td>
                      <td className="px-6 py-4 text-sm text-slate-700 font-mono">{entry.machineNo}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{entry.location}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{entry.tonnageSpecs || '-'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{entry.made || '-'}</td>
                      <td className="px-6 py-4 text-base font-black text-indigo-600 text-center">{entry.quantity}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 truncate max-w-xs">{entry.remarks || '-'}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(entry)}
                            className="text-indigo-500 hover:text-indigo-700 transition-colors p-1"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-xs text-slate-400 text-center">
              <span className="flex items-center justify-center gap-2">
                <FileText className="w-3 h-3" />
                Format No: AOT-F-MM-01a | Rev No: 00 | Prepared By: ________ | Approved By: ________
              </span>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden text-center py-16 px-6">
            <Cpu className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No Machines Recorded Yet</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">Fill out the form above to start building the Annual Master List of Machines.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterMachineList;