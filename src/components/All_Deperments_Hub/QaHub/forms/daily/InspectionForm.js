import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReadOnlyMode } from "../../../../../hooks/useReadOnlyMode";
import {
  successAlert,
  errorAlert,
  warningAlert,
  infoAlert,
  confirmAlert,
} from "../../../../../utils/alertUtils";
import axios from "axios";

// Example SOP Content
const sopDatabase = {
  Length: {
    title: "Length Measurement / लंबाई की माप",
    english: [
      "1. Ensure the Vernier Caliper is zero-calibrated.",
      "2. Place the part firmly between the external jaws.",
      "3. Tighten the locking screw gently.",
      "4. Read the main scale accurately.",
      "5. Record the value in Reading 1.",
    ],
    hindi: [
      "1. सुनिश्चित करें कि वर्नियर कैलीपर जीरो-कैलिब्रेटेड (0.00) है।",
      "2. पार्ट को बाहरी जबड़ों (jaws) के बीच मजबूती से रखें।",
      "3. लॉकिंग स्क्रू को धीरे से कसें।",
      "4. मुख्य स्केल को सटीक रूप से पढ़ें।",
      "5. वैल्यू को Reading 1 में रिकॉर्ड करें।",
    ],
  },
};

// Global filter definition for simple reuse
const excludedKeywords = [
  "storage",
  "dispatch",
  "despatch",
  "washing",
  "final inspection",
  "packaging",
  "reciept of raw",
  "incoming inspection",
];

const getItemText = (item) => {
  if (!item) return "";
  return typeof item === "string" ? item : item.name || item.operation || "";
};

// Helper function to thoroughly filter out unwanted operations and sort alphabetically
const filterAndSortArray = (arr, isOperation = false) => {
  const cleanArray = Array.isArray(arr) ? arr : [];

  return cleanArray
    .filter((item) => {
      const cleanText = getItemText(item).toLowerCase().trim();
      if (!cleanText) return false;

      if (isOperation) {
        const shouldExclude = excludedKeywords.some((keyword) =>
          cleanText.includes(keyword)
        );
        return !shouldExclude;
      }

      return true;
    })
    .sort((a, b) => getItemText(a).localeCompare(getItemText(b)));
};

const InspectionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isViewMode = Boolean(id);
   const isReadOnly = useReadOnlyMode();
  const currentUser = localStorage.getItem("username") || "Unknown User";

  const [customers, setCustomers] = useState([]);
  const [parts, setParts] = useState([]);
  const [tools, setTools] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedPart, setSelectedPart] = useState("");
  const [selectedTool, setSelectedTool] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [modelName, setModelName] = useState("");
  const todayDate = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [showExtraReadings, setShowExtraReadings] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const API_URL = `${API_BASE_URL}/api`;
  const API_LOG = `${API_URL}/log-report/`;
  const API_APPROVE = `${API_URL}/approve-report/`;
  const API_REJECT = `${API_URL}/reject-report/`;

  const [specList, setSpecList] = useState([]);
  const [dbLogs, setDbLogs] = useState([]);
  const [userAction, setUserAction] = useState("");
  const [selectedStage, setSelectedStage] = useState("");

  const [logColumns, setLogColumns] = useState([]);
  const [activeColId, setActiveColId] = useState("");
  const [currentStage, setCurrentStage] = useState(1);

  const activeColumn =
    logColumns.find((col) => col.id === activeColId) || logColumns[0];

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [currentSop, setCurrentSop] = useState(null);
  const [preparedBy, setPreparedBy] = useState("");

  const [approvalStatus, setApprovalStatus] = useState("Pending");
  const [reviewApprovedBy, setReviewApprovedBy] = useState("");
  const [reviewRejectedBy, setReviewRejectedBy] = useState("");
  const [reviewRemark, setReviewRemark] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  // ==========================================
  //  2. FETCH DATA & LOAD FORM
  // ==========================================
  useEffect(() => {
    fetch(`${API_URL}/master-dropdown/?filter=customer`)
      .then((res) => res.json())
      .then((data) => {
        setCustomers(filterAndSortArray(data, false));
      })
      .catch(() => {
        setCustomers(filterAndSortArray(["FIG", "MARUTI", "TATA"], false));
      });

    if (isViewMode) {
      axios
        .get(`${API_URL}/get-single-report/inspection-view/${id}/`)
        .then((res) => {
          if (res.data.success) {
            const d = res.data.data || {};
            const statusText = d.status || "";

            console.log("VIEW INSPECTION DATA:", d);

            const inspectionData = d.inspection_data || {};

          const normalizedParams = (inspectionData.parameters || []).map((row, index) => ({
  ...row,
  backendSr: row.backendSr ?? row.sr ?? row.sr_no,
  uiSr: index + 1,
  category: row.category || "",
  item: row.item || row.parameter_name || "",
  spec: row.spec || row.specification || "",
  tol: row.tol || row.tolerance || "-",
  instr: row.instr || row.instrument || "",
}));

            const normalizedLogs = inspectionData.logs || [];

            setSelectedCustomer(d.customer || d.customer_account || "");
            setSelectedPart(d.part_name || "");
            setSelectedTool(d.operation || "");
            setPartNumber(d.part_number || "");
            setModelName(d.model_name || inspectionData?.meta?.model_name || "");

            if (d.date) {
              setSelectedDate(String(d.date).split(" ")[0]);
            }

            setSpecList(normalizedParams);
            setLogColumns(normalizedLogs);
            setDbLogs(normalizedLogs);
            setUserAction("VIEW");
            setSelectedStage("VIEW_MODE");

            const fullName = d.submitted_by || "Unknown User";
            setPreparedBy(fullName.split("@")[0]);

            setApprovalStatus(
              d.approval_status ||
                (statusText.startsWith("Approved by")
                  ? "Approved"
                  : statusText.startsWith("Rejected by")
                  ? "Rejected"
                  : "Pending")
            );

            setReviewApprovedBy(
              d.review_approved_by ||
                (statusText.startsWith("Approved by")
                  ? statusText.replace("Approved by", "").trim()
                  : "")
            );

            setReviewRejectedBy(
              d.review_rejected_by ||
                (statusText.startsWith("Rejected by")
                  ? statusText.replace("Rejected by", "").trim()
                  : "")
            );

            setReviewRemark(
              d.review_remarks ||
                d.approval_remarks ||
                d.rejection_remark ||
                d.review_remark ||
                d.remarks ||
                ""
            );
          }
        })
        .catch((err) => console.error("Error loading view data", err));
    }
  }, [id, isViewMode, API_URL]);

  const loadDataForGates = async (cust, part, op, dateStr) => {
    if (!cust || !part || !op || !dateStr || isViewMode) return;

    try {
      const masterRes = await fetch(
        `${API_URL}/master-parameters/?customer=${encodeURIComponent(
          cust
        )}&part=${encodeURIComponent(part)}&operation=${encodeURIComponent(op)}`
      );
      const masterData = await masterRes.json();

      setPartNumber(masterData.part_number || "68P00-S310050");
      setModelName(masterData.model_name || "K12M");

     let allItems = [];
   let uiSr = 1;

(masterData.productItems || []).forEach((item) => {
  allItems.push({
    ...item,
    backendSr: item.sr_no, // original backend sr
    uiSr: uiSr++,          // unique frontend sr
    category: "PRODUCT",
  });
});

(masterData.processItems || []).forEach((item) => {
  allItems.push({
    ...item,
    backendSr: item.sr_no,
    uiSr: uiSr++,
    category: "PROCESS",
  });
});

      if (allItems.length === 0) {
        allItems = [
          {
            sr: 1,
            category: "PRODUCT",
            item: "APPEARANCE",
            spec: "NO BLANK SHORT, NO BURR ETC",
            tol: "-",
            instr: "VISUAL",
          },
          {
            sr: 2,
            category: "PRODUCT",
            item: "LENGTH",
            spec: "240",
            tol: "+0.5/-1.0 MM",
            instr: "HEIGHT GAUGE",
          },
          {
            sr: 11,
            category: "PROCESS",
            item: "SHUT HEIGHT",
            spec: "287.92",
            tol: "± 0.50 MM",
            instr: "SHUT HEIGHT METER",
          },
        ];
      }

      setSpecList(allItems);

      const reportRes = await fetch(
        `${API_URL}/get-inspection-report/?customer=${encodeURIComponent(
          cust
        )}&part_name=${encodeURIComponent(part)}&operation=${encodeURIComponent(
          op
        )}&date=${dateStr}`
      );

      if (reportRes.ok) {
        const reportData = await reportRes.json();
        setDbLogs(reportData.inspection_data.logs || []);
      } else {
        setDbLogs([]);
      }

      setUserAction("");
      setSelectedStage("");
      setLogColumns([]);
      setActiveColId("");
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!isViewMode) {
      loadDataForGates(selectedCustomer, selectedPart, selectedTool, selectedDate);
    }
  }, [selectedCustomer, selectedPart, selectedTool, selectedDate, isViewMode]);

  const handleCustomerChange = (e) => {
    if (isViewMode) return;

    const cust = e.target.value;

    setSelectedCustomer(cust);
    setSelectedPart("");
    setSelectedTool("");
    setSpecList([]);
    setDbLogs([]);
    setUserAction("");

    if (cust) {
      fetch(`${API_URL}/master-dropdown/?filter=part&cust=${encodeURIComponent(cust)}`)
        .then((res) => res.json())
        .then((data) => setParts(filterAndSortArray(data, false)))
        .catch(() => setParts(filterAndSortArray(["INLET PIPE", "OUTLET PIPE"], false)));
    }
  };

  const handlePartChange = (e) => {
    if (isViewMode) return;

    const part = e.target.value;

    setSelectedPart(part);
    setSelectedTool("");
    setSpecList([]);
    setDbLogs([]);
    setUserAction("");

    if (part) {
      fetch(
        `${API_URL}/master-dropdown/?filter=operation&cust=${encodeURIComponent(
          selectedCustomer
        )}&part=${encodeURIComponent(part)}`
      )
        .then((res) => res.json())
        .then((data) => {
          const cleanOps = filterAndSortArray(data, true);
          setTools(cleanOps);
        })
        .catch(() => {
          const fallbackOps = filterAndSortArray(["BLANKING", "BENDING"], true);
          setTools(fallbackOps);
        });
    }
  };

  // ==========================================
  //  3. ACTION & STAGE GATES LOGIC
  // ==========================================
  const handleUpdateAction = () => {
    if (dbLogs.length === 0) {
       warningAlert(
        "ℹ️ No existing records found for this date. Please select",
         "New Record' to initiate an inspection."
      );
      return;
    }

    setUserAction("UPDATE");
    setSelectedStage("UPDATE_MODE");
    setLogColumns(dbLogs);
    setActiveColId("");
    setCurrentStage(4);
  };

  const handleDeleteAction = async () => {
    if (dbLogs.length === 0) {
      infoAlert("ℹ️ No data available to purge for the selected date.");
      return;
    }

    const confirmDelete = confirmAlert(
      " Critical Warning",
      " You are about to permanently purge all inspection records for this date. \n\nDo you wish to proceed?"
    );

    if (confirmDelete) {
      try {
        successAlert("🗑️ Records successfully purged from the database.");
        loadDataForGates(selectedCustomer, selectedPart, selectedTool, selectedDate);
      } catch (err) {
        errorAlert("❌ Deletion failed",
          " Please verify database connection.");
      }
    }
  };

  const getLogByStage = (stage) =>
    dbLogs.find((col) => col.baseStage === stage && col.isLocked);

  const setupLog = getLogByStage("SETUP");
  const fourHrsLog = getLogByStage("4HRS");
  const lastLog = getLogByStage("LAST");

  const isSetupDone = !!setupLog;
  const is4HrsDone = !!fourHrsLog;
  const isLastDone = !!lastLog;

  const startFillingStage = (stageCode) => {
    if (stageCode === "4HRS") {
      if (!setupLog) {
        warningAlert(
          "⛔ Sequence Error",
          "Please complete the SETUP inspection before initiating the 4-Hourly report."
        );
        return;
      }

      if (setupLog.timestamp) {
        const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;
        const timePassed = Date.now() - setupLog.timestamp;

        if (timePassed < FOUR_HOURS_MS) {
          const timeLeft = FOUR_HOURS_MS - timePassed;
          const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
          const minsLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

          warningAlert(
            `⏳ Time Restriction Active: The 4-Hourly inspection will unlock in ${hoursLeft}h ${minsLeft}m.`
          );
          return;
        }
      }
    }

    if (stageCode === "LAST") {
    const result =  warningAlert(
  "Verification Required",
  `
    Are you sure you want to log the <b>LAST PIECE</b> for the
    <b>[${selectedTool}]</b> operation?

    <br><br>

    <span style="color:#DC2626;font-weight:600;">
      Proceeding will finalize the batch inspection.
    </span>
  `
);
      if (!result) return;
    }

    setSelectedStage(stageCode);

    const stageName =
      stageCode === "SETUP"
        ? "SETUP"
        : stageCode === "4HRS"
        ? "4-HOURLY"
        : "LAST PIECE";

    const stageNum = stageCode === "SETUP" ? 1 : stageCode === "4HRS" ? 2 : 3;

    setCurrentStage(stageNum);

    const refPlant = dbLogs.length > 0 ? dbLogs[0].plant : "";
    const refOp = dbLogs.length > 0 ? dbLogs[0].operator : "";
    const refMach = dbLogs.length > 0 ? dbLogs[0].machine : "";

    const newCol = {
      id: `col_${stageCode.toLowerCase()}_${Date.now()}`,
      baseStage: stageCode,
      displayStage: stageName,
      date: selectedDate,
      time: "",
      timestamp: null,
      plant: refPlant,
      operator: refOp,
      machine: refMach,
      entryFormat: "dual",
      readings: {},
      isLocked: false,
    };

    setLogColumns([...dbLogs, newCol]);
    setActiveColId(newCol.id);
  };

  const handleBackClick = () => {
    if (selectedStage) {
      setSelectedStage("");
      setLogColumns([]);
      setActiveColId("");
    } else {
      setUserAction("");
    }
  };

  // ==========================================
  //  4. INLINE HANDLING & SAVE / APPROVE / REJECT
  // ==========================================
  const handleActiveColChange = (field, value) => {
    setLogColumns((prev) =>
      prev.map((col) => (col.id === activeColId ? { ...col, [field]: value } : col))
    );
  };

  const handleCellChange = (colId, rowSr, valKey, value) => {
    setLogColumns((prev) =>
      prev.map((col) =>
        col.id === colId
          ? {
              ...col,
              readings: {
                ...col.readings,
                [rowSr]: {
                  ...(col.readings[rowSr] || {
                    val1: "",
                    val2: "",
                    val3: "",
                    val4: "",
                    status: "",
                  }),
                  [valKey]: value,
                },
              },
            }
          : col
      )
    );
  };

  const unlockColumn = (id) => {
    setLogColumns((prev) =>
      prev.map((col) => (col.id === id ? { ...col, isLocked: false } : col))
    );
    setActiveColId(id);
  };

  const handleEyeClick = (paramName) => {
    const sopData = sopDatabase[paramName] || {
      title: paramName,
      english: ["No specific SOP defined for this parameter."],
      hindi: ["इस पैरामीटर के लिए कोई विशिष्ट SOP परिभाषित नहीं है।"],
    };

    setCurrentSop(sopData);
    setShowInfoModal(true);
  };

  const handleVideoClick = (paramName) => {
    confirmAlert(`🎥 Initializing tutorial video for: ${paramName}`);
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
        successAlert(response.data.message || "✅ Report Approved Successfully!");
        navigate(-1);
      }
    } catch (error) {
      console.error("Error approving data:", error);

      if (error.response) {
        errorAlert(
          `❌ Backend Error: ${
            error.response.data.error ||
            error.response.data.message ||
            "Failed to approve report"
          }`
        );
      } else {
        errorAlert(" Network Error",
          " Could not connect to server.");
      }
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!id) return;

    if (!reviewRemark.trim()) {
      infoAlert("Please enter rejection remark");
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
        warningAlert(response.data.message || "❌ Report Rejected Successfully!");
        navigate(-1);
      }
    } catch (error) {
      console.error("Error rejecting data:", error);

      if (error.response) {
        errorAlert(
          `❌ Backend Error: ${
            error.response.data.error ||
            error.response.data.message ||
            "Failed to reject report"
          }`
        );
      } else {
        errorAlert("❌ Network Error: Could not connect to server.");
      }
    } finally {
      setIsRejecting(false);
    }
  };

  const handleSaveData = async () => {
    if (isViewMode) return;

    if (!activeColumn?.plant || !activeColumn?.operator || !activeColumn?.machine) {
     warningAlert(" Validation Error",
      " Please select Plant Location, Operator ID, and Machine Node.");
      return;
    }

    const format = activeColumn?.entryFormat || "dual";
    let allFilled = true;

    for (let row of specList) {
      const readObj = activeColumn.readings[row.uiSr] || { val1: "", val2: "" };

      if (format === "single") {
        if (!readObj.val1 || String(readObj.val1).trim() === "") {
          allFilled = false;
          break;
        }
      } else {
        if (
          !readObj.val1 ||
          String(readObj.val1).trim() === "" ||
          !readObj.val2 ||
          String(readObj.val2).trim() === ""
        ) {
          allFilled = false;
          break;
        }
      }
    }

    if (!allFilled) {
      warningAlert(
        " Validation Error",
        " All readings are compulsory. Please fill all the data fields before committing."
      );
      return;
    }

    const timeNow = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    let newLogs = logColumns.map((col) =>
      col.id === activeColId
        ? { ...col, isLocked: true, time: timeNow, timestamp: Date.now() }
        : col
    );

    const payload = {
        customer_account: selectedCustomer,
        part_name: selectedPart,
        operation: selectedTool,
        part_number: partNumber,

        plant_location: activeColumn?.plant || "",
        inspection_date: selectedDate,
        operator_name: activeColumn?.operator || "",
        machine_number: activeColumn?.machine || "",

        inspection_data: {
        meta: {
          model_name: modelName,
        },
        parameters: specList,
        logs: newLogs,
},
       };

    try {
      const response = await fetch(`${API_URL}/save-inspection-report/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const resData = await response.json();
        try {
          await axios.post(API_LOG, {
            username: currentUser,
            report_name: "Inspection Report",
            record_id: resData.record_id || resData.report_id,
            department_name: "Plant 2 (QA)",
            target_group: "Quality_Approvers",
          });
        } catch (logErr) {
          console.error("Activity log error:", logErr);
          successAlert("Form saved, but notification not created.");
        }
        successAlert(
          `✅ ${
            activeColumn?.displayStage || "Data"
          } inspection successfully committed to the database.`
        );
        }else {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { error: await response.text() };
        }
        console.error("❌ Django Backend Error:", errorData);
        errorAlert(
          `❌ Backend rejected payload: ${
            errorData.error ||
            errorData.message ||
            JSON.stringify(errorData)
          }`
        );
        return;

    }
  } catch (error) {
    errorAlert(
      " Connection Timeout",
      "Unable to reach the server. Please verify your network or backend status."
    );
  }
  setDbLogs(newLogs);
  setLogColumns([]);
  setActiveColId("");
  setSelectedStage("");
  setUserAction("FILL");
};
const renderCell = (col, rowSr, paramName, instr) => {
  const readObj = col.readings[rowSr] || {
    val1: "",
    val2: "",
    val3: "",
    val4: "",
    status: "",
  };
  const isActive = col.id === activeColId && !col.isLocked && !isViewMode;
  const isOkayNotOkay = instr === "VISUAL" || instr?.toUpperCase().includes("VISUAL");
  if (isActive) {
    return (
      <td
        className="table-active p-2"
        style={{
          minWidth: showExtraReadings ? "520px" : "280px",
          borderLeft: "2px solid var(--accent-primary)",
          borderRight: "2px solid var(--accent-primary)",
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: showExtraReadings ? "repeat(4, 1fr)" : "repeat(2, 1fr)",
              gap: "8px",
              flexGrow: 1,
            }}
          >
            {isOkayNotOkay ? (
              <>
                  <select
                    className="form-input-light text-center fw-bold"
                    value={readObj.val1 || ""}
                    onChange={(e) => handleCellChange(col.id, rowSr, "val1", e.target.value)}
                  >
                    <option value="">Reading 1</option>
                    <option value="OK">✓ OK</option>
                    <option value="NOT_OK">✗ NOT OK</option>
                  </select>

                  <select
                    className="form-input-light text-center fw-bold"
                    value={readObj.val2 || ""}
                    onChange={(e) => handleCellChange(col.id, rowSr, "val2", e.target.value)}
                  >
                    <option value="">Reading 2</option>
                    <option value="OK">✓ OK</option>
                    <option value="NOT_OK">✗ NOT OK</option>
                  </select>

                  {showExtraReadings && (
                    <>
                      <select
                        className="form-input-light text-center fw-bold"
                        value={readObj.val3 || ""}
                        onChange={(e) =>
                          handleCellChange(col.id, rowSr, "val3", e.target.value)
                        }
                      >
                        <option value="">Reading 3</option>
                        <option value="OK">✓ OK</option>
                        <option value="NOT_OK">✗ NOT OK</option>
                      </select>

                      <select
                        className="form-input-light text-center fw-bold"
                        value={readObj.val4 || ""}
                        onChange={(e) =>
                          handleCellChange(col.id, rowSr, "val4", e.target.value)
                        }
                      >
                        <option value="">Reading 4</option>
                        <option value="OK">✓ OK</option>
                        <option value="NOT_OK">✗ NOT OK</option>
                      </select>
                    </>
                  )}
                </>
              ) : (
                <>
                  <input
                    type="text"
                    className="form-input-light text-center fw-bold"
                    placeholder="Reading 1"
                    value={readObj.val1}
                    onChange={(e) => handleCellChange(col.id, rowSr, "val1", e.target.value)}
                  />

                  <input
                    type="text"
                    className="form-input-light text-center fw-bold"
                    placeholder="Reading 2"
                    value={readObj.val2}
                    onChange={(e) => handleCellChange(col.id, rowSr, "val2", e.target.value)}
                  />

                  {showExtraReadings && (
                    <>
                      <input
                        type="text"
                        className="form-input-light text-center fw-bold"
                        placeholder="Reading 3"
                        value={readObj.val3 || ""}
                        onChange={(e) =>
                          handleCellChange(col.id, rowSr, "val3", e.target.value)
                        }
                      />

                      <input
                        type="text"
                        className="form-input-light text-center fw-bold"
                        placeholder="Reading 4"
                        value={readObj.val4 || ""}
                        onChange={(e) =>
                          handleCellChange(col.id, rowSr, "val4", e.target.value)
                        }
                      />
                    </>
                  )}
                </>
              )}
            </div>

            <div className="d-flex flex-column gap-1">
              <button
                type="button"
                className="btn-icon-simple"
                title="View Info"
                onClick={() => handleEyeClick(paramName)}
              >
                <img
                  src="https://img.icons8.com/ios/50/000000/visible--v1.png"
                  alt="Eye"
                  style={{ width: "15px", height: "15px", opacity: 0.8 }}
                />
              </button>

              <button
                type="button"
                className="btn-icon-simple text-danger"
                title="Watch Video"
                onClick={() => handleVideoClick(paramName)}
              >
                <i className="bi bi-camera-video"></i>
              </button>
            </div>
          </div>
        </td>
      );
    }

    const hasData = readObj.val1 || readObj.val2 || readObj.val3 || readObj.val4;

    if (!hasData) {
      return <td className="text-center text-muted fw-bold bg-light">--</td>;
    }

    return (
      <td className="bg-light text-center">
        <div className="d-flex gap-1 justify-content-center flex-wrap">
          {[readObj.val1, readObj.val2, readObj.val3, readObj.val4]
            .filter(Boolean)
            .map((val, i) => (
              <span key={i} className="read-only-light">
                {val}
              </span>
            ))}
        </div>
      </td>
    );
  };

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
      />

      <style>{`
        :root {
          --bg-main: #f8fafc;
          --bg-card: #ffffff;
          --bg-input: #f8fafc;
          --text-main: #0f172a;
          --text-muted: #64748b;
          --border-subtle: #e2e8f0;
          --accent-primary: ${isViewMode ? "#10b981" : "#4f46e5"};
          --accent-hover: ${isViewMode ? "#059669" : "#4338ca"};
          --accent-glow: rgba(${isViewMode ? "16, 185, 129" : "79, 70, 229"}, 0.15);
          --danger: #ef4444;
          --success: #10b981;
        }

        * {
          background-color: inherit;
        }

        html {
          background-color: #f8fafc;
        }

        body {
          background-color: #f8fafc;
          font-family: 'Inter', 'Segoe UI', sans-serif;
          color: var(--text-main);
        }

        .container,
        .container-fluid {
          background-color: transparent;
        }

        @keyframes slideUpFade {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-pop {
          animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .card-custom {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.03);
          margin-bottom: 24px;
          transition: 0.3s;
        }

        .card-header-custom {
          background-color: #ffffff;
          border-bottom: 1px solid var(--border-subtle);
          padding: 1.2rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 12px 12px 0 0;
        }

        .card-title-custom {
          color: var(--text-main);
          font-weight: 800;
          margin: 0;
          font-size: 1.05rem;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .card-body-custom {
          padding: 1.5rem;
        }

        label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
          display: block;
        }

        .form-control-light {
          background-color: #ffffff;
          border: 1px solid #cbd5e1;
          color: #0f172a;
          border-radius: 8px;
          padding: 0.7rem 1rem;
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.2s ease;
          width: 100%;
          outline: none;
        }

        .form-control-light:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px var(--accent-glow);
          background-color: #fff;
        }

        .form-control-light:disabled,
        .form-control-light[readonly] {
          background-color: #f1f5f9;
          color: #475569;
          cursor: not-allowed;
          font-weight: bold;
        }

        .gate-card-light {
          background: #ffffff;
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          padding: 2rem 1.5rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 2px 5px rgba(0,0,0,0.02);
        }

        .gate-card-light:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 30px -5px rgba(0,0,0,0.08);
          border-color: var(--accent-primary);
        }

        .gate-icon-light {
          font-size: 3rem;
          margin-bottom: 0.8rem;
          display: inline-block;
          transition: 0.3s;
          color: var(--accent-primary);
        }

        .gate-title-light {
          font-weight: 800;
          color: var(--text-main);
          font-size: 1.15rem;
          margin-bottom: 0.2rem;
        }

        .gate-desc-light {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin: 0;
          font-weight: 500;
        }

        .gate-done-light {
          border-color: #34d399 !important;
          background-color: #f0fdf4 !important;
          cursor: not-allowed !important;
          opacity: 0.9;
        }

        .stepper-light {
          display: flex;
          justify-content: space-between;
          position: relative;
          max-width: 550px;
          margin: 0 auto 2.5rem auto;
        }

        .stepper-light::before {
          content: '';
          position: absolute;
          top: 18px;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--border-subtle);
          z-index: 1;
        }

        .step-item-light {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          color: var(--text-muted);
        }

        .step-icon-light {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #ffffff;
          border: 3px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .step-item-light.active .step-icon-light {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
          box-shadow: 0 0 0 4px var(--accent-glow);
        }

        .step-item-light.completed .step-icon-light {
          background-color: var(--success);
          border-color: var(--success);
          color: #fff;
        }

        .meta-strip-light {
          background-color: #f8fafc;
          border: 1px solid var(--border-subtle);
          border-radius: 10px;
          padding: 1.2rem;
          margin-bottom: 1.5rem;
          border-left: 5px solid var(--accent-primary);
        }

        .table-responsive-light {
          border-radius: 10px;
          overflow-x: auto;
          background-color: #ffffff;
          border: 1px solid var(--border-subtle);
        }

        .table-light-custom {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 0;
        }

        .table-light-custom thead th {
          background-color: #f8fafc;
          color: var(--text-muted);
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 1.2rem 1rem;
          border-bottom: 1px solid var(--border-subtle);
        }

        .table-light-custom tbody td {
          vertical-align: middle;
          font-size: 0.9rem;
          padding: 0.8rem 1rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .th-active {
          color: var(--accent-primary) !important;
          font-weight: 900 !important;
        }

        .badge-pill-modern {
          padding: 0.4em 0.8em;
          border-radius: 99px;
          font-size: 70%;
          font-weight: 800;
          letter-spacing: 0.5px;
          border: 1px solid transparent;
        }

        .bg-prod-light {
          background-color: #eff6ff;
          color: #2563eb;
          border-color: #dbeafe;
        }

        .bg-proc-light {
          background-color: #ecfdf5;
          color: #059669;
          border-color: #d1fae5;
        }

        .badge-instr-light {
          background-color: #f8fafc;
          color: #64748b;
          border-color: #e2e8f0;
        }

        .form-input-light {
          background-color: #ffffff;
          border: 1px solid #cbd5e1;
          color: #0f172a;
          border-radius: 6px;
          padding: 0.5rem;
          width: 100%;
          font-size: 0.85rem;
          font-weight: 600;
          outline: none;
        }

        .read-only-light {
          display: block;
          padding: 0.5rem;
          color: #94a3b8;
          text-align: center;
          font-weight: 600;
        }

        .btn-icon-simple {
          background: transparent;
          border: none;
          color: #94a3b8;
          padding: 6px;
          cursor: pointer;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-icon-simple:hover {
          color: var(--accent-primary);
          background: #f1f5f9;
        }

        .btn-primary-glow {
          background: var(--text-main);
          color: #fff;
          border: none;
          border-radius: 8px;
          font-weight: 800;
          padding: 0.9rem 2.5rem;
          transition: all 0.3s;
          font-size: 0.95rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .btn-primary-glow:hover {
          background: #000;
          transform: translateY(-2px);
        }

        .btn-primary-glow:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-reject-glow {
          background: #dc2626;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-weight: 800;
          padding: 0.9rem 2.5rem;
          transition: all 0.3s;
          font-size: 0.95rem;
          box-shadow: 0 4px 6px rgba(220,38,38,0.2);
        }

        .btn-reject-glow:hover {
          background: #b91c1c;
          transform: translateY(-2px);
        }

        .btn-reject-glow:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-edit-light {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #475569;
          border-radius: 6px;
          padding: 4px 14px;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        .btn-outline-custom {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: var(--text-main);
          font-weight: 700;
          padding: 0.4rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
        }

        .modal-light-custom .modal-content {
          background-color: #ffffff;
          border: none;
          border-radius: 16px;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
        }

        .sop-list-light {
          list-style: none;
          padding-left: 0;
          color: #1e293b;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .sop-list-light li {
          margin-bottom: 0.8rem;
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .main-container {
          padding: 40px 24px 60px 24px;
          max-width: 1600px;
          margin: 0 auto;
        }

        .review-box {
          background: #f8fafc;
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 16px;
          margin-top: 18px;
        }

        .review-remark {
          background-color: #ffffff;
          border: 1px solid #cbd5e1;
          color: #0f172a;
          border-radius: 8px;
          padding: 0.8rem 1rem;
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.2s ease;
          width: 100%;
          outline: none;
          resize: vertical;
        }

        .review-remark:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px var(--accent-glow);
        }
      `}</style>

      {showInfoModal && currentSop && (
        <div
          className="modal fade show modal-light-custom"
          style={{
            display: "block",
            backgroundColor: "rgba(15, 23, 42, 0.5)",
            backdropFilter: "blur(4px)",
          }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg animate-pop">
            <div className="modal-content">
              <div className="modal-header">
                <h5
                  className="modal-title"
                  style={{ fontWeight: "900", color: "#0f172a" }}
                >
                  <img
                    src="https://img.icons8.com/ios/50/000000/visible--v1.png"
                    alt="Eye"
                    style={{ width: "24px", height: "24px", marginRight: "8px" }}
                  />
                  Standard Operating Procedure
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowInfoModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <h4
                  className="text-center mb-4 pb-3"
                  style={{
                    borderBottom: "1px solid var(--border-subtle)",
                    fontWeight: "900",
                    color: "#0f172a",
                  }}
                >
                  {currentSop.title}
                </h4>

                <div className="row g-4">
                  <div className="col-md-6 col-responsive">
                    <div className="lang-title-light">English Instructions</div>
                    <ul className="sop-list-light">
                      {currentSop.english.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="col-md-6 col-responsive">
                    <div className="lang-title-light">हिंदी निर्देश</div>
                    <ul
                      className="sop-list-light"
                      style={{ fontFamily: "Devanagari, sans-serif" }}
                    >
                      {currentSop.hindi.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div
                className="modal-footer border-0 p-4 bg-light"
                style={{
                  borderBottomLeftRadius: "16px",
                  borderBottomRightRadius: "16px",
                }}
              >
                <button
                  type="button"
                  className="btn btn-primary-glow w-100"
                  style={{
                    padding: "0.7rem",
                    backgroundColor: "var(--accent-primary)",
                  }}
                  onClick={() => setShowInfoModal(false)}
                >
                  Acknowledge & Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="main-container">
        <div className="card-custom animate-pop" style={{ animationDelay: "0.1s" }}>
          <div className="card-header-custom">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg shadow-md transition-all active:scale-95 group border-0"
              style={{ backgroundColor: isViewMode ? "#10b981" : "#2563eb" }}
            >
              <i className="bi bi-arrow-left me-1"></i> Back
            </button>

            <h6 className="card-title-custom">
              <i className={`bi bi-sliders text-${isViewMode ? "success" : "primary"}`}></i>
              Setup & Petrol Inspection{" "}
              {isViewMode && (
                <span className="text-success">(REVIEW - {approvalStatus})</span>
              )}
            </h6>

            <input
              type="text"
              className="form-control-light w-auto fw-bold text-center"
              style={{
                padding: "0.4rem 0.8rem",
                color: "var(--accent-primary)",
                cursor: "not-allowed",
                backgroundColor: "#f1f5f9",
              }}
              value={selectedDate}
              readOnly
            />
          </div>

          <div className="card-body-custom">
            <div className="row g-3">
              <div className="col-md-3 col-responsive">
                <label>Customer Name</label>

                {isViewMode ? (
                  <input
                    type="text"
                    className="form-control-light"
                    value={selectedCustomer}
                    readOnly
                    placeholder="Customer"
                  />
                ) : (
                  <select
                    className="form-control-light"
                    value={selectedCustomer}
                    onChange={handleCustomerChange}
                  >
                    <option value="">Select...</option>
                    {customers.map((c, i) => (
                      <option key={i} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                )}
            </div>

              <div className="col-md-3 col-responsive">
  <label>Part Name</label>

  {isViewMode ? (
    <input
      type="text"
      className="form-control-light"
      value={selectedPart}
      readOnly
      placeholder="Part Name"
    />
  ) : (
    <select
      className="form-control-light"
      value={selectedPart}
      onChange={handlePartChange}
      disabled={!selectedCustomer}
    >
      <option value="">Select...</option>
      {parts.map((p, i) => (
        <option key={i} value={p}>
          {p}
        </option>
      ))}
    </select>
  )}
</div>

              <div className="col-md-3 col-responsive">
  <label>Operation</label>

  {isViewMode ? (
    <input
      type="text"
      className="form-control-light"
      value={selectedTool}
      readOnly
      placeholder="Operation"
    />
  ) : (
    <select
      className="form-control-light"
      value={selectedTool}
      onChange={(e) => setSelectedTool(e.target.value)}
      disabled={!selectedPart}
    >
      <option value="">Select...</option>
      {tools.map((t, i) => (
        <option key={i} value={t}>
          {t}
        </option>
      ))}
    </select>
  )}
</div>

              <div className="col-md-3 col-responsive">
                <label>Model / Part No (Ref)</label>
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control-light"
                    value={modelName}
                    readOnly
                    placeholder="Model"
                  />
                  <input
                    type="text"
                    className="form-control-light"
                    value={partNumber}
                    readOnly
                    placeholder="Part No"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {specList.length > 0 && (
          <div className="card-custom animate-pop" style={{ animationDelay: "0.2s" }}>
            <div className="card-header-custom">
              <h6 className="card-title-custom">
                <i className="bi bi-terminal-split text-primary"></i>
                {userAction === ""
                  ? "Action Command"
                  : selectedStage === "" && !isViewMode
                  ? "Stage Selection"
                  : "Data Entry Terminal"}
              </h6>

              {userAction !== "" && !isViewMode && (
                <button type="button" className="btn-outline-custom" onClick={handleBackClick}>
                  <i className="bi bi-arrow-left me-1"></i> Return
                </button>
              )}
            </div>

            <div className="card-body-custom">
              {userAction === "" && !isViewMode && (
                <div className="animate-pop">
                  <div className="row justify-content-center g-4">
                    <div className="col-md-3 col-responsive">
                      <div className="gate-card-light" onClick={() => setUserAction("FILL")}>
                        <i className="bi bi-file-earmark-plus gate-icon-light"></i>
                        <h6 className="gate-title-light">New Record</h6>
                        <p className="gate-desc-light">Initialize new inspection logs</p>
                      </div>
                    </div>

                    <div className="col-md-3 col-responsive">
                      <div
                        className="gate-card-light"
                        onClick={handleUpdateAction}
                        style={{ "--accent-primary": "#10b981" }}
                      >
                        <i className="bi bi-pencil-square gate-icon-light"></i>
                        <h6 className="gate-title-light">Update Record</h6>
                        <p className="gate-desc-light">Modify existing log entries</p>
                      </div>
                    </div>

                    <div className="col-md-3 col-responsive">
                      <div
                        className="gate-card-light"
                        onClick={handleDeleteAction}
                        style={{ "--accent-primary": "#ef4444" }}
                      >
                        <i className="bi bi-trash gate-icon-light"></i>
                        <h6 className="gate-title-light">Purge Record</h6>
                        <p className="gate-desc-light">Delete data for selected date</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {userAction === "FILL" && selectedStage === "" && !isViewMode && (
                <div className="animate-pop">
                  <div className="row justify-content-center g-4">
                    <div className="col-md-3 col-responsive">
                      <div
                        className={`gate-card-light ${isSetupDone ? "gate-done-light" : ""}`}
                        onClick={() => !isSetupDone && startFillingStage("SETUP")}
                      >
                        {isSetupDone ? (
                          <i className="bi bi-check-circle-fill gate-icon-light text-success"></i>
                        ) : (
                          <i className="bi bi-1-circle gate-icon-light"></i>
                        )}

                        <h6 className="gate-title-light d-flex flex-column align-items-center justify-content-center gap-1">
                          <div className="d-flex align-items-center gap-2">
                            Setup{" "}
                            {isSetupDone && (
                              <span className="badge bg-success" style={{ fontSize: "0.6rem" }}>
                                COMPLETED
                              </span>
                            )}
                          </div>

                          {isSetupDone && (
                            <span
                              className="text-muted"
                              style={{ fontSize: "0.75rem", fontWeight: "600" }}
                            >
                              at {setupLog?.time}
                            </span>
                          )}
                        </h6>
                      </div>
                    </div>

                    <div className="col-md-3 col-responsive">
                      <div
                        className={`gate-card-light ${is4HrsDone ? "gate-done-light" : ""}`}
                        onClick={() => !is4HrsDone && startFillingStage("4HRS")}
                        style={{ "--accent-primary": "#f59e0b" }}
                      >
                        {is4HrsDone ? (
                          <i className="bi bi-check-circle-fill gate-icon-light text-success"></i>
                        ) : (
                          <i className="bi bi-2-circle gate-icon-light"></i>
                        )}

                        <h6 className="gate-title-light d-flex flex-column align-items-center justify-content-center gap-1">
                          <div className="d-flex align-items-center gap-2">
                            4-Hourly{" "}
                            {is4HrsDone && (
                              <span className="badge bg-success" style={{ fontSize: "0.6rem" }}>
                                COMPLETED
                              </span>
                            )}
                          </div>

                          {is4HrsDone && (
                            <span
                              className="text-muted"
                              style={{ fontSize: "0.75rem", fontWeight: "600" }}
                            >
                              at {fourHrsLog?.time}
                            </span>
                          )}
                        </h6>
                      </div>
                    </div>

                    <div className="col-md-3 col-responsive">
                      <div
                        className={`gate-card-light ${isLastDone ? "gate-done-light" : ""}`}
                        onClick={() => !isLastDone && startFillingStage("LAST")}
                        style={{ "--accent-primary": "#06b6d4" }}
                      >
                        {isLastDone ? (
                          <i className="bi bi-check-circle-fill gate-icon-light text-success"></i>
                        ) : (
                          <i className="bi bi-3-circle gate-icon-light"></i>
                        )}

                        <h6 className="gate-title-light d-flex flex-column align-items-center justify-content-center gap-1">
                          <div className="d-flex align-items-center gap-2">
                            Last Piece{" "}
                            {isLastDone && (
                              <span className="badge bg-success" style={{ fontSize: "0.6rem" }}>
                                COMPLETED
                              </span>
                            )}
                          </div>

                          {isLastDone && (
                            <span
                              className="text-muted"
                              style={{ fontSize: "0.75rem", fontWeight: "600" }}
                            >
                              at {lastLog?.time}
                            </span>
                          )}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(selectedStage !== "" || isViewMode) && (
                <div className="animate-pop">
                  {!isViewMode && (
                    <div className="stepper-light">
                      <div className={`step-item-light ${currentStage > 1 ? "completed" : "active"}`}>
                        <div className="step-icon-light">
                          {currentStage > 1 ? <i className="bi bi-check-lg"></i> : "1"}
                        </div>
                        <div className="step-text-light">Setup</div>
                      </div>

                      <div
                        className={`step-item-light ${
                          currentStage > 2 ? "completed" : currentStage === 2 ? "active" : ""
                        }`}
                      >
                        <div className="step-icon-light">
                          {currentStage > 2 ? <i className="bi bi-check-lg"></i> : "2"}
                        </div>
                        <div className="step-text-light">4-Hourly</div>
                      </div>

                      <div
                        className={`step-item-light ${
                          currentStage > 3 ? "completed" : currentStage === 3 ? "active" : ""
                        }`}
                      >
                        <div className="step-icon-light">
                          {currentStage > 3 ? <i className="bi bi-check-lg"></i> : "3"}
                        </div>
                        <div className="step-text-light">Last Piece</div>
                      </div>
                    </div>
                  )}

                  {activeColId && activeColumn && !isViewMode && (
                    <div className="meta-strip-light">
                      <div className="row g-3 align-items-center">
                        <div className="col-md-3 col-responsive">
                          <label>Plant Location</label>
                          <select
                            className="form-control-light"
                            value={activeColumn.plant || ""}
                            onChange={(e) => handleActiveColChange("plant", e.target.value)}
                          >
                            <option value="">Select Plant...</option>
                            <option value="Plant 1">Plant 1</option>
                            <option value="Plant 2">Plant 2</option>
                          </select>
                        </div>

                        <div className="col-md-3 col-responsive">
                          <label>Operator Name</label>
                          <input
                            type="text"
                            className="form-control-light"
                            placeholder="Operator Name"
                            value={activeColumn.operator || ""}
                            onChange={(e) => handleActiveColChange("operator", e.target.value)}
                          />
                        </div>

                        <div className="col-md-3 col-responsive">
                          <label>Machine No.</label>
                          <input
                            type="text"
                            className="form-control-light"
                            placeholder="M-01"
                            value={activeColumn.machine || ""}
                            onChange={(e) => handleActiveColChange("machine", e.target.value)}
                          />
                        </div>

                        <div className="col-md-3 col-responsive">
                          <label>Data Format</label>
                          <select
                            className="form-control-light"
                            value={activeColumn.entryFormat || "dual"}
                            onChange={(e) =>
                              handleActiveColChange("entryFormat", e.target.value)
                            }
                          >
                            <option value="single">Single Value</option>
                            <option value="dual">Reading 1 & 2</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="table-responsive-light shadow-sm mt-3">
                    <table className="table-light-custom">
                      <thead>
                        <tr>
                          <th className="text-center">Sr</th>
                          <th>Type</th>
                          <th style={{ textAlign: "left" }}>Parameter</th>
                          <th>Specification</th>
                          <th className="text-center">Tolerance</th>
                          <th className="text-center">Instrument</th>

                          {logColumns.map((col) => (
                            <th
                              key={col.id}
                              className={`${col.id === activeColId ? "th-active" : ""} text-center`}
                              style={{ minWidth: "160px" }}
                            >
                              <div className="d-flex justify-content-center align-items-center gap-2">
                                <span>{col.displayStage}</span>

                                {col.displayStage === "SETUP" && (
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => setShowExtraReadings((prev) => !prev)}
                                    style={{
                                      padding: "0px 6px",
                                      fontSize: "12px",
                                      lineHeight: "1",
                                    }}
                                  >
                                    {showExtraReadings ? "−" : "+"}
                                  </button>
                                )}

                                {(col.isLocked || isViewMode) && (
                                  <i className="bi bi-lock-fill text-muted"></i>
                                )}
                              </div>

                              {col.time && (
                                <div
                                  style={{
                                    fontSize: "0.65rem",
                                    color: "var(--text-muted)",
                                    marginTop: "4px",
                                    textTransform: "none",
                                  }}
                                >
                                  Logged: {col.time}
                                </div>
                              )}

                              {col.isLocked && !isViewMode && (
                                <button
                                  type="button"
                                  className="btn-edit-light mt-2 d-block mx-auto"
                                  onClick={() => unlockColumn(col.id)}
                                >
                                  Edit
                                </button>
                              )}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {specList.map((row) => (
                          <tr key={row.uiSr}>
                            <td className="fw-bold text-center" style={{ color: "#475569" }}>
                              {row.uiSr}
                            </td>

                            <td>
                              <span
                                className={`badge-pill-modern ${
                                  row.category === "PRODUCT" ? "bg-prod-light" : "bg-proc-light"
                                }`}
                              >
                                {row.category}
                              </span>
                            </td>

                            <td style={{ textAlign: "left", fontWeight: "800", color: "#0f172a" }}>
                              {row.item}
                            </td>

                            <td style={{ fontWeight: "700", color: "#334155" }}>{row.spec}</td>

                            <td className="text-center fw-bold text-danger">{row.tol}</td>

                            <td className="text-center">
                              <span className="badge-pill-modern badge-instr-light">
                                {row.instr || "-"}
                              </span>
                            </td>

                            {logColumns.map((col) => (
                              <React.Fragment key={col.id}>
                                {renderCell(col, row.uiSr, row.item, row.instr)}
                              </React.Fragment>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {isViewMode && (
                    <div className="review-box">
                      <div className="row g-3 mb-3">
                        <div className="col-md-3">
                          <label>Prepared By</label>
                          <p className="m-0 fw-bolder text-success fs-5 text-capitalize">
                            {preparedBy || "—"}
                          </p>
                        </div>

                        {reviewApprovedBy && (
                          <div className="col-md-3">
                            <label>Review Approved By</label>
                            <p className="m-0 fw-bolder text-success fs-5 text-capitalize">
                              {reviewApprovedBy}
                            </p>
                          </div>
                        )}

                        {reviewRejectedBy && (
                          <div className="col-md-3">
                            <label>Review Rejected By</label>
                            <p className="m-0 fw-bolder text-danger fs-5 text-capitalize">
                              {reviewRejectedBy}
                            </p>
                          </div>
                        )}

                        <div className="col-md-3">
                          <label>Review Status</label>
                          <p
                            className={`m-0 fw-bolder fs-5 text-capitalize ${
                              approvalStatus === "Approved"
                                ? "text-success"
                                : approvalStatus === "Rejected"
                                ? "text-danger"
                                : "text-warning"
                            }`}
                          >
                            {approvalStatus}
                          </p>
                        </div>
                      </div>

                      <label>Approval / Rejection Remark</label>
                      <textarea
                        value={reviewRemark}
                        onChange={(e) => setReviewRemark(e.target.value)}
                        rows="3"
                        className="review-remark"
                        placeholder="Enter approval/rejection remark..."
                      />
                    </div>
                  )}

                  <div className="mt-6 sm:mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-top pt-4">
                    {/* <div className="flex flex-col">
                      {!isViewMode && activeColId && (
                        <>
                          <label className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                            Prepared By
                          </label>
                          <input
                            type="text"
                            value={preparedBy}
                            onChange={(e) => setPreparedBy(e.target.value)}
                            placeholder="Enter name"
                            className="form-control-light w-100"
                            style={{ maxWidth: "250px" }}
                          />
                        </>
                      )}
                    </div> */}

                    {(activeColId || isViewMode) && (!isReadOnly)&&(
                      <div className="d-flex gap-2 flex-wrap justify-content-end">
                        {isViewMode ? (
                          <>
                            <button
                              type="button"
                              className="btn-primary-glow"
                              style={{ backgroundColor: "var(--success)" }}
                              onClick={handleApprove}
                              disabled={isApproving || approvalStatus === "Approved"}
                            >
                              <i className="bi bi-check-circle-fill me-2"></i>
                              {isApproving ? "Approving..." : "Approve Report"}
                            </button>

                            <button
                              type="button"
                              className="btn-reject-glow"
                              onClick={handleReject}
                              disabled={isRejecting || approvalStatus === "Rejected"}
                            >
                              <i className="bi bi-x-circle-fill me-2"></i>
                              {isRejecting ? "Rejecting..." : "Reject Report"}
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="btn-primary-glow"
                            style={{ backgroundColor: "var(--text-main)" }}
                            onClick={handleSaveData}
                          >
                            <i className="bi bi-cloud-check-fill me-2"></i>
                            Commit Records
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default InspectionForm;