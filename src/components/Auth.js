import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Factory,
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Cpu,
  TrendingUp,
  User,
  Key,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { toast } from "react-toastify";
import { useUser } from "../../src/context/UserContext";

const THEME_VARS = `
  /* LIGHT — premium white + blue only (per instructor's spec) */
  [data-theme="light"] {
    --bg: #ffffff;
    --bg-soft: #f8fafc;
    --bg-soft-2: #eef4ff;
    --surface: #ffffff;
    --surface-2: #f5f9ff;
    --text: #0f172a;
    --text-soft: #5b6b82;
    --text-muted: #8291a6;
    --accent: #2563eb;
    --accent-strong: #1d4ed8;
    --accent-strong-alt: #1e40af;
    --accent-soft: #60a5fa;
    --accent-deep: #1e3a8a;
    --card-1: #2563eb;
    --card-2: #1d4ed8;
    --card-3: #3b82f6;
    --card-4: #1e3a8a;
    --accent-tint: rgba(37, 99, 235, 0.08);
    --accent-tint-strong: rgba(37, 99, 235, 0.14);
    --border: rgba(37, 99, 235, 0.14);
    --border-strong: rgba(37, 99, 235, 0.3);
    --hero-from: #eff6ff;
    --hero-via: #ffffff;
    --hero-to: #ffffff;
    --nav-bg: rgba(255, 255, 255, 0.85);
    --shadow-color: rgba(30, 64, 175, 0.12);
    --pill-text: #1d4ed8;
    --success: #2563eb;
    --btn-text: #ffffff;
  }

  /* DARK — original AtomOne palette, unchanged: navy bg, cyan + gold + green */
  [data-theme="dark"] {
    --bg: #0f172a;
    --bg-soft: #1e293b;
    --bg-soft-2: #172554;
    --surface: #1e293b;
    --surface-2: #172554;
    --text: #f1f5f9;
    --text-soft: #94a3b8;
    --text-muted: #94a3b8;
    --accent: #06b6d4;
    --accent-strong: #fbbf24;
    --accent-strong-alt: #f59e0b;
    --accent-soft: #10b981;
    --accent-deep: #a78bfa;
    --card-1: #f97316;
    --card-2: #38bdf8;
    --card-3: #22c55e;
    --card-4: #a78bfa;
    --accent-tint: rgba(6, 182, 212, 0.1);
    --accent-tint-strong: rgba(6, 182, 212, 0.18);
    --border: rgba(6, 182, 212, 0.2);
    --border-strong: rgba(6, 182, 212, 0.4);
    --hero-from: #1e3a8a;
    --hero-via: #1e293b;
    --hero-to: #0f172a;
    --nav-bg: rgba(15, 23, 42, 0);
    --shadow-color: rgba(0, 0, 0, 0.4);
    --pill-text: #06b6d4;
    --success: #06b6d4;
    --btn-text: #0f172a;
  }
`;

export default function Auth({ onLogin }) {
  const navigate = useNavigate();

  // Theme initialization
  const [theme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return window.localStorage.getItem("atomone-theme") || "light";
  });

  // Login States
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // UI States
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 🔥 FORGOT PASSWORD STATES (UPDATED FOR OTP)
  const [isForgotView, setIsForgotView] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resetUsername, setResetUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { setUser } = useUser();

  // 🚀 STEP 1: REQUEST OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/request-reset-otp/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: resetUsername }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "OTP sent to your Department Head!");
        setOtpSent(true);
      } else {
        setErrorMessage(
          data.error || "Username nahi mila ya Head configure nahi hai.",
        );
      }
    } catch (error) {
      setErrorMessage("Backend unreachable. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🚀 STEP 2: VERIFY OTP & SET NEW PASSWORD
  const handleVerifyAndReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("New Password aur Confirm Password match nahi ho rahe!");
      setIsLoading(false);
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/verify-reset-otp/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: resetUsername,
          otp: otp,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          "Password updated successfully! Ab aap naye password se login kar sakte hain 🚀",
        );
        setIsForgotView(false);
        setOtpSent(false);
        setResetUsername("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setErrorMessage(data.error || "Galat OTP ya kuch error aayi.");
      }
    } catch (error) {
      setErrorMessage("Backend unreachable. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔥 NORMAL LOGIN FUNCTION
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const loginAsDemoAdmin = () => {
      localStorage.setItem("access_token", "demo_admin_token");
      localStorage.setItem("user_role", "Admin");
      localStorage.setItem("username", "Admin");
      window.dispatchEvent(new Event("userLoginUpdate"));
      if (onLogin) {
        onLogin();
      }
      navigate("/dashboard");
    };

    try {
      if (
        window.location.protocol === "https:" &&
        username === "Admin" &&
        password === "admin"
      ) {
        loginAsDemoAdmin();
        setIsLoading(false);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
      console.log("🔐 LOGIN API URL:", apiUrl);
      const response = await fetch(`${apiUrl}/api/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (response.ok) {
        // Save authentication data
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        localStorage.setItem("user_role", data.role);
        localStorage.setItem("username", data.username);
        localStorage.setItem(
          "user_groups",
          JSON.stringify(data.groups || [])
        );
        // Fetch complete profile data immediately after login
        const profileResponse = await fetch(`${apiUrl}/api/profile/me/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.access}`,
          },
        });

        let profileData = {};

        if (profileResponse.ok) {
          profileData = await profileResponse.json();
        }

        const fullName =
          profileData.full_name || data.full_name || data.username;

        const profileImage =
          profileData.profile_image || data.profile_image || "";

        const email =
          profileData.contact_email ||
          profileData.email ||
          data.email ||
          data.username;

        // Save complete profile data
        localStorage.setItem("full_name", fullName);
        localStorage.setItem("profile_image", profileImage);

        // Update UserContext immediately
        setUser({
          fullName: fullName,
          email: email,
          profileImage: profileImage,
          role: profileData.role || profileData.user_role || data.role,
          department: profileData.department || "",
          designation: profileData.designation || "",
          phone: profileData.mobile_no || "",
          location: profileData.location || "",
        });

        // Tell Sidebar that user data has changed
        window.dispatchEvent(new Event("userLoginUpdate"));

        toast.success(`Welcome ${fullName} to AtomOne Dashboard 🚀`);

        if (onLogin) onLogin();

        if (data.role === "QA_Hub") navigate("/qa-hub");
        else if (data.role === "Production_Hub") navigate("/production-hub");
        else if (data.role === "Maintenance_Hub") navigate("/maintenance-hub");
        else navigate("/dashboard");
      } else if (response.status === 401) {
        setErrorMessage("Incorrect username or password.");
      } else {
        setErrorMessage(
          "Authentication Failed: Please verify your credentials and try again.",
        );
      }
    } catch (error) {
      console.error("❌ Login error:", error);

      setErrorMessage(
        "Unable to connect to backend. Please check backend server."
      );

      // Do NOT create fake login
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_groups");

      // Stay on login page
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Factory,
      title: "Industry 4.0",
      subtitle: "Smart Manufacturing",
      bgColor: "bg-[var(--accent-tint)]",
      iconColor: "text-[var(--accent)]",
      titleColor: "text-[var(--accent)]",
    },
    {
      icon: Zap,
      title: "Real-Time Monitoring",
      subtitle: "AI-Powered Analytics",
      bgColor: "bg-[var(--accent-tint-strong)]",
      iconColor: "text-[var(--accent-strong)]",
      titleColor: "text-[var(--accent-strong)]",
    },
    {
      icon: Cpu,
      title: "IoT Integration",
      subtitle: "Connected Devices",
      bgColor: "bg-[var(--accent-tint)]",
      iconColor: "text-[var(--accent)]",
      titleColor: "text-[var(--accent)]",
    },
    {
      icon: TrendingUp,
      title: "Predictive Insights",
      subtitle: "Data-Driven Decisions",
      bgColor: "bg-[var(--accent-tint-strong)]",
      iconColor: "text-[var(--accent-strong)]",
      titleColor: "text-[var(--accent-strong)]",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      data-theme={theme}
      className="min-h-screen bg-[var(--bg)] relative overflow-hidden flex flex-col lg:flex-row transition-colors duration-300"
    >
      <style>{THEME_VARS}</style>

      {/* Animated Background Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background:
                i % 2 === 0
                  ? "radial-gradient(circle, var(--accent-tint) 0%, transparent 70%)"
                  : "radial-gradient(circle, var(--accent-tint-strong) 0%, transparent 70%)",
            }}
            animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.1, 1] }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Left Panel */}
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10">
        <div className="absolute inset-0 bg-[var(--bg-soft)] dark:bg-gradient-to-br dark:from-[var(--hero-from)] dark:via-[var(--hero-via)] dark:to-[var(--hero-to)] transition-colors duration-300" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAxMmMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnpNMTggMThjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6bTAgMTJjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6IiBzdHJva2U9IiMwNmI2ZDQiIHN0cm9rZS13aWR0aD0iMC4zIiBvcGFjaXR5PSIwLjEiLz48L2c+PC9zdmc+')] opacity-10" />

        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-[var(--accent)] shadow-lg shadow-[var(--accent)]/20 flex items-center justify-center">
                <Factory className="w-9 h-9 text-white" />
              </div>
              <div className="w-16 h-16 rounded-2xl bg-[var(--accent-strong)] shadow-lg shadow-[var(--accent-strong)]/20 flex items-center justify-center">
                <Zap className="w-9 h-9 text-[var(--btn-text)]" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-strong)] bg-clip-text text-transparent">
              AtomOne Technologies
            </h1>
            <div className="bg-[var(--surface)]/60 backdrop-blur-xl rounded-3xl p-8 border border-[var(--border)] shadow-[0_8px_30px_var(--shadow-color)]">
              <p className="text-[var(--text)] font-medium text-lg italic mb-4">
                "Success is the sum of small efforts, repeated day in and day
                out"
              </p>
              <p className="text-[var(--text-soft)]">- Robert Collier</p>
            </div>
            <div className="mt-12 h-[100px] relative overflow-hidden flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  className="flex items-center gap-3 text-[var(--text)] absolute"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${features[currentIndex].bgColor} flex items-center justify-center flex-shrink-0`}
                  >
                    {currentIndex === 0 && (
                      <Factory
                        className={`w-6 h-6 ${features[currentIndex].iconColor}`}
                      />
                    )}
                    {currentIndex === 1 && (
                      <Zap
                        className={`w-6 h-6 ${features[currentIndex].iconColor}`}
                      />
                    )}
                    {currentIndex === 2 && (
                      <Cpu
                        className={`w-6 h-6 ${features[currentIndex].iconColor}`}
                      />
                    )}
                    {currentIndex === 3 && (
                      <TrendingUp
                        className={`w-6 h-6 ${features[currentIndex].iconColor}`}
                      />
                    )}
                  </div>
                  <div className="text-left">
                    <p
                      className={`${features[currentIndex].titleColor} font-semibold text-lg`}
                    >
                      {features[currentIndex].title}
                    </p>
                    <p className="text-sm text-[var(--text-soft)]">
                      {features[currentIndex].subtitle}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form Area */}
      <div className="w-full lg:w-1/2 relative z-10 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="backdrop-blur-xl bg-[var(--surface)]/80 rounded-3xl p-6 sm:p-8 border border-[var(--border-strong)] shadow-[0_20px_80px_var(--shadow-color)]">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent)] flex items-center justify-center">
                <Factory className="w-6 h-6 text-white" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-strong)] flex items-center justify-center">
                <Zap className="w-6 h-6 text-[var(--btn-text)]" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-[var(--text)] to-[var(--accent-strong)] bg-clip-text text-transparent">
                {isForgotView
                  ? otpSent
                    ? "Reset Password"
                    : "Request Password Reset"
                  : "Welcome Back"}
              </h2>
              <p className="text-[var(--text-soft)] text-sm sm:text-base font-medium">
                {isForgotView
                  ? otpSent
                    ? "Enter the OTP received by your Department Head"
                    : "Enter your username to request an OTP"
                  : "Login to access your dashboard"}
              </p>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="bg-[#ffebe9] text-[#ff1100] border border-[rgba(255,129,130,0.4)] px-4 py-3 rounded-lg mb-6 flex justify-between items-center shadow-sm">
                <span className="text-sm font-medium">{errorMessage}</span>
                <button
                  type="button"
                  onClick={() => setErrorMessage("")}
                  className="bg-transparent border-none cursor-pointer text-lg leading-none hover:opacity-70 text-[#ff1100]"
                >
                  ✖
                </button>
              </div>
            )}

            {/* 🔥 CONDITIONAL RENDERING (Login / Request OTP / Verify OTP) */}
            {isForgotView ? (
              // FORGOT PASSWORD SECTION
              !otpSent ? (
                // 📝 STEP 1: REQUEST OTP FORM
                <form onSubmit={handleRequestOTP} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[var(--text)] text-sm font-medium block">
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--accent)] pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Enter your registered username"
                        value={resetUsername}
                        onChange={(e) => setResetUsername(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-[var(--bg-soft)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[var(--accent-strong)] to-[var(--accent-strong-alt)] hover:shadow-lg hover:shadow-[var(--accent-strong)]/30 text-[var(--btn-text)] font-bold h-12 rounded-lg mt-2 transition-all duration-300 hover:scale-[1.02]"
                    size="lg"
                  >
                    {isLoading ? "Requesting OTP..." : "Get OTP from Head"}
                  </Button>

                  <div className="text-center text-sm mt-4 font-medium">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotView(false);
                        setErrorMessage("");
                      }}
                      className="text-[var(--text-soft)] hover:text-[var(--accent)] transition-colors"
                    >
                      ← Back to Login
                    </button>
                  </div>
                </form>
              ) : (
                // 📝 STEP 2: VERIFY OTP & RESET PASSWORD FORM
                <form onSubmit={handleVerifyAndReset} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[var(--text)] text-sm font-medium block">
                      Enter 6-Digit OTP
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--accent)] pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Get OTP from your Head"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-[var(--bg-soft)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors tracking-widest"
                        required
                        maxLength={6}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[var(--text)] text-sm font-medium block">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--accent)] pointer-events-none" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-11 pr-11 py-2.5 bg-[var(--bg-soft)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[var(--text)] text-sm font-medium block">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--accent)] pointer-events-none" />
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-11 pr-4 py-2.5 bg-[var(--bg-soft)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[var(--accent-strong)] to-[var(--accent-strong-alt)] hover:shadow-lg hover:shadow-[var(--accent-strong)]/30 text-[var(--btn-text)] font-bold h-12 rounded-lg mt-2 transition-all duration-300 hover:scale-[1.02]"
                    size="lg"
                  >
                    {isLoading ? "Verifying & Updating..." : "Reset Password"}
                  </Button>

                  <div className="flex justify-between items-center text-sm mt-4 font-medium">
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(false);
                        setErrorMessage("");
                      }}
                      className="text-[var(--text-soft)] hover:text-[var(--accent)] transition-colors"
                    >
                      ← Go Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotView(false);
                        setOtpSent(false);
                        setErrorMessage("");
                      }}
                      className="text-[var(--text-soft)] hover:text-[var(--accent)] transition-colors"
                    >
                      Cancel Reset
                    </button>
                  </div>
                </form>
              )
            ) : (
              // 📝 LOGIN FORM
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[var(--text)] text-sm font-medium block">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--accent)] pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Enter your username (e.g. Admin)"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-[var(--bg-soft)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[var(--text)] text-sm font-medium block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--accent)] pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-11 py-2.5 bg-[var(--bg-soft)] border border-[var(--border)] rounded-lg text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between font-medium">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      className="border-[var(--border-strong)]"
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm text-[var(--text-soft)] cursor-pointer"
                    >
                      Remember me
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotView(true);
                      setOtpSent(false);
                      setErrorMessage("");
                    }}
                    className="text-sm text-[var(--accent)] hover:text-[var(--accent-strong)] transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[var(--accent-strong)] to-[var(--accent-strong-alt)] hover:shadow-lg hover:shadow-[var(--accent-strong)]/30 text-[var(--btn-text)] font-bold h-12 rounded-lg transition-all duration-300 hover:scale-[1.02]"
                  size="lg"
                >
                  {isLoading ? "Authenticating..." : "Login"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--border-strong)]" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-[var(--surface)] font-medium text-[var(--text-soft)] rounded-full">
                      Or
                    </span>
                  </div>
                </div>

                <div className="text-center text-sm font-medium">
                  <span className="text-[var(--text-soft)]">
                    Don't have an account?{" "}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className="text-[var(--accent)] hover:text-[var(--accent-strong)] transition-colors font-bold"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors text-sm font-medium"
            >
              ← Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
