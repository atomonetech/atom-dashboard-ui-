import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // 🔥 IMPORT useParams
import {
  ArrowLeft,
  Save,
  RotateCcw,
  Calendar,
  User,
  Package,
  Hash,
  Settings,
  Cpu,
  Target,
  MessageSquare,
  Loader2,
  CheckCircle,
  Factory,
  Check,
  X,
  Clock,
  Wrench,
  AlertTriangle,
  Layers,
  ListFilter,
} from "lucide-react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const API_LOG = `${
  process.env.REACT_APP_API_URL || "http://localhost:8000"
}/api/log-report/`;

const PLANT_MAP = {
  "Plant 1": "plant_1",
  "Plant 2": "plant_2",
};

// Reverse map for View Mode
const REVERSE_PLANT_MAP = {
  "plant_1": "Plant 1",
  "plant_2": "Plant 2",
};

// Hardcoded machines list for Plant 2
const PLANT2_MACHINES = Array.from({ length: 48 }, (_, i) => i + 1);

const DailyProdForm = () => {
  const { id } = useParams(); // 🔥 GET ID FROM URL

  // API states
  const [operatorNames, setOperatorNames] = useState([]);
  const [operatorsLoading, setOperatorsLoading] = useState(false);

  const [machineList, setMachineList] = useState([]);
  const [machinesLoading, setMachinesLoading] = useState(false);

  const [partsData, setPartsData] = useState([]);
  const [operationNames, setOperationNames] = useState([]);

  const [isAddingNewOperator, setIsAddingNewOperator] = useState(false);
  const [newOperatorName, setNewOperatorName] = useState("");
  const [isSavingOperator, setIsSavingOperator] = useState(false);
  const [preparedBy, setPreparedBy] = useState("");

  // Form states
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    plant: "",
    shift: "",
    machineNo: "",
    operatorName: "",
    partName: "",
    partNo: "",
    operationName: "",
    plannedQuantity: "",
    achievedQuantity: "",
    qtyRemark: "",
    productionStartTime: "",
    productionEndTime: "",
    totalWorkingTime: "",
    toolSetupTime: "",
    machineBdTime: "",
    toolBdTime: "",
    rmCoilNo: "",
  });

  // 🔥 FETCH REPORT DATA IF ID EXISTS (VIEW/APPROVE MODE)
  useEffect(() => {
    if (id) {
      const fetchReportData = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/get-single-production-report/daily-prod-plan/${id}/`);
          if (response.data.success) {
            const data = response.data.data;
            
            // Reverse mapping plant_1 to Plant 1
            const actualPlant = REVERSE_PLANT_MAP[data.plant] || data.plant;

            setFormData({
              plant: actualPlant || "",
              shift: data.shift || "",
              machineNo: data.machine_no || "",
              operatorName: data.operator_name || "",
              partName: data.part_name || "",
              partNo: data.part_no || "",
              operationName: data.operation_name || "",
              plannedQuantity: data.planned_quantity || "",
              achievedQuantity: data.achieved_quantity || "",
              qtyRemark: data.qty_remark || "",
              productionStartTime: data.production_start_time ? data.production_start_time.substring(0, 5) : "",
              productionEndTime: data.production_end_time ? data.production_end_time.substring(0, 5) : "",
              totalWorkingTime: data.total_working_time || "",
              toolSetupTime: data.tool_setup_time || "",
              machineBdTime: data.machine_bd_time || "",
              toolBdTime: data.tool_bd_time || "",
              rmCoilNo: data.rm_coil_no || "",
            });
            setPreparedBy(data.submitted_by || "");

            // Pre-fetch operations for this part so dropdown isn't empty
            if (data.part_name) {
              axios.get(`${BASE_URL}/api/master-dropdown/?filter=operations_by_part&part=${encodeURIComponent(data.part_name)}`)
                .then(res => setOperationNames(res.data))
                .catch(err => console.error(err));
            }
          }
        } catch (error) {
          console.error("Error fetching single report:", error);
        }
      };
      fetchReportData();
    }
  }, [id]);

  // 1. Fetch Parts
  useEffect(() => {
    fetch(`${BASE_URL}/api/master-dropdown/?filter=all_parts`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const formattedParts = data.map((item) => ({
            part_name: item[0],
            part_no: item[1],
          }));
          setPartsData(formattedParts);
        } else {
          setPartsData([]);
        }
      })
      .catch((err) => console.error("Error fetching parts:", err));
  }, []);

  // 2. Fetch Operators & Machines based on Plant
  useEffect(() => {
    const selectedPlant = formData.plant;

    if (!selectedPlant) {
      setOperatorNames([]);
      setMachineList([]);
      return;
    }

    const plantKey = PLANT_MAP[selectedPlant];

    setOperatorsLoading(true);
    fetch(`${BASE_URL}/api/operators/?plant=${plantKey}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOperatorNames(data.operators);
          // Agar ID mode (view) hai aur existing operator list me nahi hai toh add kar do temporary
          if (id && formData.operatorName && !data.operators.some(op => op.name === formData.operatorName)) {
             setOperatorNames([...data.operators, { name: formData.operatorName }]);
          }
        } else {
          setOperatorNames(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => console.error("Error fetching operators:", err))
      .finally(() => setOperatorsLoading(false));

    if (selectedPlant === "Plant 2") {
      setMachineList(PLANT2_MACHINES);
    } else {
      setMachinesLoading(true);
      fetch(`${BASE_URL}/api/machines/list/?plant=${plantKey}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setMachineList(data.machines);
          } else {
            setMachineList([]);
          }
        })
        .catch((err) => console.error("Error fetching machines:", err))
        .finally(() => setMachinesLoading(false));
    }
  }, [formData.plant, id, formData.operatorName]);

  // Helper: Calculate total working time
  const calculateWorkingTime = (start, end) => {
    if (!start || !end) return "";
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);
    let startMinutes = startH * 60 + startM;
    let endMinutes = endH * 60 + endM;
    if (endMinutes <= startMinutes) endMinutes += 24 * 60;
    const diffMinutes = endMinutes - startMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    return mins === 0 ? `${hours} hrs` : `${hours} hrs ${mins} mins`;
  };

  const handleChange = (e) => {
    if (id) return; // Prevent edits in View mode

    const { name, value } = e.target;

    if (name === "operatorName" && value === "ADD_NEW") {
      setIsAddingNewOperator(true);
      return;
    }

    if (name === "plant") {
      setFormData((prev) => ({
        ...prev, plant: value, operatorName: "", machineNo: "",
      }));
    } else if (name === "partName") {
      const selectedPart = partsData.find((p) => p.part_name === value);
      const autoPartNo = selectedPart ? selectedPart.part_no : "";
      setFormData((prev) => ({
        ...prev, partName: value, partNo: autoPartNo, operationName: "",
      }));

      if (value) {
        fetch(`${BASE_URL}/api/master-dropdown/?filter=operations_by_part&part=${encodeURIComponent(value)}`)
          .then((res) => res.json())
          .then((data) => setOperationNames(data))
          .catch((err) => console.error("Error fetching operations:", err));
      } else {
        setOperationNames([]);
      }
    } else if (name === "productionStartTime" || name === "productionEndTime") {
      const start = name === "productionStartTime" ? value : formData.productionStartTime;
      const end = name === "productionEndTime" ? value : formData.productionEndTime;
      const totalWorkingTime = calculateWorkingTime(start, end);
      setFormData((prev) => ({ ...prev, [name]: value, totalWorkingTime }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveNewOperator = async () => {
    const opName = newOperatorName.trim();
    if (!opName) return;
    setIsSavingOperator(true);
    try {
      const response = await fetch(`${BASE_URL}/api/operators/add/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: opName, plant: PLANT_MAP[formData.plant] }),
      });
      const result = await response.json();
      if (response.ok) {
        setOperatorNames((prev) => [...prev, { name: opName }]);
        setFormData((prev) => ({ ...prev, operatorName: opName }));
        setIsAddingNewOperator(false);
        setNewOperatorName("");
      } else {
        alert("Failed to save operator: " + (result.message || result.error));
      }
    } catch (error) {
      console.error("Error saving operator:", error);
    } finally {
      setIsSavingOperator(false);
    }
  };

  const handleReset = () => {
    setFormData({
      plant: "", shift: "", machineNo: "", operatorName: "", partName: "",
      partNo: "", operationName: "", plannedQuantity: "", achievedQuantity: "",
      qtyRemark: "", productionStartTime: "", productionEndTime: "",
      totalWorkingTime: "", toolSetupTime: "", machineBdTime: "",
      toolBdTime: "", rmCoilNo: "",
    });
    setOperationNames([]);
    setIsAddingNewOperator(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) return; // Disallow save if in view mode

    const requiredFields = ["plant", "shift", "machineNo", "operatorName", "partName", "partNo", "operationName", "plannedQuantity"];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      alert("Please fill all required fields");
      return;
    }

    const todayDate = new Date().toISOString().split('T')[0];
    const payload = {
      production_date: todayDate,
      plant: PLANT_MAP[formData.plant],
      shift: formData.shift,
      machine_no: formData.machineNo,
      operator_name: formData.operatorName,
      part_name: formData.partName,
      part_no: formData.partNo,
      operation_name: formData.operationName,
      planned_quantity: parseInt(formData.plannedQuantity),
      achieved_quantity: formData.achievedQuantity ? parseInt(formData.achievedQuantity) : 0,
      qty_remark: formData.qtyRemark,
      production_start_time: formData.productionStartTime || null,
      production_end_time: formData.productionEndTime || null,
      total_working_time: formData.totalWorkingTime,
      tool_setup_time: formData.toolSetupTime ? parseInt(formData.toolSetupTime) : 0,
      machine_bd_time: formData.machineBdTime ? parseInt(formData.machineBdTime) : 0,
      tool_bd_time: formData.toolBdTime ? parseInt(formData.toolBdTime) : 0,
      rm_coil_no: formData.rmCoilNo,
    };

    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/save-daily-production/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        const currentUser = localStorage.getItem("username") || "Unknown User";
        try {
          await axios.post(API_LOG, {
            username: currentUser,
            report_name: "Daily prod Form",
            record_id: result.record_id
          });
        } catch (logError) {
          console.error("Activity log error:", logError);
        }
        alert(result.message);
        handleReset();
      } else {
        alert("Error saving data: " + (result.error || JSON.stringify(result.details)));
      }
    } catch (error) {
      alert("Failed to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    window.history.back(); // Go back directly to notification or previous page
  };

  return (
    <div className="min-h-screen bg-gray-100 text-slate-900  py-6 px-4 flex justify-center">
      <div className="w-full max-w-7xl">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="px-4 sm:px-6 pt-4 sm:pt-6 flex justify-between items-center">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors font-medium"
            >
              <ArrowLeft size={18} /> Back
            </button>
            {/* 🔥 SHOW RED DELETE/REVIEW ICON IF IN VIEW MODE */}
            {id && (
              <div className="flex items-center gap-2 text-red-500 font-bold bg-red-50 px-4 py-2 rounded-lg">
                DAILY PRODUCTION PLAN (REVIEW)
              </div>
            )}
          </div>

          <div className="border-b border-slate-200 px-4 sm:px-6 pb-4 bg-slate-50 mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#3b82f5]/10 rounded-lg flex-shrink-0">
                  <Package size={24} className="text-[#3b82f5]" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold text-blue-500">
                    {id ? "Daily Production Plan (Review)" : "Daily Production Plan"}
                  </h1>
                  <p className="text-xs text-slate-600">
                    Manufacturing Execution System
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-500 rounded-lg shadow-sm">
                  <Calendar size={14} className="text-blue-700" />
                  <span className="text-sm font-medium text-slate-600 whitespace-nowrap">
                    {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Plant */}
              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Factory size={14} className="inline mr-1 text-blue-500" /> Plant *
                </label>
                <select
                  name="plant"
                  value={formData.plant}
                  onChange={handleChange}
                  disabled={!!id} // 🔥 DISABLED IN VIEW MODE
                  className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg disabled:bg-slate-100 disabled:text-slate-700"
                >
                  <option value="">Select Plant</option>
                  {Object.keys(PLANT_MAP).map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Shift */}
              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <ListFilter size={14} className="inline mr-1 text-blue-500" /> Shift *
                </label>
                <select
                  name="shift"
                  value={formData.shift}
                  onChange={handleChange}
                  disabled={!!id}
                  className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg disabled:bg-slate-100 disabled:text-slate-500"
                >
                  <option value="">Select Shift</option>
                  <option value="A">Shift A</option>
                  <option value="B">Shift B</option>
                </select>
              </div>

              {/* Machine No */}
              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Cpu size={14} className="inline mr-1 text-blue-500" /> Machine No *
                </label>
                <select
                  name="machineNo"
                  value={formData.machineNo}
                  onChange={handleChange}
                  disabled={!!id || !formData.plant || machinesLoading}
                  className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg disabled:bg-slate-100 disabled:text-slate-500"
                >
                  <option value="">{machinesLoading ? "Loading..." : "Select Machine"}</option>
                  {machineList.map((m) => (
                    <option key={m} value={m}>Machine {m}</option>
                  ))}
                  {/* Append static value if in view mode and list hasn't loaded properly */}
                  {id && formData.machineNo && !machineList.includes(Number(formData.machineNo)) && (
                    <option value={formData.machineNo}>Machine {formData.machineNo}</option>
                  )}
                </select>
              </div>

              {/* Operator Name */}
              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <User size={14} className="inline mr-1 text-blue-500" /> Operator Name *
                </label>
                {isAddingNewOperator && !id ? (
                  <div className="flex gap-2 h-[38px]">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Enter Name"
                      value={newOperatorName}
                      onChange={(e) => setNewOperatorName(e.target.value)}
                      disabled={isSavingOperator}
                      className="w-full px-3 py-1 text-sm bg-white border border-[#3b82f5] rounded-lg"
                    />
                    <button type="button" onClick={handleSaveNewOperator} className="px-2 py-1 bg-[#3b82f5] text-white rounded-lg"><Check size={16} /></button>
                    <button type="button" onClick={() => setIsAddingNewOperator(false)} className="px-2 py-1 bg-slate-200 rounded-lg"><X size={16} /></button>
                  </div>
                ) : (
                  <select
                    name="operatorName"
                    value={formData.operatorName}
                    onChange={handleChange}
                    disabled={!!id || !formData.plant || operatorsLoading}
                    className="w-full px-3 py-2 text-sm text-slate-900  bg-white border border-slate-300 rounded-lg disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    <option value="">{operatorsLoading ? "Loading..." : "Select Operator"}</option>
                    {operatorNames.map((op, index) => (
                      <option key={op.id || index} value={op.name}>{op.name}</option>
                    ))}
                    {formData.plant && !operatorsLoading && !id && (
                      <option value="ADD_NEW" className="font-semibold text-blue-600 bg-blue-50">+ Add New Operator</option>
                    )}
                  </select>
                )}
              </div>

              {/* Part Name */}
              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Package size={14} className="inline mr-1 text-blue-500" /> Part Name *
                </label>
                <select
                  name="partName"
                  value={formData.partName}
                  onChange={handleChange}
                  disabled={!!id}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg disabled:bg-slate-100 disabled:text-slate-500"
                >
                  <option value="">Select Part</option>
                  {partsData.map((part, index) => (
                    <option key={index} value={part.part_name}>{part.part_name}</option>
                  ))}
                  {/* Append static value if in view mode and list hasn't loaded */}
                  {id && formData.partName && !partsData.some(p => p.part_name === formData.partName) && (
                     <option value={formData.partName}>{formData.partName}</option>
                  )}
                </select>
              </div>

              {/* Part No */}
              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Hash size={14} className="inline mr-1 text-blue-500" /> Part No *
                </label>
                <input
                  type="text"
                  name="partNo"
                  value={formData.partNo}
                  readOnly
                  disabled={!!id}
                  className="w-full px-3 py-2 text-sm bg-slate-100 border border-slate-300 rounded-lg text-slate-500 disabled:opacity-80"
                />
              </div>

              {/* Operation Name */}
              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Settings size={14} className="inline mr-1 text-blue-500" /> Operation Name *
                </label>
                <select
                  name="operationName"
                  value={formData.operationName}
                  onChange={handleChange}
                  disabled={!!id || !formData.partName}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg disabled:bg-slate-100 disabled:text-slate-500"
                >
                  <option value="">Select Operation</option>
                  {operationNames.map((op, index) => (
                    <option key={index} value={op}>{op}</option>
                  ))}
                  {id && formData.operationName && !operationNames.includes(formData.operationName) && (
                    <option value={formData.operationName}>{formData.operationName}</option>
                  )}
                </select>
              </div>

              {/* Planned Quantity */}
              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Target size={14} className="inline mr-1 text-blue-500" /> Planned Qty *
                </label>
                <input
                  type="number"
                  name="plannedQuantity"
                  value={formData.plannedQuantity}
                  onChange={handleChange}
                  disabled={!!id}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>

              {/* Achieved Quantity */}
              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <CheckCircle size={14} className="inline mr-1 text-green-500" /> Achieved Qty.
                </label>
                <input
                  type="number"
                  name="achievedQuantity"
                  value={formData.achievedQuantity}
                  onChange={handleChange}
                  disabled={!!id}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>

              {/* Production Start Time */}
              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Clock size={14} className="inline mr-1 text-blue-500" /> Start Time
                </label>
                <input
                  type="time"
                  name="productionStartTime"
                  value={formData.productionStartTime}
                  onChange={handleChange}
                  disabled={!!id}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>

              {/* Production End Time */}
              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Clock size={14} className="inline mr-1 text-blue-500" /> End Time
                </label>
                <input
                  type="time"
                  name="productionEndTime"
                  value={formData.productionEndTime}
                  onChange={handleChange}
                  disabled={!!id}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>

              {/* Total Working Time */}
              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Clock size={14} className="inline mr-1 text-blue-500" /> Total Working Time
                </label>
                <input
                  type="text"
                  name="totalWorkingTime"
                  value={formData.totalWorkingTime}
                  readOnly
                  disabled={!!id}
                  className="w-full px-3 py-2 text-sm bg-green-50 border border-green-300 text-green-700 rounded-lg disabled:bg-slate-100 disabled:border-slate-300 disabled:text-slate-500"
                />
              </div>

              {/* Tool Setup Time */}
              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Wrench size={14} className="inline mr-1 text-orange-500" /> Tool Set-up Time
                </label>
                <input
                  type="number"
                  name="toolSetupTime"
                  value={formData.toolSetupTime}
                  onChange={handleChange}
                  disabled={!!id}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>

              {/* Machine B/D Time */}
              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <AlertTriangle size={14} className="inline mr-1 text-red-500" /> Machine B/D Time
                </label>
                <input
                  type="number"
                  name="machineBdTime"
                  value={formData.machineBdTime}
                  onChange={handleChange}
                  disabled={!!id}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>

              {/* Tool B/D Time */}
              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <AlertTriangle size={14} className="inline mr-1 text-red-500" /> Tool B/D Time
                </label>
                <input
                  type="number"
                  name="toolBdTime"
                  value={formData.toolBdTime}
                  onChange={handleChange}
                  disabled={!!id}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>

              {/* RM Coil / Lot No */}
              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <Layers size={14} className="inline mr-1 text-indigo-500" /> RM Coil / Lot No.
                </label>
                <input
                  type="text"
                  name="rmCoilNo"
                  value={formData.rmCoilNo}
                  onChange={handleChange}
                  disabled={!!id}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>

              {/* Qty Remark */}
              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">
                  <MessageSquare size={14} className="inline mr-1 text-blue-500" /> Qty. Remark
                </label>
                <input
                  type="text"
                  name="qtyRemark"
                  value={formData.qtyRemark}
                  onChange={handleChange}
                  disabled={!!id}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                  Prepared By
                </label>
                <input
                  type="text"
                  value={preparedBy}
                  onChange={(e) => setPreparedBy(e.target.value)}
                  disabled={!!id} // 🔥 DISABLED IN VIEW MODE
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-blue-600 w-full sm:w-64 disabled:bg-slate-100 disabled:text-slate-500"
                />
              </div>
              
              {/* 🔥 CONDITIONAL BUTTONS FOR VIEW VS CREATE MODE */}
              {id ? (
                <button
                  type="button"
                  onClick={() => alert("Report Approved Successfully! (Implement API here)")}
                  className="w-full sm:w-auto px-6 py-2 text-sm bg-[#10b981] text-white rounded-lg hover:bg-[#059669] transition-colors flex items-center justify-center gap-2 font-bold shadow-md"
                >
                  <Check size={16} /> APPROVE REPORT
                </button>
              ) : (
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isLoading}
                    className="w-full sm:w-auto px-4 py-2 text-sm border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 font-medium"
                  >
                    <RotateCcw size={14} /> Reset
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto px-4 py-2 text-sm bg-[#3b82f5] text-white rounded-lg hover:bg-[#2563eb] transition-colors flex items-center justify-center gap-2 font-medium shadow-sm"
                  >
                    {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                    {isLoading ? "Saving..." : "Save Production Plan"}
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DailyProdForm;