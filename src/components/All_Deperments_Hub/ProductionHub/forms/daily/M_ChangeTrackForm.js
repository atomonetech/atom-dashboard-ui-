import React, { useState, useEffect } from "react";
import {
  Calendar,
  User,
  Cpu,
  Package,
  BookOpen,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const API_LOG = `${
  process.env.REACT_APP_API_URL || "http://localhost:8000"
}/api/log-report/`;
const C = {
  pageBg: "#f5f5f0",
  white: "#ffffff",
  red: "#b91c1c",
  redLight: "#fef2f2",
  redBorder: "#fca5a5",
  redDark: "#991b1b",
  border: "#e2e2de",
  borderFoc: "#b91c1c",
  text: "#1a1a1a",
  textMid: "#6b7280",
  textLight: "#9ca3af",
  inputBg: "#ffffff",
  inputHov: "#fafaf8",
  rowHead: "#fafaf8",
  rowBorder: "#e8e4de",
  shadow: "0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.04)",
};

const MChangeTrackForm = () => {
  const today = new Date().toISOString().split("T")[0];
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [formData, setFormData] = useState({
    time: "",
    mcNo: "",
    changeDesc: "",
    natureOfChange: "Planned", // Default to Planned
    actionTaken: "",
    partNameNo: "",
    operationNo: "",
    trainingProvided: "",
    setupApproval: {
      status: "",
    },
    retroactive: {
      qtyChecked: "",
      entryQty: "",
      qtyOk: "",
      rw: "",
      scrap: "",
    },
    containmentSuspected: {
      qtyChecked: "",
      entryQty: "",
      qtyOk: "",
      rw: "",
      scrap: "",
    },
    dispatchDetail: {
      customer: "",
      date: today,
    },
    remark: "",
  });

  const [dailyTrackingData, setDailyTrackingData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preparedBy, setPreparedBy] = useState("");
  
  const [activeAction, setActiveAction] = useState(""); // "retroactive" | "containment" | ""

  const [currentDayData, setCurrentDayData] = useState({
    man: "",
    machine: "",
    material: "",
    method: "",
    submittedAt: null,
  });

  // Backend Lists
  const [partsList, setPartsList] = useState([]);
  const [operationList, setOperationList] = useState([]);
  const [customerList, setCustomerList] = useState([]);

  // STATES: For Custom Searchable Dropdown (Styled natively)
  const [showPartDropdown, setShowPartDropdown] = useState(false);
  const [partSearch, setPartSearch] = useState("");

  useEffect(() => {
    localStorage.removeItem("mChangeTrackingData");
    setDailyTrackingData({});
    setCurrentDayData({
      man: "",
      machine: "",
      material: "",
      method: "",
      submittedAt: null,
    });

    fetch(`${BASE_URL}/api/master-dropdown/?filter=all_parts`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const formattedParts = data.map((item) => ({
            part_name: item[0],
            part_no: item[1],
          }));
          setPartsList(formattedParts);
        }
      })
      .catch((err) => console.error("Error fetching parts:", err));

    fetch(`${BASE_URL}/api/master-dropdown/?filter=customer`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCustomerList(data);
        }
      })
      .catch((err) => console.error("Error fetching customers:", err));
  }, []);

  const getNextStatus = (currentStatus) => {
    if (currentStatus === "") return "CHANGE";
    if (currentStatus === "CHANGE") return "NO CHANGE";
    if (currentStatus === "NO CHANGE") return "";
    return "";
  };

  const getStatusDot = (status) => {
    switch (status) {
      case "CHANGE":
        return (
          <span
            className="inline-block w-8 h-8 rounded-full bg-red-500 cursor-pointer hover:ring-2 hover:ring-red-300 transition-all shadow-sm"
            title="Change"
          ></span>
        );
      case "NO CHANGE":
        return (
          <span
            className="inline-block w-8 h-8 rounded-full bg-green-500 cursor-pointer hover:ring-2 hover:ring-green-300 transition-all shadow-sm"
            title="No Change"
          ></span>
        );
      default:
        return (
          <span
            className="inline-block w-8 h-8 rounded-full bg-gray-200 cursor-pointer hover:ring-2 hover:ring-gray-300 transition-all shadow-sm"
            title="Not Set"
          ></span>
        );
    }
  };

  const handleDailyChange = (field, value) => {
    const newData = { ...currentDayData };
    newData[field] = value;
    newData.submittedAt = new Date().toISOString();
    setCurrentDayData(newData);

    const today_date = new Date();
    const year = today_date.getFullYear();
    const month = today_date.getMonth() + 1;
    const day = today_date.getDate();
    const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    setDailyTrackingData((prev) => ({
      ...prev,
      [dateKey]: newData,
    }));
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Custom Part Selection
  const handlePartSelection = (partName, displayName) => {
    setFormData((prev) => ({
      ...prev,
      partNameNo: displayName,
      operationNo: "", // Reset operation when part changes
    }));
    setShowPartDropdown(false);
    setPartSearch("");

    if (partName) {
      fetch(
        `${BASE_URL}/api/master-dropdown/?filter=operations_by_part&part=${encodeURIComponent(
          partName
        )}`
      )
        .then((res) => res.json())
        .then((data) => setOperationList(data))
        .catch((err) => console.error("Error fetching operations:", err));
    } else {
      setOperationList([]);
    }
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!formData.partNameNo || !formData.operationNo) {
      alert("Please select Part Name/Number and Operation No.");
      return;
    }

    setIsSubmitting(true);
    const today_date = new Date();
    const year = today_date.getFullYear();
    const month = today_date.getMonth() + 1;
    const day = today_date.getDate();
    const dateKey = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    const finalDailyTrackingData = {
      ...dailyTrackingData,
      [dateKey]: currentDayData,
    };

    // YEH FUNCTION STRING KO NUMBER MEIN YA KHALI HONE PAR NULL MEIN CONVERT KAREGA
    const parseNumOrNull = (val) => {
      if (val === "" || val === null || val === undefined) return null;
      const parsed = Number(val);
      return isNaN(parsed) ? null : parsed;
    };

    const payload = {
      time: formData.time,
      machine_no: formData.mcNo,
      description: formData.changeDesc,
      nature_of_change: formData.natureOfChange,
      action_taken: formData.actionTaken,
      part_info: formData.partNameNo,
      operation_no: formData.operationNo,
      training_provided: formData.trainingProvided,
      setup_approval: formData.setupApproval.status,

      // YAHAN CONDITION LAGAYI HAI KI JO ACTIVE HO SIRF USI KA DATA JAYE
      retro_qty_checked: activeAction === "retroactive" ? parseNumOrNull(formData.retroactive.qtyChecked) : null,
      retro_entry_qty: activeAction === "retroactive" ? parseNumOrNull(formData.retroactive.entryQty) : null,
      retro_qty_ok: activeAction === "retroactive" ? parseNumOrNull(formData.retroactive.qtyOk) : null,
      retro_rw: activeAction === "retroactive" ? parseNumOrNull(formData.retroactive.rw) : null,
      retro_scrap: activeAction === "retroactive" ? parseNumOrNull(formData.retroactive.scrap) : null,

      cont_qty_checked: activeAction === "containment" ? parseNumOrNull(formData.containmentSuspected.qtyChecked) : null,
      cont_entry_qty: activeAction === "containment" ? parseNumOrNull(formData.containmentSuspected.entryQty) : null,
      cont_qty_ok: activeAction === "containment" ? parseNumOrNull(formData.containmentSuspected.qtyOk) : null,
      cont_rw: activeAction === "containment" ? parseNumOrNull(formData.containmentSuspected.rw) : null,
      cont_scrap: activeAction === "containment" ? parseNumOrNull(formData.containmentSuspected.scrap) : null,

      customer: formData.dispatchDetail.customer,
      dispatch_date: formData.dispatchDetail.date,

      remark: formData.remark,
      prepared_by: preparedBy,

      daily_tracking_data: finalDailyTrackingData,
      submission_date: dateKey,
      submitted_at: new Date().toISOString(),
    };

    setDailyTrackingData(finalDailyTrackingData);

    try {
      const response = await fetch(`${BASE_URL}/api/save-4m-record/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const currentUser = localStorage.getItem("username") || "Unknown User";

        try {
          await axios.post(API_LOG, {
            username: currentUser,
            report_name: "4M Tracking Summary Form", // Yahan hardcode kar diya form ka naam
          });
          console.log("Activity log successfully saved!");
        } catch (logError) {
          console.error("Activity log save karne mein error aayi:", logError);
        }
        const data = await response.json();
        console.log("Backend Response:", data);
        localStorage.setItem(
          "mChangeTrackingData",
          JSON.stringify(finalDailyTrackingData)
        );
        alert("Form submitted successfully to the backend!");
        handleReset();
      } else {
        const errorData = await response.json();
        console.error("Validation Error Details:", errorData);
        alert(
          `Validation Error! Check console for details. ` +
            JSON.stringify(errorData)
        );
      }
    } catch (error) {
      console.error("Error saving to backend:", error);
      alert(`Failed to save data to the backend. Check the console.`);
      localStorage.setItem(
        "mChangeTrackingData",
        JSON.stringify(finalDailyTrackingData)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      time: "",
      mcNo: "",
      changeDesc: "",
      natureOfChange: "Planned",
      actionTaken: "",
      partNameNo: "",
      operationNo: "",
      trainingProvided: "",
      setupApproval: { status: "" },
      retroactive: {
        qtyChecked: "",
        entryQty: "",
        qtyOk: "",
        rw: "",
        scrap: "",
      },
      containmentSuspected: {
        qtyChecked: "",
        entryQty: "",
        qtyOk: "",
        rw: "",
        scrap: "",
      },
      dispatchDetail: { customer: "", date: today },
      remark: "",
    });

    setPreparedBy("");
    setActiveAction(""); 
    setCurrentDayData({
      man: "",
      machine: "",
      material: "",
      method: "",
      submittedAt: null,
    });
    setOperationList([]);
  };

  const handleBack = () => {
    window.location.href = "/production-hub";
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const categories = [
    { id: "man", label: "MAN", icon: <User className="w-5 h-5" /> },
    { id: "machine", label: "MACHINE", icon: <Cpu className="w-5 h-5" /> },
    { id: "material", label: "MATERIAL", icon: <Package className="w-5 h-5" /> },
    { id: "method", label: "METHOD", icon: <BookOpen className="w-5 h-5" /> },
  ];

  const statusOptions = ["OK", "NOT OK", "PENDING", "NA"];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.pageBg,
        padding: "28px 16px",
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div className="max-w-7xl mx-auto mb-4">
        <button onClick={handleBack}>
          {/* <div className="bg-white border border-gray-200 rounded-none p-2 shadow-sm group-hover:shadow-md transition-shadow">
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </div> */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: C.white,
              border: `1.5px solid ${C.redBorder}`,
              color: C.red,
              padding: "8px 8px",
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,.05)",
            }}
          >
            Back to Production Hub
          </span>
        </button>
      </div>

      <div
        style={{
          background: C.white,
          borderRadius: 8,
          border: `1px solid ${C.border}`,
          overflow: "hidden",
          boxShadow: C.shadow,
        }}
      >
        <div
          style={{
            background: C.red,
            padding: "20px 28px",
            borderBottom: `1px solid ${C.redDark}`,
          }}
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <h1 className="text-2xl sm:text-2xl font-bold text-white uppercase tracking-widest">
              4M Change Record Sheet
            </h1>
            <div className="flex items-center sm:items-center">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-none border border-white/30 shadow-lg">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white mr-2" />
                <span className="text-sm sm:text-base font-bold text-white xs:text-red-500 uppercase">
                  {currentDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="w-full lg:w-72 order-1 lg:order-2">
              <div className="bg-white rounded-none border border-gray-200 p-4 sm:p-5 md:p-6 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-3 sm:mb-4 flex items-center text-base sm:text-lg uppercase tracking-wide">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-500" />
                  Legend
                </h3>

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center space-x-3 p-1 sm:p-2">
                    <span className="inline-block w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-red-500"></span>
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-gray-800 uppercase">CHANGE</span>
                      <p className="text-xs text-gray-500 hidden sm:block">Change implemented</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-1 sm:p-2">
                    <span className="inline-block w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-500"></span>
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-gray-800 uppercase">NO CHANGE</span>
                      <p className="text-xs text-gray-500 hidden sm:block">No change from standard</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-1 sm:p-2">
                    <span className="inline-block w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-200"></span>
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-gray-800 uppercase">Not Set</span>
                      <p className="text-xs text-gray-500 hidden sm:block">No status selected</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 order-2 lg:order-1">
              <div className="bg-white rounded-none border border-gray-200 overflow-hidden shadow-sm">
                <div className="bg-gray-50 px-4 sm:px-5 md:px-6 py-3 sm:py-4 border-b border-gray-200">
                  <h3 className="text-sm sm:text-base font-bold text-gray-800 uppercase tracking-wide">
                    4M Status for Today - {getFormattedDate()}
                  </h3>
                </div>

                <div className="p-4 sm:p-5 md:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-none border border-gray-200"
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="text-gray-500 bg-white p-1.5 sm:p-2 rounded-none shadow-sm border border-gray-200">
                            {category.icon}
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-gray-700 uppercase">
                            {category.label}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            const nextValue = getNextStatus(currentDayData[category.id]);
                            handleDailyChange(category.id, nextValue);
                          }}
                          className="focus:outline-none transform hover:scale-110 transition-transform"
                        >
                          {getStatusDot(currentDayData[category.id])}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-gray-200 mt-6 sm:mt-7 md:mt-8 pt-6 sm:pt-7 md:pt-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-5 md:mb-6 uppercase tracking-wide">
              Change Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-4 sm:mb-5 md:mb-6">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleFormChange("time", e.target.value)}
                  className="w-full border border-gray-300 rounded-none px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all bg-white text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Machine No
                </label>
                <input
                  type="text"
                  value={formData.mcNo}
                  onChange={(e) => handleFormChange("mcNo", e.target.value)}
                  className="w-full border border-gray-300 rounded-none px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all bg-white text-slate-700"
                  placeholder="Enter machine number"
                />
              </div>
            </div>

            <div className="mb-4 sm:mb-5 md:mb-6">
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                Change Description
              </label>
              <textarea
                value={formData.changeDesc}
                onChange={(e) => handleFormChange("changeDesc", e.target.value)}
                className="w-full border border-gray-300 rounded-none px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all bg-white text-slate-700"
                rows="3"
                placeholder="Enter change description..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-4 sm:mb-5 md:mb-6">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Nature of Change
                </label>
                <select
                  value={formData.natureOfChange}
                  onChange={(e) =>
                    handleFormChange("natureOfChange", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-none px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all bg-white text-slate-700"
                >
                  <option value="Planned">Planned</option>
                  <option value="Unplanned">Unplanned</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Action Taken
                </label>
                <input
                  type="text"
                  value={formData.actionTaken}
                  onChange={(e) =>
                    handleFormChange("actionTaken", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-none px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all bg-white text-slate-700"
                  placeholder="Enter action taken"
                />
              </div>
            </div>

            {/* CUSTOM SEARCHABLE DROPDOWN FOR PART NAME */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-4 sm:mb-5 md:mb-6">
              <div className="relative">
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Part Name / Number <span className="text-red-500">*</span>
                </label>
                
                {/* Invisible Overlay to close dropdown when clicking outside */}
                {showPartDropdown && (
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowPartDropdown(false)}
                  ></div>
                )}

                {/* Dropdown Trigger Box (Looks exactly like a select) */}
                <div
                  className={`w-full border ${showPartDropdown ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300'} rounded-none px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-white text-slate-700 cursor-pointer flex justify-between items-center transition-all`}
                  onClick={() => setShowPartDropdown(!showPartDropdown)}
                >
                  <span className={formData.partNameNo ? "text-slate-700" : "text-slate-400"}>
                    {formData.partNameNo || "Select Part Name / Number"}
                  </span>
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>

                {/* Dropdown List (Increased max height to 400px) */}
                {showPartDropdown && (
                  <div className="absolute z-50 w-full mt-0 bg-white border border-gray-300 shadow-xl max-h-[400px] flex flex-col">
                    <div className="p-1.5 border-b border-gray-200 bg-gray-50 sticky top-0">
                      {/* FIXED SEARCH INPUT COLOR HERE */}
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-none px-2 py-1.5 text-xs sm:text-sm focus:outline-none focus:border-gray-400 text-slate-800 bg-white placeholder-gray-400"
                        placeholder="Search part..."
                        value={partSearch}
                        onChange={(e) => setPartSearch(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <ul className="overflow-y-auto flex-1 py-1">
                      <li
                        className="px-3 py-1.5 text-xs sm:text-sm text-slate-700 hover:bg-gray-500 hover:text-white cursor-pointer transition-none"
                        onClick={() => handlePartSelection("", "")}
                      >
                        Select Part Name / Number
                      </li>
                      {partsList
                        .filter((part) => {
                          const fullName = `${part.part_name} ${part.part_no ? `(${part.part_no})` : ""}`.toLowerCase();
                          return fullName.includes(partSearch.toLowerCase());
                        })
                        .map((part, index) => {
                          const displayName = `${part.part_name} ${part.part_no ? `(${part.part_no})` : ""}`;
                          return (
                            <li
                              key={index}
                              className="px-3 py-1.5 text-xs sm:text-sm text-slate-700 hover:bg-gray-500 hover:text-white cursor-pointer transition-none"
                              onClick={() => handlePartSelection(part.part_name, displayName)}
                            >
                              {displayName}
                            </li>
                          );
                        })}
                      {partsList.filter((part) => `${part.part_name} ${part.part_no ? `(${part.part_no})` : ""}`.toLowerCase().includes(partSearch.toLowerCase())).length === 0 && (
                        <li className="px-3 py-2 text-sm text-gray-500 text-center italic">No parts matched</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Operation No <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.operationNo}
                  onChange={(e) =>
                    handleFormChange("operationNo", e.target.value)
                  }
                  disabled={!formData.partNameNo}
                  className="w-full border border-gray-300 rounded-none px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all bg-white text-slate-700 disabled:bg-slate-50 disabled:cursor-not-allowed"
                >
                  <option value="" className="text-slate-400">
                    Select Operation
                  </option>
                  {operationList.map((op, index) => (
                    <option key={index} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-7 md:mb-8">
              <div className="bg-gray-50 p-3 sm:p-4 rounded-none border border-gray-200">
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wide">
                  Setup Approval
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm font-bold text-gray-500 uppercase">
                    Date: {getFormattedDate()}
                  </span>
                  <select
                    value={formData.setupApproval.status}
                    onChange={(e) =>
                      handleNestedChange("setupApproval", "status", e.target.value)
                    }
                    className="w-full sm:flex-1 border border-gray-300 rounded-none px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-white text-slate-700"
                  >
                    <option value="">Not Set</option>
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 p-3 sm:p-4 rounded-none border border-gray-200">
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2 uppercase tracking-wide">
                  Training Provided
                </label>
                <select
                  value={formData.trainingProvided}
                  onChange={(e) => handleFormChange("trainingProvided", e.target.value)}
                  className="w-full border border-gray-300 rounded-none px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-white text-slate-700"
                >
                  <option value="">Not Set</option>
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-4 sm:mb-5 md:mb-6">
              {/* Retroactive Block */}
              <div className={`p-3 sm:p-4 rounded-none border border-gray-200 shadow-sm transition-all ${activeAction === 'retroactive' ? 'bg-white ring-1 ring-red-500' : 'bg-gray-50 opacity-60'}`}>
                <div className="flex items-center gap-3 mb-2 sm:mb-3 pb-1 sm:pb-2 border-b-2 border-gray-200">
                  <input 
                    type="radio" 
                    id="radio-retro"
                    name="mutuallyExclusiveAction" 
                    checked={activeAction === "retroactive"} 
                    onChange={() => setActiveAction("retroactive")}
                    className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 cursor-pointer"
                  />
                  <label htmlFor="radio-retro" className="font-bold text-gray-800 text-sm sm:text-base uppercase tracking-wide cursor-pointer w-full">
                    Retroactive
                  </label>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Qty Checked</label>
                    <input
                      type="text"
                      disabled={activeAction !== "retroactive"}
                      value={formData.retroactive.qtyChecked}
                      onChange={(e) => handleNestedChange("retroactive", "qtyChecked", e.target.value)}
                      className="w-full border border-gray-300 rounded-none px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-white text-slate-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter quantity"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Entry Quantity</label>
                    <input
                      type="text"
                      disabled={activeAction !== "retroactive"}
                      value={formData.retroactive.entryQty}
                      onChange={(e) => handleNestedChange("retroactive", "entryQty", e.target.value)}
                      className="w-full border border-gray-300 rounded-none px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-white text-slate-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter quantity"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Qty OK</label>
                    <input
                      type="text"
                      disabled={activeAction !== "retroactive"}
                      value={formData.retroactive.qtyOk}
                      onChange={(e) => handleNestedChange("retroactive", "qtyOk", e.target.value)}
                      className="w-full border border-gray-300 rounded-none px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-white text-slate-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter amount (e.g. 1000)"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">R/W</label>
                    <input
                      type="text"
                      disabled={activeAction !== "retroactive"}
                      value={formData.retroactive.rw}
                      onChange={(e) => handleNestedChange("retroactive", "rw", e.target.value)}
                      className="w-full border border-gray-300 rounded-none px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-white text-slate-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter amount"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Scrap</label>
                    <input
                      type="text"
                      disabled={activeAction !== "retroactive"}
                      value={formData.retroactive.scrap}
                      onChange={(e) => handleNestedChange("retroactive", "scrap", e.target.value)}
                      className="w-full border border-gray-300 rounded-none px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-white text-slate-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
              </div>

              {/* Containment Suspected Block */}
              <div className={`p-3 sm:p-4 rounded-none border border-gray-200 shadow-sm transition-all ${activeAction === 'containment' ? 'bg-white ring-1 ring-red-500' : 'bg-gray-50 opacity-60'}`}>
                <div className="flex items-center gap-3 mb-2 sm:mb-3 pb-1 sm:pb-2 border-b-2 border-gray-200">
                  <input 
                    type="radio" 
                    id="radio-contain"
                    name="mutuallyExclusiveAction" 
                    checked={activeAction === "containment"} 
                    onChange={() => setActiveAction("containment")}
                    className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 cursor-pointer"
                  />
                  <label htmlFor="radio-contain" className="font-bold text-gray-800 text-sm sm:text-base uppercase tracking-wide cursor-pointer w-full">
                    Containment Suspected
                  </label>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Qty Checked</label>
                    <input
                      type="text"
                      disabled={activeAction !== "containment"}
                      value={formData.containmentSuspected.qtyChecked}
                      onChange={(e) => handleNestedChange("containmentSuspected", "qtyChecked", e.target.value)}
                      className="w-full border border-gray-300 rounded-none px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-white text-slate-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter quantity"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Entry Quantity</label>
                    <input
                      type="text"
                      disabled={activeAction !== "containment"}
                      value={formData.containmentSuspected.entryQty}
                      onChange={(e) => handleNestedChange("containmentSuspected", "entryQty", e.target.value)}
                      className="w-full border border-gray-300 rounded-none px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-white text-slate-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter quantity"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Qty OK</label>
                    <input
                      type="text"
                      disabled={activeAction !== "containment"}
                      value={formData.containmentSuspected.qtyOk}
                      onChange={(e) => handleNestedChange("containmentSuspected", "qtyOk", e.target.value)}
                      className="w-full border border-gray-300 rounded-none px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-white text-slate-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter amount (e.g. 1000)"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">R/W</label>
                    <input
                      type="text"
                      disabled={activeAction !== "containment"}
                      value={formData.containmentSuspected.rw}
                      onChange={(e) => handleNestedChange("containmentSuspected", "rw", e.target.value)}
                      className="w-full border border-gray-300 rounded-none px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-white text-slate-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter amount"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Scrap</label>
                    <input
                      type="text"
                      disabled={activeAction !== "containment"}
                      value={formData.containmentSuspected.scrap}
                      onChange={(e) => handleNestedChange("containmentSuspected", "scrap", e.target.value)}
                      className="w-full border border-gray-300 rounded-none px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-white text-slate-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
              </div>

              {/* Dispatch Detail */}
              <div className="bg-white p-3 sm:p-4 rounded-none border border-gray-200 shadow-sm">
                <h4 className="font-bold text-gray-800 mb-2 sm:mb-3 pb-1 sm:pb-2 border-b-2 border-gray-200 text-sm sm:text-base uppercase tracking-wide">
                  Dispatch Detail
                </h4>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Customer</label>
                    <select
                      value={formData.dispatchDetail.customer}
                      onChange={(e) => handleNestedChange("dispatchDetail", "customer", e.target.value)}
                      className="w-full border border-gray-300 rounded-none px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-white text-slate-700"
                    >
                      <option value="">Select Customer</option>
                      {customerList.map((cust, idx) => {
                        let customerName = cust;
                        if (typeof cust === "string") {
                          customerName = cust;
                        } else if (Array.isArray(cust)) {
                          customerName = cust[0];
                        } else if (cust && typeof cust === "object") {
                          customerName = cust.customer_name || cust.name || "";
                        }
                        
                        return (
                          <option key={idx} value={customerName}>
                            {customerName}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Date</label>
                    <input
                      type="date"
                      value={formData.dispatchDetail.date}
                      onChange={(e) => handleNestedChange("dispatchDetail", "date", e.target.value)}
                      className="w-full border border-gray-300 rounded-none px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-white text-slate-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 sm:mt-5 md:mt-6">
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                Remark
              </label>
              <textarea
                value={formData.remark}
                onChange={(e) => handleFormChange("remark", e.target.value)}
                className="w-full border border-gray-300 rounded-none px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all bg-white text-slate-700"
                rows="3"
                placeholder="Enter remarks..."
              />
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
                  className="px-3 py-2 border border-gray-300 rounded-none focus:outline-none focus:ring-1 focus:ring-red-500 text-sm w-full sm:w-64 bg-white text-slate-800"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleReset}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 rounded-none text-xs sm:text-sm font-bold tracking-widest text-gray-700 bg-white hover:bg-gray-50 transition-all uppercase disabled:opacity-50"
                >
                  Reset Data
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 bg-[#e03131] text-white rounded-none text-xs sm:text-sm font-bold tracking-widest uppercase hover:bg-[#c92a2a] transition-all shadow-sm disabled:opacity-70"
                >
                  {isSubmitting ? "Saving..." : "Save Data"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MChangeTrackForm;