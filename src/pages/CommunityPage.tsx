import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Heart, MessageCircle, Plus, Search, X, Send,
  Globe, Leaf, Bug, TrendingUp, Droplets, AlertCircle,
  Loader2, ChevronRight, Tag
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

interface Post {
  id: string
  author_id: string
  title: string
  content: string
  tags: string[]
  likes_count: number
  replies_count: number
  created_at: string
  profiles?: { full_name: string | null; location?: string | null }
}

interface Reply {
  id: string
  post_id: string
  author_id: string
  content: string
  created_at: string
  profiles?: { full_name: string | null }
}

const topicFilters = [
  { icon: Globe, label: 'All Topics' },
  { icon: Bug, label: 'Disease & Pests' },
  { icon: Leaf, label: 'Crop Tips' },
  { icon: TrendingUp, label: 'Market & Sales' },
  { icon: Droplets, label: 'Irrigation' },
]

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return new Date(dateStr).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })
}

function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' }
  return (
    <div className={`${sizes[size]} bg-green-100 rounded-full flex items-center justify-center font-bold text-green-700 flex-shrink-0`}>
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

export default function CommunityPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [filtered, setFiltered] = useState<Post[]>([])
  const [search, setSearch] = useState('')
  const [activeTopic, setActiveTopic] = useState('All Topics')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showNewPost, setShowNewPost] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())

  useEffect(() => { fetchPosts() }, [])

  const fetchPosts = async () => {
    setLoading(true)
    setError('')
    const { data, error } = await supabase
      .from('community_posts')
      .select('*, profiles(full_name, location)')
      .order('created_at', { ascending: false })
    if (error) setError('Failed to load posts. Please refresh.')
    else setPosts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    let result = posts
    if (search) result = result.filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    )
    setFiltered(result)
  }, [search, posts])

  const handleLike = async (postId: string) => {
    if (!user) return
    const already = likedPosts.has(postId)
    setLikedPosts(prev => {
      const next = new Set(prev)
      already ? next.delete(postId) : next.add(postId)
      return next
    })
    const delta = already ? -1 : 1
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, likes_count: p.likes_count + delta } : p
    ))
    if (selectedPost?.id === postId) {
      setSelectedPost(prev => prev ? { ...prev, likes_count: prev.likes_count + delta } : null)
    }
    await supabase
      .from('community_posts')
      .update({ likes_count: (posts.find(p => p.id === postId)?.likes_count || 0) + delta })
      .eq('id', postId)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-[72px]">
        {/* Header */}
        <div className="bg-green-500 py-14 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-white/70 text-xs font-bold tracking-widest uppercase">
                  Global Community
                </span>
                <h1 className="text-white text-3xl sm:text-4xl font-extrabold font-display mt-1 mb-2">
                  Farmer Knowledge Hub
                </h1>
                <p className="text-white/75 text-sm max-w-md">
                  Share experiences, ask questions, and learn from farmers worldwide.
                </p>
              </div>
              {user ? (
                <Button variant="white" size="lg" onClick={() => setShowNewPost(true)}>
                  <Plus size={16} /> Share Knowledge
                </Button>
              ) : (
                <Link to="/register">
                  <Button variant="white" size="lg">
                    <Plus size={16} /> Join & Post
                  </Button>
                </Link>
              )}
            </div>
            <div className="mt-8 relative max-w-2xl">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search discussions, crops, diseases, tips..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white text-sm focus:outline-none shadow-lg"
              />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { val: posts.length.toString(), lbl: 'Discussions' },
              { val: '50K+', lbl: 'Members' },
              { val: '32', lbl: 'Countries' },
              { val: '8', lbl: 'Languages' },
            ].map(({ val, lbl }) => (
              <div key={lbl} className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
                <div className="font-display text-2xl font-extrabold text-green-500">{val}</div>
                <div className="text-gray-400 text-xs mt-0.5">{lbl}</div>
              </div>
            ))}
          </div>

          {/* Topic filters */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {topicFilters.map(({ icon: Icon, label }) => (
              <button key={label} onClick={() => setActiveTopic(label)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  activeTopic === label
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-green-500'
                }`}>
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 size={32} className="text-green-500 animate-spin" />
              <p className="text-gray-400 text-sm">Loading discussions...</p>
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
              <MessageCircle size={48} className="text-gray-200 mx-auto mb-4" />
              <h3 className="font-extrabold text-gray-900 font-display text-xl mb-2">
                {posts.length === 0 ? 'No discussions yet' : 'No results found'}
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                {posts.length === 0
                  ? 'Be the first to share knowledge with the community'
                  : 'Try a different search term'}
              </p>
              {user && posts.length === 0 && (
                <Button variant="primary" onClick={() => setShowNewPost(true)}>
                  <Plus size={15} /> Start First Discussion
                </Button>
              )}
            </div>
          )}

          {/* Posts */}
          {!loading && !error && filtered.length > 0 && (
            <div className="space-y-4">
              {filtered.map(post => (
                <div key={post.id}
                  className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 hover:shadow-md hover:border-green-200 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar name={post.profiles?.full_name || 'F'} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 text-sm">
                        {post.profiles?.full_name || 'Farmer'}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {post.profiles?.location || 'Nigeria'} · {timeAgo(post.created_at)}
                      </div>
                    </div>
                  </div>

                  <h3
                    className="font-extrabold text-gray-900 text-base font-display mb-2 cursor-pointer hover:text-green-600 transition-colors"
                    onClick={() => setSelectedPost(post)}>
                    {post.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.content}
                  </p>

                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {post.tags.map(tag => (
                        <span key={tag}
                          className="inline-flex items-center gap-1 text-xs font-semibold bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
                          <Tag size={9} /> {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                        likedPosts.has(post.id) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                      }`}>
                      <Heart size={15} className={likedPosts.has(post.id) ? 'fill-current' : ''} />
                      {post.likes_count}
                    </button>
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-green-500 transition-colors">
                      <MessageCircle size={15} />
                      {post.replies_count} {post.replies_count === 1 ? 'reply' : 'replies'}
                    </button>
                    <button
                      onClick={() => setSelectedPost(post)}
                      className="ml-auto flex items-center gap-1 text-green-500 text-sm font-semibold hover:text-green-600 transition-colors">
                      Read more <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onLike={() => handleLike(selectedPost.id)}
          liked={likedPosts.has(selectedPost.id)}
          onReplyAdded={() => {
            setPosts(prev => prev.map(p =>
              p.id === selectedPost.id
                ? { ...p, replies_count: p.replies_count + 1 }
                : p
            ))
          }}
        />
      )}

      {showNewPost && (
        <NewPostModal
          onClose={() => setShowNewPost(false)}
          onSuccess={() => { setShowNewPost(false); fetchPosts() }}
        />
      )}

      <Footer />
    </div>
  )
}

