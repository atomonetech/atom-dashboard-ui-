import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  X,
  ClipboardList,
  ShieldCheck,
  CalendarCheck,
  CircleAlert,
  Wrench,
  ClipboardCheck,
  Package,
  Users,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [screenInfo, setScreenInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    width: 0,
    height: 0,
    isIPadMini: false,
    isIPadPro: false
  });

  // Detect device and screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      setIsTouchDevice(isTouch);
      
      setScreenInfo({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        width: width,
        height: height,
        isIPadMini: width >= 768 && width <= 810,
        isIPadPro: width >= 811 && width <= 1024
      });
      
      // Close mobile menu on resize to desktop
      if (width >= 1024 && mobileOpen) {
        setMobileOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [mobileOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const fullLogo = '/logo1.jpg';
  const smallLogo = '/logo3.jpg';

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', color: 'indigo', badge: null },
    { label: 'Plant 1 Live', icon: Factory, path: '/plant1-live', color: 'cyan', badge: '45' },
    { label: 'Plant 2 Live', icon: MonitorDot, path: '/plant2-live', color: 'yellow', badge: '22' },
    { label: 'Operations', icon: Settings, path: '/assign-machine', color: 'indigo', badge: null },
    { label: 'Reports', icon: FileText, path: '/idle-reports-list', color: 'indigo', badge: null },
    { label: 'Idle Case', icon: CircleAlert, path: '/idle-case', color: 'yellow', badge: 'Alert' },
    { label: 'Production Report', icon: ClipboardList, path: '/production-report', color: 'indigo', badge: null },
    { label: 'QMS', icon: ShieldCheck, path: '/qms', color: 'yellow', badge: 'New' },
    { label: 'Maintenance Hub', icon: Wrench, path: '/maintenance-hub', color: 'cyan', badge: null },
    { label: 'QA Hub', icon: ClipboardCheck, path: '/qa-hub', color: 'yellow', badge: null },
    { label: 'Production Hub', icon: Package, path: '/production-hub', color: 'indigo', badge: null },
    { label: 'Hiring & Departments', icon: Users, path: '/hiring-departments', color: 'cyan', badge: null },
    { label: 'Attendance', icon: CalendarCheck, path: '/attendance', color: 'indigo', badge: null },
    {label:'Production History', icon:History, path:'/Production-history', color:'indigo', badge:null }
  ];

  const bottomMenuItems = [
    { label: 'Notifications', icon: Bell, path: '/notifications', color: 'indigo', badge: '3' },
    { label: 'Support', icon: HelpCircle, path: '/support', color: 'yellow', badge: null },
  ];

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };

  // Get sidebar width based on device and state
  const getSidebarWidth = () => {
    // Mobile devices - full width overlay
    if (screenInfo.isMobile) {
      return mobileOpen ? '280px' : '0px';
    }
    
    // iPad Mini (768px - 810px)
    if (screenInfo.isIPadMini) {
      return isCollapsed ? '72px' : '260px';
    }
    
    // iPad Pro (811px - 1024px)
    if (screenInfo.isIPadPro) {
      return isCollapsed ? '80px' : '280px';
    }
    
    // Desktop
    return isCollapsed ? '80px' : '280px';
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

  // Check if close button should be visible
  const showCloseButton = () => {
    // On mobile when sidebar is open
    if (screenInfo.isMobile && mobileOpen) {
      return true;
    }
    // On tablets (iPad) when sidebar is open in overlay mode
    if (screenInfo.isTablet && mobileOpen) {
      return true;
    }
    return false;
  };

  // Check if search bar should be visible
  const showSearchBar = () => {
    if (screenInfo.isMobile) return mobileOpen && !isCollapsed;
    return !isCollapsed;
  };

  // Get item padding based on device
  const getItemPadding = () => {
    if (screenInfo.isMobile) return 'py-2.5 px-3';
    if (screenInfo.isIPadMini) return 'py-2 px-2.5';
    return 'py-2.5 px-3';
  };

  // Get gap between icon and text
  const getGap = () => {
    if (screenInfo.isMobile) return 'gap-3';
    if (screenInfo.isIPadMini) return 'gap-2.5';
    return 'gap-3';
  };

  // Get icon size
  const getIconSize = () => {
    if (screenInfo.isMobile) return 'w-5 h-5';
    if (screenInfo.isIPadMini) return 'w-4.5 h-4.5';
    return 'w-5 h-5';
  };

  // Get logo size
  const getLogoSize = () => {
    if (screenInfo.isMobile) return 'h-12';
    if (screenInfo.isIPadMini) return 'h-11';
    return 'h-14';
  };

  // Toggle collapse
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (isTouchDevice && 'vibrate' in navigator) {
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
      return 'top-5 left-5';
    }
    return 'top-4 left-4';
  };

  return (
    <>
      {/* Menu Button - Always visible on mobile and tablets when sidebar is closed */}
      {(!mobileOpen || screenInfo.isDesktop) && (screenInfo.isMobile || screenInfo.isTablet) && (
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={openSidebar}
          className={`fixed ${getButtonPosition()} z-50 p-3 rounded-xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] border-2 border-indigo-500/40 text-indigo-400 shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer`}
          aria-label="Open menu"
          style={{
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
        >
          <Menu className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2} />
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
          x: (screenInfo.isMobile || screenInfo.isTablet) && !mobileOpen ? '-100%' : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`
          fixed left-0 top-0 h-screen z-50
          bg-gradient-to-b from-[#1e293b] to-[#0f172a] 
          border-r border-indigo-500/20 flex flex-col
          shadow-2xl overflow-hidden
          ${screenInfo.isIPadMini ? 'shadow-xl' : ''}
        `}
        style={{
          minWidth: getSidebarWidth(),
          maxWidth: getSidebarWidth(),
        }}
      >
        {/* Close Button - Visible on mobile and tablets when sidebar is open */}
        {showCloseButton() && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={closeSidebar}
            className="absolute top-5 right-5 z-50 p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-red-500/30"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" strokeWidth={2} />
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
            className="absolute right-[10px] top-8 z-50 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 border-2 border-[#0f172a] flex items-center justify-center shadow-lg shadow-indigo-500/50 hover:shadow-indigo-500/80 transition-all duration-300 cursor-pointer"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-3 h-3 text-white" />
            ) : (
              <ChevronLeft className="w-3 h-3 text-white" />
            )}
          </motion.button>
        )}

        {/* Logo Section */}
        <div className={`p-5 border-b border-indigo-500/20 relative ${!shouldShowLabels() ? 'flex items-center justify-center' : ''}`}>
          <motion.div 
            className="flex items-center justify-center cursor-pointer group relative"
            onClick={() => {
              navigate('/dashboard');
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
                  className="relative w-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-yellow-500/30 rounded-lg blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <img 
                    src={fullLogo} 
                    alt="AtomOne Technologies" 
                    className={`relative ${getLogoSize()} w-full object-contain drop-shadow-2xl filter brightness-110`}
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
                  <div className={`relative rounded-xl overflow-hidden border-2 border-indigo-500/30 shadow-lg shadow-indigo-500/30 ${
                    screenInfo.isIPadMini ? 'w-10 h-10' : 'w-11 h-11'
                  }`}>
                    <img 
                      src={smallLogo} 
                      alt="A1" 
                      className="w-full h-full object-cover filter brightness-110"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {showSearchBar() && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 pt-4"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-yellow-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="relative w-full bg-[#0f172a]/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Navigation Menu */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            const colorClasses = {
              indigo: {
                bg: 'from-indigo-500/20 to-indigo-500/10',
                text: 'text-indigo-400',
                border: 'bg-indigo-500',
                badge: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
                glow: 'bg-indigo-400/60',
                hoverGlow: 'from-indigo-500/10 to-transparent',
              },
              cyan: {
                bg: 'from-cyan-500/20 to-cyan-500/10',
                text: 'text-cyan-400',
                border: 'bg-cyan-500',
                badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
                glow: 'bg-cyan-400/60',
                hoverGlow: 'from-cyan-500/10 to-transparent',
              },
              yellow: {
                bg: 'from-yellow-500/20 to-yellow-500/10',
                text: 'text-yellow-400',
                border: 'bg-yellow-500',
                badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
                glow: 'bg-yellow-400/60',
                hoverGlow: 'from-yellow-500/10 to-transparent',
              }
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
                    x: showLabel ? 5 : 0, 
                    scale: isCentered ? 1.05 : 1 
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center ${isCentered ? 'justify-center' : gap} ${itemPadding} rounded-xl transition-all relative group`}
                >
                  {/* Hover Effect */}
                  {!isActive && (
                    <motion.div
                      className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r ${colors.hoverGlow} blur-sm`}
                    />
                  )}

                  {/* Active Glow Effect */}
                  {isActive && showLabel && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute inset-0 rounded-xl bg-gradient-to-r ${colors.hoverGlow}`}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  {/* Left Border Indicator */}
                  {isActive && showLabel && (
                    <motion.div
                      layoutId="activeBorder"
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 rounded-r-full ${colors.border}`}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  {/* Icon */}
                  <div className="relative z-10">
                    <motion.div
                      className={`absolute inset-0 rounded-lg blur-md transition-all ${
                        isActive ? colors.glow : 'bg-transparent'
                      }`}
                    />
                    <Icon className={`relative ${iconSize} flex-shrink-0 ${
                      isActive ? 'filter drop-shadow-[0_0_8px_currentColor]' : ''
                    } transition-all group-hover:filter group-hover:drop-shadow-[0_0_10px_currentColor]`} />
                  </div>

                  {/* Label */}
                  <AnimatePresence>
                    {showLabel && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="relative text-sm z-10 flex-1 text-left font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Badge */}
                  {item.badge && (
                    <AnimatePresence>
                      {showLabel ? (
                        <motion.span
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          className={`relative z-10 px-2 py-0.5 rounded-full text-xs font-semibold ${colors.badge} border whitespace-nowrap`}
                        >
                          {item.badge}
                        </motion.span>
                      ) : (
                        isCentered && (
                          <div className={`absolute -top-1 -right-1 w-2 h-2 ${colors.border} rounded-full border border-[#1e293b] animate-pulse shadow-lg`} />
                        )
                      )}
                    </AnimatePresence>
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-4 border-t border-indigo-500/10" />

        {/* Bottom Section */}
        <div className="p-3 space-y-1">
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            const colorClasses = item.color === 'indigo' 
              ? { hoverGlow: 'from-indigo-500/10 to-transparent', badge: 'bg-red-500/20 text-red-400 border-red-500/30' }
              : { hoverGlow: 'from-yellow-500/10 to-transparent', badge: 'bg-red-500/20 text-red-400 border-red-500/30' };
            
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
                  x: showLabel ? 5 : 0, 
                  scale: isCentered ? 1.05 : 1 
                }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center ${isCentered ? 'justify-center' : gap} ${itemPadding} rounded-xl text-slate-400 hover:text-slate-200 transition-all relative group`}
              >
                <motion.div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r ${colorClasses.hoverGlow} blur-sm`} />
                <div className="relative z-10">
                  <Icon className={`relative ${iconSize} flex-shrink-0 group-hover:filter group-hover:drop-shadow-[0_0_10px_currentColor] transition-all`} />
                </div>
                
                <AnimatePresence>
                  {showLabel && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="relative text-sm flex-1 text-left z-10 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {item.badge && (
                  <AnimatePresence>
                    {showLabel ? (
                      <motion.span className={`relative z-10 px-2 py-0.5 rounded-full text-xs ${colorClasses.badge} border font-semibold`}>
                        {item.badge}
                      </motion.span>
                    ) : (
                      isCentered && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-[#1e293b] animate-pulse shadow-lg shadow-red-500/50" />
                      )
                    )}
                  </AnimatePresence>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-indigo-500/20">
          {shouldShowLabels() ? (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                navigate('/profile');
                closeSidebar();
              }}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-slate-700/30 to-slate-700/20 border border-slate-700/50 relative overflow-hidden group cursor-pointer"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
              />

              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-yellow-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className={`relative rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg ${
                  screenInfo.isIPadMini ? 'w-8 h-8' : 'w-9 h-9'
                }`}>
                  <User className={`${screenInfo.isIPadMini ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
                </div>
              </div>
              
              <div className="flex-1 min-w-0 relative z-10">
                <p className="text-slate-200 text-sm truncate font-medium">Admin User</p>
                <p className="text-slate-500 text-xs truncate">admin@atomone.in</p>
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
                navigate('/profile');
                closeSidebar();
              }}
              className="flex items-center justify-center cursor-pointer group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/40 to-yellow-500/40 rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className={`relative rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-500/40 border-2 border-indigo-400/30 ${
                screenInfo.isIPadMini ? 'w-10 h-10' : 'w-11 h-11'
              }`}>
                <User className={`${screenInfo.isIPadMini ? 'w-5 h-5' : 'w-6 h-6'} text-white filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]`} />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1e293b] animate-pulse shadow-lg shadow-red-500/50" />
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
          width: 4px;
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
            width: 5px;
          }
        }
      `}</style>
    </>
  );
}