import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Package, Calendar } from 'lucide-react';

const ToolCriticalSparesForm = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    spareDescription: '',
    modelDescription: '',
    spareType: 'REPLACEMENT',
    uom: '',
    openingStock: '',
    minimumLevel: '',
    leadTime: '',
    boxLocation: 'STORE ROOM',
  });

  // Initialize form with current date on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setCurrentDate(today);
    setFormData(prev => ({ ...prev, date: today }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to save data (e.g., localStorage or API)
    console.log('Form Submitted and Saved:', formData);
    setSubmitted(true);
    
    // Reset success state after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      {/* Navigation Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-200 font-medium group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Responsive Gradient Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 p-6 md:p-10 text-white text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4 uppercase leading-tight">
            Critical Spare Part List <br className="hidden md:block" /> Machine Maintenance
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-4 text-indigo-100 text-xs md:text-sm">
            <span className="flex items-center"><Package className="w-4 h-4 mr-1.5"/> ATOMONE TECHNOLOGIES</span>
            <span className="hidden md:block h-4 w-px bg-indigo-400"></span>
            <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5"/> {currentDate}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
          {/* Section 1: Basic Information - Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Spare Part Description</label>
              <input
                type="text"
                name="spareDescription"
                required
                placeholder="e.g., TIG WELDING NOZZLE"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Model Description / Box No</label>
              <input
                type="text"
                name="modelDescription"
                placeholder="Enter model or box identifier"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Section 2: Stock & Logistics - Responsive 3-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Spare Type</label>
              <select 
                name="spareType"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white transition-all"
                onChange={handleChange}
              >
                <option value="REPLACEMENT">REPLACEMENT</option>
                <option value="REPAIR">REPAIR</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Location</label>
              <input
                type="text"
                name="boxLocation"
                defaultValue="STORE ROOM"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2 sm:col-span-2 md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700">Lead Time</label>
              <input
                type="text"
                name="leadTime"
                placeholder="e.g., 2 Days"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Section 3: Quantities - Highlighted Section */}
          <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 text-pink-700">Opening Stock</label>
              <input
                type="number"
                name="openingStock"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 text-pink-700">Minimum Level</label>
              <input
                type="number"
                name="minimumLevel"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 text-pink-700">UOM</label>
              <input
                type="text"
                name="uom"
                placeholder="e.g., Nos"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit Button Section */}
          <div className="flex flex-col items-center pt-6">
            <button
              type="submit"
              disabled={submitted}
              className={`w-full md:w-auto flex items-center justify-center px-12 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
                submitted 
                ? 'bg-green-500 text-white cursor-default' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-200'
              }`}
            >
              {submitted ? (
                <>Success! Data Saved</>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Submit Part Entry
                </>
              )}
            </button>
            <p className="mt-6 text-[10px] md:text-xs text-gray-400 uppercase tracking-[0.2em] text-center">
              ADTPL-MANTC • Prepared & Approved
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ToolCriticalSparesForm;