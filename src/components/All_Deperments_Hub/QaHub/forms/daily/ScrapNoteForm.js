import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ScrapNoteForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isViewMode = Boolean(id);
  const currentUser = localStorage.getItem("username") || "Unknown User";

  const today = new Date().toISOString().split("T")[0];

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const API_BASE = `${API_BASE_URL}/api/master-dropdown`;
  const API_SAVE = `${API_BASE_URL}/api/scrap-note/save/`;
  const API_LOG = `${API_BASE_URL}/api/log-report/`;
  const API_APPROVE = `${API_BASE_URL}/api/approve-report/`;
  const API_REJECT = `${API_BASE_URL}/api/reject-report/`;

  const initialState = {
    date: today,
    partName: "",
    partNo: "N/A",
    defect: "",
    qty: "",
    remark: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [partDatabase, setPartDatabase] = useState([]);
  const [defectOptions, setDefectOptions] = useState([]);
  const [preparedBy, setPreparedBy] = useState("");

  const [approvalStatus, setApprovalStatus] = useState("Pending");
  const [reviewApprovedBy, setReviewApprovedBy] = useState("");
  const [reviewRejectedBy, setReviewRejectedBy] = useState("");
  const [reviewRemark, setReviewRemark] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_BASE}?filter=all_parts`)
      .then((response) => {
        setPartDatabase(response.data || []);
      })
      .catch((error) => console.error("Error fetching parts:", error));

    if (isViewMode) {
      axios
        .get(`${API_BASE_URL}/api/get-single-report/scrap/${id}/`)
        .then((res) => {
          if (res.data.success) {
            const data = res.data.data;
            const statusText = data.status || "";

            setFormData({
              date: data.entry_date || data.date || today,
              partName: data.part_name || "",
              partNo: data.part_no || "N/A",
              defect: data.defect_detail || "",
              qty: data.quantity || "",
              remark:
                data.form_remarks ||
                data.scrap_remarks ||
                data.note_remarks ||
                data.report_remarks ||
                data.remarks ||
                "",
            });

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
                ""
            );
          }
        })
        .catch((err) => console.error("Failed to load report data", err));
    }
  }, [id, isViewMode, today, API_BASE_URL, API_BASE]);

  const handlePartChange = (e) => {
    if (isViewMode) return;

    const selectedPartName = e.target.value;

    const matched = partDatabase.find((p) => {
      if (Array.isArray(p)) return p[0] === selectedPartName;
      return p?.part_name === selectedPartName || p === selectedPartName;
    });

    setFormData((prev) => ({
      ...prev,
      partName: selectedPartName,
      partNo: Array.isArray(matched)
        ? matched[1] || "N/A"
        : matched?.part_no || "N/A",
      defect: "",
    }));

    setDefectOptions([]);
  };

  const handleChange = (e) => {
    if (isViewMode) return;

    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isViewMode) return;

    const dataToSave = {
      entry_date: formData.date,
      part_name: formData.partName,
      part_no: formData.partNo,
      defect_detail: formData.defect,
      quantity: formData.qty,
      remarks: formData.remark,
      submitted_by: currentUser,
    };

    try {
      const response = await axios.post(API_SAVE, dataToSave);

      if (response.status === 201 || response.status === 200) {
        const savedRecordId = response.data.record_id;

        try {
          await axios.post(API_LOG, {
            username: currentUser,
            report_name: "Scrap Note",
            record_id: savedRecordId,
            department_name: "Plant 2 (QA)",
            target_group: "Quality_Approvers",
          });
        } catch (logError) {
          console.error("Activity log error:", logError);
          alert("Form saved, but notification not created.");
        }

        alert("Scrap Entry Saved Successfully to Database!");
        navigate(-1);
      }
    } catch (error) {
      console.error("Error saving scrap entry:", error.response?.data || error);
      alert("Error saving data. Please check your backend connection.");
    }
  };

  const handleClear = () => {
    if (isViewMode) return;

    setFormData(initialState);
    setDefectOptions([]);
  };

  const getInputClass = (baseClasses = "") => {
    const defaultClasses =
      "w-full border-2 rounded-lg p-2 text-sm outline-none transition-all shadow-sm ";

    if (isViewMode) {
      return `${defaultClasses} ${baseClasses} bg-slate-100 border-transparent cursor-not-allowed text-slate-500 font-bold`;
    }

    return `${defaultClasses} ${baseClasses} bg-slate-50 border-slate-100 focus:bg-white focus:border-slate-500 text-slate-700 font-bold`;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-2 px-3 sm:py-3 sm:px-4 md:py-4 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <div
          className="bg-white rounded-xl shadow-xl overflow-hidden border-t-4"
          style={{ borderColor: "#f04343" }}
        >
          <div className="bg-gradient-to-r from-white to-red-50 px-4 py-3 sm:px-5 sm:py-4 border-b border-slate-100">
            <div className="mb-2 sm:mb-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg shadow-md transition-all active:scale-95 group border-none cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-3.5 h-3.5 mr-1.5 transition-transform group-hover:-translate-x-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
                Back
              </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className="p-1.5 sm:p-2 rounded-lg text-white shadow-lg shrink-0"
                  style={{ backgroundColor: "#f04343" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                </div>

                <div>
                  <h2 className="text-sm sm:text-base md:text-lg font-black text-slate-800 m-0 uppercase tracking-tight">
                    Scrap Entry Form{" "}
                    {isViewMode && (
                      <span style={{ color: "#f04343" }}>
                        (REVIEW - {approvalStatus})
                      </span>
                    )}
                  </h2>
                  <p className="text-slate-500 text-[8px] sm:text-[9px] font-medium">
                    Quality Assurance & Production Control
                  </p>
                </div>
              </div>

              <div className="w-full sm:w-auto bg-white border-2 border-red-100 rounded-lg px-2 py-1.5 flex items-center justify-between sm:justify-center gap-2 shadow-sm">
                <span className="text-[8px] sm:text-[9px] font-black text-red-600 uppercase whitespace-nowrap">
                  Entry Date
                </span>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  disabled={isViewMode}
                  className={`text-xs font-bold outline-none bg-transparent ${
                    isViewMode
                      ? "text-slate-500 cursor-not-allowed"
                      : "text-slate-700 cursor-pointer"
                  }`}
                />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
              <div>
                <label className="block text-[9px] sm:text-[10px] font-black text-slate-500 mb-1 uppercase">
                  Part Name {!isViewMode && <span className="text-red-500">*</span>}
                </label>

                {isViewMode ? (
                  <input
                    value={formData.partName}
                    disabled
                    className={getInputClass()}
                  />
                ) : (
                  <select
                    name="partName"
                    value={formData.partName}
                    onChange={handlePartChange}
                    className={getInputClass()}
                    required
                  >
                    <option value="" disabled>
                      -- Select Part --
                    </option>

                    {partDatabase.map((part, idx) => {
                      const partName = Array.isArray(part)
                        ? part[0]
                        : part?.part_name || part;

                      return (
                        <option key={idx} value={partName}>
                          {partName}
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-[9px] sm:text-[10px] font-black text-slate-500 mb-1 uppercase">
                  Part Number
                </label>

                <input
                  name="partNo"
                  value={formData.partNo}
                  readOnly
                  className="w-full bg-slate-100 border-2 border-transparent rounded-lg p-2 text-sm text-slate-500 font-bold cursor-not-allowed shadow-sm"
                  placeholder="Auto-filled"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
              <div>
                <label className="block text-[9px] sm:text-[10px] font-black text-slate-500 mb-1 uppercase">
                  Defect Detail{" "}
                  {!isViewMode && <span className="text-red-500">*</span>}
                </label>

                <input
                  name="defect"
                  value={formData.defect}
                  onChange={handleChange}
                  placeholder="Enter Defect Detail"
                  className={getInputClass()}
                  required={!isViewMode}
                  disabled={!formData.partName || isViewMode}
                />
              </div>

              <div>
                <label className="block text-[9px] sm:text-[10px] font-black text-slate-500 mb-1 uppercase">
                  Quantity (NOS){" "}
                  {!isViewMode && <span className="text-red-500">*</span>}
                </label>

                <div className="flex">
                  <input
                    name="qty"
                    value={formData.qty}
                    onChange={handleChange}
                    type="number"
                    className={getInputClass(
                      "rounded-r-none border-r-0 text-center"
                    )}
                    placeholder="0"
                    required={!isViewMode}
                    readOnly={isViewMode}
                  />

                  <span
                    className={`px-3 py-2 border-2 border-l-0 rounded-r-lg font-black text-[10px] flex items-center ${
                      isViewMode
                        ? "bg-slate-100 border-transparent text-slate-400"
                        : "bg-slate-100 border-slate-100 text-slate-500"
                    }`}
                  >
                    NOS
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[9px] sm:text-[10px] font-black text-slate-500 mb-1 uppercase">
                Remarks
              </label>

              <textarea
                name="remark"
                value={formData.remark}
                onChange={handleChange}
                rows="2"
                className={getInputClass("resize-y font-medium")}
                placeholder="Additional notes..."
                readOnly={isViewMode}
              />
            </div>

            {isViewMode && (
              <div className="mb-4 bg-white border-2 border-red-100 rounded-lg p-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase mb-0.5">
                      Prepared By
                    </p>
                    <p className="text-lg font-black text-red-600 capitalize m-0">
                      {preparedBy || "—"}
                    </p>
                  </div>

                  {reviewApprovedBy && (
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase mb-0.5">
                        Review Approved By
                      </p>
                      <p className="text-lg font-black text-green-600 capitalize m-0">
                        {reviewApprovedBy}
                      </p>
                    </div>
                  )}

                  {reviewRejectedBy && (
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase mb-0.5">
                        Review Rejected By
                      </p>
                      <p className="text-lg font-black text-red-600 capitalize m-0">
                        {reviewRejectedBy}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase mb-0.5">
                      Review Status
                    </p>
                    <p
                      className={`text-lg font-black capitalize m-0 ${
                        approvalStatus === "Approved"
                          ? "text-green-600"
                          : approvalStatus === "Rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {approvalStatus}
                    </p>
                  </div>
                </div>

                <label className="block text-[10px] sm:text-xs font-black text-red-600 uppercase mb-1.5">
                  Approval / Rejection Remark
                </label>

                <textarea
                  value={reviewRemark}
                  onChange={(e) => setReviewRemark(e.target.value)}
                  rows="3"
                  className="w-full border-2 border-slate-200 rounded-lg p-2 text-sm focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none text-slate-700 transition-all resize-y"
                  placeholder="Enter approval/rejection remark..."
                />
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row gap-2 justify-between items-stretch sm:items-center border-t border-slate-100 pt-3">
              <div className="w-full sm:w-auto"></div>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                {!isViewMode && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-4 py-2 rounded-lg font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all text-xs uppercase tracking-wide border border-slate-200 hover:border-red-200 shadow-sm cursor-pointer"
                  >
                    Clear Form
                  </button>
                )}

                {isViewMode ? (
                  <>
                    <button
                      type="button"
                      onClick={handleApprove}
                      disabled={isApproving || approvalStatus === "Approved"}
                      className="px-5 py-2 rounded-lg text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 uppercase font-black tracking-wider text-xs border-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ backgroundColor: "#10b981" }}
                    >
                      {isApproving ? "Approving..." : "✓ Approve Report"}
                    </button>

                    <button
                      type="button"
                      onClick={handleReject}
                      disabled={isRejecting || approvalStatus === "Rejected"}
                      className="px-5 py-2 rounded-lg text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 uppercase font-black tracking-wider text-xs border-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ backgroundColor: "#f04343" }}
                    >
                      {isRejecting ? "Rejecting..." : "✕ Reject Report"}
                    </button>
                  </>
                ) : (
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 uppercase font-black tracking-wider text-xs border-none cursor-pointer"
                    style={{ backgroundColor: "#f04343" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                    </svg>
                    Save Entry
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScrapNoteForm;