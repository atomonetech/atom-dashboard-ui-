// // DASHBOARD.JS - REAL DATA + MOCK FALLBACK (COMPLETE FIXED VERSION)
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Line, Bar, Doughnut } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// } from 'chart.js';
// import { motion } from 'motion/react';
// import { 
//   Factory, 
//   TrendingUp,
//   Activity,
//   Gauge,
//   Clock,
//   Calendar,
//   Sparkles,
//   RefreshCw,
//   Download,
//   Settings,
//   Radio,
//   Filter
// } from 'lucide-react';
// import Sidebar from './Sidebar';
// import { Button } from './ui/button';
// import { Card } from './ui/card';

// import { 
//   getDashboardData, 
//   getHourlyProductionData, 
//   getMachineProductionData, 
//   getProductionLineStatusData, 
//   getAvailableDates 
// } from '../services/apiService';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// const API_BASE = process.env.REACT_APP_API_URL || 'http://192.168.0.105:8000';

// // ✅ CUSTOM SEPARATOR
// const Separator = ({ orientation = "vertical", className = "" }) => {
//   return orientation === "vertical" ? (
//     <div className={`w-px bg-slate-700 ${className}`} />
//   ) : (
//     <div className={`h-px bg-slate-700 ${className}`} />
//   );
// };

// const Dashboard = ({ onLogout }) => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
  
//   // Dashboard data states
//   const [totalMachines, setTotalMachines] = useState(57);
//   const [runningMachines, setRunningMachines] = useState(0);
//   const [avgEfficiency, setAvgEfficiency] = useState(87);
//   const [totalProduction, setTotalProduction] = useState(15420);
  
//   // Header states
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [isRefreshing, setIsRefreshing] = useState(false);
  
//   // Filter states
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
//   const [selectedShift, setSelectedShift] = useState('');
//   const [selectedPlant, setSelectedPlant] = useState('plant1_data');
//   const [selectedHour, setSelectedHour] = useState('');
//   const [selectedMachine, setSelectedMachine] = useState('');
//   const [availableDates, setAvailableDates] = useState([]);
//   const [availableHours, setAvailableHours] = useState([]);
//   const [availableMachines, setAvailableMachines] = useState([]);
//   const [availableShifts, setAvailableShifts] = useState([
//     { value: '', label: 'All Shifts' },
//     { value: 'morning', label: 'Morning (6-14)' },
//     { value: 'afternoon', label: 'Afternoon (14-22)' },
//     { value: 'night', label: 'Night (22-6)' }
//   ]);
  
//   // Graph data states
//   const [hourlyProductionData, setHourlyProductionData] = useState({ labels: [], datasets: [] });
//   const [machineWiseData, setMachineWiseData] = useState({ labels: [], datasets: [] });
//   const [efficiencyData, setEfficiencyData] = useState({ labels: [], datasets: [] });

//   // Polling ref
//   const pollRef = useRef(null);

//   // ✅ REAL-TIME RUNNING MACHINES (Working)
//   const fetchRunningMachines = useCallback(async () => {
//     try {
//       const endpoint = selectedPlant === 'plant1_data' 
//         ? `${API_BASE}/api/plant1-live/` 
//         : `${API_BASE}/api/plant2-live/`;

//       const response = await fetch(endpoint, {
//         method: 'GET',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//           'Cache-Control': 'no-cache',
//           'ngrok-skip-browser-warning': 'true'
//         },
//         mode: 'cors',
//         credentials: 'include'
//       });

//       if (!response.ok) throw new Error(`HTTP ${response.status}`);

//       const data = await response.json();

//       if (data.success && Array.isArray(data.machines)) {
//         const runningCount = data.machines.filter(m => m.isproducing).length;
//         const totalCount = data.machines.length;
        
//         setRunningMachines(runningCount);
//         setTotalMachines(totalCount);
        
//         const efficiency = totalCount > 0 
//           ? Math.round((runningCount / totalCount) * 100) 
//           : 0;
//         setAvgEfficiency(efficiency);

//         console.log(`✅ Live Data - Plant ${selectedPlant === 'plant1_data' ? '1' : '2'}: ${runningCount}/${totalCount}`);
//       }
//     } catch (error) {
//       console.error('❌ Live data error:', error.message);
//     }
//   }, [selectedPlant]);

//   useEffect(() => {
//     fetchRunningMachines();
//     pollRef.current = setInterval(fetchRunningMachines, 2000);

//     return () => {
//       if (pollRef.current) {
//         clearInterval(pollRef.current);
//         pollRef.current = null;
//       }
//     };
//   }, [fetchRunningMachines]);

//   // Update current time
//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // Refresh handler
//   const handleRefresh = async () => {
//     setIsRefreshing(true);
//     await fetchRunningMachines();
//     setTimeout(() => setIsRefreshing(false), 1000);
//   };

//   // Generate available hours
//   useEffect(() => {
//     const hours = Array.from({length: 24}, (_, i) => ({
//       value: i.toString().padStart(2, '0'),
//       label: `${i.toString().padStart(2, '0')}:00`
//     }));
//     setAvailableHours(hours);
//   }, []);

//   // Generate machines based on plant
//   useEffect(() => {
//     const machines = selectedPlant === 'plant1_data' 
//       ? Array.from({length: 57}, (_, i) => ({
//           value: (i + 1).toString(),
//           label: `Machine ${(i + 1).toString().padStart(2, '0')}`
//         }))
//       : Array.from({length: 26}, (_, i) => ({
//           value: (i + 1).toString(),
//           label: `Machine ${(i + 1).toString().padStart(2, '0')}`
//         }));
//     setAvailableMachines(machines);
//   }, [selectedPlant]);

//   // Generate fallback dates
//   useEffect(() => {
//     const fallbackDates = [];
//     for (let i = 0; i < 30; i++) {
//       const date = new Date();
//       date.setDate(date.getDate() - i);
//       fallbackDates.push(date.toISOString().split('T')[0]);
//     }
//     setAvailableDates(fallbackDates);
//   }, []);

//   // ✅ MOCK DATA GENERATORS (FALLBACK)
//   const generateMockHourlyData = useCallback(() => {
//     const hours = Array.from({length: 24}, (_, i) => i);
//     const baseProduction = selectedPlant === 'plant1_data' ? 800 : 750;
    
//     const productionValues = hours.map(hour => {
//       let production = baseProduction;
//       if (hour >= 8 && hour <= 16) production += Math.random() * 300 + 200;
//       else if (hour >= 16 && hour <= 23) production += Math.random() * 200 + 100;
//       else production += Math.random() * 100 + 50;
//       return Math.floor(production);
//     });
    
//     setHourlyProductionData({
//       labels: hours.map(h => `${h.toString().padStart(2, '0')}:00`),
//       datasets: [{
//         label: selectedMachine ? `Machine ${selectedMachine}` : `${selectedPlant === 'plant1_data' ? 'Plant 1' : 'Plant 2'}`,
//         data: productionValues,
//         borderColor: '#06b6d4',
//         backgroundColor: 'rgba(6, 182, 212, 0.1)',
//         fill: true,
//         tension: 0.4,
//         pointRadius: 4,
//         pointHoverRadius: 6
//       }]
//     });
//   }, [selectedPlant, selectedMachine]);

//   const generateMockMachineData = useCallback(() => {
//     const machineCount = selectedPlant === 'plant1_data' ? 15 : 12;
//     const machineNames = Array.from({length: machineCount}, (_, i) => `M${(i+1).toString().padStart(2, '0')}`);
//     const machineProduction = machineNames.map(() => Math.floor(Math.random() * 800 + 200));
    
//     setMachineWiseData({
//       labels: machineNames,
//       datasets: [{
//         label: 'Production Count',
//         data: machineProduction,
//         backgroundColor: machineProduction.map(value => {
//           if (value > 700) return '#10b981';
//           if (value > 400) return '#f59e0b';
//           if (value > 200) return '#f97316';
//           return '#ef4444';
//         }),
//         borderRadius: 6,
//         borderWidth: 2
//       }]
//     });
//   }, [selectedPlant]);

//   const generateEfficiencyDataFromReal = useCallback((dashboardData) => {
//     const runningCount = dashboardData?.running_machines || runningMachines;
//     const totalCount = dashboardData?.total_machines || totalMachines;
//     const idleCount = Math.floor((totalCount - runningCount) * 0.6);
//     const maintenanceCount = Math.floor((totalCount - runningCount) * 0.2);
//     const offlineCount = Math.max(0, totalCount - runningCount - idleCount - maintenanceCount);
    
