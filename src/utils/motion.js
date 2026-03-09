// Reusable Framer Motion config for 60fps, GPU-friendly animations
export const spring = {
  gentle: { type: 'spring', stiffness: 120, damping: 20 },
  bouncy: { type: 'spring', stiffness: 200, damping: 15 },
  smooth: { type: 'spring', stiffness: 100, damping: 25 },
  stiff: { type: 'spring', stiffness: 300, damping: 30 },
  slow: { type: 'spring', stiffness: 50, damping: 20 },
};

export const tween = {
  easeOut: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  easeInOut: { duration: 0.4, ease: [0.65, 0, 0.35, 1] },
  slow: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

// Scroll-triggered variants
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, ...tween.easeOut },
  }),
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { delay: i * 0.06, ...tween.easeOut },
  }),
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
