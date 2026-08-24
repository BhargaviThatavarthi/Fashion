import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { CoverflowCarousel, type CoverflowSlide } from '@/components/ui/coverflow-carousel'
import { STATIC_CATEGORIES } from '../../constants/categories'
import { ArrowRight } from 'lucide-react'

export default function CategoryQuickNav() {
  const slides: CoverflowSlide[] = STATIC_CATEGORIES.map((cat) => ({
    src: cat.image,
    alt: `${cat.name} Collection`,
    title: cat.name,
    subtitle: cat.subtitle,
    link: `/shop?category=${encodeURIComponent(cat.slug)}`,
    buttonLabel: `Explore ${cat.name}`,
  }))

  return (
    <section className="bg-white border-y border-slate-100 py-10 md:py-14 select-none relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        {/* Section Header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-badge">BROWSE BY CATEGORY</span>
          <h2 className="section-heading mt-2">Shop by Category</h2>
          <p className="section-subtitle mt-2 max-w-md mx-auto">
            Explore our curated collections across all 8 traditional and modern ethnic wear categories.
          </p>
          <div className="gold-divider" />
        </motion.div>

        {/* 3D Coverflow Carousel Section */}
        <div className="w-full">
          <CoverflowCarousel
            slides={slides}
            cardWidth="clamp(170px, 25vw, 280px)"
            autoplay={true}
            autoplayInterval={3500}
            showCaption={true}
            showNavigation={true}
            showPagination={true}
          />
        </div>

        {/* Direct 1-Click Category Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs font-nav font-bold text-center text-gray-400 uppercase tracking-widest mb-4">
            Click any category to open and view its products:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 max-w-4xl mx-auto">
            {STATIC_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to="/shop"
                search={{ category: cat.slug }}
                className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-pink-200/70 bg-pink-50/50 hover:bg-gradient-to-r hover:from-pink-600 hover:to-rose-600 hover:border-pink-500 hover:text-white transition-all duration-200 text-xs sm:text-sm font-semibold text-gray-800 shadow-xs hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-5 h-5 rounded-full object-cover border border-white/60 shadow-xs group-hover:border-white"
                />
                <span>{cat.name}</span>
                <ArrowRight size={13} className="opacity-0 -ml-1.5 group-hover:opacity-100 group-hover:ml-0 transition-all text-white" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

