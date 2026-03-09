import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { services } from '../data/services';

function useInView(options = {}) {
  const { threshold = 0.1 } = options;
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsInView(true),
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isInView];
}

export function ServicesPage() {
  const [headingRef, headingInView] = useInView({ threshold: 0.2 });
  const [gridRef, gridInView] = useInView({ threshold: 0.05 });

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1
          ref={headingRef}
          className={`font-display text-4xl font-bold lowercase tracking-tight text-white transition-all duration-700 sm:text-5xl ${
            headingInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          what we offer
        </h1>
        <p
          className={`mt-4 max-w-2xl text-apex-muted transition-all duration-700 ${
            headingInView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
          style={{ transitionDelay: '0.1s' }}
        >
          Premium websites, smart automation, and lead systems built to convert.
        </p>

        <div
          ref={gridRef}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((service, i) => (
            <div
              key={service.id}
              className={`group rounded-xl border border-apex-border bg-apex-card p-6 shadow-apex-card transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:shadow-apex-card-hover ${
                gridInView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
              style={{ transitionDelay: gridInView ? `${0.08 + i * 0.06}s` : '0s' }}
            >
              <h2 className="font-display text-lg font-semibold text-white">
                {service.title}
              </h2>
              <p className="mt-2 text-sm font-medium text-apex-muted">
                {service.price}
              </p>
              <ul className="mt-4 space-y-2">
                {service.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-2 text-sm text-apex-muted"
                  >
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/60" />
                    {bullet}
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="mt-6 inline-block text-sm font-medium text-white underline-offset-4 transition-colors hover:underline"
              >
                get started →
              </Link>
            </div>
          ))}
        </div>

        <div
          className={`mt-16 flex justify-center transition-all duration-700 ${
            gridInView ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: gridInView ? '0.4s' : '0s' }}
        >
          <Link
            to="/contact"
            className="inline-flex items-center rounded-full border border-white px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-white hover:text-black"
          >
            book a free call
          </Link>
        </div>
      </div>
    </div>
  );
}
