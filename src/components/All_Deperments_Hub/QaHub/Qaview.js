import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const FORM_CONFIG = {
    'incoming-material-view':  { label: 'Incoming Material Inspection',  color: '#3b82f6', bg: '#eff6ff', icon: 'bi-box-seam',            formNo: 'AOT/F/QA/01' },
    'redbin-view':             { label: 'Red Bin Analysis - NC Reg.',    color: '#ef4444', bg: '#fef2f2', icon: 'bi-trash3',              formNo: 'AOT/F/QC/02' },
    'scrap-note-view':         { label: 'Scrap Note',                    color: '#ef4444', bg: '#fef2f2', icon: 'bi-file-earmark-x',      formNo: 'AOT/F/QC/04' },
    'redbin-attendance-view':  { label: 'Red Bin Attendance Sheet',      color: '#f59e0b', bg: '#fef3c7', icon: 'bi-person-x',            formNo: 'AOT/F/QC/05' },
    'pokayoke-view':           { label: 'Daily Poka Yokes Check',        color: '#10b981', bg: '#d1fae5', icon: 'bi-shield-check',        formNo: 'AOT/F/QC/07A' },
    'inspection-view':         { label: 'Set up & Patrol Insp. (FPIR)',  color: '#06b6d4', bg: '#cffafe', icon: 'bi-clipboard-check',     formNo: 'AOT/F/QA/15' },
    'rework-view':             { label: 'Rework / Repair Report',        color: '#f59e0b', bg: '#fef3c7', icon: 'bi-tools',               formNo: 'AOT/F/QA/20' },
    'sample-inspection-view':  { label: 'Sample Inspection Report',      color: '#3b82f6', bg: '#eff6ff', icon: 'bi-search',              formNo: 'AOT/F/QA/21' },
    'deviation-view':          { label: 'Deviation Approval Form',       color: '#8b5cf6', bg: '#ede9fe', icon: 'bi-file-earmark-check',  formNo: 'AOT/F/PROD/04' },
    'grn-view':                { label: 'Goods Receipt Note (GRN)',      color: '#06b6d4', bg: '#cffafe', icon: 'bi-receipt',             formNo: 'Not Reqd.' },
    'pdi-view':                { label: 'Pre Dispatch Insp. (PDIR)',     color: '#10b981', bg: '#d1fae5', icon: 'bi-truck',               formNo: 'AOT/F/QA/40' },
};

