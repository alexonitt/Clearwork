import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <motion.header
      className={`fixed left-0 right-0 top-0 z-50 ${
        scrolled ? 'bg-black/80 backdrop-blur-md border-b border-apex-border' : 'bg-transparent'
      }`}
      initial={{ opacity: 0, y: -16 }}
      animate={mounted ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-display text-lg font-bold tracking-tight text-white">
          Apex Labs
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`relative text-sm font-medium after:absolute after:bottom-0 after:left-0 after:h-px after:bg-white after:transition-all after:duration-200 after:content-[''] ${
                location.pathname === to
                  ? 'text-white after:w-full'
                  : 'text-apex-muted after:w-0 hover:text-white hover:after:w-full'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/contact"
            className="hidden rounded-full border border-white px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-white hover:text-black sm:inline-flex"
          >
            get in touch
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex flex-col gap-1.5 p-2 md:hidden"
            aria-label="Toggle menu"
          >
            <span className={`h-0.5 w-6 bg-white transition-transform ${mobileOpen ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`h-0.5 w-6 bg-white transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-6 bg-white transition-transform ${mobileOpen ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-apex-border bg-black/95 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={`py-3 text-sm font-medium ${location.pathname === to ? 'text-white' : 'text-apex-muted'}`}
              >
                {label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex rounded-full border border-white px-4 py-2 text-sm font-medium text-white"
            >
              get in touch
            </Link>
          </div>
        </div>
      )}
    </motion.header>
  );
}
