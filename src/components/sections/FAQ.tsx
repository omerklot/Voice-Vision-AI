'use client';

import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useTranslations } from 'next-intl';

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.05, ease: 'easeOut' },
  }),
};

export default function FAQ() {
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { question: t('q1'), answer: t('a1') },
    { question: t('q2'), answer: t('a2') },
    { question: t('q3'), answer: t('a3') },
    { question: t('q4'), answer: t('a4') },
    { question: t('q5'), answer: t('a5') },
    { question: t('q6'), answer: t('a6') },
    { question: t('q7'), answer: t('a7') },
  ];

  return (
    <section
      id="faq"
      role="region"
      aria-labelledby="faq-heading"
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

      <div className="relative z-10 mx-auto max-w-3xl">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <motion.div
          className="mb-16"
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
            id="faq-heading"
            className="text-4xl font-extrabold tracking-tight text-white md:text-5xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('title')}
          </h2>
        </motion.div>

        {/* ── Accordion ───────────────────────────────────────────────── */}
        <div className="space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const btnId = `faq-btn-${index}`;
            return (
              <motion.div
                key={index}
                custom={index}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
                  isOpen
                    ? 'border-[#00C9A720] bg-[#070707] shadow-[0_0_30px_rgba(0,201,167,0.04)]'
                    : 'border-[#111111] bg-[#060606] hover:border-[#1a1a1a]'
                }`}
              >
                {/* Teal start accent when open — logical property for RTL */}
                <div
                  aria-hidden="true"
                  className={`absolute start-0 top-0 h-full w-[2px] bg-gradient-to-b from-[#00C9A7] to-transparent transition-opacity duration-300 ${
                    isOpen ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Trigger */}
                <button
                  id={btnId}
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start cursor-pointer min-h-[44px]"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  {/* Question */}
                  <span
                    className={`flex-1 text-sm font-semibold leading-relaxed transition-colors duration-200 md:text-base ${
                      isOpen ? 'text-white' : 'text-[#888888]'
                    }`}
                  >
                    {faq.question}
                  </span>

                  {/* Icon */}
                  <span
                    aria-hidden="true"
                    className={`shrink-0 transition-colors duration-200 ${
                      isOpen ? 'text-[#00C9A7]' : 'text-[#333333]'
                    }`}
                  >
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </button>

                {/* Expandable content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                    >
                      <div className="border-t border-[#111111] px-6 pb-6 pt-4">
                        <p className="text-sm leading-relaxed text-[#888888]">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