const Qaview = () => {
    const { formKey }       = useParams();
    const navigate          = useNavigate();
    const location          = useLocation();
    const [rows, setRows]   = useState([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState(null);

    // 👇 1. FILTER STATES ADD KIYE
    const [dateFilter, setDateFilter] = useState("today"); // Default Aaj Ka Data
    const [specificDate, setSpecificDate] = useState("");

    const config = FORM_CONFIG[formKey] || {
        label: formKey, color: '#3b82f6', bg: '#eff6ff', icon: 'bi-file-earmark', formNo: ''
    };

    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

    // 👇 2. FETCH LOGIC MEIN PARAMS ADD KIYE
    useEffect(() => {
        // Indian Time Format
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
            end_date = start_date; // End bhi wahi
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
                // Agar date select nahi ki toh fetch mat karo
                setRows([]);
                setLoading(false);
                return;
            }
            start_date = specificDate;
            end_date = specificDate;
        }

        setLoading(true);
        setError(null);

        // API Call with Query Parameters
        const queryString = new URLSearchParams({ start_date, end_date }).toString();
        
        fetch(`${API_BASE_URL}/api/qa-data/${formKey}/?${queryString}`)
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
            
    // useEffect is dependent on dateFilter and specificDate too!
    }, [formKey, dateFilter, specificDate]); 

    // CSV Export
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
        a.download = `${config.label}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Custom Back Button Logic
    const handleCustomBack = () => {
        const returnCategory = location.state?.fromCategory || 'daily';
        navigate(`/qa-hub/${returnCategory}`);
    };

    return (
        <div className="vp-wrap">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"/>
            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                .vp-wrap { position: fixed; inset: 0; background: #f1f5f9; z-index: 9999; display: flex; flex-direction: column; font-family: 'Inter', sans-serif; overflow: hidden; }

                /* Navbar */
                .vp-nav { background: #fff; height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); flex-shrink: 0; }
                .vp-nav-left { display: flex; align-items: center; gap: 12px; }
                .back-btn { background: #f1f5f9; border: none; border-radius: 8px; padding: 7px 13px; font-size: 0.85rem; font-weight: 700; color: #475569; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background 0.2s; }
                .back-btn:hover { background: #e2e8f0; }
                .vp-form-badge { display: flex; align-items: center; gap: 10px; }
                .vp-icon-box { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
                .vp-form-name { font-weight: 800; font-size: 1rem; color: #0f172a; }
                .vp-form-no { font-size: 0.73rem; color: #94a3b8; font-weight: 600; }
                
                .vp-nav-right { display: flex; align-items: center; gap: 10px; }
                
                /* 👇 3. NAYI CSS FILTER KE LIYE */
                .filter-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; display: flex; align-items: center; padding: 4px 8px; gap: 6px; }
                .filter-select { background: transparent; border: none; font-size: 0.8rem; font-weight: 700; color: #334155; outline: none; cursor: pointer; }
                .filter-date-input { border: 1px solid #cbd5e1; border-radius: 6px; padding: 2px 6px; font-size: 0.75rem; font-weight: 700; color: #ef4444; outline: none; }
                
                .export-btn { background: #10b981; color: #fff; border: none; border-radius: 8px; padding: 8px 16px; font-weight: 700; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 6px; }
                .export-btn:hover { background: #059669; }
                .rec-badge { background: #f1f5f9; border-radius: 20px; padding: 6px 14px; font-size: 0.78rem; font-weight: 700; color: #475569; }

                /* Content */
                .vp-content { flex: 1; overflow: auto; padding: 24px; }

                /* Excel Table */
                .excel-wrap { background: #fff; border-radius: 14px; border: 1px solid #e2e8f0; overflow: auto; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
                .excel-table { border-collapse: collapse; width: 100%; min-width: max-content; font-size: 0.8rem; }

                /* Header */
                .excel-table thead { position: sticky; top: 0; z-index: 10; }
                .excel-table thead tr:first-child th { background: #1e293b; color: #fff; padding: 0; height: 36px; }
                .excel-table thead tr:first-child th.col-header { background: #1e293b; color: #94a3b8; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; padding: 0 14px; border-right: 1px solid #334155; text-align: center; }

                .excel-table thead th { background: #f8fafc; padding: 10px 14px; text-align: center; font-weight: 700; color: #374151; border-right: 1px solid #e5e7eb; border-bottom: 2px solid #cbd5e1; white-space: nowrap; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em; }
                .excel-table thead th.sr-col { background: #f1f5f9; color: #94a3b8; width: 52px; text-align: center; border-right: 2px solid #cbd5e1; }

                /* Body */
                .excel-table tbody tr { transition: background 0.12s; }
                .excel-table tbody tr:hover td { background: #eff6ff !important; }
                .excel-table tbody tr:nth-child(even) td { background: #fafafa; }
                .excel-table tbody tr:nth-child(odd) td { background: #fff; }
                .excel-table td { padding: 9px 14px; border-right: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; color: #374151; white-space: nowrap; max-width: 200px; overflow: hidden; text-overflow: ellipsis; text-align: center; }
                .excel-table td.sr-td { text-align: center; color: #94a3b8; font-weight: 700; font-size: 0.72rem; background: #f8fafc !important; border-right: 2px solid #e2e8f0; }

                .null-val { color: #d1d5db; font-style: italic; }

                /* States */
                .loading-box { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; gap: 14px; color: #64748b; font-weight: 600; }
                .error-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 20px 24px; color: #dc2626; font-weight: 600; display: flex; align-items: center; gap: 10px; }
                .empty-box { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px; color: #94a3b8; gap: 10px; }
                .empty-box i { font-size: 2.5rem; }
                .empty-box p { font-weight: 600; font-size: 0.9rem; }
            `}</style>

            {/* Navbar */}
            <nav className="vp-nav">
                <div className="vp-nav-left">
                    <button className="back-btn" onClick={handleCustomBack}>
                        <i className="bi bi-arrow-left"></i> Back
                    </button>
                    <div style={{width:'1px',height:'32px',background:'#e2e8f0'}}></div>
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
                    {/* 👇 4. NAYA FILTER DROPDOWN UI */}
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
                        
                        {/* Specific Date Select karne ka option */}
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

            {/* Content */}
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
                                        {columns.map(col => (
                                            <td key={col} title={String(row[col] ?? '')}>
                                                {row[col] === null || row[col] === undefined || row[col] === ''
                                                    ? <span className="null-val"></span>
                                                    : String(row[col])}
                                            </td>
                                        ))}
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

export default Qaview;