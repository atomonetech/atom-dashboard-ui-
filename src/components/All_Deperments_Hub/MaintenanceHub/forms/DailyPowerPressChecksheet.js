import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  successAlert,
  errorAlert,
  warningAlert,
  infoAlert,
  confirmAlert,
} from "../../../../utils/alertUtils";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const checkData = [
  {
    sNo: 1,
    checkPoint: "Press Clean",
    subPoints: [
      {
        specification: "No Oil, No Stain Etc.",
        checkingMethod: "Visual Check",
      },
    ],
  },
  {
    sNo: 2,
    checkPoint: "Air Pressure",
    subPoints: [
      {
        specification: "Balance Pressure",
        checkingMethod: "Pressure Gauge",
        hasInput: true,
      },
      {
        specification: "Hyd. Overload Pressure",
        checkingMethod: "Pressure Gauge",
        hasInput: true,
      },
      {
        specification: "Clutch Pressure",
        checkingMethod: "Pressure Gauge",
        hasInput: true,
      },
      {
        specification: "Cushion Pressure",
        checkingMethod: "Pressure Gauge",
        hasInput: true,
      },
      {
        specification: "FRL Unit Pressure",
        checkingMethod: "Pressure Gauge",
        hasInput: true,
      },
    ],
  },
  {
    sNo: 3,
    checkPoint: "Check Grease Level",
    subPoints: [
      {
        specification: "As Per Grease Pump",
        checkingMethod: "Visual Check",
      },
    ],
  },
  {
    sNo: 4,
    checkPoint: "Nut Bolt Check",
    subPoints: [
      {
        specification: "All Nut Bolt Should Be Tight",
        checkingMethod: "Wrench / Spanner",
      },
    ],
  },
  {
    sNo: 5,
    checkPoint: "Electric Wiring Check",
    subPoints: [
      {
        specification: "No Damage / Broken Wire In Machine",
        checkingMethod: "Visual Check",
      },
    ],
  },
  {
    sNo: 6,
    checkPoint: "Stroke Button Check Double Handed",
    subPoints: [
      {
        specification: "Double Handed Button Should Be Work Properly",
        checkingMethod: "Double Hand Check",
      },
    ],
  },
  {
    sNo: 7,
    checkPoint: "Photo Electric Guard Check",
    subPoints: [
      {
        specification: "Photo Sensor Guard Should Be Work Properly",
        checkingMethod: "PLC Display",
      },
    ],
  },
  {
    sNo: 8,
    checkPoint: "Stopping Of Slide At TDC",
    subPoints: [
      {
        specification: "Stroke Always Stop At TDC In Single Mode",
        checkingMethod: "Visual Check",
      },
    ],
  },
  {
    sNo: 9,
    checkPoint: "V-Belt Check",
    subPoints: [
      {
        specification: "Belt Should Not Be Damaged / Wear Out Condition",
        checkingMethod: "Visual Check",
      },
    ],
  },
  {
    sNo: 10,
    checkPoint: "Pressure Gauge",
    subPoints: [
      {
        specification: "Working Condition / Calibration Due.",
        checkingMethod: "Visual Check / Calib. Sticker",
      },
    ],
  },
];

const UNITS = ["bar", "kg/cm²", "PSI", "MPa"];

const PLANT_MAP = {
  "Plant 1": "plant_1",
  "Plant 2": "plant_2",
};

const REVERSE_PLANT_MAP = {
  plant_1: "Plant 1",
  plant_2: "Plant 2",
};

const buildChecks = () =>
  checkData.flatMap((item) =>
    item.subPoints.map((_, spi) => ({
      sNo: item.sNo,
      spi,
      status: "",
      value: "",
      unit: "bar",
    })),
  );

