import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, Star, Clock, Video, X, CheckCircle,
  AlertCircle, Loader2, Calendar, Globe, Award
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

interface Expert {
  id: string
  emoji?: string
  name: string
  role: string
  specialty: string[]
  bio: string
  rating: number
  sessions: number
  rate: number
  available: boolean
  experience: string
  languages: string[]
  country: string
}

// Static expert profiles — swap with DB query once you have expert profiles in Supabase
const EXPERTS: Expert[] = [
  {
    id: '1', name: 'Dr. Amara Osei', role: 'Plant Pathologist',
    specialty: ['Fungal Diseases', 'Bacterial Infections', 'Tomato', 'Pepper'],
    bio: '12 years specialising in fungal and bacterial crop diseases across West Africa. PhD Plant Pathology, University of Ghana. Consults for CABI and CGIAR.',
    rating: 4.9, sessions: 312, rate: 8000, available: true,
    experience: '12 years', languages: ['English', 'Twi', 'French'], country: 'Ghana'
  },
  {
    id: '2', name: 'Samuel Eze, MSc', role: 'Agronomist',
    specialty: ['Maize', 'Cassava', 'Soil Fertility', 'Irrigation'],
    bio: 'Sustainable maize and cassava cultivation specialist. FAO consultant with field experience across 8 African countries. Masters, IITA/University of Ibadan.',
    rating: 4.8, sessions: 547, rate: 6500, available: true,
    experience: '10 years', languages: ['English', 'Yoruba', 'Hausa'], country: 'Nigeria'
  },
  {
    id: '3', name: 'Prof. Ngozi Adeyemi', role: 'Soil Scientist',
    specialty: ['Soil Health', 'Composting', 'Fertilizer Management', 'pH Correction'],
    bio: 'Soil health and fertility management expert. Research lead at IITA. Author of 40+ peer-reviewed agricultural papers. 22 years experience.',
    rating: 5.0, sessions: 218, rate: 12000, available: false,
    experience: '22 years', languages: ['English', 'Yoruba'], country: 'Nigeria'
  },
  {
    id: '4', name: 'Dr. Kofi Mensah', role: 'Crop Economist',
    specialty: ['Market Access', 'Value Chain', 'Export', 'Pricing Strategy'],
    bio: 'Agricultural economist helping farmers access premium markets, negotiate off-take agreements, and structure profitable farming operations.',
    rating: 4.7, sessions: 189, rate: 9000, available: true,
    experience: '15 years', languages: ['English', 'Twi', 'French'], country: 'Ghana'
  },
  {
    id: '5', name: 'Dr. Fatima Bello', role: 'Entomologist',
    specialty: ['Pest Management', 'Fall Armyworm', 'IPM', 'Organic Pest Control'],
    bio: 'Specialist in integrated pest management for smallholder farmers. Expert on fall armyworm control across the Sahel. USAID consultant.',
    rating: 4.9, sessions: 276, rate: 7500, available: true,
    experience: '11 years', languages: ['English', 'Hausa', 'French'], country: 'Nigeria'
  },
  {
    id: '6', name: 'Emmanuel Okafor', role: 'Horticulturist',
    specialty: ['Greenhouse Farming', 'Vegetables', 'Hydroponics', 'Export Quality'],
    bio: 'Expert in commercial vegetable production and greenhouse management. Helps farmers achieve export-grade quality standards for EU and UK markets.',
    rating: 4.6, sessions: 134, rate: 7000, available: true,
    experience: '8 years', languages: ['English', 'Igbo'], country: 'Nigeria'
  },
]

const specialties = [
  'All', 'Disease & Pests', 'Soil & Fertility',
  'Crop Agronomy', 'Market & Economics', 'Irrigation', 'Organic Farming'
]

function ExpertAvatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const sizes = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-base',
    lg: 'w-16 h-16 text-lg',
  }
  return (
    <div className={`${sizes[size]} bg-green-100 rounded-2xl flex items-center justify-center font-bold text-green-700 flex-shrink-0 border border-green-200`}>
      {initials}
    </div>
  )
}

