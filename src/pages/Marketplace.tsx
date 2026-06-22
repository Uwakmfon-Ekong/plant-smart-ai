import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, Plus, MapPin, ShoppingCart, X,
  Package, Sprout, FlaskConical, AlertCircle,
  Loader2, Upload, Image as ImageIcon, Bookmark,
  BookmarkCheck, MessageCircle, Mail, Phone,
  CheckCircle
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

type Category = 'all' | 'seedling' | 'input' | 'produce'

interface Listing {
  id: string
  seller_id: string
  title: string
  description: string
  category: string
  price: number
  currency: string
  quantity: number
  unit: string
  location: string | null
  image_url: string | null
  whatsapp: string | null
  contact_email: string | null
  is_active: boolean
  created_at: string
  profiles?: { full_name: string | null; phone?: string | null }
}

const categoryIcon = (cat: string) => {
  if (cat === 'seedling') return <Sprout size={28} className="text-green-500" />
  if (cat === 'input') return <FlaskConical size={28} className="text-blue-500" />
  return <Package size={28} className="text-orange-500" />
}

const categoryColors: Record<string, string> = {
  seedling: 'bg-green-100 text-green-700',
  input: 'bg-blue-100 text-blue-700',
  produce: 'bg-orange-100 text-orange-700',
}

