import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// =================================================================================
// IDLE REASONS & ICONS DATA
// =================================================================================
const IDLE_REASONS = {
  "Tool Breakdown": [
    "Overload / Wrong Parameters", "Material Hardness", "Coolant Issue", "Improper Clamping", "Wear and Tear", "Other"
  ],
  "Machine Breakdown": [
    "Electrical/Electronic Failure", "Motor / Drive Trip", "Mechanical Failure", "Hydraulic / Pneumatic Issue", "Software / CNC Error", "Other"
  ],
  "Machine Maintenance": [
    "Lubrication / Oiling", "Filter / Tank Cleaning", "Preventive Maintenance (PM)", "Adjustments & Tightening", "Other"
  ],
  "Tool Maintenance": [
    "Tool Sharpening / Grinding", "Insert Rotation", "Chip / Burr Clearing", "Offset Adjustment", "Other"
  ],
  "Tool Change": [
    "Tool Life Reached", "Operation Change", "Tool Breakage Replacement", "Other"
  ],
  "Material Shortage": [
    "Delay from Store", "Delay from Previous Process", "Trolley / Forklift Unavailable", "Material Hold by QC", "Other"
  ],
  "Operator Unavailable": [
    "Tea / Lunch Break", "Shift Handover", "Nature's Call", "Gone to Store / Supervisor", "Meeting / Training", "Other"
  ],
  "Other": [
    "Other"
  ]
};

const CATEGORY_ICONS = {
  "Tool Breakdown": "bi bi-hammer",
  "Machine Breakdown": "bi bi-lightning-charge-fill",
  "Machine Maintenance": "bi bi-gear-fill",
  "Tool Maintenance": "bi bi-tools",
  "Tool Change": "bi bi-arrow-repeat",
  "Material Shortage": "bi bi-boxes",
  "Operator Unavailable": "bi bi-person-x-fill",
  "Other": "bi bi-question-circle-fill"
};

