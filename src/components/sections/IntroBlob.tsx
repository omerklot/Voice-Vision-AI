'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

// ── Organic blob morph sequences ─────────────────────────────────────────────
const blob1Radius = [
  '42% 58% 65% 35% / 44% 52% 48% 56%',
  '68% 32% 38% 62% / 55% 62% 38% 45%',
  '33% 67% 58% 42% / 62% 35% 65% 38%',
  '55% 45% 32% 68% / 38% 68% 52% 48%',
  '42% 58% 65% 35% / 44% 52% 48% 56%',
];

const blob2Radius = [
  '62% 38% 46% 54% / 50% 58% 42% 50%',
  '38% 62% 72% 28% / 45% 35% 65% 55%',
  '55% 45% 35% 65% / 68% 42% 58% 32%',
  '28% 72% 56% 44% / 36% 64% 44% 56%',
  '62% 38% 46% 54% / 50% 58% 42% 50%',
];

const blob3Radius = [
  '50% 50% 72% 28% / 38% 66% 34% 62%',
  '30% 70% 42% 58% / 58% 32% 68% 42%',
  '65% 35% 55% 45% / 42% 54% 46% 58%',
  '45% 55% 28% 72% / 66% 38% 62% 34%',
  '50% 50% 72% 28% / 38% 66% 34% 62%',
];

// Rim-lighting bubble gradient — transparent center, glowing surface at rim
const bubbleGradient = (alpha1: number, alpha2: number) =>
  `radial-gradient(circle at 50% 50%, rgba(0,201,167,0.03) 0%, rgba(0,201,167,${alpha1}) 55%, rgba(0,201,167,0.12) 80%, rgba(0,237,202,${alpha2}) 93%, transparent 100%)`;

