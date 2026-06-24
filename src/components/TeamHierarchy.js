import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, AlertCircle, Eye } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://192.168.0.34:8000";

export default function TeamHierarchy({ department, onBack, onViewReports }) {
  const [liveJuniors, setLiveJuniors] = useState([]);
  const [departmentHead, setDepartmentHead] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // 1. Map incoming frontend view names to exact operational email lookups expected by your DB
  const headEmailMap = {
    'Quality Department': 'Rajesh.dhiman@atomone.in',
    'Production Department': 'Ashok@atomone.in',
    'Maintenance Department': 'michael.chen@company.com',
    'QA Testing': 'Senthil@atomone'
  };

  useEffect(() => {
    const targetHeadEmail = headEmailMap[department] || 'Rajesh.dhiman@atomone.in';
    
    setDepartmentHead({ 
      name: department.replace("Department", "Head"), 
      email: targetHeadEmail 
    });

    const fetchLiveTeam = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);
        
        const targetUrl = `${API_BASE_URL}/api/department-stats/?username=${encodeURIComponent(targetHeadEmail.trim())}`;
        console.log(`📡 Requesting Team Roster via: ${targetUrl}`);
        
        const res = await fetch(targetUrl);
        const data = await res.json();
        
        if (res.ok && Array.isArray(data)) {
          if (data.length === 0) {
            setLiveJuniors([]);
            return;
          }

          // 2. Map database operator items dynamically into junior row cards
          const structuredJuniors = data.map((op, idx) => ({
            id: op.user_id || `op-${idx}`,
            name: op.username || op.user_id.split('@')[0],
            designation: "Operator / Engineer",
            email: op.user_id,
            submitted: op.filled || 0,
            approved: op.approved || 0,
            pending: op.pending || 0
          }));

          setLiveJuniors(structuredJuniors);

          // 3. Extract the clean dynamic head descriptor text produced by your Django cache engine
          if (data[0] && data[0].head) {
            setDepartmentHead({
              name: data[0].head,
              email: targetHeadEmail
            });
          }
        } else {
          setErrorMsg(data.error || "The server rejected this request payload configuration.");
        }
      } catch (err) {
        console.error("💥 Critical Team Matrix Parse Error:", err);
        setErrorMsg("Failed to connect to the backend server interface.");
      } finally {
        setLoading(false);
      }
    };

  fetchLiveTeam();
  }, [department]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs font-semibold text-gray-500">Querying Team Ledger...</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white border p-6 rounded-xl text-center shadow-sm">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
          <h4 className="font-bold text-gray-900">Connection Interrupted</h4>
          <p className="text-xs text-gray-600 mt-1">{errorMsg}</p>
          <button onClick={onBack} className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-medium">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-20 px-4 md:px-6 bg-gray-50">
      <div className="max-w-[1600px] mx-auto">
        {/* Back Navigation Bar */}
        <button onClick={onBack} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Departments
        </button>

        {/* Dynamic Department Head Presentation Panel */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 p-8 text-white shadow-xl mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-xl font-bold shadow-md uppercase">
                {departmentHead.name ? departmentHead.name.substring(0, 2) : "HD"}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/50 px-2 py-0.5 rounded">Authority Line</span>
                <h3 className="text-2xl font-bold mt-1">{departmentHead.name}</h3>
                <p className="text-sm text-slate-400 mt-0.5">{departmentHead.email}</p>
              </div>
            </div>

            <button
              onClick={() => onViewReports(departmentHead.email, "")} 
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 font-semibold rounded-xl transition-all shadow-md flex items-center gap-2 text-xs w-full md:w-auto justify-center"
            >
              <FileText className="w-4 h-4" /> View Entire Department Logs
            </button>
          </div>
        </div>

        {/* Live Junior Contributors Cards Collection Grid */}
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">Active Contributors ({liveJuniors.length})</h3>
        
        {liveJuniors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border text-sm text-gray-400 font-medium">
            No reporting operators encountered for this supervisor in the database.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveJuniors.map((junior) => (
              <div 
                key={junior.id} 
                onClick={() => onViewReports(departmentHead.email, junior.name)} // 🔥 Pass operator's name directly to view details
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:border-blue-400 hover:shadow-md cursor-pointer transition-all duration-200 group relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-gray-900 text-lg capitalize truncate group-hover:text-blue-600 transition-colors">
                      {junior.name}
                    </h4>
                    <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs font-semibold whitespace-nowrap">
                      View Logs <Eye size={14} />
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{junior.designation}</p>
                  <p className="text-xs text-blue-600 font-medium mt-2.5 bg-blue-50/70 px-2.5 py-1 rounded-md inline-block">{junior.email}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-5 text-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div>
                    <div className="text-base font-bold text-gray-900">{junior.submitted}</div>
                    <div className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Logged</div>
                  </div>
                  <div>
                    <div className="text-base font-bold text-emerald-600">{junior.approved}</div>
                    <div className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Passed</div>
                  </div>
                  <div>
                    <div className="text-base font-bold text-amber-600">{junior.pending}</div>
                    <div className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">Review</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}