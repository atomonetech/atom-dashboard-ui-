

// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Check, Clock } from "lucide-react";
// import Sidebar from "./Sidebar";
// import { Card } from "./ui/card";
// import { Button } from "./ui/button";
// import { useNavigate } from "react-router-dom";

// const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

// const PROD_HUB = "production-hub";
// const QA_HUB = "qa-hub";
// const MAINT_HUB = "maintenance-hub";

// const PROD_TITLE = "Production Report Approval Required";
// const QA_TITLE = "Quality Report Approval Required";
// const MAINT_TITLE = "Maintenance Action Required";

// const DEFAULT_ROUTE = {
//   formRoute: "daily-prod-plan",
//   hub: PROD_HUB,
//   title: PROD_TITLE,
// };

// const normalizeText = (value = "") => {
//   return String(value)
//     .toLowerCase()
//     .replace(/[_-]/g, " ")
//     .replace(/[^\w\s/]/g, "")
//     .replace(/\s+/g, " ")
//     .trim();
// };

// const buildRoutes = (hub, title, items) =>
//   Object.fromEntries(
//     items.flatMap(([formRoute, aliases]) =>
//       aliases.map((alias) => [normalizeText(alias), { formRoute, hub, title }]),
//     ),
//   );

// const ROUTE_MAP = {
//   ...buildRoutes(PROD_HUB, PROD_TITLE, [
//     [
//       "daily-prod-plan",
//       ["daily prod form", "daily production plan", "daily production form"],
//     ],
//     ["bin-trolley", ["bin trolley form", "bin trolley"]],
//     ["tip-change", ["tip change monitor form", "tip change"]],
//     [
//       "four-m-inspection",
//       ["4m change inspection", "4m change inspection form"],
//     ],
//     ["four-m-record", ["4m tracking record"]],
//     ["four-m-display", ["4m display board"]],
//     ["four-m-summary", ["4m summary sheet"]],

//     // ✅ fixed route for 4M Information Sheet
//     ["four-m-information", ["4m information sheet", "information sheet"]],

//     ["five-s", ["5s checksheet"]],
//     ["monthly-prod-plan", ["monthly prod plan"]],
//     ["operator-observance-checklist", ["operator observance checklist"]],
//     ["operator-observance-plan", ["operator observance plan"]],
//     ["pm-checklist-mhe", ["pm checklist mhe"]],
//     ["projection-welder", ["projection welder"]],
//     ["spot-welder", ["spot welder"]],
//     ["tig-mig-welder", ["tig/mig welder", "tig mig welder"]],
//     ["process-validation", ["process validation"]],
//   ]),

//   ...buildRoutes(QA_HUB, QA_TITLE, [
//     ["deviation", ["deviation report", "deviation"]],
//     ["redbin-attendance", ["redbin attendance", "red bin attendance"]],
//     ["redbin", ["redbin", "red bin", "red bin analysis"]],
//     [
//       "incoming",
//       ["incoming", "incoming inspection", "incoming material inspection"],
//     ],
//     ["scrap", ["scrap", "scrap note"]],
//     ["poka-yoke", ["poka yoke"]],
//     ["inspection", ["inspection"]],
//     ["pdi", ["pdi"]],
//     ["rework", ["rework"]],
//     ["sample-inspection", ["sample inspection"]],
//     ["good-receipt", ["good receipt", "requisition"]],
//     ["rm-quality-plan", ["rm quality", "raw material"]],
//     ["process-audit", ["process audit"]],
//     ["coherence", ["coherence"]],
//     ["layout-inspection", ["layout", "layout inspection"]],
//     ["product-audit-plan", ["product audit"]],
//     ["customer-complaint", ["complaint", "customer complaint"]],
//     ["customer-satisfaction", ["satisfaction", "customer satisfaction"]],
//     ["warranty-claim", ["warranty", "warranty claim"]],
//     ["mom", ["mom", "meeting"]],
//   ]),

//   ...buildRoutes(MAINT_HUB, MAINT_TITLE, [
//     ["machine-history", ["machine history card", "machine history form"]],
//     [
//       "power-press-checksheet",
//       ["daily power press checksheet", "power press checksheet"],
//     ],
//     [
//       "machine-breakdown",
//       ["machine breakdown", "machine breakdown form", "machine breakdown slip"],
//     ],
//     ["poka-yoke", ["poka yoke monitoring", "poka yoke"]],
//     [
//       "preventive-maintenance",
//       ["preventive maintenance", "machine preventive maintenance"],
//     ],
//     ["tool-breakdown", ["tool breakdown"]],
//     ["tool-preventive-maintenance", ["tool preventive maintenance"]],
//     ["tool-history", ["tool history"]],
//     ["maintenance-report", ["maintenance"]],
//   ]),
// };

// const extractReportNameFromMessage = (message = "") => {
//   const match = String(message).match(/submitted\s+(.*?)\s+on/i);
//   return match?.[1] || "";
// };

// const getFallbackRoute = (notif = {}) => {
//   const possibleKeys = [
//     notif.report_name,
//     notif.reportName,
//     notif.form_name,
//     notif.formName,
//     extractReportNameFromMessage(notif.message),
//     notif.message,
//   ]
//     .map(normalizeText)
//     .filter(Boolean);

//   const matchedKey = possibleKeys.find((key) => ROUTE_MAP[key]);

//   return ROUTE_MAP[matchedKey] || DEFAULT_ROUTE;
// };

// const formatUserName = (value = "") => {
//   const username = String(value || "Unknown User").split("@")[0];
//   return username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
// };

// const BACKGROUND_BUBBLES = Array.from({ length: 10 }, (_, i) => ({
//   id: i,
//   width: Math.random() * 200 + 50,
//   height: Math.random() * 200 + 50,
//   left: `${Math.random() * 100}%`,
//   top: `${Math.random() * 100}%`,
//   background:
//     i % 2 === 0
//       ? "radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)"
//       : "radial-gradient(circle, rgba(251, 191, 36, 0.08) 0%, transparent 70%)",
//   duration: Math.random() * 15 + 10,
// }));

// const BackgroundBubbles = () => {
//   return (
//     <div className="absolute inset-0 pointer-events-none overflow-hidden">
//       {BACKGROUND_BUBBLES.map((bubble) => (
//         <motion.div
//           key={bubble.id}
//           className="absolute rounded-full"
//           style={{
//             width: bubble.width,
//             height: bubble.height,
//             left: bubble.left,
//             top: bubble.top,
//             background: bubble.background,
//           }}
//           animate={{
//             y: [0, -30, 0],
//             x: [0, 20, 0],
//             scale: [1, 1.2, 1],
//             opacity: [0.3, 0.6, 0.3],
//           }}
//           transition={{
//             duration: bubble.duration,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// export default function Notifications() {
//   const navigate = useNavigate();
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const currentUser = localStorage.getItem("username") || "";

//   const formatTimeAgo = (dateString) => {
//     const rawValue = dateString || "";

//     const fixedFormattedDate =
//       typeof rawValue === "string" && rawValue.includes("-") ? rawValue : null;

//     const date = new Date(rawValue);
//     const invalidDate = Number.isNaN(date.getTime());

//     const now = new Date();
//     const diffInMins = Math.floor((now - date) / 60000);
//     const diffInHours = Math.floor(diffInMins / 60);

//     return (
//       fixedFormattedDate ||
//       (invalidDate && rawValue) ||
//       (diffInMins < 1 && "Just now") ||
//       (diffInMins < 60 && `${diffInMins} mins ago`) ||
//       (diffInHours < 24 && `${diffInHours} hours ago`) ||
//       date.toLocaleDateString()
//     );
//   };

//   const fetchNotifications = async (showLoader = false) => {
//     if (showLoader) {
//       setLoading(true);
//     }

//     try {
//       const encodedUser = encodeURIComponent(currentUser);
//       const res = await fetch(
//         `${API_BASE}/api/qa-notifications/${encodedUser}/`,
//       );
//       const data = await res.json();

//       const nextNotifications =
//         res.ok && Array.isArray(data.notifications) ? data.notifications : [];

//       setNotifications(nextNotifications);
//     } catch (err) {
//       console.error("Fetch notifications failed:", err);
//     } finally {
//       if (showLoader) {
//         setLoading(false);
//       }
//     }
//   };

//   useEffect(() => {
//     if (!currentUser) {
//       setLoading(false);
//       return;
//     }

//     fetchNotifications(true);

//     const interval = setInterval(() => {
//       fetchNotifications(false);
//     }, 10000);

//     return () => clearInterval(interval);
//   }, [currentUser]);

//   const parseNotification = (notif = {}) => {
//     const message = notif.message || "";
//     const match = message.match(/^(.*?) submitted (.*?) on/i);

//     const submittedBy =
//       notif.submitted_by || notif.submittedBy || match?.[1] || "Unknown User";

//     const reportType =
//       notif.report_name ||
//       notif.reportName ||
//       notif.form_name ||
//       notif.formName ||
//       match?.[2] ||
//       "Report";

//     return {
//       submittedBy: formatUserName(submittedBy),
//       reportType,
//     };
//   };

//   const handleViewReport = (notif = {}) => {
//     const fallbackRoute = getFallbackRoute(notif);

//     const route =
//       notif.formRoute ||
//       notif.form_route ||
//       notif.formKey ||
//       notif.form_key ||
//       fallbackRoute.formRoute;

//     const rawHub =
//       notif.hub || notif.hubRoute || notif.hub_route || fallbackRoute.hub;

//     const reportLogId =
//       notif.report_log_id ||
//       notif.reportLogId ||
//       notif.report_log ||
//       notif.log_id ||
//       notif.id;

//     const maintenanceMachineRoutes = new Set([
//       "machine-history",
//       "power-press-checksheet",
//       "machine-breakdown",
//       "poka-yoke",
//       "preventive-maintenance",
//       "machine-preventive-maintenance",
//       "cnc-maintenance",
//       "vertical-milling-checksheet",
//       "projection-welding-pm",
//       "power-press-pm",
//       "hydraulic-pm",
//     ]);

//     const maintenanceToolRoutes = new Set([
//       "tool-history",
//       "tool-breakdown",
//       "tool-preventive-maintenance",
//       "tool-critical-spare",
//       "fixture-maintenance",
//     ]);

//     const isMaintenanceRoute =
//       maintenanceMachineRoutes.has(route) || maintenanceToolRoutes.has(route);

//     const hub = isMaintenanceRoute ? MAINT_HUB : rawHub;

//     const getViewBasePath = (hubName, formRoute) => {
//       if (hubName === MAINT_HUB) {
//         return maintenanceToolRoutes.has(formRoute)
//           ? "/Maintenance/Tool"
//           : "/Maintenance/Machine";
//       }

//       return `/${hubName}`;
//     };

//     const targetUrl = `${getViewBasePath(
//       hub,
//       route,
//     )}/view-report/${route}/${reportLogId}`;

//     reportLogId
//       ? navigate(targetUrl)
//       : alert(
//           "Report log id missing. Please check backend notification response.",
//         );
//   };

//   return (
//     <div className="min-h-screen bg-[#0f172a] flex relative overflow-hidden">
//       <BackgroundBubbles />

//       <Sidebar />

//       <div className="flex-1 overflow-auto relative z-10">
//         <div className="max-w-[1200px] mx-auto px-8 py-8">
//           <div className="mb-8 flex items-center justify-between">
//             <div>
//               <motion.h1
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="mb-2 bg-gradient-to-r from-cyan-400 via-white to-yellow-400 bg-clip-text text-transparent relative inline-block text-3xl font-bold"
//               >
//                 Alerts & Notifications
//               </motion.h1>

//               <motion.p
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.2 }}
//                 className="text-slate-400 mt-2"
//               >
//                 Action required for submitted reports across all Hubs
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

//           <div className="space-y-4">
//             {loading ? (
//               <div className="text-cyan-500 text-center py-10 font-bold animate-pulse">
//                 Loading Live Alerts...
//               </div>
//             ) : notifications.length === 0 ? (
//               <div className="text-slate-500 text-center py-10 text-lg">
//                 📭 No active notifications. All caught up!
//               </div>
//             ) : (
//               notifications.map((notif, index) => {
//                 const { submittedBy, reportType } = parseNotification(notif);
//                 const fallbackRoute = getFallbackRoute(notif);

//                 const title =
//                   notif.title ||
//                   notif.notification_title ||
//                   fallbackRoute.title ||
//                   "Report Approval Required";

//                 return (
//                   <motion.div
//                     key={notif.id || index}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: index * 0.1 }}
//                   >
//                     <Card className="group border border-slate-800 bg-[#111827] hover:border-cyan-500/30 rounded-xl transition-all duration-200">
//                       <div className="p-4">
//                         <div className="flex justify-between items-center">
//                           <div>
//                             <h3 className="font-semibold text-white text-[15px]">
//                               {reportType}
//                             </h3>

//                             <p className="text-xs text-slate-500 mt-1">
//                               {title}
//                             </p>
//                           </div>

//                           <span className="text-[11px] px-2 py-1 rounded-md bg-amber-500/15 text-amber-300 font-medium">
//                             Pending
//                           </span>
//                         </div>

//                         <p className="mt-2 text-sm text-slate-400">
//                           Submitted by
//                           <span className="text-slate-200 ml-1">
//                             {submittedBy}
//                           </span>
//                         </p>

//                         <div className="mt-3 flex items-center justify-between">
//                           <div className="flex items-center gap-2">
//                             <Clock className="w-4 h-4 text-cyan-400" />
//                             <span className="text-sm font-medium text-slate-300">
//                               {formatTimeAgo(
//                                 notif.time ||
//                                   notif.created_at ||
//                                   notif.createdAt,
//                               )}
//                             </span>
//                           </div>

//                           <Button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleViewReport(notif);
//                             }}
//                             size="sm"
//                             className="h-8 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 hover:bg-cyan-500/20 hover:border-cyan-500/40 transition-all cursor-pointer"
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
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Clock } from "lucide-react";
import Sidebar from "./Sidebar";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

// =================================================================================
// THEME VARIABLES
// =================================================================================
const THEME_VARS = `
  /* LIGHT — Perfected Contrast & Hierarchy */
  [data-theme="light"] {
    --bg-main: #f3f4f6; /* Deepened canvas slightly so white cards pop more */
    --card-bg: #ffffff;
    --card-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); /* Added elevation */
    --card-border: rgba(0, 0, 0, 0.02); /* Virtually transparent */
    --card-hover-border: rgba(37, 99, 235, 0.2);
    
    --text-main: #111827;
    --text-soft: #4b5563; /* Deep slate for high contrast secondary text */
    --text-dim: #6b7280; /* Softer charcoal for timestamps */
    --text-muted: #9ca3af;
    
    --accent: #2563eb;
    
    --bubble-1: rgba(37, 99, 235, 0.05);
    --bubble-2: rgba(37, 99, 235, 0.03);
    
    /* Solid Rich Navy Header (Gradient stops unified) */
    --title-from: #111827;
    --title-via: #111827;
    --title-to: #111827;
    
    /* Warning/Amber Pending Badge */
    --badge-bg: #fef3c7;
    --badge-text: #92400e;

    /* High Contrast CTA Button */
    --btn-bg: #2563eb;
    --btn-text: #ffffff;
    --btn-border: #2563eb;
    --btn-hover-bg: #1d4ed8;

    /* Clear All Button */
    --btn-clear-bg: #ffffff;
    --btn-clear-text: #2563eb;
    --btn-clear-border: rgba(37, 99, 235, 0.3);
    --btn-clear-hover: rgba(37, 99, 235, 0.05);
  }

  /* DARK — Original AtomOne Palette (100% Untouched) */
  [data-theme="dark"] {
    --bg-main: #0f172a;
    --card-bg: #111827;
    --card-shadow: none;
    --card-border: #1e293b;
    --card-hover-border: rgba(34, 211, 238, 0.3);
    
    --text-main: #ffffff;
    --text-soft: #94a3b8;
    --text-dim: #cbd5e1;
    --text-muted: #64748b;
    
    --accent: #22d3ee;
    
    --bubble-1: rgba(6, 182, 212, 0.08);
    --bubble-2: rgba(251, 191, 36, 0.08);
    
    /* Original Vibrant Gradient */
    --title-from: #22d3ee;
    --title-via: #ffffff;
    --title-to: #facc15;
    
    /* Original Amber Badge */
    --badge-bg: rgba(245, 158, 11, 0.15);
    --badge-text: #fcd34d;

    /* Original Cyan Ghost CTA Button */
    --btn-bg: rgba(6, 182, 212, 0.1);
    --btn-text: #22d3ee;
    --btn-border: rgba(6, 182, 212, 0.2);
    --btn-hover-bg: rgba(6, 182, 212, 0.2);

    /* Original Clear All Button */
    --btn-clear-bg: #111827;
    --btn-clear-text: #22d3ee;
    --btn-clear-border: rgba(34, 211, 238, 0.3);
    --btn-clear-hover: rgba(34, 211, 238, 0.1);
  }
`;

const PROD_HUB = "production-hub";
const QA_HUB = "qa-hub";
const MAINT_HUB = "maintenance-hub";

const PROD_TITLE = "Production Report Approval Required";
const QA_TITLE = "Quality Report Approval Required";
const MAINT_TITLE = "Maintenance Action Required";

const DEFAULT_ROUTE = {
  formRoute: "daily-prod-plan",
  hub: PROD_HUB,
  title: PROD_TITLE,
};

const normalizeText = (value = "") => {
  return String(value)
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/[^\w\s/]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const buildRoutes = (hub, title, items) =>
  Object.fromEntries(
    items.flatMap(([formRoute, aliases]) =>
      aliases.map((alias) => [normalizeText(alias), { formRoute, hub, title }]),
    ),
  );

const ROUTE_MAP = {
  ...buildRoutes(PROD_HUB, PROD_TITLE, [
    [
      "daily-prod-plan",
      ["daily prod form", "daily production plan", "daily production form"],
    ],
    ["bin-trolley", ["bin trolley form", "bin trolley"]],
    ["tip-change", ["tip change monitor form", "tip change"]],
    [
      "four-m-inspection",
      ["4m change inspection", "4m change inspection form"],
    ],
    ["four-m-record", ["4m tracking record"]],
    ["four-m-display", ["4m display board"]],
    ["four-m-summary", ["4m summary sheet"]],
    ["four-m-information", ["4m information sheet", "information sheet"]],
    ["five-s", ["5s checksheet"]],
    ["monthly-prod-plan", ["monthly prod plan"]],
    ["operator-observance-checklist", ["operator observance checklist"]],
    ["operator-observance-plan", ["operator observance plan"]],
    ["pm-checklist-mhe", ["pm checklist mhe"]],
    ["projection-welder", ["projection welder"]],
    ["spot-welder", ["spot welder"]],
    ["tig-mig-welder", ["tig/mig welder", "tig mig welder"]],
    ["process-validation", ["process validation"]],
  ]),

  ...buildRoutes(QA_HUB, QA_TITLE, [
    ["deviation", ["deviation report", "deviation"]],
    ["redbin-attendance", ["redbin attendance", "red bin attendance"]],
    ["redbin", ["redbin", "red bin", "red bin analysis"]],
    [
      "incoming",
      ["incoming", "incoming inspection", "incoming material inspection"],
    ],
    ["scrap", ["scrap", "scrap note"]],
    ["poka-yoke", ["poka yoke"]],
    ["inspection", ["inspection"]],
    ["pdi", ["pdi"]],
    ["rework", ["rework"]],
    ["sample-inspection", ["sample inspection"]],
    ["good-receipt", ["good receipt", "requisition"]],
    ["rm-quality-plan", ["rm quality", "raw material"]],
    ["process-audit", ["process audit"]],
    ["coherence", ["coherence"]],
    ["layout-inspection", ["layout", "layout inspection"]],
    ["product-audit-plan", ["product audit"]],
    ["customer-complaint", ["complaint", "customer complaint"]],
    ["customer-satisfaction", ["satisfaction", "customer satisfaction"]],
    ["warranty-claim", ["warranty", "warranty claim"]],
    ["mom", ["mom", "meeting"]],
  ]),

  ...buildRoutes(MAINT_HUB, MAINT_TITLE, [
    ["machine-history", ["machine history card", "machine history form"]],
    [
      "power-press-checksheet",
      ["daily power press checksheet", "power press checksheet"],
    ],
    [
      "machine-breakdown",
      ["machine breakdown", "machine breakdown form", "machine breakdown slip"],
    ],
    ["poka-yoke", ["poka yoke monitoring", "poka yoke"]],
    [
      "preventive-maintenance",
      ["preventive maintenance", "machine preventive maintenance"],
    ],
    ["tool-breakdown", ["tool breakdown"]],
    ["tool-preventive-maintenance", ["tool preventive maintenance"]],
    ["tool-history", ["tool history"]],
    ["maintenance-report", ["maintenance"]],
  ]),
};

const extractReportNameFromMessage = (message = "") => {
  const match = String(message).match(/submitted\s+(.*?)\s+on/i);
  return match?.[1] || "";
};

const getFallbackRoute = (notif = {}) => {
  const possibleKeys = [
    notif.report_name,
    notif.reportName,
    notif.form_name,
    notif.formName,
    extractReportNameFromMessage(notif.message),
    notif.message,
  ]
    .map(normalizeText)
    .filter(Boolean);

  const matchedKey = possibleKeys.find((key) => ROUTE_MAP[key]);

  return ROUTE_MAP[matchedKey] || DEFAULT_ROUTE;
};

const formatUserName = (value = "") => {
  const username = String(value || "Unknown User").split("@")[0];
  return username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
};

const BACKGROUND_BUBBLES = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  width: Math.random() * 200 + 50,
  height: Math.random() * 200 + 50,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  background:
    i % 2 === 0
      ? "radial-gradient(circle, var(--bubble-1) 0%, transparent 70%)"
      : "radial-gradient(circle, var(--bubble-2) 0%, transparent 70%)",
  duration: Math.random() * 15 + 10,
}));

const BackgroundBubbles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {BACKGROUND_BUBBLES.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full"
          style={{
            width: bubble.width,
            height: bubble.height,
            left: bubble.left,
            top: bubble.top,
            background: bubble.background,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [machineNotifications, setMachineNotifications] = useState([]);
  const [nowTick, setNowTick] = useState(Date.now());
  // Sync theme with global layout
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return window.localStorage.getItem("atomone-theme") || "light";
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setNowTick(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          setTheme(document.documentElement.getAttribute('data-theme') || 'light');
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const handleStorage = () => setTheme(window.localStorage.getItem("atomone-theme") || "light");
    window.addEventListener("storage", handleStorage);
    return () => { observer.disconnect(); window.removeEventListener("storage", handleStorage); };
  }, []);

  const currentUser = localStorage.getItem("username") || "";

  const formatTimeAgo = (dateString) => {
    const rawValue = dateString || "";

    const fixedFormattedDate =
      typeof rawValue === "string" && rawValue.includes("-") ? rawValue : null;

    const date = new Date(rawValue);
    const invalidDate = Number.isNaN(date.getTime());

    const now = new Date();
    const diffInMins = Math.floor((now - date) / 60000);
    const diffInHours = Math.floor(diffInMins / 60);

    return (
      fixedFormattedDate ||
      (invalidDate && rawValue) ||
      (diffInMins < 1 && "Just now") ||
      (diffInMins < 60 && `${diffInMins} mins ago`) ||
      (diffInHours < 24 && `${diffInHours} hours ago`) ||
      date.toLocaleDateString()
    );
  };

  const formatIdleDuration = (notif) => {
    if (!notif?.idle_started_at) {
      return "00:00";
    }

    const start = new Date(notif.idle_started_at).getTime();

    // Active event:
    // idle_ended_at NULL -> timer continuously chalega.
    //
    // Closed but reason pending:
    // idle_ended_at available -> timer wahi freeze hoga.
    const end = notif.idle_ended_at
      ? new Date(notif.idle_ended_at).getTime()
      : nowTick;

    if (
      Number.isNaN(start) ||
      Number.isNaN(end) ||
      end < start
    ) {
      return "00:00";
    }

    const totalSeconds = Math.floor(
      (end - start) / 1000
    );

    const hours = Math.floor(
      totalSeconds / 3600
    );

    const minutes = Math.floor(
      (totalSeconds % 3600) / 60
    );

    const seconds =
      totalSeconds % 60;

    if (hours > 0) {
      return (
        `${String(hours).padStart(2, "0")}:` +
        `${String(minutes).padStart(2, "0")}:` +
        `${String(seconds).padStart(2, "0")}`
      );
    }

    return (
      `${String(minutes).padStart(2, "0")}:` +
      `${String(seconds).padStart(2, "0")}`
    );
  };

  const fetchNotifications = async (showLoader = false) => {
    if (showLoader) {
      setLoading(true);
    }

    try {
      const encodedUser = encodeURIComponent(currentUser);
      const res = await fetch(
        `${API_BASE}/api/qa-notifications/${encodedUser}/`,
      );
      const data = await res.json();

      const nextNotifications =
        res.ok && Array.isArray(data.notifications) ? data.notifications : [];

      setNotifications(nextNotifications);
    } catch (err) {
      console.error("Fetch notifications failed:", err);
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  const fetchMachineNotifications = async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setMachineNotifications([]);
        return;
      }

      const res = await fetch(
        `${API_BASE}/api/my-notifications/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      let pendingMachineNotifications = [];

      if (
        res.ok &&
        data.success &&
        Array.isArray(data.data)
      ) {

        // =====================================================
        // 1. Only machine idle notifications
        // =====================================================

        const machineOnly = data.data.filter(
          (notif) =>
            notif.notification_type === "IDLE_REASON"
        );

        // IMPORTANT:
        // Har unfilled physical idle event show hoga.
        // Same machine ke old pending event ko newer event hide nahi karega.
        pendingMachineNotifications =
          machineOnly
            .filter(
              (notif) =>
                notif.status === "PENDING"
            )
            .sort(
              (a, b) =>
                new Date(b.idle_started_at || b.created_at) -
                new Date(a.idle_started_at || a.created_at)
            );
      }

      setMachineNotifications(
        pendingMachineNotifications
      );

      console.log(
        "🔔 Pending machine notifications:",
        pendingMachineNotifications.length
      );

    } catch (err) {
      console.error(
        "❌ Machine notifications fetch failed:",
        err
      );

      setMachineNotifications([]);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    // Existing QA / report notifications
    fetchNotifications(true);

    // New machine idle notifications
    fetchMachineNotifications();

    const interval = setInterval(() => {

      fetchNotifications(false);

      fetchMachineNotifications();

    }, 10000);

    return () => clearInterval(interval);

  }, [currentUser]);

  const parseNotification = (notif = {}) => {
    const message = notif.message || "";
    const match = message.match(/^(.*?) submitted (.*?) on/i);

    const submittedBy =
      notif.submitted_by || notif.submittedBy || match?.[1] || "Unknown User";

    const reportType =
      notif.report_name ||
      notif.reportName ||
      notif.form_name ||
      notif.formName ||
      match?.[2] ||
      "Report";

    return {
      submittedBy: formatUserName(submittedBy),
      reportType,
    };
  };

  const handleViewReport = (notif = {}) => {
    const fallbackRoute = getFallbackRoute(notif);

    const route =
      notif.formRoute ||
      notif.form_route ||
      notif.formKey ||
      notif.form_key ||
      fallbackRoute.formRoute;

    const rawHub =
      notif.hub || notif.hubRoute || notif.hub_route || fallbackRoute.hub;

    const reportLogId =
      notif.report_log_id ||
      notif.reportLogId ||
      notif.report_log ||
      notif.log_id ||
      notif.id;

    const maintenanceMachineRoutes = new Set([
      "machine-history",
      "power-press-checksheet",
      "machine-breakdown",
      "poka-yoke",
      "preventive-maintenance",
      "machine-preventive-maintenance",
      "cnc-maintenance",
      "vertical-milling-checksheet",
      "projection-welding-pm",
      "power-press-pm",
      "hydraulic-pm",
    ]);

    const maintenanceToolRoutes = new Set([
      "tool-history",
      "tool-breakdown",
      "tool-preventive-maintenance",
      "tool-critical-spare",
      "fixture-maintenance",
    ]);

    const isMaintenanceRoute =
      maintenanceMachineRoutes.has(route) || maintenanceToolRoutes.has(route);

    const hub = isMaintenanceRoute ? MAINT_HUB : rawHub;

    const getViewBasePath = (hubName, formRoute) => {
      if (hubName === MAINT_HUB) {
        return maintenanceToolRoutes.has(formRoute)
          ? "/Maintenance/Tool"
          : "/Maintenance/Machine";
      }

      return `/${hubName}`;
    };

    const targetUrl = `${getViewBasePath(
      hub,
      route,
    )}/view-report/${route}/${reportLogId}`;

    reportLogId
      ? navigate(targetUrl)
      : alert(
        "Report log id missing. Please check backend notification response.",
      );
  };

  const handleOpenMachine = (notif) => {

    // =====================================================
    // CASE 1:
    // Event abhi physically active hai.
    // Open exact machine on Plant Live page.
    // =====================================================

    if (!notif.idle_ended_at) {

      const plantRoute =
        notif.plant_location === "Plant 1"
          ? "/plant1-live"
          : "/plant2-live";

      navigate(plantRoute, {
        state: {
          autoOpenMachine: notif.machine_no,
          notificationEventKey: notif.event_key,
          notificationMode: notif.ideal_mode,
        },
      });

      return;
    }


    // =====================================================
    // CASE 2:
    // Event already closed/running changed,
    // but reason is still PENDING.
    // Send user to Idle Case.
    // =====================================================

    navigate("/idle-case", {
      state: {
        fromIdleNotification: true,

        notificationId: notif.id,

        idealEventId:
          notif.ideal_event_id || notif.id,
          
        eventKey: notif.event_key,

        plant:
          notif.plant_location === "Plant 1"
            ? "1"
            : "2",

        machineNo:
          String(notif.machine_no),

        idealMode:
          notif.ideal_mode,

        idleStartedAt:
          notif.idle_started_at,

        idleEndedAt:
          notif.idle_ended_at,
      },
    });
  };

  return (
    <div data-theme={theme} className="min-h-screen bg-[var(--bg-main)] flex relative overflow-hidden transition-colors duration-300">
      <style>{THEME_VARS}</style>
      <BackgroundBubbles />

      <Sidebar />

      <div className="flex-1 overflow-auto relative z-10 custom-scrollbar">
        <div className="max-w-[1600px] mx-auto px-8 py-8">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-2 bg-gradient-to-r from-[var(--title-from)] via-[var(--title-via)] to-[var(--title-to)] bg-clip-text text-transparent relative inline-block text-3xl font-extrabold"
              >
                Alerts & Notifications
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-[var(--text-soft)] mt-2 font-medium"
              >
                Action required for machine events and submitted reports
              </motion.p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setNotifications([])}
                variant="outline"
                className="border-[var(--btn-clear-border)] text-[var(--btn-clear-text)] bg-[var(--btn-clear-bg)] hover:bg-[var(--btn-clear-hover)] transition-all cursor-pointer shadow-sm font-semibold"
              >
                <Check className="w-4 h-4 mr-2" /> Clear All
              </Button>
            </div>
          </div>

          <div className="space-y-4">

            {loading ? (

              <div className="text-[var(--accent)] text-center py-10 font-bold animate-pulse">
                Loading Live Alerts...
              </div>

            ) : notifications.length === 0 &&
              machineNotifications.length === 0 ? (

              <div className="text-[var(--text-muted)] text-center py-10 text-lg font-medium">
                📭 No active notifications. All caught up!
              </div>

            ) : (
              <>

                {/* =====================================================
                    MACHINE IDLE / OFFLINE NOTIFICATIONS
                ===================================================== */}

                {machineNotifications.map((notif, index) => {

                  const isOffline =
                    notif.ideal_mode === "OFFLINE";

                  return (
                    <motion.div
                      key={`machine-${notif.id}`}
                      initial={{
                        opacity: 0,
                        x: -20,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: index * 0.03,
                      }}
                    >

                      <Card className="group border border-[var(--card-border)] bg-[var(--card-bg)] shadow-[var(--card-shadow)] hover:border-[var(--card-hover-border)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] rounded-xl transition-all duration-300">

                        <div className="p-5">

                          <div className="flex justify-between items-start gap-4">

                            <div>

                              <h3 className="font-bold text-[var(--text-main)] text-[16px] flex flex-wrap items-center gap-2">

                                <span>
                                  {notif.plant_location}
                                  {" • "}
                                  Machine M-{notif.machine_no}
                                </span>

                                <span
                                  className="text-[12px] px-2 py-1 rounded-md border border-[var(--card-border)] text-[var(--accent)]"
                                >
                                  ⏱ {formatIdleDuration(notif)}
                                </span>

                              </h3>

                              <p className="text-sm text-[var(--text-soft)] font-medium mt-1">

                                {notif.idle_ended_at
                                  ? "Idle event ended — reason still required"
                                  : isOffline
                                    ? "Machine is Offline — reason required"
                                    : "Machine is Online Idle — reason required"}

                              </p>

                            </div>

                            <span className="text-[11px] px-2.5 py-1 rounded-md bg-[var(--badge-bg)] text-[var(--badge-text)] font-bold tracking-wide uppercase">

                              Pending

                            </span>

                          </div>


                          <div className="mt-3 flex flex-wrap gap-2">

                            <span className="text-xs px-2 py-1 rounded-md bg-[var(--badge-bg)] text-[var(--badge-text)] font-semibold">

                              {isOffline
                                ? "Offline"
                                : "Online Idle"}

                            </span>

                            <span className="text-xs px-2 py-1 rounded-md border border-[var(--card-border)] text-[var(--text-soft)]">

                              Reason Required

                            </span>

                          </div>


                          <div className="mt-4 flex items-center justify-between gap-4">

                            <div className="flex items-center gap-2">

                              <Clock className="w-4 h-4 text-[var(--accent)]" />

                              <span className="text-sm font-medium text-[var(--text-dim)]">

                                {formatTimeAgo(
                                  notif.created_at
                                )}

                              </span>

                            </div>


                            <Button
                              onClick={() =>
                                handleOpenMachine(notif)
                              }
                              size="sm"
                              className="h-9 rounded-lg bg-[var(--btn-bg)] text-[var(--btn-text)] border border-[var(--btn-border)] hover:bg-[var(--btn-hover-bg)] transition-all font-semibold cursor-pointer shadow-sm"
                            >

                              {notif.idle_ended_at
                                ? "Fill Idle Reason →"
                                : "Open Machine →"}

                            </Button>

                          </div>

                        </div>

                      </Card>

                    </motion.div>
                  );
                })}


                {/* =====================================================
                    EXISTING QA / PRODUCTION / MAINTENANCE REPORTS
                ===================================================== */}

                {notifications.map((notif, index) => {

                  const {
                    submittedBy,
                    reportType,
                  } = parseNotification(notif);

                  const fallbackRoute =
                    getFallbackRoute(notif);

                  const title =
                    notif.title ||
                    notif.notification_title ||
                    fallbackRoute.title ||
                    "Report Approval Required";

                  return (
                    <motion.div
                      key={`report-${notif.id || index}`}
                      initial={{
                        opacity: 0,
                        x: -20,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: index * 0.03,
                      }}
                    >

                      <Card className="group border border-[var(--card-border)] bg-[var(--card-bg)] shadow-[var(--card-shadow)] hover:border-[var(--card-hover-border)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] rounded-xl transition-all duration-300">

                        <div className="p-5">

                          <div className="flex justify-between items-center">

                            <div>

                              <h3 className="font-bold text-[var(--text-main)] text-[16px]">
                                {reportType}
                              </h3>

                              <p className="text-xs text-[var(--text-soft)] font-medium mt-1">
                                {title}
                              </p>

                            </div>

                            <span className="text-[11px] px-2.5 py-1 rounded-md bg-[var(--badge-bg)] text-[var(--badge-text)] font-bold tracking-wide uppercase">
                              Pending
                            </span>

                          </div>


                          <p className="mt-3 text-sm text-[var(--text-soft)] font-medium">

                            Submitted by

                            <span className="text-[var(--text-main)] ml-1 font-bold">
                              {submittedBy}
                            </span>

                          </p>


                          <div className="mt-4 flex items-center justify-between">

                            <div className="flex items-center gap-2">

                              <Clock className="w-4 h-4 text-[var(--accent)]" />

                              <span className="text-sm font-medium text-[var(--text-dim)]">

                                {formatTimeAgo(
                                  notif.time ||
                                  notif.created_at ||
                                  notif.createdAt
                                )}

                              </span>

                            </div>


                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewReport(notif);
                              }}
                              size="sm"
                              className="h-9 rounded-lg bg-[var(--btn-bg)] text-[var(--btn-text)] border border-[var(--btn-border)] hover:bg-[var(--btn-hover-bg)] transition-all font-semibold cursor-pointer shadow-sm"
                            >

                              View Report →

                            </Button>

                          </div>

                        </div>

                      </Card>

                    </motion.div>
                  );
                })}

              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}