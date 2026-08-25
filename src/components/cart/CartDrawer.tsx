import { motion, AnimatePresence } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { useCart } from '../../context/CartContext'
import { formatRupees, buildWhatsAppCartOrderUrl } from '../../utils/whatsapp'
import { getImageUrl } from '../../utils/format'

export default function CartDrawer() {
  const {
    items,
    totalItems,
    totalAmount,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
  } = useCart()

  const handleWhatsAppOrder = () => {
    if (items.length === 0) {
      alert('Your cart is empty.')
      return
    }
    const url = buildWhatsAppCartOrderUrl(items)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
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
            aria-label="Shopping Cart Drawer"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-[#1f0b24] text-white">
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={20} style={{ color: 'var(--color-gold)' }} />
                <h2 className="font-heading text-lg font-bold text-white tracking-wide">
                  Shopping Cart
                </h2>
                {totalItems > 0 && (
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-nav font-bold"
                    style={{ background: 'var(--color-pink)', color: 'white' }}
                  >
                    {totalItems} {totalItems === 1 ? 'item' : 'items'}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="p-1.5 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                aria-label="Close cart"
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
                    <ShoppingBag size={36} style={{ color: 'var(--color-pink)' }} />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-gray-800 mb-2">
                    Your cart is empty.
                  </h3>
                  <p className="text-gray-500 text-sm max-w-xs mb-6 font-body">
                    Discover our collection of handcrafted silk sarees, lehengas, and ethnic wear.
                  </p>
                  <Link
                    to="/shop"
                    onClick={closeCart}
                    className="btn-pink px-6 py-2.5 text-sm flex items-center gap-2"
                  >
                    <span>Browse Collection</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3.5 p-3 rounded-2xl border border-gray-100 bg-white hover:border-pink-200 transition-all shadow-xs"
                    >
                      {/* Product Thumbnail */}
                      <Link
                        to="/shop/$slug"
                        params={{ slug: item.slug }}
                        onClick={closeCart}
                        className="shrink-0 w-20 h-24 rounded-xl overflow-hidden bg-gray-50 border border-gray-100"
                      >
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
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
                              params={{ slug: item.slug }}
                              onClick={closeCart}
                              className="font-heading text-sm font-bold text-gray-800 hover:text-pink-600 transition-colors line-clamp-1"
                            >
                              {item.name}
                            </Link>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>

                          {/* Options if available */}
                          {(item.color || item.size) && (
                            <div className="flex gap-2 text-[11px] text-gray-500 mt-0.5 font-nav">
                              {item.color && <span>Color: {item.color}</span>}
                              {item.size && <span>• Size: {item.size}</span>}
                            </div>
                          )}

                          {/* Unit Price */}
                          <div className="mt-1">
                            <span
                              className="font-price text-xs font-semibold"
                              style={{ color: 'var(--color-pink)' }}
                            >
                              {formatRupees(item.price)}
                            </span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="font-price text-[11px] text-gray-400 line-through ml-1.5">
                                {formatRupees(item.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Stepper & Item Subtotal */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-1">
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50/50">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-pink-100 hover:text-pink-600 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              {item.quantity === 1 ? <Trash2 size={12} className="text-red-500" /> : <Minus size={12} />}
                            </button>
                            <span className="w-8 text-center text-xs font-semibold font-nav text-gray-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-pink-100 hover:text-pink-600 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-gray-400 block font-nav uppercase">Subtotal</span>
                            <span className="font-price text-sm font-bold text-gray-900">
                              {formatRupees(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-gray-100 bg-gray-50/60 space-y-3">
                {/* Price Breakdown */}
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-600 font-nav text-xs">
                    <span>Total Items</span>
                    <span className="font-semibold text-gray-800">{totalItems}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-1 border-t border-gray-200/60">
                    <span className="font-heading font-bold text-gray-900 text-base">
                      Total Amount
                    </span>
                    <span
                      className="font-price font-bold text-xl"
                      style={{ color: 'var(--color-pink)' }}
                    >
                      {formatRupees(totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Primary CTA: Order on WhatsApp */}
                <button
                  onClick={handleWhatsAppOrder}
                  className="btn-whatsapp w-full py-3.5 flex items-center justify-center gap-2.5 text-base shadow-lg shadow-green-500/20 font-nav font-bold cursor-pointer"
                  id="drawer-order-on-whatsapp-btn"
                >
                  <FaWhatsapp size={20} />
                  <span>Order on WhatsApp</span>
                </button>

                {/* View Full Cart Page Link */}
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="w-full py-2.5 rounded-full border border-gray-300 text-gray-700 hover:border-pink-400 hover:text-pink-600 font-nav text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors bg-white"
                >
                  <span>View Full Cart Page</span>
                  <ArrowRight size={14} />
                </Link>

                {/* Trust Note */}
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 font-nav pt-1">
                  <ShieldCheck size={14} className="text-green-600" />
                  <span>Direct order with store • No payment upfront</span>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
