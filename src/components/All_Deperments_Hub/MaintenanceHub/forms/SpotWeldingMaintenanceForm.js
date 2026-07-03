import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { getApiUrl } from "../../../../config/api";
import axios from "axios";

const SpotWeldingMaintenanceForm = () => {
  const navigate = useNavigate();
  const [isChecklistOpen, setIsChecklistOpen] = useState(true);
  const statusOptions = ["", "Ok", "Not Ok", "N/A"];

  // --- FULL CHECKLIST DATA ---
  const initialChecklist = [
    {
      id: 1,
      point: "Air Filter",
      parameter: "Clean air filter",
      method: "Visual",
      before: "",
      after: "",
      remarks: "",
    },
    {
      id: 2,
      point: "Coolant Pump",
      parameter: "Coolant pump is working",
      method: "Visual",
      before: "",
      after: "",
      remarks: "",
    },
    {
      id: 3,
      point: "Digital Panel",
      parameter: "Digital panel is working",
      method: "Visual",
      before: "",
      after: "",
      remarks: "",
    },
    {
      id: 4,
      point: "Air Pressure",
      parameter: "Check air pressure",
      method: "Visual",
      before: "",
      after: "",
      remarks: "",
    },
    {
      id: 5,
      point: "Electrode Alignment",
      parameter: "Check alignment of electrodes",
      method: "Visual",
      before: "",
      after: "",
      remarks: "",
    },
    {
      id: 6,
      point: "Abnormal sound",
      parameter: "Any abnormal sound heard?",
      method: "Hearing",
      before: "",
      after: "",
      remarks: "",
    },
    {
      id: 7,
      point: "Starter & Wiring",
      parameter: "Starter & Wiring is in good condition",
      method: "Visual",
      before: "",
      after: "",
      remarks: "",
    },
    {
      id: 8,
      point: "PEDAL SPRING",
      parameter: "Should be proper working",
      method: "Manual",
      before: "",
      after: "",
      remarks: "",
    },
  ];

  const initialMetaData = {
    machineName: "", // Editable Machine Name
    date: new Date().toISOString().split("T")[0],
    machineNo: "",
    location: "",
    specification: "",
    maintenancePersonnel: "",
    preparedBy: "",
    checkedBy: "",
  };

  const [metaData, setMetaData] = useState(initialMetaData);
  const [tableData, setTableData] = useState(initialChecklist);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMetaChange = (e) =>
    setMetaData({ ...metaData, [e.target.name]: e.target.value });

  const handleBeforeChange = (id, value) => {
    setTableData(
      tableData.map((row) => (row.id === id ? { ...row, before: value } : row)),
    );
  };

  const handleAfterChange = (id, value) => {
    setTableData(
      tableData.map((row) => (row.id === id ? { ...row, after: value } : row)),
    );
  };

  const handleRemarksChange = (id, value) => {
    setTableData(
      tableData.map((row) =>
        row.id === id ? { ...row, remarks: value } : row,
      ),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const currentUser = localStorage.getItem("username") || "Unknown User";
    const payload = {
      machine_name: metaData.machineName,
      date: metaData.date,
      machine_no: metaData.machineNo,
      location: metaData.location,
      specification: metaData.specification,
      maintenance_personnel: metaData.maintenancePersonnel,
      prepared_by: metaData.preparedBy,
      checked_by: metaData.checkedBy,
      username: currentUser,
      department_name: `${metaData.location} (Maintenance)`,
      checkpoints: tableData.map((row, index) => ({
        sr_no: index + 1,
        check_point: row.point,
        checking_parameter: row.parameter,
        checking_method: row.method,
        before_maintenance: row.before,
        after_maintenance: row.after,
        remarks: row.remarks || "",
        spare_used_remarks: row.remarks || "",
      })),
    };

    try {
      const response = await fetch(
        getApiUrl("/api/spot-welding-maintenance/save/"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        const currentUser = localStorage.getItem("username") || "Unknown User";

        alert("Success! Spot Welding Maintenance record has been saved.");
        setMetaData(initialMetaData);
        setTableData(initialChecklist);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const errorData = await response.json();
        alert(
          "Failed to save data. Error: " +
            (errorData.error
              ? JSON.stringify(errorData.error)
              : "Unknown Error"),
        );
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while saving the data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .theme-card { 
          background: white; 
          border-radius: 20px; 
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.08); 
        }
        
        .btn-theme { 
          background: #6366f1; 
          color: white; 
          border: none; 
          font-weight: 600; 
          padding: 12px 30px; 
          transition: all 0.3s ease; 
        }
        
        .btn-theme:hover:not(:disabled) { 
          background: #4f46e5; 
          transform: translateY(-2px); 
          box-shadow: 0 8px 15px rgba(99, 102, 241, 0.3); 
        }

        .btn-theme:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        /* --- STYLED BACK BUTTON --- */
        .btn-outline-custom { 
          background: white;
          color: #6366f1; 
          border: 2px solid #6366f1;
          transition: all 0.2s ease;
          font-weight: 600;
          padding: 8px 20px;
        }
        
        .btn-outline-custom:hover { 
          background: #6366f1;
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
        }

        .animate-fade-in { animation: fadeInUp 0.4s ease-out; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .form-label { 
          font-weight: 600; 
          color: #475569; 
          font-size: 0.8rem; 
          text-transform: uppercase; 
          letter-spacing: 0.5px; 
        }
        
        .method-badge { 
          background-color: #e0e7ff; 
          color: #4f46e5; 
          padding: 4px 10px; 
          border-radius: 6px; 
          font-size: 0.75rem; 
          font-weight: 700; 
        }
        
        select option[value="Ok"] { color: #10b981; font-weight: bold; }
        select option[value="Not Ok"] { color: #ef4444; font-weight: bold; }

        /* Desktop Table CSS */
        .ss-table-container { border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; }
        .ss-table { width: 100%; border-collapse: collapse; margin-bottom: 0; }
        .ss-table thead th { 
          background-color: #6366f1; 
          color: white; 
          padding: 15px; 
          font-size: 0.85rem; 
          text-transform: uppercase; 
        }
        .ss-table tbody td { padding: 10px; vertical-align: middle; }

        /* Magic Mobile View CSS */
        .mobile-label { display: none; }
        @media (max-width: 767px) {
          .ss-table-container { border: none; background: transparent; }
          .ss-table thead { display: none; }
          .ss-table, .ss-table tbody, .ss-table tr, .ss-table td { 
            display: block; 
            width: 100%; 
          }
          .ss-table tr { 
            margin-bottom: 15px; 
            border: 1px solid #cbd5e1; 
            border-radius: 12px; 
            padding: 15px; 
            background: white; 
            box-shadow: 0 4px 10px rgba(0,0,0,0.05); 
          }
          .ss-table td { 
            border: none; 
            border-bottom: 1px dashed #e2e8f0; 
            padding: 10px 0; 
            text-align: left !important; 
          }
          .ss-table td:last-child { border-bottom: none; }
          .mobile-label { 
            display: block; 
            font-size: 0.75rem; 
            font-weight: 700; 
            color: #64748b; 
            text-transform: uppercase; 
            margin-bottom: 5px; 
          }
        }
      `}</style>

      {/* --- TOP BACK BUTTON --- */}
      <div
        className="mx-auto mb-3 no-print animate-fade-in px-2"
        style={{ maxWidth: "1200px" }}
      >
        <button
          className="btn btn-outline-custom rounded-pill"
          onClick={() => navigate("/Maintenance/Machine/weekly")}
          style={{ fontSize: "0.85rem" }}
        >
          ← Back to Weekly Hub
        </button>
      </div>

      {/* Header Panel */}
      <div
        className="theme-card mx-auto mb-4 p-3 p-md-4 d-flex justify-content-between align-items-center"
        style={{ maxWidth: "1200px", borderTop: "6px solid #6366f1" }}
      >
        <div>
          <h3
            className="fw-bold mb-1 fs-5 fs-md-3"
            style={{ color: "#1e293b" }}
          >
            SPOT WELDING MAINTENANCE
          </h3>
          <span
            className="badge rounded-pill"
            style={{
              backgroundColor: "#e0e7ff",
              color: "#4f46e5",
              padding: "8px 15px",
            }}
          >
            Form: AOT-F-PM-01 | Weekly
          </span>
        </div>
      </div>

      <div
        className="theme-card mx-auto p-3 p-md-4"
        style={{ maxWidth: "1200px" }}
      >
        <form onSubmit={handleSubmit}>
          {/* General Information */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-4">
              <label className="form-label">Machine Name</label>
              <input
                type="text"
                className="form-control"
                name="machineName"
                value={metaData.machineName}
                onChange={handleMetaChange}
                placeholder="Enter Machine Name"
                required
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                name="date"
                value={metaData.date}
                onChange={handleMetaChange}
                required
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Machine No.</label>
              <input
                type="text"
                className="form-control"
                name="machineNo"
                value={metaData.machineNo}
                onChange={handleMetaChange}
                required
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                name="location"
                value={metaData.location}
                onChange={handleMetaChange}
                required
              />
            </div>
            <div className="col-12 col-md-8">
              <label className="form-label">Maintenance Personnel</label>
              <input
                type="text"
                className="form-control"
                name="maintenancePersonnel"
                value={metaData.maintenancePersonnel}
                onChange={handleMetaChange}
                required
              />
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">Check Points</h5>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setIsChecklistOpen(!isChecklistOpen)}
            >
              {isChecklistOpen ? "Hide" : "Show"}
            </button>
          </div>

          {isChecklistOpen && (
            <div className="ss-table-container mb-4">
              <table className="table mb-0 ss-table">
                <thead>
                  <tr className="text-center">
                    <th style={{ width: "5%" }}>Sr.</th>
                    <th className="text-start" style={{ width: "25%" }}>
                      Check Points
                    </th>
                    <th className="text-start" style={{ width: "25%" }}>
                      Parameter
                    </th>
                    <th style={{ width: "10%" }}>Method</th>
                    <th style={{ width: "10%" }}>Before</th>
                    <th style={{ width: "10%" }}>After</th>
                    <th style={{ width: "15%" }}>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={row.id} className="align-middle">
                      <td className="text-center fw-bold">
                        <span className="mobile-label">Sr. No.</span>
                        {index + 1}
                      </td>
                      <td className="small fw-medium">
                        <span className="mobile-label">Check Point</span>
                        {row.point}
                      </td>
                      <td className="small text-muted">
                        <span className="mobile-label">Parameter</span>
                        {row.parameter}
                      </td>
                      <td className="text-md-center">
                        <span className="mobile-label">Method</span>
                        <span className="method-badge">{row.method}</span>
                      </td>
                      <td>
                        <span className="mobile-label">Before Maint.</span>
                        <select
                          className="form-select form-select-sm w-100"
                          value={row.before}
                          onChange={(e) =>
                            handleBeforeChange(row.id, e.target.value)
                          }
                          required
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt || "Select"}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <span className="mobile-label">After Maint.</span>
                        <select
                          className="form-select form-select-sm w-100"
                          value={row.after}
                          onChange={(e) =>
                            handleAfterChange(row.id, e.target.value)
                          }
                          required
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt || "Select"}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <span className="mobile-label">Remarks</span>
                        <input
                          type="text"
                          className="form-control form-control-sm w-100"
                          placeholder="Remarks..."
                          value={row.remarks}
                          onChange={(e) =>
                            handleRemarksChange(row.id, e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Signatures */}
          <div className="row g-4 mt-2">
            <div className="col-12 col-md-6">
              <div className="p-3 rounded-3 border">
                <label className="form-label">Prepared By</label>
                <input
                  type="text"
                  className="form-control border-0"
                  name="preparedBy"
                  value={metaData.preparedBy}
                  onChange={handleMetaChange}
                  required
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="p-3 rounded-3 border">
                <label className="form-label">Checked By</label>
                <input
                  type="text"
                  className="form-control border-0"
                  name="checkedBy"
                  value={metaData.checkedBy}
                  onChange={handleMetaChange}
                />
              </div>
            </div>
          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-end mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-theme rounded-pill px-5 w-100 w-sm-auto"
            >
              {isSubmitting ? "Submitting..." : "Save Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpotWeldingMaintenanceForm;
