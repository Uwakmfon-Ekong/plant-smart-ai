import { Camera, Cpu, ClipboardList, CheckCircle, Mail, MapPin, Phone } from 'lucide-react'
import Button from '@/components/ui/Button'
import { Link } from 'react-router-dom'
import { useState } from 'react'

// ─── How It Works ───────────────────────────────────────────────────────────
const steps = [
  { num: '1', icon: '📸', title: 'Upload Image', desc: 'Take a photo of your plant or affected crop area. Works in any light condition, day or night.' },
  { num: '2', icon: '🤖', title: 'AI Analysis', desc: 'Our multi-model AI analyses visual symptoms against 2M+ agricultural data points in seconds.' },
  { num: '3', icon: '📋', title: 'Get Diagnosis', desc: 'Receive detailed report: disease name, severity, affected area percentage, and root cause.' },
  { num: '4', icon: '✅', title: 'Take Action', desc: 'Follow precise chemical recommendations with dosage, application method, and where to buy.' },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14" data-reveal>
          <span className="section-label">How It Works</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-4">
            From Photo to <span className="text-green-500">Action Plan</span> in Seconds
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Our AI pipeline transforms a simple field photo into a comprehensive, actionable agricultural intelligence report.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <div
              key={step.num}
              data-reveal
              className="bg-white border-[1.5px] border-gray-200 rounded-2xl p-6 text-center hover:border-green-500 hover:-translate-y-1 hover:shadow-green transition-all duration-300"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-lg font-extrabold font-display mx-auto mb-4 shadow-green">
                {step.num}
              </div>
              <div className="text-3xl mb-3">{step.icon}</div>
              <h3 className="text-sm font-extrabold text-gray-900 mb-2 font-display">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Marketplace ─────────────────────────────────────────────────────────────
const mktCards = [
  { icon: '🌱', badge: 'Shop Now', title: 'Premium Seedling Store', desc: 'Access certified, disease-free seedlings from verified nurseries. Browse 500+ varieties with quality guarantees, delivery tracking, and planting guides.', href: '/marketplace?cat=seedling' },
  { icon: '🧴', badge: 'Inputs', title: 'Farm Inputs & Supplies', desc: 'Fertilizers, pesticides, irrigation equipment — sourced directly from manufacturers at wholesale prices. AI recommends based on your diagnosis.', href: '/marketplace?cat=input' },
  { icon: '📦', badge: 'Sell Produce', title: 'Produce Trading Platform', desc: 'List your harvest and connect with verified buyers — restaurants, exporters, processors, and retailers. Set your price. No auction commission.', href: '/marketplace/sell' },
  { icon: '🤝', badge: 'Off-takers', title: 'Direct Buyer Connections', desc: 'Get matched with vetted off-takers who need consistent supply. Negotiate long-term contracts and eliminate market uncertainty forever.', href: '/marketplace?cat=buyers' },
]

export function MarketplaceSection() {
  return (
    <section id="marketplace" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14" data-reveal>
          <span className="section-label">Marketplace</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-4">
            Cut Out the Middleman. <span className="text-green-500">Maximise Profit.</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            A direct-to-buyer agricultural marketplace connecting farmers with verified off-takers, wholesale buyers, and premium markets.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {mktCards.map((card, i) => (
            <div
              key={card.title}
              data-reveal
              className="border-[1.5px] border-gray-200 rounded-2xl p-7 hover:border-green-500 hover:-translate-y-1 hover:shadow-green transition-all duration-300 group"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="text-4xl mb-3">{card.icon}</div>
              <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full mb-3">{card.badge}</span>
              <h3 className="text-lg font-extrabold text-gray-900 mb-2 font-display">{card.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">{card.desc}</p>
              <Link to={card.href}>
                <Button variant="outline" size="sm">Explore →</Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Experts ─────────────────────────────────────────────────────────────────
const experts = [
  { emoji: '👩‍🔬', role: 'Plant Pathologist', name: 'Dr. Amara Osei', bio: '12 years specialising in fungal and bacterial crop diseases across West Africa. PhD, University of Ghana.', rating: '4.9', sessions: '312' },
  { emoji: '👨‍🌾', role: 'Agronomist', name: 'Samuel Eze, MSc', bio: 'Sustainable maize and cassava cultivation specialist. FAO consultant across 8 African countries.', rating: '4.8', sessions: '547' },
  { emoji: '👩‍💼', role: 'Soil Scientist', name: 'Prof. Ngozi Adeyemi', bio: 'Soil health and fertility management expert. Research lead at IITA. Author of 40+ peer-reviewed papers.', rating: '5.0', sessions: '218' },
]

export function ExpertsSection() {
  return (
    <section id="experts" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14" data-reveal>
          <span className="section-label">Expert Network</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-4">
            On-Demand <span className="text-green-500">Agricultural Expertise</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Book video consultations with certified agronomists, soil scientists, and crop research specialists. Real expertise, on your schedule.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {experts.map((e, i) => (
            <div
              key={e.name}
              data-reveal
              className="bg-white border-[1.5px] border-gray-200 rounded-2xl p-7 text-center hover:border-green-500 hover:-translate-y-1 hover:shadow-green transition-all duration-300"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="w-[72px] h-[72px] bg-green-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border-3 border-green-100 text-4xl">{e.emoji}</div>
              <div className="text-[10px] font-bold text-green-500 tracking-widest uppercase mb-1">{e.role}</div>
              <h3 className="text-base font-extrabold text-gray-900 mb-2 font-display">{e.name}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{e.bio}</p>
              <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mb-4">
                <span className="text-yellow-400">★★★★★</span>
                <span className="font-semibold text-gray-700">{e.rating}</span>
                <span className="text-gray-400">({e.sessions} sessions)</span>
              </div>
              <Link to="/experts">
                <Button variant="outline" size="sm" fullWidth>Book Session</Button>
              </Link>
            </div>
          ))}
        </div>
        <div className="text-center mt-10" data-reveal>
          <Link to="/experts">
            <Button variant="primary" size="lg">View All 200+ Experts →</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── Community ────────────────────────────────────────────────────────────────
const posts = [
  { emoji: '🧑🏾', name: 'Kwame Asante', country: '🇬🇭 Ghana', text: 'Used PlantSmart to identify early blight on my tomatoes 3 weeks before it spread. The AI recommended Mancozeb 80WP — field is fully recovered!', tags: ['Tomato', 'Disease Control', 'Success'] },
  { emoji: '👩🏽', name: 'Fatima Al-Hassan', country: '🇳🇬 Nigeria', text: 'The marketplace connected me to a Lagos export buyer — selling 3x more produce at 40% better margins than local market. Total game changer.', tags: ['Marketplace', 'Export', 'Revenue'] },
  { emoji: '👨🏿', name: 'Dr. Jean-Pierre Mutamba', country: '🇨🇩 DRC — Researcher', text: 'We use PlantSmart\'s anonymised dataset for regional disease outbreak tracking in our CGIAR research. Data quality is exceptional.', tags: ['Research', 'FAO Data', 'CGIAR'] },
]

export function CommunitySection() {
  return (
    <section id="community" className="py-24 bg-green-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div data-reveal>
            <span className="section-label !text-white/70">Global Community</span>
            <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl mb-4">
              Learn from Farmers <span className="underline decoration-white/30">Worldwide</span>
            </h2>
            <p className="text-white/75 text-base leading-relaxed mb-6">
              A knowledge-sharing community connecting smallholder farmers, agribusinesses, government agencies, and research institutions across the globe.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[['50K+', 'Active Members'], ['32', 'Countries'], ['12K+', 'Discussions'], ['8', 'Languages']].map(([val, lbl]) => (
                <div key={lbl} className="bg-white/12 border border-white/20 rounded-xl p-4 backdrop-blur-sm">
                  <div className="font-display text-2xl font-extrabold text-white">{val}</div>
                  <div className="text-white/65 text-xs mt-0.5">{lbl}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/community"><Button variant="white">Join Community</Button></Link>
              <Button variant="ghost">Learn More</Button>
            </div>
          </div>
          <div className="flex flex-col gap-3" data-reveal>
            {posts.map((post) => (
              <div key={post.name} className="bg-white/10 border border-white/15 rounded-xl p-4 backdrop-blur-sm hover:bg-white/18 transition-colors">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-base">{post.emoji}</div>
                  <div>
                    <div className="text-sm font-semibold text-white/90">{post.name}</div>
                    <div className="text-[11px] text-white/50">{post.country}</div>
                  </div>
                </div>
                <p className="text-white/75 text-sm leading-relaxed mb-2.5">{post.text}</p>
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-[11px] font-semibold bg-white/15 text-white/80 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Analytics ────────────────────────────────────────────────────────────────
const aCards = [
  { icon: '🦠', value: '2.4M', change: '↑ 18% this month', label: 'Disease Scans Processed' },
  { icon: '🌾', value: '847K', change: '↑ 24% this quarter', label: 'Crops Monitored' },
  { icon: '📈', value: '$12M', change: '↑ 31% YoY growth', label: 'Farmer Revenue Generated' },
  { icon: '⚡', value: '1.8s', change: 'Average diagnosis time', label: 'AI Response Speed' },
]

export function AnalyticsSection() {
  return (
    <section id="analytics" className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14" data-reveal>
          <span className="section-label">Analytics & Insights</span>
          <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl mb-4">
            Agricultural Intelligence <span className="text-green-400">at Scale</span>
          </h2>
          <p className="text-white/55 text-lg max-w-2xl mx-auto">
            Real-time crop trends, disease monitoring, market intelligence, and research-grade datasets for government agencies, NGOs, and agricultural institutions.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {aCards.map((card, i) => (
            <div
              key={card.label}
              data-reveal
              className="bg-white/5 border border-white/8 rounded-2xl p-6 hover:bg-green-500/8 hover:border-green-500/20 hover:-translate-y-1 transition-all duration-300"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="text-3xl mb-3">{card.icon}</div>
              <div className="font-display text-3xl font-extrabold text-white mb-1">{card.value}</div>
              <div className="text-green-400 text-xs font-semibold mb-1">{card.change}</div>
              <div className="text-white/45 text-xs">{card.label}</div>
            </div>
          ))}
        </div>
        {/* FAO Banner */}
        <div data-reveal className="bg-green-500/8 border border-green-500/20 rounded-2xl p-7 flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="text-5xl flex-shrink-0">🌐</div>
          <div className="flex-1">
            <h3 className="text-white font-extrabold text-lg font-display mb-2">Data Partnership Program for Research & Government</h3>
            <p className="text-white/55 text-sm leading-relaxed max-w-2xl">
              PlantSmart AI provides anonymised, research-grade agricultural datasets to FAO, CGIAR, World Bank, and national ministries of agriculture. Understand crop challenges, disease outbreaks, and farmer experiences at scale — and generate institutional revenue through our data licensing program.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Button variant="primary" size="sm">Request Data Access</Button>
            <Button variant="ghost" size="sm">Partnership Deck</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Pricing ─────────────────────────────────────────────────────────────────
const plans = [
  {
    tier: 'Smallholder', price: 'Free', period: '/month', desc: 'Perfect for small farms and individual farmers getting started with AI-powered agriculture.',
    features: ['10 AI disease scans/month', 'Plant identification unlimited', 'Basic crop tracking (3 fields)', 'Community forum access', 'Marketplace browsing'],
    cta: 'Get Started Free', popular: false,
  },
  {
    tier: 'Farmer Pro', price: '₦4,999', period: '/month', desc: 'For serious farmers ready to scale their operations and access premium markets.',
    features: ['Unlimited AI disease scans', 'Smart crop planning & AI calendar', '20 field tracking slots', 'Expert consultation (2/month)', 'Marketplace selling access', 'Buyer connection service', 'Priority support'],
    cta: 'Start Free Trial →', popular: true,
  },
  {
    tier: 'Enterprise', price: 'Custom', period: '', desc: 'For agribusinesses, cooperatives, NGOs, government agencies, and research institutions.',
    features: ['Everything in Pro', 'Unlimited fields & users', 'API & data export access', 'White-label option', 'Dedicated account manager', 'FAO-grade data reports', 'SLA & compliance support'],
    cta: 'Contact Sales →', popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14" data-reveal>
          <span className="section-label">Pricing</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-4">
            Simple, Transparent <span className="text-green-500">Pricing</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Choose the plan that fits your farm size. No hidden fees. Cancel anytime.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={plan.tier}
              data-reveal
              className={`relative border-2 rounded-2xl p-7 transition-all duration-300 ${plan.popular ? 'border-green-500 scale-[1.02]' : 'border-gray-200 hover:border-green-500 hover:-translate-y-1 hover:shadow-green'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-4 py-1.5 rounded-b-xl">Most Popular</div>
              )}
              <div className="text-xs font-bold text-green-500 tracking-widest uppercase mb-3">{plan.tier}</div>
              <div className="font-display text-4xl font-extrabold text-gray-900 mb-0.5">{plan.price}<span className="text-base text-gray-400 font-medium">{plan.period}</span></div>
              <p className="text-gray-500 text-sm mt-3 mb-5">{plan.desc}</p>
              <div className="h-px bg-gray-200 mb-5" />
              <ul className="space-y-2.5 mb-7 list-none">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <span className="text-green-500 font-bold mt-px flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/register">
                <Button variant={plan.popular ? 'primary' : 'outline'} fullWidth>{plan.cta}</Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────
export function ContactSection() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => { setLoading(false); setSent(true) }, 1500)
  }

  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left */}
          <div data-reveal>
            <span className="section-label">Contact Us</span>
            <h2 className="text-3xl sm:text-4xl mb-4">
              Have Questions or Need <span className="text-green-500">Custom AI Solutions?</span>
            </h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Whether you're a farmer, agribusiness, NGO, or government agency — we'd love to hear from you. Our team responds within 24 hours.
            </p>

            {/* Email box */}
            <a
              href="mailto:ecoalliancegreensolutions@gmail.com"
              className="flex items-center gap-4 bg-white border-2 border-green-500 rounded-2xl px-6 py-4 mb-6 shadow-green hover:shadow-green-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-500 transition-colors">
                <Mail size={20} className="text-green-500 group-hover:text-white transition-colors" />
              </div>
              <div>
                <div className="text-xs text-gray-400 font-medium mb-0.5">Email us directly</div>
                <div className="font-bold text-gray-900 text-sm">ecoalliancegreensolutions@gmail.com</div>
              </div>
            </a>

            <div className="flex flex-col gap-4">
              {[
                { icon: Phone, label: 'Support Line', value: '+234 800 PLANTSMART' },
                { icon: MapPin, label: 'Headquarters', value: 'Lagos, Nigeria · Serving 32 countries' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-green-500" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">{label}</div>
                    <div className="font-semibold text-gray-800 text-sm">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div data-reveal className="bg-white rounded-2xl p-7 sm:p-8 shadow-lg border border-gray-100">
            <h3 className="font-extrabold text-gray-900 text-lg font-display mb-6">Send Us a Message</h3>
            {sent ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✅</div>
                <h4 className="font-extrabold text-gray-900 font-display mb-2">Message Sent!</h4>
                <p className="text-gray-500 text-sm">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">First Name</label>
                    <input required placeholder="Amara" className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-3 text-sm font-sans text-gray-800 focus:outline-none focus:border-green-500 focus:ring-3 focus:ring-green-500/12 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last Name</label>
                    <input required placeholder="Osei" className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-3 text-sm font-sans text-gray-800 focus:outline-none focus:border-green-500 focus:ring-3 focus:ring-green-500/12 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <input required type="email" placeholder="you@example.com" className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-3 text-sm font-sans text-gray-800 focus:outline-none focus:border-green-500 focus:ring-3 focus:ring-green-500/12 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">I'm interested in</label>
                  <select className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-3 text-sm font-sans text-gray-800 focus:outline-none focus:border-green-500 transition-all bg-white">
                    <option>Farm AI Solutions</option>
                    <option>Expert Consultation Booking</option>
                    <option>Marketplace Partnership</option>
                    <option>Data / Research Partnership (FAO, NGO)</option>
                    <option>Government / Institutional Licensing</option>
                    <option>Enterprise Custom Solution</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
                  <textarea required rows={4} placeholder="Tell us about your farming operation, research goals, or how we can help..." className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-3 text-sm font-sans text-gray-800 focus:outline-none focus:border-green-500 focus:ring-3 focus:ring-green-500/12 transition-all resize-none" />
                </div>
                <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message →'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
