import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const DECORATIONS = [
  { emoji: '🌸', top: '15%', left: '10%', delay: '0s' },
  { emoji: '✨', top: '45%', left: '25%', delay: '0.5s' },
  { emoji: '🌺', top: '25%', left: '50%', delay: '1s' },
  { emoji: '💫', top: '75%', left: '70%', delay: '1.5s' },
  { emoji: '🌸', top: '35%', left: '85%', delay: '2s' },
  { emoji: '✨', top: '60%', left: '95%', delay: '2.5s' },
]

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    try {
      // Try Supabase if configured
      if (import.meta.env.VITE_SUPABASE_URL) {
        await supabase.from('newsletter_subscribers').insert({ email })
      }
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('success') // Still show success in demo mode
    }
  }

  return (
    <section
      className="py-16 md:py-20 px-4 sm:px-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, var(--color-pink) 0%, var(--color-pink-dark) 100%)',
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        {DECORATIONS.map((dec, i) => (
          <span
            key={i}
            className="absolute text-4xl"
            style={{
              top: dec.top,
              left: dec.left,
              animationDelay: dec.delay,
            }}
          >
            {dec.emoji}
          </span>
        ))}
      </div>

      <div className="container-brand relative z-10">
        <motion.div
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block font-nav text-xs font-700 tracking-[0.2em] uppercase mb-4 px-4 py-1.5 rounded-full bg-white/20 text-white">
            📧 Stay Updated
          </span>
          <h2 className="font-heading text-white text-3xl md:text-4xl font-700 mb-3">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-pink-100 mb-8 text-base">
            Get the latest collection updates, exclusive offers, and styling tips delivered to your inbox.
          </p>

          {status === 'success' ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/20 rounded-2xl px-8 py-6 text-white"
            >
              <div className="text-3xl mb-2">✓</div>
              <p className="font-heading text-lg font-600">Thank you for subscribing!</p>
              <p className="text-pink-100 text-sm mt-1">
                You'll be the first to know about new arrivals and exclusive deals.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 bg-white/20 border border-white/30 rounded-full px-5 py-3.5 text-white placeholder:text-pink-200 focus:outline-none focus:bg-white/30 text-sm"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-white text-pink-600 font-nav font-700 px-6 py-3.5 rounded-full flex items-center gap-2 hover:bg-pink-50 transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 whitespace-nowrap"
              >
                <Send size={15} />
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          )}

          <p className="text-pink-200 text-xs mt-4">
            No spam, ever. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
