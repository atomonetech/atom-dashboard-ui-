import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area
} from 'recharts';
import {
  Factory, Calendar, Settings, TrendingUp, Activity, AlertTriangle,
  ChevronDown, ChevronRight, Cpu, Gauge, Clock, Zap, Monitor,
  Filter, BarChart3, Play, Square, Power, Terminal,
  LineChart as LineChartIcon, BarChart as BarChartIcon, AreaChart as AreaChartIcon,
  Server, HardDrive, Wifi, Shield, X, TrendingDown, Layers, Grid, Circle,
  Info, Eye, RefreshCw, Loader
} from 'lucide-react';

// API Base URL
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Create axios instance with interceptors
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error Details:', {
      message: error.message,
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Generate sample data for testing when API fails
const generateSampleData = () => {
  const days = [];
  for (let i = 1; i <= 30; i++) {
    days.push({
      name: `Day ${i}`,
      production: Math.floor(Math.random() * (8500 - 4500 + 1) + 4500),
      idle: Math.floor(Math.random() * (1200 - 300 + 1) + 300),
      shutdown: Math.floor(Math.random() * (800 - 150 + 1) + 150),
    });
  }
  return days;
};

const generateSampleMachineData = (machineNumber, month, year) => {
  const days = [];
  const baseProduction = Math.floor(Math.random() * (400 - 200 + 1) + 200);
  const baseIdle = Math.floor(Math.random() * (150 - 50 + 1) + 50);
  
  for (let i = 1; i <= 30; i++) {
    days.push({
      name: `Day ${i}`,
      day: i,
      production: baseProduction + Math.floor(Math.random() * 100) - 50,
      idle_minutes: baseIdle + Math.floor(Math.random() * 60) - 30,
      idle_hours: (baseIdle + Math.floor(Math.random() * 60) - 30) / 60,
      has_data: true,
      status: 'Active'
    });
  }

  const totalProduction = days.reduce((sum, d) => sum + d.production, 0);
  const totalIdleHours = days.reduce((sum, d) => sum + d.idle_hours, 0);
  const totalIdleMinutes = days.reduce((sum, d) => sum + d.idle_minutes, 0);
  
  return {
    machine_info: {
      machine_no: machineNumber,
      machine_id: `M-${String(machineNumber).padStart(2, '0')}`,
      month_name: monthNames[month - 1],
      days_in_month: 30
    },
    production_summary: {
      total_production: totalProduction,
      average_daily: totalProduction / 30
    },
    idle_summary: {
      total_idle_hours: totalIdleHours,
      total_idle_minutes: totalIdleMinutes
    },
    machine_status: {
      active_days: 25,
      inactive_days: 5,
      days_without_data: 0,
      active_percentage: 83.33,
      status: 'Operational'
    },
    daily_breakdown: days,
    total_days: 30,
    loaded_days: 30
  };
};

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];

