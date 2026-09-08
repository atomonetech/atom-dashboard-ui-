//

import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:9000";

// =================================================================================
// IDLE REASONS & ICONS DATA
// =================================================================================
const IDLE_REASONS = {
  "Tool Breakdown": [
    "Overload / Wrong Parameters",
    "Material Hardness",
    "Coolant Issue",
    "Improper Clamping",
    "Wear and Tear",
    "Other",
  ],
  "Machine Breakdown": [
    "Electrical/Electronic Failure",
    "Motor / Drive Trip",
    "Mechanical Failure",
    "Hydraulic / Pneumatic Issue",
    "Software / CNC Error",
    "Other",
  ],
  "Machine Maintenance": [
    "Lubrication / Oiling",
    "Filter / Tank Cleaning",
    "Preventive Maintenance (PM)",
    "Adjustments & Tightening",
    "Other",
  ],
  "Tool Maintenance": [
    "Tool Sharpening / Grinding",
    "Insert Rotation",
    "Chip / Burr Clearing",
    "Offset Adjustment",
    "Other",
  ],
  "Tool Change": [
    "Tool Life Reached",
    "Operation Change",
    "Tool Breakage Replacement",
    "Other",
  ],
  "Material Shortage": [
    "Delay from Store",
    "Delay from Previous Process",
    "Trolley / Forklift Unavailable",
    "Material Hold by QC",
    "Other",
  ],
  "Operator Unavailable": [
    "Tea / Lunch Break",
    "Shift Handover",
    "Nature's Call",
    "Gone to Store / Supervisor",
    "Meeting / Training",
    "Other",
  ],
  Other: ["Other"],
};

const CATEGORY_ICONS = {
  "Tool Breakdown": "bi bi-hammer",
  "Machine Breakdown": "bi bi-lightning-charge-fill",
  "Machine Maintenance": "bi bi-gear-fill",
  "Tool Maintenance": "bi bi-tools",
  "Tool Change": "bi bi-arrow-repeat",
  "Material Shortage": "bi bi-boxes",
  "Operator Unavailable": "bi bi-person-x-fill",
  Other: "bi bi-question-circle-fill",
};

