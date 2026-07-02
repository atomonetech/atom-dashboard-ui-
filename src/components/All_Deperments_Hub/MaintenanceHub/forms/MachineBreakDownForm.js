import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Save, RotateCcw } from "lucide-react";
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
  const { id } = useParams();

  const isViewMode = Boolean(id);

  const [language, setLanguage] = useState("english");
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [preparedBy, setPreparedBy] = useState("");

  const [loadingReport, setLoadingReport] = useState(false);
  const [approvalRemark, setApprovalRemark] = useState("");
  const [approvalLoading, setApprovalLoading] = useState(false);

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

  useEffect(() => {
    if (!id) return;

    const fetchSingleReport = async () => {
      try {
        setLoadingReport(true);

        const res = await axios.get(
          `${BASE_URL}/api/get-single-maintenance-report/machine-breakdown/${id}/`
        );

        if (!res.data.success) {
          alert(res.data.error || "Failed to load Machine Breakdown Form.");
          return;
        }

        const data = res.data.data || {};

        setFormData({
          givenDate: data.givenDate || data.given_date || "",
          givenTime: data.givenTime || data.given_time || "",
          machineNameNo: data.machineNameNo || data.machine_name_no || "",
          breakdownName: data.breakdownName || data.breakdown_name || "",
          partMadeAfterInspection:
            data.partMadeAfterInspection || data.part_made_after_inspection || "",
          breakdownDesc: data.breakdownDesc || data.breakdown_desc || "",
          repairDate: data.repairDate || data.repair_date || "",
          repairTime: data.repairTime || data.repair_time || "",
          repairHours: data.repairHours || data.repair_hours || "",
          mechanicsCount: data.mechanicsCount || data.mechanics_count || "",
          repairDesc: data.repairDesc || data.repair_desc || "",
          status: data.status || "OK",
          verificationDate: data.verificationDate || data.verification_date || "",
          verificationTime: data.verificationTime || data.verification_time || "",
        });

        setPreparedBy(data.preparedBy || data.prepared_by || "");
        setLanguage(data.language || "english");
        setApprovalRemark(data.approval_remarks || data.remarks || "");
      } catch (err) {
        console.error("Error loading Machine Breakdown Form:", err);
        alert("Failed to load Machine Breakdown Form.");
      } finally {
        setLoadingReport(false);
      }
    };

    fetchSingleReport();
  }, [id]);

  const handleInputChange = (e) => {
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
    setShowResetConfirm(true);
  };

  const handleCancelReset = () => {
    setShowResetConfirm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    const currentUser = localStorage.getItem("username") || "Unknown User";

    const submissionData = {
      ...formData,
      language,
      preparedBy,
      username: currentUser,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/machine-breakdown-summary/save/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (result.success || response.ok) {
        setShowSuccess(true);
        alert("✅ Success: Breakdown report has been submitted successfully!");

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

      await axios.post(`${BASE_URL}/api/approve-report/`, {
        log_id: id,
        approver_username: currentUser,
        remarks: approvalRemark,
      });

      alert("Report approved successfully.");
      navigate(-1);
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

      await axios.post(`${BASE_URL}/api/reject-report/`, {
        log_id: id,
        approver_username: currentUser,
        remarks: approvalRemark,
      });

      alert("Report rejected successfully.");
      navigate(-1);
    } catch (err) {
      console.error("Reject error:", err);
      alert(err.response?.data?.error || "Reject failed.");
    } finally {
      setApprovalLoading(false);
    }
  };

  const handleBack = () => {
    if (isViewMode) {
      navigate(-1);
      return;
    }

    navigate("/Maintenance/Machine/daily");
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "english" ? "hindi" : "english"));
  };

  const inputClass =
    "w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:border-transparent text-sm text-slate-700 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70";

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
              {currentLang.back}
            </span>
          </button>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className="text-sm text-gray-600 font-medium">
                {currentDate}
              </span>
            </div>

            <button
              onClick={toggleLanguage}
              className="px-4 py-2 bg-gradient-to-r from-[#ef4444] to-[#dc2626] text-white rounded-lg hover:from-[#dc2626] hover:to-[#b91c1c] transition-all shadow-sm hover:shadow-md text-sm font-medium min-w-[80px] cursor-pointer"
              type="button"
            >
              {language === "english" ? "हिंदी" : "English"}
            </button>
          </div>
        </div>

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

          {loadingReport ? (
            <div className="p-8 text-center font-bold text-gray-500">
              Loading report, please wait...
            </div>
          ) : (
            <form
              onSubmit={isViewMode ? (e) => e.preventDefault() : handleSubmit}
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
                    <label
                      className={`flex items-center p-3 border rounded-lg transition-colors ${
                        isViewMode ? "cursor-not-allowed bg-gray-50" : "cursor-pointer hover:bg-gray-50"
                      }`}
                    >
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

                    <label
                      className={`flex items-center p-3 border rounded-lg transition-colors ${
                        isViewMode ? "cursor-not-allowed bg-gray-50" : "cursor-pointer hover:bg-gray-50"
                      }`}
                    >
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
                <div className="flex flex-col mb-4">
                  <label className="text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                    Prepared By
                  </label>

                  <input
                    type="text"
                    value={preparedBy}
                    onChange={(e) => setPreparedBy(e.target.value)}
                    disabled={isViewMode}
                    placeholder="Enter name"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-red-600 w-full sm:w-64 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70"
                  />
                </div>

                {isViewMode ? (
                  <div className="border-t-2 border-gray-200 pt-5">
                    <label className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide block">
                      Approval / Rejection Remark
                    </label>

                    <textarea
                      rows="3"
                      value={approvalRemark}
                      onChange={(e) => setApprovalRemark(e.target.value)}
                      placeholder="Enter approval or rejection remark..."
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef4444] focus:border-transparent text-sm text-slate-700"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <button
                        type="button"
                        onClick={handleReject}
                        disabled={approvalLoading}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-medium text-base sm:text-lg shadow-lg hover:shadow-xl flex items-center justify-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        <XCircle className="w-5 h-5 mr-2" />
                        Reject
                      </button>

                      <button
                        type="button"
                        onClick={handleApprove}
                        disabled={approvalLoading}
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-medium text-base sm:text-lg shadow-lg hover:shadow-xl flex items-center justify-center cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Approve
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4">
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
                )}
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
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