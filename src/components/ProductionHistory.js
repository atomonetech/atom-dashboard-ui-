import React, { useState, useEffect, useRef } from 'react';
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
  Info, Eye, RefreshCw
} from 'lucide-react';

// API Base URL
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Helper function to convert minutes to hours
const convertMinutesToHours = (minutes) => {
  if (!minutes) return 0;
  const hours = minutes / 60;
  return Math.round(hours * 100) / 100;
};

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

// Generate sample machine data
const generateSampleMachineData = (machineNumber) => {
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
  
  return {
    machine_info: {
      machine_no: machineNumber,
      machine_id: `M-${String(machineNumber).padStart(2, '0')}`,
      month_name: 'March',
      days_in_month: 30
    },
    production_summary: {
      total_production: days.reduce((sum, d) => sum + d.production, 0),
      average_daily: days.reduce((sum, d) => sum + d.production, 0) / 30
    },
    idle_summary: {
      total_idle_hours: days.reduce((sum, d) => sum + d.idle_hours, 0),
      total_idle_minutes: days.reduce((sum, d) => sum + d.idle_minutes, 0)
    },
    machine_status: {
      active_days: 25,
      inactive_days: 5,
      days_without_data: 0,
      active_percentage: 83.33,
      status: 'Operational'
    },
    daily_breakdown: days
  };
};

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
  const [showMachineModal, setShowMachineModal] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  
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

  // Month names
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  
  // Generate dynamic years
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 3; i <= currentYear + 3; i++) {
    years.push(i.toString());
  }

  // ============================================
  // API CALLS WITH ERROR HANDLING
  // ============================================
  
  const fetchPlantTotals = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/plant-wise-total/`);
      setPlantData(response.data);
      setApiError(false);
    } catch (error) {
      console.error('Error fetching plant totals:', error);
      setApiError(true);
    }
  };
  
  const fetchMonthlySummary = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/monthly-summary/`, {
        params: {
          plant: selectedPlant,
          month: selectedMonth,
          year: selectedYear
        }
      });
      
      console.log('Monthly Summary Response:', response.data);
      
      if (response.data && response.data.daily_breakdown && response.data.daily_breakdown.length > 0) {
        // Transform daily breakdown for chart
        const chartData = response.data.daily_breakdown.map(day => ({
          name: `Day ${day.day}`,
          production: day.production,
          idle: day.idle_minutes || 0,
          shutdown: day.has_data ? 0 : 100
        }));
        
        console.log('Chart Data:', chartData);
        setMonthlyData(chartData);
        setMonthlySummary(response.data);
      } else {
        // Use sample data if API returns empty
        console.warn('No data from API, using sample data');
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
      }
      setApiError(false);
    } catch (error) {
      console.error('Error fetching monthly summary:', error);
      setApiError(true);
      // Use sample data on error
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
    }
  };
  
  const fetchMachineWiseProduction = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/machine-wise/`, {
        params: {
          plant: selectedPlant,
          month: selectedMonth,
          year: selectedYear
        }
      });
      setMachineWiseData(response.data);
    } catch (error) {
      console.error('Error fetching machine wise production:', error);
    }
  };
  
  const fetchDateRange = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/date-range/`, {
        params: { plant: selectedPlant }
      });
      setDateRange(response.data);
    } catch (error) {
      console.error('Error fetching date range:', error);
    }
  };
  
  const fetchRealtimeDashboard = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/realtime-dashboard/`, {
        params: { plant: selectedPlant }
      });
      setRealtimeData(response.data);
    } catch (error) {
      console.error('Error fetching realtime dashboard:', error);
    }
  };
  
  const fetchMachineAnalysis = async (machineNo) => {
    const cacheKey = `${machineNo}-${selectedMonth}-${selectedYear}`;
    
    if (machineAnalysisCache[cacheKey]) {
      return machineAnalysisCache[cacheKey];
    }
    
    try {
      const response = await axios.get(`${API_BASE_URL}/machine-analysis/`, {
        params: {
          plant: selectedPlant,
          machine_no: machineNo,
          month: selectedMonth,
          year: selectedYear
        }
      });
      
      if (response.data && response.data.daily_breakdown) {
        setMachineAnalysisCache(prev => ({
          ...prev,
          [cacheKey]: response.data
        }));
        return response.data;
      } else {
        // Return sample machine data if API returns empty
        const sampleMachineData = generateSampleMachineData(machineNo);
        setMachineAnalysisCache(prev => ({
          ...prev,
          [cacheKey]: sampleMachineData
        }));
        return sampleMachineData;
      }
    } catch (error) {
      console.error(`Error fetching machine ${machineNo} analysis:`, error);
      // Return sample data on error
      const sampleMachineData = generateSampleMachineData(machineNo);
      setMachineAnalysisCache(prev => ({
        ...prev,
        [cacheKey]: sampleMachineData
      }));
      return sampleMachineData;
    }
  };
  
  // Load all data when filters change
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchPlantTotals(),
        fetchMonthlySummary(),
        fetchMachineWiseProduction(),
        fetchDateRange(),
        fetchRealtimeDashboard()
      ]);
      setLoading(false);
      setSelectedMachine(null);
      setSelectedMachineDetail(null);
    };
    
    loadAllData();
  }, [selectedPlant, selectedMonth, selectedYear]);
  
  // Auto-refresh realtime data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRealtimeDashboard();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [selectedPlant]);
  
  const getMachineCount = () => {
    return selectedPlant === 'plant1' ? 57 : 49;
  };
  
  const selectMachine = async (machineNumber) => {
    if (selectedMachine === machineNumber) {
      // Deselect
      setSelectedMachine(null);
      setSelectedMachineDetail(null);
      setShowMachineModal(false);
      // Reload overall plant data
      fetchMonthlySummary();
    } else {
      // Select new machine
      setSelectedMachine(machineNumber);
      setLoading(true);
      const analysis = await fetchMachineAnalysis(machineNumber);
      if (analysis) {
        setSelectedMachineDetail(analysis);
        
        // Transform machine data for chart
        if (analysis.daily_breakdown && analysis.daily_breakdown.length > 0) {
          const chartData = analysis.daily_breakdown.map(day => ({
            name: `Day ${day.day}`,
            production: day.production,
            idle: day.idle_minutes || 0,
            shutdown: day.has_data ? 0 : 100
          }));
          setMonthlyData(chartData);
        }
        
        setShowMachineModal(true);
      }
      setLoading(false);
    }
  };
  
  const clearMachine = () => {
    setSelectedMachine(null);
    setSelectedMachineDetail(null);
    setShowMachineModal(false);
    // Reload overall plant data
    fetchMonthlySummary();
  };
  
  const startAnimation = () => {
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
  };
  
  const stopAnimation = () => {
    setIsAnimating(false);
    setCurrentDay(0);
  };
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Canvas animation
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
        
        particles.forEach(particle => {
          const dx = this.x - particle.x;
          const dy = this.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(particle.x, particle.y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      }
    }
    
    for (let i = 0; i < 80; i++) {
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
  
  const getChartTitle = () => {
    if (selectedMachine && selectedMachineDetail) {
      return `${selectedMachineDetail.machine_info.machine_id} - Daily Production (${selectedMachineDetail.machine_info.month_name} ${selectedYear})`;
    }
    return `${monthNames[selectedMonth - 1]} ${selectedYear} - Overall Plant Production`;
  };
  
  const formattedTime = currentTime.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: true 
  });
  
  const renderChart = () => {
    // Get current data
    let data = monthlyData;
    
    // If machine is selected and has data, use machine data
    if (selectedMachine && selectedMachineDetail && selectedMachineDetail.daily_breakdown) {
      data = selectedMachineDetail.daily_breakdown.map(day => ({
        name: `Day ${day.day}`,
        production: day.production,
        idle: day.idle_minutes || 0,
        shutdown: day.has_data ? 0 : 100
      }));
    }
    
    // Check if data exists and has values
    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-gray-400 mb-2">No data available</div>
            <div className="text-xs text-gray-500">Please check your API connection or select different filters</div>
            {apiError && (
              <div className="text-xs text-red-400 mt-2">
                API connection error. Using sample data for demonstration.
              </div>
            )}
          </div>
        </div>
      );
    }
    
    const commonProps = {
      data: data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };
    
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-gray-400">Loading data...</div>
        </div>
      );
    }
    
    switch(chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} interval={4} />
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
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} interval={4} />
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
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} interval={4} />
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
            <Bar dataKey="production" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
            <Bar dataKey="idle" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={24} />
            <Bar dataKey="shutdown" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={24} />
          </BarChart>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      
      {/* Canvas Particle System */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.4 }}
      />
      
      {/* Advanced SVG Background Layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Layer 1: Animated Grid */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dynamicGrid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#3b82f6" strokeWidth="0.5">
                <animate attributeName="stroke-opacity" values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite" />
              </path>
              <circle cx="30" cy="30" r="1.5" fill="#3b82f6">
                <animate attributeName="r" values="1;2;1" dur="2s" repeatCount="indefinite" />
                <animate attributeName="fill-opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
              </circle>
            </pattern>
            
            {/* Flowing Lines Pattern */}
            <pattern id="flowingLines" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 0 50 L 100 50" stroke="#10b981" strokeWidth="0.3" fill="none" strokeDasharray="5 5">
                <animate attributeName="stroke-dashoffset" values="0;20" dur="2s" repeatCount="indefinite" />
              </path>
              <path d="M 50 0 L 50 100" stroke="#10b981" strokeWidth="0.3" fill="none" strokeDasharray="5 5">
                <animate attributeName="stroke-dashoffset" values="0;20" dur="2s" repeatCount="indefinite" begin="0.5s" />
              </path>
            </pattern>
            
            {/* Hexagonal Pattern */}
            <pattern id="hexagonPattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 40 10 L 70 30 L 70 50 L 40 70 L 10 50 L 10 30 Z" fill="none" stroke="#6366f1" strokeWidth="0.3">
                <animate attributeName="stroke-opacity" values="0.1;0.4;0.1" dur="4s" repeatCount="indefinite" />
              </path>
            </pattern>
            
            {/* Gradient Backgrounds */}
            <radialGradient id="mouseGlow" cx={mousePosition.x / window.innerWidth * 100 + '%'} cy={mousePosition.y / window.innerHeight * 100 + '%'} r="30%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15">
                <animate attributeName="stop-opacity" values="0.1;0.2;0.1" dur="2s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0"/>
            </radialGradient>
            
            <linearGradient id="auroraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.05">
                <animate attributeName="stop-opacity" values="0.05;0.1;0.05" dur="5s" repeatCount="indefinite" />
              </stop>
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.05">
                <animate attributeName="stop-opacity" values="0.05;0.1;0.05" dur="5s" repeatCount="indefinite" begin="1s" />
              </stop>
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05">
                <animate attributeName="stop-opacity" values="0.05;0.1;0.05" dur="5s" repeatCount="indefinite" begin="2s" />
              </stop>
            </linearGradient>
          </defs>
          
          {/* Apply all patterns */}
          <rect width="100%" height="100%" fill="url(#dynamicGrid)" />
          <rect width="100%" height="100%" fill="url(#flowingLines)" />
          <rect width="100%" height="100%" fill="url(#hexagonPattern)" />
          <rect width="100%" height="100%" fill="url(#auroraGradient)" />
          <rect width="100%" height="100%" fill="url(#mouseGlow)" />
        </svg>
        
        {/* Layer 2: Orbiting Particles */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {[...Array(30)].map((_, i) => {
            const angle = (i / 30) * Math.PI * 2;
            const radius = 200 + Math.random() * 300;
            const x = 50 + Math.cos(angle) * (radius / 10);
            const y = 50 + Math.sin(angle) * (radius / 10);
            return (
              <circle
                key={i}
                cx={`${x}%`}
                cy={`${y}%`}
                r="2"
                fill="#3b82f6"
                fillOpacity="0.4"
              >
                <animateMotion
                  dur={`${10 + Math.random() * 10}s`}
                  repeatCount="indefinite"
                  path={`M ${x} ${y} 
                         Q ${x + 20} ${y - 20} ${x + 40} ${y} 
                         T ${x + 80} ${y}
                         T ${x + 40} ${y}
                         T ${x} ${y}`}
                />
                <animate attributeName="fill-opacity" values="0.2;0.6;0.2" dur={`${2 + Math.random() * 3}s`} repeatCount="indefinite" />
                <animate attributeName="r" values="1;2.5;1" dur={`${2 + Math.random() * 2}s`} repeatCount="indefinite" />
              </circle>
            );
          })}
        </svg>
        
        {/* Layer 3: Pulsing Rings */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="ringGradient">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
            </radialGradient>
          </defs>
          {[...Array(8)].map((_, i) => (
            <circle
              key={i}
              cx="50%"
              cy="50%"
              r={100 + i * 80}
              fill="none"
              stroke="url(#ringGradient)"
              strokeWidth="1"
            >
              <animate
                attributeName="r"
                values={`${100 + i * 80};${150 + i * 80};${100 + i * 80}`}
                dur={`${5 + i * 0.5}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-opacity"
                values="0.3;0.1;0.3"
                dur={`${5 + i * 0.5}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </svg>
        
        {/* Layer 4: Data Streams */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {[...Array(20)].map((_, i) => (
            <g key={i}>
              <path
                d={`M ${Math.random() * 100}% ${Math.random() * 100}% 
                    L ${Math.random() * 100}% ${Math.random() * 100}%`}
                stroke="#10b981"
                strokeWidth="0.5"
                strokeDasharray="4 4"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  values="0;20"
                  dur={`${2 + Math.random() * 3}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="stroke-opacity"
                  values="0.1;0.4;0.1"
                  dur={`${3 + Math.random() * 2}s`}
                  repeatCount="indefinite"
                />
              </path>
            </g>
          ))}
        </svg>
        
        {/* Layer 5: Glowing Orbs with Mouse Interaction */}
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl transition-all duration-300"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0) 70%)',
            left: mousePosition.x - 200,
            top: mousePosition.y - 200,
            pointerEvents: 'none'
          }}
        />
        <div 
          className="absolute w-64 h-64 rounded-full blur-2xl transition-all duration-500"
          style={{
            background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0) 70%)',
            left: window.innerWidth - mousePosition.x - 150,
            top: window.innerHeight - mousePosition.y - 150,
            pointerEvents: 'none'
          }}
        />
      </div>
      
      {/* Modal for Machine Details */}
      {showMachineModal && selectedMachineDetail && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-blue-500/30 max-w-2xl w-full p-6 shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-blue-400">{selectedMachineDetail.machine_info.machine_id}</h3>
              <button 
                onClick={() => setShowMachineModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <p className="text-xs text-gray-400 mb-1">Total Production</p>
                  <p className="text-xl font-bold text-emerald-400">{selectedMachineDetail.production_summary.total_production.toLocaleString()} units</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <p className="text-xs text-gray-400 mb-1">Total Idle</p>
                  <p className="text-xl font-bold text-amber-400">{selectedMachineDetail.idle_summary.total_idle_hours.toFixed(1)} hrs</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <p className="text-xs text-gray-400 mb-1">Active Days</p>
                  <p className="text-xl font-bold text-green-400">{selectedMachineDetail.machine_status.active_days} / {selectedMachineDetail.machine_info.days_in_month}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <p className="text-xs text-gray-400 mb-1">Active Rate</p>
                  <p className="text-xl font-bold text-cyan-400">{selectedMachineDetail.machine_status.active_percentage}%</p>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <p className="text-xs text-gray-400 mb-1">Status</p>
                <p className="text-lg font-bold text-cyan-400">{selectedMachineDetail.machine_status.status}</p>
                <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${selectedMachineDetail.machine_status.active_percentage}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto p-6 relative z-10">
        {/* Header */}
        <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl mb-8 p-6 shadow-2xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg animate-pulse" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg animate-pulse delay-100" />
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg animate-pulse delay-200" />
                </div>
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-blue-400" />
                  <span className="text-xs text-gray-400 font-mono">production@dashboard:~/system$</span>
                </div>
              </div>
              <button 
                onClick={() => fetchRealtimeDashboard()}
                className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs text-blue-400 hover:bg-blue-500/20 transition-all font-mono"
              >
                <RefreshCw size={12} /> REFRESH
              </button>
            </div>
            <h1 className="text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                PRODUCTION HISTORY
              </span>
              <span className="text-gray-300 ml-3">& ANALYSIS</span>
            </h1>
            <p className="text-sm text-gray-400 mt-2 font-mono flex items-center gap-2">
              <Activity size={14} /> CONSOLE VIEW · REAL-TIME MONITORING SYSTEM
              {dateRange && dateRange.first_date && (
                <span className="text-xs text-blue-400 ml-2">
                  Data from {new Date(dateRange.first_date).toLocaleDateString()} to {new Date(dateRange.last_date).toLocaleDateString()}
                </span>
              )}
              {apiError && (
                <span className="text-xs text-yellow-400 ml-2">
                  ⚠️ Using demo data (API connection issue)
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-3 space-y-6">
            <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="bg-white/5 px-5 py-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-blue-400" />
                  <h2 className="text-xs font-mono font-semibold text-gray-300 tracking-wider">FILTERS & PARAMETERS</h2>
                </div>
              </div>
              
              <div className="p-5 space-y-6">
                {/* TIME PERIOD */}
                <div>
                  <label className="text-[11px] font-mono text-gray-400 block mb-2 flex items-center gap-2">
                    <Calendar size={12} /> TIME PERIOD
                  </label>
                  
                  <div className="mb-2">
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                      className="w-full bg-black/30 backdrop-blur border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 font-mono focus:border-blue-500 focus:outline-none mb-2"
                    >
                      {monthNames.map((month, idx) => (
                        <option key={month} value={idx + 1}>{month}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex gap-2">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="flex-1 bg-black/30 backdrop-blur border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 font-mono focus:border-blue-500 focus:outline-none"
                    >
                      {years.map(year => (
                        <option key={year} value={year}>
                          {year} {parseInt(year) === currentYear ? '(Current)' : parseInt(year) < currentYear ? '(Past)' : '(Upcoming)'}
                        </option>
                      ))}
                    </select>
                    <div className="text-[11px] text-gray-500 font-mono flex items-center">
                      <Clock size={10} className="mr-1" />
                      {monthNames[selectedMonth - 1]} {selectedYear}
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
                      onClick={() => {
                        setSelectedPlant('plant1');
                        setSelectedMachine(null);
                        setSelectedMachineDetail(null);
                      }}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all duration-300 font-mono text-sm ${
                        selectedPlant === 'plant1'
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/10'
                          : 'border-white/10 text-gray-400 hover:border-blue-500/50 hover:bg-white/5'
                      }`}
                    >
                      <Cpu size={14} /> Plant 1
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPlant('plant2');
                        setSelectedMachine(null);
                        setSelectedMachineDetail(null);
                      }}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all duration-300 font-mono text-sm ${
                        selectedPlant === 'plant2'
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/10'
                          : 'border-white/10 text-gray-400 hover:border-blue-500/50 hover:bg-white/5'
                      }`}
                    >
                      <Zap size={14} /> Plant 2
                    </button>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-2 font-mono">
                    {selectedPlant === 'plant1' ? 'Plant 1' : 'Plant 2'} Machines (1-{getMachineCount()})
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
                        {selectedPlant === 'plant1' ? 'Plant 1' : 'Plant 2'} Machines (1-{getMachineCount()}) - Click machine for details
                      </div>
                      <div className="grid grid-cols-5 gap-1.5 max-h-[240px] overflow-y-auto custom-scrollbar">
                        {Array.from({ length: getMachineCount() }, (_, i) => i + 1).map((num) => (
                          <button
                            key={num}
                            onClick={() => selectMachine(num)}
                            className={`aspect-square flex items-center justify-center text-xs font-mono rounded-lg transition-all cursor-pointer ${
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
                      <div className="flex gap-2 pt-2">
                        <button onClick={clearMachine} className="text-[10px] text-gray-400 border border-white/10 px-3 py-1 rounded-lg hover:border-red-500/50 hover:text-red-400 transition-all font-mono">
                          CLEAR SELECTION
                        </button>
                        <div className="text-[10px] text-blue-400 ml-auto font-mono">
                          {selectedMachine ? `SELECTED: MACHINE ${String(selectedMachine).padStart(2, '0')}` : 'NO MACHINE SELECTED'}
                        </div>
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
                  </>
                )}
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
                </div>
              </div>
            </div>
   {/* sjs */}
            {/* Chart Card */}
            <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-6 pt-5 pb-3 border-b border-white/10 bg-white/5">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <BarChart3 size={18} className="text-blue-400" />
                    <span className="text-gray-200">
                      {selectedMachine && selectedMachineDetail 
                        ? `MACHINE ${selectedMachineDetail.machine_info.machine_id} PRODUCTION HISTORY`
                        : 'OVERALL PLANT PRODUCTION HISTORY'}
                    </span>
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-1 font-mono">
                    {getChartTitle()} · {monthlySummary?.summary?.days_with_data || monthlyData.length}/{monthlySummary?.summary?.days_in_month || 30} days with data
                  </p>
                </div>
                <div className="flex gap-6 mt-4 text-xs font-mono">
                  <span className="flex items-center gap-2 text-emerald-400">
                    <span className="w-3 h-3 bg-emerald-500 rounded-sm shadow-lg"></span> 
                    Production Output (units)
                  </span>
                  <span className="flex items-center gap-2 text-amber-400">
                    <span className="w-3 h-3 bg-amber-500 rounded-sm"></span> 
                    Idle State (minutes)
                  </span>
                  <span className="flex items-center gap-2 text-red-400">
                    <span className="w-3 h-3 bg-red-500 rounded-sm"></span> 
                    Shutdown / No Data
                  </span>
                </div>
              </div>
              
              <div className="p-4 h-[450px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {renderChart()}
                </ResponsiveContainer>
              </div>
              {isAnimating && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-500/90 backdrop-blur text-white px-4 py-2 rounded-full text-xs font-mono shadow-lg animate-bounce">
                  <Play size={10} className="inline mr-1" /> ANIMATING DAY {currentDay + 1}/{monthlyData.length}
                </div>
              )}
            </div>

            MONTHLY SUMMARY CARDS - Always Visible
            {monthlySummary && !selectedMachine && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-emerald-500/30 transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-[11px] text-gray-400 font-mono flex items-center gap-2">
                        <Calendar size={12} className="text-emerald-400" />
                        MONTHLY PRODUCTION
                      </p>
                      <p className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent mt-2">
                        {monthlySummary.summary?.total_production?.toLocaleString() || 0}
                      </p>
                    </div>
                    <Gauge size={32} className="text-emerald-500/50 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <p className="text-[10px] text-emerald-400/70 mt-2 font-mono">
                    Total units produced in {monthNames[selectedMonth - 1]} {selectedYear}
                  </p>
                </div>

                <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-amber-500/30 transition-all group">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-[11px] text-gray-400 font-mono flex items-center gap-2">
                        <Clock size={12} className="text-amber-400" />
                        MONTHLY IDLE
                      </p>
                      <p className="text-4xl font-bold text-amber-400 mt-2">
                        {monthlySummary.summary?.total_idle_hours?.toLocaleString() || 0} hrs
                      </p>
                    </div>
                    <Activity size={32} className="text-amber-500/50 group-hover:text-amber-400 transition-colors" />
                  </div>
                  <p className="text-[10px] text-amber-400/70 mt-2 font-mono">
                    Total idle hours in {monthNames[selectedMonth - 1]} {selectedYear}
                  </p>
                </div>

                <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-cyan-500/30 transition-all group">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-[11px] text-gray-400 font-mono flex items-center gap-2">
                        <AlertTriangle size={12} className="text-cyan-400" />
                        DATA COVERAGE
                      </p>
                      <p className="text-4xl font-bold text-cyan-400 mt-2">
                        {Math.round(monthlySummary.summary?.coverage || 0)}%
                      </p>
                    </div>
                    <TrendingUp size={32} className="text-cyan-500/50 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <p className="text-[10px] text-cyan-400/70 mt-2 font-mono">
                    {monthlySummary.summary?.days_with_data || 0}/{monthlySummary.summary?.days_in_month || 30} days with data
                  </p>
                </div>
              </div>
            )}

            {/* MACHINE SPECIFIC CARDS - Only when machine is selected */}
            {selectedMachine && selectedMachineDetail && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Info size={16} className="text-blue-400" />
                    <span className="text-xs text-blue-400 font-mono">
                      MACHINE {selectedMachineDetail.machine_info.machine_id} - {selectedMachineDetail.machine_info.month_name} {selectedYear}
                    </span>
                  </div>
                  <button 
                    onClick={clearMachine}
                    className="text-xs text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1"
                  >
                    <X size={12} /> Close Machine View
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Production Card */}
                  <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-emerald-500/30 transition-all group">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-[11px] text-gray-400 font-mono flex items-center gap-2">
                          <Calendar size={12} className="text-emerald-400" />
                          MONTHLY PRODUCTION
                        </p>
                        <p className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent mt-2">
                          {selectedMachineDetail.production_summary.total_production.toLocaleString()}
                        </p>
                      </div>
                      <Gauge size={32} className="text-emerald-500/50 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <p className="text-[10px] text-emerald-400/70 mt-2 font-mono">
                      Total units produced in {selectedMachineDetail.machine_info.month_name}
                    </p>
                  </div>
                  
                  {/* Idle Card */}
                  <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-amber-500/30 transition-all group">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-[11px] text-gray-400 font-mono flex items-center gap-2">
                          <Clock size={12} className="text-amber-400" />
                          MONTHLY IDLE
                        </p>
                        <p className="text-4xl font-bold text-amber-400 mt-2">
                          {selectedMachineDetail.idle_summary.total_idle_hours.toFixed(1)} hrs
                        </p>
                      </div>
                      <Activity size={32} className="text-amber-500/50 group-hover:text-amber-400 transition-colors" />
                    </div>
                    <p className="text-[10px] text-amber-400/70 mt-2 font-mono">
                      Total idle hours in {selectedMachineDetail.machine_info.month_name}
                    </p>
                  </div>
                  
                  {/* Status Card */}
                  <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-cyan-500/30 transition-all group">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-[11px] text-gray-400 font-mono flex items-center gap-2">
                          <Activity size={12} className="text-cyan-400" />
                          MACHINE STATUS
                        </p>
                        <p className="text-2xl font-bold text-cyan-400 mt-2">
                          {selectedMachineDetail.machine_status.status}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-cyan-400">
                          {selectedMachineDetail.machine_status.active_percentage}%
                        </div>
                        <div className="text-xs text-gray-500">Active Rate</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-green-500 h-full"
                          style={{ width: `${selectedMachineDetail.machine_status.active_percentage}%` }}
                        />
                        <div 
                          className="bg-red-500 h-full"
                          style={{ width: `${100 - selectedMachineDetail.machine_status.active_percentage}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-gray-500 mt-2 font-mono">
                        Active: {selectedMachineDetail.machine_status.active_days} days · Inactive: {selectedMachineDetail.machine_status.inactive_days} days
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Status Breakdown Bar */}
                <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-[10px] text-gray-400 font-mono mb-2">MACHINE STATUS BREAKDOWN - {selectedMachineDetail.machine_info.month_name}</p>
                  <div className="flex h-4 rounded-full overflow-hidden">
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
                  <div className="flex justify-between mt-2 text-[9px]">
                    <span className="text-green-400">Active: {selectedMachineDetail.machine_status.active_days} days ({selectedMachineDetail.machine_status.active_percentage}%)</span>
                    <span className="text-red-400">Inactive: {selectedMachineDetail.machine_status.inactive_days} days ({100 - selectedMachineDetail.machine_status.active_percentage}%)</span>
                  </div>
                  {selectedMachineDetail.machine_status.days_without_data > 0 && (
                    <div className="mt-2 text-[9px] text-yellow-500">
                      ⚠️ {selectedMachineDetail.machine_status.days_without_data} days without data
                    </div>
                  )}
                </div>
              </div>
            )}

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