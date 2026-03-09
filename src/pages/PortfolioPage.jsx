import { useInView } from '../hooks/useInView';
import { portfolioItems } from '../data/portfolio';
import { ClearworkMockup, TrackrMockup, TitanMockup } from '../components/portfolio/PortfolioMockup';

const mockupMap = {
  clearwork: ClearworkMockup,
  trackr: TrackrMockup,
  titan: TitanMockup,
};

export function PortfolioPage() {
  const [headingRef, headingInView] = useInView({ threshold: 0.2 });
  const [cardsRef, cardsInView] = useInView({ threshold: 0.06 });

  return (
    <div className="min-h-screen pt-24 pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1
          ref={headingRef}
          className={`font-display text-4xl font-bold lowercase tracking-tight text-white transition-all duration-700 sm:text-5xl ${
            headingInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          our work
        </h1>
        <p
          className={`mt-4 max-w-2xl text-apex-muted transition-all duration-700 ${
            headingInView ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
          style={{ transitionDelay: '0.1s' }}
        >
          Selected projects: premium websites and platforms we&apos;ve built for clients.
        </p>

        <div ref={cardsRef} className="mt-16 space-y-16 md:space-y-24">
          {portfolioItems.map((item, i) => {
            const Mockup = mockupMap[item.imageType];
            return (
              <article
                key={item.id}
                className={`group transition-all duration-700 ${
                  cardsInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: cardsInView ? `${0.1 + i * 0.15}s` : '0s' }}
              >
                <div className="overflow-hidden rounded-2xl border border-apex-border bg-apex-card transition-all duration-300 hover:border-white/20 hover:shadow-apex-card-hover">
                  <div className="p-6 sm:p-8 md:p-10">
                    <div className="mb-6 transition-transform duration-300 group-hover:scale-[1.02]">
                      {Mockup && <Mockup />}
                    </div>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <span className="text-xs font-medium uppercase tracking-widest text-apex-muted">
                          {item.category}
                        </span>
                        <h2 className="mt-1 font-display text-xl font-semibold text-white sm:text-2xl">
                          {item.title} — {item.subtitle}
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-apex-muted">
                          {item.description}
                        </p>
                      </div>
                      <a
                        href={item.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-sm font-medium text-white underline-offset-4 transition-colors hover:underline"
                      >
                        View project →
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
