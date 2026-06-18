import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// ==========================================
// 1. MAIN CONFIGURATION (Colors, Icons, Categories)
// ==========================================
const MAINT_CONFIG = {
    // ---------------- MACHINE DAILY ----------------
    'mc_history':                { label: 'Machine History Card',        color: '#3b82f6', bg: '#eff6ff', icon: 'bi-clock-history',      formNo: 'AOT-F-MM-02',  category: 'machine', freq: 'daily' },
    'power_press_check':         { label: 'Power Press Checksheet',      color: '#f59e0b', bg: '#fef3c7', icon: 'bi-speedometer2',       formNo: 'AOT-F-MM-02.', category: 'machine', freq: 'daily' },
    'mc_breakdown':              { label: 'Machine Breakdown Slip',      color: '#ef4444', bg: '#fef2f2', icon: 'bi-exclamation-triangle',formNo: 'AOT-F-BD-01', category: 'machine', freq: 'daily' },
    'pokayoke-view':             { label: 'Poka Yoke Monitoring',        color: '#10b981', bg: '#d1fae5', icon: 'bi-shield-check',       formNo: 'AOT/F/QC/07A', category: 'machine', freq: 'daily' },
    'Poka-Yoke':                 { label: 'Poka Yoke Monitoring',        color: '#10b981', bg: '#d1fae5', icon: 'bi-shield-check',       formNo: 'AOT/F/QC/07A', category: 'machine', freq: 'daily' },

    // ---------------- TOOL DAILY ----------------
    'tool_history':              { label: 'Tool History Card',           color: '#8b5cf6', bg: '#ede9fe', icon: 'bi-tools',              formNo: 'AOT-F-TM-01',  category: 'tool',    freq: 'daily' },
    'tool_stroke':               { label: 'Tool Stroke for PM',          color: '#06b6d4', bg: '#cffafe', icon: 'bi-activity',           formNo: 'AOT-F-TM-02',  category: 'tool',    freq: 'daily' },
    'tool_pm_check':             { label: 'Tool P.M. Checklist',         color: '#10b981', bg: '#d1fae5', icon: 'bi-card-checklist',     formNo: 'AOT-F-TM-04',  category: 'tool',    freq: 'daily' },
    'tool_breakdown_slip':       { label: 'Tool Break Down Slip',        color: '#ef4444', bg: '#fef2f2', icon: 'bi-hammer',             formNo: 'AOT-F-BD-02',  category: 'tool',    freq: 'daily' },

    // ---------------- MACHINE WEEKLY ----------------
    'vmm':                       { label: 'VMM Maintenance',             color: '#3b82f6', bg: '#eff6ff', icon: 'bi-gear-fill',          formNo: 'AOT-F-PM-01',  category: 'machine', freq: 'weekly' },
    'projection_weld':           { label: 'Projection WELD Maintenance', color: '#8b5cf6', bg: '#ede9fe', icon: 'bi-gear-fill',          formNo: 'AOT-F-PM-01',  category: 'machine', freq: 'weekly' },
    'vmc':                       { label: 'VMC Maintenance',             color: '#ec4899', bg: '#fce7f3', icon: 'bi-gear-fill',          formNo: 'AOT-F-PM-01',  category: 'machine', freq: 'weekly' },
    'cnc':                       { label: 'CNC Maintenance',             color: '#10b981', bg: '#d1fae5', icon: 'bi-gear-fill',          formNo: 'AOT-F-PM-01',  category: 'machine', freq: 'weekly' },
    'power_press':               { label: 'Power Press Maintenance',     color: '#f59e0b', bg: '#fef3c7', icon: 'bi-gear-fill',          formNo: 'AOT-F-PM-01',  category: 'machine', freq: 'weekly' },
    'hydraulic_mig':             { label: 'Hydraulic MIG Maintenance',   color: '#ef4444', bg: '#fef2f2', icon: 'bi-gear-fill',          formNo: 'AOT-F-PM-01',  category: 'machine', freq: 'weekly' },
    'tig_welding':               { label: 'TIG Welding Maintenance',     color: '#06b6d4', bg: '#cffafe', icon: 'bi-gear-fill',          formNo: 'AOT-F-PM-01',  category: 'machine', freq: 'weekly' },
    'spot_welding':              { label: 'Spot Welding Maintenance',    color: '#6366f1', bg: '#e0e7ff', icon: 'bi-gear-fill',          formNo: 'AOT-F-PM-01',  category: 'machine', freq: 'weekly' },
    'compressor':                { label: 'Compressor Maintenance',      color: '#14b8a6', bg: '#ccfbf1', icon: 'bi-gear-fill',          formNo: 'AOT-F-PM-01',  category: 'machine', freq: 'weekly' },
    'lathe_machine':             { label: 'Lathe Machine Maintenance',   color: '#f43f5e', bg: '#ffe4e6', icon: 'bi-gear-fill',          formNo: 'AOT-F-PM-01',  category: 'machine', freq: 'weekly' },
    'vertical_drill':            { label: 'Drill Machine Maintenance',   color: '#84cc16', bg: '#ecfccb', icon: 'bi-gear-fill',          formNo: 'AOT-F-PM-01',  category: 'machine', freq: 'weekly' },
    'surface_grinder':           { label: 'Surface Grinder Maintenance', color: '#d946ef', bg: '#fae8ff', icon: 'bi-gear-fill',          formNo: 'AOT-F-PM-01',  category: 'machine', freq: 'weekly' },
    'belt_grinder':              { label: 'Belt Grinder Maintenance',    color: '#0ea5e9', bg: '#e0f2fe', icon: 'bi-gear-fill',          formNo: 'AOT-F-PM-01',  category: 'machine', freq: 'weekly' },
    'base_grinder':              { label: 'Base Grinder Maintenance',    color: '#f97316', bg: '#ffedd5', icon: 'bi-gear-fill',          formNo: 'AOT-F-PM-01',  category: 'machine', freq: 'weekly' },
    'tapping_machine':           { label: 'Tapping Machine Maintenance', color: '#eab308', bg: '#fef9c3', icon: 'bi-gear-fill',          formNo: 'AOT-F-PM-01',  category: 'machine', freq: 'weekly' },
    'pipe_cutting':              { label: 'Pipe Cutter Maintenance',     color: '#64748b', bg: '#f1f5f9', icon: 'bi-gear-fill',          formNo: 'AOT-F-PM-01',  category: 'machine', freq: 'weekly' },
    'vibra':                     { label: 'Vibra Maintenance',           color: '#1d4ed8', bg: '#dbeafe', icon: 'bi-gear-fill',          formNo: 'AOT-F-PM-01',  category: 'machine', freq: 'weekly' },
    'dip_molding':               { label: 'DIP Molding Maintenance',     color: '#be185d', bg: '#fce7f3', icon: 'bi-gear-fill',          formNo: 'AOT-F-PM-01',  category: 'machine', freq: 'weekly' },
    'servo_press':               { label: 'Servo Press Maintenance',     color: '#047857', bg: '#d1fae5', icon: 'bi-gear-fill',          formNo: 'AOT-F-PM-01',  category: 'machine', freq: 'weekly' },

    // ---------------- TOOL WEEKLY ----------------
    'weekly_pm_welding_fixture': { label: 'Welding Fixture Maintenance Checklist',   color: '#ec4899', bg: '#fce7f3', icon: 'bi-tools',              formNo: 'AOT-F-WF-01',  category: 'tool',    freq: 'weekly' },

    // ---------------- MACHINE MONTHLY ----------------
    'mc_breakdown_summary':      { label: 'M/c Breakdown Summary',       color: '#8b5cf6', bg: '#f5f3ff', icon: 'bi-file-earmark-bar-graph', formNo: 'AOT-F-MM-05', category: 'machine', freq: 'monthly' },
    'why_why_analysis':          { label: 'Why-Why Analysis',            color: '#f43f5e', bg: '#fff1f2', icon: 'bi-question-diamond',   formNo: 'AOT-F-MM-06',  category: 'machine', freq: 'monthly' },
    'critical_spares':           { label: 'Critical Spares Part List',   color: '#0ea5e9', bg: '#f0f9ff', icon: 'bi-tools',              formNo: 'AOT-F-MM-07',  category: 'machine', freq: 'monthly' },

    // ---------------- TOOL MONTHLY ----------------
    'tool_breakdown_summary':    { label: 'Tool Breakdown Summary',      color: '#8b5cf6', bg: '#f5f3ff', icon: 'bi-file-earmark-spreadsheet', formNo: 'AOT-F-TM-05', category: 'tool', freq: 'monthly' },
    'why_tool_analysis':         { label: 'Why Tool Analysis',           color: '#f43f5e', bg: '#fff1f2', icon: 'bi-patch-question',     formNo: 'AOT-F-TM-06',  category: 'tool',    freq: 'monthly' },
    'tool_critical_spares':      { label: 'Critical Spare Part List',    color: '#0ea5e9', bg: '#f0f9ff', icon: 'bi-box-seam',           formNo: 'AOT-F-TM-07',  category: 'tool',    freq: 'monthly' },

    // ---------------- MACHINE YEARLY ----------------
    'master_list_mc':            { label: 'Master List of Machine',      color: '#6366f1', bg: '#eef2ff', icon: 'bi-list-check',         formNo: 'AOT-F-MM-08',  category: 'machine', freq: 'yearly' },
    'annual_preventive_plan':    { label: 'Annual Preventive Plan',      color: '#10b981', bg: '#ecfdf5', icon: 'bi-calendar3',          formNo: 'AOT-F-MM-09',  category: 'machine', freq: 'yearly' },
    'mc_overhauling_list':       { label: 'Machine Overhauling List',    color: '#f59e0b', bg: '#fffbeb', icon: 'bi-wrench-adjustable-circle', formNo: 'AOT-F-MM-10', category: 'machine', freq: 'yearly' },
    'annual_overhauling_plan':   { label: 'Annual Overhauling Plan',     color: '#ef4444', bg: '#fef2f2', icon: 'bi-clipboard-data',     formNo: 'AOT-F-MM-11',  category: 'machine', freq: 'yearly' },

    // ---------------- TOOL YEARLY ----------------
    'master_list_tool':          { label: 'Master List of Tool',         color: '#8b5cf6', bg: '#f5f3ff', icon: 'bi-hammer',             formNo: 'AOT-F-TM-08',  category: 'tool',    freq: 'yearly' },
    'master_list_gauges':        { label: 'Master List of Gauges',       color: '#ec4899', bg: '#fce7f3', icon: 'bi-compass',            formNo: 'AOT-F-TM-09',  category: 'tool',    freq: 'yearly' },
    'list_welding_fixture':      { label: 'List of Welding Fixture',     color: '#0ea5e9', bg: '#f0f9ff', icon: 'bi-gpu-card',           formNo: 'AOT-F-TM-10',  category: 'tool',    freq: 'yearly' },
};

