import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, AlertCircle } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://192.168.0.34:8000";

export default function AnalysisHubLanding({ onAnalysisClick }) {
  const [liveAnalyses, setLiveAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define your plant structures paired with the backend keys mapping to their respective department heads
  const plantConfiguration = [
    {
      id: 'Production Analysis',
      title: 'Plant 1 Data',
      description: 'Monitor production workflows, efficiency metrics, and department performance',
      icon: BarChart3,
      color: 'from-blue-500 to-blue-600',
      heads: ['Ashok@atomone.in', 'Rajesh.dhiman@atomone.in', 'michael.chen@company.com']
    },
    {
      id: 'Quality Analysis',
      title: 'Plant 2 Data',
      description: 'Track quality assurance metrics, defect rates, and compliance standards',
      icon: TrendingUp,
      color: 'from-emerald-500 to-emerald-600',
      heads: ['Senthil@atomone', 'Ashok@atomone.in', 'lisa.anderson@company.com']
    }
  ];

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
              stats: {
                totalReports,
                pending,
                approved,
                completion
              }
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs font-semibold text-gray-500">Aggregating Live Manufacturing Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12 pb-20 px-4 md:px-6 bg-gray-50">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Analysis Hub
          </h1>
          <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto">
            Enterprise reporting platform synchronized dynamically with live infrastructure production metrics
          </p>
        </motion.div>

        {/* Dynamic Plant Grids */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
        >
          {liveAnalyses.map((analysis) => {
            const IconComponent = analysis.icon;
            const completionPercent = analysis.stats.completion;

            return (
              <motion.div
                key={analysis.id}
                variants={cardVariants}
                onClick={() => onAnalysisClick(analysis.id, analysis.title)}
                className="group cursor-pointer"
              >
                <div className="h-full rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  
                  {/* Banner Graphic Row */}
                  <div className={`h-32 bg-gradient-to-br ${analysis.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm p-3.5 rounded-xl">
                        <IconComponent className="w-10 h-10 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {analysis.title}
                    </h3>
                    <p className="text-gray-500 mb-6 text-xs leading-relaxed h-10 overflow-hidden">
                      {analysis.description}
                    </p>

                    {/* Live Metric Badges */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                        <div className="text-xl font-bold text-gray-900">
                          {analysis.stats.totalReports}
                        </div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mt-0.5">Total Logs</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                        <div className="text-xl font-bold text-amber-600">
                          {analysis.stats.pending}
                        </div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mt-0.5">Pending</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                        <div className="text-xl font-bold text-emerald-600">
                          {analysis.stats.approved}
                        </div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mt-0.5">Approved</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                        <div className="text-xl font-bold text-blue-600">
                          {completionPercent}%
                        </div>
                        <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mt-0.5">Pass Rate</p>
                      </div>
                    </div>

                    {/* Progress Engine */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs text-gray-400 font-medium">
                        <span>Plant Completion Progress</span>
                        <span className="font-semibold text-gray-800">
                          {completionPercent}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${completionPercent}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className={`h-full bg-gradient-to-r ${analysis.color} rounded-full`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Operational Launch Trigger */}
                  <div className="px-8 pb-6">
                    <motion.button
                      whileHover={{ x: 4 }}
                      className="w-full py-2.5 bg-gray-50 border hover:bg-gray-100 text-gray-800 text-xs font-bold rounded-xl transition-all duration-200"
                    >
                      Enter Plant Dashboard →
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}