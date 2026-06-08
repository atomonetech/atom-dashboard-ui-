// ==========================================
// machineData.js - Fully Updated & Cleaned
// ==========================================

// 1. Frequency Categories for Machine Hub
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

// 2. Machine Daily Forms
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
        isLive: true,
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
        isLive: true,
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
        isLive: true,
    },
    // ✅ Poka-Yoke fixed for proper routing
    { 
        id: "Poka-Yoke", 
        title: "Daily Poka Yokes Check", 
        formNo: "AOT/F/QC/07A", 
        frequency: "Daily",
        responsibility: "Operator", 
        icon: "bi-shield-check", 
        color: "#10b981", 
        bgColor: "#d1fae5", 
        fillRoute: "Poka-Yoke", 
        printKey: "PokaYoke-report", 
        viewKey: "pokayoke-view", 
        isLive: true 
    },
];

// 3. Machines Data for Weekly Sub-Menu

const machinesWithColors = [
    { id: "vmm", name: "VMM", color: "#3b82f6", bgColor: "#eff6ff" },
    { id: "projection_weld", name: "Projection WELD", color: "#8b5cf6", bgColor: "#ede9fe" },
    { id: "vmc", name: "VMC", color: "#ec4899", bgColor: "#fce7f3" },
    { id: "cnc", name: "CNC", color: "#10b981", bgColor: "#d1fae5" },
    { id: "power_press", name: "Power Press", color: "#f59e0b", bgColor: "#fef3c7" },
    { id: "hydraulic_mig", name: "Hydraulic MIG", color: "#ef4444", bgColor: "#fef2f2" },
    { id: "tig_welding", name: "TIG", color: "#06b6d4", bgColor: "#cffafe" },
    { id: "spot_welding", name: "Spot Welding", color: "#6366f1", bgColor: "#e0e7ff" },
    { id: "compressor", name: "Compressor", color: "#14b8a6", bgColor: "#ccfbf1" },
    { id: "lathe_machine", name: "Lathe", color: "#f43f5e", bgColor: "#ffe4e6" },
    { id: "vertical_drill", name: "Drill Machine", color: "#84cc16", bgColor: "#ecfccb" },
    { id: "surface_grinder", name: "Surface Grinder", color: "#d946ef", bgColor: "#fae8ff" },
    { id: "belt_grinder", name: "Belt Grinder", color: "#0ea5e9", bgColor: "#e0f2fe" },
    { id: "base_grinder", name: "Base Grinder", color: "#f97316", bgColor: "#ffedd5" },
    // { id: "tapping_machine", name: "Tapping Machine", color: "#eab308", bgColor: "#fef9c3" }, // ✅ Tumhari request: Tapping Machine nikalna nahi hai
    { id: "pipe_cutting", name: "Pipe Cutter", color: "#64748b", bgColor: "#f1f5f9" },
    { id: "vibra", name: "Vibra", color: "#1d4ed8", bgColor: "#dbeafe" },
    { id: "dip_molding", name: "DIP Molding", color: "#be185d", bgColor: "#fce7f3" },
    { id: "servo_press", name: "Servo Press", color: "#047857", bgColor: "#d1fae5" },
];

export const weeklyMachineSubReports = machinesWithColors.map((m) => {
    // 🔥 Puraana '.replace()' wala logic hata diya, ab direct custom 'id' jayega jo backend se match hai
    const idString = m.id; 

    // Tumhara live status condition maine naye IDs ke hisaab se update kar diya hai
    const liveStatus = [
        'cnc', 'vmc', 'power_press', 'dip_molding', 'servo_press', 
        'hydraulic_mig', 'pipe_cutting', 'compressor', 'spot_welding', 
        'tig_welding', 'projection_weld', 'vmm', 'lathe_machine', 
        'vertical_drill', 'surface_grinder', 'belt_grinder', 
        'base_grinder', 'tapping_machine', 'vibra'
    ].includes(idString);

    return {
        id: idString,
        title: `${m.name} Weekly Maint.`,
        formNo: "AOT-F-PM-01",
        frequency: "Weekly",
        responsibility: "Maintenance Team",
        icon: "bi-gear-fill",
        color: m.color,
        bgColor: m.bgColor,
        isLive: liveStatus,
    };
});

// 4. Machine Monthly Reports
export const machineMonthlyReports = [
    {
        id: "mc_breakdown_summary",
        title: "M/c Breakdown Summary Sheet",
        formNo: "AOT-F-MM-05",
        frequency: "Monthly",
        responsibility: "Maintenance Manager",
        icon: "bi-file-earmark-bar-graph",
        color: "#8b5cf6",
        bgColor: "#f5f3ff",
        isLive: false,
    },
    {
        id: "why_why_analysis",
        title: "Why Why Analysis",
        formNo: "AOT-F-MM-06",
        frequency: "Monthly / Breakdown",
        responsibility: "Maint Engineer / HOD",
        icon: "bi-question-diamond",
        color: "#f43f5e",
        bgColor: "#fff1f2",
        isLive: false,
    },
    {
        id: "critical_spares",
        title: "Critical Spares Part List",
        formNo: "AOT-F-MM-07",
        frequency: "Monthly Review",
        responsibility: "Store / Maintenance",
        icon: "bi-tools",
        color: "#0ea5e9",
        bgColor: "#f0f9ff",
        isLive: true,
    },
];

// 5. Machine Yearly Reports
export const machineYearlyReports = [
    { 
        id: "master_list_mc", 
        title: "Master List of Machine", 
        formNo: "AOT-F-MM-08", 
        frequency: "Yearly", 
        responsibility: "Maint. Head", 
        icon: "bi-list-check", 
        color: "#6366f1", 
        bgColor: "#eef2ff", 
        isLive: false 
    },
    { 
        id: "annual_preventive_plan", 
        title: "Annual Preventive Maintenance Plan", 
        formNo: "AOT-F-MM-09", 
        frequency: "Annual", 
        responsibility: "Maint. Engineer", 
        icon: "bi-calendar3", 
        color: "#10b981", 
        bgColor: "#ecfdf5", 
        isLive: false 
    },
    { 
        id: "mc_overhauling_list", 
        title: "List of Machine for Overhauling", 
        formNo: "AOT-F-MM-10", 
        frequency: "Yearly", 
        responsibility: "HOD Maint.", 
        icon: "bi-wrench-adjustable-circle", 
        color: "#f59e0b", 
        bgColor: "#fffbeb", 
        isLive: false 
    },
    { 
        id: "annual_overhauling_plan", 
        title: "Annual Overhauling Plan", 
        formNo: "AOT-F-MM-11", 
        frequency: "Annual", 
        responsibility: "Maint. Head", 
        icon: "bi-clipboard-data", 
        color: "#ef4444", 
        bgColor: "#fef2f2", 
        isLive: false 
    },
];