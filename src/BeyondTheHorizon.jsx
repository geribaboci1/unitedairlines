/**
 * BEYOND THE HORIZON — United Airlines Narrative Campaign Pitch
 * Single-file React component. Tailwind CSS + Framer Motion + lucide-react.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * ASSET DROP-IN (GitHub → Cloudflare Pages)
 * Place these in `public/assets/` so they serve from /assets at the site root:
 *   public/assets/creator-profile.jpg
 *   public/assets/destination-ewr.jpg      Newark hub
 *   public/assets/destination-bri.jpg      Chapter 01 — Bari, Italy
 *   public/assets/destination-rak.jpg      Chapter 02 — Marrakech, Morocco
 *   public/assets/destination-akl.jpg      Chapter 03 — Auckland, New Zealand
 * Missing files degrade to a branded placeholder naming the absent file
 * rather than a broken-image icon — see <Media>.
 *
 * ANALYTICS: figures in METRICS and AUDIENCE_BARS are creator-supplied
 * (@legefilms, Sept 2026). Keep them in sync with the media kit — an airline
 * marketing team will ask for the platform exports behind them.
 * ─────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from "react";
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
  ArrowUpRight,
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
  Eye,
  CalendarDays,
  Mail,
  DoorOpen,
  Moon,
  Sunrise,
  ImageOff,
  Instagram,
  Radio,
} from "lucide-react";

/* ========================================================================
   1. BRAND TOKENS
   ===================================================================== */
const UA_BLUE = "#005DA6";
const UA_GLOW = "#00A3E0";
const EASE = [0.16, 1, 0.3, 1];

/* ========================================================================
   2. MAP PROJECTION

   Equirectangular, centred on 100°W — the Americas-centred framing a US
   carrier actually uses. Deliberately linear (no modulo wrap), so every
   coordinate must satisfy  lon ∈ [-280, 80].  Asia-Pacific longitudes are
   therefore authored as (lon - 360): Auckland 174.79°E becomes -185.21.

   The payoff: all three routes render in their true directions — the two
   Atlantic legs sweep east from Newark, the Pacific leg sweeps west from
   San Francisco. On a conventional 0°-centred map the SFO→AKL arc would be
   drawn straight across Europe and Asia, which an airline audience would
   catch instantly.
   ===================================================================== */
const MAP_W = 1000;
const MAP_H = 520;
const CENTER_LON = -100;

/**
 * [lon, lat] → [x, y] in the 1000×520 map space.
 *
 * Longitudes are normalised into the visible window first, so a real-world
 * value like Auckland's +174.79 resolves to -185.21 rather than projecting
 * 263px off the right edge of the map. Coastline rings are pre-authored via
 * A() and pass through this unchanged.
 */
function project([lon, lat]) {
  let l = lon;
  while (l - CENTER_LON > 180) l -= 360;
  while (l - CENTER_LON < -180) l += 360;
  const x = ((l - CENTER_LON + 180) / 360) * MAP_W;
  const y = ((90 - lat) / 180) * MAP_H;
  return [x, y];
}