// =================================================================================
// PREMIUM CUSTOM DROPDOWN COMPONENT
// =================================================================================
const CustomDropdown = ({ value, onChange, options, placeholder, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%', padding: '14px 18px', borderRadius: '12px',
          background: '#1e293b', color: value ? '#f8fafc' : '#94a3b8',
          border: `1px solid ${isOpen ? '#fcd34d' : 'rgba(245, 158, 11, 0.4)'}`,
          boxShadow: isOpen ? '0 0 0 3px rgba(245, 158, 11, 0.15)' : '0 4px 15px rgba(0,0,0,0.2)',
          fontSize: '15px', fontWeight: '600', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          transition: 'all 0.3s ease', userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {value && icon && CATEGORY_ICONS[value] && (
             <i className={CATEGORY_ICONS[value]} style={{ color: '#fcd34d' }}></i>
          )}
          <span>{value || placeholder}</span>
        </div>
        <div style={{
           transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
           transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
           color: isOpen ? '#fcd34d' : '#94a3b8',
           display: 'flex', alignItems: 'center'
        }}>
          ▼
        </div>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px',
          background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
          maxHeight: '250px', overflowY: 'auto', zIndex: 9999,
          animation: 'slideDownDropdown 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
          transformOrigin: 'top center'
        }}>
          {options.map((opt, idx) => (
            <div
              key={idx}
              onClick={() => { onChange(opt); setIsOpen(false); }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.background = 'rgba(245, 158, 11, 0.15)'; 
                e.currentTarget.style.color = '#fbbf24'; 
                e.currentTarget.style.paddingLeft = '24px';
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.background = 'transparent'; 
                e.currentTarget.style.color = value === opt ? '#fbbf24' : '#f8fafc'; 
                e.currentTarget.style.paddingLeft = '18px';
              }}
              style={{
                padding: '14px 18px', cursor: 'pointer', fontSize: '14px', fontWeight: '500',
                color: value === opt ? '#fbbf24' : '#f8fafc',
                background: value === opt ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
                borderBottom: idx !== options.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '10px'
              }}
            >
              {icon && CATEGORY_ICONS[opt] && (
                 <i className={CATEGORY_ICONS[opt]} style={{ opacity: 0.7 }}></i>
              )}
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// =================================================================================
// MAIN COMPONENT
// =================================================================================
export default function Plant2Live() {
  const navigate = useNavigate();
  const location = useLocation(); 

  const [isDark, setIsDark] = useState(true);
  const [machines, setMachines] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [machineChanges, setMachineChanges] = useState([]);
  const [showChanges, setShowChanges] = useState(false);
  
  const [showHistoryView, setShowHistoryView] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(''); 
  const [historyDate, setHistoryDate] = useState(new Date().toISOString().split('T')[0]);

  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [isMounted, setIsMounted] = useState(false);
  const [currentShift, setCurrentShift] = useState('A');
  const [liveIdleSeconds, setLiveIdleSeconds] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());

  const [idleCategory, setIdleCategory] = useState('');
  const [customCategory, setCustomCategory] = useState(''); 
  const [idleSubReason, setIdleSubReason] = useState('');
  const [idleRemarks, setIdleRemarks] = useState('');
  const [isSubmittingReason, setIsSubmittingReason] = useState(false);
  
  // 🔥 FIX 1: UI Status ko LocalStorage mein daal diya taaki REFRESH hone pe data gayab na ho
  const [reasonLoggedStates, setReasonLoggedStates] = useState(() => {
    try {
      const saved = localStorage.getItem('reasonLoggedStates_plant2');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return {};
  });

  // Hamesha LocalStorage ko updated rakhega
  useEffect(() => {
    localStorage.setItem('reasonLoggedStates_plant2', JSON.stringify(reasonLoggedStates));
  }, [reasonLoggedStates]);

  const intervalRef = useRef(null);
  const lastSavedHour = useRef(new Date().getHours());

  const formatLiveIdle = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const getMachineStatus = (m) => {
    if (!m.machine_on) return 'OFFLINE'; 
    if (m.is_producing) return 'RUNNING';
    return 'IDLE';
  };

  const getMachineColor = (machine) => {
    if (!machine.machine_on) return '#475569'; 
    if (machine.is_producing) return '#10b981'; 
    return '#f59e0b'; 
  };

  const getMachineGlow = (machine) => {
    if (!machine.machine_on) return 'none'; 
    if (machine.is_producing) return '0 0 15px rgba(16, 185, 129, 0.4)';
    return '0 0 15px rgba(245, 158, 11, 0.4)';
  };

  useEffect(() => { setIsMounted(true); return () => setIsMounted(false); }, []);
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateShift = () => {   
      const now = new Date();
      const mins = now.getHours() * 60 + now.getMinutes();
      setCurrentShift(mins >= 510 && mins < 1200 ? 'A' : 'B');
      setCurrentHour(now.getHours());
    };
    
    updateShift();
    const shiftInterval = setInterval(updateShift, 60000);
    return () => clearInterval(shiftInterval);
  }, []);
  
  const fetchData = async () => {
    if (!isMounted) return;
    try {
      const response = await fetch(`${API_BASE}/api/plant2-live/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.machines)) {
        if (isMounted) { 
            setMachines(data.machines); 
            setError(''); 

            setReasonLoggedStates(prev => {
                const newState = { ...prev };
                data.machines.forEach(m => {
                    // Agar backend se pending hai, toh add karo
                    if (m.has_pending_reason) {
                        newState[m.machine_no] = m.machine_on ? 'IDLE' : 'OFFLINE';
                    } 
                    // Agar machine produce karne lag jaye, toh localstate saaf kar do
                    else if (m.is_producing || (newState[m.machine_no] === 'OFFLINE' && m.machine_on)) {
                        delete newState[m.machine_no];
                    }
                });
                return newState;
            });
        }
      }
    } catch (err) {
      if (isMounted) setError(`Failed: ${err.message}`);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  useEffect(() => {
    if (!isMounted) return;
    let isFetching = false;
    let timerId;

    const pollData = async () => {
      if (isFetching) return; 
      
      if (showHistoryView || selectedMachine) {
        timerId = setTimeout(pollData, 2000);
        return;
      }
      isFetching = true;
      await fetchData();
      isFetching = false;

      if (isMounted) timerId = setTimeout(pollData, 2000);
    };

    pollData();
    return () => clearTimeout(timerId);
  }, [isMounted, showHistoryView, selectedMachine]);

  useEffect(() => {
    const idleTimer = setInterval(() => {
      const now = new Date();
      const newLiveIdle = {};
      
      setReasonLoggedStates(prev => {
        let changed = false;
        const newState = { ...prev };
        
        machines.forEach(machine => {
          const machineNo = machine.machine_no;
          const loggedType = newState[machineNo]; 
          
          if (loggedType === 'IDLE' && machine.is_producing) {
            delete newState[machineNo]; 
            changed = true;
          }
          else if (loggedType === 'OFFLINE' && machine.machine_on) {
            delete newState[machineNo];
            changed = true;
          }

          if (!machine.is_producing) {
            const currentHourStart = new Date(now);
            currentHourStart.setMinutes(0, 0, 0);
            let idleSeconds = 0;
            let baseTime = currentHourStart;
            
            if (!machine.machine_on && machine.offline_since) {
              const [hours, minutes, seconds] = machine.offline_since.split(':').map(Number);
              const lastTime = new Date(now);
              lastTime.setHours(hours, minutes, seconds || 0, 0);
              baseTime = lastTime;
            } else if (machine.last_activity && machine.last_activity !== 'Never') {
              const [hours, minutes, seconds] = machine.last_activity.split(':').map(Number);
              const lastTime = new Date(now);
              lastTime.setHours(hours, minutes, seconds || 0, 0);
              baseTime = lastTime;
            } else if (machine.on_since) {
              const [hours, minutes, seconds] = machine.on_since.split(':').map(Number);
              const onTime = new Date(now);
              onTime.setHours(hours, minutes, seconds || 0, 0);
              baseTime = onTime;
            }
            
            idleSeconds = baseTime >= currentHourStart ? Math.floor((now - baseTime) / 1000) : Math.floor((now - currentHourStart) / 1000);
            newLiveIdle[machineNo] = Math.max(0, Math.min(idleSeconds, 3600));
          } else {
            newLiveIdle[machineNo] = 0;
          }
        });
        
        setLiveIdleSeconds(newLiveIdle);
        return changed ? newState : prev;
      });
      
    }, 1000);
    return () => clearInterval(idleTimer);
  }, [machines, currentHour]);

  useEffect(() => {
    const checkHourChange = async () => {
      const now = new Date();
      const hour = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      
      if (minutes === 0 && seconds <= 5 && lastSavedHour.current !== hour) {
        try {
          const response = await fetch(`${API_BASE}/api/save-hourly-snapshot/`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }
          });
          const data = await response.json();
          if (data.success) {
            setLiveIdleSeconds({});
            lastSavedHour.current = hour;
            setCurrentHour(hour);
            setTimeout(() => { fetchData(); }, 1000);
          }
        } catch (error) { console.error('❌ Request error:', error); }
      }
    };
    const hourCheckInterval = setInterval(checkHourChange, 1000);
    return () => clearInterval(hourCheckInterval);
  }, []);

  const checkLunchTime = () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    return hour === 12 && minute >= 30;
  };

  const handleMachineClick = (machine) => {
    setSelectedMachine(machine);
    setShowChanges(false);
    setShowHistoryView(false); 
    
    setIdleCategory('');
    setCustomCategory(''); 
    setIdleSubReason('');
    setIdleRemarks('');

    fetch(`${API_BASE}/api/machine-changes/?machine_no=${machine.machine_no}`)
      .then(res => res.json())
      .then(data => { if (data.success) setMachineChanges(data.changes); })
      .catch(err => console.error('Error fetching changes:', err));
  };

  useEffect(() => {
    if (location.state?.autoOpenMachine && machines.length > 0) {
      const targetNum = parseInt(String(location.state.autoOpenMachine).replace(/\D/g, ''), 10);
      const targetMachine = machines.find(m => {
        const mNum = parseInt(String(m.machine_no).replace(/\D/g, ''), 10);
        return mNum === targetNum;
      });

      if (targetMachine) {
        handleMachineClick(targetMachine);
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location.state, machines, navigate, location.pathname]);


  const fetchMachineHistory = (machineNo, dateStr) => {
    setHistoryLoading(true);
    setHistoryError(''); 
    
    fetch(`${API_BASE}/api/machine-history/?plant_no=2&machine_no=${machineNo}&date=${dateStr}`)
      .then(res => {
          if (!res.ok) throw new Error(`Server API Error: ${res.status}`);
          return res.json();
      })
      .then(data => {
        if (data.success) { setHistoryData(data.events); } 
        else { setHistoryData([]); setHistoryError(data.error || 'API returned success: false'); }
      })
      .catch(err => {
        console.error('Error fetching history:', err);
        setHistoryData([]); setHistoryError(err.message);
      })
      .finally(() => setHistoryLoading(false));
  };

  const toggleHistoryView = () => {
    const newShowHistory = !showHistoryView;
    setShowHistoryView(newShowHistory);
    if (newShowHistory && selectedMachine) fetchMachineHistory(selectedMachine.machine_no, historyDate);
  };

  const closeModal = () => {
    setSelectedMachine(null);
    setMachineChanges([]);
    setShowChanges(false);
    setShowHistoryView(false);
    setIdleCategory('');
    setCustomCategory(''); 
    setIdleSubReason('');
    setIdleRemarks('');
  };

  const isFormValid = 
    idleCategory && 
    idleSubReason && 
    (idleCategory !== 'Other' || customCategory.trim() !== '') && 
    (idleSubReason !== 'Other' || idleRemarks.trim() !== '');


  // =================================================================================
  // 🔥 FIX 2: POWERFUL NOTIFICATION CLEARER - Promise.all ke saath tez aur exact match
  // =================================================================================
  const clearNotificationsForMachine = async (machineNo) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      
      const res = await fetch(`${API_BASE}/api/my-notifications/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (data.success && data.data) {
        const targetNum = parseInt(String(machineNo).replace(/\D/g, ''), 10);
        
        const machineNotifs = data.data.filter(n => {
           if (n.is_read) return false;
           // Db me 'Machine-03' ho ya '3', dono ko proper int me convert kar dega
           const dbNumMatch = String(n.machine_no).match(/\d+/);
           const dbNum = dbNumMatch ? parseInt(dbNumMatch[0], 10) : null;
           
           return dbNum === targetNum;
        });
        
        // Ek saath saari pakdi gayi notifications ko API se uda do
        await Promise.all(machineNotifs.map(n => 
          fetch(`${API_BASE}/api/read-notification/${n.id}/`, {
            method: 'POST',
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        ));
      }
    } catch (err) {
      console.error("Failed to clear notifications automatically", err);
    }
  };


  const handleReasonSubmit = async () => {
    if (!idleCategory || !idleSubReason) { alert("Please select both Category and Reason!"); return; }
    if (idleCategory === 'Other' && !customCategory.trim()) { alert("Please specify the custom category."); return; }
    if (idleSubReason === 'Other' && !idleRemarks.trim()) { alert("Please provide the exact issue for the 'Other' reason."); return; }
    
    setIsSubmittingReason(true);

    let finalRemarks = idleRemarks.trim();
    if (idleCategory === 'Other') {
      finalRemarks = `[Category: ${customCategory.trim()}] Issue: ${finalRemarks}`;
    }

    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`${API_BASE}/api/log-idle-reason/`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          machine_no: selectedMachine.machine_no,
          plant_no: 2,
          category: idleCategory,
          reason: idleSubReason,
          remarks: finalRemarks, 
          machine_status: selectedMachine.machine_on ? 'ONLINE' : 'OFFLINE',
          timestamp: new Date().toISOString()
        })
      });

      const data = await response.json();
      
      // 🔥 FIX 3: Pehle 'clearNotifications' ko chalne do aur ruko (await lagaya hai)
      await clearNotificationsForMachine(selectedMachine.machine_no);

      if (data.success || !data.success) { 
        setReasonLoggedStates(prev => ({
            ...prev,
            [selectedMachine.machine_no]: selectedMachine.machine_on ? 'IDLE' : 'OFFLINE'
        }));
        
        setIdleCategory('');
        setCustomCategory('');
        setIdleSubReason('');
        setIdleRemarks('');
      }
    } catch (err) {
      console.error("Error logging reason:", err);
      setReasonLoggedStates(prev => ({ 
          ...prev, 
          [selectedMachine.machine_no]: selectedMachine.machine_on ? 'IDLE' : 'OFFLINE' 
      }));
    } finally {
      setIsSubmittingReason(false);
    }
  };

  const eventIcons = { 'ON': '🟢', 'OFF': '🔴', 'SHUT_HEIGHT_CHANGE': '🔧', 'TOOL_CHANGE': '⚙️' };

  const totalMachines = machines.length;
  const onMachines = machines.filter(m => m.machine_on).length;
  const runningMachines = machines.filter(m => m.is_producing).length;
  const idleMachines = onMachines - runningMachines;
  const offlineMachines = totalMachines - onMachines;
  const sortedMachines = [...machines].sort((a, b) => a.machine_no - b.machine_no);
  const isCurrentlyLunch = checkLunchTime();

  if (loading && machines.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#020617', color: '#10b981', fontSize: '24px', fontWeight: 'bold' }}>
        <div className="loader" style={{ marginBottom: '20px', border: '4px solid #1e293b', borderTop: '4px solid #10b981', borderRadius: '50%', width: '50px', height: '50px', animation: 'spin 1s linear infinite' }}></div>
        Loading Plant Dashboard...
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top, #1e293b 0%, #020617 100%)', 
      padding: '20px',
      color: '#f8fafc',
      fontFamily: "'Inter', 'Segoe UI', sans-serif"
    }}>
      <style>{`
        @keyframes hardPulse { 0%, 100% { opacity: 1; background-color: #9a3412; } 50% { opacity: 0.9; background-color: #7c2d12; box-shadow: 0 0 20px rgba(249, 115, 22, 0.6); } }
        @keyframes offlinePulse { 0%, 100% { background-color: rgba(71, 85, 105, 0.1); border-color: rgba(71, 85, 105, 0.3); } 50% { background-color: rgba(71, 85, 105, 0.3); box-shadow: 0 0 15px rgba(71, 85, 105, 0.4); border-color: rgba(100, 116, 139, 0.6); } }
        @keyframes alertTextPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.02); } }
        @keyframes lunchBannerPulse { 0%, 100% { background-color: rgba(59, 130, 246, 0.15); border-color: rgba(96, 165, 250, 0.4); } 50% { background-color: rgba(59, 130, 246, 0.3); border-color: rgba(96, 165, 250, 0.8); box-shadow: 0 0 15px rgba(59, 130, 246, 0.3); } }
        @keyframes slideDownDropdown { from { opacity: 0; transform: scaleY(0.95); } to { opacity: 1; transform: scaleY(1); } }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 12px 24px rgba(0,0,0,0.5) !important; }
        ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #0f172a; } ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        .timeline-container { position: relative; padding: 20px 0; } .timeline-line { position: absolute; left: 24px; top: 0; bottom: 0; width: 2px; background: rgba(255,255,255,0.1); }
        .timeline-item { position: relative; padding-left: 60px; margin-bottom: 30px; } .timeline-icon { position: absolute; left: 12px; top: 0; width: 26px; height: 26px; border-radius: 50%; background: #1e293b; border: 2px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 12px; z-index: 2; }
        .timeline-content { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; }
      `}</style>

      {/* HEADER SECTION */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px', padding: '24px', background: 'rgba(30, 41, 59, 0.7)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '12px', height: '40px', background: '#10b981', borderRadius: '6px', boxShadow: '0 0 10px rgba(16,185,129,0.5)' }}></div>
            <h1 style={{ margin: 0, fontSize: '32px', color: '#f8fafc', fontWeight: '800' }}>Plant 2 <span style={{ color: '#10b981' }}>Live Status</span></h1>
          </div>
          <div style={{ display: 'flex', gap: '12px', fontSize: '14px', fontWeight: '600' }}>
            <div style={{ padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px', color: '#34d399' }}>Shift: {currentShift}</div>
            <div style={{ padding: '8px 16px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>Hour: {currentHour.toString().padStart(2, '0')}:xx</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
          {[
            { label: 'ON MACHINES', value: onMachines, color: '#34d399', bg: 'rgba(16, 185, 129, 0.05)' },
            { label: 'RUNNING', value: runningMachines, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
            { label: 'IDLE', value: idleMachines, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
            { label: 'OFFLINE', value: offlineMachines, color: '#64748b', bg: 'rgba(100, 116, 139, 0.1)' },
            { label: 'TOTAL', value: totalMachines, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' }
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '16px 10px', background: stat.bg, borderRadius: '16px', border: `1px solid ${stat.color}30` }}>
              <div style={{ fontSize: '32px', fontWeight: '900', color: stat.color, lineHeight: '1' }}>{stat.value}</div>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginTop: '8px', fontWeight: '700' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* MACHINES GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {sortedMachines.map((machine) => {
          const liveIdle = liveIdleSeconds[machine.machine_no] || 0;
          const statusColor = getMachineColor(machine);
          const isOffline = !machine.machine_on;
          const isRecentlyOffline = isOffline && machine.offline_duration_minutes !== null && machine.offline_duration_minutes <= 15;
          const showIdlePulse = !isCurrentlyLunch && (!machine.is_producing);
          const hasLoggedReason = reasonLoggedStates[machine.machine_no];
          
          return (
            <div key={machine.machine_no} className="card-hover" onClick={() => handleMachineClick(machine)} style={{ position: 'relative', background: 'linear-gradient(145deg, #1e293b, #0f172a)', border: `1px solid rgba(255,255,255,0.05)`, borderTop: `4px solid ${statusColor}`, borderRadius: '20px', padding: '20px', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: `0 8px 20px rgba(0,0,0,0.4), ${getMachineGlow(machine)}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '24px', fontWeight: '900', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>Machine {machine.machine_no}</div>
                <div style={{ fontSize: '11px', padding: '6px 12px', background: `${statusColor}20`, color: statusColor, borderRadius: '20px', fontWeight: '800', border: `1px solid ${statusColor}40` }}>{getMachineStatus(machine)}</div>
              </div>

              {isRecentlyOffline && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#94a3b8', fontWeight: '700', letterSpacing: '2px', fontSize: '11px', marginBottom: '16px', textTransform: 'uppercase' }}>
                  <span style={{flex: 1, height: '1px', borderTop: '1px dashed #475569'}}></span>Recently Offline<span style={{flex: 1, height: '1px', borderTop: '1px dashed #475569'}}></span>
                </div>
              )}

              {isCurrentlyLunch && !machine.is_producing && (
                <div style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(96, 165, 250, 0.4)', color: '#93c5fd', padding: '10px', borderRadius: '12px', textAlign: 'center', fontWeight: '800', letterSpacing: '2px', marginBottom: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', textTransform: 'uppercase', animation: 'lunchBannerPulse 3s infinite', boxShadow: 'inset 0 0 10px rgba(59, 130, 246, 0.1)' }}>
                  <span style={{ fontSize: '20px' }}>🍽️</span> <span>LUNCH TIME</span>
                </div>
              )}

              <div style={{ textAlign: 'center', padding: '24px 10px', background: 'rgba(2, 6, 23, 0.4)', borderRadius: '16px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700', marginBottom: '10px' }}>Current Hour Production</div>
                <div style={{ fontSize: '56px', fontWeight: '900', color: statusColor, lineHeight: '1', textShadow: `0 0 20px ${statusColor}40` }}>{machine.current_hour_count || 0}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}><div style={{ fontSize: '11px', color: '#94a3b8' }}>Machine ON at</div><div style={{ fontSize: '16px', fontWeight: 'bold', color: '#34d399' }}>{machine.on_since || '--:--'}</div></div>
                <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}><div style={{ fontSize: '11px', color: '#94a3b8' }}>Start Production at</div><div style={{ fontSize: '16px', fontWeight: 'bold', color: '#60a5fa' }}>{machine.first_count_at || '--:--'}</div><div style={{ fontSize: '11px', color: '#60a5fa', opacity: 0.8 }}>Idle: {machine.time_to_first_count || 0} min</div></div>
              </div>

              {showIdlePulse && liveIdle > 0 && (
                <div style={{ padding: '16px', borderRadius: '12px', marginBottom: '16px', textAlign: 'center', animation: isOffline ? 'offlinePulse 2s infinite' : 'hardPulse 2s infinite', border: isOffline ? '1px solid rgba(71, 85, 105, 0.4)' : '1px solid rgba(249, 115, 22, 0.3)' }}>
                  <div style={{ fontSize: '11px', color: isOffline ? '#94a3b8' : '#fed7aa', fontWeight: '700', marginBottom: '8px' }}>{isOffline ? '⚠️ OFFLINE TIMER' : '⚠️ LIVE IDLE'}</div>
                  <div style={{ fontSize: '32px', fontWeight: '900', color: '#fff', lineHeight: '1' }}>{formatLiveIdle(liveIdle)}</div>
                  {isOffline && (<div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '8px', fontWeight: '600' }}>Offline Since: <span style={{color: '#fff'}}>{machine.offline_since || 'Shift Start'}</span></div>)}
                  
                  {!hasLoggedReason ? (
                    <div style={{ marginTop: '12px', padding: '6px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px', color: isOffline ? '#f8fafc' : '#ef4444', background: isOffline ? 'rgba(255,255,255,0.1)' : 'rgba(239, 68, 68, 0.15)', border: isOffline ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(239, 68, 68, 0.3)', animation: 'alertTextPulse 1.5s infinite' }}>
                        ⚠️ Plz fill the information
                    </div>
                  ) : (
                    <div style={{ marginTop: '12px', padding: '6px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                        ✅ Reason Submitted
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ padding: '12px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px' }}><div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>Total Idle (Hour)</div><div style={{ fontSize: '16px', fontWeight: '800', color: '#fbbf24' }}>{machine.total_shift_idle_time || 0} min</div></div>
                <div style={{ padding: '12px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px' }}><div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>Shut Height</div><div style={{ fontSize: '16px', fontWeight: '800', color: '#f8fafc' }}>{typeof machine.shut_height === 'number' ? machine.shut_height.toFixed(2) : machine.shut_height || '--'}</div></div>
                <div style={{ padding: '12px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px' }}><div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>Last Hour</div><div style={{ fontSize: '16px', fontWeight: '800', color: '#94a3b8' }}>{machine.last_hour_count || 0}</div></div>
                <div style={{ padding: '12px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px' }}><div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>Cumulative</div><div style={{ fontSize: '16px', fontWeight: '800', color: '#10b981' }}>{machine.cumulative_count || 0}</div></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL POPUP */}
      {selectedMachine && (
        <div onClick={closeModal} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#0f172a', borderRadius: '24px', padding: 0, maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)', border: `1px solid rgba(255,255,255,0.1)` }}>
            <div style={{ padding: '30px', background: `linear-gradient(135deg, ${getMachineColor(selectedMachine)} 0%, #0f172a 150%)`, borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ fontSize: '32px', fontWeight: '900', color: 'white' }}>Machine {selectedMachine.machine_no}</div>
                  {!showHistoryView && <div style={{ padding: '8px 20px', backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', borderRadius: '30px', fontWeight: '800' }}>{getMachineStatus(selectedMachine)}</div>}
                  <div title={showHistoryView ? "Back to Dashboard" : "View Timeline History"} style={{ position: 'relative', cursor: 'pointer', padding: '10px 15px', backgroundColor: showHistoryView ? '#10b981' : 'rgba(0,0,0,0.3)', color: 'white', borderRadius: '30px', fontWeight: '700', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s', display: 'flex', gap: '8px', alignItems: 'center' }} onClick={toggleHistoryView}>
                    <span style={{ fontSize: '18px' }}>{showHistoryView ? "🔙" : "📅"}</span><span>{showHistoryView ? "Live View" : "History"}</span>
                  </div>
                </div>
                <button onClick={closeModal} style={{ background: 'rgba(0,0,0,0.3)', color: 'white', border: 'none', borderRadius: '50%', width: '44px', height: '44px', fontSize: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
            </div>

            {showHistoryView ? (
              <div style={{ padding: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h2 style={{ margin: 0, color: '#f8fafc' }}>Events Timeline</h2>
                    <input type="date" value={historyDate} onChange={(e) => { setHistoryDate(e.target.value); fetchMachineHistory(selectedMachine.machine_no, e.target.value); }} style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#1e293b', color: 'white', fontFamily: 'inherit', fontWeight: 'bold' }} />
                </div>
                {historyError ? (
                    <div style={{ textAlign: 'center', padding: '50px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '16px', border: '1px dashed rgba(239, 68, 68, 0.3)' }}><div style={{ fontSize: '40px', marginBottom: '10px' }}>⚠️</div><h3 style={{ color: '#ef4444', margin: 0 }}>API Connection Error</h3><p style={{ color: '#fca5a5', fontSize: '14px' }}>{historyError}</p></div>
                ) : historyLoading ? (
                    <div style={{ textAlign: 'center', padding: '50px', color: '#94a3b8' }}><div className="loader" style={{ margin: '0 auto 20px', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #10b981', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>Loading Timeline Data...</div>
                ) : historyData.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.05)' }}><div style={{ fontSize: '40px', marginBottom: '10px' }}>📭</div><h3 style={{ color: '#94a3b8', margin: 0 }}>No Events Found</h3><p style={{ color: '#64748b', fontSize: '14px' }}>There are no recorded events for this machine on {historyDate}</p></div>
                ) : (
                    <div className="timeline-container">
                        <div className="timeline-line"></div>
                        {historyData.map((event, index) => {
                            const isOff = event.type === 'OFF';
                            const isChange = event.type.includes('CHANGE');
                            const color = isOff ? '#ef4444' : isChange ? '#3b82f6' : '#10b981';
                            return (
                                <div key={index} className="timeline-item">
                                    <div className="timeline-icon" style={{ borderColor: color }}>{eventIcons[event.type] || '📌'}</div>
                                    <div className="timeline-content" style={{ borderLeft: `3px solid ${color}` }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ fontWeight: 'bold', color: color, fontSize: '16px' }}>{event.type.replace(/_/g, ' ')}</span><span style={{ color: '#94a3b8', fontSize: '14px', background: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: '20px' }}>{event.time}</span></div>
                                        <div style={{ color: '#e2e8f0', fontSize: '14px', lineHeight: '1.5' }}>{event.details || (isOff ? 'Machine detected as Offline/No Signal' : 'Machine Power/Signal Restored')}</div>
                                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '10px', display: 'flex', gap: '15px' }}><span>Shift: {event.shift}</span><span>System Time: {event.raw_time}</span></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
              </div>
            ) : (
            <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {!selectedMachine.is_producing && (
                <div style={{ background: 'linear-gradient(145deg, rgba(245, 158, 11, 0.08), rgba(2, 6, 23, 0.8))', padding: '24px', borderRadius: '20px', border: '1px solid rgba(245, 158, 11, 0.2)', boxShadow: 'inset 0 0 30px rgba(245, 158, 11, 0.05)' }}>
                  <h3 style={{ margin: '0 0 24px 0', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px' }}>
                    <div style={{ background: 'rgba(245, 158, 11, 0.2)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)' }}><i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '18px' }}></i></div>
                    Log Downtime Reason
                    <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '6px', background: selectedMachine.machine_on ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: selectedMachine.machine_on ? '#34d399' : '#fca5a5', border: `1px solid ${selectedMachine.machine_on ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`, marginLeft: 'auto' }}>
                      {selectedMachine.machine_on ? 'ONLINE (IDLE)' : 'OFFLINE'}
                    </span>
                  </h3>
                  
                  {!reasonLoggedStates[selectedMachine.machine_no] ? (
                    <>
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ fontSize: '11px', color: '#fcd34d', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px', display: 'block', letterSpacing: '1.5px' }}>1. Select Category</label>
                        <CustomDropdown value={idleCategory} placeholder="-- Choose Category --" icon={true} options={Object.keys(IDLE_REASONS)} onChange={(val) => { setIdleCategory(val); if (val !== 'Other') setCustomCategory(''); if (val === 'Other') { setIdleSubReason('Other'); } else { setIdleSubReason(''); } setIdleRemarks(''); }} />
                      </div>

                      {idleCategory === 'Other' && (
                        <div style={{ marginBottom: '16px', animation: 'slideDownDropdown 0.3s ease-out forwards' }}>
                          <label style={{ fontSize: '11px', color: '#10b981', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px', letterSpacing: '1.5px' }}><i className="bi bi-pencil-square"></i> Please Specify Custom Category</label>
                          <input type="text" placeholder="Type custom category name..." value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.05)', color: '#fff', border: '1px solid rgba(16, 185, 129, 0.4)', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)', fontSize: '14px', outline: 'none' }} />
                        </div>
                      )}

                      {idleCategory && (
                        <div style={{ marginBottom: '16px', animation: 'slideDownDropdown 0.3s ease-out forwards' }}>
                          <label style={{ fontSize: '11px', color: '#fcd34d', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px', display: 'block', letterSpacing: '1.5px' }}>2. Specific Reason</label>
                          <CustomDropdown value={idleSubReason} placeholder="-- Choose Reason --" icon={false} options={IDLE_REASONS[idleCategory]} onChange={(val) => { setIdleSubReason(val); if (val !== 'Other') setIdleRemarks(''); }} />
                        </div>
                      )}

                      {idleSubReason === 'Other' && (
                        <div style={{ marginBottom: '24px', animation: 'slideDownDropdown 0.3s ease-out forwards' }}>
                          <label style={{ fontSize: '11px', color: '#10b981', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px', letterSpacing: '1.5px' }}><i className="bi bi-pencil-square"></i> {idleCategory === 'Other' ? '3. Please Specify Exact Issue' : '3. Please Specify Reason'}</label>
                          <textarea rows="2" placeholder="Type the exact issue here..." value={idleRemarks} onChange={(e) => setIdleRemarks(e.target.value)} style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.05)', color: '#fff', border: '1px solid rgba(16, 185, 129, 0.4)', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)', fontSize: '14px', outline: 'none', resize: 'vertical' }} />
                        </div>
                      )}

                      <button onClick={handleReasonSubmit} disabled={isSubmittingReason || !isFormValid} style={{ width: '100%', padding: '16px', borderRadius: '16px', marginTop: '10px', background: (!isFormValid) ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: (!isFormValid) ? '#475569' : '#fff', border: (!isFormValid) ? '1px dashed rgba(255,255,255,0.1)' : 'none', fontWeight: '900', fontSize: '16px', letterSpacing: '1px', textTransform: 'uppercase', cursor: (!isFormValid) ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', boxShadow: (isFormValid) ? '0 10px 25px rgba(245, 158, 11, 0.5)' : 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                        {isSubmittingReason ? <><div className="loader" style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid #fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div> Submitting...</> : <><i className="bi bi-floppy-fill"></i> Save Reason</>}
                      </button>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '10px', color: '#10b981', fontWeight: 'bold', fontSize: '14px' }}>✅ Reason has been successfully recorded for this session. It will reset when the machine starts running again.</div>
                  )}
                </div>
              )}

              {isCurrentlyLunch && !selectedMachine.is_producing && (
                <div style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(96, 165, 250, 0.4)', color: '#93c5fd', padding: '16px', borderRadius: '12px', textAlign: 'center', fontWeight: '800', letterSpacing: '2px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', textTransform: 'uppercase', animation: 'lunchBannerPulse 3s infinite' }}>
                  <span style={{ fontSize: '24px' }}>🍽️</span> <span style={{ fontSize: '18px' }}>LUNCH TIME BREAK</span>
                </div>
              )}
              
              <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ margin: '0 0 16px 0', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}><span>⏱️</span> Live Session Timings</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}><div><div style={{fontSize: '12px', color: '#94a3b8'}}>Machine Turned ON</div><div style={{fontSize: '20px', fontWeight: '700', color: '#34d399'}}>{selectedMachine.on_since || '--:--'}</div></div><div style={{textAlign: 'right'}}><div style={{fontSize: '20px', fontWeight: '700', color: '#34d399'}}>{selectedMachine.on_duration_minutes || 0}</div><div style={{fontSize: '10px', color: '#94a3b8'}}>minutes ago</div></div></div>
                  <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}><div><div style={{fontSize: '12px', color: '#94a3b8'}}>First Count Received</div><div style={{fontSize: '20px', fontWeight: '700', color: '#60a5fa'}}>{selectedMachine.first_count_at || '--:--'}</div></div><div style={{textAlign: 'right'}}><div style={{fontSize: '20px', fontWeight: '700', color: '#60a5fa'}}>{selectedMachine.time_to_first_count || 0}</div><div style={{fontSize: '10px', color: '#94a3b8'}}>min delay</div></div></div>
                  <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}><div><div style={{fontSize: '12px', color: '#94a3b8'}}>Last Count This Hour</div><div style={{fontSize: '20px', fontWeight: '700', color: '#fbbf24'}}>{selectedMachine.last_activity || 'Never'}</div></div><div style={{textAlign: 'right'}}><div style={{fontSize: '16px', fontWeight: '700', color: '#fbbf24'}}>{selectedMachine.current_hour_count} counts</div></div></div>
                </div>
                <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(2, 6, 23, 0.4)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>Status</span><span style={{ fontWeight: 'bold', color: selectedMachine.is_producing ? '#10b981' : '#f59e0b' }}>{selectedMachine.is_producing ? '✅ Currently Producing' : '⚠️ Idle / Offline'}</span></div>
              </div>
              <div style={{ textAlign: 'center', padding: '30px', background: 'linear-gradient(145deg, #1e293b, #0f172a)', borderRadius: '20px', border: `1px solid rgba(255,255,255,0.05)`, marginTop: '24px', boxShadow: `inset 0 4px 20px rgba(0,0,0,0.5)` }}><div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px', fontWeight: '700', textTransform: 'uppercase' }}>Current Hour Production</div><div style={{ fontSize: '72px', fontWeight: '900', color: getMachineColor(selectedMachine), textShadow: `0 0 30px ${getMachineColor(selectedMachine)}40`, lineHeight: '1' }}>{selectedMachine.current_hour_count || 0}</div><div style={{ fontSize: '12px', color: '#64748b', marginTop: '10px' }}>Resets every hour at XX:00:00</div></div>
              <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '24px' }}>
                <h3 style={{ margin: '0 0 16px 0', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px' }}><span>👤</span> Customer Information</h3>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'rgba(2, 6, 23, 0.4)', borderRadius: '8px' }}><span style={{ color: '#94a3b8' }}>Customer</span><span style={{ fontWeight: 'bold', color: '#fff' }}>{selectedMachine.tool_customer || 'N/A'}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'rgba(2, 6, 23, 0.4)', borderRadius: '8px' }}><span style={{ color: '#94a3b8' }}>Model</span><span style={{ fontWeight: 'bold', color: '#fff' }}>{selectedMachine.tool_model || 'N/A'}</span></div>
                </div>
              </div>
              <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '24px' }}>
                <h3 style={{ margin: '0 0 16px 0', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}><span>🔧</span> Tool Information</h3>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'rgba(2, 6, 23, 0.4)', borderRadius: '8px' }}><span style={{ color: '#94a3b8' }}>Part Name</span><span style={{ fontWeight: 'bold', color: '#fff' }}>{selectedMachine.tool_part_name || 'N/A'}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'rgba(2, 6, 23, 0.4)', borderRadius: '8px' }}><span style={{ color: '#94a3b8' }}>Tool Name</span><span style={{ fontWeight: 'bold', color: '#fff' }}>{selectedMachine.tool_name || 'N/A'}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'rgba(2, 6, 23, 0.4)', borderRadius: '8px' }}><span style={{ color: '#94a3b8' }}>Part Number</span><span style={{ fontWeight: 'bold', color: '#fff' }}>{selectedMachine.tool_part_number || 'N/A'}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'rgba(2, 6, 23, 0.4)', borderRadius: '8px' }}><span style={{ color: '#94a3b8' }}>Shut Height</span><span style={{ fontWeight: 'bold', color: '#fff' }}>{typeof selectedMachine.shut_height === 'number' ? selectedMachine.shut_height.toFixed(2) : selectedMachine.shut_height || 'N/A'}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'rgba(2, 6, 23, 0.4)', borderRadius: '8px' }}><span style={{ color: '#94a3b8' }}>Tool ID</span><span style={{ fontWeight: 'bold', color: '#10b981', wordBreak: 'break-all' }}>{selectedMachine.tool_id || 'N/A'}</span></div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginTop: '24px' }}>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}><div style={{ fontSize: '11px', color: '#64748b', letterSpacing: '1px', marginBottom: '10px' }}>LAST HOUR</div><div style={{ fontSize: '36px', fontWeight: '800', color: '#f8fafc' }}>{selectedMachine.last_hour_count || 0}</div></div>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}><div style={{ fontSize: '11px', color: '#64748b', letterSpacing: '1px', marginBottom: '10px' }}>CUMULATIVE</div><div style={{ fontSize: '36px', fontWeight: '800', color: '#10b981' }}>{selectedMachine.cumulative_count || 0}</div></div>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}><div style={{ fontSize: '11px', color: '#64748b', letterSpacing: '1px', marginBottom: '10px' }}>TOTAL IDLE</div><div style={{ fontSize: '36px', fontWeight: '800', color: '#f59e0b' }}>{selectedMachine.total_shift_idle_time || 0} <span style={{fontSize: '14px'}}>min</span></div></div>
              </div>
            </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}