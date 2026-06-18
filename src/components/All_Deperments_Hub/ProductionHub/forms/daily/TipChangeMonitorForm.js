import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const API_LOG = `${
  process.env.REACT_APP_API_URL || "http://localhost:8000"
}/api/log-report/`;

const PLANT_MAP = {
  "Plant 1": "plant_1",
  "Plant 2": "plant_2",
};

const TipChangeMonitorForm = () => {
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

  // 1. Component load hote hi Part Names fetch karna
  useEffect(() => {
    fetch(`${BASE_URL}/api/master-dropdown/?filter=all_parts`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const uniquePartNames = [...new Set(data.map((item) => item[0]))];
          setPartsData(uniquePartNames);
        }
      })
      .catch((err) => console.error("Error fetching parts:", err));
  }, []);

  // 2. Machine Name change hone par Backend (Press) ya Frontend (CNC/VMC) se list banana
  useEffect(() => {
    if (formData.plant) {
      if (formData.machineName === "Press") {
        // Press ke liye Backend API Call
        setMachinesLoading(true);
        const plantKey = PLANT_MAP[formData.plant];

        fetch(
          `${BASE_URL}/api/machines/list/?plant=${plantKey}&machine_name=Press`,
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.machines) {
              setMachineList(data.machines);
            } else if (Array.isArray(data)) {
              setMachineList(data);
            } else {
              setMachineList([]);
            }
          })
          .catch((err) => console.error("Error fetching machines:", err))
          .finally(() => setMachinesLoading(false));
      } else if (formData.machineName === "CNC") {
        // CNC ke liye Frontend Hardcoded logic (12 Machines)
        const cncMachines = Array.from(
          { length: 12 },
          (_, i) => `CNC-${String(i + 1).padStart(2, "0")}`,
        );
        setMachineList(cncMachines);
        setMachinesLoading(false);
      } else if (formData.machineName === "VMC") {
        // VMC ke liye Frontend Hardcoded logic (4 Machines)
        const vmcMachines = Array.from(
          { length: 4 },
          (_, i) => `VMC-${String(i + 1).padStart(2, "0")}`,
        );
        setMachineList(vmcMachines);
        setMachinesLoading(false);
      } else {
        setMachineList([]);
      }
    } else {
      setMachineList([]);
    }
  }, [formData.plant, formData.machineName]);

  // 3. Handle Input Changes aur Dependent Dropdown logic
  const handleChange = async (e) => {
    const { name, value } = e.target;

    // Nayi value set karo
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Agar Plant ya Machine Name change ho raha hai, toh purana Machine No clear kar do
      if (name === "plant" || name === "machineName") {
        newData.machineNo = "";
      }

      return newData;
    });

    // Agar Part Name change hota hai, toh uske operations fetch karo
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
            setOperationsData(data);
          }
        } catch (error) {
          console.error("Error fetching operations:", error);
        }
      }
    }
  };

  const handleReset = () => {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    try {
      const response = await fetch(`${BASE_URL}/api/save-tip-data/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadData),
      });

      if (response.ok) {
        const currentUser = localStorage.getItem("username") || "Unknown User";

        try {
          await axios.post(API_LOG, {
            username: currentUser,
            report_name: "Tip Chage Monitor sheet  Form", // Yahan hardcode kar diya form ka naam
          });
          console.log("Activity log successfully saved!");
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
    }
  };

  const handleBack = () => {
    window.location.href = "/production-hub";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <button
        className="flex items-center gap-2 bg-[#916cf6] hover:bg-[#7b55e0] px-4 py-2.5 rounded-none shadow-sm text-white transition-colors mb-4 sm:mb-5 md:mb-6 font-medium text-sm sm:text-base w-fit"
        onClick={handleBack}
      >
        <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
        Back to Productionhub
      </button>

      <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
          <div className="flex flex-col xs:flex-row xs:items-center gap-2 sm:gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              Tip Change Monitoring
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-3 sm:px-4 py-2 rounded-sm w-fit sm:w-auto border border-gray-200">
            <span className="text-xs sm:text-sm font-medium text-gray-500 whitespace-nowrap">
              Current Date:
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#916cf6] whitespace-nowrap">
              {new Date()
                .toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
                .replace(/\//g, "/")}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Plant Field */}
            <div className="flex flex-col min-w-0">
              <label
                htmlFor="plant"
                className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wide"
              >
                Plant <span className="text-red-500">*</span>
              </label>
              <select
                id="plant"
                name="plant"
                value={formData.plant}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-[#916cf6] focus:border-[#916cf6] text-gray-700 text-sm transition-colors"
              >
                <option value="" className="text-gray-400">
                  Select Plant
                </option>
                <option value="Plant 1">Plant 1</option>
                <option value="Plant 2">Plant 2</option>
              </select>
            </div>

            {/* 2. Machine Name Field */}
            <div className="flex flex-col min-w-0">
              <label
                htmlFor="machineName"
                className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wide"
              >
                Machine Name <span className="text-red-500">*</span>
              </label>
              <select
                id="machineName"
                name="machineName"
                value={formData.machineName}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-[#916cf6] focus:border-[#916cf6] text-gray-700 text-sm transition-colors"
              >
                <option value="" className="text-gray-400">
                  Select Machine
                </option>
                <option value="Press">POWER PRESS</option>
                <option value="CNC">CNC</option>
                <option value="VMC">VMC</option>
              </select>
            </div>

            {/* 3. Machine No Field (Now fully dropdown for all 3) */}
            <div className="flex flex-col min-w-0">
              <label
                htmlFor="machineNo"
                className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wide"
              >
                Machine No <span className="text-red-500">*</span>
              </label>
              <select
                id="machineNo"
                name="machineNo"
                value={formData.machineNo}
                onChange={handleChange}
                disabled={
                  !formData.plant || !formData.machineName || machinesLoading
                }
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-[#916cf6] focus:border-[#916cf6] text-gray-700 text-sm transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="" className="text-gray-400">
                  {machinesLoading
                    ? "Loading..."
                    : !formData.plant || !formData.machineName
                    ? "Select Plant & Machine"
                    : "Select Machine No"}
                </option>
                {machineList.map((mc, index) => (
                  <option key={index} value={mc}>
                    {mc}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Part Name Field */}
            <div className="flex flex-col min-w-0">
              <label
                htmlFor="partName"
                className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wide"
              >
                Part Name <span className="text-red-500">*</span>
              </label>
              <select
                id="partName"
                name="partName"
                value={formData.partName}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-[#916cf6] focus:border-[#916cf6] text-gray-700 text-sm truncate transition-colors"
              >
                <option value="" className="text-gray-400">
                  Select Part Name
                </option>
                {partsData.map((part, index) => (
                  <option key={index} value={part}>
                    {part}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Operation Field */}
            <div className="flex flex-col min-w-0">
              <label
                htmlFor="operation"
                className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wide"
              >
                Operation <span className="text-red-500">*</span>
              </label>
              <select
                id="operation"
                name="operation"
                value={formData.operation}
                onChange={handleChange}
                disabled={!formData.partName}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-[#916cf6] focus:border-[#916cf6] text-gray-700 text-sm truncate transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="" className="text-gray-400">
                  {formData.partName ? "Select Operation" : "Select Part First"}
                </option>
                {operationsData.map((op, index) => (
                  <option key={index} value={op}>
                    {op}
                  </option>
                ))}
              </select>
            </div>

            {/* 6. PRD QTY Field */}
            <div className="flex flex-col min-w-0">
              <label
                htmlFor="prdQty"
                className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wide"
              >
                PRD QTY <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="prdQty"
                name="prdQty"
                value={formData.prdQty}
                onChange={handleChange}
                placeholder="Enter quantity"
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-[#916cf6] focus:border-[#916cf6] text-gray-700 placeholder-gray-400 text-sm transition-colors"
              />
            </div>

            {/* 7. Tip Change Field */}
            <div className="flex flex-col min-w-0">
              <label
                htmlFor="tipChange"
                className="text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wide"
              >
                Tip Change <span className="text-red-500">*</span>
              </label>
              <select
                id="tipChange"
                name="tipChange"
                value={formData.tipChange}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-[#916cf6] focus:border-[#916cf6] text-gray-700 text-sm transition-colors"
              >
                <option value="" className="text-gray-400">
                  Select option
                </option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
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
                placeholder="Enter name"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-blue-600 w-full sm:w-64"
              />
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700 font-bold tracking-wide rounded-none transition-all text-sm"
            >
              RESET FORM
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-[#916cf6] hover:bg-[#7b55e0] shadow-md hover:shadow-lg text-white font-bold tracking-wide rounded-none transition-all text-sm"
            >
              SAVE ENTRY
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TipChangeMonitorForm;