/** Coordinate ring → closed SVG path. */
function landPath(ring) {
  return (
    ring
      .map(project)
      .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`)
      .join(" ") + " Z"
  );
}

/** Great-circle-feel arc between two projected points. */
function arcPath([x1, y1], [x2, y2], lift = 0.2) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - len * lift;
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(
    1
  )} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}

/* ========================================================================
   3. WORLD MAP GEOMETRY  (coarse coastlines, [lon, lat])

   Eurasia is split into two rings meeting at the 80°E seam, which lands
   exactly on the left and right map edges — the standard way a flat map
   handles a landmass that runs off both sides.
   ===================================================================== */
const A = (deg) => deg - 360; // Asia-Pacific helper: 140°E → A(140) → -220

const LAND = {
  northAmerica: [
    [-168, 66], [-156, 71], [-130, 70], [-110, 68], [-95, 70], [-81, 73],
    [-65, 66], [-60, 58], [-64, 45], [-70, 42], [-74, 40.5], [-76, 35],
    [-81, 25], [-84, 30], [-90, 29], [-97, 26], [-97, 20], [-91, 19],
    [-87, 21], [-83, 10], [-79, 9], [-83, 8], [-87, 13], [-95, 16],
    [-105, 20], [-110, 23], [-114, 28], [-117, 32.5], [-122, 37], [-124, 46],
    [-128, 52], [-135, 58], [-150, 59], [-158, 56], [-165, 55],
  ],
  greenland: [
    [-45, 60], [-42, 65], [-30, 68], [-22, 70], [-20, 75], [-25, 78],
    [-35, 82], [-50, 82], [-62, 80], [-70, 76], [-73, 70], [-65, 65], [-53, 62],
  ],
  southAmerica: [
    [-75, 11], [-70, 12], [-62, 10.5], [-55, 6], [-50, 0], [-44, -2],
    [-38, -5], [-35, -8], [-38, -13], [-40, -20], [-43, -23], [-48, -25],
    [-52, -32], [-58, -35], [-62, -39], [-65, -45], [-68, -52], [-68, -55],
    [-74, -52], [-75, -46], [-73, -42], [-72, -37], [-71.6, -33], [-70.4, -23],
    [-70.3, -18], [-77, -12], [-81, -5], [-81, -2], [-79, 2], [-77, 4],
  ],
  cuba: [[-85, 22], [-80, 23], [-74, 20.2], [-77, 19.9], [-84, 21.8]],
  africa: [
    [-5.5, 36], [0, 36.5], [10, 37], [11, 33], [20, 32], [25, 32], [30, 31],
    [33, 28], [37, 20], [40, 15], [43, 11], [51, 12], [48, 5], [45, 2],
    [41, -2], [40, -8], [40, -16], [35, -21], [33, -26], [31, -30], [26, -34],
    [20, -35], [18.4, -34], [15, -27], [13, -23], [12, -15], [12, -6], [9, 0],
    [6, 4], [3, 6], [0, 5], [-5, 5], [-10, 6], [-13, 8.5], [-17, 14.7],
    [-16, 18], [-16, 22], [-13, 28], [-9.6, 30.4], [-7.6, 33.6],
  ],
  madagascar: [[43, -12], [50, -15], [50, -19], [47, -25], [45, -25], [43, -21], [43, -16]],
  // Europe + western Asia, closed along the 80°E seam (right map edge)
  eurasiaWest: [
    [-9.1, 38.7], [-9, 37], [-6, 36], [-2, 36.7], [0, 39.5], [3, 41.8],
    [5.4, 43.3], [8.9, 44.4], [11.8, 42.4], [14.3, 40.6], [15.9, 38],
    [17, 40.5], [18.4, 40.1], [14.2, 42.5], [12.5, 45.4], [13.8, 45.6],
    [16.4, 43.5], [18.1, 42.6], [19.5, 40.5], [21, 38.5], [23, 36.5],
    [23.7, 38], [26, 40], [29, 41], [36, 41], [41, 41.5], [48, 38], [50, 37],
    [53, 27], [57, 25], [62, 25], [67, 25], [70, 21], [72.8, 19], [75, 15],
    [77.5, 8.1], [80, 13], [80, 76], [70, 72], [60, 70], [45, 68], [40, 66],
    [33, 69], [25, 71], [20, 70], [12, 66], [5, 62], [5.3, 60.4], [8, 57],
    [10, 54], [4.5, 52.5], [0, 49.5], [-4.5, 48.5], [-1.2, 45.5], [-3, 43.4],
    [-8.8, 43.3], [-8.6, 41.1],
  ],
  // Eastern Asia, closed along the same seam (left map edge)
  eurasiaEast: [
    [80, 76], [100, 76], [115, 74], [130, 73], [145, 72], [160, 70], [172, 68],
    [179, 65], [172, 62], [164, 60], [160, 54], [155, 52], [152, 59],
    [142, 54], [140, 49], [135, 45], [132, 43], [128, 42], [126, 38],
    [122, 39], [121, 32], [119, 25], [114, 22.3], [110, 20], [108, 16],
    [109, 11], [106, 9], [104, 1.5], [100, 6], [98, 10], [95, 16], [93, 18],
    [89, 21.5], [84, 19], [80, 13],
  ].map(([lon, lat]) => [A(lon), lat]),
  japan: [
    [131, 31], [132, 34], [135, 34], [137, 35], [140, 36], [141, 39],
    [141, 41], [145, 43], [144, 45], [140, 42], [138, 37], [136, 37],
    [133, 35], [131, 34], [129, 33],
  ].map(([lon, lat]) => [A(lon), lat]),
  philippines: [[121, 18], [124, 13], [126, 10], [125, 6], [122, 7], [120, 13]]
    .map(([lon, lat]) => [A(lon), lat]),
  sumatra: [[95, 5.5], [100, 2], [104, -2], [106, -6], [103, -6], [100, -3], [97, 1]]
    .map(([lon, lat]) => [A(lon), lat]),
  java: [[105, -6], [112, -7], [114, -8.5], [110, -8], [106, -7]]
    .map(([lon, lat]) => [A(lon), lat]),
  borneo: [[109, 2], [117, 4], [119, 1], [117, -3], [111, -3], [109, 0]]
    .map(([lon, lat]) => [A(lon), lat]),
  newGuinea: [[131, -1], [141, -3], [147, -6], [150, -10], [143, -9], [137, -8], [132, -5]]
    .map(([lon, lat]) => [A(lon), lat]),
  australia: [
    [130.8, -12.5], [136, -12], [137, -16], [140, -17], [142.5, -10.7],
    [145.8, -17], [149, -21], [153, -27.5], [153, -31], [151.2, -33.9],
    [150, -37], [145, -38.5], [141, -38], [138.6, -35], [137, -35],
    [135, -34.5], [130, -32], [122, -34], [118, -35], [115.8, -32],
    [114.5, -28], [113.5, -26], [114, -22], [118.5, -20.3], [122.2, -18],
    [125, -14.5], [128, -15],
  ].map(([lon, lat]) => [A(lon), lat]),
  tasmania: [[145, -41], [148, -41], [148, -43.5], [145, -43.5]]
    .map(([lon, lat]) => [A(lon), lat]),
  nzNorth: [
    [173, -34.4], [175, -36], [177, -37.5], [178.5, -37.6], [176, -40],
    [174.8, -41.3], [174, -39.5], [173, -38], [172.7, -36],
  ].map(([lon, lat]) => [A(lon), lat]),
  nzSouth: [
    [172.5, -40.5], [174, -41.5], [173, -43], [171, -44.5], [170.5, -45.9],
    [168, -46.6], [166.5, -45.5], [168, -44], [171, -42.5],
  ].map(([lon, lat]) => [A(lon), lat]),
  uk: [
    [-5, 50], [-3, 51.5], [1.5, 51], [0, 53], [-1, 54.5], [-2, 57], [-3, 58.5],
    [-5, 58.5], [-6, 57], [-5, 55], [-4.5, 54], [-3, 53.5], [-4.5, 52],
  ],
  ireland: [[-10, 51.5], [-6, 52], [-6, 54.5], [-8, 55.3], [-10, 54]],
  iceland: [[-24, 65], [-14, 66], [-13, 64.5], [-22, 63.5]],
};

/* ========================================================================
   4. CONTENT DATA
   ===================================================================== */

const HUBS = [
  {
    code: "EWR",
    kind: "hub",
    city: "Newark",
    country: "New Jersey",
    airport: "Newark Liberty International",
    lon: -74.17,
    lat: 40.69,
    coords: "40.6892° N, 74.1745° W",
    label: "Atlantic Gateway Hub",
    img: "./assets/destination-ewr.jpg",
    hook:
      "Terminal C at blue hour: the Polaris Lounge, the quiet choreography of a well-run departure, the last cup of coffee on home soil. Every chapter in this campaign begins here — the hub is not a waypoint in the story, it is Act I.",
  },
  {
    code: "SFO",
    kind: "hub",
    city: "San Francisco",
    country: "California",
    airport: "San Francisco International",
    lon: -122.38,
    lat: 37.62,
    coords: "37.6213° N, 122.3790° W",
    label: "Pacific Gateway Hub",
    img: null,
    hook:
      "The Pacific door. Where the Atlantic legs trade on proximity, San Francisco trades on reach — the departure point for the longest, most demanding sector in the campaign, and the one that proves the cabin.",
  },
];

const CHAPTERS = [
  {
    code: "BRI",
    kind: "chapter",
    chapter: "Chapter 01",
    continent: "Europe",
    city: "Bari",
    country: "Italy",
    airport: "Bari Karol Wojtyła",
    tagline: "The Exclusive Gateway to Puglia",
    lon: 16.77,
    lat: 41.14,
    coords: "41.1389° N, 16.7606° E",
    origin: "EWR",
    img: "./assets/destination-bri.jpg",
    hook:
      "Every competitor routes Italy through Rome or Milan and hands the traveller a three-hour drive. United's transatlantic network makes Puglia a direct proposition instead — an overnight from Newark and the whitewashed masserie of the Adriatic coast are a mid-morning arrival. This is the continent's best-kept secret, one aircraft away.",
  },
  {
    code: "RAK",
    kind: "chapter",
    chapter: "Chapter 02",
    continent: "Africa",
    city: "Marrakech",
    country: "Morocco",
    airport: "Marrakech Menara",
    tagline: "The North African Oasis",
    lon: -8.04,
    lat: 31.61,
    coords: "31.6069° N, 8.0363° W",
    origin: "EWR",
    img: "./assets/destination-rak.jpg",
    hook:
      "One eastbound night over the Atlantic and the Atlas range is on the wing. Marrakech is the shortest distance between a Newark boarding pass and genuine cultural vertigo — souk geometry, riad courtyards, desert light. United's proposition here is not the destination but the compression: dinner at altitude, breakfast on another continent.",
  },
  {
    code: "AKL",
    kind: "chapter",
    chapter: "Chapter 03",
    continent: "Oceania",
    city: "Auckland",
    country: "New Zealand",
    airport: "Auckland International",
    tagline: "The Long-Haul Pacific Link",
    lon: 174.79,
    lat: -37.01,
    coords: "37.0082° S, 174.7850° E",
    origin: "SFO",
    img: "./assets/destination-akl.jpg",
    hook:
      "The definitive test of a premium cabin: thirteen hours across the Pacific from San Francisco, an entire night spent in the seat. Auckland is where the Polaris promise is either proven or exposed — and it is the sector that makes United's hub system a genuinely global instrument rather than a regional one.",
  },
];

const NODES = [...HUBS, ...CHAPTERS];
const byCode = (c) => NODES.find((n) => n.code === c);

const ROUTES = [
  { from: "EWR", to: "BRI", kind: "chapter", delay: 0 },
  { from: "EWR", to: "RAK", kind: "chapter", delay: 0.3 },
  { from: "SFO", to: "AKL", kind: "chapter", delay: 0.6 },
  { from: "EWR", to: "SFO", kind: "hub", delay: 0.15 },
];

const TICKER = [
  "UA · EWR → BRI · TRANSATLANTIC · CHAPTER 01",
  "POLARIS CABIN · LIE-FLAT · 35,000 FT",
  "UA · EWR → RAK · TRANSATLANTIC · CHAPTER 02",
  "4K CINEMA CAPTURE · GRADED · BROADCAST MASTER",
  "UA · SFO → AKL · TRANSPACIFIC · CHAPTER 03",
  "3 HERO FILMS · 9 AMBIENT REELS · GLOBAL RIGHTS",
];

/** Three films, one per chapter — each carrying the same three-act spine. */
const FILMS = [
  {
    code: "BRI",
    film: "Film I",
    title: "Puglia",
    route: "EWR → BRI",
    runtime: "60s+",
    logline:
      "An overnight crossing that ends in olive groves and limestone — the case for Italy without the capital.",
    acts: [
      {
        numeral: "Act I",
        title: "The Gateway Ritual",
        icon: DoorOpen,
        beats: [
          "Curb-to-gate flow at Terminal C shot as architecture",
          "Polaris Lounge: the hush, the light, the unhurried pour",
          "The boarding door framed as a portal, not a queue",
        ],
      },
      {
        numeral: "Act II",
        title: "The Flying Sanctuary",
        icon: Moon,
        beats: [
          "Lie-flat suite at cruise — privacy, texture, stillness",
          "Dining captured as craft: plating, pour, candlelight",
          "Sleep above the weather, the Atlantic passing beneath",
        ],
      },
      {
        numeral: "Act III",
        title: "Waking Up Elsewhere",
        icon: Sunrise,
        beats: [
          "Jet bridge to Adriatic heat in under four minutes",
          "Masserie, sea walls, and the ochre of Puglian stone",
          "A coastline that has no idea it is a secret",
        ],
      },
    ],
  },
  {
    code: "RAK",
    film: "Film II",
    title: "Marrakech",
    route: "EWR → RAK",
    runtime: "60s+",
    logline:
      "Dinner at altitude, breakfast on another continent — the shortest route to genuine cultural vertigo.",
    acts: [
      {
        numeral: "Act I",
        title: "The Gateway Ritual",
        icon: DoorOpen,
        beats: [
          "The pre-flight hour treated as part of the product",
          "Lounge to gate: measured, quiet, deliberately slow",
          "Pushback at dusk, Manhattan falling away off the wing",
        ],
      },
      {
        numeral: "Act II",
        title: "The Flying Sanctuary",
        icon: Moon,
        beats: [
          "Service at 35,000 ft — the cabin as a private room",
          "Turndown, the seat becoming a bed, cabin lights low",
          "First light over the Atlas range through the window",
        ],
      },
      {
        numeral: "Act III",
        title: "Waking Up Elsewhere",
        icon: Sunrise,
        beats: [
          "First contact — air, spice, language, heat",
          "Souk geometry and riad courtyards at midday",
          "Desert light doing what no colour grade can fake",
        ],
      },
    ],
  },
  {
    code: "AKL",
    film: "Film III",
    title: "Auckland",
    route: "SFO → AKL",
    runtime: "60s+",
    logline:
      "Thirteen hours over open Pacific. The sector where a premium cabin is either proven or exposed.",
    acts: [
      {
        numeral: "Act I",
        title: "The Gateway Ritual",
        icon: DoorOpen,
        beats: [
          "San Francisco fog, the Pacific terminal, evening departure",
          "Polaris Lounge as the last still moment before the crossing",
          "The longest sector in the campaign begins in silence",
        ],
      },
      {
        numeral: "Act II",
        title: "The Flying Sanctuary",
        icon: Moon,
        beats: [
          "A full night in the seat — the real premium-cabin test",
          "Dining, then darkness, then the empty Pacific below",
          "Waking to a horizon with nothing behind it",
        ],
      },
      {
        numeral: "Act III",
        title: "Waking Up Elsewhere",
        icon: Sunrise,
        beats: [
          "Off the aircraft into hemisphere-flipped light",
          "Harbour, volcanic rock, and a city built on water",
          "The arrival that rewrites the traveller's sense of distance",
        ],
      },
    ],
  },
];

const DELIVERABLES = [
  {
    icon: Clapperboard,
    tag: "Hero",
    count: "3×",
    title: "Hero Cinematic Campaigns",
    spec: "60s+ · Fully scripted · One per Chapter",
    body:
      "Three narrative-driven short films — one dedicated film each for Bari, Marrakech and Auckland — carrying the full three-act arc from gateway ritual to arrival. Story-boarded, scored, and graded to broadcast standard. Built to headline a campaign, not fill a feed.",
    points: [
      "Script and shot list approved pre-production",
      "Licensed score and original sound design",
      "16:9, 9:16 and 1:1 masters per film",
    ],
  },
  {
    icon: Film,
    tag: "Ambient",
    count: "9×",
    title: "Ambient Experience Reels",
    spec: "Short-form · Native social · 3 per Chapter",
    body:
      "Nine rapid, organic, high-vibe vignettes blending in-flight cabin luxury with destination micro-moments. Atmosphere over announcement — engineered for subtle, native placement where the marketing never reads as marketing.",
    points: [
      "Three reels per chapter for balanced rollout",
      "Optimised for Reels, Shorts and TikTok",
      "Sound-on and sound-off cuts supplied",
    ],
  },
  {
    icon: ShieldCheck,
    tag: "Rights",
    count: "∞",
    title: "Global Usage & Licensing",
    spec: "Perpetual · Worldwide · All digital",
    body:
      "Full commercial usage rights across United's organic and paid digital media. No renewal windows, no territory carve-outs, no per-placement negotiation once delivered.",
    points: [
      "Organic and paid social, owned web, in-flight entertainment",
      "Worldwide territory, all digital formats",
      "Raw selects available on request",
    ],
  },
];

const METRICS = [
  { icon: Users, value: "110K+", label: "Followers", sub: "Combined across platforms" },
  { icon: Eye, value: "250M+", label: "Total views", sub: "Lifetime across platforms" },
  { icon: TrendingUp, value: "17.4%", label: "Avg. engagement rate", sub: "Across published content" },
  { icon: Globe2, value: "US", label: "Primary market", sub: "Majority US-based audience" },
];

const AUDIENCE_BARS = [
  { label: "Age 24–35", pct: 44 },
  { label: "Male", pct: 52 },
  { label: "Female", pct: 48 },
];

const CRAFT = [
  { icon: Camera, title: "4K cinema capture", body: "Full-frame cinema bodies, prime glass, gimbal and FPV coverage. Shot log, delivered graded." },
  { icon: Palette, title: "Signature colour", body: "Custom show LUT built per campaign — warm highlight roll-off, deep neutral shadow, never crushed." },
  { icon: Film, title: "Story before spectacle", body: "Every sequence written first. Drone shots earn their place or they don't make the cut." },
];

const CONTACT_EMAIL = "geri@legefilms.com";
const INSTAGRAM_URL = "https://www.instagram.com/legefilms/";

/* ========================================================================
   5. PRIMITIVES
   ===================================================================== */

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

function Eyebrow({ children }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-8 bg-[#00A3E0]/60" />
      <span className="bth-mono text-[11px] uppercase tracking-[0.34em] text-[#00A3E0]">
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

/** Image with a graceful fallback naming the missing file. */
function Media({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#0A0D14] via-[#0E1622] to-[#05070B]">
        <ImageOff className="h-6 w-6 text-[#00A3E0]/40" />
        <p className="bth-mono px-6 text-center text-[10px] uppercase tracking-[0.18em] text-[#94A3B8]/70">
          {src ? src.replace("./assets/", "") : "no image supplied"}
        </p>
        {src && (
          <p className="bth-mono text-[9px] uppercase tracking-[0.24em] text-[#94A3B8]/40">
            Drop into public/assets/
          </p>
        )}
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

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ========================================================================
   6. HERO HUD FURNITURE
   ===================================================================== */

/** Thin corner bracket — the frame of a viewfinder. */
function HudCorner({ position }) {
  const map = {
    tl: "left-6 top-24 border-l border-t md:left-10",
    tr: "right-6 top-24 border-r border-t md:right-10",
    bl: "bottom-24 left-6 border-b border-l md:left-10",
    br: "bottom-24 right-6 border-b border-r md:right-10",
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.9, ease: EASE }}
      className={`pointer-events-none absolute h-10 w-10 border-[#00A3E0]/35 ${map[position]}`}
    />
  );
}

/** Electric-blue rule with a light travelling along it. */
function StatusLine({ className = "", delay = 0 }) {
  return (
    <div className={`relative h-px w-full overflow-hidden bg-white/10 ${className}`}>
      <motion.div
        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#00A3E0] to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "300%" }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay }}
      />
    </div>
  );
}

function Ticker() {
  const row = [...TICKER, ...TICKER];
  return (
    <div className="relative w-full overflow-hidden border-y border-white/[0.07] bg-white/[0.015] py-3">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#05070B] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#05070B] to-transparent" />
      <motion.div
        className="flex w-max gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
      >
        {row.map((t, i) => (
          <span
            key={i}
            className="bth-mono flex items-center gap-3 text-[10px] uppercase tracking-[0.26em] text-[#94A3B8]/55"
          >
            <span className="h-1 w-1 rounded-full bg-[#00A3E0]/70" />
            {t}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ========================================================================
   7. WORLD MAP
   ===================================================================== */

function WorldMap({ active, onSelect }) {
  const routes = ROUTES.map((r) => {
    const a = byCode(r.from);
    const b = byCode(r.to);
    const p1 = project([a.lon, a.lat]);
    const p2 = project([b.lon, b.lat]);
    return {
      ...r,
      id: `route-${r.from}-${r.to}`,
      d: arcPath(p1, p2, r.kind === "hub" ? 0.1 : 0.2),
      isActive: active === r.to || active === r.from,
    };
  });

  return (
    <svg
      viewBox="0 0 1000 450"
      className="w-full select-none"
      role="img"
      aria-label="World route map: Newark to Bari and Marrakech, San Francisco to Auckland"
    >
      <defs>
        <filter id="bth-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="bth-route" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={UA_BLUE} stopOpacity="0.3" />
          <stop offset="50%" stopColor={UA_GLOW} stopOpacity="1" />
          <stop offset="100%" stopColor={UA_BLUE} stopOpacity="0.3" />
        </linearGradient>
        <radialGradient id="bth-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={UA_GLOW} stopOpacity="0.18" />
          <stop offset="100%" stopColor={UA_GLOW} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient wash */}
      <ellipse cx="560" cy="150" rx="300" ry="170" fill="url(#bth-halo)" />
      <ellipse cx="300" cy="330" rx="240" ry="150" fill="url(#bth-halo)" />

      {/* Graticule */}
      {[-60, -30, 0, 30, 60].map((lat) => {
        const y = project([0, lat])[1];
        return (
          <line
            key={`lat${lat}`}
            x1="0"
            y1={y}
            x2="1000"
            y2={y}
            stroke="#FFFFFF"
            strokeOpacity={lat === 0 ? 0.09 : 0.04}
            strokeDasharray={lat === 0 ? "2 8" : undefined}
          />
        );
      })}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <line
          key={`lon${i}`}
          x1={i * 125}
          y1="0"
          x2={i * 125}
          y2="450"
          stroke="#FFFFFF"
          strokeOpacity="0.03"
        />
      ))}

      {/* Continents */}
      <g>
        {Object.entries(LAND).map(([name, ring]) => (
          <path
            key={name}
            d={landPath(ring)}
            fill="#0E1724"
            fillOpacity="0.95"
            stroke={UA_GLOW}
            strokeOpacity="0.22"
            strokeWidth="0.7"
            strokeLinejoin="round"
          />
        ))}
      </g>

      {/* Routes */}
      {routes.map((r) => (
        <g key={r.id}>
          <path
            d={r.d}
            id={r.id}
            fill="none"
            stroke={UA_BLUE}
            strokeOpacity={r.kind === "hub" ? 0.16 : 0.3}
            strokeWidth={r.kind === "hub" ? 3 : 6}
          />
          <motion.path
            d={r.d}
            fill="none"
            stroke={r.kind === "hub" ? UA_BLUE : "url(#bth-route)"}
            strokeWidth={r.kind === "hub" ? 0.9 : 1.6}
            strokeLinecap="round"
            strokeDasharray={r.kind === "hub" ? "4 6" : undefined}
            filter={r.kind === "hub" ? undefined : "url(#bth-glow)"}
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: r.kind === "hub" ? 0.5 : 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, delay: r.delay, ease: EASE }}
          />
          {r.kind === "chapter" && (
            <>
              <motion.path
                d={r.d}
                fill="none"
                stroke={UA_GLOW}
                strokeWidth="1.1"
                strokeDasharray="3 14"
                strokeOpacity={r.isActive ? 0.9 : 0.5}
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: -170 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />
              <circle r="3" fill="#FFFFFF" filter="url(#bth-glow)">
                <animateMotion
                  dur="7s"
                  repeatCount="indefinite"
                  rotate="auto"
                  begin={`${r.delay}s`}
                >
                  {/* Both forms: Safari still requires xlink:href on <mpath>. */}
                  <mpath href={`#${r.id}`} xlinkHref={`#${r.id}`} />
                </animateMotion>
              </circle>
            </>
          )}
        </g>
      ))}

      {/* Nodes */}
      {NODES.map((n, i) => {
        const [x, y] = project([n.lon, n.lat]);
        const isActive = active === n.code;
        const isHub = n.kind === "hub";
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
            <circle cx={x} cy={y} r="32" fill="transparent" />
            <motion.circle
              cx={x}
              cy={y}
              r={isActive ? 24 : 18}
              fill={UA_GLOW}
              fillOpacity="0.08"
              stroke={UA_GLOW}
              strokeOpacity={isActive ? 0.55 : 0.2}
              animate={{ r: isActive ? 24 : 18 }}
              transition={{ duration: 0.45, ease: EASE }}
            />
            <motion.circle
              cx={x}
              cy={y}
              r="12"
              fill="none"
              stroke={UA_GLOW}
              strokeOpacity="0.5"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                delay: i * 0.45,
                ease: "easeOut",
              }}
              // Pinned explicitly: without it the scale origin is
              // browser-dependent and the ping expands from the wrong point.
              style={{ transformBox: "view-box", transformOrigin: `${x}px ${y}px` }}
            />
            {isHub ? (
              <rect
                x={x - 4.5}
                y={y - 4.5}
                width="9"
                height="9"
                fill="#FFFFFF"
                filter="url(#bth-glow)"
                transform={`rotate(45 ${x} ${y})`}
              />
            ) : (
              <circle
                cx={x}
                cy={y}
                r={isActive ? 6.5 : 5}
                fill="#FFFFFF"
                filter="url(#bth-glow)"
              />
            )}
            <text
              x={x}
              y={y + 42}
              textAnchor="middle"
              fill="#FFFFFF"
              style={{ fontSize: 16, letterSpacing: 3, fontWeight: 600 }}
              opacity={isActive ? 1 : 0.78}
            >
              {n.code}
            </text>
            <text
              x={x}
              y={y + 60}
              textAnchor="middle"
              fill="#94A3B8"
              style={{ fontSize: 11, letterSpacing: 1.6 }}
              opacity={isActive ? 1 : 0.6}
            >
              {(isHub ? "HUB · " : "") + n.city.toUpperCase()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function NodeCard({ node }) {
  const isChapter = node.kind === "chapter";
  return (
    <motion.article
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
      transition={{ duration: 0.5, ease: EASE }}
      className="w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-[0_30px_80px_-40px_rgba(0,163,224,0.45)] backdrop-blur-xl"
    >
      <div className="relative h-52 w-full overflow-hidden md:h-60">
        <Media
          src={node.img}
          alt={`${node.city}, ${node.country}`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/30 to-transparent" />
        <div className="absolute left-6 top-6 flex items-center gap-2">
          <span className="bth-mono rounded-full border border-[#00A3E0]/40 bg-[#05070B]/70 px-3 py-1 text-[10px] uppercase tracking-[0.26em] text-[#00A3E0] backdrop-blur-md">
            {node.code}
          </span>
          <span className="bth-mono rounded-full border border-white/10 bg-[#05070B]/60 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#94A3B8] backdrop-blur-md">
            {isChapter ? node.chapter : node.label}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-6 md:p-8">
        <div>
          {isChapter && (
            <p className="bth-mono text-[10px] uppercase tracking-[0.3em] text-[#00A3E0]">
              {node.chapter} · {node.continent}
            </p>
          )}
          <h3 className="bth-display mt-2 text-2xl font-light tracking-tight text-white md:text-3xl">
            {node.city}
            <span className="text-[#94A3B8]">, {node.country}</span>
            <span className="bth-mono ml-2 text-base text-[#00A3E0]">[{node.code}]</span>
          </h3>
          <p className="bth-mono mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.18em] text-[#94A3B8]">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-[#00A3E0]" />
              {node.airport}
            </span>
            <span className="text-[#94A3B8]/50">{node.coords}</span>
          </p>
        </div>

        <StatusLine />

        <div>
          {isChapter ? (
            <>
              <p className="bth-mono text-[10px] uppercase tracking-[0.3em] text-[#00A3E0]">
                Chapter hook
              </p>
              <p className="bth-display mt-2 text-lg font-light text-white">
                {node.tagline}
              </p>
            </>
          ) : (
            <p className="bth-mono text-[10px] uppercase tracking-[0.3em] text-[#00A3E0]">
              {node.label}
            </p>
          )}
          <p className="mt-3 text-sm leading-relaxed text-[#94A3B8]">{node.hook}</p>
        </div>

        {isChapter && (
          <div className="bth-mono flex items-center gap-2 pt-1 text-[10px] uppercase tracking-[0.22em] text-[#94A3B8]/70">
            <Plane className="h-3 w-3 rotate-45 text-[#00A3E0]" />
            {node.origin} <ArrowRight className="h-3 w-3" /> {node.code}
          </div>
        )}
      </div>
    </motion.article>
  );
}

/* ========================================================================
   8. MAIN
   ===================================================================== */

export default function BeyondTheHorizon() {
  const [active, setActive] = useState("BRI");
  const [activeFilm, setActiveFilm] = useState("BRI");
  const heroRef = React.useRef(null);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(heroProgress, [0, 0.7], [1, 0]);

  const activeNode = byCode(active) || CHAPTERS[0];
  const film = FILMS.find((f) => f.code === activeFilm) || FILMS[0];

  return (
    <div className="min-h-screen w-full bg-[#05070B] text-white antialiased selection:bg-[#00A3E0]/30">
      {/* Typography: wide technical display + mono for HUD data.
          Kept in-component so this file stays self-contained. */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
        .bth-display { font-family: 'Space Grotesk', 'Inter', ui-sans-serif, system-ui, sans-serif; }
        .bth-mono    { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace; }
        .bth-wide    { letter-spacing: 0.14em; }
      `}</style>

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
            className="bth-display flex items-center gap-2.5 text-sm font-medium tracking-[0.2em] text-white"
          >
            <Plane className="h-4 w-4 rotate-45 text-[#00A3E0]" />
            BTH
          </button>
          <div className="bth-mono hidden items-center gap-9 text-[10px] uppercase tracking-[0.24em] text-[#94A3B8] md:flex">
            {[
              ["Chapters", "chapters"],
              ["Films", "films"],
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
            className="bth-mono rounded-full border border-[#00A3E0]/40 bg-[#00A3E0]/10 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#00A3E0] transition-all duration-300 hover:bg-[#00A3E0]/20 hover:shadow-[0_0_24px_-4px_rgba(0,163,224,0.7)]"
          >
            Contact
          </button>
        </nav>
      </header>

      {/* ================= HERO ================= */}
      <section
        ref={heroRef}
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
      >
        {/* Atmospheric field */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/3 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#005DA6] opacity-[0.18] blur-[160px]" />
          <div className="absolute bottom-0 left-1/4 h-[420px] w-[420px] rounded-full bg-[#00A3E0] opacity-[0.10] blur-[170px]" />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage: "radial-gradient(ellipse at center, black 15%, transparent 70%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 15%, transparent 70%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#05070B] to-transparent" />
        </div>

        <HudCorner position="tl" />
        <HudCorner position="tr" />
        <HudCorner position="bl" />
        <HudCorner position="br" />

        {/* HUD readouts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="bth-mono pointer-events-none absolute left-6 top-28 hidden text-[10px] uppercase leading-relaxed tracking-[0.2em] text-[#94A3B8]/60 md:block md:left-10"
        >
          <p className="text-[#00A3E0]/80">[ 40.6892° N, 74.1745° W ]</p>
          <p>EWR HUB · ORIGIN</p>
          <p className="mt-3 text-[#00A3E0]/80">[ 37.6213° N, 122.3790° W ]</p>
          <p>SFO HUB · ORIGIN</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.25 }}
          className="bth-mono pointer-events-none absolute right-6 top-28 hidden text-right text-[10px] uppercase leading-relaxed tracking-[0.2em] text-[#94A3B8]/60 md:block md:right-10"
        >
          <p className="flex items-center justify-end gap-2 text-[#00A3E0]/80">
            <Radio className="h-3 w-3" />
            SYS / NOMINAL
          </p>
          <p>03 CHAPTERS · 03 FILMS</p>
          <p>09 AMBIENT REELS</p>
          <p className="mt-3">REV 2.0 · CONFIDENTIAL</p>
        </motion.div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 flex w-full max-w-5xl flex-col items-center px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE }}
          >
            <div className="mb-10 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00A3E0] shadow-[0_0_10px_#00A3E0]" />
              <span className="bth-mono text-[10px] uppercase tracking-[0.34em] text-[#94A3B8]">
                Confidential · United Airlines
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(14px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.4, delay: 0.15, ease: EASE }}
            className="bth-display bth-wide text-[11vw] font-light leading-[0.95] text-white sm:text-6xl md:text-7xl lg:text-[6.5rem]"
          >
            BEYOND
            <br />
            <span className="bg-gradient-to-b from-white via-white to-[#8fa3b8] bg-clip-text text-transparent">
              THE HORIZON
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.7, ease: EASE }}
            className="mt-10 w-full max-w-md"
          >
            <StatusLine />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: EASE }}
            className="bth-mono mt-8 max-w-xl text-[11px] uppercase leading-relaxed tracking-[0.24em] text-[#94A3B8]"
          >
            A Narrative Campaign Proposal by{" "}
            <span className="text-white">@legefilms</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.95, ease: EASE }}
            className="mt-12"
          >
            <button
              onClick={() => scrollToId("chapters")}
              className="bth-mono group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-[#00A3E0]/45 bg-[#00A3E0]/[0.08] px-8 py-4 text-[11px] uppercase tracking-[0.24em] text-white shadow-[0_0_40px_-12px_rgba(0,163,224,0.85)] transition-all duration-500 hover:border-[#00A3E0] hover:bg-[#00A3E0]/20 hover:shadow-[0_0_60px_-10px_rgba(0,163,224,1)]"
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

        {/* Flight status ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="absolute inset-x-0 bottom-0 z-10"
        >
          <Ticker />
        </motion.div>
      </section>

      {/* ================= CHAPTERS / MAP ================= */}
      <Section id="chapters">
        <Reveal>
          <Eyebrow>The Route Strategy</Eyebrow>
          <h2 className="bth-display mt-6 max-w-3xl text-4xl font-light leading-[1.08] tracking-tight text-white md:text-6xl">
            Three chapters.
            <br />
            <span className="text-[#94A3B8]">One hub system.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[#94A3B8] md:text-base">
            The campaign radiates from United's two gateway hubs — Newark and San
            Francisco — into three continents. Each chapter is a self-contained
            film with its own culture, palette and argument for the network.
            Select a node to preview the leg.
          </p>
        </Reveal>

        {/* Chapter selector */}
        <Reveal delay={0.08}>
          <div className="mt-12 grid gap-3 sm:grid-cols-3">
            {CHAPTERS.map((c) => (
              <button
                key={c.code}
                onMouseEnter={() => setActive(c.code)}
                onClick={() => setActive(c.code)}
                className={`group rounded-2xl border p-5 text-left transition-all duration-500 ${
                  active === c.code
                    ? "border-[#00A3E0]/50 bg-[#00A3E0]/[0.07] shadow-[0_24px_60px_-40px_rgba(0,163,224,0.9)]"
                    : "border-white/10 bg-white/[0.02] hover:border-white/25"
                }`}
              >
                <div className="bth-mono flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-[#00A3E0]">
                  {c.chapter}
                  <span className="text-[#94A3B8]/60">{c.continent}</span>
                </div>
                <p className="bth-display mt-3 text-xl font-light text-white">
                  {c.city}{" "}
                  <span className="bth-mono text-sm text-[#94A3B8]">[{c.code}]</span>
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[#94A3B8]">
                  {c.tagline}
                </p>
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.45fr_1fr] lg:items-center">
          <Reveal delay={0.12}>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0A0D14]/70 p-4 backdrop-blur-md md:p-6">
              <div className="pointer-events-none absolute -left-24 top-1/4 h-64 w-64 rounded-full bg-[#005DA6] opacity-20 blur-[110px]" />

              <div className="bth-mono mb-3 flex items-center justify-between px-2 text-[9px] uppercase tracking-[0.24em] text-[#94A3B8]/50">
                <span>Global Route Map · Equirectangular</span>
                <span className="text-[#00A3E0]/70">03 Active Sectors</span>
              </div>

              <WorldMap active={active} onSelect={setActive} />

              <div className="mt-2 flex flex-wrap items-center gap-2 px-2 pb-1">
                {NODES.map((n) => (
                  <button
                    key={n.code}
                    onMouseEnter={() => setActive(n.code)}
                    onClick={() => setActive(n.code)}
                    className={`bth-mono rounded-full border px-3.5 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
                      active === n.code
                        ? "border-[#00A3E0]/60 bg-[#00A3E0]/15 text-white shadow-[0_0_22px_-6px_rgba(0,163,224,0.9)]"
                        : "border-white/10 text-[#94A3B8] hover:border-white/25 hover:text-white"
                    }`}
                  >
                    {n.kind === "hub" ? `◆ ${n.code}` : n.code}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <AnimatePresence mode="wait">
              <NodeCard key={activeNode.code} node={activeNode} />
            </AnimatePresence>
          </Reveal>
        </div>
      </Section>

      {/* ================= FILMS / NARRATIVE ================= */}
      <div className="relative border-y border-white/5 bg-[#0A0D14]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute right-0 top-1/3 h-[500px] w-[500px] rounded-full bg-[#005DA6] opacity-[0.12] blur-[150px]" />
        </div>

        <Section id="films">
          <Reveal>
            <Eyebrow>The Narrative</Eyebrow>
            <h2 className="bth-display mt-6 max-w-3xl text-4xl font-light leading-[1.08] tracking-tight text-white md:text-6xl">
              The Journey{" "}
              <span className="italic text-[#00A3E0]">is</span> the Destination.
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[#94A3B8] md:text-base">
              Three dedicated hero films, one per chapter. Each carries the same
              three-act spine — the flying experience as the story, not the
              transition between stories.
            </p>
          </Reveal>

          {/* Film selector */}
          <Reveal delay={0.08}>
            <div className="mt-12 flex flex-wrap gap-3">
              {FILMS.map((f) => (
                <button
                  key={f.code}
                  onClick={() => setActiveFilm(f.code)}
                  className={`bth-mono rounded-full border px-5 py-2.5 text-[10px] uppercase tracking-[0.22em] transition-all duration-500 ${
                    activeFilm === f.code
                      ? "border-[#00A3E0]/55 bg-[#00A3E0]/12 text-white shadow-[0_0_28px_-8px_rgba(0,163,224,0.95)]"
                      : "border-white/10 text-[#94A3B8] hover:border-white/25 hover:text-white"
                  }`}
                >
                  {f.film} · {f.title}
                </button>
              ))}
            </div>
          </Reveal>

          <AnimatePresence mode="wait">
            <motion.div
              key={film.code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              {/* Film header */}
              <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl md:p-10">
                <div className="bth-mono flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] uppercase tracking-[0.24em] text-[#00A3E0]">
                  <span>{film.film}</span>
                  <span className="text-[#94A3B8]/50">{film.route}</span>
                  <span className="text-[#94A3B8]/50">{film.runtime}</span>
                </div>
                <h3 className="bth-display bth-wide mt-4 text-3xl font-light text-white md:text-5xl">
                  {film.title.toUpperCase()}
                </h3>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#94A3B8] md:text-base">
                  {film.logline}
                </p>
                <div className="mt-7">
                  <StatusLine />
                </div>
              </div>

              {/* Three acts */}
              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {film.acts.map((act, i) => {
                  const Icon = act.icon;
                  return (
                    <motion.div
                      key={act.numeral}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                      className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025] p-8 backdrop-blur-md transition-all duration-500 hover:border-[#00A3E0]/30 hover:bg-white/[0.05] hover:shadow-[0_30px_70px_-40px_rgba(0,163,224,0.7)]"
                    >
                      <div className="bth-display absolute right-6 top-6 text-6xl font-light text-white/[0.04] transition-colors duration-500 group-hover:text-[#00A3E0]/10">
                        0{i + 1}
                      </div>

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#00A3E0]/25 bg-[#00A3E0]/10">
                        <Icon className="h-5 w-5 text-[#00A3E0]" />
                      </div>

                      <p className="bth-mono mt-7 text-[10px] uppercase tracking-[0.32em] text-[#00A3E0]">
                        {act.numeral}
                      </p>
                      <h4 className="bth-display mt-2 text-2xl font-light tracking-tight text-white">
                        {act.title}
                      </h4>

                      <div className="my-6 h-px w-full bg-white/10" />

                      <ul className="space-y-3">
                        {act.beats.map((b) => (
                          <li
                            key={b}
                            className="flex gap-3 text-sm leading-relaxed text-[#94A3B8]"
                          >
                            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#00A3E0]" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </Section>
      </div>

      {/* ================= DELIVERABLES ================= */}
      <Section id="deliverables">
        <Reveal>
          <Eyebrow>The Package</Eyebrow>
          <h2 className="bth-display mt-6 max-w-3xl text-4xl font-light leading-[1.08] tracking-tight text-white md:text-6xl">
            Campaign deliverables.
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[#94A3B8] md:text-base">
            Two content streams built to work together — three films that
            headline, nine reels that live natively in the feed — plus rights
            that never expire.
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
                    <span className="bth-mono rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[#94A3B8]">
                      {d.tag}
                    </span>
                  </div>

                  <div className="mt-8 flex items-baseline gap-3">
                    <span className="bth-display text-4xl font-light tracking-tight text-[#00A3E0]">
                      {d.count}
                    </span>
                    <h3 className="bth-display text-xl font-light tracking-tight text-white">
                      {d.title}
                    </h3>
                  </div>
                  <p className="bth-mono mt-2 text-[10px] uppercase tracking-[0.2em] text-[#94A3B8]">
                    {d.spec}
                  </p>

                  <p className="mt-6 text-sm leading-relaxed text-[#94A3B8]">{d.body}</p>

                  <div className="my-6 h-px w-full bg-white/10" />

                  <ul className="mt-auto space-y-2.5">
                    {d.points.map((p) => (
                      <li
                        key={p}
                        className="flex gap-3 text-[13px] leading-relaxed text-[#94A3B8]"
                      >
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
            <h2 className="bth-display mt-6 max-w-3xl text-4xl font-light leading-[1.08] tracking-tight text-white md:text-6xl">
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
                    <p className="bth-display text-2xl font-light tracking-tight text-white">
                      @legefilms
                    </p>
                    <p className="bth-mono mt-1 text-[10px] uppercase tracking-[0.26em] text-[#00A3E0]">
                      Director · Cinematographer
                    </p>
                  </div>
                </div>

                <div className="space-y-6 p-8">
                  <p className="text-sm leading-relaxed text-[#94A3B8]">
                    A travel filmmaker working in narrative documentary — scripted
                    arcs, cinema-grade capture, and a colour signature built per
                    campaign rather than pulled off a preset shelf. Work is written
                    before it is shot, and cut to hold attention well past the
                    first three seconds.
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

                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bth-mono inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] text-[#94A3B8] transition-all duration-500 hover:border-[#00A3E0]/40 hover:text-white"
                  >
                    <Instagram className="h-3.5 w-3.5 text-[#00A3E0]" />
                    Instagram (@legefilms)
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
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
                        <p className="bth-display mt-5 text-3xl font-light tracking-tight text-white md:text-4xl">
                          {m.value}
                        </p>
                        <p className="bth-mono mt-1.5 text-[10px] uppercase tracking-[0.18em] text-white/80">
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
                  <p className="bth-mono text-[10px] uppercase tracking-[0.3em] text-[#00A3E0]">
                    Audience composition
                  </p>

                  <div className="mt-7 space-y-6">
                    {AUDIENCE_BARS.map((b, i) => (
                      <div key={b.label}>
                        <div className="flex items-baseline justify-between">
                          <span className="text-[13px] text-[#94A3B8]">{b.label}</span>
                          <span className="bth-display text-sm font-light text-white">
                            {b.pct}%
                          </span>
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
                    Creator-reported platform analytics. Full media kit and raw
                    platform exports available on request.
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
          <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-white/[0.035] p-10 text-center shadow-[0_50px_120px_-60px_rgba(0,163,224,0.9)] backdrop-blur-2xl md:p-16">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#00A3E0]/30 bg-[#00A3E0]/10">
              <Plane className="h-5 w-5 rotate-45 text-[#00A3E0]" />
            </div>

            <h2 className="bth-display mt-9 text-4xl font-light leading-[1.1] tracking-tight text-white md:text-5xl">
              Ready to elevate
              <br />
              <span className="text-[#94A3B8]">the journey?</span>
            </h2>

            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-[#94A3B8]">
              Available for a 30-minute walkthrough of the treatment, production
              schedule, and delivery timeline across all three chapters.
            </p>

            <div className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Beyond%20The%20Horizon%20%E2%80%94%20Executive%20Pitch%20Call`}
                className="bth-mono group relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full border border-[#00A3E0]/50 bg-[#00A3E0]/12 px-8 py-4 text-[11px] uppercase tracking-[0.22em] text-white shadow-[0_0_44px_-12px_rgba(0,163,224,0.95)] transition-all duration-500 hover:border-[#00A3E0] hover:bg-[#00A3E0]/25 hover:shadow-[0_0_66px_-10px_rgba(0,163,224,1)] sm:w-auto"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <CalendarDays className="h-4 w-4 text-[#00A3E0]" />
                Schedule Executive Pitch Call
              </a>

              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bth-mono inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-white/12 bg-white/[0.03] px-8 py-4 text-[11px] uppercase tracking-[0.22em] text-[#94A3B8] transition-all duration-500 hover:border-white/30 hover:text-white sm:w-auto"
              >
                <Instagram className="h-4 w-4" />
                Instagram (@legefilms)
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="mt-12 flex flex-col items-center gap-2 border-t border-white/10 pt-9">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-2 text-sm text-white transition-colors hover:text-[#00A3E0]"
              >
                <Mail className="h-3.5 w-3.5 text-[#00A3E0]" />
                {CONTACT_EMAIL}
              </a>
              <p className="bth-mono text-[10px] uppercase tracking-[0.26em] text-[#94A3B8]">
                @legefilms
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mx-auto mt-20 flex max-w-3xl flex-col items-center gap-3 text-center">
            <div className="bth-mono flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/25">
              <span className="h-px w-10 bg-white/10" />
              Beyond The Horizon
              <span className="h-px w-10 bg-white/10" />
            </div>
            <p className="bth-mono text-[10px] uppercase tracking-[0.2em] text-white/20">
              Prepared for United Airlines Marketing · Confidential ·{" "}
              {new Date().getFullYear()}
            </p>
          </div>
        </Reveal>
      </Section>
    </div>
  );
}
