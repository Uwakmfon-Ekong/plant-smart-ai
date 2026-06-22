import { Link } from "react-router-dom"
import { Mail, MapPin, Phone } from "lucide-react"
import Logo from '@/components/ui/Logo'

const footerLinks = {
  Platform: [
    { label: 'Plant Scanner', href: '/scan' },
    { label: 'Disease Detection', href: '/scan' },
    { label: 'AI Assistant', href: '/assistant' },
    { label: 'Crop Planning', href: '/dashboard' },
    { label: 'Analytics', href: '/dashboard' },
  ],
  Marketplace: [
    { label: 'Buy Seedlings', href: '/marketplace?cat=seedling' },
    { label: 'Farm Inputs', href: '/marketplace?cat=input' },
    { label: 'Sell Produce', href: '/marketplace/sell' },
    { label: 'Find Buyers', href: '/marketplace?cat=buyers' },
    { label: 'Expert Network', href: '/experts' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Data Partnerships', href: '/partners' },
    { label: 'Press Kit', href: '/press' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Logo variant="white" size="md" className="mb-4" />
            <p className="text-sm leading-relaxed text-white/55 max-w-xs mb-6">
              AI-powered agriculture intelligence for farmers, agribusinesses, research institutions, and government agencies worldwide.
            </p>
            <div className="flex gap-3">
              {['𝕏', 'in', 'f', '▶'].map((icon, i) => (
                <button key={i} className="w-9 h-9 rounded-lg bg-white/8 hover:bg-green-500 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5 text-sm font-bold text-white/60 hover:text-white">
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-5">{heading}</h4>
              <ul className="space-y-3 list-none">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-sm text-white/50 hover:text-green-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact bar */}
        <div className="border-t border-white/8 pt-8 mb-8">
          <div className="flex flex-wrap gap-6 text-sm text-white/50">
            <a href="mailto:ecoalliancegreensolutions@gmail.com" className="flex items-center gap-2 hover:text-green-400 transition-colors">
              <Mail size={14} className="text-green-500" />
              ecoalliancegreensolutions@gmail.com
            </a>
            <span className="flex items-center gap-2">
              <MapPin size={14} className="text-green-500" />
              Lagos, Nigeria · 32 countries
            </span>
            <span className="flex items-center gap-2">
              <Phone size={14} className="text-green-500" />
              +234 800 PLANTSMART
            </span>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <span>© 2025 PlantSmart AI. Built by Eco Alliance Green Solutions. All rights reserved.</span>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-green-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-green-400 transition-colors">Terms of Service</Link>
            <Link to="/partners" className="hover:text-green-400 transition-colors">Data Partnership</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
