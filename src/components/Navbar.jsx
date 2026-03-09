export function Navbar({ navScrolled = false, pageLoaded = true }) {
  return (
    <header
      className={`sticky top-0 z-30 border-b border-cw-border bg-white/90 backdrop-blur transition-all duration-700 ease-out ${
        navScrolled ? 'shadow-sm' : ''
      } ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
      style={{ transitionDelay: '0.3s' }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="font-serif text-xl tracking-tight text-cw-text">
          Clearwork
        </a>
        <nav className="hidden items-center gap-8 text-sm text-cw-muted md:flex">
          <a href="#inside" className="transition-colors hover:text-cw-text">
            What&apos;s inside
          </a>
          <a href="#faq" className="transition-colors hover:text-cw-text">
            FAQ
          </a>
        </nav>
        <a
          href="https://alvarezian3.gumroad.com/l/otqzdd"
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-cw-border px-4 py-2 text-sm text-cw-text transition-colors hover:border-cw-accent hover:bg-cw-bg-muted"
        >
          Get the Template
        </a>
      </div>
    </header>
  )
}
