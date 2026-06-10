// src/components/Plant1Live.js - COMPLETE WITH MODAL INTEGRATION & LAST COUNT TIME
import React, { useEffect, useState, useRef } from 'react';
import Plant1LiveModal from './Plant1LiveModal';


const API_BASE = process.env.REACT_APP_API_URL || 'https://localhost:8000';


export default function Plant1Live() {
  const [machines, setMachines] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [liveIdleSeconds, setLiveIdleSeconds] = useState({});
  const pollRef = useRef(null);
  const lastSavedHour = useRef(new Date().getHours());


  const formatLiveIdle = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };


  // Fetch data from API
  
  // Fetch data from API (Lines 35-68)
const fetchCorrectData = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/plant1-live/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'ngrok-skip-browser-warning': 'true'  // Skip ngrok warning page
      },
      mode: 'cors',
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // Validate content type
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('❌ Server returned HTML:', text.substring(0, 300));
      throw new Error('Backend returned HTML instead of JSON. Check REST_FRAMEWORK settings.');
    }
    
    const data = await response.json();
    
    if (data.success && Array.isArray(data.machines)) {
      setMachines(data.machines);
      setError('');
      console.log(`✅ Loaded ${data.machines.length} machines`);
    } else {
      setError(data.error || 'Invalid API response structure');
      setMachines([]);
    }
  } catch (error) {
    console.error('❌ Fetch error:', error.message);
    setError(`Connection Error: ${error.message}`);
    setMachines([]);
  } finally {
    setLoading(false);
  }
};



  // Check hour change
  useEffect(() => {
    const checkHourChange = () => {
      const now = new Date();
      const hour = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      
      if (minutes === 0 && seconds <= 5 && lastSavedHour.current !== hour) {
        console.log(`🔥 HOUR CHANGE: ${hour}:00`);
        setLiveIdleSeconds({});
        lastSavedHour.current = hour;
        setCurrentHour(hour);
        
        setTimeout(() => {
          fetchCorrectData();
        }, 1000);
      }
    };
    
    const hourCheckInterval = setInterval(checkHourChange, 1000);
    
    return () => clearInterval(hourCheckInterval);
  }, []);


  // Fetch data every 2 seconds
  useEffect(() => {
    fetchCorrectData();
    pollRef.current = setInterval(fetchCorrectData, 2000);
    
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);


  // ✅ UPDATED: Live timer for ALL machines (idle + running)
  useEffect(() => {
    const idleTimer = setInterval(() => {
      const now = new Date();
      const newLiveIdle = {};
      
      machines.forEach(machine => {
        const machineNo = machine.machine_no;
        
        // Calculate for BOTH idle AND running machines
        if (machine.machine_on && machine.last_activity && machine.last_activity !== 'Never') {
          const currentHourStart = new Date(now);
          currentHourStart.setMinutes(0, 0, 0);
          let idleSeconds = 0;


          try {
            const [hours, minutes, seconds] = machine.last_activity.split(':').map(Number);
            const lastTime = new Date(now);
            lastTime.setHours(hours, minutes, seconds || 0, 0);
            
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


          newLiveIdle[machineNo] = Math.min(idleSeconds, 3600);
        } else if (machine.machine_on && machine.on_since && machine.on_since !== 'Never' && machine.on_since !== 'Waiting for data') {
          // Fallback to on_since if no last_activity
          const currentHourStart = new Date(now);
          currentHourStart.setMinutes(0, 0, 0);
          let idleSeconds = 0;
          
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
            newLiveIdle[machineNo] = Math.min(idleSeconds, 3600);
          } catch (e) {
            newLiveIdle[machineNo] = 0;
          }
        } else {
          newLiveIdle[machineNo] = 0;
        }
      });


      setLiveIdleSeconds(newLiveIdle);
    }, 1000);


    return () => clearInterval(idleTimer);
  }, [machines, currentHour]);


  const getMachineColor = (machine) => {
    if (!machine || !machine.machine_on) return '#374151';
    if (machine.is_producing) return '#10b981';
    return '#f59e0b';
  };


  const getMachineStatus = (machine) => {
    if (!machine || !machine.machine_on) return 'OFFLINE';
    if (machine.is_producing) return 'RUNNING';
    return 'IDLE';
  };


  const getStatusBadgeColor = (machine) => {
    if (!machine || !machine.machine_on) return '#6b7280';
    if (machine.is_producing) return '#10b981';
    return '#f59e0b';
  };


  const handleMachineClick = (machine) => {
    setSelectedMachine(machine);
  };


  const closeModal = () => {
    setSelectedMachine(null);
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
        Loading Plant 1...
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


      {/* Header */}
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
            Plant 1 - Live Status
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
              Hour: {currentHour.toString().padStart(2, '0')}:XX
            </span>
          </div>
        </div>


        {/* Stats Grid */}
        <div 
          className="stats-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '15px'
          }}
        >
          <div style={{
            textAlign: 'center',
            padding: '10px',
            backgroundColor: '#0f172a',
            borderRadius: '12px'
          }}>
            <div style={{
              fontSize: 'clamp(28px, 5vw, 36px)',
              fontWeight: 'bold',
              color: '#10b981'
            }}>
              {onMachines}
            </div>
            <div style={{
              fontSize: 'clamp(10px, 2vw, 12px)',
              color: '#94a3b8',
              textTransform: 'uppercase'
            }}>
              ON
            </div>
          </div>


          <div style={{
            textAlign: 'center',
            padding: '10px',
            backgroundColor: '#0f172a',
            borderRadius: '12px'
          }}>
            <div style={{
              fontSize: 'clamp(28px, 5vw, 36px)',
              fontWeight: 'bold',
              color: '#10b981'
            }}>
              {runningMachines}
            </div>
            <div style={{
              fontSize: 'clamp(10px, 2vw, 12px)',
              color: '#94a3b8',
              textTransform: 'uppercase'
            }}>
              RUNNING
            </div>
          </div>


          <div style={{
            textAlign: 'center',
            padding: '10px',
            backgroundColor: '#0f172a',
            borderRadius: '12px'
          }}>
            <div style={{
              fontSize: 'clamp(28px, 5vw, 36px)',
              fontWeight: 'bold',
              color: '#f59e0b'
            }}>
              {idleMachines}
            </div>
            <div style={{
              fontSize: 'clamp(10px, 2vw, 12px)',
              color: '#94a3b8',
              textTransform: 'uppercase'
            }}>
              IDLE
            </div>
          </div>


          <div style={{
            textAlign: 'center',
            padding: '10px',
            backgroundColor: '#0f172a',
            borderRadius: '12px'
          }}>
            <div style={{
              fontSize: 'clamp(28px, 5vw, 36px)',
              fontWeight: 'bold',
              color: '#6b7280'
            }}>
              {offlineMachines}
            </div>
            <div style={{
              fontSize: 'clamp(10px, 2vw, 12px)',
              color: '#94a3b8',
              textTransform: 'uppercase'
            }}>
              OFFLINE
            </div>
          </div>


          <div style={{
            textAlign: 'center',
            padding: '10px',
            backgroundColor: '#0f172a',
            borderRadius: '12px'
          }}>
            <div style={{
              fontSize: 'clamp(28px, 5vw, 36px)',
              fontWeight: 'bold',
              color: '#3b82f6'
            }}>
              {totalMachines}
            </div>
            <div style={{
              fontSize: 'clamp(10px, 2vw, 12px)',
              color: '#94a3b8',
              textTransform: 'uppercase'
            }}>
              TOTAL
            </div>
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


      {/* Machine Cards */}
      <div className="machine-grid" style={{
        display: 'grid',
        gap: '20px'
      }}>
        {sortedMachines.map((machine) => {
          const liveIdle = liveIdleSeconds[machine.machine_no] || 0;
          const totalIdleMinutes = machine.idle_time || 0;
          const currentCount = machine.current_hour_count || 0;  
          
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
              {/* Machine Header */}
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


              {/* Current Hour Count */}
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
                  {currentCount}
                </div>
              </div>


              {/* Machine ON Since */}
              {machine.on_since && machine.on_since !== 'Never' && machine.on_since !== 'Waiting for data' && (
                <div style={{
                  padding: '10px',
                  backgroundColor: '#065f46',
                  borderRadius: '10px',
                  marginBottom: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{
                      fontSize: 'clamp(9px, 1.8vw, 10px)',
                      color: '#d1fae5',
                      marginBottom: '4px'
                    }}>
                      Machine ON at
                    </div>
                    <div style={{
                      fontSize: 'clamp(16px, 3.2vw, 18px)',
                      fontWeight: 'bold',
                      color: '#10b981'
                    }}>
                      {machine.on_since}
                    </div>
                  </div>
                  {machine.on_duration_minutes && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: 'clamp(16px, 3.2vw, 18px)',
                        fontWeight: 'bold',
                        color: '#10b981'
                      }}>
                        {machine.on_duration_minutes}'
                      </div>
                      <div style={{
                        fontSize: 'clamp(9px, 1.8vw, 10px)',
                        color: '#d1fae5'
                      }}>
                        min ago
                      </div>
                    </div>
                  )}
                </div>
              )}


              {/* First Production */}
              {machine.first_count_at && machine.first_count_at !== 'Never' && machine.first_count_at !== 'Waiting for data' && (
                <div style={{
                  padding: '10px',
                  backgroundColor: '#1e40af',
                  borderRadius: '10px',
                  marginBottom: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{
                      fontSize: 'clamp(9px, 1.8vw, 10px)',
                      color: '#dbeafe',
                      marginBottom: '4px'
                    }}>
                      Start Production at
                    </div>
                    <div style={{
                      fontSize: 'clamp(16px, 3.2vw, 18px)',
                      fontWeight: 'bold',
                      color: '#3b82f6'
                    }}>
                      {machine.first_count_at}
                    </div>
                  </div>
                  {machine.time_to_first_count && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: 'clamp(16px, 3.2vw, 18px)',
                        fontWeight: 'bold',
                        color: '#3b82f6'
                      }}>
                        {machine.time_to_first_count}'
                      </div>
                      <div style={{
                        fontSize: 'clamp(9px, 1.8vw, 10px)',
                        color: '#dbeafe'
                      }}>
                        min delay
                      </div>
                    </div>
                  )}
                </div>
              )}


              {/* ✅ NEW: Last Count Time - EXACTLY LIKE PLANT 2 */}
              {currentCount > 0 && machine.last_activity && machine.last_activity !== 'Never' && machine.last_activity !== 'Waiting for data' && (
                <div style={{
                  padding: '10px',
                  backgroundColor: '#713f12',
                  borderRadius: '10px',
                  marginBottom: '12px',
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
                      {machine.last_activity}
                    </div>
                  </div>
                  <div style={{
                    fontSize: 'clamp(11px, 2.2vw, 14px)',
                    color: '#fef3c7'
                  }}>
                    {currentCount} counts
                  </div>
                </div>
              )}


              {/* Live Idle Warning - ONLY FOR IDLE MACHINES */}
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
                    fontSize: 'clamp(10px, 2vw, 11px)',
                    color: '#fed7aa',
                    marginBottom: '4px',
                    fontWeight: 'bold'
                  }}>
                    ⚠️ MACHINE IDLE (Live)
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
                    Since {machine.last_activity && machine.last_activity !== 'Never' ? machine.last_activity : 'machine ON'}
                  </div>
                </div>
              )}


              {/* Idle Time & Shut Height */}
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
                    {machine.total_shift_idle_time || 0} min 
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
                    {machine.shut_height && machine.shut_height !== 'Waiting for data' 
                      ? (typeof machine.shut_height === 'number' 
                          ? machine.shut_height.toFixed(2) 
                          : machine.shut_height)
                      : 'N/A'}
                  </div>
                </div>
              </div>


              {/* Last Hour & Cumulative */}
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


      {/* Modal */}
      {selectedMachine && (
        <Plant1LiveModal 
          machine={selectedMachine} 
          onClose={closeModal} 
        />
      )}
    </div>
  );
}





