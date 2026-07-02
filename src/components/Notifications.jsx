
//by aman pal

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Clock } from "lucide-react";
import Sidebar from "./Sidebar";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

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
      aliases.map((alias) => [
        normalizeText(alias),
        { formRoute, hub, title },
      ])
    )
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

    // ✅ fixed route for 4M Information Sheet
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
    ["incoming", ["incoming", "incoming inspection", "incoming material inspection"]],
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
    ["power-press-checksheet", ["daily power press checksheet", "power press checksheet"]],
    ["machine-breakdown", ["machine breakdown", "machine breakdown form", "machine breakdown slip"]],
    ["poka-yoke", ["poka yoke monitoring", "poka yoke"]],
    ["preventive-maintenance", ["preventive maintenance", "machine preventive maintenance"]],
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
      ? "radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)"
      : "radial-gradient(circle, rgba(251, 191, 36, 0.08) 0%, transparent 70%)",
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

  const currentUser = localStorage.getItem("username") || "";

  const formatTimeAgo = (dateString) => {
    const rawValue = dateString || "";

    const fixedFormattedDate =
      typeof rawValue === "string" && rawValue.includes("-")
        ? rawValue
        : null;

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

  const fetchNotifications = async (showLoader = false) => {
    if (showLoader) {
      setLoading(true);
    }

    try {
      const encodedUser = encodeURIComponent(currentUser);
      const res = await fetch(`${API_BASE}/api/qa-notifications/${encodedUser}/`);
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

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    fetchNotifications(true);

    const interval = setInterval(() => {
      fetchNotifications(false);
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

    const hub =
      notif.hub ||
      notif.hubRoute ||
      notif.hub_route ||
      fallbackRoute.hub;

    const reportLogId =
      notif.report_log_id ||
      notif.reportLogId ||
      notif.report_log ||
      notif.log_id ||
      notif.id;

    const targetUrl = `/${hub}/view-report/${route}/${reportLogId}`;

    reportLogId
      ? navigate(targetUrl)
      : alert("Report log id missing. Please check backend notification response.");
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex relative overflow-hidden">
      <BackgroundBubbles />

      <Sidebar />

      <div className="flex-1 overflow-auto relative z-10">
        <div className="max-w-[1200px] mx-auto px-8 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-2 bg-gradient-to-r from-cyan-400 via-white to-yellow-400 bg-clip-text text-transparent relative inline-block text-3xl font-bold"
              >
                Alerts & Notifications
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-slate-400 mt-2"
              >
                Action required for submitted reports across all Hubs
              </motion.p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setNotifications([])}
                variant="outline"
                className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 cursor-pointer"
              >
                <Check className="w-4 h-4 mr-2" /> Clear All
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-cyan-500 text-center py-10 font-bold animate-pulse">
                Loading Live Alerts...
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-slate-500 text-center py-10 text-lg">
                📭 No active notifications. All caught up!
              </div>
            ) : (
              notifications.map((notif, index) => {
                const { submittedBy, reportType } = parseNotification(notif);
                const fallbackRoute = getFallbackRoute(notif);

                const title =
                  notif.title ||
                  notif.notification_title ||
                  fallbackRoute.title ||
                  "Report Approval Required";

                return (
                  <motion.div
                    key={notif.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="group border border-slate-800 bg-[#111827] hover:border-cyan-500/30 rounded-xl transition-all duration-200">
                      <div className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-white text-[15px]">
                              {reportType}
                            </h3>

                            <p className="text-xs text-slate-500 mt-1">
                              {title}
                            </p>
                          </div>

                          <span className="text-[11px] px-2 py-1 rounded-md bg-amber-500/15 text-amber-300 font-medium">
                            Pending
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          Submitted by
                          <span className="text-slate-200 ml-1">
                            {submittedBy}
                          </span>
                        </p>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-cyan-400" />
                            <span className="text-sm font-medium text-slate-300">
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
                            className="h-8 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 hover:bg-cyan-500/20 hover:border-cyan-500/40 transition-all cursor-pointer"
                          >
                            View Report →
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





