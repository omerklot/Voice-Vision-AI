import { Linkedin, Twitter } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function Footer() {
  const t = await getTranslations('footer');
  const tNav = await getTranslations('nav');

  const navLinks = [
    { label: tNav('products'), href: '#products' },
    { label: tNav('about'), href: '#about' },
    { label: tNav('testimonials'), href: '#testimonials' },
    { label: tNav('faq'), href: '#faq' },
    { label: tNav('contact'), href: '#contact' },
  ];

  return (
    <footer className="border-t border-[#1a1a1a] bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span
                className="text-sm font-bold tracking-tight text-[#F0F0F0]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Voice<span className="text-[#00C9A7]">&</span>Vision AI
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-[#888888]">
              {t('tagline')}
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                aria-label={t('linkedin')}
                className="text-[#888888] transition-colors hover:text-[#00C9A7] p-1 min-w-[44px] min-h-[44px] inline-flex items-center justify-center"
              >
                <Linkedin size={20} aria-hidden="true" />
              </a>
              <a
                href="#"
                aria-label={t('twitter')}
                className="text-[#888888] transition-colors hover:text-[#00C9A7] p-1 min-w-[44px] min-h-[44px] inline-flex items-center justify-center"
              >
                <Twitter size={20} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest text-[#888888]">
              {t('navigate')}
            </h3>
            <nav className="flex flex-col gap-3" aria-label={t('navigate')}>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#888888] transition-colors hover:text-[#F0F0F0] py-1 min-h-[44px] flex items-center"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-widest text-[#888888]">
              {tNav('contact')}
            </h3>
            <a
              href="mailto:voiceandvision.AI@gmail.com"
              className="text-sm text-[#888888] transition-colors hover:text-[#00C9A7]"
            >
              voiceandvision.AI@gmail.com
            </a>
            <p className="mt-3 text-sm text-[#888888]">
              {t('contactSub')}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-[#1a1a1a] pt-8 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <p className="text-xs text-[#888888]">
            {t('copyright')}
          </p>
          <div className="flex items-center gap-3 text-xs text-[#888888]">
            <Link href="/terms#tos" className="hover:text-[#F0F0F0] transition-colors py-1">{t('terms')}</Link>
            <span aria-hidden="true">·</span>
            <Link href="/terms#privacy" className="hover:text-[#F0F0F0] transition-colors py-1">{t('privacy')}</Link>
            <span aria-hidden="true">·</span>
            <Link href="/terms#cookies" className="hover:text-[#F0F0F0] transition-colors py-1">{t('cookies')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
