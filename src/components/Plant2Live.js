// import React, { useEffect, useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';

// const API_BASE = 'http://192.168.0.34:8000';

// // =================================================================================
// // THEME TOGGLE
// // =================================================================================
// const ThemeToggle = ({ isDark, toggleTheme }) => (
//   <button
//     onClick={toggleTheme}
//     style={{
//       display: 'flex', alignItems: 'center', gap: '8px',
//       padding: '7px 18px', borderRadius: '40px', cursor: 'pointer',
//       background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(99,102,241,0.08)',
//       border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(99,102,241,0.25)'}`,
//       color: isDark ? '#e2e8f0' : '#4f46e5',
//       fontSize: '12px', fontWeight: 600, transition: 'all 0.2s ease',
//     }}
//   >
//     {isDark
//       ? <><i className="bi bi-sun-fill"></i><span>Light Mode</span></>
//       : <><i className="bi bi-moon-fill"></i><span>Dark Mode</span></>}
//   </button>
// );

// // =================================================================================
// // ANIMATED BACKGROUND
// // =================================================================================
// const AnimatedBackground = ({ isDark }) => {
//   const canvasRef = useRef(null);
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d');
//     let raf, t = 0, W, H;
//     const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
//     const animate = () => {
//       ctx.clearRect(0, 0, W, H);
//       let grad;
//       if (isDark) {
//         grad = ctx.createLinearGradient(0, 0, W, H);
//         grad.addColorStop(0, '#1a0b40');
//         grad.addColorStop(0.5, '#4b2072');
//         grad.addColorStop(1, '#5a1137');
//       } else {
//         grad = ctx.createLinearGradient(0, 0, W, H);
//         grad.addColorStop(0, '#eef2ff');
//         grad.addColorStop(0.5, '#f5f3ff');
//         grad.addColorStop(1, '#ede9fe');
//       }
//       ctx.fillStyle = grad;
//       ctx.fillRect(0, 0, W, H);
//       if (isDark) {
//         for (let i = 0; i < 3; i++) {
//           const ox = (Math.sin(t * 0.0008 + i * 2.1) * 0.3 + 0.5) * W;
//           const oy = (Math.cos(t * 0.0006 + i * 1.7) * 0.3 + 0.5) * H;
//           const r = 160 + i * 70;
//           const og = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
//           og.addColorStop(0, i === 0 ? 'rgba(96,49,235,0.12)' : i === 1 ? 'rgba(139,92,246,0.08)' : 'rgba(227,86,157,0.08)');
//           og.addColorStop(1, 'transparent');
//           ctx.fillStyle = og;
//           ctx.fillRect(0, 0, W, H);
//         }
//       } else {
//         for (let i = 0; i < 3; i++) {
//           const ox = (Math.sin(t * 0.0008 + i * 2.1) * 0.3 + 0.5) * W;
//           const oy = (Math.cos(t * 0.0006 + i * 1.7) * 0.3 + 0.5) * H;
//           const r = 200 + i * 80;
//           const og = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
//           og.addColorStop(0, i === 0 ? 'rgba(99,102,241,0.08)' : i === 1 ? 'rgba(139,92,246,0.06)' : 'rgba(168,85,247,0.05)');
//           og.addColorStop(1, 'transparent');
//           ctx.fillStyle = og;
//           ctx.fillRect(0, 0, W, H);
//         }
//       }
//       for (let i = 0; i < 45; i++) {
//         const x = (Math.sin(t * 0.002 + i) * 0.5 + 0.5) * W;
//         const y = (Math.cos(t * 0.0015 + i * 2) * 0.4 + 0.5) * H;
//         ctx.beginPath();
//         ctx.arc(x, y, 1.1, 0, Math.PI * 2);
//         ctx.fillStyle = isDark
//           ? `rgba(180,100,255,${0.06 + Math.sin(t * 0.005 + i) * 0.035})`
//           : `rgba(99,102,241,${0.04 + Math.sin(t * 0.005 + i) * 0.02})`;
//         ctx.fill();
//       }
//       t++;
//       raf = requestAnimationFrame(animate);
//     };
//     resize();
//     animate();
//     window.addEventListener('resize', resize);
//     return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
//   }, [isDark]);
//   return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
// };

// // =================================================================================
// // MAIN COMPONENT
// // =================================================================================
// export default function Plant2Live() {
//   const navigate = useNavigate();

//   const [isDark, setIsDark] = useState(true);
//   const [machines, setMachines] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);
  
//   const [selectedMachine, setSelectedMachine] = useState(null);
//   const [machineChanges, setMachineChanges] = useState([]);
//   const [showChanges, setShowChanges] = useState(false);
  
//   // ✅ History Modal States
//   const [showHistoryView, setShowHistoryView] = useState(false);
//   const [historyData, setHistoryData] = useState([]);
//   const [historyLoading, setHistoryLoading] = useState(false);
//   const [historyError, setHistoryError] = useState(''); 
//   const [historyDate, setHistoryDate] = useState(new Date().toISOString().split('T')[0]); // Default: Today

//   const [currentHour, setCurrentHour] = useState(new Date().getHours());
//   const [isMounted, setIsMounted] = useState(false);
//   const [currentShift, setCurrentShift] = useState('A');
//   const [liveIdleSeconds, setLiveIdleSeconds] = useState({});
//   const [currentTime, setCurrentTime] = useState(new Date());

//   const intervalRef = useRef(null);
//   const lastSavedHour = useRef(new Date().getHours());

//   const formatLiveIdle = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${String(secs).padStart(2, '0')}`;
//   };

//   const getMachineStatus = (m) => {
//     if (!m.machine_on) return 'OFFLINE';
//     if (m.is_producing) return 'RUNNING';
//     return 'IDLE';
//   };

//   const getMachineColor = (machine) => {
//     if (!machine.machine_on) return '#475569'; 
//     if (machine.is_producing) return '#10b981'; 
//     return '#f59e0b'; 
//   };

//   const getMachineGlow = (machine) => {
//     if (!machine.machine_on) return 'none';
//     if (machine.is_producing) return '0 0 15px rgba(16, 185, 129, 0.4)';
//     return '0 0 15px rgba(245, 158, 11, 0.4)';
//   };

//   useEffect(() => { setIsMounted(true); return () => setIsMounted(false); }, []);
//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   useEffect(() => {
//     const updateShift = () => {   
//       const now = new Date();
//       const mins = now.getHours() * 60 + now.getMinutes();
//       setCurrentShift(mins >= 510 && mins < 1200 ? 'A' : 'B');
//       setCurrentHour(now.getHours());
//     };
    
//     updateShift();
//     const shiftInterval = setInterval(updateShift, 60000);
//     return () => clearInterval(shiftInterval);
//   }, []);
  
//   const fetchData = async () => {
//     if (!isMounted) return;
//     try {
//       const response = await fetch(`${API_BASE}/api/plant2-live/`, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' }
//       });
//       if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//       const data = await response.json();
//       if (data.success && Array.isArray(data.machines)) {
//         if (isMounted) { setMachines(data.machines); setError(''); }
//       }
//     } catch (err) {
//       if (isMounted) setError(`Failed: ${err.message}`);
//     } finally {
//       if (isMounted) setLoading(false);
//     }
//   };

//   // ✅ YAHAN CHANGE KIYA HAI: setInterval ko hatakar recursive setTimeout lagaya
//   useEffect(() => {
//     if (!isMounted) return;
    
//     let isFetching = false;
//     let timerId;

