import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useReadOnlyMode } from "../../../../../hooks/useReadOnlyMode";
import {
  ArrowLeft,
  Calendar,
  Package,
  Wrench,
  Layers,
  CheckCircle,
  XCircle,
  Gauge,
  ClipboardList,
  User,
  MessageSquare,
  RotateCcw,
  Send,
  Hash,
  Loader2,
  Check,
  X,
} from "lucide-react";

// Backend URL
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

/* ─── tokens ─────────────────────────────────────────────────── */
const C = {
  pageBg: "#f5f5f0",
  white: "#ffffff",
  red: "#b91c1c",
  redDark: "#991b1b",
  redHdr: "#b91c1c",
  redLight: "#fef2f2",
  redBorder: "#fca5a5",
  border: "#e2e2de",
  borderFoc: "#b91c1c",
  text: "#1a1a1a",
  textMid: "#6b7280",
  textLight: "#9ca3af",
  inputBg: "#ffffff",
  inputHov: "#fafaf8",
  greenLight: "#f0fdf4",
  greenBorder: "#86efac",
  green: "#16a34a",
  greenDark: "#15803d",
};

/* ─── shared input style ─────────────────────────────────────── */
const inputBase = {
  width: "100%",
  padding: "11px 14px",
  fontSize: 14,
  fontWeight: 400,
  background: C.inputBg,
  color: C.text,
  border: `1.5px solid ${C.border}`,
  borderRadius: 6,
  outline: "none",
  fontFamily: "inherit",
  appearance: "none",
  transition: "border-color .15s, box-shadow .15s",
};

const StyledInput = ({ style = {}, readOnly, ...props }) => (
  <input
    readOnly={readOnly}
    style={{
      ...inputBase,
      ...(readOnly
        ? { background: "#f9f9f7", color: C.textMid, cursor: "not-allowed" }
        : {}),
      ...style,
    }}
    onFocus={(e) => {
      if (!readOnly) {
        e.target.style.borderColor = C.borderFoc;
        e.target.style.boxShadow = "0 0 0 3px rgba(185,28,28,.1)";
      }
    }}
    onBlur={(e) => {
      e.target.style.borderColor = style.borderColor || C.border;
      e.target.style.boxShadow = "none";
    }}
    {...props}
  />
);

const StyledSelect = ({ disabled, style = {}, children, ...props }) => (
  <select
    disabled={disabled}
    style={{
      ...inputBase,
      background: disabled ? "#f9f9f7" : C.inputBg,
      color: disabled ? C.textLight : C.text,
      cursor: disabled ? "not-allowed" : "pointer",
      borderColor: disabled ? C.border : C.border,
      ...style,
    }}
    onFocus={(e) => {
      if (!disabled) {
        e.target.style.borderColor = C.borderFoc;
        e.target.style.boxShadow = "0 0 0 3px rgba(185,28,28,.1)";
      }
    }}
    onBlur={(e) => {
      e.target.style.borderColor = C.border;
      e.target.style.boxShadow = "none";
    }}
    {...props}
  >
    {children}
  </select>
);

/* ─── label ──────────────────────────────────────────────────── */
const FieldLabel = ({ icon: Icon, children, iconColor = C.red }) => (
  <div
    style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}
  >
    {Icon && <Icon size={12} color={iconColor} strokeWidth={2.5} />}
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: ".12em",
        textTransform: "uppercase",
        color: C.textMid,
      }}
    >
      {children}
    </span>
  </div>
);

/* ─── section heading ────────────────────────────────────────── */
const SectionHead = ({
  icon: Icon,
  label,
  color = C.red,
  borderColor = "#fca5a5",
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      borderBottom: `2px solid ${borderColor}`,
      paddingBottom: 8,
      marginBottom: 16,
    }}
  >
    {Icon && <Icon size={15} color={color} strokeWidth={2.5} />}
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: ".14em",
        textTransform: "uppercase",
        color: C.text,
      }}
    >
      {label}
    </span>
  </div>
);

