import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Users,
  Wifi,
  WifiOff,
  ArrowUpRight,
  Sparkles,
  Bell,
  User,
  ChevronRight,
} from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://192.168.0.34:8000";

// Cyclical accent palette applied to department cards in order
const ACCENTS = [
  { key: 'indigo', bar: '#6D5AE6', badgeBg: '#EEEBFC' },
  { key: 'emerald', bar: '#0F9D6C', badgeBg: '#E6F5EE' },
  { key: 'amber', bar: '#D9822B', badgeBg: '#FBEEDF' },
];

// Maps the internal analysisType key to the human plant label shown in the breadcrumb / heading
const PLANT_LABELS = {
  'Production Analysis': 'Plant 1',
  'Quality Analysis': 'Plant 2',
};

export default function DepartmentHierarchy({ analysisType, onDepartmentClick, onBack, plantTitle }) {
  const [departmentsData, setDepartmentsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const resolvedPlantTitle = plantTitle || PLANT_LABELS[analysisType] || 'Plant';

  // 1. Map out the standard department structures along with their assigned head tokens
  const departmentConfig = {
    'Production Analysis': [
      { id: 1, name: 'Production Department', headKey: 'Hitesh@atomone.in', defaultHead: 'Hitesh' },
      { id: 2, name: 'Quality Department', headKey: 'Rajesh.dhiman@atomone.in', defaultHead: 'Rajesh Dhiman' },
      { id: 3, name: 'Maintenance Department', headKey: 'Sanjay@atomone.in', defaultHead: 'Sanjay Goyal' }
    ],
    'Quality Analysis': [
      { id: 4, name: 'QA Testing', headKey: 'Senthil@atomone', defaultHead: 'Senthil' },
      { id: 5, name: 'Production', headKey: 'Ashok@atomone.in', defaultHead: 'Ashok Ready' },
      { id: 6, name: 'Maintenance', headKey: 'Sanjay@atomone.in', defaultHead: 'Sanjay Goyal' }
    ]
  };

  useEffect(() => {
    const activeConfigs = departmentConfig[analysisType] || [];

    const fetchAllDepartmentStats = async () => {
      try {
        setLoading(true);

        // 2. Query stats for all configured department heads simultaneously
        const fetchPromises = activeConfigs.map(async (dept) => {
          try {
            const targetUrl = `${API_BASE_URL}/api/department-stats/?username=${encodeURIComponent(dept.headKey)}`;
            const res = await fetch(targetUrl);

            if (res.ok) {
              const data = await res.json();

              if (Array.isArray(data) && data.length > 0) {
                // Aggregate numbers across all operators belonging to this department head
                let totalReports = 0;
                let approved = 0;
                let pending = 0;
                let dynamicHeadName = dept.defaultHead;
                let peopleCount = data.length;

                data.forEach(operator => {
                  totalReports += (operator.filled || 0);
                  approved += (operator.approved || 0);
                  pending += (operator.pending || 0);
                  if (operator.head) dynamicHeadName = operator.head;
                });

                return {
                  ...dept,
                  head: dynamicHeadName,
                  totalReports,
                  approved,
                  pending,
                  peopleCount,
                  lastUpdated: 'Live from DB'
                };
              }
            }
          } catch (err) {
            console.error(`Failed loading dynamic data for ${dept.name}:`, err);
          }

          // Fallback placeholders if individual endpoint fails
          return { ...dept, head: dept.defaultHead, totalReports: 0, approved: 0, pending: 0, peopleCount: 0, lastUpdated: 'Offline' };
        });

        const resolvedDepartments = await Promise.all(fetchPromises);
        setDepartmentsData(resolvedDepartments);
      } catch (globalErr) {
        console.error("Error evaluating batch database components:", globalErr);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDepartmentStats();
  }, [analysisType]);

  const totals = departmentsData.reduce(
    (acc, d) => {
      acc.logs += d.totalReports || 0;
      acc.pending += d.pending || 0;
      acc.approved += d.approved || 0;
      return acc;
    },
    { logs: 0, pending: 0, approved: 0 }
  );
  const overallPass = totals.logs > 0 ? Math.round((totals.approved / totals.logs) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5F3EF' }}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 rounded-full animate-spin mx-auto mb-3"
            style={{ borderColor: '#6D5AE6', borderTopColor: 'transparent' }} />
          <p className="text-xs font-semibold tracking-wide text-gray-500">Calculating dynamic plant metrics…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F5F3EF' }}>

      {/* Top Nav */}
      {/* <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-black/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-none">AtomOne</p>
            <p className="text-[10px] font-semibold tracking-widest text-gray-400 leading-none mt-0.5">ANALYSIS HUB</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-gray-400">
          <span className="hover:text-gray-600 cursor-pointer" onClick={onBack}>Analysis Hub</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="px-3 py-1 rounded-full bg-gray-900 text-white">Plant: {resolvedPlantTitle}</span>
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

      <div className="flex-1 w-full mx-auto px-6 md:px-10 pt-10 pb-16">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold mb-8 transition-colors text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Plants
          </button>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
            <div>
              <p className="text-[11px] font-bold tracking-widest text-gray-400 uppercase mb-3">
                Production Operations &middot; Live Infrastructure
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-none mb-4">
                {resolvedPlantTitle} <span className="italic font-serif text-gray-400">Departments</span>
              </h2>
              <p className="text-sm text-gray-500 max-w-xl leading-relaxed">
                Real-time dynamic monitoring over active operational logs across each department in {resolvedPlantTitle}.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-4 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-700">
                {totals.logs} LOGS
              </span>
              <span className="px-4 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-bold text-amber-600">
                {totals.pending} PENDING
              </span>
              <span className="px-4 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-bold text-emerald-600">
                {totals.approved} APPROVED
              </span>
              <span className="px-4 py-1.5 rounded-full bg-gray-900 text-white text-xs font-bold">
                {overallPass}% PASS
              </span>
            </div>
          </div>
        </motion.div>

        {/* Department Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {departmentsData.map((dept, idx) => {
            const completionRate = dept.totalReports > 0 ? Math.round((dept.approved / dept.totalReports) * 100) : 0;
            const accent = ACCENTS[idx % ACCENTS.length];
            const isLive = dept.lastUpdated === 'Live from DB';

            return (
              <motion.div
                key={dept.id}
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                onClick={() => onDepartmentClick(dept.name)}
                className="cursor-pointer group"
              >
                <div className="h-full rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden">

                  {/* Top accent bar */}
                  <div className="h-[4px] w-full" style={{ background: accent.bar }} />

                  <div className="p-6">
                    {/* Card header */}
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <h3
                          className="text-xl font-bold mb-1 group-hover:underline transition-colors"
                          style={{ color: accent.bar }}
                        >
                          {dept.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Head: <span className="font-semibold text-gray-700">{dept.head}</span>
                        </p>
                      </div>
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: accent.badgeBg, color: accent.bar }}
                      >
                        <Users className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Metric row */}
                    <div className="grid grid-cols-2 gap-6 mb-5">
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-0.5">Total Logs</p>
                        <p className="text-2xl font-bold text-gray-900">{dept.totalReports}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-0.5">Pass Rate</p>
                        <p className="text-2xl font-bold" style={{ color: accent.bar }}>{completionRate}%</p>
                      </div>
                    </div>

                    {/* Pending / Approved row */}
                    <div className="flex items-center justify-between text-xs font-semibold bg-gray-50/70 px-3 py-2 rounded-lg border border-gray-100 mb-4">
                      <div className="flex items-center gap-1.5 text-amber-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {dept.pending} Pending
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {dept.approved} Approved
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                      <div
                        style={{ width: `${completionRate}%`, background: accent.bar }}
                        className="h-full transition-all duration-500"
                      />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-[10px] font-medium text-gray-400">
                      <span className="flex items-center gap-1.5">
                        {isLive ? (
                          <Wifi className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <WifiOff className="w-3 h-3 text-gray-400" />
                        )}
                        {isLive ? 'Live from DB' : 'Offline'}
                      </span>
                      <span className="flex items-center gap-1 text-gray-500 group-hover:text-gray-800 transition-colors">
                        {dept.peopleCount} People <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Footer */}
      <div className="border-t border-black/5 px-6 md:px-10 py-5 flex items-center justify-between text-xs text-gray-400">
        <span>&copy; 2026 AtomOne Industrial Intelligence</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live &middot; Synced from infrastructure
        </span>
      </div>
    </div>
  );
}