//     const pollData = async () => {
//       if (isFetching) return; 
      
//       // Agar modal khula hai ya history view me ho toh background call pause rakho
//       // Taaki History API jaldi load ho aur network jam na ho
//       if (showHistoryView || selectedMachine) {
//         timerId = setTimeout(pollData, 2000);
//         return;
//       }

//       isFetching = true;
//       await fetchData();
//       isFetching = false;

//       if (isMounted) {
//         timerId = setTimeout(pollData, 2000);
//       }
//     };

//     pollData(); // First call

//     return () => clearTimeout(timerId);
//   }, [isMounted, showHistoryView, selectedMachine]);

//   useEffect(() => {
//     const idleTimer = setInterval(() => {
//       const now = new Date();
//       const newLiveIdle = {};
//       machines.forEach(machine => {
//         const machineNo = machine.machine_no;
//         if (machine.machine_on && !machine.is_producing) {
//           const currentHourStart = new Date(now);
//           currentHourStart.setMinutes(0, 0, 0);
//           let idleSeconds = 0;
          
//           if (machine.last_activity && machine.last_activity !== 'Never') {
//             try {
//               const [hours, minutes, seconds] = machine.last_activity.split(':').map(Number);
//               const lastTime = new Date(now);
//               lastTime.setHours(hours, minutes, seconds, 0);
//               idleSeconds = lastTime >= currentHourStart ? Math.floor((now - lastTime) / 1000) : Math.floor((now - currentHourStart) / 1000);
//             } catch (e) { idleSeconds = 0; }
//           } else if (machine.on_since) {
//             try {
//               const [hours, minutes] = machine.on_since.split(':').map(Number);
//               const onTime = new Date(now);
//               onTime.setHours(hours, minutes, 0, 0);
//               idleSeconds = onTime >= currentHourStart ? Math.floor((now - onTime) / 1000) : Math.floor((now - currentHourStart) / 1000);
//             } catch (e) { idleSeconds = 0; }
//           }
//           newLiveIdle[machineNo] = Math.min(idleSeconds, 3600);
//         } else {
//           newLiveIdle[machineNo] = 0;
//         }
//       });
//       setLiveIdleSeconds(newLiveIdle);
//     }, 1000);
//     return () => clearInterval(idleTimer);
//   }, [machines, currentHour]);

//   useEffect(() => {
//     const checkHourChange = async () => {
//       const now = new Date();
//       const hour = now.getHours();
//       const minutes = now.getMinutes();
//       const seconds = now.getSeconds();
      
//       if (minutes === 0 && seconds <= 5 && lastSavedHour.current !== hour) {
//         try {
//           const response = await fetch(`${API_BASE}/api/save-hourly-snapshot/`, {
//             method: 'POST', headers: { 'Content-Type': 'application/json' }
//           });
//           const data = await response.json();
//           if (data.success) {
//             setLiveIdleSeconds({});
//             lastSavedHour.current = hour;
//             setCurrentHour(hour);
//             setTimeout(() => { fetchData(); }, 1000);
//           }
//         } catch (error) { console.error('❌ Request error:', error); }
//       }
//     };
//     const hourCheckInterval = setInterval(checkHourChange, 1000);
//     return () => clearInterval(hourCheckInterval);
//   }, []);

//   const checkLunchTime = () => {
//     const now = new Date();
//     const hour = now.getHours();
//     const minute = now.getMinutes();
//     return hour === 12 && minute >= 30;
//   };

//   const handleMachineClick = (machine) => {
//     setSelectedMachine(machine);
//     setShowChanges(false);
//     setShowHistoryView(false); 
    
//     fetch(`${API_BASE}/api/machine-changes/?machine_no=${machine.machine_no}`)
//       .then(res => res.json())
//       .then(data => { if (data.success) setMachineChanges(data.changes); })
//       .catch(err => console.error('Error fetching changes:', err));
//   };

//   // ✅ THE MASTER FIX: Changed to /api/api/machine-history/ to match your backend exactly
//   const fetchMachineHistory = (machineNo, dateStr) => {
//     setHistoryLoading(true);
//     setHistoryError(''); 
    
//     fetch(`${API_BASE}/api/machine-history/?plant_no=2&machine_no=${machineNo}&date=${dateStr}`)
//       .then(res => {
//           if (!res.ok) {
//               throw new Error(`Server API Error: ${res.status}`);
//           }
//           return res.json();
//       })
//       .then(data => {
//         if (data.success) {
//           setHistoryData(data.events);
//         } else {
//           setHistoryData([]);
//           setHistoryError(data.error || 'API returned success: false');
//         }
//       })
//       .catch(err => {
//         console.error('Error fetching history:', err);
//         setHistoryData([]);
//         setHistoryError(err.message);
//       })
//       .finally(() => {
//         setHistoryLoading(false);
//       });
//   };

//   const toggleHistoryView = () => {
//     const newShowHistory = !showHistoryView;
//     setShowHistoryView(newShowHistory);
    
//     if (newShowHistory && selectedMachine) {
//         fetchMachineHistory(selectedMachine.machine_no, historyDate);
//     }
//   };

//   const closeModal = () => {
//     setSelectedMachine(null);
//     setMachineChanges([]);
//     setShowChanges(false);
//     setShowHistoryView(false);
//   };

//   const eventIcons = {
//     'ON': '🟢',
//     'OFF': '🔴',
//     'SHUT_HEIGHT_CHANGE': '🔧',
//     'TOOL_CHANGE': '⚙️'
//   };

//   const totalMachines = machines.length;
//   const onMachines = machines.filter(m => m.machine_on).length;
//   const runningMachines = machines.filter(m => m.is_producing).length;
//   const idleMachines = onMachines - runningMachines;
//   const offlineMachines = totalMachines - onMachines;
//   const sortedMachines = [...machines].sort((a, b) => a.machine_no - b.machine_no);
//   const isCurrentlyLunch = checkLunchTime();

//   if (loading && machines.length === 0) {
//     return (
//       <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#020617', color: '#10b981', fontSize: '24px', fontWeight: 'bold' }}>
//         <div className="loader" style={{ marginBottom: '20px', border: '4px solid #1e293b', borderTop: '4px solid #10b981', borderRadius: '50%', width: '50px', height: '50px', animation: 'spin 1s linear infinite' }}></div>
//         Loading Plant Dashboard...
//         <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
//       </div>
//     );
//   }

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'radial-gradient(circle at top, #1e293b 0%, #020617 100%)', 
//       padding: '20px',
//       color: '#f8fafc',
//       fontFamily: "'Inter', 'Segoe UI', sans-serif"
//     }}>
//       <style>{`
//         @keyframes hardPulse {
//           0%, 100% { opacity: 1; background-color: #9a3412; }
//           50% { opacity: 0.9; background-color: #7c2d12; box-shadow: 0 0 20px rgba(249, 115, 22, 0.6); }
//         }
//         @keyframes lunchBannerPulse {
//           0%, 100% { background-color: rgba(59, 130, 246, 0.15); border-color: rgba(96, 165, 250, 0.4); }
//           50% { background-color: rgba(59, 130, 246, 0.3); border-color: rgba(96, 165, 250, 0.8); box-shadow: 0 0 15px rgba(59, 130, 246, 0.3); }
//         }
//         .card-hover:hover {
//           transform: translateY(-6px);
//           box-shadow: 0 12px 24px rgba(0,0,0,0.5) !important;
//         }
//         ::-webkit-scrollbar { width: 8px; }
//         ::-webkit-scrollbar-track { background: #0f172a; }
//         ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        
//         .timeline-container {
//             position: relative;
//             padding: 20px 0;
//         }
//         .timeline-line {
//             position: absolute;
//             left: 24px;
//             top: 0;
//             bottom: 0;
//             width: 2px;
//             background: rgba(255,255,255,0.1);
//         }
//         .timeline-item {
//             position: relative;
//             padding-left: 60px;
//             margin-bottom: 30px;
//         }
//         .timeline-icon {
//             position: absolute;
//             left: 12px;
//             top: 0;
//             width: 26px;
//             height: 26px;
//             border-radius: 50%;
//             background: #1e293b;
//             border: 2px solid rgba(255,255,255,0.1);
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             font-size: 12px;
//             z-index: 2;
//         }
//         .timeline-content {
//             background: rgba(255,255,255,0.03);
//             border: 1px solid rgba(255,255,255,0.05);
//             padding: 15px;
//             border-radius: 12px;
//         }
//       `}</style>

