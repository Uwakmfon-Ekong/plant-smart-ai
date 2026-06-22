import { Search, Shield, MessageCircle, Calendar, ShoppingBag, Users } from 'lucide-react'

const features = [
  {
    icon: Search,
    title: 'Plant Identification',
    desc: 'Instantly identify any plant species from a photo. Our AI has been trained on over 300,000 plant varieties with 98% accuracy.',
  },
  {
    icon: Shield,
    title: 'Disease Detection',
    desc: 'Photograph your crops and get instant disease diagnosis with specific chemical recommendations, dosages, and treatment timelines.',
  },
  {
    icon: MessageCircle,
    title: 'AI Farming Assistant',
    desc: '24/7 chatbot powered by agricultural domain expertise. Ask about irrigation, fertilization, pest control, and harvest timing.',
  },
  {
    icon: Calendar,
    title: 'Smart Crop Planning',
    desc: 'AI-predicted planting schedules, yield forecasts, and harvest timelines based on your location, soil type, and climate data.',
  },
  {
    icon: ShoppingBag,
    title: 'Farmer Marketplace',
    desc: 'Buy quality seedlings and farm inputs, sell produce directly to vetted buyers. Cut out the middleman and maximise profit.',
  },
  {
    icon: Users,
    title: 'Expert Consultation',
    desc: 'Book one-on-one sessions with certified agronomists, agricultural consultants, and research experts from top institutions.',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14" data-reveal>
          <span className="section-label">Platform Features</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-4">
            Everything You Need to Farm <span className="text-green-500">Intelligently</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            A complete agricultural intelligence platform — from field diagnosis to market access, built for farmers at every scale.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              data-reveal
              className="group bg-white border-[1.5px] border-gray-200 rounded-2xl p-7 hover:border-green-500 hover:-translate-y-1 hover:shadow-green transition-all duration-300 cursor-default relative overflow-hidden"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-12 h-12 bg-green-100 rounded-[14px] flex items-center justify-center mb-5 group-hover:bg-green-500 transition-colors duration-300">
                  <f.icon size={22} className="text-green-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-base font-extrabold text-gray-900 mb-2 font-display">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
