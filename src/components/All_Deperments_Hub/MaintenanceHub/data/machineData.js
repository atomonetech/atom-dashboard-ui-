// src/components/All_Deperments_Hub/MaintenanceHub/data/machineData.js

export const frequencyCards = [
    { id: 'daily', title: 'Daily Maintenance', formNo: 'Daily Routines', frequency: 'Daily', responsibility: 'Various', icon: 'bi-calendar-day', color: '#3b82f6', bgColor: '#eff6ff' },
    { id: 'weekly', title: 'Weekly Maintenance', formNo: 'Weekly PM', frequency: 'Weekly', responsibility: 'Maint. Team', icon: 'bi-calendar-week', color: '#10b981', bgColor: '#d1fae5' },
    { id: 'monthly', title: 'Monthly Maintenance', formNo: 'Monthly PM', frequency: 'Monthly', responsibility: 'Maint. Team', icon: 'bi-calendar-month', color: '#8b5cf6', bgColor: '#ede9fe' },
    { id: 'Yearly', title: 'Yearly Maintenance', formNo: 'Yearly PM', frequency: 'yearly', responsibility: 'Maint. Team', icon: 'bi-calendar3', color: '#f59e0b', bgColor: '#fef3c7' }
];

export const machineDailyReports = [
    { id: 'mc_history', title: 'Machine History Card', formNo: 'AOT-F-MM-02', frequency: 'Daily', responsibility: 'Maint engineer / Pro Engineer', icon: 'bi-clock-history', color: '#3b82f6', bgColor: '#eff6ff' },
    { id: 'power_press_check', title: 'Daily Power Press Checklist', formNo: 'AOT-F-MM-02.', frequency: 'Daily', responsibility: 'Operator', icon: 'bi-speedometer2', color: '#f59e0b', bgColor: '#fef3c7' },
    { id: 'mc_breakdown', title: 'Machine Breakdown Slip', formNo: 'AOT-F-BD-01', frequency: 'Daily', responsibility: 'Maint engineer / Pro Engineer', icon: 'bi-exclamation-triangle', color: '#ef4444', bgColor: '#fef2f2' }
];

// 🔥 19 Machines with Unique Color Themes
const machinesWithColors = [
    { name: 'VMM', color: '#3b82f6', bgColor: '#eff6ff', icon: 'bi-aspect-ratio' },             
    { name: 'Projection WELD', color: '#8b5cf6', bgColor: '#ede9fe', icon: 'bi-lightning-charge-fill' }, 
    { name: 'VMC', color: '#ec4899', bgColor: '#fce7f3', icon: 'bi-cpu-fill' },             
    { name: 'CNC', color: '#10b981', bgColor: '#d1fae5', icon: 'bi-motherboard-fill' },             
    { name: 'PowerPress', color: '#f59e0b', bgColor: '#fef3c7', icon: 'bi-arrow-down-square-fill' },     
    { name: 'Hydraulic MIG', color: '#ef4444', bgColor: '#fef2f2', icon: 'bi-fire' },   
    { name: 'TIG', color: '#06b6d4', bgColor: '#cffafe', icon: 'bi-magic' },             
    { name: 'Spot Welding', color: '#6366f1', bgColor: '#e0e7ff', icon: 'bi-node-plus-fill' },    
    { name: 'Compressor', color: '#14b8a6', bgColor: '#ccfbf1', icon: 'bi-wind' },      
    { name: 'Lathe', color: '#f43f5e', bgColor: '#ffe4e6', icon: 'bi-arrow-repeat' },           
    { name: 'Drill Machine', color: '#84cc16', bgColor: '#ecfccb', icon: 'bi-crosshair' },   
    { name: 'Surface Grinder', color: '#d946ef', bgColor: '#fae8ff', icon: 'bi-layers-fill' }, 
    { name: 'Belt Grinder', color: '#0ea5e9', bgColor: '#e0f2fe', icon: 'bi-vinyl-fill' },    
    { name: 'Base Grinder', color: '#f97316', bgColor: '#ffedd5', icon: 'bi-disc-fill' },    
    { name: 'Tapping Machine', color: '#eab308', bgColor: '#fef9c3', icon: 'bi-nut-fill' }, 
    { name: 'Pipe Cutter', color: '#64748b', bgColor: '#f1f5f9', icon: 'bi-scissors' },     
    { name: 'Vibra', color: '#1d4ed8', bgColor: '#dbeafe', icon: 'bi-phone-vibrate-fill' },           
    { name: 'DIP Molding', color: '#be185d', bgColor: '#fce7f3', icon: 'bi-droplet-half' },     
    { name: 'Servo Press', color: '#047857', bgColor: '#d1fae5', icon: 'bi-chevron-double-down' }      
];

// 🔥 Directly generate the 19 cards as the primary Weekly Reports
export const machineWeeklyReports = machinesWithColors.map((m) => ({
    id: `weekly_pm_${m.name.replace(/\s+/g, '_').toLowerCase()}`, 
    title: `${m.name} Weekly Maint.`,
    formNo: 'AOT-F-PM-01', 
    frequency: 'Weekly',
    responsibility: 'Maintenance Team',
    icon: 'bi-gear-fill',
    color: m.color, 
    bgColor: m.bgColor
}));

export const toolReports = [
    { id: 'tool_history', title: 'Tool History Card', formNo: 'AOT-F-TM-01', frequency: 'Daily', responsibility: 'Tool Room Engineer', icon: 'bi-tools', color: '#8b5cf6', bgColor: '#ede9fe' },
    { id: 'tool_stroke', title: 'Tool Stroke for PM', formNo: 'AOT-F-TM-02', frequency: 'Daily', responsibility: 'Tool Room Engineer', icon: 'bi-activity', color: '#06b6d4', bgColor: '#cffafe' },
    { id: 'tool_pm_check', title: 'Tool P.M. Checklist', formNo: 'AOT-F-TM-04', frequency: 'Daily', responsibility: 'Tool Room Engineer', icon: 'bi-card-checklist', color: '#10b981', bgColor: '#d1fae5' },
    { id: 'tool_breakdown', title: 'Tool Break Down Slip', formNo: 'AOT-F-BD-02', frequency: 'Daily', responsibility: 'Prod. Engineer', icon: 'bi-hammer', color: '#ef4444', bgColor: '#fef2f2' }
];