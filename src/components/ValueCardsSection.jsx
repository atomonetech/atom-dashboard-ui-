import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Globe, Target, ShieldCheck, Users } from "lucide-react";
import { GiBullseye } from "react-icons/gi";
import { TbTelescope } from "react-icons/tb";
import { MdVerified } from "react-icons/md";
import { FaHandshake } from "react-icons/fa";
const cards = [
  {
    tag: "Our Mission",
    title: "Precision-Driven Excellence",
    accent: "#f97316", // Orange
    description:
      "Delivering world-class automotive components through relentless precision...",
    pills: ["Zero Defect", "On-Time Delivery", "Innovation"],
    Icon: GiBullseye,
    illustration: <MissionIllustration />,
  },
  {
    tag: "Our Vision",
    title: "Global Partnership Leader",
    accent: "#38bdf8", // Sky Blue
    description: "To be the preferred Tier 1 partner of OEMs worldwide...",
    pills: ["Global Reach", "OEM Preferred", "Leadership"],
    Icon: TbTelescope,
    illustration: <VisionIllustration />,
  },
  {
    tag: "Quality Policy",
    title: "Uncompromising Standards",
    accent: "#22c55e", // Green
    description: "Committed to ISO-certified processes...",
    pills: ["ISO Certified", "IATF 16949", "Kaizen"],
    Icon: MdVerified,
    illustration: <QualityIllustration />,
  },
  {
    tag: "Core Values",
    title: "People, Planet & Progress",
    accent: "#a78bfa", // Violet
    description: "Fostering a culture of integrity...",
    pills: ["Integrity", "Sustainability", "Teamwork"],
    Icon: FaHandshake,
    illustration: <ValuesIllustration />,
  },
];

