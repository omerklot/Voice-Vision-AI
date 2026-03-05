'use client';

import { motion, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.15, ease: 'easeOut' },
  }),
};

type MousePos = { x: number; y: number } | null;
type VisualProps = { mouse: MousePos; isHovered: boolean };

// ─── Scanner HUD — Vision Product Visual ──────────────────────────────────────

function ScannerHUD(_props: VisualProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [localMouse, setLocalMouse] = useState<{ x: number; y: number } | null>(null);

  const handleSvgMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const r = svgRef.current.getBoundingClientRect();
    setLocalMouse({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  // Convert pixel coords → SVG viewBox coords; clamp to 8-unit radius from center
  const CX = 100, CY = 100;
  let px = CX, py = CY;
  if (localMouse) {
    const sx = (localMouse.x / 208) * 200;
    const sy = (localMouse.y / 208) * 200;
    const dx = sx - CX, dy = sy - CY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 0) {
      const s = Math.min(dist, 8) / dist;
      px = CX + dx * s;
      py = CY + dy * s;
    }
  }

  return (
    <div className="relative flex items-center justify-center w-52 h-52 shrink-0" aria-hidden="true">
      <svg
        ref={svgRef}
        viewBox="0 0 200 200"
        width="208"
        height="208"
        fill="none"
        aria-hidden="true"
        onMouseMove={handleSvgMove}
        onMouseLeave={() => setLocalMouse(null)}
      >
        <defs>
          <radialGradient id="hud-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00C9A7" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#00C9A7" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="iris-fill" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00EDCA" stopOpacity="0.22" />
            <stop offset="70%" stopColor="#00C9A7" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#00C9A7" stopOpacity="0" />
          </radialGradient>
          <filter id="p-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="sl-glow" x="-200%" y="-150%" width="500%" height="400%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Ambient glow disc */}
        <circle cx="100" cy="100" r="90" fill="url(#hud-bg)" />

        {/* Corner brackets — 4 × L-shape */}
        {([
          [[18, 36], [18, 18], [36, 18]],
          [[164, 18], [182, 18], [182, 36]],
          [[18, 164], [18, 182], [36, 182]],
          [[164, 182], [182, 182], [182, 164]],
        ] as [number, number][][]).map((pts, bi) => (
          <polyline
            key={bi}
            points={pts.map(([x, y]) => `${x},${y}`).join(' ')}
            stroke="#00C9A7"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.9"
            fill="none"
          />
        ))}

        {/* Outer dashed ring — slow clockwise rotation */}
        <motion.circle
          cx="100" cy="100" r="83"
          stroke="#00C9A7" strokeWidth="0.5" strokeOpacity="0.2"
          strokeDasharray="2 11"
          animate={{ rotate: 360 }}
          transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '100px 100px' }}
        />

        {/* Mid arc ring — counter-clockwise */}
        <motion.circle
          cx="100" cy="100" r="67"
          stroke="#00C9A7" strokeWidth="1" strokeOpacity="0.18"
          strokeDasharray="48 28"
          strokeLinecap="round"
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '100px 100px' }}
        />

        {/* Iris outer ring */}
        <circle cx="100" cy="100" r="41" stroke="#00C9A7" strokeWidth="0.8" strokeOpacity="0.5" />
        {/* Iris glow fill */}
        <circle cx="100" cy="100" r="41" fill="url(#iris-fill)" />
        {/* Iris inner detail rings */}
        <circle cx="100" cy="100" r="29" stroke="#00C9A7" strokeWidth="0.5" strokeOpacity="0.28" />
        <circle cx="100" cy="100" r="17" stroke="#00C9A7" strokeWidth="0.4" strokeOpacity="0.2" />

        {/* Scan line — sweeps through iris vertically */}
        <motion.g
          animate={{ y: [-40, 40], opacity: [0, 1, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6 }}
        >
          <line
            x1="61" y1="100" x2="139" y2="100"
            stroke="#00EDCA" strokeWidth="0.9" strokeLinecap="round"
            filter="url(#sl-glow)"
          />
        </motion.g>

        {/* Cardinal axis ticks */}
        <line x1="100" y1="56" x2="100" y2="63" stroke="#00C9A7" strokeWidth="0.8" strokeOpacity="0.4" strokeLinecap="round" />
        <line x1="100" y1="137" x2="100" y2="144" stroke="#00C9A7" strokeWidth="0.8" strokeOpacity="0.4" strokeLinecap="round" />
        <line x1="56" y1="100" x2="63" y2="100" stroke="#00C9A7" strokeWidth="0.8" strokeOpacity="0.4" strokeLinecap="round" />
        <line x1="137" y1="100" x2="144" y2="100" stroke="#00C9A7" strokeWidth="0.8" strokeOpacity="0.4" strokeLinecap="round" />

        {/* Pupil — spring-follows local mouse, three-layer depth */}
        <motion.circle
          cx={CX} cy={CY} r="10"
          fill="#00C9A7" fillOpacity="0.82"
          filter="url(#p-glow)"
          animate={{ cx: px, cy: py }}
          transition={{ type: 'spring', stiffness: 200, damping: 24 }}
        />
        <motion.circle
          cx={CX} cy={CY} r="5.2"
          fill="#00EDCA"
          animate={{ cx: px, cy: py }}
          transition={{ type: 'spring', stiffness: 200, damping: 24 }}
        />
        <motion.circle
          cx={CX} cy={CY} r="2"
          fill="#ffffff" fillOpacity="0.9"
          animate={{ cx: px, cy: py }}
          transition={{ type: 'spring', stiffness: 200, damping: 24 }}
        />
      </svg>
    </div>
  );
}