export default function ExpertsPage() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [activeSpec, setActiveSpec] = useState('All')
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null)
  const [bookingExpert, setBookingExpert] = useState<Expert | null>(null)
  const [myBookings, setMyBookings] = useState<any[]>([])

  useEffect(() => {
    if (user) fetchMyBookings()
  }, [user])

  const fetchMyBookings = async () => {
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
    setMyBookings(data || [])
  }

  const filtered = EXPERTS.filter(e => {
    const matchSearch = !search ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()) ||
      e.specialty.some(s => s.toLowerCase().includes(search.toLowerCase()))
    return matchSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-[72px]">
        {/* Header */}
        <div className="bg-gray-900 py-14 px-4">
          <div className="max-w-7xl mx-auto">
            <span className="text-green-400 text-xs font-bold tracking-widest uppercase">
              Expert Network
            </span>
            <h1 className="text-white text-3xl sm:text-4xl font-extrabold font-display mt-1 mb-2">
              Agricultural Experts
            </h1>
            <p className="text-white/55 text-sm max-w-md mb-8">
              Book one-on-one video consultations with certified agronomists,
              soil scientists, and crop research specialists.
            </p>
            <div className="relative max-w-2xl">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, specialty, crop type..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-lg"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Specialty filters */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {specialties.map(spec => (
              <button key={spec} onClick={() => setActiveSpec(spec)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  activeSpec === spec
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-green-500'
                }`}>
                {spec}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { val: '200+', lbl: 'Verified Experts', icon: Award },
              { val: '4.9', lbl: 'Average Rating', icon: Star },
              { val: '10K+', lbl: 'Sessions Completed', icon: Video },
            ].map(({ val, lbl, icon: Icon }) => (
              <div key={lbl} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-green-500" />
                </div>
                <div>
                  <div className="font-display text-xl font-extrabold text-gray-900">{val}</div>
                  <div className="text-gray-400 text-xs">{lbl}</div>
                </div>
              </div>
            ))}
          </div>

          {/* My Bookings */}
          {user && myBookings.length > 0 && (
            <div className="mb-8">
              <h2 className="font-extrabold text-gray-900 font-display text-base mb-4">
                My Upcoming Sessions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myBookings.slice(0, 3).map(b => (
                  <div key={b.id} className="bg-white rounded-2xl border border-gray-200 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center font-bold text-green-700 text-sm">
                        {b.expert_name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{b.expert_name}</div>
                        <div className="text-green-500 text-xs font-medium">{b.expert_role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <Calendar size={12} className="text-green-500" />
                      {new Date(b.session_date).toLocaleDateString('en-NG', {
                        weekday: 'short', month: 'short', day: 'numeric'
                      })} at {b.session_time}
                    </div>
                    <div className="text-xs text-gray-400 line-clamp-2 mt-1">{b.topic}</div>
                    <span className="inline-block mt-2 text-xs font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expert Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(expert => (
              <div key={expert.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-green-200 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <ExpertAvatar name={expert.name} />
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-sm font-display leading-tight">
                        {expert.name}
                      </h3>
                      <div className="text-xs text-green-500 font-bold mt-0.5">{expert.role}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <Globe size={10} /> {expert.country}
                      </div>
                    </div>
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${
                    expert.available ? 'bg-green-400' : 'bg-gray-300'
                  }`} title={expert.available ? 'Available' : 'Unavailable'} />
                </div>

                <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-3">
                  {expert.bio}
                </p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {expert.specialty.slice(0, 3).map(s => (
                    <span key={s}
                      className="text-[10px] font-semibold bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-400 fill-current" />
                    <span className="font-bold text-gray-700">{expert.rating}</span>
                    <span className="text-gray-400">({expert.sessions} sessions)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={11} /> {expert.experience}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="font-extrabold text-gray-900 text-base font-display">
                      ₦{expert.rate.toLocaleString()}
                    </span>
                    <span className="text-gray-400 text-xs"> / session</span>
                  </div>
                  {!expert.available && (
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                      Fully booked
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedExpert(expert)}>
                    View Profile
                  </Button>
                  {expert.available ? (
                    user ? (
                      <Button variant="primary" size="sm" onClick={() => setBookingExpert(expert)}>
                        <Video size={13} /> Book Session
                      </Button>
                    ) : (
                      <Link to="/register" className="flex-1">
                        <Button variant="primary" size="sm" fullWidth>
                          <Video size={13} /> Book
                        </Button>
                      </Link>
                    )
                  ) : (
                    <Button variant="outline" size="sm" disabled>Unavailable</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {selectedExpert && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setSelectedExpert(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-4">
                <ExpertAvatar name={selectedExpert.name} size="lg" />
                <div>
                  <h2 className="font-extrabold text-gray-900 font-display text-lg">
                    {selectedExpert.name}
                  </h2>
                  <div className="text-green-500 font-bold text-sm">{selectedExpert.role}</div>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                    <Globe size={11} /> {selectedExpert.country}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedExpert(null)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                <X size={16} />
              </button>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-5">{selectedExpert.bio}</p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: 'Rating', value: `${selectedExpert.rating} / 5.0 (${selectedExpert.sessions} sessions)` },
                { label: 'Experience', value: selectedExpert.experience },
                { label: 'Session Rate', value: `₦${selectedExpert.rate.toLocaleString()}` },
                { label: 'Languages', value: selectedExpert.languages.join(', ') },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-400">{label}</div>
                  <div className="font-semibold text-gray-800 text-sm mt-0.5">{value}</div>
                </div>
              ))}
            </div>

            <div className="mb-5">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Specialties
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedExpert.specialty.map(s => (
                  <span key={s}
                    className="text-xs font-semibold bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {selectedExpert.available ? (
              <Button variant="primary" size="lg" fullWidth
                onClick={() => {
                  setSelectedExpert(null)
                  setBookingExpert(selectedExpert)
                }}>
                <Video size={16} /> Book a Session →
              </Button>
            ) : (
              <Button variant="outline" size="lg" fullWidth disabled>
                Currently Unavailable
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {bookingExpert && (
        <BookingModal
          expert={bookingExpert}
          onClose={() => setBookingExpert(null)}
          onSuccess={() => { setBookingExpert(null); fetchMyBookings() }}
        />
      )}

      <Footer />
    </div>
  )
}

function BookingModal({
  expert, onClose, onSuccess
}: {
  expert: Expert
  onClose: () => void
  onSuccess: () => void
}) {
  const { user } = useAuth()
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [topic, setTopic] = useState('')

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    setError('')
    const { error } = await supabase.from('bookings').insert({
      farmer_id: user.id,
      expert_name: expert.name,
      expert_role: expert.role,
      session_date: date,
      session_time: time,
      topic,
      rate: expert.rate,
      status: 'confirmed',
    })
    setLoading(false)
    if (error) setError(error.message)
    else setStep('success')
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full p-6"
        onClick={e => e.stopPropagation()}>
        {step === 'success' ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h3 className="font-extrabold text-gray-900 font-display text-xl mb-2">
              Session Booked!
            </h3>
            <p className="text-gray-500 text-sm mb-1">
              Your session with <strong>{expert.name}</strong> is confirmed.
            </p>
            <p className="text-gray-400 text-xs mb-6">
              {new Date(date).toLocaleDateString('en-NG', {
                weekday: 'long', month: 'long', day: 'numeric'
              })} at {time}
            </p>
            <p className="text-gray-400 text-xs mb-6">
              A video call link will be sent to your registered email address.
            </p>
            <Button variant="primary" fullWidth onClick={onSuccess}>Done →</Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-extrabold text-gray-900 font-display text-lg">Book Session</h2>
              <button onClick={onClose}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
                <X size={16} />
              </button>
            </div>

            <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl p-3 mb-5">
              <ExpertAvatar name={expert.name} size="sm" />
              <div>
                <div className="font-bold text-gray-900 text-sm">{expert.name}</div>
                <div className="text-green-500 text-xs font-semibold">
                  {expert.role} · ₦{expert.rate.toLocaleString()} / session
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                <AlertCircle size={15} /> {error}
              </div>
            )}

            <form onSubmit={handleBook} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date *</label>
                  <input
                    required type="date" value={date}
                    onChange={e => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border-[1.5px] border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Time *</label>
                  <select
                    required value={time} onChange={e => setTime(e.target.value)}
                    className="w-full border-[1.5px] border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 bg-white transition-all">
                    <option value="">Select time</option>
                    {['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'].map(t => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  What do you need help with? *
                </label>
                <textarea
                  required value={topic} onChange={e => setTopic(e.target.value)}
                  rows={4}
                  placeholder="Describe your crop issue, what you have already tried, and what outcome you need from this session..."
                  className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 resize-none transition-all"
                />
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500 flex items-start gap-2">
                <Video size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                Session conducted via video call. Link sent to your email within 24 hours of booking.
              </div>
              <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
                {loading ? 'Confirming booking...' : `Confirm Booking · ₦${expert.rate.toLocaleString()}`}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}