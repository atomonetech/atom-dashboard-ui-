import { useState, useEffect } from "react";
import { GoPackageDependencies } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBinoculars } from "@fortawesome/free-solid-svg-icons";

let _id = 0;
const nextId = () => ++_id;

const today = new Date();
const formattedDate = `${String(today.getDate()).padStart(2, "0")}-${String(
  today.getMonth() + 1,
).padStart(2, "0")}-${today.getFullYear()}`;

const GRADES = [
  "SUH409L",
  "SS304",
  "SS316",
  "SS202",
  "MS",
  "EN8",
  "EN24",
  "HCHCr",
  "SAILMA350",
  "IS2062",
].sort((a, b) => a.localeCompare(b)); // Alphabetically sorted initial grades array

const emptyRow = () => ({
  id: nextId(),
  parameter: "",
  specification: "",
  inspMethod: "",
  observations: Array(5).fill(""),
  remark: "",
  isReadOnly: false,
});

/* ============================================================
   DESIGN TOKENS — "Calibration Certificate" theme
   ============================================================ */
const T = {
  paper: "#F7F5F1",
  card: "#FFFFFF",
  rail: "#FBFAF7",
  line: "#E4E0D6",
  lineStrong: "#CFC9BA",
  ink: "#1E2B29",
  muted: "#71807D",
  faint: "#A3AEA9",
  teal: "#0B5E54",
  tealDeep: "#073F39",
  tealSoft: "#E7F1EE",
  tealSoftLine: "#C7E0D9",
  brass: "#B9863F",
  ok: "#1F8A57",
  okBg: "#EAF7EF",
  okLine: "#BFE3CC",
  bad: "#C23B3B",
  badBg: "#FCEDEC",
  badLine: "#F2C6C3",
  font: "'DM Sans',sans-serif",
  mono: "'DM Mono',monospace",
};

const LBL = {
  fontSize: 10.5,
  fontWeight: 700,
  letterSpacing: "0.08em",
  color: T.muted,
  textTransform: "uppercase",
  marginBottom: 8,
  display: "block",
  fontFamily: T.font,
};

const SelectWrapper = ({ children, color = T.faint, disabled = false }) => (
  <div style={{ position: "relative", width: "100%" }}>
    {children}
    {!disabled && (
      <IoIosArrowDown
        style={{
          position: "absolute",
          right: 13,
          top: "50%",
          transform: "translateY(-50%)",
          color: color,
          fontSize: 13,
          pointerEvents: "none",
        }}
      />
    )}
  </div>
);

function fldStyle(v, disabled = false) {
  return {
    width: "100%",
    padding: "12px 14px",
    border: `1.5px solid ${v && !disabled ? T.teal : T.lineStrong}`,
    borderRadius: 10,
    fontSize: 13.5,
    fontWeight: v ? 600 : 500,
    background: disabled ? T.rail : T.card,
    color: disabled ? T.muted : v ? T.ink : T.faint,
    outline: "none",
    cursor: disabled ? "not-allowed" : "text",
    fontFamily: T.font,
    boxSizing: "border-box",
    transition: "all 0.15s ease",
    boxShadow: v && !disabled ? `0 0 0 3px ${T.tealSoft}` : "none",
  };
}

function selStyle(v, disabled = false) {
  return {
    width: "100%",
    padding: disabled ? "9px 10px" : "9px 30px 9px 10px",
    border: `1px solid ${v && !disabled ? T.teal : T.line}`,
    borderRadius: 7,
    fontSize: 12,
    background: disabled ? T.rail : T.card,
    color: disabled ? T.muted : v ? T.ink : T.faint,
    outline: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: T.font,
    fontWeight: v ? 600 : 400,
    WebkitAppearance: "none",
    appearance: "none",
    transition: "all 0.15s ease",
  };
}

function rkStyle(v, disabled = false) {
  return {
    width: "100%",
    padding: disabled ? "9px 10px" : "9px 30px 9px 10px",
    border: `1px solid ${
      v === "OK" ? T.okLine : v === "NOT OK" ? T.badLine : T.line
    }`,
    borderRadius: 7,
    fontSize: 12,
    background: disabled
      ? T.rail
      : v === "OK"
      ? T.okBg
      : v === "NOT OK"
      ? T.badBg
      : T.card,
    color: disabled
      ? T.muted
      : v === "OK"
      ? T.ok
      : v === "NOT OK"
      ? T.bad
      : T.faint,
    fontWeight: v ? 800 : 400,
    outline: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: T.font,
    WebkitAppearance: "none",
    appearance: "none",
    transition: "all 0.15s ease",
  };
}

