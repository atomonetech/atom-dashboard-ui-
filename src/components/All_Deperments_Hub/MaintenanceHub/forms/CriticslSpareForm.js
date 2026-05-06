import React, { useState } from 'react';
import { 
  ArrowLeft, Save, Package, Calendar, MapPin, Box, 
  AlertTriangle, TrendingUp, TrendingDown, Clock, User, 
  CheckCircle, Wrench
} from 'lucide-react';
import { getApiUrl } from '../../../../config/api';

const CriticalSpareForm = () => {
  const getCurrentDate = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const initialState = {
    spareDescription: '',
    modelDescription: '',
    boxLocation: 'STORE ROOM',
    spareType: 'REPLACEMENT',
    uom: 'Nos',
    openingStock: '',
    minimumLevel: '',
    maximumLevel: '',
    reorderLevel: '',
    leadTime: '',
    closingStock: '',
    prStatus: '',
    preparedBy: '',
    approvedBy: ''
  };

  const [currentDate] = useState(getCurrentDate());
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.spareDescription || !formData.openingStock || !formData.minimumLevel || !formData.leadTime) {
      alert('Please fill in all required fields (*)');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(getApiUrl('/api/machine-critical-spare/save/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: currentDate
        })
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setFormData(initialState);
      } else {
        alert("Failed to save critical spare record.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while saving the data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 p-3 sm:p-4 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-3 sm:mb-4">
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white border border-sky-200 rounded-lg shadow-sm hover:bg-sky-50 hover:shadow-md transition-all duration-200 text-slate-700 font-medium text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-sky-500" />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden border border-sky-100">
          <div className="bg-gradient-to-r from-[#0ea5e9] via-[#0ea5e9] to-sky-300 p-5 sm:p-6 md:p-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight mb-2 uppercase text-center text-white">
              Critical Spare Part List - Machine Maintenance
            </h1>
            <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 text-sky-100 text-xs sm:text-sm">
              <span className="flex items-center gap-1">
                <Package className="w-3 h-3 sm:w-4 sm:h-4" /> 
                ATOMONE TECHNOLOGIES
              </span>
              <span className="hidden sm:inline h-4 w-px bg-sky-300"></span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" /> 
                Current Date: {currentDate}
              </span>
            </div>
          </div>

          {showSuccess && (
            <div className="mx-4 sm:mx-6 mt-4 sm:mt-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-3 sm:p-4 rounded-lg shadow-md flex items-center gap-2 sm:gap-3">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">Spare part added successfully! Form has been reset.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
            
            {/* Section 1: Basic Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-1 bg-[#0ea5e9] rounded-full"></div>
                <h2 className="text-base sm:text-lg font-bold text-slate-700 uppercase tracking-wide">Basic Information</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-2 lg:col-span-2">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
                    <Wrench className="w-3 h-3 sm:w-4 sm:h-4 text-[#0ea5e9]" />
                    SPARE PART DESCRIPTION <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="spareDescription"
                    required
                    value={formData.spareDescription}
                    onChange={handleChange}
                    placeholder="e.g., TIG WELDING NOZZLE, BEARING 6218, SOLENOID VALVE"
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ea5e9] focus:border-[#0ea5e9] transition-all outline-none text-slate-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
                    <Box className="w-3 h-3 sm:w-4 sm:h-4 text-[#0ea5e9]" />
                    MODEL DESCRIPTION / BOX NO. / LOCATION
                  </label>
                  <input
                    type="text"
                    name="modelDescription"
                    value={formData.modelDescription}
                    onChange={handleChange}
                    placeholder="e.g., PROGRESSIVE BLOCK, STORE ROOM"
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ea5e9] focus:border-[#0ea5e9] transition-all outline-none text-slate-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#0ea5e9]" />
                    LOCATION
                  </label>
                  <input
                    type="text"
                    name="boxLocation"
                    value={formData.boxLocation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#0ea5e9] focus:border-[#0ea5e9] transition-all outline-none text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Spare Details */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-1 bg-[#0ea5e9] rounded-full"></div>
                <h2 className="text-base sm:text-lg font-bold text-slate-700 uppercase tracking-wide">Spare Details</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
                    <Package className="w-3 h-3 sm:w-4 sm:h-4 text-[#0ea5e9]" />
                    SPARE TYPE
                  </label>
                  <select 
                    name="spareType"
                    value={formData.spareType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ea5e9] focus:border-[#0ea5e9] transition-all outline-none bg-white text-slate-700"
                  >
                    <option value="REPLACEMENT">REPLACEMENT</option>
                    <option value="REPAIR">REPAIR</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-[#0ea5e9]" />
                    UOM (Unit of Measure)
                  </label>
                  <select
                    name="uom"
                    value={formData.uom}
                    onChange={handleChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ea5e9] focus:border-[#0ea5e9] transition-all outline-none bg-white text-slate-700"
                  >
                    <option value="Nos">Nos</option>
                    <option value="Pcs">Pcs</option>
                    <option value="Mtr">Mtr</option>
                    <option value="Kg">Kg</option>
                    <option value="Set">Set</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[#0ea5e9]" />
                    LEAD TIME <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="leadTime"
                    required
                    value={formData.leadTime}
                    onChange={handleChange}
                    placeholder="e.g., 2 Days, 1 Week"
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ea5e9] focus:border-[#0ea5e9] transition-all outline-none text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Stock Levels */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-1 bg-[#0ea5e9] rounded-full"></div>
                <h2 className="text-base sm:text-lg font-bold text-slate-700 uppercase tracking-wide">Stock Management</h2>
              </div>
              
              <div className="bg-gradient-to-br from-sky-50 to-white p-4 sm:p-6 rounded-xl border border-sky-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-[#0ea5e9]" />
                      OPENING STOCK <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="openingStock"
                      required
                      value={formData.openingStock}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ea5e9] focus:border-[#0ea5e9] transition-all outline-none text-slate-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
                      <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-[#0ea5e9]" />
                      MINIMUM LEVEL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="minimumLevel"
                      required
                      value={formData.minimumLevel}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ea5e9] focus:border-[#0ea5e9] transition-all outline-none text-slate-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-[#0ea5e9]" />
                      MAXIMUM LEVEL
                    </label>
                    <input
                      type="number"
                      name="maximumLevel"
                      value={formData.maximumLevel}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ea5e9] focus:border-[#0ea5e9] transition-all outline-none text-slate-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
                      <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-[#0ea5e9]" />
                      RE-ORDER LEVEL
                    </label>
                    <input
                      type="number"
                      name="reorderLevel"
                      value={formData.reorderLevel}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ea5e9] focus:border-[#0ea5e9] transition-all outline-none text-slate-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
                      <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-[#0ea5e9]" />
                      CLOSING STOCK
                    </label>
                    <input
                      type="number"
                      name="closingStock"
                      value={formData.closingStock}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ea5e9] focus:border-[#0ea5e9] transition-all outline-none text-slate-700"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
                      <Package className="w-3 h-3 sm:w-4 sm:h-4 text-[#0ea5e9]" />
                      PR STATUS
                    </label>
                    <select
                      name="prStatus"
                      value={formData.prStatus}
                      onChange={handleChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ea5e9] focus:border-[#0ea5e9] transition-all outline-none bg-white text-slate-700"
                    >
                      <option value="">Select Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="In Process">In Process</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Authorization */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-1 bg-[#0ea5e9] rounded-full"></div>
                <h2 className="text-base sm:text-lg font-bold text-slate-700 uppercase tracking-wide">Authorization</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-[#0ea5e9]" />
                    PREPARED BY
                  </label>
                  <input
                    type="text"
                    name="preparedBy"
                    value={formData.preparedBy}
                    onChange={handleChange}
                    placeholder="Name / Signature"
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ea5e9] focus:border-[#0ea5e9] transition-all outline-none text-slate-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-[#0ea5e9]" />
                    APPROVED BY
                  </label>
                  <input
                    type="text"
                    name="approvedBy"
                    value={formData.approvedBy}
                    onChange={handleChange}
                    placeholder="Name / Signature"
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0ea5e9] focus:border-[#0ea5e9] transition-all outline-none text-slate-700"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full sm:w-auto text-white font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-base sm:text-lg ${
                  isSubmitting 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#0ea5e9] to-sky-400 hover:from-[#0ea5e9] hover:to-sky-500 transform hover:scale-105 active:scale-95'
                }`}
              >
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                {isSubmitting ? 'Submitting...' : 'Submit Spare Part Entry'}
              </button>
              <p className="mt-4 text-xs text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Package className="w-3 h-3" />
                ADTPL-MANTC • Prepared & Approved
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CriticalSpareForm;