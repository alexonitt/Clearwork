export function Footer() {
  return (
    <footer className="border-t border-cw-border bg-cw-bg-muted">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-8 text-sm text-cw-muted sm:px-6 sm:py-10 lg:flex-row lg:px-8">
        <div>
          <p className="font-serif text-lg text-cw-text">Clearwork</p>
          <p className="mt-1 text-xs uppercase tracking-[0.22em]">
            One system for your entire life.
          </p>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm">
          <a href="#inside" className="hover:text-cw-text">
            What&apos;s inside
          </a>
          <a href="#faq" className="hover:text-cw-text">
            FAQ
          </a>
          <a href="mailto:hello@clearwork.studio" className="hover:text-cw-text">
            Contact
          </a>
        </nav>
        <p className="text-xs text-cw-muted">
          © {new Date().getFullYear()} Clearwork. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
