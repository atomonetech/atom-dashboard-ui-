import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://192.168.0.34:8000";

export default function DepartmentHierarchy({ analysisType, onDepartmentClick, onBack }) {
  const [departmentsData, setDepartmentsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Map out the standard department structures along with their assigned head tokens
  const departmentConfig = {
    'Production Analysis': [
      { id: 1, name: 'Production Department', headKey: 'Ashok@atomone.in', defaultHead: 'Ashok Ready' },
      { id: 2, name: 'Quality Department', headKey: 'Rajesh.dhiman@atomone.in', defaultHead: 'Rajesh Dhiman' },
      { id: 3, name: 'Maintenance Department', headKey: 'michael.chen@company.com', defaultHead: 'Michael Chen' }
    ],
    'Quality Analysis': [
      { id: 4, name: 'QA Testing', headKey: 'Senthil@atomone', defaultHead: 'Senthil' },
      { id: 5, name: 'Production', headKey: 'Ashok@atomone.in', defaultHead: 'Ashok Ready' },
      { id: 6, name: 'Maintenance', headKey: 'lisa.anderson@company.com', defaultHead: 'Lisa Anderson' }
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
                  lastUpdated: 'Live from DB'
                };
              }
            }
          } catch (err) {
            console.error(`Failed loading dynamic data for ${dept.name}:`, err);
          }

          // Fallback placeholders if individual endpoint fails
          return { ...dept, head: dept.defaultHead, totalReports: 0, approved: 0, pending: 0, lastUpdated: 'Offline' };
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs font-semibold text-gray-500">Calculating Dynamic Plant Metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-20 px-4 md:px-6 bg-gray-50">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Plants
          </button>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{analysisType} Departments</h2>
          <p className="text-slate-500 text-sm mt-1">Real-time dynamic monitoring over active operational logs</p>
        </motion.div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departmentsData.map((dept) => {
            const completionRate = dept.totalReports > 0 ? Math.round((dept.approved / dept.totalReports) * 100) : 0;
            
            return (
              <div key={dept.id} onClick={() => onDepartmentClick(dept.name)} className="cursor-pointer group">
                <div className="h-full rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 bg-white">
                  
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">{dept.name}</h3>
                      <p className="text-xs text-gray-500">Supervisor: <span className="font-semibold text-gray-700">{dept.head}</span></p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Dynamic Metric Badges */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-0.5">Total Logs</p>
                      <p className="text-2xl font-bold text-gray-900">{dept.totalReports}</p>
                    </div>
                    <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-0.5">Pass Rate</p>
                      <p className="text-2xl font-bold text-blue-600">{completionRate}%</p>
                    </div>
                  </div>

                  {/* Flow Status Items */}
                  <div className="flex items-center justify-between text-xs font-semibold bg-gray-50/50 px-3 py-2 rounded-lg border mb-4">
                    <div className="flex items-center gap-1 text-amber-600">
                      <AlertCircle className="w-3.5 h-3.5" /> <span>{dept.pending} Pending</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" /> <span>{dept.approved} Approved</span>
                    </div>
                  </div>

                  {/* Progress Bar Loader */}
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                    <div style={{ width: `${completionRate}%` }} className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500" />
                  </div>

                  {/* Timestamp Line */}
                  <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-400">
                    <Clock className="w-3 h-3" /> State: {dept.lastUpdated}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}