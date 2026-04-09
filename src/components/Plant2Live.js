import React, { useEffect, useState, useRef } from 'react';

const API_BASE = 'http://192.168.0.34:8000/';

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
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.machines)) {
        if (isMounted) {
          setMachines(data.machines);
          setError('');
        }
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      if (isMounted) {
        setError(`Failed: ${err.message}`);
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!isMounted) return;

    fetchData();

    intervalRef.current = setInterval(() => {
      if (isMounted) {
        fetchData();
      }
    }, 2000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isMounted]);

  // Live idle time counter (for display only)
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
              
              if (lastTime >= currentHourStart) {
                const diffMs = now - lastTime;
                idleSeconds = Math.floor(diffMs / 1000);
              } else {
                const diffMs = now - currentHourStart;
                idleSeconds = Math.floor(diffMs / 1000);
              }
            } catch (e) {
              idleSeconds = 0;
            }
          } else if (machine.on_since) {
            try {
              const [hours, minutes] = machine.on_since.split(':').map(Number);
              const onTime = new Date(now);
              onTime.setHours(hours, minutes, 0, 0);
              
              if (onTime >= currentHourStart) {
                const diffMs = now - onTime;
                idleSeconds = Math.floor(diffMs / 1000);
              } else {
                const diffMs = now - currentHourStart;
                idleSeconds = Math.floor(diffMs / 1000);
              }
            } catch (e) {
              idleSeconds = 0;
            }
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

  // Hour change detection
  useEffect(() => {
    const checkHourChange = async () => {
      const now = new Date();
      const hour = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      
      if (minutes === 0 && seconds <= 5 && lastSavedHour.current !== hour) {
        console.log(`🔥 HOUR CHANGE: ${hour}:00 - Saving & Resetting...`);
        
        try {
          const response = await fetch(`${API_BASE}/api/save-hourly-snapshot/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          
          const data = await response.json();
          
          if (data.success) {
            console.log(`✅ ${data.message}`);
            console.log(`📊 Machines saved: ${data.saved_count}`);
            
            setLiveIdleSeconds({});
            lastSavedHour.current = hour;
            setCurrentHour(hour);
            
            setTimeout(() => {
              fetchData();
            }, 1000);
          } else {
            console.error('❌ Save failed:', data.error);
          }
        } catch (error) {
          console.error('❌ Request error:', error);
        }
      }
    };
    
    const hourCheckInterval = setInterval(checkHourChange, 1000);
    
    return () => clearInterval(hourCheckInterval);
  }, []);

  const getMachineColor = (machine) => {
    if (!machine.machine_on) return '#374151';
    if (machine.is_producing) return '#10b981';
    return '#f59e0b';
  };

  const getMachineStatus = (machine) => {
    if (!machine.machine_on) return 'OFFLINE';
    if (machine.is_producing) return 'RUNNING';
    return 'IDLE';
  };

  const getStatusBadgeColor = (machine) => {
    if (!machine.machine_on) return '#6b7280';
    if (machine.is_producing) return '#10b981';
    return '#f59e0b';
  };

 const handleMachineClick = (machine) => {
    setSelectedMachine(machine);
    fetch(`${API_BASE}/api/machine-changes/?machine_no=${machine.machine_no}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMachineChanges(data.changes);
        }
      })
      .catch(err => console.error('Error fetching changes:', err));
  };

 const closeModal = () => {
  setSelectedMachine(null);
  setMachineChanges([]);
  setShowChanges(false); // ✅ ADD THIS LINE
};



  if (loading && machines.length === 0) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        color: '#e2e8f0',
        fontSize: '20px'
      }}>
        Loading Plant 2...
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
      backgroundColor: '#0f172a',
      padding: '15px',
      color: '#e2e8f0'
    }}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .machine-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important; }
        }
        
        @media (min-width: 769px) and (max-width: 1024px) {
          .machine-grid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important; }
        }
        
        @media (min-width: 1025px) {
          .machine-grid { grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)) !important; }
        }
      `}</style>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginBottom: '20px',
        padding: '20px',
        backgroundColor: '#1e293b',
        borderRadius: '16px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <h1 style={{ 
            margin: 0,
            fontSize: 'clamp(20px, 4vw, 32px)',
            color: '#10b981',
            fontWeight: 'bold'
          }}>
            Plant 2 - Live Status
          </h1>
          
          <div style={{
            display: 'flex',
            gap: '10px',
            fontSize: 'clamp(11px, 2vw, 13px)'
          }}>
            <span style={{
              padding: '6px 12px',
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              color: '#10b981',
              fontWeight: 'bold'
            }}>
              Shift: {currentShift}
            </span>
            <span style={{
              padding: '6px 12px',
              backgroundColor: '#0f172a',
              borderRadius: '8px'
            }}>
              Hour: {currentHour.toString().padStart(2, '0')}:xx
            </span>
          </div>
        </div>
        
        <div className="stats-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '15px'
        }}>
          <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#0f172a', borderRadius: '12px' }}>
            <div style={{ fontSize: 'clamp(28px, 5vw, 36px)', fontWeight: 'bold', color: '#10b981' }}>{onMachines}</div>
            <div style={{ fontSize: 'clamp(10px, 2vw, 12px)', color: '#94a3b8', textTransform: 'uppercase' }}>ON</div>
          </div>
          <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#0f172a', borderRadius: '12px' }}>
            <div style={{ fontSize: 'clamp(28px, 5vw, 36px)', fontWeight: 'bold', color: '#10b981' }}>{runningMachines}</div>
            <div style={{ fontSize: 'clamp(10px, 2vw, 12px)', color: '#94a3b8', textTransform: 'uppercase' }}>RUNNING</div>
          </div>
          <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#0f172a', borderRadius: '12px' }}>
            <div style={{ fontSize: 'clamp(28px, 5vw, 36px)', fontWeight: 'bold', color: '#f59e0b' }}>{idleMachines}</div>
            <div style={{ fontSize: 'clamp(10px, 2vw, 12px)', color: '#94a3b8', textTransform: 'uppercase' }}>IDLE</div>
          </div>
          <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#0f172a', borderRadius: '12px' }}>
            <div style={{ fontSize: 'clamp(28px, 5vw, 36px)', fontWeight: 'bold', color: '#6b7280' }}>{offlineMachines}</div>
            <div style={{ fontSize: 'clamp(10px, 2vw, 12px)', color: '#94a3b8', textTransform: 'uppercase' }}>OFFLINE</div>
          </div>
          <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#0f172a', borderRadius: '12px' }}>
            <div style={{ fontSize: 'clamp(28px, 5vw, 36px)', fontWeight: 'bold', color: '#3b82f6' }}>{totalMachines}</div>
            <div style={{ fontSize: 'clamp(10px, 2vw, 12px)', color: '#94a3b8', textTransform: 'uppercase' }}>TOTAL</div>
          </div>
        </div>
      </div>

      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          borderRadius: '12px',
          marginBottom: '20px',
          fontSize: 'clamp(13px, 2.5vw, 15px)'
        }}>
          {error}
        </div>
      )}

      <div className="machine-grid" style={{
        display: 'grid',
        gap: '20px'
      }}>
        {sortedMachines.map((machine) => {
          const liveIdle = liveIdleSeconds[machine.machine_no] || 0;
          const totalIdleMinutes = machine.total_shift_idle_time ||0;





          
          return (
            <div
              key={machine.machine_no}
              onClick={() => handleMachineClick(machine)}
              style={{
                backgroundColor: '#1e293b',
                border: `3px solid ${getMachineColor(machine)}`,
                borderRadius: '16px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
              }}>
                <div style={{
                  fontSize: 'clamp(16px, 3vw, 20px)',
                  fontWeight: 'bold',
                  color: '#f97316',
                  padding: '6px 14px',
                  backgroundColor: '#292524',
                  borderRadius: '8px'
                }}>
                  Machine {machine.machine_no}
                </div>
                
                <div style={{
                  fontSize: 'clamp(10px, 2vw, 11px)',
                  padding: '4px 10px',
                  backgroundColor: getStatusBadgeColor(machine),
                  color: 'white',
                  borderRadius: '6px',
                  fontWeight: 'bold'
                }}>
                  {getMachineStatus(machine)}
                </div>
              </div>

              <div style={{
                textAlign: 'center',
                padding: '18px',
                backgroundColor: '#0f172a',
                borderRadius: '12px',
                marginBottom: '12px',
                border: `2px solid ${getMachineColor(machine)}`
              }}>
                <div style={{
                  fontSize: 'clamp(10px, 2vw, 12px)',
                  color: '#94a3b8',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  fontWeight: '600'
                }}>
                  Current Hour Production
                </div>
                <div style={{
                  fontSize: 'clamp(36px, 7vw, 48px)',
                  fontWeight: 'bold',
                  color: getMachineColor(machine)
                }}>
                  {machine.current_hour_count || 0}
                </div>
              </div>

              {machine.on_since && (
                <div style={{
                  padding: '10px',
                  backgroundColor: '#065f46',
                  borderRadius: '10px',
                  marginBottom: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: 'clamp(9px, 1.8vw, 10px)',
                    color: '#d1fae5',
                    marginBottom: '4px'
                  }}>
                    Machine ON at
                  </div>
                  <div style={{
                    fontSize: 'clamp(18px, 3.5vw, 20px)',
                    fontWeight: 'bold',
                    color: '#10b981'
                  }}>
                    {machine.on_since}
                  </div>
                </div>
              )}

              {machine.first_count_at && (
                <div style={{
                  padding: '10px',
                  backgroundColor: '#1e40af',
                  borderRadius: '10px',
                  marginBottom: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: 'clamp(9px, 1.8vw, 10px)',
                    color: '#dbeafe',
                    marginBottom: '4px'
                  }}>
                    Start Production at
                  </div>
                  <div style={{
                    fontSize: 'clamp(18px, 3.5vw, 20px)',
                    fontWeight: 'bold',
                    color: '#3b82f6'
                  }}>
                    {machine.first_count_at}
                  </div>
                  <div style={{
                    fontSize: 'clamp(9px, 1.8vw, 10px)',
                    color: '#dbeafe',
                    marginTop: '4px'
                  }}>
                    Idle: {machine.time_to_first_count || 0} min
                  </div>
                </div>
              )}

              {machine.machine_on && !machine.is_producing && liveIdle > 0 && (
                <div style={{
                  padding: '12px',
                  backgroundColor: '#7c2d12',
                  borderRadius: '10px',
                  marginBottom: '12px',
                  textAlign: 'center',
                  animation: 'pulse 2s ease-in-out infinite'
                }}>
                  <div style={{
                    fontSize: 'clamp(9px, 1.8vw, 10px)',
                    color: '#fed7aa',
                    marginBottom: '4px'
                  }}>
                    ⚠️ LIVE IDLE (Current)
                  </div>
                  <div style={{
                    fontSize: 'clamp(28px, 5.5vw, 32px)',
                    fontWeight: 'bold',
                    color: '#f97316'
                  }}>
                    {formatLiveIdle(liveIdle)}
                  </div>
                  <div style={{
                    fontSize: 'clamp(9px, 1.8vw, 10px)',
                    color: '#fed7aa',
                    marginTop: '4px'
                  }}>
                    Since {machine.last_activity !== 'Never' ? machine.last_activity : 'machine ON'}
                  </div>
                </div>
              )}

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                marginBottom: '12px'
              }}>
                <div style={{
                  padding: '10px',
                  backgroundColor: '#0f172a',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: 'clamp(9px, 1.8vw, 10px)',
                    color: '#f59e0b',
                    marginBottom: '4px'
                  }}>
                    Total Idle (Hour)
                  </div>
                  <div style={{
                    fontSize: 'clamp(18px, 3.5vw, 20px)',
                    fontWeight: 'bold',
                    color: '#f59e0b'
                  }}>
                    {totalIdleMinutes} min
                  </div>
                </div>
                
                <div style={{
                  padding: '10px',
                  backgroundColor: '#0f172a',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: 'clamp(9px, 1.8vw, 10px)',
                    color: '#fbbf24',
                    marginBottom: '4px'
                  }}>
                    Shut Height
                  </div>
                  <div style={{
                    fontSize: 'clamp(14px, 2.8vw, 16px)',
                    fontWeight: 'bold',
                    color: '#fbbf24'
                  }}>
                    {typeof machine.shut_height === 'number' 
                      ? machine.shut_height.toFixed(2) 
                      : machine.shut_height || 'N/A'}
                  </div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px'
              }}>
                <div style={{
                  padding: '10px',
                  backgroundColor: '#0f172a',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: 'clamp(9px, 1.8vw, 10px)',
                    color: '#94a3b8',
                    marginBottom: '4px'
                  }}>
                    Last Hour
                  </div>
                  <div style={{
                    fontSize: 'clamp(20px, 4vw, 24px)',
                    fontWeight: 'bold',
                    color: '#64748b'
                  }}>
                    {machine.last_hour_count !== undefined && machine.last_hour_count !== null 
                      ? machine.last_hour_count 
                      : 0}
                  </div>
                </div>
                
                <div style={{
                  padding: '10px',
                  backgroundColor: '#0f172a',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: 'clamp(9px, 1.8vw, 10px)',
                    color: '#10b981',
                    marginBottom: '4px'
                  }}>
                    Cumulative
                  </div>
                  <div style={{
                    fontSize: 'clamp(20px, 4vw, 24px)',
                    fontWeight: 'bold',
                    color: '#10b981'
                  }}>
                    {machine.cumulative_count !== undefined && machine.cumulative_count !== null 
                      ? machine.cumulative_count 
                      : 0}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedMachine && (
        <div 
          onClick={closeModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px',
            overflowY: 'auto'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#0f172a',
              borderRadius: '20px',
              padding: 0,
              maxWidth: '900px',
              width: '100%',
              maxHeight: '95vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
              border: `4px solid ${getMachineColor(selectedMachine)}`
            }}
          >
            {/* ✅ NEW HEADER WITH NOTIFICATION BELL */}
<div style={{
  padding: 'clamp(20px, 4vw, 30px)',
  background: `linear-gradient(135deg, ${getMachineColor(selectedMachine)} 0%, ${getMachineColor(selectedMachine)}80 100%)`,
  borderTopLeftRadius: '16px',
  borderTopRightRadius: '16px'
}}>
  {/* Header Row */}
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: showChanges ? '16px' : '0'
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      flexWrap: 'wrap'
    }}>
      <div style={{
        fontSize: 'clamp(24px, 5vw, 36px)',
        fontWeight: 'bold',
        color: 'white'
      }}>
        Machine {selectedMachine.machine_no}
      </div>
      <div style={{
        fontSize: 'clamp(12px, 2.5vw, 16px)',
        padding: '8px 18px',
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: 'white',
        borderRadius: '20px',
        fontWeight: 'bold'
      }}>
        {getMachineStatus(selectedMachine)}
      </div>
      
      {/* 🔔 NOTIFICATION BELL */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          setShowChanges(!showChanges);
        }}
        style={{
          position: 'relative',
          cursor: 'pointer',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.35)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
      >
        <span style={{ fontSize: '24px' }}>🔔</span>
        {machineChanges.length > 0 && (
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            background: '#ef4444',
            color: 'white',
            borderRadius: '50%',
            width: '22px',
            height: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            border: '2px solid white',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
          }}>
            {machineChanges.length}
          </span>
        )}
      </div>
    </div>
    
    <button onClick={closeModal} style={{
      backgroundColor: 'rgba(255,255,255,0.2)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: 'clamp(36px, 7vw, 44px)',
      height: 'clamp(36px, 7vw, 44px)',
      fontSize: 'clamp(20px, 4vw, 28px)',
      cursor: 'pointer',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      ×
    </button>
  </div>
  
  {/* 🔽 COLLAPSIBLE CHANGES DROPDOWN */}
  {showChanges && (
    <div style={{
      padding: '16px',
      background: 'rgba(255,255,255,0.15)',
      borderRadius: '12px',
      maxHeight: '250px',
      overflowY: 'auto',
      animation: 'slideDown 0.3s ease'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <span style={{
          color: 'white',
          fontSize: 'clamp(14px, 2.6vw, 16px)',
          fontWeight: 'bold'
        }}>
          📋 Today's Changes (Shift {currentShift})
        </span>
        <span style={{
          background: machineChanges.length > 0 ? '#3b82f6' : '#64748b',
          color: 'white',
          padding: '5px 12px',
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: 'bold'
        }}>
          {machineChanges.length}
        </span>
      </div>
      
      {machineChanges.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '30px 20px',
          color: 'rgba(255,255,255,0.9)'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>✅</div>
          <div style={{ fontSize: '14px', fontWeight: '500' }}>
            No changes detected today
          </div>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {machineChanges.map((change, idx) => (
            <div key={idx} style={{
              background: 'rgba(255,255,255,0.25)',
              padding: '12px',
              borderRadius: '10px',
              fontSize: '13px',
              color: 'white',
              borderLeft: '4px solid white'
            }}>
              <div style={{
                fontWeight: 'bold',
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>⏰ {change.time}</span>
                <span style={{
                  fontSize: '11px',
                  background: 'rgba(0,0,0,0.3)',
                  padding: '3px 8px',
                  borderRadius: '8px'
                }}>
                  #{machineChanges.length - idx}
                </span>
              </div>
              {change.height_changed && (
                <div style={{
                  fontSize: '12px',
                  marginBottom: '6px',
                  background: 'rgba(0,0,0,0.2)',
                  padding: '6px 8px',
                  borderRadius: '6px'
                }}>
                  🔧 Height: <strong>{change.old_height.toFixed(2)}</strong> → <strong>{change.new_height.toFixed(2)}</strong>
                </div>
              )}
              {change.tool_changed && (
                <div style={{
                  fontSize: '11px',
                  background: 'rgba(0,0,0,0.2)',
                  padding: '6px 8px',
                  borderRadius: '6px'
                }}>
                  🔩 Tool ID changed
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )}
</div>


            <div style={{ padding: 'clamp(20px, 4vw, 30px)' }}>
              <div style={{
                padding: 'clamp(16px, 3vw, 24px)',
                backgroundColor: '#1e293b',
                borderRadius: '16px',
                marginBottom: '20px',
                border: '2px solid #334155'
              }}>
                <h3 style={{
                  margin: '0 0 18px 0',
                  fontSize: 'clamp(14px, 3vw, 18px)',
                  color: '#10b981',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span>⏱️</span> Machine Timeline
                </h3>
                
                <div style={{ display: 'grid', gap: '14px' }}>
                  {selectedMachine.on_since && (
                    <div style={{
                      padding: 'clamp(14px, 3vw, 18px)',
                      backgroundColor: '#065f46',
                      borderRadius: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '10px',
                      border: '2px solid #10b981'
                    }}>
                      <div>
                        <div style={{
                          fontSize: 'clamp(10px, 2vw, 12px)',
                          color: '#d1fae5',
                          marginBottom: '6px'
                        }}>
                          Machine Turned ON
                        </div>
                        <div style={{
                          fontSize: 'clamp(20px, 4vw, 28px)',
                          fontWeight: 'bold',
                          color: '#10b981'
                        }}>
                          {selectedMachine.on_since}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: 'clamp(18px, 3.5vw, 24px)',
                          fontWeight: 'bold',
                          color: '#10b981'
                        }}>
                          {selectedMachine.on_duration_minutes || 0}
                        </div>
                        <div style={{
                          fontSize: 'clamp(9px, 1.8vw, 11px)',
                          color: '#d1fae5'
                        }}>
                          minutes ago
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedMachine.first_count_at && (
                    <div style={{
                      padding: 'clamp(14px, 3vw, 18px)',
                      backgroundColor: '#1e40af',
                      borderRadius: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '10px',
                      border: '2px solid #3b82f6'
                    }}>
                      <div>
                        <div style={{
                          fontSize: 'clamp(10px, 2vw, 12px)',
                          color: '#dbeafe',
                          marginBottom: '6px'
                        }}>
                          First Count Received
                        </div>
                        <div style={{
                          fontSize: 'clamp(20px, 4vw, 28px)',
                          fontWeight: 'bold',
                          color: '#3b82f6'
                        }}>
                          {selectedMachine.first_count_at}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{
                          fontSize: 'clamp(18px, 3.5vw, 24px)',
                          fontWeight: 'bold',
                          color: '#3b82f6'
                        }}>
                          {selectedMachine.time_to_first_count || 0}
                        </div>
                        <div style={{
                          fontSize: 'clamp(9px, 1.8vw, 11px)',
                          color: '#dbeafe'
                        }}>
                          min delay
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedMachine.current_hour_count > 0 && selectedMachine.last_activity && selectedMachine.last_activity !== 'Never' && (
                    <div style={{
                      padding: 'clamp(14px, 3vw, 18px)',
                      backgroundColor: '#713f12',
                      borderRadius: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '10px',
                      border: '2px solid #f59e0b'
                    }}>
                      <div>
                        <div style={{
                          fontSize: 'clamp(10px, 2vw, 12px)',
                          color: '#fef3c7',
                          marginBottom: '6px'
                        }}>
                          Last Count This Hour
                        </div>
                        <div style={{
                          fontSize: 'clamp(20px, 4vw, 28px)',
                          fontWeight: 'bold',
                          color: '#f59e0b'
                        }}>
                          {selectedMachine.last_activity}
                        </div>
                      </div>
                      <div style={{
                        fontSize: 'clamp(11px, 2.2vw, 14px)',
                        color: '#fef3c7'
                      }}>
                        {selectedMachine.current_hour_count} counts
                      </div>
                    </div>
                  )}

                  <div style={{
                    padding: 'clamp(12px, 2.5vw, 16px)',
                    backgroundColor: '#1e293b',
                    borderRadius: '10px',
                    border: '1px solid #334155'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 'clamp(11px, 2.2vw, 13px)',
                      color: '#94a3b8',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}>
                      <span>Status</span>
                      <span style={{
                        fontWeight: 'bold',
                        color: selectedMachine.is_producing ? '#10b981' : '#f59e0b'
                      }}>
                        {selectedMachine.is_producing 
                          ? '✅ Currently Producing' 
                          : selectedMachine.machine_on 
                            ? '⚠️ Machine ON but IDLE' 
                            : '🔴 Machine OFF'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedMachine.machine_on && !selectedMachine.is_producing && liveIdleSeconds[selectedMachine.machine_no] > 0 && (
                <div style={{
                  padding: 'clamp(18px, 3.5vw, 24px)',
                  backgroundColor: '#7c2d12',
                  borderRadius: '16px',
                  marginBottom: '20px',
                  border: '2px solid #f97316',
                  textAlign: 'center',
                  animation: 'pulse 2s ease-in-out infinite'
                }}>
                  <div style={{
                    fontSize: 'clamp(13px, 2.6vw, 16px)',
                    color: '#fed7aa',
                    marginBottom: '12px',
                    fontWeight: 'bold'
                  }}>
                    ⚠️ MACHINE IDLE
                  </div>
                  <div style={{
                    fontSize: 'clamp(40px, 8vw, 56px)',
                    fontWeight: 'bold',
                    color: '#f97316',
                    marginBottom: '12px'
                  }}>
                    {formatLiveIdle(liveIdleSeconds[selectedMachine.machine_no])}
                  </div>
                  <div style={{
                    fontSize: 'clamp(11px, 2.2vw, 13px)',
                    color: '#fed7aa'
                  }}>
                    Machine ON but no production since {selectedMachine.last_activity}
                  </div>
                </div>
              )}

              <div style={{
                textAlign: 'center',
                padding: 'clamp(25px, 5vw, 35px)',
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                borderRadius: '16px',
                marginBottom: '20px',
                border: `3px solid ${getMachineColor(selectedMachine)}`,
                boxShadow: '0 8px 16px rgba(0,0,0,0.4)'
              }}>
                <div style={{
                  fontSize: 'clamp(13px, 2.6vw, 16px)',
                  color: '#94a3b8',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  letterSpacing: '1px'
                }}>
                  Current Hour Production
                </div>
                <div style={{
                  fontSize: 'clamp(56px, 12vw, 80px)',
                  fontWeight: 'bold',
                  color: getMachineColor(selectedMachine),
                  marginBottom: '12px',
                  textShadow: `0 0 20px ${getMachineColor(selectedMachine)}40`
                }}>
                  {selectedMachine.current_hour_count || 0}
                </div>
                <div style={{
                  fontSize: 'clamp(11px, 2.2vw, 13px)',
                  color: '#64748b',
                  fontStyle: 'italic'
                }}>
                  Resets every hour at XX:00:00
                </div>
              </div>

              <div style={{
                marginBottom: '20px',
                padding: 'clamp(16px, 3vw, 24px)',
                backgroundColor: '#1e293b',
                borderRadius: '16px',
                border: '2px solid #334155'
              }}>
                <h3 style={{
                  margin: '0 0 16px 0',
                  fontSize: 'clamp(14px, 3vw, 18px)',
                  color: '#3b82f6',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span>👤</span> Customer Information
                </h3>
                
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: 'clamp(12px, 2.5vw, 16px)',
                    backgroundColor: '#0f172a',
                    borderRadius: '10px',
                    border: '1px solid #334155',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    <span style={{
                      color: '#94a3b8',
                      fontSize: 'clamp(12px, 2.5vw, 14px)'
                    }}>
                      Customer
                    </span>
                    <span style={{
                      fontWeight: 'bold',
                      fontSize: 'clamp(12px, 2.5vw, 14px)',
                      color: '#e2e8f0'
                    }}>
                      {selectedMachine.tool_customer || 'N/A'}
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: 'clamp(12px, 2.5vw, 16px)',
                    backgroundColor: '#0f172a',
                    borderRadius: '10px',
                    border: '1px solid #334155',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    <span style={{
                      color: '#94a3b8',
                      fontSize: 'clamp(12px, 2.5vw, 14px)'
                    }}>
                      Model
                    </span>
                    <span style={{
                      fontWeight: 'bold',
                      fontSize: 'clamp(12px, 2.5vw, 14px)',
                      color: '#e2e8f0'
                    }}>
                      {selectedMachine.tool_model || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{
                marginBottom: '20px',
                padding: 'clamp(16px, 3vw, 24px)',
                backgroundColor: '#1e293b',
                borderRadius: '16px',
                border: '2px solid #334155'
              }}>
                <h3 style={{
                  margin: '0 0 16px 0',
                  fontSize: 'clamp(14px, 3vw, 18px)',
                  color: '#10b981',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span>🔧</span> Tool Information
                </h3>
                
                <div style={{ display: 'grid', gap: '12px' }}>
                  {[
                    { label: 'Part Name', value: selectedMachine.tool_part_name },
                    { label: 'Tool Name', value: selectedMachine.tool_name },
                    { label: 'Part Number', value: selectedMachine.tool_part_number }
                  ].map((item, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: 'clamp(12px, 2.5vw, 16px)',
                      backgroundColor: '#0f172a',
                      borderRadius: '10px',
                      border: '1px solid #334155',
                      flexWrap: 'wrap',
                      gap: '8px'
                    }}>
                      <span style={{
                        color: '#94a3b8',
                        fontSize: 'clamp(12px, 2.5vw, 14px)'
                      }}>
                        {item.label}
                      </span>
                      <span style={{
                        fontWeight: 'bold',
                        fontSize: 'clamp(12px, 2.5vw, 14px)',
                        color: '#e2e8f0'
                      }}>
                        {item.value || 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '20px'
              }}>
                <div style={{
                  padding: 'clamp(18px, 3.5vw, 24px)',
                  backgroundColor: '#1e293b',
                  borderRadius: '16px',
                  textAlign: 'center',
                  border: '2px solid #fbbf24'
                }}>
                  <div style={{
                    fontSize: 'clamp(11px, 2.2vw, 13px)',
                    color: '#fef3c7',
                    marginBottom: '12px'
                  }}>
                    Shut Height
                  </div>
                  <div style={{
                    fontSize: 'clamp(28px, 6vw, 36px)',
                    fontWeight: 'bold',
                    color: '#fbbf24'
                  }}>
                    {typeof selectedMachine.shut_height === 'number' 
                      ? selectedMachine.shut_height.toFixed(2) 
                      : selectedMachine.shut_height || 'N/A'}
                  </div>
                </div>
                
                <div style={{
                  padding: 'clamp(18px, 3.5vw, 24px)',
                  backgroundColor: '#1e293b',
                  borderRadius: '16px',
                  textAlign: 'center',
                  border: '2px solid #10b981'
                }}>
                  <div style={{
                    fontSize: 'clamp(11px, 2.2vw, 13px)',
                    color: '#d1fae5',
                    marginBottom: '12px'
                  }}>
                    Tool ID
                  </div>
                  <div style={{
                    fontSize: 'clamp(13px, 2.6vw, 16px)',
                    fontWeight: 'bold',
                    color: '#10b981',
                    wordBreak: 'break-all',
                    lineHeight: '1.4'
                  }}>
                    {selectedMachine.tool_id || 'N/A'}
                  </div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '14px'
              }}>
                <div style={{
                  padding: 'clamp(16px, 3vw, 20px)',
                  backgroundColor: '#1e293b',
                  borderRadius: '14px',
                  textAlign: 'center',
                  border: '2px solid #64748b'
                }}>
                  <div style={{
                    fontSize: 'clamp(10px, 2vw, 11px)',
                    color: '#94a3b8',
                    marginBottom: '10px'
                  }}>
                    LAST HOUR
                  </div>
                  <div style={{
                    fontSize: 'clamp(26px, 5vw, 32px)',
                    fontWeight: 'bold',
                    color: '#64748b'
                  }}>
                    {selectedMachine.last_hour_count || 0}
                  </div>
                </div>
                
                <div style={{
                  padding: 'clamp(16px, 3vw, 20px)',
                  backgroundColor: '#1e293b',
                  borderRadius: '14px',
                  textAlign: 'center',
                  border: '2px solid #10b981'
                }}>
                  <div style={{
                    fontSize: 'clamp(10px, 2vw, 11px)',
                    color: '#d1fae5',
                    marginBottom: '10px'
                  }}>
                    CUMULATIVE
                  </div>
                  <div style={{
                    fontSize: 'clamp(26px, 5vw, 32px)',
                    fontWeight: 'bold',
                    color: '#10b981'
                  }}>
                    {selectedMachine.cumulative_count || 0}
                  </div>
                </div>
                
                <div style={{
                  padding: 'clamp(16px, 3vw, 20px)',
                  backgroundColor: '#1e293b',
                  borderRadius: '14px',
                  textAlign: 'center',
                  border: '2px solid #f59e0b'
                }}>
                  <div style={{
                    fontSize: 'clamp(10px, 2vw, 11px)',
                    color: '#fef3c7',
                    marginBottom: '10px'
                  }}>
                    TOTAL IDLE
                  </div>
                  <div style={{
                    fontSize: 'clamp(22px, 4.5vw, 28px)',
                    fontWeight: 'bold',
                    color: '#f59e0b'
                  }}>
                    {selectedMachine.total_shift_idle_time || 0} min
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
