import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RedBinForm = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  // Backend URLs
  const API_DROPDOWN = "http://192.168.0.34:8000/api/master-dropdown";
  const API_SUBMIT = "http://192.168.0.34:8000/api/redbin-analysis/save/";

  const [formData, setFormData] = useState({
    entry_date: today, // Model field name se match kiya
    part_name_model: "",
    defect_detail: "",
    operation: "",
    total_rej_qty: "",
    root_cause_reason: "", // Model field name
    action_taken: "",
    responsible_person: "",
    target_date: "",
    completion_date: "",
  });

  const [partOptions, setPartOptions] = useState([]);
  const [operationOptions, setOperationOptions] = useState([]);

  // 👇 1. Component load hote hi saare Parts fetch karo
  useEffect(() => {
    axios
      .get(`${API_DROPDOWN}?filter=all_parts`)
      .then((response) => {
        // Sirf names ki list set karein
        const namesOnly = response.data.map((item) =>
          Array.isArray(item) ? item[0] : item,
        );
        setPartOptions(namesOnly);
      })
      .catch((error) => console.error("Error fetching parts:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 👇 2. Agar Part Name change hua hai, toh uske related Operations fetch karo
    if (name === "part_name_model" && value !== "") {
      setFormData((prev) => ({ ...prev, operation: "" }));
      setOperationOptions([]);

      axios
        .get(
          `${API_DROPDOWN}?filter=operations_by_part&part=${encodeURIComponent(
            value,
          )}`,
        )
        .then((response) => {
          setOperationOptions(response.data);
        })
        .catch((error) => console.error("Error fetching operations:", error));
    }
  };

  // 👇 3. Backend mein data save karne ka logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(API_SUBMIT, formData);
      if (response.status === 201 || response.status === 200) {
        alert("Red Bin Analysis Report Saved Successfully!");
        handleReset();
      }
    } catch (error) {
      console.error("Submit Error:", error.response?.data);
      alert("Error saving report. Check console for details.");
    }
  };

  const handleReset = () => {
    setFormData({
      entry_date: today,
      part_name_model: "",
      defect_detail: "",
      operation: "",
      total_rej_qty: "",
      root_cause_reason: "",
      action_taken: "",
      responsible_person: "",
      target_date: "",
      completion_date: "",
    });
    setOperationOptions([]);
  };

  return (
    <>
      {/* Navbar */}
      {/* <nav className="bg-white px-4 py-3 flex justify-between items-center">
      <h4
        className="font-bold text-slate-700 cursor-pointer"

        onClick={() => navigate('/qa-hub/daily')}
      >
       <i className="bi bi-arrow-left-circle text-muted me-2"></i>QA Hub (Quality Assurance)
       
      </h4>

      <div className="flex gap-2">
        <img
        src="/logo1.jpg"
        alt="Company Logo"
        className="h-10 w-auto object-contain"
      />
      </div>
    </nav> */}

      <div className="min-h-screen bg-slate-50 py-2 px-3 sm:py-3 sm:px-4 md:py-4 font-sans ">
        <div className="w-full max-w-8xl mx-auto px-16 py-6">
          <div
            className="bg-white rounded-xl overflow-hidden"
            style={{ borderColor: "#f04343" }}
          >
            <div className="bg-gradient-to-r from-white to-red-50 px-4 py-3 sm:px-5 sm:py-4">
              <div className="flex justify-between items-center mb-3">
                {/* Left Side - Back Button */}
                <button
                  onClick={() => navigate("/qa-hub")}
                  className="inline-flex items-center text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg shadow-md transition-all active:scale-95 group"
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
                  Back to QA Hub
                </button>
                {/* <div className="flex justify-center flex-1">
                  <img
                    src="/logo1.jpg"
                    alt="Company Logo"
                    className="h-12 w-auto object-contain"
                  />
                </div> */}

                {/* Right Side - Icon + Title */}
                <div className="flex items-center gap-2">
                  <div
                    className="p-2 rounded-lg text-white shadow-lg shrink-0"
                    style={{ backgroundColor: "#f04343" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1z" />
                    </svg>
                  </div>

                  <h2 className="text-base font-black text-slate-800 uppercase tracking-tight m-0">
                    Red Bin Analysis Report
                  </h2>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  {/* <div
                  className="p-1.5 sm:p-2 rounded-lg text-white shadow-lg shrink-0"
                  style={{ backgroundColor: "#f04343" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                  </svg>
                </div> */}
                  {/* <div>
                  <h2 className="text-sm sm:text-base md:text-lg font-black text-slate-800 m-0 uppercase tracking-tight">
                    Red Bin Analysis Report
                  </h2>
                </div> */}
                </div>

                <div className="w-full sm:w-auto bg-white border-2 border-red-100 rounded-lg px-2 py-1.5 flex items-center justify-between sm:justify-center gap-2 shadow-sm">
                  <span className="text-[8px] sm:text-[9px] font-black text-red-600 uppercase whitespace-nowrap">
                    Entry Date
                  </span>
                  <input
                    type="date"
                    name="entry_date"
                    value={formData.entry_date}
                    onChange={handleChange}
                    className="text-xs font-bold text-slate-700 outline-none cursor-pointer bg-transparent"
                  />
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-4">
                <div>
                  <label className="block text-[10px] sm:text-[10px] font-black text-slate-900 uppercase mb-1">
                    Part Name / Model
                  </label>
                  <select
                    name="part_name_model"
                    value={formData.part_name_model}
                    onChange={handleChange}
                    className="w-full border-2 border-slate-100 bg-slate-50 rounded-lg p-2 text-sm focus:bg-white focus:border-slate-500 outline-none text-slate-700 transition-all font-semibold"
                    required
                  >
                    <option value="">Select Part Name</option>
                    {partOptions.map((part, index) => (
                      <option key={index} value={part}>
                        {part}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] sm:text-[10px] font-black text-slate-900 uppercase mb-1">
                    Operation
                  </label>
                  <select
                    name="operation"
                    value={formData.operation}
                    onChange={handleChange}
                    className="w-full border-2 border-slate-100 bg-slate-50 rounded-lg p-2 text-sm focus:bg-white focus:border-slate-500 outline-none text-slate-700 transition-all font-semibold"
                    required
                    disabled={!formData.part_name_model}
                  >
                    <option value="">Select Operation</option>
                    {operationOptions.map((op, index) => (
                      <option key={index} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] sm:text-[10px] font-black text-slate-900 uppercase mb-1">
                    Total Rejection Qty
                  </label>
                  <div className="flex items-center">
                    <input
                      name="total_rej_qty"
                      value={formData.total_rej_qty}
                      onChange={handleChange}
                      type="number"
                      className="w-full border-2 border-slate-100 bg-slate-50 rounded-l-lg p-2 text-sm focus:bg-white focus:border-slate-500 outline-none text-slate-700 transition-all font-semibold"
                      placeholder="0"
                      required
                    />
                    <span className="bg-slate-100 px-3 py-2 border-2 border-l-0 border-slate-100 rounded-r-lg text-slate-500 font-bold text-xs whitespace-nowrap">
                      NOS
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div>
                  <label className="block text-[10px] sm:text-[10px] font-black text-slate-900 uppercase mb-1">
                    Defect Detail
                  </label>
                  <textarea
                    name="defect_detail"
                    value={formData.defect_detail}
                    onChange={handleChange}
                    rows="2"
                    className="w-full border-2 border-slate-100 bg-slate-50 rounded-lg p-2 text-sm focus:bg-white focus:border-slate-500 outline-none text-slate-700 font-medium resize-y"
                    placeholder="Describe what went wrong..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-[10px] font-black text-slate-900 uppercase mb-1">
                    Root Cause / Reason
                  </label>
                  <textarea
                    name="root_cause_reason"
                    value={formData.root_cause_reason}
                    onChange={handleChange}
                    rows="2"
                    className="w-full border-2 border-slate-100 bg-slate-50 rounded-lg p-2 text-sm focus:bg-white focus:border-slate-500 outline-none text-slate-700 font-medium resize-y"
                    placeholder="Why did this happen?"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[10px] sm:text-xs font-black text-red-600 uppercase mb-1.5 flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Corrective Action Taken
                </label>
                <textarea
                  name="action_taken"
                  value={formData.action_taken}
                  onChange={handleChange}
                  rows="2"
                  className="w-full border-2 border-slate-200 rounded-lg p-2 text-sm focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none text-slate-700 transition-all resize-y"
                  placeholder="Describe the corrective actions taken to prevent recurrence..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <label className="block text-[9px] sm:text-[10px] font-black text-slate-900 uppercase mb-1">
                    Responsible Person
                  </label>
                  <input
                    name="responsible_person"
                    value={formData.responsible_person}
                    onChange={handleChange}
                    type="text"
                    placeholder="Name of In-charge"
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:border-slate-500 outline-none text-slate-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] sm:text-[10px] font-black text-slate-900 uppercase mb-1">
                    Target Date
                  </label>
                  <input
                    name="target_date"
                    value={formData.target_date}
                    onChange={handleChange}
                    type="date"
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:border-slate-500 outline-none text-slate-700"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[9px] sm:text-[10px] font-black text-slate-900 uppercase mb-1">
                    Completion Date
                  </label>
                  <input
                    name="completion_date"
                    value={formData.completion_date}
                    onChange={handleChange}
                    type="date"
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:border-slate-500 outline-none text-slate-700"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end items-stretch sm:items-center border-t border-slate-100 pt-3">
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-4 py-2 rounded-lg font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all text-xs uppercase tracking-wide border border-slate-200 hover:border-red-200"
                  >
                    Clear Form
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 uppercase font-black tracking-wider text-xs"
                    style={{ backgroundColor: "#f04343" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    Submit Report
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RedBinForm;
