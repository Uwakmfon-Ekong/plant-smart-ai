import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart3, TrendingUp, Leaf, ShoppingBag,
  Users, MessageSquare, LogOut, Download,
  LayoutDashboard, ScanLine, Globe, Bug,
  AlertCircle, Loader2
} from 'lucide-react'
import Logo from '@/components/ui/Logo'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

interface Stats {
  totalScans: number
  totalCrops: number
  totalListings: number
  totalPosts: number
  healthyCrops: number
  alertCrops: number
  avgHealthScore: number
  recentScans: {
    disease_name: string | null
    severity: string | null
    created_at: string
  }[]
  recentCrops: {
    name: string
    field_name: string
    status: string
    health_score: number
  }[]
  diseaseBreakdown: Record<string, number>
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: ScanLine, label: 'Scan Plant', href: '/scan' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics', active: true },
  { icon: ShoppingBag, label: 'Marketplace', href: '/marketplace' },
  { icon: Users, label: 'Experts', href: '/experts' },
  { icon: MessageSquare, label: 'Community', href: '/community' },
]

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color = 'text-green-500',
}: {
  label: string
  value: string | number
  sub?: string
  icon: any
  color?: string
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-green-50`}>
        <Icon size={20} className={color} />
      </div>
      <div className="font-display text-2xl font-extrabold text-gray-900">{value}</div>
      {sub && <div className="text-xs text-green-500 font-semibold mt-0.5">{sub}</div>}
      <div className="text-gray-400 text-xs mt-1">{label}</div>
    </div>
  )
}

function BarChart({
  data,
  color = 'bg-green-500',
  labels,
}: {
  data: number[]
  color?: string
  labels: string[]
}) {
  const max = Math.max(...data, 1)
  return (
    <div className="flex items-end gap-1.5 h-24">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className={`w-full ${color} rounded-t-md hover:opacity-80 transition-opacity cursor-default`}
            style={{ height: `${(v / max) * 100}%`, minHeight: v > 0 ? '4px' : '0' }}
            title={`${labels[i]}: ${v}`}
          />
          <span className="text-[9px] text-gray-400 truncate w-full text-center">
            {labels[i]}
          </span>
        </div>
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, string> = {
    healthy: 'bg-green-100 text-green-700',
    monitor: 'bg-yellow-100 text-yellow-700',
    alert: 'bg-red-100 text-red-600',
  }
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${config[status] || 'bg-gray-100 text-gray-600'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

export default function AnalyticsPage() {
  const { user, signOut } = useAuth()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [period, setPeriod] = useState('all')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    setError('')

    try {
      // Run all queries in parallel
      const [
        scansRes,
        cropsRes,
        listingsRes,
        postsRes,
        recentScansRes,
        recentCropsRes,
      ] = await Promise.all([
        supabase.from('scans').select('id', { count: 'exact', head: true }),
        supabase.from('crops').select('id, status, health_score', { count: 'exact' }),
        supabase.from('marketplace_listings').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('community_posts').select('id', { count: 'exact', head: true }),
        supabase.from('scans').select('disease_name, severity, created_at').order('created_at', { ascending: false }).limit(10),
        supabase.from('crops').select('name, field_name, status, health_score').order('created_at', { ascending: false }).limit(5),
      ])

      const crops = cropsRes.data || []
      const healthyCrops = crops.filter(c => c.status === 'healthy').length
      const alertCrops = crops.filter(c => c.status === 'alert').length
      const avgHealthScore = crops.length
        ? Math.round(crops.reduce((s, c) => s + (c.health_score || 0), 0) / crops.length)
        : 0

      // Build disease breakdown from recent scans
      const diseaseBreakdown: Record<string, number> = {}
      const recentScans = recentScansRes.data || []
      recentScans.forEach(scan => {
        if (scan.disease_name && scan.disease_name !== 'Healthy' && scan.disease_name !== 'Manual Review Required') {
          diseaseBreakdown[scan.disease_name] = (diseaseBreakdown[scan.disease_name] || 0) + 1
        }
      })

      setStats({
        totalScans: scansRes.count || 0,
        totalCrops: cropsRes.count || 0,
        totalListings: listingsRes.count || 0,
        totalPosts: postsRes.count || 0,
        healthyCrops,
        alertCrops,
        avgHealthScore,
        recentScans,
        recentCrops: recentCropsRes.data || [],
        diseaseBreakdown,
      })
    } catch (err: any) {
      setError('Failed to load analytics. Please refresh.')
    } finally {
      setLoading(false)
    }
  }

  // Build weekly scan chart from recent scans
  const weeklyScans = (() => {
    if (!stats) return { data: [0, 0, 0, 0, 0, 0, 0], labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const counts = new Array(7).fill(0)
    stats.recentScans.forEach(scan => {
      const day = new Date(scan.created_at).getDay()
      counts[day]++
    })
    // Reorder to start from Monday
    const reordered = [...counts.slice(1), counts[0]]
    return { data: reordered, labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }
  })()

  const topDiseases = Object.entries(stats?.diseaseBreakdown || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  const totalDiseaseCount = topDiseases.reduce((s, [, v]) => s + v, 0) || 1

  const severityColors: Record<string, string> = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500',
  }

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
            <Link
              key={item.label}
              to={item.href}
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
          <button
            onClick={signOut}
            className="w-full flex items-center gap-2 text-white/40 hover:text-white text-xs font-medium px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600">
              <BarChart3 size={20} />
            </button>
            <div>
              <h1 className="font-extrabold text-gray-900 text-base font-display">
                Analytics
              </h1>
              <p className="text-gray-400 text-xs">
                Live data from your farm and platform
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex gap-1 bg-gray-100 rounded-xl p-1">
              {['all', '30d', '7d'].map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    period === p
                      ? 'bg-white shadow text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  {p === 'all' ? 'All time' : p}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={fetchStats}>
              <Download size={14} /> Refresh
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm">
              <AlertCircle size={18} className="flex-shrink-0" /> {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 size={32} className="text-green-500 animate-spin" />
              <p className="text-gray-400 text-sm">Loading your real data...</p>
            </div>
          )}

          {!loading && stats && (
            <>
              {/* KPI cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Total Scans"
                  value={stats.totalScans}
                  sub={stats.totalScans > 0 ? 'All time' : 'No scans yet'}
                  icon={ScanLine}
                />
                <StatCard
                  label="Active Crops"
                  value={stats.totalCrops}
                  sub={stats.totalCrops > 0 ? `${stats.healthyCrops} healthy` : 'No crops yet'}
                  icon={Leaf}
                />
                <StatCard
                  label="Marketplace Listings"
                  value={stats.totalListings}
                  sub={stats.totalListings > 0 ? 'Active listings' : 'No listings yet'}
                  icon={ShoppingBag}
                />
                <StatCard
                  label="Community Posts"
                  value={stats.totalPosts}
                  sub={stats.totalPosts > 0 ? 'Discussions' : 'No posts yet'}
                  icon={MessageSquare}
                />
              </div>

              {/* Crop health overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <h3 className="font-extrabold text-gray-900 font-display text-sm mb-4">
                    Crop Health Overview
                  </h3>
                  {stats.totalCrops === 0 ? (
                    <div className="text-center py-8">
                      <Leaf size={32} className="text-gray-200 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No crops added yet</p>
                      <Link to="/dashboard" className="text-green-500 text-xs font-semibold hover:text-green-600 mt-1 block">
                        Add crops in Dashboard →
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-center mb-4">
                        <div className="relative w-28 h-28">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                            <circle
                              cx="18" cy="18" r="15.9" fill="none"
                              stroke="#22c55e" strokeWidth="3"
                              strokeDasharray={`${stats.avgHealthScore} ${100 - stats.avgHealthScore}`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="font-display text-2xl font-extrabold text-gray-900">
                              {stats.avgHealthScore}%
                            </span>
                            <span className="text-xs text-gray-400">avg health</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {[
                          { label: 'Healthy', count: stats.healthyCrops, color: 'bg-green-500' },
                          { label: 'Monitor', count: stats.totalCrops - stats.healthyCrops - stats.alertCrops, color: 'bg-yellow-400' },
                          { label: 'Alert', count: stats.alertCrops, color: 'bg-red-500' },
                        ].map(({ label, count, color }) => (
                          <div key={label} className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${color} flex-shrink-0`} />
                            <span className="text-xs text-gray-600 flex-1">{label}</span>
                            <span className="text-xs font-bold text-gray-900">{count}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Weekly scan activity */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-extrabold text-gray-900 font-display text-sm">
                        Scan Activity
                      </h3>
                      <p className="text-gray-400 text-xs">This week by day</p>
                    </div>
                    <TrendingUp size={16} className="text-green-500" />
                  </div>
                  {stats.totalScans === 0 ? (
                    <div className="text-center py-8">
                      <ScanLine size={32} className="text-gray-200 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No scans yet</p>
                      <Link to="/scan" className="text-green-500 text-xs font-semibold hover:text-green-600 mt-1 block">
                        Scan your first plant →
                      </Link>
                    </div>
                  ) : (
                    <BarChart data={weeklyScans.data} labels={weeklyScans.labels} />
                  )}
                </div>

                {/* Disease breakdown */}
                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-extrabold text-gray-900 font-display text-sm">
                        Disease Detections
                      </h3>
                      <p className="text-gray-400 text-xs">From your scans</p>
                    </div>
                    <Bug size={16} className="text-red-400" />
                  </div>
                  {topDiseases.length === 0 ? (
                    <div className="text-center py-8">
                      <Bug size={32} className="text-gray-200 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No diseases detected yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {topDiseases.map(([name, count]) => (
                        <div key={name}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-700 font-medium truncate flex-1 mr-2">
                              {name}
                            </span>
                            <span className="text-xs font-bold text-gray-600 flex-shrink-0">
                              {count}
                            </span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-red-400 rounded-full"
                              style={{ width: `${(count / totalDiseaseCount) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Recent scans table */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-extrabold text-gray-900 font-display text-sm">
                      Recent Scans
                    </h3>
                    <p className="text-gray-400 text-xs">Your latest plant diagnoses</p>
                  </div>
                  <Link to="/scan">
                    <Button variant="outline" size="sm">
                      <ScanLine size={13} /> New Scan
                    </Button>
                  </Link>
                </div>
                {stats.recentScans.length === 0 ? (
                  <div className="p-12 text-center">
                    <ScanLine size={40} className="text-gray-200 mx-auto mb-3" />
                    <h3 className="font-bold text-gray-700 mb-1">No scans yet</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Upload a plant photo to get your first AI diagnosis
                    </p>
                    <Link to="/scan">
                      <Button variant="primary" size="sm">
                        <ScanLine size={14} /> Scan a Plant
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          {['Diagnosis', 'Severity', 'When'].map(h => (
                            <th
                              key={h}
                              className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {stats.recentScans.map((scan, i) => (
                          <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-3.5 font-medium text-gray-900">
                              {scan.disease_name || 'Unknown'}
                            </td>
                            <td className="px-4 py-3.5">
                              {scan.severity ? (
                                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full text-white ${severityColors[scan.severity] || 'bg-gray-400'}`}>
                                  {scan.severity.charAt(0).toUpperCase() + scan.severity.slice(1)}
                                </span>
                              ) : (
                                <span className="text-gray-400 text-xs">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3.5 text-gray-400 text-xs">
                              {timeAgo(scan.created_at)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Recent crops table */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-extrabold text-gray-900 font-display text-sm">
                      My Crops
                    </h3>
                    <p className="text-gray-400 text-xs">Current field health status</p>
                  </div>
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm">
                      <Leaf size={13} /> Manage
                    </Button>
                  </Link>
                </div>
                {stats.recentCrops.length === 0 ? (
                  <div className="p-12 text-center">
                    <Leaf size={40} className="text-gray-200 mx-auto mb-3" />
                    <h3 className="font-bold text-gray-700 mb-1">No crops added</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Add your crops in the dashboard to track field health
                    </p>
                    <Link to="/dashboard">
                      <Button variant="primary" size="sm">
                        Go to Dashboard →
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          {['Crop', 'Field', 'Status', 'Health'].map(h => (
                            <th
                              key={h}
                              className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {stats.recentCrops.map((crop, i) => (
                          <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-4 py-3.5 font-semibold text-gray-900">
                              {crop.name}
                            </td>
                            <td className="px-4 py-3.5 text-gray-500">{crop.field_name}</td>
                            <td className="px-4 py-3.5">
                              <StatusBadge status={crop.status} />
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      crop.health_score > 80
                                        ? 'bg-green-500'
                                        : crop.health_score > 60
                                        ? 'bg-yellow-400'
                                        : 'bg-red-500'
                                    }`}
                                    style={{ width: `${crop.health_score}%` }}
                                  />
                                </div>
                                <span className="text-xs font-bold text-gray-700">
                                  {crop.health_score}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Platform summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShoppingBag size={22} className="text-green-500" />
                  </div>
                  <div>
                    <div className="font-display text-2xl font-extrabold text-gray-900">
                      {stats.totalListings}
                    </div>
                    <div className="text-gray-400 text-xs">Active marketplace listings</div>
                    <Link to="/marketplace" className="text-green-500 text-xs font-semibold hover:text-green-600">
                      View marketplace →
                    </Link>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageSquare size={22} className="text-green-500" />
                  </div>
                  <div>
                    <div className="font-display text-2xl font-extrabold text-gray-900">
                      {stats.totalPosts}
                    </div>
                    <div className="text-gray-400 text-xs">Community discussions</div>
                    <Link to="/community" className="text-green-500 text-xs font-semibold hover:text-green-600">
                      View community →
                    </Link>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Globe size={22} className="text-green-500" />
                  </div>
                  <div>
                    <div className="font-display text-2xl font-extrabold text-gray-900">
                      {stats.totalScans}
                    </div>
                    <div className="text-gray-400 text-xs">Total plant scans</div>
                    <Link to="/scan" className="text-green-500 text-xs font-semibold hover:text-green-600">
                      Scan a plant →
                    </Link>
                  </div>
                </div>
              </div>

              {/* FAO Partnership banner */}
              <div className="bg-gray-900 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Globe size={24} className="text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-extrabold font-display text-base mb-1">
                    Data Partnership Program
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed">
                    Government agencies, FAO, CGIAR, and research institutions can access
                    anonymised agricultural datasets to understand farmer challenges, crop trends,
                    and disease outbreak patterns at scale.
                  </p>
                </div>
                <Button variant="primary" size="sm" className="flex-shrink-0">
                  Request Access →
                </Button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}