// 🔥 1. Frequency Categories for Machine Hub
export const frequencyCards = [
    {
        id: "daily",
        title: "Daily Reports",
        icon: "bi-calendar-check",
        color: "#10b981",
        bgColor: "#ecfdf5",
        desc: "Daily logs and checksheets",
    },
    {
        id: "weekly",
        title: "Weekly Reports",
        icon: "bi-calendar-range",
        color: "#3b82f6",
        bgColor: "#eff6ff",
        desc: "Preventive maintenance",
    },
    {
        id: "monthly",
        title: "Monthly Reports",
        icon: "bi-calendar-month",
        color: "#f59e0b",
        bgColor: "#fffbeb",
        desc: "Monthly deep checks",
    },
    {
        id: "yearly",
        title: "Yearly Reports",
        icon: "bi-calendar-event",
        color: "#ef4444",
        bgColor: "#fef2f2",
        desc: "Annual audits",
    },
];

// 🔥 2. Machine Daily Forms (Shown when Daily is clicked)
export const machineDailyReports = [
    {
        id: "mc_history",
        title: "Machine History Card",
        formNo: "AOT-F-MM-02",
        frequency: "Daily",
        responsibility: "Maint engineer / Pro Engineer",
        icon: "bi-clock-history",
        color: "#3b82f6",
        bgColor: "#eff6ff",
    },
    {
        id: "power_press_check",
        title: "Daily Power Press Checklist",
        formNo: "AOT-F-MM-02.",
        frequency: "Daily",
        responsibility: "Operator",
        icon: "bi-speedometer2",
        color: "#f59e0b",
        bgColor: "#fef3c7",
    },
    {
        id: "mc_breakdown",
        title: "Machine Breakdown Slip",
        formNo: "AOT-F-BD-01",
        frequency: "Daily",
        responsibility: "Maint engineer / Pro Engineer",
        icon: "bi-exclamation-triangle",
        color: "#ef4444",
        bgColor: "#fef2f2",
    },
];

// 🔥 3. 19 Machines Data for Weekly Sub-Menu
const machinesWithColors = [
    { name: "VMM", color: "#3b82f6", bgColor: "#eff6ff" },
    { name: "Projection WELD", color: "#8b5cf6", bgColor: "#ede9fe" },
    { name: "VMC", color: "#ec4899", bgColor: "#fce7f3" },
    { name: "CNC", color: "#10b981", bgColor: "#d1fae5" },
    { name: "Power Press", color: "#f59e0b", bgColor: "#fef3c7" },
    { name: "Hydraulic MIG", color: "#ef4444", bgColor: "#fef2f2" },
    { name: "TIG", color: "#06b6d4", bgColor: "#cffafe" },
    { name: "Spot Welding", color: "#6366f1", bgColor: "#e0e7ff" },
    { name: "Compressor", color: "#14b8a6", bgColor: "#ccfbf1" },
    { name: "Lathe", color: "#f43f5e", bgColor: "#ffe4e6" },
    { name: "Drill Machine", color: "#84cc16", bgColor: "#ecfccb" },
    { name: "Surface Grinder", color: "#d946ef", bgColor: "#fae8ff" },
    { name: "Belt Grinder", color: "#0ea5e9", bgColor: "#e0f2fe" },
    { name: "Base Grinder", color: "#f97316", bgColor: "#ffedd5" },
    { name: "Tapping Machine", color: "#eab308", bgColor: "#fef9c3" },
    { name: "Pipe Cutter", color: "#64748b", bgColor: "#f1f5f9" },
    { name: "Vibra", color: "#1d4ed8", bgColor: "#dbeafe" },
    { name: "DIP Molding", color: "#be185d", bgColor: "#fce7f3" },
    { name: "Servo Press", color: "#047857", bgColor: "#d1fae5" },
];

export const weeklyMachineSubReports = machinesWithColors.map((m) => ({
    id: `weekly_pm_${m.name.replace(/\s+/g, "_").toLowerCase()}`,
    title: `${m.name} Weekly Maint.`,
    formNo: "AOT-F-PM-01",
    frequency: "Weekly",
    responsibility: "Maintenance Team",
    icon: "bi-gear-fill",
    color: m.color,
    bgColor: m.bgColor,
}));