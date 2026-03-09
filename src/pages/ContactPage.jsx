import { useInView } from '../hooks/useInView';

export function ContactPage() {
  const [ref, inView] = useInView({ threshold: 0.2 });

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div
        ref={ref}
        className={`mx-auto max-w-2xl px-4 text-center transition-all duration-700 sm:px-6 lg:px-8 ${
          inView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <h1 className="font-display text-4xl font-bold lowercase tracking-tight text-white sm:text-5xl">
          get in touch
        </h1>
        <p className="mt-4 text-apex-muted sm:text-lg">
          Ready to scale your business? Book a free call and we&apos;ll discuss your goals.
        </p>
        <a
          href="https://calendly.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center rounded-full border border-white bg-white px-8 py-4 text-sm font-medium text-black transition-all duration-300 hover:bg-transparent hover:text-white"
        >
          book a free call
        </a>
        <p className="mt-8 text-sm text-apex-muted">
          Or email us at{' '}
          <a
            href="mailto:hello@apexlabs.io"
            className="text-white underline-offset-4 hover:underline"
          >
            hello@apexlabs.io
          </a>
        </p>
      </div>
    </div>
  );
}
