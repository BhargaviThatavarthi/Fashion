import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Heart, Star, Eye, ShoppingBag } from 'lucide-react'
import type { Product } from '../../types'
import { formatPrice, formatDiscount, getImageUrl } from '../../utils/format'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

interface ProductCardProps {
  product: Product
  index?: number
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist()
  const isWishlisted = isInWishlist(product.id)
  const [imgIndex, setImgIndex] = useState(0)
  const { addToCart } = useCart()

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : (product.image_url ? [product.image_url] : [])

  const mainImg = getImageUrl(product.image_url || images[0])
  const hoverImg = getImageUrl(images[1] || product.image_url || images[0] || '')

  const isOutOfStock =
    product.status === 'out_of_stock' ||
    (product.stock_quantity !== undefined && product.stock_quantity !== null && product.stock_quantity <= 0) ||
    (product.stock !== undefined && product.stock !== null && product.stock <= 0) ||
    product.in_stock === false

  const discount = product.offer_price
    ? formatDiscount(product.price, product.offer_price)
    : 0

  const categoryName =
    typeof product.category === 'object' && product.category
      ? product.category.name
      : (product.category || '')

  return (
    <motion.div
      className={`premium-card group ${isOutOfStock ? 'opacity-90' : ''}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
    >
      {/* Image Container */}
      <div
        className="product-img-zoom relative aspect-[3/4] overflow-hidden bg-gray-50"
        onMouseEnter={() => setImgIndex(1)}
        onMouseLeave={() => setImgIndex(0)}
      >
        <img
          src={imgIndex === 0 ? mainImg : hoverImg}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-500 ${isOutOfStock ? 'grayscale-[25%]' : ''}`}
          loading="lazy"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=70'
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {isOutOfStock ? (
            <span className="bg-red-600 text-white text-[10px] font-700 font-nav px-2.5 py-0.5 rounded-full shadow-md tracking-wider">
              OUT OF STOCK
            </span>
          ) : (
            <>
              {product.new_arrival && (
                <span
                  className="text-white text-[10px] font-700 font-nav px-2.5 py-0.5 rounded-full"
                  style={{ background: 'var(--color-pink)' }}
                >
                  NEW
                </span>
              )}
              {product.best_seller && (
                <span
                  className="text-white text-[10px] font-700 font-nav px-2.5 py-0.5 rounded-full"
                  style={{ background: 'var(--color-gold)' }}
                >
                  BESTSELLER
                </span>
              )}
              {discount > 0 && (
                <span className="bg-green-500 text-white text-[10px] font-700 font-nav px-2.5 py-0.5 rounded-full">
                  {discount}% OFF
                </span>
              )}
            </>
          )}
        </div>

        {/* Wishlist / Like Button */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.8 }}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleWishlist(product)
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-xs rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 hover:bg-white z-20 cursor-pointer pointer-events-auto"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={16}
            fill={isWishlisted ? 'var(--color-pink)' : 'none'}
            color={isWishlisted ? 'var(--color-pink)' : '#6B7280'}
            className={isWishlisted ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'}
          />
        </motion.button>

        {/* Quick View overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 z-10 pointer-events-none">
          <Link
            to="/shop/$slug"
            params={{ slug: product.slug }}
            className="bg-white text-gray-800 text-xs font-nav font-600 px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 hover:bg-gray-50 transition-colors pointer-events-auto"
          >
            <Eye size={13} />
            Quick View
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {categoryName && (
          <p
            className="font-nav text-[10px] font-600 uppercase tracking-widest mb-1.5"
            style={{ color: 'var(--color-gold)' }}
          >
            {categoryName}
          </p>
        )}

        {/* Name */}
        <Link to="/shop/$slug" params={{ slug: product.slug }}>
          <h3 className="font-heading font-600 text-gray-800 text-base leading-tight mb-1.5 hover:text-pink-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Fabric */}
        {product.fabric && (
          <p className="text-xs text-gray-400 mb-2">{product.fabric}</p>
        )}

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={11}
                  className={
                    star <= Math.round(product.rating!)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-200 fill-gray-200'
                  }
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">
              ({product.review_count || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-price font-sans text-lg font-bold" style={{ color: 'var(--color-pink)' }}>
            {formatPrice(product.offer_price || product.price)}
          </span>
          {product.offer_price && (
            <span className="font-price font-sans text-sm text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {isOutOfStock ? (
            <button
              disabled
              className="flex-1 text-center text-gray-400 bg-gray-100 text-xs font-nav font-600 py-2 rounded-full cursor-not-allowed border border-gray-200"
              title="This product is currently out of stock"
            >
              Out of Stock
            </button>
          ) : (
            <>
              <Link
                to="/shop/$slug"
                params={{ slug: product.slug }}
                className="flex-1 text-center text-xs font-nav font-600 py-2 rounded-full border transition-all duration-200 hover:border-pink-500 hover:text-pink-600"
                style={{
                  borderColor: 'var(--color-pink-light)',
                  color: 'var(--color-text-muted)',
                }}
              >
                Details
              </Link>
              <button
                onClick={() => addToCart(product)}
                className="flex items-center justify-center gap-1.5 text-white text-xs font-nav font-600 px-3.5 py-2 rounded-full transition-all duration-200 hover:opacity-90 cursor-pointer shadow-xs"
                style={{ background: 'var(--color-pink)' }}
                aria-label="Add to Cart"
              >
                <ShoppingBag size={13} />
                <span>Add</span>
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
