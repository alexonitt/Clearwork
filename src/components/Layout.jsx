import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function Layout({ children, navScrolled, pageLoaded }) {
  return (
    <div className="min-h-screen bg-cw-bg text-cw-text">
      <Navbar navScrolled={navScrolled} pageLoaded={pageLoaded} />
      {children}
      <Footer />
    </div>
  )
}
