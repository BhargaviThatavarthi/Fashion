import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Search,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Tag,
  ChevronRight,
} from 'lucide-react'
import { getBlogPosts } from '../server/functions/blogs'
import { WHATSAPP_NUMBER } from '../constants'
import type { BlogPost } from '../types'

export const Route = createFileRoute('/blog/')({
  loader: async () => {
    try {
      const posts = await getBlogPosts()
      return { posts: posts || [] }
    } catch (err) {
      console.error('Error loading blog posts:', err)
      return { posts: [] }
    }
  },
  head: () => ({
    meta: [
      { title: 'Fashion Journal & Styling Guides — Sri Subhakari Fashions' },
      {
        name: 'description',
        content:
          'Explore Sri Subhakari Fashion Journal for expert saree draping tutorials, silk fabric care guides, festive trend reports, and bridal styling inspiration.',
      },
      { property: 'og:title', content: 'Fashion Journal & Styling Guides — Sri Subhakari Fashions' },
      { property: 'og:type', content: 'website' },
    ],
  }),
  component: BlogIndexPage,
})

const CATEGORIES = [
  'All',
  'Saree Styling',
  'Fabric Care',
  'Festive Trends',
  'Bridal Guides',
  'Handloom Heritage',
]

function BlogIndexPage() {
  const { posts } = Route.useLoaderData()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post: BlogPost) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        post.category.toLowerCase() === selectedCategory.toLowerCase() ||
        post.tags.some((t) => t.toLowerCase() === selectedCategory.toLowerCase())

      const matchesSearch =
        !searchQuery.trim() ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesCategory && matchesSearch
    })
  }, [posts, selectedCategory, searchQuery])

  // Featured post
  const featuredPost = useMemo(() => {
    return posts.find((p: BlogPost) => p.featured) || posts[0]
  }, [posts])

  return (
    <div className="min-h-screen bg-[#140618] text-white">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-pink-500/15">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-pink-600/15 blur-[120px]" />
          <div className="absolute top-20 right-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-[120px]" />
        </div>

        <div className="container-brand px-4 sm:px-6 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-pink-300/80 mb-6">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight size={12} />
            <span className="text-white font-medium">Fashion Journal</span>
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-semibold tracking-wider uppercase mb-4 backdrop-blur-md">
              <Sparkles size={14} className="text-amber-300" />
              Sri Subhakari Style Journal
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Saree Styling, Heritage &amp;{' '}
              <span className="bg-gradient-to-r from-pink-300 via-rose-300 to-amber-200 bg-clip-text text-transparent">
                Festive Trends
              </span>
            </h1>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl mb-8">
              Expert draping tutorials, fabric preservation secrets, and bridal style guides curated by
              our master weavers and stylists.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-lg">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300/70"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tutorials, Kanjivaram care, blouse designs..."
                className="w-full bg-[#240b2a]/90 border border-pink-500/30 rounded-full pl-11 pr-5 py-3.5 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-500/20 backdrop-blur-md transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-pink-300 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container-brand px-4 sm:px-6 py-12 md:py-16">
        {/* Featured Article Card (shown when no search query is active) */}
        {!searchQuery && selectedCategory === 'All' && featuredPost && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xs font-bold tracking-widest text-amber-300 uppercase">
                ★ Editor&apos;s Highlight
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-amber-400/40 to-transparent" />
            </div>

            <Link
              to="/blog/$slug"
              params={{ slug: featuredPost.slug }}
              className="group block relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#2a0e32] to-[#1a0720] border border-pink-500/25 shadow-2xl hover:border-pink-500/50 transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Image Column */}
                <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-96 overflow-hidden">
                  <img
                    src={featuredPost.featured_image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a0720] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#2a0e32]" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#1a0720]/80 backdrop-blur-md border border-pink-500/40 text-pink-200 text-xs font-semibold">
                    {featuredPost.category}
                  </span>
                </div>

                {/* Content Column */}
                <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-xs text-pink-200/70 mb-3">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-amber-400" />
                      {new Date(featuredPost.published_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-pink-400" />
                      {featuredPost.read_time_minutes} min read
                    </span>
                  </div>

                  <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-white group-hover:text-pink-200 transition-colors leading-snug mb-3">
                    {featuredPost.title}
                  </h2>

                  <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-pink-500/20">
                    <div className="flex items-center gap-2.5">
                      {featuredPost.author.avatar && (
                        <img
                          src={featuredPost.author.avatar}
                          alt={featuredPost.author.name}
                          className="w-8 h-8 rounded-full object-cover border border-pink-400/40"
                        />
                      )}
                      <div>
                        <p className="text-xs font-bold text-white">
                          {featuredPost.author.name}
                        </p>
                        <p className="text-[10px] text-pink-300/80">
                          {featuredPost.author.role}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
                      Read Full Guide
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-lg shadow-pink-600/30'
                    : 'bg-[#220928] text-gray-300 hover:text-white hover:bg-[#2e0e36] border border-pink-500/20'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Articles Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredPosts.map((post: BlogPost, idx: number) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                >
                  <Link
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="group flex flex-col h-full rounded-2xl bg-[#210a28]/80 border border-pink-500/20 overflow-hidden hover:border-pink-500/50 hover:shadow-xl hover:shadow-pink-900/20 transition-all duration-300"
                  >
                    {/* Cover Image */}
                    <div className="relative h-52 overflow-hidden bg-black/40">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#210a28] via-transparent to-transparent opacity-80" />
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#18051e]/85 backdrop-blur-md border border-pink-500/30 text-pink-200 text-[11px] font-semibold">
                        {post.category}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 text-xs text-pink-200/70 mb-2.5">
                        <span>
                          {new Date(post.published_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {post.read_time_minutes} min
                        </span>
                      </div>

                      <h3 className="font-heading text-lg font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-2 mb-2.5">
                        {post.title}
                      </h3>

                      <p className="text-gray-300 text-xs leading-relaxed line-clamp-3 mb-4 flex-1">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex items-center gap-1.5 flex-wrap mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] text-pink-300/80 bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/15"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-pink-500/15 text-xs">
                        <span className="text-gray-300 font-medium truncate">
                          By {post.author.name}
                        </span>
                        <span className="text-amber-300 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Read <ArrowRight size={13} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-16 bg-[#210a28]/40 rounded-2xl border border-pink-500/20">
            <BookOpen size={40} className="mx-auto text-pink-400 mb-3 opacity-60" />
            <h3 className="font-heading text-lg font-bold text-white mb-1">
              No matching articles found
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Try adjusting your search terms or exploring all categories.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All')
                setSearchQuery('')
              }}
              className="px-4 py-2 rounded-full bg-pink-600 text-white text-xs font-semibold hover:bg-pink-500 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* WhatsApp Styling Consultation Banner */}
        <div className="mt-20 rounded-2xl p-8 sm:p-10 bg-gradient-to-r from-[#2e0c38] via-[#240a2c] to-[#19041e] border border-pink-500/30 relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-80 h-80 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-xs font-bold uppercase mb-3">
              <MessageCircle size={14} />
              Personalized Styling Assistance
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Need Personal Saree or Bridal Styling Advice?
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Chat directly with our master stylists at Sri Subhakari Fashions on WhatsApp for custom
              draping tips, matching blouse ideas, and bridal trousseau selections.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                'Hello Sri Subhakari Fashions, I would like personal saree styling and bridal advice.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold shadow-lg shadow-green-600/30 transition-all hover:scale-105"
            >
              <MessageCircle size={18} />
              Chat with Our Stylists on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
