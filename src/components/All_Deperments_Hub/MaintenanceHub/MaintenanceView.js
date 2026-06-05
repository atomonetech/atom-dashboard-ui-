import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// 🔥 Updated Config: Naye 12 machine reports aur tool_breakdown_slip add kar diye gaye hain
const MAINT_CONFIG = {
    // MACHINE REPORTS
    'mc_history':                { label: 'Machine History Card',        color: '#4f46e5', bg: '#e0e7ff', icon: 'bi-clock-history',      formNo: 'AOT/F/MNT/01', category: 'machine', freq: 'daily' },
    'power_press_check':         { label: 'Power Press Checksheet',      color: '#06b6d4', bg: '#cffafe', icon: 'bi-speedometer2',       formNo: 'AOT/F/MNT/02', category: 'machine', freq: 'daily' },
    'mc_breakdown':              { label: 'Machine Breakdown Slip',      color: '#ef4444', bg: '#fef2f2', icon: 'bi-exclamation-octagon', formNo: 'AOT/F/MNT/03', category: 'machine', freq: 'daily' },
    'pokayoke-view':             { label: 'Poka Yoke Monitoring',        color: '#10b981', bg: '#d1fae5', icon: 'bi-shield-check',       formNo: 'AOT/F/QC/07A', category: 'machine', freq: 'daily' },
    'mc_breakdown_summary':      { label: 'MC Breakdown Summary',        color: '#f59e0b', bg: '#fef3c7', icon: 'bi-graph-up',           formNo: 'AOT/F/MNT/04', category: 'machine', freq: 'monthly' },
    'why_why_analysis':          { label: 'Why-Why Analysis',            color: '#8b5cf6', bg: '#ede9fe', icon: 'bi-question-circle',    formNo: 'AOT/F/MNT/05', category: 'machine', freq: 'monthly' },
    'critical_spares':           { label: 'Critical Spares Inventory',   color: '#10b981', bg: '#d1fae5', icon: 'bi-box-seam',           formNo: 'AOT/F/MNT/06', category: 'machine', freq: 'monthly' },

    // 🔥 NAYE 12 WELDING & GRINDING MAINTENANCE REPORTS
    'tig_welding':               { label: 'TIG Welding Maintenance',     color: '#0284c7', bg: '#e0f2fe', icon: 'bi-lightning',          formNo: 'AOT/F/MNT/10', category: 'machine', freq: 'daily' },
    'spot_welding':              { label: 'Spot Welding Maintenance',    color: '#3b82f6', bg: '#eff6ff', icon: 'bi-grid-1x2',           formNo: 'AOT/F/MNT/11', category: 'machine', freq: 'daily' },
    'compressor':                { label: 'Compressor Maintenance',      color: '#14b8a6', bg: '#ccfbf1', icon: 'bi-wind',               formNo: 'AOT/F/MNT/12', category: 'machine', freq: 'weekly' },
    'lathe_machine':             { label: 'Lathe Machine Maintenance',   color: '#6b7280', bg: '#f3f4f6', icon: 'bi-nut',                formNo: 'AOT/F/MNT/13', category: 'machine', freq: 'weekly' },
    'vertical_drill':            { label: 'Vertical Drill Maintenance',  color: '#f59e0b', bg: '#fef3c7', icon: 'bi-tools',              formNo: 'AOT/F/MNT/14', category: 'machine', freq: 'daily' },
    'surface_grinder':           { label: 'Surface Grinder Maintenance', color: '#ec4899', bg: '#fce7f3', icon: 'bi-disc',               formNo: 'AOT/F/MNT/15', category: 'machine', freq: 'weekly' },
    'base_grinder':              { label: 'Base Grinder Maintenance',    color: '#8b5cf6', bg: '#ede9fe', icon: 'bi-gear-wide',          formNo: 'AOT/F/MNT/16', category: 'machine', freq: 'daily' },
    'belt_grinder':              { label: 'Belt Grinder Maintenance',    color: '#6366f1', bg: '#e0e7ff', icon: 'bi-infinity',           formNo: 'AOT/F/MNT/17', category: 'machine', freq: 'weekly' },
    'pipe_cutting':              { label: 'Pipe Cutting Maintenance',    color: '#10b981', bg: '#d1fae5', icon: 'bi-scissors',           formNo: 'AOT/F/MNT/18', category: 'machine', freq: 'daily' },
    'vibra':                     { label: 'Vibra Maintenance',           color: '#a855f7', bg: '#f3e8ff', icon: 'bi-activity',           formNo: 'AOT/F/MNT/19', category: 'machine', freq: 'weekly' },
    'dip_molding':               { label: 'Dip Molding Maintenance',     color: '#f97316', bg: '#ffedd5', icon: 'bi-droplet-half',       formNo: 'AOT/F/MNT/20', category: 'machine', freq: 'monthly' },
    'servo_press':               { label: 'Servo Press Maintenance',     color: '#ef4444', bg: '#fef2f2', icon: 'bi-cpu',                formNo: 'AOT/F/MNT/21', category: 'machine', freq: 'daily' },

    // TOOL REPORTS
    'tool_history':              { label: 'Tool History Card',           color: '#8b5cf6', bg: '#ede9fe', icon: 'bi-journal-text',       formNo: 'AOT/F/TL/01',  category: 'tool',    freq: 'daily' },
    'tool_pm_check':             { label: 'Tool PM Checklist',           color: '#10b981', bg: '#d1fae5', icon: 'bi-check2-square',      formNo: 'AOT/F/TL/02',  category: 'tool',    freq: 'daily' },
    'tool_breakdown':            { label: 'Tool Breakdown Report',       color: '#f59e0b', bg: '#fef3c7', icon: 'bi-tools',              formNo: 'AOT/F/TL/03',  category: 'tool',    freq: 'daily' },
    'tool_stroke':               { label: 'Tool Stroke Record',          color: '#06b6d4', bg: '#cffafe', icon: 'bi-lightning-charge',   formNo: 'AOT/F/TL/04',  category: 'tool',    freq: 'daily' },
    'weekly_pm_welding_fixture': { label: 'Welding Fixture Checklist',   color: '#3b82f6', bg: '#eff6ff', icon: 'bi-shield-check',       formNo: 'AOT/F/TL/05',  category: 'tool',    freq: 'weekly' },
    'tool_breakdown_summary':    { label: 'Tool Breakdown Summary',      color: '#ef4444', bg: '#fef2f2', icon: 'bi-bar-chart',          formNo: 'AOT/F/TL/06',  category: 'tool',    freq: 'monthly' },
    'why_tool_analysis':         { label: 'Why-Why Tool Analysis',       color: '#8b5cf6', bg: '#ede9fe', icon: 'bi-search',             formNo: 'AOT/F/TL/07',  category: 'tool',    freq: 'monthly' },
    'tool_critical_spares':      { label: 'Tool Critical Spares',        color: '#10b981', bg: '#d1fae5', icon: 'bi-archive',            formNo: 'AOT/F/TL/08',  category: 'tool',    freq: 'monthly' },
    'tool_breakdown_slip':       { label: 'Tool Breakdown Slip',         color: '#ef4444', bg: '#fef2f2', icon: 'bi-file-earmark-break', formNo: 'AOT/F/TL/09',  category: 'tool',    freq: 'daily' },
    
    // YEARLY REPORTS
    'master_list_mc':            { label: 'Machine Master List',         color: '#334155', bg: '#f1f5f9', icon: 'bi-list-ul',            formNo: 'AOT/F/MNT/YR', category: 'machine', freq: 'yearly' },
    'master_list_tool':          { label: 'Tool Master List',            color: '#334155', bg: '#f1f5f9', icon: 'bi-list-stars',         formNo: 'AOT/F/TL/YR',  category: 'tool',    freq: 'yearly' },
};