// ─── Audio Spectrum — Voice Product Visual ────────────────────────────────────

const BAR_COUNT = 24;
const INNER_R = 46;
const BAR_W = 2.5;
const BAR_MAX_H = 18;
const BAR_MIN_H = 4;

// Precompute bar positions (module-level, stable)
const barPositions = Array.from({ length: BAR_COUNT }, (_, i) => {
  const angle = (i / BAR_COUNT) * 2 * Math.PI - Math.PI / 2;
  return {
    x: 100 + INNER_R * Math.cos(angle),
    y: 100 + INNER_R * Math.sin(angle),
    rotDeg: (angle * 180) / Math.PI + 90,
  };
});

// Deterministic phase offsets — avoids SSR/hydration mismatch
const barPhases = Array.from({ length: BAR_COUNT }, (_, i) => ((i * 7 + 3) % BAR_COUNT) / BAR_COUNT);

function AudioSpectrum({ isHovered }: VisualProps) {
  const maxH = isHovered ? 24 : BAR_MAX_H;
  const speed = isHovered ? 0.65 : 1.1;

  return (
    <div className="relative flex items-center justify-center w-52 h-52 shrink-0" aria-hidden="true">
      <svg viewBox="0 0 200 200" width="208" height="208" fill="none" aria-hidden="true">
        <defs>
          <radialGradient id="mic-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00C9A7" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#00C9A7" stopOpacity="0" />
          </radialGradient>
          <filter id="mic-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Ambient glow */}
        <circle cx="100" cy="100" r="90" fill="url(#mic-bg)" />

        {/* Expanding soundwave rings — staggered outward pulse */}
        {([0, 0.75, 1.5] as const).map((delay, i) => (
          <motion.circle
            key={i}
            cx="100" cy="100"
            r={24 + i * 7}
            stroke="#00C9A7"
            strokeWidth="0.6"
            fill="none"
            animate={{ scale: [1, 1.8], opacity: [0.35, 0] }}
            transition={{ duration: 2.4, delay, repeat: Infinity, ease: 'easeOut' }}
            style={{ transformOrigin: '100px 100px' }}
          />
        ))}

        {/* Spectrum bars — 24 bars in a ring, each height-animated with phase offset */}
        {barPositions.map(({ x, y, rotDeg }, i) => (
          <g
            key={i}
            transform={`translate(${x.toFixed(2)},${y.toFixed(2)}) rotate(${rotDeg.toFixed(2)})`}
          >
            <motion.rect
              x={-BAR_W / 2}
              y={-maxH}
              width={BAR_W}
              height={maxH}
              rx={BAR_W / 2}
              fill="#00C9A7"
              fillOpacity={0.65}
              animate={{
                height: [BAR_MIN_H, maxH, BAR_MIN_H],
                y: [-BAR_MIN_H, -maxH, -BAR_MIN_H],
              }}
              transition={{
                duration: speed,
                delay: (barPhases[i] ?? 0) * speed,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </g>
        ))}

        {/* Refined mic icon */}
        <g filter="url(#mic-glow)">
          {/* Capsule body */}
          <rect
            x="90" y="76" width="20" height="32" rx="10"
            stroke="#00C9A7" strokeWidth="1.2" fill="rgba(0,201,167,0.08)"
          />
          {/* Inner capsule highlight */}
          <rect
            x="93" y="80" width="5" height="11" rx="2.5"
            fill="rgba(0,237,202,0.2)"
          />
          {/* Stand arc */}
          <path
            d="M 86 108 C 86 126 114 126 114 108"
            stroke="#00C9A7" strokeWidth="1.2" fill="none" strokeLinecap="round"
          />
          {/* Stem */}
          <line x1="100" y1="126" x2="100" y2="134" stroke="#00C9A7" strokeWidth="1.2" strokeLinecap="round" />
          {/* Base */}
          <line x1="88" y1="134" x2="112" y2="134" stroke="#00C9A7" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

type Product = {
  label: string;
  name: string;
  description: string;
  useCases: string[];
  cta: string;
  Visual: (props: VisualProps) => React.JSX.Element;
};

function ProductCard({ product, index }: { product: Product; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState<MousePos>(null);
  const { label, name, description, useCases, cta, Visual } = product;

  const scrollToContact = () => {
    const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'instant'
      : 'smooth';
    document.querySelector('#contact')?.scrollIntoView({ behavior });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMouse({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={cardRef}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMouse(null)}
      className="relative overflow-hidden rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a] p-8 md:p-12 hover:border-[#00C9A730] transition-colors duration-300 cursor-default"
    >
      {/* Mouse-reactive spotlight */}
      {mouse && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(600px circle at ${mouse.x}px ${mouse.y}px, rgba(0,201,167,0.07) 0%, transparent 70%)`,
          }}
        />
      )}

      <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
        {/* Text content */}
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#00C9A7] mb-4 block">
            {label}
          </span>
          <h3
            className="font-extrabold text-white leading-tight tracking-tight mb-5"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3.5vw, 44px)' }}
          >
            {name}
          </h3>
          <p className="text-[#888888] text-base leading-[1.8] mb-8 max-w-xl">
            {description}
          </p>
          <ul className="mb-10 flex flex-col gap-3">
            {useCases.map((uc) => (
              <li key={uc} className="flex items-start gap-3 text-[#888888] text-sm">
                <span className="text-[#00C9A7] shrink-0 mt-px" aria-hidden="true">—</span>
                {uc}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={scrollToContact}
            aria-label={`${cta} — ${name}`}
            className="flex items-center gap-2 text-[#00C9A7] text-sm font-semibold hover:gap-4 transition-all duration-200 w-fit cursor-pointer min-h-[44px]"
          >
            {cta} <ArrowRight size={14} aria-hidden="true" />
          </button>
        </div>

        {/* Product visual */}
        <Visual mouse={mouse} isHovered={mouse !== null} />
      </div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Products() {
  const t = useTranslations('products');

  const products: Product[] = [
    {
      label: t('vision.label'),
      name: t('vision.name'),
      description: t('vision.description'),
      useCases: [t('vision.useCase1'), t('vision.useCase2'), t('vision.useCase3'), t('vision.useCase4')],
      cta: t('vision.cta'),
      Visual: ScannerHUD,
    },
    {
      label: t('voice.label'),
      name: t('voice.name'),
      description: t('voice.description'),
      useCases: [t('voice.useCase1'), t('voice.useCase2'), t('voice.useCase3'), t('voice.useCase4')],
      cta: t('voice.cta'),
      Visual: AudioSpectrum,
    },
  ];

  return (
    <section
      id="products"
      role="region"
      aria-labelledby="products-heading"
      className="relative overflow-hidden bg-black py-32 px-6"
    >
      {/* Subtle grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,201,167,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,201,167,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
      {/* Vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 100% 80% at 50% 50%, transparent 40%, black 90%)' }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-4 mb-5">
            <span className="h-px w-10 bg-[#00C9A7]" aria-hidden="true" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00C9A7]">
              {t('pretag')}
            </span>
          </div>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <h2
              id="products-heading"
              className="text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('title')}
            </h2>
          </div>
        </motion.div>

        {/* Product cards */}
        <div className="flex flex-col gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.name} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
