import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Camera, Upload, X, ArrowLeft, Loader2,
  CheckCircle, AlertTriangle, Info, ShoppingCart,
  Calendar, Leaf,
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Button from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

type ScanState = 'idle' | 'scanning' | 'result' | 'error'
type Severity = 'low' | 'medium' | 'high' | 'none'

interface DiagnosisResult {
  plantName: string
  condition: string
  severity: Severity
  confidence: number
  description: string
  symptoms: string[]
  treatment: {
    chemical: string
    activeIngredient: string
    dosage: string
    applicationMethod: string
    frequency: string
    safetyNotes: string
  } | null
  preventionTips: string[]
  isHealthy: boolean
}

const severityConfig = {
  none: {
    label: 'Healthy Plant',
    bg: 'bg-green-50 border-green-200',
    text: 'text-green-700',
    icon: CheckCircle,
  },
  low: {
    label: 'Low Severity',
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-700',
    icon: Info,
  },
  medium: {
    label: 'Medium Severity — Treat Soon',
    bg: 'bg-yellow-50 border-yellow-200',
    text: 'text-yellow-700',
    icon: AlertTriangle,
  },
  high: {
    label: 'High Severity — Act Immediately',
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-700',
    icon: AlertTriangle,
  },
}

async function analyseImage(
  _base64Image: string,
  _mimeType: string
): Promise<DiagnosisResult> {
  return {
    plantName: 'Your Plant',
    condition: 'Manual Review Required',
    severity: 'low',
    confidence: 0,
    description: 'AI diagnosis is coming soon. For now, please describe your plant issue in the Community Forum or book a session with one of our agricultural experts for a professional diagnosis.',
    symptoms: [
      'Upload a clear close-up photo of the affected area',
      'Note when symptoms first appeared',
      'Check if other plants nearby are affected',
    ],
    isHealthy: false,
    treatment: null,
    preventionTips: [
      'Post your photo in the Community Forum — other farmers may recognise the issue',
      'Book an expert session for a professional diagnosis',
      'Check our community discussions for similar cases',
    ],
  }
}

export default function ScanPage() {
  const { user } = useAuth()
  const [state, setState] = useState<ScanState>('idle')
  const [preview, setPreview] = useState<string | null>(null)
  const [base64, setBase64] = useState<string | null>(null)
  const [mimeType, setMimeType] = useState<string>('image/jpeg')
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload an image file (JPG, PNG, WEBP)')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Image must be under 10MB')
      return
    }

    setErrorMsg('')
    setSaved(false)
    const previewUrl = URL.createObjectURL(file)
    setPreview(previewUrl)
    setMimeType(file.type)

    const reader = new FileReader()
    reader.onload = async e => {
      const dataUrl = e.target?.result as string
      const b64 = dataUrl.split(',')[1]
      setBase64(b64)
      setState('scanning')
      try {
        const diagnosis = await analyseImage(b64, file.type)
        setResult(diagnosis)
        setState('result')
      } catch (err: any) {
        console.error(err)
        setErrorMsg(
          err.message || 'Analysis failed. Please try again with a clearer image.'
        )
        setState('error')
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const saveScan = async () => {
    if (!user || !result) return
    setSaving(true)
    await supabase.from('scans').insert({
      user_id: user.id,
      image_url: preview || 'local',
      diagnosis: result.description,
      disease_name: result.condition,
      confidence: result.confidence,
      treatment: result.treatment
        ? `${result.treatment.chemical} — ${result.treatment.dosage}`
        : null,
      chemical_recommendation: result.treatment?.chemical || null,
      severity: result.severity === 'none' ? null : result.severity,
    })
    setSaving(false)
    setSaved(true)
  }

  const reset = () => {
    setState('idle')
    setPreview(null)
    setBase64(null)
    setResult(null)
    setErrorMsg('')
    setSaved(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-32 max-w-3xl mx-auto px-4 sm:px-6 py-12">

        {/* Back */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-green-500 text-sm font-medium transition-colors mb-4">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 font-display mb-2">
            AI Plant Scanner
          </h1>
          <p className="text-gray-500 text-sm">
            Upload a clear photo of your plant or affected crop area.
            Our AI will analyse it and give you a real agricultural diagnosis.
          </p>
        </div>

        {/* Idle */}
        {state === 'idle' && (
          <div
            className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center hover:border-green-500 transition-colors cursor-pointer group"
            onClick={() => fileRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}>
            <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-green-500 transition-colors">
              <Camera size={36} className="text-green-500 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-extrabold text-gray-900 text-xl font-display mb-2">
              Upload Plant Photo
            </h3>
            <p className="text-gray-400 text-sm mb-2">
              Take a clear close-up photo of the affected leaf or plant area
            </p>
            <p className="text-gray-300 text-xs mb-6">
              Supports JPG, PNG, WEBP — max 10MB
            </p>
            <Button variant="primary" size="md">
              <Upload size={16} /> Choose Photo
            </Button>
            {errorMsg && (
              <div className="mt-4 text-red-500 text-sm flex items-center justify-center gap-2">
                <AlertTriangle size={14} /> {errorMsg}
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>
        )}

        {/* Scanning */}
        {state === 'scanning' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {preview && (
              <img src={preview} alt="Scanning" className="w-full h-72 object-cover" />
            )}
            <div className="p-10 text-center">
              <Loader2 size={40} className="text-green-500 animate-spin mx-auto mb-4" />
              <h3 className="font-extrabold text-gray-900 text-xl font-display mb-2">
                Analysing your plant...
              </h3>
              <p className="text-gray-400 text-sm">
                Checking your image for diseases, pests, and nutrient deficiencies
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {state === 'error' && (
          <div className="space-y-4">
            {preview && (
              <img
                src={preview}
                alt="Failed scan"
                className="w-full h-64 object-cover rounded-2xl"
              />
            )}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-start gap-3">
              <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-700 mb-1">Analysis Failed</h3>
                <p className="text-red-600 text-sm">{errorMsg}</p>
              </div>
            </div>
            <Button variant="outline" fullWidth onClick={reset}>
              <X size={15} /> Try Again
            </Button>
          </div>
        )}

        {/* Result */}
        {state === 'result' && result && (
          <div className="space-y-4">

            {/* Image + diagnosis summary */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {preview && (
                <img
                  src={preview}
                  alt="Scanned plant"
                  className="w-full h-64 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="text-[10px] font-bold text-green-500 tracking-widest uppercase mb-1">
                      Diagnosis
                    </div>
                    <h2 className="font-extrabold text-gray-900 text-2xl font-display">
                      {result.condition}
                    </h2>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Leaf size={13} className="text-green-500" />
                      <span className="text-sm text-gray-500 font-medium">
                        {result.plantName}
                      </span>
                    </div>
                  </div>
                  {result.confidence > 0 && (
                    <div className="text-right flex-shrink-0">
                      <div className="font-display text-3xl font-extrabold text-green-500">
                        {result.confidence}%
                      </div>
                      <div className="text-xs text-gray-400">Confidence</div>
                    </div>
                  )}
                </div>

                {/* Severity banner */}
                {(() => {
                  const cfg = severityConfig[result.severity]
                  const Icon = cfg.icon
                  return (
                    <div className={`flex items-center gap-3 p-3 rounded-xl border ${cfg.bg} mb-4`}>
                      <Icon size={18} className={cfg.text} />
                      <span className={`text-sm font-semibold ${cfg.text}`}>
                        {cfg.label}
                      </span>
                    </div>
                  )
                })()}

                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {result.description}
                </p>

                {/* Symptoms */}
                {result.symptoms.length > 0 && (
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      What to check
                    </div>
                    <ul className="space-y-1.5">
                      {result.symptoms.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-green-500 font-bold mt-0.5 flex-shrink-0">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Treatment */}
            {result.treatment && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-extrabold text-gray-900 font-display text-base mb-4">
                  Treatment Recommendation
                </h3>
                <div className="space-y-3 mb-4">
                  {[
                    { label: 'Product', value: result.treatment.chemical },
                    { label: 'Active Ingredient', value: result.treatment.activeIngredient },
                    { label: 'Dosage', value: result.treatment.dosage },
                    { label: 'Application', value: result.treatment.applicationMethod },
                    { label: 'Frequency', value: result.treatment.frequency },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-3">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wide w-28 flex-shrink-0 pt-0.5">
                        {label}
                      </span>
                      <span className="text-sm text-gray-700">{value}</span>
                    </div>
                  ))}
                </div>
                {result.treatment.safetyNotes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4">
                    <div className="text-xs font-bold text-yellow-700 uppercase tracking-wide mb-1">
                      Safety Notes
                    </div>
                    <p className="text-yellow-700 text-xs leading-relaxed">
                      {result.treatment.safetyNotes}
                    </p>
                  </div>
                )}
                <div className="flex gap-3">
                  <Link to="/marketplace?cat=input" className="flex-1">
                    <Button variant="primary" fullWidth>
                      <ShoppingCart size={15} /> Buy Treatment
                    </Button>
                  </Link>
                  <Link to="/experts">
                    <Button variant="outline">Ask Expert</Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Next steps when no treatment */}
            {!result.treatment && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-extrabold text-gray-900 font-display text-base mb-4">
                  Next Steps
                </h3>
                <div className="space-y-3">
                  <Link to="/community" className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group">
                    <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-500 transition-colors">
                      <CheckCircle size={16} className="text-green-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">Post in Community Forum</div>
                      <div className="text-gray-400 text-xs">Other farmers may recognise your issue</div>
                    </div>
                  </Link>
                  <Link to="/experts" className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group">
                    <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-500 transition-colors">
                      <Leaf size={16} className="text-green-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">Book an Expert Session</div>
                      <div className="text-gray-400 text-xs">Get a professional diagnosis via video call</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {/* Prevention tips */}
            {result.preventionTips.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-extrabold text-gray-900 font-display text-base mb-3">
                  Tips
                </h3>
                <ul className="space-y-2">
                  {result.preventionTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <CheckCircle size={15} className="text-green-500 flex-shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Save + rescan */}
            <div className="flex gap-3">
              {user && !saved && (
                <Button
                  variant="primary"
                  fullWidth
                  onClick={saveScan}
                  disabled={saving}>
                  {saving
                    ? <><Loader2 size={15} className="animate-spin" /> Saving...</>
                    : <><Calendar size={15} /> Save to Dashboard</>
                  }
                </Button>
              )}
              {saved && (
                <div className="flex-1 flex items-center justify-center gap-2 text-green-600 text-sm font-semibold bg-green-50 rounded-full py-3 border border-green-200">
                  <CheckCircle size={16} /> Saved to your dashboard
                </div>
              )}
              <Button variant="outline" fullWidth onClick={reset}>
                <X size={15} /> Scan Another
              </Button>
            </div>

            {!user && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-center">
                <p className="text-gray-500 text-sm mb-3">
                  Sign in to save your scan results and track crop health over time
                </p>
                <Link to="/register">
                  <Button variant="primary" size="sm">Create Free Account →</Button>
                </Link>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  )
}