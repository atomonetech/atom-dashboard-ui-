

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './AssignMachine.css';

const API_BASE = process.env.REACT_APP_API_URL + "/api" || "http://localhost:8000/api";

// Plant wise Machine Sections & Counts
const MACHINE_CONFIG = {
  plant_1: {
    "Press Machine": { count: 57, prefix: "PP" },
    "Tip Blending": { count: 9, prefix: "TB" },
    "Spot Blending": { count: 2, prefix: "SB" },
    "MIG Blending": { count: 3, prefix: "MB" },
    "Projection Blending": { count: 3, prefix: "PB" },
  },
  plant_2: {
    "Press Machine": { count: 46, prefix: "PP" },
    "MIG Blending": { count: 3, prefix: "MB" },
    "Spot Blending": { count: 2, prefix: "SB" },
    "Projection Blending": { count: 1, prefix: "PB" },
  }
};

export default function AssignMachine() {
  const navigate = useNavigate();

  const getLoggedInUserPlant = () => {
    let groups = [];

    try {
      groups = JSON.parse(localStorage.getItem("user_groups") || "[]");
    } catch (error) {
      console.error("Invalid user_groups in localStorage", error);
    }

    const role = localStorage.getItem("user_role") || "";

    // Prefer Django groups
    if (groups.includes("Plant_1_User")) {
      return "plant_1";
    }

    if (groups.includes("Plant_2_User")) {
      return "plant_2";
    }

    // Fallback for old users
    if (role === "Plant_1_User") {
      return "plant_1";
    }

    if (role === "Plant_2_User") {
      return "plant_2";
    }

    return null;
  };

  const loggedInEngineerPlant = getLoggedInUserPlant();

  const [plant] = useState(loggedInEngineerPlant);

  // ========== STATES ==========
  // const [plant, setPlant] = useState(loggedInEngineerPlant);
  const [activeTab, setActiveTab] = useState("assign");

  // Assignment States
  const [operators, setOperators] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState("");
  const [operatorSearch, setOperatorSearch] = useState("");
  const [showOperatorDropdown, setShowOperatorDropdown] = useState(false);

  const [previousAssignment, setPreviousAssignment] = useState(null);
  const [newOperatorName, setNewOperatorName] = useState("");
  const [newEmpCode, setNewEmpCode] = useState("");
  const [showAddOperator, setShowAddOperator] = useState(false);

  const [machineSection, setMachineSection] = useState("Press Machine");
  const [machines, setMachines] = useState([]);
  const [machine, setMachine] = useState("");

  const [shift, setShift] = useState("A");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentAssignments, setCurrentAssignments] = useState([]);

  // History States
  const [historyData, setHistoryData] = useState([]);
  const [historyDate, setHistoryDate] = useState(new Date().toISOString().split('T')[0]);

  // ========== EFFECTS ==========
  useEffect(() => {
    if (!plant) return;

    // First load
    calculateShift();
    loadOperators();
    loadCurrentAssignments();
    setMachineSection("Press Machine");

    // Check shift + assignments every 30 seconds
    const interval = setInterval(() => {
      calculateShift();
      loadCurrentAssignments();
    }, 30000);

    return () => clearInterval(interval);
  }, [plant]);

  useEffect(() => {
    if (plant && machineSection) {
      const config = MACHINE_CONFIG[plant][machineSection];
      if (config) {
        const generatedMachines = Array.from(
          { length: config.count },
          (_, i) => `${config.prefix}${i + 1}`
        );
        setMachines(generatedMachines);
        setMachine("");
      } else {
        setMachines([]);
      }
    }
  }, [plant, machineSection]);

  useEffect(() => {
    if (activeTab === "history" && plant) {
      loadHistory();
    }
  }, [activeTab, historyDate, plant]);

  // ========== FUNCTIONS ==========
  const calculateShift = () => {
    const now = new Date();

    const totalMinutes =
      now.getHours() * 60 +
      now.getMinutes();

    const shiftAStart = 8 * 60 + 30; // 08:30
    const shiftAEnd = 20 * 60;       // 20:00

    const currentShift =
      totalMinutes >= shiftAStart &&
        totalMinutes < shiftAEnd
        ? "A"
        : "B";

    setShift(currentShift);
  };

  const loadOperators = async () => {
    try {
      const response = await axios.get(`${API_BASE}/operators/?plant=${plant}`);
      if (response.data?.operators) setOperators(response.data.operators);
    } catch (error) { console.error(error); }
  };

  const loadCurrentAssignments = async () => {
    try {
      const response = await axios.get(`${API_BASE}/assignments/list/?plant=${plant}`);
      if (response.data?.assignments) setCurrentAssignments(response.data.assignments);
    } catch (error) { console.error(error); }
  };

  const loadHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE}/assignments/history/?plant=${plant}&date=${historyDate}`);
      if (response.data?.history) setHistoryData(response.data.history);
    } catch (error) { console.error("Error fetching history:", error); }
  };

  const handleAddOperator = async () => {
    if (!newOperatorName.trim()) return alert('Please enter operator name');
    try {
      setLoading(true);
      await axios.post(`${API_BASE}/operators/add/`, {
        name: newOperatorName, plant: plant, employee_code: newEmpCode
      });
      setNewOperatorName(""); setNewEmpCode(""); setShowAddOperator(false);
      loadOperators();
    } catch (error) { alert("Failed to add operator."); }
    finally { setLoading(false); }
  };

  const handleEndShift = async () => {
    const confirmReset = window.confirm("🚨 WARNING: Are you sure you want to clear all machines and end the shift?");
    if (!confirmReset) return;

    try {
      setLoading(true);
      await axios.post(`${API_BASE}/assignment/end-shift/`, { plant: plant });
      alert("✅ Shift Ended Successfully! All machines are now free.");
      loadCurrentAssignments();
    } catch (error) {
      alert("Failed to reset machines.");
    } finally {
      setLoading(false);
    }
  };
  const loadPreviousAssignment = async () => {
    if (!plant || !selectedMachineDbNo) {
      setPreviousAssignment(null);
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE}/assignment/previous/?plant=${plant}&machine_no=${selectedMachineDbNo}`
      );

      setPreviousAssignment(
        response.data?.assignment || null
      );
    } catch (error) {
      console.error(
        "Previous assignment load error:",
        error
      );

      setPreviousAssignment(null);
    }
  };

  useEffect(() => {
    if (machine) {
      loadPreviousAssignment();
    } else {
      setPreviousAssignment(null);
    }
  }, [machine, plant, currentAssignments]);

  const selectedMachineDbNo = machine ? machine.replace(/[^0-9]/g, '') : '';
  const currentAssignedMachine = currentAssignments.find(a => a.machine_no === selectedMachineDbNo && a.is_current !== false);
  const currentAssignedOperator = selectedOperator && selectedOperator !== "No Operator Available"
    ? currentAssignments.find(a => a.operator_name === selectedOperator && a.is_current !== false) : null;
  const requiresOverride = !!currentAssignedMachine || !!currentAssignedOperator;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!machine) return alert("Please select a machine.");
    if (!selectedOperator) return alert("Please select an operator.");

    try {
      setLoading(true);
      const dbMachineNo = machine.replace(/[^0-9]/g, '');
      await axios.post(`${API_BASE}/assignment/save/`, {
        operator_name: selectedOperator,
        machine_no: dbMachineNo,
        plant: plant,
        shift: shift,
        section: machineSection,
        override: requiresOverride,
        assigned_by: localStorage.getItem("username") || "Unknown",
      });
      setShowSuccess(true);
      setTimeout(() => { setShowSuccess(false); loadCurrentAssignments(); }, 3000);
    } catch (error) {
      if (error.response?.data?.message) alert("🚨 ERROR: " + error.response.data.message);
      else alert("Assignment failed.");
    } finally { setLoading(false); }
  };

  if (!plant) {
    return (
      <div className="dashboard-container">
        <div
          style={{
            padding: "40px",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <h2>Plant Access Not Configured</h2>
          <p>
            This user must belong to either Plant_1_User or Plant_2_User.
          </p>
        </div>
      </div>
    );
  }

  const sortedOperators = [...operators].sort((a, b) => {
    const nameA = (a.name || a || "").trim();
    const nameB = (b.name || b || "").trim();

    return nameA.localeCompare(nameB, undefined, {
      sensitivity: "base",
    });
  });

  const filteredOperators = sortedOperators.filter((op) => {
    const opName = (op.name || op || "").toLowerCase();

    return opName.includes(operatorSearch.toLowerCase().trim());
  });

  const beforeOperator =
    previousAssignment?.operator_name || null;

  const afterOperator =
    currentAssignedMachine?.operator_name ||
    selectedOperator ||
    null;
  return (
    <div className="dashboard-container">

      {/* Top Header */}
      <div className="page-header">
        <div className="header-left">
          <span className="page-badge">1</span>
          <h1 className="page-title">Assign / Reassign Operator</h1>
        </div>
        <div className="header-right">
          <button className="btn-outline" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
          <button className="btn-danger" onClick={handleEndShift}>End Shift (Clear All)</button>
        </div>
      </div>

      {/* Main Card */}
      <div className="content-card">

        {/* Modern Tabs */}
        <div className="modern-tabs">
          <button className={`tab-item ${activeTab === 'assign' ? 'active' : ''}`} onClick={() => setActiveTab('assign')}>
            Assign Operator
          </button>
          <button className={`tab-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            Machine History
          </button>
        </div>

        {/* Tab 1: Assignment Form (2 Column Layout) */}
        {activeTab === 'assign' && (
          <div className="assignment-grid">

            {/* Left Column: Form */}
            <div className="form-column">
              <h3 className="section-title">Assignment Details</h3>

              <form onSubmit={handleSubmit} className="theme-form">

                <div className="form-row">
                  <div className="form-group">
                    <label>Plant</label>
                    <select className="input-field" disabled value={plant}>
                      <option value="plant_1">Plant 1</option>
                      <option value="plant_2">Plant 2</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Shift</label>
                    <select className="input-field" value={shift} disabled>
                      <option value="A">Shift A (08:30 AM - 08:00 PM)</option>
                      <option value="B">Shift B (08:00 PM - 08:30 AM)</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Machine Type</label>
                    <select className="input-field" value={machineSection} onChange={(e) => setMachineSection(e.target.value)}>
                      {Object.keys(MACHINE_CONFIG[plant]).map((section, idx) => (
                        <option key={idx} value={section}>{section}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Machine No.</label>
                    <select className="input-field" value={machine} onChange={(e) => setMachine(e.target.value)}>
                      <option value="">-- Choose --</option>
                      {machines.map((m, idx) => {
                        const dbNo = String(m).replace(/[^0-9]/g, '');
                        const isAssigned = currentAssignments.find(a => a.machine_no === dbNo && a.is_current !== false);
                        return (
                          <option key={idx} value={m}>
                            {m} {isAssigned ? `(Assigned: ${isAssigned.operator_name})` : '(Free)'}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="form-group operator-search-container">
                  <label>Operator</label>

                  <input
                    type="text"
                    className="input-field"
                    placeholder="Search operator..."
                    value={operatorSearch}
                    autoComplete="off"
                    onFocus={() => setShowOperatorDropdown(true)}
                    onBlur={() => {
                      setTimeout(() => {
                        setShowOperatorDropdown(false);
                      }, 150);
                    }}
                    onChange={(e) => {
                      setOperatorSearch(e.target.value);
                      setSelectedOperator("");
                      setShowOperatorDropdown(true);
                    }}
                  />

                  {showOperatorDropdown && (
                    <div className="operator-search-dropdown">

                      <div
                        className="operator-search-item idle-option"
                        onMouseDown={() => {
                          setSelectedOperator("No Operator Available");
                          setOperatorSearch("No Operator Available");
                          setShowOperatorDropdown(false);
                        }}
                      >
                        🛑 Mark Idle / No Operator
                      </div>

                      {filteredOperators.map((op) => {
                        const opName = op.name || op;

                        const opAssignment = currentAssignments.find(
                          (a) =>
                            a.operator_name === opName &&
                            a.is_current !== false
                        );

                        return (
                          <div
                            key={op.id || opName}
                            className="operator-search-item"
                            onMouseDown={() => {
                              setSelectedOperator(opName);
                              setOperatorSearch(opName);
                              setShowOperatorDropdown(false);
                            }}
                          >
                            <div className="operator-name">
                              {opName}
                            </div>

                            <div
                              className={
                                opAssignment
                                  ? "operator-working"
                                  : "operator-free"
                              }
                            >
                              {opAssignment
                                ? `Working on M${opAssignment.machine_no}`
                                : "Free"}
                            </div>
                          </div>
                        );
                      })}

                      {filteredOperators.length === 0 && (
                        <div className="operator-search-empty">
                          No operator found
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Add Operator Toggle */}
                <div className="add-op-link" onClick={() => setShowAddOperator(!showAddOperator)}>
                  + Add New Operator
                </div>

                {showAddOperator && (
                  <div className="add-operator-box">
                    <input type="text" className="input-field" placeholder="Operator Name" value={newOperatorName} onChange={(e) => setNewOperatorName(e.target.value)} />
                    <input type="text" className="input-field" placeholder="Emp Code (Optional)" value={newEmpCode} onChange={(e) => setNewEmpCode(e.target.value)} />
                    <div className="btn-group">
                      <button type="button" className="btn-primary-small" onClick={handleAddOperator}>Save</button>
                      <button type="button" className="btn-outline-small" onClick={() => setShowAddOperator(false)}>Cancel</button>
                    </div>
                  </div>
                )}

                <div className="form-actions">
                  <button type="button" className="btn-outline" onClick={() => {
                    setMachine(""); setSelectedOperator(""); setOperatorSearch("");
                    setPreviousAssignment(null);
                  }}>Reset</button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? "Processing..." : (requiresOverride ? "Reassign Operator" : "Assign Operator")}
                  </button>
                </div>

                {showSuccess && <div className="success-msg">✅ Assignment Saved Successfully!</div>}
              </form>
            </div>

            {/* Right Column: Preview (Matches Screenshot Theme) */}
            <div className="preview-column">
              <h3 className="section-title">Assignment Preview</h3>

              <div className="preview-card">
                <h4 className="preview-machine">{machine || "Select a Machine"}</h4>
                <p className="preview-sub">{requiresOverride ? "Reassignment Preview" : "New Assignment Preview"}</p>

                <div className="preview-status-box">
                  <div className="preview-label">Previous</div>
                  {beforeOperator ? (
                    <div className="preview-detail">
                      <span className="avatar purple">
                        {beforeOperator.charAt(0).toUpperCase()}
                      </span>

                      <div>
                        <div>{beforeOperator}</div>

                        {!currentAssignedMachine && previousAssignment && (
                          <small className="text-muted">
                            Previous assignment
                          </small>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="preview-detail text-muted">
                      No previous operator
                    </div>
                  )}
                </div>

                <div className="preview-arrow">↓</div>

                <div className="preview-status-box after-box">
                  <div className="preview-label text-green">Current</div>

                  {afterOperator ? (
                    <div className="preview-detail">
                      <span className="avatar blue">
                        {afterOperator.charAt(0).toUpperCase()}
                      </span>

                      <div>
                        <div>{afterOperator}</div>

                        {currentAssignedMachine && (
                          <small className="text-muted">
                            Current Operator
                          </small>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="preview-detail text-muted">
                      No current operator
                    </div>
                  )}
                </div>

                {currentAssignedOperator && selectedOperator !== "No Operator Available" && (
                  <div className="preview-warning">
                    ⚠️ <strong>{selectedOperator}</strong> is currently on M{currentAssignedOperator.machine_no}. They will be transferred.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: History (List View) */}
        {activeTab === 'history' && (
          <div className="history-tab">
            <div className="history-filters">
              <input type="date" className="input-field w-auto" value={historyDate} onChange={(e) => setHistoryDate(e.target.value)} />
            </div>

            <div className="table-responsive">
              <table className="theme-table">
                <thead>
                  <tr>
                    <th>Operator</th>
                    <th>Machine</th>
                    <th>Shift</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.length === 0 ? (
                    <tr><td colSpan="6" className="text-center">No assignments found</td></tr>
                  ) : (
                    historyData.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <div className="operator-cell">
                            <span className="avatar small">{item.operator_name === 'No Operator Available' ? '🛑' : item.operator_name.charAt(0)}</span>
                            {item.operator_name}
                          </div>
                        </td>
                        <td>{item.machine_no}</td>
                        <td>{item.shift}</td>
                        <td>{item.start_time}</td>
                        <td>{item.end_time || '-'}</td>
                        <td>
                          <span className={`badge ${item.is_current ? 'badge-green' : 'badge-gray'}`}>
                            {item.is_current ? 'Working' : 'Completed'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}