import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import Footer from '@/components/ui/Footer';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type TermsMessages = {
  tos: string;
  privacy: string;
  cookies: string;
  backToHome: string;
};

async function getTermsMessages(locale: string): Promise<TermsMessages> {
  const messages = (await import(`../../../../messages/${locale}.json`)).default;
  return {
    tos: messages.terms.tos,
    privacy: messages.terms.privacy,
    cookies: messages.terms.cookies,
    backToHome: messages.terms.backToHome,
  };
}

function readContentFile(filename: string): string {
  const filePath = path.join(process.cwd(), 'content', filename);
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return 'Content coming soon.';
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTermsMessages(locale);
  return {
    title: `${t.tos} & ${t.privacy} | Voice&Vision AI`,
    description: `${t.tos} and ${t.privacy} for Voice&Vision AI.`,
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTermsMessages(locale);
  const tosContent = readContentFile('tos.txt');
  const privacyContent = readContentFile('privacy.txt');
  const cookiesContent = readContentFile('cookies.txt');

  return (
    <div className="min-h-screen bg-[#000000] text-[#F0F0F0]">
      {/* Sticky minimal header */}
      <header className="sticky top-0 z-50 border-b border-[#1a1a1a] bg-[#000000]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-sm font-bold tracking-tight text-[#F0F0F0]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Voice<span className="text-[#00C9A7]">&</span>Vision AI
          </Link>
          <Link
            href="/"
            className="text-sm text-[#888888] transition-colors hover:text-[#F0F0F0]"
          >
            {t.backToHome}
          </Link>
        </div>
      </header>

      {/* Page content */}
      <main id="main-content" role="main" className="mx-auto max-w-5xl px-6 py-24">
        {/* Terms of Service */}
        <section id="tos" className="mb-24" role="region" aria-labelledby="tos-heading">
          <div className="mb-10 flex items-center gap-4">
            <div className="h-8 w-[3px] rounded-full bg-[#00C9A7]" aria-hidden="true" />
            <h1
              id="tos-heading"
              className="text-4xl font-bold tracking-tight text-[#F0F0F0] sm:text-5xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t.tos}
            </h1>
          </div>
          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-[#888888]" style={{ fontFamily: 'inherit' }}>
            {tosContent}
          </pre>
        </section>

        {/* Divider */}
        <div className="mb-24 border-t border-[#1a1a1a]" aria-hidden="true" />

        {/* Privacy Policy */}
        <section id="privacy" role="region" aria-labelledby="privacy-heading">
          <div className="mb-10 flex items-center gap-4">
            <div className="h-8 w-[3px] rounded-full bg-[#00C9A7]" aria-hidden="true" />
            <h2
              id="privacy-heading"
              className="text-4xl font-bold tracking-tight text-[#F0F0F0] sm:text-5xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t.privacy}
            </h2>
          </div>
          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-[#888888]" style={{ fontFamily: 'inherit' }}>
            {privacyContent}
          </pre>
        </section>

        {/* Divider */}
        <div className="mb-24 mt-24 border-t border-[#1a1a1a]" aria-hidden="true" />

        {/* Cookie Policy */}
        <section id="cookies" role="region" aria-labelledby="cookies-heading">
          <div className="mb-10 flex items-center gap-4">
            <div className="h-8 w-[3px] rounded-full bg-[#00C9A7]" aria-hidden="true" />
            <h2
              id="cookies-heading"
              className="text-4xl font-bold tracking-tight text-[#F0F0F0] sm:text-5xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t.cookies}
            </h2>
          </div>
          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-[#888888]" style={{ fontFamily: 'inherit' }}>
            {cookiesContent}
          </pre>
        </section>
      </main>

      <Footer />
    </div>
  );
}
