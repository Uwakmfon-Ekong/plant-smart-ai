import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'

const navLinks = [
  { label: 'Scan', href: '/scan' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Experts', href: '/experts' },
  { label: 'Community', href: '/community' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Ask Me Anything', href: '/assistant' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, signOut } = useAuth()
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    document.body.style.overflow = ''
  }, [location])

  const toggleMobile = () => {
    setMobileOpen((v) => {
      document.body.style.overflow = !v ? 'hidden' : ''
      return !v
    })
  }

  const navBg = scrolled
    ? 'bg-white/97 backdrop-blur-xl shadow-sm border-b border-gray-100'
    : isHome
    ? 'bg-transparent'
    : 'bg-white shadow-sm border-b border-gray-100'

  const linkColor = scrolled || !isHome ? 'text-gray-600 hover:text-green-500' : 'text-white/85 hover:text-white'
  const logoVariant = scrolled || !isHome ? 'dark' : 'white'

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-300 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <Link to="/">
            <Logo variant={logoVariant} size="sm" />
          </Link>

          {/* Desktop Links */}
          <ul className="hidden lg:flex items-center gap-7 list-none">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.href} className={`text-sm font-medium transition-colors duration-200 ${linkColor}`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant={scrolled || !isHome ? 'outline' : 'ghost'} size="sm">Dashboard</Button>
                </Link>
                <Button variant="primary" size="sm" onClick={signOut}>Sign Out</Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant={scrolled || !isHome ? 'outline' : 'ghost'} size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Get Started →</Button>
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            onClick={toggleMobile}
            className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled || !isHome ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-white transform transition-transform duration-350 ease-in-out ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ top: '72px' }}
      >
        <div className="p-6 flex flex-col h-full overflow-y-auto">
          <Logo variant="dark" size="md" className="mb-8" />
          <ul className="list-none space-y-1 mb-8 flex-1">
            {navLinks.map((link) => (
              <li key={link.label} className="border-b border-gray-100">
                <Link
                  to={link.href}
                  className="block py-4 text-base font-semibold text-gray-700 hover:text-green-500 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 pb-8">
            {user ? (
              <>
                <Link to="/dashboard"><Button variant="outline" size="lg" fullWidth>Dashboard</Button></Link>
                <Button variant="primary" size="lg" fullWidth onClick={signOut}>Sign Out</Button>
              </>
            ) : (
              <>
                <Link to="/login"><Button variant="outline" size="lg" fullWidth>Sign In</Button></Link>
                <Link to="/register"><Button variant="primary" size="lg" fullWidth>Get Started Free →</Button></Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
