import { Link } from 'react-router-dom';

const footerLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/contact', label: 'Contact' },
];

export function Footer() {
  return (
    <footer className="border-t border-apex-border bg-apex-bg">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          <Link to="/" className="font-display text-xl font-bold text-white">
            Apex Labs
          </Link>
          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            {footerLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-apex-muted transition-colors hover:text-white"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-8 text-center text-xs text-apex-muted sm:text-left">
          © {new Date().getFullYear()} Apex Labs. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
