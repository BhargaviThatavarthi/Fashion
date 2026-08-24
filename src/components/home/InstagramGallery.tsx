import { motion } from 'framer-motion'
import { Instagram } from 'lucide-react'
import { SOCIAL } from '../../constants'

// Using placeholder colors for demo Instagram grid
const IG_COLORS = [
  'from-rose-300 to-pink-400',
  'from-amber-300 to-orange-400',
  'from-purple-300 to-pink-400',
  'from-teal-300 to-cyan-400',
  'from-yellow-300 to-amber-400',
  'from-rose-400 to-red-400',
]
const IG_EMOJIS = ['🥻', '✨', '💎', '🌸', '👗', '🌺']

export default function InstagramGallery() {
  return (
    <section className="py-12 md:py-16 px-4 sm:px-6" style={{ background: 'var(--color-bg)' }}>
      <div className="container-brand">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-badge">Instagram Gallery</span>
          <h2 className="section-heading">Follow Us on Instagram</h2>
          <p className="section-subtitle mt-2 max-w-md mx-auto">
            Get inspired! Follow <strong>@srisubhakarifashions</strong> for daily looks,
            saree styling tips, and behind-the-scenes peeks.
          </p>
          <div className="gold-divider" />
        </motion.div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-8">
          {IG_COLORS.map((color, i) => (
            <motion.a
              key={i}
              href={SOCIAL.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className={`w-full h-full bg-gradient-to-br ${color} flex items-center justify-center text-4xl`}>
                {IG_EMOJIS[i]}
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Instagram size={22} className="text-white" />
              </div>
            </motion.a>
          ))}
        </div>

        {/* Follow Button */}
        <div className="text-center">
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-nav font-700 text-white px-8 py-3.5 rounded-full transition-all hover:scale-105 hover:shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
              boxShadow: '0 4px 20px rgba(253, 29, 29, 0.3)',
            }}
          >
            <Instagram size={18} />
            Follow @srisubhakarifashions
          </a>
        </div>
      </div>
    </section>
  )
}
