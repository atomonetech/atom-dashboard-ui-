import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, FileText, AlertCircle, ArrowUpRight } from 'lucide-react';
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://192.168.0.34:8000";

export default function TeamHierarchy({ department, onBack, onViewReports, plantTitle }) {
  const [liveJuniors, setLiveJuniors] = useState([]);
  // Added imageUrl property to state
  const [departmentHead, setDepartmentHead] = useState({ name: "", email: "", imageUrl: "" });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const resolvedPlantTitle = plantTitle || 'Plant 1';
  const shortDepartmentLabel = department.replace(/\s*Department\s*/i, '').trim() || department;

  // 1. Updated Config Map to hold both email and image URLs
  const departmentHeadMap = {
    'Quality Department': { email: 'Rajesh.dhiman@atomone.in', imageUrl: '/rajeshsir.jpg' },
    'Production Department': { email: 'Hitesh@atomone.in', imageUrl: '' },
    'Production': { email: 'Ashok@atomone.in', imageUrl: '/AshokSir.jpg' },
    'QA Testing': { email: 'Senthil@atomone', imageUrl: '' }
  };

  useEffect(() => {
    // Get config object or fall back to Rajesh if not found
    const targetConfig = departmentHeadMap[department] || { email: 'Rajesh.dhiman@atomone.in', imageUrl: '' };
    const targetHeadEmail = targetConfig.email;
    const targetHeadImage = targetConfig.imageUrl;

    // Set initial layout details
    setDepartmentHead({
      name: department.replace("Department", "Head"),
      email: targetHeadEmail,
      imageUrl: targetHeadImage
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

          // 3. Extract the clean dynamic head name from Django cache and preserve image url
          if (data[0] && data[0].head) {
            setDepartmentHead({
              name: data[0].head,
              email: targetHeadEmail,
              imageUrl: targetHeadImage // Retains image mapping on dynamic update
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


  if (errorMsg) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: '#F5F3EF' }}>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white border border-gray-100 p-6 rounded-2xl text-center shadow-sm">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
            <h4 className="font-bold text-gray-900">Connection Interrupted</h4>
            <p className="text-xs text-gray-600 mt-1">{errorMsg}</p>
            <button onClick={onBack} className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-full text-xs font-semibold">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F5F3EF' }}>
      <div className="flex-1 w-full mx-auto px-6 md:px-10 pt-10 pb-16">

        {/* Back Navigation */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold mb-8 transition-colors text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Departments
        </button>

        {/* Department Head Panel */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative rounded-2xl p-8 text-white shadow-xl mb-12 overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#0E0F14,#1A1B24)' }}
        >
          <div
            className="pointer-events-none absolute -bottom-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-40"
            style={{ background: 'radial-gradient(circle,#6D5AE6,transparent 70%)' }}
          />

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              
              {/* Updated Div Container with image fallback logic */}
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold shadow-md uppercase overflow-hidden"
                style={{ background: '#6D5AE6' }}
              >
                {departmentHead.imageUrl ? (
                  <img 
                    src={departmentHead.imageUrl} 
                    alt={departmentHead.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  departmentHead.name ? departmentHead.name.substring(0, 2) : "HD"
                )}
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300/80">
                  Authority Line &middot; {department}
                </span>
                <h3 className="text-2xl font-bold mt-1">
                  {departmentHead.name} <span className="italic font-serif text-gray-500"></span>
                </h3>
                <p className="text-sm text-slate-400 mt-0.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {departmentHead.email}
                </p>
              </div>
            </div>

            <button
              onClick={() => onViewReports(departmentHead.email, "")}
              className="px-6 py-3.5 bg-white text-gray-900 hover:bg-gray-100 font-semibold rounded-xl transition-all shadow-md flex items-center gap-2 text-xs w-full md:w-auto justify-center"
            >
              <FileText className="w-4 h-4" /> View Entire Department Logs
            </button>
          </div>
        </motion.div>

        {/* Active Contributors */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Active Contributors ({liveJuniors.length})
          </h3>
          <span className="text-xs font-semibold text-gray-400">{resolvedPlantTitle}</span>
        </div>

        {liveJuniors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 text-sm text-gray-400 font-medium">
            No reporting operators encountered for this supervisor in the database.
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {liveJuniors.map((junior) => (
              <motion.div
                key={junior.id}
                variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
                onClick={() => onViewReports(departmentHead.email, junior.name)}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-indigo-200 cursor-pointer transition-all duration-200 group relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h4
                      className="font-bold text-lg capitalize truncate transition-colors"
                      style={{ color: '#6D5AE6' }}
                    >
                      {junior.name}
                    </h4>
                    <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{junior.designation}</p>
                  <p
                    className="text-xs font-medium mt-2.5 px-2.5 py-1 rounded-md inline-block"
                    style={{ background: '#EEEBFC', color: '#6D5AE6' }}
                  >
                    {junior.email}
                  </p>
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
              </motion.div>
            ))}
          </motion.div>
        )}
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