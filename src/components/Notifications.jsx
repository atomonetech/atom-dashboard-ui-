// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion'; 
// import { Bell, Check, X, AlertCircle, CheckCircle2, Clock, Settings, FileText } from 'lucide-react';
// import Sidebar from './Sidebar';
// import { Card } from './ui/card';
// import { Button } from './ui/button';
// import { useNavigate } from 'react-router-dom';

// const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

// export default function Notifications() {
//   const navigate = useNavigate();
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // LocalStorage se logged-in user nikal rahe hain
//   const currentUser = localStorage.getItem("username") || "";

//   // Helper time format function
//   const formatTimeAgo = (dateString) => {
//     if (typeof dateString === "string" && dateString.includes("-"))
//       return dateString;

//     const date = new Date(dateString);
//     const now = new Date();
//     const diffInMins = Math.floor((now - date) / 60000);
//     if (diffInMins < 1) return "Just now";
//     if (diffInMins < 60) return `${diffInMins} mins ago`;
//     const diffInHours = Math.floor(diffInMins / 60);
//     if (diffInHours < 24) return `${diffInHours} hours ago`;
//     return date.toLocaleDateString();
//   };

//   // ====================================================================
//   // 🔥 QA NOTIFICATIONS FETCH API
//   // ====================================================================
//   const fetchNotifications = async () => {
//     if (!currentUser) return;
//     try {
//       const res = await fetch(
//         `${API_BASE}/api/qa-notifications/${currentUser}/`,
//       );
//       const data = await res.json();
//       console.log(data);
//       if (res.ok && data.notifications) {
//         setNotifications(data.notifications);
//       }
//     } catch (err) {
//       console.error("Fetch failed", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Auto-refresh every 10 seconds
//   useEffect(() => {
//     fetchNotifications();
//     const interval = setInterval(fetchNotifications, 10000);
//     return () => clearInterval(interval);
//   }, [currentUser]); // currentUser add kar diya dependency mein

//   const activeNotifications = notifications;
//   const parseNotification = (message = "") => {
//     const match = message.match(/^(.*?) submitted (.*?) on/i);
//     const fullUser = match?.[1] || "Unknown User";

//     return {
//         submittedBy: fullUser.split("@")[0],
//       reportType: match?.[2] || "QA Report",
//     };
//   };

//   const getInitials = (name = "") => {
//     return name.charAt(0).toUpperCase();
//   };

//   return (
//     <div className="min-h-screen bg-[#0f172a] flex relative overflow-hidden">
//       {/* Animated Background */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         {[...Array(10)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute rounded-full"
//             style={{
//               width: Math.random() * 200 + 50,
//               height: Math.random() * 200 + 50,
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               background:
//                 i % 2 === 0
//                   ? "radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)"
//                   : "radial-gradient(circle, rgba(251, 191, 36, 0.08) 0%, transparent 70%)",
//             }}
//             animate={{
//               y: [0, -30, 0],
//               x: [0, 20, 0],
//               scale: [1, 1.2, 1],
//               opacity: [0.3, 0.6, 0.3],
//             }}
//             transition={{
//               duration: Math.random() * 15 + 10,
//               repeat: Infinity,
//               ease: "easeInOut",
//             }}
//           />
//         ))}
//       </div>

//       <Sidebar />

//       {/* Main Content */}
//       <div className="flex-1 overflow-auto relative z-10">
//         <div className="max-w-6xl mx-auto px-8 py-8">
//           <div className="mb-8 flex items-center justify-between">
//             <div>
//               <motion.h1
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="mb-2 bg-gradient-to-r from-cyan-400 via-white to-yellow-400 bg-clip-text text-transparent relative inline-block text-3xl font-bold"
//               >
//                 Alerts & Notifications
//                 <motion.div
//                   className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-cyan-500 to-yellow-500 rounded-full"
//                   initial={{ width: 0 }}
//                   animate={{ width: "100%" }}
//                   transition={{ delay: 0.3, duration: 0.8 }}
//                 />
//               </motion.h1>
//               <motion.p
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.2 }}
//                 className="text-slate-400 mt-2"
//               >
//                 Action required for submitted reports
//               </motion.p>
//             </div>

//             <div className="flex gap-3">
//               <Button
//                 onClick={() => setNotifications([])}
//                 variant="outline"
//                 className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 cursor-pointer"
//               >
//                 <Check className="w-4 h-4 mr-2" /> Clear All
//               </Button>
//             </div>
//           </div>

//           <div className="space-y-2">
//             {loading ? (
//               <div className="text-cyan-500 text-center py-10 font-bold animate-pulse">
//                 Loading Live Alerts...
//               </div>
//             ) : activeNotifications.length === 0 ? (
//               <div className="text-slate-500 text-center py-10 text-lg">
//                 📭 No active notifications. All caught up!
//               </div>
//             ) : (
//               activeNotifications.map((notif, index) => {
//                 const { submittedBy, reportType } = parseNotification(
//                   notif.message,
//                 );

//                 return (
//                   <motion.div
//                     key={notif.id}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                   >
//                     <Card className="group border border-slate-800 bg-[#111827] hover:border-cyan-500/30 rounded-xl transition-all duration-200">
//                       <div className="p-4">
//                         {/* Header */}
//                         <div className="flex justify-between items-center">
//                           <h3 className="font-semibold text-white text-[15px]">
//                             {reportType}
//                           </h3>

//                           <span
//                             className="
//           text-[11px]
//           px-2 py-1
//           rounded-md
//           bg-amber-500/15
//           text-amber-300
//           font-medium
//         "
//                           >
//                             Pending
//                           </span>
//                         </div>

//                         {/* User */}
//                         <p className="mt-2 text-sm text-slate-400">
//                           Submitted by
//                           <span className="text-slate-200 ml-1">
//                             {submittedBy}
//                           </span>
//                         </p>
//                          <p className="mt-1 text-sm text-slate-500">
//           Awaiting approval from{" "}
//           <span className="text-cyan-400">
//             {currentUser}
//           </span>
//         </p>

//                         {/* Footer */}
//                         <div className="mt-3 flex items-center justify-between">
//                           <div className="flex items-center gap-2">
//                             <Clock className="w-4 h-4 text-cyan-400" />

//                             <span className="text-sm font-medium text-slate-300">
//                               {notif.time}
//                             </span>
//                           </div>

//                           <Button
//                             onClick={(e) => {
//                               e.stopPropagation();

//                               // 💡 SMART ROUTER: Message padh ke form ka route nikalega
//                               const msg = notif.message.toLowerCase();
//                               let formRoute = "deviation"; // Default route

//                               if (msg.includes("deviation"))
//                                 formRoute = "deviation";
//                               else if (msg.includes("redbin attendance"))
//                                 formRoute = "redbin-attendance";
//                               else if (
//                                 msg.includes("redbin") ||
//                                 msg.includes("red bin")
//                               )
//                                 formRoute = "redbin";
//                               else if (msg.includes("incoming"))
//                                 formRoute = "incoming";
//                               else if (msg.includes("scrap"))
//                                 formRoute = "scrap";
//                               else if (msg.includes("poka"))
//                                 formRoute = "poka-yoke";
//                               else if (msg.includes("inspection"))
//                                 formRoute = "inspection";
//                               else if (msg.includes("pdi")) formRoute = "pdi";
//                               else if (msg.includes("rework"))
//                                 formRoute = "rework";
//                               else if (msg.includes("sample"))
//                                 formRoute = "sample-inspection";
//                               else if (
//                                 msg.includes("good receipt") ||
//                                 msg.includes("material requisition")
//                               )
//                                 formRoute = "good-receipt";
//                               else if (msg.includes("rm quality"))
//                                 formRoute = "rm-quality-plan";