const ProductionHistory = () => {
  const [selectedPlant, setSelectedPlant] = useState('plant1');
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [chartType, setChartType] = useState('bar');
  const [showMachineGrid, setShowMachineGrid] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentDay, setCurrentDay] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMachineDetail, setSelectedMachineDetail] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [loadingMachine, setLoadingMachine] = useState(false);
  const [visibleDays, setVisibleDays] = useState(30);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const canvasRef = useRef(null);
  const chartContainerRef = useRef(null);
  
  // State for API data
  const [loading, setLoading] = useState(true);
  const [plantData, setPlantData] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [machineWiseData, setMachineWiseData] = useState([]);
  const [machineAnalysisCache, setMachineAnalysisCache] = useState({});
  const [dateRange, setDateRange] = useState(null);
  const [realtimeData, setRealtimeData] = useState(null);
  const [apiError, setApiError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Generate dynamic years
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 3; i <= currentYear + 3; i++) {
    years.push(i.toString());
  }

  // ============================================
  // API CALLS WITH PROPER ERROR HANDLING
  // ============================================
  
  const fetchPlantTotals = useCallback(async () => {
    try {
      const response = await apiClient.get('/plant-wise-total/');
      setPlantData(response.data);
      setApiError(false);
      setErrorMessage('');
      return response.data;
    } catch (error) {
      console.error('Error fetching plant totals:', error);
      setApiError(true);
      setErrorMessage(error.response?.data?.error || error.message);
      // Return sample data for demo
      return {
        plant1: { total_production: 1250000, machine_count: 57 },
        plant2: { total_production: 980000, machine_count: 49 },
        combined_total: 2230000
      };
    }
  }, []);
  
  const fetchMonthlySummary = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/monthly-summary/', {
        params: {
          plant: selectedPlant,
          month: selectedMonth,
          year: selectedYear
        }
      });
      
      if (response.data && response.data.daily_breakdown) {
        // Transform data for charts
        const chartData = response.data.daily_breakdown.map(day => ({
          name: `Day ${day.day}`,
          production: day.production || 0,
          idle: day.idle_minutes || 0,
          shutdown: day.has_data === false ? 100 : 0
        }));
        
        setMonthlyData(chartData);
        setMonthlySummary({
          month_name: response.data.month_name,
          summary: response.data.summary || {
            total_production: response.data.total_production,
            total_idle_hours: response.data.total_idle_hours,
            days_with_data: response.data.days_with_data,
            days_in_month: response.data.days_in_month,
            coverage: response.data.coverage
          }
        });
        setApiError(false);
        setErrorMessage('');
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Error fetching monthly summary:', error);
      setApiError(true);
      setErrorMessage(error.response?.data?.error || error.message);
      
      // Use sample data as fallback
      const sampleData = generateSampleData();
      setMonthlyData(sampleData);
      setMonthlySummary({
        month_name: monthNames[selectedMonth - 1],
        summary: {
          total_production: sampleData.reduce((sum, d) => sum + d.production, 0),
          total_idle_hours: Math.round(sampleData.reduce((sum, d) => sum + d.idle, 0) / 60),
          days_with_data: 30,
          days_in_month: 30,
          coverage: 100
        }
      });
    } finally {
      setLoading(false);
    }
  }, [selectedPlant, selectedMonth, selectedYear]);
  
  const fetchDateRange = useCallback(async () => {
    try {
      const response = await apiClient.get('/date-range/', {
        params: { plant: selectedPlant }
      });
      setDateRange(response.data);
    } catch (error) {
      console.error('Error fetching date range:', error);
      // Set fallback date range
      setDateRange({
        first_date: '2024-01-01',
        last_date: new Date().toISOString().split('T')[0],
        date_range: '2024-01-01 to present'
      });
    }
  }, [selectedPlant]);
  
  const fetchRealtimeDashboard = useCallback(async () => {
    try {
      const response = await apiClient.get('/realtime-dashboard/', {
        params: { plant: selectedPlant }
      });
      setRealtimeData(response.data);
    } catch (error) {
      console.error('Error fetching realtime dashboard:', error);
      // Set fallback realtime data
      setRealtimeData({
        plant: selectedPlant,
        date: new Date().toISOString().split('T')[0],
        summary: {
          total_production: 12450,
          total_idle_minutes: 320,
          total_idle_hours: 5.33,
          active_machines: 42,
          producing_machines: 38,
          total_machines: selectedPlant === 'plant1' ? 57 : 49
        }
      });
    }
  }, [selectedPlant]);
  
  const fetchMachineAnalysis = useCallback(async (machineNo) => {
    const cacheKey = `${machineNo}-${selectedMonth}-${selectedYear}`;
    
    // Check cache first
    if (machineAnalysisCache[cacheKey]) {
      return machineAnalysisCache[cacheKey];
    }
    
    setLoadingMachine(true);
    
    try {
      const response = await apiClient.get('/machine-analysis/', {
        params: {
          plant: selectedPlant,
          machine_no: machineNo,
          month: selectedMonth,
          year: selectedYear
        }
      });
      
      if (response.data) {
        // Store in cache
        setMachineAnalysisCache(prev => ({
          ...prev,
          [cacheKey]: response.data
        }));
        return response.data;
      } else {
        throw new Error('No data received');
      }
    } catch (error) {
      console.error(`Error fetching machine ${machineNo} analysis:`, error);
      // Return sample data as fallback
      const sampleData = generateSampleMachineData(machineNo, selectedMonth, selectedYear);
      setMachineAnalysisCache(prev => ({
        ...prev,
        [cacheKey]: sampleData
      }));
      return sampleData;
    } finally {
      setLoadingMachine(false);
    }
  }, [selectedPlant, selectedMonth, selectedYear, machineAnalysisCache]);
  
  const fetchMachineWiseData = useCallback(async () => {
    try {
      const response = await apiClient.get('/machine-wise/', {
        params: {
          plant: selectedPlant,
          month: selectedMonth,
          year: selectedYear
        }
      });
      setMachineWiseData(response.data.machines || []);
    } catch (error) {
      console.error('Error fetching machine-wise data:', error);
      // Generate sample machine-wise data
      const machineCount = selectedPlant === 'plant1' ? 57 : 49;
      const sampleMachines = Array.from({ length: machineCount }, (_, i) => ({
        machine_no: i + 1,
        total_production: Math.floor(Math.random() * 10000),
        total_idle_hours: Math.random() * 100,
        active_days: Math.floor(Math.random() * 30),
        active_percentage: Math.random() * 100,
        status: Math.random() > 0.2 ? 'Active' : 'Inactive'
      }));
      setMachineWiseData(sampleMachines);
    }
  }, [selectedPlant, selectedMonth, selectedYear]);
  
  // Load all data when filters change
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchPlantTotals(),
        fetchMonthlySummary(),
        fetchDateRange(),
        fetchRealtimeDashboard(),
        fetchMachineWiseData()
      ]);
      setLoading(false);
      setSelectedMachine(null);
      setSelectedMachineDetail(null);
      setVisibleDays(30);
    };
    
    loadAllData();
  }, [selectedPlant, selectedMonth, selectedYear, fetchPlantTotals, fetchMonthlySummary, fetchDateRange, fetchRealtimeDashboard, fetchMachineWiseData]);
  
  // Auto-refresh realtime data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRealtimeDashboard();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchRealtimeDashboard]);
  
  const getMachineCount = useCallback(() => {
    if (plantData && plantData[selectedPlant]) {
      return plantData[selectedPlant].machine_count;
    }
    return selectedPlant === 'plant1' ? 57 : 49;
  }, [selectedPlant, plantData]);
  
  const selectMachine = useCallback(async (machineNumber) => {
    if (selectedMachine === machineNumber) {
      // Deselect machine
      setSelectedMachine(null);
      setSelectedMachineDetail(null);
      setVisibleDays(30);
      await fetchMonthlySummary();
    } else {
      // Select new machine
      setSelectedMachine(machineNumber);
      const analysis = await fetchMachineAnalysis(machineNumber);
      if (analysis) {
        setSelectedMachineDetail(analysis);
        setVisibleDays(analysis.total_days || 30);
        
        if (analysis.daily_breakdown && analysis.daily_breakdown.length > 0) {
          const chartData = analysis.daily_breakdown.map(day => ({
            name: `Day ${day.day}`,
            production: day.production || 0,
            idle: day.idle_minutes || 0,
            shutdown: day.has_data === false ? 100 : 0
          }));
          setMonthlyData(chartData);
        }
      }
    }
  }, [selectedMachine, fetchMachineAnalysis, fetchMonthlySummary]);
  
  const clearMachine = useCallback(async () => {
    setSelectedMachine(null);
    setSelectedMachineDetail(null);
    setVisibleDays(30);
    await fetchMonthlySummary();
  }, [fetchMonthlySummary]);
  
  const startAnimation = useCallback(() => {
    setIsAnimating(true);
    let day = 0;
    const interval = setInterval(() => {
      if (day < monthlyData.length) {
        setCurrentDay(day);
        day++;
      } else {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [monthlyData.length]);
  
  const stopAnimation = useCallback(() => {
    setIsAnimating(false);
    setCurrentDay(0);
  }, []);
  
  // Time updater
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Mouse move tracker
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Canvas animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let particles = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = `hsl(${200 + Math.random() * 60}, 70%, 50%)`;
        this.opacity = Math.random() * 0.5 + 0.2;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
      
      draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
      }
    }
    
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle());
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  const getChartTitle = useMemo(() => {
    if (selectedMachine && selectedMachineDetail) {
      return `${selectedMachineDetail.machine_info.machine_id} - Daily Production (${selectedMachineDetail.machine_info.month_name} ${selectedYear})`;
    }
    return `${monthNames[selectedMonth - 1]} ${selectedYear} - Overall Plant Production`;
  }, [selectedMachine, selectedMachineDetail, selectedYear, selectedMonth]);
  
  const formattedTime = currentTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: true 
  });
  
  const chartData = useMemo(() => {
    if (selectedMachine && selectedMachineDetail && selectedMachineDetail.daily_breakdown) {
      return selectedMachineDetail.daily_breakdown.map(day => ({
        name: `Day ${day.day}`,
        production: day.production || 0,
        idle: day.idle_minutes || 0,
        shutdown: day.has_data === false ? 100 : 0
      }));
    }
    return monthlyData;
  }, [monthlyData, selectedMachine, selectedMachineDetail]);
  
  const renderChart = useCallback(() => {
    if (!chartData || chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-gray-400 mb-2">No data available</div>
            <div className="text-xs text-gray-500">Please check your API connection or select different filters</div>
            {apiError && (
              <div className="text-xs text-red-400 mt-2">
                API Error: {errorMessage}
              </div>
            )}
          </div>
        </div>
      );
    }
    
    const isMobile = window.innerWidth < 640;
    const commonProps = {
      data: chartData,
      margin: isMobile
        ? { top: 8, right: 4, left: -16, bottom: 0 }
        : { top: 20, right: 30, left: 20, bottom: 5 }
    };
    
    if (loading || loadingMachine) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Loader className="animate-spin text-blue-400 mx-auto mb-2" size={32} />
            <div className="text-gray-400">Loading data...</div>
          </div>
        </div>
      );
    }
    
    switch(chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} interval={Math.floor(chartData.length / 5)} />
            <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #3b82f6', borderRadius: '8px' }}
              formatter={(value, name) => {
                if (name === 'production') return [value, 'Production (units)'];
                if (name === 'idle') return [value, 'Idle (minutes)'];
                if (name === 'shutdown') return [value, 'Shutdown (hours)'];
                return [value, name];
              }}
            />
            <Line type="monotone" dataKey="production" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 3 }} />
            <Line type="monotone" dataKey="idle" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} />
            <Line type="monotone" dataKey="shutdown" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 3 }} />
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
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} interval={Math.floor(chartData.length / 5)} />
            <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #3b82f6', borderRadius: '8px' }}
              formatter={(value, name) => {
                if (name === 'production') return [value, 'Production (units)'];
                if (name === 'idle') return [value, 'Idle (minutes)'];
                if (name === 'shutdown') return [value, 'Shutdown (hours)'];
                return [value, name];
              }}
            />
            <Area type="monotone" dataKey="production" stroke="#10b981" fill="url(#productionGradient)" />
            <Area type="monotone" dataKey="idle" stroke="#f59e0b" fill="url(#idleGradient)" />
            <Area type="monotone" dataKey="shutdown" stroke="#ef4444" fill="url(#shutdownGradient)" />
          </AreaChart>
        );
      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} interval={Math.floor(chartData.length / 5)} />
            <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #3b82f6', borderRadius: '8px' }}
              formatter={(value, name) => {
                if (name === 'production') return [value, 'Production (units)'];
                if (name === 'idle') return [value, 'Idle (minutes)'];
                if (name === 'shutdown') return [value, 'Shutdown (hours)'];
                return [value, name];
              }}
            />
            <Bar dataKey="production" fill="#10b981" radius={[4, 4, 0, 0]} barSize={Math.max(20, Math.min(40, 800 / chartData.length))} />
            <Bar dataKey="idle" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={Math.max(20, Math.min(40, 800 / chartData.length))} />
            <Bar dataKey="shutdown" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={Math.max(20, Math.min(40, 800 / chartData.length))} />
          </BarChart>
        );
    }
  }, [chartData, chartType, loading, loadingMachine, apiError, errorMessage]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      
      {/* Canvas Particle System */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.3 }}
      />
      
      <div className="w-full max-w-[1600px] mx-auto p-2 sm:p-4 lg:p-6 relative z-10">
        {/* Header */}
        <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl mb-3 sm:mb-6 p-3 sm:p-5 shadow-2xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 shadow-lg animate-pulse" />
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500 shadow-lg animate-pulse delay-100" />
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 shadow-lg animate-pulse delay-200" />
                </div>
                <div className="flex items-center gap-2">
                  <Terminal size={12} className="text-blue-400" />
                  {/* <span className="text-[10px] sm:text-xs text-gray-400 font-mono">production@dashboard:~/system$</span> */}
                </div>
              </div>
              <button 
                onClick={() => fetchRealtimeDashboard()}
                className="flex items-center gap-2 px-2 sm:px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-lg text-[10px] sm:text-xs text-blue-400 hover:bg-blue-500/20 transition-all font-mono"
              >
                <RefreshCw size={12} /> REFRESH
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                PRODUCTION HISTORY
              </span>
              <span className="text-gray-300 ml-2 sm:ml-3">& ANALYSIS</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-2 font-mono flex flex-wrap items-center gap-2">
              <Activity size={14} /> CONSOLE VIEW · REAL-TIME MONITORING SYSTEM
              {dateRange && dateRange.first_date && (
                <span className="text-[10px] sm:text-xs text-blue-400 ml-0 sm:ml-2">
                  Data from {new Date(dateRange.first_date).toLocaleDateString()} to {new Date(dateRange.last_date).toLocaleDateString()}
                </span>
              )}
              {apiError && (
                <span className="text-[10px] sm:text-xs text-yellow-400 ml-0 sm:ml-2">
                  ⚠️ Using demo data (API connection issue: {errorMessage})
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:flex-nowrap gap-3 sm:gap-4 lg:gap-6">
          
          {/* LEFT SIDEBAR */}
          <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 space-y-3 sm:space-y-4 lg:space-y-6">
            <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-white/5 px-3 sm:px-5 py-2 sm:py-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-blue-400" />
                  <h2 className="text-[10px] sm:text-xs font-mono font-semibold text-gray-300 tracking-wider">FILTERS & PARAMETERS</h2>
                </div>
              </div>
              
              <div className="p-3 sm:p-5 space-y-3 sm:space-y-6">
                {/* TIME PERIOD */}
                <div>
                  <label className="text-[10px] sm:text-[11px] font-mono text-gray-400 block mb-2 flex items-center gap-2">
                    <Calendar size={12} /> TIME PERIOD
                  </label>
                  
                  <div className="mb-2">
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                      className="w-full bg-black/30 backdrop-blur border border-white/10 rounded-lg px-3 py-2 text-xs sm:text-sm text-gray-300 font-mono focus:border-blue-500 focus:outline-none mb-2"
                    >
                      {monthNames.map((month, idx) => (
                        <option key={month} value={idx + 1}>{month}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="flex-1 bg-black/30 backdrop-blur border border-white/10 rounded-lg px-3 py-2 text-xs sm:text-sm text-gray-300 font-mono focus:border-blue-500 focus:outline-none"
                    >
                      {years.map(year => (
                        <option key={year} value={year}>
                          {year} {parseInt(year) === currentYear ? '(Current)' : parseInt(year) < currentYear ? '(Past)' : '(Upcoming)'}
                        </option>
                      ))}
                    </select>
                    <div className="text-[10px] text-gray-500 font-mono flex items-center">
                      <Clock size={10} className="mr-1" />
                      {monthNames[selectedMonth - 1]} {selectedYear}
                    </div>
                  </div>
                </div>

                {/* PLANT SELECTION */}
                <div>
                  <label className="text-[10px] sm:text-[11px] font-mono text-gray-400 block mb-2 flex items-center gap-2">
                    <Factory size={12} /> PLANT SELECTION
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setSelectedPlant('plant1');
                        setSelectedMachine(null);
                        setSelectedMachineDetail(null);
                        setVisibleDays(30);
                      }}
                      className={`flex items-center justify-center gap-2 py-2 rounded-xl border transition-all duration-300 font-mono text-xs sm:text-sm ${
                        selectedPlant === 'plant1'
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/10'
                          : 'border-white/10 text-gray-400 hover:border-blue-500/50 hover:bg-white/5'
                      }`}
                    >
                      <Cpu size={14} /> Plant 1
                      {plantData && plantData.plant1 && (
                        <span className="text-[9px] ml-1">({plantData.plant1.machine_count} machines)</span>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPlant('plant2');
                        setSelectedMachine(null);
                        setSelectedMachineDetail(null);
                        setVisibleDays(30);
                      }}
                      className={`flex items-center justify-center gap-2 py-2 rounded-xl border transition-all duration-300 font-mono text-xs sm:text-sm ${
                        selectedPlant === 'plant2'
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/10'
                          : 'border-white/10 text-gray-400 hover:border-blue-500/50 hover:bg-white/5'
                      }`}
                    >
                      <Zap size={14} /> Plant 2
                      {plantData && plantData.plant2 && (
                        <span className="text-[9px] ml-1">({plantData.plant2.machine_count} machines)</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* MACHINE SELECTION */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] sm:text-[11px] font-mono text-gray-400 flex items-center gap-2">
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
                      <div className="text-[9px] sm:text-[10px] text-gray-500 mb-2 font-mono">
                        {selectedPlant === 'plant1' ? 'Plant 1' : 'Plant 2'} Machines - Click machine for details
                      </div>
                      <div className="grid grid-cols-5 gap-1.5 max-h-[240px] overflow-y-auto custom-scrollbar">
                        {Array.from({ length: getMachineCount() }, (_, i) => i + 1).map((num) => (
                          <button
                            key={num}
                            onClick={() => selectMachine(num)}
                            className={`aspect-square flex items-center justify-center text-[10px] sm:text-xs font-mono rounded-lg transition-all cursor-pointer ${
                              selectedMachine === num
                                ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-bold shadow-lg ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900'
                                : 'bg-black/30 border border-white/10 text-gray-400 hover:border-blue-500/50 hover:text-blue-400'
                            }`}
                            title={`Click to view details for Machine ${num}`}
                          >
                            {String(num).padStart(2, '0')}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <button onClick={clearMachine} className="text-[9px] sm:text-[10px] text-gray-400 border border-white/10 px-3 py-1 rounded-lg hover:border-red-500/50 hover:text-red-400 transition-all font-mono">
                          CLEAR SELECTION
                        </button>
                        <div className="text-[9px] sm:text-[10px] text-blue-400 ml-auto font-mono">
                          {selectedMachine ? `SELECTED: MACHINE ${String(selectedMachine).padStart(2, '0')}` : 'NO MACHINE SELECTED'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center gap-2 text-blue-400 mb-4">
                <Monitor size={14} />
                <span className="text-[10px] sm:text-xs font-mono font-semibold">SYSTEM STATUS</span>
              </div>
              <div className="space-y-3 text-[10px] sm:text-xs font-mono">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-gray-500">DATA STREAM</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {apiError ? 'DEMO MODE' : 'ACTIVE'}
                  </span>
                </div>
                {realtimeData && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">TODAY'S PRODUCTION</span>
                      <span className="text-gray-300">{realtimeData.summary?.total_production?.toLocaleString() || 'N/A'} units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">ACTIVE MACHINES</span>
                      <span className="text-gray-300">{realtimeData.summary?.active_machines || 0}/{realtimeData.summary?.total_machines || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">PRODUCING MACHINES</span>
                      <span className="text-gray-300">{realtimeData.summary?.producing_machines || 0}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">LAST SYNC</span>
                  <span className="text-gray-300">{formattedTime}</span>
                </div>
                {selectedMachine && selectedMachineDetail && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">LOADED DAYS</span>
                    <span className="text-gray-300">{selectedMachineDetail.loaded_days}/{selectedMachineDetail.total_days || 30}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0 space-y-3 sm:space-y-4 lg:space-y-6">
            {/* Chart Type Selector */}
            <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-2 sm:p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] sm:text-xs text-gray-400 font-mono">CHART VIEW:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setChartType('bar')}
                      className={`p-1.5 sm:p-2 rounded-lg transition-all ${chartType === 'bar' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      <BarChartIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                    <button
                      onClick={() => setChartType('line')}
                      className={`p-1.5 sm:p-2 rounded-lg transition-all ${chartType === 'line' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      <LineChartIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                    <button
                      onClick={() => setChartType('area')}
                      className={`p-1.5 sm:p-2 rounded-lg transition-all ${chartType === 'area' ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      <AreaChartIcon size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={startAnimation}
                    className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500/10 border border-blue-500/30 rounded-xl text-[10px] sm:text-xs text-blue-400 hover:bg-blue-500/20 transition-all font-mono"
                    disabled={isAnimating}
                  >
                    <Play size={12} /> ANIMATE
                  </button>
                  <button 
                    onClick={stopAnimation}
                    className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-500/10 border border-red-500/30 rounded-xl text-[10px] sm:text-xs text-red-400 hover:bg-red-500/20 transition-all font-mono"
                  >
                    <Square size={12} /> STOP
                  </button>
                </div>
              </div>
            </div>

            {/* Chart Card */}
            <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl relative">
              <div className="px-3 sm:px-6 pt-3 sm:pt-5 pb-2 sm:pb-3 border-b border-white/10 bg-white/5">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold flex flex-wrap items-center gap-2">
                    <BarChart3 size={16} className="sm:w-[18px] sm:h-[18px] text-blue-400" />
                    <span className="text-gray-200 text-sm sm:text-base">
                      {selectedMachine && selectedMachineDetail 
                        ? `MACHINE ${selectedMachineDetail.machine_info.machine_id} PRODUCTION HISTORY`
                        : 'OVERALL PLANT PRODUCTION HISTORY'}
                    </span>
                  </h3>
                  <p className="text-[9px] sm:text-[10px] text-gray-500 mt-1 font-mono">
                    {getChartTitle} · Showing {chartData.length} days with data
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 sm:gap-6 mt-3 sm:mt-4 text-[10px] sm:text-xs font-mono">
                  <span className="flex items-center gap-2 text-emerald-400">
                    <span className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-500 rounded-sm shadow-lg"></span> 
                    Production Output (units)
                  </span>
                  <span className="flex items-center gap-2 text-amber-400">
                    <span className="w-2 h-2 sm:w-3 sm:h-3 bg-amber-500 rounded-sm"></span> 
                    Idle State (minutes)
                  </span>
                  <span className="flex items-center gap-2 text-red-400">
                    <span className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-sm"></span> 
                    No Data / Shutdown
                  </span>
                </div>
              </div>
              
              <div className="p-2 sm:p-4 h-[260px] sm:h-[380px] lg:h-[450px] w-full" ref={chartContainerRef}>
                <ResponsiveContainer width="100%" height="100%">
                  {renderChart()}
                </ResponsiveContainer>
              </div>
              {isAnimating && (
                <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-500/90 backdrop-blur text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-mono shadow-lg animate-bounce">
                  <Play size={10} className="inline mr-1" /> ANIMATING DAY {currentDay + 1}/{chartData.length}
                </div>
              )}
            </div>

            {/* MONTHLY SUMMARY CARDS - Always Visible */}
            {monthlySummary && !selectedMachine && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
                <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-[10px] sm:text-[11px] text-gray-400 font-mono flex items-center gap-2">
                        <Calendar size={12} className="text-emerald-400" />
                        MONTHLY PRODUCTION
                      </p>
                      <p className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent mt-2">
                        {monthlySummary.summary?.total_production?.toLocaleString() || 0}
                      </p>
                    </div>
                    <Gauge size={28} className="sm:w-8 sm:h-8 text-emerald-500/50" />
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-emerald-400/70 mt-2 font-mono">
                    Total units produced in {monthNames[selectedMonth - 1]} {selectedYear}
                  </p>
                </div>

                <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-[10px] sm:text-[11px] text-gray-400 font-mono flex items-center gap-2">
                        <Clock size={12} className="text-amber-400" />
                        MONTHLY IDLE
                      </p>
                      <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-amber-400 mt-2">
                        {monthlySummary.summary?.total_idle_hours?.toLocaleString() || 0} hrs
                      </p>
                    </div>
                    <Activity size={28} className="sm:w-8 sm:h-8 text-amber-500/50" />
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-amber-400/70 mt-2 font-mono">
                    Total idle hours in {monthNames[selectedMonth - 1]} {selectedYear}
                  </p>
                </div>

                <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-[10px] sm:text-[11px] text-gray-400 font-mono flex items-center gap-2">
                        <AlertTriangle size={12} className="text-cyan-400" />
                        DATA COVERAGE
                      </p>
                      <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-400 mt-2">
                        {Math.round(monthlySummary.summary?.coverage || 0)}%
                      </p>
                    </div>
                    <TrendingUp size={28} className="sm:w-8 sm:h-8 text-cyan-500/50" />
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-cyan-400/70 mt-2 font-mono">
                    {monthlySummary.summary?.days_with_data || 0}/{monthlySummary.summary?.days_in_month || 30} days with data
                  </p>
                </div>
              </div>
            )}

            {/* MACHINE SPECIFIC DETAILS - Only when machine is selected */}
            {selectedMachine && selectedMachineDetail && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Info size={14} className="sm:w-4 sm:h-4 text-blue-400" />
                    <span className="text-[10px] sm:text-xs text-blue-400 font-mono">
                      MACHINE {selectedMachineDetail.machine_info.machine_id} - {selectedMachineDetail.machine_info.month_name} {selectedYear} · All {selectedMachineDetail.total_days} Days
                    </span>
                  </div>
                  <button 
                    onClick={clearMachine}
                    className="text-[10px] sm:text-xs text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1"
                  >
                    <X size={12} /> Close Machine View
                  </button>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
                  {/* Production Card */}
                  <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-[10px] sm:text-[11px] text-gray-400 font-mono flex items-center gap-2">
                          <Calendar size={12} className="text-emerald-400" />
                          Total Production
                        </p>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent mt-2">
                          {selectedMachineDetail.production_summary.total_production.toLocaleString()}
                        </p>
                      </div>
                      <Gauge size={24} className="sm:w-7 sm:h-7 text-emerald-500/50" />
                    </div>
                    <p className="text-[9px] sm:text-[10px] text-emerald-400/70 mt-2 font-mono">
                      units · all {selectedMachineDetail.total_days} days
                    </p>
                  </div>
                  
                  {/* Idle Card */}
                  <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-[10px] sm:text-[11px] text-gray-400 font-mono flex items-center gap-2">
                          <Clock size={12} className="text-amber-400" />
                          Total Idle
                        </p>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-400 mt-2">
                          {selectedMachineDetail.idle_summary.total_idle_hours.toFixed(1)} hrs
                        </p>
                      </div>
                      <Activity size={24} className="sm:w-7 sm:h-7 text-amber-500/50" />
                    </div>
                    <p className="text-[9px] sm:text-[10px] text-amber-400/70 mt-2 font-mono">
                      hours · all {selectedMachineDetail.total_days} days
                    </p>
                  </div>
                  
                  {/* Active Days Card */}
                  <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-[10px] sm:text-[11px] text-gray-400 font-mono flex items-center gap-2">
                          <Activity size={12} className="text-green-400" />
                          Active Days
                        </p>
                        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-400 mt-2">
                          {selectedMachineDetail.machine_status.active_days} / {selectedMachineDetail.machine_info.days_in_month}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg sm:text-xl font-bold text-green-400">
                          {selectedMachineDetail.machine_status.active_percentage}%
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 h-1.5 sm:h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full" 
                        style={{ width: `${selectedMachineDetail.machine_status.active_percentage}%` }} 
                      />
                    </div>
                  </div>
                  
                  {/* Status Card */}
                  <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-[10px] sm:text-[11px] text-gray-400 font-mono flex items-center gap-2">
                          <Monitor size={12} className="text-cyan-400" />
                          Status
                        </p>
                        <p className="text-lg sm:text-xl font-bold text-cyan-400 mt-2">
                          {selectedMachineDetail.machine_status.status}
                        </p>
                      </div>
                    </div>
                    <p className="text-[9px] sm:text-[10px] text-cyan-400/70 mt-2 font-mono">
                      Operational
                    </p>
                  </div>
                </div>
                
                {/* Status Breakdown Bar */}
                <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4">
                  <p className="text-[9px] sm:text-[10px] text-gray-400 font-mono mb-2">MACHINE STATUS BREAKDOWN - {selectedMachineDetail.machine_info.month_name} (All {selectedMachineDetail.total_days} Days)</p>
                  <div className="flex h-3 sm:h-4 rounded-full overflow-hidden">
                    <div 
                      className="bg-green-500 h-full"
                      style={{ width: `${selectedMachineDetail.machine_status.active_percentage}%` }}
                      title={`Active: ${selectedMachineDetail.machine_status.active_days} days`}
                    />
                    <div 
                      className="bg-red-500 h-full"
                      style={{ width: `${100 - selectedMachineDetail.machine_status.active_percentage}%` }}
                      title={`Inactive: ${selectedMachineDetail.machine_status.inactive_days} days`}
                    />
                  </div>
                  <div className="flex flex-wrap justify-between mt-2 text-[8px] sm:text-[9px] gap-2">
                    <span className="text-green-400">Active: {selectedMachineDetail.machine_status.active_days} days ({selectedMachineDetail.machine_status.active_percentage}%)</span>
                    <span className="text-red-400">Inactive: {selectedMachineDetail.machine_status.inactive_days} days ({100 - selectedMachineDetail.machine_status.active_percentage}%)</span>
                  </div>
                  {selectedMachineDetail.machine_status.days_without_data > 0 && (
                    <div className="mt-2 text-[8px] sm:text-[9px] text-yellow-500">
                      ⚠️ {selectedMachineDetail.machine_status.days_without_data} days without data
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Console Footer */}
            <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-lg sm:rounded-xl p-2 sm:p-4">
              <div className="flex flex-wrap justify-between items-center text-[9px] sm:text-[10px] font-mono gap-2">
                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Power size={10} className="animate-pulse" />
                    LIVE MONITORING
                  </span>
                  <span className="text-gray-500 flex items-center gap-1">
                    <Server size={10} />
                    {selectedMachine ? `MACHINE ${String(selectedMachine).padStart(2, '0')}` : `OVERALL ${selectedPlant === 'plant1' ? 'PLANT 1' : 'PLANT 2'}`}
                  </span>
                  <span className="text-gray-500 flex items-center gap-1">
                    <Factory size={10} />
                    {selectedPlant === 'plant1' ? 'Plant 1' : 'Plant 2'}
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
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 4px; }
        * { scrollbar-width: thin; scrollbar-color: #3b82f6 rgba(255,255,255,0.05); }
      `}</style>
    </div>
  );
};

export default ProductionHistory;