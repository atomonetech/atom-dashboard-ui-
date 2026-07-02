import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // 🔥 IMPORT useParams
import axios from "axios";
import { useReadOnlyMode } from "../../../../../hooks/useReadOnlyMode";
import {
  ArrowLeft,
  Calendar,
  ClipboardList,
  Plus,
  Trash2,
  RotateCcw,
  Send,
  Loader2,
  Monitor,
  User,
  Settings,
  Package,
  Layers,
  Hash,
  Check, // 🔥 Import Check for Approve button
  X,
  MessageSquare,
} from "lucide-react";

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
  green: "#16a34a", // Add green color for button
  greenDark: "#15803d",
};

const EMPTY_ROW = {
  machineNo: "",
  operatorName: "",
  man: "",
  machine: "",
  material: "",
  method: "",
};

const FourMDisplayBoard = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // 🔥 GET ID FROM URL
  const isReadOnly = useReadOnlyMode();

  const [formDate, setFormDate] = useState("");
  const [preparedBy, setPreparedBy] = useState("");

  useEffect(() => {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();
    setFormDate(`${day}.${month}.${year}`);
  }, []);

  const [rows, setRows] = useState(
    Array.from({ length: 3 }, (_, i) => ({ id: i + 1, ...EMPTY_ROW })),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState("Pending");
  const [reviewRemark, setReviewRemark] = useState("");

  // 🔥 FETCH REPORT DATA IF ID EXISTS (VIEW/APPROVE MODE)
  useEffect(() => {
    if (id) {
      const fetchReportData = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(`${BASE_URL}/api/get-single-production-report/four-m-display/${id}/`);
          
          if (response.data.success) {
            const data = response.data.data;
            
            // This API returns a single record based on ID. We will display it as the only row.
            setRows([
              {
                id: 1,
                machineNo: data.machine_no || "",
                operatorName: data.operator_name || "",
                man: data.man || "",
                machine: data.machine || "",
                material: data.material || "",
                method: data.method || "",
              }
            ]);
            
            setPreparedBy(data.submitted_by || "");
            if (data.approval_status) {
              setApprovalStatus(data.approval_status);
            }
            if (data.review_remarks || data.remarks) {
              setReviewRemark(data.review_remarks || data.remarks || "");
            }
          }
        } catch (error) {
          console.error("Error fetching report data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchReportData();
    }
  }, [id]);

  const handleAddRow = () => {
    if (id) return; // Disable in view mode
    const nextId = rows.length > 0 ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
    setRows((prev) => [...prev, { id: nextId, ...EMPTY_ROW }]);
  };

  const handleDeleteRow = (rowId) => {
    if (id) return; // Disable in view mode
    if (rows.length === 1) return;
    setRows((prev) => prev.filter((r) => r.id !== rowId));
  };

  const handleChange = (rowId, field, value) => {
    if (id) return; // Disable in view mode
    setRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)),
    );
  };

  const handleReset = () => {
    if (id) return; // Disable in view mode
    setRows(Array.from({ length: 3 }, (_, i) => ({ id: i + 1, ...EMPTY_ROW })));
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
        remark: reviewRemark,
        remarks: reviewRemark,
      });
      if (response.status === 200) {
        alert(response.data.message || "Report Approved Successfully!");
        navigate(-1);
      }
    } catch (error) {
      console.error("Error approving report:", error);
      alert("Error approving report. Check console.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!id) return;
    if (!reviewRemark.trim()) {
      alert("Please enter a rejection remark");
      return;
    }
    const currentUser = localStorage.getItem("username") || "Approver";
    setIsRejecting(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/reject-report/`, {
        log_id: id,
        approver_username: currentUser,
        rejected_by: currentUser,
        rejection_remark: reviewRemark,
        remark: reviewRemark,
        remarks: reviewRemark,
        approval_status: "Rejected",
      });
      if (response.status === 200) {
        alert("Report Rejected Successfully!");
        navigate(-1);
      }
    } catch (error) {
      console.error("Error rejecting report:", error);
      alert("Error rejecting report. Check console.");
    } finally {
      setIsRejecting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) return; // Disallow submission in view mode

    const filledRows = rows.filter((r) => r.machineNo || r.operatorName);
    if (filledRows.length === 0) {
      alert("Please fill at least one entry before submitting.");
      return;
    }

    const payload = filledRows.map((row, idx) => ({
      s_no: idx + 1,
      machine_no: row.machineNo,
      operator_name: row.operatorName,
      man: row.man,
      machine: row.machine,
      material: row.material,
      method: row.method,
    }));

    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/save-4m-display/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: payload }),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        const currentUser = localStorage.getItem("username") || "Unknown User";

        try {
          await axios.post(API_LOG, {
            username: currentUser,
            report_name: "4M Change Display Form",
            record_id: result.record_id // 🔥 Pass Record ID
          });
        } catch (logError) {
          console.error("Activity log error:", logError);
        }
        alert(result.message || "4M Display Board saved successfully!");
        handleReset();
      } else {
        alert("Error: " + (result.error || "Please check console."));
      }
    } catch (err) {
      alert("Failed to connect to the server. Make sure Django is running.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── blueprint layout styling for review buttons ── */
  const compactActionBtn = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    border: "none",
    color: "#fff",
    padding: "8px 16px",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: ".06em",
    textTransform: "uppercase",
    borderRadius: 5,
    fontFamily: "inherit",
    transition: "all .15s ease",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  };

  return (
    <div
      className="min-h-screen p-4"
      style={{
        background: C.pageBg,
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-4 flex justify-between items-center">
          <button
            type="button"
            onClick={() => navigate(-1)} // 🔥 Sends user back to previous page
            className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors text-sm font-bold bg-white px-4 py-2 border border-red-200 shadow-sm rounded-none tracking-wide uppercase"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              background: C.white,
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              overflow: "hidden",
              boxShadow: C.shadow,
            }}
          >
            {/* Header */}
            <div
              style={{
                background: C.red,
                padding: "20px 28px",
                borderBottom: `1px solid ${C.redDark}`,
              }}
            >
              <div className="hidden sm:flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <ClipboardList className="h-6 w-6 text-white/90" />
                  <h1 className="text-xl md:text-2xl font-bold text-white tracking-widest uppercase">
                    {id ? "4M Change Display Board (REVIEW)" : "4M Change Display Board"}
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-white font-bold text-sm bg-red-700/40 px-4 py-2 rounded-none border border-white/30 shadow-sm">
                  <Calendar className="h-4 w-4" />
                  {formDate}
                </div>
              </div>
              <div className="sm:hidden flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-white/90" />
                  <h1 className="text-lg font-bold text-white text-center tracking-widest uppercase">
                    {id ? "4M Change Display (REVIEW)" : "4M Change Display Board"}
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-white font-bold text-sm bg-red-700/40 px-4 py-2 border border-white/30 shadow-sm rounded-none">
                  <Calendar className="h-4 w-4" />
                  {formDate}
                </div>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6 space-y-6">
              {rows.map((row, idx) => (
                <div
                  key={row.id}
                  style={{
                    border: `1px solid ${C.rowBorder}`,
                    borderRadius: 8,
                    overflow: "hidden",
                    background: C.white,
                    boxShadow: "0 1px 4px rgba(0,0,0,.04)",
                  }}
                >
                  {/* Entry Header — S.No + Delete */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: C.rowHead,
                      borderBottom: `1px solid ${C.rowBorder}`,
                      padding: "10px 16px",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="h-3.5 w-3.5 text-red-500" />
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                        Entry {idx + 1}
                      </span>
                    </div>
                    {/* HIDE DELETE BUTTON IN VIEW MODE */}
                    {!id && (
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(row.id)}
                        disabled={rows.length === 1}
                        className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 border border-red-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-none font-bold uppercase tracking-wide"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Fields inside card */}
                  <div className="p-4 space-y-4">
                    {/* Row 1: Machine No. + Operator Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                          <Monitor className="inline h-3.5 w-3.5 mr-1 text-red-500" />
                          Machine No.
                        </label>
                        <input
                          type="text"
                          value={row.machineNo}
                          onChange={(e) => handleChange(row.id, "machineNo", e.target.value)}
                          placeholder="e.g. MC-101"
                          readOnly={!!id} // 🔥 READONLY IN VIEW MODE
                          style={{
                            width: "100%",
                            padding: "10px 13px",
                            fontSize: 13,
                            background: id ? "#f9f9f7" : C.inputBg,
                            color: id ? C.textMid : C.text,
                            cursor: id ? "not-allowed" : "text",
                            border: `1.5px solid ${C.border}`,
                            borderRadius: 6,
                            outline: "none",
                            transition: "all .15s",
                          }}
                          onFocus={(e) => {
                            if (!id) {
                              e.target.style.borderColor = C.red;
                              e.target.style.boxShadow = "0 0 0 3px rgba(185,28,28,.1)";
                            }
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = C.border;
                            e.target.style.boxShadow = "none";
                          }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                          <User className="inline h-3.5 w-3.5 mr-1 text-red-500" />
                          Operator Name
                        </label>
                        <input
                          type="text"
                          value={row.operatorName}
                          onChange={(e) => handleChange(row.id, "operatorName", e.target.value)}
                          placeholder="Enter operator name"
                          readOnly={!!id} // 🔥 READONLY
                          style={{
                            width: "100%",
                            padding: "10px 13px",
                            fontSize: 13,
                            background: id ? "#f9f9f7" : C.inputBg,
                            color: id ? C.textMid : C.text,
                            cursor: id ? "not-allowed" : "text",
                            border: `1.5px solid ${C.border}`,
                            borderRadius: 6,
                            outline: "none",
                            transition: "all .15s",
                          }}
                          onFocus={(e) => {
                            if (!id) {
                              e.target.style.borderColor = C.red;
                              e.target.style.boxShadow = "0 0 0 3px rgba(185,28,28,.1)";
                            }
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = C.border;
                            e.target.style.boxShadow = "none";
                          }}
                        />
                      </div>
                    </div>

                    {/* Row 2: Man + Machine */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                          <User className="inline h-3.5 w-3.5 mr-1 text-red-500" />
                          Man
                        </label>
                        <input
                          type="text"
                          value={row.man}
                          onChange={(e) => handleChange(row.id, "man", e.target.value)}
                          placeholder="Enter man detail"
                          readOnly={!!id}
                          style={{
                            width: "100%",
                            padding: "10px 13px",
                            fontSize: 13,
                            background: id ? "#f9f9f7" : C.inputBg,
                            color: id ? C.textMid : C.text,
                            cursor: id ? "not-allowed" : "text",
                            border: `1.5px solid ${C.border}`,
                            borderRadius: 6,
                            outline: "none",
                            transition: "all .15s",
                          }}
                          onFocus={(e) => {
                            if (!id) {
                              e.target.style.borderColor = C.red;
                              e.target.style.boxShadow = "0 0 0 3px rgba(185,28,28,.1)";
                            }
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = C.border;
                            e.target.style.boxShadow = "none";
                          }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                          <Settings className="inline h-3.5 w-3.5 mr-1 text-red-500" />
                          Machine
                        </label>
                        <input
                          type="text"
                          value={row.machine}
                          onChange={(e) => handleChange(row.id, "machine", e.target.value)}
                          placeholder="Enter machine detail"
                          readOnly={!!id}
                          style={{
                            width: "100%",
                            padding: "10px 13px",
                            fontSize: 13,
                            background: id ? "#f9f9f7" : C.inputBg,
                            color: id ? C.textMid : C.text,
                            cursor: id ? "not-allowed" : "text",
                            border: `1.5px solid ${C.border}`,
                            borderRadius: 6,
                            outline: "none",
                            transition: "all .15s",
                          }}
                          onFocus={(e) => {
                            if (!id) {
                              e.target.style.borderColor = C.red;
                              e.target.style.boxShadow = "0 0 0 3px rgba(185,28,28,.1)";
                            }
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = C.border;
                            e.target.style.boxShadow = "none";
                          }}
                        />
                      </div>
                    </div>

                    {/* Row 3: Material + Method */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                          <Package className="inline h-3.5 w-3.5 mr-1 text-red-500" />
                          Material
                        </label>
                        <input
                          type="text"
                          value={row.material}
                          onChange={(e) => handleChange(row.id, "material", e.target.value)}
                          placeholder="Enter material detail"
                          readOnly={!!id}
                          style={{
                            width: "100%",
                            padding: "10px 13px",
                            fontSize: 13,
                            background: id ? "#f9f9f7" : C.inputBg,
                            color: id ? C.textMid : C.text,
                            cursor: id ? "not-allowed" : "text",
                            border: `1.5px solid ${C.border}`,
                            borderRadius: 6,
                            outline: "none",
                            transition: "all .15s",
                          }}
                          onFocus={(e) => {
                            if (!id) {
                              e.target.style.borderColor = C.red;
                              e.target.style.boxShadow = "0 0 0 3px rgba(185,28,28,.1)";
                            }
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = C.border;
                            e.target.style.boxShadow = "none";
                          }}
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                          <Layers className="inline h-3.5 w-3.5 mr-1 text-red-500" />
                          Method
                        </label>
                        <input
                          type="text"
                          value={row.method}
                          onChange={(e) => handleChange(row.id, "method", e.target.value)}
                          placeholder="Enter method detail"
                          readOnly={!!id}
                          style={{
                            width: "100%",
                            padding: "10px 13px",
                            fontSize: 13,
                            background: id ? "#f9f9f7" : C.inputBg,
                            color: id ? C.textMid : C.text,
                            cursor: id ? "not-allowed" : "text",
                            border: `1.5px solid ${C.border}`,
                            borderRadius: 6,
                            outline: "none",
                            transition: "all .15s",
                          }}
                          onFocus={(e) => {
                            if (!id) {
                              e.target.style.borderColor = C.red;
                              e.target.style.boxShadow = "0 0 0 3px rgba(185,28,28,.1)";
                            }
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = C.border;
                            e.target.style.boxShadow = "none";
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Entry Button - HIDE IN VIEW MODE */}
              {!id && (
                <div>
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors text-sm font-bold bg-white px-4 py-2 border border-red-200 shadow-sm rounded-none tracking-wide uppercase"
                  >
                    <Plus className="h-4 w-4" />
                    Add Entry
                  </button>
                  <span className="ml-3 text-xs text-slate-400">
                    {rows.length} entr{rows.length !== 1 ? "ies" : "y"} total
                  </span>
                </div>
              )}

              {/* ─── Bottom Workflow Module (Review Panel Area) ─── */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  background: "#fafaf8",
                  padding: "20px",
                  borderRadius: "6px",
                  border: `1px solid ${C.border}`,
                  marginTop: "24px",
                }}
              >
                {/* 1. Large Remark Field Area for Review Mode */}
                {id && (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: ".12em",
                        textTransform: "uppercase",
                        color: C.text,
                        marginBottom: 8,
                      }}
                    >
                      <MessageSquare size={14} color={C.red} />
                      Approval / Rejection Review Remark
                    </div>

                    <textarea
                      value={reviewRemark}
                      onChange={(e) => setReviewRemark(e.target.value)}
                      readOnly={approvalStatus !== "Pending"}
                      rows={4}
                      placeholder="Enter workflow validation comments or context adjustments..."
                      style={{
                        width: "100%",
                        padding: "12px",
                        fontSize: 14,
                        lineHeight: "1.5",
                        color: C.text,
                        border: `1.5px solid ${C.border}`,
                        borderRadius: 6,
                        outline: "none",
                        fontFamily: "inherit",
                        resize: "vertical",
                        minHeight: 110,
                        background: approvalStatus !== "Pending" ? "#f9f9f7" : C.white,
                      }}
                    />
                  </div>
                )}

                {/* 2. Form Actions Execution Block */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-200">
                  {/* Prepared By Component Status */}
                  <div style={{ minWidth: 200, alignSelf: 'flex-start' }}>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: ".12em",
                        textTransform: "uppercase",
                        color: C.textMid,
                        marginBottom: 6,
                      }}
                    >
                      Prepared By
                    </div>
                    <input
                      type="text"
                      value={preparedBy}
                      onChange={(e) => setPreparedBy(e.target.value)}
                      readOnly={!!id} // 🔥 DISABLED IN VIEW MODE
                      placeholder="Enter name"
                      style={{
                        width: 220,
                        padding: "8px 12px",
                        fontSize: 13,
                        background: id ? "#f9f9f7" : C.inputBg,
                        color: id ? C.textMid : C.text,
                        cursor: id ? "not-allowed" : "text",
                        border: `1.5px solid ${C.border}`,
                        borderRadius: 6,
                        outline: "none",
                      }}
                    />
                  </div>

                  {/* Operational Controls Block Layout */}
                   {!isReadOnly && (
                  <div className="flex gap-4">
                    {id ? (
                      <>
                        {/* Compact Approve Button */}
                        <button
                          type="button"
                          disabled={isApproving || approvalStatus !== "Pending"}
                          onClick={handleApprove}
                          style={{
                            ...compactActionBtn,
                            background: C.green,
                            cursor: isApproving || approvalStatus !== "Pending" ? "not-allowed" : "pointer",
                            opacity: approvalStatus !== "Pending" && approvalStatus !== "Approved" ? 0.4 : 1,
                          }}
                          onMouseEnter={(e) => {
                            if (!isApproving && approvalStatus === "Pending") {
                              e.currentTarget.style.background = C.greenDark;
                              e.currentTarget.style.transform = "translateY(-1px)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isApproving && approvalStatus === "Pending") {
                              e.currentTarget.style.background = C.green;
                              e.currentTarget.style.transform = "none";
                            }
                          }}
                        >
                          {isApproving ? (
                            <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />
                          ) : (
                            <Check size={13} strokeWidth={3} />
                          )}
                          Approve
                        </button>

                        {/* Compact Reject Button */}
                        <button
                          type="button"
                          disabled={isRejecting || approvalStatus !== "Pending"}
                          onClick={handleReject}
                          style={{
                            ...compactActionBtn,
                            background: C.red,
                            cursor: isRejecting || approvalStatus !== "Pending" ? "not-allowed" : "pointer",
                            opacity: approvalStatus !== "Pending" && approvalStatus !== "Rejected" ? 0.4 : 1,
                          }}
                          onMouseEnter={(e) => {
                            if (!isRejecting && approvalStatus === "Pending") {
                              e.currentTarget.style.background = C.redDark;
                              e.currentTarget.style.transform = "translateY(-1px)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isRejecting && approvalStatus === "Pending") {
                              e.currentTarget.style.background = C.red;
                              e.currentTarget.style.transform = "none";
                            }
                          }}
                        >
                          {isRejecting ? (
                            <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />
                          ) : (
                            <X size={13} strokeWidth={3} />
                          )}
                          Reject
                        </button>
                      </>
                    ) : (
                      // SHOW RESET & SUBMIT BUTTONS IN CREATE MODE
                      <>
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
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                          {isLoading ? "Submitting..." : "Submit Board"}
                        </button>
                      </>
                    )}
                  </div>
                   )}
                </div>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FourMDisplayBoard;