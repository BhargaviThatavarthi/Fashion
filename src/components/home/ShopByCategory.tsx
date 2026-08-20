import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { DEMO_CATEGORIES } from '../../constants'



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

const CATEGORY_IMAGES: Record<string, string> = {
  'sarees': '/images/silk-saree.png',
  'silk-sarees': '/images/silk-saree.png',
  'cotton-sarees': '/images/cotton-saree.png',
  'designer-sarees': '/images/designer-saree.png',
  'lehengas': '/images/designer-saree.png',
  'kurtis': '/images/ethnic-top.png',
  'dress-materials': '/images/crape-saree.png',
  'ethnic-wear': '/images/crape-saree.png',
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {categories.map((cat, i) => {
            const bgImage = CATEGORY_IMAGES[cat.slug] || '/images/silk-saree.png'
            return (
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
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-1 cursor-pointer border border-pink-100">
                    {/* Category Photo */}
                    <img
                      src={bgImage}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 transition-all duration-300" />

                    {/* Content */}
                    <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                      <div className="flex justify-end">
                        <span className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-lg text-white shadow-sm">
                          {CATEGORY_EMOJIS[cat.slug] || '🌸'}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-heading font-bold text-white text-lg sm:text-xl leading-snug drop-shadow-sm group-hover:text-amber-300 transition-colors">
                          {cat.name}
                        </h3>
                        <div className="mt-1 text-xs font-semibold text-pink-200 flex items-center gap-1 opacity-90 group-hover:opacity-100">
                          Explore Collection &rarr;
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
