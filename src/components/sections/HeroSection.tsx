import { Link } from 'react-router-dom'
import { ScanLine, ArrowRight, Zap } from 'lucide-react'
import Button from '@/components/ui/Button'
import Logo from '@/components/ui/Logo'

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center relative overflow-hidden bg-gray-900 pt-[72px]">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f0a] via-gray-900 to-[#0d2818]" />
      <div className="absolute inset-0 dot-grid opacity-[0.06]" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-500/6 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-16 lg:py-24">
          {/* Left */}
          <div>
                      

            <h1 className="text-white mb-6 text-4xl sm:text-5xl lg:text-[4rem] xl:text-[4.5rem]">
              AI-Powered Agriculture for{' '}
              <span className="text-green-400">Smarter Farming</span>
            </h1>

            <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-8 max-w-[52ch]">
              Identify plants, detect diseases instantly, connect to premium markets, and get expert agronomist guidance — all in one intelligent platform built for the modern farmer.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <Link to="/scan">
                <Button variant="primary" size="lg">
                  <ScanLine size={18} />
                  Scan a Plant
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="white" size="lg">
                  Get Started Free <ArrowRight size={16} />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-white/8">
              {[
                { value: '50K+', label: 'Active Farmers' },
                { value: '98%', label: 'AI Accuracy' },
                { value: '200+', label: 'Crop Varieties' },
                { value: '32', label: 'Countries' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-2xl font-extrabold text-white">{stat.value}</div>
                  <div className="text-xs text-white/45 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Phone Mockup */}
          <div className="hidden lg:flex justify-center items-center relative">
            <div className="float-animation w-[270px] h-[540px] bg-white/5 border border-white/12 rounded-[40px] relative overflow-hidden shadow-2xl backdrop-blur-xl">
              <div className="absolute inset-[10px] rounded-[32px] bg-gradient-to-b from-[#0d2d12] to-[#1a3a1f] overflow-hidden flex flex-col p-5">
                {/* Phone logo */}
                <div className="flex justify-center mb-4">
                  <Logo variant="white" size="sm" />
                </div>

                {/* Scan area */}
                <div className="flex-1 relative bg-black/30 rounded-2xl border-2 border-dashed border-green-500/30 flex items-center justify-center overflow-hidden">
                  <span className="absolute top-3 left-1/2 -translate-x-1/2 text-green-400 text-[10px] font-bold tracking-widest whitespace-nowrap">
                    POINT CAMERA AT PLANT
                  </span>
                  {/* Corners */}
                  {['top-2 left-2 border-t-2 border-l-2', 'top-2 right-2 border-t-2 border-r-2', 'bottom-2 left-2 border-b-2 border-l-2', 'bottom-2 right-2 border-b-2 border-r-2'].map((cls, i) => (
                    <span key={i} className={`absolute w-4 h-4 border-green-400 ${cls}`} />
                  ))}
                  {/* Scan line */}
                  <div className="scan-line absolute left-3 right-3 h-[2px] bg-gradient-to-r from-transparent via-green-400 to-transparent" />
                  <span className="text-5xl">🌿</span>
                </div>

                {/* Result */}
                <div className="mt-3 bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                  <div className="text-[9px] text-green-400 font-bold tracking-widest mb-1">AI DIAGNOSIS</div>
                  <div className="text-white text-sm font-bold">Tomato Late Blight</div>
                  <div className="text-white/50 text-[10px] mb-2">Phytophthora infestans · Treat in 48h</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="fill-bar h-full bg-green-400 rounded-full" />
                    </div>
                    <span className="text-green-400 text-[10px] font-bold">92%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute left-[-50px] top-[22%] bg-white rounded-xl p-3 shadow-xl flex items-center gap-2.5" style={{ animation: 'float 5s ease-in-out infinite' }}>
              <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0">🌱</div>
              <div>
                <div className="text-xs font-bold text-gray-800">Copper Fungicide</div>
                <div className="text-[10px] text-gray-400">Recommended treatment</div>
              </div>
            </div>

            <div className="absolute right-[-40px] bottom-[28%] bg-white rounded-xl p-3 shadow-xl flex items-center gap-2.5" style={{ animation: 'float 4s 1s ease-in-out infinite' }}>
              <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap size={16} className="text-green-600" />
              </div>
              <div>
                <div className="text-xs font-bold text-gray-800">Crop Health: 87%</div>
                <div className="text-[10px] text-gray-400">Maize · Field A-3</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
