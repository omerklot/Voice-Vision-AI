'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, animate, useInView, useReducedMotion, type Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';

// Parses a stat string like "99.7%", "<200ms", "24/7" into animatable parts
function parseStat(stat: string): { prefix: string; target: number; suffix: string; decimals: number } {
  const match = stat.match(/^([^0-9]*)(\d+\.?\d*)(.*)$/);
  if (!match) return { prefix: '', target: 0, suffix: stat, decimals: 0 };
  const numStr = match[2];
  return {
    prefix: match[1],
    target: parseFloat(numStr),
    suffix: match[3],
    decimals: numStr.includes('.') ? numStr.split('.')[1].length : 0,
  };
}

function AnimatedStat({ stat }: { stat: string }) {
  const { prefix, target, suffix, decimals } = parseStat(stat);
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    if (prefersReduced) {
      setDisplay(target);
      return;
    }
    const controls = animate(0, target, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(parseFloat(v.toFixed(decimals))),
    });
    return () => controls.stop();
  }, [inView, target, decimals, prefersReduced]);

  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  );
}

const statVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' },
  }),
};

export default function About() {
  const t = useTranslations('about');

  const stats = [
    {
      stat: t('stat1.stat'),
      label: t('stat1.label'),
      description: t('stat1.description'),
    },
    {
      stat: t('stat2.stat'),
      label: t('stat2.label'),
      description: t('stat2.description'),
    },
    {
      stat: t('stat3.stat'),
      label: t('stat3.label'),
      description: t('stat3.description'),
    },
  ];

  return (
    <section
      id="about"
      role="region"
      aria-labelledby="about-heading"
      className="relative overflow-hidden bg-[#050505] py-32 px-6"
    >
      {/* ── Subtle grid ─────────────────────────────────────────────── */}
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
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 100% 80% at 50% 50%, transparent 40%, #050505 90%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* ── Section header ───────────────────────────────────────── */}
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
          <h2
            id="about-heading"
            className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl max-w-3xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('title')}
          </h2>
        </motion.div>

        {/* ── Monumental stats row ─────────────────────────────────── */}
        <div className="mb-20 grid gap-px rounded-2xl overflow-hidden sm:grid-cols-3 bg-[#111111] border border-[#111111]">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              variants={statVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group relative bg-[#070707] p-8 transition-colors duration-300 hover:bg-[#0a0a0a]"
            >
              {/* Teal top accent on hover */}
              <div className="absolute top-0 start-0 h-px w-0 bg-gradient-to-r from-[#00C9A7] to-transparent transition-all duration-500 group-hover:w-full" aria-hidden="true" />

              {/* Big stat */}
              <div
                className="mb-2 text-5xl font-black leading-none text-white md:text-6xl lg:text-7xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <span className="text-[#00C9A7]"><AnimatedStat stat={s.stat} /></span>
              </div>

              {/* Label */}
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#F0F0F0]">
                {s.label}
              </div>

              {/* Divider */}
              <div className="mb-4 h-px w-8 bg-[#1a1a1a]" aria-hidden="true" />

              {/* Description */}
              <p className="text-sm leading-relaxed text-[#888888]">{s.description}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Narrative copy ───────────────────────────────────────── */}
        <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="space-y-5 text-base leading-relaxed text-[#888888]">
              <p>{t('body1p1')}</p>
              <p>{t('body1p2')}</p>
            </div>
            <div className="mt-8 h-px w-20 bg-gradient-to-r from-[#00C9A7] to-transparent" aria-hidden="true" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="space-y-5 text-base leading-relaxed text-[#888888]">
              <p>{t('body2p1')}</p>
              <p>{t('body2p2')}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
