import React, { useState, useEffect } from 'react'
import { 
  ArrowLeft, Save, RotateCcw, Calendar, User, Package, 
  Hash, Settings, Cpu, Target, MessageSquare, Loader2, 
  CheckCircle, Factory, Check, X, 
  Clock, Wrench, AlertTriangle, Layers
} from 'lucide-react'

const BASE_URL = 'http://192.168.0.34:8000';

const PLANT_MAP = {
  'Plant 1': 'plant_1',
  'Plant 2': 'plant_2',
};

// FIXED FUNCTION
const getLocalTodayDate = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const localDate = new Date(now.getTime() - offset);
  return localDate.toISOString().split('T')[0];
};

const DailyProdForm = () => {
  const [selectedDate, setSelectedDate] = useState(getLocalTodayDate());

  const [operatorNames, setOperatorNames] = useState([]);
  const [operatorsLoading, setOperatorsLoading] = useState(false);
  
  const [machineList, setMachineList] = useState([]);
  const [machinesLoading, setMachinesLoading] = useState(false);
  
  const [partsData, setPartsData] = useState([]); 
  const [operationNames, setOperationNames] = useState([]);

  const [isAddingNewOperator, setIsAddingNewOperator] = useState(false);
  const [newOperatorName, setNewOperatorName] = useState('');
  const [isSavingOperator, setIsSavingOperator] = useState(false);

  const [filledMachines, setFilledMachines] = useState([]);
  const [showWarning, setShowWarning] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    plant: '', 
    machineNo: '',
    operatorName: '',
    partName: '',
    partNo: '',
    operationName: '',
    plannedQuantity: '',
    achievedQuantity: '',
    qtyRemark: '',
    productionStartTime: '',
    productionEndTime: '',
    totalWorkingTime: '',
    toolSetupTime: '',
    machineBdTime: '',
    toolBdTime: '',
    rmCoilNo: ''
  })

  useEffect(() => {
    fetch(`${BASE_URL}/api/master-dropdown/?filter=all_parts`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const formattedParts = data.map(item => ({
            part_name: item[0], 
            part_no: item[1]    
          }));
          setPartsData(formattedParts);
        } else {
          setPartsData([]);
        }
      })
      .catch(err => console.error('Error fetching parts:', err));
  }, []);

  useEffect(() => {
    const selectedPlant = formData.plant;
    
    if (!selectedPlant) {
      setOperatorNames([]);
      setMachineList([]);
      setFilledMachines([]);
      return;
    }

    const plantKey = PLANT_MAP[selectedPlant];

    setOperatorsLoading(true);
    fetch(`${BASE_URL}/api/operators/?plant=${plantKey}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOperatorNames(data.operators);
        } else {
          setOperatorNames(Array.isArray(data) ? data : []);
        }
      })
      .catch(err => console.error('Error fetching operators:', err))
      .finally(() => setOperatorsLoading(false));

    setMachinesLoading(true);
    fetch(`${BASE_URL}/api/machines/list/?plant=${plantKey}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMachineList(data.machines);
        } else {
          setMachineList([]);
        }
      })
      .catch(err => console.error('Error fetching machines:', err))
      .finally(() => setMachinesLoading(false));

    fetch(`${BASE_URL}/api/get-today-production-data/?plant_name=${plantKey}&date=${selectedDate}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFilledMachines(data.filled_machines || []);
        } else {
          setFilledMachines([]);
        }
      })
      .catch(err => console.error('Error fetching filled machines:', err));

  }, [formData.plant, selectedDate]);

  useEffect(() => {
    if (formData.machineNo) {
      const isFilled = filledMachines.some(fm => String(fm) === String(formData.machineNo));
      setShowWarning(isFilled);
    } else {
      setShowWarning(false);
    }
  }, [formData.machineNo, filledMachines]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'operatorName' && value === 'ADD_NEW') {
      setIsAddingNewOperator(true);
      return;
    }

    if (name === 'plant') {
      setFormData(prev => ({
        ...prev,
        plant: value,
        operatorName: '', 
        machineNo: ''
      }));
    }
    else if (name === 'partName') {
      const selectedPart = partsData.find(p => p.part_name === value);
      const autoPartNo = selectedPart ? selectedPart.part_no : '';

      setFormData(prev => ({
        ...prev,
        partName: value,
        partNo: autoPartNo, 
        operationName: ''   
      }));

      if (value) {
        fetch(`${BASE_URL}/api/master-dropdown/?filter=operations_by_part&part=${encodeURIComponent(value)}`)
          .then(res => res.json())
          .then(data => setOperationNames(data))
          .catch(err => console.error('Error fetching operations:', err));
      } else {
        setOperationNames([]);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }

  const handleSaveNewOperator = async () => {
    const opName = newOperatorName.trim();
    if (!opName) return;
    setIsSavingOperator(true);
    try {
      const response = await fetch(`${BASE_URL}/api/operators/add/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: opName, plant: PLANT_MAP[formData.plant] })
      });
      const result = await response.json();
      if (response.ok) { 
        setOperatorNames(prev => [...prev, { name: opName }]);
        setFormData(prev => ({ ...prev, operatorName: opName }));
        setIsAddingNewOperator(false);
        setNewOperatorName('');
      } else {
        alert('Failed to save operator: ' + (result.message || result.error));
      }
    } catch (error) {
      alert('Network Error: Could not save operator.');
    } finally {
      setIsSavingOperator(false);
    }
  };

  const handleReset = () => {
    setFormData({
      plant: '', machineNo: '', operatorName: '', partName: '',
      partNo: '', operationName: '', plannedQuantity: '',
      achievedQuantity: '', qtyRemark: '',
      productionStartTime: '', productionEndTime: '', totalWorkingTime: '',
      toolSetupTime: '', machineBdTime: '', toolBdTime: '', rmCoilNo: ''
    });
    setOperationNames([]); 
    setIsAddingNewOperator(false);
    setShowWarning(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (showWarning) {
      alert(`Machine ${formData.machineNo} ka data is date (${selectedDate}) ke liye pehle hi bhara ja chuka hai! Aap wapas submit nahi kar sakte.`);
      return;
    }
    
    const requiredFields = ['plant', 'machineNo', 'operatorName', 'partName', 'partNo', 'operationName', 'plannedQuantity']
    const missingFields = requiredFields.filter(field => !formData[field])
    
    if (missingFields.length > 0) {
      alert('Please fill all required fields')
      return
    }

    const payload = {
      date: selectedDate,
      plant: PLANT_MAP[formData.plant], 
      machine_no: formData.machineNo,
      operator_name: formData.operatorName,
      part_name: formData.partName,
      part_no: formData.partNo,
      operation_name: formData.operationName,
      planned_quantity: parseInt(formData.plannedQuantity), 
      achieved_quantity: formData.achievedQuantity ? parseInt(formData.achievedQuantity) : 0, 
      qty_remark: formData.qtyRemark,
      production_start_time: formData.productionStartTime,
      production_end_time: formData.productionEndTime,
      total_working_time: formData.totalWorkingTime,
      tool_setup_time: formData.toolSetupTime ? parseInt(formData.toolSetupTime) : 0,
      machine_bd_time: formData.machineBdTime ? parseInt(formData.machineBdTime) : 0,
      tool_bd_time: formData.toolBdTime ? parseInt(formData.toolBdTime) : 0,
      rm_coil_no: formData.rmCoilNo
    };

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/save-daily-production/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(result.message);
        setFilledMachines(prev => [...prev, formData.machineNo]);
        handleReset();
      } else {
        alert('Error saving data: ' + (result.error || 'Please check console for details.'));
      }
    } catch (error) {
      alert('Failed to connect to the server. Make sure Django is running.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleBack = () => {
    window.location.href = '/production-hub';
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 flex justify-center">
      <div className="w-full max-w-7xl">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          
          <div className="px-4 sm:px-6 pt-4 sm:pt-6">
            <button type="button" onClick={handleBack} className="inline-flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors font-medium">
              <ArrowLeft size={18} /> Back to Production Page
            </button>
          </div>

          <div className="border-b border-slate-200 px-4 sm:px-6 pb-4 bg-slate-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#3b82f5]/10 rounded-lg flex-shrink-0">
                  <Package size={24} className="text-[#3b82f5]" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold text-blue-500">Daily Production Plan</h1>
                  <p className="text-xs text-slate-600">Manufacturing Execution System</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-500 rounded-lg shadow-sm">
                  <Calendar size={14} className="text-blue-700" />
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="text-sm font-medium text-slate-700 bg-transparent outline-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            
            {showWarning && formData.machineNo && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="text-red-500" size={24} />
                        <div>
                            <h3 className="text-red-800 font-bold text-sm">⚠️ Machine Already Filled!</h3>
                            <p className="text-red-700 text-sm">
                                Machine {formData.machineNo} ki Date: {selectedDate} ke liye production entry pehle hi ho chuki hai! Aap doobara submit nahi kar sakte.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Factory size={14} className="inline mr-1 text-blue-500" /> Plant <span className="text-red-500">*</span>
                </label>
                <select name="plant" value={formData.plant} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700">
                  <option value="">Select Plant</option>
                  {Object.keys(PLANT_MAP).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Cpu size={14} className="inline mr-1 text-blue-500" /> Machine No <span className="text-red-500">*</span>
                </label>
                <select name="machineNo" value={formData.machineNo} onChange={handleChange} disabled={!formData.plant || machinesLoading} className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 disabled:bg-slate-50 disabled:text-slate-400">
                  <option value="">{machinesLoading ? 'Loading...' : !formData.plant ? 'Select Plant First' : 'Select Machine'}</option>
                  {machineList.map(m => {
                    const isFilled = filledMachines.some(fm => String(fm) === String(m));
                    return (
                        <option 
                            key={m} 
                            value={m}
                            style={{ 
                                backgroundColor: isFilled ? '#fef2f2' : 'white',
                                color: isFilled ? '#991b1b' : 'inherit'
                            }}
                        >
                            Machine {m} {isFilled ? '✓ (Filled Today)' : ''}
                        </option>
                    )
                  })}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <User size={14} className="inline mr-1 text-blue-500" /> Operator Name <span className="text-red-500">*</span>
                </label>
                {isAddingNewOperator ? (
                  <div className="flex gap-2 h-[38px]">
                    <input type="text" autoFocus placeholder="Enter Name" value={newOperatorName} onChange={(e) => setNewOperatorName(e.target.value)} disabled={isSavingOperator} className="w-full px-3 py-1 text-sm bg-white border border-[#3b82f5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3b82f5] text-slate-700 disabled:bg-slate-100" />
                    <button type="button" onClick={handleSaveNewOperator} disabled={isSavingOperator || !newOperatorName.trim()} className="px-2 py-1 bg-[#3b82f5] text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center disabled:opacity-50">
                      {isSavingOperator ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    </button>
                    <button type="button" onClick={() => setIsAddingNewOperator(false)} disabled={isSavingOperator} className="px-2 py-1 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition disabled:opacity-50">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <select name="operatorName" value={formData.operatorName} onChange={handleChange} disabled={!formData.plant || operatorsLoading} className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 disabled:bg-slate-50 disabled:text-slate-400">
                    <option value="">{operatorsLoading ? 'Loading...' : !formData.plant ? 'Select Plant First' : 'Select Operator'}</option>
                    {operatorNames.map((op, index) => <option key={op.id || index} value={op.name}>{op.name}</option>)}
                    {formData.plant && !operatorsLoading && (
                      <option value="ADD_NEW" className="font-semibold text-blue-600 bg-blue-50">+ Add New Operator</option>
                    )}
                  </select>
                )}
              </div>

              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Package size={14} className="inline mr-1 text-blue-500" /> Part Name <span className="text-red-500">*</span>
                </label>
                <select name="partName" value={formData.partName} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700">
                  <option value="" className="text-slate-500">Select Part</option>
                  {partsData.map((part, index) => <option key={index} value={part.part_name}>{part.part_name}</option>)}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Hash size={14} className="inline mr-1 text-blue-500" /> Part No <span className="text-red-500">*</span>
                </label>
                <input type="text" name="partNo" value={formData.partNo} readOnly placeholder="Auto-filled part number" className="w-full px-3 py-2 text-sm bg-slate-100 border border-slate-300 rounded-lg text-slate-500 cursor-not-allowed focus:outline-none" />
              </div>

              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Settings size={14} className="inline mr-1 text-blue-500" /> Operation Name <span className="text-red-500">*</span>
                </label>
                <select name="operationName" value={formData.operationName} onChange={handleChange} disabled={!formData.partName} className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 disabled:bg-slate-50 disabled:text-slate-400">
                  <option value="" className="text-slate-500">Select Operation</option>
                  {operationNames.map((op, index) => <option key={index} value={op}>{op}</option>)}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Target size={14} className="inline mr-1 text-blue-500" /> Planned Quantity <span className="text-red-500">*</span>
                </label>
                <input type="number" name="plannedQuantity" value={formData.plannedQuantity} onChange={handleChange} placeholder="Target quantity" className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400" />
              </div>

              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <CheckCircle size={14} className="inline mr-1 text-green-500" /> Achieved Qty. (Optional)
                </label>
                <input type="number" name="achievedQuantity" value={formData.achievedQuantity} onChange={handleChange} placeholder="Actual quantity" className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400" />
              </div>

              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Clock size={14} className="inline mr-1 text-blue-500" /> Prod. Start Time
                </label>
                <input type="time" name="productionStartTime" value={formData.productionStartTime} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700" />
              </div>

              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Clock size={14} className="inline mr-1 text-blue-500" /> Prod. End Time
                </label>
                <input type="time" name="productionEndTime" value={formData.productionEndTime} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700" />
              </div>

              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Clock size={14} className="inline mr-1 text-blue-500" /> Total Working Time
                </label>
                <input type="text" name="totalWorkingTime" value={formData.totalWorkingTime} onChange={handleChange} placeholder="e.g. 8 hrs or 480 mins" className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400" />
              </div>

              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Wrench size={14} className="inline mr-1 text-orange-500" /> Tool Set-up Time
                </label>
                <input type="number" name="toolSetupTime" value={formData.toolSetupTime} onChange={handleChange} placeholder="In minutes" className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400" />
              </div>

              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <AlertTriangle size={14} className="inline mr-1 text-red-500" /> Machine B/D Time
                </label>
                <input type="number" name="machineBdTime" value={formData.machineBdTime} onChange={handleChange} placeholder="In minutes" className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400" />
              </div>

              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <AlertTriangle size={14} className="inline mr-1 text-red-500" /> Tool B/D Time
                </label>
                <input type="number" name="toolBdTime" value={formData.toolBdTime} onChange={handleChange} placeholder="In minutes" className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400" />
              </div>

              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Layers size={14} className="inline mr-1 text-indigo-500" /> RM Coil / Lot No.
                </label>
                <input type="text" name="rmCoilNo" value={formData.rmCoilNo} onChange={handleChange} placeholder="Enter lot or coil number" className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400" />
              </div>

              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <MessageSquare size={14} className="inline mr-1 text-blue-500" /> Qty. Remark
                </label>
                <input type="text" name="qtyRemark" value={formData.qtyRemark} onChange={handleChange} placeholder="Any remarks?" className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400" />
              </div>

            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mt-8 pt-4 border-t border-slate-200">
              <button type="button" onClick={handleReset} disabled={isLoading} className="w-full sm:w-auto px-4 py-2 text-sm border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50">
                <RotateCcw size={14} /> Reset
              </button>
              <button type="submit" disabled={isLoading || showWarning} className="w-full sm:w-auto px-4 py-2 text-sm bg-[#3b82f5] text-white rounded-lg hover:bg-[#2563eb] transition-colors flex items-center justify-center gap-2 font-medium shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {isLoading ? 'Saving...' : 'Save Production Plan'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default DailyProdForm



// import React, { useState, useEffect } from 'react'
// import { 
//   ArrowLeft, Save, RotateCcw, Calendar, User, Package, 
//   Hash, Settings, Cpu, Target, MessageSquare, Loader2, 
//   CheckCircle, Factory, Check, X, 
//   Clock, Wrench, AlertTriangle, Layers
// } from 'lucide-react'

// const BASE_URL = 'http://192.168.0.34:8000';

// const PLANT_MAP = {
//   'Plant 1': 'plant_1',
//   'Plant 2': 'plant_2',
// };

// // Local date nikalne ka function
// const getLocalTodayDate = () => {
//   const today = new Date();
//   const year = today.getFullYear();
//   const month = String(today.getMonth() + 1).padStart(2, '0');
//   const day = String(today.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// };

// const DailyProdForm = () => {
//   // --- DATE STATE ADD KI GAYI HAI ---
//   const [selectedDate, setSelectedDate] = useState(getLocalTodayDate());

//   // API states
//   const [operatorNames, setOperatorNames] = useState([]);
//   const [operatorsLoading, setOperatorsLoading] = useState(false);
  
//   const [machineList, setMachineList] = useState([]);
//   const [machinesLoading, setMachinesLoading] = useState(false);
  
//   const [partsData, setPartsData] = useState([]); 
//   const [operationNames, setOperationNames] = useState([]);

//   // Operator States
//   const [isAddingNewOperator, setIsAddingNewOperator] = useState(false);
//   const [newOperatorName, setNewOperatorName] = useState('');
//   const [isSavingOperator, setIsSavingOperator] = useState(false);

//   // Filled Machines States
//   const [filledMachines, setFilledMachines] = useState([]);
//   const [showWarning, setShowWarning] = useState(false);

//   // Form states 
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     plant: '', 
//     machineNo: '',
//     operatorName: '',
//     partName: '',
//     partNo: '',
//     operationName: '',
//     plannedQuantity: '',
//     achievedQuantity: '',
//     qtyRemark: '',
//     productionStartTime: '',
//     productionEndTime: '',
//     totalWorkingTime: '',
//     toolSetupTime: '',
//     machineBdTime: '',
//     toolBdTime: '',
//     rmCoilNo: ''
//   })

//   // 1. Fetch Parts
//   useEffect(() => {
//     fetch(`${BASE_URL}/api/master-dropdown/?filter=all_parts`)
//       .then(res => res.json())
//       .then(data => {
//         if (Array.isArray(data)) {
//           const formattedParts = data.map(item => ({
//             part_name: item[0], 
//             part_no: item[1]    
//           }));
//           setPartsData(formattedParts);
//         } else {
//           setPartsData([]);
//         }
//       })
//       .catch(err => console.error('Error fetching parts:', err));
//   }, []);

//   // 2. Fetch Operators, Machines & Filled Machines
//   useEffect(() => {
//     const selectedPlant = formData.plant;
    
//     if (!selectedPlant) {
//       setOperatorNames([]);
//       setMachineList([]);
//       setFilledMachines([]);
//       return;
//     }

//     const plantKey = PLANT_MAP[selectedPlant];

//     setOperatorsLoading(true);
//     fetch(`${BASE_URL}/api/operators/?plant=${plantKey}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.success) {
//           setOperatorNames(data.operators);
//         } else {
//           setOperatorNames(Array.isArray(data) ? data : []);
//         }
//       })
//       .catch(err => console.error('Error fetching operators:', err))
//       .finally(() => setOperatorsLoading(false));

//     setMachinesLoading(true);
//     fetch(`${BASE_URL}/api/machines/list/?plant=${plantKey}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.success) {
//           setMachineList(data.machines);
//         } else {
//           setMachineList([]);
//         }
//       })
//       .catch(err => console.error('Error fetching machines:', err))
//       .finally(() => setMachinesLoading(false));

//     // 3. API me selectedDate bhej rahe hain taaki exactly wahi date check ho jo screen pe dikh rahi hai
//     fetch(`${BASE_URL}/api/get-today-production-data/?plant_name=${plantKey}&date=${selectedDate}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.success) {
//           setFilledMachines(data.filled_machines || []);
//         } else {
//           setFilledMachines([]);
//         }
//       })
//       .catch(err => console.error('Error fetching filled machines:', err));

//   }, [formData.plant, selectedDate]); // selectedDate change hone par dobara API hit hogi

//   // 4. Check if selected machine is filled
//   useEffect(() => {
//     if (formData.machineNo) {
//       const isFilled = filledMachines.some(fm => String(fm) === String(formData.machineNo));
//       setShowWarning(isFilled);
//     } else {
//       setShowWarning(false);
//     }
//   }, [formData.machineNo, filledMachines]);


//   const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     if (name === 'operatorName' && value === 'ADD_NEW') {
//       setIsAddingNewOperator(true);
//       return;
//     }

//     if (name === 'plant') {
//       setFormData(prev => ({
//         ...prev,
//         plant: value,
//         operatorName: '', 
//         machineNo: ''
//       }));
//     }
//     else if (name === 'partName') {
//       const selectedPart = partsData.find(p => p.part_name === value);
//       const autoPartNo = selectedPart ? selectedPart.part_no : '';

//       setFormData(prev => ({
//         ...prev,
//         partName: value,
//         partNo: autoPartNo, 
//         operationName: ''   
//       }));

//       if (value) {
//         fetch(`${BASE_URL}/api/master-dropdown/?filter=operations_by_part&part=${encodeURIComponent(value)}`)
//           .then(res => res.json())
//           .then(data => setOperationNames(data))
//           .catch(err => console.error('Error fetching operations:', err));
//       } else {
//         setOperationNames([]);
//       }
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   }

//   const handleSaveNewOperator = async () => {
//     const opName = newOperatorName.trim();
//     if (!opName) return;
//     setIsSavingOperator(true);
//     try {
//       const response = await fetch(`${BASE_URL}/api/operators/add/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name: opName, plant: PLANT_MAP[formData.plant] })
//       });
//       const result = await response.json();
//       if (response.ok) { 
//         setOperatorNames(prev => [...prev, { name: opName }]);
//         setFormData(prev => ({ ...prev, operatorName: opName }));
//         setIsAddingNewOperator(false);
//         setNewOperatorName('');
//       } else {
//         alert('Failed to save operator: ' + (result.message || result.error));
//       }
//     } catch (error) {
//       alert('Network Error: Could not save operator.');
//     } finally {
//       setIsSavingOperator(false);
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       plant: '', machineNo: '', operatorName: '', partName: '',
//       partNo: '', operationName: '', plannedQuantity: '',
//       achievedQuantity: '', qtyRemark: '',
//       productionStartTime: '', productionEndTime: '', totalWorkingTime: '',
//       toolSetupTime: '', machineBdTime: '', toolBdTime: '', rmCoilNo: ''
//     });
//     setOperationNames([]); 
//     setIsAddingNewOperator(false);
//     setShowWarning(false);
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (showWarning) {
//       alert(`Machine ${formData.machineNo} ka data is date (${selectedDate}) ke liye pehle hi bhara ja chuka hai! Aap wapas submit nahi kar sakte.`);
//       return;
//     }
    
//     const requiredFields = ['plant', 'machineNo', 'operatorName', 'partName', 'partNo', 'operationName', 'plannedQuantity']
//     const missingFields = requiredFields.filter(field => !formData[field])
    
//     if (missingFields.length > 0) {
//       alert('Please fill all required fields')
//       return
//     }

//     const payload = {
//       // Date parameter payload mein add kar diya
//       date: selectedDate,
//       plant: PLANT_MAP[formData.plant], 
//       machine_no: formData.machineNo,
//       operator_name: formData.operatorName,
//       part_name: formData.partName,
//       part_no: formData.partNo,
//       operation_name: formData.operationName,
//       planned_quantity: parseInt(formData.plannedQuantity), 
//       achieved_quantity: formData.achievedQuantity ? parseInt(formData.achievedQuantity) : 0, 
//       qty_remark: formData.qtyRemark,
//       production_start_time: formData.productionStartTime,
//       production_end_time: formData.productionEndTime,
//       total_working_time: formData.totalWorkingTime,
//       tool_setup_time: formData.toolSetupTime ? parseInt(formData.toolSetupTime) : 0,
//       machine_bd_time: formData.machineBdTime ? parseInt(formData.machineBdTime) : 0,
//       tool_bd_time: formData.toolBdTime ? parseInt(formData.toolBdTime) : 0,
//       rm_coil_no: formData.rmCoilNo
//     };

//     setIsLoading(true);

//     try {
//       const response = await fetch(`${BASE_URL}/api/save-daily-production/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });

//       const result = await response.json();

//       if (response.ok && result.success) {
//         alert(result.message);
//         setFilledMachines(prev => [...prev, formData.machineNo]);
//         handleReset();
//       } else {
//         alert('Error saving data: ' + (result.error || 'Please check console for details.'));
//       }
//     } catch (error) {
//       alert('Failed to connect to the server. Make sure Django is running.');
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   const handleBack = () => {
//     window.location.href = '/production-hub';
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-6 px-4 flex justify-center">
//       <div className="w-full max-w-7xl">
//         <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          
//           <div className="px-4 sm:px-6 pt-4 sm:pt-6">
//             <button type="button" onClick={handleBack} className="inline-flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors font-medium">
//               <ArrowLeft size={18} /> Back to Production Page
//             </button>
//           </div>

//           <div className="border-b border-slate-200 px-4 sm:px-6 pb-4 bg-slate-50">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-[#3b82f5]/10 rounded-lg flex-shrink-0">
//                   <Package size={24} className="text-[#3b82f5]" />
//                 </div>
//                 <div>
//                   <h1 className="text-lg sm:text-xl font-semibold text-blue-500">Daily Production Plan</h1>
//                   <p className="text-xs text-slate-600">Manufacturing Execution System</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 {/* --- DATE PICKER YAHAN LAGAYA HAI --- */}
//                 <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-500 rounded-lg shadow-sm">
//                   <Calendar size={14} className="text-blue-700" />
//                   <input 
//                     type="date" 
//                     value={selectedDate}
//                     onChange={(e) => setSelectedDate(e.target.value)}
//                     className="text-sm font-medium text-slate-700 bg-transparent outline-none cursor-pointer"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            
//             {showWarning && formData.machineNo && (
//                 <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm">
//                     <div className="flex items-center gap-3">
//                         <AlertTriangle className="text-red-500" size={24} />
//                         <div>
//                             <h3 className="text-red-800 font-bold text-sm">⚠️ Machine Already Filled!</h3>
//                             <p className="text-red-700 text-sm">
//                                 Machine {formData.machineNo} ki Date: {selectedDate} ke liye production entry pehle hi ho chuki hai! Aap doobara submit nahi kar sakte.
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              
//               <div className="flex flex-col">
//                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
//                   <Factory size={14} className="inline mr-1 text-blue-500" /> Plant <span className="text-red-500">*</span>
//                 </label>
//                 <select name="plant" value={formData.plant} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700">
//                   <option value="">Select Plant</option>
//                   {Object.keys(PLANT_MAP).map(p => <option key={p} value={p}>{p}</option>)}
//                 </select>
//               </div>

//               <div className="flex flex-col">
//                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
//                   <Cpu size={14} className="inline mr-1 text-blue-500" /> Machine No <span className="text-red-500">*</span>
//                 </label>
//                 <select name="machineNo" value={formData.machineNo} onChange={handleChange} disabled={!formData.plant || machinesLoading} className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 disabled:bg-slate-50 disabled:text-slate-400">
//                   <option value="">{machinesLoading ? 'Loading...' : !formData.plant ? 'Select Plant First' : 'Select Machine'}</option>
//                   {machineList.map(m => {
//                     const isFilled = filledMachines.some(fm => String(fm) === String(m));
//                     return (
//                         <option 
//                             key={m} 
//                             value={m}
//                             style={{ 
//                                 backgroundColor: isFilled ? '#fef2f2' : 'white',
//                                 color: isFilled ? '#991b1b' : 'inherit'
//                             }}
//                         >
//                             Machine {m} {isFilled ? '✓ (Filled Today)' : ''}
//                         </option>
//                     )
//                   })}
//                 </select>
//               </div>

//               <div className="flex flex-col">
//                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
//                   <User size={14} className="inline mr-1 text-blue-500" /> Operator Name <span className="text-red-500">*</span>
//                 </label>
//                 {isAddingNewOperator ? (
//                   <div className="flex gap-2 h-[38px]">
//                     <input type="text" autoFocus placeholder="Enter Name" value={newOperatorName} onChange={(e) => setNewOperatorName(e.target.value)} disabled={isSavingOperator} className="w-full px-3 py-1 text-sm bg-white border border-[#3b82f5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3b82f5] text-slate-700 disabled:bg-slate-100" />
//                     <button type="button" onClick={handleSaveNewOperator} disabled={isSavingOperator || !newOperatorName.trim()} className="px-2 py-1 bg-[#3b82f5] text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center disabled:opacity-50">
//                       {isSavingOperator ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
//                     </button>
//                     <button type="button" onClick={() => setIsAddingNewOperator(false)} disabled={isSavingOperator} className="px-2 py-1 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition disabled:opacity-50">
//                       <X size={16} />
//                     </button>
//                   </div>
//                 ) : (
//                   <select name="operatorName" value={formData.operatorName} onChange={handleChange} disabled={!formData.plant || operatorsLoading} className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 disabled:bg-slate-50 disabled:text-slate-400">
//                     <option value="">{operatorsLoading ? 'Loading...' : !formData.plant ? 'Select Plant First' : 'Select Operator'}</option>
//                     {operatorNames.map((op, index) => <option key={op.id || index} value={op.name}>{op.name}</option>)}
//                     {formData.plant && !operatorsLoading && (
//                       <option value="ADD_NEW" className="font-semibold text-blue-600 bg-blue-50">+ Add New Operator</option>
//                     )}
//                   </select>
//                 )}
//               </div>

//               <div className="flex flex-col">
//                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
//                   <Package size={14} className="inline mr-1 text-blue-500" /> Part Name <span className="text-red-500">*</span>
//                 </label>
//                 <select name="partName" value={formData.partName} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700">
//                   <option value="" className="text-slate-500">Select Part</option>
//                   {partsData.map((part, index) => <option key={index} value={part.part_name}>{part.part_name}</option>)}
//                 </select>
//               </div>

//               <div className="flex flex-col">
//                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
//                   <Hash size={14} className="inline mr-1 text-blue-500" /> Part No <span className="text-red-500">*</span>
//                 </label>
//                 <input type="text" name="partNo" value={formData.partNo} readOnly placeholder="Auto-filled part number" className="w-full px-3 py-2 text-sm bg-slate-100 border border-slate-300 rounded-lg text-slate-500 cursor-not-allowed focus:outline-none" />
//               </div>

//               <div className="flex flex-col">
//                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
//                   <Settings size={14} className="inline mr-1 text-blue-500" /> Operation Name <span className="text-red-500">*</span>
//                 </label>
//                 <select name="operationName" value={formData.operationName} onChange={handleChange} disabled={!formData.partName} className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 disabled:bg-slate-50 disabled:text-slate-400">
//                   <option value="" className="text-slate-500">Select Operation</option>
//                   {operationNames.map((op, index) => <option key={index} value={op}>{op}</option>)}
//                 </select>
//               </div>

//               <div className="flex flex-col">
//                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
//                   <Target size={14} className="inline mr-1 text-blue-500" /> Planned Quantity <span className="text-red-500">*</span>
//                 </label>
//                 <input type="number" name="plannedQuantity" value={formData.plannedQuantity} onChange={handleChange} placeholder="Target quantity" className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400" />
//               </div>

//               <div className="flex flex-col">
//                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
//                   <CheckCircle size={14} className="inline mr-1 text-green-500" /> Achieved Qty. (Optional)
//                 </label>
//                 <input type="number" name="achievedQuantity" value={formData.achievedQuantity} onChange={handleChange} placeholder="Actual quantity" className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400" />
//               </div>

//               <div className="flex flex-col">
//                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
//                   <Clock size={14} className="inline mr-1 text-blue-500" /> Prod. Start Time
//                 </label>
//                 <input type="time" name="productionStartTime" value={formData.productionStartTime} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700" />
//               </div>

//               <div className="flex flex-col">
//                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
//                   <Clock size={14} className="inline mr-1 text-blue-500" /> Prod. End Time
//                 </label>
//                 <input type="time" name="productionEndTime" value={formData.productionEndTime} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700" />
//               </div>

//               <div className="flex flex-col">
//                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
//                   <Clock size={14} className="inline mr-1 text-blue-500" /> Total Working Time
//                 </label>
//                 <input type="text" name="totalWorkingTime" value={formData.totalWorkingTime} onChange={handleChange} placeholder="e.g. 8 hrs or 480 mins" className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400" />
//               </div>

//               <div className="flex flex-col">
//                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
//                   <Wrench size={14} className="inline mr-1 text-orange-500" /> Tool Set-up Time
//                 </label>
//                 <input type="number" name="toolSetupTime" value={formData.toolSetupTime} onChange={handleChange} placeholder="In minutes" className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400" />
//               </div>

//               <div className="flex flex-col">
//                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
//                   <AlertTriangle size={14} className="inline mr-1 text-red-500" /> Machine B/D Time
//                 </label>
//                 <input type="number" name="machineBdTime" value={formData.machineBdTime} onChange={handleChange} placeholder="In minutes" className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400" />
//               </div>

//               <div className="flex flex-col">
//                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
//                   <AlertTriangle size={14} className="inline mr-1 text-red-500" /> Tool B/D Time
//                 </label>
//                 <input type="number" name="toolBdTime" value={formData.toolBdTime} onChange={handleChange} placeholder="In minutes" className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400" />
//               </div>

//               <div className="flex flex-col">
//                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
//                   <Layers size={14} className="inline mr-1 text-indigo-500" /> RM Coil / Lot No.
//                 </label>
//                 <input type="text" name="rmCoilNo" value={formData.rmCoilNo} onChange={handleChange} placeholder="Enter lot or coil number" className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400" />
//               </div>

//               <div className="flex flex-col">
//                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
//                   <MessageSquare size={14} className="inline mr-1 text-blue-500" /> Qty. Remark
//                 </label>
//                 <input type="text" name="qtyRemark" value={formData.qtyRemark} onChange={handleChange} placeholder="Any remarks?" className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400" />
//               </div>

//             </div>

//             <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mt-8 pt-4 border-t border-slate-200">
//               <button type="button" onClick={handleReset} disabled={isLoading} className="w-full sm:w-auto px-4 py-2 text-sm border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50">
//                 <RotateCcw size={14} /> Reset
//               </button>
//               <button type="submit" disabled={isLoading || showWarning} className="w-full sm:w-auto px-4 py-2 text-sm bg-[#3b82f5] text-white rounded-lg hover:bg-[#2563eb] transition-colors flex items-center justify-center gap-2 font-medium shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
//                 {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
//                 {isLoading ? 'Saving...' : 'Save Production Plan'}
//               </button>
//             </div>

//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default DailyProdForm
// // import React, { useState, useEffect } from 'react'
// // import { 
// //   ArrowLeft, Save, RotateCcw, Calendar, User, Package, 
// //   Hash, Settings, Cpu, Target, MessageSquare, Loader2, 
// //   CheckCircle, Factory, Check, X, 
// //   Clock, Wrench, AlertTriangle, Layers // Naye icons add kiye gaye hain
// // } from 'lucide-react'

// // const BASE_URL = 'http://192.168.0.34:8000';

// // const PLANT_MAP = {
// //   'Plant 1': 'plant_1',
// //   'Plant 2': 'plant_2',
// // };

// // const DailyProdForm = () => {
// //   // API states
// //   const [operatorNames, setOperatorNames] = useState([]);
// //   const [operatorsLoading, setOperatorsLoading] = useState(false);
  
// //   const [machineList, setMachineList] = useState([]);
// //   const [machinesLoading, setMachinesLoading] = useState(false);
  
// //   const [partsData, setPartsData] = useState([]); 
// //   const [operationNames, setOperationNames] = useState([]);

// //   // --- NAYE STATES OPERATOR ADD KARNE KE LIYE ---
// //   const [isAddingNewOperator, setIsAddingNewOperator] = useState(false);
// //   const [newOperatorName, setNewOperatorName] = useState('');
// //   const [isSavingOperator, setIsSavingOperator] = useState(false);

// //   // Form states (Naye fields yahan add kiye gaye hain)
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [formData, setFormData] = useState({
// //     plant: '', 
// //     machineNo: '',
// //     operatorName: '',
// //     partName: '',
// //     partNo: '',
// //     operationName: '',
// //     plannedQuantity: '',
// //     achievedQuantity: '',
// //     qtyRemark: '',
// //     productionStartTime: '',
// //     productionEndTime: '',
// //     totalWorkingTime: '',
// //     toolSetupTime: '',
// //     machineBdTime: '',
// //     toolBdTime: '',
// //     rmCoilNo: ''
// //   })

// //   // 1. Fetch Parts
// //   useEffect(() => {
// //     fetch(`${BASE_URL}/api/master-dropdown/?filter=all_parts`)
// //       .then(res => res.json())
// //       .then(data => {
// //         if (Array.isArray(data)) {
// //           const formattedParts = data.map(item => ({
// //             part_name: item[0], 
// //             part_no: item[1]    
// //           }));
// //           setPartsData(formattedParts);
// //         } else {
// //           setPartsData([]);
// //         }
// //       })
// //       .catch(err => console.error('Error fetching parts:', err));
// //   }, []);

// //   // 2. Fetch Operators & Machines based on Plant
// //   useEffect(() => {
// //     const selectedPlant = formData.plant;
    
// //     if (!selectedPlant) {
// //       setOperatorNames([]);
// //       setMachineList([]);
// //       return;
// //     }

// //     const plantKey = PLANT_MAP[selectedPlant];

// //     setOperatorsLoading(true);
// //     fetch(`${BASE_URL}/api/operators/?plant=${plantKey}`)
// //       .then(res => res.json())
// //       .then(data => {
// //         if (data.success) {
// //           setOperatorNames(data.operators);
// //         } else {
// //           setOperatorNames(Array.isArray(data) ? data : []);
// //         }
// //       })
// //       .catch(err => console.error('Error fetching operators:', err))
// //       .finally(() => setOperatorsLoading(false));

// //     setMachinesLoading(true);
// //     fetch(`${BASE_URL}/api/machines/list/?plant=${plantKey}`)
// //       .then(res => res.json())
// //       .then(data => {
// //         if (data.success) {
// //           setMachineList(data.machines);
// //         } else {
// //           setMachineList([]);
// //         }
// //       })
// //       .catch(err => console.error('Error fetching machines:', err))
// //       .finally(() => setMachinesLoading(false));

// //   }, [formData.plant]);

// //   // Handle Form Inputs
// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
    
// //     // Naya operator select karne par logic
// //     if (name === 'operatorName' && value === 'ADD_NEW') {
// //       setIsAddingNewOperator(true);
// //       return;
// //     }

// //     if (name === 'plant') {
// //       setFormData(prev => ({
// //         ...prev,
// //         plant: value,
// //         operatorName: '', 
// //         machineNo: ''
// //       }));
// //     }
// //     else if (name === 'partName') {
// //       const selectedPart = partsData.find(p => p.part_name === value);
// //       const autoPartNo = selectedPart ? selectedPart.part_no : '';

// //       setFormData(prev => ({
// //         ...prev,
// //         partName: value,
// //         partNo: autoPartNo, 
// //         operationName: ''   
// //       }));

// //       if (value) {
// //         fetch(`${BASE_URL}/api/master-dropdown/?filter=operations_by_part&part=${encodeURIComponent(value)}`)
// //           .then(res => res.json())
// //           .then(data => setOperationNames(data))
// //           .catch(err => console.error('Error fetching operations:', err));
// //       } else {
// //         setOperationNames([]);
// //       }
// //     } else {
// //       setFormData(prev => ({ ...prev, [name]: value }));
// //     }
// //   }

// //   // --- NAYA OPERATOR BACKEND ME SAVE KARNE KA FUNCTION ---
// //   const handleSaveNewOperator = async () => {
// //     const opName = newOperatorName.trim();
// //     if (!opName) return;

// //     setIsSavingOperator(true);

// //     try {
// //       const response = await fetch(`${BASE_URL}/api/operators/add/`, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({
// //           name: opName,
// //           plant: PLANT_MAP[formData.plant]
// //         })
// //       });

// //       const result = await response.json();

// //       if (response.ok) { 
// //         const newOp = { name: opName }; 
// //         setOperatorNames(prev => [...prev, newOp]);
// //         setFormData(prev => ({ ...prev, operatorName: opName }));
// //         setIsAddingNewOperator(false);
// //         setNewOperatorName('');
// //       } else {
// //         alert('Failed to save operator: ' + (result.message || result.error || 'Unknown error'));
// //       }
// //     } catch (error) {
// //       console.error('Error saving operator:', error);
// //       alert('Network Error: Could not save operator to backend.');
// //     } finally {
// //       setIsSavingOperator(false);
// //     }
// //   };

// //   // Naye fields ko bhi reset me add kiya
// //   const handleReset = () => {
// //     setFormData({
// //       plant: '', machineNo: '', operatorName: '', partName: '',
// //       partNo: '', operationName: '', plannedQuantity: '',
// //       achievedQuantity: '', qtyRemark: '',
// //       productionStartTime: '', productionEndTime: '', totalWorkingTime: '',
// //       toolSetupTime: '', machineBdTime: '', toolBdTime: '', rmCoilNo: ''
// //     });
// //     setOperationNames([]); 
// //     setIsAddingNewOperator(false);
// //   }

// //   const handleSubmit = async (e) => {
// //     e.preventDefault()
    
// //     const requiredFields = ['plant', 'machineNo', 'operatorName', 'partName', 'partNo', 'operationName', 'plannedQuantity']
// //     const missingFields = requiredFields.filter(field => !formData[field])
    
// //     if (missingFields.length > 0) {
// //       alert('Please fill all required fields')
// //       return
// //     }

// //     // Payload me naye fields add kiye gaye hain
// //     const payload = {
// //       plant: PLANT_MAP[formData.plant], 
// //       machine_no: formData.machineNo,
// //       operator_name: formData.operatorName,
// //       part_name: formData.partName,
// //       part_no: formData.partNo,
// //       operation_name: formData.operationName,
// //       planned_quantity: parseInt(formData.plannedQuantity), 
// //       achieved_quantity: formData.achievedQuantity ? parseInt(formData.achievedQuantity) : 0, 
// //       qty_remark: formData.qtyRemark,
      
// //       // Naye fields payload me
// //       production_start_time: formData.productionStartTime,
// //       production_end_time: formData.productionEndTime,
// //       total_working_time: formData.totalWorkingTime,
// //       tool_setup_time: formData.toolSetupTime ? parseInt(formData.toolSetupTime) : 0,
// //       machine_bd_time: formData.machineBdTime ? parseInt(formData.machineBdTime) : 0,
// //       tool_bd_time: formData.toolBdTime ? parseInt(formData.toolBdTime) : 0,
// //       rm_coil_no: formData.rmCoilNo
// //     };

// //     setIsLoading(true);

// //     try {
// //       const response = await fetch(`${BASE_URL}/api/save-daily-production/`, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(payload)
// //       });

// //       const result = await response.json();

// //       if (response.ok && result.success) {
// //         alert(result.message);
// //         handleReset();
// //       } else {
// //         alert('Error saving data: ' + (result.error || 'Please check console for details.'));
// //       }
// //     } catch (error) {
// //       console.error('Network Error:', error);
// //       alert('Failed to connect to the server. Make sure Django is running.');
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   }

// //   const handleBack = () => {
// //     window.location.href = '/production-hub';
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-100 py-6 px-4 flex justify-center">
// //       <div className="w-full max-w-7xl">
// //         <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          
// //           {/* Header & Back Button */}
// //           <div className="px-4 sm:px-6 pt-4 sm:pt-6">
// //             <button
// //               type="button"
// //               onClick={handleBack}
// //               className="inline-flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors font-medium"
// //             >
// //               <ArrowLeft size={18} /> Back to Production Page
// //             </button>
// //           </div>

// //           <div className="border-b border-slate-200 px-4 sm:px-6 pb-4 bg-slate-50">
// //             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
// //               <div className="flex items-center gap-3">
// //                 <div className="p-2 bg-[#3b82f5]/10 rounded-lg flex-shrink-0">
// //                   <Package size={24} className="text-[#3b82f5]" />
// //                 </div>
// //                 <div>
// //                   <h1 className="text-lg sm:text-xl font-semibold text-blue-500">Daily Production Plan</h1>
// //                   <p className="text-xs text-slate-600">Manufacturing Execution System</p>
// //                 </div>
// //               </div>
// //               <div className="flex items-center gap-2">
// //                 <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-500 rounded-lg shadow-sm">
// //                   <Calendar size={14} className="text-blue-700" />
// //                   <span className="text-sm font-medium text-slate-600 whitespace-nowrap">
// //                     {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
// //                   </span>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Form */}
// //           <form onSubmit={handleSubmit} className="p-4 sm:p-6">
// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              
// //               {/* Plant Dropdown */}
// //               <div className="flex flex-col">
// //                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
// //                   <Factory size={14} className="inline mr-1 text-blue-500" /> Plant <span className="text-red-500">*</span>
// //                 </label>
// //                 <select name="plant" value={formData.plant} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700">
// //                   <option value="">Select Plant</option>
// //                   {Object.keys(PLANT_MAP).map(p => <option key={p} value={p}>{p}</option>)}
// //                 </select>
// //               </div>

// //               {/* Machine No */}
// //               <div className="flex flex-col">
// //                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
// //                   <Cpu size={14} className="inline mr-1 text-blue-500" /> Machine No <span className="text-red-500">*</span>
// //                 </label>
// //                 <select name="machineNo" value={formData.machineNo} onChange={handleChange} disabled={!formData.plant || machinesLoading} className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 disabled:bg-slate-50 disabled:text-slate-400">
// //                   <option value="">{machinesLoading ? 'Loading...' : !formData.plant ? 'Select Plant First' : 'Select Machine'}</option>
// //                   {machineList.map(m => <option key={m} value={m}>Machine {m}</option>)}
// //                 </select>
// //               </div>

// //               {/* Operator Name */}
// //               <div className="flex flex-col">
// //                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
// //                   <User size={14} className="inline mr-1 text-blue-500" /> Operator Name <span className="text-red-500">*</span>
// //                 </label>
                
// //                 {isAddingNewOperator ? (
// //                   <div className="flex gap-2 h-[38px]">
// //                     <input
// //                       type="text" autoFocus placeholder="Enter Name" value={newOperatorName}
// //                       onChange={(e) => setNewOperatorName(e.target.value)} disabled={isSavingOperator}
// //                       className="w-full px-3 py-1 text-sm bg-white border border-[#3b82f5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#3b82f5] text-slate-700 disabled:bg-slate-100"
// //                     />
// //                     <button type="button" onClick={handleSaveNewOperator} disabled={isSavingOperator || !newOperatorName.trim()} className="px-2 py-1 bg-[#3b82f5] text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center disabled:opacity-50">
// //                       {isSavingOperator ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
// //                     </button>
// //                     <button type="button" onClick={() => setIsAddingNewOperator(false)} disabled={isSavingOperator} className="px-2 py-1 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition disabled:opacity-50">
// //                       <X size={16} />
// //                     </button>
// //                   </div>
// //                 ) : (
// //                   <select name="operatorName" value={formData.operatorName} onChange={handleChange} disabled={!formData.plant || operatorsLoading} className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 disabled:bg-slate-50 disabled:text-slate-400">
// //                     <option value="">{operatorsLoading ? 'Loading...' : !formData.plant ? 'Select Plant First' : 'Select Operator'}</option>
// //                     {operatorNames.map((op, index) => <option key={op.id || index} value={op.name}>{op.name}</option>)}
// //                     {formData.plant && !operatorsLoading && (
// //                       <option value="ADD_NEW" className="font-semibold text-blue-600 bg-blue-50">+ Add New Operator</option>
// //                     )}
// //                   </select>
// //                 )}
// //               </div>

// //               {/* Part Name */}
// //               <div className="flex flex-col">
// //                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
// //                   <Package size={14} className="inline mr-1 text-blue-500" /> Part Name <span className="text-red-500">*</span>
// //                 </label>
// //                 <select name="partName" value={formData.partName} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700">
// //                   <option value="" className="text-slate-500">Select Part</option>
// //                   {partsData.map((part, index) => <option key={index} value={part.part_name}>{part.part_name}</option>)}
// //                 </select>
// //               </div>

// //               {/* Part No */}
// //               <div className="flex flex-col">
// //                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
// //                   <Hash size={14} className="inline mr-1 text-blue-500" /> Part No <span className="text-red-500">*</span>
// //                 </label>
// //                 <input type="text" name="partNo" value={formData.partNo} readOnly placeholder="Auto-filled part number" className="w-full px-3 py-2 text-sm bg-slate-100 border border-slate-300 rounded-lg text-slate-500 cursor-not-allowed focus:outline-none" />
// //               </div>

// //               {/* Operation Name */}
// //               <div className="flex flex-col">
// //                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
// //                   <Settings size={14} className="inline mr-1 text-blue-500" /> Operation Name <span className="text-red-500">*</span>
// //                 </label>
// //                 <select name="operationName" value={formData.operationName} onChange={handleChange} disabled={!formData.partName} className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 disabled:bg-slate-50 disabled:text-slate-400">
// //                   <option value="" className="text-slate-500">Select Operation</option>
// //                   {operationNames.map((op, index) => <option key={index} value={op}>{op}</option>)}
// //                 </select>
// //               </div>

// //               {/* Planned Quantity */}
// //               <div className="flex flex-col">
// //                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
// //                   <Target size={14} className="inline mr-1 text-blue-500" /> Planned Quantity <span className="text-red-500">*</span>
// //                 </label>
// //                 <input type="number" name="plannedQuantity" value={formData.plannedQuantity} onChange={handleChange} placeholder="Target quantity" className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400" />
// //               </div>

// //               {/* Achieved Quantity */}
// //               <div className="flex flex-col">
// //                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
// //                   <CheckCircle size={14} className="inline mr-1 text-green-500" /> Achieved Qty. (Optional)
// //                 </label>
// //                 <input type="number" name="achievedQuantity" value={formData.achievedQuantity} onChange={handleChange} placeholder="Actual quantity" className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400" />
// //               </div>

// //               {/* ----------------- NAYE FIELDS YAHAN SE HAIN ----------------- */}

// //               {/* Production Start Time */}
// //               <div className="flex flex-col">
// //                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
// //                   <Clock size={14} className="inline mr-1 text-blue-500" /> Prod. Start Time
// //                 </label>
// //                 <input type="time" name="productionStartTime" value={formData.productionStartTime} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700" />
// //               </div>

// //               {/* Production End Time */}
// //               <div className="flex flex-col">
// //                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
// //                   <Clock size={14} className="inline mr-1 text-blue-500" /> Prod. End Time
// //                 </label>
// //                 <input type="time" name="productionEndTime" value={formData.productionEndTime} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700" />
// //               </div>

// //               {/* Total Working Time */}
// //               <div className="flex flex-col">
// //                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
// //                   <Clock size={14} className="inline mr-1 text-blue-500" /> Total Working Time
// //                 </label>
// //                 <input type="text" name="totalWorkingTime" value={formData.totalWorkingTime} onChange={handleChange} placeholder="e.g. 8 hrs or 480 mins" className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400" />
// //               </div>

// //               {/* Tool Set-up Time */}
// //               <div className="flex flex-col">
// //                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
// //                   <Wrench size={14} className="inline mr-1 text-orange-500" /> Tool Set-up Time
// //                 </label>
// //                 <input type="number" name="toolSetupTime" value={formData.toolSetupTime} onChange={handleChange} placeholder="In minutes" className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400" />
// //               </div>

// //               {/* Machine B/D Time */}
// //               <div className="flex flex-col">
// //                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
// //                   <AlertTriangle size={14} className="inline mr-1 text-red-500" /> Machine B/D Time
// //                 </label>
// //                 <input type="number" name="machineBdTime" value={formData.machineBdTime} onChange={handleChange} placeholder="In minutes" className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400" />
// //               </div>

// //               {/* Tool B/D Time */}
// //               <div className="flex flex-col">
// //                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
// //                   <AlertTriangle size={14} className="inline mr-1 text-red-500" /> Tool B/D Time
// //                 </label>
// //                 <input type="number" name="toolBdTime" value={formData.toolBdTime} onChange={handleChange} placeholder="In minutes" className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400" />
// //               </div>

// //               {/* RM Coil No / Lot No */}
// //               <div className="flex flex-col">
// //                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
// //                   <Layers size={14} className="inline mr-1 text-indigo-500" /> RM Coil / Lot No.
// //                 </label>
// //                 <input type="text" name="rmCoilNo" value={formData.rmCoilNo} onChange={handleChange} placeholder="Enter lot or coil number" className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400" />
// //               </div>

// //               {/* Qty Remark */}
// //               <div className="flex flex-col">
// //                 <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
// //                   <MessageSquare size={14} className="inline mr-1 text-blue-500" /> Qty. Remark
// //                 </label>
// //                 <input type="text" name="qtyRemark" value={formData.qtyRemark} onChange={handleChange} placeholder="Any remarks?" className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#3b82f5] focus:ring-1 focus:ring-[#3b82f5] text-slate-700 placeholder-slate-400" />
// //               </div>

// //             </div>

// //             {/* Form Actions */}
// //             <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mt-8 pt-4 border-t border-slate-200">
// //               <button type="button" onClick={handleReset} disabled={isLoading} className="w-full sm:w-auto px-4 py-2 text-sm border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 font-medium disabled:opacity-50">
// //                 <RotateCcw size={14} /> Reset
// //               </button>
// //               <button type="submit" disabled={isLoading} className="w-full sm:w-auto px-4 py-2 text-sm bg-[#3b82f5] text-white rounded-lg hover:bg-[#2563eb] transition-colors flex items-center justify-center gap-2 font-medium shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
// //                 {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
// //                 {isLoading ? 'Saving...' : 'Save Production Plan'}
// //               </button>
// //             </div>

// //           </form>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default DailyProdForm