/**
 * BEYOND THE HORIZON — United Airlines Narrative Campaign Pitch
 * Single-file React component. Tailwind CSS + Framer Motion + lucide-react.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * ASSET DROP-IN (GitHub → Cloudflare Pages)
 * Place these files in `public/assets/` (Vite/CRA) so they serve from /assets:
 *   public/assets/creator-profile.jpg
 *   public/assets/destination-ewr.jpg
 *   public/assets/destination-dss.jpg
 *   public/assets/destination-rak.jpg
 *   public/assets/destination-nrt.jpg
 *   public/assets/beyond-the-horizon-onesheet.pdf   (optional, for the CTA)
 * All <img> tags below use relative `./assets/...` paths as specified.
 *
 * ⚠ PLACEHOLDER DATA: every number in AUDIENCE / METRICS below is invented
 * scaffolding. Replace with real @legefilms analytics before this is sent to
 * anyone at United — search "PLACEHOLDER" to find them all.
 * ─────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Plane,
  MapPin,
  Film,
  Clapperboard,
  Sparkles,
  Globe2,
  ShieldCheck,
  Camera,
  Palette,
  Users,
  TrendingUp,
  Wallet,
  CalendarDays,
  Download,
  Mail,
  DoorOpen,
  Moon,
  Sunrise,
  ImageOff,
} from "lucide-react";

/* ========================================================================
   BRAND TOKENS
   ===================================================================== */
const INK = "#05070B";
const INK_SOFT = "#0A0D14";
const UA_BLUE = "#005DA6";
const UA_GLOW = "#00A3E0";

/* ========================================================================
   DATA
   ===================================================================== */

// Equirectangular projection of real coordinates onto a 1000×500 viewBox.
const NODES = [
  {
    code: "EWR",
    city: "Newark",
    region: "New Jersey, USA",
    label: "Newark Liberty International",
    x: 294,
    y: 137,
    theme: "The Threshold",
    blurb:
      "Where the story begins. Terminal C at blue hour — the Polaris Lounge, the quiet ritual of departure, the last cup of coffee on home soil.",
    img: "./assets/destination-ewr.jpg",
  },
  {
    code: "DSS",
    city: "Dakar",
    region: "Senegal",
    label: "Blaise Diagne International",
    x: 453,
    y: 209,
    theme: "Atlantic Crossing",
    blurb:
      "Eight hours of open ocean resolve into red dust and teranga. Coastline, colour, and the first breath of a continent.",
    img: "./assets/destination-dss.jpg",
  },
  {
    code: "RAK",
    city: "Marrakech",
    region: "Morocco",
    label: "Marrakech Menara",
    x: 478,
    y: 162,
    theme: "Desert Light",
    blurb:
      "Descent over the Atlas range into ochre. Riad courtyards, souk geometry, and the particular gold of late afternoon.",
    img: "./assets/destination-rak.jpg",
  },
  {
    code: "NRT",
    city: "Tokyo",
    region: "Japan",
    label: "Narita International",
    x: 890,
    y: 151,
    theme: "Precision & Neon",
    blurb:
      "The long haul east. Sleep at 35,000 feet, wake to a skyline of exacting order — the arrival that rewrites the traveller.",
    img: "./assets/destination-nrt.jpg",
  },
];

const ACTS = [
  {
    numeral: "Act I",
    title: "The Threshold",
    icon: DoorOpen,
    lede: "Before the wheels leave the ground.",
    beats: [
      "Polaris Lounge — the hush, the light, the pre-flight ritual",
      "Terminal flow shot as architecture, not logistics",
      "The boarding door framed as a portal, not a queue",
    ],
  },
  {
    numeral: "Act II",
    title: "The Sanctuary",
    icon: Moon,
    lede: "Seven miles up, time behaves differently.",
    beats: [
      "The Polaris suite at cruise — privacy, texture, stillness",
      "Dining service captured as craft: plating, pour, candlelight",
      "Sleeping above the weather; waking to a different sky",
    ],
  },
  {
    numeral: "Act III",
    title: "The Arrival",
    icon: Sunrise,
    lede: "The jet bridge opens onto a new world.",
    beats: [
      "First contact — air, sound, language, heat",
      "The city meeting the traveller on its own terms",
      "The return home, changed — the loop that sells the next flight",
    ],
  },
];

