'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Check, Accessibility } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import AccessibilityPanel from './AccessibilityPanel';

const locales = ['en', 'he', 'ar', 'ru', 'fr'] as const;

const localeShortcodes: Record<string, string> = {
  en: 'EN',
  he: 'עב',
  ar: 'عر',
  ru: 'RU',
  fr: 'FR',
};

function scrollBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
}

function smoothScrollTo(href: string) {
  const el = document.querySelector(href);
  el?.scrollIntoView({ behavior: scrollBehavior() });
}

export default function Navbar() {
  const t = useTranslations('nav');
  const tA11y = useTranslations('accessibility');
  const locale = useLocale();
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [a11yOpen, setA11yOpen] = useState(false);

  const mobileMenuRef = useRef<HTMLElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const langButtonRef = useRef<HTMLButtonElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const a11yButtonRef = useRef<HTMLButtonElement>(null);
  const a11yContainerRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { label: t('products'), href: '#products' },
    { label: t('about'), href: '#about' },
    { label: t('testimonials'), href: '#testimonials' },
    { label: t('faq'), href: '#faq' },
    { label: t('contact'), href: '#contact' },
  ];

  // ── Scroll detection ──────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Mobile menu: focus trap + return focus on close ───────────────────────
  useEffect(() => {
    if (!mobileOpen) return;

    const menu = mobileMenuRef.current;
    if (!menu) return;

    const focusable = menu.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        hamburgerRef.current?.focus();
      }
      if (e.key === 'Tab') {
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
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  // ── Close lang dropdown on outside click ─────────────────────────────────
  useEffect(() => {
    if (!langOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        !langButtonRef.current?.contains(e.target as Node) &&
        !langDropdownRef.current?.contains(e.target as Node)
      ) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [langOpen]);

  // ── Close lang dropdown on Escape ────────────────────────────────────────
  useEffect(() => {
    if (!langOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLangOpen(false);
        langButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [langOpen]);

  // ── Close a11y panel on outside click ────────────────────────────────────
  useEffect(() => {
    if (!a11yOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (!a11yContainerRef.current?.contains(e.target as Node)) {
        setA11yOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [a11yOpen]);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    smoothScrollTo(href);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 start-0 end-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-[#1a1a1a] bg-black/80 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: scrollBehavior() })}
            className="flex items-center gap-3 cursor-pointer py-2 min-h-[44px]"
            aria-label={t('scrollToTop')}
          >
            <span
              className="text-sm font-bold tracking-tight text-[#F0F0F0]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Voice<span className="text-[#00C9A7]">&</span>Vision AI
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex" aria-label={t('navigate')}>
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="text-sm text-[#888888] transition-colors duration-200 hover:text-[#F0F0F0] cursor-pointer py-2 min-h-[44px]"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right side: language switcher + CTA + hamburger */}
          <div className="flex items-center gap-3">
            {/* ── Language switcher ──────────────────────────────── */}
            <div className="relative">
              <button
                ref={langButtonRef}
                onClick={() => setLangOpen(!langOpen)}
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                aria-label={t('languageLabel')}
                className="flex items-center gap-1.5 rounded-lg border border-[#1a1a1a] px-3 py-2 text-sm text-[#888888] transition-all duration-200 hover:border-[#00C9A730] hover:text-[#F0F0F0] cursor-pointer min-h-[44px]"
              >
                <span className="font-semibold tracking-wide text-xs">{localeShortcodes[locale] ?? locale.toUpperCase()}</span>
                <ChevronDown
                  size={12}
                  aria-hidden="true"
                  className={`transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    ref={langDropdownRef}
                    role="listbox"
                    aria-label={t('languageLabel')}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-2 end-0 w-44 rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] overflow-hidden z-50 shadow-2xl"
                  >
                    {locales.map((lang) => (
                      <Link
                        key={lang}
                        href={pathname}
                        locale={lang}
                        role="option"
                        aria-selected={locale === lang}
                        onClick={() => setLangOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 text-sm transition-colors duration-150 hover:bg-[#00C9A710] hover:text-white min-h-[44px] ${
                          locale === lang ? 'text-[#00C9A7]' : 'text-[#888888]'
                        }`}
                      >
                        <span>{t(`languageNames.${lang}`)}</span>
                        {locale === lang && (
                          <Check size={12} aria-hidden="true" className="text-[#00C9A7]" />
                        )}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Accessibility button ────────────────────────────── */}
            <div ref={a11yContainerRef} className="relative">
              <button
                ref={a11yButtonRef}
                onClick={() => setA11yOpen(!a11yOpen)}
                aria-expanded={a11yOpen}
                aria-controls="a11y-panel"
                aria-label={tA11y('label')}
                className={`flex items-center justify-center rounded-lg border px-2.5 py-2 text-sm transition-all duration-200 cursor-pointer min-h-[44px] min-w-[44px] ${
                  a11yOpen
                    ? 'border-[#00C9A750] bg-[#00C9A710] text-[#00C9A7]'
                    : 'border-[#1a1a1a] text-[#888888] hover:border-[#00C9A730] hover:text-[#F0F0F0]'
                }`}
              >
                <Accessibility size={16} aria-hidden="true" />
              </button>

              <AccessibilityPanel
                isOpen={a11yOpen}
                onClose={() => setA11yOpen(false)}
                anchorRef={a11yButtonRef}
              />
            </div>

            {/* Desktop CTA */}
            <button
              onClick={() => handleNav('#contact')}
              className="hidden rounded-full border border-[#00C9A750] bg-[#00C9A710] px-5 py-2 text-sm font-semibold text-[#00C9A7] transition-all duration-200 hover:bg-[#00C9A7] hover:text-black hover:shadow-[0_0_20px_#00C9A740] md:block cursor-pointer min-h-[44px]"
            >
              {t('cta')}
            </button>

            {/* Hamburger */}
            <button
              ref={hamburgerRef}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-[#888888] hover:text-[#F0F0F0] transition-colors md:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={mobileOpen ? t('closeMenu') : t('openMenu')}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <nav
                id="mobile-menu"
                ref={mobileMenuRef}
                className="mt-4 flex flex-col gap-4 border-t border-[#1a1a1a] pt-4"
                aria-label={t('navigate')}
              >
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNav(link.href)}
                    className="text-start text-base text-[#888888] transition-colors hover:text-[#F0F0F0] cursor-pointer py-2 min-h-[44px]"
                  >
                    {link.label}
                  </button>
                ))}
                <button
                  onClick={() => handleNav('#contact')}
                  className="mt-2 w-full rounded-full border border-[#00C9A750] bg-[#00C9A710] px-5 py-3 text-sm font-semibold text-[#00C9A7] cursor-pointer min-h-[44px]"
                >
                  {t('cta')}
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
