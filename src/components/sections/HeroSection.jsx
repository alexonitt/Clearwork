import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { CTAButton } from '../CTAButton';
import { useInView } from '../../hooks/useInView';
import { useCountUp } from '../../hooks/useCountUp';
import { spring, tween } from '../../utils/motion';

const heroWords = 'built to convert. built to scale.'.split(' ');

export function HeroSection() {
  const sectionRef = useRef(null);
  const [statsRef, statsInView] = useInView({ threshold: 0.2 });
  const count10 = useCountUp(10, 1500, statsInView);
  const count500 = useCountUp(500, 1500, statsInView);
  const count48 = useCountUp(48, 1200, statsInView);

  // Mouse parallax for orbs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      mouseX.set(x * 40);
      mouseY.set(y * 40);
      setIsHovering(true);
    };
    const onLeave = () => setIsHovering(false);
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [mouseX, mouseY]);

  const orb1X = useTransform(mouseX, [-40, 40], [-20, 20]);
  const orb1Y = useTransform(mouseY, [-40, 40], [-15, 15]);
  const orb2X = useTransform(mouseX, [-40, 40], [15, -15]);
  const orb2Y = useTransform(mouseY, [-40, 40], [20, -20]);
  const orb3X = useTransform(mouseX, [-40, 40], [-10, 10]);
  const orb3Y = useTransform(mouseY, [-40, 40], [-25, 25]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-black px-4 pt-20 sm:px-6 lg:px-8"
    >
      {/* Morphing gradient shapes */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -left-[20%] -top-[20%] h-[70vmax] w-[70vmax] rounded-full bg-gradient-to-br from-white/[0.06] to-transparent blur-3xl"
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.05, 0.98, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          style={{ willChange: 'transform' }}
        />
        <motion.div
          className="absolute -bottom-[15%] -right-[15%] h-[50vmax] w-[50vmax] rounded-full bg-gradient-to-tl from-white/[0.05] to-transparent blur-3xl"
          animate={{
            x: [0, -25, 20, 0],
            y: [0, 20, -10, 0],
            scale: [1, 1.08, 0.95, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          style={{ willChange: 'transform' }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-[40vmax] w-[40vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.02] blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          style={{ willChange: 'transform' }}
        />
      </div>

      {/* Floating orbs with mouse parallax */}
      <motion.div
        className="absolute left-[15%] top-[25%] h-32 w-32 rounded-full border border-white/[0.08] bg-white/[0.03]"
        style={{ x: orb1X, y: orb1Y, willChange: 'transform' }}
        animate={isHovering ? {} : { scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ scale: { duration: 4, repeat: Infinity }, opacity: { duration: 3, repeat: Infinity } }}
      />
      <motion.div
        className="absolute right-[20%] top-[60%] h-24 w-24 rounded-full border border-white/[0.06] bg-white/[0.02]"
        style={{ x: orb2X, y: orb2Y, willChange: 'transform' }}
        animate={isHovering ? {} : { scale: [1, 1.15, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[30%] left-[25%] h-20 w-20 rounded-full bg-white/[0.04]"
        style={{ x: orb3X, y: orb3Y, willChange: 'transform' }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <h1 className="font-display text-4xl font-bold lowercase leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          {heroWords.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 32 }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                ...tween.easeOut,
                duration: 0.6,
                delay: 0.15 + i * 0.07,
              }}
            >
              <motion.span
                className="inline-block"
                animate={{
                  y: [0, -4, 0],
                }}
                transition={{
                  duration: 3 + i * 0.3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.2,
                }}
              >
                {word}{' '}
              </motion.span>
            </motion.span>
          ))}
        </h1>
        <motion.p
          className="mt-6 text-base text-apex-muted sm:text-lg md:text-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...tween.easeOut, duration: 0.6, delay: 0.65 }}
        >
          premium websites. smart automation. real results.
        </motion.p>
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...tween.easeOut, duration: 0.5, delay: 0.9 }}
        >
          <CTAButton to="/portfolio" primary>see our work</CTAButton>
          <CTAButton to="/contact">get in touch</CTAButton>
        </motion.div>
      </div>

      {/* Stats row */}
      <motion.div
        ref={statsRef}
        className="relative z-10 mx-auto mt-20 grid w-full max-w-4xl grid-cols-3 gap-8 border-t border-apex-border px-4 py-8 sm:px-6"
        initial={{ opacity: 0 }}
        animate={statsInView ? { opacity: 1 } : {}}
        transition={tween.slow}
      >
        <div className="text-center">
          <motion.p
            className="font-display text-2xl font-bold text-white sm:text-3xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={statsInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ ...tween.easeOut, delay: 0.1 }}
          >
            {count10}+
          </motion.p>
          <p className="mt-1 text-xs uppercase tracking-widest text-apex-muted sm:text-sm">clients</p>
        </div>
        <div className="text-center">
          <motion.p
            className="font-display text-2xl font-bold text-white sm:text-3xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={statsInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ ...tween.easeOut, delay: 0.2 }}
          >
            ${count500}k+
          </motion.p>
          <p className="mt-1 text-xs uppercase tracking-widest text-apex-muted sm:text-sm">revenue generated</p>
        </div>
        <div className="text-center">
          <motion.p
            className="font-display text-2xl font-bold text-white sm:text-3xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={statsInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ ...tween.easeOut, delay: 0.3 }}
          >
            {count48}hr
          </motion.p>
          <p className="mt-1 text-xs uppercase tracking-widest text-apex-muted sm:text-sm">turnaround</p>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
      >
        <span className="text-[10px] uppercase tracking-widest text-apex-muted">scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white/60">
            <path d="M12 5v14M12 19l-6-6M12 19l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
