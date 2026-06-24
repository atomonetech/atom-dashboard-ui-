import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // 🔥 IMPORT useParams & useNavigate
import { ArrowLeft, Check, Loader2 } from "lucide-react"; // 🔥 Import added icons
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

const TipChangeMonitorForm = () => {
  const { id } = useParams(); // 🔥 GET ID FROM URL
  const navigate = useNavigate(); // 🔥 Navigation hook

  const [formData, setFormData] = useState({
    plant: "",
    machineName: "",
    machineNo: "",
    partName: "",
    operation: "",
    prdQty: "",
    tipChange: "",
  });

  const [machineList, setMachineList] = useState([]);
  const [machinesLoading, setMachinesLoading] = useState(false);
  const [partsData, setPartsData] = useState([]);
  const [operationsData, setOperationsData] = useState([]);
  const [preparedBy, setPreparedBy] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const getItemText = (item) => {
    if (!item) return "";
    return typeof item === 'string' ? item : (item.name || item.operation || item.part_name || "");
  };

  const sortArrayAlphabetically = (arr) => {
    const cleanArray = Array.isArray(arr) ? arr : [];
    return [...cleanArray].sort((a, b) => {
        const strA = getItemText(a).toLowerCase().trim();
        const strB = getItemText(b).toLowerCase().trim();
        return strA.localeCompare(strB);
    });
  };

  // 🔥 FETCH REPORT DATA IF ID EXISTS (VIEW/APPROVE MODE)
  useEffect(() => {
    if (id) {
      const fetchReportData = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(`${BASE_URL}/api/get-single-production-report/tip-change/${id}/`);
          
          if (response.data.success) {
            const data = response.data.data;
            
            // Reverse map plant logic
            const actualPlant = REVERSE_PLANT_MAP[data.plant] || data.plant || "";

            setFormData({
              plant: actualPlant,
              machineName: data.machineName || data.machine_name || "",
              machineNo: data.machineNo || data.machine_no || "",
              partName: data.partName || data.part_name || "",
              operation: data.operation || "",
              prdQty: data.prodQty || data.prd_qty || "",
              tipChange: data.tipChange || data.tip_change || "",
            });
            
            setPreparedBy(data.submitted_by || data.prepared_by || "");
            
            // Fetch operations for the part so it shows up correctly
            const pName = data.partName || data.part_name;
            if (pName) {
              axios.get(`${BASE_URL}/api/master-dropdown/?filter=operations_by_part&part=${encodeURIComponent(pName)}`)
                .then(res => setOperationsData(sortArrayAlphabetically(res.data)))
                .catch(err => console.error(err));
            }
          }
        } catch (error) {
          console.error("Error fetching single report:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchReportData();
    }
  }, [id]);

  // 1. Component load hote hi Part Names fetch karna
  useEffect(() => {
    fetch(`${BASE_URL}/api/master-dropdown/?filter=all_parts`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const uniquePartNames = [...new Set(data.map((item) => item[0]))];
          setPartsData(sortArrayAlphabetically(uniquePartNames));
        }
      })
      .catch((err) => console.error("Error fetching parts:", err));
  }, []);

  // 2. Machine Name change hone par Backend (Press) ya Frontend (CNC/VMC) se list banana
  useEffect(() => {
    if (formData.plant && !id) { // Only fetch dynamic machines if NOT in view mode
      if (formData.machineName === "Press") {
        setMachinesLoading(true);
        const plantKey = PLANT_MAP[formData.plant];

        fetch(
          `${BASE_URL}/api/machines/list/?plant=${plantKey}&machine_name=Press`,
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.machines) {
              setMachineList(sortArrayAlphabetically(data.machines));
            } else if (Array.isArray(data)) {
              setMachineList(sortArrayAlphabetically(data));
            } else {
              setMachineList([]);
            }
          })
          .catch((err) => console.error("Error fetching machines:", err))
          .finally(() => setMachinesLoading(false));
      } else if (formData.machineName === "CNC") {
        const cncMachines = Array.from(
          { length: 12 },
          (_, i) => `CNC-${String(i + 1).padStart(2, "0")}`,
        );
        setMachineList(cncMachines);
        setMachinesLoading(false);
      } else if (formData.machineName === "VMC") {
        const vmcMachines = Array.from(
          { length: 4 },
          (_, i) => `VMC-${String(i + 1).padStart(2, "0")}`,
        );
        setMachineList(vmcMachines);
        setMachinesLoading(false);
      } else {
        setMachineList([]);
      }
    }
  }, [formData.plant, formData.machineName, id]);

  // 3. Handle Input Changes aur Dependent Dropdown logic
  const handleChange = async (e) => {
    if (id) return; // 🔥 Disable changes in view mode

    const { name, value } = e.target;

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === "plant" || name === "machineName") {
        newData.machineNo = "";
      }
      return newData;
    });

    if (name === "partName") {
      setFormData((prev) => ({ ...prev, operation: "" }));
      setOperationsData([]);

      if (value) {
        try {
          const response = await fetch(
            `${BASE_URL}/api/master-dropdown/?filter=operations_by_part&part=${encodeURIComponent(
              value,
            )}`,
          );
          const data = await response.json();
          if (Array.isArray(data)) {
            setOperationsData(sortArrayAlphabetically(data));
          }
        } catch (error) {
          console.error("Error fetching operations:", error);
        }
      }
    }
  };

  const handleReset = () => {
    if (id) return;
    setFormData({
      plant: "",
      machineName: "",
      machineNo: "",
      partName: "",
      operation: "",
      prdQty: "",
      tipChange: "",
    });
    setOperationsData([]);
    setMachineList([]);
    setPreparedBy("");
  };

  const handleApprove = async () => {
    if (!id) return;
    const currentUser = localStorage.getItem("username") || "Approver";
    
    setIsApproving(true);
    try {
        const response = await axios.post(`${BASE_URL}/api/approve-report/`, {
            log_id: id,
            approver_username: currentUser
        });
        if(response.status === 200) {
            alert(response.data.message || "Report Approved Successfully!");
            navigate(-1);
        }
    } catch (error) {
        console.error("Error approving report:", error);
        alert("Failed to approve report. Please try again.");
    } finally {
        setIsApproving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) return;

    if (
      !formData.plant ||
      !formData.machineName ||
      !formData.machineNo ||
      !formData.partName ||
      !formData.operation ||
      !formData.prdQty ||
      !formData.tipChange
    ) {
      alert("Please fill all fields");
      return;
    }

    const payloadData = {
      plant: PLANT_MAP[formData.plant],
      machine_name: formData.machineName,
      machine_no: formData.machineNo,
      part_name: formData.partName,
      operation: formData.operation,
      prd_qty: parseInt(formData.prdQty),
      tip_change: formData.tipChange,
    };

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/save-tip-data/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadData),
      });
      const result = await response.json();

      if (response.ok) {
        const currentUser = localStorage.getItem("username") || "Unknown User";
        try {
          await axios.post(API_LOG, {
            username: currentUser,
            report_name: "Tip Change Monitor Form", 
            record_id: result.record_id 
          });
        } catch (logError) {
          console.error("Activity log save karne mein error aayi:", logError);
        }
        alert("Data saved successfully!");
        handleReset();
      } else {
        alert("Failed to save data. Please check inputs.");
      }
    } catch (error) {
      alert("Error connecting to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1); // Safely go back
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <button
        className="flex items-center gap-2 bg-[#916cf6] hover:bg-[#7b55e0] px-4 py-2.5 rounded-none shadow-sm text-white transition-colors mb-4 sm:mb-5 md:mb-6 font-medium text-sm sm:text-base w-fit"
        onClick={handleBack}
      >
        <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
        Back
      </button>

      <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
          <div className="flex flex-col xs:flex-row xs:items-center gap-2 sm:gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              {id ? "Tip Change Monitoring (REVIEW)" : "Tip Change Monitoring"}
            </h2>
            {id && (
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">
                PENDING APPROVAL
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-3 sm:px-4 py-2 rounded-sm w-fit sm:w-auto border border-gray-200">
            <span className="text-xs sm:text-sm font-medium text-gray-500 whitespace-nowrap">
              Date:
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#916cf6] whitespace-nowrap">
              {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "/")}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Plant Field */}
            <div className="flex flex-col min-w-0">
              <label htmlFor="plant" className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                Plant <span className="text-red-500">*</span>
              </label>
              <select
                id="plant"
                name="plant"
                value={formData.plant}
                onChange={handleChange}
                disabled={!!id}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-[#916cf6] text-gray-700 text-sm disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="" className="text-gray-400">Select Plant</option>
                <option value="Plant 1">Plant 1</option>
                <option value="Plant 2">Plant 2</option>
              </select>
            </div>

            {/* 2. Machine Name Field */}
            <div className="flex flex-col min-w-0">
              <label htmlFor="machineName" className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                Machine Name <span className="text-red-500">*</span>
              </label>
              <select
                id="machineName"
                name="machineName"
                value={formData.machineName}
                onChange={handleChange}
                disabled={!!id}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-[#916cf6] text-gray-700 text-sm disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="" className="text-gray-400">Select Machine</option>
                <option value="Press">POWER PRESS</option>
                <option value="CNC">CNC</option>
                <option value="VMC">VMC</option>
                {id && formData.machineName && !["Press", "CNC", "VMC"].includes(formData.machineName) && (
                   <option value={formData.machineName}>{formData.machineName}</option>
                )}
              </select>
            </div>

            {/* 3. Machine No Field */}
            <div className="flex flex-col min-w-0">
              <label htmlFor="machineNo" className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                Machine No <span className="text-red-500">*</span>
              </label>
              <select
                id="machineNo"
                name="machineNo"
                value={formData.machineNo}
                onChange={handleChange}
                disabled={!!id || !formData.plant || !formData.machineName || machinesLoading}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-[#916cf6] text-gray-700 text-sm disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="" className="text-gray-400">
                  {machinesLoading ? "Loading..." : "Select Machine No"}
                </option>
                {machineList.map((mc, index) => (
                  <option key={index} value={mc}>{mc}</option>
                ))}
                {id && formData.machineNo && !machineList.includes(formData.machineNo) && (
                   <option value={formData.machineNo}>{formData.machineNo}</option>
                )}
              </select>
            </div>

            {/* 4. Part Name Field */}
            <div className="flex flex-col min-w-0">
              <label htmlFor="partName" className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                Part Name <span className="text-red-500">*</span>
              </label>
              <select
                id="partName"
                name="partName"
                value={formData.partName}
                onChange={handleChange}
                disabled={!!id}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-[#916cf6] text-gray-700 text-sm disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="" className="text-gray-400">Select Part Name</option>
                {partsData.map((part, index) => (
                  <option key={index} value={part}>{part}</option>
                ))}
                {id && formData.partName && !partsData.includes(formData.partName) && (
                   <option value={formData.partName}>{formData.partName}</option>
                )}
              </select>
            </div>

            {/* 5. Operation Field */}
            <div className="flex flex-col min-w-0">
              <label htmlFor="operation" className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                Operation <span className="text-red-500">*</span>
              </label>
              <select
                id="operation"
                name="operation"
                value={formData.operation}
                onChange={handleChange}
                disabled={!!id || !formData.partName}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-[#916cf6] text-gray-700 text-sm disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="" className="text-gray-400">Select Operation</option>
                {operationsData.map((op, index) => (
                  <option key={index} value={op}>{op}</option>
                ))}
                {id && formData.operation && !operationsData.includes(formData.operation) && (
                   <option value={formData.operation}>{formData.operation}</option>
                )}
              </select>
            </div>

            {/* 6. PRD QTY Field */}
            <div className="flex flex-col min-w-0">
              <label htmlFor="prdQty" className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                PRD QTY <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="prdQty"
                name="prdQty"
                value={formData.prdQty}
                onChange={handleChange}
                readOnly={!!id}
                placeholder="Enter quantity"
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-[#916cf6] text-gray-700 disabled:bg-gray-100 disabled:text-gray-500 text-sm"
              />
            </div>

            {/* 7. Tip Change Field */}
            <div className="flex flex-col min-w-0">
              <label htmlFor="tipChange" className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                Tip Change <span className="text-red-500">*</span>
              </label>
              <select
                id="tipChange"
                name="tipChange"
                value={formData.tipChange}
                onChange={handleChange}
                disabled={!!id}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-[#916cf6] text-gray-700 text-sm disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="" className="text-gray-400">Select option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                Prepared By
              </label>
              <input
                type="text"
                value={preparedBy}
                readOnly={!!id}
                onChange={(e) => setPreparedBy(e.target.value)}
                placeholder="Enter name"
                className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#916cf6] text-sm text-[#916cf6] w-full sm:w-64 disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {id ? (
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="w-full sm:w-auto px-8 py-3 bg-[#10b981] hover:bg-[#059669] shadow-md text-white font-bold tracking-wide rounded-none transition-all text-sm flex items-center justify-center gap-2"
                >
                  {isApproving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} 
                  {isApproving ? "APPROVING..." : "APPROVE REPORT"}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isLoading}
                    className="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-bold tracking-wide rounded-none transition-all text-sm disabled:opacity-50"
                  >
                    RESET FORM
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto px-8 py-3 bg-[#916cf6] hover:bg-[#7b55e0] shadow-md text-white font-bold tracking-wide rounded-none transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isLoading && <Loader2 size={16} className="animate-spin" />} SAVE ENTRY
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TipChangeMonitorForm;