import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail, Phone, Send, CheckCircle2,
  ThumbsUp, ThumbsDown, ArrowUpRight, Cpu, Radio,
  ShieldCheck, Layers, MessageCircle, Bug, Lightbulb,
} from 'lucide-react';
import Sidebar from './Sidebar';

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
// Palette: deep navy-void bg, electric cyan primary, ice-white text
// No violet, no rose, no pink — clean, industrial-tech feel
const T = {
  void:    '#060a12',      // page background — deep navy void
  panel:   '#0b1120',      // card backgrounds
  surface: '#0f1628',      // secondary surfaces
  rim:     '#1a2540',      // default borders
  rimHot:  '#1e3a5f',      // hover/active borders
  cyan:    '#06b6d4',      // primary accent — electric cyan
  cyanDim: '#0e7490',      // accent dimmed
  cyanGlow:'rgba(6,182,212,0.18)',
  blue:    '#3b82f6',      // secondary accent — electric blue
  emerald: '#10b981',      // success / operational green
  amber:   '#f59e0b',      // warning / medium priority
  crimson: '#ef4444',      // high priority
  // TEXT — clear 3-level hierarchy
  hi:      '#e8f4f8',      // primary text — near white with cool tint
  mid:     '#7aa3be',      // secondary text — blue-grey
  lo:      '#354f6b',      // muted / disabled text
  // SURFACES
  ghost:   '#0d1829',      // input backgrounds
  hover:   '#111f35',      // hover state surface
};

// ─── ANIMATED MESH CANVAS ─────────────────────────────────────────────────────
function MeshCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf, t = 0;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const draw = () => {
      t += 0.003;
      const { width: w, height: h } = canvas;
      ctx.clearRect(0, 0, w, h);
      // orb 1 — cyan
      const g1 = ctx.createRadialGradient(
        w*(0.25+0.12*Math.sin(t)), h*(0.3+0.1*Math.cos(t*0.8)), 0,
        w*(0.25+0.12*Math.sin(t)), h*(0.3+0.1*Math.cos(t*0.8)), w*0.6
      );
      g1.addColorStop(0, 'rgba(6,182,212,0.22)');
      g1.addColorStop(1, 'rgba(6,182,212,0)');
      ctx.fillStyle = g1; ctx.fillRect(0,0,w,h);
      // orb 2 — blue
      const g2 = ctx.createRadialGradient(
        w*(0.75+0.08*Math.cos(t*1.2)), h*(0.6+0.12*Math.sin(t*0.7)), 0,
        w*(0.75+0.08*Math.cos(t*1.2)), h*(0.6+0.12*Math.sin(t*0.7)), w*0.5
      );
      g2.addColorStop(0, 'rgba(59,130,246,0.18)');
      g2.addColorStop(1, 'rgba(59,130,246,0)');
      ctx.fillStyle = g2; ctx.fillRect(0,0,w,h);
      // orb 3 — top highlight
      const g3 = ctx.createRadialGradient(w*0.5, 0, 0, w*0.5, 0, w*0.35);
      g3.addColorStop(0, 'rgba(6,182,212,0.08)');
      g3.addColorStop(1, 'rgba(6,182,212,0)');
      ctx.fillStyle = g3; ctx.fillRect(0,0,w,h);
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} />;
}

