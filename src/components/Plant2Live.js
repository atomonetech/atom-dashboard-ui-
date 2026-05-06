import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://192.168.0.34:8000';

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
// MACHINE CARD COMPONENT
// =================================================================================
const MachineCard = ({ machine, isDark, liveIdle, formatLiveIdle, onClick }) => {
  const isRunning = machine.machine_on && machine.is_producing;
  const isIdle    = machine.machine_on && !machine.is_producing;
  const isOffline = !machine.machine_on;

  const themeColor = isRunning
    ? (isDark ? '#00ff9d' : '#059669')
    : isIdle ? '#f59e0b'
    : (isDark ? '#64748b' : '#94a3b8');

  // ── DARK CARD ────────────────────────────────────────────────────────────
  if (isDark) {
    return (
      <div
        onClick={() => onClick(machine)}
        className={isIdle ? 'idle-card-dark' : ''}
        style={{
          width: '100%', boxSizing: 'border-box',
          background: 'rgba(0,0,0,0.50)',
          backdropFilter: 'blur(35px)', WebkitBackdropFilter: 'blur(35px)',
          borderRadius: '36px',
          padding: '28px 26px 24px',
          position: 'relative', overflow: 'hidden',
          cursor: 'pointer',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          border: `0.7px solid ${themeColor}60`,
          boxShadow: isIdle
            ? `inset 0 0 20px rgba(245,158,11,0.12), 0 10px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,158,11,0.1)`
            : `inset 0 0 20px ${themeColor}10, 0 10px 40px rgba(0,0,0,0.4)`,
          animation: 'fadeInUp 0.4s ease-out both',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = `inset 0 0 30px ${themeColor}20, 0 20px 50px rgba(0,0,0,0.6)`; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = isIdle ? `inset 0 0 20px rgba(245,158,11,0.12), 0 10px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(245,158,11,0.1)` : `inset 0 0 20px ${themeColor}10, 0 10px 40px rgba(0,0,0,0.4)`; }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: `linear-gradient(90deg, transparent, ${themeColor}, transparent)`, boxShadow: `0 4px 20px ${themeColor}80`, opacity: isIdle ? 1 : 0.9, animation: isIdle ? 'idleBarPulse 1.5s ease-in-out infinite' : 'none' }} />
        {isIdle && <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', pointerEvents: 'none', animation: 'idleCornerGlow 2s ease-in-out infinite' }} />}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', display: 'block' }}>Unit ID</span>
            <h2 style={{ color: isIdle ? '#fbbf24' : '#ffffff', fontSize: '26px', fontWeight: 900, margin: 0, fontFamily: "'Courier New', monospace", letterSpacing: '-0.5px', animation: isIdle ? 'idleTextFlicker 2s ease-in-out infinite' : 'none', textShadow: isIdle ? '0 0 16px rgba(245,158,11,0.5)' : '0 0 10px rgba(255,255,255,0.15)' }}>
              MC-{String(machine.machine_no).padStart(2, '0')}
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '12px', fontWeight: 700, fontSize: '10px', background: 'rgba(0,0,0,0.3)', border: `1px solid ${themeColor}40`, color: themeColor, letterSpacing: '0.5px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: themeColor, boxShadow: `0 0 8px ${themeColor}`, display: 'inline-block', animation: isOffline ? 'none' : isIdle ? 'idleDotBlink 1s ease-in-out infinite' : 'dotBlink 1.4s ease infinite' }} />
            {isRunning ? 'RUNNING' : isIdle ? 'IDLE' : 'OFFLINE'}
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '24px', padding: '16px', textAlign: 'center', border: isIdle ? '1px solid rgba(245,158,11,0.15)' : '1px solid rgba(255,255,255,0.08)', marginBottom: '10px' }}>
          <p style={{ color: 'rgba(255,255,255,0.60)', fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '4px' }}>Hourly Output</p>
          <div style={{ fontSize: '46px', fontWeight: 900, color: isIdle ? '#fbbf24' : '#ffffff', lineHeight: 1, fontFamily: "'Courier New', monospace", textShadow: `0 4px 20px ${themeColor}40`, animation: isIdle ? 'idleCountPop 2s ease-in-out infinite' : 'none' }}>
            {machine.current_hour_count || 0}
          </div>
        </div>

        <div style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '8px 12px', marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Last Count Received:</span>
          <span style={{ fontSize: '15px', fontWeight: 900, color: '#ffffff', fontFamily: "'Courier New', monospace", textShadow: '0 0 10px rgba(255,255,255,0.4)' }}>
            {machine.last_count_received !== undefined && machine.last_count_received !== null ? machine.last_count_received : (machine.last_hour_count ?? 0)}
          </span>
        </div>

        {isIdle && liveIdle > 0 && (
          <div style={{ background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.35)', borderRadius: '18px', padding: '10px 14px', textAlign: 'center', marginBottom: '10px' }}>
            <div style={{ color: '#fbbf24', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', marginBottom: '4px', textTransform: 'uppercase' }}><i className="bi bi-exclamation-triangle-fill" style={{ marginRight: '5px' }}></i>LIVE IDLE</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#fbbf24', fontFamily: "'Courier New', monospace", letterSpacing: '2px', animation: 'timerPulse 1s ease-in-out infinite' }}>{formatLiveIdle(liveIdle)}</div>
            <div style={{ fontSize: '9px', color: 'rgba(245,158,11,0.75)', marginTop: '3px' }}>Since {machine.last_activity !== 'Never' ? machine.last_activity : 'machine ON'}</div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '10px' }}>
          {machine.on_since && (
            <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '9px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'rgba(255,255,255,0.60)', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Machine ON at</span>
              <span style={{ color: '#60a5fa', fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: '11px' }}>{machine.on_since}</span>
            </div>
          )}
          {machine.first_count_at && (
            <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '9px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'rgba(255,255,255,0.60)', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Prod Start</span>
              <span style={{ color: '#93c5fd', fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: '11px' }}>{machine.first_count_at}</span>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ display: 'block', color: 'rgba(255,255,255,0.55)', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '3px' }}>Idle Time</span>
            <span style={{ fontSize: '15px', fontWeight: 900, color: '#f59e0b' }}>{machine.total_shift_idle_time || 0} min</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ display: 'block', color: 'rgba(255,255,255,0.55)', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '3px' }}>Shut Hgt</span>
            <span style={{ fontSize: '14px', fontWeight: 900, color: '#60a5fa', fontFamily: "'Courier New', monospace" }}>
              {typeof machine.shut_height === 'number' ? machine.shut_height.toFixed(2) : machine.shut_height || 'N/A'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
          <div style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.10)', borderLeft: `2px solid ${themeColor}`, borderRadius: '16px', padding: '10px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '72px' }}>
            <span style={{ color: 'rgba(255,255,255,0.60)', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Last Hr</span>
            <span style={{ color: '#ffffff', fontWeight: 900, fontSize: '17px', lineHeight: 1, marginTop: '2px' }}>{machine.last_hour_count ?? 0}</span>
          </div>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.10)', borderLeft: `2px solid ${themeColor}`, borderRadius: '16px', padding: '10px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.60)', fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Total</span>
            <span style={{ fontWeight: 900, fontSize: '20px', lineHeight: 1, marginTop: '2px', color: themeColor }}>{machine.cumulative_count ?? 0}</span>
          </div>
        </div>
      </div>
    );
  }

  // ── LIGHT CARD ───────────────────────────────────────────────────────────
  const lc = {
    color: isRunning ? '#059669' : isIdle ? '#d97706' : '#64748b',
    bg: isRunning ? '#f0fdf4' : isIdle ? '#fffbeb' : '#f8fafc',
    border: isRunning ? '#6ee7b7' : isIdle ? '#fcd34d' : '#cbd5e1',
    accent: isRunning ? '#10b981' : isIdle ? '#f59e0b' : '#94a3b8',
  };

  return (
    <div
      onClick={() => onClick(machine)}
      className={isIdle ? 'idle-card-light' : ''}
      style={{
        width: '100%', boxSizing: 'border-box',
        background: `linear-gradient(160deg, ${lc.bg} 0%, #ffffff 60%)`,
        borderRadius: '28px',
        padding: '22px 20px 18px',
        position: 'relative', overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        border: `2px solid ${lc.border}`,
        boxShadow: isIdle
          ? `0 8px 32px rgba(245,158,11,0.12), 0 2px 8px rgba(0,0,0,0.06)`
          : `0 8px 32px rgba(99,102,241,0.08), 0 2px 8px rgba(0,0,0,0.04)`,
        animation: 'fadeInUp 0.4s ease-out both',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = isIdle ? `0 16px 40px rgba(245,158,11,0.18), 0 4px 12px rgba(0,0,0,0.08)` : `0 16px 40px rgba(99,102,241,0.14), 0 4px 12px rgba(0,0,0,0.06)`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = isIdle ? `0 8px 32px rgba(245,158,11,0.12), 0 2px 8px rgba(0,0,0,0.06)` : `0 8px 32px rgba(99,102,241,0.08), 0 2px 8px rgba(0,0,0,0.04)`; }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '5px', background: lc.accent, borderRadius: '28px 28px 0 0', animation: isIdle ? 'idleBarPulse 1.5s ease-in-out infinite' : 'none' }} />
      {isIdle && <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top, rgba(245,158,11,0.05) 0%, transparent 55%)', pointerEvents: 'none' }} />}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '42px', height: '42px', background: lc.bg, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${lc.border}`, animation: isIdle ? 'idleBorderPulse 1.5s ease-in-out infinite' : 'none' }}>
            <span style={{ fontSize: '14px', fontWeight: 900, color: lc.color, fontFamily: "'Courier New', monospace" }}>{String(machine.machine_no).padStart(2, '0')}</span>
          </div>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Machine No</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '10px', fontWeight: 800, fontSize: '10px', background: lc.bg, border: `2px solid ${lc.border}`, color: lc.color }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: lc.accent, display: 'inline-block', animation: isOffline ? 'none' : isIdle ? 'idleDotBlink 1s ease-in-out infinite' : 'dotBlink 1.4s ease infinite' }} />
          {isRunning ? 'RUNNING' : isIdle ? 'IDLE' : 'OFFLINE'}
        </div>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '22px', padding: '16px', marginBottom: '10px', textAlign: 'center', border: `2px solid ${lc.border}`, boxShadow: `0 2px 10px ${lc.accent}15` }}>
        <p style={{ color: '#6366f1', fontSize: '9px', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '4px' }}>Hourly Output</p>
        <div style={{ fontSize: '46px', fontWeight: 900, color: lc.color, lineHeight: 1, fontFamily: "'Courier New', monospace", animation: isIdle ? 'idleCountPop 2s ease-in-out infinite' : 'none' }}>
          {machine.current_hour_count || 0}
        </div>
        {machine.first_count_at && (
          <div style={{ marginTop: '6px', fontSize: '10px', fontWeight: 700, color: '#6366f1' }}>
            <i className="bi bi-lightning-charge-fill" style={{ marginRight: '4px' }}></i>Prod Start: {machine.first_count_at}
          </div>
        )}
      </div>

      {/* Last Count — indigo gradient pill */}
      <div style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: '16px', padding: '10px 14px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 14px rgba(79,70,229,0.25)' }}>
        <span style={{ fontSize: '9px', fontWeight: 800, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Last Count</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a5f3fc', animation: isOffline ? 'none' : 'dotBlink 1.4s ease infinite' }} />
          <span style={{ fontSize: '16px', fontWeight: 900, color: '#ffffff', fontFamily: "'Courier New', monospace" }}>
            {machine.last_count_received !== undefined && machine.last_count_received !== null ? machine.last_count_received : (machine.last_hour_count ?? 0)}
          </span>
        </div>
      </div>

      {isIdle && liveIdle > 0 && (
        <div style={{ background: '#fffbeb', border: '2px solid #fcd34d', borderRadius: '16px', padding: '9px 12px', textAlign: 'center', marginBottom: '10px', animation: 'idleAlertPulse 1.5s ease-in-out infinite' }}>
          <div style={{ color: '#d97706', fontSize: '9px', fontWeight: 800, letterSpacing: '2px', marginBottom: '3px', textTransform: 'uppercase' }}><i className="bi bi-exclamation-triangle-fill" style={{ marginRight: '4px' }}></i>LIVE IDLE</div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#b45309', fontFamily: "'Courier New', monospace", letterSpacing: '2px' }}>{formatLiveIdle(liveIdle)}</div>
          <div style={{ fontSize: '9px', color: '#92400e', marginTop: '2px', fontWeight: 600 }}>Since {machine.last_activity !== 'Never' ? machine.last_activity : 'machine ON'}</div>
        </div>
      )}

      <div style={{ background: '#f8faff', borderRadius: '20px', padding: '12px', border: '2px solid #e0e7ff' }}>
        {machine.on_since && (
          <div style={{ background: '#ffffff', padding: '8px 12px', borderRadius: '12px', marginBottom: '8px', textAlign: 'center', border: '1.5px solid #e0e7ff' }}>
            <span style={{ display: 'block', fontSize: '9px', fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1px' }}>Machine ON at</span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#1e293b', fontFamily: "'Courier New', monospace" }}>{machine.on_since}</span>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px', marginBottom: '8px' }}>
          <div style={{ background: '#fffbeb', padding: '10px', borderRadius: '12px', textAlign: 'center', border: '1.5px solid #fde68a' }}>
            <span style={{ display: 'block', fontSize: '9px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1px' }}>Idle Time</span>
            <span style={{ fontSize: '14px', fontWeight: 900, color: '#92400e' }}>{machine.total_shift_idle_time || 0} min</span>
          </div>
          <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '12px', textAlign: 'center', border: '1.5px solid #bfdbfe' }}>
            <span style={{ display: 'block', fontSize: '9px', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1px' }}>Shut Hgt</span>
            <span style={{ fontSize: '12px', fontWeight: 900, color: '#1e3a8a', fontFamily: "'Courier New', monospace" }}>
              {typeof machine.shut_height === 'number' ? machine.shut_height.toFixed(2) : machine.shut_height || 'N/A'}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '7px' }}>
          <div style={{ flex: 1, background: '#ffffff', borderRadius: '12px', padding: '9px', textAlign: 'center', border: '1.5px solid #e0e7ff' }}>
            <span style={{ display: 'block', fontSize: '9px', fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1px' }}>Last Hr</span>
            <span style={{ fontSize: '16px', fontWeight: 900, color: '#1e293b' }}>{machine.last_hour_count ?? 0}</span>
          </div>
          <div style={{ flex: 2, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: '12px', padding: '9px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(79,70,229,0.22)' }}>
            <span style={{ fontSize: '9px', fontWeight: 800, color: 'rgba(255,255,255,0.70)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Shift Total</span>
            <span style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', lineHeight: 1, marginTop: '1px' }}>{machine.cumulative_count ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
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
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [isMounted, setIsMounted] = useState(false);
  const [currentShift, setCurrentShift] = useState('A');
  const [liveIdleSeconds, setLiveIdleSeconds] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());

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

  const getStatusColor = (m) => {
    if (!m.machine_on) return isDark ? '#64748b' : '#94a3b8';
    if (m.is_producing) return isDark ? '#22c55e' : '#059669';
    return '#f59e0b';
  };

  const navBg = isDark ? 'rgba(20,8,50,0.92)' : 'rgba(255,255,255,0.95)';
  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const statCardBg = isDark ? 'rgba(0,0,0,0.35)' : '#ffffff';
  const statCardBorder = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(99,102,241,0.15)';
  const modalBg = isDark ? 'rgba(15,5,35,0.97)' : '#f8faff';
  const modalBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(99,102,241,0.22)';

  useEffect(() => { setIsMounted(true); return () => setIsMounted(false); }, []);
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
useEffect(() => {
    const updateShift = () => {   // ✅ 'update' ko 'updateShift' kar diya
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
          newLiveIdle[machineNo] = 0; // Fix: Use machineNo instead of no
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

  // --- LUNCH TIME CHECKER LOGIC ---
  const checkLunchTime = () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    // 12:30 PM se lekar 12:59 PM tak
    return hour === 12 && minute >= 30;
  };

  // --- ORIGINAL COLORS (No Purple, completely untouched) ---
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
  const efficiency = totalMachines > 0 ? ((runningMachines / totalMachines) * 100).toFixed(1) : '0.0';
  const sortedMachines = [...machines].sort((a, b) => a.machine_no - b.machine_no);
  const isCurrentlyLunch = checkLunchTime();

  if (loading && machines.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: isDark ? 'linear-gradient(135deg,#1a0b40,#4b2072,#5a1137)' : 'linear-gradient(135deg,#eef2ff,#f5f3ff,#ede9fe)', color: isDark ? '#fff' : '#4f46e5' }}>
        <AnimatedBackground isDark={isDark} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ width: '52px', height: '52px', margin: '0 auto 20px', border: `3px solid ${isDark ? 'rgba(180,100,255,0.2)' : 'rgba(99,102,241,0.2)'}`, borderTop: `3px solid ${isDark ? '#a855f7' : '#6366f1'}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <div style={{ color: isDark ? '#a855f7' : '#6366f1', fontSize: 'clamp(12px,3.5vw,15px)', letterSpacing: '3px', fontFamily: "'Courier New',monospace" }}>PLANT 2 LOADING...</div>
        </div>
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
        @keyframes hardPulse {
          0%, 100% { opacity: 1; background-color: #9a3412; }
          50% { opacity: 0.9; background-color: #7c2d12; box-shadow: 0 0 20px rgba(249, 115, 22, 0.6); }
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
          const isIdle = machine.machine_on && !machine.is_producing;
          
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
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
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

              {/* LUNCH TIME BANNER */}
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
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px',
                  textTransform: 'uppercase',
                  animation: 'lunchBannerPulse 3s infinite',
                  boxShadow: 'inset 0 0 10px rgba(59, 130, 246, 0.1)'
                }}>
                  <span style={{ fontSize: '20px' }}>🍽️</span> 
                  <span>LUNCH TIME</span>
                </div>
              )}

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
              {!isCurrentlyLunch && isIdle && liveIdle > 0 && (
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

      {/* MODAL POPUP */}
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
              
              {/* Modal Lunch Banner Highlight */}
              {isCurrentlyLunch && !selectedMachine.is_producing && (
                <div style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(96, 165, 250, 0.4)',
                  color: '#93c5fd',
                  padding: '16px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  fontWeight: '800',
                  letterSpacing: '2px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '10px',
                  textTransform: 'uppercase',
                  animation: 'lunchBannerPulse 3s infinite',
                }}>
                  <span style={{ fontSize: '24px' }}>🍽️</span> 
                  <span style={{ fontSize: '18px' }}>LUNCH TIME BREAK</span>
                </div>
              )}

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

              {/* Big Stat Box */}
              <div style={{ textAlign: 'center', padding: '30px', background: 'linear-gradient(145deg, #1e293b, #0f172a)', borderRadius: '20px', border: `1px solid rgba(255,255,255,0.05)`, marginTop: '24px', boxShadow: `inset 0 4px 20px rgba(0,0,0,0.5)` }}>
                <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px', fontWeight: '700', textTransform: 'uppercase' }}>Current Hour Production</div>
                <div style={{ fontSize: '72px', fontWeight: '900', color: getMachineColor(selectedMachine), textShadow: `0 0 30px ${getMachineColor(selectedMachine)}40`, lineHeight: '1' }}>{selectedMachine.current_hour_count || 0}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '10px' }}>Resets every hour at XX:00:00</div>
              </div>

              {/* Customer Info */}
              <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '24px' }}>
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

              {/* Tool Info */}
              <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginTop: '24px' }}>
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginTop: '24px' }}>
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
        </div>
      )}
    </div>
  );
}