const getItemText = (item) => {
  if (!item) return "";
  return typeof item === "string"
    ? item
    : item.name || item.operation || item.part_name || "";
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

/* ─── main component ─────────────────────────────────────────── */
const For_M_Change_Ins_Form = () => {
  const navigate = useNavigate();
  const { id } = useParams();
   const isReadOnly = useReadOnlyMode();

  const [formDate, setFormDate] = useState("");

  useEffect(() => {
    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, "0")}.${String(
      now.getMonth() + 1
    ).padStart(2, "0")}.${now.getFullYear()}`;
    setFormDate(formattedDate);
  }, []);

  const initialFormState = {
    partName: "",
    partNo: "",
    operation: "",
    lotQty: "",
    okQty: "",
    rejQty: "",
    paramSpec: "",
    before: ["", "", "", "", ""],
    after: ["", "", "", "", ""],
    inspBy: "",
    remarks: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const [partsList, setPartsList] = useState([]);
  const [operationList, setOperationList] = useState([]);
  const [preparedBy, setPreparedBy] = useState("");

  const [approvalStatus, setApprovalStatus] = useState("Pending");
  const [approvedBy, setApprovedBy] = useState("");
  const [rejectedBy, setRejectedBy] = useState("");
  const [reviewRemark, setReviewRemark] = useState("");

  // 🔥 FETCH REPORT DATA IF ID EXISTS (VIEW/APPROVE MODE)
  useEffect(() => {
    if (id) {
      const fetchReportData = async () => {
        setIsLoading(true);

        try {
          const response = await axios.get(
            `${BASE_URL}/api/get-single-production-report/four-m-inspection/${id}/`
          );

          if (response.data.success) {
            const data = response.data.data;
            const statusText = data.status || "";

            setFormData({
              partName: data.partName || data.part_name || "",
              partNo: data.partNo || data.part_no || "",
              operation: data.operation || "",
              lotQty: data.lotQty || data.lot_qty || "",
              okQty: data.okQty || data.ok_qty || "",
              rejQty: data.rejQty || data.rej_qty || "",
              paramSpec: data.parameterSpecs || data.parameter_specs || "",
              before: [
                data.before_1 || "",
                data.before_2 || "",
                data.before_3 || "",
                data.before_4 || "",
                data.before_5 || "",
              ],
              after: [
                data.after_1 || "",
                data.after_2 || "",
                data.after_3 || "",
                data.after_4 || "",
                data.after_5 || "",
              ],
              inspBy: data.inspectedBy || data.inspected_by || "",
              remarks:
                data.form_remarks ||
                data.inspection_remarks ||
                data.report_remarks ||
                data.remarks ||
                "",
            });

            setPreparedBy(data.submitted_by || data.prepared_by || "");

            setApprovalStatus(
              data.approval_status ||
                (statusText.startsWith("Approved by")
                  ? "Approved"
                  : statusText.startsWith("Rejected by")
                  ? "Rejected"
                  : "Pending")
            );

            setApprovedBy(
              data.approved_by ||
                (statusText.startsWith("Approved by")
                  ? statusText.replace("Approved by", "").trim()
                  : "")
            );

            setRejectedBy(
              data.rejected_by ||
                (statusText.startsWith("Rejected by")
                  ? statusText.replace("Rejected by", "").trim()
                  : "")
            );

            setReviewRemark(
              data.review_remarks ||
                data.approval_remarks ||
                data.rejection_remark ||
                data.remark ||
                data.remarks ||
                ""
            );

            const dateStr = data.date || data.inspection_date;
            if (dateStr) {
              const parts = dateStr.split("-");
              if (parts.length === 3) {
                setFormDate(`${parts[2]}.${parts[1]}.${parts[0]}`);
              }
            }

            // Pre-fetch operations
            const pName = data.partName || data.part_name;
            if (pName) {
              axios
                .get(
                  `${BASE_URL}/api/master-dropdown/?filter=operations_by_part&part=${encodeURIComponent(
                    pName
                  )}`
                )
                .then((res) =>
                  setOperationList(sortArrayAlphabetically(res.data))
                )
                .catch((err) => console.error(err));
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

  useEffect(() => {
    fetch(`${BASE_URL}/api/master-dropdown/?filter=all_parts`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPartsList(
            sortArrayAlphabetically(
              data.map((i) => ({ part_name: i[0], part_no: i[1] }))
            )
          );
        }
      })
      .catch((err) => console.error("Error fetching parts:", err));
  }, []);

  const handleChange = (e) => {
    if (id) return;

    const { name, value } = e.target;

    if (name === "partName") {
      const sel = partsList.find((p) => p.part_name === value);

      setFormData((prev) => ({
        ...prev,
        partName: value,
        partNo: sel?.part_no || "",
        operation: "",
      }));

      if (value) {
        fetch(
          `${BASE_URL}/api/master-dropdown/?filter=operations_by_part&part=${encodeURIComponent(
            value
          )}`
        )
          .then((r) => r.json())
          .then((data) => setOperationList(sortArrayAlphabetically(data)))
          .catch((err) => console.error("Error fetching operations:", err));
      } else {
        setOperationList([]);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (section, index, value) => {
    if (id) return;

    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].map((it, i) => (i === index ? value : it)),
    }));
  };

  const handleReset = () => {
    if (id) return;

    setFormData(initialFormState);
    setOperationList([]);
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

    if (!reviewRemark.trim()) {
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

    if (id) return;

    if (!formData.partName || !formData.partNo || !formData.operation) {
      alert("Part Name, Part No, and Operation are required.");
      return;
    }

    const payload = {
      part_name: formData.partName,
      part_no: formData.partNo,
      operation: formData.operation,
      lot_qty: formData.lotQty ? parseInt(formData.lotQty) : null,
      ok_qty: formData.okQty ? parseInt(formData.okQty) : null,
      rej_qty: formData.rejQty ? parseInt(formData.rejQty) : null,
      parameter_specs: formData.paramSpec,
      before_1: formData.before[0],
      before_2: formData.before[1],
      before_3: formData.before[2],
      before_4: formData.before[3],
      before_5: formData.before[4],
      after_1: formData.after[0],
      after_2: formData.after[1],
      after_3: formData.after[2],
      after_4: formData.after[3],
      after_5: formData.after[4],
      inspected_by: formData.inspBy,
      remarks: formData.remarks,

      // ✅ Backend auto_log_report ke liye username
      submitted_by:
        localStorage.getItem("username") || preparedBy || "Unknown User",
    };

    setIsLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/save-4m-change/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert(result.message || "Saved successfully!");
        handleReset();
      } else {
        alert("Error: " + (result.error || "Check console."));
      }
    } catch (err) {
      alert("Cannot reach server. Make sure Django is running.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── styles shared across numbered fields ── */
  const numBadgeBase = {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
    fontSize: 10,
    fontWeight: 700,
    padding: "1px 6px",
    borderRadius: "0 0 4px 0",
  };

  /* ── shared styling blueprint for compact review controls ── */
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
      style={{
        minHeight: "100vh",
        background: C.pageBg,
        padding: "28px 16px",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        {/* ── back button ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: C.white,
              border: `1.5px solid ${C.redBorder}`,
              color: C.red,
              padding: "8px 16px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: 4,
              fontFamily: "inherit",
              transition: "background .15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = C.redLight)
            }
            onMouseLeave={(e) => (e.currentTarget.style.background = C.white)}
          >
            <ArrowLeft size={13} />
            Back
          </button>

          {id && (
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color:
                  approvalStatus === "Approved"
                    ? C.green
                    : approvalStatus === "Rejected"
                    ? C.red
                    : C.textMid,
                background:
                  approvalStatus === "Approved"
                    ? C.greenLight
                    : approvalStatus === "Rejected"
                    ? C.redLight
                    : "#f9fafb",
                border:
                  approvalStatus === "Approved"
                    ? `1px solid ${C.greenBorder}`
                    : approvalStatus === "Rejected"
                    ? `1px solid ${C.redBorder}`
                    : `1px solid ${C.border}`,
                padding: "8px 14px",
                borderRadius: 4,
              }}
            >
              {approvalStatus}
            </div>
          )}
        </div>

        {/* ── main card ── */}
        <div
          style={{
            background: C.white,
            borderRadius: 8,
            border: `1px solid ${C.border}`,
            overflow: "hidden",
            boxShadow:
              "0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.04)",
          }}
        >
          {/* ── header ── */}
          <div
            style={{
              background: C.redHdr,
              padding: "20px 28px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <ClipboardList
                size={22}
                color="rgba(255,255,255,.9)"
                strokeWidth={2}
              />

              <h1
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: ".18em",
                  textTransform: "uppercase",
                }}
              >
                {id
                  ? "4M Change Inspection Report (REVIEW)"
                  : "4M Change Inspection Report"}
              </h1>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: "rgba(0,0,0,.2)",
                border: "1px solid rgba(255,255,255,.25)",
                padding: "7px 16px",
                borderRadius: 4,
              }}
            >
              <Calendar size={14} color="#fff" />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: ".06em",
                }}
              >
                {formDate}
              </span>
            </div>
          </div>

          {/* ── form body ── */}
          <form onSubmit={handleSubmit}>
            <div style={{ padding: "28px 28px 24px" }}>
              {/* Row 1 — Part Name / Part No */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                  marginBottom: 20,
                }}
              >
                <div>
                  <FieldLabel icon={Package}>
                    Part Name <span style={{ color: C.red }}>*</span>
                  </FieldLabel>

                  <StyledSelect
                    name="partName"
                    value={formData.partName}
                    onChange={handleChange}
                    disabled={!!id}
                  >
                    <option value="">Select Part Name</option>

                    {partsList.map((p, i) => (
                      <option key={i} value={p.part_name}>
                        {p.part_name}
                      </option>
                    ))}

                    {id &&
                      formData.partName &&
                      !partsList.some(
                        (p) => p.part_name === formData.partName
                      ) && (
                        <option value={formData.partName}>
                          {formData.partName}
                        </option>
                      )}
                  </StyledSelect>
                </div>

                <div>
                  <FieldLabel icon={Hash}>
                    Part No. <span style={{ color: C.red }}>*</span>
                  </FieldLabel>

                  <StyledInput
                    type="text"
                    name="partNo"
                    value={formData.partNo}
                    readOnly
                    placeholder="Auto-filled part number"
                  />
                </div>
              </div>

              {/* Row 2 — Operation */}
              <div style={{ marginBottom: 24 }}>
                <FieldLabel icon={Wrench}>
                  Operation <span style={{ color: C.red }}>*</span>
                </FieldLabel>

                <StyledSelect
                  name="operation"
                  value={formData.operation}
                  onChange={handleChange}
                  disabled={!!id || (!id && !formData.partName)}
                >
                  <option value="">Select Operation</option>

                  {operationList.map((op, i) => (
                    <option key={i} value={op}>
                      {op}
                    </option>
                  ))}

                  {id &&
                    formData.operation &&
                    !operationList.includes(formData.operation) && (
                      <option value={formData.operation}>
                        {formData.operation}
                      </option>
                    )}
                </StyledSelect>
              </div>

              {/* Row 3 — Quantities */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0,1fr))",
                  gap: 16,
                  marginBottom: 28,
                }}
              >
                <div>
                  <FieldLabel icon={Layers}>Lot Qty</FieldLabel>
                  <StyledInput
                    type="number"
                    name="lotQty"
                    value={formData.lotQty}
                    onChange={handleChange}
                    readOnly={!!id}
                    placeholder="e.g. 100"
                  />
                </div>

                <div>
                  <FieldLabel icon={CheckCircle} iconColor={C.green}>
                    OK Qty
                  </FieldLabel>

                  <StyledInput
                    type="number"
                    name="okQty"
                    value={formData.okQty}
                    onChange={handleChange}
                    readOnly={!!id}
                    placeholder="e.g. 95"
                    style={{
                      borderColor: C.greenBorder,
                      background: id ? "#f9f9f7" : C.greenLight,
                    }}
                  />
                </div>

                <div>
                  <FieldLabel icon={XCircle}>Rej. Qty</FieldLabel>

                  <StyledInput
                    type="number"
                    name="rejQty"
                    value={formData.rejQty}
                    onChange={handleChange}
                    readOnly={!!id}
                    placeholder="e.g. 5"
                    style={{
                      borderColor: C.redBorder,
                      background: id ? "#f9f9f7" : C.redLight,
                    }}
                  />
                </div>

                <div>
                  <FieldLabel icon={Gauge}>Parameter / Specs</FieldLabel>

                  <StyledInput
                    type="text"
                    name="paramSpec"
                    value={formData.paramSpec}
                    onChange={handleChange}
                    readOnly={!!id}
                    placeholder="Enter specs"
                  />
                </div>
              </div>

              {/* Row 4 — Before */}
              <SectionHead
                icon={Layers}
                label="Before (Retroactive)"
                color={C.red}
                borderColor={C.redBorder}
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, minmax(0,1fr))",
                  gap: 12,
                  marginBottom: 28,
                }}
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} style={{ position: "relative", paddingTop: 10 }}>
                    <span
                      style={{
                        ...numBadgeBase,
                        background: C.redLight,
                        color: C.red,
                        border: `1px solid ${C.redBorder}`,
                      }}
                    >
                      {i + 1}
                    </span>

                    <StyledInput
                      type="text"
                      value={formData.before[i]}
                      onChange={(e) =>
                        handleArrayChange("before", i, e.target.value)
                      }
                      readOnly={!!id}
                      placeholder={`Value ${i + 1}`}
                    />
                  </div>
                ))}
              </div>

              {/* Row 5 — After */}
              <SectionHead
                icon={CheckCircle}
                label="After / Setup Approval"
                color={C.green}
                borderColor={C.greenBorder}
              />

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, minmax(0,1fr))",
                  gap: 12,
                  marginBottom: 28,
                }}
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} style={{ position: "relative", paddingTop: 10 }}>
                    <span
                      style={{
                        ...numBadgeBase,
                        background: C.greenLight,
                        color: C.green,
                        border: `1px solid ${C.greenBorder}`,
                      }}
                    >
                      {i + 1}
                    </span>

                    <StyledInput
                      type="text"
                      value={formData.after[i]}
                      onChange={(e) =>
                        handleArrayChange("after", i, e.target.value)
                      }
                      readOnly={!!id}
                      placeholder={`Value ${i + 1}`}
                      style={{ borderColor: C.greenBorder }}
                    />
                  </div>
                ))}
              </div>

              {/* Row 6 — Inspector & Remarks */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                  marginBottom: 24,
                }}
              >
                <div>
                  <FieldLabel icon={User}>Insp. By</FieldLabel>

                  <StyledInput
                    type="text"
                    name="inspBy"
                    value={formData.inspBy}
                    onChange={handleChange}
                    readOnly={!!id}
                    placeholder="Inspector name"
                  />
                </div>

                <div>
                  <FieldLabel icon={MessageSquare}>Remarks</FieldLabel>

                  <StyledInput
                    type="text"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    readOnly={!!id}
                    placeholder="Any remarks"
                  />
                </div>
              </div>

              {/* Divider */}
              <div
                style={{
                  height: 1,
                  background: C.border,
                  margin: "8px 0 24px",
                }}
              />

              {/* ─── Bottom Core Module Block ─── */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  background: "#fafaf8",
                  padding: "20px",
                  borderRadius: "6px",
                  border: `1px solid ${C.border}`,
                }}
              >
                {/* Modern Dynamic Extended Review Remarks Area */}
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
                      Approval / Rejection Remark
                    </div>

                    <textarea
                      value={reviewRemark}
                      onChange={(e) => setReviewRemark(e.target.value)}
                      readOnly={approvalStatus !== "Pending"}
                      rows={4}
                      placeholder="Enter detailed validation feedback or clear reasons for rejection here..."
                      style={{
                        ...inputBase,
                        resize: "vertical",
                        minHeight: 110,
                        padding: "12px",
                        lineHeight: "1.5",
                        borderColor: approvalStatus !== "Pending" ? C.border : C.borderFoc,
                        background: approvalStatus !== "Pending" ? "#f9f9f7" : C.inputBg,
                      }}
                    />
                  </div>
                )}

                {/* Footer Dynamic Actions Stack Layout */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  {/* Meta Group Alignment */}
                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      flexWrap: "wrap",
                      flexGrow: 1,
                    }}
                  >
                    {/* Prepared by */}
                    <div style={{ minWidth: 200, flexGrow: 1, maxWidth: 300 }}>
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

                      <StyledInput
                        type="text"
                        value={preparedBy}
                        onChange={(e) => setPreparedBy(e.target.value)}
                        readOnly={!!id}
                        placeholder="Enter name"
                      />
                    </div>

                    {id && approvedBy && (
                      <div style={{ minWidth: 200, flexGrow: 1, maxWidth: 300 }}>
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
                          Approved By
                        </div>

                        <StyledInput
                          type="text"
                          value={approvedBy}
                          readOnly
                          placeholder="Approved by"
                        />
                      </div>
                    )}

                    {id && rejectedBy && (
                      <div style={{ minWidth: 200, flexGrow: 1, maxWidth: 300 }}>
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
                          Rejected By
                        </div>

                        <StyledInput
                          type="text"
                          value={rejectedBy}
                          readOnly
                          placeholder="Rejected by"
                        />
                      </div>
                    )}
                  </div>

                  {/* Operational Controls Block Layout */}
                    {!isReadOnly && (
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    {id ? (
                      <>
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
                      <>
                        {/* Reset */}
                        <button
                          type="button"
                          onClick={handleReset}
                          disabled={isLoading}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            background: C.white,
                            border: `2px solid #d1d5db`,
                            color: "#374151",
                            padding: "11px 24px",
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: ".1em",
                            textTransform: "uppercase",
                            borderRadius: 6,
                            cursor: isLoading ? "not-allowed" : "pointer",
                            fontFamily: "inherit",
                            opacity: isLoading ? 0.5 : 1,
                            transition: "all .15s",
                          }}
                          onMouseEnter={(e) => {
                            if (!isLoading) {
                              e.currentTarget.style.background = "#f9fafb";
                              e.currentTarget.style.borderColor = "#9ca3af";
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = C.white;
                            e.currentTarget.style.borderColor = "#d1d5db";
                          }}
                        >
                          <RotateCcw size={14} />
                          Reset Form
                        </button>

                        {/* Submit */}
                        <button
                          type="submit"
                          disabled={isLoading}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            background: isLoading ? C.redDark : C.red,
                            border: "none",
                            color: "#fff",
                            padding: "11px 28px",
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: ".1em",
                            textTransform: "uppercase",
                            borderRadius: 6,
                            cursor: isLoading ? "not-allowed" : "pointer",
                            fontFamily: "inherit",
                            transition: "background .15s",
                            boxShadow: "0 2px 8px rgba(185,28,28,.35)",
                          }}
                          onMouseEnter={(e) => {
                            if (!isLoading) {
                              e.currentTarget.style.background = C.redDark;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isLoading) {
                              e.currentTarget.style.background = C.red;
                            }
                          }}
                        >
                          {isLoading ? (
                            <>
                              <Loader2
                                size={14}
                                style={{ animation: "spin 1s linear infinite" }}
                              />
                              Submitting…
                            </>
                          ) : (
                            <>
                              <Send size={14} />
                              Submit Report
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                    )}
                </div>
              </div>
            </div>
          </form>
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
};

export default For_M_Change_Ins_Form;