// ==========================================
// 2. MASTER COLUMNS CONFIGURATION (Table Main View)
// ==========================================
const MAINT_MASTER_COLS_CONFIG = {
    // ---------------- MACHINE DAILY ----------------
    'mc_history':                ['Machine No.', 'Machine Name'],
    'power_press_check':         ['Date', 'Machine No', 'Shift'],
    'mc_breakdown':              ['Given Date', 'Machine Name & No.'],
    'pokayoke-view':             ['Date', 'Machine No', 'Plant'],
    'Poka-Yoke':                 ['Date', 'Machine No', 'Plant'],

    // ---------------- TOOL DAILY ----------------
    'tool_history':              ['Date', 'Tool Name', 'Part Name & No'],
    'tool_stroke':               ['Date', 'Tool No'],
    'tool_pm_check':             ['Date', 'Tool Name', 'Part Name', 'Part No.'],
    'tool_breakdown_slip':       ['Report Date', 'Machine Name & No.'],

    // ---------------- MACHINE WEEKLY ----------------
    'vmm':                       ['Date', 'Machine Name', 'Machine No'],
    'projection_weld':           ['Date', 'Machine Name', 'Machine No'],
    'vmc':                       ['Date', 'Machine Name', 'Machine No'],
    'cnc':                       ['Date', 'Machine Name', 'Machine No'],
    'power_press':               ['Date', 'Machine Name', 'Machine No'],
    'hydraulic_mig':             ['Date', 'Machine Name', 'Machine No'],
    'tig_welding':               ['Date', 'Machine Name', 'Machine No'],
    'spot_welding':              ['Date', 'Machine Name', 'Machine No'],
    'compressor':                ['Date', 'Machine Name', 'Machine No'],
    'lathe_machine':             ['Date', 'Machine Name', 'Machine No'],
    'vertical_drill':            ['Date', 'Machine Name', 'Machine No'],
    'surface_grinder':           ['Date', 'Machine Name', 'Machine No'],
    'belt_grinder':              ['Date', 'Machine Name', 'Machine No'],
    'base_grinder':              ['Date', 'Machine Name', 'Machine No'],
    'tapping_machine':           ['Date', 'Machine Name', 'Machine No'],
    'pipe_cutting':              ['Date', 'Machine Name', 'Machine No'],
    'vibra':                     ['Date', 'Machine Name', 'Machine No'],
    'dip_molding':               ['Date', 'Machine Name', 'Machine No'],
    'servo_press':               ['Date', 'Machine Name', 'Machine No'],

    // ---------------- TOOL WEEKLY ----------------
    'weekly_pm_welding_fixture': ['Date','Part Name','Part No'],

    // ---------------- MACHINE MONTHLY ----------------
    'mc_breakdown_summary':      ['Date', 'Machine Type & No.'],
    'why_why_analysis':          ['Date', 'Machine No'],
    'critical_spares':           ['Date', 'Spare Description'],

    // ---------------- TOOL MONTHLY ----------------
    'tool_breakdown_summary':    ['Date', 'Tool Name'],
    'why_tool_analysis':         ['Date', 'Tool No'],
    'tool_critical_spares':      ['Date', 'Spare Description'],

    // ---------------- MACHINE YEARLY ----------------
    'master_list_mc':            ['Machine No', 'Machine Name'],
    'annual_preventive_plan':    ['Plan Year', 'Machine No', 'Machine Name'],
    'mc_overhauling_list':       ['Year', 'Machine No', 'Machine Name'],
    'annual_overhauling_plan':   ['Plan Year', 'Machine No', 'Machine Name'],

    // ---------------- TOOL YEARLY ----------------
    'master_list_tool':          ['Tool No', 'Tool Name'],
    'master_list_gauges':        ['Gauge No', 'Gauge Name'],
    'list_welding_fixture':      ['Fixture No', 'Fixture Name'],
};

