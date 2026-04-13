import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

const TipChangeMonitorForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    partName: "",
    prdQty: "",
    tipChange: "",
    tipDressing: "",
    dressingStatus: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form reset
  const handleReset = () => {
    setFormData({
      partName: "",
      prdQty: "",
      tipChange: "",
      tipDressing: "",
      dressingStatus: "",
    });
  };

  // Handle form submit (Updated with Backend API Call)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.partName ||
      !formData.prdQty ||
      !formData.tipChange ||
      !formData.tipDressing ||
      !formData.dressingStatus
    ) {
      console.log("Please fill all fields");
      alert("Please fill all fields");
      return;
    }

    // Prepare data matching Django Model fields (snake_case)
    const payloadData = {
      part_name: formData.partName,
      prd_qty: parseInt(formData.prdQty),
      tip_change: formData.tipChange,
      tip_dressing: formData.tipDressing,
      dressing_status: formData.dressingStatus,
    };

    console.log("Sending data to backend:", payloadData);

    try {
      // Call to Django Backend API
      // Make sure your Django server is running on localhost:8000
      const response = await fetch("http://localhost:8000/api/save-tip-data/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payloadData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Data saved to database successfully:", responseData);
        alert("Data saved successfully!");
        
        // Reset form after successful submission
        handleReset();
      } else {
        const errorData = await response.json();
        console.error("Backend validation error:", errorData);
        alert("Failed to save data. Please check inputs.");
      }
    } catch (error) {
      console.error("Network or Server error:", error);
      alert("Error connecting to the server. Make sure Django backend is running.");
    }
  };

  const handleBack = () => {
    window.location.href = "/production-hub";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      {/* Back Button */}
      <button
        className="flex items-center gap-2 bg-[#916cf6] hover:bg-[#7b55e0] px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-white transition-colors mb-4 sm:mb-5 md:mb-6 font-medium text-sm sm:text-base w-fit"
        onClick={handleBack}
      >
        <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
        Back to Productionhub
      </button>

      {/* Form Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6">
        {/* Header with Date - Fully Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
          <div className="flex flex-col xs:flex-row xs:items-center gap-2 sm:gap-3">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              Tip Change & Dressing Monitoring
            </h2>
            <div className="text-xs sm:text-sm text-gray-500 bg-gray-50 px-2 sm:px-3 py-1 rounded-full w-fit">
              <span className="font-medium text-[#916cf6]">DRESSING FREQ:</span>{" "}
              AFTER 900 NOS
            </div>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-3 sm:px-4 py-2 rounded-full w-fit sm:w-auto">
            <span className="text-xs sm:text-sm font-medium text-gray-500 whitespace-nowrap">
              Current Date:
            </span>
            <span className="text-xs sm:text-sm font-semibold text-[#916cf6] whitespace-nowrap">
              {new Date()
                .toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
                .replace(/\//g, "/")}
            </span>
          </div>
        </div>

        {/* Form with Labels */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* Part Name with Label */}
            <div className="flex flex-col min-w-0">
              <label
                htmlFor="partName"
                className="text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >
                Part Name <span className="text-red-500">*</span>
              </label>
              <select
                id="partName"
                name="partName"
                value={formData.partName}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#916cf6]/20 focus:border-[#916cf6] text-gray-700 text-sm truncate"
              >
                <option value="">Select Part Name</option>
                <option value="innear pipe 따다가">Innear pipe</option>
                <option value="Annear pire kis m">Annear pire kis m</option>
                <option value="Anhear pire kpm">Anhear pire kpm</option>
                <option value="Annear pipe">Annear pipe</option>
                <option value="Innear pipe">Innear pipe</option>
                <option value="innear pipe kpm">innear pipe kpm</option>
                <option value="Annear pipe kpm">Annear pipe kpm</option>
                <option value="Annear pipe k12m">Annear pipe k12m</option>
              </select>
            </div>

            {/* PRD QTY with Label */}
            <div className="flex flex-col min-w-0">
              <label
                htmlFor="prdQty"
                className="text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >
                PRD QTY <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="prdQty"
                name="prdQty"
                value={formData.prdQty}
                onChange={handleChange}
                placeholder="Enter quantity"
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#916cf6]/20 focus:border-[#916cf6] text-gray-700 placeholder-gray-400 text-sm"
              />
            </div>

            {/* Tip Change with Label */}
            <div className="flex flex-col min-w-0">
              <label
                htmlFor="tipChange"
                className="text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >
                Tip Change <span className="text-red-500">*</span>
              </label>
              <select
                id="tipChange"
                name="tipChange"
                value={formData.tipChange}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#916cf6]/20 focus:border-[#916cf6] text-gray-700 text-sm"
              >
                <option value="">Select option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Tip Dressing with Label */}
            <div className="flex flex-col min-w-0">
              <label
                htmlFor="tipDressing"
                className="text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >
                Tip Dressing <span className="text-red-500">*</span>
              </label>
              <select
                id="tipDressing"
                name="tipDressing"
                value={formData.tipDressing}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#916cf6]/20 focus:border-[#916cf6] text-gray-700 text-sm"
              >
                <option value="">Select option</option>
                <option value="Done">Done</option>
                <option value="Not Done">Not Done</option>
              </select>
            </div>

            {/* Dressing Status with Label */}
            <div className="flex flex-col min-w-0">
              <label
                htmlFor="dressingStatus"
                className="text-xs sm:text-sm font-medium text-gray-700 mb-1"
              >
                Dressing Status <span className="text-red-500">*</span>
              </label>
              <select
                id="dressingStatus"
                name="dressingStatus"
                value={formData.dressingStatus}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#916cf6]/20 focus:border-[#916cf6] text-gray-700 text-sm"
              >
                <option value="">Select status</option>
                <option value="Ok">Ok</option>
                <option value="Not Ok">Not Ok</option>
              </select>
            </div>
          </div>

          {/* Action Buttons - Fully Responsive */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mt-6 pt-4 ">
            {/* Reset Button */}
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors text-sm"
            >
              Reset Form
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-2.5 bg-[#916cf6] hover:bg-[#7b55e0] text-white font-medium rounded-lg transition-colors text-sm"
            >
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TipChangeMonitorForm;