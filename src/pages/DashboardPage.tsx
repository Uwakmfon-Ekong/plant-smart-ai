import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ScanLine, Plus, BarChart3, Leaf, ShoppingBag,
  Users, MessageSquare, Settings, LogOut, X, AlertTriangle,
  CheckCircle, Clock, TrendingUp
} from 'lucide-react'
import Logo from '@/components/ui/Logo'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

interface Crop {
  id: string
  name: string
  field_name: string
  status: 'healthy' | 'monitor' | 'alert'
  health_score: number
  planted_date: string | null
  expected_harvest: string | null
  variety: string | null
}

const statusConfig = {
  healthy: { label: 'Healthy', bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
  monitor: { label: 'Monitor', bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
  alert: { label: 'Alert', bg: 'bg-red-100', text: 'text-red-600', icon: AlertTriangle },
}

const navItems = [
  { icon: BarChart3, label: 'Dashboard', href: '/dashboard', active: true },
  { icon: ScanLine, label: 'Scan Plant', href: '/scan' },
  { icon: Leaf, label: 'Analytics', href: '/analytics' },
  { icon: ShoppingBag, label: 'Marketplace', href: '/marketplace' },
  { icon: Users, label: 'Experts', href: '/experts' },
  { icon: MessageSquare, label: 'Community', href: '/community' },
  { icon: Settings, label: 'Settings', href: '#' },
]

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const [crops, setCrops] = useState<Crop[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddCrop, setShowAddCrop] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => { fetchCrops() }, [])

  const fetchCrops = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('crops')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setCrops(data)
    setLoading(false)
  }

  const daysUntil = (date: string | null) => {
    if (!date) return '—'
    const diff = new Date(date).getTime() - Date.now()
    const days = Math.ceil(diff / 86400000)
    return days > 0 ? `${days}d` : 'Ready'
  }

  const healthyCount = crops.filter(c => c.status === 'healthy').length
  const alertCount = crops.filter(c => c.status === 'alert').length
  const avgHealth = crops.length
    ? Math.round(crops.reduce((s, c) => s + c.health_score, 0) / crops.length)
    : 0

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-900 flex flex-col
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-5 border-b border-white/8">
          <Logo variant="white" size="sm" />
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link key={item.label} to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                item.active
                  ? 'bg-green-500 text-white'
                  : 'text-white/55 hover:bg-white/8 hover:text-white'
              }`}>
              <item.icon size={17} /> {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 font-bold text-sm">
              {user?.email?.[0]?.toUpperCase() || 'F'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-xs font-semibold truncate">{user?.email}</div>
              <div className="text-white/40 text-[10px]">Farmer Pro</div>
            </div>
          </div>
          <button onClick={signOut}
            className="w-full flex items-center gap-2 text-white/40 hover:text-white text-xs font-medium px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-4 py-8 sm:px-6  flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600">
              <BarChart3 size={20} />
            </button>
            <div className=''>
              <h1 className="font-extrabold text-gray-900 text-base font-display">Farm Dashboard</h1>
              <p className="text-gray-400 text-xs">Welcome back — here's your farm overview</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/scan">
              <Button variant="primary" size="sm">
                <ScanLine size={14} /> Scan Plant
              </Button>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Avg Health Score', value: crops.length ? `${avgHealth}%` : '—', icon: TrendingUp, color: 'text-green-500' },
              { label: 'Total Crops', value: crops.length.toString(), icon: Leaf, color: 'text-green-500' },
              { label: 'Healthy Fields', value: healthyCount.toString(), icon: CheckCircle, color: 'text-green-500' },
              { label: 'Active Alerts', value: alertCount.toString(), icon: AlertTriangle, color: alertCount > 0 ? 'text-red-500' : 'text-gray-400' },
            ].map(m => (
              <div key={m.label} className="bg-white rounded-2xl p-5 border border-gray-200">
                <m.icon size={20} className={`${m.color} mb-3`} />
                <div className="font-display text-2xl font-extrabold text-gray-900">{m.value}</div>
                <div className="text-gray-400 text-xs mt-1">{m.label}</div>
              </div>
            ))}
          </div>

          {/* Crops table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-extrabold text-gray-900 text-base font-display">My Crops</h2>
              <Button variant="outline" size="sm" onClick={() => setShowAddCrop(true)}>
                <Plus size={14} /> Add Crop
              </Button>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Loading your crops...</p>
              </div>
            ) : crops.length === 0 ? (
              <div className="p-12 text-center">
                <Leaf size={40} className="text-gray-200 mx-auto mb-3" />
                <h3 className="font-bold text-gray-700 mb-1">No crops added yet</h3>
                <p className="text-gray-400 text-sm mb-4">Add your first crop to start tracking field health</p>
                <Button variant="primary" size="sm" onClick={() => setShowAddCrop(true)}>
                  <Plus size={14} /> Add Your First Crop
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['Crop', 'Variety', 'Field', 'Status', 'Health', 'Harvest In', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {crops.map(crop => {
                      const st = statusConfig[crop.status]
                      const Icon = st.icon
                      return (
                        <tr key={crop.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3.5 font-semibold text-gray-900">{crop.name}</td>
                          <td className="px-4 py-3.5 text-gray-500">{crop.variety || '—'}</td>
                          <td className="px-4 py-3.5 text-gray-500">{crop.field_name}</td>
                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${st.bg} ${st.text}`}>
                              <Icon size={10} /> {st.label}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${crop.health_score > 80 ? 'bg-green-500' : crop.health_score > 60 ? 'bg-yellow-400' : 'bg-red-500'}`}
                                  style={{ width: `${crop.health_score}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-gray-700">{crop.health_score}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-gray-600 font-medium">{daysUntil(crop.expected_harvest)}</td>
                          <td className="px-4 py-3.5 flex items-center gap-2">
                            <Link to="/scan">
                              <button className="text-green-500 hover:text-green-600 text-xs font-semibold flex items-center gap-1 transition-colors">
                                <ScanLine size={12} /> Scan
                              </button>
                            </Link>
                            <button
                              onClick={async () => {
                                await supabase.from('crops').delete().eq('id', crop.id)
                                fetchCrops()
                              }}
                              className="text-red-400 hover:text-red-600 text-xs font-semibold flex items-center gap-1 transition-colors ml-2">
                              <X size={12} /> Delete
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {showAddCrop && (
        <AddCropModal onClose={() => setShowAddCrop(false)} onSuccess={() => { setShowAddCrop(false); fetchCrops() }} />
      )}
    </div>
  )
}

function AddCropModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', variety: '', field_name: '',
    planted_date: '', expected_harvest: '',
    status: 'healthy', health_score: 100,
  })
  const set = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    setError('')
    const { error } = await supabase.from('crops').insert({
      user_id: user.id,
      name: form.name,
      variety: form.variety || null,
      field_name: form.field_name,
      planted_date: form.planted_date || null,
      expected_harvest: form.expected_harvest || null,
      status: form.status as 'healthy' | 'monitor' | 'alert',
      health_score: Number(form.health_score),
    })
    setLoading(false)
    if (error) setError(error.message)
    else onSuccess()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-extrabold text-gray-900 font-display text-xl">Add Crop</h2>
          <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
            <X size={16} />
          </button>
        </div>
        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Crop Name *</label>
              <input required value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="e.g. Tomato"
                className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Variety</label>
              <input value={form.variety} onChange={e => set('variety', e.target.value)}
                placeholder="e.g. Roma F1"
                className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Field Name *</label>
            <input required value={form.field_name} onChange={e => set('field_name', e.target.value)}
              placeholder="e.g. Field A-1"
              className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date Planted</label>
              <input type="date" value={form.planted_date} onChange={e => set('planted_date', e.target.value)}
                className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Expected Harvest</label>
              <input type="date" value={form.expected_harvest} onChange={e => set('expected_harvest', e.target.value)}
                className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 transition-all" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}
                className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 bg-white transition-all">
                <option value="healthy">Healthy</option>
                <option value="monitor">Monitor</option>
                <option value="alert">Alert</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Health Score (0-100)</label>
              <input type="number" min="0" max="100" value={form.health_score} onChange={e => set('health_score', e.target.value)}
                className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 transition-all" />
            </div>
          </div>
          <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
            {loading ? 'Saving...' : 'Save Crop →'}
          </Button>
        </form>
      </div>
    </div>
  )
}