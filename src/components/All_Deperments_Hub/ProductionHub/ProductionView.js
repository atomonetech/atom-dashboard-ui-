import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// 🔥 Production ke saare form configs yahan
const PROD_CONFIG = {
    'daily-prod-plan':          { label: 'Daily Production Plan / Report', color: '#3b82f6', bg: '#eff6ff',  icon: 'bi-graph-up-arrow',      formNo: 'AOT-F-PROD-03' },
    'operator-5s':              { label: 'Operator 5S Checklist',          color: '#f59e0b', bg: '#fef3c7',  icon: 'bi-stars',               formNo: 'AOT-F-PROD-13A' },
    'bin-trolley-cleaning':     { label: 'Bins Trolley Cleaning',          color: '#06b6d4', bg: '#cffafe',  icon: 'bi-cart-check',          formNo: 'AOT-F-PROD-02A' },
    'tip-change-monitor':       { label: 'Tip Change Monitoring Sheet',    color: '#8b5cf6', bg: '#ede9fe',  icon: 'bi-sliders',             formNo: 'AOT-F-QA-05B' },
    '4m-change-inspection':     { label: '4M Change Inspection Report',    color: '#ef4444', bg: '#fef2f2',  icon: 'bi-file-earmark-diff',   formNo: 'AOT-F-4M-06' },
    '4m-change-summary':        { label: '4M Change Summary Sheet',        color: '#ef4444', bg: '#fef2f2',  icon: 'bi-table',               formNo: 'AOT-F-4M-05A' },
    '4m-change-tracking':       { label: '4M Change Tracking Sheet',       color: '#ef4444', bg: '#fef2f2',  icon: 'bi-signpost-split',      formNo: 'AOT-F-4M-05' },
    '4m-change-display':        { label: '4M Change Display Board',        color: '#ef4444', bg: '#fef2f2',  icon: 'bi-easel2',              formNo: 'ATO-F-4M-08' },
};
 
