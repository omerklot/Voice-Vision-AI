'use client';

import { motion, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

// ── Animation variants ───────────────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};

// ── Component ────────────────────────────────────────────────────────────────
export default function Hero() {
  const t = useTranslations('hero');

  const scrollTo = (id: string) => {
    const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
    document.querySelector(id)?.scrollIntoView({ behavior });
  };

  return (
    <section
      id="hero"
      role="region"
      aria-labelledby="hero-heading"
      className="relative flex min-h-screen items-center overflow-hidden bg-black px-6 pt-24 pb-20"
    >
      {/* ── Grid background ──────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,201,167,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,201,167,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* ── Radial vignette ─────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 85% 75% at 50% 50%, transparent 30%, black 80%)',
        }}
      />

      {/* ── Left teal ambient glow ──────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          left: '-15%',
          top: '15%',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,201,167,0.09) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Pre-tag */}
          <motion.div variants={itemVariants} className="mb-8 flex items-center gap-3">
            <span className="h-px w-10 bg-[#00C9A7]" aria-hidden="true" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00C9A7]">
              {t('pretag')}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            id="hero-heading"
            variants={itemVariants}
            style={{ fontFamily: 'var(--font-display)' }}
            className="mb-6"
          >
            <span className="block text-[68px] font-black leading-[0.93] tracking-[-3px] text-white md:text-[88px] xl:text-[100px]">
              {t('headline1')}
            </span>
            <span className="block ps-10 text-[68px] font-black leading-[0.93] tracking-[-3px] bg-gradient-to-r from-[#00EDCA] via-[#00C9A7] to-[#33E5C7] bg-clip-text text-transparent md:text-[88px] xl:text-[100px] lg:ps-16">
              {t('headline2')}
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="mb-10 max-w-lg text-base leading-relaxed text-[#888888] md:text-lg"
          >
            {t('subheadline')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="mb-12 flex flex-wrap items-center gap-4"
          >
            <motion.button
              type="button"
              onClick={() => scrollTo('#contact')}
              whileHover={{ scale: 1.03, boxShadow: '0 0 40px rgba(0,201,167,0.4)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="group flex cursor-pointer items-center gap-2.5 rounded-full bg-[#00C9A7] px-8 py-4 text-sm font-bold text-black min-h-[44px]"
            >
              {t('ctaPrimary')}
              <ArrowRight
                size={15}
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              />
            </motion.button>

            <motion.button
              type="button"
              onClick={() => scrollTo('#products')}
              whileHover={{ boxShadow: '0 0 28px rgba(0,201,167,0.25)', borderColor: '#00C9A7' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-[#00C9A760] px-8 py-4 text-sm font-semibold text-[#F0F0F0] transition-all duration-200 min-h-[44px]"
            >
              {t('ctaSecondary')}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
