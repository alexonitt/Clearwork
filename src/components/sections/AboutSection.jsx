import { useRef } from 'react';
import { motion, useInView, useMotionValue, useTransform } from 'framer-motion';
import { aboutStats, aboutCopy, aboutCards } from '../../data/about';
import { useCountUp } from '../../hooks/useCountUp';
import { staggerContainer, staggerItem, tween } from '../../utils/motion';

export function AboutSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.2 });
  const words = aboutCopy.split(' ');
  const count1 = useCountUp(aboutStats[0].value, 1500, isInView);
  const count2 = useCountUp(aboutStats[1].value, 1500, isInView);
  const count3 = useCountUp(aboutStats[2].value, 1500, isInView);
  const counts = [count1, count2, count3];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="border-t border-apex-border bg-black py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:gap-24">
        {/* Left: text */}
        <div className="flex flex-col justify-center">
          <motion.h2
            className="font-display text-3xl font-bold lowercase tracking-tight text-white sm:text-4xl md:text-5xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.2 }}
            transition={tween.easeOut}
          >
            who we are
          </motion.h2>
          <div className="mt-6 flex flex-wrap gap-x-2 gap-y-1 text-lg leading-relaxed text-apex-muted">
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.5 }}
                transition={{ ...tween.easeOut, delay: 0.02 * i }}
              >
                {word}{' '}
              </motion.span>
            ))}
          </div>
          <motion.div
            className="mt-12 grid grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.3 }}
          >
            {aboutStats.map((stat, i) => (
              <motion.div key={stat.label} variants={staggerItem} className="text-center lg:text-left">
                <p className="font-display text-2xl font-bold text-white sm:text-3xl">
                  {counts[i]}
                  {stat.suffix}
                </p>
                <p className="mt-1 text-xs uppercase tracking-widest text-apex-muted">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right: animated graphic */}
        <div className="relative flex min-h-[320px] items-center justify-center lg:min-h-[400px]">
          <motion.svg
            className="absolute h-full w-full max-w-md"
            viewBox="0 0 300 300"
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.circle
              cx="150"
              cy="150"
              r="120"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: { pathLength: 1, opacity: 1, transition: { duration: 1.2, ease: 'easeInOut' } },
              }}
            />
            <motion.circle
              cx="150"
              cy="150"
              r="90"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: { pathLength: 1, opacity: 1, transition: { duration: 1, delay: 0.2, ease: 'easeInOut' } },
              }}
            />
            <motion.circle
              cx="150"
              cy="150"
              r="60"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: { pathLength: 1, opacity: 1, transition: { duration: 0.8, delay: 0.4, ease: 'easeInOut' } },
              }}
            />
            <motion.line
              x1="150"
              y1="30"
              x2="150"
              y2="150"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: { pathLength: 1, opacity: 1, transition: { duration: 0.6, delay: 0.6 } },
              }}
            />
            <motion.line
              x1="150"
              y1="150"
              x2="270"
              y2="150"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: { pathLength: 1, opacity: 1, transition: { duration: 0.6, delay: 0.7 } },
              }}
            />
            <motion.circle
              cx="150"
              cy="150"
              r="12"
              fill="rgba(255,255,255,0.15)"
              variants={{
                hidden: { scale: 0, opacity: 0 },
                visible: { scale: 1, opacity: 1, transition: { ...tween.easeOut, delay: 0.9 } },
              }}
            />
          </motion.svg>
          <motion.div
            className="absolute h-24 w-24 rounded-full border border-white/10 bg-white/5"
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute h-16 w-16 rounded-full border border-white/10 bg-white/5"
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </div>

      {/* Flip/slide cards */}
      <motion.div
        className="mx-auto mt-24 grid gap-6 sm:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.2 }}
      >
        {aboutCards.map((card, i) => (
          <motion.div
            key={card.title}
            variants={staggerItem}
            className="group rounded-xl border border-apex-border bg-apex-card p-6 transition-colors hover:border-white/20"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.2 }}
            transition={{ ...tween.easeOut, delay: i * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <h3 className="font-display text-lg font-semibold text-white">{card.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-apex-muted">{card.body}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