//       {/* HEADER SECTION */}
//       <div style={{
//         display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px',
//         padding: '24px', background: 'rgba(30, 41, 59, 0.7)',
//         borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)',
//         boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
//       }}>
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
//             <div style={{ width: '12px', height: '40px', background: '#10b981', borderRadius: '6px', boxShadow: '0 0 10px rgba(16,185,129,0.5)' }}></div>
//             <h1 style={{ margin: 0, fontSize: '32px', color: '#f8fafc', fontWeight: '800' }}>
//               Plant 2 <span style={{ color: '#10b981' }}>Live Status</span>
//             </h1>
//           </div>
          
//           <div style={{ display: 'flex', gap: '12px', fontSize: '14px', fontWeight: '600' }}>
//             <div style={{ padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px', color: '#34d399' }}>
//               Shift: {currentShift}
//             </div>
//             <div style={{ padding: '8px 16px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
//               Hour: {currentHour.toString().padStart(2, '0')}:xx
//             </div>
//           </div>
//         </div>
        
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
//           {[
//             { label: 'ON MACHINES', value: onMachines, color: '#34d399', bg: 'rgba(16, 185, 129, 0.05)' },
//             { label: 'RUNNING', value: runningMachines, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
//             { label: 'IDLE', value: idleMachines, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
//             { label: 'OFFLINE', value: offlineMachines, color: '#64748b', bg: 'rgba(100, 116, 139, 0.1)' },
//             { label: 'TOTAL', value: totalMachines, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' }
//           ].map((stat, i) => (
//             <div key={i} style={{ textAlign: 'center', padding: '16px 10px', background: stat.bg, borderRadius: '16px', border: `1px solid ${stat.color}30` }}>
//               <div style={{ fontSize: '32px', fontWeight: '900', color: stat.color, lineHeight: '1' }}>{stat.value}</div>
//               <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginTop: '8px', fontWeight: '700' }}>{stat.label}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* MACHINES GRID */}
//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
//         {sortedMachines.map((machine) => {
//           const liveIdle = liveIdleSeconds[machine.machine_no] || 0;
//           const statusColor = getMachineColor(machine);
//           const isIdle = machine.machine_on && !machine.is_producing;
          
//           return (
//             <div
//               key={machine.machine_no}
//               className="card-hover"
//               onClick={() => handleMachineClick(machine)}
//               style={{
//                 position: 'relative',
//                 background: 'linear-gradient(145deg, #1e293b, #0f172a)',
//                 border: `1px solid rgba(255,255,255,0.05)`,
//                 borderTop: `4px solid ${statusColor}`,
//                 borderRadius: '20px',
//                 padding: '20px',
//                 cursor: 'pointer',
//                 transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
//                 boxShadow: `0 8px 20px rgba(0,0,0,0.4), ${getMachineGlow(machine)}`,
//               }}
//             >
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
//                 <div style={{ fontSize: '24px', fontWeight: '900', color: '#f8fafc' }}>
//                   Machine {machine.machine_no}
//                 </div>
//                 <div style={{
//                   fontSize: '11px', padding: '6px 12px', background: `${statusColor}20`,
//                   color: statusColor, borderRadius: '20px', fontWeight: '800', border: `1px solid ${statusColor}40`,
//                 }}>
//                   {getMachineStatus(machine)}
//                 </div>
//               </div>

//               {isCurrentlyLunch && !machine.is_producing && (
//                 <div style={{
//                   background: 'rgba(59, 130, 246, 0.15)',
//                   border: '1px solid rgba(96, 165, 250, 0.4)',
//                   color: '#93c5fd',
//                   padding: '10px',
//                   borderRadius: '12px',
//                   textAlign: 'center',
//                   fontWeight: '800',
//                   letterSpacing: '2px',
//                   marginBottom: '16px',
//                   display: 'flex',
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   gap: '10px',
//                   textTransform: 'uppercase',
//                   animation: 'lunchBannerPulse 3s infinite',
//                   boxShadow: 'inset 0 0 10px rgba(59, 130, 246, 0.1)'
//                 }}>
//                   <span style={{ fontSize: '20px' }}>🍽️</span> 
//                   <span>LUNCH TIME</span>
//                 </div>
//               )}

//               <div style={{ textAlign: 'center', padding: '24px 10px', background: 'rgba(2, 6, 23, 0.4)', borderRadius: '16px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.02)' }}>
//                 <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700', marginBottom: '10px' }}>
//                   Current Hour Production
//                 </div>
//                 <div style={{ fontSize: '56px', fontWeight: '900', color: statusColor, lineHeight: '1', textShadow: `0 0 20px ${statusColor}40` }}>
//                   {machine.current_hour_count || 0}
//                 </div>
//               </div>

//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
//                 <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px' }}>
//                   <div style={{ fontSize: '11px', color: '#94a3b8' }}>Machine ON at</div>
//                   <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#34d399' }}>{machine.on_since || '--:--'}</div>
//                 </div>
//                 <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
//                   <div style={{ fontSize: '11px', color: '#94a3b8' }}>Start Production at</div>
//                   <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#60a5fa' }}>{machine.first_count_at || '--:--'}</div>
//                   <div style={{ fontSize: '11px', color: '#60a5fa', opacity: 0.8 }}>Idle: {machine.time_to_first_count || 0} min</div>
//                 </div>
//               </div>

//               {!isCurrentlyLunch && isIdle && liveIdle > 0 && (
//                 <div style={{ padding: '16px', borderRadius: '12px', marginBottom: '16px', textAlign: 'center', animation: 'hardPulse 2s infinite', border: '1px solid rgba(249, 115, 22, 0.3)' }}>
//                   <div style={{ fontSize: '11px', color: '#fed7aa', fontWeight: '700', marginBottom: '8px' }}>⚠️ LIVE IDLE</div>
//                   <div style={{ fontSize: '32px', fontWeight: '900', color: '#fff', lineHeight: '1' }}>{formatLiveIdle(liveIdle)}</div>
//                 </div>
//               )}

