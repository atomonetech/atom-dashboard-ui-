import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  RefreshCw, 
  Trash2, 
  Package, 
  Calendar, 
  Wrench, 
  Hash, 
  User, 
  MapPin,
  CheckCircle,
  Edit
} from 'lucide-react';

const MasterToolList = () => {
  const navigate = useNavigate();
  const themeColor = '#6366f2'; // Indigo theme

  // Current Date logic
  const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const currentDate = getCurrentDate();

  // Form State based on Master Tool List structure from image (SR.NO removed)
  const [formData, setFormData] = useState({
    customer: '',
    model: '',
    partName: '',
    partNumber: '',
    toolName: '',
    remarks: ''
  });

  // Submitted Data State
  const [submittedData, setSubmittedData] = useState(() => {
    const saved = localStorage.getItem('masterToolList');
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
    if (!formData.customer || !formData.model || !formData.partName || !formData.toolName) {
      alert("Please fill all required fields (*)");
      return;
    }

    if (editingId) {
      // Update existing record
      const updatedData = submittedData.map(item => 
        item.id === editingId ? { ...formData, id: editingId, date: currentDate, srNo: item.srNo } : item
      );
      setSubmittedData(updatedData);
      localStorage.setItem('masterToolList', JSON.stringify(updatedData));
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
      localStorage.setItem('masterToolList', JSON.stringify(updatedData));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
    
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      customer: '',
      model: '',
      partName: '',
      partNumber: '',
      toolName: '',
      remarks: ''
    });
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this tool record?')) {
      const filteredData = submittedData.filter(item => item.id !== id);
      const renumberedData = filteredData.map((item, index) => ({
        ...item,
        srNo: index + 1
      }));
      setSubmittedData(renumberedData);
      localStorage.setItem('masterToolList', JSON.stringify(renumberedData));
    }
  };

  const handleEdit = (entry) => {
    setFormData({
      customer: entry.customer,
      model: entry.model,
      partName: entry.partName,
      partNumber: entry.partNumber || '',
      toolName: entry.toolName,
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
                MASTER LIST OF TOOL
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Tool / Die Master Registry</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm font-semibold bg-indigo-50 px-4 py-2 rounded-full text-indigo-700 border border-indigo-200">
              <Calendar className="w-3.5 h-3.5 inline mr-1" />
              {currentDate}
            </div>
            <div className="text-xs text-slate-400 bg-gray-50 px-3 py-1 rounded-full">
              Form: AOT-F-TM-08
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
              {editingId ? 'Tool record updated successfully!' : 'Tool added successfully!'}
            </span>
          </div>
        )}

        {/* --- FORM CARD --- */}
        <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-indigo-500" />
                  {editingId ? 'Edit Tool Record' : 'Add New Tool'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Fill in the tool details below</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* CUSTOMER - Required */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  <User className="w-3.5 h-3.5 text-indigo-500" />
                  CUSTOMER <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="customer" 
                  value={formData.customer} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g., FIG, MARUTI, HONDA" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700 text-sm transition-all" 
                />
              </div>

              {/* MODEL - Required */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  <Package className="w-3.5 h-3.5 text-indigo-500" />
                  MODEL <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="model" 
                  value={formData.model} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g., K12M, ALTO, SWIFT" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700 text-sm transition-all" 
                />
              </div>

              {/* PART NAME - Required */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  <Package className="w-3.5 h-3.5 text-indigo-500" />
                  PART NAME <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="partName" 
                  value={formData.partName} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g., INNER PIPE, INLET PIPE" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700 text-sm transition-all" 
                />
              </div>

              {/* PART NUMBER */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  <Hash className="w-3.5 h-3.5 text-indigo-500" />
                  PART NUMBER
                </label>
                <input 
                  type="text" 
                  name="partNumber" 
                  value={formData.partNumber} 
                  onChange={handleChange} 
                  placeholder="e.g., 14330-83P00-10" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700 text-sm transition-all" 
                />
              </div>

              {/* TOOL NAME - Required */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  <Wrench className="w-3.5 h-3.5 text-indigo-500" />
                  TOOL NAME <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="toolName" 
                  value={formData.toolName} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g., BLANKING, PUNCHING, U BENDING" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700 text-sm transition-all" 
                />
              </div>

              {/* REMARKS - Full width */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500" />
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
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
              <button 
                type="submit" 
                className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-bold py-2.5 px-8 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
              >
                <Plus className="w-4 h-4" />
                {editingId ? 'Update Tool' : 'Register Tool'}
              </button>
              <button 
                type="button" 
                onClick={handleReset} 
                className="bg-white hover:bg-gray-50 text-slate-600 font-bold py-2.5 px-8 rounded-xl transition-all border border-gray-200 text-sm uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Reset Form
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-slate-500 text-center">
          <span className="flex items-center justify-center gap-2">
            <Wrench className="w-3 h-3" />
            Master Tool List | Final list should be approved by Tool Room Head
          </span>
        </div>
      </div>
    </div>
  );
};

export default MasterToolList;