// ─── FLOATING LABEL FIELD ─────────────────────────────────────────────────────
function FloatField({ label, name, type='text', value, onChange, required, textarea }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div style={{ position:'relative' }}>
      <label style={{
        position:'absolute', left:16, zIndex:2, pointerEvents:'none',
        top: active ? 7 : (textarea ? 16 : '50%'),
        transform: active ? 'none' : (textarea ? 'none' : 'translateY(-50%)'),
        fontSize: active ? 9 : 13,
        fontWeight: active ? 800 : 400,
        letterSpacing: active ? '0.1em' : '0',
        color: active ? (focused ? T.cyan : T.mid) : T.lo,
        textTransform: active ? 'uppercase' : 'none',
        transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
      }}>{label}</label>
      {textarea ? (
        <textarea name={name} value={value} onChange={onChange} rows={5} required={required}
          onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
          style={{
            width:'100%', background:T.ghost, resize:'none', fontFamily:'inherit',
            border:`1.5px solid ${focused ? T.cyan : T.rim}`,
            borderRadius:12, padding:'22px 16px 10px', color:T.hi, fontSize:14,
            outline:'none', transition:'border-color 0.2s, box-shadow 0.2s',
            boxShadow: focused ? `0 0 0 3px rgba(6,182,212,0.12)` : 'none',
          }}
        />
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} required={required}
          onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
          style={{
            width:'100%', background:T.ghost,
            border:`1.5px solid ${focused ? T.cyan : T.rim}`,
            borderRadius:12, padding:'22px 16px 8px', color:T.hi, fontSize:14,
            outline:'none', transition:'border-color 0.2s, box-shadow 0.2s', fontFamily:'inherit',
            boxShadow: focused ? `0 0 0 3px rgba(6,182,212,0.12)` : 'none',
          }}
        />
      )}
    </div>
  );
}

// ─── FAQ DATA ─────────────────────────────────────────────────────────────────
const FAQ = [
  { q:'How do I reset my password?',          a:'Go to Settings → Security → Update Password. A magic-link lands in your inbox within 30 seconds; it expires after 30 minutes and immediately invalidates the old password.' },
  { q:'How do I assign operators to machines?',a:'Open Operator Assignment in the left nav. Drag any operator card onto a machine slot — changes persist in real time. Use ⌘+click for bulk selection.' },
  { q:'What browsers are supported?',          a:'Chrome 110+, Firefox 115+, Safari 16+, and Edge 110+. Chrome gives the best performance on dense production dashboards.' },
  { q:'How do I export production reports?',   a:'From the Dashboard, click the ↓ icon on any analytics panel. Choose PDF or CSV, set a date range, and hit Download. Scheduled exports go to your inbox automatically.' },
  { q:'Can I invite team members?',            a:'Settings → Team → Invite. Role-based access links expire after 24 hours. Admins can set machine-level permissions per user after they join.' },
  { q:'Is my data backed up automatically?',   a:'Yes — real-time replication across three availability zones. Point-in-time recovery for the past 30 days is available under Admin → Data & Backups.' },
];

// ─── ACCORDION ROW ────────────────────────────────────────────────────────────
function AccordionRow({ item, idx }) {
  const [open, setOpen] = useState(false);
  const [vote, setVote] = useState(null);
  return (
    <motion.div
      initial={{ opacity:0, y:10 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay: idx*0.055, duration:0.35 }}
      style={{ borderBottom:`1px solid ${T.rim}`, overflow:'hidden' }}
    >
      <button
        onClick={()=>setOpen(v=>!v)}
        style={{
          width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
          gap:16, padding:'19px 0', background:'none', border:'none', cursor:'pointer', textAlign:'left',
        }}
      >
        <span style={{
          fontSize:14, fontWeight:600, lineHeight:1.5,
          color: open ? T.hi : T.mid,
          transition:'color 0.2s',
        }}>{item.q}</span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration:0.25 }}
          style={{
            flexShrink:0, width:26, height:26, borderRadius:'50%',
            background: open ? T.cyan : T.ghost,
            border:`1px solid ${open ? T.cyan : T.rim}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow: open ? `0 0 12px rgba(6,182,212,0.35)` : 'none',
            transition:'background 0.2s, border-color 0.2s, box-shadow 0.2s',
          }}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <line x1="5.5" y1="1" x2="5.5" y2="10" stroke={open?T.void:T.lo} strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="1" y1="5.5" x2="10" y2="5.5" stroke={open?T.void:T.lo} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="body"
            initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
            transition={{ duration:0.3, ease:[0.4,0,0.2,1] }}
          >
            <div style={{ paddingBottom:20 }}>
              {/* answer with left accent bar */}
              <div style={{
                borderLeft:`2px solid ${T.cyan}`,
                paddingLeft:16, marginBottom:14,
              }}>
                <p style={{ fontSize:13, color:T.mid, lineHeight:1.75, margin:0 }}>{item.a}</p>
              </div>
              {/* feedback */}
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:11, color:T.lo, letterSpacing:'0.04em' }}>Was this helpful?</span>
                {vote === null ? (
                  <>
                    {[['y','Yes',T.emerald,ThumbsUp],['n','No',T.crimson,ThumbsDown]].map(([v,lbl,col,Icon])=>(
                      <button key={v} onClick={()=>setVote(v)}
                        style={{
                          display:'flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600,
                          color:T.lo, background:T.ghost, border:`1px solid ${T.rim}`,
                          borderRadius:20, padding:'4px 10px', cursor:'pointer', transition:'all 0.15s',
                        }}
                        onMouseEnter={e=>{e.currentTarget.style.borderColor=col;e.currentTarget.style.color=col;}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor=T.rim;e.currentTarget.style.color=T.lo;}}
                      >
                        <Icon size={11}/>{lbl}
                      </button>
                    ))}
                  </>
                ) : (
                  <motion.span initial={{opacity:0,scale:0.85}} animate={{opacity:1,scale:1}}
                    style={{ fontSize:11, fontWeight:600, color: vote==='y'?T.emerald:T.crimson, display:'flex', alignItems:'center', gap:5 }}
                  >
                    <CheckCircle2 size={11}/>
                    {vote==='y' ? 'Glad it helped!' : "Thanks — we'll improve this."}
                  </motion.span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
const CATS = [
  { id:'general',   label:'General',   Icon:MessageCircle },
  { id:'technical', label:'Technical', Icon:Cpu           },
  { id:'bug',       label:'Bug Report',Icon:Bug           },
  { id:'feature',   label:'Feature',   Icon:Lightbulb     },
];

const PRIO = {
  low:    { label:'Low',    grad:`linear-gradient(135deg,#065f46,${T.emerald})`, glow:'rgba(16,185,129,0.3)' },
  medium: { label:'Medium', grad:`linear-gradient(135deg,#92400e,${T.amber})`,   glow:'rgba(245,158,11,0.3)'  },
  high:   { label:'High',   grad:`linear-gradient(135deg,#991b1b,${T.crimson})`, glow:'rgba(239,68,68,0.3)'   },
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Support({ onLogout }) {
  const [tab,      setTab]      = useState('form');
  const [cat,      setCat]      = useState('general');
  const [priority, setPriority] = useState('medium');
  const [form,     setForm]     = useState({ name:'', email:'', subject:'', message:'' });
  const [done,     setDone]     = useState(false);
  const [tickIdx,  setTickIdx]  = useState(0);

  const TICKERS = ['All systems operational','Avg. response: 47 min','99.98% uptime this month','12 engineers online now'];
  useEffect(() => {
    const id = setInterval(()=>setTickIdx(i=>(i+1)%TICKERS.length), 3000);
    return ()=>clearInterval(id);
  }, [TICKERS.length]);

  const handleChange = e => setForm(p=>({...p,[e.target.name]:e.target.value}));
  const handleSubmit = e => {
    e.preventDefault();
    setDone(true);
    setTimeout(()=>{ setDone(false); setForm({name:'',email:'',subject:'',message:''}); }, 3800);
  };

  // shared card style
  const card = (extra={}) => ({
    background:T.panel, border:`1px solid ${T.rim}`, borderRadius:20, ...extra,
  });

  return (
    <div style={{ minHeight:'100vh', background:T.void, display:'flex', position:'relative' }}>
      <Sidebar onLogout={onLogout} />

      <div style={{ flex:1, overflow:'auto', position:'relative', zIndex:10 }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'40px 32px 60px' }}>

          {/* ══════════ HERO SPLIT ══════════ */}
          <div style={{
            display:'grid', gridTemplateColumns:'1fr 1fr', gap:2,
            borderRadius:22, overflow:'hidden', border:`1px solid ${T.rimHot}`,
            marginBottom:22, minHeight:252,
          }}>
            {/* LEFT — identity / brand panel */}
            <div style={{ position:'relative', background:T.panel, overflow:'hidden', padding:'44px 44px 44px' }}>
              <MeshCanvas/>
              {/* Ghost typographic element */}
              <div style={{
                position:'absolute', right:-16, bottom:-52,
                fontSize:210, fontWeight:900, lineHeight:1,
                color:'rgba(6,182,212,0.045)',
                fontFamily:'Georgia,serif', fontStyle:'italic',
                userSelect:'none', pointerEvents:'none', letterSpacing:'-0.04em',
              }}>2h</div>

              <div style={{ position:'relative', zIndex:2 }}>
                {/* eyebrow */}
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:22 }}>
                  <div style={{
                    width:6, height:6, borderRadius:'50%', background:T.cyan,
                    boxShadow:`0 0 10px ${T.cyan}`,
                  }}/>
                  <span style={{ fontSize:10, fontWeight:800, letterSpacing:'0.2em', color:T.lo, textTransform:'uppercase' }}>
                    AtomOne Technologies
                  </span>
                </div>

                {/* headline */}
                <h1 style={{
                  fontSize:40, fontWeight:900, lineHeight:1.06, letterSpacing:'-0.03em', margin:'0 0 12px',
                  // crisp white to cyan — no pink, no violet
                  background:`linear-gradient(135deg, ${T.hi} 50%, ${T.cyan} 100%)`,
                  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                }}>
                  How can<br/>we help?
                </h1>
                <p style={{ fontSize:13, color:T.mid, lineHeight:1.7, maxWidth:260, margin:'0 0 30px' }}>
                  Our engineering team is standing by. Tell us what's happening and we'll handle the rest.
                </p>

                {/* live ticker */}
                <div style={{
                  display:'inline-flex', alignItems:'center', gap:8,
                  background:'rgba(6,182,212,0.08)', border:`1px solid rgba(6,182,212,0.22)`,
                  borderRadius:30, padding:'7px 16px',
                }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:T.emerald, boxShadow:`0 0 8px ${T.emerald}`, flexShrink:0 }}/>
                  <AnimatePresence mode="wait">
                    <motion.span key={tickIdx}
                      initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}}
                      transition={{duration:0.28}}
                      style={{ fontSize:11, fontWeight:700, color:T.cyan, whiteSpace:'nowrap' }}
                    >
                      {TICKERS[tickIdx]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* RIGHT — contact channels */}
            <div style={{ background:T.surface, display:'flex', flexDirection:'column' }}>
              {[
                { Icon:Mail,       label:'Email us',      value:'AmanPal@atomone.in', sub:'Detailed, async help',    href:'mailto:AmanPal@atomone.in', accent:T.cyan    },
                { Icon:Phone,      label:'Call us',       value:'+91 XXXXXXXXXX',    sub:'Immediate escalation',    href:'tel:+91XXXXXXXXXX',         accent:T.blue    },
                { Icon:ShieldCheck,label:'SLA guarantee', value:'Under 2 hours',      sub:'Avg. actual: 47 min',     href:null,                        accent:T.emerald },
              ].map(({ Icon, label, value, sub, href, accent },i)=>(
                <div key={label}
                  style={{
                    flex:1, padding:'26px 36px',
                    borderBottom: i<2?`1px solid ${T.rim}`:'none',
                    display:'flex', alignItems:'center', gap:18,
                    transition:'background 0.18s', cursor: href?'pointer':'default',
                  }}
                  onMouseEnter={e=>{ e.currentTarget.style.background='rgba(255,255,255,0.018)'; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; }}
                  onClick={()=>href&&window.open(href)}
                >
                  <div style={{
                    width:42, height:42, borderRadius:11, flexShrink:0,
                    background:`${accent}16`, border:`1px solid ${accent}28`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <Icon size={17} color={accent}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:10, color:T.lo, fontWeight:800, letterSpacing:'0.1em', textTransform:'uppercase', margin:'0 0 2px' }}>{label}</p>
                    <p style={{ fontSize:15, fontWeight:700, color:T.hi, margin:'0 0 1px' }}>{value}</p>
                    <p style={{ fontSize:11, color:T.lo, margin:0 }}>{sub}</p>
                  </div>
                  {href && <ArrowUpRight size={15} color={T.lo}/>}
                </div>
              ))}
            </div>
          </div>

          {/* ══════════ TAB SWITCHER ══════════ */}
          <div style={{
            display:'inline-flex', gap:3,
            background:T.panel, border:`1px solid ${T.rim}`,
            borderRadius:14, padding:4, marginBottom:18,
          }}>
            {[{id:'form',label:'Submit a Request'},{id:'faq',label:'Browse FAQ'}].map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)}
                style={{
                  padding:'9px 22px', borderRadius:10, fontSize:13, fontWeight:700,
                  border:'none', cursor:'pointer', transition:'all 0.2s',
                  background: tab===t.id ? T.cyan : 'transparent',
                  color: tab===t.id ? T.void : T.lo,
                  boxShadow: tab===t.id ? `0 3px 18px rgba(6,182,212,0.35)` : 'none',
                  letterSpacing: '0.02em',
                }}
              >{t.label}</button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* ════════ FORM TAB ════════ */}
            {tab==='form' && (
              <motion.div key="form"
                initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
                transition={{duration:0.28}}
                style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:16, alignItems:'start' }}
              >
                {/* Main form */}
                <div style={{...card(), padding:'34px 36px 30px', position:'relative', overflow:'hidden'}}>
                  {/* top accent line */}
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(to right, ${T.cyan}, ${T.blue}, transparent)` }}/>

                  {/* Category pills */}
                  <div style={{ display:'flex', gap:6, marginBottom:28, flexWrap:'wrap' }}>
                    {CATS.map(({id,label,Icon})=>(
                      <button key={id} onClick={()=>setCat(id)}
                        style={{
                          display:'flex', alignItems:'center', gap:7,
                          padding:'8px 16px', borderRadius:30, fontSize:12, fontWeight:700,
                          border:`1.5px solid ${cat===id ? T.cyan : T.rim}`,
                          background: cat===id ? 'rgba(6,182,212,0.12)' : T.ghost,
                          color: cat===id ? T.cyan : T.lo,
                          cursor:'pointer', transition:'all 0.18s',
                          boxShadow: cat===id ? `0 0 14px rgba(6,182,212,0.18)` : 'none',
                        }}
                      >
                        <Icon size={13}/>{label}
                      </button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {done ? (
                      <motion.div key="done"
                        initial={{opacity:0,scale:0.93}} animate={{opacity:1,scale:1}} exit={{opacity:0}}
                        style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'54px 0', gap:14 }}
                      >
                        <motion.div
                          initial={{scale:0}} animate={{scale:1}}
                          transition={{type:'spring',stiffness:260,damping:16}}
                          style={{
                            width:68, height:68, borderRadius:'50%',
                            background:`rgba(6,182,212,0.1)`, border:`1.5px solid rgba(6,182,212,0.4)`,
                            display:'flex', alignItems:'center', justifyContent:'center',
                            boxShadow:`0 0 32px rgba(6,182,212,0.2)`,
                          }}
                        >
                          <CheckCircle2 size={30} color={T.cyan}/>
                        </motion.div>
                        <p style={{ fontSize:18, fontWeight:800, color:T.hi, margin:0 }}>Request received.</p>
                        <p style={{ fontSize:13, color:T.mid, margin:0, textAlign:'center', maxWidth:300, lineHeight:1.65 }}>
                          We'll reply within 2 hours. A ticket ID has been sent to your email.
                        </p>
                      </motion.div>
                    ) : (
                      <motion.form key="f" initial={{opacity:0}} animate={{opacity:1}} onSubmit={handleSubmit}>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                          <FloatField label="Full Name"     name="name"    value={form.name}    onChange={handleChange} required/>
                          <FloatField label="Email Address" name="email"   value={form.email}   onChange={handleChange} type="email" required/>
                        </div>
                        <div style={{ marginBottom:14 }}>
                          <FloatField label="Subject"       name="subject" value={form.subject} onChange={handleChange} required/>
                        </div>

                        {/* Priority */}
                        <div style={{ marginBottom:14 }}>
                          <p style={{ fontSize:9, fontWeight:800, letterSpacing:'0.12em', textTransform:'uppercase', color:T.lo, margin:'0 0 10px' }}>Priority</p>
                          <div style={{ display:'flex', gap:8 }}>
                            {Object.entries(PRIO).map(([k,v])=>(
                              <button type="button" key={k} onClick={()=>setPriority(k)}
                                style={{
                                  flex:1, padding:'10px 0', borderRadius:10, fontSize:12, fontWeight:700,
                                  border:'none', cursor:'pointer', transition:'all 0.2s',
                                  background: priority===k ? v.grad : T.ghost,
                                  color: priority===k ? '#fff' : T.lo,
                                  boxShadow: priority===k ? `0 4px 16px ${v.glow}` : 'none',
                                  transform: priority===k ? 'translateY(-1px)' : 'none',
                                }}
                              >{v.label}</button>
                            ))}
                          </div>
                        </div>

                        <div style={{ marginBottom:22 }}>
                          <FloatField label="Describe your issue" name="message" value={form.message} onChange={handleChange} textarea required/>
                        </div>

                        <button type="submit"
                          style={{
                            width:'100%', padding:'15px', borderRadius:13, fontSize:14, fontWeight:800,
                            border:'none', cursor:'pointer',
                            background:`linear-gradient(135deg, ${T.cyanDim}, ${T.cyan})`,
                            color:T.void,
                            display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                            boxShadow:`0 5px 28px rgba(6,182,212,0.38)`,
                            letterSpacing:'0.04em', transition:'transform 0.15s, box-shadow 0.15s',
                          }}
                          onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow=`0 10px 38px rgba(6,182,212,0.55)`;}}
                          onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow=`0 5px 28px rgba(6,182,212,0.38)`;}}
                        >
                          <Send size={14}/>Send Request
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>

                {/* Sidebar */}
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  {/* Status */}
                  <div style={{...card(), padding:'24px 24px 18px', position:'relative', overflow:'hidden'}}>
                    <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(to right, ${T.cyan}, ${T.blue})` }}/>
                    <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:16 }}>
                      <Radio size={12} color={T.cyan}/>
                      <span style={{ fontSize:9, fontWeight:800, letterSpacing:'0.15em', textTransform:'uppercase', color:T.lo }}>Live Status</span>
                    </div>
                    {['API & Core Services','Analytics Engine','Machine Data Sync','Report Export','Notification Service'].map(svc=>(
                      <div key={svc} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 0', borderBottom:`1px solid ${T.rim}` }}>
                        <span style={{ fontSize:12, color:T.mid }}>{svc}</span>
                        <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:10, fontWeight:800, color:T.emerald }}>
                          <span style={{ width:5, height:5, borderRadius:'50%', background:T.emerald, display:'inline-block' }}/>
                          Operational
                        </span>
                      </div>
                    ))}
                    <p style={{ fontSize:10, color:T.lo, marginTop:10, marginBottom:0, textAlign:'right' }}>Last checked 2 min ago</p>
                  </div>

                  {/* Tips */}
                  <div style={{...card(), padding:'22px 24px'}}>
                    <p style={{ fontSize:9, fontWeight:800, letterSpacing:'0.15em', textTransform:'uppercase', color:T.lo, margin:'0 0 14px' }}>
                      ⚡ Get faster help
                    </p>
                    {[
                      'Include your browser & OS version.',
                      'Attach a screenshot for visual issues.',
                      'Paste the exact error message text.',
                      'Note which machine ID is affected.',
                    ].map((tip,i)=>(
                      <div key={i} style={{ display:'flex', gap:10, marginBottom:i<3?11:0, alignItems:'flex-start' }}>
                        <span style={{
                          fontSize:9, fontWeight:900, color:T.cyan,
                          background:'rgba(6,182,212,0.1)', border:`1px solid rgba(6,182,212,0.22)`,
                          borderRadius:4, padding:'2px 6px', flexShrink:0, marginTop:1,
                        }}>{i+1}</span>
                        <p style={{ fontSize:12, color:T.mid, margin:0, lineHeight:1.6 }}>{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ════════ FAQ TAB ════════ */}
            {tab==='faq' && (
              <motion.div key="faq"
                initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
                transition={{duration:0.28}}
                style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0 }}
              >
                {/* Left col */}
                <div style={{
                  ...card(), borderRadius:'20px 0 0 20px', padding:'36px 40px',
                  borderRight:'none', borderTopRightRadius:0, borderBottomRightRadius:0,
                  position:'relative', overflow:'hidden',
                }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(to right, ${T.cyan}, transparent)` }}/>
                  <p style={{ fontSize:9, fontWeight:800, letterSpacing:'0.15em', textTransform:'uppercase', color:T.cyan, margin:'0 0 8px' }}>Knowledge Base</p>
                  <h2 style={{ fontSize:24, fontWeight:900, color:T.hi, letterSpacing:'-0.03em', margin:'0 0 8px' }}>Quick answers</h2>
                  <p style={{ fontSize:13, color:T.mid, margin:'0 0 30px', lineHeight:1.68 }}>
                    Most issues are resolved here in under a minute. Browse before submitting a ticket.
                  </p>
                  {FAQ.slice(0,3).map((item,i)=><AccordionRow key={i} item={item} idx={i}/>)}
                </div>

                {/* Right col */}
                <div style={{
                  background:T.surface, border:`1px solid ${T.rim}`,
                  borderRadius:'0 20px 20px 0', padding:'36px 40px',
                  borderLeft:'none',
                }}>
                  {/* nudge card */}
                  <div style={{
                    background:`linear-gradient(135deg, rgba(6,182,212,0.09), rgba(59,130,246,0.07))`,
                    border:`1px solid rgba(6,182,212,0.18)`,
                    borderRadius:14, padding:'18px 20px', marginBottom:28,
                    display:'flex', alignItems:'center', gap:14,
                  }}>
                    <Layers size={20} color={T.cyan}/>
                    <div style={{ flex:1 }}>
                      <p style={{ fontSize:13, fontWeight:800, color:T.hi, margin:'0 0 2px' }}>Still stuck?</p>
                      <p style={{ fontSize:11, color:T.mid, margin:0 }}>Submit a ticket — avg. 47 min response</p>
                    </div>
                    <button onClick={()=>setTab('form')}
                      style={{
                        padding:'7px 14px', borderRadius:8,
                        background:T.cyan, border:'none', color:T.void,
                        fontSize:11, fontWeight:800, cursor:'pointer', whiteSpace:'nowrap',
                        boxShadow:`0 3px 14px rgba(6,182,212,0.3)`,
                      }}
                    >Open ticket →</button>
                  </div>
                  {FAQ.slice(3).map((item,i)=><AccordionRow key={i+3} item={item} idx={i}/>)}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}