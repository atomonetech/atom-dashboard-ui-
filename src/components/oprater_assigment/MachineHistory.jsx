import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import './RemainingScreens.css';

// Image Imports
import snxImg from './images/SNX_PRESS_MACHINE.png';
import isgecImg from './images/ISGEC_PRESS_MACHINE.png';
import aidaImg from './images/AIDA_PRESS_MACHINE.png';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:9000';

const PLANT1_SPECS = {
  1: { company: "SNX", capacity: 63 }, 2: { company: "SNX", capacity: 63 }, 3: { company: "SNX", capacity: 63 }, 4: { company: "SNX", capacity: 63 },
  5: { company: "ISGEC", capacity: 160 }, 6: { company: "ISGEC", capacity: 160 },
  7: { company: "SNX", capacity: 63 }, 8: { company: "SNX", capacity: 63 }, 9: { company: "SNX", capacity: 110 }, 10: { company: "SNX", capacity: 63 },
  11: { company: "SNX", capacity: 110 }, 12: { company: "SNX", capacity: 63 }, 13: { company: "SNX", capacity: 63 }, 14: { company: "SNX", capacity: 63 },
  15: { company: "SNX", capacity: 63 }, 16: { company: "SNX", capacity: 63 }, 17: { company: "SNX", capacity: 110 }, 18: { company: "SNX", capacity: 110 },
  19: { company: "SNX", capacity: 110 }, 20: { company: "SNX", capacity: 110 },
  21: { company: "ISGEC", capacity: 160 }, 22: { company: "ISGEC", capacity: 160 }, 23: { company: "ISGEC", capacity: 160 },
  24: { company: "SNX", capacity: 110 }, 25: { company: "SNX", capacity: 110 },
  26: { company: "ISGEC", capacity: 63 }, 27: { company: "ISGEC", capacity: 63 }, 28: { company: "ISGEC", capacity: 63 }, 29: { company: "ISGEC", capacity: 63 },
  30: { company: "ISGEC", capacity: 63 }, 31: { company: "ISGEC", capacity: 63 }, 32: { company: "ISGEC", capacity: 63 }, 33: { company: "ISGEC", capacity: 63 },
  34: { company: "ISGEC", capacity: 63 }, 35: { company: "ISGEC", capacity: 63 },
  36: { company: "SNX", capacity: 110 }, 37: { company: "SNX", capacity: 110 }, 38: { company: "SNX", capacity: 110 }, 39: { company: "SNX", capacity: 110 },
  40: { company: "ISGEC", capacity: 110 }, 41: { company: "ISGEC", capacity: 110 }, 42: { company: "ISGEC", capacity: 110 }, 43: { company: "ISGEC", capacity: 110 },
  44: { company: "ISGEC", capacity: 110 }, 45: { company: "ISGEC", capacity: 110 },
  46: { company: "ISGEC", capacity: 63 }, 47: { company: "ISGEC", capacity: 63 }, 48: { company: "ISGEC", capacity: 63 }, 49: { company: "ISGEC", capacity: 63 },
  50: { company: "ISGEC", capacity: 110 }, 51: { company: "ISGEC", capacity: 110 }, 52: { company: "ISGEC", capacity: 110 }, 53: { company: "ISGEC", capacity: 110 },
  54: { company: "ISGEC", capacity: 63 }, 55: { company: "ISGEC", capacity: 63 }, 56: { company: "ISGEC", capacity: 63 }, 57: { company: "ISGEC", capacity: 63 }
};

