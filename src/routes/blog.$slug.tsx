import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import {
  Calendar,
  Clock,
  ChevronRight,
  Share2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Tag,
  CheckCircle2,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react'
import { FaWhatsapp, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa'
import { getBlogPostBySlug } from '../server/functions/blogs'
import { WHATSAPP_NUMBER, SITE_NAME } from '../constants'
import { DEMO_PRODUCTS } from '../types'
import type { BlogPost, Product } from '../types'

export const Route = createFileRoute('/blog/$slug')({
  loader: async ({ params }) => {
    try {
      const data = await getBlogPostBySlug({ data: params.slug })
      if (!data || !data.post) {
        throw notFound()
      }

      // Fetch related products for "Shop The Look"
      const relatedProductIds = data.post.related_product_ids || []
      const relatedProducts: Product[] = DEMO_PRODUCTS.filter((p) =>
        relatedProductIds.includes(p.id)
      )

      return {
        post: data.post,
        relatedPosts: data.relatedPosts || [],
        relatedProducts,
      }
    } catch (err) {
      console.error('Error loading blog post:', err)
      throw notFound()
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData?.post) {
      return {
        meta: [{ title: 'Article Not Found — Sri Subhakari Fashions' }],
      }
    }
    const post = loaderData.post as BlogPost
    return {
      meta: [
        { title: `${post.title} — Sri Subhakari Fashions` },
        { name: 'description', content: post.excerpt },
        { property: 'og:title', content: post.title },
        { property: 'og:description', content: post.excerpt },
        { property: 'og:image', content: post.featured_image },
        { property: 'og:type', content: 'article' },
      ],
    }
  },
  component: BlogPostDetailPage,
})

function BlogPostDetailPage() {
  const { post, relatedPosts, relatedProducts } = Route.useLoaderData()

  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareText = encodeURIComponent(
    `Read "${post.title}" on Sri Subhakari Fashions: ${currentUrl}`
  )

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(currentUrl)
      alert('Article link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-[#140618] text-white">
      {/* Hero Cover & Article Header */}
      <section className="relative pt-8 pb-12 md:pt-14 md:pb-18 border-b border-pink-500/15 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none">
          <div className="absolute top-10 left-1/3 w-80 h-80 rounded-full bg-pink-600/15 blur-[120px]" />
          <div className="absolute top-20 right-1/3 w-80 h-80 rounded-full bg-amber-500/10 blur-[120px]" />
        </div>

        <div className="container-brand px-4 sm:px-6 relative z-10">
          {/* Back to Blog & Breadcrumbs */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-pink-300 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              Back to All Articles
            </Link>

            <div className="flex items-center gap-2 text-xs text-pink-300/80">
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight size={12} />
              <Link to="/blog" className="hover:text-white transition-colors">
                Journal
              </Link>
              <ChevronRight size={12} />
              <span className="text-white font-medium truncate max-w-[200px]">
                {post.category}
              </span>
            </div>
          </div>

          <div className="max-w-4xl mx-auto text-center">
            {/* Category Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-200 text-xs font-bold tracking-wider uppercase mb-5">
              <Sparkles size={13} className="text-amber-300" />
              {post.category}
            </div>

            {/* Title */}
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
              {post.title}
            </h1>

            {/* Author & Meta Bar */}
            <div className="flex items-center justify-center flex-wrap gap-6 text-xs text-pink-200/80 mb-8 pb-6 border-b border-pink-500/20">
              <div className="flex items-center gap-2.5">
                {post.author.avatar && (
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-9 h-9 rounded-full object-cover border border-pink-400/40"
                  />
                )}
                <div className="text-left">
                  <p className="font-bold text-white text-sm leading-tight">
                    {post.author.name}
                  </p>
                  <p className="text-[11px] text-pink-300/80">
                    {post.author.role}
                  </p>
                </div>
              </div>

              <span className="hidden sm:inline text-pink-500">•</span>

              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-amber-400" />
                {new Date(post.published_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>

              <span className="hidden sm:inline text-pink-500">•</span>

              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-pink-400" />
                {post.read_time_minutes} min read
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <div className="container-brand px-4 sm:px-6 -mt-6 sm:-mt-10 relative z-20 max-w-4xl mx-auto">
        <div className="rounded-2xl overflow-hidden shadow-2xl border border-pink-500/30 aspect-[16/9] bg-black/40">
          <img
            src={post.featured_image}
            alt={post.title}
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      {/* Main Content Layout */}
      <main className="container-brand px-4 sm:px-6 py-12 md:py-16 max-w-4xl mx-auto">
        {/* Article Excerpt Callout */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#2c0c34] to-[#1c0622] border-l-4 border-l-amber-400 border border-pink-500/20 mb-10 text-gray-200 text-base sm:text-lg leading-relaxed italic">
          &ldquo;{post.excerpt}&rdquo;
        </div>

        {/* Article Body Content */}
        <article className="prose prose-invert prose-pink max-w-none prose-headings:font-heading prose-headings:text-white prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-base sm:prose-p:text-lg prose-a:text-pink-400 prose-strong:text-white prose-blockquote:border-pink-500 prose-blockquote:bg-pink-950/20 prose-blockquote:p-4 prose-blockquote:rounded-xl">
          {post.content.split('\n\n').map((paragraph: string, idx: number) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={idx} className="font-heading text-xl sm:text-2xl font-bold text-amber-200 mt-8 mb-4">
                  {paragraph.replace('### ', '')}
                </h3>
              )
            }
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={idx} className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-10 mb-4 border-b border-pink-500/20 pb-2">
                  {paragraph.replace('## ', '')}
                </h2>
              )
            }
            if (paragraph.startsWith('> [!TIP]') || paragraph.startsWith('> [!IMPORTANT]')) {
              return (
                <div
                  key={idx}
                  className="p-5 my-6 rounded-xl bg-[#280a30] border border-amber-400/30 text-amber-200 text-sm leading-relaxed"
                >
                  <p className="font-semibold">{paragraph.replace(/> \[[!A-Z]+\]\n/, '')}</p>
                </div>
              )
            }
            if (paragraph.startsWith('---')) {
              return <hr key={idx} className="my-8 border-pink-500/20" />
            }
            return (
              <p key={idx} className="text-gray-300 text-base sm:text-lg leading-relaxed mb-5">
                {paragraph}
              </p>
            )
          })}
        </article>

        {/* Tags & Social Share Bar */}
        <div className="mt-12 pt-8 border-t border-pink-500/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <Tag size={15} className="text-pink-400" />
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-pink-500/15 border border-pink-500/30 text-pink-200"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Social Share Buttons */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Share2 size={13} />
              Share:
            </span>

            <a
              href={`https://wa.me/?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:scale-110 transition-transform"
              aria-label="Share on WhatsApp"
            >
              <FaWhatsapp size={15} />
            </a>

            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white hover:scale-110 transition-transform"
              aria-label="Share on Facebook"
            >
              <FaFacebook size={14} />
            </a>

            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white hover:scale-110 transition-transform"
              aria-label="Share on Twitter"
            >
              <FaTwitter size={14} />
            </a>

            <button
              onClick={handleCopyLink}
              className="px-3 py-1 rounded-full bg-[#240b2a] border border-pink-500/30 text-xs font-semibold text-pink-200 hover:bg-pink-500/20 transition-colors"
            >
              Copy Link
            </button>
          </div>
        </div>

        {/* "Shop The Look" / Featured Products in Article */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-pink-500/20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-300 mb-1">
                  <ShoppingBag size={14} />
                  Featured in this Guide
                </div>
                <h3 className="font-heading text-2xl font-bold text-white">
                  Shop The Look
                </h3>
              </div>
              <Link
                to="/shop"
                className="text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1"
              >
                Browse All Sarees <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedProducts.map((prod: Product) => (
                <div
                  key={prod.id}
                  className="rounded-2xl p-4 bg-[#210928]/90 border border-pink-500/25 flex gap-4 items-center group hover:border-pink-500/50 transition-all shadow-lg"
                >
                  <div className="w-24 h-28 rounded-xl overflow-hidden bg-black/40 shrink-0">
                    <img
                      src={prod.images?.[0] || prod.image_url || '/images/default.jpg'}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                      {typeof prod.category === 'object' && prod.category?.name
                        ? prod.category.name
                        : 'Pure Silk'}
                    </span>
                    <h4 className="font-heading text-sm font-bold text-white truncate mb-1">
                      {prod.name}
                    </h4>
                    <p className="text-pink-300 font-extrabold text-sm mb-3">
                      ₹{prod.offer_price?.toLocaleString('en-IN') || prod.price.toLocaleString('en-IN')}
                    </p>

                    <div className="flex items-center gap-2">
                      <Link
                        to="/shop/$slug"
                        params={{ slug: prod.slug }}
                        className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition-colors"
                      >
                        View Saree
                      </Link>
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                          `Hello Sri Subhakari Fashions, I am reading the article "${post.title}" and would like to order/enquire about ${prod.name}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-[#25D366]/20 border border-green-500/40 text-green-300 hover:bg-[#25D366] hover:text-white transition-all"
                        aria-label="WhatsApp enquiry"
                      >
                        <FaWhatsapp size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="mt-20 pt-10 border-t border-pink-500/20">
            <h3 className="font-heading text-2xl font-bold text-white mb-8">
              More Style Guides &amp; Tutorials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedPosts.map((rel: BlogPost) => (
                <Link
                  key={rel.id}
                  to="/blog/$slug"
                  params={{ slug: rel.slug }}
                  className="group rounded-xl overflow-hidden bg-[#210928]/80 border border-pink-500/20 hover:border-pink-500/50 transition-all flex flex-col"
                >
                  <div className="h-40 overflow-hidden bg-black/40">
                    <img
                      src={rel.featured_image}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-pink-300 uppercase">
                        {rel.category}
                      </span>
                      <h4 className="font-heading text-sm font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-2 mt-1">
                        {rel.title}
                      </h4>
                    </div>
                    <span className="text-amber-300 text-xs font-bold flex items-center gap-1 mt-4 group-hover:translate-x-1 transition-transform">
                      Read Guide <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