export default function IntroBlob() {
  const [visible, setVisible] = useState(true);

  const dismiss = useCallback(() => {
    // Restore scroll immediately — overlay is fixed so page won't flash during exit anim
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    // Jump to top instantly (bypasses scroll-behavior: smooth)
    window.scrollTo({ top: 0, behavior: 'instant' } as ScrollToOptions);
    setVisible(false);
  }, []);

  // ── Mouse → spring-smooth blob position ─────────────────────────────────
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const blobX = useSpring(mouseX, { stiffness: 55, damping: 22, mass: 1 });
  const blobY = useSpring(mouseY, { stiffness: 55, damping: 22, mass: 1 });

  // ── Scroll lock (safety net — also released in dismiss()) ───────────────
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  // ── Auto-dismiss after 4.5 s ────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(dismiss, 4500);
    return () => clearTimeout(timer);
  }, [dismiss]);

  // ── Wheel: block page scroll AND trigger dismiss ─────────────────────────
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      dismiss();
    };
    const handleTouch = () => dismiss();
    window.addEventListener('wheel', handleWheel, { passive: false, once: true });
    window.addEventListener('touchmove', handleTouch, { once: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouch);
    };
  }, [dismiss]);

  // ── Mouse tracking ──────────────────────────────────────────────────────
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      mouseX.set((e.clientX - window.innerWidth / 2) * 0.28);
      mouseY.set((e.clientY - window.innerHeight / 2) * 0.28);
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, [mouseX, mouseY]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro-overlay"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{
            scale: 1.45,
            opacity: 0,
            filter: 'blur(14px)',
            transition: { duration: 0.75, ease: [0.4, 0, 0.2, 1] },
          }}
        >
          {/* ── Ambient background glow ─────────────────────────────────── */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 55% 50% at 50% 50%, rgba(0,201,167,0.06) 0%, transparent 70%)',
            }}
          />

          {/* ── Blob 2 — Large outer ring, slow morph ───────────────────── */}
          {/* borderRadius set in style so it's a blob from the very first paint */}
          <motion.div
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{
              width: 620,
              height: 620,
              top: '50%',
              left: '50%',
              marginTop: -310,
              marginLeft: -310,
              borderRadius: blob2Radius[0],
              border: '1px solid rgba(0, 237, 202, 0.21)',
              background: bubbleGradient(0.03, 0.14),
              boxShadow:
                '0 0 50px rgba(0,237,202,0.06), inset 0 0 40px rgba(0,201,167,0.04)',
            }}
            animate={{
              borderRadius: blob2Radius,
              rotate: [0, 3, -2, 1, 0],
            }}
            transition={{
              borderRadius: { duration: 28, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 20, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            {/* Specular highlight — crescent at top-left */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                width: '22%',
                height: '12%',
                top: '14%',
                left: '16%',
                borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(0,237,202,0.22) 0%, transparent 70%)',
                filter: 'blur(5px)',
              }}
            />
          </motion.div>

          {/* ── Blob 1 — Main, mouse-reactive, center ───────────────────── */}
          <motion.div
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{
              width: 380,
              height: 380,
              top: '50%',
              left: '50%',
              marginTop: -190,
              marginLeft: -190,
              borderRadius: blob1Radius[0],
              border: '1.5px solid rgba(0, 201, 167, 0.51)',
              background: bubbleGradient(0.04, 0.20),
              boxShadow:
                '0 0 55px rgba(0,201,167,0.18), inset 0 0 35px rgba(0,201,167,0.06)',
              x: blobX,
              y: blobY,
            }}
            animate={{
              borderRadius: blob1Radius,
              scale: [1, 1.06, 0.95, 1.03, 1],
            }}
            transition={{
              borderRadius: { duration: 16, repeat: Infinity, ease: 'easeInOut' },
              scale: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            {/* Specular highlight — crescent at top-left, like light on a glass sphere */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                width: '28%',
                height: '14%',
                top: '13%',
                left: '14%',
                borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(0,237,202,0.38) 0%, rgba(0,237,202,0.12) 50%, transparent 80%)',
                filter: 'blur(3px)',
              }}
            />
          </motion.div>

          {/* ── Blob 3 — Small accent, offset bottom-left ───────────────── */}
          <motion.div
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{
              width: 240,
              height: 240,
              top: '62%',
              left: '35%',
              marginTop: -120,
              marginLeft: -120,
              borderRadius: blob3Radius[0],
              border: '1px solid rgba(0, 201, 167, 0.36)',
              background: bubbleGradient(0.03, 0.16),
              boxShadow:
                '0 0 35px rgba(0,201,167,0.10), inset 0 0 25px rgba(0,201,167,0.04)',
            }}
            animate={{
              borderRadius: blob3Radius,
              x: [-40, 30, -60, 20, -40],
              y: [20, -50, 40, -30, 20],
            }}
            transition={{
              borderRadius: { duration: 14, repeat: Infinity, ease: 'easeInOut' },
              x: { duration: 19, repeat: Infinity, ease: 'easeInOut' },
              y: { duration: 19, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            {/* Specular highlight */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                width: '25%',
                height: '14%',
                top: '14%',
                left: '16%',
                borderRadius: '50%',
                background: 'radial-gradient(ellipse, rgba(0,237,202,0.28) 0%, transparent 70%)',
                filter: 'blur(3px)',
              }}
            />
          </motion.div>

          {/* ── Center wordmark ──────────────────────────────────────────── */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
          >
            <span
              className="text-3xl font-bold tracking-tight text-[#F0F0F0]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Voice<span className="text-[#00C9A7]">&</span>Vision AI
            </span>

            <div
              style={{
                width: 120,
                height: 1,
                background: 'linear-gradient(to right, transparent, #00C9A7, transparent)',
              }}
            />

            <span
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: '#444444' }}
            >
              scroll to enter
            </span>
          </motion.div>

          {/* ── Scroll indicator ─────────────────────────────────────────── */}
          <motion.button
            onClick={dismiss}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer text-[#444444] hover:text-[#00C9A7] transition-colors duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.6 }}
            aria-label="Enter site"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            >
              <ChevronDown size={22} />
            </motion.div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
