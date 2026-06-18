
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Package, Calendar } from 'lucide-react';
import { getApiUrl } from '../../../../config/api';
import axios from "axios";
const API_LOG = `${
  process.env.REACT_APP_API_URL || "http://localhost:8000"
}/api/log-report/`;

const ToolCriticalSparesForm = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const initialState = {
    date: '',
    spareDescription: '',
    modelDescription: '',
    spareType: 'REPLACEMENT',
    uom: '',
    openingStock: '',
    minimumLevel: '',
    leadTime: '',
    boxLocation: 'STORE ROOM',
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setCurrentDate(today);
    setFormData(prev => ({ ...prev, date: today }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(getApiUrl('/api/tool-critical-spare/save/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
         const currentUser = localStorage.getItem("username") || "Unknown User";

        try {
          await axios.post(API_LOG, {
            username: currentUser,
            report_name: "Tool criticalSpare Mentinance Form", // Yahan hardcode kar diya form ka naam
          });
          console.log("Activity log successfully saved!");
        } catch (logError) {
          console.error("Activity log save karne mein error aayi:", logError);
        }
        setSubmitted(true);
        setFormData({ ...initialState, date: currentDate });
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        alert("Failed to save tool critical spare record.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while saving the data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Spare Part Description</label>
              <input
                type="text"
                name="spareDescription"
                required
                value={formData.spareDescription}
                placeholder="e.g., TIG WELDING NOZZLE"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 transition-all"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Model Description / Box No</label>
              <input
                type="text"
                name="modelDescription"
                value={formData.modelDescription}
                placeholder="Enter model or box identifier"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 transition-all"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Spare Type</label>
              <select 
                name="spareType"
                value={formData.spareType}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white text-gray-900 transition-all"
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
                value={formData.boxLocation}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 transition-all"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2 sm:col-span-2 md:col-span-1">
              <label className="block text-sm font-semibold text-gray-700">Lead Time</label>
              <input
                type="text"
                name="leadTime"
                value={formData.leadTime}
                placeholder="e.g., 2 Days"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-gray-900 transition-all"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 text-pink-700">Opening Stock</label>
              <input
                type="number"
                name="openingStock"
                value={formData.openingStock}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-gray-900 transition-all"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 text-pink-700">Minimum Level</label>
              <input
                type="number"
                name="minimumLevel"
                value={formData.minimumLevel}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-gray-900 transition-all"
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 text-pink-700">UOM</label>
              <input
                type="text"
                name="uom"
                value={formData.uom}
                placeholder="e.g., Nos"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none text-gray-900 transition-all"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col items-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting || submitted}
              className={`w-full md:w-auto flex items-center justify-center px-12 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
                submitted 
                ? 'bg-green-500 text-white cursor-default' 
                : isSubmitting 
                ? 'bg-slate-400 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-200'
              }`}
            >
              {submitted ? (
                <>Success! Data Saved</>
              ) : isSubmitting ? (
                <>Submitting...</>
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

// import React, { useState, useEffect } from 'react';
// import { ArrowLeft, Save, Package, Calendar } from 'lucide-react';
// import { getApiUrl } from '../../../../config/api';

// const ToolCriticalSparesForm = () => {
//   const [currentDate, setCurrentDate] = useState('');
//   const [submitted, setSubmitted] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   const initialState = {
//     date: '',
//     spareDescription: '',
//     modelDescription: '',
//     spareType: 'REPLACEMENT',
//     uom: '',
//     openingStock: '',
//     minimumLevel: '',
//     leadTime: '',
//     boxLocation: 'STORE ROOM',
//   };

//   const [formData, setFormData] = useState(initialState);

//   useEffect(() => {
//     const today = new Date().toISOString().split('T')[0];
//     setCurrentDate(today);
//     setFormData(prev => ({ ...prev, date: today }));
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const response = await fetch(getApiUrl('/api/tool-critical-spare/save/'), {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData)
//       });

//       if (response.ok) {
//         setSubmitted(true);
//         setFormData({ ...initialState, date: currentDate });
//         setTimeout(() => setSubmitted(false), 3000);
//       } else {
//         alert("Failed to save tool critical spare record.");
//       }
//     } catch (error) {
//       console.error("Error saving data:", error);
//       alert("An error occurred while saving the data.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
//       <div className="max-w-4xl mx-auto mb-6">
//         <button 
//           onClick={() => window.history.back()}
//           className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-200 font-medium group"
//         >
//           <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
//           Back to Dashboard
//         </button>
//       </div>

//       <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
//         <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 p-6 md:p-10 text-white text-center">
//           <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4 uppercase leading-tight">
//             Critical Spare Part List <br className="hidden md:block" /> Machine Maintenance
//           </h1>
//           <div className="flex flex-wrap justify-center items-center gap-4 text-indigo-100 text-xs md:text-sm">
//             <span className="flex items-center"><Package className="w-4 h-4 mr-1.5"/> ATOMONE TECHNOLOGIES</span>
//             <span className="hidden md:block h-4 w-px bg-indigo-400"></span>
//             <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5"/> {currentDate}</span>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <label className="block text-sm font-semibold text-gray-700">Spare Part Description</label>
//               <input
//                 type="text"
//                 name="spareDescription"
//                 required
//                 value={formData.spareDescription}
//                 placeholder="e.g., TIG WELDING NOZZLE"
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="block text-sm font-semibold text-gray-700">Model Description / Box No</label>
//               <input
//                 type="text"
//                 name="modelDescription"
//                 value={formData.modelDescription}
//                 placeholder="Enter model or box identifier"
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//             <div className="space-y-2">
//               <label className="block text-sm font-semibold text-gray-700">Spare Type</label>
//               <select 
//                 name="spareType"
//                 value={formData.spareType}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white transition-all"
//                 onChange={handleChange}
//               >
//                 <option value="REPLACEMENT">REPLACEMENT</option>
//                 <option value="REPAIR">REPAIR</option>
//               </select>
//             </div>

//             <div className="space-y-2">
//               <label className="block text-sm font-semibold text-gray-700">Location</label>
//               <input
//                 type="text"
//                 name="boxLocation"
//                 value={formData.boxLocation}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="space-y-2 sm:col-span-2 md:col-span-1">
//               <label className="block text-sm font-semibold text-gray-700">Lead Time</label>
//               <input
//                 type="text"
//                 name="leadTime"
//                 value={formData.leadTime}
//                 placeholder="e.g., 2 Days"
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300 grid grid-cols-1 sm:grid-cols-3 gap-6">
//             <div className="space-y-2">
//               <label className="block text-sm font-semibold text-gray-700 text-pink-700">Opening Stock</label>
//               <input
//                 type="number"
//                 name="openingStock"
//                 value={formData.openingStock}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition-all"
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="block text-sm font-semibold text-gray-700 text-pink-700">Minimum Level</label>
//               <input
//                 type="number"
//                 name="minimumLevel"
//                 value={formData.minimumLevel}
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition-all"
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="space-y-2">
//               <label className="block text-sm font-semibold text-gray-700 text-pink-700">UOM</label>
//               <input
//                 type="text"
//                 name="uom"
//                 value={formData.uom}
//                 placeholder="e.g., Nos"
//                 className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition-all"
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div className="flex flex-col items-center pt-6">
//             <button
//               type="submit"
//               disabled={isSubmitting || submitted}
//               className={`w-full md:w-auto flex items-center justify-center px-12 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
//                 submitted 
//                 ? 'bg-green-500 text-white cursor-default' 
//                 : isSubmitting 
//                 ? 'bg-slate-400 text-white cursor-not-allowed'
//                 : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-200'
//               }`}
//             >
//               {submitted ? (
//                 <>Success! Data Saved</>
//               ) : isSubmitting ? (
//                 <>Submitting...</>
//               ) : (
//                 <>
//                   <Save className="w-5 h-5 mr-2" />
//                   Submit Part Entry
//                 </>
//               )}
//             </button>
//             <p className="mt-6 text-[10px] md:text-xs text-gray-400 uppercase tracking-[0.2em] text-center">
//               ADTPL-MANTC • Prepared & Approved
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ToolCriticalSparesForm;
