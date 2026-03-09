import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { portfolioItems } from '../../data/portfolio';
import { ClearworkMockup, TrackrMockup, TitanMockup } from '../portfolio/PortfolioMockup';
import { tween, spring } from '../../utils/motion';

const mockupMap = { clearwork: ClearworkMockup, trackr: TrackrMockup, titan: TitanMockup };

export function PortfolioSection() {
  return (
    <section id="portfolio" className="border-t border-apex-border bg-black">
      <PortfolioShowcaseClearwork item={portfolioItems[0]} Mockup={ClearworkMockup} />
      <PortfolioShowcaseTrackr item={portfolioItems[1]} Mockup={TrackrMockup} />
      <PortfolioShowcaseTitan item={portfolioItems[2]} Mockup={TitanMockup} />
    </section>
  );
}

function PortfolioShowcaseClearwork({ item, Mockup }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [80, 0, 0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);
  const xRight = useTransform(scrollYProgress, [0.1, 0.35], [120, 0]);

  return (
    <div ref={ref} className="relative flex min-h-screen flex-col items-center justify-center px-4 py-24 sm:px-6 lg:flex-row lg:gap-16 lg:px-12">
      <motion.div className="w-full max-w-xl lg:max-w-2xl" style={{ y }}>
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
          <Mockup />
        </motion.div>
      </motion.div>
      <motion.div
        className="mt-12 flex flex-col justify-center lg:mt-0 lg:max-w-md"
        style={{ opacity, x: xRight }}
      >
        <span className="text-xs font-medium uppercase tracking-widest text-apex-muted">{item.category}</span>
        <h2 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
          {item.title} — {item.subtitle}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-apex-muted">{item.description}</p>
        <motion.a
          href={item.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center text-sm font-medium text-white underline-offset-4 hover:underline"
          whileHover={{ x: 4 }}
          transition={spring.gentle}
        >
          View project →
        </motion.a>
      </motion.div>
    </div>
  );
}

function PortfolioShowcaseTrackr({ item, Mockup }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 0.25], [60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const pathLength = useTransform(scrollYProgress, [0.15, 0.45], [0, 1]);
  const isInView = useInView(ref, { amount: 0.2 });

  return (
    <div ref={ref} className="relative flex min-h-screen flex-col items-center justify-center bg-apex-card px-4 py-24 sm:px-6 lg:flex-row-reverse lg:gap-16 lg:px-12">
      <motion.div className="w-full max-w-xl lg:max-w-2xl" style={{ y }}>
        <div className="relative">
          <Mockup />
          {/* Ticking numbers overlay */}
          {isInView && (
            <motion.div
              className="absolute right-4 top-4 flex gap-2 rounded-lg border border-white/10 bg-black/60 px-3 py-2 font-mono text-xs text-white"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={tween.easeOut}
            >
              <TickingNumber value={1247} />
              <TickingNumber value={98} suffix="%" />
            </motion.div>
          )}
        </div>
        {/* Chart line that draws itself */}
        <svg className="mt-4 h-16 w-full max-w-md" viewBox="0 0 400 60" fill="none">
          <motion.path
            d="M0 40 Q100 20 200 35 T400 25"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            style={{ pathLength }}
          />
        </svg>
      </motion.div>
      <motion.div className="mt-12 flex flex-col justify-center lg:mt-0 lg:max-w-md" style={{ opacity }}>
        <span className="text-xs font-medium uppercase tracking-widest text-apex-muted">{item.category}</span>
        <h2 className="mt-2 font-display text-2xl font-bold text-white sm:text-3xl">
          {item.title} — {item.subtitle}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-apex-muted">{item.description}</p>
        <motion.a
          href={item.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center text-sm font-medium text-white underline-offset-4 hover:underline"
          whileHover={{ x: 4 }}
          transition={spring.gentle}
        >
          View project →
        </motion.a>
      </motion.div>
    </div>
  );
}

function TickingNumber({ value, suffix = '' }) {
  const [display, setDisplay] = useState(value);
  const ref = useRef(null);
  const inView = useInView(ref);

  useEffect(() => {
    if (!inView) return;
    const end = value;
    let start = Math.max(0, end - 50);
    const duration = 1500;
    const startTime = performance.now();
    const tick = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - t) * (1 - t);
      setDisplay(Math.round(start + (end - start) * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return <span ref={ref}>{display}{suffix}</span>;
}

function PortfolioShowcaseTitan({ item, Mockup }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);
  const yBg = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  const shows = ['Live at the Arena', 'Summer Tour 2025', 'Festival Night'];

  return (
    <div ref={ref} className="relative min-h-screen overflow-hidden bg-zinc-950 px-4 py-24 sm:px-6 lg:px-12">
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black"
        style={{ y: yBg }}
      />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col lg:flex-row lg:items-center lg:gap-16">
        <motion.div className="flex-1" style={{ opacity }}>
          <span className="text-xs font-medium uppercase tracking-widest text-apex-muted">{item.category}</span>
          <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
            {item.title} — {item.subtitle}
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-apex-muted">{item.description}</p>
          <motion.a
            href={item.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center text-sm font-medium text-white underline-offset-4 hover:underline"
            whileHover={{ x: 4 }}
            transition={spring.gentle}
          >
            View project →
          </motion.a>
        </motion.div>
        <div className="mt-12 flex flex-col gap-4 lg:mt-0 lg:max-w-sm">
          {shows.map((show, i) => (
            <motion.div
              key={show}
              className="rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur-sm"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.3 }}
              transition={{ ...tween.easeOut, delay: i * 0.1 }}
            >
              <p className="font-medium text-white">{show}</p>
              <p className="mt-1 text-xs text-apex-muted">Upcoming</p>
            </motion.div>
          ))}
        </div>
      </div>
      <motion.div
        className="absolute bottom-12 left-1/2 w-full max-w-md -translate-x-1/2 rounded-xl border border-apex-border bg-apex-card/90 p-4 backdrop-blur lg:bottom-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.2 }}
        transition={tween.easeOut}
      >
        <Mockup />
      </motion.div>
    </div>
  );
}