//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
//                 <div style={{ padding: '12px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px' }}>
//                   <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>Total Idle (Hour)</div>
//                   <div style={{ fontSize: '16px', fontWeight: '800', color: '#fbbf24' }}>{machine.total_shift_idle_time || 0} min</div>
//                 </div>
//                 <div style={{ padding: '12px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px' }}>
//                   <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>Shut Height</div>
//                   <div style={{ fontSize: '16px', fontWeight: '800', color: '#f8fafc' }}>
//                     {typeof machine.shut_height === 'number' ? machine.shut_height.toFixed(2) : machine.shut_height || '--'}
//                   </div>
//                 </div>
//                 <div style={{ padding: '12px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px' }}>
//                   <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>Last Hour</div>
//                   <div style={{ fontSize: '16px', fontWeight: '800', color: '#94a3b8' }}>{machine.last_hour_count || 0}</div>
//                 </div>
//                 <div style={{ padding: '12px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '12px' }}>
//                   <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>Cumulative</div>
//                   <div style={{ fontSize: '16px', fontWeight: '800', color: '#10b981' }}>{machine.cumulative_count || 0}</div>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* MODAL POPUP */}
//       {selectedMachine && (
//         <div 
//           onClick={closeModal}
//           style={{
//             position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
//             backgroundColor: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(8px)',
//             display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px'
//           }}
//         >
//           <div 
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               backgroundColor: '#0f172a', borderRadius: '24px', padding: 0,
//               maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
//               boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
//               border: `1px solid rgba(255,255,255,0.1)`
//             }}
//           >
//             {/* Modal Header */}
//             <div style={{
//               padding: '30px', background: `linear-gradient(135deg, ${getMachineColor(selectedMachine)} 0%, #0f172a 150%)`,
//               borderTopLeftRadius: '24px', borderTopRightRadius: '24px'
//             }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
//                   <div style={{ fontSize: '32px', fontWeight: '900', color: 'white' }}>Machine {selectedMachine.machine_no}</div>
                  
//                   {!showHistoryView && (
//                     <div style={{ padding: '8px 20px', backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', borderRadius: '30px', fontWeight: '800' }}>
//                       {getMachineStatus(selectedMachine)}
//                     </div>
//                   )}
                  
//                   {/* History Button */}
//                   <div 
//                     title={showHistoryView ? "Back to Dashboard" : "View Timeline History"}
//                     style={{ position: 'relative', cursor: 'pointer', padding: '10px 15px', backgroundColor: showHistoryView ? '#10b981' : 'rgba(0,0,0,0.3)', color: 'white', borderRadius: '30px', fontWeight: '700', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s', display: 'flex', gap: '8px', alignItems: 'center' }}
//                     onClick={toggleHistoryView}>
//                     <span style={{ fontSize: '18px' }}>{showHistoryView ? "🔙" : "📅"}</span>
//                     <span>{showHistoryView ? "Live View" : "History"}</span>
//                   </div>
//                 </div>

//                 <button onClick={closeModal} style={{
//                   background: 'rgba(0,0,0,0.3)', color: 'white', border: 'none', borderRadius: '50%',
//                   width: '44px', height: '44px', fontSize: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
//                 }}>×</button>
//               </div>
//             </div>

//             {/* ========================================================= */}
//             {/* VIEW 1: HISTORY TIMELINE VIEW */}
//             {/* ========================================================= */}
//             {showHistoryView ? (
//               <div style={{ padding: '30px' }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
//                     <h2 style={{ margin: 0, color: '#f8fafc' }}>Events Timeline</h2>
//                     <input 
//                         type="date" 
//                         value={historyDate}
//                         onChange={(e) => {
//                             setHistoryDate(e.target.value);
//                             fetchMachineHistory(selectedMachine.machine_no, e.target.value);
//                         }}
//                         style={{
//                             padding: '10px 15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)',
//                             background: '#1e293b', color: 'white', fontFamily: 'inherit', fontWeight: 'bold'
//                         }}
//                     />
//                 </div>

//                 {historyError ? (
//                     <div style={{ textAlign: 'center', padding: '50px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '16px', border: '1px dashed rgba(239, 68, 68, 0.3)' }}>
//                         <div style={{ fontSize: '40px', marginBottom: '10px' }}>⚠️</div>
//                         <h3 style={{ color: '#ef4444', margin: 0 }}>API Connection Error</h3>
//                         <p style={{ color: '#fca5a5', fontSize: '14px' }}>{historyError}</p>
//                     </div>
//                 ) : historyLoading ? (
//                     <div style={{ textAlign: 'center', padding: '50px', color: '#94a3b8' }}>
//                       <div className="loader" style={{ margin: '0 auto 20px', border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #10b981', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
//                       Loading Timeline Data...
//                     </div>
//                 ) : historyData.length === 0 ? (
//                     <div style={{ textAlign: 'center', padding: '50px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.05)' }}>
//                         <div style={{ fontSize: '40px', marginBottom: '10px' }}>📭</div>
//                         <h3 style={{ color: '#94a3b8', margin: 0 }}>No Events Found</h3>
//                         <p style={{ color: '#64748b', fontSize: '14px' }}>There are no recorded events for this machine on {historyDate}</p>
//                     </div>
//                 ) : (
//                     <div className="timeline-container">
//                         <div className="timeline-line"></div>
                        
//                         {historyData.map((event, index) => {
//                             const isOff = event.type === 'OFF';
//                             const isChange = event.type.includes('CHANGE');
//                             const color = isOff ? '#ef4444' : isChange ? '#3b82f6' : '#10b981';
                            
//                             return (
//                                 <div key={index} className="timeline-item">
//                                     <div className="timeline-icon" style={{ borderColor: color }}>
//                                         {eventIcons[event.type] || '📌'}
//                                     </div>
//                                     <div className="timeline-content" style={{ borderLeft: `3px solid ${color}` }}>
//                                         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
//                                             <span style={{ fontWeight: 'bold', color: color, fontSize: '16px' }}>{event.type.replace(/_/g, ' ')}</span>
//                                             <span style={{ color: '#94a3b8', fontSize: '14px', background: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: '20px' }}>{event.time}</span>
//                                         </div>
//                                         <div style={{ color: '#e2e8f0', fontSize: '14px', lineHeight: '1.5' }}>
//                                             {event.details || (isOff ? 'Machine detected as Offline/No Signal' : 'Machine Power/Signal Restored')}
//                                         </div>
//                                         <div style={{ fontSize: '11px', color: '#64748b', marginTop: '10px', display: 'flex', gap: '15px' }}>
//                                             <span>Shift: {event.shift}</span>
//                                             <span>System Time: {event.raw_time}</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 )}
//               </div>
//             ) : (

//             /* ========================================================= */
//             /* VIEW 2: ORIGINAL MAIN VIEW */
//             /* ========================================================= */
//             <div style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
//               {isCurrentlyLunch && !selectedMachine.is_producing && (
//                 <div style={{
//                   background: 'rgba(59, 130, 246, 0.15)',
//                   border: '1px solid rgba(96, 165, 250, 0.4)',
//                   color: '#93c5fd',
//                   padding: '16px',
//                   borderRadius: '12px',
//                   textAlign: 'center',
//                   fontWeight: '800',
//                   letterSpacing: '2px',
//                   display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', textTransform: 'uppercase',
//                   animation: 'lunchBannerPulse 3s infinite',
//                 }}>
//                   <span style={{ fontSize: '24px' }}>🍽️</span> 
//                   <span style={{ fontSize: '18px' }}>LUNCH TIME BREAK</span>
//                 </div>
//               )}

