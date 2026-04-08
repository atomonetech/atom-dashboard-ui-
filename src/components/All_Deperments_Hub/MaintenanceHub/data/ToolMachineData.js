// 🔥 1. Initial 4 Cards for Tool Hub (Categories)
export const toolFrequencyCards = [
  {
    id: "daily",
    title: "Daily Tool Maint.",
    icon: "bi-calendar-check",
    color: "#10b981",
    bgColor: "#ecfdf5",
  },
  {
    id: "weekly",
    title: "Weekly Tool Maint.",
    icon: "bi-calendar-range",
    color: "#3b82f6",
    bgColor: "#eff6ff",
  },
  {
    id: "monthly",
    title: "Monthly Tool Maint.",
    icon: "bi-calendar-month",
    color: "#f59e0b",
    bgColor: "#fffbeb",
  },
  {
    id: "yearly",
    title: "Yearly Tool Maint.",
    icon: "bi-calendar-event",
    color: "#ef4444",
    bgColor: "#fef2f2",
  },
];

// 🔥 2. Tool Daily Forms (Used when Daily is clicked in Tool Tab)
export const toolReports = [
  {
    id: "tool_history",
    title: "Tool History Card",
    formNo: "AOT-F-TM-01",
    frequency: "Daily",
    responsibility: "Tool Room Engineer",
    icon: "bi-tools",
    color: "#8b5cf6",
    bgColor: "#ede9fe",
  },
  {
    id: "tool_stroke",
    title: "Tool Stroke for PM",
    formNo: "AOT-F-TM-02",
    frequency: "Daily",
    responsibility: "Tool Room Engineer",
    icon: "bi-activity",
    color: "#06b6d4",
    bgColor: "#cffafe",
  },
  {
    id: "tool_pm_check",
    title: "Tool P.M. Checklist",
    formNo: "AOT-F-TM-04",
    frequency: "Daily",
    responsibility: "Tool Room Engineer",
    icon: "bi-card-checklist",
    color: "#10b981",
    bgColor: "#d1fae5",
  },
  {
    id: "tool_breakdown",
    title: "Tool Break Down Slip",
    formNo: "AOT-F-BD-02",
    frequency: "Daily",
    responsibility: "Prod. Engineer",
    icon: "bi-hammer",
    color: "#ef4444",
    bgColor: "#fef2f2",
  },
];

// 🔥 3. Tool Weekly Forms (Used when Weekly is clicked in Tool Tab)
export const weeklyToolSubReports = [
  {
    id: "weekly_pm_welding_fixture",
    title: "Welding Fixture Maintenance Checklist",
    formNo: "AOT-F-WF-01",
    frequency: "Weekly",
    responsibility: "Tool Room Engineer",
    icon: "bi-tools",
    color: "#ec4899",
  },
];

// Optional: Per Setup/Monthly specific cards (if needed)
export const toolMaintenanceCards = [
  {
    id: "tool_history_setup",
    title: "Tool History Card",
    formNo: "TOOL/HC/01",
    frequency: "Per Setup",
    responsibility: "Production/QC",
    icon: "bi-file-earmark-medical",
    color: "#6366f1",
    bgColor: "#eef2ff",
  },
  {
    id: "tool_pm_check_monthly",
    title: "Tool PM Checklist",
    formNo: "TOOL/CK/03",
    frequency: "Monthly",
    responsibility: "Maintenance",
    icon: "bi-check2-square",
    color: "#10b981",
    bgColor: "#ecfdf5",
  }
];