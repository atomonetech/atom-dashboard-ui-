
// 1. Initial 4 Cards for Tool Hub (Categories)
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

// 2. Tool Daily Forms
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
    isLive: true,
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
    isLive: false,
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
    isLive: true,
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
    isLive: true,
  },
];

// 3. Tool Weekly Forms
export const weeklyToolSubReports = [
  {
    id: "weekly_pm_welding_fixture",
    title: "Welding Fixture Maintenance Checklist",
    formNo: "AOT-F-WF-01",
    frequency: "Weekly",
    responsibility: "Tool Room Engineer",
    icon: "bi-tools",
    color: "#ec4899",
    isLive: false,
  },
];

// Optional: Per Setup/Monthly specific cards
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
    isLive: false,
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
    isLive: false,
  }
];

// 4. Tool Monthly Reports
export const toolMonthlyReports = [
  {
    id: "tool_breakdown_summary",
    title: "Tool Breakdown Summary Sheet",
    formNo: "AOT-F-TM-05",
    frequency: "Monthly",
    responsibility: "Tool Room Manager",
    icon: "bi-file-earmark-spreadsheet",
    color: "#8b5cf6", 
    bgColor: "#f5f3ff",
    isLive: true,
  },
  {
    id: "why_tool_analysis",
    title: "Why Tool Analysis",
    formNo: "AOT-F-TM-06",
    frequency: "Breakdown / Monthly",
    responsibility: "Tool Room Engineer",
    icon: "bi-patch-question",
    color: "#f43f5e", 
    bgColor: "#fff1f2",
    isLive: false,
  },
  {
    id: "tool_critical_spares",
    title: "Critical Spare Part List",
    formNo: "AOT-F-TM-07",
    frequency: "Monthly Review",
    responsibility: "Store / Tool Room",
    icon: "bi-box-seam",
    color: "#0ea5e9", 
    bgColor: "#f0f9ff",
    isLive: true,
  },
];

// 5. Tool Yearly Reports
export const toolYearlyReports = [
    { id: "master_list_tool", title: "Master List of Tool", formNo: "AOT-F-TM-08", frequency: "Yearly", responsibility: "Tool Room Head", icon: "bi-hammer", color: "#8b5cf6", bgColor: "#f5f3ff", isLive: false },
    { id: "master_list_gauges", title: "Master List of Gauges", formNo: "AOT-F-TM-09", frequency: "Yearly", responsibility: "Quality / Tool Room", icon: "bi-compass", color: "#ec4899", bgColor: "#fce7f3", isLive: false },
    { id: "list_welding_fixture", title: "List of Welding Fixture", formNo: "AOT-F-TM-10", frequency: "Yearly", responsibility: "Prod. / Tool Room", icon: "bi-gpu-card", color: "#0ea5e9", bgColor: "#f0f9ff", isLive: false },
];

// // 🔥 1. Initial 4 Cards for Tool Hub (Categories)
// export const toolFrequencyCards = [
//   {
//     id: "daily",
//     title: "Daily Tool Maint.",
//     icon: "bi-calendar-check",
//     color: "#10b981",
//     bgColor: "#ecfdf5",
//   },
//   {
//     id: "weekly",
//     title: "Weekly Tool Maint.",
//     icon: "bi-calendar-range",
//     color: "#3b82f6",
//     bgColor: "#eff6ff",
//   },
//   {
//     id: "monthly",
//     title: "Monthly Tool Maint.",
//     icon: "bi-calendar-month",
//     color: "#f59e0b",
//     bgColor: "#fffbeb",
//   },
//   {
//     id: "yearly",
//     title: "Yearly Tool Maint.",
//     icon: "bi-calendar-event",
//     color: "#ef4444",
//     bgColor: "#fef2f2",
//   },
// ];

