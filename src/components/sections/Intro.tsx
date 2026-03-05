'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

// ── Loading bar fills over this duration (ms) ────────────────────────────────
const LOAD_DURATION_MS = 3800;
// ── Auto-dismiss after this delay (ms) ──────────────────────────────────────
const AUTO_DISMISS_MS = 4500;

// ── Brand name split into chars for stagger reveal ──────────────────────────
const BRAND_CHARS = 'Voice & Vision AI'.split('');

export default function Intro() {
  const t = useTranslations('intro');
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<'loading' | 'ready'>('loading');
  const [loadPct, setLoadPct] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const dismiss = useCallback(() => {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    window.scrollTo({ top: 0, behavior: 'instant' } as ScrollToOptions);
    setVisible(false);
  }, []);

  // ── Scroll lock ──────────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // ── Animated load counter (rAF-based, easeInOut curve) ───────────────────
  useEffect(() => {
    const animate = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / LOAD_DURATION_MS, 1);
      // easeInOutCubic
      const eased = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      const pct = Math.round(eased * 100);
      setLoadPct(pct);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setLoadPct(100);
        // Brief pause then switch to "ready" state
        setTimeout(() => setPhase('ready'), 300);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── Auto-dismiss ─────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(dismiss, AUTO_DISMISS_MS);
    return () => clearTimeout(t);
  }, [dismiss]);

  // ── Scroll / touch dismiss ───────────────────────────────────────────────
  useEffect(() => {
    const onWheel = (e: WheelEvent) => { e.preventDefault(); dismiss(); };
    const onTouch = () => dismiss();
    window.addEventListener('wheel', onWheel, { passive: false, once: true });
    window.addEventListener('touchmove', onTouch, { once: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchmove', onTouch);
    };
  }, [dismiss]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Voice &amp; Vision AI"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-black cursor-pointer select-none"
          onClick={dismiss}
          onKeyDown={(e) => { if (e.key === 'Escape') dismiss(); }}
          tabIndex={-1}
          initial={{ y: 0 }}
          exit={{
            y: '-100%',
            transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* ── Background grid ──────────────────────────────────────────── */}
          <GridBackground />

          {/* ── Animated blob shapes ─────────────────────────────────────── */}
          <BlobBackground />

          {/* ── Corner brackets ──────────────────────────────────────────── */}
          <CornerBrackets />

          {/* ── Scan line (sweeps once top → bottom) ─────────────────────── */}
          <ScanLine />

          {/* ── Center content ───────────────────────────────────────────── */}
          <div className="relative z-10 flex flex-col items-center gap-6 px-6">
            {/* Brand name — letter-by-letter stagger */}
            <motion.div
              className="flex items-center overflow-hidden"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.045, delayChildren: 0.6 } },
              }}
            >
              {BRAND_CHARS.map((char, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { y: '110%', opacity: 0 },
                    visible: { y: '0%', opacity: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
                  }}
                  className="inline-block"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                    color: char === '&' ? '#00C9A7' : '#F0F0F0',
                    whiteSpace: 'pre',
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>

            {/* Teal rule — expands from center outward */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: 'clamp(140px, 20vw, 220px)',
                height: 1,
                background: 'linear-gradient(to right, transparent, #00C9A7 40%, #00C9A7 60%, transparent)',
                transformOrigin: 'center',
              }}
            />

            {/* Status label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="flex items-center gap-2"
              aria-live="polite"
              aria-atomic="true"
            >
              <AnimatePresence mode="wait">
                {phase === 'loading' ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-[10px] uppercase tracking-[0.35em]"
                    style={{ color: '#888888', fontFamily: 'var(--font-display)' }}
                  >
                    {t('initializing')}
                    <span aria-hidden="true"><DotEllipsis /></span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="ready"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-[10px] uppercase tracking-[0.35em]"
                    style={{ color: '#00C9A7', fontFamily: 'var(--font-display)' }}
                  >
                    {t('clickToEnter')}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* ── Bottom bar — loading progress ────────────────────────────── */}
          <div className="absolute bottom-0 left-0 right-0 z-10">
            {/* Track */}
            <div className="relative h-px w-full" style={{ background: '#1a1a1a' }}>
              {/* Fill */}
              <motion.div
                className="absolute inset-y-0 left-0"
                style={{
                  width: `${loadPct}%`,
                  background: 'linear-gradient(to right, #00C9A7, #00EDCA)',
                  boxShadow: '0 0 8px rgba(0,201,167,0.6)',
                }}
              />
            </div>
            {/* Counter row */}
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex items-center justify-between px-6 py-4 md:px-10"
            >
              {/* Left — percentage */}
              <span
                className="tabular-nums text-xs"
                style={{
                  color: '#00C9A7',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                }}
              >
                {String(loadPct).padStart(3, '0')}
                <span style={{ color: '#333333' }}>%</span>
              </span>

              {/* Right — monogram + year */}
              <span
                className="text-[10px] uppercase tracking-[0.3em]"
                style={{ color: '#333333', fontFamily: 'var(--font-display)' }}
              >
                V&amp;V · EST. 2024
              </span>
            </motion.div>
          </div>

          {/* ── Top-right — category tag ─────────────────────────────────── */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="absolute top-6 right-6 md:top-8 md:right-10 z-10"
          >
            <span
              className="text-[9px] uppercase tracking-[0.35em]"
              style={{ color: '#2a2a2a', fontFamily: 'var(--font-display)' }}
            >
              {t('aiSolutions')}
            </span>
          </motion.div>

          {/* ── Top-left — version tag ────────────────────────────────────── */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="absolute top-6 left-6 md:top-8 md:left-10 z-10"
          >
            <span
              className="text-[9px] uppercase tracking-[0.35em]"
              style={{ color: '#2a2a2a', fontFamily: 'var(--font-display)' }}
            >
              v2.0
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

/** Animated dot ellipsis: cycles through "·", "··", "···" */
function DotEllipsis() {
  const [dots, setDots] = useState(1);
  useEffect(() => {
    const id = setInterval(() => setDots(d => (d % 3) + 1), 500);
    return () => clearInterval(id);
  }, []);
  return <span style={{ display: 'inline-block', width: '1.2em' }}>{'·'.repeat(dots)}</span>;
}

/** Subtle CSS grid background — very faint horizontal + vertical lines */
function GridBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,201,167,0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,201,167,0.035) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
      }}
    />
  );
}

