import { useEffect, useRef, useState } from 'react'
import { Layout } from './components/Layout'

function useInView() {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.18 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return [ref, isInView]
}

const insideFeatures = [
  { title: 'Life', body: 'Master calendar, meetings, fitness planner, and quick notes. Your daily command centre.' },
  { title: 'Self-Care', body: 'Brain dump, habit tracker, goals, and supplement log. Build the habits that stick.' },
  { title: 'Household', body: 'Chore tracker, recipes, plant tracker, and more. Keep your home running smoothly.' },
  { title: 'Planning Ahead', body: 'Budget planner, travel plans, shopping lists, social events. Never miss a beat.' },
]

const faqs = [
  { question: 'What tools do I need?', answer: 'Just Notion. Both the free and paid plans work perfectly with the template.' },
  { question: 'Can I customise the template?', answer: 'Fully. Every page, block, and database is editable so you can adapt it to your workflow.' },
  { question: 'Do I get updates?', answer: 'Yes. You get access to all future improvements and refinements to the Ultimate Life Planner for free.' },
  { question: "What's your refund policy?", answer: "7-day money back, no questions asked. If it's not a fit, reply to your receipt and we'll refund you." },
]

const testimonials = [
  { quote: "I used to have 6 different apps for all of this. Now it's just Notion.", name: 'Sophie R.', role: 'Freelance Designer' },
  { quote: "The routine tracker alone was worth it. I've been consistent for 3 months straight.", name: 'James K.', role: 'Founder' },
  { quote: "It's the only system I've actually stuck with. Everything just makes sense.", name: 'Mia T.', role: 'Student' },
]

const GUMROAD_URL = 'https://alvarezian3.gumroad.com/l/otqzdd'

