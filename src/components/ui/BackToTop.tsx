'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={handleClick}
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: prefersReduced ? 0 : 0.2 }}
          whileHover={{
            borderColor: 'var(--color-accent)',
            backgroundColor: 'var(--color-accent-dim)',
            boxShadow: '0 0 16px var(--color-accent-dim)',
          }}
          className="group fixed bottom-8 end-8 z-[60] flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#1a1a1a] bg-[#0a0a0a] transition-colors duration-200"
        >
          <ArrowUp
            size={16}
            aria-hidden="true"
            className="text-[#888888] transition-colors duration-200 group-hover:text-[#00C9A7]"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
