import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * @description Tool Weekly View - Is page ko cards se hata kar 
 * seedha form redirection ke liye update kiya gaya hai.
 */
const ToolWeekly = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // 🔥 Logic: Tool Weekly mein abhi sirf ek primary form hai, 
        // isliye hum intermediate card screen ko bypass kar rahe hain.
        
        const redirectTimer = setTimeout(() => {
            navigate("/Maintenance/Tool/welding-fixture-checklist", { replace: true });
        }, 500); // 0.5 second ka delay smooth transition ke liye

        return () => clearTimeout(redirectTimer);
    }, [navigate]);

    return (
        <div style={{ 
            height: '100vh', 
            width: '100vw', 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: '#f1f4f9',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999
        }}>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
            
            {/* Loading Animation */}
            <div className="spinner-grow text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
            </div>
            
            <h4 className="mt-4 fw-bold" style={{ color: '#0f172a' }}>Opening Weekly Form</h4>
            <p className="text-muted">Redirecting you to Welding Fixture Maintenance Checklist...</p>

            <style>{`
                body { overflow: hidden; }
            `}</style>
        </div>
    );
};

export default ToolWeekly;