import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Send, Leaf, RotateCcw, ArrowLeft, Loader2 } from 'lucide-react'
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

Always give practical, actionable advice. When recommending chemicals, include the active ingredient, dosage, and safety precautions. Use simple language. Be warm, encouraging, and farmer-friendly. When mentioning prices, use Nigerian Naira as default but adapt if the user mentions another country.`

const suggestions = [
  'My tomato leaves have brown patches — what disease is this?',
  'When is the best time to plant maize in Nigeria?',
  'What fertilizer should I use for cassava?',
  'How do I control fall armyworm on my crops?',
  'My pepper plants are wilting — what could be wrong?',
  'How much water does rice need per week?',
]

async function askAI(history: { role: string; content: string }[]): Promise<string> {
  const lastMessage = history[history.length - 1]?.content || ''

  // Smart keyword responses while API key is not set
  const msg = lastMessage.toLowerCase()

  if (msg.includes('tomato') && (msg.includes('blight') || msg.includes('brown') || msg.includes('spot'))) {
    return "Based on your description, your tomato may have Early or Late Blight — a very common fungal disease in Nigeria.\n\n**What to look for:**\n• Brown or black spots with yellow rings on leaves\n• Lesions starting from lower leaves moving upward\n• White mold under leaves in humid conditions\n\n**Treatment:**\n• Apply Mancozeb 80% WP at 2.5g per litre of water\n• Spray every 7 days for 3 applications\n• Remove and destroy affected leaves\n• Apply in early morning\n\n**Where to buy:** Any major agro-dealer in your area. Ask for Mancozeb or Dithane M45.\n\nFor a confirmed diagnosis, upload a photo in the Scan section or book an expert session."
  }

  if (msg.includes('maize') || msg.includes('corn')) {
    return "For maize farming in Nigeria, here are key guidelines:\n\n**Planting time:**\n• South: March-April (first season) or August-September (second season)\n• North: June-July when rains are established\n\n**Fertilizer:**\n• Apply NPK 15-15-15 at planting — 1 bag per acre\n• Top dress with Urea at 6 weeks — half bag per acre\n\n**Common diseases:**\n• Maize Streak Virus — plant resistant varieties like SAMMAZ 15\n• Fall Armyworm — spray Coragen or Emamectin Benzoate\n\n**Expected yield:** 2-4 tonnes per hectare with good management.\n\nAny specific maize question? I am here to help."
  }

  if (msg.includes('cassava')) {
    return "Cassava farming tips for Nigeria:\n\n**Best varieties:**\n• TME 419, TMS 30572, IITA TMS varieties for high yield\n• Ask your local IITA office for certified stem cuttings\n\n**Planting:**\n• Plant at start of rainy season\n• Spacing: 1m x 1m for maximum yield\n• Use healthy stem cuttings 25-30cm long\n\n**Common problems:**\n• Cassava Mosaic Disease — plant resistant varieties, remove infected plants\n• Cassava Mealybug — spray Chlorpyrifos\n• Root rot — improve drainage, avoid waterlogged soils\n\n**Harvest:** 9-12 months for most varieties, 6-7 months for early maturing types.\n\nWhat specific cassava challenge are you facing?"
  }

  if (msg.includes('fertilizer') || msg.includes('fertiliser')) {
    return "Fertilizer guide for Nigerian farmers:\n\n**For vegetables (tomato, pepper, leafy greens):**\n• NPK 15-15-15 at planting\n• CAN or Urea for top dressing at 3-4 weeks\n• Foliar spray: Amino acids or seaweed extract for fruit development\n\n**For cereals (maize, sorghum, millet):**\n• NPK 15-15-15 or 20-10-10 at planting\n• Urea top dressing at 6 weeks\n\n**For root crops (cassava, yam):**\n• NPK 12-12-17 works best for root development\n• Avoid excess nitrogen — promotes leaves over roots\n\n**Organic options:**\n• Poultry manure: 5 tonnes per hectare\n• Compost: 10 tonnes per hectare\n\nWhat crop are you fertilizing? I can give more specific advice."
  }

  if (msg.includes('pest') || msg.includes('insect') || msg.includes('worm') || msg.includes('armyworm')) {
    return "Pest control guide for West African farmers:\n\n**Fall Armyworm (most common in maize):**\n• Look for ragged holes in leaves and sawdust-like frass\n• Spray Coragen (Chlorantraniliprole) or Emamectin Benzoate\n• Apply in early morning or evening\n• Cost: about ₦3,000-5,000 per acre treatment\n\n**Aphids:**\n• Tiny green or black insects under leaves\n• Spray Cypermethrin or Imidacloprid\n• Neem oil also works as organic option\n\n**Whitefly:**\n• Yellow sticky traps help monitor\n• Spray Imidacloprid or Thiamethoxam\n\n**General IPM tips:**\n• Rotate crops every season\n• Remove crop residues after harvest\n• Plant border crops like marigold to repel pests\n\nDescribe the pest or damage you are seeing for more specific advice."
  }

  if (msg.includes('water') || msg.includes('irrigation') || msg.includes('dry') || msg.includes('drought')) {
    return "Irrigation and water management for Nigerian farmers:\n\n**How much water crops need:**\n• Tomato: 4-6 litres per plant per day in dry season\n• Maize: 500-800mm total per season\n• Pepper: 3-4 litres per plant per day\n• Leafy vegetables: water daily in dry season\n\n**Affordable irrigation options:**\n• Drip irrigation: most efficient, saves 50% water — costs ₦60,000-80,000 per acre\n• Sprinkler: good for vegetables — costs ₦40,000-60,000 per acre\n• Manual watering: cheapest but labour intensive\n\n**Signs of water stress:**\n• Wilting in afternoon even when soil looks moist — check roots for rot\n• Yellowing lower leaves — could be overwatering\n• Stunted growth and purple leaves — underwatering\n\n**Best time to water:** Early morning between 6-9am to reduce evaporation and disease.\n\nWhat crop are you irrigating?"
  }

  if (msg.includes('market') || msg.includes('sell') || msg.includes('price') || msg.includes('buyer')) {
    return "Market access tips for Nigerian farmers:\n\n**How to get better prices:**\n• List your produce on the PlantSmart Marketplace to reach direct buyers\n• Join a cooperative to negotiate bulk prices\n• Add value — cleaning, grading, and packaging increases price by 20-40%\n• Time your harvest to avoid peak supply glut\n\n**Current market channels:**\n• Local market: lowest price but immediate payment\n• Processor/factory: steady demand, negotiated price\n• Export: highest price but requires certification\n• Supermarkets: good price, needs consistency and packaging\n\n**Price guide (approximate 2024):**\n• Tomato: ₦15,000-25,000 per basket (dry season premium)\n• Maize: ₦200,000-280,000 per tonne\n• Cassava: ₦60,000-90,000 per tonne\n• Pepper: ₦800-1,500 per kg\n\nUse the PlantSmart Marketplace to list your produce and connect with verified buyers directly."
  }

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('help') || msg.includes('start')) {
    return "Hello! I am PlantSmart AI's farming assistant. I am here to help you with practical farming advice.\n\nYou can ask me about:\n• Specific crop diseases and treatment\n• Fertilizer recommendations\n• Planting schedules and timing\n• Pest control methods\n• Irrigation and water management\n• How to get better market prices\n\nWhat crop or farming challenge can I help you with today?"
  }

  // Default response
  return `Thank you for your question about "${lastMessage.slice(0, 50)}${lastMessage.length > 50 ? '...' : ''}".\n\nI can help with specific questions about:\n• Tomato, maize, cassava, pepper, and other crops\n• Disease identification and treatment\n• Fertilizer and soil management\n• Pest control\n• Irrigation and water management\n• Market access and pricing\n\nCould you tell me more specifically:\n1. Which crop are you growing?\n2. What problem or challenge are you facing?\n3. Where is your farm located?\n\nThe more details you give me, the better I can help you.`
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
        <Leaf size={14} className="text-green-600" />
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
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
      content: "Hello! I am PlantSmart AI's farming assistant.\n\nI can help you with:\n• Plant disease diagnosis and treatment\n• Crop planting schedules and harvest timing\n• Fertilizer and soil management\n• Pest control recommendations\n• Market advice and pricing\n\nWhat is happening on your farm today?",
      timestamp: new Date(),
    },
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
      timestamp: new Date(),
    }

    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    const history = updatedMessages
      .filter(m => m.id !== '0')
      .map(m => ({ role: m.role, content: m.content }))

    try {
      const reply = await askAI(history)
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: reply,
          timestamp: new Date(),
        },
      ])
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Something went wrong. Please try again.')
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
    setMessages([
      {
        id: '0',
        role: 'assistant',
        content:
          "Hello! I am PlantSmart AI's farming assistant.\n\nWhat is happening on your farm today?",
        timestamp: new Date(),
      },
    ])
    setError('')
    setInput('')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="pt-32 flex-1 flex flex-col max-w-3xl mx-auto w-full px-0 sm:px-4 sm:py-6">
        <div className="lg:mt-20 flex-1 flex flex-col bg-white sm:rounded-2xl sm:border sm:border-gray-200 sm:shadow-lg overflow-hidden">

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
                <div className="font-extrabold text-gray-900 text-sm font-display">
                  PlantSmart AI Assistant
                </div>
                <div className="flex items-center gap-1.5 text-xs text-green-500">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                  Online · AI Powered
                </div>
              </div>
            </div>
            <button
              onClick={reset}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              title="New conversation">
              <RotateCcw size={17} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50/50">
            {messages.map(msg => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}
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

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 sm:px-6 pb-3">
              <div className="text-xs font-semibold text-gray-400 mb-2">Try asking:</div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
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
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your crops, diseases, planting schedule..."
                rows={1}
                disabled={loading}
                className="flex-1 border-[1.5px] border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all resize-none disabled:opacity-50 max-h-32 overflow-y-auto"
                style={{ minHeight: '46px' }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="w-11 h-11 bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                {loading
                  ? <Loader2 size={16} className="text-white animate-spin" />
                  : <Send size={16} className={input.trim() ? 'text-white' : 'text-gray-400'} />
                }
              </button>
            </div>
            <div className="text-center mt-2">
              <span className="text-[10px] text-gray-300">
                Free AI assistant · For severe crop issues, book an Expert
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}