import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { DEMO_CATEGORIES } from '../../constants'

const CATEGORY_COLORS = [
  'from-rose-100 to-pink-200',
  'from-amber-100 to-yellow-200',
  'from-sky-100 to-blue-200',
  'from-emerald-100 to-green-200',
  'from-violet-100 to-purple-200',
  'from-orange-100 to-amber-200',
  'from-teal-100 to-cyan-200',
  'from-pink-100 to-rose-200',
]

const CATEGORY_EMOJIS: Record<string, string> = {
  'sarees': '🥻',
  'silk-sarees': '✨',
  'cotton-sarees': '🌿',
  'designer-sarees': '💎',
  'lehengas': '👗',
  'kurtis': '👘',
  'dress-materials': '🧵',
  'ethnic-wear': '🌸',
}

export default function ShopByCategory() {
  const categories = DEMO_CATEGORIES.slice(0, 8)

  return (
    <section className="py-12 md:py-16 px-4 sm:px-6" style={{ background: '#FFFFFF' }}>
      <div className="container-brand">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-badge">🛍️ Browse by Category</span>
          <h2 className="section-heading">Shop by Category</h2>
          <p className="section-subtitle mt-2 max-w-md mx-auto">
            Explore our curated collections across all categories of traditional and modern ethnic wear.
          </p>
          <div className="gold-divider" />
        </motion.div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <Link
                to="/shop"
                search={{ category: cat.slug }}
                className="group block"
              >
                <div
                  className={`relative bg-gradient-to-br ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]} rounded-2xl p-6 text-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl cursor-pointer overflow-hidden`}
                >
                  {/* Background shimmer on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(135deg, var(--color-pink), var(--color-gold))' }}
                  />

                  <div className="relative z-10">
                    <div className="text-4xl mb-3">
                      {CATEGORY_EMOJIS[cat.slug] || '🌸'}
                    </div>
                    <h3 className="font-heading font-600 text-gray-800 text-base leading-tight group-hover:text-pink-700 transition-colors">
                      {cat.name}
                    </h3>
                    <div className="mt-2 text-xs font-nav font-600 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-200"
                      style={{ color: 'var(--color-pink)' }}
                    >
                      Explore →
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
