import { motion, AnimatePresence } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { Heart, X, Trash2, ArrowRight, ShoppingBag } from 'lucide-react'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'
import { formatRupees } from '../../utils/whatsapp'
import { getImageUrl, formatDiscount } from '../../utils/format'

export default function WishlistDrawer() {
  const {
    items,
    totalItems,
    isWishlistOpen,
    closeWishlist,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist()

  const { addToCart } = useCart()

  const handleMoveToCart = (product: any) => {
    addToCart(product)
  }

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeWishlist}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            aria-label="Wishlist Drawer"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-[#1f0b24] text-white">
              <div className="flex items-center gap-2.5">
                <Heart size={20} className="fill-pink-400 text-pink-400" />
                <h2 className="font-heading text-lg font-bold text-white tracking-wide">
                  My Wishlist
                </h2>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-nav font-bold"
                  style={{ background: 'var(--color-pink)', color: 'white' }}
                >
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </span>
              </div>
              <button
                onClick={closeWishlist}
                className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                aria-label="Close wishlist"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                    style={{ background: 'var(--color-pink-light)' }}
                  >
                    <Heart size={36} style={{ color: 'var(--color-pink)' }} />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-gray-800 mb-2">
                    Your wishlist is empty
                  </h3>
                  <p className="text-gray-500 text-sm max-w-xs mb-6 font-body">
                    Explore our collection and click the heart icon to save your favorite sarees & dresses!
                  </p>
                  <Link
                    to="/shop"
                    onClick={closeWishlist}
                    className="btn-pink px-6 py-2.5 text-sm flex items-center gap-2"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((product) => {
                    const price = product.offer_price || product.price
                    const hasDiscount = Boolean(product.offer_price && product.offer_price < product.price)
                    const discount = hasDiscount ? formatDiscount(product.price, product.offer_price!) : 0
                    const image = Array.isArray(product.images) && product.images.length > 0
                      ? product.images[0]
                      : product.image_url
                    const productId = product.id || (product as any)._id || product.slug

                    return (
                      <div
                        key={productId}
                        className="flex gap-3.5 p-3 rounded-2xl border border-gray-100 bg-white hover:border-pink-200 transition-all shadow-xs"
                      >
                        {/* Product Thumbnail */}
                        <Link
                          to="/shop/$slug"
                          params={{ slug: product.slug }}
                          onClick={closeWishlist}
                          className="shrink-0 w-20 h-24 rounded-xl overflow-hidden bg-gray-50 border border-gray-100"
                        >
                          <img
                            src={getImageUrl(image)}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&q=70'
                            }}
                          />
                        </Link>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <Link
                                to="/shop/$slug"
                                params={{ slug: product.slug }}
                                onClick={closeWishlist}
                                className="font-heading text-sm font-bold text-gray-800 hover:text-pink-600 transition-colors line-clamp-1"
                              >
                                {product.name}
                              </Link>
                              <button
                                onClick={() => removeFromWishlist(productId)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                                aria-label="Remove from wishlist"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>

                            {/* Price info */}
                            <div className="mt-1 flex items-baseline gap-2">
                              <span
                                className="font-price text-sm font-bold"
                                style={{ color: 'var(--color-pink)' }}
                              >
                                {formatRupees(price)}
                              </span>
                              {hasDiscount && (
                                <>
                                  <span className="text-xs text-gray-400 line-through">
                                    {formatRupees(product.price)}
                                  </span>
                                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                    {discount}% OFF
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-50">
                            <button
                              onClick={() => {
                                handleMoveToCart(product)
                              }}
                              className="btn-pink py-1.5 px-3 text-xs flex-1 flex items-center justify-center gap-1.5 font-semibold"
                            >
                              <ShoppingBag size={13} />
                              <span>Add to Bag</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer actions when has items */}
            {items.length > 0 && (
              <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <button
                  onClick={clearWishlist}
                  className="text-xs text-gray-500 hover:text-red-600 transition-colors font-medium"
                >
                  Clear all items
                </button>
                <Link
                  to="/shop"
                  onClick={closeWishlist}
                  className="text-xs font-semibold hover:underline"
                  style={{ color: 'var(--color-pink)' }}
                >
                  Continue shopping &rarr;
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
