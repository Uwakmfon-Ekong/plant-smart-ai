import { useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, BarChart3, Globe, Bug, LayoutDashboard, ScanLine, ShoppingBag, Users, MessageSquare, LogOut, Download } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const scanData = [42, 65, 55, 88, 72, 95, 81]
const revenueData = [320, 450, 390, 610, 520, 780, 690]
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const yieldData = [2.1, 2.4, 2.2, 2.8, 3.1, 3.4]

const topDiseases = [
  { name: 'Tomato Late Blight', count: 1842, pct: 28, color: 'bg-red-500' },
  { name: 'Cassava Mosaic Virus', count: 1241, pct: 19, color: 'bg-orange-500' },
  { name: 'Maize Streak Virus', count: 987, pct: 15, color: 'bg-yellow-500' },
  { name: 'Fall Armyworm', count: 823, pct: 13, color: 'bg-purple-500' },
  { name: 'Pepper Anthracnose', count: 654, pct: 10, color: 'bg-blue-500' },
  { name: 'Others', count: 1001, pct: 15, color: 'bg-gray-300' },
]

const regionData = [
  { region: 'South West Nigeria', scans: 8420, farmers: 2341, topCrop: 'Tomato' },
  { region: 'North West Nigeria', scans: 6230, farmers: 1876, topCrop: 'Maize' },
  { region: 'South East Nigeria', scans: 4810, farmers: 1432, topCrop: 'Cassava' },
  { region: 'Ghana', scans: 3920, farmers: 1198, topCrop: 'Cocoa' },
  { region: 'Kenya', scans: 2840, farmers: 876, topCrop: 'Tea/Coffee' },
]

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: ScanLine, label: 'Scan Plant', href: '/scan' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics', active: true },
  { icon: ShoppingBag, label: 'Marketplace', href: '/marketplace' },
  { icon: Users, label: 'Experts', href: '/experts' },
  { icon: MessageSquare, label: 'Community', href: '/community' },
]

function MiniBarChart({ data, color = 'bg-green-500', label }: { data: number[]; color?: string; label: string[] }) {
  const max = Math.max(...data)
  return (
    <div className="flex items-end gap-1.5 h-20">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className={`w-full ${color} rounded-t-md hover:opacity-80 transition-opacity`}
            style={{ height: `${(v / max) * 100}%` }}
          />
          <span className="text-[9px] text-gray-400">{label[i]}</span>
        </div>
      ))}
    </div>
  )
}

function MiniLineChart({ data }: { data: number[] }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const h = 60, w = 100
  const pts = data.map((v, i) =>
    `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`
  )
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16" preserveAspectRatio="none">
      <polyline
        fill="none" stroke="#22c55e" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
        points={pts.join(' ')}
      />
      <polyline
        fill="rgba(34,197,94,0.1)" stroke="none"
        points={`0,${h} ${pts.join(' ')} ${w},${h}`}
      />
    </svg>
  )
}

export default function AnalyticsPage() {
  const { user, signOut } = useAuth()
  const [period, setPeriod] = useState('7d')
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
              <div className="text-white text-xs font-semibold truncate">{user?.email || 'farmer@example.com'}</div>
              <div className="text-white/40 text-[10px]">Farmer Pro</div>
            </div>
          </div>
          <button onClick={signOut}
            className="w-full flex items-center gap-2 text-white/40 hover:text-white text-xs font-medium transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600">
              <BarChart3 size={20} />
            </button>
            <div>
              <h1 className="font-extrabold text-gray-900 text-base font-display">Analytics Dashboard</h1>
              <p className="text-gray-400 text-xs">Agricultural intelligence & insights</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex gap-1 bg-gray-100 rounded-xl p-1">
              {['7d', '30d', '90d', '1y'].map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    period === p ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  {p}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm">
              <Download size={14} /> Export
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">

          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Scans', value: '2.4M', change: '+18%', up: true,  sub: 'This month' },
              { label: 'Active Farmers', value: '50,241', change: '+12%', up: true,  sub: 'Platform total' },
              { label: 'Revenue Generated', value: '$12.3M', change: '+31%', up: true,  sub: 'For farmers' },
              { label: 'Avg Diagnosis Time', value: '1.8s', change: '-0.3s', up: true,  sub: 'AI speed' },
            ].map(kpi => (
              <div key={kpi.label} className="bg-white rounded-2xl p-5 border border-gray-200">
                {/* <div className="text-2xl mb-2">{kpi.icon}</div> */}
                <div className="font-display text-2xl font-extrabold text-gray-900">{kpi.value}</div>
                <div className={`flex items-center gap-1 text-xs font-semibold mt-0.5 ${kpi.up ? 'text-green-500' : 'text-red-500'}`}>
                  {kpi.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {kpi.change}
                </div>
                <div className="text-gray-400 text-xs mt-0.5">{kpi.label}</div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-gray-900 font-display text-sm">Weekly Scan Volume</h3>
                  <p className="text-gray-400 text-xs">Disease detection events per day</p>
                </div>
                <span className="text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">↑ 18%</span>
              </div>
              <MiniBarChart data={scanData} label={weekDays} />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-gray-900 font-display text-sm">Farmer Revenue Trend</h3>
                  <p className="text-gray-400 text-xs">₦000s via marketplace (weekly)</p>
                </div>
                <span className="text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">↑ 31%</span>
              </div>
              <MiniBarChart data={revenueData} color="bg-green-400" label={weekDays} />
            </div>
          </div>

          {/* Yield trend + Disease breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="font-extrabold text-gray-900 font-display text-sm mb-1">Avg Yield Trend</h3>
              <p className="text-gray-400 text-xs mb-3">Tonnes/hectare (6 months)</p>
              <MiniLineChart data={yieldData} />
              <div className="flex justify-between mt-1">
                {months.map(m => <span key={m} className="text-[9px] text-gray-400">{m}</span>)}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="font-display text-xl font-extrabold text-green-500">3.4T</div>
                <div className="text-gray-400 text-xs">Current average · +62% vs Jan</div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-gray-900 font-display text-sm">Top Disease Detections</h3>
                  <p className="text-gray-400 text-xs">Most common this month</p>
                </div>
                <Bug size={18} className="text-red-400" />
              </div>
              <div className="space-y-3">
                {topDiseases.map(d => (
                  <div key={d.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700 font-medium">{d.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{d.count.toLocaleString()}</span>
                        <span className="text-xs font-bold text-gray-600">{d.pct}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${d.color} rounded-full`} style={{ width: `${d.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Regional table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h3 className="font-extrabold text-gray-900 font-display text-sm">Regional Breakdown</h3>
                <p className="text-gray-400 text-xs">Farmer activity by region</p>
              </div>
              <Globe size={18} className="text-green-500" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Region', 'Total Scans', 'Farmers', 'Top Crop', 'Activity'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {regionData.map((row, i) => (
                    <tr key={row.region} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3.5 font-semibold text-gray-900">{row.region}</td>
                      <td className="px-4 py-3.5 text-gray-600">{row.scans.toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-gray-600">{row.farmers.toLocaleString()}</td>
                      <td className="px-4 py-3.5">
                        <span className="bg-green-50 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">{row.topCrop}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${100 - i * 18}%` }} />
                          </div>
                          <span className="text-xs text-gray-400">{100 - i * 18}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAO Partnership banner */}
          <div className="bg-gray-900 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="text-4xl flex-shrink-0">🌐</div>
            <div className="flex-1">
              <h3 className="text-white font-extrabold font-display text-base mb-1">Data Partnership Program</h3>
              <p className="text-white/55 text-sm leading-relaxed">
                Government agencies, FAO, CGIAR, and research institutions can access anonymised, region-level agricultural datasets to understand farmer challenges, crop trends, and disease outbreak patterns at scale.
              </p>
            </div>
            <Button variant="primary" size="sm" className="flex-shrink-0">Request Access →</Button>
          </div>

        </main>
      </div>
    </div>
  )
}