//                               // Direct View Form page par navigate kar raha hai sahi route ke sath
//                               navigate(
//                                 `/qa-hub/view-report/${formRoute}/${notif.report_log_id}`,
//                               );
//                             }}
//                             size="sm"
//                             className="
//           h-8
//           rounded-lg
//           bg-cyan-500/10
//           text-cyan-300
//           border
//           border-cyan-500/20
//           hover:bg-cyan-500/20
//           hover:border-cyan-500/40
//           transition-all
//         "
//                           >
//                             View Report →
//                           </Button>
//                         </div>
//                       </div>
//                     </Card>
//                   </motion.div>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; 
import { Bell, Check, X, AlertCircle, CheckCircle2, Clock, Settings, FileText } from 'lucide-react';
import Sidebar from './Sidebar';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // LocalStorage se logged-in user nikal rahe hain
  const currentUser = localStorage.getItem('username') || '';

  // Helper time format function
  const formatTimeAgo = (dateString) => {
    if (typeof dateString === 'string' && dateString.includes('-')) return dateString;
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMins = Math.floor((now - date) / 60000);
    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins} mins ago`;
    const diffInHours = Math.floor(diffInMins / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return date.toLocaleDateString();
  };

  // ====================================================================
  // 🔥 SMART ROUTER LOGIC (Detect Hub & Route based on message)
  // ====================================================================
  const getRoutingInfo = (message) => {
    const msg = message.toLowerCase();
    let formRoute = 'deviation'; // Default fallback
    let hub = 'qa-hub'; // Default fallback
    let title = "QA Report Approval Required";

    // ─── 🏭 PRODUCTION HUB FORMS ───
    if (msg.includes('daily prod')) { formRoute = 'daily-prod-plan'; hub = 'production-hub'; }
    else if (msg.includes('4m inspection') || msg.includes('four m inspection')) { formRoute = 'four-m-inspection'; hub = 'production-hub'; }
    else if (msg.includes('4m record') || msg.includes('four m record')) { formRoute = 'four-m-record'; hub = 'production-hub'; }
    else if (msg.includes('4m display') || msg.includes('four m display')) { formRoute = 'four-m-display'; hub = 'production-hub'; }
    else if (msg.includes('4m summary') || msg.includes('four m summary')) { formRoute = 'four-m-summary'; hub = 'production-hub'; }
    else if (msg.includes('tip change')) { formRoute = 'tip-change'; hub = 'production-hub'; }
    else if (msg.includes('bin trolley') || msg.includes('bin/trolley')) { formRoute = 'bin-trolley'; hub = 'production-hub'; }
    else if (msg.includes('5s') || msg.includes('five s')) { formRoute = 'five-s-view'; hub = 'production-hub'; }
    else if (msg.includes('monthly prod')) { formRoute = 'monthly-prod-plan'; hub = 'production-hub'; }
    else if (msg.includes('observance check')) { formRoute = 'operator-observance-checklist'; hub = 'production-hub'; }
    else if (msg.includes('observance plan')) { formRoute = 'operator-observance-plan'; hub = 'production-hub'; }
    else if (msg.includes('pm checklist') || msg.includes('pm mhe')) { formRoute = 'pm-checklist-mhe'; hub = 'production-hub'; }
    else if (msg.includes('projection welder')) { formRoute = 'projection-welder'; hub = 'production-hub'; }
    else if (msg.includes('spot welder')) { formRoute = 'spot-welder'; hub = 'production-hub'; }
    else if (msg.includes('tig') || msg.includes('mig')) { formRoute = 'tig-mig-welder'; hub = 'production-hub'; }
    else if (msg.includes('process validation')) { formRoute = 'process-validation'; hub = 'production-hub'; }

    // ─── 🛡️ QA HUB FORMS ───
    else if (msg.includes('deviation')) { formRoute = 'deviation'; hub = 'qa-hub'; }
    else if (msg.includes('redbin attendance') || msg.includes('red bin attendance')) { formRoute = 'redbin-attendance'; hub = 'qa-hub'; }
    else if (msg.includes('redbin') || msg.includes('red bin')) { formRoute = 'redbin'; hub = 'qa-hub'; }
    else if (msg.includes('incoming')) { formRoute = 'incoming-inspection-view'; hub = 'qa-hub'; }
    else if (msg.includes('scrap')) { formRoute = 'scrap-note-view'; hub = 'qa-hub'; }
    else if (msg.includes('poka')) { formRoute = 'poka-yoke'; hub = 'qa-hub'; }
    else if (msg.includes('inspection')) { formRoute = 'inspection-view'; hub = 'qa-hub'; }
    else if (msg.includes('pdi')) { formRoute = 'pdi'; hub = 'qa-hub'; }
    else if (msg.includes('rework')) { formRoute = 'rework-view'; hub = 'qa-hub'; }
    else if (msg.includes('sample')) { formRoute = 'sample-inspection'; hub = 'qa-hub'; }
    else if (msg.includes('good receipt') || msg.includes('requisition')) { formRoute = 'good-receipt'; hub = 'qa-hub'; }
    else if (msg.includes('rm quality')) { formRoute = 'rm-quality-plan'; hub = 'qa-hub'; }
    else if (msg.includes('process audit')) { formRoute = 'process-audit-view'; hub = 'qa-hub'; }
    else if (msg.includes('coherence')) { formRoute = 'coherence-view'; hub = 'qa-hub'; }
    else if (msg.includes('layout')) { formRoute = 'layout-inspection-view'; hub = 'qa-hub'; }
    else if (msg.includes('product audit')) { formRoute = 'product-audit-plan-view'; hub = 'qa-hub'; }
    else if (msg.includes('complaint')) { formRoute = 'customer-complaint-view'; hub = 'qa-hub'; }
    else if (msg.includes('satisfaction')) { formRoute = 'customer-satisfaction-view'; hub = 'qa-hub'; }
    else if (msg.includes('warranty')) { formRoute = 'warranty-claim-view'; hub = 'qa-hub'; }
    else if (msg.includes('mom') || msg.includes('meeting')) { formRoute = 'mom-view'; hub = 'qa-hub'; }

    // ─── 🔧 MAINTENANCE HUB FORMS ───
    else if (msg.includes('maintenance')) { formRoute = 'maintenance-report'; hub = 'maintenance-hub'; }

    // Dynamic Title Set karna
    if (hub === 'production-hub') title = "Production Report Approval";
    else if (hub === 'maintenance-hub') title = "Maintenance Action Required";

    return { formRoute, hub, title };
  };

  // ====================================================================
  // 🔥 FETCH API
  // ====================================================================
  const fetchNotifications = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`${API_BASE}/api/qa-notifications/${currentUser}/`);
      const data = await res.json();
      if (res.ok && data.notifications) {
        setNotifications(data.notifications); 
      }
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const activeNotifications = notifications; 

  return (
    <div className="min-h-screen bg-[#0f172a] flex relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 
                ? 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(251, 191, 36, 0.08) 0%, transparent 70%)',
            }}
            animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: Math.random() * 15 + 10, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto relative z-10">
        <div className="max-w-[1200px] mx-auto px-8 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                className="mb-2 bg-gradient-to-r from-cyan-400 via-white to-yellow-400 bg-clip-text text-transparent relative inline-block text-3xl font-bold"
              >
                Alerts & Notifications
                <motion.div className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-cyan-500 to-yellow-500 rounded-full" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.3, duration: 0.8 }} />
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-slate-400 mt-2">
                Action required for submitted reports across all Hubs
              </motion.p>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setNotifications([])} variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 cursor-pointer">
                <Check className="w-4 h-4 mr-2" /> Clear All
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-cyan-500 text-center py-10 font-bold animate-pulse">Loading Live Alerts...</div>
            ) : activeNotifications.length === 0 ? (
               <div className="text-slate-500 text-center py-10 text-lg">📭 No active notifications. All caught up!</div>
            ) : (
              activeNotifications.map((notif, index) => {
                
                // 🔥 SMART ROUTER CALL
                const routeInfo = getRoutingInfo(notif.message);

                return (
                  <motion.div key={notif.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                    <Card 
                      className="backdrop-blur-xl border p-6 transition-all hover:scale-[1.01] relative overflow-hidden bg-gradient-to-br from-cyan-500/10 to-[#1e293b]/80 border-cyan-500/30"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-blue-500" />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        
                        <div className="flex items-start gap-4">
                          <motion.div className="w-12 h-12 rounded-xl flex items-center justify-center relative bg-cyan-500/20" whileHover={{ scale: 1.1, rotate: 5 }}>
                            <div className="absolute inset-0 blur-md opacity-30 bg-cyan-500 rounded-xl" />
                            <FileText className="w-6 h-6 relative z-10 text-cyan-400" />
                          </motion.div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-bold text-cyan-400">
                                {routeInfo.title} {/* 🔥 DYNAMIC TITLE */}
                              </h3>
                            </div>
                            <p className="text-slate-300 mb-3 font-medium">{notif.message}</p>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <Clock className="w-4 h-4" />
                              <span>{formatTimeAgo(notif.time)}</span>
                              <span className={`px-2 py-0.5 rounded text-xs border ml-2 font-bold ${
                                routeInfo.hub === 'production-hub' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                routeInfo.hub === 'maintenance-hub' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                                'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                              }`}>
                                Pending Approval
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* 🔥 DYNAMIC NAVIGATION BUTTON */}
                        <div className="flex gap-3 sm:flex-col md:flex-row mt-4 sm:mt-0">
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              // Direct View Form page par navigate kar raha hai dynamic hub ke sath
                              navigate(`/${routeInfo.hub}/view-report/${routeInfo.formRoute}/${notif.report_log_id}`);
                            }}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 font-bold"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            View Report
                          </Button>
                        </div>

                      </div>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}