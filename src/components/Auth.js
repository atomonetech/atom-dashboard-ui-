// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Factory, Zap, Mail, Lock, Eye, EyeOff, Cpu, TrendingUp, User } from 'lucide-react'; // User icon add kiya
// import { motion, AnimatePresence } from 'motion/react';
// import { Button } from './ui/button';
// import { Checkbox } from './ui/checkbox';

// export default function Auth({ onLogin }) {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   // 🔥 CHANGED: email ki jagah username state use kar rahe hain
//   const [username, setUsername] = useState(''); 
//   const [password, setPassword] = useState('');
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isLoading, setIsLoading] = useState(false); // Loading state add ki

//   // 🔥 NEW API LOGIN LOGIC
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
    
//     try {
//       const response = await fetch('http://192.168.0.34:8000/api/login/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, password })
//       });

//       const data = await response.json();

//       if (response.ok) {
//         // Token aur Role save karo
//         localStorage.setItem('access_token', data.access);
//         localStorage.setItem('refresh_token', data.refresh);
//         localStorage.setItem('user_role', data.role);
//         localStorage.setItem('username', username); // 🔥 TRACK HISTORY KE LIYE YAHAN USERNAME SAVE KIYA 🔥

//         if (onLogin) {
//           console.log('🔐 Calling onLogin - Setting auth TRUE');
//           onLogin();
//         }

//         // 🔥 Role ke hisaab se Redirect
//         if (data.role === 'QA_Hub') {
//           navigate('/qa-hub');
//         } else if (data.role === 'Production_Hub') {
//           navigate('/production-hub');
//         } else if (data.role === 'Maintenance_Hub') {
//           navigate('/maintenance-hub');
//         } else {
//           navigate('/dashboard'); // Default (Agar koi Master Admin ho toh)
//         }
        
//       } else {
//         alert('Authentication Failed: Please verify your credentials and try again.');
//       }
//     } catch (error) {
//       console.error('Login Error:', error);
//       alert('Unable to connect to the server. Please ensure the backend service is running and try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Feature items with icons
//   const features = [
//     {
//       icon: Factory,
//       title: 'Industry 4.0',
//       subtitle: 'Smart Manufacturing',
//       bgColor: 'bg-cyan-500/20',
//       iconColor: 'text-cyan-400',
//       titleColor: 'text-cyan-400'
//     },
//     {
//       icon: Zap,
//       title: 'Real-Time Monitoring',
//       subtitle: 'AI-Powered Analytics',
//       bgColor: 'bg-yellow-500/20',
//       iconColor: 'text-yellow-400',
//       titleColor: 'text-yellow-400'
//     },
//     {
//       icon: Cpu,
//       title: 'IoT Integration',
//       subtitle: 'Connected Devices',
//       bgColor: 'bg-purple-500/20',
//       iconColor: 'text-purple-400',
//       titleColor: 'text-purple-400'
//     },
//     {
//       icon: TrendingUp,
//       title: 'Predictive Insights',
//       subtitle: 'Data-Driven Decisions',
//       bgColor: 'bg-green-500/20',
//       iconColor: 'text-green-400',
//       titleColor: 'text-green-400'
//     }
//   ];

//   // Auto cycle through features
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % features.length);
//     }, 2500);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#0f172a] relative overflow-hidden flex flex-col lg:flex-row">
//       {/* Animated Background Bubbles */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         {[...Array(15)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute rounded-full"
//             style={{
//               width: Math.random() * 300 + 50,
//               height: Math.random() * 300 + 50,
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               background: i % 2 === 0 
//                 ? 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)'
//                 : 'radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%)',
//             }}
//             animate={{
//               y: [0, -30, 0],
//               x: [0, 15, 0],
//               scale: [1, 1.1, 1],
//             }}
//             transition={{
//               duration: Math.random() * 10 + 10,
//               repeat: Infinity,
//               ease: "easeInOut",
//             }}
//           />
//         ))}
//       </div>

//       {/* Left Panel */}
//       <div className="hidden lg:flex lg:w-1/2 relative">
//         <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] via-[#1e293b] to-[#0f172a]" />
//         <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAxMmMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnpNMTggMThjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6bTAgMTJjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6IiBzdHJva2U9IiMwNmI2ZDQiIHN0cm9rZS13aWR0aD0iMC4zIiBvcGFjaXR5PSIwLjEiLz48L2c+PC9zdmc+')] opacity-20" />
        
//         <div className="relative z-10 flex flex-col justify-center items-center w-full px-12">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-center"
//           >
//             <div className="flex items-center justify-center gap-2 mb-8">
//               <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
//                 <Factory className="w-9 h-9 text-white" />
//               </div>
//               <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
//                 <Zap className="w-9 h-9 text-[#0f172a]" />
//               </div>
//             </div>
            
//             <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-yellow-400 bg-clip-text text-transparent">
//               AtomOne Technologies
//             </h1>
            
//             <div className="bg-transparent rounded-3xl p-8 border border-cyan-500/20">
//               <p className="text-cyan-100/90 text-lg italic mb-4">
//                 "Success is the sum of small efforts, repeated day in and day out"
//               </p>
//               <p className="text-slate-400">- Robert Collier</p>
//             </div>

//             {/* ONE ITEM AT A TIME */}
//             <div className="mt-12 h-[100px] relative overflow-hidden flex items-center justify-center">
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={currentIndex}
//                   className="flex items-center gap-3 text-slate-300 absolute"
//                   initial={{ opacity: 0, y: 50 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -50 }}
//                   transition={{ 
//                     duration: 0.5,
//                     ease: "easeInOut"
//                   }}
//                 >
//                   <div className={`w-12 h-12 rounded-xl ${features[currentIndex].bgColor} flex items-center justify-center flex-shrink-0`}>
//                     {currentIndex === 0 && <Factory className={`w-6 h-6 ${features[currentIndex].iconColor}`} />}
//                     {currentIndex === 1 && <Zap className={`w-6 h-6 ${features[currentIndex].iconColor}`} />}
//                     {currentIndex === 2 && <Cpu className={`w-6 h-6 ${features[currentIndex].iconColor}`} />}
//                     {currentIndex === 3 && <TrendingUp className={`w-6 h-6 ${features[currentIndex].iconColor}`} />}
//                   </div>
//                   <div className="text-left">
//                     <p className={`${features[currentIndex].titleColor} font-semibold text-lg`}>
//                       {features[currentIndex].title}
//                     </p>
//                     <p className="text-sm text-slate-400">{features[currentIndex].subtitle}</p>
//                   </div>
//                 </motion.div>
//               </AnimatePresence>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Right Panel - Login Form */}
//       <div className="w-full lg:w-1/2 relative flex items-center justify-center p-4 sm:p-6 lg:p-8">
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.8 }}
//           className="w-full max-w-md"
//         >
//           <div className="backdrop-blur-xl bg-[#1e293b]/60 rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl">
//             {/* Mobile Logo */}
//             <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
//               <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
//                 <Factory className="w-6 h-6 text-white" />
//               </div>
//               <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
//                 <Zap className="w-6 h-6 text-[#0f172a]" />
//               </div>
//             </div>

//             {/* Title */}
//             <div className="text-center mb-8">
//               <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-yellow-400 bg-clip-text text-transparent">
//                 Welcome Back
//               </h2>
//               <p className="text-slate-400 text-sm sm:text-base">Login to access your dashboard</p>
//             </div>

//             {/* Form */}
//             <form onSubmit={handleLogin} className="space-y-6">
//               {/* Username Field */}
//               <div className="space-y-2">
//                 <label className="text-slate-300 text-sm font-medium block">Username</label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 pointer-events-none" />
//                   <input
//                     type="text"
//                     placeholder="Enter your username (e.g. himanshu)"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     className="w-full pl-11 pr-4 py-2.5 bg-[#0f172a]/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Password Field */}
//               <div className="space-y-2">
//                 <label className="text-slate-300 text-sm font-medium block">Password</label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 pointer-events-none" />
//                   <input
//                     type={showPassword ? 'text' : 'password'}
//                     placeholder="••••••••"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full pl-11 pr-11 py-2.5 bg-[#0f172a]/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
//                   >
//                     {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                   </button>
//                 </div>
//               </div>

//               {/* Remember Me & Forgot Password */}
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <Checkbox id="remember" className="border-slate-600" />
//                   <label htmlFor="remember" className="text-sm text-slate-400 cursor-pointer">
//                     Remember me
//                   </label>
//                 </div>
//                 <button
//                   type="button"
//                   className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
//                 >
//                   Forgot Password?
//                 </button>
//               </div>

//               {/* Login Button */}
//               <Button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-[#0f172a] font-bold h-12 rounded-lg"
//                 size="lg"
//               >
//                 {isLoading ? 'Authenticating...' : 'Login'}
//               </Button>

//               {/* Divider */}
//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-slate-700" />
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-4 bg-[#1e293b] text-slate-400">Or</span>
//                 </div>
//               </div>

//               {/* Sign Up Link */}
//               <div className="text-center text-sm">
//                 <span className="text-slate-400">Don't have an account? </span>
//                 <button
//                   type="button"
//                   onClick={() => navigate('/signup')}
//                   className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
//                 >
//                   Sign Up
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* Back to Home */}
//           <div className="mt-6 text-center">
//             <button
//               onClick={() => navigate('/')}
//               className="text-slate-400 hover:text-cyan-400 transition-colors text-sm"
//             >
//               ← Back to Home
//             </button>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }



import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Factory, Zap, Mail, Lock, Eye, EyeOff, Cpu, TrendingUp, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';

export default function Auth({ onLogin }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 🔥 UPDATED API LOGIN LOGIC WITH VERCEL BYPASS
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // 1. Asli Backend API (Local testing ke liye)
      const response = await fetch('http://192.168.0.34:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Token aur Role save karo
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user_role', data.role);
        localStorage.setItem('username', username);

        if (onLogin) {
          console.log('🔐 Calling onLogin - Setting auth TRUE');
          onLogin();
        }

        // 🔥 Role ke hisaab se Redirect
        if (data.role === 'QA_Hub') {
          navigate('/qa-hub');
        } else if (data.role === 'Production_Hub') {
          navigate('/production-hub');
        } else if (data.role === 'Maintenance_Hub') {
          navigate('/maintenance-hub');
        } else {
          navigate('/dashboard'); // Default
        }
        
      } else {
        alert('Authentication Failed: Please verify your credentials and try again.');
      }
    } catch (error) {
      // 🚀 2. VERCEL DEMO BYPASS (Jab backend connect na ho)
      console.log('Backend unreachable. Triggering Vercel Demo Mode...');

      // Agar username 'Admin' aur password 'admin' hai -> FULL ACCESS
      if (username === 'Admin' && password === 'admin') {
        localStorage.setItem('access_token', 'demo_admin_token');
        localStorage.setItem('user_role', 'Admin');
        localStorage.setItem('username', 'Admin');
        
        if (onLogin) onLogin();
        navigate('/dashboard'); 
      } 
      // Koi bhi aur random login kare -> BLOCK KARO AUR 404 PE BHEJO
      else {
        localStorage.setItem('access_token', 'demo_blocked_token');
        localStorage.setItem('user_role', 'Blocked');
        localStorage.setItem('username', username);
        
        if (onLogin) onLogin();
        navigate('/404-page-not-found'); 
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Feature items with icons
  const features = [
    {
      icon: Factory,
      title: 'Industry 4.0',
      subtitle: 'Smart Manufacturing',
      bgColor: 'bg-cyan-500/20',
      iconColor: 'text-cyan-400',
      titleColor: 'text-cyan-400'
    },
    {
      icon: Zap,
      title: 'Real-Time Monitoring',
      subtitle: 'AI-Powered Analytics',
      bgColor: 'bg-yellow-500/20',
      iconColor: 'text-yellow-400',
      titleColor: 'text-yellow-400'
    },
    {
      icon: Cpu,
      title: 'IoT Integration',
      subtitle: 'Connected Devices',
      bgColor: 'bg-purple-500/20',
      iconColor: 'text-purple-400',
      titleColor: 'text-purple-400'
    },
    {
      icon: TrendingUp,
      title: 'Predictive Insights',
      subtitle: 'Data-Driven Decisions',
      bgColor: 'bg-green-500/20',
      iconColor: 'text-green-400',
      titleColor: 'text-green-400'
    }
  ];

  // Auto cycle through features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden flex flex-col lg:flex-row">
      {/* Animated Background Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 
                ? 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%)',
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] via-[#1e293b] to-[#0f172a]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAxMmMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnpNMTggMThjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6bTAgMTJjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6IiBzdHJva2U9IiMwNmI2ZDQiIHN0cm9rZS13aWR0aD0iMC4zIiBvcGFjaXR5PSIwLjEiLz48L2c+PC9zdmc+')] opacity-20" />
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                <Factory className="w-9 h-9 text-white" />
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                <Zap className="w-9 h-9 text-[#0f172a]" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-yellow-400 bg-clip-text text-transparent">
              AtomOne Technologies
            </h1>
            
            <div className="bg-transparent rounded-3xl p-8 border border-cyan-500/20">
              <p className="text-cyan-100/90 text-lg italic mb-4">
                "Success is the sum of small efforts, repeated day in and day out"
              </p>
              <p className="text-slate-400">- Robert Collier</p>
            </div>

            {/* ONE ITEM AT A TIME */}
            <div className="mt-12 h-[100px] relative overflow-hidden flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  className="flex items-center gap-3 text-slate-300 absolute"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ 
                    duration: 0.5,
                    ease: "easeInOut"
                  }}
                >
                  <div className={`w-12 h-12 rounded-xl ${features[currentIndex].bgColor} flex items-center justify-center flex-shrink-0`}>
                    {currentIndex === 0 && <Factory className={`w-6 h-6 ${features[currentIndex].iconColor}`} />}
                    {currentIndex === 1 && <Zap className={`w-6 h-6 ${features[currentIndex].iconColor}`} />}
                    {currentIndex === 2 && <Cpu className={`w-6 h-6 ${features[currentIndex].iconColor}`} />}
                    {currentIndex === 3 && <TrendingUp className={`w-6 h-6 ${features[currentIndex].iconColor}`} />}
                  </div>
                  <div className="text-left">
                    <p className={`${features[currentIndex].titleColor} font-semibold text-lg`}>
                      {features[currentIndex].title}
                    </p>
                    <p className="text-sm text-slate-400">{features[currentIndex].subtitle}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 relative flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="backdrop-blur-xl bg-[#1e293b]/60 rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                <Factory className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                <Zap className="w-6 h-6 text-[#0f172a]" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-yellow-400 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">Login to access your dashboard</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <label className="text-slate-300 text-sm font-medium block">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Enter your username (e.g. Admin)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-[#0f172a]/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-slate-300 text-sm font-medium block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-2.5 bg-[#0f172a]/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" className="border-slate-600" />
                  <label htmlFor="remember" className="text-sm text-slate-400 cursor-pointer">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-[#0f172a] font-bold h-12 rounded-lg"
                size="lg"
              >
                {isLoading ? 'Authenticating...' : 'Login'}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#1e293b] text-slate-400">Or</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center text-sm">
                <span className="text-slate-400">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-slate-400 hover:text-cyan-400 transition-colors text-sm"
            >
              ← Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// done