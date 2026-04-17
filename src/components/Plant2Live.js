<<<<<<< Updated upstream
=======
// src/components/Plant2Live.js
>>>>>>> Stashed changes
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
    const update = () => {
      const now = new Date();
      const mins = now.getHours() * 60 + now.getMinutes();
      setCurrentShift(mins >= 510 && mins < 1200 ? 'A' : 'B');
      setCurrentHour(now.getHours());
    };
<<<<<<< Updated upstream
    
    updateShift();
    const shiftInterval = setInterval(updateShift, 60000);
    return () => clearInterval(shiftInterval);
=======
    update();
    const si = setInterval(update, 60000);
    return () => clearInterval(si);
>>>>>>> Stashed changes
  }, []);

  const fetchData = async () => {
    if (!isMounted) return;
    try {
<<<<<<< Updated upstream
      const response = await fetch(`${API_BASE}/api/plant2-live/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' }
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.success && Array.isArray(data.machines)) {
        if (isMounted) { setMachines(data.machines); setError(''); }
      }
=======
      const res = await fetch(`${API_BASE}/api/plant2-live/`, {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.machines)) {
        setMachines(data.machines);
        setError('');
      } else throw new Error('Invalid data');
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
        const no = machine.machine_no;
        if (machine.machine_on && !machine.is_producing) {
          const hourStart = new Date(now);
          hourStart.setMinutes(0, 0, 0);
          let secs = 0;
          if (machine.last_activity && machine.last_activity !== 'Never') {
            try {
              const [h, m, s] = machine.last_activity.split(':').map(Number);
              const last = new Date(now);
              last.setHours(h, m, s, 0);
              secs = Math.floor((now - (last >= hourStart ? last : hourStart)) / 1000);
            } catch { secs = 0; }
          } else if (machine.on_since) {
            try {
              const [h, m] = machine.on_since.split(':').map(Number);
              const on = new Date(now);
              on.setHours(h, m, 0, 0);
              secs = Math.floor((now - (on >= hourStart ? on : hourStart)) / 1000);
            } catch { secs = 0; }
          }
          newLiveIdle[no] = Math.min(secs, 3600);
>>>>>>> Stashed changes
        } else {
          newLiveIdle[no] = 0;
        }
      });
      setLiveIdleSeconds(newLiveIdle);
    }, 1000);
    return () => clearInterval(idleTimer);
  }, [machines, currentHour]);

  useEffect(() => {
    const check = async () => {
      const now = new Date();
<<<<<<< Updated upstream
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

=======
      const h = now.getHours();
      if (now.getMinutes() === 0 && now.getSeconds() <= 5 && lastSavedHour.current !== h) {
        try {
          const res = await fetch(`${API_BASE}/api/save-hourly-snapshot/`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
          });
          const data = await res.json();
          if (data.success) {
            setLiveIdleSeconds({});
            lastSavedHour.current = h;
            setCurrentHour(h);
            setTimeout(fetchData, 1000);
          }
        } catch { /* silent */ }
      }
    };
    const si = setInterval(check, 1000);
    return () => clearInterval(si);
  }, []);

>>>>>>> Stashed changes
  const handleMachineClick = (machine) => {
    setSelectedMachine(machine);
    setShowChanges(false);
    fetch(`${API_BASE}/api/machine-changes/?machine_no=${machine.machine_no}`)
<<<<<<< Updated upstream
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
=======
      .then(r => r.json())
      .then(d => { if (d.success) setMachineChanges(d.changes); })
      .catch(() => {});
  };

  const closeModal = () => { setSelectedMachine(null); setMachineChanges([]); setShowChanges(false); };
>>>>>>> Stashed changes

  const totalMachines = machines.length;
  const onMachines = machines.filter(m => m.machine_on).length;
  const runningMachines = machines.filter(m => m.is_producing).length;
  const idleMachines = onMachines - runningMachines;
  const offlineMachines = totalMachines - onMachines;
  const efficiency = totalMachines > 0 ? ((runningMachines / totalMachines) * 100).toFixed(1) : '0.0';
  const sortedMachines = [...machines].sort((a, b) => a.machine_no - b.machine_no);

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
<<<<<<< Updated upstream
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
=======
    <div style={{ minHeight: '100vh', background: isDark ? 'linear-gradient(135deg,#1a0b40 0%,#4b2072 50%,#5a1137 100%)' : 'linear-gradient(135deg,#eef2ff,#f5f3ff,#ede9fe)', color: textColor, position: 'relative', fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>
      <AnimatedBackground isDark={isDark} />

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes dotBlink { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.35; transform:scale(0.6); } }
        @keyframes timerPulse { 0%,100% { opacity:1; } 50% { opacity:0.55; } }
        @keyframes runningPing { 0% { transform:scale(1); opacity:0.75; } 100% { transform:scale(2.4); opacity:0; } }
        @keyframes modalPopIn { from { opacity:0; transform:scale(0.96) translateY(14px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes idleBarPulse { 0%,100% { opacity:0.85; } 50% { opacity:1; filter:brightness(1.3); } }
        @keyframes idleDotBlink { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.4; transform:scale(0.5); } }
        @keyframes idleCornerGlow { 0%,100% { opacity:0.6; } 50% { opacity:1; } }
        @keyframes idleCountPop { 0%,100% { transform:scale(1); } 50% { transform:scale(1.04); filter:brightness(1.1); } }
        @keyframes idleTextFlicker { 0%,92%,100% { opacity:1; } 95% { opacity:0.7; } }
        @keyframes idleAlertPulse { 0%,100% { box-shadow:0 4px 12px rgba(245,158,11,0.08); } 50% { box-shadow:0 4px 20px rgba(245,158,11,0.22); } }
        @keyframes idleBorderPulse { 0%,100% { border-color:rgba(245,158,11,0.3); } 50% { border-color:rgba(245,158,11,0.7); } }

        .machine-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:clamp(16px,2vw,22px); }
        .stats-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:clamp(12px,1.5vw,18px); margin-bottom:clamp(20px,3vw,28px); }

        .stat-card {
          background: ${statCardBg};
          ${isDark ? 'backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);' : ''}
          border-radius:18px;
          padding:clamp(12px,2vw,16px) clamp(8px,1.5vw,12px);
          text-align:center;
          transition:transform 0.22s ease, box-shadow 0.22s ease;
          border:1.5px solid ${statCardBorder};
          box-shadow:${isDark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 16px rgba(99,102,241,0.08)'};
        }
        .stat-card:hover { transform:translateY(-3px); box-shadow:${isDark ? '0 12px 32px rgba(0,0,0,0.5)' : '0 10px 28px rgba(99,102,241,0.14)'}; }

        .navbar-sticky { position:sticky; top:0; z-index:100; }

        /* ── MODAL SCROLLABLE BODY ── */
        .modal-body-scroll {
          overflow-y: auto;
          flex: 1;
          padding: clamp(14px,2.5vw,20px);
          display: grid;
          gap: clamp(10px,1.8vw,14px);
          align-content: start;
        }
        .modal-body-scroll::-webkit-scrollbar { width: 4px; }
        .modal-body-scroll::-webkit-scrollbar-track { background: transparent; }
        .modal-body-scroll::-webkit-scrollbar-thumb { background: ${isDark ? 'rgba(139,92,246,0.5)' : 'rgba(99,102,241,0.3)'}; border-radius: 10px; }

        @media (max-width:1300px) { .machine-grid { grid-template-columns:repeat(3,1fr); } }
        @media (max-width:1000px) { .machine-grid { grid-template-columns:repeat(2,1fr); } }
        @media (max-width:768px)  { .machine-grid { grid-template-columns:repeat(2,1fr); } .stats-grid { grid-template-columns:repeat(3,1fr)!important; } }
        @media (max-width:550px)  { .machine-grid { grid-template-columns:1fr; } .stats-grid { grid-template-columns:repeat(2,1fr)!important; } }
      `}</style>

      {/* ── NAVBAR ── */}
      <div className="navbar-sticky" style={{ background: navBg, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: `1px solid ${isDark ? 'rgba(139,92,246,0.22)' : 'rgba(99,102,241,0.15)'}`, boxShadow: isDark ? '0 2px 20px rgba(0,0,0,0.5)' : '0 2px 12px rgba(99,102,241,0.08)' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', alignItems: 'stretch', height: '56px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '0 18px', background: 'transparent', borderTop: 'none', borderBottom: 'none', borderLeft: 'none', borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.09)' : 'rgba(99,102,241,0.12)'}`, color: isDark ? '#94a3b8' : '#6366f1', fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}
            onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(139,92,246,0.12)' : 'rgba(99,102,241,0.07)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <i className="bi bi-grid-1x2-fill" style={{ fontSize: '12px' }}></i>
            <span>Dashboard</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 20px', borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.09)' : 'rgba(99,102,241,0.12)'}`, flexShrink: 0 }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, background: isDark ? '#61249a' : '#6366f1', boxShadow: isDark ? '0 0 10px #9333ea80' : '0 0 8px rgba(99,102,241,0.5)', animation: 'dotBlink 1.4s ease infinite' }} />
            <h1 style={{ margin: 0, fontSize: 'clamp(12px,2.5vw,16px)', fontWeight: 700, letterSpacing: '0.8px', whiteSpace: 'nowrap', ...(isDark ? { background: 'linear-gradient(135deg,#c084fc,#818cf8,#60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : { color: '#4f46e5' }) }}>
              PLANT 2 • LIVE DASHBOARD
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 14px', marginLeft: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '40px', background: isDark ? 'rgba(168,85,247,0.13)' : 'rgba(99,102,241,0.09)', border: `1px solid ${isDark ? 'rgba(168,85,247,0.28)' : 'rgba(99,102,241,0.22)'}`, fontSize: '11px', fontWeight: 700, color: isDark ? '#c084fc' : '#4f46e5' }}>
              <i className="bi bi-lightning-charge-fill" style={{ fontSize: '10px' }}></i>
              <span>{efficiency}% EFF.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '40px', background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.06)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(99,102,241,0.15)'}`, fontFamily: "'Courier New',monospace", fontSize: '11px', fontWeight: 600, color: isDark ? '#94a3b8' : '#4f46e5' }}>
              <i className="bi bi-clock" style={{ fontSize: '10px' }}></i>
              {currentTime.toLocaleTimeString('en-IN', { hour12: false })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '40px', background: currentShift === 'A' ? (isDark ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.10)') : (isDark ? 'rgba(168,85,247,0.12)' : 'rgba(139,92,246,0.10)'), border: `1px solid ${currentShift === 'A' ? 'rgba(59,130,246,0.28)' : 'rgba(168,85,247,0.28)'}`, fontSize: '11px', fontWeight: 700, color: currentShift === 'A' ? (isDark ? '#60a5fa' : '#2563eb') : (isDark ? '#c084fc' : '#7c3aed') }}>
              <i className="bi bi-calendar-week" style={{ fontSize: '10px' }}></i>
              SHIFT {currentShift}
            </div>
            <ThemeToggle isDark={isDark} toggleTheme={() => setIsDark(p => !p)} />
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: 'clamp(18px,3.5vw,28px)', position: 'relative', zIndex: 1 }}>
        <div className="stats-grid">
          {[
            { label: 'MACHINES ON', value: onMachines,     color: isDark ? '#60a5fa' : '#2563eb', icon: 'bi bi-power' },
            { label: 'RUNNING',     value: runningMachines, color: isDark ? '#00ff9d' : '#059669', icon: 'bi bi-play-circle-fill' },
            { label: 'IDLE',        value: idleMachines,    color: '#f59e0b',                      icon: 'bi bi-pause-circle-fill' },
            { label: 'OFFLINE',     value: offlineMachines, color: isDark ? '#94a3b8' : '#64748b', icon: 'bi bi-slash-circle' },
            { label: 'TOTAL',       value: totalMachines,   color: isDark ? '#c084fc' : '#7c3aed', icon: 'bi bi-hdd-stack-fill' },
          ].map((s, i) => (
            <div key={i} className="stat-card" style={{ animation: `fadeInUp 0.4s ease-out ${i * 0.05}s both` }}>
              <div style={{ fontSize: 'clamp(20px,4vw,26px)', marginBottom: '6px' }}><i className={s.icon} style={{ color: s.color }}></i></div>
              <div style={{ fontSize: 'clamp(9px,1.8vw,10px)', color: s.color, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px', fontWeight: 700 }}>{s.label}</div>
              <div style={{ fontSize: 'clamp(28px,5vw,40px)', fontWeight: 800, color: s.color, lineHeight: 1, fontFamily: "'Courier New',monospace" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {error && (
          <div style={{ padding: '12px 18px', borderRadius: '14px', marginBottom: '18px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.22)', color: '#ef4444', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="bi bi-exclamation-triangle-fill"></i>{error}
          </div>
        )}

        <div className="machine-grid">
          {sortedMachines.map((machine) => (
            <MachineCard key={machine.machine_no} machine={machine} isDark={isDark} liveIdle={liveIdleSeconds[machine.machine_no] || 0} formatLiveIdle={formatLiveIdle} onClick={handleMachineClick} />
          ))}
        </div>
      </div>

      {/* ── MODAL — compact + fixed height + scrollable body ── */}
      {selectedMachine && (() => {
        const m = selectedMachine;
        const isIdle    = m.machine_on && !m.is_producing;
        const isRunning = m.machine_on && m.is_producing;
        const isOffline = !m.machine_on;
        const idle = liveIdleSeconds[m.machine_no] || 0;
        const status = getMachineStatus(m);
        const statusColor = getStatusColor(m);
        const stateGrad = isRunning ? 'linear-gradient(90deg,#22c55e,#4ade80)' : isIdle ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#475569,#64748b)';

        const mFieldBg     = isDark ? 'rgba(255,255,255,0.04)' : '#ffffff';
        const mFieldBorder = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.15)';
        const mLabelColor  = isDark ? '#64748b' : '#6366f1';
        const mValColor    = isDark ? '#e2e8f0' : '#1e293b';

        const bigBg     = isRunning ? (isDark ? 'rgba(34,197,94,0.08)' : '#f0fdf4') : isIdle ? (isDark ? 'rgba(245,158,11,0.08)' : '#fffbeb') : (isDark ? 'rgba(100,116,139,0.07)' : '#f1f5f9');
        const bigBorder = isRunning ? (isDark ? 'rgba(34,197,94,0.18)' : '#86efac') : isIdle ? (isDark ? 'rgba(245,158,11,0.18)' : '#fcd34d') : (isDark ? 'rgba(100,116,139,0.15)' : '#cbd5e1');

        return (
          <div
            onClick={closeModal}
            style={{ position: 'fixed', inset: 0, background: isDark ? 'rgba(0,0,0,0.88)' : 'rgba(49,46,129,0.35)', backdropFilter: 'blur(10px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: 'clamp(12px,3vw,24px)' }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background: modalBg,
                backdropFilter: isDark ? 'blur(40px)' : 'none',
                WebkitBackdropFilter: isDark ? 'blur(40px)' : 'none',
                borderRadius: 'clamp(20px,3vw,26px)',
                maxWidth: '740px',
                width: '100%',
                maxHeight: '84vh',
                display: 'flex',
                flexDirection: 'column',
                border: `1px solid ${modalBorder}`,
                animation: 'modalPopIn 0.28s ease-out both',
                boxShadow: isDark ? '0 32px 80px rgba(0,0,0,0.7)' : '0 24px 60px rgba(49,46,129,0.18)',
                overflow: 'hidden',
              }}
            >
              {/* Top color bar */}
              <div style={{ height: '4px', background: stateGrad, flexShrink: 0 }} />

              {/* ── Sticky Header (does NOT scroll) ── */}
              <div style={{ padding: 'clamp(12px,2vw,16px) clamp(16px,3vw,20px)', borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.12)'}`, background: modalBg, flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <div style={{ padding: '9px', background: bigBg, borderRadius: '50%', border: `1px solid ${bigBorder}` }}>
                      <i className={isIdle ? 'bi bi-exclamation-triangle-fill' : isRunning ? 'bi bi-cpu' : 'bi bi-power'} style={{ fontSize: 'clamp(20px,3.5vw,26px)', color: statusColor }}></i>
                    </div>
                    <h2 style={{ margin: 0, fontSize: 'clamp(16px,3vw,22px)', fontWeight: 700, color: statusColor, fontFamily: "'Courier New',monospace" }}>
                      MACHINE {m.machine_no}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '40px', fontWeight: 700, fontSize: '11px', background: bigBg, border: `1px solid ${bigBorder}`, color: statusColor }}>
                      {isRunning && (<div style={{ position: 'relative', width: '8px', height: '8px' }}><div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(34,197,94,0.5)', animation: 'runningPing 1.4s ease-out infinite' }} /><div style={{ position: 'absolute', top: '1px', left: '1px', width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} /></div>)}
                      {isIdle && <i className="bi bi-pause-fill" style={{ fontSize: '11px' }}></i>}
                      {isOffline && <i className="bi bi-power" style={{ fontSize: '11px' }}></i>}
                      {status}
                    </div>
                    <div
                      onClick={e => { e.stopPropagation(); setShowChanges(!showChanges); }}
                      style={{ position: 'relative', cursor: 'pointer', background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.08)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(99,102,241,0.2)'}`, borderRadius: '50%', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: mLabelColor }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.18)'}
                      onMouseLeave={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.08)'}
                    >
                      <i className="bi bi-bell" style={{ fontSize: '13px' }}></i>
                      {machineChanges.length > 0 && <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: 'white', borderRadius: '50%', width: '15px', height: '15px', fontSize: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${modalBg}` }}>{machineChanges.length}</span>}
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    style={{ background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.08)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(99,102,241,0.2)'}`, color: mLabelColor, borderRadius: '50%', width: '34px', height: '34px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#ef4444'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.08)'; e.currentTarget.style.color = mLabelColor; }}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>

                {showChanges && (
                  <div style={{ marginTop: '10px', background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(99,102,241,0.04)', borderRadius: '14px', padding: '10px', maxHeight: '150px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ color: '#f59e0b', fontWeight: 600, fontSize: '12px' }}>Today's Changes (Shift {currentShift})</span>
                      <span style={{ background: machineChanges.length ? '#f59e0b' : '#cbd5e1', color: '#1e293b', padding: '2px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 700 }}>{machineChanges.length}</span>
                    </div>
                    {machineChanges.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '14px', color: mLabelColor }}>
                        <i className="bi bi-check-circle-fill" style={{ fontSize: '24px', marginBottom: '5px', display: 'block', color: '#22c55e' }}></i>
                        <div style={{ fontSize: '12px' }}>No changes today</div>
                      </div>
                    ) : machineChanges.map((c, i) => (
                      <div key={i} style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff', borderLeft: `3px solid ${isIdle ? '#f59e0b' : '#22c55e'}`, borderRadius: '10px', padding: '7px 10px', marginBottom: '5px' }}>
                        <div style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: mValColor }}>
                          <span><i className="bi bi-clock"></i> {c.time}</span>
                          <span style={{ fontSize: '9px', background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: '20px', color: mLabelColor }}>#{machineChanges.length - i}</span>
                        </div>
                        {c.height_changed && <div style={{ fontSize: '10px', color: mLabelColor, marginTop: '3px', background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.03)', padding: '4px 8px', borderRadius: '8px' }}>Height: <strong style={{ color: '#f59e0b' }}>{c.old_height.toFixed(2)}</strong> → <strong style={{ color: '#22c55e' }}>{c.new_height.toFixed(2)}</strong></div>}
                        {c.tool_changed && <div style={{ fontSize: '10px', color: mLabelColor, marginTop: '3px', background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.03)', padding: '4px 8px', borderRadius: '8px' }}>Tool ID changed</div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── SCROLLABLE BODY — flex:1 so it fills remaining height ── */}
              <div className="modal-body-scroll">

                {/* Big count — compact */}
                <div style={{ textAlign: 'center', padding: '16px 20px', background: bigBg, borderRadius: '20px', border: `1.5px solid ${bigBorder}` }}>
                  <i className="bi bi-box-seam" style={{ fontSize: '22px', marginBottom: '5px', display: 'block', color: statusColor }}></i>
                  <div style={{ fontSize: '10px', color: mLabelColor, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '5px', fontWeight: 700 }}>Current Hour Production</div>
                  <div style={{ fontSize: 'clamp(44px,8vw,64px)', fontWeight: 800, color: statusColor, fontFamily: "'Courier New',monospace", lineHeight: 1 }}>{m.current_hour_count || 0}</div>
                  <div style={{ fontSize: '10px', color: mLabelColor, marginTop: '5px' }}>Resets at top of every hour</div>
                </div>

                {/* Idle alert */}
                {m.machine_on && !m.is_producing && idle > 0 && (
                  <div style={{ padding: '14px 18px', background: isDark ? 'rgba(245,158,11,0.09)' : '#fffbeb', borderRadius: '18px', border: `2px solid ${isDark ? 'rgba(245,158,11,0.3)' : '#fcd34d'}`, textAlign: 'center' }}>
                    <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '18px', color: '#f59e0b', marginBottom: '5px', display: 'block' }}></i>
                    <div style={{ fontSize: '13px', color: '#f59e0b', marginBottom: '5px', fontWeight: 700 }}>MACHINE IDLE</div>
                    <div style={{ fontSize: 'clamp(30px,5.5vw,46px)', fontWeight: 800, color: isDark ? '#fbbf24' : '#b45309', fontFamily: "'Courier New',monospace", letterSpacing: '3px', animation: 'timerPulse 1s ease infinite' }}>
                      {formatLiveIdle(idle)}
                    </div>
                    <div style={{ fontSize: '10px', color: isDark ? 'rgba(245,158,11,0.7)' : '#92400e', marginTop: '5px' }}>No production since {m.last_activity}</div>
                  </div>
                )}

                {/* Customer + Tool */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '10px' }}>
                  {[
                    { title: 'Customer Info', icon: 'bi bi-people', rows: [['Customer', m.tool_customer], ['Model', m.tool_model]] },
                    { title: 'Tool Info', icon: 'bi bi-tools', rows: [['Part Name', m.tool_part_name], ['Tool Name', m.tool_name], ['Part No.', m.tool_part_number]] },
                  ].map((section, si) => (
                    <div key={si} style={{ padding: '14px', background: isDark ? 'rgba(255,255,255,0.04)' : '#eff6ff', borderRadius: '16px', border: `1.5px solid ${isDark ? 'rgba(59,130,246,0.18)' : '#bfdbfe'}` }}>
                      <h3 style={{ margin: '0 0 9px', fontSize: '11px', color: isDark ? '#60a5fa' : '#2563eb', textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <i className={section.icon} style={{ fontSize: '11px' }}></i>{section.title}
                      </h3>
                      {section.rows.map(([label, val]) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 9px', background: mFieldBg, border: `1px solid ${mFieldBorder}`, borderRadius: '9px', marginBottom: '5px', flexWrap: 'wrap', gap: '4px' }}>
                          <span style={{ color: mLabelColor, fontSize: '11px' }}>{label}</span>
                          <span style={{ fontWeight: 700, fontSize: '11px', color: mValColor }}>{val || 'N/A'}</span>
                        </div>
                      ))}
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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

=======
                {/* Specs + Footer stats — single row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: '10px' }}>
                  <div style={{ padding: '12px', background: isDark ? 'rgba(245,158,11,0.08)' : '#fffbeb', borderRadius: '16px', textAlign: 'center', border: `1.5px solid ${isDark ? 'rgba(245,158,11,0.2)' : '#fcd34d'}` }}>
                    <i className="bi bi-rulers" style={{ fontSize: '14px', color: '#f59e0b', marginBottom: '4px', display: 'block' }}></i>
                    <div style={{ fontSize: '9px', color: '#f59e0b', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Shut Hgt</div>
                    <div style={{ fontSize: 'clamp(18px,3.5vw,24px)', fontWeight: 700, color: isDark ? '#fbbf24' : '#b45309' }}>
                      {typeof m.shut_height === 'number' ? m.shut_height.toFixed(2) : m.shut_height || 'N/A'}
                    </div>
                  </div>
                  <div style={{ padding: '12px', background: isDark ? 'rgba(34,197,94,0.08)' : '#f0fdf4', borderRadius: '16px', textAlign: 'center', border: `1.5px solid ${isDark ? 'rgba(34,197,94,0.2)' : '#86efac'}` }}>
                    <i className="bi bi-wrench" style={{ fontSize: '14px', color: '#22c55e', marginBottom: '4px', display: 'block' }}></i>
                    <div style={{ fontSize: '9px', color: '#22c55e', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Tool ID</div>
                    <div style={{ fontSize: 'clamp(10px,1.8vw,13px)', fontWeight: 700, color: isDark ? '#4ade80' : '#15803d', wordBreak: 'break-all' }}>{m.tool_id || 'N/A'}</div>
                  </div>
                  <div style={{ padding: '12px', background: isDark ? 'rgba(255,255,255,0.04)' : '#eff6ff', borderRadius: '16px', textAlign: 'center', border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.07)' : '#bfdbfe'}` }}>
                    <i className="bi bi-graph-down" style={{ fontSize: '14px', color: isDark ? mValColor : '#2563eb', marginBottom: '4px', display: 'block' }}></i>
                    <div style={{ fontSize: '9px', color: isDark ? mValColor : '#2563eb', marginBottom: '3px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Last Hour</div>
                    <div style={{ fontSize: 'clamp(18px,3.5vw,24px)', fontWeight: 700, color: isDark ? mValColor : '#1d4ed8' }}>{m.last_hour_count ?? 0}</div>
                  </div>
                  <div style={{ padding: '12px', background: isDark ? 'rgba(34,197,94,0.08)' : '#f0fdf4', borderRadius: '16px', textAlign: 'center', border: `1.5px solid ${isDark ? 'rgba(34,197,94,0.2)' : '#86efac'}` }}>
                    <i className="bi bi-graph-up" style={{ fontSize: '14px', color: isDark ? '#4ade80' : '#15803d', marginBottom: '4px', display: 'block' }}></i>
                    <div style={{ fontSize: '9px', color: isDark ? '#4ade80' : '#15803d', marginBottom: '3px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Cumulative</div>
                    <div style={{ fontSize: 'clamp(18px,3.5vw,24px)', fontWeight: 700, color: isDark ? '#4ade80' : '#15803d' }}>{m.cumulative_count ?? 0}</div>
                  </div>
                  <div style={{ padding: '12px', background: isDark ? 'rgba(245,158,11,0.08)' : '#fffbeb', borderRadius: '16px', textAlign: 'center', border: `1.5px solid ${isDark ? 'rgba(245,158,11,0.2)' : '#fcd34d'}` }}>
                    <i className="bi bi-hourglass-split" style={{ fontSize: '14px', color: isDark ? '#fbbf24' : '#b45309', marginBottom: '4px', display: 'block' }}></i>
                    <div style={{ fontSize: '9px', color: isDark ? '#fbbf24' : '#b45309', marginBottom: '3px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>Total Idle</div>
                    <div style={{ fontSize: 'clamp(18px,3.5vw,24px)', fontWeight: 700, color: isDark ? '#fbbf24' : '#b45309' }}>{m.total_shift_idle_time || 0}m</div>
                  </div>
                </div>

              </div>{/* end .modal-body-scroll */}
>>>>>>> Stashed changes
            </div>
          </div>
        );
      })()}
    </div>
  );
<<<<<<< Updated upstream
}


=======
}
>>>>>>> Stashed changes
