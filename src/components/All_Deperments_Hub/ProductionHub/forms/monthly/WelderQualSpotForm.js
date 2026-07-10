import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "../../../../../config/api";

const SpotWelderForm = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [welderPhoto, setWelderPhoto] = useState(null);

  const [formData, setFormData] = useState({
    wpsNo: "",
    date: "",
    weldingProcess: "",
    baseMetal: "",
    baseMetalThickness: "",
    machineNo: "",
    gunType: "",
    welderName: "",
    conductedBy: "",
    verifiedBy: "",
  });

  const [trials, setTrials] = useState([
    {
      squeeze: "",
      weld: "",
      hold: "",
      off: "",
      current: "",
      pressure: "",
      strength: "",
      visual: "",
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // UPDATED: Using index instead of id
  const handleTrialChange = (index, field, value) => {
    const newTrials = [...trials];
    newTrials[index][field] = value;
    setTrials(newTrials);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setWelderPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const addRow = () => {
    setTrials([
      ...trials,
      {
        squeeze: "",
        weld: "",
        hold: "",
        off: "",
        current: "",
        pressure: "",
        strength: "",
        visual: "",
      },
    ]);
  };

  const removeRow = (index) => {
    if (trials.length > 1) {
      setTrials(trials.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const currentUser = localStorage.getItem("username") || "Unknown User";

    try {
      const payload = {
        ...formData,
        trials,
        welderPhoto,

        username: currentUser,
        department_name: "Production",
      };

      const response = await fetch(getApiUrl("/api/save-spot-welder/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Spot Welder Qualification Report Saved Successfully!");
      } else {
        const errorData = await response.json();
        alert("Failed to save data: " + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4ff] font-sans text-slate-900 pb-20 flex flex-col items-center">
      <div className="w-full max-w-6xl px-4 mt-8">
        <div className="flex justify-start mb-6">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 px-8 py-4 bg-white border border-blue-100 text-slate-800 rounded-none hover:bg-blue-50 transition-all shadow-sm font-bold text-sm active:scale-95"
          >
            <i className="bi bi-arrow-left text-[#0b26f5]"></i>
            Back to Hub
          </button>
        </div>

        <div className="w-full bg-gradient-to-r from-[#0b26f5] via-[#081eb5] to-[#051485] p-8 md:p-12 text-center shadow-lg">
          <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight uppercase italic">
            Welder Qualification <span className="text-blue-200">Test</span>
          </h1>
          <p className="text-blue-100 text-[10px] md:text-xs font-bold mt-2 tracking-[0.3em] uppercase opacity-90">
            ( SPOT WELDER ) | Doc No: AOT/F/PROD/08
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white shadow-2xl border-x border-b border-blue-50 overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="p-6 md:p-12 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-50 pb-8">
              <InputField
                label="REF. WPS NO."
                name="wpsNo"
                value={formData.wpsNo}
                onChange={handleInputChange}
              />
              <InputField
                label="DATE"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                type="date"
              />
            </div>
            <div className="pb-4">
              <InputField
                label="Welding Process"
                name="weldingProcess"
                value={formData.weldingProcess}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-blue-50/30 p-8 border border-blue-100 shadow-inner">
              <InputField
                label="1. Base Metal (to weld)"
                name="baseMetal"
                value={formData.baseMetal}
                onChange={handleInputChange}
              />
              <InputField
                label="2. Base Metal Thickness"
                name="baseMetalThickness"
                value={formData.baseMetalThickness}
                onChange={handleInputChange}
              />
              <InputField
                label="3. Machine No."
                name="machineNo"
                value={formData.machineNo}
                onChange={handleInputChange}
              />
              <InputField
                label="4. Gun Type"
                name="gunType"
                value={formData.gunType}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end px-2">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1.5 h-4 bg-[#0b26f5]"></div> 5. Test Results
                  / Process Parameters Specification
                </h3>
                <button
                  type="button"
                  onClick={addRow}
                  className="px-6 py-3 bg-blue-100 text-[#0b26f5] rounded-none font-bold text-xs uppercase hover:bg-blue-200 transition-all"
                >
                  + Add Trial
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200">
                <table className="w-full text-center border-collapse table-fixed">
                  <thead className="bg-slate-800 text-white text-[9px] uppercase tracking-tighter">
                    <tr className="border-b border-slate-700 font-black">
                      <th
                        rowSpan="2"
                        className="p-3 border-r border-slate-700 w-12"
                      >
                        Trial
                      </th>
                      <th className="p-2 border-r border-slate-700">
                        Squeeze Time
                      </th>
                      <th className="p-2 border-r border-slate-700">
                        Weld Time
                      </th>
                      <th className="p-2 border-r border-slate-700">
                        Hold Time
                      </th>
                      <th className="p-2 border-r border-slate-700">
                        Off Time
                      </th>
                      <th className="p-2 border-r border-slate-700 bg-slate-900">
                        Current (Amp)
                      </th>
                      <th className="p-2 border-r border-slate-700 bg-slate-900">
                        Air Pressure
                      </th>
                      <th className="p-2 border-r border-slate-700">
                        Spot Strength
                      </th>
                      <th className="p-2 border-r border-slate-700">
                        Visual Inspection
                      </th>
                      <th className="p-2 w-16">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 italic">
                    {/* UPDATED: Using index for mapping and passing to handlers */}
                    {trials.map((trial, index) => (
                      <tr
                        key={index}
                        className="text-xs hover:bg-blue-50/30 transition-all font-bold"
                      >
                        <td className="p-2 font-black text-slate-400 border-r bg-slate-50/50">
                          {index + 1}
                        </td>
                        <td className="p-1 border-r">
                          <input
                            value={trial.squeeze}
                            onChange={(e) =>
                              handleTrialChange(
                                index,
                                "squeeze",
                                e.target.value,
                              )
                            }
                            className="w-full text-center p-2 bg-transparent outline-none focus:bg-white rounded-sm"
                          />
                        </td>
                        <td className="p-1 border-r">
                          <input
                            value={trial.weld}
                            onChange={(e) =>
                              handleTrialChange(index, "weld", e.target.value)
                            }
                            className="w-full text-center p-2 bg-transparent outline-none focus:bg-white rounded-sm"
                          />
                        </td>
                        <td className="p-1 border-r">
                          <input
                            value={trial.hold}
                            onChange={(e) =>
                              handleTrialChange(index, "hold", e.target.value)
                            }
                            className="w-full text-center p-2 bg-transparent outline-none focus:bg-white rounded-sm"
                          />
                        </td>
                        <td className="p-1 border-r">
                          <input
                            value={trial.off}
                            onChange={(e) =>
                              handleTrialChange(index, "off", e.target.value)
                            }
                            className="w-full text-center p-2 bg-transparent outline-none focus:bg-white rounded-sm"
                          />
                        </td>
                        <td className="p-1 border-r">
                          <input
                            value={trial.current}
                            onChange={(e) =>
                              handleTrialChange(
                                index,
                                "current",
                                e.target.value,
                              )
                            }
                            className="w-full text-center p-2 bg-transparent outline-none focus:bg-white rounded-sm font-bold text-blue-600"
                          />
                        </td>
                        <td className="p-1 border-r">
                          <input
                            value={trial.pressure}
                            onChange={(e) =>
                              handleTrialChange(
                                index,
                                "pressure",
                                e.target.value,
                              )
                            }
                            className="w-full text-center p-2 bg-transparent outline-none focus:bg-white rounded-sm"
                          />
                        </td>
                        <td className="p-1 border-r">
                          <select
                            value={trial.strength}
                            onChange={(e) =>
                              handleTrialChange(
                                index,
                                "strength",
                                e.target.value,
                              )
                            }
                            className="bg-transparent border-none text-[9px] font-black uppercase outline-none cursor-pointer"
                          >
                            <option value=""></option>
                            <option value="Ok">Ok</option>
                            <option value="Not Ok">Not Ok</option>
                          </select>
                        </td>
                        <td className="p-1 border-r">
                          <select
                            value={trial.visual}
                            onChange={(e) =>
                              handleTrialChange(index, "visual", e.target.value)
                            }
                            className="bg-transparent border-none text-[10px] font-black uppercase outline-none cursor-pointer"
                          >
                            <option value=""></option>
                            <option value="Ok">Ok</option>
                            <option value="Not Ok">Not Ok</option>
                          </select>
                        </td>
                        <td className="p-1">
                          <button
                            type="button"
                            onClick={() => removeRow(index)}
                            className="text-slate-300 hover:text-red-500"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-8 bg-[#f8faff] border border-blue-100 space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <InputField
                  label="Name of Welder"
                  name="welderName"
                  value={formData.welderName}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Welding test conducted by"
                  name="conductedBy"
                  value={formData.conductedBy}
                  onChange={handleInputChange}
                />
                <InputField
                  label="Welding test verified by"
                  name="verifiedBy"
                  value={formData.verifiedBy}
                  onChange={handleInputChange}
                />
              </div>

              <div className="pt-8 border-t border-blue-100 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
                <p className="max-w-xl text-[13px] font-black text-slate-800 italic leading-relaxed">
                  "Herewith, we certify that based on above observation, welder
                  is{" "}
                  <span className="text-[#0b26f5] underline decoration-2 underline-offset-4 font-black">
                    Qualified / Not Qualified
                  </span>{" "}
                  to carry out Spot Welding Process."
                </p>

                <div
                  className="w-44 h-52 border-2 border-dashed border-blue-200 flex flex-col items-center justify-center bg-white hover:bg-blue-50 transition-all cursor-pointer overflow-hidden group shadow-inner"
                  onClick={() => fileInputRef.current.click()}
                >
                  {welderPhoto ? (
                    <img
                      src={welderPhoto}
                      alt="Welder"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <i className="bi bi-person-badge text-4xl text-blue-200 group-hover:scale-110 transition-transform"></i>
                      <span className="text-[9px] font-black text-slate-400 uppercase mt-2">
                        WELDER PHOTO
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-20 py-6 rounded-none font-black text-white text-sm uppercase tracking-[0.3em] transition-all shadow-xl active:scale-[0.98] ${isSubmitting
                    ? "bg-slate-300"
                    : "bg-gradient-to-r from-[#0b26f5] to-[#051485] hover:shadow-blue-200 shadow-blue-100"
                  }`}
              >
                {isSubmitting ? "PROCESSING..." : "SAVE QUALIFICATION REPORT"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

const InputField = ({
  label,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
}) => (
  <div className="flex flex-col gap-2.5">
    <label className="text-[11px] font-black text-slate-800 uppercase tracking-widest ml-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-4 bg-slate-50 border border-slate-200 focus:border-[#0b26f5] rounded-none outline-none transition-all font-bold text-sm text-slate-700 shadow-sm focus:bg-white"
    />
  </div>
);

export default SpotWelderForm;
