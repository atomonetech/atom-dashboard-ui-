import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import {
  Factory,
  Calendar,
  Settings,
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Cpu,
  Gauge,
  Clock,
  Zap,
  Monitor,
  Filter,
  BarChart3,
  Play,
  Square,
  Power,
  Terminal,
  LineChart as LineChartIcon,
  BarChart as BarChartIcon,
  AreaChart as AreaChartIcon,
  Server,
  RefreshCw,
  Sun,
  Moon,
  Radio,
  Folder,
} from "lucide-react";

// API Base URL
const API_BASE_URL = `${
  process.env.REACT_APP_API_URL || "http://localhost:8000"
}/api`;

const monthNamesFull = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const monthNamesShort = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// ============================================
// DATE HELPER FUNCTIONS
// ============================================
const getWeeklyStartDate = (endDateStr) => {
  if (!endDateStr) return "";
  const [year, month, day] = endDateStr.split("-");
  const dateObj = new Date(year, month - 1, day);
  dateObj.setDate(dateObj.getDate() - 6);
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const formatDateNice = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTimeHelper = (totalMins) => {
  if (!totalMins || isNaN(totalMins) || totalMins === 0) return "0s";
  const totalSeconds = Math.round(totalMins * 60);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

// 12-hour format logic for 'today' filter
const getFormatAxisLabel = (dayValue, filter, selDate, selMonth) => {
  if (dayValue === undefined || dayValue === null) return "";

  if (filter === "today") {
    const hour = parseInt(dayValue, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formatHour = hour % 12 || 12; // Convert 0 to 12
    return `${formatHour}:00 ${ampm}`;
  }

  if (filter === "yearly")
    return monthNamesShort[dayValue - 1] || `Month ${dayValue}`;
  if (filter === "monthly")
    return `${dayValue} ${monthNamesShort[selMonth - 1]}`;

  if (filter === "weekly" && selDate) {
    const [y, m, d] = selDate.split("-");
    const endObj = new Date(y, m - 1, d);
    for (let i = 0; i < 7; i++) {
      const tempDate = new Date(endObj);
      tempDate.setDate(tempDate.getDate() - i);
      if (tempDate.getDate() === Number(dayValue)) {
        return `${dayValue} ${monthNamesShort[tempDate.getMonth()]}`;
      }
    }
    return `${dayValue} ${monthNamesShort[parseInt(m) - 1]}`;
  }
  return `Day ${dayValue}`;
};

const formatChartData = (breakdown, filter, selDate, selMonth) => {
  if (!breakdown) return [];
  return breakdown.map((day) => ({
    name: getFormatAxisLabel(day.day, filter, selDate, selMonth),
    production: day.production || 0,
    idle: day.idle_minutes || 0,
    shutdown: day.shutdown_minutes || 0,
  }));
};

// ============================================
// DUMMY DATA GENERATORS (UPDATED FOR SHIFTS)
// ============================================
const getExpectedKeysForToday = (shift) => {
  if (shift === "shiftA")
    return [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  if (shift === "shiftB") return [20, 21, 22, 23, 0, 1, 2, 3, 4, 5, 6, 7, 8];
  return Array.from({ length: 24 }, (_, i) => i);
};

const generateSampleData = (
  filter = "monthly",
  selDate = "",
  selMonth = 1,
  shift = "fullday",
) => {
  const data = [];

  if (filter === "today") {
    const keys = getExpectedKeysForToday(shift);
    keys.forEach((key) => {
      data.push({
        day: key,
        production: Math.floor(Math.random() * (400 - 100 + 1) + 100),
        idle_minutes: Math.floor(Math.random() * (15 - 0 + 1) + 0),
        shutdown_minutes: Math.floor(Math.random() * (20 - 0 + 1) + 0),
        has_data: true,
      });
    });
    return data;
  }

  let length = filter === "weekly" ? 7 : filter === "yearly" ? 12 : 30;
  let startWeeklyObj = null;
  if (filter === "weekly" && selDate) {
    const [y, m, d] = selDate.split("-");
    startWeeklyObj = new Date(y, m - 1, d);
    startWeeklyObj.setDate(startWeeklyObj.getDate() - 6);
  }

  for (let i = 1; i <= length; i++) {
    let dayVal = i;
    if (filter === "weekly" && startWeeklyObj) {
      const tDate = new Date(startWeeklyObj);
      tDate.setDate(tDate.getDate() + (i - 1));
      dayVal = tDate.getDate();
    }
    data.push({
      day: dayVal,
      production: Math.floor(Math.random() * (8500 - 4500 + 1) + 4500),
      idle_minutes: Math.floor(Math.random() * (120 - 30 + 1) + 30),
      shutdown_minutes: Math.floor(Math.random() * (180 - 60 + 1) + 60),
      has_data: true,
    });
  }
  return data;
};

const generateSampleMachineData = (
  machineNumber,
  filter = "monthly",
  selDate = "",
  selMonth = 1,
  shift = "fullday",
) => {
  const days = [];
  let activeDays = 0;

  if (filter === "today") {
    const keys = getExpectedKeysForToday(shift);
    keys.forEach((key) => {
      const isOfflineHour = Math.random() > 0.85;
      if (isOfflineHour) {
        days.push({
          day: key,
          production: 0,
          idle_minutes: 0,
          shutdown_minutes: 0,
          has_data: false,
          status: "Offline",
        });
      } else {
        activeDays++;
        days.push({
          day: key,
          production: Math.floor(Math.random() * (50 - 10 + 1) + 10),
          idle_minutes: Math.floor(Math.random() * (5 - 0 + 1) + 0),
          shutdown_minutes: Math.floor(Math.random() * (10 - 0 + 1) + 0),
          has_data: true,
          status: "Active",
        });
      }
    });
  } else {
    let length = filter === "weekly" ? 7 : filter === "yearly" ? 12 : 30;
    let startWeeklyObj = null;
    if (filter === "weekly" && selDate) {
      const [y, m, d] = selDate.split("-");
      startWeeklyObj = new Date(y, m - 1, d);
      startWeeklyObj.setDate(startWeeklyObj.getDate() - 6);
    }

    for (let i = 1; i <= length; i++) {
      const isOfflineDay = Math.random() > 0.85;
      let dayVal = i;
      if (filter === "weekly" && startWeeklyObj) {
        const tDate = new Date(startWeeklyObj);
        tDate.setDate(tDate.getDate() + (i - 1));
        dayVal = tDate.getDate();
      }

      if (isOfflineDay) {
        days.push({
          day: dayVal,
          production: 0,
          idle_minutes: 0,
          shutdown_minutes: 0,
          has_data: false,
          status: "Offline",
        });
      } else {
        activeDays++;
        days.push({
          day: dayVal,
          production: Math.floor(Math.random() * (400 - 200 + 1) + 200),
          idle_minutes: Math.floor(Math.random() * (90 - 20 + 1) + 20),
          shutdown_minutes: Math.floor(Math.random() * (120 - 30 + 1) + 30),
          has_data: true,
          status: "Active",
        });
      }
    }
  }

  const totalIdleMins = days.reduce((sum, d) => sum + d.idle_minutes, 0);
  const totalShutdownMins = days.reduce(
    (sum, d) => sum + d.shutdown_minutes,
    0,
  );

  return {
    machine_info: {
      machine_no: machineNumber,
      machine_id: `M-${String(machineNumber).padStart(2, "0")}`,
      period_type: filter === "today" ? `${filter} (${shift})` : filter,
    },
    production_summary: {
      total_production: days.reduce((sum, d) => sum + d.production, 0),
      average_daily: Math.round(
        days.reduce((sum, d) => sum + d.production, 0) / (activeDays || 1),
      ),
    },
    idle_summary: {
      total_idle_hours: Math.round((totalIdleMins / 60) * 10) / 10,
      total_shutdown_hours: Math.round((totalShutdownMins / 60) * 10) / 10,
    },
    machine_status: {
      active_days: activeDays,
      inactive_days: days.length - activeDays,
      active_percentage: Math.round((activeDays / days.length) * 100 * 10) / 10,
      status: activeDays > 0 ? "Operational" : "Offline",
    },
    daily_breakdown: days,
  };
};

const RadialGauge = ({
  percentage = 0,
  size = 60,
  stroke = 5,
  color = "#18a8c6",
  trackColor = "#1E242E",
  label,
  isDark,
}) => {
  const pct = Math.max(0, Math.min(100, percentage || 0));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`font-data font-bold leading-none ${
            isDark ? "text-white" : "text-slate-900"
          }`}
          style={{ fontSize: size * 0.24 }}
        >
          {Math.round(pct)}
        </span>
        {label && (
          <span
            className={`text-[8px] font-bold uppercase tracking-wider mt-0.5 ${
              isDark ? "text-slate-500" : "text-slate-400"
            }`}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

const ProductionHistory = () => {
  const [theme, setTheme] = useState("dark");
  const [selectedPlant, setSelectedPlant] = useState("plant1");
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString(),
  );
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [timeFilter, setTimeFilter] = useState("today");

  const [shiftFilter, setShiftFilter] = useState("shiftA");

  const [chartType, setChartType] = useState("bar");
  const [showMachineGrid, setShowMachineGrid] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentDay, setCurrentDay] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [machineAnalysisCache, setMachineAnalysisCache] = useState({});
  const [selectedMachineDetail, setSelectedMachineDetail] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [realtimeData, setRealtimeData] = useState(null);
  const [apiError, setApiError] = useState(false);
  // Actual machines received from database
  const [machineNumbers, setMachineNumbers] = useState([]);

  // Loading state only for machine selector
  const [machineListLoading, setMachineListLoading] = useState(false);

  const sidebarRef = useRef(null);
  const mainContentRef = useRef(null);

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 3; i <= currentYear + 3; i++) {
    years.push(i.toString());
  }

  const getMachineCount = () => (selectedPlant === "plant1" ? 57 : 46);

  const isDark = theme === "dark";
  const themeBgMain = isDark ? "bg-[#0A0C10]" : "bg-[#EEF1F5]";
  const themeCard = isDark
    ? "bg-[#12151C] border-[#1E242E]"
    : "bg-white border-[#DFE4EA]";
  const themeSubBg = isDark
    ? "bg-[#171B23] border-[#1E242E]"
    : "bg-[#F5F7FA] border-[#E2E8F0]";
  const themeTextMain = isDark ? "text-[#E8EBEF]" : "text-[#0F172A]";
  const themeTextMuted = isDark ? "text-[#6C7787]" : "text-[#64748B]";
  const themeBorder = isDark ? "border-[#1E242E]" : "border-[#EEF1F5]";
  const themeAccentText = "text-[#18a8c6]";
  const themeAccentBg = "bg-[#18a8c6]";
  const accentHex = "#18a8c6";
  const trackHex = isDark ? "#1E242E" : "#E2E8F0";

  const fetchMonthlySummary = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/monthly-summary/`, {
        params: {
          plant: selectedPlant,
          month: selectedMonth,
          year: selectedYear,
          period: timeFilter,
          date:
            timeFilter === "today" || timeFilter === "weekly"
              ? selectedDate
              : undefined,
          shift: timeFilter === "today" ? shiftFilter : undefined,
        },
      });

      if (
        response.data &&
        response.data.daily_breakdown &&
        response.data.daily_breakdown.length > 0
      ) {
        setMonthlyData(
          formatChartData(
            response.data.daily_breakdown,
            timeFilter,
            selectedDate,
            selectedMonth,
          ),
        );
        setMonthlySummary(response.data);
      } else {
        throw new Error("No data returned");
      }
      setApiError(false);
    } catch (error) {
      console.error("Error fetching summary:", error);
      setApiError(true);
      const sampleData = generateSampleData(
        timeFilter,
        selectedDate,
        selectedMonth,
        shiftFilter,
      );
      setMonthlyData(
        formatChartData(sampleData, timeFilter, selectedDate, selectedMonth),
      );
      setMonthlySummary({
        month_name:
          timeFilter === "today" || timeFilter === "weekly"
            ? selectedDate
            : monthNamesFull[selectedMonth - 1],
        summary: {
          total_production: sampleData.reduce(
            (sum, d) => sum + d.production,
            0,
          ),
          total_idle_hours:
            Math.round(
              (sampleData.reduce(
                (sum, d) => sum + d.idle_minutes + d.shutdown_minutes,
                0,
              ) /
                60) *
                10,
            ) / 10,
          days_with_data: sampleData.length,
          days_in_month: sampleData.length,
          coverage: 100,
        },
      });
    }
  };

  const fetchDateRange = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/date-range/`, {
        params: { plant: selectedPlant },
      });
      setDateRange(response.data);
    } catch (error) {
      console.error("Error fetching date range:", error);
    }
  };

  const fetchRealtimeDashboard = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/realtime-dashboard/`, {
        params: { plant: selectedPlant },
      });

      setRealtimeData(response.data);
    } catch (error) {
      console.error("Error fetching realtime dashboard:", error);
    }
  };

  // ======================================================
  // FETCH ACTUAL MACHINE NUMBERS FOR SELECTED PLANT
  // ======================================================
  const fetchMachineNumbers = async () => {
    try {
      setMachineListLoading(true);

      const response = await axios.get(
        `${API_BASE_URL}/production-history-machines/`,
        {
          params: {
            plant: selectedPlant,
          },
        },
      );

      console.log("✅ Production History Machines:", response.data);

      if (response.data?.success && Array.isArray(response.data?.machines)) {
        setMachineNumbers(response.data.machines);
      } else {
        console.error("❌ Invalid machine list response:", response.data);

        setMachineNumbers([]);
      }
    } catch (error) {
      console.error(`❌ Machine List API Error | ${selectedPlant}`, error);

      setMachineNumbers([]);
    } finally {
      setMachineListLoading(false);
    }
  };

  const fetchMachineAnalysis = async (machineNo, forceRefresh = false) => {
    const currentParamDate =
      timeFilter === "today" || timeFilter === "weekly" ? selectedDate : "none";

    const currentShift = timeFilter === "today" ? shiftFilter : "none";

    // ======================================================
    // IMPORTANT:
    // Plant MUST be part of machine cache identity.
    // ======================================================

    const cacheKey = `${selectedPlant}-${machineNo}-${selectedMonth}-${selectedYear}-${timeFilter}-${currentParamDate}-${currentShift}`;

    if (!forceRefresh && machineAnalysisCache[cacheKey]) {
      return machineAnalysisCache[cacheKey];
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/machine-analysis/`, {
        params: {
          plant: selectedPlant,
          machine_no: machineNo,
          month: selectedMonth,
          year: selectedYear,
          period: timeFilter,

          date:
            timeFilter === "today" || timeFilter === "weekly"
              ? selectedDate
              : undefined,

          shift: timeFilter === "today" ? shiftFilter : undefined,
        },
      });

      if (response.data && Array.isArray(response.data.daily_breakdown)) {
        setMachineAnalysisCache((prev) => ({
          ...prev,
          [cacheKey]: response.data,
        }));

        return response.data;
      }

      throw new Error("Machine analysis API returned invalid data");
    } catch (error) {
      console.error(
        `❌ Machine Analysis API Error | ` + `${selectedPlant} | M${machineNo}`,
        error,
      );

      // ====================================================
      // IMPORTANT:
      // DO NOT generate fake/random machine history.
      // ====================================================

      return null;
    }
  };

  // ======================================================
  // LOAD MACHINE LIST WHEN PLANT CHANGES
  // ======================================================
  useEffect(() => {
    setSelectedMachine(null);
    setSelectedMachineDetail(null);
  }, [selectedPlant]);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      fetchDateRange();
      fetchRealtimeDashboard();

      if (selectedMachine) {
        const analysis = await fetchMachineAnalysis(selectedMachine);

        setSelectedMachineDetail(analysis || null);
      } else {
        await fetchMonthlySummary();
      }
      setLoading(false);
    };
    loadAllData();
  }, [
    selectedPlant,
    selectedMonth,
    selectedYear,
    timeFilter,
    selectedDate,
    selectedMachine,
    shiftFilter,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchRealtimeDashboard();
      if (selectedMachine) {
        fetchMachineAnalysis(selectedMachine, true).then((analysis) => {
          setSelectedMachineDetail(analysis || null);
        });
      } else {
        fetchMonthlySummary();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [
    selectedPlant,
    selectedMonth,
    selectedYear,
    timeFilter,
    selectedDate,
    selectedMachine,
    shiftFilter,
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!mainContentRef.current || !sidebarRef.current) {
      return;
    }

    let frameId = null;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];

      if (!entry) {
        return;
      }

      const height = Math.ceil(entry.contentRect.height);

      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(() => {
        if (!sidebarRef.current) {
          return;
        }

        const currentHeight = parseInt(
          sidebarRef.current.style.minHeight || "0",
          10,
        );

        // Prevent unnecessary layout write
        if (currentHeight !== height) {
          sidebarRef.current.style.minHeight = `${height}px`;
        }
      });
    });

    observer.observe(mainContentRef.current);

    return () => {
      observer.disconnect();

      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);

  const selectMachine = (machineNumber) => {
    if (selectedMachine === machineNumber) {
      setSelectedMachine(null);
      setSelectedMachineDetail(null);
    } else {
      setSelectedMachine(machineNumber);
      setSelectedMachineDetail(null);
    }
  };

  const clearMachine = () => {
    setSelectedMachine(null);
    setSelectedMachineDetail(null);
  };

  const startAnimation = () => {
    setIsAnimating(true);
    let day = 0;
    const interval = setInterval(() => {
      if (day < monthlyData.length) {
        setCurrentDay(day);
        day++;
      } else {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 200);
    return () => clearInterval(interval);
  };

  const stopAnimation = () => {
    setIsAnimating(false);
    setCurrentDay(0);
  };

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const renderChart = () => {
    let data = monthlyData;
    if (
      selectedMachine &&
      selectedMachineDetail &&
      selectedMachineDetail.daily_breakdown
    ) {
      data = formatChartData(
        selectedMachineDetail.daily_breakdown,
        timeFilter,
        selectedDate,
        selectedMonth,
      );
    }

    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className={`mb-2 font-semibold ${themeTextMuted}`}>
              No data available
            </div>
            <div className={`text-xs ${themeTextMuted}`}>
              Please check your API connection or select different filters
            </div>
          </div>
        </div>
      );
    }

    const commonProps = {
      data: data,
      margin: { top: 20, right: 24, left: 12, bottom: 5 },
    };
    const customTooltip = {
      backgroundColor: isDark ? "#12151C" : "#ffffff",
      border: `1px solid ${isDark ? "#232935" : "#e2e8f0"}`,
      borderRadius: "10px",
      color: isDark ? "#E8EBEF" : "#1e293b",
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: "12px",
    };
    const chartStroke = isDark ? "#5B6472" : "#64748b";
    const gridStroke = isDark ? "#1B2029" : "#e2e8f0";

    if (loading && (selectedMachine || !monthlySummary)) {
      return (
        <div
          className={`flex items-center justify-center h-full font-medium font-data text-sm ${themeTextMuted}`}
        >
          <span className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${themeAccentBg}`}
            />{" "}
            LOADING TELEMETRY...
          </span>
        </div>
      );
    }

    switch (chartType) {
      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridStroke}
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke={chartStroke}
              fontSize={10}
              fontFamily="'JetBrains Mono', monospace"
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke={chartStroke}
              fontSize={10}
              fontFamily="'JetBrains Mono', monospace"
              tickLine={false}
            />
            <Tooltip contentStyle={customTooltip} />
            <Line
              type="monotone"
              dataKey="production"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={{ fill: "#10b981", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="idle"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={{ fill: "#f59e0b", r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="shutdown"
              stroke="#ef4444"
              strokeWidth={2.5}
              dot={{ fill: "#ef4444", r: 4 }}
            />
          </LineChart>
        );
      case "area":
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient
                id="productionGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridStroke}
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke={chartStroke}
              fontSize={10}
              fontFamily="'JetBrains Mono', monospace"
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke={chartStroke}
              fontSize={10}
              fontFamily="'JetBrains Mono', monospace"
              tickLine={false}
            />
            <Tooltip contentStyle={customTooltip} />
            <Area
              type="monotone"
              dataKey="production"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#productionGradient)"
            />
            <Area
              type="monotone"
              dataKey="idle"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="none"
            />
            <Area
              type="monotone"
              dataKey="shutdown"
              stroke="#ef4444"
              strokeWidth={2}
              fill="none"
            />
          </AreaChart>
        );
      default:
        return (
          <BarChart {...commonProps} barGap={4}>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke={gridStroke}
              vertical={false}
              opacity={0.3}
            />
            <XAxis
              dataKey="name"
              stroke={chartStroke}
              fontSize={11}
              fontFamily="'JetBrains Mono', monospace"
              tickLine={false}
              axisLine={false}
              dy={12}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke={chartStroke}
              fontSize={11}
              fontFamily="'JetBrains Mono', monospace"
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip
              contentStyle={customTooltip}
              formatter={(value, name) => {
                if (name === "idle")
                  return [formatTimeHelper(value), "Idle (ONLINE)"];
                if (name === "production")
                  return [value.toLocaleString(), "Production (units)"];
                if (name === "shutdown")
                  return [formatTimeHelper(value), "Shutdown (OFFLINE)"];
                return [value, name];
              }}
              cursor={{
                fill: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
              }}
            />
            <Bar
              dataKey="idle"
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
              barSize={16}
            />
            <Bar
              dataKey="production"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              barSize={16}
            />
            <Bar
              dataKey="shutdown"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              barSize={16}
            />
          </BarChart>
        );
    }
  };

  return (
    <div
      className={`font-ui min-h-fit relative overflow-x-hidden transition-colors duration-300 ${themeBgMain} ${
        isDark ? "theme-dark" : ""
      }`}
      style={{
        backgroundImage: isDark
          ? "radial-gradient(circle, #161b24 1px, transparent 1px)"
          : "radial-gradient(circle, #dbe1e8 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      <div className="w-full mx-auto p-4 md:p-6 lg:p-8 relative z-10">
        <div
          className={`relative border rounded-xl mb-6 p-6 shadow-sm overflow-hidden transition-colors duration-300 ${themeCard}`}
        >
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#18a8c6] via-[#128a9c] to-transparent" />
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-md border ${themeSubBg}`}
                >
                  <Terminal size={14} className={themeAccentText} />
                  <span
                    className={`font-data text-xs font-medium ${
                      isDark ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    production@dashboard:~/system$
                  </span>
                </div>
                <span
                  className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#18a8c6]/10 text-[#18a8c6]`}
                >
                  <Radio size={11} className="animate-pulse" /> Live
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  className={`flex items-center justify-center p-2 rounded-lg border transition-all ${
                    isDark
                      ? "bg-[#171B23] border-[#1E242E] text-[#18a8c6] hover:bg-[#1E242E]"
                      : "bg-white border-slate-200 text-[#18a8c6] hover:bg-slate-100 shadow-sm"
                  }`}
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button
                  onClick={() => fetchRealtimeDashboard()}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                    isDark
                      ? "bg-[#171B23] border-[#1E242E] text-slate-200 hover:border-[#18a8c6]/40"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm"
                  }`}
                >
                  <RefreshCw size={14} /> Refresh Data
                </button>
              </div>
            </div>
            <h1
              className={`text-3xl md:text-4xl font-extrabold tracking-tight ${themeTextMain}`}
            >
              Production History &amp; Analysis
            </h1>
            <p
              className={`text-sm mt-2 font-medium flex items-center flex-wrap gap-2 ${themeTextMuted}`}
            >
              <Activity size={16} className={themeAccentText} /> Real-Time
              Monitoring System
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div ref={sidebarRef} className="lg:col-span-3 flex flex-col gap-6">
            <div
              className={`border rounded-xl overflow-hidden shadow-sm transition-colors duration-300 ${themeCard}`}
            >
              <div
                className={`px-5 py-3.5 border-b flex items-center gap-2 ${themeSubBg}`}
              >
                <Filter size={15} className={themeAccentText} />
                <h2
                  className={`text-[11px] font-bold tracking-widest uppercase ${themeTextMain}`}
                >
                  Filters &amp; Parameters
                </h2>
              </div>
              <div className="p-5 space-y-6">
                <div>
                  <label
                    className={`text-[10px] font-bold block mb-2.5 flex items-center gap-2 uppercase tracking-widest ${themeTextMuted}`}
                  >
                    <Factory
                      size={13}
                      className={isDark ? "text-slate-500" : "text-slate-400"}
                    />{" "}
                    Plant Selection
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setSelectedPlant("plant1");
                        setSelectedMachine(null);
                        setSelectedMachineDetail(null);
                        setMachineAnalysisCache({});
                      }}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-all duration-200 font-semibold text-sm ${
                        selectedPlant === "plant1"
                          ? `${themeAccentBg} border-transparent text-[#04120F] shadow-md`
                          : `border-transparent ${themeSubBg} ${
                              isDark ? "text-slate-300" : "text-slate-600"
                            }`
                      }`}
                    >
                      <Cpu size={16} /> Plant 1
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPlant("plant2");
                        setSelectedMachine(null);
                        setSelectedMachineDetail(null);
                        setMachineAnalysisCache({});
                      }}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border transition-all duration-200 font-semibold text-sm ${
                        selectedPlant === "plant2"
                          ? `${themeAccentBg} border-transparent text-[#04120F] shadow-md`
                          : `border-transparent ${themeSubBg} ${
                              isDark ? "text-slate-300" : "text-slate-600"
                            }`
                      }`}
                    >
                      <Zap size={16} /> Plant 2
                    </button>
                  </div>
                </div>

                <div>
                  <div
                    className={`flex justify-between items-center mb-3 border-t pt-5 w-full ${themeBorder}`}
                  >
                    <label
                      className={`text-[10px] font-bold flex items-center gap-2 uppercase tracking-widest ${themeTextMuted}`}
                    >
                      <Settings
                        size={13}
                        className={isDark ? "text-slate-500" : "text-slate-400"}
                      />{" "}
                      Machine No.
                    </label>
                    <button
                      onClick={() => setShowMachineGrid(!showMachineGrid)}
                      className={`p-1 rounded-md transition-colors mt-5 ${
                        isDark
                          ? "bg-[#171B23] text-slate-400"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {showMachineGrid ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      )}
                    </button>
                  </div>
                  {showMachineGrid && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-5 gap-1.5 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                        {Array.from(
                          { length: getMachineCount() },
                          (_, index) => index + 1,
                        ).map((num) => (
                          <button
                            key={num}
                            onClick={() => selectMachine(num)}
                            className={`font-data aspect-square flex items-center justify-center text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                              selectedMachine === num
                                ? `${themeAccentBg} border-transparent text-[#04120F] shadow-md`
                                : `${themeSubBg} ${
                                    isDark ? "text-slate-300" : "text-slate-600"
                                  }`
                            }`}
                          >
                            {String(num).padStart(2, "0")}
                          </button>
                        ))}
                      </div>
                      <div
                        className={`flex items-center justify-between pt-3 border-t ${themeBorder}`}
                      >
                        <button
                          onClick={clearMachine}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                            isDark ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          Clear All
                        </button>
                        <div
                          className={`font-data text-[11px] font-bold px-2 py-1 rounded border ${
                            isDark
                              ? "bg-[#171B23] border-[#1E242E] text-slate-300"
                              : "bg-slate-100 border-transparent text-slate-600"
                          }`}
                        >
                          {selectedMachine
                            ? `M-${String(selectedMachine).padStart(2, "0")}`
                            : "None"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              className={`border rounded-xl p-5 shadow-sm transition-colors duration-300 flex-1 flex flex-col ${themeCard}`}
            >
              <div
                className={`flex items-center gap-2 mb-4 pb-3 border-b ${themeBorder}`}
              >
                <Monitor size={16} className={themeAccentText} />
                <span
                  className={`text-[11px] font-bold uppercase tracking-widest ${themeTextMain}`}
                >
                  System Status
                </span>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className={`font-medium ${themeTextMuted}`}>
                    Data Stream
                  </span>
                  <span
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      apiError
                        ? isDark
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-amber-100 text-amber-700"
                        : isDark
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        apiError ? "bg-amber-500" : "bg-emerald-500"
                      } animate-pulse`}
                    />{" "}
                    {apiError ? "DEMO" : "ACTIVE"}
                  </span>
                </div>
                {realtimeData && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className={`font-medium ${themeTextMuted}`}>
                        Today's Output
                      </span>
                      <span className={`font-data font-bold ${themeTextMain}`}>
                        {realtimeData.summary?.total_production?.toLocaleString() ||
                          "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`font-medium ${themeTextMuted}`}>
                        Active Machines
                      </span>
                      <span className={`font-data font-bold ${themeTextMain}`}>
                        {realtimeData.summary?.active_machines || 0} /{" "}
                        {realtimeData.summary?.total_machines || 0}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div ref={mainContentRef} className="lg:col-span-9 space-y-6">
            <div
              className={`border rounded-xl overflow-hidden shadow-sm transition-colors duration-300 ${themeCard}`}
            >
              <div className={`px-6 pt-6 pb-4 border-b ${themeBorder}`}>
                <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
                  <div>
                    <h3
                      className={`text-xl font-bold flex items-center gap-2 ${themeTextMain}`}
                    >
                      <BarChart3 size={20} className={themeAccentText} />
                      {selectedMachine
                        ? `Machine M-${String(selectedMachine).padStart(
                            2,
                            "0",
                          )} Production`
                        : "Overall Plant Production"}
                    </h3>
                    <p
                      className={`font-data text-xs mt-1.5 font-medium flex items-center gap-2 ${themeTextMuted}`}
                    >
                      <Calendar
                        size={13}
                        className={isDark ? "text-slate-500" : "text-slate-400"}
                      />
                      {timeFilter === "today"
                        ? `Date: ${formatDateNice(selectedDate)}`
                        : timeFilter === "weekly"
                        ? `${formatDateNice(
                            getWeeklyStartDate(selectedDate),
                          )} to ${formatDateNice(selectedDate)}`
                        : `${
                            timeFilter.charAt(0).toUpperCase() +
                            timeFilter.slice(1)
                          }`}{" "}
                      Production •{" "}
                      {monthlySummary?.summary?.days_with_data ||
                        monthlyData.length}{" "}
                      Records
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div
                      className={`flex items-center rounded-lg p-0.5 shadow-sm transition-all border ${themeSubBg}`}
                    >
                      {timeFilter === "today" && (
                        <div className="flex items-center">
                          <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className={`font-data appearance-none bg-transparent border-none px-3 py-1.5 text-sm font-bold focus:outline-none cursor-pointer ${
                              isDark
                                ? "text-slate-200 color-scheme-dark"
                                : "text-slate-700"
                            }`}
                          />

                          {/* SHIFT SELECTOR FOR TODAY WITH ARROW */}
                          <div
                            className={`relative border-l pl-2 flex items-center ${
                              isDark ? "border-[#1E242E]" : "border-slate-300"
                            }`}
                          >
                            <select
                              value={shiftFilter}
                              onChange={(e) => setShiftFilter(e.target.value)}
                              className={`appearance-none bg-transparent border-none pl-2 pr-7 py-1.5 text-sm font-bold focus:outline-none cursor-pointer ${
                                isDark ? "text-slate-200" : "text-slate-700"
                              }`}
                            >
                              <option
                                className={isDark ? "bg-[#171B23]" : ""}
                                value="shiftA"
                              >
                                Shift A (08:30 AM - 08:00 PM)
                              </option>
                              <option
                                className={isDark ? "bg-[#171B23]" : ""}
                                value="shiftB"
                              >
                                Shift B (08:30 PM - 08:00 AM)
                              </option>
                              <option
                                className={isDark ? "bg-[#171B23]" : ""}
                                value="fullday"
                              >
                                Full Day (24h)
                              </option>
                            </select>
                            <ChevronDown
                              size={14}
                              className={`absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                                isDark ? "text-slate-500" : "text-slate-400"
                              }`}
                            />
                          </div>
                        </div>
                      )}

                      {timeFilter === "weekly" && (
                        <div className="flex items-center">
                          <input
                            type="date"
                            value={getWeeklyStartDate(selectedDate)}
                            onChange={(e) => {
                              if (!e.target.value) return;
                              const [y, m, d] = e.target.value.split("-");
                              const dateObj = new Date(y, m - 1, d);
                              dateObj.setDate(dateObj.getDate() + 6);
                              setSelectedDate(
                                `${dateObj.getFullYear()}-${String(
                                  dateObj.getMonth() + 1,
                                ).padStart(2, "0")}-${String(
                                  dateObj.getDate(),
                                ).padStart(2, "0")}`,
                              );
                            }}
                            className={`font-data appearance-none bg-transparent border-none pl-3 pr-1 py-1.5 text-sm font-bold focus:outline-none cursor-pointer ${
                              isDark
                                ? "text-slate-200 color-scheme-dark"
                                : "text-slate-700"
                            }`}
                          />
                          <span
                            className={`font-black px-1 ${
                              isDark ? "text-slate-500" : "text-slate-300"
                            }`}
                          >
                            -
                          </span>
                          <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className={`font-data appearance-none bg-transparent border-none pr-3 pl-1 py-1.5 text-sm font-bold focus:outline-none cursor-pointer ${
                              isDark
                                ? "text-slate-200 color-scheme-dark"
                                : "text-slate-700"
                            }`}
                          />
                        </div>
                      )}

                      {(timeFilter === "monthly" ||
                        timeFilter === "yearly") && (
                        <div className="flex items-center">
                          {timeFilter === "monthly" && (
                            <>
                              <div className="relative flex items-center">
                                <select
                                  value={selectedMonth}
                                  onChange={(e) =>
                                    setSelectedMonth(parseInt(e.target.value))
                                  }
                                  className={`appearance-none bg-transparent border-none pl-3 pr-7 py-1.5 text-sm font-bold focus:outline-none cursor-pointer ${
                                    isDark ? "text-slate-200" : "text-slate-700"
                                  }`}
                                >
                                  {monthNamesFull.map((month, idx) => (
                                    <option
                                      className={isDark ? "bg-[#171B23]" : ""}
                                      key={month}
                                      value={idx + 1}
                                    >
                                      {month}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown
                                  size={14}
                                  className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${
                                    isDark ? "text-slate-500" : "text-slate-400"
                                  }`}
                                />
                              </div>
                              <span
                                className={`px-1 ${
                                  isDark ? "text-slate-500" : "text-slate-300"
                                }`}
                              >
                                |
                              </span>
                            </>
                          )}
                          <div className="relative flex items-center">
                            <select
                              value={selectedYear}
                              onChange={(e) => setSelectedYear(e.target.value)}
                              className={`font-data appearance-none bg-transparent border-none pl-3 pr-7 py-1.5 text-sm font-bold focus:outline-none cursor-pointer ${
                                isDark ? "text-slate-200" : "text-slate-700"
                              }`}
                            >
                              {years.map((year) => (
                                <option
                                  className={isDark ? "bg-[#171B23]" : ""}
                                  key={year}
                                  value={year}
                                >
                                  {year}
                                </option>
                              ))}
                            </select>
                            <ChevronDown
                              size={14}
                              className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${
                                isDark ? "text-slate-500" : "text-slate-400"
                              }`}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      className={`relative group flex items-center rounded-lg p-0.5 shadow-sm transition-all border ${
                        isDark
                          ? "bg-[#18a8c6]/10 border-[#18a8c6]/20"
                          : "bg-[#18a8c6]/10 border-[#18a8c6]/30"
                      }`}
                    >
                      <select
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                        className={`appearance-none bg-transparent border-none pl-3 pr-6 py-1.5 text-sm font-bold focus:outline-none focus:ring-0 cursor-pointer capitalize ${
                          isDark ? "text-white" : "text-[#128a9c]"
                        }`}
                      >
                        <option
                          className={isDark ? "bg-[#171B23]" : ""}
                          value="today"
                        >
                          Today
                        </option>
                        <option
                          className={isDark ? "bg-[#171B23]" : ""}
                          value="weekly"
                        >
                          Weekly
                        </option>
                        <option
                          className={isDark ? "bg-[#171B23]" : ""}
                          value="monthly"
                        >
                          Monthly
                        </option>
                        <option
                          className={isDark ? "bg-[#171B23]" : ""}
                          value="yearly"
                        >
                          Yearly
                        </option>
                      </select>
                      <ChevronDown
                        size={14}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
                          isDark ? "text-[#18a8c6]" : "text-[#18a8c6]"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 h-[400px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  {renderChart()}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Machine Detail Cards (ENLARGED & RESTORED) */}
            {selectedMachine && selectedMachineDetail ? (
              <div
                className={`border rounded-xl p-6 shadow-sm animate-fadeIn transition-colors duration-300 ${themeCard}`}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3
                    className={`text-2xl font-bold flex items-center gap-2 ${themeTextMain}`}
                  >
                    <Cpu size={26} className={themeAccentText} />
                    {selectedMachineDetail.machine_info.machine_id} Overview
                    <span
                      className={`font-data text-xs px-2 py-1 ml-2 border rounded capitalize ${
                        isDark
                          ? "bg-[#18a8c6]/10 text-[#18a8c6] border-[#18a8c6]/20"
                          : "bg-[#18a8c6]/10 text-[#128a9c] border-[#18a8c6]/20"
                      }`}
                    >
                      {selectedMachineDetail.machine_info.period_type ||
                        timeFilter}
                    </span>
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <div
                      className={`rounded-xl px-5 pt-5 pb-4 border transition-colors flex flex-col justify-between min-h-[110px] ${themeSubBg}`}
                    >
                      <p
                        className={`text-[10px] font-bold mb-2 uppercase tracking-widest ${themeTextMuted}`}
                      >
                        Total Prod.
                      </p>
                      <p className="font-data text-3xl font-bold text-[#10b981]">
                        {selectedMachineDetail.production_summary.total_production.toLocaleString()}
                      </p>
                    </div>
                    <div
                      className={`rounded-xl px-5 pt-5 pb-4 border transition-colors flex flex-col justify-between min-h-[110px] ${themeSubBg}`}
                    >
                      <p
                        className={`text-[10px] font-bold mb-2 uppercase tracking-widest ${themeTextMuted}`}
                      >
                        Idle (Online)
                      </p>
                      <p className="font-data text-3xl font-bold text-[#f59e0b]">
                        {selectedMachineDetail.idle_summary.total_idle_hours.toFixed(
                          1,
                        )}{" "}
                        <span className="text-sm font-normal">hrs</span>
                      </p>
                    </div>
                    <div
                      className={`rounded-xl px-5 pt-5 pb-4 border transition-colors flex flex-col justify-between min-h-[110px] ${themeSubBg}`}
                    >
                      <p
                        className={`text-[10px] font-bold mb-2 uppercase tracking-widest ${themeTextMuted}`}
                      >
                        Shutdown (Offline)
                      </p>
                      <p className="font-data text-3xl font-bold text-[#ef4444]">
                        {selectedMachineDetail.idle_summary.total_shutdown_hours?.toFixed(
                          1,
                        ) || "0.0"}{" "}
                        <span className="text-sm font-normal">hrs</span>
                      </p>
                    </div>
                    <div
                      className={`rounded-xl px-5 py-4 border transition-colors flex items-center justify-between min-h-[110px] ${themeSubBg}`}
                    >
                      <div className="flex flex-col justify-between h-full">
                        <p
                          className={`text-[10px] font-bold mb-2 uppercase tracking-widest ${themeTextMuted}`}
                        >
                          Active Rate
                        </p>
                        <p
                          className={`font-data text-3xl font-bold ${themeAccentText}`}
                        >
                          {
                            selectedMachineDetail.machine_status
                              .active_percentage
                          }
                          %
                        </p>
                      </div>
                      <RadialGauge
                        percentage={
                          selectedMachineDetail.machine_status.active_percentage
                        }
                        size={50}
                        stroke={5}
                        color={accentHex}
                        trackColor={trackHex}
                        isDark={isDark}
                      />
                    </div>
                  </div>

                  {/* RESTORED BOTTOM PROGRESS BAR */}
                  <div
                    className={`rounded-xl p-5 border transition-colors ${themeSubBg}`}
                  >
                    <div className="flex justify-between items-end mb-2.5">
                      <p className={`text-sm font-semibold ${themeTextMain}`}>
                        Current Status:{" "}
                        <span
                          className={
                            selectedMachineDetail.machine_status.status ===
                            "Operational"
                              ? "text-[#10b981] ml-1"
                              : "text-[#ef4444] ml-1"
                          }
                        >
                          {selectedMachineDetail.machine_status.status}
                        </span>
                      </p>
                      <p
                        className={`font-data text-xs font-semibold ${themeTextMuted}`}
                      >
                        Active Data:{" "}
                        {selectedMachineDetail.machine_status.active_days}{" "}
                        Segments | Inactive:{" "}
                        {selectedMachineDetail.machine_status.inactive_days}{" "}
                        Segments
                      </p>
                    </div>
                    <div
                      className={`h-3 rounded-full overflow-hidden flex ${
                        isDark ? "bg-[#0A0C10]" : "bg-slate-200"
                      }`}
                    >
                      <div
                        className="h-full bg-[#10b981] transition-all duration-1000"
                        style={{
                          width: `${selectedMachineDetail.machine_status.active_percentage}%`,
                        }}
                      />
                      <div
                        className="h-full bg-[#ef4444] transition-all duration-1000"
                        style={{
                          width: `${
                            100 -
                            selectedMachineDetail.machine_status
                              .active_percentage
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              monthlySummary && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Plant Overview Cards (ENLARGED & RESTORED PTI TIGHTLY TO BOTTOM) */}
                  <div
                    className={`border rounded-xl px-5 pt-5 pb-3 shadow-sm transition-all flex flex-col justify-between min-h-[140px] relative overflow-hidden ${themeCard}`}
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#10b981]" />
                    <div className="flex justify-between items-start">
                      <div>
                        <p
                          className={`text-[11px] font-bold flex items-center gap-1.5 uppercase tracking-widest ${themeTextMuted}`}
                        >
                          <Calendar size={14} className="text-[#10b981]" />{" "}
                          Total Production
                        </p>
                        <p
                          className={`font-data text-4xl font-extrabold mt-3 ${themeTextMain}`}
                        >
                          {monthlySummary.summary?.total_production?.toLocaleString() ||
                            0}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`text-[10px] font-medium mt-4 ${themeTextMuted}`}
                    >
                      Units produced in selected view
                    </p>
                  </div>

                  <div
                    className={`border rounded-xl px-5 pt-5 pb-3 shadow-sm transition-all flex flex-col justify-between min-h-[140px] relative overflow-hidden ${themeCard}`}
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#f59e0b]" />
                    <div className="flex justify-between items-start">
                      <div>
                        <p
                          className={`text-[11px] font-bold flex items-center gap-1.5 uppercase tracking-widest ${themeTextMuted}`}
                        >
                          <Clock size={14} className="text-[#f59e0b]" /> Total
                          Idle/Offline
                        </p>
                        <p
                          className={`font-data text-4xl font-extrabold mt-3 ${themeTextMain}`}
                        >
                          {monthlySummary.summary?.total_idle_hours?.toLocaleString() ||
                            0}{" "}
                          <span
                            className={`text-xl font-semibold ${themeTextMuted}`}
                          >
                            hrs
                          </span>
                        </p>
                      </div>
                    </div>
                    <p
                      className={`text-[10px] font-medium mt-4 ${themeTextMuted}`}
                    >
                      Recorded idle &amp; shutdown hours
                    </p>
                  </div>

                  <div
                    className={`border rounded-xl px-5 pt-5 pb-3 shadow-sm transition-all flex flex-col justify-between min-h-[140px] relative overflow-hidden ${themeCard}`}
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-[#18a8c6]" />
                    <div className="flex justify-between items-start">
                      <div>
                        <p
                          className={`text-[11px] font-bold flex items-center gap-1.5 uppercase tracking-widest ${themeTextMuted}`}
                        >
                          <AlertTriangle
                            size={14}
                            className={themeAccentText}
                          />{" "}
                          Data Coverage
                        </p>
                        <p
                          className={`font-data text-4xl font-extrabold mt-3 ${themeTextMain}`}
                        >
                          {Math.round(monthlySummary.summary?.coverage || 0)}%
                        </p>
                      </div>
                      <RadialGauge
                        percentage={monthlySummary.summary?.coverage || 0}
                        size={54}
                        stroke={5}
                        color={accentHex}
                        trackColor={trackHex}
                        isDark={isDark}
                      />
                    </div>
                    <p
                      className={`text-[10px] font-medium mt-4 ${themeTextMuted}`}
                    >
                      Active data coverage for this period
                    </p>
                  </div>
                </div>
              )
            )}

            <div
              className={`flex items-center gap-4 border rounded-xl px-5 py-3.5 shadow-sm flex-wrap transition-colors duration-300 ${themeCard}`}
            >
              <span
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                  isDark
                    ? "bg-[#18a8c6]/10 text-[#18a8c6]"
                    : "bg-[#18a8c6]/10 text-[#128a9c]"
                }`}
              >
                <Power size={12} /> Live System
              </span>
              <span className={`w-px h-4 ${themeBorder} border-r`} />
              <span
                className={`flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap ${themeTextMuted}`}
              >
                <Server size={14} className={themeAccentText} /> Overall{" "}
                {selectedPlant === "plant1" ? "Plant 1" : "Plant 2"}
              </span>
              <span className={`w-px h-4 ${themeBorder} border-r`} />
              <span
                className={`flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap ${themeTextMain}`}
              >
                <Folder size={14} className={themeAccentText} />{" "}
                {selectedPlant === "plant1" ? "Plant 1" : "Plant 2"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        .font-ui { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        .font-data { font-family: 'JetBrains Mono', 'Courier New', monospace; font-variant-numeric: tabular-nums; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #18a8c666; border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #18a8c6; }
        .theme-dark input[type="date"], .theme-dark select { color-scheme: dark; }
      `}</style>
    </div>
  );
};

export default ProductionHistory;