const MaintenanceView = () => {
    const { formKey }           = useParams();
    const navigate              = useNavigate();
    const [rows, setRows]       = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    // FILTER STATES
    const [dateFilter, setDateFilter] = useState("today");
    const [specificDate, setSpecificDate] = useState("");

    // Form metadata fetch karna
    const config = MAINT_CONFIG[formKey] || {
        label: formKey.replace(/_/g, ' '), color: '#4f46e5', bg: '#e0e7ff',
        icon: 'bi-gear', formNo: 'N/A', category: 'machine', freq: 'daily'
    };

    // DYNAMIC LOGIC: Category aur Frequency ko combine karke sahi back path banana
    const getBackPath = () => {
        const cat = config.category === 'tool' ? 'Tool' : 'Machine';
        const freq = config.freq || 'daily';
        return `/Maintenance/${cat}/${freq}`;
    };

    const backPath = getBackPath();
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

    // FETCH LOGIC
    useEffect(() => {
        const currentDate = new Date();
        const formatDate = (date) => {
            const offset = date.getTimezoneOffset() * 60000;
            return new Date(date - offset).toISOString().split("T")[0];
        };

        let start_date = "";
        let end_date = formatDate(currentDate);

        if (dateFilter === "all") {
            start_date = "all";
            end_date = "all";
        } else if (dateFilter === "today") {
            start_date = formatDate(currentDate);
        } else if (dateFilter === "yesterday") {
            const pastDate = new Date();
            pastDate.setDate(currentDate.getDate() - 1);
            start_date = formatDate(pastDate);
            end_date = start_date;
        } else if (dateFilter === "last_2_days") {
            const pastDate = new Date();
            pastDate.setDate(currentDate.getDate() - 2);
            start_date = formatDate(pastDate);
        } else if (dateFilter === "last_15_days") {
            const pastDate = new Date();
            pastDate.setDate(currentDate.getDate() - 15);
            start_date = formatDate(pastDate);
        } else if (dateFilter === "last_1_month") {
            const pastDate = new Date();
            pastDate.setMonth(currentDate.getMonth() - 1);
            start_date = formatDate(pastDate);
        } else if (dateFilter === "specific_date") {
            if (!specificDate) {
                setRows([]);
                setLoading(false);
                return;
            }
            start_date = specificDate;
            end_date = specificDate;
        }

        setLoading(true);
        setError(null);

        const queryString = new URLSearchParams({ start_date, end_date }).toString();

        fetch(`http://192.168.0.34:8000/api/maintenance-data/${formKey}/?${queryString}`)
            .then(res => {
                if (!res.ok) throw new Error('Server error');
                return res.json();
            })
            .then(json => {
                setRows(json.data || []);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load data. Please check the backend connection.');
                setLoading(false);
            });
            
    }, [formKey, dateFilter, specificDate]); 

    const handleExport = () => {
        if (!rows.length) return;
        const headers = columns.join(',');
        const body = rows.map(row =>
            columns.map(c => `"${String(row[c] ?? '').replace(/"/g, '""')}"`).join(',')
        ).join('\n');
        const blob = new Blob([`${headers}\n${body}`], { type: 'text/csv' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `${config.label.replace(/\s+/g, '_')}_Records.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="vp-wrap">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"/>

            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                .vp-wrap { position: fixed; inset: 0; background: #f1f5f9; z-index: 9999; display: flex; flex-direction: column; font-family: 'Inter', sans-serif; overflow: hidden; }
                .vp-nav { background: #fff; height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); flex-shrink: 0; }
                .vp-nav-left { display: flex; align-items: center; gap: 12px; }
                .back-btn { background: #f1f5f9; border: none; border-radius: 8px; padding: 7px 13px; font-size: 0.85rem; font-weight: 700; color: #475569; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background 0.2s; }
                .back-btn:hover { background: #e2e8f0; }
                .vp-form-badge { display: flex; align-items: center; gap: 10px; }
                .vp-icon-box { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
                .vp-form-name { font-weight: 800; font-size: 1rem; color: #0f172a; }
                .vp-form-no { font-size: 0.73rem; color: #94a3b8; font-weight: 600; }
                .vp-nav-right { display: flex; align-items: center; gap: 10px; }

                /* FILTER DROPDOWN CSS */
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
                .excel-table thead tr:first-child th { background: #1e293b; color: #fff; padding: 0; height: 36px; }
                .excel-table thead th { background: #f8fafc; padding: 10px 14px; text-align: center; font-weight: 700; color: #374151; border-right: 1px solid #e5e7eb; border-bottom: 2px solid #cbd5e1; white-space: nowrap; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em; }
                .excel-table thead th.sr-col { background: #f1f5f9; color: #94a3b8; width: 52px; text-align: center; border-right: 2px solid #cbd5e1; }
                .excel-table tbody tr { transition: background 0.12s; }
                .excel-table tbody tr:hover td { background: #e0e7ff !important; }
                .excel-table tbody tr:nth-child(even) td { background: #fafafa; }
                .excel-table tbody tr:nth-child(odd) td { background: #fff; }
                .excel-table td { padding: 9px 14px; border-right: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; color: #374151; white-space: nowrap; max-width: 250px; overflow: hidden; text-overflow: ellipsis; text-align: center; }
                .excel-table td.sr-td { text-align: center; color: #94a3b8; font-weight: 700; font-size: 0.72rem; background: #f8fafc !important; border-right: 2px solid #e2e8f0; }
                
                /* 🔥 STATUS BADGES CSS */
                .status-ok { background: #d1fae5; color: #065f46; padding: 3px 10px; border-radius: 12px; font-weight: 700; font-size: 0.72rem; display: inline-block; }
                .status-ng { background: #fef2f2; color: #991b1b; padding: 3px 10px; border-radius: 12px; font-weight: 700; font-size: 0.72rem; display: inline-block; }
                
                .null-val { color: #d1d5db; font-style: italic; }
                .loading-box { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; gap: 14px; color: #64748b; font-weight: 600; }
                .error-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 20px 24px; color: #dc2626; font-weight: 600; display: flex; align-items: center; gap: 10px; }
                .empty-box { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px; color: #94a3b8; gap: 10px; }
                .empty-box i { font-size: 2.5rem; }
            `}</style>

            <nav className="vp-nav">
                <div className="vp-nav-left">
                    <button className="back-btn" onClick={() => navigate(backPath)}>
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

                    <span className="rec-badge"><i className="bi bi-database me-1"></i>{rows.length} Records</span>
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
                ) : (
                    <div className="excel-wrap">
                        <table className="excel-table">
                            <thead>
                                <tr>
                                    <th className="sr-col">SR</th>
                                    {columns.map(col => (
                                        <th key={col}>{col.replace(/_/g, ' ')}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, i) => (
                                    <tr key={i}>
                                        <td className="sr-td">{i + 1}</td>
                                        {columns.map(col => {
                                            const cellValue = row[col];
                                            
                                            // 🔥 Status column checking & Badges render
                                            if (col.toLowerCase() === 'status' && (cellValue === 'OK' || cellValue === 'NOT OK')) {
                                                return (
                                                    <td key={col}>
                                                        <span className={cellValue === 'OK' ? 'status-ok' : 'status-ng'}>
                                                            {cellValue}
                                                        </span>
                                                    </td>
                                                );
                                            }

                                            return (
                                                <td key={col} title={String(cellValue ?? '')}>
                                                    {cellValue === null || cellValue === undefined || cellValue === ''
                                                        ? <span className="null-val">—</span>
                                                        : String(cellValue)}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MaintenanceView;