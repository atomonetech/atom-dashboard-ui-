import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail, Phone, Send, CheckCircle2,
  ThumbsUp, ThumbsDown, ArrowUpRight, Cpu, Radio,
  ShieldCheck, Layers, MessageCircle, Bug, Lightbulb, Activity,
} from 'lucide-react';
import Sidebar from './Sidebar';

// ─── ENTERPRISE DESIGN TOKENS (LIGHT THEME) ──────────────────────────────────
const T = {
  void:    '#f8fafc', 
  panel:   '#ffffff', 
  surface: '#f1f5f9', 
  rim:     '#e2e8f0', 
  rimHot:  '#cbd5e1', 
  cyan:    '#3b82f6', 
  cyanDim: '#eff6ff', 
  blue:    '#2563eb', 
  emerald: '#10b981', 
  amber:   '#f59e0b', 
  crimson: '#ef4444', 
  hi:      '#0f172a', 
  mid:     '#475569', 
  lo:      '#64748b', 
  ghost:   '#f8fafc', 
};

// ─── SUBTLE MESH CANVAS ───────────────────────────────────────────────────────
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
      t += 0.002;
      const { width: w, height: h } = canvas;
      ctx.clearRect(0, 0, w, h);
      
      const g1 = ctx.createRadialGradient(
        w*(0.25+0.12*Math.sin(t)), h*(0.3+0.1*Math.cos(t*0.8)), 0,
        w*(0.25+0.12*Math.sin(t)), h*(0.3+0.1*Math.cos(t*0.8)), w*0.6
      );
      g1.addColorStop(0, 'rgba(59, 130, 246, 0.06)'); 
      g1.addColorStop(1, 'rgba(59, 130, 246, 0)');
      ctx.fillStyle = g1; ctx.fillRect(0,0,w,h);
      
      const g2 = ctx.createRadialGradient(
        w*(0.75+0.08*Math.cos(t*1.2)), h*(0.6+0.12*Math.sin(t*0.7)), 0,
        w*(0.75+0.08*Math.cos(t*1.2)), h*(0.6+0.12*Math.sin(t*0.7)), w*0.5
      );
      g2.addColorStop(0, 'rgba(14, 165, 233, 0.04)'); 
      g2.addColorStop(1, 'rgba(14, 165, 233, 0)');
      ctx.fillStyle = g2; ctx.fillRect(0,0,w,h);
      
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity: 1 }} />;
}

