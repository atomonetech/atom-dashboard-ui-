import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiScissors } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { useReadOnlyMode } from "../../../../../hooks/useReadOnlyMode";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const API_SAVE = `${API_BASE_URL}/api/qa-rework/save/`;
const API_LOG = `${API_BASE_URL}/api/log-report/`;
const API_APPROVE = `${API_BASE_URL}/api/approve-report/`;
const API_REJECT = `${API_BASE_URL}/api/reject-report/`;

let _id = 0;
const nextId = () => ++_id;

const today = new Date();
const formattedDate = `${String(today.getDate()).padStart(2, "0")}-${String(
  today.getMonth() + 1,
).padStart(2, "0")}-${today.getFullYear()}`;

const emptyCard = () => ({
  partDesc: "",
  partNo: "",
  spec: "",
  nonConformance: "",
  reworkQty: "",
});

const makeRow = (card) => ({
  id: nextId(),
  partDesc: card.partDesc,
  partNo: card.partNo,
  spec: card.spec,
  nonConformance: card.nonConformance,
  reworkQty: card.reworkQty,
  okStatus: null,
  observations: Array(5).fill(""),
  inspectedBy: "",
});

const fieldBase = {
  width: "100%",
  padding: "9px 12px",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  fontSize: 13,
  color: "#111827",
  background: "#ffffff",
  fontFamily: "'Inter',sans-serif",
  boxSizing: "border-box",
  outline: "none",
};

const selectBase = {
  ...fieldBase,
  paddingRight: 26,
  WebkitAppearance: "none",
  appearance: "none",
  cursor: "pointer",
};

const TH = ({ children, colSpan, rowSpan, w, bg = "#f1f5f9" }) => (
  <th
    colSpan={colSpan}
    rowSpan={rowSpan}
    style={{
      padding: "9px 8px",
      fontWeight: 700,
      fontSize: 10,
      color: "#374151",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      textAlign: "center",
      background: bg,
      border: "1px solid #d1d5db",
      whiteSpace: "nowrap",
      width: w,
      lineHeight: 1.4,
    }}
  >
    {children}
  </th>
);

const TD = ({ children, style = {} }) => (
  <td
    style={{
      padding: "6px 5px",
      border: "1px solid #e5e7eb",
      verticalAlign: "middle",
      ...style,
    }}
  >
    {children}
  </td>
);