export default function MarketplacePage() {
  const { user } = useAuth()
  const [listings, setListings] = useState<Listing[]>([])
  const [filtered, setFiltered] = useState<Listing[]>([])
  const [category, setCategory] = useState<Category>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showSellModal, setShowSellModal] = useState(false)
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [savingId, setSavingId] = useState<string | null>(null)

  useEffect(() => { fetchListings() }, [])
  useEffect(() => { if (user) fetchSaved() }, [user])

  const fetchListings = async () => {
    setLoading(true)
    setError('')
    const { data, error } = await supabase
      .from('marketplace_listings')
      .select('*, profiles(full_name, phone)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    if (error) setError('Failed to load listings. Please refresh.')
    else setListings(data || [])
    setLoading(false)
  }

  const fetchSaved = async () => {
    if (!user) return
    const { data } = await supabase
      .from('saved_listings')
      .select('listing_id')
    setSavedIds(new Set(data?.map(s => s.listing_id) || []))
  }

  const toggleSave = async (e: React.MouseEvent, listingId: string) => {
    e.stopPropagation()
    if (!user) return
    setSavingId(listingId)
    const isSaved = savedIds.has(listingId)
    if (isSaved) {
      await supabase.from('saved_listings')
        .delete()
        .eq('listing_id', listingId)
        .eq('user_id', user.id)
      setSavedIds(prev => { const n = new Set(prev); n.delete(listingId); return n })
    } else {
      await supabase.from('saved_listings')
        .insert({ user_id: user.id, listing_id: listingId })
      setSavedIds(prev => new Set([...prev, listingId]))
    }
    setSavingId(null)
  }

  useEffect(() => {
    let result = listings
    if (category !== 'all') result = result.filter(l => l.category === category)
    if (search) result = result.filter(l =>
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.description.toLowerCase().includes(search.toLowerCase()) ||
      (l.location || '').toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(result)
  }, [category, search, listings])

  const tabs: { key: Category; label: string }[] = [
    { key: 'all', label: 'All Listings' },
    { key: 'seedling', label: 'Seedlings' },
    { key: 'input', label: 'Farm Inputs' },
    { key: 'produce', label: 'Produce' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-[72px]">
        {/* Header */}
        <div className="bg-gray-900 py-14 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-green-400 text-xs font-bold tracking-widest uppercase">
                  Farmer Marketplace
                </span>
                <h1 className="text-white text-3xl sm:text-4xl font-extrabold font-display mt-1 mb-2">
                  Buy, Sell & Connect
                </h1>
                <p className="text-white/55 text-sm max-w-md">
                  Direct farm-to-buyer marketplace. No middlemen. Better prices for everyone.
                </p>
              </div>
              {user ? (
                <Button variant="primary" size="lg" onClick={() => setShowSellModal(true)}>
                  <Plus size={16} /> List Your Product
                </Button>
              ) : (
                <Link to="/register">
                  <Button variant="primary" size="lg">
                    <Plus size={16} /> Sign Up to Sell
                  </Button>
                </Link>
              )}
            </div>
            <div className="mt-8 relative max-w-2xl">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search seedlings, fertilizers, produce, location..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-lg"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setCategory(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  category === tab.key
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-green-500 hover:text-green-500'
                }`}>
                {tab.label}
                <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${
                  category === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {tab.key === 'all'
                    ? listings.length
                    : listings.filter(l => l.category === tab.key).length}
                </span>
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 size={32} className="text-green-500 animate-spin" />
              <p className="text-gray-400 text-sm">Loading listings...</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-5 text-red-600 text-sm">
              <AlertCircle size={18} className="flex-shrink-0" /> {error}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-24">
              <Package size={48} className="text-gray-200 mx-auto mb-4" />
              <h3 className="font-extrabold text-gray-900 font-display text-xl mb-2">
                {listings.length === 0 ? 'No listings yet' : 'No results found'}
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                {listings.length === 0
                  ? 'Be the first to list a product on the marketplace'
                  : 'Try a different search term or category'}
              </p>
              {user && listings.length === 0 && (
                <Button variant="primary" onClick={() => setShowSellModal(true)}>
                  <Plus size={15} /> List First Product
                </Button>
              )}
            </div>
          )}

          {/* Grid */}
          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map(listing => (
                <div
                  key={listing.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedListing(listing)}>
                  {/* Image */}
                  <div className="h-44 bg-gray-50 flex items-center justify-center relative border-b border-gray-100 overflow-hidden">
                    {listing.image_url ? (
                      <img
                        src={listing.image_url}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      categoryIcon(listing.category)
                    )}
                    <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${categoryColors[listing.category]}`}>
                      {listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}
                    </span>
                    {/* Save button */}
                    {user && (
                      <button
                        onClick={e => toggleSave(e, listing.id)}
                        className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                        title={savedIds.has(listing.id) ? 'Remove from saved' : 'Save listing'}>
                        {savingId === listing.id ? (
                          <Loader2 size={14} className="text-green-500 animate-spin" />
                        ) : savedIds.has(listing.id) ? (
                          <BookmarkCheck size={15} className="text-green-500" />
                        ) : (
                          <Bookmark size={15} className="text-gray-400" />
                        )}
                      </button>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1 group-hover:text-green-600 transition-colors line-clamp-2">
                      {listing.title}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">
                      {listing.description}
                    </p>
                    {listing.location && (
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
                        <MapPin size={11} />
                        <span>{listing.location}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-extrabold text-green-600 text-base font-display">
                          ₦{listing.price.toLocaleString()}
                        </div>
                        <div className="text-gray-400 text-[10px]">per {listing.unit}</div>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); setSelectedListing(listing) }}
                        className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1">
                        <ShoppingCart size={11} /> View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          isSaved={savedIds.has(selectedListing.id)}
          onSave={e => toggleSave(e, selectedListing.id)}
          onClose={() => setSelectedListing(null)}
        />
      )}

      {showSellModal && (
        <SellModal
          onClose={() => setShowSellModal(false)}
          onSuccess={() => { setShowSellModal(false); fetchListings() }}
        />
      )}

      <Footer />
    </div>
  )
}

function ListingDetailModal({
  listing, isSaved, onSave, onClose
}: {
  listing: Listing
  isSaved: boolean
  onSave: (e: React.MouseEvent) => void
  onClose: () => void
}) {
  const { user } = useAuth()
  const [contacted, setContacted] = useState(false)

  const handleWhatsApp = () => {
    const number = listing.whatsapp || listing.profiles?.phone
    if (!number) return
    const msg = encodeURIComponent(
      `Hi! I saw your listing on PlantSmart AI Marketplace.\n\n*${listing.title}*\nPrice: ₦${listing.price.toLocaleString()} per ${listing.unit}\n\nI am interested in buying. Are you available to discuss?`
    )
    window.open(`https://wa.me/${number.replace(/\D/g, '')}?text=${msg}`, '_blank')
    setContacted(true)
  }

  const handleEmail = () => {
    const email = listing.contact_email
    if (!email) return
    const subject = encodeURIComponent(`Interested in: ${listing.title} — PlantSmart AI`)
    const body = encodeURIComponent(
      `Hello,\n\nI found your listing on PlantSmart AI Marketplace and I am interested in purchasing:\n\n${listing.title}\nPrice: ₦${listing.price.toLocaleString()} per ${listing.unit}\nQuantity available: ${listing.quantity} ${listing.unit}\n\nPlease let me know if this is still available and how we can proceed.\n\nThank you.`
    )
    window.open(`mailto:${email}?subject=${subject}&body=${body}`)
    setContacted(true)
  }

  const hasWhatsApp = !!(listing.whatsapp || listing.profiles?.phone)
  const hasEmail = !!listing.contact_email

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center"
      onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl sm:rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>

        {/* Image */}
        <div className="h-56 bg-gray-50 flex items-center justify-center relative rounded-t-3xl sm:rounded-t-2xl overflow-hidden">
          {listing.image_url ? (
            <img
              src={listing.image_url}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="scale-150">{categoryIcon(listing.category)}</div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100">
            <X size={16} />
          </button>
          {user && (
            <button
              onClick={onSave}
              className="absolute top-4 left-4 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100">
              {isSaved
                ? <BookmarkCheck size={16} className="text-green-500" />
                : <Bookmark size={16} className="text-gray-500" />
              }
            </button>
          )}
        </div>

        <div className="p-6">
          {/* Category + title */}
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryColors[listing.category]}`}>
            {listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}
          </span>
          <h2 className="font-extrabold text-gray-900 text-xl font-display mt-3 mb-1">
            {listing.title}
          </h2>
          {listing.location && (
            <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
              <MapPin size={12} /> {listing.location}
            </div>
          )}
          <p className="text-gray-500 text-sm leading-relaxed mb-5">
            {listing.description}
          </p>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { label: 'Price', value: `₦${listing.price.toLocaleString()} / ${listing.unit}` },
              { label: 'Available', value: `${listing.quantity} ${listing.unit}` },
              { label: 'Location', value: listing.location || 'Nigeria' },
              { label: 'Seller', value: listing.profiles?.full_name || 'Verified Farmer' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <div className="text-xs text-gray-400 font-medium">{label}</div>
                <div className="font-semibold text-gray-800 text-sm mt-0.5">{value}</div>
              </div>
            ))}
          </div>

          {/* Contact seller */}
          {contacted && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-green-700 text-sm font-semibold">
              <CheckCircle size={16} /> Message sent! The seller will respond shortly.
            </div>
          )}

          {user ? (
            <div className="space-y-2">
              {hasWhatsApp && (
                <button
                  onClick={handleWhatsApp}
                  className="w-full flex items-center justify-center gap-2.5 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-xl transition-colors text-sm">
                  <MessageCircle size={18} />
                  Contact Seller on WhatsApp
                </button>
              )}
              {hasEmail && (
                <button
                  onClick={handleEmail}
                  className="w-full flex items-center justify-center gap-2.5 bg-white hover:bg-gray-50 text-gray-800 font-bold py-3.5 rounded-xl transition-colors text-sm border-2 border-gray-200 hover:border-green-500">
                  <Mail size={18} />
                  Send Email to Seller
                </button>
              )}
              {!hasWhatsApp && !hasEmail && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                  <p className="text-gray-500 text-sm mb-1 font-medium">Contact details not provided</p>
                  <p className="text-gray-400 text-xs">
                    Post in the{' '}
                    <Link to="/community" className="text-green-500 font-semibold" onClick={onClose}>
                      Community Forum
                    </Link>{' '}
                    to reach this seller
                  </p>
                </div>
              )}
              <button
                onClick={onSave}
                className={`w-full flex items-center justify-center gap-2.5 font-semibold py-3 rounded-xl transition-all text-sm border-2 ${
                  isSaved
                    ? 'border-green-500 text-green-600 bg-green-50'
                    : 'border-gray-200 text-gray-600 hover:border-green-500 hover:text-green-600'
                }`}>
                {isSaved
                  ? <><BookmarkCheck size={16} /> Saved to your list</>
                  : <><Bookmark size={16} /> Save this listing</>
                }
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-center">
              <p className="text-gray-500 text-sm mb-3">
                Sign in to contact the seller and save listings
              </p>
              <Link to="/register" onClick={onClose}>
                <Button variant="primary" fullWidth>Create Free Account →</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SellModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [form, setForm] = useState({
    title: '', description: '', category: 'seedling',
    price: '', quantity: '', unit: 'trays',
    location: '', whatsapp: '', contact_email: ''
  })
  const fileRef = useRef<HTMLInputElement>(null)
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleImage = (file: File) => {
    if (!file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB'); return }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile || !user) return null
    const ext = imageFile.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from('marketplace-images')
      .upload(fileName, imageFile, { upsert: false })
    if (error) return null
    const { data: { publicUrl } } = supabase.storage
      .from('marketplace-images')
      .getPublicUrl(fileName)
    return publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    setError('')
    const imageUrl = await uploadImage()
    const { error } = await supabase.from('marketplace_listings').insert({
      seller_id: user.id,
      title: form.title,
      description: form.description,
      category: form.category as 'seedling' | 'input' | 'produce',
      price: Number(form.price),
      quantity: Number(form.quantity),
      unit: form.unit,
      location: form.location,
      currency: 'NGN',
      is_active: true,
      image_url: imageUrl,
      whatsapp: form.whatsapp || null,
      contact_email: form.contact_email || null,
    })
    setLoading(false)
    if (error) setError(error.message)
    else onSuccess()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-extrabold text-gray-900 text-xl font-display">List a Product</h2>
          <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Photo</label>
            <div
              className="relative w-full h-44 rounded-xl border-2 border-dashed border-gray-300 hover:border-green-500 transition-colors cursor-pointer overflow-hidden group"
              onClick={() => fileRef.current?.click()}>
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-sm font-semibold flex items-center gap-2">
                      <Upload size={16} /> Change Photo
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); setImagePreview(null); setImageFile(null) }}
                    className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100">
                    <X size={13} />
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-500 transition-colors">
                    <ImageIcon size={22} className="text-green-500 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-gray-400 text-sm font-medium">Click to upload product photo</p>
                  <p className="text-gray-300 text-xs">JPG, PNG — max 5MB</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={e => e.target.files?.[0] && handleImage(e.target.files[0])} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}
              className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 bg-white">
              <option value="seedling">Seedling</option>
              <option value="input">Farm Input</option>
              <option value="produce">Produce</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Title *</label>
            <input required value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="e.g. Hybrid Tomato Seedlings (Roma F1)"
              className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description *</label>
            <textarea required value={form.description} onChange={e => set('description', e.target.value)}
              rows={3} placeholder="Describe your product quality, variety, growing conditions..."
              className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 resize-none transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (₦) *</label>
              <input required type="number" min="1" value={form.price} onChange={e => set('price', e.target.value)}
                placeholder="2500"
                className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quantity *</label>
              <input required type="number" min="1" value={form.quantity} onChange={e => set('quantity', e.target.value)}
                placeholder="100"
                className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Unit</label>
              <select value={form.unit} onChange={e => set('unit', e.target.value)}
                className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 bg-white">
                {['trays', 'bags', 'kg', 'tonnes', 'packs', 'sets', 'bundles', 'crates'].map(u => (
                  <option key={u}>{u}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
              <input value={form.location} onChange={e => set('location', e.target.value)}
                placeholder="Lagos, Nigeria"
                className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all" />
            </div>
          </div>

          {/* Contact details */}
          <div className="border-t border-gray-100 pt-4">
            <div className="text-sm font-extrabold text-gray-700 mb-1 font-display">
              Contact Details
            </div>
            <p className="text-xs text-gray-400 mb-3">
              Add at least one so buyers can reach you
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  WhatsApp Number
                </label>
                <div className="relative">
                  <MessageCircle size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={form.whatsapp}
                    onChange={e => set('whatsapp', e.target.value)}
                    placeholder="+2348012345678"
                    className="w-full pl-9 pr-4 border-[1.5px] border-gray-200 rounded-xl py-3 text-sm focus:outline-none focus:border-green-500 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Contact Email
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={form.contact_email}
                    onChange={e => set('contact_email', e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-4 border-[1.5px] border-gray-200 rounded-xl py-3 text-sm focus:outline-none focus:border-green-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
            {loading ? 'Publishing...' : 'Publish Listing →'}
          </Button>
        </form>
      </div>
    </div>
  )
}