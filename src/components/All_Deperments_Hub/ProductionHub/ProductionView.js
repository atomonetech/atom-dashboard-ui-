import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// 🔥 Production ke saare form configs yahan
const PROD_CONFIG = {
    'daily-prod-plan':          { label: 'Daily Production Plan / Report', color: '#3b82f6', bg: '#eff6ff',  icon: 'bi-graph-up-arrow',      formNo: 'AOT-F-PROD-03' },
    'operator-5s':              { label: 'Operator 5S Checklist',           color: '#f59e0b', bg: '#fef3c7',  icon: 'bi-stars',               formNo: 'AOT-F-PROD-13A' },
    'bin-trolley-cleaning':     { label: 'Bins Trolley Cleaning',           color: '#06b6d4', bg: '#cffafe',  icon: 'bi-cart-check',          formNo: 'AOT-F-PROD-02A' },
    'tip-change-monitor':       { label: 'Tip Change Monitoring Sheet',     color: '#8b5cf6', bg: '#ede9fe',  icon: 'bi-sliders',             formNo: 'AOT-F-QA-05B' },
    '4m-change-inspection':     { label: '4M Change Inspection Report',     color: '#ef4444', bg: '#fef2f2',  icon: 'bi-file-earmark-diff',   formNo: 'AOT-F-4M-06' },
    '4m-change-summary':        { label: '4M Change Summary Sheet',         color: '#ef4444', bg: '#fef2f2',  icon: 'bi-table',               formNo: 'AOT-F-4M-05A' },
    '4m-change-tracking':       { label: '4M Change Tracking Sheet',        color: '#ef4444', bg: '#fef2f2',  icon: 'bi-signpost-split',      formNo: 'AOT-F-4M-05' },
    '4m-change-display':        { label: '4M Change Display Board',         color: '#ef4444', bg: '#fef2f2',  icon: 'bi-easel2',              formNo: 'ATO-F-4M-08' },
};