//               <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
//                 <h3 style={{ margin: '0 0 16px 0', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}><span>⏱️</span> Live Session Timings</h3>
//                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
//                   <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}>
//                     <div>
//                       <div style={{fontSize: '12px', color: '#94a3b8'}}>Machine Turned ON</div>
//                       <div style={{fontSize: '20px', fontWeight: '700', color: '#34d399'}}>{selectedMachine.on_since || '--:--'}</div>
//                     </div>
//                     <div style={{textAlign: 'right'}}>
//                       <div style={{fontSize: '20px', fontWeight: '700', color: '#34d399'}}>{selectedMachine.on_duration_minutes || 0}</div>
//                       <div style={{fontSize: '10px', color: '#94a3b8'}}>minutes ago</div>
//                     </div>
//                   </div>
//                   <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}>
//                     <div>
//                       <div style={{fontSize: '12px', color: '#94a3b8'}}>First Count Received</div>
//                       <div style={{fontSize: '20px', fontWeight: '700', color: '#60a5fa'}}>{selectedMachine.first_count_at || '--:--'}</div>
//                     </div>
//                     <div style={{textAlign: 'right'}}>
//                       <div style={{fontSize: '20px', fontWeight: '700', color: '#60a5fa'}}>{selectedMachine.time_to_first_count || 0}</div>
//                       <div style={{fontSize: '10px', color: '#94a3b8'}}>min delay</div>
//                     </div>
//                   </div>
//                   <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}>
//                     <div>
//                       <div style={{fontSize: '12px', color: '#94a3b8'}}>Last Count This Hour</div>
//                       <div style={{fontSize: '20px', fontWeight: '700', color: '#fbbf24'}}>{selectedMachine.last_activity || 'Never'}</div>
//                     </div>
//                     <div style={{textAlign: 'right'}}>
//                       <div style={{fontSize: '16px', fontWeight: '700', color: '#fbbf24'}}>{selectedMachine.current_hour_count} counts</div>
//                     </div>
//                   </div>
//                 </div>
//                 <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(2, 6, 23, 0.4)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
//                   <span style={{ color: '#94a3b8' }}>Status</span>
//                   <span style={{ fontWeight: 'bold', color: selectedMachine.is_producing ? '#10b981' : '#f59e0b' }}>
//                     {selectedMachine.is_producing ? '✅ Currently Producing' : '⚠️ Idle / Offline'}
//                   </span>
//                 </div>
//               </div>

//               <div style={{ textAlign: 'center', padding: '30px', background: 'linear-gradient(145deg, #1e293b, #0f172a)', borderRadius: '20px', border: `1px solid rgba(255,255,255,0.05)`, marginTop: '24px', boxShadow: `inset 0 4px 20px rgba(0,0,0,0.5)` }}>
//                 <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px', fontWeight: '700', textTransform: 'uppercase' }}>Current Hour Production</div>
//                 <div style={{ fontSize: '72px', fontWeight: '900', color: getMachineColor(selectedMachine), textShadow: `0 0 30px ${getMachineColor(selectedMachine)}40`, lineHeight: '1' }}>{selectedMachine.current_hour_count || 0}</div>
//                 <div style={{ fontSize: '12px', color: '#64748b', marginTop: '10px' }}>Resets every hour at XX:00:00</div>
//               </div>

//               <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '24px' }}>
//                 <h3 style={{ margin: '0 0 16px 0', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px' }}><span>👤</span> Customer Information</h3>
//                 <div style={{ display: 'grid', gap: '10px' }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'rgba(2, 6, 23, 0.4)', borderRadius: '8px' }}><span style={{ color: '#94a3b8' }}>Customer</span><span style={{ fontWeight: 'bold', color: '#fff' }}>{selectedMachine.tool_customer || 'N/A'}</span></div>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'rgba(2, 6, 23, 0.4)', borderRadius: '8px' }}><span style={{ color: '#94a3b8' }}>Model</span><span style={{ fontWeight: 'bold', color: '#fff' }}>{selectedMachine.tool_model || 'N/A'}</span></div>
//                 </div>
//               </div>

//               <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '24px' }}>
//                 <h3 style={{ margin: '0 0 16px 0', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}><span>🔧</span> Tool Information</h3>
//                 <div style={{ display: 'grid', gap: '10px' }}>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'rgba(2, 6, 23, 0.4)', borderRadius: '8px' }}><span style={{ color: '#94a3b8' }}>Part Name</span><span style={{ fontWeight: 'bold', color: '#fff' }}>{selectedMachine.tool_part_name || 'N/A'}</span></div>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'rgba(2, 6, 23, 0.4)', borderRadius: '8px' }}><span style={{ color: '#94a3b8' }}>Tool Name</span><span style={{ fontWeight: 'bold', color: '#fff' }}>{selectedMachine.tool_name || 'N/A'}</span></div>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'rgba(2, 6, 23, 0.4)', borderRadius: '8px' }}><span style={{ color: '#94a3b8' }}>Part Number</span><span style={{ fontWeight: 'bold', color: '#fff' }}>{selectedMachine.tool_part_number || 'N/A'}</span></div>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'rgba(2, 6, 23, 0.4)', borderRadius: '8px' }}><span style={{ color: '#94a3b8' }}>Shut Height</span><span style={{ fontWeight: 'bold', color: '#fff' }}>{typeof selectedMachine.shut_height === 'number' ? selectedMachine.shut_height.toFixed(2) : selectedMachine.shut_height || 'N/A'}</span></div>
//                   <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'rgba(2, 6, 23, 0.4)', borderRadius: '8px' }}><span style={{ color: '#94a3b8' }}>Tool ID</span><span style={{ fontWeight: 'bold', color: '#10b981', wordBreak: 'break-all' }}>{selectedMachine.tool_id || 'N/A'}</span></div>
//                 </div>
//               </div>

//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginTop: '24px' }}>
//                 <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}><div style={{ fontSize: '11px', color: '#64748b', letterSpacing: '1px', marginBottom: '10px' }}>LAST HOUR</div><div style={{ fontSize: '36px', fontWeight: '800', color: '#f8fafc' }}>{selectedMachine.last_hour_count || 0}</div></div>
//                 <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}><div style={{ fontSize: '11px', color: '#64748b', letterSpacing: '1px', marginBottom: '10px' }}>CUMULATIVE</div><div style={{ fontSize: '36px', fontWeight: '800', color: '#10b981' }}>{selectedMachine.cumulative_count || 0}</div></div>
//                 <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}><div style={{ fontSize: '11px', color: '#64748b', letterSpacing: '1px', marginBottom: '10px' }}>TOTAL IDLE</div><div style={{ fontSize: '36px', fontWeight: '800', color: '#f59e0b' }}>{selectedMachine.total_shift_idle_time || 0} <span style={{fontSize: '14px'}}>min</span></div></div>
//               </div>

//             </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://192.168.0.34:8000';

