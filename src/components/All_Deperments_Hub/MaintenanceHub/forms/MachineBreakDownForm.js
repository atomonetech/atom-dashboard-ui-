import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Save,
  RotateCcw,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const initialFormState = {
  givenDate: "",
  givenTime: "",
  machineNameNo: "",
  breakdownName: "",
  partMadeAfterInspection: "",
  breakdownDesc: "",
  repairDate: "",
  repairTime: "",
  repairHours: "",
  mechanicsCount: "",
  repairDesc: "",
  status: "OK",
  verificationDate: "",
  verificationTime: "",
};

const MachineBreakDownForm = () => {
  const navigate = useNavigate();
  const { formKey, reportId, id } = useParams();

  const currentFormKey = formKey || "machine-breakdown";
  const currentReportId = reportId || id;
  const isViewMode = Boolean(currentReportId);

  const [language, setLanguage] = useState("english");
  const [formData, setFormData] = useState(initialFormState);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [preparedBy, setPreparedBy] = useState("");

  const [approvalRemark, setApprovalRemark] = useState("");
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState("");
  const [reviewedAt, setReviewedAt] = useState("");

  const content = {
    english: {
      title: "TOOL / MACHINE BREAKDOWN INTIMATION FORM",
      givenOn: "Given on Date",
      givenAt: "Given at Time",
      machineName: "Machine / Engine Name & No.",
      breakdownName: "Name of the Breakdown",
      partMadeAfterInspection: "Part made after last inspection",
      breakdownDetails: "Breakdown Details",
      maintenanceOnly: "(FOR MAINTENANCE DEPTT. USE ONLY)",
      repairDate: "Repair Date",
      repairTime: "Repair Time",
      hoursTaken: "Hours taken for repair",
      mechanicsInvolved: "No. of mechanics involved",
      repairDescription: "Repair Description",
      verification: "VERIFICATION BY QUALITY",
      statusOfProblem: "STATUS OF PROBLEM",
      ok: "OK",
      ng: "NG",
      date: "Date",
      time: "Time",
      restButton: "Reset Form",
      back: "Back to Maintenance Hub",
      submit: "Submit Form",
      submitting: "Submitting...",
      success: "Form submitted successfully!",
      resetConfirm: "Are you sure you want to reset all fields?",
    },
    hindi: {
      title: "टूल / मशीन ब्रेकडाउन सूचना पर्ची",
      givenOn: "किस तारीख को दिया",
      givenAt: "किस समय दिया",
      machineName: "मशीन / इंजन का नाम व नंबर",
      breakdownName: "ब्रेकडाउन का नाम",
      partMadeAfterInspection: "अंतिम निरीक्षण के बाद बना भाग",
      breakdownDetails: "ब्रेकडाउन के बारे में विस्तार से लिखें",
      maintenanceOnly: "(केवल रखरखाव विभाग के लिए)",
      repairDate: "मरम्मत तिथि",
      repairTime: "मरम्मत समय",
      hoursTaken: "मरम्मत में लगा समय (घंटे)",
      mechanicsInvolved: "कितने मैकेनिक लगे",
      repairDescription: "मरम्मत का विवरण",
      verification: "गुणवत्ता विभाग द्वारा जांच",
      statusOfProblem: "समस्या की स्थिति",
      ok: "सही",
      ng: "गलत",
      date: "तिथि",
      time: "समय",
      restButton: "फॉर्म रीसेट करें",
      back: "मेंटेनेंस हब पर वापस",
      submit: "फॉर्म जमा करें",
      submitting: "जमा हो रहा है...",
      success: "फॉर्म सफलतापूर्वक जमा हो गया!",
      resetConfirm: "क्या आप सभी फ़ील्ड रीसेट करना चाहते हैं?",
    },
  };

  const currentLang = language === "english" ? content.english : content.hindi;

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const inputClass =
    "w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:border-transparent text-sm text-slate-700 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed";

  const isAlreadyReviewed =
    approvalStatus &&
    (approvalStatus.toLowerCase().includes("approved") ||
      approvalStatus.toLowerCase().includes("rejected"));

  useEffect(() => {
    const fetchReportData = async () => {
      if (!currentReportId) return;

      try {
        const response = await axios.get(
          `${BASE_URL}/api/get-single-maintenance-report/${currentFormKey}/${currentReportId}/`,
        );

        console.log("🔥 VIEW REPORT RESPONSE =", response.data);

        if (response.data?.success) {
          const apiData = response.data.data || {};
          const loadedFormData = apiData.formData || apiData;

          setFormData((prev) => ({
            ...prev,
            ...loadedFormData,
          }));

          setLanguage(apiData.language || "english");
          setPreparedBy(apiData.prepared_by || apiData.submitted_by || "");

          setApprovalRemark(apiData.approval_remarks || "");
          setApprovalStatus(apiData.approval_status || "");
          setReviewedAt(apiData.approved_or_rejected_at || "");
        } else {
          alert(response.data?.error || "Report data not found.");
        }
      } catch (error) {
        console.error("View report fetch error:", error);
        alert(
          error.response?.data?.error ||
            "❌ Could not load report data from notification.",
        );
      }
    };

    fetchReportData();
  }, [currentFormKey, currentReportId]);

  const handleInputChange = (e) => {
    if (isViewMode) return;

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setPreparedBy("");
    setShowResetConfirm(false);
  };

  const handleResetClick = () => {
    if (isViewMode) return;
    setShowResetConfirm(true);
  };

  const handleCancelReset = () => {
    setShowResetConfirm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isViewMode) return;

    setIsSubmitting(true);

    const currentUser = localStorage.getItem("username") || "Unknown User";

    const submissionData = {
      ...formData,
      language,
      username: currentUser,
      prepared_by: preparedBy || currentUser,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/machine-breakdown-slip/save/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      console.log("🔥 Machine Breakdown Save Response =", result);

      if (result.success || response.ok) {
        if (!result.log_id) {
          alert(
            "Breakdown form saved, but log_id missing. Backend did not create ReportActivityLog / notification.",
          );
          return;
        }

        setShowSuccess(true);

        alert(
          `✅ Success: Breakdown report submitted successfully. Log ID: ${result.log_id}`,
        );

        resetForm();

        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        alert("❌ Error: " + (result.error || "Failed to submit form"));
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("❌ Network Error: Could not connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async () => {
    try {
      setApprovalLoading(true);

      const currentUser = localStorage.getItem("username") || "Approver";

      const res = await axios.post(`${BASE_URL}/api/approve-report/`, {
        log_id: currentReportId,
        approver_username: currentUser,
        remarks: approvalRemark,
      });

      alert(res.data?.message || "Report approved successfully.");
      navigate("/notifications");
    } catch (err) {
      console.error("Approve error:", err);
      alert(err.response?.data?.error || "Approval failed.");
    } finally {
      setApprovalLoading(false);
    }
  };

  const handleReject = async () => {
    if (!approvalRemark.trim()) {
      alert("Please enter remark before rejecting.");
      return;
    }

    try {
      setApprovalLoading(true);

      const currentUser = localStorage.getItem("username") || "Approver";

      const res = await axios.post(`${BASE_URL}/api/reject-report/`, {
        log_id: currentReportId,
        approver_username: currentUser,
        remarks: approvalRemark,
      });

      alert(res.data?.message || "Report rejected successfully.");
      navigate("/notifications");
    } catch (err) {
      console.error("Reject error:", err);
      alert(err.response?.data?.error || "Reject failed.");
    } finally {
      setApprovalLoading(false);
    }
  };

  const handleBack = () => {
    if (isViewMode) {
      navigate("/notifications");
      return;
    }

    navigate("/Maintenance/Machine/daily");
  };

  const toggleLanguage = () => {
    if (isViewMode) return;

    setLanguage((prev) => (prev === "english" ? "hindi" : "english"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-[#ef4444] transition-colors bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md cursor-pointer"
            type="button"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="text-sm sm:text-base font-medium">
              {isViewMode ? "Back to Notifications" : currentLang.back}
            </span>
          </button>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            {isViewMode && (
              <div className="bg-blue-50 px-4 py-2 rounded-lg shadow-sm border border-blue-200">
                <span className="text-sm text-blue-600 font-black">
                  Review Mode
                </span>
              </div>
            )}

            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-sm text-gray-600 font-medium">
                {currentDate}
              </span>
            </div>

            <button
              onClick={toggleLanguage}
              disabled={isViewMode}
              className="px-4 py-2 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white rounded-lg hover:from-[#dc2626] hover:to-[#b91c1c] transition-all shadow-sm hover:shadow-md text-sm font-medium min-w-[80px] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              type="button"
            >
              {language === "english" ? "हिंदी" : "English"}
            </button>
          </div>
        </div>

        {isViewMode && approvalStatus && (
          <div className="mb-4 bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-xs font-black text-gray-500 uppercase mb-1">
                  Current Status
                </p>

                <p
                  className={`font-black ${
                    approvalStatus.toLowerCase().includes("approved")
                      ? "text-green-600"
                      : approvalStatus.toLowerCase().includes("rejected")
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {approvalStatus}
                </p>
              </div>

              {reviewedAt && (
                <div className="sm:text-right">
                  <p className="text-xs font-black text-gray-500 uppercase mb-1">
                    Reviewed At
                  </p>

                  <p className="font-bold text-gray-700">{reviewedAt}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {showSuccess && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-sm animate-fade-in">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              <span className="font-medium">{currentLang.success}</span>
            </div>
          </div>
        )}

        {showResetConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {currentLang.resetConfirm}
              </h3>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancelReset}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                  type="button"
                >
                  Cancel
                </button>

                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white rounded-lg hover:from-[#dc2626] hover:to-[#b91c1c] transition-all cursor-pointer"
                  type="button"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow-xl rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-[#ef4444] via-[#dc2626] to-[#b91c1c] px-4 sm:px-6 py-4 sm:py-5">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white text-center tracking-tight">
              {currentLang.title}
            </h1>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8"
          >
            <div className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    {currentLang.breakdownName}{" "}
                    <span className="text-[#ef4444]">*</span>
                  </label>

                  <input
                    type="text"
                    name="breakdownName"
                    value={formData.breakdownName}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    placeholder={
                      language === "english"
                        ? "Enter breakdown name"
                        : "ब्रेकडाउन का नाम दर्ज करें"
                    }
                    className={inputClass}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    {currentLang.partMadeAfterInspection}{" "}
                    <span className="text-[#ef4444]">*</span>
                  </label>

                  <input
                    type="text"
                    name="partMadeAfterInspection"
                    value={formData.partMadeAfterInspection}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    placeholder={
                      language === "english"
                        ? "Enter part details"
                        : "भाग का विवरण दर्ज करें"
                    }
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  {currentLang.machineName}{" "}
                  <span className="text-[#ef4444]">*</span>
                </label>

                <input
                  type="text"
                  name="machineNameNo"
                  value={formData.machineNameNo}
                  onChange={handleInputChange}
                  disabled={isViewMode}
                  placeholder={
                    language === "english" ? "e.g., 3.00 No.S" : "उदा., 3.00 नं.एस"
                  }
                  className={inputClass}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    {currentLang.givenOn}{" "}
                    <span className="text-[#ef4444]">*</span>
                  </label>

                  <input
                    type="date"
                    name="givenDate"
                    value={formData.givenDate}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    className={inputClass}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    {currentLang.givenAt}{" "}
                    <span className="text-[#ef4444]">*</span>
                  </label>

                  <input
                    type="time"
                    name="givenTime"
                    value={formData.givenTime}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  {currentLang.breakdownDetails}{" "}
                  <span className="text-[#ef4444]">*</span>
                </label>

                <textarea
                  name="breakdownDesc"
                  value={formData.breakdownDesc}
                  onChange={handleInputChange}
                  disabled={isViewMode}
                  rows="3"
                  placeholder={
                    language === "english"
                      ? "Describe the breakdown in detail"
                      : "ब्रेकडाउन के बारे में विस्तार से लिखें"
                  }
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="border-t-2 border-gray-200"></div>

            <div className="space-y-4 sm:space-y-5">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 border-b-2 border-[#ef4444] pb-2">
                {currentLang.maintenanceOnly}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    {currentLang.repairDate}
                  </label>

                  <input
                    type="date"
                    name="repairDate"
                    value={formData.repairDate}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    {currentLang.repairTime}
                  </label>

                  <input
                    type="time"
                    name="repairTime"
                    value={formData.repairTime}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    {currentLang.hoursTaken}
                  </label>

                  <input
                    type="number"
                    name="repairHours"
                    value={formData.repairHours}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    step="0.5"
                    min="0"
                    placeholder="0.0"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    {currentLang.mechanicsInvolved}
                  </label>

                  <input
                    type="number"
                    name="mechanicsCount"
                    value={formData.mechanicsCount}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    min="0"
                    placeholder="0"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  {currentLang.repairDescription}
                </label>

                <textarea
                  name="repairDesc"
                  value={formData.repairDesc}
                  onChange={handleInputChange}
                  disabled={isViewMode}
                  rows="2"
                  placeholder={
                    language === "english"
                      ? "Describe the repair work done"
                      : "मरम्मत कार्य का विवरण लिखें"
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div className="border-t-2 border-gray-200"></div>

            <div className="space-y-4 sm:space-y-5">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 border-b-2 border-[#ef4444] pb-2">
                {currentLang.verification}
              </h2>

              <div className="space-y-3">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  {currentLang.statusOfProblem}
                </label>

                <div className="flex flex-col sm:flex-row gap-3 sm:space-x-6">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="status"
                      value="OK"
                      checked={formData.status === "OK"}
                      onChange={handleInputChange}
                      disabled={isViewMode}
                      className="w-4 h-4 text-[#ef4444]"
                    />

                    <span className="ml-2 flex items-center text-green-600 font-medium">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" />
                      {currentLang.ok}
                    </span>
                  </label>

                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="status"
                      value="NG"
                      checked={formData.status === "NG"}
                      onChange={handleInputChange}
                      disabled={isViewMode}
                      className="w-4 h-4 text-[#ef4444]"
                    />

                    <span className="ml-2 flex items-center text-red-600 font-medium">
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" />
                      {currentLang.ng}
                    </span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    {currentLang.date}
                  </label>

                  <input
                    type="date"
                    name="verificationDate"
                    value={formData.verificationDate}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    {currentLang.time}
                  </label>

                  <input
                    type="time"
                    name="verificationTime"
                    value={formData.verificationTime}
                    onChange={handleInputChange}
                    disabled={isViewMode}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 sm:pt-6">
              {!isViewMode ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                      Prepared By
                    </label>

                    <input
                      type="text"
                      value={preparedBy}
                      onChange={(e) => setPreparedBy(e.target.value)}
                      placeholder="Enter name"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-red-600 w-full sm:w-64"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleResetClick}
                    className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all font-medium text-base sm:text-lg shadow-lg hover:shadow-xl flex items-center justify-center order-2 sm:order-1 cursor-pointer"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    {currentLang.restButton}
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all font-medium text-base sm:text-lg shadow-lg flex items-center justify-center order-1 sm:order-2 ${
                      isSubmitting
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:from-[#dc2626] hover:to-[#b91c1c] hover:shadow-xl cursor-pointer"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>

                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>

                        {currentLang.submitting}
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        {currentLang.submit}
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-5">
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 uppercase mb-2">
                    Approval / Rejection Remark
                  </label>

                  <textarea
                    rows="3"
                    value={approvalRemark}
                    onChange={(e) => setApprovalRemark(e.target.value)}
                    disabled={isAlreadyReviewed}
                    placeholder="Enter approval or rejection remark..."
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:border-transparent text-sm text-slate-700 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />

                  {approvalStatus && (
                    <div className="mt-2 text-sm font-bold text-gray-600">
                      Status: {approvalStatus}
                      {reviewedAt ? ` | Reviewed At: ${reviewedAt}` : ""}
                    </div>
                  )}

                  {isAlreadyReviewed ? (
                    <div className="mt-3 bg-gray-100 border border-gray-200 rounded-lg p-3 text-sm font-bold text-gray-600">
                      This report is already reviewed.
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                      <button
                        type="button"
                        onClick={handleReject}
                        disabled={approvalLoading}
                        className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {approvalLoading ? "Please wait..." : "Reject"}
                      </button>

                      <button
                        type="button"
                        onClick={handleApprove}
                        disabled={approvalLoading}
                        className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {approvalLoading ? "Please wait..." : "Approve"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MachineBreakDownForm;