import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signUp(email, password, name)
    if (error) { setError(error.message); setLoading(false) }
    else setSuccess(true)
  }

  if (success) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-4">🌿</div>
        <h2 className="font-extrabold text-gray-900 text-2xl font-display mb-2">Check your email!</h2>
        <p className="text-gray-500 text-sm mb-6">We sent a confirmation link to <strong>{email}</strong>. Click it to activate your PlantSmart AI account.</p>
        <Link to="/login"><Button variant="primary" fullWidth>Go to Sign In</Button></Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex justify-center">
            <Logo variant="dark" size="lg" />
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-6 mb-2 font-display">Create your account</h1>
          <p className="text-gray-500 text-sm">Start farming smarter with AI — it's free</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Amara Osei"
                  className="w-full pl-10 pr-4 py-3 border-[1.5px] border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-3 focus:ring-green-500/12 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border-[1.5px] border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-3 focus:ring-green-500/12 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters"
                  minLength={8}
                  className="w-full pl-10 pr-10 py-3 border-[1.5px] border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-3 focus:ring-green-500/12 transition-all" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
              {loading ? 'Creating account...' : 'Create Free Account →'}
            </Button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-4">
            By signing up, you agree to our <Link to="/terms" className="text-green-500">Terms</Link> and <Link to="/privacy" className="text-green-500">Privacy Policy</Link>.
          </p>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-green-500 font-semibold hover:text-green-600">Sign in →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
