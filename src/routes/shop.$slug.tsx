import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Star, Heart, Share2, ZoomIn, ShoppingBag, Plus, Minus } from 'lucide-react'
import { getProductBySlug, getRelatedProducts } from '../services/products'
import { formatPrice, formatDiscount, getImageUrl } from '../utils/format'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/shop/ProductCard'
import { Skeleton } from '../components/ui/skeleton'

export const Route = createFileRoute('/shop/$slug')({
  loader: async ({ context: { queryClient }, params: { slug } }) => {
    const product = await queryClient.ensureQueryData({
      queryKey: ['product', slug],
      queryFn: () => getProductBySlug(slug),
    })
    if (product) {
      await queryClient.ensureQueryData({
        queryKey: ['related', product.id, product.category_id],
        queryFn: () => getRelatedProducts(product.id, product.category_id || undefined),
      })
    }
  },
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, ' ')} — Sri Subhakari Fashions` },
    ],
  }),
  component: ProductDetailPage,
})

function ProductDetailPage() {
  const { slug } = Route.useParams()
  const [activeImg, setActiveImg] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  const [zoomed, setZoomed] = useState(false)
  const { addToCart } = useCart()

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug),
    staleTime: 0,
  })

  const { data: related } = useQuery({
    queryKey: ['related', product?.id, product?.category_id],
    queryFn: () => getRelatedProducts(product!.id, product!.category_id || undefined),
    enabled: !!product,
    staleTime: 30 * 1000,
  })

  if (isLoading) {
    return (
      <div className="container-brand px-4 sm:px-6 py-10">
        <div className="grid md:grid-cols-2 gap-10">
          <Skeleton className="aspect-[3/4] rounded-2xl" style={{ background: '#F3F4F6' }} />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" style={{ background: '#E5E7EB' }} />
            <Skeleton className="h-6 w-1/3" style={{ background: '#E5E7EB' }} />
            <Skeleton className="h-24 w-full" style={{ background: '#E5E7EB' }} />
            <Skeleton className="h-12 w-full rounded-full" style={{ background: '#E5E7EB' }} />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-32">
        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="font-heading text-2xl text-gray-600 mb-4">Product not found</h2>
        <Link to="/shop" className="btn-pink px-6 py-2.5 text-sm">
          Back to Shop
        </Link>
      </div>
    )
  }

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : (product.image_url ? [product.image_url] : ['/images/silk-saree.png'])
  const discount = product.offer_price ? formatDiscount(product.price, product.offer_price) : 0

  const isOutOfStock =
    product.status === 'out_of_stock' ||
    (product.stock_quantity !== undefined && product.stock_quantity !== null && product.stock_quantity <= 0) ||
    (product.stock !== undefined && product.stock !== null && product.stock <= 0) ||
    product.in_stock === false

  const categoryName =
    typeof product.category === 'object' && product.category
      ? product.category.name
      : (product.category || '')
  const categorySlug =
    typeof product.category === 'object' && product.category
      ? product.category.slug
      : (product.category ? product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '')

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <div style={{ background: 'var(--color-bg)' }}>
      <div className="container-brand px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6 font-nav">
          <Link to="/" className="hover:text-pink-500 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-pink-500 transition-colors">Shop</Link>
          <span>/</span>
          <span style={{ color: 'var(--color-pink)' }}>{product.name}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 mb-16">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <motion.div
              className="relative rounded-2xl overflow-hidden mb-4 cursor-zoom-in aspect-[3/4] bg-gray-50"
              style={{
                boxShadow: '0 8px 40px rgba(216,92,138,0.12)',
                border: '2px solid rgba(249,220,231,0.5)',
              }}
              onClick={() => setZoomed(!zoomed)}
            >
              <img
                src={getImageUrl(images[activeImg])}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-500 ${zoomed ? 'scale-125' : 'scale-100'} ${isOutOfStock ? 'grayscale-[20%]' : ''}`}
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&q=80'
                }}
              />
              <button className="absolute top-3 right-3 bg-white/80 p-2 rounded-full" aria-label="Zoom">
                <ZoomIn size={16} style={{ color: 'var(--color-pink)' }} />
              </button>
              {isOutOfStock ? (
                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-700 font-nav px-3 py-1 rounded-full shadow-md tracking-wider">
                  OUT OF STOCK
                </div>
              ) : discount > 0 ? (
                <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-700 font-nav px-2.5 py-1 rounded-full">
                  -{discount}% OFF
                </div>
              ) : null}
            </motion.div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-20 h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      activeImg === i ? 'scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                    style={activeImg === i ? { borderColor: 'var(--color-pink)' } : {}}
                  >
                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Category, Collections & SKU */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                {categoryName && (
                  <Link
                    to="/shop"
                    search={{ category: categorySlug || categoryName }}
                    className="font-nav text-xs font-700 uppercase tracking-wider px-3 py-1 bg-pink-50 text-pink-700 border border-pink-200 rounded-full hover:bg-pink-100 transition-colors"
                  >
                    🏷️ {categoryName}
                  </Link>
                )}
                {product.collections?.map((col) => (
                  <Link
                    key={col.id}
                    to="/shop"
                    search={{ collection: col.slug }}
                    className="font-nav text-xs font-700 tracking-wide px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full hover:bg-amber-100 transition-colors"
                  >
                    {col.badge || '✨'} {col.title}
                  </Link>
                ))}
              </div>
              {product.sku && (
                <span className="text-xs text-gray-400 font-nav">SKU: {product.sku}</span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-heading text-2xl md:text-3xl font-700 text-gray-800 mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Rating & Stock Status */}
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              {product.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={star <= Math.round(product.rating!) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">({product.review_count || 0} reviews)</span>
                </div>
              )}
              {isOutOfStock ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-nav font-700 bg-red-100 text-red-700">
                  Out of Stock
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-nav font-700 bg-green-100 text-green-700">
                  In Stock ({product.stock_quantity ?? product.stock ?? 'Available'})
                </span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5 pb-5 border-b" style={{ borderColor: 'var(--color-pink-light)' }}>
              <span className="font-price font-sans text-3xl font-bold" style={{ color: 'var(--color-pink)' }}>
                {formatPrice(product.offer_price || product.price)}
              </span>
              {product.offer_price && (
                <span className="font-price font-sans text-lg text-gray-400 line-through">{formatPrice(product.price)}</span>
              )}
              {discount > 0 && (
                <span className="font-price font-sans text-sm font-semibold text-emerald-600">
                  Save {formatPrice(product.price - product.offer_price!)} ({discount}% OFF)
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-gray-600 text-sm leading-relaxed mb-5">{product.description}</p>
            )}

            {/* Fabric */}
            {product.fabric && (
              <div className="mb-4">
                <span className="font-nav text-xs font-700 uppercase tracking-wide text-gray-500">Fabric: </span>
                <span className="text-sm text-gray-700">{product.fabric}</span>
              </div>
            )}

            {/* Colors */}
            {product.color && product.color.length > 0 && (
              <div className="mb-4">
                <p className="font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-2">
                  Color: <span className="text-gray-700 normal-case font-400">{selectedColor || product.color[0]}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.color.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className="px-3 py-1.5 rounded-full border text-xs font-nav font-600 transition-all"
                      style={{
                        borderColor: selectedColor === c || (!selectedColor && c === product.color![0]) ? 'var(--color-pink)' : 'var(--color-pink-light)',
                        background: selectedColor === c || (!selectedColor && c === product.color![0]) ? 'var(--color-pink)' : 'white',
                        color: selectedColor === c || (!selectedColor && c === product.color![0]) ? 'white' : 'var(--color-gray)',
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <p className="font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-2">Size:</p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className="w-12 h-10 rounded-xl border text-xs font-nav font-700 transition-all"
                      style={{
                        borderColor: selectedSize === size ? 'var(--color-pink)' : 'var(--color-pink-light)',
                        background: selectedSize === size ? 'var(--color-pink)' : 'white',
                        color: selectedSize === size ? 'white' : 'var(--color-gray)',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Quantity Selector & CTAs */}
            {!isOutOfStock && (
              <div className="mb-6">
                <p className="font-nav text-xs font-700 uppercase tracking-wide text-gray-500 mb-2">
                  Quantity:
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-12 text-center text-sm font-bold font-nav text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-xs text-gray-400 font-nav">
                    Total: <span className="font-semibold text-gray-700 font-price">{formatPrice((product.offer_price || product.price) * quantity)}</span>
                  </span>
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="space-y-3 mb-6">
              {isOutOfStock ? (
                <button
                  disabled
                  className="flex items-center justify-center gap-2.5 w-full text-base py-3.5 rounded-full bg-gray-200 text-gray-400 font-nav font-700 cursor-not-allowed border border-gray-300"
                >
                  Currently Out of Stock
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Add to Cart */}
                  <button
                    onClick={() => {
                      addToCart(product, {
                        quantity,
                        color: selectedColor,
                        size: selectedSize,
                      })
                    }}
                    className="btn-pink flex items-center justify-center gap-2.5 flex-1 text-base py-3.5 cursor-pointer shadow-lg shadow-pink-500/20"
                    id="add-to-cart-detail-btn"
                  >
                    <ShoppingBag size={18} />
                    <span>Add to Cart</span>
                  </button>

                  {/* Direct Enquire */}
                  <Link
                    to="/contact"
                    search={{ product: product.name }}
                    className="btn-outline-pink flex items-center justify-center gap-2 px-6 text-sm py-3.5"
                  >
                    <span>Enquire</span>
                  </Link>

                  {/* Wishlist & Share */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setWishlisted(!wishlisted)}
                      className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer"
                      style={{
                        borderColor: wishlisted ? 'var(--color-pink)' : 'var(--color-pink-light)',
                        background: wishlisted ? 'var(--color-pink-light)' : 'white',
                      }}
                      aria-label="Add to wishlist"
                    >
                      <Heart
                        size={18}
                        style={wishlisted ? { fill: 'var(--color-pink)', color: 'var(--color-pink)' } : { color: 'var(--color-gray)' }}
                      />
                    </button>
                    <button
                      onClick={() => navigator.share?.({ title: product.name, url: shareUrl })}
                      className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-pink-300 transition-colors"
                      aria-label="Share"
                    >
                      <Share2 size={16} style={{ color: 'var(--color-gray)' }} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Wash Care */}
            {product.wash_care && (
              <div className="rounded-xl p-4 text-sm" style={{ background: 'var(--color-pink-light)', border: '1px solid rgba(216,92,138,0.15)' }}>
                <p className="font-nav font-700 text-xs uppercase tracking-wide mb-1" style={{ color: 'var(--color-pink)' }}>
                  🧺 Wash Care
                </p>
                <p className="text-gray-600">{product.wash_care}</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related && related.length > 0 && (
          <section>
            <div className="text-center mb-8">
              <span className="section-badge">You May Also Like</span>
              <h2 className="section-heading">Related Products</h2>
              <div className="gold-divider" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
