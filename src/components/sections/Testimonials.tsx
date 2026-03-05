'use client';

import { motion, type Variants } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { CardSpotlight } from '@/components/ui/card-spotlight';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: 'easeOut' },
  }),
};

export default function Testimonials() {
  const t = useTranslations('testimonials');

  const testimonials = [
    {
      quote: t('t1.quote'),
      name: t('t1.name'),
      title: t('t1.title'),
      company: t('t1.company'),
      product: t('t1.product'),
    },
    {
      quote: t('t2.quote'),
      name: t('t2.name'),
      title: t('t2.title'),
      company: t('t2.company'),
      product: t('t2.product'),
    },
    {
      quote: t('t3.quote'),
      name: t('t3.name'),
      title: t('t3.title'),
      company: t('t3.company'),
      product: t('t3.product'),
    },
    {
      quote: t('t4.quote'),
      name: t('t4.name'),
      title: t('t4.title'),
      company: t('t4.company'),
      product: t('t4.product'),
    },
  ];

  return (
    <section
      id="testimonials"
      role="region"
      aria-labelledby="testimonials-heading"
      className="relative overflow-hidden bg-black py-32 px-6"
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
            'radial-gradient(ellipse 100% 80% at 50% 50%, transparent 40%, black 90%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* ── Header ─────────────────────────────────────────────────── */}
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
              id="testimonials-heading"
              className="text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('title')}
            </h2>
            <p className="text-xs italic text-[#888888] max-w-xs">
              {t('disclaimer')}
            </p>
          </div>
        </motion.div>

        {/* ── Testimonial grid ─────────────────────────────────────── */}
        <div className="grid gap-5 md:grid-cols-2">
          {testimonials.map((item, index) => (
            <motion.figure
              key={index}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-2xl overflow-hidden"
            >
              <CardSpotlight className="rounded-2xl p-8 h-full">
                {/* Large decorative quote mark */}
                <div
                  className="pointer-events-none absolute top-4 end-6 text-[120px] font-black leading-none text-[#0d0d0d] select-none z-20"
                  style={{ fontFamily: 'var(--font-display)' }}
                  aria-hidden="true"
                >
                  &ldquo;
                </div>

                <div className="relative z-20 flex h-full flex-col justify-between gap-8">
                  {/* Quote */}
                  <blockquote className="text-base leading-relaxed text-[#999999] md:text-[15px]">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>

                  {/* Attribution + badge */}
                  <figcaption className="flex items-end justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-[#F0F0F0]">{item.name}</div>
                      <div className="mt-0.5 text-xs text-[#888888]">{item.title}</div>
                      <div className="text-xs text-[#888888]">{item.company}</div>
                    </div>
                    <span className="shrink-0 rounded-full border border-[#00C9A715] bg-[#00C9A70a] px-3 py-1 font-mono text-[10px] text-[#00C9A7]">
                      {item.product}
                    </span>
                  </figcaption>
                </div>
              </CardSpotlight>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
