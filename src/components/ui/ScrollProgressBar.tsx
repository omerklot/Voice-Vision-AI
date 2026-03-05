'use client';

import { useScroll, useSpring, motion } from 'framer-motion';

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[10000] h-[2px] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(to right, var(--color-accent), var(--color-accent-light))',
      }}
    />
  );
}
