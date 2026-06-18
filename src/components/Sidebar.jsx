import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import {
  Factory,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Bell,
  HelpCircle,
  MonitorDot,
  FileText,
  Menu,
  ClipboardList,
  ShieldCheck,
  CalendarCheck,
  CircleAlert,
  Wrench,
  ClipboardCheck,
  Package,
  Users,
  History,
  ArrowRight,
  Lock,
} from "lucide-react";
import { useRef } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationAlert, setNotificationAlert] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [screenInfo, setScreenInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    width: 0,
    height: 0,
    isIPadMini: false,
    isIPadPro: false,
  });

  // Detect device and screen size

  const previousCount = useRef(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const currentUser = localStorage.getItem("username");

        const res = await fetch(
          `${API_BASE}/api/qa-notifications/${currentUser}/`,
        );

        const data = await res.json();

        if (res.ok && data.notifications) {
          const currentCount = data.notifications.length;

          // New notification arrived
          if (
            previousCount.current > 0 &&
            currentCount > previousCount.current
          ) {
            setHasNewNotification(true);
             setNotificationAlert(true);

  setTimeout(() => {
    setNotificationAlert(false);
  }, 10000);
            const latest = data.notifications[0];

            toast.info(latest.message || "📄 New report submitted", {
              autoClose: 5000,
              position: "top-right",
            });
          }

          // Notification removed / approved
          if (previousCount.current > currentCount) {
            toast.success("✅ Report approved/cleared", {
              autoClose: 3000,
            });
          }

          previousCount.current = currentCount;

          setNotifications(data.notifications);
          setNotificationCount(currentCount);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

      setIsTouchDevice(isTouch);

      setScreenInfo({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        width: width,
        height: height,
        isIPadMini: width >= 768 && width <= 810,
        isIPadPro: width >= 811 && width <= 1024,
      });

      // Close mobile menu on resize to desktop
      if (width >= 1024 && mobileOpen) {
        setMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [mobileOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const fullLogo = "/logo1.jpg";
  const smallLogo = "/bhai.jpg";
  const userRole = localStorage.getItem("user_role");
  const userName = localStorage.getItem("username");
  const hasAccess = (path) => {
    // Admin can access everything
    if (userRole === "Admin") {
      return true;
    }

    switch (userRole) {
      case "QA_Hub":
        return ["/dashboard", "/qa-hub", "/qms"].includes(path);

      case "Production_Hub":
        return ["/dashboard", "/production-hub"].includes(path);

      case "Maintenance_Hub":
        return ["/dashboard", "/maintenance-hub"].includes(path);

      default:
        return path === "/dashboard";
    }
  };

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
      color: "indigo",
      badge: null,
    },
    {
      label: "Plant 1 Live",
      icon: Factory,
      path: "/plant1-live",
      color: "cyan",
      badge: null,
    },
    {
      label: "Plant 2 Live",
      icon: MonitorDot,
      path: "/plant2-live",
      color: "yellow",
      badge: null,
    },
    {
      label: "Operations",
      icon: Settings,
      path: "/assign-machine",
      color: "indigo",
      badge: null,
    },
    {
      label: "Reports",
      icon: ClipboardList,
      path: "/idle-reports-list",
      color: "indigo",
      badge: null,
    },
    {
      label: "Idle Case",
      icon: CircleAlert,
      path: "/idle-case",
      color: "yellow",
      badge: null,
    },
    {
      label: "Production Report",
      icon: FileText,
      path: "/production-report",
      color: "indigo",
      badge: null,
    },
    {
      label: "QMS",
      icon: ShieldCheck,
      path: "/qms",
      color: "yellow",
      badge: null,
    },
    {
      label: "Maintenance Hub",
      icon: Wrench,
      path: "/maintenance-hub",
      color: "cyan",
      badge: null,
    },
    {
      label: "QA Hub",
      icon: ClipboardCheck,
      path: "/qa-hub",
      color: "yellow",
      badge: null,
    },
    {
      label: "Production Hub",
      icon: Package,
      path: "/production-hub",
      color: "indigo",
      badge: null,
    },
    {
      label: "Hiring & Departments",
      icon: Users,
      path: "/hiring-departments",
      color: "cyan",
      badge: null,
    },
    {
      label: "Attendance",
      icon: CalendarCheck,
      path: "/attendance",
      color: "indigo",
      badge: null,
    },
    {
      label: "Production History",
      icon: History,
      path: "/Production-history",
      color: "indigo",
      badge: null,
    },
  ];

  const bottomMenuItems = [
    {
      label: "Notifications",
      icon: Bell,
      path: "/notifications",
      color: "indigo",
      badge: notificationCount > 0 ? notificationCount : null,
      isBlinking: hasNewNotification,
    },
    {
      label: "Support",
      icon: HelpCircle,
      path: "/support",
      color: "yellow",
      badge: null,
    },
  ];

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate("/login");
  };

  // Get sidebar width based on device and state
  const getSidebarWidth = () => {
    // Mobile devices - half width overlay
    if (screenInfo.isMobile) {
      return mobileOpen ? "200px" : "0px";
    }

    // iPad Mini (768px - 810px)
    if (screenInfo.isIPadMini) {
      return isCollapsed ? "72px" : "260px";
    }

    // iPad Pro (811px - 1024px)
    if (screenInfo.isIPadPro) {
      return isCollapsed ? "80px" : "280px";
    }

    // Desktop
    return isCollapsed ? "80px" : "280px";
  };

  // Check if labels should be shown
  const shouldShowLabels = () => {
    if (screenInfo.isMobile) return mobileOpen;
    return !isCollapsed;
  };

  // Check if toggle button should be visible
  const showToggleButton = () => {
    // On tablets and desktop when sidebar is permanently visible
    if (screenInfo.isTablet && !mobileOpen) {
      return true;
    }
    if (screenInfo.isDesktop) {
      return true;
    }
    return false;
  };

  // Get item padding based on device - Reduced padding for smaller icons
  const getItemPadding = () => {
    if (screenInfo.isMobile) return "py-1.5 px-2.5";
    if (screenInfo.isIPadMini) return "py-1 px-2";
    return "py-1.5 px-2.5";
  };

  // Get gap between icon and text - Reduced gap
  const getGap = () => {
    if (screenInfo.isMobile) return "gap-2";
    if (screenInfo.isIPadMini) return "gap-1.5";
    return "gap-2";
  };

  // Get icon size - Smaller icons
  const getIconSize = () => {
    if (screenInfo.isMobile) return "w-4 h-4";
    if (screenInfo.isIPadMini) return "w-3.5 h-3.5";
    return "w-4 h-4";
  };

  // Get logo size - Slightly smaller
  const getLogoSize = () => {
    if (screenInfo.isMobile) return "h-9";
    if (screenInfo.isIPadMini) return "h-8";
    return "h-10";
  };

  // Get logo width based on screen size
  const getLogoWidth = () => {
    if (screenInfo.isMobile) {
      return "w-[80px]"; // For screens < 768px
    }
    if (screenInfo.isTablet) {
      return "w-[100px]"; // For tablets (768px - 1024px)
    }
    return "w-[110px]"; // For desktop screens
  };

  // Get small logo width based on screen size
  const getSmallLogoWidth = () => {
    if (screenInfo.isMobile) {
      return "w-[40px]"; // For screens < 768px
    }
    return "w-[50px]"; // For tablet and desktop
  };

  // Toggle collapse
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (isTouchDevice && "vibrate" in navigator) {
      navigator.vibrate(50);
    }
  };

  // Close sidebar function
  const closeSidebar = () => {
    setMobileOpen(false);
  };

  // Open sidebar function
  const openSidebar = () => {
    setMobileOpen(true);
  };

  // Get button position based on device
  const getButtonPosition = () => {
    if (screenInfo.isIPadMini) {
      return "top-3 left-3";
    }
    return "top-2 left-2";
  };

  return (
    <>
      {/* Menu Button - Always visible on mobile and tablets when sidebar is closed */}
      {(!mobileOpen || screenInfo.isDesktop) &&
        (screenInfo.isMobile || screenInfo.isTablet) && (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={openSidebar}
            className={`fixed ${getButtonPosition()} z-50 p-2 rounded-xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] border-2 border-indigo-500/40 text-indigo-400 shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer`}
            aria-label="Open menu"
            style={{
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <Menu className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
          </motion.button>
        )}

      {/* Overlay for mobile and tablet */}
      <AnimatePresence>
        {mobileOpen && (screenInfo.isMobile || screenInfo.isTablet) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: getSidebarWidth(),
          x:
            (screenInfo.isMobile || screenInfo.isTablet) && !mobileOpen
              ? "-100%"
              : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`
          fixed left-0 top-0 h-screen z-50
          bg-gradient-to-b from-[#1e293b] to-[#0f172a] 
          border-r border-indigo-500/20 flex flex-col
          shadow-2xl overflow-hidden
          ${screenInfo.isIPadMini ? "shadow-xl" : ""}
        `}
        style={{
          minWidth: getSidebarWidth(),
          maxWidth: getSidebarWidth(),
        }}
      >
        {/* Back Button on Right Side */}
        {(screenInfo.isMobile || screenInfo.isTablet) && mobileOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={closeSidebar}
            className="absolute top-3 right-3 z-50 p-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-indigo-500/30"
            aria-label="Go back"
          >
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </motion.button>
        )}

        {/* Animated Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute -bottom-20 -right-20 w-40 h-40 bg-yellow-500/20 rounded-full blur-3xl"
          />
        </div>

        {/* Toggle Button (Expand/Collapse) - Only on tablets and desktop when sidebar is permanently visible */}
        {showToggleButton() && !mobileOpen && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleCollapse}
            className="absolute right-[10px] top-5 z-50 w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 border-2 border-[#0f172a] flex items-center justify-center shadow-lg shadow-indigo-500/50 hover:shadow-indigo-500/80 transition-all duration-300 cursor-pointer"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-2.5 h-2.5 text-white" />
            ) : (
              <ChevronLeft className="w-2.5 h-2.5 text-white" />
            )}
          </motion.button>
        )}

        {/* Logo Section - Centered with smaller padding */}
        <div
          className={`pt-10 pb-2 px-3 border-b border-indigo-500/20 relative ${
            !shouldShowLabels() ? "flex items-center justify-center" : ""
          }`}
        >
          <motion.div
            className="flex items-center justify-center cursor-pointer group relative w-full"
            onClick={() => {
              navigate("/dashboard");
              closeSidebar();
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <AnimatePresence mode="wait">
              {shouldShowLabels() ? (
                <motion.div
                  key="full-logo"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="relative flex justify-center w-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-yellow-500/30 rounded-lg blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <img
                    src={fullLogo}
                    alt="AtomOne Technologies"
                    className={`relative ${getLogoSize()} ${getLogoWidth()} object-contain drop-shadow-xl filter brightness-110`}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="small-logo"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="relative flex items-center justify-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/40 to-yellow-400/40 rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity" />
                  <div
                    className={`relative rounded-xl overflow-hidden border-2 border-indigo-500/30 shadow-lg shadow-indigo-500/30 ${
                      screenInfo.isIPadMini ? "w-8 h-8" : "w-9 h-9"
                    }`}
                  >
                    <img
                      src={smallLogo}
                      alt="A1"
                      className={`${getSmallLogoWidth()} h-full object-cover filter brightness-110`}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Main Navigation Menu - Reduced spacing */}
        <nav className="flex-1 pt-1 pb-1 px-2 space-y-0.5 overflow-y-auto custom-scrollbar">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            const colorClasses = {
              indigo: {
                bg: "from-indigo-500/20 to-indigo-500/10",
                text: "text-indigo-400",
                border: "bg-indigo-500",
                badge: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
                glow: "bg-indigo-400/60",
                hoverGlow: "from-indigo-500/10 to-transparent",
              },
              cyan: {
                bg: "from-cyan-500/20 to-cyan-500/10",
                text: "text-cyan-400",
                border: "bg-cyan-500",
                badge: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
                glow: "bg-cyan-400/60",
                hoverGlow: "from-cyan-500/10 to-transparent",
              },
              yellow: {
                bg: "from-yellow-500/20 to-yellow-500/10",
                text: "text-yellow-400",
                border: "bg-yellow-500",
                badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                glow: "bg-yellow-400/60",
                hoverGlow: "from-yellow-500/10 to-transparent",
              },
            };

            const colors = colorClasses[item.color];
            const showLabel = shouldShowLabels();
            const isCentered = !showLabel;
            const gap = getGap();
            const iconSize = getIconSize();
            const itemPadding = getItemPadding();

            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <motion.button
                  onClick={() => {
                    navigate(item.path);
                    closeSidebar();
                  }}
                  whileHover={{
                    x: showLabel ? 3 : 0,
                    scale: isCentered ? 1.02 : 1,
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center ${
                    isCentered ? "justify-center" : gap
                  } ${itemPadding} rounded-lg transition-all relative group`}
                >
                  {/* Hover Effect */}
                  {!isActive && (
                    <motion.div
                      className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r ${colors.hoverGlow} blur-sm`}
                    />
                  )}

                  {/* Active Glow Effect */}
                  {isActive && showLabel && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute inset-0 rounded-lg bg-gradient-to-r ${colors.hoverGlow}`}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}

                  {/* Left Border Indicator */}
                  {isActive && showLabel && (
                    <motion.div
                      layoutId="activeBorder"
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full ${colors.border}`}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}

                  {/* Icon */}
                  <div className="relative z-10">
                    <motion.div
                      className={`absolute inset-0 rounded-md blur-sm transition-all ${
                        isActive ? colors.glow : "bg-transparent"
                      }`}
                    />
                    <Icon
                      className={`relative ${iconSize} flex-shrink-0 ${
                        isActive
                          ? "filter drop-shadow-[0_0_6px_currentColor]"
                          : ""
                      } transition-all group-hover:filter group-hover:drop-shadow-[0_0_8px_currentColor]`}
                    />
                  </div>

                  {/* Label */}
                  <AnimatePresence>
                    {showLabel && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="relative text-xs z-10 flex-1 text-left font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Badge */}
                  {!hasAccess(item.path) ? (
                    <div className="relative z-10 flex items-center justify-center w-7 h-7">
                      <LockIcon
                        sx={{
                          color: "#FFFFFF",
                          fontSize: 16,
                          opacity: 0.9,
                        }}
                      />
                    </div>
                  ) : (
                    item.badge &&
                    showLabel && (
                      <span
                        className={`
    relative z-10 px-2 py-0.5 rounded-full text-xs font-semibold
    ${colors.badge}
    border whitespace-nowrap
   animate-pulse
  `}
                      >
                        {item.badge}
                      </span>
                    )
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-2 border-t border-indigo-500/10" />

        {/* Bottom Section - Reduced padding */}
        <div className="p-1.5 space-y-0.5">
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            const colorClasses =
              item.color === "indigo"
                ? {
                    hoverGlow: "from-indigo-500/10 to-transparent",
                    badge: "bg-red-500/20 text-red-400 border-red-500/30",
                  }
                : {
                    hoverGlow: "from-yellow-500/10 to-transparent",
                    badge: "bg-red-500/20 text-red-400 border-red-500/30",
                  };

            const showLabel = shouldShowLabels();
            const isCentered = !showLabel;
            const gap = getGap();
            const iconSize = getIconSize();
            const itemPadding = getItemPadding();

            return (
              
              <motion.button
                key={item.label}
                onClick={() => {
                  item.path && navigate(item.path);
                  closeSidebar();
                }}
                whileHover={{
                  x: showLabel ? 3 : 0,
                  scale: isCentered ? 1.02 : 1,
                }}
                whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center ${
  isCentered ? "justify-center" : gap
} ${itemPadding} rounded-lg text-slate-400 hover:text-slate-200 transition-all relative group
${
  item.path === "/notifications" && notificationAlert
    ? "notification-glow border border-red-400"
    : ""
}`}
              >
                <motion.div
                  className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r ${colorClasses.hoverGlow} blur-sm`}
                />
                <div className="relative z-10">
                  <motion.div
                    animate={
                      item.path === "/notifications" && hasNewNotification
                        ? {
                            rotate: [0, -10, 10, -10, 0],
                          }
                        : {}
                    }
                    transition={{
                      duration: 0.5,
                      repeat:
                        item.path === "/notifications" && hasNewNotification
                          ? Infinity
                          : 0,
                      repeatDelay: 2,
                    }}
                  >
                    <Icon
                      className={`relative ${iconSize} flex-shrink-0 group-hover:filter group-hover:drop-shadow-[0_0_8px_currentColor] transition-all`}
                    />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {showLabel && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="relative text-xs flex-1 text-left z-10 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {item.badge && (
                  <AnimatePresence>
                    {showLabel ? (
                      <motion.span
  className={`
    relative z-10 px-1.5 py-0.5 rounded-full text-[10px]
    ${colorClasses.badge}
    border font-semibold
    ${
      item.path === "/notifications" &&
      hasNewNotification
        ? "bell-alert"
        : ""
    }
  `}
>
  {item.badge}
</motion.span>
                    ) : (
                      isCentered && (
                        <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-[#1e293b] animate-pulse shadow-lg shadow-red-500/50" />
                      )
                    )}
                  </AnimatePresence>
                )}
              </motion.button>
              
            );
          })}
        </div>

        {/* User Profile - Reduced padding */}
        <div className="p-2 border-t border-indigo-500/20">
          {shouldShowLabels() ? (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                navigate("/profile");
                closeSidebar();
              }}
              className="flex items-center gap-1.5 p-1.5 rounded-lg bg-gradient-to-r from-slate-700/30 to-slate-700/20 border border-slate-700/50 relative overflow-hidden group cursor-pointer"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 2,
                }}
              />

              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-yellow-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                <div
                  className={`relative rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg ${
                    screenInfo.isIPadMini ? "w-6 h-6" : "w-7 h-7"
                  }`}
                >
                  <User
                    className={`${
                      screenInfo.isIPadMini ? "w-3 h-3" : "w-3.5 h-3.5"
                    } text-white`}
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0 relative z-10">
                <p className="text-slate-200 text-sm truncate font-medium">
                  `{userRole}`
                </p>
                <p className="text-slate-500 text-xs truncate">`{userName}`</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                }}
                className="relative z-10 text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigate("/profile");
                closeSidebar();
              }}
              className="flex items-center justify-center cursor-pointer group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/40 to-yellow-500/40 rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
              <div
                className={`relative rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-500/40 border-2 border-indigo-400/30 ${
                  screenInfo.isIPadMini ? "w-8 h-8" : "w-9 h-9"
                }`}
              >
                <User
                  className={`${
                    screenInfo.isIPadMini ? "w-4 h-4" : "w-4.5 h-4.5"
                  } text-white filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]`}
                />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full border-2 border-[#1e293b] animate-pulse shadow-lg shadow-red-500/50" />
            </motion.div>
          )}
        </div>
      </motion.aside>

      {/* Main Content Spacer */}
      {!screenInfo.isMobile && !mobileOpen && (
        <div
          className="hidden lg:block flex-shrink-0 transition-all duration-300"
          style={{ width: getSidebarWidth() }}
        />
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }

        @media (min-width: 768px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
        }
        
        @keyframes notificationGlow {
  0% {
    background: rgba(248, 113, 113, 0.15);
  }

  50% {
    background: rgba(248, 113, 113, 0.35);
  }

  100% {
    background: rgba(248, 113, 113, 0.15);
  }
}

.notification-glow {
  animation: notificationGlow 1s infinite;
}

          @keyframes bellAlert {
  0% { transform: scale(1); }
  50% { transform: scale(1.4); }
  100% { transform: scale(1); }
}

.bell-alert {
  animation: bellAlert 0.8s infinite;
}
      `}</style>
    </>
  );
}
