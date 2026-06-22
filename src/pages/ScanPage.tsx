import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Camera, Upload, X, ArrowLeft, Loader2, CheckCircle, AlertTriangle, Info } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Button from '@/components/ui/Button'

type ScanState = 'idle' | 'scanning' | 'result'

interface DiagnosisResult {
  diseaseName: string
  confidence: number
  severity: 'low' | 'medium' | 'high'
  description: string
  chemical: string
  dosage: string
  timeline: string
}

const mockResult: DiagnosisResult = {
  diseaseName: 'Tomato Late Blight',
  confidence: 92,
  severity: 'high',
  description: 'Phytophthora infestans infection identified. Brown lesions with pale green borders visible on leaves. Requires immediate treatment to prevent spread.',
  chemical: 'Copper Fungicide (Copper Oxychloride 50% WP)',
  dosage: '2.5g per litre of water. Apply 500ml per plant.',
  timeline: 'Apply within 24–48 hours. Repeat after 7–10 days.',
}

export default function ScanPage() {
  const [state, setState] = useState<ScanState>('idle')
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    setState('scanning')
    setTimeout(() => {
      setResult(mockResult)
      setState('result')
    }, 2500)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const reset = () => {
    setState('idle')
    setPreview(null)
    setResult(null)
  }

  const severityConfig = {
    low: { color: 'text-green-600', bg: 'bg-green-50 border-green-200', label: 'Low Severity', icon: CheckCircle },
    medium: { color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200', label: 'Medium Severity', icon: Info },
    high: { color: 'text-red-600', bg: 'bg-red-50 border-red-200', label: 'High Severity — Act Fast', icon: AlertTriangle },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-32 max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-green-500 text-sm font-medium transition-colors mb-4">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 font-display mb-2">AI Plant Scanner</h1>
          <p className="text-gray-500">Upload or take a photo of your plant to get an instant AI diagnosis.</p>
        </div>

        {state === 'idle' && (
          <div
            className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center hover:border-green-500 transition-colors cursor-pointer group"
            onClick={() => fileRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-green-500 transition-colors">
              <Camera size={36} className="text-green-500 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-extrabold text-gray-900 text-xl font-display mb-2">Upload Plant Photo</h3>
            <p className="text-gray-400 text-sm mb-6">Drag & drop your image here, or click to browse<br/>Supports JPG, PNG, WEBP — max 10MB</p>
            <Button variant="primary" size="md">
              <Upload size={16} /> Choose Photo
            </Button>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </div>
        )}

        {state === 'scanning' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {preview && <img src={preview} alt="Scanning" className="w-full h-72 object-cover" />}
            <div className="p-10 text-center">
              <Loader2 size={40} className="text-green-500 animate-spin mx-auto mb-4" />
              <h3 className="font-extrabold text-gray-900 text-xl font-display mb-2">Analysing your plant...</h3>
              <p className="text-gray-400 text-sm">Our AI is comparing against 2M+ agricultural data points</p>
            </div>
          </div>
        )}

        {state === 'result' && result && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {preview && <img src={preview} alt="Scanned plant" className="w-full h-64 object-cover" />}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="text-[10px] font-bold text-green-500 tracking-widest uppercase mb-1">AI Diagnosis</div>
                    <h2 className="font-extrabold text-gray-900 text-2xl font-display">{result.diseaseName}</h2>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-3xl font-extrabold text-green-500 font-display">{result.confidence}%</div>
                    <div className="text-xs text-gray-400">Confidence</div>
                  </div>
                </div>

                {/* Severity */}
                {(() => {
                  const cfg = severityConfig[result.severity]
                  const Icon = cfg.icon
                  return (
                    <div className={`flex items-center gap-3 p-3 rounded-xl border ${cfg.bg} mb-4`}>
                      <Icon size={18} className={cfg.color} />
                      <span className={`text-sm font-semibold ${cfg.color}`}>{cfg.label}</span>
                    </div>
                  )
                })()}

                <p className="text-gray-600 text-sm leading-relaxed">{result.description}</p>
              </div>
            </div>

            {/* Treatment */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-extrabold text-gray-900 font-display mb-4">💊 Treatment Recommendation</h3>
              <div className="space-y-3">
                {[
                  { label: 'Chemical', value: result.chemical },
                  { label: 'Dosage', value: result.dosage },
                  { label: 'Timeline', value: result.timeline },
                ].map(({ label, value }) => (
                  <div key={label} className="flex gap-3">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider w-20 flex-shrink-0 pt-0.5">{label}</span>
                    <span className="text-sm text-gray-700 font-medium">{value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex gap-3 flex-wrap">
                <Button variant="primary">Find Where to Buy →</Button>
                <Button variant="outline">Book an Expert</Button>
              </div>
            </div>

            <Button variant="outline" fullWidth onClick={reset}>
              <X size={15} /> Scan Another Plant
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