// // 🔥 2. Tool Daily Forms (Used when Daily is clicked in Tool Tab)
// export const toolReports = [
//   {
//     id: "tool_history",
//     title: "Tool History Card",
//     formNo: "AOT-F-TM-01",
//     frequency: "Daily",
//     responsibility: "Tool Room Engineer",
//     icon: "bi-tools",
//     color: "#8b5cf6",
//     bgColor: "#ede9fe",
//     isLive: true,
//   },
//   {
//     id: "tool_stroke",
//     title: "Tool Stroke for PM",
//     formNo: "AOT-F-TM-02",
//     frequency: "Daily",
//     responsibility: "Tool Room Engineer",
//     icon: "bi-activity",
//     color: "#06b6d4",
//     bgColor: "#cffafe",
//     isLive: false,
//   },
//   {
//     id: "tool_pm_check",
//     title: "Tool P.M. Checklist",
//     formNo: "AOT-F-TM-04",
//     frequency: "Daily",
//     responsibility: "Tool Room Engineer",
//     icon: "bi-card-checklist",
//     color: "#10b981",
//     bgColor: "#d1fae5",
//     isLive: true,
//   },
//   {
//     id: "tool_breakdown",
//     title: "Tool Break Down Slip",
//     formNo: "AOT-F-BD-02",
//     frequency: "Daily",
//     responsibility: "Prod. Engineer",
//     icon: "bi-hammer",
//     color: "#ef4444",
//     bgColor: "#fef2f2",
//     isLive: false,
//   },
// ];

// // 🔥 3. Tool Weekly Forms (Used when Weekly is clicked in Tool Tab)
// export const weeklyToolSubReports = [
//   {
//     id: "weekly_pm_welding_fixture",
//     title: "Welding Fixture Maintenance Checklist",
//     formNo: "AOT-F-WF-01",
//     frequency: "Weekly",
//     responsibility: "Tool Room Engineer",
//     icon: "bi-tools",
//     color: "#ec4899",
//   },
// ];

// // Optional: Per Setup/Monthly specific cards (if needed)
// export const toolMaintenanceCards = [
//   {
//     id: "tool_history_setup",
//     title: "Tool History Card",
//     formNo: "TOOL/HC/01",
//     frequency: "Per Setup",
//     responsibility: "Production/QC",
//     icon: "bi-file-earmark-medical",
//     color: "#6366f1",
//     bgColor: "#eef2ff",
//   },
//   {
//     id: "tool_pm_check_monthly",
//     title: "Tool PM Checklist",
//     formNo: "TOOL/CK/03",
//     frequency: "Monthly",
//     responsibility: "Maintenance",
//     icon: "bi-check2-square",
//     color: "#10b981",
//     bgColor: "#ecfdf5",
//   }
// ];


// // 🔥 4. Tool Monthly Reports
// export const toolMonthlyReports = [
//   {
//     id: "tool_breakdown_summary",
//     title: "Tool Breakdown Summary Sheet",
//     formNo: "AOT-F-TM-05",
//     frequency: "Monthly",
//     responsibility: "Tool Room Manager",
//     icon: "bi-file-earmark-spreadsheet",
//     color: "#8b5cf6", 
//     bgColor: "#f5f3ff",
//   },
//   {
//     id: "why_tool_analysis",
//     title: "Why Tool Analysis",
//     formNo: "AOT-F-TM-06",
//     frequency: "Breakdown / Monthly",
//     responsibility: "Tool Room Engineer",
//     icon: "bi-patch-question",
//     color: "#f43f5e", 
//     bgColor: "#fff1f2",
//   },
//   {
//     id: "tool_critical_spares",
//     title: "Critical Spare Part List",
//     formNo: "AOT-F-TM-07",
//     frequency: "Monthly Review",
//     responsibility: "Store / Tool Room",
//     icon: "bi-box-seam",
//     color: "#0ea5e9", 
//     bgColor: "#f0f9ff",
//   },
// ];

// export const toolYearlyReports = [
//     { id: "master_list_tool", title: "Master List of Tool", formNo: "AOT-F-TM-08", frequency: "Yearly", responsibility: "Tool Room Head", icon: "bi-hammer", color: "#8b5cf6", bgColor: "#f5f3ff" },
//     { id: "master_list_gauges", title: "Master List of Gauges", formNo: "AOT-F-TM-09", frequency: "Yearly", responsibility: "Quality / Tool Room", icon: "bi-compass", color: "#ec4899", bgColor: "#fce7f3" },
//     { id: "list_welding_fixture", title: "List of Welding Fixture", formNo: "AOT-F-TM-10", frequency: "Yearly", responsibility: "Prod. / Tool Room", icon: "bi-gpu-card", color: "#0ea5e9", bgColor: "#f0f9ff" },
// ];
