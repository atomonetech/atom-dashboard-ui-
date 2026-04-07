// src/components/All_Deperments_Hub/MaintenanceHub/data/ToolMachineData.js

// 🔥 TOOL FREQUENCY CARDS (Hub Page ke liye)
export const toolFrequencyCards = [
    { id: 'tool_daily', title: 'Daily Tool Maint.', formNo: 'Daily Tool Check', frequency: 'Daily', responsibility: 'Tool Room / Prod', icon: 'bi-calendar-day', color: '#3b82f6', bgColor: '#eff6ff' },
    { id: 'tool_weekly', title: 'Weekly Tool Maint.', formNo: 'Weekly PM', frequency: 'Weekly', responsibility: 'Maint. Team', icon: 'bi-calendar-week', color: '#10b981', bgColor: '#d1fae5' },
    { id: 'tool_monthly', title: 'Monthly Tool Maint.', formNo: 'Monthly PM', frequency: 'Monthly', responsibility: 'Maint. Team', icon: 'bi-calendar-month', color: '#8b5cf6', bgColor: '#ede9fe' },
    { id: 'tool_yearly', title: 'Yearly Tool Maint.', formNo: 'Yearly PM', frequency: 'Yearly', responsibility: 'Maint. Team', icon: 'bi-calendar3', color: '#f59e0b', bgColor: '#fef3c7' }
];

// 🔥 TOOL DAILY REPORTS (Daily Page ke liye - Aapke bataye hue 4 cards)
export const toolDailyReports = [
    { 
        id: 'tool_history', 
        title: 'Tool History Card', 
        formNo: 'AOT-F-TM-01', 
        frequency: 'Daily', 
        responsibility: 'Tool Room Engineer', 
        icon: 'bi-file-earmark-medical', 
        color: '#6366f1', 
        bgColor: '#eef2ff' 
    },
    { 
        id: 'tool_stroke', 
        title: 'Tool Stroke for PM', 
        formNo: 'AOT-F-TM-02', 
        frequency: 'Daily', 
        responsibility: 'Tool Room Engineer', 
        icon: 'bi-activity', 
        color: '#ec4899', 
        bgColor: '#fdf2f8' 
    },
    { 
        id: 'tool_pm_check', 
        title: 'Tool P.M. Checklist', 
        formNo: 'AOT-F-TM-04', 
        frequency: 'Daily', 
        responsibility: 'Tool Room Engineer', 
        icon: 'bi-check2-square', 
        color: '#10b981', 
        bgColor: '#ecfdf5' 
    },
    { 
        id: 'tool_breakdown', 
        title: 'Tool Break Down Slip', 
        formNo: 'AOT-F-BD-02', 
        frequency: 'Daily', 
        responsibility: 'Prod. Engineer', 
        icon: 'bi-exclamation-triangle', 
        color: '#f43f5e', 
        bgColor: '#fff1f2' 
    }
];

// src/components/All_Deperments_Hub/MaintenanceHub/data/ToolMachineData.js

export const toolWeeklyReports = [
    { 
        id: 'weekly_welding_fixture', 
        title: 'Welding Fixture Maint.', 
        formNo: 'AOT-F-TM-10', 
        frequency: 'Weekly', 
        responsibility: 'Maintenance Team', 
        icon: 'bi-tools', 
        color: '#10b981', 
        bgColor: '#d1fae5' 
    }
];