const PLANT2_SPECS = {
  1: { company: "ISGEC", capacity: 160 }, 2: { company: "ISGEC", capacity: 160 }, 3: { company: "ISGEC", capacity: 450 },
  4: { company: "ISGEC", capacity: 300 }, 5: { company: "ISGEC", capacity: 160 }, 6: { company: "ISGEC", capacity: 300 },
  7: { company: "ISGEC", capacity: 300 }, 8: { company: "ISGEC", capacity: 300 }, 9: { company: "ISGEC", capacity: 300 },
  10: { company: "ISGEC", capacity: 160 },
  11: { company: "ISGEC", capacity: 250 }, 12: { company: "ISGEC", capacity: 250 }, 13: { company: "ISGEC", capacity: 250 },
  14: { company: "ISGEC", capacity: 250 }, 15: { company: "ISGEC", capacity: 250 }, 16: { company: "ISGEC", capacity: 250 },
  17: { company: "ISGEC", capacity: 250 }, 18: { company: "ISGEC", capacity: 250 }, 19: { company: "ISGEC", capacity: 250 },
  20: { company: "ISGEC", capacity: 250 },
  21: { company: "AIDA", capacity: 200 }, 22: { company: "AIDA", capacity: 200 }, 23: { company: "AIDA", capacity: 200 },
  24: { company: "AIDA", capacity: 200 }, 25: { company: "AIDA", capacity: 200 }, 26: { company: "AIDA", capacity: 200 },
  27: { company: "AIDA", capacity: 200 }, 28: { company: "AIDA", capacity: 200 }, 29: { company: "AIDA", capacity: 200 },
  30: { company: "AIDA", capacity: 200 }, 31: { company: "AIDA", capacity: 200 }, 32: { company: "AIDA", capacity: 200 },
  33: { company: "AIDA", capacity: 200 }, 34: { company: "AIDA", capacity: 200 }, 35: { company: "AIDA", capacity: 200 },
  36: { company: "AIDA", capacity: 200 }, 37: { company: "AIDA", capacity: 200 }, 38: { company: "AIDA", capacity: 200 },
  39: { company: "AIDA", capacity: 200 }, 40: { company: "AIDA", capacity: 200 },
  41: { company: "ISGEC", capacity: 110 }, 42: { company: "ISGEC", capacity: 110 }, 43: { company: "ISGEC", capacity: 110 },
  44: { company: "ISGEC", capacity: 63 }, 45: { company: "ISGEC", capacity: 63 }, 46: { company: "ISGEC", capacity: 63 }
};

const getMachineSpec = (plantCode, machineNo) => {
  const num = parseInt(String(machineNo).replace(/\D/g, ''), 10);
  if (plantCode === 'plant1') return PLANT1_SPECS[num] || { company: 'N/A', capacity: 'N/A' };
  if (plantCode === 'plant2') return PLANT2_SPECS[num] || { company: 'N/A', capacity: 'N/A' };
  return { company: 'N/A', capacity: 'N/A' };
};

const getCompanyImage = (company) => {
  if (company === 'SNX') return snxImg;
  if (company === 'ISGEC') return isgecImg;
  if (company === 'AIDA') return aidaImg;
  return null;
};

const convertDecimalToMMSS = (decimalMinutes) => {
  if (!decimalMinutes || isNaN(decimalMinutes)) return 0;
  let m = Math.floor(decimalMinutes);
  let s = Math.round((decimalMinutes - m) * 60);
  if (s === 60) {
    m += 1;
    s = 0;
  }
  return parseFloat((m + s / 100).toFixed(2));
};

const formatHourRange = (timeStr) => {
  if (!timeStr) return '--';
  if (timeStr === '8:00' || timeStr === '08:00') return '08:30 - 09:00';
  
  if (timeStr.includes(':')) {
    const hr = parseInt(timeStr.split(':')[0], 10);
    if (!isNaN(hr)) {
      const startHr = hr.toString().padStart(2, '0');
      const endHr = (hr + 1).toString().padStart(2, '0');
      return `${startHr}:00 - ${endHr}:00`;
    }
  }
  return timeStr;
};

