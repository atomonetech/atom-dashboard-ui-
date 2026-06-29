import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ProductionUpdateModal from './ProductionUpdateModal'; 

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const FORM_CONFIG = {
    'daily-prod-plan':   { label: 'Daily Production Plan / Report', color: '#3b82f6', bg: '#eff6ff', icon: 'bi-graph-up-arrow',     formNo: 'AOT-F-PROD-03' },
    'five-s-view':       { label: 'Operator 5S Checklist',          color: '#f59e0b', bg: '#fef3c7', icon: 'bi-stars',              formNo: 'AOT-F-PROD-13A' },
    'bin-trolley':       { label: 'Bins Trolley Cleaning',          color: '#06b6d4', bg: '#cffafe', icon: 'bi-cart-check',         formNo: 'AOT-F-PROD-02A' },
    'tip-change':        { label: 'Tip Change monitoring sheet',    color: '#8b5cf6', bg: '#ede9fe', icon: 'bi-sliders',            formNo: 'AOT-F-QA-05B' },
    'four-m-inspection': { label: '4M Change inspection report',    color: '#ef4444', bg: '#fef2f2', icon: 'bi-file-earmark-diff',  formNo: 'AOT-F-4M-06' },
    // 'four-m-summary':    { label: '4M Change summary sheet',        color: '#ef4444', bg: '#fef2f2', icon: 'bi-table',              formNo: 'AOT-F-4M-05A' },
    'four-m-record':     { label: '4M Change record sheet',       color: '#ef4444', bg: '#fef2f2', icon: 'bi-signpost-split',     formNo: 'AOT-F-4M-05' },
    // 'four-m-display':    { label: '4M Change display board',        color: '#ef4444', bg: '#fef2f2', icon: 'bi-easel2',             formNo: 'ATO-F-4M-08' },
    'four-m-information': { label: '4M Information Sheet', color: '#ef4444', bg: '#fef2f2', icon: 'bi-info-circle', formNo: 'AOT-F-4M-INFO' },
};

const MASTER_COLS_CONFIG = {
    'daily-prod-plan':   ['Date', 'Shift', 'Machine No','Operator Name','Part Name',],
    'five-s-view':       ['Date','Area','Zone Leader'],
    'bin-trolley':       ['Date', 'Week','Month'],
    'tip-change':        ['Date',  'Machine Name','Machine No'],
    'four-m-inspection': ['Date', 'Part Name', 'Part No'],
    'four-m-summary':    ['Date', 'Customer', 'Part Name & No'],
    'four-m-record':     [,'Date','Time','Machine No',],
    'four-m-display':    ['Date',],
    'four-m-information': ['Date', 'Machine No', 'Operator Name']
};

const MODAL_HEADER_COLS_CONFIG = {
    'daily-prod-plan':   ['Date', 'Plant','Shift', 'Machine No','Operator Name','Part Name','Part No','Operation','RM Coil No','Prepared By','Approved By'],
    'five-s-view':       ['Date','Area','Zone Leader','OK Count','NG Count','Prepared By','Approved By'],
    'bin-trolley':       ['Date', 'Week','Month','Prepared By','Approved By' ],
    'tip-change':        ['Date', 'Machine Name','Machine No','Prepared By','Approved By'],
    'four-m-inspection': ['Date', 'Part Name', 'Part No','Operation','Lot Qty','OK Qty','Rej. Qty','Parameter/Specs','Insp. By','Prepared By','Approved By'],
    'four-m-summary':    ['Date', 'Customer', 'Part Name & No','Prepared By','Approved By'],
    'four-m-record':     ['Time','Machine No','Part Info','Operation No','Nature of Change','Action Taken','Created At'],
    'four-m-display':    ['Date', ],
    'four-m-record':     ['Date','Time','Machine No','Part Info','Operation No','Nature of Change','Action Taken','Prepared By','Approved By'],
    'four-m-display':    ['Date',,'Prepared By','Approved By' ],
    'four-m-information': ['Date', 'Time', 'Machine No', 'Operator Name', 'Prepared By'],
};

function groupRows(rows, masterCols, headerCols, detailCols) {
    const seen = new Map();
    rows.forEach(row => {
        const key = headerCols.map(c => row[c] ?? '').join('||');
        if (!seen.has(key)) {
            const masterRow = {};
            masterCols.forEach(c => { masterRow[c] = row[c] || '—'; });
            
            const headerRow = {};
            headerCols.forEach(c => { headerRow[c] = row[c] || '—'; });
            
            seen.set(key, { 
                id: row.id || row.ID || row.record_id,
                created_at: row.created_at || null,   // ✅ Raw timestamp
                updated_at: row.updated_at || null,   // ✅ Raw timestamp
                masterRow, 
                headerRow, 
                details: [] 
            });
        }
        
        const detailRow = { id: row.id || row.ID || row.record_id }; // 🔥 FIX: Inserted ID inside details as well
        detailCols.forEach(c => { detailRow[c] = row[c] || '—'; });
        seen.get(key).details.push(detailRow);
    });
    return Array.from(seen.values());
}

