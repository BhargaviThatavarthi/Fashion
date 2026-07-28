import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { FaWhatsapp } from 'react-icons/fa'
import { ChevronDown } from 'lucide-react'
import { CONTACT } from '../../constants'

export default function HeroBanner() {
  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      style={{
        background: '#FFFFFF',
      }}
    >
      {/* Background decorative blobs */}
      <div
        className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-25 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--color-pink) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, var(--color-gold) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="container-brand px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-12 md:py-20">
          {/* Left — Text Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="section-badge">✨ Premium Ethnic Wear</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              className="section-heading mt-2 mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Elegance in{' '}
              <span
                className="italic relative"
                style={{
                  background: 'linear-gradient(135deg, var(--color-pink), var(--color-gold))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Every Thread
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="section-subtitle mb-8 max-w-lg mx-auto lg:mx-0 text-base md:text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              Discover beautiful sarees and ethnic wear crafted with elegance and tradition.
              Each piece tells a story of artistry, culture, and timeless beauty.
            </motion.p>

            {/* Gold divider */}
            <motion.div
              className="gold-divider lg:mx-0 mb-8"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            />

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
            >
              <Link to="/shop">
                <button className="btn-pink px-8 py-3.5 text-base w-full sm:w-auto">
                  Shop Collection
                </button>
              </Link>
              <a
                href={`https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="btn-whatsapp px-8 py-3.5 text-base flex items-center gap-2 w-full sm:w-auto justify-center">
                  <FaWhatsapp size={18} />
                  Enquire on WhatsApp
                </button>
              </a>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              className="mt-10 flex items-center gap-6 justify-center lg:justify-start flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.75 }}
            >
              {[
                { num: '5000+', label: 'Happy Customers' },
                { num: '200+', label: 'Designs' },
                { num: '10+', label: 'Years of Trust' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div
                    className="font-heading text-2xl font-700"
                    style={{ color: 'var(--color-pink)' }}
                  >
                    {stat.num}
                  </div>
                  <div className="font-body text-xs text-gray-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Hero Visual */}
          <div className="relative flex justify-center items-center">
            {/* Main floating image container */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
            >
              {/* Decorative glow background */}
              <div
                className="absolute inset-0 rounded-2xl opacity-15 scale-105"
                style={{
                  background: 'linear-gradient(135deg, var(--color-pink), var(--color-gold))',
                  filter: 'blur(20px)',
                }}
              />

              {/* Main image with floating animation */}
              <motion.div
                className="relative z-10 rounded-2xl overflow-hidden"
                style={{
                  width: 'clamp(260px, 45vw, 480px)',
                  height: 'clamp(320px, 55vw, 580px)',
                  boxShadow: '0 30px 80px rgba(216,92,138,0.15), 0 10px 30px rgba(0,0,0,0.08)',
                  border: '1px solid #f0e0e8',
                  background: '#FFFFFF',
                }}
                animate={{ y: [0, -16, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <img
                  src="https://kmxsgomxxhwpmoayeqmj.supabase.co/storage/v1/object/public/products/hero-subhakari.jpg"
                  alt="Beautiful Indian saree model"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback gradient if image fails
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      parent.style.background = 'linear-gradient(135deg, var(--color-pink-light), var(--color-pink))'
                    }
                  }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown size={24} style={{ color: 'var(--color-pink)' }} />
      </motion.div>
    </section>
  )
}