const formatChangeTime = (timeStr, selectedDate) => {
  if (!timeStr) return '--:--';
  if (timeStr.includes('AM') || timeStr.includes('PM')) return `${selectedDate} | ${timeStr}`;
  try {
     const d = new Date(timeStr);
     return d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch(e) {
     return `${selectedDate} | ${timeStr}`;
  }
};

export default function MachineHistory() {
  const [plant, setPlant] = useState('plant1');
  const [machineNo, setMachineNo] = useState(2);
  const [shift, setShift] = useState('shiftA');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [chartData, setChartData] = useState([]);
  const [summary, setSummary] = useState({ total_production: 0, active_days: 0 });
  const [keyInsights, setKeyInsights] = useState(null);
  
  const [shutHeightChanges, setShutHeightChanges] = useState([]);
  const [toolChanges, setToolChanges] = useState([]);
  const [onOffEvents, setOnOffEvents] = useState([]);

  const [machineStatus, setMachineStatus] = useState('Offline');
  const [loading, setLoading] = useState(false);

  const spec = getMachineSpec(plant, machineNo);

  const machineOptions = plant === 'plant1' 
    ? Array.from({ length: 57 }, (_, i) => i + 1) 
    : Array.from({ length: 46 }, (_, i) => i + 1);

  useEffect(() => {
    if (plant === 'plant2' && machineNo > 46) {
      setMachineNo(1);
    }
  }, [plant, machineNo]);

  useEffect(() => {
    const fetchMachineAnalysis = async () => {
      setLoading(true);
      try {
        const analysisUrl = `${API_BASE}/api/machine-analysis/?plant=${plant}&machine_no=${machineNo}&date=${selectedDate}&shift=${shift}&period=today`;
        const res = await fetch(analysisUrl);
        
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const data = await res.json();
        
        if (data.success) {
          const breakdown = data.daily_breakdown || [];
          setChartData(breakdown);
          setSummary(data.production_summary || { total_production: 0 });
          setKeyInsights(data.key_insights);
          
          let derivedStatus = 'Offline';
          const activeBlocks = breakdown.filter(b => b.has_data);
          
          if (activeBlocks.length > 0) {
            const lastBlock = activeBlocks[activeBlocks.length - 1];
            if (lastBlock.production > 0) {
              derivedStatus = 'Running';
            } else if (lastBlock.idle_minutes > 0) {
              derivedStatus = 'Idle';
            } else {
              derivedStatus = 'Offline';
            }
          }
          setMachineStatus(derivedStatus);
        } else {
          setChartData([]);
          setSummary({ total_production: 0 });
          setKeyInsights(null);
          setMachineStatus('Offline');
        }

        try {
          const plantNo = plant === 'plant1' ? 1 : 2;
          const shiftVal = shift === 'fullday' ? 'ALL' : shift.replace('shift', '');

          let historyUrl = '';
          if (plantNo === 1) {
            historyUrl = `${API_BASE}/api/plant1-machine-history/?machine_no=${machineNo}&date=${selectedDate}&shift=${shiftVal}`;
          } else {
            historyUrl = `${API_BASE}/api/machine-history/?plant_no=2&machine_no=${machineNo}&date=${selectedDate}&shift=${shiftVal}`;
          }
          
          const historyRes = await fetch(historyUrl);
          
          if (historyRes.ok) {
            const historyData = await historyRes.json();
            
            if (historyData.success && historyData.events) {
               const shc = historyData.events.filter(c => 
                 c.type === 'SHUT_HEIGHT_CHANGE' || c.event_type === 'SHUT_HEIGHT_CHANGE'
               );
               const tc = historyData.events.filter(c => 
                 c.type === 'TOOL_CHANGE' || c.event_type === 'TOOL_CHANGE' || String(c.type).includes('TOOL')
               );
               const onOff = historyData.events.filter(c => 
                 c.type === 'ON' || c.type === 'OFF' || c.event_type === 'ON' || c.event_type === 'OFF'
               );
               
               setShutHeightChanges(shc);
               setToolChanges(tc);
               setOnOffEvents(onOff);
            } else {
               setShutHeightChanges([]);
               setToolChanges([]);
               setOnOffEvents([]);
            }
          }
        } catch(err) {
          console.error("Failed to fetch machine history events", err);
          setShutHeightChanges([]);
          setToolChanges([]);
          setOnOffEvents([]);
        }

      } catch (err) {
        console.error("Failed to fetch machine analysis data", err);
        setChartData([]);
        setSummary({ total_production: 0 });
        setKeyInsights(null);
        setMachineStatus('Offline');
        setShutHeightChanges([]);
        setToolChanges([]);
        setOnOffEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMachineAnalysis();
  }, [plant, machineNo, selectedDate, shift]);

  let currentTotalProd = 0;
  let currentTotalIdle = 0;
  let currentTotalOffline = 0;

  const now = new Date();
  const [selYear, selMonth, selDay] = selectedDate.split('-').map(Number);
  let hasWrapped = false;
  let previousHour = -1;

  const cumulativeChartData = chartData.map((item, index) => {
    let isFuture = false;
    
    if (item.name) {
      const match = String(item.name).match(/^(\d+)/);
      if (match) {
        const blockHour = parseInt(match[1], 10);
        
        if (previousHour !== -1 && blockHour < previousHour && blockHour < 12 && previousHour > 12) {
          hasWrapped = true;
        }
        previousHour = blockHour;
        
        let blockDate = new Date(selYear, selMonth - 1, selDay);
        
        if (hasWrapped || (shift === 'shiftB' && blockHour < 12)) {
          blockDate.setDate(blockDate.getDate() + 1);
        }
        
        blockDate.setHours(blockHour, 0, 0, 0);
        
        if (blockDate > now) {
          isFuture = true;
        }
      }
    }

    if (!isFuture) {
      currentTotalProd += (item.production || 0);
      currentTotalIdle += (item.idle_minutes || 0);
      currentTotalOffline += (item.shutdown_minutes || 0);
    }
    
    return {
      ...item,
      display_name: formatHourRange(item.name),
      cumulative_production: isFuture ? null : currentTotalProd,
      cumulative_idle: isFuture ? null : convertDecimalToMMSS(currentTotalIdle),
      cumulative_offline: isFuture ? null : convertDecimalToMMSS(currentTotalOffline)
    };
  });

  const getStatusColor = (status) => {
    if (status === 'Running') return '#10b981';
    if (status === 'Idle') return '#f59e0b';    
    return '#64748b';
  };
  const statusColor = getStatusColor(machineStatus);

  const totalIdle = chartData.reduce((acc, d) => acc + (d.idle_minutes || 0), 0);
  const totalOffline = keyInsights?.offline_detected?.raw_mins || 0;
  
  const totalIdleFormatted = convertDecimalToMMSS(totalIdle);
  const totalOfflineFormatted = convertDecimalToMMSS(totalOffline);

  const pieData = [
    { name: 'Production', value: summary.total_production || 0, color: '#10b981' },
    { name: 'Online Idle', value: totalIdleFormatted, color: '#f59e0b' },
    { name: 'Offline', value: totalOfflineFormatted, color: '#ef4444' }
  ];

  return (
    <div className="modern-container">
      <style>
        {`
          @media (min-width: 1025px) {
            .four-col-grid {
              grid-template-columns: repeat(4, 1fr) !important;
            }
          }
        `}
      </style>
      
      <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span className="page-badge"></span>
          <h1 className="page-title">Machine History</h1>
        </div>
        
        <div className="header-filters" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select 
            value={plant} 
            onChange={(e) => setPlant(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', background: '#1e293b', color: '#fff', border: '1px solid #334155' }}
          >
            <option value="plant1">Plant 1</option>
            <option value="plant2">Plant 2</option>
          </select>

          <select 
            value={machineNo} 
            onChange={(e) => setMachineNo(Number(e.target.value))}
            style={{ padding: '8px 12px', borderRadius: '8px', background: '#1e293b', color: '#fff', border: '1px solid #334155' }}
          >
            {machineOptions.map((num) => (
              <option key={num} value={num}>Machine {num}</option>
            ))}
          </select>

          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)} 
            style={{ padding: '8px 12px', borderRadius: '8px', background: '#1e293b', color: '#fff', border: '1px solid #334155', colorScheme: 'dark' }}
          />

          <select 
            value={shift} 
            onChange={(e) => setShift(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', background: '#1e293b', color: '#fff', border: '1px solid #334155' }}
          >
            <option value="shiftA">Shift A (8:30 AM - 8:00 PM)</option>
            <option value="shiftB">Shift B (8:30 PM - 8:00 AM)</option>
            <option value="fullday">Full Day</option>
          </select>
        </div>
      </div>

      <div className="history-grid four-col-grid">
        
        {/* Row 1 */}
        <div className="card">
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div className="machine-img-box" style={{ width: '85px', height: '85px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
              {getCompanyImage(spec.company) ? (
                <img src={getCompanyImage(spec.company)} alt={`${spec.company} Press Machine`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '2rem' }}>🤖</span>
              )}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <h2 style={{ fontSize: '1.25rem', margin: 0, color: '#f8fafc', lineHeight: '1.2' }}>Press Machine {machineNo}</h2>
                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', backgroundColor: `${statusColor}20`, color: statusColor, border: `1px solid ${statusColor}40`, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '10px' }}>●</span> {machineStatus}
                </span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '5px', borderBottom: '1px dashed #334155', marginTop: 'auto' }}>
                <span style={{ color: '#94a3b8', fontWeight: '600', fontSize: '14px' }}>Machine Type</span>
                <span style={{ color: '#f8fafc', fontWeight: 'bold', fontSize: '14px' }}>Press Machine</span>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px dashed #334155' }}>
              <span style={{ color: '#94a3b8', fontWeight: '600', fontSize: '14px' }}>Company</span>
              <span style={{ color: '#f8fafc', fontWeight: 'bold', fontSize: '14px' }}>{spec.company}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px dashed #334155' }}>
              <span style={{ color: '#94a3b8', fontWeight: '600', fontSize: '14px' }}>Capacity</span>
              <span style={{ color: '#f8fafc', fontWeight: 'bold', fontSize: '14px' }}>{spec.capacity !== 'N/A' ? `${spec.capacity} TON` : 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8', fontWeight: '600', fontSize: '14px' }}>Plant</span>
              <span style={{ color: '#f8fafc', fontWeight: 'bold', fontSize: '14px' }}>{plant === 'plant1' ? 'Plant 1' : 'Plant 2'}</span>
            </div>
          </div>
        </div>

        <div className="card" style={{ gridColumn: "span 2" }}>
          <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0px 0px 8px rgba(250, 204, 21, 0.6))' }}>
              <path d="M12 2v1"></path>
              <path d="M12 7v1"></path>
              <path d="M5.6 5.6l.7.7"></path>
              <path d="M18.4 5.6l-.7.7"></path>
              <path d="M2 12h1"></path>
              <path d="M21 12h1"></path>
              <path d="M12 4a7 7 0 0 0-7 7c0 2.2 1.4 4.2 3.2 5.5.6.5 1 .9 1.1 1.5H14.7c.1-.6.5-1 1.1-1.5 1.8-1.3 3.2-3.3 3.2-5.5a7 7 0 0 0-7-7z"></path>
              <path d="M9 18h6"></path>
              <path d="M10 22h4"></path>
            </svg>
            Key Insights
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0, background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 100%)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#f8fafc', fontSize: '14px' }}>Peak Production</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Highest count of {keyInsights?.peak_production?.count || 0} at {keyInsights?.peak_production?.time || '--:--'}</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0, background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.05) 100%)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#f8fafc', fontSize: '14px' }}>Total Production</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>{summary.total_production || 0} units produced today</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0, background: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.05) 100%)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#f8fafc', fontSize: '14px' }}>Online Idle Time</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>{keyInsights?.peak_idle?.formatted_time || '0 mins'} at {keyInsights?.peak_idle?.time || '--:--'} (highest)</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0, background: totalOffline === 0 ? 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 100%)' : 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.05) 100%)', border: totalOffline === 0 ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {totalOffline === 0 ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                )}
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 'bold', color: '#f8fafc', fontSize: '14px' }}>{totalOffline === 0 ? 'No Offline Time' : 'Offline Detected'}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>{totalOffline === 0 ? 'Machine remained online throughout the day' : `Machine was offline for ${keyInsights?.offline_detected?.formatted_time}`}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex-between mb-4">
            <div>
              <p className="label">Selected Date Production</p>
              <h2 className="text-2xl mt-2">{summary.total_production || 0} Pcs</h2>
            </div>
            <div className="text-right">
              <p className="label mb-2">Status</p>
              <div style={{ border: `2px solid ${statusColor}`, color: statusColor, padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', display: 'inline-block', whiteSpace: 'nowrap', backgroundColor: `${statusColor}10` }}>
                {machineStatus}
              </div>
            </div>
          </div>
          <div className="detail-row"><span className="label">Target</span> <span className="val">--</span></div>
          <div className="detail-row"><span className="label">Achievement</span> <span className="val text-green">--</span></div>
          <div className="detail-row"><span className="label">Date</span> <span className="val text-blue-400">{selectedDate}</span></div>
        </div>
        
        {/* Row 2 */}
        <div className="card" style={{ gridColumn: "span 3" }}>
          <h3 className="section-title">Production & Downtime Trend ({shift === 'shiftA' ? 'Shift A' : shift === 'shiftB' ? 'Shift B' : 'Full Day'})</h3>
          <div className="chart-container mt-4" style={{ height: '320px', width: '100%', position: 'relative' }}>
            {loading ? (
              <p className="text-muted text-center" style={{ marginTop: '100px' }}>Loading Chart Data...</p>
            ) : cumulativeChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cumulativeChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="display_name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name.includes('Mins')) return value.toFixed(2);
                      return value;
                    }}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', borderRadius: '8px' }} 
                    itemStyle={{ fontSize: '14px' }} 
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                  
                  <Line type="linear" dataKey="cumulative_production" name="Total Production" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                  <Line type="linear" dataKey="cumulative_idle" name="Total Online Idle (Mins)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="linear" dataKey="cumulative_offline" name="Total Offline (Mins)" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted text-center" style={{ marginTop: '100px' }}>No Data for Selected Parameters</p>
            )}
          </div>
        </div>

        {/* 👇 YAHAN SE MAIN CHANGES HAIN (TOP/BOTTOM LAYOUT) 👇 */}
        <div className="card">
          <h3 className="section-title">Machine State Distribution ({shift === 'fullday' ? 'Full Day' : 'Today'})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', height: '320px', alignItems: 'center', justifyContent: 'center', paddingTop: '10px' }}>
            
            {/* Chart Upar (Top) */}
            <div style={{ width: '100%', height: '180px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={0} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'Production') return value;
                      return value.toFixed(2);
                    }} 
                    contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Center ka Text Size Thoda Chhota Kiya Hai */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>{summary.total_production || 0}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Total Count</div>
              </div>
            </div>
            
            {/* Legend Neeche (Bottom) */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 15px', marginTop: '15px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
                  <div style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 'bold' }}>Production</div>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>{summary.total_production || 0}</div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
                  <div style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 'bold' }}>Online Idle</div>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>{totalIdleFormatted.toFixed(2)} mins</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
                  <div style={{ color: '#f8fafc', fontSize: '13px', fontWeight: 'bold' }}>Offline</div>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>{totalOfflineFormatted.toFixed(2)} mins</div>
              </div>

            </div>

          </div>
        </div>

        {/* ROW 3: Shut Height Change, Tool Change, ON/OFF Status, Operator Timeline */}
        <div className="card">
          <h3 className="section-title">Shut Height Change ({shutHeightChanges.length})</h3>
          <div className="timeline" style={{ padding: '20px 10px', maxHeight: '350px', overflowY: 'auto' }}>
            {shutHeightChanges.length > 0 ? (
              <>
                {shutHeightChanges.map((change, idx) => (
                  <div key={idx} className="timeline-item" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <div className="tl-dot" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
                    </div>
                    <div className="tl-content">
                      <p className="tl-time text-sm text-gray-400">{formatChangeTime(change.time || change.timestamp, selectedDate)}</p>
                      <p className="tl-title text-white font-semibold mt-1">{change.title || 'Height Changed'}</p>
                      <p className="text-muted text-xs mt-1" style={{ wordBreak: 'break-word' }}>
                        {change.details ? change.details.split(' | Tool:')[0] : ''}
                      </p>
                      {(change.shut_height !== undefined || change.part_name) && (
                        <div style={{ marginTop: '6px', padding: '6px 8px', borderRadius: '6px', background: 'rgba(16,185,129,0.08)', color: '#cbd5e1', fontSize: '11px' }}>
                          <b style={{ color: '#34d399' }}>Details:</b> {change.shut_height ? `Height: ${change.shut_height} ` : ''} 
                          {change.part_name ? `| Part: ${change.part_name}` : ''}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div className="timeline-item" style={{ display: 'flex', gap: '20px' }}>
                  <div className="tl-dot" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#475569', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>-</div>
                  <div className="tl-content">
                    <p className="tl-time text-sm text-gray-400">Current</p>
                    <p className="tl-title text-muted font-semibold mt-1">Stable</p>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>
                <p>No shut height changes recorded for this date.</p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">Tool Change ({toolChanges.length})</h3>
          <div className="timeline" style={{ padding: '20px 10px', maxHeight: '350px', overflowY: 'auto' }}>
            {toolChanges.length > 0 ? (
              <>
                {toolChanges.map((change, idx) => (
                  <div key={idx} className="timeline-item" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                    <div className="tl-dot" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                    </div>
                    <div className="tl-content">
                      <p className="tl-time text-sm text-gray-400">{formatChangeTime(change.time || change.timestamp, selectedDate)}</p>
                      <p className="tl-title text-white font-semibold mt-1">{change.title || 'Tool Changed'}</p>
                      <p className="text-muted text-xs mt-1" style={{ wordBreak: 'break-word' }}>
                        {change.details ? change.details.split(' | Shut Height:')[0] : ''}
                      </p>
                      {(change.part_name || change.part_number || change.model_name || change.tool_name) && (
                        <div style={{ marginTop: '6px', padding: '6px 8px', borderRadius: '6px', background: 'rgba(59,130,246,0.08)', color: '#cbd5e1', fontSize: '11px' }}>
                          <b style={{ color: '#93c5fd' }}>Details:</b> {change.customer_name || change.customer || 'N/A'} | {change.model_name || change.model || 'N/A'} | {change.part_name || 'N/A'} | Part No: {change.part_number || 'N/A'} | Tool: {change.tool_name || 'N/A'}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div className="timeline-item" style={{ display: 'flex', gap: '20px' }}>
                  <div className="tl-dot" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#475569', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>-</div>
                  <div className="tl-content">
                    <p className="tl-time text-sm text-gray-400">Current</p>
                    <p className="tl-title text-muted font-semibold mt-1">No further changes</p>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>
                <p>No tool changes recorded for this date.</p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">Machine ON/OFF Status ({onOffEvents.length})</h3>
          <div className="timeline" style={{ padding: '20px 10px', maxHeight: '350px', overflowY: 'auto' }}>
            {onOffEvents.length > 0 ? (
              <>
                {onOffEvents.map((change, idx) => {
                  const isOn = change.type === 'ON' || change.event_type === 'ON';
                  return (
                    <div key={idx} className="timeline-item" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                      <div className="tl-dot" style={{ width: '32px', height: '32px', borderRadius: '50%', background: isOn ? '#10b981' : '#ef4444', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
                      </div>
                      <div className="tl-content">
                        <p className="tl-time text-sm text-gray-400">
                           {formatChangeTime(change.time || change.timestamp, selectedDate)}
                        </p>
                        <p className="tl-title text-white font-semibold mt-1">
                          Machine Powered {isOn ? 'ON' : 'OFF'}
                        </p>
                        <p className="text-muted text-xs mt-1" style={{ wordBreak: 'break-word' }}>
                          {change.details || (isOn ? 'Machine Power/Signal Restored' : 'Machine detected as Offline/No Signal')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>
                <p>No ON/OFF changes recorded for this date.</p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">Operator Timeline (Today)</h3>
          <div className="timeline" style={{ padding: '20px 10px' }}>
            <div className="timeline-item" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div className="tl-dot" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}></div>
              <div className="tl-content">
                <p className="tl-time text-sm text-gray-400">06:00 AM - 08:15 AM</p>
                <p className="tl-title text-muted font-semibold mt-1">No Operator</p>
              </div>
            </div>
            
            <div className="timeline-item" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div className="tl-dot" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#a855f7', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>A</div>
              <div className="tl-content">
                <p className="tl-time text-sm text-gray-400">08:15 AM - 10:30 AM</p>
                <p className="tl-title font-semibold mt-1 text-white">Abhishek <span className="text-muted font-normal text-sm ml-2">- 1250 Pcs</span></p>
              </div>
            </div>

            <div className="timeline-item" style={{ display: 'flex', gap: '20px' }}>
              <div className="tl-dot" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#3b82f6', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>M</div>
              <div className="tl-content">
                <p className="tl-time text-sm text-gray-400">10:30 AM - Current</p>
                <p className="tl-title font-semibold mt-1 text-white">Mohit <span className="text-muted font-normal text-sm ml-2">- 980 Pcs</span></p>
              </div>
            </div>
          </div>
          <div className="tl-footer mt-4" style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', color: '#60a5fa', fontWeight: 'bold' }}>
            📊 Total Production Today: {summary.total_production || 2230} Pcs
          </div>
        </div>

        {/* ROW 4 */}
        <div className="card" style={{ gridColumn: "span 4" }}>
          <h3 className="section-title">Hourly Breakdown</h3>
          <div style={{ overflowX: 'auto', maxHeight: '350px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', color: '#f8fafc' }}>
              <thead>
                <tr style={{ background: '#1e293b', borderBottom: '2px solid #334155', position: 'sticky', top: 0, zIndex: 10 }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Hour</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Production Count</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Online Idle (Mins)</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Offline (Mins)</th>
                </tr>
              </thead>
              <tbody>
                {chartData.length > 0 ? chartData.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '12px', textAlign: 'left' }}>{formatHourRange(row.name)}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{row.production}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{convertDecimalToMMSS(row.idle_minutes).toFixed(2)}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>{convertDecimalToMMSS(row.shutdown_minutes).toFixed(2)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>No data available for the selected shift/date.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}