const ProductionView = () => {
    const { formKey }               = useParams();
    const navigate                  = useNavigate();
    const [rows, setRows]           = useState([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState(null);
    const [search, setSearch]       = useState('');

    const config = PROD_CONFIG[formKey] || {
        label: formKey?.replace(/-/g, ' ') || 'Production Report',
        color: '#3b82f6', bg: '#eff6ff', icon: 'bi-file-earmark-bar-graph', formNo: 'N/A'
    };

    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

    // 🔥 Search filter
    const filteredRows = search.trim()
        ? rows.filter(row =>
            columns.some(col =>
                String(row[col] ?? '').toLowerCase().includes(search.toLowerCase())
            )
        )
        : rows;

    useEffect(() => {
        setLoading(true);
        setError(null);
        // 🔥 Apna backend API address update karna yahan!
        fetch(`http://192.168.0.34:8000/api/production-data/${formKey}/`)
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
    }, [formKey]);

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
        <div className="pv-wrap">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"/>

            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                .pv-wrap { position: fixed; inset: 0; background: #f1f5f9; z-index: 9999; display: flex; flex-direction: column; font-family: 'Inter', sans-serif; overflow: hidden; }

                /* NAV */
                .pv-nav { background: #fff; height: 64px; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); flex-shrink: 0; }
                .pv-nav-left { display: flex; align-items: center; gap: 12px; }
                .pv-nav-right { display: flex; align-items: center; gap: 10px; }
                .back-btn { background: #f1f5f9; border: none; border-radius: 8px; padding: 7px 13px; font-size: 0.85rem; font-weight: 700; color: #475569; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background 0.2s; }
                .back-btn:hover { background: #e2e8f0; }
                .pv-form-badge { display: flex; align-items: center; gap: 10px; }
                .pv-icon-box { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; }
                .pv-form-name { font-weight: 800; font-size: 1rem; color: #0f172a; }
                .pv-form-no { font-size: 0.73rem; color: #94a3b8; font-weight: 600; }
                .divider { width: 1px; height: 32px; background: #e2e8f0; }

                /* SEARCH */
                .search-box { display: flex; align-items: center; gap: 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 6px 12px; }
                .search-box input { border: none; background: transparent; outline: none; font-size: 0.82rem; color: #374151; width: 160px; font-family: 'Inter', sans-serif; }
                .search-box i { color: #94a3b8; font-size: 0.85rem; }

                /* BUTTONS */
                .export-btn { background: #3b82f6; color: #fff; border: none; border-radius: 8px; padding: 8px 16px; font-weight: 700; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background 0.2s; }
                .export-btn:hover { background: #2563eb; }
                .rec-badge { background: #f1f5f9; border-radius: 20px; padding: 6px 14px; font-size: 0.78rem; font-weight: 700; color: #475569; }

                /* CONTENT */
                .pv-content { flex: 1; overflow: auto; padding: 24px; }
                .excel-wrap { background: #fff; border-radius: 14px; border: 1px solid #e2e8f0; overflow: auto; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }

                /* TABLE */
                .excel-table { border-collapse: collapse; width: 100%; min-width: max-content; font-size: 0.8rem; }
                .excel-table thead { position: sticky; top: 0; z-index: 10; }
                .excel-table thead th { background: #f8fafc; padding: 10px 14px; text-align: center; font-weight: 700; color: #374151; border-right: 1px solid #e5e7eb; border-bottom: 2px solid #cbd5e1; white-space: nowrap; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em; }
                .excel-table thead th.sr-col { background: #f1f5f9; color: #94a3b8; width: 52px; text-align: center; border-right: 2px solid #cbd5e1; }
                .excel-table tbody tr { transition: background 0.12s; }
                .excel-table tbody tr:hover td { background: #dbeafe !important; }
                .excel-table tbody tr:nth-child(even) td { background: #fafafa; }
                .excel-table tbody tr:nth-child(odd) td { background: #fff; }
                .excel-table td { padding: 9px 14px; border-right: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; color: #374151; white-space: nowrap; max-width: 200px; overflow: hidden; text-overflow: ellipsis; text-align: center; }
                .excel-table td.sr-td { text-align: center; color: #94a3b8; font-weight: 700; font-size: 0.72rem; background: #f8fafc !important; border-right: 2px solid #e2e8f0; }
                .null-val { color: #d1d5db; font-style: italic; }

                /* STATES */
                .loading-box { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; gap: 14px; color: #64748b; font-weight: 600; }
                .error-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 20px 24px; color: #dc2626; font-weight: 600; display: flex; align-items: center; gap: 10px; }
                .empty-box { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px; color: #94a3b8; gap: 10px; }
                .empty-box i { font-size: 2.5rem; }

                /* NO RESULT */
                .no-result-box { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; color: #94a3b8; gap: 8px; }
                .no-result-box i { font-size: 2rem; }
            `}</style>

            {/* NAVBAR */}
            <nav className="pv-nav">
                <div className="pv-nav-left">
                    <button className="back-btn" onClick={() => navigate('/production-hub')}>
                        <i className="bi bi-arrow-left"></i> Back
                    </button>
                    <div className="divider"></div>
                    <div className="pv-form-badge">
                        <div className="pv-icon-box" style={{ background: config.bg, color: config.color }}>
                            <i className={config.icon}></i>
                        </div>
                        <div>
                            <div className="pv-form-name">{config.label}</div>
                            <div className="pv-form-no">Form No: {config.formNo}</div>
                        </div>
                    </div>
                </div>
                <div className="pv-nav-right">
                    {/* Search */}
                    <div className="search-box">
                        <i className="bi bi-search"></i>
                        <input
                            type="text"
                            placeholder="Search records..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        {search && (
                            <i className="bi bi-x" style={{ cursor: 'pointer', color: '#64748b' }} onClick={() => setSearch('')}></i>
                        )}
                    </div>
                    <span className="rec-badge">
                        <i className="bi bi-database me-1"></i>
                        {search ? `${filteredRows.length} / ${rows.length}` : `${rows.length}`} Records
                    </span>
                    <button className="export-btn" onClick={handleExport}>
                        <i className="bi bi-file-earmark-excel"></i> Export CSV
                    </button>
                </div>
            </nav>

            {/* CONTENT */}
            <div className="pv-content">
                {error ? (
                    <div className="error-box">
                        <i className="bi bi-exclamation-triangle-fill"></i> {error}
                    </div>
                ) : loading ? (
                    <div className="loading-box">
                        <div className="spinner-border" style={{ color: config.color }} role="status"></div>
                        <span>Loading data, please wait...</span>
                    </div>
                ) : rows.length === 0 ? (
                    <div className="excel-wrap">
                        <div className="empty-box">
                            <i className="bi bi-inbox"></i>
                            <p>No records found</p>
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
                                {filteredRows.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length + 1}>
                                            <div className="no-result-box">
                                                <i className="bi bi-search"></i>
                                                <p>No matching records for "<b>{search}</b>"</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRows.map((row, i) => (
                                        <tr key={i}>
                                            <td className="sr-td">{i + 1}</td>
                                            {columns.map(col => (
                                                <td key={col} title={String(row[col] ?? '')}>
                                                    {row[col] === null || row[col] === undefined
                                                        ? <span className="null-val">—</span>
                                                        : String(row[col])}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductionView;