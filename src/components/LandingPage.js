import { useNavigate } from "react-router-dom";
import {
  Factory,
  Award,
  Shield,
  Lightbulb,
  Heart,
  Eye,
  CheckCircle,
  Camera,
  Gauge,
  Database,
  Bell,
  Cpu,
  Wrench,
  ClipboardCheck,
  Cog,
  Menu,
  X,
} from "lucide-react";
import {
  BsPeopleFill,
  BsBuilding,
  BsGearFill,
} from "react-icons/bs";
import { Mail, Phone, Clock, Linkedin, Twitter, Youtube } from "lucide-react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState } from "react";
import logo_head from "../logo_head.png";
import TravelCarousel from "./TravelCarousel";
import ValueCardsSection from "./ValueCardsSection";
import ProductsSection from "./ProductsSection";
export default function LandingPage() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Parallax and scroll effects
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  const coreValues = [
    { icon: Lightbulb, label: "Innovation", color: "cyan" },
    { icon: Award, label: "Excellence", color: "yellow" },
    { icon: Shield, label: "Integrity", color: "cyan" },
    { icon: Eye, label: "Transparency", color: "yellow" },
    { icon: CheckCircle, label: "Accountability", color: "cyan" },
    { icon: Heart, label: "Social Responsibility", color: "yellow" },
  ];

  const technologies = [
  {
    icon: Camera,
    title: "AI-Powered Visual Inspection",
    description:
      "Automated NG (Not Good) and OK part detection with AI camera system",
    subtitle: "Real-time quality verification on every machine",
    image: "./card1.png",
  },
  {
    icon: Gauge,
    title: "Real-Time Machine Intelligence",
    description:
      "Live monitoring: Shut Height, Tool ID, Machine Count",
    subtitle: "Instant email alerts for any parameter changes",
    image: "./card2.png",
  },
  {
    icon: Database,
    title: "Comprehensive Data Tracking",
    description:
      "Live counts: Machine-wise, Part-wise, Customer-wise",
    subtitle: "Complete visibility from everywhere, anytime",
    image: "./card3.png",
  },
  {
    icon: Bell,
    title: "Intelligent Alert System",
    description:
      "Automated email notifications for tool changes, height adjustments",
    subtitle: "Proactive maintenance alerts",
    image: "./card4.png",
  },
];

  const teams = [
    { icon: Cpu, label: "IT & IoT Team" },
    { icon: Factory, label: "Production Team" },
    { icon: Wrench, label: "Maintenance Team" },
    { icon: ClipboardCheck, label: "Quality Team" },
    { icon: Cog, label: "Tool Team" },
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const buttonHover = {
    rest: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  // Section Ref for scroll animations
  const SectionWrapper = ({ children, delay = 0, className = "" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {
      once: false,
      amount: 0.2,
      margin: "-100px 0px -100px 0px",
    });

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={fadeInUp}
        transition={{ delay }}
        className={className}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f1f5f9] overflow-x-hidden">
      {/* Hero Section with Parallax */}
      <motion.div
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative bg-gradient-to-br from-[#1e3a8a] via-[#1e293b] to-[#0f172a] overflow-hidden min-h-screen"
      >
        {/* Animated Background with floating elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -20, 30, 0],
              scale: [1, 1.1, 0.9, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 w-48 md:w-72 h-48 md:h-72 bg-[#06b6d4] rounded-full mix-blend-multiply filter blur-xl opacity-30"
          />
          <motion.div
            animate={{
              x: [0, -40, 20, 0],
              y: [0, 30, -10, 0],
              scale: [1, 0.8, 1.2, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute top-40 right-10 w-48 md:w-72 h-48 md:h-72 bg-[#fbbf24] rounded-full mix-blend-multiply filter blur-xl opacity-30"
          />
          <motion.div
            animate={{
              x: [0, 50, -30, 0],
              y: [0, -30, 40, 0],
              scale: [1, 1.2, 0.7, 1],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute -bottom-8 left-1/2 w-48 md:w-72 h-48 md:h-72 bg-[#10b981] rounded-full mix-blend-multiply filter blur-xl opacity-30"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(6, 182, 212, 0.03) 35px, rgba(6, 182, 212, 0.03) 70px), repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(251, 191, 36, 0.03) 35px, rgba(251, 191, 36, 0.03) 70px)",
            }}
          />
        </div>

        {/* Navigation - Transparent with blur only */}
        <nav className="relative z-10 flex items-center justify-between px-6 sm:px-8 md:px-12 py-4 md:py-5 ">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 3 }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                className="flex items-center"
              >
                <img
                  src={logo_head}
                  alt="AtomOne Logo"
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain"
                />
                <Factory className="hidden" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#f1f5f9] to-[#94a3b8] text-transparent bg-clip-text tracking-tight"
              >
                AtomOne
              </motion.span>
            </div>
          </motion.div>

          {/* Desktop Navigation - Enhanced Buttons */}
          <div className="hidden sm:flex gap-4 md:gap-5">
            <motion.button
              variants={buttonHover}
              initial="rest"
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base font-medium bg-transparent backdrop-blur-sm border-2 border-[#06b6d4] text-[#06b6d4] rounded-xl  transition-all duration-300 hover:shadow-lg hover:shadow-[#06b6d4]/50 hover:border-transparent"
            >
              Login
            </motion.button>
            <motion.button
              variants={buttonHover}
              initial="rest"
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/signup")}
              className="px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base font-medium bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-[#0f172a] rounded-xl hover:shadow-2xl hover:shadow-[#fbbf24]/50 transition-all duration-300 hover:scale-105"
            >
              Sign Up
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2.5 bg-[#06b6d4]/10 backdrop-blur-sm rounded-xl border border-[#06b6d4]/30 hover:bg-[#06b6d4]/20 transition-all duration-300"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-[#06b6d4]" />
            ) : (
              <Menu className="w-5 h-5 text-[#06b6d4]" />
            )}
          </button>
        </nav>

        {/* Mobile Menu - Enhanced */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-[72px] left-0 right-0 z-20 sm:hidden bg-[#0f172a]/95 backdrop-blur-xl border-b border-[#06b6d4]/30 p-5 shadow-xl"
          >
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  navigate("/login");
                  setMobileMenuOpen(false);
                }}
                className="w-full px-6 py-3 bg-[#06b6d4]/10 border-2 border-[#06b6d4] text-[#06b6d4] rounded-xl hover:bg-[#06b6d4] hover:text-[#0f172a] transition-all duration-300 font-medium"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate("/signup");
                  setMobileMenuOpen(false);
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-[#0f172a] rounded-xl hover:shadow-2xl hover:shadow-[#fbbf24]/50 transition-all duration-300 font-medium"
              >
                Sign Up
              </button>
            </div>
          </motion.div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16 sm:py-24 md:py-32 text-center">
          {/* Badge Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            className="mb-4 sm:mb-6 inline-block"
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#06b6d4]/10 backdrop-blur-sm border border-[#06b6d4]/30 rounded-full text-[#06b6d4] inline-flex items-center gap-1 sm:gap-2"
            >
              <motion.span className="inline-block text-sm sm:text-base">
                🚀
              </motion.span>
              <span className="hidden xs:inline">
                Industry 4.0 Smart Factory Platform
              </span>
              <span className="xs:hidden">Industry 4.0</span>
            </motion.span>
          </motion.div>

          {/* Main Heading - Responsive Text */}
          <div className="mb-6 sm:mb-8">
            <motion.h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl text-[#f1f5f9] tracking-tight leading-tight">
              {["Where", "Technology", "Speaks", "Louder,"].map(
                (word, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 50, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.4 + index * 0.1,
                      type: "spring",
                      stiffness: 100,
                    }}
                    className="inline-block mr-2 sm:mr-3"
                  >
                    {word}
                  </motion.span>
                ),
              )}
              <br />
              <motion.span
                initial={{ opacity: 0, backgroundPosition: "0% 50%" }}
                animate={{ opacity: 1, backgroundPosition: "100% 50%" }}
                transition={{ duration: 1.2, delay: 0.9, ease: "easeOut" }}
                className="bg-gradient-to-r from-[#06b6d4] via-[#fbbf24] to-[#10b981] text-transparent bg-clip-text bg-[length:200%_auto] inline-block text-2xl sm:text-4xl md:text-6xl lg:text-7xl"
              >
                Every cut Delivers Perfection.
              </motion.span>
            </motion.h1>
          </div>

          {/* Subtitle - Responsive */}
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-base sm:text-xl md:text-2xl lg:text-3xl text-[#94a3b8] mb-8 sm:mb-12 md:mb-16 px-4"
          >
            <motion.span
              initial={{ width: 0 }}
              animate={{ width: "auto" }}
              transition={{ duration: 1, delay: 1.4 }}
              className="inline-block overflow-hidden whitespace-normal sm:whitespace-nowrap"
            >
              25+ Years of Metal Stamping Excellence | Industry 4.0 Leader
            </motion.span>
          </motion.p>

          {/* Statistics Bar - Responsive Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mt-12 sm:mt-16 md:mt-20"
          >
            {[
              {
                icon: BsPeopleFill,
                value: "400+",
                label: "Employees",
                color: "cyan",
                delay: 1.6,
              },
              {
                icon: BsBuilding,
                value: "3",
                label: "Units",
                color: "yellow",
                delay: 1.7,
              },
              {
                icon: BsGearFill,
                value: "150+",
                label: "Presses",
                color: "green",
                delay: 1.8,
              },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              const borderColor =
                stat.color === "cyan"
                  ? "border-[#06b6d4]/30 hover:border-[#06b6d4]"
                  : stat.color === "yellow"
                  ? "border-[#fbbf24]/30 hover:border-[#fbbf24]"
                  : "border-[#10b981]/30 hover:border-[#10b981]";
              const shadowColor =
                stat.color === "cyan"
                  ? "shadow-[#06b6d4]/20"
                  : stat.color === "yellow"
                  ? "shadow-[#fbbf24]/20"
                  : "shadow-[#10b981]/20";
              const iconColor =
                stat.color === "cyan"
                  ? "text-[#06b6d4]"
                  : stat.color === "yellow"
                  ? "text-[#fbbf24]"
                  : "text-[#10b981]";
              const bgHover =
                stat.color === "cyan"
                  ? "group-hover:bg-[#06b6d4]/20"
                  : stat.color === "yellow"
                  ? "group-hover:bg-[#fbbf24]/20"
                  : "group-hover:bg-[#10b981]/20";
              return (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ delay: stat.delay }}
                  className={`group flex items-center gap-2 sm:gap-4 bg-gradient-to-br from-[#1e293b]/80 to-[#1e293b]/40 backdrop-blur-xl px-4 sm:px-6 md:px-8 py-3 sm:py-5 md:py-6 rounded-xl sm:rounded-2xl border ${borderColor} transition-all duration-300  ${shadowColor}`}
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`p-2 sm:p-3 bg-[#06b6d4]/10 rounded-lg sm:rounded-xl ${bgHover} transition-all duration-300`}
                  >
                    <Icon
                      className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 ${iconColor}`}
                    />
                  </motion.div>
                  <div className="text-left">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: stat.delay + 0.2 }}
                      className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#f1f5f9] mb-0.5 sm:mb-1"
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-xs sm:text-sm text-[#94a3b8]">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 2 }}
            className="absolute bottom-5 sm:bottom-10 left-1/2 -translate-x-1/2 cursor-pointer"
            onClick={() =>
              window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
            }
          >
            <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-[#06b6d4] rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-2 sm:h-3 bg-[#06b6d4] rounded-full mt-2"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Rest of your sections remain the same... */}
      {/* Vision Section (UPAR) */}

      <ValueCardsSection />

      {/* Mission Section (NICHE) */}

      {/* Core Values */}
      <SectionWrapper>
        <div className="relative bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] py-12 sm:py-16">
          <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: false, amount: 0.3 }}
              className="text-2xl sm:text-3xl md:text-4xl mb-8 sm:mb-12 text-center text-[#f1f5f9]"
            >
              Core Values
            </motion.h2>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6"
            >
              {coreValues.map((value, index) => {
                const Icon = value.icon;
                const colorClass =
                  value.color === "cyan"
                    ? "text-[#06b6d4] bg-[#06b6d4]/10"
                    : "text-[#fbbf24] bg-[#fbbf24]/10";
                return (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    whileHover={{ y: -8, scale: 1.05 }}
                    className="text-center"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.4 }}
                      className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 ${colorClass} rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4`}
                    >
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                    </motion.div>
                    <div className="text-xs sm:text-sm md:text-base text-[#f1f5f9]">
                      {value.label}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </SectionWrapper>

      {/* Advanced Technology Section */}
      <SectionWrapper>
        <div className="relative bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] py-16 sm:py-20 md:py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <motion.div
              animate={{ x: [0, 50, -30, 0], y: [0, -30, 20, 0] }}
              transition={{ duration: 20, repeat: Infinity }}
              className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[#06b6d4] rounded-full filter blur-3xl"
            />
            <motion.div
              animate={{ x: [0, -40, 30, 0], y: [0, 40, -20, 0] }}
              transition={{ duration: 18, repeat: Infinity, delay: 1 }}
              className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[#fbbf24] rounded-full filter blur-3xl"
            />
          </div>

          <div className="relative z-10 max-w-full mx-auto px-4 sm:px-6 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: false, amount: 0.3 }}
              className="text-center mb-8 sm:mb-12 md:mb-16"
            >
              <div className="inline-block mb-4 sm:mb-6">
                <span className="px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm bg-gradient-to-r from-[#06b6d4]/20 to-[#fbbf24]/20 backdrop-blur-sm border border-[#06b6d4]/30 rounded-full text-[#06b6d4]">
                  ⚡ Powered by AI & IoT
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 text-[#f1f5f9] px-4">
                Industry 4.0 Smart Factory
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl bg-gradient-to-r from-[#06b6d4] to-[#fbbf24] text-transparent bg-clip-text">
                Advanced Monitoring System
              </p>
            </motion.div>

            {/* <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
            >
              {technologies.map((tech, index) => {
                const Icon = tech.icon;
                return (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    whileHover="hover"
                    className="group relative bg-gradient-to-br from-[#1e293b]/80 to-[#1e293b]/40 backdrop-blur-xl rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-[#06b6d4]/20 hover:border-[#06b6d4] transition-all duration-500 hover:shadow-2xl hover:shadow-[#06b6d4]/20"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#06b6d4]/0 to-[#06b6d4]/5 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex flex-col sm:flex-row items-start gap-3 sm:gap-5">
                      <motion.div
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        className="p-3 sm:p-4 bg-gradient-to-br from-[#06b6d4]/20 to-[#06b6d4]/5 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#06b6d4]/20"
                      >
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#06b6d4]" />
                      </motion.div>
                      <div>
                        <h3 className="text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3 text-[#f1f5f9] group-hover:text-[#06b6d4] transition-colors duration-300">
                          {tech.title}
                        </h3>
                        <p className="text-sm sm:text-base text-[#94a3b8] mb-2 sm:mb-3 leading-relaxed">
                          {tech.description}
                        </p>
                        <p className="text-xs sm:text-sm text-[#06b6d4] flex items-center gap-2">
                          <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="w-1.5 h-1.5 bg-[#06b6d4] rounded-full"
                          />
                          {tech.subtitle}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div> */}
            <motion.div
  variants={staggerContainer}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: false, amount: 0.1 }}
  className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
>
  {technologies.map((tech, index) => {
    const Icon = tech.icon;

    return (
      <motion.div
        key={index}
        variants={fadeInUp}
        whileHover={{
          y: -6,
          scale: 1.01,
        }}
        className="group relative overflow-hidden bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 backdrop-blur-xl rounded-2xl p-6 border border-[#06b6d4]/20 hover:border-[#06b6d4]/60 transition-all duration-500"
      >
        {/* Hover Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#06b6d4]/0 via-[#06b6d4]/5 to-[#06b6d4]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative flex flex-col lg:flex-row items-center gap-6">
          
          {/* Left Content */}
          <div className="flex-1 w-full">
            <div className="flex items-start gap-4">
              
              <motion.div
                whileHover={{
                  rotate: 10,
                  scale: 1.1,
                }}
                className="p-4 bg-gradient-to-br from-[#06b6d4]/20 to-[#06b6d4]/5 rounded-xl flex items-center justify-center flex-shrink-0 "
              >
                <Icon className="w-8 h-8 text-[#06b6d4]" />
              </motion.div>

              <div>
                <h3 className="text-xl lg:text-2xl font-semibold text-[#f1f5f9] group-hover:text-[#06b6d4] transition-colors duration-300 mb-2">
                  {tech.title}
                </h3>

                <p className="text-[#94a3b8] leading-relaxed mb-3">
                  {tech.description}
                </p>

                <p className="text-sm text-[#06b6d4] flex items-center gap-2">
                  <motion.span
                    animate={{
                      scale: [1, 1.3, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                    className="w-2 h-2 rounded-full bg-[#06b6d4]"
                  />
                  {tech.subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <motion.div
            whileHover={{
              scale: 1.05,
            }}
            className="hidden lg:block w-[240px] h-[150px] flex-shrink-0 overflow-hidden rounded-xl border border-[#06b6d4]/20"
          >
            <img
              src={tech.image}
              alt={tech.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </motion.div>
        </div>
      </motion.div>
    );
  })}
</motion.div>
          </div>
        </div>
      </SectionWrapper>

      {/* Team Excellence */}
      <SectionWrapper>
        <div className="relative bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] py-12 sm:py-16">
          <div className="max-w-full mx-auto px-4 sm:px-6 md:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: false, amount: 0.3 }}
              className="text-2xl sm:text-3xl md:text-4xl mb-8 sm:mb-12 text-center text-[#f1f5f9]"
            >
              Our Expert Teams
            </motion.h2>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6"
            >
              {teams.map((team, index) => {
                const Icon = team.icon;
                return (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    whileHover={{ y: -8, scale: 1.05 }}
                    className="bg-[#1e293b] rounded-xl p-4 sm:p-5 md:p-6 text-center border border-[#06b6d4]/20 hover:border-[#fbbf24] transition-colors"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#06b6d4]/10 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4"
                    >
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#06b6d4]" />
                    </motion.div>
                    <div className="text-xs sm:text-sm md:text-base text-[#f1f5f9]">
                      {team.label}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </SectionWrapper>

      {/* <TravelCarousel /> */}

      {/* Digital Impact */}

      <SectionWrapper>
        <div className="relative bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] py-10 lg:py-14 mt-0 overflow-hidden">
          {/* Ambient Glow */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#fbbf24]/5 blur-3xl pointer-events-none"
          />

          <div className="max-w-auto mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7 }}
              className="
          relative
          overflow-hidden
          rounded-[32px]
          border
          border-[#fbbf24]/30
          bg-gradient-to-r
          from-[#172554]
          via-[#1e293b]
          to-[#172554]
          backdrop-blur-xl
          px-6
          sm:px-10
          lg:px-14
          py-6
          lg:py-8
          shadow-[0_20px_80px_rgba(0,0,0,0.35)]
        "
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 h-[3px] w-full bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent" />

              {/* Grid Overlay */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: `
              linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
            `,
                  backgroundSize: "50px 50px",
                }}
              />

              <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-6 lg:mb-8">
                  <div className="uppercase tracking-[0.35em] text-xs text-[#fbbf24]/80 mb-4">
                    Industry 4.0 Performance Metrics
                  </div>

                  <h2
                    className="
                text-3xl
                md:text-4xl
                lg:text-5xl
                font-bold
                bg-gradient-to-r
                from-[#fbbf24]
                via-[#fde68a]
                to-[#fbbf24]
                bg-clip-text
                text-transparent
                mb-4
              "
                  >
                    Digital Transformation Impact
                  </h2>

                  <p className="text-slate-400 text-base lg:text-lg max-w-3xl mx-auto">
                    Measurable results achieved through smart manufacturing,
                    automation, real-time visibility, and continuous
                    improvement.
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      value: "15-20%",
                      label: "Machine Utilization",
                      sub: "Increment",
                    },
                    {
                      value: "8-12%",
                      label: "Operator Efficiency",
                      sub: "Increase",
                    },
                    {
                      value: "10-15%",
                      label: "Quality Improvement",
                      sub: "Reduction in Defects",
                    },
                    {
                      value: "24/7",
                      label: "Real-Time Data",
                      sub: "Visibility",
                    },
                  ].map((stat, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{
                        y: -8,
                        scale: 1.03,
                      }}
                      transition={{ duration: 0.25 }}
                      className={`
                  relative
                  text-center
                  px-4
                  py-3
                  ${idx !== 3 ? "lg:border-r lg:border-white/10" : ""}
                `}
                    >
                      {/* Glow */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
                      </div>

                      <div className="relative">
                        <div
                          className="
                      whitespace-nowrap
                      text-4xl
                      sm:text-5xl
                      lg:text-6xl
                      xl:text-7xl
                      font-bold
                      bg-gradient-to-br
                      from-emerald-300
                      via-emerald-400
                      to-emerald-500
                      bg-clip-text
                      text-transparent
                      mb-3
                    "
                        >
                          {stat.value}
                        </div>

                        <h3 className="text-white text-base lg:text-lg font-semibold mb-1">
                          {stat.label}
                        </h3>

                        <p className="text-slate-400 text-sm">{stat.sub}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>

      {/* Products Showcase */}
      {/* <SectionWrapper>
        <div className="relative bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: false, amount: 0.3 }}
              className="text-2xl sm:text-3xl md:text-4xl mb-8 sm:mb-12 text-center text-[#f1f5f9]"
            >
              Our Products
            </motion.h2>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
            >
              {products.map((product, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="bg-[#1e293b] rounded-xl p-3 sm:p-4 md:p-6 text-center border border-[#06b6d4]/20 hover:border-[#fbbf24] transition-colors"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.4 }}
                    className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${
                      index % 2 === 0 ? "bg-[#06b6d4]/10" : "bg-[#fbbf24]/10"
                    } rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4`}
                  >
                    <Cog
                      className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${
                        index % 2 === 0 ? "text-[#06b6d4]" : "text-[#fbbf24]"
                      }`}
                    />
                  </motion.div>
                  <div className="text-xs sm:text-sm md:text-base text-[#f1f5f9]">
                    {product}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </SectionWrapper> */}
      <ProductsSection />

      {/* Footer */}
      <footer className="bg-[#0f172a]  border-t border-[#06b6d4]/25 overflow-hidden">
        {/* Animated accent bar */}
        <div className="h-[3px] bg-gradient-to-r from-[#06b6d4] via-[#fbbf24] to-[#06b6d4] bg-[length:200%_100%] animate-shimmer" />

        <div className="max-w- mx-auto px-4 sm:px-6 md:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#06b6d4] to-[#fbbf24] rounded-lg flex items-center justify-center shrink-0">
                  {/* <Zap className="w-5 h-5 text-[#0f172a]" /> */}
                  <img
                    src="/logo1.jpg"
                    alt="Logo"
                    className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                  />
                </div>
                <div>
                  <p className="text-[#E5E7EB] text-base font-medium leading-tight">
                    AtomOne Technologies
                  </p>
                  <p className="text-[#E5E7EB] text-[10px] tracking-widest uppercase">
                    Precision Manufacturing
                  </p>
                </div>
              </div>
              <p className="text-xs text-[#E5E7EB] leading-relaxed border-l-2 border-[#06b6d4] pl-3 mb-4">
                AtomOne Technologies, formerly known as Minda Stampings, was
                founded by Mr. Satish Goyal in 1996. We are a leading
                engineering company specializing in sheet metal fabrication for
                Automotive, Electrical, and Heavy Fabrication sectors globally.
                Equipped with cutting-edge technology, our forward-thinking team
                is committed to mutually beneficial relationships and absolute
                customer satisfaction.
              </p>
              <div className="flex gap-2 flex-wrap">
                {["ISO 9001", "CE Certified", "Since 2010"].map((b) => (
                  <span
                    key={b}
                    className="text-[10px] px-2 py-1 rounded border border-[#06b6d4]/40 text-[#E5E7EB] bg-[#06b6d4]/08 tracking-wide"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-[11px] font-medium uppercase tracking-widest text-[#fbbf24] mb-4 flex items-center gap-2 after:flex-1 after:h-px after:bg-[#fbbf24]/20 after:content-['']">
                Contact
              </h3>
              {[
                {
                  icon: <Mail className="w-3.5 h-3.5" />,
                  text: "visheshgoyal@atomone.in",
                },
                {
                  icon: <Phone className="w-3.5 h-3.5" />,
                  text: "+91-9999761226",
                },
                {
                  icon: <Clock className="w-3.5 h-3.5" />,
                  text: "Mon–Sat, 9 AM–6 PM IST",
                },
              ].map(({ icon, text }) => (
                <div
                  key={text}
                  className="flex items-start gap-2 mb-3 text-[#E5E7EB] text-xs hover:text-[#e2e8f0] transition-colors group"
                >
                  <div className="w-6 h-6 rounded-md bg-[#06b6d4]/10 border border-[#06b6d4]/20 flex items-center justify-center text-[#E5E7EB] shrink-0 mt-0.5">
                    {icon}
                  </div>
                  <span className="leading-relaxed">{text}</span>
                </div>
              ))}
            </div>

            {/* Plants */}
            <div>
              <h3 className="text-[11px] font-medium uppercase tracking-widest text-[#fbbf24] mb-4 flex items-center gap-2 after:flex-1 after:h-px after:bg-[#fbbf24]/20 after:content-['']">
                Plants
              </h3>
              {[
                { name: "Gujarat Plant", sub: "Western India Operations" },
                { name: "Haryana Plant", sub: "North India Operations" },
              ].map(({ name, sub }) => (
                <div
                  key={name}
                  className="bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2.5 mb-2 hover:bg-[#06b6d4]/07 hover:border-[#06b6d4]/25 transition-all"
                >
                  <p className="text-xs text-[#e2e8f0] font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4] animate-pulse inline-block" />
                    {name}
                  </p>
                  <p className="text-[11px] text-[#E5E7EB] mt-0.5">{sub}</p>
                </div>
              ))}
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-[11px] font-medium uppercase tracking-widest text-[#fbbf24] mb-4 flex items-center gap-2 after:flex-1 after:h-px after:bg-[#fbbf24]/20 after:content-['']">
                Stay Updated
              </h3>
              <p className="text-[11.5px] text-[#E5E7EB] leading-relaxed mb-3">
                Capabilities updates, new equipment & industry insights.
              </p>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-xs text-[#e2e8f0] placeholder-[#475569] outline-none focus:border-[#06b6d4]/50 mb-2"
              />
              <button className="w-full py-2 px-3 bg-[#06b6d4]/15 border border-[#06b6d4]/40 rounded-md text-[#06b6d4] text-xs font-medium uppercase tracking-wider hover:bg-[#06b6d4]/25 hover:border-[#06b6d4]/70 transition-all active:scale-[0.98]">
                Subscribe
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.06] mb-5" />

          {/* Bottom bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11.5px] text-[#475569]">
              © 2025{" "}
              <span className="text-[#06b6d4]">AtomOne Technologies</span>. All
              rights reserved.
            </p>
            <div className="flex gap-4">
              {["Privacy Policy", "Quality Standards", "Careers"].map((l) => (
                <a
                  key={l}
                  href="https://www.atomone.in/careers"
                  className="text-[11.5px] text-[#475569] hover:text-[#94a3b8] transition-colors"
                >
                  {l}
                </a>
              ))}
            </div>
            <div className="flex gap-2">
              {[
                {
                  icon: <Linkedin className="w-3.5 h-3.5" />,
                  label: "LinkedIn",
                },
                { icon: <Twitter className="w-3.5 h-3.5" />, label: "Twitter" },
                { icon: <Youtube className="w-3.5 h-3.5" />, label: "YouTube" },
              ].map(({ icon, label }) => (
                <a
                  key={label}
                  href="https://in.linkedin.com/company/atomone-technologies"
                  aria-label={label}
                  className="w-7 h-7 rounded-md border border-white/10 bg-white/[0.04] flex items-center justify-center text-[#64748b] hover:bg-[#06b6d4]/12 hover:text-[#06b6d4] hover:border-[#06b6d4]/30 transition-all"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
//end here
