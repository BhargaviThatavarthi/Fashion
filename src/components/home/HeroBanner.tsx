import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { ChevronDown, Layers, ShieldCheck, Star, Heart, ArrowRight } from 'lucide-react'

// Canvas overlay rendering interactive galaxy particles & shimmering stars over background video image
function GalaxyVideoCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Cosmic star particles
    const particles = Array.from({ length: 85 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.8 + 0.6,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: -Math.random() * 0.45 - 0.1,
      opacity: Math.random(),
      fadeSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      color:
        Math.random() > 0.4
          ? 'rgba(255, 215, 245,'
          : Math.random() > 0.5
            ? 'rgba(251, 191, 36,'
            : 'rgba(192, 132, 252,',
    }))

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      particles.forEach((p) => {
        p.x += p.speedX
        p.y += p.speedY
        p.opacity += p.fadeSpeed

        if (p.opacity >= 0.95 || p.opacity <= 0.1) {
          p.fadeSpeed = -p.fadeSpeed
        }

        if (p.y < 0) {
          p.y = height
          p.x = Math.random() * width
        }

        ctx.fillStyle = `${p.color} ${Math.max(0.1, Math.min(1, p.opacity))})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10 w-full h-full"
    />
  )
}

export interface HeroBannerData {
  brandTitle?: string
  brandSubtitle?: string
  headline?: string
  subheadline?: string
  features?: string[]
  description?: string
  buttonText?: string
  buttonLink?: string
  heroImageUrl?: string
  heroVideoUrl?: string
  stats?: Array<{
    num: string
    label: string
  }>
}

export const DEFAULT_HERO_BANNER: HeroBannerData = {
  brandTitle: 'Sri Subhakari Fashions',
  brandSubtitle: 'Exclusive Boutique Collection',
  headline: 'ELEGANCE',
  subheadline: 'IN EVERY THREAD',
  features: ['Pure Fabrics', 'Artisan Craftsmanship', 'Timeless Elegance'],
  description:
    'Discover our exclusive handloom silk sarees, royal bridal lehengas, and contemporary festive wear handcrafted by master weavers.',
  buttonText: 'Explore Collection',
  buttonLink: '/shop',
  heroImageUrl: '/images/hero-fashion-model.png',
  heroVideoUrl: '/videos/hero-background.mp4',
  stats: [
    { num: '1000+', label: 'Happy Customers' },
    { num: '100%', label: 'Pure Handloom' },
    { num: '4.8 ★', label: 'Customer Rating' },
  ],
}

const STAT_ICONS = [Star, Layers, ShieldCheck]

export default function HeroBanner() {
  const [data] = useState<HeroBannerData>(DEFAULT_HERO_BANNER)

  const {
    brandTitle = DEFAULT_HERO_BANNER.brandTitle,
    brandSubtitle = DEFAULT_HERO_BANNER.brandSubtitle,
    headline = DEFAULT_HERO_BANNER.headline,
    subheadline = DEFAULT_HERO_BANNER.subheadline,
    features = DEFAULT_HERO_BANNER.features,
    description = DEFAULT_HERO_BANNER.description,
    buttonText = DEFAULT_HERO_BANNER.buttonText,
    buttonLink = DEFAULT_HERO_BANNER.buttonLink,
    heroImageUrl = DEFAULT_HERO_BANNER.heroImageUrl,
    heroVideoUrl = DEFAULT_HERO_BANNER.heroVideoUrl,
    stats = DEFAULT_HERO_BANNER.stats,
  } = data

  return (
    <section className="relative min-h-[90vh] md:min-h-[92vh] flex items-center overflow-hidden py-12 bg-slate-950 text-white">
      {/* Background Layer: Deep Cosmic Base */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-slate-950" />
      </div>

      {/* Side Background Video (Fills the entire right half as atmospheric background video) */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[55%] xl:w-[52%] z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center opacity-90 scale-105"
        >
          <source src={heroVideoUrl || '/videos/hero-background.mp4'} type="video/mp4" />
          <source src="/videos/Dress_morphs_into_starry_night_202608121948.mp4" type="video/mp4" />
        </video>

        {/* Ambient Dark Gradient Overlays: Seamlessly blend the video into the dark background */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950 z-10" />

        {/* Glowing Radial Color Accent */}
        <div
          className="absolute top-1/2 right-[20%] -translate-y-1/2 w-[550px] h-[550px] rounded-full opacity-35 pointer-events-none mix-blend-screen z-10"
          style={{
            background: 'radial-gradient(circle, #ec4899 0%, #8b5cf6 40%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      {/* Sparkling Particle Field */}
      <GalaxyVideoCanvas />

      {/* Hero Content Container (Seamless text over cosmic background with side video) */}
      <div className="container-brand relative z-20 px-4 sm:px-6 w-full max-w-7xl mx-auto py-6">
        <div className="max-w-2xl">
          <motion.div
            className="relative flex flex-col items-center text-center"
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >

            {/* Main Title: Brand Title (Calligraphy Script Style) */}
            <motion.h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-calligraphy capitalize mb-1 whitespace-nowrap drop-shadow-[0_4px_15px_rgba(244,114,182,0.4)]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-100 via-rose-200 to-pink-100">
                {brandTitle}
              </span>
            </motion.h1>

            {/* Sub-heading down below Brand Title: Brand Subtitle */}
            <motion.div
              className="flex items-center justify-center gap-2 text-pink-300 font-serif italic text-2xl sm:text-3xl font-medium mb-3 tracking-wide"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              <span>{brandSubtitle}</span>
              <Heart className="w-5 h-5 text-rose-400 fill-rose-400/30 animate-pulse" />
            </motion.div>

            {/* Main Headline */}
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold tracking-wider leading-none uppercase mb-1 text-transparent bg-clip-text bg-gradient-to-r from-pink-100 via-rose-200 to-amber-100"
              style={{
                filter: 'drop-shadow(0px 4px 15px rgba(244,114,182,0.35))',
              }}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              {headline}
            </motion.h2>

            {/* Sub-headline */}
            <motion.div
              className="font-sans font-extrabold text-sm sm:text-base md:text-lg tracking-[0.35em] uppercase text-pink-200 mb-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              {subheadline}
            </motion.div>

            {/* Ornate Flourish Divider 1 */}
            <motion.div
              className="flex items-center justify-center gap-3 w-full max-w-sm my-2 text-pink-400/80"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-pink-400/60" />
              <span className="text-sm font-serif text-amber-300">❦</span>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-pink-400/60" />
            </motion.div>

            {/* Feature Tag Bar */}
            {features && features.length > 0 && (
              <motion.div
                className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium text-pink-100/90 my-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                {features.map((feat, idx) => (
                  <span key={idx} className="flex items-center gap-2 sm:gap-4">
                    {idx > 0 && <span className="text-amber-400/70 font-light">|</span>}
                    <span>{feat}</span>
                  </span>
                ))}
              </motion.div>
            )}

            {/* Ornate Flourish Divider 2 */}
            <motion.div
              className="flex items-center justify-center gap-3 w-full max-w-sm my-2 text-pink-400/80"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
            >
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-pink-400/60" />
              <span className="text-xs font-serif text-amber-300">❦</span>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-pink-400/60" />
            </motion.div>

            {/* Body Copy Paragraph */}
            <motion.p
              className="text-gray-200 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl my-3 font-light"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              {description}
            </motion.p>

            {/* Stylish Pill CTA Button */}
            <motion.div
              className="flex justify-center items-center my-5 w-full sm:w-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
            >
              <Link to={buttonLink || '/shop'} className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-10 py-3.5 rounded-full font-bold text-white uppercase tracking-wider bg-gradient-to-r from-pink-600 via-rose-600 to-pink-500 hover:from-pink-500 hover:to-rose-500 flex items-center justify-center gap-2.5 shadow-lg shadow-pink-600/40 hover:shadow-pink-500/60 hover:scale-105 active:scale-95 transition-all duration-300 border border-pink-300/40 text-sm sm:text-base cursor-pointer">
                  <span>{buttonText}</span>
                  <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center shrink-0">
                    <ArrowRight size={14} className="text-white" />
                  </div>
                </button>
              </Link>
            </motion.div>

            {/* Trust Badges Bar */}
            {stats && stats.length > 0 && (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 w-full mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.75 }}
              >
                {stats.map((stat, idx) => {
                  const IconComponent = STAT_ICONS[idx % STAT_ICONS.length]
                  return (
                    <div
                      key={stat.label}
                      className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-md hover:bg-white/10 transition-colors"
                    >
                      <IconComponent className="w-4 h-4 text-amber-400 shrink-0" />
                      <div className="text-left">
                        <div className="text-sm sm:text-base font-bold font-heading text-pink-300 leading-none">
                          {stat.num}
                        </div>
                        <div className="text-[10px] text-gray-300 font-medium mt-0.5">{stat.label}</div>
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Down Scroll Arrow */}
      <motion.div
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 text-pink-400"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown size={28} />
      </motion.div>
    </section>
  )
}