// ==========================================
// 3. MODAL HEADER COLUMNS CONFIGURATION (Popup Header Details)
// ==========================================
const MAINT_MODAL_HEADER_COLS_CONFIG = {
    // ---------------- MACHINE DAILY ----------------
    'mc_history':                ['Machine No.', 'Machine Name', 'Location', 'Machine Specs', 'Prepared By', 'Approved By'],
    'power_press_check':         ['Date', 'Machine No', 'Shift', 'Plant', 'Operator Name'],
    'mc_breakdown':              ['Given Date', 'Machine Name & No.', 'Given Time', 'Breakdown Name', 'Quality Status'],
    'pokayoke-view':             ['Date', 'Machine No', 'Plant', 'Checked By', 'Verified By'],
    'Poka-Yoke':                 ['Date', 'Machine No', 'Plant', 'Checked By', 'Verified By'],

    // ---------------- TOOL DAILY ----------------
    'tool_history':              ['Date', 'Tool Name', 'Part Name & No', 'Customer'],
    'tool_stroke':               ['Date', 'Tool No', 'Stroke Count', 'Remarks'],
    'tool_pm_check':             ['Date', 'Tool Name', 'Part Name', 'Part No.', 'Op No.', 'Maint. Person'],
    'tool_breakdown_slip':       ['Report Date', 'Machine Name & No.', 'Reporter Name', 'Prod Supervisor', 'Maint Incharge'],

    // ---------------- MACHINE WEEKLY ----------------
    'vmm':                       ['Date', 'Machine No', 'Machine Name', 'Location', 'Specification', 'Maint. Personnel', 'Prepared By', 'Checked By'],
    'projection_weld':           ['Date', 'Machine No', 'Machine Name', 'Location', 'Specification', 'Maint. Personnel', 'Prepared By', 'Checked By'],
    'vmc':                       ['Date', 'Machine No', 'Machine Name', 'Location', 'Specification', 'Maint. Personnel', 'Prepared By', 'Checked By'],
    'cnc':                       ['Date', 'Machine No', 'Machine Name', 'Location', 'Specification', 'Maint. Personnel', 'Prepared By', 'Checked By'],
    'power_press':               ['Date', 'Machine No', 'Machine Name', 'Location', 'Specification', 'Maint. Personnel', 'Prepared By', 'Checked By'],
    'hydraulic_mig':             ['Date', 'Machine No', 'Machine Name', 'Location', 'Specification', 'Maint. Personnel', 'Prepared By', 'Checked By'],
    'tig_welding':               ['Date', 'Machine No', 'Machine Name', 'Location', 'Specification', 'Maint. Personnel', 'Prepared By', 'Checked By'],
    'spot_welding':              ['Date', 'Machine No', 'Machine Name', 'Location', 'Specification', 'Maint. Personnel', 'Prepared By', 'Checked By'],
    'compressor':                ['Date', 'Machine No', 'Machine Name', 'Location', 'Specification', 'Maint. Personnel', 'Prepared By', 'Checked By'],
    'lathe_machine':             ['Date', 'Machine No', 'Machine Name', 'Location', 'Specification', 'Maint. Personnel', 'Prepared By', 'Checked By'],
    'vertical_drill':            ['Date', 'Machine No', 'Machine Name', 'Location', 'Specification', 'Maint. Personnel', 'Prepared By', 'Checked By'],
    'surface_grinder':           ['Date', 'Machine No', 'Machine Name', 'Location', 'Specification', 'Maint. Personnel', 'Prepared By', 'Checked By'],
    'belt_grinder':              ['Date', 'Machine No', 'Machine Name', 'Location', 'Specification', 'Maint. Personnel', 'Prepared By', 'Checked By'],
    'base_grinder':              ['Date', 'Machine No', 'Machine Name', 'Location', 'Specification', 'Maint. Personnel', 'Prepared By', 'Checked By'],
    'tapping_machine':           ['Date', 'Machine No', 'Machine Name', 'Location', 'Specification', 'Maint. Personnel', 'Prepared By', 'Checked By'],
    'pipe_cutting':              ['Date', 'Machine No', 'Machine Name', 'Location', 'Specification', 'Maint. Personnel', 'Prepared By', 'Checked By'],
    'vibra':                     ['Date', 'Machine No', 'Machine Name', 'Location', 'Specification', 'Maint. Personnel', 'Prepared By', 'Checked By'],
    'dip_molding':               ['Date', 'Machine No', 'Machine Name', 'Location', 'Specification', 'Maint. Personnel', 'Prepared By', 'Checked By'],
    'servo_press':               ['Date', 'Machine No', 'Machine Name', 'Location', 'Specification', 'Maint. Personnel', 'Prepared By', 'Checked By'],

    // ---------------- TOOL WEEKLY ----------------
    'weekly_pm_welding_fixture': ['Date','Part Name','Part No', 'Fixture No', 'Operation','Inspected By'],

    // ---------------- MACHINE MONTHLY ----------------
    'mc_breakdown_summary':      ['Date', 'Machine Type & No.', 'Time Period', 'Status'],
    'why_why_analysis':          ['Date', 'Machine No', 'Problem Name', 'Prepared By'],
    'critical_spares':           ['Date', 'Spare Description', 'Model / Box No.', 'Location', 'Prepared By', 'Approved By'],

    // ---------------- TOOL MONTHLY ----------------
    'tool_breakdown_summary':    ['Date', 'Tool Name', 'Process Name', 'Total Time', 'Checked By'],
    'why_tool_analysis':         ['Date', 'Tool No', 'Problem Name', 'Prepared By'],
    'tool_critical_spares':      ['Date', 'Spare Description', 'Model / Box No.', 'Location', 'Spare Type'],

    // ---------------- MACHINE YEARLY ----------------
    'master_list_mc':            ['Machine No', 'Machine Name', 'Location', 'Specification', 'Installation Date'],
    'annual_preventive_plan':    ['Plan Year', 'Machine No', 'Machine Name', 'Prepared By', 'Approved By'],
    'mc_overhauling_list':       ['Year', 'Machine No', 'Machine Name', 'Location', 'Prepared By'],
    'annual_overhauling_plan':   ['Plan Year', 'Machine No', 'Machine Name', 'Prepared By', 'Approved By'],

    // ---------------- TOOL YEARLY ----------------
    'master_list_tool':          ['Tool No', 'Tool Name', 'Part Name', 'Location', 'Customer'],
    'master_list_gauges':        ['Gauge No', 'Gauge Name', 'Location', 'Calibration Date'],
    'list_welding_fixture':      ['Fixture No', 'Fixture Name', 'Location', 'Customer'],
};