// =================================================================================
// IDLE REASONS & ICONS DATA (Updated with "Other" in all categories)
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
// THEME TOGGLE
// =================================================================================
const ThemeToggle = ({ isDark, toggleTheme }) => (
  <button
    onClick={toggleTheme}
    style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      padding: '7px 18px', borderRadius: '40px', cursor: 'pointer',
      background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(99,102,241,0.08)',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(99,102,241,0.25)'}`,
      color: isDark ? '#e2e8f0' : '#4f46e5',
      fontSize: '12px', fontWeight: 600, transition: 'all 0.2s ease',
    }}
  >
    {isDark
      ? <><i className="bi bi-sun-fill"></i><span>Light Mode</span></>
      : <><i className="bi bi-moon-fill"></i><span>Dark Mode</span></>}
  </button>
);

// =================================================================================
// ANIMATED BACKGROUND
// =================================================================================
const AnimatedBackground = ({ isDark }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf, t = 0, W, H;
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      let grad;
      if (isDark) {
        grad = ctx.createLinearGradient(0, 0, W, H);
        grad.addColorStop(0, '#1a0b40');
        grad.addColorStop(0.5, '#4b2072');
        grad.addColorStop(1, '#5a1137');
      } else {
        grad = ctx.createLinearGradient(0, 0, W, H);
        grad.addColorStop(0, '#eef2ff');
        grad.addColorStop(0.5, '#f5f3ff');
        grad.addColorStop(1, '#ede9fe');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      if (isDark) {
        for (let i = 0; i < 3; i++) {
          const ox = (Math.sin(t * 0.0008 + i * 2.1) * 0.3 + 0.5) * W;
          const oy = (Math.cos(t * 0.0006 + i * 1.7) * 0.3 + 0.5) * H;
          const r = 160 + i * 70;
          const og = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
          og.addColorStop(0, i === 0 ? 'rgba(96,49,235,0.12)' : i === 1 ? 'rgba(139,92,246,0.08)' : 'rgba(227,86,157,0.08)');
          og.addColorStop(1, 'transparent');
          ctx.fillStyle = og;
          ctx.fillRect(0, 0, W, H);
        }
      } else {
        for (let i = 0; i < 3; i++) {
          const ox = (Math.sin(t * 0.0008 + i * 2.1) * 0.3 + 0.5) * W;
          const oy = (Math.cos(t * 0.0006 + i * 1.7) * 0.3 + 0.5) * H;
          const r = 200 + i * 80;
          const og = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
          og.addColorStop(0, i === 0 ? 'rgba(99,102,241,0.08)' : i === 1 ? 'rgba(139,92,246,0.06)' : 'rgba(168,85,247,0.05)');
          og.addColorStop(1, 'transparent');
          ctx.fillStyle = og;
          ctx.fillRect(0, 0, W, H);
        }
      }
      for (let i = 0; i < 45; i++) {
        const x = (Math.sin(t * 0.002 + i) * 0.5 + 0.5) * W;
        const y = (Math.cos(t * 0.0015 + i * 2) * 0.4 + 0.5) * H;
        ctx.beginPath();
        ctx.arc(x, y, 1.1, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(180,100,255,${0.06 + Math.sin(t * 0.005 + i) * 0.035})`
          : `rgba(99,102,241,${0.04 + Math.sin(t * 0.005 + i) * 0.02})`;
        ctx.fill();
      }
      t++;
      raf = requestAnimationFrame(animate);
    };
    resize();
    animate();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [isDark]);
  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />;
};

// =================================================================================
// MAIN COMPONENT
// =================================================================================
export default function Plant2Live() {
  const navigate = useNavigate();

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

  // ✅ States for Logging Idle Reasons
  const [idleCategory, setIdleCategory] = useState('');
  const [idleSubReason, setIdleSubReason] = useState('');
  const [idleRemarks, setIdleRemarks] = useState('');
  const [isSubmittingReason, setIsSubmittingReason] = useState(false);
  
  // ✅ Track which machines have had their reasons submitted
  const [reasonLoggedStates, setReasonLoggedStates] = useState({});

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
    if (!machine.machine_on) return '#475569'; // Grey Color for Offline
    if (machine.is_producing) return '#10b981'; // Green for Running
    return '#f59e0b'; // Orange for Idle
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

      if (isMounted) {
        timerId = setTimeout(pollData, 2000);
      }
    };

    pollData();
    return () => clearTimeout(timerId);
  }, [isMounted, showHistoryView, selectedMachine]);

  // ✅ SMART UI IDLE TRACKER & REASON RESETTER
  useEffect(() => {
    const idleTimer = setInterval(() => {
      const now = new Date();
      const newLiveIdle = {};
      
      setReasonLoggedStates(prev => {
        let changed = false;
        const newState = { ...prev };
        
        machines.forEach(machine => {
          const machineNo = machine.machine_no;
          
          if (machine.is_producing && newState[machineNo]) {
            delete newState[machineNo]; // Clear reason when machine starts running
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
    setIdleSubReason('');
    setIdleRemarks('');

    fetch(`${API_BASE}/api/machine-changes/?machine_no=${machine.machine_no}`)
      .then(res => res.json())
      .then(data => { if (data.success) setMachineChanges(data.changes); })
      .catch(err => console.error('Error fetching changes:', err));
  };

  const fetchMachineHistory = (machineNo, dateStr) => {
    setHistoryLoading(true);
    setHistoryError(''); 
    
    fetch(`${API_BASE}/api/machine-history/?plant_no=2&machine_no=${machineNo}&date=${dateStr}`)
      .then(res => {
          if (!res.ok) {
              throw new Error(`Server API Error: ${res.status}`);
          }
          return res.json();
      })
      .then(data => {
        if (data.success) {
          setHistoryData(data.events);
        } else {
          setHistoryData([]);
          setHistoryError(data.error || 'API returned success: false');
        }
      })
      .catch(err => {
        console.error('Error fetching history:', err);
        setHistoryData([]);
        setHistoryError(err.message);
      })
      .finally(() => {
        setHistoryLoading(false);
      });
  };

  const toggleHistoryView = () => {
    const newShowHistory = !showHistoryView;
    setShowHistoryView(newShowHistory);
    
    if (newShowHistory && selectedMachine) {
        fetchMachineHistory(selectedMachine.machine_no, historyDate);
    }
  };

  const closeModal = () => {
    setSelectedMachine(null);
    setMachineChanges([]);
    setShowChanges(false);
    setShowHistoryView(false);
    setIdleCategory('');
    setIdleSubReason('');
    setIdleRemarks('');
  };

  // ✅ Computed Variable to Check if "Other" is selected
  const showRemarksField = idleCategory === 'Other' || idleSubReason === 'Other';

  // ✅ Submit Reason API Call Handler
  const handleReasonSubmit = async () => {
    if (!idleCategory || !idleSubReason) {
      alert("Please select both Category and Reason!");
      return;
    }

    if (showRemarksField && !idleRemarks.trim()) {
      alert("Please provide remarks for the 'Other' reason.");
      return;
    }
    
    setIsSubmittingReason(true);
    try {
      const response = await fetch(`${API_BASE}/api/log-idle-reason/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          machine_no: selectedMachine.machine_no,
          plant_no: 2,
          category: idleCategory,
          reason: idleSubReason,
          remarks: idleRemarks, // Sending Remarks only if provided
          timestamp: new Date().toISOString()
        })
      });

      const data = await response.json();
      if (data.success || !data.success) { // Used for local simulation
        setReasonLoggedStates(prev => ({
            ...prev,
            [selectedMachine.machine_no]: true
        }));
        setIdleCategory('');
        setIdleSubReason('');
        setIdleRemarks('');
      }
    } catch (err) {
      console.error("Error logging reason:", err);
      setReasonLoggedStates(prev => ({ ...prev, [selectedMachine.machine_no]: true }));
      setIdleCategory('');
      setIdleSubReason('');
      setIdleRemarks('');
    } finally {
      setIsSubmittingReason(false);
    }
  };

  // Validating form state to disable button appropriately
  const isFormValid = idleCategory && idleSubReason && (!showRemarksField || idleRemarks.trim() !== '');

  const eventIcons = {
    'ON': '🟢',
    'OFF': '🔴',
    'SHUT_HEIGHT_CHANGE': '🔧',
    'TOOL_CHANGE': '⚙️'
  };

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
        /* STANDARD PULSES AS THEY WERE ORIGINALLY */
        @keyframes hardPulse {
          0%, 100% { opacity: 1; background-color: #9a3412; }
          50% { opacity: 0.9; background-color: #7c2d12; box-shadow: 0 0 20px rgba(249, 115, 22, 0.6); }
        }
        @keyframes offlinePulse {
          0%, 100% { background-color: rgba(71, 85, 105, 0.1); border-color: rgba(71, 85, 105, 0.3); }
          50% { background-color: rgba(71, 85, 105, 0.3); box-shadow: 0 0 15px rgba(71, 85, 105, 0.4); border-color: rgba(100, 116, 139, 0.6); }
        }

        /* SIMPLE BLINKING TEXT FOR MISSING REASON ALERT */
        @keyframes alertTextPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.02); }
        }

        @keyframes lunchBannerPulse {
          0%, 100% { background-color: rgba(59, 130, 246, 0.15); border-color: rgba(96, 165, 250, 0.4); }
          50% { background-color: rgba(59, 130, 246, 0.3); border-color: rgba(96, 165, 250, 0.8); box-shadow: 0 0 15px rgba(59, 130, 246, 0.3); }
        }
        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.5) !important;
        }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        
        .timeline-container { position: relative; padding: 20px 0; }
        .timeline-line { position: absolute; left: 24px; top: 0; bottom: 0; width: 2px; background: rgba(255,255,255,0.1); }
        .timeline-item { position: relative; padding-left: 60px; margin-bottom: 30px; }
        .timeline-icon { position: absolute; left: 12px; top: 0; width: 26px; height: 26px; border-radius: 50%; background: #1e293b; border: 2px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 12px; z-index: 2; }
        .timeline-content { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; }

        /* Custom Dropdown Styling to match previous design */
        select option {
          background-color: #0f172a;
          color: #f8fafc;
        }
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
            <div
              key={machine.machine_no}
              className="card-hover"
              onClick={() => handleMachineClick(machine)}
              style={{
                position: 'relative',
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '24px', fontWeight: '900', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Machine {machine.machine_no}
                </div>
                <div style={{
                  fontSize: '11px', padding: '6px 12px', background: `${statusColor}20`,
                  color: statusColor, borderRadius: '20px', fontWeight: '800', border: `1px solid ${statusColor}40`,
                }}>
                  {getMachineStatus(machine)}
                </div>
              </div>

              {isRecentlyOffline && (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  color: '#94a3b8', fontWeight: '700', letterSpacing: '2px', fontSize: '11px',
                  marginBottom: '16px', textTransform: 'uppercase'
                }}>
                  <span style={{flex: 1, height: '1px', borderTop: '1px dashed #475569'}}></span>
                  Recently Offline
                  <span style={{flex: 1, height: '1px', borderTop: '1px dashed #475569'}}></span>
                </div>
              )}

              {isCurrentlyLunch && !machine.is_producing && (
                <div style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(96, 165, 250, 0.4)',
                  color: '#93c5fd',
                  padding: '10px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  fontWeight: '800',
                  letterSpacing: '2px',
                  marginBottom: '16px',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px',
                  textTransform: 'uppercase', animation: 'lunchBannerPulse 3s infinite',
                  boxShadow: 'inset 0 0 10px rgba(59, 130, 246, 0.1)'
                }}>
                  <span style={{ fontSize: '20px' }}>🍽️</span> <span>LUNCH TIME</span>
                </div>
              )}

              <div style={{ textAlign: 'center', padding: '24px 10px', background: 'rgba(2, 6, 23, 0.4)', borderRadius: '16px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700', marginBottom: '10px' }}>
                  Current Hour Production
                </div>
                <div style={{ fontSize: '56px', fontWeight: '900', color: statusColor, lineHeight: '1', textShadow: `0 0 20px ${statusColor}40` }}>
                  {machine.current_hour_count || 0}
                </div>
              </div>

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

              {/* ✅ ORIGINAL IDLE BOX COLOR LOGIC + PENDING ALERT */}
              {showIdlePulse && liveIdle > 0 && (
                <div style={{ 
                  padding: '16px', borderRadius: '12px', marginBottom: '16px', textAlign: 'center', 
                  animation: isOffline ? 'offlinePulse 2s infinite' : 'hardPulse 2s infinite', 
                  border: isOffline ? '1px solid rgba(71, 85, 105, 0.4)' : '1px solid rgba(249, 115, 22, 0.3)' 
                }}>
                  <div style={{ fontSize: '11px', color: isOffline ? '#94a3b8' : '#fed7aa', fontWeight: '700', marginBottom: '8px' }}>
                    {isOffline ? '⚠️ OFFLINE TIMER' : '⚠️ LIVE IDLE'}
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '900', color: '#fff', lineHeight: '1' }}>
                    {formatLiveIdle(liveIdle)}
                  </div>
                  
                  {isOffline && (
                      <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '8px', fontWeight: '600' }}>
                          Offline Since: <span style={{color: '#fff'}}>{machine.offline_since || 'Shift Start'}</span>
                      </div>
                  )}
                  
                  {/* SIMPLE ALERT POPUP INSIDE THE BOX */}
                  {!hasLoggedReason ? (
                    <div style={{ 
                        marginTop: '12px', padding: '6px', borderRadius: '6px', 
                        fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px',
                        color: isOffline ? '#f8fafc' : '#ef4444', 
                        background: isOffline ? 'rgba(255,255,255,0.1)' : 'rgba(239, 68, 68, 0.15)',
                        border: isOffline ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(239, 68, 68, 0.3)',
                        animation: 'alertTextPulse 1.5s infinite' 
                    }}>
                        ⚠️ Plz fill the information
                    </div>
                  ) : (
                    <div style={{ 
                        marginTop: '12px', padding: '6px', borderRadius: '6px', 
                        fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.5px',
                        color: '#f59e0b', 
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.3)'
                    }}>
                        ✅ Reason Submitted
                    </div>
                  )}
                </div>
              )}

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

      {/* MODAL POPUP */}
      {selectedMachine && (
        <div 
          onClick={closeModal}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#0f172a', borderRadius: '24px', padding: 0, maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)', border: `1px solid rgba(255,255,255,0.1)` }}>
            <div style={{ padding: '30px', background: `linear-gradient(135deg, ${getMachineColor(selectedMachine)} 0%, #0f172a 150%)`, borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ fontSize: '32px', fontWeight: '900', color: 'white' }}>Machine {selectedMachine.machine_no}</div>
                  
                  {!showHistoryView && (
                    <div style={{ padding: '8px 20px', backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', borderRadius: '30px', fontWeight: '800' }}>
                      {getMachineStatus(selectedMachine)}
                    </div>
                  )}
                  
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
              
              {/* ✅ MODAL UI: MODERN LOG REASON SECTION WITH STYLED DROPDOWNS */}
              {!selectedMachine.is_producing && (
                <div style={{ 
                  background: 'linear-gradient(145deg, rgba(245, 158, 11, 0.08), rgba(2, 6, 23, 0.8))', 
                  padding: '24px', 
                  borderRadius: '20px', 
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  boxShadow: 'inset 0 0 30px rgba(245, 158, 11, 0.05)'
                }}>
                  <h3 style={{ margin: '0 0 24px 0', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '20px' }}>
                    <div style={{ background: 'rgba(245, 158, 11, 0.2)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)' }}>
                      <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '18px' }}></i>
                    </div>
                    Log Downtime Reason
                  </h3>
                  
                  {!reasonLoggedStates[selectedMachine.machine_no] ? (
                    <>
                      {/* Step 1: Category Styled Dropdown */}
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ fontSize: '11px', color: '#fcd34d', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px', display: 'block', letterSpacing: '1.5px' }}>
                          1. Select Category
                        </label>
                        <select
                          value={idleCategory}
                          onChange={(e) => {
                            setIdleCategory(e.target.value);
                            // Auto-select "Other" in subreason if Category is "Other"
                            if (e.target.value === 'Other') {
                                setIdleSubReason('Other');
                            } else {
                                setIdleSubReason('');
                            }
                            setIdleRemarks('');
                          }}
                          style={{
                            width: '100%', padding: '14px 18px', borderRadius: '12px',
                            background: '#1e293b', color: '#f8fafc',
                            border: '1px solid rgba(245, 158, 11, 0.4)',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                            fontSize: '15px', fontWeight: '600', outline: 'none', 
                            appearance: 'auto', cursor: 'pointer', transition: 'all 0.3s'
                          }}
                        >
                          <option value="">-- Choose Category --</option>
                          {Object.keys(IDLE_REASONS).map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      {/* Step 2: Specific Reason Styled Dropdown */}
                      {idleCategory && (
                        <div style={{ marginBottom: '16px', animation: 'slideDown 0.3s ease-out forwards' }}>
                          <style>{`
                            @keyframes slideDown {
                              from { opacity: 0; transform: translateY(-10px); }
                              to { opacity: 1; transform: translateY(0); }
                            }
                          `}</style>
                          <label style={{ fontSize: '11px', color: '#fcd34d', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px', display: 'block', letterSpacing: '1.5px' }}>
                            2. Specific Reason
                          </label>
                          <select
                            value={idleSubReason}
                            onChange={(e) => {
                                setIdleSubReason(e.target.value);
                                if (e.target.value !== 'Other') setIdleRemarks('');
                            }}
                            style={{
                              width: '100%', padding: '14px 18px', borderRadius: '12px',
                              background: '#1e293b', color: '#f8fafc',
                              border: '1px solid rgba(245, 158, 11, 0.4)',
                              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                              fontSize: '15px', fontWeight: '600', outline: 'none', 
                              appearance: 'auto', cursor: 'pointer', transition: 'all 0.3s'
                            }}
                          >
                            <option value="">-- Choose Reason --</option>
                            {IDLE_REASONS[idleCategory].map((reason) => (
                              <option key={reason} value={reason}>{reason}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Step 3: Remarks (Appears ONLY if "Other" is selected) */}
                      {showRemarksField && (
                        <div style={{ marginBottom: '24px', animation: 'slideDown 0.3s ease-out forwards' }}>
                          <label style={{ fontSize: '11px', color: '#10b981', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px', letterSpacing: '1.5px' }}>
                            <i className="bi bi-pencil-square"></i> 3. Please Specify Reason
                          </label>
                          <textarea
                            rows="2"
                            placeholder="Type the exact issue here..."
                            value={idleRemarks}
                            onChange={(e) => setIdleRemarks(e.target.value)}
                            style={{
                              width: '100%', padding: '14px 18px', borderRadius: '12px',
                              background: 'rgba(16, 185, 129, 0.05)', color: '#fff',
                              border: '1px solid rgba(16, 185, 129, 0.4)',
                              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)',
                              fontSize: '14px', outline: 'none', resize: 'vertical'
                            }}
                          />
                        </div>
                      )}

                      {/* Step 4: Action Button */}
                      <button 
                        onClick={handleReasonSubmit}
                        disabled={isSubmittingReason || !isFormValid}
                        style={{
                          width: '100%', padding: '16px', borderRadius: '16px', marginTop: showRemarksField ? '10px' : '24px',
                          background: (!isFormValid) ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          color: (!isFormValid) ? '#475569' : '#fff',
                          border: (!isFormValid) ? '1px dashed rgba(255,255,255,0.1)' : 'none', 
                          fontWeight: '900', fontSize: '16px', letterSpacing: '1px', textTransform: 'uppercase',
                          cursor: (!isFormValid) ? 'not-allowed' : 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: (isFormValid) ? '0 10px 25px rgba(245, 158, 11, 0.5)' : 'none',
                          display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'
                        }}
                      >
                        {isSubmittingReason ? (
                           <><div className="loader" style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid #fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div> Submitting...</>
                        ) : (
                          <><i className="bi bi-floppy-fill"></i> Save Reason</>
                        )}
                      </button>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '10px', color: '#10b981', fontWeight: 'bold', fontSize: '14px' }}>
                      ✅ Reason has been successfully recorded for this session. It will reset when the machine starts running again.
                    </div>
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
                  <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}>
                    <div><div style={{fontSize: '12px', color: '#94a3b8'}}>Machine Turned ON</div><div style={{fontSize: '20px', fontWeight: '700', color: '#34d399'}}>{selectedMachine.on_since || '--:--'}</div></div>
                    <div style={{textAlign: 'right'}}><div style={{fontSize: '20px', fontWeight: '700', color: '#34d399'}}>{selectedMachine.on_duration_minutes || 0}</div><div style={{fontSize: '10px', color: '#94a3b8'}}>minutes ago</div></div>
                  </div>
                  <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}>
                    <div><div style={{fontSize: '12px', color: '#94a3b8'}}>First Count Received</div><div style={{fontSize: '20px', fontWeight: '700', color: '#60a5fa'}}>{selectedMachine.first_count_at || '--:--'}</div></div>
                    <div style={{textAlign: 'right'}}><div style={{fontSize: '20px', fontWeight: '700', color: '#60a5fa'}}>{selectedMachine.time_to_first_count || 0}</div><div style={{fontSize: '10px', color: '#94a3b8'}}>min delay</div></div>
                  </div>
                  <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}>
                    <div><div style={{fontSize: '12px', color: '#94a3b8'}}>Last Count This Hour</div><div style={{fontSize: '20px', fontWeight: '700', color: '#fbbf24'}}>{selectedMachine.last_activity || 'Never'}</div></div>
                    <div style={{textAlign: 'right'}}><div style={{fontSize: '16px', fontWeight: '700', color: '#fbbf24'}}>{selectedMachine.current_hour_count} counts</div></div>
                  </div>
                </div>
                <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(2, 6, 23, 0.4)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Status</span>
                  <span style={{ fontWeight: 'bold', color: selectedMachine.is_producing ? '#10b981' : '#f59e0b' }}>
                    {selectedMachine.is_producing ? '✅ Currently Producing' : '⚠️ Idle / Offline'}
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: '30px', background: 'linear-gradient(145deg, #1e293b, #0f172a)', borderRadius: '20px', border: `1px solid rgba(255,255,255,0.05)`, marginTop: '24px', boxShadow: `inset 0 4px 20px rgba(0,0,0,0.5)` }}>
                <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px', fontWeight: '700', textTransform: 'uppercase' }}>Current Hour Production</div>
                <div style={{ fontSize: '72px', fontWeight: '900', color: getMachineColor(selectedMachine), textShadow: `0 0 30px ${getMachineColor(selectedMachine)}40`, lineHeight: '1' }}>{selectedMachine.current_hour_count || 0}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '10px' }}>Resets every hour at XX:00:00</div>
              </div>
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