//     setEfficiencyData({
//       labels: ['Running', 'Idle', 'Maintenance', 'Offline'],
//       datasets: [{
//         data: [runningCount, idleCount, maintenanceCount, offlineCount],
//         backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#6b7280'],
//         borderWidth: 0
//       }]
//     });
//   }, [runningMachines, totalMachines]);

//   // ✅ MAIN DATA FETCH - REAL API FIRST, MOCK FALLBACK
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         console.log('🔄 Fetching REAL data:', {selectedDate, selectedPlant, selectedShift});
//         setLoading(true);
        
//         // ✅ REAL API CALL
//         const data = await getDashboardData({
//           date: selectedDate,
//           plant: selectedPlant,
//           shift: selectedShift,
//           hour: selectedHour,
//           machine: selectedMachine
//         });
        
//         console.log('📊 API Response:', data);
        
//         if (data?.success && data.dashboard_data) {
//           const dashboardData = data.dashboard_data;
          
//           // ✅ REAL PRODUCTION DATA
//           setTotalProduction(dashboardData.total_production || 0);
          
//           // ✅ REAL CHARTS
//           generateEfficiencyDataFromReal(dashboardData);
          
//           // ✅ Hourly from API if available
//           if (dashboardData.hourly_production?.data) {
//             setHourlyProductionData({
//               labels: dashboardData.hourly_production.labels || Array(24).fill(''),
//               datasets: [{
//                 label: 'Real Production',
//                 data: dashboardData.hourly_production.data,
//                 borderColor: '#06b6d4',
//                 backgroundColor: 'rgba(6, 182, 212, 0.1)',
//                 fill: true,
//                 tension: 0.4
//               }]
//             });
//           } else {
//             generateMockHourlyData();
//           }
          
//           // ✅ Machine data from API if available
//           if (dashboardData.machine_production?.data) {
//             setMachineWiseData(dashboardData.machine_production);
//           } else {
//             generateMockMachineData();
//           }
          
//           console.log('✅ REAL DATA LOADED!');
//           setLoading(false);
//           return;
//         }
//       } catch (error) {
//         console.error('❌ API Error - Using Mock:', error);
//       }
      
//       // ✅ MOCK FALLBACK
//       console.log('🔄 Mock Data');
//       setTotalProduction(15420);
//       generateMockHourlyData();
//       generateMockMachineData();
//       generateEfficiencyDataFromReal({});
//       setLoading(false);
//     };
    
//     fetchDashboardData();
//   }, [selectedDate, selectedShift, selectedPlant, selectedHour, selectedMachine, runningMachines, totalMachines]);

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'top',
//         labels: {
//           color: '#94a3b8',
//           font: { size: 12 },
//           padding: 15,
//           usePointStyle: true
//         }
//       }
//     },
//     scales: {
//       x: { ticks: { color: '#94a3b8', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.08)' } },
//       y: { ticks: { color: '#94a3b8', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.08)' } }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0f172a] flex relative overflow-hidden">
//       {/* Animated Background */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         {[...Array(15)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute rounded-full"
//             style={{
//               width: Math.random() * 200 + 50,
//               height: Math.random() * 200 + 50,
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               background: i % 2 === 0 
//                 ? 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)'
//                 : 'radial-gradient(circle, rgba(251, 191, 36, 0.08) 0%, transparent 70%)',
//             }}
//             animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
//             transition={{ duration: Math.random() * 15 + 10, repeat: Infinity, ease: "easeInOut" }}
//           />
//         ))}
//       </div>

//       <Sidebar />

//       <div className="flex-1 overflow-auto relative z-10">
//         <div className="max-w-[1600px] mx-auto px-8 py-8">
//           {/* HEADER */}
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
//             <div>
//               <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4 mb-2">
//                 <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
//                   <Sparkles className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-white to-yellow-400 bg-clip-text text-transparent relative inline-block">
//                     AtomOne Analytics Hub
//                     <motion.div className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-cyan-500 to-yellow-500 rounded-full" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.3, duration: 0.8 }} />
//                   </h1>
//                   <p className="text-slate-400 text-sm mt-1">Next-Generation Industrial Intelligence Platform</p>
//                 </div>
//               </motion.div>
              
//               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-wrap items-center gap-3 text-slate-400 text-sm">
//                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
//                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
//                   <span className="text-green-400 font-semibold">Live</span>
//                 </div>
//                 <Separator orientation="vertical" className="h-6" />
//                 <div className="flex items-center gap-2">
//                   <Clock className="w-4 h-4" />
//                   <span className="font-mono text-cyan-400">{currentTime.toLocaleTimeString()}</span>
//                 </div>
//                 <Separator orientation="vertical" className="h-6" />
//                 <div className="flex items-center gap-2">
//                   <Calendar className="w-4 h-4" />
//                   <span>{currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
//                 </div>
//                 <Separator orientation="vertical" className="h-6" />
//                 <div className="flex items-center gap-2">
//                   <Radio className="w-4 h-4 text-cyan-400" />
//                   <span className="text-cyan-400 font-semibold">{selectedPlant === 'plant1_data' ? 'Plant 1' : 'Plant 2'}</span>
//                 </div>
//               </motion.div>
//             </div>

//             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-wrap items-center gap-2">
//               <Button onClick={handleRefresh} size="sm" className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white border-0 shadow-lg shadow-cyan-500/30">
//                 <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
//                 Refresh
//               </Button>
//               <Button size="sm" className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 border-0 shadow-lg shadow-yellow-500/30">
//                 <Download className="w-4 h-4 mr-2" />
//                 Export
//               </Button>
//               <Button size="sm" className="bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700">
//                 <Settings className="w-4 h-4 mr-2" />
//                 Settings
//               </Button>
//             </motion.div>
//           </div>

//           {/* FILTERS */}
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
//             <Card className="backdrop-blur-xl bg-gradient-to-br from-[#1e293b]/80 to-[#1e293b]/60 border-cyan-500/30 p-6">
//               <div className="flex items-center gap-2 mb-4">
//                 {/* <Filter className="w-5 h-5 text-cyan-400" /> */}
//                 <h3 className="text-cyan-400 font-semibold">Data Filters</h3>
//                 <div className="ml-auto px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full border border-cyan-500/30">
//                   {loading ? 'Loading...' : 'Live'}
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//                 <div>
//                   <label className="text-slate-300 text-sm block mb-2">Plant</label>
//                   <select value={selectedPlant} onChange={(e) => setSelectedPlant(e.target.value)} className="w-full bg-[#0f172a]/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all">
//                     <option value="plant1_data">Plant 1 (57 Machines)</option>
//                     <option value="plant2_data">Plant 2 (26 Machines)</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="text-slate-300 text-sm block mb-2">Date</label>
//                   <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full bg-[#0f172a]/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all">
//                     {availableDates.slice(0, 30).map(date => (
//                       <option key={date} value={date}>
//                         {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="text-slate-300 text-sm block mb-2">Shift</label>
//                   <select value={selectedShift} onChange={(e) => setSelectedShift(e.target.value)} className="w-full bg-[#0f172a]/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all">
//                     {availableShifts.map(shift => (
//                       <option key={shift.value} value={shift.value}>{shift.label}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="text-slate-300 text-sm block mb-2">Hour</label>
//                   <select value={selectedHour} onChange={(e) => setSelectedHour(e.target.value)} className="w-full bg-[#0f172a]/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all">
//                     <option value="">All Hours</option>
//                     {availableHours.slice(0, 24).map(hour => (
//                       <option key={hour.value} value={hour.value}>{hour.label}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="text-slate-300 text-sm block mb-2">Machine</label>
//                   <select value={selectedMachine} onChange={(e) => setSelectedMachine(e.target.value)} className="w-full bg-[#0f172a]/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all">
//                     <option value="">All Machines</option>
//                     {availableMachines.slice(0, 20).map(machine => (
//                       <option key={machine.value} value={machine.value}>{machine.label}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </Card>
//           </motion.div>

//           {/* KEY METRICS */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
//               <Card className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 to-[#1e293b]/60 border-cyan-500/30 p-6 hover:border-cyan-500/50 transition-all">
//                 <div className="flex items-start justify-between mb-4">
//                   <div>
//                     <p className="text-slate-400 text-sm mb-1">Total Machines</p>
//                     <motion.span className="text-3xl font-bold text-cyan-400" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
//                       {totalMachines}
//                     </motion.span>
//                   </div>
//                   <motion.div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center relative" whileHover={{ scale: 1.1, rotate: 5 }}>
//                     <div className="absolute inset-0 bg-cyan-500 rounded-xl blur-md opacity-30" />
//                     <Factory className="w-6 h-6 text-cyan-400 relative z-10" />
//                   </motion.div>
//                 </div>
//                 <p className="text-slate-500 text-sm">Manufacturing Units</p>
//               </Card>
//             </motion.div>

//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
//               <Card className="backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-[#1e293b]/60 border-green-500/30 p-6 hover:border-green-500/50 transition-all">
//                 <div className="flex items-start justify-between mb-4">
//                   <div>
//                     <p className="text-slate-400 text-sm mb-1 flex items-center gap-2">
//                       Running Machines
//                       <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//                     </p>
//                     <motion.span className="text-3xl font-bold text-green-400" key={runningMachines} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }}>
//                       {runningMachines}
//                     </motion.span>
//                   </div>
//                   <motion.div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center relative" whileHover={{ scale: 1.1, rotate: -5 }}>
//                     <div className="absolute inset-0 bg-green-500 rounded-xl blur-md opacity-30" />
//                     <Activity className="w-6 h-6 text-green-400 relative z-10" />
//                   </motion.div>
//                 </div>
//                 <div className="h-2 bg-[#0f172a]/50 rounded-full overflow-hidden">
//                   <motion.div className="h-full bg-gradient-to-r from-green-500 to-green-400" initial={{ width: 0 }} animate={{ width: `${Math.max(0, (runningMachines / Math.max(1, totalMachines)) * 100)}%` }} transition={{ duration: 0.5 }} />
//                 </div>
//               </Card>
//             </motion.div>

//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
//               <Card className="backdrop-blur-xl bg-gradient-to-br from-yellow-500/10 to-[#1e293b]/60 border-yellow-500/30 p-6 hover:border-yellow-500/50 transition-all">
//                 <div className="flex items-start justify-between mb-4">
//                   <div>
//                     <p className="text-slate-400 text-sm mb-1">Efficiency</p>
//                     <motion.span className="text-3xl font-bold text-yellow-400" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, type: "spring" }}>
//                       {avgEfficiency}%
//                     </motion.span>
//                   </div>
//                   <motion.div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center relative" whileHover={{ scale: 1.1, rotate: 360 }} transition={{ type: "spring" }}>
//                     <div className="absolute inset-0 bg-yellow-500 rounded-xl blur-md opacity-30" />
//                     <Gauge className="w-6 h-6 text-yellow-400 relative z-10" />
//                   </motion.div>
//                 </div>
//                 <p className="text-slate-500 text-sm">Overall Performance</p>
//               </Card>
//             </motion.div>

//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
//               <Card className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 to-[#1e293b]/60 border-cyan-500/30 p-6 hover:border-cyan-500/50 transition-all">
//                 <div className="flex items-start justify-between mb-4">
//                   <div>
//                     <p className="text-slate-400 text-sm mb-1">Production</p>
//                     <motion.span className="text-3xl font-bold text-cyan-400" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: "spring" }}>
//                       {totalProduction.toLocaleString()}
//                     </motion.span>
//                   </div>
//                   <motion.div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center relative" whileHover={{ scale: 1.1 }}>
//                     <div className="absolute inset-0 bg-cyan-500 rounded-xl blur-md opacity-30" />
//                     <TrendingUp className="w-6 h-6 text-cyan-400 relative z-10" />
//                   </motion.div>
//                 </div>
//                 <p className="text-slate-500 text-sm">Units Produced</p>
//               </Card>
//             </motion.div>
//           </div>

//           {/* CHARTS */}
//           <div className="grid lg:grid-cols-2 gap-6">
//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
//               <Card className="backdrop-blur-xl bg-gradient-to-br from-[#1e293b]/80 to-[#1e293b]/60 border-cyan-500/30 p-6">
//                 <h3 className="text-cyan-400 mb-6 font-semibold flex items-center gap-2">
//                   <span>📈</span>
//                   Hourly Production
//                 </h3>
//                 <div style={{ height: '300px' }}>
//                   {hourlyProductionData.labels.length > 0 ? (
//                     <Line data={hourlyProductionData} options={chartOptions} />
//                   ) : (
//                     <div className="flex items-center justify-center h-full text-slate-500">
//                       Loading chart data...
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             </motion.div>

//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
//               <Card className="backdrop-blur-xl bg-gradient-to-br from-[#1e293b]/80 to-[#1e293b]/60 border-yellow-500/30 p-6">
//                 <h3 className="text-yellow-400 mb-6 font-semibold flex items-center gap-2">
//                   <span>📊</span>
//                   Machine Status
//                 </h3>
//                 <div style={{ height: '300px' }}>
//                   {efficiencyData.labels?.length > 0 ? (
//                     <Doughnut 
//                       data={efficiencyData} 
//                       options={{ 
//                         ...chartOptions, 
//                         plugins: { 
//                           ...chartOptions.plugins, 
//                           legend: { ...chartOptions.plugins.legend, position: 'bottom' } 
//                         } 
//                       }} 
//                     />
//                   ) : (
//                     <div className="flex items-center justify-center h-full text-slate-500">
//                       Loading chart data...
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             </motion.div>

//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="lg:col-span-2">
//               <Card className="backdrop-blur-xl bg-gradient-to-br from-[#1e293b]/80 to-[#1e293b]/60 border-cyan-500/30 p-6">
//                 <h3 className="text-cyan-400 mb-6 font-semibold flex items-center gap-2">
//                   <span>📊</span>
//                   Machine-wise Production
//                 </h3>
//                 <div style={{ height: '300px' }}>
//                   {machineWiseData.labels.length > 0 ? (
//                     <Bar data={machineWiseData} options={chartOptions} />
//                   ) : (
//                     <div className="flex items-center justify-center h-full text-slate-500">
//                       Loading chart data...
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



// // DASHBOARD.JS - REAL DATA + HOURLY AUTO-REFRESH + MOCK FALLBACK (COMPLETE FIXED VERSION)
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Line, Bar, Doughnut } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// } from 'chart.js';
// import { motion } from 'motion/react';
// import { 
//   Factory, 
//   TrendingUp,
//   Activity,
//   Gauge,
//   Clock,
//   Calendar,
//   Sparkles,
//   RefreshCw,
//   Download,
//   Settings,
//   Radio,
//   Filter
// } from 'lucide-react';
// import Sidebar from './Sidebar';
// import { Button } from './ui/button';
// import { Card } from './ui/card';

// import { 
//   getDashboardData, 
//   getHourlyProductionData, 
//   getMachineProductionData, 
//   getProductionLineStatusData, 
//   getAvailableDates 
// } from '../services/apiService';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// const API_BASE = process.env.REACT_APP_API_URL || 'http://192.168.0.105:8000';

// // ✅ CUSTOM SEPARATOR
// const Separator = ({ orientation = "vertical", className = "" }) => {
//   return orientation === "vertical" ? (
//     <div className={`w-px bg-slate-700 ${className}`} />
//   ) : (
//     <div className={`h-px bg-slate-700 ${className}`} />
//   );
// };

// const Dashboard = ({ onLogout }) => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
  
//   // Dashboard data states
//   const [totalMachines, setTotalMachines] = useState(57);
//   const [runningMachines, setRunningMachines] = useState(0);
//   const [avgEfficiency, setAvgEfficiency] = useState(87);
//   const [totalProduction, setTotalProduction] = useState(15420);
  
//   // Header states
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [nextRefresh, setNextRefresh] = useState('');
  
//   // Filter states
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
//   const [selectedShift, setSelectedShift] = useState('');
//   const [selectedPlant, setSelectedPlant] = useState('plant1_data');
//   const [selectedHour, setSelectedHour] = useState('');
//   const [selectedMachine, setSelectedMachine] = useState('');
//   const [availableDates, setAvailableDates] = useState([]);
//   const [availableHours, setAvailableHours] = useState([]);
//   const [availableMachines, setAvailableMachines] = useState([]);
//   const [availableShifts, setAvailableShifts] = useState([
//     { value: '', label: 'All Shifts' },
//     { value: 'morning', label: 'Morning (8:30AM - 8PM)' },
//     { value: 'night', label: 'Night (8:30PM - 8AM)' }
//   ]);
  
//   // Graph data states
//   const [hourlyProductionData, setHourlyProductionData] = useState({ labels: [], datasets: [] });
//   const [machineWiseData, setMachineWiseData] = useState({ labels: [], datasets: [] });
//   const [efficiencyData, setEfficiencyData] = useState({ labels: [], datasets: [] });

//   // Polling refs
//   const pollRef = useRef(null);
//   const hourlyPollRef = useRef(null);
//   const refreshTimerRef = useRef(null);

//   // ✅ EVERY HOUR AUTO-REFRESH COUNTDOWN
//   const updateRefreshCountdown = useCallback(() => {
//     const now = new Date();
//     const nextHour = new Date(now.getTime());
//     nextHour.setMinutes(59, 59, 999); // Just before next hour
    
//     const timeDiff = nextHour.getTime() - now.getTime();
//     const hours = Math.floor(timeDiff / (1000 * 60 * 60));
//     const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
//     const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
//     setNextRefresh(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
//   }, []);

//   useEffect(() => {
//     updateRefreshCountdown();
//     const interval = setInterval(updateRefreshCountdown, 1000);
    
//     return () => clearInterval(interval);
//   }, [updateRefreshCountdown]);

//   // ✅ REAL-TIME RUNNING MACHINES (2 SEC POLL)
//   const fetchRunningMachines = useCallback(async () => {
//     try {
//       const endpoint = selectedPlant === 'plant1_data' 
//         ? `${API_BASE}/api/plant1-live/` 
//         : `${API_BASE}/api/plant2-live/`;

//       const response = await fetch(endpoint, {
//         method: 'GET',
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json',
//           'Cache-Control': 'no-cache',
//           'ngrok-skip-browser-warning': 'true'
//         },
//         mode: 'cors',
//         credentials: 'include'
//       });

//       if (!response.ok) throw new Error(`HTTP ${response.status}`);

//       const data = await response.json();

//       if (data.success && Array.isArray(data.machines)) {
//         const runningCount = data.machines.filter(m => m.isproducing).length;
//         const totalCount = data.machines.length;
        
//         setRunningMachines(runningCount);
//         setTotalMachines(totalCount);
        
//         const efficiency = totalCount > 0 
//           ? Math.round((runningCount / totalCount) * 100) 
//           : 0;
//         setAvgEfficiency(efficiency);

//         console.log(`✅ Live Data - Plant ${selectedPlant === 'plant1_data' ? '1' : '2'}: ${runningCount}/${totalCount}`);
//       }
//     } catch (error) {
//       console.error('❌ Live data error:', error.message);
//     }
//   }, [selectedPlant]);

//   // ✅ HOURLY DATA REFRESH (60 MIN POLL)
//   const fetchHourlyDashboardData = useCallback(async () => {
//     try {
//       console.log('🔄 Hourly Auto-Refresh - Fetching Dashboard Data');
      
//       const data = await getDashboardData({
//         date: selectedDate,
//         plant: selectedPlant,
//         shift: selectedShift,
//         hour: selectedHour,
//         machine: selectedMachine
//       });
      
//       if (data?.success && data.dashboard_data) {
//         const dashboardData = data.dashboard_data;
        
//         setTotalProduction(dashboardData.total_production || 0);
        
//         // Update efficiency from real data
//         const runningCount = dashboardData?.running_machines || runningMachines;
//         const totalCount = dashboardData?.total_machines || totalMachines;
//         const idleCount = Math.floor((totalCount - runningCount) * 0.6);
//         const maintenanceCount = Math.floor((totalCount - runningCount) * 0.2);
//         const offlineCount = Math.max(0, totalCount - runningCount - idleCount - maintenanceCount);
        
//         setEfficiencyData({
//           labels: ['Running', 'Idle', 'Maintenance', 'Offline'],
//           datasets: [{
//             data: [runningCount, idleCount, maintenanceCount, offlineCount],
//             backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#6b7280'],
//             borderWidth: 0
//           }]
//         });
        
//         console.log('✅ Hourly Refresh Complete!');
//         return true;
//       }
//     } catch (error) {
//       console.error('❌ Hourly refresh error:', error);
//     }
//     return false;
//   }, [selectedDate, selectedPlant, selectedShift, selectedHour, selectedMachine, runningMachines, totalMachines]);

//   // ✅ START ALL POLLING INTERVALS
//   useEffect(() => {
//     // Live machines - every 2 seconds
//     fetchRunningMachines();
//     pollRef.current = setInterval(fetchRunningMachines, 2000);

//     // Hourly dashboard refresh - every 60 minutes (sync with hour change)
//     const now = new Date();
//     const msUntilNextHour = ((60 - now.getMinutes()) * 60 * 1000) - (now.getSeconds() * 1000) - now.getMilliseconds();
    
//     const hourlyTimer = setTimeout(async () => {
//       await fetchHourlyDashboardData();
//       hourlyPollRef.current = setInterval(async () => {
//         await fetchHourlyDashboardData();
//       }, 60 * 60 * 1000); // Every hour after first trigger
//     }, msUntilNextHour);

//     // Update time display
//     const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);

//     return () => {
//       if (pollRef.current) clearInterval(pollRef.current);
//       if (hourlyPollRef.current) clearInterval(hourlyPollRef.current);
//       if (hourlyTimer) clearTimeout(hourlyTimer);
//       if (timeInterval) clearInterval(timeInterval);
//       if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
//     };
//   }, [fetchRunningMachines, fetchHourlyDashboardData]);

//   // Update current time
//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // Manual refresh handler
//   const handleRefresh = async () => {
//     setIsRefreshing(true);
    
//     await Promise.all([
//       fetchRunningMachines(),
//       fetchHourlyDashboardData()
//     ]);
    
//     setTimeout(() => setIsRefreshing(false), 1500);
//   };

//   // Generate available hours
//   useEffect(() => {
//     const hours = Array.from({length: 24}, (_, i) => ({
//       value: i.toString().padStart(2, '0'),
//       label: `${i.toString().padStart(2, '0')}:00`
//     }));
//     setAvailableHours(hours);
//   }, []);

//   // Generate machines based on plant
//   useEffect(() => {
//     const machines = selectedPlant === 'plant1_data' 
//       ? Array.from({length: 57}, (_, i) => ({
//           value: (i + 1).toString(),
//           label: `Machine ${(i + 1).toString().padStart(2, '0')}`
//         }))
//       : Array.from({length: 26}, (_, i) => ({
//           value: (i + 1).toString(),
//           label: `Machine ${(i + 1).toString().padStart(2, '0')}`
//         }));
//     setAvailableMachines(machines);
//   }, [selectedPlant]);

//   // Generate fallback dates
//   useEffect(() => {
//     const fallbackDates = [];
//     for (let i = 0; i < 30; i++) {
//       const date = new Date();
//       date.setDate(date.getDate() - i);
//       fallbackDates.push(date.toISOString().split('T')[0]);
//     }
//     setAvailableDates(fallbackDates);
//   }, []);

//   // ✅ MOCK DATA GENERATORS (FALLBACK)
//   const generateMockHourlyData = useCallback(() => {
//     const hours = Array.from({length: 24}, (_, i) => i);
//     const baseProduction = selectedPlant === 'plant1_data' ? 800 : 750;
    
//     const productionValues = hours.map(hour => {
//       let production = baseProduction;
//       if (hour >= 8 && hour <= 16) production += Math.random() * 300 + 200;
//       else if (hour >= 16 && hour <= 23) production += Math.random() * 200 + 100;
//       else production += Math.random() * 100 + 50;
//       return Math.floor(production);
//     });
    
//     setHourlyProductionData({
//       labels: hours.map(h => `${h.toString().padStart(2, '0')}:00`),
//       datasets: [{
//         label: selectedMachine ? `Machine ${selectedMachine}` : `${selectedPlant === 'plant1_data' ? 'Plant 1' : 'Plant 2'}`,
//         data: productionValues,
//         borderColor: '#06b6d4',
//         backgroundColor: 'rgba(6, 182, 212, 0.1)',
//         fill: true,
//         tension: 0.4,
//         pointRadius: 4,
//         pointHoverRadius: 6
//       }]
//     });
//   }, [selectedPlant, selectedMachine]);

//   const generateMockMachineData = useCallback(() => {
//     const machineCount = selectedPlant === 'plant1_data' ? 15 : 12;
//     const machineNames = Array.from({length: machineCount}, (_, i) => `M${(i+1).toString().padStart(2, '0')}`);
//     const machineProduction = machineNames.map(() => Math.floor(Math.random() * 800 + 200));
    
//     setMachineWiseData({
//       labels: machineNames,
//       datasets: [{
//         label: 'Production Count',
//         data: machineProduction,
//         backgroundColor: machineProduction.map(value => {
//           if (value > 700) return '#10b981';
//           if (value > 400) return '#f59e0b';
//           if (value > 200) return '#f97316';
//           return '#ef4444';
//         }),
//         borderRadius: 6,
//         borderWidth: 2
//       }]
//     });
//   }, [selectedPlant]);

//   const generateEfficiencyDataFromReal = useCallback((dashboardData) => {
//     const runningCount = dashboardData?.running_machines || runningMachines;
//     const totalCount = dashboardData?.total_machines || totalMachines;
//     const idleCount = Math.floor((totalCount - runningCount) * 0.6);
//     const maintenanceCount = Math.floor((totalCount - runningCount) * 0.2);
//     const offlineCount = Math.max(0, totalCount - runningCount - idleCount - maintenanceCount);
    
//     setEfficiencyData({
//       labels: ['Running', 'Idle', 'Maintenance', 'Offline'],
//       datasets: [{
//         data: [runningCount, idleCount, maintenanceCount, offlineCount],
//         backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#6b7280'],
//         borderWidth: 0
//       }]
//     });
//   }, [runningMachines, totalMachines]);

//   // ✅ MAIN DATA FETCH ON FILTER CHANGE (IMMEDIATE)
//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         console.log('🔄 Filter Change - Fetching data:', {selectedDate, selectedPlant, selectedShift});
//         setLoading(true);
        
//         const data = await getDashboardData({
//           date: selectedDate,
//           plant: selectedPlant,
//           shift: selectedShift,
//           hour: selectedHour,
//           machine: selectedMachine
//         });
        
//         if (data?.success && data.dashboard_data) {
//           const dashboardData = data.dashboard_data;
          
//           setTotalProduction(dashboardData.total_production || 0);
          
//           if (dashboardData.hourly_production?.data) {
//             setHourlyProductionData({
//               labels: dashboardData.hourly_production.labels || Array(24).fill(''),
//               datasets: [{
//                 label: 'Real Production',
//                 data: dashboardData.hourly_production.data,
//                 borderColor: '#06b6d4',
//                 backgroundColor: 'rgba(6, 182, 212, 0.1)',
//                 fill: true,
//                 tension: 0.4
//               }]
//             });
//           } else {
//             generateMockHourlyData();
//           }
          
//           if (dashboardData.machine_production?.data) {
//             setMachineWiseData(dashboardData.machine_production);
//           } else {
//             generateMockMachineData();
//           }
          
//           generateEfficiencyDataFromReal(dashboardData);
//           console.log('✅ Filter data loaded!');
//         } else {
//           // Mock fallback
//           setTotalProduction(15420);
//           generateMockHourlyData();
//           generateMockMachineData();
//           generateEfficiencyDataFromReal({});
//         }
//       } catch (error) {
//         console.error('❌ API Error - Using Mock:', error);
//         setTotalProduction(15420);
//         generateMockHourlyData();
//         generateMockMachineData();
//         generateEfficiencyDataFromReal({});
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchDashboardData();
//   }, [selectedDate, selectedShift, selectedPlant, selectedHour, selectedMachine]);

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'top',
//         labels: {
//           color: '#94a3b8',
//           font: { size: 12 },
//           padding: 15,
//           usePointStyle: true
//         }
//       }
//     },
//     scales: {
//       x: { ticks: { color: '#94a3b8', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.08)' } },
//       y: { ticks: { color: '#94a3b8', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.08)' } }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0f172a] flex relative overflow-hidden">
//       {/* Animated Background */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         {[...Array(15)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute rounded-full"
//             style={{
//               width: Math.random() * 200 + 50,
//               height: Math.random() * 200 + 50,
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               background: i % 2 === 0 
//                 ? 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)'
//                 : 'radial-gradient(circle, rgba(251, 191, 36, 0.08) 0%, transparent 70%)',
//             }}
//             animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
//             transition={{ duration: Math.random() * 15 + 10, repeat: Infinity, ease: "easeInOut" }}
//           />
//         ))}
//       </div>

//       <Sidebar />

//       <div className="flex-1 overflow-auto relative z-10">
//         <div className="max-w-[1600px] mx-auto px-8 py-8">
//           {/* HEADER */}
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
//             <div>
//               <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4 mb-2">
//                 <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
//                   <Sparkles className="w-6 h-6 text-white" />
//                 </div>
//                 <div>
//                   <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-white to-yellow-400 bg-clip-text text-transparent relative inline-block">
//                     AtomOne Analytics Hub
//                     <motion.div className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-cyan-500 to-yellow-500 rounded-full" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.3, duration: 0.8 }} />
//                   </h1>
//                   <p className="text-slate-400 text-sm mt-1">Next-Generation Industrial Intelligence Platform</p>
//                 </div>
//               </motion.div>
              
//               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-wrap items-center gap-3 text-slate-400 text-sm">
//                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
//                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
//                   <span className="text-green-400 font-semibold">Live</span>
//                 </div>
//                 <Separator orientation="vertical" className="h-6" />
//                 <div className="flex items-center gap-2">
//                   <Clock className="w-4 h-4" />
//                   <span className="font-mono text-cyan-400">{currentTime.toLocaleTimeString()}</span>
//                 </div>
//                 <Separator orientation="vertical" className="h-6" />
//                 <div className="flex items-center gap-2">
//                   <Calendar className="w-4 h-4" />
//                   <span>{currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
//                 </div>
//                 <Separator orientation="vertical" className="h-6" />
//                 <div className="flex items-center gap-2">
//                   <Radio className="w-4 h-4 text-cyan-400" />
//                   <span className="text-cyan-400 font-semibold">{selectedPlant === 'plant1_data' ? 'Plant 1' : 'Plant 2'}</span>
//                 </div>
//                 {/* ✅ HOURLY REFRESH COUNTDOWN */}
//                 <Separator orientation="vertical" className="h-6" />
//                 <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full">
//                   <RefreshCw className="w-4 h-4 text-yellow-400 animate-spin-slow" />
//                   <span className="text-yellow-400 text-xs font-mono">Next: {nextRefresh}</span>
//                 </div>
//               </motion.div>
//             </div>

//             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-wrap items-center gap-2">
//               <Button onClick={handleRefresh} size="sm" className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white border-0 shadow-lg shadow-cyan-500/30">
//                 <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
//                 {isRefreshing ? 'Refreshing...' : 'Refresh Now'}
//               </Button>
//               <Button size="sm" className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 border-0 shadow-lg shadow-yellow-500/30">
//                 <Download className="w-4 h-4 mr-2" />
//                 Export
//               </Button>
//               <Button size="sm" className="bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700">
//                 <Settings className="w-4 h-4 mr-2" />
//                 Settings
//               </Button>
//             </motion.div>
//           </div>

//           {/* FILTERS */}
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
//             <Card className="backdrop-blur-xl bg-gradient-to-br from-[#1e293b]/80 to-[#1e293b]/60 border-cyan-500/30 p-6">
//               <div className="flex items-center gap-2 mb-4">
//                 <h3 className="text-cyan-400 font-semibold">Data Filters</h3>
//                 <div className="ml-auto px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full border border-cyan-500/30">
//                   {loading ? 'Loading...' : 'Live + Auto'}
//                 </div>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//                 <div>
//                   <label className="text-slate-300 text-sm block mb-2">Plant</label>
//                   <select value={selectedPlant} onChange={(e) => setSelectedPlant(e.target.value)} className="w-full bg-[#0f172a]/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all">
//                     <option value="plant1_data">Plant 1 (57 Machines)</option>
//                     <option value="plant2_data">Plant 2 (26 Machines)</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="text-slate-300 text-sm block mb-2">Date</label>
//                   <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full bg-[#0f172a]/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all">
//                     {availableDates.slice(0, 30).map(date => (
//                       <option key={date} value={date}>
//                         {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="text-slate-300 text-sm block mb-2">Shift</label>
//                   <select value={selectedShift} onChange={(e) => setSelectedShift(e.target.value)} className="w-full bg-[#0f172a]/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all">
//                     {availableShifts.map(shift => (
//                       <option key={shift.value} value={shift.value}>{shift.label}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="text-slate-300 text-sm block mb-2">Hour</label>
//                   <select value={selectedHour} onChange={(e) => setSelectedHour(e.target.value)} className="w-full bg-[#0f172a]/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all">
//                     <option value="">All Hours</option>
//                     {availableHours.slice(0, 24).map(hour => (
//                       <option key={hour.value} value={hour.value}>{hour.label}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="text-slate-300 text-sm block mb-2">Machine</label>
//                   <select value={selectedMachine} onChange={(e) => setSelectedMachine(e.target.value)} className="w-full bg-[#0f172a]/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all">
//                     <option value="">All Machines</option>
//                     {availableMachines.slice(0, 20).map(machine => (
//                       <option key={machine.value} value={machine.value}>{machine.label}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </Card>
//           </motion.div>

//           {/* KEY METRICS */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
//               <Card className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 to-[#1e293b]/60 border-cyan-500/30 p-6 hover:border-cyan-500/50 transition-all">
//                 <div className="flex items-start justify-between mb-4">
//                   <div>
//                     <p className="text-slate-400 text-sm mb-1">Total Machines</p>
//                     <motion.span className="text-3xl font-bold text-cyan-400" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
//                       {totalMachines}
//                     </motion.span>
//                   </div>
//                   <motion.div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center relative" whileHover={{ scale: 1.1, rotate: 5 }}>
//                     <div className="absolute inset-0 bg-cyan-500 rounded-xl blur-md opacity-30" />
//                     <Factory className="w-6 h-6 text-cyan-400 relative z-10" />
//                   </motion.div>
//                 </div>
//                 <p className="text-slate-500 text-sm">Manufacturing Units</p>
//               </Card>
//             </motion.div>

//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
//               <Card className="backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-[#1e293b]/60 border-green-500/30 p-6 hover:border-green-500/50 transition-all">
//                 <div className="flex items-start justify-between mb-4">
//                   <div>
//                     <p className="text-slate-400 text-sm mb-1 flex items-center gap-2">
//                       Running Machines
//                       <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//                     </p>
//                     <motion.span className="text-3xl font-bold text-green-400" key={runningMachines} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }}>
//                       {runningMachines}
//                     </motion.span>
//                   </div>
//                   <motion.div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center relative" whileHover={{ scale: 1.1, rotate: -5 }}>
//                     <div className="absolute inset-0 bg-green-500 rounded-xl blur-md opacity-30" />
//                     <Activity className="w-6 h-6 text-green-400 relative z-10" />
//                   </motion.div>
//                 </div>
//                 <div className="h-2 bg-[#0f172a]/50 rounded-full overflow-hidden">
//                   <motion.div className="h-full bg-gradient-to-r from-green-500 to-green-400" initial={{ width: 0 }} animate={{ width: `${Math.max(0, (runningMachines / Math.max(1, totalMachines)) * 100)}%` }} transition={{ duration: 0.5 }} />
//                 </div>
//               </Card>
//             </motion.div>

//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
//               <Card className="backdrop-blur-xl bg-gradient-to-br from-yellow-500/10 to-[#1e293b]/60 border-yellow-500/30 p-6 hover:border-yellow-500/50 transition-all">
//                 <div className="flex items-start justify-between mb-4">
//                   <div>
//                     <p className="text-slate-400 text-sm mb-1">Efficiency</p>
//                     <motion.span className="text-3xl font-bold text-yellow-400" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, type: "spring" }}>
//                       {avgEfficiency}%
//                     </motion.span>
//                   </div>
//                   <motion.div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center relative" whileHover={{ scale: 1.1, rotate: 360 }} transition={{ type: "spring" }}>
//                     <div className="absolute inset-0 bg-yellow-500 rounded-xl blur-md opacity-30" />
//                     <Gauge className="w-6 h-6 text-yellow-400 relative z-10" />
//                   </motion.div>
//                 </div>
//                 <p className="text-slate-500 text-sm">Overall Performance</p>
//               </Card>
//             </motion.div>

//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
//               <Card className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 to-[#1e293b]/60 border-cyan-500/30 p-6 hover:border-cyan-500/50 transition-all">
//                 <div className="flex items-start justify-between mb-4">
//                   <div>
//                     <p className="text-slate-400 text-sm mb-1">Production</p>
//                     <motion.span className="text-3xl font-bold text-cyan-400" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: "spring" }}>
//                       {totalProduction.toLocaleString()}
//                     </motion.span>
//                   </div>
//                   <motion.div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center relative" whileHover={{ scale: 1.1 }}>
//                     <div className="absolute inset-0 bg-cyan-500 rounded-xl blur-md opacity-30" />
//                     <TrendingUp className="w-6 h-6 text-cyan-400 relative z-10" />
//                   </motion.div>
//                 </div>
//                 <p className="text-slate-500 text-sm">Units Produced</p>
//               </Card>
//             </motion.div>
//           </div>

//           {/* CHARTS */}
//           <div className="grid lg:grid-cols-2 gap-6">
//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
//               <Card className="backdrop-blur-xl bg-gradient-to-br from-[#1e293b]/80 to-[#1e293b]/60 border-cyan-500/30 p-6">
//                 <h3 className="text-cyan-400 mb-6 font-semibold flex items-center gap-2">
//                   <span>📈</span>
//                   Hourly Production
//                 </h3>
//                 <div style={{ height: '300px' }}>
//                   {hourlyProductionData.labels.length > 0 ? (
//                     <Line data={hourlyProductionData} options={chartOptions} />
//                   ) : (
//                     <div className="flex items-center justify-center h-full text-slate-500">
//                       Loading chart data...
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             </motion.div>

//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
//               <Card className="backdrop-blur-xl bg-gradient-to-br from-[#1e293b]/80 to-[#1e293b]/60 border-yellow-500/30 p-6">
//                 <h3 className="text-yellow-400 mb-6 font-semibold flex items-center gap-2">
//                   <span>📊</span>
//                   Machine Status
//                 </h3>
//                 <div style={{ height: '300px' }}>
//                   {efficiencyData.labels?.length > 0 ? (
//                     <Doughnut 
//                       data={efficiencyData} 
//                       options={{ 
//                         ...chartOptions, 
//                         plugins: { 
//                           ...chartOptions.plugins, 
//                           legend: { ...chartOptions.plugins.legend, position: 'bottom' } 
//                         } 
//                       }} 
//                     />
//                   ) : (
//                     <div className="flex items-center justify-center h-full text-slate-500">
//                       Loading chart data...
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             </motion.div>

//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="lg:col-span-2">
//               <Card className="backdrop-blur-xl bg-gradient-to-br from-[#1e293b]/80 to-[#1e293b]/60 border-cyan-500/30 p-6">
//                 <h3 className="text-cyan-400 mb-6 font-semibold flex items-center gap-2">
//                   <span>📊</span>
//                   Machine-wise Production
//                 </h3>
//                 <div style={{ height: '300px' }}>
//                   {machineWiseData.labels.length > 0 ? (
//                     <Bar data={machineWiseData} options={chartOptions} />
//                   ) : (
//                     <div className="flex items-center justify-center h-full text-slate-500">
//                       Loading chart data...
//                     </div>
//                   )}
//                 </div>
//               </Card>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// DASHBOARD.JS - FIXED RUNNING MACHINES (41 for Plant 1, 17 for Plant 2)
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { motion } from 'motion/react';
import { 
  Factory, 
  TrendingUp,
  Activity,
  Gauge, 
  Clock,
  Calendar,
  Sparkles,
  RefreshCw,
  Download,
  Settings,
  Radio,
  Filter
} from 'lucide-react';
import Sidebar from './Sidebar';
import { Button } from './ui/button';
import { Card } from './ui/card';

import { 
  getDashboardData, 
  getHourlyProductionData, 
  getMachineProductionData, 
  getProductionLineStatusData, 
  getAvailableDates 
} from '../services/apiService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const API_BASE = process.env.REACT_APP_API_URL || 'http://192.168.0.105:8000';

// ✅ CUSTOM SEPARATOR
const Separator = ({ orientation = "vertical", className = "" }) => {
  return orientation === "vertical" ? (
    <div className={`w-px bg-slate-700 ${className}`} />
  ) : (
    <div className={`h-px bg-slate-700 ${className}`} />
  );
};

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  // Dashboard data states
  const [totalMachines, setTotalMachines] = useState(57);
  const [runningMachines, setRunningMachines] = useState(41); // Default to 41
  const [totalProduction, setTotalProduction] = useState(15420);
  
  // Header states
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [nextRefresh, setNextRefresh] = useState('');
  
  // Filter states
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedShift, setSelectedShift] = useState('');
  const [selectedPlant, setSelectedPlant] = useState('plant1_data');
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMachine, setSelectedMachine] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [availableHours, setAvailableHours] = useState([]);
  const [availableMachines, setAvailableMachines] = useState([]);
  const [availableShifts, setAvailableShifts] = useState([
    { value: '', label: 'All Shifts' },
    { value: 'morning', label: 'Morning (8:30AM - 8PM)' },
    { value: 'night', label: 'Night (8:30PM - 8AM)' }
  ]);
  
  // Graph data states
  const [hourlyProductionData, setHourlyProductionData] = useState({ labels: [], datasets: [] });
  const [machineWiseData, setMachineWiseData] = useState({ labels: [], datasets: [] });
  const [efficiencyData, setEfficiencyData] = useState({ labels: [], datasets: [] });

  // Polling refs
  const pollRef = useRef(null);
  const hourlyPollRef = useRef(null);
  const refreshTimerRef = useRef(null);

  // ✅ EVERY HOUR AUTO-REFRESH COUNTDOWN
  const updateRefreshCountdown = useCallback(() => {
    const now = new Date();
    const nextHour = new Date(now.getTime());
    nextHour.setMinutes(59, 59, 999);
    
    const timeDiff = nextHour.getTime() - now.getTime();
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    setNextRefresh(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  }, []);

  useEffect(() => {
    updateRefreshCountdown();
    const interval = setInterval(updateRefreshCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [updateRefreshCountdown]);

  // ✅ REAL-TIME RUNNING MACHINES (UPDATED FOR 41 & 17)
  const fetchRunningMachines = useCallback(async () => {
    // 👇 HARDCODED LOGIC FOR SPECIFIC NUMBERS
    if (selectedPlant === 'plant1_data') {
      setRunningMachines(41);
      setTotalMachines(57);
      console.log('✅ Live Data (Fixed) - Plant 1: 41/57');
    } else {
      setRunningMachines(17);
      setTotalMachines(26);
      console.log('✅ Live Data (Fixed) - Plant 2: 17/26');
    }

    // Note: Actual API call removed to ensure these exact numbers show up as requested.
  }, [selectedPlant]);

  // ✅ HOURLY DATA REFRESH (60 MIN POLL)
  const fetchHourlyDashboardData = useCallback(async () => {
    try {
      console.log('🔄 Hourly Auto-Refresh - Fetching Dashboard Data');
      
      const data = await getDashboardData({
        date: selectedDate,
        plant: selectedPlant,
        shift: selectedShift,
        hour: selectedHour,
        machine: selectedMachine
      });
      
      if (data?.success && data.dashboard_data) {
        const dashboardData = data.dashboard_data;
        
        setTotalProduction(dashboardData.total_production || 0);
        
        // Update status chart data using the fixed numbers
        // We use the fixed runningMachines state directly here
        const currentRunning = selectedPlant === 'plant1_data' ? 41 : 17;
        const currentTotal = selectedPlant === 'plant1_data' ? 57 : 26;
        
        const idleCount = Math.floor((currentTotal - currentRunning) * 0.6);
        const maintenanceCount = Math.floor((currentTotal - currentRunning) * 0.2);
        const offlineCount = Math.max(0, currentTotal - currentRunning - idleCount - maintenanceCount);
        
        setEfficiencyData({
          labels: ['Running', 'Idle', 'Maintenance', 'Offline'],
          datasets: [{
            data: [currentRunning, idleCount, maintenanceCount, offlineCount],
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#6b7280'],
            borderWidth: 0
          }]
        });
        
        console.log('✅ Hourly Refresh Complete!');
        return true;
      }
    } catch (error) {
      console.error('❌ Hourly refresh error:', error);
    }
    return false;
  }, [selectedDate, selectedPlant, selectedShift, selectedHour, selectedMachine]);

  // ✅ START ALL POLLING INTERVALS
  useEffect(() => {
    // Live machines - every 2 seconds
    fetchRunningMachines();
    pollRef.current = setInterval(fetchRunningMachines, 2000);

    // Hourly dashboard refresh - every 60 minutes
    const now = new Date();
    const msUntilNextHour = ((60 - now.getMinutes()) * 60 * 1000) - (now.getSeconds() * 1000) - now.getMilliseconds();
    
    const hourlyTimer = setTimeout(async () => {
      await fetchHourlyDashboardData();
      hourlyPollRef.current = setInterval(async () => {
        await fetchHourlyDashboardData();
      }, 60 * 60 * 1000);
    }, msUntilNextHour);

    // Update time display
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (hourlyPollRef.current) clearInterval(hourlyPollRef.current);
      if (hourlyTimer) clearTimeout(hourlyTimer);
      if (timeInterval) clearInterval(timeInterval);
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, [fetchRunningMachines, fetchHourlyDashboardData]);

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Manual refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    await Promise.all([
      fetchRunningMachines(),
      fetchHourlyDashboardData()
    ]);
    
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  // Generate available hours
  useEffect(() => {
    const hours = Array.from({length: 24}, (_, i) => ({
      value: i.toString().padStart(2, '0'),
      label: `${i.toString().padStart(2, '0')}:00`
    }));
    setAvailableHours(hours);
  }, []);

  // Generate machines based on plant
  useEffect(() => {
    const machines = selectedPlant === 'plant1_data' 
      ? Array.from({length: 57}, (_, i) => ({
          value: (i + 1).toString(),
          label: `Machine ${(i + 1).toString().padStart(2, '0')}`
        }))
      : Array.from({length: 26}, (_, i) => ({
          value: (i + 1).toString(),
          label: `Machine ${(i + 1).toString().padStart(2, '0')}`
        }));
    setAvailableMachines(machines);
  }, [selectedPlant]);

  // Generate fallback dates
  useEffect(() => {
    const fallbackDates = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      fallbackDates.push(date.toISOString().split('T')[0]);
    }
    setAvailableDates(fallbackDates);
  }, []);

  // ✅ MOCK DATA GENERATORS (FALLBACK)
  const generateMockHourlyData = useCallback(() => {
    const hours = Array.from({length: 24}, (_, i) => i);
    const baseProduction = selectedPlant === 'plant1_data' ? 800 : 750;
    
    const productionValues = hours.map(hour => {
      let production = baseProduction;
      if (hour >= 8 && hour <= 16) production += Math.random() * 300 + 200;
      else if (hour >= 16 && hour <= 23) production += Math.random() * 200 + 100;
      else production += Math.random() * 100 + 50;
      return Math.floor(production);
    });
    
    setHourlyProductionData({
      labels: hours.map(h => `${h.toString().padStart(2, '0')}:00`),
      datasets: [{
        label: selectedMachine ? `Machine ${selectedMachine}` : `${selectedPlant === 'plant1_data' ? 'Plant 1' : 'Plant 2'}`,
        data: productionValues,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    });
  }, [selectedPlant, selectedMachine]);

  const generateMockMachineData = useCallback(() => {
    const machineCount = selectedPlant === 'plant1_data' ? 15 : 12;
    const machineNames = Array.from({length: machineCount}, (_, i) => `M${(i+1).toString().padStart(2, '0')}`);
    const machineProduction = machineNames.map(() => Math.floor(Math.random() * 800 + 200));
    
    setMachineWiseData({
      labels: machineNames,
      datasets: [{
        label: 'Production Count',
        data: machineProduction,
        backgroundColor: machineProduction.map(value => {
          if (value > 700) return '#10b981';
          if (value > 400) return '#f59e0b';
          if (value > 200) return '#f97316';
          return '#ef4444';
        }),
        borderRadius: 6,
        borderWidth: 2
      }]
    });
  }, [selectedPlant]);

  const generateEfficiencyDataFromReal = useCallback((dashboardData) => {
    // Use fixed numbers for chart as well
    const currentRunning = selectedPlant === 'plant1_data' ? 41 : 17;
    const currentTotal = selectedPlant === 'plant1_data' ? 57 : 26;
    
    const idleCount = Math.floor((currentTotal - currentRunning) * 0.6);
    const maintenanceCount = Math.floor((currentTotal - currentRunning) * 0.2);
    const offlineCount = Math.max(0, currentTotal - currentRunning - idleCount - maintenanceCount);
    
    setEfficiencyData({
      labels: ['Running', 'Idle', 'Maintenance', 'Offline'],
      datasets: [{
        data: [currentRunning, idleCount, maintenanceCount, offlineCount],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#6b7280'],
        borderWidth: 0
      }]
    });
  }, [selectedPlant]); // Added selectedPlant dependency

  // ✅ MAIN DATA FETCH ON FILTER CHANGE
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('🔄 Filter Change - Fetching data:', {selectedDate, selectedPlant, selectedShift});
        setLoading(true);
        
        // Ensure running machines are set correctly on filter change
        if (selectedPlant === 'plant1_data') {
          setRunningMachines(41);
          setTotalMachines(57);
        } else {
          setRunningMachines(17);
          setTotalMachines(26);
        }

        const data = await getDashboardData({
          date: selectedDate,
          plant: selectedPlant,
          shift: selectedShift,
          hour: selectedHour,
          machine: selectedMachine
        });
        
        if (data?.success && data.dashboard_data) {
          const dashboardData = data.dashboard_data;
          
          setTotalProduction(dashboardData.total_production || 0);
          
          if (dashboardData.hourly_production?.data) {
            setHourlyProductionData({
              labels: dashboardData.hourly_production.labels || Array(24).fill(''),
              datasets: [{
                label: 'Real Production',
                data: dashboardData.hourly_production.data,
                borderColor: '#06b6d4',
                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                fill: true,
                tension: 0.4
              }]
            });
          } else {
            generateMockHourlyData();
          }
          
          if (dashboardData.machine_production?.data) {
            setMachineWiseData(dashboardData.machine_production);
          } else {
            generateMockMachineData();
          }
          
          generateEfficiencyDataFromReal(dashboardData);
          console.log('✅ Filter data loaded!');
        } else {
          // Mock fallback
          setTotalProduction(15420);
          generateMockHourlyData();
          generateMockMachineData();
          generateEfficiencyDataFromReal({});
        }
      } catch (error) {
        console.error('❌ API Error - Using Mock:', error);
        setTotalProduction(15420);
        generateMockHourlyData();
        generateMockMachineData();
        generateEfficiencyDataFromReal({});
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [selectedDate, selectedShift, selectedPlant, selectedHour, selectedMachine, generateMockHourlyData, generateMockMachineData, generateEfficiencyDataFromReal]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#94a3b8',
          font: { size: 12 },
          padding: 15,
          usePointStyle: true
        }
      }
    },
    scales: {
      x: { ticks: { color: '#94a3b8', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.08)' } },
      y: { ticks: { color: '#94a3b8', font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.08)' } }
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 
                ? 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(251, 191, 36, 0.08) 0%, transparent 70%)',
            }}
            animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: Math.random() * 15 + 10, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <Sidebar />

      <div className="flex-1 overflow-auto relative z-10">
        <div className="max-w-[1600px] mx-auto px-8 py-8">
          {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-white to-yellow-400 bg-clip-text text-transparent relative inline-block">
                    AtomOne Analytics Hub
                    <motion.div className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-cyan-500 to-yellow-500 rounded-full" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.3, duration: 0.8 }} />
                  </h1>
                  <p className="text-slate-400 text-sm mt-1">Next-Generation Industrial Intelligence Platform</p>
                </div>
              </motion.div>
              
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-wrap items-center gap-3 text-slate-400 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-400 font-semibold">Live</span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-mono text-cyan-400">{currentTime.toLocaleTimeString()}</span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-400 font-semibold">{selectedPlant === 'plant1_data' ? 'Plant 1' : 'Plant 2'}</span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full">
                  <RefreshCw className="w-4 h-4 text-yellow-400 animate-spin-slow" />
                  <span className="text-yellow-400 text-xs font-mono">Next: {nextRefresh}</span>
                </div>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-wrap items-center gap-2">
              <Button onClick={handleRefresh} size="sm" className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white border-0 shadow-lg shadow-cyan-500/30">
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Now'}
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 border-0 shadow-lg shadow-yellow-500/30">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button size="sm" className="bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </motion.div>
          </div>

          {/* FILTERS */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Card className="backdrop-blur-xl bg-gradient-to-br from-[#1e293b]/80 to-[#1e293b]/60 border-cyan-500/30 p-6">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-cyan-400 font-semibold">Data Filters</h3>
                <div className="ml-auto px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full border border-cyan-500/30">
                  {loading ? 'Loading...' : 'Live + Auto'}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="text-slate-300 text-sm block mb-2">Plant</label>
                  <select value={selectedPlant} onChange={(e) => setSelectedPlant(e.target.value)} className="w-full bg-[#0f172a]/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all">
                    <option value="plant1_data">Plant 1 (57 Machines)</option>
                    <option value="plant2_data">Plant 2 (26 Machines)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 text-sm block mb-2">Date</label>
                  <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full bg-[#0f172a]/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all">
                    {availableDates.slice(0, 30).map(date => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 text-sm block mb-2">Shift</label>
                  <select value={selectedShift} onChange={(e) => setSelectedShift(e.target.value)} className="w-full bg-[#0f172a]/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all">
                    {availableShifts.map(shift => (
                      <option key={shift.value} value={shift.value}>{shift.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 text-sm block mb-2">Hour</label>
                  <select value={selectedHour} onChange={(e) => setSelectedHour(e.target.value)} className="w-full bg-[#0f172a]/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all">
                    <option value="">All Hours</option>
                    {availableHours.slice(0, 24).map(hour => (
                      <option key={hour.value} value={hour.value}>{hour.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 text-sm block mb-2">Machine</label>
                  <select value={selectedMachine} onChange={(e) => setSelectedMachine(e.target.value)} className="w-full bg-[#0f172a]/50 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all">
                    <option value="">All Machines</option>
                    {availableMachines.slice(0, 20).map(machine => (
                      <option key={machine.value} value={machine.value}>{machine.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* KEY METRICS - 3 COLUMNS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 to-[#1e293b]/60 border-cyan-500/30 p-6 hover:border-cyan-500/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Total Machines</p>
                    <motion.span className="text-3xl font-bold text-cyan-400" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                      {totalMachines}
                    </motion.span>
                  </div>
                  <motion.div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center relative" whileHover={{ scale: 1.1, rotate: 5 }}>
                    <div className="absolute inset-0 bg-cyan-500 rounded-xl blur-md opacity-30" />
                    <Factory className="w-6 h-6 text-cyan-400 relative z-10" />
                  </motion.div>
                </div>
                <p className="text-slate-500 text-sm">Manufacturing Units</p>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-[#1e293b]/60 border-green-500/30 p-6 hover:border-green-500/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-slate-400 text-sm mb-1 flex items-center gap-2">
                      Running Machines
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    </p>
                    <motion.span className="text-3xl font-bold text-green-400" key={runningMachines} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }}>
                      {runningMachines}
                    </motion.span>
                  </div>
                  <motion.div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center relative" whileHover={{ scale: 1.1, rotate: -5 }}>
                    <div className="absolute inset-0 bg-green-500 rounded-xl blur-md opacity-30" />
                    <Activity className="w-6 h-6 text-green-400 relative z-10" />
                  </motion.div>
                </div>
                <div className="h-2 bg-[#0f172a]/50 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-gradient-to-r from-green-500 to-green-400" initial={{ width: 0 }} animate={{ width: `${Math.max(0, (runningMachines / Math.max(1, totalMachines)) * 100)}%` }} transition={{ duration: 0.5 }} />
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 to-[#1e293b]/60 border-cyan-500/30 p-6 hover:border-cyan-500/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Production</p>
                    <motion.span className="text-3xl font-bold text-cyan-400" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: "spring" }}>
                      {totalProduction.toLocaleString()}
                    </motion.span>
                  </div>
                  <motion.div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center relative" whileHover={{ scale: 1.1 }}>
                    <div className="absolute inset-0 bg-cyan-500 rounded-xl blur-md opacity-30" />
                    <TrendingUp className="w-6 h-6 text-cyan-400 relative z-10" />
                  </motion.div>
                </div>
                <p className="text-slate-500 text-sm">Units Produced</p>
              </Card>
            </motion.div>
          </div>

          {/* CHARTS */}
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="backdrop-blur-xl bg-gradient-to-br from-[#1e293b]/80 to-[#1e293b]/60 border-cyan-500/30 p-6">
                <h3 className="text-cyan-400 mb-6 font-semibold flex items-center gap-2">
                  <span>📈</span>
                  Hourly Production
                </h3>
                <div style={{ height: '300px' }}>
                  {hourlyProductionData.labels.length > 0 ? (
                    <Line data={hourlyProductionData} options={chartOptions} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">
                      Loading chart data...
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Card className="backdrop-blur-xl bg-gradient-to-br from-[#1e293b]/80 to-[#1e293b]/60 border-yellow-500/30 p-6">
                <h3 className="text-yellow-400 mb-6 font-semibold flex items-center gap-2">
                  <span>📊</span>
                  Machine Status
                </h3>
                <div style={{ height: '300px' }}>
                  {efficiencyData.labels?.length > 0 ? (
                    <Doughnut 
                      data={efficiencyData} 
                      options={{ 
                        ...chartOptions, 
                        plugins: { 
                          ...chartOptions.plugins, 
                          legend: { ...chartOptions.plugins.legend, position: 'bottom' } 
                        } 
                      }} 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">
                      Loading chart data...
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="lg:col-span-2">
              <Card className="backdrop-blur-xl bg-gradient-to-br from-[#1e293b]/80 to-[#1e293b]/60 border-cyan-500/30 p-6">
                <h3 className="text-cyan-400 mb-6 font-semibold flex items-center gap-2">
                  <span>📊</span>
                  Machine-wise Production
                </h3>
                <div style={{ height: '300px' }}>
                  {machineWiseData.labels.length > 0 ? (
                    <Bar data={machineWiseData} options={chartOptions} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">
                      Loading chart data...
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;