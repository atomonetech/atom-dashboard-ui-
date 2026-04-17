import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, RefreshCw, CheckCircle, Calendar } from 'lucide-react';

const WeldingFixtureList = () => {
  const navigate = useNavigate();
  const themeColor = '#0ea3e8'; // Requested Sky Blue theme

  const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const currentDate = getCurrentDate();

  const initialFormState = {
    partName: '',
    fixtureNo: '',
    operation: '',
    remarks: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.partName || !formData.fixtureNo || !formData.operation) {
      alert("Please fill all required fields (*)");
      return;
    }
    
    console.log("Welding Fixture Added:", formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    handleReset();
  };

  const handleReset = () => setFormData(initialFormState);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 font-sans overflow-x-hidden">
      
      {/* --- HEADER SECTION --- */}
      <div className="bg-white border-b border-sky-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl border border-sky-200 flex items-center justify-center text-slate-500 hover:bg-sky-50 hover:text-sky-600 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-sky-600 to-cyan-400 bg-clip-text text-transparent uppercase tracking-tighter">
                List of Welding Fixtures
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Welding Fixture Master Registry</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm font-semibold bg-sky-50 px-4 py-2 rounded-full text-sky-700 border border-sky-200">
              <Calendar className="w-3.5 h-3.5 inline mr-1" />
              {currentDate}
            </div>
            <div className="text-xs text-slate-400 bg-gray-50 px-3 py-1 rounded-full">
              Form: AOT-F-TM-09
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-md flex items-center gap-3">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium text-sm">Welding Fixture added successfully!</span>
          </div>
        )}

        {/* --- FORM CARD --- */}
        <div className="bg-white rounded-2xl shadow-xl border border-sky-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-sky-100 bg-gradient-to-r from-sky-50 to-white">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-sky-500" />
                  Fixture Entry Form
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Fill in the fixture details below</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2">
                <label className="block text-slate-700 font-semibold mb-2 text-sm uppercase tracking-wider">
                  Part Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="partName" 
                  value={formData.partName} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g. Front Bracket, Rear Panel" 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-slate-700 text-sm transition-all" 
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-sm uppercase tracking-wider">
                  Fixture / No. <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="fixtureNo" 
                  value={formData.fixtureNo} 
                  onChange={handleChange} 
                  required 
                  placeholder="Unique Fixture ID" 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-slate-700 text-sm transition-all" 
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-2 text-sm uppercase tracking-wider">
                  Operation <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="operation" 
                  value={formData.operation} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g. Welding, Spot, Assembly" 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-slate-700 text-sm transition-all" 
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-700 font-semibold mb-2 text-sm uppercase tracking-wider">
                  Remarks
                </label>
                <textarea 
                  name="remarks" 
                  value={formData.remarks} 
                  onChange={handleChange} 
                  rows={2}
                  placeholder="Condition / Location / Additional notes..." 
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-slate-700 text-sm transition-all resize-none" 
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
              <button 
                type="submit" 
                className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-bold py-2.5 px-8 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                style={{backgroundColor: themeColor}}
              >
                <Plus className="w-4 h-4" />
                Add Fixture
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
            Welding Fixture List | Form: AOT-F-TM-09
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeldingFixtureList;