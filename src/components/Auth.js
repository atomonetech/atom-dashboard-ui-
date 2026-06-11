// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Factory, Zap, Mail, Lock, Eye, EyeOff, Cpu, TrendingUp, User } from 'lucide-react';
// import { motion, AnimatePresence } from 'motion/react';
// import { Button } from './ui/button';
// import { Checkbox } from './ui/checkbox';
// import { toast } from "react-toastify";

// export default function Auth({ onLogin }) {
//   const navigate = useNavigate();
//   const [showPassword, setShowPassword] = useState(false);
//   const [username, setUsername] = useState(''); 
//   const [password, setPassword] = useState('');
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState(''); // 🔥 ADDED: Error message state
  
//   // 🔥 NAYI STATES: Forgot password toggle aur email ke liye
//   const [isForgotView, setIsForgotView] = useState(false);
//   const [resetEmail, setResetEmail] = useState('');

//   // 🔥 NAYA FUNCTION: Forgot Password API call karne ke liye
//   const handleForgotPassword = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setErrorMessage('');

//     try {
//       const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
//       const response = await fetch(`${apiUrl}/api/forgot-password/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email: resetEmail }) 
//       });

//       if (response.ok) {
//         toast.success("Password reset link sent to your email! 📩");
//         setIsForgotView(false); // Wapas login screen par bhej do
//       } else {
//         setErrorMessage("Email not found or something went wrong.");
//       }
//     } catch (error) {
//       setErrorMessage("Backend unreachable. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // 🔥 UPDATED API LOGIN LOGIC WITH VERCEL BYPASS & TIMEOUT
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setErrorMessage(''); // 🔥 ADDED: Naya login try karne pe purana error clear karo

//     const loginAsDemoAdmin = () => {
//       localStorage.setItem('access_token', 'demo_admin_token');
//       localStorage.setItem('user_role', 'Admin');
//       localStorage.setItem('username', 'Admin');
//       if (onLogin) {
//         console.log('🔐 Calling onLogin - Setting auth TRUE (Demo Mode)');
//         onLogin();
//       }
//       navigate('/dashboard'); 
//     };

//     try {
//       if (window.location.protocol === 'https:' && username === 'Admin' && password === 'admin') {
//         console.log('Running on Vercel/HTTPS. Bypassing local backend...');
//         loginAsDemoAdmin();
//         setIsLoading(false);
//         return; 
//       }

//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 3000);

//       // 🔥 UPDATED: Dynamic API URL setup based on environment
//       const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

//       const response = await fetch(`${apiUrl}/api/login/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ username, password }),
//         signal: controller.signal 
//       });

//       clearTimeout(timeoutId); 
//       const data = await response.json();

//       if (response.ok) {
//         localStorage.setItem('access_token', data.access);
//         localStorage.setItem('refresh_token', data.refresh);
//         localStorage.setItem('user_role', data.role);
//         localStorage.setItem('username', username);
//           toast.success(`Welcome ${username} to AtomOne Dashboard 🚀`);

//         if (onLogin) {
//           console.log('🔐 Calling onLogin - Setting auth TRUE');
//           onLogin();
//         }

//         // 🔥 YAHAN MAINEY CHANGE KIYA HAI 🔥
//         // Sirf QA, Production, aur Maintenance apne hub mein jayenge.
//         // Plant_1, Plant_2, Supervisor, Manager sab direct Dashboard jayenge.
//         if (data.role === 'QA_Hub') {
//           navigate('/qa-hub');
//         } else if (data.role === 'Production_Hub') {
//           navigate('/production-hub');
//         } else if (data.role === 'Maintenance_Hub') {
//           navigate('/maintenance-hub');
//         } else {
//           // Plant users ko bhi pehle dashboard hi dikhana hai
//           navigate('/dashboard'); 
//         }
        
//       } else if (response.status === 401) {
//         // 🔥 ADDED: 401 aane par GitHub jaisa error message
//         setErrorMessage('Incorrect username or password.');
//       } else {
//         // 🔥 ADDED: Custom alert ki jagah banner mein error dikhao
//         setErrorMessage('Authentication Failed: Please verify your credentials and try again.');
//       }
//     } catch (error) {
//       console.log('Backend unreachable or timed out. Triggering Vercel Demo Mode...');

//       if (username === 'Admin' && password === 'admin') {
//         loginAsDemoAdmin();
//       } 
//       else {
//         localStorage.setItem('access_token', 'demo_blocked_token');
//         localStorage.setItem('user_role', 'Blocked');
//         localStorage.setItem('username', username);
        
//         if (onLogin) onLogin();
//         navigate('/404-page-not-found'); 
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

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

//             {/* Title (Dynamic based on View) */}
//             <div className="text-center mb-8">
//               <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-yellow-400 bg-clip-text text-transparent">
//                 {isForgotView ? 'Reset Password' : 'Welcome Back'}
//               </h2>
//               <p className="text-slate-400 text-sm sm:text-base">
//                 {isForgotView ? 'Enter your email to receive a reset link' : 'Login to access your dashboard'}
//               </p>
//             </div>

//             {/* 🔥 GitHub-style Error Banner */}
//             {errorMessage && (
//               <div className="bg-[#ffebe9] text-[#ff1100] border border-[rgba(255,129,130,0.4)] px-4 py-3 rounded-lg mb-6 flex justify-between items-center shadow-sm">
//                 <span className="text-sm font-medium">{errorMessage}</span>
//                 <button 
//                   type="button" 
//                   onClick={() => setErrorMessage('')} 
//                   className="bg-transparent border-none cursor-pointer text-lg leading-none hover:opacity-70 text-[#ff1100]"
//                 >
//                   ✖
//                 </button>
//               </div>
//             )}

//             {/* 🔥 CONDITIONAL RENDERING: Forgot Password Form vs Login Form */}
//             {isForgotView ? (
//               <form onSubmit={handleForgotPassword} className="space-y-6">
//                 <div className="space-y-2">
//                   <label className="text-slate-300 text-sm font-medium block">Email Address</label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 pointer-events-none" />
//                     <input
//                       type="email"
//                       placeholder="Enter your registered email"
//                       value={resetEmail}
//                       onChange={(e) => setResetEmail(e.target.value)}
//                       className="w-full pl-11 pr-4 py-2.5 bg-[#0f172a]/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <Button 
//                   type="submit" 
//                   disabled={isLoading} 
//                   className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold h-12 rounded-lg" 
//                   size="lg"
//                 >
//                   {isLoading ? 'Sending Link...' : 'Send Reset Link'}
//                 </Button>

//                 <div className="text-center text-sm mt-4">
//                   <button 
//                     type="button" 
//                     onClick={() => {
//                       setIsForgotView(false);
//                       setErrorMessage(''); // Back aane pe error hato
//                     }} 
//                     className="text-slate-400 hover:text-cyan-400 transition-colors"
//                   >
//                     ← Back to Login
//                   </button>
//                 </div>
//               </form>
//             ) : (
//               <form onSubmit={handleLogin} className="space-y-6">
//                 {/* Username Field */}
//                 <div className="space-y-2">
//                   <label className="text-slate-300 text-sm font-medium block">Username</label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 pointer-events-none" />
//                     <input
//                       type="text"
//                       placeholder="Enter your username (e.g. Admin)"
//                       value={username}
//                       onChange={(e) => setUsername(e.target.value)}
//                       className="w-full pl-11 pr-4 py-2.5 bg-[#0f172a]/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Password Field */}
//                 <div className="space-y-2">
//                   <label className="text-slate-300 text-sm font-medium block">Password</label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 pointer-events-none" />
//                     <input
//                       type={showPassword ? 'text' : 'password'}
//                       placeholder="••••••••"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       className="w-full pl-11 pr-11 py-2.5 bg-[#0f172a]/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
//                     >
//                       {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                     </button>
//                   </div>
//                 </div>

//                 {/* Remember Me & Forgot Password */}
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <Checkbox id="remember" className="border-slate-600" />
//                     <label htmlFor="remember" className="text-sm text-slate-400 cursor-pointer">
//                       Remember me
//                     </label>
//                   </div>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setIsForgotView(true);
//                       setErrorMessage(''); // Form switch pe error clear karo
//                     }}
//                     className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
//                   >
//                     Forgot Password?
//                   </button>
//                 </div>

