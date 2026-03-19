import React from 'react';
import { useNavigate } from 'react-router-dom';

const QaHub = () => {
    const navigate = useNavigate();

    const qaReports = [
        { id: 1, title: 'Incoming Material Insp.', formNo: 'AOT/F/QA/01', resp: 'Quality Engineer', icon: 'bi-box-seam', color: '#3b82f6', bg: '#eff6ff' },
        { id: 2, title: 'Red Bin Analysis - NC Reg.', formNo: 'AOT/F/QC/02', resp: 'CFT', icon: 'bi-trash3', color: '#ef4444', bg: '#fef2f2' },
        { id: 3, title: 'Scrap Note', formNo: 'AOT/F/QC/04', resp: 'Quality Engineer', icon: 'bi-file-earmark-x', color: '#ef4444', bg: '#fef2f2' },
        { id: 4, title: 'Red Bin Attendance Sheet', formNo: 'AOT/F/QC/05', resp: 'Quality Engineer', icon: 'bi-person-x', color: '#f59e0b', bg: '#fef3c7' },
        { id: 5, title: 'Daily Poka Yokes Check', formNo: 'AOT/F/QC/07A', resp: 'Operator', icon: 'bi-shield-check', color: '#10b981', bg: '#d1fae5' },
        { id: 7, title: 'Set up & Patrol Insp. (FPIR)', formNo: 'AOT/F/QA/15', resp: 'Quality Engineer', icon: 'bi-clipboard-check', color: '#06b6d4', bg: '#cffafe' },
        { id: 8, title: 'Rework / Repair Report', formNo: 'AOT/F/QA/20', resp: 'Rework Operator', icon: 'bi-tools', color: '#f59e0b', bg: '#fef3c7' },
        { id: 9, title: 'Sample Inspection Report', formNo: 'AOT/F/QA/21', resp: 'Quality Engineer', icon: 'bi-search', color: '#3b82f6', bg: '#eff6ff' },
        { id: 10, title: 'Deviation Approval Form', formNo: 'AOT/F/PROD/04', resp: 'Production Engineer', icon: 'bi-file-earmark-check', color: '#8b5cf6', bg: '#ede9fe' },
        { id: 11, title: 'RM Quality Plan', formNo: 'AOT/F/QA/25', resp: 'Quality Engineer', icon: 'bi-diagram-3', color: '#10b981', bg: '#d1fae5' },
        { id: 12, title: 'Goods Receipt Note (GRN)', formNo: 'Not Reqd.', resp: 'Store Incharge', icon: 'bi-receipt', color: '#06b6d4', bg: '#cffafe' },
        { id: 13, title: 'Pre Dispatch Insp. (PDIR)', formNo: 'AOT/F/QA/40', resp: 'Quality Engineer', icon: 'bi-truck', color: '#10b981', bg: '#d1fae5' }
    ];

    const handleCardClick = (id, title) => {
        // 🟢 NAYE LINKS YAHAN ADD KIYE GAYE HAIN
        switch (id) {
            case 1:
                navigate('/Incoming-Material');
                break;
            case 2:
                navigate('/RedBin-Form');
                break;
            case 3:
                navigate('/Scrap-Note');
                break;
            case 4:
                navigate('/Redbin-Attendance');
                break;
            case 5:
                navigate('/Poka-Yoke');
                break;

            case 7: 
              navigate('/inspection-form'); 
               break;
            case 8:
                navigate('/Rework');
                break;
            case 13:
                navigate('/PdiReportForm');
                break;
             case 10:
                navigate('/Deviation-Approval-Form');
 
                break;
            case 12:
                navigate('/Good-Receipt');
                break;
            default:
                alert(`The form for "${title}" is currently under development.`);
        }
    };

    return (
        <div className="hub-wrapper">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            <style>{`
                .hub-wrapper { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: #f8fafc !important; z-index: 9999 !important; overflow-y: auto !important; font-family: 'Inter', sans-serif; }
                .nav-bar { position: sticky; top: 0; background: #fff; height: 70px; display: flex; justify-content: space-between; align-items: center; padding: 0 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05); z-index: 10000; }
                .main-container { padding: 40px 24px; max-width: 1200px; margin: 0 auto; }
                .card-custom { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.5rem; cursor: pointer; transition: 0.3s; height: 100%; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
                .card-custom:hover { transform: translateY(-5px); border-color:#3b82f6; box-shadow: 0 15px 25px rgba(0,0,0,0.1); }
                .meta-tag { background: #f1f5f9; padding: 6px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; color: #475569; display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
            `}</style>
            
            <nav className="nav-bar">
                <h4 style={{fontWeight: 900, color: '#3b82f6', margin: 0, cursor: 'pointer'}} onClick={() => navigate('/dashboard')}><i className="bi bi-arrow-left-circle text-muted me-2"></i>QA Hub (Quality Assurance)</h4>
            </nav>

            <div className="main-container">
                <div className="row g-4">
                    {qaReports.map((r) => (
                        <div className="col-md-6 col-lg-4" key={r.id}>
                            <div className="card-custom" onClick={() => handleCardClick(r.id, r.title)}>
                                <div style={{width: '50px', height: '50px', borderRadius: '12px', background: r.bg, color: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '1rem'}}><i className={r.icon}></i></div>
                                <h5 style={{fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginBottom: '1rem'}}>{r.title}</h5>
                                <div className="meta-tag"><i className="bi bi-file-earmark-text text-muted"></i>Form: <span style={{color:'#0f172a'}}>{r.formNo}</span></div>
                                <div className="meta-tag"><i className="bi bi-person-badge text-muted"></i>Resp: <span style={{color:'#0f172a'}}>{r.resp}</span></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default QaHub;