// ─── PROFESSIONAL INPUT FIELD (SCALED DOWN) ───────────────────────────────────
function FormInput({ label, name, type='text', value, onChange, required, textarea }) {
  const [focused, setFocused] = useState(false);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
      <label style={{
        fontSize: 11, fontWeight: 600, color: focused ? T.cyan : T.mid,
        transition: 'color 0.2s', letterSpacing: '0.02em'
      }}>
        {label} {required && <span style={{ color: T.crimson }}>*</span>}
      </label>
      
      {textarea ? (
        <textarea name={name} value={value} onChange={onChange} rows={4} required={required}
          onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
          style={{
            width:'100%', background:T.ghost, resize:'vertical', fontFamily:'inherit',
            border:`1px solid ${focused ? T.cyan : T.rim}`,
            borderRadius: 6, padding:'10px 12px', color:T.hi, fontSize:12,
            outline:'none', transition:'all 0.2s',
            boxShadow: focused ? `0 0 0 3px rgba(59, 130, 246, 0.15)` : 'none',
            display: 'block'
          }}
        />
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} required={required}
          onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
          style={{
            width:'100%', background:T.ghost,
            border:`1px solid ${focused ? T.cyan : T.rim}`,
            borderRadius: 6, padding:'10px 12px', color:T.hi, fontSize:12,
            outline:'none', transition:'all 0.2s', fontFamily:'inherit',
            boxShadow: focused ? `0 0 0 3px rgba(59, 130, 246, 0.15)` : 'none',
            display: 'block'
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

// ─── ACCORDION ROW (SCALED DOWN) ──────────────────────────────────────────────
function AccordionRow({ item, idx }) {
  const [open, setOpen] = useState(false);
  const [vote, setVote] = useState(null);
  
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 860);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.div
      initial={{ opacity:0, y:10 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay: idx*0.05, duration:0.3 }}
      style={{ borderBottom:`1px solid ${T.rim}`, overflow:'hidden' }}
    >
      <button
        type="button"
        onClick={()=>setOpen(v=>!v)}
        style={{
          width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between',
          gap:12, padding: isMobile ? '12px 0' : '16px 0', background:'none', border:'none', cursor:'pointer', textAlign:'left',
        }}
      >
        <span style={{
          fontSize:13, fontWeight:600, lineHeight:1.5,
          color: open ? T.hi : T.mid,
          transition:'color 0.2s',
        }}>{item.q}</span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration:0.2 }}
          style={{
            flexShrink:0, width:20, height:20, borderRadius: 4,
            background: open ? T.surface : 'transparent',
            border:`1px solid ${open ? T.rimHot : 'transparent'}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            color: open ? T.hi : T.lo,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <line x1="6" y1="2" x2="6" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="2" y1="6" x2="10" y2="6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
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
              <div style={{
                borderLeft:`2px solid ${T.cyan}`,
                paddingLeft:12, marginBottom:12,
              }}>
                <p style={{ fontSize:12, color:T.mid, lineHeight:1.6, margin:0 }}>{item.a}</p>
              </div>
              <div style={{ display:'flex', alignItems: isMobile ? 'flex-start' : 'center', gap:10, flexDirection: isMobile ? 'column' : 'row' }}>
                <span style={{ fontSize:11, color:T.lo, fontWeight: 500 }}>Was this helpful?</span>
                {vote === null ? (
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[['y','Yes',T.emerald,ThumbsUp],['n','No',T.crimson,ThumbsDown]].map(([v,lbl,col,Icon])=>(
                      <button key={v} onClick={()=>setVote(v)} type="button"
                        style={{
                          display:'flex', alignItems:'center', gap:4, fontSize:11, fontWeight:600,
                          color:T.mid, background:T.panel, border:`1px solid ${T.rim}`,
                          borderRadius: 4, padding:'4px 8px', cursor:'pointer', transition:'all 0.15s',
                        }}
                        onMouseEnter={e=>{e.currentTarget.style.borderColor=col;e.currentTarget.style.color=col; e.currentTarget.style.background=T.surface;}}
                        onMouseLeave={e=>{e.currentTarget.style.borderColor=T.rim;e.currentTarget.style.color=T.mid; e.currentTarget.style.background=T.panel;}}
                      >
                        <Icon size={10}/>{lbl}
                      </button>
                    ))}
                  </div>
                ) : (
                  <motion.span initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}}
                    style={{ fontSize:11, fontWeight:600, color: vote==='y'?T.emerald:T.crimson, display:'flex', alignItems:'center', gap:4 }}
                  >
                    <CheckCircle2 size={12}/>
                    {vote==='y' ? 'Thank you for your feedback.' : "Thanks, we'll improve this."}
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
  { id:'general',   label:'General Inquiry', Icon:MessageCircle },
  { id:'technical', label:'Technical Issue', Icon:Cpu           },
  { id:'bug',       label:'Bug Report',      Icon:Bug           },
  { id:'feature',   label:'Feature Request', Icon:Lightbulb     },
];

const PRIO = {
  low:    { label:'Low Priority',    color: T.emerald },
  medium: { label:'Medium Priority', color: T.amber   },
  high:   { label:'High Priority',   color: T.crimson },
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Support({ onLogout }) {
  const [tab,      setTab]      = useState('form');
  const [cat,      setCat]      = useState('general');
  const [priority, setPriority] = useState('medium');
  const [form,     setForm]     = useState({ name:'', email:'', subject:'', message:'' });
  const [done,     setDone]     = useState(false);
  const [tickIdx,  setTickIdx]  = useState(0);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 860);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const TICKERS = ['All systems operational','Avg. response: 47 min','99.98% uptime this month','12 engineers online now'];
  
  useEffect(() => {
    const id = setInterval(()=>setTickIdx(i=>(i+1)%TICKERS.length), 3500);
    return ()=>clearInterval(id);
  }, []);

  const handleChange = e => setForm(p=>({...p,[e.target.name]:e.target.value}));
  const handleSubmit = e => {
    e.preventDefault();
    setDone(true);
    setTimeout(()=>{ setDone(false); setForm({name:'',email:'',subject:'',message:''}); }, 3500);
  };

  const card = (extra={}) => ({
    background:T.panel, border:`1px solid ${T.rim}`, borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.02)', ...extra,
  });

  return (
    <div style={{ minHeight:'100vh', background:T.void, display:'flex', position:'relative', color: T.hi, fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Sidebar onLogout={onLogout} />

      <div style={{ flex:1, overflow:'auto', position:'relative', zIndex:10 }}>
        {/* Adjusted Max Width and Padding to mimic 80% zoom */}
        <div style={{ maxWidth: 1000, margin:'0 auto', padding: isMobile ? '24px 16px 48px' : '32px 24px 60px' }}>

          {/* ══════════ HERO SECTION ══════════ */}
          <div style={{
            display:'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            borderRadius: 10, overflow:'hidden', border:`1px solid ${T.rim}`,
            marginBottom: 24, minHeight: 200, background: T.panel,
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
          }}>
            {/* LEFT — identity / brand panel */}
            <div style={{ 
              flex: 1.2, position:'relative', overflow:'hidden', 
              padding: isMobile ? '24px 20px' : '36px', 
              borderRight: isMobile ? 'none' : `1px solid ${T.rim}`,
              borderBottom: isMobile ? `1px solid ${T.rim}` : 'none'
            }}>
              <MeshCanvas/>
              
              <div style={{ position:'relative', zIndex:2 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom: 16 }}>
                  <div style={{
                    width: 6, height: 6, borderRadius:'50%', background:T.cyan,
                    boxShadow:`0 0 10px ${T.cyanDim}`,
                  }}/>
                  <span style={{ fontSize:10, fontWeight:700, letterSpacing:'0.15em', color:T.mid, textTransform:'uppercase' }}>
                    AtomOne Support
                  </span>
                </div>

                <h1 style={{
                  fontSize: isMobile ? 24 : 32, fontWeight: 800, lineHeight: 1.1, letterSpacing:'-0.02em', margin:'0 0 12px',
                  color: T.hi
                }}>
                  How can we help?
                </h1>
                <p style={{ fontSize: isMobile ? 12 : 13, color:T.mid, lineHeight:1.6, maxWidth: 280, margin:'0 0 24px' }}>
                  Our engineering team is standing by. Tell us what's happening and we'll handle the rest.
                </p>

                <div style={{
                  display:'inline-flex', alignItems:'center', gap:8,
                  background: T.surface, border:`1px solid ${T.rim}`,
                  borderRadius: 4, padding:'6px 12px',
                }}>
                  <span style={{ width: 6, height: 6, borderRadius:'50%', background:T.emerald, flexShrink:0 }}/>
                  <AnimatePresence mode="wait">
                    <motion.span key={tickIdx}
                      initial={{opacity:0,y:4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}}
                      transition={{duration:0.2}}
                      style={{ fontSize:11, fontWeight:600, color:T.hi, whiteSpace:'nowrap' }}
                    >
                      {TICKERS[tickIdx]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* RIGHT — contact channels */}
            <div style={{ flex: 1, display:'flex', flexDirection:'column', background: T.panel }}>
              {[
                { Icon:Mail,       label:'Email Support', value:'AmanPal@atomone.in', sub:'Detailed, async help',    href:'mailto:AmanPal@atomone.in' },
                { Icon:Phone,      label:'Call Us',       value:'+91 XXXXXXXXXX',    sub:'Immediate escalation',    href:'tel:+91XXXXXXXXXX' },
                { Icon:ShieldCheck,label:'SLA Guarantee', value:'Under 2 hours',     sub:'Avg. actual: 47 min',     href:null },
              ].map(({ Icon, label, value, sub, href },i)=>(
                <div key={label}
                  style={{
                    flex:1, padding: isMobile ? '16px' : '0 28px',
                    borderBottom: i<2 ? `1px solid ${T.rim}` : 'none',
                    display:'flex', alignItems:'center', gap:16,
                    transition:'background 0.2s', cursor: href?'pointer':'default',
                  }}
                  onMouseEnter={e=>{ e.currentTarget.style.background=T.surface; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; }}
                  onClick={()=>href&&window.open(href)}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 6, flexShrink: 0,
                    background: T.void, border:`1px solid ${T.rim}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <Icon size={16} color={T.cyan}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:10, color:T.lo, fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase', margin:'0 0 2px' }}>{label}</p>
                    <p style={{ fontSize:13, fontWeight:600, color:T.hi, margin:'0 0 2px' }}>{value}</p>
                    <p style={{ fontSize:11, color:T.mid, margin:0 }}>{sub}</p>
                  </div>
                  {href && <ArrowUpRight size={14} color={T.lo}/>}
                </div>
              ))}
            </div>
          </div>

          {/* ══════════ TABS ══════════ */}
          <div style={{ display: 'flex', marginBottom: 20 }}>
            <div style={{
              display:'inline-flex', gap: 4, width: isMobile ? '100%' : 'auto', 
              background: T.panel, border:`1px solid ${T.rim}`,
              borderRadius: 6, padding: 4,
            }}>
              {[{id:'form',label:'Submit Ticket'},{id:'faq',label:'Knowledge Base'}].map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)} type="button"
                  style={{
                    flex: isMobile ? 1 : 'none',
                    padding:'8px 18px', borderRadius: 4, fontSize:12, fontWeight:600,
                    border:'none', cursor:'pointer', transition:'all 0.2s',
                    background: tab===t.id ? T.void : 'transparent',
                    color: tab===t.id ? T.hi : T.mid,
                    boxShadow: tab===t.id ? `0 1px 3px rgba(0,0,0,0.05)` : 'none',
                    border: tab===t.id ? `1px solid ${T.rim}` : '1px solid transparent',
                  }}
                >{t.label}</button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* ════════ FORM TAB ════════ */}
            {tab==='form' && (
              <motion.div key="form"
                initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
                transition={{duration:0.25}}
                style={{ 
                  display:'grid', 
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 280px',
                  gap: 20, alignItems:'start' 
                }}
              >
                {/* Main form */}
                <div style={{...card(), padding: isMobile ? '20px' : '32px', position:'relative', overflow:'hidden'}}>
                  
                  {/* Category Selection */}
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: T.mid, display: 'block', marginBottom: 8 }}>Issue Category</label>
                    <div style={{ display:'flex', gap: 8, flexWrap:'wrap' }}>
                      {CATS.map(({id,label,Icon})=>(
                        <button key={id} onClick={()=>setCat(id)} type="button"
                          style={{
                            flex: isMobile ? '1 1 calc(50% - 8px)' : 'none',
                            display:'flex', alignItems:'center', justifyContent: isMobile ? 'center' : 'flex-start', gap:6,
                            padding:'8px 12px', borderRadius: 6, fontSize:12, fontWeight:500,
                            border:`1px solid ${cat===id ? T.cyan : T.rim}`,
                            background: cat===id ? T.cyanDim : T.ghost,
                            color: cat===id ? T.blue : T.mid,
                            cursor:'pointer', transition:'all 0.2s',
                          }}
                        >
                          <Icon size={14}/>{label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {done ? (
                      <motion.div key="done"
                        initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0}}
                        style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px 0', gap:12 }}
                      >
                        <motion.div
                          initial={{scale:0}} animate={{scale:1}}
                          transition={{type:'spring',stiffness:260,damping:20}}
                          style={{
                            width: 48, height: 48, borderRadius:'50%',
                            background:`rgba(16, 185, 129, 0.1)`, border:`1px solid rgba(16, 185, 129, 0.3)`,
                            display:'flex', alignItems:'center', justifyContent:'center',
                          }}
                        >
                          <CheckCircle2 size={24} color={T.emerald}/>
                        </motion.div>
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: 18, fontWeight: 700, color: T.hi, margin: '0 0 6px' }}>Ticket Submitted</p>
                          <p style={{ fontSize: 12, color: T.mid, margin: 0, maxWidth: 280, lineHeight: 1.6 }}>
                            Your request has been logged successfully. A confirmation has been sent to your email.
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.form key="f" initial={{opacity:0}} animate={{opacity:1}} onSubmit={handleSubmit}>
                        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 16 }}>
                          <FormInput label="Full Name"     name="name"    value={form.name}    onChange={handleChange} required/>
                          <FormInput label="Email Address" name="email"   value={form.email}   onChange={handleChange} type="email" required/>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <FormInput label="Subject"       name="subject" value={form.subject} onChange={handleChange} required/>
                        </div>

                        {/* Priority Selection */}
                        <div style={{ marginBottom: 20 }}>
                          <label style={{ fontSize: 11, fontWeight: 600, color: T.mid, display: 'block', marginBottom: 8 }}>Priority Level</label>
                          <div style={{ display:'flex', gap: 10, flexDirection: isMobile ? 'column' : 'row' }}>
                            {Object.entries(PRIO).map(([k,v])=>(
                              <button type="button" key={k} onClick={()=>setPriority(k)}
                                style={{
                                  flex:1, padding:'10px 0', borderRadius: 6, fontSize:12, fontWeight:600,
                                  border: priority===k ? `1px solid ${v.color}` : `1px solid ${T.rim}`,
                                  cursor:'pointer', transition:'all 0.2s',
                                  background: priority===k ? `${v.color}10` : T.ghost,
                                  color: priority===k ? v.color : T.mid,
                                }}
                              >{v.label}</button>
                            ))}
                          </div>
                        </div>

                        <div style={{ marginBottom: 24 }}>
                          <FormInput label="Issue Description" name="message" value={form.message} onChange={handleChange} textarea required/>
                        </div>

                        <button type="submit"
                          style={{
                            width:'100%', padding:'12px', borderRadius: 6, fontSize:13, fontWeight:700,
                            border:'none', cursor:'pointer',
                            background: T.hi,
                            color: T.panel, 
                            display:'flex', alignItems:'center', justifyContent:'center', gap: 8,
                            transition:'transform 0.15s, opacity 0.2s',
                            boxShadow: '0 4px 10px rgba(15, 23, 42, 0.15)'
                          }}
                          onMouseEnter={e=>{e.currentTarget.style.opacity='0.9';}}
                          onMouseLeave={e=>{e.currentTarget.style.opacity='1';}}
                        >
                          <Send size={14}/> Submit Request
                        </button>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>

                {/* Sidebar Details */}
                <div style={{ display:'flex', flexDirection:'column', gap: 20 }}>
                  {/* Status Card */}
                  <div style={{...card(), padding:'20px'}}>
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom: 16 }}>
                      <Activity size={14} color={T.cyan}/>
                      <span style={{ fontSize:11, fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase', color:T.hi }}>System Status</span>
                    </div>
                    {['API & Core Services','Analytics Engine','Machine Data Sync','Report Export'].map((svc, i)=>(
                      <div key={svc} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom: i !== 3 ? `1px solid ${T.rim}` : 'none' }}>
                        <span style={{ fontSize:12, color:T.mid }}>{svc}</span>
                        <span style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, fontWeight:600, color:T.emerald }}>
                          <span style={{ width: 5, height: 5, borderRadius:'50%', background:T.emerald }}/>
                          Operational
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Quick Guidelines */}
                  <div style={{...card(), padding:'20px', background: T.surface }}>
                    <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase', color:T.hi, margin:'0 0 12px' }}>
                      Guidelines
                    </p>
                    {[
                      'Include your browser & OS version.',
                      'Attach a screenshot if possible.',
                      'Provide exact error messages.',
                      'Note the affected Machine ID.',
                    ].map((tip,i)=>(
                      <div key={i} style={{ display:'flex', gap: 10, marginBottom: i<3 ? 12 : 0, alignItems:'flex-start' }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: 4, background: T.panel, border: `1px solid ${T.rim}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 9, fontWeight: 700, color: T.cyan, flexShrink: 0
                        }}>
                          {i+1}
                        </div>
                        <p style={{ fontSize:12, color:T.mid, margin:0, lineHeight: 1.5 }}>{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ════════ FAQ TAB ════════ */}
            {tab==='faq' && (
              <motion.div key="faq"
                initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
                transition={{duration:0.25}}
                style={{ 
                  display:'flex', flexDirection: isMobile ? 'column' : 'row',
                  gap:0, background: T.panel, borderRadius: 10, border: `1px solid ${T.rim}`, overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}
              >
                {/* Left col */}
                <div style={{ 
                  flex: 1, padding: isMobile ? '24px 20px' : '36px', 
                  borderRight: isMobile ? 'none' : `1px solid ${T.rim}`,
                  borderBottom: isMobile ? `1px solid ${T.rim}` : 'none'
                }}>
                  <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase', color:T.cyan, margin:'0 0 8px' }}>Documentation</p>
                  <h2 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 800, color:T.hi, letterSpacing:'-0.02em', margin:'0 0 8px' }}>Quick Answers</h2>
                  <p style={{ fontSize: 13, color:T.mid, margin:'0 0 32px', lineHeight: 1.6 }}>
                    Most issues can be resolved instantly by following these guides. Browse the articles before submitting a ticket.
                  </p>
                  {FAQ.slice(0,3).map((item,i)=><AccordionRow key={i} item={item} idx={i}/>)}
                </div>

                {/* Right col */}
                <div style={{ flex: 1, background: T.void, padding: isMobile ? '24px 20px' : '36px' }}>
                  {/* Nudge card */}
                  <div style={{
                    background: T.surface, border:`1px solid ${T.rim}`,
                    borderRadius: 6, padding:'20px', marginBottom: 32,
                    display:'flex', alignItems:'center', gap: 16,
                    flexDirection: isMobile ? 'column' : 'row',
                    textAlign: isMobile ? 'center' : 'left'
                  }}>
                    <div style={{ background: T.panel, border: `1px solid ${T.rim}`, borderRadius: 6, padding: 10 }}>
                      <Layers size={18} color={T.cyan}/>
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ fontSize:14, fontWeight:700, color:T.hi, margin:'0 0 4px' }}>Still stuck?</p>
                      <p style={{ fontSize:12, color:T.mid, margin:0 }}>Submit a ticket for a fast response.</p>
                    </div>
                    <button onClick={()=>setTab('form')} type="button"
                      style={{
                        padding:'8px 16px', borderRadius: 4, width: isMobile ? '100%' : 'auto',
                        background:T.hi, border:'none', color:T.panel,
                        fontSize:12, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap',
                        transition: 'opacity 0.2s', boxShadow: '0 2px 4px rgba(15,23,42,0.1)'
                      }}
                      onMouseEnter={e=>e.currentTarget.style.opacity='0.9'}
                      onMouseLeave={e=>e.currentTarget.style.opacity='1'}
                    >Open Ticket</button>
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