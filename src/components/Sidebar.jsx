// import { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';  // ✅ FIX - react-router-dom
// import { 
//   Factory, 
//   Zap, 
//   LayoutDashboard, 
//   Users, 
//   LogOut,
//   Settings,
//   User,
//   ChevronLeft,
//   ChevronRight,
//   Bell,
//   HelpCircle,
//   MonitorDot,  // ✅ ADDED - For Plant 2
//   FileText,    // ✅ ADDED - For Reports
//   Menu,        // ✅ ADDED - For mobile menu
//   X            // ✅ ADDED - For mobile close
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'motion/react';

// export default function Sidebar({ onLogout }) {  // ✅ ADDED onLogout prop
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);  // ✅ ADDED for mobile

//   // 🖼️ LOGO PATHS
//   const fullLogo = '/logo1.jpg';
//   const smallLogo = '/logo3.jpg';

//   // ✅ FIXED PATHS - Match with App.js
//   const menuItems = [
//     {
//       label: 'Dashboard',
//       icon: LayoutDashboard,
//       path: '/dashboard',
//       color: 'cyan',
//       badge: null
//     },
//     {
//       label: 'Plant 1 Live',
//       icon: Factory,
//       path: '/plant1-live',        // ✅ CHANGED
//       color: 'cyan',
//       badge: '45'
//     },
//     {
//       label: 'Plant 2 Live',
//       icon: MonitorDot,            // ✅ CHANGED icon
//       path: '/plant2-live',        // ✅ CHANGED
//       color: 'yellow',
//       badge: '22'
//     },
//     {
//       label: 'Operations',
//       icon: Settings,
//       path: '/assign-machine',     // ✅ CHANGED
//       color: 'cyan',
//       badge: null
//     },
//     {
//       label: 'Reports',
//       icon: FileText,              // ✅ ADDED
//       path: '/idle-reports-list',  // ✅ CHANGED
//       color: 'cyan',
//       badge: null
//     },
//   ];

//   const bottomMenuItems = [
//     {
//       label: 'Notifications',
//       icon: Bell,
//       path: '/notifications',
//       color: 'cyan',
//       badge: '3'
//     },
//     {
//       label: 'Support',
//       icon: HelpCircle,
//       path: '/support',           // ✅ CHANGED from /dashboard
//       color: 'yellow',
//       badge: null
//     },
//   ];

//   const handleLogout = () => {
//     if (onLogout) onLogout();
//     navigate('/login');
//   };

//   return (
//     <>
//       {/* Mobile Menu Button */}
//       <button
//         onClick={() => setMobileOpen(!mobileOpen)}
//         className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#1e293b] border border-cyan-500/30 text-cyan-400"
//       >
//         {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//       </button>

//       {/* Overlay */}
//       {mobileOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black/50 z-40"
//           onClick={() => setMobileOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <motion.div
//         animate={{ width: isCollapsed ? 80 : 280 }}
//         transition={{ duration: 0.3, ease: "easeInOut" }}
//         className={`
//           h-screen bg-gradient-to-b from-[#1e293b] to-[#0f172a] backdrop-blur-xl 
//           border-r border-cyan-500/20 flex flex-col sticky top-0 relative overflow-hidden
//           ${mobileOpen ? 'fixed left-0 top-0 z-50' : 'hidden lg:flex'}
//         `}
//       >
//         {/* Animated Background Gradients */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <motion.div
//             animate={{
//               scale: [1, 1.2, 1],
//               opacity: [0.3, 0.5, 0.3],
//             }}
//             transition={{
//               duration: 8,
//               repeat: Infinity,
//               ease: "easeInOut",
//             }}
//             className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl"
//           />
//           <motion.div
//             animate={{
//               scale: [1, 1.3, 1],
//               opacity: [0.3, 0.5, 0.3],
//             }}
//             transition={{
//               duration: 10,
//               repeat: Infinity,
//               ease: "easeInOut",
//               delay: 1,
//             }}
//             className="absolute -bottom-20 -right-20 w-40 h-40 bg-yellow-500/20 rounded-full blur-3xl"
//           />
//         </div>

//         {/* Toggle Button */}
//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={() => setIsCollapsed(!isCollapsed)}
//           className="hidden lg:flex absolute -right-3 top-8 z-50 w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 border-2 border-[#0f172a] items-center justify-center shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/80 transition-shadow"
//         >
//           {isCollapsed ? (
//             <ChevronRight className="w-3 h-3 text-white" />
//           ) : (
//             <ChevronLeft className="w-3 h-3 text-white" />
//           )}
//         </motion.button>

//         {/* Logo */}
//         <div className={`p-6 border-b border-cyan-500/20 relative ${isCollapsed ? 'flex items-center justify-center' : ''}`}>
//           <motion.div 
//             className="flex items-center justify-center cursor-pointer group relative"
//             onClick={() => navigate('/dashboard')}
//             whileHover={{ scale: 1.05 }}
//           >
//             <AnimatePresence mode="wait">
//               {!isCollapsed ? (
//                 <motion.div
//                   key="full-logo"
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.8 }}
//                   transition={{ duration: 0.3 }}
//                   className="relative w-full"
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-yellow-500/30 rounded-lg blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
//                   <img 
//                     src={fullLogo} 
//                     alt="AtomOne Technologies" 
//                     className="relative h-16 w-full object-contain drop-shadow-2xl filter brightness-110"
//                   />
//                 </motion.div>
//               ) : (
//                 <motion.div
//                   key="small-logo"
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.8 }}
//                   transition={{ duration: 0.3 }}
//                   className="relative flex items-center justify-center"
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/40 to-yellow-400/40 rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity" />
//                   <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-cyan-500/30 shadow-lg shadow-cyan-500/30">
//                     <img 
//                       src={smallLogo} 
//                       alt="A1" 
//                       className="w-full h-full object-cover filter brightness-110"
//                     />
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.div>
//         </div>

//         {/* Search Bar */}
//         <AnimatePresence>
//           {!isCollapsed && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               className="px-4 pt-4"
//             >
//               <div className="relative group">
//                 <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-yellow-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   className="relative w-full bg-[#0f172a]/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
//                 />
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Main Navigation Menu */}
//         <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
//           {menuItems.map((item, index) => {
//             const isActive = location.pathname === item.path;
//             const Icon = item.icon;
            
//             return (
//               <motion.div
//                 key={item.path}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: index * 0.05 }}
//               >
//                 <motion.button
//                   onClick={() => {
//                     navigate(item.path);
//                     setMobileOpen(false);
//                   }}
//                   whileHover={{ x: isCollapsed ? 0 : 5, scale: isCollapsed ? 1.1 : 1 }}
//                   whileTap={{ scale: 0.95 }}
//                   className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-xl transition-all relative group ${
//                     isActive
//                       ? item.color === 'cyan'
//                         ? 'bg-gradient-to-r from-cyan-500/20 to-cyan-500/10 text-cyan-400 shadow-lg shadow-cyan-500/20'
//                         : 'bg-gradient-to-r from-yellow-500/20 to-yellow-500/10 text-yellow-400 shadow-lg shadow-yellow-500/20'
//                       : 'text-slate-400 hover:bg-slate-700/30 hover:text-slate-200'
//                   }`}
//                 >
//                   {/* Glow Effect on Active */}
//                   {isActive && !isCollapsed && (
//                     <motion.div
//                       layoutId="activeTab"
//                       className={`absolute inset-0 rounded-xl ${
//                         item.color === 'cyan'
//                           ? 'bg-gradient-to-r from-cyan-500/10 to-transparent'
//                           : 'bg-gradient-to-r from-yellow-500/10 to-transparent'
//                       }`}
//                       transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
//                     />
//                   )}
                  
//                   {/* Left Border Indicator */}
//                   {isActive && !isCollapsed && (
//                     <motion.div
//                       layoutId="activeBorder"
//                       className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full ${
//                         item.color === 'cyan' ? 'bg-cyan-500' : 'bg-yellow-500'
//                       }`}
//                       transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
//                     />
//                   )}

//                   {/* Icon with Glow */}
//                   <div className="relative z-10">
//                     <div className={`absolute inset-0 rounded-lg ${
//                       isActive 
//                         ? item.color === 'cyan' ? 'bg-cyan-400/40 blur-md' : 'bg-yellow-400/40 blur-md'
//                         : 'bg-transparent group-hover:bg-slate-300/20 blur-sm'
//                     } transition-all`} />
//                     <Icon className={`relative w-5 h-5 flex-shrink-0 ${
//                       isActive 
//                         ? 'filter drop-shadow-[0_0_8px_currentColor]' 
//                         : 'group-hover:filter group-hover:drop-shadow-[0_0_6px_currentColor]'
//                     } transition-all`} />
//                   </div>

//                   {/* Label */}
//                   <AnimatePresence>
//                     {!isCollapsed && (
//                       <motion.span
//                         initial={{ opacity: 0, x: -10 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         exit={{ opacity: 0, x: -10 }}
//                         className="relative text-sm z-10 flex-1 text-left"
//                       >
//                         {item.label}
//                       </motion.span>
//                     )}
//                   </AnimatePresence>

//                   {/* Badge */}
//                   {item.badge && (
//                     <AnimatePresence>
//                       {!isCollapsed ? (
//                         <motion.span
//                           initial={{ opacity: 0, scale: 0 }}
//                           animate={{ opacity: 1, scale: 1 }}
//                           exit={{ opacity: 0, scale: 0 }}
//                           className={`relative z-10 px-2 py-0.5 rounded-full text-xs ${
//                             item.color === 'cyan'
//                               ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
//                               : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
//                           }`}
//                         >
//                           {item.badge}
//                         </motion.span>
//                       ) : (
//                         <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-500 rounded-full border border-[#1e293b] animate-pulse shadow-lg shadow-cyan-500/50" />
//                       )}
//                     </AnimatePresence>
//                   )}
//                 </motion.button>
//               </motion.div>
//             );
//           })}
//         </nav>

//         {/* Divider */}
//         <div className="mx-4 border-t border-cyan-500/10" />

//         {/* Bottom Section */}
//         <div className="p-4 space-y-1">
//           {bottomMenuItems.map((item) => {
//             const Icon = item.icon;
            
//             return (
//               <motion.button
//                 key={item.label}
//                 onClick={() => {
//                   item.path && navigate(item.path);
//                   setMobileOpen(false);
//                 }}
//                 whileHover={{ x: isCollapsed ? 0 : 5, scale: isCollapsed ? 1.1 : 1 }}
//                 whileTap={{ scale: 0.95 }}
//                 className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-700/30 hover:text-slate-200 transition-all relative group`}
//               >
//                 <div className="relative">
//                   <div className="absolute inset-0 blur-sm bg-transparent group-hover:bg-slate-300/30 rounded-lg transition-all" />
//                   <Icon className="relative w-5 h-5 flex-shrink-0 group-hover:filter group-hover:drop-shadow-[0_0_6px_currentColor] transition-all" />
//                 </div>
                
//                 <AnimatePresence>
//                   {!isCollapsed && (
//                     <motion.span
//                       initial={{ opacity: 0, x: -10 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       exit={{ opacity: 0, x: -10 }}
//                       className="text-sm flex-1 text-left"
//                     >
//                       {item.label}
//                     </motion.span>
//                   )}
//                 </AnimatePresence>

//                 {item.badge && (
//                   <AnimatePresence>
//                     {!isCollapsed ? (
//                       <motion.span
//                         initial={{ opacity: 0, scale: 0 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         exit={{ opacity: 0, scale: 0 }}
//                         className="px-2 py-0.5 rounded-full text-xs bg-red-500/20 text-red-400 border border-red-500/30"
//                       >
//                         {item.badge}
//                       </motion.span>
//                     ) : (
//                       <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-[#1e293b] animate-pulse shadow-lg shadow-red-500/50" />
//                     )}
//                   </AnimatePresence>
//                 )}
//               </motion.button>
//             );
//           })}
//         </div>

//         {/* User Profile */}
//         <div className="p-4 border-t border-cyan-500/20">
//           {!isCollapsed ? (
//             <motion.div
//               whileHover={{ scale: 1.02 }}
//               onClick={() => navigate('/profile')}
//               className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-700/30 to-slate-700/20 border border-slate-700/50 relative overflow-hidden group cursor-pointer"
//             >
//               {/* Shine Effect */}
//               <motion.div
//                 className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
//                 animate={{ x: ['-100%', '200%'] }}
//                 transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
//               />

//               {/* Avatar with Glow */}
//               <div className="relative flex-shrink-0">
//                 <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-yellow-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
//                 <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg">
//                   <User className="w-5 h-5 text-white" />
//                 </div>
//               </div>
              
//               <div className="flex-1 min-w-0 relative z-10">
//                 <p className="text-slate-200 text-sm truncate">Admin User</p>
//                 <p className="text-slate-500 text-xs truncate">admin@atomone.in</p>
//               </div>

//               <motion.button
//                 whileHover={{ scale: 1.1, rotate: 90 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleLogout();
//                 }}
//                 className="relative z-10 text-red-400 hover:text-red-300 transition-colors"
//               >
//                 <LogOut className="w-4 h-4" />
//               </motion.button>
//             </motion.div>
//           ) : (
//             <motion.div
//               whileHover={{ scale: 1.1 }}
//               onClick={() => navigate('/profile')}
//               className="flex items-center justify-center cursor-pointer group relative"
//             >
//               <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/40 to-yellow-500/40 rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
//               <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-xl shadow-cyan-500/40 border-2 border-cyan-400/30">
//                 <User className="w-6 h-6 text-white filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
//               </div>
//               <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-[#1e293b] animate-pulse shadow-lg shadow-red-500/50" />
//             </motion.div>
//           )}
//         </div>
//       </motion.div>
//     </>
//   );
// }





// import { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { 
//   Factory, 
//   Zap, 
//   LayoutDashboard, 
//   Users, 
//   LogOut,
//   Settings,
//   User,
//   ChevronLeft,
//   ChevronRight,
//   Bell,
//   HelpCircle,
//   MonitorDot,
//   FileText,
//   Menu,
//   X,
//   ClipboardList,
//   ShieldCheck,
//   CalendarCheck
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// export default function Sidebar({ onLogout }) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const fullLogo = '/logo1.jpg';
//   const smallLogo = '/logo3.jpg';

//   const menuItems = [
//     {
//       label: 'Dashboard',
//       icon: LayoutDashboard,
//       path: '/dashboard',
//       color: 'indigo',
//       badge: null
//     },
//     {
//       label: 'Plant 1 Live',
//       icon: Factory,
//       path: '/plant1-live',
//       color: 'cyan',  // ✅ Cyan for Plant 1
//       badge: '45'
//     },
//     {
//       label: 'Plant 2 Live',
//       icon: MonitorDot,
//       path: '/plant2-live',
//       color: 'yellow',  // ✅ Yellow for Plant 2
//       badge: '22'
//     },
//     {
//       label: 'Operations',
//       icon: Settings,
//       path: '/assign-machine',
//       color: 'indigo',
//       badge: null
//     },
//     {
//       label: 'Reports',
//       icon: FileText,
//       path: '/idle-reports-list',
//       color: 'indigo',
//       badge: null
//     },
//     {
//       label: 'Production Report',
//       icon: ClipboardList,
//       path: '/production-report',
//       color: 'indigo',
//       badge: null
//     },
//     {
//       label: 'QMS',
//       icon: ShieldCheck,
//       path: '/qms',
//       color: 'yellow',
//       badge: 'New'
//     },
//     {
//       label: 'Attendance',
//       icon: CalendarCheck,
//       path: '/attendance',
//       color: 'indigo',
//       badge: null
//     },
//   ];

//   const bottomMenuItems = [
//     {
//       label: 'Notifications',
//       icon: Bell,
//       path: '/notifications',
//       color: 'indigo',
//       badge: '3'
//     },
//     {
//       label: 'Support',
//       icon: HelpCircle,
//       path: '/support',
//       color: 'yellow',
//       badge: null
//     },
//   ];

//   const handleLogout = () => {
//     if (onLogout) onLogout();
//     navigate('/login');
//   };

//   return (
//     <>
//       {/* Mobile Menu Button */}
//       <button
//         onClick={() => setMobileOpen(!mobileOpen)}
//         className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#1e293b] border border-indigo-500/30 text-indigo-400"
//       >
//         {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//       </button>

//       {/* Overlay */}
//       {mobileOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black/50 z-40"
//           onClick={() => setMobileOpen(false)}
//         />
//       )}

//       {/* ✅ FIXED SIDEBAR - No more zoom issues */}
//       <motion.aside
//         initial={false}
//         animate={{ 
//           width: isCollapsed ? '80px' : '280px',
//         }}
//         transition={{ duration: 0.3, ease: "easeInOut" }}
//         className={`
//           fixed left-0 top-0 h-screen z-30
//           bg-gradient-to-b from-[#1e293b] to-[#0f172a] backdrop-blur-xl 
//           border-r border-indigo-500/20 flex flex-col
//           ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
//           transition-transform duration-300
//         `}
//         style={{
//           minWidth: isCollapsed ? '80px' : '280px',
//           maxWidth: isCollapsed ? '80px' : '280px',
//         }}
//       >
//         {/* Animated Background Gradients */}
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <motion.div
//             animate={{
//               scale: [1, 1.2, 1],
//               opacity: [0.3, 0.5, 0.3],
//             }}
//             transition={{
//               duration: 8,
//               repeat: Infinity,
//               ease: "easeInOut",
//             }}
//             className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"
//           />
//           <motion.div
//             animate={{
//               scale: [1, 1.3, 1],
//               opacity: [0.3, 0.5, 0.3],
//             }}
//             transition={{
//               duration: 10,
//               repeat: Infinity,
//               ease: "easeInOut",
//               delay: 1,
//             }}
//             className="absolute -bottom-20 -right-20 w-40 h-40 bg-yellow-500/20 rounded-full blur-3xl"
//           />
//         </div>

//         {/* Toggle Button */}
//         <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={() => setIsCollapsed(!isCollapsed)}
//           className="hidden lg:flex absolute -right-3 top-8 z-50 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 border-2 border-[#0f172a] items-center justify-center shadow-lg shadow-indigo-500/50 hover:shadow-indigo-500/80 transition-shadow"
//         >
//           {isCollapsed ? (
//             <ChevronRight className="w-3 h-3 text-white" />
//           ) : (
//             <ChevronLeft className="w-3 h-3 text-white" />
//           )}
//         </motion.button>

//         {/* Logo */}
//         <div className={`p-6 border-b border-indigo-500/20 relative ${isCollapsed ? 'flex items-center justify-center' : ''}`}>
//           <motion.div 
//             className="flex items-center justify-center cursor-pointer group relative"
//             onClick={() => navigate('/dashboard')}
//             whileHover={{ scale: 1.05 }}
//           >
//             <AnimatePresence mode="wait">
//               {!isCollapsed ? (
//                 <motion.div
//                   key="full-logo"
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.8 }}
//                   transition={{ duration: 0.3 }}
//                   className="relative w-full"
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-yellow-500/30 rounded-lg blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
//                   <img 
//                     src={fullLogo} 
//                     alt="AtomOne Technologies" 
//                     className="relative h-16 w-full object-contain drop-shadow-2xl filter brightness-110"
//                   />
//                 </motion.div>
//               ) : (
//                 <motion.div
//                   key="small-logo"
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.8 }}
//                   transition={{ duration: 0.3 }}
//                   className="relative flex items-center justify-center"
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/40 to-yellow-400/40 rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity" />
//                   <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-indigo-500/30 shadow-lg shadow-indigo-500/30">
//                     <img 
//                       src={smallLogo} 
//                       alt="A1" 
//                       className="w-full h-full object-cover filter brightness-110"
//                     />
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.div>
//         </div>

//         {/* Search Bar */}
//         <AnimatePresence>
//           {!isCollapsed && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               className="px-4 pt-4"
//             >
//               <div className="relative group">
//                 <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-yellow-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   className="relative w-full bg-[#0f172a]/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
//                 />
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Main Navigation Menu */}
//         <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
//           {menuItems.map((item, index) => {
//             const isActive = location.pathname === item.path;
//             const Icon = item.icon;
            
//             // ✅ Color mapping fixed
//             const colorClasses = {
//               indigo: {
//                 bg: 'from-indigo-500/20 to-indigo-500/10',
//                 text: 'text-indigo-400',
//                 shadow: 'shadow-indigo-500/20',
//                 border: 'bg-indigo-500',
//                 badge: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
//                 glow: 'bg-indigo-400/60',
//                 hoverGlow: 'from-indigo-500/10 to-transparent',
//                 hoverBlur: 'rgba(99, 102, 241, 0.4)',
//               },
//               cyan: {
//                 bg: 'from-cyan-500/20 to-cyan-500/10',
//                 text: 'text-cyan-400',
//                 shadow: 'shadow-cyan-500/20',
//                 border: 'bg-cyan-500',
//                 badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
//                 glow: 'bg-cyan-400/60',
//                 hoverGlow: 'from-cyan-500/10 to-transparent',
//                 hoverBlur: 'rgba(6, 182, 212, 0.4)',
//               },
//               yellow: {
//                 bg: 'from-yellow-500/20 to-yellow-500/10',
//                 text: 'text-yellow-400',
//                 shadow: 'shadow-yellow-500/20',
//                 border: 'bg-yellow-500',
//                 badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
//                 glow: 'bg-yellow-400/60',
//                 hoverGlow: 'from-yellow-500/10 to-transparent',
//                 hoverBlur: 'rgba(251, 191, 36, 0.4)',
//               }
//             };

//             const colors = colorClasses[item.color];
            
//             return (
//               <motion.div
//                 key={item.path}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: index * 0.05 }}
//               >
//                 <motion.button
//                   onClick={() => {
//                     navigate(item.path);
//                     setMobileOpen(false);
//                   }}
//                   whileHover={{ x: isCollapsed ? 0 : 5, scale: isCollapsed ? 1.1 : 1 }}
//                   whileTap={{ scale: 0.95 }}
//                   className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-xl transition-all relative group ${
//                     isActive
//                       ? `bg-gradient-to-r ${colors.bg} ${colors.text} shadow-lg ${colors.shadow}`
//                       : 'text-slate-400 hover:text-slate-200'
//                   }`}
//                 >
//                   {/* Hover Effect with Correct Color */}
//                   {!isActive && (
//                     <motion.div
//                       className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r ${colors.hoverGlow} blur-sm`}
//                     />
//                   )}

//                   {/* Active Glow Effect */}
//                   {isActive && !isCollapsed && (
//                     <motion.div
//                       layoutId="activeTab"
//                       className={`absolute inset-0 rounded-xl bg-gradient-to-r ${colors.hoverGlow}`}
//                       transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
//                     />
//                   )}
                  
//                   {/* Left Border Indicator */}
//                   {isActive && !isCollapsed && (
//                     <motion.div
//                       layoutId="activeBorder"
//                       className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full ${colors.border}`}
//                       transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
//                     />
//                   )}

//                   {/* Icon with Enhanced Hover Glow */}
//                   <div className="relative z-10">
//                     <motion.div
//                       className={`absolute inset-0 rounded-lg blur-md transition-all ${
//                         isActive ? colors.glow : 'bg-transparent'
//                       }`}
//                       animate={{
//                         backgroundColor: isActive ? undefined : 'transparent'
//                       }}
//                     />
//                     <Icon className={`relative w-5 h-5 flex-shrink-0 ${
//                       isActive ? 'filter drop-shadow-[0_0_8px_currentColor]' : ''
//                     } transition-all group-hover:filter group-hover:drop-shadow-[0_0_10px_currentColor]`} />
//                   </div>

//                   {/* Label */}
//                   <AnimatePresence>
//                     {!isCollapsed && (
//                       <motion.span
//                         initial={{ opacity: 0, x: -10 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         exit={{ opacity: 0, x: -10 }}
//                         className="relative text-sm z-10 flex-1 text-left font-medium whitespace-nowrap overflow-hidden text-ellipsis"
//                       >
//                         {item.label}
//                       </motion.span>
//                     )}
//                   </AnimatePresence>

//                   {/* Badge */}
//                   {item.badge && (
//                     <AnimatePresence>
//                       {!isCollapsed ? (
//                         <motion.span
//                           initial={{ opacity: 0, scale: 0 }}
//                           animate={{ opacity: 1, scale: 1 }}
//                           exit={{ opacity: 0, scale: 0 }}
//                           className={`relative z-10 px-2 py-0.5 rounded-full text-xs font-semibold ${colors.badge} border whitespace-nowrap`}
//                         >
//                           {item.badge}
//                         </motion.span>
//                       ) : (
//                         <div className={`absolute -top-1 -right-1 w-2 h-2 ${colors.border} rounded-full border border-[#1e293b] animate-pulse shadow-lg`} />
//                       )}
//                     </AnimatePresence>
//                   )}
//                 </motion.button>
//               </motion.div>
//             );
//           })}
//         </nav>

//         {/* Divider */}
//         <div className="mx-4 border-t border-indigo-500/10" />

//         {/* Bottom Section */}
//         <div className="p-4 space-y-1">
//           {bottomMenuItems.map((item) => {
//             const Icon = item.icon;
//             const colorClasses = item.color === 'indigo' 
//               ? {
//                   hoverGlow: 'from-indigo-500/10 to-transparent',
//                   iconGlow: 'rgba(99, 102, 241, 0.3)',
//                   badge: 'bg-red-500/20 text-red-400 border-red-500/30'
//                 }
//               : {
//                   hoverGlow: 'from-yellow-500/10 to-transparent',
//                   iconGlow: 'rgba(251, 191, 36, 0.3)',
//                   badge: 'bg-red-500/20 text-red-400 border-red-500/30'
//                 };
            
//             return (
//               <motion.button
//                 key={item.label}
//                 onClick={() => {
//                   item.path && navigate(item.path);
//                   setMobileOpen(false);
//                 }}
//                 whileHover={{ x: isCollapsed ? 0 : 5, scale: isCollapsed ? 1.1 : 1 }}
//                 whileTap={{ scale: 0.95 }}
//                 className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 transition-all relative group`}
//               >
//                 <motion.div
//                   className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r ${colorClasses.hoverGlow} blur-sm`}
//                 />

//                 <div className="relative z-10">
//                   <motion.div
//                     className="absolute inset-0 blur-md bg-transparent transition-all"
//                   />
//                   <Icon className="relative w-5 h-5 flex-shrink-0 group-hover:filter group-hover:drop-shadow-[0_0_10px_currentColor] transition-all" />
//                 </div>
                
//                 <AnimatePresence>
//                   {!isCollapsed && (
//                     <motion.span
//                       initial={{ opacity: 0, x: -10 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       exit={{ opacity: 0, x: -10 }}
//                       className="relative text-sm flex-1 text-left z-10 font-medium whitespace-nowrap overflow-hidden text-ellipsis"
//                     >
//                       {item.label}
//                     </motion.span>
//                   )}
//                 </AnimatePresence>

//                 {item.badge && (
//                   <AnimatePresence>
//                     {!isCollapsed ? (
//                       <motion.span
//                         initial={{ opacity: 0, scale: 0 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         exit={{ opacity: 0, scale: 0 }}
//                         className={`relative z-10 px-2 py-0.5 rounded-full text-xs ${colorClasses.badge} border font-semibold`}
//                       >
//                         {item.badge}
//                       </motion.span>
//                     ) : (
//                       <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-[#1e293b] animate-pulse shadow-lg shadow-red-500/50" />
//                     )}
//                   </AnimatePresence>
//                 )}
//               </motion.button>
//             );
//           })}
//         </div>

//         {/* User Profile */}
//         <div className="p-4 border-t border-indigo-500/20">
//           {!isCollapsed ? (
//             <motion.div
//               whileHover={{ scale: 1.02 }}
//               onClick={() => navigate('/profile')}
//               className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-700/30 to-slate-700/20 border border-slate-700/50 relative overflow-hidden group cursor-pointer"
//             >
//               <motion.div
//                 className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
//                 animate={{ x: ['-100%', '200%'] }}
//                 transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
//               />

//               <div className="relative flex-shrink-0">
//                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-yellow-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
//                 <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
//                   <User className="w-5 h-5 text-white" />
//                 </div>
//               </div>
              
//               <div className="flex-1 min-w-0 relative z-10">
//                 <p className="text-slate-200 text-sm truncate font-medium">Admin User</p>
//                 <p className="text-slate-500 text-xs truncate">admin@atomone.in</p>
//               </div>

//               <motion.button
//                 whileHover={{ scale: 1.1, rotate: 90 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleLogout();
//                 }}
//                 className="relative z-10 text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
//               >
//                 <LogOut className="w-4 h-4" />
//               </motion.button>
//             </motion.div>
//           ) : (
//             <motion.div
//               whileHover={{ scale: 1.1 }}
//               onClick={() => navigate('/profile')}
//               className="flex items-center justify-center cursor-pointer group relative"
//             >
//               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/40 to-yellow-500/40 rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
//               <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-500/40 border-2 border-indigo-400/30">
//                 <User className="w-6 h-6 text-white filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
//               </div>
//               <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-[#1e293b] animate-pulse shadow-lg shadow-red-500/50" />
//             </motion.div>
//           )}
//         </div>
//       </motion.aside>

//       {/* Main Content Spacer - Adjusts based on sidebar state */}
//       <div 
//         className="hidden lg:block flex-shrink-0 transition-all duration-300"
//         style={{ width: isCollapsed ? '80px' : '280px' }}
//       />

//       {/* Custom Scrollbar Styles */}
//       <style jsx>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 6px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: rgba(99, 102, 241, 0.3);
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: rgba(99, 102, 241, 0.5);
//         }
//       `}</style>
//     </>
//   );
// }



import { useState } from 'react';
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
  CircleAlert  // ✅ ADDED: Import for Idle Case icon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


export default function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);


  const fullLogo = '/logo1.jpg';
  const smallLogo = '/logo3.jpg';


  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      color: 'indigo',
      badge: null
    },
    {
      label: 'Plant 1 Live',
      icon: Factory,
      path: '/plant1-live',
      color: 'cyan',
      badge: '45'
    },
    {
      label: 'Plant 2 Live',
      icon: MonitorDot,
      path: '/plant2-live',
      color: 'yellow',
      badge: '22'
    },
    {
      label: 'Operations',
      icon: Settings,
      path: '/assign-machine',
      color: 'indigo',
      badge: null
    },
    {
      label: 'Reports',
      icon: FileText,
      path: '/idle-reports-list',
      color: 'indigo',
      badge: null
    },
    // ✅ ADDED: Idle Case Link
    {
      label: 'Idle Case',
      icon: CircleAlert,
      path: '/idle-case',
      color: 'yellow',  // Red/Yellow theme for alerts
      badge: 'Alert'
    },
    {
      label: 'Production Report',
      icon: ClipboardList,
      path: '/production-report',
      color: 'indigo',
      badge: null
    },
    {
      label: 'QMS',
      icon: ShieldCheck,
      path: '/qms',
      color: 'yellow',
      badge: 'New'
    },
    {
      label: 'Attendance',
      icon: CalendarCheck,
      path: '/attendance',
      color: 'indigo',
      badge: null
    },
  ];


  const bottomMenuItems = [
    {
      label: 'Notifications',
      icon: Bell,
      path: '/notifications',
      color: 'indigo',
      badge: '3'
    },
    {
      label: 'Support',
      icon: HelpCircle,
      path: '/support',
      color: 'yellow',
      badge: null
    },
  ];


  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/login');
  };


  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#1e293b] border border-indigo-500/30 text-indigo-400"
      >
        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>


      {/* Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}


      {/* ✅ FIXED SIDEBAR - No more zoom issues */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isCollapsed ? '80px' : '280px',
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`
          fixed left-0 top-0 h-screen z-30
          bg-gradient-to-b from-[#1e293b] to-[#0f172a] backdrop-blur-xl 
          border-r border-indigo-500/20 flex flex-col
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300
        `}
        style={{
          minWidth: isCollapsed ? '80px' : '280px',
          maxWidth: isCollapsed ? '80px' : '280px',
        }}
      >
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


        {/* Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-8 z-50 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 border-2 border-[#0f172a] items-center justify-center shadow-lg shadow-indigo-500/50 hover:shadow-indigo-500/80 transition-shadow"
        >
          {isCollapsed ? (
            <ChevronRight className="w-3 h-3 text-white" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-white" />
          )}
        </motion.button>


        {/* Logo */}
        <div className={`p-6 border-b border-indigo-500/20 relative ${isCollapsed ? 'flex items-center justify-center' : ''}`}>
          <motion.div 
            className="flex items-center justify-center cursor-pointer group relative"
            onClick={() => navigate('/dashboard')}
            whileHover={{ scale: 1.05 }}
          >
            <AnimatePresence mode="wait">
              {!isCollapsed ? (
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
                    className="relative h-16 w-full object-contain drop-shadow-2xl filter brightness-110"
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
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-indigo-500/30 shadow-lg shadow-indigo-500/30">
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
          {!isCollapsed && (
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
                  className="relative w-full bg-[#0f172a]/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>


        {/* Main Navigation Menu */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            // ✅ Color mapping fixed
            const colorClasses = {
              indigo: {
                bg: 'from-indigo-500/20 to-indigo-500/10',
                text: 'text-indigo-400',
                shadow: 'shadow-indigo-500/20',
                border: 'bg-indigo-500',
                badge: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
                glow: 'bg-indigo-400/60',
                hoverGlow: 'from-indigo-500/10 to-transparent',
                hoverBlur: 'rgba(99, 102, 241, 0.4)',
              },
              cyan: {
                bg: 'from-cyan-500/20 to-cyan-500/10',
                text: 'text-cyan-400',
                shadow: 'shadow-cyan-500/20',
                border: 'bg-cyan-500',
                badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
                glow: 'bg-cyan-400/60',
                hoverGlow: 'from-cyan-500/10 to-transparent',
                hoverBlur: 'rgba(6, 182, 212, 0.4)',
              },
              yellow: {
                bg: 'from-yellow-500/20 to-yellow-500/10',
                text: 'text-yellow-400',
                shadow: 'shadow-yellow-500/20',
                border: 'bg-yellow-500',
                badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
                glow: 'bg-yellow-400/60',
                hoverGlow: 'from-yellow-500/10 to-transparent',
                hoverBlur: 'rgba(251, 191, 36, 0.4)',
              }
            };


            const colors = colorClasses[item.color];
            
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <motion.button
                  onClick={() => {
                    navigate(item.path);
                    setMobileOpen(false);
                  }}
                  whileHover={{ x: isCollapsed ? 0 : 5, scale: isCollapsed ? 1.1 : 1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-xl transition-all relative group ${
                    isActive
                      ? `bg-gradient-to-r ${colors.bg} ${colors.text} shadow-lg ${colors.shadow}`
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {/* Hover Effect with Correct Color */}
                  {!isActive && (
                    <motion.div
                      className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r ${colors.hoverGlow} blur-sm`}
                    />
                  )}


                  {/* Active Glow Effect */}
                  {isActive && !isCollapsed && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute inset-0 rounded-xl bg-gradient-to-r ${colors.hoverGlow}`}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  {/* Left Border Indicator */}
                  {isActive && !isCollapsed && (
                    <motion.div
                      layoutId="activeBorder"
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full ${colors.border}`}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}


                  {/* Icon with Enhanced Hover Glow */}
                  <div className="relative z-10">
                    <motion.div
                      className={`absolute inset-0 rounded-lg blur-md transition-all ${
                        isActive ? colors.glow : 'bg-transparent'
                      }`}
                      animate={{
                        backgroundColor: isActive ? undefined : 'transparent'
                      }}
                    />
                    <Icon className={`relative w-5 h-5 flex-shrink-0 ${
                      isActive ? 'filter drop-shadow-[0_0_8px_currentColor]' : ''
                    } transition-all group-hover:filter group-hover:drop-shadow-[0_0_10px_currentColor]`} />
                  </div>


                  {/* Label */}
                  <AnimatePresence>
                    {!isCollapsed && (
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
                      {!isCollapsed ? (
                        <motion.span
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          className={`relative z-10 px-2 py-0.5 rounded-full text-xs font-semibold ${colors.badge} border whitespace-nowrap`}
                        >
                          {item.badge}
                        </motion.span>
                      ) : (
                        <div className={`absolute -top-1 -right-1 w-2 h-2 ${colors.border} rounded-full border border-[#1e293b] animate-pulse shadow-lg`} />
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
        <div className="p-4 space-y-1">
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            const colorClasses = item.color === 'indigo' 
              ? {
                  hoverGlow: 'from-indigo-500/10 to-transparent',
                  iconGlow: 'rgba(99, 102, 241, 0.3)',
                  badge: 'bg-red-500/20 text-red-400 border-red-500/30'
                }
              : {
                  hoverGlow: 'from-yellow-500/10 to-transparent',
                  iconGlow: 'rgba(251, 191, 36, 0.3)',
                  badge: 'bg-red-500/20 text-red-400 border-red-500/30'
                };
            
            return (
              <motion.button
                key={item.label}
                onClick={() => {
                  item.path && navigate(item.path);
                  setMobileOpen(false);
                }}
                whileHover={{ x: isCollapsed ? 0 : 5, scale: isCollapsed ? 1.1 : 1 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 transition-all relative group`}
              >
                <motion.div
                  className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r ${colorClasses.hoverGlow} blur-sm`}
                />


                <div className="relative z-10">
                  <motion.div
                    className="absolute inset-0 blur-md bg-transparent transition-all"
                  />
                  <Icon className="relative w-5 h-5 flex-shrink-0 group-hover:filter group-hover:drop-shadow-[0_0_10px_currentColor] transition-all" />
                </div>
                
                <AnimatePresence>
                  {!isCollapsed && (
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
                    {!isCollapsed ? (
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className={`relative z-10 px-2 py-0.5 rounded-full text-xs ${colorClasses.badge} border font-semibold`}
                      >
                        {item.badge}
                      </motion.span>
                    ) : (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-[#1e293b] animate-pulse shadow-lg shadow-red-500/50" />
                    )}
                  </AnimatePresence>
                )}
              </motion.button>
            );
          })}
        </div>


        {/* User Profile */}
        <div className="p-4 border-t border-indigo-500/20">
          {!isCollapsed ? (
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate('/profile')}
              className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-slate-700/30 to-slate-700/20 border border-slate-700/50 relative overflow-hidden group cursor-pointer"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
              />


              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-yellow-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <User className="w-5 h-5 text-white" />
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
              onClick={() => navigate('/profile')}
              className="flex items-center justify-center cursor-pointer group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/40 to-yellow-500/40 rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-500/40 border-2 border-indigo-400/30">
                <User className="w-6 h-6 text-white filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-[#1e293b] animate-pulse shadow-lg shadow-red-500/50" />
            </motion.div>
          )}
        </div>
      </motion.aside>


      {/* Main Content Spacer - Adjusts based on sidebar state */}
      <div 
        className="hidden lg:block flex-shrink-0 transition-all duration-300"
        style={{ width: isCollapsed ? '80px' : '280px' }}
      />


      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
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
      `}</style>
    </>
  );
}