//                 {/* Login Button */}
//                 <Button
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-[#0f172a] font-bold h-12 rounded-lg"
//                   size="lg"
//                 >
//                   {isLoading ? 'Authenticating...' : 'Login'}
//                 </Button>

//                 {/* Divider */}
//                 <div className="relative">
//                   <div className="absolute inset-0 flex items-center">
//                     <div className="w-full border-t border-slate-700" />
//                   </div>
//                   <div className="relative flex justify-center text-sm">
//                     <span className="px-4 bg-[#1e293b] text-slate-400">Or</span>
//                   </div>
//                 </div>

//                 {/* Sign Up Link */}
//                 <div className="text-center text-sm">
//                   <span className="text-slate-400">Don't have an account? </span>
//                   <button
//                     type="button"
//                     onClick={() => navigate('/signup')}
//                     className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
//                   >
//                     Sign Up
//                   </button>
//                 </div>
//               </form>
//             )}
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
import { toast } from "react-toastify";

export default function Auth({ onLogin }) {
  const navigate = useNavigate();
  
  // Login States
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  
  // UI States
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // 🔥 FORGOT PASSWORD WALI NAYI STATES
  const [isForgotView, setIsForgotView] = useState(false);
  const [resetUsername, setResetUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // 🔥 NAYA FUNCTION: Direct Password Reset (No Email)
  const handleDirectPasswordReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    // Pehle check karo dono password match kar rahe hain kya
    if (newPassword !== confirmPassword) {
      setErrorMessage("New Password aur Confirm Password match nahi ho rahe!");
      setIsLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/reset-password-direct/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: resetUsername, 
          new_password: newPassword 
        }) 
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password updated successfully! Ab aap naye password se login kar sakte hain 🚀");
        setIsForgotView(false); // Wapas login screen par bhej do
        setResetUsername('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setErrorMessage(data.error || "Kuch galat ho gaya, phir se try karein.");
      }
    } catch (error) {
      setErrorMessage("Backend unreachable. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 PURANA LOGIN FUNCTION (Same rakha hai)
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(''); 

    const loginAsDemoAdmin = () => {
      localStorage.setItem('access_token', 'demo_admin_token');
      localStorage.setItem('user_role', 'Admin');
      localStorage.setItem('username', 'Admin');
      if (onLogin) {
        onLogin();
      }
      navigate('/dashboard'); 
    };

    try {
      if (window.location.protocol === 'https:' && username === 'Admin' && password === 'admin') {
        loginAsDemoAdmin();
        setIsLoading(false);
        return; 
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

      const response = await fetch(`${apiUrl}/api/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        signal: controller.signal 
      });

      clearTimeout(timeoutId); 
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user_role', data.role);
        localStorage.setItem('username', username);
        toast.success(`Welcome ${username} to AtomOne Dashboard 🚀`);

        if (onLogin) onLogin();

        if (data.role === 'QA_Hub') navigate('/qa-hub');
        else if (data.role === 'Production_Hub') navigate('/production-hub');
        else if (data.role === 'Maintenance_Hub') navigate('/maintenance-hub');
        else navigate('/dashboard'); 
        
      } else if (response.status === 401) {
        setErrorMessage('Incorrect username or password.');
      } else {
        setErrorMessage('Authentication Failed: Please verify your credentials and try again.');
      }
    } catch (error) {
      if (username === 'Admin' && password === 'admin') {
        loginAsDemoAdmin();
      } 
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

  const features = [
    { icon: Factory, title: 'Industry 4.0', subtitle: 'Smart Manufacturing', bgColor: 'bg-cyan-500/20', iconColor: 'text-cyan-400', titleColor: 'text-cyan-400' },
    { icon: Zap, title: 'Real-Time Monitoring', subtitle: 'AI-Powered Analytics', bgColor: 'bg-yellow-500/20', iconColor: 'text-yellow-400', titleColor: 'text-yellow-400' },
    { icon: Cpu, title: 'IoT Integration', subtitle: 'Connected Devices', bgColor: 'bg-purple-500/20', iconColor: 'text-purple-400', titleColor: 'text-purple-400' },
    { icon: TrendingUp, title: 'Predictive Insights', subtitle: 'Data-Driven Decisions', bgColor: 'bg-green-500/20', iconColor: 'text-green-400', titleColor: 'text-green-400' }
  ];

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
            animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] via-[#1e293b] to-[#0f172a]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAxMmMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnpNMTggMThjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6bTAgMTJjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6IiBzdHJva2U9IiMwNmI2ZDQiIHN0cm9rZS13aWR0aD0iMC4zIiBvcGFjaXR5PSIwLjEiLz48L2c+PC9zdmc+')] opacity-20" />
        
        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center"><Factory className="w-9 h-9 text-white" /></div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center"><Zap className="w-9 h-9 text-[#0f172a]" /></div>
            </div>
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-yellow-400 bg-clip-text text-transparent">AtomOne Technologies</h1>
            <div className="bg-transparent rounded-3xl p-8 border border-cyan-500/20">
              <p className="text-cyan-100/90 text-lg italic mb-4">"Success is the sum of small efforts, repeated day in and day out"</p>
              <p className="text-slate-400">- Robert Collier</p>
            </div>
            <div className="mt-12 h-[100px] relative overflow-hidden flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div key={currentIndex} className="flex items-center gap-3 text-slate-300 absolute" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} transition={{ duration: 0.5, ease: "easeInOut" }}>
                  <div className={`w-12 h-12 rounded-xl ${features[currentIndex].bgColor} flex items-center justify-center flex-shrink-0`}>
                    {currentIndex === 0 && <Factory className={`w-6 h-6 ${features[currentIndex].iconColor}`} />}
                    {currentIndex === 1 && <Zap className={`w-6 h-6 ${features[currentIndex].iconColor}`} />}
                    {currentIndex === 2 && <Cpu className={`w-6 h-6 ${features[currentIndex].iconColor}`} />}
                    {currentIndex === 3 && <TrendingUp className={`w-6 h-6 ${features[currentIndex].iconColor}`} />}
                  </div>
                  <div className="text-left">
                    <p className={`${features[currentIndex].titleColor} font-semibold text-lg`}>{features[currentIndex].title}</p>
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
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-md">
          <div className="backdrop-blur-xl bg-[#1e293b]/60 rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center"><Factory className="w-6 h-6 text-white" /></div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center"><Zap className="w-6 h-6 text-[#0f172a]" /></div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-yellow-400 bg-clip-text text-transparent">
                {isForgotView ? 'Create New Password' : 'Welcome Back'}
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                {isForgotView ? 'Set a new password for your account directly' : 'Login to access your dashboard'}
              </p>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="bg-[#ffebe9] text-[#ff1100] border border-[rgba(255,129,130,0.4)] px-4 py-3 rounded-lg mb-6 flex justify-between items-center shadow-sm">
                <span className="text-sm font-medium">{errorMessage}</span>
                <button type="button" onClick={() => setErrorMessage('')} className="bg-transparent border-none cursor-pointer text-lg leading-none hover:opacity-70 text-[#ff1100]">✖</button>
              </div>
            )}

            {/* 🔥 DIRECT RESET PASSWORD FORM */}
            {isForgotView ? (
              <form onSubmit={handleDirectPasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-slate-300 text-sm font-medium block">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Enter your registered username"
                      value={resetUsername}
                      onChange={(e) => setResetUsername(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-[#0f172a]/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-300 text-sm font-medium block">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 pointer-events-none" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-11 pr-11 py-2.5 bg-[#0f172a]/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                      required
                    />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors">
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-slate-300 text-sm font-medium block">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 pointer-events-none" />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-[#0f172a]/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold h-12 rounded-lg mt-2" size="lg">
                  {isLoading ? 'Updating...' : 'Save Password'}
                </Button>

                <div className="text-center text-sm mt-4">
                  <button type="button" onClick={() => { setIsForgotView(false); setErrorMessage(''); }} className="text-slate-400 hover:text-cyan-400 transition-colors">
                    ← Back to Login
                  </button>
                </div>
              </form>
            ) : (
              /* LOGIN FORM */
              <form onSubmit={handleLogin} className="space-y-6">
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
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox id="remember" className="border-slate-600" />
                    <label htmlFor="remember" className="text-sm text-slate-400 cursor-pointer">Remember me</label>
                  </div>
                  <button type="button" onClick={() => { setIsForgotView(true); setErrorMessage(''); }} className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                    Forgot Password?
                  </button>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-[#0f172a] font-bold h-12 rounded-lg" size="lg">
                  {isLoading ? 'Authenticating...' : 'Login'}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700" /></div>
                  <div className="relative flex justify-center text-sm"><span className="px-4 bg-[#1e293b] text-slate-400">Or</span></div>
                </div>

                <div className="text-center text-sm">
                  <span className="text-slate-400">Don't have an account? </span>
                  <button type="button" onClick={() => navigate('/signup')} className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">Sign Up</button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-6 text-center">
            <button onClick={() => navigate('/')} className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">
              ← Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}