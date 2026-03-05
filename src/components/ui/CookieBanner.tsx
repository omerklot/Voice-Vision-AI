'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CookieBannerProps {
  text: string;
  policyHref: string;
  acceptLabel: string;
  declineLabel: string;
  policyLabel: string;
}

export default function CookieBanner({ text, policyHref, acceptLabel, declineLabel, policyLabel }: CookieBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem('cookie-consent', 'declined');
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#1a1a1a]"
          style={{ borderTopColor: '#00C9A720' }}
          role="dialog"
          aria-label="Cookie consent"
        >
          <div
            className="relative px-6 py-5"
            style={{ background: '#0a0a0a', borderTop: '1px solid #00C9A730' }}
          >
            {/* Teal glow top edge */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, #00C9A7, transparent)' }}
            />

            <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-relaxed text-[#888888] sm:max-w-2xl">
                {text}{' '}
                <a
                  href={policyHref}
                  className="text-[#00C9A7] underline-offset-2 hover:underline"
                >
                  {policyLabel}
                </a>
              </p>
              <div className="flex shrink-0 gap-3">
                <button
                  onClick={handleDecline}
                  className="rounded border border-[#1a1a1a] px-5 py-2 text-sm text-[#888888] transition-colors hover:border-[#333333] hover:text-[#F0F0F0]"
                >
                  {declineLabel}
                </button>
                <button
                  onClick={handleAccept}
                  className="rounded px-5 py-2 text-sm font-medium text-black transition-all hover:opacity-90"
                  style={{ background: '#00C9A7', boxShadow: '0 0 16px #00C9A740' }}
                >
                  {acceptLabel}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