function TiltCard({ card }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), {
    stiffness: 300,
    damping: 30,
  });
  const shineX = useTransform(x, [-0.5, 0.5], [0, 100]);
  const shineY = useTransform(y, [-0.5, 0.5], [0, 100]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: 700,
      }}
      whileHover={{
        scale: 1.05,
        y: -10,
        zIndex: 10,
        borderColor: card.accent,
        boxShadow: `0 25px 80px rgba(0,0,0,0.35), 0 0 30px ${card.accent}40`,
      }}
      transition={{ scale: { duration: 0.2 } }}
      className="relative overflow-hidden group bg-gradient-to-br from-[#1e293b]/90 to-[#0f172a]/70 backdrop-blur-xl border border-[#fbbf24]/20 hover:border-[#fbbf24]/70 rounded-2xl p-4 cursor-pointer transition-[border-color,box-shadow] duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_30px_rgba(251,191,36,0.15)]"
    >
      <div
        className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
        style={{
          background: `linear-gradient(90deg, ${card.accent}, transparent)`,
          boxShadow: `0 0 12px ${card.accent}`,
        }}
      />
      {/* Shine layer */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: useTransform(
            [shineX, shineY],
            ([sx, sy]) =>
              `radial-gradient(circle at ${sx}% ${sy}%, rgba(251,191,36,0.15) 0%, transparent 65%)`,
          ),
        }}
      />

      {/* Illustration */}
      <div className="w-full h-20 rounded-xl overflow-hidden mb-3 bg-[#fbbf24]/5 flex items-center justify-center">
        {card.illustration}
      </div>

      {/* Tag */}
      {/* <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fbbf24]/10 rounded-full mb-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
        <span className="text-[10px] font-semibold tracking-widest uppercase text-[#fbbf24]">
          {card.tag}
        </span>
      </div> */}
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3"
        style={{
          backgroundColor: `${card.accent}20`,
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: card.accent }}
        />

        <span
          className="text-[10px] font-semibold tracking-widest uppercase"
          style={{ color: card.accent }}
        >
          {card.tag}
        </span>
      </div>

      <h3 className="text-xl font-bold mb-3 text-[#f1f5f9] font-bold tracking-tight ">
        {card.title}
      </h3>
      <p className="text-sm leading-6 text-slate-300 ">{card.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {card.pills.map((pill) => (
          <span
            key={pill}
            className="text-[10px] px-2 py-1 rounded-md bg-white/5 border border-white/8 text-[#cbd5e1]"
          >
            {pill}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// SVG Illustrations — paste these as separate components above TiltCard

function MissionIllustration() {
  return (
    <svg viewBox="0 0 200 110" className="w-full h-full">
      <circle
        cx="100"
        cy="55"
        r="36"
        fill="none"
        stroke="rgba(251,191,36,0.25)"
        strokeWidth="1.5"
      />
      <circle
        cx="100"
        cy="55"
        r="24"
        fill="none"
        stroke="rgba(251,191,36,0.45)"
        strokeWidth="1.5"
      />
      <circle
        cx="100"
        cy="55"
        r="12"
        fill="none"
        stroke="#fbbf24"
        strokeWidth="2"
      />
      <circle cx="100" cy="55" r="5" fill="#fbbf24" />

      <line
        x1="100"
        y1="10"
        x2="100"
        y2="28"
        stroke="#fbbf24"
        strokeWidth="2"
      />
      <line
        x1="100"
        y1="82"
        x2="100"
        y2="100"
        stroke="#fbbf24"
        strokeWidth="2"
      />

      <line x1="55" y1="55" x2="73" y2="55" stroke="#fbbf24" strokeWidth="2" />
      <line
        x1="127"
        y1="55"
        x2="145"
        y2="55"
        stroke="#fbbf24"
        strokeWidth="2"
      />

      <circle
        cx="100"
        cy="55"
        r="40"
        fill="none"
        stroke="rgba(251,191,36,0.1)"
        strokeDasharray="4 4"
      />
    </svg>
  );
}

function VisionIllustration() {
  return (
    <svg viewBox="0 0 200 110" className="w-full h-full">
      <line
        x1="40"
        y1="72"
        x2="160"
        y2="72"
        stroke="rgba(251,191,36,0.35)"
        strokeWidth="1.5"
      />

      <path
        d="M60 72 Q100 25 140 72"
        fill="none"
        stroke="#fbbf24"
        strokeWidth="2"
      />

      <circle cx="100" cy="48" r="8" fill="#fbbf24" />

      <path
        d="M100 20 L100 48"
        stroke="rgba(251,191,36,0.5)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />

      <circle
        cx="100"
        cy="48"
        r="20"
        fill="none"
        stroke="rgba(251,191,36,0.2)"
      />

      <circle
        cx="100"
        cy="48"
        r="32"
        fill="none"
        stroke="rgba(251,191,36,0.12)"
      />
    </svg>
  );
}

function QualityIllustration() {
  return (
    <svg viewBox="0 0 200 110" className="w-full h-full">
      <path
        d="M100 25 L135 40 V65 C135 82 118 92 100 100 C82 92 65 82 65 65 V40 Z"
        fill="rgba(251,191,36,0.05)"
        stroke="rgba(251,191,36,0.35)"
        strokeWidth="2"
      />

      <polyline
        points="86,58 97,70 118,46"
        fill="none"
        stroke="#fbbf24"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="100"
        cy="58"
        r="28"
        fill="none"
        stroke="rgba(251,191,36,0.15)"
      />
    </svg>
  );
}

function ValuesIllustration() {
  return (
    <svg viewBox="0 0 200 110" className="w-full h-full">
      <line
        x1="75"
        y1="62"
        x2="100"
        y2="45"
        stroke="rgba(251,191,36,0.4)"
        strokeWidth="2"
      />

      <line
        x1="100"
        y1="45"
        x2="125"
        y2="62"
        stroke="rgba(251,191,36,0.4)"
        strokeWidth="2"
      />

      <line
        x1="75"
        y1="62"
        x2="125"
        y2="62"
        stroke="rgba(251,191,36,0.25)"
        strokeWidth="2"
      />

      <circle
        cx="75"
        cy="62"
        r="10"
        fill="rgba(251,191,36,0.15)"
        stroke="#fbbf24"
      />
      <circle cx="100" cy="45" r="10" fill="#fbbf24" />
      <circle
        cx="125"
        cy="62"
        r="10"
        fill="rgba(251,191,36,0.15)"
        stroke="#fbbf24"
      />

      <circle
        cx="75"
        cy="78"
        r="14"
        fill="none"
        stroke="rgba(251,191,36,0.2)"
      />
      <circle
        cx="100"
        cy="61"
        r="14"
        fill="none"
        stroke="rgba(251,191,36,0.25)"
      />
      <circle
        cx="125"
        cy="78"
        r="14"
        fill="none"
        stroke="rgba(251,191,36,0.2)"
      />
    </svg>
  );
}

// Main section
export default function ValueCardsSection() {
  return (
    <div className="relative min-h-[450px] space-y-4 bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] py-16 px-6 overflow-hidden">
      {/* Ambient orb */}
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#fbbf24] rounded-full filter blur-3xl opacity-[0.06] pointer-events-none"
      />

      <div className="relative z-10  max-w-[1700px] mx-auto">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          style={{ perspective: "1200px" }}
        >
          {cards.map((card, i) => (
            <TiltCard key={i} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
}
