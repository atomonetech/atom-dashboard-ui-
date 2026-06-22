import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  User,
  Cpu,
  Package,
  BookOpen,
  ArrowLeft,
  Check,
  Loader2 // 🔥 IMPORT Loader2 for loading state
} from "lucide-react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const API_LOG = `${
  process.env.REACT_APP_API_URL || "http://localhost:8000"
}/api/log-report/`;

const C = {
  pageBg: "#f1f5f9", 
  white: "#ffffff",
  red: "#dc2626", 
  redLight: "#fef2f2",
  redBorder: "#fee2e2",
  redDark: "#991b1b",
  border: "#e2e8f0",
  borderFoc: "#dc2626",
  text: "#0f172a",
  textMid: "#475569",
  textLight: "#94a3b8",
  inputBg: "#ffffff",
  shadow: "0 10px 15px -3px rgba(15, 23, 42, 0.05), 0 4px 6px -4px rgba(15, 23, 42, 0.05)",
};

const MChangeTrackForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];
  const [headerDate, setHeaderDate] = useState(today);

  const [formData, setFormData] = useState({
    time: "",
    mcNo: "",
    changeDesc: "",
    natureOfChange: "Planned",
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
      invoiceNo: "", 
    },
    remark: "",
  });

  const [dailyTrackingData, setDailyTrackingData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApproving, setIsApproving] = useState(false); // 🔥 STATE FOR APPROVE LOADING
  const [preparedBy, setPreparedBy] = useState("");
  const [activeAction, setActiveAction] = useState(""); 

  const [currentDayData, setCurrentDayData] = useState({
    man: "NOT_SET",
    machine: "NOT_SET",
    material: "NOT_SET",
    method: "NOT_SET",
    submittedAt: null,
  });

  const [partsList, setPartsList] = useState([]);
  const [operationList, setOperationList] = useState([]);
  const [customerList, setCustomerList] = useState([]);

  const [showPartDropdown, setShowPartDropdown] = useState(false);
  const [partSearch, setPartSearch] = useState("");

  // 🔥 FETCH RECORDS (VIEW MODE)
  useEffect(() => {
    if (id) {
      const fetchReportData = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/api/get-single-production-report/four-m-record/${id}/`);
          if (response.data.success) {
            const d = response.data.data;
            
            setFormData({
              time: d.time ? d.time.substring(0, 5) : "",
              mcNo: d.machineNo || d.machine_no || "",
              changeDesc: d.changeInfo?.description || d.description || "",
              natureOfChange: d.natureOfChange || d.nature_of_change || "Planned",
              actionTaken: d.actionTaken || d.action_taken || "",
              partNameNo: d.partInfo || d.part_info || "",
              operationNo: d.operationNo || d.operation_no || "",
              trainingProvided: d.approvalTraining?.trainingProvided || d.training_provided || "",
              setupApproval: { status: d.approvalTraining?.setupApproval || d.setup_approval || "" },
              retroactive: {
                qtyChecked: d.retro_qty_checked ?? "",
                entryQty: d.retro_entry_qty ?? "",
                qtyOk: d.retro_qty_ok ?? "",
                rw: d.retro_rw ?? "",
                scrap: d.retro_scrap ?? "",
              },
              containmentSuspected: {
                qtyChecked: d.cont_qty_checked ?? "",
                entryQty: d.cont_entry_qty ?? "",
                qtyOk: d.cont_qty_ok ?? "",
                rw: d.cont_rw ?? "",
                scrap: d.cont_scrap ?? "",
              },
              dispatchDetail: {
                customer: d.customer || d.dispatchDetail?.customer || "",
                date: d.dispatch_date || d.dispatchDetail?.date || today,
                invoiceNo: d.invoice_no || d.dispatchDetail?.invoiceNo || "",
              },
              remark: d.remark || d.footer?.remark || "",
            });
            
            setPreparedBy(d.submitted_by || d.prepared_by || "");
            
            if (d.submission_date || d.created_at) {
              setHeaderDate(d.submission_date || d.created_at.split('T')[0]);
            }

            if (d.retro_qty_checked !== null || d.retro_qty_ok !== null || d.retro_entry_qty !== null) {
              setActiveAction("retroactive");
            } else if (d.cont_qty_checked !== null || d.cont_qty_ok !== null || d.cont_entry_qty !== null) {
              setActiveAction("containment");
            } else {
              setActiveAction("");
            }

            let trackingObj = d.daily_tracking_data;
            if (trackingObj) {
              if (typeof trackingObj === 'string') trackingObj = JSON.parse(trackingObj);
              setDailyTrackingData(trackingObj);
              const keys = Object.keys(trackingObj);
              if (keys.length > 0) {
                setCurrentDayData(trackingObj[keys[keys.length - 1]]);
              }
            } else {
              setCurrentDayData({
                man: d.status_man || "NOT_SET",
                machine: d.status_machine || "NOT_SET",
                material: d.status_material || "NOT_SET",
                method: d.status_method || "NOT_SET",
                submittedAt: null,
              });
            }

            if (d.part_info) {
              const basePartName = d.part_info.split(' (')[0];
              axios.get(`${BASE_URL}/api/master-dropdown/?filter=operations_by_part&part=${encodeURIComponent(basePartName)}`)
                .then(res => setOperationList(res.data))
                .catch(err => console.error(err));
            }
          }
        } catch (error) {
          console.error("Error fetching report data:", error);
        }
      };
      fetchReportData();
    }
  }, [id, today]);

  // INITIAL MASTER DATA LOADING
  useEffect(() => {
    if (!id) {
      localStorage.removeItem("mChangeTrackingData");
      setDailyTrackingData({});
      setCurrentDayData({
        man: "NOT_SET",
        machine: "NOT_SET",
        material: "NOT_SET",
        method: "NOT_SET",
        submittedAt: null,
      });
    }

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
  }, [id]);

  // ON CALENDAR DATE SHIFT ONLY
  useEffect(() => {
    if (!id) {
        if (dailyTrackingData && dailyTrackingData[headerDate]) {
          setCurrentDayData(dailyTrackingData[headerDate]);
        } else {
          setCurrentDayData({
            man: "NOT_SET",
            machine: "NOT_SET",
            material: "NOT_SET",
            method: "NOT_SET",
            submittedAt: null,
          });
        }
    }
  }, [headerDate, id, dailyTrackingData]);

  const getNextStatus = (currentStatus) => {
    if (!currentStatus || currentStatus === "NOT_SET" || currentStatus === "") return "CHANGE";
    if (currentStatus === "CHANGE") return "OK"; 
    if (currentStatus === "OK") return "CHANGE";
    return "NOT_SET"; 
  };

  const getStatusDot = (status) => {
    const disableClass = id ? "cursor-not-allowed opacity-80" : "cursor-pointer hover:scale-110";
    if (status === "CHANGE") {
      return <span className={`inline-block w-7 h-7 rounded-full bg-rose-500 transition-all shadow-sm ${disableClass}`} title="Change Implemented"></span>;
    }
    if (status === "OK" || status === "NO_CHANGE" || status === "NO CHANGE") {
      return <span className={`inline-block w-7 h-7 rounded-full bg-emerald-500 transition-all shadow-sm ${disableClass}`} title="No Change"></span>;
    }
    return <span className={`inline-block w-7 h-7 rounded-full bg-slate-200 transition-all shadow-sm ${disableClass}`} title="Not Set"></span>;
  };

  const handleDailyChange = (field, value) => {
    if (id) return; 
    const newData = { ...currentDayData };
    newData[field] = value;
    newData.submittedAt = new Date().toISOString();
    
    setCurrentDayData(newData);

    setDailyTrackingData((prev) => ({
      ...prev,
      [headerDate]: newData,
    }));
  };

  const handleFormChange = (field, value) => {
    if (id) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePartSelection = (partName, displayName) => {
    if (id) return;
    setFormData((prev) => ({
      ...prev,
      partNameNo: displayName,
      operationNo: "",
    }));
    setShowPartDropdown(false);
    setPartSearch("");

    if (partName) {
      fetch(`${BASE_URL}/api/master-dropdown/?filter=operations_by_part&part=${encodeURIComponent(partName)}`)
        .then((res) => res.json())
        .then((data) => setOperationList(data))
        .catch((err) => console.error("Error fetching operations:", err));
    } else {
      setOperationList([]);
    }
  };

  const handleNestedChange = (section, field, value) => {
    if (id) return;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // 🔥 NEW: APPROVE FUNCTION FOR VIEW MODE
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
            alert("✅ Report Approved Successfully!");
            navigate(-1); // Automatically go back after approval
        }
    } catch (error) {
        console.error("Error approving report:", error);
        if (error.response) {
            alert(`❌ Backend Error: ${error.response.data.error || "Failed to process"}`);
        } else {
            alert("❌ Network Error: Could not connect to the server.");
        }
    } finally {
        setIsApproving(false);
    }
  };

  const handleSubmit = async () => {
    if (id) return;

    if (!formData.partNameNo || !formData.operationNo) {
      alert("Please select Part Name/Number and Operation No.");
      return;
    }

    setIsSubmitting(true);

    const finalized4MData = {
      man: !currentDayData.man || currentDayData.man === "" ? "NOT_SET" : currentDayData.man,
      machine: !currentDayData.machine || currentDayData.machine === "" ? "NOT_SET" : currentDayData.machine,
      material: !currentDayData.material || currentDayData.material === "" ? "NOT_SET" : currentDayData.material,
      method: !currentDayData.method || currentDayData.method === "" ? "NOT_SET" : currentDayData.method,
      submittedAt: currentDayData.submittedAt || new Date().toISOString()
    };

    const finalDailyTrackingData = {
      ...dailyTrackingData,
      [headerDate]: finalized4MData,
    };

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

      status_man: finalized4MData.man,
      status_machine: finalized4MData.machine,
      status_material: finalized4MData.material,
      status_method: finalized4MData.method,

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
      invoice_no: formData.dispatchDetail.invoiceNo,

      remark: formData.remark,
      prepared_by: preparedBy,

      daily_tracking_data: finalDailyTrackingData,
      submission_date: headerDate,
      submitted_at: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${BASE_URL}/api/save-4m-record/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const currentUser = localStorage.getItem("username") || "Unknown User";
        try {
          const data = await response.json();
          await axios.post(API_LOG, {
            username: currentUser,
            report_name: "4M Tracking Summary Form",
            record_id: data.record_id
          });
        } catch (logError) {
          console.error("Activity log error:", logError);
        }
        alert("Form submitted successfully to the backend!");
        handleReset();
      } else {
        const errorData = await response.json();
        alert(`Validation Error! Check console for details. ` + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Error saving to backend:", error);
      alert(`Failed to save data to the backend. Check the console.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (id) return;
    setFormData({
      time: "", mcNo: "", changeDesc: "", natureOfChange: "Planned", actionTaken: "",
      partNameNo: "", operationNo: "", trainingProvided: "", setupApproval: { status: "" },
      retroactive: { qtyChecked: "", entryQty: "", qtyOk: "", rw: "", scrap: "" },
      containmentSuspected: { qtyChecked: "", entryQty: "", qtyOk: "", rw: "", scrap: "" },
      dispatchDetail: { customer: "", date: today, invoiceNo: "" }, remark: "",
    });
    setPreparedBy("");
    setActiveAction(""); 
    setHeaderDate(today);
    setCurrentDayData({ man: "NOT_SET", machine: "NOT_SET", material: "NOT_SET", method: "NOT_SET", submittedAt: null });
    setOperationList([]);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getFormattedDate = () => {
    return new Date(headerDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const categories = [
    { id: "man", label: "MAN", icon: <User className="w-4 h-4" /> },
    { id: "machine", label: "MACHINE", icon: <Cpu className="w-4 h-4" /> },
    { id: "material", label: "MATERIAL", icon: <Package className="w-4 h-4" /> },
    { id: "method", label: "METHOD", icon: <BookOpen className="w-4 h-4" /> },
  ];

  const statusOptions = ["OK", "NOT OK", "PENDING", "NA"];

  const inputStyle = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all bg-white text-slate-800 disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed";
  const labelStyle = "block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider";

  return (
    <>
      <div style={{ minHeight: "100vh", background: C.pageBg, padding: "32px 16px", fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div className="max-w-5xl mx-auto">
          
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={handleBack}
              className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
            >
              <ArrowLeft size={14}/> Back
            </button>
          </div>

          <div style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: C.shadow }}>
            
            <div style={{ background: C.red, padding: "24px 32px" }}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">
                  {id ? "4M Change Record Sheet (REVIEW)" : "4M Change Record Sheet"}
                </h1>
                <div className="flex items-center">
                  <div className="inline-flex items-center bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 shadow-sm transition-all focus-within:ring-2 focus-within:ring-white/40">
                    <Calendar className="w-4 h-4 text-white mr-2" />
                    <input 
                      type="date"
                      value={headerDate}
                      disabled={!!id}
                      onChange={(e) => setHeaderDate(e.target.value)}
                      className="bg-transparent text-sm font-bold text-white uppercase tracking-wide focus:outline-none cursor-pointer [color-scheme:dark] disabled:opacity-80 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-10">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-center gap-3">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Status Reference Legend
                  </h3>
                  <div className="flex items-center space-x-3">
                    <span className="inline-block w-4 h-4 rounded-full bg-emerald-500 shadow-sm"></span>
                    <div>
                      <span className="text-xs font-bold text-slate-700 uppercase">NO CHANGE</span>
                      <p className="text-[11px] text-slate-400">Standard behavior verified</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="inline-block w-4 h-4 rounded-full bg-rose-500 shadow-sm"></span>
                    <div>
                      <span className="text-xs font-bold text-slate-700 uppercase">CHANGE DETECTED</span>
                      <p className="text-[11px] text-slate-400">Modification noted</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="inline-block w-4 h-4 rounded-full bg-slate-200 shadow-sm"></span>
                    <div>
                      <span className="text-xs font-bold text-slate-700 uppercase">Not Set</span>
                      <p className="text-[11px] text-slate-400">No status checked</p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      4M Live Operational Monitor - {getFormattedDate()}
                    </h3>
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center justify-between p-3 bg-slate-50/60 rounded-xl border border-slate-100">
                          <div className="flex items-center space-x-2.5">
                            <div className="text-slate-500 bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                              {category.icon}
                            </div>
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                              {category.label}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (id) return;
                              const currentVal = currentDayData[category.id];
                              const nextValue = getNextStatus(currentVal);
                              handleDailyChange(category.id, nextValue);
                            }}
                            className="focus:outline-none transition-transform duration-200"
                          >
                            {getStatusDot(currentDayData[category.id])}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              <div className="border-t border-slate-100 pt-8">
                <h2 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-red-600 rounded-sm"></span> Change Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className={labelStyle}>Time</label>
                    <input
                      type="time"
                      value={formData.time}
                      readOnly={!!id}
                      onChange={(e) => handleFormChange("time", e.target.value)}
                      className={inputStyle}
                    />
                  </div>

                  <div>
                    <label className={labelStyle}>Machine No</label>
                    <input
                      type="text"
                      value={formData.mcNo}
                      readOnly={!!id}
                      onChange={(e) => handleFormChange("mcNo", e.target.value)}
                      className={inputStyle}
                      placeholder="Enter machine number"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className={labelStyle}>Change Description</label>
                  <textarea
                    value={formData.changeDesc}
                    readOnly={!!id}
                    onChange={(e) => handleFormChange("changeDesc", e.target.value)}
                    className={inputStyle}
                    rows="3"
                    placeholder="Provide descriptions of modifications..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className={labelStyle}>Nature of Change</label>
                    <select
                      value={formData.natureOfChange}
                      disabled={!!id}
                      onChange={(e) => handleFormChange("natureOfChange", e.target.value)}
                      className={inputStyle}
                    >
                      <option value="Planned">Planned</option>
                      <option value="Unplanned">Unplanned</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelStyle}>Action Taken</label>
                    <input
                      type="text"
                      value={formData.actionTaken}
                      readOnly={!!id}
                      onChange={(e) => handleFormChange("actionTaken", e.target.value)}
                      className={inputStyle}
                      placeholder="Enter details of action standard"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                  <div className="relative">
                    <label className={labelStyle}>
                      Part Name / Number <span className="text-red-500">*</span>
                    </label>
                    
                    {showPartDropdown && !id && (
                      <div className="fixed inset-0 z-40" onClick={() => setShowPartDropdown(false)}></div>
                    )}

                    <div
                      className={`w-full border ${showPartDropdown ? 'border-red-500 ring-2 ring-red-500/20' : 'border-slate-200'} rounded-lg px-3 py-2 text-sm ${id ? 'bg-slate-50 cursor-not-allowed text-slate-500' : 'bg-white cursor-pointer'} text-slate-800 flex justify-between items-center transition-all`}
                      onClick={() => { if (!id) setShowPartDropdown(!showPartDropdown) }}
                    >
                      <span className={formData.partNameNo ? (id ? "text-slate-500" : "text-slate-800") : "text-slate-400"}>
                        {formData.partNameNo || "Select Part Name / Number"}
                      </span>
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>

                    {showPartDropdown && !id && (
                      <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-lg shadow-xl max-h-[320px] flex flex-col overflow-hidden">
                        <div className="p-2 border-b border-slate-100 bg-slate-50 sticky top-0">
                          <input
                            type="text"
                            className="w-full border border-slate-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-slate-400 text-slate-800 bg-white placeholder-slate-400"
                            placeholder="Search available database..."
                            value={partSearch}
                            onChange={(e) => setPartSearch(e.target.value)}
                            autoFocus
                          />
                        </div>
                        <ul className="overflow-y-auto flex-1 py-1">
                          <li
                            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 cursor-pointer"
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
                                  className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                                  onClick={() => handlePartSelection(part.part_name, displayName)}
                                >
                                  {displayName}
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className={labelStyle}>
                      Operation No <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.operationNo}
                      disabled={!!id || !formData.partNameNo}
                      onChange={(e) => handleFormChange("operationNo", e.target.value)}
                      className={inputStyle}
                    >
                      <option value="" className="text-slate-400">Select Operation</option>
                      {operationList.map((op, index) => (
                        <option key={index} value={op}>{op}</option>
                      ))}
                      {id && formData.operationNo && !operationList.includes(formData.operationNo) && (
                        <option value={formData.operationNo}>{formData.operationNo}</option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-8">
                  <h2 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-red-600 rounded-sm"></span> Validation Status Workflow
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    <div>
                      <label className={labelStyle}>Setup Approval Status</label>
                      <select
                        value={formData.setupApproval.status}
                        disabled={!!id}
                        onChange={(e) => handleNestedChange("setupApproval", "status", e.target.value)}
                        className={inputStyle}
                      >
                        <option value="">Not Set</option>
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelStyle}>Training Provided</label>
                      <select
                        value={formData.trainingProvided}
                        disabled={!!id}
                        onChange={(e) => handleFormChange("trainingProvided", e.target.value)}
                        className={inputStyle}
                      >
                        <option value="">Not Set</option>
                        {statusOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                    
                    <div className={`p-5 rounded-xl border transition-all duration-200 ${activeAction === 'retroactive' ? 'bg-white border-red-500 ring-4 ring-red-500/10 shadow-sm' : 'bg-slate-50/60 border-slate-100 opacity-60'}`}>
                      <div className="flex items-center gap-2.5 mb-4 pb-2 border-b border-slate-100">
                        <input 
                          type="radio" 
                          id="radio-retro"
                          name="mutuallyExclusiveAction" 
                          checked={activeAction === "retroactive"} 
                          disabled={!!id}
                          onChange={() => setActiveAction("retroactive")}
                          className="w-4 h-4 text-red-600 focus:ring-red-500 border-slate-300 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <label htmlFor="radio-retro" className={`font-bold text-xs uppercase tracking-wider w-full ${id ? 'text-slate-500' : 'text-slate-800 cursor-pointer'}`}>
                          Retroactive Actions
                        </label>
                      </div>
                      <div className="space-y-3">
                        {[
                          { label: "Qty Checked", key: "qtyChecked" },
                          { label: "Qty OK", key: "qtyOk" },
                          { label: "R/W", key: "rw" },
                          { label: "Scrap", key: "scrap" },
                        ].map((f) => (
                          <div key={f.key}>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">{f.label}</label>
                            <input
                              type="text"
                              disabled={activeAction !== "retroactive" || !!id}
                              value={formData.retroactive[f.key]}
                              onChange={(e) => handleNestedChange("retroactive", f.key, e.target.value)}
                              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 bg-white text-slate-800 disabled:bg-slate-100/50 disabled:cursor-not-allowed disabled:text-slate-500"
                              placeholder="Fill quantity"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`p-5 rounded-xl border transition-all duration-200 ${activeAction === 'containment' ? 'bg-white border-red-500 ring-4 ring-red-500/10 shadow-sm' : 'bg-slate-50/60 border-slate-100 opacity-60'}`}>
                      <div className="flex items-center gap-2.5 mb-4 pb-2 border-b border-slate-100">
                        <input 
                          type="radio" 
                          id="radio-contain"
                          name="mutuallyExclusiveAction" 
                          checked={activeAction === "containment"} 
                          disabled={!!id}
                          onChange={() => setActiveAction("containment")}
                          className="w-4 h-4 text-red-600 focus:ring-red-500 border-slate-300 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <label htmlFor="radio-contain" className={`font-bold text-xs uppercase tracking-wider w-full ${id ? 'text-slate-500' : 'text-slate-800 cursor-pointer'}`}>
                          Containment Suspected
                        </label>
                      </div>
                      <div className="space-y-3">
                        {[
                          { label: "Qty Checked", key: "qtyChecked" },
                          { label: "Qty OK", key: "qtyOk" },
                          { label: "R/W", key: "rw" },
                          { label: "Scrap", key: "scrap" },
                        ].map((f) => (
                          <div key={f.key}>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">{f.label}</label>
                            <input
                              type="text"
                              disabled={activeAction !== "containment" || !!id}
                              value={formData.containmentSuspected[f.key]}
                              onChange={(e) => handleNestedChange("containmentSuspected", f.key, e.target.value)}
                              className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 bg-white text-slate-800 disabled:bg-slate-100/50 disabled:cursor-not-allowed disabled:text-slate-500"
                              placeholder="Fill quantity"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-start">
                      <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                        Dispatch Logistics
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Customer</label>
                          <select
                            value={formData.dispatchDetail.customer}
                            disabled={!!id}
                            onChange={(e) => handleNestedChange("dispatchDetail", "customer", e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 bg-white text-slate-800 disabled:bg-slate-100/50 disabled:text-slate-500"
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
                            {id && formData.dispatchDetail.customer && !customerList.includes(formData.dispatchDetail.customer) && (
                              <option value={formData.dispatchDetail.customer}>{formData.dispatchDetail.customer}</option>
                            )}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Invoice No</label>
                          <input
                            type="text"
                            disabled={!!id}
                            value={formData.dispatchDetail.invoiceNo}
                            onChange={(e) => handleNestedChange("dispatchDetail", "invoiceNo", e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 bg-white text-slate-800 disabled:bg-slate-100/50 disabled:text-slate-500"
                            placeholder="e.g. INV-2026-001"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Date</label>
                          <input
                            type="date"
                            disabled={!!id}
                            value={formData.dispatchDetail.date}
                            onChange={(e) => handleNestedChange("dispatchDetail", "date", e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 bg-white text-slate-800 disabled:bg-slate-100/50 disabled:text-slate-500"
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="mt-5">
                    <label className={labelStyle}>Remark</label>
                    <textarea
                      value={formData.remark}
                      readOnly={!!id}
                      onChange={(e) => handleFormChange("remark", e.target.value)}
                      className={inputStyle}
                      rows="3"
                      placeholder="Add any additional organizational remarks..."
                    />
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">
                        Prepared By
                      </label>
                      <input
                        type="text"
                        value={preparedBy}
                        readOnly={!!id}
                        onChange={(e) => setPreparedBy(e.target.value)}
                        placeholder="Enter inspector identity"
                        className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 text-sm w-full sm:w-64 bg-white text-slate-800 disabled:bg-slate-50 disabled:text-slate-500"
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      {id ? (
                        <button
                          type="button"
                          disabled={isApproving}
                          onClick={handleApprove}
                          className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {isApproving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                          {isApproving ? "APPROVING..." : "APPROVE REPORT"}
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={handleReset}
                            disabled={isSubmitting}
                            className="w-full sm:w-auto px-5 py-3 border border-slate-200 rounded-lg text-xs font-bold tracking-wider text-slate-600 bg-white hover:bg-slate-50 transition-all uppercase disabled:opacity-50 cursor-pointer"
                          >
                            Reset Data
                          </button>
                          <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-lg text-xs font-bold tracking-wider uppercase hover:bg-red-700 transition-all shadow-sm disabled:opacity-70 cursor-pointer"
                          >
                            {isSubmitting ? "Saving..." : "Save Data"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MChangeTrackForm;