const SelectField = ({ value, onChange, options, placeholder, disabled }) => (
  <div style={{ position: "relative", width: "100%" }}>
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{
        ...selectBase,
        color: value ? "#111827" : "#9ca3af",
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      <option value="">{placeholder || "Select..."}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>

    {!disabled && (
      <IoIosArrowDown
        style={{
          position: "absolute",
          right: 7,
          top: "50%",
          transform: "translateY(-50%)",
          color: "#6b7280",
          fontSize: 12,
          pointerEvents: "none",
        }}
      />
    )}
  </div>
);

const LBL = {
  fontSize: 11,
  fontWeight: 700,
  color: "#111827",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: 5,
  display: "block",
};

export default function ReworkRepair() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isViewMode = Boolean(id);
   const isReadOnly = useReadOnlyMode();
  const currentUser = localStorage.getItem("username") || "Unknown User";

  const [date, setDate] = useState(formattedDate);
  const [rows, setRows] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [card, setCard] = useState(emptyCard());
  const [remark, setRemark] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [preparedBy, setPreparedBy] = useState("");

  const [backendParts, setBackendParts] = useState([]);
  const [backendSpecs, setBackendSpecs] = useState([]);

  const [approvalStatus, setApprovalStatus] = useState("Pending");
  const [reviewApprovedBy, setReviewApprovedBy] = useState("");
  const [reviewRejectedBy, setReviewRejectedBy] = useState("");
  const [reviewRemark, setReviewRemark] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const partsRes = await axios.get(
          `${API_BASE_URL}/api/master-dropdown/?filter=all_parts`,
        );

        const rawParts = partsRes.data || [];
        const groupedMap = {};

        rawParts.forEach(([pName, pNo]) => {
          if (!groupedMap[pName]) groupedMap[pName] = new Set();
          if (pNo) groupedMap[pName].add(pNo);
        });

        const formattedParts = Object.keys(groupedMap).map((k) => ({
          desc: k,
          partNos: Array.from(groupedMap[k]),
        }));

        setBackendParts(formattedParts);

        const specsRes = await axios.get(
          `${API_BASE_URL}/api/master-dropdown/?filter=spec`,
        );

        setBackendSpecs(specsRes.data || []);
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdowns();

    if (isViewMode) {
      const fetchReportData = async () => {
        try {
          const res = await axios.get(
            `${API_BASE_URL}/api/get-single-report/rework-view/${id}/`,
          );

          if (res.data.success) {
            const data = res.data.data || {};
            const statusText = data.status || "";

            console.log("VIEW REWORK DATA:", data);

            if (data.Date) {
              const parts = String(data.Date).split("-");
              if (parts.length === 3) {
                setDate(`${parts[2]}-${parts[1]}-${parts[0]}`);
              }
            }

            let st = null;
            if (data.Status && String(data.Status).trim() === "OK") st = "ok";
            if (data.Status && String(data.Status).trim() === "NOT OK")
              st = "notok";

            const obsArr = [];

            for (let k = 1; k <= 5; k++) {
              const oVal = data[`Obs ${k}`];
              obsArr.push(oVal && oVal !== "—" ? oVal : "");
            }

            setRows([
              {
                id: nextId(),
                partDesc: data["Part Name"] || "—",
                partNo: data["Part No"] || "—",
                spec: data.Spec || "—",
                nonConformance: data["Non Conformance"] || "—",
                reworkQty: data["Rework Qty"] || "",
                okStatus: st,
                observations: obsArr,
                inspectedBy:
                  data["Inspected By"] === "—" ? "" : data["Inspected By"],
              },
            ]);

            setRemark(data.Remark === "—" ? "" : data.Remark || "");

            const fullName = data.submitted_by || "Unknown User";
            setPreparedBy(fullName.split("@")[0]);

            setApprovalStatus(
              data.approval_status ||
                (statusText.startsWith("Approved by")
                  ? "Approved"
                  : statusText.startsWith("Rejected by")
                  ? "Rejected"
                  : "Pending"),
            );

            setReviewApprovedBy(
              data.review_approved_by ||
                (statusText.startsWith("Approved by")
                  ? statusText.replace("Approved by", "").trim()
                  : ""),
            );

            setReviewRejectedBy(
              data.review_rejected_by ||
                (statusText.startsWith("Rejected by")
                  ? statusText.replace("Rejected by", "").trim()
                  : ""),
            );

            setReviewRemark(
              data.review_remarks ||
                data.approval_remarks ||
                data.rejection_remark ||
                data.review_remark ||
                "",
            );
          }
        } catch (error) {
          console.error("Failed to load report data", error);
          alert("Failed to load report data.");
        }
      };

      fetchReportData();
    }

    const check = () => setIsMobile(window.innerWidth < 768);
    check();

    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, [id, isViewMode]);

  const handleAddRow = () => {
    if (isViewMode) return;

    const { partDesc, partNo, spec, nonConformance, reworkQty } = card;

    if (
      partDesc &&
      partNo &&
      spec &&
      nonConformance.trim() !== "" &&
      reworkQty !== ""
    ) {
      setRows((prev) => [...prev, makeRow(card)]);
      setCard(emptyCard());
    }
  };

  useEffect(() => {
    if (isViewMode) return;

    const { partDesc, partNo, spec, nonConformance, reworkQty } = card;

    if (
      partDesc &&
      partNo &&
      spec &&
      nonConformance.trim() !== "" &&
      reworkQty !== ""
    ) {
      const timer = setTimeout(() => {
        handleAddRow();
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [card, isViewMode]);

  const handleQtyKeyDown = (e) => {
    if (!isViewMode && e.key === "Enter") handleAddRow();
  };

  const updateCard = (field, val) => {
    if (isViewMode) return;

    setCard((prev) => {
      const next = { ...prev, [field]: val };

      if (field === "partDesc") {
        const selectedPart = backendParts.find((p) => p.desc === val);

        if (
          selectedPart &&
          selectedPart.partNos &&
          selectedPart.partNos.length > 0
        ) {
          next.partNo = selectedPart.partNos[0];
        } else {
          next.partNo = "";
        }
      }

      return next;
    });
  };

  const updateRow = (i, field, val) => {
    if (isViewMode) return;

    setRows((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, [field]: val } : r)),
    );
  };

  const updateObs = (i, j, val) => {
    if (isViewMode) return;

    setRows((prev) =>
      prev.map((r, idx) => {
        if (idx !== i) return r;

        const o = [...r.observations];
        o[j] = val;

        return { ...r, observations: o };
      }),
    );
  };

  const addObservation = (i) => {
    if (isViewMode) return;

    setRows((prev) =>
      prev.map((r, idx) =>
        idx === i ? { ...r, observations: [...r.observations, ""] } : r,
      ),
    );
  };

  const toggleStatus = (i, type) => {
    if (isViewMode) return;

    setRows((prev) =>
      prev.map((r, idx) =>
        idx === i ? { ...r, okStatus: r.okStatus === type ? null : type } : r,
      ),
    );
  };

  const removeRow = (i) => {
    if (!isViewMode) {
      setRows((prev) => prev.filter((_, idx) => idx !== i));
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
          }`,
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
          }`,
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

  if (!date || !date.includes("-")) {
    alert("Please enter valid date in DD-MM-YYYY format.");
    return;
  }

  const [day, month, year] = date.split("-");
  const dbDate = `${year}-${month}-${day}`;

  const cleanRows = rows.filter(
    (r) =>
      r.partDesc &&
      r.partNo &&
      r.spec &&
      r.nonConformance &&
      String(r.nonConformance).trim() !== ""
  );

  if (cleanRows.length === 0) {
    alert("Please add at least one complete row before saving.");
    return;
  }

  const payload = {
    date: dbDate,
    remark: remark || "",
    submitted_by: currentUser,
    items: cleanRows.map((r) => ({
      part_name: r.partDesc,
      part_no: r.partNo,
      spec: r.spec,
      non_conformance: r.nonConformance,
      rework_qty: Number(r.reworkQty || 0),
      status: r.okStatus || "",
      inspected_by: r.inspectedBy || "",
      observations: r.observations || [],
    })),
  };

  console.log("FINAL QA REWORK PAYLOAD:", payload);

  try {
    // ✅ Step 1: Save in QA rework table using unique QA URL
    const response = await axios.post(API_SAVE, payload);

    console.log("QA REWORK SAVE RESPONSE:", response.data);

    if (response.status === 201 || response.status === 200) {
      const savedRecordId =
        response.data.record_id || response.data.report_id || response.data.id;

      if (!savedRecordId) {
        alert("Rework saved but record_id not returned from backend.");
        return;
      }

      // ✅ Step 2: Create log + notification, same as working RedBin Attendance
      try {
        await axios.post(API_LOG, {
          username: currentUser,
          report_name: "QA Rework Report",
          record_id: savedRecordId,
          department_name: "Plant 2 (QA)",
          target_group: "Quality_Approvers",
        });
      } catch (logError) {
        console.error("Activity log error:", logError);
        alert("Form saved, but notification not created.");
        return;
      }

      setSaveMsg("✓ Saved to Database!");

      setRows([]);
      setCard(emptyCard());
      setRemark("");
      setDate(formattedDate);

      setTimeout(() => {
        setSaveMsg("");
        navigate(-1);
      }, 1500);
    }
  } catch (error) {
    console.error("Error saving rework:", error);

    if (error.response) {
      alert(
        `❌ Backend Error: ${
          error.response.data.error ||
          error.response.data.message ||
          JSON.stringify(error.response.data)
        }`
      );
    } else {
      alert("Error saving data. Please check backend connection.");
    }
  }
};

  const handleReset = () => {
    if (isViewMode) return;

    if (window.confirm("Are you sure you want to reset all data?")) {
      setDate(formattedDate);
      setRows([]);
      setCard(emptyCard());
      setRemark("");
      setSaveMsg("");
    }
  };

  const getFldStyle = (val) => ({
    ...fieldBase,
    background: isViewMode ? "#f1f5f9" : val ? "#f8fafc" : "#ffffff",
    color: isViewMode ? "#6b7280" : "#111827",
    cursor: isViewMode ? "not-allowed" : "text",
  });

  const maxObs =
    rows.length > 0 ? Math.max(...rows.map((r) => r.observations.length)) : 5;

  const obsCellStyle = {
    padding: "4px 2px",
    border: "1px solid #e5e7eb",
    verticalAlign: "middle",
  };

  const obsInputStyle = {
    width: "100%",
    minWidth: 32,
    padding: "6px 2px",
    border: "1px solid #d1d5db",
    borderRadius: 5,
    textAlign: "center",
    fontSize: 12,
    color: isViewMode ? "#6b7280" : "#111827",
    background: isViewMode ? "#f8fafc" : "#fff",
    fontFamily: "'Inter',sans-serif",
    outline: "none",
    boxSizing: "border-box",
    display: "block",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f0f4f8",
        fontFamily: "'Inter',sans-serif",
        padding: isMobile ? "10px 6px" : "20px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        select option { background: #fff !important; color: #111827 !important; }
        select:focus, input:focus, textarea:focus {
          outline: none !important;
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.15) !important;
        }

        .sbtn { transition: all 0.14s ease; }
        .sbtn:hover { opacity: 0.82; transform: scale(1.06); }
        .sbtn:active { transform: scale(0.96); }

        .del-btn:hover {
          background: #fef2f2 !important;
          border-color: #fca5a5 !important;
          color: #dc2626 !important;
        }

        .add-obs-btn { transition: all 0.15s ease; }
        .add-obs-btn:hover {
          background: #dbeafe !important;
          border-color: #3b82f6 !important;
          transform: scale(1.12);
        }
        .add-obs-btn:active { transform: scale(0.93); }

        @keyframes slideIn {
          from { opacity:0; transform:translateY(-8px); }
          to { opacity:1; transform:translateY(0); }
        }

        @keyframes popIn {
          from { opacity:0; transform:scale(0.6); }
          to { opacity:1; transform:scale(1); }
        }

        @keyframes fadeIn {
          from { opacity:0; transform:translateY(4px); }
          to { opacity:1; transform:translateY(0); }
        }

        .new-row { animation: slideIn 0.25s ease; }
        .obs-pop { animation: popIn 0.18s ease; }
        .save-toast { animation: fadeIn 0.25s ease; }

        .rework-table {
          border-collapse: collapse;
          width: 100%;
          table-layout: fixed;
        }

        .rework-table .col-sr { width: 38px; }
        .rework-table .col-part { width: 190px; }
        .rework-table .col-spec { width: 130px; }
        .rework-table .col-nc { width: 148px; }
        .rework-table .col-ok { width: 58px; }
        .rework-table .col-notok { width: 58px; }
        .rework-table .col-plus { width: 38px; }
        .rework-table .col-insp { width: 104px; }
        .rework-table .col-del { width: 32px; }

        .save-btn {
          height: 38px;
          padding: 0 22px;
          border-radius: 8px;
          background: ${isViewMode ? "#10b981" : "#2563eb"};
          color: #fff;
          border: none;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.15s, transform 0.12s, box-shadow 0.15s;
          box-shadow: 0 2px 8px rgba(37,99,235,0.18);
          white-space: nowrap;
        }

        .save-btn:hover {
          filter: brightness(0.9);
          box-shadow: 0 4px 14px rgba(37,99,235,0.28);
          transform: translateY(-1px);
        }

        .save-btn:active {
          filter: brightness(0.8);
          transform: scale(0.97);
          box-shadow: none;
        }

        .save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .reject-btn {
          height: 38px;
          padding: 0 22px;
          border-radius: 8px;
          background: #dc2626;
          color: #fff;
          border: none;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.15s, transform 0.12s, box-shadow 0.15s;
          box-shadow: 0 2px 8px rgba(220,38,38,0.18);
          white-space: nowrap;
        }

        .reject-btn:hover {
          filter: brightness(0.9);
          box-shadow: 0 4px 14px rgba(220,38,38,0.28);
          transform: translateY(-1px);
        }

        .reject-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .reset-btn {
          height: 38px;
          padding: 0 18px;
          border-radius: 8px;
          background: #f1f5f9;
          color: #374151;
          border: 1.5px solid #d1d5db;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.12s;
          white-space: nowrap;
        }

        .reset-btn:hover {
          background: #fee2e2;
          border-color: #fca5a5;
          color: #dc2626;
          transform: translateY(-1px);
        }

        .reset-btn:active { transform: scale(0.97); }
      `}</style>

      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* HEADER CARD */}
      <div
        style={{
          width: "100%",
          maxWidth: 1400,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
          border: "1px solid #e2e8f0",
          marginBottom: 14,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
            padding: isMobile ? "12px" : "12px 22px",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: "#f1f5f9",
                border: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 16, color: "#374151", fontWeight: 700 }}>
                ←
              </span>
            </button>

            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiScissors color="#2563eb" size={16} />
            </div>

            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: isMobile ? 14 : 16,
                  color: "#111827",
                }}
              >
                Rework / Repair Report{" "}
                {isViewMode && (
                  <span style={{ color: "#2563eb" }}>
                    (REVIEW - {approvalStatus})
                  </span>
                )}
              </div>

              <div style={{ fontSize: 10, color: "#6b7280" }}>
                Form No: AOT/F/QA/20 · Rev: 00 · Resp: Rework Operator
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#374151",
                whiteSpace: "nowrap",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              DATE :-
            </span>

            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isViewMode}
              style={{
                ...fieldBase,
                width: 118,
                fontWeight: 600,
                background: isViewMode ? "#f1f5f9" : "#fff",
                cursor: isViewMode ? "not-allowed" : "text",
              }}
            />
          </div>
        </div>

        {!isViewMode && (
          <div style={{ padding: isMobile ? "14px" : "18px 22px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr 1fr"
                  : "2.2fr 1.4fr 1.4fr 2fr 1fr",
                gap: 14,
                alignItems: "end",
              }}
            >
              <div>
                <label style={LBL}>Part Name :-</label>

                <SelectField
                  value={card.partDesc}
                  onChange={(e) => updateCard("partDesc", e.target.value)}
                  options={backendParts.map((p) => p.desc)}
                  placeholder="Select Part Name..."
                  disabled={isViewMode}
                />
              </div>

              <div>
                <label style={LBL}>Part No. :-</label>

                <input
                  type="text"
                  value={card.partNo}
                  onChange={(e) => updateCard("partNo", e.target.value)}
                  placeholder={
                    card.partDesc
                      ? "Auto-filled Part No..."
                      : "Select Part first..."
                  }
                  style={getFldStyle(card.partDesc)}
                  disabled={isViewMode}
                />
              </div>

              <div>
                <label style={LBL}>Spec. :-</label>

                <SelectField
                  value={card.spec}
                  onChange={(e) => updateCard("spec", e.target.value)}
                  options={backendSpecs}
                  placeholder="Select Spec..."
                  disabled={isViewMode}
                />
              </div>

              <div>
                <label style={LBL}>Details of Non Conformance :-</label>

                <input
                  type="text"
                  value={card.nonConformance}
                  onChange={(e) => updateCard("nonConformance", e.target.value)}
                  onBlur={handleAddRow}
                  placeholder="Type Defect Details..."
                  style={getFldStyle(card.nonConformance)}
                  disabled={isViewMode}
                />
              </div>

              <div>
                <label style={LBL}>Rework Qty. :-</label>

                <input
                  value={card.reworkQty}
                  onChange={(e) => updateCard("reworkQty", e.target.value)}
                  onKeyDown={handleQtyKeyDown}
                  onBlur={handleAddRow}
                  type="number"
                  min="0"
                  placeholder="0"
                  style={{
                    ...getFldStyle(card.reworkQty),
                    textAlign: "center",
                    fontWeight: card.reworkQty !== "" ? 600 : 400,
                  }}
                  disabled={isViewMode}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TABLE */}
      {rows.length > 0 && (
        <div
          style={{
            width: "100%",
            maxWidth: 1400,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: isMobile ? "12px" : "16px 20px" }}>
            <div
              style={{
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 13, color: "#111827" }}>
                📋 Rework Inspection Parameters
              </span>

              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  background: "#f1f5f9",
                  color: "#374151",
                  padding: "3px 10px",
                  borderRadius: 20,
                  border: "1px solid #e2e8f0",
                }}
              >
                {rows.length} Rows
              </span>
            </div>

            {!isMobile && (
              <div
                style={{
                  overflowX: "auto",
                  borderRadius: 8,
                  border: "1px solid #d1d5db",
                }}
              >
                <table className="rework-table">
                  <colgroup>
                    <col className="col-sr" />
                    <col className="col-part" />
                    <col className="col-spec" />
                    <col className="col-nc" />
                    <col className="col-ok" />
                    <col className="col-notok" />
                    {Array(maxObs)
                      .fill(null)
                      .map((_, n) => (
                        <col key={n} />
                      ))}
                    {!isViewMode && <col className="col-plus" />}
                    <col className="col-insp" />
                    {!isViewMode && <col className="col-del" />}
                  </colgroup>

                  <thead>
                    <tr>
                      <TH rowSpan={2}>
                        SR.
                        <br />
                        NO.
                      </TH>

                      <TH rowSpan={2}>
                        PART NAME /
                        <br />
                        PART NO.
                      </TH>

                      <TH rowSpan={2}>SPEC.</TH>

                      <TH rowSpan={2}>
                        DETAILS OF NON
                        <br />
                        CONFORMANCE
                      </TH>

                      <th
                        colSpan={2}
                        style={{
                          padding: "9px 8px",
                          fontWeight: 700,
                          fontSize: 10,
                          color: "#374151",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          textAlign: "center",
                          background: "#f1f5f9",
                          border: "1px solid #d1d5db",
                        }}
                      >
                        RESULT
                      </th>

                      <th
                        colSpan={isViewMode ? maxObs : maxObs + 1}
                        style={{
                          padding: "9px 12px",
                          fontWeight: 700,
                          fontSize: 10,
                          color: "#374151",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          textAlign: "center",
                          background: "#f1f5f9",
                          border: "1px solid #d1d5db",
                        }}
                      >
                        OBSERVATIONS AFTER REWORK
                      </th>

                      <TH rowSpan={2}>
                        INSPECTED
                        <br />
                        BY
                      </TH>

                      {!isViewMode && <TH rowSpan={2}></TH>}
                    </tr>

                    <tr>
                      <th
                        style={{
                          padding: "7px 4px",
                          fontWeight: 700,
                          fontSize: 10,
                          color: "#166534",
                          textAlign: "center",
                          background: "#f0fdf4",
                          border: "1px solid #d1d5db",
                        }}
                      >
                        ✓ OK
                      </th>

                      <th
                        style={{
                          padding: "7px 4px",
                          fontWeight: 700,
                          fontSize: 10,
                          color: "#991b1b",
                          textAlign: "center",
                          background: "#fff5f5",
                          border: "1px solid #d1d5db",
                        }}
                      >
                        ✕ NOT OK
                      </th>

                      {Array(maxObs)
                        .fill(null)
                        .map((_, n) => (
                          <th
                            key={n}
                            style={{
                              padding: "7px 2px",
                              fontWeight: 600,
                              fontSize: 11,
                              color: "#374151",
                              textAlign: "center",
                              background: "#f8fafc",
                              border: "1px solid #d1d5db",
                            }}
                          >
                            {n + 1}
                          </th>
                        ))}

                      {!isViewMode && (
                        <th
                          style={{
                            padding: "7px 2px",
                            background: "#f0f7ff",
                            border: "1px solid #d1d5db",
                          }}
                        ></th>
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((row, i) => {
                      const isOk = row.okStatus === "ok";
                      const isNotOk = row.okStatus === "notok";

                      return (
                        <tr
                          key={row.id}
                          className="new-row"
                          style={{
                            background: i % 2 === 0 ? "#ffffff" : "#f8fafc",
                          }}
                        >
                          <TD style={{ textAlign: "center" }}>
                            <span
                              style={{
                                fontWeight: 700,
                                fontSize: 12,
                                color: "#374151",
                              }}
                            >
                              {i + 1}
                            </span>
                          </TD>

                          <TD>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 3,
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 12,
                                  fontWeight: 600,
                                  color: "#111827",
                                  padding: "4px 6px",
                                  background: "#f1f5f9",
                                  borderRadius: 5,
                                  border: "1px solid #e2e8f0",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {row.partDesc}
                              </div>

                              <div
                                style={{
                                  fontSize: 11,
                                  color: "#4b5563",
                                  padding: "3px 6px",
                                  background: "#f9fafb",
                                  borderRadius: 5,
                                  border: "1px solid #e2e8f0",
                                }}
                              >
                                {row.partNo}
                              </div>
                            </div>
                          </TD>

                          <TD>
                            <div
                              style={{
                                fontSize: 12,
                                fontWeight: 500,
                                color: "#111827",
                                padding: "5px 6px",
                                background: "#f1f5f9",
                                borderRadius: 5,
                                border: "1px solid #e2e8f0",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {row.spec}
                            </div>
                          </TD>

                          <TD>
                            <div
                              style={{
                                fontSize: 12,
                                fontWeight: 500,
                                color: "#92400e",
                                padding: "5px 6px",
                                background: "#fef9f0",
                                borderRadius: 5,
                                border: "1px solid #fde68a",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {row.nonConformance}
                            </div>
                          </TD>

                          <TD
                            style={{
                              background: isOk ? "#f0fdf4" : "inherit",
                              textAlign: "center",
                            }}
                          >
                            <button
                              type="button"
                              className={isViewMode ? "" : "sbtn"}
                              onClick={() => toggleStatus(i, "ok")}
                              disabled={isViewMode}
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 8,
                                border: isOk
                                  ? "2px solid #16a34a"
                                  : "1.5px solid #d1fae5",
                                background: isOk ? "#dcfce7" : "#fff",
                                color: isOk ? "#16a34a" : "#bbf7d0",
                                fontSize: 18,
                                fontWeight: 800,
                                cursor: isViewMode ? "default" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto",
                                boxShadow:
                                  isOk && !isViewMode
                                    ? "0 2px 8px rgba(22,163,74,0.18)"
                                    : "none",
                              }}
                            >
                              ✓
                            </button>
                          </TD>

                          <TD
                            style={{
                              background: isNotOk ? "#fff5f5" : "inherit",
                              textAlign: "center",
                            }}
                          >
                            <button
                              type="button"
                              className={isViewMode ? "" : "sbtn"}
                              onClick={() => toggleStatus(i, "notok")}
                              disabled={isViewMode}
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 8,
                                border: isNotOk
                                  ? "2px solid #dc2626"
                                  : "1.5px solid #fecaca",
                                background: isNotOk ? "#fee2e2" : "#fff",
                                color: isNotOk ? "#dc2626" : "#fecaca",
                                fontSize: 14,
                                fontWeight: 800,
                                cursor: isViewMode ? "default" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto",
                                boxShadow:
                                  isNotOk && !isViewMode
                                    ? "0 2px 8px rgba(220,38,38,0.18)"
                                    : "none",
                              }}
                            >
                              ✕
                            </button>
                          </TD>

                          {row.observations.map((v, j) => (
                            <td key={j} style={obsCellStyle}>
                              <input
                                className={
                                  j === row.observations.length - 1 && j >= 5
                                    ? "obs-pop"
                                    : ""
                                }
                                value={v}
                                onChange={(e) =>
                                  updateObs(i, j, e.target.value)
                                }
                                disabled={isViewMode}
                                style={{
                                  ...obsInputStyle,
                                  fontWeight: v ? 600 : 400,
                                }}
                              />
                            </td>
                          ))}

                          {Array(maxObs - row.observations.length)
                            .fill(null)
                            .map((_, k) => (
                              <td
                                key={`empty-${k}`}
                                style={{
                                  ...obsCellStyle,
                                  background:
                                    i % 2 === 0 ? "#f9fafb" : "#f1f5f9",
                                }}
                              />
                            ))}

                          {!isViewMode && (
                            <td
                              style={{
                                padding: "4px 4px",
                                border: "1px solid #e5e7eb",
                                background: "#f0f7ff",
                                textAlign: "center",
                                verticalAlign: "middle",
                              }}
                            >
                              <button
                                type="button"
                                className="add-obs-btn"
                                onClick={() => addObservation(i)}
                                title="Add observation"
                                style={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: 6,
                                  border: "1.5px dashed #93c5fd",
                                  background: "#eff6ff",
                                  color: "#2563eb",
                                  cursor: "pointer",
                                  fontWeight: 800,
                                  fontSize: 14,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  margin: "0 auto",
                                }}
                              >
                                +
                              </button>
                            </td>
                          )}

                          <TD>
                            <input
                              value={row.inspectedBy || ""}
                              onChange={(e) =>
                                updateRow(i, "inspectedBy", e.target.value)
                              }
                              disabled={isViewMode}
                              placeholder="Name..."
                              style={{
                                ...fieldBase,
                                fontSize: 11,
                                padding: "5px 6px",
                                background: isViewMode ? "#f8fafc" : "#fff",
                                color: isViewMode ? "#6b7280" : "#111827",
                                cursor: isViewMode ? "not-allowed" : "text",
                              }}
                            />
                          </TD>

                          {!isViewMode && (
                            <TD style={{ textAlign: "center" }}>
                              <button
                                type="button"
                                className="del-btn"
                                onClick={() => removeRow(i)}
                                style={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: 6,
                                  border: "1px solid #e5e7eb",
                                  background: "#f9fafb",
                                  color: "#9ca3af",
                                  cursor: "pointer",
                                  fontWeight: 700,
                                  fontSize: 11,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  margin: "0 auto",
                                }}
                              >
                                ✕
                              </button>
                            </TD>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* REMARK BOX */}
            <div
              style={{
                marginTop: 16,
                padding: "14px 16px",
                background: "#f8faff",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
              }}
            >
              <label
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#111827",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 6,
                  display: "block",
                }}
              >
                Remark :-
              </label>

              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                disabled={isViewMode}
                placeholder="Write remark here..."
                rows={3}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  fontSize: 13,
                  color: isViewMode ? "#6b7280" : "#111827",
                  background: isViewMode ? "#f8fafc" : "#fff",
                  fontFamily: "'Inter',sans-serif",
                  boxSizing: "border-box",
                  outline: "none",
                  resize: "vertical",
                  lineHeight: 1.6,
                  cursor: isViewMode ? "not-allowed" : "text",
                }}
              />
            </div>

            {isViewMode && (
              <div
                style={{
                  marginTop: 16,
                  padding: "14px 16px",
                  background: "#ffffff",
                  borderRadius: 8,
                  border: "1px solid #bfdbfe",
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
                        color: "#6b7280",
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
                        color: "#2563eb",
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
                          color: "#6b7280",
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
                          color: "#16a34a",
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
                          color: "#6b7280",
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
                        color: "#6b7280",
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
                            ? "#16a34a"
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
                    fontWeight: 700,
                    color: "#2563eb",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: 6,
                    display: "block",
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
                    padding: "9px 12px",
                    border: "1px solid #bfdbfe",
                    borderRadius: 6,
                    fontSize: 13,
                    color: "#111827",
                    background: "#fff",
                    fontFamily: "'Inter',sans-serif",
                    boxSizing: "border-box",
                    outline: "none",
                    resize: "vertical",
                    lineHeight: 1.6,
                  }}
                />
              </div>
            )}

            {/* Bottom Actions */}
            <div
              style={{
                marginTop: 16,
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                flexWrap: "wrap",
                alignItems: "center",
                borderTop: "1px solid #e2e8f0",
                paddingTop: 16,
              }}
            >
              <div style={{ width: "100%" }}></div>

              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {saveMsg && (
                  <span
                    className="save-toast"
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#16a34a",
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      borderRadius: 8,
                      padding: "5px 12px",
                    }}
                  >
                    {saveMsg}
                  </span>
                )}

                {!isViewMode && (
                  <button
                    type="button"
                    className="reset-btn"
                    onClick={handleReset}
                  >
                    <svg
                      width="14"
                      height="14"
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

                {isViewMode ? !isReadOnly&& (
                  <>
                    <button
                      type="button"
                      className="save-btn"
                      onClick={handleApprove}
                      disabled={isApproving || approvalStatus === "Approved"}
                    >
                      {isApproving ? "Approving..." : "✓ Approve Report"}
                    </button>

                    <button
                      type="button"
                      className="reject-btn"
                      onClick={handleReject}
                      disabled={isRejecting || approvalStatus === "Rejected"}
                    >
                      {isRejecting ? "Rejecting..." : "✕ Reject Report"}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="save-btn"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    <svg
                      width="14"
                      height="14"
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
                    {isSaving ? "Saving..." : "Save"}
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