// =================================================================================
// PREMIUM CUSTOM DROPDOWN COMPONENT
// =================================================================================
const CustomDropdown = ({ value, onChange, options, placeholder, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: "relative", width: "100%" }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "14px 18px",
          borderRadius: "12px",
          background: "#1e293b",
          color: value ? "#f8fafc" : "#94a3b8",
          border: `1px solid ${isOpen ? "#fcd34d" : "rgba(245, 158, 11, 0.4)"}`,
          boxShadow: isOpen
            ? "0 0 0 3px rgba(245, 158, 11, 0.15)"
            : "0 4px 15px rgba(0,0,0,0.2)",
          fontSize: "15px",
          fontWeight: "600",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "all 0.3s ease",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {value && icon && CATEGORY_ICONS[value] && (
            <i
              className={CATEGORY_ICONS[value]}
              style={{ color: "#fcd34d" }}
            ></i>
          )}
          <span>{value || placeholder}</span>
        </div>
        <div
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            color: isOpen ? "#fcd34d" : "#94a3b8",
            display: "flex",
            alignItems: "center",
          }}
        >
          ▼
        </div>
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "8px",
            background: "#0f172a",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
            maxHeight: "250px",
            overflowY: "auto",
            zIndex: 9999,
            animation:
              "slideDownDropdown 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards",
            transformOrigin: "top center",
          }}
        >
          {options.map((opt, idx) => (
            <div
              key={idx}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(245, 158, 11, 0.15)";
                e.currentTarget.style.color = "#fbbf24";
                e.currentTarget.style.paddingLeft = "24px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color =
                  value === opt ? "#fbbf24" : "#f8fafc";
                e.currentTarget.style.paddingLeft = "18px";
              }}
              style={{
                padding: "14px 18px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                color: value === opt ? "#fbbf24" : "#f8fafc",
                background:
                  value === opt ? "rgba(245, 158, 11, 0.08)" : "transparent",
                borderBottom:
                  idx !== options.length - 1
                    ? "1px solid rgba(255,255,255,0.05)"
                    : "none",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {icon && CATEGORY_ICONS[opt] && (
                <i className={CATEGORY_ICONS[opt]} style={{ opacity: 0.7 }}></i>
              )}
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// =================================================================================
// MAIN COMPONENT
// =================================================================================
export default function Plant2Live() {
  const navigate = useNavigate();
  const location = useLocation();
  const fetchInProgressRef = useRef(false);
  const [isDark, setIsDark] = useState(true);
  const [machines, setMachines] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedMachine, setSelectedMachine] = useState(null);
  const [machineChanges, setMachineChanges] = useState([]);
  const [showChanges, setShowChanges] = useState(false);

  const [showHistoryView, setShowHistoryView] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [historyDate, setHistoryDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [historyShift, setHistoryShift] = useState("A");
  const [historySummary, setHistorySummary] = useState(null);
  const [historyHourlySummary, setHistoryHourlySummary] = useState([]);
  const [historyMachineMeta, setHistoryMachineMeta] = useState(null);

  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [isMounted, setIsMounted] = useState(false);
  const [currentShift, setCurrentShift] = useState("A");
  const [liveIdleSeconds, setLiveIdleSeconds] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());

  const [idleCategory, setIdleCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [idleSubReason, setIdleSubReason] = useState("");
  const [idleRemarks, setIdleRemarks] = useState("");
  const [isSubmittingReason, setIsSubmittingReason] = useState(false);

  const [reasonLoggedStates, setReasonLoggedStates] = useState(() => {
    try {
      const saved = localStorage.getItem("reasonLoggedStates_plant2");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {};
  });

  useEffect(() => {
    localStorage.setItem(
      "reasonLoggedStates_plant2",
      JSON.stringify(reasonLoggedStates),
    );
  }, [reasonLoggedStates]);

  const intervalRef = useRef(null);
  const lastSavedHour = useRef(new Date().getHours());

  const formatLiveIdle = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  // ✅ Ideal time display helper
  // DB/API ideal_time seconds me rakhega. UI me readable format show karenge.
  const formatIdealDuration = (seconds, hideSeconds = false) => {
    const totalSeconds = Math.max(0, Math.floor(Number(seconds) || 0));
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hideSeconds) {
      if (hrs > 0) return `${hrs} hr ${mins} min`;
      return `${mins} min`;
    }

    if (hrs > 0) return `${hrs} hr ${mins} min ${secs} sec`;
    if (mins > 0) return `${mins} min ${secs} sec`;
    return `${secs} sec`;
  };

  const formatShutHeightDisplay = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      value === "No data" ||
      value === "N/A"
    ) {
      return "--";
    }

    const raw = String(value).trim();
    if (raw.toLowerCase().includes("fail")) return "Failed";

    const num = Number(raw);
    if (Number.isFinite(num)) {
      // MQTT/cache miss 0.01 / 1.01 type reading ko UI me Failed show karna hai.
      if (num > 0 && num <= 10) return "Failed";
      if (num <= 0) return "--";
      return num.toFixed(2);
    }

    return raw;
  };

  const getNumberValue = (...values) => {
    for (const value of values) {
      const num = Number(value);
      if (Number.isFinite(num)) return num;
    }
    return 0;
  };

  // ✅ Requirement:
  // Machine ON hai  -> Online Ideal show hoga
  // Machine OFF hai -> Offline Ideal show hoga
  const getVisibleIdealMode = (machine) => {
    return machine?.machine_on ? "ONLINE" : "OFFLINE";
  };

  const getVisibleIdealLabel = (machine) => {
    return machine?.machine_on ? "Online Ideal" : "Offline Ideal";
  };

  // OFFLINE:
  //   saved OFFLINE ideal + current OFFLINE TIMER
  //
  // ONLINE and OFFLINE never mix.
  // ==========================================================

  const getStoredIdealSeconds = (machine) => {
    if (!machine) return 0;

    // Machine ON -> ONLINE history
    if (machine.machine_on) {
      return Number(machine.stored_online_ideal_shift || 0);
    }

    // Machine OFF -> OFFLINE history
    return Number(machine.stored_offline_ideal_shift || 0);
  };

  const getCurrentIdealSeconds = (machine, currentLiveSeconds = 0) => {
    if (!machine) return 0;

    // Running machine has no CURRENT Ideal.
    if (machine.is_producing) {
      return 0;
    }

    const apiMode = String(machine.live_ideal_mode || "")
      .trim()
      .toUpperCase();

    // ========================================================
    // ONLINE IDLE
    //
    // ONLINE is NOT hour-split.
    // Therefore use full current physical ONLINE event.
    // ========================================================

    if (machine.machine_on && apiMode === "ONLINE") {
      return Math.max(0, Number(machine.live_ideal_time || 0));
    }

    // ========================================================
    // OFFLINE
    //
    // Previous completed hours already exist in stored DB total.
    // Therefore use ONLY current-hour open tail.
    // ========================================================

    if (!machine.machine_on) {
      const apiLiveOffline =
        apiMode === "OFFLINE"
          ? Math.max(0, Number(machine.live_ideal_hour_time || 0))
          : 0;

      const frontendLiveOffline = Math.max(0, Number(currentLiveSeconds || 0));

      return Math.max(apiLiveOffline, frontendLiveOffline);
    }

    return 0;
  };

  const getVisibleIdealSeconds = (machine, currentLiveSeconds = 0) => {
    if (!machine) return 0;

    // ========================================================
    // OFFLINE - FINAL DIRECT CALCULATION
    //
    // IMPORTANT:
    // Use EXACT SAME timer which is displayed in
    // the big OFFLINE TIMER box.
    //
    // Lower Offline Ideal =
    // Stored Offline Ideal + Current Offline Timer
    // ========================================================

    if (!machine.machine_on) {
      const storedOfflineSeconds = Math.max(
        0,
        Number(machine.stored_offline_ideal_shift || 0),
      );

      const currentOfflineSeconds = Math.max(
        0,
        Number(currentLiveSeconds || 0),
      );

      return storedOfflineSeconds + currentOfflineSeconds;
    }

    // ========================================================
    // ONLINE - KEEP EXISTING WORKING LOGIC UNCHANGED
    // ========================================================

    const stored = getStoredIdealSeconds(machine);

    const current = getCurrentIdealSeconds(machine, currentLiveSeconds);

    return Math.max(0, stored + current);
  };

  const getVisibleIdealDisplay = (machine, currentLiveSeconds = 0) => {
    const totalSeconds = getVisibleIdealSeconds(machine, currentLiveSeconds);

    if (totalSeconds <= 0) {
      return "0 sec";
    }

    // Below card:
    // seconds nahi dikhane hain.
    //
    // 48 sec       -> 0 min
    // 12m 27s      -> 12 min
    // 3h 07m 48s   -> 3 hr 7 min
    return formatIdealDuration(totalSeconds, true);
  };

  // ✅ Safe comparison helper: backend kabhi number, kabhi string bhej sakta hai
  const sameMachine = (a, b) => String(a) === String(b);

  const getSafeCount = (value) => {
    const count = Number(value);
    return Number.isFinite(count) ? count : 0;
  };

  const getMachineStatus = (m) => {
    if (!m.machine_on) return "OFFLINE";
    if (m.is_producing) return "RUNNING";
    return "IDLE";
  };

  const getMachineColor = (machine) => {
    if (!machine.machine_on) return "#475569";
    if (machine.is_producing) return "#10b981";
    return "#f59e0b";
  };

  const getMachineGlow = (machine) => {
    if (!machine.machine_on) return "none";
    if (machine.is_producing) return "0 0 15px rgba(16, 185, 129, 0.4)";
    return "0 0 15px rgba(245, 158, 11, 0.4)";
  };

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateShift = () => {
      const now = new Date();
      const mins = now.getHours() * 60 + now.getMinutes();
      setCurrentShift(mins >= 510 && mins < 1200 ? "A" : "B");
      setCurrentHour(now.getHours());
    };

    updateShift();
    const shiftInterval = setInterval(updateShift, 60000);
    return () => clearInterval(shiftInterval);
  }, []);

  const fetchData = async () => {
    if (!isMounted) return;
    if (fetchInProgressRef.current) {
      console.log(
        "⏭️ plant2-live fetch skipped - previous request still running",
      );
      return;
    }

    fetchInProgressRef.current = true;

    try {
      const response = await fetch(`${API_BASE}/api/plant2-live/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      if (data.success && Array.isArray(data.machines)) {
        if (isMounted) {
          setMachines(data.machines);
          setError("");

          setSelectedMachine((prev) => {
            if (!prev) return null;
            const updated = data.machines.find((m) =>
              sameMachine(m.machine_no, prev.machine_no),
            );
            return updated || prev;
          });

          setReasonLoggedStates((prev) => {
            const newState = { ...prev };
            data.machines.forEach((m) => {
              if (m.has_pending_reason) {
                newState[m.machine_no] = m.machine_on ? "IDLE" : "OFFLINE";
              } else if (
                m.is_producing ||
                (newState[m.machine_no] === "OFFLINE" && m.machine_on)
              ) {
                delete newState[m.machine_no];
              }
            });
            return newState;
          });
        }
      }
    } catch (error) {
      console.error("❌ Plant2 Live fetch error:", error);
    } finally {
      fetchInProgressRef.current = false;
    }
  };

  // ✅ Initial load + safety polling
  // WebSocket realtime update dega, polling backup hai agar network ke wajah se koi update miss ho.
  useEffect(() => {
    if (!isMounted) return;

    fetchData();

    const refreshInterval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, [isMounted]);

  // =================================================================================
  // 🔥 NAYA WEBSOCKET LOGIC (Auto-Reconnect ke sath)
  // =================================================================================
  useEffect(() => {
    let ws;
    let reconnectTimer;
    let active = true;

    const connectWebSocket = () => {
      const ws_scheme = window.location.protocol === "https:" ? "wss" : "ws";
      const ws_base = API_BASE.replace(/^http/, ws_scheme).replace(/\/$/, "");
      ws = new WebSocket(`${ws_base}/ws/plant2/live/`);

      ws.onopen = () => {
        if (!active) {
          ws.close();
          return;
        }

        console.log("✅ WebSocket Connected! Dashboard is Live.");
      };

      ws.onmessage = (event) => {
        try {
          const response = JSON.parse(event.data);

          if (response.type !== "realtime_update") {
            return;
          }

          const liveData = response.data || {};

          // =====================================================
          // 1. IDLE/OFFLINE REASON UPDATED
          // Another user filled the reason
          // =====================================================
          if (liveData.event_type === "idle_reason_updated") {
            const machineNo = liveData.machine_no;

            console.log("📡 IDLE REASON UPDATE RECEIVED:", liveData);

            setReasonLoggedStates((prev) => ({
              ...prev,
              [machineNo]: liveData.reason_state || "IDLE",
            }));

            // Keep machine object consistent too
            setMachines((prevMachines) =>
              prevMachines.map((machine) =>
                sameMachine(machine.machine_no, machineNo)
                  ? {
                      ...machine,
                      has_pending_reason: true,
                    }
                  : machine,
              ),
            );

            setSelectedMachine((prev) => {
              if (prev && sameMachine(prev.machine_no, machineNo)) {
                return {
                  ...prev,
                  has_pending_reason: true,
                };
              }

              return prev;
            });

            return;
          }

          // =====================================================
          // 2. IDEAL REPORT SUBMITTED FROM IdleCase.js
          // Do NOT treat this as COUNT data
          // =====================================================
          if (liveData.event_type === "ideal_report_updated") {
            const machineNo = liveData.machine_no;

            console.log(
              "📡 IDEAL REPORT UPDATE RECEIVED ON DASHBOARD:",
              liveData,
            );

            if (liveData.report_status === "SUBMITTED") {
              const submittedState =
                String(liveData.ideal_mode || "").toUpperCase() === "OFFLINE"
                  ? "OFFLINE"
                  : "IDLE";

              // IMPORTANT:
              // Every browser gets Submitted status immediately.
              setReasonLoggedStates((prev) => ({
                ...prev,
                [machineNo]: submittedState,
              }));

              setMachines((prevMachines) =>
                prevMachines.map((machine) =>
                  sameMachine(machine.machine_no, machineNo)
                    ? {
                        ...machine,
                        has_pending_reason: true,
                        report_status: "SUBMITTED",
                        submitted_by: liveData.submitted_by || null,
                      }
                    : machine,
                ),
              );

              setSelectedMachine((prev) => {
                if (prev && sameMachine(prev.machine_no, machineNo)) {
                  return {
                    ...prev,
                    has_pending_reason: true,
                    report_status: "SUBMITTED",
                    submitted_by: liveData.submitted_by || null,
                  };
                }

                return prev;
              });

              window.dispatchEvent(new Event("notificationCountRefresh"));
            }

            fetchData();

            return;
          }

          // =====================================================
          // 3. NORMAL MQTT / COUNT UPDATE
          // =====================================================
          const liveMachineNo = liveData.machine_no;

          if (liveMachineNo === undefined || liveMachineNo === null) {
            return;
          }

          const currentHourCountFromDb = getSafeCount(
            liveData.current_hour_count,
          );

          const cumulativeCountFromDb = getSafeCount(liveData.cumulative_count);

          console.log("🔥 LIVE COUNT DATA:", liveData);

          setMachines((prevMachines) => {
            if (prevMachines.length === 0) {
              return prevMachines;
            }

            return prevMachines.map((machine) =>
              sameMachine(machine.machine_no, liveMachineNo)
                ? {
                    ...machine,
                    current_hour_count: currentHourCountFromDb,
                    cumulative_count: cumulativeCountFromDb,
                    machine_on: true,
                    is_producing: true,
                    last_activity: new Date().toLocaleTimeString("en-GB", {
                      hour12: false,
                    }),
                  }
                : machine,
            );
          });

          setSelectedMachine((prev) => {
            if (prev && sameMachine(prev.machine_no, liveMachineNo)) {
              return {
                ...prev,
                current_hour_count: currentHourCountFromDb,
                cumulative_count: cumulativeCountFromDb,
                machine_on: true,
                is_producing: true,
                last_activity: new Date().toLocaleTimeString("en-GB", {
                  hour12: false,
                }),
              };
            }

            return prev;
          });
        } catch (err) {
          console.error("❌ WebSocket message parse/update error:", err);
        }
      };

      ws.onclose = () => {
        if (!active) {
          return;
        }

        console.log("⚠️ WebSocket Disconnected. Reconnecting in 3 seconds...");

        reconnectTimer = setTimeout(connectWebSocket, 3000);
      };
    };

    connectWebSocket();

    return () => {
      active = false;

      clearTimeout(reconnectTimer);

      if (ws) {
        ws.onclose = null;

        // Do not close while browser is still CONNECTING.
        // That creates:
        // "closed before connection is established"
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      }
    };
  }, []);
  // =================================================================================

  useEffect(() => {
    const idleTimer = setInterval(() => {
      const now = new Date();
      const newLiveIdle = {};

      setReasonLoggedStates((prev) => {
        let changed = false;
        const newState = { ...prev };

        machines.forEach((machine) => {
          const machineNo = machine.machine_no;
          const loggedType = newState[machineNo];

          if (loggedType === "IDLE" && machine.is_producing) {
            delete newState[machineNo];
            changed = true;
          } else if (loggedType === "OFFLINE" && machine.machine_on) {
            delete newState[machineNo];
            changed = true;
          }

          if (!machine.is_producing) {
            const currentHourStart = new Date(now);
            currentHourStart.setMinutes(0, 0, 0);
            let idleSeconds = 0;
            let baseTime = currentHourStart;

            if (!machine.machine_on && machine.offline_since) {
              const [hours, minutes, seconds] = machine.offline_since
                .split(":")
                .map(Number);
              const lastTime = new Date(now);
              lastTime.setHours(hours, minutes, seconds || 0, 0);
              baseTime = lastTime;
            } else if (
              machine.last_activity &&
              machine.last_activity !== "Never"
            ) {
              const [hours, minutes, seconds] = machine.last_activity
                .split(":")
                .map(Number);
              const lastTime = new Date(now);
              lastTime.setHours(hours, minutes, seconds || 0, 0);
              baseTime = lastTime;
            } else if (machine.on_since) {
              const [hours, minutes, seconds] = machine.on_since
                .split(":")
                .map(Number);
              const onTime = new Date(now);
              onTime.setHours(hours, minutes, seconds || 0, 0);
              baseTime = onTime;
            }

            idleSeconds =
              baseTime >= currentHourStart
                ? Math.floor((now - baseTime) / 1000)
                : Math.floor((now - currentHourStart) / 1000);
            newLiveIdle[machineNo] = Math.max(0, Math.min(idleSeconds, 3600));
          } else {
            newLiveIdle[machineNo] = 0;
          }
        });

        setLiveIdleSeconds(newLiveIdle);
        return changed ? newState : prev;
      });
    }, 1000);
    return () => clearInterval(idleTimer);
  }, [machines, currentHour]);

  // ✅ Hour change frontend reset
  // Important:
  // Frontend se save-hourly-snapshot API call nahi karna.
  // Agar dashboard 5 systems par open hai to 5 baar snapshot hit ho sakta hai.
  // Backend already hourly tracker chala raha hai.
  //
  // Requirement:
  // Hour change hote hi sab machines ka current_hour_count 0 dikhna chahiye,
  // count aaye ya na aaye. Next count aayega to DB se exact 1/2/3... update ho jayega.
  useEffect(() => {
    const checkHourChange = () => {
      const now = new Date();
      const hour = now.getHours();

      if (lastSavedHour.current !== hour) {
        console.log(
          `⏰ Hour changed ${lastSavedHour.current} → ${hour}. Resetting current hour counts to 0.`,
        );

        lastSavedHour.current = hour;
        setCurrentHour(hour);
        setLiveIdleSeconds({});

        setMachines((prevMachines) =>
          prevMachines.map((machine) => ({
            ...machine,
            last_hour_count: getSafeCount(machine.current_hour_count),
            current_hour_count: 0,
          })),
        );

        setSelectedMachine((prev) =>
          prev
            ? {
                ...prev,
                last_hour_count: getSafeCount(prev.current_hour_count),
                current_hour_count: 0,
              }
            : prev,
        );

        // Backend se confirm/sync kar lo.
        // Agar hour ke first seconds me count already insert ho gaya ho, UI exact DB count le lega.
        setTimeout(() => fetchData(), 1500);
        setTimeout(() => fetchData(), 5000);
      }
    };

    const hourCheckInterval = setInterval(checkHourChange, 1000);
    return () => clearInterval(hourCheckInterval);
  }, [isMounted]);

  const checkLunchTime = () => {
    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    // Plant 2 lunch time: 12:15 PM to 12:45 PM
    return mins >= 12 * 60 + 15 && mins < 12 * 60 + 45;
  };

  const handleMachineClick = (machine) => {
    setSelectedMachine(machine);
    setShowChanges(false);
    setShowHistoryView(false);

    setIdleCategory("");
    setCustomCategory("");
    setIdleSubReason("");
    setIdleRemarks("");

    fetch(`${API_BASE}/api/machine-changes/?machine_no=${machine.machine_no}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setMachineChanges(data.changes);
      })
      .catch((err) => console.error("Error fetching changes:", err));
  };

  useEffect(() => {
    if (location.state?.autoOpenMachine && machines.length > 0) {
      const targetNum = parseInt(
        String(location.state.autoOpenMachine).replace(/\D/g, ""),
        10,
      );
      const targetMachine = machines.find((m) => {
        const mNum = parseInt(String(m.machine_no).replace(/\D/g, ""), 10);
        return mNum === targetNum;
      });

      if (targetMachine) {
        handleMachineClick(targetMachine);
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location.state, machines, navigate, location.pathname]);

  const fetchMachineHistory = (machineNo, dateStr, shiftVal = historyShift) => {
    setHistoryLoading(true);
    setHistoryError("");

    fetch(
      `${API_BASE}/api/machine-history/?plant_no=2&machine_no=${machineNo}&date=${dateStr}&shift=${shiftVal}`,
    )
      .then((res) => {
        if (!res.ok) throw new Error(`Server API Error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setHistoryData(data.events || []);
          setHistorySummary(data.summary || null);
          setHistoryHourlySummary(data.hourly_summary || []);
          setHistoryMachineMeta(data.machine_meta || null);
        } else {
          setHistoryData([]);
          setHistorySummary(null);
          setHistoryHourlySummary([]);
          setHistoryMachineMeta(null);
          setHistoryError(data.error || "API returned success: false");
        }
      })
      .catch((err) => {
        console.error("Error fetching history:", err);
        setHistoryData([]);
        setHistorySummary(null);
        setHistoryHourlySummary([]);
        setHistoryMachineMeta(null);
        setHistoryError(err.message);
      })
      .finally(() => setHistoryLoading(false));
  };

  const toggleHistoryView = () => {
    const newShowHistory = !showHistoryView;
    setShowHistoryView(newShowHistory);
    if (newShowHistory && selectedMachine)
      fetchMachineHistory(
        selectedMachine.machine_no,
        historyDate,
        historyShift,
      );
  };

  const closeModal = () => {
    setSelectedMachine(null);
    setMachineChanges([]);
    setShowChanges(false);
    setShowHistoryView(false);
    setHistoryData([]);
    setHistorySummary(null);
    setHistoryHourlySummary([]);
    setHistoryMachineMeta(null);
    setIdleCategory("");
    setCustomCategory("");
    setIdleSubReason("");
    setIdleRemarks("");
  };

  const isFormValid =
    idleCategory &&
    idleSubReason &&
    (idleCategory !== "Other" || customCategory.trim() !== "") &&
    (idleSubReason !== "Other" || idleRemarks.trim() !== "");

  const handleReasonSubmit = async () => {
    // ============================================================
    // VALIDATION
    // ============================================================

    if (!idleCategory || !idleSubReason) {
      alert("Please select both Category and Reason!");
      return;
    }

    if (idleCategory === "Other" && !customCategory.trim()) {
      alert("Please specify the custom category.");
      return;
    }

    if (idleSubReason === "Other" && !idleRemarks.trim()) {
      alert("Please provide the exact issue for the 'Other' reason.");
      return;
    }

    if (!selectedMachine) {
      alert("Machine not selected.");
      return;
    }

    setIsSubmittingReason(true);

    const finalCategory =
      idleCategory === "Other" ? customCategory.trim() : idleCategory;

    const finalRemarks = idleRemarks.trim();

    try {
      // ============================================================
      // 1. TOKEN
      // ============================================================

      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Login session not found. Please login again.");
      }

      // ============================================================
      // 2. CURRENT MACHINE MODE
      // ============================================================

      const currentMode = selectedMachine.machine_on ? "ONLINE" : "OFFLINE";

      const targetMachineNo = parseInt(
        String(selectedMachine.machine_no).replace(/\D/g, ""),
        10,
      );

      // ============================================================
      // 3. LOAD CURRENT NOTIFICATIONS
      // ============================================================

      const notificationResponse = await fetch(
        `${API_BASE}/api/my-notifications/`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const notificationData = await notificationResponse.json();

      if (notificationResponse.status === 401) {
        throw new Error("Session expired. Please login again.");
      }

      if (!notificationResponse.ok || !notificationData.success) {
        throw new Error(
          notificationData.error ||
            notificationData.message ||
            "Could not load current notification.",
        );
      }

      const allNotifications = Array.isArray(notificationData.data)
        ? notificationData.data
        : [];

      console.log("🔔 PLANT 2 ALL NOTIFICATIONS:", allNotifications);

      // ============================================================
      // 4. FIND ONLY CURRENT ACTIVE PLANT 2 EVENT
      //
      // Current notification:
      // created_at = null
      //
      // Notification ID == Ideal Event ID
      // ============================================================

      const currentNotifications = allNotifications.filter((notification) => {
        const machineMatch = String(notification.machine_no || "").match(/\d+/);

        const notificationMachineNo = machineMatch
          ? parseInt(machineMatch[0], 10)
          : null;

        const notificationPlant = String(
          notification.plant_location || notification.plant || "",
        )
          .trim()
          .toLowerCase();

        const notificationMode = String(
          notification.ideal_mode || "",
        ).toUpperCase();

        const notificationStatus = String(
          notification.report_status || notification.status || "",
        ).toUpperCase();

        const isCurrentActive =
          notification.idle_ended_at === null ||
          notification.idle_ended_at === "";

        return (
          notificationMachineNo === targetMachineNo &&
          notificationPlant === "plant 2" &&
          notificationMode === currentMode &&
          (notificationStatus === "PENDING" || notificationStatus === "") &&
          isCurrentActive
        );
      });

      console.log(
        "🎯 PLANT 2 CURRENT ACTIVE NOTIFICATION:",
        currentNotifications,
      );

      // ============================================================
      // 5. CURRENT EVENT MUST EXIST
      // ============================================================

      if (currentNotifications.length === 0) {
        throw new Error(
          "Current idle/offline event is not ready yet. " +
            "Please wait until the machine remains idle/offline " +
            "for at least 3 minutes.",
        );
      }

      // ============================================================
      // CURRENT EVENT SELECTION
      //
      // Same machine ke old leftover open notifications ho sakte hain.
      // Dashboard always LATEST physical Ideal event choose karega.
      // Old events Notification / IdleCase page ke liye rahenge.
      // ============================================================

      if (currentNotifications.length === 0) {
        throw new Error(
          "Current idle/offline event is not ready yet. " +
            "Please wait until the machine remains idle/offline " +
            "for at least 3 minutes.",
        );
      }

      const sortedCurrentNotifications = [...currentNotifications].sort(
        (a, b) => {
          // Ideal start time is the safest current-event indicator
          const timeA = a.idle_started_at
            ? new Date(a.idle_started_at).getTime()
            : 0;

          const timeB = b.idle_started_at
            ? new Date(b.idle_started_at).getTime()
            : 0;

          // Latest start time first
          if (timeB !== timeA) {
            return timeB - timeA;
          }

          // Fallback: latest ID first
          return Number(b.id || 0) - Number(a.id || 0);
        },
      );

      const currentNotification = sortedCurrentNotifications[0];

      console.log(
        "🎯 PLANT 2 SELECTED CURRENT NOTIFICATION:",
        currentNotification,
      );

      if (currentNotifications.length > 1) {
        console.warn(
          "⚠️ Plant 2 old active-looking notifications ignored:",
          currentNotifications.filter((n) => n.id !== currentNotification.id),
        );
      }

      // ============================================================
      // Notification ID == Ideal Event ID
      // ============================================================

      const eventId = currentNotification.id;

      console.log(
        "✅ PLANT 2 CURRENT IDEAL EVENT:",
        eventId,
        currentNotification,
      );

      // ============================================================
      // 6. OPERATOR + TOOL AUTO FILL
      // ============================================================

      let operatorName = "Auto Operator";

      let toolName = "Unknown Tool";

      try {
        const autoResponse = await fetch(
          `${API_BASE}/api/machines/${selectedMachine.machine_no}/auto-fill/?plant=2`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const autoData = await autoResponse.json();

        if (autoData.success) {
          operatorName = autoData.operator_name || "Auto Operator";

          toolName = autoData.tool_id || "Unknown Tool";
        }
      } catch (autoError) {
        console.warn("⚠️ Auto-fill failed:", autoError);
      }

      // ============================================================
      // 7. PAYLOAD
      // ============================================================

      const payload = {
        plant_no: 2,

        machine_no: selectedMachine.machine_no,

        operator_name: operatorName,

        tool_name: toolName,

        reason_category: finalCategory,

        specific_reason: idleSubReason,

        remark: finalRemarks,

        // SAME ID
        notification_id: eventId,

        ideal_mode: currentMode,

        submission_source: "PLANT_DASHBOARD",
      };

      console.log("📤 PLANT 2 CURRENT IDLE REASON SUBMIT:", eventId, payload);

      // ============================================================
      // 8. CORRECT IDEAL EVENT API
      // ============================================================

      const response = await fetch(
        `${API_BASE}/api/ideal-reports/${eventId}/submit/`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      console.log("📥 PLANT 2 IDEAL REASON RESPONSE:", response.status, data);

      if (response.status === 401) {
        throw new Error("Session expired. Please login again.");
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            data.message ||
            data.detail ||
            `Reason submission failed (HTTP ${response.status})`,
        );
      }

      // ============================================================
      // 9. SUCCESS
      // ============================================================

      console.log("✅ PLANT 2 IDLE REASON SUBMITTED:", data);

      setReasonLoggedStates((prev) => ({
        ...prev,

        [selectedMachine.machine_no]:
          currentMode === "OFFLINE" ? "OFFLINE" : "IDLE",
      }));

      setIdleCategory("");
      setCustomCategory("");
      setIdleSubReason("");
      setIdleRemarks("");

      window.dispatchEvent(new Event("notificationCountRefresh"));

      // alert(
      //   "Idle reason submitted successfully."
      // );
    } catch (err) {
      console.error("❌ Plant 2 reason submit error:", err);

      alert(`Reason could not be saved: ${err.message}`);
    } finally {
      setIsSubmittingReason(false);
    }
  };

  const eventIcons = {
    ON: "🟢",
    OFF: "🔴",
    SHUT_HEIGHT_CHANGE: "🔧",
    TOOL_CHANGE: "⚙️",
    SHIFT_START: "🏁",
    SHIFT_END: "🏁",
    LUNCH_START: "🍽️",
    LUNCH_END: "✅",
    HOUR_SUMMARY: "📊",
    IDEAL_ONLINE: "🟠",
    IDEAL_OFFLINE: "⚫",
  };

  const totalMachines = machines.length;
  const onMachines = machines.filter((m) => m.machine_on).length;
  const runningMachines = machines.filter((m) => m.is_producing).length;
  const idleMachines = onMachines - runningMachines;
  const offlineMachines = totalMachines - onMachines;
  const sortedMachines = [...machines].sort(
    (a, b) => a.machine_no - b.machine_no,
  );
  const isCurrentlyLunch = checkLunchTime();

  if (loading && machines.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#020617",
          color: "#10b981",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        <div
          className="loader"
          style={{
            marginBottom: "20px",
            border: "4px solid #1e293b",
            borderTop: "4px solid #10b981",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            animation: "spin 1s linear infinite",
          }}
        ></div>
        Loading Plant Dashboard...
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #1e293b 0%, #020617 100%)",
        padding: "20px",
        color: "#f8fafc",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        @keyframes hardPulse { 0%, 100% { opacity: 1; background-color: #9a3412; } 50% { opacity: 0.9; background-color: #7c2d12; box-shadow: 0 0 20px rgba(249, 115, 22, 0.6); } }
        @keyframes offlinePulse { 0%, 100% { background-color: rgba(71, 85, 105, 0.1); border-color: rgba(71, 85, 105, 0.3); } 50% { background-color: rgba(71, 85, 105, 0.3); box-shadow: 0 0 15px rgba(71, 85, 105, 0.4); border-color: rgba(100, 116, 139, 0.6); } }
        @keyframes alertTextPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.02); } }
        @keyframes lunchBannerPulse { 0%, 100% { background-color: rgba(59, 130, 246, 0.15); border-color: rgba(96, 165, 250, 0.4); } 50% { background-color: rgba(59, 130, 246, 0.3); border-color: rgba(96, 165, 250, 0.8); box-shadow: 0 0 15px rgba(59, 130, 246, 0.3); } }
        @keyframes slideDownDropdown { from { opacity: 0; transform: scaleY(0.95); } to { opacity: 1; transform: scaleY(1); } }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 12px 24px rgba(0,0,0,0.5) !important; }
        ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #0f172a; } ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        .timeline-container { position: relative; padding: 20px 0; } .timeline-line { position: absolute; left: 24px; top: 0; bottom: 0; width: 2px; background: rgba(255,255,255,0.1); }
        .timeline-item { position: relative; padding-left: 60px; margin-bottom: 30px; } .timeline-icon { position: absolute; left: 12px; top: 0; width: 26px; height: 26px; border-radius: 50%; background: #1e293b; border: 2px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 12px; z-index: 2; }
        .timeline-content { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; }
      `}</style>

      {/* HEADER SECTION */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          marginBottom: "30px",
          padding: "24px",
          background: "rgba(30, 41, 59, 0.7)",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.05)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <div
              style={{
                width: "12px",
                height: "40px",
                background: "#10b981",
                borderRadius: "6px",
                boxShadow: "0 0 10px rgba(16,185,129,0.5)",
              }}
            ></div>
            <h1
              style={{
                margin: 0,
                fontSize: "32px",
                color: "#f8fafc",
                fontWeight: "800",
              }}
            >
              Plant 2 <span style={{ color: "#10b981" }}>Live Status</span>
            </h1>
          </div>
          <div
            style={{
              display: "flex",
              gap: "12px",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            <div
              style={{
                padding: "8px 16px",
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                borderRadius: "10px",
                color: "#34d399",
              }}
            >
              Shift: {currentShift}
            </div>
            <div
              style={{
                padding: "8px 16px",
                background: "rgba(15, 23, 42, 0.6)",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              Hour: {currentHour.toString().padStart(2, "0")}:xx
            </div>
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "16px",
          }}
        >
          {[
            {
              label: "ON MACHINES",
              value: onMachines,
              color: "#34d399",
              bg: "rgba(16, 185, 129, 0.05)",
            },
            {
              label: "RUNNING",
              value: runningMachines,
              color: "#10b981",
              bg: "rgba(16, 185, 129, 0.1)",
            },
            {
              label: "IDLE",
              value: idleMachines,
              color: "#f59e0b",
              bg: "rgba(245, 158, 11, 0.1)",
            },
            {
              label: "OFFLINE",
              value: offlineMachines,
              color: "#64748b",
              bg: "rgba(100, 116, 139, 0.1)",
            },
            {
              label: "TOTAL",
              value: totalMachines,
              color: "#3b82f6",
              bg: "rgba(59, 130, 246, 0.1)",
            },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                padding: "16px 10px",
                background: stat.bg,
                borderRadius: "16px",
                border: `1px solid ${stat.color}30`,
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: "900",
                  color: stat.color,
                  lineHeight: "1",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  marginTop: "8px",
                  fontWeight: "700",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MACHINES GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "24px",
        }}
      >
        {sortedMachines.map((machine) => {
          const liveIdle = liveIdleSeconds[machine.machine_no] || 0;
          const statusColor = getMachineColor(machine);
          const isOffline = !machine.machine_on;
          const isRecentlyOffline =
            isOffline &&
            machine.offline_duration_minutes !== null &&
            machine.offline_duration_minutes <= 15;
          const showIdlePulse = !isCurrentlyLunch && !machine.is_producing;
          const hasLoggedReason = reasonLoggedStates[machine.machine_no];

          return (
            <div
              key={machine.machine_no}
              className="card-hover"
              onClick={() => handleMachineClick(machine)}
              style={{
                position: "relative",
                background: "linear-gradient(145deg, #1e293b, #0f172a)",
                border: `1px solid rgba(255,255,255,0.05)`,
                borderTop: `4px solid ${statusColor}`,
                borderRadius: "20px",
                padding: "20px",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: `0 8px 20px rgba(0,0,0,0.4), ${getMachineGlow(
                  machine,
                )}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: "900",
                    color: "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  Machine {machine.machine_no}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    padding: "6px 12px",
                    background: `${statusColor}20`,
                    color: statusColor,
                    borderRadius: "20px",
                    fontWeight: "800",
                    border: `1px solid ${statusColor}40`,
                  }}
                >
                  {getMachineStatus(machine)}
                </div>
              </div>

              {isRecentlyOffline && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    color: "#94a3b8",
                    fontWeight: "700",
                    letterSpacing: "2px",
                    fontSize: "11px",
                    marginBottom: "16px",
                    textTransform: "uppercase",
                  }}
                >
                  <span
                    style={{
                      flex: 1,
                      height: "1px",
                      borderTop: "1px dashed #475569",
                    }}
                  ></span>
                  Recently Offline
                  <span
                    style={{
                      flex: 1,
                      height: "1px",
                      borderTop: "1px dashed #475569",
                    }}
                  ></span>
                </div>
              )}

              {isCurrentlyLunch && !machine.is_producing && (
                <div
                  style={{
                    background: "rgba(59, 130, 246, 0.15)",
                    border: "1px solid rgba(96, 165, 250, 0.4)",
                    color: "#93c5fd",
                    padding: "10px",
                    borderRadius: "12px",
                    textAlign: "center",
                    fontWeight: "800",
                    letterSpacing: "2px",
                    marginBottom: "16px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    textTransform: "uppercase",
                    animation: "lunchBannerPulse 3s infinite",
                    boxShadow: "inset 0 0 10px rgba(59, 130, 246, 0.1)",
                  }}
                >
                  <span style={{ fontSize: "20px" }}>🍽️</span>{" "}
                  <span>LUNCH TIME</span>
                </div>
              )}

              <div
                style={{
                  textAlign: "center",
                  padding: "24px 10px",
                  background: "rgba(2, 6, 23, 0.4)",
                  borderRadius: "16px",
                  marginBottom: "16px",
                  border: "1px solid rgba(255,255,255,0.02)",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    fontWeight: "700",
                    marginBottom: "10px",
                  }}
                >
                  Current Hour Production
                </div>
                <div
                  style={{
                    fontSize: "56px",
                    fontWeight: "900",
                    color: statusColor,
                    lineHeight: "1",
                    textShadow: `0 0 20px ${statusColor}40`,
                  }}
                >
                  {machine.current_hour_count || 0}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    padding: "12px",
                    background: "rgba(16, 185, 129, 0.1)",
                    borderRadius: "12px",
                  }}
                >
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                    Machine ON at
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#34d399",
                    }}
                  >
                    {machine.on_since || "--:--"}
                  </div>
                </div>
                <div
                  style={{
                    padding: "12px",
                    background: "rgba(59, 130, 246, 0.1)",
                    borderRadius: "12px",
                  }}
                >
                  <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                    Start Production at
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "#60a5fa",
                    }}
                  >
                    {machine.first_count_at || "--:--"}
                  </div>
                  <div
                    style={{ fontSize: "11px", color: "#60a5fa", opacity: 0.8 }}
                  >
                    Idle: {machine.time_to_first_count || 0} min
                  </div>
                </div>
              </div>

              {showIdlePulse && liveIdle > 0 && (
                <div
                  style={{
                    padding: "16px",
                    borderRadius: "12px",
                    marginBottom: "16px",
                    textAlign: "center",
                    animation: isOffline
                      ? "offlinePulse 2s infinite"
                      : "hardPulse 2s infinite",
                    border: isOffline
                      ? "1px solid rgba(71, 85, 105, 0.4)"
                      : "1px solid rgba(249, 115, 22, 0.3)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      color: isOffline ? "#94a3b8" : "#fed7aa",
                      fontWeight: "700",
                      marginBottom: "8px",
                    }}
                  >
                    {isOffline ? "⚠️ OFFLINE TIMER" : "⚠️ LIVE IDLE"}
                  </div>
                  <div
                    style={{
                      fontSize: "32px",
                      fontWeight: "900",
                      color: "#fff",
                      lineHeight: "1",
                    }}
                  >
                    {formatLiveIdle(liveIdle)}
                  </div>
                  {isOffline && (
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#cbd5e1",
                        marginTop: "8px",
                        fontWeight: "600",
                      }}
                    >
                      Offline Since:{" "}
                      <span style={{ color: "#fff" }}>
                        {machine.offline_since || "Shift Start"}
                      </span>
                    </div>
                  )}

                  {!hasLoggedReason ? (
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "6px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        letterSpacing: "0.5px",
                        color: isOffline ? "#f8fafc" : "#ef4444",
                        background: isOffline
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(239, 68, 68, 0.15)",
                        border: isOffline
                          ? "1px solid rgba(255,255,255,0.2)"
                          : "1px solid rgba(239, 68, 68, 0.3)",
                        animation: "alertTextPulse 1.5s infinite",
                      }}
                    >
                      ⚠️ Plz fill the information
                    </div>
                  ) : (
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "6px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        letterSpacing: "0.5px",
                        color: "#f59e0b",
                        background: "rgba(245, 158, 11, 0.1)",
                        border: "1px solid rgba(245, 158, 11, 0.3)",
                      }}
                    >
                      ✅ Reason Submitted
                    </div>
                  )}
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    padding: "12px",
                    background: "rgba(15, 23, 42, 0.5)",
                    borderRadius: "12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#94a3b8",
                      marginBottom: "4px",
                    }}
                  >
                    {getVisibleIdealLabel(machine)}
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "800",
                      color: "#fbbf24",
                    }}
                  >
                    {getVisibleIdealDisplay(machine, liveIdle)}
                  </div>
                </div>
                <div
                  style={{
                    padding: "12px",
                    background: "rgba(15, 23, 42, 0.5)",
                    borderRadius: "12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#94a3b8",
                      marginBottom: "4px",
                    }}
                  >
                    Shut Height
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "800",
                      color: "#f8fafc",
                    }}
                  >
                    {formatShutHeightDisplay(machine.shut_height)}
                  </div>
                </div>
                <div
                  style={{
                    padding: "12px",
                    background: "rgba(15, 23, 42, 0.5)",
                    borderRadius: "12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#94a3b8",
                      marginBottom: "4px",
                    }}
                  >
                    Last Hour
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "800",
                      color: "#94a3b8",
                    }}
                  >
                    {machine.last_hour_count || 0}
                  </div>
                </div>
                <div
                  style={{
                    padding: "12px",
                    background: "rgba(15, 23, 42, 0.5)",
                    borderRadius: "12px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      color: "#94a3b8",
                      marginBottom: "4px",
                    }}
                  >
                    Cumulative
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: "800",
                      color: "#10b981",
                    }}
                  >
                    {machine.cumulative_count || 0}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL POPUP */}
      {selectedMachine && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(2, 6, 23, 0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#0f172a",
              borderRadius: "24px",
              padding: 0,
              maxWidth: "800px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
              border: `1px solid rgba(255,255,255,0.1)`,
            }}
          >
            <div
              style={{
                padding: "30px",
                background: `linear-gradient(135deg, ${getMachineColor(
                  selectedMachine,
                )} 0%, #0f172a 150%)`,
                borderTopLeftRadius: "24px",
                borderTopRightRadius: "24px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "20px" }}
                >
                  <div
                    style={{
                      fontSize: "32px",
                      fontWeight: "900",
                      color: "white",
                    }}
                  >
                    Machine {selectedMachine.machine_no}
                  </div>
                  {!showHistoryView && (
                    <div
                      style={{
                        padding: "8px 20px",
                        backgroundColor: "rgba(0,0,0,0.3)",
                        color: "white",
                        borderRadius: "30px",
                        fontWeight: "800",
                      }}
                    >
                      {getMachineStatus(selectedMachine)}
                    </div>
                  )}
                  <div
                    title={
                      showHistoryView
                        ? "Back to Dashboard"
                        : "View Timeline History"
                    }
                    style={{
                      position: "relative",
                      cursor: "pointer",
                      padding: "10px 15px",
                      backgroundColor: showHistoryView
                        ? "#10b981"
                        : "rgba(0,0,0,0.3)",
                      color: "white",
                      borderRadius: "30px",
                      fontWeight: "700",
                      border: "1px solid rgba(255,255,255,0.1)",
                      transition: "all 0.2s",
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                    }}
                    onClick={toggleHistoryView}
                  >
                    <span style={{ fontSize: "18px" }}>
                      {showHistoryView ? "🔙" : "📅"}
                    </span>
                    <span>{showHistoryView ? "Live View" : "History"}</span>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "44px",
                    height: "44px",
                    fontSize: "24px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {showHistoryView ? (
              <div style={{ padding: "30px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                    gap: "15px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <h2 style={{ margin: 0, color: "#f8fafc" }}>
                      Shift Wise History
                    </h2>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        marginTop: "6px",
                      }}
                    >
                      Lunch: 12:15 PM - 12:45 PM | Shift A End: 08:00 PM
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <select
                      value={historyShift}
                      onChange={(e) => {
                        setHistoryShift(e.target.value);
                        fetchMachineHistory(
                          selectedMachine.machine_no,
                          historyDate,
                          e.target.value,
                        );
                      }}
                      style={{
                        padding: "10px 15px",
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.2)",
                        background: "#1e293b",
                        color: "white",
                        fontFamily: "inherit",
                        fontWeight: "bold",
                      }}
                    >
                      <option value="A">Shift A</option>
                      <option value="B">Shift B</option>
                      <option value="ALL">Full Day</option>
                    </select>
                    <input
                      type="date"
                      value={historyDate}
                      onChange={(e) => {
                        setHistoryDate(e.target.value);
                        fetchMachineHistory(
                          selectedMachine.machine_no,
                          e.target.value,
                          historyShift,
                        );
                      }}
                      style={{
                        padding: "10px 15px",
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.2)",
                        background: "#1e293b",
                        color: "white",
                        fontFamily: "inherit",
                        fontWeight: "bold",
                      }}
                    />
                  </div>
                </div>
                {historyError ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "50px",
                      background: "rgba(239, 68, 68, 0.1)",
                      borderRadius: "16px",
                      border: "1px dashed rgba(239, 68, 68, 0.3)",
                    }}
                  >
                    <div style={{ fontSize: "40px", marginBottom: "10px" }}>
                      ⚠️
                    </div>
                    <h3 style={{ color: "#ef4444", margin: 0 }}>
                      API Connection Error
                    </h3>
                    <p style={{ color: "#fca5a5", fontSize: "14px" }}>
                      {historyError}
                    </p>
                  </div>
                ) : historyLoading ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "50px",
                      color: "#94a3b8",
                    }}
                  >
                    <div
                      className="loader"
                      style={{
                        margin: "0 auto 20px",
                        border: "3px solid rgba(255,255,255,0.1)",
                        borderTop: "3px solid #10b981",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        animation: "spin 1s linear infinite",
                      }}
                    ></div>
                    Loading Shift History...
                  </div>
                ) : historyData.length === 0 &&
                  historyHourlySummary.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "50px",
                      background: "rgba(255,255,255,0.02)",
                      borderRadius: "16px",
                      border: "1px dashed rgba(255,255,255,0.05)",
                    }}
                  >
                    <div style={{ fontSize: "40px", marginBottom: "10px" }}>
                      📭
                    </div>
                    <h3 style={{ color: "#94a3b8", margin: 0 }}>
                      No Events Found
                    </h3>
                    <p style={{ color: "#64748b", fontSize: "14px" }}>
                      There are no recorded events for this machine on{" "}
                      {historyDate}
                    </p>
                  </div>
                ) : (
                  <>
                    {historySummary && (
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(145px, 1fr))",
                          gap: "12px",
                          marginBottom: "20px",
                        }}
                      >
                        <div
                          style={{
                            padding: "14px",
                            background: "rgba(16,185,129,0.08)",
                            border: "1px solid rgba(16,185,129,0.2)",
                            borderRadius: "12px",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "10px",
                              color: "#94a3b8",
                              textTransform: "uppercase",
                            }}
                          >
                            Production
                          </div>
                          <div
                            style={{
                              fontSize: "24px",
                              color: "#10b981",
                              fontWeight: "900",
                            }}
                          >
                            {historySummary.production?.total_count || 0}
                          </div>
                        </div>
                        <div
                          style={{
                            padding: "14px",
                            background: "rgba(245,158,11,0.08)",
                            border: "1px solid rgba(245,158,11,0.2)",
                            borderRadius: "12px",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "10px",
                              color: "#94a3b8",
                              textTransform: "uppercase",
                            }}
                          >
                            Online Ideal
                          </div>
                          <div
                            style={{
                              fontSize: "16px",
                              color: "#f59e0b",
                              fontWeight: "900",
                            }}
                          >
                            {historySummary.ideal?.online_ideal_display ||
                              "0 sec"}
                          </div>
                        </div>
                        <div
                          style={{
                            padding: "14px",
                            background: "rgba(100,116,139,0.12)",
                            border: "1px solid rgba(100,116,139,0.25)",
                            borderRadius: "12px",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "10px",
                              color: "#94a3b8",
                              textTransform: "uppercase",
                            }}
                          >
                            Offline Ideal
                          </div>
                          <div
                            style={{
                              fontSize: "16px",
                              color: "#cbd5e1",
                              fontWeight: "900",
                            }}
                          >
                            {historySummary.ideal?.offline_ideal_display ||
                              "0 sec"}
                          </div>
                        </div>
                        <div
                          style={{
                            padding: "14px",
                            background: "rgba(59,130,246,0.08)",
                            border: "1px solid rgba(59,130,246,0.2)",
                            borderRadius: "12px",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "10px",
                              color: "#94a3b8",
                              textTransform: "uppercase",
                            }}
                          >
                            Total Ideal
                          </div>
                          <div
                            style={{
                              fontSize: "16px",
                              color: "#60a5fa",
                              fontWeight: "900",
                            }}
                          >
                            {historySummary.ideal?.total_ideal_display ||
                              "0 sec"}
                          </div>
                        </div>
                      </div>
                    )}

                    {historyMachineMeta && (
                      <div
                        style={{
                          padding: "14px 16px",
                          background: "rgba(2,6,23,0.35)",
                          border: "1px solid rgba(255,255,255,0.05)",
                          borderRadius: "12px",
                          marginBottom: "20px",
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(150px, 1fr))",
                          gap: "10px",
                        }}
                      >
                        <div>
                          <span style={{ color: "#64748b", fontSize: "11px" }}>
                            Customer
                          </span>
                          <div style={{ fontWeight: "800", color: "#fff" }}>
                            {historyMachineMeta.customer_name ||
                              historyMachineMeta.customer ||
                              "N/A"}
                          </div>
                        </div>
                        <div>
                          <span style={{ color: "#64748b", fontSize: "11px" }}>
                            Model
                          </span>
                          <div style={{ fontWeight: "800", color: "#fff" }}>
                            {historyMachineMeta.model_name ||
                              historyMachineMeta.model ||
                              "N/A"}
                          </div>
                        </div>
                        <div>
                          <span style={{ color: "#64748b", fontSize: "11px" }}>
                            Part Name
                          </span>
                          <div style={{ fontWeight: "800", color: "#fff" }}>
                            {historyMachineMeta.part_name || "N/A"}
                          </div>
                        </div>
                        <div>
                          <span style={{ color: "#64748b", fontSize: "11px" }}>
                            Part Number
                          </span>
                          <div style={{ fontWeight: "800", color: "#fff" }}>
                            {historyMachineMeta.part_number || "N/A"}
                          </div>
                        </div>
                        <div>
                          <span style={{ color: "#64748b", fontSize: "11px" }}>
                            Tool Name
                          </span>
                          <div style={{ fontWeight: "800", color: "#fff" }}>
                            {historyMachineMeta.tool_name || "N/A"}
                          </div>
                        </div>
                        <div>
                          <span style={{ color: "#64748b", fontSize: "11px" }}>
                            Tool ID
                          </span>
                          <div
                            style={{
                              fontWeight: "800",
                              color: "#10b981",
                              wordBreak: "break-all",
                            }}
                          >
                            {historyMachineMeta.tool_id ||
                              historyMachineMeta.epc ||
                              "N/A"}
                          </div>
                        </div>
                        <div>
                          <span style={{ color: "#64748b", fontSize: "11px" }}>
                            Latest Shut Height
                          </span>
                          <div style={{ fontWeight: "800", color: "#fbbf24" }}>
                            {historyMachineMeta.shut_height || "N/A"}
                          </div>
                        </div>
                      </div>
                    )}

                    <h3 style={{ margin: "0 0 14px 0", color: "#f8fafc" }}>
                      Hourly Shift Story
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "14px",
                        marginBottom: "30px",
                      }}
                    >
                      {historyHourlySummary.map((hour, index) => (
                        <div
                          key={index}
                          style={{
                            background: "rgba(15,23,42,0.72)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: "16px",
                            padding: "16px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: "10px",
                              flexWrap: "wrap",
                              marginBottom: "12px",
                            }}
                          >
                            <div
                              style={{ fontWeight: "900", color: "#f8fafc" }}
                            >
                              🕒 {hour.bucket_start_display} -{" "}
                              {hour.bucket_end_display}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                gap: "8px",
                                flexWrap: "wrap",
                                fontSize: "12px",
                                fontWeight: "800",
                              }}
                            >
                              <span
                                style={{
                                  color: "#10b981",
                                  background: "rgba(16,185,129,0.1)",
                                  padding: "5px 9px",
                                  borderRadius: "999px",
                                }}
                              >
                                Count: {hour.count || 0}
                              </span>
                              <span
                                style={{
                                  color: "#f59e0b",
                                  background: "rgba(245,158,11,0.1)",
                                  padding: "5px 9px",
                                  borderRadius: "999px",
                                }}
                              >
                                Online: {hour.online_ideal_display || "0 sec"}
                              </span>
                              <span
                                style={{
                                  color: "#cbd5e1",
                                  background: "rgba(100,116,139,0.18)",
                                  padding: "5px 9px",
                                  borderRadius: "999px",
                                }}
                              >
                                Offline: {hour.offline_ideal_display || "0 sec"}
                              </span>
                            </div>
                          </div>

                          {(hour.ideal_segments || []).length > 0 && (
                            <div style={{ marginTop: "10px" }}>
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: "#94a3b8",
                                  fontWeight: "800",
                                  marginBottom: "6px",
                                  textTransform: "uppercase",
                                }}
                              >
                                Ideal Segments
                              </div>
                              {(hour.ideal_segments || []).map((seg, i) => (
                                <div
                                  key={i}
                                  style={{
                                    padding: "9px 10px",
                                    background:
                                      seg.mode === "OFFLINE"
                                        ? "rgba(100,116,139,0.12)"
                                        : "rgba(245,158,11,0.08)",
                                    borderLeft: `3px solid ${
                                      seg.mode === "OFFLINE"
                                        ? "#64748b"
                                        : "#f59e0b"
                                    }`,
                                    borderRadius: "8px",
                                    marginBottom: "6px",
                                  }}
                                >
                                  <div
                                    style={{
                                      color: "#e2e8f0",
                                      fontWeight: "800",
                                      fontSize: "13px",
                                    }}
                                  >
                                    {seg.mode} Ideal: {seg.start_time} →{" "}
                                    {seg.end_time} (
                                    {seg.bucket_overlap_display ||
                                      seg.duration_display}
                                    )
                                  </div>
                                  <div
                                    style={{
                                      color: "#94a3b8",
                                      fontSize: "12px",
                                      marginTop: "3px",
                                    }}
                                  >
                                    Reason: {seg.reason || "Uncategorized"} /{" "}
                                    {seg.specific_reason ||
                                      "Reason Not Provided"}{" "}
                                    {seg.remark ? ` | ${seg.remark}` : ""}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {(hour.on_off_events || []).length > 0 && (
                            <div style={{ marginTop: "10px" }}>
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: "#94a3b8",
                                  fontWeight: "800",
                                  marginBottom: "6px",
                                  textTransform: "uppercase",
                                }}
                              >
                                Machine ON/OFF
                              </div>
                              {(hour.on_off_events || []).map((ev, i) => (
                                <div
                                  key={i}
                                  style={{
                                    color: "#cbd5e1",
                                    fontSize: "13px",
                                    marginBottom: "4px",
                                  }}
                                >
                                  {eventIcons[ev.type] || "📌"} {ev.time} -{" "}
                                  {ev.title}: {ev.details}
                                </div>
                              ))}
                            </div>
                          )}

                          {((hour.tool_changes || []).length > 0 ||
                            (hour.shut_height_changes || []).length > 0) && (
                            <div style={{ marginTop: "10px" }}>
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: "#94a3b8",
                                  fontWeight: "800",
                                  marginBottom: "6px",
                                  textTransform: "uppercase",
                                }}
                              >
                                Tool / Shut Height Changes
                              </div>
                              {(hour.tool_changes || []).map((ev, i) => (
                                <div
                                  key={`tool-${i}`}
                                  style={{
                                    color: "#93c5fd",
                                    fontSize: "13px",
                                    marginBottom: "6px",
                                  }}
                                >
                                  ⚙️ {ev.time} - {ev.details}
                                  {(ev.part_name ||
                                    ev.part_number ||
                                    ev.model_name ||
                                    ev.tool_name) && (
                                    <div
                                      style={{
                                        marginTop: "3px",
                                        color: "#cbd5e1",
                                        fontSize: "12px",
                                      }}
                                    >
                                      {ev.customer_name || ev.customer || "N/A"}{" "}
                                      | {ev.model_name || ev.model || "N/A"} |{" "}
                                      {ev.part_name || "N/A"} | Part No:{" "}
                                      {ev.part_number || "N/A"} | Tool:{" "}
                                      {ev.tool_name || "N/A"}
                                    </div>
                                  )}
                                </div>
                              ))}
                              {(hour.shut_height_changes || []).map((ev, i) => (
                                <div
                                  key={`sh-${i}`}
                                  style={{
                                    color: "#93c5fd",
                                    fontSize: "13px",
                                    marginBottom: "6px",
                                  }}
                                >
                                  🔧 {ev.time} - {ev.details}
                                  {(ev.part_name ||
                                    ev.part_number ||
                                    ev.model_name ||
                                    ev.tool_name) && (
                                    <div
                                      style={{
                                        marginTop: "3px",
                                        color: "#cbd5e1",
                                        fontSize: "12px",
                                      }}
                                    >
                                      {ev.customer_name || ev.customer || "N/A"}{" "}
                                      | {ev.model_name || ev.model || "N/A"} |{" "}
                                      {ev.part_name || "N/A"} | Part No:{" "}
                                      {ev.part_number || "N/A"} | Tool:{" "}
                                      {ev.tool_name || "N/A"}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <h3 style={{ margin: "0 0 14px 0", color: "#f8fafc" }}>
                      Full Timeline
                    </h3>
                    <div className="timeline-container">
                      <div className="timeline-line"></div>
                      {historyData.map((event, index) => {
                        const isOff =
                          event.type === "OFF" ||
                          event.type === "IDEAL_OFFLINE";
                        const isChange =
                          String(event.type).includes("CHANGE") ||
                          event.type === "TOOL_CHANGE" ||
                          event.type === "SHUT_HEIGHT_CHANGE";
                        const isIdeal = String(event.type).startsWith("IDEAL");
                        const color = isOff
                          ? "#64748b"
                          : isChange
                          ? "#3b82f6"
                          : isIdeal
                          ? "#f59e0b"
                          : "#10b981";
                        return (
                          <div key={index} className="timeline-item">
                            <div
                              className="timeline-icon"
                              style={{ borderColor: color }}
                            >
                              {eventIcons[event.type] || "📌"}
                            </div>
                            <div
                              className="timeline-content"
                              style={{ borderLeft: `3px solid ${color}` }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  marginBottom: "8px",
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    color: color,
                                    fontSize: "16px",
                                  }}
                                >
                                  {event.title || event.type.replace(/_/g, " ")}
                                </span>
                                <span
                                  style={{
                                    color: "#94a3b8",
                                    fontSize: "14px",
                                    background: "rgba(0,0,0,0.3)",
                                    padding: "4px 10px",
                                    borderRadius: "20px",
                                  }}
                                >
                                  {event.time}
                                </span>
                              </div>
                              <div
                                style={{
                                  color: "#e2e8f0",
                                  fontSize: "14px",
                                  lineHeight: "1.5",
                                }}
                              >
                                {event.details ||
                                  (isOff
                                    ? "Machine detected as Offline/No Signal"
                                    : "Machine Power/Signal Restored")}
                              </div>
                              {(event.part_name ||
                                event.part_number ||
                                event.model_name ||
                                event.tool_name) && (
                                <div
                                  style={{
                                    marginTop: "8px",
                                    padding: "8px 10px",
                                    borderRadius: "8px",
                                    background: "rgba(59,130,246,0.08)",
                                    color: "#cbd5e1",
                                    fontSize: "12px",
                                  }}
                                >
                                  <b style={{ color: "#93c5fd" }}>TID Map:</b>{" "}
                                  {event.customer_name ||
                                    event.customer ||
                                    "N/A"}{" "}
                                  | {event.model_name || event.model || "N/A"} |{" "}
                                  {event.part_name || "N/A"} | Part No:{" "}
                                  {event.part_number || "N/A"} | Tool:{" "}
                                  {event.tool_name || "N/A"}
                                </div>
                              )}
                              <div
                                style={{
                                  fontSize: "11px",
                                  color: "#64748b",
                                  marginTop: "10px",
                                  display: "flex",
                                  gap: "15px",
                                  flexWrap: "wrap",
                                }}
                              >
                                <span>Shift: {event.shift}</span>
                                <span>
                                  System Time:{" "}
                                  {event.system_time || event.raw_time}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div
                style={{
                  padding: "30px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                {!selectedMachine.is_producing && (
                  <div
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(245, 158, 11, 0.08), rgba(2, 6, 23, 0.8))",
                      padding: "24px",
                      borderRadius: "20px",
                      border: "1px solid rgba(245, 158, 11, 0.2)",
                      boxShadow: "inset 0 0 30px rgba(245, 158, 11, 0.05)",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 24px 0",
                        color: "#fbbf24",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        fontSize: "20px",
                      }}
                    >
                      <div
                        style={{
                          background: "rgba(245, 158, 11, 0.2)",
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 0 15px rgba(245, 158, 11, 0.3)",
                        }}
                      >
                        <i
                          className="bi bi-exclamation-triangle-fill"
                          style={{ fontSize: "18px" }}
                        ></i>
                      </div>
                      Log Downtime Reason
                      <span
                        style={{
                          fontSize: "12px",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          background: selectedMachine.machine_on
                            ? "rgba(16, 185, 129, 0.2)"
                            : "rgba(239, 68, 68, 0.2)",
                          color: selectedMachine.machine_on
                            ? "#34d399"
                            : "#fca5a5",
                          border: `1px solid ${
                            selectedMachine.machine_on
                              ? "rgba(16, 185, 129, 0.4)"
                              : "rgba(239, 68, 68, 0.4)"
                          }`,
                          marginLeft: "auto",
                        }}
                      >
                        {selectedMachine.machine_on
                          ? "ONLINE (IDLE)"
                          : "OFFLINE"}
                      </span>
                    </h3>

                    {!reasonLoggedStates[selectedMachine.machine_no] ? (
                      <>
                        <div style={{ marginBottom: "16px" }}>
                          <label
                            style={{
                              fontSize: "11px",
                              color: "#fcd34d",
                              fontWeight: "800",
                              textTransform: "uppercase",
                              marginBottom: "8px",
                              display: "block",
                              letterSpacing: "1.5px",
                            }}
                          >
                            1. Select Category
                          </label>
                          <CustomDropdown
                            value={idleCategory}
                            placeholder="-- Choose Category --"
                            icon={true}
                            options={Object.keys(IDLE_REASONS)}
                            onChange={(val) => {
                              setIdleCategory(val);
                              if (val !== "Other") setCustomCategory("");
                              if (val === "Other") {
                                setIdleSubReason("Other");
                              } else {
                                setIdleSubReason("");
                              }
                              setIdleRemarks("");
                            }}
                          />
                        </div>

                        {idleCategory === "Other" && (
                          <div
                            style={{
                              marginBottom: "16px",
                              animation:
                                "slideDownDropdown 0.3s ease-out forwards",
                            }}
                          >
                            <label
                              style={{
                                fontSize: "11px",
                                color: "#10b981",
                                fontWeight: "800",
                                textTransform: "uppercase",
                                marginBottom: "8px",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                letterSpacing: "1.5px",
                              }}
                            >
                              <i className="bi bi-pencil-square"></i> Please
                              Specify Custom Category
                            </label>
                            <input
                              type="text"
                              placeholder="Type custom category name..."
                              value={customCategory}
                              onChange={(e) =>
                                setCustomCategory(e.target.value)
                              }
                              style={{
                                width: "100%",
                                padding: "14px 18px",
                                borderRadius: "12px",
                                background: "rgba(16, 185, 129, 0.05)",
                                color: "#fff",
                                border: "1px solid rgba(16, 185, 129, 0.4)",
                                boxShadow: "inset 0 2px 10px rgba(0,0,0,0.2)",
                                fontSize: "14px",
                                outline: "none",
                              }}
                            />
                          </div>
                        )}

                        {idleCategory && (
                          <div
                            style={{
                              marginBottom: "16px",
                              animation:
                                "slideDownDropdown 0.3s ease-out forwards",
                            }}
                          >
                            <label
                              style={{
                                fontSize: "11px",
                                color: "#fcd34d",
                                fontWeight: "800",
                                textTransform: "uppercase",
                                marginBottom: "8px",
                                display: "block",
                                letterSpacing: "1.5px",
                              }}
                            >
                              2. Specific Reason
                            </label>
                            <CustomDropdown
                              value={idleSubReason}
                              placeholder="-- Choose Reason --"
                              icon={false}
                              options={IDLE_REASONS[idleCategory]}
                              onChange={(val) => {
                                setIdleSubReason(val);
                                if (val !== "Other") setIdleRemarks("");
                              }}
                            />
                          </div>
                        )}

                        {idleSubReason === "Other" && (
                          <div
                            style={{
                              marginBottom: "24px",
                              animation:
                                "slideDownDropdown 0.3s ease-out forwards",
                            }}
                          >
                            <label
                              style={{
                                fontSize: "11px",
                                color: "#10b981",
                                fontWeight: "800",
                                textTransform: "uppercase",
                                marginBottom: "8px",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                letterSpacing: "1.5px",
                              }}
                            >
                              <i className="bi bi-pencil-square"></i>{" "}
                              {idleCategory === "Other"
                                ? "3. Please Specify Exact Issue"
                                : "3. Please Specify Reason"}
                            </label>
                            <textarea
                              rows="2"
                              placeholder="Type the exact issue here..."
                              value={idleRemarks}
                              onChange={(e) => setIdleRemarks(e.target.value)}
                              style={{
                                width: "100%",
                                padding: "14px 18px",
                                borderRadius: "12px",
                                background: "rgba(16, 185, 129, 0.05)",
                                color: "#fff",
                                border: "1px solid rgba(16, 185, 129, 0.4)",
                                boxShadow: "inset 0 2px 10px rgba(0,0,0,0.2)",
                                fontSize: "14px",
                                outline: "none",
                                resize: "vertical",
                              }}
                            />
                          </div>
                        )}

                        <button
                          onClick={handleReasonSubmit}
                          disabled={isSubmittingReason || !isFormValid}
                          style={{
                            width: "100%",
                            padding: "16px",
                            borderRadius: "16px",
                            marginTop: "10px",
                            background: !isFormValid
                              ? "rgba(255,255,255,0.05)"
                              : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                            color: !isFormValid ? "#475569" : "#fff",
                            border: !isFormValid
                              ? "1px dashed rgba(255,255,255,0.1)"
                              : "none",
                            fontWeight: "900",
                            fontSize: "16px",
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            cursor: !isFormValid ? "not-allowed" : "pointer",
                            transition: "all 0.3s ease",
                            boxShadow: isFormValid
                              ? "0 10px 25px rgba(245, 158, 11, 0.5)"
                              : "none",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          {isSubmittingReason ? (
                            <>
                              <div
                                className="loader"
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  border: "3px solid rgba(255,255,255,0.3)",
                                  borderTop: "3px solid #fff",
                                  borderRadius: "50%",
                                  animation: "spin 1s linear infinite",
                                }}
                              ></div>{" "}
                              Submitting...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-floppy-fill"></i> Save Reason
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "10px",
                          color: "#10b981",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        ✅ Reason has been successfully recorded for this
                        session. It will reset when the machine starts running
                        again.
                      </div>
                    )}
                  </div>
                )}

                {isCurrentlyLunch && !selectedMachine.is_producing && (
                  <div
                    style={{
                      background: "rgba(59, 130, 246, 0.15)",
                      border: "1px solid rgba(96, 165, 250, 0.4)",
                      color: "#93c5fd",
                      padding: "16px",
                      borderRadius: "12px",
                      textAlign: "center",
                      fontWeight: "800",
                      letterSpacing: "2px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                      textTransform: "uppercase",
                      animation: "lunchBannerPulse 3s infinite",
                    }}
                  >
                    <span style={{ fontSize: "24px" }}>🍽️</span>{" "}
                    <span style={{ fontSize: "18px" }}>LUNCH TIME BREAK</span>
                  </div>
                )}

                <div
                  style={{
                    backgroundColor: "#1e293b",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 16px 0",
                      color: "#10b981",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span>⏱️</span> Live Session Timings
                  </h3>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "15px",
                    }}
                  >
                    <div
                      style={{
                        padding: "16px",
                        background: "rgba(16, 185, 129, 0.1)",
                        borderRadius: "12px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                          Machine Turned ON
                        </div>
                        <div
                          style={{
                            fontSize: "20px",
                            fontWeight: "700",
                            color: "#34d399",
                          }}
                        >
                          {selectedMachine.on_since || "--:--"}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            fontSize: "20px",
                            fontWeight: "700",
                            color: "#34d399",
                          }}
                        >
                          {selectedMachine.on_duration_minutes || 0}
                        </div>
                        <div style={{ fontSize: "10px", color: "#94a3b8" }}>
                          minutes ago
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "16px",
                        background: "rgba(59, 130, 246, 0.1)",
                        borderRadius: "12px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                          First Count Received
                        </div>
                        <div
                          style={{
                            fontSize: "20px",
                            fontWeight: "700",
                            color: "#60a5fa",
                          }}
                        >
                          {selectedMachine.first_count_at || "--:--"}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            fontSize: "20px",
                            fontWeight: "700",
                            color: "#60a5fa",
                          }}
                        >
                          {selectedMachine.time_to_first_count || 0}
                        </div>
                        <div style={{ fontSize: "10px", color: "#94a3b8" }}>
                          min delay
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "16px",
                        background: "rgba(245, 158, 11, 0.1)",
                        borderRadius: "12px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                          Last Count This Hour
                        </div>
                        <div
                          style={{
                            fontSize: "20px",
                            fontWeight: "700",
                            color: "#fbbf24",
                          }}
                        >
                          {selectedMachine.last_activity || "Never"}
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div
                          style={{
                            fontSize: "16px",
                            fontWeight: "700",
                            color: "#fbbf24",
                          }}
                        >
                          {selectedMachine.current_hour_count} counts
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: "16px",
                      padding: "16px",
                      background: "rgba(2, 6, 23, 0.4)",
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ color: "#94a3b8" }}>Status</span>
                    <span
                      style={{
                        fontWeight: "bold",
                        color: selectedMachine.is_producing
                          ? "#10b981"
                          : "#f59e0b",
                      }}
                    >
                      {selectedMachine.is_producing
                        ? "✅ Currently Producing"
                        : "⚠️ Idle / Offline"}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    background: "linear-gradient(145deg, #1e293b, #0f172a)",
                    borderRadius: "20px",
                    border: `1px solid rgba(255,255,255,0.05)`,
                    marginTop: "24px",
                    boxShadow: `inset 0 4px 20px rgba(0,0,0,0.5)`,
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#94a3b8",
                      marginBottom: "8px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                    }}
                  >
                    Current Hour Production
                  </div>
                  <div
                    style={{
                      fontSize: "72px",
                      fontWeight: "900",
                      color: getMachineColor(selectedMachine),
                      textShadow: `0 0 30px ${getMachineColor(
                        selectedMachine,
                      )}40`,
                      lineHeight: "1",
                    }}
                  >
                    {selectedMachine.current_hour_count || 0}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginTop: "10px",
                    }}
                  >
                    Resets every hour at XX:00:00
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: "#1e293b",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.05)",
                    marginTop: "24px",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 16px 0",
                      color: "#3b82f6",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span>👤</span> Customer Information
                  </h3>
                  <div style={{ display: "grid", gap: "10px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        backgroundColor: "rgba(2, 6, 23, 0.4)",
                        borderRadius: "8px",
                      }}
                    >
                      <span style={{ color: "#94a3b8" }}>Customer</span>
                      <span style={{ fontWeight: "bold", color: "#fff" }}>
                        {selectedMachine.tool_customer || "N/A"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        backgroundColor: "rgba(2, 6, 23, 0.4)",
                        borderRadius: "8px",
                      }}
                    >
                      <span style={{ color: "#94a3b8" }}>Model</span>
                      <span style={{ fontWeight: "bold", color: "#fff" }}>
                        {selectedMachine.tool_model || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: "#1e293b",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.05)",
                    marginTop: "24px",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 16px 0",
                      color: "#10b981",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span>🔧</span> Tool Information
                  </h3>
                  <div style={{ display: "grid", gap: "10px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        backgroundColor: "rgba(2, 6, 23, 0.4)",
                        borderRadius: "8px",
                      }}
                    >
                      <span style={{ color: "#94a3b8" }}>Part Name</span>
                      <span style={{ fontWeight: "bold", color: "#fff" }}>
                        {selectedMachine.tool_part_name || "N/A"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        backgroundColor: "rgba(2, 6, 23, 0.4)",
                        borderRadius: "8px",
                      }}
                    >
                      <span style={{ color: "#94a3b8" }}>Tool Name</span>
                      <span style={{ fontWeight: "bold", color: "#fff" }}>
                        {selectedMachine.tool_name || "N/A"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        backgroundColor: "rgba(2, 6, 23, 0.4)",
                        borderRadius: "8px",
                      }}
                    >
                      <span style={{ color: "#94a3b8" }}>Part Number</span>
                      <span style={{ fontWeight: "bold", color: "#fff" }}>
                        {selectedMachine.tool_part_number || "N/A"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        backgroundColor: "rgba(2, 6, 23, 0.4)",
                        borderRadius: "8px",
                      }}
                    >
                      <span style={{ color: "#94a3b8" }}>Shut Height</span>
                      <span style={{ fontWeight: "bold", color: "#fff" }}>
                        {formatShutHeightDisplay(selectedMachine.shut_height)}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        backgroundColor: "rgba(2, 6, 23, 0.4)",
                        borderRadius: "8px",
                      }}
                    >
                      <span style={{ color: "#94a3b8" }}>Tool ID</span>
                      <span
                        style={{
                          fontWeight: "bold",
                          color: "#10b981",
                          wordBreak: "break-all",
                        }}
                      >
                        {selectedMachine.tool_id ||
                          selectedMachine.current_tool_id ||
                          "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "15px",
                    marginTop: "24px",
                  }}
                >
                  <div
                    style={{
                      padding: "20px",
                      background: "rgba(255,255,255,0.02)",
                      borderRadius: "16px",
                      border: "1px solid rgba(255,255,255,0.05)",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#64748b",
                        letterSpacing: "1px",
                        marginBottom: "10px",
                      }}
                    >
                      LAST HOUR
                    </div>
                    <div
                      style={{
                        fontSize: "36px",
                        fontWeight: "800",
                        color: "#f8fafc",
                      }}
                    >
                      {selectedMachine.last_hour_count || 0}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "20px",
                      background: "rgba(255,255,255,0.02)",
                      borderRadius: "16px",
                      border: "1px solid rgba(255,255,255,0.05)",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#64748b",
                        letterSpacing: "1px",
                        marginBottom: "10px",
                      }}
                    >
                      CUMULATIVE
                    </div>
                    <div
                      style={{
                        fontSize: "36px",
                        fontWeight: "800",
                        color: "#10b981",
                      }}
                    >
                      {selectedMachine.cumulative_count || 0}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "20px",
                      background: "rgba(255,255,255,0.02)",
                      borderRadius: "16px",
                      border: "1px solid rgba(255,255,255,0.05)",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#64748b",
                        letterSpacing: "1px",
                        marginBottom: "10px",
                      }}
                    >
                      {getVisibleIdealMode(selectedMachine)} IDEAL
                    </div>
                    <div
                      style={{
                        fontSize: "30px",
                        fontWeight: "800",
                        color: "#f59e0b",
                      }}
                    >
                      {getVisibleIdealDisplay(
                        selectedMachine,
                        liveIdleSeconds[selectedMachine.machine_no] || 0,
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