const ProductionView = () => {
    const { formKey }               = useParams();
    const navigate                  = useNavigate();
    const location                  = useLocation(); // Location use kar rahe hain
    const [rows, setRows]           = useState([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState(null);
    const [search, setSearch]       = useState('');

    // 🔥 Modal States for Editing (Start Time hataya gaya hai)
    const [editingRow, setEditingRow] = useState(null);
    const initialEditState = { 
        achievedQuantity: '', qtyRemark: '',
        productionEndTime: '', totalWorkingTime: '',
        toolSetupTime: '', machineBdTime: '', toolBdTime: '', rmCoilNo: ''
    };
    const [editForm, setEditForm] = useState(initialEditState);
    const [isSaving, setIsSaving] = useState(false);

    const config = PROD_CONFIG[formKey] || {
        label: formKey?.replace(/-/g, ' ') || 'Production Report',
        color: '#3b82f6', bg: '#eff6ff', icon: 'bi-file-earmark-bar-graph', formNo: 'N/A'
    };

    const columns = rows.length > 0 && rows[0]
        ? Object.keys(rows[0]).filter(colName => colName.toLowerCase() !== 'id') 
        : [];

    const filteredRows = search.trim()
        ? rows.filter(row =>
            columns.some(col =>
                String(row[col] ?? '').toLowerCase().includes(search.toLowerCase())
            )
        )
        : rows;

    useEffect(() => {
        fetchData();
    }, [formKey]);

    const fetchData = () => {
        setLoading(true);
        setError(null);
        fetch(`${API_BASE_URL}/api/production-data/${formKey}/`)
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
    };

    const handleEditClick = (row) => {
        setEditingRow(row);
        setEditForm({
            achievedQuantity: row['Achieved Qty.'] || row.achieved_quantity || '', 
            qtyRemark: row['Qty Remark'] && row['Qty Remark'] !== '—' ? row['Qty Remark'] : '',
            productionEndTime: row['End Time'] && row['End Time'] !== '—' ? row['End Time'] : '',
            totalWorkingTime: row['Total Time'] && row['Total Time'] !== '—' ? row['Total Time'] : '',
            toolSetupTime: row['Tool Setup (min)'] || '',
            machineBdTime: row['Machine B/D (min)'] || '',
            toolBdTime: row['Tool B/D (min)'] || '',
            rmCoilNo: row['RM Coil No'] && row['RM Coil No'] !== '—' ? row['RM Coil No'] : ''
        });
    };

    const closeModal = () => {
        setEditingRow(null);
        setEditForm(initialEditState);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        const rowId = editingRow.id || editingRow.ID; 
        if (!rowId) {
            alert("Row ID not found. Cannot update.");
            return;
        }

        setIsSaving(true);
        
        // 🚀 SMART FIX: Username aur Department localstorage se nikal liya
        const currentUsername = localStorage.getItem('username') || 'Unknown';
        const currentRole = localStorage.getItem('user_role') || 'Unknown';
        
        // 🔥 YAHAN TOKEN NIKALA HAI 🔥
        const token = localStorage.getItem('access_token'); 
        
        const payload = {
            achieved_quantity: editForm.achievedQuantity ? parseInt(editForm.achievedQuantity) : 0,
            qty_remark: editForm.qtyRemark,
            production_end_time: editForm.productionEndTime || null,
            total_working_time: editForm.totalWorkingTime,
            tool_setup_time: editForm.toolSetupTime ? parseInt(editForm.toolSetupTime) : 0,
            machine_bd_time: editForm.machineBdTime ? parseInt(editForm.machineBdTime) : 0,
            tool_bd_time: editForm.toolBdTime ? parseInt(editForm.toolBdTime) : 0,
            rm_coil_no: editForm.rmCoilNo,
            
            // 🔥 YEH DO LINES ADD KI HAIN TRACKING KE LIYE 🔥
            username: currentUsername,
            department: currentRole
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/update-daily-production/${rowId}/`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // 🔥 YAHAN TOKEN BHEJA HAI 🔥
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok) {
                setRows(prevRows => prevRows.map(row => {
                    const currentId = row.id || row.ID;
                    if (currentId === rowId) {
                        return { 
                            ...row, 
                            'Achieved Qty.': editForm.achievedQuantity,
                            'Qty Remark': editForm.qtyRemark || '', 
                            'End Time': editForm.productionEndTime || '',
                            'Total Time': editForm.totalWorkingTime || '',
                            'Tool Setup (min)': editForm.toolSetupTime || 0,
                            'Machine B/D (min)': editForm.machineBdTime || 0,
                            'Tool B/D (min)': editForm.toolBdTime || 0,
                            'RM Coil No': editForm.rmCoilNo || '',
                            
                        };
                    }
                    return row;
                }));
                closeModal();
            } else {
                alert('Update failed: ' + (result.error || 'Unknown error'));
            }
        } catch (err) {
            console.error(err);
            alert('Failed to connect to server.');
        } finally {
            setIsSaving(false);
        }
    };

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

    // Custom Back Button Logic
    const handleCustomBack = () => {
        const returnCategory = location.state?.fromCategory || 'daily';
        navigate(`/production-hub/${returnCategory}`);
    };

    return (
        <div className="pv-wrap">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"/>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"/>

            <style>{`
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                .pv-wrap { position: fixed; inset: 0; background: #f1f5f9; z-index: 9999; display: flex; flex-direction: column; font-family: 'Inter', sans-serif; overflow: hidden; }

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

                .search-box { display: flex; align-items: center; gap: 8px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 6px 12px; }
                .search-box input { border: none; background: transparent; outline: none; font-size: 0.82rem; color: #374151; width: 160px; font-family: 'Inter', sans-serif; }
                .search-box i { color: #94a3b8; font-size: 0.85rem; }

                .export-btn { background: #3b82f6; color: #fff; border: none; border-radius: 8px; padding: 8px 16px; font-weight: 700; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: background 0.2s; }
                .export-btn:hover { background: #2563eb; }
                .rec-badge { background: #f1f5f9; border-radius: 20px; padding: 6px 14px; font-size: 0.78rem; font-weight: 700; color: #475569; }

                .pv-content { flex: 1; overflow: auto; padding: 24px; }
                .excel-wrap { background: #fff; border-radius: 14px; border: 1px solid #e2e8f0; overflow: auto; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }

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

                .action-btn { background: transparent; border: none; color: #3b82f6; cursor: pointer; padding: 4px 8px; border-radius: 4px; transition: background 0.2s; }
                .action-btn:hover { background: #bfdbfe; color: #1d4ed8; }

                .loading-box { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; gap: 14px; color: #64748b; font-weight: 600; }
                .error-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 20px 24px; color: #dc2626; font-weight: 600; display: flex; align-items: center; gap: 10px; }
                .empty-box { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px; color: #94a3b8; gap: 10px; }
                .empty-box i { font-size: 2.5rem; }
                .no-result-box { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px; color: #94a3b8; gap: 8px; }
                .no-result-box i { font-size: 2rem; }

                .cust-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000; backdrop-filter: blur(2px); }
                .cust-modal-content { background: #fff; width: 650px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); overflow: hidden; animation: pop 0.2s ease-out; }
                .cust-modal-header { padding: 16px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
                .cust-modal-title { font-weight: 700; color: #1e293b; font-size: 1rem; margin: 0; }
                .cust-modal-close { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #94a3b8; }
                .cust-modal-close:hover { color: #ef4444; }
                .cust-modal-body { padding: 20px; max-height: 70vh; overflow-y: auto; }
                .cust-modal-footer { padding: 16px 20px; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 10px; }
                
                @keyframes pop {
                    0% { transform: scale(0.95); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>

            <nav className="pv-nav">
                <div className="pv-nav-left">
                    <button className="back-btn" onClick={handleCustomBack}>
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
                                    {formKey === 'daily-prod-plan' && (
                                        <th>Action</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRows.length === 0 ? (
                                    <tr>
                                        <td colSpan={formKey === 'daily-prod-plan' ? columns.length + 2 : columns.length + 1}>
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
                                                    {row[col] === null || row[col] === undefined || row[col] === '' || row[col] === '—'
                                                        ? <span className="null-val"></span>
                                                        : String(row[col])}
                                                </td>
                                            ))}
                                            {formKey === 'daily-prod-plan' && (
                                                <td className="text-center">
                                                    {!row['Achieved Qty.'] || row['Achieved Qty.'] == 0 ? (
                                                        <button 
                                                            className="action-btn" 
                                                            onClick={() => handleEditClick(row)}
                                                            title="Update Daily Details"
                                                        >
                                                            <i className="bi bi-pencil-square"></i>
                                                        </button>
                                                    ) : (
                                                        <span 
                                                            style={{ fontSize: '0.8rem', fontWeight: 600, color: '#15803d', background: '#f0fdf4', padding: '4px 8px', borderRadius: '4px', border: '1px solid #bbf7d0' }}
                                                            title="Data is locked"
                                                        >
                                                            <i className="bi bi-lock-fill me-1"></i> Locked
                                                        </span>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {editingRow && (
                <div className="cust-modal-overlay">
                    <div className="cust-modal-content">
                        <div className="cust-modal-header">
                            <h3 className="cust-modal-title">Update End of Day Plan</h3>
                            <button className="cust-modal-close" onClick={closeModal}>
                                <i className="bi bi-x-circle"></i>
                            </button>
                        </div>
                        
                        <form onSubmit={handleUpdate}>
                            <div className="cust-modal-body">
                                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem' }}>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="text-secondary">Machine:</span>
                                        <strong>{editingRow.machine_no || editingRow.Machine_No || editingRow['Machine No']}</strong>
                                    </div>
                                    <div className="d-flex justify-content-between mb-1">
                                        <span className="text-secondary">Part:</span>
                                        <strong>{editingRow.part_name || editingRow.Part_Name || editingRow['Part Name']}</strong>
                                    </div>
                                    <div className="d-flex justify-content-between text-primary">
                                        <span>Target Qty:</span>
                                        <strong>{editingRow.planned_quantity || editingRow.Planned_Quantity || editingRow['Planned Qty']}</strong>
                                    </div>
                                </div>

                                <div className="row">
                                    {/* First Row */}
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Achieved Quantity <span className="text-danger">*</span></label>
                                        <input type="number" className="form-control form-control-sm" required value={editForm.achievedQuantity} onChange={(e) => setEditForm({...editForm, achievedQuantity: e.target.value})} placeholder="Enter total pieces" />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Remarks</label>
                                        <input type="text" className="form-control form-control-sm" value={editForm.qtyRemark} onChange={(e) => setEditForm({...editForm, qtyRemark: e.target.value})} placeholder="Any issue or delay?" />
                                    </div>

                                    {/* Second Row */}
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label text-primary" style={{ fontSize: '0.85rem', fontWeight: 600 }}>End Time</label>
                                        <input type="time" className="form-control form-control-sm" value={editForm.productionEndTime} onChange={(e) => setEditForm({...editForm, productionEndTime: e.target.value})} />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label text-primary" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Total Time</label>
                                        <input type="text" className="form-control form-control-sm" value={editForm.totalWorkingTime} onChange={(e) => setEditForm({...editForm, totalWorkingTime: e.target.value})} placeholder="e.g. 8 hrs" />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label text-indigo" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4f46e5' }}>RM Coil / Lot No.</label>
                                        <input type="text" className="form-control form-control-sm" value={editForm.rmCoilNo} onChange={(e) => setEditForm({...editForm, rmCoilNo: e.target.value})} placeholder="Enter lot details" />
                                    </div>

                                    {/* Third Row */}
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label text-warning" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Tool Setup (min)</label>
                                        <input type="number" className="form-control form-control-sm" value={editForm.toolSetupTime} onChange={(e) => setEditForm({...editForm, toolSetupTime: e.target.value})} placeholder="Mins" />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label text-danger" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Machine B/D (min)</label>
                                        <input type="number" className="form-control form-control-sm" value={editForm.machineBdTime} onChange={(e) => setEditForm({...editForm, machineBdTime: e.target.value})} placeholder="Mins" />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label text-danger" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Tool B/D (min)</label>
                                        <input type="number" className="form-control form-control-sm" value={editForm.toolBdTime} onChange={(e) => setEditForm({...editForm, toolBdTime: e.target.value})} placeholder="Mins" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="cust-modal-footer">
                                <button type="button" className="btn btn-light btn-sm" onClick={closeModal} style={{ fontWeight: 600 }}>Cancel</button>
                                <button type="submit" className="btn btn-primary btn-sm d-flex align-items-center gap-2" disabled={isSaving} style={{ fontWeight: 600 }}>
                                    {isSaving ? <div className="spinner-border spinner-border-sm"></div> : <i className="bi bi-check2"></i>}
                                    {isSaving ? 'Saving...' : 'Save Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductionView;