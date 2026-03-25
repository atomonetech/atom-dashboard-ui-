import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area
} from 'recharts';
import {
  Factory, Calendar, Settings, TrendingUp, Activity, AlertTriangle,
  ChevronDown, ChevronRight, Cpu, Gauge, Clock, Zap, Monitor,
  Filter, BarChart3, Play, Square, Power, Terminal, Download,
  LineChart as LineChartIcon, BarChart as BarChartIcon, AreaChart as AreaChartIcon,
  Server, HardDrive, Wifi, Shield
} from 'lucide-react';

// Generate 30 days of production data for 2022-2024
const generateYearlyData = (year) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, idx) => ({
    name: month,
    production: Math.floor(Math.random() * (8500 - 4500 + 1) + 4500),
    idle: Math.floor(Math.random() * (2500 - 800 + 1) + 800),
    shutdown: Math.floor(Math.random() * (1200 - 300 + 1) + 300),
  }));
};

const generateMonthData = () => {
  const days = [];
  for (let i = 1; i <= 30; i++) {
    days.push({
      name: `Day ${i}`,
      production: Math.floor(Math.random() * (450 - 250 + 1) + 250),
      idle: Math.floor(Math.random() * (200 - 80 + 1) + 80),
      shutdown: Math.floor(Math.random() * (100 - 20 + 1) + 20),
    });
  }
  return days;
};

const generateWeekData = () => {
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  return weeks.map((week) => ({
    name: week,
    production: Math.floor(Math.random() * (2800 - 1500 + 1) + 1500),
    idle: Math.floor(Math.random() * (800 - 300 + 1) + 300),
    shutdown: Math.floor(Math.random() * (400 - 100 + 1) + 100),
  }));
};

const ProductionHistory = () => {
  const [selectedPlant, setSelectedPlant] = useState('Plant 1');
  const [selectedMachines, setSelectedMachines] = useState(new Set([12]));
  const [timeFrame, setTimeFrame] = useState('monthly'); // 'monthly', 'yearly', 'weekly'
  const [selectedMonth, setSelectedMonth] = useState('November');
  const [selectedYear, setSelectedYear] = useState('2022');
  const [chartType, setChartType] = useState('bar'); // 'bar', 'line', 'area'
  const [showMachineGrid, setShowMachineGrid] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentDay, setCurrentDay] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Data based on timeframe
  const monthlyData = generateMonthData();
  const yearlyData = generateYearlyData(selectedYear);
  const weeklyData = generateWeekData();

  const getCurrentData = () => {
    switch(timeFrame) {
      case 'yearly': return yearlyData;
      case 'weekly': return weeklyData;
      default: return monthlyData;
    }
  };

  const getChartTitle = () => {
    switch(timeFrame) {
      case 'yearly': return `${selectedYear} Production Overview`;
      case 'weekly': return 'Weekly Production Analysis';
      default: return `${selectedMonth} ${selectedYear} - Daily Production`;
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const overallEfficiency = 89;
  const topMachine = 'M-12';
  const totalDowntime = '14h';

  const toggleMachine = (num) => {
    const newSet = new Set(selectedMachines);
    if (newSet.has(num)) {
      newSet.delete(num);
    } else {
      newSet.add(num);
    }
    setSelectedMachines(newSet);
  };

  const selectAllMachines = () => {
    const allMachines = Array.from({ length: 52 }, (_, i) => i + 1);
    setSelectedMachines(new Set(allMachines));
  };

  const clearMachines = () => {
    setSelectedMachines(new Set());
  };

  const startAnimation = () => {
    setIsAnimating(true);
    let day = 0;
    const interval = setInterval(() => {
      if (day < 30) {
        setCurrentDay(day);
        day++;
      } else {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 200);
    return () => clearInterval(interval);
  };

  const stopAnimation = () => {
    setIsAnimating(false);
    setCurrentDay(0);
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const years = ['2022', '2023', '2024'];

  const formattedTime = currentTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: true 
  });

  const renderChart = () => {
    const data = getCurrentData();
    const commonProps = {
      data: data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch(chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
            <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #3b82f6', borderRadius: '8px' }} />
            <Line type="monotone" dataKey="production" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
            <Line type="monotone" dataKey="idle" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
            <Line type="monotone" dataKey="shutdown" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444' }} />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="productionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="idleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="shutdownGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
            <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #3b82f6', borderRadius: '8px' }} />
            <Area type="monotone" dataKey="production" stroke="#10b981" fill="url(#productionGradient)" />
            <Area type="monotone" dataKey="idle" stroke="#f59e0b" fill="url(#idleGradient)" />
            <Area type="monotone" dataKey="shutdown" stroke="#ef4444" fill="url(#shutdownGradient)" />
          </AreaChart>
        );
      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} interval={timeFrame === 'monthly' ? 4 : 0} />
            <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #3b82f6', borderRadius: '8px' }} />
            <Bar dataKey="production" fill="#10b981" radius={[4, 4, 0, 0]} barSize={timeFrame === 'monthly' ? 24 : 40} />
            <Bar dataKey="idle" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={timeFrame === 'monthly' ? 24 : 40} />
            <Bar dataKey="shutdown" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={timeFrame === 'monthly' ? 24 : 40} />
          </BarChart>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Enhanced Glass Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.05),transparent_50%)]" />
        
        {/* Animated Grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
        
        {/* Floating Particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-blue-500/20 animate-float"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 20}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-[1600px] mx-auto p-6 relative z-10">
        {/* Header with Enhanced Glass Effect */}
        <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl mb-8 p-6 shadow-2xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg" />
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg" />
                </div>
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-blue-400" />
                  <span className="text-xs text-gray-400 font-mono">production@dashboard:~/system$</span>
                </div>
              </div>
              <h1 className="text-5xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  PRODUCTION HISTORY
                </span>
                <span className="text-gray-300 ml-3">& ANALYSIS</span>
              </h1>
              <p className="text-sm text-gray-400 mt-2 font-mono flex items-center gap-2">
                <Activity size={14} /> CONSOLE VIEW · REAL-TIME MONITORING SYSTEM
              </p>
            </div>
            <div className="flex gap-3">
              <button className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl px-5 py-2.5 text-sm text-gray-300 hover:bg-white/10 transition-all flex items-center gap-2">
                <Settings size={16} />
                CONFIG
              </button>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center text-blue-400 font-bold backdrop-blur-xl">
                AD
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT SIDEBAR - Enhanced Glass Filters */}
          <div className="lg:col-span-3 space-y-6">
            <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-white/5 px-5 py-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-blue-400" />
                  <h2 className="text-xs font-mono font-semibold text-gray-300 tracking-wider">FILTERS & PARAMETERS</h2>
                </div>
              </div>
              
              <div className="p-5 space-y-6">
                {/* TIME PERIOD with Date Selection */}
                <div>
                  <label className="text-[11px] font-mono text-gray-400 block mb-2 flex items-center gap-2">
                    <Calendar size={12} /> TIME PERIOD
                  </label>
                  
                  {/* Time Frame Selection */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <button
                      onClick={() => setTimeFrame('monthly')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                        timeFrame === 'monthly'
                          ? 'bg-blue-500/20 border border-blue-500 text-blue-400'
                          : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setTimeFrame('weekly')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                        timeFrame === 'weekly'
                          ? 'bg-blue-500/20 border border-blue-500 text-blue-400'
                          : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      Weekly
                    </button>
                    <button
                      onClick={() => setTimeFrame('yearly')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                        timeFrame === 'yearly'
                          ? 'bg-blue-500/20 border border-blue-500 text-blue-400'
                          : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      Yearly
                    </button>
                  </div>
                  
                  {/* Month Selection (for monthly view) */}
                  {timeFrame === 'monthly' && (
                    <div className="mb-2">
                      <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="w-full bg-black/30 backdrop-blur border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 font-mono focus:border-blue-500 focus:outline-none mb-2"
                      >
                        {months.map(month => (
                          <option key={month}>{month}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  {/* Year Selection */}
                  <div className="flex gap-2">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="flex-1 bg-black/30 backdrop-blur border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 font-mono focus:border-blue-500 focus:outline-none"
                    >
                      {years.map(year => (
                        <option key={year}>{year}</option>
                      ))}
                    </select>
                    <div className="text-[11px] text-gray-500 font-mono flex items-center">
                      <Clock size={10} className="mr-1" />
                      {selectedMonth} {selectedYear}
                    </div>
                  </div>
                </div>

                {/* PLANT SELECTION */}
                <div>
                  <label className="text-[11px] font-mono text-gray-400 block mb-2 flex items-center gap-2">
                    <Factory size={12} /> PLANT SELECTION
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedPlant('Plant 1')}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all duration-300 font-mono text-sm ${
                        selectedPlant === 'Plant 1'
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/10'
                          : 'border-white/10 text-gray-400 hover:border-blue-500/50 hover:bg-white/5'
                      }`}
                    >
                      <Cpu size={14} /> Plant 1
                    </button>
                    <button
                      onClick={() => setSelectedPlant('Plant 2')}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all duration-300 font-mono text-sm ${
                        selectedPlant === 'Plant 2'
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/10'
                          : 'border-white/10 text-gray-400 hover:border-blue-500/50 hover:bg-white/5'
                      }`}
                    >
                      <Zap size={14} /> Plant 2
                    </button>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-2 font-mono">
                    {selectedPlant} Machines (1-52)
                  </div>
                </div>

                {/* MACHINE SELECTION */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[11px] font-mono text-gray-400 flex items-center gap-2">
                      <Settings size={12} /> MACHINE NO.
                    </label>
                    <button 
                      onClick={() => setShowMachineGrid(!showMachineGrid)} 
                      className="text-gray-500 hover:text-blue-400 transition-colors"
                    >
                      {showMachineGrid ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                  </div>
                  
                  {showMachineGrid && (
                    <div className="space-y-3">
                      <div className="text-[10px] text-gray-500 mb-2 font-mono">
                        {selectedPlant} Machines (1-52)
                      </div>
                      <div className="grid grid-cols-5 gap-1.5 max-h-[240px] overflow-y-auto custom-scrollbar">
                        {Array.from({ length: 52 }, (_, i) => i + 1).map((num) => (
                          <button
                            key={num}
                            onClick={() => toggleMachine(num)}
                            className={`aspect-square flex items-center justify-center text-xs font-mono rounded-lg transition-all ${
                              selectedMachines.has(num)
                                ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold shadow-lg'
                                : 'bg-black/30 border border-white/10 text-gray-400 hover:border-blue-500/50 hover:text-blue-400'
                            }`}
                          >
                            {String(num).padStart(2, '0')}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button onClick={selectAllMachines} className="text-[10px] text-blue-400 border border-blue-500/30 px-3 py-1 rounded-lg hover:bg-blue-500/10 transition-all font-mono">SELECT ALL</button>
                        <button onClick={clearMachines} className="text-[10px] text-gray-400 border border-white/10 px-3 py-1 rounded-lg hover:border-red-500/50 hover:text-red-400 transition-all font-mono">CLEAR</button>
                      </div>
                      <div className="text-[10px] text-blue-400 mt-2 font-mono">
                        SELECTED: {selectedMachines.size} MACHINES
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-blue-400 mb-4">
                <Monitor size={14} />
                <span className="text-xs font-mono font-semibold">SYSTEM STATUS</span>
              </div>
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-gray-500">DATA STREAM</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ACTIVE
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">ANIMATED PERIOD</span>
                  <span className="text-gray-300">2022 - 10 Jun</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">LAST SYNC</span>
                  <span className="text-gray-300">{formattedTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-9 space-y-6">
            {/* Chart Type Selector */}
            <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 font-mono">CHART VIEW:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setChartType('bar')}
                      className={`p-2 rounded-lg transition-all ${chartType === 'bar' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      <BarChartIcon size={18} />
                    </button>
                    <button
                      onClick={() => setChartType('line')}
                      className={`p-2 rounded-lg transition-all ${chartType === 'line' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      <LineChartIcon size={18} />
                    </button>
                    <button
                      onClick={() => setChartType('area')}
                      className={`p-2 rounded-lg transition-all ${chartType === 'area' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      <AreaChartIcon size={18} />
                    </button>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={startAnimation}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-xl text-xs text-blue-400 hover:bg-blue-500/20 transition-all font-mono"
                  >
                    <Play size={12} /> ANIMATE
                  </button>
                  <button 
                    onClick={stopAnimation}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 hover:bg-red-500/20 transition-all font-mono"
                  >
                    <Square size={12} /> STOP
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-500/10 border border-gray-500/30 rounded-xl text-xs text-gray-400 hover:bg-gray-500/20 transition-all font-mono">
                    <Download size={12} /> EXPORT
                  </button>
                </div>
              </div>
            </div>

            {/* Chart Card */}
            <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-6 pt-5 pb-3 border-b border-white/10 bg-white/5">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <BarChart3 size={18} className="text-blue-400" />
                    <span className="text-gray-200">MACHINE PRODUCTION & STATE HISTORY</span>
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-1 font-mono">
                    {getChartTitle()} · {timeFrame === 'monthly' ? '30 Day Cycle' : timeFrame === 'weekly' ? '4 Week Cycle' : '12 Month Cycle'}
                  </p>
                </div>
                <div className="flex gap-6 mt-4 text-xs font-mono">
                  <span className="flex items-center gap-2 text-emerald-400"><span className="w-3 h-3 bg-emerald-500 rounded-sm shadow-lg"></span> Production Output</span>
                  <span className="flex items-center gap-2 text-amber-400"><span className="w-3 h-3 bg-amber-500 rounded-sm"></span> Idle State</span>
                  <span className="flex items-center gap-2 text-red-400"><span className="w-3 h-3 bg-red-500 rounded-sm"></span> Shutdown / Not Working</span>
                </div>
              </div>
              
              <div className="p-4 h-[450px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {renderChart()}
                </ResponsiveContainer>
              </div>
              {isAnimating && timeFrame === 'monthly' && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-500/90 backdrop-blur text-white px-4 py-2 rounded-full text-xs font-mono shadow-lg animate-bounce">
                  <Play size={10} className="inline mr-1" /> ANIMATING DAY {currentDay + 1}/30
                </div>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-blue-500/30 transition-all group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-[11px] text-gray-400 font-mono">OVERALL PLANT EFFICIENCY</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent mt-2">
                      {overallEfficiency}%
                    </p>
                  </div>
                  <Gauge size={32} className="text-emerald-500/50 group-hover:text-emerald-400 transition-colors" />
                </div>
                <div className="mt-3 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full shadow-lg" style={{ width: `${overallEfficiency}%` }} />
                </div>
              </div>

              <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-cyan-500/30 transition-all group">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-[11px] text-gray-400 font-mono">TOP PERFORMING MACHINE</p>
                    <p className="text-3xl font-bold text-cyan-400 mt-2 font-mono">{topMachine}</p>
                  </div>
                  <TrendingUp size={32} className="text-cyan-500/50 group-hover:text-cyan-400 transition-colors" />
                </div>
                <p className="text-xs text-emerald-400 font-mono">↑ 98% UPTIME THIS MONTH</p>
              </div>

              <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-red-500/30 transition-all group">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="text-[11px] text-gray-400 font-mono">TOTAL DOWNTIME THIS MONTH</p>
                    <p className="text-3xl font-bold text-red-400 mt-2 font-mono">{totalDowntime}</p>
                  </div>
                  <AlertTriangle size={32} className="text-red-500/50 group-hover:text-red-400 transition-colors" />
                </div>
                <p className="text-xs text-emerald-400 font-mono">↓ 12% VS PREVIOUS MONTH</p>
              </div>
            </div>

            {/* Console Footer */}
            <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex flex-wrap justify-between items-center text-[10px] font-mono">
                <div className="flex gap-6">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Power size={10} className="animate-pulse" />
                    LIVE MONITORING
                  </span>
                  <span className="text-gray-500 flex items-center gap-1">
                    <Server size={10} />
                    MACHINE COUNT: {selectedMachines.size}/52
                  </span>
                  <span className="text-gray-500 flex items-center gap-1">
                    <Factory size={10} />
                    ACTIVE PLANT: {selectedPlant}
                  </span>
                </div>
                <div className="text-gray-500 flex items-center gap-2">
                  <Clock size={10} />
                  LAST SYNC: {formattedTime}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0; }
          25% { opacity: 0.3; }
          75% { opacity: 0.3; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.5; }
        }
        
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 4px;
        }
        
        * {
          scrollbar-width: thin;
          scrollbar-color: #3b82f6 rgba(255,255,255,0.05);
        }
      `}</style>
    </div>
  );
};

export default ProductionHistory;