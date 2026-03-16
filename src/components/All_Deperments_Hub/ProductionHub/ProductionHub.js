import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';

const ProductionHub = () => {
    const navigate = useNavigate();
     const [showOptionsModal, setShowOptionsModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);


    const productionReports = [
        { id: 1, title: 'Daily Production Plan / Report', formNo: 'AOT-F-PROD-03', resp: 'Production Engineer', icon: 'bi-graph-up-arrow', color: '#3b82f6', bg: '#eff6ff' },
        { id: 2, title: 'Set up and patrol insp. report', formNo: 'AOT/F/QA/15', resp: 'Quality Engineer', icon: 'bi-clipboard-check', color: '#10b981', bg: '#d1fae5' },
        { id: 3, title: 'Operator 5S Checklist', formNo: 'AOT-F-PROD-13A', resp: 'Operator', icon: 'bi-stars', color: '#f59e0b', bg: '#fef3c7' },
        { id: 4, title: 'Bins Trolley Cleaning', formNo: 'AOT-F-PROD-02A', resp: 'Helper', icon: 'bi-cart-check', color: '#06b6d4', bg: '#cffafe' },
        { id: 5, title: 'Tip Change monitoring sheet', formNo: 'AOT-F-QA-05B', resp: 'Die Setting Supv.', icon: 'bi-sliders', color: '#8b5cf6', bg: '#ede9fe' },
        { id: 6, title: '4M Change inspection report', formNo: 'AOT-F-4M-06', resp: 'Quality Engineer', icon: 'bi-file-earmark-diff', color: '#ef4444', bg: '#fef2f2' },
        { id: 7, title: '4M Change summery sheet', formNo: 'AOT-F-4M-05A', resp: 'Production Engineer', icon: 'bi-table', color: '#ef4444', bg: '#fef2f2' },
        { id: 8, title: '4M Change tracking sheet', formNo: 'AOT-F-4M-05', resp: 'Production Engineer', icon: 'bi-signpost-split', color: '#ef4444', bg: '#fef2f2' },
        { id: 9, title: '4M Change display board', formNo: 'ATO-F-4M-08', resp: 'Production Engineer', icon: 'bi-easel2', color: '#ef4444', bg: '#fef2f2' }
    ];


   
  
    const navigateToForm = (id, title) => {
        switch (id) {
            case 1:
                navigate('/Daily-Prod-Plan-Form');
                break;
            case 2:
                navigate('/Setup-Patrol-Ins-Form');
                break;
            case 3:
                navigate('/Operator5S');
                break;
            case 4:
                navigate('/Bin-Trolly-Cleaning-Form');
                break;
            case 5:
                navigate('/Tip-Change-Monitor-Form');
                break;
            case 6:
                navigate('/4-M-Ins-Form');
                break;
            case 7:
                navigate('/4M-Change-Summary-Form');
                break;
            case 8:
                navigate('/4M-Change-Tracking-Form');
                break;
            case 9:
                navigate('/4M-Change-Display-Form');
                break;
            case 12:
                navigate('/Good-Receipt');
                break;

            default:
                alert(`The form for "${title}" is currently under development.`);
        }
    };
      const navigateToReport = (id, title) => {
        switch (id) {
            case 6:
                navigate('/4M-Change-Inspection-Report');
                break;
            case 7:
                navigate('/4M-Change-Summary-Report');
                break;
            case 8:
                navigate('/4M-Change-Tracking-Report');
                break;
            case 9:
                navigate('/4M-Change-Display-Report');
                break;
            default:
                alert(`The report for "${title}" is currently under development.`);
        }
    };

        const is4MChangeCard = (id) => [6, 7, 8, 9].includes(id);

    const handleCardClick = (id, title, cardData) => {
        if (is4MChangeCard(id)) {
            setSelectedCard({ id, title, ...cardData });
            setShowOptionsModal(true);
        } else {
            navigateToForm(id, title);
        }
    };

        const handleOptionSelect = (option) => {
        if (option === 'fill' && selectedCard) {
            navigateToForm(selectedCard.id, selectedCard.title);
        } else if (option === 'print' && selectedCard) {
            navigateToReport(selectedCard.id, selectedCard.title);
        }
        closeModal();
    };

    const closeModal = (e) => {
        if (e) {
            e.stopPropagation();
        }
        setShowOptionsModal(false);
        setSelectedCard(null);
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
                .card-custom:hover { transform: translateY(-5px); border-color:#8b5cf6; box-shadow: 0 15px 25px rgba(0,0,0,0.1); }
                .meta-tag { background: #f1f5f9; padding: 6px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; color: #475569; display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
                                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 100000;
                    padding: 16px;
                }
                .modal-content {
                    background: white;
                    border-radius: 20px;
                    padding: 24px;
                    max-width: 400px;
                    width: 100%;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                }
                .modal-header {
                    margin-bottom: 20px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid #e2e8f0;
                }
                .modal-header h3 {
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0;
                    font-size: 1.25rem;
                }
                .option-btn {
                    width: 100%;
                    padding: 14px 16px;
                    margin: 8px 0;
                    border: none;
                    border-radius: 12px;
                    font-size: 0.95rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                }
                .option-btn:hover {
                    transform: translateY(-2px);
                }
                .option-btn:active {
                    transform: translateY(0);
                }
                .fill-btn {
                    background: #3b82f6;
                    color: white;
                }
                .fill-btn:hover {
                    background: #2563eb;
                }
                .print-btn {
                    background: #10b981;
                    color: white;
                }
                .print-btn:hover {
                    background: #059669;
                }
                .close-btn {
                    background: #ef4444;
                    color: white;
                    margin-top: 16px;
                }
                .close-btn:hover {
                   
            `}</style>
            
            <nav className="nav-bar">
                <h4 style={{fontWeight: 900, color: '#8b5cf6', margin: 0, cursor: 'pointer'}} onClick={() => navigate('/dashboard')}><i className="bi bi-arrow-left-circle text-muted me-2"></i>Production Hub</h4>
            </nav>

            <div className="main-container">
                <div className="row g-4">
                    {productionReports.map((r) => (
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

            {showOptionsModal && selectedCard && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{selectedCard.title}</h3>
                            <p style={{
                                color: '#64748b',
                                fontSize: '0.9rem',
                                marginTop: '4px'
                            }}>
                                Form No: {selectedCard.formNo}
                            </p>
                        </div>
                        
                        <button 
                            className="option-btn fill-btn" 
                            onClick={() => handleOptionSelect('fill')}
                        >
                            <i className="bi bi-pencil-square"></i>
                            Fill Data (Open Form)
                        </button>
                        
                        <button 
                            className="option-btn print-btn" 
                            onClick={() => handleOptionSelect('print')}
                        >
                            <i className="bi bi-printer"></i>
                            Print Data (View Report)
                        </button>
                        
                        <button 
                            className="option-btn close-btn" 
                            onClick={(e) => {
                                e.stopPropagation();
                                closeModal();
                            }}
                        >
                            <i className="bi bi-x-circle"></i>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ProductionHub;