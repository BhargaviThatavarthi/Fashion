import { motion } from 'framer-motion'
import { CoverflowCarousel, type CoverflowSlide } from '@/components/ui/coverflow-carousel'

const CATEGORY_SLIDES: CoverflowSlide[] = [
  {
    src: '/images/cotton-saree.png',
    alt: 'Cotton Saree Collection',
    title: 'Cotton Saree',
    subtitle: 'Lightweight & Breathable Handloom Cotton Sarees',
    link: '/shop?category=cotton-sarees',
  },
  {
    src: '/images/silk-saree.png',
    alt: 'Silk Sarees Collection',
    title: 'Silk Sarees',
    subtitle: 'Pure Zari & Heritage Kanjivaram Silk Weaves',
    link: '/shop?category=silk-sarees',
  },
  {
    src: '/images/designer-saree.png',
    alt: 'Design Sarees Collection',
    title: 'Design Sarees',
    subtitle: 'Contemporary Embellished & Party Wear Sarees',
    link: '/shop?category=design-sarees',
  },
  {
    src: '/images/crape-saree.png',
    alt: 'Crape Sarees Collection',
    title: 'Crape Sarees',
    subtitle: 'Fluid Drapes & Soft Luxurious Crepe Chiffon',
    link: '/shop?category=crape-sarees',
  },
  {
    src: '/images/ethnic-top.png',
    alt: 'Tops Collection',
    title: 'Tops',
    subtitle: 'Trendy Ethnic & Fusion Designer Kurti Tops',
    link: '/shop?category=tops',
  },
  {
    src: '/images/leggings.png',
    alt: 'Legins Collection',
    title: 'Legins',
    subtitle: 'Premium Stretch & Comfortable Ethnic Leggings',
    link: '/shop?category=legins',
  },
]

export default function CategoryQuickNav() {
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
          <span className="section-badge">🛍️ BROWSE BY CATEGORY</span>
          <h2 className="section-heading mt-2">Shop by Category</h2>
          <p className="section-subtitle mt-2 max-w-md mx-auto">
            Explore our curated collections across all categories of traditional and modern ethnic wear.
          </p>
          <div className="gold-divider" />
        </motion.div>

        {/* 3D Coverflow Carousel Section */}
        <div className="w-full">
          <CoverflowCarousel
            slides={CATEGORY_SLIDES}
            cardWidth="clamp(170px, 25vw, 280px)"
            autoplay={true}
            autoplayInterval={3000}
            showCaption={true}
            showNavigation={true}
            showPagination={true}
          />
        </div>
      </div>
    </section>
  )
}
