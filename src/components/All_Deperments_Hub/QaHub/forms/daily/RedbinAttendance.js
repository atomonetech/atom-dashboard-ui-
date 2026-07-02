import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import { CiCalendarDate } from "react-icons/ci";
import { IoMdArrowBack, IoIosArrowDown } from "react-icons/io";

import { useReadOnlyMode } from "../../../../../hooks/useReadOnlyMode";
import axios from "axios";

const today = new Date();

const formattedDate = `${String(today.getDate()).padStart(2, "0")}-${String(
  today.getMonth() + 1
).padStart(2, "0")}-${today.getFullYear()}`;

const currentMonth = today.toLocaleString("default", { month: "long" });
const currentYear = today.getFullYear();

// Backend API URLs
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";
const API_SAVE = `${API_BASE}/api/redbin-attendance/save/`;
const API_LOG = `${API_BASE}/api/log-report/`;
const API_APPROVE = `${API_BASE}/api/approve-report/`;
const API_REJECT = `${API_BASE}/api/reject-report/`;

const DEFAULT_DESIGNATIONS = [
  "Quality Engineer",
  "Production Engineer",
  "Operator",
  "Supervisor",
  "Store Incharge",
  "CFT Member",
  "Rework Operator",
  "Quality Inspector",
];

const DEFAULT_NAMES = [
  "Rahul Sharma",
  "Priya Patel",
  "Amit Verma",
  "Sunita Yadav",
  "Rajesh Kumar",
  "Neha Singh",
  "Vikram Joshi",
  "Pooja Desai",
  "Manoj Tiwari",
  "Kavita Mehta",
];

const SelectWrapper = ({ children, color = "#f59e0b", disabled = false }) => (
  <div style={{ position: "relative", width: "100%" }}>
    {children}

    {!disabled && (
      <IoIosArrowDown
        style={{
          position: "absolute",
          right: 10,
          top: "50%",
          transform: "translateY(-50%)",
          color,
          fontSize: 16,
          pointerEvents: "none",
        }}
      />
    )}
  </div>
);

