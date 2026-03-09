import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { tween, spring } from '../../utils/motion';

const heading = "ready to scale your business?";
const subtext = "let's build something great together";

export function CtaSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2 });

  return (
    <section ref={ref} className="border-t border-apex-border bg-black py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl font-bold lowercase tracking-tight text-white sm:text-4xl md:text-5xl">
          {heading.split('').map((char, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...tween.easeOut, delay: i * 0.03 }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </h2>
        <p className="mt-4 text-apex-muted sm:text-lg">
          {subtext.split('').map((char, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.2, delay: heading.length * 0.03 + i * 0.02 }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </p>
        <motion.div
          className="mt-10 flex justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ ...tween.easeOut, delay: 0.5 }}
        >
          <AdvancedCTAButton />
        </motion.div>
      </div>
    </section>
  );
}

function AdvancedCTAButton() {
  return (
    <Link to="/contact" className="group relative inline-block">
      <motion.span
        className="relative flex items-center justify-center overflow-hidden rounded-full border border-white px-8 py-4 text-sm font-medium text-white"
        whileHover="hover"
        whileTap="tap"
        initial="rest"
        variants={{
          rest: { scale: 1 },
          hover: { scale: 1.02, boxShadow: '0 0 30px rgba(255,255,255,0.15)' },
          tap: { scale: 0.98 },
        }}
        transition={spring.gentle}
      >
        {/* Fill layer left to right */}
        <motion.span
          className="absolute inset-0 z-0 rounded-full bg-white"
          variants={{
            rest: { x: '-100%' },
            hover: { x: 0 },
          }}
          transition={tween.easeInOut}
          style={{ transformOrigin: 'left' }}
        />
        {/* Underline grow */}
        <motion.span
          className="absolute bottom-0 left-0 h-0.5 bg-white"
          variants={{
            rest: { width: 0 },
            hover: { width: '100%' },
          }}
          transition={tween.easeInOut}
        />
        <motion.span
          className="relative z-10 transition-colors duration-300 group-hover:text-black"
          variants={{
            rest: { color: '#fff' },
            hover: { color: '#000' },
          }}
          transition={{ delay: 0.1 }}
        >
          book a free call
        </motion.span>
      </motion.span>
    </Link>
  );
}
