import React, { useEffect, useState, useRef } from 'react';

const API_BASE = 'http://127.0.0.1:8000';

const convertToIST = (utcTimeString) => {
  if (!utcTimeString) return 'Unknown';
  try {
    const utcDate = new Date(utcTimeString);
    return utcDate.toLocaleString("en-IN", {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  } catch (error) {
    return 'Invalid time';
  }
};

export default function Plant2Live() {
  const [machines, setMachines] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [machineChanges, setMachineChanges] = useState([]);
  const [showChanges, setShowChanges] = useState(false);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [isMounted, setIsMounted] = useState(false);
  const [currentShift, setCurrentShift] = useState('A');
  const [liveIdleSeconds, setLiveIdleSeconds] = useState({});
  
  const intervalRef = useRef(null);
  const lastSavedHour = useRef(new Date().getHours());

  const formatLiveIdle = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    const updateShift = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const timeMinutes = hour * 60 + minute;
      
      const shiftAStart = 8 * 60 + 30;
      const shiftAEnd = 20 * 60;
      
      const shift = (timeMinutes >= shiftAStart && timeMinutes < shiftAEnd) ? 'A' : 'B';
      setCurrentShift(shift);
      setCurrentHour(hour);
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
        if (isMounted) { setMachines(data.machines); setError(''); }
      }
    } catch (err) {
      if (isMounted) setError(`Failed: ${err.message}`);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  useEffect(() => {
    if (!isMounted) return;
    fetchData();
    intervalRef.current = setInterval(() => { if (isMounted) fetchData(); }, 2000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isMounted]);

  useEffect(() => {
    const idleTimer = setInterval(() => {
      const now = new Date();
      const newLiveIdle = {};
      
      machines.forEach(machine => {
        const machineNo = machine.machine_no;
        if (machine.machine_on && !machine.is_producing) {
          const currentHourStart = new Date(now);
          currentHourStart.setMinutes(0, 0, 0);
          let idleSeconds = 0;
          
          if (machine.last_activity && machine.last_activity !== 'Never') {
            try {
              const [hours, minutes, seconds] = machine.last_activity.split(':').map(Number);
              const lastTime = new Date(now);
              lastTime.setHours(hours, minutes, seconds, 0);
              idleSeconds = lastTime >= currentHourStart ? Math.floor((now - lastTime) / 1000) : Math.floor((now - currentHourStart) / 1000);
            } catch (e) { idleSeconds = 0; }
          } else if (machine.on_since) {
            try {
              const [hours, minutes] = machine.on_since.split(':').map(Number);
              const onTime = new Date(now);
              onTime.setHours(hours, minutes, 0, 0);
              idleSeconds = onTime >= currentHourStart ? Math.floor((now - onTime) / 1000) : Math.floor((now - currentHourStart) / 1000);
            } catch (e) { idleSeconds = 0; }
          }
          newLiveIdle[machineNo] = Math.min(idleSeconds, 3600);
        } else {
          newLiveIdle[machineNo] = 0;
        }
      });
      setLiveIdleSeconds(newLiveIdle);
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

  // --- PEHLE WALE NEON COLORS ---
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

  const getMachineStatus = (machine) => {
    if (!machine.machine_on) return 'OFFLINE';
    if (machine.is_producing) return 'RUNNING';
    return 'IDLE';
  };

  const handleMachineClick = (machine) => {
    setSelectedMachine(machine);
    setShowChanges(false);
    fetch(`${API_BASE}/api/machine-changes/?machine_no=${machine.machine_no}`)
      .then(res => res.json())
      .then(data => { if (data.success) setMachineChanges(data.changes); })
      .catch(err => console.error('Error fetching changes:', err));
  };

  const closeModal = () => {
    setSelectedMachine(null);
    setMachineChanges([]);
    setShowChanges(false);
  };

  if (loading && machines.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#020617', color: '#10b981', fontSize: '24px', fontWeight: 'bold' }}>
        <div className="loader" style={{ marginBottom: '20px', border: '4px solid #1e293b', borderTop: '4px solid #10b981', borderRadius: '50%', width: '50px', height: '50px', animation: 'spin 1s linear infinite' }}></div>
        Loading Plant Dashboard...
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const totalMachines = machines.length;
  const onMachines = machines.filter(m => m.machine_on).length;
  const runningMachines = machines.filter(m => m.is_producing).length;
  const idleMachines = onMachines - runningMachines;
  const offlineMachines = totalMachines - onMachines;

  const sortedMachines = [...machines].sort((a, b) => a.machine_no - b.machine_no);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top, #1e293b 0%, #020617 100%)', // First Design Bg
      padding: '20px',
      color: '#f8fafc',
      fontFamily: "'Inter', 'Segoe UI', sans-serif"
    }}>
      <style>{`
        @keyframes hardPulse {
          0%, 100% { opacity: 1; background-color: #9a3412; }
          50% { opacity: 0.9; background-color: #7c2d12; box-shadow: 0 0 20px rgba(249, 115, 22, 0.6); }
        }
        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.5) !important;
        }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
      `}</style>

      {/* HEADER SECTION */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px',
        padding: '24px', background: 'rgba(30, 41, 59, 0.7)',
        borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ width: '12px', height: '40px', background: '#10b981', borderRadius: '6px', boxShadow: '0 0 10px rgba(16,185,129,0.5)' }}></div>
            <h1 style={{ margin: 0, fontSize: '32px', color: '#f8fafc', fontWeight: '800' }}>
              Plant 2 <span style={{ color: '#10b981' }}>Live Status</span>
            </h1>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', fontSize: '14px', fontWeight: '600' }}>
            <div style={{ padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px', color: '#34d399' }}>
              Shift: {currentShift}
            </div>
            <div style={{ padding: '8px 16px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
              Hour: {currentHour.toString().padStart(2, '0')}:xx
            </div>
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

      {/* MACHINES GRID - BIGGER CARDS WITH EXACT DATA MAPPING */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {sortedMachines.map((machine) => {
          const liveIdle = liveIdleSeconds[machine.machine_no] || 0;
          const statusColor = getMachineColor(machine);
          const isIdle = machine.machine_on && !machine.is_producing;
          
          return (
            <div
              key={machine.machine_no}
              className="card-hover"
              onClick={() => handleMachineClick(machine)}
              style={{
                background: 'linear-gradient(145deg, #1e293b, #0f172a)',
                border: `1px solid rgba(255,255,255,0.05)`,
                borderTop: `4px solid ${statusColor}`,
                borderRadius: '20px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: `0 8px 20px rgba(0,0,0,0.4), ${getMachineGlow(machine)}`,
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '24px', fontWeight: '900', color: '#f8fafc' }}>
                  Machine {machine.machine_no}
                </div>
                <div style={{
                  fontSize: '11px', padding: '6px 12px', background: `${statusColor}20`,
                  color: statusColor, borderRadius: '20px', fontWeight: '800', border: `1px solid ${statusColor}40`,
                }}>
                  {getMachineStatus(machine)}
                </div>
              </div>

              {/* Current Hour Production */}
              <div style={{ textAlign: 'center', padding: '24px 10px', background: 'rgba(2, 6, 23, 0.4)', borderRadius: '16px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700', marginBottom: '10px' }}>
                  Current Hour Production
                </div>
                <div style={{ fontSize: '56px', fontWeight: '900', color: statusColor, lineHeight: '1', textShadow: `0 0 20px ${statusColor}40` }}>
                  {machine.current_hour_count || 0}
                </div>
              </div>

              {/* ON at & Start Production Timings */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Machine ON at</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#34d399' }}>{machine.on_since || '--:--'}</div>
                </div>
                <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Start Production at</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#60a5fa' }}>{machine.first_count_at || '--:--'}</div>
                  <div style={{ fontSize: '11px', color: '#60a5fa', opacity: 0.8 }}>Idle: {machine.time_to_first_count || 0} min</div>
                </div>
              </div>

              {/* LIVE IDLE Pulse */}
              {isIdle && liveIdle > 0 && (
                <div style={{ padding: '16px', borderRadius: '12px', marginBottom: '16px', textAlign: 'center', animation: 'hardPulse 2s infinite', border: '1px solid rgba(249, 115, 22, 0.3)' }}>
                  <div style={{ fontSize: '11px', color: '#fed7aa', fontWeight: '700', marginBottom: '8px' }}>⚠️ LIVE IDLE</div>
                  <div style={{ fontSize: '32px', fontWeight: '900', color: '#fff', lineHeight: '1' }}>{formatLiveIdle(liveIdle)}</div>
                </div>
              )}

              {/* Stats Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ padding: '12px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>Total Idle (Hour)</div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#fbbf24' }}>{machine.total_shift_idle_time || 0} min</div>
                </div>
                <div style={{ padding: '12px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>Shut Height</div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#f8fafc' }}>
                    {typeof machine.shut_height === 'number' ? machine.shut_height.toFixed(2) : machine.shut_height || '--'}
                  </div>
                </div>
                <div style={{ padding: '12px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>Last Hour</div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#94a3b8' }}>{machine.last_hour_count || 0}</div>
                </div>
                <div style={{ padding: '12px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>Cumulative</div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#10b981' }}>{machine.cumulative_count || 0}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL POPUP WITH EXACT DATA MAPPING */}
      {selectedMachine && (
        <div 
          onClick={closeModal}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#0f172a', borderRadius: '24px', padding: 0,
              maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
              border: `1px solid rgba(255,255,255,0.1)`
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '30px', background: `linear-gradient(135deg, ${getMachineColor(selectedMachine)} 0%, #0f172a 150%)`,
              borderTopLeftRadius: '24px', borderTopRightRadius: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ fontSize: '32px', fontWeight: '900', color: 'white' }}>Machine {selectedMachine.machine_no}</div>
                  <div style={{ padding: '8px 20px', backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', borderRadius: '30px', fontWeight: '800' }}>
                    {getMachineStatus(selectedMachine)}
                  </div>
                  
                  {/* Notification Bell */}
                  <div style={{ position: 'relative', cursor: 'pointer', padding: '10px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: '50%' }}
                       onClick={() => setShowChanges(!showChanges)}>
                    <span style={{ fontSize: '24px' }}>🔔</span>
                    {machineChanges.length > 0 && (
                      <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: '#ef4444', color: 'white', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                        {machineChanges.length}
                      </span>
                    )}
                  </div>
                </div>

                <button onClick={closeModal} style={{
                  background: 'rgba(0,0,0,0.3)', color: 'white', border: 'none', borderRadius: '50%',
                  width: '44px', height: '44px', fontSize: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>×</button>
              </div>
            </div>

            <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Machine Timeline */}
              <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ margin: '0 0 16px 0', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}><span>⏱️</span> Machine Timeline</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                  <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{fontSize: '12px', color: '#94a3b8'}}>Machine Turned ON</div>
                      <div style={{fontSize: '20px', fontWeight: '700', color: '#34d399'}}>{selectedMachine.on_since || '--:--'}</div>
                    </div>
                    <div style={{textAlign: 'right'}}>
                      <div style={{fontSize: '20px', fontWeight: '700', color: '#34d399'}}>{selectedMachine.on_duration_minutes || 0}</div>
                      <div style={{fontSize: '10px', color: '#94a3b8'}}>minutes ago</div>
                    </div>
                  </div>

                  <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{fontSize: '12px', color: '#94a3b8'}}>First Count Received</div>
                      <div style={{fontSize: '20px', fontWeight: '700', color: '#60a5fa'}}>{selectedMachine.first_count_at || '--:--'}</div>
                    </div>
                    <div style={{textAlign: 'right'}}>
                      <div style={{fontSize: '20px', fontWeight: '700', color: '#60a5fa'}}>{selectedMachine.time_to_first_count || 0}</div>
                      <div style={{fontSize: '10px', color: '#94a3b8'}}>min delay</div>
                    </div>
                  </div>

                  <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{fontSize: '12px', color: '#94a3b8'}}>Last Count This Hour</div>
                      <div style={{fontSize: '20px', fontWeight: '700', color: '#fbbf24'}}>{selectedMachine.last_activity || 'Never'}</div>
                    </div>
                    <div style={{textAlign: 'right'}}>
                      <div style={{fontSize: '16px', fontWeight: '700', color: '#fbbf24'}}>{selectedMachine.current_hour_count} counts</div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(2, 6, 23, 0.4)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Status</span>
                  <span style={{ fontWeight: 'bold', color: selectedMachine.is_producing ? '#10b981' : '#f59e0b' }}>
                    {selectedMachine.is_producing ? '✅ Currently Producing' : '⚠️ Idle / Offline'}
                  </span>
                </div>
              </div>

              {/* Big Stat Box */}
              <div style={{ textAlign: 'center', padding: '30px', background: 'linear-gradient(145deg, #1e293b, #0f172a)', borderRadius: '20px', border: `1px solid rgba(255,255,255,0.05)`, boxShadow: `inset 0 4px 20px rgba(0,0,0,0.5)` }}>
                <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px', fontWeight: '700', textTransform: 'uppercase' }}>Current Hour Production</div>
                <div style={{ fontSize: '72px', fontWeight: '900', color: getMachineColor(selectedMachine), textShadow: `0 0 30px ${getMachineColor(selectedMachine)}40`, lineHeight: '1' }}>{selectedMachine.current_hour_count || 0}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '10px' }}>Resets every hour at XX:00:00</div>
              </div>

              {/* Customer Info */}
              <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ margin: '0 0 16px 0', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px' }}><span>👤</span> Customer Information</h3>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'rgba(2, 6, 23, 0.4)', borderRadius: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Customer</span>
                    <span style={{ fontWeight: 'bold', color: '#fff' }}>{selectedMachine.tool_customer || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'rgba(2, 6, 23, 0.4)', borderRadius: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Model</span>
                    <span style={{ fontWeight: 'bold', color: '#fff' }}>{selectedMachine.tool_model || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Tool Info (All exact elements from prompt) */}
              <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ margin: '0 0 16px 0', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}><span>🔧</span> Tool Information</h3>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'rgba(2, 6, 23, 0.4)', borderRadius: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Part Name</span>
                    <span style={{ fontWeight: 'bold', color: '#fff' }}>{selectedMachine.tool_part_name || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'rgba(2, 6, 23, 0.4)', borderRadius: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Tool Name</span>
                    <span style={{ fontWeight: 'bold', color: '#fff' }}>{selectedMachine.tool_name || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'rgba(2, 6, 23, 0.4)', borderRadius: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Part Number</span>
                    <span style={{ fontWeight: 'bold', color: '#fff' }}>{selectedMachine.tool_part_number || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'rgba(2, 6, 23, 0.4)', borderRadius: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Shut Height</span>
                    <span style={{ fontWeight: 'bold', color: '#fff' }}>{typeof selectedMachine.shut_height === 'number' ? selectedMachine.shut_height.toFixed(2) : selectedMachine.shut_height || 'N/A'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'rgba(2, 6, 23, 0.4)', borderRadius: '8px' }}>
                    <span style={{ color: '#94a3b8' }}>Tool ID</span>
                    <span style={{ fontWeight: 'bold', color: '#10b981', wordBreak: 'break-all' }}>{selectedMachine.tool_id || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Row Highlights */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', letterSpacing: '1px', marginBottom: '10px' }}>LAST HOUR</div>
                  <div style={{ fontSize: '36px', fontWeight: '800', color: '#f8fafc' }}>{selectedMachine.last_hour_count || 0}</div>
                </div>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', letterSpacing: '1px', marginBottom: '10px' }}>CUMULATIVE</div>
                  <div style={{ fontSize: '36px', fontWeight: '800', color: '#10b981' }}>{selectedMachine.cumulative_count || 0}</div>
                </div>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', letterSpacing: '1px', marginBottom: '10px' }}>TOTAL IDLE</div>
                  <div style={{ fontSize: '36px', fontWeight: '800', color: '#f59e0b' }}>{selectedMachine.total_shift_idle_time || 0} <span style={{fontSize: '14px'}}>min</span></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}


