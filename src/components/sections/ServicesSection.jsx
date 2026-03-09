import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { services } from '../../data/services';
import { staggerContainer, staggerItem, spring, tween } from '../../utils/motion';

const ServiceIcons = {
  'ai-revenue-website': () => (
    <svg className="h-8 w-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zM9 9h6M9 13h6M9 17h4" />
    </svg>
  ),
  'ai-chatbot': () => (
    <svg className="h-8 w-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  ),
  'lead-capture': () => (
    <svg className="h-8 w-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  whatsapp: () => (
    <svg className="h-8 w-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 2.293.283.21-.025.396-.104.53-.198.135-.094.18-.22.18-.396v-.614c0-.198-.054-.356-.161-.481a.637.637 0 00-.465-.178c-.198 0-.376.079-.533.237a.877.877 0 01-.534.237H6.75m12.75 0a.75.75 0 00-.75.75v.375c0 .199-.072.375-.214.521a.75.75 0 01-.536.222H15.75" />
    </svg>
  ),
};

export function ServicesSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.1 });

  return (
    <section id="services" ref={sectionRef} className="border-t border-apex-border bg-black py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.h2
          className="font-display text-3xl font-bold lowercase tracking-tight text-white sm:text-4xl md:text-5xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2 }}
          transition={tween.easeOut}
        >
          what we offer
        </motion.h2>

        <motion.div
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.08 }}
        >
          {services.map((service, i) => {
            const Icon = ServiceIcons[service.id] || ServiceIcons['ai-revenue-website'];
            return (
              <motion.div key={service.id} variants={staggerItem}>
                {/* Card 1: scale + shadow */}
                {i === 0 && (
                  <motion.div
                    className="group rounded-xl border border-apex-border bg-apex-card p-6"
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.03, boxShadow: '0 24px 48px rgba(255,255,255,0.08)' }}
                    transition={spring.bouncy}
                  >
                    <CardContent service={service} Icon={Icon} />
                  </motion.div>
                )}
                {/* Card 2: slide + background */}
                {i === 1 && (
                  <motion.div
                    className="group rounded-xl border border-apex-border bg-apex-card p-6"
                    initial={{ x: 0 }}
                    whileHover={{ x: 8, backgroundColor: 'rgba(22,22,22,1)' }}
                    transition={spring.gentle}
                  >
                    <CardContent service={service} Icon={Icon} />
                  </motion.div>
                )}
                {/* Card 3: 3D rotate + glow */}
                {i === 2 && (
                  <motion.div
                    className="group rounded-xl border border-apex-border bg-apex-card p-6"
                    style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
                    initial={{ rotateY: 0 }}
                    whileHover={{ rotateY: 5, boxShadow: '0 0 40px rgba(255,255,255,0.08)' }}
                    transition={spring.gentle}
                  >
                    <CardContent service={service} Icon={Icon} />
                  </motion.div>
                )}
                {/* Card 4: morph radius + brightness */}
                {i === 3 && (
                  <motion.div
                    className="group rounded-xl border border-apex-border bg-apex-card p-6"
                    initial={{ borderRadius: 12 }}
                    whileHover={{ borderRadius: 24, filter: 'brightness(1.08)' }}
                    transition={spring.gentle}
                  >
                    <CardContent service={service} Icon={Icon} />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.2 }}
          transition={{ ...tween.easeOut, delay: 0.3 }}
        >
          <Link
            to="/contact"
            className="inline-flex items-center rounded-full border border-white px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-white hover:text-black"
          >
            book a free call
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function CardContent({ service, Icon }) {
  return (
    <>
      <motion.div className="mb-4 inline-flex" whileHover={{ scale: 1.15, rotate: 5 }} transition={spring.bouncy}>
        <Icon />
      </motion.div>
      <h3 className="font-display text-lg font-semibold text-white">{service.title}</h3>
      <motion.span
        className="mt-2 inline-block rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-white/90"
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {service.price}
      </motion.span>
      <ul className="mt-4 space-y-2">
        {service.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2 text-sm text-apex-muted">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/60" />
            {bullet}
          </li>
        ))}
      </ul>
      <Link to="/contact" className="mt-6 inline-block text-sm font-medium text-white underline-offset-4 hover:underline">
        get started →
      </Link>
    </>
  );
}