export default function RedbinAttendance() {
  const navigate = useNavigate();
  // 🔥 View Mode Logic
    const isReadOnly = useReadOnlyMode();
  const { id } = useParams();
  const isViewMode = Boolean(id);
  const currentUser = localStorage.getItem("username") || "Unknown User";

  const [preparedBy, setPreparedBy] = useState("");
  const [displayDate, setDisplayDate] = useState(formattedDate);
  const [displayMonthYear, setDisplayMonthYear] = useState(
    `${currentMonth} ${currentYear}`
  );

  const [approvalStatus, setApprovalStatus] = useState("Pending");
  const [reviewApprovedBy, setReviewApprovedBy] = useState("");
  const [reviewRejectedBy, setReviewRejectedBy] = useState("");
  const [reviewRemark, setReviewRemark] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const [namesList, setNamesList] = useState(() => {
    const savedNames = localStorage.getItem("redbin_names");
    return savedNames ? JSON.parse(savedNames) : DEFAULT_NAMES;
  });

  const [designationsList, setDesignationsList] = useState(() => {
    const savedDesig = localStorage.getItem("redbin_designations");
    return savedDesig ? JSON.parse(savedDesig) : DEFAULT_DESIGNATIONS;
  });

  const [selectedName, setSelectedName] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [rows, setRows] = useState([]);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
  if (process.env.NODE_ENV !== "development") return;

  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/eruda";
  script.async = true;

  script.onload = () => {
    try {
      if (window.eruda && !window.__ERUDA_INITED__) {
        window.eruda.init();
        window.__ERUDA_INITED__ = true;
      }
    } catch (err) {
      console.error("Eruda init error:", err);
    }
  };

  document.body.appendChild(script);

  return () => {
    try {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    } catch (err) {
      console.error("Eruda cleanup error:", err);
    }
  };
}, []);

  useEffect(() => {
    localStorage.setItem("redbin_names", JSON.stringify(namesList));
  }, [namesList]);

  useEffect(() => {
    localStorage.setItem(
      "redbin_designations",
      JSON.stringify(designationsList)
    );
  }, [designationsList]);

  useEffect(() => {
    if (isViewMode) {
      const fetchReportData = async () => {
        try {
          const res = await axios.get(
            `${API_BASE}/api/get-single-report/redbin-attendance-view/${id}/`
          );

          if (res.data.success) {
            const data = res.data.data;
            const statusText = data.status || "";

            if (data.date) {
              const parts = data.date.split("-");
              if (parts.length === 3) {
                setDisplayDate(`${parts[2]}-${parts[1]}-${parts[0]}`);
              }
            }

            if (data.month && data.year) {
              setDisplayMonthYear(`${data.month} ${data.year}`);
            }

            setRows([
              {
                name: data.employee_name || "—",
                designation: data.designation || "—",
                attendance: {
                  [data.date ? parseInt(data.date.split("-")[2]) : today.getDate()]:
                    data.status || "",
                },
              },
            ]);

            const fullName = data.submitted_by || "Unknown User";
            setPreparedBy(fullName.split("@")[0]);

            setApprovalStatus(
              data.approval_status ||
                (statusText.startsWith("Approved by")
                  ? "Approved"
                  : statusText.startsWith("Rejected by")
                  ? "Rejected"
                  : "Pending")
            );

            setReviewApprovedBy(
              data.review_approved_by ||
                (statusText.startsWith("Approved by")
                  ? statusText.replace("Approved by", "").trim()
                  : "")
            );

            setReviewRejectedBy(
              data.review_rejected_by ||
                (statusText.startsWith("Rejected by")
                  ? statusText.replace("Rejected by", "").trim()
                  : "")
            );

            setReviewRemark(
              data.review_remarks ||
                data.approval_remarks ||
                data.rejection_remark ||
                data.review_remark ||
                data.remarks ||
                ""
            );
          }
        } catch (error) {
          console.error("Failed to load report data", error);
        }
      };

      fetchReportData();
    }
  }, [id, isViewMode]);

  const checkAndAddRow = (name, desig) => {
    if (isViewMode) return;

    if (name && desig) {
      setRows((p) => [...p, { name, designation: desig, attendance: {} }]);
      setSelectedName("");
      setSelectedDesignation("");
    }
  };

  const handleNameChange = (e) => {
    if (isViewMode) return;

    const val = e.target.value;

    if (val === "ADD_NEW") {
      const newName = window.prompt("Enter new Name:");

      if (newName && newName.trim() !== "") {
        const trimmed = newName.trim();

        if (!namesList.includes(trimmed)) {
          setNamesList((prev) => [...prev, trimmed]);
        }

        setSelectedName(trimmed);
        checkAndAddRow(trimmed, selectedDesignation);
      } else {
        setSelectedName("");
      }
    } else {
      setSelectedName(val);
      checkAndAddRow(val, selectedDesignation);
    }
  };

  const handleDesignationChange = (e) => {
    if (isViewMode) return;

    const val = e.target.value;

    if (val === "ADD_NEW") {
      const newDesig = window.prompt("Enter new Designation:");

      if (newDesig && newDesig.trim() !== "") {
        const trimmed = newDesig.trim();

        if (!designationsList.includes(trimmed)) {
          setDesignationsList((prev) => [...prev, trimmed]);
        }

        setSelectedDesignation(trimmed);
        checkAndAddRow(selectedName, trimmed);
      } else {
        setSelectedDesignation("");
      }
    } else {
      setSelectedDesignation(val);
      checkAndAddRow(selectedName, val);
    }
  };

  const updateAttendance = (i, day, val) => {
    if (isViewMode) return;

    setRows((p) =>
      p.map((r, idx) => {
        if (idx !== i) return r;
        return { ...r, attendance: { ...r.attendance, [day]: val } };
      })
    );
  };

  const removeRow = (i) => {
    if (!isViewMode) {
      setRows((p) => p.filter((_, idx) => idx !== i));
    }
  };

  const handleApprove = async () => {
    if (!id) return;

    setIsApproving(true);

    try {
      const response = await axios.post(API_APPROVE, {
        log_id: id,
        approver_username: currentUser,
        approved_by: currentUser,
        approval_status: "Approved",
        remark: reviewRemark,
        remarks: reviewRemark,
      });

      if (response.status === 200) {
        alert(response.data.message || "✅ Report Approved Successfully!");
        navigate(-1);
      }
    } catch (error) {
      console.error("Error approving data:", error);

      if (error.response) {
        alert(
          `❌ Backend Error: ${
            error.response.data.error ||
            error.response.data.message ||
            "Failed to approve report"
          }`
        );
      } else {
        alert("❌ Network Error: Could not connect to server.");
      }
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!id) return;

    if (!reviewRemark.trim()) {
      alert("Please enter rejection remark");
      return;
    }

    setIsRejecting(true);

    try {
      const response = await axios.post(API_REJECT, {
        log_id: id,
        approver_username: currentUser,
        rejected_by: currentUser,
        rejection_remark: reviewRemark,
        remark: reviewRemark,
        remarks: reviewRemark,
        approval_status: "Rejected",
      });

      if (response.status === 200) {
        alert(response.data.message || "❌ Report Rejected Successfully!");
        navigate(-1);
      }
    } catch (error) {
      console.error("Error rejecting data:", error);

      if (error.response) {
        alert(
          `❌ Backend Error: ${
            error.response.data.error ||
            error.response.data.message ||
            "Failed to reject report"
          }`
        );
      } else {
        alert("❌ Network Error: Could not connect to server.");
      }
    } finally {
      setIsRejecting(false);
    }
  };

  const handleSave = async () => {
    if (isViewMode) return;

    const day = today.getDate();
    const isoDate = today.toISOString().split("T")[0];

    const payload = rows.map((r) => ({
      date: isoDate,
      month: currentMonth,
      year: currentYear,
      employee_name: r.name,
      designation: r.designation,
      status: r.attendance[day] || "",
      submitted_by: currentUser,
    }));

    if (payload.length === 0) {
      alert("No attendance data to save.");
      return;
    }

    try {
      const response = await axios.post(API_SAVE, payload);

      if (response.status === 201 || response.status === 200) {
        const savedRecordId = response.data.record_id;

        try {
          await axios.post(API_LOG, {
            username: currentUser,
            report_name: "Red Bin Attendance",
            record_id: savedRecordId,
            department_name: "Plant 2 (QA)",
            target_group: "Quality_Approvers",
          });
        } catch (logError) {
          console.error("Activity log error:", logError);
          alert("Form saved, but notification not created.");
        }

        setSaveMsg("✓ Saved to Database!");

        setTimeout(() => {
          setSaveMsg("");
          navigate(-1);
        }, 1500);
      }
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Error saving data. Please check backend connection.");
    }
  };

  const handleReset = () => {
    if (isViewMode) return;

    if (window.confirm("Are you sure you want to reset all attendance data?")) {
      setRows([]);
      setSelectedName("");
      setSelectedDesignation("");
      setSaveMsg("");
    }
  };

  const lbl = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.07em",
    color: "#000000",
    textTransform: "uppercase",
    marginBottom: 6,
    display: "block",
    fontFamily: "'DM Sans',sans-serif",
  };

  const sel = (v, disabled = false) => ({
    width: "100%",
    padding: disabled ? "11px 14px" : "11px 32px 11px 14px",
    border: `1.5px solid ${v && !disabled ? "#f59e0b" : "#cbd5e1"}`,
    borderRadius: 10,
    fontSize: 14,
    fontWeight: v ? 600 : 400,
    background: disabled ? "#f8fafc" : v ? "#fffbeb" : "#ffffff",
    color: disabled ? "#64748b" : "#000000",
    outline: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "'DM Sans',sans-serif",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    WebkitAppearance: "none",
    appearance: "none",
  });

  const attSel = (val, disabled = false) => ({
    width: 60,
    padding: "5px 4px",
    border: `1.5px solid ${
      val === "P" || val === "Present"
        ? "#f59e0b"
        : val === "A" || val === "Absent"
        ? "#fca5a5"
        : "#fde68a"
    }`,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 700,
    background: disabled
      ? "#f8fafc"
      : val === "P" || val === "Present"
      ? "#fffbeb"
      : val === "A" || val === "Absent"
      ? "#fee2e2"
      : "#fff",
    color: disabled ? "#64748b" : "#000000",
    outline: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "'DM Sans',sans-serif",
    WebkitAppearance: "none",
    appearance: "none",
    textAlign: "center",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "'DM Sans',sans-serif",
        padding: "16px 10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        select option {
          color: #000000 !important;
          background: #ffffff !important;
          font-weight: 500;
        }

        @keyframes fadeIn {
          from { opacity:0; transform:translateY(4px); }
          to { opacity:1; transform:translateY(0); }
        }

        .rb-save-toast {
          animation: fadeIn 0.25s ease;
        }

        .rb-save-btn {
          height: 38px;
          padding: 0 20px;
          border-radius: 9px;
          background: ${isViewMode ? "#10b981" : "#d97706"};
          color: #fff;
          border: none;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          font-family: 'DM Sans',sans-serif;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.15s, transform 0.12s, box-shadow 0.15s;
          box-shadow: 0 2px 8px rgba(217,119,6,0.25);
          white-space: nowrap;
        }

        .rb-save-btn:hover {
          filter: brightness(0.9);
          transform: translateY(-1px);
        }

        .rb-save-btn:active {
          transform: scale(0.97);
          box-shadow: none;
        }

        .rb-save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .rb-reject-btn {
          height: 38px;
          padding: 0 20px;
          border-radius: 9px;
          background: #dc2626;
          color: #fff;
          border: none;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          font-family: 'DM Sans',sans-serif;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.15s, transform 0.12s, box-shadow 0.15s;
          box-shadow: 0 2px 8px rgba(220,38,38,0.25);
          white-space: nowrap;
        }

        .rb-reject-btn:hover {
          filter: brightness(0.9);
          transform: translateY(-1px);
        }

        .rb-reject-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .rb-reset-btn {
          height: 38px;
          padding: 0 16px;
          border-radius: 9px;
          background: #fffbeb;
          color: #92400e;
          border: 1.5px solid #fde68a;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          font-family: 'DM Sans',sans-serif;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.12s;
          white-space: nowrap;
        }

        .rb-reset-btn:hover {
          background: #fee2e2;
          border-color: #fca5a5;
          color: #dc2626;
          transform: translateY(-1px);
        }

        .rb-reset-btn:active {
          transform: scale(0.97);
        }

        .redbin-filter-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 22px;
          padding: 22px 28px;
        }

        .redbin-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 17px 28px;
          border-bottom: 1px solid #fef3c7;
          background: linear-gradient(90deg,#fffbeb,#fffdf5);
          flex-wrap: wrap;
          gap: 10px;
        }

        .redbin-topbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .redbin-title {
          font-weight: 800;
          font-size: 16px;
          color: #000000;
          display: block;
        }

        .redbin-subtitle {
          font-size: 11px;
          color: #000000;
          font-weight: 600;
        }

        .redbin-date-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1.5px solid #f59e0b;
          border-radius: 10px;
          padding: 6px 14px;
          background: #f8fafc;
          flex-shrink: 0;
        }

        .redbin-table-wrap {
          overflow-x: auto;
          border-radius: 10px;
          border: 2px solid #92400e;
          box-shadow: 0 4px 16px rgba(146,64,14,0.08);
          margin-bottom: 14px;
          -webkit-overflow-scrolling: touch;
        }

        @media (max-width: 640px) {
          .redbin-filter-grid {
            grid-template-columns: 1fr;
            gap: 14px;
            padding: 16px 14px;
          }

          .redbin-topbar {
            padding: 13px 14px;
          }

          .redbin-title {
            font-size: 13px;
          }

          .redbin-subtitle {
            font-size: 10px;
          }

          .redbin-date-badge {
            padding: 5px 10px;
          }

          .redbin-date-badge span {
            font-size: 12px !important;
          }

          .redbin-card {
            border-radius: 14px !important;
            margin-bottom: 14px !important;
          }

          .redbin-table-section {
            padding: 14px 10px !important;
          }

          .redbin-sheet-title {
            font-size: 12px !important;
          }
        }

        @media (min-width: 641px) and (max-width: 900px) {
          .redbin-filter-grid {
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            padding: 18px 20px;
          }

          .redbin-topbar {
            padding: 14px 20px;
          }
        }
      `}</style>

      <div
        className="redbin-card"
        style={{
          width: "100%",
          maxWidth: 1100,
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 4px 24px rgba(245,158,11,0.10)",
          border: "1.5px solid #fde68a",
          overflow: "hidden",
          marginBottom: 20,
        }}
      >
        <div className="redbin-topbar">
          <div className="redbin-topbar-left">
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "#fef3c7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
              }}
              onClick={() => navigate(-1)}
            >
              <IoMdArrowBack size={22} color="#f59e0b" />
            </div>

            <div>
              <span className="redbin-title">
                Red Bin Attendance Sheet{" "}
                {isViewMode && (
                  <span style={{ color: "#f59e0b" }}>
                    (REVIEW - {approvalStatus})
                  </span>
                )}
              </span>

              <span className="redbin-subtitle">
                Form No: AOT/F/QC/05 &nbsp;·&nbsp; Resp: Quality Engineer
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <div className="redbin-date-badge">
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 14,
                  color: "#000000",
                  letterSpacing: "0.5px",
                }}
              >
                {displayDate}
              </span>

              <CiCalendarDate size={20} color="#92400e" />
            </div>
          </div>
        </div>

        <div className="redbin-filter-grid">
          <div>
            <label style={lbl}>Name :-</label>

            {isViewMode ? (
              <div style={sel(true, true)}>{rows[0]?.name || "—"}</div>
            ) : (
              <SelectWrapper>
                <select
                  value={selectedName}
                  onChange={handleNameChange}
                  style={sel(selectedName, false)}
                >
                  <option value="">Select Name...</option>

                  {namesList.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}

                  <option
                    value="ADD_NEW"
                    style={{ fontWeight: "bold", color: "#d97706" }}
                  >
                    + Add New Name...
                  </option>
                </select>
              </SelectWrapper>
            )}
          </div>

          <div>
            <label style={lbl}>Designation :-</label>

            {isViewMode ? (
              <div style={sel(true, true)}>{rows[0]?.designation || "—"}</div>
            ) : (
              <SelectWrapper>
                <select
                  value={selectedDesignation}
                  onChange={handleDesignationChange}
                  style={sel(selectedDesignation, false)}
                >
                  <option value="">Select Designation...</option>

                  {designationsList.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}

                  <option
                    value="ADD_NEW"
                    style={{ fontWeight: "bold", color: "#d97706" }}
                  >
                    + Add New Designation...
                  </option>
                </select>
              </SelectWrapper>
            )}
          </div>

          <div>
            <label style={lbl}>Month :-</label>

            <div
              style={{
                width: "100%",
                padding: "11px 14px",
                border: "1.5px solid #f59e0b",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                background: "#f8fafc",
                color: "#000000",
                fontFamily: "'DM Sans',sans-serif",
                boxSizing: "border-box",
              }}
            >
              {displayMonthYear}
            </div>
          </div>
        </div>

        {rows.length === 0 && !isViewMode && (
          <div style={{ padding: "0 14px 14px" }}>
            <span style={{ fontSize: 12, color: "#000000", fontWeight: 600 }}>
              ⚡ Select Name & Designation — row will be added automatically
            </span>
          </div>
        )}
      </div>

      {rows.length > 0 && (
        <div
          style={{
            width: "100%",
            maxWidth: 1100,
            background: "#fff",
            borderRadius: 18,
            boxShadow: "0 6px 32px rgba(245,158,11,0.12)",
            border: "1.5px solid #fcd34d",
            overflow: "hidden",
          }}
        >
          <div className="redbin-table-section" style={{ padding: "20px 24px" }}>
            <div style={{ marginBottom: 14 }}>
              <span
                className="redbin-sheet-title"
                style={{
                  fontWeight: 800,
                  fontSize: 14,
                  color: "#000000",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <ClipboardList size={16} color="#78350f" />
                Attendance Sheet — {displayMonthYear}
              </span>
            </div>

            <div className="redbin-table-wrap">
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 11,
                }}
              >
                <thead>
                  <tr style={{ background: "#92400e" }}>
                    <th
                      style={{
                        padding: "10px 8px",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 11,
                        textAlign: "center",
                        borderRight: "1px solid rgba(255,255,255,0.2)",
                        minWidth: 36,
                      }}
                    >
                      SR.
                    </th>

                    <th
                      style={{
                        padding: "10px 8px",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 11,
                        textAlign: "left",
                        borderRight: "1px solid rgba(255,255,255,0.2)",
                        minWidth: 130,
                      }}
                    >
                      NAME
                    </th>

                    <th
                      style={{
                        padding: "10px 8px",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 11,
                        textAlign: "left",
                        borderRight: "1px solid rgba(255,255,255,0.2)",
                        minWidth: 120,
                      }}
                    >
                      DESIGNATION
                    </th>

                    <th
                      style={{
                        padding: "8px 10px",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 11,
                        textAlign: "center",
                        borderRight: "1px solid rgba(255,255,255,0.15)",
                        minWidth: 50,
                        background: "#b45309",
                      }}
                    >
                      {isViewMode ? displayDate.split("-")[0] : today.getDate()}{" "}
                      {displayMonthYear.slice(0, 3)}
                    </th>

                    {!isViewMode && (
                      <th
                        style={{
                          padding: "10px 4px",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: 10,
                          textAlign: "center",
                          background: "#7f1d1d",
                          minWidth: 28,
                        }}
                      >
                        –
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row, i) => {
                    const day =
                      isViewMode && displayDate
                        ? parseInt(displayDate.split("-")[0])
                        : today.getDate();

                    const val = row.attendance[day] || "";

                    return (
                      <tr
                        key={i}
                        style={{ background: i % 2 === 0 ? "#fff" : "#fffbeb" }}
                      >
                        <td
                          style={{
                            padding: "8px 4px",
                            borderBottom: "1px solid #fef3c7",
                            borderRight: "1px solid #fef3c7",
                            textAlign: "center",
                            fontWeight: 800,
                            color: "#000000",
                            fontSize: 12,
                          }}
                        >
                          {i + 1}
                        </td>

                        <td
                          style={{
                            padding: "8px 10px",
                            borderBottom: "1px solid #fef3c7",
                            borderRight: "1px solid #fef3c7",
                            fontWeight: 700,
                            color: "#000000",
                            fontSize: 12,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.name}
                        </td>

                        <td
                          style={{
                            padding: "8px 10px",
                            borderBottom: "1px solid #fef3c7",
                            borderRight: "1px solid #fef3c7",
                            fontWeight: 600,
                            color: "#000000",
                            fontSize: 11,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.designation}
                        </td>

                        <td
                          style={{
                            padding: "4px 8px",
                            borderBottom: "1px solid #fef3c7",
                            borderRight: "1px solid #fef3c7",
                            textAlign: "center",
                          }}
                        >
                          {isViewMode ? (
                            <div style={attSel(val, true)}>{val || "—"}</div>
                          ) : (
                            <SelectWrapper
                              disabled={false}
                              color={
                                val === "P"
                                  ? "#92400e"
                                  : val === "A"
                                  ? "#991b1b"
                                  : "#9ca3af"
                              }
                            >
                              <select
                                value={val}
                                onChange={(e) =>
                                  updateAttendance(i, day, e.target.value)
                                }
                                style={attSel(val, false)}
                              >
                                <option value="">—</option>
                                <option value="P">P</option>
                                <option value="A">A</option>
                              </select>
                            </SelectWrapper>
                          )}
                        </td>

                        {!isViewMode && (
                          <td
                            style={{
                              padding: "4px",
                              borderBottom: "1px solid #fef3c7",
                              textAlign: "center",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => removeRow(i)}
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: 6,
                                border: "1px solid #fecaca",
                                background: "#fff",
                                color: "#dc2626",
                                cursor: "pointer",
                                fontWeight: 700,
                                fontSize: 11,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto",
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = "#ef4444";
                                e.currentTarget.style.color = "#fff";
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = "#fff";
                                e.currentTarget.style.color = "#dc2626";
                              }}
                            >
                              ✕
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {isViewMode && (
              <div
                style={{
                  marginTop: 16,
                  borderTop: "1px solid #fef3c7",
                  paddingTop: 16,
                  background: "#fffdf5",
                  borderRadius: 10,
                  padding: 14,
                  border: "1px solid #fde68a",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#64748b",
                        textTransform: "uppercase",
                        marginBottom: 2,
                      }}
                    >
                      Prepared By
                    </p>

                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 900,
                        color: "#d97706",
                        textTransform: "capitalize",
                        margin: 0,
                      }}
                    >
                      {preparedBy || "—"}
                    </p>
                  </div>

                  {reviewApprovedBy && (
                    <div>
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#64748b",
                          textTransform: "uppercase",
                          marginBottom: 2,
                        }}
                      >
                        Review Approved By
                      </p>

                      <p
                        style={{
                          fontSize: 16,
                          fontWeight: 900,
                          color: "#10b981",
                          textTransform: "capitalize",
                          margin: 0,
                        }}
                      >
                        {reviewApprovedBy}
                      </p>
                    </div>
                  )}

                  {reviewRejectedBy && (
                    <div>
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#64748b",
                          textTransform: "uppercase",
                          marginBottom: 2,
                        }}
                      >
                        Review Rejected By
                      </p>

                      <p
                        style={{
                          fontSize: 16,
                          fontWeight: 900,
                          color: "#dc2626",
                          textTransform: "capitalize",
                          margin: 0,
                        }}
                      >
                        {reviewRejectedBy}
                      </p>
                    </div>
                  )}

                  <div>
                    <p
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#64748b",
                        textTransform: "uppercase",
                        marginBottom: 2,
                      }}
                    >
                      Review Status
                    </p>

                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 900,
                        color:
                          approvalStatus === "Approved"
                            ? "#10b981"
                            : approvalStatus === "Rejected"
                            ? "#dc2626"
                            : "#d97706",
                        textTransform: "capitalize",
                        margin: 0,
                      }}
                    >
                      {approvalStatus}
                    </p>
                  </div>
                </div>

                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: "#92400e",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Approval / Rejection Remark
                </label>

                <textarea
                  value={reviewRemark}
                  onChange={(e) => setReviewRemark(e.target.value)}
                  rows={3}
                  placeholder="Enter approval/rejection remark..."
                  style={{
                    width: "100%",
                    border: "1.5px solid #fcd34d",
                    borderRadius: 8,
                    padding: 10,
                    fontSize: 13,
                    fontFamily: "'DM Sans',sans-serif",
                    outline: "none",
                    resize: "vertical",
                    color: "#000",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                flexWrap: "wrap",
                alignItems: "center",
                marginTop: 16,
                borderTop: "1px solid #fef3c7",
                paddingTop: 16,
              }}
            >
              <div style={{ width: "100%" }}></div>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {saveMsg && (
                  <span
                    className="rb-save-toast"
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#92400e",
                      background: "#fef3c7",
                      border: "1px solid #fcd34d",
                      borderRadius: 8,
                      padding: "5px 12px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {saveMsg}
                  </span>
                )}

                {!isViewMode && (
                  <button
                    type="button"
                    className="rb-reset-btn"
                    onClick={handleReset}
                  >
                    <svg
                      width="13"
                      height="13"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 4v5h.582M20 20v-5h-.581M5.635 15A8 8 0 1118.364 9"
                      />
                    </svg>
                    Reset
                  </button>
                )}

                {isViewMode ? !isReadOnly&&(
                  <>
                    <button
                      type="button"
                      className="rb-save-btn"
                      onClick={handleApprove}
                      disabled={isApproving || approvalStatus === "Approved"}
                    >
                      {isApproving ? "Approving..." : "✓ Approve Report"}
                    </button>

                    <button
                      type="button"
                      className="rb-reject-btn"
                      onClick={handleReject}
                      disabled={isRejecting || approvalStatus === "Rejected"}
                    >
                      {isRejecting ? "Rejecting..." : "✕ Reject Report"}
                    </button>
                  </>
                ) : (
                  <button type="button" className="rb-save-btn" onClick={handleSave}>
                    <svg
                      width="13"
                      height="13"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 3H7a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2z"
                      />
                    </svg>
                    Save
                  </button>
                )}
              </div>
            </div>
               
          </div>
        </div>
      )}
    </div>
  );
}