export default function App() {
  const [openFaq, setOpenFaq] = useState(faqs[0].question)
  const [pageLoaded, setPageLoaded] = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)
  const [insideSectionRef, insideInView] = useInView()
  const [routineSectionRef, routineInView] = useInView()
  const [testimonialsSectionRef, testimonialsInView] = useInView()
  const [faqSectionRef, faqInView] = useInView()
  const [ctaSectionRef, ctaInView] = useInView()

  useEffect(() => {
    const t = setTimeout(() => setPageLoaded(true), 50)
    const onScroll = () => setNavScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(t)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <Layout navScrolled={navScrolled} pageLoaded={pageLoaded}>
      <main id="top">
        <section id="inside" className="bg-white">
          <div className="mx-auto max-w-6xl px-4 pt-20 pb-16 sm:px-6 lg:px-8 lg:pt-28 lg:pb-20">
            <div className="text-center">
              <p className={`text-xs font-medium uppercase tracking-[0.22em] text-cw-muted transition-all duration-700 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                Notion template
              </p>
              <h1 className={`mt-4 font-serif text-4xl tracking-tight text-cw-text sm:text-5xl lg:text-[3.25rem] transition-all duration-700 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{ transitionDelay: '0.12s' }}>
                Work with more clarity.
              </h1>
              <p className={`mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-cw-muted sm:text-base transition-all duration-700 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{ transitionDelay: '0.24s' }}>
                A complete system for your entire life. Routines, goals, health, household, finances, and planning — all connected in one place.
              </p>
            </div>
            <div ref={insideSectionRef} className={`mt-12 transition-all duration-700 ${insideInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <article className="group rounded-2xl border border-cw-border bg-[#FAFAF8] p-6 shadow-cw-card transition-all duration-200 hover:border-cw-accent hover:shadow-cw-card-hover sm:p-8">
                <header className="flex items-start justify-between gap-4">
                  <h2 className="font-serif text-2xl text-cw-text sm:text-3xl">Ultimate Life Planner</h2>
                  <span className="text-sm font-medium text-cw-muted">$29</span>
                </header>
                <div className="mt-6 flex justify-center">
                  <div className="w-full max-w-2xl rounded-xl border border-cw-border bg-white p-4 shadow-sm sm:p-5">
                    <div className="mb-3 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#E2E2DD]" />
                      <span className="h-2 w-2 rounded-full bg-[#E2E2DD]" />
                      <span className="h-2 w-2 rounded-full bg-[#E2E2DD]" />
                    </div>
                    <div className="flex items-center justify-between border-b border-cw-border pb-3">
                      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-cw-muted">Dashboard</p>
                      <span className="rounded-full border border-cw-border bg-cw-bg-muted px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-cw-muted">Notion</span>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg border border-cw-border bg-cw-bg-muted/50 p-3">
                        <p className="text-[11px] font-medium text-cw-text">This week</p>
                        <p className="mt-1 text-[10px] text-cw-muted">Routines · Priorities · Tasks</p>
                      </div>
                      <div className="rounded-lg border border-cw-border bg-cw-bg-muted/50 p-3">
                        <p className="text-[11px] font-medium text-cw-text">Today</p>
                        <p className="mt-1 text-[10px] text-cw-muted">Focus blocks · Reviews</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {insideFeatures.map((f) => (
                    <div key={f.title} className="rounded-xl border border-cw-border bg-white/80 p-4">
                      <h3 className="text-sm font-semibold text-cw-text">{f.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-cw-muted">{f.body}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-center">
                  <a href={GUMROAD_URL} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-medium text-cw-text underline-offset-4 hover:text-cw-accent">
                    Get Template — $29
                    <span className="ml-1.5" aria-hidden="true">→</span>
                  </a>
                </div>
              </article>
            </div>
            <p className="mt-10 text-center text-xs font-medium uppercase tracking-[0.22em] text-cw-muted">
              Trusted by 1,200+ makers and founders
            </p>
          </div>
        </section>

        <section className="bg-cw-accent">
          <div ref={routineSectionRef} className={`mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 transition-all duration-700 ${routineInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="text-center text-white">
              <h2 className="font-serif text-2xl tracking-tight sm:text-3xl">Morning and evening routines, built in.</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/80">Track your daily habits across the whole week. Reset with one click.</p>
            </div>
          </div>
        </section>

        <section className="border-y border-cw-border bg-white">
          <div ref={testimonialsSectionRef} className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <h2 className={`font-serif text-2xl tracking-tight text-cw-text sm:text-3xl transition-all duration-700 ${testimonialsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              From people who actually use it.
            </h2>
            <div className="mt-10 grid gap-10 md:grid-cols-3">
              {testimonials.map((t) => (
                <figure key={t.name} className={`space-y-4 transition-all duration-700 ${testimonialsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                  <blockquote className="font-serif text-base italic leading-relaxed text-cw-text">"{t.quote}"</blockquote>
                  <figcaption className="text-sm text-cw-muted">
                    <p className="font-medium text-cw-text">{t.name}</p>
                    <p>{t.role}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="bg-cw-bg-muted">
          <div ref={faqSectionRef} className={`mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20 transition-all duration-700 ${faqInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <h2 className="font-serif text-2xl tracking-tight text-cw-text sm:text-3xl">Questions, answered simply.</h2>
            <div className="mt-8 divide-y divide-cw-border border-t border-b border-cw-border bg-white/60">
              {faqs.map((faq) => {
                const isOpen = openFaq === faq.question
                return (
                  <div key={faq.question}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-4 py-4 text-left text-sm text-cw-text sm:px-5"
                      onClick={() => setOpenFaq((c) => (c === faq.question ? null : faq.question))}
                    >
                      <span className="font-medium">{faq.question}</span>
                      <span className="text-xs text-cw-muted">{isOpen ? '–' : '+'}</span>
                    </button>
                    <div className={`px-4 sm:px-5 overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} style={{ maxHeight: isOpen ? 160 : 0, paddingBottom: isOpen ? '1rem' : 0 }}>
                      {faq.answer}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section id="cta" className="bg-white">
          <div ref={ctaSectionRef} className={`mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20 transition-all duration-700 ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <h2 className="font-serif text-3xl tracking-tight text-cw-text sm:text-4xl">Your whole life. One template.</h2>
            <p className="mt-3 text-sm leading-relaxed text-cw-muted">Instant Notion access. Fully customisable. One-time payment.</p>
            <div className="mt-8">
              <a href={GUMROAD_URL} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full border border-cw-accent bg-cw-accent px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-900">
                Get the Ultimate Life Planner — $29
              </a>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  )
}
