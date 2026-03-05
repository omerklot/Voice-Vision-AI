import type { Metadata } from 'next';
import { Montserrat, Plus_Jakarta_Sans, Heebo, Cairo, Lexend } from 'next/font/google';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { routing } from '@/i18n/routing';
import CookieBanner from '@/components/ui/CookieBanner';
import ScrollProgressBar from '@/components/ui/ScrollProgressBar';
import BackToTop from '@/components/ui/BackToTop';
import { AccessibilityProvider } from '@/context/AccessibilityContext';
import '../globals.css';

// ── LTR fonts (English, French, Russian) ─────────────────────────────────────
const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

// ── Hebrew font ───────────────────────────────────────────────────────────────
const heebo = Heebo({
  variable: '--font-heebo',
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

// ── Arabic font ───────────────────────────────────────────────────────────────
const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

// ── Dyslexia-friendly font ────────────────────────────────────────────────────
const lexend = Lexend({
  variable: '--font-lexend',
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const rtlLocales = ['he', 'ar'];

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('title'),
    description: t('description'),
    keywords: [
      'AI OCR',
      'voice agents',
      'AI solutions',
      'enterprise AI',
      'document automation',
      'conversational AI',
      'intelligent automation',
    ],
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      siteName: 'Voice&Vision AI',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const isRTL = rtlLocales.includes(locale);

  const fontVars =
    locale === 'he'
      ? `${heebo.variable} ${lexend.variable}`
      : locale === 'ar'
        ? `${cairo.variable} ${lexend.variable}`
        : `${montserrat.variable} ${jakarta.variable} ${lexend.variable}`;

  const t = await getTranslations({ locale });
  // Load messages directly to avoid request-context dependency during prerendering
  const messages = (await import(`../../../messages/${locale}.json`)).default;

  const cookieText = t('cookieBanner.notice');
  const cookieAccept = t('cookieBanner.accept');
  const cookieDecline = t('cookieBanner.decline');
  const cookiePolicyLink = t('cookieBanner.policyLink');

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} className={fontVars}>
      <body className="antialiased bg-black text-[#F0F0F0]">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AccessibilityProvider>
            {/* ── Skip to main content link ─────────────────────────── */}
            <a
              href="#main-content"
              className="skip-link"
            >
              {t('skipLink')}
            </a>

            {/* ── Noise texture overlay for depth ───────────────────── */}
            <div
              aria-hidden="true"
              className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.035]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23a)'/%3E%3C/svg%3E")`,
              }}
            />

            {/* ── Scroll progress indicator ─────────────────────────── */}
            <ScrollProgressBar />
            {children}
            <CookieBanner
              text={cookieText}
              policyHref={`/${locale}/terms#cookies`}
              acceptLabel={cookieAccept}
              declineLabel={cookieDecline}
              policyLabel={cookiePolicyLink}
            />
            {/* ── Back-to-top button ─────────────────────────────────── */}
            <BackToTop />
          </AccessibilityProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