const ProductionView = () => {
   
    const { formKey }   = useParams();
    const navigate      = useNavigate();
    const location      = useLocation();

    const [rows, setRows]           = useState([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState(null);

    const [dateFilter, setDateFilter]     = useState("today");
    const [specificDate, setSpecificDate] = useState("");

    const [isGroupedView, setIsGroupedView]           = useState(false);
    const [masterColumns, setMasterColumns]           = useState([]);
    const [modalHeaderColumns, setModalHeaderColumns] = useState([]); 
    const [detailColumns, setDetailColumns]           = useState([]);
    const [groupedReports, setGroupedReports]         = useState([]);
    
    const [selectedReport, setSelectedReport]         = useState(null);
    const [detailOpen, setDetailOpen]                 = useState(false);

    const [updateModalOpen, setUpdateModalOpen]       = useState(false);
    const [recordToUpdate, setRecordToUpdate]         = useState(null);
    const [refreshTrigger, setRefreshTrigger]         = useState(0); 

    const config = FORM_CONFIG[formKey] || {
        label: formKey, color: '#3b82f6', bg: '#eff6ff', icon: 'bi-file-earmark-text', formNo: 'N/A'
    };

    // 🔥 FIX: Hide 'id', 'created_at', 'updated_at' from flat columns
    const flatColumns = rows.length > 0 
        ? Object.keys(rows[0]).filter(k => 
            k.toLowerCase() !== 'id' && 
            k.toLowerCase() !== 'record_id' &&
            k !== 'created_at' &&
            k !== 'updated_at'
        ) 
        : [];

    useEffect(() => {
        const currentDate = new Date();
        const formatDate  = (date) => {
            const offset = date.getTimezoneOffset() * 60000;
            return new Date(date - offset).toISOString().split("T")[0];
        };

        let start_date = "";
        let end_date   = formatDate(currentDate);

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
        
        fetch(`${API_BASE_URL}/api/production-data/${formKey}/?${queryString}`)
            .then(res => { if (!res.ok) throw new Error('Server error'); return res.json(); })
            .then(json => {
                let rawData = json.data || [];
                
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
                        //  Do not convert created_at and updated_at — these are ISO timestamps
                        if (key === 'created_at' || key === 'updated_at') return;
                        if (typeof newRow[key] === 'string' && /^\d{4}-\d{2}-\d{2}/.test(newRow[key])) {
                            newRow[key] = formatDisplayDate(newRow[key]);
                        }
                    });
                    return newRow;
                });

                setRows(data);
                
                const definedMasterCols = MASTER_COLS_CONFIG[formKey];
                const definedModalHeaderCols = MODAL_HEADER_COLS_CONFIG[formKey] || definedMasterCols;
                
                if (definedMasterCols && data.length > 0) {
                    const allKeysSet = new Set();
                    data.forEach(row => Object.keys(row).forEach(k => allKeysSet.add(k)));
                    const allKeys = Array.from(allKeysSet);
                    const normalizeStr = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

                    const actualMasterCols = [];
                    definedMasterCols.forEach(configCol => {
                        const match = allKeys.find(k => normalizeStr(k) === normalizeStr(configCol));
                        actualMasterCols.push(match || configCol); 
                    });

                    const actualModalHeaderCols = [];
                    definedModalHeaderCols.forEach(configCol => {
                        const match = allKeys.find(k => normalizeStr(k) === normalizeStr(configCol));
                        actualModalHeaderCols.push(match || configCol);
                    });

                    // 🔥 FIX: Remove 'id', 'created_at', 'updated_at' from detail columns
                    let dynDetailCols = allKeys.filter(k => 
                        !actualModalHeaderCols.includes(k) && 
                        k.toLowerCase() !== 'id' && 
                        k.toLowerCase() !== 'record_id' &&
                        k !== 'created_at' &&
                        k !== 'updated_at'
                    );
                    
                    const normalCols = dynDetailCols.filter(col => !col.includes('VAL 1') && !col.includes('VAL 2'));
                    const valueCols = dynDetailCols.filter(col => col.includes('VAL 1') || col.includes('VAL 2'));

                    valueCols.sort((a, b) => {
                        const getWeight = (c) => {
                            const upName = c.toUpperCase();
                            if (upName.includes('SETUP')) return 1;
                            if (upName.includes('HOURLY') || upName.includes('HRS')) return 2;
                            if (upName.includes('LAST')) return 3;
                            return 4; 
                        };
                        const weightA = getWeight(a);
                        const weightB = getWeight(b);
                        if (weightA === weightB) return a.localeCompare(b);
                        return weightA - weightB;
                    });

                    dynDetailCols = [...normalCols, ...valueCols];

                    setMasterColumns(actualMasterCols);
                    setModalHeaderColumns(actualModalHeaderCols);
                    setDetailColumns(dynDetailCols);
                    setGroupedReports(groupRows(data, actualMasterCols, actualModalHeaderCols, dynDetailCols));
                    setIsGroupedView(true);
                } else {
                    setIsGroupedView(false);
                }

                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load data. Please check the backend connection.');
                setLoading(false);
            });
    }, [formKey, dateFilter, specificDate, refreshTrigger]); 

    const handleExport = () => {
        if (!rows.length) return;
        const cols    = Object.keys(rows[0]);
        const headers = cols.join(',');
        const body    = rows.map(row =>
            cols.map(c => `"${String(row[c] ?? '').replace(/"/g, '""')}"`).join(',')
        ).join('\n');
        const blob = new Blob([`${headers}\n${body}`], { type: 'text/csv' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href = url; a.download = `${config.label}.csv`; a.click();
        URL.revokeObjectURL(url);
    };

    const handleCustomBack = () => {
        const returnCategory = location.state?.fromCategory || 'daily';
        navigate(`/production-hub/${returnCategory}`);
    };

    const handleRowClick = (group) => {
        setSelectedReport(group);
        setDetailOpen(true);
    };

    const handleCloseDetail = () => {
        setDetailOpen(false);
        setSelectedReport(null);
    };

    const handleUpdateClick = (e, record) => {
        e.stopPropagation();
        setRecordToUpdate(record);
        setUpdateModalOpen(true);
    };

    const isRecordUpdated = (record) => {
       const createdAt = record?.created_at;
       const updatedAt = record?.updated_at;

    if (!createdAt || !updatedAt) {
        return false;
    }

    const diff = new Date(updatedAt) - new Date(createdAt);
         return diff > 30000; 
    };

    const recordLabel = isGroupedView
        ? `${groupedReports.length} Reports`
        : `${rows.length} Records`;

    return (
        <div className="vp-wrap">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"/>
            <style>{`
                .vp-wrap { position: fixed; inset: 0; background: #f1f5f9; z-index: 9999; display: flex; flex-direction: column; font-family: 'Inter', sans-serif; overflow: hidden; }
            *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
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

                .export-btn { background: #10b981; color: #fff; border: none; border-radius: 8px; padding: 8px 16px; font-weight: 700; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 6px; }
                .export-btn:hover { background: #059669; }
                .rec-badge { background: #f1f5f9; border-radius: 20px; padding: 6px 14px; font-size: 0.78rem; font-weight: 700; color: #475569; }

                .vp-content { flex: 1; overflow: auto; padding: 24px; }

                .excel-wrap { background: #fff; border-radius: 14px; border: 1px solid #e2e8f0; overflow: auto; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
                .excel-table { border-collapse: collapse; width: 100%; min-width: max-content; font-size: 0.8rem; }
                .excel-table thead { position: sticky; top: 0; z-index: 10; }
                .excel-table thead th { background: #f8fafc; padding: 10px 14px; text-align: center; font-weight: 700; color: #374151; border-right: 1px solid #e5e7eb; border-bottom: 2px solid #cbd5e1; white-space: nowrap; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em; }
                .excel-table thead th.sr-col { background: #f1f5f9; color: #94a3b8; width: 52px; text-align: center; border-right: 2px solid #cbd5e1; }
                .excel-table tbody tr { transition: background 0.12s; }
                .excel-table tbody tr:hover td { background: #eff6ff !important; }
                .excel-table tbody tr:nth-child(even) td { background: #fafafa; }
                .excel-table tbody tr:nth-child(odd) td { background: #fff; }
                .excel-table td { padding: 9px 14px; border-right: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; color: #374151; white-space: nowrap; max-width: 200px; overflow: hidden; text-overflow: ellipsis; text-align: center; }
                .excel-table td.sr-td { text-align: center; color: #94a3b8; font-weight: 700; font-size: 0.72rem; background: #f8fafc !important; border-right: 2px solid #e2e8f0; }
                .null-val { color: #d1d5db; font-style: italic; }

                .master-row { cursor: pointer; }
                .master-row:hover td { background: #e0f2fe !important; }
                .view-detail-btn { display: inline-flex; align-items: center; gap: 5px; background: #06b6d4; color: #fff; border: none; border-radius: 6px; padding: 4px 10px; font-size: 0.73rem; font-weight: 700; cursor: pointer; white-space: nowrap; transition: background 0.15s; }
                .view-detail-btn:hover { background: #0891b2; }
                
                .update-btn { display: inline-flex; align-items: center; gap: 5px; background: #f59e0b; color: #fff; border: none; border-radius: 6px; padding: 4px 10px; font-size: 0.73rem; font-weight: 700; cursor: pointer; white-space: nowrap; transition: background 0.15s; }
                .update-btn:hover { background: #d97706; }

                .updated-badge { display: inline-flex; align-items: center; gap: 5px; background: #dcfce7; color: #15803d; border: 1.5px solid #86efac; border-radius: 6px; padding: 4px 10px; font-size: 0.73rem; font-weight: 700; white-space: nowrap; cursor: default; }
                .row-updated td { background: #f0fdf4 !important; }
                .row-updated:hover td { background: #dcfce7 !important; }

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
                    <button className="vp-back-btn" onClick={handleCustomBack}>
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
                    <div className="filter-box">
                        <i className="bi bi-calendar3 text-secondary"></i>
                        <select className="filter-select" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="last_2_days">Last 2 Days</option>
                            <option value="last_15_days">Last 15 Days</option>
                            <option value="last_1_month">Last 1 Month</option>
                            <option value="specific_date">Specific Date</option>
                            <option value="all">All Data</option>
                        </select>
                        {dateFilter === "specific_date" && (
                            <input type="date" className="filter-date-input" value={specificDate}
                                onChange={(e) => setSpecificDate(e.target.value)} />
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
                                    <tr key={i} className={`master-row${isRecordUpdated(group) ? ' row-updated' : ''}`} onClick={() => handleRowClick(group)}>
                                        <td className="sr-td">{i + 1}</td>
                                        {masterColumns.map(col => (
                                            <td key={col} title={String(group.masterRow[col] ?? '')}>
                                                {group.masterRow[col] === null || group.masterRow[col] === undefined || group.masterRow[col] === '' || group.masterRow[col] === '—'
                                                    ? <span className="null-val">—</span>
                                                    : String(group.masterRow[col])}
                                            </td>
                                        ))}
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button className="view-detail-btn" onClick={(e) => { e.stopPropagation(); handleRowClick(group); }}>
                                                    <i className="bi bi-eye"></i> View
                                                </button>
                                                {formKey === 'daily-prod-plan' && (
                                                    isRecordUpdated(group)
                                                        ? <span className="updated-badge"><i className="bi bi-lock-fill"></i> Updated</span>
                                                        : <button className="update-btn" onClick={(e) => handleUpdateClick(e, group)}>
                                                            <i className="bi bi-pencil-square"></i> Update
                                                          </button>
                                                )}
                                            </div>
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
                                    {formKey === 'daily-prod-plan' && <th className="action-col">Action</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, i) => (
                                    <tr key={i} className={isRecordUpdated(row) ? 'row-updated' : ''}>
                                        <td className="sr-td">{i + 1}</td>
                                        {flatColumns.map(col => (
                                            <td key={col} title={String(row[col] ?? '')}>
                                                {row[col] === null || row[col] === undefined || row[col] === '' || row[col] === '—'
                                                    ? <span className="null-val">—</span>
                                                    : String(row[col])}
                                            </td>
                                        ))}
                                        {formKey === 'daily-prod-plan' && (
                                            <td>
                                                {isRecordUpdated(row)
                                                    ? <span className="updated-badge"><i className="bi bi-lock-fill"></i> Updated</span>
                                                    : <button className="update-btn" onClick={(e) => handleUpdateClick(e, row)}>
                                                        <i className="bi bi-pencil-square"></i> Update
                                                      </button>
                                                }
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {detailOpen && selectedReport && (() => {
                const activeDetailCols = detailColumns.filter(col => 
                    selectedReport.details.some(detail => detail[col] !== null && detail[col] !== undefined && detail[col] !== '' && detail[col] !== '—')
                );

                return (
                    <div className="detail-overlay" onClick={handleCloseDetail}>
                        <div className="detail-modal" onClick={(e) => e.stopPropagation()}>

                            <div className="detail-header">
                                <div>
                                    <div className="detail-header-title">
                                        <i className="bi bi-clipboard-data me-2" style={{color: '#06b6d4'}}></i>
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
                                                            {detail[col] === null || detail[col] === undefined || detail[col] === '' || detail[col] === '—'
                                                                ? <span className="null-val">—</span>
                                                                : String(detail[col])}
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

            <ProductionUpdateModal 
                isOpen={updateModalOpen} 
                onClose={() => { setUpdateModalOpen(false); setRecordToUpdate(null); }} 
                formKey={formKey} 
                recordData={recordToUpdate}
                onRefresh={() => setRefreshTrigger(prev => prev + 1)} 
            />

        </div>
    );
};

export default ProductionView;