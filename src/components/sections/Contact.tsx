'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ApiResponse } from '@/types';

/* ─── Validation schema (English messages for type inference) ────────────── */
const contactSchema = z.object({
  name: z.string().min(2, 'VALIDATION_NAME'),
  email: z.string().email('VALIDATION_EMAIL'),
  company: z.string().min(2, 'VALIDATION_COMPANY'),
  jobTitle: z.string().min(2, 'VALIDATION_JOB_TITLE'),
  phone: z.string().optional(),
  productInterest: z.enum([
    'AI Vision & OCR',
    'Conversational Voice Agents',
    'Both',
    'Not sure yet',
  ]),
  message: z.string().optional(),
});

type FormData = z.infer<typeof contactSchema>;

/* ─── Style helpers ──────────────────────────────────────────────────────── */
const inputClass =
  'w-full rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3 text-sm text-[#F0F0F0] placeholder-[#555555] outline-none transition-all duration-200 focus:border-[#00C9A7] focus:ring-1 focus:ring-[#00C9A715] font-mono';

const labelClass =
  'mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#888888]';

const errorClass = 'mt-1.5 font-mono text-[10px] text-red-400';

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function Contact() {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { productInterest: 'Not sure yet' },
  });

  const onSubmit = async (data: FormData) => {
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result: ApiResponse = await res.json();
      if (result.success) {
        setStatus('success');
        reset();
      } else {
        setErrorMessage(t('errorText'));
        setStatus('error');
      }
    } catch {
      setErrorMessage(t('errorText'));
      setStatus('error');
    }
  };

  return (
    <section
      id="contact"
      role="region"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden bg-black py-32 px-6"
    >
      {/* ── Grid background ──────────────────────────────────────────── */}
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
          background: 'radial-gradient(ellipse 100% 80% at 50% 50%, transparent 40%, black 90%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          bottom: '-10%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,201,167,0.07) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr] lg:items-start">

          {/* ── LEFT: Section header + info ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-4 mb-5">
              <span className="h-px w-10 bg-[#00C9A7]" aria-hidden="true" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00C9A7]">
                {t('pretag')}
              </span>
            </div>
            <h2
              id="contact-heading"
              className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl lg:text-[52px]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('title')}
            </h2>
            <p className="mb-10 max-w-sm text-base leading-relaxed text-[#888888]">
              {t('subtitle')}
            </p>
            <div className="space-y-6 border-t border-[#111111] pt-8">
              {([
                { label: t('responseTimeLabel'), value: t('responseTimeValue'), href: undefined },
                { label: t('onboardingLabel'),   value: t('onboardingValue'),   href: undefined },
                { label: t('contactLabel'),      value: 'voiceandvision.AI@gmail.com', href: 'mailto:voiceandvision.AI@gmail.com' },
              ] as { label: string; value: string; href?: string }[]).map(({ label, value, href }) => (
                <div key={label} className="flex items-start gap-4">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#888888] pt-1 shrink-0 w-28">
                    {label}
                  </span>
                  {href ? (
                    <a href={href} className="text-sm text-[#888888] transition-colors hover:text-[#00C9A7]">{value}</a>
                  ) : (
                    <span className="text-sm text-[#888888]">{value}</span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: Form terminal card ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-[#1a1a1a] bg-[#060606]"
          >
            {/* Inner grid */}
            <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(0,201,167,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,201,167,0.02) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
            {/* Corner glow */}
            <div aria-hidden="true" className="pointer-events-none absolute bottom-0 end-0 h-48 w-48" style={{ background: 'radial-gradient(circle at bottom right, rgba(0,201,167,0.08) 0%, transparent 70%)' }} />

            {/* ── Success / error live region ──────────────────────── */}
            <div aria-live="polite" aria-atomic="true">
              {status === 'success' && (
                <div className="relative flex flex-col items-center gap-6 px-8 py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#00C9A730] bg-[#00C9A710]">
                    <CheckCircle size={28} className="text-[#00C9A7]" aria-hidden="true" />
                  </div>
                  <div>
                    <h3
                      className="mb-2 text-xl font-bold text-white"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {t('successTitle')}
                    </h3>
                    <p className="text-sm text-[#888888]">
                      {t('successMessage')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStatus('idle')}
                    className="rounded-full border border-[#1a1a1a] px-6 py-2.5 font-mono text-xs text-[#888888] transition-all duration-200 hover:border-[#00C9A7] hover:text-[#00C9A7] cursor-pointer min-h-[44px]"
                  >
                    {t('sendAnother')}
                  </button>
                </div>
              )}
            </div>

            {status !== 'success' && (
              /* ── Form ───────────────────────────────────────────── */
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="relative space-y-5 p-6 md:p-8"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className={labelClass}>
                      {t('fullName')} <span aria-hidden="true">{t('required')}</span>
                    </label>
                    <input
                      id="contact-name"
                      {...register('name')}
                      className={inputClass}
                      placeholder={t('fullNamePlaceholder')}
                      autoComplete="name"
                      aria-required="true"
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <p id="contact-name-error" role="alert" className={errorClass}>
                        {t('validationName')}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="contact-email" className={labelClass}>
                      {t('businessEmail')} <span aria-hidden="true">{t('required')}</span>
                    </label>
                    <input
                      id="contact-email"
                      {...register('email')}
                      type="email"
                      className={inputClass}
                      placeholder={t('businessEmailPlaceholder')}
                      autoComplete="email"
                      aria-required="true"
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                      <p id="contact-email-error" role="alert" className={errorClass}>
                        {t('validationEmail')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-company" className={labelClass}>
                      {t('companyName')} <span aria-hidden="true">{t('required')}</span>
                    </label>
                    <input
                      id="contact-company"
                      {...register('company')}
                      className={inputClass}
                      placeholder={t('companyNamePlaceholder')}
                      autoComplete="organization"
                      aria-required="true"
                      aria-describedby={errors.company ? 'contact-company-error' : undefined}
                      aria-invalid={!!errors.company}
                    />
                    {errors.company && (
                      <p id="contact-company-error" role="alert" className={errorClass}>
                        {t('validationCompany')}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="contact-job-title" className={labelClass}>
                      {t('jobTitle')} <span aria-hidden="true">{t('required')}</span>
                    </label>
                    <input
                      id="contact-job-title"
                      {...register('jobTitle')}
                      className={inputClass}
                      placeholder={t('jobTitlePlaceholder')}
                      autoComplete="organization-title"
                      aria-required="true"
                      aria-describedby={errors.jobTitle ? 'contact-job-title-error' : undefined}
                      aria-invalid={!!errors.jobTitle}
                    />
                    {errors.jobTitle && (
                      <p id="contact-job-title-error" role="alert" className={errorClass}>
                        {t('validationJobTitle')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-phone" className={labelClass}>
                      {t('phone')}
                    </label>
                    <input
                      id="contact-phone"
                      {...register('phone')}
                      type="tel"
                      className={inputClass}
                      placeholder={t('phonePlaceholder')}
                      autoComplete="tel"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-product" className={labelClass}>
                      {t('productInterest')} <span aria-hidden="true">{t('required')}</span>
                    </label>
                    <select
                      id="contact-product"
                      {...register('productInterest')}
                      className={`${inputClass} cursor-pointer`}
                      aria-required="true"
                    >
                      <option value="Not sure yet">{t('optionNotSure')}</option>
                      <option value="AI Vision & OCR">{t('optionVision')}</option>
                      <option value="Conversational Voice Agents">{t('optionVoice')}</option>
                      <option value="Both">{t('optionBoth')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className={labelClass}>
                    {t('message')}
                  </label>
                  <textarea
                    id="contact-message"
                    {...register('message')}
                    rows={4}
                    className={`${inputClass} resize-none`}
                    placeholder={t('messagePlaceholder')}
                  />
                </div>

                {status === 'error' && (
                  <div
                    role="alert"
                    className="flex flex-col gap-2 rounded-lg border border-red-900/30 bg-red-900/10 px-4 py-3"
                  >
                    <div className="flex items-center gap-3 text-sm text-red-400">
                      <AlertCircle size={15} className="shrink-0" aria-hidden="true" />
                      <span>
                        {t('errorText')}
                      </span>
                    </div>
                    {errorMessage && (
                      <div className="rounded bg-red-950/40 px-3 py-2 font-mono text-[10px] text-red-300 break-all">
                        {errorMessage}
                      </div>
                    )}
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={status === 'loading'}
                  whileHover={status !== 'loading' ? { scale: 1.02, boxShadow: '0 0 32px rgba(0,201,167,0.35)' } : {}}
                  whileTap={status !== 'loading' ? { scale: 0.98 } : {}}
                  transition={{ duration: 0.2 }}
                  className="flex w-full items-center justify-center gap-2.5 rounded-full bg-[#00C9A7] px-8 py-4 text-sm font-bold text-black transition-colors duration-200 hover:bg-[#00EDCA] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer min-h-[44px]"
                >
                  {status === 'loading' ? (
                    <><Loader2 size={15} className="animate-spin" aria-hidden="true" />{t('submitting')}</>
                  ) : (
                    <>{t('submit')}<Send size={14} aria-hidden="true" /></>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
