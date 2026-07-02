import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  TrendingUp,
  ShieldCheck,
  Activity,
  Bell,
  User,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://192.168.0.34:8000";

export default function AnalysisHubLanding({ onAnalysisClick }) {
  const [liveAnalyses, setLiveAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define your plant structures paired with the backend keys mapping to their respective department heads
  const plantConfiguration = [
    {
      id: 'Production Analysis',
      title: 'Plant 1',
      eyebrow: 'Production Operations',
      description: 'Monitor live production workflows, efficiency metrics, and department-level performance across all assembly lines.',
      icon: LayoutDashboard,
      accent: 'indigo',
      departments: 3,
      heads: ['Hitesh@atomone.in', 'Rajesh.dhiman@atomone.in','Sanjay@atomone.in']
    },
    {
      id: 'Quality Analysis',
      title: 'Plant 2',
      eyebrow: 'Quality & Compliance',
      description: 'Track quality assurance metrics, defect rates, and compliance standards across all certification workflows.',
      icon: TrendingUp,
      accent: 'emerald',
      departments: 3,
      heads: ['Ashok@atomone.in', 'Senthil@atomone','Sanjay@atomone.in']
    }
  ];

  // Every color token a card needs, keyed by accent name so JSX never builds class strings dynamically
  const accentStyles = {
    indigo: {
      bar: 'linear-gradient(90deg,#6D5AE6,#8B7CF0)',
      badgeBg: '#EEEBFC',
      badgeIcon: '#6D5AE6',
      blob: 'rgba(109,90,230,0.10)',
      pass: '#6D5AE6',
      progress: 'linear-gradient(90deg,#6D5AE6,#8B7CF0)',
    },
    emerald: {
      bar: 'linear-gradient(90deg,#0F9D6C,#2FBE8B)',
      badgeBg: '#E6F5EE',
      badgeIcon: '#0F9D6C',
      blob: 'rgba(15,157,108,0.10)',
      pass: '#0F9D6C',
      progress: 'linear-gradient(90deg,#0F9D6C,#2FBE8B)',
    },
  };

  useEffect(() => {
    const fetchAllPlantMetrics = async () => {
      try {
        setLoading(true);

        const plantCalculations = await Promise.all(
          plantConfiguration.map(async (plant) => {
            let totalReports = 0;
            let pending = 0;
            let approved = 0;

            // Fetch data concurrently for each head assigned to the plant
            await Promise.all(
              plant.heads.map(async (headEmail) => {
                try {
                  const targetUrl = `${API_BASE_URL}/api/department-stats/?username=${encodeURIComponent(headEmail)}`;
                  const res = await fetch(targetUrl);

                  if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                      data.forEach((operator) => {
                        totalReports += operator.filled || 0;
                        approved += operator.approved || 0;
                        pending += operator.pending || 0;
                      });
                    }
                  }
                } catch (err) {
                  console.error(`Error aggregating metrics for head ${headEmail}:`, err);
                }
              })
            );

            // Calculate overall completion percentage for this plant
            const completion = totalReports > 0 ? Math.round((approved / totalReports) * 100) : 0;

            return {
              ...plant,
              stats: { totalReports, pending, approved, completion }
            };
          })
        );

        setLiveAnalyses(plantCalculations);
      } catch (globalErr) {
        console.error("Critical error building rolling plant dashboard stats:", globalErr);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPlantMetrics();
  }, []);

  const totalLogs = liveAnalyses.reduce((sum, p) => sum + (p.stats?.totalReports || 0), 0);
  const totalApproved = liveAnalyses.reduce((sum, p) => sum + (p.stats?.approved || 0), 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F3EF' }}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 rounded-full animate-spin mx-auto mb-3"
            style={{ borderColor: '#6D5AE6', borderTopColor: 'transparent' }} />
          <p className="text-xs font-semibold tracking-wide text-gray-500">Aggregating live manufacturing data…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#F5F3EF' }}>

      {/* Ambient background blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle,#B9AEF5,transparent 70%)' }} />
      <div className="pointer-events-none absolute top-0 right-0 w-[520px] h-[520px] rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle,#D8E6A0,transparent 70%)' }} />

      {/* Top Nav */}
      {/* <div className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5 border-b border-black/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-none">AtomOne</p>
            <p className="text-[10px] font-semibold tracking-widest text-gray-400 leading-none mt-0.5">ANALYSIS HUB</p>
          </div>
        </div>

        <div className="hidden sm:block px-4 py-1.5 rounded-full bg-gray-900 text-white text-xs font-semibold">
          Analysis Hub
        </div>

        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition">
            <Bell className="w-4 h-4 text-gray-600" />
          </button>
          <button className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition">
            <User className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div> */}

      <div className="relative z-10 w-full px-6 md:px-10 pt-14 pb-20">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold tracking-widest text-gray-500">LIVE INFRASTRUCTURE FEED</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-none mb-5 flex items-start gap-2">
            Analysis <span className="italic font-serif text-gray-900">Hub</span>
            <span className="w-2.5 h-2.5 rounded-full mt-2" style={{ background: '#D8E6A0' }} />
          </h1>

          <p className="text-sm md:text-base text-gray-500 max-w-xl leading-relaxed mb-7">
            Enterprise reporting synced dynamically with live infrastructure production metrics.
            Select a plant to drill into departments, contributors, and individual reports.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-14">
            <span className="px-4 py-1.5 rounded-full bg-gray-900 text-white text-xs font-bold">
              {liveAnalyses.length} PLANTS
            </span>
            <span className="px-4 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-600">
              {totalLogs} TOTAL LOGS
            </span>
            <span className="px-4 py-1.5 rounded-full text-xs font-bold" style={{ background: '#E6F5EE', color: '#0F9D6C' }}>
              {totalApproved} APPROVED
            </span>
          </div>
        </motion.div>

        {/* Plant Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-20"
        >
          {liveAnalyses.map((plant) => {
            const IconComponent = plant.icon;
            const styles = accentStyles[plant.accent];
            const pct = plant.stats.completion;

            return (
              <motion.div key={plant.id} variants={cardVariants} className="group">
                <div className="relative rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">

                  {/* Top accent bar */}
                  <div className="h-[5px] w-full" style={{ background: styles.bar }} />

                  {/* Ambient corner blob */}
                  <div className="pointer-events-none absolute -top-10 -right-10 w-44 h-44 rounded-full blur-2xl"
                    style={{ background: styles.blob }} />

                  <div className="relative p-8">
                    <div className="flex items-start justify-between mb-5">
                      <p className="text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                        {plant.eyebrow}
                      </p>
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: styles.badgeBg }}>
                        <IconComponent className="w-5 h-5" style={{ color: styles.badgeIcon }} />
                      </div>
                    </div>

                    <h3 className="text-3xl font-bold text-gray-900 mb-3">{plant.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-7 max-w-sm">
                      {plant.description}
                    </p>

                    {/* Stats row */}
                    <div className="grid grid-cols-4 gap-2 mb-7">
                      <div>
                        <p className="text-xl font-bold text-gray-900">{plant.stats.totalReports}</p>
                        <p className="text-[10px] font-semibold tracking-wide text-gray-400 mt-0.5">TOTAL</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-amber-500">{plant.stats.pending}</p>
                        <p className="text-[10px] font-semibold tracking-wide text-gray-400 mt-0.5">PENDING</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold" style={{ color: styles.badgeIcon }}>{plant.stats.approved}</p>
                        <p className="text-[10px] font-semibold tracking-wide text-gray-400 mt-0.5">APPROVED</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold" style={{ color: styles.pass }}>{pct}%</p>
                        <p className="text-[10px] font-semibold tracking-wide text-gray-400 mt-0.5">PASS</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-7">
                      <div className="flex justify-between items-center text-[11px] text-gray-400 font-medium mb-1.5">
                        <span className="tracking-wide">COMPLETION PROGRESS</span>
                        <span className="font-bold text-gray-700">{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ background: styles.progress }}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-400">
                        {plant.departments} DEPARTMENTS
                      </span>
                      <motion.button
                        whileHover={{ x: 3 }}
                        onClick={() => onAnalysisClick(plant.id, plant.title)}
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-colors"
                      >
                        Enter Plant
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Feature strip */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: Activity,
              color: '#6D5AE6',
              title: 'Real-time logs',
              description: 'Every operator submission streams instantly into the shared plant ledger.'
            },
            {
              icon: ShieldCheck,
              color: '#0F9D6C',
              title: 'Authority lineage',
              description: "Each report carries its supervisor and approval trail for full accountability."
            },
            {
              icon: TrendingUp,
              color: '#D9A22B',
              title: 'Pass-rate analytics',
              description: 'Monitor approval velocity across departments and spot bottlenecks early.'
            }
          ].map((feature) => (
            <div key={feature.title} className="p-6 rounded-2xl bg-white border border-gray-100">
              <feature.icon className="w-5 h-5 mb-4" style={{ color: feature.color }} />
              <h4 className="text-base font-bold text-gray-900 mb-1.5">{feature.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}