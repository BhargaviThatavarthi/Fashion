import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { STATIC_CATEGORIES } from '../../constants/categories'

export default function ShopByCategory() {
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
          <span className="section-badge">Browse by Category</span>
          <h2 className="section-heading">Shop by Category</h2>
          <p className="section-subtitle mt-2 max-w-md mx-auto">
            Explore our curated collections across all 8 traditional and modern ethnic wear categories.
          </p>
          <div className="gold-divider" />
        </motion.div>

        {/* 8-Category Grid: 2 columns on mobile, 4 columns on sm/md/lg */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {STATIC_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                to="/shop"
                search={{ category: cat.slug }}
                className="group block"
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-md group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-1.5 cursor-pointer border border-pink-100/80 bg-slate-900">
                  {/* Static Category Display Photo */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 group-hover:from-black/95 transition-all duration-300" />

                  {/* Content */}
                  <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end z-10">

                    <div>
                      <h3 className="font-heading font-bold text-white text-base sm:text-lg leading-snug drop-shadow-sm group-hover:text-amber-300 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-[11px] text-pink-200/90 line-clamp-1 mt-0.5 font-sans">
                        {cat.subtitle}
                      </p>
                      <div className="mt-2 text-xs font-semibold text-pink-300 flex items-center gap-1 opacity-90 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                        Explore Collection &rarr;
                      </div>
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
