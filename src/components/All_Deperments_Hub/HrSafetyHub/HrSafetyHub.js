import React from 'react';
import { useNavigate } from 'react-router-dom';

const HrSafetyHub = () => {
    const navigate = useNavigate();

    const hrReports = [
        { id: 1, title: 'Accident Report', formNo: 'AOT/F/HR/07', resp: 'Security Incharge', icon: 'bi-bandaid', color: '#ef4444', bg: '#fef2f2' },
        { id: 2, title: 'Accident Register', formNo: 'AOT/F/HR/8A', resp: 'Security Incharge', icon: 'bi-journal-medical', color: '#ef4444', bg: '#fef2f2' },
        { id: 3, title: 'Training feedback & Effectiveness', formNo: 'AOT/F/HR/11', resp: 'HR Asst./Dy Manager', icon: 'bi-chat-left-dots', color: '#3b82f6', bg: '#eff6ff' },
        { id: 4, title: 'Training History Card', formNo: 'AOT/F/HR/12', resp: 'HR Asst./Dy Manager', icon: 'bi-person-vcard', color: '#8b5cf6', bg: '#ede9fe' },
        { id: 5, title: 'Induction Training Form', formNo: 'AOT/F/HR/13', resp: 'HR Asst./Dy Manager', icon: 'bi-person-bounding-box', color: '#f59e0b', bg: '#fef3c7' },
        { id: 6, title: 'On Job Training (OJT)', formNo: 'AOT/F/TR/02C', resp: 'HR Engineer', icon: 'bi-briefcase', color: '#10b981', bg: '#d1fae5' }
    ];

    return (
        <div className="hub-wrapper">
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" />
            <style>{`
                .hub-wrapper { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; background: #f8fafc !important; z-index: 9999 !important; overflow-y: auto !important; font-family: 'Inter', sans-serif; }
                .nav-bar { position: sticky; top: 0; background: #fff; height: 70px; display: flex; justify-content: space-between; align-items: center; padding: 0 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.05); z-index: 10000; }
                .main-container { padding: 40px 24px; max-width: 1200px; margin: 0 auto; }
                .card-custom { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.5rem; cursor: pointer; transition: 0.3s; height: 100%; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
                .card-custom:hover { transform: translateY(-5px); border-color:#10b981; box-shadow: 0 15px 25px rgba(0,0,0,0.1); }
                .meta-tag { background: #f1f5f9; padding: 6px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; color: #475569; display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
            `}</style>
            
            <nav className="nav-bar">
                <h4 style={{fontWeight: 900, color: '#10b981', margin: 0, cursor: 'pointer'}} onClick={() => navigate('/dashboard')}><i className="bi bi-arrow-left-circle text-muted me-2"></i>Hiring & TRG/Safety</h4>
            </nav>

            <div className="main-container">
                <div className="row g-4">
                    {hrReports.map((r) => (
                        <div className="col-md-6 col-lg-4" key={r.id}>
                            <div className="card-custom" onClick={() => alert(`Opening HR Form: ${r.title}`)}>
                                <div style={{width: '50px', height: '50px', borderRadius: '12px', background: r.bg, color: r.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 1rem auto'}}><i className={r.icon}></i></div>
                                <h5 style={{fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', textAlign:'center', marginBottom: '1rem'}}>{r.title}</h5>
                                <div className="meta-tag justify-content-center"><i className="bi bi-file-earmark-text text-muted"></i> <span style={{color:'#0f172a'}}>{r.formNo}</span></div>
                                <div className="meta-tag justify-content-center"><i className="bi bi-person-badge text-muted"></i> <span style={{color:'#0f172a'}}>{r.resp}</span></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default HrSafetyHub;