function PostDetailModal({
  post, onClose, onLike, liked, onReplyAdded
}: {
  post: Post
  onClose: () => void
  onLike: () => void
  liked: boolean
  onReplyAdded: () => void
}) {
  const { user } = useAuth()
  const [reply, setReply] = useState('')
  const [replies, setReplies] = useState<Reply[]>([])
  const [loadingReplies, setLoadingReplies] = useState(true)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { fetchReplies() }, [post.id])

  const fetchReplies = async () => {
    setLoadingReplies(true)
    const { data } = await supabase
      .from('post_replies')
      .select('*, profiles(full_name)')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true })
    setReplies(data || [])
    setLoadingReplies(false)
  }

  const sendReply = async () => {
    if (!reply.trim() || !user || sending) return
    setSending(true)
    const { data, error } = await supabase
      .from('post_replies')
      .insert({ post_id: post.id, author_id: user.id, content: reply.trim() })
      .select('*, profiles(full_name)')
      .single()
    setSending(false)
    if (!error && data) {
      setReplies(prev => [...prev, data])
      setReply('')
      onReplyAdded()
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center"
      onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl sm:rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-extrabold text-gray-900 font-display text-base">Discussion</h2>
          <button onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex items-center gap-3 mb-4">
            <Avatar name={post.profiles?.full_name || 'F'} size="lg" />
            <div>
              <div className="font-semibold text-gray-900 text-sm">
                {post.profiles?.full_name || 'Farmer'}
              </div>
              <div className="text-gray-400 text-xs">
                {post.profiles?.location} · {timeAgo(post.created_at)}
              </div>
            </div>
          </div>

          <h3 className="font-extrabold text-gray-900 font-display text-lg mb-3">{post.title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{post.content}</p>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.tags.map(tag => (
                <span key={tag}
                  className="inline-flex items-center gap-1 text-xs font-semibold bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
                  <Tag size={9} /> {tag}
                </span>
              ))}
            </div>
          )}

          <button
            onClick={onLike}
            className={`flex items-center gap-2 text-sm font-medium mb-6 transition-colors ${
              liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}>
            <Heart size={16} className={liked ? 'fill-current' : ''} />
            {post.likes_count} {post.likes_count === 1 ? 'like' : 'likes'}
          </button>

          {/* Replies */}
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
            {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
          </div>

          {loadingReplies ? (
            <div className="flex justify-center py-6">
              <Loader2 size={20} className="text-green-500 animate-spin" />
            </div>
          ) : replies.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No replies yet. Be the first to respond.
            </div>
          ) : (
            <div className="space-y-4">
              {replies.map(r => (
                <div key={r.id} className="flex gap-3">
                  <Avatar name={r.profiles?.full_name || 'F'} size="sm" />
                  <div className="flex-1 bg-gray-50 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-800">
                        {r.profiles?.full_name || 'Farmer'}
                      </span>
                      <span className="text-xs text-gray-400">{timeAgo(r.created_at)}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{r.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Reply input */}
        {user ? (
          <div className="p-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
            <Avatar name={user.email || 'F'} size="sm" />
            <div className="flex-1 flex gap-2">
              <input
                value={reply}
                onChange={e => setReply(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendReply()}
                placeholder="Share your experience or advice..."
                className="flex-1 border-[1.5px] border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 transition-all"
              />
              <button
                onClick={sendReply}
                disabled={!reply.trim() || sending}
                className="w-10 h-10 bg-green-500 hover:bg-green-600 disabled:bg-gray-200 rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                {sending
                  ? <Loader2 size={14} className="text-white animate-spin" />
                  : <Send size={14} className="text-white" />
                }
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 border-t border-gray-100 text-center flex-shrink-0">
            <p className="text-gray-400 text-sm mb-3">Sign in to join the discussion</p>
            <Link to="/register">
              <Button variant="primary" size="sm">Join to Reply →</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function NewPostModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags(prev => [...prev, t])
      setTagInput('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    setError('')
    const { error } = await supabase.from('community_posts').insert({
      author_id: user.id,
      title,
      content,
      tags,
      likes_count: 0,
      replies_count: 0,
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
          <h2 className="font-extrabold text-gray-900 font-display text-xl">Share Knowledge</h2>
          <button onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title *</label>
            <input
              required value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g. How I doubled my maize yield this season"
              className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Your Story / Tips / Question *
            </label>
            <textarea
              required value={content} onChange={e => setContent(e.target.value)}
              rows={6}
              placeholder="Share your farming experience, ask a question, or give advice to fellow farmers..."
              className="w-full border-[1.5px] border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 resize-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Tags <span className="text-gray-400 font-normal">(up to 5)</span>
            </label>
            {tags.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-2">
                {tags.map(t => (
                  <span key={t}
                    className="inline-flex items-center gap-1 text-xs font-semibold bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
                    {t}
                    <button type="button" onClick={() => setTags(prev => prev.filter(x => x !== t))}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                placeholder="e.g. Tomato, Disease Control"
                className="flex-1 border-[1.5px] border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 transition-all"
              />
              <button
                type="button" onClick={addTag}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-semibold transition-colors">
                Add
              </button>
            </div>
          </div>
          <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
            {loading ? 'Publishing...' : 'Publish Post →'}
          </Button>
        </form>
      </div>
    </div>
  )
}