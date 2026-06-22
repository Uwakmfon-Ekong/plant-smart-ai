import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Send, Leaf, RotateCcw, ArrowLeft } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const SYSTEM_PROMPT = `You are PlantSmart AI's agricultural assistant — a friendly, expert agronomist helping farmers across Africa and the world. You specialise in:
- Plant disease diagnosis and treatment recommendations
- Crop planting schedules and harvest timing
- Fertilization and soil management advice
- Pest control (chemical and organic methods)
- Irrigation and water management
- Market pricing and where to sell produce
- General farming best practices for tropical climates

Always give practical, actionable advice. When recommending chemicals, include the active ingredient, dosage, and safety precautions. Use simple language. Occasionally reference that users can scan their plants with PlantSmart AI for visual diagnosis. Be warm, encouraging, and farmer-friendly. When mentioning prices, use Nigerian Naira (₦) as default but adapt if the user mentions another country.`

const suggestions = [
  "My tomato leaves have brown patches — what disease is this?",
  "When is the best time to plant maize in Nigeria?",
  "What fertilizer should I use for cassava?",
  "How do I control fall armyworm on my crops?",
  "My pepper plants are wilting — what could be wrong?",
  "How much water does rice need per week?",
]

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
        <Leaf size={14} className="text-green-600" />
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5">
          <Leaf size={14} className="text-green-600" />
        </div>
      )}
      <div className={`max-w-[80%] sm:max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
        isUser
          ? 'bg-green-500 text-white rounded-br-sm'
          : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
      }`}>
        {msg.content}
      </div>
    </div>
  )
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hello! I'm PlantSmart AI's farming assistant 🌿\n\nI can help you with:\n• Plant disease diagnosis & treatment\n• Crop planting schedules & harvest timing\n• Fertilizer & soil management\n• Pest control recommendations\n• Market advice & pricing\n\nWhat's happening on your farm today?",
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    setError('')

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    // Build conversation history for API (exclude the welcome message)
    const history = [...messages, userMsg]
      .filter(m => m.id !== '0')
      .map(m => ({ role: m.role, content: m.content }))

    // Ensure history starts with a user message
    const apiMessages = history.length > 0 && history[0].role === 'user'
      ? history
      : [{ role: 'user' as const, content: text.trim() }]

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      })

      const data = await res.json()
      const replyText = data?.content?.[0]?.text || "I couldn't generate a response. Please try again."

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: replyText,
        timestamp: new Date(),
      }])
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const reset = () => {
    setMessages([{
      id: '0',
      role: 'assistant',
      content: "Hello! I'm PlantSmart AI's farming assistant 🌿\n\nWhat's happening on your farm today?",
      timestamp: new Date()
    }])
    setError('')
    setInput('')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="pt-[72px] flex-1 flex flex-col max-w-3xl mx-auto w-full px-0 sm:px-4 sm:py-6">
        <div className="flex-1 flex flex-col bg-white sm:rounded-2xl sm:border sm:border-gray-200 sm:shadow-lg overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="text-gray-400 hover:text-gray-600 sm:hidden">
                <ArrowLeft size={20} />
              </Link>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Leaf size={18} className="text-green-600" />
              </div>
              <div>
                <div className="font-extrabold text-gray-900 text-sm font-display">PlantSmart AI Assistant</div>
                <div className="flex items-center gap-1.5 text-xs text-green-500">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                  Online · Powered by Claude AI
                </div>
              </div>
            </div>
            <button onClick={reset}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              title="New conversation">
              <RotateCcw size={17} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50/50">
            {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
            {loading && <TypingIndicator />}
            {error && (
              <div className="text-center">
                <div className="inline-block bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-2 rounded-full">
                  {error}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions — only show at start */}
          {messages.length <= 1 && (
            <div className="px-4 sm:px-6 pb-3">
              <div className="text-xs font-semibold text-gray-400 mb-2">Try asking:</div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map(s => (
                  <button key={s} onClick={() => sendMessage(s)}
                    className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-full hover:bg-green-500 hover:text-white hover:border-green-500 transition-all font-medium text-left">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-4 sm:px-6 py-4 border-t border-gray-100 bg-white">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your crops, diseases, planting schedule..."
                  rows={1}
                  disabled={loading}
                  className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all resize-none disabled:opacity-50 max-h-32 overflow-y-auto"
                  style={{ minHeight: '46px' }}
                />
              </div>
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="w-11 h-11 bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                <Send size={16} className={input.trim() && !loading ? 'text-white' : 'text-gray-400'} />
              </button>
            </div>
            <div className="text-center mt-2">
              <span className="text-[10px] text-gray-300">
                Powered by Claude AI · For severe crop issues, book an Expert
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}