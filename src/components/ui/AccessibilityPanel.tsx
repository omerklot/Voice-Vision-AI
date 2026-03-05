'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Type, Contrast, PauseCircle, BookOpen, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAccessibility, type FontSize } from '@/context/AccessibilityContext';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLButtonElement | null>;
}

export default function AccessibilityPanel({ isOpen, onClose, anchorRef }: AccessibilityPanelProps) {
  const t = useTranslations('accessibility');
  const { settings, setFontSize, toggleHighContrast, togglePauseAnimations, toggleDyslexiaMode, resetAll } =
    useAccessibility();

  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = 'a11y-panel';
  const titleId = 'a11y-panel-title';

  // ── Focus first element when panel opens ──────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const panel = panelRef.current;
    if (!panel) return;
    const focusable = panel.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    focusable[0]?.focus();
  }, [isOpen]);

  // ── Focus trap + Escape key ───────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const panel = panelRef.current;
    if (!panel) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        anchorRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, anchorRef]);

  const fontSizes: { value: FontSize; label: string }[] = [
    { value: 'normal', label: t('fontSizeNormal') },
    { value: 'large', label: t('fontSizeLarge') },
    { value: 'xl', label: t('fontSizeXL') },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="absolute top-full mt-2 end-0 w-72 rounded-2xl border border-[#1a1a1a] bg-[#080808]/95 backdrop-blur-xl shadow-[0_0_40px_#00C9A715] z-50 overflow-hidden"
        >
          {/* ── Header ──────────────────────────────────────────────── */}
          <div className="flex items-center justify-between border-b border-[#1a1a1a] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00C9A7] shadow-[0_0_6px_#00C9A7]" aria-hidden="true" />
              <h2 id={titleId} className="text-sm font-semibold text-[#F0F0F0] tracking-wide">
                {t('title')}
              </h2>
            </div>
            <button
              onClick={() => { onClose(); anchorRef.current?.focus(); }}
              aria-label={t('close')}
              className="flex items-center justify-center rounded-lg p-1.5 text-[#888888] hover:bg-[#1a1a1a] hover:text-[#F0F0F0] transition-colors duration-150 min-w-[32px] min-h-[32px] cursor-pointer"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>

          <div className="p-3 flex flex-col gap-1">
            {/* ── Font Size ─────────────────────────────────────────── */}
            <div className="rounded-xl bg-[#0f0f0f] border border-[#1a1a1a] p-3">
              <div className="flex items-center gap-2 mb-2.5">
                <Type size={13} className="text-[#00C9A7]" aria-hidden="true" />
                <span className="text-xs font-medium text-[#888888] uppercase tracking-widest">
                  {t('fontSize')}
                </span>
              </div>
              <div className="flex gap-1.5" role="group" aria-label={t('fontSize')}>
                {fontSizes.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setFontSize(value)}
                    aria-pressed={settings.fontSize === value}
                    className={`flex-1 rounded-lg py-2 text-xs font-medium transition-all duration-150 cursor-pointer border ${
                      settings.fontSize === value
                        ? 'bg-[#00C9A715] border-[#00C9A750] text-[#00C9A7] shadow-[0_0_10px_#00C9A720]'
                        : 'border-[#1a1a1a] text-[#888888] hover:border-[#333] hover:text-[#F0F0F0]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Toggle rows ───────────────────────────────────────── */}
            <ToggleRow
              icon={<Contrast size={13} aria-hidden="true" />}
              label={t('highContrast')}
              description={t('highContrastDesc')}
              checked={settings.highContrast}
              onToggle={toggleHighContrast}
            />

            <ToggleRow
              icon={<PauseCircle size={13} aria-hidden="true" />}
              label={t('pauseAnimations')}
              description={t('pauseAnimationsDesc')}
              checked={settings.pauseAnimations}
              onToggle={togglePauseAnimations}
            />

            <ToggleRow
              icon={<BookOpen size={13} aria-hidden="true" />}
              label={t('dyslexiaMode')}
              description={t('dyslexiaModeDesc')}
              checked={settings.dyslexiaMode}
              onToggle={toggleDyslexiaMode}
            />

            {/* ── Reset ─────────────────────────────────────────────── */}
            <button
              onClick={resetAll}
              className="mt-1 flex items-center justify-center gap-1.5 w-full rounded-xl py-2.5 text-xs text-[#888888] hover:text-[#F0F0F0] hover:bg-[#0f0f0f] transition-colors duration-150 cursor-pointer border border-transparent hover:border-[#1a1a1a]"
            >
              <RotateCcw size={11} aria-hidden="true" />
              {t('resetAll')}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Toggle Row sub-component ──────────────────────────────────────────────────
interface ToggleRowProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}

function ToggleRow({ icon, label, description, checked, onToggle }: ToggleRowProps) {
  const switchId = `a11y-toggle-${label.replace(/\s+/g, '-').toLowerCase()}`;
  const descId = `${switchId}-desc`;

  return (
    <div className="rounded-xl bg-[#0f0f0f] border border-[#1a1a1a] px-3 py-2.5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-start gap-2 min-w-0">
          <span className="mt-0.5 text-[#00C9A7] shrink-0">{icon}</span>
          <div className="min-w-0">
            <div className="text-xs font-medium text-[#F0F0F0] leading-tight">{label}</div>
            <div id={descId} className="text-[10px] text-[#666666] mt-0.5 leading-tight">{description}</div>
          </div>
        </div>

        <button
          id={switchId}
          role="switch"
          aria-checked={checked}
          aria-describedby={descId}
          onClick={onToggle}
          className={`relative shrink-0 w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#00C9A7] focus-visible:outline-offset-2 ${
            checked ? 'bg-[#00C9A7]' : 'bg-[#1a1a1a]'
          }`}
        >
          <span
            aria-hidden="true"
            className={`absolute top-0.5 start-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
              checked ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