function obsStyle(v, disabled = false) {
  return {
    width: "100%",
    padding: "9px 4px",
    border: `1px solid ${v && !disabled ? T.teal : T.line}`,
    borderRadius: 7,
    fontSize: 12,
    textAlign: "center",
    background: disabled ? T.rail : v ? T.tealSoft : "#FCFBF8",
    color: disabled ? T.muted : T.ink,
    fontWeight: v ? 600 : 400,
    outline: "none",
    cursor: disabled ? "not-allowed" : "text",
    fontFamily: T.font,
    boxSizing: "border-box",
    transition: "all 0.15s ease",
  };
}

const TD = ({ children, style = {} }) => (
  <td
    style={{
      padding: "14px 10px",
      fontSize: 12.5,
      textAlign: "center",
      color: T.ink,
      borderBottom: "1px solid #EFEDE6",
      ...style,
    }}
  >
    {children}
  </td>
);

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

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";
const API_URL = `${API_BASE}/api`;
const API_LOG = `${API_URL}/log-report/`;
const API_APPROVE = `${API_URL}/approve-report/`;

export default function IncomingMaterialInsp() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isViewMode = Boolean(id);
  const currentUser = localStorage.getItem("username") || "Unknown User";

  const [supplier, setSupplier] = useState("");
  const [customer, setCustomer] = useState("");
  const [selectedPartId, setSelectedPartId] = useState("");
  const [partNo, setPartNo] = useState("");
  const [date, setDate] = useState(formattedDate);
  const [grade, setGrade] = useState("");
  const [mtc, setMtc] = useState("");
  const [gaNga, setGaNga] = useState("");
  const [coilNo, setCoilNo] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [qty, setQty] = useState("");

  const [preparedBy, setPreparedBy] = useState("");
  const [checkedBy, setCheckedBy] = useState("");
  const [approvedBy, setApprovedBy] = useState("");

  const [rows, setRows] = useState([emptyRow()]);
  const [isMobile, setIsMobile] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [customersList, setCustomersList] = useState([]);
  const [partsList, setPartsList] = useState([]);

  const [methodsList, setMethodsList] = useState([]);
  const [paramsList, setParamsList] = useState([]);
  const [specsList, setSpecsList] = useState([]);

  const mtcList = ["YES", "NO", "N/A"];
  const gaNgaList = ["GA", "NGA", "N/A"];

  // 🔥 FETCH DATA EFFECT
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const custRes = await fetch(`${API_URL}/customers/`);
        if (custRes.ok) {
          const data = await custRes.json();
          // Sort Customers A-Z
          setCustomersList(sortArrayAlphabetically(data.customers));
        }

        const [specRes, methodRes, paramRes] = await Promise.all([
          fetch(`${API_URL}/master-dropdown/?filter=spec`),
          fetch(`${API_URL}/master-dropdown/?filter=method`),
          fetch(`${API_URL}/master-dropdown/?filter=parameter`),
        ]);
        
        // Sort Parameter Dropdowns A-Z
        if (specRes.ok) setSpecsList(sortArrayAlphabetically(await specRes.json()));
        if (methodRes.ok) setMethodsList(sortArrayAlphabetically(await methodRes.json()));
        if (paramRes.ok) setParamsList(sortArrayAlphabetically(await paramRes.json()));
      } catch (error) {
        console.error("Error fetching master data:", error);
      }
    };
    fetchMasterData();

    // VIEW MODE DATA FETCHING
    if (isViewMode) {
      const fetchReport = async () => {
        try {
          const res = await axios.get(
            `${API_URL}/get-single-report/incoming-inspection-view/${id}/`,
          );
          if (res.data.success) {
            const data = res.data.data;
            setSupplier(data.supplier || "");
            setCustomer(data.customer || "");
            setPartNo(data.part_no || "");

            if (data.date) {
              const parts = data.date.split("-");
              if (parts.length === 3)
                setDate(`${parts[2]}-${parts[1]}-${parts[0]}`);
            }

            setGrade(data.grade || "");
            setMtc(data.mtc || "");
            setGaNga(data.ga_nga || "");
            setCoilNo(data.coil_no || "");
            setInvoiceNo(data.invoice_no || "");
            setQty(data.qty || "");
            setPreparedBy(
              data.prepared_by || data.submitted_by?.split("@")[0] || "",
            );
            setCheckedBy(data.checked_by || "");
            setApprovedBy(data.approved_by || "");

            if (data.inspection_data && data.inspection_data.length > 0) {
              const formattedRows = data.inspection_data.map((r) => {
                const obs = Array(5).fill("");
                if (r.observations && Array.isArray(r.observations)) {
                  for (let k = 0; k < 5; k++) obs[k] = r.observations[k] || "";
                }
                return {
                  id: nextId(),
                  parameter: r.parameter || r.parameter_name || "",
                  specification: r.specification || "",
                  inspMethod: r.inspMethod || r.inspection_method || "",
                  observations: obs,
                  remark: r.remark || "",
                  isReadOnly: true,
                };
              });
              setRows(formattedRows);
            }
          }
        } catch (error) {
          console.error("Failed to load report", error);
        }
      };
      fetchReport();
    }

    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [id, isViewMode]);

  useEffect(() => {
    if (customer && !isViewMode) {
      fetch(`${API_URL}/parts/${encodeURIComponent(customer)}/`)
        .then((r) => r.json())
        .then((data) => {
          // Sort Parts List alphabetically A-Z
          setPartsList(sortArrayAlphabetically(data.parts || []));
        })
        .catch((err) => console.error(err));
    } else if (!isViewMode) {
      setPartsList([]);
      setSelectedPartId("");
      setPartNo("");
      setGrade("");
      setRows([emptyRow()]);
    }
  }, [customer, isViewMode]);

  const handleCustomerChange = (v) => {
    if (isViewMode) return;
    setCustomer(v);
    setSelectedPartId("");
    setPartNo("");
    setGrade("");
    setRows([emptyRow()]);
  };

 const handlePartChange = (e) => {
    if (isViewMode) return;
    const partId = e.target.value;
    setSelectedPartId(partId);

    // 🔥 FIX: Looks for match by ID OR by Part Name to guarantee a secure lookup
    const partData = partsList.find(
      (p) => String(p.id) === String(partId) || String(p.part_name) === String(partId)
    );

    if (partData) {
      // Auto-fill Part Number
      setPartNo(partData.part_no || "");

      let inspData = partData.inspection_data || [];

      if (typeof inspData === "string") {
        try {
          inspData = JSON.parse(inspData);
        } catch (err) {
          console.error("Error parsing inspection data:", err);
          inspData = [];
        }
      }

      let foundGrade = "";
      const newRows = [];

      if (Array.isArray(inspData)) {
        inspData.forEach((item) => {
          if (
            item.parameter_name &&
            item.parameter_name.toUpperCase() === "GRADE"
          ) {
            foundGrade = item.specification || "";
          } else {
            newRows.push({
              id: nextId(),
              parameter: item.parameter_name || "",
              specification: item.specification || "",
              inspMethod: item.inspection_method || "",
              observations: Array(5).fill(""),
              remark: "",
              isReadOnly: true,
            });
          }
        });
      }

      // Auto-fill chemical grade and map specifications matrix rows
      setGrade(foundGrade);
      setRows(newRows.length > 0 ? newRows : [emptyRow()]);
    } else {
      // Fallback fallback if no match found
      setPartNo("");
      setGrade("");
      setRows([emptyRow()]);
    }
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
  const addRow = () => !isViewMode && setRows((prev) => [...prev, emptyRow()]);
  const removeRow = (i) =>
    !isViewMode && setRows((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (isViewMode) {
      try {
        const res = await axios.post(API_APPROVE, {
          log_id: id,
          approver_username: currentUser,
        });
        if (res.status === 200) {
          alert("✅ Report Approved Successfully!");
          navigate("/notifications");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to approve report.");
      }
    } else {
      const selectedPartName =
        partsList.find((p) => String(p.id) === String(selectedPartId))
          ?.part_name || "";

      const [d, m, y] = date.split("-");
      const backendFormattedDate = `${y}-${m}-${d}`;

      const finalData = {
        supplier: supplier,
        customer: customer,
        part_name: selectedPartName,
        part_no: partNo,
        date: backendFormattedDate,
        grade: grade,
        mtc: mtc,
        ga_nga: gaNga,
        coil_no: coilNo,
        invoice_no: invoiceNo,
        qty: qty,
        prepared_by: preparedBy,
        checked_by: checkedBy,
        approved_by: approvedBy,
        inspection_data: rows,
        submitted_by: currentUser,
      };

      try {
        const response = await fetch(
          `${API_URL}/incoming-material-inspection/save/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(finalData),
          },
        );

        if (response.ok) {
          const resultData = await response.json();
          const savedRecordId = resultData.record_id;

          try {
            await axios.post(API_LOG, {
              username: currentUser,
              report_name: "Incoming Inspection",
              record_id: savedRecordId,
            });
          } catch (logErr) {
            console.error("Activity log error:", logErr);
          }

          setSaveMsg("✓ Form Data Saved!");
          setTimeout(() => {
            setSaveMsg("");
            navigate(-1);
          }, 1500);
        } else {
          const errorData = await response.json();
          console.error("Backend Validation Error:", errorData);
          alert(`Validation Failed: JSON Error`);
        }
      } catch (error) {
        console.error("Network error:", error);
        alert("Network error occurred. Please check your connection.");
      }
    }
  };

  const handleReset = () => {
    if (isViewMode) return;
    if (window.confirm("Are you sure you want to clear the form?")) {
      setSupplier("");
      setCustomer("");
      setSelectedPartId("");
      setPartNo("");
      setDate(formattedDate);
      setGrade("");
      setMtc("");
      setGaNga("");
      setCoilNo("");
      setInvoiceNo("");
      setQty("");
      setPreparedBy("");
      setCheckedBy("");
      setApprovedBy("");
      setRows([emptyRow()]);
      setSaveMsg("");
    }
  };

  const headerFilled = isViewMode || !!(supplier && customer && selectedPartId && qty);

  const grid3Top = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
    gap: isMobile ? 20 : "24px 28px",
  };
  const grid3Bottom = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr",
    gap: isMobile ? 20 : "24px 28px",
    marginTop: isMobile ? 20 : 28,
  };
  const grid4Spec = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr",
    gap: isMobile ? 20 : 24,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.paper,
        fontFamily: T.font,
        padding: isMobile ? "20px 12px" : "48px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        input:focus, select:focus { outline: none !important; border-color: ${T.teal} !important; box-shadow: 0 0 0 3px ${T.tealSoft} !important; }
        select option { background: #ffffff !important; color: ${T.ink} !important; font-weight: 400; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(4px); } to { opacity:1; transform:translateY(0); } }
        .save-toast { animation: fadeIn 0.3s ease; }
        .imi-save-btn { height: 46px; padding: 0 28px; border-radius: 11px; background: ${isViewMode ? T.ok : T.teal}; color: #fff; border: none; font-weight: 700; font-size: 13.5px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s ease; box-shadow: 0 8px 18px ${isViewMode ? "rgba(31,138,87,0.25)" : "rgba(11,94,84,0.25)"}; letter-spacing: 0.01em; font-family: ${T.font}; }
        .imi-save-btn:hover { filter: brightness(1.06); transform: translateY(-1px); }
        .imi-save-btn:active { transform: translateY(0); filter: brightness(0.97); }
        .imi-reset-btn { height: 46px; padding: 0 24px; border-radius: 11px; background: ${T.card}; color: ${T.muted}; border: 1.5px solid ${T.lineStrong}; font-weight: 600; font-size: 13.5px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s ease; font-family: ${T.font}; }
        .imi-reset-btn:hover { background: ${T.rail}; border-color: ${T.muted}; color: ${T.ink}; }
        .imi-back-btn:hover { background: ${T.tealSoftLine} !important; }
        .imi-row:hover { background: ${T.rail} !important; }
        .imi-del-btn:hover { background: ${T.bad} !important; color: #fff !important; }
        .imi-section:last-child { border-bottom: none !important; }
      `}</style>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <div style={{ width: "100%", maxWidth: 1180 }}>
        {/* TITLE BAR */}
        <div
          style={{
            display: "flex",
            alignItems: isMobile ? "flex-start" : "center",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 28,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              className="imi-back-btn"
              onClick={() => navigate(-1)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: T.tealSoft,
                border: `1px solid ${T.tealSoftLine}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                cursor: "pointer",
                color: T.tealDeep,
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 700 }}>←</span>
            </button>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: T.teal,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <GoPackageDependencies color="#EAF4F2" size={21} />
            </div>
            <div>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: isMobile ? 16 : 19,
                  color: T.ink,
                  display: "block",
                  lineHeight: 1.25,
                  letterSpacing: "-0.01em",
                }}
              >
                Incoming Material Inspection Report{" "}
                {isViewMode && (
                  <span
                    style={{
                      color: T.ok,
                      fontSize: 12,
                      fontWeight: 800,
                      marginLeft: 4,
                    }}
                  >
                    (REVIEW MODE)
                  </span>
                )}
              </span>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              alignSelf: isMobile ? "flex-end" : "center",
            }}
          >
            <label style={{ ...LBL, marginBottom: 0, fontSize: 10.5 }}>
              Date
            </label>
            <input
              type="date"
              disabled={isViewMode}
              value={date.split("-").reverse().join("-")}
              onChange={(e) => {
                const [y, m, d] = e.target.value.split("-");
                setDate(`${d}-${m}-${y}`);
              }}
              style={{
                fontFamily: T.mono,
                padding: "9px 13px",
                border: `1.5px solid ${T.lineStrong}`,
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                color: isViewMode ? T.muted : T.ink,
                background: isViewMode ? T.rail : T.card,
                outline: "none",
                cursor: isViewMode ? "not-allowed" : "text",
                width: 140,
              }}
            />
          </div>
        </div>

        {/* DOCUMENT SHEET */}
        <div
          style={{
            background: T.card,
            borderRadius: 18,
            boxShadow:
              "0 1px 2px rgba(30,43,41,0.04), 0 16px 40px rgba(30,43,41,0.06)",
            border: `1px solid ${T.line}`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 3,
              width: "100%",
              background: `linear-gradient(90deg, ${T.teal} 0%, ${T.teal} 55%, ${T.brass} 100%)`,
            }}
          />

          {/* SECTION 01 — MATERIAL SOURCE */}
          <div
            className="imi-section"
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "200px 1fr",
              borderBottom: `1px solid ${T.line}`,
            }}
          >
            {!isMobile && (
              <div
                style={{
                  padding: "36px 28px 36px 32px",
                  borderRight: `1px solid ${T.line}`,
                  background: T.rail,
                }}
              >
                <div
                  style={{
                    fontFamily: T.mono,
                    fontSize: 11,
                    color: T.brass,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    marginBottom: 8,
                  }}
                >
                  01
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: T.ink,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.3,
                  }}
                >
                  Material source
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: T.muted,
                    marginTop: 6,
                    lineHeight: 1.5,
                  }}
                >
                  Who supplied it and which part it's destined for.
                </div>
              </div>
            )}
            <div style={{ padding: isMobile ? "20px 18px" : "32px 36px" }}>
              {isMobile && (
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: T.ink,
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{ fontFamily: T.mono, color: T.brass, fontSize: 11 }}
                  >
                    01
                  </span>{" "}
                  Material source
                </div>
              )}
              <div style={grid3Top}>
                <div>
                  <label style={LBL}>Supplier Name</label>
                  <input
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    disabled={isViewMode}
                    placeholder="Enter Supplier Name"
                    style={fldStyle(supplier, isViewMode)}
                  />
                </div>
                <div>
                  <label style={LBL}>Customer Name</label>
                  {isViewMode ? (
                    <input
                      value={customer}
                      disabled
                      style={fldStyle(customer, true)}
                    />
                  ) : (
                    <SelectWrapper color={customer ? T.ink : T.faint}>
                      <select
                        value={customer}
                        onChange={(e) => handleCustomerChange(e.target.value)}
                        style={{
                          ...fldStyle(customer),
                          appearance: "none",
                          WebkitAppearance: "none",
                          MozAppearance: "none",
                          paddingRight: 36,
                        }}
                      >
                        <option value="">Select Customer...</option>
                        {customersList.map((c, idx) => (
                          <option key={idx} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </SelectWrapper>
                  )}
                </div>
                <div>
                  <label style={LBL}>Part Name</label>
                  {isViewMode ? (
                    <input
                      value={selectedPartId || "Loaded from Database"}
                      disabled
                      style={fldStyle(true, true)}
                    />
                  ) : (
                    <SelectWrapper
                      color={
                        !customer ? T.line : selectedPartId ? T.ink : T.faint
                      }
                      disabled={!customer}
                    >
                      <select
                        value={selectedPartId}
                        onChange={handlePartChange}
                        disabled={!customer}
                        style={{
                          ...fldStyle(selectedPartId, !customer),
                          appearance: "none",
                          WebkitAppearance: "none",
                          MozAppearance: "none",
                          paddingRight: 36,
                        }}
                      >
                        <option value="">
                          {customer
                            ? "Select Part..."
                            : "Select Customer First"}
                        </option>
                        {partsList.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.part_name}{" "}
                            {p.part_model ? `(${p.part_model})` : ""}
                          </option>
                        ))}
                      </select>
                    </SelectWrapper>
                  )}
                </div>
              </div>
              <div style={grid3Bottom}>
                <div>
                  <label style={LBL}>Part No.</label>
                  <input
                    value={partNo}
                    onChange={(e) => setPartNo(e.target.value)}
                    disabled={isViewMode}
                    placeholder="Enter or Auto-filled..."
                    style={fldStyle(partNo, isViewMode)}
                  />
                </div>
                <div>
                  <label style={LBL}>Coil No.</label>
                  <input
                    value={coilNo}
                    onChange={(e) => setCoilNo(e.target.value)}
                    disabled={isViewMode}
                    placeholder="Coil number"
                    style={fldStyle(coilNo, isViewMode)}
                  />
                </div>
                <div>
                  <label style={LBL}>Invoice / Challan</label>
                  <input
                    value={invoiceNo}
                    onChange={(e) => setInvoiceNo(e.target.value)}
                    disabled={isViewMode}
                    placeholder="Invoice number"
                    style={fldStyle(invoiceNo, isViewMode)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 02 — SPECIFICATION */}
          <div
            className="imi-section"
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "200px 1fr",
              borderBottom: `1px solid ${T.line}`,
            }}
          >
            {!isMobile && (
              <div
                style={{
                  padding: "36px 28px 36px 32px",
                  borderRight: `1px solid ${T.line}`,
                  background: T.rail,
                }}
              >
                <div
                  style={{
                    fontFamily: T.mono,
                    fontSize: 11,
                    color: T.brass,
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    marginBottom: 8,
                  }}
                >
                  02
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: T.ink,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.3,
                  }}
                >
                  Specification
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: T.muted,
                    marginTop: 6,
                    lineHeight: 1.5,
                  }}
                >
                  Grade and certification status for this batch.
                </div>
              </div>
            )}
            <div style={{ padding: isMobile ? "20px 18px" : "32px 36px" }}>
              {isMobile && (
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: T.ink,
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    style={{ fontFamily: T.mono, color: T.brass, fontSize: 11 }}
                  >
                    02
                  </span>{" "}
                  Specification
                </div>
              )}
              <div style={grid4Spec}>
                <div>
                  <label style={LBL}>Grade</label>
                  {isViewMode ? (
                    <input
                      value={grade}
                      disabled
                      style={fldStyle(grade, true)}
                    />
                  ) : (
                    <SelectWrapper color={grade ? T.ink : T.faint}>
                      <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        style={{
                          ...fldStyle(grade),
                          appearance: "none",
                          WebkitAppearance: "none",
                          MozAppearance: "none",
                          paddingRight: 36,
                        }}
                      >
                        <option value="">Select...</option>
                        {grade && !GRADES.includes(grade) && (
                          <option value={grade}>{grade}</option>
                        )}
                        {GRADES.map((g, idx) => (
                          <option key={idx} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </SelectWrapper>
                  )}
                </div>
                <div>
                  <label style={LBL}>MTC</label>
                  {isViewMode ? (
                    <input value={mtc} disabled style={fldStyle(mtc, true)} />
                  ) : (
                    <SelectWrapper color={mtc ? T.ink : T.faint}>
                      <select
                        value={mtc}
                        onChange={(e) => setMtc(e.target.value)}
                        style={{
                          ...fldStyle(mtc),
                          appearance: "none",
                          WebkitAppearance: "none",
                          MozAppearance: "none",
                          paddingRight: 36,
                        }}
                      >
                        <option value="">Select...</option>
                        {mtcList.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </SelectWrapper>
                  )}
                </div>
                <div>
                  <label style={LBL}>GA / NGA</label>
                  {isViewMode ? (
                    <input
                      value={gaNga}
                      disabled
                      style={fldStyle(gaNga, true)}
                    />
                  ) : (
                    <SelectWrapper color={gaNga ? T.ink : T.faint}>
                      <select
                        value={gaNga}
                        onChange={(e) => setGaNga(e.target.value)}
                        style={{
                          ...fldStyle(gaNga),
                          appearance: "none",
                          WebkitAppearance: "none",
                          MozAppearance: "none",
                          paddingRight: 36,
                        }}
                      >
                        <option value="">Select...</option>
                        {gaNgaList.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </SelectWrapper>
                  )}
                </div>
                <div>
                  <label style={LBL}>WEIGHT/NO.</label>
                  <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    disabled={isViewMode}
                    placeholder="Total Weight"
                    style={fldStyle(qty, isViewMode)}
                  />
                </div>
              </div>

              {!headerFilled && (
                <div style={{ marginTop: 28 }}>
                  <div
                    style={{
                      background: T.tealSoft,
                      border: `1.5px dashed ${T.tealSoftLine}`,
                      borderRadius: 10,
                      padding: "17px",
                      fontSize: 13,
                      color: T.tealDeep,
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    Please fill required fields (Supplier, Customer, Part Name &
                    QTY) to activate the inspection table.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 03 — INSPECTION */}
          {headerFilled && (
            <div
              className="imi-section"
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "200px 1fr",
                borderBottom: `1px solid ${T.line}`,
              }}
            >
              {!isMobile && (
                <div
                  style={{
                    padding: "36px 28px 36px 32px",
                    borderRight: `1px solid ${T.line}`,
                    background: T.rail,
                  }}
                >
                  <div
                    style={{
                      fontFamily: T.mono,
                      fontSize: 11,
                      color: T.brass,
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      marginBottom: 8,
                    }}
                  >
                    03
                  </div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: T.ink,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.3,
                  }}
                >
                  Inspection
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: T.muted,
                    marginTop: 6,
                    lineHeight: 1.5,
                  }}
                >
                  Measured values against spec, five samples per parameter.
                </div>
              </div>
            )}
            <div style={{ padding: isMobile ? "20px 18px" : "32px 36px" }}>
              <div
                style={{
                  marginBottom: 22,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: isMobile ? 14 : 15,
                    color: T.ink,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    letterSpacing: "-0.01em",
                  }}
                >
                  <span style={{ fontSize: 16, color: T.teal }}>
                    <FontAwesomeIcon icon={faBinoculars} />
                  </span>{" "}
                  Inspection Parameters
                </span>
              </div>

              <div
                style={{
                  display: "block",
                  width: "100%",
                  overflowX: "auto",
                  WebkitOverflowScrolling: "touch",
                  borderRadius: 12,
                  border: `1px solid ${T.lineStrong}`,
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: 900,
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        rowSpan={2}
                        style={{
                          width: 38,
                          padding: "14px 8px",
                          background: T.tealSoft,
                          color: T.tealDeep,
                          fontSize: 10.5,
                          fontWeight: 800,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          textAlign: "center",
                          borderBottom: `1.5px solid ${T.tealSoftLine}`,
                        }}
                      >
                        SR
                      </th>
                      <th
                        rowSpan={2}
                        style={{
                          width: 160,
                          padding: "14px 8px",
                          background: T.tealSoft,
                          color: T.tealDeep,
                          fontSize: 10.5,
                          fontWeight: 800,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          textAlign: "center",
                          borderBottom: `1.5px solid ${T.tealSoftLine}`,
                        }}
                      >
                        PARAMETER
                      </th>
                      <th
                        rowSpan={2}
                        style={{
                          width: 180,
                          padding: "14px 8px",
                          background: T.tealSoft,
                          color: T.tealDeep,
                          fontSize: 10.5,
                          fontWeight: 800,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          textAlign: "center",
                          borderBottom: `1.5px solid ${T.tealSoftLine}`,
                        }}
                      >
                        SPECIFICATION
                      </th>
                      <th
                        rowSpan={2}
                        style={{
                          width: 150,
                          padding: "14px 8px",
                          background: T.tealSoft,
                          color: T.tealDeep,
                          fontSize: 10.5,
                          fontWeight: 800,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          textAlign: "center",
                          borderBottom: `1.5px solid ${T.tealSoftLine}`,
                        }}
                      >
                        INSPECTION
                        <br />
                        METHOD
                      </th>
                      <th
                        colSpan={5}
                        style={{
                          padding: "10px 8px",
                          background: T.card,
                          color: T.tealDeep,
                          fontSize: 10.5,
                          fontWeight: 800,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          textAlign: "center",
                          borderBottom: `1px solid ${T.line}`,
                        }}
                      >
                        Observation
                      </th>
                      <th
                        rowSpan={2}
                        style={{
                          width: 100,
                          padding: "14px 8px",
                          background: T.tealSoft,
                          color: T.tealDeep,
                          fontSize: 10.5,
                          fontWeight: 800,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          textAlign: "center",
                          borderBottom: `1.5px solid ${T.tealSoftLine}`,
                        }}
                      >
                        REMARK
                      </th>
                    </tr>
                    <tr>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <th
                          key={n}
                          style={{
                            padding: "8px",
                            fontWeight: 700,
                            fontSize: 12,
                            color: T.tealDeep,
                            textAlign: "center",
                            background: T.tealSoft,
                            borderLeft: `1px solid ${T.tealSoftLine}`,
                            borderBottom: `1.5px solid ${T.tealSoftLine}`,
                            width: 60,
                            fontFamily: T.mono,
                          }}
                        >
                          {n}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr
                        key={row.id}
                        className="imi-row"
                        style={{
                          background: T.card,
                          transition: "background 0.15s",
                        }}
                      >
                        <td style={{ padding: "14px 10px", fontSize: 12.5, textAlign: "center", color: T.ink, borderBottom: "1px solid #EFEDE6" }}>
                          <span style={{ fontWeight: 700, color: T.muted, fontFamily: T.mono }}>
                            {i + 1}
                          </span>
                        </td>
                        <td style={{ padding: "14px 10px", fontSize: 12.5, textAlign: "center", color: T.ink, borderBottom: "1px solid #EFEDE6" }}>
                          {isViewMode ? (
                            <input value={row.parameter} disabled style={selStyle(true, true)} />
                          ) : (
                            <SelectWrapper color={row.parameter ? T.ink : T.faint} disabled={row.isReadOnly}>
                              <select
                                value={row.parameter}
                                onChange={(e) => updateRow(i, "parameter", e.target.value)}
                                disabled={row.isReadOnly}
                                style={selStyle(row.parameter, row.isReadOnly)}
                              >
                                <option value="">Select...</option>
                                {row.parameter && !paramsList.includes(row.parameter) && (
                                  <option value={row.parameter}>{row.parameter}</option>
                                )}
                                {paramsList.map((p, idx) => (
                                  <option key={idx} value={p}>
                                    {p}
                                  </option>
                                ))}
                              </select>
                            </SelectWrapper>
                          )}
                        </td>
                        <td style={{ padding: "14px 10px", fontSize: 12.5, textAlign: "center", color: T.ink, borderBottom: "1px solid #EFEDE6" }}>
                          {isViewMode ? (
                            <input value={row.specification} disabled style={selStyle(true, true)} />
                          ) : (
                            <SelectWrapper color={row.specification ? T.ink : T.faint} disabled={row.isReadOnly}>
                              <select
                                value={row.specification}
                                onChange={(e) => updateRow(i, "specification", e.target.value)}
                                disabled={row.isReadOnly}
                                style={selStyle(row.specification, row.isReadOnly)}
                              >
                                <option value="">Select...</option>
                                {row.specification && !specsList.includes(row.specification) && (
                                  <option value={row.specification}>{row.specification}</option>
                                )}
                                {specsList.map((s, idx) => (
                                  <option key={idx} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            </SelectWrapper>
                          )}
                        </td>
                        <td style={{ padding: "14px 10px", fontSize: 12.5, textAlign: "center", color: T.ink, borderBottom: "1px solid #EFEDE6" }}>
                          {isViewMode ? (
                            <input value={row.inspMethod} disabled style={selStyle(true, true)} />
                          ) : (
                            <SelectWrapper color={row.inspMethod ? T.ink : T.faint} disabled={row.isReadOnly}>
                              <select
                                value={row.inspMethod}
                                onChange={(e) => updateRow(i, "inspMethod", e.target.value)}
                                disabled={row.isReadOnly}
                                style={selStyle(row.inspMethod, row.isReadOnly)}
                              >
                                <option value="">Select...</option>
                                {row.inspMethod && !methodsList.includes(row.inspMethod) && (
                                  <option value={row.inspMethod}>{row.inspMethod}</option>
                                )}
                                {methodsList.map((m, idx) => (
                                  <option key={idx} value={m}>
                                    {m}
                                  </option>
                                ))}
                              </select>
                            </SelectWrapper>
                          )}
                        </td>
                        {row.observations.map((v, j) => (
                          <td key={j} style={{ padding: "14px 10px", fontSize: 12.5, textAlign: "center", color: T.ink, borderBottom: "1px solid #EFEDE6" }}>
                            <input
                              value={v}
                              disabled={isViewMode}
                              onChange={(e) => updateObs(i, j, e.target.value)}
                              style={obsStyle(v, isViewMode)}
                            />
                          </td>
                        ))}
                        <td style={{ padding: "14px 10px", fontSize: 12.5, textAlign: "center", color: T.ink, borderBottom: "1px solid #EFEDE6" }}>
                          {isViewMode ? (
                            <div style={rkStyle(row.remark, true)}>{row.remark || "—"}</div>
                          ) : (
                            <SelectWrapper
                              color={
                                row.remark === "OK" ? T.ok : row.remark === "NOT OK" ? T.bad : T.faint
                              }
                            >
                              <select
                                value={row.remark}
                                onChange={(e) => updateRow(i, "remark", e.target.value)}
                                style={rkStyle(row.remark, false)}
                              >
                                <option value="">—</option>
                                <option value="OK">OK</option>
                                <option value="NOT OK">NOT OK</option>
                              </select>
                            </SelectWrapper>
                          )}
                        </td>
                        {!isViewMode && (
                          <td style={{ padding: "14px 10px", fontSize: 12.5, textAlign: "center", color: T.ink, borderBottom: "1px solid #EFEDE6" }}>
                            {rows.length > 1 && !row.isReadOnly && (
                              <button
                                className="imi-del-btn"
                                onClick={() => removeRow(i)}
                                style={{
                                  width: 27,
                                  height: 27,
                                  borderRadius: 6,
                                  border: `1px solid ${T.badLine}`,
                                  background: T.badBg,
                                  color: T.bad,
                                  cursor: "pointer",
                                  fontWeight: 700,
                                  fontSize: 14,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  margin: "0 auto",
                                  transition: "all 0.2s",
                                }}
                              >
                                ×
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {!isViewMode && (
                 <button onClick={addRow} style={{ width: "100%", padding: "12px", borderRadius: 8, border: "1.5px dashed #94a3b8", background: "#f8fafc", color: "#2563eb", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", marginTop: 20, transition: "all 0.2s" }}>
                    ＋ Add Manual Parameter Row
                 </button>
              )}
            </div>
          </div>
        )}

        {/* SECTION 04 — SIGN-OFF */}
        {headerFilled && (
          <div
            style={{
              background: T.rail,
              padding: isMobile ? "22px 18px" : "32px 36px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: 24,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: isMobile ? "100%" : 220 }}>
                <label style={LBL}>Prepared By</label>
                <input
                  value={preparedBy}
                  onChange={(e) => setPreparedBy(e.target.value)}
                  disabled={isViewMode}
                  placeholder="Name / Sign"
                  style={fldStyle(preparedBy, isViewMode)}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {saveMsg && (
                  <span
                    className="save-toast"
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: T.ok,
                      background: T.okBg,
                      border: `1px solid ${T.okLine}`,
                      borderRadius: 8,
                      padding: "9px 17px",
                    }}
                  >
                    {saveMsg}
                  </span>
                )}
                {!isViewMode && (
                  <button className="imi-reset-btn" onClick={handleReset}>
                    Reset Form
                  </button>
                )}
                <button className="imi-save-btn" onClick={handleSave}>
                  {isViewMode ? "✓ Approve Report" : "Save Report"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: 18,
          fontSize: 11,
          color: T.faint,
          fontFamily: T.mono,
          letterSpacing: "0.03em",
        }}
      >
        incoming material inspection · quality assurance · calibrated record
      </div>
    </div>
  </div>
  );
}