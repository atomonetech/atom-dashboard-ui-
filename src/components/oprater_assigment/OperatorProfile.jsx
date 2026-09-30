import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import "./RemainingScreens.css";

const RAW_API_BASE = (
  process.env.REACT_APP_API_URL ||
  "http://localhost:8000"
).replace(/\/+$/, "");

const API_BASE =
  RAW_API_BASE.endsWith("/api")
    ? RAW_API_BASE
    : `${RAW_API_BASE}/api`;

function getAccessToken() {
  return (
    localStorage.getItem("access") ||
    localStorage.getItem("access_token") ||
    ""
  );
}

function authHeaders() {
  const token = getAccessToken();

  return {
    "Content-Type": "application/json",
    ...(token
      ? { Authorization: `Bearer ${token}` }
      : {}),
  };
}

function localDateString() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    now.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTime(value) {
  if (!value) return "--";

  return new Date(value).toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

function formatDate(value) {
  if (!value) return "--";

  return new Date(value).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}



export default function OperatorProfile() {

  const [plant, setPlant] = useState("");
  const [allowedPlants, setAllowedPlants] =
    useState([]);

  const [operators, setOperators] =
    useState([]);

  const [searchText, setSearchText] =
    useState("");

  const [selectedOperator, setSelectedOperator] =
    useState(null);

  const [showSearchResults, setShowSearchResults] =
    useState(false);

  const [selectedDate, setSelectedDate] =
    useState(localDateString());

  const [period, setPeriod] =
    useState("today");

  const [profileData, setProfileData] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [historyExpanded, setHistoryExpanded] =
    useState(false);

  const [workExpanded, setWorkExpanded] =
    useState(false);


  useEffect(() => {
    loadOperators();
  }, [plant]);

  async function loadOperators() {
    try {
      setError("");

      const query =
        plant
          ? `?plant=${encodeURIComponent(plant)}`
          : "";

      const response = await fetch(
        `${API_BASE}/operators/${query}`,
        {
          headers: authHeaders(),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
          result.error ||
          "Unable to load operators."
        );
      }

      setPlant(result.plant);
      setAllowedPlants(
        result.allowed_plants || []
      );

      setOperators(
        result.operators || []
      );

    } catch (err) {
      setError(err.message);
    }
  }

  const filteredOperators = useMemo(() => {
    const q = searchText
      .trim()
      .toLowerCase();

    if (!q) {
      return operators.slice(0, 10);
    }

    return operators
      .filter((operator) => {
        const name =
          String(
            operator.name || ""
          ).toLowerCase();

        const employeeCode =
          String(
            operator.employee_code || ""
          ).toLowerCase();

        return (
          name.includes(q) ||
          employeeCode.includes(q)
        );
      })
      .slice(0, 10);

  }, [operators, searchText]);
  function selectOperator(operator) {
    setSelectedOperator(operator);

    setSearchText(
      operator.employee_code
        ? `${operator.name} (${operator.employee_code})`
        : operator.name
    );

    setShowSearchResults(false);
    setHistoryExpanded(false);
    setWorkExpanded(false);
  }

  useEffect(() => {
    if (!selectedOperator?.id) {
      setProfileData(null);
      return;
    }

    loadOperatorProfile();

  }, [
    selectedOperator?.id,
    selectedDate,
    period,
    plant,
  ]);

  async function loadOperatorProfile() {
    try {
      setLoading(true);
      setError("");

      const params =
        new URLSearchParams({
          operator_id:
            String(selectedOperator.id),

          period,
          date: selectedDate,
        });

      if (plant) {
        params.set("plant", plant);
      }

      const response = await fetch(
        `${API_BASE}/operator-profile-history/?${params.toString()}`,
        {
          headers: authHeaders(),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
          result.error ||
          "Unable to load operator history."
        );
      }

      setProfileData(result);

    } catch (err) {
      setProfileData(null);
      setError(err.message);

    } finally {
      setLoading(false);
    }
  }

  const operatorInfo =
    profileData?.operator ||
    selectedOperator ||
    {};

  const insights =
    profileData?.insights || {};

  const currentStatus =
    profileData?.current_status || {};

  const allHistory =
    profileData?.assignment_history || [];

  const workBreakdown =
    profileData?.work_breakdown || [];

  const visibleHistory =
    historyExpanded
      ? allHistory
      : allHistory.slice(0, 4);

  const visibleWork =
    workExpanded
      ? workBreakdown
      : workBreakdown.slice(0, 2);

  const isAssigned =
    currentStatus.status === "Assigned";

  const avatarLetter =
    operatorInfo?.name
      ? operatorInfo.name.charAt(0).toUpperCase()
      : "?";

  const periodLabel = {
    today: "Today",
    weekly: "This Week",
    monthly: "This Month",
    yearly: "This Year",
  }[period] || "Today";

  return (
    <div className="modern-container">
      {/* Header Section */}
      <div className="page-header operator-profile-header">

        <div className="header-left">
          <span className="page-badge"></span>

          <h1 className="page-title">
            Operator Profile / History
          </h1>
        </div>

        <div className="operator-history-filters">

          {/* AUTOMATIC PLANT */}
          <select
            className="operator-filter-control"
            value={plant}
            disabled={allowedPlants.length <= 1}
            onChange={(e) => {
              setPlant(e.target.value);
              setSelectedOperator(null);
              setSearchText("");
              setProfileData(null);
            }}
          >
            {allowedPlants.map((item) => (
              <option key={item} value={item}>
                {item === "plant_1"
                  ? "Plant 1"
                  : "Plant 2"}
              </option>
            ))}
          </select>

          {/* OPERATOR SEARCH */}
          <div className="operator-search-wrapper">

            <input
              className="operator-search-input"
              type="text"
              placeholder="Search name or employee ID..."
              value={searchText}
              onFocus={() =>
                setShowSearchResults(true)
              }
              onChange={(e) => {
                setSearchText(e.target.value);
                setSelectedOperator(null);
                setShowSearchResults(true);
              }}
            />

            {showSearchResults && (
              <div className="operator-search-results">

                {filteredOperators.length > 0 ? (
                  filteredOperators.map(
                    (operator) => (
                      <button
                        key={operator.id}
                        type="button"
                        className="operator-search-item"
                        onClick={() =>
                          selectOperator(operator)
                        }
                      >
                        <span>
                          {operator.name}
                        </span>

                        <small>
                          {operator.employee_code ||
                            `ID-${operator.id}`}
                        </small>
                      </button>
                    )
                  )
                ) : (
                  <div className="operator-no-result">
                    No operator found in this plant
                  </div>
                )}

              </div>
            )}
          </div>

          {/* DATE */}
          <input
            type="date"
            className="operator-filter-control"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(
                e.target.value
              )
            }
          />

          {/* PERIOD */}
          <select
            className="operator-filter-control"
            value={period}
            onChange={(e) =>
              setPeriod(e.target.value)
            }
          >
            <option value="today">
              Today
            </option>

            <option value="weekly">
              Weekly
            </option>

            <option value="monthly">
              Monthly
            </option>

            <option value="yearly">
              Yearly
            </option>
          </select>

        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            marginBottom: "16px",
            borderRadius: "8px",
            background: "rgba(239, 68, 68, 0.10)",
            border: "1px solid rgba(239, 68, 68, 0.35)",
            color: "#ef4444",
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
          ⚠ {error}
        </div>
      )}

      {loading && selectedOperator && (
        <div
          style={{
            padding: "10px 16px",
            marginBottom: "16px",
            borderRadius: "8px",
            background: "var(--tab-bg)",
            border: "1px solid var(--border-color)",
            color: "var(--text-muted)",
            fontSize: "13px",
          }}
        >
          Loading operator data...
        </div>
      )}

      {/* Top Row: 3 Cards Structure */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>

        {/* CARD 1: Operator Details */}
        {/* CARD 1: Operator Details */}
        <div className="card" style={{ flex: "1 1 250px" }}>

          {!selectedOperator ? (
            <div
              style={{
                minHeight: "220px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-muted)",
                textAlign: "center",
              }}
            >
              Search and select an operator
            </div>
          ) : (
            <>
              <div className="flex-center gap-4 mb-4">

                <div
                  className="avatar large purple"
                  style={{
                    width: "64px",
                    height: "64px",
                    fontSize: "28px",
                  }}
                >
                  {avatarLetter}
                </div>

                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "20px",
                    }}
                  >
                    {operatorInfo.name || "--"}
                  </h2>

                  <div className="mt-2">
                    <span
                      className="status-badge"
                      style={{
                        background: isAssigned
                          ? "#2563eb"
                          : "#16a34a",
                        color: "#fff",
                        border: "none",
                      }}
                    >
                      ● {isAssigned ? "Assigned" : "Free"}
                    </span>
                  </div>
                </div>

              </div>

              <div className="detail-row">
                <span className="label">
                  Operator ID
                </span>

                <span className="val">
                  {operatorInfo.employee_code || "--"}
                </span>
              </div>

              <div className="detail-row">
                <span className="label">
                  Department
                </span>

                <span className="val">
                  {operatorInfo.department || "--"}
                </span>
              </div>

              <div className="detail-row">
                <span className="label">
                  Phone
                </span>

                <span className="val">
                  {operatorInfo.phone || "--"}
                </span>
              </div>

              <div className="detail-row">
                <span className="label">
                  Email
                </span>

                <span
                  className="val"
                  style={{ fontSize: "13px" }}
                >
                  {operatorInfo.email || "--"}
                </span>
              </div>
            </>
          )}

        </div>

        {/* CARD 2: Key Insights */}

        {/* CARD 2: Key Insights */}
        <div
          className="card"
          style={{ flex: "2 1 400px" }}
        >

          <div className="flex-center gap-2 mb-4">
            <div
              style={{
                color: "#fbbf24",
                display: "flex",
              }}
            >
              💡
            </div>

            <h3
              className="section-title"
              style={{ margin: 0 }}
            >
              Key Insights
            </h3>
          </div>

          <div className="operator-insight-grid">

            <div className="operator-insight">
              <span>Total Production</span>
              <strong>
                {insights.total_production || 0} Pcs
              </strong>
            </div>

            <div className="operator-insight">
              <span>Working Time</span>
              <strong>
                {insights.working_display || "0s"}
              </strong>
            </div>

            <div className="operator-insight">
              <span>Total Online Idle</span>
              <strong>
                {insights.online_idle_display || "0s"}
              </strong>
            </div>

            <div className="operator-insight">
              <span>Total Offline Idle</span>
              <strong>
                {insights.offline_idle_display || "0s"}
              </strong>
            </div>

          </div>

        </div>

        {/* CARD 3: Current Status Summary */}
        <div
          className="card"
          style={{ flex: "1 1 250px" }}
        >

          <div className="flex-between mb-2">

            <span
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
              }}
            >
              Current Status
            </span>

            <span
              className="status-badge"
              style={{
                background: isAssigned
                  ? "#2563eb"
                  : "#16a34a",
                color: "#fff",
                border: "none",
              }}
            >
              ● {isAssigned ? "Assigned" : "Free"}
            </span>

          </div>

          <h2
            style={{
              fontSize: "28px",
              margin: "8px 0",
              color: "var(--text-dark)",
            }}
          >
            {isAssigned
              ? `Machine ${currentStatus.machine_no}`
              : "Available"}
          </h2>

          <div style={{ marginTop: "28px" }}>

            <div
              className="flex-between"
              style={{
                padding: "8px 0",
                borderBottom:
                  "1px dashed var(--border-color)",
                fontSize: "13px",
              }}
            >
              <span className="text-muted">
                {isAssigned
                  ? "Assigned Since"
                  : "Free Since"}
              </span>

              <span
                style={{
                  color: "var(--text-dark)",
                  fontWeight: "bold",
                }}
              >
                {formatTime(currentStatus.since)}
              </span>
            </div>

            <div
              className="flex-between"
              style={{
                padding: "8px 0",
                borderBottom:
                  "1px dashed var(--border-color)",
                fontSize: "13px",
              }}
            >
              <span className="text-muted">
                Shift
              </span>

              <span
                style={{
                  color: "var(--text-dark)",
                  fontWeight: "bold",
                }}
              >
                {currentStatus.shift || "--"}
              </span>
            </div>

            <div
              className="flex-between"
              style={{
                padding: "8px 0",
                fontSize: "13px",
              }}
            >
              <span className="text-muted">
                Selected Date
              </span>

              <span
                style={{
                  color: "var(--text-dark)",
                  fontWeight: "bold",
                }}
              >
                {selectedDate}
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Row: 2 Cards Structure */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>

        {/* Main History Table */}
        {/* Assignment History */}
        <div
          className="card"
          style={{ flex: "2 1 600px" }}
        >

          <div className="flex-between mb-4">

            <h3
              className="section-title"
              style={{ margin: 0 }}
            >
              Assignment History
            </h3>

            <span
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
              }}
            >
              {periodLabel}
            </span>

          </div>

          <div style={{ overflowX: "auto" }}>

            <table
              className="theme-table"
              style={{
                width: "100%",
                textAlign: "left",
                borderCollapse: "collapse",
              }}
            >

              <thead>
                <tr>
                  <th>Date</th>
                  <th>Machine</th>
                  <th>Shift</th>
                  <th>Time</th>
                  <th>Working Time</th>
                  <th>Production</th>
                </tr>
              </thead>

              <tbody>

                {visibleHistory.length > 0 ? (

                  visibleHistory.map((item) => (

                    <tr key={item.id}>

                      <td>
                        {formatDate(item.start_time)}
                      </td>

                      <td>
                        <strong>
                          Machine {item.machine_no}
                        </strong>
                      </td>

                      <td>
                        {item.shift || "--"}
                      </td>

                      <td>
                        {formatTime(item.start_time)}
                        {" - "}
                        {formatTime(item.end_time)}
                      </td>

                      <td>
                        {item.duration_display}
                      </td>

                      <td>
                        {item.production || 0} Pcs
                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                        padding: "25px",
                        color: "var(--text-muted)",
                      }}
                    >
                      {selectedOperator
                        ? "No assignment history found."
                        : "Select an operator."}
                    </td>
                  </tr>

                )}

              </tbody>
            </table>

          </div>

          {allHistory.length > 4 && (
            <button
              type="button"
              className="history-expand-button"
              onClick={() =>
                setHistoryExpanded(
                  (previous) => !previous
                )
              }
            >
              {historyExpanded
                ? "Show Less"
                : `Show All (${allHistory.length})`}
            </button>
          )}

        </div>

        {/* Work Breakdown */}
        <div
          className="card"
          style={{ flex: "1 1 300px" }}
        >

          <div
            className="flex-between mb-4"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >

            <h3
              className="section-title"
              style={{ margin: 0 }}
            >
              Work Breakdown ({periodLabel})
            </h3>

            <span
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                color: "var(--green)",
              }}
            >
              Total: {insights.working_display || "0s"}
            </span>

          </div>

          <div className="work-breakdown-list">

            {visibleWork.length > 0 ? (

              visibleWork.map((item) => (

                <div
                  className="work-breakdown-item"
                  key={item.id}
                >

                  <div className="flex-between mb-2">

                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "var(--text-dark)",
                      }}
                    >
                      Machine {item.machine_no}
                    </span>

                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--text-muted)",
                      }}
                    >
                      {formatTime(item.start_time)}
                      {" - "}
                      {formatTime(item.end_time)}
                    </span>

                  </div>

                  <div className="flex-between mt-3">
                    <span className="text-muted">
                      Production
                    </span>

                    <strong>
                      {item.production || 0} Pcs
                    </strong>
                  </div>

                  <div className="flex-between mt-1">
                    <span className="text-muted">
                      Overall Working Time
                    </span>

                    <strong
                      style={{
                        color: "var(--green)",
                      }}
                    >
                      {item.duration_display}
                    </strong>
                  </div>

                </div>

              ))

            ) : (

              <div
                style={{
                  textAlign: "center",
                  padding: "25px",
                  color: "var(--text-muted)",
                }}
              >
                No work breakdown available.
              </div>

            )}

          </div>

          {workBreakdown.length > 2 && (
            <button
              type="button"
              className="history-expand-button"
              onClick={() =>
                setWorkExpanded(
                  (previous) => !previous
                )
              }
            >
              {workExpanded
                ? "Show Less"
                : `Show All (${workBreakdown.length})`}
            </button>
          )}

        </div>

      </div>
    </div>
  );
}