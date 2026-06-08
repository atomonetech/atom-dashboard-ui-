import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar,
  Package,
  Wrench,
  Layers,
  CheckCircle,
  XCircle,
  Gauge,
  ClipboardList,
  User,
  MessageSquare,
  RotateCcw,
  Send,
  Hash,
  Loader2
} from "lucide-react";

// Backend URL
const BASE_URL = 'http://192.168.0.34:8000';

const For_M_Change_Ins_Form = () => {
  const navigate = useNavigate();

  // Get current date in DD.MM.YYYY format for header display only
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();
  const formattedDate = `${day}.${month}.${year}`;

  // Initial empty form state
  const initialFormState = {
    partName: "",
    partNo: "",
    operation: "",
    lotQty: "",
    okQty: "",
    rejQty: "",
    paramSpec: "",
    before: ["", "", "", "", ""],
    after: ["", "", "", "", ""],
    inspBy: "",
    remarks: ""
  };

  // Form states
  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);

  // Backend se fetch kiye gaye data ke liye states
  const [partsList, setPartsList] = useState([]);
  const [operationList, setOperationList] = useState([]);
  const [preparedBy, setPreparedBy] = useState("");

  // Component load hone par Parts fetch karna
  useEffect(() => {
    fetch(`${BASE_URL}/api/master-dropdown/?filter=all_parts`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Data format [["PartName", "PartNo"], ...]
          const formattedParts = data.map(item => ({
            part_name: item[0],
            part_no: item[1]
          }));
          setPartsList(formattedParts);
        }
      })
      .catch((err) => console.error("Error fetching parts:", err));
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "partName") {
      const selectedPart = partsList.find(p => p.part_name === value);
      const autoPartNo = selectedPart ? selectedPart.part_no : "";

      setFormData(prev => ({
        ...prev,
        partName: value,
        partNo: autoPartNo,
        operation: "" // Part change hone par operation reset
      }));

      // Part ke hisab se operations fetch karna
      if (value) {
        fetch(`${BASE_URL}/api/master-dropdown/?filter=operations_by_part&part=${encodeURIComponent(value)}`)
          .then(res => res.json())
          .then(data => setOperationList(data))
          .catch(err => console.error('Error fetching operations:', err));
      } else {
        setOperationList([]);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle before/after array changes
  const handleArrayChange = (section, index, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => i === index ? value : item)
    }));
  };

  // Handle form reset
  const handleReset = () => {
    setFormData(initialFormState);
    setOperationList([]); // Dropdown list reset
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate Required Fields
    if (!formData.partName || !formData.partNo || !formData.operation) {
      alert("Part Name, Part No, and Operation are required fields.");
      return;
    }

    // React State ko Django Fields mein map karna
    const payload = {
      part_name: formData.partName,
      part_no: formData.partNo,
      operation: formData.operation,
      lot_qty: formData.lotQty ? parseInt(formData.lotQty) : null,
      ok_qty: formData.okQty ? parseInt(formData.okQty) : null,
      rej_qty: formData.rejQty ? parseInt(formData.rejQty) : null,
      parameter_specs: formData.paramSpec,
      
      // Before Array Mapping
      before_1: formData.before[0],
      before_2: formData.before[1],
      before_3: formData.before[2],
      before_4: formData.before[3],
      before_5: formData.before[4],
      
      // After Array Mapping
      after_1: formData.after[0],
      after_2: formData.after[1],
      after_3: formData.after[2],
      after_4: formData.after[3],
      after_5: formData.after[4],
      
      inspected_by: formData.inspBy,
      remarks: formData.remarks
    };

    setIsLoading(true);

    try {
      // Django API ko hit karna
      const response = await fetch(`${BASE_URL}/api/save-4m-change/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Success
        alert(result.message || "4M Change Inspection Report saved successfully!");
        handleReset(); // Form clear karna
      } else {
        // Backend Validation Error
        console.error('Backend Error:', result);
        alert('Error saving data: ' + (result.error || 'Please check console.'));
      }
    } catch (error) {
      // Network Error
      console.error('Network Error:', error);
      alert('Failed to connect to the server. Make sure Django is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans">
      {/* Main Form Card */}
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <div className="mb-4 flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate("/production-hub")}
            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors text-sm font-bold bg-white px-4 py-2 border border-red-200 shadow-sm rounded-none tracking-wide"
          >
            <ArrowLeft className="h-4 w-4" />
            BACK TO PRODUCTION HUB
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-none shadow-md border border-gray-200 overflow-hidden">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-500 px-6 py-5 border-b border-red-300">
              <div className="hidden sm:flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <ClipboardList className="h-6 w-6 text-white/90" />
                  <h1 className="text-xl md:text-2xl font-bold text-white tracking-widest uppercase">
                    4M Change Inspection Report
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-white font-bold text-sm bg-red-700/40 px-4 py-2 rounded-none border border-white/30 shadow-sm">
                  <Calendar className="h-4 w-4" />
                  {formattedDate}
                </div>
              </div>
              
              <div className="sm:hidden flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-white/90" />
                  <h1 className="text-lg font-bold text-white text-center tracking-widest uppercase">
                    4M Change Inspection Report
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-white font-bold text-sm bg-red-700/40 px-4 py-2 border border-white/30 shadow-sm rounded-none">
                  <Calendar className="h-4 w-4" />
                  {formattedDate}
                </div>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6 space-y-6">
              
              {/* Row 1: Part Name and Part No */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    <Package className="inline h-3.5 w-3.5 mr-1 text-red-500" />
                    Part Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="partName"
                    value={formData.partName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-700 transition-colors"
                  >
                    <option value="" className="text-slate-400">Select Part Name</option>
                    {partsList.map((part, index) => (
                      <option key={index} value={part.part_name}>
                        {part.part_name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex flex-col">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    <Hash className="inline h-3.5 w-3.5 mr-1 text-red-500" />
                    Part No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="partNo"
                    value={formData.partNo}
                    readOnly
                    placeholder="Auto-filled part number"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-none focus:outline-none text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Row 2: Operation */}
              <div className="flex flex-col">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  <Wrench className="inline h-3.5 w-3.5 mr-1 text-red-500" />
                  Operation <span className="text-red-500">*</span>
                </label>
                <select
                  name="operation"
                  value={formData.operation}
                  onChange={handleChange}
                  disabled={!formData.partName}
                  className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-700 disabled:bg-slate-50 disabled:text-slate-400 transition-colors"
                >
                  <option value="" className="text-slate-400">Select Operation</option>
                  {operationList.map((op, index) => (
                    <option key={index} value={op}>{op}</option>
                  ))}
                </select>
              </div>

              {/* Row 3: Quantities & Specs (FIXED TEXT COLOR HERE) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="flex flex-col">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    <Layers className="inline h-3.5 w-3.5 mr-1 text-red-500" />
                    Lot Qty
                  </label>
                  <input type="number" name="lotQty" value={formData.lotQty} onChange={handleChange} placeholder="e.g. 100" className="w-full px-4 py-2.5 text-sm bg-white text-slate-700 border border-slate-300 rounded-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder-slate-400" />
                </div>
                <div className="flex flex-col">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    <CheckCircle className="inline h-3.5 w-3.5 mr-1 text-green-500" />
                    OK Qty
                  </label>
                  <input type="number" name="okQty" value={formData.okQty} onChange={handleChange} placeholder="e.g. 95" className="w-full px-4 py-2.5 text-sm bg-white text-slate-700 border border-slate-300 rounded-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder-slate-400" />
                </div>
                <div className="flex flex-col">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    <XCircle className="inline h-3.5 w-3.5 mr-1 text-red-500" />
                    Rej. Qty
                  </label>
                  <input type="number" name="rejQty" value={formData.rejQty} onChange={handleChange} placeholder="e.g. 5" className="w-full px-4 py-2.5 text-sm bg-white text-slate-700 border border-slate-300 rounded-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder-slate-400" />
                </div>
                <div className="flex flex-col">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    <Gauge className="inline h-3.5 w-3.5 mr-1 text-red-500" />
                    Parameter/Specs
                  </label>
                  <input type="text" name="paramSpec" value={formData.paramSpec} onChange={handleChange} placeholder="Enter specs" className="w-full px-4 py-2.5 text-sm bg-white text-slate-700 border border-slate-300 rounded-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder-slate-400" />
                </div>
              </div>

              {/* Row 4: Before (Retroactive) */}
              <div>
                <div className="flex items-center gap-2 border-b-2 border-red-200 pb-2 mb-5">
                  <Layers className="h-4 w-4 text-red-500" />
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">BEFORE (RETROACTIVE)</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <div key={`before-${index}`} className="relative mt-2">
                      <span className="absolute -top-2.5 left-3 bg-red-50 text-red-600 text-[11px] font-bold px-2 py-0.5 border border-red-200 z-10 shadow-sm">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={formData.before[index]}
                        onChange={(e) => handleArrayChange('before', index, e.target.value)}
                        placeholder={`Value ${index + 1}`}
                        className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-700 placeholder-slate-400"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 5: After / Setup Approval */}
              <div>
                <div className="flex items-center gap-2 border-b-2 border-green-200 pb-2 mb-5 mt-4">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">AFTER / SETUP APPROVAL</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <div key={`after-${index}`} className="relative mt-2">
                      <span className="absolute -top-2.5 left-3 bg-green-50 text-green-700 text-[11px] font-bold px-2 py-0.5 border border-green-200 z-10 shadow-sm">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        value={formData.after[index]}
                        onChange={(e) => handleArrayChange('after', index, e.target.value)}
                        placeholder={`Value ${index + 1}`}
                        className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-none focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-slate-700 placeholder-slate-400"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 6: Inspector and Remarks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                <div className="flex flex-col">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    <User className="inline h-3.5 w-3.5 mr-1 text-red-500" />
                    Insp. By
                  </label>
                  <input
                    type="text"
                    name="inspBy"
                    value={formData.inspBy}
                    onChange={handleChange}
                    placeholder="Inspector name"
                    className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-700 placeholder-slate-400"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    <MessageSquare className="inline h-3.5 w-3.5 mr-1 text-red-500" />
                    Remarks
                  </label>
                  <input
                    type="text"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder="Any remarks"
                    className="w-full px-4 py-2.5 text-sm bg-white border border-slate-300 rounded-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-700 placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Form Actions */}
               <div className="mt-6 sm:mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                 <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                Prepared By
              </label>
              <input
                type="text"
                value={preparedBy}
                onChange={(e) => setPreparedBy(e.target.value)}
                placeholder="Enter name"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full sm:w-64"
              />
            </div>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isLoading}
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-white text-slate-700 px-6 py-3 hover:bg-slate-50 transition-all font-bold tracking-widest border-2 border-slate-300 text-sm disabled:opacity-50 rounded-none uppercase"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-[#e03131] text-white px-8 py-3 hover:bg-[#c92a2a] transition-all shadow-sm font-bold tracking-widest text-sm disabled:opacity-70 disabled:cursor-not-allowed rounded-none uppercase"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {isLoading ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default For_M_Change_Ins_Form;