const DELIVERABLES = [
  {
    icon: Clapperboard,
    tag: "Hero",
    count: "3×",
    title: "Hero Cinematic Reels",
    spec: "60s+ · Fully scripted",
    body:
      "Narrative-driven short films capturing the complete arc from takeoff to arrival. Story-boarded, scored, and colour-graded to broadcast standard — built to headline a campaign, not fill a feed.",
    points: [
      "Full script + shot list approved pre-production",
      "Licensed score & sound design",
      "Delivered in 16:9, 9:16 and 1:1 masters",
    ],
  },
  {
    icon: Film,
    tag: "Ambient",
    count: "5×",
    title: "Ambient Experience Clips",
    spec: "Short-form · Native social",
    body:
      "Seamless, organic vignettes blending the in-flight premium cabin atmosphere with destination highlights — engineered for non-disruptive, highly native social integration.",
    points: [
      "No hard-sell framing — atmosphere first",
      "Optimised for Reels, Shorts & TikTok placement",
      "Sound-on and sound-off cuts supplied",
    ],
  },
  {
    icon: ShieldCheck,
    tag: "Rights",
    count: "∞",
    title: "Global Digital Usage Rights",
    spec: "Perpetual · Worldwide",
    body:
      "Perpetual commercial licensing across United's organic and paid channels. No renewal windows, no territory carve-outs, no per-placement negotiation.",
    points: [
      "Organic + paid social, owned web, in-flight entertainment",
      "Worldwide territory, all digital formats",
      "Raw selects available on request",
    ],
  },
];

// PLACEHOLDER — replace with verified analytics before pitching.
const METRICS = [
  { icon: Users, value: "412K", label: "Total audience", sub: "Across IG · YT · TikTok" },
  { icon: Globe2, value: "68%", label: "US-based", sub: "NY · SF · CHI · LAX concentration" },
  { icon: Wallet, value: "54%", label: "$100K+ household income", sub: "High travel intent bracket" },
  { icon: TrendingUp, value: "9.4%", label: "Avg. engagement rate", sub: "vs. 2.1% category benchmark" },
];

// PLACEHOLDER — replace with verified analytics before pitching.
const AUDIENCE_BARS = [
  { label: "Age 25–44", pct: 71 },
  { label: "Flew international in last 12mo", pct: 63 },
  { label: "Premium cabin consideration", pct: 38 },
  { label: "Saves / shares travel content", pct: 46 },
];

const CRAFT = [
  { icon: Camera, title: "4K cinema capture", body: "Full-frame cinema bodies, prime glass, gimbal + FPV coverage. Shot log, delivered graded." },
  { icon: Palette, title: "Signature colour", body: "Custom show LUT built per campaign — warm highlight roll-off, deep neutral shadow, never crushed." },
  { icon: Film, title: "Story before spectacle", body: "Every sequence written first. Drone shots earn their place or they don't make the cut." },
];

/* ========================================================================
   PRIMITIVES
   ===================================================================== */

const EASE = [0.16, 1, 0.3, 1];

