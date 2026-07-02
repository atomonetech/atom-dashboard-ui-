import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, FileText, UserCheck, Eye, RotateCcw, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { useReadOnlyMode } from "../../../../../hooks/useReadOnlyMode";
import axios from 'axios';

const DeviationApprovalForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isViewMode = Boolean(id);

  const currentUser = localStorage.getItem("username") || "Unknown User";
  const isReadOnly = useReadOnlyMode();
 // Agar ID hai toh form Read-Only (View) mode mein chala jayega

  const gradientColors = {
    start: "#4158D0",
    middle: "#C850C0",
    end: "#FFCC70",
  };

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";
  const API_SAVE = `${API_BASE}/api/save-deviation/`;
  const API_LOG = `${API_BASE}/api/log-report/`;
  const API_APPROVE = `${API_BASE}/api/approve-report/`;
  const API_REJECT = `${API_BASE}/api/reject-report/`;

  const [formData, setFormData] = useState({
    toolNameNo: "",
    location: "",
    problem: "",
    reasonForDeviation: "",
    date: "",
    duration: "",
    prodIncharge: "",
    qaIncharge: "",
    remarks: "",
  });

  const [currentDate, setCurrentDate] = useState("");
  const [preparedBy, setPreparedBy] = useState("");

  const [approvalStatus, setApprovalStatus] = useState("Pending");
  const [reviewApprovedBy, setReviewApprovedBy] = useState("");
  const [reviewRejectedBy, setReviewRejectedBy] = useState("");
  const [reviewRemark, setReviewRemark] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const formatDateForDisplay = (dateValue) => {
    if (!dateValue) return "";

    const cleanDate = String(dateValue).split(" ")[0];
    const parts = cleanDate.split("-");

    if (parts.length === 3) {
      return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }

    return cleanDate;
  };

  const getTodayData = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    return {
      dbDate: `${yyyy}-${mm}-${dd}`,
      displayDate: `${dd}.${mm}.${yyyy}`,
    };
  };

  useEffect(() => {
    if (isViewMode) {
      const fetchReportData = async () => {
        try {
          const res = await axios.get(
            `${API_BASE}/api/get-single-report/deviation-view/${id}/`
          );

          if (res.data.success) {
            const data = res.data.data || {};
            const statusText = data.status || "";

            console.log("VIEW DEVIATION DATA:", data);

            setFormData({
              toolNameNo: data.toolNameNo || data.tool_name_no || "",
              location: data.location || "",
              problem: data.problem || "",
              reasonForDeviation:
                data.reasonForDeviation || data.reason_for_deviation || "",
              date: data.date || "",
              duration: data.duration || "",
              prodIncharge: data.prodIncharge || data.prod_incharge || "",
              qaIncharge: data.qaIncharge || data.qa_incharge || "",
              remarks: data.remarks || "",
            });

            setCurrentDate(formatDateForDisplay(data.date));

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
        } catch (error) {
          console.error("Failed to load report data", error);
          alert("Failed to load report data.");
        }
      };

      fetchReportData();
    } else {
      const todayInfo = getTodayData();

      setCurrentDate(todayInfo.displayDate);

      setFormData((prev) => ({
        ...prev,
        date: todayInfo.dbDate,
      }));
    }
  }, [id, isViewMode, API_BASE]);

  const handleInputChange = (e) => {
    if (isViewMode) return;

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      tool_name_no: formData.toolNameNo,
      location: formData.location,
      problem: formData.problem,
      reason_for_deviation: formData.reasonForDeviation,
      date: formData.date,
      duration: formData.duration,
      prod_incharge: formData.prodIncharge,
      qa_incharge: formData.qaIncharge,
      remarks: formData.remarks,
      submitted_by: currentUser,
    };

    try {
      const response = await axios.post(API_SAVE, dataToSave);

      if (response.status === 201 || response.status === 200) {
        const savedRecordId = response.data.record_id;

        try {
          await axios.post(API_LOG, {
            username: currentUser,
            report_name: "Deviation Approval Form",
            record_id: savedRecordId,
            form_key: "deviation",
            hub: "qa-hub",
            department_name: "Plant 2 (QA)",
            target_group: "Quality_Approvers",
          });
        } catch (logError) {
          console.error("Activity log error:", logError);
          alert("Form saved, but notification not created.");
        }

        alert("Deviation Approval Form Saved to Database Successfully!");
        navigate(-1);
      }
    } catch (error) {
      console.error("Error saving data:", error);

      if (error.response) {
        alert(
          `❌ Backend Error: ${
            error.response.data.error ||
            error.response.data.message ||
            "Failed to save data"
          }`
        );
      } else {
        alert("Failed to save data. Please check backend connection.");
      }
    }
  };

  const handleReset = () => {
    if (isViewMode) return;

    const todayInfo = getTodayData();

    setCurrentDate(todayInfo.displayDate);

    setFormData({
      toolNameNo: "",
      location: "",
      problem: "",
      reasonForDeviation: "",
      date: todayInfo.dbDate,
      duration: "",
      prodIncharge: "",
      qaIncharge: "",
      remarks: "",
    });
  };

  const getInputClass = () => {
    const baseClass =
      "w-full px-3 py-2 border-2 rounded-lg outline-none transition-all text-sm ";

    if (isViewMode) {
      return (
        baseClass +
        "bg-slate-100 border-transparent cursor-not-allowed text-slate-700 font-medium"
      );
    }

    return (
      baseClass +
      "border-slate-100 bg-slate-50 focus:bg-white focus:border-[#4158D0] text-slate-700"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-2 px-3 sm:py-3 sm:px-4 md:py-4 font-sans">
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div
            className="px-4 py-3 sm:px-5 sm:py-4"
            style={{
              background: `linear-gradient(135deg, ${gradientColors.start}, ${gradientColors.middle}, ${gradientColors.end})`,
            }}
          >
            <div className="mb-3 sm:mb-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-1.5 text-white hover:text-white/90 transition-all rounded-lg bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 group border-none cursor-pointer"
              >
                <ArrowLeft
                  size={18}
                  className="transition-transform group-hover:-translate-x-1"
                />
                <span className="text-xs sm:text-sm font-medium">Back</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <AlertTriangle
                  size={24}
                  className="text-white sm:w-6 sm:h-6 md:w-7 md:h-7"
                />

                <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white">
                  DEVIATION APPROVAL FORM{" "}
                  {isViewMode && `(REVIEW - ${approvalStatus})`}
                </h1>
              </div>

              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg">
                <Calendar
                  size={14}
                  className="text-white sm:w-4 sm:h-4 md:w-5 md:h-5"
                />
                <span className="text-xs sm:text-sm md:text-base font-semibold text-white">
                  {currentDate}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-4 sm:p-5 md:p-6">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                <FileText size={18} className="text-[#4158D0]" />
                <h2 className="text-sm sm:text-base font-semibold text-gray-800">
                  Deviation Details
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-1.5">
                  <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase">
                    TOOL NAME/NO.{" "}
                    {!isViewMode && <span className="text-red-500">*</span>}
                  </label>

                  <input
                    type="text"
                    name="toolNameNo"
                    value={formData.toolNameNo}
                    onChange={handleInputChange}
                    readOnly={isViewMode}
                    className={getInputClass()}
                    placeholder="Enter tool name/number"
                    required={!isViewMode}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase">
                    LOCATION{" "}
                    {!isViewMode && <span className="text-red-500">*</span>}
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    readOnly={isViewMode}
                    className={getInputClass()}
                    placeholder="Enter location"
                    required={!isViewMode}
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase">
                    PROBLEM{" "}
                    {!isViewMode && <span className="text-red-500">*</span>}
                  </label>

                  <input
                    type="text"
                    name="problem"
                    value={formData.problem}
                    onChange={handleInputChange}
                    readOnly={isViewMode}
                    className={getInputClass()}
                    placeholder="Describe the problem"
                    required={!isViewMode}
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase">
                    REASON FOR DEVIATION{" "}
                    {!isViewMode && <span className="text-red-500">*</span>}
                  </label>

                  <textarea
                    name="reasonForDeviation"
                    value={formData.reasonForDeviation}
                    onChange={handleInputChange}
                    readOnly={isViewMode}
                    rows="3"
                    className={`${getInputClass()} resize-y`}
                    placeholder="Enter detailed reason for deviation"
                    required={!isViewMode}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 md:p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                <Clock size={18} className="text-[#4158D0]" />
                <h2 className="text-sm sm:text-base font-semibold text-gray-800">
                  Time & Signatures
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                <div className="space-y-1.5">
                  <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase">
                    DURATION{" "}
                    {!isViewMode && <span className="text-red-500">*</span>}
                  </label>

                  <div className="relative">
                    <Clock
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      readOnly={isViewMode}
                      className={`${getInputClass()} pl-9 pr-3`}
                      placeholder="e.g., 2 hours, 1 day"
                      required={!isViewMode}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase">
                    PROD. INCHARGE
                  </label>

                  <div className="relative">
                    <UserCheck
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      name="prodIncharge"
                      value={formData.prodIncharge}
                      onChange={handleInputChange}
                      readOnly={isViewMode}
                      className={`${getInputClass()} pl-9 pr-3`}
                      placeholder="Enter name"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase">
                    QA INCHARGE
                  </label>

                  <div className="relative">
                    <UserCheck
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      name="qaIncharge"
                      value={formData.qaIncharge}
                      onChange={handleInputChange}
                      readOnly={isViewMode}
                      className={`${getInputClass()} pl-9 pr-3`}
                      placeholder="Enter name"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 md:p-6 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                <FileText size={18} className="text-[#4158D0]" />
                <h2 className="text-sm sm:text-base font-semibold text-gray-800">
                  REMARKS
                </h2>
              </div>

              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                readOnly={isViewMode}
                rows="2"
                className={`${getInputClass()} resize-y`}
                placeholder="Under deviation produced parts will be checked 100% visually as well as dimensionally"
              />
            </div>

            {isViewMode && (
              <div className="p-4 sm:p-5 md:p-6 border-t border-gray-200 bg-white">
                <div className="bg-purple-50 border-2 border-purple-100 rounded-xl p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase mb-0.5">
                        Prepared By
                      </p>
                      <p className="text-lg font-black text-[#4158D0] capitalize m-0">
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

                  <label className="block text-[10px] sm:text-xs font-black text-[#4158D0] uppercase mb-1.5">
                    Approval / Rejection Remark
                  </label>

                  <textarea
                    value={reviewRemark}
                    onChange={(e) => setReviewRemark(e.target.value)}
                    rows="3"
                    className="w-full border-2 border-slate-200 rounded-lg p-2 text-sm focus:border-[#4158D0] focus:ring-2 focus:ring-purple-100 outline-none text-slate-700 transition-all resize-y bg-white"
                    placeholder="Enter approval/rejection remark..."
                  />
                </div>
              </div>
            )}
            { !isReadOnly&&(
            <div className="px-4 sm:px-5 md:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 flex flex-col-reverse sm:flex-row gap-3 justify-between items-stretch sm:items-center">
              <div className="w-full sm:w-auto"></div>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                {!isViewMode && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-slate-200 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all text-xs uppercase font-bold"
                  >
                    <RotateCcw size={14} /> Clear Form
                  </button>
                )}

                {isViewMode ? (
                  <>
                    <button
                      type="button"
                      onClick={handleApprove}
                      disabled={isApproving || approvalStatus === "Approved"}
                      className="flex items-center justify-center gap-2 px-5 py-2 text-white rounded-lg hover:opacity-90 transition-all font-bold uppercase tracking-wide text-xs shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ background: "#10b981" }}
                    >
                      <CheckCircle2 size={16} />
                      {isApproving ? "Approving..." : "Approve Report"}
                    </button>

                    <button
                      type="button"
                      onClick={handleReject}
                      disabled={isRejecting || approvalStatus === "Rejected"}
                      className="flex items-center justify-center gap-2 px-5 py-2 text-white rounded-lg hover:opacity-90 transition-all font-bold uppercase tracking-wide text-xs shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ background: "#dc2626" }}
                    >
                      <XCircle size={16} />
                      {isRejecting ? "Rejecting..." : "Reject Report"}
                    </button>
                  </>
                ) : (
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 px-5 py-2 text-white rounded-lg hover:opacity-90 transition-all font-bold uppercase tracking-wide text-xs shadow-md hover:shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${gradientColors.start}, ${gradientColors.middle}, ${gradientColors.end})`,
                    }}
                  >
                    <Eye size={14} /> Submit for Approval
                  </button>
                )}
              </div>
            </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeviationApprovalForm;