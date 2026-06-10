// ProductsSection.jsx
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings2, Layers3 } from "lucide-react";

const row1Products = [
  {
    name: "Muffler Parts",
    desc: "High-temp exhaust system components with precision weld joints and heat-resistant coatings.",
    tag: "Exhaust Systems",
    color: "amber",
  },
  {
    name: "Chassis Parts",
    desc: "Structural frame components engineered for maximum load-bearing strength and rigidity.",
    tag: "Structural",
    color: "cyan",
  },
  {
    name: "Tubular Parts",
    desc: "Seamless and welded tubes for fluid transfer, frameworks, and roll-cage structures.",
    tag: "Fluid Systems",
    color: "amber",
  },
  {
    name: "Flanges",
    desc: "Custom flanges for pipe connections, pressure containment, and leak-free assemblies.",
    tag: "Connectors",
    color: "cyan",
  },
  {
    name: "Busbars",
    desc: "Copper and aluminium busbars for high-current power distribution in EVs and industry.",
    tag: "Electrical",
    color: "amber",
  },
];

const row2Products = [
  {
    name: "Machined Parts",
    desc: "CNC-machined components with micron-level tolerances for critical assemblies.",
    tag: "Precision CNC",
    color: "cyan",
  },
  {
    name: "Draw Parts",
    desc: "Deep drawn metal parts for complex hollow geometries and seamless enclosures.",
    tag: "Metal Forming",
    color: "amber",
  },
  {
    name: "Custom Components",
    desc: "Bespoke OEM solutions engineered precisely to your design and specification.",
    tag: "OEM Solutions",
    color: "cyan",
  },
  {
    name: "Brake Components",
    desc: "Safety-critical brake system parts validated for performance and durability.",
    tag: "Safety Systems",
    color: "amber",
  },
  {
    name: "Suspension Parts",
    desc: "Damper housings and linkage components machined for ride precision.",
    tag: "Chassis",
    color: "cyan",
  },
];

function ProductCard({ product }) {
  const isAmber = product.color === "amber";
  return (
    <motion.div
      whileHover={{
        rotateY: -8,
        y: -6,
        scale: 1.04,
        transition: { duration: 0.25 },
      }}
      style={{ transformStyle: "preserve-3d", perspective: 600 }}
      className={`flex-shrink-0 w-[200px] sm:w-[220px] relative group
        bg-gradient-to-br from-[#1e293b]/95 to-[#0f172a]/80
        border rounded-2xl p-[18px] cursor-pointer overflow-hidden
        transition-[border-color] duration-300
        ${isAmber
          ? "border-[#fbbf24]/15 hover:border-[#fbbf24]/60"
          : "border-[#06b6d4]/15 hover:border-[#06b6d4]/60"
        }`}
    >
      {/* Glint overlay */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-white/[0.04] to-transparent" />

      {/* Icon */}
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 
          ${isAmber ? "bg-[#fbbf24]/10" : "bg-[#06b6d4]/10"}`}
      >
        {isAmber ? (
          <Settings2 className="w-5 h-5 text-[#fbbf24]" />
        ) : (
          <Layers3 className="w-5 h-5 text-[#06b6d4]" />
        )}
      </div>

      <p className="text-[13px] font-semibold text-[#f1f5f9] mb-1.5">{product.name}</p>
      <p className="text-[11px] leading-relaxed text-[#64748b] mb-3">{product.desc}</p>

      <span
        className={`text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full
          ${isAmber
            ? "bg-[#fbbf24]/10 text-[#fbbf24]"
            : "bg-[#06b6d4]/10 text-[#06b6d4]"
          }`}
      >
        {product.tag}
      </span>
    </motion.div>
  );
}

function InfiniteTrack({ products, direction = "left", speed = 30 }) {
  // Duplicate 4× so the loop is seamless at any viewport
  const doubled = [...products, ...products, ...products, ...products];
  const animClass = direction === "left" ? "animate-scroll-left" : "animate-scroll-right";

  return (
    <div className="relative w-full overflow-hidden py-2 
      before:absolute before:left-0 before:top-0 before:bottom-0 before:w-24 before:z-10
      before:bg-gradient-to-r before:from-[#0f172a] before:to-transparent
      after:absolute after:right-0 after:top-0 after:bottom-0 after:w-24 after:z-10
      after:bg-gradient-to-l after:from-[#0f172a] after:to-transparent"
    >
      <div
        className={`flex gap-4 w-max ${animClass}`}
        style={{ "--speed": `${speed}s` }}
      >
        {doubled.map((p, i) => (
          <ProductCard key={i} product={p} />
        ))}
      </div>
    </div>
  );
}

export default function ProductsSection() {
  return (
      <div className="relative bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] py-16 overflow-hidden">
        {/* Ambient glow */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], x: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#fbbf24] rounded-full filter blur-[120px] opacity-[0.04] pointer-events-none"
        />

        <div className="relative z-10">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: false, amount: 0.3 }}
            className="text-center mb-10 px-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#fbbf24]/10 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#fbbf24]">
                What We Make
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#f1f5f9] tracking-tight">
              Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#f59e0b]">
                Products
              </span>
            </h2>
            <div className="w-10 h-0.5 bg-gradient-to-r from-[#fbbf24] to-transparent rounded-full mx-auto mt-4" />
          </motion.div>

          {/* Track 1 — scrolls left */}
          <InfiniteTrack products={row1Products} direction="left" speed={32} />

          {/* Track 2 — scrolls right, slight offset */}
          <div className="mt-4">
            <InfiniteTrack products={row2Products} direction="right" speed={26} />
          </div>
        </div>
      </div>
  );
}