function Reveal({ children, delay = 0, y = 28, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Image with a graceful fallback. If the file isn't in public/assets/ yet,
 * renders a branded placeholder naming the missing file instead of a broken
 * image icon — so the layout still reads correctly while you gather media.
 */
function Media({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#0A0D14] via-[#0E1622] to-[#05070B]">
        <ImageOff className="h-6 w-6 text-[#00A3E0]/40" />
        <p className="px-6 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-[#94A3B8]/70">
          {src.replace("./assets/", "")}
        </p>
        <p className="text-[9px] uppercase tracking-[0.24em] text-[#94A3B8]/40">
          Drop into public/assets/
        </p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

function Eyebrow({ children }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-8 bg-[#00A3E0]/60" />
      <span className="text-[11px] font-medium uppercase tracking-[0.34em] text-[#00A3E0]">
        {children}
      </span>
    </div>
  );
}

function Section({ id, children, className = "" }) {
  return (
    <section
      id={id}
      className={`relative mx-auto w-full max-w-[1180px] px-6 py-28 md:px-10 md:py-40 ${className}`}
    >
      {children}
    </section>
  );
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ========================================================================
   ROUTE MAP
   ===================================================================== */

function routePath(a, b) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 - Math.abs(b.x - a.x) * 0.22 - 18;
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
}

function RouteMap({ active, onSelect }) {
  const segments = NODES.slice(0, -1).map((n, i) => ({
    id: `route-${i}`,
    d: routePath(n, NODES[i + 1]),
    delay: i * 0.35,
  }));

  return (
    <svg
      viewBox="0 0 1000 500"
      className="w-full select-none"
      role="img"
      aria-label="Route map: Newark to Dakar to Marrakech to Tokyo"
    >
      <defs>
        <filter id="btp-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="btp-route" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={UA_BLUE} stopOpacity="0.35" />
          <stop offset="50%" stopColor={UA_GLOW} stopOpacity="1" />
          <stop offset="100%" stopColor={UA_BLUE} stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id="btp-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={UA_GLOW} stopOpacity="0.22" />
          <stop offset="100%" stopColor={UA_GLOW} stopOpacity="0" />
        </radialGradient>
        <pattern id="btp-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" strokeOpacity="0.045" strokeWidth="1" />
        </pattern>
      </defs>

      {/* Atmosphere */}
      <rect width="1000" height="500" fill="url(#btp-grid)" />
      <ellipse cx="360" cy="170" rx="260" ry="150" fill="url(#btp-halo)" />
      <ellipse cx="850" cy="180" rx="220" ry="140" fill="url(#btp-halo)" />

      {/* Graticule */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line
          key={`h${i}`}
          x1="0"
          y1={i * 100}
          x2="1000"
          y2={i * 100}
          stroke="#FFFFFF"
          strokeOpacity="0.05"
        />
      ))}
      <line x1="0" y1="250" x2="1000" y2="250" stroke={UA_GLOW} strokeOpacity="0.12" strokeDasharray="2 8" />

      {/* Routes */}
      {segments.map((s) => (
        <g key={s.id}>
          <path d={s.d} id={s.id} fill="none" stroke={UA_BLUE} strokeOpacity="0.28" strokeWidth="6" />
          <motion.path
            d={s.d}
            fill="none"
            stroke="url(#btp-route)"
            strokeWidth="1.6"
            strokeLinecap="round"
            filter="url(#btp-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, delay: s.delay, ease: EASE }}
          />
          <motion.path
            d={s.d}
            fill="none"
            stroke={UA_GLOW}
            strokeWidth="1.2"
            strokeDasharray="3 14"
            strokeOpacity="0.7"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -170 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />
          <circle r="3.2" fill="#FFFFFF" filter="url(#btp-glow)">
            <animateMotion dur="7s" repeatCount="indefinite" rotate="auto" begin={`${s.delay}s`}>
              {/* Both forms: Safari still wants xlink:href on <mpath>. */}
              <mpath href={`#${s.id}`} xlinkHref={`#${s.id}`} />
            </animateMotion>
          </circle>
        </g>
      ))}

      {/* Nodes */}
      {NODES.map((n, i) => {
        const isActive = active === n.code;
        return (
          <g
            key={n.code}
            className="cursor-pointer"
            onMouseEnter={() => onSelect(n.code)}
            onClick={() => onSelect(n.code)}
            onFocus={() => onSelect(n.code)}
            tabIndex={0}
            role="button"
            aria-label={`${n.city} (${n.code})`}
          >
            <circle cx={n.x} cy={n.y} r="34" fill="transparent" />
            <motion.circle
              cx={n.x}
              cy={n.y}
              r={isActive ? 26 : 20}
              fill={UA_GLOW}
              fillOpacity="0.08"
              stroke={UA_GLOW}
              strokeOpacity={isActive ? 0.55 : 0.22}
              animate={{ r: isActive ? 26 : 20 }}
              transition={{ duration: 0.45, ease: EASE }}
            />
            <motion.circle
              cx={n.x}
              cy={n.y}
              r="14"
              fill="none"
              stroke={UA_GLOW}
              strokeOpacity="0.5"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.5, ease: "easeOut" }}
              // transformBox pinned explicitly: without it the scale origin is
              // browser-dependent and the ping expands from the wrong point.
              style={{ transformBox: "view-box", transformOrigin: `${n.x}px ${n.y}px` }}
            />
            <circle
              cx={n.x}
              cy={n.y}
              r={isActive ? 7 : 5.5}
              fill="#FFFFFF"
              filter="url(#btp-glow)"
            />
            <text
              x={n.x}
              y={n.y + 48}
              textAnchor="middle"
              className="fill-white"
              style={{ fontSize: 17, letterSpacing: 3, fontWeight: 600 }}
              opacity={isActive ? 1 : 0.75}
            >
              {n.code}
            </text>
            <text
              x={n.x}
              y={n.y + 68}
              textAnchor="middle"
              style={{ fontSize: 12, letterSpacing: 1.5 }}
              fill="#94A3B8"
              opacity={isActive ? 1 : 0.6}
            >
              {n.city.toUpperCase()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function DestinationCard({ node }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
      transition={{ duration: 0.5, ease: EASE }}
      className="w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-[0_30px_80px_-40px_rgba(0,163,224,0.45)] backdrop-blur-xl"
    >
      <div className="relative h-56 w-full overflow-hidden md:h-64">
        <Media
          src={node.img}
          alt={`${node.city}, ${node.region}`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/30 to-transparent" />
        <div className="absolute left-6 top-6 rounded-full border border-[#00A3E0]/40 bg-[#05070B]/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.28em] text-[#00A3E0] backdrop-blur-md">
          {node.code}
        </div>
      </div>

      <div className="space-y-4 p-6 md:p-8">
        <div>
          <h3 className="text-2xl font-light tracking-tight text-white md:text-3xl">
            {node.city}
            <span className="text-[#94A3B8]">, {node.region}</span>
          </h3>
          <p className="mt-1 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#94A3B8]">
            <MapPin className="h-3.5 w-3.5 text-[#00A3E0]" />
            {node.label}
          </p>
        </div>

        <div className="h-px w-full bg-white/10" />

        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#00A3E0]">
            Narrative theme
          </p>
          <p className="mt-2 text-lg font-light text-white">{node.theme}</p>
          <p className="mt-3 text-sm leading-relaxed text-[#94A3B8]">{node.blurb}</p>
        </div>
      </div>
    </motion.article>
  );
}

/* ========================================================================
   MAIN
   ===================================================================== */

export default function BeyondTheHorizon() {
  const [active, setActive] = useState("EWR");
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(heroProgress, [0, 0.7], [1, 0]);

  const activeNode = NODES.find((n) => n.code === active) || NODES[0];

  return (
    <div className="min-h-screen w-full bg-[#05070B] font-sans text-white antialiased selection:bg-[#00A3E0]/30">
      {/* Scroll progress */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed left-0 top-0 z-50 h-[2px] w-full origin-left bg-gradient-to-r from-[#005DA6] via-[#00A3E0] to-[#005DA6] shadow-[0_0_18px_rgba(0,163,224,0.8)]"
      />

      {/* Nav */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-[#05070B]/60 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-[1180px] items-center justify-between px-6 py-4 md:px-10">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 text-sm font-medium tracking-[0.2em] text-white"
          >
            <Plane className="h-4 w-4 rotate-45 text-[#00A3E0]" />
            BTH
          </button>
          <div className="hidden items-center gap-9 text-[11px] uppercase tracking-[0.24em] text-[#94A3B8] md:flex">
            {[
              ["Routes", "routes"],
              ["Narrative", "narrative"],
              ["Deliverables", "deliverables"],
              ["Creator", "creator"],
            ].map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollToId(id)}
                className="transition-colors duration-300 hover:text-white"
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={() => scrollToId("contact")}
            className="rounded-full border border-[#00A3E0]/40 bg-[#00A3E0]/10 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-[#00A3E0] transition-all duration-300 hover:bg-[#00A3E0]/20 hover:shadow-[0_0_24px_-4px_rgba(0,163,224,0.7)]"
          >
            Contact
          </button>
        </nav>
      </header>

      {/* ================= HERO ================= */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen items-center justify-center overflow-hidden"
      >
        {/* Atmospheric field */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/3 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#005DA6] opacity-[0.18] blur-[160px]" />
          <div className="absolute bottom-0 left-1/4 h-[420px] w-[420px] rounded-full bg-[#00A3E0] opacity-[0.10] blur-[170px]" />
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
              maskImage:
                "radial-gradient(ellipse at center, black 20%, transparent 72%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, black 20%, transparent 72%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#05070B] to-transparent" />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 flex flex-col items-center px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE }}
          >
            <div className="mb-10 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00A3E0] shadow-[0_0_10px_#00A3E0]" />
              <span className="text-[10px] uppercase tracking-[0.34em] text-[#94A3B8]">
                Confidential · United Airlines
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(14px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.4, delay: 0.15, ease: EASE }}
            className="text-[13vw] font-extralight leading-[0.92] tracking-[-0.04em] text-white sm:text-7xl md:text-8xl lg:text-[7.5rem]"
          >
            BEYOND
            <br />
            <span className="bg-gradient-to-b from-white via-white to-[#94A3B8] bg-clip-text text-transparent">
              THE HORIZON
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: EASE }}
            className="mt-9 max-w-xl text-sm font-light leading-relaxed tracking-wide text-[#94A3B8] md:text-base"
          >
            A Narrative Campaign Proposal by{" "}
            <span className="text-white">@legefilms</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.85, ease: EASE }}
            className="mt-14"
          >
            <button
              onClick={() => scrollToId("routes")}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-[#00A3E0]/45 bg-[#00A3E0]/[0.08] px-8 py-4 text-xs uppercase tracking-[0.24em] text-white shadow-[0_0_40px_-12px_rgba(0,163,224,0.85)] transition-all duration-500 hover:border-[#00A3E0] hover:bg-[#00A3E0]/20 hover:shadow-[0_0_60px_-10px_rgba(0,163,224,1)]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              Explore Proposal
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowDown className="h-4 w-4 text-[#00A3E0]" />
              </motion.span>
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="h-14 w-px overflow-hidden bg-white/10">
            <motion.div
              className="h-6 w-px bg-[#00A3E0] shadow-[0_0_12px_#00A3E0]"
              animate={{ y: [-24, 56] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </section>

      {/* ================= ROUTE MAP ================= */}
      <Section id="routes">
        <Reveal>
          <Eyebrow>The Route</Eyebrow>
          <h2 className="mt-6 max-w-3xl text-4xl font-extralight leading-[1.08] tracking-[-0.03em] text-white md:text-6xl">
            Four hubs.
            <br />
            <span className="text-[#94A3B8]">One continuous story.</span>
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#94A3B8] md:text-base">
            Select a node to preview the destination and the narrative theme that
            anchors that leg of the campaign.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.45fr_1fr] lg:items-center">
          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0A0D14]/70 p-4 backdrop-blur-md md:p-6">
              <div className="pointer-events-none absolute -left-24 top-1/4 h-64 w-64 rounded-full bg-[#005DA6] opacity-20 blur-[110px]" />
              <RouteMap active={active} onSelect={setActive} />
              <div className="mt-2 flex flex-wrap items-center gap-2 px-2 pb-1">
                {NODES.map((n, i) => (
                  <React.Fragment key={n.code}>
                    <button
                      onMouseEnter={() => setActive(n.code)}
                      onClick={() => setActive(n.code)}
                      className={`rounded-full border px-3.5 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
                        active === n.code
                          ? "border-[#00A3E0]/60 bg-[#00A3E0]/15 text-white shadow-[0_0_22px_-6px_rgba(0,163,224,0.9)]"
                          : "border-white/10 text-[#94A3B8] hover:border-white/25 hover:text-white"
                      }`}
                    >
                      {n.code}
                    </button>
                    {i < NODES.length - 1 && (
                      <ArrowRight className="h-3 w-3 text-white/20" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            {/* The key MUST sit on the immediate child of AnimatePresence —
                a key set inside DestinationCard would not be seen here, and
                the exit animation would never fire. */}
            <AnimatePresence mode="wait">
              <DestinationCard key={activeNode.code} node={activeNode} />
            </AnimatePresence>
          </Reveal>
        </div>
      </Section>

      {/* ================= NARRATIVE ================= */}
      <div className="relative border-y border-white/5 bg-[#0A0D14]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-[#005DA6] opacity-[0.12] blur-[150px]" />
        </div>

        <Section id="narrative">
          <Reveal>
            <Eyebrow>The Pitch</Eyebrow>
            <h2 className="mt-6 max-w-3xl text-4xl font-extralight leading-[1.08] tracking-[-0.03em] text-white md:text-6xl">
              The Journey{" "}
              <span className="italic text-[#00A3E0]">is</span> the Destination.
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[#94A3B8] md:text-base">
              Most airline content begins when the traveller lands. This campaign
              argues the opposite: that the eight hours in between are the product,
              and they deserve to be filmed like a feature.
            </p>
          </Reveal>

          <div className="mt-20 grid gap-6 md:grid-cols-3">
            {ACTS.map((act, i) => {
              const Icon = act.icon;
              return (
                <Reveal key={act.numeral} delay={i * 0.12}>
                  <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-8 backdrop-blur-md transition-all duration-500 hover:border-[#00A3E0]/30 hover:bg-white/[0.05] hover:shadow-[0_30px_70px_-40px_rgba(0,163,224,0.7)]">
                    <div className="absolute right-6 top-6 text-6xl font-extralight text-white/[0.04] transition-colors duration-500 group-hover:text-[#00A3E0]/10">
                      0{i + 1}
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#00A3E0]/25 bg-[#00A3E0]/10">
                      <Icon className="h-5 w-5 text-[#00A3E0]" />
                    </div>

                    <p className="mt-7 text-[10px] uppercase tracking-[0.32em] text-[#00A3E0]">
                      {act.numeral}
                    </p>
                    <h3 className="mt-2 text-2xl font-light tracking-tight text-white">
                      {act.title}
                    </h3>
                    <p className="mt-2 text-sm italic text-[#94A3B8]">{act.lede}</p>

                    <div className="my-6 h-px w-full bg-white/10" />

                    <ul className="space-y-3">
                      {act.beats.map((b) => (
                        <li key={b} className="flex gap-3 text-sm leading-relaxed text-[#94A3B8]">
                          <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#00A3E0]" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Section>
      </div>

      {/* ================= DELIVERABLES ================= */}
      <Section id="deliverables">
        <Reveal>
          <Eyebrow>The Package</Eyebrow>
          <h2 className="mt-6 max-w-3xl text-4xl font-extralight leading-[1.08] tracking-[-0.03em] text-white md:text-6xl">
            Campaign deliverables.
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[#94A3B8] md:text-base">
            Two content streams built to work together — one that headlines, one
            that lives natively in the feed — plus rights that never expire.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {DELIVERABLES.map((d, i) => {
            const Icon = d.icon;
            return (
              <Reveal key={d.title} delay={i * 0.12} className="h-full">
                <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl transition-all duration-500 hover:border-[#00A3E0]/35 hover:shadow-[0_40px_90px_-50px_rgba(0,163,224,0.85)]">
                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#00A3E0] opacity-[0.07] blur-[60px]" />

                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                      <Icon className="h-5 w-5 text-[#00A3E0]" />
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[#94A3B8]">
                      {d.tag}
                    </span>
                  </div>

                  <div className="mt-8 flex items-baseline gap-3">
                    <span className="text-4xl font-extralight tracking-tight text-[#00A3E0]">
                      {d.count}
                    </span>
                    <h3 className="text-xl font-light tracking-tight text-white">
                      {d.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-[#94A3B8]">
                    {d.spec}
                  </p>

                  <p className="mt-6 text-sm leading-relaxed text-[#94A3B8]">{d.body}</p>

                  <div className="my-6 h-px w-full bg-white/10" />

                  <ul className="mt-auto space-y-2.5">
                    {d.points.map((p) => (
                      <li key={p} className="flex gap-3 text-[13px] leading-relaxed text-[#94A3B8]">
                        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#00A3E0]/70" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* ================= CREATOR & ANALYTICS ================= */}
      <div className="relative border-y border-white/5 bg-[#0A0D14]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-1/4 h-[460px] w-[460px] rounded-full bg-[#00A3E0] opacity-[0.10] blur-[150px]" />
        </div>

        <Section id="creator">
          <Reveal>
            <Eyebrow>The Creator</Eyebrow>
            <h2 className="mt-6 max-w-3xl text-4xl font-extralight leading-[1.08] tracking-[-0.03em] text-white md:text-6xl">
              Who is behind the lens.
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:items-start">
            {/* LEFT — Spotlight */}
            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Media
                    src="./assets/creator-profile.jpg"
                    alt="@legefilms — director and cinematographer"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <p className="text-2xl font-light tracking-tight text-white">@legefilms</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.26em] text-[#00A3E0]">
                      Director · Cinematographer
                    </p>
                  </div>
                </div>

                <div className="space-y-6 p-8">
                  <p className="text-sm leading-relaxed text-[#94A3B8]">
                    A travel filmmaker working in narrative documentary — scripted
                    arcs, cinema-grade capture, and a colour signature built per
                    campaign rather than pulled off a preset shelf. Work is written
                    before it is shot, and cut to hold attention past the first
                    three seconds.
                  </p>

                  <div className="h-px w-full bg-white/10" />

                  <div className="space-y-5">
                    {CRAFT.map((c) => {
                      const Icon = c.icon;
                      return (
                        <div key={c.title} className="flex gap-4">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#00A3E0]/25 bg-[#00A3E0]/10">
                            <Icon className="h-4 w-4 text-[#00A3E0]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{c.title}</p>
                            <p className="mt-1 text-[13px] leading-relaxed text-[#94A3B8]">
                              {c.body}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* RIGHT — Analytics */}
            <Reveal delay={0.2}>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {METRICS.map((m) => {
                    const Icon = m.icon;
                    return (
                      <div
                        key={m.label}
                        className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-500 hover:border-[#00A3E0]/30 hover:shadow-[0_24px_60px_-40px_rgba(0,163,224,0.8)]"
                      >
                        <Icon className="h-4 w-4 text-[#00A3E0]" />
                        <p className="mt-5 text-3xl font-extralight tracking-tight text-white md:text-4xl">
                          {m.value}
                        </p>
                        <p className="mt-1.5 text-[11px] uppercase tracking-[0.2em] text-white/80">
                          {m.label}
                        </p>
                        <p className="mt-1 text-[11px] leading-relaxed text-[#94A3B8]">
                          {m.sub}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-[#00A3E0]">
                    Audience composition
                  </p>

                  <div className="mt-7 space-y-6">
                    {AUDIENCE_BARS.map((b, i) => (
                      <div key={b.label}>
                        <div className="flex items-baseline justify-between">
                          <span className="text-[13px] text-[#94A3B8]">{b.label}</span>
                          <span className="text-sm font-light text-white">{b.pct}%</span>
                        </div>
                        <div className="mt-2.5 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.07]">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-[#005DA6] to-[#00A3E0] shadow-[0_0_12px_rgba(0,163,224,0.8)]"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${b.pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.15 * i, ease: EASE }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="mt-8 border-t border-white/10 pt-5 text-[11px] leading-relaxed text-[#94A3B8]">
                    Trailing 90-day platform analytics. Full creator media kit and
                    raw platform exports available on request.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Section>
      </div>

      {/* ================= CTA / FOOTER ================= */}
      <Section id="contact" className="py-32 md:py-48">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#005DA6] opacity-[0.17] blur-[160px]" />

        <Reveal className="relative">
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.035] p-10 text-center backdrop-blur-2xl shadow-[0_50px_120px_-60px_rgba(0,163,224,0.9)] md:p-16">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#00A3E0]/30 bg-[#00A3E0]/10">
              <Plane className="h-5 w-5 rotate-45 text-[#00A3E0]" />
            </div>

            <h2 className="mt-9 text-4xl font-extralight leading-[1.1] tracking-[-0.03em] text-white md:text-5xl">
              Ready to elevate
              <br />
              <span className="text-[#94A3B8]">the journey?</span>
            </h2>

            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-[#94A3B8]">
              Available for a 30-minute walkthrough of the treatment, production
              schedule, and delivery timeline.
            </p>

            <div className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="mailto:hello@legefilms.com?subject=Beyond%20The%20Horizon%20—%20Executive%20Pitch%20Call"
                className="group relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full border border-[#00A3E0]/50 bg-[#00A3E0]/12 px-8 py-4 text-xs uppercase tracking-[0.22em] text-white shadow-[0_0_44px_-12px_rgba(0,163,224,0.95)] transition-all duration-500 hover:border-[#00A3E0] hover:bg-[#00A3E0]/25 hover:shadow-[0_0_66px_-10px_rgba(0,163,224,1)] sm:w-auto"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <CalendarDays className="h-4 w-4 text-[#00A3E0]" />
                Schedule Executive Pitch Call
              </a>

              <a
                href="./assets/beyond-the-horizon-onesheet.pdf"
                download
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-white/12 bg-white/[0.03] px-8 py-4 text-xs uppercase tracking-[0.22em] text-[#94A3B8] transition-all duration-500 hover:border-white/30 hover:text-white sm:w-auto"
              >
                <Download className="h-4 w-4" />
                Download One-Sheet PDF
              </a>
            </div>

            <div className="mt-12 flex flex-col items-center gap-2 border-t border-white/10 pt-9">
              <a
                href="mailto:hello@legefilms.com"
                className="flex items-center gap-2 text-sm text-white transition-colors hover:text-[#00A3E0]"
              >
                <Mail className="h-3.5 w-3.5 text-[#00A3E0]" />
                hello@legefilms.com
              </a>
              <p className="text-[11px] uppercase tracking-[0.26em] text-[#94A3B8]">
                @legefilms
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mx-auto mt-20 flex max-w-3xl flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/25">
              <span className="h-px w-10 bg-white/10" />
              Beyond The Horizon
              <span className="h-px w-10 bg-white/10" />
            </div>
            <p className="text-[11px] text-white/20">
              Prepared for United Airlines Marketing · Confidential Proposal ·{" "}
              {new Date().getFullYear()}
            </p>
          </div>
        </Reveal>
      </Section>
    </div>
  );
}
