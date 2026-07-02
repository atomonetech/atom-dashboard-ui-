import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
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
  ClipboardList,
} from "lucide-react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const PLANT_MAP = {
  "Plant 1": "plant_1",
  "Plant 2": "plant_2",
};

// Reverse map for View Mode
const REVERSE_PLANT_MAP = {
  "plant_1": "Plant 1",
  "plant_2": "Plant 2",
};
const getItemText = (item) => {
    if (!item) return "";
    return typeof item === 'string' ? item : (item.name || item.operation || item.part_name || "");
};

// 🔥 PURE SORTING FUNCTION WITHOUT REMOVING KEYWORDS
const sortArrayAlphabetically = (arr) => {
    const cleanArray = Array.isArray(arr) ? arr : [];
    return [...cleanArray].sort((a, b) => {
        const strA = getItemText(a).toLowerCase().trim();
        const strB = getItemText(b).toLowerCase().trim();
        return strA.localeCompare(strB);
    });
};

// Hardcoded machines list for Plant 2
const PLANT2_MACHINES = Array.from({ length: 48 }, (_, i) => i + 1);

/* ───────────────────────── Small presentational helpers ───────────────────────── */

function FieldGroupHeading({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 text-blue-600">
        <Icon size={14} />
      </span>
      <h2 className="text-[12px] font-bold uppercase tracking-[0.1em] text-slate-500">
        {label}
      </h2>
      <div className="flex-1 h-px bg-slate-100" />
    </div>
  );
}

function FieldLabel({ icon: Icon, color = "text-blue-500", children }) {
  return (
    <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
      <Icon size={13} className={color} /> {children}
    </label>
  );
}

const inputBase =
  "w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-lg outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-50 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-150";

const DailyProdForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 🔥 READ-ONLY MODE: pass ?readonly=true (or ?mode=view) in the URL when
  // linking here from a context — like the Analysis Hub — where Approve/Reject
  // controls should not be shown. Defaults to false everywhere else.
  const isReadOnly =
    searchParams.get("readonly") === "true" || searchParams.get("mode") === "view";

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
  const [preparedBy, setPreparedBy] = useState(
  localStorage.getItem("username") || ""
  );

  const [approvalStatus, setApprovalStatus] = useState("Pending");
  const [approvedBy, setApprovedBy] = useState("");
  const [rejectedBy, setRejectedBy] = useState("");
  const [rejectRemark, setRejectRemark] = useState("");

  // Form states
  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
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
              machineNo: data.machine_no || data.machineNo || "",
              operatorName: data.operator_name || data.operatorName || "",
              partName: data.part_name || data.partName || "",
              partNo: data.part_no || data.partNo || "",
              operationName: data.operation_name || data.operation || "",
              plannedQuantity: data.planned_quantity || data.plannedQuantity || "",
              achievedQuantity: data.achieved_quantity || data.achievedQuantity || "",
              qtyRemark: data.qty_remark || data.qtyRemark || "",
              productionStartTime: data.production_start_time || data.productionStartTime ? (data.production_start_time || data.productionStartTime).substring(0, 5) : "",
              productionEndTime: data.production_end_time || data.productionEndTime ? (data.production_end_time || data.productionEndTime).substring(0, 5) : "",
              totalWorkingTime: data.total_working_time || data.totalWorkingTime || "",
              toolSetupTime: data.tool_setup_time || data.toolSetupTime || "",
              machineBdTime: data.machine_bd_time || data.machineBdTime || "",
              toolBdTime: data.tool_bd_time || data.toolBdTime || "",
              rmCoilNo: data.rm_coil_no || data.rmCoilNo || "",
            });
            setPreparedBy(data.submitted_by || "");
            setApprovalStatus(data.approval_status || "Pending");
            setApprovedBy(data.approved_by || "");
            setRejectedBy(data.rejected_by || "");
            setRejectRemark(data.remarks || data.rejection_remark || data.remark || "");

            // Pre-fetch operations for this part so dropdown isn't empty
            const partNameVal = data.part_name || data.partName;
            if (partNameVal) {
              axios.get(`${BASE_URL}/api/master-dropdown/?filter=operations_by_part&part=${encodeURIComponent(partNameVal)}`)
                .then(res => setOperationNames(sortArrayAlphabetically(res.data)))
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
          setPartsData(sortArrayAlphabetically(formattedParts));
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
            setMachineList(sortArrayAlphabetically(data.machines));
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
          .then((data) => setOperationNames(sortArrayAlphabetically(data)))
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

  const handleApprove = async () => {
  if (!id) return;

  const currentUser = localStorage.getItem("username") || "Approver";

  setIsApproving(true);

  try {
    const response = await axios.post(`${BASE_URL}/api/approve-report/`, {
      log_id: id,
      approver_username: currentUser,
      approved_by: currentUser,
      approval_status: "Approved",
      remark: rejectRemark,
      remarks: rejectRemark,
    });

    if (response.status === 200) {
      alert("✅ Report Approved Successfully!");
      navigate(-1);
    }
  } catch (error) {
    console.error("Error approving report:", error);

    if (error.response) {
      alert(
        `❌ Backend Error: ${
          error.response.data.error ||
          error.response.data.message ||
          "Route Not Found"
        }`
      );
    } else {
      alert("❌ Network Error: Failed to connect to server.");
    }
  } finally {
    setIsApproving(false);
  }
  };
  
  const handleReject = async () => {
  if (!id) return;

  if (!rejectRemark.trim()) {
    alert("Please enter rejection remark");
    return;
  }

  const currentUser = localStorage.getItem("username") || "Approver";

  setIsRejecting(true);

  try {
    const response = await axios.post(`${BASE_URL}/api/reject-report/`, {
      log_id: id,
      approver_username: currentUser,
      rejected_by: currentUser,
      rejection_remark: rejectRemark,
      remark: rejectRemark,
      remarks: rejectRemark,
      approval_status: "Rejected",
    });

    if (response.status === 200) {
      alert("❌ Report Rejected Successfully!");
      navigate(-1);
    }
  } catch (error) {
    console.error("Error rejecting report:", error);

    if (error.response) {
      alert(
        `❌ Backend Error: ${
          error.response.data.error ||
          error.response.data.message ||
          "Route Not Found"
        }`
      );
    } else {
      alert("❌ Network Error: Failed to connect to server.");
    }
  } finally {
    setIsRejecting(false);
  }
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
      // 🔥 NAYA CODE: Frontend se username bhej rahe hain taaki backend auto-log bana sake
      submitted_by: localStorage.getItem("username") || "Unknown User"
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
        // 🔥 NAYA CODE: Yahan se doosri API call (Activity Log wali) hata di gayi hai!
        alert(result.message || "Daily Production Plan saved successfully!");
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
    navigate(-1); // Safely go back to previous page
  };

  const isReview = !!id;
  const statusLower = (approvalStatus || "Pending").toLowerCase();

  return (
    <div className="min-h-screen text-slate-900 bg-[#F7F8FA] py-8 px-4 flex justify-center">
      <div className="w-full max-w-6xl">
        <div className="relative bg-white rounded-[20px] border border-slate-200/80 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_16px_40px_-16px_rgba(15,23,42,0.10)] overflow-hidden">

          {/* ledger spine accent */}
          <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-blue-500 via-blue-400 to-indigo-400" />

          {/* ── TOP NAV ── */}
          <div className="pl-7 pr-6 md:pl-9 md:pr-8 pt-6 flex justify-between items-center">
            <button
              type="button"
              onClick={handleBack}
              className="group inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white border border-slate-200 shadow-sm group-hover:border-slate-300 transition-colors">
                <ArrowLeft size={13} />
              </span>
              Back
            </button>

            {isReview && (
              <StatusBadge status={approvalStatus} />
            )}
          </div>

          {/* ── HERO HEADER ── */}
          <div className="pl-7 pr-6 md:pl-9 md:pr-8 pt-5 pb-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 flex-shrink-0">
                <Package size={22} className="text-blue-600" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-blue-600 uppercase tracking-[0.12em] mb-0.5">
                  Manufacturing Execution System
                </div>
                <h1 className="text-xl sm:text-[22px] font-bold text-slate-900 tracking-tight truncate">
                  {isReview ? "Daily Production Plan " : "Daily Production Plan"}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2.5 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl flex-shrink-0">
              <Calendar size={14} className="text-slate-500" />
              <span className="text-[13px] font-medium text-slate-600 whitespace-nowrap">
                {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-7 md:px-9 py-8">

            {/* ── IDENTIFICATION ── */}
            <FieldGroupHeading icon={Factory} label="Identification" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-9">
              <div className="flex flex-col">
                <FieldLabel icon={Factory}>Plant *</FieldLabel>
                <select
                  name="plant"
                  value={formData.plant}
                  onChange={handleChange}
                  disabled={!!id}
                  className={inputBase}
                >
                  <option value="">Select Plant</option>
                  {Object.keys(PLANT_MAP).map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                  {id && formData.plant && !Object.keys(PLANT_MAP).includes(formData.plant) && (
                    <option value={formData.plant}>{formData.plant}</option>
                  )}
                </select>
              </div>

              <div className="flex flex-col">
                <FieldLabel icon={ListFilter}>Shift *</FieldLabel>
                <select
                  name="shift"
                  value={formData.shift}
                  onChange={handleChange}
                  disabled={!!id}
                  className={inputBase}
                >
                  <option value="">Select Shift</option>
                  <option value="A">Shift A</option>
                  <option value="B">Shift B</option>
                  <option value="C">Shift C</option>
                  {id && formData.shift && !["A","B"].includes(formData.shift) && (
                    <option value={formData.shift}>{formData.shift}</option>
                  )}
                </select>
              </div>

              <div className="flex flex-col">
                <FieldLabel icon={Cpu}>Machine No *</FieldLabel>
                <select
                  name="machineNo"
                  value={formData.machineNo}
                  onChange={handleChange}
                  disabled={!!id || !formData.plant || machinesLoading}
                  className={inputBase}
                >
                  <option value="">{machinesLoading ? "Loading..." : "Select Machine"}</option>
                  {machineList.map((m) => (
                    <option key={m} value={m}>Machine {m}</option>
                  ))}
                  {id && formData.machineNo && !machineList.includes(Number(formData.machineNo)) && !machineList.includes(String(formData.machineNo)) && (
                    <option value={formData.machineNo}>Machine {formData.machineNo}</option>
                  )}
                </select>
              </div>

              <div className="flex flex-col">
                <FieldLabel icon={User}>Operator Name *</FieldLabel>
                {isAddingNewOperator && !id ? (
                  <div className="flex gap-2 h-[42px]">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Enter Name"
                      value={newOperatorName}
                      onChange={(e) => setNewOperatorName(e.target.value)}
                      disabled={isSavingOperator}
                      className="w-full px-3 py-1 text-sm bg-white border border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-50 outline-none"
                    />
                    <button type="button" onClick={handleSaveNewOperator} className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"><Check size={16} /></button>
                    <button type="button" onClick={() => setIsAddingNewOperator(false)} className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"><X size={16} /></button>
                  </div>
                ) : (
                  <select
                    name="operatorName"
                    value={formData.operatorName}
                    onChange={handleChange}
                    disabled={!!id || !formData.plant || operatorsLoading}
                    className={inputBase}
                  >
                    <option value="">{operatorsLoading ? "Loading..." : "Select Operator"}</option>
                    {operatorNames.map((op, index) => (
                      <option key={op.id || index} value={op.name}>{op.name}</option>
                    ))}
                    {formData.plant && !operatorsLoading && !id && (
                      <option value="ADD_NEW" className="font-semibold text-blue-600 bg-blue-50">+ Add New Operator</option>
                    )}
                    {id && formData.operatorName && !operatorNames.some(op => op.name === formData.operatorName) && (
                      <option value={formData.operatorName}>{formData.operatorName}</option>
                    )}
                  </select>
                )}
              </div>
            </div>

            {/* ── PART & OPERATION ── */}
            <FieldGroupHeading icon={Package} label="Part & Operation" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-9">
              <div className="flex flex-col">
                <FieldLabel icon={Package}>Part Name *</FieldLabel>
                <select
                  name="partName"
                  value={formData.partName}
                  onChange={handleChange}
                  disabled={!!id}
                  className={inputBase}
                >
                  <option value="">Select Part</option>
                  {partsData.map((part, index) => (
                    <option key={index} value={part.part_name}>{part.part_name}</option>
                  ))}
                  {id && formData.partName && !partsData.some(p => p.part_name === formData.partName) && (
                     <option value={formData.partName}>{formData.partName}</option>
                  )}
                </select>
              </div>

              <div className="flex flex-col">
                <FieldLabel icon={Hash}>Part No *</FieldLabel>
                <input
                  type="text"
                  name="partNo"
                  value={formData.partNo}
                  readOnly
                  disabled={!!id}
                  className={`${inputBase} bg-slate-50 text-slate-500`}
                />
              </div>

              <div className="flex flex-col">
                <FieldLabel icon={Settings}>Operation Name *</FieldLabel>
                <select
                  name="operationName"
                  value={formData.operationName}
                  onChange={handleChange}
                  disabled={!!id || !formData.partName}
                  className={inputBase}
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

              <div className="flex flex-col">
                <FieldLabel icon={Layers} color="text-indigo-500">RM Coil / Lot No.</FieldLabel>
                <input
                  type="text"
                  name="rmCoilNo"
                  value={formData.rmCoilNo}
                  onChange={handleChange}
                  disabled={!!id}
                  className={inputBase}
                />
              </div>
            </div>

            {/* ── QUANTITY & TIME ── */}
            <FieldGroupHeading icon={Clock} label="Quantity & Time Tracking" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-9">
              <div className="flex flex-col">
                <FieldLabel icon={Target}>Planned Qty *</FieldLabel>
                <input
                  type="number"
                  name="plannedQuantity"
                  value={formData.plannedQuantity}
                  onChange={handleChange}
                  disabled={!!id}
                  className={inputBase}
                />
              </div>

              <div className="flex flex-col">
                <FieldLabel icon={CheckCircle} color="text-emerald-500">Achieved Qty.</FieldLabel>
                <input
                  type="number"
                  name="achievedQuantity"
                  value={formData.achievedQuantity}
                  onChange={handleChange}
                  disabled={!!id}
                  className={inputBase}
                />
              </div>

              <div className="flex flex-col">
                <FieldLabel icon={Clock}>Start Time</FieldLabel>
                <input
                  type="time"
                  name="productionStartTime"
                  value={formData.productionStartTime}
                  onChange={handleChange}
                  disabled={!!id}
                  className={inputBase}
                />
              </div>

              <div className="flex flex-col">
                <FieldLabel icon={Clock}>End Time</FieldLabel>
                <input
                  type="time"
                  name="productionEndTime"
                  value={formData.productionEndTime}
                  onChange={handleChange}
                  disabled={!!id}
                  className={inputBase}
                />
              </div>

              <div className="flex flex-col">
                <FieldLabel icon={Clock}>Total Working Time</FieldLabel>
                <input
                  type="text"
                  name="totalWorkingTime"
                  value={formData.totalWorkingTime}
                  readOnly
                  disabled={!!id}
                  className={`${inputBase} bg-emerald-50/70 border-emerald-200 text-emerald-700 font-semibold`}
                />
              </div>

              <div className="flex flex-col">
                <FieldLabel icon={Wrench} color="text-orange-500">Tool Set-up Time</FieldLabel>
                <input
                  type="number"
                  name="toolSetupTime"
                  value={formData.toolSetupTime}
                  onChange={handleChange}
                  disabled={!!id}
                  className={inputBase}
                />
              </div>

              <div className="flex flex-col">
                <FieldLabel icon={AlertTriangle} color="text-red-500">Machine B/D Time</FieldLabel>
                <input
                  type="number"
                  name="machineBdTime"
                  value={formData.machineBdTime}
                  onChange={handleChange}
                  disabled={!!id}
                  className={inputBase}
                />
              </div>

              <div className="flex flex-col">
                <FieldLabel icon={AlertTriangle} color="text-red-500">Tool B/D Time</FieldLabel>
                <input
                  type="number"
                  name="toolBdTime"
                  value={formData.toolBdTime}
                  onChange={handleChange}
                  disabled={!!id}
                  className={inputBase}
                />
              </div>
            </div>

            {/* ── REMARKS ── */}
            <FieldGroupHeading icon={MessageSquare} label="Remarks" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-2">
              <div className="flex flex-col sm:col-span-2 lg:col-span-2">
                <FieldLabel icon={MessageSquare}>Qty. Remark</FieldLabel>
                <input
                  type="text"
                  name="qtyRemark"
                  value={formData.qtyRemark}
                  onChange={handleChange}
                  disabled={!!id}
                  className={inputBase}
                />
              </div>
            </div>

            {/* ========================================================= */}
            {/* ── UNIFIED FORM ACTION FOOTER SECTION ──                  */}
            {/* ========================================================= */}
            <div className="mt-8 pt-7 border-t border-slate-100 w-full">
              {isReview ? (
                /* REVIEW MODE (For Department Heads, or read-only Analysis Hub viewing) */
                <div className="flex flex-col gap-6 w-full">

                  {/* Traceability Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Prepared By
                      </label>
                      <div className="text-sm font-semibold text-slate-700 bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl shadow-sm">
                        {preparedBy || "—"}
                      </div>
                    </div>

                    {approvedBy && (
                      <div>
                        <label className="block text-[10.5px] font-bold text-emerald-600 uppercase tracking-wider mb-1.5">
                          Approved By
                        </label>
                        <div className="text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 rounded-xl shadow-sm">
                          {approvedBy}
                        </div>
                      </div>
                    )}

                    {rejectedBy && (
                      <div>
                        <label className="block text-[10.5px] font-bold text-red-600 uppercase tracking-wider mb-1.5">
                          Rejected By
                        </label>
                        <div className="text-sm font-semibold text-red-700 bg-red-50 border border-red-200 px-3.5 py-2.5 rounded-xl shadow-sm">
                          {rejectedBy}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Remarks + Action Cluster — only meaningful when actions are visible,
                      but the remarks text itself is still useful to show read-only */}
                  <div className="flex flex-col lg:flex-row items-end gap-6 w-full">
                    <div className="flex flex-col gap-2 flex-1 w-full">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        Reviewer Remarks {isReadOnly ? "" : "/ Reason for Rejection"}
                      </label>
                      <textarea
                        value={rejectRemark}
                        onChange={(e) => setRejectRemark(e.target.value)}
                        disabled={isReadOnly || isApproving || isRejecting || statusLower === "approved" || statusLower === "rejected"}
                        placeholder={isReadOnly ? "No remarks recorded yet." : "Enter a clear note explaining why this report is approved or rejected..."}
                        className="w-full min-h-[95px] max-h-[220px] p-3.5 border border-slate-200 rounded-xl text-sm text-slate-800 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all font-sans placeholder-slate-400 shadow-sm disabled:bg-slate-50 disabled:text-slate-500"
                      />
                    </div>

                    {/* Approve / Reject — hidden entirely in read-only (Analysis Hub) mode */}
                    {!isReadOnly && (
                      <div className="flex gap-3 shrink-0 w-full lg:w-auto justify-end">
                        <button
                          type="button"
                          onClick={handleApprove}
                          disabled={isApproving || statusLower === "approved" || statusLower === "rejected"}
                          className="inline-flex items-center justify-center gap-2 px-6 h-12 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl uppercase tracking-wider shadow-sm transition-all min-w-[170px] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]"
                        >
                          {isApproving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                          {isApproving ? "Approving..." : "Approve Report"}
                        </button>

                        <button
                          type="button"
                          onClick={handleReject}
                          disabled={isRejecting || statusLower === "approved" || statusLower === "rejected"}
                          className="inline-flex items-center justify-center gap-2 px-6 h-12 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-xl uppercase tracking-wider shadow-sm transition-all min-w-[170px] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]"
                        >
                          {isRejecting ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
                          {isRejecting ? "Rejecting..." : "Reject Report"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* OPERATOR MODE (Standard form submittal fields) */
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between w-full">
                  <div className="flex flex-col">
                    <label className="text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                      Prepared By
                    </label>
                    <input
                      type="text"
                      value={preparedBy}
                      onChange={(e) => setPreparedBy(e.target.value)}
                      disabled={isLoading}
                      className="px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-blue-600 w-full sm:w-64 disabled:bg-slate-50 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={isLoading}
                      className="w-full sm:w-auto px-4 py-2.5 text-sm border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <RotateCcw size={14} /> Reset
                    </button>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full sm:w-auto px-5 py-2.5 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm active:scale-[0.97]"
                    >
                      {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      {isLoading ? "Saving..." : "Save Production Plan"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

function StatusBadge({ status }) {
  const s = (status || "Pending").toLowerCase();
  const styles =
    s === "approved"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : s === "rejected"
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-amber-50 text-amber-700 border-amber-200";
  const dot =
    s === "approved" ? "bg-emerald-500" : s === "rejected" ? "bg-red-500" : "bg-amber-500";

  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full border ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status || "Under Review"}
    </span>
  );
}

export default DailyProdForm;