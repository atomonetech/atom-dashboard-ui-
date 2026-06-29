import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Check, X, Loader2 } from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const BinTrollingForm = () => {
  const { id } = useParams();

  const [currentDate, setCurrentDate] = useState("");
  const [currentWeek, setCurrentWeek] = useState("W1");
  const [currentMonth, setCurrentMonth] = useState("");
  const [isAlreadyFilled, setIsAlreadyFilled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [preparedBy, setPreparedBy] = useState("");

  // ✅ Approval / rejection states
  const [approvalStatus, setApprovalStatus] = useState("Pending");
  const [approvedBy, setApprovedBy] = useState("");
  const [rejectedBy, setRejectedBy] = useState("");
  const [reviewRemark, setReviewRemark] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const checkpoints = [
    {
      id: "cp1",
      label: "Bin/Trolley Should Be Clean Properly",
      defaultMethod: "VISUAL",
    },
    {
      id: "cp2",
      label: "Bin/Trolley Should be Free From Dust",
      defaultMethod: "VISUAL",
    },
    {
      id: "cp3",
      label: "Bin/Trolley Should Not Be Damage And Broken",
      defaultMethod: "INSPECTION",
    },
    {
      id: "cp4",
      label: "Bin/Trolley Should be Free From Oil Surface",
      defaultMethod: "VISUAL",
    },
    {
      id: "cp5",
      label: "Bin/Trolley Should Be Clean In Bin Cleaning Area",
      defaultMethod: "INSPECTION",
    },
    {
      id: "cp6",
      label: "Others (Please Specify)",
      defaultMethod: "MANUAL",
    },
  ];

  const cleaningDetails = [
    { id: "cd1", label: "Total Bin / Trolley Quantity" },
    { id: "cd2", label: "Bin / Trolley Clean Quantity" },
    { id: "cd3", label: "Bin / Trolley Unclean Quantity" },
  ];

  const maintenanceDetails = [
    { id: "md1", label: "Total Bin/Trolley Maintenance Quantity" },
    { id: "md2", label: "Bin/Trolley Ok Quantity" },
    { id: "md3", label: "Bin/Trolley Reject Quantity" },
  ];

  const [checkpointData, setCheckpointData] = useState(
    checkpoints.reduce((acc, cp) => {
      acc[cp.id] = {
        checkingMethod: cp.defaultMethod,
        status: "",
        remarks: "",
      };
      return acc;
    }, {})
  );

  const [cleaningData, setCleaningData] = useState(
    cleaningDetails.reduce((acc, cd) => {
      acc[cd.id] = {
        frequency: "",
        remarks: "",
      };
      return acc;
    }, {})
  );

  const [maintenanceData, setMaintenanceData] = useState(
    maintenanceDetails.reduce((acc, md) => {
      acc[md.id] = {
        frequency: "",
        remarks: "",
      };
      return acc;
    }, {})
  );

  const getWeekOfMonth = (date) => {
    const day = date.getDate();

    if (day <= 7) return 1;
    if (day <= 14) return 2;
    if (day <= 21) return 3;
    if (day <= 28) return 4;

    return 5;
  };

  // 🔥 FETCH REPORT DATA IF ID EXISTS (VIEW/APPROVE MODE)
  useEffect(() => {
    if (id) {
      const fetchReportData = async () => {
        setLoading(true);

        try {
          const response = await axios.get(
            `${API_BASE_URL}/api/get-single-production-report/bin-trolley/${id}/`
          );

          if (response.data.success) {
            const data = response.data.data;
            const statusText = data.status || "";

            setIsAlreadyFilled(true);

            // Set header info
            if (data.date) setCurrentDate(data.date);
            if (data.week) setCurrentWeek(data.week);
            if (data.month) setCurrentMonth(data.month);
            if (data.submitted_by) setPreparedBy(data.submitted_by);

            // ✅ Approval data
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
              data.remarks || data.rejection_remark || data.remark || ""
            );

            const parseJson = (val) => {
              if (typeof val === "string") {
                try {
                  return JSON.parse(val);
                } catch (e) {
                  return {};
                }
              }

              return val || {};
            };

            const cpData = parseJson(data.checkpoints);
            const clData = parseJson(data.cleaning_details);
            const mnData = parseJson(data.maintenance_details);

            // Populate Checkpoints
            setCheckpointData((prev) => {
              const updated = { ...prev };

              Object.keys(cpData).forEach((key) => {
                updated[key] = {
                  checkingMethod:
                    cpData[key]?.checkingMethod || prev[key]?.checkingMethod,
                  status: cpData[key]?.status || "",
                  remarks: cpData[key]?.remarks || "",
                };
              });

              return updated;
            });

            // Populate Cleaning
            setCleaningData((prev) => {
              const updated = { ...prev };

              Object.keys(clData).forEach((key) => {
                updated[key] = {
                  frequency: clData[key]?.frequency || "",
                  remarks: clData[key]?.remarks || "",
                };
              });

              return updated;
            });

            // Populate Maintenance
            setMaintenanceData((prev) => {
              const updated = { ...prev };

              Object.keys(mnData).forEach((key) => {
                updated[key] = {
                  frequency: mnData[key]?.frequency || "",
                  remarks: mnData[key]?.remarks || "",
                };
              });

              return updated;
            });
          }
        } catch (error) {
          console.error("Error fetching single report:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchReportData();
    } else {
      // 🚀 CREATE MODE LOGIC (Only runs if NO ID)
      const today = new Date();

      const formattedDate = today
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, ".");

      setCurrentDate(formattedDate);

      const monthName = today.toLocaleDateString("en-GB", {
        month: "short",
      });

      setCurrentMonth(monthName);

      const weekNumber = getWeekOfMonth(today);
      const week = `W${weekNumber}`;

      setCurrentWeek(week);

      checkExistingData(monthName, week);
    }
  }, [id]);

  const checkExistingData = async (month, week) => {
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/get-bin-trolley/?month=${month}`
      );

      const result = await response.json();

      if (result.success && result.data.length > 0) {
        const weekData = result.data.find((r) => r.week === week);

        if (weekData) {
          setIsAlreadyFilled(true);

          if (weekData.checkpoints) {
            setCheckpointData((prev) => {
              const updated = { ...prev };

              Object.keys(weekData.checkpoints).forEach((id) => {
                updated[id] = {
                  checkingMethod:
                    weekData.checkpoints[id].checkingMethod ||
                    prev[id]?.checkingMethod,
                  status: weekData.checkpoints[id].status || "",
                  remarks: weekData.checkpoints[id].remarks || "",
                };
              });

              return updated;
            });
          }

          if (weekData.cleaning_details) {
            setCleaningData((prev) => {
              const updated = { ...prev };

              Object.keys(weekData.cleaning_details).forEach((id) => {
                updated[id] = {
                  frequency: weekData.cleaning_details[id].frequency || "",
                  remarks: weekData.cleaning_details[id].remarks || "",
                };
              });

              return updated;
            });
          }

          if (weekData.maintenance_details) {
            setMaintenanceData((prev) => {
              const updated = { ...prev };

              Object.keys(weekData.maintenance_details).forEach((id) => {
                updated[id] = {
                  frequency: weekData.maintenance_details[id].frequency || "",
                  remarks: weekData.maintenance_details[id].remarks || "",
                };
              });

              return updated;
            });
          }
        }
      }
    } catch (error) {
      console.error("Check existing data error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckpointChange = (id, field, value) => {
    if (isAlreadyFilled) return;

    setCheckpointData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleCleaningChange = (id, field, value) => {
    if (isAlreadyFilled) return;

    setCleaningData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleMaintenanceChange = (id, field, value) => {
    if (isAlreadyFilled) return;

    setMaintenanceData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const resetForm = () => {
    if (isAlreadyFilled) return;

    setCheckpointData(
      checkpoints.reduce((acc, cp) => {
        acc[cp.id] = {
          checkingMethod: cp.defaultMethod,
          status: "",
          remarks: "",
        };
        return acc;
      }, {})
    );

    setCleaningData(
      cleaningDetails.reduce((acc, cd) => {
        acc[cd.id] = {
          frequency: "",
          remarks: "",
        };
        return acc;
      }, {})
    );

    setMaintenanceData(
      maintenanceDetails.reduce((acc, md) => {
        acc[md.id] = {
          frequency: "",
          remarks: "",
        };
        return acc;
      }, {})
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isAlreadyFilled) return;

    // Split logic handling for different date formats just in case
    let backendDate = currentDate;

    if (currentDate.includes(".")) {
      const [day, monthNumber, year] = currentDate.split(".");
      backendDate = `${year}-${monthNumber}-${day}`;
    }

    const completeData = {
      date: backendDate,
      week: currentWeek,
      month: currentMonth,
      checkpoints: checkpointData,
      cleaning_details: cleaningData,
      maintenance_details: maintenanceData,
      cleaningDetails: cleaningData,
      maintenanceDetails: maintenanceData,
      currentWeek,
      currentDate,

      // ✅ Backend auto_log_report ke liye username
      submitted_by:
        localStorage.getItem("username") || preparedBy || "Unknown User",

      // ✅ Report data ke liye prepared by bhi bhej rahe hain
      prepared_by:
        preparedBy || localStorage.getItem("username") || "Unknown User",
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/bin-trolley/save/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeData),
      });

      const result = await response.json();

      if (result.success) {
        alert(
          `✅ Data saved for ${currentWeek} (${currentMonth} ${new Date().getFullYear()})`
        );
        setIsAlreadyFilled(true);
      } else {
        alert(`❌ Error saving data: ${result.error}`);
      }
    } catch (error) {
      console.error("Submit Error:", error);
      alert("Network error, backend server par connect nahi ho paa raha hai.");
    }
  };

  const handleApprove = async () => {
    if (!id) return;

    const currentUser = localStorage.getItem("username") || "Approver";

    setIsApproving(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/approve-report/`, {
        log_id: id,
        approver_username: currentUser,
        approved_by: currentUser,
        approval_status: "Approved",
        remark: reviewRemark,
        remarks: reviewRemark,
      });

      if (response.status === 200) {
        alert("✅ Report Approved Successfully!");
        window.history.back();
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
      const response = await axios.post(`${API_BASE_URL}/api/reject-report/`, {
        log_id: id,
        approver_username: currentUser,
        rejected_by: currentUser,
        rejection_remark: reviewRemark,
        remark: reviewRemark,
        remarks: reviewRemark,
        approval_status: "Rejected",
      });

      if (response.status === 200) {
        alert("❌ Report Rejected Successfully!");
        window.history.back();
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

  const handleBack = () => {
    window.history.back();
  };

  // Read-only field style
  const readonlyInput =
    "w-full border border-[#b2ebf2] rounded px-2 py-1.5 text-sm text-slate-700 bg-[#f0fffe] cursor-not-allowed";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fdff] to-[#f0fbfe] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading report data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fdff] to-[#f0fbfe] p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={handleBack}
          className="mb-4 flex items-center text-white text-md font-bold bg-cyan-400 hover:bg-cyan-500 transition-colors group px-3 py-2 rounded-lg"
        >
          <svg
            className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-0">
          <div className="bg-gradient-to-r from-white to-cyan-300 px-6 py-5">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-[#048595]">
                {id
                  ? "Bin & Trolley Report (REVIEW)"
                  : "Bin & Trolley Cleaning Check Sheet And Maintenance"}
              </h1>

              <div className="bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/70">
                <span className="text-sm font-medium text-[#036a7a]">
                  Date: {currentDate}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white px-6 py-3 border-b border-[#e0f7fa]">
            <div className="flex items-center justify-end">
              <span className="bg-gradient-to-r from-[#b2ebf2] to-[#80deea] text-[#036a7a] px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm">
                Active Week: {currentWeek} ({currentMonth}{" "}
                {new Date().getFullYear()})
              </span>
            </div>
          </div>

          {/* Data Already Filled Alert (Only in Create Mode) */}
          {isAlreadyFilled && !id && (
            <div className="mx-6 mt-5 flex items-start gap-3 bg-green-50 border border-green-300 rounded-xl px-5 py-4">
              <span className="text-2xl">✅</span>

              <div>
                <p className="font-bold text-green-700 text-base">
                  Data Already Filled for {currentWeek}!
                </p>

                <p className="text-green-600 text-sm mt-0.5">
                  Is week ka data pehle se fill hai. Neeche read-only mode mein
                  dekh sakte ho.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Section 1: Check Points */}
            <div
              className={`bg-gradient-to-br from-white to-[#f8fdff] rounded-xl p-5 border shadow-sm ${
                isAlreadyFilled ? "border-green-200" : "border-[#b2ebf2]"
              }`}
            >
              <div
                className={`flex justify-between items-center pb-2 mb-4 border-b ${
                  isAlreadyFilled ? "border-green-400" : "border-cyan-500"
                }`}
              >
                <h2 className="text-base font-semibold text-slate-700">
                  Check Points
                </h2>

                <div className="flex items-center gap-2">
                  {isAlreadyFilled && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold border border-green-300">
                      🔒 Read Only
                    </span>
                  )}

                  <span className="bg-gradient-to-r from-[#b2ebf2] to-[#80deea] text-[#036a7a] px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                    {currentWeek}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr
                      className={
                        isAlreadyFilled ? "bg-green-50" : "bg-[#e0f7fa]"
                      }
                    >
                      <th className="border border-[#b2ebf2] p-3 text-left text-slate-700 font-medium w-16">
                        SR.NO.
                      </th>
                      <th className="border border-[#b2ebf2] p-3 text-left text-slate-700 font-medium">
                        Check Point
                      </th>
                      <th className="border border-[#b2ebf2] p-3 text-left text-slate-700 font-medium w-40">
                        Checking Method
                      </th>
                      <th className="border border-[#b2ebf2] p-3 text-left text-slate-700 font-medium w-24">
                        Status (Y/N)
                      </th>
                      <th className="border border-[#b2ebf2] p-3 text-left text-slate-700 font-medium">
                        Remarks
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {checkpoints.map((cp, index) => (
                      <tr
                        key={cp.id}
                        className={
                          isAlreadyFilled
                            ? "bg-green-50/30"
                            : "hover:bg-[#f8fdff]"
                        }
                      >
                        <td className="border border-[#b2ebf2] p-3 text-center text-slate-700">
                          {index + 1}
                        </td>

                        <td className="border border-[#b2ebf2] p-3 text-slate-700">
                          {cp.label}
                        </td>

                        <td className="border border-[#b2ebf2] p-3">
                          {isAlreadyFilled ? (
                            <div className={readonlyInput}>
                              {checkpointData[cp.id]?.checkingMethod || "-"}
                            </div>
                          ) : (
                            <select
                              value={
                                checkpointData[cp.id]?.checkingMethod ||
                                cp.defaultMethod
                              }
                              onChange={(e) =>
                                handleCheckpointChange(
                                  cp.id,
                                  "checkingMethod",
                                  e.target.value
                                )
                              }
                              className="w-full border border-[#b2ebf2] rounded px-2 py-1.5 text-sm text-slate-700 bg-white focus:outline-none focus:border-[#4fc3dc]"
                            >
                              <option value="VISUAL">VISUAL</option>
                              <option value="MANUAL">MANUAL</option>
                              <option value="INSPECTION">INSPECTION</option>
                              <option value="TESTING">TESTING</option>
                            </select>
                          )}
                        </td>

                        <td className="border border-[#b2ebf2] p-3">
                          {isAlreadyFilled ? (
                            <div
                              className={`${readonlyInput} text-center font-bold ${
                                checkpointData[cp.id]?.status === "Y"
                                  ? "text-green-600"
                                  : checkpointData[cp.id]?.status === "N"
                                  ? "text-red-500"
                                  : ""
                              }`}
                            >
                              {checkpointData[cp.id]?.status || "-"}
                            </div>
                          ) : (
                            <select
                              value={checkpointData[cp.id]?.status || ""}
                              onChange={(e) =>
                                handleCheckpointChange(
                                  cp.id,
                                  "status",
                                  e.target.value
                                )
                              }
                              className="w-full border border-[#b2ebf2] rounded px-2 py-1.5 text-sm text-slate-700 bg-white focus:outline-none focus:border-[#4fc3dc]"
                            >
                              <option value="">Select</option>
                              <option value="Y">Y</option>
                              <option value="N">N</option>
                            </select>
                          )}
                        </td>

                        <td className="border border-[#b2ebf2] p-3">
                          {isAlreadyFilled ? (
                            <div className={readonlyInput}>
                              {checkpointData[cp.id]?.remarks || "-"}
                            </div>
                          ) : (
                            <input
                              type="text"
                              placeholder="Enter remarks"
                              value={checkpointData[cp.id]?.remarks || ""}
                              onChange={(e) =>
                                handleCheckpointChange(
                                  cp.id,
                                  "remarks",
                                  e.target.value
                                )
                              }
                              className="w-full border border-[#b2ebf2] rounded px-2 py-1.5 text-sm text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:border-[#4fc3dc]"
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2: Cleaning Details */}
            <div
              className={`bg-gradient-to-br from-white to-[#f8fdff] rounded-xl p-5 border shadow-sm ${
                isAlreadyFilled ? "border-green-200" : "border-[#b2ebf2]"
              }`}
            >
              <div
                className={`flex justify-between items-center pb-2 mb-4 border-b ${
                  isAlreadyFilled ? "border-green-400" : "border-cyan-500"
                }`}
              >
                <h2 className="text-base font-semibold text-slate-700">
                  Cleaning Details
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr
                      className={
                        isAlreadyFilled ? "bg-green-50" : "bg-[#e0f7fa]"
                      }
                    >
                      <th className="border border-[#b2ebf2] p-3 text-left text-slate-700 font-medium">
                        Cleaning Detail
                      </th>
                      <th className="border border-[#b2ebf2] p-3 text-left text-slate-700 font-medium w-32">
                        Frequency
                      </th>
                      <th className="border border-[#b2ebf2] p-3 text-left text-slate-700 font-medium">
                        Remarks
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {cleaningDetails.map((detail) => (
                      <tr
                        key={detail.id}
                        className={
                          isAlreadyFilled
                            ? "bg-green-50/30"
                            : "hover:bg-[#f8fdff]"
                        }
                      >
                        <td className="border border-[#b2ebf2] p-3 text-slate-700">
                          {detail.label}
                        </td>

                        <td className="border border-[#b2ebf2] p-3">
                          {isAlreadyFilled ? (
                            <div className={readonlyInput}>
                              {cleaningData[detail.id]?.frequency || "-"}
                            </div>
                          ) : (
                            <input
                              type="number"
                              placeholder="Qty"
                              value={cleaningData[detail.id]?.frequency || ""}
                              onChange={(e) =>
                                handleCleaningChange(
                                  detail.id,
                                  "frequency",
                                  e.target.value
                                )
                              }
                              className="w-full border border-[#b2ebf2] rounded px-2 py-1.5 text-sm text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:border-[#4fc3dc]"
                            />
                          )}
                        </td>

                        <td className="border border-[#b2ebf2] p-3">
                          {isAlreadyFilled ? (
                            <div className={readonlyInput}>
                              {cleaningData[detail.id]?.remarks || "-"}
                            </div>
                          ) : (
                            <input
                              type="text"
                              placeholder="Enter remarks"
                              value={cleaningData[detail.id]?.remarks || ""}
                              onChange={(e) =>
                                handleCleaningChange(
                                  detail.id,
                                  "remarks",
                                  e.target.value
                                )
                              }
                              className="w-full border border-[#b2ebf2] rounded px-2 py-1.5 text-sm text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:border-[#4fc3dc]"
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 3: Maintenance Details */}
            <div
              className={`bg-gradient-to-br from-white to-[#f8fdff] rounded-xl p-5 border shadow-sm ${
                isAlreadyFilled ? "border-green-200" : "border-[#b2ebf2]"
              }`}
            >
              <div
                className={`flex justify-between items-center pb-2 mb-4 border-b ${
                  isAlreadyFilled ? "border-green-400" : "border-cyan-500"
                }`}
              >
                <h2 className="text-base font-semibold text-slate-700">
                  Maintenance Details
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr
                      className={
                        isAlreadyFilled ? "bg-green-50" : "bg-[#e0f7fa]"
                      }
                    >
                      <th className="border border-[#b2ebf2] p-3 text-left text-slate-700 font-medium">
                        Maintenance Detail
                      </th>
                      <th className="border border-[#b2ebf2] p-3 text-left text-slate-700 font-medium w-32">
                        Frequency
                      </th>
                      <th className="border border-[#b2ebf2] p-3 text-left text-slate-700 font-medium">
                        Remarks
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {maintenanceDetails.map((detail) => (
                      <tr
                        key={detail.id}
                        className={
                          isAlreadyFilled
                            ? "bg-green-50/30"
                            : "hover:bg-[#f8fdff]"
                        }
                      >
                        <td className="border border-[#b2ebf2] p-3 text-slate-700">
                          {detail.label}
                        </td>

                        <td className="border border-[#b2ebf2] p-3">
                          {isAlreadyFilled ? (
                            <div className={readonlyInput}>
                              {maintenanceData[detail.id]?.frequency || "-"}
                            </div>
                          ) : (
                            <input
                              type="number"
                              placeholder="Qty"
                              value={
                                maintenanceData[detail.id]?.frequency || ""
                              }
                              onChange={(e) =>
                                handleMaintenanceChange(
                                  detail.id,
                                  "frequency",
                                  e.target.value
                                )
                              }
                              className="w-full border border-[#b2ebf2] rounded px-2 py-1.5 text-sm text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:border-[#4fc3dc]"
                            />
                          )}
                        </td>

                        <td className="border border-[#b2ebf2] p-3">
                          {isAlreadyFilled ? (
                            <div className={readonlyInput}>
                              {maintenanceData[detail.id]?.remarks || "-"}
                            </div>
                          ) : (
                            <input
                              type="text"
                              placeholder="Enter remarks"
                              value={maintenanceData[detail.id]?.remarks || ""}
                              onChange={(e) =>
                                handleMaintenanceChange(
                                  detail.id,
                                  "remarks",
                                  e.target.value
                                )
                              }
                              className="w-full border border-[#b2ebf2] rounded px-2 py-1.5 text-sm text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:border-[#4fc3dc]"
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Form Actions */}
            {id ? (
              <div className="mt-6 border border-[#b2ebf2] rounded-xl p-5 bg-[#f8fdff]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                      Prepared By
                    </label>
                    <input
                      type="text"
                      value={preparedBy}
                      readOnly
                      className="px-3 py-2 border border-[#b2ebf2] rounded-lg bg-[#f0fffe] text-sm text-slate-700 w-full cursor-not-allowed"
                    />
                  </div>

                  {approvedBy && (
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                        Approved By
                      </label>
                      <input
                        type="text"
                        value={approvedBy}
                        readOnly
                        className="px-3 py-2 border border-[#b2ebf2] rounded-lg bg-[#f0fffe] text-sm text-slate-700 w-full cursor-not-allowed"
                      />
                    </div>
                  )}

                  {rejectedBy && (
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                        Rejected By
                      </label>
                      <input
                        type="text"
                        value={rejectedBy}
                        readOnly
                        className="px-3 py-2 border border-[#b2ebf2] rounded-lg bg-[#f0fffe] text-sm text-slate-700 w-full cursor-not-allowed"
                      />
                    </div>
                  )}

                  <div className="flex flex-col md:col-span-3">
                    <label className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                      Remark
                    </label>
                    <textarea
                      value={reviewRemark}
                      onChange={(e) => setReviewRemark(e.target.value)}
                      rows={3}
                      placeholder="Enter approval/rejection remark..."
                      className="w-full border border-[#b2ebf2] rounded-lg px-3 py-2 text-sm text-black bg-white placeholder-slate-400 focus:outline-none focus:border-[#4fc3dc]"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={isApproving || approvalStatus === "Approved"}
                    className="px-6 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-lg transition-all text-sm shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isApproving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Check size={16} />
                    )}
                    {isApproving ? "APPROVING..." : "APPROVE REPORT"}
                  </button>

                  <button
                    type="button"
                    onClick={handleReject}
                    disabled={isRejecting || approvalStatus === "Rejected"}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all text-sm shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isRejecting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <X size={16} />
                    )}
                    {isRejecting ? "REJECTING..." : "REJECT REPORT"}
                  </button>
                </div>
              </div>
            ) : isAlreadyFilled ? (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#b2ebf2] to-[#80deea] hover:from-[#80deea] hover:to-[#b2ebf2] text-[#036a7a] font-medium rounded-lg transition-all text-sm shadow-sm hover:shadow-md"
                >
                  ← Back to Production Hub
                </button>
              </div>
            ) : (
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
                  onClick={resetForm}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#ffb2b2] to-[#ff8080] hover:from-[#ff8080] hover:to-[#ffb2b2] text-white font-medium rounded-lg transition-all text-sm shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                >
                  Reset Form
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#b2ebf2] to-[#80deea] hover:from-[#80deea] hover:to-[#b2ebf2] text-[#036a7a] font-medium rounded-lg transition-all text-sm shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                >
                  Save Record for {currentWeek}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default BinTrollingForm;