/** Four teal L-bracket corners that animate in from outside */
function CornerBrackets() {
  const bracketSize = 24;
  const thickness = 1.5;
  const color = 'rgba(0, 201, 167, 0.45)';
  const gap = 28; // px from viewport edge

  const bracketStyle = (
    rotate: number,
    top?: number | string,
    bottom?: number | string,
    left?: number | string,
    right?: number | string,
  ) => ({
    position: 'absolute' as const,
    width: bracketSize,
    height: bracketSize,
    top,
    bottom,
    left,
    right,
    borderTop: `${thickness}px solid ${color}`,
    borderLeft: `${thickness}px solid ${color}`,
    transformOrigin: 'center',
    transform: `rotate(${rotate}deg)`,
  });

  return (
    <>
      {([
        { rotate: 0,   top: gap,    left: gap    },
        { rotate: 90,  top: gap,    right: gap   },
        { rotate: 270, bottom: gap, left: gap    },
        { rotate: 180, bottom: gap, right: gap   },
      ] as Array<{ rotate: number; top?: number; bottom?: number; left?: number; right?: number }>)
        .map((pos, i) => (
          <motion.div
            key={i}
            aria-hidden="true"
            style={bracketStyle(pos.rotate, pos.top, pos.bottom, pos.left, pos.right)}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
    </>
  );
}

/** Two morphing organic blobs that drift and breathe in the background */
function BlobBackground() {
  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Primary blob — large, left-center, 14s morph cycle */}
      <motion.div
        style={{
          position: 'absolute',
          width: 700,
          height: 700,
          left: '10%',
          top: '5%',
          background: 'radial-gradient(circle at 50% 50%, rgba(0,201,167,0.18) 0%, rgba(0,201,167,0.08) 50%, transparent 75%)',
          filter: 'blur(70px)',
          willChange: 'transform, border-radius',
        }}
        initial={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
        animate={{
          borderRadius: [
            '60% 40% 30% 70% / 60% 30% 70% 40%',
            '40% 60% 70% 30% / 50% 60% 30% 60%',
            '70% 30% 50% 50% / 30% 50% 70% 50%',
            '30% 70% 40% 60% / 60% 40% 50% 60%',
            '60% 40% 30% 70% / 60% 30% 70% 40%',
          ],
          x: [-40, 60, -20, 40, -40],
          y: [20, -50, 30, -30, 20],
          scale: [1, 1.08, 0.95, 1.04, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
          times: [0, 0.25, 0.5, 0.75, 1],
        }}
      />

      {/* Secondary blob — smaller, right side, 10s morph cycle */}
      <motion.div
        style={{
          position: 'absolute',
          width: 450,
          height: 450,
          right: '6%',
          top: '25%',
          background: 'radial-gradient(circle at 50% 50%, rgba(0,237,202,0.14) 0%, rgba(0,201,167,0.06) 50%, transparent 75%)',
          filter: 'blur(65px)',
          willChange: 'transform, border-radius',
        }}
        initial={{ borderRadius: '50% 50% 60% 40% / 40% 60% 50% 50%' }}
        animate={{
          borderRadius: [
            '50% 50% 60% 40% / 40% 60% 50% 50%',
            '70% 30% 40% 60% / 60% 40% 30% 70%',
            '40% 60% 50% 50% / 50% 50% 60% 40%',
            '60% 40% 70% 30% / 30% 70% 40% 60%',
            '50% 50% 60% 40% / 40% 60% 50% 50%',
          ],
          x: [30, -50, 20, -30, 30],
          y: [-20, 40, -30, 20, -20],
          scale: [1, 0.92, 1.06, 0.98, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          times: [0, 0.25, 0.5, 0.75, 1],
        }}
      />
    </div>
  );
}

/** Single teal scan line that sweeps from top to bottom once */
function ScanLine() {
  return (
    <motion.div
      aria-hidden="true"
      className="absolute left-0 right-0 pointer-events-none z-20"
      style={{
        height: 1,
        background: 'linear-gradient(to right, transparent 0%, rgba(0,201,167,0.6) 20%, rgba(0,237,202,0.8) 50%, rgba(0,201,167,0.6) 80%, transparent 100%)',
        boxShadow: '0 0 8px rgba(0,201,167,0.5)',
      }}
      initial={{ top: '-2px' }}
      animate={{ top: 'calc(100% + 2px)' }}
      transition={{ duration: 1.4, delay: 0.15, ease: 'linear' }}
    />
  );
}