// Grouping Function
function groupRows(rows, masterCols, headerCols, detailCols) {
    const seen = new Map();
    rows.forEach(row => {
        const key = headerCols.map(c => row[c] ?? '').join('||');
        if (!seen.has(key)) {
            const masterRow = {};
            masterCols.forEach(c => { masterRow[c] = row[c] || '—'; });
            
            const headerRow = {};
            headerCols.forEach(c => { headerRow[c] = row[c] || '—'; });
            
            seen.set(key, { masterRow, headerRow, details: [] });
        }
        const detailRow = {};
        detailCols.forEach(c => { detailRow[c] = row[c] || '—'; });
        seen.get(key).details.push(detailRow);
    });
    return Array.from(seen.values());
}

const MaintenanceView = () => {
    const { formKey }           = useParams();
    const navigate              = useNavigate();

    const [rows, setRows]               = useState([]);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState(null);

    // Filters
    const [dateFilter, setDateFilter]     = useState("today");
    const [specificDate, setSpecificDate] = useState("");

    // Grouping States
    const [isGroupedView, setIsGroupedView]           = useState(false);
    const [masterColumns, setMasterColumns]           = useState([]);
    const [modalHeaderColumns, setModalHeaderColumns] = useState([]); 
    const [detailColumns, setDetailColumns]           = useState([]);
    const [groupedReports, setGroupedReports]         = useState([]);
    const [selectedReport, setSelectedReport]         = useState(null);
    const [detailOpen, setDetailOpen]                 = useState(false);

    // Form metadata 
    const config = MAINT_CONFIG[formKey] || {
        label: formKey.replace(/_/g, ' '), color: '#4f46e5', bg: '#e0e7ff',
        icon: 'bi-gear', formNo: 'N/A', category: 'machine', freq: 'daily'
    };

    // DYNAMIC LOGIC: Return Path
    const getBackPath = () => {
        const cat = config.category === 'tool' ? 'Tool' : 'Machine';
        const freq = config.freq || 'daily';
        return `/Maintenance/${cat}/${freq}`;
    };

    const flatColumns = rows.length > 0 ? Object.keys(rows[0]) : [];

    useEffect(() => {
        const currentDate = new Date();
        const formatDate = (date) => {
            const offset = date.getTimezoneOffset() * 60000;
            return new Date(date - offset).toISOString().split("T")[0];
        };

        let start_date = "";
        let end_date = formatDate(currentDate);

        if (dateFilter === "all") {
            start_date = "all"; end_date = "all";
        } else if (dateFilter === "today") {
            start_date = formatDate(currentDate);
        } else if (dateFilter === "yesterday") {
            const d = new Date(); d.setDate(currentDate.getDate() - 1);
            start_date = end_date = formatDate(d);
        } else if (dateFilter === "last_2_days") {
            const d = new Date(); d.setDate(currentDate.getDate() - 2);
            start_date = formatDate(d);
        } else if (dateFilter === "last_15_days") {
            const d = new Date(); d.setDate(currentDate.getDate() - 15);
            start_date = formatDate(d);
        } else if (dateFilter === "last_1_month") {
            const d = new Date(); d.setMonth(currentDate.getMonth() - 1);
            start_date = formatDate(d);
        } else if (dateFilter === "specific_date") {
            if (!specificDate) { setRows([]); setLoading(false); return; }
            start_date = end_date = specificDate;
        }

        setLoading(true);
        setError(null);

        const queryString = new URLSearchParams({ start_date, end_date }).toString();

        fetch(`${API_BASE_URL}/api/maintenance-data/${formKey}/?${queryString}`)
            .then(res => { if (!res.ok) throw new Error('Server error'); return res.json(); })
            .then(json => {
                let rawData = json.data || [];

                // DATE FORMATTER
                const formatDisplayDate = (val) => {
                    if (!val || typeof val !== 'string') return val;
                    const regex = /^(\d{4})-(\d{2})-(\d{2})(.*)$/;
                    if (regex.test(val)) {
                        return val.replace(regex, '$3-$2-$1$4');
                    }
                    return val;
                };

                const data = rawData.map(row => {
                    const newRow = { ...row };
                    Object.keys(newRow).forEach(key => {
                        if (typeof newRow[key] === 'string' && /^\d{4}-\d{2}-\d{2}/.test(newRow[key])) {
                            newRow[key] = formatDisplayDate(newRow[key]);
                        }
                    });
                    return newRow;
                });

                setRows(data);

                let definedMasterCols = MAINT_MASTER_COLS_CONFIG[formKey];
                if (!definedMasterCols && data.length > 0) {
                     definedMasterCols = config.category === 'tool' ? ['Date', 'Tool No'] : ['Date', 'Machine No'];
                }

                const definedModalHeaderCols = MAINT_MODAL_HEADER_COLS_CONFIG[formKey] || definedMasterCols;

                if (definedMasterCols && data.length > 0) {
                    const allKeysSet = new Set();
                    data.forEach(row => Object.keys(row).forEach(k => allKeysSet.add(k)));
                    const allKeys = Array.from(allKeysSet);
                    const normalizeStr = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

                    const actualMasterCols = [];
                    definedMasterCols.forEach(configCol => {
                        const match = allKeys.find(k => normalizeStr(k) === normalizeStr(configCol));
                        if(match) actualMasterCols.push(match); 
                    });

                    const actualModalHeaderCols = [];
                    definedModalHeaderCols.forEach(configCol => {
                        const match = allKeys.find(k => normalizeStr(k) === normalizeStr(configCol));
                        if(match) actualModalHeaderCols.push(match);
                    });

                    if (actualMasterCols.length >= 2) {
                        let dynDetailCols = allKeys.filter(k => !actualModalHeaderCols.includes(k) && k.toLowerCase() !== 'sr.');
                        
                        setMasterColumns(actualMasterCols);
                        setModalHeaderColumns(actualModalHeaderCols);
                        setDetailColumns(dynDetailCols);
                        setGroupedReports(groupRows(data, actualMasterCols, actualModalHeaderCols, dynDetailCols));
                        setIsGroupedView(true);
                    } else {
                        setIsGroupedView(false); 
                    }
                } else {
                    setIsGroupedView(false);
                }

                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load data. Please check the backend connection.');
                setLoading(false);
            });
            
    }, [formKey, dateFilter, specificDate, config.category]); 

    const handleExport = () => {
        if (!rows.length) return;
        const cols = Object.keys(rows[0]);
        const headers = cols.join(',');
        const body = rows.map(row =>
            cols.map(c => `"${String(row[c] ?? '').replace(/"/g, '""')}"`).join(',')
        ).join('\n');
        const blob = new Blob([`${headers}\n${body}`], { type: 'text/csv' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `${config.label.replace(/\s+/g, '_')}_Records.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleRowClick = (group) => {
        setSelectedReport(group);
        setDetailOpen(true);
    };

    const handleCloseDetail = () => {
        setDetailOpen(false);
        setSelectedReport(null);
    };

    // ==========================================
    // RENDER CELL DATA (Colors & Empty Values logic)
    // ==========================================
    const renderCellData = (val, colName) => {
        const lowerCol = colName ? String(colName).toLowerCase() : '';
        
        // 🔥 FIX: 'after maint' ko yahan se hata diya gaya taaki color badges na dikhe
        if ((lowerCol === 'status' || lowerCol === 'result') && (val === 'OK' || val === 'NOT OK')) {
            return <span className={val === 'OK' ? 'status-ok' : 'status-ng'}>{val}</span>;
        }
        
        // Agar value khali ya N/A hai toh dash (—) dikhao (Design clean rakhne ke liye)
        if (val === null || val === undefined || val === '' || val === '—' || val === 'N/A') {
            return <span className="null-val">—</span>;
        }
        
        return String(val);
    };

    const recordLabel = isGroupedView
        ? `${groupedReports.length} Reports`
        : `${rows.length} Records`;

    return (
        <div className="vp-wrap">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"/>

            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                .vp-wrap { position: fixed; inset: 0; background: #f1f5f9; z-index: 9999; display: flex; flex-direction: column; font-family: 'Inter', sans-serif; overflow: hidden; }
                .vp-nav { background: #fff; height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); flex-shrink: 0; }
                .vp-nav-left { display: flex; align-items: center; gap: 12px; }
                
                .vp-back-btn { background: #f1f5f9; border: none; border-radius: 8px; padding: 0 16px; font-size: 0.85rem; font-weight: 700; color: #475569; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: background 0.2s; height: 38px; }
                .vp-back-btn:hover { background: #e2e8f0; }

                .vp-form-badge { display: flex; align-items: center; gap: 10px; }
                .vp-icon-box { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
                .vp-form-name { font-weight: 800; font-size: 1rem; color: #0f172a; }
                .vp-form-no { font-size: 0.73rem; color: #94a3b8; font-weight: 600; }
                .vp-nav-right { display: flex; align-items: center; gap: 10px; }

                .filter-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; display: flex; align-items: center; padding: 4px 8px; gap: 6px; }
                .filter-select { background: transparent; border: none; font-size: 0.8rem; font-weight: 700; color: #334155; outline: none; cursor: pointer; }
                .filter-date-input { border: 1px solid #cbd5e1; border-radius: 6px; padding: 2px 6px; font-size: 0.75rem; font-weight: 700; color: #ef4444; outline: none; }

                .export-btn { background: #4f46e5; color: #fff; border: none; border-radius: 8px; padding: 8px 16px; font-weight: 700; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 6px; }
                .export-btn:hover { background: #4338ca; }
                .rec-badge { background: #f1f5f9; border-radius: 20px; padding: 6px 14px; font-size: 0.78rem; font-weight: 700; color: #475569; }
                
                .vp-content { flex: 1; overflow: auto; padding: 24px; }
                
                .excel-wrap { background: #fff; border-radius: 14px; border: 1px solid #e2e8f0; overflow: auto; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
                .excel-table { border-collapse: collapse; width: 100%; min-width: max-content; font-size: 0.8rem; }
                .excel-table thead { position: sticky; top: 0; z-index: 10; }
                .excel-table thead th { background: #f8fafc; padding: 10px 14px; text-align: center; font-weight: 700; color: #374151; border-right: 1px solid #e5e7eb; border-bottom: 2px solid #cbd5e1; white-space: nowrap; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em; }
                .excel-table thead th.sr-col { background: #f1f5f9; color: #94a3b8; width: 52px; text-align: center; border-right: 2px solid #cbd5e1; }
                .excel-table tbody tr { transition: background 0.12s; }
                .excel-table tbody tr:hover td { background: #e0e7ff !important; }
                .excel-table tbody tr:nth-child(even) td { background: #fafafa; }
                .excel-table tbody tr:nth-child(odd) td { background: #fff; }
                .excel-table td { padding: 9px 14px; border-right: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; color: #374151; white-space: nowrap; max-width: 250px; overflow: hidden; text-overflow: ellipsis; text-align: center; }
                .excel-table td.sr-td { text-align: center; color: #94a3b8; font-weight: 700; font-size: 0.72rem; background: #f8fafc !important; border-right: 2px solid #e2e8f0; }
                
                .master-row { cursor: pointer; }
                .master-row:hover td { background: #e0e7ff !important; }
                .view-detail-btn { display: inline-flex; align-items: center; gap: 5px; background: #4f46e5; color: #fff; border: none; border-radius: 6px; padding: 4px 10px; font-size: 0.73rem; font-weight: 700; cursor: pointer; white-space: nowrap; transition: background 0.15s; }
                .view-detail-btn:hover { background: #4338ca; }

                .status-ok { background: #d1fae5; color: #065f46; padding: 3px 10px; border-radius: 12px; font-weight: 700; font-size: 0.72rem; display: inline-block; }
                .status-ng { background: #fef2f2; color: #991b1b; padding: 3px 10px; border-radius: 12px; font-weight: 700; font-size: 0.72rem; display: inline-block; }
                .null-val { color: #d1d5db; font-style: italic; }

                .detail-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 99999; display: flex; align-items: center; justify-content: center; padding: 24px; animation: fadeIn 0.15s ease; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .detail-modal { background: #fff; border-radius: 18px; width: 100%; max-width: 1100px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 24px 60px rgba(0,0,0,0.18); animation: slideUp 0.18s ease; overflow: hidden; }
                @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .detail-header { padding: 18px 24px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: flex-start; flex-shrink: 0; }
                .detail-header-title { font-weight: 800; font-size: 1rem; color: #0f172a; }
                .detail-header-sub { font-size: 0.78rem; color: #64748b; margin-top: 3px; }
                .detail-close-btn { background: #f1f5f9; border: none; border-radius: 8px; width: 36px; height: 36px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #475569; font-size: 1rem; transition: background 0.2s; flex-shrink: 0; }
                .detail-close-btn:hover { background: #fee2e2; color: #dc2626; }

                .master-info-strip { padding: 12px 24px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; flex-wrap: wrap; gap: 18px; flex-shrink: 0; }
                .minfo-item { display: flex; flex-direction: column; gap: 1px; }
                .minfo-label { font-size: 0.65rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; }
                .minfo-value { font-size: 0.82rem; font-weight: 700; color: #1e293b; }

                .detail-body { flex: 1; overflow: auto; padding: 20px 24px; }

                .loading-box { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; gap: 14px; color: #64748b; font-weight: 600; }
                .error-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 20px 24px; color: #dc2626; font-weight: 600; display: flex; align-items: center; gap: 10px; }
                .empty-box { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px; color: #94a3b8; gap: 10px; }
                .empty-box i { font-size: 2.5rem; }
                .empty-box p { font-weight: 600; font-size: 0.9rem; }
                
                .detail-modal .excel-table th, 
                .detail-modal .excel-table td {
                    white-space: normal !important;
                    max-width: none !important;
                    overflow: visible !important;
                    text-overflow: clip !important;
                    text-align: left !important;
                    line-height: 1.5;
                }
                .detail-modal .excel-table th.sr-col, 
                .detail-modal .excel-table td.sr-td {
                    text-align: center !important;
                    width: 60px !important;
                }
            `}</style>

            <nav className="vp-nav">
                <div className="vp-nav-left">
                    <button className="vp-back-btn" onClick={() => navigate(getBackPath())}>
                        <i className="bi bi-arrow-left"></i> Back
                    </button>
                    <div style={{width:'1px', height:'32px', background:'#e2e8f0'}}></div>
                    <div className="vp-form-badge">
                        <div className="vp-icon-box" style={{background: config.bg, color: config.color}}>
                            <i className={config.icon}></i>
                        </div>
                        <div>
                            <div className="vp-form-name">{config.label}</div>
                            <div className="vp-form-no">Form No: {config.formNo}</div>
                        </div>
                    </div>
                </div>
                
                <div className="vp-nav-right">
                    <div className="filter-box">
                        <i className="bi bi-calendar3 text-secondary"></i>
                        <select 
                            className="filter-select" 
                            value={dateFilter} 
                            onChange={(e) => setDateFilter(e.target.value)}
                        >
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="last_2_days">Last 2 Days</option>
                            <option value="last_15_days">Last 15 Days</option>
                            <option value="last_1_month">Last 1 Month</option>
                            <option value="specific_date">Specific Date</option>
                            <option value="all">All Data</option>
                        </select>
                        
                        {dateFilter === "specific_date" && (
                            <input 
                                type="date" 
                                className="filter-date-input"
                                value={specificDate}
                                onChange={(e) => setSpecificDate(e.target.value)}
                            />
                        )}
                    </div>

                    <span className="rec-badge">
                        <i className="bi bi-database me-1"></i>{recordLabel}
                    </span>
                    <button className="export-btn" onClick={handleExport}>
                        <i className="bi bi-file-earmark-excel"></i> Export CSV
                    </button>
                </div>
            </nav>

            <div className="vp-content">
                {error ? (
                    <div className="error-box">
                        <i className="bi bi-exclamation-triangle-fill"></i>{error}
                    </div>
                ) : loading ? (
                    <div className="loading-box">
                        <div className="spinner-border" style={{color: config.color}} role="status"></div>
                        <span>Loading data, please wait...</span>
                    </div>
                ) : rows.length === 0 ? (
                    <div className="excel-wrap">
                        <div className="empty-box">
                            <i className="bi bi-inbox"></i>
                            <p>No records found for the selected date range</p>
                        </div>
                    </div>
                ) : isGroupedView ? (
                    <div className="excel-wrap">
                        <table className="excel-table">
                            <thead>
                                <tr>
                                    <th className="sr-col">SR</th>
                                    {masterColumns.map(col => (
                                        <th key={col}>{col}</th>
                                    ))}
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupedReports.map((group, i) => (
                                    <tr key={i} className="master-row" onClick={() => handleRowClick(group)}>
                                        <td className="sr-td">{i + 1}</td>
                                        {masterColumns.map(col => (
                                            <td key={col} title={String(group.masterRow[col] ?? '')}>
                                                {renderCellData(group.masterRow[col], col)}
                                            </td>
                                        ))}
                                        <td>
                                            <button className="view-detail-btn" onClick={(e) => { e.stopPropagation(); handleRowClick(group); }}>
                                                <i className="bi bi-eye"></i> View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="excel-wrap">
                        <table className="excel-table detail-table">
                            <thead>
                                <tr>
                                    <th className="sr-col">SR</th>
                                    {flatColumns.map(col => (
                                        <th key={col}>{col.replace(/_/g, ' ')}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, i) => (
                                    <tr key={i}>
                                        <td className="sr-td">{i + 1}</td>
                                        {flatColumns.map(col => (
                                            <td key={col} title={String(row[col] ?? '')}>
                                                {renderCellData(row[col], col)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* DYNAMIC DETAIL MODAL */}
            {detailOpen && selectedReport && (() => {
                // 🔥 FIX: 'remarks' aur 'checking parameter' ko hamesha visible rakhein
                const activeDetailCols = detailColumns.filter(col => {
                    const lowerCol = col.toLowerCase();
                    if (lowerCol === 'remarks' || lowerCol === 'checking parameter') return true;
                    
                    return selectedReport.details.some(detail => 
                        detail[col] !== null && 
                        detail[col] !== undefined && 
                        detail[col] !== '' && 
                        detail[col] !== '—' && 
                        detail[col] !== 'N/A'
                    );
                });

                return (
                    <div className="detail-overlay" onClick={handleCloseDetail}>
                        <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="detail-header">
                                <div>
                                    <div className="detail-header-title">
                                        <i className="bi bi-clipboard-data me-2" style={{color: config.color}}></i>
                                        {config.label} - Detail View
                                    </div>
                                    <div className="detail-header-sub">
                                        {selectedReport.details.length} detailed entries found
                                    </div>
                                </div>
                                <button className="detail-close-btn" onClick={handleCloseDetail}>
                                    <i className="bi bi-x-lg"></i>
                                </button>
                            </div>

                            <div className="master-info-strip">
                                {modalHeaderColumns.map(col => (
                                    <div className="minfo-item" key={col}>
                                        <span className="minfo-label">{col}</span>
                                        <span className="minfo-value">
                                            {selectedReport.headerRow[col] || '—'}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="detail-body">
                                <div className="excel-wrap" style={{borderRadius: '10px'}}>
                                    <table className="excel-table">
                                        <thead>
                                            <tr>
                                                <th className="sr-col">SR</th>
                                                {activeDetailCols.map(col => (
                                                    <th key={col}>{col}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedReport.details.map((detail, i) => (
                                                <tr key={i}>
                                                    <td className="sr-td">{i + 1}</td>
                                                    {activeDetailCols.map(col => (
                                                        <td key={col} title={String(detail[col] ?? '')}>
                                                            {renderCellData(detail[col], col)}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
};

export default MaintenanceView;