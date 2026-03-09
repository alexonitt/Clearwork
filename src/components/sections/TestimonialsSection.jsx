import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { testimonials } from '../../data/testimonials';
import { useTypewriter } from '../../hooks/useTypewriter';
import { staggerContainer, staggerItem, tween, spring } from '../../utils/motion';

function QuoteWithTypewriter({ quote, isInView }) {
  const [display, done] = useTypewriter(quote, 20, isInView);
  return (
    <p className="text-sm leading-relaxed text-apex-muted sm:text-base">
      &ldquo;{display}
      {!done && <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>|</motion.span>}
      {done && '”'}
    </p>
  );
}

export function TestimonialsSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.1 });

  return (
    <section ref={sectionRef} className="border-t border-apex-border bg-black py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          className="font-display text-3xl font-bold lowercase tracking-tight text-white sm:text-4xl md:text-5xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2 }}
          transition={tween.easeOut}
        >
          what our clients say
        </motion.h2>

        <motion.div
          className="mt-16 grid gap-8 md:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.1 }}
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              variants={staggerItem}
              className="flex justify-center"
              style={{ perspective: 1000 }}
            >
              <motion.blockquote
                className="rounded-xl border border-apex-border bg-apex-card p-6"
                initial={{ opacity: 0, rotateY: -12 }}
                whileInView={{ opacity: 1, rotateY: 0 }}
                viewport={{ amount: 0.3 }}
                transition={{ ...tween.easeOut, delay: i * 0.12 }}
                whileHover={{ rotateY: 3, transition: { duration: 0.2 } }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <QuoteWithTypewriter quote={t.quote} isInView={isInView} />
                <footer className="mt-6 flex items-center gap-4">
                  <motion.div
                    className="h-12 w-12 shrink-0 rounded-full bg-white/10"
                    whileInView={{ scale: 1 }}
                    initial={{ scale: 0.8 }}
                    viewport={{ amount: 0.5 }}
                    transition={spring.bouncy}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="flex h-full w-full items-center justify-center text-lg font-bold text-white">
                      {t.name.charAt(0)}
                    </span>
                  </motion.div>
                  <div>
                    <p className="font-medium text-white">{t.name}</p>
                    <p className="text-xs text-apex-muted">{t.role}</p>
                  </div>
                </footer>
              </motion.blockquote>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