const formatDateForDisplay = (dateString) => {
  if (!dateString) {
    return new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  const value = String(dateString);

  if (value.includes("-")) {
    const [year, month, day] = value.split("-");
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
  }

  return value;
};

const ObsCell = ({ sNo, spi, hasInput, checks, updateCheck, disabled }) => {
  const chk = checks.find((c) => c.sNo === sNo && c.spi === spi);

  if (!hasInput) {
    return (
      <span
        style={{
          color: "#cbd5e1",
          fontSize: "0.9rem",
          fontWeight: 700,
        }}
      >
        —
      </span>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
      }}
    >
      <input
        className="obs-input"
        type="number"
        step="0.1"
        placeholder="Value"
        value={chk?.value || ""}
        disabled={disabled}
        onChange={(e) => updateCheck(sNo, spi, { value: e.target.value })}
      />

      <select
        className="unit-select"
        value={chk?.unit || "bar"}
        disabled={disabled}
        onChange={(e) => updateCheck(sNo, spi, { unit: e.target.value })}
      >
        {UNITS.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>
    </div>
  );
};

const CheckBtns = ({ sNo, spi, checks, setStatus, disabled }) => {
  const chk = checks.find((c) => c.sNo === sNo && c.spi === spi);

  return (
    <div className="d-flex justify-content-center gap-2">
      <button
        type="button"
        className={`check-btn ${chk?.status === "OK" ? "ok-active" : "ok-idle"}`}
        onClick={() => !disabled && setStatus(sNo, spi, "OK")}
        title="OK"
        disabled={disabled}
      >
        ✓
      </button>

      <button
        type="button"
        className={`check-btn ${chk?.status === "NG" ? "ng-active" : "ng-idle"}`}
        onClick={() => !disabled && setStatus(sNo, spi, "NG")}
        title="NG"
        disabled={disabled}
      >
        ✗
      </button>
    </div>
  );
};

const DailyPowerPressChecksheet = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // When opened from notification, id = ReportActivityLog id
  const isViewMode = Boolean(id);

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const [displayDate, setDisplayDate] = useState(today);

  const [plant, setPlant] = useState("");

  const [operatorName, setOperatorName] = useState("");
  const [operators, setOperators] = useState([]);
  const [operatorsLoading, setOperatorsLoading] = useState(false);

  const [isAddingNewOperator, setIsAddingNewOperator] = useState(false);
  const [newOperatorName, setNewOperatorName] = useState("");
  const [isSavingOperator, setIsSavingOperator] = useState(false);

  const [machineNo, setMachineNo] = useState("");
  const [machineList, setMachineList] = useState([]);
  const [machinesLoading, setMachinesLoading] = useState(false);

  const [shift, setShift] = useState("");
  const [checks, setChecks] = useState(buildChecks());

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [approvalRemark, setApprovalRemark] = useState("");
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState("");
  const [reviewedAt, setReviewedAt] = useState("");

  useEffect(() => {
    if (!plant) {
      setOperators([]);
      setMachineList([]);

      if (!isViewMode) {
        setOperatorName("");
        setMachineNo("");
      }

      return;
    }

    const plantKey = PLANT_MAP[plant] || plant;

    if (!isViewMode) {
      setOperatorName("");
      setMachineNo("");
      setIsAddingNewOperator(false);
      setNewOperatorName("");
    }

    setOperatorsLoading(true);

    fetch(`${BASE_URL}/api/operators/?plant=${plantKey}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.operators)) {
          setOperators(data.operators);
        } else {
          setOperators([]);
        }
      })
      .catch((err) => {
        console.error("Fetch operators error:", err);
        setOperators([]);
      })
      .finally(() => setOperatorsLoading(false));

    setMachinesLoading(true);

    fetch(`${BASE_URL}/api/machines/list/?plant=${plantKey}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.machines)) {
          setMachineList(data.machines);
        } else {
          setMachineList([]);
        }
      })
      .catch((err) => {
        console.error("Fetch machines error:", err);
        setMachineList([]);
      })
      .finally(() => setMachinesLoading(false));
  }, [plant, isViewMode]);

  useEffect(() => {
    if (!id) return;

    const normalizePlantForUI = (plantValue = "") => {
      return REVERSE_PLANT_MAP[plantValue] || plantValue;
    };

    const fetchReport = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/get-single-maintenance-report/power-press-checksheet/${id}/`,
        );

        if (res.data.success) {
          const data = res.data.data || {};

          setPlant(normalizePlantForUI(data.plant || ""));
          setOperatorName(data.operator_name || "");
          setMachineNo(data.machine_no || "");
          setShift(data.shift || "");
          setDisplayDate(formatDateForDisplay(data.date || ""));

          if (Array.isArray(data.checkpoints)) {
            const restoredChecks = buildChecks().map((base) => {
              const saved = data.checkpoints.find((cp) => {
                const sameSNo = Number(cp.sNo) === Number(base.sNo);
                const sameSpi = Number(cp.spi ?? 0) === Number(base.spi);
                return sameSNo && sameSpi;
              });

              return {
                ...base,
                status:
                  saved?.status === "OK"
                    ? "OK"
                    : saved?.status === "Not OK" || saved?.status === "NG"
                    ? "NG"
                    : saved?.status || "",
                value: saved?.observedValue || "",
                unit: saved?.unit || "bar",
              };
            });

            setChecks(restoredChecks);
          }

          setApprovalRemark(data.approval_remarks || "");
          setApprovalStatus(data.approval_status || "");
          setReviewedAt(data.approved_or_rejected_at || "");
        } else {
          errorAlert(res.data.error || "Failed to load Daily Power Press Checksheet.");
        }
      } catch (err) {
        console.error("Error loading Daily Power Press Checksheet:", err);
        errorAlert(
          err.response?.data?.error ||
            "Failed to load Daily Power Press Checksheet.",
        );
      }
    };

    fetchReport();
  }, [id]);

  const handleSaveNewOperator = async () => {
    if (isViewMode) return;

    const opName = newOperatorName.trim();

    if (!opName) return;

    setIsSavingOperator(true);

    try {
      const response = await fetch(`${BASE_URL}/api/operators/add/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: opName,
          plant: PLANT_MAP[plant] || plant,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        const newOp = {
          id: result.id || Date.now(),
          name: opName,
        };

        setOperators((prev) => [...prev, newOp]);
        setOperatorName(opName);
        setIsAddingNewOperator(false);
        setNewOperatorName("");
      } else {
        errorAlert(
          "Failed to save operator: " +
            (result.message || result.error || "Unknown error"),
        );
      }
    } catch (error) {
      console.error("Error saving operator:", error);
      errorAlert("Network Error: Could not save operator to backend.");
    } finally {
      setIsSavingOperator(false);
    }
  };

  const formReady =
    operatorName.trim() !== "" &&
    plant !== "" &&
    machineNo.trim() !== "" &&
    shift !== "";

  const showTable = isViewMode || formReady;

  const getCheck = (sNo, spi) =>
    checks.find((c) => c.sNo === sNo && c.spi === spi);

  const updateCheck = (sNo, spi, patch) => {
    if (isViewMode) return;

    setChecks((prev) =>
      prev.map((c) => (c.sNo === sNo && c.spi === spi ? { ...c, ...patch } : c)),
    );
  };

  const setStatus = (sNo, spi, status) => {
    if (isViewMode) return;

    updateCheck(sNo, spi, {
      status: getCheck(sNo, spi)?.status === status ? "" : status,
    });
  };

  const allDone = checks.every((c) => c.status !== "");

  const resetForm = () => {
    setPlant("");
    setOperatorName("");
    setMachineNo("");
    setShift("");
    setChecks(buildChecks());
    setDisplayDate(today);
    setApprovalRemark("");
    setApprovalStatus("");
    setReviewedAt("");
  };

  const handleSubmit = async () => {
    if (!formReady) {
      warningAlert("Please fill in all required details before proceeding.");
      return;
    }

    if (!allDone) {
      warningAlert("Please complete all checkpoints before saving.");
      return;
    }

    const dateParts = today.split("/");
    const backendDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

    const currentUser = localStorage.getItem("username") || "Unknown User";
    const plantValue = PLANT_MAP[plant] || plant;

    const payload = {
      username: currentUser,
      plant: plantValue,
      department_name: `${plant} (Maintenance)`,
      operator_name: operatorName,
      machine_no: machineNo,
      shift: shift,
      date: backendDate,
      checkpoints: checkData.flatMap((item) =>
        item.subPoints.map((sp, spi) => {
          const chk = getCheck(item.sNo, spi);

          return {
            sNo: item.sNo,
            spi: spi,
            checkPoint: item.checkPoint,
            specification: sp.specification,
            checkingMethod: sp.checkingMethod,
            observedValue: chk?.value || null,
            unit: chk?.unit || null,
            status: chk?.status === "OK" ? "OK" : "Not OK",
          };
        }),
      ),
    };

    console.log("Sending Daily Power Press Payload:", payload);

    try {
      setIsSubmitting(true);

      const response = await fetch(`${BASE_URL}/api/checksheets/daily-power-press/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      console.log("🔥 Daily Power Press Save Response:", data);

      if (data.success || response.ok) {
        if (!data.log_id) {
          infoAlert(
            "Checksheet saved, but log_id missing. Backend did not create notification log.",
          );
          return;
        }

        resetForm();

        successAlert(`Daily Power Press Checksheet saved successfully. Log ID: ${data.log_id}`);
      } else {
        console.error("Backend Error:", data);
        errorAlert(`Data does not save Error: ${data.error || "Check console"}`);
      }
    } catch (error) {
      console.error("Network Error:", error);
      errorAlert("Server connection failed please check ip.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async () => {
    try {
      setApprovalLoading(true);

      const currentUser = localStorage.getItem("username") || "Approver";

      const res = await axios.post(`${BASE_URL}/api/approve-report/`, {
        log_id: id,
        approver_username: currentUser,
        remarks: approvalRemark,
      });

      successAlert(res.data?.message || "Report approved successfully.");
      navigate("/notifications");
    } catch (err) {
      console.error("Approve error:", err);
      errorAlert(err.response?.data?.error || "Approval failed.");
    } finally {
      setApprovalLoading(false);
    }
  };

  const handleReject = async () => {
    if (!approvalRemark.trim()) {
      warningAlert("Please enter remark before rejecting.");
      return;
    }

    try {
      setApprovalLoading(true);

      const currentUser = localStorage.getItem("username") || "Approver";

      const res = await axios.post(`${BASE_URL}/api/reject-report/`, {
        log_id: id,
        approver_username: currentUser,
        remarks: approvalRemark,
      });

      successAlert(res.data?.message || "Report rejected successfully.");
      navigate("/notifications");
    } catch (err) {
      console.error("Reject error:", err);
      errorAlert(err.response?.data?.error || "Reject failed.");
    } finally {
      setApprovalLoading(false);
    }
  };

  const goBack = () => {
    if (isViewMode) {
      navigate("/notifications");
      return;
    }

    navigate("/Maintenance/Machine/daily");
  };

  const isAlreadyReviewed =
    approvalStatus &&
    (approvalStatus.toLowerCase().includes("approved") ||
      approvalStatus.toLowerCase().includes("rejected"));

  const operatorOptions = operatorName
    ? Array.from(
        new Map(
          [
            { id: operatorName, name: operatorName },
            ...operators,
          ].map((op) => [op.name, op]),
        ).values(),
      )
    : operators;

  const machineOptions = machineNo
    ? Array.from(new Set([machineNo, ...machineList]))
    : machineList;

  return (
    <div className="pp-wrapper">
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />

      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
      />

      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      <style>{`
        * { box-sizing: border-box; }

        .pp-wrapper {
          position: absolute !important;
          top: 0;
          left: 0;
          width: 100%;
          min-height: 100vh;
          background: #f8fafc;
          z-index: 9999;
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }

        .pp-navbar {
          position: fixed !important;
          top: 0;
          left: 0;
          width: 100%;
          height: 66px;
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .pp-brand {
          font-weight: 900;
          color: #0f172a;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          letter-spacing: 0.5px;
        }

        .pp-brand .back-arrow {
          color: #94a3b8;
          font-size: 1.1rem;
        }

        .pp-brand-icon {
          width: 34px;
          height: 34px;
          background: #fff3e0;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .doc-badge {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #475569;
          border-radius: 20px;
          padding: 4px 10px;
          font-size: 0.72rem;
          font-weight: 800;
          white-space: nowrap;
        }

        .rev-badge {
          background: #d1fae5;
          border: 1.5px solid #10b981;
          color: #065f46;
          border-radius: 20px;
          padding: 4px 10px;
          font-size: 0.72rem;
          font-weight: 800;
          white-space: nowrap;
        }

        .review-badge {
          background: #dbeafe;
          border: 1.5px solid #3b82f6;
          color: #1d4ed8;
          border-radius: 20px;
          padding: 4px 10px;
          font-size: 0.72rem;
          font-weight: 800;
          white-space: nowrap;
        }

        .pp-main {
          padding: 86px 16px 60px;
          max-width: 1280px;
          margin: 0 auto;
        }

        .pp-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }

        .pp-card-header {
          font-weight: 900;
          color: #1e293b;
          font-size: 1.05rem;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 1rem;
          margin-bottom: 1.25rem;
        }

        .pp-card-header .icon-box {
          width: 36px;
          height: 36px;
          background: #f1f5f9;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0f172a;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .header-meta {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 700;
          margin-left: auto;
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .date-meta {
          background: #fff3e0;
          color: #df8008;
          padding: 4px 12px;
          border-radius: 8px;
          border: 1px solid #ffe8cc;
        }

        .field-label {
          font-size: 0.75rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
          display: block;
        }

        .field-label .required-star {
          color: #ef4444;
          margin-left: 2px;
        }

        .field-input {
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          color: #0f172a;
          border-radius: 10px;
          padding: 0.7rem 1rem;
          font-size: 0.95rem;
          font-weight: 700;
          width: 100%;
          height: 46px;
          transition: 0.2s;
          outline: none;
          font-family: 'Inter', sans-serif;
        }

        .field-input:focus {
          border-color: #df8008;
          box-shadow: 0 0 0 3px rgba(223,128,8,0.15);
          background: #fff;
        }

        .field-input:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          background: #f1f5f9;
        }

        .op-action-btn {
          height: 46px;
          width: 46px;
          border-radius: 10px;
          border: 1px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.2s;
          background: #f8fafc;
          flex-shrink: 0;
        }

        .op-action-btn.save {
          background: #d1fae5;
          border-color: #10b981;
          color: #065f46;
          font-size: 1.1rem;
        }

        .op-action-btn.save:hover {
          background: #10b981;
          color: #fff;
        }

        .op-action-btn.cancel {
          background: #fee2e2;
          border-color: #ef4444;
          color: #991b1b;
          font-size: 1.1rem;
        }

        .op-action-btn.cancel:hover {
          background: #ef4444;
          color: #fff;
        }

        .op-action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        .animate-spin-icon {
          animation: spin 1s linear infinite;
          display: inline-block;
        }

        .table-section {
          animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .table-wrapper {
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }

        .pp-table {
          width: 100%;
          border-collapse: collapse;
        }

        .pp-table thead tr {
          background: #f1f5f9;
        }

        .pp-table th {
          color: #475569;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 1rem;
          border-bottom: 2px solid #e2e8f0;
          text-align: center;
        }

        .pp-table td {
          padding: 0.85rem 1rem;
          vertical-align: middle;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.9rem;
          color: #081a43;
          font-weight: 600;
        }

        .sno-cell {
          text-align: center;
          font-weight: 900;
          color: #0f172a;
          font-size: 1.1rem;
        }

        .method-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #475569;
          border-radius: 6px;
          padding: 4px 10px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .obs-input {
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 4px 8px;
          width: 85px;
          text-align: center;
          font-weight: 700;
        }

        .unit-select {
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 4px;
          background: #f1f5f9;
          font-weight: 700;
        }

        .obs-input:disabled,
        .unit-select:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          background: #f1f5f9;
        }

        .check-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 2px solid;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.2s;
        }

        .check-btn:disabled {
          cursor: not-allowed;
          opacity: 0.75;
        }

        .ok-idle,
        .ng-idle {
          border-color: #e2e8f0;
          color: #cbd5e1;
        }

        .ok-active {
          border-color: #10b981;
          background: #10b981;
          color: #fff;
        }

        .ng-active {
          border-color: #ef4444;
          background: #ef4444;
          color: #fff;
        }

        .btn-submit {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-weight: 800;
          padding: 0.9rem 2rem;
          width: 100%;
          font-size: 1.05rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 992px) {
          .desktop-table {
            display: none;
          }
        }
      `}</style>

      <nav className="pp-navbar">
        <div className="pp-brand" onClick={goBack}>
          <i className="bi bi-arrow-left-circle back-arrow"></i>
          <div className="pp-brand-icon">🖨️</div>
          <span style={{ color: "#df8008" }}>Daily Power Press Checksheet</span>
        </div>

        <div className="nav-right">
          {isViewMode && <span className="review-badge">Review Mode</span>}
          <span className="doc-badge">AOT-F-MM-02</span>
          <span className="rev-badge">Rev: 03</span>
        </div>
      </nav>

      <div className="pp-main">
        {isViewMode && approvalStatus && (
          <div className="pp-card">
            <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
              <div>
                <div className="field-label">Current Status</div>
                <div
                  className={`fw-bold ${
                    approvalStatus.toLowerCase().includes("approved")
                      ? "text-success"
                      : approvalStatus.toLowerCase().includes("rejected")
                      ? "text-danger"
                      : "text-warning"
                  }`}
                >
                  {approvalStatus}
                </div>
              </div>

              {reviewedAt && (
                <div>
                  <div className="field-label">Reviewed At</div>
                  <div className="fw-bold text-muted">{reviewedAt}</div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="pp-card">
          <div className="pp-card-header">
            <div className="icon-box">
              <i className="bi bi-clipboard2-pulse"></i>
            </div>
            Checksheet Information
            <div className="header-meta">
              <span className="date-meta">
                <i className="bi bi-calendar3 me-2"></i>
                {displayDate}
              </span>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-6 col-lg-3">
              <label className="field-label">
                Plant <span className="required-star">*</span>
              </label>

              <select
                className="field-input"
                value={plant}
                onChange={(e) => setPlant(e.target.value)}
                disabled={isViewMode}
              >
                <option value="">-- Select Plant --</option>
                {Object.keys(PLANT_MAP).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <label className="field-label">
                Operator Name <span className="required-star">*</span>
              </label>

              {isAddingNewOperator && !isViewMode ? (
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    autoFocus
                    placeholder="Enter Name"
                    value={newOperatorName}
                    onChange={(e) => setNewOperatorName(e.target.value)}
                    disabled={isSavingOperator}
                    className="field-input"
                    style={{ paddingRight: "10px", paddingLeft: "10px" }}
                  />

                  <button
                    type="button"
                    onClick={handleSaveNewOperator}
                    disabled={isSavingOperator || !newOperatorName.trim()}
                    className="op-action-btn save"
                    title="Save Operator"
                  >
                    {isSavingOperator ? (
                      <i className="bi bi-arrow-repeat animate-spin-icon"></i>
                    ) : (
                      <i className="bi bi-check2"></i>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAddingNewOperator(false)}
                    disabled={isSavingOperator}
                    className="op-action-btn cancel"
                    title="Cancel"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              ) : (
                <select
                  className="field-input"
                  value={operatorName}
                  onChange={(e) => {
                    if (e.target.value === "ADD_NEW") {
                      setIsAddingNewOperator(true);
                    } else {
                      setOperatorName(e.target.value);
                    }
                  }}
                  disabled={isViewMode || !plant || operatorsLoading}
                >
                  <option value="">
                    {operatorsLoading
                      ? "Loading Operators..."
                      : !plant
                      ? "-- Select Plant First --"
                      : "-- Select Operator --"}
                  </option>

                  {operatorOptions.map((op) => (
                    <option key={op.id || op.name} value={op.name}>
                      {op.name}
                    </option>
                  ))}

                  {!isViewMode && (
                    <option
                      value="ADD_NEW"
                      style={{
                        fontWeight: "800",
                        color: "#df8008",
                        backgroundColor: "#fff3e0",
                      }}
                    >
                      + Add New Operator
                    </option>
                  )}
                </select>
              )}
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <label className="field-label">
                Machine No. <span className="required-star">*</span>
              </label>

              <select
                className="field-input"
                value={machineNo}
                onChange={(e) => setMachineNo(e.target.value)}
                disabled={isViewMode || !plant || machinesLoading}
              >
                <option value="">
                  {machinesLoading
                    ? "Loading Machines..."
                    : !plant
                    ? "-- Select Plant First --"
                    : "-- Select Machine --"}
                </option>

                {machineOptions.map((m) => (
                  <option key={m} value={m}>
                    Machine {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <label className="field-label">
                Shift <span className="required-star">*</span>
              </label>

              <select
                className="field-input"
                value={shift}
                onChange={(e) => setShift(e.target.value)}
                disabled={isViewMode}
              >
                <option value="">-- Select Shift --</option>
                <option value="A">Morning (08:30AM – 08:00PM)</option>
                <option value="B">Night (08:30PM – 08:00AM)</option>
              </select>
            </div>
          </div>
        </div>

        {showTable && (
          <div className="table-section">
            <div className="pp-card desktop-table" style={{ padding: "0" }}>
              <div className="table-wrapper">
                <table className="pp-table">
                  <thead>
                    <tr>
                      <th style={{ width: "6%" }}>S.No.</th>
                      <th style={{ width: "16%" }}>Check Point</th>
                      <th style={{ width: "28%" }}>Specification</th>
                      <th style={{ width: "16%" }}>Method</th>
                      <th style={{ width: "18%" }}>Observed Value</th>
                      <th style={{ width: "16%" }}>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {checkData.map((item) =>
                      item.subPoints.map((sp, spi) => (
                        <tr key={`${item.sNo}-${spi}`}>
                          {spi === 0 && (
                            <td rowSpan={item.subPoints.length} className="sno-cell">
                              {item.sNo}
                            </td>
                          )}

                          {spi === 0 && (
                            <td rowSpan={item.subPoints.length}>
                              {item.checkPoint}
                            </td>
                          )}

                          <td>{sp.specification}</td>

                          <td className="text-center">
                            <span className="method-badge">
                              {sp.checkingMethod}
                            </span>
                          </td>

                          <td className="text-center">
                            <ObsCell
                              sNo={item.sNo}
                              spi={spi}
                              hasInput={sp.hasInput}
                              checks={checks}
                              updateCheck={updateCheck}
                              disabled={isViewMode}
                            />
                          </td>

                          <td>
                            <CheckBtns
                              sNo={item.sNo}
                              spi={spi}
                              checks={checks}
                              setStatus={setStatus}
                              disabled={isViewMode}
                            />
                          </td>
                        </tr>
                      )),
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pp-card mt-4">
              <div className="row g-3 align-items-center">
                <div className={isViewMode ? "col-12" : "col-12 col-md-8"}>
                  {!isViewMode && (
                    <span className="text-muted fw-bold">
                      <i className="bi bi-info-circle me-2"></i>
                      Double check all values before submitting.
                    </span>
                  )}

                  {isViewMode && (
                    <div>
                      <label className="field-label">
                        Approval / Rejection Remark
                      </label>

                      <textarea
                        className="field-input"
                        style={{
                          height: "90px",
                          resize: "vertical",
                        }}
                        value={approvalRemark}
                        onChange={(e) => setApprovalRemark(e.target.value)}
                        disabled={isAlreadyReviewed}
                        placeholder="Enter approval or rejection remark..."
                      />

                      {approvalStatus && (
                        <div className="mt-2 fw-bold text-muted">
                          Status: {approvalStatus}
                          {reviewedAt ? ` | Reviewed At: ${reviewedAt}` : ""}
                        </div>
                      )}

                      {isAlreadyReviewed ? (
                        <div className="mt-3 alert alert-secondary fw-bold">
                          This report is already reviewed.
                        </div>
                      ) : (
                        <div className="d-flex gap-2 mt-3">
                          <button
                            type="button"
                            className="btn btn-danger fw-bold w-50"
                            onClick={handleReject}
                            disabled={approvalLoading}
                          >
                            {approvalLoading ? "Please wait..." : "Reject"}
                          </button>

                          <button
                            type="button"
                            className="btn btn-success fw-bold w-50"
                            onClick={handleApprove}
                            disabled={approvalLoading}
                          >
                            {approvalLoading ? "Please wait..." : "Approve"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {!isViewMode && (
                  <div className="col-12 col-md-4">
                    <button
                      type="button"
                      className="btn-submit"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      <i className="bi bi-cloud-arrow-up"></i>
                      {isSubmitting ? "Saving..." : "Save Checksheet"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyPowerPressChecksheet;