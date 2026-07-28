import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import type { Product } from '../../types'
import ProductCard from '../shop/ProductCard'
import { Skeleton } from '../ui/skeleton'

interface ProductSectionProps {
  title: string
  subtitle?: string
  badge?: string
  products: Product[]
  isLoading?: boolean
  viewAllLink?: string
  viewAllLabel?: string
  sectionId?: string
}

function ProductSkeleton() {
  return (
    <div className="premium-card">
      <Skeleton className="aspect-[3/4] w-full" style={{ background: 'linear-gradient(90deg, #E5E7EB 25%, #F3F4F6 50%, #E5E7EB 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-6 w-24" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-8 flex-1 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default function ProductSection({
  title,
  subtitle,
  badge,
  products,
  isLoading = false,
  viewAllLink = '/shop',
  viewAllLabel = 'View All',
  sectionId,
}: ProductSectionProps) {
  return (
    <section className="py-12 md:py-16 px-4 sm:px-6" id={sectionId}>
      <div className="container-brand">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          {badge && <span className="section-badge">{badge}</span>}
          <h2 className="section-heading">{title}</h2>
          {subtitle && <p className="section-subtitle mt-2 max-w-xl mx-auto">{subtitle}</p>}
          <div className="gold-divider" />
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
            : products.slice(0, 8).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
        </div>

        {/* View All Button */}
        {!isLoading && products.length > 0 && (
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link to={viewAllLink as any}>
              <button className="btn-outline-pink flex items-center gap-2 mx-auto">
                {viewAllLabel}
                <ArrowRight size={16} />
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
